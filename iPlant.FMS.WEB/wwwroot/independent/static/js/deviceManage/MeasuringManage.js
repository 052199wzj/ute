require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/route_new', '../static/utils/js/base/tooltip', '../static/utils/js/base/Vue', '../static/utils/js/base/bootstrap-treeview.min'], function ($zace, $com, $route, $tooltip, Vue) {

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


    HTML = {
        TableOrderMode: [
            '<tr data-color="">',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td>',

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
            '<td data-title="RealSendDate" data-value="{{RealSendDate}}">{{RealSendDate}}</td>',
            '<td data-title="Remark" data-value="{{Remark}}">{{Remark}}</td>',
            '<td data-title="Status" data-value="{{Status}}">{{Status}}</td>',
            '<td data-title="Active" data-value="{{Active}}">{{Active}}</td>',

            '</tr>',
        ].join(""),


    };

    (function () {
        KEYWORD_Level_LIST = [
            "ModelName|量具规格名称*",
            "ModelNo|量具规格编码*",

            "Code|校准字码*",
            "CalibrationCycle|校准周期（月）*",
            "MeasureRange|量程范围",
            "Cost|量具价值*",
            "Accuracy|精准度*",
            "Mistake|允许误差*",

            "Environment|环境*",
            "CalibrationLevel|校准等级|ArrayOne",
            "CalibrationCycle|校周期",
            "CalibrationBasis|校准依据",

            //"Status|状态|ArrayOne",
            //"Active|启用|ArrayOne",
            "CreateTime|时间|DateTime",
            "EditTime|时间|DateTime",
            "CreateTime|时间|DateTime",

            "BorrowTime|借用时间|Date",
            "FirstTime|首次投入时间|Date",
            "CalibrationDate|校准日期|Date",
            "NextCalibrationDate|下次校准日期|Date",

        ];
        KEYWORD_Level = {};
        FORMATTRT_Level = {};

        DEFAULT_VALUE_Level = {
            ModelNo: '',
            ModelName: '',
            MeasureRange: "",
            Cost: "",
            Accuracy: "",
            Mistake: "",
            Environment: "",
            CalibrationLevel: 0,
            CalibrationBasis: "",
        };

        TypeSource_Level = {
            CalibrationLevel: [],
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
            "Name|量具名称*",
            "Code|量具编码*",


            "OwnerID|责任人|ArrayOne",
            "BorrowerID|借用人|ArrayOne",
            "BorrowTime|借用时间|Date",
            "FirstTime|首次投入时间|Date",

            "ManufacturerNo|出厂编码",
            "ModelDemand|规格要求",
            "CalibrationManufacturer|校准单位",
            "CalibrationPersonName|校准责任人|ArrayOne",
            "CalibrationDate|校准日期|Date",
            "NextCalibrationDate|下次校准日期|Date",
            "CalibrationNo|校准证书编号",
            "StorageLocation|存放地点",

            "DeviceName|所属设备|ArrayOne",

            "ModelID|量具类型*|ArrayOne",

            "MeasuringTypeName|量具类型名称*",
            "MeasuringTypeCode|量具类型编码*",

            "DeviceLife|寿命",
            "ScrapValue|残值",
            // "BusinessUnitID|车型|ArrayOne",
            "NetValue|净值",

            "ContactCode|备注",
            //"Status|状态|ArrayOne",
            //"Active|启用|ArrayOne",
            "CreateTime|时间|DateTime",
            "EditTime|时间|DateTime",
            "AuditTime|时间|DateTime",
            "OperateTime|时间|DateTime",
            "CreatorID|人|ArrayOne",

            "CreatorID|人|ArrayOne",
        ];
        KEYWORD_Level_Order = {};
        FORMATTRT_Level_Order = {};

        DEFAULT_VALUE_Level_Order = {

            Name: "",
            Code: "",
            OwnerID: 0,
            BorrowerID: 0,
            BorrowTime: new Date(),
            FirstTime: new Date(),
            NextCalibrationDate: new Date(),
            ManufacturerNo: "",
            ModelDemand: "",
            CalibrationManufacturer: "",
            CalibrationPersonName: "",
            CalibrationDate: "",
            CalibrationNo: "",
            StorageLocation: "",
            DeviceName: 0,

        };

        $(function () {
            $.each(window.parent._UserAll, function (i, item) {
                if (item.Active == 1) {
                    var _data = {
                        name: item.Name,
                        value: item.ID
                    }
                    TypeSource_Level_Order.OwnerID.push(_data);
                    TypeSource_Level_Order.BorrowerID.push(_data);
                    TypeSource_Level_Order.CalibrationPersonName.push(_data);
                }
            });
        });

        TypeSource_Level_Order = {
            DeviceName: [],
            OwnerID: [{
                name: "无",
                value: 0
            }],
            BorrowerID: [{
                name: "无",
                value: 0
            }],
            CalibrationPersonName: [{
                name: "无",
                value: 0
            }],
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
            ModelID: [

            ],

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

            ActiveType: {
                0: "默认",
                1: "激活",
                2: "禁用",
            },

            StatusMenu: {
                0: "就绪",
                1: "使用中",
                2: "闲置",
                3: "维修",
                4: "保养",
                5: "报废",
                6: "封存",
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
            GradeISShow: false,
            RouteISShow: false,
            DragLineISShow: false,
            PLDateISShow: true,
            //筛选
            SelectISShow: false,
            //所属大订单
            GradeID: 0,

            //量具类型
            MeasuringType: true,
            MeasuringTypeList: [],
            MeasuringTypeID: 0,

            //所有的类型 0:类型 1：规格 2：量具
            AllType: 0,




            //量具规格 
            MeasuringProductNo: false,
            wWorkShopID: 1,
            mStartTimeNew: $com.util.format('yyyy-MM-dd', new Date()),
            ModelID: 0,
            //量具规格 列表
            DeviceInfoAllList: [],

            NodeID: -1,

            TreeMenu: true,
            TableMenu: false,

            //规则列表
            CalibrationList: [],
            CalibrationSource: [],
            GradeSource: [],
        },
        beforeCreate() {
            _this = this;
        },

        created: function () {
            var VueThis = this;
            VueThis.mEndTimeNew = VueThis.addDays($com.util.format('yyyy-MM-dd', new Date()), 30);
            $com.app.loading('数据加载中！！');



            VueThis.getDeviceLedgerAll({ Active: 1 }, function (res) {

                if (res.list) {
                    $.each(res.list, function (i, item) {
                        TypeSource_Level_Order.DeviceName.push({
                            name: item.Code + "(" + item.ModelName + ")",
                            value: item.ID
                        });
                    });
                }

            });

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

                    // VueThis.refreshMeasuringType();
                    VueThis.refresh();
                    VueThis.refreshCalibration();
                    // VueThis.getFPCProduct({ ProductTypeID: 0, BusinessUnitID: 0 }, function (resP) {
                    //     if (!resP)
                    //         return;

                    //     $.each(resP.list, function (i, item) {

                    //         if (item.Active == 1) {
                    //             TypeSource_Level.ProductID.push({
                    //                 value: item.ID,
                    //                 name: item.ProductNo
                    //             });
                    //         }

                    //     });
                    //     TypeSource_Level_Order.BusinessUnitID = TypeSource_Level.ProductID;


                    //     // VueThis.get({ active: 1 }, function (resP) {
                    //     //     if (!resP)
                    //     //         return;

                    //     //     $.each(resP.list, function (i, item) {
                    //     //         TypeSource_Level_Order.CreatorID.push({
                    //     //             value: item.ID,
                    //     //             name: item.Name
                    //     //         });
                    //     //     });

                    //     // });
                    // });
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

            //折叠
            TreeOpen: function () {

                $("#standardList").treeview('expandAll', { silent: true });
            },
            TreeClose: function () {
                $("#standardList").treeview('collapseAll', { silent: true });
            },

            TreeSelect: function (e) {

                var value = e.target.value;

                $("#standardList").treeview('search', [value, {
                    ignoreCase: true,
                    exactMatch: false,
                    revealResults: true,
                }]);

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
            //增加类型
            addMeasuringType: function () {

                var default_value = {
                    MeasuringTypeName: "",
                    MeasuringTypeCode: "",
                };

                $("body").append($com.modal.show(default_value, KEYWORD_Level_Order, "新增", function (rst) {

                    if (!rst || $.isEmptyObject(rst))
                        return;
                    var _data = {
                        ID: 0,
                        Name: rst.MeasuringTypeName,
                        DSType: 1,
                        Active: rst.Active,
                        Type: 3,
                        Code: rst.MeasuringTypeCode,
                    };

                    _this.addType({
                        data: _data
                    }, function (res) {
                        alert("新增成功");
                        _this.refresh();
                    })

                }, TypeSource_Level_Order));
            },

            refreshMeasuringProduct: function (ID) {

                _this.MeasuringProductNo = true;
                _this.GradeISShow = false;

                _this.MeasuringType = false;

                _this.MeasuringTypeID = ID;

                _this.getMeasureModelAll({
                    // Type: 3,
                    Active: -1,
                    WorkType: ID
                }, function (res) {
                    if (!res)
                        return;
                    var list = res.list,
                        rst = [];

                    TypeSource_Level_Order.ModelID = [];

                    _this.GradeSource = $com.util.Clone(res.list);

                    $.each(res.list, function (i, item) {

                        item.WID = i + 1;

                        TypeSource_Level_Order.ModelID.push({
                            name: item.ModelName,
                            value: item.ID
                        });

                        item.Badge = " ";

                        for (var p in item) {

                            if (!FORMATTRT_Level[p])
                                continue;
                            item[p] = FORMATTRT_Level[p](item[p]);
                        }
                    });

                    _this.OrderGrade = $com.util.Clone(res.list);
                });

                // _this.getMeasuring({
                //     Type: 3,
                //     WorkType: ID
                // }, function (resP) {
                //     if (!resP)
                //         return;
                //     if (resP && resP.list) {
                //         var Grade = $com.util.Clone(resP.list);
                //         DATABasic = $com.util.Clone(resP.list);

                //         _this.GradeItemSource = $com.util.Clone(resP.list);

                //         //审核数据
                //         DataAllConfirm = $com.util.Clone(resP.list);

                //         DataAll = $com.util.Clone(Grade);

                //         $.each(Grade, function (i, item) {
                //             for (var p in item) {

                //                 if (!FORMATTRT_Level[p] || p == "ModelID")
                //                     continue;
                //                 item[p] = FORMATTRT_Level[p](item[p]);
                //             }

                //             if (new Date(item.RealReceiveDate) < new Date('2010-1-1')) {
                //                 item.RealReceiveDate = '-';
                //             }

                //             if (new Date(item.TelegraphRealTime) < new Date('2010-1-1')) {
                //                 item.TelegraphRealTime = '-';
                //             }

                //             if (new Date(item.TelegraphRealTime) < new Date('2010-1-1')) {
                //                 item.TelegraphRealTime = '-';
                //             }

                //             // item.PlanReceiveDate = item.PlanReceiveDate;
                //             if (new Date(item.PlanReceiveDate) < new Date('2010-1-1')) {
                //                 item.PlanReceiveDate = '-';
                //             }

                //             if (new Date(item.PlanFinishDate) < new Date('2010-1-1')) {
                //                 item.PlanFinishDate = '-';
                //             }

                //             if (new Date(item.RealStartDate) < new Date('2010-1-1')) {
                //                 item.RealStartDate = '-';
                //             }

                //             if (new Date(item.RealFinishDate) < new Date('2010-1-1')) {
                //                 item.RealFinishDate = '-';
                //             }

                //             if (new Date(item.RealSendDate) < new Date('2010-1-1')) {
                //                 item.RealSendDate = '-';
                //             }

                //             if (new Date(item.TelegraphTime) < new Date('2010-1-1')) {
                //                 item.TelegraphTime = '-';
                //             }

                //             item.WID = i + 1;
                //         });

                //         _this.GradeItem = Grade;

                //         DataAllSearch = $com.util.Clone(Grade);
                //     }

                // });
                // $com.app.loaded();
            },
            refreshMeasuringType: function () {
                $com.app.loading('数据加载中！！');

                //量具类型
                _this.getDeviceWorkTypeAll({
                    Type: 3,
                    Active: -1,
                    DSType: 1,
                }, function (res) {

                    if (!res)
                        return;

                    $.each(res.list, function (i, item) {

                        item.WID = i + 1;
                        item.Badge = " ";

                        for (var p in item) {

                            if (!FORMATTRT_Level[p])
                                continue;
                            item[p] = FORMATTRT_Level[p](item[p]);
                        }
                    });

                    _this.MeasuringTypeList = res.list;
                    $com.app.loaded();
                });
            },
            //删除类型
            resetMeasuringProduct: function (ID) {
                var cat = _this.MeasuringTypeList.filter((item) => { return item.ID == ID })[0];

                var default_value = {
                    MeasuringTypeName: cat.Name,
                    MeasuringTypeCode: cat.Code,
                };

                $("body").append($com.modal.show(default_value, KEYWORD_Level_Order, "修改", function (rst) {

                    if (!rst || $.isEmptyObject(rst))
                        return;
                    cat.Name = rst.MeasuringTypeName;
                    cat.Code = rst.MeasuringTypeCode;

                    $com.util.deleteLowerProperty(cat);
                    _this.addType({
                        data: cat
                    }, function (res) {
                        alert("修改成功");
                        _this.refreshMeasuringType();
                    })

                }, TypeSource_Level_Order));

            },
            ActiveMeasuringType: function (ID) {
                var cat = _this.MeasuringTypeList.filter((item) => { return item.ID == ID })[0];


                _this.workActive({ data: cat, Active: 1 }
                    , function (res) {
                        alert("激活完成");
                        _this.refreshMeasuringType();
                    });

            },
            ForbiddenMeasuringType: function (ID) {
                var cat = _this.MeasuringTypeList.filter((item) => { return item.ID == ID })[0];


                _this.workActive({ data: cat, Active: 2 }
                    , function (res) {
                        alert("禁用完成");
                        _this.refreshMeasuringType();
                    });

            },

            //量具列表
            refreshAllMeasuring: function (ID) {


                _this.MeasuringProductNo = false;
                _this.MeasuringType = false;
                _this.GradeISShow = true;
                // // GradeISShow
                _this.ModelID = ID;
                // _this.GradeItemStyle.width = "100%";
                // _this.GradeISShow = true;

                _this.getMeasuring({
                    // Type: 3,
                    ModelID: ID
                }, function (resP) {
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

                                if (!FORMATTRT_Level[p] || p == "ModelID")
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }

                            item.WID = i + 1;
                        });

                        _this.GradeItem = Grade;

                        DataAllSearch = $com.util.Clone(Grade);
                    }

                });
            },
            //按钮点击
            searchLevelProType: function () {
                var value = $("#searchLevelType-Type").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#lmvt-Type-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#lmvt-Type-tbody"), _this.MeasuringTypeList, value, "WID");
            },
            //模糊查询
            searchLevelType: function () {
                if (event.keyCode == 13) {
                    var $this = $(this);
                    var value = $("#searchLevelType-Type").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#lmvt-Type-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#lmvt-Type-tbody"), _this.MeasuringTypeList, value, "WID");
                }
            },

            refreshAll: function () {
                $com.app.loading('数据加载中！！');

                _this.GradeISShow = false;
                _this.MeasuringType = true;
                _this.MeasuringProductNo = false;
                _this.NodeID = -1;
                _this.refresh();
            },

            ChangeCalibration: function (Type) {
                if (Type == 1) {
                    _this.TreeMenu = false;
                    _this.TableMenu = true;
                } else {
                    _this.TreeMenu = true;
                    _this.TableMenu = false;
                }
            },
            //新增等级
            CalibrationAdd: function () {
                var default_value = {
                    Code: "",
                    CalibrationCycle: 0,
                }
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "新增", function (rst) {

                    if (!rst || $.isEmptyObject(rst))
                        return;

                    var _date = {
                        Code: rst.Code,
                        CalibrationCycle: rst.CalibrationCycle,
                        CalibrationUnit: 1,
                        CalibrationUnitText: "月",
                        ID: 0
                    };

                    _this.addCalibrationLevelUpdate({
                        data: _date
                    }, function (res) {
                        alert("新增成功");
                        _this.refreshCalibration();
                    })

                }, TypeSource_Level));
            },

            //修改
            resetCalibration: function (ID) {

                var cat = _this.CalibrationSource.filter((item) => { return item.ID == ID })[0];

                var default_value = {
                    Code: cat.Code,
                    CalibrationCycle: cat.CalibrationCycle,
                }
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {

                    if (!rst || $.isEmptyObject(rst))
                        return;


                    cat.Code = rst.Code;
                    cat.CalibrationCycle = rst.CalibrationCycle;

                    $com.util.deleteLowerProperty(cat);

                    _this.addCalibrationLevelUpdate({
                        data: cat
                    }, function (res) {
                        alert("修改成功");
                        _this.refreshCalibration();
                    });

                }, TypeSource_Level));
            },
            ActiveCalibration: function (ID, Type) {
                var cat = _this.CalibrationSource.filter((item) => { return item.ID == ID })[0];

                _this.addCalibrationLevelActive({
                    data: cat,
                    Active: Type
                }, function (res) {
                    alert("操作成功");
                    _this.refreshCalibration();
                });

            },

            refreshCalibration: function () {
                _this.getCalibrationLevelAll({
                    Active: -1,
                }, function (res) {
                    TypeSource_Level.CalibrationLevel = [];

                    _this.CalibrationSource = $com.util.Clone(res.list);

                    $.each(res.list, function (i, item) {
                        item.WID = i + 1;
                        item.Badge = " ";

                        if (item.Active == 1) {
                            TypeSource_Level.CalibrationLevel.push({
                                name: item.Code,
                                value: item.ID
                            });
                        }

                    });

                    _this.CalibrationList = res.list;
                });
            },
            refresh: function () {
                $com.app.loading('数据加载中！！');

                _this.GradeISShow = false;
                _this.MeasuringType = true;
                _this.MeasuringProductNo = false;

                //量具类型
                _this.getDeviceWorkTypeAll({
                    Type: 3,
                    Active: -1,
                    DSType: 1,
                }, function (res) {

                    if (!res)
                        return;

                    var WorkTypeList = res.list;

                    $.each(res.list, function (i, item) {

                        item.WID = i + 1;
                        item.Badge = " ";

                        for (var p in item) {

                            if (!FORMATTRT_Level[p])
                                continue;
                            item[p] = FORMATTRT_Level[p](item[p]);
                        }
                    });

                    _this.MeasuringTypeList = res.list;

                    _this.getMeasureModelAll({
                        Type: 3,
                        Active: -1
                    }, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];

                        var TreeList = [];

                        _this.DeviceInfoAllList = $com.util.Clone(res.list);

                        $.each(WorkTypeList, function (i, item) {
                            item.nodes = [];
                            $.each(res.list, function (j, jtem) {


                                if (jtem.WorkType == item.ID) {
                                    item.nodes.push({
                                        text: jtem.ModelNo + "(" + jtem.ModelName + ")",
                                        Type: "Product",
                                        ID: jtem.ModelID
                                    })
                                }

                            });

                            TreeList.push({
                                nodes: item.nodes,
                                text: item.Code + "(" + item.Name + ")",
                                tags: [item.nodes.length],
                                ID: item.ID,
                                Type: "Type",
                            })

                        });

                        $("#standardList").treeview({
                            // color: "#428bca",

                            // expandIcon: "glyphicon glyphicon-stop",
                            // collapseIcon: "glyphicon glyphicon-unchecked",
                            color: "black",
                            expandIcon: "glyphicon glyphicon-plus",
                            collapseIcon: "glyphicon glyphicon-minus",

                            preventUnselect: true,

                            levels: 0,

                            nodeIcon: "glyphicon glyphicon-tags",

                            showTags: true,
                            data: TreeList,

                            onNodeSelected: function (event, data) {

                                _this.NodeID = data.nodeId;
                                SelectedNode = data.nodeId;
                                var sels = $('#standardList').treeview('getSelected');
                                for (var i = 0; i < sels.length; i++) {
                                    if (sels[i].nodeId == data.nodeId) {
                                        continue;
                                    }
                                    $('#standardList').treeview('unselectNode', [sels[i].nodeId, { silent: true }]);
                                }

                                $("#standardList").treeview('selectNode', [data.nodeId, { silent: true }]);

                                wGroupID = data.ID;

                                ZaceLineID = 0;

                                ChangeData = 0;

                                if (data.Type == "Type") {
                                    _this.refreshMeasuringProduct(wGroupID);
                                }

                                if (data.Type == "Product") {
                                    _this.refreshAllMeasuring(wGroupID);
                                }

                            },
                            onNodeUnselected: function (event, data) {

                                if (SelectedNode != data.nodeId)
                                    return false;

                                $('#standardList').treeview('toggleNodeSelected', [SelectedNode, { silent: true }]);
                            }

                            // TypeSource_Level_Order.ModelID = [];
                            // _this.OrderGrade = $com.util.Clone(res.list);

                        });
                        if (_this.NodeID != -1)
                            $('#standardList').treeview('toggleNodeSelected', [_this.NodeID, { silent: false }]);
                        // _this.MeasuringTypeList = res.list;
                        $com.app.loaded();
                    });
                    //所有量具

                    // _this.getMeasuring({
                    //     Type: 3
                    // }, function (resP) {
                    //     if (!resP)
                    //         return;
                    //     if (resP && resP.list) {
                    //         var Grade = $com.util.Clone(resP.list);
                    //         DATABasic = $com.util.Clone(resP.list);

                    //         _this.GradeItemSource = $com.util.Clone(resP.list);

                    //         //审核数据
                    //         DataAllConfirm = $com.util.Clone(resP.list);

                    //         DataAll = $com.util.Clone(Grade);

                    //         $.each(Grade, function (i, item) {
                    //             for (var p in item) {

                    //                 if (!FORMATTRT_Level[p] || p == "ModelID")
                    //                     continue;
                    //                 item[p] = FORMATTRT_Level[p](item[p]);
                    //             }

                    //             if (new Date(item.RealReceiveDate) < new Date('2010-1-1')) {
                    //                 item.RealReceiveDate = '-';
                    //             }

                    //             if (new Date(item.TelegraphRealTime) < new Date('2010-1-1')) {
                    //                 item.TelegraphRealTime = '-';
                    //             }

                    //             if (new Date(item.TelegraphRealTime) < new Date('2010-1-1')) {
                    //                 item.TelegraphRealTime = '-';
                    //             }

                    //             // item.PlanReceiveDate = item.PlanReceiveDate;
                    //             if (new Date(item.PlanReceiveDate) < new Date('2010-1-1')) {
                    //                 item.PlanReceiveDate = '-';
                    //             }

                    //             if (new Date(item.PlanFinishDate) < new Date('2010-1-1')) {
                    //                 item.PlanFinishDate = '-';
                    //             }

                    //             if (new Date(item.RealStartDate) < new Date('2010-1-1')) {
                    //                 item.RealStartDate = '-';
                    //             }

                    //             if (new Date(item.RealFinishDate) < new Date('2010-1-1')) {
                    //                 item.RealFinishDate = '-';
                    //             }

                    //             if (new Date(item.RealSendDate) < new Date('2010-1-1')) {
                    //                 item.RealSendDate = '-';
                    //             }

                    //             if (new Date(item.TelegraphTime) < new Date('2010-1-1')) {
                    //                 item.TelegraphTime = '-';
                    //             }

                    //             item.WID = i + 1;
                    //         });

                    //         _this.GradeItem = Grade;

                    //         DataAllSearch = $com.util.Clone(Grade);
                    //     }

                });
                $com.app.loaded();
            },

            //导出量具列表
            Export: function () {

                var $table = $("#femi-riskLevel-tbody"),
                    fileName = "量具列表.xls",
                    Title = "量具列表";

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

            //导入量具列表
            Import: function () {

                $("#input-file").val("");
                $("#input-file").click();

            },

            //状态变更
            ChangeMeaStatus: function (StatusID, ID) {
                var cat = _this.GradeItemSource.filter((item) => { return item.ID == ID })[0];

                cat.Status = StatusID;

                $com.util.deleteLowerProperty(cat);

                _this.postDeviceLedgerUpdate({
                    data: cat,
                }, function (res) {

                    _this.refresh();
                    alert("修改成功");
                });
            },


            InputFileClick: function (el) {
                var $this = el.target;

                if ($this.files.length == 0)
                    return;

                if (!extLimit(['xlsx', 'xls']).has($this.files[0].name)) {
                    alert("请上传正确的Excel文件！");
                    clearFiles();
                    return;
                }
                var fileData = $this.files[0];

                var form = new FormData();
                form.append("file", fileData);
                $com.app.loading("数据导入中...");

                _this.postImportExcel(form, function (res) {
                    if (!res)
                        return;
                    res.list.splice(0, 1);//删除第一行
                    var list = res.list,
                        rst = [];
                    if (list) {

                        if (list.length <= 0) {
                            alert("导入数据为空！！！");
                            $com.app.loading();
                        }

                        var postData = res.list;

                        var DataParams = $com.table.postExportParams(postData, $(".lmvt-type-body"));

                        $.each(DataParams, function (i, item) {
                            item.ID = 0;

                            // model.com.postAQLUpdate({
                            //     data: item,
                            // }, function (res) {
                            //     model.com.RanderAQLList();
                            // });

                        });

                        $com.app.loaded();
                    }

                });
                function clearFiles() {
                    self.value = "";
                }

                function extLimit(exts) {
                    return {
                        has: function (file) {
                            var arr = file.split("."),
                                ext = arr[arr.length - 1].toLowerCase();

                            return exts.indexOf(ext) > -1 ? true : false;
                        }
                    };
                }
            },

            //新增量具
            addGradeItem: function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_Level_Order, KEYWORD_Level_Order, "新增", function (rst) {

                    if (!rst || $.isEmptyObject(rst))
                        return;

                    var _data = {
                        Name: rst.Name,
                        Code: rst.Code,
                        OwnerID: rst.OwnerID,
                        BorrowerID: rst.BorrowerID,
                        BorrowTime: rst.BorrowTime,
                        FirstTime: rst.FirstTime,
                        NextCalibrationDate: rst.NextCalibrationDate,
                        ManufacturerNo: rst.ManufacturerNo,
                        ModelDemand: rst.ModelDemand,
                        CalibrationManufacturer: rst.CalibrationManufacturer,
                        CalibrationPersonID: rst.CalibrationPersonName,
                        CalibrationDate: rst.CalibrationDate,
                        CalibrationNo: rst.CalibrationNo,
                        StorageLocation: rst.StorageLocation,
                        DeviceID: rst.DeviceName,
                        WorkShopID: 0,
                        LineID: 0,
                        PartID: 0,

                        ModelID: Number(_this.ModelID),

                        Type: 3
                    };

                    _this.postDeviceLedgerUpdate({
                        data: _data,
                    }, function (res) {

                        _this.refresh();
                        alert("新增成功");
                    });

                }, TypeSource_Level_Order, function () {

                }, "",
                    {
                        BorrowTime: "48%",
                        FirstTime: "48%",
                        NextCalibrationDate: "48%",
                    }
                ));

            },

            //量具类型修改
            MeaTypeReset: function (ID) {
                var cat = _this.GradeSource.filter((item) => { return item.ModelID == ID })[0];

                var default_value = {
                    ModelNo: cat.ModelNo,
                    ModelName: cat.ModelName,
                    MeasureRange: cat.MeasureRange,
                    Cost: cat.Cost,
                    Accuracy: cat.Accuracy,
                    Mistake: cat.Mistake,
                    Environment: cat.Environment,
                    CalibrationLevel: cat.CalibrationLevel,
                    CalibrationBasis: cat.CalibrationBasis,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {

                    if (!rst || $.isEmptyObject(rst))
                        return;

                    cat.ModelNo = rst.ModelNo;
                    cat.ModelName = rst.ModelName;
                    cat.MeasureRange = rst.MeasureRange;
                    cat.Cost = rst.Cost;
                    cat.Accuracy = rst.Accuracy;
                    cat.ModelName = rst.ModelName;
                    cat.Mistake = rst.Mistake;
                    cat.Environment = rst.Environment;
                    cat.CalibrationLevel = rst.CalibrationLevel;
                    cat.CalibrationBasis = rst.CalibrationBasis;

                    $com.util.deleteLowerProperty(cat);

                    _this.postDeviceModelUpdate({
                        data: cat,
                    }, function (res) {

                        _this.refresh();
                        alert("修改成功");
                    });

                }, TypeSource_Level));

            },
            //激活、禁用
            MeaTypeActive: function (ID, ActiveID) {

                var SelectData = _this.GradeSource.filter((item) => { return item.ModelID == ID });

                $com.util.deleteLowerProperty(SelectData);
                _this.modelActive({
                    data: SelectData,
                    Active: ActiveID
                }, function (res) {
                    alert("操作完成");
                    _this.refresh();
                });
            },



            //新增量具类型
            addMeaType: function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "新增", function (rst) {

                    if (!rst || $.isEmptyObject(rst))
                        return;

                    var _data = {
                        ModelNo: rst.ModelNo,
                        ModelName: rst.ModelName,
                        WorkType: _this.MeasuringTypeID,
                        WorkTypeName: "",
                        ModelPropertyID: 0,
                        SupplierName: 0,
                        SupplierModelNo: 1,
                        ID: 0,
                        SystemPropertyID: 0,
                        SystemName: 0,
                        SystemVersion: 0,
                        ControllerPropertyID: 0,
                        ControllerName: 0,
                        ControllerModel: 0,
                        // Cost: 0,
                        Life: 0,
                        LimitCount: 0,
                        StockNum: 0,
                        WarningCycle: 0,
                        WarningNum: 0,
                        Type: 3,


                        MeasureRange: rst.MeasureRange,
                        Cost: rst.Cost,
                        Accuracy: rst.Accuracy,
                        Mistake: rst.Mistake,
                        Environment: rst.Environment,
                        CalibrationLevel: rst.CalibrationLevel,
                        CalibrationBasis: rst.CalibrationBasis,
                    };

                    _this.postDeviceModelUpdate({
                        data: _data,
                    }, function (res) {

                        _this.refresh();

                        alert("新增成功");
                    });

                }, TypeSource_Level));

            },

            //删除量具
            deleteTableInfo: function (ID) {

                var cat = _this.GradeItemSource.filter((item) => { return item.ID == ID });


                $("body").append($com.modal.show(DEFAULT_VALUE_Level_Order, KEYWORD_Level_Order, "新增", function (rst) {

                    if (!rst || $.isEmptyObject(rst))
                        return;


                    var _data = {
                        Name: rst.Name,
                        DeviceNo: rst.Name,
                        DeviceLife: rst.DeviceLife,
                        ScrapValue: rst.ScrapValue,

                        ApplyID: 0,
                        AssetID: 0,
                        BaseID: 0,
                        BusinessUnitID: 0,
                        FactoryID: 1,
                        ID: 0,
                        LimitCount: 0,
                        LineID: 0,
                        ModelID: 0,
                        NetValue: 0,
                        PositionID: 0,
                        Status: 0,
                        WorkShopID: 0,

                        Type: 3
                    };

                    _this.postDeviceLedgerUpdate({
                        data: _data,
                    }, function (res) {

                        _this.refresh();
                        alert("新增成功");
                    });

                }, TypeSource_Level_Order));

            },



            getMaterialMarginAndLL: function (ID) {

                var cat = _this.GradeItemSource.filter((item) => { return item.ID == ID })[0];



                var default_value = {
                    Name: cat.Name,
                    Code: cat.Code,
                    OwnerID: cat.OwnerID,
                    BorrowerID: cat.BorrowerID,
                    BorrowTime: cat.BorrowTime,
                    FirstTime: cat.FirstTime,
                    NextCalibrationDate: cat.NextCalibrationDate,
                    ManufacturerNo: cat.ManufacturerNo,
                    ModelDemand: cat.ModelDemand,
                    CalibrationManufacturer: cat.CalibrationManufacturer,
                    CalibrationPersonID: cat.CalibrationPersonID,
                    CalibrationDate: cat.CalibrationDate,
                    CalibrationNo: cat.CalibrationNo,
                    DeviceID: cat.DeviceID,


                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level_Order, "修改", function (rst) {

                    if (!rst || $.isEmptyObject(rst))
                        return;

                    cat.Name = rst.Name;
                    cat.Code = rst.Code;
                    cat.OwnerID = rst.OwnerID;
                    cat.BorrowerID = rst.BorrowerID;
                    cat.BorrowTime = rst.BorrowTime;
                    cat.FirstTime = rst.FirstTime;
                    cat.NextCalibrationDate = rst.NextCalibrationDate;
                    cat.ManufacturerNo = rst.ManufacturerNo;
                    cat.ModelDemand = rst.ModelDemand;
                    cat.CalibrationManufacturer = rst.CalibrationManufacturer;
                    cat.CalibrationPersonID = rst.CalibrationPersonID;
                    cat.CalibrationDate = rst.CalibrationDate;
                    cat.CalibrationNo = rst.CalibrationNo;
                    cat.DeviceID = rst.DeviceID;

                    $com.util.deleteLowerProperty(cat);

                    _this.postDeviceLedgerUpdate({
                        data: cat,
                    }, function (res) {

                        _this.refresh();
                        alert("修改成功");
                    });

                }, TypeSource_Level_Order, function () {

                }, "",
                    {
                        BorrowTime: "48%",
                        FirstTime: "48%",
                        NextCalibrationDate: "48%",
                    }));

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
            searchLevelProduct: function () {
                var value = $("#lmvt-Product-level").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-Product-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-Product-tbody"), _this.OrderGrade, value, "WID");
            },

            //模糊查询
            searchLevelProductEnter: function () {
                if (event.keyCode == 13) {
                    var $this = $(this);
                    var value = $("#lmvt-Product-level").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-Product-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-Product-tbody"), _this.OrderGrade, value, "WID");
                }


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
            //加工类型激活/禁用
            workActive: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceWorkType/Active",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //加工类型激活/禁用
            // workActive: function (data, fn, context) {
            //     var d = {
            //         $URI: "/MeasureModel/All",
            //         $TYPE: "post"
            //     };

            //     function err() {
            //         $com.app.tip('获取失败，请检查网络');
            //     }

            //     $com.app.ajax($.extend(d, data), fn, err, context);
            // },


            //激活规则
            addCalibrationLevelActive: function (data, fn, context) {
                var d = {
                    $URI: "/CalibrationLevel/Active",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);

            },

            //添加规则
            addCalibrationLevelUpdate: function (data, fn, context) {
                var d = {
                    $URI: "/CalibrationLevel/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);

            },

            //添加工作类型
            addType: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceWorkType/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);

            },

            //规则登记
            getCalibrationLevelAll: function (data, fn, context) {
                var d = {
                    $URI: "/CalibrationLevel/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //量具类型列表
            getDeviceWorkTypeAll: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceWorkType/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //设备型号激活/禁用
            modelActive: function (data, fn, context) {
                var d = {
                    $URI: "/MeasureModel/Active",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //所有设备信息
            getMeasureModelAll: function (data, fn, context) {
                var d = {
                    $URI: "/MeasureModel/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);

            },

            //导入
            postImportExcel: function (data, fn, context) {
                var d = {
                    $URI: "/Upload/ImportExcel",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax_load(data ? $.extend(data, d) : $.extend(d, data), fn, err, context);
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
            //设备列表
            getDeviceLedgerAll: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceLedger/All",
                    $TYPE: "get",

                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询量具列表
            getMeasuring: function (data, fn, context) {
                var d = {
                    $URI: "/MeasureLedger/All",
                    $TYPE: "get",

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

            //类型提交
            postDeviceModelUpdate: function (data, fn, context) {
                var d = {
                    $URI: "/MeasureModel/Update",
                    $TYPE: "post"
                };
                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //提交
            postDeviceLedgerUpdate: function (data, fn, context) {
                var d = {
                    $URI: "/MeasureLedger/Update",
                    $TYPE: "post"
                };
                function err() {
                    $com.app.tip('提交失败，请检查网络');
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
