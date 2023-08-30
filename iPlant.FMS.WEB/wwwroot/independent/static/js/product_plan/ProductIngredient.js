require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/route_new', '../static/utils/js/base/tooltip', '../static/utils/js/base/Vue'], function ($zace, $com, $route, $tooltip, Vue) {

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
            // "OrderNo|制造令编号*",

            // "BureauSectionID|客户|ArrayOne",
            // "LineID|产线|ArrayOne",
            // "ProductID|型号|ArrayOne",
            // "FQTYPlan|计划数量",
            // //"PartNo|车号",//Priority
            // // "Priority|优先级",
            // "RouteID|工艺BOP|ArrayOne",
            // "TelegraphTime|电报时刻|DateTime",
            // "TelegraphRealTime|电报到场日期|Date",
            // "PlanReceiveDate|ERP预计开工|Date",
            // "RealReceiveDate|实际进厂|Date",
            // "PlanFinishDate|ERP预计完工|Date",
            // "RealStartDate|实际开工|Date",
            // "RealFinishDate|实际完工|Date",
            // "RealSendDate|交车日期|Date",
            // "Remark|备注",

            "Status|状态|ArrayOne",
            // "Active|启用|ArrayOne",
            // "CreateTime|时间|DateTime",
            // "EditTime|时间|DateTime",

            "PLDate|需求日期|Date",
            "SubmitTime|提交日期|Date",

            "FQTYPlan|实际计划数*",
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
            Status: [
                {
                    name: "已保存",
                    value: 1
                }, {
                    name: "已制定",
                    value: 2
                }, {
                    name: "已投产",
                    value: 3
                }, {
                    name: "生产中",
                    value: 4
                }, {
                    name: "已完工",
                    value: 5
                },
                {
                    name: "暂停中",
                    value: 6
                }, {
                    name: "已入库",
                    value: 7
                }, {
                    name: "已发货",
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
            "No|订单号*",
            "WBSNo|合同评审单号*",
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

        ];
        KEYWORD_Level_Order = {};
        FORMATTRT_Level_Order = {};

        DEFAULT_VALUE_Level_Order = {
            No: "",
            WBSNo: '',
            ContactCode: "",
            CustomerID: 0,
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

            GradeItemStyle: {
                width: "100%",
                float: "left",
            },

            changeName: "全部",

            //详情
            SourceInfo: [],

            StatusMenu: {
                0: "待下达",
                1: "已保存",
                2: "待配料",
                3: "配料中",
                4: "已完成",
                5: "已关闭",
            },

            OrderID: 0,

            //制造令
            Grade: [],
            OrderSource: [],

            //需求日期
            OrderGrade: [],

            //订单
            GradeItem: [],
            GradeItemSource: [],
            //是否显示
            GradeItemISShow: false,
            GradeISShow: true,
            RouteISShow: false,
            DragLineISShow: false,
            PLDateISShow: false,
            //筛选
            SelectISShow: false,
            //所属大订单
            GradeID: 0,
            wWorkShopID: 1,
            mStartTimeNew: $com.util.format('yyyy-MM-dd', new Date()),
        },
        beforeCreate() {
            _this = this;
        },

        created: function () {
            var VueThis = this;
            VueThis.mEndTimeNew = VueThis.addDays($com.util.format('yyyy-MM-dd', new Date()), 30);
            $com.app.loading('数据加载中！！');
            VueThis.getFMCLine({ FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0 }, function (resP) {
                if (!resP)
                    return;

                $.each(resP.list, function (i, item) {
                    TypeSource_Level.LineID.push({
                        value: item.ID,
                        name: item.Name
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
            refresh: function () {
                $com.app.loading('数据加载中！！');
                this.getOMSOrderList({ StartTime: _this.mStartTimeNew, EndTime: _this.mEndTimeNew, APSShiftPeriod: 5, WorkShopID: _this.wWorkShopID }, function (resP) {
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
                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }

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
                        });

                        _this.GradeItem = Grade;

                        DataAllSearch = $com.util.Clone(Grade);
                    }
                    $com.app.loaded();
                });
            },

            //生产物料计划
            addGradeItem: function () {

                $com.app.loading("生成中。。。");
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", _this.GradeItemSource);

                if (SelectData.length <= 0) {
                    alert("至少选择一条数据");
                    return;
                }

                _this.postMaterialTaskProductCreateAll({
                    data: SelectData,
                    Mode: 2,
                    InventoryType: 1
                }, function (res) {
                    _this.randerPlan(res.list);
                    $com.app.loaded();
                });

            },
            randerPlan: function (data) {

                TypeMode = 2;

                _this.GradeItemISShow = true;
                _this.GradeISShow = false;

                var cat = {};

                _this.OrderGrade = [];

                $.each(data, function (i, item) {

                    $.each(_this.SourceInfo, function (j, jtem) {
                        if (jtem.OrderNo == item.OrderNo && jtem.MaterialNo == item.MaterialNo) {
                            item.FQTYPL = jtem.FQTYPL;
                            item.FQTYLL = jtem.FQTYLL;
                        }
                    });

                    for (var p in item) {
                        if (!FORMATTRT_Level[p] || p == "Status")
                            continue;
                        item[p] = FORMATTRT_Level[p](item[p]);
                    }

                    if (!cat[item.OrderNo]) {
                        cat[item.OrderNo] = item.OrderNo;
                        _this.OrderGrade.push(item);
                    }

                    item.FQTYBase = item.FQTYBase.toFixed(2);
                    item.FQTYPlan = item.FQTYPlan.toFixed(2);
                    item.FQTYPL = item.FQTYPL.toFixed(2);
                    item.FQTYLL = item.FQTYLL.toFixed(2);

                    item.WID = i + 1;
                });

                _this.Grade = data;

            },
            setPlan: function (obj) {

                var cat = [];
                var default_value = {
                    FQTYPlan: obj.FQTYPlan
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level_Order, "修改", function (rst) {

                    if (!rst || $.isEmptyObject(rst))
                        return;

                    obj.FQTYPlan = Number(rst.FQTYPlan);

                    $com.util.deleteLowerProperty(obj);

                    cat.push(obj);

                    _this.Grade.forEach(element => {
                        if (element.ID == obj.ID) {
                            element.FQTYPlan = obj.FQTYPlan;
                        }
                    });

                    alert("修改成功");
                    // _this.postMaterialTaskProductSubmit({
                    //     data: cat,
                    // }, function (res) {

                    //     _this.Grade.forEach(element => {
                    //         if (element.ID == res.list[0].ID) {
                    //             element.FQTYPlan = res.list[0].FQTYPlan;
                    //         }
                    //     });
                    //     alert("操作成功");
                    // });
                }, TypeSource_Level_Order));
            },

            getMaterialMarginAndLL: function (ID) {

                var cat = _this.GradeItemSource.filter((item) => { return item.ID == ID });
                _this.postQueryTaskMaterialInfoList({
                    data: cat,
                }, function (res) {

                    if (res.list.length > 0) {
                        _this.SourceInfo = res.list;
                        _this.getMaterialPlan(cat[0].ID, -1,);
                    } else {
                        alert("无配料计划，请先生成计划");
                    }
                });
            },

            getMaterialPlan: function (ID, Type) {

                _this.SelectISShow = true;

                _this.OrderID = ID;
                var SelectData = _this.GradeItemSource.filter((item) => { return item.ID == ID });
                _this.getMaterialTaskProductAll({
                    OrderID: SelectData[0].ID,
                    Active: -1,
                    Status: Type
                }, function (res) {

                    _this.randerPlan(res.list);
                });
            },

            getMaterialPlanType: function (Type, Name) {

                if (_this.OrderID == 0) {
                    alert("订单有误");
                    return;
                }

                _this.changeName = Name;

                var SelectData = _this.GradeItemSource.filter((item) => { return item.ID == _this.OrderID });

                _this.getMaterialTaskProductAll({
                    OrderID: SelectData[0].ID,
                    Active: -1,
                    Status: Type
                }, function (res) {
                    _this.randerPlan(res.list);
                });

            },

            //Submit
            Submit(ID) {



                var temp = false;

                _this.Grade.forEach(element => {
                    if (element.Status >= 2) {
                        temp = true;
                        return;
                    }
                });
                if (temp) {
                    alert("存在计划已被下达无法操作！！！");
                    return;
                }

                var submitList = [];



                if (ID == 1) {
                    _this.Grade.forEach(element => {
                        //element.Status = 2;

                        if (element.FQTYPlan > 0) {
                            submitList.push(element);
                        }
                    });
                } else {
                    _this.Grade.forEach(element => {
                        //element.Status = 1;
                        submitList.push(element);
                    });
                }

                if (submitList.length != _this.Grade.length) {
                    if (!confirm("存在配料计划，计划数为零的情况，下达将过滤这些计划，是否继续？")) {
                        return false;
                    }
                }

                submitList.forEach(element => {
                    element.Status = (ID == 1) ? 2 : 1;
                });

                $com.util.deleteLowerProperty(submitList);
                $com.app.loading("加载中");
                _this.postMaterialTaskProductSubmit({
                    data: submitList
                }, function (res) {
                    $com.app.loaded("加载中");

                    alert("操作成功");
                    _this.randerPlan(res.list);
                });
            },
            //需求日期
            getPLDate: function () {
                _this.GradeItemStyle.width = "80%";
                _this.PLDateISShow = true;
            },
            setPLDate: function (obj) {
                var default_value = {
                    PLDate: obj.PLDate
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {

                    if (!rst || $.isEmptyObject(rst))
                        return;

                    var cat = [];

                    _this.Grade.forEach(element => {
                        if (element.ID == obj.ID) {
                            element.PLDate = $com.util.format("yyyy-MM-dd", rst.PLDate);
                            cat.push(element);
                        }
                    });

                    _this.postMaterialTaskProductSubmit({
                        data: cat,
                    }, function (res) {

                        // _this.Grade.forEach(element => {
                        //     if (element.ID == res.list[0].ID) {
                        //         element.FQTYPlan = res.list[0].FQTYPlan;
                        //     }
                        // });

                        alert("操作成功");
                    });
                }, TypeSource_Level));
            },
            //按钮点击
            searchLevelPro: function () {
                var value = $("#zace-search-level").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), _this.GradeItem, value, "WID");

            },
            //按钮点击
            searchlevelProGrade: function () {
                var value = $("#zace-search").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevelOrder-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevelOrder-tbody"), _this.Grade, value, "WID");

            },
            //模糊查询
            searchLevel: function () {
                if (event.keyCode == 13 && TypeMode == 2) {
                    var $this = $(this);
                    var value = $("#zace-search-level").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-riskLevel-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-riskLevel-tbody"), _this.GradeItem, value, "WID");
                }

                if (event.keyCode == 13 && TypeMode == 1) {
                    var $this = $(this);
                    var value = $("#zace-search").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-riskLevelOrder-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-riskLevelOrder-tbody"), _this.Grade, value, "WID");
                }
            },

            cat: function () {
                var $table = $(".table-partOrderItem"),
                    fileName = "订单.xls",
                    Title = "订单";

                // var portSource = $com.util.Clone(_this.GradeItemSource);

                // $.each(portSource, function (i, item) {
                //     item.WID = i + 1;
                // });

                var params = $com.table.getExportParams($table, fileName, Title, _this.GradeItem);

                _this.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });
            },
            back: function () {
                _this.GradeItemISShow = false;
                _this.GradeISShow = true;
                _this.PLDateISShow = false;
                _this.GradeItemStyle.width = "100%";
                _this.SelectISShow = false;
                TypeMode = 1;
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
            //生成物料计划
            postMaterialTaskProductCreateAll: function (data, fn, context) {
                var d = {
                    $URI: "/MaterialTaskProduct/CreateAll",
                    $TYPE: "post",
                    $SERVER: "/iPlantWMS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查看物料计划
            getMaterialTaskProductAll: function (data, fn, context) {
                var d = {
                    $URI: "/MaterialTaskProduct/All",
                    $TYPE: "get",
                    $SERVER: "/iPlantWMS"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //提交
            postMaterialTaskProductSubmit: function (data, fn, context) {
                var d = {
                    $URI: "/MaterialTaskProduct/Submit",
                    $TYPE: "post",
                    $SERVER: "/iPlantWMS"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询详情
            postQueryTaskMaterialInfoList: function (data, fn, context) {
                var d = {
                    $URI: "/MaterialTaskProduct/QueryTaskMaterialInfoList",
                    $TYPE: "post",
                    $SERVER: "/iPlantWMS"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
        },
    });
});
