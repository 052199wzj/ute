require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/jquery.treeview',
     '../static/utils/js/base/tooltip',
	 '../static/utils/js/base/route'
],
    function ($yang, $com, $treeview, $tooltip, $route) {
        var HTML,
            model,
            mWidth,
            dataBusiness,
            dataFactory,
            dataWorkShop,
            dataLine,
            dataRoute,
            mProductID,
            dataPart,
            dataPartPoint,
            KEYWORD_Level_LIST,
            KEYWORD_Level,
            FORMATTRT_Level,
            DEFAULT_VALUE_Level,
            TypeSource_Level,
            KEYWORD_condition_LIST,
            KEYWORD_condition,
            FORMATTRT_condition,
            DEFAULT_VALUE_condition,
            TypeSource_condition,
            RouteColor = {};
        mProductID = 0;
        HTML = {
            //<input type="checkbox" class="femi-tree-checkbox" style="margin: 1px 0px 1px"  value="{{FunctionID}}"  />
            TreeBusinessItemNode: [
				'<li data-value="{{BusinessID}}" class="business">',
				'<span style="vertical-align:top;">{{BusinessName}}</span> ',
				'<ul>{{Items}}</ul>',
				'</li> ',
            ].join(""),
            TreeFactoryItemNode: [
				'<li data-value="{{FactoryID}}" class="factory">',
				'<span style="vertical-align:top;">{{FactoryName}}</span> ',
				'<ul>{{Items}}</ul>',
				'</li> ',
            ].join(""),
            TreeWorkShopItemNode: [
				'<li data-value="{{WorkShopID}}" class="workshop">',
				'<span style="vertical-align:top;">{{WorkShopName}}</span> ',
				'<ul>{{Items}}</ul>',
				'</li> ',
            ].join(""),
            TreeLineItemNode: [
				'<li data-value="{{LineID}}" class="line">',
				'<span style="vertical-align:top;">{{LineName}}</span> ',
				'<ul>{{Items}}</ul>',
				'</li> ',
            ].join(""),
            TreeRouteItemNode: [
			    '<li data-value="{{RouteID}}"  class="route">',
               '<span style="vertical-align:top;">{{RouteName}}</span> ',
               '</li> ',
            ].join(""),
        };

        $(function () {
            KEYWORD_Level_LIST = [
             "RouteID|工艺路线|ArrayOne",
             "PartID|工段|ArrayOne",
            ];
            KEYWORD_Level = {};
            FORMATTRT_Level = {};

            TypeSource_Level = {
                RouteID: [
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
        });

        //$(function () {
        //    KEYWORD_condition_LIST = [
        //        "RouteNameZ|路线|Readonly",
        //        "PartNameZ|工序|Readonly",
        //        "PartPointNameZ|工步|Readonly",


        //    ];
        //    KEYWORD_condition = {};
        //    FORMATTRT_condition = {};



        //    TypeSource_condition = {


        //    };

        //    $.each(KEYWORD_condition_LIST, function (i, item) {
        //        var detail = item.split("|");
        //        KEYWORD_condition[detail[0]] = {
        //            index: i,
        //            name: detail[1],
        //            type: detail.length > 2 ? detail[2] : undefined,
        //            control: detail.length > 3 ? detail[3] : undefined
        //        };
        //        if (detail.length > 2) {
        //            FORMATTRT_condition[detail[0]] = $com.util.getFormatter(TypeSource_condition, detail[0], detail[2]);
        //        }
        //    });
        //});

        model = $com.Model.create({
            name: 'iPlant.MES',

            type: $com.Model.MAIN,

            configure: function () {
                this.run();
            },
            events: function () {


                //隐藏
                $("body").delegate("#zace-close-detail", "click", function () {

                    $(".zace-con-right").css("width", "0px");
                    $(".zace-con-middle").css("margin-right", "0px");
                    $(".zace-con-right").hide();
                });

                //树的切换事件

                //部门树
                $("body").delegate("#department-route-tree", "click", function () {
                    $("#departmentTree").show();
                    $("#factoryTree").hide();
                    $("#tree").html($(this).html());
                    model.com.refreshBusinessTree();
                });
                //工厂树
                $("body").delegate("#factory-route-tree", "click", function () {
                    $("#factoryTree").show();
                    $("#departmentTree").hide();
                    $("#tree").html($(this).html());

                    model.com.refreshFacoryTree();
                });

                //树的点击事件
                $("body").delegate(".route", "click", function () {
                    $("#ChartRoute").show();
                    mWidth = Number($(".femi-bd-contain").width());
                    var routePartArr = [],
                        _dataRoute = $com.util.Clone(dataRoute),
                        _dataPart = $com.util.Clone(dataPart),
                        RouteID = $(this).attr("data-value");
                    //拿到此路线下对应的工序段
                    $.each(_dataPart, function (p_i, p_item) {
                        if (RouteID == p_item.RouteID) {
                            routePartArr.push(p_item);
                        }
                    });
                    if ($(this).parents(".business")) {
                        model.com.renderRouteChart(routePartArr);
                    } else if ($(this).parents(".factory")) {
                        model.com.renderFactoryChart(routePartArr);
                    }
                });
                //路线的点击颜色切换事件
                $("body").delegate(".route", "click", function () {
                    $("#DepartmentTree li").css("color", "black");
                    $(this).css("color", "blue");
                    $("#FactoryTree li").css("color", "black");
                    $(this).css("color", "blue");
                });
            },
            run: function () {
             
                model.com.getBusinessAll({}, function (data) {
                    dataBusiness = data.list;
                    model.com.getWorkShopAll({}, function (data) {
                        dataWorkShop = data.list;
                        model.com.getLineAll({}, function (data) {
                            dataLine = data.list;
                            model.com.getFPCRoute({}, function (data) {
                                dataRoute = data.list;
                                $.each(data.list, function (i, item) {
                                    TypeSource_Level.RouteID.push({
                                        name: item.Name,
                                        value: item.ID,
                                    });
                                });
                                model.com.refreshBusinessTree();
                            });
                        });
                    });
                });
                model.com.getFactoryAll({}, function (data) {
                    dataFactory = data.list;

                    model.com.getPartAll({}, function (data) {
                        dataPart = data.list;
                        $.each(data.list, function (i, item) {
                            TypeSource_Level.PartID.push({
                                name: item.Name,
                                value: item.ID,
                            });
                        });
                        model.com.getPartPointAll({}, function (data) {
                            dataPartPoint = data.list;
                        });
                    });
                });


                $("#departmentTree").show();
                $("#factoryTree").hide();

            },
            com: {
                getPartAll: function (data, fn, context) {
                    var d = {
                        $URI: "/FPCRoutePart/All",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                getPartPointAll: function (data, fn, context) {
                    var d = {
                        $URI: "/FPCRoutePartPoint/All",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                getBusinessAll: function (data, fn, context) {
                    var d = {
                        $URI: "/BusinessUnit/All",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                getWorkShopAll: function (data, fn, context) {
                    var d = {
                        $URI: "/FMCWorkShop/All",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                getLineAll: function (data, fn, context) {
                    var d = {
                        $URI: "/FMCLine/All",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
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
                getFactoryAll: function (data, fn, context) {
                    var d = {
                        $URI: "/FMCFactory/All",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //查询某个工序
                getFPCRoutePartPointInfo: function (data, fn, context) {
                    var d = {
                        $URI: "/FPCRoutePartPoint/Info",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                refreshGrid: function (id, productId) {
                    model.com.getFPCRoutePartPointInfo({ ID: id, ProductID: productId }, function (resP1) {
                        if (!resP1)
                            return;
                        if (resP1) {
                            var data = resP1;

                            DataBasicGrid = resP1;
                            var _showData = {};
                            for (var i = 0; i < dataPartPoint.length; i++) {
                                if (id == dataPartPoint[i].ID) {
                                    _showData = $com.util.Clone(dataPartPoint[i]);
                                }
                            }
                            DataShow = _showData;

                            var _showDataT = {};
                            if (DataBasicGrid.list.length < 1) {
                                _showDataT.RouteNameZ = FORMATTRT_Level["RouteID"](DataBasicGrid.info.RouteID);
                                _showDataT.PartNameZ = FORMATTRT_Level["PartID"](DataBasicGrid.info.PartID);
                                _showDataT.PartPointNameZ = DataShow.PartPointName;

                                for (var property in KEYWORD_condition) {
                                    if (_showDataT[property] || _showDataT[property] == false || _showDataT[property] == 0)
                                        continue;
                                    _showDataT[property] = "";
                                }



                                //KEYWORD_condition.Creator = {
                                //    control: undefined,
                                //    index: 2,
                                //name: "创建者",
                                //type: "Readonly",

                                //}

                                $com.propertyGrid.show($(".zace-pripoty"), _showDataT, KEYWORD_condition, TypeSource_condition);
                            } else {

                                _showDataT.RouteNameZ = FORMATTRT_Level["RouteID"](DataBasicGrid.info.RouteID);
                                _showDataT.PartNameZ = FORMATTRT_Level["PartID"](DataBasicGrid.info.PartID);
                                _showDataT.PartPointNameZ = DataShow.PartPointName;

                                for (var property in KEYWORD_condition) {
                                    if (_showDataT[property] || _showDataT[property] == false || _showDataT[property] == 0)
                                        continue;
                                    _showDataT[property] = "";
                                }

                                for (var i = 0; i < DataBasicGrid.list.length; i++) {
                                    var num = 0
                                    num = i + 1;
                                    _showDataT["Custom_" + num] = DataBasicGrid.list[i].ItemValue;
                                    if (_showDataT["Custom_" + num] == false || _showDataT["Custom_" + num] == "false") {
                                        _showDataT["Custom_" + num] = false;
                                    }
                                    if (_showDataT["Custom_" + num] == true || _showDataT["Custom_" + num] == "true") {
                                        _showDataT["Custom_" + num] = true;
                                    }
                                }

                                //KEYWORD_condition.Creator = {
                                //    control: undefined,
                                //    index: 2,
                                //name: "创建者",
                                //type: "Readonly",

                                //}

                                $com.propertyGrid.show($(".zace-pripoty"), _showDataT, KEYWORD_condition, TypeSource_condition);

                            }

                        }

                    });
                },
                getConfig: function (data, fn, context) {
                    var d = {
                        $URI: "/FPCProductCustom/Config",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                refreshBusinessTree: function () {
                    var newBusinessArr = [];
                    var _dataBusiness = $com.util.Clone(dataBusiness);
                    var _dataWorkShop = $com.util.Clone(dataWorkShop);
                    var _dataLine = $com.util.Clone(dataLine);
                    var _dataRoute = $com.util.Clone(dataRoute);
                    //得到事业部的结构
                    $.each(_dataBusiness, function (i, item) {
                        newBusinessArr.push({
                            BusinessID: item.ID,
                            BusinessName: item.Name,
                            WorkShopList: []
                        });
                    });
                    //得到事业部-车间结构
                    for (var i = 0; i < newBusinessArr.length; i++) {
                        $.each(_dataWorkShop, function (w_i, w_item) {
                            if (newBusinessArr[i].BusinessID == w_item.BusinessUnitID) {
                                newBusinessArr[i].WorkShopList.push({
                                    WorkShopID: w_item.ID,
                                    WorkShopName: w_item.Name,
                                    LineList: []
                                });
                            }
                        });
                    }
                    //得到事业部-车间-产线结构
                    $.each(newBusinessArr, function (i, item) {
                        $.each(item.WorkShopList, function (w_i, w_item) {
                            $.each(_dataLine, function (l_i, l_item) {
                                if (w_item.WorkShopID == l_item.WorkShopID) {
                                    w_item.LineList.push({
                                        LineID: l_item.ID,
                                        LineName: l_item.Name,
                                        RouteList: []
                                    });
                                }
                            });
                        });
                    });
                    //得到事业部-车间-产线-路线结构
                    $.each(newBusinessArr, function (i, item) {
                        $.each(item.WorkShopList, function (w_i, w_item) {
                            $.each(w_item.LineList, function (l_i, l_item) {
                                $.each(_dataRoute, function (r_i, r_item) {
                                    if (l_item.LineID == r_item.LineID) {
                                        l_item.RouteList.push({
                                            RouteID: r_item.ID,
                                            RouteName: r_item.Name
                                        });
                                    }
                                });
                            });
                        });
                    });
                    model.com.renderBusinessTree(newBusinessArr);
                },
                renderBusinessTree: function (list) {
                    $.each(list, function (i, item) {
                        $.each(item.WorkShopList, function (w_i, w_item) {
                            $.each(w_item.LineList, function (l_i, l_item) {
                                l_item.Items = $com.util.template(l_item.RouteList, HTML.TreeRouteItemNode);
                            })
                            w_item.Items = $com.util.template(w_item.LineList, HTML.TreeLineItemNode);
                        })
                        item.Items = $com.util.template(item.WorkShopList, HTML.TreeWorkShopItemNode);
                    })
                    $("#DepartmentTree").html($com.util.template(list, HTML.TreeBusinessItemNode));
                    $("#DepartmentTree").treeview();
                },
                OrderList: function (data) {
                    var _list = [];
                    for (var i = 0; i < data.length; i++) {

                        for (var j = 0; j < data.length; j++) {
                            if ((i + 1) == data[j].OrderID) {
                                _list.push(data[j]);
                            }
                        }

                    }
                    return _list;

                },
                refreshFacoryTree: function () {
                    var newFactoryArr = [];
                    var _dataFactory = $com.util.Clone(dataFactory);
                    var _dataWorkShop = $com.util.Clone(dataWorkShop);
                    var _dataLine = $com.util.Clone(dataLine);
                    var _dataRoute = $com.util.Clone(dataRoute);
                    //得到工厂的结构
                    $.each(_dataFactory, function (i, item) {
                        newFactoryArr.push({
                            FactoryID: item.ID,
                            FactoryName: item.Name,
                            WorkShopList: []
                        });
                    });
                    //得到工厂-车间结构
                    for (var i = 0; i < newFactoryArr.length; i++) {
                        $.each(_dataWorkShop, function (w_i, w_item) {
                            if (newFactoryArr[i].FactoryID == w_item.FactoryID) {
                                newFactoryArr[i].WorkShopList.push({
                                    WorkShopID: w_item.ID,
                                    WorkShopName: w_item.Name,
                                    LineList: []
                                });
                            }
                        });
                    }
                    //得到工厂-车间-产线结构
                    $.each(newFactoryArr, function (i, item) {
                        $.each(item.WorkShopList, function (w_i, w_item) {
                            $.each(_dataLine, function (l_i, l_item) {
                                if (w_item.WorkShopID == l_item.WorkShopID) {
                                    w_item.LineList.push({
                                        LineID: l_item.ID,
                                        LineName: l_item.Name,
                                        RouteList: []
                                    });
                                }
                            });
                        });
                    });
                    //得到工厂-车间-产线-路线结构
                    $.each(newFactoryArr, function (i, item) {
                        $.each(item.WorkShopList, function (w_i, w_item) {
                            $.each(w_item.LineList, function (l_i, l_item) {
                                $.each(_dataRoute, function (r_i, r_item) {
                                    if (l_item.LineID == r_item.LineID) {
                                        l_item.RouteList.push({
                                            RouteID: r_item.ID,
                                            RouteName: r_item.Name
                                        });
                                    }
                                });
                            });
                        });
                    });
                    model.com.renderFacoryTree(newFactoryArr);
                },
                renderFacoryTree: function (list) {
                    $.each(list, function (i, item) {
                        $.each(item.WorkShopList, function (w_i, w_item) {
                            $.each(w_item.LineList, function (l_i, l_item) {
                                l_item.Items = $com.util.template(l_item.RouteList, HTML.TreeRouteItemNode);
                            })
                            w_item.Items = $com.util.template(w_item.LineList, HTML.TreeLineItemNode);
                        })
                        item.Items = $com.util.template(item.WorkShopList, HTML.TreeWorkShopItemNode);
                    })
                    $("#FactoryTree").html($com.util.template(list, HTML.TreeFactoryItemNode));
                    $("#FactoryTree").treeview();
                },

                renderRouteChart: function (routePartArr) {
                    var orderPartPointArr = [],
                        orderPartArr = [];
                    _routePartArr = $com.util.Clone(routePartArr),
                    //排序的工段数据
                    _routePartArr = model.com.OrderList(_routePartArr);

                    _dataPartPoint = $com.util.Clone(dataPartPoint);
                    //拿到此路线下所有工序段下的工序
                    $.each(_routePartArr, function (i, item) {
                        $.each(_dataPartPoint, function (p_i, p_item) {
                            if (item.ID == p_item.PartID) {
                                orderPartPointArr.push(p_item);
                            }
                        });
                        //排序的工序数据
                        orderPartPointArr = model.com.OrderList(orderPartPointArr);

                        orderPartArr = orderPartArr.concat(orderPartPointArr);
                        orderPartPointArr = [];
                    });
                    //添加唯一顺序字段OrderID
                    for (var i = 0; i < orderPartArr.length; i++) {
                        orderPartArr[i].OrderIDPro = i + 1;
                    }

                    //显示流程图

                    //为流程图添加方法
                    //创建悬浮框方法
                    var wWidth = Number($(".femi-bd-contain").width());
                    var mouseoverFn = function (data, json) {
                        var cv = $(".left-contain").scrollTop();
                        var cl = $("#ChartRoute").scrollLeft();
                        var $target = {
                            offset: function () {
                                return {
                                    left: json.X + json.left,
                                    top: json.Y + json.top - cv,
                                };
                            },
                            width: function () {
                                return json.width;
                            },
                            height: function () {
                                return json.height;
                            },
                        }
                        var dataHtml = model.com.changeData(data);
                        $tooltip.show({ target: $target, object: dataHtml, orientation: 2, Choice_color: 4, max_width: 200, fontsize: 13, });
                    }
                    var mouseoutFn = function (data) {
                        $tooltip.clear();
                    }
                    //点击方法
                    var clickFn = function (data, json) {
                        //var _info = data;
                        //var showInfo = $com.util.Clone(_info);

                        //model.com.refreshGrid(showInfo.ZID, mProductID);

                        //$(".zace-con-right").css("width", "350px");
                        //$(".zace-con-middle").css("margin-right", "350px");
                        //$(".zace-con-right").show();
                    }
                    //1 置空
                    $("#ChartPartPoint").html("");
                    $("#ChartRoute").show();

                    //2 创建结构
                    var dataObj = {
                        contain: $("#ChartPartPoint"),
                        data: [],
                        dataSet: {
                            Text: "title",//显示字段名称
                            Index: "ID",//索引字段名称
                            PrevIndex: "PrevID", //索引字段名称
                            NextIndex: "NextID",//索引字段名称
                            "BGC": "backgroundColor", //背景色字段名称
                            "FGC": "foregroundColor", //前景色字段名称
                        },
                        padding: 10,
                        direction: "right",
                        //background_color: 'transparent', //流程框背景颜色
                        foreground_color: 'red', //箭头颜色
                        fn_mouseover: mouseoverFn,
                        fn_mouseout: mouseoutFn,
                        fn_click: clickFn
                    };
                    //3 填充data
                    if (orderPartArr.length != 0) {
                        $.each(orderPartArr, function (i, item) {
                            dataObj.data.push({
                                title: item.PartPointName,
                                ID: item.OrderIDPro,
                                ZID: item.ID,
                                PrevID: item.OrderIDPro - 1,
                                NextID: 0,
                                backgroundColor: model.com.getRandomColor(item.PartID),
                                foregroundColor: "white",
                                PartName: FORMATTRT_Level["PartID"](item.PartID),
                                RouteName: FORMATTRT_Level["RouteID"](item.RouteID),
                                VersionNo: item.VersionNo,

                            });
                        });
                        //4 显示流程图
                        $route.show(dataObj);
                    }
                    else {
                        return false;
                    }
                },
                //多余·
                renderFactoryChart: function (factoPartArr) {
                    var orderPartPointArr = [],
                        orderPartArr = [];
                    _routePartArr = $com.util.Clone(routePartArr),
                    _dataPartPoint = $com.util.Clone(dataPartPoint);
                    //拿到此路线下所有工序段下的工序
                    $.each(_routePartArr, function (i, item) {
                        $.each(_dataPartPoint, function (p_i, p_item) {
                            if (item.ID == p_item.PartID) {
                                orderPartPointArr.push(p_item);
                            }
                        });
                        orderPartArr = orderPartArr.concat(orderPartPointArr);
                        orderPartPointArr = [];
                    });
                    //添加唯一顺序字段OrderID
                    for (var i = 0; i < orderPartArr.length; i++) {
                        orderPartArr[i].OrderID = i + 1;
                    }

                    //显示流程图

                    //为流程图添加方法
                    //创建悬浮框方法
                    var mouseoverFn = function (data, json) {
                        var $target = {
                            offset: function () {
                                return {
                                    left: json.X + json.left,
                                    top: json.Y + json.top,
                                };
                            },
                            width: function () {
                                return json.width;
                            },
                            height: function () {
                                return json.height;
                            },
                        }
                        var dataHtml = model.com.changeData(data);
                        $tooltip.show({ target: $target, object: dataHtml, orientation: 2, Choice_color: 4, max_width: 200, fontsize: 13, });
                    }
                    var mouseoutFn = function (data) {
                        $tooltip.clear();
                    }
                    //点击方法
                    var clickFn = function (data, json) {

                    }
                    //1 置空
                    $("#ChartPartPoint").html("");
                    $("#ChartRoute").show();

                    //2 创建结构
                    var dataObj = {
                        contain: $("#ChartPartPoint"),
                        data: [],
                        dataSet: {
                            Text: "title",//显示字段名称
                            Index: "ID",//索引字段名称
                            PrevIndex: "PrevID", //索引字段名称
                            NextIndex: "NextID",//索引字段名称
                            "BGC": "backgroundColor", //背景色字段名称
                            "FGC": "foregroundColor", //前景色字段名称
                        },
                        padding: 10,
                        direction: "right",
                        //background_color: 'transparent', //流程框背景颜色
                        foreground_color: 'red', //箭头颜色
                        fn_mouseover: mouseoverFn,
                        fn_mouseout: mouseoutFn,
                        fn_click: clickFn
                    };
                    //3 填充data
                    if (orderPartArr.length != 0) {
                        $.each(orderPartArr, function (i, item) {
                            dataObj.data.push({
                                title: item.PartPointName,
                                ID: item.OrderID,
                                PrevID: item.OrderID - 1,
                                NextID: 0,
                                backgroundColor: model.com.getRandomColor(item.PartID),
                                foregroundColor: "white",
                                PartName: item.PartName,
                                RouteName: item.RouteName,
                                VersionNo: item.VersionNo,

                            });
                        });
                        //4 显示流程图
                        $route.show(dataObj);
                    }
                    else {
                        return false;
                    }
                },
                changeData: function (data) {
                    var obj = {
                        工序名: ":" + data.title,
                        顺序: ":" + data.ID,
                        工序段名: ":" + data.PartName,
                        路线名: ":" + data.RouteName,
                        版本号: ":" + data.VersionNo,
                    }
                    return obj;
                },
                //颜色进制转换
                rgbToHex: function (color) {
                    var arr = [],
                        strHex;
                    if (/^(rgb|RGB)/.test(color)) {
                        arr = color.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
                        strHex = '#' + ((1 << 24) + (arr[0] << 16) + (arr[1] << 8) + parseInt(arr[2])).toString(16).substr(1);
                    } else {
                        strHex = color;
                    }
                    return strHex;
                },
                getRandomColor: function (partID) {
                    if (!RouteColor[partID]) {
                        RouteColor[partID] = 'rgb(' + (Math.floor(Math.random() * 255)) + ',' + (Math.floor(Math.random() * 255)) + ',' + (Math.floor(Math.random() * 255)) + ')';
                    }

                    return RouteColor[partID];
                },
                //数组去重
                getNewShiftList: function (_source, set_data) {
                    if (!_source)
                        _source = [];
                    if (!set_data)
                        set_data = [];
                    var rst = [];
                    for (var i = 0; i < _source.length; i++) {
                        var NotOWn = false;
                        for (var j = 0; j < set_data.length; j++) {
                            if (_source[i].PartID == set_data[j].PartID) {
                                _source.splice(i, 1);
                                set_data.splice(j, 1);
                                NotOWn = true;
                            }
                            if (set_data.length < 1) {
                                break;
                            }
                            if (NotOWn) {
                                model.com.getNewShiftList(_source, set_data);
                            }
                        }

                    }
                    rst = _source;
                    return rst;
                },
            }
        })
        model.init();
    });