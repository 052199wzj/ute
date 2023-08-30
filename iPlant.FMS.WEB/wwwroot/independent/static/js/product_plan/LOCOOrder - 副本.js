require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($zace, $com) {

    var KEYWORD_Level_LIST,
        KEYWORD_Level,
        FORMATTRT_Level,
        DEFAULT_VALUE_Level,
        TypeSource_Level,

        KEYWORD_Level_LIST_Order,
        KEYWORD_Level_Order,
        FORMATTRT_Level_Order,
        DEFAULT_VALUE_Level_Order,//订单
        TypeSource_Level_Order,


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

    TypeMode = 1;//1订单  2订单详情界面
    DATAAllBusiness = DATAAllBusinessC = [];
    DataAll = [];
    DATABasic = [];
    DataAllConfirmBasic = [];
    DataAllConfirmChange = [];
    DataAllConfirm = [];
    DataAllSearch = [];
    DATABasicOrder = [];
    DataAllOrder = [];
    DataAllSearchOrder = [];
    CommandID = 0;
    //订单模板
    mBusinessUnitID = 0;  //车型
    mCustomerID = 0;  //局段
    mLine = 0;//修程
    _listOrder = [];//双击的订单
    OrderTemp = {
        Active: 1,
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
    //详情订单
    PositionTemp = {
        ID: 0,
        ERPID: 0,
        Status: 1,
        OrderNo: '',
        LineID: 0,
        ProductID: 0,
        BureauSectionID: 0,
        WBSNo: '',
        PartNo: '',
        BOMNo: '',
        Priority: 0,
        PlanReceiveDate: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        RealReceiveDate: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date('2000-1-1')),
        PlanFinishDate: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        RealStartDate: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date('2000-1-1')),
        RealFinishDate: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date('2000-1-1')),
        RealSendDate: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date('2000-1-1')),
        Remark: '',
        Active: 1,
        Auditor: window.parent.User_Info.Name,
        AuditorID: 0,
        AuditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Creator: window.parent.User_Info.Name,
        CreatorID: 0,
        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Editor: window.parent.User_Info.Name,
        EditorID: 0,
        CommandID: 0,
    };


    ;
    HTML = {
        TableOrderMode: [
            '<tr data-color="">',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',

            '<td data-title="No" data-value="{{No}}" >{{No}}</td>',
            '<td data-title="WBSNo" data-value="{{WBSNo}}" >{{WBSNo}}</td>',
            '<td data-title="FactoryID" data-value="{{FactoryID}}" >{{FactoryID}}</td>',
            '<td data-title="CustomerID" data-value="{{CustomerID}}" >{{CustomerID}}</td>',
            '<td data-title="BusinessUnitID" data-value="{{BusinessUnitID}}" >{{BusinessUnitID}}</td>',
            '<td data-title="FQTYPlan" data-value="{{FQTYPlan}}" >{{FQTYPlan}}</td>',
            '<td data-title="FQTYActual" data-value="{{FQTYActual}}" >{{FQTYActual}}</td>',
            '<td data-title="ContactCode" data-value="{{ContactCode}}" >{{ContactCode}}</td>',
            '<td data-title="CreatorID" data-value="{{CreatorID}}" >{{CreatorID}}</td>',
            '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
            // '<td data-title="Auditor" data-value="{{Auditor}}" >{{Auditor}}</td>',
            // '<td data-title="AuditTime" data-value="{{AuditTime}}" >{{AuditTime}}</td>',
            // '<td data-title="Active" data-value="{{Active}}" >{{Active}}</td>',
            // '<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',

            '</tr>',
        ].join(""),

        TableMode: [
            '<tr data-color="">',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td data-title="WBSNo" data-value="{{WBSNo}}" >{{WBSNo}}</td>',
            '<td data-title="OrderNo" data-value="{{OrderNo}}" >{{OrderNo}}</td>',

            '<td data-title="BureauSectionID" data-value="{{BureauSectionID}}" >{{BureauSectionID}}</td>',
            '<td data-title="LineID" data-value="{{LineID}}" >{{LineID}}</td>',
            '<td data-title="ProductID" data-value="{{ProductID}}" >{{ProductID}}</td>',
            '<td data-title="PartNo" data-value="{{PartNo}}" >{{PartNo}}</td>',
            '<td data-title="Priority" data-value="{{Priority}}" >{{Priority}}</td>',
            '<td data-title="RouteID" data-value="{{RouteID}}" >{{RouteID}}</td>',

            '<td data-title="PlanReceiveDate" data-value="{{PlanReceiveDate}}" >{{PlanReceiveDate}}</td>',
            '<td data-title="TimeText" data-value="{{TimeText}}" >{{TimeText}}</td>',
            '<td data-title="PlanFinishDate" data-value="{{PlanFinishDate}}" >{{PlanFinishDate}}</td>',
            // '<td data-title="RealStartDate" data-value="{{RealStartDate}}" >{{RealStartDate}}</td>',
            // '<td data-title="RealFinishDate" data-value="{{RealFinishDate}}" >{{RealFinishDate}}</td>',
            // '<td data-title="RealSendDate" data-value="{{RealSendDate}}" >{{RealSendDate}}</td>',
            '<td data-title="Remark" data-value="{{Remark}}" >{{Remark}}</td>',
            '<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',
            '<td data-title="Active" data-value="{{Active}}" >{{Active}}</td>',

            '</tr>',
        ].join(""),



    };
    (function () {
        KEYWORD_Level_LIST = [
            "OrderNo|子订单号",

            "BureauSectionID|局段|ArrayOne",
            "LineID|修程|ArrayOne",
            "ProductID|车型|ArrayOne",
            "PartNo|车号",//Priority
            "Priority|优先级",
            "RouteID|路线|ArrayOne",
            "PlanReceiveDate|计划进厂|Date",
            "RealReceiveDate|实际进厂|Date",
            "PlanFinishDate|预计完工|Date",
            "RealStartDate|实际开工|Date",
            "RealFinishDate|实际完工|Date",
            "RealSendDate|交车日期|Date",
            "Remark|备注",

            "Status|状态|ArrayOne",
            "Active|启用|ArrayOne",
            "CreateTime|时间|DateTime",
            "EditTime|时间|DateTime",

        ];
        KEYWORD_Level = {};
        FORMATTRT_Level = {};

        DEFAULT_VALUE_Level = {
           // OrderNo: '',
            // LineID: 0,
            // ProductID: 0,
            // BureauSectionID: 0,
            PartNo: '',
            Priority: 0,
            PlanReceiveDate: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
            //RealReceiveDate: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
            PlanFinishDate: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
            Remark: '',
            // Active: 1,

        };

        TypeSource_Level = {
            RouteID: [
                // {
                //     name: "-",
                //     value: 0
                // },
            ],
            Active: [
                {
                    name: "禁用",
                    value: 0
                },
                {
                    name: "启用",
                    value: 1
                },
            ],
            Status: [
                {
                    name: "进车计划",
                    value: 1
                }, {
                    name: "已收电报",
                    value: 2
                }, {
                    name: "已进厂",
                    value: 3
                }, {
                    name: "维修中",
                    value: 4
                }, {
                    name: "已完工",
                    value: 5
                },
                {
                    name: "待出厂普查",
                    value: 6
                }, {
                    name: "待出厂确认",
                    value: 7
                }, {
                    name: "已发车",
                    value: 8
                },],
            LineID: [],
            BureauSectionID: [],
            ProductID: [],



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
    (function () {
        KEYWORD_Level_LIST_Order = [
            "No|订单号",
            "WBSNo|WBS编号",
            "FactoryID|修程|ArrayOne",
            "CustomerID|局段|ArrayOne",
            "BusinessUnitID|车型|ArrayOne",
            "FQTYPlan|计划数量",
            "FQTYActual|实际数量",
            "ContactCode|备注",
            "Status|状态|ArrayOne",
            "Active|启用|ArrayOne",
            "CreateTime|时间|DateTime",
            "EditTime|时间|DateTime",
            "AuditTime|时间|DateTime",
            "CreatorID|人|ArrayOne",

        ];
        KEYWORD_Level_Order = {};
        FORMATTRT_Level_Order = {};

        DEFAULT_VALUE_Level_Order = {
            No: "",
            WBSNo: '',
            ContactCode: "",
            CustomerID: 0,
            BusinessUnitID: 0,
            FactoryID: 0,
            FQTYPlan: 0,
            // FQTYActual: 0,
            //LinkManID: 0,
        };

        TypeSource_Level_Order = {
            Active: [
                {
                    name: "启用",
                    value: 1
                }, {
                    name: "禁用",
                    value: 0
                }
            ],
            CreatorID: [],
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

        $.each(KEYWORD_Level_LIST_Order, function (i, item) {
            var detail = item.split("|");
            KEYWORD_Level_Order[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_Level_Order[detail[0]] = $com.util.getFormatter(TypeSource_Level_Order, detail[0], detail[2]);
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



            $("body").delegate("#zace-return-exportMSSPart", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！");
                    return;
                };


                if (SelectData[0].Status == 1 || SelectData[0].Status == 2) {
                    alert('车辆未进厂！');
                    return false;
                }


                var vdata = { 'header': '台车部件', 'href': './component/componentCar.html?id=' + SelectData[0].ID + '&name=' + SelectData[0].OrderNo, 'id': 'componentCar', 'src': './static/images/menu/newfactoryModel/techniquePart.png' };
                window.parent.iframeHeaderSet(vdata);
                window.callFunctionTrigger("componentCar", { ID: SelectData[0].ID, Name: SelectData[0].OrderNo });


            });


            //竣工确认
            $("body").delegate("#zace-roro-Confirm", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！")
                    return;
                }


                model.com.confirmDone({
                    OrderID: SelectData[0].ID,
                }, function (res) {
                    alert("竣工确认成功");
                    model.com.refreshItem();


                })


            });

            //出厂申请
            $("body").delegate("#zace-roro-LeaveSQ", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！")
                    return;
                }
                model.com.leaveFactorySQ({
                    OrderID: SelectData[0].ID,
                }, function (res) {
                    alert("出厂申请成功");
                    model.com.refreshItem();


                })



            });

            //出厂确认
            $("body").delegate("#zace-roro-LeaveQR", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！")
                    return;
                }
                model.com.leaveFactory({
                    OrderID: SelectData[0].ID,
                }, function (res) {
                    alert("出厂确认成功");
                    model.com.refreshItem();


                })

            });


            $("body").delegate("#zace-return-exportBom", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }


                model.com.getAPSBOM({ OrderID: SelectData[0].ID, }, function (resP) {
                    if (!resP)
                        return;
                    if (resP.list && resP.list.length < 1) {

                        model.com.createAPSBOM({ OrderID: SelectData[0].ID, }, function (resk) {
                            if (!resk)
                                return;
                            if (resk.list) {


                                var vdata = { 'header': '台车Bom', 'href': './monitor_quality/BomExportSetting.html?id=' + SelectData[0].ID + '&name=' + SelectData[0].OrderNo, 'id': 'BomExportSetting', 'src': './static/images/menu/newfactoryModel/techniquePart.png' };
                                window.parent.iframeHeaderSet(vdata);
                                window.callFunctionTrigger("BomExportSetting", { ID: SelectData[0].ID, Name: SelectData[0].OrderNo });
                            }

                        });
                    } else {

                        var vdata = { 'header': '台车Bom', 'href': './monitor_quality/BomExportSetting.html?id=' + SelectData[0].ID + '&name=' + SelectData[0].OrderNo, 'id': 'BomExportSetting', 'src': './static/images/menu/newfactoryModel/techniquePart.png' };
                        window.parent.iframeHeaderSet(vdata);
                        window.callFunctionTrigger("BomExportSetting", { ID: SelectData[0].ID, Name: SelectData[0].OrderNo });
                    }

                });







            });


            $("body").delegate("#femi-riskLevelOrder-tbody tr", "dblclick", function () {

                var $this = $(this);
                var WName = $this.find('td[data-title=ContactCode]').attr('data-value');
                var WID = Number($this.find('td[data-title=ID]').attr('data-value'));
                var WNo = $this.find('td[data-title=No]').attr('data-value');
                //$("#zace-span-change").html(WNo);
                CommandID = WID;

                No = WNo;
                TypeMode = 2;


                //修改总订单数量
                _listOrder = [];
                for (var i = 0; i < DataAllOrder.length; i++) {
                    $com.util.deleteLowerProperty(DataAllOrder[i]);
                    if (DataAllOrder[i].ID == CommandID) {
                        _listOrder.push(DataAllOrder[i]);
                        mBusinessUnitID = DataAllOrder[i].BusinessUnitID;  //车型
                        mCustomerID = DataAllOrder[i].CustomerID;  //局段
                        mLine = DataAllOrder[i].FactoryID;//修程
                    }

                }
                $(".zzza").hide();
                $(".zzzb").show();

                model.com.getFPCRoute({ LineID: mLine, ProductID: mBusinessUnitID, mCustomerID: 0 }, function (resP) {
                    if (!resP)
                        return;
                    if (TypeSource_Level.RouteID.length > 1)
                        TypeSource_Level.RouteID=[];
                    $.each(resP.list, function (i, item) {
                        TypeSource_Level.RouteID.push({
                            value: item.ID,
                            name: item.Name
                        });
                    });

                    model.com.refreshItem();

                });




            });
            //zace-return-levelOrder
            $("body").delegate("#zace-return-levelOrder", "click", function () {


                $(".zzza").show();
                $(".zzzb").hide();
                TypeMode = 1;

                model.com.refresh();

            });

            //zace-edit-levelZace
            $("body").delegate("#zace-edit-levelZace", "click", function () {
                model.com.refresh();

            });

            $("body").delegate("#zace-edit-levelZaceItem", "click", function () {
                model.com.refreshItem();

            });

            //修改路线
            $("body").delegate("#zace-active-levelRoute", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！");
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！");
                    return;
                }        
                var default_value = {
                    RouteID: SelectData[0].RouteID,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    //SelectData[0].RouteID = Number(rst.RouteID);
                    //格式化时间
                    SelectData[0].AuditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[0].AuditTime));
                    SelectData[0].CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[0].CreateTime));
                    SelectData[0].EditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[0].EditTime));
                    for (var i = 0; i < SelectData.length; i++) {

                        $com.util.deleteLowerProperty(SelectData[i]);
                    }

                    model.com.changeOMSOrder({
                        data: SelectData[0],
                        RouteID:Number(rst.RouteID)
                    }, function (res) {
                        alert("更改路线成功");
                        model.com.refreshItem();
                        //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                        //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    })

                }, TypeSource_Level));


            });
            //制造令新增
            $("body").delegate("#zace-add-levelOrder", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_Level_Order, KEYWORD_Level_Order, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    OrderTemp.BusinessUnitID = Number(rst.BusinessUnitID);
                    // PositionTemp.FactoryID = Number(rst.FactoryID);              
                    OrderTemp.No = rst.No;
                    OrderTemp.WBSNo = rst.WBSNo;
                    OrderTemp.CustomerID = Number(rst.CustomerID);
                    OrderTemp.FactoryID = Number(rst.FactoryID);
                    OrderTemp.ContactCode = rst.ContactCode;
                    OrderTemp.FQTYPlan = Number(rst.FQTYPlan);
                    // OrderTemp.FQTYActual = Number(rst.FQTYActual);


                    model.com.postCommandSave({
                        data: OrderTemp,
                    }, function (res) {

                        alert("新增成功");
                        model.com.refresh();


                    })

                }, TypeSource_Level_Order));


            });
            //制造令修改
            $("body").delegate("#zace-edit-levelOrder", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevelOrder-tbody"), "ID", DataAllOrder);

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
                    WBSNo: SelectData[0].WBSNo,
                    BusinessUnitID: SelectData[0].BusinessUnitID,
                    CustomerID: SelectData[0].CustomerID,
                    ContactCode: SelectData[0].ContactCode,
                    FactoryID: SelectData[0].FactoryID,
                    FQTYPlan: SelectData[0].FQTYPlan,
                    // FQTYActual: SelectData[0].FQTYActual,
                    //  Status: SelectData[0].Status,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level_Order, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].No = rst.No;
                    SelectData[0].WBSNo = rst.WBSNo;
                    SelectData[0].BusinessUnitID = Number(rst.BusinessUnitID);
                    SelectData[0].ContactCode = rst.ContactCode;
                    SelectData[0].CustomerID = Number(rst.CustomerID);
                    // SelectData[0].FactoryID = Number(rst.FactoryID);
                    SelectData[0].FactoryID = Number(rst.FactoryID);

                    SelectData[0].FQTYPlan = Number(rst.FQTYPlan);
                    // SelectData[0].FQTYActual = Number(rst.FQTYActual);

                    for (var i = 0; i < SelectData.length; i++) {
                        $com.util.deleteLowerProperty(SelectData[i]);
                        SelectData[i].AuditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].AuditTime));
                        SelectData[i].CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].CreateTime));
                        SelectData[i].EditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].EditTime));
                    }


                    model.com.postCommandSave({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                        //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                        //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    })



                }, TypeSource_Level_Order));


            });

            //Enter触发模糊查询事件
            $(document).keyup(function (event) {
                if (event.keyCode == 13 && TypeMode == 2) {
                    var $this = $(this);
                    var value = $("#zace-search-level").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-riskLevel-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllSearch, value, "ID");
                }

                if (event.keyCode == 13 && TypeMode == 1) {
                    var $this = $(this);
                    var value = $("#zace-search").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-riskLevelOrder-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-riskLevelOrder-tbody"), DataAllSearchOrder, value, "ID");
                }

            });





            //查询
            $("body").delegate("#zace-search-level-pro", "click", function () {

                var value = $("#zace-search-level").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllSearch, value, "ID");



            });

            //zace-search-levelPro


            //查询
            $("body").delegate("#zace-search-levelPro", "click", function () {

                var value = $("#zace-search").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevelOrder-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevelOrder-tbody"), DataAllSearchOrder, value, "ID");



            });



            //启用
            $("body").delegate("#zace-active-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }

                SelectData.forEach(element => {
                    if (element.Active == 1) {
                        alert('有数据已启用！！')
                        return false;
                    }
                });

                for (var i = 0; i < SelectData.length; i++) {

                    $com.util.deleteLowerProperty(SelectData[i]);
                    SelectData[i].PlanReceiveDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].PlanReceiveDate));
                    SelectData[i].RealReceiveDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].RealReceiveDate));
                    SelectData[i].PlanFinishDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].PlanFinishDate));
                    SelectData[i].RealStartDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].RealStartDate));
                    SelectData[i].RealFinishDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].RealFinishDate));
                    SelectData[i].RealSendDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].RealSendDate));
                    SelectData[i].AuditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].AuditTime));
                    SelectData[i].CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].CreateTime));
                    SelectData[i].EditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].EditTime));
                }

                model.com.activeOMSOrder({
                    data: SelectData,
                    Active: 1,
                }, function (res) {
                    alert("启用成功");
                    _listOrder[0].AuditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(_listOrder[0].AuditTime));
                    _listOrder[0].CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(_listOrder[0].CreateTime));
                    _listOrder[0].EditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(_listOrder[0].EditTime));
                    _listOrder[0].FQTYActual += SelectData.length;
                    model.com.postCommandSave({
                        data: _listOrder[0],
                    }, function (res) {

                        model.com.refreshItem();
                    })


                })




            });
            //禁用
            $("body").delegate("#zace-disable-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                //if (SelectData[0].Status != 1) {
                //    alert("数据选择有误！")
                //    return;
                //}
                SelectData.forEach(element => {
                    if (element.Active == 0) {
                        alert('有数据已禁用！！')
                        return false;
                    }
                });


                for (var i = 0; i < SelectData.length; i++) {

                    $com.util.deleteLowerProperty(SelectData[i]);
                    SelectData[i].PlanReceiveDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].PlanReceiveDate));
                    SelectData[i].RealReceiveDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].RealReceiveDate));
                    SelectData[i].PlanFinishDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].PlanFinishDate));
                    SelectData[i].RealStartDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].RealStartDate));
                    SelectData[i].RealFinishDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].RealFinishDate));
                    SelectData[i].RealSendDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].RealSendDate));
                    SelectData[i].AuditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].AuditTime));
                    SelectData[i].CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].CreateTime));
                    SelectData[i].EditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].EditTime));
                }
                model.com.activeOMSOrder({
                    data: SelectData,
                    Active: 0,
                }, function (res) {
                    alert("禁用成功");

                    _listOrder[0].AuditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(_listOrder[0].AuditTime));
                    _listOrder[0].CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(_listOrder[0].CreateTime));
                    _listOrder[0].EditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(_listOrder[0].EditTime));
                    _listOrder[0].FQTYActual -= SelectData.length;
                    model.com.postCommandSave({
                        data: _listOrder[0],
                    }, function (res) {

                        model.com.refreshItem();
                    })


                })

            });
            //修改
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
                if (SelectData[0].Status > 3) {
                    alert("请选择未开工的车辆！");
                    return;
                }

                var default_value = {
                   // OrderNo: SelectData[0].OrderNo,
                    // RouteID: SelectData[0].RouteID,
                    // ProductID: SelectData[0].ProductID,
                    // BureauSectionID: SelectData[0].BureauSectionID,

                    PartNo: SelectData[0].PartNo.split("#")[1],
                    Priority: SelectData[0].Priority,
                    PlanReceiveDate: SelectData[0].PlanReceiveDate,
                    RealReceiveDate: new Date(SelectData[0].RealReceiveDate) < new Date('2010-1-1') ? new Date() : new Date(SelectData[0].RealReceiveDate),
                    PlanFinishDate: SelectData[0].PlanFinishDate,
                    // RealStartDate: SelectData[0].RealStartDate,
                    // RealFinishDate: SelectData[0].RealFinishDate,
                    // RealSendDate: SelectData[0].RealSendDate,

                    Remark: SelectData[0].Remark,
                    //Active: SelectData[0].Active,
                    //Status: SelectData[0].Status,


                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    // SelectData[0].Status = Number(rst.Status);
                  //  SelectData[0].OrderNo = rst.OrderNo;
                    // SelectData[0].LineID = Number(rst.LineID);
                    // SelectData[0].ProductID = Number(rst.ProductID);
                    // SelectData[0].BureauSectionID = Number(rst.BureauSectionID);
                    //SelectData[0].WBSNo = rst.WBSNo;
                    //SelectData[0].PartNo = rst.PartNo;
                    SelectData[0].Priority = Number(rst.Priority);
                    SelectData[0].PlanReceiveDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.PlanReceiveDate));
                    SelectData[0].RealReceiveDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.RealReceiveDate));
                    SelectData[0].PlanFinishDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.PlanFinishDate));
                    SelectData[0].Remark = rst.Remark;
                    if (SelectData[0].ProductID > 0) {

                        if (rst.PartNo && rst.PartNo.length == 4 && !isNaN(rst.PartNo)) {

                        } else {
                            alert('车号为4位数字！');
                            return false;
                        }
                        SelectData[0].PartNo = rst.PartNo;
                        SelectData[0].PartNo = FORMATTRT_Level["ProductID"](SelectData[0].ProductID) + "#" + SelectData[0].PartNo;
                    } else {

                        SelectData[0].PartNo = "";
                    }
                    //格式化时间
                    SelectData[0].AuditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[0].AuditTime));
                    SelectData[0].CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[0].CreateTime));
                    SelectData[0].EditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[0].EditTime));
                    for (var i = 0; i < SelectData.length; i++) {

                        $com.util.deleteLowerProperty(SelectData[i]);
                    }

                    model.com.postOMSOrder({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refreshItem();
                        //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                        //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    })

                }, TypeSource_Level));


            });
            //新增
            $("body").delegate("#zace-add-level", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    if (rst.PartNo && rst.PartNo.length == 4 && !isNaN(rst.PartNo)) {

                    } else {
                        alert('车号为4位数字！');
                        return false;
                    }
                    //PositionTemp.Active = rst.Active;
                  //  PositionTemp.OrderNo = rst.OrderNo;
                    PositionTemp.LineID = mLine;
                    PositionTemp.ProductID = mBusinessUnitID;
                    PositionTemp.BureauSectionID = mCustomerID;

                    PositionTemp.PartNo = rst.PartNo;
                    PositionTemp.Priority = Number(rst.Priority);
                    PositionTemp.PlanReceiveDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.PlanReceiveDate));
                    //PositionTemp.RealReceiveDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.RealReceiveDate));
                    PositionTemp.PlanFinishDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.PlanFinishDate));
                    // PositionTemp.RealStartDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.RealStartDate));
                    // PositionTemp.RealFinishDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.RealFinishDate));
                    // PositionTemp.RealSendDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.RealSendDate));
                    PositionTemp.Remark = rst.Remark;

                    PositionTemp.CommandID = CommandID;
                    //for (var i = 0; i < DataProductList.length; i++) {
                    //    if (PositionTemp.ProductID == DataProductList[i].ID) {
                    //        PositionTemp.ProductNo = DataProductList[i].ProductNo;
                    //    }
                    //}
                    if (PositionTemp.ProductID > 0) {
                        PositionTemp.PartNo = FORMATTRT_Level["ProductID"](PositionTemp.ProductID) + "#" + PositionTemp.PartNo;
                    } else {

                        PositionTemp.PartNo = "";
                    }




                    model.com.postOMSOrder({
                        data: PositionTemp,
                    }, function (res) {
                        alert("新增成功");

                        _listOrder[0].AuditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(_listOrder[0].AuditTime));
                        _listOrder[0].CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(_listOrder[0].CreateTime));
                        _listOrder[0].EditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(_listOrder[0].EditTime));
                        _listOrder[0].FQTYActual += 1;
                        model.com.postCommandSave({
                            data: _listOrder[0],
                        }, function (res) {

                            model.com.refreshItem();
                        })

                    })



                }, TypeSource_Level));


            });
            //我的申请
            $("body").delegate("#zace-myApproval-level", "click", function () {
                $(".zzza").show();
                $(".zzzb").hide();
                $(".zzzc").hide();

            });
            //车间
            $("body").delegate("#zace-audit-workshop", "click", function () {
                var vdata = { 'header': '工厂设置', 'href': './factory_model/FMCFactorySetting.html', 'id': 'FMCFactorySetup', 'src': './static/images/menu/manageBOM.png' };
                window.parent.iframeHeaderSet(vdata);

            });

            //审批查询
            $("body").delegate("#zace-search-returnAudit", "input", function () {

                var $this = $(this),
                    value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevelAudit-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevelAudit-tbody"), DataAllSearch, value, "ID");



            });
            //所有查询
            $("body").delegate("#zace-search-returnAuditAll", "input", function () {

                var $this = $(this),
                    value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevelApprovalAll-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevelApprovalAll-tbody"), DataAllSearch, value, "ID");



            });


            //所有条件查询
            $("body").delegate("#zace-searchAll-level", "click", function () {
                var default_value = {
                    Active: true,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.Active = eval(rst.Active.toLowerCase());

                    $com.table.filterByConndition($("#femi-riskLevelApprovalAll-tbody"), DATAAllBusiness, default_value, "ID");

                }, TypeSource_Level));


            });

            //申请条件查询
            $("body").delegate("#zace-searchZApproval-level", "click", function () {
                var default_value = {
                    Active: true,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.Active = eval(rst.Active.toLowerCase());
                    $com.table.filterByConndition($("#femi-riskLevel-tbody"), DATABasic, default_value, "ID");

                }, TypeSource_Level));


            });
            //审批条件查询
            $("body").delegate("#zace-searchAudit-level", "click", function () {
                var default_value = {
                    Active: true,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.Active = eval(rst.Active.toLowerCase());
                    $com.table.filterByConndition($("#femi-riskLevelAudit-tbody"), DataAllConfirmBasic, default_value, "ID");

                }, TypeSource_Level));


            });
        },




        run: function () {

            model.com.getFMCLine({ FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0 }, function (resP) {
                if (!resP)
                    return;

                $.each(resP.list, function (i, item) {
                    TypeSource_Level.LineID.push({
                        value: item.ID,
                        name: item.Name
                    });
                });
                TypeSource_Level_Order.FactoryID = TypeSource_Level.LineID;
                model.com.getCustomer({ active: 2 }, function (resP) {
                    if (!resP)
                        return;

                    $.each(resP.list, function (i, item) {
                        TypeSource_Level.BureauSectionID.push({
                            value: item.ID,
                            name: item.CustomerName
                        });
                    });
                    TypeSource_Level_Order.CustomerID = TypeSource_Level.BureauSectionID;
                    model.com.getFPCProduct({ ProductTypeID: 0, BusinessUnitID: 0 }, function (resP) {
                        if (!resP)
                            return;

                        $.each(resP.list, function (i, item) {

                            if (item.Active == 1) {
                                TypeSource_Level.ProductID.push({
                                    value: item.ID,
                                    name: item.ProductName
                                });
                            }

                        });
                        TypeSource_Level_Order.BusinessUnitID = TypeSource_Level.ProductID;
                        model.com.get({ active: 1 }, function (resP) {
                            if (!resP)
                                return;

                            $.each(resP.list, function (i, item) {
                                TypeSource_Level_Order.CreatorID.push({
                                    value: item.ID,
                                    name: item.Name
                                });
                            });
                            model.com.refresh();
                        });
                    });
                });
            });
        },

        com: {

            getFPCRoute: function (data, fn, context) {
                var d = {
                    $URI: "/FPCRoute/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //竣工确认
            confirmDone: function (data, fn, context) {
                var d = {
                    $URI: "/OMSOrder/CompleteConfirm",
                    $TYPE: "post",
                    $SERVER: "/MESAPS"

                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //出厂申请
            leaveFactorySQ: function (data, fn, context) {
                var d = {
                    $URI: "/OMSOrder/OutApply",
                    $TYPE: "post",
                    $SERVER: "/MESAPS"

                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //出厂确认
            leaveFactory: function (data, fn, context) {
                var d = {
                    $URI: "/OMSOrder/OutConfirm",
                    $TYPE: "post",
                    $SERVER: "/MESAPS"

                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },



            createAPSBOM: function (data, fn, context) {
                var d = {
                    $URI: "/IPTStandard/CreateAPSBOM",
                    $TYPE: "post",
                    $SERVER: '/MESQMS',

                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },


            getAPSBOM: function (data, fn, context) {
                var d = {
                    $URI: "/APSBOM/All",
                    $TYPE: "get",

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
            refresh: function () {
                $com.app.loading('数据加载中！！');
                model.com.getOMSCommand({}, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var Grade = $com.util.Clone(resP.list);
                        DATABasicOrder = $com.util.Clone(resP.list);


                        DataAllOrder = $com.util.Clone(Grade);

                        $.each(Grade, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Level_Order[p])
                                    continue;
                                item[p] = FORMATTRT_Level_Order[p](item[p]);
                            }
                            item.WID = i + 1;
                        });
                        DataAllSearchOrder = $com.util.Clone(Grade);
                        $("#femi-riskLevelOrder-tbody").html($com.util.template(Grade, HTML.TableOrderMode));
                        $("#femi-riskLevelOrder-tbody tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });

                    }
                    $com.app.loaded();
                });

            },


            refreshItem: function () {

                $com.app.loading('数据加载中！！');
                model.com.getOMSOrder({ "CommandID": CommandID }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var Grade = $com.util.Clone(resP.list);
                        DATABasic = $com.util.Clone(resP.list);

                        //审核数据
                        DataAllConfirm = $com.util.Clone(resP.list);

                        DataAll = $com.util.Clone(Grade);

                        $.each(Grade, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }


                            item.TimeText = item.RealReceiveDate;
                            if (new Date(item.RealReceiveDate) < new Date('2010-1-1')) {
                                item.TimeText = '-';
                            }
                            item.WID = i + 1;
                        });
                        DataAllSearch = $com.util.Clone(Grade);
                        $("#femi-riskLevel-tbody").html($com.util.template(Grade, HTML.TableMode));

                        $("#femi-riskLevel-tbody tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });

                    }
                    $com.app.loaded();
                });

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
            //查询模块ID对应枚举值
            getModuleAll: function (data, fn, context) {
                var d = {
                    $URI: "/MESEnum/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getOMSCommand: function (data, fn, context) {
                var d = {
                    $URI: "/OMSCommand/All",
                    $TYPE: "get",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //保存列表
            postCommandSave: function (data, fn, context) {
                var d = {
                    $URI: "/OMSCommand/Update",
                    $TYPE: "post",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //查询列表
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
            changeOMSOrder: function (data, fn, context) {
                var d = {
                    $URI: "/OMSOrder/ChangeRoute",
                    $TYPE: "post",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //保存列表
            postOMSOrder: function (data, fn, context) {
                var d = {
                    $URI: "/OMSOrder/Update",
                    $TYPE: "post",
                    $SERVER: "/MESAPS"
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
            activeOMSOrder: function (data, fn, context) {
                var d = {
                    $URI: "/OMSOrder/Active",
                    $TYPE: "post",
                    $SERVER: "/MESAPS"
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