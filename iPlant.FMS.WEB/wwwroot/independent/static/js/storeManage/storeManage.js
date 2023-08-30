require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'],
    function ($lin, $com) {
        var HTML,
            Data_Source_Stock,
            Stock_List,

            Defaul_Value_Change,
            KETWROD_LIST_Change,
            KETWROD_Change,
            Formattrt_Change,
            TypeSource_Change,

            Defaul_Value_Stock,
            KETWROD_LIST_Stock,
            KETWROD_Stock,
            Formattrt_Stock,
            TypeSource_Stock;

        HTML = {
            StoreList: [
                '<tr>',
                '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></th>',
                '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
                '<td style="min-width: 100px" data-title="StockName" data-value="{{StockName}}">{{StockName}}</td>',
                '<td style="min-width: 150px" data-title="Length" data-value="{{Length}}">{{Length}}</td>',
                '<td style="min-width: 150px" data-title="Width" data-value="{{Width}}" >{{Width}}</td>',
                '<td style="min-width: 150px" data-title="Height" data-value="{{Height}}" >{{Height}}</td>',
                '<td style="min-width: 100px" data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
                '<td style="min-width: 80px" data-title="Creator" data-value="{{Creator}}" >{{Creator}}</td>',
                '<td style="min-width: 50px" data-title="Active" data-value="{{Active}}" >{{Active}}</td>',
                '<tr>'
            ].join(""),

        }

        //仓库
        Defaul_Value_Stock = {
            StockName: "",
            Length: 0,
            Width: 0,
            Height: 0,
            Active: "",
        };
        (function () {

            KETWROD_LIST_Stock = [
                "StockName|仓库名",
                "Length|仓库长(毫米)",
                "Width|仓库宽(毫米)",
                "Height|仓库高(毫米)",
                "Active|状态|ArrayOne",
            ];

            KETWROD_Stock = {};

            Formattrt_Stock = {};

            TypeSource_Stock = {
                Active: [
                    {
                        name: "禁用",
                        value: 0
                    },
                    {
                        name: "激活",
                        value: 1
                    }
                ]
            };

            $.each(KETWROD_LIST_Stock, function (i, item) {
                var detail = item.split("|");
                KETWROD_Stock[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_Stock[detail[0]] = $com.util.getFormatter(TypeSource_Stock, detail[0], detail[2]);
                }
            });
        })();

        //修改
        (function () {

            KETWROD_LIST_Change = [
                "StockName|仓库名",
                "Length|仓库长(毫米)",
                "Width|仓库宽(毫米)",
                "Height|仓库高(毫米)",
                "Active|状态|ArrayOne",
            ];

            KETWROD_Change = {};

            Formattrt_Change = {};

            TypeSource_Change = {
                Active: [
                    {
                        name: "禁用",
                        value: 0
                    },
                    {
                        name: "激活",
                        value: 1
                    }
                ]
            };

            $.each(KETWROD_LIST_Change, function (i, item) {
                var detail = item.split("|");
                KETWROD_Change[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_Change[detail[0]] = $com.util.getFormatter(TypeSource_Change, detail[0], detail[2]);
                }
            });
        })();

        model = $com.Model.create({
            name: '仓库管理',

            type: $com.Model.MAIN,

            configure: function () {
                this.run();
            },

            events: function () {
                //新增仓库
                $("body").delegate("#lmvt-store-add", "click", function () {

                    $("body").append($com.modal.show(Defaul_Value_Stock, KETWROD_Stock, "新增仓库", function (rst) {
                        if (!rst || $.isEmptyObject(rst))
                            return false;

                        var inputDate = {
                            ID: 0,
                            StockName: rst.StockName,
                            Length: Number(rst.Length),
                            Width: Number(rst.Width),
                            Height: Number(rst.Height),
                            Active: Number(rst.Active),
                            CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                            Creator: window.parent.User_Info.Name
                        };

                        model.com.postWMSStockSave({
                            data: inputDate,
                        }, function (res) {
                            alert("新增成功！！");
                            model.com.refresh();
                        });
                        return false;
                    }, TypeSource_Stock));

                });
                //激活仓库
                $("body").delegate("#lmvt-store-active", "click", function () {
                    var SelectData = $com.table.getSelectionData($(".lmvt-storeManage-body"), "ID", Data_Source_Stock);
                     
                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return;
                    }
                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其激活？")) {
                        return;
                    }
                    model.com.postWMSStockActive({
                        data: SelectData,
                        active: 1
                    }, function (res) {
                        alert("激活成功！！");
                        model.com.refresh();
                    });
                });
                //禁用仓库
                $("body").delegate("#lmvt-store-forbidden", "click", function () {
                    var SelectData = $com.table.getSelectionData($(".lmvt-storeManage-body"), "ID", Data_Source_Stock);

                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return;
                    }
                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其禁用？")) {
                        return;
                    }
                    model.com.postWMSStockActive({
                        data: SelectData,
                        active: 0
                    }, function (res) {
                        alert("禁用成功！！");
                        model.com.refresh();
                    });
                });
                //导出
                $("body").delegate("#lmvt-table-out", "click", function () {

                    var $table = $(".storeManage-table>table"),
                        fileName = "仓库管理.xls",
                        Title = "仓库管理";
                    var params = $com.table.getExportParams($table, fileName, Title);

                    model.com.postExportExcel(params, function (res) {
                        var src = res.info.path;
                        window.open(src);
                    });
                });
                //导入
                $("body").delegate("#lmvt-table-in", "click", function () {
                    $("#input-file").val("");
                    $("#input-file").click();
                });
                $("body").delegate("#input-file", "change", function () {
                    var $this = $(this);

                    if (this.files.length == 0)
                        return;
                    var fileData = this.files[0];

                    var form = new FormData();
                    form.append("file", fileData);

                    model.com.postImportExcel(form, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];
                        if (list) {

                            var postData = res.list;

                            var DataParams = $com.table.postExportParams(postData, $(".storeManage-table>table"));

                            $.each(DataParams, function (i, item) {
                                if (item.Active == "激活")
                                    item.Active = 1;
                                else
                                    item.Active = 0;
                            });

                            
                            $.each(DataParams, function (i, item) {
                                model.com.postWMSStockSave({
                                    data: item,
                                }, function (res) {
                                    alert("导入成功！！");
                                });
                            });
                            model.com.refresh();
                        }
                    });

                });
                //修改
                $("body").delegate("#lmvt-store-Change", "click", function () {
                    var SelectData = $com.table.getSelectionData($(".lmvt-storeManage-body"), "ID", Data_Source_Stock);

                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return;
                    }

                    if (SelectData.length !=1) {
                        alert("只能对一条数据进行修改！")
                        return;
                    }

                    Defaul_Value_Change = {
                        StockName: SelectData[0].StockName,
                        Length: SelectData[0].Length,
                        Width: SelectData[0].Width,
                        Height: SelectData[0].Height,
                        Active: "",
                    };

                    $("body").append($com.modal.show(Defaul_Value_Change, KETWROD_Change, "修改仓库", function (rst) {
                        if (!rst || $.isEmptyObject(rst))
                            return false;

                        var inputDate = {
                            ID: SelectData[0].ID,
                            StockName: rst.StockName,
                            Length: Number(rst.Length),
                            Width: Number(rst.Width),
                            Height: Number(rst.Height),
                            Active: Number(rst.Active),
                            CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                            Creator: window.parent.User_Info.Name
                        };

                        model.com.postWMSStockSave({
                            data: inputDate,
                        }, function (res) {
                            alert("修改成功！！");
                            model.com.refresh();
                        });
                        return false;
                    }, TypeSource_Change));

                });
            },
            run: function () {
                model.com.refresh();
            },
            com: {
                //仓库列表
                getWMSStockAll: function (data, fn, context) {
                    var d = {
                        $URI: "/WMSStock/All",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //保存
                postWMSStockSave: function (data, fn, context) {
                    var d = {
                        $URI: "/WMSStock/Save",
                        $TYPE: "post"
                    };
                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //激活
                postWMSStockActive: function (data, fn, context) {
                    var d = {
                        $URI: "/WMSStock/Active",
                        $TYPE: "post"
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
                        $TYPE: "post"
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
                        $TYPE: "post"
                    };

                    function err() {
                        $com.app.tip('导入失败，请检查网络');
                    }

                    $com.app.ajax_load(data ? $.extend(data, d) : $.extend(d, data), fn, err, context);
                },
                refresh: function () {
                    model.com.getWMSStockAll({}, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];
                        if (res && res.list) {
                            Data_Source_Stock = res.list;

                            Stock_List = res.list;

                            Stock_List = $com.util.Clone(Stock_List);

                            $.each(Stock_List, function (i, item) {
                                for (var p in item) {
                                    if (!Formattrt_Stock[p])
                                        continue;
                                    item[p] = Formattrt_Stock[p](item[p]);
                                }
                            });
                        }
                        $(".lmvt-storeManage-body").html($com.util.template(Stock_List, HTML.StoreList));
                    });
                },
                //最大编号
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
                ActiveSourceItem: function (_source, set_data, active) {
                    if (!_source)
                        _source = [];
                    if (!set_data)
                        set_data = [];

                    $.each(_source, function (i, item) {

                        $.each(set_data, function (m, item_m) {
                            if (item.ID == item_m.ID) {
                                item.Active = active;
                            }
                        });
                        if (item.SonList) {

                            item.SonList = ActiveSourceItem(item.SonList, set_data, active);

                        }
                    });
                    return _source;
                }
            },
        });
        model.init();
    });