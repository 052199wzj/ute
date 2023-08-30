require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/ganttUtilPlan', '../static/utils/js/ganttGZWUtil'], function ($zace, $com, $gantt, $ganttWeek) {


    var KEYWORD_condition_LIST,
        KEYWORD_condition,
        FORMATTRT_condition,
        DEFAULT_VALUE_condition,
        TypeSource_condition,
        mStationlist,
        KEYWORD_Level_LISTItem,
        KEYWORD_LevelItem,
        FORMATTRT_LevelItem,
        DEFAULT_VALUE_LevelItem,
        TypeSource_LevelItem,
        MaterialList,
        model,
        DataPlanResult,
        MShiftID,
        MlineID,
        MShiftsDays,
        MWorkDayID,
        MShiftTime,
        DataOrderList,
        SelectionList,
        DataCondition,
        conditionChange,
        mMaxLoadRate,
        TablePartData,
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
        HTML;
    var mCloseStationList = [];

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
    var mLimitMinutes = 30;  //限制时间
    var mRedundantDays = 0;  //天数
    var mOrderID = 0;//根据订单   车号查询
    var mOrderList = [];   //订单优先级列表
    var mDateEffect = 0;   //日期
    var mPartEffect = 0;  //工位
    var mApsList = [];//排程结果
    var mMesList = [];
    var mCondition = [];
    var SelDataOrderList = [];
    var mSelDataOrderList = [];
    var mConditionList = [];
    var mLevel = 0;
    var zaceTime;
    var Condition = [

        {
            ID: 1,
            Name: '进车时间',
            Priority: 0,
            PNo: 'StartDate',
            Level: 0,

        },
        {
            ID: 2,
            Name: '修程',
            Priority: 0,
            PNo: 'LineID',
            Level: 2,

        },
        {
            ID: 3,
            Name: '预计完工时刻',
            Priority: 0,
            PNo: 'EndDate',
            Level: 0,

        }, {
            ID: 4,
            Name: '局段',
            Priority: 0,
            PNo: 'CustomerID',
            Level: 1,
        }, {
            ID: 5,
            Name: '车型',
            Priority: 0,
            PNo: 'ProductID',
            Level: 1,
        }
    ];
    DataCustomerItem = []; //局段  信息  input
    DataLineItem = []     //修程 信息  input

    AllCustomerList = [];  //局段
    MShiftID = 0;
    MlineID = 1;        //修程
    MWorkDayID = 1;     //作息
    MShiftsDays = 5;
    SelectionList = [];
    MShiftTime = $com.util.format('yyyy-MM-dd ', new Date());
    DataCondition = {};
    mZaceTableGante = {};
    DataOrderList = [];
    DataPlanResult = [];
    ganttDate = [];
    TablePartData = [];
    ConditionLine = [];
    ConditionCustomer = [];
    mMutualTaskList = [];
    mStartTime = $com.util.format('yyyy-MM-dd', new Date());

    mStartTimeNew = $com.util.format('yyyy-MM-dd', new Date());
    mEndTimeNew = $com.util.format('yyyy-MM-dd', new Date());

    mEndTime = $com.util.format('yyyy-MM-dd', new Date());
    HTML = {
        TableOrderModeShow: [
            '<tr data-color="">',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td style="display:none" data-title="WID" data-value="{{WID}}" >{{WID}}</td>',

            '<td data-title="OrderNo" data-value="{{OrderNo}}" >{{OrderNo}}</td>',

            '<td data-title="PartNo" data-value="{{PartNo}}" >{{PartNo}}</td>',
            '<td data-title="PlanFinishDate" data-value="{{PlanFinishDate}}" >{{PlanFinishDate}}</td>',

            '</tr>',
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
        TableOrderMode: [
            '<tr data-color="">',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td style="display:none" data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="display:none" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="OrderNo" data-value="{{OrderNo}}" >{{OrderNo}}</td>',
            '<td data-title="BureauSectionID" data-value="{{BureauSectionID}}" >{{BureauSectionID}}</td>',
            '<td data-title="LineID" data-value="{{LineID}}" >{{LineID}}</td>',
            '<td data-title="ProductID" data-value="{{ProductID}}" >{{ProductID}}</td>',
            '<td data-title="PartNo" data-value="{{PartNo}}" >{{PartNo}}</td>',
            // '<td data-title="Priority" data-value="{{Priority}}" >{{Priority}}</td>',
            '<td data-title="PlanReceiveDate" data-value="{{PlanReceiveDate}}" >{{PlanReceiveDate}}</td>',
            '<td data-title="PlanFinishDate" data-value="{{PlanFinishDate}}" >{{PlanFinishDate}}</td>',
            // '<td data-title="FQTYDone" data-value="{{FQTYDone}}" >{{FQTYDone}}</td>',
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
            '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="OrderNo" data-value="{{OrderNo}}" >{{OrderNo}}</td>',
            '<td data-title="BureauSectionID" data-value="{{BureauSectionID}}" >{{BureauSectionID}}</td>',
            '<td data-title="LineID" data-value="{{LineID}}" >{{LineID}}</td>',
            '<td data-title="ProductID"  data-value="{{ProductID}}" >{{ProductID}}</td>',
            '<td data-title="PartNo"  data-value="{{PartNo}}" >{{PartNo}}</td>',
            // '<td style="display:none" data-title="TaskLineID" data-value="{{TaskLineID}}" >{{TaskLineID}}</td>',


        ].join(""),



        thead: [
            '<tr>',
            '<th><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<th data-order="ID"  style="min-width: 50px">序号</td>',
            '<th data-order="OrderNo" style="min-width: 50px" >订单</td>',
            '<th data-order="BureauSectionID" style="min-width: 50px" >局段</td>',
            '<th data-order="LineID" style="min-width: 50px" >修程</td>',
            '<th data-order="ProductID" style="min-width: 50px" >车型</td>',
            '<th data-order="PartNo" style="min-width: 50px" >车号</td>',


        ].join(""),
        th: ['<th data-order="Station_{{ID}}" style="min-width: 50px" >{{Name}}</th>'].join(""),
        td: ['<td  class="edit-td" data-title="Station_{{ID}}" data-value="{{Station_{{ID}}}}" >{{Station_{{ID}}}}</td>',].join(""),

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
            "Priority|优先级",
            "LineID|产线|ArrayOne",
            "BureauSectionID|局段|ArrayOne",
            "PlanReceiveDate|时间|Date",
            "PlanFinishDate|时间|Date",
            "ProductID|车型|ArrayOne",
            "mPartNo|车号|ArrayOne",
            // "StartTime|开始日期|Date",
            // "EndTime|结束日期|Date",
            "WeekNum|周|ArrayOne",
            "mStartTimeNew|开始日期|Date",
            "mEndTimeNew|结束日期|Date",

            "mDateZace|日期|ArrayOne",
            "mPartZace|工位|ArrayOne",
            "StationID|工位|ArrayOne",
        ];
        KEYWORD_LevelItem = {};
        FORMATTRT_LevelItem = {};

        TypeSource_LevelItem = {
            LineID: [],
            StationID: [
                {
                    name: "无",
                    value: 0
                },],
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
            mPartNo: [
                {
                    name: "全部",
                    value: 0
                },],
            ProductID: [],
            BureauSectionID: [],
            WeekNum: [


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
            // function changeDiv(firstIndex, secondIndex) {
            //     var $divs = $('body').find('.zace-input');
            //     var firstDiv = $divs.eq(firstIndex);
            //     var secondDiv = $divs.eq(secondIndex);
            //     var bool = false;
            //     var firstBool=$(firstDiv).find(".content-zace input")[0].checked;
            //     var secondBool=$(secondDiv).find(".content-zace input")[0].checked;

            //     var temp;
            //     temp = firstDiv.html();
            //     firstDiv.html(secondDiv.html());
            //     secondDiv.html(temp);

            //     if(firstBool){
            //         $(secondDiv).find(".content-zace input")[0].checked=true;

            //     }
            //     if(secondBool){
            //         $(firstDiv).find(".content-zace input")[0].checked=true;

            //     }
            // };

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
                    //WeekNum: model.com.getYearWeek((new Date()).getFullYear(), (new Date()).getMonth() + 1, (new Date()).getDate()),

                    mStartTimeNew: $com.util.format('yyyy-MM-dd', new Date(mStartTimeNew)),
                    mEndTimeNew: $com.util.format('yyyy-MM-dd', new Date(mEndTimeNew))
                };

                $("body").append($com.modal.show(default_value, KEYWORD_LevelItem, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    var _num = Number(rst.WeekNum);
                    var _year = (new Date()).getFullYear();
                    var days = (new Date(_year, _num, 0)).getDate();

                    // mStartTime = $com.util.format('yyyy-MM-dd', new Date(getweekGetDate(_year, _num).split("/")[0]));
                    // mEndTime = $com.util.format('yyyy-MM-dd', new Date(getweekGetDate(_year, _num).split("/")[1]));

                    mStartTimeNew = $com.util.format('yyyy-MM-dd', new Date(rst.mStartTimeNew));
                    mEndTimeNew = $com.util.format('yyyy-MM-dd', new Date(rst.mEndTimeNew));


                    model.com.refresh();


                }, TypeSource_LevelItem));






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
                        CheckTaskList: mApsList.list,
                        OrderList: mSelDataOrderList,
                        APSShiftPeriod: 5,
                        StartTime: mStartTime,
                        EndTime: mEndTime,
                        WorkDay: MWorkDayID,
                    }

                }, function (res) {



                    var _list = res;

                    mMesList = $com.util.Clone(res.list);
                    mApsList.list = $com.util.Clone(_list.TaskList);

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
                            title: { text: '车号', prop: 'PartNo', visible: true },
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
                                zaceTime,
                            ]
                        },

                        fn: function (source) {

                            for (var i = 0; i < source.length; i++) {
                                $.each(source[i].TaskPartList, function (j, jtem) {
                                    $.each(jtem.TaskPartList, function (m, mtem) {
                                        $.each(mApsList.list, function (k, ktem) {
                                            //
                                            if (mtem.PartNo == ktem.PartNo && mtem.LineID == ktem.LineID && mtem.PartID == ktem.PartID) {
                                                ktem.StartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', mtem.startDate.getTime() - 8 * 3600000);
                                                ktem.EndTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(mtem.startDate).getTime() + mtem.time * (24 * 3600000) - 8 * 3600000);
                                            }
                                        });




                                    });
                                });


                            };
                            position.Task.dataList = mApsList.list;

                        },

                        Task: {
                            data: res.TreeList,
                            dataList: res.TaskList
                        },

                        yAxis: {

                            data: ['任务一', '任务二', '任务三', '任务四', '任务五', '任务六', '任务七', '任务8', '任务9']

                        },
                    }

                    var counts = 0;

                    $.each(position.Task.data, function (j, jtem) {
                        $.each(jtem.TaskPartList, function (k, ktem) {
                            $.each(ktem.TaskPartList, function (m, mtem) {
                                // <th style="min-width: 50px" data-order="PlanReceiveDate">计划进厂</th>
                                // <th style="min-width: 50px" data-order="RealReceiveDate">实际进厂</th>
                                // <th style="min-width: 50px" data-order="PlanFinishDate">预计完工</th>
                                counts++;
                                //天数
                                mtem.time = model.com.GetDays(mtem.StartTime, mtem.EndTime);

                                mtem.StartTime = $com.util.format("yyyy-MM-dd", mtem.StartTime);
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

                        TaskPartList: mApsList.list,
                        StartTime: mStartTime,
                        EndTime: mEndTime,
                        MsgList: mMesList,
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
                        alert("请选择修程内部优先级！")
                        return false;
                    }
                } else {
                    _listLine = [];

                }
                if (cusBool) {
                    if (_listCustomer.length < 1) {
                        alert("请选择局段内部优先级！")
                        return false;
                    }
                } else {
                    _listCustomer = [];

                }
                if (proBool) {
                    if (_listProduct.length < 1) {
                        alert("请选择车型内部优先级！")
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
                        ShiftPeriod: 5,
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
                    $("#femi-orderPriority-tbody").html($com.util.template(_list, HTML.TableOrderMode));
                    $("#femi-orderPriority-tbody tr").each(function (i, item) {
                        var $this = $(this);
                        var colorName = $this.css("background-color");
                        $this.attr("data-color", colorName);



                    });



                });





            });

            //。。。。。固定工位  
            $("body").delegate("#zace-aotu-confirmSta", "click", function () {

                var default_value = {
                    // DepartmentID: 0,
                    StationID: 0,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_LevelItem, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    mMutualTaskList = [];
                    var WStation = Number(rst.StationID);
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
                    }else{
                        mCloseStationList=[];

                    }


                    $com.app.loading();

                    model.com.postAutoScheduling({
                        data: {
                            OrderList: mOrderList,
                            // OMSOrderPriorityList: mCondition,
                            // LineOrders: _listLine,
                            // CustomerOrders: _listCustomer,
                            APSShiftPeriod: 5,
                            StartTime: mStartTime,
                            EndTime: mEndTime,
                            WorkDay: MWorkDayID,
                            LimitMinutes: mLimitMinutes,
                            MutualTaskList: mMutualTaskList,
                        }

                    }, function (res) {

                        var _list = res;
                        $('.tableZace').hide();
                        $('.orderPriority').hide();
                        $('.zace-orderAll').hide();
                        $('.top-zace').hide();
                        $('.gante').show();

                        mZaceTableGante = $com.util.Clone(res);
                        mStationlist = $com.util.Clone(res.OrderColumn);
                        mTableData = $com.util.Clone(res.TableInfoList);

                        mApsList = $com.util.Clone(_list);

                        if (res.MaxTime > mEndTime) {
                            zaceTime = $com.util.format('yyyy-MM-dd', new Date(res.MaxTime));
                        } else {
                            zaceTime = mEndTime;
                        }


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
                                title: { text: '车号', prop: 'PartNo', visible: true },
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
                                    zaceTime,
                                ]
                            },

                            fn: function (source) {

                                for (var i = 0; i < source.length; i++) {
                                    $.each(source[i].TaskPartList, function (j, jtem) {
                                        $.each(jtem.TaskPartList, function (m, mtem) {
                                            $.each(mApsList.list, function (k, ktem) {
                                                //
                                                if (mtem.PartNo == ktem.PartNo && mtem.LineID == ktem.LineID && mtem.PartID == ktem.PartID) {
                                                    ktem.StartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', mtem.startDate.getTime() - 8 * 3600000);
                                                    ktem.EndTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(mtem.startDate).getTime() + mtem.time * (24 * 3600000) - 8 * 3600000);
                                                }
                                            });




                                        });
                                    });


                                };
                                position.Task.dataList = mApsList.list;
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
                                data: res.TreeList,
                                dataList: res.list
                            },

                            yAxis: {

                                data: ['任务一', '任务二', '任务三', '任务四', '任务五', '任务六', '任务七', '任务8', '任务9']

                            },
                        }

                        var counts = 0

                        $.each(position.Task.data, function (j, jtem) {
                            $.each(jtem.TaskPartList, function (k, ktem) {
                                $.each(ktem.TaskPartList, function (m, mtem) {
                                    // <th style="min-width: 50px" data-order="PlanReceiveDate">计划进厂</th>
                                    // <th style="min-width: 50px" data-order="RealReceiveDate">实际进厂</th>
                                    // <th style="min-width: 50px" data-order="PlanFinishDate">预计完工</th>
                                    counts++;
                                    //天数
                                    mtem.time = model.com.GetDays(mtem.StartTime, mtem.EndTime);

                                    mtem.StartTime = $com.util.format("yyyy-MM-dd", mtem.StartTime);
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
                            title: { text: '车号', prop: 'PartNo', visible: true },
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
                                zaceTime,
                            ]
                        },

                        fn: function (source) {

                            for (var i = 0; i < source.length; i++) {
                                $.each(source[i].TaskPartList, function (j, jtem) {
                                    $.each(jtem.TaskPartList, function (m, mtem) {
                                        $.each(mApsList.list, function (k, ktem) {
                                            //
                                            if (mtem.PartNo == ktem.PartNo && mtem.LineID == ktem.LineID && mtem.PartID == ktem.PartID) {
                                                ktem.StartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', mtem.startDate.getTime() - 8 * 3600000);
                                                ktem.EndTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(mtem.startDate).getTime() + mtem.time * (24 * 3600000) - 8 * 3600000);
                                            }
                                        });




                                    });
                                });


                            };
                            position.Task.dataList = mApsList.list;

                        },

                        Task: {
                            data: mApsList.TreeList,
                            dataList: mApsList.list
                        },

                        yAxis: {

                            data: ['任务一', '任务二', '任务三', '任务四', '任务五', '任务六', '任务七', '任务8', '任务9']

                        },
                    }

                    var counts = 0

                    $.each(position.Task.data, function (j, jtem) {
                        $.each(jtem.TaskPartList, function (k, ktem) {
                            $.each(ktem.TaskPartList, function (m, mtem) {
                                // <th style="min-width: 50px" data-order="PlanReceiveDate">计划进厂</th>
                                // <th style="min-width: 50px" data-order="RealReceiveDate">实际进厂</th>
                                // <th style="min-width: 50px" data-order="PlanFinishDate">预计完工</th>
                                counts++;
                                //天数
                                mtem.time = model.com.GetDays(mtem.StartTime, mtem.EndTime);

                                mtem.StartTime = $com.util.format("yyyy-MM-dd", mtem.StartTime);
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
                            title: { text: '车号', prop: 'PartNo', visible: true },
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
                                zaceTime,
                            ]
                        },

                        fn: function (source) {

                            for (var i = 0; i < source.length; i++) {
                                $.each(source[i].TaskPartList, function (j, jtem) {
                                    $.each(jtem.TaskPartList, function (m, mtem) {
                                        $.each(mApsList.list, function (k, ktem) {
                                            //
                                            if (mtem.PartNo == ktem.PartNo && mtem.LineID == ktem.LineID && mtem.PartID == ktem.PartID) {
                                                ktem.StartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', mtem.startDate.getTime() - 8 * 3600000);
                                                ktem.EndTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(mtem.startDate).getTime() + mtem.time * (24 * 3600000) - 8 * 3600000);
                                            }
                                        });




                                    });
                                });


                            };
                            position.Task.dataList = mApsList.list;

                        },

                        Task: {
                            data: mApsList.TreeList,
                            dataList: mApsList.list
                        },

                        yAxis: {

                            data: ['任务一', '任务二', '任务三', '任务四', '任务五', '任务六', '任务七', '任务8', '任务9']

                        },
                    }

                    var counts = 0

                    $.each(position.Task.data, function (j, jtem) {
                        $.each(jtem.TaskPartList, function (k, ktem) {
                            $.each(ktem.TaskPartList, function (m, mtem) {
                                // <th style="min-width: 50px" data-order="PlanReceiveDate">计划进厂</th>
                                // <th style="min-width: 50px" data-order="RealReceiveDate">实际进厂</th>
                                // <th style="min-width: 50px" data-order="PlanFinishDate">预计完工</th>
                                counts++;
                                //天数
                                mtem.time = model.com.GetDays(mtem.StartTime, mtem.EndTime);

                                mtem.StartTime = $com.util.format("yyyy-MM-dd", mtem.StartTime);
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
            //zace-table-gantt   
            $("body").delegate("#zace-table-gantt", "click", function () {

                $('.tableZace').hide();
                $('.orderPriority').hide();
                $('.zace-orderAll').hide();
                $('.top-zace').hide();
                $('.gante').show();
                $('.ganteTable').hide();
                $(".zace-ganteAllTable").hide();


            });
            $("body").delegate("#zace-table-ganttZace", "click", function () {


                $('.tableZace').hide();
                $('.orderPriority').hide();
                $('.zace-orderAll').hide();
                $('.top-zace').hide();
                $('.gante').hide();
                $('.ganteTable').show();
                $(".zace-ganteAllTable").show();

                model.com.FullTemple(mTableData[0], mTableData, mStationlist);

            });

            //导出
            $("body").delegate("#zace-table-ganttExport", "click", function () {
                var $table = $(".table-day-export"),
                    fileName = "周计划表.xls",
                    Title = "周计划表";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });



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


                if (dayZace < 7 || dayZace > 15) {
                    alert("排程天数至少一周时长且不超过15天！");
                    return false;


                }
                mEndTime = model.com.addDays(mStartTime, dayZace - 1);
                model.com.postAutoScheduling({
                    data: {
                        OrderList: SelectData,
                        // OMSOrderPriorityList: mCondition,
                        // LineOrders: _listLine,
                        // CustomerOrders: _listCustomer,
                        APSShiftPeriod: 5,
                        StartTime: mStartTime,
                        EndTime: mEndTime,
                        WorkDay: MWorkDayID,
                        LimitMinutes: mLimitMinutes,
                        MutualTaskList: mMutualTaskList,
                    }

                }, function (res) {

                    var _list = res;
                    $('.tableZace').hide();
                    $('.orderPriority').hide();
                    $('.zace-orderAll').hide();
                    $('.top-zace').hide();
                    $('.gante').show();

                    mZaceTableGante = $com.util.Clone(res);
                    mTableData = $com.util.Clone(res.TableInfoList);
                    mStationlist = $com.util.Clone(res.OrderColumn);
                    mApsList = $com.util.Clone(_list);
                    //alert("成功");
                    //  model.com.refresh();

                    if (res.MaxTime > mEndTime) {
                        zaceTime = $com.util.format('yyyy-MM-dd', new Date(res.MaxTime));
                    } else {
                        zaceTime = mEndTime;
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
                            title: { text: '车号', prop: 'PartNo', visible: true },
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
                                zaceTime,
                            ]
                        },

                        fn: function (source) {

                            for (var i = 0; i < source.length; i++) {
                                $.each(source[i].TaskPartList, function (j, jtem) {
                                    $.each(jtem.TaskPartList, function (m, mtem) {
                                        $.each(mApsList.list, function (k, ktem) {
                                            //
                                            if (mtem.PartNo == ktem.PartNo && mtem.LineID == ktem.LineID && mtem.PartID == ktem.PartID) {
                                                ktem.StartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', mtem.startDate.getTime() - 8 * 3600000);
                                                ktem.EndTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(mtem.startDate).getTime() + mtem.time * (24 * 3600000) - 8 * 3600000);
                                            }
                                        });




                                    });
                                });


                            };
                            position.Task.dataList = mApsList.list;


                        },

                        Task: {
                            data: res.TreeList,
                            dataList: res.list
                        },

                        yAxis: {

                            data: ['任务一', '任务二', '任务三', '任务四', '任务五', '任务六', '任务七', '任务8', '任务9']

                        },
                    }

                    var counts = 0

                    $.each(position.Task.data, function (j, jtem) {
                        $.each(jtem.TaskPartList, function (k, ktem) {
                            $.each(ktem.TaskPartList, function (m, mtem) {
                                // <th style="min-width: 50px" data-order="PlanReceiveDate">计划进厂</th>
                                // <th style="min-width: 50px" data-order="RealReceiveDate">实际进厂</th>
                                // <th style="min-width: 50px" data-order="PlanFinishDate">预计完工</th>
                                counts++;
                                //天数
                                mtem.time = model.com.GetDays(mtem.StartTime, mtem.EndTime);

                                mtem.StartTime = $com.util.format("yyyy-MM-dd", mtem.StartTime);
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
                });


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


            Date.prototype.Format = function (fmt) { //需要JS格式化时间，后期做的时候方便使用   
                var o = {
                    "M+": this.getMonth() + 1,                 //月份   
                    "d+": this.getDate(),                    //日   
                    "h+": this.getHours(),                   //小时   
                    "m+": this.getMinutes(),                 //分   
                    "s+": this.getSeconds(),                 //秒   
                    "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
                    "S": this.getMilliseconds()             //毫秒   
                };
                if (/(y+)/.test(fmt))
                    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (var k in o)
                    if (new RegExp("(" + k + ")").test(fmt))
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return fmt;
            };


            function getweekGetDate(year, weeks) {
                var date = new Date(year, "0", "1");
                // 获取当前星期几,0:星期一 
                var time = date.getTime();
                //当这一年的1月1日为周日时则本年有54周,否则没有54周,没有则去除第54周的提示       
                var _week = date.getDay();

                if (_week != 0) {//一年53周情况 
                    if (weeks == 54) {
                        return '今年没有54周';
                    }
                    var cnt = 0;// 获取距离周末的天数    
                    if (_week == 0) {
                        cnt = 7;
                    } else if (_week == 1) {
                        cnt = 6;
                    } else if (_week == 2) {
                        cnt = 5;
                    } else if (_week == 3) {
                        cnt = 4;
                    } else if (_week == 4) {
                        cnt = 3;
                    } else if (_week == 5) {
                        cnt = 2;
                    } else if (_week == 6) {
                        cnt = 1;
                    }
                    cnt += 1;//加1表示以星期一为一周的第一天    // 将这个长整形时间加上第N周的时间偏移    
                    time += cnt * 24 * 3600000; //第2周开始时间 
                    var nextYear = new Date(parseInt(year, 10) + 1, "0", "1");
                    var nextWeek = nextYear.getDay();
                    var lastcnt = 0;//获取最后一周开始时间到周末的天数    
                    if (nextWeek == 0) {
                        lastcnt = 6;
                    } else if (nextWeek == 1) {
                        lastcnt = 0;
                    } else if (nextWeek == 2) {
                        lastcnt = 1;
                    } else if (nextWeek == 3) {
                        lastcnt = 2;
                    } else if (nextWeek == 4) {
                        lastcnt = 3;
                    } else if (nextWeek == 5) {
                        lastcnt = 4;
                    } else if (nextWeek == 6) {
                        lastcnt = 5;
                    }
                    if (weeks == 1) {//第1周特殊处理    // 为日期对象 date 重新设置成时间 time
                        var start = date.Format("yyyy-MM-dd");
                        date.setTime(time - 24 * 3600000);

                        return start + "/" + date;
                    } else if (weeks == 53) {//第53周特殊处理  
                        //第53周开始时间      
                        var start = time + (weeks - 2) * 7 * 24 * 3600000;
                        //第53周结束时间
                        var end = time + (weeks - 2) * 7 * 24 * 3600000 + lastcnt * 24 * 3600000 - 24 * 3600000;
                        date.setTime(start);
                        var _start = date.Format("yyyy-MM-dd");
                        date.setTime(end);
                        var _end = date.Format("yyyy-MM-dd");
                        return _start + "/" + _end;
                    } else {
                        var start = time + (weeks - 2) * 7 * 24 * 3600000; //第n周开始时间    
                        var end = time + (weeks - 1) * 7 * 24 * 3600000 - 24 * 3600000; //第n周结束时间
                        date.setTime(start);
                        var _start = date.Format("yyyy-MM-dd");
                        date.setTime(end);
                        var _end = date.Format("yyyy-MM-dd");
                        return _start + "/" + _end;
                    }
                } else {//一年54周情况    
                    var cnt = 0;// 获取距离周末的天数    
                    if (_week == 0 && weeks == 1) {//第一周    
                        cnt = 0;
                    } else if (_week == 0) {
                        cnt = 7;
                    } else if (_week == 1) {
                        cnt = 6;
                    } else if (_week == 2) {
                        cnt = 5;
                    } else if (_week == 3) {
                        cnt = 4;
                    } else if (_week == 4) {
                        cnt = 3;
                    } else if (_week == 5) {
                        cnt = 2;
                    } else if (_week == 6) {
                        cnt = 1;
                    }
                    cnt += 1;//加1表示以星期一为一周的第一天    
                    // 将这个长整形时间加上第N周的时间偏移    
                    time += 24 * 3600000; //第2周开始时间    
                    var nextYear = new Date(parseInt(year, 10) + 1, "0", "1");
                    var nextWeek = nextYear.getDay();
                    var lastcnt = 0;//获取最后一周开始时间到周末的天数    
                    if (nextWeek == 0) {
                        lastcnt = 6;
                    } else if (nextWeek == 1) {
                        lastcnt = 0;
                    } else if (nextWeek == 2) {
                        lastcnt = 1;
                    } else if (nextWeek == 3) {
                        lastcnt = 2;
                    } else if (nextWeek == 4) {
                        lastcnt = 3;
                    } else if (nextWeek == 5) {
                        lastcnt = 4;
                    } else if (nextWeek == 6) {
                        lastcnt = 5;
                    }
                    if (weeks == 1) {//第1周特殊处理
                        var start = date.Format("yyyy-MM-dd");
                        date.setTime(time - 24 * 3600000);
                        //alert(start +'--'+ date);
                        return _start + "/" + date;
                    } else if (weeks == 54) {//第54周特殊处理   
                        //第54周开始时间    
                        var start = time + (weeks - 2) * 7 * 24 * 3600000;
                        //第53周结束时间 
                        var end = time + (weeks - 2) * 7 * 24 * 3600000 + lastcnt * 24 * 3600000 - 24 * 3600000;
                        date.setTime(start);
                        var _start = date.Format("yyyy-MM-dd");
                        date.setTime(end);
                        var _end = date.Format("yyyy-MM-dd");
                        return _start + "/" + _end;
                    } else {
                        var start = time + (weeks - 2) * 7 * 24 * 3600000; //第n周开始时间    
                        var end = time + (weeks - 1) * 7 * 24 * 3600000 - 24 * 3600000; //第n周结束时间
                        date.setTime(start);
                        var _start = date.Format("yyyy-MM-dd");
                        date.setTime(end);
                        var _end = date.Format("yyyy-MM-dd");
                        return _start + "/" + _end;
                    }
                }
            }


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

        },




        run: function () {
            $('.zace-selectDayTime input').attr("value",($com.util.format('yyyy-MM-dd', new Date())));
            model.com.getWorkAreaAll({ 'ID': -1, 'Active': -1 }, function (resW) {
                if (resW && resW.list) {
                    DataStationList = $com.util.Clone(resW.list);
                    resW.list.sort(function (a, b) { return Number(a.OrderNum) - Number(b.OrderNum)});
                    $.each(resW.list, function (i, item) {
                        if (item.Active==1) {
                            TypeSource_LevelItem.StationID.push({
                                name: item.StationName,
                                value: item.ID,
    
                            });
                        }
                      

                    });
                }

                model.com.getFPCProduct({ ProductTypeID: 0, BusinessUnitID: 0 }, function (resW) {
                    if (resW && resW.list) {
                        DataProductItem = [];
                        $.each(resW.list, function (i, item) {
                            TypeSource_LevelItem.ProductID.push({
                                name: item.ProductName,
                                value: item.ID,

                            });

                            if (item.Active == 1) {
                                DataProductItem.push(item);
                            }

                        });
                        for (var i = 0; i < DataProductItem.length; i++) {
                            DataProductItem[i].Priority = 0;
                            DataProductItem[i].Index = i;
                            DataProductItem[i].Name = DataProductItem[i].ProductName;

                            var _listProduct = [];
                            _listProduct.push(DataProductItem[i]);
                            $(".zace-input-product").append($com.util.template(_listProduct, HTML.PriorityItem))

                        }
                        if (DataProductItem.length * 30 > 400) {

                            $(".zace-input-product").css('height', '400px');


                        } else {

                            $(".zace-input-product").css('height', DataProductItem.length * 30 + 40 + 'px');
                        }



                    }
                    //工位
                    model.com.getFPCPartAll({ FactoryID: -1, BusinessUnitID: -1, ProductTypeID: -1, OAGetType: -1 }, function (resW) {
                        if (resW && resW.list) {
                            AllPart = resW.list;
                        }
                        //局段
                        model.com.getCustomer({ active: 1 }, function (resS) {
                            if (resS && resS.list) {
                                AllCustomerList = resS.list;
                                ConditionCustomer = $com.util.Clone(AllCustomerList);
                                DataCustomerItem = $com.util.Clone(resS.list);

                                for (var i = 0; i < ConditionCustomer.length; i++) {
                                    ConditionCustomer[i].Priority = 0;
                                    DataCustomerItem[i].Name = DataCustomerItem[i].CustomerName;
                                    DataCustomerItem[i].Index = i;
                                    var _list = [];
                                    _list.push(DataCustomerItem[i]);
                                    $(".zace-input-customer").append($com.util.template(_list, HTML.PriorityItem));

                                }
                                if (DataCustomerItem.length * 30 > 400) {

                                    $(".zace-input-customer").css('height', '400px');


                                } else {

                                    $(".zace-input-customer").css('height', DataCustomerItem.length * 30 + 40 + 'px');
                                }

                                $.each(resS.list, function (i, item) {
                                    TypeSource_LevelItem.BureauSectionID.push({
                                        name: item.CustomerName,
                                        value: item.ID,

                                    });
                                });


                            }
                        });
                        //修程
                        model.com.getFMCLine({ FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0 }, function (resW) {
                            if (resW && resW.list) {
                                DataLinelist = resW.list;
                                DataLineItem = $com.util.Clone(resW.list);
                                ConditionLine = $com.util.Clone(DataLinelist);
                                $.each(resW.list, function (i, item) {
                                    TypeSource_LevelItem.LineID.push({
                                        name: item.Name,
                                        value: item.ID,

                                    });
                                });

                                for (var i = 0; i < ConditionLine.length; i++) {
                                    ConditionLine[i].Priority = 0;
                                    DataLineItem[i].Index = i;

                                    var _listLine = [];
                                    _listLine.push(DataLineItem[i]);
                                    $(".zace-input-line").append($com.util.template(_listLine, HTML.PriorityItem))

                                }
                                if (DataLineItem.length * 30 > 400) {

                                    $(".zace-input-line").css('height', '400px');


                                } else {

                                    $(".zace-input-line").css('height', DataLineItem.length * 30 + 40 + 'px');
                                }


                            }
                            //日历
                            model.com.getFMCWorkDay({}, function (resW) {
                                if (resW && resW.list) {

                                    $.each(resW.list, function (i, item) {
                                        TypeSource_condition.WorkDayID.push({
                                            name: item.Name,
                                            value: item.ID,

                                        });
                                        // document.getElementById("zace-selectOptions").options.add(new Option(item.Name, item.ID));
                                    });

                                }


                                var _year = (new Date()).getFullYear();
                                model.com.getTitleText(_year);

                                // mStartTime = $com.util.format('yyyy-MM-dd', new Date());


                                // var day = new Date(mStartTime).getDay();
                                // if (day == 0) {

                                //     mStartTime = model.com.addDays(mStartTime, 1);

                                // } else {

                                //     mStartTime = model.com.addDays(mStartTime, 8 - day);
                                // }

                                // mEndTime = model.com.addDays(mStartTime, 6);
                                mEndTimeNew = model.com.addDays($com.util.format('yyyy-MM-dd', new Date()), 6);
                                model.com.refresh();
                                model.com.refreshCondition();
                                model.com.refreshC();

                            });
                        });

                    });

                });

            });




        },

        com: {
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
                                title: { text: '车号', prop: 'PartNo', visible: true },
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
                                    zaceTime,
                                ]
                            },

                            fn: function (source) {

                                for (var i = 0; i < source.length; i++) {
                                    $.each(source[i].TaskPartList, function (j, jtem) {
                                        $.each(jtem.TaskPartList, function (m, mtem) {
                                            $.each(mApsList.list, function (k, ktem) {
                                                //
                                                if (mtem.PartNo == ktem.PartNo && mtem.LineID == ktem.LineID && mtem.PartID == ktem.PartID) {
                                                    ktem.StartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', mtem.startDate.getTime() - 8 * 3600000);
                                                    ktem.EndTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(mtem.startDate).getTime() + mtem.time * (24 * 3600000) - 8 * 3600000);
                                                }
                                            });




                                        });
                                    });


                                };
                                position.Task.dataList = mApsList.list;

                            },

                            Task: {
                                data: _obj.TreeList,
                                dataList: _obj.list
                            },

                            yAxis: {

                                data: ['任务一', '任务二', '任务三', '任务四', '任务五', '任务六', '任务七', '任务8', '任务9']

                            },
                        }

                        var counts = 0

                        $.each(position.Task.data, function (j, jtem) {
                            $.each(jtem.TaskPartList, function (k, ktem) {
                                $.each(ktem.TaskPartList, function (m, mtem) {
                                    // <th style="min-width: 50px" data-order="PlanReceiveDate">计划进厂</th>
                                    // <th style="min-width: 50px" data-order="RealReceiveDate">实际进厂</th>
                                    // <th style="min-width: 50px" data-order="PlanFinishDate">预计完工</th>
                                    counts++;
                                    //天数
                                    mtem.time = model.com.GetDays(mtem.StartTime, mtem.EndTime);

                                    mtem.StartTime = $com.util.format("yyyy-MM-dd", mtem.StartTime);
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
                                title: { text: '车号', prop: 'PartNo', visible: true },
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
                                    zaceTime,
                                ]
                            },

                            fn: function (source) {

                                for (var i = 0; i < source.length; i++) {
                                    $.each(source[i].TaskPartList, function (j, jtem) {
                                        $.each(jtem.TaskPartList, function (m, mtem) {
                                            $.each(mApsList.list, function (k, ktem) {
                                                //
                                                if (mtem.PartNo == ktem.PartNo && mtem.LineID == ktem.LineID && mtem.PartID == ktem.PartID) {
                                                    ktem.StartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', mtem.startDate.getTime() - 8 * 3600000);
                                                    ktem.EndTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(mtem.startDate).getTime() + mtem.time * (24 * 3600000) - 8 * 3600000);
                                                }
                                            });




                                        });
                                    });


                                };
                                position.Task.dataList = mApsList.list;

                            },

                            Task: {
                                data: _obj.TreeList,
                                dataList: _obj.list
                            },

                            yAxis: {

                                data: ['任务一', '任务二', '任务三', '任务四', '任务五', '任务六', '任务七', '任务8', '任务9']

                            },
                        }

                        var counts = 0

                        $.each(position.Task.data, function (j, jtem) {
                            $.each(jtem.TaskPartList, function (k, ktem) {
                                $.each(ktem.TaskPartList, function (m, mtem) {
                                    // <th style="min-width: 50px" data-order="PlanReceiveDate">计划进厂</th>
                                    // <th style="min-width: 50px" data-order="RealReceiveDate">实际进厂</th>
                                    // <th style="min-width: 50px" data-order="PlanFinishDate">预计完工</th>
                                    counts++;
                                    //天数
                                    mtem.time = model.com.GetDays(mtem.StartTime, mtem.EndTime);

                                    mtem.StartTime = $com.util.format("yyyy-MM-dd", mtem.StartTime);
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
            getYearWeek: function (a, b, c) {
                /*  
                   date1是当前日期  
                   date2是当年第一天  
                   d是当前日期是今年第多少天  
                   用d + 当前年的第一天的周差距的和在除以7就是本年第几周  
               */
                var date1 = new Date(a, parseInt(b) - 1, c),
                    date2 = new Date(a, 0, 1),
                    d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
                return Math.ceil((d + ((date2.getDay() + 1) - 1)) / 7);
            },

            getTitleText: function (year) {

                //计算出这年的周数
                var weekNum = model.com.getNumOfWeeks(year);
                //首先算出这年的第一个星期日
                var firstSunday = new Date(year, 0, 1);
                var n = 6 - (firstSunday.getDay() + 6) % 7;
                firstSunday.setDate(firstSunday.getDate() + n);
                //根据年份设置周数           
                for (var i = 1; i <= weekNum; i++) {
                    if (i == 1) {
                        //计算这年第一个周一的日期
                        var firstMonday = new Date(firstSunday.setDate(firstSunday.getDate() - 6));
                        firstSunday.setDate(firstSunday.getDate() + 6);

                        TypeSource_LevelItem.WeekNum.push({
                            name: '第' + i + '周（' + model.com.getNowFormatDate(firstMonday) + '）-（' + model.com.getNowFormatDate(firstSunday) + '）',
                            value: i,

                        });

                        //weekHtml += '<li><a href="javaScript:void(0)" οnclick="week($(this).text())">第' + i + '周（' + getNowFormatDate(firstMonday) + '）-（' + getNowFormatDate(firstSunday) + '）</a></li>';
                    } else {
                        TypeSource_LevelItem.WeekNum.push({
                            name: '第' + i + '周' + model.com.getDateRange(firstSunday),
                            value: i,

                        });

                    }
                }

            },

            getNumOfWeeks: function (year) {
                //设置为这一年开始日期
                var startDateOfYear = new Date(year, 0, 1);
                //计算这一年有多少天
                var daysOfYear = ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) ? 366 : 365;
                //366（365）/7=52.2(52.1)，所以一般一年有52周余1天或者2天，当这一年有366天时且第一天是周日，那么他的最后一天则是周一，这一年就有54周。
                var weekNum = 53;
                //当年份是闰年且第一天是周日时有54周
                if (startDateOfYear.getDay() == 0 && daysOfYear == 366) {
                    weekNum = 54;
                }
                return weekNum;
            },

            getDateRange: function (lastSunday) {

                //根据上周日获取这周日的日期范围
                if (lastSunday == null || lastSunday == '') {
                    return "";
                }
                var beginDate = new Date(lastSunday.setDate(lastSunday.getDate() + 1));
                var endDate = new Date(lastSunday.setDate(lastSunday.getDate() + 6));
                return '（' + model.com.getNowFormatDate(beginDate) + '）-' + '（' + model.com.getNowFormatDate(endDate) + '）';
            },

            getDateRangeZace: function (year, lastSunday) {

                //根据上周日获取这周日的日期范围
                if (lastSunday == null || lastSunday == '') {
                    return "";
                }
                var beginDate = new Date(lastSunday.setDate(lastSunday.getDate() + 1));
                var endDate = new Date(lastSunday.setDate(lastSunday.getDate() + 6));
                return {
                    startTime: year + "-" + model.com.getNowFormatDate(beginDate),
                    endTime: year + "-" + model.com.getNowFormatDate(endDate),
                };
            },

            getNowFormatDate: function (date) {
                //时间转换成字符串
                var Month = 0;
                var Day = 0;
                var CurrentStr = "";
                // 初始化时间
                Month = date.getMonth() + 1;
                Day = date.getDate();
                if (Month >= 10) {
                    CurrentStr += Month + "-";
                } else {
                    CurrentStr += "0" + Month + "-";
                }
                if (Day >= 10) {
                    CurrentStr += Day;
                } else {
                    CurrentStr += "0" + Day;
                }
                return CurrentStr;
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
                $("#femi-orderPriority-tbody").html($com.util.template(_list, HTML.TableOrderMode));
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


                // model.com.getSchedulePlan({ workShopID: 1, lineID: MlineID, time: MShiftTime, status: 3 }, function (resP) {
                model.com.getOMSOrderList({ StartTime: mStartTimeNew, EndTime: mEndTimeNew, APSShiftPeriod: 5 }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var _list = resP.list;
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
                days = Math.ceil(days);

                if (days < 1) {
                    days = 1;
                }

                return days;
            },


            //动态生成表格
            refreshTablePro: function (data) {
                //工序详情
                var _list = $com.util.Clone(data);
                var _head = $com.util.template({ ths: $com.util.template(_list.ColumnList, HTML.th) }, HTML.thead);

                $(".part-plan-div .table thead").html(_head);

                $.each(_list.GantPartList, function (i, item) {
                    item.FQTYSum = 0;
                    $.each(item.TaskPartList, function (p, p_item) {
                        item.FQTYSum += p_item.FQTYShift;

                    });
                    item.tds = $com.util.template(item.TaskPartList, HTML.td);
                    if (item.TaskLineID > 0) {
                        item.Text = "已排";
                    } else {
                        item.Text = "未排";
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
                                item[p] = ($com.util.format('yyyy-MM-dd', item[p]));
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
