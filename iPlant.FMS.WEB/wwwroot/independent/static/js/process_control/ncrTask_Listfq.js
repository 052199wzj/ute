require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/cross2.js', '../static/utils/js/charf.js', '../static/utils/js/base/jquery.treeview', '../static/utils/js/pickPeopleWeb', '../static/utils/js/pickDepartment'
], function ($zace, $com, $cross, $charf, $tree, $pick, $pickDepartment) {

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
        wProductLinkage,
        wLineList = [],
        wWorkShopList = [],
        model,
        wProduct = [],
        wHisTaskList,
        LoginID,
        mUpFlowID = -1,
        mLevel = -1,
        mWorkShopID = -1,
        mSerialNo = "",
        mProductTypeID = -1,
        mProductID = -1,
        mSource = -1,
        mUrgencyLevel = -1,
        mClassification = -1,
        mConclusionResult = -1,
        mOccurDeptID = -1,
        mResponsibleDeptID = -1,
        mStateID = -1,
        HTML;
    var styleControl = undefined;
    mTypeDone = 3;
    CheckResultList = ["合格", "合格", "不合格"];
    wLevelListName = ["", "I", "II"];
    wClassificationType = ["", "A", "B", "C"];
    wUrgencyLevelList = ["", "一般", "中等", "非常"];
    wSourceList = ["", "来料", "制程", "成品", "客退", "库存", "出货", "", "", "", "其他",];
    wResultName = ["无", "返工", "返修", "特采/让步", "报废", "拒收", "隔离流转", "上线挑选", "紧急放行", "其他"]
    ProcessInstanceID = 0;
    StatusList = [{ ID: 20, Name: "已完成" }];
    var DateList = [

    ];
    var ProductTypeList = [
        {
            ID: 1,
            Name: "单体"
        }, {
            ID: 2,
            Name: "模组"
        }
    ];
    var MakeMeasuresList = [
        {
            ID: 1,
            Name: "否No"
        }, {
            ID: 2,
            Name: "是Yes"
        }
    ];
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
        Name: '产品类型',
        TiTle: 'ProductType',
        Value: '',
    }, {
        Name: '不合格品来源',
        TiTle: 'Source',
        Value: '',
    }, {
        Name: '不合格品名称',
        TiTle: 'Product',
        Value: '',
    }, {
        Name: '产品型号',
        TiTle: 'LocoTypeNo',
        Value: '',
    }, {
        Name: '产品编号',
        TiTle: 'SerialNo',
        Value: '',
    }, {
        Name: '不合格品类型',
        TiTle: 'Classification',
        Value: '',
    }, {
        Name: '紧急程度',
        TiTle: 'UrgencyLevel',
        Value: '',
    }, {
        Name: '评审级别',
        TiTle: 'Level',
        Value: '',
    }, {
        Name: '不合格品数量',
        TiTle: 'Quantity',
        Value: '',
    }, {
        Name: '不合格品描述',
        TiTle: 'Description',
        Value: '',
    }, {
        Name: '相关人员',
        TiTle: 'DutyCarfID',
        Value: '',
    }, {
        Name: '发生单位',
        TiTle: 'OccurDept',
        Value: '',
    }, {
        Name: '责任单位',
        TiTle: 'ResponsibleDept',
        Value: '',
    }, {
        Name: '处置措施',
        TiTle: 'ConclusionResult',
        Value: '',
    }, {
        Name: '处理措施备注',
        TiTle: 'ConclusionDescription',
        Value: '',
    }, {
        Name: '是否要求制定纠正或预防措施',
        TiTle: 'MakeMeasures',
        Value: '',
    }, {
        Name: '制定日期',
        TiTle: 'MakeMeasuresDate',
        Value: '',
    }, {
        Name: '制定编号',
        TiTle: 'MakeMeasuresNo',
        Value: '',
    }, {
        Name: '评审人员',
        TiTle: 'Signature',
        Value: '',
    }, {
        Name: '处置结果',
        TiTle: 'DisposalResult',
        Value: '',
    }, {
        Name: '处置结果附件',
        TiTle: 'DisposalFileList',
        Value: '',
    }, {
        Name: '不合格品描述附件',
        TiTle: 'FileList',
        Value: '',
    }];
    wClassificationList = [
        {
            ID: 1,
            Name: "A"
        }, {
            ID: 2,
            Name: "B"
        }, {
            ID: 3,
            Name: "C"
        }
    ],
        wUrgencyLevel = [
            {
                ID: 1,
                Name: "一般"
            }, {
                ID: 2,
                Name: "中等"
            }, {
                ID: 3,
                Name: "非常"
            }
        ],
        wLevelList = [{
            ID: 1,
            Name: "I"
        }, {
            ID: 2,
            Name: "II"
        }
        ],
        wResultLists = [{
            ID: 1,
            Name: "返工"
        }, {
            ID: 2,
            Name: "返修"
        }, {
            ID: 3,
            Name: "特采/让步"
        }, {
            ID: 4,
            Name: "报废"
        },
        {
            ID: 5,
            Name: "拒收"
        },
        {
            ID: 6,
            Name: "隔离流转"
        }, {
            ID: 7,
            Name: "上线挑选"
        }, {
            ID: 8,
            Name: "紧急放行"
        }, {
            ID: 9,
            Name: "其他"
        }
        ];
    wNCRSourceList = [{
        ID: 1,
        Name: "来料"
    }, {
        ID: 2,
        Name: "制程"
    }, {
        ID: 3,
        Name: "成品"
    }, {
        ID: 4,
        Name: "客退"
    },
    {
        ID: 5,
        Name: "库存"
    },
    {
        ID: 6,
        Name: "出货"
    }, {
        ID: 10,
        Name: "其他"
    }
    ];


    HTML = {
        OtherSrcPdf: [
            '<li class="upload-img" style="float: left;"><div class="DIVImg" style="display: inline-block;position: relative;top: -7px;left: -12px;width: 20px;height: 20px; background-color: white;border-radius: 50%;"><img src="../static/images/checkbox/error.png" style="width: 20px;height: 20px;"></div><img  src="../static/images/checkbox/pdf.png" class="SrcDISplay" style="float: left;width: 30px;height: 30px;margin: 2px;" data-value={{Src}}> ',
            '</li>',
        ].join(""),
        OtherSrcExcel: [
            '<li class="upload-img" style="float: left;"><div class="DIVImg" style="display: inline-block;position: relative;top: -7px;left: -12px;width: 20px;height: 20px; background-color: white;border-radius: 50%;"><img src="../static/images/checkbox/error.png" style="width: 20px;height: 20px;"></div><img  src="../static/images/checkbox/excel.png" class="SrcDISplay" style="float: left;width: 30px;height: 30px;margin: 2px;" data-value={{Src}}> ',
            '</li>',
        ].join(""),
        OtherSrcDoc: [
            '<li class="upload-img" style="float: left;"><div class="DIVImg" style="display: inline-block;position: relative;top: -7px;left: -12px;width: 20px;height: 20px; background-color: white;border-radius: 50%;"><img src="../static/images/checkbox/error.png" style="width: 20px;height: 20px;"></div><img  src="../static/images/checkbox/word.png" class="SrcDISplay" style="float: left;width: 30px;height: 30px;margin: 2px;" data-value={{Src}}> ',
            '</li>',
        ].join(""),
        OtherSrcTxt: [
            '<li class="upload-img" style="float: left;"><div class="DIVImg" style="display: inline-block;position: relative;top: -7px;left: -12px;width: 20px;height: 20px; background-color: white;border-radius: 50%;"><img src="../static/images/checkbox/error.png" style="width: 20px;height: 20px;"></div><img  src="../static/images/checkbox/txt.png" class="SrcDISplay" style="float: left;width: 30px;height: 30px;margin: 2px;" data-value={{Src}}> ',
            '</li>',
        ].join(""),
        IMG: ['<li class="upload-img" style="float: left;"><div class="DIVImg" style="display: inline-block;position: relative;top: -7px;left: -12px;width: 20px;height: 20px; background-color: white;border-radius: 50%;"><img src="../static/images/checkbox/error.png" style="width: 20px;height: 20px;"></div><img  class="ShowImg SrcDISplay"  src="{{Src}}" data-value="{{Src}}"  data-id="{{Id}}" style="float: left;width: 30px;height: 30px;margin: 2px;"> ',

            '</li>',
        ].join(""),
        ButtonMode: [
            ' <button type="button"  class="btn zaceStatusCommit ds-bpm-btn lmvt-def-btn"  data-prop="{{Name}}" data-valueText="{{Text}}" data-value="{{Value}}">',
            '  <span class="glyphicon " aria-hidden="true"></span>{{Text}}',
            ' </button>',
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
            '<td style="min-width: 30px;max-width: 120px;" data-title="#" data-value="#"><div class="td-contain"><span class="td-contain-list" id="cby-add-pencil" >办理任务</span> </div> </td>  ',
            '</tr>',
        ].join(""),
        TableModeCommitDetail: [
            '<tr>',
            '<td  style="min-width: 50px;display:none" data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td style="min-width: 50px;display:none" data-title="StepID" data-value="{{StepID}}">{{StepID}}</td> ',
            '<td data-title="Code" data-value="{{Code}}" >{{Code}}</td>',
            '<td data-title="LevelName" data-value="{{LevelName}}" >{{LevelName}}</td>',
            '<td data-title="SourceName" data-value="{{SourceName}}" >{{SourceName}}</td>',
            '<td data-title="Product" data-value="{{Product}}" >{{Product}}</td>',
            '<td data-title="LocoTypeNo" data-value="{{LocoTypeNo}}" >{{LocoTypeNo}}</td>',
            '<td data-title="SerialNo" data-value="{{SerialNo}}" >{{SerialNo}}</td>',
            '<td data-title="UrgencyLevelName" data-value="{{UrgencyLevelName}}" >{{UrgencyLevelName}}</td>',
            '<td data-title="ClassificationName" data-value="{{ClassificationName}}" >{{ClassificationName}}</td>',
            '<td data-title="ConclusionResultName" data-value="{{ConclusionResultName}}" >{{ConclusionResultName}}</td>',
            '<td data-title="UpFlowName" data-value="{{UpFlowName}}" >{{UpFlowName}}</td>',
            '<td data-title="CreateTimeText" data-value="{{CreateTimeText}}" >{{CreateTimeText}}</td>',
            '<td data-title="SubmitTime" data-value="{{SubmitTime}}" >{{SubmitTime}}</td>',
            '<td data-title="StatusText" data-value="{{StatusText}}" >{{StatusText}}</td>',
            '<td style="min-width: 30px;max-width: 120px;" data-title="#" data-value="#"><div class="td-contain"><span class="td-contain-list" id="cby-add-pencilDetail" >任务详情</span> </div> </td>  ',
            '</tr>',
        ].join(""),

        ImgList: [
            '<img class="ShowImg" src="{{Value}}" data-source="{{Value}}"  data-id="{{Value}}" style="width: 30px;height: 30px;margin: 2px;"></img>',
        ],
        ReadOnlyOneImg: [
            '<div  class="TempTable" style=" display: flex;width: 100%;float: left;">',
            '<div class="FieldName" style="width: 19.5%;"><span class="ContentshowName">{{Name}}</span></div>',
            '<div class="FieldContentOne" style="width: 80.5%;padding:0px"><div class="upload-img" style="margin-left: 2.8%;">{{ImgList}}</div></div>',
            '</div>',
        ].join(""),
        ReadOnlyImg: [
            '<div class="TempTable">',
            '<div class="FieldName" style="width: 39%;"><span class="ContentshowName">{{Name}}</span></div>',
            '<div class="FieldContentTwo" style="padding:0px"><div class="upload-img" style="margin-left: 7%;">{{ImgList}}</div></div>',
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

        TableModeTemp: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td data-title="PackgeNo" data-value="{{PackgeNo}}" >{{PackgeNo}}</td>',
            '<td data-title="LineName" data-value="{{LineName}}" >{{LineName}}</td>',
            '<td data-title="WorkShopName" data-value="{{WorkShopName}}" >{{WorkShopName}}</td>',
            '<td data-title="EditorName" data-value="{{EditorName}}" >{{EditorName}}</td>',
            '<td data-title="EditTime" data-value="{{EditTime}}" >{{EditTime}}</td>',
            '</tr>',
        ].join(""),

    };
    (function () {
        KEYWORD_Level_LIST = [
            "MakeMeasuresDate|开始时间|DateTime",
        ];
        KEYWORD_Level = {};
        FORMATTRT_Level = {};

        DEFAULT_VALUE_Level = {
        };

        TypeSource_Level = {
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
        name: '不合格评审流程',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            $("body").delegate(".SrcDISplay", "click", function () {
                $this = $(this);
                window.open($this.attr("data-value"));
            })
            //时间选择
            $("body").delegate(".Write-Control-MakeMeasuresDate", "click", function () {

                var DEFAULT_VALUE = {
                    MakeMeasuresDate: "",
                }

                $("body").append($com.modal.show(DEFAULT_VALUE, KEYWORD_Level, "制定日期", function (rst) {
                    //调用插入函数 

                    if (!rst || $.isEmptyObject(rst))
                        return;

                    $('.Write-content-MakeMeasuresDate').text($com.util.format("yyyy-MM-dd hh:mm", rst.MakeMeasuresDate));
                }, TypeSource_Level));

            });
            //不合格评审是否合格
            $("body").delegate("input[type='checkbox'].switch", "click", function () {
                $this = $(this);
                var Value = Number($this.attr("data-value"));
                if (Value == 1) {
                    $("input[type='checkbox'].switch").attr("data-value", 2);
                } else {
                    $("input[type='checkbox'].switch").attr("data-value", 1);
                }
            });

            //待办实时流程图
            $("body").delegate(".commit_route", "click", function () {
                var $src = $com.imageUrl + "/MESBPM/api/Repository/getRealFlowChart?processInstanceId=" + ProcessInstanceID;
                $("#cby-route-charf-ontask img").attr("src", $src);
                model.com.imgShow("#outerdiv", "#innerdiv", "#bigimg", $("#cby-route-charf-ontask img"));
            });
            //返回待办任务
            $("body").delegate("#cby-return-ontask", "click", function () {
                $("#cby-route-charf-ontask").hide();
            });
            //节点隐藏
            $("body").delegate("#lmvt-type-back", "click", function () {
                $(".bottom").hide();
                $(".cby-charf-detail-item").css("border", "1px solid rgb(218, 218, 218)")
            });

            //单条申请
            $("body").delegate("#applySingle", "click", function () {
                $(".BPM-title").text("发起不合格评审");
                mQueryTaskID = 0;
                $('.zacePlanTable').hide();
                $('.zacePlanCommit').hide();
                $('.zacePlanCommitDone').hide();
                $(".zacePlanSend").hide();
                $('.zacePencil').show();
                $('.zacePencilDone').hide();
                $(".Businessfq").hide();

                model.com.refreshTablePencil(0);
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
                var FileList = [];
                for (var i = 0; i < wHisTaskList.length; i++) {
                    if (wHisTaskList[i].ID == HisTaskID) {
                        HisTaskName = wHisTaskList[i].Name;
                    }
                    if (wHisTaskList[i].ID == HisTaskID && wHisTaskList[i].HisTaskVarinstList.length > 0) {
                        for (var k = 0; k < wHisTaskList[i].HisTaskVarinstList.length; k++) {
                            if (wHisTaskList[i].HisTaskVarinstList[k]._BPMActivitiForm.IsWritable && wHisTaskList[i].HisTaskVarinstList[k].Value.length != 0) {
                                DetailList.push({
                                    Name: wHisTaskList[i].HisTaskVarinstList[k]._BPMActivitiForm.Name,
                                    Value: wHisTaskList[i].HisTaskVarinstList[k].ValueText
                                })
                            }
                        }
                    }
                }
                var DetailListShow = [];
                for (var m = 0; m < DetailList.length; m++) {

                    if (DetailList[m].Name.indexOf("附件") != -1 || DetailList[m].Name.indexOf("图片") != -1) {
                        var Temp = "";
                        var TempList = DetailList[m].Value.split(",");
                        for (var k = 0; k < TempList.length; k++) {
                            if (TempList[k].indexOf("jpg") != -1 || TempList[k].indexOf("jpeg") != -1 || TempList[k].indexOf("png") != -1 || TempList[k].indexOf("gif") != -1) {
                                Temp = Temp + '<img class="ShowImg" src=' + TempList[k] + ' style="width: 30px;height: 30px;margin: 1px;"></img>'
                            } else if (TempList[k].indexOf("txt") != -1) {
                                Temp = Temp + '<img class="SrcDISplay" src="../static/images/checkbox/txt.png"  style="width: 30px;height: 30px;margin: 1px;" data-value=' + TempList[k] + '></img>'
                            } else if (TempList[k].indexOf("doc") != -1 || TempList[k].indexOf("docx") != -1) {
                                Temp = Temp + '<img class="SrcDISplay" src="../static/images/checkbox/doc.png"  style="width: 30px;height: 30px;margin: 1px;" data-value=' + TempList[k] + '></img>'
                            } else if (TempList[k].indexOf("xlsx") != -1 || TempList[k].indexOf("xls") != -1) {
                                Temp = Temp + '<img class="SrcDISplay" src="../static/images/checkbox/excel.png"  style="width: 30px;height: 30px;margin: 1px;" data-value=' + TempList[k] + '></img>'
                            } else if (TempList[k].indexOf("pdf") != -1) {
                                Temp = Temp + '<img class="SrcDISplay" src="../static/images/checkbox/pdf.png"  style="width: 30px;height: 30px;margin: 1px;" data-value=' + TempList[k] + '></img>'
                            }

                        }
                        if (Temp.length != 0) {
                            FileList.push({
                                Name: DetailList[m].Name,
                                ImgList: Temp
                            });
                        }
                    } else {
                        if (DetailList[m].Name == "评审人员") {
                            DetailList[m].Value = model.com.getUserName(DetailList[m].Value, wUser);
                        }
                        DetailListShow.push(DetailList[m]);
                    }
                }
                $(".BasicTableDeatil .FieldContentOne .Contentshow").text(HisTaskName);
                if (DetailListShow.length % 2 == 0) {
                    if (FileList.length > 0) {
                        $(".TableContentBasicDeatil .BasicTable").html($com.util.template(DetailListShow, HTML.ReadOnlyTwo) + $com.util.template(FileList, HTML.ReadOnlyOneImg));
                    } else if (FileList.length == 0) {
                        $(".TableContentBasicDeatil .BasicTable").html($com.util.template(DetailListShow, HTML.ReadOnlyTwo));
                    }
                } else {
                    var DateTwo = [];
                    var DateOne = DetailListShow[DetailListShow.length - 1];
                    for (var i = 0; i < DetailListShow.length - 1; i++) {
                        DateTwo.push(DetailListShow[i]);
                    }
                    if (FileList.length > 0) {
                        $(".TableContentBasicDeatil .BasicTable").html($com.util.template(DetailListShow, HTML.ReadOnlyTwo) + $com.util.template(FileList, HTML.ReadOnlyImg));
                    } else if (FileList.length == 0) {
                        $(".TableContentBasicDeatil .BasicTable").html($com.util.template(DateTwo, HTML.ReadOnlyTwo) + $com.util.template(DateOne, HTML.ReadOnlyOne));
                    }
                }
            });
            //提交
            $("body").delegate(".zaceStatusCommit.ds-bpm-btn", "click", function () {
                $com.app.loading("提交中!");
                var $this = $(this);
                mCloneData[$this.attr("data-prop")] = $this.attr("data-value");
                var _text = $this.attr("data-valueText");

                model.com.addCheck(_text);
            });

            // 发起
            $("body").delegate("#zace-Send", "click", function () {
                $(".zacePlanSend").show();
                $('.zacePlanCommitDone').hide();
                $('.zacePlanCommit').hide();
                $('.zacePencil').hide();
                $('.zacePencilDone').hide();
                $('.zacePlanTable').hide();
                mTypeDone = 3;
                model.com.refreshSend(mZCommitStartTime, mZCommitEndTime);
            });

            //  处理信息 返回
            $("body").delegate("#zace-exportApproval-commitReturn", "click", function () {
                $(".bottom").hide();
                $('.zacePencil').hide();
                $('.zacePencilDone').hide();
                $('.zacePlanTable').hide();

                if (mTypeDone == 3) {
                    $('.zacePlanCommit').hide();
                    $('.zacePlanCommitDone').hide();
                    $(".zacePlanSend").show();
                    model.com.refreshSend(mZCommitStartTime, mZCommitEndTime);
                }

            });

            // 处理任务
            $("body").delegate("#cby-add-pencil", "click", function () {

                var $this = $(this);
                var $table = $this.closest("tr");
                var WID = Number($table.find('td[data-title=ID]').attr('data-value'));
                mQueryTaskID = Number($table.find('td[data-title=StepID]').attr('data-value'));
                var Status = Number($table.find('td[data-title=Status]').attr('data-value'));
                $('.zacePlanTable').hide();
                $('.zacePlanCommit').hide();
                $('.zacePlanCommitDone').hide();
                $(".zacePlanSend").hide();
                $('.zacePencil').show();
                $('.zacePencilDone').hide();
                $(".bottom").hide();
                $(".BPM-title").text("不合格评审处理信息");

                model.com.refreshTablePencil(WID);

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

            //发起 刷新
            $("body").delegate("#zace-refresh-Send", "click", function () {
                model.com.refreshSend();
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
                if (!confirm("确定撤销不合格评审吗？")) {
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

            // 上传附件
            $("body").delegate(".Write-content-ImageList", "change", function () {
                var self = this,
                    _data = self.files[0];
                if (_data) {
                    if (_data.size <= 0) {
                        alert("文件大小不能为空！");
                        clearFiles();
                        return;
                    }
                    if (_data.size > (1024 * 1024 * 10)) {
                        alert("请上传小于10M的文件！");
                        clearFiles();
                        return;
                    }

                    if (!extLimit(['jpg', 'png', 'gif', 'bmp', 'jpeg', "pdf", "doc", "docx", "xlsx", "txt", "xls"]).has(_data.name)) {
                        alert("请上传正确的文件！");
                        clearFiles();
                        return;
                    }

                    var form = new FormData();
                    form.append("file", _data);

                    //alert(_data.name);
                    $.ajax({ //
                        url: "/MESCore/api/Upload/Submit",
                        type: "POST",
                        data: form,
                        processData: false,
                        contentType: false,
                        dataType: "JSON"
                    }).done(function (data) {

                        if (data.resultCode === 1000) {
                            var $p = $(self).parent();
                            //  $p.before('.upload-btn').remove();

                            if (data.returnObject.file_id.indexOf("jpg") != -1 || data.returnObject.file_id.indexOf("jpeg") != -1 || data.returnObject.file_id.indexOf("png") != -1 || data.returnObject.file_id.indexOf("gif") != -1) {
                                $p.before($com.util.template({
                                    Src: data.returnObject.file_id,
                                    Id: data.returnObject.file_id
                                }, HTML.IMG));
                            } else if (data.returnObject.file_id.indexOf("txt") != -1) {
                                $p.before($com.util.template({
                                    Src: data.returnObject.file_id,
                                }, HTML.OtherSrcTxt));
                            } else if (data.returnObject.file_id.indexOf("doc") != -1 || data.returnObject.file_id.indexOf("docx") != -1) {
                                $p.before($com.util.template({
                                    Src: data.returnObject.file_id,
                                }, HTML.OtherSrcDoc));
                            } else if (data.returnObject.file_id.indexOf("xlsx") != -1 || data.returnObject.file_id.indexOf("xls") != -1) {
                                $p.before($com.util.template({
                                    Src: data.returnObject.file_id,
                                }, HTML.OtherSrcExcel));
                            } else if (data.returnObject.file_id.indexOf("pdf") != -1) {
                                $p.before($com.util.template({
                                    Src: data.returnObject.file_id,
                                }, HTML.OtherSrcPdf));
                            }

                        } else {
                            alert("上传失败，请重新再试");
                        }

                        clearFiles();
                    });
                }

                function clearFiles() {
                    self.value = "";
                }

                function extLimit(exts) {
                    return {
                        has: function (file) {
                            var arr = file.split("."),
                                ext = arr[arr.length - 1].toLowerCase();

                            return exts.indexOf(ext) > -1 ? true : false;
                        }
                    };
                }
            });

            //   查看图片
            $("body").delegate(".upload-img .ShowImg", "click", function () {
                var farImg = $(this).parent(".upload-img"),
                    imgObj = "",
                    imgList = [];
                $.each(farImg.children(".ShowImg"), function (i, item) {
                    imgObj = $(item).attr("src");
                    if (imgObj.length != 0) {
                        imgList.push(imgObj);
                    }
                });
                $.each(farImg.siblings(".upload-img").children(".ShowImg"), function (i, item) {
                    imgObj = $(item).attr("src");
                    if (imgObj.length != 0) {
                        imgList.push(imgObj);
                    }
                });
                PhotoList = imgList;
                $("body").append(HTML.Photo);
                var imgSrc = $(this).attr("src")
                $.each(PhotoList, function (p_i, p_item) {
                    var pImg = p_item;
                    if (pImg == imgSrc) {
                        $(".lmvt-change-photo").attr("data-index", p_i);
                        return false;
                    }
                })

                $(".lmvt-change-photo").css("background", "url(" + imgSrc + ") " + "no-repeat center");
            });

            //移除photo
            $("body").delegate(".lmvt-remove-photo", "click", function () {
                $(".lmvt-show-photo").remove();
            });

            //右看图片
            $("body").delegate(".lmvt-bottom-left", "click", function () {
                var index = Number($(".lmvt-change-photo").attr("data-index"));
                if (PhotoList) {
                    if (index == PhotoList.length - 1) {
                        alert("这是最后一张图片！");
                        return false;
                    }
                    else {
                        $(".lmvt-change-photo").css("background", "url(" + PhotoList[index + 1] + ") " + "no-repeat center");
                        $(".lmvt-change-photo").attr("data-index", index + 1);
                    }
                }
            });
            //左看图片
            $("body").delegate(".lmvt-bottom-right", "click", function () {
                var index = Number($(".lmvt-change-photo").attr("data-index"));
                if (PhotoList) {
                    if (index == 0) {
                        alert("这是第一张图片！");
                        return false;
                    }
                    else {
                        $(".lmvt-change-photo").css("background", "url(" + PhotoList[index - 1] + ") " + "no-repeat center");
                        $(".lmvt-change-photo").attr("data-index", index - 1);
                    }
                }

            });
            $("body").delegate(".DIVImg", "click", function () {
                var $this = $(this);
                if (!confirm("是否删除附件？")) {
                    return;
                }
                $this.siblings(".ShowImg").remove();
                $this.siblings(".SrcDISplay").remove();
                $this.remove();
            });
            $("body").delegate(".Write-Control-DutyCarfID", "click", function () {

                EchoData = [];
                if ($(".Write-content-DutyCarfID").attr("data-value").length > 1) {
                    EchoData = $(".Write-content-DutyCarfID").attr("data-value").split(",");
                }

                wPeople = {
                    EmployeeList: [],
                    DepartmentList: [],
                };
                var param = {
                    EchoData: EchoData,//回显数据
                    PeopleList: wPeople, //第一层（公司领导下所有部门以及下所有人员）
                    DepartmentList: wDepartment,//所有部门
                    UserList: wUser,//所有人员(已激活)
                    title1: "宁波中车新能源",  //主标题
                    title2: "宁波", //公司部门
                    mode: 2,   //1 单选 2多选(单选人员不包括部门)
                };

                $pick.show(param, function (mNameList) {
                    SelectPersonID = [];
                    for (var i = 0; i < mNameList.length; i++) {
                        SelectPersonID.push(mNameList[i]);
                    }
                    SelectPersonID = model.com.arryOnea(SelectPersonID);
                    //人员ID集合用string存取
                    var UserStr = "";
                    var StrArray = [];
                    var StrArrayName = [];
                    for (var m = 0; m < SelectPersonID.length; m++) {
                        StrArray.push(SelectPersonID[m].ID);
                        StrArrayName.push(SelectPersonID[m].Name + '(' + SelectPersonID[m].DepartmentName + ')');
                    }
                    $(".Write-content-DutyCarfID").text(StrArrayName);
                    $(".Write-content-DutyCarfID").attr("data-value", StrArray)
                });
            });

            $("body").delegate(".Write-Control-Signature", "click", function () {

                EchoData = [];
                if ($(".Write-content-Signature").attr("data-value").length > 1) {
                    EchoData = $(".Write-content-Signature").attr("data-value").split(",");
                }

                wPeople = {
                    EmployeeList: [],
                    DepartmentList: [],
                };
                var param = {
                    EchoData: EchoData,//回显数据
                    PeopleList: wPeople, //第一层（公司领导下所有部门以及下所有人员）
                    DepartmentList: wDepartment,//所有部门
                    UserList: wUser,//所有人员(已激活)
                    title1: "宁波中车新能源",  //主标题
                    title2: "宁波", //公司部门
                    mode: 2,   //1 单选 2多选(单选人员不包括部门)
                };

                $pick.show(param, function (mNameList) {
                    SelectPersonID = [];
                    for (var i = 0; i < mNameList.length; i++) {
                        SelectPersonID.push(mNameList[i]);
                    }
                    SelectPersonID = model.com.arryOnea(SelectPersonID);
                    //人员ID集合用string存取
                    var UserStr = "";
                    var StrArray = [];
                    var StrArrayName = [];
                    for (var m = 0; m < SelectPersonID.length; m++) {
                        StrArray.push(SelectPersonID[m].ID);
                        StrArrayName.push(SelectPersonID[m].Name + '(' + SelectPersonID[m].DepartmentName + ')');
                    }
                    $(".Write-content-Signature").text(StrArrayName);
                    $(".Write-content-Signature").attr("data-value", StrArray)
                });
            });

            $("body").delegate(".writeContent input", "input", function () {
                $this = $(this);
                $this.attr("data-value", $this.val());
            });

            $("body").delegate(".Write-content-ProductTypeID", "change", function () {
                $this = $(this);
                $this.attr("data-value", $this.val());
            });
            $("body").delegate(".Write-content-MakeMeasuresDate", "change", function () {
                $this = $(this);
                $this.attr("data-value", $this.text());
            });
            $("body").delegate(".Write-Control-Product", "click", function () {
                var selectProductTypeID = $(".Write-content-ProductTypeID").attr("data-value");
                if (selectProductTypeID == 0) {
                    alert("请先选择产品类别");
                    return false;
                }
            });

            $("body").delegate(".Write-Control-ProductTypeID", "change", function () {
                var selectProductTypeID = $(".Write-content-ProductTypeID").attr("data-value");
                var wProductList = [];
                for (var i = 0; i < wProductLinkage.length; i++) {
                    if (wProductLinkage[i].ProductTypeID == selectProductTypeID) {
                        wProductList.push(wProductLinkage[i]);
                    }
                }
                var selectProduct = $("#slpkProduct");
                model.com.ProcessingData(wProductList, selectProduct);

            });

            //查询
            $("body").delegate("#lmvt-search", "click", function () {
                ISTime = 1;
                //查询开始时间
                mZCommitStartTime = $("#lmvt-startTime").val();
                //查询结束时间
                mZCommitEndTime = $("#lmvt-endTime").val();
                if (mZCommitStartTime == "" || mZCommitEndTime == "") {
                    mZCommitStartTime = $com.util.format("yyyy-MM-dd", new Date().getTime() - 30 * 24 * 3600 * 1000);
                    mZCommitEndTime = $com.util.format("yyyy-MM-dd", new Date().getTime() + 24 * 3600 * 1000);
                }
                mUpFlowID = $(".search-content-UpFlowID").attr("data-value") == 0 ? -1 : $(".search-content-UpFlowID").attr("data-value");
                mLevel = $(".search-content-Level").val() == 0 ? -1 : $(".search-content-Level").val();
                mWorkShopID = $(".search-content-WorkShopID").val() == 0 ? -1 : $(".search-content-WorkShopID").val();
                mSerialNo = $(".search-content-SerialNo").val() == "" ? "" : $(".search-content-SerialNo").val();
                mProductTypeID = $(".search-content-ProductTypeID").val() == 0 ? -1 : $(".search-content-ProductTypeID").val();
                mProductNo = $(".search-content-ProductNo").val() == 0 ? -1 : $(".search-content-ProductNo").val();
                mSource = $(".search-content-Source").val() == 0 ? -1 : $(".search-content-Source").val();
                mUrgencyLevel = $(".search-content-UrgencyLevel").val() == 0 ? -1 : $(".search-content-UrgencyLevel").val();
                mClassification = $(".search-content-Classification").val() == 0 ? -1 : $(".search-content-Classification").val();
                mConclusionResult = $(".search-content-ConclusionResult").val() == 0 ? -1 : $(".search-content-ConclusionResult").val();
                mStateID = $(".search-content-Status").val() == 0 ? -1 : $(".search-content-Status").val();
                mOccurDeptID = $(".search-content-OccurDeptID").attr("data-value") == 0 ? -1 : $(".search-content-OccurDeptID").attr("data-value");
                mResponsibleDeptID = $(".search-content-ResponsibleDeptID").attr("data-value") == 0 ? -1 : $(".search-content-ResponsibleDeptID").attr("data-value");
                model.com.refreshSend(mZCommitStartTime, mZCommitEndTime);
            });
            //重置
            $("body").delegate("#lmvt-reset", "click", function () {
                $("#lmvt-startTime").val("");
                $("#lmvt-endTime").val("");
                mZCommitStartTime = $com.util.format("yyyy-MM-dd", new Date().getTime() - 30 * 24 * 3600 * 1000);
                mZCommitEndTime = $com.util.format("yyyy-MM-dd", new Date().getTime() + 24 * 3600 * 1000);
                $("select.selectpicker").each(function () {
                    $(this).selectpicker('val', $(this).find('option:first').val());    //重置bootstrap-select显示
                    $(this).find("option").attr("selected", false);                    //重置原生select的值
                    $(this).find("option:first").attr("selected", true);
                });
                $(".search-content-UpFlowID").val("");
                $(".search-content-UpFlowID").attr("data-value", 0)
                mUpFlowID = -1;
                $(".search-content-OccurDeptID").val("");
                $(".search-content-OccurDeptID").attr("data-value", 0)
                mOccurDeptID = -1;
                $(".search-content-ResponsibleDeptID").val("");
                $(".search-content-ResponsibleDeptID").attr("data-value", 0)
                mResponsibleDeptID = -1;
                $(".search-content-SerialNo").val("");
                $(".search-content-SerialNo").attr("data-value", 0);
                mSerialNo = "";

                mLevel = -1;
                mWorkShopID = -1;
                mProductTypeID = -1;
                mProductID = -1;
                mSource = -1;
                mUrgencyLevel = -1;
                mClassification = -1;
                mConclusionResult = -1;
                mStateID = -1;

            });
            $("#lmvt-startTime").datetimepicker({
                format: 'yyyy-mm-dd',//显示格式
                startView: 'year',
                maxView: 'year',
                minView: 'month',
                language: 'zh-CN',
                autoclose: true,//选择后自动关闭
                clearBtn: true,//清除按钮
                todayBtn: true,
                showClear: true,
            }).on('changeDate', function (ev) {
                var startTime = $("#lmvt-startTime").val();
                $("#lmvt-endTime").datetimepicker("setStartDate", startTime);
            });
            $("#lmvt-endTime").datetimepicker({
                format: 'yyyy-mm-dd',//显示格式
                startView: 'year',
                maxView: 'year',
                minView: 'month',
                language: 'zh-CN',
                autoclose: true,//选择后自动关闭
                clearBtn: true,//清除按钮
                todayBtn: true,
                showClear: true,
            }).on('changeDate', function (ev) {
                var endTime = $("#lmvt-endTime").val();
                $("#lmvt-startTime").datetimepicker("setEndDate", endTime.toString("yyyy-MM-dd"));
            });
            //展开
            $("body").delegate("#lmvt-resetZK", "click", function () {
                $(".ds-search-top-contain").attr("data-show-mode", 1);
                $(window).resize();
            });
            //收起
            $("body").delegate("#lmvt-resetSQ", "click", function () {
                $(".ds-search-top-contain").attr("data-show-mode", 0);
                $(window).resize();
            });

            window.resizeObjectArray.splice(0, 0, function () {
                $(".ds-search-top-contain").each(function (i, item) {
                    model.com.searchTopHeight($(item));
                });
            })

            //查询发起人
            $("body").delegate(".search-content-UpFlowID", "click", function () {

                EchoData = [];
                if ($(".search-content-UpFlowID").attr("data-value").length > 1) {
                    EchoData = $(".search-content-UpFlowID").attr("data-value").split(",");
                }

                wPeople = {
                    EmployeeList: [],
                    DepartmentList: [],
                };
                var param = {
                    EchoData: EchoData,//回显数据
                    PeopleList: wPeople, //第一层（公司领导下所有部门以及下所有人员）
                    DepartmentList: wDepartment,//所有部门
                    UserList: wUser,//所有人员(已激活)
                    title1: "宁波中车新能源",  //主标题
                    title2: "宁波", //公司部门
                    mode: 1,   //1 单选 2多选(单选人员不包括部门)
                };

                $pick.show(param, function (mNameList) {
                    SelectPersonID = [];
                    for (var i = 0; i < mNameList.length; i++) {
                        SelectPersonID.push(mNameList[i]);
                    }
                    SelectPersonID = model.com.arryOnea(SelectPersonID);
                    //人员ID集合用string存取
                    var UserStr = "";
                    var StrArray = [];
                    var StrArrayName = [];
                    for (var m = 0; m < SelectPersonID.length; m++) {
                        StrArray.push(SelectPersonID[m].ID);
                        StrArrayName.push(SelectPersonID[m].Name + '(' + SelectPersonID[m].DepartmentName + ')');
                    }
                    $(".search-content-UpFlowID").val(StrArrayName);
                    $(".search-content-UpFlowID").attr("data-value", StrArray)
                    mUpFlowID = StrArray[0];
                });
            });

            //查询发生单位
            $("body").delegate(".search-content-OccurDeptID", "click", function () {
                EchoData = [];
                if ($(".search-content-OccurDeptID").attr("data-value").length > 1) {
                    EchoData = $(".search-content-OccurDeptID").attr("data-value").split(",");
                }

                var param = {
                    EchoData: EchoData,//回显数据
                    DepartmentList: wDepartment,//所有部门
                    title1: "宁波中车新能源",  //主标题
                    title2: "宁波", //公司部门
                    mode: 1,   //1 单选 2多选(单选人员不包括部门)
                };

                $pickDepartment.show(param, function (mNameList) {
                    SelectPersonID = [];
                    for (var i = 0; i < mNameList.length; i++) {
                        SelectPersonID.push(mNameList[i]);
                    }
                    SelectPersonID = model.com.arryOnea(SelectPersonID);
                    //人员ID集合用string存取
                    var UserStr = "";
                    var StrArray = [];
                    var StrArrayName = [];
                    for (var m = 0; m < SelectPersonID.length; m++) {
                        StrArray.push(SelectPersonID[m].DepartmentID);
                        StrArrayName.push(SelectPersonID[m].DepartmentName);
                    }
                    $(".search-content-OccurDeptID").val(StrArrayName);
                    $(".search-content-OccurDeptID").attr("data-value", StrArray)
                    mOccurDeptID = StrArray[0];
                });
            });

            //查询责任单位
            $("body").delegate(".search-content-ResponsibleDeptID", "click", function () {
                EchoData = [];
                if ($(".search-content-ResponsibleDeptID").attr("data-value").length > 1) {
                    EchoData = $(".search-content-ResponsibleDeptID").attr("data-value").split(",");
                }
                var param = {
                    EchoData: EchoData,//回显数据
                    DepartmentList: wDepartment,//所有部门
                    title1: "宁波中车新能源",  //主标题
                    title2: "宁波", //公司部门
                    mode: 1,   //1 单选 2多选(单选人员不包括部门)
                };

                $pickDepartment.show(param, function (mNameList) {
                    SelectPersonID = [];
                    for (var i = 0; i < mNameList.length; i++) {
                        SelectPersonID.push(mNameList[i]);
                    }
                    SelectPersonID = model.com.arryOnea(SelectPersonID);
                    //人员ID集合用string存取
                    var UserStr = "";
                    var StrArray = [];
                    var StrArrayName = [];
                    for (var m = 0; m < SelectPersonID.length; m++) {
                        StrArray.push(SelectPersonID[m].DepartmentID);
                        StrArrayName.push(SelectPersonID[m].DepartmentName);
                    }
                    $(".search-content-ResponsibleDeptID").val(StrArrayName);
                    $(".search-content-ResponsibleDeptID").attr("data-value", StrArray)
                    mResponsibleDeptID = StrArray[0];
                });
            });

            //选择发生单位
            $("body").delegate(".Write-Control-OccurDeptID", "click", function () {
                EchoData = [];
                if ($(".Write-content-OccurDeptID").attr("data-value").length > 1) {
                    EchoData = $(".Write-content-OccurDeptID").attr("data-value").split(",");
                }

                var param = {
                    EchoData: EchoData,//回显数据
                    DepartmentList: wDepartment,//所有部门
                    title1: "宁波中车新能源",  //主标题
                    title2: "宁波", //公司部门
                    mode: 1,   //1 单选 2多选(单选人员不包括部门)
                };

                $pickDepartment.show(param, function (mNameList) {
                    SelectPersonID = [];
                    for (var i = 0; i < mNameList.length; i++) {
                        SelectPersonID.push(mNameList[i]);
                    }
                    SelectPersonID = model.com.arryOnea(SelectPersonID);
                    //人员ID集合用string存取
                    var UserStr = "";
                    var StrArray = [];
                    var StrArrayName = [];
                    for (var m = 0; m < SelectPersonID.length; m++) {
                        StrArray.push(SelectPersonID[m].DepartmentID);
                        StrArrayName.push(SelectPersonID[m].DepartmentName);
                    }
                    $(".Write-content-OccurDeptID").text(StrArrayName);
                    $(".Write-content-OccurDeptID").attr("data-value", StrArray)
                });
            });

            //选择责任单位
            $("body").delegate(".Write-Control-ResponsibleDeptID", "click", function () {
                EchoData = [];
                if ($(".Write-content-ResponsibleDeptID").attr("data-value").length > 1) {
                    EchoData = $(".Write-content-ResponsibleDeptID").attr("data-value").split(",");
                }

                var param = {
                    EchoData: EchoData,//回显数据
                    DepartmentList: wDepartment,//所有部门
                    title1: "宁波中车新能源",  //主标题
                    title2: "宁波", //公司部门
                    mode: 1,   //1 单选 2多选(单选人员不包括部门)
                };

                $pickDepartment.show(param, function (mNameList) {
                    SelectPersonID = [];
                    for (var i = 0; i < mNameList.length; i++) {
                        SelectPersonID.push(mNameList[i]);
                    }
                    SelectPersonID = model.com.arryOnea(SelectPersonID);
                    //人员ID集合用string存取
                    var UserStr = "";
                    var StrArray = [];
                    var StrArrayName = [];
                    for (var m = 0; m < SelectPersonID.length; m++) {
                        StrArray.push(SelectPersonID[m].DepartmentID);
                        StrArrayName.push(SelectPersonID[m].DepartmentName);
                    }
                    $(".Write-content-ResponsibleDeptID").text(StrArrayName);
                    $(".Write-content-ResponsibleDeptID").attr("data-value", StrArray)
                });
            });
        },

        run: function () {
            mQueryTaskID = 0;

            mZCommitStartTime = $com.util.format("yyyy-MM-dd", new Date().getTime() - 30 * 24 * 3600 * 1000);
            mZCommitEndTime = $com.util.format("yyyy-MM-dd", new Date().getTime() + 24 * 3600 * 1000);
            wUser = [];
            mUserObj = {};
            var selectStatus = $("#slpkStatus_search");
            model.com.ProcessingData(StatusList, selectStatus);

            var selectConclusionResult = $("#slpkConclusionResult");
            model.com.ProcessingData(wResultLists, selectConclusionResult);

            var selectConclusionResult_search = $("#slpConclusionResult_search");
            model.com.ProcessingData(wResultLists, selectConclusionResult_search);

            var selectMakeMeasures = $("#slpkMakeMeasures");
            model.com.ProcessingData(MakeMeasuresList, selectMakeMeasures);

            model.com.getFMCLine({ FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0 }, function (resP) {
                for (var i = 0; i < resP.list.length; i++) {
                    if (resP.list[i].Active == 1) {
                        wLineList.push(resP.list[i]);
                    }
                }
                var selectProductTypeID = $("#slpkProductTypeID");
                model.com.ProcessingData(wLineList, selectProductTypeID);

                var selectProductTypeID_search = $("#slpProductTypeID_search");
                model.com.ProcessingData(wLineList, selectProductTypeID_search);

                var selectLevel = $("#slpkLevel");
                model.com.ProcessingData(wLevelList, selectLevel);
                var selectLevel_search = $("#slpLevel_search");
                model.com.ProcessingData(wLevelList, selectLevel_search);

                var selectSource = $("#slpkSource");
                model.com.ProcessingData(wNCRSourceList, selectSource);

                var selectSource_search = $("#slpSource_search");
                model.com.ProcessingData(wNCRSourceList, selectSource_search);

                var selectClassification = $("#slpkClassification");
                model.com.ProcessingData(wClassificationList, selectClassification);

                var selectslpClassification_search = $("#slpClassification_search");
                model.com.ProcessingData(wClassificationList, selectslpClassification_search);

                var selectUrgencyLevel = $("#slpkUrgencyLevel");
                model.com.ProcessingData(wUrgencyLevel, selectUrgencyLevel);

                var selectUrgencyLevel_search = $("#slpUrgencyLevel_search");
                model.com.ProcessingData(wUrgencyLevel, selectUrgencyLevel_search);

                model.com.getFPCProduct({ BusinessUnitID: 0 }, function (resF) {

                    for (var i = 0; i < resF.list.length; i++) {
                        if (resF.list[i].Active == 1) {
                            resF.list[i].Name = resF.list[i].ProductName + "(" + resF.list[i].ProductNo + ")";
                            wProduct.push(resF.list[i]);
                        }
                    }
                    wProductLinkage = $com.util.Clone(wProduct);
                    var selectProduct = $("#slpkProduct");
                    model.com.ProcessingData(wProduct, selectProduct);

                    var selectProductNo_search = $("#slpProductNo_search");
                    model.com.ProcessingData(wProduct, selectProductNo_search);

                    //获取所有部门
                    model.com.getDepartment({
                    }, function (data) {
                        wDepartment = $com.util.Clone(data.list);
                        // var wDepartmentOccur = $com.util.Clone(data.list);
                        // var wDepartmentResponsible = $com.util.Clone(data.list);
                        // var selectOccurDeptID = $("#slpkOccurDeptID");
                        // model.com.ProcessingData(wDepartmentOccur, selectOccurDeptID);

                        // var selectResponsibleDeptID = $("#slpkResponsibleDeptID");
                        // model.com.ProcessingData(wDepartmentResponsible, selectResponsibleDeptID);
                        model.com.getFMCWorkShop({ FactoryID: 0, BusinessUnitID: 0 }, function (resW) {
                            for (var i = 0; i < resW.list.length; i++) {
                                if (resW.list[i].Active == 1) {
                                    wWorkShopList.push(resW.list[i]);
                                }
                            }
                            var selectslpkWorkShopID_search = $("#slpkWorkShopID_search");
                            model.com.ProcessingData(wWorkShopList, selectslpkWorkShopID_search);
                            model.com.getUser({}, function (res) {
                                $.each(res.list, function (i, item) {
                                    mUserObj[item.ID] = item.Name;
                                    if (item.Active == 1) {
                                        wUser.push(item);
                                    }

                                });
                                model.com.refreshSend(mZCommitStartTime, mZCommitEndTime);
                            });
                        });
                    });
                });
            });
        },


        com: {
            arryOnea: function (data) {
                var temp = {};
                var arr = [];
                var len = data.length;
                for (var i = 0; i < len; i++) {
                    if (!temp[data[i].ID]) {
                        temp[data[i].ID] = "abc";
                        arr.push(data[i]);
                    }
                }
                return arr;
            },
            searchTopHeight: function ($this) {
                var _SearchShowMode = $this.attr("data-show-mode");
                if (_SearchShowMode == 0) {
                    var _MaxLength = $this[0].offsetWidth - 10;
                    var _Length = $this.children(".ds-search-btn-group")[0].offsetWidth + 200;
                    $this.children(".ds-search-item-group:not(.ds-search-btn-group)").each(function (i, item) {
                        _Length += $(item).width();
                        if (_Length >= _MaxLength) {
                            $(item).hide();
                        } else {
                            $(item).show();
                        }
                    });
                    if (_Length >= _MaxLength) {
                        $("#lmvt-resetZK").show();
                        $("#lmvt-resetSQ").hide();
                    } else if (_Length < _MaxLength) {
                        $("#lmvt-resetSQ").hide();
                        $("#lmvt-resetZK").hide();
                    }
                } else {
                    $this.children(".ds-search-item-group:not(.ds-search-btn-group)").each(function (i, item) {
                        $(item).show();
                    });
                    $("#lmvt-resetZK").hide();
                    $("#lmvt-resetSQ").show();
                }
                var wTarget = $this[0].offsetHeight;
                // 设置div
                var height = "100% - " + wTarget + "px";
                $this.closest(".ds-search-top").css("height", wTarget + "px");
                $this.closest(".ds-search-top").next(".ds-contain-middle").css("height", "calc( " + height + ")");
            },
            ProcessingData: function (DataList, selectDate) {
                $(function () {
                    $(".selectpicker").selectpicker({
                        noneSelectedText: '请选择'//默认显示内容 
                    });
                    //数据赋值 
                    var select = selectDate;
                    var Flag = true;
                    for (var i = 0; i < DataList.length; i++) {
                        if (DataList[i].ID == 0) {
                            Flag = false;
                        }
                    }
                    if (Flag) {
                        DataList.unshift({
                            ID: "0",
                            Name: "请选择"
                        })
                    }
                    select.empty();
                    for (var i = 0; i < DataList.length; i++) {
                        Name = DataList[i].Name;
                        Value = DataList[i].ID;
                        select.append("<option value=" + Value + ">" + Name + "</option>");
                    }
                    // $('.selectpicker').selectpicker('val', '');
                    // $('.selectpicker').selectpicker('refresh');  //刷新数据源
                    // $(".bootstrap-select-searchbox input").removeAttr("disabled");

                    select.selectpicker('render');
                    select.selectpicker('refresh');
                    select.selectpicker();

                    $('.selectpicker').selectpicker({
                        language: 'zh_CN',
                        // 设置下拉方向始终向下
                        dropupAuto: false,
                        size: 4
                    })
                });
            },
            addCheck: function (Text) {
                _listCommitObj = $com.util.Clone(mCloneData);
                if (mQueryTaskID <= 0) {
                    _listCommitObj.Applier = _listCommitObj.UpFlowID + "";
                }
                _listCommitObj.SubmitTime = $com.util.format("yyyy-MM-dd hh:mm", _listCommitObj.SubmitTime);
                var _IsWrite = true;
                for (var i = 0; i < wFormPropertyList.length; i++) {
                    if ($(".Write-Control-" + wFormPropertyList[i].Key + ":visible") && $(".Write-Control-" + wFormPropertyList[i].Key).hasClass("Select")) {
                        $(".Write-content-" + wFormPropertyList[i].Key).attr("data-value", $("#slpk" + wFormPropertyList[i].Key).selectpicker('val'));

                        if ($(".Write-Control-Product").is(":visible")) {
                            var Product = $('#slpkProduct').val();
                            for (var k = 0; k < wProduct.length; k++) {
                                if (wProduct[k].ID == Product) {
                                    _listCommitObj.ProductID = wProduct[k].ID;
                                    _listCommitObj.ProductID_txt_ = wProduct[k].ProductNo;
                                }
                            }
                        }
                    }

                    var $WriteContent = $(".Write-content-" + wFormPropertyList[i].Key + ":visible");
                    if (!$WriteContent[0]) {
                        wFormPropertyList[i].Value = _listCommitObj[wFormPropertyList[i].Key];
                        wFormPropertyList[i].ValueText = _listCommitObj[wFormPropertyList[i].Key];
                        // if (!_listCommitObj[wFormPropertyList[i].Key]) {
                        //     alert(wFormPropertyList[i].Name + "必填，控件不存在!");
                        //     return false;
                        // }
                    } else {
                        wFormPropertyList[i].Value = $(".Write-content-" + wFormPropertyList[i].Key + ":visible").attr("data-value");

                        if ($(".Write-Control-" + wFormPropertyList[i].Key).hasClass("Select")) {
                            wFormPropertyList[i].ValueText = $("#slpk" + wFormPropertyList[i].Key).siblings(".bootstrap-select").find(".dropdown-toggle span").text();
                        } else if ($(".Write-Control-" + wFormPropertyList[i].Key).hasClass("Time")) {
                            wFormPropertyList[i].Value = $(".Write-content-" + wFormPropertyList[i].Key + ":visible").text();
                            wFormPropertyList[i].ValueText = $(".Write-content-" + wFormPropertyList[i].Key + ":visible").text();
                        } else if ($(".Write-Control-" + wFormPropertyList[i].Key).hasClass("Img")) {
                            if ($(".Write-Control-ImageList").is(":visible")) {
                                var FilePath = [];
                                $(".Write-Control-ImageList ul.upload-list li.upload-img .SrcDISplay").each(function (i, item) {
                                    var $Image = $(item),
                                        Src = $Image.attr("data-value");
                                    if (!FilePath)
                                        FilePath = [];
                                    FilePath.push(Src);
                                });
                                // var StringFilePath = FilePath.join(",");
                                wFormPropertyList[i].Value = FilePath;
                                wFormPropertyList[i].ValueText = FilePath;
                                if (Todotasks.ActivitiID == "QualitySend") {
                                    _listCommitObj.FileList = FilePath;
                                }

                                if (Todotasks.ActivitiID == "QualityEnd") {
                                    _listCommitObj.DisposalFileList = FilePath;
                                }

                            }
                        }
                        else {
                            wFormPropertyList[i].ValueText = $(".Write-content-" + wFormPropertyList[i].Key + ":visible").val();
                        }

                        if (wFormPropertyList[i].IsRequired && (!wFormPropertyList[i].Value || wFormPropertyList[i].Value == '' || wFormPropertyList[i].Value == '0')) {
                            alert(wFormPropertyList[i].Name + "必填!");
                            return false;
                        }
                    }
                    if (_IsWrite) {
                        _listCommitObj[wFormPropertyList[i].Key] = wFormPropertyList[i].Value;
                        _listCommitObj[wFormPropertyList[i].Key + "_txt_"] = $com.util.isEmpty(wFormPropertyList[i].ValueText + "") ? _listCommitObj[wFormPropertyList[i].Key] : wFormPropertyList[i].ValueText;
                    }
                }
                if ($com.util.format('yyyy-MM-dd hh:mm', _listCommitObj.MakeMeasuresDate) < $com.util.format('yyyy-MM-dd hh:mm', new Date()) && Todotasks.ActivitiID == "QualityApprover") {
                    alert("制定日期小于当前日期");
                    return false;
                }
                //附件
                $com.util.deleteLowerProperty(_listCommitObj);
                $com.app.loaded();
                if (!confirm("是否" + Text + "不合格评审？")) {
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
            //拿所有部门
            getDepartment: function (data, fn, context) {
                var d = {
                    $URI: "/Department/AllDepartment",
                    $TYPE: "get",
                    $SERVER: "/MESCore"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
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
            //查询车间列表
            getFMCWorkShop: function (data, fn, context) {
                var d = {
                    $URI: "/FMCWorkShop/All",
                    $TYPE: "get"
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
            deleteProcessInstance: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESQMS",
                    $URI: "/Runtime/deleteProcessInstance",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //用人拿任务(单条)  ID 
            getEmployeeInfo: function (data, fn, context) {
                var d = {
                    $URI: "/BPMTask/Info",
                    $TYPE: "get",
                    $SERVER: "/MESQMS"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //流程引擎 发起
            refreshSend: function (StartTime, EndTime) {
                $com.app.loading();

                model.com.getNCRTask({
                    FlowType: 1005,
                    UpFlowID: mUpFlowID,
                    Level: mLevel,
                    WorkShopID: mWorkShopID,
                    SerialNo: mSerialNo,
                    ProductTypeID: mProductTypeID,
                    ProductID: mProductID,
                    Source: mSource,
                    UrgencyLevel: mUrgencyLevel,
                    Classification: mClassification,
                    ConclusionResult: mConclusionResult,
                    OccurDeptID: mOccurDeptID,
                    ResponsibleDeptID: mResponsibleDeptID,
                    StateID: mStateID,
                    StartTime: StartTime,
                    EndTime: EndTime,
                }, function (data) {
                    wData = [];
                    for (var i = 0; i < data.list.length; i++) {
                        if (data.list[i].Status > 0) {
                            wData.push(data.list[i]);
                        }
                    }

                    wData = wData.sort(function (a, b) {
                        return a.CreateTime < b.CreateTime ? 1 : -1
                    });
                    for (var k = 0; k < wData.length; k++) {
                        if (wData[k].Status == 20) {
                            wData[k].StatusText = "已完成";
                        }
                        if (wData[k].Status == 21) {
                            wData[k].StatusText = "已撤销";
                        }
                        wData[k].CreateTimeText = $com.util.format('yyyy-MM-dd hh:mm', wData[k].CreateTime);
                        wData[k].SubmitTime = $com.util.format('yyyy-MM-dd hh:mm', wData[k].SubmitTime);
                        wData[k].LevelName=wLevelListName[wData[k].Level];
                        wData[k].SourceName=wSourceList[wData[k].Source];
                        wData[k].UrgencyLevelName=wUrgencyLevelList[wData[k].UrgencyLevel];
                        wData[k].ClassificationName=wClassificationType[wData[k].Classification];
                        wData[k].ConclusionResultName=wResultName[wData[k].ConclusionResult];
                    }
                    wDataSend = $com.util.Clone(wData);
                    $("#femi-zacePlanSend-tbody").html($com.util.template(wData, HTML.TableModeCommitDetail));
                    $(window).resize();
                    $com.app.loaded();
                });
            },

            //用人拿任务
            getNCRTask: function (data, fn, context) {
                var d = {
                    $URI: "/QMSTask/NCRTask",
                    $TYPE: "get",
                    $SERVER: "/MESQMS"
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

            refreshTablePencilDetail: function (wID) {
                $com.app.loading('数据加载中...');
                var taskIDObj = {
                    key: "_1005"
                };

                model.com.getEmployeeInfo({
                    ID: wID,
                    EventID: 1005,
                    Code: "",
                }, function (data) {

                    wInfo = data.info;
                    wstatus = wInfo.Status;
                    wFlowID = data.info.FlowID;
                    wFlowType = data.info.FlowType;

                    ProcessInstanceID = data.info.FlowID;
                    $com.util.deleteLowerProperty(wInfo);
                    mCloneDataInfo = $com.util.Clone(wInfo);
                    model.com.BuinessDetail(mCloneDataInfo, 2);

                    // model.com.getUser({}, function (res) {
                    //     $.each(res.list, function (i, item) {
                    //         mUserObj[item.ID] = item.Name;
                    //         if (item.Active == 1) {
                    //             wUser.push(item);
                    //         }

                    //     });

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

                // });
            },

            refreshTablePencil: function (wID) {
                $com.app.loading('数据加载中...');
                var taskIDObj = {
                    key: "_1005"
                };
                if (mQueryTaskID <= 0) {
                    //启动任务 processDefinitionKey流程定义key
                    model.com.onTask({
                        processDefinitionKey: taskIDObj.key,
                        BusinessKey: "", data: {}
                    }, [function (data) {
                        //获取实例ID
                        mCloneData = data.data;
                        mCloneData.MakeMeasuresDate = "2000-01-01 00:00"
                        $com.util.deleteLowerProperty(mCloneData);
                        mCloneDataInfo = $com.util.Clone(mCloneData);
                        model.com.BuinessDetail(mCloneDataInfo, 1);
                        Todotasks = data.list[0];
                        model.com.RunTaskTwo(data.list[0]);
                    }, function () {
                        setTimeout(function () {
                            $('.zacePlanCommit').show();
                            $('.zacePlanTable').hide();
                            $('.zacePlanTableCommit').hide();
                            model.com.refreshSend(mZCommitStartTime, mZCommitEndTime);
                        }, 1000);
                    }]);
                }
            },
            BuinessDetail: function (wInfo, type) {
                if (type == 1) {
                    $(".headerAll .BasicTable .FieldContentOne .Contentshow").text("待发起不合格评审");
                } else {
                    $(".headerAll .BasicTable .FieldContentOne .Contentshow").text(wInfo.StatusText);
                }
                wInfo.MakeMeasuresDate = $com.util.format('yyyy-MM-dd hh:mm', wInfo.MakeMeasuresDate);
                wInfo.CreateTime = $com.util.format('yyyy-MM-dd hh:mm', wInfo.CreateTime);
                wInfo.SubmitTime = $com.util.format('yyyy-MM-dd hh:mm', wInfo.SubmitTime);
                model.com.Handle(wInfo);
                var DetailList = [];
                var DetailBusiness = [];
                // var FileList = [];
                // var DisposalFileList = [];
                for (var i in wInfo) {
                    for (var k = 0; k < PropertyBasic.length; k++) {
                        if (PropertyBasic[k].TiTle == i && wInfo[i].length != 0) {
                            PropertyBasic[k].Value = wInfo[i];
                            DetailList.push(PropertyBasic[k]);
                        }
                    }

                    for (var k = 0; k < PropertyBusiness.length; k++) {
                        if (i == "FileList") {
                            var FileList = [];
                            var Temp = "";
                            for (var m = 0; m < wInfo[i].length; m++) {
                                if (wInfo[i][m].indexOf("jpg") != -1 || wInfo[i][m].indexOf("jpeg") != -1 || wInfo[i][m].indexOf("png") != -1 || wInfo[i][m].indexOf("gif") != -1) {
                                    Temp = Temp + '<img class="ShowImg" src=' + wInfo[i][m] + ' style="width: 30px;height: 30px;margin: 1px;"></img>'
                                } else if (wInfo[i][m].indexOf("txt") != -1) {
                                    Temp = Temp + '<img class="SrcDISplay" src="../static/images/checkbox/txt.png"  style="width: 30px;height: 30px;margin: 1px;" data-value=' + wInfo[i][m] + '></img>'
                                } else if (wInfo[i][m].indexOf("doc") != -1 || wInfo[i][m].indexOf("docx") != -1) {
                                    Temp = Temp + '<img class="SrcDISplay" src="../static/images/checkbox/doc.png"  style="width: 30px;height: 30px;margin: 1px;" data-value=' + wInfo[i][m] + '></img>'
                                } else if (wInfo[i][m].indexOf("xlsx") != -1 || wInfo[i][m].indexOf("xls") != -1) {
                                    Temp = Temp + '<img class="SrcDISplay" src="../static/images/checkbox/excel.png"  style="width: 30px;height: 30px;margin: 1px;" data-value=' + wInfo[i][m] + '></img>'
                                } else if (wInfo[i][m].indexOf("pdf") != -1) {
                                    Temp = Temp + '<img class="SrcDISplay" src="../static/images/checkbox/pdf.png"  style="width: 30px;height: 30px;margin: 1px;" data-value=' + wInfo[i][m] + '></img>'
                                }
                            }
                            if (Temp.length != 0) {
                                FileList.push({
                                    Name: "不合格品描述附件",
                                    ImgList: Temp
                                });
                            }
                        } else if (i == "DisposalFileList") {
                            var Temp = "";
                            var DisposalFileList = [];
                            for (var m = 0; m < wInfo[i].length; m++) {
                                if (wInfo[i][m].indexOf("jpg") != -1 || wInfo[i][m].indexOf("jpeg") != -1 || wInfo[i][m].indexOf("png") != -1 || wInfo[i][m].indexOf("gif") != -1) {
                                    Temp = Temp + '<img class="ShowImg" src=' + wInfo[i][m] + ' style="width: 30px;height: 30px;margin: 1px;"></img>'
                                } else if (wInfo[i][m].indexOf("txt") != -1) {
                                    Temp = Temp + '<img class="SrcDISplay" src="../static/images/checkbox/txt.png"  style="width: 30px;height: 30px;margin: 1px;" data-value=' + wInfo[i][m] + '></img>'
                                } else if (wInfo[i][m].indexOf("doc") != -1 || wInfo[i][m].indexOf("docx") != -1) {
                                    Temp = Temp + '<img class="SrcDISplay" src="../static/images/checkbox/doc.png"  style="width: 30px;height: 30px;margin: 1px;" data-value=' + wInfo[i][m] + '></img>'
                                } else if (wInfo[i][m].indexOf("xlsx") != -1 || wInfo[i][m].indexOf("xls") != -1) {
                                    Temp = Temp + '<img class="SrcDISplay" src="../static/images/checkbox/excel.png"  style="width: 30px;height: 30px;margin: 1px;" data-value=' + wInfo[i][m] + '></img>'
                                } else if (wInfo[i][m].indexOf("pdf") != -1) {
                                    Temp = Temp + '<img class="SrcDISplay" src="../static/images/checkbox/pdf.png"  style="width: 30px;height: 30px;margin: 1px;" data-value=' + wInfo[i][m] + '></img>'
                                }
                            }
                            if (Temp.length != 0) {
                                DisposalFileList.push({
                                    Name: "处置结果附件",
                                    ImgList: Temp
                                });
                            }
                        } else {
                            if (PropertyBusiness[k].TiTle == i && wInfo[i].length != 0) {
                                PropertyBusiness[k].Value = wInfo[i];
                                DetailBusiness.push(PropertyBusiness[k]);
                            }
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
                    if (FileList.length > 0 && DisposalFileList.length > 0) {
                        $(".BasicTableContentBusiness .BasicTable").html($com.util.template(DetailBusiness, HTML.ReadOnlyTwo) + $com.util.template(FileList, HTML.ReadOnlyImg) + $com.util.template(DisposalFileList, HTML.ReadOnlyImg));
                    } else if (FileList.length == 0 && DisposalFileList.length == 0) {
                        $(".BasicTableContentBusiness .BasicTable").html($com.util.template(DetailBusiness, HTML.ReadOnlyTwo));
                    } else {
                        $(".BasicTableContentBusiness .BasicTable").html($com.util.template(DetailBusiness, HTML.ReadOnlyTwo) + $com.util.template(FileList, HTML.ReadOnlyOneImg) + $com.util.template(DisposalFileList, HTML.ReadOnlyOneImg));
                    }
                } else {
                    var DateTwo = [];
                    var DateOne = DetailBusiness[DetailBusiness.length - 1];
                    for (var i = 0; i < DetailBusiness.length - 1; i++) {
                        DateTwo.push(DetailBusiness[i]);
                    }
                    if (FileList.length > 0 && DisposalFileList.length > 0) {
                        $(".BasicTableContentBusiness .BasicTable").html($com.util.template(DetailBusiness, HTML.ReadOnlyTwo) + $com.util.template(FileList, HTML.ReadOnlyImg) + $com.util.template(DisposalFileList, HTML.ReadOnlyOneImg));
                    } else if (FileList.length == 0 && DisposalFileList.length == 0) {
                        $(".BasicTableContentBusiness .BasicTable").html($com.util.template(DateTwo, HTML.ReadOnlyTwo) + $com.util.template(DateOne, HTML.ReadOnlyOne));
                    } else {
                        $(".BasicTableContentBusiness .BasicTable").html($com.util.template(DetailBusiness, HTML.ReadOnlyTwo) + $com.util.template(FileList, HTML.ReadOnlyImg) + $com.util.template(DisposalFileList, HTML.ReadOnlyImg));
                    }
                }
            },
            Handle: function (wInfo) {
                wInfo.Level = wLevelListName[wInfo.Level];
                wInfo.Classification = wClassificationType[wInfo.Classification];
                wInfo.Source = wSourceList[wInfo.Source];
                wInfo.UrgencyLevel = wUrgencyLevelList[wInfo.UrgencyLevel];
                wInfo.ConclusionResult = wResultName[wInfo.ConclusionResult];
                if (wInfo.MakeMeasures == 2) {
                    wInfo.MakeMeasures = "是 Yes";
                } else if (wInfo.MakeMeasures == 1) {
                    wInfo.MakeMeasures = "否 No";
                } else {
                    wInfo.MakeMeasures = "";
                }
                if ($com.util.format('yyyy-MM-dd hh:mm', wInfo.MakeMeasuresDate) < $com.util.format('yyyy-MM-dd hh:mm', "2010-1-1 01:01")) {
                    wInfo.MakeMeasuresDate = "";
                }
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
                                if (mQueryTaskID <= 0) {
                                    $(".Write-Control-DutyCarfID") + "{display:block;} ";
                                    $(".Write-Control-DutyCarfID") + "{display:flex;} "
                                }
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
                        if (mQueryTaskID <= 0) {
                            $(".Write-Control-DutyCarfID").css("display", "block");
                            $(".Write-Control-DutyCarfID").css("display", "flex");
                        }
                        $(".bootstrap-select.btn-group").css("margin-bottom", 0);
                        $com.app.loaded();
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
            getUserName: function (wIDString, list) {
                var wResult = [];
                var wIDArray = wIDString.split(",");
                $.each(list, function (i, item) {
                    $.each(wIDArray, function (j, item_j) {

                        if (item_j == item.ID) {
                            wResult.push(item.Name);
                        }
                    });
                });

                return wResult.join(",");
            },
            HisTaskShow: function (HisTaskArray) {
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
                $charf.getbasicData(".zaceLiuchengPencil", data);

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

            //启动任务 （通过流程定义的标识Key 开启一个流程实例）
            onTask: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESQMS",
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
                    $SERVER: "/MESQMS",
                    $URI: "/Runtime/CompleteMyPersonalTask",
                    $TYPE: "post"
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