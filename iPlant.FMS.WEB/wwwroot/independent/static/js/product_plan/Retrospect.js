require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/route_new', '../static/utils/js/base/tooltip', '../static/utils/js/base/Vue', '../static/utils/js/base/paging'], function ($zace, $com, $route, $tooltip, Vue, $page) {

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
            "Code|单体分档*",
            "Name|单体分级*",
            "StandardSDType|SD类型|ArrayOne",
            "SDTop|SD上限",
            "SDBottom|SD下限",

            "StandardVolType|容量类型|ArrayOne",
            "VolTop|容量上限",
            "VolBottom|容量下限",

            "StandardResistanceType|内阻类型|ArrayOne",
            "ResistanceTop|内阻上限",
            "ResistanceBottom|内阻下限",

            "Remark|备注"
        ];
        KEYWORD_Level = {};
        FORMATTRT_Level = {};

        DEFAULT_VALUE_Level = {
            Code: "",
            Name: "",
            StandardSDType: 0,
            SDTop: 0,
            SDBottom: 0,
            StandardVolType: 0,
            VolTop: 0,
            VolBottom: 0,
            StandardResistanceType: 0,
            ResistanceTop: 0,
            ResistanceBottom: 0,
            Remark: ""
        };

        TypeSource_Level = {

            StandardSDType: [
                {
                    name: "全开区间",
                    value: 2
                },
                {
                    name: "全包区间",
                    value: 3
                },
                {
                    name: "右包区间",
                    value: 4
                },
                {
                    name: "左包区间",
                    value: 5
                }
            ],
            StandardVolType: [
                {
                    name: "全开区间",
                    value: 2
                },
                {
                    name: "全包区间",
                    value: 3
                },
                {
                    name: "右包区间",
                    value: 4
                },
                {
                    name: "左包区间",
                    value: 5
                }
            ],
            StandardResistanceType: [
                {
                    name: "全开区间",
                    value: 2
                },
                {
                    name: "全包区间",
                    value: 3
                },
                {
                    name: "右包区间",
                    value: 4
                },
                {
                    name: "左包区间",
                    value: 5
                }
            ],

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
            "Code|分类标识*",
            "Name|分类描述*",
            "ProductNo|产品规格|ArrayOne",
            "Remark|分类说明",
        ];
        KEYWORD_Level_Order = {};
        FORMATTRT_Level_Order = {};

        DEFAULT_VALUE_Level_Order = {
            Code: "",
            Name: "",
            ProductNo: 0,
            Remark: ""
        };

        TypeSource_Level_Order = {
            ProductNo: [
            ],
            ProductTypeID: []
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

            StartTime: $com.util.format("yyyy-MM-dd", new Date().getTime() - 5 * 3600000 * 24),
            EndTime: $com.util.format("yyyy-MM-dd", new Date().getTime() + 1 * 3600000 * 24),
            ComNo: "",

            OrderView: "电容包",

            ActiveType:
            {
                0: "默认",
                1: "在用",
                2: "填制",
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
            UserAll: window.parent._UserAll,

            ProductNo: "",
            BalancePlateNo: "",
            ModuleNo: "",
            //分档ID
            ClassificationID: -1,

            AllMonList: [],

            CheckInfoList: [],
        },
        beforeCreate() {
            _this = this;
        },

        created: function () {
            var VueThis = this;

            VueThis.getFPCProductType({ BusinessUnitID: 0 }, function (resP) {
                $.each(resP.list, function (i, item) {
                    TypeSource_Level_Order.ProductTypeID.push({
                        name: item.Name,
                        value: item.ID,
                    });
                });
            });
            VueThis.getFPCProduct({ ProductTypeID: 0, BusinessUnitID: 0, Active: 1 }, function (resP) {

                $.each(resP.list, function (i, item) {
                    $("#ProductNoSelect").append("<option value=" + item.ProductNo + ">" + item.ProductNo + "</option>");
                });
                $("#ProductNoSelect").selectpicker('deselectAll');
                $("#ProductNoSelect").selectpicker('refresh');

                // $("#ProductNoSelect").empty();
                $.each(resP.list, function (i, item) {
                    TypeSource_Level_Order.ProductNo.push({
                        name: item.ProductNo,
                        value: item.ID,
                    });
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
            });
            VueThis.refresh();
            // VueThis.getFMCLine({ FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0 }, function (resP) {
            //     if (!resP)
            //         return;

            //     $.each(resP.list, function (i, item) {
            //         TypeSource_Level.LineID.push({
            //             value: item.ID,
            //             name: item.Name
            //         });
            //     });
            //     TypeSource_Level_Order.FactoryID = TypeSource_Level.LineID;
            //     VueThis.getCustomer({ active: 2 }, function (resP) {
            //         if (!resP)
            //             return;

            //         $.each(resP.list, function (i, item) {
            //             TypeSource_Level.BureauSectionID.push({
            //                 value: item.ID,
            //                 name: item.CustomerName
            //             });
            //         });
            //         TypeSource_Level_Order.CustomerID = TypeSource_Level.BureauSectionID;
            //         VueThis.getFPCProduct({ ProductTypeID: 0, BusinessUnitID: 0 }, function (resP) {
            //             if (!resP)
            //                 return;

            //             $.each(resP.list, function (i, item) {

            //                 if (item.Active == 1) {
            //                     TypeSource_Level.ProductID.push({
            //                         value: item.ID,
            //                         name: item.ProductNo
            //                     });
            //                 }

            //             });
            //             TypeSource_Level_Order.BusinessUnitID = TypeSource_Level.ProductID;


            //             $(document).ready(function () {
            //                 //_this.StartTime = $com.util.format("yyyy-MM-dd hh:mm", new Date().getTime() - 7 * 3600000 * 24);
            //                 //_this.EndTime = $com.util.format("yyyy-MM-dd hh:mm", new Date());
            //                 $("#lmvt-startTime").datetimepicker({
            //                     format: 'yyyy-mm-dd',//显示格式
            //                     // startView: 2,
            //                     minView: 2,
            //                     maxView: 2,
            //                     language: 'zh-CN',
            //                     autoclose: 1,//选择后自动关闭
            //                     clearBtn: false,//清除按钮
            //                 }).on('changeDate', function (ev) {
            //                     _this.StartTime = $("#lmvt-startTime").val();

            //                     $("#lmvt-endTime").datetimepicker("setStartDate", _this.StartTime.toString("yyyy-MM-dd"));
            //                 });
            //                 $("#lmvt-endTime").datetimepicker({
            //                     format: 'yyyy-mm-dd',//显示格式
            //                     // startView: 2,
            //                     minView: 2,
            //                     maxView: 2,
            //                     language: 'zh-CN',
            //                     autoclose: 1,//选择后自动关闭
            //                     clearBtn: false,//清除按钮
            //                 }).on('changeDate', function (ev) {

            //                     _this.EndTime = $("#lmvt-endTime").val();
            //                     $("#lmvt-startTime").datetimepicker("setEndDate", _this.EndTime.toString("yyyy-MM-dd"));
            //                 });

            //                 _this.getFMCWorkShop({}, function (res) {

            //                     $("#WorkShopSelect").ready(function () {
            //                         $("#WorkShopSelect").selectpicker('refresh');
            //                     });

            //                     _this.WorkShopList = res.list;


            //                 });


            //             });
            //         });
            //     });
            // });
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
            
            //判断显示字段
            CheckTitleShow: function (item) {

                _this.CheckInfoList = [];
                // var reg = /^[\u4E00-\u9FA5]+$/;
                var reg = /.*[\u4e00-\u9fa5]+.*$/;
               
                for (const key in item) {
                    if (reg.test(key) && key != "电容包编码") {
                        _this.CheckInfoList.push({
                            name: key,
                            value: item[key]
                        });
                    }
                }
            },

            reset: function () {

                _this.StartTime = $com.util.format("yyyy-MM-dd", new Date().getTime() - 7 * 3600000 * 24);
                _this.EndTime = $com.util.format("yyyy-MM-dd", new Date().getTime() + 7 * 3600000 * 24);

                _this.ProductNo = "";

                _this.WorkShopID = 1;
            },

            //规则列表
            getOrderInfo: function (ID, Code) {
                _this.OrderView = Code;


                //_this.ModuleNo = obj.ModulePartNo;
                //选择已经存在的模组编码
                var LastCode = Code.charAt(Code.length - 1);
                if (Number(LastCode) % 2 == 0) {
                    _this.ModuleNo = "JA2010C1047";
                } else {
                    _this.ModuleNo = "JA2010C1052";
                }

                _this.GradeISShow = false;
                _this.GradeItemISShow = true;
                _this.ClassificationID = ID

                var obj = _this.Grade.filter((item) => { return item.WID == ID })[0];
                _this.CheckInfoObj = _this.Grade.filter((item) => { return item.WID == ID })[0];

                _this.GetItemSource();

                _this.getSFCTaskIPTTableAll({ ModulePartNo: _this.OrderView, LineID: 1, TaskType: 6 }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {

                        _this.CheckTitleShow(resP.list[0]);

                    };

                    $com.app.loaded();

                });

            },

            //获取所有的规则
            GetItemSource: function () {
                $com.app.loading('数据加载中！！');
                _this.getResultAll({
                    StartTime: "2010-01-01", EndTime: "2010-01-01",
                    BalancePlateNo: _this.BalancePlateNo, ModuleNo: _this.ModuleNo, ProductNo: "",
                    Active: -1
                }, function (res) {
                    _this.GradeItem = $com.util.Clone(res.list);
                    _this.GradeItemSource = $com.util.Clone(res.list);

                    $.each(_this.GradeItem, function (i, item) {
                        item.WID = i + 1;

                        item.SDShow = _this.CountStandard(item.SDTop, item.SDBottom, item.StandardSDType);
                        item.VolShow = _this.CountStandard(item.VolTop, item.VolBottom, item.StandardVolType);
                        item.ResistanceShow = _this.CountStandard(item.ResistanceTop, item.ResistanceBottom, item.StandardResistanceType);

                    });

                    _this.$nextTick(function () {
                        $(window).resize();
                    })
                    $com.app.loaded();
                });
            },

            //运算
            CountStandard: function (SDTop, SDBottom, number) {
                var standardString;
                switch (number) {
                    case 2: standardString = "范围：" + SDBottom + "＜" + " n " + "＜" + SDTop; break;
                    case 3: standardString = "范围：" + SDBottom + "≤" + " n " + "≤" + SDTop; break;
                    case 4: standardString = "范围：" + SDBottom + "＜" + " n " + "≤" + SDTop; break;
                    case 5: standardString = "范围：" + SDBottom + "≤" + " n " + "＜" + SDTop; break;
                    default: break;
                }
                return standardString;
            },

            //新增
            MonAdd: function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_Level_Order, KEYWORD_Level_Order, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    var _data = {
                        ID: 0,
                        Code: rst.Code,
                        Name: rst.Name,
                        Remark: rst.Remark,
                        ProductID: rst.ProductNo,
                        ProductLevelList: [],
                        Active: 0,
                    }

                    _this.postFPCProductClassificationUpdate({
                        data: _data,
                    }, function (res) {

                        alert("新增成功");
                        _this.refresh();
                    })

                }, TypeSource_Level_Order));
            },
            //查询
            Search: function () {
                $com.app.loading('数据加载中！！');

                // _this.ProductNo = $("#ProductNoSelect").find("option:selected").val();

                _this.refresh();

                // $com.app.loaded();
            },
            //查看详情
            refresh: function () {
                $com.app.loading('数据加载中！！');
                // ProductID: _this.ProductID, ProductNo: _this.ProductNo, MaterialNo: _this.MaterialNo
                _this.getSFCTaskIPTTableAll({ ModulePartNo: _this.ModuleNo, LineID: 1, TaskType: 6, StartTime: _this.StartTime, EndTime: _this.EndTime }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {

                        // if()
                        var Grade = $com.util.Clone(resP.list);
                        _this.GradeSource = $com.util.Clone(resP.list);
                        $.each(Grade, function (i, item) {

                            item.WID = i + 1;
                            item.Badge = " ";

                            //item.CreatorID = UserAll.filter((item) => { return item.ID == item.CreatorID })[0].Name;
                            //item.EditorID = UserAll.filter((item) => { return item.ID == item.EditorID })[0].Name;
                            item.CreateTime = $com.util.format("yyyy-MM-dd", item.CreateTime);
                            item.EditTime = $com.util.format("yyyy-MM-dd", item.EditTime);
                        });

                        // _this.Grade = Grade;

                        _this.AllMonList = Grade;

                        $page.init($(".table-partApprovalCheck"), Grade, "", function (res) {
                            _this.Grade = res;
                        });
                    };

                    $com.app.loaded();

                });
            },
            //激活
            ActiveMon: function (ID, ActiveNumber) {
                var SelectData = _this.GradeSource.filter((item) => { return item.ID == ID })[0];

                _this.postFPCProductClassificationActive({
                    data: SelectData,
                    Active: ActiveNumber
                }, function (res) {

                    alert("修改成功");
                    _this.refresh();
                })

            },
            //禁用
            forMon: function (ID) {
                var SelectData = _this.GradeSource.filter((item) => { return item.ID == ID })[0];



            },
            //按钮点击
            searchLevelPro: function () {
                var value = $("#zace-search-level").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $page.init($(".table-partApprovalCheck"), _this.AllMonList, "", function (resp) {
                        _this.Grade = resp;
                    });
                else
                    $com.table.filterByLikeStringData($("#femi-riskLevelOrder-tbodyMon"), _this.AllMonList, value, undefined, undefined, undefined, function (res) {
                        $page.init($(".table-partApprovalCheck"), res, "", function (resp) {
                            _this.Grade = resp;
                            $(window).resize();
                        });
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

            getResultAll: function (data, fn, context) {
                var d = {
                    $URI: "/ModuleInformation/ResultAll",
                    $TYPE: "get",
                    $SERVER: "/MESQMS"
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
            //查询产品类别列表
            getFPCProductType: function (data, fn, context) {
                var d = {
                    $URI: "/FPCProductType/All",
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
            postFPCProductLevelUpdate: function (data, fn, context) {
                var d = {
                    $URI: "/FPCProductLevel/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //规则列表
            getFPCProductLevelAll: function (data, fn, context) {
                var d = {
                    $URI: "/FPCProductLevel/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //删除规则
            postFPCProductLevelDelete: function (data, fn, context) {
                var d = {
                    $URI: "/FPCProductLevel/Delete",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //激活禁用
            postFPCProductClassificationActive: function (data, fn, context) {
                var d = {
                    $URI: "/FPCProductClassification/Active",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //删除
            postFPCProductClassificationDelete: function (data, fn, context) {
                var d = {
                    $URI: "/FPCProductClassification/Delete",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //单体分档参数列表
            getSFCTaskIPTTableAll: function (data, fn, context) {
                var d = {
                    $URI: "/SFCTaskIPT/TableAll",
                    $TYPE: "get",
                    $SERVER: "/MESQMS"
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
            postFPCProductClassificationUpdate: function (data, fn, context) {
                var d = {
                    $URI: "/FPCProductClassification/Update",
                    $TYPE: "post",
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