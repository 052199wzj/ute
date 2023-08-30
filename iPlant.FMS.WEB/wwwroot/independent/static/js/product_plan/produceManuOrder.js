require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/ganttSreach'], function ($zace, $com, $gantt) {

    var KEYWORD_Level_LIST,
        KEYWORD_Level,
        FORMATTRT_Level,
        DEFAULT_VALUE_Level,
        TypeSource_Level,
        AllBomList,
        KEYWORD_LinkManCustomer_LIST,
        KEYWORD_LinkManCustomer,
        FORMATTRT_LinkManCustomer,
        CustomerTemp_LinkManCustomer,
        TypeSource_LinkManCustomer,
        WeekDatalist,
        KEYWORD_Level_LISTItem,
        KEYWORD_LevelItem,
        FORMATTRT_LevelItem,
        DEFAULT_VALUE_LevelItem,
        TypeSource_LevelItem,
        MaterialList,
        model,
        DataAll,
        DataAllItem,
        DataAllSearchItem,
        DATABasic,
        DataAllConfirmBasic,
        DataAllConfirmChange,
        DataAllConfirm,
        DataAllSearch,
        DataAllFactorySearch,
        BusinessUnitID,
        FactoryID,
        No,
        WorkShopID,
        ProductNoList,
        CommandID,
        HTML;
    WeekDatalist = [];
    No = "";
    WorkShopID = BusinessUnitID = FactoryID = CommandID = 0;
    DataAll = ProductNoList = [];
    DataAllSearchItem = DataAllItem = MaterialList = [];
    DATABasic = [];
    DataAllConfirmBasic = [];
    DataAllConfirmChange = [];
    DataAllConfirm = [];
    DataAllFactorySearch = DataAllSearch = [];
    PositionTemp = {
        Active: true,
        Auditor: window.parent.User_Info.Name,
        AuditorID: 0,
        AuditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        BusinessUnitID: 0,   //车型
        BusinessUnit: "",
        ContactCode: "",     //备注
        CustomerCode: "",
        CustomerID: 0,       //局段
        CustomerName: "",
        ErrorCode: 0,
        Factory: "",         //修程
        FactoryID: 1,
        CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Creator: window.parent.User_Info.Name,
        CreatorID: 0,
        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Editor: window.parent.User_Info.Name,
        EditorID: 0,
        LinkMan: "",
        LinkManID: 0,
        LinkPhone: "",
        ID: 0,
        No: "",      //订单号
        OrderList: [],
        Status: 1,
        StatusText: "",
        FQTYPlan: 0,
        FQTYActual: 0,
    };

    OMSOrderListTemp = {
        ID: 0,
        OrderNo: "",
        ProductID: 0,
        MaterialNo: "",
        MaterialName: "",
        FQTY: 1,
        WorkShopID: 0,
        LineID: 0,
        PartID: 0,   //局段
        BOMNo: "",
        Priority: 0,
        Status: 0,
        Type: 0,
        PlanDate: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        ActualDate: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        ShiftPeriod: 0,
        StartDate: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        FinishedDate: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Active: 1,
        CreatorID: 0,
        AuditorID: 0,
        AuditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        EntryID: 0,
        SessionTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        FQTYDone: 0,
        FQTYGood: 0,
        FQTYBad: 0,
        PartHours: 0,
        MESIPT: 0,
        OrderText: "",
        CommandID: 0,
        Code: "",
        Remark: "",


    };

    HTML = {
        TablePlanMode: [
            '<tr data-color="">',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            //'<td data-title="ShiftID" data-value="{{ShiftID}}" >{{ShiftID}}</td>',
            '<td data-title="ShiftName" data-value="{{ShiftName}}" >{{ShiftName}}</td>',
            '<td data-title="LineName" data-value="{{LineName}}" >{{LineName}}</td>',
            '<td data-title="MaterialNo" data-value="{{MaterialNo}}" >{{MaterialNo}}</td>',
            '<td data-title="MaterialName" data-value="{{MaterialName}}" >{{MaterialName}}</td>',
            '<td data-title="OrderNo" data-value="{{OrderNo}}" >{{OrderNo}}</td>',
            '<td data-title="FQTY" data-value="{{FQTY}}" >{{FQTY}}</td>',
            '<td data-title="FQTYShift" data-value="{{FQTYShift}}" >{{FQTYShift}}</td>',
            '<td data-title="ProductNo" data-value="{{ProductNo}}" >{{ProductNo}}</td>',

            '<td data-title="SubmitTime" data-value="{{SubmitTime}}" >{{SubmitTime}}</td>',
            '<td data-title="AuditorID" data-value="{{AuditorID}}" >{{AuditorID}}</td>',
            '<td data-title="AuditTime" data-value="{{AuditTime}}" >{{AuditTime}}</td>',
            '<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',
            '</tr>',
        ].join(""),
        TableMode: [
            '<tr data-color="">',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="No" data-value="{{No}}" >{{No}}</td>',
            '<td data-title="FactoryID" data-value="{{FactoryID}}" >{{FactoryID}}</td>',
            '<td data-title="CustomerID" data-value="{{CustomerID}}" >{{CustomerID}}</td>',
            '<td data-title="BusinessUnitID" data-value="{{BusinessUnitID}}" >{{BusinessUnitID}}</td>',
            '<td data-title="FQTYPlan" data-value="{{FQTYPlan}}" >{{FQTYPlan}}</td>',
            '<td data-title="FQTYActual" data-value="{{FQTYActual}}" >{{FQTYActual}}</td>',
            '<td data-title="ContactCode" data-value="{{ContactCode}}" >{{ContactCode}}</td>',
            '<td data-title="Creator" data-value="{{Creator}}" >{{Creator}}</td>',
            '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
            // '<td data-title="Auditor" data-value="{{Auditor}}" >{{Auditor}}</td>',
            // '<td data-title="AuditTime" data-value="{{AuditTime}}" >{{AuditTime}}</td>',
            '<td data-title="Active" data-value="{{Active}}" >{{Active}}</td>',
            // '<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',

            '</tr>',
        ].join(""),
        TableItemMode: [
            '<tr data-color="">',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="OrderNo" data-value="{{OrderNo}}" >{{OrderNo}}</td>',
            '<td data-title="Priority" data-value="{{Priority}}" >{{Priority}}</td>',
            '<td data-title="LineID" data-value="{{LineID}}" >{{LineID}}</td>',
            '<td data-title="PartID" data-value="{{PartID}}" >{{PartID}}</td>',
            '<td data-title="ProductID" data-value="{{ProductID}}" >{{ProductID}}</td>',
            '<td data-title="Code" data-value="{{Code}}" >{{Code}}</td>',
            // '<td data-title="FQTY" data-value="{{FQTY}}" >{{FQTY}}</td>',
            // '<td data-title="ShiftPeriod" data-value="{{ShiftPeriod}}" >{{ShiftPeriod}}</td>',
            // '<td data-title="Type" data-value="{{Type}}" >{{Type}}</td>',
            '<td data-title="Remark" data-value="{{Remark}}" >{{Remark}}</td>',
            '<td data-title="PlanDate" data-value="{{PlanDate}}" >{{PlanDate}}</td>',
            '<td data-title="ActualDate" data-value="{{ActualDate}}" >{{ActualDate}}</td>',
            // '<td data-title="StartDate" data-value="{{StartDate}}" >{{StartDate}}</td>',
            // '<td data-title="FinishedDate" data-value="{{FinishedDate}}" >{{FinishedDate}}</td>',
            '<td data-title="Active" data-value="{{Active}}" >{{Active}}</td>',
            '</tr>',
        ].join(""),
        TableUserItemNode: [
            '<tr data-color="">',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            //'<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="LineName" data-value="{{LineName}}" >{{LineName}}</td>',
            '<td data-title="PartName" data-value="{{PartName}}" >{{PartName}}</td>',
            '<td data-title="OrderNo" data-value="{{OrderNo}}" >{{OrderNo}}</td>',
            '<td data-title="ProductNo"  data-value="{{ProductNo}}" >{{ProductNo}}</td>',
            '<td data-title="FQTYSum"  data-value="{{FQTYSum}}" >{{FQTYSum}}</td>',
            '{{tds}}',
            '</tr>',
        ].join(""),

        thead: [
            '<tr>',
            '<th><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            //'<th data-order="ID"  style="min-width: 50px">序号</td>',
            '<th data-order="LineName" style="min-width: 50px" >产线</td>',
            '<th data-order="PartName" style="min-width: 50px" >工序</td>',
            '<th data-order="OrderNo" style="min-width: 50px" >订单</td>',
            '<th data-order="ProductNo" style="min-width: 50px" >规格</td>',
            '<th data-order="FQTYSum" style="min-width: 50px" >总数</td>',
            '{{ths}}',
            '</tr>',
        ].join(""),
        th: ['<th data-order="{{WorkDate}}" style="min-width: 50px" >{{ColumnText}}</th>'].join(""),
        td: ['<td  class="edit-td" data-title="{{ShiftDate}}"   data-value="{{FQTYShift}}" >{{FQTYShift}}</td>',].join(""),


    };
    //订单计划
    (function () {
        KEYWORD_LinkManCustomer_LIST = [
            "Status|状态|ArrayOne",
            "AuditorID|审批人|ArrayOne",
        ];
        KEYWORD_LinkManCustomer = {};
        FORMATTRT_LinkManCustomer = {};

        TypeSource_LinkManCustomer = {

            Status: [
                {
                    name: "创建",
                    value: 1
                }, {
                    name: "下达",
                    value: 2
                }, {
                    name: "审核",
                    value: 3
                }, {
                    name: "反审核",
                    value: 4
                }
            ],
            AuditorID: [],

        };

        $.each(KEYWORD_LinkManCustomer_LIST, function (x, item1) {
            var detail = item1.split("|");
            KEYWORD_LinkManCustomer[detail[0]] = {
                index: x,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_LinkManCustomer[detail[0]] = $com.util.getFormatter(TypeSource_LinkManCustomer, detail[0], detail[2]);
            }
        });
    })();

    (function () {
        KEYWORD_Level_LIST = [
            "No|订单号",
            "FactoryID|修程|ArrayOne",
            "CustomerID|局段|ArrayOne",
            "BusinessUnitID|车型|ArrayOne",
            "FQTYPlan|计划数量",
            "FQTYActual|实际数量",
            "ContactCode|备注",
            "Status|状态|ArrayOne",
            "Active|激活|ArrayOne",
            "CreateTime|时间|DateTime",
            "EditTime|时间|DateTime",
            "AuditTime|时间|DateTime",

        ];
        KEYWORD_Level = {};
        FORMATTRT_Level = {};

        DEFAULT_VALUE_Level = {
            No: "",
            ContactCode: "",
            CustomerID: 0,
            BusinessUnitID: 0,
            FactoryID: 0,
            FQTYPlan: 0,
            FQTYActual: 0,
            //LinkManID: 0,
        };

        TypeSource_Level = {
            Active: [
                {
                    name: "激活",
                    value: true
                }, {
                    name: "禁用",
                    value: false
                }
            ],
            BusinessUnitID: [

            ],
            CustomerID: [],
            FactoryID: [

            ],
            Status: [
                //{
                //    name: "默认值",
                //    value: 0
                //},
                {
                    name: "创建",
                    value: 1
                }, {
                    name: "待审核",
                    value: 2
                }, {
                    name: "已审核",
                    value: 3
                }, {
                    name: "撤销审核",
                    value: 4
                },],



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
    //item
    (function () {
        KEYWORD_Level_LISTItem = [
            "PlanDate|计划到场日期|Date",
            "ActualDate|实际到场日期|Date",
            "StartDate|生产日期|Date",
            "FinishedDate|完成日期|Date",
            "OrderNo|明细号",
            "Priority|优先级",
            "LineID|修程|ArrayOne",
            "PartID|局段|ArrayOne",
            "ProductID|车型|ArrayOne",
            "Code|车号",
            "ShiftPeriod|计划|ArrayOne",
            "Type|类型|ArrayOne",
            "FQTY|数量",
            "Remark|备注",
            "CreateTime|时间|DateTime",
            "Status|状态|ArrayOne",
            "Active|激活|ArrayOne",
        ];
        KEYWORD_LevelItem = {};
        FORMATTRT_LevelItem = {};

        DEFAULT_VALUE_LevelItem = {
            Priority: 0,
            LineID: 0,
            PartID: 0,
            ProductID: 0,
            OrderNo: "",
            // ShiftPeriod: 0,
            // Type: 1,
            Code: "",
            // MaterialNo: "",
            // FQTY: 0,
            Remark: "",
            PlanDate: $com.util.format('yyyy-MM-dd', new Date()),
            ActualDate: $com.util.format('yyyy-MM-dd', new Date()),
            // StartDate: $com.util.format('yyyy-MM-dd', new Date()),
            // FinishedDate: $com.util.format('yyyy-MM-dd', new Date()),
        };

        TypeSource_LevelItem = {

            LineID: [],
            ProductID: [],
            Active: [
                {
                    name: "激活",
                    value: 1
                }, {
                    name: "禁用",
                    value: 0
                }
            ],
            ShiftPeriod: [
                {
                    name: "周",
                    value: 5
                }, {
                    name: "月",
                    value: 6
                }
            ],
            Type: [
                {
                    name: "预测",
                    value: 1
                }, {
                    name: "实体",
                    value: 2
                }
            ],
            Status: [
                //{
                //    name: "默认值",
                //    value: 0
                //},
                {
                    name: "创建",
                    value: 1
                }, {
                    name: "待审核",
                    value: 2
                }, {
                    name: "已审核",
                    value: 3
                }, {
                    name: "撤销审核",
                    value: 4
                },],



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
        name: '岗位',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {

            //导出 
            $("body").delegate("#zace-exportApproval-level", "click", function () {
                var $table = $(".table-partApproval"),
                    fileName = "进车计划.xls",
                    Title = "进车计划";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });



            });

            $("body").delegate("#femi-riskLevel-tbody tr", "dblclick", function () {

                var $this = $(this);
                var WName = $this.find('td[data-title=ContactCode]').attr('data-value');
                var WID = Number($this.find('td[data-title=ID]').attr('data-value'));
                var WNo = $this.find('td[data-title=No]').attr('data-value');
                $("#zace-span-change").html(WNo);
                CommandID = WID;
                No = WNo;
                model.com.refreshItem();



            });
            //zace-returnItem-level
            $("body").delegate("#zace-returnItem-level", "click", function () {

                $(".zzzOrderItem").hide();
                $(".zzzOrderPlan").hide();
                $(".zzza").show();
                $(".zzzb").hide();
                $(".zzzd").hide();
                $(".zzzOrderGant").hide();
            });


            //制造令新增
            $("body").delegate("#zace-add-level", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    PositionTemp.BusinessUnitID = Number(rst.BusinessUnitID);
                    // PositionTemp.FactoryID = Number(rst.FactoryID);              
                    PositionTemp.No = rst.No;
                    PositionTemp.CustomerID = Number(rst.CustomerID);
                    PositionTemp.FactoryID = Number(rst.FactoryID);
                    PositionTemp.ContactCode = rst.ContactCode;
                    PositionTemp.FQTYPlan = Number(rst.FQTYPlan);
                    PositionTemp.FQTYActual = Number(rst.FQTYActual);


                    model.com.postCommandSave({
                        data: PositionTemp,
                    }, function (res) {

                        alert("新增成功");
                        model.com.refresh();


                    })

                }, TypeSource_Level));


            });
            //制造令修改
            $("body").delegate("#zace-edit-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                // if (SelectData[0].Status != 1) {
                //     alert("数据选择有误,请选择状态为创建的数据!")
                //     return;
                // }
                var default_value = {
                    No: SelectData[0].No,
                    BusinessUnitID: SelectData[0].BusinessUnitID,
                    CustomerID: SelectData[0].CustomerID,
                    ContactCode: SelectData[0].ContactCode,
                    FactoryID: SelectData[0].FactoryID,
                    FQTYPlan: SelectData[0].FQTYPlan,
                    FQTYActual: SelectData[0].FQTYActual,
                    Active: SelectData[0].Active,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].No = rst.No;
                    SelectData[0].BusinessUnitID = Number(rst.BusinessUnitID);
                    SelectData[0].ContactCode = rst.ContactCode;
                    SelectData[0].CustomerID = Number(rst.CustomerID);
                    // SelectData[0].FactoryID = Number(rst.FactoryID);
                    SelectData[0].FactoryID = Number(rst.FactoryID);
                    SelectData[0].Active = rst.Active;
                    SelectData[0].FQTYPlan = Number(rst.FQTYPlan);
                    SelectData[0].FQTYActual = Number(rst.FQTYActual);

                    for (var i = 0; i < SelectData.length; i++) {
                        $com.util.deleteLowerProperty(SelectData[i]);
                    }
                    var a = 0;
                    for (var i = 0; i < DataAll.length; i++) {
                        if (SelectData[0].No == DataAll[i].No) {
                            a += 1;
                        }
                    }

                    model.com.postCommandSave({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                        //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                        //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    })



                }, TypeSource_Level));


            });

            //制造令明细新增
            $("body").delegate("#zace-addItem-level", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_LevelItem, KEYWORD_LevelItem, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    OMSOrderListTemp.Priority = Number(rst.Priority);
                    OMSOrderListTemp.LineID = Number(rst.LineID);
                    OMSOrderListTemp.PartID = Number(rst.PartID);
                    OMSOrderListTemp.ProductID = Number(rst.ProductID);
                    OMSOrderListTemp.OrderNo = rst.OrderNo;
                    // OMSOrderListTemp.ShiftPeriod = Number(rst.ShiftPeriod);
                    // OMSOrderListTemp.Code = rst.Code;
                    // OMSOrderListTemp.FQTY = Number(rst.FQTY);
                    OMSOrderListTemp.Remark = rst.Remark;

                    // OMSOrderListTemp.StartDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.StartDate));
                    // OMSOrderListTemp.FinishedDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.FinishedDate));
                    OMSOrderListTemp.PlanDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.PlanDate));
                    OMSOrderListTemp.ActualDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.ActualDate));

                    //OMSOrderListTemp.MaterialNo = rst.MaterialNo;
                    OMSOrderListTemp.CommandID = CommandID;
                    OMSOrderListTemp.Type = Number(rst.Type);

                    model.com.postMESOrderSave({
                        data: OMSOrderListTemp
                    }, function (res) {
                        alert("新增成功");
                        model.com.refreshItem();
                    })

                }, TypeSource_LevelItem));


            });
            //制造令明细修改
            $("body").delegate("#zace-editItem-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevelItem-tbody"), "ID", DataAllItem);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                var default_value = {
                    Priority: SelectData[0].Priority,
                    LineID: SelectData[0].LineID,
                    ProductID: SelectData[0].ProductID,
                    OrderNo: SelectData[0].OrderNo,
                    PartID: SelectData[0].PartID,
                    // Type: SelectData[0].Type,
                    Code: SelectData[0].Code,
                    // FQTY: SelectData[0].FQTY,
                    Remark: SelectData[0].Remark,
                    // StartDate: SelectData[0].StartDate,
                    // FinishedDate: SelectData[0].FinishedDate,
                    PlanDate: SelectData[0].PlanDate,
                    ActualDate: SelectData[0].ActualDate,
                    Active: SelectData[0].Active,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_LevelItem, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].Priority = Number(rst.Priority);
                    SelectData[0].LineID = Number(rst.LineID);
                    SelectData[0].ProductID = Number(rst.ProductID);
                    SelectData[0].OrderNo = rst.OrderNo;
                    SelectData[0].PartID = Number(rst.PartID);
                    // SelectData[0].Type = Number(rst.Type);
                    SelectData[0].Code = rst.Code;
                    // SelectData[0].FQTY = Number(rst.FQTY);
                    SelectData[0].Remark = rst.Remark;

                    // SelectData[0].StartDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.StartDate));
                    // SelectData[0].FinishedDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.FinishedDate));
                    SelectData[0].PlanDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.PlanDate));
                    SelectData[0].ActualDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.ActualDate));
                    SelectData[0].Active = Number(rst.Active);

                    for (var i = 0; i < SelectData.length; i++) {
                        $com.util.deleteLowerProperty(SelectData[i]);
                    }
                    model.com.postMESOrderSave({
                        data: SelectData[0],
                    }, function (res) {

                        alert("修改成功");
                        model.com.refreshItem();
                        //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                        //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    })

                }, TypeSource_LevelItem));


            });


            //制造令提交
            $("body").delegate("#zace-up-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }

                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].Status == 2 || SelectData[i].Status == 0) {
                        alert("数据选择有误,请选择状态为创建的数据!");
                        return;

                    }
                    else if (SelectData[i].Status == 3 || SelectData[i].Status == 4) {
                        alert("数据选择有误,请选择状态为创建的数据!");
                        return;
                    }

                }
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其提交？")) {
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                var a = 0;
                for (var i = 0; i < SelectData.length; i++) {

                    //var wid = SelectData[i].WID;
                    SelectData[i].Status = 2;
                    model.com.postCommandSave({
                        data: SelectData[i],
                    }, function (res) {
                        a++;
                        if (a == SelectData.length) {
                            alert("提交成功");
                            model.com.refresh();
                        }
                    })
                }
            });
            //制造令撤销
            $("body").delegate("#zace-return-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }

                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].Status == 1 || SelectData[i].Status == 0) {
                        alert("数据选择有误,请选择状态为待审核的数据!");
                        return;

                    }
                    else if (SelectData[i].Status == 3 || SelectData[i].Status == 4) {
                        alert("数据选择有误,请选择状态为待审核的数据!");
                        return;
                    }

                }
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其撤回？")) {
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                var a = 0;
                for (var i = 0; i < SelectData.length; i++) {

                    //var wid = SelectData[i].WID;
                    SelectData[i].Status = 1;

                    model.com.postCommandSave({
                        data: SelectData[i],
                    }, function (res) {
                        a++;
                        if (a == SelectData.length) {
                            alert("撤销成功");
                            model.com.refresh();
                        }
                    })
                }



            });
            //===========
            //=================所有列表
            $("body").delegate("#zace-allList-level", "click", function () {
                $(".zzza").hide();
                $(".zzzb").hide();
                $(".zzzOrderItem").hide();
                $(".zzzd").show();
                $(".zzzOrderPlan").hide();
                $(".zzzOrderGant").hide();


            });
            //我的申请
            $("body").delegate("#zace-myApproval-level", "click", function () {

                $(".zzzOrderPlan").hide();
                $(".zzzOrderItem").hide();
                $(".zzza").show();
                $(".zzzb").hide();
                $(".zzzd").hide();
                $(".zzzOrderGant").hide();

            });

            //我的审核
            $("body").delegate("#zace-myAudit-level", "click", function () {
                //if (RoleNum != -1) {

                $(".zzza").hide();
                $(".zzzb").show();
                $(".zzzOrderItem").hide();
                $(".zzzd").hide();
                $(".zzzOrderPlan").hide();
                $(".zzzOrderGant").hide();

                //} else {
                //    alert("无权限");
                //}


            });

            //所有列表  制造令查询
            $("body").delegate("#zace-search-returnAudit", "change", function () {

                var $this = $(this),
                    value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevelAll-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevelAll-tbody"), DATAAllSearchBasic, value, "ID");
            });
            //条件查询
            $("body").delegate("#zace-searchAll-level", "click", function () {
                var default_value = {
                    BusinessUnitID: 0,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.BusinessUnitID = Number(rst.BusinessUnitID);
                    $com.table.filterByConndition($("#femi-riskLevelAll-tbody"), DATAAllBBasic, default_value, "ID");

                }, TypeSource_Level));


            });





            //我的申请  筛选
            $("body").delegate("#zace-search-levelPro", "click", function () {


                var value = $("#zace-search-level").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "ID");



            });
            //条件查询
            $("body").delegate("#zace-searchZall-level", "click", function () {
                var default_value = {
                    BusinessUnitID: 0,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.BusinessUnitID = Number(rst.BusinessUnitID);
                    $com.table.filterByConndition($("#femi-riskLevel-tbody"), DATABasic, default_value, "ID");

                }, TypeSource_Level));


            });

            //我的审批  制造令查询
            $("body").delegate("#zace-search-returnApproval", "change", function () {

                var $this = $(this),
                    value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevelAudit-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevelAudit-tbody"), DataAllFactorySearch, value, "ID");



            });
            //条件查询
            $("body").delegate("#zace-searchApproval-level", "click", function () {
                var default_value = {
                    BusinessUnitID: 0,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.BusinessUnitID = Number(rst.BusinessUnitID);
                    $com.table.filterByConndition($("#femi-riskLevelAudit-tbody"), DATABasic, default_value, "ID");

                }, TypeSource_Level));


            });

            //制造令审核
            $("body").delegate("#zace-audit-returnAudit", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevelAudit-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }

                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].Status == 1 || SelectData[i].Status == 0) {
                        alert("数据选择有误,请选择状态为待审核的数据!");
                        return;

                    }
                    else if (SelectData[i].Status == 3 || SelectData[i].Status == 4) {
                        alert("数据选择有误,请选择状态为待审核的数据!");
                        return;
                    }

                }
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其审核？")) {
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                var a = 0;
                for (var i = 0; i < SelectData.length; i++) {

                    // var wid = SelectData[i].WID;
                    //SelectData[i].Status = 3;

                    model.com.postAudit({
                        CommandID: SelectData[i].ID,
                    }, function (res) {
                        a++;
                        if (a == SelectData.length) {
                            alert("审核成功");
                            model.com.refresh();
                        }
                    })
                }
            });
            //制造令反审核
            $("body").delegate("#zace-fan-returnAudit", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevelAudit-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }

                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].Status == 2 || SelectData[i].Status == 1) {
                        alert("数据选择有误,请选择状态为创建的数据!");
                        return;

                    }
                    else if (SelectData[i].Status == 0 || SelectData[i].Status == 4) {
                        alert("数据选择有误,请选择状态为创建的数据!");
                        return;
                    }

                }
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其反审核？")) {
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                var a = 0;
                for (var i = 0; i < SelectData.length; i++) {

                    //var wid = SelectData[i].WID;
                    //SelectData[i].Status = 1;

                    model.com.postReverseAudit({
                        CommandID: SelectData[i].ID,
                    }, function (res) {
                        a++;
                        if (a == SelectData.length) {
                            alert("反审核成功");
                            model.com.refresh();
                        }
                    })
                }
            });

            //订单计划zace-editItem-OrderPlan
            $("body").delegate("#zace-editItem-OrderPlan", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevelItem-tbody"), "ID", DataAllItem);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！")
                    return;
                }

                mOrderID = SelectData[0].ID;
                model.com.refreshPlan();
                $(".zzzOrderPlan").show();
                $(".zzzOrderItem").hide();
                $(".zzza").hide();
                $(".zzzb").hide();
                $(".zzzd").hide();
                $(".zzzOrderGant").hide();
            });
            //明细
            $("body").delegate("#zace-export-Customer", "click", function () {

                $(".zzzOrderPlan").hide();
                $(".zzzOrderItem").show();
                $(".zzza").hide();
                $(".zzzb").hide();
                $(".zzzd").hide();
                $(".zzzOrderGant").hide();

            });
            //日计划数据
            $("body").delegate("#zace-part-ganteMode", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-orderScheResult-tbody"), "ID", WeekDatalist);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                model.com.getAPSTaskGant({
                    data: SelectData
                }, function (res) {

                    var plan = res.info;
                    model.com.refreshTablePro(plan);
                    ChartData = $com.util.Clone(res.info);
                    $(".zzzOrderPlan").hide();
                    $(".zzzOrderItem").hide();
                    $(".zzza").hide();
                    $(".zzzb").hide();
                    $(".zzzd").hide();
                    $(".zzzOrderGant").show();

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
                            GroupID: item.GroupID
                        });
                    });
                    //Gant Column width Control:Max=60,Min=30;

                    if (ChartData.ColumnList.length > 0) {
                        position.spacePx = ($(".lmvt-container-gantt").width() - position.freedomPx) / ChartData.ColumnList.length;
                        if (ChartData.ColumnList.length == 10) {
                            position.spacePx = ($(".lmvt-container-gantt").width() - position.freedomPx) / (ChartData.ColumnList.length + 2);
                        }
                        else {
                            if (position.spacePx < 90)
                                position.spacePx = 90;
                            if (position.spacePx > 170)
                                position.spacePx = 170;
                        }

                    }

                    position.contextHight = 62 + ChartData.GantPartList.length * position.spacePy;

                    if (position.contextHight < 300)
                        position.contextHight = $(".lmvt-container-gantt").height();

                    //$(".lmvt-container-count-drawing-gantt").css("height", position.contextHight + "px");

                    $gantt.install($('.lmvt-gantt'), position, $(".lmvt-container-gantt"), ChartData.ColumnList);

                    $gantt.resfushCanvas(position.Task.data);

                    $(".lmvt-container-count-drawing").show();

                })
            });
            //返回
            $("body").delegate("#lmvt-back", "click", function () {
                $(".zzzOrderPlan").show();
                $(".zzzOrderItem").hide();
                $(".zzza").hide();
                $(".zzzb").hide();
                $(".zzzd").hide();
                $(".zzzOrderGant").hide();
            });
            //导出计划
            $("body").delegate("#zace-logout-tableOrderDay", "click", function () {
                var $table = $(".table-day-export"),
                    fileName = "工序计划.xls",
                    Title = "工序计划";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });

            });
        },




        run: function () {
            var UserList = window.parent._UserAll;

            //修程
            model.com.getFMCLine({ FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0 }, function (resPZ) {
                if (resPZ && resPZ.list) {
                    $.each(resPZ.list, function (i, item) {
                        TypeSource_LevelItem.LineID.push({
                            name: item.Name,
                            value: item.ID,
                        });
                    });
                    TypeSource_Level.FactoryID = TypeSource_LevelItem.LineID;


                }
                //局段
                model.com.getCustomer({ active: 2 }, function (resBZ) {
                    if (resBZ && resBZ.list) {
                        $.each(resBZ.list, function (i, item) {
                            TypeSource_Level.CustomerID.push({
                                name: item.CustomerName,
                                value: item.ID,
                            });
                        });
                        TypeSource_LevelItem.PartID = TypeSource_Level.CustomerID;
                    }
                    //车型
                    model.com.getFPCProduct({ ProductTypeID: 0, BusinessUnitID: 0 }, function (resP) {
                        if (resP && resP.list) {

                            $.each(resP.list, function (i, item) {
                                TypeSource_LevelItem.ProductID.push({
                                    name: item.ProductName,
                                    //value: item.ID,
                                    value: item.ID,

                                })
                            });
                            TypeSource_Level.BusinessUnitID = TypeSource_LevelItem.ProductID;

                        }

                        model.com.refresh();


                    });
                });
            });




        },

        com: {
            refresh: function () {
                //所有
                model.com.getCommandAll({ startTime: "2010-01-01 08:00:00", endTime: "2100-01-01 08:00:00", status: 0 }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var Grade = $com.util.Clone(resP.list);
                        DATAAllBBasic = $com.util.Clone(resP.list);
                        $.each(Grade, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }
                        });
                        DATAAllSearchBasic = $com.util.Clone(Grade);
                        //所有列表
                        $("#femi-riskLevelAll-tbody").html($com.util.template(Grade, HTML.TableMode));
                        $("#femi-riskLevelAll-tbody tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });


                    }

                });
                //申请 
                model.com.getCommandAll({ startTime: "2010-01-01 08:00:00", endTime: "2100-01-01 08:00:00", status: 0 }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var Grade = $com.util.Clone(resP.list);
                        DATABasic = $com.util.Clone(resP.list);

                        DataAll = $com.util.Clone(Grade);

                        $.each(Grade, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }
                        });
                        DataAllFactorySearch = $com.util.Clone(Grade);
                        $("#femi-riskLevel-tbody").html($com.util.template(Grade, HTML.TableMode));
                        $("#femi-riskLevel-tbody tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });

                        $("#femi-riskLevelAudit-tbody").html($com.util.template(Grade, HTML.TableMode));
                        $("#femi-riskLevelAudit-tbody tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });
                    }

                });
                //审批
                model.com.getCommandAll({ startTime: "2010-01-01 08:00:00", endTime: "2100-01-01 08:00:00", status: 0 }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {


                        //审核数据
                        DataAllConfirm = $com.util.Clone(resP.list);
                        DataAllConfirmChange = DataAllConfirm;

                        DataAllConfirmBasic = $com.util.Clone(DataAllConfirmChange);

                        var _listC = $com.util.Clone(DataAllConfirmChange);
                        $.each(_listC, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }
                        });
                        DataAllSearch = $com.util.Clone(_listC);
                        // $("#femi-riskLevelAudit-tbody").html($com.util.template(_listC, HTML.TableMode));


                    }

                });




            },
            refreshItem: function () {
                model.com.getMESOrderAll({ CommandID: CommandID }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        DataAllItem = $com.util.Clone(resP.list);
                        var _list = $com.util.Clone(resP.list);
                        $.each(_list, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_LevelItem[p])
                                    continue;
                                item[p] = FORMATTRT_LevelItem[p](item[p]);
                            }
                        });
                        $("#femi-riskLevelItem-tbody").html($com.util.template(_list, HTML.TableItemMode));
                        $("#femi-riskLevelItem-tbody tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });

                        $(".zzzOrderItem").show();
                        $(".zzza").hide();
                        $(".zzzOrderPlan").hide();
                        $(".zzzb").hide();
                        $(".zzzd").hide();
                        $(".zzzOrderGant").hide();
                    }
                });
            },
            refreshPlan: function () {
                model.com.getFOrderPSTaskLine({ OrderID: mOrderID }, function (redO) {
                    if (!redO)
                        return;
                    if (redO && redO.list) {
                        WeekDatalist = $com.util.Clone(redO.list);
                        var _list = $com.util.Clone(redO.list);
                        if (_list.length < 1) {
                            alert("没有计划！！！")
                            $("#femi-orderScheResult-tbody").html($com.util.template(_list, HTML.TablePlanMode));
                            $("#femi-orderScheResult-tbody tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);



                            });
                            return false;
                        } else {
                            for (var i = 0; i < _list.length; i++) {
                                var week = _list[i].ShiftID % 100;
                                _list[i].ShiftName = week + "周";
                            }
                            $.each(_list, function (i, item) {
                                for (var p in item) {
                                    if (!FORMATTRT_LinkManCustomer[p])
                                        continue;
                                    item[p] = FORMATTRT_LinkManCustomer[p](item[p]);
                                }
                            });
                            WeekDatalistChange = $com.util.Clone(_list);
                            $("#femi-orderScheResult-tbody").html($com.util.template(_list, HTML.TablePlanMode));
                            $("#femi-orderScheResult-tbody tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);



                            });
                        }
                    }


                })
            },
            //产线得到甘特
            getAPSTaskGant: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskLine/TaskLineGant",
                    $TYPE: "post",
                    $SERVER: "/MESAPS",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询信息
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

            //查询订单计划
            getFOrderPSTaskLine: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskLine/All",
                    $TYPE: "get",
                    $SERVER: "/MESAPS",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //查询车型
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

            //获取物料列表
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

            //
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
            //查 修程
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
            //查询局段
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
            //查询  订单
            getCommandAll: function (data, fn, context) {
                var d = {
                    $URI: "/MESOrder/CommandAll",
                    $TYPE: "get",
                    $SERVER: "/MESAPS",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },


            //查询订单 详情
            getMESOrderAll: function (data, fn, context) {
                var d = {
                    $URI: "/MESOrder/OrderAllByCommandID",
                    $TYPE: "get",
                    $SERVER: "/MESAPS",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //保存订单
            postCommandSave: function (data, fn, context) {
                var d = {
                    $URI: "/MESOrder/CommandSave",
                    $TYPE: "post",
                    $SERVER: "/MESAPS",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
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
            //保存 订单详情
            postMESOrderSave: function (data, fn, context) {
                var d = {
                    $URI: "/MESOrder/MESOrderSave",
                    $TYPE: "post",
                    $SERVER: "/MESAPS",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //审核订单
            postAudit: function (data, fn, context) {
                var d = {
                    $URI: "/MESOrder/CommandAudit",
                    $TYPE: "post",
                    $SERVER: "/MESAPS",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //反审核订单
            postReverseAudit: function (data, fn, context) {
                var d = {
                    $URI: "/MESOrder/CommandReverseAudit",
                    $TYPE: "post",
                    $SERVER: "/MESAPS",
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
            //计算天数
            GetDays: function (startDate, endDate) {
                var days;
                days = (new Date(endDate) - new Date(startDate)) / 1000 / 60 / 60 / 24;
                return days;
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

                });
                $(".part-plan-div>.table tbody").html($com.util.template(_list.GantPartList, HTML.TableUserItemNode));
                $(".part-plan-div>.table tbody tr").each(function (i, item) {
                    var $this = $(this);
                    var colorName = $this.css("background-color");
                    $this.attr("data-color", colorName);



                });
            },
        }
    }),

        model.init();


});