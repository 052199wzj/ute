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
        cat,
        StockListOne = [],
        HTML;

    (function () {

        $(".ds-search-top-contain").resize(function (e) {
            var $this = $(this);
            var _SearchShowMode = $this.attr("data-show-mode");

            if (_SearchShowMode == 0) {
                var _MaxLength = this.offsetWidth - 10;
                var _Length = $this.children(".ds-search-btn-group")[0].offsetWidth + 60;
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
            var wTarget = this.offsetHeight;
            // 设置div
            var height = "100% - " + wTarget + "px";
            $this.closest(".ds-search-top").css("height", wTarget + "px");
            $this.closest(".ds-search-top").next(".ds-contain-middle").css("height", "calc( " + height + ")");
        });

        KEYWORD_Level_LIST = [
            "StockName|仓库名称|ArrayOne",
            "LocationName|仓位名称|ArrayOne",
            "StockStatusNo|物料状态|ArrayOne",
            "FQTY|入库数量",
        ];
        KEYWORD_Level = {};
        FORMATTRT_Level = {};

        DEFAULT_VALUE_Level = {
            StockName: 0,
            LocationName: 0,
            StockStatusNo: "",
            FQTY: 0,
        };

        TypeSource_Level = {
            StockStatusNo: [
                {
                    name: "可用",
                    value: "KCZT01_SYS"
                }, {
                    name: "待检",
                    value: "KCZT02_SYS"
                }, {
                    name: "冻结",
                    value: "KCZT03_SYS"
                }, {
                    name: "退回冻结",
                    value: "KCZT04_SYS"
                }, {
                    name: "在途",
                    value: "KCZT05_SYS"
                }, {
                    name: "收货冻结",
                    value: "KCZT06_SYS"
                }, {
                    name: "废品",
                    value: "KCZT07_SYS"
                }, {
                    name: "不良",
                    value: "KCZT08_SYS"
                }, {
                    name: "不参与核算",
                    value: "KCZT001_SYS"
                }
            ],

            StockName: [],
            LocationName: [],
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

    var app = new Vue({
        el: '#lmvt-vueApp',
        data: {

            // StyleGrade: {
            //     "width": "100%",
            //     "float": "left",
            //     "padding-right": "0px"
            // },
            // StyleItemGrade: {
            //     "width": "70%",
            //     "float": "left",
            //     "padding-right": "10px"
            // },

            ERPOrderList: [],

            Grade: [],
            OrderSource: [],

            GradeItem: [],
            GradeItemSource: [],

            ERPShow: false,
            GradeItemISShow: false,

            GradeISShow: true,

            RouteISShow: false,
            DragLineISShow: false,

            GradeID: 0,

            StartTime: $com.util.format("yyyy-MM-dd", new Date().getTime() - 7 * 3600000 * 24),
            EndTime: $com.util.format("yyyy-MM-dd", new Date().getTime() + 1 * 3600000 * 24),
            ComNo: "",

            OrderView: "订单集合",

            ReStoreTas: true,
            ReStoreHis: false,

            GradeItemHis: false,

            //职能
            FunctionID: 1,
            OrderID: "",
            //车间集合
            WorkShopList: [],
            WorkShopID: 1,
            DateList: [],
            //元数据
            GradeSource: [],
            //班组
            TeamList: [],

            NowTime: new Date(),

            //状态
            StatusMenu: {
                1: "待入库",
                2: "已入库"
            },
            WorkNoList: [],
            TableSourceList: [],
            //仓库仓位信息
            StoreList: [],
            //入库对象
            ERPInventoryObj: {},
            // cat: {},
            StatusList:
            {
                "KCZT01_SYS": "10000",
                "KCZT02_SYS": "10001",
                "KCZT03_SYS": "10002",

                "KCZT04_SYS": "10003",
                "KCZT05_SYS": "10004",
                "KCZT06_SYS": "10005",

                "KCZT07_SYS": "10006",

                "KCZT08_SYS": "10257",
                "KCZT001_SYS": "138649",
            },
            StatusHisList:
            {
                "10000": "可用",
                "10001": "待检",
                "10002": "冻结",
                "10003": "退回冻结",
                "10004": "在途",
                "10005": "收货冻结",
                "10006": "废品",
                "10257": "不良",
                "138649": "不参与核算",
            },
            StatusNameList:
            {
                "KCZT01_SYS": "可用",
                "KCZT02_SYS": "待检",
                "KCZT03_SYS": "冻结",

                "KCZT04_SYS": "退回冻结",
                "KCZT05_SYS": "在途",
                "KCZT06_SYS": "收货冻结",

                "KCZT07_SYS": "废品",

                "KCZT08_SYS": "不良",
                "KCZT001_SYS": "不参与核算",
            },
            //入库记录
            GradeHis: [],
            HisObj: {},
            HisStoreList: [],
            WorkNoHis: "",
            HisMaterialName: "",
            HisStoreSource: [],
        },
        beforeCreate() {
            _this = this;
        },

        created: function () {



            var VueThis = this;

            $("body").delegate(".modal .femi-modal-body .femi-modal-item select#modal_select_StockName", "change", function (e) {
                var $this = $(this),
                    StockID = Number($this.val());

                var $SelectPartID = $("#modal_select_LocationName"),
                    SELECT_OPTION_HTML_PartID = '<option value="{{value}}">{{name}}</option>',
                    FormList = [];

                $.each(cat[StockID], function (i, item) {
                    FormList.push({
                        name: item.LocationName,
                        value: item.LocationID
                    });
                });
                $SelectPartID.empty();
                $SelectPartID.append($com.util.template(FormList, SELECT_OPTION_HTML_PartID));
                $SelectPartID.selectpicker('render');
                $SelectPartID.selectpicker('refresh');
                $SelectPartID.selectpicker();

                // $("#modal_select_PartID").val(0).trigger('change');
            });


            VueThis.postQueryWorkNoList({
                OrderNos: [0]
            }, function (res) {

                if (res.list.length > 0) {
                    _this.WorkNoList = res.list;
                    _this.$nextTick(function () {
                        $("#WorkNoSelect").selectpicker({});
                    })
                } else {
                    alert("未查询到工作号信息");
                }
            });

            _this.getQueryLocationList({

            }, function (RERPList) {

                ERPSource = $com.util.Clone(RERPList.list);

                ERPList = $com.util.Clone(RERPList.list);

                //去重的仓库
                cat = {};

                $.each(ERPList, function (i, item) {
                    if (!cat[item.StockID]) {
                        StockListOne.push(item);
                        cat[item.StockID] = [];

                        $.each(ERPList, function (j, jtem) {
                            if (item.StockID == jtem.StockID) {
                                cat[item.StockID].push(jtem);
                                return true;
                            }
                        });
                    }
                });

                $.each(StockListOne, function (i, item) {
                    TypeSource_Level.StockName.push({
                        name: item.StockName,
                        value: item.StockID
                    })
                });
                $.each(cat[StockListOne[0].StockID], function (i, item) {
                    TypeSource_Level.LocationName.push({
                        name: item.LocationName,
                        value: item.LocationID
                    })
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
                    _this.StartTime = $("#lmvt-startTime").val();

                    $("#lmvt-endTime").datetimepicker("setStartDate", _this.StartTime.toString("yyyy-MM-dd"));
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

                    _this.EndTime = $("#lmvt-endTime").val();
                    $("#lmvt-startTime").datetimepicker("setEndDate", _this.EndTime.toString("yyyy-MM-dd"));
                });

                VueThis.refresh();
            });


        },

        methods: {

            //入库记录
            getRestoreList: function () {
                $com.app.loading("加载中");
                _this.ReStoreTas = false;
                _this.ReStoreHis = true;
                _this.getQueryInstockListByLoginID({
                    StatusList: [2],
                    StartTime: _this.StartTime,
                    EndTime: _this.EndTime,
                }, function (res) {

                    _this.HisStoreSource = res.list;

                    $.each(res.list, function (i, item) {
                        item.badge = " ";
                        item.CreateTime = $com.util.format("yyyy-MM-dd hh:mm:ss", item.CreateTime);
                        item.WID = i + 1;
                    });
                    _this.GradeHis = res.list;
                    $com.app.loaded();
                });
            },

            //保存
            Save: function () {

                var Counts = 0;
                _this.ERPInventoryObj.SubmitERPList = [];

                $.each(_this.StoreList, function (i, item) {
                    if (!item.FQTY || item.FQTY == 0 || item.FQTY == "") {
                        return true;
                    }

                    Counts += item.FQTY;
                    item.ID = 0;
                    _this.ERPInventoryObj.ItemEntryList.push(item);
                });

                if (Counts != _this.ERPInventoryObj.FQTYTotal) {
                    alert("未入完库或入库数量大于入库总数，请检查后再试!!!");
                    return false;
                }

                var WorkNo = $("#WorkNoSelect").find("option:selected").val();

                if (WorkNo == "" || WorkNo.length <= 0) {
                    alert("工作号未选择");
                    return false;
                }
                _this.ERPInventoryObj.WorkNo = WorkNo;
                $com.util.deleteLowerProperty(_this.ERPInventoryObj);
                _this.ERPInventoryObj.Status = 2;
                $com.app.loading("保存中");
                _this.postSaveInstock({
                    data: _this.ERPInventoryObj
                }, function (data) {
                    $com.app.loaded();
                    alert("入库成功");

                    $(".ds-contain-top").css("width", "100%");
                    $(".ds-contain-top").css("float", "left");
                    $(".ds-contain-top").css("padding-right", "0px");
                    _this.GradeItemISShow = false;
                    _this.refresh();
                });

            },

            //返回
            Hisback: function () {
                _this.ReStoreTas = true;
                _this.ReStoreHis = false;
            },

            //入库记录
            getHisInfo: function (OBJ) {

                $(".His-contain-top").css("width", "70%");
                $(".His-contain-top").css("float", "left");
                $(".His-contain-top").css("padding-right", "10px");
                $(".His-contain-top").css("padding-right", "10px");

                _this.GradeItemHis = true;

                $com.app.loading("加载中");
                this.getWMSInstockQueryInstockHis({
                    ID: OBJ.ID
                }, function (data) {

                    _this.HisMaterialName = "(" + OBJ.MaterialName + ")"

                    $.each(_this.WorkNoList, function (i, item) {
                        if (item.WorkNo == OBJ.WorkNo) {
                            _this.WorkNoHis = item.WorkText;
                        }
                    });

                    $.each(data.info.ItemEntryList, function (i, item) {
                        item.WID = i + 1;
                        item.badge = " ";
                        item.CreateTime = $com.util.format("yyyy-MM-dd hh:mm:ss", item.CreateTime);
                    });

                    _this.HisStoreList = data.info.ItemEntryList;

                    $com.app.loaded();
                });

            },

            //开始入库
            getOrderInfo: function (OBJ) {

                if (OBJ.MaterialNo == "") {
                    alert("物料数据不存在，无法入库");
                    return false;
                }

                $(".ds-contain-top").css("width", "70%");
                $(".ds-contain-top").css("float", "left");
                $(".ds-contain-top").css("padding-right", "10px");
                _this.GradeItemISShow = true;

                _this.ERPInventoryObj = OBJ;
                $com.app.loading("加载中");
                _this.postQueryERPInventoryList({
                    data: OBJ.MaterialNo,
                    ShowEmpty: true
                }, function (ERPRes) {

                    StoreList = ERPRes.list;

                    $.each(StoreList, function (i, item) {
                        item.WID = i + 1;
                    });

                    _this.StoreList = StoreList;
                    $com.app.loaded();
                });
            },
            //新增
            StockAdd: function () {

                var Counts = 0;

                $.each(_this.StoreList, function (i, item) {
                    if (item.FQTY)
                        Counts += item.FQTY;
                });

                DEFAULT_VALUE_Level.FQTY = _this.ERPInventoryObj.FQTYTotal - Counts;

                $("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    var obj = ERPSource.filter((item) => { return item.StockID == Number(rst.StockName) && item.LocationID == Number(rst.LocationName) })[0];
                    // var SelectData = _this.GradeSource.filter((item) => { return item.IndexID == ID });
                    var _data = {
                        ID: 0,
                        TaskID: _this.ERPInventoryObj.ID,
                        FQTY: rst.FQTY,
                        EntryTaskID: _this.ERPInventoryObj.EntryTaskID,
                        FlotText: "",
                        StockStatus: _this.StatusList[rst.StockStatusNo],
                        StockID: Number(rst.StockName),
                        StockNo: obj.StockNo,
                        StockName: obj.StockName,
                        LocationID: obj.LocationID,
                        LocationNo: obj.LocationNo,
                        LocationName: obj.LocationName,
                        StockStatusNo: rst.StockStatusNo,
                        LocationFlexNumber: obj.FlexNumber,
                        Status: 2
                    };

                    var cat = _this.StoreList;

                    cat.push(_data);
                    $.each(cat, function (i, item) {
                        item.WID = i + 1;
                    });

                    _this.StoreList = cat;

                }, TypeSource_Level, function (rst) {
                    var msg = "";
                    if (rst.FQTY == "" || Number(rst.FQTY) == 0) {
                        msg = "入库数量不能为零";
                    }
                    return msg;
                }));
            },

            DeleteStoreList: function (WID) {
                var obj = (_this.StoreList || []).findIndex((profile) => profile.WID === WID);

                _this.StoreList.splice(obj, 1);
                $.each(_this.StoreList, function (i, item) {
                    item.WID = i + 1;
                });
            },
            ChangeStoreList: function (WID) {

                var obj = _this.StoreList.filter((item) => { return item.WID == WID })[0];

                var def = {
                    StockName: obj.StockID,
                    LocationName: obj.LocationID,
                    StockStatusNo: obj.StockStatusNo,
                    FQTY: obj.FQTY ? Number(obj.FQTY) : 0,
                }
                TypeSource_Level.LocationName = [];
                $.each(cat[obj.StockID], function (i, item) {
                    TypeSource_Level.LocationName.push({
                        name: item.LocationName,
                        value: item.LocationID
                    })
                });

                $("body").append($com.modal.show(def, KEYWORD_Level, "修改", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    var index = (_this.StoreList || []).findIndex((profile) => profile.WID === WID);

                    var objCat = ERPSource.filter((item) => { return item.StockID == Number(rst.StockName) && item.LocationID == Number(rst.LocationName) })[0];

                    var cat = $com.util.Clone(_this.StoreList);

                    cat[index].StockStatus = _this.StatusList[rst.StockStatusNo];
                    cat[index].StockID = Number(rst.StockName);
                    cat[index].StockNo = objCat.StockNo;
                    cat[index].StockName = objCat.StockName;
                    cat[index].LocationID = objCat.LocationID;
                    cat[index].LocationNo = objCat.LocationNo;
                    cat[index].LocationName = objCat.LocationName;
                    cat[index].StockStatusNo = rst.StockStatusNo;
                    cat[index].LocationFlexNumber = objCat.FlexNumber;
                    cat[index].FQTY = Number(rst.FQTY);

                    _this.StoreList = cat;

                }, TypeSource_Level, function (rst) {
                    var msg = "";
                    if (rst.FQTY == "" || Number(rst.FQTY) == 0) {
                        msg = "入库数量不能为零";
                    }
                    return msg;
                }));
            },

            //验证两个日期是否在一个数字内
            GetDays: function (startDate, endDate) {
                var days;
                days = (new Date(endDate) - new Date(startDate)) / 1000 / 60 / 60 / 24;

                return days;
            },
            //快捷删除班组
            DeleteTeamID: function (TeamID, ID) {
                var SelectData = _this.GradeSource.filter((item) => { return item.IndexID == ID });

                if (!confirm("是否移除该班组？")) {
                    return false;
                }

                $.each(SelectData[0].TeamIDList, function (i, item) {
                    if (item == TeamID) {
                        SelectData[0].TeamIDList.splice(i, 1);
                        return false;
                    }
                });
                $com.util.deleteLowerProperty(SelectData[0]);

                _this.postAPSPersonScheduleUpdate({
                    data: SelectData,
                }, function (res) {

                    alert("删除成功");
                    _this.refresh();
                })
            },

            gantInfo: function (item) {

                var vdata = { 'header': '生产计划', 'href': './product_plan/PlanNowOrderLOCO.html?OrderID=' + item.ID + "&WorkShopID=" + item.WorkShopID, 'id': '2032', 'src': '/MESCore/upload/web/周计划.svg' };

                window.parent.iframeHeaderSet(vdata);

                window.callFunctionTrigger("PlanNowOrderLOCO", { OrderID: item.ID, WorkShopID: item.WorkShopID });

            },

            reset: function () {

                _this.StartTime = $com.util.format("yyyy-MM-dd", new Date().getTime() - 7 * 3600000 * 24),
                    _this.EndTime = $com.util.format("yyyy-MM-dd", new Date().getTime() + 7 * 3600000 * 24),

                    _this.ComNo = "";
                _this.WorkShopID = 1
            },

            //所有订单
            AllOrder: function () {
                if (_this.OrderView == "订单集合") {
                    _this.OrderView = "单条订单"
                    _this.refreshItem(-1);
                }

                else {
                    _this.OrderView = "订单集合"
                    _this.refreshItem(_this.GradeID);
                }

            },

            JudgTime: function (_Time) {
                var result = false;

                result = new Date($com.util.format("yyyy-MM-dd", _Time)) >= new Date($com.util.format("yyyy-MM-dd", new Date()));

                return result;
            },

            postSaveInstock: function (data, fn, context) {
                var d = {
                    $URI: "/WMSInstock/SaveInstock",
                    $TYPE: "post",
                    $SERVER: "/iPlantWMS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            getQueryLocationList: function (data, fn, context) {
                var d = {
                    $URI: "/ERPLocation/QueryLocationList",
                    $TYPE: "get",
                    $SERVER: "/iPlantERP"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            postQueryERPInventoryList: function (data, fn, context) {
                var d = {
                    $URI: "/ERPInventory/QueryERPInventoryList",
                    $TYPE: "post",
                    $SERVER: "/iPlantERP"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            postQueryWorkNoList: function (data, fn, context) {
                var d = {
                    $URI: "/ERPInstock/QueryWorkNoList",
                    $TYPE: "post",
                    $SERVER: "/iPlantERP"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            refresh: function () {
                $com.app.loading('数据加载中！！');
                this.postQueryInstockListByLoginID({
                    StatusList: [1]
                }, function (resP) {

                    if (!resP)
                        return;
                    if (resP && resP.list) {

                        var Grade = $com.util.Clone(resP.list);


                        $.each(Grade, function (i, item) {
                            item.WID = i + 1;
                            item.badge = " ";
                            item.CreateTime = $com.util.format("yyyy-MM-dd hh:mm:ss", item.CreateTime);
                        });

                        _this.GradeSource = $com.util.Clone(Grade);
                        // $.each(Grade, function (i, item) {
                        //     item.WID = i + 1;
                        //     item.badge = " ";
                        //     item.CreateTime = $com.util.format("yyyy-MM-dd hh:mm:ss", item.CreateTime);
                        // });

                        _this.Grade = Grade;
                        // _this.$nextTick(function () {
                        //     $("#femi-riskLevelOrder-tbody").find("td[data-title]").attr("rowspan", 1);
                        //     $("#femi-riskLevelOrder-tbody").find("td[data-title]").show();
                        //     $com.table.formatterRowspan($("#femi-riskLevelOrder-tbody"), 1, 5);
                        //     $(window).resize();
                        // })

                        // _this.Grade = ArrangeList;


                        // $.each(ArrangeList, function (i, item) {
                        //     $.each(item.DateList, function (j, jtem) {
                        //         if (((new Date(jtem.ShiftDate) > _this.NowTime))) {
                        //             console.log(jtem.ID);
                        //         } else {
                        //             console.log(jtem.ID);
                        //         }
                        //     });
                        // });

                        // _this.$nextTick(function () {
                        //     $("#femi-riskLevelOrder-tbody").find("td[data-title]").attr("rowspan", 1);
                        //     $("#femi-riskLevelOrder-tbody").find("td[data-title]").show();
                        //     $com.table.formatterRowspan($("#femi-riskLevelOrder-tbody"), 1, 5);
                        //     // $(window).resize();
                        // })
                    };

                    $com.app.loaded();

                });
            },

            //按钮点击
            searchlevelProGradeHis: function () {
                var $this = $(this);
                var value = $("#zace-searchHis").val();
                $com.table.filterByLikeString($("#femi-riskLevel-tbody"), _this.HisStoreSource, value, "WID", undefined, undefined, function (res) {
                    _this.GradeHis = res;
                });

            },
            //按钮点击
            searchlevelProGrade: function () {

                var value = $("#zace-search").val();
                $com.table.filterByLikeString($("#femi-riskLevelOrder-tbody"), _this.GradeSource, value, "WID", undefined, undefined, function (res) {
                    _this.Grade = res;
                });

            },
            searchLevelHis: function (e) {

                if (e.keyCode == 13) {

                    var $this = $(this);
                    var value = $("#zace-searchHis").val();
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), _this.HisStoreSource, value, "WID", undefined, undefined, function (res) {
                        _this.GradeHis = res;
                    });

                }
            },
            //模糊查询
            searchLevel: function (e) {

                if (e.keyCode == 13) {

                    var $this = $(this);
                    var value = $("#zace-search").val();
                    $com.table.filterByLikeString($("#femi-riskLevelOrder-tbody"), _this.GradeSource, value, "WID", undefined, undefined, function (res) {
                        _this.Grade = res;
                    });
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

            getWMSInstockQueryInstockHis: function (data, fn, context) {
                var d = {
                    $URI: "/WMSInstock/QueryInstock",
                    $TYPE: "get",
                    $SERVER: "/iPlantWMS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            getQueryInstockListByLoginID: function (data, fn, context) {
                var d = {
                    $URI: "/WMSInstock/QueryInstockListByLoginID",
                    $TYPE: "post",
                    $SERVER: "/iPlantWMS"
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
            //查询班组列表
            getTeamManageAll: function (data, fn, context) {
                var d = {
                    $URI: "/TeamManage/All",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //车间作息
            getFMCWorkDayAll: function (data, fn, context) {
                var d = {
                    $URI: "/FMCWorkDay/info",
                    $TYPE: "get",
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
            postQueryInstockListByLoginID: function (data, fn, context) {
                var d = {
                    $URI: "/WMSInstock/QueryInstockListByLoginID",
                    $TYPE: "post",
                    $SERVER: "/iPlantWMS"
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
            postAPSPersonScheduleUpdate: function (data, fn, context) {
                var d = {
                    $URI: "/APSPersonSchedule/Update",
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
        },

    });
});