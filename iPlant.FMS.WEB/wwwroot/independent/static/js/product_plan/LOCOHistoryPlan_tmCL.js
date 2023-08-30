require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/cross2.js', '../static/utils/js/charf.js', '../static/utils/js/base/jquery.treeview'], function ($zace, $com, $cross, $charf, $tree) {

    var KEYWORD_Level_LIST,
        KEYWORD_Level,
        FORMATTRT_Level,
        DEFAULT_VALUE_Level,
        TypeSource_Level,
        wDataDone,
        wDataUnDone,
        wDataSend,
        wFlowType,
        wFlowID,
        model,
        DataAll,
        DATABasic,
        DataAllConfirm,
        DataAllSearch,
        LoginID,
        HTML;
    var styleControl = undefined;
    DataAll = [];
    DATABasic = [];
    DataAllConfirm = [];
    DataAllSearch = [];
    mTypeDone = 1;
    PositionTemp = {
        ID: 0,
        ProductID: 0,
        ProductNo: '',
        PartNo: '',
        ArrivedTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        DepartureTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Creator: window.parent.User_Info.Name,
        CreatorID: 0,
        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Editor: window.parent.User_Info.Name,
        EditorID: 0,
        ID: 0,
        Status: 1,
        StatusText: "",
    };
    var StatusColor = ['black', 'black', '#fa1ff4c9', 'blue', '#a94442', 'green', 'red', '#f8391bc9', 'blue', '#e6c685', 'orange'];//'#00CCFF' 完工
    mAPSShiftPeriod = 5;
    mStartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date().getTime() - 7 * 24 * 3600000);
    mEndTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date().getTime() + 7 * 24 * 3600000);

    mOrderIDShow = 0;
    mZaceEndTime = $com.util.format('yyyy-MM-dd', new Date().getTime() + 7 * 24 * 3600000);
    mZaceStartTime = $com.util.format('yyyy-MM-dd', new Date().getTime() - 15 * 24 * 3600000);


    mStationlist = [];//排程计划表
    mTableData = [];//排程计划表
    mApsList = [];
    mOrderList = [];
    ProcessInstanceID = 0;
    var PropertyBasic = [{
        Name: '单据编号',
        TiTle: 'Code',
        Value: '',
    }, {
        Name: '申请人',
        TiTle: 'UpFlowName',
        Value: '',
    }, {
        Name: '申请时间',
        TiTle: 'CreateTime',
        Value: '',
    }, {
        Name: '任务更新时刻',
        TiTle: 'SubmitTime',
        Value: '',
    }];
    var PropertyBusiness = [{
        Name: '版本号',
        TiTle: 'VersionNo',
        Value: '',
    }, {
        Name: '备注',
        TiTle: 'Remark',
        Value: '',
    }];
    HTML = {
        IMG: ['<li class="upload-img" style="float: left;"><div class="DIVImg" style="display: inline-block;position: relative;top: -7px;left: -12px;width: 20px;height: 20px; background-color: white;border-radius: 50%;"><img src="../static/images/checkbox/error.png" style="width: 20px;height: 20px;"></div><img  class="ShowImg"  src="{{Src}}" data-source="{{Src}}"  data-id="{{Id}}" style="float: left;width: 30px;height: 30px;margin: 2px;"> ',

            '</li>',
        ].join(""),
        ButtonMode: [
            ' <button type="button"  class="btn zaceStatusCommit ds-bpm-btn lmvt-def-btn"  data-prop="{{Name}}" data-valueText="{{Text}}" data-value="{{Value}}">',
            '  <span class="glyphicon " aria-hidden="true"></span>{{Text}}',
            ' </button>',
        ].join(""),
        TableMode: [
            '<tr>',
            //'<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            //'<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td   data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td data-title="PartNo" data-value="{{PartNo}}" >{{PartNo}}</td>',
            '<td data-title="OrderID" data-value="{{OrderID}}" >{{OrderID}}</td>',
            '<td data-title="LineID" data-value="{{LineID}}" >{{LineID}}</td>',
            '<td data-title="PartID" data-value="{{PartID}}" >{{PartID}}</td>',

            '<td data-title="StartTime" data-value="{{StartTime}}" >{{StartTime}}</td>',
            '<td data-title="EndTime" data-value="{{EndTime}}" >{{EndTime}}</td>',

            '<td style="color:{{StatusColorText}}" data-title="Status" data-value="{{Status}}" >{{Status}}</td>',
            '</tr>',
        ].join(""),

        TableModeCommit: [
            '<tr>',
            '<td  style="min-width: 50px;display:none" data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td style="min-width: 50px;display:none" data-title="StepID" data-value="{{StepID}}">{{StepID}}</td> ',
            '<td data-title="Code" data-value="{{Code}}" >{{Code}}</td>',
            '<td data-title="UpFlowName" data-value="{{UpFlowName}}" >{{UpFlowName}}</td>',
            '<td data-title="CreateTimeText" data-value="{{CreateTimeText}}" >{{CreateTimeText}}</td>',
            '<td data-title="SubmitTime" data-value="{{SubmitTime}}" >{{SubmitTime}}</td>',
            '<td data-title="Status" data-value="{{Status}}" data-version="{{VersionID}}" >{{StatusText}}</td>',
            '<td style="min-width: 30px;max-width: 120px;" data-title="VersionID" data-value="{{VersionID}}"><div class="td-contain"><span class="td-contain-list" id="cby-add-bill" >计划详情</span> </div> </td>  ',
            '<td style="min-width: 30px;max-width: 120px;" data-title="#" data-value="#"><div class="td-contain"><span class="td-contain-list" id="cby-add-pencil" >办理任务</span> </div> </td>  ',
            '</tr>',
        ].join(""),

        TableModeCommitDetail: [
            '<tr>',
            '<td  style="min-width: 50px;display:none" data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td style="min-width: 50px;display:none" data-title="StepID" data-value="{{StepID}}">{{StepID}}</td> ',
            '<td data-title="Code" data-value="{{Code}}" >{{Code}}</td>',
            '<td data-title="UpFlowName" data-value="{{UpFlowName}}" >{{UpFlowName}}</td>',
            '<td data-title="SubmitTime" data-value="{{SubmitTime}}" >{{SubmitTime}}</td>',
            '<td data-title="CreateTimeText" data-value="{{CreateTimeText}}" >{{CreateTimeText}}</td>',
            '<td data-title="StatusText" data-value="{{StatusText}}" >{{StatusText}}</td>',
            '<td style="min-width: 30px;max-width: 120px;" data-title="VersionID" data-value="{{VersionID}}"><div class="td-contain"><span class="td-contain-list" id="cby-add-bill" >计划详情</span> </div> </td>  ',
            '<td style="min-width: 30px;max-width: 120px;" data-title="#" data-value="#"><div class="td-contain"><span class="td-contain-list" id="cby-add-pencilDetail" >任务详情</span> </div> </td>  ',
            '</tr>',
        ].join(""),

        ImgList: [
            '<img class="ShowImg" src="{{Value}}" data-source="{{Value}}"  data-id="{{Value}}" style="width: 30px;height: 30px;margin: 2px;"></img>',
        ],
        ReadOnlyOneImg: [
            '<div  class="TempTable" style=" display: flex;width: 100%;float: left;">',
            '<div class="FieldName" style="width: 19.5%;"><span class="ContentshowName">{{Name}}</span></div>',
            '<div class="FieldContentOne" style="width: 80.5%;padding:0px"><div style="margin-left: 2.8%;">{{ImgList}}</div></div>',
            '</div>',
        ].join(""),
        ReadOnlyImg: [
            '<div class="TempTable">',
            '<div class="FieldName" style="width: 39%;"><span class="ContentshowName">{{Name}}</span></div>',
            '<div class="FieldContentTwo" style="padding:0px"><div style="margin-left: 7%;">{{ImgList}}</div></div>',
            '</div>',
        ].join(""),
        ReadOnlyTwo: [
            '<div class="TempTable">',
            '<div class="FieldName" style="width: 39%;"><span class="ContentshowName">{{Name}}</span></div>',
            '<div class="FieldContentTwo"><span class="Contentshow">{{Value}}</span></div>',
            '</div>',
        ].join(""),
        ReadOnlyOne: [
            '<div  class="TempTable" style=" display: flex;width: 100%;float: left;">',
            '<div class="FieldName" style="width: 19.5%;"><span class="ContentshowName">{{Name}}</span></div>',
            '<div class="FieldContentOne" style="width: 80.5%;"><span class="Contentshow" style="margin-left: 1.8%;">{{Value}}</span></div>',
            '</div>',
        ].join(""),

        Photo: [
            '<div class="lmvt-show-photo" style="position: fixed;z-index: 2001;top: 0;right: 0;left: 0;bottom: 0;background: rgba(0, 0, 0, 0.5);text-align: center">',
            '<svg t="1562913698052" class="lmvt-remove-photo" style="position:absolute;top:10;right:10" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2620" width="50" height="50"><path d="M684.642617 277.598412l-1.436722-1.467421c-12.489452-12.461823-32.730449-12.461823-45.159526 0L479.700991 434.510138l-158.286026-158.315702c-12.555967-12.524245-32.793894-12.524245-45.225017 0-12.555967 12.462846-12.555967 32.701796 0 45.223994l158.348448 158.317749L276.129573 638.049834c-12.495592 12.429077-12.495592 32.671097 0 45.163619l1.49812 1.434675c12.429077 12.494569 32.66905 12.494569 45.221948 0l158.287049-158.286026 158.283979 158.286026c12.491499 12.494569 32.731472 12.494569 45.220924 0 12.495592-12.493545 12.495592-32.731472 0-45.222971l-158.285003-158.285003 158.285003-158.314679C697.138209 310.299185 697.138209 290.060235 684.642617 277.598412" p-id="2621" fill="#e6e6e6"></path><path d="M818.88197 140.522454c-187.332573-187.363272-491.033479-187.363272-678.364005 0-187.329503 187.329503-187.329503 491.032456 0 678.362982 187.330526 187.392948 491.031433 187.392948 678.364005 0C1006.274918 631.55491 1006.274918 327.851956 818.88197 140.522454M773.656953 773.660418c-162.344458 162.343435-425.569512 162.407903-587.914994 0-162.40688-162.344458-162.40688-425.602258 0-587.914994 162.344458-162.40688 425.569512-162.40688 587.914994 0C936.063833 348.059184 936.000388 611.31596 773.656953 773.660418" p-id="2622" fill="#e6e6e6"></path></svg>',
            '<div data-index="0" class="lmvt-change-photo" style="position: fixed;top: 60px;right: 60px;left: 60px;bottom: 60px;background-size:100% 100%;width: auto;height: auto;">',
            // '<img class="zacelmvt-img" style="position: fixed;top: 60px;right: 60px;left: 60px;bottom: 60px;background-size:auto 100%;width: auto;height: auto;" />',
            '</div>',
            '<div class="lmvt-bottom">',
            '<div class="lmvt-bottom-left">',
            '<svg t="1562913570901" class="icon" style="float:left;margin-left:10px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1103" width="30" height="30">',
            '<path d="M512 0a512 512 0 1 0 512 512 512 512 0 0 0-512-512z m0 896a384 384 0 1 1 384-384 384 384 0 0 1-384 384z" fill="#e6e6e6" p-id="1104"></path>',
            '<path d="M493.44 247.04a64 64 0 0 0-90.88 90.88L576 512l-173.44 174.08a64 64 0 0 0 90.88 90.88l219.52-219.52a64 64 0 0 0 0-90.88z" fill="#e6e6e6" p-id="1105"></path></svg>',
            '</div>',
            '<div class="lmvt-bottom-right">',
            '<svg t="1562912869524" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" ',
            ' p-id="1469" width="30" style="float:right;margin-right:10px" height="30"><path d="M512 0a512 512 0 1 0 512 512 512 512 0 0 0-512-512z m0 896a384 384 0 1 1 384-384 384 384 0 0 1-384 384z" ',
            ' fill="#e6e6e6" p-id="1470"></path><path d="M616.96 272.64a58.24 58.24 0 0 0-81.92 0l-198.4 198.4a58.88 58.88 0 0 0 0 81.92l198.4 198.4a58.24 58.24 0 1 0 81.92-81.92L459.52 512l157.44-157.44a58.24 58.24 0 0 0 0-81.92z" fill="#e6e6e6" p-id="1471"></path></svg>',
            '</div>',
            '</div>',
            '</div>',
        ].join(""),
    };
    (function () {
        KEYWORD_Level_LIST = [
            "ProductID|车型|ArrayOne",
            "OrderID|订单|ArrayOne",
            "LineID|修程|ArrayOne",
            "PartID|工位|ArrayOne",
            "PartNo|车号",

            "OrderIDShow|台车|ArrayOne",
            "mStartTime|开始时间|Date",
            "mEndTime|结束时间|Date",
            "mAPSShiftPeriod|计划|ArrayOne",
            "Status|状态|ArrayOne",
            "StartTime|开始时间|Date",
            "EndTime|结束时间|Date",

        ];
        KEYWORD_Level = {};
        FORMATTRT_Level = {};

        DEFAULT_VALUE_Level = {
            ProductID: 0,
            PartNo: '',
            // ArrivedTime:$com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
            // DepartureTime:$com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),        
            Status: 1,
        };

        TypeSource_Level = {
            OrderIDShow: [],
            Active: [
                {
                    name: "启用",
                    value: 1
                }, {
                    name: "禁用",
                    value: 0
                }
            ],
            mAPSShiftPeriod: [
                {
                    name: "周计划",
                    value: 5
                }, {
                    name: "周计划",
                    value: 6
                }
            ],
            Status: [
                {
                    name: "默认",
                    value: 0
                },
                {
                    name: "保存",
                    value: 1
                }, {
                    name: "下达",
                    value: 2
                }, {
                    name: "已确认",
                    value: 3
                }, {
                    name: "开工",
                    value: 4
                },
                {
                    name: "完工",
                    value: 5
                },
                {
                    name: "暂停",
                    value: 6
                },
                {
                    name: "终止",
                    value: 7
                },
                {
                    name: "提交",
                    value: 8
                },
                {
                    name: "待审批",
                    value: 9
                },
                {
                    name: "已审批",
                    value: 10
                }, {
                    name: "已撤销",
                    value: 11
                }, {
                    name: "待互检",
                    value: 12
                }, {
                    name: "已驳回",
                    value: 13
                }],

            ProductID: [],
            PartID: [],
            LineID: [],
            OrderID: [],



        };

        $.each(KEYWORD_Level_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD_Level[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_Level[detail[0]] = $com.util.getFormatter(TypeSource_Level, detail[0], detail[2]);
            }
        });
    })();


    model = $com.Model.create({
        name: 'GZLOCO',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            //节点隐藏
            $("body").delegate("#lmvt-type-back", "click", function () {
                $(".bottom").hide();
                $(".cby-charf-detail-item").css("border", "1px solid rgb(218, 218, 218)")
            });
            //查看节点详情
            $("body").delegate(".cby-charf-detail-item", "click", function () {
                $(".bottom").show();
                $this = $(this);
                $this.css("border", "5px solid orange");
                $this.siblings().css("border", "1px solid rgb(218, 218, 218)");
                HisTaskID = $this.attr("data-historytaskid");
                var DetailList = [];
                var HisTaskName = "";
                for (var i = 0; i < wHisTaskList.length; i++) {
                    if (wHisTaskList[i].ID == HisTaskID) {
                        HisTaskName = wHisTaskList[i].Name;
                    }
                    if (wHisTaskList[i].ID == HisTaskID && wHisTaskList[i].HisTaskVarinstList.length > 0) {
                        for (var k = 0; k < wHisTaskList[i].HisTaskVarinstList.length; k++) {
                            if (wHisTaskList[i].HisTaskVarinstList[k]._BPMActivitiForm.IsWritable && wHisTaskList[i].HisTaskVarinstList[k].Value.length != 0) {
                                if (isNaN(wHisTaskList[i].HisTaskVarinstList[k].Value)) {
                                    if (wHisTaskList[i].HisTaskVarinstList[k].Value.trim().length != 0) {
                                        DetailList.push({
                                            Name: wHisTaskList[i].HisTaskVarinstList[k]._BPMActivitiForm.Name,
                                            Value: wHisTaskList[i].HisTaskVarinstList[k].ValueText
                                        })
                                    }
                                } else {
                                    DetailList.push({
                                        Name: wHisTaskList[i].HisTaskVarinstList[k]._BPMActivitiForm.Name,
                                        Value: wHisTaskList[i].HisTaskVarinstList[k].ValueText
                                    })
                                }
                            }
                        }
                    }
                }
                $(".BasicTableDeatil .FieldContentOne .Contentshow").text(HisTaskName);
                if (DetailList.length % 2 == 0) {

                    $(".TableContentBasicDeatil .BasicTable").html($com.util.template(DetailList, HTML.ReadOnlyTwo));

                } else {
                    var DateTwo = [];
                    var DateOne = DetailList[DetailList.length - 1];
                    for (var i = 0; i < DetailList.length - 1; i++) {
                        DateTwo.push(DetailList[i]);
                    }
                    $(".TableContentBasicDeatil .BasicTable").html($com.util.template(DateTwo, HTML.ReadOnlyTwo) + $com.util.template(DateOne, HTML.ReadOnlyOne));

                }
            });
            //待办实时流程图
            $("body").delegate(".commit_route", "click", function () {

                var $src = $com.imageUrl + "/MESBPM/api/Repository/getRealFlowChart?processInstanceId=" + ProcessInstanceID;
                $("#cby-route-charf-ontask img").attr("src", $src);


                model.com.imgShow("#outerdiv", "#innerdiv", "#bigimg", $("#cby-route-charf-ontask img"));

                //$("#cby-table").hide();
            });
            //返回待办任务
            $("body").delegate("#cby-return-ontask", "click", function () {
                $("#cby-route-charf-ontask").hide();
            });

            //提交
            $("body").delegate(".zaceStatusCommit.ds-bpm-btn", "click", function () {
                $com.app.loading("提交中!");
                var $this = $(this);
                mCloneData[$this.attr("data-prop")] = Number($this.attr("data-value"));
                var _text = $this.attr("data-valueText");

                model.com.addCheck(_text);
            });

            // 待办
            $("body").delegate("#zace-undone", "click", function () {
                $('.zacePlanCommitDone').hide();
                $('.zacePlanCommit').show();
                $('.zacePencil').hide();
                $('.zacePencilDone').hide();
                $('.zacePlanTableAll').hide();
                $('.zacePlanTable').hide();
                $('.ganteTable').hide();
                $('.zacePlanTableRecord').hide();
                $(".zacePlanSend").hide();
                mTypeDone = 1;
                model.com.refreshCommitTable(mZCommitStartTime, mZCommitEndTime);
            });
            // 已办
            $("body").delegate("#zace-done", "click", function () {
                $('.zacePlanCommitDone').show();
                $('.zacePlanCommit').hide();
                $('.zacePencil').hide();
                $('.zacePencilDone').hide();
                $('.zacePlanTableAll').hide();
                $('.zacePlanTable').hide();
                $('.ganteTable').hide();
                $('.zacePlanTableRecord').hide();
                $(".zacePlanSend").hide();
                mTypeDone = 2;
                model.com.refreshCommitTableDone(mZCommitStartTime, mZCommitEndTime);
            });
            // 发起
            $("body").delegate("#zace-Send", "click", function () {
                $(".zacePlanSend").show();
                $('.zacePlanCommitDone').hide();
                $('.zacePlanCommit').hide();
                $('.zacePencil').hide();
                $('.zacePencilDone').hide();
                $('.zacePlanTableAll').hide();
                $('.zacePlanTable').hide();
                $('.ganteTable').hide();
                $('.zacePlanTableRecord').hide();
                mTypeDone = 3;
                model.com.refreshSend(mZCommitStartTime, mZCommitEndTime);
            });

            //  周计划处理信息 返回
            $("body").delegate("#zace-exportApproval-commitReturn", "click", function () {

                $('.zacePencil').hide();
                $('.zacePencilDone').hide();
                $('.zacePlanTableAll').hide();
                $('.zacePlanTable').hide();
                $('.ganteTable').hide();
                $('.zacePlanTableRecord').hide();

                if (mTypeDone == 1) {
                    $('.zacePlanCommit').show();
                    $('.zacePlanCommitDone').hide();
                    $(".zacePlanSend").hide();
                    model.com.refreshCommitTable(mZCommitStartTime, mZCommitEndTime);
                } else if (mTypeDone == 2) {
                    $('.zacePlanCommit').hide();
                    $('.zacePlanCommitDone').show();
                    $(".zacePlanSend").hide();
                    model.com.refreshCommitTableDone(mZCommitStartTime, mZCommitEndTime);
                } else if (mTypeDone == 3) {
                    $('.zacePlanCommit').hide();
                    $('.zacePlanCommitDone').hide();
                    $(".zacePlanSend").show();
                    model.com.refreshSend(mZCommitStartTime, mZCommitEndTime);
                }

            });

            //周计划排程详情
            $("body").delegate("#cby-add-bill", "click", function () {

                var $this = $(this);
                var $table = $this.closest("tr");
                var WID = Number($table.find('td[data-title=VersionID]').attr('data-value'));

                var Selection_Data = VersionSource.filter((item) => { return item.ID == WID }),
                    WorkShopID = !Selection_Data[0].WorkShopID ? 1 : Selection_Data[0].WorkShopID;

                var ISMove = true;
                if (Selection_Data[0].Status != 1 || new Date().getTime() >= new Date(Selection_Data[0].EndTime).getTime()) {
                    ISMove = false;
                }

                var vdata = { 'header': '周计划详情', 'href': './product_plan/ReSetPlanReadOnly.html?ID=' + Selection_Data[0].ID + "&VersionNo=" + Selection_Data[0].VersionNo + "&WorkShopID=" + Selection_Data[0].WorkShopID + "&ISMove=" + ISMove, 'id': 'ReSetPlanReadOnly', 'src': '/MESCore/upload/image/生产排程.png' };
                window.parent.iframeHeaderSet(vdata);
                window.callFunctionTrigger("RanderGantt", { ID: Selection_Data[0].ID, VersionNo: Selection_Data[0].VersionNo, WorkShopID: WorkShopID, ISMove: ISMove });
            });
            // 处理任务
            $("body").delegate("#cby-add-pencil", "click", function () {

                var $this = $(this);
                var $table = $this.closest("tr");
                var WID = Number($table.find('td[data-title=ID]').attr('data-value'));
                mQueryTaskID = Number($table.find('td[data-title=StepID]').attr('data-value'));
                var Status = Number($table.find('td[data-title=Status]').attr('data-value'));
                var wVersion = Number($table.find('td[data-title=Status]').attr('data-version'));
                $('.zacePlanTable').hide();
                $('.zacePlanCommit').hide();
                $('.zacePlanCommitDone').hide();
                $(".zacePlanSend").hide();
                $('.zacePencil').show();
                $('.zacePencilDone').hide();
                $('.ganteTable').hide();
                $('.zacePlanTableRecord').hide();
                if (Status == 1) {
                    $('.zacePlanCommitDone').show();
                    $('.zacePencil').hide();
                    var Selection_Data = VersionSource.filter((item) => { return item.ID == wVersion }),
                        WorkShopID = Selection_Data[0].WorkShopID;

                    var ISMove = true;
                    if (Selection_Data[0].Status == 1 || new Date().getTime() >= new Date(Selection_Data[0].EndTime).getTime()) {
                        ISMove = false;
                    }

                    var vdata = { 'header': '周计划详情', 'href': './product_plan/ReSetPlanBPM.html?ID=' + Selection_Data[0].ID + "&VersionNo=" + Selection_Data[0].VersionNo + "&WorkShopID=" + Selection_Data[0].WorkShopID + "&ISMove=" + ISMove + "&queryTaskid=" + mQueryTaskID + "&taskid=" + WID, 'id': 'ReSetPlanBPM', 'src': './static/images/menu/newfactoryModel/techniquePart.png' };
                    window.parent.iframeHeaderSet(vdata);
                    window.callFunctionTrigger("RanderGantt", { ID: Selection_Data[0].ID, VersionNo: Selection_Data[0].VersionNo, WorkShopID: WorkShopID, ISMove: ISMove });
                    $("#zace-undone").click();
                } else {
                    model.com.refreshTablePencil(WID);
                }

            });
            // 查看详情
            $("body").delegate("#cby-add-pencilDetail", "click", function () {

                var $this = $(this);
                var $table = $this.closest("tr");
                var WID = Number($table.find('td[data-title=ID]').attr('data-value'));

                $('.zacePlanTable').hide();
                $('.zacePlanCommit').hide();
                $('.zacePlanCommitDone').hide();
                $(".zacePlanSend").hide();
                $('.zacePencil').hide();
                $('.zacePencilDone').show();
                $(".bottom").hide();
                for (var i = 0; i < wUser.length; i++) {
                    if (wUser[i].LoginID == window.parent.User_Info.LoginID) {
                        LoginID = wUser[i].ID;
                    }
                }
                model.com.refreshTablePencilDetail(WID);
            });
            //已办 刷新
            $("body").delegate("#zace-refresh-Done", "click", function () {
                model.com.refreshCommitTableDone();
            });
            //待办 刷新
            $("body").delegate("#zace-refresh-UnDone", "click", function () {
                model.com.refreshCommitTable();
            });
            //发起 刷新
            $("body").delegate("#zace-refresh-Send", "click", function () {
                model.com.refreshSend();
            });

            //Enter触发模糊查询事件  已办
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var $this = $(this),
                        value = $("#zace-search-done").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-zacePlanCommitDone-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-zacePlanCommitDone-tbody"), wDataDone, value, "ID");
                }
            });
            //查询  已办
            $("body").delegate("#zace-searchDone", "click", function () {

                var $this = $(this),
                    value = $("#zace-search-done").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-zacePlanCommitDone-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-zacePlanCommitDone-tbody"), wDataDone, value, "ID");
            });


            //Enter触发模糊查询事件  待办
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var $this = $(this),
                        value = $("#zace-search-undone").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-zacePlanCommit-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-zacePlanCommit-tbody"), wDataUnDone, value, "ID");
                }
            });
            //查询  待办
            $("body").delegate("#zace-searchUndone", "click", function () {

                var $this = $(this),
                    value = $("#zace-search-undone").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-zacePlanCommit-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-zacePlanCommit-tbody"), wDataUnDone, value, "ID");
            });

            //Enter触发模糊查询事件  发起
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var $this = $(this),
                        value = $("#zace-search-send").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-zacePlanSend-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-zacePlanSend-tbody"), wDataSend, value, "ID");
                }
            });
            //查询  发起
            $("body").delegate("#zace-searchSend", "click", function () {

                var $this = $(this),
                    value = $("#zace-search-send").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-zacePlanSend-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-zacePlanSend-tbody"), wDataSend, value, "ID");
            });

            //撤销
            $("body").delegate("#commit_cancel", "click", function () {
                if (!confirm("确定撤销周计划吗？")) {
                    return;
                }
                model.com.deleteProcessInstance({
                    processInstanceId: wFlowID, deleteReason: "申请撤销", ID: wInfo.ID, FlowType: wFlowType
                }, [function (res) {
                    $("#zace-exportApproval-commitReturn").click();
                }, function (res2) {
                    $("#zace-exportApproval-commitReturn").click();
                }]);
            });

        },

        run: function () {

            mQueryTaskID = 0;

            //修程
            model.com.getFMCLine({ FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0 }, function (resP) {
                if (!resP)
                    return;

                $.each(resP.list, function (i, item) {
                    TypeSource_Level.LineID.push({
                        value: item.ID,
                        name: item.Name
                    });
                });
                //工位
                model.com.getFPCPart({ FactoryID: 0, BusinessUnitID: 0 }, function (resP) {
                    if (!resP)
                        return;

                    $.each(resP.list, function (i, item) {
                        TypeSource_Level.PartID.push({
                            value: item.ID,
                            name: item.Name
                        });
                    });
                    //订单
                    model.com.getOMSOrder({}, function (resP) {
                        if (!resP)
                            return;

                        $.each(resP.list, function (i, item) {
                            TypeSource_Level.OrderID.push({
                                value: item.ID,
                                name: item.OrderNo
                            });

                            if (item.Status != 8) {

                                if (item.PartNo.length < 1) {
                                    item.ZaceName = item.OrderNo;
                                } else {
                                    item.ZaceName = item.PartNo;
                                }
                                TypeSource_Level.OrderIDShow.push({
                                    value: item.ID,
                                    name: item.ZaceName
                                });
                            }
                        });

                        if (TypeSource_Level.OrderIDShow.length > 0) {
                            mOrderIDShow = TypeSource_Level.OrderIDShow[0].value;
                        }

                        mZCommitStartTime = $com.util.format("yyyy-MM-dd", new Date().getTime() - 4 * 1000 * 3600 * 24);
                        mZCommitEndTime = $com.util.format("yyyy-MM-dd", new Date());
                            
                        wUser = [];
                        mUserObj = {};
                        model.com.getUser({}, function (res) {

                            $.each(res.list, function (i, item) {
                                mUserObj[item.ID] = item.Name;
                                if (item.Active == 1) {
                                    wUser.push(item);
                                }

                            });
                            model.com.refreshCommitTable(mZCommitStartTime, mZCommitEndTime);
                        });
                        model.com.SchedulingVersion();

                    });
                });
            });

        },


        com: {
            SchedulingVersion: function () {
                model.com.getSchedulingVersionAll({ APSShiftPeriod: 5, StartTime: "2000-1-1", EndTime: "2000-1-1", WorkShopID: 1 }, function (res) {
                    if (!res)
                        return;
                    if (res && res.list) {
                        VersionSource = $com.util.Clone(res.list);
                    }
                });
            },

            addCheck: function (Text) {
                _listCommitObj = $com.util.Clone(mCloneData);
                // _listCommitObj.VersionNo = mVersionNo;
                _listCommitObj.WeekPlanRemark = $('.Write-content-WeekPlanRemark').val();//状态根据流程引擎节点来
                _listCommitObj.WeekPlanRemark_txt_ = $('.Write-content-WeekPlanRemark').val();//状态根据流程引擎节点来

                $com.util.deleteLowerProperty(_listCommitObj);
                $com.app.loaded();
                if (!confirm("确定" + Text + "周计划吗？")) {
                    return;
                }
                $com.app.loading("提交中!");
                model.com.postTask({ "TaskID": Todotasks.ID, "data": _listCommitObj }, [function (res) {
                    $com.app.loaded();
                    var currentTask = res.list;
                    $("#zace-exportApproval-commitReturn").click();
                    if (mQueryTaskID > 0) {
                        $("#zace-done").click();
                    }
                }, function (res1) {
                    $com.app.loaded();
                    $("#zace-exportApproval-commitReturn").click();

                }]);

            },
            //查看版本列表
            getSchedulingVersionAll: function (data, fn, context) {
                var d = {
                    $URI: "/SchedulingVersion/All",
                    $TYPE: "get",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            deleteProcessInstance: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESAPS",
                    $URI: "/Runtime/deleteProcessInstance",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getEmployeeInfo: function (data, fn, context) {
                var d = {
                    $URI: "/APSSchedulingVersionBPM/Info",
                    $TYPE: "get",
                    $SERVER: "/MESAPS"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //流程引擎 审批
            refreshCommitTableDone: function (StartTime, EndTime) {
                $com.app.loading();

                model.com.getEmployeeAll({
                    TagTypes: 4,  //1  处理  2：发起   4  审批
                    StartTime: StartTime + ' 00:00:00',
                    EndTime: EndTime + ' 23:59:59',
                    APSShiftPeriod: 5
                }, function (data) {
                    wData = [];
                    for (var i = 0; i < data.list.length; i++) {
                        if (data.list[i].Status > 0 && data.list[i].VersionID > 0) {
                            wData.push(data.list[i]);
                        }
                    }
                    wData = wData.sort(function (a, b) {
                        return a.CreateTime < b.CreateTime ? 1 : -1
                    });
                    for (var k = 0; k < wData.length; k++) {
                        wData[k].CreateTimeText = $com.util.format('yyyy-MM-dd hh:mm', wData[k].CreateTime);
                        wData[k].SubmitTime = $com.util.format('yyyy-MM-dd hh:mm', wData[k].SubmitTime)
                        if (wData[k].Status == 10 || wData[k].Status == 2) {
                            wData[k].StatusText = "已确认";
                        }
                        if (wData[k].Status == 21) {
                            wData[k].StatusText = "已撤销";
                        }
                    }

                    wDataDone = $com.util.Clone(wData);

                    $("#femi-zacePlanCommitDone-tbody").html($com.util.template(wData, HTML.TableModeCommitDetail));
                    $com.app.loaded();
                });


            },
            //流程引擎 处理
            refreshCommitTable: function (StartTime, EndTime) {
                $com.app.loading();

                model.com.getEmployeeAll({
                    TagTypes: 1,  //1  处理  2：发起   4  审批
                    StartTime: StartTime + ' 00:00:00',
                    EndTime: EndTime + ' 23:59:59',
                    APSShiftPeriod: 5
                }, function (data) {
                    wData = [];
                    for (var i = 0; i < data.list.length; i++) {
                        if (data.list[i].Status > 0 && data.list[i].VersionID > 0) {
                            wData.push(data.list[i]);
                        }
                    }
                    wData = wData.sort(function (a, b) {
                        return a.CreateTime < b.CreateTime ? 1 : -1
                    });
                    for (var k = 0; k < wData.length; k++) {
                        wData[k].CreateTimeText = $com.util.format('yyyy-MM-dd hh:mm', wData[k].CreateTime)
                        wData[k].SubmitTime = $com.util.format('yyyy-MM-dd hh:mm', wData[k].SubmitTime)
                        if (wData[k].Status == 10 || wData[k].Status == 2) {
                            wData[k].StatusText = "已确认";
                        }
                        if (wData[k].Status == 21) {
                            wData[k].StatusText = "已撤销";
                        }
                    }
                    wDataUnDone = $com.util.Clone(wData);
                    $("#femi-zacePlanCommit-tbody").html($com.util.template(wData, HTML.TableModeCommit));
                    $com.app.loaded();
                });
            },
            //流程引擎 发起
            refreshSend: function (StartTime, EndTime) {
                $com.app.loading();

                model.com.getEmployeeAll({
                    TagTypes: 2,  //1  处理  2：发起   4  审批
                    StartTime: StartTime + ' 00:00:00',
                    EndTime: EndTime + ' 23:59:59',
                    APSShiftPeriod: 5
                }, function (data) {
                    wData = [];
                    for (var i = 0; i < data.list.length; i++) {
                        if (data.list[i].Status > 0 && data.list[i].VersionID > 0) {
                            wData.push(data.list[i]);
                        }
                    }

                    wData = wData.sort(function (a, b) {
                        return a.CreateTime < b.CreateTime ? 1 : -1
                    });
                    for (var k = 0; k < wData.length; k++) {
                        wData[k].CreateTimeText = $com.util.format('yyyy-MM-dd hh:mm', wData[k].CreateTime)
                        wData[k].SubmitTime = $com.util.format('yyyy-MM-dd hh:mm', wData[k].SubmitTime)
                        if (wData[k].Status == 10 || wData[k].Status == 2) {
                            wData[k].StatusText = "已确认";
                        }
                        if (wData[k].Status == 21) {
                            wData[k].StatusText = "已撤销";
                        }
                    }
                    wDataSend = $com.util.Clone(wData);
                    $("#femi-zacePlanSend-tbody").html($com.util.template(wData, HTML.TableModeCommitDetail));
                    $com.app.loaded();
                });
            },

            //完成待办任务，返回新生成的任务，更新业务服务器任务消息状态
            postTask: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESAPS",
                    // $SERVER: "/MESWDW",
                    $URI: "/Runtime/CompleteMyPersonalTask",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },


            //用人拿任务
            getEmployeeAll: function (data, fn, context) {
                var d = {
                    $URI: "/APSSchedulingVersionBPM/EmployeeAll",
                    $TYPE: "get",
                    $SERVER: "/MESAPS"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            getTableData: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskPart/TableList",
                    $TYPE: "post",
                    $SERVER: '/MESAPS'
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            exportReport: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskPart/Export",
                    $TYPE: "get",
                    $SERVER: '/MESAPS',
                };

                function err() {
                    console.log('导出。。。');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getAPSVersion: function (data, fn, context) {
                var d = {
                    $URI: "/APSSchedulingVersionBPM/Details",
                    $TYPE: "get",
                    $SERVER: '/MESAPS'
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //查询用户
            getUser: function (data, fn, context) {
                var d = {
                    $URI: "/User/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getNextSFConditionByTaskId: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESBPM",
                    $URI: "/Repository/getNextSFConditionByTaskId",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //根据流程定义ID和节点ID获取 ， 属性表信息
            getForm: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESBPM",
                    $URI: "/Repository/getFormByPdIdAndActId",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            refreshTable: function (WID) {
                $com.app.loading('数据加载中...');
                model.com.getAPSVersion({ APSSchedulingVersionBPMID: WID }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {

                        var Grade = $com.util.Clone(resP.list);
                        DATABasic = [];
                        ZaceDataAll = [];

                        //审核数据
                        DataAllConfirm = [];


                        DataAll = $com.util.Clone(Grade);

                        $.each(Grade, function (i, item) {
                            item.StatusColorText = StatusColor[item.Status];
                            // item.EndTime = ($com.util.format('yyyy-MM-dd', new Date(item.EndTime).getTime() - 12 * 3600000));
                            // for (var p in item) {
                            //     if (!FORMATTRT_Level[p])
                            //         continue;
                            //     item[p] = FORMATTRT_Level[p](item[p]);
                            // }
                            // item.WID = i + 1;

                            // if ($com.util.format('yyyy-MM-dd', item.EndTime) == $com.util.format('yyyy-MM-dd', item.StartTime)) {

                            // } else {

                            item.EndTime = ($com.util.format('yyyy-MM-dd hh:mm:ss', new Date(item.EndTime).getTime() - 12 * 3600000));
                            // }

                            if ($com.util.format('hh', item.StartTime) < 12) {
                                item.StartTime = $com.util.format('yyyy-MM-dd', item.StartTime) + '(上午)';
                            } else {
                                item.StartTime = $com.util.format('yyyy-MM-dd', item.StartTime) + '(下午)';
                            }

                            if ($com.util.format('hh', item.EndTime) < 12) {
                                item.EndTime = $com.util.format('yyyy-MM-dd', item.EndTime) + '(上午)';
                            } else {
                                item.EndTime = $com.util.format('yyyy-MM-dd', item.EndTime) + '(下午)';
                            }



                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                if (p == 'StartTime')
                                    continue;
                                if (p == 'EndTime')
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }
                            item.WID = i + 1;

                        });
                        DataAllSearch = $com.util.Clone(Grade);
                        $("#femi-riskLevel-tbody").html($com.util.template(Grade, HTML.TableMode));


                    }
                    $com.app.loaded();

                });

            },
            refreshTablePencilDetail: function (wID) {
                $com.app.loading('数据加载中...');
                var taskIDObj = {
                    key: "_8101"
                };
                model.com.getEmployeeInfo({
                    ID: wID
                }, function (data) {

                    wInfo = data.info;
                    wstatus = wInfo.Status;
                    wFlowID = data.info.FlowID;
                    wFlowType = data.info.FlowType;
                    ProcessInstanceID = data.info.FlowID;
                    $com.util.deleteLowerProperty(wInfo);
                    model.com.BuinessDetail(wInfo, 2);


                    model.com.getUser({}, function (res) {
                        $.each(res.list, function (i, item) {
                            mUserObj[item.ID] = item.Name;
                            if (item.Active == 1) {
                                wUser.push(item);
                            }

                        });

                        model.com.getBPMActivitiHisTaskByPIId({ processInstanceId: wFlowID }, function (resHisTask) {
                            wHisTaskList = resHisTask.list;
                            wFindTaskList = $com.util.Clone(wHisTaskList);
                            model.com.HisTaskShow(wHisTaskList);

                            DoneTask = [];
                            for (var k = 0; k < wFindTaskList.length; k++) {
                                if (wFindTaskList[k].HisTaskVarinstList.length > 0) {
                                    DoneTask.push(wFindTaskList[k]);
                                }
                            }
                            if (DoneTask.length == 1) {
                                $("#commit_cancel").show();
                            } else {
                                if (wFindTaskList[0].ActivitiID == wFindTaskList[wFindTaskList.length - 1].ActivitiID
                                    && Number(wFindTaskList[0].Assignee) == LoginID
                                    && Number(wFindTaskList[wFindTaskList.length - 1].Assignee) == LoginID) {
                                    $("#commit_cancel").show();
                                } else {
                                    $("#commit_cancel").hide();
                                }
                            }
                            if (wInfo.Status == 11 || wInfo.Status == 20 || wInfo.Status == 21) {
                                $("#commit_cancel").hide();
                            }
                            $com.app.loaded();
                        });
                    });

                });
            },
            BuinessDetail: function (wInfo, type) {
                wInfo.CreateTime = $com.util.format('yyyy-MM-dd hh:mm', wInfo.CreateTime);
                if (type == 1) {
                    $(".headerAll .BasicTable .FieldContentOne .Contentshow").text("待发起生产遏制");
                } else {
                    $(".headerAll .BasicTable .FieldContentOne .Contentshow").text(wInfo.StatusText);
                }
                wInfo.CreateTime = $com.util.format('yyyy-MM-dd hh:mm', wInfo.CreateTime);
                wInfo.SubmitTime = $com.util.format('yyyy-MM-dd hh:mm', wInfo.SubmitTime);

                var DetailList = [];
                var DetailBusiness = [];
                for (var i in wInfo) {
                    for (var k = 0; k < PropertyBasic.length; k++) {
                        if (PropertyBasic[k].TiTle == i && wInfo[i].length != 0) {
                            PropertyBasic[k].Value = wInfo[i];
                            DetailList.push(PropertyBasic[k]);
                        }
                    }

                    for (var k = 0; k < PropertyBusiness.length; k++) {

                        if (PropertyBusiness[k].TiTle == i && wInfo[i].length != 0) {
                            PropertyBusiness[k].Value = wInfo[i];
                            DetailBusiness.push(PropertyBusiness[k]);
                        }
                    }

                }

                if (DetailList.length % 2 == 0) {
                    $(".BasicTableContentBasic .BasicTable").html($com.util.template(DetailList, HTML.ReadOnlyTwo));
                } else {
                    var DateTwo = [];
                    var DateOne = DetailList[DetailList.length - 1];
                    for (var i = 0; i < DetailList.length - 1; i++) {
                        DateTwo.push(DetailList[i]);
                    }
                    $(".BasicTableContentBasic .BasicTable").html($com.util.template(DateTwo, HTML.ReadOnlyTwo));
                }
                if (DetailBusiness.length % 2 == 0) {
                    $(".BasicTableContentBusiness .BasicTable").html($com.util.template(DetailBusiness, HTML.ReadOnlyTwo));
                } else {
                    var DateTwo = [];
                    var DateOne = DetailBusiness[DetailBusiness.length - 1];
                    for (var i = 0; i < DetailBusiness.length - 1; i++) {
                        DateTwo.push(DetailBusiness[i]);
                    }
                    $(".BasicTableContentBusiness .BasicTable").html($com.util.template(DateTwo, HTML.ReadOnlyTwo) + $com.util.template(DateOne, HTML.ReadOnlyOne));
                }
            },
            refreshTablePencil: function (wID) {
                $com.app.loading('数据加载中...');
                var taskIDObj = {
                    key: "_8101"
                };
                model.com.getEmployeeInfo({
                    ID: wID
                }, function (data) {

                    mCloneData = $com.util.Clone(data.info);
                    wInfo = data.info;
                    wstatus = wInfo.Status;
                    wFlowID = data.info.FlowID;
                    wFlowType = data.info.FlowType;
                    mCloneListRead = $com.util.Clone(mCloneData);
                    ProcessInstanceID = data.info.FlowID;
                    model.com.BuinessDetail(wInfo, 2);
                    model.com.getTask({ taskId: mQueryTaskID }, function (res) {
                        Todotasks = res.info;
                        if (Todotasks.Status != 0) {
                            alert("任务已完成");
                            setTimeout(function () {
                                $('.zacePlanCommit').show();
                                $('.zacePlanTable').hide();
                                $('.zacePlanTableCommit').hide();
                                $('.ganteTable').hide();
                                $('.zacePlanTableRecord').hide();

                                model.com.refreshCommitTable(mZCommitStartTime, mZCommitEndTime);
                            }, 1000);
                        }
                        // 根据流程实例ID 获取流程实例历史
                        model.com.getHistoryTask({ processInstanceId: Todotasks.ProcessInstanceId }, function (resP) {
                            mHistoryTask = resP.list;

                            model.com.RunTaskTwo(Todotasks);
                        });
                    });
                });
            },
            BpmOperationSort: function (a, b) {

                var reg = /(\d+)$/g;
                //匹配正则获取小分组捕获结果
                var resultb = reg.exec(b.Id);
                if (resultb) {
                    resultb = resultb[1];
                } else {
                    resultb = 0;
                }
                reg = /(\d+)$/g;
                var resulta = reg.exec(a.Id);
                if (resulta) {
                    resulta = resulta[1];
                } else {
                    resulta = 0;
                }
                return resulta - resultb;

            },
            RunTaskTwo: function (Todotasks) {
                if (!Todotasks) {
                    alert("未获取到任务！");
                    return false;
                }
                mTaskID = Todotasks.ID;
                if (mQueryTaskID <= 0) {
                    if (Todotasks.HisTaskVarinstList.length > 0) {
                        model.com.HisTaskShow(Todotasks.HisTaskVarinstList);
                    } else {
                        $(".footer").hide();
                        $("#commit_route").hide();
                    }
                } else {
                    $(".footer").show();
                    $("#commit_route").show();
                    wHisTaskList = [];
                    for (var i = 0; i < mHistoryTask.length; i++) {
                        if (mHistoryTask[i].HisTaskVarinstList.length > 0) {
                            wHisTaskList.push(mHistoryTask[i]);
                        }
                    }
                    model.com.HisTaskShow(wHisTaskList);
                }
                var moveCarProcess = Todotasks.ProcessDefinitionId;
                //（通过任务ID获取当前任务节点出口顺序流条件信息）
                model.com.getNextSFConditionByTaskId({ taskId: mTaskID }, function (res) {
                    OperationsByTask = res.list;
                    OperationsByTask.sort(model.com.BpmOperationSort);

                    //获取按钮的id属性
                    idButtonArray = [];

                    $.each(OperationsByTask, function (i, item) {
                        if (!item.Documentation) {
                            return;
                        }
                        sonItem = item.Documentation.split(";");
                        for (var i = 0; i < sonItem.length; i++) {
                            if (sonItem[i] == "" || sonItem[i] == null || typeof (sonItem[i]) == undefined) {
                                sonItem.splice(i, 1);
                                i = i - 1;
                            }
                        }
                        $.each(sonItem, function (i_o, item_o) {
                            var obj_p = item_o.split(":");
                            item[obj_p[0]] = obj_p[1];
                        })
                        idButtonArray.push(item);
                    });
                    $(".zacePencil .zace-tree-header .pull-right .zace-button").html($com.util.template(idButtonArray, HTML.ButtonMode));

                    // 根据流程定义ID和节点ID获取 ， 属性表信息
                    model.com.getForm({ definitionId: moveCarProcess, activitiId: Todotasks.ActivitiID }, function (res) {
                        wForm = res.info;
                        mIsReadableList = [];
                        wFormPropertyList = wForm.FormProperty;

                        if (!styleControl) {
                            styleControl = document.createElement("style");
                            styleControl.type = "text/css";
                            $("head").append(styleControl);
                        }
                        var _styleText = "";

                        for (var i = 0; i < wForm.FormProperty.length; i++) {
                            $(".ds-head-" + wForm.FormProperty[i].Key).text(wForm.FormProperty[i].Name);
                            //将所有可写控件显示
                            if (wForm.FormProperty[i].IsWritable) {

                                _styleText += ".Write-Control-" + wForm.FormProperty[i].Key + "{display:block;} ";
                                _styleText += ".Write-Control-" + wForm.FormProperty[i].Key + "{display:flex;} ";
                                //所有可写并且必填项显示*号

                                if (wForm.FormProperty[i].IsRequired) {
                                    $(".Write-Control-" + wForm.FormProperty[i].Key + " .ds-head-show").text("*");
                                }
                                //用于数据回显
                                // $(".Write-content-" + wForm.FormProperty[i].Key).attr("data-value", mCloneData[wForm.FormProperty[i].Key]);
                                // $(".Write-content-" + wForm.FormProperty[i].Key).val(mCloneData[PropertyBasic[wForm.FormProperty[i].Key]]);

                            } else if (wForm.FormProperty[i].IsReadable) {
                                //取所有可读数据
                                mIsReadableList.push(wForm.FormProperty[i]);
                            }

                        }
                        $(styleControl).html(_styleText);

                        $com.app.loaded();
                    });
                });

            },
            //根据流程实例ID 获取流程实例历史
            getHistoryTask: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESBPM",
                    $URI: "/History/getBPMActivitiHisTaskByPIId",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //根据任务ID 获取任务
            getTask: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESBPM",
                    $URI: "/History/getBPMActivitiHisTaskByTaskId",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            HisTaskShow: function (HisTaskArray, type) {
                var mode = {
                    NodeName: "",
                    Status: 0,
                    EndTime: "2010-01-01 00:00:00",
                    Executor: "",
                    Command: "",
                    HistoryTaskID: 0,
                };
                var data = [];

                $.each(HisTaskArray, function (i, item) {
                    var temp = $com.util.Clone(mode);
                    $.each(item.HisTaskVarinstList, function (k, item_k) {
                        $.each(item.OperationStep, function (p, item_p) {
                            if (item_k.VariableName == item_p.Name && item_k.Value == item_p.Value) {
                                item.StatusText = item_p.Documentation.split(';')[0].split(':')[1];
                            }
                        });
                        if (item_k.VariableName == 'Remark') {
                            item.Command = item_k.Value;
                        }
                    });
                    temp.HistoryTaskID = item.ID;
                    temp.NodeName = item.Name;
                    temp.Status = item.Status;
                    temp.StatusText = item.StatusText;
                    temp.Command = item.Command;
                    temp.Index = i + 1;

                    switch (item.Status) {
                        case 0:
                            temp.StatusName = '待执行';
                            break;
                        case 1:
                            temp.StatusName = item.StatusText;
                            break;
                        case 2:
                            if (item.deleteReason == '申请撤销') {
                                temp.StatusName = '已撤销';
                            } else {
                                temp.StatusName = '已关闭';
                            }

                            break;
                        case 3:
                            temp.StatusName = '已转发';
                            break;
                        default:
                            temp.StatusName = '-';
                            break;
                    }

                    // temp.StatusName = item.Status == 0 ? '待执行' : item.StatusText;
                    temp.EndTime = $com.util.format('yyyy-MM-dd hh:mm', new Date(item.EndTime)) < '2010-01-01' ? '--' : $com.util.format('yyyy-MM-dd hh:mm', new Date(item.EndTime));
                    temp.Executor = mUserObj[Number(item.Assignee)];
                    data.push(temp);
                });
                data.reverse();
                if (type == 1) {
                    $charf.getbasicData(".zaceLiuchengPencil", data);
                } else {
                    $charf.getbasicData(".zaceLiuchengPencil", data);
                }

            },
            imgShow: function (outerdiv, innerdiv, bigimg, _this) {
                var src = _this.attr("src");//获取当前点击的pimg元素中的src属性  
                $(bigimg).attr("src", src);//设置#bigimg元素的src属性  

                /*获取当前点击图片的真实大小，并显示弹出层及大图*/
                $("<img/>").attr("src", src).on('load', function () {
                    var windowW = $(window).width();//获取当前窗口宽度  
                    var windowH = $(window).height();//获取当前窗口高度  
                    var realWidth = this.width;//获取图片真实宽度  
                    var realHeight = this.height;//获取图片真实高度  
                    var imgWidth, imgHeight;
                    var scale = 1;//缩放尺寸，当图片真实宽度和高度大于窗口宽度和高度时进行缩放  

                    if (realHeight > windowH * scale) {//判断图片高度  
                        imgHeight = windowH * scale;//如大于窗口高度，图片高度进行缩放  
                        imgWidth = imgHeight / realHeight * realWidth;//等比例缩放宽度  
                        if (imgWidth > windowW * scale) {//如宽度扔大于窗口宽度  
                            imgWidth = windowW * scale;//再对宽度进行缩放  
                        }
                    } else if (realWidth > windowW * scale) {//如图片高度合适，判断图片宽度  
                        imgWidth = windowW * scale;//如大于窗口宽度，图片宽度进行缩放  
                        imgHeight = imgWidth / realWidth * realHeight;//等比例缩放高度  
                    } else {//如果图片真实高度和宽度都符合要求，高宽不变  
                        imgWidth = realWidth;
                        imgHeight = realHeight;
                    }
                    $(bigimg).css("width", imgWidth);//以最终的宽度对图片缩放  

                    var w = (windowW - imgWidth) / 2;//计算图片与窗口左边距  
                    var h = (windowH - imgHeight) / 2;//计算图片与窗口上边距  
                    $(innerdiv).css({ "top": h, "left": w });//设置#innerdiv的top和left属性  
                    $(outerdiv).fadeIn("fast");//淡入显示#outerdiv及.pimg  
                });

                $(outerdiv).click(function () {//再次点击淡出消失弹出层  
                    $(this).fadeOut("fast");
                });
            },
            getBPMActivitiHisTaskByPIId: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESBPM",
                    $URI: "/History/getBPMActivitiHisTaskByPIId",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询用户
            getUser: function (data, fn, context) {
                var d = {
                    $URI: "/User/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            refresh: function () {
                $com.app.loading('数据加载中...');
                var taskIDObj = {
                    key: "_8101"
                };
                model.com.onTask({
                    processDefinitionKey: taskIDObj.key,
                    BusinessKey: "",
                    data: {}
                }, [function (data) {
                    //获取实例ID
                    mCloneData = data.data;
                    $com.util.deleteLowerProperty(mCloneData);
                    mCloneListRead = $com.util.Clone(mCloneData);
                    Todotasks = data.list[0];
                    RunTask(data.list[0]);

                    function RunTask(Todotasks) {
                        if (!Todotasks) {
                            alert("未获取到任务！");
                            return false;
                        }

                        mTaskID = Todotasks.ID;

                        if (mQueryTaskID <= 0) {
                            if (Todotasks.HisTaskVarinstList.length > 0) {
                                //渲染历史数据
                                //model.com.HisTaskShow(Todotasks.HisTaskVarinstList);
                            } else {
                                $(".process").hide();
                            }
                        } else {


                            wHisTaskList = [];
                            for (var i = 0; i < mHistoryTask.length; i++) {
                                if (mHistoryTask[i].HisTaskVarinstList.length > 0) {
                                    wHisTaskList.push(mHistoryTask[i]);
                                }
                            }
                            //model.com.HisTaskShow(wHisTaskList);
                        }

                        var moveCarProcess = Todotasks.ProcessDefinitionId;
                        //（通过任务ID获取当前任务节点出口顺序流条件信息）
                        model.com.getNextSFConditionByTaskId({ taskId: mTaskID }, function (res) {
                            OperationsByTask = res.list;
                            OperationsByTask.sort(model.com.BpmOperationSort);

                            //获取按钮的id属性
                            idButtonArray = [];

                            $.each(OperationsByTask, function (i, item) {
                                if (!item.Documentation) {
                                    return;
                                }
                                sonItem = item.Documentation.split(";");
                                for (var i = 0; i < sonItem.length; i++) {
                                    if (sonItem[i] == "" || sonItem[i] == null || typeof (sonItem[i]) == undefined) {
                                        sonItem.splice(i, 1);
                                        i = i - 1;
                                    }
                                }
                                $.each(sonItem, function (i_o, item_o) {
                                    var obj_p = item_o.split(":");
                                    item[obj_p[0]] = obj_p[1];
                                })
                                idButtonArray.push(item);
                            });
                            $(".zacePlanTable .zace-tree-header .pull-right").html($com.util.template(idButtonArray, HTML.ButtonMode))

                            // 根据流程定义ID和节点ID获取 ， 属性表信息
                            model.com.getForm({ definitionId: moveCarProcess, activitiId: Todotasks.ActivitiID }, function (res) {
                                wForm = res.info;
                                mIsReadableList = [];
                                wFormPropertyList = wForm.FormProperty;


                                if (!styleControl) {
                                    styleControl = document.createElement("style");
                                    styleControl.type = "text/css";
                                    $("head").append(styleControl);
                                }
                                var _styleText = "";

                                for (var i = 0; i < wForm.FormProperty.length; i++) {
                                    $(".ds-head-" + wForm.FormProperty[i].Key).text(wForm.FormProperty[i].Name);
                                    //将所有可写控件显示
                                    if (wForm.FormProperty[i].IsWritable) {
                                        _styleText += ".Write-Control-" + wForm.FormProperty[i].Key + "{display:block;} "
                                        //所有可写并且必填项显示*号

                                        if (wForm.FormProperty[i].IsRequired) {
                                            $(".Write-Control-" + wForm.FormProperty[i].Key + " .ds-head-show").text("*");
                                        }
                                        //用于数据回显
                                        $(".Write-content-" + wForm.FormProperty[i].Key).attr("data-value", mCloneData[wForm.FormProperty[i].Key]);
                                        $(".Write-content-" + wForm.FormProperty[i].Key).val(mCloneData[MTCProperty[wForm.FormProperty[i].Key]]);


                                    } else if (wForm.FormProperty[i].IsReadable) {
                                        //取所有可读数据
                                        mIsReadableList.push(wForm.FormProperty[i]);
                                    }

                                }
                                $(styleControl).html(_styleText);

                                mIsReadableListCopy = $com.util.Clone(mIsReadableList);

                                //展示所有可读数据
                                for (x in mCloneListRead) {
                                    for (var k = 0; k < mIsReadableListCopy.length; k++) {
                                        if (mIsReadableListCopy[k].Key == x) {
                                            mIsReadableListCopy[k].Value = mCloneListRead[x];
                                        }
                                        if (mIsReadableListCopy[k].Value == "") {
                                            mIsReadableListCopy[k].Value = "-";
                                        }
                                    }
                                }
                                $(".zace-TitleDetailFirst").html($com.util.template(mIsReadableListCopy, HTML.ReadOnly));

                                $com.app.loaded();
                            });
                        });

                    }



                }, function () {
                    $com.app.loaded();
                    setTimeout(function () {
                        $('.zacePlanCommit').show();
                        $('.zacePlanTable').hide();
                        $('.zacePlanTableCommit').hide();
                        $('.ganteTable').hide();
                        $('.zacePlanTableRecord').hide();

                        model.com.refreshCommitTable(mZCommitStartTime, mZCommitEndTime);
                    }, 1000);
                }]);

            },
            //启动任务 （通过流程定义的标识Key 开启一个流程实例）
            onTask: function (data, fn, context) {
                var d = {
                    // $SERVER: "/MESBPM",
                    $SERVER: "/MESAPS",
                    $URI: "/Runtime/startProcessByProcessDefinitionKey",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            getOMSOrder: function (data, fn, context) {
                var d = {
                    $URI: "/OMSOrder/All",
                    $TYPE: "get",
                    $SERVER: '/MESAPS',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询产线列表
            getFMCLine: function (data, fn, context) {
                var d = {
                    $URI: "/FMCLine/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询工序库列表
            getFPCPart: function (data, fn, context) {
                var d = {
                    $URI: "/FPCPart/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
        }
    }),

        model.init();


});