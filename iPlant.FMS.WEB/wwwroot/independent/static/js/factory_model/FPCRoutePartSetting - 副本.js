require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($zace, $com) {

    var KEYWORD_Level_LIST,
        KEYWORD_Level,
        FORMATTRT_Level,
        DEFAULT_VALUE_Level,
        TypeSource_Level,
        model,
        DataAll,
        DATABasic,
        DDDBasic,
        DataAllConfirmBasic,
        DataAllConfirmChange,
        DataAllConfirm,
        DataAllSearch,
        DataAllFactorySearch,
        DATARouteList,
        mPartID,
        RouteID,
        mPartName,
        HTML;
    mPartID = 0;
    RouteID = 0;
    mPartName = "";
    DataAll = DATARouteList = [];
    DATABasic = [];
    DDDBasic = [];
    DataAllConfirmBasic = [];
    DataAllConfirmChange = [];
    DataAllConfirm = [];
    DataAllFactorySearch = [];
    DataAllSearch = [];
    PositionTemp = {
        CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Creator: window.parent.User_Info.Name,
        CreatorID: 0,
        ID: 0,
        Name: "",
        OrderID: 1,
        PartID: 0,
        RouteID: 0,
        RouteName: "",
        VersionNo: "",
        PartPointList: [],
        PrevPartID: 0,
        NextPartIDMap: {}
    };









    ;
    HTML = {
        TableMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',

            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
            '<td style="display:none" data-title="RouteID" data-value="{{RouteID}}" >{{RouteID}}</td>',
            '<td data-title="RouteName" data-value="{{RouteName}}" >{{RouteName}}</td>',
            '<td data-title="VersionNo" data-value="{{VersionNo}}" >{{VersionNo}}</td>',
            '<td data-title="PartID" data-value="{{PartID}}" >{{PartID}}</td>',
            '<td data-title="PrevPartID" data-value="{{PrevPartID}}" >{{PrevPartID}}</td>',
            '<td data-title="OrderID" data-value="{{OrderID}}" >{{OrderID}}</td>',
            '<td data-title="Creator" data-value="{{Creator}}" >{{Creator}}</td>',
            '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
            '</tr>',
        ].join(""),
        TablePartMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',

            '<td data-title="PartPointName" data-value="{{PartPointName}}" >{{PartPointName}}</td>',
            '<td data-title="OrderID" data-value="{{OrderID}}" >{{OrderID}}</td>',
            '<td data-title="RouteName" data-value="{{RouteName}}" >{{RouteName}}</td>',
            '<td data-title="PartName" data-value="{{PartName}}" >{{PartName}}</td>',
            '</tr>',
        ].join(""),



    };
    (function () {
        KEYWORD_Level_LIST = [
            "Name|名称",

            "RouteID|工艺名称|ArrayOne",
            "RouteIDShow|产品路线|ArrayOne",
            "PartID|工位|ArrayOne",
            "PrevPartID|上层|ArrayOne",
            "OrderID|顺序",
            "CreateTime|时间|DateTime",
        ];
        KEYWORD_Level = {};
        FORMATTRT_Level = {};

        DEFAULT_VALUE_Level = {
            PartID: 0,
            Name: "",
            PrevPartID: 0,
            OrderID: 1,
            RouteID: 0,
        };

        TypeSource_Level = {
            RouteIDShow: [
                //{
                //    name: "全部",
                //    value: 0,
                //}
            ],
            RouteID: [
                {
                    name: "无",
                    value: 0,
                }
            ],
            PrevPartID: [
                {
                    name: "无",
                    value: 0,
                }
            ],
            PartID: [
                {
                    name: "无",
                    value: 0,
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


    model = $com.Model.create({
        name: '产品工序',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            $("body").delegate("#zace-zace-refresh", "click", function () {

                model.com.refresh();

            });
            //双击.
            $("body").delegate("#femi-riskLevel-tbody tr", "dblclick", function () {

                var $this = $(this);
                var $table = $this.closest("table");
                var WID = Number($this.find('td[data-title=ID]').attr('data-value'));
                var WRouteID = Number($this.find('td[data-title=RouteID]').attr('data-value'));
                mPartName = $this.find('td[data-title=PartID]').attr('data-value');
                RouteID = WRouteID;
                mPartID = WID;
                model.com.refreshPartPoint();

                $table.find("tbody tr").each(function (i, item) {
                    var $tr = $(this);

                    if (WID == Number($tr.find("td[data-title=ID]").attr("data-value"))) {
                        $tr.css('background-color', '#7bf1b5');
                        temp = true;

                    }
                    else {
                        if (!($tr.attr("data-color"))) {

                            $tr.css('background-color', '');
                        } else {

                            var colorPro = $tr.attr("data-color");
                            $tr.css('background-color', colorPro);
                        }
                    }
                });

                $(".zzzb").hide();
                //$(".zzza").css("width", "70%");
                //$(".zzzc").css("width", "29%");
                $(".zzzc").css("width", "400px");
                $(".zzza").css("margin-right", "400px");
                $(".zzzc").show();
                return false;
            });
            //Enter触发模糊查询事件
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var
                        value = $("#zace-search-level").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-riskLevel-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "ID");
                }
            });
            //工序段查询
            $("body").delegate("#zace-myAudit-levelZace", "click", function () {

                var
                    value = $("#zace-search-level").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "ID");



            });
            //工序段修改
            $("body").delegate("#zace-edit-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

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
                    // VersionNo: SelectData[0].VersionNo,
                    PartID: SelectData[0].PartID,
                    OrderID: SelectData[0].OrderID,
                    PrevPartID: SelectData[0].PrevPartID,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].Name = rst.Name;
                    // SelectData[0].VersionNo = rst.VersionNo;
                    SelectData[0].PartID = Number(rst.PartID);
                    SelectData[0].PrevPartID = Number(rst.PrevPartID);

                    SelectData[0].OrderID = Number(rst.OrderID);

                    if (Number(rst.OrderID) <= 0) {
                        alert("顺序大于0!")
                        return false;
                    }
                    for (var i = 0; i < SelectData.length; i++) {
                        $com.util.deleteLowerProperty(SelectData[i]);
                    }
                    model.com.postFPCRoutePart({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        $("#zace-closePart-level").click();
                        //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                        //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    })

                }, TypeSource_Level));


            });
            //工序段新增
            $("body").delegate("#zace-add-level", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    PositionTemp.PartID = Number(rst.PartID);
                    PositionTemp.RouteID = Number(rst.RouteID);
                    PositionTemp.Name = rst.Name;
                    PositionTemp.OrderID = Number(rst.OrderID);
                    PositionTemp.PrevPartID = Number(rst.PrevPartID);
                    // var _list = [];
                    // for (var i = 0; i < DataAll.length; i++) {
                    //     if (PositionTemp.RouteID == DataAll[i].RouteID) {
                    //         _list.push(DataAll[i]);
                    //     }
                    // }
                    // PositionTemp.OrderID = _list.length + 1;
                    model.com.postFPCRoutePart({
                        data: PositionTemp,
                    }, function (res) {
                        alert("新增成功");
                        $("#zace-closePart-level").click();
                    })

                }, TypeSource_Level));


            });

            //条件查询
            $("body").delegate("#zace-myAudit-level", "click", function () {
                var default_value = {
                    RouteIDShow: 0,
                };
                var default_valuePro = {
                    RouteID: 0,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.RouteIDShow = Number(rst.RouteIDShow);
                    default_valuePro.RouteID = default_value.RouteIDShow;
                    if (default_valuePro.RouteID != 0) {
                        $com.table.filterByConndition($("#femi-riskLevel-tbody"), DataAll, default_valuePro, "ID");
                    } else {

                        model.com.refresh();
                    }


                }, TypeSource_Level));


            });


            $("body").delegate("#zace-routePartPoint-level", "click", function () {
                var vdata = { 'header': '工艺工序', 'href': './factory_model/FPCRoutePartPointSetting.html', 'id': 'FPCRoutePartPoint', 'src': './static/images/menu/newfactoryModel/techniquePartpoint.png' };
                window.parent.iframeHeaderSet(vdata);

            });


            $("body").delegate("#zace-routeLine-level", "click", function () {
                var vdata = { 'header': '工艺路线', 'href': './factory_model/FPCRouteSetting.html', 'id': "50", 'src': './static/images/menu/newfactoryModel/techniqueRoute.png' };
                window.parent.iframeHeaderSet(vdata);

            });




            $("body").delegate("#zace-ProductRoute-level", "click", function () {
                var vdata = { 'header': '车型工艺路线', 'href': './factory_model/ProductRouteSetting.html', 'id': 'ProductRouteSetup', 'src': './static/images/menu/newfactoryModel/productTechniqueRoute.png' };
                window.parent.iframeHeaderSet(vdata);

            });

            //上移
            $("body").delegate("#zace-up-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), 'ID', DDDBasic);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                } else if (SelectData.length > 1) {
                    alert(" 一次只能对一行数据移动！")
                    return;
                }
                //判断是否在第一行
                if (SelectData[0].OrderID == 1) {
                    alert("已在第一项！！！");
                    return;
                }

                SelectData[0].OrderID -= 1;
                var upData = model.com.getDataOne(SelectData[0].RouteID, SelectData[0].OrderID);
                upData[0].OrderID += 1;

                $com.util.deleteLowerProperty(SelectData[0]);
                $com.util.deleteLowerProperty(upData[0]);
                model.com.postFPCRoutePart({
                    data: SelectData[0],
                }, function (res) {

                    model.com.postFPCRoutePart({
                        data: upData[0],
                    }, function (res1) {
                        //alert("修改成功");
                        $("#zace-closePart-level").click();
                        //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                        //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    })

                })
            });

            //隐藏
            $("body").delegate("#zace-closePart-level", "click", function () {

                $(".zzza").css("margin-right", "0px");
                $(".zzzc").css("width", "0px");
                $(".zzzc").hide();
                model.com.refresh();
            });
            //下移
            $("body").delegate("#zace-down-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), 'ID', DDDBasic);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                } else if (SelectData.length > 1) {
                    alert(" 一次只能对一行数据移动！")
                    return;
                }
                //判断是否在第一行
                var ZAll = model.com.getOrderListByRouteID1(SelectData[0].RouteID);

                if (SelectData[0].OrderID == ZAll.length) {
                    alert("已在最后一项！！！");
                    return;
                }

                SelectData[0].OrderID += 1;
                var upData = model.com.getDataOne(SelectData[0].RouteID, SelectData[0].OrderID);
                upData[0].OrderID -= 1;
                $com.util.deleteLowerProperty(SelectData[0]);
                $com.util.deleteLowerProperty(upData[0]);
                model.com.postFPCRoutePart({
                    data: SelectData[0],
                }, function (res) {

                    model.com.postFPCRoutePart({
                        data: upData[0],
                    }, function (res1) {
                        //alert("修改成功");
                        $("#zace-closePart-level").click();
                        //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                        //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    })

                })
            });
        },




        run: function () {
            $com.app.loading('数据加载中...');
            model.com.getFPCRoute({ FactoryID: 0, BusinessUnitID: 0, ProductTypeID: 0 }, function (resR) {
                if (resR && resR.list) {
                    DATARouteList = resR.list;
                    $.each(resR.list, function (i, item) {
                        TypeSource_Level.RouteID.push({
                            name: item.Name,
                            value: item.ID,
                        });
                    });
                    $.each(resR.list, function (i, item) {
                        TypeSource_Level.RouteIDShow.push({
                            name: item.Name,
                            value: item.ID,
                        });
                    });
                }
                model.com.getFPCPart({ FactoryID: 0, BusinessUnitID: 0 }, function (resRP) {
                    if (resRP && resRP.list) {

                        $.each(resRP.list, function (i, item) {
                            TypeSource_Level.PartID.push({
                                name: item.Name,
                                value: item.ID,
                            });
                        });

                        TypeSource_Level.PrevPartID=TypeSource_Level.PartID;
                    }
                    model.com.setMMM();
                    model.com.refresh();
                });
            });
        },

        com: {
            setMMM: function () {
                setTimeout(function () {
                    if (window.parent._zacePartSet && window.parent._zacePartSet == 1) {
                        model.com.getFPCPart({ FactoryID: 0, BusinessUnitID: 0 }, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {

                                TypeSource_Level.PartID.splice(1, TypeSource_Level.PartID.length - 1);
                                $.each(resW.list, function (i, item) {
                                    TypeSource_Level.PartID.push({
                                        name: item.Name,
                                        value: item.ID,
                                    });
                                });
                            }
                            window.parent._zacePartSet = 0;
                        });

                    }
                    if (window.parent._zaceRouteSet && window.parent._zaceRouteSet == 1) {
                        model.com.getFPCRoute({ FactoryID: 0, BusinessUnitID: 0, ProductTypeID: 0 }, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {

                                TypeSource_Level.RouteID.splice(1, TypeSource_Level.RouteID.length - 1);
                                TypeSource_Level.RouteIDShow = [];
                                DATARouteList = resW.list;
                                $.each(resW.list, function (i, item) {
                                    TypeSource_Level.RouteID.push({
                                        name: item.Name,
                                        value: item.ID,
                                    });
                                });
                                $.each(resW.list, function (i, item) {
                                    TypeSource_Level.RouteIDShow.push({
                                        name: item.Name,
                                        value: item.ID,
                                    });
                                });
                            }
                            window.parent._zaceRouteSet = 0;
                        });

                    }


                    model.com.setMMM();
                }, 500);

            },
            refresh: function () {
                $com.app.loading('数据加载中...');
                model.com.getFPCRoutePart({ RouteID: 0 }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        // var Grade = $com.util.Clone(resP.list);
                        var Grade = [];
                        var DDD = $com.util.Clone(resP.list);
                        DDDBasic = DDD;
                        DATABasic = $com.util.Clone(DDDBasic);

                        //
                        for (var i = 0; i < DATARouteList.length; i++) {
                            var _list = [];
                            _list = model.com.getOrderListByRouteID(DATARouteList[i].ID);

                            for (var m = 0; m < _list.length; m++) {
                                Grade.push(_list[m]);
                            }
                        }
                        //
                        DataAll = $com.util.Clone(Grade);

                        $.each(Grade, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }
                            item.WID = i + 1;
                        });
                        DataAllFactorySearch = $com.util.Clone(Grade);
                        $("#femi-riskLevel-tbody").html($com.util.template(Grade, HTML.TableMode));
                        $com.app.loaded();
                    }

                });

            },
            refreshPartPoint: function () {
                $com.app.loading('数据加载中...');
                model.com.getFPCRoutePartPoint({ RouteID: RouteID, PartID: mPartID }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var _list = resP.list;
                        var _listOrder = [];
                        for (var i = 0; i < _list.length; i++) {

                            for (var j = 0; j < _list.length; j++) {
                                if ((i + 1) == _list[j].OrderID) {
                                    _listOrder.push(_list[j]);
                                }
                            }

                        }
                        if (_listOrder.length > 0) {
                            for (var i = 0; i < _listOrder.length; i++) {
                                _listOrder[i].PartName = mPartName;
                                _listOrder[i].WID = i + 1;
                            }
                        }


                        $("#femi-riskPart-tbody").html($com.util.template(_listOrder, HTML.TablePartMode));
                        $com.app.loaded();
                    }
                });

            },
            //查询工序段列表
            getFPCRoutePartPoint: function (data, fn, context) {
                var d = {
                    $URI: "/FPCRoutePartPoint/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询工序库列表
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

            getOrderListByRouteID: function (RouteID) {
                var _list = [];
                var _listOrder = [];
                for (var i = 0; i < DATABasic.length; i++) {
                    if (RouteID == DATABasic[i].RouteID) {
                        _list.push(DATABasic[i]);
                    }
                }

                for (var j = 0; j < _list.length; j++) {

                    for (var i = 0; i < _list.length; i++) {
                        if ((j + 1) == _list[i].OrderID) {
                            _listOrder.push(_list[i]);

                        }
                    }

                }
                return _listOrder;

            },
            getOrderListByRouteID1: function (RouteID) {
                var _list = [];
                var _listOrder = [];
                for (var i = 0; i < DDDBasic.length; i++) {
                    if (RouteID == DDDBasic[i].RouteID) {
                        _list.push(DDDBasic[i]);
                    }
                }

                for (var j = 0; j < _list.length; j++) {

                    for (var i = 0; i < _list.length; i++) {
                        if ((j + 1) == _list[i].OrderID) {
                            _listOrder.push(_list[i]);

                        }
                    }

                }
                return _listOrder;

            },
            getDataOne: function (routeID, orderID) {
                var _list = [];
                for (var i = 0; i < DataAll.length; i++) {
                    if (routeID == DataAll[i].RouteID && orderID == DataAll[i].OrderID) {
                        _list.push(DataAll[i]);
                    }
                }
                return _list;

            },
            //查询路线
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
            //保存产品工序列表
            postFPCRoutePart: function (data, fn, context) {
                var d = {
                    $URI: "/FPCRoutePart/Update",
                    $TYPE: "post"
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


            //删除得到新的数据
            getNewList: function (_source, set_data) {
                if (!_source)
                    _source = [];
                if (!set_data)
                    set_data = [];
                var rst = [];
                for (var i = 0; i < _source.length; i++) {
                    var NotOWn = false;
                    for (var j = 0; j < set_data.length; j++) {
                        if (_source[i].RiskID == set_data[j].RiskID) {
                            _source.splice(i, 1);
                            set_data.splice(j, 1);
                            NotOWn = true;
                        }
                        if (set_data.length < 1) {
                            break;
                        }
                        if (NotOWn) {
                            model.com.getNewList(_source, set_data);
                        }
                    }

                }
                rst = _source;
                return rst;
            },
            //得到ID
            GetMaxID: function (_source) {
                var id = 0;
                if (!_source)
                    _source = [];
                $.each(_source, function (i, item) {
                    if (item.OrderID > id)
                        id = item.OrderID;
                });
                return id + 1;

            },
        }
    }),

        model.init();


});