require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($zace, $com) {

    var KEYWORD_Level_LIST,
        KEYWORD_Level,
        FORMATTRT_Level,
        DEFAULT_VALUE_Level,
        TypeSource_Level,
        model,
        DataAll,
        DATABasic,
        DataAllConfirmBasic,
        DataAllConfirmChange,
        DataAllConfirm,
        DataAllSearch,
        DataPartList,
        DATARouteList,
        DataPartNew,
        DataAllFactorySearch,
        HTML;
    DataPartNew = [];
    DataAll = [];
    DATABasic = [];
    DATAZBasic = [];
    DataAllConfirmBasic = [];
    DataAllConfirmChange = [];
    DataAllConfirm = [];
    DataAllFactorySearch = DataAllSearch = [];
    PositionTemp = {
        CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Creator: window.parent.User_Info.Name,
        CreatorID: 0,
        OrderID: 0,
        PartID: 0,
        PartName: "",
        PartPointID: 0,
        PartPointName: "",
        RouteID: 0,
        ID: 0,
        RouteName: "",
        VersionNo: "",

    };


    ;
    HTML = {
        TableMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',

            '<td data-title="RouteID" data-value="{{RouteID}}" >{{RouteID}}</td>',
            //'<td data-title="RouteName" data-value="{{RouteName}}" >{{RouteName}}</td>',
            '<td data-title="VersionNo" data-value="{{VersionNo}}" >{{VersionNo}}</td>',
            '<td data-title="PartID" data-value="{{PartID}}" >{{PartID}}</td>',
            '<td data-title="PartPointName" data-value="{{PartPointName}}" >{{PartPointName}}</td>',
            '<td data-title="OrderID" data-value="{{OrderID}}" >{{OrderID}}</td>',
            '<td data-title="Creator" data-value="{{Creator}}" >{{Creator}}</td>',
            '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
            '</tr>',
        ].join(""),



    };
    (function () {
        KEYWORD_Level_LIST = [

            "VersionNo|编码",
            "LineID|修程|ArrayOneControl",
            "RouteID|工艺路线|ArrayOneControl|LineID",
            "PartID|工艺工位|ArrayOneControl|RouteID",
            "StationID|工位|ArrayOneControl|LineID",
            "PartPointID|工序|ArrayOneControl|LineID,StationID",
            "OrderID|顺序",
            "CreateTime|时间|DateTime",
        ];
        KEYWORD_Level = {};
        FORMATTRT_Level = {};

        DEFAULT_VALUE_Level = {
            OrderID: 1,
            //VersionNo: "",
            RouteID: 0,
            PartID: 0,
            PartPointID: 0,
            LineID:1,
            StationID:0
        };

        TypeSource_Level = {
            LineID:[

               
            ],
            RouteID: [
                {
                    name: "无",
                    value: 0,
                    far:0
                }
            ],
            PartID: [
                {
                    name: "无",
                    value: 0,
                    far:0
                }
            ],
            StationID: [
                {
                    name: "无",
                    value: 0,
                    far:0
                }
            ],
            PartPointID: [
                {
                    name: "无",
                    value: 0,
                    far:0
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
        name: '工序',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            $("body").delegate("#zace-zace-refresh", "click", function () {

                model.com.refresh();

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
            //工序修改
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

                    //VersionNo: SelectData[0].VersionNo,                
                    OrderID: SelectData[0].OrderID,
                    //RouteID: SelectData[0].RouteID,
                    PartID: SelectData[0].PartID,
                    PartPointID: SelectData[0].PartPointID,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    //SelectData[0].VersionNo = rst.VersionNo;
                    SelectData[0].OrderID = Number(rst.OrderID);
                    //SelectData[0].RouteID = Number(rst.RouteID);
                    SelectData[0].PartID = Number(rst.PartID);
                    SelectData[0].PartPointID = Number(rst.PartPointID);
                    for (var i = 0; i < SelectData.length; i++) {
                        $com.util.deleteLowerProperty(SelectData[i]);
                    }
                    model.com.postFPCRoutePartPoint({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
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
                    PositionTemp.OrderID = Number(rst.OrderID);
                    //PositionTemp.OrderID = model.com.GetMaxID(DataAll);
                    PositionTemp.RouteID = Number(rst.RouteID);
                    PositionTemp.PartID = Number(rst.PartID);
                    PositionTemp.PartPointID = Number(rst.PartPointID);
                    if (PositionTemp.RouteID == 0 || PositionTemp.PartID == 0 || PositionTemp.PartPointID == 0) {
                        alert("请重新选择!")
                        return;
                    }
                    // var _list = [];
                    // for (var i = 0; i < DATAZBasic.length; i++) {
                    //     if (PositionTemp.RouteID == DATAZBasic[i].RouteID && PositionTemp.PartID == DATAZBasic[i].PartID) {
                    //         _list.push(DATAZBasic[i]);
                    //     }
                    // }
                    // PositionTemp.OrderID = _list.length + 1;
                    model.com.postFPCRoutePartPoint({
                        data: PositionTemp,
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                    })

                }, TypeSource_Level));


            });

            //条件查询
            $("body").delegate("#zace-myAudit-level", "click", function () {
                var default_value = {
                    RouteID: 0,
                    PartID: 0,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.RouteID = Number(rst.RouteID);
                    default_value.PartID = Number(rst.PartID);
                    $com.table.filterByConndition($("#femi-riskLevel-tbody"), DataAll, default_value, "ID");

                }, TypeSource_Level));


            });

            $("body").delegate("#zace-routeLine-level", "click", function () {
                var vdata = { 'header': '工艺路线', 'href': './factory_model/FPCRouteSetting.html', 'id': '50', 'src': './static/images/menu/newfactoryModel/techniqueRoute.png' };
                window.parent.iframeHeaderSet(vdata);

            });



            $("body").delegate("#zace-routePart-level", "click", function () {
                var vdata = { 'header': '工艺工位', 'href': './factory_model/FPCRoutePartSetting.html', 'id': 'FPCRoutePart', 'src': './static/images/menu/newfactoryModel/techniquePart.png' };
                window.parent.iframeHeaderSet(vdata);

            });


            $("body").delegate("#zace-product-level", "click", function () {
                var vdata = { 'header': '产品规格', 'href': './factory_model/ProductSetting.html', 'id': 'ProductSetup', 'src': './static/images/menu/newfactoryModel/productSpecification.png' };
                window.parent.iframeHeaderSet(vdata);

            });
            $("body").delegate("#zace-Fabrication-level", "click", function () {
                var vdata = { 'header': '工艺流程图', 'href': './factory_route/FabricationRoute.html', 'id': 'FabricationRoute', 'src': './static/images/menu/newfactoryModel/fabricationRoute.png' };
                window.parent.iframeHeaderSet(vdata);

            });

            $("body").delegate("#zace-ProductRoute-level", "click", function () {
                var vdata = { 'header': '车型工艺路线', 'href': './factory_model/ProductRouteSetting.html', 'id': 'ProductRouteSetup', 'src': './static/images/menu/newfactoryModel/productTechniqueRoute.png' };
                window.parent.iframeHeaderSet(vdata);

            });

            //上移
            $("body").delegate("#zace-up-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DDDBasic);
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
                var upData = model.com.getDataOne(SelectData[0].RouteID, SelectData[0].PartID, SelectData[0].OrderID);
                upData[0].OrderID += 1;


                $com.util.deleteLowerProperty(SelectData[0]);
                $com.util.deleteLowerProperty(upData[0]);

                model.com.postFPCRoutePartPoint({
                    data: SelectData[0],
                }, function (res) {

                    model.com.postFPCRoutePartPoint({
                        data: upData[0],
                    }, function (res1) {
                        //alert("修改成功");
                        model.com.refresh();
                        //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                        //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    })

                })
            });

            //下移
            $("body").delegate("#zace-down-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DDDBasic);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                } else if (SelectData.length > 1) {
                    alert(" 一次只能对一行数据移动！")
                    return;
                }
                //判断是否在第一行
                var ZAll = model.com.getOrderListByRouteID1(SelectData[0].RouteID, SelectData[0].PartID);

                if (SelectData[0].OrderID == ZAll.length) {
                    alert("已在最后一项！！！");
                    return;
                }

                SelectData[0].OrderID += 1;
                var upData = model.com.getDataOne(SelectData[0].RouteID, SelectData[0].PartID, SelectData[0].OrderID);
                upData[0].OrderID -= 1;
                $com.util.deleteLowerProperty(SelectData[0]);
                $com.util.deleteLowerProperty(upData[0]);

                model.com.postFPCRoutePartPoint({
                    data: SelectData[0],
                }, function (res) {

                    model.com.postFPCRoutePartPoint({
                        data: upData[0],
                    }, function (res1) {
                        //alert("修改成功");
                        model.com.refresh();
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
                            far: item.LineID,
                        });
                    });
                }
                model.com.getFPCRoutePart({ RouteID: 0 }, function (resR1) {
                    if (resR1 && resR1.list) {
                        DataPartList = resR1.list;
                        $.each(resR1.list, function (i, item) {
                            TypeSource_Level.PartID.push({
                                name: item.Name,
                                value: item.ID,
                                far: item.RouteID,
                            });
                        });
                    }
                     //工段排序
                     DataPartNew = [];
                     for (var i = 0; i < DATARouteList.length; i++) {
                         var _list = [];
                         _list = model.com.getOrderListByRouteID(DATARouteList[i].ID);

                         for (var m = 0; m < _list.length; m++) {
                             DataPartNew.push(_list[m]);
                         }
                     }
                   



                     model.com.getItemList({ LineID: 0, ID: 0 }, function (resBomItem) {

                         if (resBomItem && resBomItem.list) {
                             $.each(resBomItem.list, function (i, item) {

                                 if (item.LevelID==2) {
                                     TypeSource_Level.StationID.push({
                                         name: item.Name,
                                         value: item.UnitID,
                                         far: item.ParentUnitID,
                                     });

                                     
                                 } else  if(item.LevelID==3){
                                     TypeSource_Level.PartPointID.push({
                                         name: item.Name,
                                         value: item.UnitID,
                                         far: item.LineID+"_"+item.ParentUnitID,
                                     });
                                 }
                                
                             });
                         }


                         model.com.getFMCLineAll({}, function (resBZ) {
                             if (resBZ && resBZ.list) {
                                 $.each(resBZ.list, function (i, item) {
                                     TypeSource_Level.LineID.push({
                                         name: item.Name,
                                         value: item.ID,
                                         far: 0,
                                     });
                                 });
             
                             }
             
                             model.com.refresh();
                             //model.com.setMMM();
                  
                         });
             







                     });
                });
            });

        },

        com: {
            getFMCLineAll: function (data, fn, context) {
                var d = {
                    $URI: "/FMCLine/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
             //获取列表
             getItemList: function (data, fn, context) {
                var d = {
                    $URI: "/FMCLineUnit/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            setMMM: function () {
                setTimeout(function () {
                    if (window.parent._zacePartPointSet && window.parent._zacePartPointSet == 1) {
                        model.com.getFPCPartPoint({ FactoryID: 0, BusinessUnitID: 0, ProductTypeID: 0 }, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {

                                TypeSource_Level.PartPointID.splice(1, TypeSource_Level.PartPointID.length - 1);
                                $.each(resW.list, function (i, item) {
                                    TypeSource_Level.PartPointID.push({
                                        name: item.Name,
                                        value: item.ID,
                                    });
                                });
                            }
                            window.parent._zacePartPointSet = 0;
                        });

                    }
                    if (window.parent._zaceRoutePartSet && window.parent._zaceRoutePartSet == 1) {
                        model.com.getFPCRoutePart({ RouteID: 0 }, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {

                                TypeSource_Level.PartID.splice(1, TypeSource_Level.PartID.length - 1);
                                DataPartList = resW.list;
                                $.each(resW.list, function (i, item) {
                                    TypeSource_Level.PartID.push({
                                        name: item.Name,
                                        value: item.ID,
                                        far: item.RouteID,
                                    });
                                });
                            }
                            window.parent._zaceRoutePartSet = 0;
                        });

                    }
                    if (window.parent._zaceRouteSet && window.parent._zaceRouteSet == 1) {
                        model.com.getFPCRoute({ FactoryID: 0, BusinessUnitID: 0, ProductTypeID: 0 }, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {

                                DATARouteList = resW.list;
                                TypeSource_Level.RouteID.splice(1, TypeSource_Level.RouteID.length - 1);
                                $.each(resW.list, function (i, item) {
                                    TypeSource_Level.RouteID.push({
                                        name: item.Name,
                                        value: item.ID,
                                        far: null,
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
                model.com.getFPCRoutePartPoint({ RouteID: 0, PartID: 0 }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var Grade = [];
                        var DDD = $com.util.Clone(resP.list);
                        DDDBasic = DDD;
                        DATABasic = $com.util.Clone(DDDBasic);
                        DATAZBasic = $com.util.Clone(resP.list);
                        for (var i = 0; i < DataPartNew.length; i++) {
                            var _list = [];
                            _list = model.com.getOrderListByRouteIDPro(DataPartNew[i].RouteID, DataPartNew[i].ID);

                            for (var m = 0; m < _list.length; m++) {
                                Grade.push(_list[m]);
                            }
                        }
                        //审核数据
                        DataAllConfirm = $com.util.Clone(Grade);
                        for (var i = 0; i < Grade.length; i++) {
                            Grade[i].WID = i + 1;
                        }
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

                //model.com.getFPCRoutePartPoint({ RouteID:1,PartID:1}, function (resP1) {
                //    if (!resP1)
                //        return;
                //    if (resP1 && resP1.list) {

                //    }

                //});
            },

            //查询产品路线
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
            //查询产品路线工序段
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
            //查询工序
            getFPCPartPoint: function (data, fn, context) {
                var d = {
                    $URI: "/FPCPartPoint/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询某个工序段
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
            //保存工序段列表
            postFPCRoutePartPoint: function (data, fn, context) {
                var d = {
                    $URI: "/FPCRoutePartPoint/Update",
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

            getDataOne: function (routeID, partID, orderID) {
                var _list = [];
                for (var i = 0; i < DataAll.length; i++) {
                    if (routeID == DataAll[i].RouteID && partID == DataAll[i].PartID && orderID == DataAll[i].OrderID) {
                        _list.push(DataAll[i]);
                    }
                }
                return _list;

            },
            getOrderListByRouteID: function (RouteID) {
                var _list = [];
                var _listOrder = [];
                for (var i = 0; i < DataPartList.length; i++) {
                    if (RouteID == DataPartList[i].RouteID) {
                        _list.push(DataPartList[i]);
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
            getOrderListByRouteIDPro: function (RouteID, PartID) {
                var _list = [];
                var _listOrder = [];
                for (var i = 0; i < DATABasic.length; i++) {
                    if (RouteID == DATABasic[i].RouteID && PartID == DATABasic[i].PartID) {
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
            getOrderListByRouteID1: function (RouteID, PartID) {
                var _list = [];
                var _listOrder = [];
                for (var i = 0; i < DDDBasic.length; i++) {
                    if (RouteID == DDDBasic[i].RouteID && PartID == DDDBasic[i].PartID) {
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