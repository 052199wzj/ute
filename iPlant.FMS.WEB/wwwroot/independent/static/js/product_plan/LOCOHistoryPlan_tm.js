require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/cross2.js', '../static/utils/js/charf.js', '../static/utils/js/base/jquery.treeview'], function ($zace, $com, $cross, $charf, $tree) {

    var KEYWORD_Level_LIST,
        KEYWORD_Level,
        FORMATTRT_Level,
        DEFAULT_VALUE_Level,
        TypeSource_Level,
        model,
        VersionSource,
        DataAll,
        DATABasic,
        DataAllConfirmBasic,
        DataAllConfirmChange,
        DataAllConfirm,
        DataAllSearch,
        DATAAllBusiness,
        DATAAllBusinessC,
        HTML;

    var styleControl = undefined;
    DATAAllBusiness = DATAAllBusinessC = [];
    DataAll = [];
    DATABasic = [];
    DataAllConfirmBasic = [];
    DataAllConfirmChange = [];
    DataAllConfirm = [];
    DataAllSearch = [];
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

    var StatusList = ["默认", "未排", "下达", "日计划制定中", "开工", "完工", "暂停", "终止", "提交", "待审批", "已审批"];
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
    var MTCProperty = [{
        Name: '单据编号',
        TiTle: 'Code',
        Value: '',
    }, {
        Name: '发起人',
        TiTle: 'UpFlowName',
        Value: '',
    }];
    HTML = {
        ButtonMode: [
            ' <button type="button"  class="btn btn-default zaceStatusCommit ds-bpm-btn lmvt-def-btn"  data-prop="{{Name}}" data-valueText="{{Text}}" data-value="{{Value}}">',
            '  <span class="glyphicon " aria-hidden="true"></span>{{Text}}',
            ' </button>',
        ].join(""),
        TableMode: [
            '<tr>',
            //'<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            //'<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td   data-title="WID" data-value="{{ID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td data-title="VersionNo" data-value="{{VersionNo}}" >{{VersionNo}}</td>',
            '<td data-title="WorkShopName" data-value="{{WorkShopName}}" >{{WorkShopName}}</td>',
            '<td data-title="LineName" data-value="{{LineName}}" >{{LineName}}</td>',
            // '<td data-title="PartID" data-value="{{PartID}}" >{{PartID}}</td>',
            '<td data-title="StartTime" data-value="{{StartTime}}" >{{StartTime}}</td>',
            '<td data-title="EndTime" data-value="{{EndTime}}" >{{EndTime}}</td>',
            '<td style="color:{{StatusColorText}}" data-title="Status" data-value="{{StatusText}}" >{{StatusText}}</td>',
            '</tr>',
        ].join(""),

        TableModeCommit: [
            '<tr>',
            '<td  style="min-width: 50px;display:none" data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td data-title="Code" data-value="{{Code}}" >{{Code}}</td>',
            '<td data-title="UpFlowName" data-value="{{UpFlowName}}" >{{UpFlowName}}</td>',
            '<td data-title="CreateTimeText" data-value="{{CreateTimeText}}" >{{CreateTimeText}}</td>',
            '<td data-title="StatusText" data-value="{{StatusText}}" >{{StatusText}}</td>',
            '<td style="min-width: 30px;max-width: 120px;" data-title="VersionID" data-value="{{VersionID}}"><div class="td-contain"><span class="td-contain-list" id="cby-add-bill" >计划详情</span> </div> </td>  ',
            '<td style="min-width: 30px;max-width: 120px;" data-title="#" data-value="#"><div class="td-contain"><span class="td-contain-list" id="cby-add-pencil" >办理任务</span> </div> </td>  ',
            '</tr>',
        ].join(""),

        ReadOnly: [

            '   <div style="width: 280px;height:30px ;margin: 2px;float: left;">',
            '   {{Name}}：<input type="text" value="{{Value}}" readonly  style=" border-width: 0;"/>',
            '  </div>',

        ].join(""),


        ReadTextArea: [

            '   <div style="width: 280px;height:90px ;margin: 2px;float: left;">',
            '   备注：<textarea rows="3"   > </textarea>',
            '  </div>',

        ].join(""),

        TableUserItemNode: [
            '<tr data-color="">',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            // '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="OrderNo" data-value="{{OrderNo}}" >{{OrderNo}}</td>',
            '<td data-title="Customer" data-value="{{Customer}}" >{{Customer}}</td>',
            '<td data-title="LineName" data-value="{{LineName}}" >{{LineName}}</td>',
            '<td data-title="ProductNo"  data-value="{{ProductNo}}" >{{ProductNo}}</td>',
            // '<td data-title="PartNo"  data-value="{{PartNo}}" >{{PartNo}}</td>',
            '<td data-title="PartNoText"  data-value="{{PartNoText}}" >{{PartNoText}}</td>',
            // '<td style="display:none" data-title="TaskLineID" data-value="{{TaskLineID}}" >{{TaskLineID}}</td>',


        ].join(""),

        thead: [
            '<tr>',
            '<th><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            // '<th data-order="ID"  style="min-width: 50px">序号</td>',
            '<th data-order="OrderNo" style="min-width: 50px" >WBS编号</td>',
            '<th data-order="Customer" style="min-width: 50px" >局段</td>',
            '<th data-order="LineName" style="min-width: 50px" >修程</td>',
            '<th data-order="ProductNo" style="min-width: 50px" >车型</td>',
            '<th data-order="PartNoText" style="min-width: 50px" >车号</td>',


        ].join(""),
        th: ['<th data-order="Station_{{ID}}" style="min-width: 50px" >{{Name}}</th>'].join(""),
        td: ['<td  class="edit-td" data-title="Station_{{ID}}" data-value="{{Station_{{ID}}}}" >{{Station_{{ID}}}}</td>',].join(""),


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
                    name: "未排",
                    value: 1
                }, {
                    name: "下达",
                    value: 2
                }, {
                    name: "日计划制定中",
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


            //周计划处理信息----实时流程图
            $("body").delegate("#commit_route", "click", function () {

                var $src = $com.imageUrl + "/MESBPM/api/Repository/getRealFlowChart?processInstanceId=" + ProcessInstanceID;
                $("#cby-route-charf-ontask img").attr("src", $src);


                model.com.imgShow("#outerdiv", "#innerdiv", "#bigimg", $("#cby-route-charf-ontask img"));

                //$("#cby-table").hide();
            });
            //返回待办任务
            $("body").delegate("#cby-return-ontask", "click", function () {
                $("#cby-route-charf-ontask").hide();
            });

            //发起信息提交
            $("body").delegate(".zaceStatusCommit.ds-bpm-btn", "click", function () {

                var $this = $(this);
                mCloneData[$this.attr("data-prop")] = Number($this.attr("data-value"));
                var _text = $this.attr("data-valueText");

                model.com.addCheck(_text);
            });
            //发起界面返回周计划发起列表
            $("body").delegate("#zace-exportApproval-commitReturn", "click", function () {
                $('.zacePlanCommit').show();
                $('.zacePencil').hide();
                $('.zacePlanTableCommit').hide();
                $('.zacePlanTable').hide();
                model.com.refreshCommitTable(mZCommitStartTime, mZCommitEndTime);
            });
            //周计划处理信息(撤销)返回发起界面
            $("body").delegate("#zace-exportApproval-commit", "click", function () {
                $('.zacePlanCommit').hide();
                $('.zacePlanTableCommit').hide();
                $('.zacePlanTable').show();

                model.com.refreshPlan();
                model.com.refresh();
            });

            // 办理任务
            $("body").delegate("#cby-add-pencil", "click", function () {

                var $this = $(this);
                var $table = $this.closest("tr");
                var WID = Number($table.find('td[data-title=ID]').attr('data-value'));

                $('.zacePlanTable').hide();
                $('.zacePlanCommit').hide();
                $('.zacePencil').show();
                $('.zacePlanTableCommit').hide();
                model.com.refreshTablePencil(WID);
            });

            //周计划排程详情
            $("body").delegate("#cby-add-bill", "click", function () {

                var $this = $(this);
                var $table = $this.closest("tr");
                var WID = Number($table.find('td[data-title=VersionID]').attr('data-value'));

                var Selection_Data = VersionSource.filter((item) => { return item.ID == WID }),
                    WorkShopID = Selection_Data[0].WorkShopID;

                var ISMove = true;
                if (Selection_Data[0].Status != 1 || new Date().getTime() >= new Date(Selection_Data[0].EndTime).getTime()) {
                    ISMove = false;
                }

                var vdata = { 'header': '周计划详情', 'href': './product_plan/ReSetPlanReadOnly.html?ID=' + Selection_Data[0].ID + "&VersionNo=" + Selection_Data[0].VersionNo + "&WorkShopID=" + Selection_Data[0].WorkShopID + "&ISMove=" + ISMove, 'id': 'ReSetPlanReadOnly', 'src': './static/images/menu/newfactoryModel/plan.png' };
                window.parent.iframeHeaderSet(vdata);
                window.callFunctionTrigger("RanderGantt", { ID: Selection_Data[0].ID, VersionNo: Selection_Data[0].VersionNo, WorkShopID: WorkShopID, ISMove: ISMove });
            });
            // 周计划发起列表-刷新
            $("body").delegate("#zace-edit-zaceRefreshRecord", "click", function () {
                mZCommitStartTime = $com.util.format("yyyy-MM-dd", new Date().getTime() - 7 * 24 * 3600 * 1000);
                mZCommitEndTime = $com.util.format("yyyy-MM-dd", new Date());

                model.com.refreshCommitTable(mZCommitStartTime, mZCommitEndTime);
            });
            // 周计划发起列表-筛选
            $("body").delegate("#zace-searchZApproval-levelZaceRecord", "click", function () {
                var $this = $(this),
                    value = $("#zace-search-levelRecord2").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-zacePlanCommit-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-zacePlanCommit-tbody"), DataAllSearchBPM, value, "ID");
            });
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var $this = $(this),
                        value = $("#zace-search-levelRecord2").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-zacePlanCommit-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-zacePlanCommit-tbody"), DataAllSearchBPM, value, "ID");
                }
            });

            $("body").delegate("#zace-edit-submitAudit", "click", function () {
                if (!confirm("确定审批周计划吗？")) {
                    return;
                }
                $com.util.deleteLowerProperty(ZaceDataAll);
                model.com.auditAPSHistory({
                    data: ZaceDataAll,
                    OperateType: 3,
                    APSShiftPeriod: mAPSShiftPeriod
                }, function (res) {
                    alert("审批成功");
                    model.com.refresh();
                })
            });
            //zace-edit-submit
            $("body").delegate("#zace-edit-remove", "click", function () {
                if (!confirm("确定驳回周计划吗？")) {
                    return;
                }
                $com.util.deleteLowerProperty(ZaceDataAll);
                model.com.auditAPSHistory({
                    data: ZaceDataAll,
                    OperateType: 4,
                    APSShiftPeriod: mAPSShiftPeriod
                }, function (res) {

                    alert("驳回成功");
                    model.com.refresh();
                })
            });

            //Enter触发模糊查询事件
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var $this = $(this),
                        value = $("#zace-search-level").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-riskLevel-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllSearch, value, "ID");
                }
            });
            //查询
            $("body").delegate("#zace-searchZApproval-levelZace", "click", function () {
                var $this = $(this),
                    value = $("#zace-search-level").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllSearch, value, "ID");
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
            // model.com.getFMCLine({ FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0 }, function (resP) {
            //     if (!resP)
            //         return;

            //     $.each(resP.list, function (i, item) {
            //         TypeSource_Level.LineID.push({
            //             value: item.ID,
            //             name: item.Name
            //         });
            //     });
            //     //工位
            //     model.com.getFPCPart({ FactoryID: 0, BusinessUnitID: 0 }, function (resP) {
            //         if (!resP)
            //             return;

            //         $.each(resP.list, function (i, item) {
            //             TypeSource_Level.PartID.push({
            //                 value: item.ID,
            //                 name: item.Name
            //             });
            //         });
            //         //订单
            //         model.com.getOMSOrder({}, function (resP) {
            //             if (!resP)
            //                 return;

            //             $.each(resP.list, function (i, item) {
            //                 TypeSource_Level.OrderID.push({
            //                     value: item.ID,
            //                     name: item.OrderNo
            //                 });

            //                 if (item.Status != 8) {

            //                     if (item.PartNo.length < 1) {
            //                         item.ZaceName = item.OrderNo;
            //                     } else {
            //                         item.ZaceName = item.PartNo;
            //                     }
            //                     TypeSource_Level.OrderIDShow.push({
            //                         value: item.ID,
            //                         name: item.ZaceName
            //                     });
            //                 }
            //             });

            //             if (TypeSource_Level.OrderIDShow.length > 0) {
            //                 mOrderIDShow = TypeSource_Level.OrderIDShow[0].value;
            //             }

            mZCommitStartTime = $com.util.format("yyyy-MM-dd", new Date().getTime() - 7 * 24 * 3600 * 1000);
            mZCommitEndTime = $com.util.format("yyyy-MM-dd", new Date());

            model.com.refreshCommitTable(mZCommitStartTime, mZCommitEndTime);
            model.com.SchedulingVersion();
            // model.com.getEmployeeUserInfo({

            // }, [function (resd) {
            //     LoginID = resd.info;
            // }]


            // );
            //         });
            //     });
            // });

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

            refreshPlan: function () {

                $com.app.loading('数据加载中...');
                mVersionNo = '';
                model.com.getSchedulingVersionAll({ APSShiftPeriod: 5, StartTime: mStartTime, EndTime: mEndTime, WorkShopID: 1 }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {

                        var Grade = [];
                        DATABasic = [];
                        ZaceDataAll = [];
                        if (resP.list.length > 0) {
                            DATABasic = $com.util.Clone(resP.list);
                            Grade = $com.util.Clone(resP.list);
                            $.each(Grade, function (i, item) {
                                item.StatusText = StatusList[item.Status];
                                item.WID = i + 1;
                            });
                            $("#femi-PlanTableAll-tbody").html($com.util.template(Grade, HTML.TableMode));
                        }
                    }
                    $com.app.loaded();

                });


            },
            addCheck: function (Text) {
                // if (!confirm("确定" + Text + "周计划吗？")) {
                //     return;
                // }
                _listCommitObj = $com.util.Clone(mCloneData);
                _listCommitObj.CreateTime = $com.util.format("yyyy-MM-dd hh:mm:ss", new Date());
                _listCommitObj.VersionNo = mVersionNo;
                _listCommitObj.Remark = $('.zaceTextCommit textarea').val();//状态根据流程引擎节点来
                _listCommitObj.Remark_txt = $('.zaceTextCommit textarea').val();//状态根据流程引擎节点来

                _listCommitObj.TaskPartIDList = [];
                $.each(DataAllConfirm, function (i, item) {
                    _listCommitObj.TaskPartIDList.push(item.ID);
                });

                $com.util.deleteLowerProperty(ZaceDataAll);
                $com.util.deleteLowerProperty(_listCommitObj);
                if (!confirm("确定" + Text + "周计划吗？")) {
                    return;
                }
                model.com.postTask({ "TaskID": Todotasks.ID, "data": _listCommitObj }, [function (res) {

                    var currentTask = res.list;
                    $("#zace-exportApproval-commitReturn").click();

                }, function (res1) {
                    $("#zace-exportApproval-commitReturn").click();

                }]);

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
            // getEmployeeUserInfo: function (data, fn, context) {
            //     var d = {
            //         $URI: "/BMSOrgnization/UserInfo",
            //         $TYPE: "get",
            //         $SERVER: "/MESQMS"
            //     };
            //     function err() {
            //         $com.app.tip('获取失败，请检查网络');
            //     }

            //     $com.app.ajax($.extend(d, data), fn, err, context);
            // },
            //流程引擎
            refreshCommitTable: function (StartTime, EndTime) {
                $com.app.loading();

                model.com.getEmployeeAll({
                    TagTypes: 2,  //1  处理  2：发起   4  审批
                    StartTime: StartTime + ' 00:00:00',
                    EndTime: EndTime + ' 23:59:59',
                    APSShiftPeriod: 5
                }, function (data) {
                    wData = [];
                    for (var i = 0; i < data.list.length; i++) {
                        if (data.list[i].Status > 0) {
                            wData.push(data.list[i]);
                        }
                    }
                    wData = wData.sort(function (a, b) {
                        return a.ApplyTime < b.ApplyTime ? 1 : -1
                    });
                    for (var k = 0; k < wData.length; k++) {
                        wData[k].CreateTimeText = $com.util.format('yyyy-MM-dd hh:mm', wData[k].CreateTime)

                    }
                    DataAllSearchBPM = $com.util.Clone(wData);

                    $("#femi-zacePlanCommit-tbody").html($com.util.template(wData, HTML.TableModeCommit));
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

                            item.EndTime = ($com.util.format('yyyy-MM-dd hh:mm:ss', new Date(item.EndTime).getTime() - 12 * 3600000));

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
            refreshTablePencil: function (wID) {
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
                    mUserObj = {};
                    wUser = [];

                    $.each(MTCProperty, function (i, item_i) {
                        if (wInfo[item_i.TiTle]) {
                            item_i.Value = wInfo[item_i.TiTle];
                        }
                    });
                    $(".zace-TitleDetailFirstPencil").html($com.util.template(MTCProperty, HTML.ReadOnly));

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
                            if (wInfo.Status == 22 || wInfo.Status == 20 || wInfo.Status == 21) {
                                $("#commit_cancel").hide();
                            }
                            $com.app.loaded();
                        });
                    });
                });
            },
            HisTaskShow: function (HisTaskArray) {
                var mode = {
                    NodeName: "发起移车",
                    Status: 0,
                    EndTime: "2020/08/06 15:38",
                    Executor: "陈培添",
                    Command: "--"
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




                    temp.NodeName = item.Name;
                    temp.Status = item.Status;
                    temp.StatusText = item.StatusText;
                    temp.Command = item.Command;
                    temp.Index = i + 1;

                    temp.StatusName = item.Status == 0 ? '待执行' : item.StatusText;
                    temp.EndTime = $com.util.format('yyyy-MM-dd hh:mm', new Date(item.EndTime)) < '2010-01-01' ? '--' : $com.util.format('yyyy-MM-dd hh:mm', new Date(item.EndTime));
                    temp.Executor = mUserObj[Number(item.Assignee)];
                    data.push(temp);

                });
                data.reverse();
                $charf.getbasicData(".zaceLiucheng", data);

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
                    data: {
                        "ID": 1,
                        "VersionNo": "W01-20-08-4.01",
                        "WorkShopID": 1,
                        "WorkShopName": "模组车间",
                        "LineID": 0,
                        "LineName": "",
                        "APSShiftPeriod": 5,
                        "CreateID": 0,
                        "Creator": "",
                        "CreateTime": "2020-08-22 15:51:00",
                        "StartTime": "2020-08-22 00:00:00",
                        "EndTime": "2020-09-21 00:00:00",
                        "Status": 0,
                        "TaskPartList": [],
                        "MessageList": [],
                    }
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
                        wUser = [];
                        mUserObj = {};
                        mTaskID = Todotasks.ID;
                        model.com.getUser({}, function (res) {
                            $.each(res.list, function (i, item) {
                                mUserObj[item.ID] = item.Name;
                                if (item.Active == 1) {
                                    wUser.push(item);
                                }
                            });
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
                        });
                    }
                }, function () {
                    $com.app.loaded();
                    setTimeout(function () {
                        $('.zacePlanCommit').show();
                        $('.zacePlanTable').hide();
                        $('.zacePlanTableCommit').hide();

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

            //查询工序段列表
            getFPCPartPoint: function (data, fn, context) {
                var d = {
                    $URI: "/FPCPartPoint/All",
                    $TYPE: "get"
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
            //查询
            getFPCProduct: function (data, fn, context) {
                var d = {
                    $URI: "/FPCProduct/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询模块ID对应枚举值
            getModuleAll: function (data, fn, context) {
                var d = {
                    $URI: "/MESEnum/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getAPSHistoryQuery: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskPart/Query",
                    $TYPE: "get",
                    $SERVER: '/MESAPS',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询任务
            // getAPSHistory: function (data, fn, context) {
            //     var d = {
            //         $URI: "/APSTaskPart/History",
            //         $TYPE: "get",
            //         $SERVER: '/MESAPS',
            //     };

            //     function err() {
            //         $com.app.tip('获取失败，请检查网络');
            //     }

            //     $com.app.ajax($.extend(d, data), fn, err, context);
            // },
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
            //保存
            postAPSHistory: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskPart/TransmitTask",
                    $TYPE: "post",
                    $SERVER: '/MESAPS',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //审核
            auditAPSHistory: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskPart/Audit",
                    $TYPE: "post",
                    $SERVER: '/MESAPS',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //启用
            activeBusinessUnit: function (data, fn, context) {
                var d = {
                    $URI: "/BusinessUnit/Active",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //导出
            postExportExcel: function (data, fn, context) {
                var d = {
                    $URI: "/Upload/ExportExcel",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },


            //删除得到新的数据
            getNewList: function (_source, set_data) {
                if (!_source)
                    _source = [];
                if (!set_data)
                    set_data = [];
                var rst = [];
                for (var i = 0; i < _source.length; i++) {
                    var NotOWn = false;
                    for (var j = 0; j < set_data.length; j++) {
                        if (_source[i].RiskID == set_data[j].RiskID) {
                            _source.splice(i, 1);
                            set_data.splice(j, 1);
                            NotOWn = true;
                        }
                        if (set_data.length < 1) {
                            break;
                        }
                        if (NotOWn) {
                            model.com.getNewList(_source, set_data);
                        }
                    }

                }
                rst = _source;
                return rst;
            },
            //得到ID
            GetMaxID: function (_source) {
                var id = 0;
                if (!_source)
                    _source = [];
                $.each(_source, function (i, item) {
                    if (item.ID > id)
                        id = item.ID;
                });
                return id + 1;

            },
        }
    }),

        model.init();


});