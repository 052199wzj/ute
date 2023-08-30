require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/ganttUtilPlan', '../static/utils/js/ganttWeek'], function ($zace, $com, $gantt, $ganttWeek){

    $(function () {


        $(".mouse-move-contain .mouse-move-middle").each(function (i, item) {
            var $this = $(this),
                $contain = $this.closest(".mouse-move-contain"),
                has_expander = isNaN($this.attr("data-expander")) ? 0 : Number($this.attr("data-expander"));
            if (has_expander != 1) {
                $this.prepend(" <div class='mouse-move-expander move-horizontal'> </div>");
                $this.attr("data-expander", 1);
            }


            var _maxH = isNaN($this.attr("data-max-height")) ? 0 : Number($this.attr("data-max-height"));
            var _minH = isNaN($this.attr("data-min-height")) ? 0 : Number($this.attr("data-min-height"));
            var _defaultH = isNaN($this.attr("data-height")) ? 0 : Number($this.attr("data-height"));

            if (_defaultH < _minH)
                _defaultH = _minH;
            if (_defaultH > _maxH)
                _defaultH = _maxH;

            $this.css("height", _defaultH);
            $contain.children(".mouse-move-bottom").css("top", _defaultH);

        });



        $(".mouse-move-contain .mouse-move-left").each(function (i, item) {
            var $this = $(this),
                $contain = $this.closest(".mouse-move-contain"),
                has_expander = isNaN($this.attr("data-expander")) ? 0 : Number($this.attr("data-expander"));
            if (has_expander != 1) {
                $this.prepend(" <div class='mouse-move-expander move-vertical'> </div>");
                $this.attr("data-expander", 1);
            }

            var _maxW = isNaN($this.attr("data-max-width")) ? 0 : Number($this.attr("data-max-width"));
            var _minW = isNaN($this.attr("data-min-width")) ? 0 : Number($this.attr("data-min-width"));
            var _defaultW = isNaN($this.attr("data-width")) ? 0 : Number($this.attr("data-width"));

            if (_defaultW < _minW)
                _defaultW = _minW;
            if (_defaultW > _maxW)
                _defaultW = _maxW;

            $this.css("width", _defaultW);
            $contain.children(".mouse-move-right").css("left", _defaultW);

        });




        $("body").delegate(".mouse-move-contain .mouse-move-expander", "mouseover", function (e) {
            $(this).attr("data-down", 1);
        });

        //鼠标按下事件
        $("body").delegate(".mouse-move-contain .mouse-move-expander", "mousedown", function (e) {

            if (isNaN($(this).attr("data-down")) || Number($(this).attr("data-down")) != 1)
                return;


            $(this).attr("data-y", e.pageY);

            $(this).attr("data-x", e.pageX);

            //按下  动作  1
            $(this).attr("data-action", 1);

            return false;

        });

        //鼠标移动
        $("body").delegate(".mouse-move-contain", "mousemove", function (e) {
            var $contain = [],
                $expander = $(this).find(".mouse-move-expander");
            $expander.each(function (i, item) {

                if (isNaN($(item).attr("data-action")) || Number($(item).attr("data-action")) != 1)
                    return true;

                $contain = $(item).closest(".mouse-move-contain");
                $expander = $(item);
            });

            if (!$contain[0])
                return;


            var _X = e.pageX - Number($expander.attr("data-x"));
            var _Y = e.pageY - Number($expander.attr("data-y"));


            if ($expander.hasClass("move-vertical")) {
                //左右布局
                var destWidth = $contain.children(".mouse-move-left").width() + _X;

                var _maxW = isNaN($contain.children(".mouse-move-left").attr("data-max-width")) ? 0 : Number($contain.children(".mouse-move-left").attr("data-max-width"));
                var _minW = isNaN($contain.children(".mouse-move-left").attr("data-min-width")) ? 0 : Number($contain.children(".mouse-move-left").attr("data-min-width"));

                if (destWidth < _minW)
                    return;

                if (destWidth > _maxW)
                    return;

                $contain.children(".mouse-move-left").css("width", destWidth);
                $contain.children(".mouse-move-right").css("left", destWidth);

            } else if ($expander.hasClass("move-horizontal")) {
                //上下 布局
                var destHeight = $contain.children(".mouse-move-middle").height() + _Y;

                var _maxH = isNaN($contain.children(".mouse-move-middle").attr("data-max-height")) ? 0 : Number($contain.children(".mouse-move-middle").attr("data-max-height"));
                var _minH = isNaN($contain.children(".mouse-move-middle").attr("data-min-height")) ? 0 : Number($contain.children(".mouse-move-middle").attr("data-min-height"));

                if (destHeight < _minH)
                    return;

                if (destHeight > _maxH)
                    return;

                
               
                $contain.children(".mouse-move-bottom").find(".femi-tb-scroll").children(".table").each(function (i, item) {
                    $(item).removeClass("move-table");
                    if ($(item).parent().parent().parent().parent().css('display') != "none")
                        $(item).addClass("move-table");
                })
                var moveDiv = $(".move-table").next();
                moveDiv.css("top", $(".move-table").offset().top + "px");

                $contain.children(".mouse-move-middle").css("height", destHeight);
                $contain.children(".mouse-move-bottom").css("top", destHeight);
            }

            //赋值
            $expander.attr("data-x", e.pageX);
            $expander.attr("data-y", e.pageY);


        });

        //松开
        $(".mouse-move-contain").mouseup(function (e) {

            $(this).find(".mouse-move-expander").attr("data-action", 0);

        });
        //超出界面
        $(".mouse-move-contain").mouseleave(function (e) {
            $(this).find(".mouse-move-expander").attr("data-down", 0);
            $(this).find(".mouse-move-expander").attr("data-action", 0);
        });


    });




    var KEYWORD_condition_LIST,
        KEYWORD_condition,
        FORMATTRT_condition,
        DEFAULT_VALUE_condition,
        TypeSource_condition,

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
        HTML;
    mMaxLoadRate = 1.0;
    tempgrace = false;
    tempCat = false;
    pIndex = 0;
    GpartIndex = 0;
    MShiftID = 0;
    MlineID = MWorkDayID = 1;
    MShiftsDays = 5;
    SelectionList = [];
    MShiftTime = $com.util.format('yyyy-MM-dd ', new Date());
    DataCondition = {};
    DataOrderList = [];
    DataPlanResult = [];
    ganttDate = [];
    TablePartData = [];
    HTML = {

        TableOrderMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td style="display:none" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="LineID" data-value="{{LineID}}" >{{LineID}}</td>',
            '<td data-title="OrderNo" data-value="{{OrderNo}}" >{{OrderNo}}</td>',
            //'<td data-title="Priority" data-value="{{Priority}}" >{{Priority}}</td>',
            '<td data-title="ProductNo" data-value="{{ProductNo}}" >{{ProductNo}}</td>',
             '<td data-title="Priority" data-value="{{Priority}}" >{{Priority}}</td>',
            '<td data-title="StartTime" data-value="{{StartTime}}" >{{StartTime}}</td>',
            '<td data-title="FQTY" data-value="{{FQTY}}" >{{FQTY}}</td>',
            '<td data-title="FQTYDone" data-value="{{FQTYDone}}" >{{FQTYDone}}</td>',
            '<td data-title="FQTYPlaned" data-value="{{FQTYPlaned}}" >{{FQTYPlaned}}</td>',
            '<td data-title="FQTYMargin" data-value="{{FQTYMargin}}" >{{FQTYMargin}}</td>',
            '</tr>',
        ].join(""),
        TablePlanMode: [
            '<tr>',
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


        TableScheduleMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="OrderNo" data-value="{{OrderNo}}" >{{OrderNo}}</td>',
            '<td data-title="ProductNo" data-value="{{ProductNo}}" >{{ProductNo}}</td>',
            '<td data-title="BOMNo" data-value="{{BOMNo}}" >{{BOMNo}}</td>',
            '<td data-title="FQTY" data-value="{{FQTY}}" >{{FQTY}}</td>',
            //'<td data-title="FQTYDone" data-value="{{FQTYDone}}" >{{FQTYDone}}</td>',
            // '<td data-title="FQTYGood" data-value="{{FQTYGood}}" >{{FQTYGood}}</td>',
            //'<td data-title="FQTYPlaned" data-value="{{FQTYPlaned}}" >{{FQTYPlaned}}</td>',
            '<td data-title="FQTYMargin" data-value="{{FQTYMargin}}" >{{FQTYMargin}}</td>',
            '<td data-title="FQTYShift" data-value="{{FQTYShift}}" >{{FQTYShift}}</td>',
            // '<td data-title="Shifts" data-value="{{Shifts}}" >{{Shifts}}</td>',
            '<td data-title="StartTime" data-value="{{StartTime}}" >{{StartTime}}</td>',
            '<td data-title="EndTime" data-value="{{EndTime}}" >{{EndTime}}</td>',
            '<td data-title="WorkHour" data-value="{{WorkHour}}" >{{WorkHour}}</td>',
            '<td data-title="WorkHours" data-value="{{WorkHours}}" >{{WorkHours}}</td>',
            '<td data-title="WorkHoursName" data-value="{{WorkHoursName}}" >{{WorkHoursName}}</td>',
            '</tr>',
        ].join(""),

        TableUserItemNode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="LineName" data-value="{{LineName}}" >{{LineName}}</td>',
            '<td data-title="PartName" data-value="{{PartName}}" >{{PartName}}</td>',
            '<td data-title="OrderNo" data-value="{{OrderNo}}" >{{OrderNo}}</td>',
            '<td data-title="ProductNo"  data-value="{{ProductNo}}" >{{ProductNo}}</td>',
             '<td style="display:none" data-title="TaskLineID" data-value="{{TaskLineID}}" >{{TaskLineID}}</td>',
            '<td data-title="FQTYSum"  data-value="{{FQTYSum}}" >{{FQTYSum}}</td>',
             '<td data-title="Text"  data-value="{{Text}}" >{{Text}}</td>',
            '{{tds}}',
            '</tr>',
        ].join(""),

        thead: [
            '<tr>',
            '<th><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<th data-order="ID"  style="min-width: 50px">序号</td>',
            '<th data-order="LineName" style="min-width: 50px" >产线</td>',
            '<th data-order="PartName" style="min-width: 50px" >工序</td>',
            '<th data-order="OrderNo" style="min-width: 50px" >订单</td>',
            '<th data-order="ProductNo" style="min-width: 50px" >规格</td>',
            '<th data-order="FQTYSum" style="min-width: 50px" >总数</td>',
             '<th data-order="Text" style="min-width: 50px" >排程否</td>',
            '{{ths}}',
            '</tr>',
        ].join(""),
        th: ['<th data-order="{{WorkDate}}" style="min-width: 50px" >{{ColumnText}}</th>'].join(""),
        td: ['<td  class="edit-td" data-title="{{ShiftDate}}"   data-value="{{FQTYShift}}" >{{FQTYShift}}</td>', ].join(""),

    }




    //thead: $com.util.template( {ths: $com.util.template(clounList,th)},thead);


    //    $.each(data,function(i,item){

    //            item.tds=$com.util.template(item.taskPartList,td);

    //    });
    //  tbody:  $com.util.template(data,tr);



    // 排程条件
    $(function () {
        KEYWORD_condition_LIST = [
            "FQTYShift|计划数",
            //"ShiftPeriod|排产精度|ArrayOne",
            "LineID|产线|ArrayOne",
            "WorkDayID|作息|ArrayOne",
            "ShiftTime|排产日期|Date",
            "ShiftDays|排程天数",
             "MaxLoadRate|排班系数",
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
    });
    //item
    $(function () {
        KEYWORD_Level_LISTItem = [
            "StartTime|开始日期|Date",
            "EndTime|结束日期|Date",
        ];
        KEYWORD_LevelItem = {};
        FORMATTRT_LevelItem = {};

        TypeSource_LevelItem = {


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
    });


    model = $com.Model.create({
        name: '岗位',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {

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


            //任务 
            $("body").delegate("#zace-plan-orderPlan", "click", function () {

                $(".zace-orderTaskLine").show();
                $(".zace-orderSchedule").hide();
                $(".zace-orderTablePartShowItem").hide();
                $(".zace-orderTableTableShow").hide();

            });
            //刷新（保存)排程条件
            $("body").delegate("#zace-aotu-conditionZ", "click", function () {
                var suc = $com.propertyGrid.getData($(".zace-pripoty"));
                var _data = suc.data;
                if (Number(_data.MaxLoadRate) < 0.8 || Number(_data.MaxLoadRate) > 2.0) {
                    alert("排班系数范围在0.8-2.0");
                    return false;
                }
                mMaxLoadRate = Number(_data.MaxLoadRate);
                MlineID = Number(_data.LineID);
                MShiftsDays = Number(_data.ShiftDays);
                MWorkDayID = Number(_data.WorkDayID);
                MShiftTime = $com.util.format('yyyy-MM-dd', _data.ShiftTime);
                ganttDate = model.com.GetGanttDay(MShiftTime, MShiftsDays);
                model.com.refresh();
                model.com.refreshC();

            });
            //Pro
            $("body").delegate("#zace-scheduleCondition-orderPlanPro", "click", function () {

                $(".zace-orderTaskLine").hide();
                $(".zace-orderSchedule").show();
                var zlist = [];
                $("#femi-orderScheduleResult-tbody").html($com.util.template(zlist, HTML.TableScheduleMode));
                $(".zace-orderTablePartShow").hide();
                $(".zace-orderTableTableShow").hide();
                $(".lmvt-border").hide();
                $(".zace-condition").show();
                $(".zace-orderAll").show();
            });
            //结果
            $("body").delegate("#zace-scheduleCondition-orderPlan", "click", function () {

                $(".zace-orderTaskLine").hide();
                $(".zace-orderSchedule").show();
                $(".zace-orderTablePartShow").hide();
                $(".zace-orderTableTableShow").hide();
                $("#lmvt-visualized").click();
            });
            $("body").delegate("#zace-aotu-orderPlan", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-orderMakeAll-tbody"), "ID", DataOrderList);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择至少一行订单再试！")
                    return;
                }

                var suc = $com.propertyGrid.getData($(".zace-pripoty"));
                var _data = suc.data;
                if (Number(_data.MaxLoadRate) < 0.8 || Number(_data.MaxLoadRate) > 2.0) {
                    alert("排班系数范围在0.8-2.0");
                    return false;
                }
                if ((conditionChange.MaxLoadRate != Number(_data.MaxLoadRate)) ||
                    (conditionChange.LineID != Number(_data.LineID)) ||
                    (conditionChange.ShiftDays != Number(_data.ShiftDays)) ||
                    (conditionChange.WorkDayID != Number(_data.WorkDayID)) ||
                    (conditionChange.ShiftTime != $com.util.format('yyyy-MM-dd', _data.ShiftTime))) {
                    alert("请先保存排程条件！！！")
                    return false;
                }
                //conditionChange.CheckWorkHours = eval(_data.CheckWorkHours.toLowerCase());
                //conditionChange.CheckShiftHours = eval(_data.CheckShiftHours.toLowerCase());

                var orderList = [];

                //SelectionList = SelectData;
                model.com.postSchedulePlan({
                    data: SelectData,

                    Condition: conditionChange
                }, function (res) {


                    var planList = $com.util.Clone(res.list);
                    ganttData = $com.util.Clone(res.list);
                    DataPlanResult = $com.util.Clone(res.list);
                    for (var i = 0; i < planList.length; i++) {
                        planList[i].WorkHoursName = model.com.getHourOrMinorSec(planList[i].WorkHours);
                    }
                    $.each(planList, function (i, item) {
                        for (var p in item) {
                            if (!FORMATTRT_LevelItem[p])
                                continue;
                            item[p] = FORMATTRT_LevelItem[p](item[p]);
                        }
                    });
                    $("#femi-orderScheduleResult-tbody").html($com.util.template(planList, HTML.TableScheduleMode));
                    $("#lmvt-visualized").click();
                })
            });
            //日计划
            $("body").delegate("#lmvt-order", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-orderScheduleResult-tbody"), "ID", DataPlanResult);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择至少一行周计划再试！")
                    return;
                }

                //var suc = $com.propertyGrid.getData($(".zace-pripoty"));
                //var _data = suc.data;
                conditionChange.MaxLoadRate = mMaxLoadRate;
                //conditionChange.CheckWorkHours = eval(_data.CheckWorkHours.toLowerCase());
                //conditionChange.CheckShiftHours = eval(_data.CheckShiftHours.toLowerCase());

                var orderList = [];

                //SelectionList = SelectData;
                model.com.getGenerateGant({
                    data: SelectData,
                    //ShiftID: 2019061301,
                    Condition: conditionChange
                }, function (res) {


                    var planList = $com.util.Clone(res.info);

                    //ChartData = model.com.getNewEntry(planList);
                    //TablePartData = model.com.getNewEntry(planList);

                    ChartData = $com.util.Clone(res.info);
                    TablePartData = $com.util.Clone(res.info);

                    model.com.refreshTablePro(TablePartData);
                    $("#lmvt-day-gantt").click();

                })
            });
            //订单排序
            $("body").delegate("#zace-sort-orderPlan", "click", function () {
                model.com.getAPSTaskDisplay({
                    data: TablePartData,
                    //ShiftID: 2019061301,
                    Display: 1
                }, function (res) {

                    TablePartData = $com.util.Clone(res.info);
                    ChartData = $com.util.Clone(res.info);
                    model.com.refreshTablePro(TablePartData);
                    $("#lmvt-day-gantt").click();

                })



            });
            //工序排序
            $("body").delegate("#zace-sort-partPlan", "click", function () {
                model.com.getAPSTaskDisplay({
                    data: TablePartData,
                    //ShiftID: 2019061301,
                    Display: 2
                }, function (res) {

                    TablePartData = $com.util.Clone(res.info);
                    ChartData = $com.util.Clone(res.info);
                    model.com.refreshTablePro(TablePartData);
                    $("#lmvt-day-gantt").click();

                })




            });

            //物料信息
            $("body").delegate("#zace-material-info", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-orderScheduleResult-tbody"), "ID", DataPlanResult);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择至少一行数据再试！")
                    return;
                }

                model.com.getMaterialTask({
                    data: SelectData,


                }, function (res) {

                    var materialList = res.list;

                })
            });
            //保存
            $("body").delegate("#zace-orderScheduleResult-savePro", "click", function () {

                if (!confirm("确认保存计划吗？")) {
                    return false;
                }
                model.com.saveSchedulePlan({
                    data: TablePartData,
                    ShiftID: MShiftID,
                    // Condition: conditionChange
                }, function (res) {

                    alert("保存成功");
                    model.com.refresh();
                    ChartData = TablePartData;
                    $("#lmvt-day-gantt").click();

                    $("#zace-plan-orderPlan").click();

                    $(".lmvt-border").hide();
                    $(".zace-condition").show();
                    $(".zace-orderAll").show();
                })
            });
            //修改
            $("body").delegate("#zace-orderScheduleResult-edit", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-orderScheduleResult-tbody"), "ID", DataPlanResult);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                var default_value = {
                    FQTYShift: SelectData[0].FQTYShift,
                };

                $("body").append($com.modal.show(default_value, KEYWORD_condition, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    if (Number(rst.FQTYShift) < 0 || Number(rst.FQTYShift) > SelectData[0].FQTYMargin) {
                        alert("数量输入有误！！！");
                        return false;
                    }
                    SelectData[0].FQTYShift = Number(rst.FQTYShift);
                    SelectData[0].WorkHours = SelectData[0].FQTYShift * SelectData[0].WorkHour;
                    var planList = $com.util.Clone(DataPlanResult);
                    for (var i = 0; i < planList.length; i++) {
                        planList[i].WorkHoursName = model.com.getHourOrMinorSec(planList[i].WorkHours);
                    }
                    $.each(planList, function (i, item) {
                        for (var p in item) {
                            if (!FORMATTRT_LevelItem[p])
                                continue;
                            item[p] = FORMATTRT_LevelItem[p](item[p]);
                        }
                    });
                    $("#femi-orderScheduleResult-tbody").html($com.util.template(planList, HTML.TableScheduleMode));
                }, TypeSource_condition));

            });
            ////订单
            //$("body").delegate("#lmvt-order", "click", function () {
            //    $(".lmvt-container-gantt").hide();
            //    $(".zace-condition").show();
            //    $(".zace-orderAll").show();
            //});
            //所有订单
            $("body").delegate("#lmvt-allOrder", "click", function () {
                $(".lmvt-border").hide();
                $(".zace-condition").show();
                $(".zace-orderAll").show();
                var planList = $com.util.Clone(DataPlanResult);
                for (var i = 0; i < planList.length; i++) {
                    planList[i].WorkHoursName = model.com.getHourOrMinorSec(planList[i].WorkHours);
                }
                $.each(planList, function (i, item) {
                    for (var p in item) {
                        if (!FORMATTRT_LevelItem[p])
                            continue;
                        item[p] = FORMATTRT_LevelItem[p](item[p]);
                    }
                });
                $("#femi-orderScheduleResult-tbody").html($com.util.template(planList, HTML.TableScheduleMode));
                $("#lmvt-original").click();
            });

            //周计划
            //侧重table
            $("body").delegate("#lmvt-ontable", "click", function () {
                if (!tempCat) {
                    alert("没有可查看的甘特图");
                    return;
                }
                var top = $(".lmvt-top");
                var buttom = $(".lmvt-buttom");
                $(".zace-bottom-zace").append(buttom);
                $(".zace-bottom-zace").append(top);
                $(".zace-orderPlanCondition").css("height", "30%");
                $(".zace-orderZZZ").css("height", "70%");
                var height = $(".table-week-export").offset().top + "px";
                $(".lmvt-ratio .lmvt-tb-show").css("top", height);

            });
            //侧重gantt
            $("body").delegate("#lmvt-ongantt", "click", function () {
                if (!tempCat) {
                    alert("没有可查看的甘特图");
                    return;
                }
                var top = $(".lmvt-top");
                var buttom = $(".lmvt-buttom");
                $(".zace-bottom-zace").append(top);
                $(".zace-bottom-zace").append(buttom);
                $(".zace-orderPlanCondition").css("height", "70%");
                $(".zace-orderZZZ").css("height", "30%");
                var height = $(".table-week-export").offset().top + "px";
                $(".lmvt-ratio .lmvt-tb-show").css("top", height);
            });
            //返回
            $("body").delegate("#lmvt-original", "click", function () {
                var top = $(".lmvt-top");
                var buttom = $(".lmvt-buttom");
                $(".zace-bottom-zace").append(top);
                $(".zace-bottom-zace").append(buttom);
                $(".zace-orderPlanCondition").css("height", "50%");
                $(".zace-orderZZZ").css("height", "50%");
                var height = $(".table-week-export").offset().top + "px";
                $(".lmvt-ratio .lmvt-tb-show").css("top", height);

            });

            //日计划
            //侧重table
            $("body").delegate("#lmvt-ontable-day", "click", function () {
                if (!tempgrace) {
                    alert("没有可查看的甘特图");
                    return;
                }
                var top = $(".lmvt-top");
                var buttom = $(".lmvt-buttom");
                $(".zace-bottom-zace").append(buttom);
                $(".zace-bottom-zace").append(top);
                $(".zace-orderPlanCondition").css("height", "30%");
                $(".zace-orderZZZ").css("height", "70%");
                var height = $(".table-day-export").offset().top + "px";
                $(".lmvt-ratio .lmvt-tb-show").css("top", height);

            });
            //侧重gantt
            $("body").delegate("#lmvt-ongantt-day", "click", function () {
                if (!tempgrace) {
                    alert("没有可查看的甘特图");
                    return;
                }
                var top = $(".lmvt-top");
                var buttom = $(".lmvt-buttom");
                $(".zace-bottom-zace").append(top);
                $(".zace-bottom-zace").append(buttom);
                $(".zace-orderPlanCondition").css("height", "70%");
                $(".zace-orderZZZ").css("height", "30%");
                var height = $(".table-day-export").offset().top + "px";
                $(".lmvt-ratio .lmvt-tb-show").css("top", height);
            });
            //返回
            $("body").delegate("#lmvt-original-day", "click", function () {
                var top = $(".lmvt-top");
                var buttom = $(".lmvt-buttom");
                $(".zace-bottom-zace").append(top);
                $(".zace-bottom-zace").append(buttom);
                $(".zace-orderPlanCondition").css("height", "50%");
                $(".zace-orderZZZ").css("height", "50%");
                var height = $(".table-day-export").offset().top + "px";
                $(".lmvt-ratio .lmvt-tb-show").css("top", height);

            });
            $("body").delegate("#lmvt-change", "click", function () {
                model.com.getAPSTaskDisplay({
                    data: ChartData,
                    //ShiftID: 2019061301,
                    Display: 1
                }, function (res) {

                    TablePartData = $com.util.Clone(res.info);
                    ChartData = $com.util.Clone(res.info);
                    model.com.refreshTablePro(TablePartData);
                    $("#lmvt-day-gantt").click();

                });
            });
            //甘特图
            $("body").delegate("#lmvt-day-gantt", "click", function () {

                tempgrace = true;
                if (ganttDate.length == 0 || ChartData.length == 0) {
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
                        freedomPx: 500,
                        contextHight: 1500,
                        radius: 5,
                        //是否阶梯呈现
                        ladder: false,
                        tip: {
                            //提示条宽度，高度，行高
                            Text: { tipW: 160, tipH: 170, lineH: 25, titleH: 30 },
                            title: { text: '订单', prop: 'task', visible: true },
                            line: [
                                { text: '物料号', prop: 'ProductNo', visible: true },
                                { text: '开始时间', prop: 'startDate', visible: true },
                                { text: '工段', prop: 'Part', visible: true },
                                { text: '时长', prop: 'time', visible: true },
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

                        fn: function (data, source, cate) {
                            var demo = cate;
                            $.each(cate, function (i, item) {
                                TablePartData.GantPartList[item].StartDate = $com.util.format('yyyy-MM-dd', source[item].startDate);
                                TablePartData.GantPartList[item].StartDate = $com.util.format('yyyy-MM-dd hh:mm:ss', TablePartData.GantPartList[item].StartDate);
                                TablePartData.GantPartList[item].EndDate = $com.util.format('yyyy-MM-dd', new Date(source[item].startDate).getTime() + source[item].time * (24 * 3600000));
                                TablePartData.GantPartList[item].EndDate = $com.util.format('yyyy-MM-dd hh:mm:ss', TablePartData.GantPartList[item].EndDate);
                            });
                            
                            $.each(cate, function (i, item) {
                                ChartData.GantPartList[item].StartDate = $com.util.format('yyyy-MM-dd', source[item].startDate);
                                ChartData.GantPartList[item].StartDate = $com.util.format('yyyy-MM-dd hh:mm:ss', ChartData.GantPartList[item].StartDate);
                                ChartData.GantPartList[item].EndDate = $com.util.format('yyyy-MM-dd', new Date(source[item].startDate).getTime() + source[item].time * (24 * 3600000));
                                ChartData.GantPartList[item].EndDate = $com.util.format('yyyy-MM-dd hh:mm:ss', ChartData.GantPartList[item].EndDate);
                            });

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




                position.series.data.push(ChartData.ColumnList[0].WorkDate);
                position.series.data.push(ChartData.ColumnList[ChartData.ColumnList.length - 1].WorkDate);

                //颜色库


                $.each(ChartData.GantPartList, function (i, item) {
                    position.yAxis.data.push(item.OrderNo);
                    var time = model.com.GetDays(item.StartDate, item.EndDate);
                    position.Task.data.push({
                        task: item.OrderNo,
                        startDate: item.StartDate,
                        time: time,
                        color: "green",
                        Line: item.LineName,
                        Part: item.PartName,
                        ProductNo: item.ProductNo,
                        FQTYPlan: item.FQTYPlan,
                        OrderNo: item.OrderNo,
                        OrderID: item.OrderID,
                        FQTYDone: item.FQTYDone,
                        Locked: item.Locked,
                        GroupID: item.GroupID,
                        TaskLineID: item.TaskLineID
                    });
                });
                //Gant Column width Control:Max=60,Min=30;

                if (conditionChange.WorkCalendarList.length > 0) {
                    position.spacePx = ($(".lmvt-container-gantt").width() - position.freedomPx) / conditionChange.WorkCalendarList.length;
                    if (conditionChange.WorkCalendarList.length == 10) {
                        position.spacePx = ($(".lmvt-container-gantt").width() - position.freedomPx) / (conditionChange.WorkCalendarList.length + 2);
                    }
                    else {
                        if (position.spacePx < 70)
                            position.spacePx = 70;
                        if (position.spacePx > 110)
                            position.spacePx = 110;
                    }
                }

                if (ChartData.ColumnList.length > 0) {
                    position.spacePx = ($(".lmvt-container-gantt").width() - position.freedomPx) / ChartData.ColumnList.length;
                    if (ChartData.ColumnList.length == 10) {
                        position.spacePx = ($(".lmvt-container-gantt").width() - position.freedomPx) / (ChartData.ColumnList.length + 2);
                    }
                    else {
                        if (position.spacePx < 80)
                            position.spacePx = 80;
                        if (position.spacePx > 100)
                            position.spacePx = 100;
                    }

                }


                position.contextHight = 62 + ChartData.GantPartList.length * position.spacePy;

                if (position.contextHight < 300)
                    position.contextHight = $(".lmvt-container-gantt").height();

                //$(".lmvt-container-count-drawing-gantt").css("height", position.contextHight + "px");

                $gantt.install($('.lmvt-gantt'), position, $(".lmvt-container-gantt"), ChartData.ColumnList);

                $gantt.resfushCanvas(position.Task.data);

                $(".lmvt-container-count-drawing").show();

            });

            var fn = function (data, source) {

            };
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
                            Text: { tipW: 160, tipH: 170, lineH: 25, titleH: 30 },
                            title: { text: '订单', prop: 'task', visible: true },
                            line: [
                                { text: '物料号', prop: 'ProductNo', visible: true },
                                { text: '时长', prop: 'time', visible: true },
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


            //双击
            $("body").delegate(".part-plan-div>.table tbody tr td.edit-td", "dblclick", function () {
                var $td = $(this);
                var value = $td.attr("data-value");
                // alert($td.parent().parent().find("tr").length);
                var len = $td.parent().parent().find("tr").length;
                //if ($td.parent().find("input").length > 1)
                //    return false;
                //一个tr 一个input 
                if ($td.parent().parent().find("input").length > len)
                    return false;

                //if (!confirm("确认修改数量吗")) {
                //    return false;
                //}
                pIndex = $td.prevAll().length - 9;
                var zLineName = $td.parent().find("td[data-title=LineName]").attr("data-value");
                var zPartName = $td.parent().find("td[data-title=PartName]").attr("data-value")
                var zOrderNo = $td.parent().find("td[data-title=OrderNo]").attr("data-value")
                var zProductNo = $td.parent().find("td[data-title=ProductNo]").attr("data-value")
                var zTaskLineID = $td.parent().find("td[data-title=TaskLineID]").attr("data-value")
                var _list = TablePartData.GantPartList;
                for (var i = 0; i < _list.length; i++) {
                    if (zLineName == _list[i].LineName &&
                        zPartName == _list[i].PartName &&
                        zOrderNo == _list[i].OrderNo &&
                        zProductNo == _list[i].ProductNo &&
                        zTaskLineID == _list[i].TaskLineID) {
                        GpartIndex = i;
                    }
                }
                $td.html("<input type='number' style='width:60px' value=" + value + " />");
            });


            $("body").delegate(".part-plan-div>.table tbody tr td.edit-td input", "change", function () {
                var $input = $(this);
                var value = Number($input.val());
                if (value < 0) {
                    alert("请输入大于零的整数！！！")
                    return false;
                }
                $input.closest("td").html(value);
                TablePartData.GantPartList[GpartIndex].TaskPartList[pIndex].FQTYShift = value;


                for (var i = 0; i < TablePartData.GantPartList.length; i++) {
                    if (TablePartData.GantPartList[i].TaskPartList && TablePartData.GantPartList[i].TaskPartList.length > 0) {
                        TablePartData.GantPartList[i].FQTYPlan = 0;
                        for (var j = 0; j < TablePartData.GantPartList[i].TaskPartList.length; j++) {
                            TablePartData.GantPartList[i].FQTYPlan += TablePartData.GantPartList[i].TaskPartList[j].FQTYShift;
                        }
                    }
                }
                model.com.refreshTablePro(TablePartData);
            });
            //刷新日计划
            $("body").delegate("#zace-refresh-dayPlan", "click", function () {

                model.com.refreshTablePro(TablePartData);
                ChartData = TablePartData;
                $("#lmvt-day-gantt").click();

            });
            //工序数量
            $("body").delegate("#zace-zzza", "click", function () {

                $(".zace-orderTablePartShowItem").css("width", "400px");
                $(".zace-orderTablePartShow").show();
                $(".zace-orderTablePartShowItem").show();

            });
            //工序
            $("body").delegate("#zace-orderTablePartShowItem-orderPlan", "click", function () {

                $(".zace-orderTablePartShowItem").css("width", "0px");
                $(".zace-orderTablePartShow").show();
                $(".zace-orderTablePartShowItem").hide();

            });

            $("body").delegate("#zace-logout-tableOrder", "click", function () {
                var $table = $(".table-week-export"),
                    fileName = "周计划.xls",
                    Title = "周计划";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });

            });

            $("body").delegate("#zace-logout-tableOrderDay", "click", function () {
                var $table = $(".table-day-export"),
                    fileName = "日计划.xls",
                    Title = "日计划";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });

            });


        },




        run: function () {
            //隐藏工序甘特图按钮。
            $("#lmvt-day-gantt").hide();
            //工段
            model.com.getFPCPartAll({ FactoryID: -1, BusinessUnitID: -1, ProductTypeID: -1, OAGetType: -1 }, function (resW) {
                if (resW && resW.list) {
                    AllPart = resW.list;
                }
            });

            model.com.getFMCLine({ FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0 }, function (resW) {
                if (resW && resW.list) {
                    //DataLinelist = resW.list;
                    $.each(resW.list, function (i, item) {
                        TypeSource_condition.LineID.push({
                            name: item.Name,
                            value: item.ID,

                        });
                    });

                }
                model.com.getFMCWorkDay({}, function (resW) {
                    if (resW && resW.list) {
                        //DataLinelist = resW.list;
                        $.each(resW.list, function (i, item) {
                            TypeSource_condition.WorkDayID.push({
                                name: item.Name,
                                value: item.ID,

                            });
                        });

                    }
                    // MShiftTime = $com.util.format('yyyy-MM-dd ', new Date());
                    var day = new Date(MShiftTime).getDay();
                    if (day == 0) {

                        MShiftTime = model.com.addDays(MShiftTime, 1);

                    } else {

                        MShiftTime = model.com.addDays(MShiftTime, 8 - day);
                    }
                    model.com.setMMM();
                    model.com.refresh();
                    model.com.refreshC();

                });
            });





        },

        com: {

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

            refresh: function () {


                model.com.getSchedulePlan({ workShopID: 1, lineID: MlineID, time: MShiftTime, status: 3 }, function (resP) {

                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var _list = resP.list;
                        DataOrderList = $com.util.Clone(resP.list);
                        $.each(_list, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_condition[p])
                                    continue;
                                item[p] = FORMATTRT_condition[p](item[p]);
                            }
                        });
                        $("#femi-orderMakeAll-tbody").html($com.util.template(_list, HTML.TableOrderMode));
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

                //计划
                model.com.getAPSTaskLineAll({ LineID: MlineID, Status: -1 }, function (resL) {

                    if (!resL)
                        return;
                    if (resL && resL.list) {
                        var _list = $com.util.Clone(resL.list);
                        for (var i = 0; i < _list.length; i++) {
                            var week = _list[i].ShiftID % 100;
                            _list[i].ShiftName = week + "周";
                        }
                        $("#femi-orderScheResult-tbody").html($com.util.template(_list, HTML.TablePlanMode));
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
                        var _listinfo = $com.util.Clone(res.info);
                        DataCondition = $com.util.Clone(res.info);
                        conditionChange = $com.util.Clone(res.info);
                        ganttDate = model.com.GetGanttDay(MShiftTime, MShiftsDays);
                        $com.propertyGrid.show($(".zace-pripoty"), _listinfo, KEYWORD_condition, TypeSource_condition);

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
            //排序模板
            getAPSTaskDisplay: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskLine/ChangeGant",
                    $TYPE: "post"
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
                    $URI: "/SCHShift/CreateShifID",
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
            //计算天数
            GetDays: function (startDate, endDate) {
                var days;
                days = (new Date(endDate) - new Date(startDate)) / 1000 / 60 / 60 / 24;
                return days;
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

            //canvas 画表格
            refreshTable: function (data) {
                var temp = {
                    ID: 0,
                    LineName: "",
                    PartName: "",
                    OrderNo: "",
                    ProductNo: "",
                };
                var tempPro = $com.util.Clone(temp);
                var _ColunmList = [["ID", "序号"], ["LineName", "产线"], ["PartName", "工序"], ["OrderNo", "订单"], ["ProductNo", "规格"]];
                for (var i = 5; i < data[0].length; i++) {
                    var _title = [];
                    _title.push(i);
                    _title.push(data[0][i]);
                    _ColunmList.push(_title);

                    //tempPro.append("",0);
                }
                var $TR_h = $(HTML.thead);
                var $tr_b = $(HTML.TableUserItemNode);

                for (var i = 5; i < _ColunmList.length; i++) {
                    var title = _ColunmList[i][0];
                    var titleText = _ColunmList[i][1];
                    $TR_h.append("<th style='min-width: 50px' data-title='" + title + "'>" + titleText + "</th>")
                    $tr_b.append('<td data-title="' + title + '" data-value="{{' + title + '}}" >{{' + title + '}}</td>')
                }
                var Template = $tr_b.prop("outerHTML");

                var _list = [];
                for (var i = 1; i < data.length; i++) {
                    var tempProPro = $com.util.Clone(tempPro);
                    for (var n = 0; n < _ColunmList.length; n++) {
                        if (n < 5) {
                            tempProPro.ID = data[i][0];
                            tempProPro.LineName = data[i][1];
                            tempProPro.PartName = data[i][2];
                            tempProPro.OrderNo = data[i][3];
                            tempProPro.ProductNo = data[i][4];
                        } else { }


                    }
                    _list.push(tempProPro);
                }
                $("#zace-ceshi").html($TR_h);
                $("#femi-user-tbody").html($com.util.template(_list, Template));


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
        },

    }),

        model.init();
});
