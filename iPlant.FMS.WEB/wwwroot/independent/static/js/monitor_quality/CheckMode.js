require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/jquery.treeview', '../static/utils/js/base/paging'], function ($zace, $com, $tree, $page) {

    var model,
        DATAChange,
        DATA,
        DATAITEM,
        DATAITEMChange,
        mLineID,
        mProductID,
        mCustomerID,
        MaterialList,
        KEYWORD_BOMItem_LIST,
        KEYWORD_BOMItem,
        FORMATTRT_BOMItem,
        TypeSource_BOMItem,
        DataMaterialList,
        DATAItemSearch,
        DataMateialBasic,
        DATASearch,
        mID,
        DataLineList,
        DATAAllBasic,
        mItemID,
        DATATree,
        HTML;
    mLineID = 0;
    mProductID = 0;
    mCustomerID = 0;
    mID = 0;
    DATAITEMChange = DATAItemSearch = DATASearch = [];
    MaterialList = DataLineList = [];
    DATAITEM = DATAAllBasic = [];
    DATAChange = [];
    DATA = [];
    DataPointList = [];
    var ColorList = ['#d1d06b5e', '#f6e3b5', '#e0cc9c'];




    HTML = {
        TableBOMItemMode: [
            '<tr >',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  style="min-width: 50px" data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td data-title="CustomerName" data-value="{{CustomerName}}" >{{CustomerName}}</td>',
            '<td data-title="Line" data-value="{{Line}}" >{{Line}}</td>',
            '<td data-title="ProductNo" data-value="{{ProductNo}}" >{{ProductNo}}</td>',
            '<td data-title="PartName" data-value="{{PartName}}" >{{PartName}}</td>',
            '<td data-title="RoutePartPointCode" data-value="{{RoutePartPointCode}}" >{{RoutePartPointCode}}</td>',
            '<td data-title="PartPointName" data-value="{{PartPointName}}" >{{PartPointName}}</td>',
            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
            '<td data-title="Standard" data-value="{{Standard}}" >{{Standard}}</td>',
            '<td data-title="Remark" data-value="{{Remark}}" >{{Remark}}</td>',
            '<td data-title="Editor" data-value="{{Editor}}" >{{Editor}}</td>',
            '<td data-title="EditTime" data-value="{{EditTime}}" >{{EditTime}}</td>',
            '<td data-title="Active" data-value="{{Active}}" >{{Active}}</td>',
            '</tr>',
        ].join(""),




        TreeItemNode: [
            '<li data-titie="{{ID}}"  data-value="{{ID}}" >',
            '<span style="vertical-align:top;" data-value="{{ID}}"}" >{{Name}}</span> ',
            '<ul>{{Items}}',
            '</ul>',
            '</li>',
        ].join(""),

    },
        // Item
        (function () {
            KEYWORD_BOMItem_LIST = [
                "CreateTime|时间|DateTime",
                "EditTime|时间|DateTime",
                "RoutePartPointID|工艺Bop工序|ArrayOne",
                "Name|点检项",
                "EntityIDM|物料|ArrayOne",
                "MaterialNumber|物料数量",
                "EntityIDD|设备|ArrayOne",
                "Standard|标准",
                "Remark|项点描述",
                "TypeID|类型|ArrayOne",

                "Active|状态|ArrayOne",


            ];
            KEYWORD_BOMItem = {};
            FORMATTRT_BOMItem = {};


            TypeSource_BOMItem = {
                RoutePartPointID: [],
                EntityIDM: [],
                EntityIDD: [],
                Active: [
                    {
                        name: "禁用",
                        value: 0
                    },
                    {
                        name: "启用",
                        value: 1
                    }, {
                        name: "禁用",
                        value: 2
                    }
                ],
                TypeID: [
                    {
                        name: "其他",
                        value: 0
                    },
                    {
                        name: "物料",
                        value: 1
                    }, {
                        name: "设备",
                        value: 6
                    }
                ],
            };

            $.each(KEYWORD_BOMItem_LIST, function (i, item) {
                var detail = item.split("|");
                KEYWORD_BOMItem[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };
                if (detail.length > 2) {
                    FORMATTRT_BOMItem[detail[0]] = $com.util.getFormatter(TypeSource_BOMItem, detail[0], detail[2]);
                }
            });
        })();

    model = $com.Model.create({
        name: 'bom对比',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {

            $("body").delegate("#zace-add-mode", "click", function () {
                var DEFAULT_VALUE = {
                    Name: '',
                    Standard: '',
                    Remark: '',

                };
                //将Json数据中的数据值改成对应默认值，然后传入进去
                $("body").append($com.modal.show(DEFAULT_VALUE, KEYWORD_BOMItem, "新增", function (rst) {
                    //调用插入函数 

                    if (!rst || $.isEmptyObject(rst))
                        return;

                    var _data = {
                        Name: rst.Name,
                        Active: 0,
                        RoutePartPointID: mBRoutePointID,
                        EntityID: 0,
                        TypeID: 0,
                        Standard: rst.Standard,
                        ID: 0,
                        Remark: rst.Remark,
                        MaterialNumber: 0.0,
                    };
                    model.com.updateMSSStepBomAll({
                        data: _data
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                    })

                }, TypeSource_BOMItem));

            });

            $("body").delegate("#zace-dasable-mode", "click", function () {
				
                var SelectData = $com.table.getSelectionData($("#femi-bomItem-tbody"), "ID", DATAITEM);

				if (!SelectData || !SelectData.length) {
					alert("至少选择一行数据！")
					return;
				}
				if (!confirm("已选择" + SelectData.length + "条数据，确定将其禁用？")) {
					return;
				}

				for (var i = 0; i < SelectData.length; i++) {
					$com.util.deleteLowerProperty(SelectData[i]);
				}

				model.com.active({
					data: SelectData,
					Active: 2
				}, function (res) {
					alert("禁用成功");
				
					model.com.refresh();
				})


            });
            
            //启用
			$("body").delegate("#zace-active-mode", "click", function () {
				// if (window.parent._grad < 9) {
				// 	alert("无权限！！");
				// 	return false;

				// }
				// var SelectData = $('.tb_users').bootstrapTable('getSelections');
                var SelectData = $com.table.getSelectionData($("#femi-bomItem-tbody"), "ID", DATAITEM);

				if (!SelectData || !SelectData.length) {
					alert("至少选择一行数据！")
					return;
				}
				if (!confirm("已选择" + SelectData.length + "条数据，确定将其启用？")) {
					return;
				}
				for (var i = 0; i < SelectData.length; i++) {
					$com.util.deleteLowerProperty(SelectData[i]);
				}

				model.com.active({
					data: SelectData,
					Active: 1
				}, function (res) {
					alert("启用成功");
					
					model.com.refresh();
				});
			});



            $("body").delegate("#zace-add-modeMaterial", "click", function () {
                var DEFAULT_VALUE = {
                    EntityIDM: 0,
                    MaterialNumber: 0.0,
                    Standard: '',
                    Remark: '',

                };
                //将Json数据中的数据值改成对应默认值，然后传入进去
                $("body").append($com.modal.show(DEFAULT_VALUE, KEYWORD_BOMItem, "新增", function (rst) {
                    //调用插入函数 

                    if (!rst || $.isEmptyObject(rst))
                        return;
                    var _name = '';
                    if (modelMaterial[rst.EntityIDM].UnitText.length > 0) {
                        if (Number(rst.MaterialNumber) > 0) {
                            _name = modelMaterial[rst.EntityIDM].MaterialName + '【' + modelMaterial[rst.EntityIDM].MaterialNo + '】' + '(数量' + rst.MaterialNumber + ' 单位' + modelMaterial[rst.EntityIDM].UnitText + ')';
                        } else {
                            _name = modelMaterial[rst.EntityIDM].MaterialName + '【' + modelMaterial[rst.EntityIDM].MaterialNo + '】' + '(' + '单位' + modelMaterial[rst.EntityIDM].UnitText + ')';
                        }

                    } else {
                        if (Number(rst.MaterialNumber) > 0) {
                            _name = modelMaterial[rst.EntityIDM].MaterialName + '【' + modelMaterial[rst.EntityIDM].MaterialNo + '】' + '(数量' + rst.MaterialNumber + ')';
                        } else {
                            _name = modelMaterial[rst.EntityIDM].MaterialName + '【' + modelMaterial[rst.EntityIDM].MaterialNo + '】';
                        }

                    }



                    var _data = {
                        Name: _name,
                        Active: 0,
                        RoutePartPointID: mBRoutePointID,
                        EntityID: modelMaterial[rst.EntityIDM].MaterialID,
                        TypeID: 1,
                        Standard: rst.Standard,
                        ID: 0,
                        Remark: rst.Remark,
                        MaterialNumber: rst.MaterialNumber,
                    };
                    model.com.updateMSSStepBomAll({
                        data: _data
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                    })

                }, TypeSource_BOMItem));

            });
            $("body").delegate("#zace-add-modeDevice", "click", function () {
                var DEFAULT_VALUE = {
                    EntityIDD: 0,
                    Standard: '',
                    Remark: '',
                };
                //将Json数据中的数据值改成对应默认值，然后传入进去
                $("body").append($com.modal.show(DEFAULT_VALUE, KEYWORD_BOMItem, "新增", function (rst) {
                    //调用插入函数 

                    if (!rst || $.isEmptyObject(rst))
                        return;

                    var _data = {
                        Name: FORMATTRT_BOMItem['EntityIDD'](Number(rst.EntityIDD)),
                        Active: 0,
                        RoutePartPointID: mBRoutePointID,
                        EntityID: rst.EntityIDD,
                        TypeID: 6,
                        Standard: rst.Standard,
                        ID: 0,
                        Remark: rst.Remark,
                        MaterialNumber: 0.0,
                    };
                    model.com.updateMSSStepBomAll({
                        data: _data
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                    })

                }, TypeSource_BOMItem));

            });


            $("body").delegate("#zace-editRemove-mode", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-bomItem-tbody"), "ID", DATAITEM);
                if (!SelectData || !SelectData.length) {
                    alert("至少选择一行数据！")
                    return;
                }

                // for (var i = 0; i < SelectData.length; i++) {
                // 	$com.util.deleteLowerProperty(SelectData[i]);
                // 	if (SelectData[i].Active != 0) {
                // 		alert('');
                // 		return false;
                // 	}
                // }
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }

                var a = 0;

                $com.app.loading();

                var WhileAdd = function () {

                    model.com.deleteMSSStepBomAll({
                        data: SelectData[a],
                    }, function (res) {
                        a++;

                        if (a == SelectData.length) {
                            $com.app.loaded();

                            alert("删除成功");
                            model.com.refresh();
                        } else {
                            WhileAdd();
                        }
                    });

                }
                if (SelectData.length <= 0) {
                    alert("数据为空！！！");
                } else {
                    WhileAdd();
                }


            });


            $("body").delegate("#zace-shaixuan-table", "click", function (e) {

                var value = $(this).prev().children("input").val();

                $com.table.filterByLikeString($("#femi-bomItem-tbody"), DATAItemSearch, value, "ID");
            });

          

            $("body").delegate("#zace-shaixuan-refresh", "click", function (e) {

                model.com.refresh();
            })


            window.setFunctionTrigger("CheckMode", function (res) {


                mARouteID = res.ARouteID;
                mBRoutePointID = res.BRoutePointID;
                mCode = res.Code;
                mPartPointID = res.PartPointID;
                mPartID = res.PartID;
                model.com.loadzace();
            });


        },

        run: function () {
            mID = 1;
            mAllData = 0;
            modelDevice = {};
            modelMaterial = {};
            mPartData = 0;
            // $com.app.loading("加载中...");
            mPartID = model.query.partID;
            mPartPointID = model.query.partPointID;
            mARouteID = model.query.aRouteID;
            mBRoutePointID = model.query.bRoutePointID;
            mCode = model.query.Code;
            model.com.loadzace();


        },

        com: {
            //设备台账
            getDevive: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceLedger/All",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            loadzace: function () {


                model.com.getDevive({
                    ModelID: 0, WorkShopID: 0, LineID: 0,
                    BusinessUnitID: 0, BaseID: 0, FactoryID: 0,
                    ApplyID: 0,
                }, function (resP) {
                    modelDevice = {};
                    $.each(resP.list, function (i, item) {
                        modelDevice[item.ID] = item;
                        if (item.Status == 1) {
                            TypeSource_BOMItem.EntityIDD.push({
                                name: item.Name + '【' + item.DeviceNo + '】',
                                value: item.ID,
                            })
                        }

                    });

                    model.com.getBomItemList({
                        PlaceID: mPartID, RouteID: mARouteID, PartPointID: mPartPointID,
                        IsList: true,
                    }, function (resP) {
                        modelMaterial = {};
                        $.each(resP.list, function (i, item) {
                            modelMaterial[item.ID] = item;
                            if (item.Active == 1) {
                                TypeSource_BOMItem.EntityIDM.push({
                                    name: item.MaterialName + '【' + item.MaterialNo + '】',
                                    value: item.ID,
                                })
                            }

                        });
                        model.com.refresh();

                    });

                });


            },
            active: function (data, fn, context) {
				var d = {
					$URI: "/MSSStepBom/Active",
					$TYPE: "post"
				};

				function err() {
					$com.app.tip('提交失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},
            //获取BOM子项列表
            getBomItemList: function (data, fn, context) {
                var d = {
                    $URI: "/BomItem/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
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
            refresh: function () {
                $com.app.loading("加载中...");
                $('#zace-spanTextChange').html('(' + mCode + ')班前点检项');
                model.com.getMSSStepBomAll({ RoutePartPointID: mBRoutePointID }, function (resBomItem) {

                    // var name = '(' + FORMATTRT_BOMItem["LineID"](mLineID) + "-" + FORMATTRT_BOMItem["ProductID"](mProductID) + ")工序明细清单";
                    // var nameLeft = FORMATTRT_BOMItem["LineID"](mLineID) + "-" + FORMATTRT_BOMItem["ProductID"](mProductID);

                    // $("#zace-spanTextChange").html(name);
                    // $(".zaceLineTitle").html(nameLeft);

                    if (resBomItem && resBomItem.list) {

                        var ZaceList = $com.util.Clone(resBomItem.list);

                        var ItemList = $com.util.Clone(resBomItem.list);



                        DATAITEM = $com.util.Clone(resBomItem.list);

                        DATAITEMChange = $com.util.Clone(ItemList);
                        $.each(ItemList, function (i, item) {
                            item.WID = i + 1;

                            for (var p in item) {
                                if (!FORMATTRT_BOMItem[p])
                                    continue;
                                item[p] = FORMATTRT_BOMItem[p](item[p]);
                            }





                        });

                        DATAItemSearch=$com.util.Clone(ItemList);
                        //model.com.refreshPoint(mID, DATAItemSearch);
                        $("#femi-bomItem-tbody").html($com.util.template(ItemList, HTML.TableBOMItemMode));
                        $com.app.loaded();


                    }
                });

            },

            renderTree: function (list) {
                //list  ： Type List

                model.com.fullItems(list);

                $("#areaTree").html($com.util.template(list, HTML.TreeItemNode));
                $("#areaTree").treeview({ collapsed: true });
            },
            fullItems: function (list) {

                $.each(list, function (i, item) {

                    model.com.fullItems(item.UnitList);

                    item.Items = $com.util.template(item.UnitList, HTML.TreeItemNode);
                    //     if(item.Items.length>0){
                    //         item.Items="<ul>"+ item.Items+"</ul>";
                    // }

                });
            },


            //查询
            getMSSStepBomAll: function (data, fn, context) {
                var d = {
                    $URI: "/MSSStepBom/All",
                    $TYPE: "get",

                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //更新
            updateMSSStepBomAll: function (data, fn, context) {
                var d = {
                    $URI: "/MSSStepBom/Update",
                    $TYPE: "post",

                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //删除
            deleteMSSStepBomAll: function (data, fn, context) {
                var d = {
                    $URI: "/MSSStepBom/Delete",
                    $TYPE: "post",

                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },


        }
    });

    model.init();


});