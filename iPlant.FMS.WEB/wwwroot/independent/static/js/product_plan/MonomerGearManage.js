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
            "Name|单体分档*",
            "Code|单体分级*",
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

            StartTime: $com.util.format("yyyy-MM-dd", new Date().getTime() - 2 * 3600000 * 24),
            EndTime: $com.util.format("yyyy-MM-dd", new Date().getTime() + 7 * 3600000 * 24),
            ComNo: "",

            OrderView: "订单集合",

            ActiveType:
            {
                0: "默认",
                1: "在用",
                2: "填制",
            },

            ActiveMenu:
            {
                0: "默认",
                1: "激活",
                2: "禁用",
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

            //分档ID
            ClassificationID: -1
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

            gantInfo: function (item) {

                var vdata = { 'header': '生产计划', 'href': './product_plan/PlanNowOrderLOCO.html?OrderID=' + item.ID + "&WorkShopID=" + item.WorkShopID, 'id': '2032', 'src': '/MESCore/upload/web/周计划.svg' };

                window.parent.iframeHeaderSet(vdata);

                window.callFunctionTrigger("PlanNowOrderLOCO", { OrderID: item.ID, WorkShopID: item.WorkShopID });

            },

            reset: function () {

                _this.StartTime = $com.util.format("yyyy-MM-dd", new Date().getTime() - 7 * 3600000 * 24),
                    _this.EndTime = $com.util.format("yyyy-MM-dd", new Date().getTime() + 7 * 3600000 * 24),

                    _this.ProductNo = "";

                _this.WorkShopID = 1;
                // alert("重置成功");
                // $("#ProductNoSelect").selectpicker('refresh');
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
            //新增规则
            MonInfoAdd: function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    var _data = {
                        Code: rst.Code,
                        Name: rst.Name,
                        Remark: rst.Remark,
                        ClassificationID: _this.ClassificationID,
                        SDTop: rst.SDTop,
                        SDBottom: rst.SDBottom,
                        StandardSDType: rst.StandardSDType,
                        VolTop: rst.VolTop,
                        VolBottom: rst.VolBottom,
                        StandardVolType: rst.StandardVolType,
                        ResistanceTop: rst.ResistanceTop,
                        ResistanceBottom: rst.ResistanceBottom,
                        StandardResistanceType: rst.StandardResistanceType,
                    }

                    _this.postFPCProductLevelUpdate({
                        data: _data,
                    }, function (res) {
                        alert("新增成功");
                        _this.GetItemSource();
                    });

                }, TypeSource_Level, function (rst) {
                    var msg = "";
                    var SDTop = Number(SDTop);
                    var SDBottom = Number(SDBottom);
                    var VolTop = Number(VolTop);
                    var VolBottom = Number(VolBottom);
                    var ResistanceTop = Number(ResistanceTop);
                    var ResistanceBottom = Number(ResistanceBottom);
                    if (SDBottom > SDTop) {
                        msg += "SD内容上下限配置错误";
                    }
                    if (VolBottom > VolTop) {
                        msg += "容量上下限配置错误";
                    }
                    if (ResistanceBottom > ResistanceTop) {
                        msg += "内阻上下限配置错误";
                    }
                }
                ));

            },
            //批量激活
            ActiveGrade: function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevelOrder-tbodyMon"), "ID", _this.GradeItemSource);

                if (SelectData.length <= 0) {
                    alert("请至少选择一条数据");
                    return false;
                }

                $com.util.deleteLowerProperty(SelectData);

                _this.postFPCProductLevelActive({
                    data: SelectData,
                    Active: 1
                }, function (res) {
                    alert("激活成功");
                    _this.GetItemSource();
                });

            },
            //批量禁用
            ForbiddenGrade: function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevelOrder-tbodyMon"), "ID", _this.GradeItemSource);

                if (SelectData.length <= 0) {
                    alert("请至少选择一条数据");
                    return false;
                }

                $com.util.deleteLowerProperty(SelectData);

                _this.postFPCProductLevelActive({
                    data: SelectData,
                    Active: 2
                }, function (res) {
                    alert("禁用成功");
                    _this.GetItemSource();
                });
            },
            //修改详情
            ChangeMonIn: function (ID) {
                var SelectData = _this.GradeItemSource.filter((item) => { return item.ID == ID })[0];

                var DEFAULT_VALUE = {
                    Code: SelectData.Code,
                    Name: SelectData.Name,
                    StandardSDType: SelectData.StandardSDType,
                    SDTop: SelectData.SDTop,
                    SDBottom: SelectData.SDBottom,
                    StandardVolType: SelectData.StandardVolType,
                    VolTop: SelectData.VolTop,
                    VolBottom: SelectData.VolBottom,
                    StandardResistanceType: SelectData.StandardResistanceType,
                    ResistanceTop: SelectData.ResistanceTop,
                    ResistanceBottom: SelectData.ResistanceBottom,
                    Remark: SelectData.Remark,

                }

                $("body").append($com.modal.show(DEFAULT_VALUE, KEYWORD_Level, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    SelectData.Code = rst.Code;
                    SelectData.Name = rst.Name;
                    SelectData.Remark = rst.Remark;
                    SelectData.ClassificationID = _this.ClassificationID;
                    SelectData.SDTop = rst.SDTop;
                    SelectData.SDBottom = rst.SDBottom;
                    SelectData.StandardSDType = rst.StandardSDType;
                    SelectData.VolTop = rst.VolTop;
                    SelectData.VolBottom = rst.VolBottom;
                    SelectData.StandardVolType = rst.StandardVolType;
                    SelectData.ResistanceTop = rst.ResistanceTop;
                    SelectData.ResistanceBottom = rst.ResistanceBottom;
                    SelectData.StandardResistanceType = rst.StandardResistanceType;


                    $com.util.deleteLowerProperty(SelectData);

                    _this.postFPCProductLevelUpdate({
                        data: SelectData,
                    }, function (res) {
                        alert("修改成功");
                        _this.GetItemSource();
                    });

                }, TypeSource_Level, function (rst) {
                    var msg = "";
                    var SDTop = Number(SDTop);
                    var SDBottom = Number(SDBottom);
                    var VolTop = Number(VolTop);
                    var VolBottom = Number(VolBottom);
                    var ResistanceTop = Number(ResistanceTop);
                    var ResistanceBottom = Number(ResistanceBottom);
                    if (SDBottom > SDTop) {
                        msg += "SD内容上下限配置错误";
                    }
                    if (VolBottom > VolTop) {
                        msg += "容量上下限配置错误";
                    }
                    if (ResistanceBottom > ResistanceTop) {
                        msg += "内阻上下限配置错误";
                    }
                }
                ));

            },
            //修改表体
            ChangeTableTR: function (ID) {

                var SelectData = _this.GradeSource.filter((item) => { return item.ID == ID })[0];

                var DEFAULT_VALUE = {
                    Code: SelectData.Code,
                    Name: SelectData.Name,
                    Remark: SelectData.Remark,
                    ProductNo: SelectData.ProductID
                }

                $("body").append($com.modal.show(DEFAULT_VALUE, KEYWORD_Level_Order, "修改", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    SelectData.Code = rst.Code;
                    SelectData.Name = rst.Name;
                    SelectData.Remark = rst.Remark;
                    SelectData.ProductID = rst.ProductNo;

                    $com.util.deleteLowerProperty(SelectData);

                    _this.postFPCProductClassificationUpdate({
                        data: SelectData,
                    }, function (res) {

                        alert("修改成功");
                        _this.refresh();
                    })

                }, TypeSource_Level_Order));

            },

            //导入分档
            Import: function () {
                $("#input-file").val("");
                $("#input-file").click();
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
                    if (res.list.length > 0) {

                        var ImportList = $com.table.postExportParams(res.list, $(".table-partApprovalMon"));

                        var _data = [];

                        $.each(ImportList, function (i, item) {
                            if (i == 0)
                                return true;
                            _data.push({
                                Code: item.Code,
                                Name: item.Name,
                                Remark: item.Remark,
                                ProductID: TypeSource_Level_Order.ProductNo.filter((jtem) => { return jtem.name == item.ProductNo })[0].value,
                                ProductLevelList: [],
                                Active: 0,
                            });
                        });

                        _this.postFPCProductClassificationUpdateList({
                            data: _data,
                        }, function (res) {

                            alert("导入成功");
                            _this.refresh();
                        })

                        $com.app.loaded();

                    } else {
                        alert("导入表格有误，请检查后重新导入！");
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

            //导入规则
            ImportMonInfo: function () {
                $("#input-fileMon").val("");
                $("#input-fileMon").click();
            },
            //导入规则
            InputFileInfoClick: function (el) {
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
                    if (res.list.length > 0) {
                        var ImportList = $com.table.postExportParams(res.list, $(".table-partApproval"));
                        var _data = {};

                        var imList = [];
                        $.each(res.list, function (i, item) {

                            var CloneObj = {};

                            for (const key in item) {
                                if (i == 0) {
                                    switch (key) {
                                        case "SD上限":
                                            _data["SDTop"] = "SD上限";
                                            break;
                                        case "SD下限":
                                            _data["SDBottom"] = "SD下限";
                                            break;
                                        case "SD类型":
                                            _data["StandardSDType"] = "SD类型";
                                            break;
                                        case "容量类型":
                                            _data["StandardVolType"] = "容量类型";
                                            break;
                                        case "容量上限":
                                            _data["VolTop"] = "容量上限";
                                            break;
                                        case "容量下限":
                                            _data["VolBottom"] = "容量下限";
                                            break;
                                        case "内阻类型":
                                            _data["StandardResistanceType"] = "内阻类型";
                                            break;
                                        case "内阻上限":
                                            _data["ResistanceTop"] = "内阻上限";
                                            break;
                                        case "内阻下限":
                                            _data["ResistanceBottom"] = "内阻下限";
                                            break;
                                        case "备注":
                                            _data["Remark"] = "备注";
                                            break;
                                        case "单体分级":
                                            _data["Code"] = "单体分级";
                                            break;
                                        case "单体分档":
                                            _data["Name"] = "单体分档";
                                            break;
                                    }
                                } else {
                                    for (const p in _data) {
                                        if (key == _data[p]) {
                                            CloneObj[p] = item[key];
                                        }
                                    }
                                }
                            }

                            if (i != 0)
                                imList.push(CloneObj);

                        });

                        var SubmitList = $com.util.Clone(imList);

                        $.each(SubmitList, function (i, item) {
                            item.ClassificationID = _this.ClassificationID;
                            item.StandardSDType = TypeSource_Level.StandardSDType.filter((jtem) => { return jtem.name == item.StandardSDType })[0].value;
                            item.StandardVolType = TypeSource_Level.StandardVolType.filter((jtem) => { return jtem.name == item.StandardVolType })[0].value;
                            item.StandardResistanceType = TypeSource_Level.StandardResistanceType.filter((jtem) => { return jtem.name == item.StandardResistanceType })[0].value;
                        });

                        _this.postFPCProductLevelUpdateList({
                            data: SubmitList,
                        }, function (res) {
                            alert("导入成功");
                            _this.GetItemSource();
                        }, function () {
                            _this.GetItemSource();
                        })

                        $com.app.loaded();

                    } else {
                        alert("导入表格有误，请检查后重新导入！");
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

            //导出
            Export: function () {
                var $table = $(".table-partApprovalMon"),
                    fileName = "单体分档列表.xls",
                    Title = "单体分档列表";
                var params = $com.table.getExportParams($table, fileName, Title, _this.Grade);

                if (params.data.length < 1) {
                    alert('请选择需要导出的数据！');
                    return false;
                }

                _this.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });

            },

            //导出规则
            ExportMonInfo: function () {
                var params = {};

                var ImData = $com.util.Clone(_this.GradeItem);

                $.each(ImData, function (i, item) {
                    item.StandardSDType = FORMATTRT_Level["StandardSDType"](item.StandardSDType);
                    item.StandardVolType = FORMATTRT_Level["StandardVolType"](item.StandardVolType);
                    item.StandardResistanceType = FORMATTRT_Level["StandardResistanceType"](item.StandardResistanceType);
                });

                params.data = ImData;
                params.fileName = _this.OrderView + "分档规则.xls";
                params.head = {
                    WID: "序号",
                    Code: "单体分档",
                    Name: "单体分级",
                    StandardSDType: "SD类型",
                    SDTop: "SD上限",
                    SDBottom: "SD下限",
                    StandardVolType: "容量类型",
                    VolTop: "容量上限",
                    VolBottom: "容量下限",
                    StandardResistanceType: "内阻类型",
                    ResistanceTop: "内阻上限",
                    ResistanceBottom: "内阻下限",
                    Remark: "备注",
                }
                params.order = ["WID", "Code", "Name", "StandardSDType", "SDTop", "SDBottom", "StandardVolType", "VolTop", "VolBottom", "StandardResistanceType", "ResistanceTop", "ResistanceBottom", "Remark"];
                params.title = _this.OrderView + "分档规则";

                if (params.data.length < 1) {
                    alert('请选择需要导出的数据！');
                    return false;
                }

                _this.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });

            },

            //删除信息
            deleteMoInfo: function (ID) {
                var SelectData = _this.GradeItemSource.filter((item) => { return item.ID == ID })[0];

                if (!confirm("已选择单体分档为 [" + SelectData.Code + "] 的数据，是否删除？")) {
                    return;
                }

                _this.postFPCProductLevelDelete({
                    data: SelectData,
                }, function (res) {

                    alert("删除成功");
                    _this.GetItemSource();
                });
            },

            //批量删除
            DeleteItemGrade: function (ID) {
                // var SelectData = _this.GradeItemSource.filter((item) => { return item.ID == ID });

                var SelectData = $com.table.getSelectionData($("#femi-riskLevelOrder-tbodyMon"), "ID", _this.GradeItemSource);

                if (!confirm("已选择 [" + SelectData.length + "] 条数据，是否删除？")) {
                    return;
                }
                $com.util.deleteLowerProperty(SelectData);
                $.each(SelectData, function (i, item) {
                    _this.postFPCProductLevelDelete({
                        data: SelectData[i],
                    }, function (res) {
                        if (i = SelectData.length - 1) {
                            alert("删除成功");
                            _this.GetItemSource();
                        }
                    });
                });

            },


            // TrcEach: function (source, fn) {

            // },

            //删除数据
            deleteTableInfo: function (ID) {

                var SelectData = _this.GradeSource.filter((item) => { return item.ID == ID })[0];

                if (!confirm("已选择分类标识为 [" + SelectData.Code + "] 的数据，是否删除？")) {
                    return;
                }

                _this.postFPCProductClassificationDelete({
                    data: SelectData,
                }, function (res) {

                    alert("删除成功");
                    _this.refresh();
                })
            },

            //规则列表
            getOrderInfo: function (ID, Code) {
                _this.OrderView = Code;
                _this.GradeISShow = false;
                _this.GradeItemISShow = true;
                _this.ClassificationID = ID
                _this.GetItemSource();
            },

            //获取所有的规则
            GetItemSource: function () {
                $com.app.loading('数据加载中！！');
                _this.getFPCProductLevelAll({
                    ClassificationID: _this.ClassificationID,
                }, function (res) {
                    _this.GradeItem = $com.util.Clone(res.list);
                    _this.GradeItemSource = $com.util.Clone(res.list);



                    $.each(_this.GradeItem, function (i, item) {
                        item.WID = i + 1;

                        item.Badge = " ";

                        item.SDShow = _this.CountStandard(item.SDTop, item.SDBottom, item.StandardSDType);
                        item.VolShow = _this.CountStandard(item.VolTop, item.VolBottom, item.StandardVolType);
                        item.ResistanceShow = _this.CountStandard(item.ResistanceTop, item.ResistanceBottom, item.StandardResistanceType);

                    });

                    $com.app.loaded();
                })
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

                $com.app.loaded();
            },
            //查看详情
            refresh: function () {
                $com.app.loading('数据加载中！！');
                // ProductID: _this.ProductID, ProductNo: _this.ProductNo, MaterialNo: _this.MaterialNo
                this.getFPCProductClassificationAll({ ProductNo: _this.ProductNo }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {

                        // if()
                        var Grade = $com.util.Clone(resP.list);
                        _this.GradeSource = $com.util.Clone(resP.list);
                        $.each(Grade, function (i, item) {

                            item.WID = i + 1;
                            item.Badge = " ";

                            // item.CreatorID = _this.UserAll.filter((item) => { return item.ID == item.CreatorID })[0].Name;
                            // item.EditorID = _this.UserAll.filter((item) => { return item.ID == item.EditorID })[0].Name;
                            item.CreateTime = $com.util.format("yyyy-MM-dd", item.CreateTime);
                            item.EditTime = $com.util.format("yyyy-MM-dd", item.EditTime);
                        });

                        _this.Grade = Grade;

                        // _this.getDateList();
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
            //导入
            postImportExcel: function (data, fn, context) {
                var d = {
                    $URI: "/Upload/ImportExcel",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax_load(data ? $.extend(data, d) : $.extend(d, data), fn, err, context);
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
            //新增规则集合
            postFPCProductLevelUpdateList: function (data, fn, context) {
                var d = {
                    $URI: "/FPCProductLevel/UpdateList",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //激活规则集合
            postFPCProductLevelActive: function (data, fn, context) {
                var d = {
                    $URI: "/FPCProductLevel/Active",
                    $TYPE: "post"
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
            getFPCProductClassificationAll: function (data, fn, context) {
                var d = {
                    $URI: "/FPCProductClassification/All",
                    $TYPE: "get",
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

            //保存多条
            postFPCProductClassificationUpdateList: function (data, fn, context) {
                var d = {
                    $URI: "/FPCProductClassification/UpdateList",
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