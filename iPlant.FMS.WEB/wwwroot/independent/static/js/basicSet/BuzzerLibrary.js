require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'],
    function ($lin, $com) {

        var HTML,
            Data_Source_Buzzer,
            Buzzer_List,
            UserID,
            UserName,
            UserList,

            DEFAULT_VALUE_Buzzer,
            KETWROD_LIST_Buzzer,
            KETWROD_Template_Buzzer,
            Formattrt_Buzzer,
            TypeSource_Buzzer;

        HTML = {
            BuzzerList: [
                '<tr>',
                '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></th>',
                '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
                '<td style="min-width: 80px" data-title="Type" data-value="{{Type}}">{{Type}}</td>',
                '<td style="min-width: 80px" data-title="SharpenerNo" data-value="{{SharpenerNo}}">{{ SharpenerNo}}</td>',
                '<td style="min-width: 50px" data-title="Material" data-value="{{Material}}" >{{ Material}}</td>',
                '<td style="min-width: 50px" data-title="Granularity" data-value="{{Granularity}}" >{{ Granularity}}</td>',
                '<td style="min-width: 80px" data-title="Hardness" data-value="{{Hardness}}" >{{ Hardness}}</td>',
                '<td style="min-width: 100px" data-title="WJORLength" data-value="{{WJORLength}}" >{{ WJORLength}}</td>',
                '<td style="min-width: 100px" data-title="NKORWidth" data-value="{{NKORWidth}}" >{{ NKORWidth}}</td>',
                '<td style="min-width: 80px" data-title="Height" data-value="{{Height}}" >{{ Height}}</td>',
                '<td style="min-width: 60px" data-title="OpreatorID" data-value="{{OpreatorID}}" >{{ OpreatorID}}</td>',
                '<td style="min-width: 80px" data-title="CreateTime" data-value="{{CreateTime}}" >{{ CreateTime}}</td>',
                '<td style="min-width: 80px" data-title="UpdateTime" data-value="{{UpdateTime}}" >{{ UpdateTime}}</td>',
                '<td style="min-width: 50px" data-title="Status" data-value="{{Status}}" >{{ Status}}</td>',
                '<tr>',
            ].join(""),

        };

        //任务排班
        DEFAULT_VALUE_Buzzer = {
            Type: "",
            SharpenerNo: "",
            Material: "",
            Status: "",
            Granularity: 0,
            Hardness: "",
            WJORLength: 0,
            NKORWidth: 0,
            Height: 0,
        };
        (function () {

            KETWROD_LIST_Buzzer = [
                "Type|类型|ArrayOne",
                "SharpenerNo|型号",
                "Material|磨料",
                "Status|状态|ArrayOne",
                "Granularity|粒度",
                "Hardness|刚强",
                "WJORLength|外径或长度",
                "NKORWidth|内孔或宽度",
                "Height|厚度或高度",
            ];

            KETWROD_Template_Buzzer = {};

            Formattrt_Buzzer = {};

            TypeSource_Buzzer = {
                Type: [
                    {
                        name: "砂轮",
                        value: 1,
                    },
                    {
                        name: "油石",
                        value: 2,
                    },
                ],
                Status: [
                    {
                        name: "关闭",
                        value: 0,
                    },
                    {
                        name: "激活",
                        value: 1,
                    },
                ],
            };

            $.each(KETWROD_LIST_Buzzer, function (i, item) {
                var detail = item.split("|");
                KETWROD_Template_Buzzer[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined,
                };

                if (detail.length > 2) {
                    Formattrt_Buzzer[detail[0]] = $com.util.getFormatter(TypeSource_Buzzer, detail[0], detail[2]);
                }
            });
        })();

        model = $com.Model.create({
            name: '砂轮库',

            type: $com.Model.MAIN,

            configure: function () {
                this.run();
            },

            events: function () {
                //新增
                $("body").delegate("#lmvt-grinding-add", "click", function () {

                    $("body").append($com.modal.show(DEFAULT_VALUE_Buzzer, KETWROD_Template_Buzzer, "新增", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;

                        var _data = {
                            Type: Number(rst.Type),
                            ID: 0,
                            SharpenerNo: Number(rst.SharpenerNo),
                            Material: Number(rst.Material),
                            Granularity: Number(rst.Granularity),
                            Hardness: Number(rst.Hardness),
                            WJORLength: Number(rst.WJORLength),
                            NKORWidth: Number(rst.NKORWidth),
                            Height: Number(rst.Height),
                            OpreatorID: Number(UserID),
                            CreateTime: new Date(),
                            UpdateTime: new Date(),
                            Status: Number(rst.Status),
                        };

                        model.com.postSharpenerSave({
                            data: _data,
                        }, function (res) {
                            alert("新增成功！！");
                            model.com.refresh();
                        });

                    }, TypeSource_Buzzer));
                });
                //禁用
                $("body").delegate("#lmvt-forbidder", "click", function () {

                    var SelectData = $com.table.getSelectionData($(".lmvt-grinding-body"), "ID", Data_Source_Buzzer);

                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！");
                        return;
                    }
                    if (SelectData.length != 1) {
                        alert("只能选择一条数据！");
                        return;
                    }

                    SelectData[0].Status = 0;
                    SelectData[0].UpdateTime = new Date();

                    model.com.postSharpenerSave({
                        data: SelectData[0],
                    }, function (res) {
                        alert("禁用成功！！");
                        model.com.refresh();
                    });

                });
                //激活
                $("body").delegate("#lmvt-active", "click", function () {

                    var SelectData = $com.table.getSelectionData($(".lmvt-grinding-body"), "ID", Data_Source_Buzzer);
                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！");
                        return;
                    }
                    if (SelectData.length != 1) {
                        alert("只能选择一条数据！");
                        return;
                    }

                    SelectData[0].Status = 1;
                    SelectData[0].UpdateTime = new Date();

                    model.com.postSharpenerSave({
                        data: SelectData[0],
                    }, function (res) {
                        alert("激活成功！！");
                        model.com.refresh();
                    });

                });
                //导出
                $("body").delegate("#lmvt-grinding-output", "click", function () {

                    var $table = $(".grinding-table"),
                        fileName = "砂轮库.xls",
                        Title = "砂轮库";
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

                            var DataParams = $com.table.postExportParams(postData, $(".grinding-table"));

                            $.each(DataParams, function (i, item) {
                                if (item.Status == "激活")
                                    item.Status = 1;
                                else
                                    item.Status = 0;
                                if (item.Type == "砂轮")
                                    item.Type = 1;
                                else
                                    item.Type = 2;
                                $.each(UserList, function (i, item_i) {

                                    if (item_i.Name == item.OpreatorID)
                                        item.OpreatorID = item_i.ID;

                                });
                            });

                            $.each(DataParams, function (i, item) {

                                model.com.postSharpenerSave({
                                    data: item,
                                }, function (res) {
                                    alert("导入成功！！");
                                    model.com.refresh();
                                });
                            });
                        }
                    });
                });
                //模糊查询
                $("body").delegate("#femi-search-text-ledger", "change", function () {
                    var $this = $(this),
                        value = $(this).val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $(".lmvt-process-body").children("tr").show();
                    else
                        $com.table.filterByLikeString($(".lmvt-grinding-body"), Data_Source_Buzzer, value, "ID");
                });
                //精准查询
                $("body").delegate("#lmvt-search-process", "click", function () {
                    var default_value = {},
                        KEYWORD = [];
                    TypeSource;
                    $("body").append($com.modal.show(default_value, KEYWORD, "查询", function (rst) {


                        if (!rst || $.isEmptyObject(rst))
                            return;

                        $com.table.filterByConndition($(".lmvt-grinding-body"), Data_Source_Buzzer, default_value, "ID");

                    }, TypeSource));


                });
            },
            run: function () {
                UserName = window.parent.User_Info.Name;
                model.com.refresh();
            },
            com: {
                getUserAll: function (data, fn, context) {
                    var d = {
                        $URI: "/User/All",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                getSharpenerAll: function (data, fn, context) {
                    var d = {
                        $URI: "/Sharpener/All",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                postSharpenerSave: function (data, fn, context) {
                    var d = {
                        $URI: "/Sharpener/Save",
                        $TYPE: "post",
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
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
                        $com.app.tip('导入失败，请检查网络');
                    }

                    $com.app.ajax_load(data ? $.extend(data, d) : $.extend(d, data), fn, err, context);
                },
                refresh: function () {
                    model.com.getSharpenerAll({ID: 0, Type: 0, Status: -1}, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];
                        if (res && res.list) {

                            Data_Source_Buzzer = res.list;

                            Buzzer_List = res.list;

                            Buzzer_List = $com.util.Clone(Buzzer_List);

                            $.each(Buzzer_List, function (i, item) {
                                for (var p in item) {
                                    if (!Formattrt_Buzzer[p])
                                        continue;
                                    item[p] = Formattrt_Buzzer[p](item[p]);
                                }
                            });
                            model.com.getUserAll({}, function (res) {
                                if (!res)
                                    return;
                                var list = res.list,
                                    rst = [];
                                if (res && res.list) {

                                    UserList = res.list;

                                    $.each(UserList, function (i, item_i) {
                                        if (item_i.Name == UserName)
                                            UserID = item_i.ID;
                                        $.each(Buzzer_List, function (j, item_j) {
                                            if (item_i.ID == item_j.OpreatorID)
                                                item_j.OpreatorID = item_i.Name;
                                        });
                                    });
                                    $(".lmvt-grinding-body").html($com.util.template(Buzzer_List, HTML.BuzzerList));
                                }

                            });
                        }


                    });
                },

                ActiveSourceItem: function (_source, set_data, active) {
                    if (!_source)
                        _source = [];
                    if (!set_data)
                        set_data = [];

                    $.each(_source, function (i, item) {
                        $.each(set_data, function (m, item_m) {
                            if (item.ID == item_m.ID) {
                                item.Status = active;
                            }
                        });
                    });
                    return _source;
                },

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