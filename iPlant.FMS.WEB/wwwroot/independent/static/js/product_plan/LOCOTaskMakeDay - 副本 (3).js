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
        HTML,
        mShiftID;
    SelectedLine = 0;
    mShiftID = 20200101;
    var Status = ['black', 'red', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'red', 'green', 'green'];
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

        TableModePartPoint: [
            '<tr data-id="{{ID}}" data-pid="{{TaskPartID}}"  >',
            '<td style="display:none" ><input type="checkbox"  {{Checked}} class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  style="display:none" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td data-title="PartNo" data-value="{{PartNo}}" >{{PartNo}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td data-title="PartID" data-value="{{PartID}}" >{{PartID}}</td>',
            '<td data-title="StepID" data-value="{{StepID}}" >{{StepID}}</td>',
            '<td data-title="ReadyTimeText" data-value="{{ReadyTimeText}}" >{{ReadyTimeText}}</td>',
            '<td style="color:{{ColorText}}" data-title="Status" data-value="{{Status}}" >{{Status}}</td>',
            '<td  data-title="Remark" data-value="{{Remark}}" >{{Remark}}</td>',
            '</tr>',
        ].join(""),

        TableLiItemNode: [
            '<li data-value="{{value}}" > ',
            '<a href="javascript:;"> ',
            '<span class=" glyphicon glyphicon-ok" aria-hidden="true" >{{name}}</span> ',
            '</a> ',
            '</li> ',
        ].join(""),
        TablePartModePl: [
            '<tr data-id="{{ID}}">',
            '<td style="display:none"><input type="checkbox"  data-id="{{ID}}"   class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            //'<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            // '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}" >{{ID}}</td> ',

            '<td data-title="PartNo" data-value="{{PartNo}}" >{{PartNo}}</td>',
            '<td data-title="LineID" data-value="{{LineID}}" >{{LineID}}</td>',
            '<td data-title="AreaID" data-value="{{AreaID}}" >{{AreaID}}</td>',
            '<td data-title="PartID" data-value="{{PartID}}" >{{PartID}}</td>',
            '<td data-title="StepSize" data-value="{{StepSize}}" >{{StepSize}}</td>',

            '<td data-title="PlanSize" data-value="{{PlanSize}}" >{{PlanSize}}</td>',
            '<td data-title="StepFinish" data-value="{{StepFinish}}" >{{StepFinish}}</td>',
            '<td style="" data-title="FinishProgress" data-value="{{FinishProgress}}"><progress max="100" value={{FinishProgress}} style="width: 100px ;height: 15px;"><progress></td>',
            '<td data-title="StepSchedule" data-value="{{StepSchedule}}" >{{StepSchedule}}</td>',
            '<td style="" data-title="ScheduleProgress" data-value="{{ScheduleProgress}}"><progress max="100" value={{ScheduleProgress}} style="width: 100px ;height: 15px;"><progress></td>',
            '</tr>',
        ].join(""),
        TablePartModePAudit: [
            '<tr data-id="{{ID}}">',
            '<td style="display:none"><input type="checkbox"  data-id="{{ID}}"   class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
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
        TablePartMode: [
            '<tr data-id="{{ID}}">',
            '<td style="display:none"><input type="checkbox"  data-id="{{ID}}"   class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            //'<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            // '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}" >{{ID}}</td> ',

            '<td data-title="PartNo" data-value="{{PartNo}}" >{{PartNo}}</td>',
            '<td data-title="LineID" data-value="{{LineID}}" >{{LineID}}</td>',
            '<td data-title="AreaID" data-value="{{AreaID}}" >{{AreaID}}</td>',
            '<td data-title="PartID" data-value="{{PartID}}" >{{PartID}}</td>',
            '<td data-title="StepSize" data-value="{{StepSize}}" >{{StepSize}}</td>',
            '<td data-title="PlanSize" data-value="{{PlanSize}}" >{{PlanSize}}</td>',
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
            '<td style="color:{{ColorText}}" data-title="Status" data-value="{{Status}}" >{{Status}}</td>',
            '<td  data-title="Remark" data-value="{{Remark}}" >{{Remark}}</td>',
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

            "Remark|备注",



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
                    name: "未排",
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
            //填写备注         
            $("body").delegate("#zace-searchZApproval-MakePlanPencil", "click", function () {


                var SelectData = $com.table.getSelectionData($("#femi-riskLevelMakePlan-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！")
                    return;
                }
                var default_value = {
                    Remark: SelectData[0].Remark.Remark,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "填写备注", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].Remark.Remark = rst.Remark;
                    $com.util.deleteLowerProperty(SelectData[0]);
                    $com.util.deleteLowerProperty(SelectData[0].Remark);


                    model.com.saveAPSStep({
                        data: SelectData[0],

                    }, function (res) {

                        for (var k = 0; k < _partList.length; k++) {
                            if (SelectData[0].ID == _partList[k].ID) {
                                _partList[k].Remark.Remark = SelectData[0].Remark.Remark;
                            };

                        }
                        model.com.refreshPartPointMake(mRefreshID, mOrderID, _partList);//渲染工序     
                        // model.com.refreshPoStep();
                    })



                }, TypeSource_Level));


            });

            $("body").delegate("#femi-riskLevelMakePlan-tbody tr", "dblclick", function () {
                var SelectData = [];

                var $this = $(this);
                var $table = $this.closest("table");
                var _id = Number($this.find('td[data-title=ID]').attr('data-value'));


                for (var index = 0; index < DataAll.length; index++) {
                    if (_id == DataAll[index].ID) {
                        SelectData.push(DataAll[index]);
                    }

                }

                var default_value = {
                    Remark: SelectData[0].Remark.Remark,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "填写备注", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].Remark.Remark = rst.Remark;
                    $com.util.deleteLowerProperty(SelectData[0]);
                    $com.util.deleteLowerProperty(SelectData[0].Remark);


                    model.com.saveAPSStep({
                        data: SelectData[0],

                    }, function (res) {

                        for (var k = 0; k < _partList.length; k++) {
                            if (SelectData[0].ID == _partList[k].ID) {
                                _partList[k].Remark.Remark = SelectData[0].Remark.Remark;
                            };

                        }
                        model.com.refreshPartPointMake(mRefreshID, mOrderID, _partList);//渲染工序     
                        // model.com.refreshPoStep();
                    })



                }, TypeSource_Level));


            });


            $("body").delegate("#zace-searchZApproval-refresh", "click", function () {

                ModeType = 1;
                model.com.refresh();

            });

            $("body").delegate("#zace-searchZApproval-refreshMake", "click", function () {


                ModeType = 2;
                model.com.refreshPo();


            });

            $("body").delegate("#zace-searchZApproval-refreshCommiit", "click", function () {

                ModeType = 3;
                model.com.refreshPoAudit();



            });

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


            //生成数据

            // $("body").delegate("#femi-riskLevelPartMake-tbody tr td input[type=checkbox]", 'change', function () {
            //     if (PartAndStepCheckedLock == 1)
            //         return;
            //     PartAndStepCheckedLock = 1;
            //     var $this = $(this),
            //         wTaskPartID = $this.closest("tr").attr("data-id");
            //     if (this.checked) {
            //         $.each(_partList, function (i, item) {
            //             if (item.TaskPartID == wTaskPartID) {
            //                 item.Checked = "checked";
            //                 $("#femi-riskLevelMakePlan-tbody tr[data-id=" + item.ID + "] td input[type=checkbox]").prop("checked", true);
            //             }
            //         })
            //         //数据上工位下所有工序全部的checked=true; 根据每一条ID遍历
            //         // $("#femi-riskLevelPartMake-tbody tr td input[type=checkbox][data-id="+ID+"]").prop("checked",true);

            //     } else {
            //         //数据上工位下所有工序全部的checked=false;
            //         $.each(_partList, function (i, item) {
            //             if (item.TaskPartID == wTaskPartID) {
            //                 item.Checked = "";
            //                 $("#femi-riskLevelMakePlan-tbody tr[data-id=" + item.ID + "] td input[type=checkbox]").prop("checked", false);
            //             }
            //         })
            //         // $("#femi-riskLevelPartMake-tbody tr td input[type=checkbox][data-id="+ID+"]").prop("checked",false);
            //     }
            //     PartAndStepCheckedLock = 0;
            // });

            $("body").delegate(".zzzbMakePlan .femi-tb-scroll table.table thead tr th input[type=checkbox].femi-tb-checkbox", "change", function (e) {

                if (PartAndStepCheckedLock == 1)
                    return;
                PartAndStepCheckedLock = 1;
                var $this = $(this),
                    wTaskPartID = 0,
                    _CheckNum = 0;
                $("#femi-riskLevelMakePlan-tbody>tr>td>input[type=checkbox]").each(function (k, item_k) {
                    var $item_k = $(item_k),
                        _data_id = $item_k.closest("tr").attr("data-id");

                    if (wTaskPartID <= 0) {
                        wTaskPartID = Number($item_k.closest("tr").attr("data-pid"));
                    }

                    $.each(_partList, function (i, item) {
                        if (item.TaskPartID == wTaskPartID) {
                            if (item.ID != _data_id)
                                return true;

                            if ($this[0].checked && (item.ShiftID <= mShiftID || item.ShiftID == 0)) {
                                item.Checked = "checked";
                                item.ShiftID = mShiftID;
                                _CheckNum++;
                            } else if (item.ShiftID <= mShiftID) {
                                item.Checked = "";
                                item.ShiftID = 0;
                            }
                            return false;
                        }
                    });
                });
                var $PlanSize = $("#femi-riskLevelPartMake-tbody tr[data-id=" + wTaskPartID + "] td[data-title=PlanSize]");
                $PlanSize.attr("data-value", _CheckNum);
                $PlanSize.html(_CheckNum <= 0 ? "-" : _CheckNum);

                PartAndStepCheckedLock = 0;

            });


            $("body").delegate("#femi-riskLevelMakePlan-tbody tr td input[type=checkbox]", 'change', function () {
                if (PartAndStepCheckedLock == 1)
                    return;
                PartAndStepCheckedLock = 1;
                var $this = $(this),
                    wTaskPartID = $this.closest("tr").attr("data-pid");


                var _CheckNum = 0;
                $("#femi-riskLevelMakePlan-tbody>tr>td>input[type=checkbox]").each(function (k, item_k) {
                    var $item_k = $(item_k),
                        _data_id = $item_k.closest("tr").attr("data-id");
                    $.each(_partList, function (i, item) {
                        if (item.TaskPartID == wTaskPartID) {
                            if (item.ID != _data_id)
                                return true;

                            if (item_k.checked && (item.ShiftID <= mShiftID || item.ShiftID == 0)) {
                                item.Checked = "checked";
                                item.ShiftID = mShiftID;
                                _CheckNum++;
                            } else if (item.ShiftID <= mShiftID) {
                                item.Checked = "";
                                item.ShiftID = 0;
                            }
                            return false;
                        }
                    });
                });



                $.each(_TaskPartList, function (i, item) {
                    if (item.ID == wTaskPartID) {
                        item.PlanSize = _CheckNum;
                    }
                });



                //修改原始数据

                var $PlanSize = $("#femi-riskLevelPartMake-tbody tr[data-id=" + wTaskPartID + "] td[data-title=PlanSize]");
                $PlanSize.attr("data-value", _CheckNum);
                $PlanSize.html(_CheckNum <= 0 ? "-" : _CheckNum);

                PartAndStepCheckedLock = 0;
            });

            //生成数据



            //下达工位数据


            var PartAndStepCheckedLockAudit = 0
            // $("body").delegate("#femi-riskLevelPartAudit-tbody tr td input[type=checkbox]", 'change', function () {
            //     if (PartAndStepCheckedLockAudit == 1)
            //         return;
            //     PartAndStepCheckedLockAudit = 1;
            //     var $this = $(this),
            //         wTaskPartID = $this.closest("tr").attr("data-id");
            //     if (this.checked) {
            //         $.each(_partList, function (i, item) {
            //             if (item.TaskPartID == wTaskPartID) {
            //                 item.Checked = "checked";
            //                 $("#femi-riskLevel-tbody tr[data-id=" + item.ID + "] td input[type=checkbox]").prop("checked", true);
            //             }
            //         })
            //         //数据上工位下所有工序全部的checked=true; 根据每一条ID遍历
            //         // $("#femi-riskLevelPartMake-tbody tr td input[type=checkbox][data-id="+ID+"]").prop("checked",true);

            //     } else {
            //         //数据上工位下所有工序全部的checked=false;
            //         $.each(_partList, function (i, item) {
            //             if (item.TaskPartID == wTaskPartID) {
            //                 item.Checked = "";
            //                 $("#femi-riskLevel-tbody tr[data-id=" + item.ID + "] td input[type=checkbox]").prop("checked", false);
            //             }
            //         })
            //         // $("#femi-riskLevelPartMake-tbody tr td input[type=checkbox][data-id="+ID+"]").prop("checked",false);
            //     }
            //     PartAndStepCheckedLockAudit = 0;
            // });

            $("body").delegate("#femi-riskLevel-tbody tr td input[type=checkbox]", 'change', function () {
                if (PartAndStepCheckedLockAudit == 1)
                    return;
                PartAndStepCheckedLockAudit = 1;
                var $this = $(this),
                    wID = $this.closest("tr").attr("data-id"),
                    wTaskPartID = $this.closest("tr").attr("data-pid");

                var wCheckStatus = 0;
                var _MakeObj = {};
                if (this.checked) {
                    wCheckStatus = 2;
                    //数据的checked=true;
                    $.each(_partList, function (i, item) {
                        if (item.TaskPartID == wTaskPartID) {
                            if (item.ID == wID) {
                                item.Checked = "checked";
                                _MakeObj = item;
                            }
                            if (!item.Checked || item.Checked != "checked") {
                                wCheckStatus = 1;
                            }

                        }
                    });

                } else {
                    wCheckStatus = 0;

                    //数据的checked=false; 
                    $.each(_partList, function (i, item) {
                        if (item.TaskPartID == wTaskPartID) {
                            if (item.ID == wID) {
                                item.Checked = "";
                                _MakeObj = item;
                            }
                            if (item.Checked && item.Checked == "checked") {
                                wCheckStatus = 1;
                            }
                        }
                    });

                }
                // var $Tr = $("#femi-riskLevelPartAudit-tbody tr[data-id=" + wTaskPartID + "] td input[type=checkbox]").closest("tr");
                // $Tr.replaceWith($com.util.template(_MakeObj, HTML.TablePartMode));

                // switch (wCheckStatus) {
                //     case 0:
                //         $("#femi-riskLevelPartAudit-tbody tr[data-id=" + wTaskPartID + "] td input[type=checkbox]").prop("indeterminate", false);
                //         $("#femi-riskLevelPartAudit-tbody tr[data-id=" + wTaskPartID + "] td input[type=checkbox]").prop("checked", false);
                //         break;
                //     case 1:
                //         $("#femi-riskLevelPartAudit-tbody tr[data-id=" + wTaskPartID + "] td input[type=checkbox]").prop("checked", false);
                //         $("#femi-riskLevelPartAudit-tbody tr[data-id=" + wTaskPartID + "] td input[type=checkbox]").prop("indeterminate", true);
                //         break;
                //     case 2:
                //         $("#femi-riskLevelPartAudit-tbody tr[data-id=" + wTaskPartID + "] td input[type=checkbox]").prop("indeterminate", false);
                //         $("#femi-riskLevelPartAudit-tbody tr[data-id=" + wTaskPartID + "] td input[type=checkbox]").prop("checked", true);
                //         break;
                //     default:
                //         break;
                // }

                PartAndStepCheckedLockAudit = 0;
            });

            //下达数据


            //制作工序
            $("body").delegate("#zace-searchZApproval-MakePlan", "click", function () {

                var $this = $(this),
                    value = $("#zace-search-MakePlan").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevelMakePlan-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevelMakePlan-tbody"), DataAllSearch, value, "WID");



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
                    $com.table.filterByLikeString($("#femi-riskLevelPart-tbody"), mPartPointTableSearch, value, "ID");



            });

            //制作工位
            $("body").delegate("#zace-searchZApproval-level-SearchMake", "click", function () {

                var value = $("#zace-search-levelPartMake").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevelPartMake-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevelPartMake-tbody"), mPartPointTableSearchMake, value, "ID");



            });
            $("body").delegate(".line-items>li", "click", function () {
                var $this = $(this);
                SelectedLine = Number($this.attr("data-value"));
                $("#lineChoose").html(FORMATTRT_Level.AreaIDSe(SelectedLine));
                var default_value = {
                    // DepartmentID: 0,
                    AreaID: 0,
                };

                if (SelectedLine == 0) {
                    model.com.refreshPoAudit();
                } else {

                    default_value.AreaID = SelectedLine;
                    $com.table.filterByConndition($("#femi-riskLevelPartAudit-tbody"), mPartPointTableAllAudit, default_value, "ID");

                }

            });
            //所有工位
            $("body").delegate("#zace-searchZApproval-level-SearchAudit", "click", function () {

                var value = $("#zace-search-levelPartAudit").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevelPartAudit-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevelPartAudit-tbody"), DataAllSearchAudit, value, "ID");



            });

            $("body").delegate("#zace-zaceRefresh-level", "click", function () {

                model.com.refresh();

            });


            //下达。。。选择数据
            $("body").delegate("#zace-edit-level", "click", function () {


                var _idArea = Number(SelectedLine);
                var SelectData = [];


                if (_idArea == 0) {
                    SelectData = [];

                    $.each(_partList, function (i, item) {

                        if (item.Status == 10) {
                            SelectData.push(item);
                        }


                    });
                } else {


                    var zaceOrder = 0,
                        zacePartID = 0;
                    for (var k = 0; k < mPartPointTableAllAudit.length; k++) {
                        if (_idArea == mPartPointTableAllAudit[k].AreaID) {
                            zaceOrder = mPartPointTableAllAudit[k].APSTaskPart.ID;
                            $.each(_partList, function (i, item) {

                                if (zaceOrder == item.TaskPartID && item.Status == 10) {
                                    SelectData.push(item);
                                }


                            });
                        };

                    }


                }
                if (!SelectData || !SelectData.length || SelectData.length <= 0) {
                    alert("请选择状态为已审批的数据！！")
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




                    $(".zzzb").css("width", "0px");
                    $('.zzzb').hide();
                    $(".zzzaAudit").css("margin-right", "0px");


                })




            });

            $("body").delegate("#zace-edit-submit", "click", function () {
                // var SelectData = [];

                // $.each(_partList, function (i, item) {

                //     if (item.Status == 9) {
                //         SelectData.push(item);
                //     }




                // });

                var _idArea = Number(SelectedLine);
                var SelectData = [];


                if (_idArea == 0) {
                    SelectData = [];

                    $.each(_partList, function (i, item) {

                        if (item.Status == 9) {
                            SelectData.push(item);
                        }


                    });
                } else {


                    var zaceOrder = 0,
                        zacePartID = 0;
                    for (var k = 0; k < mPartPointTableAllAudit.length; k++) {
                        if (_idArea == mPartPointTableAllAudit[k].AreaID) {
                            zaceOrder = mPartPointTableAllAudit[k].APSTaskPart.ID;
                            $.each(_partList, function (i, item) {

                                if (zaceOrder == item.TaskPartID && item.Status == 9) {
                                    SelectData.push(item);
                                }


                            });
                        };

                    }


                }
                if (!SelectData || !SelectData.length || SelectData.length <= 0) {
                    alert("请选择状态为待审批的数据！！！")
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

                    $(".zzzb").css("width", "0px");
                    $('.zzzb').hide();
                    $(".zzzaAudit").css("margin-right", "0px");

                })









            });
            //zace-edit-submit
            $("body").delegate("#zace-edit-remove", "click", function () {



                // var SelectData = [];

                // $.each(_partList, function (i, item) {

                //     if (item.Status == 9) {
                //         SelectData.push(item);
                //     }




                // });

                var _idArea = Number(SelectedLine);
                var SelectData = [];


                if (_idArea == 0) {
                    SelectData = [];

                    $.each(_partList, function (i, item) {

                        if (item.Status == 9) {
                            SelectData.push(item);
                        }


                    });
                } else {


                    var zaceOrder = 0,
                        zacePartID = 0;
                    for (var k = 0; k < mPartPointTableAllAudit.length; k++) {
                        if (_idArea == mPartPointTableAllAudit[k].AreaID) {
                            zaceOrder = mPartPointTableAllAudit[k].APSTaskPart.ID;
                            $.each(_partList, function (i, item) {

                                if (zaceOrder == item.TaskPartID && item.Status == 9) {
                                    SelectData.push(item);
                                }


                            });
                        };

                    }


                }



                if (!SelectData || !SelectData.length || SelectData.length <= 0) {
                    alert("请选择状态为待审批的数据！！！")
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

                    $(".zzzb").css("width", "0px");
                    $('.zzzb').hide();
                    $(".zzzaAudit").css("margin-right", "0px");




                })




            });

            $("body").delegate("#zace-editSave-MakePlanAu", "click", function () {


                var SelectData = [];
                var _text = '';
                var boolSubmit = false;
                $.each(_partList, function (i, item) {
                    item.ZaceStatus = 0;
                    if (item.Checked && item.Checked == "checked" && item.Status == 1) {
                        item.ZaceStatus = 1;

                        SelectData.push(item);
                    } else {

                        if (item.Status == 1) {
                            // item.Remark = {
                            //     Remark: 'test22',
                            //     SubmitID: 0,
                            //     SubimtTime: new Date(),
                            // };

                            if (item.Remark.Remark.match(/^[ ]*$/)) {

                                _text = item.PartNo + '--' + item.PartName + '--' + item.StepName;
                                boolSubmit = true;
                                return false;

                            }
                            SelectData.push(item);
                        }
                    }





                });
                if (boolSubmit) {
                    alert(_text + '任务未排，填写备注');

                    return false;
                }



                if (!SelectData || !SelectData.length || SelectData.length <= 0) {
                    alert("请选择状态为未排的数据！！")
                    return;
                }

                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].ZaceStatus == 1) {
                        SelectData[i].Status = 8;
                    }
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




                    $(".zzzbMakePlan").css("width", "0px");
                    $('.zzzbMakePlan').hide();
                    $(".zzzaMake").css("margin-right", "0px");


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
                            for (var k = 0; k < mPartPointTableAllAudit.length; k++) {
                                if (_idArea == mPartPointTableAllAudit[k].AreaID) {
                                    zaceOrder = mPartPointTableAllAudit[k].APSTaskPart.ID;
                                    $.each(_partList, function (i, item) {

                                        if (zaceOrder == item.TaskPartID && item.Status == 1) {
                                            SelectData.push(item);
                                        }


                                    });

                                };

                            }


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

                // for (var m = 0; m < _TaskPartList.length; m++) {
                //     if (_id == _TaskPartList[m].ID) {
                //         _id = _TaskPartList[m].PartID;
                //         mOrderID = _TaskPartList[m].OrderID;
                //     };

                // }
                $('.zzzPlanSearch').show();
                $('.zzzbMakePlan').hide();
                $('.zzzb').hide();
                $('.zzza').show();
                $('.zzzaMake').hide();
                $('.zzzaAudit').hide();

                $(".zzzPlanSearch").css("width", "600px");
                $(".zzza").css("margin-right", "600px");

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

                mRefreshID = _id;

                mOrderID = 0;

                // for (var m = 0; m < _TaskPartList.length; m++) {
                //     if (_id == _TaskPartList[m].ID) {
                //         _id = _TaskPartList[m].PartID;
                //         mOrderID = _TaskPartList[m].OrderID;
                //     };

                // }
                $('.zzzPlanSearch').hide();
                $('.zzzbMakePlan').show();
                $('.zzzb').hide();
                $('.zzza').hide();
                $('.zzzaMake').show();
                $('.zzzaAudit').hide();


                $(".zzzbMakePlan").css("width", "600px");
                $(".zzzaMake").css("margin-right", "600px");
                model.com.refreshPartPointMake(_id, mOrderID, _partList);//渲染工序

            });

            $("body").delegate("#femi-riskLevelPartAudit-tbody tr", "dblclick", function () {

                var $this = $(this);
                var $table = $this.closest("table");
                var _id = Number($this.find('td[data-title=ID]').attr('data-value'));

                mOrderID = 0;
                mZacePartID = 0;

                // for (var m = 0; m < _TaskPartList.length; m++) {
                //     if (_id == _TaskPartList[m].ID) {
                //         _id = _TaskPartList[m].PartID;
                //         mOrderID = _TaskPartList[m].OrderID;
                //     };

                // }
                $('.zzzPlanSearch').hide();
                $('.zzzbMakePlan').hide();
                $('.zzzb').show();
                $('.zzza').hide();
                $('.zzzaMake').hide();
                $('.zzzaAudit').show();

                $(".zzzb").css("width", "600px");
                $(".zzzaAudit").css("margin-right", "600px");
                model.com.refreshPartPointAudit(_id, mOrderID, _partList);//渲染工序

            });

            $("body").delegate("#zace-edit-PlanSearch", "click", function () {


                $('.zzzPlanSearch').hide();
                $('.zzzbMakePlan').hide();
                $('.zzzb').hide();
                $('.zzza').show();

            });

            $("body").delegate("#zace-makePlan-levelZace", "click", function () {



                ModeType = 2;

                model.com.refreshPoCheck();


            });

            $("body").delegate("#zace-searchAudit-levelZace", "click", function () {


                $('.zzzPlanSearch').hide();
                $('.zzzbMakePlan').hide();
                $('.zzzb').hide();
                $('.zzza').hide();
                $('.zzzaMake').hide();
                $('.zzzaAudit').show();

                $(".zzzb").css("width", "0px");
                $(".zzzaAudit").css("margin-right", "0px");
                ModeType = 3;
                model.com.refreshPoAudit();



            });

            $("body").delegate("#zace-searchAudit-AllZace", "click", function () {


                $('.zzzPlanSearch').hide();
                $('.zzzbMakePlan').hide();
                $('.zzzb').hide();
                $('.zzza').show();
                $('.zzzaMake').hide();
                $('.zzzaAudit').hide();
                ModeType = 1;

                $(".zzzPlanSearch").css("width", "0px");
                $(".zzza").css("margin-right", "0px");

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
                    list[m].PlanSize = '-';

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

                $("#femi-riskLevelPart-tbody").html($com.util.template(Grade, HTML.TablePartModePl));


            },

            refreshPartAudit: function (id, list) {


                mPartTableAll = [];
                for (var m = 0; m < list.length; m++) {
                    list[m].PartNo = list[m].APSTaskPart.PartNo;
                    list[m].LineID = list[m].APSTaskPart.LineID;
                    list[m].PartID = list[m].APSTaskPart.PartID;
                    list[m].PlanSize = '-';
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
            changeData: function (data) {

                var _list = [];
                $.each(data, function (i, item) {
                    item.ZaceOrderID = 0;
                    switch (item.Status) {

                        case 1:
                            item.ZaceOrderID = 1;
                            break;
                        case 2:
                            item.ZaceOrderID = 7;
                            break;
                        case 3:
                            item.ZaceOrderID = 8;
                            break;
                        case 4:
                            item.ZaceOrderID = 9;
                            break;
                        case 5:
                            item.ZaceOrderID = 10;
                            break;
                        case 6:
                            item.ZaceOrderID = 4;
                            break;
                        case 7:
                            item.ZaceOrderID = 3;
                            break;
                        case 8:
                            item.ZaceOrderID = 2;
                            break;
                        case 9:
                            item.ZaceOrderID = 5;
                            break;
                        case 10:
                            item.ZaceOrderID = 6;
                            break;

                        default:
                            break;
                    }
                    _list.push(item);

                });

                _list.sort(function (a, b) { return Number(a.ZaceOrderID) - Number(b.ZaceOrderID) });

                return _list;


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
                    // if (id == list[m].PartID && orderID == list[m].OrderID) {
                    //     mPartPointTableAll.push(list[m]);
                    // };
                    if (id == list[m].TaskPartID) {
                        mPartPointTableAll.push(list[m]);
                    };

                }

                $.each(mPartPointTableAll, function (i, item) {
                    item.WID = i + 1;
                });
                DataAll = $com.util.Clone(mPartPointTableAll);
                var Grade = $com.util.Clone(mPartPointTableAll);
                Grade = model.com.changeData(Grade);
                mPartPointTableSearch = [];
                $.each(Grade, function (i, item) {
                    item.ColorText = Status[item.Status];
                    for (var p in item) {
                        if (!FORMATTRT_Level[p])
                            continue;
                        item[p] = FORMATTRT_Level[p](item[p]);
                    }
                    item.WID = i + 1;
                    item.ReadyTimeText = item.ReadyTime;
                    item.Remark = item.Remark.Remark;
                    if (new Date(item.ReadyTime) < new Date('2010-1-1')) {
                        item.ReadyTimeText = '-';
                    }

                });
                mPartPointTableSearch = $com.util.Clone(Grade);
                DataAllSearch = $com.util.Clone(Grade);
                $("#femi-riskLevel-tbody").html($com.util.template(Grade, HTML.TableModePartPoint));
            },
            //工序制定
            refreshPartPointMake: function (id, orderID, list) {


                mPartPointTableAll = [];
                for (var m = 0; m < list.length; m++) {
                    // if (id == list[m].PartID && orderID == list[m].OrderID) {
                    //     mPartPointTableAll.push(list[m]);
                    // };
                    if (id == list[m].TaskPartID) {
                        mPartPointTableAll.push(list[m]);
                    };

                }

                $.each(mPartPointTableAll, function (i, item) {
                    item.WID = i + 1;
                });
                DataAll = $com.util.Clone(mPartPointTableAll);
                var Grade = $com.util.Clone(mPartPointTableAll);
                Grade = model.com.changeData(Grade);
                mPartPointTableSearch = [];
                $.each(Grade, function (i, item) {
                    item.ColorText = Status[item.Status];
                    for (var p in item) {
                        if (!FORMATTRT_Level[p])
                            continue;
                        item[p] = FORMATTRT_Level[p](item[p]);
                    }
                    item.WID = i + 1;
                    item.ReadyTimeText = item.ReadyTime;
                    item.Remark = item.Remark.Remark;
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
                    if (id == list[m].TaskPartID) {
                        mPartPointTableAll.push(list[m]);
                    };

                }

                $.each(mPartPointTableAll, function (i, item) {
                    item.WID = i + 1;

                });
                DataAll = $com.util.Clone(mPartPointTableAll);
                var Grade = $com.util.Clone(mPartPointTableAll);
                Grade = model.com.changeData(Grade);
                mPartPointTableSearch = [];
                $.each(Grade, function (i, item) {
                    item.ColorText = Status[item.Status];
                    for (var p in item) {
                        if (!FORMATTRT_Level[p])
                            continue;
                        item[p] = FORMATTRT_Level[p](item[p]);
                    }
                    item.WID = i + 1;
                    item.ReadyTimeText = item.ReadyTime;
                    item.Remark = item.Remark.Remark;
                    if (new Date(item.ReadyTime) < new Date('2010-1-1')) {
                        item.ReadyTimeText = '-';
                    }


                });
                mPartPointTableSearch = $com.util.Clone(Grade);
                DataAllSearch = $com.util.Clone(Grade);
                $("#femi-riskPlanSearch-tbody").html($com.util.template(Grade, HTML.TableModePartPoint));
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
                $com.app.loading('数据加载中...');
                var _dateText = $com.util.format('yyyy-MM-dd', new Date(ShiftStartDate));
                $('.partText').text('(' + _dateText + ')' + '工位查询日计划');

                var _checkShiftID = model.com.getShiftID(ShiftStartDate);

                mShiftID = _checkShiftID;
                //字段写错
                model.com.getAPSTaskStepQuery({}, function (resItem) {//ShfitID: _checkShiftID

                    if (resItem && resItem.list) {


                        if (resItem.list.length > 0) {
                            var ItemList = $com.util.Clone(resItem.list);

                            PartList = $com.util.Clone(resItem.list);
                            OrderList = $com.util.Clone(resItem.OrderList);
                            TaskPartList = $com.util.Clone(resItem.TaskPartList);

                            _OrderList = $com.util.Clone(resItem.OrderList);
                            _TaskPartList = $com.util.Clone(resItem.TaskPartList);
                            _partList = $com.util.Clone(resItem.list);




                            _TaskPartList = model.com.getNewPartList(_TaskPartList, _partList);
                            _OrderList = model.com.getNewOrderList(_OrderList, _TaskPartList);
                            // model.com.renderTree(_OrderList);


                            mPartPointTableAll = $com.util.Clone(_TaskPartList);
                            $.each(mPartPointTableAll, function (i, item) {
                                item.WID = i + 1;
                                item.PartNo = item.APSTaskPart.PartNo;
                                item.ID = item.APSTaskPart.ID;
                                item.LineID = item.APSTaskPart.LineID;
                                item.PartID = item.APSTaskPart.PartID;
                                item.PlanSize = item.StepSize - item.StepMaking - item.StepSchedule;

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
                            $("#femi-riskLevelPart-tbody").html($com.util.template(Grade, HTML.TablePartModePl));
                            $com.app.loaded();

                        } else {

                            $("#femi-riskLevelPart-tbody").html($com.util.template([], HTML.TablePartModePl));
                            alert('暂无任务！');
                            $com.app.loaded();
                        }



                    }
                });



            },

            refreshPoAudit: function () {
                $com.app.loading('数据加载中...');
                ShiftStartDate = new Date();
                var _dateText = $com.util.format('yyyy-MM-dd', new Date(ShiftStartDate));
                $('.partText').text('(' + _dateText + ')' + '工位审批日计划');

                var _checkShiftID = model.com.getShiftID(ShiftStartDate);

                mShiftID = _checkShiftID;
                model.com.getAPSTaskStepQuery({ IsAudit: true }, function (resItem) {//ShfitID: _checkShiftID,

                    if (resItem && resItem.list) {


                        if (resItem.list.length > 0) {
                            var ItemList = $com.util.Clone(resItem.list);

                            PartList = $com.util.Clone(resItem.list);
                            OrderList = $com.util.Clone(resItem.OrderList);
                            TaskPartList = $com.util.Clone(resItem.TaskPartList);

                            _OrderList = $com.util.Clone(resItem.OrderList);
                            _TaskPartList = $com.util.Clone(resItem.TaskPartList);
                            _partList = $com.util.Clone(resItem.list);




                            _TaskPartList = model.com.getNewPartList(_TaskPartList, _partList);
                            _OrderList = model.com.getNewOrderList(_OrderList, _TaskPartList);
                            // model.com.renderTree(_OrderList);

                            AreaIDList = [];

                            mPartPointTableAllAudit = $com.util.Clone(_TaskPartList);
                            $.each(mPartPointTableAllAudit, function (i, item) {
                                item.WID = i + 1;
                                item.ID = item.APSTaskPart.ID;
                                item.PartNo = item.APSTaskPart.PartNo;
                                item.LineID = item.APSTaskPart.LineID;
                                item.PartID = item.APSTaskPart.PartID;

                                var _num = 0;
                                $.each(item.UnitItemList, function (m, item_m) {
                                    if (item_m.Status != 1) {
                                        _num += 1;
                                    }

                                });
                                item.PlanSize = _num;
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

                            if (AreaIDList.length >= 2) {
                                SelectedLine = 0;
                            } else {
                                SelectedLine = 0;
                                $(".zacelineChoose").hide()
                            }

                            $(".line-items").html($com.util.template(TypeSource_Level.AreaIDSe, HTML.TableLiItemNode));

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
                            $("#femi-riskLevelPartAudit-tbody").html($com.util.template(Grade, HTML.TablePartModePAudit));
                            $com.app.loaded();

                        } else {
                            $("#femi-riskLevelPartAudit-tbody").html($com.util.template([], HTML.TablePartModePAudit));
                            alert('暂无审批任务！');
                            $com.app.loaded();
                        }



                    }

                });



            },

            refreshPo: function () {

                $com.app.loading('数据加载中...');
                var _dateText = $com.util.format('yyyy-MM-dd', new Date(ShiftStartDate));
                $('.partText').text('(' + _dateText + ')' + '工位制定日计划');
                var _checkShift = 0;

                _checkShift = model.com.getShiftID(ShiftStartDate);

                mShiftID = _checkShift;
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




                            _TaskPartList = model.com.getNewPartList(_TaskPartList, _partList);
                            _OrderList = model.com.getNewOrderList(_OrderList, _TaskPartList);
                            // model.com.renderTree(_OrderList);


                            mPartPointTableAllMake = $com.util.Clone(_TaskPartList);
                            $.each(mPartPointTableAllMake, function (i, item) {
                                item.WID = i + 1;
                                item.ID = item.APSTaskPart.ID;
                                item.PartNo = item.APSTaskPart.PartNo;
                                item.LineID = item.APSTaskPart.LineID;
                                item.PartID = item.APSTaskPart.PartID;
                                item.PlanSize = '-';
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

                            $com.app.loaded();
                        } else {
                            $("#femi-riskLevelPartMake-tbody").html($com.util.template([], HTML.TablePartMode));
                            alert('当日无周计划！');
                            $com.app.loaded();

                        }






                    }
                });
            },

            refreshPoCheck: function () {


                $com.app.loading('数据加载中...');

                var _dateText = $com.util.format('yyyy-MM-dd', new Date(ShiftStartDate));

                var _checkShiftID = 0;
                _checkShiftID = model.com.getShiftID(ShiftStartDate);

                mShiftID = _checkShiftID;

                //查询当日计划
                model.com.postAPSTaskStepCreate({ data: ShiftStartDate }, function (resItem) {


                    var todatList = [];
                    for (var j = 0; j < resItem.list.length; j++) {
                        if (resItem.list[j].ShiftID <= _checkShiftID || resItem.list[j].ShiftID == 0) {
                            todatList.push(resItem.list[j]);
                        };

                    }


                    //当日有计划
                    if (todatList.length > 0) {

                        var _checkBool = false;
                        //判断是否在制  审批完  下达   在制定中不管
                        $.each(todatList, function (k, item_k) {
                            if (item_k.ShiftID == _checkShiftID && item_k.Status != 1) {
                                _checkBool = true;
                            }



                        });

                        if (_checkBool) {

                            //已有在制   查询明天的日计划
                            var _dateText = $com.util.format('yyyy-MM-dd', new Date(ShiftStartDate).getTime() + 24 * 3600000);
                            ShiftStartDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(ShiftStartDate).getTime() + 24 * 3600000);
                            _checkShiftID = model.com.getShiftID(ShiftStartDate);
                            mShiftID = _checkShiftID;
                            model.com.postAPSTaskStepCreate({ data: ShiftStartDate }, function (resItem) {


                                var toTommList = []; //明天的日计划
                                for (var j = 0; j < resItem.list.length; j++) {
                                    if (resItem.list[j].ShiftID <= _checkShiftID || resItem.list[j].ShiftID == 0) {
                                        toTommList.push(resItem.list[j]);
                                    };

                                }

                                if (toTommList.length > 0) {

                                    var _checkTommBool = false;
                                    //判断是否在制  审批完  下达   在制定中不管
                                    $.each(toTommList, function (k, item_k) {
                                        if (item_k.ShiftID == _checkShiftID && item_k.Status != 1) {
                                            _checkTommBool = true;
                                        }



                                    });

                                    if (_checkTommBool) {

                                        alert('明日计划已制定！');
                                        $com.app.loaded();
                                        return false;

                                    } else {



                                        model.com.refreshPoCheck();
                                        // $com.app.loaded();

                                    }



                                } else {

                                    _dateText = $com.util.format('yyyy-MM-dd', new Date(ShiftStartDate));
                                    $('.partText').text('(' + _dateText + ')' + '工位制定日计划');
                                    var ItemList = $com.util.Clone(resItem.list);

                                    _checkShiftID = model.com.getShiftID(ShiftStartDate);
                                    mShiftID = _checkShiftID;

                                    PartList = $com.util.Clone(resItem.list);
                                    OrderList = $com.util.Clone(resItem.OrderList);
                                    TaskPartList = $com.util.Clone(resItem.TaskPartList);

                                    _OrderList = $com.util.Clone(resItem.OrderList);
                                    _TaskPartList = $com.util.Clone(resItem.TaskPartList);
                                    _partList = $com.util.Clone(resItem.list);




                                    _TaskPartList = model.com.getNewPartList(_TaskPartList, _partList);
                                    _OrderList = model.com.getNewOrderList(_OrderList, _TaskPartList);
                                    // model.com.renderTree(_OrderList);




                                    mPartPointTableAllMake = $com.util.Clone(_TaskPartList);
                                    $.each(mPartPointTableAllMake, function (i, item) {
                                        item.WID = i + 1;
                                        item.ID = item.APSTaskPart.ID;
                                        item.PartNo = item.APSTaskPart.PartNo;
                                        item.LineID = item.APSTaskPart.LineID;
                                        item.PartID = item.APSTaskPart.PartID;
                                        item.PlanSize = '-';
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

                                    $('.zzzPlanSearch').hide();
                                    $('.zzzbMakePlan').hide();
                                    $('.zzzb').hide();
                                    $('.zzza').hide();
                                    $('.zzzaMake').show();
                                    $('.zzzaAudit').hide();

                                    $(".zzzbMakePlan").css("width", "0px");
                                    $(".zzzaMake").css("margin-right", "0px");

                                    $com.app.loaded();
                                }


                            });


                        } else {

                            _dateText = $com.util.format('yyyy-MM-dd', new Date(ShiftStartDate));
                            $('.partText').text('(' + _dateText + ')' + '工位制定日计划');
                            //无在制====渲染今日的计划界面
                            //判断是否在制    
                            _checkShiftID = model.com.getShiftID(ShiftStartDate);
                            mShiftID = _checkShiftID;

                            var ItemList = $com.util.Clone(resItem.list);

                            PartList = $com.util.Clone(resItem.list);
                            OrderList = $com.util.Clone(resItem.OrderList);
                            TaskPartList = $com.util.Clone(resItem.TaskPartList);

                            _OrderList = $com.util.Clone(resItem.OrderList);
                            _TaskPartList = $com.util.Clone(resItem.TaskPartList);
                            _partList = $com.util.Clone(resItem.list);




                            _TaskPartList = model.com.getNewPartList(_TaskPartList, _partList);
                            _OrderList = model.com.getNewOrderList(_OrderList, _TaskPartList);
                            // model.com.renderTree(_OrderList);




                            mPartPointTableAllMake = $com.util.Clone(_TaskPartList);
                            $.each(mPartPointTableAllMake, function (i, item) {
                                item.WID = i + 1;
                                item.ID = item.APSTaskPart.ID;
                                item.PartNo = item.APSTaskPart.PartNo;
                                item.LineID = item.APSTaskPart.LineID;
                                item.PartID = item.APSTaskPart.PartID;
                                item.PlanSize = '-';
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

                            $('.zzzPlanSearch').hide();
                            $('.zzzbMakePlan').hide();
                            $('.zzzb').hide();
                            $('.zzza').hide();
                            $('.zzzaMake').show();
                            $('.zzzaAudit').hide();

                            $(".zzzbMakePlan").css("width", "0px");
                            $(".zzzaMake").css("margin-right", "0px");

                            $com.app.loaded();

                        }








                    } else {
                        // $("#femi-riskLevelPartMake-tbody").html($com.util.template([], HTML.TablePartMode));
                        alert('当日无周计划！');
                        $com.app.loaded();

                    }







                });
            },

            refreshPoStep: function () {


                $com.app.loading('数据加载中。。。');
                var _dateText = $com.util.format('yyyy-MM-dd', new Date(ShiftStartDate));
                $('.partText').text('(' + _dateText + ')' + '工位制定日计划');
                var _checkShift = 0;

                _checkShift = model.com.getShiftID(ShiftStartDate);

                mShiftID = _checkShift;
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




                            _TaskPartList = model.com.getNewPartList(_TaskPartList, _partList);
                            _OrderList = model.com.getNewOrderList(_OrderList, _TaskPartList);
                            // model.com.renderTree(_OrderList);


                            mPartPointTableAllMake = $com.util.Clone(_TaskPartList);
                            $.each(mPartPointTableAllMake, function (i, item) {
                                item.WID = i + 1;
                                item.ID = item.APSTaskPart.ID;
                                item.PartNo = item.APSTaskPart.PartNo;
                                item.LineID = item.APSTaskPart.LineID;
                                item.PartID = item.APSTaskPart.PartID;
                                item.PlanSize = '-';
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

                            model.com.refreshPartPointMake(mRefreshID, mOrderID, _partList);//渲染工序     
                        } else {
                            $("#femi-riskLevelPartMake-tbody").html($com.util.template([], HTML.TablePartMode));
                            alert('当日无周计划！');

                            model.com.refreshPartPointMake(mRefreshID, mOrderID, _partList);//渲染工序     

                        }






                    }

                    $com.app.loaded();
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

            getShiftID: function (DateT) {

                var _id = 0;
                var DateTime = new Date(DateT);
                _id = DateTime.getFullYear() * 10000 + (DateTime.getMonth() + 1) * 100 + DateTime.getDate();

                return _id;
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

            saveAPSStep: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskStep/Update",
                    $TYPE: "post",
                    $SERVER: '/MESAPS'
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