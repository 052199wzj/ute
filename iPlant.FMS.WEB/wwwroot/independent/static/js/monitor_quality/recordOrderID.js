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
    DATAITEMChange = [];
    DATAItemSearch = [];
    DATASearch = [];
    MaterialList = [];
    DataLineList = [];
    DATAITEM = [];
    DATAAllBasic = [];
    DATAChange = [];
    DATA = [];


    HTML = {
        TableBOMItemMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  style="min-width: 50px;display:none" data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td data-title="LineID" data-value="{{LineID}}" >{{LineID}}</td>',
            '<td data-title="ProductID" data-value="{{ProductID}}" >{{ProductID}}</td>',
            // '<td data-title="CustomerID" data-value="{{CustomerID}}" >{{CustomerID}}</td>',
            '<td data-title="LevelID" data-value="{{LevelID}}" >{{LevelID}}</td>',
            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
            '<td data-title="UnitCode" data-value="{{UnitCode}}" >{{UnitCode}}</td>',
            //'<td data-title="UnitID" data-value="{{UnitID}}" >{{UnitID}}</td>',
            //'<td data-title="ParentUnitID" data-value="{{ParentUnitID}}" >{{ParentUnitID}}</td>',
            //'<td data-title="OrderID" data-value="{{OrderID}}" >{{OrderID}}</td>',

            '<td class="partModeDe" data-title="StandardPeriod" data-value="{{StandardPeriod}}" >{{StandardPeriod}}</td>',
            '<td class="partModeDe" data-title="ActualPeriod" data-value="{{ActualPeriod}}" >{{ActualPeriod}}</td>',


            '<td class="partPointModeDe"  style="display: none;" data-title="StandardPeriod" data-value="{{StandardPeriod}}" >{{StandardPeriod}}</td>',
            '<td class="partPointModeDe"   style="display: none;" data-title="ActualPeriod" data-value="{{ActualPeriod}}" >{{ActualPeriod}}</td>',
            '<td class="partPointModeDe"   style="display: none;" data-title="DefaultOrder" data-value="{{DefaultOrder}}" >{{DefaultOrder}}</td>',


            //'<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',
            '<td data-title="Creator" data-value="{{Creator}}" >{{Creator}}</td>',
            '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
            //   '<td data-title="Editor" data-value="{{Editor}}" >{{Editor}}</td>',
            //   '<td data-title="EditTime" data-value="{{EditTime}}" >{{EditTime}}</td>',
            '<td data-title="Active" data-value="{{Active}}" >{{Active}}</td>',
            // '<td data-title="Auditor" data-value="{{Auditor}}" >{{Auditor}}</td>',
            //'<td data-title="AuditTime" data-value="{{AuditTime}}" >{{AuditTime}}</td>',
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
                "PartID|工位|ArrayOne",
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

            ];
            KEYWORD_BOMItem = {};
            FORMATTRT_BOMItem = {};


            TypeSource_BOMItem = {
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
                ProductID: [],
                CustomerID: [{
                    name: "无",
                    value: 0
                }],
                LineID: [],
                PartID: [],
                PartPointID: [],
                StationID: [],
                //ParentUnitID: [],
                Status: [
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
                    },
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
        name: '修程配置',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {

            $("body").delegate("#zace-shaixuan-table", "click", function (e) {

                var value = $(this).prev().children("input").val();

                $com.table.filterByLikeString($("#femi-bomItem-tbody"), DATAITEMChange, value, "ID");
            })



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


                    model.com.refreshc();
                }

                $("#areaTree li span").css("color", "black");
                $this.css("color", "blue");
                return false;
            });
            $("body").delegate("#zace-tree-part", "click", function () {


                mID = 0;
                model.com.refresh();
            });

        },

        run: function () {



            model.com.refresh();





        },

        com: {

            refresh: function () {

                $com.app.loading("加载中...");

                model.com.getOrderList({ OrderID: 45 }, function (resOrder) {
                    //bom_id:{int} 
                    // var name = FORMATTRT_BOMItem["LineID"](mLineID) + "修" + FORMATTRT_BOMItem["ProductID"](mProductID) + "车型清单";

                    // $("#zace-spanTextChange").html(name);

                    if (resOrder.info && resOrder.info.IPTOrderReportPartList) {

                        var ZaceList = $com.util.Clone(resOrder.info.IPTOrderReportPartList);
                        var ItemList = [];



                        ItemList = $com.util.Clone(resOrder.info.IPTOrderReportPartList);
                        DATAITEM = $com.util.Clone(resOrder.info.IPTOrderReportPartList);


                        var _list = [];
                        _list = model.com.changeTree(resOrder.info.IPTOrderReportPartList);
                        //model.com.renderTree(ItemList);

                        DATAITEMChange = $com.util.Clone(ItemList);
                        $.each(ItemList, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_BOMItem[p])
                                    continue;
                                item[p] = FORMATTRT_BOMItem[p](item[p]);
                            }
                            item.WID = i + 1;
                        });
                        DATAItemSearch = $com.util.Clone(ItemList);

                        $("#femi-bomItem-tbody").html($com.util.template(ItemList, HTML.TableBOMItemMode));


                        $com.app.loaded();
                    }
                });

            },
            changeTree: function (list) {
                var _list = [];
                $.each(list, function (i, item) {


                    
                   


                });



                return _list;

            },
            refreshc: function () {
                model.com.getItemList({ LineID: mLineID, ProductID: mProductID, CustomerID: mCustomerID, ID: 0 }, function (resOrder) {
                    //bom_id:{int} 
                    // var name = FORMATTRT_BOMItem["LineID"](mLineID)
                    var name = FORMATTRT_BOMItem["LineID"](mLineID) + "修" + FORMATTRT_BOMItem["ProductID"](mProductID) + "车型清单";
                    $("#zace-spanTextChange").html(name);

                    if (resOrder && resOrder.list) {

                        var ItemList = $com.util.Clone(resOrder.list);

                        DATAITEM = $com.util.Clone(resOrder.list);

                        DATAITEMChange = $com.util.Clone(ItemList);
                        $.each(ItemList, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_BOMItem[p])
                                    continue;
                                item[p] = FORMATTRT_BOMItem[p](item[p]);
                            }
                            item.WID = i + 1;
                        });
                        DATAItemSearch = $com.util.Clone(ItemList);
                        //model.com.renderTree(ItemList);
                        $("#femi-bomItem-tbody").html($com.util.template(ItemList, HTML.TableBOMItemMode));
                        //$page.getPage(ItemList, "#femi-bomItem-tbody", HTML.TableBOMItemMode, ".table-part");
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


                });
            },
            //获取数据
            getOrderList: function (data, fn, context) {
                var d = {
                    $URI: "/IPTOrderReport/OrderInfo",
                    $TYPE: "get",
                    $SERVER: '/MESQMS',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },


            //获取检验项
            getCheckItems: function (data, fn, context) {
                var d = {
                    $URI: "/IPTOrderReport/IPTList",
                    $TYPE: "get",
                    $SERVER: '/MESQMS',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //Update 新增
            postItem: function (data, fn, context) {
                var d = {
                    $URI: "/FMCLineUnit/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
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
            //得到ID
            GetMaxIDPro: function (_source) {
                var id = 0;
                if (!_source)
                    _source = [];
                $.each(_source, function (i, item) {
                    if (item.LevelID == 2 && item.OrderID > id)
                        id = item.OrderID;
                });
                return id + 1;

            },
        }
    });

    model.init();


});