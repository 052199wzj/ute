require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/timeLine'], function ($jq, $com, $timeLine) {
    //1 定义结构
    var showObj,
        dataObj = {
            contain: $("#canvasDiv"), //将canvas放在哪个父级
            //原始数据
            data: [
                {
                    beginTime: "2019-06-11 16:15:21",
                    endTime: "2019-06-11 17:15:50",
                    status: 1,
                    id: 1
                }
            ],
            //显示数据
            dataShow: [
                {
                    text: "开始时间:",
                    num: 0,
                    id: 1
                },
                {
                    text: "结束时间:",
                    num: 0,
                    id: 2
                },
                {
                    text: "状态:",
                    num: 0,
                    id: 3
                },
                {
                    text: "异常:",
                    num: 0,
                    id: 4
                },
            ],
            days: 50,//选择的天数
            showDays: 0,//选择显示的天数
            spaceLength: 60,//单位刻度的长度
            spaceCount: 0,//总共多少格
            screenWidth: 0,//屏幕宽度
            startTime: "2019-06-25 15:15:21",//选择开始的时间
            countTime: 0,//选择的总时长(ms单位)
            oneSpaceTime: 0,//每格代表的时间
            oneTimeLenght: 0,//单位时间的长度（px/ms）
            rectY: 150,//框图默认高度
            aroundArrY: [],
            aroundedArrY: [],
            //aroundedObjY: {},
            //aroundObjY: {},
            canvasParams: {
                height: 400,//canvas的高度
            },
            //时间轴
            rectangleParams: {
                rectangleX: 0,
                rectangleY: 700,
                rectangleHeight: 4,
                rectangleRadius: 2,
                rectangleColor: "#C5C8D1"
            },
            //时间轴刻度
            lineParams: {
                lineX: 30,
                lineY: 400,
                lineHeight: 3,
                lineColor: "#97A6B2"
            },
            //框图
            rectParams: {
                rectY: 150,
                rectWidth: 180,
                rectHeight: 50,
                rectColor: "#FFB6C1"
            },
            //框线
            rectLineParams: {
                rectLineY: 400,
                rectLineHeight: 250,
                rectLineColor: "#C0C0C0"
            },
            //圆点
            circleParams: {
                circleY: 400,
                circleR: 4,
                circleColor: "#FFB6C1"
            },
            //显示字
            textParams: {
                font: "10px Verdana",
                fontColor: "#000000"
            }
        }

    var HTML,
        model,

        KEYWORD,
        KEYWORD_LIST,
        DEFAULT_VALUE,
        TypeSource,
        FORMATTRT,

        KEYWORD_Apply,
        KEYWORD_LIST_Apply,
        DEFAULT_VALUE_Apply,
        TypeSource_Apply,
        FORMATTRT_Apply,

        DataAll,
        Datatree,
        DataLevel,
        DataUser = window.parent._UserAll,
        DataActionType,
        DataExceptionType,
        DataStationType,
        TableShowData,
        timeLineShowData,
        newtimeLineShowData,

        flag = false,
        flag_deal = false,
        flag_deal_last = false,
        flag_s = false,
        flag_e = false,
        flag_l = false,
        flag_set = false,
        flag_d = false,
        flag_r = false,
        flag_m = false,
        chooseTime = {
            startTime: "",
            endTime: "",
            longerTime: ""
        },
        defaultTime = {
            startTime: "",
            endTime: ""
        };


    mStartimeZace = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date().getTime() - 1 * 30 * 24 * 3600 * 1000);
    mEndTimeZace = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date());
    mTaskID = 0;
    mbool = false;
    modelDep = {};
    modelUser = {};
    modelPlaceID = {};
    modelStation = {};
    Temp = {
        Src: '../static/images/checkbox/selected.png',
        Color: 'green',
        Status: '',
        Creator: '',
        CreateTime: '',
        Text: "",
    }
    ActionList = ["-", "-", "-", "已收到", "-", "已处理", "已转发", "已确认", "已驳回", "已转发"];
    STATUS = ["待处理", "待处理", "收到待处理", "到场待处理", "待确认", "已转发", "已确认", "驳回待处理", "超时上报", "已撤销"];
    HTML = {
        Descfirst: [
            '<div class="D-panel">',
            '<div id="mLeft_moudle" style="width: 26px; float: left;margin-left: 30px;clear: both;">',
            // '<div style="width: 2px;height: 40px;background-color:green;margin-left: 12px;" id="first_moudle"></div>',  
            '<img src="{{Src}}" alt="" style="width: 25px;height: 25px;" id="img_moudle">',
            '<div style="width: 2px;height: 80px;background-color:{{Color}};margin-left: 12px;"id="second_module"></div>',
            '</div>',
            '<div id="mRight_moudleOne" style="width: 280px;float: left;margin-left: 70px;margin-top: -100px;">',
            '<div id="status_moudle">{{Status}}</div>',
            '<div id="personnel_moudle" style="margin-left: -5px;">{{Creator}}</div>',
            '<div id="time_moudle">{{CreateTime}}</div>',
            '<div id="text-module">{{Text}}</div>',
            '</div>',
            '</div>'

        ].join(""),
        DescSecond: [
            '<div class="D-panel">',
            '<div id="mLeft_moudle" style="width: 26px; float: left;margin-left: 30px;clear: both;">',
            // '<div style="width: 2px;height: 10px;background-color:{{Color}};margin-left: 12px;" id="first_moudle"></div>',
            '<img src="{{Src}}" alt="" style="width: 25px;height: 25px;" id="img_moudle">',
            //'<div style="width: 2px;height: 80px;background-color:{{Color}};margin-left: 12px;"id="second_module"></div>',
            '</div>',
            '<div id="mRight_moudleOne" style="width: 280px;float: left;margin-left: 70px;margin-top: -20px;">',
            '<div id="status_moudle">{{Status}}</div>',
            '<div id="personnel_moudle" style="margin-left: -5px;">{{Creator}}</div>',
            '<div id="time_moudle">{{CreateTime}}</div>',
            '<div id="text-module">{{Text}}</div>',
            '</div>',
            '</div>',

        ].join(""),
        module: [
            '<div id="mLeft_moudle" style="width: 26px; float: left;margin-left: 30px;clear: both;">',
            // '<div style="width: 2px;height: 40px;background-color:green;margin-left: 12px;" id="first_moudle"></div>',
            '<img src="../static/images/checkbox/selected.png" alt="" style="width: 25px;height: 25px;" id="img_moudle">',
            '<div style="width: 2px;height: 80px;background-color:green;margin-left: 12px;"id="second_moudle"></div>',
            '</div>',
            '<div id="mRight_moudleOne" style="width: 300px;float: left;margin-left: 70px;margin-top: -100px;">',
            '<div id="status_moudle">{{Status}}</div>',
            '<div id="personnel_moudle">{{Creator}}</div>',
            '<div id="time_moudle">{{CreateTime}}</div>',
            '</div>'
        ].join(""),
        moduleSecond: [
            '<div id="mLeft_moudle" style="width: 26px; float: left;margin-left: 30px;clear: both;">',
            //'<div style="width: 2px;height: 20px;background-color:green;margin-left: 12px;" id="first_moudle-second"></div>',
            '<img src="../static/images/checkbox/selected.png" alt="" style="width: 25px;height: 25px;" id="img_moudle-second">',
            '<div style="width: 2px;height: 80px;background-color:green;margin-left: 12px;"id="second_moudle-second"></div>',
            '</div>',
            '<div id="mRight_moudleOne" style="width: 300px;float: left;margin-left: 70px;margin-top: -100px;">',
            '<div id="status_moudle">{{Status}}</div>',
            '<div id="personnel_moudle">{{Creator}}</div>',
            '<div id="time_moudle">{{CreateTime}}</div>',
            '</div>'
        ].join(""),
        ApplyCost: [
            '<tr data-color="">',
            '<td style="width: 3px"><input type="checkbox"',
            '	class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td style="min-width: 50px" data-title="Position" data-value="{{Position}}">{{Position}}</td> ',
            '<td style="min-width: 50px" data-title="People" data-value="{{People}}">{{People}}</td>  ',
            '<td style="min-width: 50px" data-title="Time" data-value="{{Time}}"  >{{Time}}</td>  ',
            '</tr>',
        ].join(""),

        TableTaskItemNode: [
            '<tr data-color="" >',
            '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td style="min-width: 50px" data-title="ExceptionTypeID" data-value="{{ExceptionTypeID}}">{{ExceptionTypeName}}</td> ',
            '<td style="min-width: 50px" data-title="StationNo" data-value="{{StationNo}}">{{StationNo}}</td>  ',
            '<td style="min-width: 50px" data-title="RespondLevelName" data-value="{{RespondLevelName}}">{{RespondLevelName}}</td>  ',
            //'<td style="min-width: 50px" data-title="StationTypeName" data-value="{{StationTypeName}}"  >{{StationTypeName}}</td>  ',
            '<td style="min-width: 50px" data-title="Comment" data-value="{{Comment}}">{{Comment}}</td>  ',
            '<td style="min-width: 50px" data-title="ApplicantName" data-value="{{ApplicantName}}"  >{{ApplicantName}}</td>  ',
            '<td style="min-width: 50px" data-title="OperatorName" data-value="{{OperatorName}}">{{OperatorName}}</td>  ',
            '<td style="min-width: 80px" data-title="CreateTime" data-value="{{CreateTime}}">{{CreateTime}}</td>  ',
            // '<td style="min-width: 50px" data-title="EditTime" data-value="{{EditTime}}">{{EditTime}}</td>  ',
            // '<td style="min-width: 50px" data-title="LastTime" data-value="{{LastTime}}">{{LastTime}}</td>  ',
            '<td style="min-width: 50px" data-title="StatusName" data-value="{{StatusName}}">{{StatusName}}</td>',
            '</tr>',
        ].join(""),
        TableLinePoint: [
            '<tr data-color="{{Color}}" style="" >',
            '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></td>',
            '<td style="min-width: 50px" data-title="Status" data-value="{{Status}}">{{Status}}</td>',
            '<td style="min-width: 50px" data-title="Creator" data-value="{{Creator}}">{{Creator}}</td> ',
            '<td style="min-width: 50px" data-title="CreateTime" data-value="{{CreateTime}}">{{CreateTime}}</td>  ',
            '</tr>',
        ].join(""),
        CallItemNode: [
            '<li class="call-info-items a"data-type="{{type}}">',
            '<div class="call-info-items-list">',
            '<div class="call-info-time"><span>{{CreateTime}}</span></div>',
            '<div class="call-info-actiontype"><span>{{ActionType}}</span></div>',
            '<div class="call-info-operator"><span>{{Operator}}</span></div>',
            '<div type="button" class="btn dropdown-toggle"data-toggle="dropdown"data-type="{{type}}"data-dis="{{DisID}}"data-act="{{ActionID}}">',
            '<span class="icon icon-right "id="call-info-list"style="background:url(../static/images/icon-right.png) no-repeat center">',
            '</span>',
            '</div>',
            '</div>',
            '<ul id="" class="deal-info-items-last-down deal-info-items-last-down{{ActionID}} showcall-{{type}}"data-ctype="showcall-{{type}}">',
            '</ul>',
            '</li>',
        ].join(""),
        DealItemNode: [
            '<li class="deal-info-items">',
            '<div class="deal-info-items-list">',
            '<div class="deal-info-time"><span>{{CreateTime}}</span></div>',
            '<div class="deal-info-operator"><span>{{Operator}}</span></div>',
            '<div class="deal-info-status"><span>{{Status}}</span></div>',
            '<div class="deal-info-icon" id="deal-firstDown"><span class="icon icon-right deal-firstDown" data-value="deal-info-items-first-down{{DealID}}"style="background:url(../static/images/icon-right.png) no-repeat center"></span></div>',
            '</div>',
            ' <ul id="deal-info-items-first-down{{DealID}}" class="deal-info-items-first-down"></ul>',
            '</li>',
        ].join(""),
        TaskInfoItemNode: [
            '<ul class="call-info-lists" role="menu"aria-labelledby=""style="padding-left: 0px">',
            //'<li class="call-info-item">',
            //'<div class="call-info-item-title">异常地点类型</div>',
            //'<div class="call-info-item-all">{{StationTypeName}}</div>',
            //'</li>',
            '<li class="call-info-item">',
            '<div class="call-info-item-title">异常地点</div>',
            '<div class="call-info-item-all">{{StationNo}}</div>',
            '</li>',
            '<li class="call-info-item">',
            '<div class="call-info-item-title">异常类型</div>',
            '<div class="call-info-item-all">{{ExceptionTypeName}}</div>',
            '</li>',
            '<li class="call-info-item">',
            '<div class="call-info-item-title">异常等级</div>',
            '<div class="call-info-item-all">{{RespondLevel}}</div>',
            '</li>',
            '<li class="call-info-item">',
            '<div class="call-info-item-title">台位</div>',
            '<div class="call-info-item-all">{{PlaceName}}</div>',
            '</li>',
            '<li class="call-info-item">',
            '<div class="call-info-item-title">车号</div>',
            '<div class="call-info-item-all">{{PartNo}}</div>',
            '</li>',
            //'<li class="call-info-item">',
            //'<div class="call-info-item-title">是否需要到场</div>',
            //'<div class="call-info-item-all">{{OnSite}}</div>',
            //'</li>',
            //'<li class="call-info-item">',
            //'<div class="call-info-item-title">是否在看板上显示</div>',
            //'<div class="call-info-item-all">{{DisplayBoard}}</div>',
            //'</li>',
            '<li class="call-info-item">',
            '<div class="call-info-item-title">内容备注</div>',
            '<div class="call-info-item-all">{{Comment}}</div>',
            '</li>',
            '<li class="call-info-item">',
            '<div class="call-info-item-title">照片</div>',
            '<div class="call-info-item-image">',
            '</div>',
            //'<img src="/upload/{{ImageList}}" alt="" class="image-show" data-source="{{ImageList}}" />',
            //'<img src="/upload/{{ImageList}}" alt=""class="image-show"data-source="{{ImageList}}" />',
            '</li>',
            '</ul>',
        ].join(""),
        ZaceCallInfoItemNode: [
            '<ul class="call-info-lists" role="menu"aria-labelledby=""style="padding-left: 0px">',
            '<li class="call-info-item">',
            '<div class="call-info-item-title">被转发人</div>',
            '<div class="call-info-item-all">{{ForwarderName}}</div>',
            '</li>',
            '<li class="call-info-item">',
            '<div class="call-info-item-title">内容备注</div>',
            '<div class="call-info-item-all">{{CancelComment}}</div>',
            '</li>',
            '<li class="call-info-item">',
            '<div class="call-info-item-title">照片</div>',
            '<div class="call-info-item-image-cancel">',
            '</div>',
            //'<img src="/upload/{{CancelImageList}}" alt="" class="image-show"data-source="{{CancelImageList}}"/>',
            '</li>',
            '</ul>',
        ].join(""),
        CallInfoItemNode: [
            '<ul class="call-info-lists" role="menu"aria-labelledby=""style="padding-left: 0px">',
            '<li class="call-info-item">',
            '<div class="call-info-item-title">内容备注</div>',
            '<div class="call-info-item-all">{{CancelComment}}</div>',
            '</li>',
            '<li class="call-info-item">',
            '<div class="call-info-item-title">照片</div>',
            '<div class="call-info-item-image-cancel">',
            '</div>',
            //'<img src="/upload/{{CancelImageList}}" alt="" class="image-show"data-source="{{CancelImageList}}"/>',
            '</li>',
            '</ul>',
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
        img: [
            '<img class="zacelmvt-img" />'
        ].join(""),

    };
    var statusType = [
        {
            name: "发起",
            value: 0,
        },
        {
            name: "待处理",
            value: 1,
        },
        {
            name: "收到待处理",
            value: 2,
        },
        {
            name: "到场待处理",
            value: 3,
        },
        {
            name: "待确认",
            value: 4,
        },
        {
            name: "已转发",
            value: 5,
        },
        {
            name: "已确认",
            value: 6,
        }, {
            name: "驳回待处理",
            value: 7,
        },
        {
            name: "超时上报",
            value: 8,
        },
        {
            name: "已撤销",
            value: 9,
        },
    ]
    var OnSiteType = [
        {
            name: "否",
            value: 0,
        },
        {
            name: "是",
            value: 1,
        },
    ]
    var DisplayBoardType = [
        {
            name: "否",
            value: 0,
        },
        {
            name: "是",
            value: 1,
        }];

    (function () {
        KEYWORD_LIST = [
            "StartTime|开始时间|Date",
            "EndTime|结束时间|Date",
            "CreateTime|时间|DateTime",
            "EditTime|时间|DateTime",
            "LastTime|时间|DateTime",
            "Time|时间|DateTime",
        ];

        FORMATTRT = {};
        KEYWORD = {};
        TypeSource = {};

        $.each(KEYWORD_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT[detail[0]] = $com.util.getFormatter(TypeSource, detail[0], detail[2]);
            }

        });
    })();
    //申请单据
    (function () {
        KEYWORD_LIST_Apply = [
            "StartTime|开始时间|Date",
            "EndTime|结束时间|Date",
            "CreateTime|时间|DateTime",
            "EditTime|时间|DateTime",
            "LastTime|时间|DateTime",
            "Time|时间|DateTime",
        ];

        FORMATTRT_Apply = {};
        KEYWORD_Apply = {};
        TypeSource_Apply = {};

        $.each(KEYWORD_LIST_Apply, function (i, item) {
            var detail = item.split("|");
            KEYWORD_Apply[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_Apply[detail[0]] = $com.util.getFormatter(TypeSource_Apply, detail[0], detail[2]);
            }

        });
    })();

    model = $com.Model.create({
        name: 'iPlant.MES',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();
        },
        events: function () {
            //呼叫展开详情
            $("body").delegate(".a", "click", function () {
                //判断显示哪个下拉列表
                var faTherclass = $(this).parents(".call-info-all");
                //显示呼叫信息的列表
                if (faTherclass.length == 1) {
                    //判断是否显示下拉框
                    if (flag == false) {
                        $(this).find("#call-info-list").css("background", "url(../static/images/icon-down.png) no-repeat center");
                        var type = $(this).attr("data-type");
                        //判断显示的是task还是cancel的下拉框
                        if (type == "task") {
                            var $class = $(this).children(".showcall-task").attr("data-ctype");
                            var $that = $(this);
                            model.com.refreshTaskInfoData($class, $that);
                            $("." + $class).show();
                        } else if (type == "cancel") {
                            var $that = $(this);
                            var $class = $(this).children(".showcall-cancel").attr("data-ctype");
                            model.com.refreshCallInfoData($class, $that);
                            //$(this).children("ul").show();
                            $("." + $class).show();
                        }
                        flag = true;
                    }
                    else if (flag == true) {
                        $(this).find("#call-info-list").css("background", "url(../static/images/icon-right.png) no-repeat center");
                        $(this).children(".showcall-task").hide();
                        $(this).children(".showcall-cancel").hide();
                        flag = false;
                    }
                }
                //处理信息操作详情（二层）
                else {
                    var $d_id = $(this).find("#call-info-list").parent().attr("data-dis");
                    $a_id = $(this).find("#call-info-list").parent().attr("data-act");
                    if (flag_deal_last == false) {
                        $(this).find("#call-info-list").css("background", "url(../static/images/icon-down.png) no-repeat center");
                        var $that = $(this);
                        model.com.refreshLastDeal($d_id, $a_id, $that);
                        $(".deal-info-items-last-down" + $a_id).show();
                        flag_deal_last = true;
                    } else if (flag_deal_last == true) {
                        $(this).find("#call-info-list").css("background", "url(../static/images/icon-right.png) no-repeat center");
                        $(".deal-info-items-last-down" + $a_id).hide();
                        flag_deal_last = false;
                    }
                }
            });
            //处理信息展开详情(一层)
            $("body").delegate(".deal-info-items .deal-info-items-list", "click", function () {
                var $id = $(this).find(".deal-firstDown").attr("data-value");
                if (flag_deal == false) {
                    $(this).find(".deal-firstDown").css("background", "url(../static/images/icon-down.png) no-repeat center");
                    $("#" + $id).show();
                    //$(this).parents(".deal-info-items").css("background-color", "#F0F0F0");
                    flag_deal = true;
                } else if (flag_deal == true) {
                    $(this).find(".deal-firstDown").css("background", "url(../static/images/icon-right.png) no-repeat center");
                    $("#" + $id).hide();
                    //$(this).parents(".deal-info-items").css("background-color", "white");
                    flag_deal = false;
                }
            });
            //刷新

            $("body").delegate("#call-zace-refresh", "click", function () {
                //重新查找接口数据
                model.com.getTask({ ApplyID: -1, StationType: -1, StationName: "", StationID: -1, RespondLevel: -1, DisplayBoard: -1, OnSite: -1, Status: 0, ApplicantID: -1, OperatorID: -1, ConfirmID: -1, ShiftID: -1, StartTime: $com.util.format('yyyy-MM-dd', mStartimeZace), EndTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(mEndTimeZace).getTime() + 1 * 30 * 24 * 3600 * 1000), OAGetType: -1 }, function (data) {
                    DataAll = data;
                    chooseTimeArr = data.list;
                    model.com.refreshData(DataAll);

                    //重新渲染时间轴
                    dataObj.startTime = new Date(mStartimeZace);
                    if (chooseTimeArr.length == 0) {
                        // alert("没有找到相关数据！");
                        timeLineShowData = chooseTimeArr;
                        dataObj.contain.html("");
                        return false;
                    } else {
                        var newchooseTimeArr = model.com.getOrderTime(chooseTimeArr),
                            n = newchooseTimeArr.length;

                        timeLineShowData = newchooseTimeArr;
                        //更改时间轴默认数据
                        chooseTime = {
                            startTime: newchooseTimeArr[0].CreateTime,
                            endTime: newchooseTimeArr[n - 1].EditTime,
                            longerTime: model.com.getDays(newchooseTimeArr[0].CreateTime, newchooseTimeArr[n - 1].EditTime)
                        }
                        model.com.dealData(timeLineShowData, chooseTime);
                        newtimeLineShowData = timeLineShowData;
                    }
                });
            });
            //Enter触发模糊查询事件
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var value = $("#cby-search-text-ledger").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#cby-task-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#cby-task-tbody"), TableShowData, value, "ID");
                }
            });
            //异常任务模糊查询
            $("body").delegate("#cby-search-ledgerZace", "click", function () {
                var value = $("#cby-search-text-ledger").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#cby-task-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#cby-task-tbody"), TableShowData, value, "ID");
            });
            //异常任务精准查询
            $("body").delegate("#cby-search-ledger", "click", function () {
                var default_value = {
                    StartTime: $com.util.format('yyyy-MM-dd', new Date()),
                    EndTime: $com.util.format('yyyy-MM-dd', new Date()),
                };
                $com.modal.show(default_value, KEYWORD, "查询", function (rst) {

                    if (!rst || $.isEmptyObject(rst))
                        return;
                    var startTime = new Date($com.util.format('yyyy-MM-dd', rst.StartTime)).getTime(),
                        endTime = new Date($com.util.format('yyyy-MM-dd', rst.EndTime)).getTime(),
                        chooseTimeArr = [];
                    //更改时间轴查询范围
                    defaultTime = {
                        startTime: $com.util.format('yyyy-MM-dd', rst.StartTime),
                        endTime: $com.util.format('yyyy-MM-dd', rst.EndTime)
                    }

                    mStartimeZace = $com.util.format('yyyy-MM-dd', rst.StartTime);
                    mEndTimeZace = $com.util.format('yyyy-MM-dd', rst.EndTime);

                    //重新查找接口数据
                    model.com.getTask({ ApplyID: -1, StationType: -1, StationName: "", StationID: -1, RespondLevel: -1, DisplayBoard: -1, OnSite: -1, Status: 0, ApplicantID: -1, OperatorID: -1, ConfirmID: -1, ShiftID: -1, StartTime: $com.util.format('yyyy-MM-dd', rst.StartTime), EndTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.EndTime).getTime() + 1 * 30 * 24 * 3600 * 1000), OAGetType: -1 }, function (data) {
                        DataAll = data;
                        chooseTimeArr = data.list;
                        model.com.refreshData(DataAll);

                        //重新渲染时间轴
                        dataObj.startTime = new Date(rst.StartTime);
                        if (chooseTimeArr.length == 0) {
                            // alert("没有找到相关数据！");
                            timeLineShowData = chooseTimeArr;
                            dataObj.contain.html("");
                            return false;
                        } else {
                            var newchooseTimeArr = model.com.getOrderTime(chooseTimeArr),
                                n = newchooseTimeArr.length;

                            timeLineShowData = newchooseTimeArr;
                            //更改时间轴默认数据
                            chooseTime = {
                                startTime: newchooseTimeArr[0].CreateTime,
                                endTime: newchooseTimeArr[n - 1].EditTime,
                                longerTime: model.com.getDays(newchooseTimeArr[0].CreateTime, newchooseTimeArr[n - 1].EditTime)
                            }
                            model.com.dealData(timeLineShowData, chooseTime);
                            newtimeLineShowData = timeLineShowData;
                        }
                    });

                }, TypeSource);
            });
            //设置范围
            $("body").delegate("#down-menu-display", "click", function () {
                if (flag_set == false) {
                    $(".cby-contain-cbg-down").css("display", "block");
                    flag_set = true;
                } else if (flag_set == true) {
                    $(".cby-contain-cbg-down").css("display", "none");
                    flag_set = false;
                }
            });
            //降序
            $("body").delegate("#show-down-asc-table", "click", function () {

                $("#show-down-asc-table").hide();
                $("#show-down-desc-table").show();
                mbool = false;
                //正序
                model.com.showTable();

            });
            //逆序
            $("body").delegate("#show-down-desc-table", "click", function () {

                $("#show-down-asc-table").show();
                $("#show-down-desc-table").hide();
                mbool = true;
                //
                model.com.showTable();

            });
            //流程表详情
            $("body").delegate("#lmvt-apply-deal", "click", function () {
                $("#show-down-asc-table").hide();
                $("#show-down-desc-table").show();
                var SelectData = $com.table.getSelectionData($("#cby-task-tbody"), "ID", TableShowData);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！");
                    return;
                } else if (SelectData.length > 1) {
                    alert("只能查看一条数据的流程！");
                    return;
                }

                $(".call-right-info-zace-second").hide();
                $(".call-right-info").hide();
                $(".lmvt-apply").show();
                mTaskID = SelectData[0].ID;
                mbool = false;
                //正序
                model.com.showTable();


            });
            //隐藏
            $("body").delegate("#lmvt-hidden", "click", function () {
                $(".lmvt-apply").hide();
            });

            //修改时间轴开始时间
            $("#time-line-item-startTime").change(function () {
                var _defalutTime = defaultTime.startTime,
                    startTime = $(this).val(),
                    _defalutTimeA = new Date(_defalutTime).getTime(),
                    _startTimeA = new Date(startTime).getTime();
                if (_startTimeA < _defalutTimeA) {
                    alert("开始时间不小于" + _defalutTime + "!!!");
                    //return false;
                }
                flag_s = true;
                chooseTime.startTime = startTime;
                if (chooseTime.endTime == "") {
                    //alert("请输入结束时间！");
                } else {
                    var longerDays = model.com.getDays(chooseTime.startTime, chooseTime.endTime);
                    $("#time-line-item-longer").val(longerDays);
                    timeLineShowData = model.com.filtrateTime(newtimeLineShowData, chooseTime);
                }

            });
            //修改时间轴结束时间
            $("#time-line-item-endTime").change(function () {
                var _defalutTime = defaultTime.endTime,
                    endTime = $(this).val(),
                    _defalutTimeA = new Date(_defalutTime).getTime(),
                    _endTimeA = new Date(endTime).getTime();
                if (_endTimeA > _defalutTimeA) {
                    alert("结束时间不大于" + _defalutTime + "!!!");
                    //return false;
                }
                flag_e = true;
                chooseTime.endTime = endTime;
                timeLineShowData = model.com.filtrateTime(newtimeLineShowData, chooseTime);
                if (flag_s == true && flag_e == true && flag_l == false) {
                    var longerDays = model.com.getDays(chooseTime.startTime, chooseTime.endTime);
                    $("#time-line-item-longer").val(longerDays);
                } else {
                    var longerDays = model.com.getDays(chooseTime.startTime, chooseTime.endTime);
                    $("#time-line-item-longer").val(longerDays);
                }
            });
            //修改时间轴显示时间
            $("#time-line-item-longer").change(function () {
                var longerTime = $(this).val();
                flag_l = true;
                chooseTime.longerTime = longerTime;
            });
            //设置范围点击事件
            $("body").delegate("#timeline-show", "click", function () {
                if (flag_s && flag_e && flag_l == false) {
                    chooseTime.longerTime = model.com.getDays(chooseTime.startTime, chooseTime.endTime);
                }
                timeLineShowData = model.com.filtrateTime(timeLineShowData, chooseTime);
                model.com.dealData(timeLineShowData, chooseTime);
                flag_s = false;
                flag_e = false;
                flag_l = false;
            });
            //时间轴显示
            $("body").delegate("#timeline-show-down", "click", function () {
                if (flag_d == false) {
                    $(".up-info").css("height", "50%");
                    $(".down-info").show();
                    model.com.dealDefaultData(DataAll.list);
                    flag_d = true;
                } else {
                    $(".down-info").hide();
                    $(".up-info").css("height", "100%");
                    flag_d = false;
                }
            });

            //双击.
            $("body").delegate("#cby-task-tbody tr", "dblclick", function () {
                $("#show-down-asc").hide();
                $("#show-down-desc").show();
                var $this = $(this);
                var $table = $this.closest("table");
                var WID = Number($this.find('td[data-title=ID]').attr('data-value'));

                $(".call-right-info-zace-second").show();
                $(".call-right-info").hide();
                $(".lmvt-apply").hide();
                mTaskID = WID;
                mbool = false;
                //正序
                model.com.showLine();
            });


            //流程显示
            $("body").delegate("#call-info-right-zace", "click", function () {
                $("#show-down-asc").hide();
                $("#show-down-desc").show();
                var SelectData = $com.table.getSelectionData($("#cby-task-tbody"), "ID", TableShowData);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！");
                    return;
                } else if (SelectData.length > 1) {
                    alert("只能查看一条数据的信息！");
                    return;
                }

                $(".call-right-info-zace-second").show();
                $(".call-right-info").hide();
                $(".lmvt-apply").hide();
                mTaskID = SelectData[0].ID;
                mbool = false;
                //正序
                model.com.showLine();


            });
            //降序
            $("body").delegate("#show-down-asc", "click", function () {

                $("#show-down-asc").hide();
                $("#show-down-desc").show();
                mbool = false;
                //正序
                model.com.showLine();

            });
            //逆序
            $("body").delegate("#show-down-desc", "click", function () {

                $("#show-down-asc").show();
                $("#show-down-desc").hide();
                mbool = true;
                //
                model.com.showLine();

            });

            //呼叫详情显示
            $("body").delegate("#call-info-right", "click", function () {
                var SelectData = $com.table.getSelectionData($("#cby-task-tbody"), "ID", TableShowData);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！");
                    return;
                } else if (SelectData.length > 1) {
                    alert("只能查看一条数据的详情！");
                    return;
                }
                $(".call-right-info-zace-second").hide();
                $(".call-right-info").show();
                $(".lmvt-apply").hide();
                var taskID = SelectData[0].ID;
                model.com.getTreeTask(taskID);

            });
            //呼叫详情隐藏
            $("body").delegate("#cby-hidden-list-zace-second", "click", function () {
                $(".call-right-info-zace-second").hide();
                //$(".femi-tb-checkbox").prop("checked", false);

            });
            $("body").delegate("#cby-hidden-list", "click", function () {
                $(".call-right-info").hide();
                //$(".femi-tb-checkbox").prop("checked", false);

            });
            //全屏事件
            $("body").delegate("#down-menu-screen-magnify", "click", function () {
                if (flag_m == false) {
                    $(".up-info").hide();
                    $("#down-menu-screen-img").attr("src", "../static/images/narrowScreen.png");
                    $("#down-menu-screen-span").html("缩小");
                    $(".down-info").css("height", "100%");

                    flag_m = true;
                } else {
                    $("#down-menu-screen-img").attr("src", "../static/images/fullScreen.png");
                    $("#down-menu-screen-span").html("全屏");
                    $(".up-info").show();
                    $(".down-info").css("height", "50%");
                    flag_m = false;
                }
            });

            //申请图片查看
            $("body").delegate(".image-show", "click", function () {
                var farImg = $(this).parent(),
                    imgObj = {},
                    imgList = [];
                $.each(farImg.children(), function (i, item) {
                    imgObj = $(item).attr("data-source");
                    imgList.push(imgObj);
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

                // $(".zacelmvt-img").attr("src",imgSrc);
                //$(".lmvt-change-photo").css("background", "url(" + imgSrc + ") " + "no-repeat center scroll");
                $(".lmvt-change-photo").css("background", "url(" + imgSrc + ") " + "no-repeat center");
                //0214 $(".lmvt-change-photo").css("background-size", "100%  100%");




                // $.each(SelectData[0].ImageList, function (i, item) {
                //     $(".lmvt-show-photo").append(HTML.img);
                // });

                // $(".lmvt-show-photo .lmvt-img").each(function (i, item) {

                //     $(item).attr("src","/upload/" + SelectData[0].ImageList[i]);
                //     if (i == 0) {
                //         $(item).show();
                //         $(item).attr("data-type", "true");
                //     }

                // });
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
            //表格行的点击事件 为点击事件做checked处理
            $("body").delegate(".femi-tb-scroll table.table tbody tr", "click", function (e) {
                var $this = $(this),
                    $table = $this.closest("table"),
                    checkboxID = $this.find("td[data-title=WID]").attr("data-value");
                if ($this.children('th')[0]) {
                    return false;
                }

                $(".femi-tb-scroll table.table  tr td input[type=checkbox].femi-tb-checkbox").each(function (i, item) {
                    if (checkboxID == $(item).parent().next().attr("data-value"))
                        return true;
                    else
                        $(item).prop("checked", false);
                })
                $table.find("tbody tr").each(function (i, item) {
                    var $tr = $(this);
                    if (checkboxID == $tr.find("td[data-title=WID]").attr("data-value"))
                        return true;
                    else {
                        if (!($tr.attr("data-color"))) {

                            $tr.css('background-color', '');
                        } else {

                            var colorPro = $tr.attr("data-color");
                            $tr.css('background-color', colorPro);
                        }
                    }
                });

            });
            //表格行的点击事件 为点击checked做处理
            $("body").delegate(".femi-tb-scroll table.table tr td input[type=checkbox].femi-tb-checkbox", "click", function (e) {
                var $this = $(this),
                    $table = $this.closest("table"),
                    checkboxID = $this.parent().parent().find("td[data-title=WID]").attr("data-value");

                $(".femi-tb-scroll table.table  tr td input[type=checkbox].femi-tb-checkbox").each(function (i, item) {
                    if (checkboxID == $(item).parent().next().attr("data-value"))
                        return true;
                    else
                        $(item).prop("checked", false);
                })
                $table.find("tbody tr").each(function (i, item) {
                    var $tr = $(this);
                    if (checkboxID == $tr.find("td[data-title=WID]").attr("data-value"))
                        return true;
                    else {
                        if (!($tr.attr("data-color"))) {

                            $tr.css('background-color', '');
                        } else {

                            var colorPro = $tr.attr("data-color");
                            $tr.css('background-color', colorPro);
                        }
                    }
                });

            });


        },
        run: function () {
            if (flag == false) {
                $("#call-info-taskInformation").hide();
                $("#call-info-cancelInformation").hide();
            }
            if (flag_d == false) {
                $(".down-info").hide();
                $(".up-info").css("height", "100%");
            }
            if (flag_r == false) {
                $(".call-right-info").hide();
            }
            var ZaceuserData = window.parent._UserAll;
            modelUserList = window.parent._UserAll;
            modelUser = {};
            modelDep = {};
            model.com.getDepartment({}, function (res) {
                modelDepart = res.list;

                modelDepartment = {};

                $.each(modelDepart, function (i, item) {
                    modelDepartment[item.ID] = item.Name;
                });
                model.com.getActionType({}, function (a_data) {
                    DataActionType = a_data;

                    model.com.getLevel({}, function (l_data) {
                        DataLevel = l_data;
                    });
                    model.com.getTask({ ApplyID: -1, StationType: -1, StationName: "", StationID: -1, RespondLevel: -1, DisplayBoard: -1, OnSite: -1, Status: 0, ApplicantID: -1, OperatorID: -1, ConfirmID: -1, ShiftID: -1, StartTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date().getTime() - 1 * 30 * 24 * 3600 * 1000), EndTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()), OAGetType: -1 }, function (data) {
                        DataAll = data;

                        $.each(ZaceuserData, function (s_i, s_item) {
                            modelUser[s_item.ID] = s_item.Name;
                        });
                        $.each(ZaceuserData, function (s_i, s_item) {
                            modelDep[s_item.ID] = s_item.Department;
                        });
                        model.com.getPlace({ Active: -1, ProductID: 0, PartID: 0, PlaceType: 1 }, function (resP) {
                            modelPlaceID = {};

                            $.each(resP.list, function (i, item) {
                                modelPlaceID[item.ID] = item.Code + "/" + item.Name;
                            });
                            model.com.getFPCPartPoint({ FactoryID: 0, BusinessUnitID: 0, ProductTypeID: 0 }, function (resP) {

                                modelStation = {};
                                $.each(resP.list, function (i, item) {
                                    modelStation[item.Code] = item.Code + "/" + item.Name;
                                });
                            });

                        });
                        if (DataAll.list.length == 0) {
                            // alert("当前没有异常任务！！！");
                        }
                        else {
                            model.com.dealDefaultData(DataAll.list);
                        }
                        model.com.refreshData(DataAll);

                    });
                });




                $('.femi-form-date').datetimepicker({
                    format: 'yyyy-mm-dd',
                    todayBtn: 1,
                    autoclose: 1,
                    todayHighlight: 1,
                    startView: 2,
                    minView: 2,
                    forceParse: 1
                });
            });
        },
        com: {
            showLine: function () {
                $com.app.loading();
                model.com.postTree({
                    TaskID: mTaskID,
                    IsReverse: mbool
                }, function (data) {
                    $("#mProcess_moudle-second").show();
                    $("#mProcess_moudle-second").html("");
                    var _list = data.list;

                    for (var index = 0; index < data.list.length - 1; index++) {
                        var _tempList = [];
                        var _temp = $com.util.Clone(Temp);
                        if (data.list[index].IsFinish) {
                            _temp.Color = 'green';
                            _temp.Src = '../static/images/checkbox/selected.png';
                            _temp.CreateTime = data.list[index].EditTimeText;
                            _temp.Text = "内容:" + data.list[index].Remark;
                            if (data.list[index].Remark.length < 1) {
                                _temp.Text = "";
                            }

                        } else {
                            _temp.Color = 'gray';
                            _temp.Src = '../static/images/checkbox/unselected.png';
                            _temp.CreateTime = "";
                            _temp.Text = data.list[index].Remark;
                            if (data.list[index].Remark.length < 1) {
                                _temp.Text = "";
                            }
                        }
                        _temp.Status = data.list[index].StatusText;
                        _temp.Creator = "【" + data.list[index].DepartmentName + "】" + data.list[index].UserName;

                        _tempList.push(_temp);
                        $("#mProcess_moudle-second").append($com.util.template(_tempList, HTML.Descfirst));


                    }


                    if (_list[_list.length - 1].IsFinish) {
                        var _tempListSecond = [];
                        var _tempSecond = $com.util.Clone(Temp);
                        _tempSecond.Color = 'green';
                        _tempSecond.Src = '../static/images/checkbox/selected.png';
                        _tempSecond.Status = _list[_list.length - 1].StatusText;
                        _tempSecond.Creator = "【" + _list[_list.length - 1].DepartmentName + "】" + _list[_list.length - 1].UserName;
                        _tempSecond.CreateTime = _list[_list.length - 1].EditTimeText;
                        _tempSecond.Text = "内容:" + _list[_list.length - 1].Remark;
                        if (_list[_list.length - 1].Remark.length < 1) {
                            _tempSecond.Text = "";
                        }
                        _tempListSecond.push(_tempSecond);
                        $("#mProcess_moudle-second").append($com.util.template(_tempListSecond, HTML.DescSecond));
                    } else {
                        var _tempListSecond = [];
                        var _tempSecond = $com.util.Clone(Temp);
                        _tempSecond.Color = 'gray';
                        _tempSecond.Src = '../static/images/checkbox/unselected.png';
                        _tempSecond.Status = _list[_list.length - 1].StatusText;
                        _tempSecond.Creator = "【" + _list[_list.length - 1].DepartmentName + "】" + _list[_list.length - 1].UserName;
                        _tempSecond.CreateTime = "";
                        _tempSecond.Text = _list[_list.length - 1].Remark;
                        if (_list[_list.length - 1].Remark.length < 1) {
                            _tempSecond.Text = "";
                        }
                        _tempListSecond.push(_tempSecond);
                        $("#mProcess_moudle-second").append($com.util.template(_tempListSecond, HTML.DescSecond));

                    }




                    $("#mProcess_moudle-second .D-panel").each(function (i, item) {
                        if (i < $("#mProcess_moudle-second .D-panel").length - 1) {
                            var $this = $(item);
                            $this.find("#mLeft_moudle").find("#second_module").css("height", ($this.find("#mRight_moudleOne").height()) + "px");
                            $this.find("#mRight_moudleOne").css('margin-top', "-" + ($this.find("#mRight_moudleOne").height() + 20) + "px");

                        }

                    });
                    $com.app.loaded();


                });
            },

            showTable: function () {
                $com.app.loading();
                model.com.postTree({
                    TaskID: mTaskID,
                    IsReverse: mbool
                }, function (data) {
                    var _list = data.list;
                    var _tempList = [];
                    for (var index = 0; index < data.list.length; index++) {

                        var _temp = $com.util.Clone(Temp);
                        if (data.list[index].IsFinish) {
                            _temp.Color = 'green';
                            //_temp.Src = '../static/images/checkbox/selected.png';
                            _temp.CreateTime = data.list[index].EditTimeText;
                        } else {
                            _temp.Color = 'gray';
                            // _temp.Src = '../static/images/checkbox/unselected.png';
                            _temp.CreateTime = "";
                        }
                        _temp.Status = data.list[index].StatusText;
                        _temp.Creator = "【" + data.list[index].DepartmentName + "】" + data.list[index].UserName;

                        _tempList.push(_temp);
                        //$("#mProcess_moudle-second").append($com.util.template(_tempList, HTML.Descfirst));


                    }

                    $("#lmvt-apply-tbody").html($com.util.template(_tempList, HTML.TableLinePoint));
                    $("#lmvt-apply-tbody tr").each(function (i, item) {
                        var $this = $(this);
                        var colorName = $this.css("background-color");
                        $this.attr("data-color", colorName);



                    });


                    $com.app.loaded();


                });
            },
            getDepartment: function (data, fn, context) {
                var d = {
                    $URI: "/Department/AllDepartment",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getDepAndName: function (id) {
                var Name = "";
                for (var index = 0; index < modelUserList.length; index++) {
                    if (id == modelUserList[index].ID) {
                        Name = "【" + modelDepartment[modelUserList[index].DepartmentID] + "】" + modelUser[modelUserList[index].ID]
                    };

                }

                return Name;
            },
            postTree: function (data, fn, context) {
                var d = {
                    $URI: "/EXCCallTask/NodeList",
                    $TYPE: "get",
                    $SERVER: "/MESEXC"
                };

                function err() {
                    $com.app.tip('超时,请检查网络!');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            render: function (list) {
                $("#mProcess_moudle").hide();
                if (list.length >= 1) {

                    if (list.length > 1) {
                        $("#mProcess_moudle").show();
                        $("#mProcess_moudle").html("");
                        if (list[list.length - 1].ActionList.length > 0) {
                            var _listLast = list[list.length - 1].ActionList;
                            for (var j = _listLast.length - 1; j >= 0; j--) {
                                var _tempListdetaillast = [];
                                var _objDetaillast = $com.util.Clone(_listLast[j]);
                                _objDetaillast.Status = ActionList[_objDetaillast.ActionType];
                                _objDetaillast.CreateTime = $com.util.format("yyyy-MM-dd hh:mm", _objDetaillast.CreateTime)
                                _objDetaillast.Creator = model.com.getDepAndName(_objDetaillast.OperatorID);
                                _tempListdetaillast.push(_objDetaillast);
                                $("#mProcess_moudle").append($com.util.template(_tempListdetaillast, HTML.module));
                            }
                        }
                        for (var index = list.length - 2; index >= 0; index--) {
                            //   if(list[list.length - 1].ActionList.length>0){
                            if (!(list[index].Status == 5 && list[index].ActionList.length == 0)) {
                                var _tempList = [];
                                var _obj = $com.util.Clone(list[index]);
                                _obj.Status = STATUS[_obj.Status];
                                _obj.CreateTime = $com.util.format("yyyy-MM-dd hh:mm", _obj.EditTime)
                                _obj.Creator = model.com.getDepAndName(_obj.OperatorID);
                                _tempList.push(_obj);
                                if (_obj.ActionList.length < 2) {
                                    //主流程
                                    $("#mProcess_moudle").append($com.util.template(_tempList, HTML.module));
                                }
                                //处理详情
                                if (_obj.ActionList.length > 0) {
                                    if (_obj.ActionList.length >= 1) {
                                        for (var j = _obj.ActionList.length - 1; j >= 0; j--) {
                                            var _tempListdetail = [];
                                            var _objDetail = $com.util.Clone(_obj.ActionList[j]);
                                            _objDetail.Status = ActionList[_objDetail.ActionType];
                                            _objDetail.CreateTime = $com.util.format("yyyy-MM-dd hh:mm", _objDetail.CreateTime)
                                            _objDetail.Creator = model.com.getDepAndName(_objDetail.OperatorID);
                                            _tempListdetail.push(_objDetail);
                                            $("#mProcess_moudle").append($com.util.template(_tempListdetail, HTML.module));
                                        }
                                    }
                                }


                            }




                        }
                    } else {
                        //处理详情
                        if (list[0].ActionList.length > 0) {
                            if (list[0].ActionList.length >= 1) {
                                for (var j = list[0].ActionList.length - 1; j >= 0; j--) {
                                    var _tempListdetail = [];
                                    var _objDetail = $com.util.Clone(list[0].ActionList[j]);
                                    _objDetail.Status = ActionList[_objDetail.ActionType];
                                    _objDetail.CreateTime = $com.util.format("yyyy-MM-dd hh:mm", _objDetail.CreateTime)
                                    _objDetail.Creator = model.com.getDepAndName(_objDetail.OperatorID);
                                    _tempListdetail.push(_objDetail);
                                    $("#mProcess_moudle").append($com.util.template(_tempListdetail, HTML.module));
                                }
                            }
                        }
                    }
                } else {
                    $("#mProcess_moudle").hide();
                }




            },
            getPlace: function (data, fn, context) {
                var d = {
                    $URI: "/FMCWorkspace/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取台位数据失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getFPCPartPoint: function (data, fn, context) {
                var d = {
                    $URI: "/FPCPart/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取工位信息失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getTask: function (data, fn, context) {
                var d = {
                    $URI: "/EXCCallTask/All",
                    $TYPE: "get",
                    $SERVER: "/MESEXC"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getTree: function (data, fn, context) {
                var d = {
                    $URI: "/EXCCallTask/Tree",
                    $TYPE: "get",
                    $SERVER: "/MESEXC"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getLevel: function (data, fn, context) {
                var d = {
                    $URI: "/EXCExceptionType/LevelAll",
                    $TYPE: "get",
                    $SERVER: "/MESEXC"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getActionType: function (data, fn, context) {
                var d = {
                    $URI: "/EXCCallAction/Type",
                    $TYPE: "get",
                    $SERVER: "/MESEXC"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            getTreeTask: function (TaskID) {
                var parms = {
                    TaskID: TaskID,
                    TagValue: -1,
                    DispatchID: -1
                }
                model.com.getTree(parms, function (data) {
                    Datatree = data;
                    model.com.refreshCallData(data);
                    model.com.refreshDealData(data);
                    $(".call-right-info").show();
                    model.com.getAcionList();
                });
                //return Datatree;
            },
            //refreshData:function(data){

            //},
            //处理默认时间轴数据（默认数据)
            dealDefaultData: function (data) {
                var defaultTimeArr = data,
                    _defaultTimeArr = model.com.getOrderTime(defaultTimeArr),
                    _startTime = $com.util.format("yyyy-MM-dd", defaultTimeArr[0].CreateTime),
                    _length = defaultTimeArr.length - 1,
                    _endTime = $com.util.format("yyyy-MM-dd", defaultTimeArr[_length].CreateTime);
                defaultTime = {
                    startTime: _startTime,
                    endTime: _endTime
                };
                var _data = [];
                $.each(data, function (i, item) {
                    _data.push({
                        beginTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(item.CreateTime)),
                        endTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(item.EditTime)),
                        status: item.Status,
                        exceptionTypeName: item.ExceptionTypeName,
                        id: item.ID,
                        color: "#ABB3B8"
                    });
                });
                timeLineShowData = data;
                newtimeLineShowData = timeLineShowData;
                var orderArr = model.com.getOrderTime(_data),
                    length = orderArr.length,
                    days = model.com.getDays(orderArr[0].beginTime, orderArr[length - 1].beginTime);
                //days: 50,//选择的天数
                //showDays:0,//选择显示的天数
                //screenWidth: 0,//屏幕宽度
                //spaceLength: 60,//单位刻度的长度
                //spaceCount:0,//总共多少格
                //startTime: "2019-06-25 15:15:21",//选择开始的时间
                //countTime: 0,//选择的总时长

                dataObj.days = days;
                dataObj.showDays = dataObj.days;
                dataObj.screenWidth = dataObj.contain[0].offsetWidth;
                dataObj.spaceCount = Math.floor(dataObj.screenWidth / dataObj.spaceLength);
                dataObj.startTime = orderArr[0].beginTime;
                dataObj.countTime = (new Date(orderArr[length - 1].beginTime).getTime()) - (new Date(orderArr[0].beginTime).getTime());
                dataObj.oneSpaceTime = dataObj.countTime / dataObj.spaceCount;
                dataObj.oneTimeLenght = (dataObj.screenWidth - dataObj.rectParams.rectWidth) / (dataObj.days * 24 * 60 * 60 * 1000);
                dataObj.canvasParams.width = dataObj.screenWidth;
                dataObj.canvasParams.height = dataObj.contain[0].offsetHeight;

                dataObj.data = orderArr;
                model.com.dealShowData(dataObj.data, dataObj.dataShow);
            },
            //处理更改时间轴的数据(更改数据）
            dealData: function (data, chooseTime) {
                if (data.length == 0) {
                    alert("没有相关查询数据，请重新查询！！！");
                    // 调用组件
                    $("#canvasDiv").html("");
                } else {
                    var _data = [];
                    $.each(data, function (i, item) {
                        _data.push({
                            beginTime: item.CreateTime,
                            endTime: item.EditTime,
                            status: item.Status,
                            exceptionTypeName: item.ExceptionTypeName,
                            id: item.ID,
                            color: "#ABB3B8"
                        });
                    });
                    //填写传递参数
                    var orderArr = model.com.getOrderTime(_data),
                        length = orderArr.length,
                        days = model.com.getDays(orderArr[0].beginTime, orderArr[length - 1].beginTime);
                    dataObj.days = days;
                    dataObj.showDays = chooseTime.longerTime;
                    dataObj.screenWidth = dataObj.contain[0].offsetWidth;

                    var countTime = dataObj.days * 24 * 60 * 60 * 1000,
                        chooseTime = dataObj.showDays * 24 * 60 * 60 * 1000;
                    //轴的长度
                    dataObj.canvasParams.width = dataObj.screenWidth * countTime / chooseTime;
                    dataObj.spaceCount = Math.floor(dataObj.canvasParams.width / dataObj.spaceLength);
                    dataObj.startTime = orderArr[0].beginTime;
                    dataObj.oneTimeLenght = (dataObj.screenWidth - dataObj.rectParams.rectWidth) / (dataObj.showDays * 24 * 60 * 60 * 1000);
                    dataObj.oneSpaceTime = dataObj.spaceLength / dataObj.oneTimeLenght;

                    if (dataObj.canvasParams.width < dataObj.contain[0].offsetWidth) {
                        dataObj.canvasParams.width = dataObj.contain[0].offsetWidth;
                    }
                    dataObj.canvasParams.height = dataObj.contain[0].offsetHeight;
                    dataObj.data = orderArr;
                    model.com.dealShowData(dataObj.data, dataObj.dataShow);
                }
            },

            //处理显示方式 显示时间轴
            dealShowData: function (data, datashow) {
                var showobj = {};
                $.each(data, function (i, item) {
                    $.each(datashow, function (_i, _item) {
                        switch (_item.id) {
                            case 1:
                                _item.num = item.beginTime;
                                break;
                            case 2:
                                _item.num = item.endTime;
                                break;
                            case 3:
                                $.each(statusType, function (s_i, s_item) {
                                    if (item.status == s_item.value) {
                                        _item.num = s_item.name;
                                    }
                                });
                                break;
                            case 4:
                                _item.num = item.exceptionTypeName;
                                break;

                        }
                    });
                    showobj[item.id] = datashow;
                    datashow = [
                        {
                            text: "开始时间: ",
                            num: 0,
                            id: 1
                        },
                        {
                            text: "结束时间: ",
                            num: 0,
                            id: 2
                        },
                        {
                            text: "状态: ",
                            num: 0,
                            id: 3
                        },
                        {
                            text: "异常: ",
                            num: 0,
                            id: 4
                        }
                    ]
                });
                // 调用组件
                $timeLine.show(dataObj, showobj);
                dataObj.aroundArrY = [];
                dataObj.aroundedArrY = [];
                dataObj.aroundedObjY = {};
                dataObj.aroundObjY = {};
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
            //显示任务表
            refreshData: function (data) {
                var _data = data.list,
                    showData = $com.util.Clone(_data),
                    userData = window.parent._UserAll;

                $.each(showData, function (i, item) {
                    item.LastTime = model.com.getHourOrMinorSec(parseInt((new Date(item.EditTime).getTime() - new Date(item.CreateTime).getTime()) / 1000));
                    item.CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(item.CreateTime))
                    item.EditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(item.EditTime));
                    item.WID = i + 1;
                    $.each(userData, function (u_i, u_item) {
                        if (item.ApplicantID == u_item.ID) {
                            item.ApplicantName = u_item.Name;
                        }
                        // if (item.OperatorID == u_item.ID) {
                        //     item.OperatorName = u_item.Name;
                        // }
                    });
                    $.each(statusType, function (s_i, s_item) {
                        if (s_item.value == item.Status) {
                            item.StatusName = s_item.name;
                        }
                    });
                    $.each(DataLevel.list, function (l_i, l_item) {
                        if (l_item.ID == item.RespondLevel) {
                            item.RespondLevelName = l_item.Name;
                        }
                    })

                    //警告
                    if (item.RespondLevel == 3) {
                        item.Color = "#F5B128";

                    }
                    //严重
                    if (item.RespondLevel == 2) {
                        item.Color = "#EB3B3B";

                    }
                    //紧急
                    if (item.RespondLevel == 1) {
                        item.Color = "#C51D1D";

                    }
                    //
                    if (item.RespondLevel == 4) {
                        item.Color = "#1c7171";

                    }
                    //状态
                    if (item.Status == 0) {

                        item.StatusName = "【" + modelDep[item.OperatorID[0]] + "-" + modelUser[item.OperatorID[0]] + "】" + "待处理";

                    } else if (item.Status == 4 || item.Status == 6 || item.Status == 4) {

                        item.StatusName = "【" + modelDep[item.ConfirmID] + "-" + modelUser[item.ConfirmID] + "】" + item.StatusName;
                    }
                    else if (item.Status == 9) {

                        item.StatusName = "【" + modelDep[item.ApplicantID] + "-" + modelUser[item.ApplicantID] + "】" + item.StatusName;
                    }

                    else {

                        item.StatusName = "【" + modelDep[item.OperatorID[0]] + "-" + modelUser[item.OperatorID[0]] + "】" + item.StatusName;
                    }

                    item.OperatorName = "";//操作人
                    for (var index = 0; index < item.OperatorID.length; index++) {
                        if (item.OperatorName.length < 1) {
                            item.OperatorName = modelUser[item.OperatorID[index]];
                        } else {

                            item.OperatorName = item.OperatorName + "," + modelUser[item.OperatorID[index]];

                        }

                    }
                });

                TableShowData = $com.util.Clone(showData);
                showData = showData.reverse();
                $("#cby-task-tbody").html($com.util.template(showData, HTML.TableTaskItemNode));
                $("#cby-task-tbody tr").each(function (i, item) {
                    var $this = $(this);
                    var colorName = $this.css("background-color");
                    $this.attr("data-color", colorName);



                });
            },
            //显示呼叫信息
            refreshCallData: function (data) {

                var callTaskInfoData = data.info.CallTask,
                    callShowData = [],
                    callShowObj = {};

                //1 显示callTask
                //callShowObj.CallID = callTaskInfoData.ID;
                callShowObj.CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', callTaskInfoData.CreateTime);
                callShowObj.OperatorID = callTaskInfoData.ApplicantID;
                $.each(DataUser, function (i, item) {
                    if (callShowObj.OperatorID == 0) {
                        callShowObj.Operator = window.parent.User_Info.Name
                    } else if (item.ID == callShowObj.OperatorID) {
                        callShowObj.Operator = item.Name;
                    }
                });
                callShowObj.ActionType = "发起";
                callShowObj.type = "task";
                callShowData.push(callShowObj);

                callShowObj = {};

                //2 判断是否显示callcancel
                if (data.info.CallCancel && data.info.CallCancel.ID > 0) {
                    var callCancelData = data.info.CallCancel;
                    //1 显示callCancel
                    callShowObj.CallID = callCancelData.ID;
                    callShowObj.CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', callCancelData.CreateTime);
                    callShowObj.ActionTypeID = callCancelData.ActionType;
                    callShowObj.OperatorID = callCancelData.OperatorID;
                    $.each(DataUser, function (i, item) {
                        if (item.ID == callShowObj.OperatorID) {
                            callShowObj.Operator = item.Name;
                        }
                    });
                    callShowObj.type = "cancel";
                    //2 找到callCancel对应的ActionType
                    $.each(DataActionType.list.Result, function (a_i, a_item) {
                        if (callShowObj.ActionTypeID == a_item.ID) {
                            callShowObj.ActionType = a_item.Name;
                        }
                    });
                    callShowData.push(callShowObj);
                    callShowObj = {};
                }

                $("#call-info-all").html($com.util.template(callShowData, HTML.CallItemNode));
            },
            //显示处理信息
            refreshDealData: function (data) {
                var _data = data.info,
                    dataDispatch = _data.CallDispatchList,
                    dealShowData = [],
                    dealShowObj = {},
                    userData = window.parent._UserAll;

                $.each(dataDispatch, function (i, item) {
                    if (!(item.Status == 5 && item.ActionList.length == 0)) {
                        dealShowObj.OperatorID = item.OperatorID;
                        dealShowObj.StatusID = item.Status;
                        dealShowObj.DealID = item.ID;
                        dealShowObj.CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.CreateTime);
                        dealShowData.push(dealShowObj);
                        dealShowObj = {};
                    }
                });
                $.each(dealShowData, function (c_i, c_item) {
                    $.each(userData, function (u_i, u_item) {
                        if (c_item.OperatorID == u_item.ID) {
                            c_item.Operator = u_item.Name;
                        }
                    });
                    $.each(statusType, function (s_i, s_item) {
                        if (c_item.StatusID == s_item.value) {
                            c_item.Status = s_item.name;
                        }
                    });
                });

                $("#call-info-deal").html($com.util.template(dealShowData, HTML.DealItemNode));
            },
            //显示呼叫信息-task的下拉框
            refreshTaskInfoData: function ($class, $that) {
                var dataTask = Datatree.info.CallTask,
                    taskInfoObj = {},
                    taskInfoArr = [];
                //StationNo ExceptionTypeName RespondLevel OnSite DisplayBoard Comment ImageList
                taskInfoObj.StationTypeName = dataTask.StationTypeName;
                taskInfoObj.StationNo = modelStation[dataTask.StationNo];
                taskInfoObj.PlaceName = modelPlaceID[dataTask.PlaceID];
                taskInfoObj.ExceptionTypeName = dataTask.ExceptionTypeName;
                taskInfoObj.RespondLevelID = dataTask.RespondLevel;
                taskInfoObj.OnSiteID = dataTask.OnSite;
                taskInfoObj.DisplayBoardID = dataTask.DisplayBoard;
                taskInfoObj.Comment = dataTask.Comment;
                taskInfoObj.PartNo = dataTask.PartNo;
                //taskInfoObj.ImageList = dataTask.ImageList;
                taskInfoArr.push(taskInfoObj);

                $.each(taskInfoArr, function (i, item) {
                    //是否显示
                    $.each(OnSiteType, function (s_i, s_item) {
                        if (item.OnSiteID == s_item.value) {
                            item.OnSite = s_item.name;
                        }
                    });
                    $.each(DisplayBoardType, function (d_i, d_item) {
                        if (item.DisplayBoardID == d_item.value) {
                            item.DisplayBoard = d_item.name;
                        }
                    });
                    //等级
                    $.each(DataLevel.list, function (l_i, l_item) {
                        if (l_item.ID == item.RespondLevelID) {
                            item.RespondLevel = l_item.Name;
                        }
                    })
                });
                var $show = $class;
                $("." + $show).html($com.util.template(taskInfoArr, HTML.TaskInfoItemNode));

                var imageList = dataTask.ImageList,
                    _imageList = [],
                    imageListObj = {};
                $.each(imageList, function (i_i, i_item) {
                    imageListObj.imageList = i_item;
                    _imageList.push(imageListObj);
                    imageListObj = {};
                });

                var ImageTemplate = '<img src="{{imageList}}" alt="" class="image-show" data-source="{{imageList}}" />',
                    HtmlAllImage = $com.util.template(_imageList, ImageTemplate);
                $that.find(".call-info-item-image").append(HtmlAllImage);

            },
            //显示呼叫信息-call的下拉框
            refreshCallInfoData: function ($class, $that) {
                var callcancelData = Datatree.info.CallCancel,
                    callcancelObj = {},
                    callcancelArr = [];
                if (callcancelData == null) {
                    return false;
                } else {
                    callcancelObj.CancelComment = callcancelData.Comment;
                    //callcancelObj.CancelImageList = callcancelData.ImageList;
                    callcancelArr.push(callcancelObj);
                    var $show = $class;
                    $("." + $show).html($com.util.template(callcancelArr, HTML.CallInfoItemNode));
                }
                var imageList = callcancelData.ImageList,
                    _imageList = [],
                    imageListObj = {};
                $.each(imageList, function (i_i, i_item) {
                    imageListObj.imageList = i_item;
                    _imageList.push(imageListObj);
                    imageListObj = {};
                });
                //<img src="/upload/{{CancelImageList}}" alt="" class="image-show"data-source="{{CancelImageList}}"/>
                var ImageTemplate = '<img src="{{imageList}}" alt="" class="image-show" data-source="{{imageList}}" />',
                    HtmlAllImage = $com.util.template(_imageList, ImageTemplate);
                $that.find(".call-info-item-image-cancel").append(HtmlAllImage);
            },

            getAcionList: function () {
                var CallDispatchList = Datatree.info.CallDispatchList;
                $.each(CallDispatchList, function (d_i, d_item) {
                    var actionList = d_item.ActionList;
                    if (actionList.length != 0) {
                        model.com.refreshFirstDeal(actionList, d_item.ID);
                    };
                });
            },
            //显示处理信息下的第一层ActionList
            refreshFirstDeal: function (ActionList, d_id) {
                var actionObj = {},
                    actionArr = [];
                $.each(ActionList, function (i, item) {
                    actionObj.CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.CreateTime);
                    actionObj.ActionTypeID = item.ActionType;
                    actionObj.OperatorID = item.OperatorID;
                    actionObj.ActionID = item.ID;
                    $.each(DataActionType.list.Result, function (t_i, t_item) {
                        if (t_item.ID == actionObj.ActionTypeID) {
                            actionObj.ActionType = t_item.Name;
                        }
                    });
                    $.each(DataUser, function (u_i, u_item) {
                        if (u_item.ID == actionObj.OperatorID) {
                            actionObj.Operator = u_item.Name;
                        }
                    });
                    actionObj.DisID = d_id;
                    actionArr.push(actionObj);
                    actionObj = {};
                });
                var show = "deal-info-items-first-down" + String(d_id);
                $("#" + show).html($com.util.template(actionArr, HTML.CallItemNode));
            },
            refreshLastDeal: function (d_id, a_id, $that) {
                var data = Datatree.info.CallDispatchList,
                    aData;
                //1 找到当前的actionList
                $.each(data, function (i, item) {
                    if (item.ID == d_id) {
                        $.each(item.ActionList, function (a_i, a_item) {
                            if (a_item.ID == a_id) {
                                aData = a_item;
                            }
                        })
                    }
                });
                //2 渲染数据
                var aObj = {},
                    aArr = [];

                if (aData.Forwarder.length > 0) {
                    aObj.ForwarderName = "";
                    for (var index = 0; index < aData.Forwarder.length; index++) {
                        if (aObj.ForwarderName.length < 1) {
                            aObj.ForwarderName = modelUser[aData.Forwarder[index]];
                        } else {

                            aObj.ForwarderName = aObj.ForwarderName + "," + modelUser[aData.Forwarder[index]];

                        }

                    }
                }
                aObj.CancelComment = aData.Comment;
                //aObj.cancelImageList = aData.ImageList;
                aArr.push(aObj);

                var showID = ".deal-info-items-last-down" + a_id;

                if (aData.Forwarder.length > 0) {
                    $(showID).html($com.util.template(aArr, HTML.ZaceCallInfoItemNode));
                } else {
                    $(showID).html($com.util.template(aArr, HTML.CallInfoItemNode));
                }


                var imageList = aData.ImageList,
                    _imageList = [],
                    imageListObj = {};
                $.each(imageList, function (i_i, i_item) {
                    imageListObj.imageList = i_item;
                    _imageList.push(imageListObj);
                    imageListObj = {};
                });
                //<img src="/upload/{{CancelImageList}}" alt="" class="image-show"data-source="{{CancelImageList}}"/>
                var ImageTemplate = '<img src="{{imageList}}" alt="" class="image-show" data-source="{{imageList}}" />',
                    HtmlAllImage = $com.util.template(_imageList, ImageTemplate);
                $that.find(".call-info-item-image-cancel").append(HtmlAllImage);
            },

            //将时间从小到大排序
            getOrderTime: function (arr) {
                var minTime;
                if (arr[0].beginTime) {
                    for (var i = 0; i < arr.length; i++) {
                        for (var j = i; j < arr.length; j++) {
                            if (new Date(arr[i].beginTime).getTime() > new Date(arr[j].beginTime).getTime()) {
                                minTime = arr[j];
                                arr[j] = arr[i];
                                arr[i] = minTime;
                            }
                        }
                    }
                }
                else if (arr[0].CreateTime) {
                    for (var i = 0; i < arr.length; i++) {
                        for (var j = i; j < arr.length; j++) {
                            if (new Date(arr[i].CreateTime).getTime() > new Date(arr[j].CreateTime).getTime()) {
                                minTime = arr[j];
                                arr[j] = arr[i];
                                arr[i] = minTime;
                            }
                        }
                    }
                }
                return arr;
            },
            //获取时间天数差值
            getDays: function (startTime, endTime) {
                var startTime = new Date($com.util.format("yyyy-MM-dd hh:mm", startTime)).getTime(),
                    endTime = new Date($com.util.format("yyyy-MM-dd hh:mm", endTime)).getTime(),
                    offsetTime = Math.abs(endTime - startTime),
                    offsetDays = Math.ceil(offsetTime / (3600 * 24 * 1e3));
                return offsetDays;
            },

            //筛选时间范围
            filtrateTime: function (timeArr, chooseTime) {
                var newtimeArr = [],
                    startTime = (new Date($com.util.format('yyyy-MM-dd ', chooseTime.startTime))).getTime(),
                    endTime = (new Date($com.util.format('yyyy-MM-dd ', chooseTime.endTime))).getTime();

                $.each(timeArr, function (i, item) {
                    item.CreateTime
                    var createTime = new Date($com.util.format('yyyy-MM-dd ', item.CreateTime)).getTime();
                    if (startTime <= createTime && createTime < endTime) {
                        newtimeArr.push(item);
                    }
                });
                //if (newtimeArr.length == 0) {
                //    //newtimeArr = timeArr;
                //    alert("未找到相关查询！！！");
                //}
                return newtimeArr;
            },
            //获取异常申请单（集合）
            getEXCCallApplyAll: function (data, fn, context) {
                var d = {
                    $URI: "/EXCCallApply/Info",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            GetUserName: function (id) {
                var Name;
                $.each(window.parent._UserAll, function (i, item) {
                    if (item.ID == id) {
                        Name = item.Name;
                        return Name;
                    }
                });
                return Name;
            },
        }
    });

    model.init();

});

