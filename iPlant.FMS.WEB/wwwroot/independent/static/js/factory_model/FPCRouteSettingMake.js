require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($zace, $com) {

    var KEYWORD_Level_LISTRoute,
        KEYWORD_LevelRoute,
        FORMATTRT_LevelRoute,
        DEFAULT_VALUE_LevelRoute,
        TypeSource_LevelRoute,
        model,
        DataAllRoute,
        DATABasicRoute,     
        DataAllConfirm,
        DataAllSearchRoute,
        DataAllFactorySearchRoute,
        RouteID,
        HTML;

    RouteID = 0;
    DataAllRoute = [];
    DATABasicRoute = [];
    DataAllConfirmBasic = [];
    DataAllConfirmChange = [];
    DataAllConfirm = [];
    DataAllFactorySearchRoute=[];
    DataAllSearchRoute = [];
    PositionTemp = {
        Active: 0,
        Auditor: window.parent.User_Info.Name,
        AuditorID: 0,
        AuditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        BusinessUnit: "",
        BusinessUnitID: 1,
        CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Creator: window.parent.User_Info.Name,
        CreatorID: 0,
        Description: "",
        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Editor: window.parent.User_Info.Name,
        EditorID: 0,
        Factory: "",
        FactoryID: 1,
        LineID: 0,
        ID: 0,
        Name: "",
        ProductType: "",
        ProductTypeID: 0,
        Status: 3,
        StatusText: "",
        VersionNo: "",
    };


    ;
    HTML = {
        TableRouteMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td data-title="LineID" data-value="{{LineID}}" >{{LineID}}</td>',
            '<td data-title="ProductID" data-value="{{ProductID}}" >{{ProductID}}</td>',
            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
            // '<td data-title="VersionNo" data-value="{{VersionNo}}" >{{VersionNo}}</td>',
            '<td data-title="Description" data-value="{{Description}}" >{{Description}}</td>',
            // '<td data-title="BusinessUnit" data-value="{{BusinessUnit}}" >{{BusinessUnit}}</td>',

            // '<td data-title="ProductTypeID" data-value="{{ProductTypeID}}" >{{ProductTypeID}}</td>',
            //'<td data-title="Factory" data-value="{{Factory}}" >{{Factory}}</td>',               

            '<td data-title="Creator" data-value="{{Creator}}" >{{Creator}}</td>',
            '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
            // '<td data-title="Editor" data-value="{{Editor}}" >{{Editor}}</td>',
            // '<td data-title="EditTime" data-value="{{EditTime}}" >{{EditTime}}</td>',
            // '<td data-title="Auditor" data-value="{{Auditor}}" >{{Auditor}}</td>',
            //  '<td data-title="AuditTime" data-value="{{AuditTime}}" >{{AuditTime}}</td>',
             '<td data-title="Active" data-value="{{Active}}" >{{Active}}</td>',
            // '<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',

            '</tr>',
        ].join(""),

        TableRoutePartMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',

            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
            '<td data-title="OrderID" data-value="{{OrderID}}" >{{OrderID}}</td>',
            '<td data-title="RouteName" data-value="{{RouteName}}" >{{RouteName}}</td>',
            '</tr>',
        ].join(""),



    };
    (function () {
        KEYWORD_Level_LISTRoute = [

            "LineID|修程|ArrayOne",
            "ProductID|车型|ArrayOne",
            "Name|流程名称",
            "VersionNo|工艺编码",
            "Description|描述",
            "FactoryID|工厂|ArrayOne",
            //  "BusinessUnitID|事业部|ArrayOneControl",

            "ProductTypeID|类型|ArrayOneControl|BusinessUnitID",
            "Status|状态|ArrayOne",
            "Active|启用|ArrayOne",
            "CreateTime|时间|DateTime",
            "EditTime|时间|DateTime",
        ];
        KEYWORD_LevelRoute = {};
        FORMATTRT_LevelRoute = {};

        DEFAULT_VALUE_LevelRoute = {

            // VersionNo: "",
            Description: "",
            Name: "",
            // BusinessUnitID: 1,
            //FactoryID: 0,
            LineID: 0,
            ProductID: 0,
            //ProductTypeID:0,
            // Active: true,
        };

        TypeSource_LevelRoute = {
            Active: [
                {
                    name: "启用",
                    value: 1
                }, {
                    name: "禁用",
                    value: 0
                }
            ],
            BusinessUnitID: [
                {
                    name: "无",
                    value: 0,
                    far: 0,
                }
            ],

            ProductID: [],
            LineID: [

            ],
            ProductTypeID: [
                {
                    name: "无",
                    value: 0,
                    far: 0,
                }
            ],
            FactoryID: [
                {
                    name: "无",
                    value: 0,
                }
            ],
            Status: [
                //{
                //    name: "默认值",
                //    value: 0
                //},
                {
                    name: "创建",
                    value: 1
                }, {
                    name: "待审核",
                    value: 2
                }, {
                    name: "已审核",
                    value: 3
                }, {
                    name: "撤销审核",
                    value: 4
                },],



        };

        $.each(KEYWORD_Level_LISTRoute, function (i, item) {
            var detail = item.split("|");
            KEYWORD_LevelRoute[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_LevelRoute[detail[0]] = $com.util.getFormatter(TypeSource_LevelRoute, detail[0], detail[2]);
            }
        });
    })();


    model = $com.Model.create({
        name: '路线',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {          
            $("body").delegate("#zace-zace-refreshRoute", "click", function () {
                model.com.refreshRoute();
            });        
            // //双击.
            // $("body").delegate("#femi-riskLevelRoute-tbody tr", "dblclick", function () {

            //     var $this = $(this);
            //     var $table = $this.closest("table");
            //     var WID = Number($this.find('td[data-title=ID]').attr('data-value'));

            //     RouteID = WID;
            //     $table.find("tbody tr").each(function (i, item) {
            //         var $tr = $(this);

            //         if (WID == Number($tr.find("td[data-title=ID]").attr("data-value"))) {
            //             $tr.css('background-color', '#7bf1b5');
            //             temp = true;

            //         }
            //         else {
            //             if (!($tr.attr("data-color"))) {

            //                 $tr.css('background-color', '');
            //             } else {

            //                 var colorPro = $tr.attr("data-color");
            //                 $tr.css('background-color', colorPro);
            //             }
            //         }
            //     });

            //     model.com.refreshPart();
            //     $(".zzzbRoute").hide();
            //     //$(".zzza").css("width", "70%");
            //     //$(".zzzc").css("width", "29%");
            //     $(".zzzcRoute").css("width", "350px");
            //     $(".zzzaRoute").css("margin-right", "350px");
            //     $(".zzzcRoute").show();


            //     return false;
            // });
            //隐藏
            $("body").delegate("#zace-closePart-levelRoute", "click", function () {

                $(".zzzbRoute").hide();
                $(".zzzaRoute").css("margin-right", "0px");
                $(".zzzcRoute").css("width", "0px");
                $(".zzzcRoute").hide();

                model.com.refreshRoute();
            });
            //Enter触发模糊查询事件
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var value = $("#zace-search-approvalRoute").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-riskLevelRoute-tbody").children("tr").show();
                    else
                        //     DataAllproduct = [];
                        // for (var i = 0; i < DataAllFactorySearch.length; i++) {
                        //     if (DataAllFactorySearch[i].Active == "启用") {
                        //         DataAllproduct.push(DataAllFactorySearch[i]);
                        //     }
                        // }
                        $com.table.filterByLikeString($("#femi-riskLevelRoute-tbody"), DataAllFactorySearchRoute, value, "ID");
                }
            });
            //申请查询
            $("body").delegate("#zace-searchApproval-levelRoute", "click", function () {
                var value = $("#zace-search-approvalRoute").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevelRoute-tbody").children("tr").show();
                else
                    //     DataAllproduct = [];
                    // for (var i = 0; i < DataAllFactorySearch.length; i++) {
                    //     if (DataAllFactorySearch[i].Active == "启用") {
                    //         DataAllproduct.push(DataAllFactorySearch[i]);
                    //     }
                    // }
                    $com.table.filterByLikeString($("#femi-riskLevelRoute-tbody"), DataAllFactorySearchRoute, value, "ID");
            });

            $("body").delegate("#zace-open-FirstRoute", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevelRoute-tbody"), "ID", DataAllRoute);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！")
                    return;
                }
                var vdata = { 'header': '一级流程', 'href': './factory_model/FPCRouteFirstSettingMake.html?id='+SelectData[0].ID, 'id': 'FPCRoutePartMake', 'src': './static/images/menu/newfactoryModel/techniquePart.png' };
                window.parent.iframeHeaderSet(vdata);
                window.callFunctionTrigger("FPCRoutePartMake",{ID:SelectData[0].ID});

            });
           
         
            //产品路线修改
            $("body").delegate("#zace-edit-levelRoute", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevelRoute-tbody"), "ID", DataAllRoute);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                // if (SelectData[0].Status != 1) {
                //     alert("请选择状态为创建的数据！")
                //     return;
                // }
                var default_value = {
                    LineID: SelectData[0].LineID,
                    Name: SelectData[0].Name,
                    ProductID: SelectData[0].ProductID,
                    Description: SelectData[0].Description,
                    // FactoryID: SelectData[0].FactoryID,
                    // BusinessUnitID: SelectData[0].BusinessUnitID,
                    // ProductTypeID: SelectData[0].ProductTypeID,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_LevelRoute, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].Name = rst.Name;
                    SelectData[0].VersionNo = rst.Name;
                    SelectData[0].Description = rst.Description;
                    // SelectData[0].FactoryID = Number(rst.FactoryID);
                    SelectData[0].LineID = Number(rst.LineID);
                    SelectData[0].ProductID = Number(rst.ProductID);
                    // SelectData[0].BusinessUnitID = Number(rst.BusinessUnitID);

                    for (var i = 0; i < SelectData.length; i++) {
                        $com.util.deleteLowerProperty(SelectData[i]);
                    }
                    model.com.postFPCRoute({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        $("#zace-closePart-levelRoute").click();
                        //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                        //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    })

                }, TypeSource_LevelRoute));


            });

            //工产品路线启用
            $("body").delegate("#zace-active-levelRoute", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevelRoute-tbody"), "ID", DataAllRoute);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                //if (SelectData[0].Status != 1) {
                //    alert("数据选择有误！")
                //    return;
                //}
                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                model.com.activeAudit({
                    data: SelectData,
                    Active: 1,
                }, function (res) {
                    alert("启用成功");
                    $("#zace-closePart-levelRoute").click();


                })




            });
            //产品路线禁用
            $("body").delegate("#zace-disable-levelRoute", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevelRoute-tbody"), "ID", DataAllRoute);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                //if (SelectData[0].Status != 1) {
                //    alert("数据选择有误！")
                //    return;
                //}
                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                model.com.activeAudit({
                    data: SelectData,
                    Active: 0,
                }, function (res) {
                    alert("禁用成功");
                    $("#zace-closePart-levelRoute").click();


                })

            });

            $("body").delegate("#zace-open-ok", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevelRoute-tbody"), "ID", DataAllRoute);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                if (SelectData[0].Status != 1) {
                   alert("数据选择有误！")
                   return;
                }
              
             
                 $com.util.deleteLowerProperty(SelectData[0]);
                 SelectData[0].Status=3;
                 model.com.activeAudit({
                    data: SelectData,
                }, function (res) {
                    alert("审批成功");
                    $("#zace-closePart-levelRoute").click();


                })

            });
            

            //产品新增
            $("body").delegate("#zace-add-levelRoute", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_LevelRoute, KEYWORD_LevelRoute, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    // PositionTemp.BusinessUnitID = Number(rst.BusinessUnitID);
                    PositionTemp.LineID = Number(rst.LineID);
                    PositionTemp.ProductID = Number(rst.ProductID);
                    //PositionTemp.ProductTypeID = Number(rst.ProductTypeID);
                    //PositionTemp.FactoryID = Number(rst.FactoryID);                   
                    PositionTemp.Name = rst.Name;
                    PositionTemp.Description = rst.Description;
                    // PositionTemp.Status = Number(rst.Status);
                    PositionTemp.VersionNo = rst.Name;
                    //PositionTemp.Active = rst.Active;

                    model.com.postFPCRoute({
                        data: PositionTemp,
                    }, function (res) {
                        alert("新增成功");
                        $("#zace-closePart-levelRoute").click();
                    })

                }, TypeSource_LevelRoute));


            });
          

            // $("body").delegate("#zace-routePartPoint-level", "click", function () {
            //     var vdata = { 'header': '工艺工序', 'href': './factory_model/FPCRoutePartPointSettingTest.html', 'id': 'FPCRoutePartPoint', 'src': './static/images/menu/newfactoryModel/techniquePartpoint.png' };
            //     window.parent.iframeHeaderSet(vdata);

            // });


            // $("body").delegate("#zace-routePart-levelRoute", "click", function () {
            //     var vdata = { 'header': '工艺工位', 'href': './factory_model/FPCRoutePartSettingTest.html', 'id': 'FPCRoutePart', 'src': './static/images/menu/newfactoryModel/techniquePart.png' };
            //     window.parent.iframeHeaderSet(vdata);

            // });
            // $("body").delegate("#zace-ProductRoute-levelRoute", "click", function () {
            //     var vdata = { 'header': '车型工艺路线', 'href': './factory_model/ProductRouteSettingTest.html', 'id': 'ProductRouteSetup', 'src': './static/images/menu/newfactoryModel/productTechniqueRoute.png' };
            //     window.parent.iframeHeaderSet(vdata);

            // });
        },




        run: function () {



            model.com.getFMCLineAll({}, function (resBZ) {
                if (resBZ && resBZ.list) {
                    $.each(resBZ.list, function (i, item) {

                        if (item.Active) {
                            TypeSource_LevelRoute.LineID.push({
                                name: item.Name,
                                value: item.ID,
                                far: 0,
                            });
                        }

                    });

                }

                model.com.getFPCProduct({ ProductTypeID: 0, BusinessUnitID: 0 }, function (resBP) {
                    if (resBP && resBP.list) {
                        $.each(resBP.list, function (i, item) {

                            if (item.Active) {
                                TypeSource_LevelRoute.ProductID.push({
                                    name: item.ProductNo,
                                    value: item.ID,
                                    far: 0,
                                });
                            }

                        });

                    }

                    model.com.refreshRoute();
                });

            });



        },
         
        com: {

             //查询
          getFPCProduct: function (data, fn, context) {
            var d = {
                $URI: "/FPCProduct/All",
                $TYPE: "get"
            };

            function err() {
                $com.app.tip('获取失败，请检查网络');
            }

            $com.app.ajax($.extend(d, data), fn, err, context);
        },
         
            refreshRoute: function () {
                $com.app.loading('数据加载中...');
                model.com.getFPCRoute({ FactoryID: 0, BusinessUnitID: 0, ProductTypeID: 0 }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var Grade = $com.util.Clone(resP.list);
                        DATABasicRoute = $com.util.Clone(resP.list);

                        //
                        DataAllConfirmRoute = $com.util.Clone(resP.list);
                        for (var i = 0; i < Grade.length; i++) {
                            Grade[i].WID = i + 1;
                        }
                        DataAllRoute = $com.util.Clone(Grade);

                        $.each(Grade, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_LevelRoute[p])
                                    continue;
                                item[p] = FORMATTRT_LevelRoute[p](item[p]);
                            }
                            item.WID = i + 1;
                        });
                        DataAllFactorySearchRoute = $com.util.Clone(Grade);
                        $("#femi-riskLevelRoute-tbody").html($com.util.template(Grade, HTML.TableRouteMode));

                        $com.app.loaded();
                      


                    }

                });
              
                window.parent._zaceRouteSet = 1;          
            },
            refreshPart: function () {
                $com.app.loading('数据加载中...');
                model.com.getFPCRoutePart({ RouteID: RouteID }, function (resP) {
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
                        for (var index = 0; index < _listOrder.length; index++) {
                            _listOrder[index].WID = index + 1;;

                        }
                        $("#femi-riskPart-tbody").html($com.util.template(_listOrder, HTML.TablePartMode));
                        $com.app.loaded();
                    }
                });

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
            //查询工厂
            getFMCFactory: function (data, fn, context) {
                var d = {
                    $URI: "/FMCFactory/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询规格类型
            getFPCProductType: function (data, fn, context) {
                var d = {
                    $URI: "/FPCProductType/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询产线
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
            //查询事业部
            getBusinessUnit: function (data, fn, context) {
                var d = {
                    $URI: "/BusinessUnit/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询产品路线列表
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
            //保存产品路线列表
            postFPCRoute: function (data, fn, context) {
                var d = {
                    $URI: "/FPCRoute/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //审核
            postAudit: function (data, fn, context) {
                var d = {
                    $URI: "/FPCRoute/Audit",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //启用
            activeAudit: function (data, fn, context) {
                var d = {
                    $URI: "/FPCRoute/Active",
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
                    if (item.ID > id)
                        id = item.ID;
                });
                return id + 1;

            },
        }
    }),

        model.init();


});