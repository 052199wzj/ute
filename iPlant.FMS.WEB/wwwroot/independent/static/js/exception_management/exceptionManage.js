require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'],
    function ($lin, $com) {

        var HTML,
            //编码集合
            CodeList,
            //异常地点集合
            EXCStationSource,
            EXCStationList,
            //异常类型
            EXCTypeSource,
            EXCTypeList,
            //全局ID
            StationPointID,
            //人员信息
            UserAll,
            //类型
            Defaul_Value_Type,
            KETWROD_LIST_Type,
            KETWROD_Type,
            Formattrt_Type,
            TypeSource_Type,
            //规则
            Defaul_Value_Rule,
            KETWROD_LIST_Rule,
            KETWROD_Rule,
            Formattrt_Rule,
            TypeSource_Rule,
            partSource;

        HTML = {
            EXCStationModeList: [
                '<tr data-color="">',
                '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></th>',
                '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
                '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',

                '<td style="min-width: 60px" data-title="StationNo" data-value="{{StationNo}}">{{StationNo}}</td>',
                '<td style="min-width: 60px" data-title="StationName" data-value="{{StationName}}">{{StationName}}</td>',
                '<td style="min-width: 50px" data-title="StationType" data-value="{{StationType}}">{{StationType}}</td>',
                //'<td style="min-width: 50px" data-title="RelevancyType" data-value="{{RelevancyType}}" >{{ RelevancyType}}</td>',
                '<td style="min-width: 50px" data-title="CreatorID" data-value="{{CreatorID}}">{{CreatorID}}</td>',
                '<td style="min-width: 80px" data-title="CreateTime" data-value="{{CreateTime}}">{{CreateTime}}</td>',
                '<td style="min-width: 80px" data-title="EditorID" data-value="{{EditorID}}">{{EditorID}}</td>',
                '<td style="min-width: 80px" data-title="EditTime" data-value="{{EditTime}}">{{EditTime}}</td>',
                '<td style="min-width: 50px" data-title="Active" data-value="{{Active}}"><span class="badge lmvt-badge {{ClassBadge}}">{{Badge}}</span>{{Active}}</td>',

                '<td style="min-width: 40px" data-title="Handle" data-value="{{ID}}"><div class="row">',
                '<div class="col-md-6 {{ISAllowed}} ">{{ISAllowedText}}</div>',
                '<div class="col-md-6 lmvt-do-info">修改</div>',
                '</td>',

                '</tr>'
            ].join(""),

            EXCStationTypeList: [
                '<tr data-color="">',
                '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></th>',
                '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
                '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',

                '<td style="min-width: 80px" data-title="Name" data-value="{{Name}}">{{Name}}</td>',
                //'<td style="min-width: 50px" data-title="RelevancyType" data-value="{{RelevancyType}}">{{RelevancyType}}</td>',
                '<td style="min-width: 80px" data-title="CreatorID" data-value="{{CreatorID}}">{{CreatorID}}</td>',
                '<td style="min-width: 50px" data-title="CreateTime" data-value="{{CreateTime}}">{{CreateTime}}</td>',
                '<td style="min-width: 80px" data-title="EditorID" data-value="{{EditorID}}">{{EditorID}}</td>',
                '<td style="min-width: 50px" data-title="EditTime" data-value="{{EditTime}}">{{EditTime}}</td>',

                '<td style="min-width: 50px" data-title="Active" data-value="{{Active}}"><span class="badge lmvt-badge {{ClassBadge}}">{{Badge}}</span>{{Active}}</td>',

                '<td style="min-width: 40px" data-title="Handle" data-value="{{ID}}"><div class="row">',
                '<div class="col-md-6 {{ISAllowed}} ">{{ISAllowedText}}</div>',
                '<div class="col-md-6 lmvt-do-info">修改</div>',
                '</td>',

                '</tr>',
            ].join(""),


        };

        //新增异常类型
        Defaul_Value_Type = {
            Name: "",
            //RelevancyType: 0,
            //Active: 1,
        };
        (function () {

            KETWROD_LIST_Type = [
                "Name|名称",
                "RelevancyType|关联类型|ArrayOne",
                "StationType|地点类型|ArrayOne",
                "Active|状态|ArrayOne",
                "CreateTime|时间|DateTime",
                "EditTime|时间|DateTime"
            ];

            KETWROD_Type = {};

            Formattrt_Type = {};

            TypeSource_Type = {
                RelevancyType: [
                    {
                        name: "默认",
                        value: 0
                    },
                    {
                        name: "事业部",
                        value: 1
                    },
                    {
                        name: "工厂",
                        value: 2
                    },
                    {
                        name: "车间",
                        value: 3
                    },
                    {
                        name: "产线",
                        value: 4
                    },
                    {
                        name: "工位",
                        value: 5
                    },
                    {
                        name: "仓库",
                        value: 6
                    },
                    {
                        name: "仓位",
                        value: 7
                    },
                    {
                        name: "设备",
                        value: 8
                    },
                    {
                        name: "备件",
                        value: 9
                    },
                ],
                Active: [
                    {
                        name: "启用",
                        value: 1
                    },
                    {
                        name: "禁用",
                        value: 0
                    }
                ],
                StationType: []
            };

            $.each(KETWROD_LIST_Type, function (i, item) {
                var detail = item.split("|");
                KETWROD_Type[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_Type[detail[0]] = $com.util.getFormatter(TypeSource_Type, detail[0], detail[2]);
                }
            });
        })();

        model = $com.Model.create({
            name: '异常管理',

            type: $com.Model.MAIN,

            configure: function () {
                this.run();
            },

            events: function () {
                $("body").delegate(".lmvt-encoding-body tr", "bdclick", function () {
                    var $this = $(this),
                        id = Number($this.find("td[data-title=ID]").attr("data-value"));
                    $.each(CodeList, function (i, item) {
                        //if(id == )
                    });
                });
                $("body").delegate("#lmvt-type-zace", "click", function () {
                    model.com.refresh();
                });
                $("body").delegate("#lmvt-type-zacePlace", "click", function () {
                    model.com.render();
                });
                //异常类型
                $("body").delegate("#lmvt-type", "click", function () {
                    window.parent.iframeHeaderSet({ header: "异常类型", href: "./exception_management/ExceptionTypeMag.html", id: "ExceptionTypeMag", src: "./static/images/menu/basicSet/workingProcess.png" });
                });
                //异常规则
                $("body").delegate("#lmvt-rule", "click", function () {
                    window.parent.iframeHeaderSet({ header: "异常规则", href: "./exception_management/ExceptionTypePos.html", id: "ExceptionTypePos", src: "./static/images/menu/basicSet/workingProcess.png" });
                });
                //双击地点名称
                $("body").delegate(".lmvt-Station-body tr", "dblclick", function () {
                    var $this = $(this),
                        id = $this.find("td[data-title=ID]").attr("data-value"),
                        StationPointID = id;
                    model.com.RendarStationType(StationPointID);
                });

                $("body").delegate("#lmvt-station-type", "click", function () {
                    $(".lmvt-container-main-exception").css("width", "58%");
                    $(".lmvt-container-main-exception").css("padding-right", "10px");
                    $(".lmvt-container-typt-exception").show();
                    model.com.render();
                });

                //$("body").delegate(".femi-tb-scroll table.table  tr", "click", function (e) {
                //    var $this = $(this),
                //        checkboxID = $this.find("td[data-title=ID]").attr("data-value");
                //    if ($this.children('th')[0]) {
                //        return true;
                //    }

                //    $(".femi-tb-scroll table.table  tr td input[type=checkbox].femi-tb-checkbox").each(function (i, item) {
                //        if (checkboxID == $(item).parent().next().attr("data-value"))
                //            return true;
                //        else
                //            $(item).prop("checked", false);
                //    })

                //});
                ////表格行的点击事件 为点击checked做处理
                //$("body").delegate(".feemi-tb-scroll table.tabl tr td input[type=checkbox].femi-tb-checkbox", "click", function (e) {
                //    var $this = $(this),
                //        checkboxID = $this.parent().parent().find("td[data-title=ID]").attr("data-value");

                //    $(".femi-tb-scroll table.table  tr td input[type=checkbox].femi-tb-checkbox").each(function (i, item) {
                //        if (checkboxID == $(item).parent().next().attr("data-value"))
                //            return true;
                //        else
                //            $(item).prop("checked", false);
                //    })

                //});

                //修改异常地点TypeSource_Type.StationType
                $("body").delegate("#lmvt-table-change", "click", function () {

                    var SelectData = $com.table.getSelectionData($(".lmvt-Station-body"), "ID", EXCStationSource);
                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return;
                    }
                    if (SelectData.length != 1) {
                        alert("只能同时对一行数据修改！")
                        return;
                    }
                    var default_value = {
                        StationType: SelectData[0].StationType,
                        Active: SelectData[0].Active,
                    };
                    $("body").append($com.modal.show(default_value, KETWROD_Type, "修改", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;

                        SelectData[0].StationType = rst.StationType;
                        SelectData[0].Active = Number(rst.Active);
                        for (var i = 0; i < SelectData.length; i++) {
                            $com.util.deleteLowerProperty(SelectData[i]);
                        }

                        model.com.postEXCStationUpdate({
                            data: SelectData[0],
                        }, function (res) {
                            alert("修改成功！！");
                            model.com.refresh();
                        });

                    }, TypeSource_Type));

                });
                //修改 单条
                $("body").delegate(".lmvt-Station-body .lmvt-do-info", "click", function () {

                    var $this = $(this),
                        wID = Number($this.closest("td").attr("data-value"));

                    var SelectData = EXCStationSource.filter((item) => { return item.ID == wID });

                    var default_value = {
                        StationType: SelectData[0].StationType,
                        //Active: SelectData[0].Active,
                    };
                    $("body").append($com.modal.show(default_value, KETWROD_Type, "修改", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;

                        SelectData[0].StationType = rst.StationType;
                        //SelectData[0].Active = Number(rst.Active);

                        $com.util.deleteLowerProperty(SelectData);

                        model.com.postEXCStationUpdate({
                            data: SelectData[0],
                        }, function (res) {
                            alert("修改成功！！");
                            model.com.refresh();
                        });

                    }, TypeSource_Type));
                });

                //激活 单条
                $("body").delegate(".lmvt-Station-body .lmvt-do-active", "click", function () {

                    var $this = $(this),
                        wID = Number($this.closest("td").attr("data-value"));

                    var SelectData = EXCStationSource.filter((item) => { return item.ID == wID });

                    SelectData[0].Active = 1;

                    $com.util.deleteLowerProperty(SelectData);

                    model.com.postEXCStationUpdate({
                        data: SelectData[0],
                    }, function (res) {
                        alert("激活成功！！");
                        model.com.refresh();
                    });

                });
                //禁用 单条
                $("body").delegate(".lmvt-Station-body .lmvt-do-forbidden", "click", function () {

                    var $this = $(this),
                        wID = Number($this.closest("td").attr("data-value"));

                    var SelectData = EXCStationSource.filter((item) => { return item.ID == wID });

                    SelectData[0].Active = 0;

                    $com.util.deleteLowerProperty(SelectData);

                    model.com.postEXCStationUpdate({
                        data: SelectData[0],
                    }, function (res) {
                        alert("禁用成功！！");
                        model.com.refresh();
                    });

                });

                //新增类型
                $("body").delegate("#lmvt-type-add", "click", function () {
                    $("body").append($com.modal.show(Defaul_Value_Type, KETWROD_Type, "新增", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }

                        var _data = {
                            ID: 0,
                            Name: rst.Name,
                            RelevancyType: 0,
                            Active: 1,
                            CreateTime: new Date(),
                            EditTime: new Date(),
                        };

                        model.com.postEXCStationTypeUpdate({
                            data: _data,
                        }, function (res) {
                            alert("新增成功！！");
                            model.com.render();

                        });

                    }, TypeSource_Type));
                });
                //修改
                $("body").delegate("#lmvt-type-change", "click", function () {

                    var SelectData = $com.table.getSelectionData($(".lmvt-type-body"), "ID", EXCTypeSource);
                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return;
                    }
                    if (SelectData.length != 1) {
                        alert("只能同时对一行数据修改！")
                        return;
                    }
                    var default_value = {
                        Name: SelectData[0].Name,
                        // RelevancyType: SelectData[0].RelevancyType,
                        Active: SelectData[0].Active,
                    };
                    $("body").append($com.modal.show(default_value, KETWROD_Type, "修改", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;

                        SelectData[0].Name = rst.Name;
                        //SelectData[0].RelevancyType = Number(rst.RelevancyType);
                        SelectData[0].Active = Number(rst.Active);
                        for (var i = 0; i < SelectData.length; i++) {
                            $com.util.deleteLowerProperty(SelectData[i]);

                        }
                        model.com.postEXCStationTypeUpdate({
                            data: SelectData[0],
                        }, function (res) {
                            alert("修改成功！！");
                            model.com.render();
                        });

                    }, TypeSource_Type));

                });

                //修改 单条
                $("body").delegate(".lmvt-type-body .lmvt-do-info", "click", function () {

                    var $this = $(this),
                        wID = Number($this.closest("td").attr("data-value"));

                    var SelectData = EXCTypeSource.filter((item) => { return item.ID == wID });


                    var default_value = {
                        Name: SelectData[0].Name,
                        // RelevancyType: SelectData[0].RelevancyType,
                        //Active: SelectData[0].Active,
                    };
                    $("body").append($com.modal.show(default_value, KETWROD_Type, "修改", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;

                        SelectData[0].Name = rst.Name;
                        //SelectData[0].RelevancyType = Number(rst.RelevancyType);
                        //SelectData[0].Active = Number(rst.Active);
                        $com.util.deleteLowerProperty(SelectData);

                        model.com.postEXCStationTypeUpdate({
                            data: SelectData[0],
                        }, function (res) {
                            alert("修改成功！！");
                            model.com.render();
                        });

                    }, TypeSource_Type));

                });

                //启用
                $("body").delegate("#lmvt-type-active", "click", function () {

                    var SelectData = $com.table.getSelectionData($(".lmvt-type-body"), "ID", EXCTypeSource);
                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return;
                    }
                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其启用？")) {
                        return;
                    }

                    for (var i = 0; i < SelectData.length; i++) {
                        $com.util.deleteLowerProperty(SelectData[i]);
                    }
                    model.com.postEXCStationTypeActive({
                        data: SelectData,
                        Active: 1
                    }, function (res) {
                        alert("启用成功！！");
                        model.com.render();
                    });
                });

                //启用 单条
                $("body").delegate(".lmvt-type-body .lmvt-do-active", "click", function () {

                    var $this = $(this),
                        wID = Number($this.closest("td").attr("data-value"));

                    var SelectData = EXCTypeSource.filter((item) => { return item.ID == wID });

                    $com.util.deleteLowerProperty(SelectData);

                    model.com.postEXCStationTypeActive({
                        data: SelectData,
                        Active: 1
                    }, function (res) {
                        alert("启用成功！！");
                        model.com.render();
                    });
                });

                //冻结
                $("body").delegate(".lmvt-type-body .lmvt-do-forbidden", "click", function () {
                    var $this = $(this),
                        wID = Number($this.closest("td").attr("data-value"));

                    var SelectData = EXCTypeSource.filter((item) => { return item.ID == wID });

                    $com.util.deleteLowerProperty(SelectData);

                    model.com.postEXCStationTypeActive({
                        data: SelectData,
                        Active: 0
                    }, function (res) {
                        alert("禁用成功！！");
                        model.com.render();
                    });
                });
                //返回
                $("body").delegate("#lmvt-type-back", "click", function () {
                    $(".lmvt-container-main-exception").css("width", "100%");
                    $(".lmvt-container-main-exception").css("padding-right", "0px");
                    $(".lmvt-container-typt-exception").hide();
                });
            },
            run: function () {
                //model.com.getUserAll({ active: -1 }, function (res) {
                //    if (!res)
                //        return;
                //    var list = res.list,
                //        rst = [];
                //    if (list) {
                //        UserAll = $com.util.Clone(res.list);
                //        model.com.refresh();
                //    }
                //});
                UserAll = window.parent._UserAll;
                model.com.getEXCStationTypeAll({ RelevancyType: -1, Name: "", Active: -1 }, function (res) {
                    if (!res)
                        return;
                    var list = res.list,
                        rst = [];
                    if (list) {
                        $.each(res.list, function (i, item) {
                            TypeSource_Type.StationType.push({
                                name: item.Name,
                                value: item.ID
                            });
                        });
                        model.com.refresh();
                    }
                });
            },
            com: {
                //获取异常申请
                getCodeDefinitionAll: function (data, fn, context) {
                    var d = {
                        $URI: "/CRDCodeDefinition/All",
                        $TYPE: "get",
                        $SERVER: "/MESQMS"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取异常地点
                getEXCStationAll: function (data, fn, context) {
                    var d = {
                        $URI: "/EXCStation/All",
                        $TYPE: "get",
                        $SERVER: "/MESQMS"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取异常地点类型
                getEXCStationTypeInfo: function (data, fn, context) {
                    var d = {
                        $URI: "/EXCStationType/Info",
                        $TYPE: "get",
                        $SERVER: "/MESQMS"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取异常地点类型集合
                getEXCStationTypeAll: function (data, fn, context) {
                    var d = {
                        $URI: "/EXCStationType/All",
                        $TYPE: "get",
                        $SERVER: "/MESQMS"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //人员信息
                getUserAll: function (data, fn, context) {
                    var d = {
                        $URI: "/User/All",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //增加修改
                postEXCStationTypeUpdate: function (data, fn, context) {
                    var d = {
                        $URI: "/EXCStationType/Update",
                        $TYPE: "post",
                        $SERVER: "/MESQMS"
                    };
                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //启用关闭
                postEXCStationTypeActive: function (data, fn, context) {
                    var d = {
                        $URI: "/EXCStationType/Active",
                        $TYPE: "post",
                        $SERVER: "/MESQMS"
                    };
                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //修改地点
                postEXCStationUpdate: function (data, fn, context) {
                    var d = {
                        $URI: "/EXCStation/Update",
                        $TYPE: "post",
                        $SERVER: "/MESQMS"
                    };
                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                refresh: function () {
                    //model.com.getCodeEntryAll({}, function (res) {
                    //    if (!res)
                    //        return;
                    //    var list = res.list,
                    //        rst = [];
                    //    if (list) {
                    //        //CodeSource = res.list
                    //        CodeSource = $com.util.Clone(res.list);
                    //        //CodeList = res.list;
                    //        CodeList = $com.util.Clone(res.list);
                    //        //$.each(CodeList, function (i, item) {
                    //        //    for (var p in item) {
                    //        //        if (!Formattrt_Code[p])
                    //        //            continue;
                    //        //        item[p] = Formattrt_Code[p](item[p]);
                    //        //    }
                    //        //});
                    //        $(".lmvt-Station-body").html($com.util.template(CodeList, HTML.EXCStationList));

                    //    }

                    //});
                    //所有异常点
                    model.com.getEXCStationAll({ RelevancyType: -1, RelevancyID: -1, StationType: -1, StationName: "", Active: -1 }, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];
                        if (list) {
                            //CodeSource = res.list
                            EXCStationSource = $com.util.Clone(res.list);
                            //CodeList = res.list;
                            EXCStationList = $com.util.Clone(res.list);
                            $.each(EXCStationList, function (i, item) {

                                item.Badge = " ";

                                if (item.Active == 1) {
                                    item.ISAllowedText = "禁用";
                                    item.ISAllowed = "lmvt-do-forbidden";
                                    item.ClassBadge = "lmvt-activeBadge";
                                } else {
                                    item.ISAllowedText = "启用";
                                    item.ISAllowed = "lmvt-do-active";
                                    item.ClassBadge = "lmvt-forbiddenBadge";
                                }

                                for (var p in item) {
                                    if (!Formattrt_Type[p])
                                        continue;
                                    item[p] = Formattrt_Type[p](item[p]);
                                }
                                item.CreatorID = model.com.GetUser(item.CreatorID);
                                item.EditorID = model.com.GetUser(item.EditorID);
                                item.WID = i + 1;


                            });
                            $(".lmvt-Station-body").html($com.util.template(EXCStationList, HTML.EXCStationModeList));
                            $(".lmvt-Station-body tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);
                            });
                        }
                    });
                },
                render: function () {

                    model.com.getEXCStationTypeAll({ RelevancyType: -1, Name: "", Active: -1 }, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];
                        if (list) {
                            EXCTypeSource = $com.util.Clone(res.list);
                            EXCTypeList = $com.util.Clone(res.list);
                            $.each(EXCTypeList, function (i, item) {


                                item.Badge = " ";

                                if (item.Active == 1) {
                                    item.ISAllowedText = "禁用";
                                    item.ISAllowed = "lmvt-do-forbidden";
                                    item.ClassBadge = "lmvt-activeBadge";
                                } else {
                                    item.ISAllowedText = "启用";
                                    item.ISAllowed = "lmvt-do-active";
                                    item.ClassBadge = "lmvt-forbiddenBadge";
                                }

                                for (var p in item) {
                                    if (!Formattrt_Type[p])
                                        continue;
                                    item[p] = Formattrt_Type[p](item[p]);
                                }
                                item.CreatorID = model.com.GetUser(item.CreatorID);
                                item.EditorID = model.com.GetUser(item.EditorID);
                                item.WID = i + 1;
                            });
                            $(".lmvt-type-body").html($com.util.template(EXCTypeList, HTML.EXCStationTypeList));
                            $(".lmvt-type-body tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);



                            });
                        }
                    });
                },
                GetUser: function (id) {
                    var name;
                    $.each(UserAll, function (i, itme) {
                        if (id == itme.ID) {
                            name = itme.Name;
                            return name;
                        }
                    });
                    return name;
                },
            },


        });
        model.init();
    });