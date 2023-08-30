require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/jquery.treeview'], function ($zace, $com, $tree) {

    var KEYWORD_Level_LIST,
        KEYWORD_Level,
        FORMATTRT_Level,
        DEFAULT_VALUE_Level,
        TypeSource_Level,
        model,
        DataAll,
        DATABasic,
        DataAllConfirmBasic,
        DataAllConfirmChange,
        DataAllConfirm,
        DataAllSearch,
        DATAAllBusiness,
        DATAAllBusinessC,
        HTML;

    var mPartPointTableAllCreate = [];
    var DataAllCreate = [];
    var mPartPointTableSearchCreate = [];
    var DataAllSearchCreate = [];
    var mType = 1;
    var mlevel = 0;
    var mID = 0;
    var mTaskPartID = 0;
    var mStepID = -1;
    var mPartNo = "";
    var DATABasicRecord = [];
    var DataAllSearchRecord = [];
    var DataAllRecord = [];

    var mPartTableAll = [];
    var mPartTableSearch = [];
    var mPartPointTableSearch = [];
    var mPartPointTableAll = [];
    DATAAllBusiness = [];
    DATAAllBusinessC = [];
    DataAll = [];
    var AreaIDList = [];
    DATABasic = [];
    DataAllConfirmBasic = [];
    DataAllConfirmChange = [];
    DataAllConfirm = [];
    DataAllSearch = [];
    TypePart = 1;


    ModeType = 1;//1查询    2生成     3处理审批

    mPartTableAll = [];//工位计划
    mPartPointTableAll = [];//工序计划

    PositionTemp = {
        ID: 0,
        ProductID: 0,
        ProductNo: '',
        PartNo: '',

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
    var mShiftDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()); //时间
    var ShiftStartDate = $com.util.format('yyyy-MM-dd', new Date()) + ' 00:00:00';
    var ShiftEndDate = $com.util.format('yyyy-MM-dd', new Date()) + ' 23:59:59';


    var PartList = [];
    var OrderList = [];
    var TaskPartList = [];

    var DayBool = false;

    _OrderList = [];
    _partList = [];
    _TaskPartList = [];


    HTML = {



        TablePartMode: [
            '<tr data-id="{{ID}}">',
            '<td><input type="checkbox"  data-id="{{ID}}"   class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            //'<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            // '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}" >{{ID}}</td> ',

            '<td data-title="PartNo" data-value="{{PartNo}}" >{{PartNo}}</td>',
            '<td data-title="LineID" data-value="{{LineID}}" >{{LineID}}</td>',
            '<td data-title="AreaID" data-value="{{AreaID}}" >{{AreaID}}</td>',
            '<td data-title="PartID" data-value="{{PartID}}" >{{PartID}}</td>',
            '<td data-title="StepSize" data-value="{{StepSize}}" >{{StepSize}}</td>',
            '<td data-title="StepMaking" data-value="{{StepMaking}}" >{{StepMaking}}</td>',
            '<td data-title="StepFinish" data-value="{{StepFinish}}" >{{StepFinish}}</td>',
            '<td style="" data-title="FinishProgress" data-value="{{FinishProgress}}"><progress max="100" value={{FinishProgress}} style="width: 100px ;height: 15px;"><progress></td>',
            '<td data-title="StepSchedule" data-value="{{StepSchedule}}" >{{StepSchedule}}</td>',
            '<td style="" data-title="ScheduleProgress" data-value="{{ScheduleProgress}}"><progress max="100" value={{ScheduleProgress}} style="width: 100px ;height: 15px;"><progress></td>',
            '</tr>',
        ].join(""),
        TableMode: [
            '<tr data-id="{{ID}}" data-pid="{{TaskPartID}}"  >',
            '<td><input type="checkbox"  {{Checked}} class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  style="display:none" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td data-title="PartNo" data-value="{{PartNo}}" >{{PartNo}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td data-title="PartID" data-value="{{PartID}}" >{{PartID}}</td>',
            '<td data-title="StepID" data-value="{{StepID}}" >{{StepID}}</td>',
            '<td data-title="ReadyTimeText" data-value="{{ReadyTimeText}}" >{{ReadyTimeText}}</td>',
            '<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',
            '</tr>',
        ].join(""),
        TableModeList: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="PartID" data-value="{{PartID}}" >{{PartID}}</td>',
            '<td  style="display:none" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="PartNo" data-value="{{PartNo}}" >{{PartNo}}</td>',

            '</tr>',
        ].join(""),
        TableRecordMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            //'<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',

            '<td data-title="PartNo" data-value="{{PartNo}}" >{{PartNo}}</td>',
            '<td data-title="LineID" data-value="{{LineID}}" >{{LineID}}</td>',
            '<td data-title="PartID" data-value="{{PartID}}" >{{PartID}}</td>',
            '<td data-title="StepID" data-value="{{StepID}}" >{{StepID}}</td>',
            '<td data-title="ShiftID" data-value="{{ShiftID}}" >{{ShiftID}}</td>',
            '<td data-title="OperatorID" data-value="{{OperatorID}}" >{{OperatorID}}</td>',
            '<td data-title="WorkHour" data-value="{{WorkHour}}" >{{WorkHour}}</td>',
            '<td data-title="ReadyTime" data-value="{{ReadyTime}}" >{{ReadyTime}}</td>',
            // '<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',

            '</tr>',
        ].join(""),

        TreeItemNode: [
            '<li data-titie="{{ID}}"  data-value="{{ID}}" >',
            '<span style="vertical-align:top;" data-value="{{ID}}" data-level="{{Level}}" data-order="{{OrderID}}" >{{Name}}</span> ',
            '<ul>{{Items}}',
            '</ul>',
            '</li>',
        ].join(""),

    };
    (function () {
        KEYWORD_Level_LIST = [

            "AreaIDSe|工区|ArrayOne",
            "OrderID|订单|ArrayOne",
            "ProductID|车型|ArrayOne",
            "EmployerID|人员|Array",
            "WorkHour|工时",
            "LineID|修程|ArrayOne",
            "PartID|工位|ArrayOne",
            "StepID|工序|ArrayOne",

            "AreaID|工区|ArrayOne",
            "EmployerID|人员|Array",

            "OperatorID|操作员|ArrayOne",
            "DepartureTime|离厂时间|DateTime",

            "Status|状态|ArrayOne",
            "ReadyTime|派工时间|DateTime",
            "EditTime|时间|DateTime",
            "ShiftDae|日期|Date",

            "ShiftStartDate|开始日期|Date",
            "ShiftEndDate|结束日期|Date",



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
            AreaIDSe: [
                {
                    name: "全部",
                    value: 0
                }
            ],
            OrderID: [],
            LineID: [],
            PartID: [],
            StepID: [],
            AreaID: [],
            OperatorID: [],
            Active: [
                {
                    name: "激活",
                    value: true
                }, {
                    name: "禁用",
                    value: false
                }
            ],
            Status: [
                {
                    name: "未保存",
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
                }],

            ProductID: [],
            EmployerID: [],



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

            //查询工序
            $("body").delegate("#zace-searchZApproval-PlanSearch", "click", function () {

                var $this = $(this),
                    value = $("#zace-search-PlanSearch").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskPlanSearch-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskPlanSearch-tbody"), DataAllSearch, value, "WID");



            });
            var PartAndStepCheckedLock = 0;

            $("body").delegate("#femi-riskLevelPartMake-tbody tr td input[type=checkbox]", 'change', function () {
                if (PartAndStepCheckedLock == 1)
                    return;
                PartAndStepCheckedLock = 1;
                var $this = $(this),
                    wTaskPartID = $this.closest("tr").attr("data-id");
                if (this.checked) {
                    $.each(PartList, function (i, item) {
                        if (item.TaskPartID == wTaskPartID) {
                            item.Checked = "checked";
                            $("#femi-riskLevelMakePlan-tbody tr[data-id=" + item.ID + "] td input[type=checkbox]").prop("checked", true);
                        }
                    })
                    //数据上工位下所有工序全部的checked=true; 根据每一条ID遍历
                    // $("#femi-riskLevelPartMake-tbody tr td input[type=checkbox][data-id="+ID+"]").prop("checked",true);

                } else {
                    //数据上工位下所有工序全部的checked=false;
                    $.each(PartList, function (i, item) {
                        if (item.TaskPartID == wTaskPartID) {
                            item.Checked = "";
                            $("#femi-riskLevelMakePlan-tbody tr[data-id=" + item.ID + "] td input[type=checkbox]").prop("checked", false);
                        }
                    })
                    // $("#femi-riskLevelPartMake-tbody tr td input[type=checkbox][data-id="+ID+"]").prop("checked",false);
                }
                PartAndStepCheckedLock = 0;
            });

            $("body").delegate("#femi-riskLevelMakePlan-tbody tr td input[type=checkbox]", 'change', function () {
                if (PartAndStepCheckedLock == 1)
                    return;
                PartAndStepCheckedLock = 1;
                var $this = $(this),
                    wID = $this.closest("tr").attr("data-id"),
                    wTaskPartID = $this.closest("tr").attr("data-pid");

                var wCheckStatus = 0;
                if (this.checked) {
                    wCheckStatus = 2;
                    //数据的checked=true;
                    $.each(PartList, function (i, item) {
                        if (item.TaskPartID == wTaskPartID) {
                            if (item.ID == wID) {
                                item.Checked = "checked";
                            }
                            if (!item.Checked || item.Checked != "checked") {
                                wCheckStatus = 1;
                            }

                        }
                    });

                } else {
                    wCheckStatus = 0;
                    //数据的checked=false; 
                    $.each(PartList, function (i, item) {
                        if (item.TaskPartID == wTaskPartID) {
                            if (item.ID == wID) {
                                item.Checked = "";
                            }
                            if (item.Checked && item.Checked == "checked") {
                                wCheckStatus = 1;
                            }
                        }
                    });

                }
                switch (wCheckStatus) {
                    case 0:
                        $("#femi-riskLevelPartMake-tbody tr[data-id=" + wTaskPartID + "] td input[type=checkbox]").prop("indeterminate", false);
                        $("#femi-riskLevelPartMake-tbody tr[data-id=" + wTaskPartID + "] td input[type=checkbox]").prop("checked", false);
                        break;
                    case 1:
                        $("#femi-riskLevelPartMake-tbody tr[data-id=" + wTaskPartID + "] td input[type=checkbox]").prop("checked", false);
                        $("#femi-riskLevelPartMake-tbody tr[data-id=" + wTaskPartID + "] td input[type=checkbox]").prop("indeterminate", true);
                        break;
                    case 2:
                        $("#femi-riskLevelPartMake-tbody tr[data-id=" + wTaskPartID + "] td input[type=checkbox]").prop("indeterminate", false);
                        $("#femi-riskLevelPartMake-tbody tr[data-id=" + wTaskPartID + "] td input[type=checkbox]").prop("checked", true);
                        break;
                    default:
                        break;
                }

                PartAndStepCheckedLock = 0;
            });

            //制作工序
            $("body").delegate("#zace-searchZApproval-MakePlan", "click", function () {

                var $this = $(this),
                    value = $("#zace-search-MakePlan").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevelMakePlan-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevelMakePlan-tbody"), DataAllSearchCreate, value, "WID");



            });



            //审批工序
            $("body").delegate("#zace-searchZApproval-levelZace", "click", function () {

                var $this = $(this),
                    value = $("#zace-search-level").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllSearch, value, "WID");



            });
            //所有工位
            $("body").delegate("#zace-searchZApproval-level-Search", "click", function () {

                var value = $("#zace-search-levelPart").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevelPart-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevelPart-tbody"), mPartTableSearch, value, "ID");



            });

            //制作工位
            $("body").delegate("#zace-searchZApproval-level-SearchMake", "click", function () {

                var value = $("#zace-search-levelPartMake").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevelPartMake-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevelPartMake-tbody"), mPartTableSearch, value, "ID");



            });

            //所有工位
            $("body").delegate("#zace-searchZApproval-level-SearchAudit", "click", function () {

                var value = $("#zace-search-levelPartAudit").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevelPartAudit-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevelPartAudit-tbody"), mPartTableSearch, value, "ID");



            });

            $("body").delegate("#zace-zaceRefresh-level", "click", function () {

                model.com.refresh();

            });

            $("body").delegate("#zace-edit-level", "click", function () {



                var SelectData = [];
                $.each(PartList, function (i, item) {

                    if (item.Status == 10) {
                        SelectData.push(item);
                    }




                });
                if (!SelectData || !SelectData.length || SelectData.length <= 0) {
                    alert("暂无计划可操作！")
                    return;
                }

                for (var i = 0; i < SelectData.length; i++) {

                    $com.util.deleteLowerProperty(SelectData[i]);

                }
                if (!confirm("确定下达日计划吗？")) {
                    return;
                }
                model.com.saveAPSHistory({
                    TaskList: SelectData,
                    OperateType: 7,
                }, function (res) {

                    alert("下达成功");
                    DayBool = true;
                    model.com.refresh();


                })




            });

            $("body").delegate("#zace-edit-submit", "click", function () {
                var SelectData = [];

                $.each(PartList, function (i, item) {

                    if (item.Status == 9) {
                        SelectData.push(item);
                    }




                });
                if (!SelectData || !SelectData.length || SelectData.length <= 0) {
                    alert("暂无计划可操作！")
                    return;
                }

                for (var i = 0; i < SelectData.length; i++) {

                    $com.util.deleteLowerProperty(SelectData[i]);

                }
                if (!confirm("确定审批日计划吗？")) {
                    return;
                }

                model.com.saveAPSHistory({
                    TaskList: SelectData,
                    OperateType: 3,

                }, function (res) {
                    DayBool = true;
                    alert("审批成功");
                    model.com.refresh();

                })









            });
            //zace-edit-submit
            $("body").delegate("#zace-edit-remove", "click", function () {



                var SelectData = [];

                $.each(PartList, function (i, item) {

                    if (item.Status == 9) {
                        SelectData.push(item);
                    }




                });

                if (!SelectData || !SelectData.length || SelectData.length <= 0) {
                    alert("暂无计划可操作！")
                    return;
                }

                for (var i = 0; i < SelectData.length; i++) {

                    $com.util.deleteLowerProperty(SelectData[i]);

                }
                if (!confirm("确定驳回日计划吗？")) {
                    return;
                }
                model.com.saveAPSHistory({
                    TaskList: SelectData,
                    OperateType: 4,

                }, function (res) {
                    DayBool = true;
                    alert("驳回成功");
                    model.com.refresh();


                })




            });

            $("body").delegate("#zace-editSave-MakePlanAu", "click", function () {


                var SelectData = [];

                $.each(PartList, function (i, item) {

                    if (item.Checked && item.Checked == "checked"&&item.Status == 1) {
                        SelectData.push(item);
                    }




                });


                if (!SelectData || !SelectData.length || SelectData.length <= 0) {
                    alert("请选择数据！！")
                    return;
                }

                for (var i = 0; i < SelectData.length; i++) {

                    $com.util.deleteLowerProperty(SelectData[i]);

                }
                if (!confirm("确定提交日计划吗？")) {
                    return;
                }
                model.com.saveAPSHistory({
                    TaskList: SelectData,
                    OperateType: 2,
                }, function (res) {
                    DayBool = true;
                    alert("提交成功");
                    model.com.refreshPo();


                })




            });

            $("body").delegate("#zace-editSave-MakePlan", "click", function () {

                if (AreaIDList.length > 1) {

                    var default_value = {
                        AreaIDSe: 0,

                    };

                    $("body").append($com.modal.show(default_value, KEYWORD_Level, "工区", function (rst) {


                        if (!rst || $.isEmptyObject(rst))
                            return;


                        var _idArea = Number(rst.AreaIDSe);
                        var SelectData = [];


                        if (_idArea == 0) {
                            SelectData = DataAll;
                        } else {


                            var zaceOrder = 0,
                                zacePartID = 0;
                            for (var k = 0; k < mPartPointTableAllMake.length; k++) {
                                if (_idArea == mPartPointTableAllMake[k]) {
                                    zaceOrder = mPartPointTableAllMake[k].OrderID;
                                    zacePartID = mPartPointTableAllMake[k].PartID;
                                };

                            }
                            $.each(PartList, function (i, item) {

                                if (zaceOrder == item.orderID && zacePartID == item.PartID) {
                                    SelectData.push(item);
                                }


                            });

                        }
                        if (!SelectData || !SelectData.length || SelectData.length <= 0) {
                            alert("暂无计划可操作！")
                            return;
                        }

                        for (var i = 0; i < SelectData.length; i++) {

                            $com.util.deleteLowerProperty(SelectData[i]);

                        }
                        if (!confirm("确定保存日计划吗？")) {
                            return;
                        }
                        model.com.saveAPSHistory({
                            TaskList: SelectData,
                            OperateType: 1,
                        }, function (res) {
                            DayBool = true;
                            alert("保存成功");
                            model.com.refreshPo();


                        })

                    }, TypeSource_Level));



                } else {

                    var SelectData = DataAll;

                    if (!SelectData || !SelectData.length || SelectData.length <= 0) {
                        alert("暂无计划可操作！")
                        return;
                    }

                    for (var i = 0; i < SelectData.length; i++) {

                        $com.util.deleteLowerProperty(SelectData[i]);

                    }
                    if (!confirm("确定保存日计划吗？")) {
                        return;
                    }
                    model.com.saveAPSHistory({
                        TaskList: SelectData,
                        OperateType: 1,
                    }, function (res) {
                        DayBool = true;
                        alert("保存成功");
                        model.com.refreshPo();


                    })

                }



            });



            $("body").delegate("#zace-editSave-levelSummitFor", "click", function () {

                var SelectData = [];
                if (!SelectData || !SelectData.length || SelectData.length <= 0) {
                    alert("暂无计划可操作！")
                    return;
                }

                for (var i = 0; i < SelectData.length; i++) {

                    $com.util.deleteLowerProperty(SelectData[i]);

                }
                if (!confirm("确定终止日计划吗？")) {
                    return;
                }
                model.com.saveAPSHistory({
                    TaskList: SelectData,
                    OperateType: 6,
                }, function (res) {
                    DayBool = true;
                    alert("终止成功");
                    model.com.refresh();


                })








            });
            $("body").delegate("#standardItem li span", "click", function () {


                var $this = $(this);
                mID = Number($this.attr("data-value"));
                mlevel = Number($this.attr("data-level"));

                mOrderID = Number($this.attr("data-order"));
                // alert(mlevel + ',,,,,,' + mID);
                var _list = [];
                if (mlevel == 1) {


                    $('.zzza').show();
                    $('.zzzb').hide();
                    TypePart = 1;
                    model.com.refreshPart(mID, _TaskPartList);//渲染工位

                } else if (mlevel == 2) {

                    $('.zzza').hide();
                    $('.zzzb').show();
                    TypePart = 2;
                    for (var m = 0; m < _TaskPartList.length; m++) {
                        if (mID == _TaskPartList[m].ID) {
                            mID = _TaskPartList[m].PartID;
                        };

                    }
                    model.com.refreshPartPoint(mID, mOrderID, _partList);//渲染工序
                }
                $("#standardItem li span").css("color", "black");
                $this.css("color", "blue");
                return false;

            });
            $("body").delegate("#zace-edit-refreshItem", "click", function () {

                model.com.refreshRecord();

            });

            $("body").delegate("#zace-edit-refresh", "click", function () {

                model.com.refresh();

            });
            $("body").delegate("#zace-day-level", "click", function () {
                var default_value = {
                    ShiftStartDate: $com.util.format('yyyy-MM-dd', new Date(ShiftStartDate)),
                    //ShiftEndDate: $com.util.format('yyyy-MM-dd', new Date(ShiftEndDate))

                };

                $("body").append($com.modal.show(default_value, KEYWORD_Level, "日期", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    ShiftStartDate = $com.util.format('yyyy-MM-dd', new Date(rst.ShiftStartDate)) + ' 00:00:00';
                    ShiftEndDate = $com.util.format('yyyy-MM-dd', new Date(rst.ShiftStartDate)) + ' 23:59:59';


                    model.com.refresh();

                }, TypeSource_Level));



            });

            $("body").delegate("#zace-day-levelMake", "click", function () {
                var default_value = {
                    ShiftStartDate: $com.util.format('yyyy-MM-dd', new Date(ShiftStartDate)),
                    //ShiftEndDate: $com.util.format('yyyy-MM-dd', new Date(ShiftEndDate))

                };

                $("body").append($com.modal.show(default_value, KEYWORD_Level, "日期", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    ShiftStartDate = $com.util.format('yyyy-MM-dd', new Date(rst.ShiftStartDate)) + ' 00:00:00';
                    ShiftEndDate = $com.util.format('yyyy-MM-dd', new Date(rst.ShiftStartDate)) + ' 23:59:59';


                    model.com.refreshPo();

                }, TypeSource_Level));



            });

            $("body").delegate("#femi-riskLevelPart-tbody tr", "dblclick", function () {

                var $this = $(this);
                var $table = $this.closest("table");
                var _id = Number($this.find('td[data-title=ID]').attr('data-value'));

                mOrderID = 0;

                for (var m = 0; m < _TaskPartList.length; m++) {
                    if (_id == _TaskPartList[m].ID) {
                        _id = _TaskPartList[m].PartID;
                        mOrderID = _TaskPartList[m].OrderID;
                    };

                }
                $('.zzzPlanSearch').show();
                $('.zzzbMakePlan').hide();
                $('.zzzb').hide();
                $('.zzza').show();
                $('.zzzaMake').hide();
                $('.zzzaAudit').hide();

                model.com.refreshPartPoint(_id, mOrderID, _partList);//渲染工序
                //1查询    2生成     3处理审批
                // if (ModeType == 1) {
                //     $('.zzzPlanSearch').show();
                //     $('.zzzbMakePlan').hide();
                //     $('.zzzb').hide();

                //     $('.zzza').hide();


                //     model.com.refreshPartPoint(_id, mOrderID, _partList);//渲染工序

                // } else if (ModeType == 2) {
                //     $('.zzzPlanSearch').hide();
                //     $('.zzzbMakePlan').show();
                //     $('.zzzb').hide();

                //     $('.zzza').hide();
                //     // model.com.refreshPart(0,TaskPartList);
                //     model.com.refreshPartPointMake(_id, mOrderID, _partList);//渲染工序
                // } else if (ModeType == 3) {
                //     $('.zzzPlanSearch').hide();
                //     $('.zzzbMakePlan').hide();
                //     $('.zzzb').show();


                //     $('.zzza').hide();

                //     model.com.refreshPartPointAudit(_id, mOrderID, _partList);//渲染工序
                // }


            });


            $("body").delegate("#femi-riskLevelPartMake-tbody tr", "dblclick", function () {

                var $this = $(this);
                var $table = $this.closest("table");
                var _id = Number($this.find('td[data-title=ID]').attr('data-value'));

                mOrderID = 0;

                for (var m = 0; m < _TaskPartList.length; m++) {
                    if (_id == _TaskPartList[m].ID) {
                        _id = _TaskPartList[m].PartID;
                        mOrderID = _TaskPartList[m].OrderID;
                    };

                }
                $('.zzzPlanSearch').hide();
                $('.zzzbMakePlan').show();
                $('.zzzb').hide();
                $('.zzza').hide();
                $('.zzzaMake').show();
                $('.zzzaAudit').hide();

                model.com.refreshPartPointMake(_id, mOrderID, _partList);//渲染工序

            });

            $("body").delegate("#femi-riskLevelPartAudit-tbody tr", "dblclick", function () {

                var $this = $(this);
                var $table = $this.closest("table");
                var _id = Number($this.find('td[data-title=ID]').attr('data-value'));

                mOrderID = 0;

                for (var m = 0; m < _TaskPartList.length; m++) {
                    if (_id == _TaskPartList[m].ID) {
                        _id = _TaskPartList[m].PartID;
                        mOrderID = _TaskPartList[m].OrderID;
                    };

                }
                $('.zzzPlanSearch').hide();
                $('.zzzbMakePlan').hide();
                $('.zzzb').show();
                $('.zzza').hide();
                $('.zzzaMake').hide();
                $('.zzzaAudit').show();

                model.com.refreshPartPointAudit(_id, mOrderID, _partList);//渲染工序

            });

            $("body").delegate("#zace-edit-PlanSearch", "click", function () {


                $('.zzzPlanSearch').hide();
                $('.zzzbMakePlan').hide();
                $('.zzzb').hide();
                $('.zzza').show();

            });

            $("body").delegate("#zace-makePlan-levelZace", "click", function () {


                $('.zzzPlanSearch').hide();
                $('.zzzbMakePlan').show();
                $('.zzzb').hide();
                $('.zzza').hide();
                $('.zzzaMake').show();
                $('.zzzaAudit').hide();
                ModeType = 2;

                model.com.refreshPo();


            });

            $("body").delegate("#zace-searchAudit-levelZace", "click", function () {


                $('.zzzPlanSearch').hide();
                $('.zzzbMakePlan').hide();
                $('.zzzb').show();
                $('.zzza').hide();
                $('.zzzaMake').hide();
                $('.zzzaAudit').show();
                ModeType = 3;
                model.com.refreshPoAudit();



            });

            $("body").delegate("#zace-searchAudit-AllZace", "click", function () {


                $('.zzzPlanSearch').show();
                $('.zzzbMakePlan').hide();
                $('.zzzb').hide();
                $('.zzza').show();
                $('.zzzaMake').hide();
                $('.zzzaAudit').hide();
                ModeType = 1;


                model.com.refresh();

            });


        },




        run: function () {

            model.com.getFPCProduct({ ProductTypeID: 0, BusinessUnitID: 0 }, function (resP) {
                if (!resP)
                    return;

                $.each(resP.list, function (i, item) {
                    TypeSource_Level.ProductID.push({
                        value: item.ID,
                        name: item.ProductName
                    });
                });

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
                    // 工位
                    model.com.getFPCPart({ FactoryID: 0, BusinessUnitID: 0 }, function (resP) {
                        if (!resP)
                            return;

                        $.each(resP.list, function (i, item) {
                            TypeSource_Level.PartID.push({
                                value: item.ID,
                                name: item.Name
                            });
                        });
                        // 工序
                        model.com.getFPCPartPoint({ FactoryID: 0, BusinessUnitID: 0, ProductTypeID: 0 }, function (resP) {
                            if (!resP)
                                return;

                            $.each(resP.list, function (i, item) {
                                TypeSource_Level.StepID.push({
                                    value: item.ID,
                                    name: item.Name
                                });
                            });
                            //人员
                            model.com.get({ active: 1 }, function (resP) {
                                if (!resP)
                                    return;

                                $.each(resP.list, function (i, item) {
                                    TypeSource_Level.OperatorID.push({
                                        value: item.ID,
                                        name: item.Name
                                    });
                                });
                                model.com.getOMSOrder({}, function (resP) {
                                    if (!resP)
                                        return;

                                    $.each(resP.list, function (i, item) {
                                        TypeSource_Level.OrderID.push({
                                            value: item.ID,
                                            name: item.OrderNo
                                        });
                                    });
                                    model.com.getDepartment({}, function (res) {
                                        if (!res)
                                            res;

                                        $.each(res.list, function (i, item) {
                                            TypeSource_Level.AreaID.push({
                                                value: item.ID,
                                                name: item.Name
                                            });
                                        });
                                        model.com.refresh();
                                    });
                                });

                            });

                        });
                    });

                });


            });


        },

        com: {


            refreshPart: function (id, list) {


                mPartTableAll = [];
                for (var m = 0; m < list.length; m++) {
                    list[m].PartNo = list[m].APSTaskPart.PartNo;
                    list[m].ID = list[m].APSTaskPart.ID;
                    list[m].LineID = list[m].APSTaskPart.LineID;
                    list[m].PartID = list[m].APSTaskPart.PartID;
                    // list[m].StepSize=list[m].APSTaskPart.StepSize;

                    if (list[m].StepSize == 0) {
                        list[m].FinishProgress = 0;
                        list[m].ScheduleProgress = 0;
                    } else {
                        list[m].FinishProgress = Math.floor((Number((list[m].StepFinish / list[m].StepSize)) * 100));
                        list[m].ScheduleProgress = Math.floor((Number((list[m].StepSchedule / list[m].StepSize)) * 100));
                    }


                    // if (id == list[m].OrderID) {
                    //     mPartTableAll.push(list[m]);
                    // };
                    mPartTableAll.push(list[m]);

                }
                var Grade = $com.util.Clone(mPartTableAll);
                mPartTableSearch = [];
                $.each(Grade, function (i, item) {
                    for (var p in item) {
                        if (!FORMATTRT_Level[p])
                            continue;
                        item[p] = FORMATTRT_Level[p](item[p]);
                    }

                });

                mPartTableSearch = $com.util.Clone(Grade);

                $("#femi-riskLevelPart-tbody").html($com.util.template(Grade, HTML.TablePartMode));


            },

            refreshPartAudit: function (id, list) {


                mPartTableAll = [];
                for (var m = 0; m < list.length; m++) {
                    list[m].PartNo = list[m].APSTaskPart.PartNo;
                    list[m].LineID = list[m].APSTaskPart.LineID;
                    list[m].PartID = list[m].APSTaskPart.PartID;
                    // list[m].StepSize=list[m].APSTaskPart.StepSize;

                    if (list[m].StepSize == 0) {
                        list[m].FinishProgress = 0;
                        list[m].ScheduleProgress = 0;
                    } else {
                        list[m].FinishProgress = Math.floor((Number((list[m].StepFinish / list[m].StepSize)) * 100));
                        list[m].ScheduleProgress = Math.floor((Number((list[m].StepSchedule / list[m].StepSize)) * 100));
                    }


                    // if (id == list[m].OrderID) {
                    //     mPartTableAll.push(list[m]);
                    // };
                    mPartTableAll.push(list[m]);

                }
                var Grade = $com.util.Clone(mPartTableAll);
                mPartTableSearch = [];
                $.each(Grade, function (i, item) {
                    for (var p in item) {
                        if (!FORMATTRT_Level[p])
                            continue;
                        item[p] = FORMATTRT_Level[p](item[p]);
                    }

                });

                mPartTableSearch = $com.util.Clone(Grade);

                $("#femi-riskLevel-tbody").html($com.util.template(Grade, HTML.TablePartMode));


            },
            getDepartment: function (data, fn, context) {
                var d = {
                    $URI: "/Department/AllDepartment",
                    $TYPE: "get"
                };

                function err() {

                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },


            //工序审批
            refreshPartPointAudit: function (id, orderID, list) {


                mPartPointTableAll = [];
                for (var m = 0; m < list.length; m++) {
                    if (id == list[m].PartID && orderID == list[m].OrderID) {
                        mPartPointTableAll.push(list[m]);
                    };

                }

                $.each(mPartPointTableAll, function (i, item) {
                    item.WID = i + 1;
                });
                DataAll = $com.util.Clone(mPartPointTableAll);
                var Grade = $com.util.Clone(mPartPointTableAll);
                mPartPointTableSearch = [];
                $.each(Grade, function (i, item) {

                    for (var p in item) {
                        if (!FORMATTRT_Level[p])
                            continue;
                        item[p] = FORMATTRT_Level[p](item[p]);
                    }
                    item.ReadyTimeText = item.ReadyTime;
                    if (new Date(item.ReadyTime) < new Date('2010-1-1')) {
                        item.ReadyTimeText = '-';
                    }

                });
                mPartPointTableSearch = $com.util.Clone(Grade);
                DataAllSearch = $com.util.Clone(Grade);
                $("#femi-riskLevel-tbody").html($com.util.template(Grade, HTML.TableMode));
            },
            //工序制定
            refreshPartPointMake: function (id, orderID, list) {


                mPartPointTableAll = [];
                for (var m = 0; m < list.length; m++) {
                    if (id == list[m].PartID && orderID == list[m].OrderID) {
                        mPartPointTableAll.push(list[m]);
                    };

                }

                $.each(mPartPointTableAll, function (i, item) {
                    item.WID = i + 1;
                });
                DataAll = $com.util.Clone(mPartPointTableAll);
                var Grade = $com.util.Clone(mPartPointTableAll);
                mPartPointTableSearch = [];
                $.each(Grade, function (i, item) {

                    for (var p in item) {
                        if (!FORMATTRT_Level[p])
                            continue;
                        item[p] = FORMATTRT_Level[p](item[p]);
                    }
                    item.ReadyTimeText = item.ReadyTime;
                    if (new Date(item.ReadyTime) < new Date('2010-1-1')) {
                        item.ReadyTimeText = '-';
                    }

                });
                mPartPointTableSearch = $com.util.Clone(Grade);
                DataAllSearch = $com.util.Clone(Grade);
                $("#femi-riskLevelMakePlan-tbody").html($com.util.template(Grade, HTML.TableMode));
            },
            //工序查询
            refreshPartPoint: function (id, orderID, list) {


                mPartPointTableAll = [];
                for (var m = 0; m < list.length; m++) {
                    if (id == list[m].PartID && orderID == list[m].OrderID) {
                        mPartPointTableAll.push(list[m]);
                    };

                }

                $.each(mPartPointTableAll, function (i, item) {
                    item.WID = i + 1;

                });
                DataAll = $com.util.Clone(mPartPointTableAll);
                var Grade = $com.util.Clone(mPartPointTableAll);
                mPartPointTableSearch = [];
                $.each(Grade, function (i, item) {

                    for (var p in item) {
                        if (!FORMATTRT_Level[p])
                            continue;
                        item[p] = FORMATTRT_Level[p](item[p]);
                    }
                    item.ReadyTimeText = item.ReadyTime;
                    if (new Date(item.ReadyTime) < new Date('2010-1-1')) {
                        item.ReadyTimeText = '-';
                    }

                });
                mPartPointTableSearch = $com.util.Clone(Grade);
                DataAllSearch = $com.util.Clone(Grade);
                $("#femi-riskPlanSearch-tbody").html($com.util.template(Grade, HTML.TableMode));
            },
            arryOnea: function (data) {
                var temp = {};
                var arr = [];
                var len = data.length;
                for (var i = 0; i < len; i++) {
                    if (!temp[data[i].AreaID]) {
                        temp[data[i].AreaID] = "abc";
                        arr.push({
                            ID: data[i].AreaID,
                            Name: data[i].Area,
                        });
                    }
                }
                return arr;
            },
            saveAPSHistory: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskStep/Audit",
                    $TYPE: "post",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            renderTree: function (list) {
                //list  ： Type List

                model.com.fullItems(list);

                $("#standardItem").html($com.util.template(list, HTML.TreeItemNode));
                $("#standardItem").treeview({ collapsed: true });
            },
            fullItems: function (list) {

                $.each(list, function (i, item) {

                    model.com.fullItems(item.UnitItemList);

                    item.Items = $com.util.template(item.UnitItemList, HTML.TreeItemNode);


                });
            },
            //查询日计划
            getAPSTaskStepQuery: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskStep/Query",
                    $TYPE: "get",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //创建日计划
            postAPSTaskStepCreate: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskStep/Create",
                    $TYPE: "post",
                    $SERVER: "/MESAPS"
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
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },


            refresh: function () {

                var _dateText = $com.util.format('yyyy-MM-dd', new Date(ShiftStartDate));
                $('.partText').text('(' + _dateText + ')' + '工位查询日计划');
                model.com.getAPSTaskStepQuery({ StartTime: ShiftStartDate, EndTime: ShiftEndDate }, function (resItem) {

                    if (resItem && resItem.list) {


                        if (resItem.list.length > 0) {
                            var ItemList = $com.util.Clone(resItem.list);

                            PartList = $com.util.Clone(resItem.list);
                            OrderList = $com.util.Clone(resItem.OrderList);
                            TaskPartList = $com.util.Clone(resItem.TaskPartList);

                            _OrderList = $com.util.Clone(resItem.OrderList);
                            _TaskPartList = $com.util.Clone(resItem.TaskPartList);
                            _partList = $com.util.Clone(resItem.list);



                            mPartPointTableAll = $com.util.Clone(TaskPartList);
                            _TaskPartList = model.com.getNewPartList(_TaskPartList, _partList);
                            _OrderList = model.com.getNewOrderList(_OrderList, _TaskPartList);
                            // model.com.renderTree(_OrderList);



                            $.each(mPartPointTableAll, function (i, item) {
                                item.WID = i + 1;
                                item.PartNo = item.APSTaskPart.PartNo;
                                item.ID = item.APSTaskPart.ID;
                                item.LineID = item.APSTaskPart.LineID;
                                item.PartID = item.APSTaskPart.PartID;

                                if (item.StepSize == 0) {
                                    item.FinishProgress = 0;
                                    item.ScheduleProgress = 0;
                                } else {
                                    item.FinishProgress = Math.floor((Number((item.StepFinish / item.StepSize)) * 100));
                                    item.ScheduleProgress = Math.floor((Number((item.StepSchedule / item.StepSize)) * 100));
                                }
                            });
                            DataAll = $com.util.Clone(mPartPointTableAll);
                            var Grade = $com.util.Clone(mPartPointTableAll);
                            mPartPointTableSearch = [];
                            $.each(Grade, function (i, item) {

                                for (var p in item) {
                                    if (!FORMATTRT_Level[p])
                                        continue;
                                    item[p] = FORMATTRT_Level[p](item[p]);
                                }
                                item.ReadyTimeText = item.ReadyTime;
                                if (new Date(item.ReadyTime) < new Date('2010-1-1')) {
                                    item.ReadyTimeText = '-';
                                }

                            });
                            mPartPointTableSearch = $com.util.Clone(Grade);
                            DataAllSearch = $com.util.Clone(Grade);
                            $("#femi-riskLevelPart-tbody").html($com.util.template(Grade, HTML.TablePartMode));


                        } else {

                            $("#femi-riskLevelPart-tbody").html($com.util.template([], HTML.TablePartMode));
                            alert('暂无任务！');
                        }



                    }
                });



            },

            refreshPoAudit: function () {

                var _dateText = $com.util.format('yyyy-MM-dd', new Date(ShiftStartDate));
                $('.partText').text('(' + _dateText + ')' + '工位审批日计划');
                model.com.getAPSTaskStepQuery({ StartTime: ShiftStartDate, EndTime: ShiftEndDate, IsAudit: true }, function (resItem) {

                    if (resItem && resItem.list) {


                        if (resItem.list.length > 0) {
                            var ItemList = $com.util.Clone(resItem.list);

                            PartList = $com.util.Clone(resItem.list);
                            OrderList = $com.util.Clone(resItem.OrderList);
                            TaskPartList = $com.util.Clone(resItem.TaskPartList);

                            _OrderList = $com.util.Clone(resItem.OrderList);
                            _TaskPartList = $com.util.Clone(resItem.TaskPartList);
                            _partList = $com.util.Clone(resItem.list);



                            mPartPointTableAllAudit = $com.util.Clone(resItem.TaskPartList);
                            _TaskPartList = model.com.getNewPartList(_TaskPartList, _partList);
                            _OrderList = model.com.getNewOrderList(_OrderList, _TaskPartList);
                            // model.com.renderTree(_OrderList);

                            AreaIDList = [];


                            $.each(mPartPointTableAllAudit, function (i, item) {
                                item.WID = i + 1;
                                item.ID = item.APSTaskPart.ID;
                                item.PartNo = item.APSTaskPart.PartNo;
                                item.LineID = item.APSTaskPart.LineID;
                                item.PartID = item.APSTaskPart.PartID;
                                item.Area = FORMATTRT_Level['AreaID'](item.AreaID);

                                if (item.StepSize == 0) {
                                    item.FinishProgress = 0;
                                    item.ScheduleProgress = 0;
                                } else {
                                    item.FinishProgress = Math.floor((Number((item.StepFinish / item.StepSize)) * 100));
                                    item.ScheduleProgress = Math.floor((Number((item.StepSchedule / item.StepSize)) * 100));
                                }
                            });

                            AreaIDList = model.com.arryOnea(mPartPointTableAllAudit);
                            TypeSource_Level.AreaIDSe.splice(1, TypeSource_Level.AreaIDSe.length - 1);
                            $.each(AreaIDList, function (k, item_k) {
                                TypeSource_Level.AreaIDSe.push({
                                    value: item_k.ID,
                                    name: item_k.Name
                                });
                            });

                            DataAllAudit = $com.util.Clone(mPartPointTableAllAudit);
                            var Grade = $com.util.Clone(mPartPointTableAllAudit);
                            mPartPointTableSearchAudit = [];
                            $.each(Grade, function (i, item) {

                                for (var p in item) {
                                    if (!FORMATTRT_Level[p])
                                        continue;
                                    item[p] = FORMATTRT_Level[p](item[p]);
                                }
                                item.ReadyTimeText = item.ReadyTime;
                                if (new Date(item.ReadyTime) < new Date('2010-1-1')) {
                                    item.ReadyTimeText = '-';
                                }

                            });
                            mPartPointTableSearchAudit = $com.util.Clone(Grade);
                            DataAllSearchAudit = $com.util.Clone(Grade);
                            $("#femi-riskLevelPartAudit-tbody").html($com.util.template(Grade, HTML.TablePartMode));


                        } else {
                            $("#femi-riskLevelPartAudit-tbody").html($com.util.template([], HTML.TablePartMode));
                            alert('暂无审批任务！');
                        }



                    }
                });



            },

            refreshPo: function () {


                var _dateText = $com.util.format('yyyy-MM-dd', new Date(ShiftStartDate));
                $('.partText').text('(' + _dateText + ')' + '工位生成日计划');
                model.com.postAPSTaskStepCreate({ data: ShiftStartDate }, function (resItem) {

                    if (resItem && resItem.list) {


                        if (resItem.list.length > 0) {
                            var ItemList = $com.util.Clone(resItem.list);

                            PartList = $com.util.Clone(resItem.list);
                            OrderList = $com.util.Clone(resItem.OrderList);
                            TaskPartList = $com.util.Clone(resItem.TaskPartList);

                            _OrderList = $com.util.Clone(resItem.OrderList);
                            _TaskPartList = $com.util.Clone(resItem.TaskPartList);
                            _partList = $com.util.Clone(resItem.list);



                            mPartPointTableAllMake = $com.util.Clone(resItem.TaskPartList);
                            _TaskPartList = model.com.getNewPartList(_TaskPartList, _partList);
                            _OrderList = model.com.getNewOrderList(_OrderList, _TaskPartList);
                            // model.com.renderTree(_OrderList);





                            $.each(mPartPointTableAllMake, function (i, item) {
                                item.WID = i + 1;
                                item.ID = item.APSTaskPart.ID;
                                item.PartNo = item.APSTaskPart.PartNo;
                                item.LineID = item.APSTaskPart.LineID;
                                item.PartID = item.APSTaskPart.PartID;
                                item.Area = FORMATTRT_Level['AreaID'](item.AreaID);

                                if (item.StepSize == 0) {
                                    item.FinishProgress = 0;
                                    item.ScheduleProgress = 0;
                                } else {
                                    item.FinishProgress = Math.floor((Number((item.StepFinish / item.StepSize)) * 100));
                                    item.ScheduleProgress = Math.floor((Number((item.StepSchedule / item.StepSize)) * 100));
                                }
                            });
                            AreaIDList = [];
                            AreaIDList = model.com.arryOnea(mPartPointTableAllMake);
                            TypeSource_Level.AreaIDSe.splice(1, TypeSource_Level.AreaIDSe.length - 1);
                            $.each(AreaIDList, function (k, item_k) {
                                TypeSource_Level.AreaIDSe.push({
                                    value: item_k.ID,
                                    name: item_k.Name
                                });
                            });

                            DataAllMake = $com.util.Clone(mPartPointTableAllMake);
                            var Grade = $com.util.Clone(mPartPointTableAllMake);
                            mPartPointTableSearchMake = [];
                            $.each(Grade, function (i, item) {

                                for (var p in item) {
                                    if (!FORMATTRT_Level[p])
                                        continue;
                                    item[p] = FORMATTRT_Level[p](item[p]);
                                }
                                item.ReadyTimeText = item.ReadyTime;
                                if (new Date(item.ReadyTime) < new Date('2010-1-1')) {
                                    item.ReadyTimeText = '-';
                                }

                            });
                            mPartPointTableSearchMake = $com.util.Clone(Grade);
                            DataAllSearchMake = $com.util.Clone(Grade);
                            $("#femi-riskLevelPartMake-tbody").html($com.util.template(Grade, HTML.TablePartMode));


                        } else {
                            $("#femi-riskLevelPartMake-tbody").html($com.util.template([], HTML.TablePartMode));
                            alert('当日无周计划！');
                        }



                    }
                });
            },

            getNewPartList: function (ListPart, LsitPoint) {



                //工序名称itemOne   //itemTwo工位
                $.each(ListPart, function (i, item) {
                    item.Name = item.APSTaskPart.PartName;
                    item.ID = item.APSTaskPart.ID;
                    item.PartID = item.APSTaskPart.PartID;
                    item.OrderID = item.APSTaskPart.OrderID;
                    item.UnitItemList = [];
                    $.each(LsitPoint, function (k, item_k) {
                        item_k.Level = 3;
                        item_k.Name = FORMATTRT_Level['StepID'](item_k.StepID);
                        item_k.UnitItemList = [];
                        if (item.OrderID == item_k.OrderID && item.PartID == item_k.PartID) {
                            item.UnitItemList.push(item_k);
                        }
                    });
                });

                return ListPart;
            },
            getNewOrderList: function (ListOrder, ListPart) {
                //工序名称itemOne   //itemTwo工位
                $.each(ListOrder, function (i, item) {
                    item.Name = item.PartNo;
                    item.Level = 1;
                    item.UnitItemList = [];
                    $.each(ListPart, function (k, item_k) {

                        item_k.Level = 2;
                        item_k.Name = item_k.APSTaskPart.PartName;
                        item_k.ID = item_k.APSTaskPart.ID;
                        item_k.OrderID = item_k.APSTaskPart.OrderID;

                        if (item.ID == item_k.APSTaskPart.OrderID) {
                            item.UnitItemList.push(item_k);
                        }
                    });
                });
                return ListOrder;
            },
            get: function (data, fn, context) {
                var d = {
                    $URI: "/User/All",
                    $TYPE: "get",

                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
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