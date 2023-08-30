require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/route_new'], function ($zace, $com,$route) {

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

            '<td data-title="RouteName" data-value="{{RouteName}}" >{{RouteName}}</td>',
            // '<td data-title="VersionNo" data-value="{{VersionNo}}" >{{VersionNo}}</td>',
            '<td data-title="PartName" data-value="{{PartName}}" >{{PartName}}</td>',
            '<td data-title="PartPointName" data-value="{{PartPointName}}" >{{PartPointName}}</td>',
            '<td data-title="PrevStepID" data-value="{{PrevStepID}}" >{{PrevStepID}}</td>',
            '<td data-title="NextIDText" data-value="{{NextIDText}}" >{{NextIDText}}</td>',
            '<td data-title="OrderID" data-value="{{OrderID}}" >{{OrderID}}</td>',
            '<td data-title="Creator" data-value="{{Creator}}" >{{Creator}}</td>',
            '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
            '</tr>',
        ].join(""),



    };
    (function () {
        KEYWORD_Level_LIST = [

            "PartPointID|工序|ArrayOne",
            "PrevStepID|上层|ArrayOne",
            "NextID|下层|Array",
            "OrderID|顺序",
            "CreateTime|编辑时刻|DateTime",
        ];
        KEYWORD_Level = {};
        FORMATTRT_Level = {};

        DEFAULT_VALUE_Level = {
            OrderID: 1,
            //VersionNo: "",
            // RouteID: 0,
            PrevStepID: 0,
            PartPointID: 0,
        };

        TypeSource_Level = {

            PartPointID: [
                {
                    name: "无",
                    value: 0,
                }
            ], PrevStepID: [
                {
                    name: "无",
                    value: 0,
                }
            ], NextID: [
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
        name: '工序',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {

            window.setFunctionTrigger("FPCRoutePartPointSettingTest", function (res) {

                mPartID = res.ID;
                mRouteIDZace = res.RouteID;

                model.com.getFPCRouteInfo({ ID: mRouteIDZace }, function (res_route) {
                    if (res_route.info && res_route.info.ID > 0) {
                        mLineID = res_route.info.LineID;
                        mProductID = res_route.info.ProductID;
                        model.com.loadZace();
                    } else {
                        alert("方案未找到，请关闭后再试");
                    }
                });
            });

            
            $("body").delegate("#zace-addLine-levelReturn", "click", function () {

                $('.zace-leftContain.closeContent').show();
                $('.zace-line-route').hide();
                $('#DragLine').hide(); 
  
            });

            $("body").delegate("#zace-open-create", "click", function () {


                model.com.create({ RouteID: mRouteIDZace, PartID: mPartID }, function (resP) {


                    model.com.refresh();

                });
               
  
            });



            $("body").delegate("#zace-open-routeLine", "click", function () {

                $('.zace-leftContain.closeContent').hide();

                $('.zace-line-route').show();
                $('#DragLine').show();

                DropRouteID = mRouteIDZace;
                model.com.renderRouteChart( DataAll);
                var title = "三级流程图";
                $(".zace-titleZ").html(title);
            });

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
                    alert("只能同时对一行数据修改！");
                    return;
                }
                var default_value = {

                    //VersionNo: SelectData[0].VersionNo,                
                    OrderID: SelectData[0].OrderID,
                    //RouteID: SelectData[0].RouteID,
                    // PartID: SelectData[0].PartID,
                    PrevStepID: SelectData[0].PrevStepID,
                    PartPointID: SelectData[0].PartPointID,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    //SelectData[0].VersionNo = rst.VersionNo;
                    SelectData[0].OrderID = Number(rst.OrderID);
                    SelectData[0].PrevStepID = Number(rst.PrevStepID);

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
                    PositionTemp.RouteID = Number(mRouteIDZace);
                    PositionTemp.PartID = Number(mPartID);
                    PositionTemp.PrevStepID = Number(rst.PrevStepID);
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

            $("body").delegate("#zace-add-levelNextItem", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！");
                    return;
                }
                var default_value = {

                    NextID: SelectData[0].NextID,

                };



                $("body").append($com.modal.show(default_value, KEYWORD_Level, "编辑下层", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].NextStepIDMap = {};

                    for (var k = 0; k < rst.NextID.length; k++) {

                        if (SelectData[0].ID == rst.NextID[k]) {
                            alert("不能选自己！");
                            return false;
                        }
                        SelectData[0].NextStepIDMap[rst.NextID[k] + ""] = 0;
                    }


                    for (var i = 0; i < SelectData.length; i++) {
                        $com.util.deleteLowerProperty(SelectData[i]);
                    }
                    model.com.updateStep({
                        data: SelectData[0],
                    }, function (res) {
                        alert("编辑成功");
                        model.com.refresh();
                        //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                        //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    })

                }, TypeSource_Level));


            });

            $("body").delegate("#zace-remove-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能对一行数据操作！")
                    return;
                }
                if (!confirm("确定删除此数据吗？")) {
                    return;
                }

                model.com.DeleteFPCRoutePartPoint({
                    RouteID: SelectData[0].RouteID,
                    ID: SelectData[0].ID,
                }, function (res) {
                    alert("删除成功");
                    model.com.refresh();
                    //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                    //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                })




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
            mRouteIDZace = model.query.routeID;
            mPartID = model.query.id;

            model.com.getFPCRouteInfo({ ID: mRouteIDZace }, function (res_route) {
                if (res_route.info && res_route.info.ID > 0) {
                    mLineID = res_route.info.LineID;
                    mProductID = res_route.info.ProductID;
                    model.com.loadZace();
                } else {
                    alert("方案未找到，请关闭后再试");
                }
            });



        },

        com: {
            loadZace: function () {
                $com.app.loading('数据加载中...');

                model.com.getItemList({ LineID: mLineID, ProductID: mProductID, ID: 0 }, function (resBomItem) {

                    if (resBomItem && resBomItem.list) {
                        var _ParentUnitID = -1;
                        TypeSource_Level.PartPointID=[];
                        $.each(resBomItem.list, function (i, item) {
                            if (item.LevelID == 2 && item.UnitID == mPartID)
                                _ParentUnitID = item.UnitID;
                            if (item.LevelID == 3 && _ParentUnitID > 0 && _ParentUnitID == item.ParentUnitID) {
                                TypeSource_Level.PartPointID.push({
                                    name: item.Name,
                                    value: item.UnitID
                                });

                            }

                        });

                    }
                    $com.app.loaded();

                    model.com.refresh();

                });


            },
            create: function (data, fn, context) {
                var d = {
                    $URI: "/FPCRoutePartPoint/Create",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getFPCRouteInfo: function (data, fn, context) {
                var d = {
                    $URI: "/FPCRoute/Info",
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
                model.com.getFPCRoutePartPoint({ RouteID: mRouteIDZace, PartID: mPartID }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {


                        TypeSource_Level.PrevStepID.splice(1, TypeSource_Level.PrevStepID.length - 1);

                        $.each(resP.list, function (i, item) {
                            TypeSource_Level.PrevStepID.push({
                                name: item.PartPointName,
                                value: item.PartPointID,
                            });
                        });

                        TypeSource_Level.NextID = TypeSource_Level.PrevStepID;

                        $.each(resP.list, function (k, item_k) {
                            item_k.NextID = [];

                            for (p in item_k.NextStepIDMap) {
                                item_k.NextID.push(p);
                            }


                        });



                        var Grade = $com.util.Clone(resP.list);
                        var DDD = $com.util.Clone(resP.list);
                        DDDBasic = DDD;
                        DATABasic = $com.util.Clone(DDDBasic);
                        DATAZBasic = $com.util.Clone(resP.list);
                        // for (var i = 0; i < DataPartNew.length; i++) {
                        //     var _list = [];
                        //     _list = model.com.getOrderListByRouteIDPro(DataPartNew[i].RouteID, DataPartNew[i].ID);

                        //     for (var m = 0; m < _list.length; m++) {
                        //         Grade.push(_list[m]);
                        //     }
                        // }
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

            renderRouteChart: function (_dataPart) {

                //拿到此路线下对应的工序段
                var OrderIDList = _dataPart;   //順序ID集合
                var routePartArr = [];
                ZaceData = [];   //初始化

                routePartArr = $com.util.Clone(_dataPart);
 
                $.each(routePartArr,function(i,item){
                    item.Type=1;
                });

                $('#DragLine').html('');

                //显示流程图

                //为流程图添加方法
                //创建悬浮框方法
                var mouseoverFn = function (data, json) {
                    var cv = $(".left-contain").scrollTop();
                    //var cl = $("#ChartRoute").scrollLeft();
                    var $target = {
                        offset: function () {
                            return {
                                left: json.X + json.left + 300 + 15,
                                top: json.Y + json.top + 60 - cv,
                            };
                        },
                        width: function () {
                            return json.width;
                        },
                        height: function () {
                            return json.height;
                        },
                    }
                    //var x = json.X + json.left;
                    //var y = json.Y + json.top - cv;
                    //  alert(json.Y + "   ---   " + json.top);
                    var dataHtml = model.com.changeData(data);
                    //$tooltip.show({ target: $target, object: dataHtml, orientation: 2, Choice_color: 4, max_width: 200, fontsize: 13, });
                }
                var mouseoutFn = function (data) {
                    $tooltip.clear();
                }
                //点击方法
                var clickFn = function (data, json) {
                    var _info = data;
                    var showInfo = $com.util.Clone(_info);
                    //var _showData = {};
                    //for (var i = 0; i < dataPartPoint.length; i++) {
                    //    if (showInfo.ID == dataPartPoint[i].ID) {
                    //        _showData = $com.util.Clone(dataPartPoint[i]);
                    //    }
                    //}
                    //DataShow = _showData;
                    //20191209

                    // model.com.refreshStationGrid(showInfo.ID);
                    // //model.com.refreshGrid(showInfo.ID,mProductID);



                    // $(".right-contain").css("width", "400px");
                    // $(".left-containPro").css("margin-right", "400px");
                    // $(".right-contain").show();
                    //20191209
                }
                var dragFn = function (data) {
                    var _data = data.data.data;

                    $.each(mZacePart, function (j, item_j) {
                        $.each(_data, function (i, item) {
                            if (item.ID != item_j.PartID)
                                return true;

                            item_j.OrderID = item.OrderID;
                            item_j.PrevPartID = item.PrevID;

                            item_j.NextPartIDMap = {};
                            if (item.NextIDList && item.NextIDList.length > 0) {

                                $.each(item.NextIDList, function (k, item_k) {
                                    item_j.NextPartIDMap[item_k + ""] = 0;
                                    console.log(j);
                                });
                            }

                        });
                    });

                } 
                //2 创建结构
                var dataObj = {

                    data: routePartArr,
                    dataSet: {//对应关系
                        Text: "PartPointName", //显示字段名称
                        Index: "PartPointID", //索引字段名称
                        PrevIndex: "PrevStepID", //上级字段名称
                        NextIndex: "NextID", //下级字段名称
                        TypeIndex: "Type", //下级字段名称
                        FatherID: "FatherID",  //父级ID
                        BGC: "aa", //背景色字段名称
                        FGC: "bb", //前景色字段名称
                    },
                    background_color: 'orange', //流程框背景颜色
                    foreground_color: 'orange', //箭头颜色 
                    text_color: "white", //文字颜色
                    fn_mouseover: mouseoverFn, //鼠标悬停触发
                    fn_mouseout: mouseoutFn, //鼠标移走事件
                    fn_click: clickFn, //鼠标单击
                    fn_drag: dragFn, //鼠标拖动
                    constant: {
                        lineOperation: true,
                        // dottedLine: true,
                        font: "bold 15px 宋体",//字体样式
                        fontSize: 15,//字体大小
                        rect_width: 200, //矩形的宽
                        rect_height: 50,
                    },
                }  
                $('#DragLine').show();
                //4 显示流程图
                $route.show($('#DragLine'), dataObj);

                
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

            DeleteFPCRoutePartPoint: function (data, fn, context) {
                var d = {
                    $URI: "/FPCRoutePartPoint/Delete",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('删除失败，请检查网络');
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