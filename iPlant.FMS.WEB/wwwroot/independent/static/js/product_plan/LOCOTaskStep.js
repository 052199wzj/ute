require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($zace, $com) {

    var KEYWORD_Level_LIST,
        KEYWORD_Level,
        FORMATTRT_Level,
        DEFAULT_VALUE_Level,
        TypeSource_Level,
        model,
        DataAll,
        ShiftNumRecord = 1,
        ShiftNumOrder = 1,
        pID = 0,
        mGroupID = -1,
        DayNum = 1,
        ShiftNum = 1,
        wMonitorAll,
        mShiftDateReCord,
        DATABasic,
        DataAllConfirmBasic,
        DataAllConfirmChange,
        DataAllConfirm,
        DataAllSearch,
        mShiftDate,
        SubmitDate,
        wProduct,
        mOrderID = 0,
        mWorkShopID,
        OrderNo,
        WantTeam,
        DATAAllBusiness,
        DATAAllBusinessC,
        ShiftNumOrderFirst,
        mShiftDateFirst,
        HTML;
    var STATUS = ["默认", "保存", "下达", "已确认", "开工", "完工", "暂停", "终止", "提交", "待审批", "已审批", "已撤销", "待互检", "已驳回"];
    var WorkShopIDList = ["", "模组车间", "单体车间"];
    var StatusColor = ['black', 'black', '#fa1ff4c9', 'green', '#a94442', 'green', 'red', 'red', 'orange', 'orange', 'green', 'red', 'orange', 'red'];//'#00CCFF' 完工
    var DataAllSearchRecord = [];
    DATAAllBusiness = [];
    DATAAllBusinessC = [];
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
    ShiftIndexSelect = [{
        ID: 1,
        Name: "白班"
    }, {
        ID: 2,
        Name: "中班"
    }, {
        ID: 3,
        Name: "晚班"
    }];
    ShiftIndexNameList = ["", "白班", "中班", "晚班"];
    var mShiftDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()); //时间

    HTML = {
        TeamLI: [
            '<li class="TeamLI" data-value="{{TeamID}}">',
            '<a href="javascript:;"><span class="glyphicon glyphicon-star" aria-hidden="true"></span>{{TeamName}}</a>',
            '</li>',
        ].join(""),
        GroupLI: [
            '<li class="TeamLI" data-value="{{GroupID}}">',
            '<a href="javascript:;"><span class="glyphicon glyphicon-star" aria-hidden="true"></span>{{GroupName}}</a>',
            '</li>',
        ].join(""),
        OrderProgress: [
            '<div class="Progress" style="border: 1px solid gainsboro;height: 20px;background-color: #F5F5F5;"><div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="{{OrderFinish}}" aria-valuemin="0" aria-valuemax="{{OrderPlan}}" style = "width: {{OrderProgressNow}}%;color: black;">{{OrderFinishPer}}',
            '</div></div>'
        ].join(""),
        PlanProgress: [
            '<div class="Progress" style="border: 1px solid gainsboro;height: 20px;background-color: #F5F5F5;"><div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="{{FinishNum}}" aria-valuemin="0" aria-valuemax="{{PlanNum}}" style = "width: {{PlanProgressNow}}%;color: black;">{{PlanFinishPer}}',
            '</div></div>'
        ].join(""),
        TableMode: [
            '<tr>',
            '<td style="display:none;"><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px;display:none;" /></td>',
            '<td  style="display:none" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td data-title="LineName" data-value="{{LineName}}" >{{LineName}}</td>',
            '<td data-title="OrderNo" data-value="{{OrderNo}}" >{{OrderNo}}</td>',
            '<td data-title="PartName" data-value="{{PartName}}" >{{PartName}}</td>',
            '<td data-title="PartPointName" data-value="{{PartPointName}}" >{{PartPointName}}</td>',
            '<td data-title="StationName" data-value="{{StationName}}" >{{StationName}}</td>',
            '<td  style="color:{{ColorText}}" data-title="WorkerNames" data-value="{{WorkerNames}}" >{{WorkerNames}}</td>',
            '<td data-title="ShiftID" data-value="{{ShiftID}}" >{{ShiftDate}}</td>',
            '<td data-title="ShiftIndexName" data-value="{{ShiftIndexName}}" >{{ShiftIndexName}}</td>',
            '<td style="color:{{StatusColorText}}" data-title="Status" data-value="{{Status}}" >{{StatusText}}</td>',
            '<td style="max-width: 60px" data-title="Handle" data-value="{{ID}}"><div class="row">',
            '<div class="col-md-12 lmvt-do-info lmvt-dispatch">选择人员</div>',
            '</div></td>',
            '</tr>',
        ].join(""),
        TableModeList: [
            '<tr>',
            '<td style="display:none;"><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px;display:none;" /></td>',
            '<td  data-title="WID" data-value="{{WID}}">{{WID}}</td>',
            '<td  style="display:none" data-title="ID" data-value="{{OrderID}}">{{OrderID}}</td>',
            '<td style="min-width: 50px" data-title="OrderNo" data-value="{{OrderNo}}">{{OrderNo}}</td>',
            // '<td style="min-width: 50px" data-title="Customer" data-value="{{Customer}}" >{{Customer}}</td>',
            '<td style="min-width: 50px" data-title="ProductName" data-value="{{ProductName}}" >{{ProductName}}</td>',
            '<td style="min-width: 50px" data-title="ProductNo" data-value="{{ProductNo}}" >{{ProductNo}}</td>',
            '<td style="min-width: 50px" data-title="WorkShopID" data-value="{{WorkShopID}}">{{WorkShopName}}</td>',
            '<td style="min-width: 50px" data-title="LineName" data-value="{{LineName}}">{{LineName}}</td>',
            '<td style="min-width: 50px" data-title="PartName" data-value="{{PartName}}">{{PartName}}</td>',
            '<td style="min-width: 50px" data-title="TeamName" data-value="{{TeamName}}">{{TeamName}}</td>',
            '<td style="min-width: 50px" data-title="OrderFinish" data-value="{{OrderFinish}}">{{OrderProgress}}</td>',
            '<td style="min-width: 50px" data-title="FinishNum" data-value="{{FinishNum}}">{{PlanProgress}}</td>',
            '<td style="min-width: 50px" data-title="ShiftID" data-value="{{ShiftID}}">{{ShiftDate}}</td>',
            '<td style="min-width: 50px" data-title="ShiftIndex" data-value="{{ShiftIndex}}">{{ShiftIndexName}}</td>',
            '<td style="min-width: 50px;color:{{StatusColorText}}" data-title="Status" data-value="{{Status}}">{{StatusText}}</td>',
            '<td style="width: 200px;" data-title="Handle" data-value="{{ID}}" data-valueTeam="{{TeamIDList}}" data-valueShiftDate="{{ShiftDate}}" ><div class="row">',
            '<div class="col-md-6 lmvt-do-info lmvt-reset">生产派工</div>',
            '<div class="col-md-6 lmvt-do-info lmvt-record">派工记录</div>',
            '</div></td>',
            '</tr>',
        ].join(""),

        TableRecordMode: [
            '<tr>',
            '<td style="display:none;"><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px;" /></td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td data-title="LineName" data-value="{{LineName}}" >{{LineName}}</td>',
            '<td data-title="OrderNo" data-value="{{OrderNo}}" >{{OrderNo}}</td>',
            '<td data-title="PartName" data-value="{{PartName}}" >{{PartName}}</td>',
            '<td data-title="PartPointName" data-value="{{PartPointName}}" >{{PartPointName}}</td>',
            '<td data-title="StationName" data-value="{{StationName}}" >{{StationName}}</td>',
            '<td data-title="WorkerNames" data-value="{{WorkerNames}}" >{{WorkerNames}}</td>',
            '<td data-title="ShiftID" data-value="{{ShiftID}}" >{{ShiftDate}}</td>',
            '<td data-title="ShiftIndexName" data-value="{{ShiftIndexName}}" >{{ShiftIndexName}}</td>',
            '<td data-title="Status" style="color:{{StatusColorText}}" data-value="{{Status}}" >{{StatusTextRecored}}</td>',
            // '<td data-title="ReadyTime" data-value="{{ReadyTime}}" >{{ReadyTime}}</td>',
            '</tr>',
        ].join(""),


    };
    (function () {
        KEYWORD_Level_LIST = [
            "DepartureTime|离厂时间|DateTime",
            "Status|状态|ArrayOne",
            "ReadyTime|派工时间|DateTime",
            "EditTime|时间|DateTime",
            "ShiftDae|日期|Date",
            "StartDate|开始日期|Date",
            "EndDate|结束日期|Date",
            "ShiftNum|班次|ArrayOne",
            "ShiftIndex|日期|ArrayOne",
            "ShiftNumRecord|班次|ArrayOne",
            "ShiftNumOrder|班次|ArrayOne",
            "OrderDate|日期|Date",
            "EmployerID|人员|Array",
            "TeamID|班组|ArrayOneControl",
            "TeamGroupID|分组|ArrayOneControl|TeamID",
            "GroupID|分组|ArrayOne",
            "WorkShopID|车间|ArrayOne",
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
            TeamGroupID: [],
            GroupID: [],
            TeamID: [],
            Active: [
                {
                    name: "启用",
                    value: true
                }, {
                    name: "禁用",
                    value: false
                }
            ],
            ShiftIndex: [
                {
                    name: "今日",
                    value: 1
                }, {
                    name: "明日",
                    value: 2
                }
            ],
            ShiftNumRecord: [
                {
                    name: "白班",
                    value: 1
                },
                {
                    name: "中班",
                    value: 2
                },
                {
                    name: "晚班",
                    value: 3
                }
            ],
            ShiftNumOrder: [
                {
                    name: "白班",
                    value: 1
                },
                {
                    name: "中班",
                    value: 2
                },
                {
                    name: "晚班",
                    value: 3
                }
            ],
            ShiftNum: [
                {
                    name: "白班",
                    value: 1
                },
                {
                    name: "中班",
                    value: 2
                },
                {
                    name: "晚班",
                    value: 3
                }
            ],
            EmployerID: [],
            WorkShopID: []
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
            //排班模糊查询
            $("body").delegate("#zace-searchZApproval-Order-Search", "click", function () {

                var value = $("#zace-search-Order").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevelList-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevelList-tbody"), DataAllSearchOrder, value, "WID");
            });
            //Enter触发模糊查询事件
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var value = $("#zace-search-Order").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-riskLevelList-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-riskLevelList-tbody"), DataAllSearchOrder, value, "WID");
                }
            });
            //排班刷新
            $("body").delegate("#zace-partListRefresh", "click", function () {
                ShiftNumOrder = 1;
                mShiftDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date());
                model.com.refreshList(mShiftDate);
                var ArrayList = [];
                $("#femi-riskLevel-tbody").html($com.util.template(ArrayList, HTML.TableMode));
            });
            //派工界面刷新
            $("body").delegate("#zace-edit-refresh", "click", function () {
                model.com.refresh(mShiftID, ShiftNum);
            });
            //派工记录刷新
            $("body").delegate("#zace-edit-refreshItem", "click", function () {
                model.com.refreshRecord(mShiftID, ShiftNumRecord);
            });
            $("body").delegate("#zace-searchZApproval-level-SearchZace", "click", function () {

                var value = $("#zace-search-levelZace").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-RecordLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-RecordLevel-tbody"), DataAllSearchRecord, value, "WID");
            });
            //Enter触发模糊查询事件
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var value = $("#zace-search-level").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-riskLevel-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllSearch, value, "ID");
                }
            });
            //查询
            $("body").delegate("#zace-searchZApproval-level-Search", "click", function () {

                var value = $("#zace-search-level").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllSearch, value, "ID");
            });
            //Enter触发模糊查询事件
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var value = $("#zace-search-levelZace").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-RecordLevel-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-RecordLevel-tbody"), DataAllSearchRecord, value, "WID");
                }
            });
            //派工任务查询
            // $("body").delegate("#zace-Record-Search", "click", function () {
            //     if (wMonitorAll.length == 1 || wMonitorAll.length == 0) {
            //         var default_value = {
            //             ShiftIndex: 0,
            //             ShiftNum: 0,
            //             GroupID: 0,
            //         };
            //         TypeSource_Level.GroupID = [];
            //         $.each(wMonitorAll[0].ChargeGroupList, function (i, item) {
            //             TypeSource_Level.GroupID.push({
            //                 name: item.Name,
            //                 value: item.ID
            //             });
            //         });
            //     } else {
            //         var default_value = {
            //             ShiftIndex: 0,
            //             ShiftNum: 0,
            //             TeamGroupID: 0,
            //             TeamID: 0,
            //         };
            //         var GroupList = [];
            //         for (var m = 0; m < wMonitorAll.length; m++) {
            //             for (var n = 0; n < wMonitorAll[m].ChargeGroupList.length; n++) {
            //                 GroupList.push(wMonitorAll[m].ChargeGroupList[n]);
            //             }
            //         }
            //         TypeSource_Level.TeamID = [{
            //             name: "请选择",
            //             value: 0,
            //         }];
            //         $.each(wMonitorAll, function (i, item) {
            //             TypeSource_Level.TeamID.push({
            //                 name: item.Name,
            //                 value: item.ID,
            //             });
            //         });
            //         TypeSource_Level.TeamGroupID = [
            //         ];
            //         $.each(GroupList, function (i, item) {
            //             TypeSource_Level.TeamGroupID.push({
            //                 name: item.Name,
            //                 value: item.ID,
            //                 far: item.TeamID,
            //             });
            //         });
            //     }

            //     $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {
            //         if (!rst || $.isEmptyObject(rst))
            //             return;
            //         if (rst.TeamID == 0) {
            //             alert("请选择班组！");
            //             return false;
            //         }
            //         if (wMonitorAll.length == 1 || wMonitorAll.length == 0) {
            //             mGroupID = rst.GroupID
            //         } else {
            //             mGroupID = rst.TeamGroupID
            //         }
            //         if (rst.ShiftIndex == 1) {
            //             mShiftDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date());
            //         } else if (rst.ShiftIndex == 2) {
            //             mShiftDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date().getTime() + 24 * 3600 * 1000);
            //         }
            //         DayNum = rst.ShiftIndex;

            //         ShiftNum = rst.ShiftNum;
            //         mShiftID = model.com.getShiftID(mShiftDate);
            //         model.com.refresh(mShiftID, ShiftNum);
            //     }, TypeSource_Level));

            // });
            //派工记录查询
            $("body").delegate("#zace-add-levelPro", "click", function () {

                var default_value = {
                    OrderDate: $com.util.format('yyyy-MM-dd', new Date()),
                    ShiftNumRecord: 0,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    mShiftDate = $com.util.format('yyyy-MM-dd', new Date(rst.OrderDate));
                    ShiftNumRecord = rst.ShiftNumRecord;
                    mShiftID = model.com.getShiftID(mShiftDate);
                    model.com.refreshRecord(mShiftID, ShiftNumRecord);
                }, TypeSource_Level));

            });
            //待派工订单查询查询
            // $("body").delegate("#zace-add-levelOrder", "click", function () {
            //     if (TypeSource_Level.WorkShopID == 0) {
            //         var default_value = {
            //             OrderDate: $com.util.format('yyyy-MM-dd', new Date()),
            //             ShiftNumRecord: 0,
            //         };
            //     } else {
            //         var default_value = {
            //             StartDate: $com.util.format('yyyy-MM-dd', new Date()),
            //             ShiftNumOrder: 0,
            //             WorkShopID: 0
            //         };
            //     }
            //     $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {
            //         if (!rst || $.isEmptyObject(rst))
            //             return;
            //         mShiftDate = $com.util.format('yyyy-MM-dd', new Date(rst.StartDate));
            //         ShiftNumOrder = rst.ShiftNumOrder;
            //         mWorkShopID = rst.WorkShopID;

            //         mShiftDateFirst = model.com.getShiftID(mShiftDate);
            //         ShiftNumOrderFirst = rst.ShiftNumOrder

            //         WorkShopName = WorkShopIDList[mWorkShopID]
            //         model.com.refreshList(mShiftDate);
            //     }, TypeSource_Level));

            // });

            //点击选择人员
            $("body").delegate(".lmvt-dispatch", "click", function () {
                selected_EmployeeQ = [];
                var $this = $(this);
                itemID = Number($this.closest('td[data-title=Handle]').siblings('td[data-title=ID]').attr('data-value'));
                if (itemID == 0) {
                    itemIDF = Number($this.closest('td[data-title=Handle]').siblings('td[data-title=WID]').attr('data-value'));
                }
                var Status = Number($this.closest('td[data-title=Handle]').siblings('td[data-title=Status]').attr('data-value'));
                OperatorName = $this.closest('td[data-title=Handle]').siblings('td[data-title=WorkerNames]').text().split(",");
                for (var m = 0; m < wUser.length; m++) {
                    for (var n = 0; n < OperatorName.length; n++) {
                        if (wUser[m].Name == OperatorName[n]) {
                            selected_EmployeeQ.push(wUser[m].ID);
                        }
                    }
                }
                if (!(Status == 2 || Status == 4 || Status == 3)) {
                    alert("请选择状态为下达或开工的数据!");
                    return false;
                }
                if (Status == 4 || Status == 3) {
                    model.com.getPGEmployeeList({
                        APSTaskStepID: itemID,
                    }, function (res) {
                        var APSTaskStepIDArraym = res.SourceList;
                        TypeSource_Level.EmployerID = [];
                        if (Status == 3) {
                            $.each(APSTaskStepIDArraym, function (i, item) {
                                TypeSource_Level.EmployerID.push({
                                    value: item.ID,
                                    name: item.Name
                                });
                            });
                            default_value = {
                                EmployerID: selected_EmployeeQ,
                            };
                        } else if (Status == 4) {
                            CloneArray = $com.util.Clone(APSTaskStepIDArraym);
                            for (var i = 0; i < selected_EmployeeQ.length; i++) {
                                for (var j = 0; j < CloneArray.length; j++) {
                                    if (selected_EmployeeQ[i] == CloneArray[j].ID) {
                                        CloneArray.splice(j, 1);
                                    }
                                }
                            }
                            $.each(CloneArray, function (i, item) {
                                TypeSource_Level.EmployerID.push({
                                    value: item.ID,
                                    name: item.Name
                                });
                            });
                            default_value = {
                                EmployerID: 0,
                            };
                        }

                        $("body").append($com.modal.show(default_value, KEYWORD_Level, "选择要派工的人员", function (rst) {
                            //调用修改函数
                            if (!rst || $.isEmptyObject(rst))
                                return;
                            for (var k = 0; k < selected_EmployeeQ.length; k++) {
                                rst.EmployerID.push(selected_EmployeeQ[k]);
                            }
                            var IDList = rst.EmployerID;
                            var ArrayAllSave = [];

                            for (var i = 0; i < DataAllSearch.length; i++) {
                                if (itemID == DataAllSearch[i].ID) {
                                    DataAllSearch[i].WorkerID = IDList;
                                    ArrayAllSave.push(DataAllSearch[i]);
                                }
                            }
                            $com.util.deleteLowerProperty(ArrayAllSave);
                            $com.app.loading('提交中！');
                            model.com.AddAPSStepTask({
                                data: ArrayAllSave[0],
                                PersonIDList: IDList,
                            }, function (res) {
                                $com.app.loaded();
                                alert("提交成功！");
                                model.com.refresh(mShiftID, ShiftNum);
                            });
                        }, TypeSource_Level, function () {
                            if ($("body #femi-modal-contain .femi-modal-body .femi-modal-item #modal_select_EmployerID").val().length == 0) {
                                return "派工人员必填！";
                            }
                        }));
                    });
                } else if (Status == 2) {
                    model.com.getPGEmployeeList({
                        APSTaskStepID: itemID,
                    }, function (res) {
                        var APSTaskStepIDArraym = res.SourceList;
                        TypeSource_Level.EmployerID = [];
                        $.each(APSTaskStepIDArraym, function (i, item) {
                            TypeSource_Level.EmployerID.push({
                                value: item.ID,
                                name: item.Name
                            });
                        });

                        var default_value = {
                            EmployerID: selected_EmployeeQ,
                        };
                        $("body").append($com.modal.show(default_value, KEYWORD_Level, "选择要派工的人员", function (rst) {
                            //调用修改函数
                            if (!rst || $.isEmptyObject(rst))
                                return;
                            var IDList = rst.EmployerID;
                            var ArrayAllSave = [];
                            if (itemID != 0) {
                                for (var i = 0; i < DataAllSearch.length; i++) {
                                    if (itemID == DataAllSearch[i].ID) {
                                        DataAllSearch[i].WorkerID = IDList;
                                        ArrayAllSave.push(DataAllSearch[i]);
                                    }
                                }
                                $com.util.deleteLowerProperty(ArrayAllSave);
                                $com.app.loading('提交中！');
                                model.com.postSaveAll({
                                    data: ArrayAllSave[0],
                                    PersonIDList: IDList,
                                }, function (res) {
                                    $com.app.loaded();
                                    alert("提交成功！");
                                    model.com.refresh(mShiftID, ShiftNum);
                                });
                            } else {
                                for (var i = 0; i < DataAllSearch.length; i++) {
                                    if (itemIDF == DataAllSearch[i].WID) {
                                        DataAllSearch[i].WorkerID = IDList;
                                        ArrayAllSave.push(DataAllSearch[i]);
                                    }
                                }
                                model.com.HandleDate(pID, itemIDF, IDList);
                                UserText = "";
                                UserText = model.com.getUserName(ArrayAllSave[0].WorkerID.join(","), wUser);
                                $this.closest('td[data-title=Handle]').siblings('td[data-title=WorkerNames]').text(UserText)
                            }

                        }, TypeSource_Level));
                    });
                }
            })
            //一次性提交派工人员
            $("body").delegate("#zace-edit-level", "click", function () {

                var StationListSubmit = [];
                for (var i = 0; i < SubmitDate.length; i++) {
                    for (var j = 0; j < SubmitDate[i].TaskStepList.length; j++) {
                        if (SubmitDate[i].TaskStepList[j].WorkerID.length == 0) {
                            alert(SubmitDate[i].TaskStepList[j].PartName + "-" + SubmitDate[i].TaskStepList[j].StationName + "-" + "未选择派工人员！");
                            return false;
                        }
                        StationListSubmit.push(SubmitDate[i].TaskStepList[j]);
                    }
                }
                if (StationListSubmit.length == 0) {
                    alert("未查到工位任务!");
                    return false;
                }
                $com.util.deleteLowerProperty(SubmitDate);
                if (!confirm("是否提交派工？")) {
                    return;
                }
                model.com.postSubmitAll({
                    data: SubmitDate,
                }, function (res) {
                    alert("派工成功");
                    model.com.refresh(mShiftID, ShiftNum);
                    model.com.refreshList(mShiftDate);
                })
            });

            //点击生产派工
            $("body").delegate(".lmvt-reset", "click", function () {

                var $this = $(this);
                // $this.closest('td[data-title=Handle]').parent("tr").css("background-color", "Aqua");
                // $this.closest('td[data-title=Handle]').parent("tr").siblings().css("background-color", "");

                mOrderID = Number($this.closest('td[data-title=Handle]').siblings('td[data-title=ID]').attr('data-value'));
                OrderNo = $this.closest('td[data-title=Handle]').siblings('td[data-title=OrderNo]').attr('data-value');
                mShiftID = $this.closest('td[data-title=Handle]').siblings('td[data-title=ShiftID]').attr('data-value');
                mShiftNum = $this.closest('td[data-title=Handle]').siblings('td[data-title=ShiftIndex]').attr('data-value');
                mWorkShopID = $this.closest('td[data-title=Handle]').siblings('td[data-title=WorkShopID]').attr('data-value');
                mStatus = $this.closest('td[data-title=Handle]').siblings('td[data-title=Status]').attr('data-value');
                mTeamID = $this.closest('td[data-title=Handle]').attr("data-valueTeam");
                mShiftDateReCord = $this.closest('td[data-title=Handle]').attr(" data-valueShiftDate");
                mGroupID = -1;

                $(".zzza").show();
                $(".zzzc").hide();
                $(".zzzb").hide();
                if (mStatus >= 2) {
                    $(".TeamList").hide();
                    $(".GroupList").hide();
                } else {
                    var SelectTeamList = mTeamID.split(",")
                    WantTeam = [];
                    for (var i = 0; i < SelectTeamList.length; i++) {
                        for (var k = 0; k < wMonitorAll.length; k++) {
                            if (wMonitorAll[k].ID == SelectTeamList[i]) {
                                WantTeam.push(wMonitorAll[k]);
                            }
                        }
                    }
                    if (WantTeam.length == 1) {
                        $(".TeamList").hide();
                        $(".GroupList").show();
                        var GroupArray = [];
                        if (WantTeam[0].ChargeGroupList.length > 0) {
                            for (var m = 0; m < WantTeam[0].ChargeGroupList.length; m++) {
                                GroupArray.push({
                                    GroupID: WantTeam[0].ChargeGroupList[m].ID,
                                    GroupName: WantTeam[0].ChargeGroupList[m].Name,
                                })
                            }
                            $(".lmvt-changeMoNameGroup").text(GroupArray[0].GroupName);
                            $(".GroupList .GroupUL").html($com.util.template(GroupArray, HTML.GroupLI));
                        }
                    } else {
                        $(".GroupList").show();
                        $(".TeamList").show();
                        var TeamList = [];
                        var GroupArray = [];
                        for (var j = 0; j < WantTeam.length; j++) {
                            TeamList.push({
                                TeamID: WantTeam[j].ID,
                                TeamName: WantTeam[j].Name,
                            });
                            if (j == 0 && WantTeam[0].ChargeGroupList.length > 0) {
                                for (var m = 0; m < WantTeam[0].ChargeGroupList.length; m++) {
                                    GroupArray.push({
                                        GroupID: WantTeam[0].ChargeGroupList[m].ID,
                                        GroupName: WantTeam[0].ChargeGroupList[m].Name,
                                    })
                                }
                            }
                        }
                        $(".lmvt-changeMoNameTeam").text(TeamList[0].GroupName);
                        $(".TeamList .TeamUL").html($com.util.template(TeamList, HTML.TeamLI));
                        if (GroupArray.length > 0) {
                            $(".lmvt-changeMoNameGroup").text(GroupArray[0].GroupName);
                            $(".GroupList .GroupUL").html($com.util.template(GroupArray, HTML.GroupLI));
                        }
                    }
                }
                model.com.refresh(mShiftID, mShiftNum);
                return false;
            });

            //点击派工记录
            $("body").delegate(".lmvt-record", "click", function () {
                var $this = $(this);

                mOrderID = Number($this.closest('td[data-title=Handle]').siblings('td[data-title=ID]').attr('data-value'));
                OrderNo = $this.closest('td[data-title=Handle]').siblings('td[data-title=OrderNo]').attr('data-value');
                mShiftID = $this.closest('td[data-title=Handle]').siblings('td[data-title=ShiftID]').attr('data-value');
                mShiftNumRecord = $this.closest('td[data-title=Handle]').siblings('td[data-title=ShiftIndex]').attr('data-value');
                mWorkShopID = $this.closest('td[data-title=Handle]').siblings('td[data-title=WorkShopID]').attr('data-value');
                mShiftDateReCord = $this.closest('td[data-title=Handle]').attr(" data-valueShiftDate");

                $(".zzza").hide();
                $(".zzzc").hide();
                $(".zzzb").show();
                $("#lmvt-ShiftDate-record").val($com.util.format('yyyy-MM-dd', mShiftDateReCord));

                $(".search-content-ShiftIDRecord").selectpicker('val', mShiftNumRecord);//设置选中 
                $(".search-content-ShiftIDRecord").selectpicker('refresh');
                model.com.refreshRecord(mShiftID, mShiftNumRecord);
            });
            //派工记录
            $("body").delegate("#zace-open-record", "click", function () {
                $(".zzza").hide();
                $(".zzzc").hide();
                $(".zzzb").show();
                mShiftNumRecord = mShiftNum;
                $("#lmvt-ShiftDate-record").val($com.util.format('yyyy-MM-dd', mShiftDateReCord));

                $(".search-content-ShiftIDRecord").selectpicker('val', mShiftNumRecord);//设置选中 
                $(".search-content-ShiftIDRecord").selectpicker('refresh');
                model.com.refreshRecord(mShiftID, mShiftNumRecord);
            });
            //从派工记录返回工单列表
            $("body").delegate("#zace-back-export", "click", function () {
                $(".zzza").hide();
                $(".zzzc").show();
                $(".zzzb").hide();
            });
            //从派工界面返回工单列表
            $("body").delegate("#zace-back-dispath", "click", function () {
                $(".zzza").hide();
                $(".zzzc").show();
                $(".zzzb").hide();
            });

            $("body").delegate(".GroupUL li", "click", function () {
                $this = $(this);
                mGroupID = $this.attr("data-value");
                $(".lmvt-changeMoNameGroup").text($this.find("a").text());
                model.com.refresh(mShiftID, mShiftNum);
            });
            $("body").delegate(".TeamUL li", "click", function () {
                $this = $(this);
                mTeamID = $this.attr("data-value");
                $(".lmvt-changeMoNameTeam").text($this.find("a").text());
                var GroupArray = [];

                for (var m = 0; m < WantTeam.length; m++) {
                    if (WantTeam[m].ID == mTeamID) {
                        for (var k = 0; k < WantTeam[m].ChargeGroupList.length; k++) {
                            GroupArray.push({
                                GroupID: WantTeam[m].ChargeGroupList[k].ID,
                                GroupName: WantTeam[m].ChargeGroupList[k].Name,
                            })
                        }
                    }
                }
                $(".lmvt-changeMoNameGroup").text(GroupArray[0].GroupName);
                $(".GroupList .GroupUL").html($com.util.template(GroupArray, HTML.GroupLI));
                mGroupID = GroupArray[0].GroupID;
                model.com.refresh(mShiftID, mShiftNum);
            });
            //排班列表
            $("#lmvt-ShiftDate").datetimepicker({
                format: 'yyyy-mm-dd',//显示格式
                // startView: 'year',
                maxView: 2,
                minView: 2,
                language: 'zh-CN',
                autoclose: true,//选择后自动关闭
                clearBtn: true,//清除按钮
                todayBtn: true,
                showClear: true,
            }).on('changeDate', function () {
                mShiftDate = $("#lmvt-ShiftDate").val();
            });

            //查询 排班列表
            $("body").delegate("#lmvt-search", "click", function () {
                mShiftDate = $("#lmvt-ShiftDate").val();
                mWorkShopID = !$(".search-content-WorkShopID").val() ? 1 : $(".search-content-WorkShopID").val();
                WorkShopName = WorkShopIDList[mWorkShopID];
                ShiftNumOrder = !$(".search-content-ShiftID").val() ? 1 : $(".search-content-ShiftID").val();
                mShiftDateFirst = model.com.getShiftID(mShiftDate);
                ShiftNumOrderFirst = ShiftNumOrder;
                if (mShiftDate == "") {
                    mShiftDate = $com.util.format("yyyy-MM-dd", new Date().getTime());
                }
                model.com.refreshList(mShiftDate);
            });
            //重置 排班列表
            $("body").delegate("#lmvt-reset", "click", function () {
                $("#lmvt-ShiftDate").val($com.util.format('yyyy-MM-dd', new Date()));
                $("select.selectpicker").each(function () {
                    $(this).selectpicker('val', $(this).find('option:first').val());    //重置bootstrap-select显示
                    $(this).find("option").attr("selected", false);                    //重置原生select的值
                    $(this).find("option:first").attr("selected", true);
                });
            });
            //展开 排班列表
            $("body").delegate("#lmvt-resetZK", "click", function () {
                $(".ds-search-top-contain").attr("data-show-mode", 1);
                $(window).resize();
            });
            //收起 排班列表
            $("body").delegate("#lmvt-resetSQ", "click", function () {
                $(".ds-search-top-contain").attr("data-show-mode", 0);
                $(window).resize();
            });
            //重置 派工记录
            $("body").delegate("#lmvt-reset-record", "click", function () {
                $("#lmvt-ShiftDate-record").val($com.util.format('yyyy-MM-dd', mShiftDateReCord));
                $(".search-content-ShiftIDRecord").selectpicker('val', mShiftNumRecord);//设置选中 
                $(".search-content-ShiftIDRecord").selectpicker('refresh');
            });
            //展开 派工记录
            $("body").delegate("#lmvt-resetZK-record", "click", function () {
                $(".ds-search-top-contain").attr("data-show-mode", 1);
                $(window).resize();
            });
            //收起 派工记录
            $("body").delegate("#lmvt-resetSQ-record", "click", function () {
                $(".ds-search-top-contain").attr("data-show-mode", 0);
                $(window).resize();
            });
            //派工记录
            $("#lmvt-ShiftDate-record").datetimepicker({
                format: 'yyyy-mm-dd',//显示格式
                // startView: 'year',
                maxView: 2,
                minView: 2,
                language: 'zh-CN',
                autoclose: true,//选择后自动关闭
                clearBtn: true,//清除按钮
                todayBtn: true,
                showClear: true,
            }).on('changeDate', function () {
                mShiftDate = $("#lmvt-ShiftDate-record").val();
            });
            //查询 派工记录
            $("body").delegate("#lmvt-search-record", "click", function () {
                mShiftDate = $("#lmvt-ShiftDate-record").val();
                mShiftNumRecord = !$(".search-content-ShiftIDRecord").val() ? 1 : $(".search-content-ShiftIDRecord").val();
                if (mShiftDate.length == "") {
                    mShiftDate = $com.util.format("yyyy-MM-dd", mShiftDateReCord);
                }
                mShiftID = model.com.getShiftID(mShiftDate);
                model.com.refreshRecord(mShiftID, mShiftNumRecord);
            });
            // window.resizeObjectArray.splice(0, 0, function () {
            //     $(".ds-search-top-contain").each(function (i, item) {
            //         model.com.searchTopHeight($(item));
            //     });
            //     $(".ds-search-top-contain-record").each(function (i, item) {
            //         model.com.searchTopHeight($(item));
            //     });
            // })
        },

        run: function () {
            mShiftDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()); //时间
            mStartDate = $com.util.format('yyyy-MM-dd', new Date()) + ' 00:00:00';
            mEndDate = $com.util.format('yyyy-MM-dd', new Date()) + ' 23:59:59';
            LoginOBJ = window.parent.User_Info;
            SelectWorkShopID = [];
            $("#lmvt-ShiftDate").val($com.util.format('yyyy-MM-dd', new Date()));
            for (var m = 0; m < LoginOBJ.RoleList.length; m++) {
                if (LoginOBJ.RoleList[m].FunctionID == 501003) {
                    SelectWorkShopID.push({
                        Name: "模组车间",
                        ID: 1
                    })
                }
                if (LoginOBJ.RoleList[m].FunctionID == 501004) {
                    SelectWorkShopID.push({
                        Name: "单体车间",
                        ID: 2
                    })
                }
            }
            if (SelectWorkShopID.length > 0) {
                mWorkShopID = SelectWorkShopID[0].ID;
                WorkShopName = WorkShopIDList[SelectWorkShopID[0].ID];
                var selectWorkShopIDSearch = $("#slpkWorkShopID_search");
                model.com.ProcessingData(SelectWorkShopID, selectWorkShopIDSearch);

                var selectShiftIDSearch = $("#slpkShiftID_search");
                model.com.ProcessingData(ShiftIndexSelect, selectShiftIDSearch);

                var selectShiftIDSearchRecord = $("#slpkShiftID_search-record");
                model.com.ProcessingData(ShiftIndexSelect, selectShiftIDSearchRecord);
            } else {
                mWorkShopID = -1;
                WorkShopName = "";
                SelectWorkShopID = [];
                var selectWorkShopIDSearch = $("#slpkWorkShopID_search");
                model.com.ProcessingData(SelectWorkShopID, selectWorkShopIDSearch);
                ShiftIndexSelect = []
                var selectShiftIDSearch = $("#slpkShiftID_search");
                model.com.ProcessingData(ShiftIndexSelect, selectShiftIDSearch);
                ShiftIndexSelect = [];
                var selectShiftIDSearchRecord = $("#slpkShiftID_search-record");
                model.com.ProcessingData(ShiftIndexSelect, selectShiftIDSearchRecord);
            }
            model.com.getCurrentShiftID({}, function (res1) {
                ShiftNumOrderFirst = res1.ShiftIndex;
                mShiftDateFirst = res1.info;

                model.com.getMonitorAll({
                }, function (res) {
                    wMonitorAll = $com.util.Clone(res.list);
                    //人员
                    model.com.getFPCProduct({ ProductTypeID: 0, BusinessUnitID: 0 }, function (res) {
                        wProduct = res.list;
                        model.com.get({ active: 1 }, function (resP) {
                            if (!resP)
                                return;
                            wUser = resP.list;
                            model.com.refreshListFirst(ShiftNumOrderFirst, mShiftDateFirst);
                        });
                    });
                });
            });

        },

        com: {
            searchTopHeight: function ($this) {
                var _SearchShowMode = $this.attr("data-show-mode");
                if (_SearchShowMode == 0) {
                    var _MaxLength = $this[0].offsetWidth - 10;
                    var _Length = $this.children(".ds-search-btn-group")[0].offsetWidth + 90;
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
                    // DataList.unshift({
                    //     ID: 0,
                    //     Name: "请选择"
                    // })
                    for (var i = 0; i < DataList.length; i++) {
                        Name = DataList[i].Name;
                        Value = DataList[i].ID;
                        select.append("<option value=" + Value + ">" + Name + "</option>");
                    }
                    $('.selectpicker').selectpicker('val', '');
                    $('.selectpicker').selectpicker('refresh');  //刷新数据源
                    $(".bootstrap-select-searchbox input").removeAttr("disabled");
                });
            },
            HandleDate: function (pID, sID, UserIDList) {
                for (var i = 0; i < SubmitDate.length; i++) {
                    if (SubmitDate[i].TaskStepList.length > 0) {
                        for (var j = 0; j < SubmitDate[i].TaskStepList.length; j++) {
                            if (SubmitDate[i].TaskStepList[j].WID == sID) {
                                SubmitDate[i].TaskStepList[j].WorkerID = [];
                                SubmitDate[i].TaskStepList[j].WorkerID = UserIDList;
                            }
                        }
                    }
                }
            },
            refreshListFirst: function (ShiftNumOrderFirst, mShiftDateFirst) {
                $com.app.loading('数据加载中...');
                model.com.getMonitorOrder({
                    ShiftID: mShiftDateFirst,
                    ShiftIndex: ShiftNumOrderFirst,
                    WorkShopID: mWorkShopID,
                }, function (resP) {
                    var GradeFirst = $com.util.Clone(resP.list);
                    model.com.Handle(GradeFirst);
                    $com.app.loaded();
                });
            },
            refreshList: function (mShiftDate) {
                $com.app.loading('数据加载中...');
                var _checkShiftIDOrder = model.com.getShiftID(mShiftDate);
                model.com.getMonitorOrder({
                    ShiftID: _checkShiftIDOrder,
                    ShiftIndex: ShiftNumOrder,
                    WorkShopID: mWorkShopID,
                }, function (resP) {
                    var Grade = $com.util.Clone(resP.list);
                    model.com.Handle(Grade);
                    $com.app.loaded();
                });
            },
            Handle: function (Grade) {
                for (var i = 0; i < Grade.length; i++) {
                    Grade[i].WID = i + 1;
                    for (var j = 0; j < wProduct.length; j++) {
                        if (wProduct[j].ID == Grade[i].ProductID) {
                            Grade[i].ProductName = wProduct[j].ProductName;
                        }
                    }
                    if (Grade[i].Status == 0 || Grade[i].Status == 1) {
                        Grade[i].StatusText = "未派";
                        Grade[i].StatusColorText = "#fa1ff4c9";
                    } else if (Grade[i].Status == 2) {
                        Grade[i].StatusText = "已派";
                        Grade[i].StatusColorText = "green";
                    } else if (Grade[i].Status == 3) {
                        Grade[i].StatusColorText = "#a94442";
                        Grade[i].StatusText = "已做";
                    }
                    Grade[i].ShiftDate = $com.util.format("yyyy-MM-dd", Grade[i].ShiftDate);
                    Grade[i].ShiftIndexName = ShiftIndexNameList[Grade[i].ShiftIndex];
                    if (Grade[i].OrderPlan == 0 || Grade[i].OrderFinish > Grade[i].OrderPlan) {
                        Grade[i].OrderProgressNow = 100;
                    } else {
                        Grade[i].OrderProgressNow = (Grade[i].OrderFinish / Grade[i].OrderPlan) * 100;
                    }
                    Grade[i].OrderFinishPer = Grade[i].OrderFinish + "/" + Grade[i].OrderPlan;
                    Grade[i].OrderProgress = $com.util.template(Grade[i], HTML.OrderProgress);

                    if (Grade[i].PlanNum == 0 || Grade[i].FinishNum > Grade[i].PlanNum) {
                        Grade[i].PlanProgressNow = 100;
                    } else {
                        Grade[i].PlanProgressNow = (Grade[i].FinishNum / Grade[i].PlanNum) * 100;
                    }
                    Grade[i].PlanFinishPer = Grade[i].FinishNum + "/" + Grade[i].PlanNum;
                    Grade[i].PlanProgress = $com.util.template(Grade[i], HTML.PlanProgress);
                }
                DataAllSearchOrder = $com.util.Clone(Grade);
                if (SelectWorkShopID.length > 0) {
                    $(".Title-PC").text(WorkShopName + "-" + "排班列表" + "-" + mShiftDateFirst + "-" + ShiftIndexNameList[ShiftNumOrderFirst]);
                    $("#femi-riskLevelList-tbody").html($com.util.template(Grade, HTML.TableModeList));
                } else {
                    $(".Title-PC").text("排班列表");
                    alert("该登录人未绑定对应权限！");
                    var ShowArray = [];
                    $("#femi-riskLevelList-tbody").html($com.util.template(ShowArray, HTML.TableModeList));
                }

                $(window).resize();
            },
            getShiftID: function (DateT) {
                var _id = 0;
                var DateTime = new Date(DateT);
                _id = DateTime.getFullYear() * 10000 + (DateTime.getMonth() + 1) * 100 + DateTime.getDate();

                return _id;
            },
            //将时间全部转化为秒
            computingTime: function (Time) {
                TimeAll = Number(Time.split(":")[0] * 3600 + Time.split(":")[1] * 60 + Time.split(":")[2]);
                return TimeAll
            },
            compare_hms: function (a, b) {
                var i = model.com.computingTime($com.util.format('hh:mm:ss', a)) + 30 * 60;
                var n = model.com.computingTime($com.util.format('hh:mm:ss', b));

                if (i > n) {
                    // alert("a大");
                    Flag = true;
                } else if (i < n) {
                    // alert("b大");
                    Flag = false;
                } else {
                    // alert("一样大");
                    Flag = false;
                }
                return Flag
            },
            refresh: function (mShiftID, ShiftNum) {
                $com.app.loading('数据加载中...');
                model.com.getOrderRecord({
                    ShiftID: mShiftID,
                    OrderID: mOrderID,
                    ShiftIndex: ShiftNum,
                    GroupID: mGroupID,
                    WorkShopID: mWorkShopID,
                }, function (resP) {
                    if (resP && resP.list) {
                        var Grade = $com.util.Clone(resP.list);
                        DATABasic = $com.util.Clone(resP.list);
                        //审核数据
                        DataAllConfirm = $com.util.Clone(resP.list);

                        DataAll = $com.util.Clone(Grade);
                        var WantDate = [];
                        T = 0;
                        $.each(Grade, function (i, item) {
                            $.each(item.TaskStepList, function (j, jtem) {
                                T = T + 1;
                                jtem.WID = T;
                                jtem.StatusColorText = StatusColor[jtem.Status];
                                jtem.StatusText = STATUS[jtem.Status];
                                if (jtem.WorkerID.length > 0) {
                                    jtem.WorkerNames = model.com.getUserName(jtem.WorkerID.join(","), wUser);
                                } else {
                                    jtem.WorkerNames = "";
                                }
                                for (var m = 0; m < TypeSource_Level.ShiftNum.length; m++) {
                                    if (TypeSource_Level.ShiftNum[m].value == jtem.ShiftIndex) {
                                        jtem.ShiftIndexName = TypeSource_Level.ShiftNum[m].name;
                                    }
                                }
                                jtem.ShiftDate = $com.util.format("yyyy-MM-dd", jtem.ShiftDate);
                                WantDate.push(jtem);
                            });
                        });
                        SubmitDate = $com.util.Clone(Grade);
                        DataAllSearch = $com.util.Clone(WantDate);
                        $(".title-dispath").text(WorkShopIDList[mWorkShopID] + "-" + mShiftID + "-" + ShiftIndexNameList[mShiftNum] + "-" + "派工");
                        $("#femi-riskLevel-tbody").html($com.util.template(WantDate, HTML.TableMode));
                        $(window).resize();
                        $com.app.loaded();
                    }
                });
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

                if (wIDArray[0] == "-100") {
                    wResult.push("MES系统");
                }

                return wResult.join(",");
            },
            //查询
            getCurrentShiftID: function (data, fn, context) {
                var d = {
                    $URI: "/SCHShift/CurrentShiftID",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询车间
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
            //班组长制定某天派工
            getOrderRecord: function (data, fn, context) {
                var d = {
                    $URI: "/SFCTaskPart/OrderRecord",
                    $TYPE: "get",
                    $SERVER: '/MESAPS',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
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
            //获取班组以及分组
            getMonitorAll: function (data, fn, context) {
                var d = {
                    $URI: "/TeamManage/MonitorAll",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('主页加载失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取当前激活班次
            getFMCWorkDay: function (data, fn, context) {
                var d = {
                    $URI: "/FMCWorkDay/Info",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('主页加载失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //通过APSTaskPartID 查询工位 工步
            getAllDate: function (data, fn, context) {
                var d = {
                    $URI: "/SFCTaskStep/All",
                    $TYPE: "get",
                    $SERVER: '/MESAPS',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            refreshRecord: function (mShiftID, ShiftNumRecord) {
                $com.app.loading('数据加载中...');
                // var _checkShiftID = model.com.getShiftID(mShiftDate);
                model.com.getMonitorRecord({
                    ShiftID: mShiftID,
                    ShiftIndex: ShiftNumRecord,
                    OrderID: mOrderID,
                }, function (resP) {
                    if (!resP) {
                        $com.app.loaded();
                        return;
                    }
                    if (resP && resP.list) {
                        var Grade = $com.util.Clone(resP.list);
                        for (var i = 0; i < Grade.length; i++) {
                            Grade[i].WID = i + 1;
                            Grade[i].StatusColorText = StatusColor[Grade[i].Status];
                            Grade[i].StatusTextRecored = STATUS[Grade[i].Status];
                            Grade[i].WorkerNames = model.com.getUserName(Grade[i].WorkerID.join(","), wUser);
                            Grade[i].ShiftDate = $com.util.format("yyyy-MM-dd", Grade[i].ShiftDate);
                            for (var m = 0; m < TypeSource_Level.ShiftNumRecord.length; m++) {
                                if (TypeSource_Level.ShiftNumRecord[m].value == Grade[i].ShiftIndex) {
                                    Grade[i].ShiftIndexName = TypeSource_Level.ShiftNumRecord[m].name;
                                }
                            }
                        }
                        DataAllSearchRecord = $com.util.Clone(Grade);
                        $(".title-record").text(WorkShopIDList[mWorkShopID] + "-" + mShiftID + "-" + ShiftIndexNameList[mShiftNumRecord] + "-" + "派工记录" + "(" + OrderNo + ")");
                        $("#femi-RecordLevel-tbody").html($com.util.template(Grade, HTML.TableRecordMode));
                        $(window).resize();
                        $com.app.loaded();
                    }
                });

            },

            //班组长查询某天的派工记录
            getMonitorRecord: function (data, fn, context) {
                var d = {
                    $URI: "/SFCTaskStep/All",
                    $TYPE: "get",
                    $SERVER: '/MESAPS',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询人员
            getSelectEmployeeList: function (data, fn, context) {
                var d = {
                    $URI: "/SFCTaskStep/SelectEmployeeList",
                    $TYPE: "post",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },


            //查询任务
            getAPSStepTask: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskStep/MonitorTaskList",
                    $TYPE: "get",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //查询派工人员
            getPGEmployeeList: function (data, fn, context) {
                var d = {
                    $URI: "/SFCTaskPart/PGEmployeeList",
                    $TYPE: "get",
                    $SERVER: '/MESAPS',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //保存
            postPGAPSStepTask: function (data, fn, context) {
                var d = {
                    $URI: "/SFCTaskStep/PGEmployeeUpdate",
                    $TYPE: "post",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getMonitorOrder: function (data, fn, context) {
                var d = {
                    $URI: "/APSPersonSchedule/MonitorAll",
                    $TYPE: "get",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //根据状态查询订单
            getOMSOrderStatus: function (data, fn, context) {
                var d = {
                    $URI: "/OMSOrder/StatusAll",
                    $TYPE: "get",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询任务
            getCarStepList: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskStep/CarStepList",
                    $TYPE: "get",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //一次性提交派工人员
            postSubmitAll: function (data, fn, context) {
                var d = {
                    $URI: "/SFCTaskPart/SubmitAll",
                    $TYPE: "post",
                    $SERVER: '/MESAPS',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //新增人员
            AddAPSStepTask: function (data, fn, context) {
                var d = {
                    $URI: "/SFCTaskStep/AddPerson",
                    $TYPE: "post",
                    $SERVER: '/MESAPS',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //保存派工  PersonIDList
            postSaveAll: function (data, fn, context) {
                var d = {
                    $URI: "/SFCTaskPart/AddPerson",
                    $TYPE: "post",
                    $SERVER: '/MESAPS',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //审核
            postAudit: function (data, fn, context) {
                var d = {
                    $URI: "/BusinessUnit/Audit",
                    $TYPE: "post"
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