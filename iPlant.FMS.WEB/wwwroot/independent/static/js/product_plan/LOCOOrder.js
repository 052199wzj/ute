require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/route_new', '../static/utils/js/base/tooltip', '../static/utils/js/base/Vue', '../static/utils/js/base/paging'], function ($zace, $com, $route, $tooltip, Vue, $page) {

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


        StartTime,
        EndTime,

        model,
        DataAll,
        DATABasic,
        DataAllConfirmBasic,
        DataAllConfirmChange,
        DataAllConfirm,
        DataAllSearch,
        DATAAllBusiness,
        DATAAllBusinessC,
        ProductList,
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
        FQTY: 0,
    };
    //详情订单
    PositionTemp = {
        ID: 0,
        FQTY: 0,
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
        FQTYActual: 0,
    };

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
            // '<td data-title="BusinessUnitID" data-value="{{BusinessUnitID}}" >{{BusinessUnitID}}</td>',
            '<td data-title="FQTYPlan" data-value="{{FQTYPlan}}" >{{FQTYPlan}}</td>',
            // '<td data-title="FQTYActual" data-value="{{FQTYActual}}" >{{FQTYActual}}</td>',
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
            // '<td data-title="WBSNo" data-value="{{WBSNo}}" >{{WBSNo}}</td>',
            '<td data-title="OrderNo" data-value="{{OrderNo}}" >{{OrderNo}}</td>',

            // '<td data-title="BureauSectionID" data-value="{{BureauSectionID}}" >{{BureauSectionID}}</td>',
            '<td data-title="LineID" data-value="{{LineID}}" >{{LineID}}</td>',
            '<td data-title="ProductID" data-value="{{ProductID}}" >{{ProductID}}</td>',
            // '<td data-title="PartNoText" data-value="{{PartNoText}}" >{{PartNoText}}</td>',
            // '<td data-title="Priority" data-value="{{Priority}}" >{{Priority}}</td>',
            '<td data-title="RouteID" data-value="{{RouteID}}" >{{RouteID}}</td>',
            // '<td data-title="TelegraphTime" data-value="{{TelegraphTime}}" >{{TelegraphTime}}</td>',
            // '<td data-title="TelegraphRealTime" data-value="{{TelegraphRealTime}}" >{{TelegraphRealTime}}</td>',
            '<td data-title="PlanReceiveDate" data-value="{{PlanReceiveDate}}" >{{PlanReceiveDate}}</td>',
            // '<td data-title="TimeText" data-value="{{TimeText}}" >{{TimeText}}</td>',
            '<td data-title="PlanFinishDate" data-value="{{PlanFinishDate}}" >{{PlanFinishDate}}</td>',
            '<td data-title="RealStartDate" data-value="{{RealStartDate}}" >{{RealStartDate}}</td>',
            '<td data-title="RealFinishDate" data-value="{{RealFinishDate}}" >{{RealFinishDate}}</td>',
            '<td data-title="RealSendDate" data-value="{{RealSendDate}}" >{{RealSendDate}}</td>',
            '<td data-title="Remark" data-value="{{Remark}}" >{{Remark}}</td>',
            '<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',
            '<td data-title="Active" data-value="{{Active}}" >{{Active}}</td>',

            '</tr>',
        ].join(""),

    };
    (function () {
        KEYWORD_Level_LIST = [
            "OrderNo|订单号*",

            "BureauSectionID|客户|ArrayOne",
            "LineID|产线|ArrayOne",
            "ProductID|型号|ArrayOne",
            "FQTYPlan|计划数量",
            //"PartNo|车号",//Priority
            // "Priority|优先级",
            "RouteID|工艺BOP|ArrayOne",
            "TelegraphTime|电报时刻|DateTime",
            "TelegraphRealTime|电报到场日期|Date",
            "PlanReceiveDate|ERP预计开工|Date",
            "RealReceiveDate|实际进厂|Date",
            "PlanFinishDate|ERP预计完工|Date",
            "RealStartDate|实际开工|Date",
            "RealFinishDate|实际完工|Date",
            "RealSendDate|交车日期|Date",
            "Remark|备注",

            "StartTime|开始时间|Date",
            "EndTime|结束时间|Date",

            // "Status|状态|ArrayOne",
            "Active|启用|ArrayOne",
            "CreateTime|时间|DateTime",
            "EditTime|时间|DateTime",
            "PlanEndTime|时间|DateTime",
            "PlanStartTime|时间|DateTime",
        ];
        KEYWORD_Level = {};
        FORMATTRT_Level = {};

        DEFAULT_VALUE_Level = {
            OrderNo: '',
            LineID: 0,
            ProductID: 0,
            FQTYPlan: 1,
            // BureauSectionID: 0,
            //PartNo: '',
            //Priority: 0,
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
            "No|编号*",
            "WBSNo|订单号*",
            "FactoryID|产线|ArrayOne",
            "CustomerID|客户|ArrayOne",
            // "BusinessUnitID|车型|ArrayOne",
            "OrderCount|计划数量",
            "FQTYPlan|计划数量",
            "FQTYActual|实际数量",
            "ContactCode|备注",
            "Status|状态|ArrayOne",
            "Active|启用|ArrayOne",
            "CreateTime|时间|DateTime",
            "EditTime|时间|DateTime",
            "AuditTime|时间|DateTime",
            "CreatorID|人|ArrayOne",
            "StartTime|开始时间|Date",
            "EndTime|结束时间|Date",
            "PlanEndTime|时间|DateTime",
            "PlanStartTime|时间|DateTime",
        ];
        KEYWORD_Level_Order = {};
        FORMATTRT_Level_Order = {};

        DEFAULT_VALUE_Level_Order = {
            //No: "",
            WBSNo: '',
            ContactCode: "",
            // CustomerID: 0,
            //OrderCount: 0,
            //BusinessUnitID: 0,
            //FactoryID: 0,
            //FQTYPlan: 0,
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


    var app = new Vue({
        el: '#lmvt-vueApp',
        data: {

            //ERP订单同步
            ERPOrderList: [],
            //制造令
            Grade: [],
            OrderSource: [],
            //订单
            GradeItem: [],
            GradeItemSource: [],
            //是否显示

            ERPShow: false,
            GradeItemISShow: false,

            GradeISShow: true,

            RouteISShow: false,
            DragLineISShow: false,
            //所属大订单
            GradeID: 0,

            //大订单状态

            //Command查询条件
            ComStartTime: $com.util.format("yyyy-MM-dd", new Date().getTime() - 120 * 3600000 * 24),
            ComEndTime: $com.util.format("yyyy-MM-dd", new Date().getTime() + 3600000 * 24 * 1),
            ComNo: "",

            //实际Com
            AComID: 0,
            OrderView: "订单集合",

            StatusList:
            {
                1: "已保存",
                2: "已制定",
                3: "已投产",
                4: "生产中",
                5: "已完工",
                6: "暂停中",
                7: "已入库",
                8: "已发货",
            },
        },
        beforeCreate() {
            _this = this;
        },

        created: function () {
            var VueThis = this;


            VueThis.getFMCLine({ FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0 }, function (resP) {
                if (!resP)
                    return;

                $.each(resP.list, function (i, item) {
                    TypeSource_Level.LineID.push({
                        value: item.ID,
                        name: item.Name,
                        WorkShopID: item.WorkShopID
                    });
                });
                TypeSource_Level_Order.FactoryID = TypeSource_Level.LineID;
                VueThis.getCustomer({ active: 2 }, function (resP) {
                    if (!resP)
                        return;

                    $.each(resP.list, function (i, item) {
                        TypeSource_Level.BureauSectionID.push({
                            value: item.ID,
                            name: item.CustomerName
                        });
                    });
                    TypeSource_Level_Order.CustomerID = TypeSource_Level.BureauSectionID;
                    VueThis.getFPCProduct({ ProductTypeID: 0, BusinessUnitID: 0 }, function (resP) {
                        if (!resP)
                            return;

                        ProductList = resP.list;

                        $.each(resP.list, function (i, item) {

                            if (item.Active == 1) {
                                TypeSource_Level.ProductID.push({
                                    value: item.ID,
                                    name: item.ProductNo
                                });
                            }

                        });
                        TypeSource_Level_Order.BusinessUnitID = TypeSource_Level.ProductID;
                        VueThis.get({ active: 1 }, function (resP) {
                            if (!resP)
                                return;

                            $.each(resP.list, function (i, item) {
                                TypeSource_Level_Order.CreatorID.push({
                                    value: item.ID,
                                    name: item.Name
                                });
                            });

                            $(document).ready(function () {
                                //_this.StartTime = $com.util.format("yyyy-MM-dd hh:mm", new Date().getTime() - 7 * 3600000 * 24);
                                //_this.EndTime = $com.util.format("yyyy-MM-dd hh:mm", new Date());
                                $("#lmvt-startTime").datetimepicker({
                                    format: 'yyyy-mm-dd',//显示格式
                                    // startView: 2,
                                    minView: 2,
                                    maxView: 2,
                                    language: 'zh-CN',
                                    autoclose: 1,//选择后自动关闭
                                    clearBtn: false,//清除按钮
                                }).on('changeDate', function (ev) {
                                    _this.ComStartTime = $("#lmvt-startTime").val();

                                    $("#lmvt-endTime").datetimepicker("setStartDate", _this.ComStartTime.toString("yyyy-MM-dd"));
                                });
                                $("#lmvt-endTime").datetimepicker({
                                    format: 'yyyy-mm-dd',//显示格式
                                    // startView: 2,
                                    minView: 2,
                                    maxView: 2,
                                    language: 'zh-CN',
                                    autoclose: 1,//选择后自动关闭
                                    clearBtn: false,//清除按钮
                                }).on('changeDate', function (ev) {

                                    _this.ComEndTime = $("#lmvt-endTime").val();
                                    $("#lmvt-startTime").datetimepicker("setEndDate", _this.ComEndTime.toString("yyyy-MM-dd"));
                                });


                            });
                            VueThis.refresh();
                        });
                    });
                });
            });
            VueThis.getFPCPart({ FactoryID: 0, BusinessUnitID: 0 }, function (resRP) {
                if (resRP && resRP.list) {
                    modelPartList = {};
                    $.each(resRP.list, function (i, item) {
                        modelPartList[item.ID] = item;
                    });
                }
            });

        },

        methods: {

            //查看工艺Bop
            hrefRoutePart: function (ID) {

                SelectData = _this.GradeItemSource.filter((item) => { return item.ID == ID })[0];

                var vdata = { 'header': '工序集', 'href': '/MESCore/independent/factory_model/FPCRoutePartSetting.html?id=' + SelectData.RouteID, 'id': 'FPCRoutePart', 'src': './static/images/menu/newfactoryModel/techniquePart.png' };
                window.parent.iframeHeaderSet(vdata);
                window.callFunctionTrigger("FPCRoutePart", { ID: SelectData.RouteID });

            },

            gantInfo: function (item) {

                var vdata = { 'header': '生产计划', 'href': './product_plan/PlanNowOrderLOCO.html?OrderID=' + item.ID + "&WorkShopID=" + item.WorkShopID, 'id': '2032', 'src': '/MESCore/upload/web/周计划.svg' };

                window.parent.iframeHeaderSet(vdata);

                window.callFunctionTrigger("PlanNowOrderLOCO", { OrderID: item.ID, WorkShopID: item.WorkShopID });

            },

            reset: function () {
                _this.ComStartTime = "";
                _this.ComEndTime = "";
                _this.ComNo = "";
            },

            //所有订单
            AllOrder: function () {
                if (_this.OrderView == "订单集合") {
                    _this.OrderView = "单条订单";
                    _this.GradeID = -1;
                    _this.refreshItem(_this.GradeID);

                }

                else {
                    _this.GradeID = _this.AComID;
                    _this.OrderView = "订单集合";
                    _this.refreshItem(_this.GradeID);
                }

            },

            refresh: function () {
                $com.app.loading('数据加载中！！');
                this.getOMSCommand({ StartTime: _this.ComStartTime, EndTime: _this.ComEndTime, WBSNo: _this.ComNo }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        _this.OrderSource = $com.util.Clone(resP.list);

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

                        _this.Grade = Grade;

                    };
                    $com.app.loaded();
                });
            },

            //修改工艺BOP
            resetRouteID: function (ID) {

                SelectData = _this.GradeItemSource.filter((item) => { return item.ID == ID });

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

                    $com.util.deleteLowerProperty(SelectData);

                    _this.changeOMSOrder({
                        data: SelectData[0],
                        RouteID: Number(rst.RouteID)
                    }, function (res) {
                        alert("更改工艺BOP成功");
                        _this.refreshItem(_this.GradeID);
                    })

                }, TypeSource_Level));

            },
            //新增子订单
            addGradeItem: function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    // if (rst.PartNo && rst.PartNo.length == 4 && !isNaN(rst.PartNo)) {

                    // } else {
                    //     alert('车号为4位数字！');
                    //     return false;
                    // }
                    //PositionTemp.Active = rst.Active;
                    //  PositionTemp.OrderNo = rst.OrderNo;
                    PositionTemp.LineID = Number(rst.LineID);
                    // PositionTemp.ProductID = mBusinessUnitID;

                    PositionTemp.ProductID = Number(rst.ProductID);

                    PositionTemp.OrderNo = rst.OrderNo;

                    //PositionTemp.BureauSectionID = mCustomerID;
                    PositionTemp.FQTYPlan = Number(rst.FQTYPlan);
                    //PositionTemp.PartNo = rst.PartNo;
                    // PositionTemp.Priority = Number(rst.Priority);
                    PositionTemp.PlanReceiveDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.PlanReceiveDate));
                    //PositionTemp.RealReceiveDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.RealReceiveDate));
                    PositionTemp.PlanFinishDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.PlanFinishDate));
                    // PositionTemp.RealStartDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.RealStartDate));
                    // PositionTemp.RealFinishDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.RealFinishDate));
                    // PositionTemp.RealSendDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.RealSendDate));
                    PositionTemp.Remark = rst.Remark;

                    PositionTemp.CommandID = _this.GradeID;
                    //for (var i = 0; i < DataProductList.length; i++) {
                    //    if (PositionTemp.ProductID == DataProductList[i].ID) {
                    //        PositionTemp.ProductNo = DataProductList[i].ProductNo;
                    //    }
                    //}
                    // if (PositionTemp.ProductID > 0 && rst.PartNo.length > 0) {
                    //     PositionTemp.PartNo = FORMATTRT_Level["ProductID"](PositionTemp.ProductID) + "#" + PositionTemp.PartNo;
                    // } else {

                    //     PositionTemp.PartNo = "";
                    // }

                    _this.postOMSOrder({
                        data: PositionTemp,
                    }, function (res) {
                        alert("新增成功");
                        _this.refreshItem(_this.GradeID);
                        //_listOrder[0].AuditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(_listOrder[0].AuditTime));
                        //_listOrder[0].CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(_listOrder[0].CreateTime));
                        //_listOrder[0].EditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(_listOrder[0].EditTime));
                        // _listOrder[0].FQTYActual += 1;
                        // model.com.postCommandSave({
                        //     data: _listOrder[0],
                        // }, function (res) {
                        // })
                    })

                }, TypeSource_Level, undefined, undefined, { PlanFinishDte: "49%", PlanReceiveDate: "49%" }));
            },

            //跳转到产品
            ProductHref: function () {

                var vdata = { 'header': '产品配置', 'href': './factory_model/ProductSetting.html', 'id': 'ProductSetting', 'src': '/MESCore/upload/web/电池包.png' };
                window.parent.iframeHeaderSet(vdata);
                window.callFunctionTrigger("ProductSetting");

            },

            //产线选择
            LineChoose: function () {

                var SelectData = $com.table.getSelectionData($("#femi-ERP-tbody"), "WID", _this.ERPOrderList);

                if (SelectData.length <= 0) {
                    alert("至少选择一条数据");
                    return false;
                }
                var DEFAULT_VALUE = {
                    LineID: 1
                };

                $("body").append($com.modal.show(DEFAULT_VALUE, KEYWORD_Level, "产线选择", function (rst) {
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    var cat = $com.util.Clone(_this.ERPOrderList);

                    var WorkShopID = 1;

                    $.each(TypeSource_Level, function (i, item) {
                        if (item.value == Number(rst.LineID)) {
                            WorkShopID = item.WorkShopID;
                            return false;
                        }
                    });

                    $.each(SelectData, function (i, item) {
                        $.each(cat, function (j, jtem) {
                            if (item.OrderDetailID == jtem.OrderDetailID) {
                                jtem.LineID = rst.LineID;

                                jtem.LineText = FORMATTRT_Level["LineID"](rst.LineID);
                                jtem.WorkShopID = WorkShopID;
                            }
                        });
                    });

                    _this.ERPOrderList = cat;
                }, TypeSource_Level));

            },

            //产线选择
            LineChooseOne: function (ID) {
                var SelectData = _this.ERPOrderList.filter((item) => { return item.WID == ID });

                var DEFAULT_VALUE = {
                    LineID: 1
                };

                $("body").append($com.modal.show(DEFAULT_VALUE, KEYWORD_Level, "产线选择", function (rst) {
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    var cat = $com.util.Clone(_this.ERPOrderList);

                    var WorkShopID = 1;

                    $.each(TypeSource_Level, function (i, item) {
                        if (item.value == Number(rst.LineID)) {
                            WorkShopID = item.WorkShopID;
                            return false;
                        }
                    });
                    $.each(SelectData, function (i, item) {
                        $.each(cat, function (j, jtem) {
                            if (item.OrderDetailID == jtem.OrderDetailID) {
                                jtem.LineID = rst.LineID;
                                jtem.LineText = FORMATTRT_Level["LineID"](rst.LineID);
                                jtem.WorkShopID = WorkShopID;
                            }
                        });
                    });

                    _this.ERPOrderList = cat;
                }, TypeSource_Level));

            },

            //订单保存
            ERPOrderSava: function () {

                var SelectData = $com.table.getSelectionData($("#femi-ERP-tbody"), "WID", _this.ERPOrderList);

                if (SelectData.length <= 0) {
                    alert("至少选择一条数据");
                    return false;
                }

                if (SelectData.length > 20) {
                    alert("一次最多同步二十条订单");
                    return false;
                }

                //保存前校验
                var NoLineIDList = [],
                    NoProductIDList = [],
                    MESProductIDList = [],
                    HasSave = [];
                $.each(SelectData, function (i, item) {
                    if (!item.LineID || item.LineID == 0) {
                        NoLineIDList.push(item.OrderNo);
                    }
                    if (item.MaterialModel == " " || item.MaterialModel.length == 0) {
                        NoProductIDList.push(item.OrderNo);
                    }

                    $.each(ProductList, function (k, ktem) {
                        if (item.MaterialNo == ktem.MaterialNo) {
                            MESProductIDList.push(item.OrderNo);
                            return false;
                        }
                    });
                    if (item.StatusIndex && item.StatusIndex == 1) {
                        HasSave.push(item.OrderNo);
                    }

                });
                if (NoLineIDList.length > 0) {
                    alert("订单号为" + NoLineIDList.join(",") + "的订单未选择产线，请选择后再保存");
                    return false;
                }
                if (NoProductIDList.length > 0) {
                    alert("订单号为" + NoProductIDList.join(",") + "的订单没有型号无法进行保存操作");
                    return false;
                }
                if (MESProductIDList.length == 0) {
                    alert("订单号为" + MESProductIDList.join(",") + "的订单MES系统中未找到与之相匹配激活的型号，无法进行保存操作");
                    return false;
                }
                if (HasSave.length > 0) {
                    alert("订单号为" + HasSave.join(",") + "的订单已经同步过，无法进再次同步");
                    return false;
                }

                // OrderTemp.No = new Date().toString();
                // OrderTemp.WBSNo = new Date().toString();
                // OrderTemp.CustomerID = 0;
                // OrderTemp.ContactCode = "";

                $com.app.loading('数据加载中！！');

                var cat = {};
                //对存在相同的订单号进行分类
                $.each(SelectData, function (i, item) {


                    if (!cat[item.OrderNo]) {
                        cat[item.OrderNo] = [];
                        cat[item.OrderNo].push(item);
                    }
                });
                //遍历得到的归纳对象，生成新的一个扁平数组

                for (const key in cat) {

                    OrderTemp.WorkShopID = cat[key][0].WorkShopID;
                    OrderTemp.WBSNo = cat[key][0].OrderNo;
                    OrderTemp.CustomerID = 0;
                    OrderTemp.ContactCode = "";

                    _this.postCommandSave({
                        data: OrderTemp,
                    }, function (res) {

                        $.each(cat[key], function (i, item) {

                            PositionTemp.CommandID = res.info;

                            PositionTemp.FQTYPlan = item.FQTY;

                            PositionTemp.LineID = item.LineID;

                            $.each(ProductList, function (k, ktem) {
                                if (item.MaterialNo == ktem.MaterialNo) {
                                    PositionTemp.ProductID = ktem.ID;
                                    return false;
                                }
                            });

                            PositionTemp.BOMNo = item.BOMNo;

                            PositionTemp.MaterialID = item.MaterialID;

                            PositionTemp.MaterialNo = item.MaterialNo;

                            PositionTemp.ERPID = item.OrderDetailID;

                            PositionTemp.OrderNo = item.OrderNo;

                            PositionTemp.FQTYPlan = item.FQTY;

                            PositionTemp.PlanReceiveDate = $com.util.format('yyyy-MM-dd hh:mm:ss', item.PlanStartTime);

                            PositionTemp.PlanFinishDate = $com.util.format('yyyy-MM-dd hh:mm:ss', item.PlanEndTime);

                            PositionTemp.TelegraphRealTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.PlanEndTime);

                            PositionTemp.RealSendDate = $com.util.format('yyyy-MM-dd hh:mm:ss', item.PlanEndTime);

                            PositionTemp.Remark = item.Remark;

                            _this.postOMSOrder({
                                data: PositionTemp,
                            }, function (res) {
                                console.log(res);
                                _this.GetERPOrderList(StartTime, EndTime);
                                alert("同步成功");
                            })

                        });

                    });

                }


                $com.app.loaded();

                // _this.postCommandSave({
                //     data: OrderTemp,
                // }, function (res) {

                //     $.each(SelectData, function (i, item) {


                //     });


                // })
            },

            GetERPOrderList: function (StartTime, EndTime) {
                _this.postQueryOrderList({
                    OrderIDs: [],
                    OrderStatus: [3, 4],
                    OrderNo: "",
                    StartTime: StartTime,
                    EndTime: EndTime
                }, function (res) {

                    _this.getOMSOrder({ StartTime: StartTime, EndTime: EndTime }, function (resP) {

                        $.each(res.list, function (i, item) {
                            item.WID = i + 1;
                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }

                            let arrIndex = resP.list.findIndex(jtem => {
                                return item.OrderDetailID === jtem.ERPID
                            })

                            if (arrIndex > -1) {
                                item.StatusText = "已保存";
                                item.StatusIndex = 1;
                                item.LineText = resP.list[arrIndex].LineName;
                                item.LineID = resP.list[arrIndex].LineID;
                            } else {
                                item.StatusText = "未保存";
                                item.StatusIndex = 0;
                            }

                        });

                        _this.ERPOrderList = res.list;
                        $com.app.loaded();

                    });


                    // _this.ERPOrderList = res.list;
                    // $com.app.loaded();
                });
            },

            //同步订单
            WeekTime: function (ID) {


                StartTime = new Date();
                EndTime = new Date();

                switch (ID) {
                    case 1:
                        $com.app.loading('数据加载中！！');
                        StartTime = new Date(new Date().setDate((new Date().getDate() - 7)));
                        _this.GetERPOrderList(StartTime, EndTime);
                        break;
                    case 2:
                        $com.app.loading('数据加载中！！');
                        StartTime = new Date(new Date().setDate((new Date().getDate() - 30)));
                        _this.GetERPOrderList(StartTime, EndTime);
                        break;
                    case 3:
                        $com.app.loading('数据加载中！！');
                        StartTime = new Date(new Date().setDate((new Date().getDate() - 120)));
                        _this.GetERPOrderList(StartTime, EndTime);
                        break;
                    case 4:
                        var DEFAULT_VALUE = {
                            StartTime: StartTime,
                            EndTime: EndTime
                        };
                        $("body").append($com.modal.show(DEFAULT_VALUE, KEYWORD_Level, "查询", function (rst) {
                            if (!rst || $.isEmptyObject(rst))
                                return;

                            if (new Date(rst.StartTime).getTime() > new Date(rst.EndTime).getTime()) {
                                alert("开始时间大于结束时间，请重新选择");
                                return false;
                            }
                            StartTime = $com.util.format("yyyy-MM-dd", rst.StartTime);
                            EndTime = $com.util.format("yyyy-MM-dd", rst.EndTime);

                            $com.app.loading('数据加载中！！');
                            _this.GetERPOrderList(StartTime, EndTime);
                        }, TypeSource_Level));
                        break;
                }


            },

            //按钮点击
            searchLevelPro: function () {
                var value = $("#zace-search-level").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    _this.GradeItem = DataAllSearch;
                else
                    //$com.table.filterByLikeString($("#femi-riskLevel-tbody"), _this.GradeItem, value, "WID");
                    $com.table.filterByLikeStringData($("#femi-riskLevel-tbody"), _this.GradeItem, value, undefined, undefined, undefined, function (res) {
                        _this.GradeItem = res;
                    });
            },
            //按钮点击
            searchlevelProGrade: function () {
                var value = $("#zace-search").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    _this.Grade = DataAllSearchOrder;
                else
                    //$com.table.filterByLikeString($("#femi-riskLevelOrder-tbody"), _this.Grade, value, "WID");
                    $com.table.filterByLikeStringData($("#femi-riskLevelOrder-tbody"), _this.Grade, value, undefined, undefined, undefined, function (res) {
                        _this.Grade = res;
                    });
            },

            //模糊查询
            searchLevel: function () {
                if (event.keyCode == 13 && TypeMode == 2) {
                    var $this = $(this);
                    var value = $("#zace-search-level").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        _this.GradeItem = DataAllSearch;
                    else
                        $com.table.filterByLikeStringData($("#femi-riskLevel-tbody"), _this.GradeItem, value, undefined, undefined, undefined, function (res) {
                            _this.GradeItem = res;
                        });
                }

                if (event.keyCode == 13 && TypeMode == 1) {
                    var $this = $(this);
                    var value = $("#zace-search").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        _this.Grade = DataAllSearchOrder;
                    else
                        $com.table.filterByLikeStringData($("#femi-riskLevelOrder-tbody"), _this.Grade, value, undefined, undefined, undefined, function (res) {
                            _this.Grade = res;
                        });
                }
            },

            //新增事件
            HandClick: function (res) {
                $("body").append($com.modal.show(DEFAULT_VALUE_Level_Order, KEYWORD_Level_Order, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    // if (rst.WBSNo.length < 1 || rst.WBSNo.trim().length < 1) {
                    //     alert('WBS必填！');
                    //     return false;
                    // }

                    //OrderTemp.BusinessUnitID = Number(rst.BusinessUnitID);
                    // PositionTemp.FactoryID = Number(rst.FactoryID);              
                    //OrderTemp.No = rst.No;
                    OrderTemp.WBSNo = rst.WBSNo;
                    // OrderTemp.CustomerID = Number(rst.CustomerID);
                    // OrderTemp.FactoryID = Number(rst.FactoryID);
                    OrderTemp.ContactCode = rst.ContactCode;
                    //OrderTemp.OrderCount = Number(rst.OrderCount);
                    //OrderTemp.FQTYPlan = Number(rst.FQTYPlan);

                    _this.postCommandSave({
                        data: OrderTemp,
                    }, function (res) {

                        alert("新增成功");
                        _this.refresh();
                    })

                }, TypeSource_Level_Order));
            },

            cat: function () {
                var $table = $(document.getElementsByClassName('table-partOrderItem1')),
                    fileName = _this.ComStartTime + " - " + _this.ComEndTime + "订单列表.xls",
                    Title = _this.ComStartTime + " - " + _this.ComEndTime + "订单列表";

                var ExportList = $com.util.Clone(_this.GradeItem);

                $.each(ExportList, function (i, item) {
                    item.Status = _this.StatusList[item.Status];
                });

                var params = $com.table.getExportParams($table, fileName, Title, ExportList);

                _this.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });
            },
            back: function () {
                _this.GradeItemISShow = false;
                _this.GradeISShow = true;
                TypeMode = 1;
            },

            ERPback: function () {
                _this.GradeISShow = true;

                _this.ERPShow = false;

                _this.refresh();

                TypeMode = 1;
            },

            ERPSourceShow: function () {
                _this.GradeISShow = false;
                _this.ERPShow = true;
            },

            //修改事件
            ChangeTableTR: function (ID) {

                SelectData = _this.OrderSource.filter((item) => { return item.ID == ID });

                var default_value = {
                    No: SelectData[0].No,
                    WBSNo: SelectData[0].WBSNo,
                    //BusinessUnitID: SelectData[0].BusinessUnitID,
                    CustomerID: SelectData[0].CustomerID,
                    ContactCode: SelectData[0].ContactCode,
                    //OrderCount: SelectData[0].OrderCount,
                    //FactoryID: SelectData[0].FactoryID,
                    //FQTYPlan: SelectData[0].FQTYPlan,
                    // FQTYActual: SelectData[0].FQTYActual,
                    //  Status: SelectData[0].Status,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level_Order, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    if (rst.WBSNo.length < 1 || rst.WBSNo.trim().length < 1) {
                        alert('工单号必填！');
                        return false;
                    }

                    SelectData[0].No = rst.No;
                    SelectData[0].WBSNo = rst.WBSNo;
                    //SelectData[0].BusinessUnitID = Number(rst.BusinessUnitID);
                    SelectData[0].ContactCode = rst.ContactCode;
                    SelectData[0].CustomerID = Number(rst.CustomerID);
                    // SelectData[0].FactoryID = Number(rst.FactoryID);
                    //SelectData[0].FactoryID = Number(rst.FactoryID);
                    //SelectData[0].OrderCount = Number(rst.OrderCount);
                    //SelectData[0].FQTYPlan = Number(rst.FQTYPlan);
                    // SelectData[0].FQTYActual = Number(rst.FQTYActual);

                    for (var i = 0; i < SelectData.length; i++) {
                        $com.util.deleteLowerProperty(SelectData[i]);
                        SelectData[i].AuditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].AuditTime));
                        SelectData[i].CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].CreateTime));
                        SelectData[i].EditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].EditTime));
                    }


                    _this.postCommandSave({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        _this.refresh();
                        //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                        //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));
                    })



                }, TypeSource_Level_Order));

            },

            //删除事件
            deleteTableInfo: function (ID) {

                SelectData = _this.OrderSource.filter((item) => { return item.ID == ID });

                if (!confirm("已选择订单号为" + SelectData[0].WBSNo + "的订单,是否删除")) {
                    return false;
                }

                _this.postCommandDelete({
                    data: SelectData,
                }, function (res) {
                    alert("删除成功");
                    _this.refresh();
                })

            },

            //删除ORDER事件
            deletOrderTableInfo: function (ID) {

                SelectData = _this.GradeItemSource.filter((item) => { return item.ID == ID });

                if (!confirm("已选择订单号为" + SelectData[0].WBSNo + "的订单,是否删除")) {
                    return false;
                }

                _this.postOrderDelete({
                    data: SelectData,
                }, function (res) {
                    alert("删除成功");
                    _this.refreshItem(_this.GradeID);
                })

            },

            //生产制造令
            getOrderInfo: function (ID) {
                _this.GradeID = ID;

                _this.AComID = ID;

                TypeMode = 2;
                _this.GradeItemISShow = true;
                _this.GradeISShow = false;

                SelectData = $com.util.findAll(_this.OrderSource, function (element, index, array) {
                    return element.ID == ID;
                });


                //             //修改总订单数量
                //             _listOrder = [];
                //             for (var i = 0; i < DataAllOrder.length; i++) {
                //                 $com.util.deleteLowerProperty(DataAllOrder[i]);
                //                 if (DataAllOrder[i].ID == CommandID) {
                //                     _listOrder.push(DataAllOrder[i]);
                //                     mBusinessUnitID = DataAllOrder[i].BusinessUnitID;  //车型
                //                     mCustomerID = DataAllOrder[i].CustomerID;  //局段
                //                     mLine = DataAllOrder[i].FactoryID;//修程
                //                 }

                //             }

                //             var $this = $(this);
                //             var WName = $this.find('td[data-title=ContactCode]').attr('data-value');
                //             var WID = Number($this.find('td[data-title=ID]').attr('data-value'));
                //             var WNo = $this.find('td[data-title=No]').attr('data-value');
                //             //$("#zace-span-change").html(WNo);
                //             CommandID = WID;

                _this.getFPCRoute({ LineID: SelectData[0].FactoryID, Active: 1 }, function (resP) {
                    if (!resP)
                        return;
                    if (TypeSource_Level.RouteID.length > 1)
                        TypeSource_Level.RouteID = [];
                    $.each(resP.list, function (i, item) {
                        TypeSource_Level.RouteID.push({
                            value: item.ID,
                            name: item.VersionNo
                        });
                    });

                    _this.refreshItem(SelectData[0].ID);

                });
            },

            //订单
            refreshItem: function (ID) {

                $com.app.loading('数据加载中！！');

                _this.getOMSOrder({ CommandID: ID, PreStartTime: _this.ComStartTime, PreEndTime: _this.ComEndTime }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var Grade = $com.util.Clone(resP.list);
                        DATABasic = $com.util.Clone(resP.list);

                        _this.GradeItemSource = $com.util.Clone(resP.list);

                        //审核数据
                        DataAllConfirm = $com.util.Clone(resP.list);

                        DataAll = $com.util.Clone(Grade);

                        $.each(Grade, function (i, item) {

                            item.StatusIndex = item.Status;

                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }

                            //item.PartNoText = item.PartNo.split("#")[1] && item.PartNo.split("#")[1].length > 0 ? item.PartNo.split("#")[1] : '';
                            //item.TimeText = item.RealReceiveDate;
                            if (new Date(item.RealReceiveDate) < new Date('2010-1-1')) {
                                item.RealReceiveDate = '-';
                            }

                            if (new Date(item.TelegraphRealTime) < new Date('2010-1-1')) {
                                item.TelegraphRealTime = '-';
                            }

                            if (new Date(item.TelegraphRealTime) < new Date('2010-1-1')) {
                                item.TelegraphRealTime = '-';
                            }

                            // item.PlanReceiveDate = item.PlanReceiveDate;
                            if (new Date(item.PlanReceiveDate) < new Date('2010-1-1')) {
                                item.PlanReceiveDate = '-';
                            }

                            if (new Date(item.PlanFinishDate) < new Date('2010-1-1')) {
                                item.PlanFinishDate = '-';
                            }

                            if (new Date(item.RealStartDate) < new Date('2010-1-1')) {
                                item.RealStartDate = '-';
                            }

                            if (new Date(item.RealFinishDate) < new Date('2010-1-1')) {
                                item.RealFinishDate = '-';
                            }

                            if (new Date(item.RealSendDate) < new Date('2010-1-1')) {
                                item.RealSendDate = '-';
                            }

                            if (new Date(item.TelegraphTime) < new Date('2010-1-1')) {
                                item.TelegraphTime = '-';
                            }

                            item.WID = i + 1;

                            if (item.FQTYPlan == 0) {
                                item.ProgressNow = 0;
                            } else {
                                item.ProgressNow = (item.FQTYActual / item.FQTYPlan) * 100;
                            }

                        });



                        DataAllSearch = $com.util.Clone(Grade);

                        $page.init($(".table-partOrderItem1"), Grade, "", function (res) {
                            _this.GradeItem = res;
                        });

                        // $("#femi-riskLevel-tbody").html($com.util.template(Grade, HTML.TableMode));

                        // $("#femi-riskLevel-tbody tr").each(function (i, item) {
                        //     var $this = $(this);
                        //     var colorName = $this.css("background-color");
                        //     $this.attr("data-color", colorName);



                        // });


                    }
                    $com.app.loaded();
                });

            },
            //修改订单
            reviseOrderInfo: function (ID) {

                SelectData = _this.GradeItemSource.filter((item) => { return item.ID == ID });

                var default_value = {
                    OrderNo: SelectData[0].OrderNo,
                    // RouteID: SelectData[0].RouteID,
                    ProductID: SelectData[0].ProductID,
                    // BureauSectionID: SelectData[0].BureauSectionID,
                    FQTYPlan: SelectData[0].FQTYPlan,
                    //PartNo: SelectData[0].PartNo.split("#")[1],
                    //Priority: SelectData[0].Priority,
                    PlanReceiveDate: SelectData[0].PlanReceiveDate,
                    //TelegraphRealTime: new Date(SelectData[0].TelegraphRealTime) < new Date('2010-1-1') ? new Date() : new Date(SelectData[0].TelegraphRealTime),
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
                    SelectData[0].OrderNo = rst.OrderNo;
                    // SelectData[0].LineID = Number(rst.LineID);
                    SelectData[0].ProductID = Number(rst.ProductID);
                    // SelectData[0].BureauSectionID = Number(rst.BureauSectionID);
                    //SelectData[0].WBSNo = rst.WBSNo;
                    //SelectData[0].PartNo = rst.PartNo;
                    //SelectData[0].Priority = Number(rst.Priority);
                    SelectData[0].FQTYPlan = Number(rst.FQTYPlan);
                    SelectData[0].PlanReceiveDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.PlanReceiveDate));
                    //SelectData[0].TelegraphRealTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.TelegraphRealTime));
                    SelectData[0].PlanFinishDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.PlanFinishDate));
                    SelectData[0].Remark = rst.Remark;
                    // if (SelectData[0].ProductID > 0 && rst.PartNo.length > 0) {

                    //     // if (rst.PartNo && rst.PartNo.length == 4 && !isNaN(rst.PartNo)) {

                    //     // } else {
                    //     //     alert('车号为4位数字！');
                    //     //     return false;
                    //     // }
                    //     SelectData[0].PartNo = rst.PartNo;
                    //     SelectData[0].PartNo = FORMATTRT_Level["ProductID"](SelectData[0].ProductID) + "#" + SelectData[0].PartNo;
                    // } else {

                    //     SelectData[0].PartNo = "";
                    // }
                    //格式化时间
                    SelectData[0].AuditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[0].AuditTime));
                    SelectData[0].CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[0].CreateTime));
                    SelectData[0].EditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[0].EditTime));
                    for (var i = 0; i < SelectData.length; i++) {

                        $com.util.deleteLowerProperty(SelectData[i]);
                    }

                    _this.postOMSOrder({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        _this.refreshItem(_this.GradeID);
                        //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                        //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    })

                }, TypeSource_Level));
            },

            productionProgress: function (ID) {
                SelectData = _this.GradeItemSource.filter((item) => { return item.ID == ID });

                var _dataAll = [];
                if (SelectData[0].RouteID < 1) {
                    alert('请先设置此车的生产路线！');
                    return false;
                }
                var wRouteIDZace = SelectData[0].RouteID;
                var wOrderIDZace = SelectData[0].ID;
                $com.app.loading('数据加载中...');
                _this.getFPCRoutePart({ RouteID: wRouteIDZace }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {

                        for (var n = 0; n < resP.list.length; n++) {

                            resP.list[n].PartZaceName = modelPartList[resP.list[n].PartID].Name;
                            resP.list[n].bgColor = 'gray';
                            var C_list = [];
                            for (p in resP.list[n].NextPartIDMap) {

                                C_list.push({
                                    key: p,
                                    value: resP.list[n].NextPartIDMap[p]
                                });


                            }

                            resP.list[n].NextIDText = '';
                            var _listZace = [];
                            for (var j = 0; j < C_list.length; j++) {
                                _listZace.push(Number(C_list[j].key));


                            }


                            resP.list[n].NextID = _listZace;

                        }
                        _dataAll = resP.list;


                    }

                    _this.getRouteDone({ OrderID: wOrderIDZace }, function (resP) {
                        if (!resP)
                            return;
                        if (resP && resP.list) {
                            var _dataDoneAll = resP.list;//做完了的工位
                            var _dataDoningAll = resP.DoingList;//正在做
                            for (var m = 0; m < _dataAll.length; m++) {
                                for (var n = 0; n < _dataDoneAll.length; n++) {
                                    if (_dataAll[m].PartID == _dataDoneAll[n]) {
                                        _dataAll[m].bgColor = 'green';
                                    }

                                }

                                for (var p = 0; p < _dataDoningAll.length; p++) {
                                    if (_dataAll[m].PartID == _dataDoningAll[p]) {
                                        _dataAll[m].bgColor = 'orange';
                                    }

                                }
                            }
                            _this.RouteISShow = false;
                            _this.DragLineISShow = false;

                            _this.GradeItemISShow = true;
                            _this.GradeISShow = true;

                            _this.renderRouteChart(_dataAll);
                            var title = SelectData[0].PartNo + "生产路线";
                            $(".zace-titleZ").html(title);
                            $com.app.loaded();
                        }



                    });

                });
            },
            renderRouteChart: function (_dataPart) {

                //拿到此路线下对应的工序段
                var OrderIDList = _dataPart;   //順序ID集合
                var routePartArr = [];
                ZaceData = [];   //初始化

                routePartArr = $com.util.Clone(_dataPart);

                $.each(routePartArr, function (i, item) {
                    item.Type = 1;
                });

                $('#DragLine').html('');

                //显示流程图

                //为流程图添加方法
                //创建悬浮框方法
                var mouseoverFn = function (data, json) {
                    var cv = $(".left-contain").scrollTop();
                    //var cl = $("#ChartRoute").scrollLeft();
                    var $target = {
                        offset: function () {
                            return {
                                left: json.X + json.left + 300 + 15,
                                top: json.Y + json.top + 60 - cv,
                            };
                        },
                        width: function () {
                            return json.width;
                        },
                        height: function () {
                            return json.height;
                        },
                    }

                }
                var mouseoutFn = function (data) {
                    $tooltip.clear();
                }
                //点击方法
                var clickFn = function (data, json) {
                    var _info = data;
                    var showInfo = $com.util.Clone(_info);

                }
                var dragFn = function (data) {
                    var _data = data.data.data;

                    $.each(mZacePart, function (j, item_j) {
                        $.each(_data, function (i, item) {
                            if (item.ID != item_j.PartID)
                                return true;

                            item_j.OrderID = item.OrderID;
                            item_j.PrevPartID = item.PrevID;

                            item_j.NextPartIDMap = {};
                            if (item.NextIDList && item.NextIDList.length > 0) {

                                $.each(item.NextIDList, function (k, item_k) {
                                    item_j.NextPartIDMap[item_k + ""] = 0;
                                    console.log(j);
                                });
                            }

                        });
                    });

                }
                //2 创建结构
                var dataObj = {

                    data: routePartArr,
                    dataSet: {//对应关系
                        Text: "PartZaceName", //显示字段名称
                        Index: "PartID", //索引字段名称
                        PrevIndex: "PrevPartID", //上级字段名称
                        NextIndex: "NextID", //下级字段名称
                        TypeIndex: "Type", //下级字段名称
                        FatherID: "FatherID",  //父级ID
                        BGC: "bgColor", //背景色字段名称
                        FGC: "bb", //前景色字段名称
                    },
                    background_color: 'orange', //流程框背景颜色
                    foreground_color: 'orange', //箭头颜色 
                    text_color: "white", //文字颜色
                    fn_mouseover: mouseoverFn, //鼠标悬停触发
                    fn_mouseout: mouseoutFn, //鼠标移走事件
                    fn_click: undefined, //鼠标单击
                    fn_drag: undefined, //鼠标拖动
                    constant: {
                        lineOperation: false,
                        // dottedLine: true,
                        font: "bold 15px 宋体",//字体样式
                        fontSize: 15,//字体大小
                        rect_width: 200, //矩形的宽
                        rect_height: 50,
                    },
                }
                $('#DragLine').show();
                //4 显示流程图
                $route.show($('#DragLine'), dataObj);


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
            //查
            getRouteDone: function (data, fn, context) {
                var d = {
                    $URI: "/RSMTurnOrderTask/BOPDoneList",
                    $TYPE: "get",
                    $SERVER: '/MESQMS'
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //ERP同步信息
            postQueryOrderList: function (data, fn, context) {
                var d = {
                    $URI: "/ERPOrder/QueryOrderList",
                    $TYPE: "post",
                    $SERVER: '/iPlantERP'
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //查询产品工序段列表
            getFPCRoutePart: function (data, fn, context) {
                var d = {
                    $URI: "/FPCRoutePart/All",
                    $TYPE: "get"
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
            //查询工序
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
            //用户
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
            //删除Command
            postCommandDelete: function (data, fn, context) {
                var d = {
                    $URI: "/OMSCommand/Delete",
                    $TYPE: "post",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //删除Order
            postOrderDelete: function (data, fn, context) {
                var d = {
                    $URI: "/OMSOrder/Delete",
                    $TYPE: "post",
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
        },


    });



    // model = $com.Model.create({
    //     name: 'LOCO',
    //     VueName : "AAAA",   

    //     type: $com.Model.MAIN,

    //     configure: function () {
    //         this.run();

    //     },

    //     events: function () {

    //         //预检记录导出
    //         $("body").delegate("#zace-Precheckactive-one", "click", function () {

    //             var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

    //             if (!SelectData || !SelectData.length) {
    //                 alert("请先选择一行数据再试！")
    //                 return;
    //             }
    //             if (SelectData.length != 1) {
    //                 alert("只能同时对一行数据操作！")
    //                 return;
    //             }
    //             $com.app.loading('数据导出中！！');


    //             model.com.exportReport({
    //                 OrderID: SelectData[0].ID,
    //             }, function (res) {

    //                 var src = res.info;
    //                 window.open(src);
    //                 $com.app.loaded();

    //             });


    //         });



    //         $("body").delegate("#zace-addLine-levelReturn", "click", function () {

    //             $('.zzzb').show();
    //             $('.zzza').hide();
    //             $('.zace-line-route').hide();
    //             $('#DragLine').hide();

    //         });

    //         $("body").delegate("#zace-open-routeLine", "click", function () {

    //             var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

    //             if (!SelectData || !SelectData.length) {
    //                 alert("请先选择一行数据再试！")
    //                 return;
    //             }
    //             if (SelectData.length != 1) {
    //                 alert("只能同时对一行数据操作！")
    //                 return;
    //             }
    //             var _dataAll = [];
    //             if (SelectData[0].RouteID < 1) {
    //                 alert('请先设置此车的生产路线！');
    //                 return false;
    //             }
    //             var wRouteIDZace = SelectData[0].RouteID;
    //             var wOrderIDZace = SelectData[0].ID;
    //             $com.app.loading('数据加载中...');
    //             model.com.getFPCRoutePart({ RouteID: wRouteIDZace }, function (resP) {
    //                 if (!resP)
    //                     return;
    //                 if (resP && resP.list) {

    //                     for (var n = 0; n < resP.list.length; n++) {

    //                         resP.list[n].PartZaceName = modelPartList[resP.list[n].PartID].Name;
    //                         resP.list[n].bgColor = 'gray';
    //                         var C_list = [];
    //                         for (p in resP.list[n].NextPartIDMap) {

    //                             C_list.push({
    //                                 key: p,
    //                                 value: resP.list[n].NextPartIDMap[p]
    //                             });


    //                         }

    //                         resP.list[n].NextIDText = '';
    //                         var _listZace = [];
    //                         for (var j = 0; j < C_list.length; j++) {
    //                             _listZace.push(Number(C_list[j].key));


    //                         }


    //                         resP.list[n].NextID = _listZace;

    //                     }
    //                     var _dataAll = resP.list;


    //                 }

    //                 model.com.getRouteDone({ OrderID: wOrderIDZace }, function (resP) {
    //                     if (!resP)
    //                         return;
    //                     if (resP && resP.list) {
    //                         var _dataDoneAll = resP.list;//做完了的工位

    //                         var _dataDoningAll = resP.DoingList;//正在做


    //                         for (var m = 0; m < _dataAll.length; m++) {

    //                             for (var n = 0; n < _dataDoneAll.length; n++) {
    //                                 if (_dataAll[m].PartID == _dataDoneAll[n]) {
    //                                     _dataAll[m].bgColor = 'green';
    //                                 }

    //                             }

    //                             for (var p = 0; p < _dataDoningAll.length; p++) {
    //                                 if (_dataAll[m].PartID == _dataDoningAll[p]) {
    //                                     _dataAll[m].bgColor = 'orange';
    //                                 }

    //                             }
    //                         }

    //                         $('.zzzb').hide();
    //                         $('.zzza').hide();

    //                         $('.zace-line-route').show();
    //                         $('#DragLine').show();


    //                         model.com.renderRouteChart(_dataAll);
    //                         var title = SelectData[0].PartNo + "生产路线";
    //                         $(".zace-titleZ").html(title);

    //                         $com.app.loaded();
    //                     }



    //                 });

    //             });



    //         });

    //         //导出
    //         $("body").delegate("#zace-active-one", "click", function () {

    //             var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

    //             if (!SelectData || !SelectData.length) {
    //                 alert("请先选择一行数据再试！")
    //                 return;
    //             }
    //             if (SelectData.length != 1) {
    //                 alert("只能同时对一行数据操作！")
    //                 return;
    //             }
    //             $com.app.loading('数据导出中！！');


    //             model.com.oneExport({
    //                 OrderID: SelectData[0].ID,
    //             }, function (res) {

    //                 var src = res.info;
    //                 window.open(src);
    //                 $com.app.loaded();

    //             })


    //         });

    //         $("body").delegate("#zace-disable-two", "click", function () {

    //             var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

    //             if (!SelectData || !SelectData.length) {
    //                 alert("请先选择一行数据再试！")
    //                 return;
    //             }
    //             if (SelectData.length != 1) {
    //                 alert("只能同时对一行数据操作！")
    //                 return;
    //             }
    //             $com.app.loading('数据导出中！！');


    //             model.com.twoExport({
    //                 OrderID: SelectData[0].ID,
    //             }, function (res) {

    //                 var src = res.info;
    //                 window.open(src);
    //                 $com.app.loaded();

    //             })


    //         });

    //         $("body").delegate("#zace-active-three", "click", function () {

    //             var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

    //             if (!SelectData || !SelectData.length) {
    //                 alert("请先选择一行数据再试！")
    //                 return;
    //             }
    //             if (SelectData.length != 1) {
    //                 alert("只能同时对一行数据操作！")
    //                 return;
    //             }
    //             $com.app.loading('数据导出中！！');


    //             model.com.threeExport({
    //                 OrderID: SelectData[0].ID,
    //             }, function (res) {

    //                 var src = res.info;
    //                 window.open(src);
    //                 $com.app.loaded();

    //             })


    //         });

    //         $("body").delegate("#zace-disable-four", "click", function () {

    //             var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

    //             if (!SelectData || !SelectData.length) {
    //                 alert("请先选择一行数据再试！")
    //                 return;
    //             }
    //             if (SelectData.length != 1) {
    //                 alert("只能同时对一行数据操作！")
    //                 return;
    //             }
    //             $com.app.loading('数据导出中！！');


    //             model.com.fourExport({
    //                 OrderID: SelectData[0].ID,
    //             }, function (res) {

    //                 var src = res.info;
    //                 window.open(src);
    //                 $com.app.loaded();

    //             })


    //         });






    //         $("body").delegate("#zace-received-level", "click", function () {

    //             var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

    //             if (!SelectData || !SelectData.length) {
    //                 alert("请先选择一行数据再试！")
    //                 return;
    //             }
    //             // if (SelectData.length != 1) {
    //             //     alert("只能同时对一行数据操作！")
    //             //     return;
    //             // }


    //             model.com.receiveDone({
    //                 data: SelectData,
    //             }, function (res) {
    //                 alert("已收电报");
    //                 model.com.refreshItem();


    //             })


    //         });

    //         //机车进厂
    //         $("body").delegate("#zace-received-factory", "click", function () {

    //             var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

    //             if (!SelectData || !SelectData.length) {
    //                 alert("请先选择一行数据再试！")
    //                 return;
    //             }
    //             if (SelectData.length != 1) {
    //                 alert("只能同时对一行数据操作！")
    //                 return;
    //             }


    //             model.com.InPlantConfirm({
    //                 OrderID: SelectData[0].ID, ImagePathList: [], Remark: ''
    //             }, function (res) {
    //                 alert("机车进厂");
    //                 model.com.refreshItem();


    //             })


    //         });



    //         //记录
    //         $("body").delegate("#zace-return-SegmentO", "click", function () {
    //             var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

    //             if (!SelectData || !SelectData.length) {
    //                 alert("请先选择一行数据再试！")
    //                 return;
    //             }
    //             if (SelectData.length != 1) {
    //                 alert("只能同时对一行数据操作！")
    //                 return;
    //             }
    //             // var default_value = {
    //             //     LineID: 0,
    //             // };
    //             // $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


    //             //     if (!rst || $.isEmptyObject(rst))
    //             //         return;
    //             var vdata = { 'header': '段改要求项目', 'href': './GZRecord/PartPreCheckSegmentO.html?id=' + SelectData[0].ID + '&name=' + SelectData[0].ProductNo + '&PartNo=' + SelectData[0].PartNo.split('#')[1], 'id': 'PartPreCheckSegmentO', 'src': './static/images/menu/newfactoryModel/techniquePartpoint.png' };
    //             window.parent.iframeHeaderSet(vdata);
    //             window.callFunctionTrigger("PartPreCheckSegmentO", { ID: SelectData[0].ID, Name: SelectData[0].ProductNo, PartNo: SelectData[0].PartNo.split('#')[1] });

    //             // }, TypeSource_Level));

    //         });

    //         $("body").delegate("#zace-return-ExceptionO", "click", function () {
    //             var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

    //             if (!SelectData || !SelectData.length) {
    //                 alert("请先选择一行数据再试！")
    //                 return;
    //             }
    //             if (SelectData.length != 1) {
    //                 alert("只能同时对一行数据操作！")
    //                 return;
    //             }
    //             // var default_value = {
    //             //     LineID: 0,
    //             // };
    //             // $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


    //             //     if (!rst || $.isEmptyObject(rst))
    //             //         return;
    //             var vdata = { 'header': '异常信息汇总', 'href': './GZRecord/PartPreCheckExceptionO.html?id=' + SelectData[0].ID + '&name=' + SelectData[0].ProductNo + '&PartNo=' + SelectData[0].PartNo.split('#')[1], 'id': 'PartPreCheckExceptionO', 'src': './static/images/menu/newfactoryModel/techniquePartpoint.png' };
    //             window.parent.iframeHeaderSet(vdata);
    //             window.callFunctionTrigger("PartPreCheckExceptionO", { ID: SelectData[0].ID, Name: SelectData[0].ProductNo, PartNo: SelectData[0].PartNo.split('#')[1] });

    //             // }, TypeSource_Level));

    //         });

    //         $("body").delegate("#zace-return-KeyPartO", "click", function () {
    //             var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

    //             if (!SelectData || !SelectData.length) {
    //                 alert("请先选择一行数据再试！")
    //                 return;
    //             }
    //             if (SelectData.length != 1) {
    //                 alert("只能同时对一行数据操作！")
    //                 return;
    //             }
    //             // var default_value = {
    //             //     LineID: 0,
    //             // };
    //             // $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


    //             //     if (!rst || $.isEmptyObject(rst))
    //             //         return;
    //             var vdata = { 'header': '关键部件检查', 'href': './GZRecord/PartPreCheckKeyPartO.html?id=' + SelectData[0].ID + '&name=' + SelectData[0].ProductNo + '&PartNo=' + SelectData[0].PartNo.split('#')[1], 'id': 'PartPreCheckKeyPartO', 'src': './static/images/menu/newfactoryModel/techniquePartpoint.png' };
    //             window.parent.iframeHeaderSet(vdata);
    //             window.callFunctionTrigger("PartPreCheckKeyPartO", { ID: SelectData[0].ID, Name: SelectData[0].ProductNo, PartNo: SelectData[0].PartNo.split('#')[1] });

    //             // }, TypeSource_Level));

    //         });

    //         $("body").delegate("#zace-return-RecordO", "click", function () {
    //             var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

    //             if (!SelectData || !SelectData.length) {
    //                 alert("请先选择一行数据再试！")
    //                 return;
    //             }
    //             if (SelectData.length != 1) {
    //                 alert("只能同时对一行数据操作！")
    //                 return;
    //             }
    //             // var default_value = {
    //             //     LineID: 0,
    //             // };
    //             // $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


    //             //     if (!rst || $.isEmptyObject(rst))
    //             //         return;
    //             var vdata = { 'header': '预检控制记录', 'href': './GZRecord/PartPreCheckRecordO.html?id=' + SelectData[0].ID + '&name=' + SelectData[0].ProductNo + '&PartNo=' + SelectData[0].PartNo.split('#')[1], 'id': 'PartPreCheckRecordO', 'src': './static/images/menu/newfactoryModel/techniquePartpoint.png' };
    //             window.parent.iframeHeaderSet(vdata);
    //             window.callFunctionTrigger("PartPreCheckRecordO", { ID: SelectData[0].ID, Name: SelectData[0].ProductNo, PartNo: SelectData[0].PartNo.split('#')[1] });

    //             // }, TypeSource_Level));

    //         });

    //         $("body").delegate("#zace-return-PartProcessO", "click", function () {
    //             var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

    //             if (!SelectData || !SelectData.length) {
    //                 alert("请先选择一行数据再试！")
    //                 return;
    //             }
    //             if (SelectData.length != 1) {
    //                 alert("只能同时对一行数据操作！")
    //                 return;
    //             }
    //             // var default_value = {
    //             //     LineID: 0,
    //             // };
    //             // $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


    //             //     if (!rst || $.isEmptyObject(rst))
    //             //         return;
    //             var vdata = { 'header': '过程控制记录', 'href': './GZRecord/PartProcessO.html?id=' + SelectData[0].ID + '&name=' + SelectData[0].ProductNo + '&PartNo=' + SelectData[0].PartNo.split('#')[1], 'id': 'PartProcessO', 'src': './static/images/menu/newfactoryModel/techniquePartpoint.png' };
    //             window.parent.iframeHeaderSet(vdata);
    //             window.callFunctionTrigger("PartProcessO", { ID: SelectData[0].ID, Name: SelectData[0].ProductNo, PartNo: SelectData[0].PartNo.split('#')[1] });

    //             // }, TypeSource_Level));

    //         });

    //         $("body").delegate("#zace-return-PartQTProcessO", "click", function () {
    //             var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

    //             if (!SelectData || !SelectData.length) {
    //                 alert("请先选择一行数据再试！")
    //                 return;
    //             }
    //             if (SelectData.length != 1) {
    //                 alert("只能同时对一行数据操作！")
    //                 return;
    //             }
    //             // var default_value = {
    //             //     LineID: 0,
    //             // };
    //             // $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


    //             //     if (!rst || $.isEmptyObject(rst))
    //             //         return;
    //             var vdata = { 'header': '机车质检记录', 'href': './GZRecord/PartQTProcessO.html?id=' + SelectData[0].ID + '&name=' + SelectData[0].ProductNo + '&PartNo=' + SelectData[0].PartNo.split('#')[1], 'id': 'PartQTProcessO', 'src': './static/images/menu/newfactoryModel/techniquePartpoint.png' };
    //             window.parent.iframeHeaderSet(vdata);
    //             window.callFunctionTrigger("PartQTProcessO", { ID: SelectData[0].ID, Name: SelectData[0].ProductNo, PartNo: SelectData[0].PartNo.split('#')[1] });

    //             // }, TypeSource_Level));

    //         });

    //         $("body").delegate("#zace-return-exportMSSPart", "click", function () {

    //             var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

    //             if (!SelectData || !SelectData.length) {
    //                 alert("请先选择一行数据再试！")
    //                 return;
    //             }
    //             if (SelectData.length != 1) {
    //                 alert("只能同时对一行数据操作！");
    //                 return;
    //             };


    //             if (SelectData[0].Status == 1 || SelectData[0].Status == 2) {
    //                 alert('车辆未进厂！');
    //                 return false;
    //             }


    //             var vdata = { 'header': '台车部件', 'href': './component/componentCar.html?id=' + SelectData[0].ID + '&name=' + SelectData[0].ProductNo + '&PartNo=' + SelectData[0].PartNo.split('#')[1], 'id': 'componentCar', 'src': './static/images/menu/newfactoryModel/techniquePart.png' };
    //             window.parent.iframeHeaderSet(vdata);
    //             window.callFunctionTrigger("componentCar", { ID: SelectData[0].ID, Name: SelectData[0].ProductNo, PartNo: SelectData[0].PartNo.split('#')[1] });


    //         });

    //         $("body").delegate("#zace-edit-levelOrderSearch", "click", function () {

    //             // var default_value = {
    //             //     LineID: 0,
    //             // };
    //             // $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


    //             //     if (!rst || $.isEmptyObject(rst))
    //             //         return;
    //             var vdata = { 'header': '订单列表', 'href': './product_plan/LOCOOrderItem.html?id=' + 1 + '&name=' + '1', 'id': 'LOCOOrderItem', 'src': './static/images/menu/newfactoryModel/techniquePartpoint.png' };
    //             window.parent.iframeHeaderSet(vdata);
    //             window.callFunctionTrigger("LOCOOrderItem", { ID: 1, Name: '1' });

    //             // }, TypeSource_Level));

    //         });


    //         $("body").delegate("#zace-return-exporTimePoint", "click", function () {
    //             var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

    //             if (!SelectData || !SelectData.length) {
    //                 alert("请先选择一行数据再试！")
    //                 return;
    //             }
    //             if (SelectData.length != 1) {
    //                 alert("只能同时对一行数据操作！")
    //                 return;
    //             }
    //             // var default_value = {
    //             //     LineID: 0,
    //             // };
    //             // $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


    //             //     if (!rst || $.isEmptyObject(rst))
    //             //         return;
    //             var vdata = { 'header': '生产概况', 'href': './product_plan/LOCOOrderTimeRoute.html?id=' + SelectData[0].ID + '&name=' + SelectData[0].ProductNo + '&PartNo=' + SelectData[0].PartNo.split('#')[1], 'id': 'LOCOOrderTimeRoute', 'src': './static/images/menu/newfactoryModel/techniquePartpoint.png' };
    //             window.parent.iframeHeaderSet(vdata);
    //             window.callFunctionTrigger("LOCOOrderTimeRoute", { ID: SelectData[0].ID, Name: SelectData[0].ProductNo, PartNo: SelectData[0].PartNo.split('#')[1] });

    //             // }, TypeSource_Level));

    //         });


    //         $("body").delegate("#zace-return-exportTurnDetail", "click", function () {
    //             var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

    //             if (!SelectData || !SelectData.length) {
    //                 alert("请先选择一行数据再试！")
    //                 return;
    //             }
    //             if (SelectData.length != 1) {
    //                 alert("只能同时对一行数据操作！")
    //                 return;
    //             }
    //             // var default_value = {
    //             //     LineID: 0,
    //             // };
    //             // $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


    //             //     if (!rst || $.isEmptyObject(rst))
    //             //         return;
    //             var vdata = { 'header': '转序详情', 'href': './product_plan/LOCOOrderTurn.html?id=' + SelectData[0].ID + '&name=' + SelectData[0].ProductNo + '&PartNo=' + SelectData[0].PartNo.split('#')[1], 'id': 'LOCOOrderTurn', 'src': './static/images/menu/newfactoryModel/techniquePartpoint.png' };
    //             window.parent.iframeHeaderSet(vdata);
    //             window.callFunctionTrigger("LOCOOrderTurn", { ID: SelectData[0].ID, Name: SelectData[0].ProductNo, PartNo: SelectData[0].PartNo.split('#')[1] });

    //             // }, TypeSource_Level));

    //         });




    //         $("body").delegate("#zace-edit-levelOrderSearchPro", "click", function () {

    //             var $table = $(".table-partOrderItem"),
    //                 fileName = "订单.xls",
    //                 Title = "订单";
    //             var params = $com.table.getExportParams($table, fileName, Title);

    //             model.com.postExportExcel(params, function (res) {
    //                 var src = res.info.path;
    //                 window.open(src);
    //             });

    //         });




    //         //竣工确认
    //         $("body").delegate("#zace-roro-Confirm", "click", function () {

    //             var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

    //             if (!SelectData || !SelectData.length) {
    //                 alert("请先选择一行数据再试！")
    //                 return;
    //             }
    //             if (SelectData.length != 1) {
    //                 alert("只能同时对一行数据操作！")
    //                 return;
    //             }


    //             model.com.confirmDone({
    //                 OrderID: SelectData[0].ID,
    //             }, function (res) {
    //                 alert("竣工确认成功");
    //                 model.com.refreshItem();


    //             })


    //         });

    //         //出厂申请
    //         $("body").delegate("#zace-roro-LeaveSQ", "click", function () {

    //             var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

    //             if (!SelectData || !SelectData.length) {
    //                 alert("请先选择一行数据再试！")
    //                 return;
    //             }
    //             if (SelectData.length != 1) {
    //                 alert("只能同时对一行数据操作！")
    //                 return;
    //             }
    //             model.com.leaveFactorySQ({
    //                 OrderID: SelectData[0].ID,
    //             }, function (res) {
    //                 alert("出厂申请成功");
    //                 model.com.refreshItem();


    //             })



    //         });

    //         //出厂确认
    //         $("body").delegate("#zace-roro-LeaveQR", "click", function () {

    //             var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

    //             if (!SelectData || !SelectData.length) {
    //                 alert("请先选择一行数据再试！")
    //                 return;
    //             }
    //             if (SelectData.length != 1) {
    //                 alert("只能同时对一行数据操作！")
    //                 return;
    //             }
    //             model.com.leaveFactory({
    //                 OrderID: SelectData[0].ID,
    //             }, function (res) {
    //                 alert("出厂确认成功");
    //                 model.com.refreshItem();


    //             })

    //         });


    //         $("body").delegate("#zace-return-exportBom", "click", function () {

    //             var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

    //             if (!SelectData || !SelectData.length) {
    //                 alert("请先选择一行数据再试！")
    //                 return;
    //             }
    //             if (SelectData.length != 1) {
    //                 alert("只能同时对一行数据操作！")
    //                 return;
    //             }


    //             // model.com.getAPSBOM({ OrderID: SelectData[0].ID, }, function (resP) {
    //             //     if (!resP)
    //             //         return;
    //             //     if (resP.list && resP.list.length < 1) {

    //             //         model.com.createAPSBOM({ OrderID: SelectData[0].ID, }, function (resk) {
    //             //             if (!resk)
    //             //                 return;
    //             //             if (resk.list) {


    //             //                 var vdata = { 'header': '台车Bom', 'href': './monitor_quality/BomExportSetting.html?id=' + SelectData[0].ID + '&name=' + SelectData[0].ProductNo + '&PartNo=' + SelectData[0].PartNo.split('#')[1], 'id': 'BomExportSetting', 'src': './static/images/menu/newfactoryModel/techniquePart.png' };
    //             //                 window.parent.iframeHeaderSet(vdata);
    //             //                 window.callFunctionTrigger("BomExportSetting", { ID: SelectData[0].ID, Name: SelectData[0].ProductNo, PartNo: SelectData[0].PartNo.split('#')[1] });
    //             //             }

    //             //         });
    //             //     } else {

    //             //         var vdata = { 'header': '台车Bom', 'href': './monitor_quality/BomExportSetting.html?id=' + SelectData[0].ID + '&name=' + SelectData[0].ProductNo + '&PartNo=' + SelectData[0].PartNo.split('#')[1], 'id': 'BomExportSetting', 'src': './static/images/menu/newfactoryModel/techniquePart.png' };
    //             //         window.parent.iframeHeaderSet(vdata);
    //             //         window.callFunctionTrigger("BomExportSetting", { ID: SelectData[0].ID, Name: SelectData[0].ProductNo, PartNo: SelectData[0].PartNo.split('#')[1] });
    //             //     }

    //             // });

    //             var vdata = { 'header': '台车Bom', 'href': './monitor_quality/BomExportSetting.html?id=' + SelectData[0].ID + '&name=' + SelectData[0].ProductNo + '&PartNo=' + SelectData[0].PartNo.split('#')[1], 'id': 'BomExportSetting', 'src': './static/images/menu/newfactoryModel/techniquePart.png' };
    //             window.parent.iframeHeaderSet(vdata);
    //             window.callFunctionTrigger("BomExportSetting", { ID: SelectData[0].ID, Name: SelectData[0].ProductNo, PartNo: SelectData[0].PartNo.split('#')[1] });






    //         });


    //         $("body").delegate("#zace-return-exportBomBasic", "click", function () {

    //             var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

    //             if (!SelectData || !SelectData.length) {
    //                 alert("请先选择一行数据再试！")
    //                 return;
    //             }
    //             if (SelectData.length != 1) {
    //                 alert("只能同时对一行数据操作！")
    //                 return;
    //             }



    //             var vdata = { 'header': '台车数据检查', 'href': './monitor_quality/BomExportBasicSetting.html?id=' + SelectData[0].ID + '&name=' + SelectData[0].ProductNo + '&PartNo=' + SelectData[0].PartNo.split('#')[1], 'id': 'BomExportBasicSetting', 'src': './static/images/menu/newfactoryModel/techniquePart.png' };
    //             window.parent.iframeHeaderSet(vdata);
    //             window.callFunctionTrigger("BomExportBasicSetting", { ID: SelectData[0].ID, Name: SelectData[0].ProductNo, PartNo: SelectData[0].PartNo.split('#')[1] });






    //         });

    //         $("body").delegate("#femi-riskLevelOrder-tbody tr", "dblclick", function () {

    //             var $this = $(this);
    //             var WName = $this.find('td[data-title=ContactCode]').attr('data-value');
    //             var WID = Number($this.find('td[data-title=ID]').attr('data-value'));
    //             var WNo = $this.find('td[data-title=No]').attr('data-value');
    //             //$("#zace-span-change").html(WNo);
    //             CommandID = WID;

    //             No = WNo;
    //             TypeMode = 2;


    //             //修改总订单数量
    //             _listOrder = [];
    //             for (var i = 0; i < DataAllOrder.length; i++) {
    //                 $com.util.deleteLowerProperty(DataAllOrder[i]);
    //                 if (DataAllOrder[i].ID == CommandID) {
    //                     _listOrder.push(DataAllOrder[i]);
    //                     mBusinessUnitID = DataAllOrder[i].BusinessUnitID;  //车型
    //                     mCustomerID = DataAllOrder[i].CustomerID;  //局段
    //                     mLine = DataAllOrder[i].FactoryID;//修程
    //                 }

    //             }
    //             $(".zzza").hide();
    //             $(".zzzb").show();

    //             model.com.getFPCRoute({ LineID: mLine, ProductID: mBusinessUnitID, CustomerID: mCustomerID }, function (resP) {
    //                 if (!resP)
    //                     return;
    //                 if (TypeSource_Level.RouteID.length > 1)
    //                     TypeSource_Level.RouteID = [];
    //                 $.each(resP.list, function (i, item) {
    //                     TypeSource_Level.RouteID.push({
    //                         value: item.ID,
    //                         name: item.VersionNo
    //                     });
    //                 });

    //                 model.com.refreshItem();

    //             });




    //         });
    //         //zace-return-levelOrder
    //         $("body").delegate("#zace-return-levelOrder", "click", function () {


    //             $(".zzza").show();
    //             $(".zzzb").hide();
    //             TypeMode = 1;

    //             model.com.refresh();

    //         });

    //         //zace-edit-levelZace
    //         $("body").delegate("#zace-edit-levelZace", "click", function () {
    //             model.com.refresh();

    //         });

    //         $("body").delegate("#zace-edit-levelZaceItem", "click", function () {
    //             model.com.refreshItem();

    //         });

    //         //修改工艺BOP
    //         $("body").delegate("#zace-active-levelRoute", "click", function () {
    //             var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

    //             if (!SelectData || !SelectData.length) {
    //                 alert("请先选择一行数据再试！");
    //                 return;
    //             }
    //             if (SelectData.length != 1) {
    //                 alert("只能同时对一行数据操作！");
    //                 return;
    //             }
    //             var default_value = {
    //                 RouteID: SelectData[0].RouteID,

    //             };
    //             $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
    //                 //调用修改函数
    //                 if (!rst || $.isEmptyObject(rst))
    //                     return;
    //                 //SelectData[0].RouteID = Number(rst.RouteID);
    //                 //格式化时间
    //                 SelectData[0].AuditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[0].AuditTime));
    //                 SelectData[0].CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[0].CreateTime));
    //                 SelectData[0].EditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[0].EditTime));
    //                 for (var i = 0; i < SelectData.length; i++) {

    //                     $com.util.deleteLowerProperty(SelectData[i]);
    //                 }

    //                 model.com.changeOMSOrder({
    //                     data: SelectData[0],
    //                     RouteID: Number(rst.RouteID)
    //                 }, function (res) {
    //                     alert("更改工艺BOP成功");
    //                     model.com.refreshItem();
    //                     //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
    //                     //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

    //                 })

    //             }, TypeSource_Level));


    //         });
    //         //制造令新增
    //         $("body").delegate("#zace-add-levelOrder", "click", function () {

    //             $("body").append($com.modal.show(DEFAULT_VALUE_Level_Order, KEYWORD_Level_Order, "新增", function (rst) {
    //                 //调用插入函数 
    //                 if (!rst || $.isEmptyObject(rst))
    //                     return;

    //                 if (rst.WBSNo.length < 1 || rst.WBSNo.trim().length < 1) {
    //                     alert('WBS必填！');
    //                     return false;
    //                 }
    //                 OrderTemp.BusinessUnitID = Number(rst.BusinessUnitID);
    //                 // PositionTemp.FactoryID = Number(rst.FactoryID);              
    //                 OrderTemp.No = rst.No;
    //                 OrderTemp.WBSNo = rst.WBSNo;
    //                 OrderTemp.CustomerID = Number(rst.CustomerID);
    //                 OrderTemp.FactoryID = Number(rst.FactoryID);
    //                 OrderTemp.ContactCode = rst.ContactCode;
    //                 OrderTemp.FQTYPlan = Number(rst.FQTYPlan);
    //                 // OrderTemp.FQTYActual = Number(rst.FQTYActual);



    //                 model.com.postCommandSave({
    //                     data: OrderTemp,
    //                 }, function (res) {

    //                     alert("新增成功");
    //                     model.com.refresh();


    //                 })

    //             }, TypeSource_Level_Order));


    //         });
    //         //制造令修改
    //         $("body").delegate("#zace-edit-levelOrder", "click", function () {
    //             var SelectData = $com.table.getSelectionData($("#femi-riskLevelOrder-tbody"), "ID", DataAllOrder);

    //             if (!SelectData || !SelectData.length) {
    //                 alert("请先选择一行数据再试！")
    //                 return;
    //             }
    //             if (SelectData.length != 1) {
    //                 alert("只能同时对一行数据修改！")
    //                 return;
    //             }
    //             // if (SelectData[0].Status != 1) {
    //             //     alert("数据选择有误,请选择状态为创建的数据!")
    //             //     return;
    //             // }
    //             var default_value = {
    //                 No: SelectData[0].No,
    //                 WBSNo: SelectData[0].WBSNo,
    //                 BusinessUnitID: SelectData[0].BusinessUnitID,
    //                 CustomerID: SelectData[0].CustomerID,
    //                 ContactCode: SelectData[0].ContactCode,
    //                 FactoryID: SelectData[0].FactoryID,
    //                 FQTYPlan: SelectData[0].FQTYPlan,
    //                 // FQTYActual: SelectData[0].FQTYActual,
    //                 //  Status: SelectData[0].Status,

    //             };
    //             $("body").append($com.modal.show(default_value, KEYWORD_Level_Order, "修改", function (rst) {
    //                 //调用修改函数
    //                 if (!rst || $.isEmptyObject(rst))
    //                     return;

    //                 if (rst.WBSNo.length < 1 || rst.WBSNo.trim().length < 1) {
    //                     alert('WBS必填！');
    //                     return false;
    //                 }

    //                 SelectData[0].No = rst.No;
    //                 SelectData[0].WBSNo = rst.WBSNo;
    //                 SelectData[0].BusinessUnitID = Number(rst.BusinessUnitID);
    //                 SelectData[0].ContactCode = rst.ContactCode;
    //                 SelectData[0].CustomerID = Number(rst.CustomerID);
    //                 // SelectData[0].FactoryID = Number(rst.FactoryID);
    //                 SelectData[0].FactoryID = Number(rst.FactoryID);

    //                 SelectData[0].FQTYPlan = Number(rst.FQTYPlan);
    //                 // SelectData[0].FQTYActual = Number(rst.FQTYActual);


    //                 for (var i = 0; i < SelectData.length; i++) {
    //                     $com.util.deleteLowerProperty(SelectData[i]);
    //                     SelectData[i].AuditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].AuditTime));
    //                     SelectData[i].CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].CreateTime));
    //                     SelectData[i].EditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].EditTime));
    //                 }


    //                 model.com.postCommandSave({
    //                     data: SelectData[0],
    //                 }, function (res) {
    //                     alert("修改成功");
    //                     model.com.refresh();
    //                     //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
    //                     //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

    //                 })



    //             }, TypeSource_Level_Order));


    //         });

    //         //Enter触发模糊查询事件
    //         $(document).keyup(function (event) {
    //             if (event.keyCode == 13 && TypeMode == 2) {
    //                 var $this = $(this);
    //                 var value = $("#zace-search-level").val();
    //                 if (value == undefined || value == "" || value.trim().length < 1)
    //                     $("#femi-riskLevel-tbody").children("tr").show();
    //                 else
    //                     $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllSearch, value, "ID");
    //             }

    //             if (event.keyCode == 13 && TypeMode == 1) {
    //                 var $this = $(this);
    //                 var value = $("#zace-search").val();
    //                 if (value == undefined || value == "" || value.trim().length < 1)
    //                     $("#femi-riskLevelOrder-tbody").children("tr").show();
    //                 else
    //                     $com.table.filterByLikeString($("#femi-riskLevelOrder-tbody"), DataAllSearchOrder, value, "ID");
    //             }

    //         });





    //         //查询
    //         $("body").delegate("#zace-search-level-pro", "click", function () {

    //             var value = $("#zace-search-level").val();
    //             if (value == undefined || value == "" || value.trim().length < 1)
    //                 $("#femi-riskLevel-tbody").children("tr").show();
    //             else
    //                 $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllSearch, value, "ID");



    //         });

    //         //zace-search-levelPro


    //         //查询
    //         $("body").delegate("#zace-search-levelPro", "click", function () {

    //             var value = $("#zace-search").val();
    //             if (value == undefined || value == "" || value.trim().length < 1)
    //                 $("#femi-riskLevelOrder-tbody").children("tr").show();
    //             else
    //                 $com.table.filterByLikeString($("#femi-riskLevelOrder-tbody"), DataAllSearchOrder, value, "ID");



    //         });



    //         //启用
    //         $("body").delegate("#zace-active-level", "click", function () {
    //             var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

    //             if (!SelectData || !SelectData.length) {
    //                 alert("请先选择一行数据再试！")
    //                 return;
    //             }

    //             SelectData.forEach(element => {
    //                 if (element.Active == 1) {
    //                     alert('有数据已启用！！')
    //                     return false;
    //                 }
    //             });

    //             for (var i = 0; i < SelectData.length; i++) {

    //                 $com.util.deleteLowerProperty(SelectData[i]);
    //                 SelectData[i].PlanReceiveDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].PlanReceiveDate));
    //                 SelectData[i].RealReceiveDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].RealReceiveDate));
    //                 SelectData[i].PlanFinishDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].PlanFinishDate));
    //                 SelectData[i].RealStartDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].RealStartDate));
    //                 SelectData[i].RealFinishDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].RealFinishDate));
    //                 SelectData[i].RealSendDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].RealSendDate));
    //                 SelectData[i].AuditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].AuditTime));
    //                 SelectData[i].CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].CreateTime));
    //                 SelectData[i].EditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].EditTime));
    //                 SelectData[i].TelegraphRealTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].TelegraphRealTime));
    //             }

    //             model.com.activeOMSOrder({
    //                 data: SelectData,
    //                 Active: 1,
    //             }, function (res) {
    //                 alert("启用成功");
    //                 _listOrder[0].AuditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(_listOrder[0].AuditTime));
    //                 _listOrder[0].CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(_listOrder[0].CreateTime));
    //                 _listOrder[0].EditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(_listOrder[0].EditTime));
    //                 _listOrder[0].FQTYActual += SelectData.length;
    //                 model.com.postCommandSave({
    //                     data: _listOrder[0],
    //                 }, function (res) {

    //                     model.com.refreshItem();
    //                 })


    //             })




    //         });
    //         //禁用
    //         $("body").delegate("#zace-disable-level", "click", function () {
    //             var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

    //             if (!SelectData || !SelectData.length) {
    //                 alert("请先选择一行数据再试！")
    //                 return;
    //             }
    //             //if (SelectData[0].Status != 1) {
    //             //    alert("数据选择有误！")
    //             //    return;
    //             //}
    //             SelectData.forEach(element => {
    //                 if (element.Active == 0) {
    //                     alert('有数据已禁用！！')
    //                     return false;
    //                 }
    //             });


    //             for (var i = 0; i < SelectData.length; i++) {

    //                 $com.util.deleteLowerProperty(SelectData[i]);
    //                 SelectData[i].PlanReceiveDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].PlanReceiveDate));
    //                 SelectData[i].RealReceiveDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].RealReceiveDate));
    //                 SelectData[i].TelegraphRealTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].TelegraphRealTime));
    //                 SelectData[i].PlanFinishDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].PlanFinishDate));
    //                 SelectData[i].RealStartDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].RealStartDate));
    //                 SelectData[i].RealFinishDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].RealFinishDate));
    //                 SelectData[i].RealSendDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].RealSendDate));
    //                 SelectData[i].AuditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].AuditTime));
    //                 SelectData[i].CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].CreateTime));
    //                 SelectData[i].EditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].EditTime));
    //             }
    //             model.com.activeOMSOrder({
    //                 data: SelectData,
    //                 Active: 0,
    //             }, function (res) {
    //                 alert("禁用成功");

    //                 _listOrder[0].AuditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(_listOrder[0].AuditTime));
    //                 _listOrder[0].CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(_listOrder[0].CreateTime));
    //                 _listOrder[0].EditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(_listOrder[0].EditTime));
    //                 _listOrder[0].FQTYActual -= SelectData.length;
    //                 model.com.postCommandSave({
    //                     data: _listOrder[0],
    //                 }, function (res) {

    //                     model.com.refreshItem();
    //                 })


    //             })

    //         });
    //         //修改
    //         $("body").delegate("#zace-edit-level", "click", function () {
    //             var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

    //             if (!SelectData || !SelectData.length) {
    //                 alert("请先选择一行数据再试！")
    //                 return;
    //             }

    //             if (SelectData.length != 1) {
    //                 alert("只能同时对一行数据修改！")
    //                 return;
    //             }
    //             if (SelectData[0].Status > 3) {
    //                 alert("请选择未开工的车辆！");
    //                 return;
    //             }

    //             var default_value = {
    //                 OrderNo: SelectData[0].OrderNo,
    //                 // RouteID: SelectData[0].RouteID,
    //                 ProductID: SelectData[0].ProductID,
    //                 // BureauSectionID: SelectData[0].BureauSectionID,

    //                 //PartNo: SelectData[0].PartNo.split("#")[1],
    //                 //Priority: SelectData[0].Priority,
    //                 PlanReceiveDate: SelectData[0].PlanReceiveDate,
    //                 //TelegraphRealTime: new Date(SelectData[0].TelegraphRealTime) < new Date('2010-1-1') ? new Date() : new Date(SelectData[0].TelegraphRealTime),
    //                 PlanFinishDate: SelectData[0].PlanFinishDate,
    //                 // RealStartDate: SelectData[0].RealStartDate,
    //                 // RealFinishDate: SelectData[0].RealFinishDate,
    //                 // RealSendDate: SelectData[0].RealSendDate,

    //                 Remark: SelectData[0].Remark,
    //                 //Active: SelectData[0].Active,
    //                 //Status: SelectData[0].Status,


    //             };
    //             $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
    //                 //调用修改函数
    //                 if (!rst || $.isEmptyObject(rst))
    //                     return;
    //                 // SelectData[0].Status = Number(rst.Status);
    //                 SelectData[0].OrderNo = rst.OrderNo;
    //                 // SelectData[0].LineID = Number(rst.LineID);
    //                 SelectData[0].ProductID = Number(rst.ProductID);
    //                 // SelectData[0].BureauSectionID = Number(rst.BureauSectionID);
    //                 //SelectData[0].WBSNo = rst.WBSNo;
    //                 //SelectData[0].PartNo = rst.PartNo;
    //                 //SelectData[0].Priority = Number(rst.Priority);
    //                 SelectData[0].PlanReceiveDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.PlanReceiveDate));
    //                 //SelectData[0].TelegraphRealTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.TelegraphRealTime));
    //                 SelectData[0].PlanFinishDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.PlanFinishDate));
    //                 SelectData[0].Remark = rst.Remark;
    //                 // if (SelectData[0].ProductID > 0 && rst.PartNo.length > 0) {

    //                 //     // if (rst.PartNo && rst.PartNo.length == 4 && !isNaN(rst.PartNo)) {

    //                 //     // } else {
    //                 //     //     alert('车号为4位数字！');
    //                 //     //     return false;
    //                 //     // }
    //                 //     SelectData[0].PartNo = rst.PartNo;
    //                 //     SelectData[0].PartNo = FORMATTRT_Level["ProductID"](SelectData[0].ProductID) + "#" + SelectData[0].PartNo;
    //                 // } else {

    //                 //     SelectData[0].PartNo = "";
    //                 // }
    //                 //格式化时间
    //                 SelectData[0].AuditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[0].AuditTime));
    //                 SelectData[0].CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[0].CreateTime));
    //                 SelectData[0].EditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[0].EditTime));
    //                 for (var i = 0; i < SelectData.length; i++) {

    //                     $com.util.deleteLowerProperty(SelectData[i]);
    //                 }

    //                 model.com.postOMSOrder({
    //                     data: SelectData[0],
    //                 }, function (res) {
    //                     alert("修改成功");
    //                     model.com.refreshItem();
    //                     //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
    //                     //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

    //                 })

    //             }, TypeSource_Level));


    //         });
    //         //新增
    //         $("body").delegate("#zace-add-level", "click", function () {

    //             $("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "新增", function (rst) {
    //                 //调用插入函数 
    //                 if (!rst || $.isEmptyObject(rst))
    //                     return;
    //                 // if (rst.PartNo && rst.PartNo.length == 4 && !isNaN(rst.PartNo)) {

    //                 // } else {
    //                 //     alert('车号为4位数字！');
    //                 //     return false;
    //                 // }
    //                 //PositionTemp.Active = rst.Active;
    //                 //  PositionTemp.OrderNo = rst.OrderNo;
    //                 PositionTemp.LineID = mLine;
    //                 // PositionTemp.ProductID = mBusinessUnitID;

    //                 PositionTemp.ProductID = Number(rst.ProductID);

    //                 PositionTemp.BureauSectionID = mCustomerID;

    //                 PositionTemp.PartNo = rst.PartNo;
    //                 PositionTemp.Priority = Number(rst.Priority);
    //                 PositionTemp.PlanReceiveDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.PlanReceiveDate));
    //                 //PositionTemp.RealReceiveDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.RealReceiveDate));
    //                 PositionTemp.PlanFinishDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.PlanFinishDate));
    //                 // PositionTemp.RealStartDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.RealStartDate));
    //                 // PositionTemp.RealFinishDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.RealFinishDate));
    //                 // PositionTemp.RealSendDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.RealSendDate));
    //                 PositionTemp.Remark = rst.Remark;

    //                 PositionTemp.CommandID = CommandID;
    //                 //for (var i = 0; i < DataProductList.length; i++) {
    //                 //    if (PositionTemp.ProductID == DataProductList[i].ID) {
    //                 //        PositionTemp.ProductNo = DataProductList[i].ProductNo;
    //                 //    }
    //                 //}
    //                 // if (PositionTemp.ProductID > 0 && rst.PartNo.length > 0) {
    //                 //     PositionTemp.PartNo = FORMATTRT_Level["ProductID"](PositionTemp.ProductID) + "#" + PositionTemp.PartNo;
    //                 // } else {

    //                 //     PositionTemp.PartNo = "";
    //                 // }




    //                 model.com.postOMSOrder({
    //                     data: PositionTemp,
    //                 }, function (res) {
    //                     alert("新增成功");

    //                     _listOrder[0].AuditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(_listOrder[0].AuditTime));
    //                     _listOrder[0].CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(_listOrder[0].CreateTime));
    //                     _listOrder[0].EditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(_listOrder[0].EditTime));
    //                     _listOrder[0].FQTYActual += 1;
    //                     model.com.postCommandSave({
    //                         data: _listOrder[0],
    //                     }, function (res) {

    //                         model.com.refreshItem();
    //                     })

    //                 })



    //             }, TypeSource_Level));


    //         });
    //         //我的申请
    //         $("body").delegate("#zace-myApproval-level", "click", function () {
    //             $(".zzza").show();
    //             $(".zzzb").hide();
    //             $(".zzzc").hide();

    //         });
    //         //车间
    //         $("body").delegate("#zace-audit-workshop", "click", function () {
    //             var vdata = { 'header': '工厂设置', 'href': './factory_model/FMCFactorySetting.html', 'id': 'FMCFactorySetup', 'src': './static/images/menu/manageBOM.png' };
    //             window.parent.iframeHeaderSet(vdata);

    //         });

    //         //审批查询
    //         $("body").delegate("#zace-search-returnAudit", "input", function () {

    //             var $this = $(this),
    //                 value = $(this).val();
    //             if (value == undefined || value == "" || value.trim().length < 1)
    //                 $("#femi-riskLevelAudit-tbody").children("tr").show();
    //             else
    //                 $com.table.filterByLikeString($("#femi-riskLevelAudit-tbody"), DataAllSearch, value, "ID");



    //         });
    //         //所有查询
    //         $("body").delegate("#zace-search-returnAuditAll", "input", function () {

    //             var $this = $(this),
    //                 value = $(this).val();
    //             if (value == undefined || value == "" || value.trim().length < 1)
    //                 $("#femi-riskLevelApprovalAll-tbody").children("tr").show();
    //             else
    //                 $com.table.filterByLikeString($("#femi-riskLevelApprovalAll-tbody"), DataAllSearch, value, "ID");



    //         });


    //         //所有条件查询
    //         $("body").delegate("#zace-searchAll-level", "click", function () {
    //             var default_value = {
    //                 Active: true,

    //             };
    //             $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


    //                 if (!rst || $.isEmptyObject(rst))
    //                     return;

    //                 default_value.Active = eval(rst.Active.toLowerCase());

    //                 $com.table.filterByConndition($("#femi-riskLevelApprovalAll-tbody"), DATAAllBusiness, default_value, "ID");

    //             }, TypeSource_Level));


    //         });

    //         //申请条件查询
    //         $("body").delegate("#zace-searchZApproval-level", "click", function () {
    //             var default_value = {
    //                 Active: true,
    //             };
    //             $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


    //                 if (!rst || $.isEmptyObject(rst))
    //                     return;

    //                 default_value.Active = eval(rst.Active.toLowerCase());
    //                 $com.table.filterByConndition($("#femi-riskLevel-tbody"), DATABasic, default_value, "ID");

    //             }, TypeSource_Level));


    //         });
    //         //审批条件查询
    //         $("body").delegate("#zace-searchAudit-level", "click", function () {
    //             var default_value = {
    //                 Active: true,
    //             };
    //             $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


    //                 if (!rst || $.isEmptyObject(rst))
    //                     return;

    //                 default_value.Active = eval(rst.Active.toLowerCase());
    //                 $com.table.filterByConndition($("#femi-riskLevelAudit-tbody"), DataAllConfirmBasic, default_value, "ID");

    //             }, TypeSource_Level));


    //         });
    //     },




    //     run: function () {



    //         model.com.getFMCLine({ FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0 }, function (resP) {
    //             if (!resP)
    //                 return;

    //             $.each(resP.list, function (i, item) {
    //                 TypeSource_Level.LineID.push({
    //                     value: item.ID,
    //                     name: item.Name
    //                 });
    //             });
    //             TypeSource_Level_Order.FactoryID = TypeSource_Level.LineID;
    //             model.com.getCustomer({ active: 2 }, function (resP) {
    //                 if (!resP)
    //                     return;

    //                 $.each(resP.list, function (i, item) {
    //                     TypeSource_Level.BureauSectionID.push({
    //                         value: item.ID,
    //                         name: item.CustomerName
    //                     });
    //                 });
    //                 TypeSource_Level_Order.CustomerID = TypeSource_Level.BureauSectionID;
    //                 model.com.getFPCProduct({ ProductTypeID: 0, BusinessUnitID: 0 }, function (resP) {
    //                     if (!resP)
    //                         return;

    //                     $.each(resP.list, function (i, item) {

    //                         if (item.Active == 1 && item.TransportType == 1) {
    //                             TypeSource_Level.ProductID.push({
    //                                 value: item.ID,
    //                                 name: item.ProductName
    //                             });
    //                         }

    //                     });
    //                     TypeSource_Level_Order.BusinessUnitID = TypeSource_Level.ProductID;
    //                     model.com.get({ active: 1 }, function (resP) {
    //                         if (!resP)
    //                             return;

    //                         $.each(resP.list, function (i, item) {
    //                             TypeSource_Level_Order.CreatorID.push({
    //                                 value: item.ID,
    //                                 name: item.Name
    //                             });
    //                         });
    //                         model.com.refresh();
    //                     });
    //                 });
    //             });
    //         });

    //         model.com.getFPCPart({ FactoryID: 0, BusinessUnitID: 0 }, function (resRP) {
    //             if (resRP && resRP.list) {
    //                 modelPartList = {};
    //                 $.each(resRP.list, function (i, item) {
    //                     modelPartList[item.ID] = item;
    //                 });
    //             }
    //         });
    //     },

    //     com: {
    //         exportReport: function (data, fn, context) {
    //             var d = {
    //                 $URI: "/IPTPreCheckReport/ExportByOrderZip",
    //                 $TYPE: "get",
    //                 $SERVER: '/MESQMS',
    //             };

    //             function err() {
    //                 console.log('导出。。。');
    //             }

    //             $com.app.ajax($.extend(d, data), fn, err, context);
    //         },
    //         //查询工序
    //         getFPCPart: function (data, fn, context) {
    //             var d = {
    //                 $URI: "/FPCPart/All",
    //                 $TYPE: "get"
    //             };

    //             function err() {
    //                 $com.app.tip('获取失败，请检查网络');
    //             }

    //             $com.app.ajax($.extend(d, data), fn, err, context);
    //         },

    //         InPlantConfirm: function (data, fn, context) {
    //             var d = {
    //                 $URI: "/OMSOrder/InPlantConfirm",
    //                 $TYPE: "Post",
    //                 $SERVER: "/MESAPS"
    //             };
    //             function err() {
    //                 $com.app.tip('获取失败，请检查网络');
    //             }

    //             $com.app.ajax($.extend(d, data), fn, err, context);
    //         },
    //         //导出
    //         postExportExcel: function (data, fn, context) {
    //             var d = {
    //                 $URI: "/Upload/ExportExcel",
    //                 $TYPE: "post"
    //             };

    //             function err() {
    //                 $com.app.tip('获取失败，请检查网络');
    //             }

    //             $com.app.ajax($.extend(d, data), fn, err, context);
    //         },
    //         getFPCRoute: function (data, fn, context) {
    //             var d = {
    //                 $URI: "/FPCRoute/All",
    //                 $TYPE: "get"
    //             };

    //             function err() {
    //                 $com.app.tip('获取失败，请检查网络');
    //             }

    //             $com.app.ajax($.extend(d, data), fn, err, context);
    //         },
    //         //查
    //         getRouteDone: function (data, fn, context) {
    //             var d = {
    //                 $URI: "/RSMTurnOrderTask/BOPDoneList",
    //                 $TYPE: "get",
    //                 $SERVER: '/MESQMS'
    //             };

    //             function err() {
    //                 $com.app.tip('获取失败，请检查网络');
    //             }

    //             $com.app.ajax($.extend(d, data), fn, err, context);
    //         },
    //         //查询产品工序段列表
    //         getFPCRoutePart: function (data, fn, context) {
    //             var d = {
    //                 $URI: "/FPCRoutePart/All",
    //                 $TYPE: "get"
    //             };

    //             function err() {
    //                 $com.app.tip('获取失败，请检查网络');
    //             }

    //             $com.app.ajax($.extend(d, data), fn, err, context);
    //         },
    //         oneExport: function (data, fn, context) {
    //             var d = {
    //                 $URI: "/IPTOrderReport/ExportProduceProcessZip",
    //                 $TYPE: "get",
    //                 $SERVER: '/MESQMS',

    //             };

    //             function err() {
    //                 $com.app.tip('获取失败，请检查网络');
    //             }

    //             $com.app.ajax($.extend(d, data), fn, err, context);
    //         },
    //         twoExport: function (data, fn, context) {
    //             var d = {
    //                 $URI: "/IPTOrderReport/ExportFinalCheckZip",
    //                 $TYPE: "get",
    //                 $SERVER: '/MESQMS',

    //             };

    //             function err() {
    //                 $com.app.tip('获取失败，请检查网络');
    //             }

    //             $com.app.ajax($.extend(d, data), fn, err, context);
    //         },
    //         renderRouteChart: function (_dataPart) {

    //             //拿到此路线下对应的工序段
    //             var OrderIDList = _dataPart;   //順序ID集合
    //             var routePartArr = [];
    //             ZaceData = [];   //初始化

    //             routePartArr = $com.util.Clone(_dataPart);

    //             $.each(routePartArr, function (i, item) {
    //                 item.Type = 1;
    //             });

    //             $('#DragLine').html('');

    //             //显示流程图

    //             //为流程图添加方法
    //             //创建悬浮框方法
    //             var mouseoverFn = function (data, json) {
    //                 var cv = $(".left-contain").scrollTop();
    //                 //var cl = $("#ChartRoute").scrollLeft();
    //                 var $target = {
    //                     offset: function () {
    //                         return {
    //                             left: json.X + json.left + 300 + 15,
    //                             top: json.Y + json.top + 60 - cv,
    //                         };
    //                     },
    //                     width: function () {
    //                         return json.width;
    //                     },
    //                     height: function () {
    //                         return json.height;
    //                     },
    //                 }

    //             }
    //             var mouseoutFn = function (data) {
    //                 $tooltip.clear();
    //             }
    //             //点击方法
    //             var clickFn = function (data, json) {
    //                 var _info = data;
    //                 var showInfo = $com.util.Clone(_info);

    //             }
    //             var dragFn = function (data) {
    //                 var _data = data.data.data;

    //                 $.each(mZacePart, function (j, item_j) {
    //                     $.each(_data, function (i, item) {
    //                         if (item.ID != item_j.PartID)
    //                             return true;

    //                         item_j.OrderID = item.OrderID;
    //                         item_j.PrevPartID = item.PrevID;

    //                         item_j.NextPartIDMap = {};
    //                         if (item.NextIDList && item.NextIDList.length > 0) {

    //                             $.each(item.NextIDList, function (k, item_k) {
    //                                 item_j.NextPartIDMap[item_k + ""] = 0;
    //                                 console.log(j);
    //                             });
    //                         }

    //                     });
    //                 });

    //             }
    //             //2 创建结构
    //             var dataObj = {

    //                 data: routePartArr,
    //                 dataSet: {//对应关系
    //                     Text: "PartZaceName", //显示字段名称
    //                     Index: "PartID", //索引字段名称
    //                     PrevIndex: "PrevPartID", //上级字段名称
    //                     NextIndex: "NextID", //下级字段名称
    //                     TypeIndex: "Type", //下级字段名称
    //                     FatherID: "FatherID",  //父级ID
    //                     BGC: "bgColor", //背景色字段名称
    //                     FGC: "bb", //前景色字段名称
    //                 },
    //                 background_color: 'orange', //流程框背景颜色
    //                 foreground_color: 'orange', //箭头颜色 
    //                 text_color: "white", //文字颜色
    //                 fn_mouseover: mouseoverFn, //鼠标悬停触发
    //                 fn_mouseout: mouseoutFn, //鼠标移走事件
    //                 fn_click: undefined, //鼠标单击
    //                 fn_drag: undefined, //鼠标拖动
    //                 constant: {
    //                     lineOperation: false,
    //                     // dottedLine: true,
    //                     font: "bold 15px 宋体",//字体样式
    //                     fontSize: 15,//字体大小
    //                     rect_width: 200, //矩形的宽
    //                     rect_height: 50,
    //                 },
    //             }
    //             $('#DragLine').show();
    //             //4 显示流程图
    //             $route.show($('#DragLine'), dataObj);


    //         },

    //         threeExport: function (data, fn, context) {
    //             var d = {
    //                 $URI: "/IPTOrderReport/ExportOutCheckZip",
    //                 $TYPE: "get",
    //                 $SERVER: '/MESQMS',

    //             };

    //             function err() {
    //                 $com.app.tip('获取失败，请检查网络');
    //             }

    //             $com.app.ajax($.extend(d, data), fn, err, context);
    //         },
    //         fourExport: function (data, fn, context) {
    //             var d = {
    //                 $URI: "/IPTOrderReport/ExportQualityProcessZip",
    //                 $TYPE: "get",
    //                 $SERVER: '/MESQMS',

    //             };

    //             function err() {
    //                 $com.app.tip('获取失败，请检查网络');
    //             }

    //             $com.app.ajax($.extend(d, data), fn, err, context);
    //         },

    //         //竣工确认
    //         confirmDone: function (data, fn, context) {
    //             var d = {
    //                 $URI: "/OMSOrder/CompleteConfirm",
    //                 $TYPE: "post",
    //                 $SERVER: "/MESAPS"

    //             };

    //             function err() {
    //                 $com.app.tip('获取失败，请检查网络');
    //             }

    //             $com.app.ajax($.extend(d, data), fn, err, context);
    //         },
    //         //出厂申请
    //         leaveFactorySQ: function (data, fn, context) {
    //             var d = {
    //                 $URI: "/OMSOrder/OutApply",
    //                 $TYPE: "post",
    //                 $SERVER: "/MESAPS"

    //             };

    //             function err() {
    //                 $com.app.tip('获取失败，请检查网络');
    //             }

    //             $com.app.ajax($.extend(d, data), fn, err, context);
    //         },
    //         //出厂确认
    //         leaveFactory: function (data, fn, context) {
    //             var d = {
    //                 $URI: "/OMSOrder/OutConfirm",
    //                 $TYPE: "post",
    //                 $SERVER: "/MESAPS"

    //             };

    //             function err() {
    //                 $com.app.tip('获取失败，请检查网络');
    //             }

    //             $com.app.ajax($.extend(d, data), fn, err, context);
    //         },



    //         createAPSBOM: function (data, fn, context) {
    //             var d = {
    //                 $URI: "/IPTStandard/CreateAPSBOM",
    //                 $TYPE: "post",
    //                 $SERVER: '/MESQMS',

    //             };

    //             function err() {
    //                 $com.app.tip('获取失败，请检查网络');
    //             }

    //             $com.app.ajax($.extend(d, data), fn, err, context);
    //         },


    //         getAPSBOM: function (data, fn, context) {
    //             var d = {
    //                 $URI: "/APSBOM/All",
    //                 $TYPE: "get",

    //             };

    //             function err() {
    //                 $com.app.tip('获取失败，请检查网络');
    //             }

    //             $com.app.ajax($.extend(d, data), fn, err, context);
    //         },


    //         get: function (data, fn, context) {
    //             var d = {
    //                 $URI: "/User/All",
    //                 $TYPE: "get",

    //             };

    //             function err() {
    //                 $com.app.tip('获取失败，请检查网络');
    //             }

    //             $com.app.ajax($.extend(d, data), fn, err, context);
    //         },
    //         refresh: function () {
    //             $com.app.loading('数据加载中！！');
    //             model.com.getOMSCommand({}, function (resP) {
    //                 if (!resP)
    //                     return;
    //                 if (resP && resP.list) {
    //                     var Grade = $com.util.Clone(resP.list);
    //                     DATABasicOrder = $com.util.Clone(resP.list);


    //                     DataAllOrder = $com.util.Clone(Grade);

    //                     $.each(Grade, function (i, item) {
    //                         for (var p in item) {
    //                             if (!FORMATTRT_Level_Order[p])
    //                                 continue;
    //                             item[p] = FORMATTRT_Level_Order[p](item[p]);
    //                         }
    //                         item.WID = i + 1;
    //                     });
    //                     DataAllSearchOrder = $com.util.Clone(Grade);
    //                     $("#femi-riskLevelOrder-tbody").html($com.util.template(Grade, HTML.TableOrderMode));
    //                     $("#femi-riskLevelOrder-tbody tr").each(function (i, item) {
    //                         var $this = $(this);
    //                         var colorName = $this.css("background-color");
    //                         $this.attr("data-color", colorName);



    //                     });

    //                 }

    //                 $com.app.loaded();
    //             });

    //         },


    //         refreshItem: function () {

    //             $com.app.loading('数据加载中！！');
    //             model.com.getOMSOrder({ "CommandID": CommandID }, function (resP) {
    //                 if (!resP)
    //                     return;
    //                 if (resP && resP.list) {
    //                     var Grade = $com.util.Clone(resP.list);
    //                     DATABasic = $com.util.Clone(resP.list);

    //                     //审核数据
    //                     DataAllConfirm = $com.util.Clone(resP.list);

    //                     DataAll = $com.util.Clone(Grade);

    //                     $.each(Grade, function (i, item) {
    //                         for (var p in item) {
    //                             if (!FORMATTRT_Level[p])
    //                                 continue;
    //                             item[p] = FORMATTRT_Level[p](item[p]);
    //                         }

    //                         item.PartNoText = item.PartNo.split("#")[1] && item.PartNo.split("#")[1].length > 0 ? item.PartNo.split("#")[1] : '';
    //                         item.TimeText = item.RealReceiveDate;
    //                         if (new Date(item.RealReceiveDate) < new Date('2010-1-1')) {
    //                             item.TimeText = '-';
    //                         }

    //                         if (new Date(item.TelegraphRealTime) < new Date('2010-1-1')) {
    //                             item.TelegraphRealTime = '-';
    //                         }

    //                         // item.PlanReceiveDate = item.PlanReceiveDate;
    //                         if (new Date(item.PlanReceiveDate) < new Date('2010-1-1')) {
    //                             item.PlanReceiveDate = '-';
    //                         }

    //                         if (new Date(item.PlanFinishDate) < new Date('2010-1-1')) {
    //                             item.PlanFinishDate = '-';
    //                         }

    //                         if (new Date(item.RealStartDate) < new Date('2010-1-1')) {
    //                             item.RealStartDate = '-';
    //                         }

    //                         if (new Date(item.RealFinishDate) < new Date('2010-1-1')) {
    //                             item.RealFinishDate = '-';
    //                         }
    //                         if (new Date(item.RealSendDate) < new Date('2010-1-1')) {
    //                             item.RealSendDate = '-';
    //                         }
    //                         if (new Date(item.TelegraphTime) < new Date('2010-1-1')) {
    //                             item.TelegraphTime = '-';
    //                         }
    //                         item.WID = i + 1;
    //                     });
    //                     DataAllSearch = $com.util.Clone(Grade);
    //                     $("#femi-riskLevel-tbody").html($com.util.template(Grade, HTML.TableMode));

    //                     $("#femi-riskLevel-tbody tr").each(function (i, item) {
    //                         var $this = $(this);
    //                         var colorName = $this.css("background-color");
    //                         $this.attr("data-color", colorName);



    //                     });

    //                 }
    //                 $com.app.loaded();
    //             });

    //         },
    //         //查询
    //         getFPCProduct: function (data, fn, context) {
    //             var d = {
    //                 $URI: "/FPCProduct/All",
    //                 $TYPE: "get"
    //             };

    //             function err() {
    //                 $com.app.tip('获取失败，请检查网络');
    //             }

    //             $com.app.ajax($.extend(d, data), fn, err, context);
    //         },
    //         //查询信息
    //         getCustomer: function (data, fn, context) {
    //             var d = {
    //                 $URI: "/Customer/All",
    //                 $TYPE: "get"
    //             };

    //             function err() {
    //                 $com.app.tip('获取失败，请检查网络');
    //             }

    //             $com.app.ajax($.extend(d, data), fn, err, context);
    //         },
    //         //查询产线列表
    //         getFMCLine: function (data, fn, context) {
    //             var d = {
    //                 $URI: "/FMCLine/All",
    //                 $TYPE: "get"
    //             };

    //             function err() {
    //                 $com.app.tip('获取失败，请检查网络');
    //             }

    //             $com.app.ajax($.extend(d, data), fn, err, context);
    //         },
    //         //查询模块ID对应枚举值
    //         getModuleAll: function (data, fn, context) {
    //             var d = {
    //                 $URI: "/MESEnum/All",
    //                 $TYPE: "get"
    //             };

    //             function err() {
    //                 $com.app.tip('获取失败，请检查网络');
    //             }

    //             $com.app.ajax($.extend(d, data), fn, err, context);
    //         },
    //         getOMSCommand: function (data, fn, context) {
    //             var d = {
    //                 $URI: "/OMSCommand/All",
    //                 $TYPE: "get",
    //                 $SERVER: "/MESAPS"
    //             };

    //             function err() {
    //                 $com.app.tip('获取失败，请检查网络');
    //             }

    //             $com.app.ajax($.extend(d, data), fn, err, context);
    //         },
    //         //保存列表
    //         postCommandSave: function (data, fn, context) {
    //             var d = {
    //                 $URI: "/OMSCommand/Update",
    //                 $TYPE: "post",
    //                 $SERVER: "/MESAPS"
    //             };

    //             function err() {
    //                 $com.app.tip('获取失败，请检查网络');
    //             }

    //             $com.app.ajax($.extend(d, data), fn, err, context);
    //         },

    //         //查询列表
    //         getOMSOrder: function (data, fn, context) {
    //             var d = {
    //                 $URI: "/OMSOrder/All",
    //                 $TYPE: "get",
    //                 $SERVER: "/MESAPS"
    //             };

    //             function err() {
    //                 $com.app.tip('获取失败，请检查网络');
    //             }

    //             $com.app.ajax($.extend(d, data), fn, err, context);
    //         },
    //         changeOMSOrder: function (data, fn, context) {
    //             var d = {
    //                 $URI: "/OMSOrder/ChangeRoute",
    //                 $TYPE: "post",
    //                 $SERVER: "/MESAPS"
    //             };

    //             function err() {
    //                 $com.app.tip('获取失败，请检查网络');
    //             }

    //             $com.app.ajax($.extend(d, data), fn, err, context);
    //         },
    //         receiveDone: function (data, fn, context) {
    //             var d = {
    //                 $URI: "/OMSOrder/Received",
    //                 $TYPE: "post",
    //                 $SERVER: "/MESAPS"
    //             };

    //             function err() {
    //                 $com.app.tip('获取失败，请检查网络');
    //             }

    //             $com.app.ajax($.extend(d, data), fn, err, context);
    //         },
    //         //保存列表
    //         postOMSOrder: function (data, fn, context) {
    //             var d = {
    //                 $URI: "/OMSOrder/Update",
    //                 $TYPE: "post",
    //                 $SERVER: "/MESAPS"
    //             };

    //             function err() {
    //                 $com.app.tip('获取失败，请检查网络');
    //             }

    //             $com.app.ajax($.extend(d, data), fn, err, context);
    //         },
    //         //审核
    //         postAudit: function (data, fn, context) {
    //             var d = {
    //                 $URI: "/BusinessUnit/Audit",
    //                 $TYPE: "post"
    //             };

    //             function err() {
    //                 $com.app.tip('获取失败，请检查网络');
    //             }

    //             $com.app.ajax($.extend(d, data), fn, err, context);
    //         },
    //         //启用
    //         activeOMSOrder: function (data, fn, context) {
    //             var d = {
    //                 $URI: "/OMSOrder/Active",
    //                 $TYPE: "post",
    //                 $SERVER: "/MESAPS"
    //             };

    //             function err() {
    //                 $com.app.tip('获取失败，请检查网络');
    //             }

    //             $com.app.ajax($.extend(d, data), fn, err, context);
    //         },
    //         //导出
    //         postExportExcel: function (data, fn, context) {
    //             var d = {
    //                 $URI: "/Upload/ExportExcel",
    //                 $TYPE: "post"
    //             };

    //             function err() {
    //                 $com.app.tip('获取失败，请检查网络');
    //             }

    //             $com.app.ajax($.extend(d, data), fn, err, context);
    //         },


    //         //删除得到新的数据
    //         getNewList: function (_source, set_data) {
    //             if (!_source)
    //                 _source = [];
    //             if (!set_data)
    //                 set_data = [];
    //             var rst = [];
    //             for (var i = 0; i < _source.length; i++) {
    //                 var NotOWn = false;
    //                 for (var j = 0; j < set_data.length; j++) {
    //                     if (_source[i].RiskID == set_data[j].RiskID) {
    //                         _source.splice(i, 1);
    //                         set_data.splice(j, 1);
    //                         NotOWn = true;
    //                     }
    //                     if (set_data.length < 1) {
    //                         break;
    //                     }
    //                     if (NotOWn) {
    //                         model.com.getNewList(_source, set_data);
    //                     }
    //                 }

    //             }
    //             rst = _source;
    //             return rst;
    //         },
    //         //得到ID
    //         GetMaxID: function (_source) {
    //             var id = 0;
    //             if (!_source)
    //                 _source = [];
    //             $.each(_source, function (i, item) {
    //                 if (item.ID > id)
    //                     id = item.ID;
    //             });
    //             return id + 1;

    //         },
    //     }
    // }),

    //     model.init();


});