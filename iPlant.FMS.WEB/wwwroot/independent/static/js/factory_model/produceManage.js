require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/jquery.treeview'],
    function ($lin, $com, $treeview) {

        var HTML,
            Data_PartPointList,

            Defaul_Value_Capacity,
            KETWROD_LIST_Capacity,
            KETWROD_Capacity,
            Formattrt_Capacity,
            TypeSource_Capacity,

            HTML = {

                ProduceList: [
                    '<tr><td style="widtd: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></td>',
                    '<td style="min-widtd:50px"   data-title="ID" data-value = {{ID}}>{{ID}}</td>',
                    '<td style="min-widtd: 80px"  data-title="ProductNo" data-value = {{ProductNo}}>{{ProductNo}}</td>',
                    '<td style="min-widtd: 80px"  data-title="ProductName" data-value = {{ProductName}}>{{ProductName}}</td>',
                    '<td style="min-widtd: 80px"  data-title="EPQ" data-value = {{EPQ}}>{{EPQ}}</td>',
                    '<td style="min-widtd: 50px"  data-title="Diameter" data-value = {{Diameter}}>{{Diameter}}</td>',
                    '<td style="min-widtd: 50px"  data-title="Capacity" data-value = {{Capacity}}>{{Capacity}}</td>',
                    '<td style="min-widtd: 80px"  data-title="Hours" data-value = {{Hours}}>{{Hours}}</td>',
                    '<td style="min-widtd: 100px" data-title="MaxTaskRatio" data-value = {{MaxTaskRatio}}>{{MaxTaskRatio}}</td>',
                    '<td style="min-widtd: 100px" data-title="NormalTaskRatio" data-value = {{NormalTaskRatio}}>{{NormalTaskRatio}}</td>',
                    '<td style="min-widtd: 80px"  data-title="TypeText" data-value = {{TypeText}}>{{TypeText}}</td>',
                    '<td style="min-widtd: 60px"  data-title="Creator" data-value = {{Creator}}>{{Creator}}</td>',
                    '<td style="min-widtd: 80px"  data-title="CreateTime" data-value = {{CreateTime}}>{{CreateTime}}</td>',
                    '</tr>',
                ].join(""),
            };

        //产能
        Defaul_Value_Capacity = {
            ProductNo: "",
            ProductName: "",
            Diameter: 0,
            EPQ: 0,
            Capacity: 0,
            Hours: 0,
            MaxTaskRatio: 0,
            NormalTaskRatio: 0,
            TypeText: ""
        };
        (function () {

            KETWROD_LIST_Capacity = [
                "ProductNo|产品编号",
                "ProductName|产品名字",
                "Diameter|尺寸",
                "EPQ|经济批量",
                "Capacity|产能",
                "Hours|工作时长",
                "MaxTaskRatio|最大排班数",
                "NormalTaskRatio|正常排班数",
                "TypeText|产品类型|ArrayOne"
            ];

            KETWROD_Capacity = {};

            Formattrt_Capacity = {};

            TypeSource_Capacity = {
                TypeText: [
                    {
                        name: " ",
                        value: 0
                    },
                ]
            };

            $.each(KETWROD_LIST_Capacity, function (i, item) {
                var detail = item.split("|");
                KETWROD_Capacity[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_Capacity[detail[0]] = $com.util.getFormatter(TypeSource_Capacity, detail[0], detail[2]);
                }
            });
        })();

        model = $com.Model.create({
            name: '产品管理',

            type: $com.Model.MAIN,

            configure: function () {
                this.run();
            },

            events: function () {
                //模糊查询
                $("body").delegate("#femi-search-text-ledger", "input", function () {
                    var $this = $(this),
                        value = $(this).val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $(".lmvt-produce-body").children("tr").show();
                    else
                        $com.table.filterByLikeString($(".lmvt-produce-body"), Data_capacity_source, value, "ID");
                });
                //导出
                $("body").delegate("#lmvt-table-out", "click", function () {

                    var $table = $(".capacity-table"),
                        fileName = "产品管理.xls",
                        Title = "产品管理";
                    var params = $com.table.getExportParams($table, fileName, Title);

                    model.com.postExportExcel(params, function (res) {
                        var src = res.info.path;
                        window.open(src);
                    });
                });

                $("body").delegate("#lmvt-table-in", "click", function () {
                    $("#input-file").val("");
                    $("#input-file").click();

                });

                //导入
                $("body").delegate("#input-file", "input", function () {
                    var $this = $(this);

                    if (this.files.length == 0)
                        return;
                    var fileData = this.files[0];
                     
                    var form = new FormData();
                    form.append("file", fileData);
                     
                    model.com.postImportExcel(form, function (res) {
                        console.log("sss");

                    });

                });
                //删除产能
                $("body").delegate("#lmvt-table-delete", "click", function () {

                    var SelectData = $com.table.getSelectionData($(".lmvt-produce-body"), "ID", Data_capacity_source);

                    if (!SelectData || !SelectData.length) {
                        alert("至少选择一行数据再试！")
                        return;
                    }
                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {
                        return;
                    }

                    Data_capacity_source = model.com.Delete(Data_capacity_source, SelectData);

                    model.com.postAPSProductAll({
                        data: Data_capacity_source,
                    }, function (res) {
                        alert("删除成功！！");
                        model.com.refresh();
                    });
                });
                //新增产品
                $("body").delegate("#lmvt-table-add", "click", function () {

                    $("body").append($com.modal.show(Defaul_Value_Capacity, KETWROD_Capacity, "新增产品", function (rst) {
                        if (!rst || $.isEmptyObject(rst))
                            return false;

                        rst.Diameter = Number(rst.Diameter);
                        rst.Capacity = Number(rst.Capacity);
                        rst.Hours = Number(rst.Hours);
                        rst.MaxTaskRatio = Number(rst.MaxTaskRatio);
                        rst.NormalTaskRatio = Number(rst.NormalTaskRatio);

                        $.each(TypeSource_Capacity.TypeText, function (i, item) {
                            if (rst.TypeText == item.value) {
                                rst.TypeText = item.name;
                                rst.Type = item.value;
                            }
                        });


                        var inputDate = {
                            ID: model.com.GetMaxID(Data_capacity_source),
                            ProductNo: rst.ProductNo,
                            ProductName: rst.ProductName,
                            Diameter: rst.Diameter,
                            Capacity: rst.Capacity,
                            Hours: rst.Hours,
                            MaxTaskRatio: rst.MaxTaskRatio,
                            NormalTaskRatio: rst.NormalTaskRatio,
                            Type: rst.Type,
                            TypeText: rst.TypeText,
                            CreateTime: new Date(),
                            Creator: window.parent.User_Info.Name,
                        };

                        Data_capacity_source.push(inputDate);

                        model.com.postAPSProductAll({
                            data: Data_capacity_source,
                        }, function (res) {
                            alert("新增成功！！");
                            model.com.refresh();
                        });
                        return false;
                    }, TypeSource_Capacity));

                });
            },
            run: function () {
                model.com.getAPSProductTypeAll({}, function (res) {
                    if (!res)
                        return;
                    var list = res.list,
                        rst = [];
                    if (list) {
                        capacityType_source = res.list;

                        Data_capacityType_source = res.list;

                        capacityType_source = $com.util.Clone(capacityType_source);

                        PartList_source = capacityType_source[0].PartList;

                        $.each(capacityType_source, function (i, item) {

                            TypeSource_Capacity.TypeText.push({
                                name: item.Type,
                                value: item.ID
                            });

                        });
                    }
                });
                model.com.refresh();
            },
            com: {
                getAPSProductAll: function (data, fn, context) {
                    var d = {
                        $URI: "/APSProduct/All",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                postAPSProductAll: function (data, fn, context) {
                    var d = {
                        $URI: "/APSProduct/Save",
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
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax_load($.extend(d, data), fn, err, context);
                },
                //类型
                getAPSProductTypeAll: function (data, fn, context) {
                    var d = {
                        $URI: "/APSProduct/TypeAll",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                refresh: function () {

                    model.com.getAPSProductAll({}, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];
                        if (list) {

                            Data_capacity_source = res.list;

                            capacity_source = res.list;

                            capacity_source = $com.util.Clone(capacity_source);

                        }
                        $(".lmvt-produce-body").html($com.util.template(capacity_source, HTML.ProduceList));
                    });

                },

                //删除
                Delete: function (_source, set_data) {
                    if (!_source)
                        _source = [];
                    if (!set_data)
                        set_data = [];

                    var rst = [];

                    $.each(_source, function (i, item) {
                        var temp = true;

                        $.each(set_data, function (m, item_m) {
                            if (item.ID == item_m.ID)
                                temp = false;
                        });

                        if (temp)
                            rst.push(item);
                    });

                    $.each(rst, function (i, item) {
                        item.ID = i + 1;
                    });

                    return rst;
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

            },
        });
        model.init();
    });