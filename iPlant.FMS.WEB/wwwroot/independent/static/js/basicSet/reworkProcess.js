require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {

    var HTML,
        model,

        KEYWORD,

        KEYWORD_LIST,

        DEFAULT_VALUE,

        TypeSource,

        FORMATTRT,

        ReworkProcessSource,
        HTML = {
            TableReworkProcessItemNode: [
                '<tr>',
                '<td style="width: 3px"><input type="checkbox"',
                '	class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}"  >{{ID}}</td>	     ',
                '<td style="min-width: 50px" data-title="WorkShopID" data-value="{{WorkShopID}}"  >{{WorkShopID}}</td>  ',
                '<td style="min-width: 50px" data-title="LineID" data-value="{{LineID}}"  >{{LineID}}</td> ',
                '<td style="min-width: 50px" data-title="PartID" data-value="{{PartID}}"  >{{PartID}}</td>   ',
                '<td style="min-width: 50px" data-title="PartPoint" data-value="{{PartPointID}}"  >{{PartPointID}}</td>  ',
                '<td style="min-width: 50px" data-title="ReturnPartPointID" data-value="{{ReturnPartPointID}}"  >{{ReturnPartPointID}}</td>  ',
                '<td style="min-width: 50px" data-title="Creator" 	data-value="{{Creator}}" 	 >{{Creator}}</td>    ',
                '<td style="min-width: 80px" data-title="CreateTime" 	data-value="{{CreateTime}}" 	 >{{CreateTime}}</td>  ',
                '</tr>',
            ].join(""),

        };

    ReworkProcessSource = [];

    (function () {
        KEYWORD_LIST = [
            "WorkShopID|车间|ArrayOne",
            "LineID|产线|ArrayOne|workShopID",
            "PartID|工序段|ArrayOne",
            "PartPointID|工序|PartPointID",
            "ReturnPartPointID|异常工序|ArrayOne",
            "Creator|创建者|ArrayOne",
            "CreateTime|日期|DateTime",
        ];
        FORMATTRT = {};
        KEYWORD = {};
        DEFAULT_VALUE = {
            WorkShopID: 0,
            LineID: 0,
            LineName: 0,
            PartID: 0,
            PartPointID: 0,
            ReturnPartPointID: 0,
            Creator: 0,
            CreateTime: 0,
        };

        TypeSource = {
            WorkShopID: [{
                name: "全部",
                value: 0,
            }],
            LineID: [{
                name: "全部",
                value: 0,
                far: 0,
            }],
            PartID: [{
                name: "全部",
                value: 0,
                far: 0,
            }],
            PartPointID: [{
                name: "全部",
                value: 0,
                far: 0,
            }],
            ReturnPartPointID: [{
                name: "暂无",
                value: 0,
                far: 0,
            }],
            Creator: [{
                name: "全部",
                value: 0,
                far: 0,
            }],
        };
        $.each(KEYWORD_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
            };
            if (detail.length > 2) {
                FORMATTRT[detail[0]] = $com.util.getFormatter(TypeSource, detail[0], detail[2]);
            }

        });

    })();

    model = $com.Model.create({
        name: 'iPlant.MES',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            $("body").delegate("#femi-search-text-ledger", "change", function () {
                var $this = $(this),
                    value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-ledger-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-ledger-tbody"), ReworkProcessSource, value, "ID", FORMATTRT);
            });
            $("body").delegate("#femi-search-ledger", "click", function () {

                var default_value = {
                    WorkShopID: 0,
                    LineID: 0,
                    PartID: 0,
                    PartPointID: 0,
                    ReturnPartPointID: 0,
                    Creator: 0,
                };

                $("body").append($com.modal.show(default_value, KEYWORD, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.WorkShopID = Number(rst.WorkShopID);
                    default_value.WorkShopName = FORMATTRT.WorkShopID(Number(rst.WorkShopID));
                    default_value.LineID = Number(rst.LineID);
                    default_value.LineName = FORMATTRT.LineID(Number(rst.LineID));
                    default_value.PartID = Number(rst.PartID);
                    default_value.PartName = FORMATTRT.PartID(Number(rst.PartID));
                    default_value.PartPointID = Number(rst.PartPointID);
                    default_value.PartPointName = FORMATTRT.PartPointID(Number(rst.PartPointID));
                    default_value.ReturnPartPointID = Number(rst.ReturnPartPointID);
                    default_value.ReturnPartPointName = FORMATTRT.ReturnPartPointID(Number(ReturnPartPointID));


                    $com.table.filterByConndition($("#femi-ledger-tbody"), ReworkProcessSource, default_value, "ID");

                }, TypeSource));

            });

            $("body").delegate("#femi-edit-ledger", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-ledger-tbody"), 'ID', ReworkProcessSource);


                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！");
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！");
                    return;
                }

                var default_value = {
                    ReturnPartPointID: SelectData[0].ReturnPartPointID,
                };

                $("body").append($com.modal.show(default_value, KEYWORD, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    SelectData[0].ReturnPartPointID = Number(rst.ReturnPartPointID);

                    model.com.add({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                    });

                }, TypeSource));
            });
            //刷新
            $("body").delegate("#femi-refresh-ledger", "click", function () {

                model.com.refresh();
            });
        },
        run: function () {
            //获取车间信息
            model.com.getWorkShop({}, function (data) {

                $.each(data.list, function (i, item) {
                    TypeSource.WorkShopID.push({
                        name: item.WorkShopName,
                        value: item.ID,
                        far: null,
                    });
                    $.each(item.LineList, function (l_i, l_item) {
                        TypeSource.LineID.push({
                            name: l_item.ItemName,
                            value: l_item.ID,
                            far: item.ID,
                        });
                    });

                });
                model.com.getUser({}, function (data_User) {
                    TypeSource.Creator = TypeSource.Creator.concat($com.table.getTypeSource(data_User.list, "ID", "Name"));

                    //获取工序段
                    model.com.getPartConfig({}, function (data_Part) {

                        $.each(data_Part.list, function (p_i, p_item) {

                            TypeSource.PartID = TypeSource.PartID.concat($com.table.getTypeSource(p_item.PartList, "PartID", "PartName"));

                            $.each(p_item.PartList, function (pp_i, pp_item) {

                                TypeSource.PartPointID = TypeSource.PartPointID.concat($com.table.getTypeSource(pp_item.PartPointList, "PartPointID", "PartPointName", undefined, "PartID"));
                                TypeSource.ReturnPartPointID = TypeSource.ReturnPartPointID.concat($com.table.getTypeSource(pp_item.PartPointList, "PartPointID", "PartPointName"));
                            });
                        });


                        model.com.refresh();
                    });
                });

            });
        },
        com: {
            get: function (data, fn, context) {
                var d = {
                    $URI: "/ReturnPartPoint/All",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getUser: function (data, fn, context) {
                var d = {
                    $URI: "/User/All",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },


            getPartConfig: function (data, fn, context) {
                var d = {
                    $URI: "/APSLine/ConfigAll",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            getWorkShop: function (data, fn, context) {
                var d = {
                    $URI: "/WorkShop/All",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            refresh: function () {
                model.com.get({}, function (res) {
                    if (res && res.list) {
                        ReworkProcessSource = res.list;

                        model.com.render(ReworkProcessSource);
                    }
                });
            },

            render: function (list) {
                var _list = $com.util.Clone(list);
                $.each(_list, function (i, item) {
                    for (var p in item) {
                        if (!FORMATTRT[p])
                            continue;
                        item[p] = FORMATTRT[p](item[p]);
                    }
                });
                $("#femi-ledger-tbody").html($com.util.template(_list, HTML.TableReworkProcessItemNode));
            },
            add: function (data, fn, context) {
                var d = {
                    $URI: "/ReturnPartPoint/Update ",
                    $TYPE: "post",
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
        },
    });
    model.init();
});