require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/ganttGZWUtil'], function ($zace, $com, $ganttWeek) {


    var KEYWORD_condition_LIST,
        KEYWORD_condition,
        FORMATTRT_condition,
        DEFAULT_VALUE_condition,
        TypeSource_condition,
        mMutualTaskList,
        KEYWORD_Level_LISTItem,
        KEYWORD_LevelItem,
        FORMATTRT_LevelItem,
        DEFAULT_VALUE_LevelItem,
        TypeSource_LevelItem,
        MaterialList,
        mQueryTaskID,
        TaskID,
        model,
        VersionSource,
        DataPlanResult,
        MShiftID,
        MlineID,
        MShiftsDays,
        mCloneListRead,
        MWorkDayID,
        MShiftTime,
        DataOrderList,
        SelectionList,
        mStationlist,
        DataCondition,
        conditionChange,
        mMaxLoadRate,
        TablePartData,

        // 流程引擎周计划主单据
        mCloneData,
        //流程引擎待办任务
        Todotasks,
        //表格数据
        ISMove,

        //车间ID
        wWorkShopID,

        //周计划
        ganttDate,
        //云计算结果
        ChartData,
        //工段
        AllPart,
        pIndex, //日计划第几列
        GpartIndex,//工序第几行
        tempCat,
        tempgrace,
        mTableData,
        AllCustomerList,

        getGantteChangeSource,
        wWorkShopID,
        //渲染表格的数据
        tableList,

        //排程系数,
        param,
        //排程方式
        ModelType = 0,

        HTML;
    var MTCProperty = [{
        Name: '单据编号',
        TiTle: 'Code',
        Value: '',
    }, {
        Name: '发起人',
        TiTle: 'UpFlowName',
        Value: '',
    }];
    var styleControl = undefined;
    zaceSelectOrderList = [];//选择的排程订单
    zaceRouteList = [];//选择的订单路线


    mMutualTaskList = [];  //固定工位的计划数据
    Temp = {

        ID: 0,
        OrderID: 0,
        PartNo: "",
        TaskLineID: 0,
        WorkShopID: 0,
        LineID: 0,
        PartID: 0,
        WorkHour: 0,
        CraftMinutes: 0,
        ShiftID: 0,
        PlanerID: 0,
        ShiftPeriod: 5,
        SubmitTime: $com.util.format('yyyy-MM-dd ', new Date()),
        StartTime: $com.util.format('yyyy-MM-dd ', new Date()),
        EndTime: $com.util.format('yyyy-MM-dd ', new Date()),
        TaskStepList: [],
        UniqueID: 0,
        TaskPartList: [],
        PartOrder: 0,
        APSMessage: "",
        OrderNo: "",
        ProductNo: "",
        MaterialNo: "",
        MaterialName: "",
        PartName: "",
        BOMNo: "",
        Priority: 0,
        PlanerName: "",
        WorkShopName: "",
        LineName: "",
        Active: 0,
        TaskText: "",
        DelayHours: 0,
        Status: 0,
        ShiftDate: $com.util.format('yyyy-MM-dd ', new Date()),
    };

    var mDateEffect = 0;   //日期
    var mPartEffect = 0;  //工位
    var zaceTime;//最大时间
    var mLimitMinutes = 30;  //跨天限制时长（分钟）
    var mRedundantDays = 0;  //冗余天数
    mZaceTableGante = {};
    mOrderID = 0;//根据订单   车号查询
    CurDays = 30;
    var mMesList = [];
    mOrderList = [];
    var mApsList = [];//排程结果
    var mCondition = [];
    var SelDataOrderList = [];
    var mSelDataOrderList = [];
    var mConditionList = [];
    var mLevel = 0;
    var mCloseStationList = [];
    var Condition = [

        {
            ID: 1,
            Name: '预计开工时间',
            Priority: 0,
            PNo: 'StartDate',
            Level: 0,

        },
        {
            ID: 2,
            Name: '产线',
            Priority: 0,
            PNo: 'LineID',
            Level: 2,

        },
        {
            ID: 3,
            Name: '预计完工时间',
            Priority: 0,
            PNo: 'EndDate',
            Level: 0,

        }, {
            ID: 4,
            Name: '客户',
            Priority: 0,
            PNo: 'CustomerID',
            Level: 1,
        }, {
            ID: 5,
            Name: '型号',
            Priority: 0,
            PNo: 'ProductID',
            Level: 1,
        }
    ];
    DataCustomerItem = []; //局段  信息  input
    DataLineItem = []     //修程 信息  input
    DataProductItem = []

    AllCustomerList = [];  //局段
    MShiftID = 0;
    MlineID = 1;        //修程
    MWorkDayID = 1;     //作息
    MShiftsDays = 5;
    SelectionList = [];
    MShiftTime = $com.util.format('yyyy-MM-dd ', new Date());
    DataCondition = {};
    DataOrderList = [];
    DataPlanResult = [];
    ganttDate = [];
    TablePartData = [];
    ConditionLine = [];
    ConditionCustomer = [];

    mStartTimeNew = $com.util.format('yyyy-MM-dd', new Date());
    mEndTimeNew = $com.util.format('yyyy-MM-dd', new Date());

    mStartTime = $com.util.format('yyyy-MM-dd', new Date());
    mEndTime = $com.util.format('yyyy-MM-dd', new Date());

    var DataStationList = [];
    mZaceStation = 0;//固定工位默认值
    HTML = {
        WeekPlan: [
            '<div class="multi-flex" style="clear: both;">',
            '<div class="multi-flex m-detail-titlel"',
            'style="width: 30%;font-size: 18px;text-align: right;display: inline-block;">',
            '<label>{{Name}}</label>',
            '</div>',
            '<div class="multi-flex m-detail-titler"',
            'style="width: 69%;font-size: 18px;display: inline-block;text-align: left;">',
            '<input type="text" readonly="readonly" value="{{Value}}" style="border: none;" />',
            '</div>',
            '</div>',
        ].join(""),
        TimeTableHead: [
            '<th style=\"min-width:125px\" data-order="OrderNo">制造令</th>',
            '<th style=\"min-width:125px\" data-order="PartName">工序</th>',
        ].join(""),

        TimeTableBody: [
            '<td style=\"width:50px\" data-title="OrderNo" data-value="{{OrderNo}}">{{OrderNo}}</td>',
            '<td style=\"width:50px\" data-title="PartName" data-value="{{PartName}}">{{PartName}}</td>',
            
        ].join(""),

        TablePriority: [
            '<tr data-color="">',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
            '<td data-title="Priority" data-value="{{Priority}}" >{{Priority}}</td>',
            '</tr>',
        ].join(""),
        TableCusPriority: [
            '<tr data-color="">',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="CustomerName" data-value="{{CustomerName}}" >{{CustomerName}}</td>',
            '<td data-title="Priority" data-value="{{Priority}}" >{{Priority}}</td>',
            '</tr>',
        ].join(""),
        TableOrderModeShow: [
            '<tr data-color="">',
            '<td style="display:none" ><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td style="display:none" data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td data-title="OrderNo" data-value="{{OrderNo}}" >{{OrderNo}}</td>',
            '<td data-title="ProductNo" data-value="{{ProductNo}}">{{ProductNo}}</td>',
            '<td data-title="PlanFinishDate" data-value="{{PlanFinishDate}}" >{{PlanFinishDate}}</td>',

            '</tr>',
        ].join(""),
        TableOrderMode: [
            '<tr data-color="">',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td style="display:none" data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="display:none" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="OrderNo" data-value="{{OrderNo}}" >{{OrderNo}}</td>',
            '<td data-title="Customer" data-value="{{Customer}}" >{{Customer}}</td>',
            '<td data-title="LineID" data-value="{{LineID}}" >{{LineID}}</td>',
            '<td data-title="ProductID" data-value="{{ProductID}}" >{{ProductID}}</td>',
            '<td data-title="ProductNo" data-value="{{ProductNo}}" >{{ProductNo}}</td>',
            '<td data-title="FQTYPlan" data-value="{{FQTYPlan}}" >{{FQTYPlan}}</td>',
            // '<td data-title="Priority" data-value="{{Priority}}" >{{Priority}}</td>',
            '<td data-title="PlanReceiveDate" data-value="{{PlanReceiveDate}}" >{{PlanReceiveDate}}</td>',
            '<td data-title="PlanFinishDate" data-value="{{PlanFinishDate}}" >{{PlanFinishDate}}</td>',
            '<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',
            // '<td data-title="FQTYPlaned" data-value="{{FQTYPlaned}}" >{{FQTYPlaned}}</td>',
            // '<td data-title="FQTYMargin" data-value="{{FQTYMargin}}" >{{FQTYMargin}}</td>',
            '</tr>',
        ].join(""),

        TableOrderModePriority: [
            '<tr data-color="">',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td style="display:none" data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="display:none" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="OrderNo" data-value="{{OrderNo}}" >{{OrderNo}}</td>',
            '<td data-title="Customer" data-value="{{Customer}}" >{{Customer}}</td>',
            '<td data-title="LineID" data-value="{{LineID}}" >{{LineID}}</td>',
            '<td data-title="ProductID" data-value="{{ProductID}}" >{{ProductID}}</td>',
            '<td data-title="ProductNo" data-value="{{ProductNo}}" >{{ProductNo}}</td>',
            '<td data-title="FQTYPlan" data-value="{{FQTYPlan}}" >{{FQTYPlan}}</td>',
            // '<td data-title="Priority" data-value="{{Priority}}" >{{Priority}}</td>',
            '<td data-title="PlanReceiveDate" data-value="{{PlanReceiveDate}}" >{{PlanReceiveDate}}</td>',
            '<td data-title="PlanFinishDate" data-value="{{PlanFinishDate}}" >{{PlanFinishDate}}</td>',
            '<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',
            '<td style="min-width: 40px" data-title="Handle" data-value="{{ID}}"><div class="row">',
            '<div class="col-md-12"><img class="zace-downImage lmvt-down" src="../static/images/down.png" height="23px" width="23px" style="" /><img class="zace-upImage lmvt-up" src="../static/images/up.png" height="23px" width="23px" style="" /></div>',
            '</td>',
            // '<td data-title="FQTYPlaned" data-value="{{FQTYPlaned}}" >{{FQTYPlaned}}</td>',
            // '<td data-title="FQTYMargin" data-value="{{FQTYMargin}}" >{{FQTYMargin}}</td>',
            '</tr>',
        ].join(""),

        TablePlanMode: [
            '<tr data-color="">',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="ShiftName" data-value="{{ShiftName}}" >{{ShiftName}}</td>',
            '<td data-title="LineName" data-value="{{LineName}}" >{{LineName}}</td>',
            '<td data-title="MaterialNo" data-value="{{MaterialNo}}" >{{MaterialNo}}</td>',
            '<td data-title="MaterialName" data-value="{{MaterialName}}" >{{MaterialName}}</td>',
            '<td data-title="OrderNo" data-value="{{OrderNo}}" >{{OrderNo}}</td>',
            '<td data-title="FQTY" data-value="{{FQTY}}" >{{FQTY}}</td>',
            '<td data-title="FQTYShift" data-value="{{FQTYShift}}" >{{FQTYShift}}</td>',
            '<td data-title="ProductNo" data-value="{{ProductNo}}" >{{ProductNo}}</td>',
            '<td data-title="SubmitTime" data-value="{{SubmitTime}}" >{{SubmitTime}}</td>',
            '</tr>',
        ].join(""),

        TableConditionMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="UnitLevel" data-value="{{UnitLevel}}" >{{UnitLevel}}</td>',
            '<td data-title="ShiftPeriod" data-value="{{ShiftPeriod}}" >{{ShiftPeriod}}</td>',
            '<td data-title="MaxLoadRate" data-value="{{MaxLoadRate}}" >{{MaxLoadRate}}</td>',
            '<td data-title="CheckWorkHours" data-value="{{CheckWorkHours}}" >{{CheckWorkHours}}</td>',
            '<td data-title="CheckShiftHours" data-value="{{CheckShiftHours}}" >{{CheckShiftHours}}</td>',
            '</tr>',
        ].join(""),
        PriorityItem: [
            '<div class="content-zaceLine" style="height:30px;width:100%">',
            '<input type="checkbox" value="{{ID}}" data-index={{Index}} style="margin-left:10px"/><span style="font-size: 14px;margin-left:10px">{{Name}}</span>',
            '<a><img class="zace-downImage" src="../static/images/down.png" height="23px" width="23px" style="float: right;margin-right:10px" /> </a>',
            '<a><img class="zace-upImage" src="../static/images/up.png" height="23px"width="23px" style="float: right;margin-right:10px" /></a>',
            '</div>',
        ].join(""),




        TableUserItemNode: [
            '<tr data-color="">',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  style="display:none" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="OrderNo" data-value="{{OrderNo}}" >{{OrderNo}}</td>',
            '<td data-title="BureauSectionID" data-value="{{BureauSectionID}}" >{{BureauSectionID}}</td>',
            '<td data-title="LineID" data-value="{{LineID}}" >{{LineID}}</td>',
            '<td data-title="ProductID"  data-value="{{ProductID}}" >{{ProductID}}</td>',
            // '<td data-title="PartNo"  data-value="{{PartNo}}" >{{PartNo}}</td>',
            '<td data-title="PartNoText"  data-value="{{PartNoText}}" >{{PartNoText}}</td>',
            // '<td style="display:none" data-title="TaskLineID" data-value="{{TaskLineID}}" >{{TaskLineID}}</td>',


        ].join(""),



        thead: [
            '<tr>',
            '<th><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            // '<th data-order="ID"  style="min-width: 50px">序号</td>',
            '<th data-order="OrderNo" style="min-width: 50px" >WBS编号</td>',
            '<th data-order="BureauSectionID" style="min-width: 50px" >局段</td>',
            '<th data-order="LineID" style="min-width: 50px" >修程</td>',
            '<th data-order="ProductID" style="min-width: 50px" >车型</td>',
            '<th data-order="PartNoText" style="min-width: 50px" >车号</td>',


        ].join(""),
        th: ['<th data-order="Station_{{ID}}" style="min-width: 50px" >{{Name}}</th>'].join(""),
        td: ['<td  class="edit-td" data-title="Station_{{ID}}" data-value="{{Station_{{ID}}}}" >{{Station_{{ID}}}}</td>',].join(""),
        // th: ['<th data-order="{{key}}" style="min-width: 50px" >{{value}}</th>'].join(""),
        // td: ['<td  class="edit-td" data-title="{{key}}" data-value="{{{{key}}}}" >{{{{key}}}}</td>',].join(""),

    };

    // 排程条件
    (function () {
        KEYWORD_condition_LIST = [
            //"FQTYShift|计划数",
            //"ShiftPeriod|排产精度|ArrayOne",
            //"LineID|产线|ArrayOne",
            "WorkDayID|作息|ArrayOne",
            "condition|条件选择|Array",

            //"ShiftDays|排程天数",
            //"MaxLoadRate|排班系数",
            //"CheckWorkHours|校验工时|ArrayOne",
            //"CheckShiftHours|校验任务工时|ArrayOne",
        ];
        KEYWORD_condition = {};
        FORMATTRT_condition = {};



        TypeSource_condition = {
            //CheckWorkHours: [
            //    {
            //        name: "校验",
            //        value: true
            //    }, {
            //        name: "不校验",
            //        value: false
            //    }
            //],
            //CheckShiftHours: [
            //    {
            //        name: "校验",
            //        value: true
            //    }, {
            //        name: "不校验",
            //        value: false
            //    }
            //],
            ProductNo: [],
            LineID: [],
            WorkDayID: [],
            condition: [
                {
                    name: "无",
                    value: 0
                },
                {
                    name: "进车时间",
                    value: 1
                }, {
                    name: "修程",
                    value: 2
                },
                {
                    name: "预计完工时刻",
                    value: 3
                }, {
                    name: "局段",
                    value: 4
                },
            ],
            ShiftPeriod: [
                {
                    name: "分",
                    value: 1
                }, {
                    name: "小时",
                    value: 2
                },
                {
                    name: "班",
                    value: 3
                }, {
                    name: "天",
                    value: 4
                },
                {
                    name: "周",
                    value: 5
                }, {
                    name: "月",
                    value: 6
                }
            ],

        };

        $.each(KEYWORD_condition_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD_condition[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_condition[detail[0]] = $com.util.getFormatter(TypeSource_condition, detail[0], detail[2]);
            }
        });
    })();
    //item
    (function () {
        KEYWORD_Level_LISTItem = [

            "WorkShopID|车间|ArrayOne",
            "Priority|优先级",
            "LineID|产线|ArrayOne",
            "BureauSectionID|局段|ArrayOne",
            "ProductID|型号|ArrayOne",

            "mPartNo|车号|ArrayOne",
            //ProductID
            "PlanReceiveDate|时间|Date",
            "PlanFinishDate|时间|Date",
            // "StartTime|开始日期|Date",
            // "EndTime|结束日期|Date",
            "MonthNum|月份|ArrayOne",

            "mStartTimeNew|开始日期|Date",
            "mEndTimeNew|结束日期|Date",

            "mDateZace|日期|ArrayOne",
            "mPartZace|工位|ArrayOne",
            "StationID|工序|ArrayOne",

            "Status|工位|ArrayOne",
        ];
        KEYWORD_LevelItem = {};
        FORMATTRT_LevelItem = {};

        TypeSource_LevelItem = {
            WorkShopID: [],
            LineID: [],
            Status: [
                {
                    name: "已保存",
                    value: 1
                }, {
                    name: "已制定",
                    value: 2
                }, {
                    name: "已投产",
                    value: 3
                }, {
                    name: "生产中",
                    value: 4
                }, {
                    name: "已完工",
                    value: 5
                },
                {
                    name: "暂停中",
                    value: 6
                }, {
                    name: "已入库",
                    value: 7
                }, {
                    name: "已发货",
                    value: 8
                },],
            StationID: [
                {
                    name: "无",
                    value: 0
                },],
            mPartNo: [
                {
                    name: "全部",
                    value: 0
                },],
            BureauSectionID: [],
            mDateZace: [
                {
                    name: "是",
                    value: 1
                },
                {
                    name: "否",
                    value: 0
                },
            ],
            mPartZace: [
                {
                    name: "是",
                    value: 1
                },
                {
                    name: "否",
                    value: 0
                },
            ],
            ProductID: [],
            MonthNum: [
                {
                    name: "1月",
                    value: 1
                },
                {
                    name: "2月",
                    value: 2
                },
                {
                    name: "3月",
                    value: 3
                },
                {
                    name: "4月",
                    value: 4
                },
                {
                    name: "5月",
                    value: 5
                },
                {
                    name: "6月",
                    value: 6
                },
                {
                    name: "7月",
                    value: 7
                },
                {
                    name: "8月",
                    value: 8
                },
                {
                    name: "9月",
                    value: 9
                },
                {
                    name: "10月",
                    value: 10
                },
                {
                    name: "11月",
                    value: 11
                },
                {
                    name: "12月",
                    value: 12
                },

            ]
        };

        $.each(KEYWORD_Level_LISTItem, function (i, item) {
            var detail = item.split("|");
            KEYWORD_LevelItem[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_LevelItem[detail[0]] = $com.util.getFormatter(TypeSource_LevelItem, detail[0], detail[2]);
            }
        });
    })();


    model = $com.Model.create({
        name: 'LOCO',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();
        },

        events: function () {
            function changeDiv(firstIndex, secondIndex) {
                var $divs = $('body').find('.zace-input');
                var $firstDiv = $divs.eq(firstIndex);
                var $secondDiv = $divs.eq(secondIndex);


                var firstLength = $firstDiv.children().length;
                var secondLength = $secondDiv.children().length;



                //  firstLength=$(firstDiv).children().length;
                //  secondLength=$(secondDiv).children().length;


                for (var i = 0; i < firstLength; i++) {
                    $secondDiv.append($firstDiv.children(':eq(0)'));

                }


                for (var i = 0; i < secondLength; i++) {
                    $firstDiv.append($secondDiv.children(':eq(0)'));
                }

            };


            function changeDivItem($this, firstIndex, secondIndex) {
                var $divs = $this.find('.content-zaceLine');
                var $firstDiv = $divs.eq(firstIndex);
                var $secondDiv = $divs.eq(secondIndex);

                var firstLength = $firstDiv.children().length;
                var secondLength = $secondDiv.children().length;



                //  firstLength=$(firstDiv).children().length;
                //  secondLength=$(secondDiv).children().length;


                for (var i = 0; i < firstLength; i++) {
                    $secondDiv.append($firstDiv.children(':eq(0)'));

                }


                for (var i = 0; i < secondLength; i++) {
                    $firstDiv.append($secondDiv.children(':eq(0)'));
                }
            };

            //无
            $("body").delegate("#lmvt-changeType-none", "click", function () {
                $(".lmvt-changeType").text("无");
                ModelType = 0;
            });
            //时间顺延
            $("body").delegate("#lmvt-changeType-postPone", "click", function () {
                $(".lmvt-changeType").text("时间顺延");
                ModelType = 1;
            });
            //时间推迟
            $("body").delegate("#lmvt-changeType-delay", "click", function () {
                $(".lmvt-changeType").text("时间推迟");
                ModelType = 2;
            });


            //导出
            $("body").delegate("#zace-table-ganttExport", "click", function () {
                var $table = $(".table-day-export"),
                    fileName = "月计划表.xls",
                    Title = "月计划表";
                var params = $com.table.getExportParams($table, fileName, Title);

                if (params.data.length < 1) {
                    alert('请选择需要导出的数据！');
                    return false;
                }


                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });



            });
            //点击展开  关闭
            $("body").delegate(".zace-input .productSelect input", "click", function () {
                var $this = $(this);
                if ($this[0].checked == true) {
                    $(".zace-input-product").show();
                } else {
                    $(".zace-input-product").hide();

                }


            });

            //车型上移
            $("body").delegate(".zace-input-product .content-zaceLine .zace-upImage", "click", function () {
                var $this = $(this);


                var num = $this.closest('a').siblings('input').attr('value');
                var nextNum = $this.closest(".content-zaceLine").next(".content-zaceLine").find("input").attr('value');
                var PreNum = $this.closest(".content-zaceLine").prev(".content-zaceLine").find("input").attr('value');

                if (!PreNum) {
                    alert("已在第一行！");
                    return false;
                }


                var PreIndex = $this.closest(".content-zaceLine").prev(".content-zaceLine").find("input").attr('data-index');
                var thisIndex = $this.closest('a').siblings('input').attr('data-index');

                $this.closest('a').siblings('input').attr('data-index', PreIndex);
                $this.closest(".content-zaceLine").prev(".content-zaceLine").find("input").attr('data-index', thisIndex);

                changeDivItem($('.zace-input-product'), PreIndex, thisIndex);
                //alert("上一个" + PreNum + "======" + '下一个' + nextNum);

            });

            //车型下移
            $("body").delegate(".zace-input-product .content-zaceLine .zace-downImage", "click", function () {
                var $this = $(this);

                var num = $this.closest('a').siblings('input').attr('value');
                var nextNum = $this.closest(".content-zaceLine").next(".content-zaceLine").find("input").attr('value');
                var PreNum = $this.closest(".content-zaceLine").prev(".content-zaceLine").find("input").attr('value');

                if (!nextNum) {
                    alert("已在最后一行！");
                    return false;
                }


                var nextindex = $this.closest(".content-zaceLine").next(".content-zaceLine").find("input").attr('data-index');
                var thisIndex = $this.closest('a').siblings('input').attr('data-index');

                $this.closest('a').siblings('input').attr('data-index', nextindex);
                $this.closest(".content-zaceLine").next(".content-zaceLine").find("input").attr('data-index', thisIndex);

                changeDivItem($('.zace-input-product'), nextindex, thisIndex);


            });




            //点击展开  关闭
            $("body").delegate(".zace-input .lineSelect input", "click", function () {
                var $this = $(this);
                if ($this[0].checked == true) {
                    $(".zace-input-line").show();
                } else {
                    $(".zace-input-line").hide();

                }


            });
            //点击展开  关闭
            $("body").delegate(".zace-input .customerSelect input", "click", function () {
                var $this = $(this);
                if ($this[0].checked == true) {
                    $(".zace-input-customer").show();
                } else {
                    $(".zace-input-customer").hide();

                }


            });

            //局段上移
            $("body").delegate(".zace-input-customer .content-zaceLine .zace-upImage", "click", function () {
                var $this = $(this);


                var num = $this.closest('a').siblings('input').attr('value');
                var nextNum = $this.closest(".content-zaceLine").next(".content-zaceLine").find("input").attr('value');
                var PreNum = $this.closest(".content-zaceLine").prev(".content-zaceLine").find("input").attr('value');

                if (!PreNum) {
                    alert("已在第一行！");
                    return false;
                }


                var PreIndex = $this.closest(".content-zaceLine").prev(".content-zaceLine").find("input").attr('data-index');
                var thisIndex = $this.closest('a').siblings('input').attr('data-index');

                $this.closest('a').siblings('input').attr('data-index', PreIndex);
                $this.closest(".content-zaceLine").prev(".content-zaceLine").find("input").attr('data-index', thisIndex);

                changeDivItem($('.zace-input-customer'), PreIndex, thisIndex);
                //alert("上一个" + PreNum + "======" + '下一个' + nextNum);

            });

            //局段下移
            $("body").delegate(".zace-input-customer .content-zaceLine .zace-downImage", "click", function () {
                var $this = $(this);

                var num = $this.closest('a').siblings('input').attr('value');
                var nextNum = $this.closest(".content-zaceLine").next(".content-zaceLine").find("input").attr('value');
                var PreNum = $this.closest(".content-zaceLine").prev(".content-zaceLine").find("input").attr('value');

                if (!nextNum) {
                    alert("已在最后一行！");
                    return false;
                }


                var nextindex = $this.closest(".content-zaceLine").next(".content-zaceLine").find("input").attr('data-index');
                var thisIndex = $this.closest('a').siblings('input').attr('data-index');

                $this.closest('a').siblings('input').attr('data-index', nextindex);
                $this.closest(".content-zaceLine").next(".content-zaceLine").find("input").attr('data-index', thisIndex);

                changeDivItem($('.zace-input-customer'), nextindex, thisIndex);


            });

            //修程上移
            $("body").delegate(".zace-input-line .content-zaceLine .zace-upImage", "click", function () {
                var $this = $(this);


                var num = $this.closest('a').siblings('input').attr('value');
                var nextNum = $this.closest(".content-zaceLine").next(".content-zaceLine").find("input").attr('value');
                var PreNum = $this.closest(".content-zaceLine").prev(".content-zaceLine").find("input").attr('value');

                if (!PreNum) {
                    alert("已在第一行！");
                    return false;
                }


                var PreIndex = $this.closest(".content-zaceLine").prev(".content-zaceLine").find("input").attr('data-index');
                var thisIndex = $this.closest('a').siblings('input').attr('data-index');

                $this.closest('a').siblings('input').attr('data-index', PreIndex);
                $this.closest(".content-zaceLine").prev(".content-zaceLine").find("input").attr('data-index', thisIndex);

                changeDivItem($('.zace-input-line'), PreIndex, thisIndex);
                //alert("上一个" + PreNum + "======" + '下一个' + nextNum);

            });

            //修程下移
            $("body").delegate(".zace-input-line .content-zaceLine .zace-downImage", "click", function () {
                var $this = $(this);

                var num = $this.closest('a').siblings('input').attr('value');
                var nextNum = $this.closest(".content-zaceLine").next(".content-zaceLine").find("input").attr('value');
                var PreNum = $this.closest(".content-zaceLine").prev(".content-zaceLine ").find("input").attr('value');

                if (!nextNum) {
                    alert("已在最后一行！");
                    return false;
                }


                var nextindex = $this.closest(".content-zaceLine").next(".content-zaceLine").find("input").attr('data-index');
                var thisIndex = $this.closest('a').siblings('input').attr('data-index');

                $this.closest('a').siblings('input').attr('data-index', nextindex);
                $this.closest(".content-zaceLine").next(".content-zaceLine").find("input").attr('data-index', thisIndex);

                changeDivItem($('.zace-input-line'), nextindex, thisIndex);


            });

            //上移
            $("body").delegate(".zace-input .content-zace .zace-upImage", "click", function () {
                var $this = $(this);


                var num = $this.closest('a').siblings('input').attr('value');
                var nextNum = $this.closest(".zace-input").next(".zace-input").find('.content-zace input').attr('value');
                var PreNum = $this.closest(".zace-input").prev(".zace-input").find('.content-zace input').attr('value');

                if (!PreNum) {
                    alert("已在第一行！");
                    return false;
                }


                var PreIndex = $this.closest(".zace-input").prev(".zace-input").find('.content-zace input').attr('data-index');
                var thisIndex = $this.closest('a').siblings('input').attr('data-index');

                $this.closest('a').siblings('input').attr('data-index', PreIndex);
                $this.closest(".zace-input").prev(".zace-input").find('.content-zace input').attr('data-index', thisIndex);

                changeDiv(PreIndex, thisIndex);
                //alert("上一个" + PreNum + "======" + '下一个' + nextNum);





            });


            //下移
            $("body").delegate(".zace-input .content-zace .zace-downImage", "click", function () {
                var $this = $(this);
                var num = $this.closest('a').siblings('input').attr('value');
                var nextNum = $this.closest(".zace-input").next(".zace-input").find('.content-zace input').attr('value');
                var PreNum = $this.closest(".zace-input").prev(".zace-input").find('.content-zace input').attr('value');
                if (!nextNum) {
                    alert("已在最后一行！");
                    return false;
                }

                var nextIndex = $this.closest(".zace-input").next(".zace-input").find('.content-zace input').attr('data-index');
                var thisIndex = $this.closest('a').siblings('input').attr('data-index');

                $this.closest('a').siblings('input').attr('data-index', nextIndex);
                $this.closest(".zace-input").next(".zace-input").find('.content-zace input').attr('data-index', thisIndex);

                changeDiv(nextIndex, thisIndex);


            });


            $("body").delegate("#zace-search-orderPlan", "click", function () {
                var default_value = {
                    // MonthNum: (new Date()).getMonth() + 1,
                    WorkShopID: wWorkShopID,
                    mStartTimeNew: $com.util.format('yyyy-MM-dd', new Date(mStartTimeNew)),
                    mEndTimeNew: $com.util.format('yyyy-MM-dd', new Date(mEndTimeNew))
                };

                $("body").append($com.modal.show(default_value, KEYWORD_LevelItem, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    var _num = Number(rst.MonthNum);
                    var _year = (new Date()).getFullYear();
                    var days = (new Date(_year, _num, 0)).getDate();

                    // CurDays = days;
                    // $('.zace-selectDay input').val(CurDays);

                    // mStartTime = $com.util.format('yyyy-MM-dd', new Date(_year + '-' + _num + "-1"));
                    // mEndTime = model.com.addDays(mStartTime, days - 1);

                    mStartTimeNew = $com.util.format('yyyy-MM-dd', new Date(rst.mStartTimeNew));
                    mEndTimeNew = $com.util.format('yyyy-MM-dd', new Date(rst.mEndTimeNew));

                    wWorkShopID = Number(rst.wWorkShopID);

                    model.com.refresh();


                }, TypeSource_LevelItem));






            });


            //条件查询
            $("body").delegate("#zace-searchLine-orderPlan", "click", function () {
                var default_value = {
                    LineID: 0,
                    WorkDayID: 0,
                    ShiftTime: $com.util.format('yyyy-MM-dd ', new Date()),
                    ShiftDays: 5,
                };

                var day = new Date(default_value.ShiftTime).getDay();
                if (day == 0) {

                    default_value.ShiftTime = model.com.addDays(default_value.ShiftTime, 1);

                } else {

                    default_value.ShiftTime = model.com.addDays(default_value.ShiftTime, 8 - day);
                }

                $("body").append($com.modal.show(default_value, KEYWORD_condition, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.LineID = Number(rst.LineID);
                    default_value.ShiftDays = Number(rst.ShiftDays);
                    default_value.WorkDayID = Number(rst.WorkDayID);
                    default_value.ShiftTime = $com.util.format('yyyy-MM-dd hh:mm:ss', rst.ShiftTime);



                    MlineID = default_value.LineID;
                    MShiftsDays = default_value.ShiftDays;
                    MWorkDayID = default_value.WorkDayID;
                    MShiftTime = default_value.ShiftTime;

                    var wlineName = FORMATTRT_condition["LineID"](MlineID);
                    var wShiftDayNum = default_value.ShiftDays;
                    var wworkDayName = FORMATTRT_condition["WorkDayID"](MWorkDayID);
                    var wMShift = FORMATTRT_condition["ShiftTime"](MShiftTime);

                    $(".ConditiontextLeft").html("产线:" + wlineName + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + "作息:" + wworkDayName + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + "排产日期:" + wMShift + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + "天数:" + wShiftDayNum);
                    model.com.refreshC();
                    model.com.refresh();

                    ganttDate = model.com.GetGanttDay(default_value.ShiftTime, default_value.ShiftDays);

                }, TypeSource_condition));
            });
            //修改
            $("body").delegate("#zace-edit-condition", "click", function () {

                var default_value = {
                    MaxLoadRate: DataCondition.MaxLoadRate,
                    CheckWorkHours: DataCondition.CheckWorkHours,
                    CheckShiftHours: DataCondition.CheckShiftHours,
                };

                $("body").append($com.modal.show(default_value, KEYWORD_condition, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    DataCondition.MaxLoadRate = Number(rst.MaxLoadRate);

                    DataCondition.CheckWorkHours = eval(rst.CheckWorkHours.toLowerCase());

                    DataCondition.CheckShiftHours = eval(rst.CheckShiftHours.toLowerCase());

                    var _listinfo = $com.util.Clone(DataCondition);

                    var _list = [];
                    _list.push(_listinfo);
                    $.each(_list, function (i, item) {
                        for (var p in item) {
                            if (!FORMATTRT_condition[p])
                                continue;
                            item[p] = FORMATTRT_condition[p](item[p]);
                        }
                    });

                    $("#femi-orderPlanResult-tbody").html($com.util.template(_list, HTML.TableConditionMode));

                }, TypeSource_condition));
            });

            //zace-aotu-exportPriority
            $("body").delegate("#zace-aotu-exportPriority", "click", function () {
                $('.zace-orderAll').show();
                $('.gante').hide();
                $('.orderPriority').hide();

            });
            //甘特图返回 zace-export-gantt
            $("body").delegate("#zace-export-gantt", "click", function () {

                $('.zace-orderAll').hide();
                $('.tableZace').show();
                $('.top-zace').show();
                $('.gante').hide();
                $('.orderPriority').show();


            });

            //Pro
            $("body").delegate("#zace-scheduleCondition-orderPlanPro", "click", function () {

                $(".zace-orderTaskLine").hide();
                $(".zace-orderSchedule").show();
                var zlist = [];
                $("#femi-orderScheduleResult-tbody").html($com.util.template(zlist, HTML.TableScheduleMode));
                $("#femi-orderScheduleResult-tbody tr").each(function (i, item) {
                    var $this = $(this);
                    var colorName = $this.css("background-color");
                    $this.attr("data-color", colorName);



                });
                $(".zace-orderTablePartShow").hide();
                $(".zace-orderTableTableShow").hide();
                $(".lmvt-border").hide();
                $(".zace-condition").show();
                $(".zace-orderAll").show();
            });

            //周计划甘特图
            $("body").delegate("#lmvt-visualized", "click", function () {
                tempCat = true;
                if (ganttDate.length == 0 || ganttData.length == 0) {
                    alert("暂无可视数据！");
                    return false;
                }

                $(".zace-condition").hide();
                $(".zace-orderAll").hide();
                $(".lmvt-border").show();
                var data = [],
                    //任务名称 
                    position = {
                        //天数间隔
                        spacePx: 30.0,
                        spacePy: 30.0,
                        //左边菜单栏像素
                        freedomPx: 595,
                        contextHight: 1500,
                        radius: 5,
                        //是否阶梯呈现
                        ladder: false,
                        tip: {
                            //提示条宽度，高度，行高
                            Text: { tipW: 170, tipH: 170, lineH: 25, titleH: 30 },
                            title: { text: '订单', prop: 'task', visible: true },
                            line: [
                                { text: '物料号', prop: 'ProductNo', visible: true },
                                { text: '时长', prop: 'time', visible: true },
                                { text: '备注', prop: 'TaskText', visible: true },
                                { text: '冲突消息', prop: 'APSMessage', visible: false },//TaskText
                            ]
                        },
                        series: {
                            //偏移方向 0都不能偏移，1向右偏移，-1向左偏移，2都能偏移。默认2
                            raiseDirection: 0,
                            //偏移天数
                            raise: 1,
                            data: [
                                //"2018-01-01",
                                //"2018-03-24",
                            ]
                        },
                        Task: {
                            data: [
                                //{ task: "任务一", startDate: "2018-01-01", time: 4, color: "#191970", Line: "产线三", Part: "内膜" },
                                //{ task: "任务二", startDate: "2018-01-01", time: 1, color: "DarkGreen", Line: "产线三", Part: "内膜" },
                                //{ task: "任务三", startDate: "2018-01-03", time: 1, color: "DarkKhaki", Line: "产线三", Part: "内膜" },
                                //{ task: "任务四", startDate: "2018-01-29", time: 50, color: "purple", Line: "产线二", Part: "内膜" },
                                //{ task: "任务五", startDate: "2018-02-01", time: 10, color: "Brown", Line: "产线一", Part: "内膜" },
                                //{ task: "任务六", startDate: "2018-02-12", time: 4, color: "black", Line: "产线四", Part: "内膜" },
                                //{ task: "任务七", startDate: "2018-02-25", time: 5, color: "Khaki", Line: "产线五", Part: "内膜" },
                                //{ task: "任务八", startDate: "2018-02-23", time: 3, color: "LightGray", Line: "产线五", Part: "内膜" },
                                //{ task: "任务九", startDate: "2018-02-28", time: 1, color: "LightGray", Line: "产线二", Part: "内膜" },
                            ]
                        },

                        yAxis: {

                            data: []

                        },

                        fn: function (data, source) {

                            $.each(source, function (i, item) {
                                $.each(ganttData, function (j, item_j) {
                                    if (item.OrderNo == item_j.OrderNo && item.ProductNo == item_j.ProductNo) {
                                        item_j.StartTime = $com.util.format('yyyy-MM-dd', new Date(item.startDate));
                                        item_j.StartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item_j.StartTime);
                                        item_j.EndTime = $com.util.format('yyyy-MM-dd', new Date(item.startDate).getTime() + item.time * (24 * 3600000));
                                        item_j.EndTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item_j.EndTime);
                                    }
                                });
                                $.each(DataPlanResult, function (j, item_j) {
                                    if (item.OrderNo == item_j.OrderNo && item.ProductNo == item_j.ProductNo) {
                                        item_j.StartTime = $com.util.format('yyyy-MM-dd', new Date(item.startDate));
                                        item_j.EndTime = $com.util.format('yyyy-MM-dd', new Date(item.startDate).getTime() + item.time * (24 * 3600000));
                                    }
                                });
                            });



                            for (var i = 0; i < DataPlanResult.length; i++) {
                                DataPlanResult[i].WorkHoursName = model.com.getHourOrMinorSec(DataPlanResult[i].WorkHours);
                            }
                            $("#femi-orderScheduleResult-tbody").html($com.util.template(DataPlanResult, HTML.TableScheduleMode));
                            $("#femi-orderScheduleResult-tbody tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);



                            });
                            //$.each
                            //var obj1 = $(".lmvt-ALLAPSorder-body"),
                            //    obj2 = HTML.CountListAll;

                            //$.each(APS_arr, function (i, item_i) {
                            //    $.each(source, function (i, item_j) {
                            //        if (item_j.Part == item_i.PartName) {
                            //            item_i.StartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item_j.startDate);
                            //            item_i.FinishedTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(item_i.StartTime).getTime() + item_j.time * (24 * 3600000));
                            //        }
                            //    });

                            //});
                            //model.com.RenderOrder(obj1, APS_arr, obj2);
                        },
                    };

                //position.series.data = model.com.GetDate(ganttData);

                position.series.data.push(conditionChange.WorkCalendarList[0].WorkDate);
                position.series.data.push(conditionChange.WorkCalendarList[conditionChange.WorkCalendarList.length - 1].WorkDate);

                $.each(ganttData, function (i, item) {
                    if (item.FQTYShift > 0) {
                        position.yAxis.data.push(item.OrderNo);
                        var time = model.com.GetDays(item.StartTime, item.EndTime);
                        position.Task.data.push({
                            task: item.OrderNo,
                            startDate: item.StartTime,
                            time: time,
                            color: "green",
                            Line: FORMATTRT_condition['LineID'](item.LineID),
                            Part: item.ProductNo,
                            ProductNo: item.ProductNo,
                            FQTY: item.FQTY,
                            OrderNo: item.OrderNo,
                            FQTYPL: item.FQTYPlaned
                        });
                    }
                });
                //Gant Column width Control:Max=60,Min=30;
                if (conditionChange.WorkCalendarList.length > 0) {
                    position.spacePx = ($(".lmvt-container-gantt").width() - position.freedomPx) / conditionChange.WorkCalendarList.length;
                    if (conditionChange.WorkCalendarList.length == 10) {
                        position.spacePx = ($(".lmvt-container-gantt").width() - position.freedomPx) / (conditionChange.WorkCalendarList.length + 2);
                    }
                    else {
                        if (position.spacePx < 90)
                            position.spacePx = 90;
                        if (position.spacePx > 130)
                            position.spacePx = 130;
                    }
                }
                position.contextHight = 62 + ganttData.length * position.spacePy;

                if (position.contextHight < 300)
                    position.contextHight = $(".lmvt-container-gantt").height();

                //$(".lmvt-container-count-drawing-gantt").css("height", position.contextHight + "px");

                $ganttWeek.install($('.lmvt-gantt'), position, $(".lmvt-container-gantt"), conditionChange.WorkCalendarList);

                $ganttWeek.resfushCanvas(position.Task.data);

                $(".lmvt-container-count-drawing").show();

            });



            //排程条件   局段  修程详情
            $("body").delegate("#zace-aotu-detail", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-orderMakeAll-condition"), "ID", mConditionList);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                } else if (SelectData.length > 1) {
                    alert(" 一次只能对一行数据操作！")
                    return;
                }

                if (SelectData[0].Level == 1) {

                    mLevel = 1;
                    $('.bottom-zace-detail').show();
                    $('.bottom-zace-condition').hide();
                    $('.zace-ConditionDetail').text('局段优先级');
                    $("#femi-orderMakeAll-Priority").html($com.util.template(ConditionCustomer, HTML.TableCusPriority));
                    $("#femi-orderMakeAll-Priority tr").each(function (i, item) {
                        var $this = $(this);
                        var colorName = $this.css("background-color");
                        $this.attr("data-color", colorName);



                    });


                } else if (SelectData[0].Level == 2) {
                    mLevel = 2;
                    $('.bottom-zace-detail').show();
                    $('.bottom-zace-condition').hide();
                    $('.zace-ConditionDetail').text('修程优先级');
                    $("#femi-orderMakeAll-Priority").html($com.util.template(ConditionLine, HTML.TablePriority));
                    $("#femi-orderMakeAll-Priority tr").each(function (i, item) {
                        var $this = $(this);
                        var colorName = $this.css("background-color");
                        $this.attr("data-color", colorName);



                    });

                } else {
                    alert("所选条件无具体内容");
                }
            });
            //局段   //修程
            $("body").delegate("#zace-down-pencil", "click", function () {

                if (mLevel == 1) {
                    var SelectData = $com.table.getSelectionData($("#femi-orderMakeAll-Priority"), "ID", ConditionCustomer);
                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return;
                    } else if (SelectData.length > 1) {
                        alert(" 一次只能对一行数据操作！")
                        return;
                    }
                    var default_value = {
                        Priority: SelectData[0].Priority,

                    };
                    $("body").append($com.modal.show(default_value, KEYWORD_LevelItem, "修改", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;


                        var y = String(Number(rst.Priority)).indexOf(".") + 1;//获取小数点的位置


                        if (y > 0) {
                            alert("请输入整数！");
                            return false;
                        }

                        SelectData[0].Priority = Number(rst.Priority);

                        $("#femi-orderMakeAll-Priority").html($com.util.template(ConditionCustomer, HTML.TableCusPriority));
                        $("#femi-orderMakeAll-Priority tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });

                    }, TypeSource_LevelItem));

                } else {

                    var SelectData = $com.table.getSelectionData($("#femi-orderMakeAll-Priority"), "ID", ConditionLine);
                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return;
                    } else if (SelectData.length > 1) {
                        alert(" 一次只能对一行数据操作！")
                        return;
                    }
                    var default_value = {
                        Priority: SelectData[0].Priority,

                    };
                    $("body").append($com.modal.show(default_value, KEYWORD_LevelItem, "修改", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        var y = String(Number(rst.Priority)).indexOf(".") + 1;//获取小数点的位置


                        if (y > 0) {
                            alert("请输入整数！");
                            return false;
                        }

                        SelectData[0].Priority = Number(rst.Priority);

                        $("#femi-orderMakeAll-Priority").html($com.util.template(ConditionLine, HTML.TablePriority));
                        $("#femi-orderMakeAll-Priority tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });

                    }, TypeSource_LevelItem));



                }



            });

            $("body").delegate("#zace-export-detail", "click", function () {
                $('.bottom-zace-detail').hide();
                $('.bottom-zace-condition').show();

            });


            //检查冲突  zace-aotu-checked
            $("body").delegate("#zace-aotu-checked", "click", function () {
                // var obj = document.getElementById("zace-selectOptions");
                // MWorkDayID = Number(obj.options[obj.selectedIndex].value);

                MWorkDayID = 1;
                for (var i = 0; i < mApsList.list.length; i++) {
                    $com.util.deleteLowerProperty(mApsList.list[i]);
                    mApsList.list[i].StartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', mApsList.list[i].StartTime);
                    mApsList.list[i].EndTime = $com.util.format('yyyy-MM-dd hh:mm:ss', mApsList.list[i].EndTime);
                }
                model.com.postOMSManualScheduling({
                    data: {
                        CheckTaskList: TableGanteSource,
                        APSShiftPeriod: 5,
                        StartTime: mStartTime,
                        EndTime: mEndTime,
                        WorkShopID: wWorkShopID,
                    }

                }, function (res) {


                    var _list = res;



                    mMesList = $com.util.Clone(res.list);
                    mApsList.list = $com.util.Clone(_list.TaskList);


                    //渲染甘特数据
                    var AllGantte = $com.util.Clone(res.TreeList);
                    //需要回显数据
                    // var BackRander = [];
                    // $.each(AllGantte, function (j, jtem) {
                    //     $.each(jtem.TaskPartList, function (k, ktem) {
                    //         for (var m = 0; m < ktem.TaskPartList.length; m++) {

                    //             if (new Date(ktem.TaskPartList[m].StartTime).getTime() >= new Date(mEndTime).getTime()) {
                    //                 BackRander.push(ktem.TaskPartList[m]);
                    //                 ktem.TaskPartList.splice(m, 1);
                    //                 m--;
                    //             }

                    //         }


                    //     });
                    // });

                    var position = {
                        //是否可做操作
                        ISMouseMove: 1,
                        //天数间隔
                        spacePx: 100.0,
                        //左边菜单栏像素
                        freedomPx: 250,
                        //
                        contextHight: 400,
                        radius: 4,
                        tip: {
                            //提示条宽度，高度，行高
                            Text: { tipW: 170, tipH: 70, lineH: 20, titleH: 20 },
                            title: { text: '车号', prop: 'PartNo', visible: false },
                            line: [
                                { text: '开始时间', prop: 'StartTime', visible: true },
                                { text: '时长', prop: 'time', visible: false },

                                { text: '备注', prop: 'TaskText', visible: true },
                                { text: '冲突消息', prop: 'APSMessage', visible: false },
                            ]
                        },

                        effect: {
                            Time: mDateEffect,   //日期
                            Part: mPartEffect,   //工位
                            Station: mCloseStationList,
                        },

                        series: {
                            data: [
                                mStartTime,
                                mEndTime,
                            ]
                        },

                        fn: function (source) {

                            for (var i = 0; i < source.length; i++) {
                                $.each(source[i].TaskPartList, function (j, jtem) {
                                    $.each(jtem.TaskPartList, function (m, mtem) {
                                        $.each(mApsList.list, function (k, ktem) {
                                            //
                                            if (mtem.PartNo == ktem.PartNo && mtem.LineID == ktem.LineID && mtem.PartID == ktem.PartID) {
                                                ktem.StartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', mtem.startDate.getTime());
                                                ktem.EndTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(mtem.startDate).getTime() + mtem.time * (24 * 3600000));
                                            }
                                        });


                                    });
                                });


                            };
                            position.Task.dataList = mApsList.list;
                            //$.each(position.Task.dataList,function(i,item){
                            //       item.StartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(item.StartTime).getTime() + 8 * 3600000);
                            //  });
                            //mApsList = $com.util.Clone(_list);
                            // var demo = cate;
                            // $.each(cate, function (i, item) {
                            //     TablePartData.GantPartList[item].StartDate = $com.util.format('yyyy-MM-dd', source[item].startDate);
                            //     TablePartData.GantPartList[item].StartDate = $com.util.format('yyyy-MM-dd hh:mm:ss', TablePartData.GantPartList[item].StartDate);
                            //     TablePartData.GantPartList[item].EndDate = $com.util.format('yyyy-MM-dd', new Date(source[item].startDate).getTime() + source[item].time * (24 * 3600000));
                            //     TablePartData.GantPartList[item].EndDate = $com.util.format('yyyy-MM-dd hh:mm:ss', TablePartData.GantPartList[item].EndDate);
                            // });

                            // $.each(cate, function (i, item) {
                            //     ChartData.GantPartList[item].StartDate = $com.util.format('yyyy-MM-dd', source[item].startDate);
                            //     ChartData.GantPartList[item].StartDate = $com.util.format('yyyy-MM-dd hh:mm:ss', ChartData.GantPartList[item].StartDate);
                            //     ChartData.GantPartList[item].EndDate = $com.util.format('yyyy-MM-dd', new Date(source[item].startDate).getTime() + source[item].time * (24 * 3600000));
                            //     ChartData.GantPartList[item].EndDate = $com.util.format('yyyy-MM-dd hh:mm:ss', ChartData.GantPartList[item].EndDate);
                            // });

                        },

                        Task: {
                            data: AllGantte,
                            dataList: res.TaskList,
                            routeList: zaceRouteList
                        },

                        yAxis: {

                            data: ['任务一', '任务二', '任务三', '任务四', '任务五', '任务六', '任务七', '任务8', '任务9']

                        },
                    }

                    var counts = 0

                    $.each(position.Task.data, function (j, jtem) {
                        $.each(jtem.TaskPartList, function (k, ktem) {

                            if (!ktem.TaskPartList[0]) {
                                ktem.TaskPartList.push(Temp);
                            }

                            $.each(ktem.TaskPartList, function (m, mtem) {
                                // <th style="min-width: 50px" data-order="PlanReceiveDate">计划进厂</th>
                                // <th style="min-width: 50px" data-order="RealReceiveDate">实际进厂</th>
                                // <th style="min-width: 50px" data-order="PlanFinishDate">预计完工</th>
                                counts++;
                                //天数
                                mtem.time = model.com.GetDays(mtem.StartTime, mtem.EndTime);

                                if (new Date(mtem.StartTime).getHours() == 12) {
                                    mtem.StartTime = $com.util.format("yyyy-MM-dd hh:mm:ss", new Date(mtem.StartTime).getTime() + 8 * 3600000);
                                }
                                mtem.EndTime = $com.util.format("yyyy-MM-dd hh:mm:ss", mtem.EndTime);

                                mtem.StartTime = $com.util.format("yyyy-MM-dd", mtem.StartTime);

                                mtem.startDate = mtem.StartTime;
                                mtem.color = "#3E90C6"


                                //模板  无订单
                                if (mtem.PartNo.length < 1) {
                                    mtem.startDate = $com.util.format("yyyy-MM-dd", '1970-1-1');
                                }

                            });
                        });
                    });

                    position.contextHight = counts * 25 + 54;

                    $(function () {

                        if (GantteSource.contextHight < $('.lmvt-gantt').height()) {
                            GantteSource.contextHight = $('.lmvt-gantt').height();
                        }
                        if (GantteSource.spacePx * dayZace <= $('.lmvt-gantt').width() - GantteSource.freedomPx) {
                            GantteSource.spacePx = ($('.lmvt-gantt').width() - GantteSource.freedomPx) / dayZace;
                        }

                        $ganttWeek.install($('.lmvt-gantt'), $(".lmvt-container-gantt"), GantteSource);

                        $ganttWeek.resfushCanvas(GantteSource.Task.data);
                    });


                    $(".lmvt-gantt").ready(function () {
                        var ScrollDiv = $(".lmvt-container-gantt");
                        $(".canvasLeft1").css("top", ScrollDiv.offset().top);
                        $(".canvasLeft1").css("left", ScrollDiv.offset().left);
                        $(".canvasLeft1").css("width", position.freedomPx);
                        $(".canvasLeft1").css("height", ScrollDiv.height());

                        $(".canvasTop1").css("top", ScrollDiv.offset().top);
                        $(".canvasTop1").css("left", ScrollDiv.offset().left);
                        $(".canvasTop1").css("width", ScrollDiv.width());
                        $(".canvasTop1").css("height", 52);
                    });
                })
            });

            $("body").delegate("#zace-table-ganttZOpen", "click", function () {
                $(".zace-orderAllPriorityShow").show();
                for (var i = 0; i < mApsList.list.length; i++) {

                    $com.util.deleteLowerProperty(mApsList.list[i]);

                }


                model.com.postTreeList({
                    MessageList: mMesList,

                    TaskPartList: mApsList.list,

                }, function (res) {


                    mApsList.TreeList = $com.util.Clone(res.list);

                    //渲染甘特数据
                    var AllGantte = $com.util.Clone(res.list);
                    //需要回显数据
                    var BackRander = [];
                    $.each(AllGantte, function (j, jtem) {
                        $.each(jtem.TaskPartList, function (k, ktem) {
                            for (var m = 0; m < ktem.TaskPartList.length; m++) {

                                if (new Date(ktem.TaskPartList[m].StartTime).getTime() >= new Date(mEndTime).getTime()) {
                                    BackRander.push(ktem.TaskPartList[m]);
                                    ktem.TaskPartList.splice(m, 1);
                                    m--;
                                }

                            }


                        });
                    });

                    var position = {

                        //天数间隔
                        spacePx: 100.0,
                        //左边菜单栏像素
                        freedomPx: 250,
                        //
                        contextHight: 400,
                        radius: 4,
                        tip: {
                            //提示条宽度，高度，行高
                            Text: { tipW: 170, tipH: 70, lineH: 20, titleH: 20 },
                            title: { text: '车号', prop: 'PartNo', visible: false },
                            line: [
                                { text: '开始时间', prop: 'StartTime', visible: true },
                                { text: '时长', prop: 'time', visible: false },
                                { text: '备注', prop: 'TaskText', visible: true },
                                { text: '冲突消息', prop: 'APSMessage', visible: false },//TaskText
                            ]
                        },

                        effect: {
                            Time: mDateEffect,   //日期
                            Part: mPartEffect,   //工位
                            Station: mCloseStationList,
                        },

                        series: {
                            data: [
                                wStartTime,
                                mEndTime,
                            ]
                        },

                        fn: function (source) {

                            for (var i = 0; i < source.length; i++) {
                                $.each(source[i].TaskPartList, function (j, jtem) {
                                    $.each(jtem.TaskPartList, function (m, mtem) {
                                        $.each(mApsList.list, function (k, ktem) {
                                            //
                                            if (mtem.PartNo == ktem.PartNo && mtem.LineID == ktem.LineID && mtem.PartID == ktem.PartID) {
                                                ktem.StartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', mtem.startDate.getTime());
                                                ktem.EndTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(mtem.startDate).getTime() + mtem.time * (24 * 3600000));
                                            }
                                        });


                                    });
                                });


                            };
                            position.Task.dataList = mApsList.list;
                            // $.each(position.Task.dataList,function(i,item){
                            //     item.StartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(item.StartTime).getTime() + 8 * 3600000);
                            //});

                            //   mApsList = $com.util.Clone(_list);
                            // var demo = cate;
                            // $.each(cate, function (i, item) {
                            //     TablePartData.GantPartList[item].StartDate = $com.util.format('yyyy-MM-dd', source[item].startDate);
                            //     TablePartData.GantPartList[item].StartDate = $com.util.format('yyyy-MM-dd hh:mm:ss', TablePartData.GantPartList[item].StartDate);
                            //     TablePartData.GantPartList[item].EndDate = $com.util.format('yyyy-MM-dd', new Date(source[item].startDate).getTime() + source[item].time * (24 * 3600000));
                            //     TablePartData.GantPartList[item].EndDate = $com.util.format('yyyy-MM-dd hh:mm:ss', TablePartData.GantPartList[item].EndDate);
                            // });

                            // $.each(cate, function (i, item) {
                            //     ChartData.GantPartList[item].StartDate = $com.util.format('yyyy-MM-dd', source[item].startDate);
                            //     ChartData.GantPartList[item].StartDate = $com.util.format('yyyy-MM-dd hh:mm:ss', ChartData.GantPartList[item].StartDate);
                            //     ChartData.GantPartList[item].EndDate = $com.util.format('yyyy-MM-dd', new Date(source[item].startDate).getTime() + source[item].time * (24 * 3600000));
                            //     ChartData.GantPartList[item].EndDate = $com.util.format('yyyy-MM-dd hh:mm:ss', ChartData.GantPartList[item].EndDate);
                            // });
                        },

                        Task: {
                            data: AllGantte,
                            dataList: mApsList.list,
                            routeList: zaceRouteList
                        },

                        yAxis: {

                            data: ['任务一', '任务二', '任务三', '任务四', '任务五', '任务六', '任务七', '任务8', '任务9']

                        },
                    }

                    var counts = 0

                    $.each(position.Task.data, function (j, jtem) {
                        $.each(jtem.TaskPartList, function (k, ktem) {

                            if (!ktem.TaskPartList[0]) {
                                ktem.TaskPartList.push(Temp);
                            }
                            $.each(ktem.TaskPartList, function (m, mtem) {
                                // <th style="min-width: 50px" data-order="PlanReceiveDate">计划进厂</th>
                                // <th style="min-width: 50px" data-order="RealReceiveDate">实际进厂</th>
                                // <th style="min-width: 50px" data-order="PlanFinishDate">预计完工</th>
                                counts++;
                                //天数
                                mtem.time = model.com.GetDays(mtem.StartTime, mtem.EndTime);

                                if (new Date(mtem.StartTime).getHours() == 12) {
                                    mtem.StartTime = $com.util.format("yyyy-MM-dd hh:mm:ss", new Date(mtem.StartTime).getTime() + 8 * 3600000);
                                }
                                mtem.EndTime = $com.util.format("yyyy-MM-dd hh:mm:ss", mtem.EndTime);
                                mtem.startDate = mtem.StartTime;
                                mtem.color = "#3E90C6"


                                //模板  无订单
                                if (mtem.PartNo.length < 1) {
                                    mtem.startDate = $com.util.format("yyyy-MM-dd", '1970-1-1');
                                }

                            });
                        });
                    });

                    position.contextHight = counts * 25 + 54;



                    $(function () {

                        $ganttWeek.install($('.lmvt-gantt'), $(".lmvt-container-gantt"), position);

                        $ganttWeek.resfushCanvas(position.Task.data);

                    });

                    $(".lmvt-gantt").ready(function () {
                        var ScrollDiv = $(".lmvt-container-gantt");
                        $(".canvasLeft1").css("top", ScrollDiv.offset().top);
                        $(".canvasLeft1").css("left", ScrollDiv.offset().left);
                        $(".canvasLeft1").css("width", position.freedomPx);
                        $(".canvasLeft1").css("height", ScrollDiv.height() - 10);

                        $(".canvasTop1").css("top", ScrollDiv.offset().top);
                        $(".canvasTop1").css("left", ScrollDiv.offset().left);
                        $(".canvasTop1").css("width", ScrollDiv.width());
                        $(".canvasTop1").css("height", 52);





                    });


                });


            });
            $("body").delegate("#zace-table-ganttZClose", "click", function () {
                $(".zace-orderAllPriorityShow").hide();

                for (var i = 0; i < mApsList.list.length; i++) {

                    $com.util.deleteLowerProperty(mApsList.list[i]);

                }


                model.com.postTreeList({
                    MessageList: mMesList,

                    TaskPartList: mApsList.list,

                }, function (res) {


                    mApsList.TreeList = $com.util.Clone(res.list);

                    //渲染甘特数据
                    var AllGantte = $com.util.Clone(res.list);
                    //需要回显数据
                    var BackRander = [];
                    $.each(AllGantte, function (j, jtem) {
                        $.each(jtem.TaskPartList, function (k, ktem) {
                            for (var m = 0; m < ktem.TaskPartList.length; m++) {

                                if (new Date(ktem.TaskPartList[m].StartTime).getTime() >= new Date(mEndTime).getTime()) {
                                    BackRander.push(ktem.TaskPartList[m]);
                                    ktem.TaskPartList.splice(m, 1);
                                    m--;
                                }

                            }


                        });
                    });

                    var position = {

                        //天数间隔
                        spacePx: 100.0,
                        //左边菜单栏像素
                        freedomPx: 250,
                        //
                        contextHight: 400,
                        radius: 4,
                        tip: {
                            //提示条宽度，高度，行高
                            Text: { tipW: 170, tipH: 70, lineH: 20, titleH: 20 },
                            title: { text: '车号', prop: 'PartNo', visible: false },
                            line: [
                                { text: '开始时间', prop: 'StartTime', visible: true },
                                { text: '时长', prop: 'time', visible: false },
                                { text: '备注', prop: 'TaskText', visible: true },
                                { text: '冲突消息', prop: 'APSMessage', visible: false },//TaskText
                            ]
                        },

                        effect: {
                            Time: mDateEffect,   //日期
                            Part: mPartEffect,   //工位
                            Station: mCloseStationList,
                        },

                        series: {
                            data: [
                                mStartTime,
                                mEndTime,
                            ]
                        },

                        fn: function (source) {

                            for (var i = 0; i < source.length; i++) {
                                $.each(source[i].TaskPartList, function (j, jtem) {
                                    $.each(jtem.TaskPartList, function (m, mtem) {
                                        $.each(mApsList.list, function (k, ktem) {
                                            //
                                            if (mtem.PartNo == ktem.PartNo && mtem.LineID == ktem.LineID && mtem.PartID == ktem.PartID) {
                                                ktem.StartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', mtem.startDate.getTime());
                                                ktem.EndTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(mtem.startDate).getTime() + mtem.time * (24 * 3600000));
                                            }
                                        });


                                    });
                                });


                            };
                            position.Task.dataList = mApsList.list;
                            // $.each(position.Task.dataList,function(i,item){
                            //     item.StartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(item.StartTime).getTime() + 8 * 3600000);
                            //});
                            //   mApsList = $com.util.Clone(_list);
                            // var demo = cate;
                            // $.each(cate, function (i, item) {
                            //     TablePartData.GantPartList[item].StartDate = $com.util.format('yyyy-MM-dd', source[item].startDate);
                            //     TablePartData.GantPartList[item].StartDate = $com.util.format('yyyy-MM-dd hh:mm:ss', TablePartData.GantPartList[item].StartDate);
                            //     TablePartData.GantPartList[item].EndDate = $com.util.format('yyyy-MM-dd', new Date(source[item].startDate).getTime() + source[item].time * (24 * 3600000));
                            //     TablePartData.GantPartList[item].EndDate = $com.util.format('yyyy-MM-dd hh:mm:ss', TablePartData.GantPartList[item].EndDate);
                            // });

                            // $.each(cate, function (i, item) {
                            //     ChartData.GantPartList[item].StartDate = $com.util.format('yyyy-MM-dd', source[item].startDate);
                            //     ChartData.GantPartList[item].StartDate = $com.util.format('yyyy-MM-dd hh:mm:ss', ChartData.GantPartList[item].StartDate);
                            //     ChartData.GantPartList[item].EndDate = $com.util.format('yyyy-MM-dd', new Date(source[item].startDate).getTime() + source[item].time * (24 * 3600000));
                            //     ChartData.GantPartList[item].EndDate = $com.util.format('yyyy-MM-dd hh:mm:ss', ChartData.GantPartList[item].EndDate);
                            // });

                        },

                        Task: {
                            data: AllGantte,
                            dataList: mApsList.list,
                            routeList: zaceRouteList
                        },

                        yAxis: {

                            data: ['任务一', '任务二', '任务三', '任务四', '任务五', '任务六', '任务七', '任务8', '任务9']

                        },
                    }

                    var counts = 0

                    $.each(position.Task.data, function (j, jtem) {
                        $.each(jtem.TaskPartList, function (k, ktem) {

                            if (!ktem.TaskPartList[0]) {
                                ktem.TaskPartList.push(Temp);
                            }
                            $.each(ktem.TaskPartList, function (m, mtem) {
                                // <th style="min-width: 50px" data-order="PlanReceiveDate">计划进厂</th>
                                // <th style="min-width: 50px" data-order="RealReceiveDate">实际进厂</th>
                                // <th style="min-width: 50px" data-order="PlanFinishDate">预计完工</th>
                                counts++;
                                //天数
                                mtem.time = model.com.GetDays(mtem.StartTime, mtem.EndTime);
                                if (new Date(mtem.StartTime).getHours() == 12) {
                                    mtem.StartTime = $com.util.format("yyyy-MM-dd hh:mm:ss", new Date(mtem.StartTime).getTime() + 8 * 3600000);
                                }
                                mtem.EndTime = $com.util.format("yyyy-MM-dd hh:mm:ss", mtem.EndTime);
                                mtem.startDate = mtem.StartTime;
                                mtem.color = "#3E90C6"


                                //模板  无订单
                                if (mtem.PartNo.length < 1) {
                                    mtem.startDate = $com.util.format("yyyy-MM-dd", '1970-1-1');
                                }

                            });
                        });
                    });

                    position.contextHight = counts * 25 + 54;



                    $(function () {

                        $ganttWeek.install($('.lmvt-gantt'), $(".lmvt-container-gantt"), position);

                        $ganttWeek.resfushCanvas(position.Task.data);

                    });

                    $(".lmvt-gantt").ready(function () {
                        var ScrollDiv = $(".lmvt-container-gantt");
                        $(".canvasLeft1").css("top", ScrollDiv.offset().top);
                        $(".canvasLeft1").css("left", ScrollDiv.offset().left);
                        $(".canvasLeft1").css("width", position.freedomPx);
                        $(".canvasLeft1").css("height", ScrollDiv.height() - 10);

                        $(".canvasTop1").css("top", ScrollDiv.offset().top);
                        $(".canvasTop1").css("left", ScrollDiv.offset().left);
                        $(".canvasTop1").css("width", ScrollDiv.width());
                        $(".canvasTop1").css("height", 52);





                    });


                });



            });

            //保存  zace-export-saved
            $("body").delegate("#zace-export-saved", "click", function () {


                if (mMesList.length < 1) {
                    if (!confirm("未检查冲突或无冲突，是否继续保存？")) {
                        return;
                    }
                }
                for (var i = 0; i < mApsList.list.length; i++) {

                    $com.util.deleteLowerProperty(mApsList.list[i]);
                    mApsList.list[i].StartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', mApsList.list[i].StartTime);
                    mApsList.list[i].EndTime = $com.util.format('yyyy-MM-dd hh:mm:ss', mApsList.list[i].EndTime);
                }
                model.com.postOMSOrderSaved({
                    data: {
                        TaskPartList: TableGanteSource,
                        StartTime: mStartTime,
                        EndTime: mEndTime,
                        MsgList: mMesList,
                        Status: 0,
                        APSShiftPeriod: 5,
                        WorkShopID: wWorkShopID,
                        VersionNo: "",



                    }

                }, function (res) {
                    alert('排程成功');
                    var _list = res.list;
                });



            });

            //优先级列表    检查排程条件
            $("body").delegate("#zace-aotu-orderPriority", "click", function () {

                SelDataOrderList = $com.table.getSelectionData($("#femi-orderMakeAll-tbody"), "ID", DataOrderList);

                if (SelDataOrderList.length < 1) {
                    alert('未选择订单');
                    return false;
                }

                mCondition = [];

                var _listLine = [];
                var _listCustomer = [];
                var _listProduct = [];

                var lineBool = false; //判断是否选择产线
                var cusBool = false;  //判断是否选择产线
                var proBool = false;  //判断是否选择产线


                for (var i = 0; i < SelDataOrderList.length; i++) {

                    $com.util.deleteLowerProperty(SelDataOrderList[i]);
                }


                $(".zace-condition-select .zace-input").each(function (i, item) {

                    var $this = $(item);
                    if ($this.find(".content-zace input")[0].checked == true) {

                        mCondition.push(Number($this.find(".content-zace input").attr('value')));

                        if (Number($this.find(".content-zace input").attr('value')) == 2) {
                            lineBool = true;

                        }
                        if (Number($this.find(".content-zace input").attr('value')) == 4) {
                            cusBool = true;

                        }
                        if (Number($this.find(".content-zace input").attr('value')) == 5) {
                            proBool = true;

                        }
                    }


                });


                $(".zace-input-line .content-zaceLine").each(function (i, item) {

                    var $this = $(item);
                    if ($this.find("input")[0].checked == true) {

                        _listLine.push(Number($this.find("input").attr('value')));
                    }


                });

                $(".zace-input-customer .content-zaceLine").each(function (i, item) {

                    var $this = $(item);
                    if ($this.find("input")[0].checked == true) {

                        _listCustomer.push(Number($this.find("input").attr('value')));
                    }


                });
                $(".zace-input-product .content-zaceLine").each(function (i, item) {

                    var $this = $(item);
                    if ($this.find("input")[0].checked == true) {

                        _listProduct.push(Number($this.find("input").attr('value')));
                    }


                });

                if (lineBool) {
                    if (_listLine.length < 1) {
                        alert("请选择产线内部优先级！")
                        return false;
                    }
                } else {
                    _listLine = [];

                }
                if (cusBool) {
                    if (_listCustomer.length < 1) {
                        alert("请选择客户内部优先级！")
                        return false;
                    }
                } else {
                    _listCustomer = [];

                }
                if (proBool) {
                    if (_listProduct.length < 1) {
                        alert("请选择型号内部优先级！")
                        return false;
                    }
                } else {
                    _listProduct = [];

                }
                model.com.postOMSOrderPriority({
                    data: {
                        OrderList: SelDataOrderList,
                        OMSOrderPriorityList: mCondition,
                        LineOrders: _listLine,  //_listLine
                        CustomerOrders: _listCustomer,//_listCustomer
                        ProductIDs: _listProduct,
                        ShiftPeriod: 6,
                        LimitMinutes: mLimitMinutes,
                        RedundantDays: mRedundantDays,

                    }

                }, function (res) {



                    $('.orderPriority').show();
                    $('.gante').hide();
                    $('.zace-orderAll').hide();


                    //优先级数据
                    mSelDataOrderList = $com.util.Clone(res.list);

                    for (var index = 0; index < mSelDataOrderList.length; index++) {
                        mSelDataOrderList[index].WID = index + 1;

                    }
                    var _list = $com.util.Clone(mSelDataOrderList);
                    $.each(_list, function (i, item) {
                        for (var p in item) {
                            if (!FORMATTRT_LevelItem[p])
                                continue;
                            item[p] = FORMATTRT_LevelItem[p](item[p]);
                        }
                    });
                    $("#femi-orderPriority-tbody").html($com.util.template(_list, HTML.TableOrderModePriority));
                    $("#femi-orderPriority-tbody tr").each(function (i, item) {
                        var $this = $(this);
                        var colorName = $this.css("background-color");
                        $this.attr("data-color", colorName);
                    });
                });
            });

            //监控输入框输入的值

            $("body").delegate(".lmvt-input", "change", function () {
                var $this = $(this),
                    fqty = $this.val(),
                    UniqueID = $this.closest("td").attr("data-value"),
                    ChangeDate = $this.closest("td").attr("data-title");

                // tableList

                //Source = $com.util.Clone(mZaceTableGante.list);

                var data = model.com.ChangeShiftDetail(TableGanteSource, wStartTime, wMaxTime, UniqueID, ChangeDate, fqty, ModelType);

                model.com.RanderPlanTable(data);

                $.each(GantteSource.Task.data, function (j, jtem) {
                    $.each(jtem.TaskPartList, function (k, ktem) {
                        if (!ktem.TaskPartList[0]) {
                            ktem.TaskPartList.push(Temp);
                        }
                        $.each(ktem.TaskPartList, function (m, mtem) {

                            $.each(TableGanteSource, function (n, ntem) {
                                if (ntem.UniqueID == mtem.UniqueID) {
                                    if (ntem.ShiftDetail && ntem.ShiftDetail.length > 0) {
                                        var obj = model.com.SelectMaxAndMinTime(ntem.ShiftDetail);
                                        mtem.EndTime = obj.EndTime;
                                        mtem.StartTime = obj.StartTime;

                                        mtem.time = model.com.GetDays(mtem.StartTime, mtem.EndTime);

                                        if (new Date(mtem.StartTime).getHours() == 12) {
                                            mtem.StartTime = $com.util.format("yyyy-MM-dd hh:mm:ss", new Date(mtem.StartTime).getTime() + 8 * 3600000);
                                        }
                                        mtem.EndTime = $com.util.format("yyyy-MM-dd", mtem.EndTime);
                                        mtem.StartTime = $com.util.format("yyyy-MM-dd", mtem.StartTime);
                                        mtem.startDate = mtem.StartTime;
                                        mtem.color = "#3E90C6"


                                        //模板  无订单
                                        if (mtem.PartNo.length < 1) {
                                            mtem.startDate = $com.util.format("yyyy-MM-dd", '1970-1-1');
                                        }

                                    }
                                }
                            });

                        });
                    });
                });

                console.log(TableGanteSource);

                $(function () {

                    $ganttWeek.install($('.lmvt-gantt'), $(".lmvt-container-gantt"), GantteSource);

                    $ganttWeek.resfushCanvas(GantteSource.Task.data);

                });

                GantteSource.fn = function (source) {

                    model.com.BackCall(source);

                    var array = []
                    $.each(source, function (j, jtem) {
                        $.each(jtem.TaskPartList, function (k, ktem) {
                            if (!ktem.TaskPartList[0]) {
                                ktem.TaskPartList.push(Temp);
                            }
                            $.each(ktem.TaskPartList, function (m, mtem) {


                                $.each(TableGanteSource, function (n, ntem) {
                                    if (mtem.UniqueID == ntem.UniqueID) {

                                        if (mtem.ShiftDetail.length > 0) {

                                            var arr = model.com.ChangeTableSource(mtem);

                                            array.push(arr);

                                            return false;

                                        }


                                    }

                                });

                            });
                        });
                    });

                    $.each(TableGanteSource, function (i, item) {
                        item.ShiftDetail = [];
                        item.ShiftDetail = array[i];
                    });

                    tableList = model.com.getShiftDetailTable(TableGanteSource, GantteSource.series.data[0], GantteSource.series.data[1]);

                    model.com.RanderPlanTable(tableList);
                };
            });

            //。。。。。。甘特图   
            $("body").delegate("#zace-aotu-orderPlan", "click", function () {

                // var obj = document.getElementById("zace-selectOptions");
                // MWorkDayID = Number(obj.options[obj.selectedIndex].value);

                MWorkDayID = 1;

                var SelectData = $com.table.getSelectionData($("#femi-orderPriority-tbody"), "WID", mSelDataOrderList);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }

                $com.app.loading();
                for (var i = 0; i < SelectData.length; i++) {

                    $com.util.deleteLowerProperty(SelectData[i]);
                }

                mOrderList = $com.util.Clone(SelectData);
                TypeSource_LevelItem.mPartNo.splice(1, TypeSource_LevelItem.mPartNo.length - 1);
                $.each(mOrderList, function (i, item) {
                    TypeSource_LevelItem.mPartNo.push({
                        name: item.PartNo,
                        value: item.ID,

                    });

                });



                var _list = $com.util.Clone(SelectData);
                $.each(_list, function (i, item) {
                    for (var p in item) {
                        if (!FORMATTRT_LevelItem[p])
                            continue;
                        item[p] = FORMATTRT_LevelItem[p](item[p]);
                    }
                });
                $("#femi-orderPriorityShow-tbody").html($com.util.template(_list, HTML.TableOrderModeShow));
                $("#femi-orderPriorityShow-tbody tr").each(function (i, item) {
                    var $this = $(this);
                    var colorName = $this.css("background-color");
                    $this.attr("data-color", colorName);



                });

                var dayZace = Number($('.zace-selectDay input').val());


                if ($('.zace-selectDayTime input').val().length < 1) {
                    mStartTime = $com.util.format('yyyy-MM-dd', new Date());
                } else {
                    mStartTime = $com.util.format('yyyy-MM-dd', new Date($('.zace-selectDayTime input').val()));
                }

                var _num = (new Date(mStartTime)).getMonth() + 1;
                var _year = (new Date(mStartTime)).getFullYear();
                var days = (new Date(_year, _num, 0)).getDate();

                CurDays = days;
                // $('.zace-selectDay input').val(CurDays);

                // if (dayZace < 7 || dayZace > 15) {
                //     alert("排程天数至少一周时长且不超过15天！");
                //     return false;
                // }
                // if (dayZace < 28 || dayZace > 45) {
                //     alert("排程天数至少为当月时长，且不超过45天！");
                //     return false;


                // }


                mEndTime = model.com.addDays(mStartTime, dayZace - 1);

                param = Number($(".lmvt-param").val());

                model.com.postAutoScheduling({
                    data: {
                        OrderList: SelectData,
                        // OMSOrderPriorityList: mCondition,
                        // LineOrders: _listLine,
                        // CustomerOrders: _listCustomer,
                        APSShiftPeriod: 6,
                        StartTime: mStartTime,
                        EndTime: mEndTime,
                        //WorkDay: MWorkDayID,
                        LimitMinutes: mLimitMinutes,
                        MutualTaskList: mMutualTaskList,
                        Radio: param,
                        WorkShopID: wWorkShopID,
                    }

                }, function (res) {

                    var _list = res;
                    $('.tableZace').hide();
                    $('.orderPriority').hide();
                    $('.zace-orderAll').hide();
                    $('.top-zace').hide();
                    $('.gante').show();
                    zaceRouteList = res.RouteList;
                    mZaceTableGante = $com.util.Clone(res);
                    mStationlist = $com.util.Clone(res.OrderColumn);
                    mTableData = $com.util.Clone(res.TableInfoList);

                    mApsList = $com.util.Clone(_list);

                    TableGanteSource = $com.util.Clone(res.list);

                    wStartTime = res.StartTime;

                    mZaceStation = 0;
                    if (TypeSource_LevelItem.StationID.length > 1)
                        TypeSource_LevelItem.StationID.splice(1, TypeSource_LevelItem.StationID.length - 1);

                    $.each(mStationlist, function (i, item) {
                        TypeSource_LevelItem.StationID.push({
                            name: item.Name,
                            value: item.ID,
                        });



                    });


                    if (res.MaxTime > mEndTime) {
                        zaceTime = $com.util.format('yyyy-MM-dd', new Date(res.MaxTime));
                    } else {
                        zaceTime = mEndTime;
                    }
                    wMaxTime = zaceTime;
                    tableList = model.com.getShiftDetailTable(res.list, res.StartTime, zaceTime);

                    model.com.RanderPlanTable(tableList);

                    //渲染甘特数据
                    var AllGantte = $com.util.Clone(res.TreeList);
                    //需要回显数据
                    var BackRander = [];
                    $.each(AllGantte, function (j, jtem) {
                        $.each(jtem.TaskPartList, function (k, ktem) {
                            for (var m = 0; m < ktem.TaskPartList.length; m++) {

                                if (new Date(ktem.TaskPartList[m].StartTime).getTime() >= new Date(mEndTime).getTime()) {
                                    BackRander.push(ktem.TaskPartList[m]);
                                    ktem.TaskPartList.splice(m, 1);
                                    m--;
                                }
                            }
                        });
                    });



                    var position = {

                        //天数间隔
                        spacePx: 100.0,
                        //左边菜单栏像素
                        freedomPx: 250,
                        //
                        contextHight: 400,
                        radius: 4,
                        tip: {
                            //提示条宽度，高度，行高
                            Text: { tipW: 170, tipH: 70, lineH: 20, titleH: 20 },
                            title: { text: '车号', prop: 'PartNo', visible: false },
                            line: [
                                { text: '开始时间', prop: 'StartTime', visible: true },
                                { text: '时长', prop: 'time', visible: false },

                                { text: '备注', prop: 'TaskText', visible: true },
                                { text: '冲突消息', prop: 'APSMessage', visible: false },//TaskText
                            ]
                        },

                        effect: {
                            Time: mDateEffect,   //日期
                            Part: mPartEffect,   //工位
                            Station: mCloseStationList,
                        },

                        series: {
                            data: [
                                mStartTime,
                                mEndTime,
                            ]
                        },

                        fn: function (source) {


                            if (source && source.length > 0)
                                model.com.BackCall(source);

                            // for (var i = 0; i < source.length; i++) {
                            //     $.each(source[i].TaskPartList, function (j, jtem) {
                            //         $.each(jtem.TaskPartList, function (m, mtem) {
                            //             $.each(mApsList.list, function (k, ktem) {
                            //                 //
                            //                 if (mtem.PartNo == ktem.PartNo && mtem.LineID == ktem.LineID && mtem.PartID == ktem.PartID) {
                            //                     ktem.StartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', mtem.startDate.getTime());
                            //                     ktem.EndTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(mtem.startDate).getTime() + mtem.time * (24 * 3600000));
                            //                 }
                            //             });




                            //         });
                            //     });


                            // };
                            // position.Task.dataList = mApsList.list;
                            //$.each(position.Task.dataList,function(i,item){
                            //       item.StartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(item.StartTime).getTime() + 8 * 3600000);
                            //  });
                            // mApsList = $com.util.Clone(_list);
                            // var demo = cate;
                            // $.each(cate, function (i, item) {
                            //     TablePartData.GantPartList[item].StartDate = $com.util.format('yyyy-MM-dd', source[item].startDate);
                            //     TablePartData.GantPartList[item].StartDate = $com.util.format('yyyy-MM-dd hh:mm:ss', TablePartData.GantPartList[item].StartDate);
                            //     TablePartData.GantPartList[item].EndDate = $com.util.format('yyyy-MM-dd', new Date(source[item].startDate).getTime() + source[item].time * (24 * 3600000));
                            //     TablePartData.GantPartList[item].EndDate = $com.util.format('yyyy-MM-dd hh:mm:ss', TablePartData.GantPartList[item].EndDate);
                            // });

                            // $.each(cate, function (i, item) {
                            //     ChartData.GantPartList[item].StartDate = $com.util.format('yyyy-MM-dd', source[item].startDate);
                            //     ChartData.GantPartList[item].StartDate = $com.util.format('yyyy-MM-dd hh:mm:ss', ChartData.GantPartList[item].StartDate);
                            //     ChartData.GantPartList[item].EndDate = $com.util.format('yyyy-MM-dd', new Date(source[item].startDate).getTime() + source[item].time * (24 * 3600000));
                            //     ChartData.GantPartList[item].EndDate = $com.util.format('yyyy-MM-dd hh:mm:ss', ChartData.GantPartList[item].EndDate);
                            // });

                        },

                        Task: {
                            data: AllGantte,
                            dataList: res.list,
                            routeList: zaceRouteList
                        },

                        yAxis: {

                            data: ['任务一', '任务二', '任务三', '任务四', '任务五', '任务六', '任务七', '任务8', '任务9']

                        },
                    }

                    var counts = 0

                    $.each(position.Task.data, function (j, jtem) {
                        $.each(jtem.TaskPartList, function (k, ktem) {
                            if (!ktem.TaskPartList[0]) {
                                ktem.TaskPartList.push(Temp);
                            }
                            $.each(ktem.TaskPartList, function (m, mtem) {
                                // <th style="min-width: 50px" data-order="PlanReceiveDate">计划进厂</th>
                                // <th style="min-width: 50px" data-order="RealReceiveDate">实际进厂</th>
                                // <th style="min-width: 50px" data-order="PlanFinishDate">预计完工</th>
                                counts++;
                                //天数


                                mtem.time = model.com.GetDays(mtem.StartTime, mtem.EndTime);

                                if (new Date(mtem.StartTime).getHours() == 12) {
                                    mtem.StartTime = $com.util.format("yyyy-MM-dd hh:mm:ss", new Date(mtem.StartTime).getTime() + 8 * 3600000);
                                }
                                mtem.EndTime = $com.util.format("yyyy-MM-dd", mtem.EndTime);
                                mtem.StartTime = $com.util.format("yyyy-MM-dd", mtem.StartTime);
                                mtem.startDate = mtem.StartTime;
                                mtem.color = "#3E90C6"


                                //模板  无订单
                                if (mtem.PartNo.length < 1) {
                                    mtem.startDate = $com.util.format("yyyy-MM-dd", '1970-1-1');
                                }

                            });
                        });
                    });

                    position.contextHight = counts * 25 + 54;

                    model.com.getGantteChangeSource = position.fn();

                    $(function () {

                        if (position.contextHight < $('.lmvt-gantt').height()) {
                            position.contextHight = $('.lmvt-gantt').height();
                        }

                        $ganttWeek.install($('.lmvt-gantt'), $(".lmvt-container-gantt"), position);

                        $ganttWeek.resfushCanvas(position.Task.data);

                    });

                    GantteSource = $com.util.Clone(position);

                    $(".lmvt-gantt").ready(function () {
                        var ScrollDiv = $(".lmvt-container-gantt");
                        $(".canvasLeft1").css("top", ScrollDiv.offset().top);
                        $(".canvasLeft1").css("left", ScrollDiv.offset().left);
                        $(".canvasLeft1").css("width", position.freedomPx);
                        $(".canvasLeft1").css("height", ScrollDiv.height());

                        $(".canvasTop1").css("top", ScrollDiv.offset().top);
                        $(".canvasTop1").css("left", ScrollDiv.offset().left);
                        $(".canvasTop1").css("width", ScrollDiv.width());
                        $(".canvasTop1").css("height", 52);





                    });


                    $com.app.loaded();
                })


            });


            // //。。。。。固定工位  
            // $("body").delegate("#zace-aotu-confirmSta", "click", function () {

            //     var default_value = {
            //         // DepartmentID: 0,
            //         StationID: 0,
            //     };
            //     $("body").append($com.modal.show(default_value, KEYWORD_LevelItem, "查询", function (rst) {


            //         if (!rst || $.isEmptyObject(rst))
            //             return;


            //         mMutualTaskList = [];
            //         var WStation = Number(rst.StationID);
            //         if (WStation > 0) {
            //             var order = 0;//找到工位的顺序
            //             for (var index = 0; index < DataStationList.length; index++) {
            //                 if (WStation == DataStationList[index].ID) {

            //                     order = DataStationList[index].OrderNum;
            //                 }

            //             }
            //             mCloseStationList = [];
            //             var _list = [];  //固定工位集合
            //             for (var i = 0; i < DataStationList.length; i++) {
            //                 if (DataStationList[i].OrderNum <= order) {

            //                     _list.push(DataStationList[i].StationID);
            //                 }

            //             }

            //             for (var m = 0; m < _list.length; m++) {
            //                 for (var n = 0; n < mApsList.list.length; n++) {
            //                     if (_list[m] == mApsList.list[n].PartID) {
            //                         mMutualTaskList.push(mApsList.list[n]);
            //                     }

            //                 }

            //             }
            //             mCloseStationList = _list;
            //         } else {
            //             mCloseStationList = [];

            //         }

            //         $com.app.loading();

            //         model.com.postAutoScheduling({
            //             data: {
            //                 OrderList: mOrderList,
            //                 // OMSOrderPriorityList: mCondition,
            //                 // LineOrders: _listLine,
            //                 // CustomerOrders: _listCustomer,
            //                 APSShiftPeriod: 6,
            //                 StartTime: mStartTime,
            //                 EndTime: mEndTime,
            //                 WorkDay: MWorkDayID,
            //                 LimitMinutes: mLimitMinutes,
            //                 MutualTaskList: mMutualTaskList,
            //             }

            //         }, function (res) {

            //             var _list = res;
            //             $('.tableZace').hide();
            //             $('.orderPriority').hide();
            //             $('.zace-orderAll').hide();
            //             $('.top-zace').hide();
            //             $('.gante').show();

            //             mZaceTableGante = $com.util.Clone(res);
            //             mStationlist = $com.util.Clone(res.OrderColumn);
            //             mTableData = $com.util.Clone(res.TableInfoList);

            //             mApsList = $com.util.Clone(_list);

            //             if (res.MaxTime > mEndTime) {
            //                 zaceTime = $com.util.format('yyyy-MM-dd', new Date(res.MaxTime));
            //             } else {
            //                 zaceTime = mEndTime;
            //             }


            //             //渲染甘特数据
            //             var AllGantte = $com.util.Clone(res.TreeList);
            //             //需要回显数据
            //             var BackRander = [];
            //             $.each(AllGantte, function (j, jtem) {
            //                 $.each(jtem.TaskPartList, function (k, ktem) {
            //                     for (var m = 0; m < ktem.TaskPartList.length; m++) {

            //                         if (new Date(ktem.TaskPartList[m].StartTime).getTime() >= new Date(mEndTime).getTime()) {
            //                             BackRander.push(ktem.TaskPartList[m]);
            //                             ktem.TaskPartList.splice(m, 1);
            //                             m--;
            //                         }

            //                     }


            //                 });
            //             });


            //             //alert("成功");
            //             //  model.com.refresh();
            //             var position = {

            //                 //天数间隔
            //                 spacePx: 100.0,
            //                 //左边菜单栏像素
            //                 freedomPx: 250,
            //                 //
            //                 contextHight: 400,
            //                 radius: 4,
            //                 tip: {
            //                     //提示条宽度，高度，行高
            //                     Text: { tipW: 170, tipH: 70, lineH: 20, titleH: 20 },
            //                     title: { text: '车号', prop: 'PartNo', visible: true },
            //                     line: [
            //                         { text: '开始时间', prop: 'StartTime', visible: true },
            //                         { text: '时长', prop: 'time', visible: false },

            //                         { text: '备注', prop: 'TaskText', visible: true },
            //                         { text: '冲突消息', prop: 'APSMessage', visible: false },//TaskText
            //                     ]
            //                 },

            //                 effect: {
            //                     Time: mDateEffect,   //日期
            //                     Part: mPartEffect,   //工位
            //                     Station: mCloseStationList,
            //                 },

            //                 series: {
            //                     data: [
            //                         mStartTime,
            //                         mEndTime,
            //                     ]
            //                 },

            //                 fn: function (source) {

            //                     for (var i = 0; i < source.length; i++) {
            //                         $.each(source[i].TaskPartList, function (j, jtem) {
            //                             $.each(jtem.TaskPartList, function (m, mtem) {
            //                                 $.each(mApsList.list, function (k, ktem) {
            //                                     //
            //                                     if (mtem.PartNo == ktem.PartNo && mtem.LineID == ktem.LineID && mtem.PartID == ktem.PartID) {
            //                                         ktem.StartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', mtem.startDate.getTime() - 8 * 3600000);
            //                                         ktem.EndTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(mtem.startDate).getTime() + mtem.time * (24 * 3600000) - 8 * 3600000);
            //                                     }
            //                                 });




            //                             });
            //                         });


            //                     };
            //                     position.Task.dataList = mApsList.list;
            //                     // mApsList = $com.util.Clone(_list);
            //                     // var demo = cate;
            //                     // $.each(cate, function (i, item) {
            //                     //     TablePartData.GantPartList[item].StartDate = $com.util.format('yyyy-MM-dd', source[item].startDate);
            //                     //     TablePartData.GantPartList[item].StartDate = $com.util.format('yyyy-MM-dd hh:mm:ss', TablePartData.GantPartList[item].StartDate);
            //                     //     TablePartData.GantPartList[item].EndDate = $com.util.format('yyyy-MM-dd', new Date(source[item].startDate).getTime() + source[item].time * (24 * 3600000));
            //                     //     TablePartData.GantPartList[item].EndDate = $com.util.format('yyyy-MM-dd hh:mm:ss', TablePartData.GantPartList[item].EndDate);
            //                     // });

            //                     // $.each(cate, function (i, item) {
            //                     //     ChartData.GantPartList[item].StartDate = $com.util.format('yyyy-MM-dd', source[item].startDate);
            //                     //     ChartData.GantPartList[item].StartDate = $com.util.format('yyyy-MM-dd hh:mm:ss', ChartData.GantPartList[item].StartDate);
            //                     //     ChartData.GantPartList[item].EndDate = $com.util.format('yyyy-MM-dd', new Date(source[item].startDate).getTime() + source[item].time * (24 * 3600000));
            //                     //     ChartData.GantPartList[item].EndDate = $com.util.format('yyyy-MM-dd hh:mm:ss', ChartData.GantPartList[item].EndDate);
            //                     // });

            //                 },

            //                 Task: {
            //                     data: AllGantte,
            //                     dataList: res.list
            //                 },

            //                 yAxis: {

            //                     data: ['任务一', '任务二', '任务三', '任务四', '任务五', '任务六', '任务七', '任务8', '任务9']

            //                 },
            //             }

            //             var counts = 0

            //             $.each(position.Task.data, function (j, jtem) {
            //                 $.each(jtem.TaskPartList, function (k, ktem) {

            //                     if (!ktem.TaskPartList[0]) {
            //                         ktem.TaskPartList.push(Temp);
            //                     }


            //                     $.each(ktem.TaskPartList, function (m, mtem) {
            //                         // <th style="min-width: 50px" data-order="PlanReceiveDate">计划进厂</th>
            //                         // <th style="min-width: 50px" data-order="RealReceiveDate">实际进厂</th>
            //                         // <th style="min-width: 50px" data-order="PlanFinishDate">预计完工</th>
            //                         counts++;
            //                         //天数
            //                         mtem.time = model.com.GetDays(mtem.StartTime, mtem.EndTime);

            //                         mtem.StartTime = $com.util.format("yyyy-MM-dd", mtem.StartTime);
            //                         mtem.EndTime = $com.util.format("yyyy-MM-dd hh:mm:ss", mtem.EndTime);
            //                         mtem.startDate = mtem.StartTime;
            //                         mtem.color = "#3E90C6"


            //                         //模板  无订单
            //                         if (mtem.PartNo.length < 1) {
            //                             mtem.startDate = $com.util.format("yyyy-MM-dd", '1970-1-1');
            //                         }

            //                     });
            //                 });
            //             });

            //             position.contextHight = counts * 25 + 54;



            //             $(function () {

            //                 $ganttWeek.install($('.lmvt-gantt'), $(".lmvt-container-gantt"), position);

            //                 $ganttWeek.resfushCanvas(position.Task.data);

            //             });

            //             $(".lmvt-gantt").ready(function () {
            //                 var ScrollDiv = $(".lmvt-container-gantt");
            //                 $(".canvasLeft1").css("top", ScrollDiv.offset().top);
            //                 $(".canvasLeft1").css("left", ScrollDiv.offset().left);
            //                 $(".canvasLeft1").css("width", position.freedomPx);
            //                 $(".canvasLeft1").css("height", ScrollDiv.height());

            //                 $(".canvasTop1").css("top", ScrollDiv.offset().top);
            //                 $(".canvasTop1").css("left", ScrollDiv.offset().left);
            //                 $(".canvasTop1").css("width", ScrollDiv.width());
            //                 $(".canvasTop1").css("height", 52);





            //             });


            //             $com.app.loaded();
            //         })


            //     }, TypeSource_LevelItem));





            // });

            //。。。。。固定工位  
            $("body").delegate("#zace-aotu-confirmSta", "click", function () {

                var default_value = {
                    // DepartmentID: 0,
                    StationID: mZaceStation,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_LevelItem, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;


                    mMutualTaskList = [];
                    var WStation = Number(rst.StationID);
                    mZaceStation = WStation;
                    if (WStation > 0) {
                        var order = 0;//找到工位的顺序
                        for (var index = 0; index < DataStationList.length; index++) {
                            if (WStation == DataStationList[index].ID) {

                                order = DataStationList[index].OrderNum;
                            }

                        }
                        mCloseStationList = [];
                        var _list = [];  //固定工位集合
                        for (var i = 0; i < DataStationList.length; i++) {
                            if (DataStationList[i].OrderNum <= order) {

                                _list.push(DataStationList[i].StationID);
                            }

                        }

                        for (var m = 0; m < _list.length; m++) {
                            for (var n = 0; n < mApsList.list.length; n++) {
                                if (_list[m] == mApsList.list[n].PartID) {
                                    mMutualTaskList.push(mApsList.list[n]);
                                }

                            }

                        }
                        mCloseStationList = _list;
                    } else {
                        mCloseStationList = [];

                    }

                    $com.app.loading();



                    for (var k = 0; k < mApsList.list.length; k++) {

                        $com.util.deleteLowerProperty(mApsList.list[k]);
                    }

                    for (var m = 0; m < mMesList.length; m++) {

                        $com.util.deleteLowerProperty(mMesList[m]);
                    }
                    model.com.postTreeList({
                        MessageList: mMesList,

                        TaskPartList: mApsList.list,

                    }, function (res) {

                        mApsList.TreeList = $com.util.Clone(res.list);

                        // model.com.postAutoScheduling({
                        //     data: {
                        //         OrderList: mOrderList,
                        //         // OMSOrderPriorityList: mCondition,
                        //         // LineOrders: _listLine,
                        //         // CustomerOrders: _listCustomer,
                        //         APSShiftPeriod: 6,
                        //         StartTime: mStartTime,
                        //         EndTime: mEndTime,
                        //         WorkDay: MWorkDayID,
                        //         LimitMinutes: mLimitMinutes,
                        //         MutualTaskList: mMutualTaskList,
                        //     }

                        // }, function (res) {

                        //     var _list = res;
                        //     $('.tableZace').hide();
                        //     $('.orderPriority').hide();
                        //     $('.zace-orderAll').hide();
                        //     $('.top-zace').hide();
                        //     $('.gante').show();

                        //     mZaceTableGante = $com.util.Clone(res);
                        //     mStationlist = $com.util.Clone(res.OrderColumn);
                        //     mTableData = $com.util.Clone(res.TableInfoList);

                        //     mApsList = $com.util.Clone(_list);

                        //     if (res.MaxTime > mEndTime) {
                        //         zaceTime = $com.util.format('yyyy-MM-dd', new Date(res.MaxTime));
                        //     } else {
                        //         zaceTime = mEndTime;
                        //     }


                        //     //渲染甘特数据
                        //     var AllGantte = $com.util.Clone(res.TreeList);
                        //     //需要回显数据
                        //     var BackRander = [];
                        //     $.each(AllGantte, function (j, jtem) {
                        //         $.each(jtem.TaskPartList, function (k, ktem) {
                        //             for (var m = 0; m < ktem.TaskPartList.length; m++) {

                        //                 if (new Date(ktem.TaskPartList[m].StartTime).getTime() >= new Date(mEndTime).getTime()) {
                        //                     BackRander.push(ktem.TaskPartList[m]);
                        //                     ktem.TaskPartList.splice(m, 1);
                        //                     m--;
                        //                 }

                        //             }


                        //         });
                        //     });


                        //alert("成功");
                        //  model.com.refresh();
                        var position = {

                            //天数间隔
                            spacePx: 100.0,
                            //左边菜单栏像素
                            freedomPx: 250,
                            //
                            contextHight: 400,
                            radius: 4,
                            tip: {
                                //提示条宽度，高度，行高
                                Text: { tipW: 170, tipH: 70, lineH: 20, titleH: 20 },
                                title: { text: '车号', prop: 'PartNo', visible: false },
                                line: [
                                    { text: '开始时间', prop: 'StartTime', visible: true },
                                    { text: '时长', prop: 'time', visible: false },

                                    { text: '备注', prop: 'TaskText', visible: true },
                                    { text: '冲突消息', prop: 'APSMessage', visible: false },//TaskText
                                ]
                            },

                            effect: {
                                Time: mDateEffect,   //日期
                                Part: mPartEffect,   //工位
                                Station: mCloseStationList,
                            },

                            series: {
                                data: [
                                    mStartTime,
                                    mEndTime,
                                ]
                            },

                            fn: function (source) {

                                for (var i = 0; i < source.length; i++) {
                                    $.each(source[i].TaskPartList, function (j, jtem) {
                                        $.each(jtem.TaskPartList, function (m, mtem) {
                                            $.each(mApsList.list, function (k, ktem) {
                                                //
                                                if (mtem.PartNo == ktem.PartNo && mtem.LineID == ktem.LineID && mtem.PartID == ktem.PartID) {
                                                    ktem.StartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', mtem.startDate.getTime());
                                                    ktem.EndTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(mtem.startDate).getTime() + mtem.time * (24 * 3600000));
                                                }
                                            });




                                        });
                                    });


                                };
                                position.Task.dataList = mApsList.list;
                                // $.each(position.Task.dataList,function(i,item){
                                //     item.StartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(item.StartTime).getTime() + 8 * 3600000);
                                //});
                                // mApsList = $com.util.Clone(_list);
                                // var demo = cate;
                                // $.each(cate, function (i, item) {
                                //     TablePartData.GantPartList[item].StartDate = $com.util.format('yyyy-MM-dd', source[item].startDate);
                                //     TablePartData.GantPartList[item].StartDate = $com.util.format('yyyy-MM-dd hh:mm:ss', TablePartData.GantPartList[item].StartDate);
                                //     TablePartData.GantPartList[item].EndDate = $com.util.format('yyyy-MM-dd', new Date(source[item].startDate).getTime() + source[item].time * (24 * 3600000));
                                //     TablePartData.GantPartList[item].EndDate = $com.util.format('yyyy-MM-dd hh:mm:ss', TablePartData.GantPartList[item].EndDate);
                                // });

                                // $.each(cate, function (i, item) {
                                //     ChartData.GantPartList[item].StartDate = $com.util.format('yyyy-MM-dd', source[item].startDate);
                                //     ChartData.GantPartList[item].StartDate = $com.util.format('yyyy-MM-dd hh:mm:ss', ChartData.GantPartList[item].StartDate);
                                //     ChartData.GantPartList[item].EndDate = $com.util.format('yyyy-MM-dd', new Date(source[item].startDate).getTime() + source[item].time * (24 * 3600000));
                                //     ChartData.GantPartList[item].EndDate = $com.util.format('yyyy-MM-dd hh:mm:ss', ChartData.GantPartList[item].EndDate);
                                // });

                            },

                            Task: {
                                data: mApsList.TreeList,
                                dataList: mApsList.list,
                                routeList: zaceRouteList
                            },

                            yAxis: {

                                data: ['任务一', '任务二', '任务三', '任务四', '任务五', '任务六', '任务七', '任务8', '任务9']

                            },
                        }

                        var counts = 0

                        $.each(position.Task.data, function (j, jtem) {
                            $.each(jtem.TaskPartList, function (k, ktem) {

                                if (!ktem.TaskPartList[0]) {
                                    ktem.TaskPartList.push(Temp);
                                }


                                $.each(ktem.TaskPartList, function (m, mtem) {
                                    // <th style="min-width: 50px" data-order="PlanReceiveDate">计划进厂</th>
                                    // <th style="min-width: 50px" data-order="RealReceiveDate">实际进厂</th>
                                    // <th style="min-width: 50px" data-order="PlanFinishDate">预计完工</th>
                                    counts++;
                                    //天数
                                    mtem.time = model.com.GetDays(mtem.StartTime, mtem.EndTime);

                                    if (new Date(mtem.StartTime).getHours() == 12) {
                                        mtem.StartTime = $com.util.format("yyyy-MM-dd hh:mm:ss", new Date(mtem.StartTime).getTime() + 8 * 3600000);
                                    }
                                    mtem.EndTime = $com.util.format("yyyy-MM-dd hh:mm:ss", mtem.EndTime);
                                    mtem.startDate = mtem.StartTime;
                                    mtem.color = "#3E90C6"


                                    //模板  无订单
                                    if (mtem.PartNo.length < 1) {
                                        mtem.startDate = $com.util.format("yyyy-MM-dd", '1970-1-1');
                                    }

                                });
                            });
                        });

                        position.contextHight = counts * 25 + 54;



                        $(function () {

                            $ganttWeek.install($('.lmvt-gantt'), $(".lmvt-container-gantt"), position);

                            $ganttWeek.resfushCanvas(position.Task.data);

                        });

                        $(".lmvt-gantt").ready(function () {
                            var ScrollDiv = $(".lmvt-container-gantt");
                            $(".canvasLeft1").css("top", ScrollDiv.offset().top);
                            $(".canvasLeft1").css("left", ScrollDiv.offset().left);
                            $(".canvasLeft1").css("width", position.freedomPx);
                            $(".canvasLeft1").css("height", ScrollDiv.height());

                            $(".canvasTop1").css("top", ScrollDiv.offset().top);
                            $(".canvasTop1").css("left", ScrollDiv.offset().left);
                            $(".canvasTop1").css("width", ScrollDiv.width());
                            $(".canvasTop1").css("height", 52);





                        });


                        $com.app.loaded();
                    })


                }, TypeSource_LevelItem));





            });


            //优先级上移 单条
            $("body").delegate(".lmvt-up", "click", function () {
                //var SelectData = $com.table.getSelectionData($("#femi-orderPriority-tbody"), "WID", mSelDataOrderList);
                // if (!SelectData || !SelectData.length) {
                //     alert("请先选择一行数据再试！")
                //     return;
                // }
                // if (SelectData.length != 1) {
                //     alert("只能同时对一行数据操作！")
                //     return;
                // }

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = mSelDataOrderList.filter((item) => { return item.ID == wID });

                if (SelectData[0].WID == 1) {
                    alert("已在第一行！");
                    return false;
                }

                model.com.refreshPriority(mSelDataOrderList, SelectData[0].WID - 1, SelectData[0].WID - 2);


            });

            //优先级上移
            $("body").delegate("#zace-aotu-upZ", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-orderPriority-tbody"), "WID", mSelDataOrderList);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！")
                    return;
                }

                if (SelectData[0].WID == 1) {
                    alert("已在第一行！");
                    return false;
                }

                model.com.refreshPriority(mSelDataOrderList, SelectData[0].WID - 1, SelectData[0].WID - 2);


            });

            //优先级下移
            $("body").delegate(".lmvt-down", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = mSelDataOrderList.filter((item) => { return item.ID == wID });
                if (SelectData[0].WID == mSelDataOrderList.length) {
                    alert("已在最后一行！");
                    return false;
                }
                model.com.refreshPriority(mSelDataOrderList, SelectData[0].WID - 1, SelectData[0].WID);


            });


            //优先级下移
            $("body").delegate("#zace-aotu-downZ", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-orderPriority-tbody"), "WID", mSelDataOrderList);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！")
                    return;
                }
                if (SelectData[0].WID == mSelDataOrderList.length) {
                    alert("已在最后一行！");
                    return false;
                }
                model.com.refreshPriority(mSelDataOrderList, SelectData[0].WID - 1, SelectData[0].WID);


            });

            $("body").delegate("#zace-table-searchPartNo", "click", function () {
                var default_value = {
                    mPartNo: 0,
                };

                $("body").append($com.modal.show(default_value, KEYWORD_LevelItem, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;
                    mOrderID = Number(rst.mPartNo);

                    //mZaceTableGante
                    model.com.refreshGanteZace(mOrderID, mApsList);

                }, TypeSource_LevelItem));
            });


            //zace-table-gantt   
            $("body").delegate("#zace-table-gantt", "click", function () {

                $('.tableZace').hide();
                $('.orderPriority').hide();
                $('.zace-orderAll').hide();
                $('.top-zace').hide();
                $('.gante').show();
                $('.ganteTable').hide();



            });
            $("body").delegate("#zace-table-ganttZace", "click", function () {


                for (var k = 0; k < mApsList.list.length; k++) {

                    $com.util.deleteLowerProperty(mApsList.list[k]);
                }
                model.com.getTableData({

                    OrderList: mOrderList,

                    TaskPartList: mApsList.list,
                    Type: 1


                }, function (resW) {
                    if (resW && resW.OrderColumn) {

                        mStationlist = $com.util.Clone(resW.OrderColumn);
                        mTableData = $com.util.Clone(resW.TableInfoList);
                        mZaceStation = 0;
                        if (TypeSource_LevelItem.StationID.length > 1)
                            TypeSource_LevelItem.StationID.splice(1, TypeSource_LevelItem.StationID.length - 1);
                        $.each(mStationlist, function (i, item) {
                            TypeSource_LevelItem.StationID.push({
                                name: item.Name,
                                value: item.ID,
                            });
                        });
                    }
                    $('.tableZace').hide();
                    $('.orderPriority').hide();
                    $('.zace-orderAll').hide();
                    $('.top-zace').hide();
                    $('.gante').hide();
                    $('.ganteTable').show();
                    model.com.FullTemple(mTableData[0], mTableData, mStationlist);
                });




                // model.com.FullTemple(mTableData[0], mTableData, mStationlist);


            });

            //影响条件
            $("body").delegate("#zace-table-searchEffect", "click", function () {
                var default_value = {
                    mDateZace: mDateEffect,
                    mPartZace: mPartEffect,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_LevelItem, "查询", function (rst) {
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    mDateEffect = Number(rst.mDateZace);
                    mPartEffect = Number(rst.mPartZace);
                    model.com.refreshGanteZace(mOrderID, mApsList)
                }, TypeSource_LevelItem));
            });

            window.setFunctionTrigger("RanderGantt", function (obj) {
                var ID = obj.ID,
                    VersionNo = obj.VersionNo;
                wWorkShopID = obj.WorkShopID;

                ISMove = Number(ISMove);

                model.com.refreshGantte(ID, VersionNo);

                //$(".lmvt-partNoTitle").text(PartNo);
            });
            // 提交e
            $("body").delegate("#Confirm", "click", function () {
                model.com.getSchedulingVersionAll({ APSShiftPeriod: 5, StartTime: "2000-1-1", EndTime: "2000-1-1", WorkShopID: -1 }, function (res) {
                    if (!res)
                        return;
                    if (res && res.list) {
                        VersionSource = $com.util.Clone(res.list);
                        var Selection_Data = VersionSource.filter((item) => { return item.VersionNo == wVersionNo });
                        // if (Selection_Data[0].Status == 0) {
                        //     alert("该版本未保存禁止提交！");
                        //     return false;
                        // }
                        if (!(Selection_Data[0].Status == 1 || Selection_Data[0].Status == 0)) {
                            alert("该版本已提交，请勿重复操作！");
                            return false;
                        }
                        mCloneData.UpFlowID = mCloneData.UpFlowID + "";
                        mCloneData.VersionID = Selection_Data[0].ID;
                        mCloneData.VersionID_txt_ = Selection_Data[0].VersionNo;
                        model.com.addsubmit();
                    }
                });
            });
            $("body").delegate("#myModal", "click", function () {
                $(".bootstrap-select-searchbox input").removeAttr("disabled");
            });

        },

        run: function () {
            mQueryTaskID = 0;
            var wID = Number(model.query.ID);
            TaskID = Number(model.query.taskid);
            wVersionNo = model.query.VersionNo;
            wWorkShopID = model.query.WorkShopID;
            mQueryTaskID = model.query.queryTaskid;


            TaskID = !TaskID ? 0 : TaskID;
            mQueryTaskID = !mQueryTaskID ? 0 : mQueryTaskID;
            if (mQueryTaskID == 0) {
                $("#zace-aotu-checked").hide();
                $("#zace-export-saved").hide();
                $("#btnGroupBPM").hide();
            }

            ISMove = model.query.ISMove;

            model.com.refreshGantte(wID, wVersionNo);
            model.com.SchedulingVersion(wID);
        },

        com: {
            addsubmit: function () {

                _listCommitObj = $com.util.Clone(mCloneData);
                _listCommitObj.WorkShopID = wWorkShopID;
                _listCommitObj.Status = "3";
                _listCommitObj.CreateTime = $com.util.format("yyyy-MM-dd hh:mm:ss", new Date());
                _listCommitObj.Remark = $('.Write-content-Remark').val();//状态根据流程引擎节点来
                _listCommitObj.Remark_txt_ = $('.Write-content-Remark').val();//状态根据流程引擎节点来

                $com.util.deleteLowerProperty(_listCommitObj);
                if (!confirm("确定提交周计划吗？")) {
                    return;
                }
                $com.app.loading();
                model.com.postTask({ "TaskID": Todotasks.ID, "data": _listCommitObj }, function (res) {
                    alert("提交成功！");
                    $('#myModal').modal('hide');
                    $com.app.loaded();
                    // if (mQueryTaskID != 0) {
                    var vdata = { 'header': '周计划-审批', 'href': './product_plan/LOCOHistoryPlan_tmCL.html', 'id': 'LOCOHistoryPlan_tmCL', 'src': './static/images/menu/newfactoryModel/techniquePart.png' };
                    window.parent.iframeHeaderSet(vdata);
                    $("#zace-done").click();
                    // }
                });
            },
            refreshBPM: function (wID) {
                $com.app.loading('数据加载中...');
                if (mQueryTaskID == 0) {
                    var taskIDObj = {
                        key: "_8101"
                    };
                    var dataVersion = VersionSource.filter((item) => {
                        return item.ID == wID
                    });
                    model.com.onTask({
                        processDefinitionKey: taskIDObj.key,
                        BusinessKey: "",
                        data: dataVersion[0]
                    }, [function (data) {
                        //获取实例ID
                        mCloneData = data.data;
                        $com.util.deleteLowerProperty(mCloneData);
                        mCloneListRead = $com.util.Clone(mCloneData);
                        Todotasks = data.list[0];
                        model.com.RunTask(data.list[0]);
                    }, function () {
                        alert("创建任务失败！");
                        return false;
                    }]);
                } else {
                    model.com.getEmployeeInfo({
                        ID: TaskID
                    }, function (data) {
                        mCloneData = data.info;
                        $com.util.deleteLowerProperty(mCloneData);
                        mCloneListRead = $com.util.Clone(mCloneData);
                        if (data.msg.length != 0) {
                            alert(data.msg);
                            return false;
                        }
                        $com.util.deleteLowerProperty(mCloneData);
                        // 根据任务ID获取任务
                        model.com.getTask({ taskId: mQueryTaskID }, function (res) {
                            Todotasks = res.info;
                            if (Todotasks.Status != 0) {
                                alert("该任务已完成！");
                                return false;
                            }
                            // 根据流程实例ID 获取流程实例历史
                            model.com.getHistoryTask({ processInstanceId: Todotasks.ProcessInstanceId }, function (resP) {
                                mHistoryTask = resP.list;
                                model.com.RunTask(Todotasks);
                            });
                        });
                    });
                }


            },
            SchedulingVersion: function (wID) {
                model.com.getSchedulingVersionAll({ APSShiftPeriod: 5, StartTime: "2000-1-1", EndTime: "2000-1-1", WorkShopID: -1 }, function (res) {
                    if (!res)
                        return;
                    if (res && res.list) {
                        VersionSource = $com.util.Clone(res.list);
                        model.com.refreshBPM(wID);
                    }
                });
            },
            RunTask: function (Todotasks) {
                if (!Todotasks) {
                    alert("未获取到任务！");
                    return false;
                }
                mTaskID = Todotasks.ID;
                var moveCarProcess = Todotasks.ProcessDefinitionId;
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
                    $(".WeekPlanContent").html($com.util.template(mIsReadableListCopy, HTML.WeekPlan));

                    $com.app.loaded();
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

            refreshGantte: function (wID, wVersionNo) {
                model.com.getSchedulingVersionInfoDetail({
                    ID: wID,
                    VersionNo: wVersionNo,


                }, function (res) {

                    $(".lmvt-Name").text("(" + wVersionNo + ")");

                    var _list = res;

                    zaceRouteList = res.RouteList;
                    mZaceTableGante = $com.util.Clone(res);

                    mApsList = $com.util.Clone(_list);

                    TableGanteSource = $com.util.Clone(res.list);

                    wStartTime = res.StartTime;

                    //var obj = model.com.SelectMaxAndMinTimeGantte(res.list);

                    wStartTime = $com.util.format("yyyy-MM-dd", res.StartTime);

                    mEndTime = $com.util.format("yyyy-MM-dd", res.MaxTime);

                    var dayZace = model.com.GetDays(wStartTime, mEndTime);

                    tableList = model.com.getShiftDetailTable(res.list, wStartTime, mEndTime);

                    model.com.RanderPlanTable(tableList);

                    //渲染甘特数据
                    var AllGantte = $com.util.Clone(res.TreeList);
                    //需要回显数据
                    var BackRander = [];
                    $.each(AllGantte, function (j, jtem) {
                        $.each(jtem.TaskPartList, function (k, ktem) {
                            for (var m = 0; m < ktem.TaskPartList.length; m++) {

                                if (new Date(ktem.TaskPartList[m].StartTime).getTime() >= new Date(mEndTime).getTime()) {
                                    BackRander.push(ktem.TaskPartList[m]);
                                    ktem.TaskPartList.splice(m, 1);
                                    m--;
                                }
                            }
                        });
                    });



                    var position = {
                        ISMouseMove: ISMove ? 0 : 1,
                        //天数间隔
                        spacePx: 100.0,
                        //左边菜单栏像素
                        freedomPx: 250,
                        //
                        contextHight: 400,
                        radius: 4,
                        tip: {
                            //提示条宽度，高度，行高
                            Text: { tipW: 170, tipH: 70, lineH: 20, titleH: 20 },
                            title: { text: '车号', prop: 'OrderNo', visible: false },
                            line: [
                                { text: '开始时间', prop: 'StartTime', visible: true },
                                { text: '时长', prop: 'time', visible: false },

                                { text: '备注', prop: 'TaskText', visible: true },
                                { text: '冲突消息', prop: 'APSMessage', visible: false },//TaskText
                            ]
                        },

                        effect: {
                            Time: mDateEffect,   //日期
                            Part: mPartEffect,   //工位
                            Station: mCloseStationList,
                        },

                        series: {
                            data: [
                                wStartTime,
                                mEndTime,
                            ]
                        },

                        fn: function (source) {
                            if (source && source.length > 0)
                                model.com.BackCall(source);
                        },

                        Task: {
                            data: AllGantte,
                            dataList: res.list,
                            routeList: zaceRouteList
                        },

                        yAxis: {

                            data: ['任务一', '任务二', '任务三', '任务四', '任务五', '任务六', '任务七', '任务8', '任务9']

                        },
                    }

                    var counts = 0

                    $.each(position.Task.data, function (j, jtem) {
                        $.each(jtem.TaskPartList, function (k, ktem) {
                            if (!ktem.TaskPartList[0]) {
                                ktem.TaskPartList.push(Temp);
                            }
                            $.each(ktem.TaskPartList, function (m, mtem) {

                                counts++;
                                //天数
                                mtem.time = model.com.GetDays(mtem.StartTime, mtem.EndTime);

                                if (new Date(mtem.StartTime).getHours() == 12) {
                                    mtem.StartTime = $com.util.format("yyyy-MM-dd hh:mm:ss", new Date(mtem.StartTime).getTime() + 8 * 3600000);
                                }
                                mtem.EndTime = $com.util.format("yyyy-MM-dd", mtem.EndTime);
                                mtem.StartTime = $com.util.format("yyyy-MM-dd", mtem.StartTime);
                                mtem.startDate = mtem.StartTime;
                                mtem.color = "#3E90C6"


                                //模板  无订单
                                if (mtem.PartNo.length < 1) {
                                    mtem.startDate = $com.util.format("yyyy-MM-dd", '1970-1-1');
                                }

                            });
                        });
                    });

                    position.contextHight = counts * 25 + 54;

                    model.com.getGantteChangeSource = position.fn();

                    $(function () {

                        if (position.contextHight < $('.lmvt-gantt').height()) {
                            position.contextHight = $('.lmvt-gantt').height();

                        }
                        if (position.spacePx * dayZace <= $('.lmvt-gantt').width() - position.freedomPx) {
                            position.spacePx = ($('.lmvt-gantt').width() - position.freedomPx) / dayZace;
                        }
                        $ganttWeek.install($('.lmvt-gantt'), $(".lmvt-container-gantt"), position);

                        $ganttWeek.resfushCanvas(position.Task.data);
                    });

                    GantteSource = $com.util.Clone(position);

                    $(".lmvt-gantt").ready(function () {
                        var ScrollDiv = $(".lmvt-container-gantt");
                        $(".canvasLeft1").css("top", ScrollDiv.offset().top);
                        $(".canvasLeft1").css("left", ScrollDiv.offset().left);
                        $(".canvasLeft1").css("width", position.freedomPx);
                        $(".canvasLeft1").css("height", ScrollDiv.height());

                        $(".canvasTop1").css("top", ScrollDiv.offset().top);
                        $(".canvasTop1").css("left", ScrollDiv.offset().left);
                        $(".canvasTop1").css("width", ScrollDiv.width());
                        $(".canvasTop1").css("height", 52);
                    });
                    $com.app.loaded();
                })



            },
            //获取排程数据
            getSchedulingVersionInfoDetail: function (data, fn, context) {
                var d = {
                    $URI: "/SchedulingVersion/InfoDetail",
                    $TYPE: "get",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //甘特回调改变表格
            BackCall: function (source) {
                var array = []
                $.each(source, function (j, jtem) {
                    $.each(jtem.TaskPartList, function (k, ktem) {
                        if (!ktem.TaskPartList[0]) {
                            ktem.TaskPartList.push(Temp);
                        }
                        $.each(ktem.TaskPartList, function (m, mtem) {


                            $.each(TableGanteSource, function (n, ntem) {
                                if (mtem.UniqueID == ntem.UniqueID) {

                                    if (mtem.ShiftDetail.length > 0) {

                                        var arr = model.com.ChangeTableSource(mtem);

                                        array.push(arr);

                                        return false;

                                    }


                                }

                            });

                        });
                    });
                });

                $.each(TableGanteSource, function (i, item) {
                    item.ShiftDetail = [];
                    item.ShiftDetail = array[i];
                });

                tableList = model.com.getShiftDetailTable(TableGanteSource, mStartTime, zaceTime);

                model.com.RanderPlanTable(tableList);
            },


            //找到数组中最小的时间与最大的时间
            ChangeTableSource: function (Obj) {

                var Arr = Obj.ShiftDetail.sort(function (a, b) {
                    if (a.WorkDate.indexOf("/") > 0) {
                        a.WorkDate = $com.util.format("yyyy-MM-dd", a.WorkDate.replace(/_/g, "-"));
                    }
                    if (b.WorkDate.indexOf("/") > 0) {
                        b.WorkDate = $com.util.format("yyyy-MM-dd", b.WorkDate.replace(/_/g, "-"));
                    }

                    return new Date(a.WorkDate).getTime() - new Date(b.WorkDate).getTime();
                });



                var Start = new Date(Obj.ShiftDetail[0].WorkDate).getTime(),
                    End = new Date(Obj.startDate).getTime();

                var time = (End - Start) / (24 * 3600000);

                for (var i = Arr.length - 1; i >= 0; i--) {
                    Arr[i].WorkDate = $com.util.format("yyyy-MM-dd", new Date(Arr[i].WorkDate).getTime() + time * (24 * 3600000));
                }

                return Arr;
            },
            //找到数组中最小的时间与最大的时间
            SelectMaxAndMinTime: function (Arr) {

                Arr = Arr.sort(function (a, b) {
                    return new Date(a.WorkDate).getTime() - new Date(b.WorkDate).getTime();
                });

                var obj = {};
                obj.StartTime = "2000-01-01";
                obj.EndTime = "2000-01-01";

                var temp = true,
                    MaxTime;

                for (let index = 0; index < Arr.length; index++) {
                    if (Arr[index].PlanNum > 0) {
                        if (temp) {
                            obj.StartTime = Arr[index].WorkDate;
                            MaxTime = new Date(Arr[index].WorkDate);
                            temp = false;
                        }

                        if (new Date(Arr[index].WorkDate).getTime() >= MaxTime.getTime()) {
                            MaxTime = new Date(Arr[index].WorkDate);
                            obj.EndTime = Arr[index].WorkDate;
                        }
                    } else {
                        continue;
                    }
                }

                if (obj.StartTime.indexOf("/") > 0) {
                    obj.StartTime = $com.util.format("yyyy-MM-dd", obj.StartTime.replace(/_/g, "-"));
                }
                if (obj.EndTime.indexOf("/") > 0) {
                    obj.EndTime = $com.util.format("yyyy-MM-dd", obj.EndTime.replace(/_/g, "-"));
                }

                obj.StartTime = $com.util.format("yyyy-MM-dd", obj.StartTime);
                obj.EndTime = $com.util.format("yyyy-MM-dd", obj.EndTime);

                return obj;
            },

            //找到数组中最小的时间与最大的时间
            SelectMaxAndMinTimeGantte: function (Arr) {

                var obj = {};
                obj.StartTime = Arr[0].StartTime;
                obj.EndTime = Arr[0].StartTime;

                for (let index = 0; index < Arr.length; index++) {

                    if (new Date(Arr[index].EndTime).getTime() >= new Date(obj.EndTime).getTime()) {
                        obj.EndTime = Arr[index].EndTime;
                    }
                    if (new Date(Arr[index].StartTime).getTime() <= new Date(obj.StartTime).getTime()) {
                        obj.StartTime = Arr[index].StartTime;
                    }

                }

                obj.StartTime = $com.util.format("yyyy-MM-dd", obj.StartTime);
                obj.EndTime = $com.util.format("yyyy-MM-dd", obj.EndTime);

                return obj;
            },

            //渲染表格
            RanderPlanTable: function (data) {

                if (data.length > 0) {
                    var HeatStr = "<tr>" + HTML.TimeTableHead,
                        BodyStr = "<tr>" + HTML.TimeTableBody;
                    for (const key in data[0]) {

                        //头部
                        if (key.startsWith("DT_")) {

                            var _date = key.substr(8);
                            _date = _date.replace(/_/g, "-");

                            var titleDate = key.substr(3);
                            titleDate = titleDate.replace(/_/g, "-");

                            HeatStr += "<th  data-title=" + _date + " data-value=" + "{{" + _date + "}}>" + _date + "</th>";
                            BodyStr += "<td style=\"width:50px\" data-title=" + titleDate + " data-value=" + "{{UniqueID}}>" + "<input style=\"border:none\"  disabled=\"disabled\" type=\"number\"   class=\"lmvt-input\" value=\"{{" + key + "}}\">" + "</td>";
                        }
                    }

                    HeatStr += "</tr>";
                    BodyStr += "</tr>";

                    $("#lmvt-tableHead").html(HeatStr);
                    $("#lmvt-tablebody").html($com.util.template(data, BodyStr));
                    $com.table.formatterRowspan($("#lmvt-tablebody"), 0, 2);
                    if (ISMove == "true") {
                        $("input").attr("disabled", "disabled");
                        $("#zace-export-saved").attr("disabled", "true");
                    }

                }
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
            //工区工位
            getWorkAreaAll: function (data, fn, context) {
                var d = {
                    $URI: "/LFS/WorkAreaAll",
                    $TYPE: "Get",
                    $SERVER: "/MESLFS"
                };

                function err() {
                    $com.app.tip('获取库位列表失败，请检查网络!');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },



            refreshGanteZace: function (zOrderID, data) {

                var _obj = $com.util.Clone(data);

                for (var i = 0; i < data.list.length; i++) {

                    $com.util.deleteLowerProperty(data.list[i]);

                }


                model.com.postTreeList({
                    MessageList: mMesList,

                    TaskPartList: data.list,

                }, function (res) {


                    mApsList.TreeList = $com.util.Clone(res.list);
                    _obj.TreeList = $com.util.Clone(res.list);


                    //渲染甘特数据
                    var AllGantte = $com.util.Clone(res.list);
                    //需要回显数据
                    var BackRander = [];
                    $.each(AllGantte, function (j, jtem) {
                        $.each(jtem.TaskPartList, function (k, ktem) {
                            for (var m = 0; m < ktem.TaskPartList.length; m++) {

                                if (new Date(ktem.TaskPartList[m].StartTime).getTime() >= new Date(mEndTime).getTime()) {
                                    BackRander.push(ktem.TaskPartList[m]);
                                    ktem.TaskPartList.splice(m, 1);
                                    m--;
                                }
                            }
                        });
                    });

                    if (zOrderID == 0) {
                        var position = {

                            //天数间隔
                            spacePx: 100.0,
                            //左边菜单栏像素
                            freedomPx: 250,
                            //
                            contextHight: 400,
                            radius: 4,
                            tip: {
                                //提示条宽度，高度，行高
                                Text: { tipW: 170, tipH: 70, lineH: 20, titleH: 20 },
                                title: { text: '车号', prop: 'PartNo', visible: false },
                                line: [
                                    { text: '开始时间', prop: 'StartTime', visible: true },
                                    { text: '时长', prop: 'time', visible: false },

                                    { text: '备注', prop: 'TaskText', visible: true },
                                    { text: '冲突消息', prop: 'APSMessage', visible: false },//TaskText
                                ]
                            },

                            effect: {
                                Time: mDateEffect,   //日期
                                Part: mPartEffect,   //工位
                                Station: mCloseStationList,
                            },

                            series: {
                                data: [
                                    mStartTime,
                                    mEndTime,
                                ]
                            },

                            fn: function (source) {

                                for (var i = 0; i < source.length; i++) {
                                    $.each(source[i].TaskPartList, function (j, jtem) {
                                        $.each(jtem.TaskPartList, function (m, mtem) {
                                            $.each(mApsList.list, function (k, ktem) {
                                                //
                                                if (mtem.PartNo == ktem.PartNo && mtem.LineID == ktem.LineID && mtem.PartID == ktem.PartID) {
                                                    ktem.StartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', mtem.startDate.getTime());
                                                    ktem.EndTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(mtem.startDate).getTime() + mtem.time * (24 * 3600000));
                                                }
                                            });


                                        });
                                    });


                                };
                                position.Task.dataList = mApsList.list;
                                // $.each(position.Task.dataList,function(i,item){
                                //     item.StartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(item.StartTime).getTime() + 8 * 3600000);
                                //});
                                // mApsList = $com.util.Clone(_list);                          

                            },

                            Task: {
                                data: AllGantte,
                                dataList: _obj.list,
                                routeList: zaceRouteList
                            },

                            yAxis: {

                                data: ['任务一', '任务二', '任务三', '任务四', '任务五', '任务六', '任务七', '任务8', '任务9']

                            },
                        }

                        var counts = 0

                        $.each(position.Task.data, function (j, jtem) {
                            $.each(jtem.TaskPartList, function (k, ktem) {

                                if (!ktem.TaskPartList[0]) {
                                    ktem.TaskPartList.push(Temp);
                                }

                                $.each(ktem.TaskPartList, function (m, mtem) {
                                    // <th style="min-width: 50px" data-order="PlanReceiveDate">计划进厂</th>
                                    // <th style="min-width: 50px" data-order="RealReceiveDate">实际进厂</th>
                                    // <th style="min-width: 50px" data-order="PlanFinishDate">预计完工</th>
                                    counts++;
                                    //天数
                                    mtem.time = model.com.GetDays(mtem.StartTime, mtem.EndTime);

                                    if (new Date(mtem.StartTime).getHours() == 12) {
                                        mtem.StartTime = $com.util.format("yyyy-MM-dd hh:mm:ss", new Date(mtem.StartTime).getTime() + 8 * 3600000);
                                    }
                                    mtem.EndTime = $com.util.format("yyyy-MM-dd hh:mm:ss", mtem.EndTime);
                                    mtem.startDate = mtem.StartTime;
                                    mtem.color = "#3E90C6"


                                    //模板  无订单
                                    if (mtem.PartNo.length < 1) {
                                        mtem.startDate = $com.util.format("yyyy-MM-dd", '1970-1-1');
                                    }

                                });
                            });
                        });

                        position.contextHight = counts * 25 + 54;



                        $(function () {

                            $ganttWeek.install($('.lmvt-gantt'), $(".lmvt-container-gantt"), position);

                            $ganttWeek.resfushCanvas(position.Task.data);

                        });

                        $(".lmvt-gantt").ready(function () {
                            var ScrollDiv = $(".lmvt-container-gantt");
                            $(".canvasLeft1").css("top", ScrollDiv.offset().top);
                            $(".canvasLeft1").css("left", ScrollDiv.offset().left);
                            $(".canvasLeft1").css("width", position.freedomPx);
                            $(".canvasLeft1").css("height", ScrollDiv.height());

                            $(".canvasTop1").css("top", ScrollDiv.offset().top);
                            $(".canvasTop1").css("left", ScrollDiv.offset().left);
                            $(".canvasTop1").css("width", ScrollDiv.width());
                            $(".canvasTop1").css("height", 52);





                        });
                    } else {
                        //树形结构
                        for (var i = 0; i < _obj.TreeList.length; i++) {

                            //修程长度
                            for (var n = 0; n < DataLinelist.length; n++) {

                                _obj.TreeList[i].TaskPartList[n].TaskPartList = [];


                                //修程下面数据
                                for (var j = 0; j < data.TreeList[i].TaskPartList[n].TaskPartList.length; j++) {

                                    if (data.TreeList[i].TaskPartList[n].TaskPartList[j].OrderID == zOrderID) {
                                        _obj.TreeList[i].TaskPartList[n].TaskPartList.push(data.TreeList[i].TaskPartList[n].TaskPartList[j]);
                                    }



                                }
                                if (_obj.TreeList[i].TaskPartList[n].TaskPartList.length == 0) {
                                    _obj.TreeList[i].TaskPartList[n].TaskPartList.push(Temp);

                                }


                            }





                        }



                        var position = {

                            //天数间隔
                            spacePx: 100.0,
                            //左边菜单栏像素
                            freedomPx: 250,
                            //
                            contextHight: 400,
                            radius: 4,
                            tip: {
                                //提示条宽度，高度，行高
                                Text: { tipW: 170, tipH: 70, lineH: 20, titleH: 20 },
                                title: { text: '车号', prop: 'PartNo', visible: false },
                                line: [
                                    { text: '开始时间', prop: 'StartTime', visible: true },
                                    { text: '时长', prop: 'time', visible: false },

                                    { text: '备注', prop: 'TaskText', visible: true },
                                    { text: '冲突消息', prop: 'APSMessage', visible: false },//TaskText
                                ]
                            },

                            effect: {
                                Time: mDateEffect,   //日期
                                Part: mPartEffect,   //工位
                                Station: mCloseStationList,
                            },

                            series: {
                                data: [
                                    mStartTime,
                                    mEndTime,
                                ]
                            },

                            fn: function (source) {

                                for (var i = 0; i < source.length; i++) {
                                    $.each(source[i].TaskPartList, function (j, jtem) {
                                        $.each(jtem.TaskPartList, function (m, mtem) {
                                            $.each(mApsList.list, function (k, ktem) {
                                                //
                                                if (mtem.PartNo == ktem.PartNo && mtem.LineID == ktem.LineID && mtem.PartID == ktem.PartID) {
                                                    ktem.StartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', mtem.startDate.getTime());
                                                    ktem.EndTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(mtem.startDate).getTime() + mtem.time * (24 * 3600000));
                                                }
                                            });


                                        });
                                    });


                                };
                                position.Task.dataList = mApsList.list;
                                // $.each(position.Task.dataList,function(i,item){
                                //     item.StartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(item.StartTime).getTime() + 8 * 3600000);
                                //});
                                //mApsList = $com.util.Clone(_list);                          

                            },

                            Task: {
                                data: _obj.TreeList,
                                dataList: _obj.list,
                                routeList: zaceRouteList
                            },

                            yAxis: {

                                data: ['任务一', '任务二', '任务三', '任务四', '任务五', '任务六', '任务七', '任务8', '任务9']

                            },
                        }

                        var counts = 0

                        $.each(position.Task.data, function (j, jtem) {
                            $.each(jtem.TaskPartList, function (k, ktem) {

                                if (!ktem.TaskPartList[0]) {
                                    ktem.TaskPartList.push(Temp);
                                }

                                $.each(ktem.TaskPartList, function (m, mtem) {
                                    // <th style="min-width: 50px" data-order="PlanReceiveDate">计划进厂</th>
                                    // <th style="min-width: 50px" data-order="RealReceiveDate">实际进厂</th>
                                    // <th style="min-width: 50px" data-order="PlanFinishDate">预计完工</th>
                                    counts++;
                                    //天数
                                    mtem.time = model.com.GetDays(mtem.StartTime, mtem.EndTime);

                                    if (new Date(mtem.StartTime).getHours() == 12) {
                                        mtem.StartTime = $com.util.format("yyyy-MM-dd hh:mm:ss", new Date(mtem.StartTime).getTime() + 8 * 3600000);
                                    }
                                    mtem.EndTime = $com.util.format("yyyy-MM-dd hh:mm:ss", mtem.EndTime);
                                    mtem.startDate = mtem.StartTime;
                                    mtem.color = "#3E90C6"


                                    //模板  无订单
                                    if (mtem.PartNo.length < 1) {
                                        mtem.startDate = $com.util.format("yyyy-MM-dd", '1970-1-1');
                                    }

                                });
                            });
                        });

                        position.contextHight = counts * 25 + 54;



                        $(function () {

                            $ganttWeek.install($('.lmvt-gantt'), $(".lmvt-container-gantt"), position);

                            $ganttWeek.resfushCanvas(position.Task.data);

                        });

                        $(".lmvt-gantt").ready(function () {
                            var ScrollDiv = $(".lmvt-container-gantt");
                            $(".canvasLeft1").css("top", ScrollDiv.offset().top);
                            $(".canvasLeft1").css("left", ScrollDiv.offset().left);
                            $(".canvasLeft1").css("width", position.freedomPx);
                            $(".canvasLeft1").css("height", ScrollDiv.height());

                            $(".canvasTop1").css("top", ScrollDiv.offset().top);
                            $(".canvasTop1").css("left", ScrollDiv.offset().left);
                            $(".canvasTop1").css("width", ScrollDiv.width());
                            $(".canvasTop1").css("height", 52);





                        });




                    }

                });

            },
            //获取树形结构
            postTreeList: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskPart/TreeList",
                    $TYPE: "post",
                    $SERVER: '/MESAPS'

                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            refreshPriority: function (data, index1, index2) {

                data = model.com.swapArr(data, index1, index2);

                for (var index = 0; index < data.length; index++) {
                    data[index].WID = index + 1;

                }

                var _list = $com.util.Clone(data);

                $.each(_list, function (i, item) {
                    for (var p in item) {
                        if (!FORMATTRT_LevelItem[p])
                            continue;
                        item[p] = FORMATTRT_LevelItem[p](item[p]);
                    }
                });
                $("#femi-orderPriority-tbody").html($com.util.template(_list, HTML.TableOrderModePriority));
                $("#femi-orderPriority-tbody tr").each(function (i, item) {
                    var $this = $(this);
                    var colorName = $this.css("background-color");
                    $this.attr("data-color", colorName);

                });

            },

            //查询订单列表
            getOMSOrder: function (data, fn, context) {
                var d = {
                    $URI: "/OMSOrder/All",
                    $TYPE: "get",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //
            postOMSManualScheduling: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskPart/ManualScheduling",
                    $TYPE: "post",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //保存排程结果
            postOMSOrderSaved: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskPart/SaveTaskList",
                    $TYPE: "post",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //优先级列表
            postOMSOrderPriority: function (data, fn, context) {
                var d = {
                    $URI: "/OMSOrder/OrderPriority",
                    $TYPE: "post",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            getShiftDetailTable: function (Data, DTStart, DTEnd) {
                var wResult = [],
                    wHead = { ID: "编号", UniqueID: "序号", OrderNo: "制造令编号", PartName: "工序名称" },
                    templateData = {
                        ID: 0,
                        UniqueID: 0,
                        OrderNo: 0,
                        PartName: 0,
                    };
                if (!DTStart || !DTEnd) {
                    return wResult;
                }

                DTStart = $com.util.format("yyyy/MM/dd", DTStart);
                DTEnd = $com.util.format("yyyy/MM/dd", DTEnd);
                DTStart = $com.util.toDate(DTStart);
                DTEnd = $com.util.toDate(DTEnd);
                if (DTStart > DTEnd) {
                    return wResult;
                }
                var DT_H = [];

                while (DTStart <= DTEnd) {
                    DT_H.push(DTStart);
                    wHead[$com.util.format("DT_yyyy_MM_dd", DTStart)] = $com.util.format("yyyy-MM-dd", DTStart);
                    DTStart = new Date(DTStart.getTime() + (60 * 60 * 24 * 1000));
                }

                for (var index = 0; index < Data.length; index++) {
                    var wTaskPart = Data[index];
                    var _templateData = {
                        ID: wTaskPart.ID,
                        UniqueID: wTaskPart.UniqueID,
                        OrderNo: wTaskPart.OrderNo,
                        OrderID: wTaskPart.OrderID,
                        PartName: wTaskPart.PartName,
                        APSNext: wTaskPart.APSNext,
                        CalcFQTY: wTaskPart.CalcFQTY,
                        StartTime: wTaskPart.StartTime,
                        EndTime: wTaskPart.EndTime,
                        RouteID: wTaskPart.RouteID,
                        PartID: wTaskPart.PartID
                    }
                    $.each(DT_H, function (i, _date) {
                        _templateData[$com.util.format("DT_yyyy_MM_dd", _date)] = 0;
                    });

                    for (var j = 0; j < wTaskPart.ShiftDetail.length; j++) {
                        var wShift = wTaskPart.ShiftDetail[j];
                        _templateData[$com.util.format("DT_yyyy_MM_dd", wShift.WorkDate)] = wShift.PlanNum;
                    }
                    wResult.push(_templateData);
                }
                return wResult;
            },

            //Data 原始数据   
            ChangeShiftDetail: function (Data, StartTime, EndTime, UniqueID, ChangeDate, fqty, model_type) {
                var wResult = model.com.getShiftDetailTable(Data, StartTime, EndTime);
                var wOrderID = 0;
                var _CZFQTY = 0;

                DTStart = $com.util.format("yyyy/MM/dd", StartTime);
                DTEnd = $com.util.format("yyyy/MM/dd", EndTime);
                DTStart = $com.util.toDate(DTStart);
                DTEnd = $com.util.toDate(DTEnd);

                $.each(wResult, function (i, item) {
                    if (item.UniqueID != UniqueID) {
                        return true;
                    }
                    //修改自身
                    if (item[$com.util.format("DT_yyyy_MM_dd", ChangeDate)] == undefined)
                        item[$com.util.format("DT_yyyy_MM_dd", ChangeDate)] = 0;

                    //多了多少
                    _CZFQTY = fqty - item[$com.util.format("DT_yyyy_MM_dd", ChangeDate)];
                    var _List = model.com.getNextPartUniqueIDList(item.OrderID, item.PartID, Data, item.RouteID);

                    var _ChangeDate = ChangeDate;
                    if (item.APSNext == 1) {
                        _ChangeDate = new Date(_ChangeDate.getTime() + (60 * 60 * 24 * 1000));
                    }
                    $.each(_List, function (j, j_item) {
                        model.com.ChangeShiftDetailItem(wResult, DTEnd, _ChangeDate, _CZFQTY, j_item, Data);
                    });

                    switch (model_type) {
                        case 1:
                            //1 顺延
                            var _YXDate = new Date(ChangeDate);
                            if (_YXDate.getTime() < DTEnd.getTime()) {
                                _YXDate = new Date(_YXDate.getTime() + (60 * 60 * 24 * 1000));
                            }
                            model.com.ChangeShiftDetailItem(wResult, DTEnd, _YXDate, -_CZFQTY, UniqueID, Data);
                            if (new Date(_YXDate).getTime() >= new Date($com.util.format("yyyy/MM/dd", item.EndTime)).getTime()) {
                                item.EndTime = _YXDate;
                            }
                            break;
                        case 2:
                            //2 推迟时间
                            var _YXDate = new Date(new Date($com.util.format("yyyy/MM/dd", item.EndTime)).getTime() + (60 * 60 * 24 * 1000));;

                            if (_YXDate > DTEnd) {
                                _YXDate = DTEnd;
                            }
                            model.com.ChangeShiftDetailItem(wResult, DTEnd, _YXDate, -_CZFQTY, UniqueID, Data);
                            if (_YXDate >= new Date($com.util.format("yyyy/MM/dd", item.EndTime)).getTime()) {
                                item.EndTime = _YXDate;
                            }
                            break;
                        default:
                            break;
                    }

                    item[$com.util.format("DT_yyyy_MM_dd", ChangeDate)] = item[$com.util.format("DT_yyyy_MM_dd", ChangeDate)] + _CZFQTY;

                    return false;

                });


                $.each(wResult, function (j, j_item) {
                    //根据表格数据重新计算开始时间

                    $.each(Data, function (i, item) {
                        if (item.UniqueID == j_item.UniqueID) {
                            //头   用来判断原始数据中开始时间变动
                            //尾   用来判断原始数据中结束时间变动
                            model.com.changeSoruceDetail(item.ShiftDetail, j_item);

                            item.StartTime = j_item.StartTime;
                            item.EndTime = j_item.EndTime;
                            return false;
                        }
                    });
                });
                return wResult;
            },

            changeSoruceDetail: function (data_s, data_t) {

                for (var key in data_t) {
                    if (!key.startsWith("DT_")) {
                        continue;
                    }
                    var _date = key.substr(3);
                    _date = _date.replace(/_/g, "/");

                    var _IsOwn = false;
                    $.each(data_s, function (i, item) {
                        if ($com.util.format("yyyy/MM/dd", item.WorkDate) == _date) {
                            _IsOwn = true;
                            item.PlanNum = data_t[key];
                        }
                    });
                    if (_IsOwn || data_s.length <= 0)
                        continue;

                    var item = $com.util.Clone(data_s[0]);
                    item.ID = 0;
                    item.WorkDate = _date;
                    item.PlanNum = data_t[key];
                    data_s.push(item);
                }

            },

            getNextPartUniqueIDList: function (OrderID, PartID, Source, RouteID) {
                var wResult = [],
                    _route = {};

                $.each(zaceRouteList, function (i, item) {
                    if (item.ID != RouteID)
                        return true;
                    _route = item;
                });

                $.each(_route.PartList, function (i, item) {
                    if (item.PrevPartID == PartID && item.ID > 0 && item.PartID != PartID) {
                        if (wResult.indexOf(item.PartID) < 0)
                            wResult.push(item.PartID);
                        return true;
                    }
                    if (item.PartID == PartID && item.ID > 0 && item.NextPartIDMap) {
                        for (var wPartIDTemp in item.NextPartIDMap) {
                            if (wResult.indexOf(parseInt(wPartIDTemp)) < 0)
                                wResult.push(parseInt(wPartIDTemp));
                        }
                        return true;
                    }
                });
                if (Source && Source.length > 0) {
                    var _Temp = wResult;
                    wResult = [];
                    $.each(Source, function (i, item) {
                        if (item.OrderID != OrderID || _Temp.indexOf(item.PartID) < 0)
                            return true;

                        if (wResult.indexOf(item.UniqueID) < 0)
                            wResult.push(item.UniqueID);

                    });
                }
                return wResult;
            },
            ChangeShiftDetailItem: function (Data, DTEnd, ChangeDate, CZFQTY, UniqueID, Source) {
                //迭代改影响工序  值为0且不是尾天的得跳日期哦 
                // 超出排程结束日期不顺延 直接加在最后一天

                //获取下一道工序
                if (CZFQTY == 0)
                    return;
                $.each(Data, function (i, item) {
                    if (item.UniqueID != UniqueID) {
                        return true;
                    }
                    //修改自身
                    if (item[$com.util.format("DT_yyyy_MM_dd", ChangeDate)] == undefined)
                        item[$com.util.format("DT_yyyy_MM_dd", ChangeDate)] = 0;
                    _CZFQTY = CZFQTY;


                    if (item[$com.util.format("DT_yyyy_MM_dd", ChangeDate)] + _CZFQTY < 0) {
                        var _StartT = ChangeDate;
                        while (_CZFQTY < 0) {
                            var _CZFQTY_1 = item[$com.util.format("DT_yyyy_MM_dd", _StartT)] + _CZFQTY;
                            if (_CZFQTY_1 < 0) {
                                _CZFQTY_1 = -item[$com.util.format("DT_yyyy_MM_dd", _StartT)];
                            } else {
                                _CZFQTY_1 = _CZFQTY;
                            }
                            model.com.ChangeShiftDetailItem(Data, DTEnd, _ChangeDate, _CZFQTY_1, UniqueID, Source);
                            _StartT = new Date(_StartT.getTime() + (60 * 60 * 24 * 1000));
                            _CZFQTY -= _CZFQTY_1;
                        }
                    }
                    else {
                        var _List = model.com.getNextPartUniqueIDList(item.OrderID, item.PartID, Source, item.RouteID);

                        var _ChangeDate = ChangeDate;
                        if (item.APSNext == 1) {
                            _ChangeDate = new Date(_ChangeDate.getTime() + (60 * 60 * 24 * 1000));
                        }
                        $.each(_List, function (j, j_item) {
                            model.com.ChangeShiftDetailItem(Data, DTEnd, _ChangeDate, _CZFQTY, j_item, Source);
                        });

                        item[$com.util.format("DT_yyyy_MM_dd", ChangeDate)] = item[$com.util.format("DT_yyyy_MM_dd", ChangeDate)] + _CZFQTY;

                    }
                    return false;

                })


            },
            //查询订单列表
            getOMSOrderList: function (data, fn, context) {
                var d = {
                    $URI: "/OMSOrder/OrderList",
                    $TYPE: "get",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            swapArr: function (arr, index1, index2) {
                /*数组两个元素位置互换*/
                arr[index1] = arr.splice(index2, 1, arr[index1])[0];
                return arr;
            },
            setMMM: function () {
                setTimeout(function () {
                    if (window.parent._zaceLineSet && window.parent._zaceLineSet == 1) {
                        model.com.getFMCLine({ FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0 }, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {
                                TypeSource_condition.LineID = [];
                                $.each(resW.list, function (i, item) {
                                    TypeSource_condition.LineID.push({
                                        name: item.Name,
                                        value: item.ID,
                                    });
                                });
                            }
                            window.parent._zaceLineSet = 0;
                        });

                    }

                    if (window.parent._zaceFactoryShift && window.parent._zaceFactoryShift == 1) {
                        model.com.getFMCWorkDay({}, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {
                                TypeSource_condition.WorkDayID = [];
                                $.each(resW.list, function (i, item) {
                                    TypeSource_condition.WorkDayID.push({
                                        name: item.Name,
                                        value: item.ID,

                                    });
                                });
                            }
                            window.parent._zaceFactoryShift = 0;
                        });

                    }
                    if (window.parent._zacePartSet && window.parent._zacePartSet == 1) {
                        model.com.getFPCPartAll({ FactoryID: -1, BusinessUnitID: -1, ProductTypeID: -1, OAGetType: -1 }, function (resW) {
                            if (resW && resW.list) {
                                AllPart = resW.list;
                            }
                            window.parent._zacePartSet = 0;
                        });

                    }
                    model.com.setMMM();
                }, 500);

            },
            refreshCondition: function () {
                mConditionList = [];
                for (var index = 0; index < mCondition.length; index++) {

                    if (mCondition[index] == 0) {
                        mCondition.splice(0, 1);
                    }



                }
                var _list = [];
                for (var index = 0; index < mCondition.length; index++) {
                    _list.push(Number(mCondition[index]));

                }
                mCondition = _list;
                for (var index = 0; index < mCondition.length; index++) {
                    for (var i = 0; i < Condition.length; i++) {
                        if (mCondition[index] > 0 && mCondition[index] == Condition[i].ID) {
                            mConditionList.push(Condition[i]);
                        }

                    }

                }

                for (var index = 0; index < mConditionList.length; index++) {
                    mConditionList[index].Priority = index + 1;
                }
                $("#femi-orderMakeAll-condition").html($com.util.template(mConditionList, HTML.TablePriority));
                $("#femi-orderMakeAll-condition tr").each(function (i, item) {
                    var $this = $(this);
                    var colorName = $this.css("background-color");
                    $this.attr("data-color", colorName);



                });
            },
            refresh: function () {

                $com.app.loading('数据加载中！！');
                // model.com.getSchedulePlan({ workShopID: 1, lineID: MlineID, time: MShiftTime, status: 3 }, function (resP) {
                model.com.getOMSOrderList({ StartTime: mStartTimeNew, EndTime: mEndTimeNew, APSShiftPeriod: 6, WorkShopID: wWorkShopID }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var _list = $com.util.Clone(resP.list);
                        DataOrderList = $com.util.Clone(resP.list);
                        $.each(_list, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_LevelItem[p])
                                    continue;
                                item[p] = FORMATTRT_LevelItem[p](item[p]);
                            }
                        });
                        $("#femi-orderMakeAll-tbody").html($com.util.template(_list, HTML.TableOrderMode));
                        $("#femi-orderMakeAll-tbody tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });
                    }

                    $com.app.loaded();


                });

                //得到班次
                model.com.getCreateShifID({ ShiftLevel: 5, Time: MShiftTime }, function (resP) {

                    if (!resP)
                        return;
                    if (resP && resP.info) {

                        MShiftID = resP.info;
                    }




                });



            },
            refreshC: function () {
                //排程条件
                model.com.getConditionInfo({ UnitID: 0, UnitLevel: 1, ShiftPeriod: 5, ShiftTime: MShiftTime, ShiftLevelID: 0, ShiftDays: MShiftsDays, WorkDayID: MWorkDayID }, function (res) {
                    if (!res)
                        return;
                    if (res && res.info) {
                        res.info.LineID = MlineID;
                        res.info.ShiftTime = MShiftTime;
                        res.info.WorkDayID = MWorkDayID;
                        res.info.ShiftDays = MShiftsDays;
                        if (res.info.MaxLoadRate != mMaxLoadRate) {
                            res.info.MaxLoadRate = mMaxLoadRate;
                        }
                        res.info.MaxLoadRate = parseFloat(res.info.MaxLoadRate);
                        res.info.MaxLoadRate = res.info.MaxLoadRate.toFixed(1);
                        res.info.condition = [0];
                        var _listinfo = $com.util.Clone(res.info);
                        DataCondition = $com.util.Clone(res.info);
                        conditionChange = $com.util.Clone(res.info);
                        $com.propertyGrid.show($(".zace-pripoty"), _listinfo, KEYWORD_condition, TypeSource_condition);

                        ganttDate = model.com.GetGanttDay(MShiftTime, MShiftsDays);


                        //var _list = [];
                        //_list.push(_listinfo);
                        //$.each(_list, function (i, item) {
                        //    for (var p in item) {
                        //        if (!FORMATTRT_condition[p])
                        //            continue;
                        //        item[p] = FORMATTRT_condition[p](item[p]);
                        //    }
                        //});

                        // $("#femi-orderPlanResult-tbody").html($com.util.template(_list, HTML.TableConditionMode));

                    }
                });
            },
            getListByOrderID: function (_list) {

                var _listOrder = [];
                for (var j = 0; j < _list.length; j++) {

                    for (var i = 0; i < _list.length; i++) {
                        if ((j + 1) == _list[i].OrderID) {
                            _listOrder.push(_list[i]);

                        }
                    }

                }
                return _listOrder;

            },
            //Day 班次
            getFMCWorkDay: function (data, fn, context) {
                var d = {
                    $URI: "/FMCWorkDay/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //订单自动排程
            postAutoScheduling: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskPart/AutoScheduling",
                    $TYPE: "post",
                    $SERVER: '/MESAPS'
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //甘特计算
            getGenerateGant: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskLine/GenerateGant",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //APSTask  LineAll
            getAPSTaskLineAll: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskLine/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //SCHShift
            getCreateShifID: function (data, fn, context) {
                var d = {
                    $URI: "/SCHShift/CreateShiftID",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取ConditionInfo列表
            getConditionInfo: function (data, fn, context) {
                var d = {
                    $URI: "/APSOrder/ConditionInfo",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取APS订单计划
            getSchedulePlan: function (data, fn, context) {
                var d = {
                    $URI: "/APSOrder/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //自动生成APS订单计划
            postSchedulePlan: function (data, fn, context) {
                var d = {
                    $URI: "/APSOrder/ModelAll",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //保存APS订单计划
            saveSchedulePlan: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskLine/SaveGant",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },



            //获取bom列表
            getBomList: function (data, fn, context) {
                var d = {
                    $URI: "/Bom/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询产品规格
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

            //获取物料号列表
            getMaterialList: function (data, fn, context) {
                var d = {
                    $URI: "/Material/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询顾客联系人列表
            getLinkManCustomer: function (data, fn, context) {
                var d = {
                    $URI: "/LinkManCustomer/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询顾客信息
            getCustomer: function (data, fn, context) {
                var d = {
                    $URI: "/Customer/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //查询
            getFMCUserId: function (data, fn, context) {
                var d = {
                    $URI: "/Role/UserAllByFunctionID",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询产线
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
            //查询工厂
            getFMCFactory: function (data, fn, context) {
                var d = {
                    $URI: "/FMCFactory/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询事业部
            getBusinessUnit: function (data, fn, context) {
                var d = {
                    $URI: "/BusinessUnit/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询制造令
            getCommandAll: function (data, fn, context) {
                var d = {
                    $URI: "/MESOrder/CommandAll",
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

            //查询MES订单
            getMESOrderAll: function (data, fn, context) {
                var d = {
                    $URI: "/MESOrder/OrderAllByCommandID",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //添加生产制造令
            postCommandAdd: function (data, fn, context) {
                var d = {
                    $URI: "/MESOrder/CommandAdd",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //保存生产制造令
            postCommandSave: function (data, fn, context) {
                var d = {
                    $URI: "/MESOrder/CommandSave",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //保存MES订单
            postMESOrderSave: function (data, fn, context) {
                var d = {
                    $URI: "/MESOrder/MESOrderSave",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //审核命令票
            postAudit: function (data, fn, context) {
                var d = {
                    $URI: "/MESOrder/CommandAudit",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //反审核
            postReverseAudit: function (data, fn, context) {
                var d = {
                    $URI: "/MESOrder/CommandReverseAudit",
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
            //工段
            getFPCPartAll: function (data, fn, context) {
                var d = {
                    $URI: "/FPCPart/All",
                    $TYPE: "get"
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
            addDays: function (date, days) {
                if (days == undefined || days == '') {
                    days = 1;
                }
                var date = new Date(date);
                date.setDate(date.getDate() + days);
                var month = date.getMonth() + 1;
                var day = date.getDate();
                var mm = "'" + month + "'";
                var dd = "'" + day + "'";

                //单位数前面加0
                if (mm.length == 3) {
                    month = "0" + month;
                }
                if (dd.length == 3) {
                    day = "0" + day;
                }

                var time = date.getFullYear() + "-" + month + "-" + day;
                return time;
            },

            //得到最小与最大日期
            GetDate: function (source) {
                var arr = [],
                    maxDate = new Date(source[0].EndTime) / 1000 / 60 / 60 / 24,
                    minDate = new Date(source[0].StartTime) / 1000 / 60 / 60 / 24;
                if (source.length == 1) {
                    arr.push($com.util.format('yyyy-MM-dd', new Date(source[0].StartTime) - 7 * 1000 * 60 * 60 * 24));
                    arr.push($com.util.format('yyyy-MM-dd', new Date(source[0].EndTime) + 7 * 1000 * 60 * 60 * 24));
                }
                else {
                    $.each(source, function (i, item) {
                        if (new Date(item.StartTime) / 1000 / 60 / 60 / 24 <= minDate) {
                            minDate = new Date(item.StartTime) / 1000 / 60 / 60 / 24;
                        }
                        if (new Date(item.EndTime) / 1000 / 60 / 60 / 24 >= maxDate) {
                            maxDate = new Date(item.EndTime) / 1000 / 60 / 60 / 24;
                        }
                    });
                    arr.push($com.util.format('yyyy-MM-dd', new Date(minDate) * 1000 * 60 * 60 * 24));
                    arr.push($com.util.format('yyyy-MM-dd', new Date(maxDate) * 1000 * 60 * 60 * 24));
                }
                return arr;
            },
            //得到工段
            GetPartName: function (wid) {
                var Name;
                $.each(AllPart, function (j, item_j) {
                    if (item_j.ID == wid) {
                        Name = item_j.Name;
                        return false;
                    }
                });
                return Name;
            },
            //MaterialTaskProduct
            getMaterialTask: function (data, fn, context) {
                var d = {
                    $URI: "/MaterialTaskProduct/MaterialInfo",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //根据开始时间以及时长得到甘特图时间
            GetGanttDay: function (startdate, time) {
                var arr = [];
                arr.push($com.util.format('yyyy-MM-dd', startdate));
                arr.push($com.util.format('yyyy-MM-dd', (new Date(startdate).getTime() + time * 24 * 60 * 60 * 1000)));
                return arr;
            },

            getCanvas: function (data) {
                var arr = data;
                var beginX = 10;
                var beginY = 10;
                var w = 50;
                var h = 40;
                var zindexX, zindexY;
                var c = document.getElementById("myCanvas");
                var cxt = c.getContext("2d");
                cxt.font = "16px Georgia";
                // cxt.scale(0.5,0.5);
                var lineX, lineY;

                //得到每列最大字符串  
                var widthList = [50];
                var item = arr[0];
                for (var i = 1; i < item.length; i++) {
                    var _list = [];
                    var first = getIntOrStr(arr[0][i]);
                    if (i < 5) {
                        if (i == 3) {
                            first = "12345678";
                        } else if (i == 4) {
                            first = "1234567890";
                        } else {
                            for (var j = 0; j < arr.length; j++) {

                                if (getIntOrStr(arr[j][i]).length > first.length) {
                                    first = getIntOrStr(arr[j][i]);
                                }
                            }
                        }
                    } else {
                        //固定80
                        first = "1月1日";
                    }
                    //if (i < 5&& i>=3) {

                    //    first = getIntOrStr(4);

                    //    }
                    //}

                    widthList.push(first.length * 20 + 10);
                }
                //右距离20
                c.width = 20;
                for (var i = 0; i < widthList.length; i++) {
                    c.width += widthList[i];
                }
                c.height = arr.length * 40 + 10;
                //cxt.fillStyle = 'green';
                //cxt.textAlign = "center";
                //cxt.font = "16px Arial";
                //cxt.fillText('排程计划详情', c.width / 2, 33);

                //判断整数或字符串
                function getIntOrStr(data) {
                    if (data % 1 === 0) {
                        return data.toString();
                    }
                    else {
                        return data;
                    }
                }

                //画表格
                function createBlock(x, y) {
                    cxt.beginPath();
                    ////画布线条
                    //cxt.strokeStyle = 'blue';
                    //cxt.rect(0, 0, c.width, c.height);
                    //cxt.stroke();

                    //头部涂色
                    cxt.fillStyle = "#CAE1FF";//Grey  Silver
                    cxt.fillRect(0, 0, c.width - 20, 40);

                    for (l = 1; l <= arr.length; l++) {

                        var child = arr[l - 1];
                        for (r = 1; r <= child.length; r++) {
                            w = widthList[r - 1];
                            a = x;
                            for (var i = 1; i <= widthList.length; i++) {
                                if (i < r) {
                                    a += widthList[i - 1];
                                }
                            }
                            //a=x+(r-1)*w;
                            b = y + (l - 1) * h;
                            x_zuobiao = a + w / 2;
                            y_zuobiao = b + h / 2;
                            //lineX = a + w;
                            //lineY = b - h / 2;
                            cxt.rect(a, b, w, h);
                            cxt.fillStyle = 'black';
                            cxt.textAlign = "center";
                            cxt.font = "12px Arial";
                            cxt.fillText(child[r - 1], x_zuobiao, y_zuobiao + 5);
                            cxt.strokeStyle = '#000000';
                            cxt.stroke();
                        };
                        cxt.strokeStyle = '#000000';
                        cxt.stroke();
                    };
                };
                //原点开始
                createBlock(0, 0);
                c.onmousedown = function (ev) {
                    var e = ev || event;
                    var x = e.layerX;
                    var y = e.layerY;
                    var _info = getDataOne(x, y);
                    if (_info.length > 0) {
                        var row = _info[1];
                        var colunm = _info[0];
                        var colunmName = arr[0][colunm - 1];
                        var colunmNum = arr[row - 1][colunm - 1];
                        // alert("列:" + colunm + " " + "行:" + row);
                        alert(colunmName + " " + colunmNum);
                    }

                };

                //X,Y判断哪一个数据
                function getDataOne(x, y) {
                    var x0 = x, y0 = y;
                    //widthList  height 40  arr
                    //固定不动的宽度
                    var changeWidth = 0;
                    for (var i = 0; i < widthList.length; i++) {
                        if (i < 5) {
                            changeWidth += widthList[i];
                        }
                    }
                    if (x0 <= changeWidth || x0 >= (c.width - 20) || y0 <= 40 || y0 >= (c.height - 15)) {
                        return [];
                    }
                    else {
                        //距离初始日期点坐标
                        var x1 = x0 - changeWidth;
                        var y1 = y0 - 40;
                        var NumX = parseInt(x1 / 90) + 6;
                        var NumY = parseInt(y1 / 40) + 2;
                        return [NumX, NumY]

                    }
                };
            },

            //计算天数
            GetDays: function (startDate, endDate) {
                var days;
                days = (new Date(endDate) - new Date(startDate)) / 1000 / 60 / 60 / 24;
                if (days <= 0.5) {
                    days = 1;
                } else if (days > 0.5 && days <= 1) {
                    days = 1 + 1;
                } else {
                    days = Math.ceil(days) + 1;
                }

                return days;
            },


            //动态生成表格
            refreshTablePro: function (data) {
                //工序详情
                var _list = $com.util.Clone(data);
                var _head = $com.util.template({ ths: $com.util.template(_list[0], HTML.th) }, HTML.thead);

                $(".part-plan-div .table thead").html(_head);

                $.each(_list, function (i, item) {
                    if (i > 0) {
                        item.FQTYSum = 0;
                        $.each(item.TaskPartList, function (p, p_item) {
                            item.FQTYSum += p_item.FQTYShift;

                        });
                        item.tds = $com.util.template(item, HTML.td);
                        // if (item.TaskLineID > 0) {
                        //     item.Text = "已排";
                        // } else {
                        //     item.Text = "未排";
                        // }
                    }

                });
                $(".part-plan-div>.table tbody").html($com.util.template(_list.GantPartList, HTML.TableUserItemNode));

                $(".part-plan-div>.table tbody tr").each(function (i, item) {
                    var $this = $(this);
                    var colorName = $this.css("background-color");
                    $this.attr("data-color", colorName);



                });

                $(".zace-orderSchedule").hide();
                $(".zace-orderTaskLine").hide();
                $(".zace-orderTablePartShow").hide();
                $(".zace-orderTableTableShow").show();
            },

            getElementTop: function (el) {

                var actualTop = el.offset().top;

                var current = el.parent()[0];

                while (!current.body) {

                    actualTop += $(current).offset().top;

                    current = $(current).parent();

                }

                return actualTop;
            },
            getHourOrMinorSec: function (num) {
                var WSecond = num;
                var hour = parseInt(WSecond / 3600);
                var hourS = WSecond % 3600;

                var min = parseInt(hourS / 60);

                var sec = hourS % 60;
                if (hour > 0) {
                    return hour + "小时" + min + "分钟" + sec + "秒";
                } else {
                    if (min > 0) {
                        return min + "分钟" + sec + "秒";
                    } else {
                        return sec + "秒";
                    }
                }
            },
            getNewEntry: function (wdata) {
                var _list = wdata;
                var _Newlist = {
                    ColumnList: [],
                    GantPartList: [],
                    ID: 0,
                    TaskLineList: [],

                };
                for (var i = 0; i < _list.GantPartList.length; i++) {
                    if (_list.GantPartList[i].TaskLineID == 0) {
                        _Newlist.GantPartList.push(_list.GantPartList[i]);
                    }
                }
                for (var i = 0; i < _list.TaskLineList.length; i++) {
                    if (_list.TaskLineList[i].ID == 0) {
                        _Newlist.TaskLineList.push(_list.TaskLineList[i]);
                    }
                }
                _Newlist.ColumnList = _list.ColumnList;
                return _Newlist;
            },

            FullTemple: function (data, list, stationList) {
                var C_list = [];
                var _list = [];

                var _data = $com.util.Clone(list);
                for (p in data) {

                    C_list.push({
                        key: p,
                        value: data[p]
                    });


                }
                for (var index = 1; index < _data.length; index++) {

                    $com.util.deleteLowerProperty(_data[index]);
                    _data[index].PartNoText = _data[index].PartNo.split('#')[1];
                    _list.push(_data[index]);


                }


                var ths = $com.util.template(stationList, HTML.th);
                var tds = $com.util.template(stationList, HTML.td);
                HTML.TableUserItemNode_F = HTML.TableUserItemNode + tds + " </tr>";
                HTML.thead_F = HTML.thead + ths + " </tr>";


                $(".part-plan-div>.table thead").html(HTML.thead_F);


                $.each(_list, function (i, item) {
                    for (var p in item) {
                        if (p.indexOf('Station') != -1) {
                            if ($com.util.format('yyyy-MM-dd', item[p]) < $com.util.format('yyyy-MM-dd', '2010-1-1')) {

                                item[p] = "/";
                            } else {
                                item[p] = ($com.util.format('MM-dd', new Date(item[p]).getTime() - 12 * 3600000));// + 12 * 3600000
                            }
                        }
                        if (!FORMATTRT_LevelItem[p])
                            continue;
                        item[p] = FORMATTRT_LevelItem[p](item[p]);
                    }
                });


                $(".part-plan-div>.table tbody").html($com.util.template(_list, HTML.TableUserItemNode_F));




            }
        },

    }),

        model.init();
});
