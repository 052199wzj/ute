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

            "ISTimePush|班组时间顺延|ArrayOne",
            "ISPartPush|班组工序顺延|ArrayOne",
            "Name|班组名称*|Array",
        ];
        KEYWORD_Level_Order = {};
        FORMATTRT_Level_Order = {};

        DEFAULT_VALUE_Level_Order = {
            Name: [1],
            ISTimePush: 0,
            ISPartPush: 1,
        };

        TypeSource_Level_Order = {
            Name: [],
            ISTimePush: [
                {
                    name: "否",
                    value: 0
                }, {
                    name: "是",
                    value: 1
                }
            ],
            ISPartPush: [
                {
                    name: "否",
                    value: 0
                }, {
                    name: "是",
                    value: 1
                }
            ]
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

            StartTime: $com.util.format("yyyy-MM-dd", new Date().getTime() - 2 * 3600000 * 24),
            EndTime: $com.util.format("yyyy-MM-dd", new Date().getTime() + 7 * 3600000 * 24),
            ComNo: "",

            OrderView: "订单集合",

            ShfitIndexList:
            {
                1: "白班",
                2: "中班",
                3: "晚班",
            },

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
        },
        beforeCreate() {
            _this = this;
        },

        created: function () {
            var VueThis = this;

            $("body").delegate(".modal .femi-modal-body .femi-modal-item select#modal_select_ISTimePush", "change", function (e) {
                var $this = $(this),
                    ISTimePush = Number($this.val());
                if (ISTimePush == 0 && $(".lmvt-push-times")) {
                    $(".lmvt-push-times").hide();
                }
                else {
                    if ($(".lmvt-push-times").length <= 0) {
                        var Times = "<div class='femi-modal-item lmvt-push-times'> <label class='m-detail-title'>顺延天数*</label>" +
                            "<input type='Number' class='form-control' data-name='Times' placeholder='顺延天数*' value=''>" +
                            "</div>";
                        var $SelectPartID = $("#modal_select_ISTimePush").next();
                        $SelectPartID.after(Times);
                    } else {
                        $(".lmvt-push-times").show();
                    }
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

                            _this.getFMCWorkShop({}, function (res) {

                                $("#WorkShopSelect").ready(function () {
                                    $("#WorkShopSelect").selectpicker('refresh');
                                });

                                _this.WorkShopList = res.list;

                                VueThis.refresh();
                            });


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
            // VueThis.getTeamManageAll({ WorkShopID: _this.WorkShopID, Active: 1, HasItem: 1,ModuleID:1 }, function (res) {
            VueThis.getTeamManageAll({ WorkShopID: _this.WorkShopID, Active: 1, HasItem: 1 }, function (res) {
                if (res.list.length > 0) {
                    _this.TeamList = res.list;

                    $.each(res.list, function (i, item) {

                        TypeSource_Level_Order.Name.push({
                            name: item.Name,
                            value: item.ID,
                            TeamItemList: item.TeamItemList
                        });

                    });

                } else {
                    alert("未查询到激活的班组列表")
                }
            });

        },

        methods: {

            //获取所有的日期
            getDateList: function () {

                var start = new Date(_this.StartTime.replace(/-/g, "/"));

                var end = new Date(_this.EndTime.replace(/-/g, "/"));
                _this.DateList = [];
                do {

                    _this.DateList.push(start.getFullYear() + "-" + (start.getMonth() + 1) + "-" + start.getDate());
                    start.setDate(start.getDate() + 1);

                } while (end >= start)

            },
            //校验是否能够放置班组

            CheckISCouldHead: function (TeamArr, SelectData, TypeSource_Level) {

                var arr = [];

                for (let index = TypeSource_Level.Name.length - 1; index >= 0; index--) {
                    if (TypeSource_Level.Name[index].TeamItemList.length > 0) {
                        $.each(TypeSource_Level.Name[index].TeamItemList, function (i, item) {
                            if (item.PartID == SelectData.PartID && item.LineID == SelectData.LineID && item.ModuleID == SelectData.FunctionID) {
                                if (TeamArr.length <= 0)
                                    arr.push(TypeSource_Level.Name[index]);
                                else {
                                    $.each(TeamArr, function (m, mtem) {
                                        if (mtem == item.TeamID) {
                                            arr.push(TypeSource_Level.Name[index]);
                                        }
                                    });
                                }
                                return false;
                            }
                        });
                    }
                }
                return arr;
            },

            //修改班组
            ChangeTeamID: function (ID) {

                var SelectData = _this.GradeSource.filter((item) => { return item.IndexID == ID });

                var TypeSource_Level = $com.util.Clone(TypeSource_Level_Order);

                var arr = _this.CheckISCouldHead([], SelectData[0], TypeSource_Level);

                TypeSource_Level.Name = arr;

                if (SelectData[0].TeamIDList.length > 0) {
                    DEFAULT_VALUE_Level_Order.Name = SelectData[0].TeamIDList;
                } else {
                    if (arr.length <= 0) {
                        alert("当前工序未配置班组，请配置后重新再试！！！");
                        return false;
                    }
                    DEFAULT_VALUE_Level_Order.Name = arr[0].value;
                }

                $("body").append($com.modal.show(DEFAULT_VALUE_Level_Order, KEYWORD_Level_Order, "修改", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    if (rst.Times && Number(rst.ISTimePush) == 1 && Number(rst.Times) > 0) {
                        $.each(_this.GradeSource, function (i, item) {
                            if (item.OrderID == SelectData[0].OrderID && item.PartID == SelectData[0].PartID && SelectData[0].IndexID != item.IndexID && SelectData[0].ShiftIndex == item.ShiftIndex) {
                                var days = _this.GetDays(SelectData[0].ShiftDate, item.ShiftDate);
                                if (days >= 0 && days <= Number(rst.Times)) {
                                    item.TeamIDList = rst.Name;
                                    SelectData.push(item);
                                }
                            }
                        });
                    }

                    if (Number(rst.ISPartPush) == 1) {
                        $.each(_this.GradeSource, function (i, item) {

                            $.each(SelectData, function (j, jtem) {
                                if (item.OrderID == jtem.OrderID && jtem.IndexID != item.IndexID && jtem.ShiftIndex == item.ShiftIndex && jtem.ShiftDate == item.ShiftDate) {
                                    var array = [];
                                    array = _this.CheckISCouldHead(rst.Name, item, TypeSource_Level);
                                    if (array.length > 0) {
                                        item.TeamIDList = rst.Name;
                                        SelectData.push(item);
                                    }
                                }
                            });
                        });
                    }

                    SelectData[0].TeamIDList = rst.Name;

                    $com.util.deleteLowerProperty(SelectData);

                    _this.postAPSPersonScheduleUpdate({
                        data: SelectData,
                    }, function (res) {

                        alert("新增成功");
                        _this.refresh();
                    })

                }, TypeSource_Level));
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

            refresh: function () {
                $com.app.loading('数据加载中！！');
                this.getAPSPersonScheduleCreateAll({ FunctionID: _this.FunctionID, OrderNo: _this.ComNo, WorkShopID: _this.WorkShopID, StartTime: _this.StartTime, EndTime: _this.EndTime }, function (resP) {

                    if (!resP)
                        return;
                    if (resP && resP.list) {

                        var Grade = $com.util.Clone(resP.list);
                        _this.GradeSource = $com.util.Clone(resP.list);
                        var cat = {},
                            ArrangeList = [];

                        $.each(_this.GradeSource, function (i, item) {
                            item.IndexID = i + 1;
                        });
                        $.each(Grade, function (i, item) {

                            item.IndexID = i + 1;

                            // item.ProgressNow = item.PartFinish/item.PartPlan;
                            // OrderFinish}}/{{item.OrderPlan
                            item.ProgressNow = (item.OrderFinish / item.OrderPlan) * 100;

                            if (item.TeamIDList.length > 0) {
                                item.TeamShowList = [];
                                $.each(item.TeamIDList, function (j, jtem) {
                                    item.TeamShowList.push({
                                        Name: _this.TeamList.filter((item) => { return item.ID == jtem })[0].Name,
                                        ID: jtem
                                    });
                                    // item.TeamIDList[j] = _this.TeamList.filter((item) => { return item.ID == jtem })[0].Name;
                                });
                            }

                            if (!cat[item.OrderID + "-" + item.PartID + item.ShiftIndex]) {
                                cat[item.OrderID + "-" + item.PartID + item.ShiftIndex] = [];
                                cat[item.OrderID + "-" + item.PartID + item.ShiftIndex].push({
                                    TeamText: item.TeamShowList,
                                    ID: item.IndexID,
                                    ShiftDate: item.ShiftDate,
                                    Status: item.Status,
                                    PlanNum: item.PlanNum,
                                    Progress: "(" + item.FinishNum + "/" + item.PlanNum + ")"
                                });
                                ArrangeList.push(item);
                            } else {
                                cat[item.OrderID + "-" + item.PartID + item.ShiftIndex].push({
                                    TeamText: item.TeamShowList,
                                    ID: item.IndexID,
                                    ShiftDate: item.ShiftDate,
                                    Status: item.Status,
                                    Status: item.Status,
                                    PlanNum: item.PlanNum,
                                    Progress: "(" + item.FinishNum + "/" + item.PlanNum + ")"
                                });
                            }
                        });

                        $.each(ArrangeList, function (i, item) {
                            item.WID = i + 1;
                            if (cat[item.OrderID + "-" + item.PartID + item.ShiftIndex]) {
                                item.DateList = cat[item.OrderID + "-" + item.PartID + item.ShiftIndex];
                            }
                        });

                        _this.Grade = ArrangeList;
                        _this.$nextTick(function () {
                            $("#femi-riskLevelOrder-tbody").find("td[data-title]").attr("rowspan", 1);
                            $("#femi-riskLevelOrder-tbody").find("td[data-title]").show();
                            $com.table.formatterRowspan($("#femi-riskLevelOrder-tbody"), 1, 5);
                            $(window).resize();
                        })

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
                        _this.getDateList();
                    };

                    $com.app.loaded();

                });
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
            getAPSPersonScheduleCreateAll: function (data, fn, context) {
                var d = {
                    $URI: "/APSPersonSchedule/CreateAll",
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