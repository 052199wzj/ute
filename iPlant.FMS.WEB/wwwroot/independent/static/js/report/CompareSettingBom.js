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
            '<tr style="background:{{ColorText}}"  zace-color="{{ColorText}}">',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  style="min-width: 50px" data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td data-title="BOMNoA" data-value="{{BOMNoA}}" >{{BOMNoA}}</td>',
            '<td data-title="BOMNoB" data-value="{{BOMNoB}}" >{{BOMNoB}}</td>',
            '<td data-title="BOMType" data-value="{{BOMType}}" >{{BOMType}}</td>',
            '<td data-title="Remark" data-value="{{Remark}}" >{{Remark}}</td>',


            '<td data-title="PlaceID" data-value="{{PlaceID}}" >{{PlaceID}}</td>',
            '<td data-title="PartPointName" data-value="{{PartPointName}}" >{{PartPointName}}</td>',

            '<td data-title="MaterialNo" data-value="{{MaterialNo}}" >{{MaterialNo}}</td>',
            '<td data-title="MaterialName" data-value="{{MaterialName}}" >{{MaterialName}}</td>',
            '<td data-title="UnitText" data-value="{{UnitText}}" >{{UnitText}}</td>',
            '<td data-title="MaterialNumber" data-value="{{MaterialNumber}}" >{{MaterialNumber}}</td>',
            '<td data-title="ReplaceType" data-value="{{ReplaceType}}" >{{ReplaceType}}</td>',
            '<td data-title="OutsourceType" data-value="{{OutsourceType}}" >{{OutsourceType}}</td>',
            '<td data-title="CompareRemark" data-value="{{CompareRemark}}" >{{CompareRemark}}</td>',
            '<td data-title="IsSame" data-value="{{IsSame}}" >{{IsSame}}</td>',

            '</tr>',
        ].join(""),

        TablePointItemMode: [
            '<tr style="background:{{ColorText}}" zace-color="{{ColorText}}">',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  style="min-width: 50px" data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td data-title="ProductQD" data-value="{{ProductQD}}" >{{ProductQD}}</td>',

            '<td data-title="PlaceID" data-value="{{PlaceID}}" >{{PlaceID}}</td>',
            '<td data-title="PartPointName" data-value="{{PartPointName}}" >{{PartPointName}}</td>',

            '<td data-title="MaterialNo" data-value="{{MaterialNo}}" >{{MaterialNo}}</td>',
            '<td data-title="MaterialName" data-value="{{MaterialName}}" >{{MaterialName}}</td>',
            '<td data-title="ReplaceType" data-value="{{ReplaceType}}" >{{ReplaceType}}</td>',

            '<td data-title="Remark" data-value="{{Remark}}" >{{Remark}}</td>',
            '<td data-title="IsSame" data-value="{{IsSame}}" >{{IsSame}}</td>',

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
                "LineID|修程|ArrayOne",
                "ProductID|车型|ArrayOne",
                "CustomerID|局段|ArrayOne",
                "LevelID|类型|ArrayOne",
                "PlaceID|工位|ArrayOne",
                "PartPointID|工序|ArrayOne",
                "ActualPeriod|工时",
                "UnitID|工ID",
                "ParentUnitID|父级",
                "OrderID|顺序",
                "ShiftDays|工位排程间隔(天)",
                "TechPeriod|工艺巡检周期(min)",
                "QTPeriod|工序巡检周期(min)",
                "WorkHour|顺序",
                "Active|启用|ArrayOne",//Status
                "Status|状态|ArrayOne",
                "LevelID|层级|ArrayOne",
                "IsSame|-|ArrayOne",
                "ReplaceType|-|ArrayOne",
                "OutsourceType|-|ArrayOne",
                "BOMType|-|ArrayOne",


            ];
            KEYWORD_BOMItem = {};
            FORMATTRT_BOMItem = {};


            TypeSource_BOMItem = {
                BOMType: [{
                    name: "新造",
                    value: 1
                }, {
                    name: "检修",
                    value: 2
                }],
                ReplaceType: [
                    {
                        name: "-",
                        value: 0
                    },
                    {
                        name: "必换",
                        value: 1
                    }, {
                        name: "偶换",
                        value: 2
                    }
                ],
                OutsourceType: [
                    {
                        name: "-",
                        value: 0
                    },
                    {
                        name: "委外必修件",
                        value: 1
                    }, {
                        name: "委外偶修件",
                        value: 2
                    }

                ],
                Active: [
                    {
                        name: "保存",
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
                IsSame: [
                    {
                        name: "相同",
                        value: 0
                    },
                    {
                        name: "修改",
                        value: 1
                    }, {
                        name: "删除",
                        value: 2
                    },
                    {
                        name: "新增",
                        value: 3
                    },
                    {
                        name: "父项相同，子项不同",
                        value: 4
                    }
                ],
                PlaceID: [],
                LevelID: [
                    //{
                    //    name: "产线级",
                    //    value: 1
                    //},
                    {
                        name: "全部",
                        value: 0
                    },
                    {
                        name: "工位",
                        value: 2
                    }, {
                        name: "工序",
                        value: 3
                    }],


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

            $("body").delegate("#zace-delete-bomItemAll", "click", function (e) {
                mAllData = 0;

                model.com.refresh();

            });

            $("body").delegate("#zace-active-bomItemPart", "click", function (e) {

                mAllData = 1;
                model.com.refresh();

            });

            $("body").delegate("#zace-delete-bomItemAllRight", "click", function (e) {
                mPartData = 0;

                model.com.refreshPoint(mID, DATAItemSearch);

            });

            $("body").delegate("#zace-active-bomItemPartRight", "click", function (e) {

                mPartData = 1;
                model.com.refreshPoint(mID, DATAItemSearch);

            });


            $("body").delegate("#zace-shaixuan-table", "click", function (e) {

                var value = $(this).prev().children("input").val();

                $com.table.filterByLikeString($("#femi-bomItem-tbody"), DATAItemSearch, value, "ID");
            });

            $("body").delegate("#zace-shaixuan-tablePoint", "click", function (e) {

                var value = $(this).prev().children("input").val();

                $com.table.filterByLikeString($("#femi-bomItemPoint-tbody"), DataPointList, value, "ID");
            });

            $("body").delegate("#zace-shaixuan-refresh", "click", function (e) {

                model.com.refresh();
            })
            // $("body").delegate("#femi-bomItem-tbody tr", "dblclick", function () {

            //     var $this = $(this);
            //     var $table = $this.closest("table");
            //     var WID = Number($this.find('td[data-title=ID]').attr('data-value'));
            //     mID = WID;

            //     model.com.refreshPoint(WID, DATAItemSearch);


            // });


            //启用 BOMItem
            $("body").delegate("#zace-active-bomItem", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-bomItem-tbody"), "ID", DATAITEMChange);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                //if (SelectData.length != 1) {
                //    alert("只能同时对一行数据修改！")
                //    return;
                //}
                // if (!confirm("已选择" + SelectData.length + "条数据，确定将其启用吗？")) {
                //     return;
                // }

                model.com.activeItem({
                    data: SelectData,
                    Active: 1
                }, function (res1) {
                    alert("启用成功");
                    model.com.refreshc();
                })
            });


            //查询
            $("body").delegate("#zace-search-bomItem", "click", function () {
                var default_value = {
                    LineID: mLineID,
                    ProductID: mProductID,
                    //CustomerID: mCustomerID,
                };

                $("body").append($com.modal.show(default_value, KEYWORD_BOMItem, "工序清单切换", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;
                    var name;
                    mLineID = Number(rst.LineID);
                    mProductID = Number(rst.ProductID);
                    //  mCustomerID = Number(rst.CustomerID);
                    mID = 0;
                    $("#zace-add-bomItemSon").show();
                    $("#zace-open-close").show();
                    $("#zace-shaixuan-bomItem").show();


                    $("#zace-add-bomItemZace").hide();
                    //zace-open-close zace-shaixuan-bomItem  
                    $('#zace-edit-bomItem').hide();

                    $('.partModeDe').show();
                    $('.partPointModeDe').hide();

                    model.com.refresh();

                }, TypeSource_BOMItem));



            });
            $("body").delegate("#areaTree li span", "click", function () {


                var $this = $(this);
                mID = Number($this.attr("data-value"));
                //alert(id);
                var _list = [];
                for (var i = 0; i < DATAAllBasic.length; i++) {
                    if (mID == DATAAllBasic[i].ID) {
                        _list.push(DATAAllBasic[i]);
                    }
                }
                if (_list[0].LevelID == 3) {
                    //alert("工序无子集!");
                    $("#areaTree li span").css("color", "black");
                    $this.css("color", "blue");
                    return false;
                } else {
                    $("#zace-add-bomItemSon").hide();
                    $("#zace-open-close").show();
                    $("#zace-shaixuan-bomItem").hide();

                    $("#zace-add-bomItemZace").hide();


                    $('#zace-edit-bomItem').show();

                    $('.partModeDe').hide();
                    $('.partPointModeDe').show();

                    model.com.refreshc();
                }

                $("#areaTree li span").css("color", "black");
                $this.css("color", "blue");
                return false;
            });

            window.setFunctionTrigger("CompareSettingBom", function (res) {


                mARouteID = res.AID;
                mBRouteID = res.BID;
                model.com.loadzace();
            });
            $("body").delegate("#zace-exportApproval-level", "click", function () {
                var $table = $(".table-partApprovalBom"),
                    fileName = "BOM对比.xls",
                    Title = "BOM对比";
                var params = $com.table.getExportParams($table, fileName, Title);

                if (params.data.length < 1) {
                    alert('请选择需要导出的数据！');
                    return false;
                }

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });



            });


           

            $("body").delegate(".femi-tb-scroll table.table  tr", "click", function (e) {
                var $this = $(this);
                if ($this.children('th')[0]) {

                    return true;
                }
                var $check = $this.children('td').children("input[type=checkbox].femi-tb-checkbox");
                if (!$check[0].checked) {
                    // $this.removeCss("background-color");
                    // $check.prop("checked", false);
                    // $check.change();
                } else {
                    $this.css("background-color", $this.attr('zace-color'));
                    // $check.prop("checked", true);
                    // $check.change();
                }


            });

            //表头的全选全不选事件
            $("body").delegate(".femi-tb-scroll table.table thead tr th input[type=checkbox].femi-tb-checkbox", "change", function (e) {

                var $this = $(this),
                    $table = $this.closest("table"),
                    $tableDiv = $table.closest(".lmvt-tb-show");

                if ($tableDiv[0]) {
                    $table = $tableDiv.prev("table.table");
                }

                if (!$this[0].checked) {
                    //$table.find("tbody tr td input[type=checkbox].femi-tb-checkbox").prop("checked", true);
                    $table.find("tbody tr").each(function (i, item) {
                    	var $tr = $(this);
                    	$tr.css('background-color', $tr.attr('zace-color'))

                    });
                } else {
                   // $table.find("tbody tr td input[type=checkbox].femi-tb-checkbox").prop("checked", false);
                  
                    $table.find("tbody tr").each(function (i, item) {
                    	var $tr = $(this);
                    	$tr.css('background-color', $tr.attr('zace-color'))

                    });
                }

            });

        },

        run: function () {
            mID = 1;
            mAllData = 0;

            mPartData = 0;
            // $com.app.loading("加载中...");

            mARouteID = model.query.aid;
            mBRouteID = model.query.bid;
            model.com.loadzace();


        },

        com: {
            loadzace: function () {
                model.com.getFPCPart({ FactoryID: 0, BusinessUnitID: 0 }, function (resP) {
                    $.each(resP.list, function (i, item) {
                        TypeSource_BOMItem.PlaceID.push({
                            name: item.Code,
                            value: item.ID,
                        })
                    });
                    model.com.refresh();

                });
            },
            refreshPoint: function (id, list) {

                var ItemList = [];
                var allList = [];
                $.each(list, function (k, item_k) {

                    if (id == item_k.ID) {
                        ItemList = $com.util.Clone(item_k.ItemList);
                        allList = $com.util.Clone(item_k.ItemList);
                    }

                });

                if (mPartData > 0) {
                    ItemList = [];
                    $.each(allList, function (k, item_k) {
                        if (item_k.IsSame > 0) {
                            ItemList.push(item_k);
                        }


                    });
                }

                $.each(ItemList, function (i, item) {
                    item.ColorText = '';
                    item.WID = i + 1;
                    if (item.IsSame == 1 || item.IsSame == 2 || item.IsSame == 3 || item.IsSame == 4) {
                        item.ColorText = ColorList[item.WID % 3];
                    }

                    for (var p in item) {
                        if (!FORMATTRT_BOMItem[p])
                            continue;
                        item[p] = FORMATTRT_BOMItem[p](item[p]);
                    }





                });


                DataPointList = $com.util.Clone(ItemList);


                $("#femi-bomItemPoint-tbody").html($com.util.template(ItemList, HTML.TablePointItemMode));


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
                model.com.getCompareAll({ ABOMID: mARouteID, BBOMID: mBRouteID }, function (resBomItem) {

                    // var name = '(' + FORMATTRT_BOMItem["LineID"](mLineID) + "-" + FORMATTRT_BOMItem["ProductID"](mProductID) + ")工序明细清单";
                    // var nameLeft = FORMATTRT_BOMItem["LineID"](mLineID) + "-" + FORMATTRT_BOMItem["ProductID"](mProductID);

                    // $("#zace-spanTextChange").html(name);
                    // $(".zaceLineTitle").html(nameLeft);

                    if (resBomItem && resBomItem.list) {

                        var ZaceList = $com.util.Clone(resBomItem.list);

                        var ItemList = $com.util.Clone(resBomItem.list);


                        if (mAllData > 0) {
                            ItemList = [];
                            $.each(ZaceList, function (k, item_k) {
                                if (item_k.IsSame > 0) {
                                    ItemList.push(item_k);
                                }


                            });
                        }
                        DATAITEM = $com.util.Clone(resBomItem.list);

                        DATAITEMChange = $com.util.Clone(ItemList);
                        $.each(ItemList, function (i, item) {
                            item.WID = i + 1;
                            item.ColorText = '';

                            if (item.IsSame == 1 || item.IsSame == 2 || item.IsSame == 3 || item.IsSame == 4) {
                                item.ColorText = ColorList[item.WID % 3];//颜色枚举数
                            }

                            for (var p in item) {
                                if (!FORMATTRT_BOMItem[p])
                                    continue;
                                item[p] = FORMATTRT_BOMItem[p](item[p]);
                            }





                        });
                        DATAItemSearch = $com.util.Clone(ItemList);
                        if (DATAItemSearch.length > 0) {
                            mID = DATAItemSearch[0].ID;
                        }

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


            //查询工艺对比数据
            getCompareAll: function (data, fn, context) {
                var d = {
                    $URI: "/MSSBom/Compare",
                    $TYPE: "get",
                    $SERVER: "/MESQMS"
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