require(['../static/utils/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/timeLine'], function ($jq, $com, $timeLine) {
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
                text: "开始时间",
                num: 0,
                id: 1
            },
            {
                text: "结束时间",
                num: 0,
                id: 2
            },
            {
                text: "状态",
                num: 0,
                id: 3
            },
        ],
        divHeight:600,
        days: 50,//选择的天数
        dayLength: 240,//单位天数的长度
        startTime: "2019-06-25 15:15:21",//选择开始的时间
        endTime: 0,//选择结束的时间
        rectY: 150,
        aroundArrY: [],
        aroundedArrY: [],
        aroundObjY: {},
        canvasParams: {
            height: 800,//canvas的高度
        },
        //时间轴
        rectangleParams: {
            rectangleX: 0,
            rectangleY: 400,
            rectangleHeight: 4,
            rectangleRadius: 2,
            rectangleColor: "#C5C8D1"
        },
        //时间轴刻度
        lineParams: {
            lineX: 30,
            lineY: 400,
            lineHeight: 3,
            lineSpace: 60,
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

        DataAll,
        Datatree,
        DataLevel,
        DataUser = window.parent._UserAll,
        DataActionType,
        DataExceptionType,
        DataStationType,
        TableShowData,
        flag = false,
        flag_deal = false,
        flag_deal_last = false;;

    HTML = {
        TableTaskItemNode: [
            '<tr>',
            '<td style="width: 3px"><input type="checkbox"',
            '	class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td style="min-width: 50px" data-title="OrderID" data-value="{{OrderID}}">{{OrderID}}</td>',
            '<td style="min-width: 50px" data-title="ExceptionTypeID" data-value="{{ExceptionTypeID}}">{{ExceptionTypeName}}</td> ',
            '<td style="min-width: 50px" data-title="StationNo" data-value="{{StationNo}}">{{StationNo}}</td>  ',
            '<td style="min-width: 50px" data-title="StationTypeName" data-value="{{StationTypeName}}"  >{{StationTypeName}}</td>  ',
            '<td style="min-width: 50px" data-title="Comment" data-value="{{Comment}}">{{Comment}}</td>  ',
            '<td style="min-width: 50px" data-title="ApplicantName" data-value="{{ApplicantName}}"  >{{ApplicantName}}</td>  ',
            '<td style="min-width: 50px" data-title="OperatorName" data-value="{{OperatorName}}">{{OperatorName}}</td>  ',
            '<td style="min-width: 80px" data-title="CreateTime" data-value="{{CreateTime}}">{{CreateTime}}</td>  ',
            '<td style="min-width: 50px" data-title="EditTime" data-value="{{EditTime}}">{{EditTime}}</td>  ',
            '<td style="min-width: 50px" data-title="LastTime" data-value="{{LastTime}}">{{LastTime}}</td>  ',
            '<td style="min-width: 50px" data-title="StatusName" data-value="{{StatusName}}">{{StatusName}}</td>    ',
            '</tr>',
        ].join(""),
        CallItemNode: [
            '<li class="call-info-items">',
            '<div class="call-info-items-list">',
            '<div class="call-info-time"><span>{{CreateTime}}</span></div>',
            '<div class="call-info-actiontype"><span>{{ActionType}}</span></div>',
            '<div class="call-info-operator"><span>{{Operator}}</span></div>',
            '<div type="button" class="btn dropdown-toggle"data-toggle="dropdown"data-type="{{type}}"data-dis="{{DisID}}"data-act="{{ActionID}}">',
            '<span class="caret"id="call-info-list">',
            '</span>',
            '</div>',
            '</div>',
            '<ul id="deal-info-items-last-down{{ActionID}}" class="deal-info-items-last-down"></ul>',
            '</li>',
        ].join(""),
        DealItemNode: [
            '<li class="deal-info-items">',
            '<div class="deal-info-items-list">',
            '<div class="deal-info-time"><span>{{CreateTime}}</span></div>',
            '<div class="deal-info-operator"><span>{{Operator}}</span></div>',
            '<div class="deal-info-status"><span>{{Status}}</span></div>',
            '<div class="deal-info-icon" id="deal-firstDown"><span class="caret" data-value="deal-info-items-first-down{{DealID}}"></span></div>',
            '</div>',
            ' <ul id="deal-info-items-first-down{{DealID}}" class="deal-info-items-first-down"></ul>',
            '</li>',
        ].join(""),
        TaskInfoItemNode: [
            '<ul class="call-info-lists" role="menu"aria-labelledby="">',
            '<li class="call-info-item">',
            '<div class="call-info-item-title">异常地点类型</div>',
            '<div class="call-info-item-all">{{StationTypeName}}</div>',
            '</li>',
            '<li class="call-info-item">',
            '<div class="call-info-item-title">异常地点</div>',
            '<div class="call-info-item-all">{{StationNo}}</div>',
            '</li>',
            '<li class="call-info-item">',
            '<div class="call-info-item-title">异常类型</div>',
            '<div class="call-info-item-all">{{ExceptionTypeName}}</div>',
            '</li>',
            '<li class="call-info-item">',
            '<div class="call-info-item-title">异常响应级别</div>',
            '<div class="call-info-item-all">{{RespondLevel}}</div>',
            '</li>',
            '<li class="call-info-item">',
            '<div class="call-info-item-title">是否需要到场</div>',
            '<div class="call-info-item-all">{{OnSite}}</div>',
            '</li>',
            '<li class="call-info-item">',
            '<div class="call-info-item-title">是否在看板上显示</div>',
            '<div class="call-info-item-all">{{DisplayBoard}}</div>',
            '</li>',
            '<li class="call-info-item">',
            '<div class="call-info-item-title">内容备注</div>',
            '<div class="call-info-item-all">{{Comment}}</div>',
            '</li>',
            '<li class="call-info-item">',
            '<div class="call-info-item-title">照片</div>',
            '<img src="/upload/{{ImageList}}" alt="" />',
            '</li>',
            '</ul>',
        ].join(""),
        CallInfoItemNode: [
            '<ul class="call-info-lists" role="menu"aria-labelledby="">',
            '<li class="call-info-item">',
            '<div class="call-info-item-title">内容备注</div>',
            '<div class="call-info-item-all">{{CancelComment}}</div>',
            '</li>',
            '<li class="call-info-item">',
            '<div class="call-info-item-title">照片</div>',
            '<img src="/upload/{{CancelImageList}}" alt="" />',
            '</li>',
            '</ul>',
        ].join("")
    };
    var statusType = [
        {
        name: "默认",
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
    var OnSiteType=[
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
        "ExceptionTypeID|异常类型|ArrayOne",
        "StationID|异常地点|ArrayOne",
        "StartTime|开始时间|Date",
        "EndTime|结束时间|Date",
        "Status|状态|ArrayOne"
        ];
       
        FORMATTRT = {};
        KEYWORD = {};
        TypeSource = {
            Status: [
            {
                name: "默认",
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
            }]
        };

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

    model = $com.Model.create({
        name: 'iPlant.MES',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();
        },
        events: function () {
            //呼叫展开详情
            $("body").delegate("#call-info-list", "click", function () {
                //判断是否显示下拉框
                if (flag == false) {
                      var  type = $(this).parent().attr("data-type");

                    //判断显示的是task还是cancel的下拉框
                    if (type == "task") {
                        model.com.refreshTaskInfoData();
                        $("#call-info-taskInformation").show();
                    } else if (type == "cancel") {
                        model.com.refreshCallInfoData();
                        $("#call-info-cancelInformation").show();
                    }
                    flag = true;
                }
                else if (flag == true) {
                    $("#call-info-taskInformation").hide();
                    $("#call-info-cancelInformation").hide();
                    flag = false;
                }
            });
            //处理信息展开详情
            $("body").delegate("#deal-firstDown span", "click", function () {
                var $id = $(this).attr("data-value");
                if (flag_deal == false) {
                    $("#" + $id).show();
                    $(this).parents(".deal-info-items").css("background-color", "#cccccc21");
                    flag_deal = true;
                } else if (flag_deal == true) {
                    $("#" + $id).hide();
                    $(this).parents(".deal-info-items").css("background-color", "white");
                    flag_deal = false;
                }
            });
            //处理信息操作详情
            //flag_deal_last
            $("body").delegate("#call-info-deal #call-info-list", "click", function () {
                var $d_id = $(this).parent().attr("data-dis");
                    $a_id = $(this).parent().attr("data-act");
                if (flag_deal_last == false) {
                    model.com.refreshLastDeal($d_id, $a_id);
                    $("#deal-info-items-last-down" + $a_id).show();
                    flag_deal_last = true;
                } else if (flag_deal_last == true) {
                    $("#deal-info-items-last-down" + $a_id).hide();
                    flag_deal_last = false;
                }
            })

            //异常任务模糊查询
            $("body").delegate("#cby-search-text-ledger", "change", function () {
                var $this = $(this),
                    value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#cby-task-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#cby-task-tbody"), TableShowData, value, "OrderID");
            });
            //异常任务精准查询
            $("body").delegate("#cby-search-ledger", "click", function () {
                var default_value = {
                    ExceptionTypeID:"",
                    StationID:"",
                    StartTime: $com.util.format('yyyy-MM-dd ', new Date()),
                    EndTime: $com.util.format('yyyy-MM-dd ', new Date()),
                    Status: 0
                };
                $("body").append($com.modal.show(default_value, KEYWORD, "查询", function (rst) {

                    if (!rst || $.isEmptyObject(rst))
                        return;

                    $com.table.filterByConndition($("#cby-task-tbody"), TableShowData, default_value, "OrderID");

                }, TypeSource));
            });
        },
        run: function () {
            if (flag == false) {
                $("#call-info-taskInformation").hide();
                $("#call-info-cancelInformation").hide();
            }

            model.com.getTask({ ApplyID: -1, StationType: -1, StationName: "", StationID: -1, RespondLevel: -1, DisplayBoard: -1, OnSite: -1, Status: -1, ApplicantID: -1, OperatorID: -1, ConfirmID: -1, ShiftID: -1, StartTime: $com.util.format('yyyy-mm-dd', new Date().getTime() - 1 * 12 * 30 * 24 * 3600 * 1000), EndTime: $com.util.format('yyyy-mm-dd', new Date()), OAGetType: -1 }, function (data) {
                DataAll = data;
                model.com.dealData(DataAll);
                model.com.refreshData(DataAll);
               
            });
            model.com.getTree({ TaskID: -1, TagValue: -1, DispatchID: -1 }, function (data) {
                Datatree = data;
                model.com.getActionType({}, function (a_data) {
                    DataActionType = a_data;
                    model.com.getLevel({}, function (l_data) {
                        DataLevel = l_data;
                        model.com.refreshCallData(Datatree);
                        model.com.refreshDealData(Datatree);
                        model.com.getAcionList();
                    });
                });
            });
            model.com.getExceptionType({ RelevancyTaskType: -1, StationType: -1, Name: "", Active: -1 }, function (data) {
                DataExceptionType = data;
            });
            model.com.getStationType({RelevancyType:-1,Name:"",Active:-1}, function (data) {
                DataStationType = data;
            })
        },
        com: {
            getTask: function (data, fn, context) {
                var d = {
                    $URI: "/EXCCallTask/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getTree: function (data, fn, context) {
                var d = {
                    $URI: "/EXCCallTask/Tree",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getLevel: function (data, fn, context) {
                var d = {
                    $URI: "/EXCExceptionType/LevelAll",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getActionType: function (data, fn, context) {
                var d = {
                    $URI: "/EXCCallAction/Type",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getExceptionType: function (data, fn, context) {
                var d = {
                    $URI: "/EXCExceptionType/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getStationType: function (data, fn, context) {
                var d = {
                    $URI: "/EXCStationType/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //处理数据
            dealData: function (data) {
                var _data = [];
                $.each(data.list, function (i, item) {
                    _data.push({
                        beginTime: item.CreateTime,
                        endTime: item.EditTime,
                        status: item.Status,
                        id: item.ID,
                        color: "#ABB3B8"
                    });
                });
                dataObj.data = _data;
                model.com.dealShowData(dataObj.data, dataObj.dataShow);
            },

            // 处理显示数据
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
                                
                        }
                    });
                    showobj[item.id] = datashow;
                    datashow = [
                        {
                            text: "开始时间",
                            num: 0,
                            id: 1
                        },
                        {
                            text: "结束时间",
                            num: 0,
                            id: 2
                        },
                        {
                            text: "状态",
                            num: 0,
                            id: 3
                        }
                    ]
                });
                // 调用组件
                $timeLine.show(dataObj, showobj);
            },
            //显示任务表
            refreshData:function(data){
                var _data = data.list,
                    showData = $com.util.Clone(_data),
                    userData = window.parent._UserAll;

                $.each(showData, function (i, item) {
                    item.LastTime = $com.util.format('hh:mm:ss', new Date(item.EditTime).getTime() - new Date(item.CreateTime).getTime());
                    item.OrderID = i + 1;
                    $.each(userData, function (u_i, u_item) {
                        if (item.ApplicantID == u_item.ID) {
                            item.ApplicantName = u_item.Name;
                        }
                        if (item.OperatorID == u_item.ID) {
                            item.OperatorName = u_item.Operator;
                        }
                    });
                    $.each(statusType, function (s_i, s_item) {
                        if (s_item.value == item.Status) {
                            item.StatusName = s_item.name;
                        }
                    });
                });
                TableShowData = showData;
                $("#cby-task-tbody").html($com.util.template(showData, HTML.TableTaskItemNode));
            },
            //显示呼叫信息
            refreshCallData: function (data) {

                var callCancelData = data.info.CallCancel,
                    callTaskInfoData = data.info.CallTask,
                    callShowData = [],
                    callShowObj = {};

                //1 显示callTask
                //callShowObj.CallID = callTaskInfoData.ID;
                callShowObj.CreateTime = callTaskInfoData.CreateTime;
                callShowObj.OperatorID = callTaskInfoData.OperatorID;
                $.each(DataUser, function (i, item) {
                    if (callShowObj.OperatorID == 0) {
                        callShowObj.Operator = window.parent.User_Info.Name
                    }else if (item.ID == callShowObj.OperatorID) {
                        callShowObj.Operator = item.Name;
                    }
                });
                callShowObj.ActionType = "发起";
                callShowObj.type = "task";
                callShowData.push(callShowObj);

                callShowObj = {};

                //2 判断是否显示callcancel
                if (data.info.CallCancel && data.info.CallCancel.ID > 0) {
                    //1 显示callCancel
                    callShowObj.CallID = callCancelData.ID;
                    callShowObj.CreateTime = callCancelData.CreateTime;
                    callShowObj.ActionTypeID = callCancelData.ActionType;
                    callShowObj.OperatorID = callCancelData.OperatorID;
                    $.each(DataUser, function (i, item) {
                        if (item.ID == callShowObj.OperatorID) {
                            callShowObj.Operator = item.Name;
                        }
                    });
                    callShowObj.type = "cancel";
                    //2 找到callCancel对应的ActionType
                    $.each(DataActionType.list, function (a_i, a_item) {
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
                    dealShowData=[],
                    dealShowObj={},
                    userData = window.parent._UserAll;

                $.each(dataDispatch, function (i, item) {
                    dealShowObj.OperatorID = item.OperatorID;
                    dealShowObj.StatusID = item.Status;
                    dealShowObj.DealID = item.ID;
                    dealShowObj.CreateTime = item.CreateTime;
                    dealShowData.push(dealShowObj);
                    dealShowObj = {};
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
            refreshTaskInfoData: function () {
                var dataTask = Datatree.info.CallTask,
                    taskInfoObj = {},
                    taskInfoArr = [];
                //StationNo ExceptionTypeName RespondLevel OnSite DisplayBoard Comment ImageList
                taskInfoObj.StationTypeName = dataTask.StationTypeName;
                taskInfoObj.StationNo = dataTask.StationNo;
                taskInfoObj.ExceptionTypeName = dataTask.ExceptionTypeName;
                taskInfoObj.RespondLevelID = dataTask.RespondLevel;
                taskInfoObj.OnSiteID = dataTask.OnSite;
                taskInfoObj.DisplayBoardID = dataTask.DisplayBoard;
                taskInfoObj.Comment = dataTask.Comment;
                taskInfoObj.ImageList = dataTask.ImageList;
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
                $("#call-info-taskInformation").html($com.util.template(taskInfoArr, HTML.TaskInfoItemNode));
                
            },
            //显示呼叫信息-call的下拉框
            refreshCallInfoData: function () {
                var callcancelData = Datatree.info.CallCancel,
                    callcancelObj = {},
                    callcancelArr = [];
                callcancelObj.CancelComment = callcancelData.Comment;
                callcancelObj.CancelImageList = callcancelData.ImageList;
                callcancelArr.push(callcancelObj);
                $("#call-info-cancelInformation").html($com.util.template(callcancelArr, HTML.CallInfoItemNode));

            },

            getAcionList:function(){
                var CallDispatchList = Datatree.info.CallDispatchList;
                $.each(CallDispatchList, function (d_i, d_item) {
                    var actionList = d_item.ActionList;
                    if (actionList.length != 0) {
                        model.com.refreshFirstDeal(actionList, d_item.ID);
                    };
                });
            },
            //显示处理信息下的第一层ActionList
            refreshFirstDeal: function (ActionList,d_id) {
                var actionObj = {},
                    actionArr = [];
                $.each(ActionList, function (i, item) {
                    actionObj.CreateTime = item.CreateTime;
                    actionObj.ActionTypeID = item.ActionType;
                    actionObj.OperatorID = item.OperatorID;
                    actionObj.ActionID = item.ID;
                    $.each(DataActionType.list, function (t_i, t_item) {
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
                $("#"+show).html($com.util.template(actionArr, HTML.CallItemNode));
            },
            refreshLastDeal: function (d_id, a_id) {
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

                aObj.CancelComment = aData.Comment;
                aObj.cancelImageList = aData.ImageList;
                aArr.push(aObj);

                var showID = "#deal-info-items-last-down" + a_id;
                $(showID).html($com.util.template(aArr, HTML.CallInfoItemNode));
            },
        }
    });
    
    model.init();

});
    
