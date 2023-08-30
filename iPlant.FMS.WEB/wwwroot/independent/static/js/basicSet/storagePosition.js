require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'],
    function ($lin, $com) {

        var HTML,
            Start,
            End,
            orderList_source,
            DataOrder_source,
            ERPStockID,
            StockSourceID,
            SaveData,
            StatusID,
            StatusText,
            default_source,
            ERPLocationAll_source,
            DataERPLocationAll_source,
            DataSource_Post,
            TypeSource,
            temp,

            storageList_source,
            DataStorage_source,
            MaterialNumber,

            DEFAULT_VALUE_Time,
            KETWROD_LIST_Time,
            KETWROD_Template_Time,
            Formattrt_Time,
            TypeSource_Time,

            DEFAULT_VALUE_Status,
            KETWROD_LIST_Status,
            KETWROD_Template_Status,
            Formattrt_Status,
            TypeSource_Status;

        HTML = {
            StorageList: [
                '<tr>',
                '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></th>',
                '<td style="min-width: 50px" data-title="DisplayID" data-value="{{DisplayID}}" >{{DisplayID}}</td>',
                '<td style="min-width: 80px" data-title="MaterialNo" data-value="{{MaterialNo}}" >{{ MaterialNo}}</td>',
                '<td style="min-width: 50px" data-title="MaterialName" data-value="{{MaterialName}}" >{{ MaterialName}}</td>',
                '<td style="min-width: 50px" data-title="ProductNo" data-value="{{ProductNo}}" >{{ ProductNo}}</td>',
                '<tr>',
            ].join(""),

            OrderList: [
                '<tr>',
                '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></th>',
                '<td style="min-width: 50px" data-title="DisplayID" data-value="{{DisplayID}}" >{{DisplayID}}</td>',
                '<td style="min-width: 80px" data-title="StockName" data-value="{{StockName}}" >{{ StockName}}</td>',
                '<td style="min-width: 50px" data-title="LocationName" data-value="{{LocationName}}" >{{ LocationName}}</td>',
                '<td style="min-width: 50px" data-title="StockStatusText" data-value="{{StockStatusText}}" >{{ StockStatusText}}</td>',
                '<td style="min-width: 50px" data-title="Active" data-value="{{Active}}" >{{Active}}</td>',
                '<tr>',
            ].join(""),

            BottomList: [
                '<tr>',
                '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></th>',
                '<td style="min-width: 50px" data-title="StockName" data-value="{{StockName}}" >{{StockName}}</td>',
                '<td style="min-width: 80px" data-title="LocationName" data-value="{{LocationName}}" >{{ LocationName}}</td>',
                '<tr>',
            ].join(""),
        };
        ERPStockID = [];

        //任务排班
        DEFAULT_VALUE_Time = {
            startTime: new Date(new Date().getTime() - 86400000 * 30),
            endTime: new Date(),
        };
        (function () {

            KETWROD_LIST_Time = [
                "startTime|开始时间|DateTime",
                "endTime|结束时间|DateTime",
            ];

            KETWROD_Template_Time = {};

            Formattrt_Time = {};

            TypeSource_Time = {};

            $.each(KETWROD_LIST_Time, function (i, item) {
                var detail = item.split("|");
                KETWROD_Template_Time[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined,
                };

                if (detail.length > 2) {
                    Formattrt_Time[detail[0]] = $com.util.getFormatter(TypeSource_Time, detail[0], detail[2]);
                }
            });
        })();
        //状态修改
        DEFAULT_VALUE_Status = {
            Status: "",
        };
        (function () {

            KETWROD_LIST_Status = [
                "Status|状态|ArrayOne",
            ];

            KETWROD_Template_Status = {};

            Formattrt_Status = {};

            TypeSource_Status = {
                Status: [
                    {
                        name: "合格",
                        value: 226962,
                    },
                    {
                        name: "可用",
                        value: 10000,
                    },
                    {
                        name: "废品",
                        value: 10006,
                    },
                    {
                        name: "回用",
                        value: 225492,
                    },
                    {
                        name: "工序废",
                        value: 225493,
                    },
                    {
                        name: "降级",
                        value: 225494,
                    },
                ],
            };

            $.each(KETWROD_LIST_Status, function (i, item) {
                var detail = item.split("|");
                KETWROD_Template_Status[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined,
                };

                if (detail.length > 2) {
                    Formattrt_Status[detail[0]] = $com.util.getFormatter(TypeSource_Status, detail[0], detail[2]);
                }
            });
        })();

        TypeSource = {
            MaterialName: [
                {
                    name: "",
                    value: 0,
                },
            ],
        };
        MaterialNumber = "";
        model = $com.Model.create({
            name: '入库仓位',

            type: $com.Model.MAIN,

            configure: function () {
                this.run();
            },

            events: function () {
                //指定仓位
                $("body").delegate("#lmvt-right-distribute", "click", function () {
                    $(".changeName").text("默认");
                    $(".lmvt-container-bottom").show();
                    model.com.Default();
                });
                //默认仓位
                $("body").delegate("#lmvt-default", "click", function () {
                    $(".changeName").text("默认");
                    model.com.Default();
                });
                //显示各种仓位
                $("body").delegate("#lmvt-material", "click", function () {
                    $(".changeName").text("原材料库");
                    StockSourceID = ERPStockID[0].StockID;
                    model.com.refresh();
                });
                $("body").delegate("#lmvt-finished", "click", function () {
                    $(".changeName").text("成品库");
                    StockSourceID = ERPStockID[1].StockID;
                    model.com.refresh();
                });
                $("body").delegate("#lmvt-work", "click", function () {
                    $(".changeName").text("工装库");
                    StockSourceID = ERPStockID[2].StockID;
                    model.com.refresh();
                });
                $("body").delegate("#lmvt-assist", "click", function () {
                    $(".changeName").text("辅材库");
                    StockSourceID = ERPStockID[3].StockID;
                    model.com.refresh();
                });
                $("body").delegate("#lmvt-main", "click", function () {
                    $(".changeName").text("主材库");
                    StockSourceID = ERPStockID[4].StockID;
                    model.com.refresh();
                });
                $("body").delegate("#lmvt-count", "click", function () {
                    $(".changeName").text("计量库");
                    StockSourceID = ERPStockID[5].StockID;
                    model.com.refresh();
                });
                $("body").delegate("#lmvt-turmover", "click", function () {
                    $(".changeName").text("周转仓库");
                    StockSourceID = ERPStockID[6].StockID;
                    model.com.refresh();
                });
                $("body").delegate("#lmvt-holder", "click", function () {
                    $(".changeName").text("保持架周转库");
                    StockSourceID = ERPStockID[7].StockID;
                    model.com.refresh();
                });
                $("body").delegate("#lmvt-nonefinished", "click", function () {
                    $(".changeName").text("半成品库");
                    StockSourceID = ERPStockID[8].StockID;
                    model.com.refresh();
                });
                $("body").delegate("#lmvt-repair", "click", function () {
                    $(".changeName").text("返修库");
                    StockSourceID = ERPStockID[9].StockID;
                    model.com.refresh();
                });
                $("body").delegate("#lmvt-reject", "click", function () {
                    $(".changeName").text("报废仓库");
                    StockSourceID = ERPStockID[10].StockID;
                    model.com.refresh();
                });
                $("body").delegate("#lmvt-pooh", "click", function () {
                    $(".changeName").text("毛胚仓库");
                    StockSourceID = ERPStockID[11].StockID;
                    model.com.refresh();
                });
                //状态
                $("body").delegate("#lmvt-right-change", "click", function () {

                    SaveData = $com.table.getSelectionData($(".lmvt-bottom-body"), "LocationName", DataERPLocationAll_source);


                    if (!SaveData || !SaveData.length) {
                        alert("请先选择一行数据再试！");
                        return;
                    }


                    $("body").append($com.modal.show(DEFAULT_VALUE_Status, KETWROD_Template_Status, "选择状态", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        rst.Status = Number(rst.Status);

                        StatusID = rst.Status,

                            $.each(TypeSource_Status.Status, function (i, item) {
                                if (item.value == rst.Status)
                                    StatusText = item.name;
                            });
                        $(".changeStatus").text(StatusText);

                        $.each(SaveData, function (i, item) {
                            item.materialNo = MaterialNumber;
                            item.StockStatusText = StatusText;
                            item.StockStatus = StatusID;
                            item.Location_Margin = 0;
                            item.Location_Total = 0;
                            item.Location_Used = 0;
                            item.Active = 1;
                        });

                    }, TypeSource_Status));
                });
                //模糊查询
                $("body").delegate("#femi-search-text-ledger", "change", function () {
                    var $this = $(this),
                        value = $(this).val();
                    $com.table.filterByLikeString($(".lmvt-order-body"), DataStorage_source, value, "DisplayID");
                });
                //精准查询
                $("body").delegate("#lmvt-search", "click", function () {
                    var default_value = {
                            MaterialName: "",
                        },
                        KEYWORD = [
                            "MaterialName|物料名|ArrayOne",
                        ],
                        KETWROD_Template = {},
                        Formattrt = {};
                    $.each(KEYWORD, function (i, item) {
                        var detail = item.split("|");
                        KETWROD_Template[detail[0]] = {
                            index: i,
                            name: detail[1],
                            type: detail.length > 2 ? detail[2] : undefined,
                            control: detail.length > 3 ? detail[3] : undefined,
                        };

                        if (detail.length > 2) {
                            Formattrt[detail[0]] = $com.util.getFormatter(TypeSource, detail[0], detail[2]);
                        }
                    });

                    $("body").append($com.modal.show(default_value, KEYWORD, "查询", function (rst) {


                        if (!rst || $.isEmptyObject(rst))
                            return;

                        $com.table.filterByConndition($(".lmvt-grinding-body"), Data_Source_Buzzer, default_value, "ID");

                    }, TypeSource));


                });
                //保存
                $("body").delegate("#lmvt-right-save", "click", function () {
                    if (temp) {
                        SaveData = $com.table.getSelectionData($(".lmvt-bottom-body"), "LocationName", DataERPLocationAll_source);
                        if (!SaveData || !SaveData.length) {
                            alert("请先选择一行数据再试！");
                            return;
                        }

                        if (!SaveData[0].StockStatus) {
                            alert("请先为其选择状态！");
                            return false;
                        }

                        $(".changeStatus").text("");
                        $.each(SaveData, function (i, item) {
                            item.materialNo = MaterialNumber;
                            item.StockStatusText = StatusText;
                            item.StockStatus = StatusID;
                            item.Location_Margin = 0;
                            item.Location_Total = 0;
                            item.Location_Used = 0;
                            item.Active = 1;
                        });


                        $.each(SaveData, function (i, item) {
                            model.com.postInstockLocationSave({
                                data: item,
                            }, function (res) {
                                alert("保存成功！！");
                                model.com.refresh();
                            });

                        });
                    } else {
                        SaveData = $com.table.getSelectionData($(".lmvt-bottom-body"), "LocationName", default_source);
                        if (!SaveData || !SaveData.length) {
                            alert("请先选择一行数据再试！");
                            return;
                        }


                        $.each(SaveData, function (i, item) {
                            model.com.postInstockLocationSave({
                                data: item,
                            }, function (res) {
                                alert("保存成功！！");
                                model.com.refresh();
                            });

                        });
                    }
                });
                //删除仓位
                $("body").delegate("#lmvt-right-delete", "click", function () {

                    var SelectData = $com.table.getSelectionData($(".lmvt-warehousing-body"), "DisplayID", orderList_source);

                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！");
                        return;
                    }
                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {
                        return;
                    }

                    var dataSource = {};
                    $.each(DataOrder_source, function (i, item) {
                        for (var p in SelectData)
                            if (item.ID == SelectData[p].ID)
                                dataSource[p] = item;
                    });

                    $.each(dataSource, function (i, item) {
                        model.com.postInstockLocationRemove({
                            data: item,
                        }, function (res) {
                            alert("删除成功！！");
                            model.com.refresh();
                        });
                    });


                });
                //激活
                $("body").delegate("#lmvt-right-action", "click", function () {

                    var SelectData = $com.table.getSelectionData($(".lmvt-warehousing-body"), "DisplayID", orderList_source);

                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！");
                        return;
                    }
                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其激活？")) {
                        return;
                    }

                    $.each(SelectData, function (i, item) {
                        item.Active = 1;
                        model.com.postInstockLocationSave({
                            data: item,
                        }, function (res) {
                            alert("激活成功！！");
                            model.com.refresh();
                        });
                    });

                });
                //禁用
                $("body").delegate("#lmvt-right-forbidder", "click", function () {

                    var SelectData = $com.table.getSelectionData($(".lmvt-warehousing-body"), "DisplayID", orderList_source);

                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！");
                        return;
                    }
                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其禁用？")) {
                        return;
                    }

                    $.each(SelectData, function (i, item) {
                        item.Active = 0;
                        model.com.postInstockLocationSave({
                            data: item,
                        }, function (res) {
                            alert("禁用成功！！");
                            model.com.refresh();
                        });
                    });

                });
                //修改入库仓位的状态
                $("body").delegate("#lmvt-right-status", "click", function () {

                    var SelectData = $com.table.getSelectionData($(".lmvt-warehousing-body"), "DisplayID", orderList_source);

                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！");
                        return;
                    }
                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其状态修改？")) {
                        return;
                    }

                    $("body").append($com.modal.show(DEFAULT_VALUE_Status, KETWROD_Template_Status, "选择状态", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        rst.Status = Number(rst.Status);

                        StatusID = rst.Status;

                        $.each(TypeSource_Status.Status, function (i, item) {
                            if (item.value == rst.Status)
                                StatusText = item.name;
                        });

                        $.each(SelectData, function (i, item) {
                            item.StockStatus = StatusID;
                            item.StockStatusText = StatusText;
                            if (item.Active == "激活")
                                item.Active = 1;
                            if (item.Active == "禁用")
                                item.Active = 0;
                            model.com.postInstockLocationSave({
                                data: item,
                            }, function (res) {
                                alert("修改成功！！");
                                model.com.refresh();
                            });
                        });
                    }, TypeSource_Status));
                });
                //查询订单
                $("body").delegate("#lmvt-left-check", "click", function () {

                    $("body").append($com.modal.show(DEFAULT_VALUE_Time, KETWROD_Template_Time, "新增", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;

                        Start = $com.util.format('yyyy-MM-dd hh:mm:ss', rst.startTime);
                        End = $com.util.format('yyyy-MM-dd hh:mm:ss', rst.endTime);

                        model.com.refresh();

                    }, TypeSource_Time));
                });
                //导出订单
                $("body").delegate("#lmvt-left-output", "click", function () {

                    var $table = $(".order-table"),
                        fileName = "入库订单.xls",
                        Title = "入库订单";
                    var params = $com.table.getExportParams($table, fileName, Title);

                    model.com.postExportExcel(params, function (res) {
                        var src = res.info.path;
                        window.open(src);
                    });
                });
                //双击事件
                $("body").delegate(".lmvt-order-body tr", "dblclick", function () {
                    var $this = $(this),
                        id = $this.find("td[data-title=DisplayID]").attr("data-value");
                    $.each(storageList_source, function (i, item) {
                        if (item.DisplayID == id)
                            MaterialNumber = item.MaterialNo;
                    });
                    $(".lmvt-container-left").css("width", "50%");

                    $(".lmvt-container-right").show();
                    $(".lmvt-container-bottom").hide();
                    model.com.refresh();
                });
            },
            run: function () {

            },
            com: {
                //默认集合
                getERPMaterialLocationAll: function (data, fn, context) {
                    var d = {
                        $URI: "/ERPInterface/ERPMaterialLocationAll",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //仓库集合
                getERPStockAll: function (data, fn, context) {
                    var d = {
                        $URI: "/ERPInterface/ERPStockAll",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //仓位集合
                getERPLocationAll: function (data, fn, context) {
                    var d = {
                        $URI: "/ERPInterface/ERPLocationAll",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                getInstockLocationAll: function (data, fn, context) {
                    var d = {
                        $URI: "/InstockLocation/All",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                getMESOrderAll: function (data, fn, context) {
                    var d = {
                        $URI: "/MESOrder/MESERPOrderAll",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //保存
                postInstockLocationSave: function (data, fn, context) {
                    var d = {
                        $URI: "/InstockLocation/Save",
                        $TYPE: "post",
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //删除
                postInstockLocationRemove: function (data, fn, context) {
                    var d = {
                        $URI: "/InstockLocation/Remove",
                        $TYPE: "post",
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //导出
                postExportExcel: function (data, fn, context) {
                    var d = {
                        $URI: "/Upload/ExportExcel",
                        $TYPE: "post",
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //导入
                postImportExcel: function (data, fn, context) {
                    var d = {
                        $URI: "/Upload/ImportExcel",
                        $TYPE: "post",
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                Default: function () {
                    //根据物料拿默认仓位
                    model.com.getERPMaterialLocationAll({materialNo: MaterialNumber}, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];
                        if (res && res.list) {
                            default_source = res.list;

                            default_source = $com.util.Clone(default_source);
                            temp = false;

                            DataSource_Post = default_source;
                        }
                        $(".lmvt-bottom-body").html($com.util.template(res.list, HTML.BottomList));
                    });
                },

                refresh: function () {
                    //根据物料拿仓位
                    model.com.getInstockLocationAll({materialNo: MaterialNumber}, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];
                        if (res && res.list) {

                            orderList_source = res.list;

                            DataOrder_source = res.list;


                            orderList_source = $com.util.Clone(orderList_source);

                            $.each(orderList_source, function (i, item) {
                                item.DisplayID = i + 1;
                                if (item.Active == 1)
                                    item.Active = "激活";
                                if (item.Active == 0)
                                    item.Active = "禁用";

                            });
                        }
                        $(".lmvt-warehousing-body").html($com.util.template(orderList_source, HTML.OrderList));
                    });

                    //订单号
                    model.com.getMESOrderAll({
                        orderNo: "",
                        productNo: "",
                        materialNo: "",
                        workShopID: 0,
                        lineID: 0,
                        partID: 0,
                        status: 0,
                        type: 0,
                        active: 2,
                        startTime: Start,
                        endTime: End,
                    }, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];
                        if (res && res.list) {
                            storageList_source = res.list;

                            DataStorage_source = res.list;

                            storageList_source = $com.util.Clone(storageList_source);

                            $.each(storageList_source, function (i, item) {
                                item.DisplayID = i + 1;
                                TypeSource.MaterialName.push({
                                    name: item.materialNo,
                                    value: item.MaterialName,
                                });
                            });
                        }
                        $(".lmvt-order-body").html($com.util.template(storageList_source, HTML.StorageList));
                    });
                    //仓位
                    model.com.getERPStockAll({}, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];
                        if (res && res.list) {

                            $.each(res.list, function (i, item) {
                                ERPStockID.push({
                                    StockID: item.StockID,
                                    StockName: item.StockName,
                                });
                            });
                        }
                        //$(".lmvt-warehousing-body").html($com.util.template(orderList_source, HTML.OrderList));
                    });
                    //仓位集合
                    model.com.getERPLocationAll({StockID: StockSourceID}, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];
                        if (res && res.list) {

                            ERPLocationAll_source = res.list;

                            DataERPLocationAll_source = res.list;

                            ERPLocationAll_source = $com.util.Clone(ERPLocationAll_source);

                            temp = true;

                            DataSource_Post = ERPLocationAll_source;
                        }
                        $(".lmvt-bottom-body").html($com.util.template(ERPLocationAll_source, HTML.BottomList));
                    });
                },
            },
        });
        model.init();
    });