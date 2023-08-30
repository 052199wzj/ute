require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/jquery.treeview'],
    function ($yang, $com, $tree) {
        var TreeData = [];
        var AreaData = [],
            CID,
            PID,
            HTML,
            Temp,
            DataAllProvince,
            DataAllCity,
            DataAll,
            KEYWORD_area,
            TypeSource_area,
            FORMATTRT_area,
            DEFAULT_VALUE_area,
            KEYWORD_area_LIST;

        CID = -1;
        PID = -1;
        DataAll = DataAllProvince = DataAllCity = [];
        Temp = {
            Active: true,
            CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
            Creator: window.parent.User_Info.Name,
            CreatorID: 0,
            Editor: window.parent.User_Info.Name,
            EditorID: 0,
            EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
            ID: 0,
            Name: "",
            ParentID: 0,
            RegionList: [],
        };

        HTML = {
            TreeItemNode: [
                '<li data-titie="{{Name}}"  data-value="{{Name}}" >',
                '<span style="vertical-align:top;" data-value="{{ID}}"}" >{{Name}}</span> ',
                '<ul>{{Items}}',
                '</ul>',
                '</li>',
            ].join(""),

            TableAreaNode: [
                '<tr data-color="">',
                '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
                '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',

                '<td data-title="Creator" data-value="{{Creator}}" >{{Creator}}</td>',
                '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
                '<td data-title="Editor" data-value="{{Editor}}" >{{Editor}}</td>',
                '<td data-title="EditTime" data-value="{{EditTime}}" >{{EditTime}}</td>',
                '<td data-title="Active" data-value="{{Active}}" >{{Active}}</td>',
                '</tr>',
            ].join(""),
        };

        //地区表
        $(function () {
            KEYWORD_area_LIST = [
                "Name|名称",
                "Active|状态|ArrayOne",
                "Creator|创建者",
                "CreateTime|创建时间|DateTime",
                "Editor|编辑者",
                "EditTime|编辑时间|DateTime",

            ];
            KEYWORD_area = {};
            FORMATTRT_area = {};

            DEFAULT_VALUE_area = {
                Name: "",
                // Active: true,
            };

            TypeSource_area = {
                Active: [
                    {
                        name: "禁用",
                        value: false,
                    }, {
                        name: "激活",
                        value: true,
                    },
                ],

            };

            $.each(KEYWORD_area_LIST, function (i, item) {
                var detail = item.split("|");
                KEYWORD_area[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined,
                };
                if (detail.length > 2) {
                    FORMATTRT_area[detail[0]] = $com.util.getFormatter(TypeSource_area, detail[0], detail[2]);
                }
            });
        });

        model = $com.Model.create({
            name: 'iPlant.MES',

            type: $com.Model.MAIN,

            configure: function () {

                this.run();

            },

            events: function () {
                //=========国家
                //新增
                $("body").delegate("#zace-add-area", "click", function () {

                    //将Json数据中的数据值改成对应默认值，然后传入进去
                    $("body").append($com.modal.show(DEFAULT_VALUE_area, KEYWORD_area, "新增", function (rst) {
                        //调用插入函数

                        if (!rst || $.isEmptyObject(rst))
                            return;

                        //Temp.Active = rst.Active;
                        Temp.Name = rst.Name;
                        model.com.updateAreaTree({
                            data: Temp,
                        }, function (res) {
                            alert("新增成功");
                            model.com.refresh();
                        });

                    }, TypeSource_area));

                });
                //修改
                $("body").delegate("#zace-edit-area", "click", function () {

                    var SelectData = $com.table.getSelectionData($("#zace-Area-tbody"), "ID", DataAll);
                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！");
                        return;
                    }
                    if (SelectData.length != 1) {
                        alert("只能同时对一行数据修改！");
                        return;
                    }

                    var default_value = {
                        Name: SelectData[0].Name,
                    };

                    $("body").append($com.modal.show(default_value, KEYWORD_area, "修改", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        SelectData[0].Name = rst.Name;
                        model.com.updateAreaTree({
                            data: SelectData[0],
                        }, function (res) {
                            alert("修改成功");
                            model.com.refresh();
                        });

                    }, TypeSource_area));
                });
                //激活
                $("body").delegate("#zace-active-area", "click", function () {

                    var SelectData = $com.table.getSelectionData($("#zace-Area-tbody"), "ID", DataAll);

                    if (!SelectData || !SelectData.length) {
                        alert("至少选择一行数据！");
                        return;
                    }
                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其激活？")) {
                        return;
                    }
                    model.com.activeAreaTree({
                        data: SelectData,
                        active: 1,
                    }, function (res) {
                        alert("激活成功");
                        model.com.refresh();
                    });
                });
                //禁用
                $("body").delegate("#zace-dasable-area", "click", function () {

                    var SelectData = $com.table.getSelectionData($("#zace-Area-tbody"), "ID", DataAll);

                    if (!SelectData || !SelectData.length) {
                        alert("至少选择一行数据！");
                        return;
                    }
                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其禁用？")) {
                        return;
                    }
                    model.com.activeAreaTree({
                        data: SelectData,
                        active: 0,
                    }, function (res) {
                        alert("禁用成功");
                        model.com.refresh();
                    });
                });
                //删除
                $("body").delegate("#zace-remove-area", "click", function () {

                    var SelectData = $com.table.getSelectionData($("#zace-Area-tbody"), "ID", DataAll);

                    if (!SelectData || !SelectData.length) {
                        alert("至少选择一行数据！");
                        return;
                    }
                    if (SelectData.length != 1) {
                        alert("只能同时对一行数据操作！");
                        return;
                    }

                    if (!confirm("确定将其删除？")) {
                        return;
                    }

                    model.com.removeAreaTree({
                        data: SelectData[0],
                    }, function (res) {
                        alert("删除成功");
                        model.com.refresh();
                    });
                });
                //模糊查询
                $("body").delegate("#femi-search-text-ledger", "change", function () {
                    var $this = $(this),
                        value = $(this).val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#zace-Area-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#zace-Area-tbody"), DataAll, value, "ID");
                });

                //==========省份
                //新增
                $("body").delegate("#zace-add-areaP", "click", function () {

                    //将Json数据中的数据值改成对应默认值，然后传入进去
                    $("body").append($com.modal.show(DEFAULT_VALUE_area, KEYWORD_area, "新增", function (rst) {
                        //调用插入函数

                        if (!rst || $.isEmptyObject(rst))
                            return;

                        // Temp.Active = rst.Active;
                        Temp.Name = rst.Name;
                        Temp.ParentID = CID;
                        model.com.updateAreaTree({
                            data: Temp,
                        }, function (res) {
                            alert("新增成功");
                            model.com.refresh();
                        });

                    }, TypeSource_area));

                });
                //修改
                $("body").delegate("#zace-edit-areaP", "click", function () {

                    var SelectData = $com.table.getSelectionData($("#zace-AreaProvince-tbody"), "ID", DataAllProvince);
                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！");
                        return;
                    }
                    if (SelectData.length != 1) {
                        alert("只能同时对一行数据修改！");
                        return;
                    }

                    var default_value = {
                        Name: SelectData[0].Name,
                    };

                    $("body").append($com.modal.show(default_value, KEYWORD_area, "修改", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        SelectData[0].Name = rst.Name;
                        model.com.updateAreaTree({
                            data: SelectData[0],
                        }, function (res) {
                            alert("修改成功");
                            model.com.refresh();
                        });

                    }, TypeSource_area));
                });
                //激活
                $("body").delegate("#zace-active-areaP", "click", function () {

                    var SelectData = $com.table.getSelectionData($("#zace-AreaProvince-tbody"), "ID", DataAllProvince);

                    if (!SelectData || !SelectData.length) {
                        alert("至少选择一行数据！");
                        return;
                    }
                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其激活？")) {
                        return;
                    }
                    model.com.activeAreaTree({
                        data: SelectData,
                        active: 1,
                    }, function (res) {
                        alert("激活成功");
                        model.com.refresh();
                    });
                });
                //禁用
                $("body").delegate("#zace-dasable-areaP", "click", function () {

                    var SelectData = $com.table.getSelectionData($("#zace-AreaProvince-tbody"), "ID", DataAllProvince);

                    if (!SelectData || !SelectData.length) {
                        alert("至少选择一行数据！");
                        return;
                    }
                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其禁用？")) {
                        return;
                    }
                    model.com.activeAreaTree({
                        data: SelectData,
                        active: 0,
                    }, function (res) {
                        alert("禁用成功");
                        model.com.refresh();
                    });
                });
                //删除
                $("body").delegate("#zace-remove-areaP", "click", function () {

                    var SelectData = $com.table.getSelectionData($("#zace-AreaProvince-tbody"), "ID", DataAllProvince);

                    if (!SelectData || !SelectData.length) {
                        alert("至少选择一行数据！");
                        return;
                    }
                    if (SelectData.length != 1) {
                        alert("只能同时对一行数据操作！");
                        return;
                    }
                    if (!confirm("条确定将其删除？")) {
                        return;
                    }
                    model.com.removeAreaTree({
                        data: SelectData[0],
                    }, function (res) {
                        alert("删除成功");
                        model.com.refresh();
                    });
                });
                //模糊查询
                $("body").delegate("#femi-search-text-ledgerP", "change", function () {
                    var $this = $(this),
                        value = $(this).val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#zace-AreaProvince-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#zace-AreaProvince-tbody"), DataAllProvince, value, "ID");
                });


                //=======城市
                //新增
                $("body").delegate("#zace-add-areaC", "click", function () {

                    //将Json数据中的数据值改成对应默认值，然后传入进去
                    $("body").append($com.modal.show(DEFAULT_VALUE_area, KEYWORD_area, "新增", function (rst) {
                        //调用插入函数

                        if (!rst || $.isEmptyObject(rst))
                            return;

                        //Temp.Active = rst.Active;
                        Temp.Name = rst.Name;
                        Temp.ParentID = PID;
                        model.com.updateAreaTree({
                            data: Temp,
                        }, function (res) {
                            alert("新增成功");
                            model.com.refresh();
                        });

                    }, TypeSource_area));

                });
                //修改
                $("body").delegate("#zace-edit-areaC", "click", function () {

                    var SelectData = $com.table.getSelectionData($("#zace-AreaCity-tbody"), "ID", DataAllCity);
                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！");
                        return;
                    }
                    if (SelectData.length != 1) {
                        alert("只能同时对一行数据修改！");
                        return;
                    }

                    var default_value = {
                        Name: SelectData[0].Name,
                    };

                    $("body").append($com.modal.show(default_value, KEYWORD_area, "修改", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        SelectData[0].Name = rst.Name;
                        model.com.updateAreaTree({
                            data: SelectData[0],
                        }, function (res) {
                            alert("修改成功");
                            model.com.refresh();
                        });

                    }, TypeSource_area));
                });
                //激活
                $("body").delegate("#zace-active-areaC", "click", function () {

                    var SelectData = $com.table.getSelectionData($("#zace-AreaCity-tbody"), "ID", DataAllCity);

                    if (!SelectData || !SelectData.length) {
                        alert("至少选择一行数据！");
                        return;
                    }
                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其激活？")) {
                        return;
                    }
                    model.com.activeAreaTree({
                        data: SelectData,
                        active: 1,
                    }, function (res) {
                        alert("激活成功");
                        model.com.refresh();
                    });
                });
                //禁用
                $("body").delegate("#zace-dasable-areaC", "click", function () {

                    var SelectData = $com.table.getSelectionData($("#zace-AreaCity-tbody"), "ID", DataAllCity);

                    if (!SelectData || !SelectData.length) {
                        alert("至少选择一行数据！");
                        return;
                    }
                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其禁用？")) {
                        return;
                    }
                    model.com.activeAreaTree({
                        data: SelectData,
                        active: 0,
                    }, function (res) {
                        alert("禁用成功");
                        model.com.refresh();
                    });
                });
                //删除
                $("body").delegate("#zace-remove-areaC", "click", function () {

                    var SelectData = $com.table.getSelectionData($("#zace-AreaCity-tbody"), "ID", DataAllCity);

                    if (!SelectData || !SelectData.length) {
                        alert("至少选择一行数据！");
                        return;
                    }
                    if (SelectData.length != 1) {
                        alert("只能同时对一行数据操作！");
                        return;
                    }
                    if (!confirm("条确定将其删除？")) {
                        return;
                    }
                    model.com.removeAreaTree({
                        data: SelectData[0],
                    }, function (res) {
                        alert("删除成功");
                        model.com.refresh();
                    });
                });
                //模糊查询
                $("body").delegate("#femi-search-text-ledgerC", "change", function () {
                    var $this = $(this),
                        value = $(this).val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#zace-AreaCity-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#zace-AreaCity-tbody"), DataAllCity, value, "ID");
                });


                $("body").delegate("#areaTree li span", "click", function () {
                    var $this = $(this);

                    if ($(this).parents("li").parents("li").length > 0) {
                        if ($(this).parents("li").parents("li").parents("li").length > 0) {
                            //城市
                            //alert("city");
                            return false;
                        } else {

                            $(".zzzArea").hide();
                            $(".zzzP").hide();
                            $(".zzzC").show();
                            PID = Number($this.attr("data-value"));
                            //var $far = $this.closest("ul").closest("li");
                            var name = $this.parents("li").attr("data-value");
                            var Pprovince = $(this).parents("li").parents("li").attr("data-value");
                            $(".zace-provinceC").html(Pprovince);
                            $(".zace-cityC").html(name);

                            //alert("province");
                            model.com.refresh();
                            return false;

                        }

                    } else {
                        //国家表
                        $(".zzzArea").hide();
                        $(".zzzP").show();
                        $(".zzzC").hide();
                        //alert("country");
                        var name = $this.parents("li").attr("data-value");
                        $(".zace-provinceP").html(name);
                        CID = Number($this.attr("data-value"));
                        model.com.refresh();
                        return false;


                    }
                });

                $("body").delegate("#zace-tree-country", "click", function () {
                    var $this = $(this),
                        CID = $this.attr("data-value");
                    $(".zzzArea").show();
                    $(".zzzP").hide();
                    $(".zzzC").hide();
                });

            },

            run: function () {
                model.com.refresh();
            },
            com: {
                //得到区域树形图
                getAreaTree: function (data, fn, context) {
                    var d = {
                        $URI: "/Area/Tree",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //根据父级ID 拿子项
                getAreaItems: function (data, fn, context) {
                    var d = {
                        $URI: "/Area/Items",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                //更新
                updateAreaTree: function (data, fn, context) {
                    var d = {
                        $URI: "/Area/Update",
                        $TYPE: "post",
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //激活
                activeAreaTree: function (data, fn, context) {
                    var d = {
                        $URI: "/Area/Active",
                        $TYPE: "post",
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                removeAreaTree: function (data, fn, context) {
                    var d = {
                        $URI: "/Area/Remove",
                        $TYPE: "post",
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                refresh: function () {
                    model.com.getAreaTree({}, function (resR) {
                        if (resR && resR.list) {
                            var _list = $com.util.Clone(resR.list);
                            $.each(_list, function (i, item) {
                                for (var p in item) {
                                    if (!FORMATTRT_area[p])
                                        continue;
                                    item[p] = FORMATTRT_area[p](item[p]);
                                }
                            });
                            DataAll = $com.util.Clone(resR.list);
                            model.com.renderTree(DataAll);
                            $("#zace-Area-tbody").html($com.util.template(_list, HTML.TableAreaNode));
                            $("#femi-Area-tbody tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);


                            });
                        }
                        model.com.getAreaItems({ID: CID}, function (resT) {
                            if (resT && resT.list) {
                                var _list = $com.util.Clone(resT.list);
                                $.each(_list, function (i, item) {
                                    for (var p in item) {
                                        if (!FORMATTRT_area[p])
                                            continue;
                                        item[p] = FORMATTRT_area[p](item[p]);
                                    }
                                });
                                DataAllProvince = $com.util.Clone(resT.list);
                                $("#zace-AreaProvince-tbody").html($com.util.template(_list, HTML.TableAreaNode));
                                $("#femi-AreaProvince-tbody tr").each(function (i, item) {
                                    var $this = $(this);
                                    var colorName = $this.css("background-color");
                                    $this.attr("data-color", colorName);


                                });
                            }
                        });

                        model.com.getAreaItems({ID: PID}, function (resP) {
                            if (resP && resP.list) {

                                var _list = $com.util.Clone(resP.list);
                                $.each(_list, function (i, item) {
                                    for (var p in item) {
                                        if (!FORMATTRT_area[p])
                                            continue;
                                        item[p] = FORMATTRT_area[p](item[p]);
                                    }
                                });
                                DataAllCity = $com.util.Clone(resP.list);
                                $("#zace-AreaCity-tbody").html($com.util.template(_list, HTML.TableAreaNode));
                                $("#femi-AreaCity-tbody tr").each(function (i, item) {
                                    var $this = $(this);
                                    var colorName = $this.css("background-color");
                                    $this.attr("data-color", colorName);


                                });
                            }
                        });


                    });


                    window.parent._zaceAreaSet = 1;


                },
                renderTree: function (list) {
                    //list  ： Type List
                    model._treeData = list;

                    model.com.fullItems(list);

                    $("#areaTree").html($com.util.template(list, HTML.TreeItemNode));
                    $("#areaTree").treeview();
                },

                fullItems: function (list) {

                    $.each(list, function (i, item) {

                        model.com.fullItems(item.RegionList);

                        item.Items = $com.util.template(item.RegionList, HTML.TreeItemNode);


                    });
                },


            },
        });

        model.init();
    });