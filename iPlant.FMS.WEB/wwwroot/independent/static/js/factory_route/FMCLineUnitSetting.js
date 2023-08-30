require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/bootstrap-treeview.min', '../static/utils/js/base/paging'], function ($zace, $com, $tree, $page) {

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

        ItemNode,

        temp = false,

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

    BOMItemTemp = {
        Active: 1,
        Auditor: '',
        AuditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        AuditorID: 0,
        Code: "",
        Creator: '',
        CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        CreatorID: 0,
        Editor: '',
        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        EditorID: 0,
        ID: 0,
        LevelID: 0,
        LevelName: "",
        LineID: 0,
        Name: "",
        OrderID: 0,
        ParentUnitID: 0,
        Status: 1,
        StatusText: "",
        UnitID: 0,
        UnitList: [],
        ShiftDays: 0,
        TechPeriod: 0,
        QTPeriod: 0,
        WorkHour: 0,
    };
    HTML = {
        TableBOMItemMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  style="min-width: 50px;display:none" data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td data-title="LineID" data-value="{{LineID}}" >{{LineID}}</td>',
            // '<td data-title="ProductID" data-value="{{ProductID}}" >{{ProductID}}</td>',
            // '<td data-title="CustomerID" data-value="{{CustomerID}}" >{{CustomerID}}</td>',
            '<td data-title="LevelID" data-value="{{LevelID}}" >{{LevelID}}</td>',
            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
            '<td data-title="UnitCode" data-value="{{UnitCode}}" >{{UnitCode}}</td>',
            //'<td data-title="UnitID" data-value="{{UnitID}}" >{{UnitID}}</td>',
            //'<td data-title="ParentUnitID" data-value="{{ParentUnitID}}" >{{ParentUnitID}}</td>',
            //'<td data-title="OrderID" data-value="{{OrderID}}" >{{OrderID}}</td>',

            // '<td class="partModeDe" data-title="StandardPeriod" data-value="{{StandardPeriod}}" >{{StandardPeriod}}</td>',
            // '<td class="partModeDe" data-title="ActualPeriod" data-value="{{ActualPeriod}}" >{{ActualPeriod}}</td>',


            // '<td class="partPointModeDe"  style="display: none;" data-title="StandardPeriod" data-value="{{StandardPeriod}}" >{{StandardPeriod}}</td>',
            // '<td class="partPointModeDe"   style="display: none;" data-title="ActualPeriod" data-value="{{ActualPeriod}}" >{{ActualPeriod}}</td>',
            // '<td class="partPointModeDe"   style="display: none;" data-title="DefaultOrder" data-value="{{DefaultOrder}}" >{{DefaultOrder}}</td>',


            //'<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',
            '<td data-title="Creator" data-value="{{Creator}}" >{{Creator}}</td>',
            '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
            //   '<td data-title="Editor" data-value="{{Editor}}" >{{Editor}}</td>',
            //   '<td data-title="EditTime" data-value="{{EditTime}}" >{{EditTime}}</td>',
            '<td data-title="Active" data-value="{{Active}}" > <span class="badge lmvt-badge {{ClassBadge}}">{{Badge}}</span>{{Active}}</td>',
            // '<td data-title="Auditor" data-value="{{Auditor}}" >{{Auditor}}</td>',
            //'<td data-title="AuditTime" data-value="{{AuditTime}}" >{{AuditTime}}</td>',

            '<td style="max-width: 80px" data-title="Handle" data-value="{{ID}}" data-LevelID="{{LevelID}}"><div class="row">',

            '<div class="col-md-4 {{ISAllowedInfo}}">详情</div>',
            '<div class="col-md-4 {{ISAllowed}}">{{ISAllowedText}}</div>',
            '<div class="col-md-4 lmvt-allowed-delete">删除</div>',

            '</td>',

            '</tr>',
        ].join(""),

        // TreeItemNode: [
        //     '<li data-titie="{{ID}}"  data-value="{{ID}}" >',
        //     '<span style="vertical-align:top;" data-value="{{ID}}"}" >{{Name}}</span> ',
        //     '{{Items}}',     
        //     '</li>',
        // ].join(""),

        TreeItemNode: [
            '<li data-titie="{{ID}}"  data-value="{{ID}}" >',
            '<span style="vertical-align:top;" data-value="{{ID}}"}" >{{Name}}</span> ',
            '{{Items}}',
            '</li>',
        ].join(""),

    },
        // Item
        (function () {
            KEYWORD_BOMItem_LIST = [
                "StationID|工位|ArrayOne",
                "CreateTime|时间|DateTime",
                "EditTime|时间|DateTime",
                "LineID|产线|ArrayOne",
                "ProductID|型号|ArrayOne",
                "CustomerID|客户|ArrayOne",
                "LevelID|类型|ArrayOne",
                "PartID|工序|ArrayOne",
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
                        name: "工序",
                        value: 2
                    }, {
                        name: "工步",
                        value: 3
                    }, {
                        name: "工位",
                        value: 4
                    }
                ],
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

            // $.each(window.parent._Station, function (i, item) {
            //     TypeSource_BOMItem.StationID.push({
            //         name: item.Name,
            //         value: item.ID
            //     });
            // });

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
        name: '产线单元配置',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {

            $("body").delegate("#zace-import-bom", "click", function () {

                $("#input-file").val("");
                $("#input-file").click();

            });
            $("body").delegate("#input-file", "change", function () {
                //alert()
                var $this = $(this);

                if (this.files.length == 0)
                    return;

                if (!extLimit(['xlsx', 'xls']).has(this.files[0].name)) {
                    alert("请上传正确的文件！");
                    clearFiles();
                    return;
                }

                var fileData = this.files[0];

                var form = new FormData();
                form.append("file", fileData);


                // PartID: lSelectID
                $com.app.loading('数据导入中...');
                model.com.postImportExcelBom(form, [function (res) {
                    alert("导入成功！！");
                    $com.app.loaded();
                    mID = 0;
                    model.com.refresh();
                }, function (res2) {
                    $com.app.loaded();
                    mID = 0;
                    model.com.refresh();
                }]);
            });
            function extLimit(exts) {
                return {
                    has: function (file) {
                        var arr = file.split("."),
                            ext = arr[arr.length - 1].toLowerCase();

                        return exts.indexOf(ext) > -1 ? true : false;
                    }
                };
            }


            $("body").delegate("#zace-shaixuan-table", "click", function (e) {

                var value = $(this).prev().children("input").val();

                $com.table.filterByLikeString($("#femi-bomItem-tbody"), DATAITEMChange, value, "ID");
            })

            //新增 Item
            $("body").delegate("#zace-add-bomItem", "click", function () {
                var wlevelId = 0;
                var _list = [];
                for (var i = 0; i < DATAAllBasic.length; i++) {
                    if (mID == DATAAllBasic[i].ID) {
                        _list.push(DATAAllBasic[i]);
                    }
                }

                if (mID == 0) {
                    DEFAULT_VALUE_BOMItem = {
                        PartID: 0,
                        //ShiftDays: 0,
                        //TechPeriod: 0,
                        // OrderID: 0
                    };
                    $("body").append($com.modal.show(DEFAULT_VALUE_BOMItem, KEYWORD_BOMItem, "新增", function (rst) {
                        if (!rst || $.isEmptyObject(rst))
                            return;

                        var _temp = $com.util.Clone(BOMItemTemp);
                        _temp.LineID = mLineID;
                        _temp.ProductID = mProductID;
                        _temp.CustomerID = mCustomerID;
                        _temp.UnitID = Number(rst.PartID);
                        //_temp.ShiftDays = Number(rst.ShiftDays);
                        //_temp.TechPeriod = Number(rst.TechPeriod);
                        _temp.ParentUnitID = mLineID;
                        _temp.LevelID = 2;
                        _temp.OrderID = model.com.GetMaxIDPro(DATAITEMChange);

                        model.com.postItem({
                            data: _temp
                        }, function (res) {
                            alert("新增成功");
                            model.com.refreshc();

                            model.com.RanderTree();
                        })

                    }, TypeSource_BOMItem));
                } else if (_list[0].LevelID == 2) {

                    DEFAULT_VALUE_BOMItemPP = {
                        PartPointID: 0,
                        //ActualPeriod:0.0
                        //QTPeriod: 0,
                        //OrderID: 0,
                    };

                    //筛选工序
                    // TypeSource_BOMItem.PartPointID = [];
                    // $.each(mPartPiont, function (i, item) {

                    //     if (item.StepType == _list[0].Type && item.Active == 1) {
                    //         TypeSource_BOMItem.PartPointID.push({
                    //             name: item.Name,
                    //             value: item.ID,
                    //             far: null
                    //         })
                    //     }

                    // });


                    $("body").append($com.modal.show(DEFAULT_VALUE_BOMItemPP, KEYWORD_BOMItem, "新增", function (rst) {
                        if (!rst || $.isEmptyObject(rst))
                            return;


                        var _temp = $com.util.Clone(BOMItemTemp);
                        _temp.LineID = mLineID;
                        _temp.ProductID = mProductID;
                        _temp.CustomerID = mCustomerID;
                        _temp.UnitID = Number(rst.PartPointID);
                        // _temp.ActualPeriod = Number(rst.ActualPeriod);
                        //_temp.QTPeriod = Number(rst.QTPeriod);
                        _temp.ParentUnitID = _list[0].UnitID;
                        _temp.LevelID = 3;
                        // _temp.OrderID = Number(rst.OrderID);
                        _temp.OrderID = model.com.GetMaxID(DATAITEMChange);

                        model.com.postItem({
                            data: _temp
                        }, function (res) {
                            alert("新增成功");
                            model.com.refreshc();
                            model.com.RanderTree();
                        })

                    }, TypeSource_BOMItem));
                }
                else if (_list[0].LevelID == 3) {
                    DEFAULT_VALUE_BOMItemPS = {
                        StationID: 0,
                        // OrderID: 0,
                    };
                    $("body").append($com.modal.show(DEFAULT_VALUE_BOMItemPS, KEYWORD_BOMItem, "新增", function (rst) {
                        if (!rst || $.isEmptyObject(rst))
                            return;

                        var _temp = $com.util.Clone(BOMItemTemp);
                        _temp.LineID = mLineID;
                        _temp.UnitID = Number(rst.StationID);
                        _temp.ParentUnitID = _list[0].UnitID;
                        _temp.ProductID = mProductID;
                        _temp.LevelID = 4;
                        //_temp.OrderID = Number(rst.OrderID);
                        _temp.OrderID = model.com.GetMaxID(DATAITEMChange);

                        model.com.postItem({
                            data: _temp
                        }, function (res) {
                            alert("新增成功");
                            model.com.refreshc();
                            model.com.RanderTree();
                        })

                    }, TypeSource_BOMItem));

                }
                else {

                    alert("工位下无添加项!")
                    //return false;
                }

            });
            //修改 Item
            $("body").delegate("#zace-edit-bomItem", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-bomItem-tbody"), "ID", DATAITEMChange);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                $com.util.deleteLowerProperty(SelectData[0]);
                if (SelectData[0].LevelID == 2) {
                    alert("无可修改内容");
                    return false;
                    // var default_value = {
                    //     ShiftDays: SelectData[0].ShiftDays,
                    //     //TechPeriod: SelectData[0].TechPeriod,
                    // };
                    // $("body").append($com.modal.show(default_value, KEYWORD_BOMItem, "修改", function (rst) {
                    //     //调用修改函数
                    //     if (!rst || $.isEmptyObject(rst))
                    //         return;
                    //     SelectData[0].ShiftDays = Number(rst.ShiftDays);
                    //     // SelectData[0].TechPeriod = Number(rst.TechPeriod);
                    //     model.com.postItem({
                    //         data: SelectData[0]
                    //     }, function (res) {
                    //         alert("修改成功");
                    //         model.com.refreshc();
                    //     })

                    // }, TypeSource_BOMItem));
                } else if (SelectData[0].LevelID == 3) {

                    var default_value = {
                        //  ActualPeriod: SelectData[0].ActualPeriod,
                        // Status: SelectData[0].Status,
                    };
                    $("body").append($com.modal.show(default_value, KEYWORD_BOMItem, "修改工时", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        // SelectData[0].ActualPeriod = Number(rst.ActualPeriod);
                        // SelectData[0].Status = Number(rst.Status);
                        model.com.postItem({
                            data: SelectData[0]
                        }, function (res) {
                            alert("修改成功");
                            model.com.refreshc();
                        })

                    }, TypeSource_BOMItem));
                } else {
                    alert("无可修改内容");
                    return false;
                }
            });

            //新增子项 BOMItem  Son
            $("body").delegate("#zace-add-bomItemSon", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-bomItem-tbody"), "ID", DATAITEMChange);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能选择一行增加！")
                    return;
                }
                if (SelectData[0].LevelID == 2) {

                    DEFAULT_VALUE_BOMItemPP = {
                        PartPointID: 0,
                        //OrderID: 0,
                    };
                    $("body").append($com.modal.show(DEFAULT_VALUE_BOMItemPP, KEYWORD_BOMItem, "新增", function (rst) {
                        if (!rst || $.isEmptyObject(rst))
                            return;


                        var _temp = $com.util.Clone(BOMItemTemp);
                        _temp.LineID = mLineID;
                        _temp.ProductID = mProductID;
                        _temp.CustomerID = mCustomerID;
                        _temp.UnitID = Number(rst.PartPointID);
                        _temp.ParentUnitID = SelectData[0].UnitID;
                        _temp.LevelID = 3;
                        // _temp.OrderID = Number(rst.OrderID);

                        model.com.postItem({
                            data: _temp
                        }, function (res) {
                            alert("新增子项成功");
                            model.com.refreshc();
                        })

                    }, TypeSource_BOMItem));
                }
                else if (SelectData[0].LevelID == 3) {
                    DEFAULT_VALUE_BOMItemPS = {
                        StationID: 0,
                        // OrderID: 0,
                    };
                    $("body").append($com.modal.show(DEFAULT_VALUE_BOMItemPS, KEYWORD_BOMItem, "新增", function (rst) {
                        if (!rst || $.isEmptyObject(rst))
                            return;

                        var _temp = $com.util.Clone(BOMItemTemp);
                        _temp.LineID = mLineID;
                        _temp.UnitID = Number(rst.StationID);
                        _temp.ParentUnitID = SelectData[0].UnitID;
                        _temp.LevelID = 4;
                        //_temp.OrderID = Number(rst.OrderID);


                        model.com.postItem({
                            data: _temp
                        }, function (res) {
                            alert("新增子项成功");
                            model.com.refreshc();
                        })

                    }, TypeSource_BOMItem));

                }
                else {
                    //return false;
                    alert("工位下无添加项!")
                }

            });
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

            //启用 单条active
            $("body").delegate(".lmvt-do-active", "click", function () {
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DATAITEMChange.filter((item) => { return item.ID == wID });
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

            //禁用 单条
            $("body").delegate(".lmvt-do-forbidden", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DATAITEMChange.filter((item) => { return item.ID == wID });

                //if (SelectData.length != 1) {
                //    alert("只能同时对一行数据操作！")
                //    return;
                //}
                // if (!confirm("已选择" + SelectData.length + "条数据，确定将其禁用吗？")) {
                //     return;
                // }
                model.com.activeItem({
                    data: SelectData,
                    Active: 0
                }, function (res1) {
                    alert("禁用成功");
                    model.com.refreshc();
                })
            });

            //禁用 BOMItem
            $("body").delegate("#zace-disable-bomItem", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-bomItem-tbody"), "ID", DATAITEMChange);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                //if (SelectData.length != 1) {
                //    alert("只能同时对一行数据操作！")
                //    return;
                //}
                // if (!confirm("已选择" + SelectData.length + "条数据，确定将其禁用吗？")) {
                //     return;
                // }
                model.com.activeItem({
                    data: SelectData,
                    Active: 0
                }, function (res1) {
                    alert("禁用成功");
                    model.com.refreshc();
                })
            });

            //查询
            $("body").delegate("#zace-search-bomItem", "click", function () {

                model.com.refresh();

                // var default_value = {
                //     LineID: mLineID,
                //     //ProductID: mProductID,
                //     //CustomerID: mCustomerID,
                // };

                // $("body").append($com.modal.show(default_value, KEYWORD_BOMItem, "工序清单切换", function (rst) {


                //     if (!rst || $.isEmptyObject(rst))
                //         return;
                //     var name;
                //     mLineID = Number(rst.LineID);
                //     //mProductID = Number(rst.ProductID);
                //     //  mCustomerID = Number(rst.CustomerID);
                //     mID = 0;
                //     $("#zace-add-bomItemSon").show();
                //     $("#zace-open-close").show();
                //     $("#zace-shaixuan-bomItem").show();


                //     $("#zace-add-bomItemZace").hide();
                //     //zace-open-close zace-shaixuan-bomItem  
                //     $('#zace-edit-bomItem').hide();

                //     $('.partModeDe').show();
                //     $('.partPointModeDe').hide();

                //     model.com.refresh();

                // }, TypeSource_BOMItem));



            });

            $("body").delegate("#lmvt-sreach", "click", function () {

                var default_value = {
                    //LineID: mLineID,
                    ProductID: mProductID,
                    //CustomerID: mCustomerID,
                };

                $("body").append($com.modal.show(default_value, KEYWORD_BOMItem, "工序清单切换", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;
                    var name;
                    //mLineID = Number(rst.LineID);
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


            //////审核 
            //$("body").delegate("#zace-delete-bomItem", "click", function () {


            //    model.com.auditItem({                    
            //        LineID: mLineID
            //    }, function (res1) {
            //        alert("审核成功");
            //        model.com.refresh();
            //    })
            //});

            //删除单条
            $("body").delegate(".lmvt-allowed-delete", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DATAITEMChange.filter((item) => { return item.ID == wID });

                if (!confirm("已选择 [" + SelectData[0].Name + "] 的数据，确定将其删除？")) {
                    return false;
                }

                var a = 0;

                $com.app.loading();
                $com.util.deleteLowerProperty(SelectData);
                var WhileAdd = function () {

                    model.com.deleteItem({
                        data: SelectData[a],
                    }, function (res) {
                        a++;

                        if (a == SelectData.length) {
                            $com.app.loaded();

                            alert("删除成功");
                            model.com.refreshc();
                            model.com.RanderTree();
                        } else {
                            WhileAdd();
                        }
                    });

                }
                if (SelectData.length <= 0) {
                    alert("删除数据为空！！！");
                } else {
                    WhileAdd();
                }

            });

            // 删除 
            $("body").delegate("#zace-delete-bomItem", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-bomItem-tbody"), "ID", DATAITEMChange);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {
                    return false;
                }
                //for (var i = 0; i < SelectData.length; i++) {
                //    if (SelectData[i].Status != 1) {
                //        alert("状态不对");
                //        return false;
                //    }
                //}
                var a = 0;

                $com.app.loading();

                var WhileAdd = function () {

                    model.com.deleteItem({
                        data: SelectData[a],
                    }, function (res) {
                        a++;

                        if (a == SelectData.length) {
                            $com.app.loaded();

                            alert("删除成功");
                            model.com.refreshc();
                        } else {
                            WhileAdd();
                        }
                    });

                }
                if (SelectData.length <= 0) {
                    alert("删除数据为空！！！");
                } else {
                    WhileAdd();
                }


                //model.com.deleteItem({
                //    data: SelectData[0],
                //}, function (res1) {
                //    alert("删除成功");
                //    model.com.refreshc();
                //})



            });

            $("body").delegate("#zace-add-bomItemZace", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-bomItem-tbody"), "ID", DATAITEMChange);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {
                    return false;
                }
                //for (var i = 0; i < SelectData.length; i++) {
                //    if (SelectData[i].Status != 1) {
                //        alert("状态不对");
                //        return false;
                //    }
                //}
                var a = 0;

                $com.app.loading();

                var WhileAdd = function () {

                    model.com.deleteItem({
                        data: SelectData[a],
                    }, function (res) {
                        a++;

                        if (a == SelectData.length) {
                            $com.app.loaded();

                            alert("删除成功");
                            model.com.refreshc();
                        } else {
                            WhileAdd();
                        }
                    });

                }
                if (SelectData.length <= 0) {
                    alert("删除数据为空！！！");
                } else {
                    WhileAdd();
                }

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
                if (_list[0] && _list[0].LevelID == 4) {
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
            //查看详情
            $("body").delegate(".lmvt-do-info", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value")),
                    wLevelID = Number($this.closest("td").attr("data-LevelID"));

                var SelectData = DATAITEMChange.filter((item) => { return item.ID == wID });

                mID = wID;
                model.com.refreshc();
            });

            $("body").delegate("#zace-tree-part", "click", function () {
                $("#zace-add-bomItemSon").show();
                $("#zace-open-close").show();
                $("#zace-shaixuan-bomItem").show();

                $("#zace-add-bomItemZace").hide();
                //zace-open-close zace-shaixuan-bomItem


                $('#zace-edit-bomItem').hide();

                $('.partModeDe').show();
                $('.partPointModeDe').hide();

                mID = 0;
                model.com.refreshc();
            });
            $("body").delegate("#zace-shaixuan-bomItem", "click", function () {

                var default_value = {
                    LevelID: 0,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_BOMItem, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.LevelID = Number(rst.LevelID);
                    if (default_value.LevelID == 0) {
                        $("#zace-tree-part").click();
                    } else {
                        $com.table.filterByConndition($("#femi-bomItem-tbody"), DATAITEM, default_value, "ID");
                    }


                }, TypeSource_BOMItem));
            });

            window.setFunctionTrigger("FMCLineUnitSetting", function (res) {
                mLineID = res.LineID;
                model.com.refresh();
            });

        },

        run: function () {

            $com.app.loading("加载中...");

            mLineID = Number(model.query.LineID);

            //修程
            model.com.getFMCLine({ FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0 }, function (resW) {
                if (resW && resW.list) {
                    DataLineList = resW.list;
                    $.each(resW.list, function (i, item) {
                        // if (mLineID <= 0 && item.Active == 1) {
                        //     mLineID = item.ID;
                        // }
                        TypeSource_BOMItem.LineID.push({
                            name: item.Name,
                            value: item.ID,
                            far: item.Active
                        });
                    });
                }
                //工位
                model.com.getFPCPart({ FactoryID: 0, BusinessUnitID: 0 }, function (resP) {
                    $.each(resP.list, function (i, item) {
                        TypeSource_BOMItem.PartID.push({
                            name: item.Name + "(" + item.Code + ")",
                            value: item.ID,
                            far: null
                        })
                    });
                    //工序
                    model.com.getFPCPartPoint({ FactoryID: 0, BusinessUnitID: 0, ProductTypeID: 0 }, function (resP) {

                        mPartPiont = resP.list;
                        $.each(resP.list, function (i, item) {
                            TypeSource_BOMItem.PartPointID.push({
                                name: item.Name + "(" + item.Code + ")",
                                value: item.ID,
                                far: null
                            })
                        });
                        model.com.getCRMCustomer({}, function (resP) {
                            $.each(resP.list, function (i, item) {

                                // if (mCustomerID <= 0 && item.Active == 1) {
                                //     mCustomerID = item.ID;
                                // }

                                TypeSource_BOMItem.CustomerID.push({
                                    name: item.CustomerName,
                                    value: item.ID,
                                    far: item.Active
                                })

                            });

                            //工位
                            model.com.getFMCStation({}, function (resP) {

                                $.each(resP.list, function (i, item) {
                                    TypeSource_BOMItem.StationID.push({
                                        name: item.Name,
                                        value: item.ID
                                    });
                                });

                            });

                            // TransportType: 1 
                            model.com.getFPCProduct({}, function (resP) {

                                $.each(resP.list, function (i, item) {
                                    // if (mProductID <= 0 && item.Active == 1) {
                                    //     mProductID = item.ID;
                                    // }
                                    TypeSource_BOMItem.ProductID.push({
                                        name: item.ProductNo,
                                        value: item.ID,
                                        far: item.Active
                                    })
                                });
                                // mProductID = resP.list[0].ID
                                model.com.refresh();
                                $com.app.loaded();
                            });

                        });

                    });
                });

            });
        },

        com: {
            postImportExcelBom: function (data, fn, context) {
                var d = {
                    $URI: "/IPTStandard/ImportPartPoint",
                    $TYPE: "post",
                    $SERVER: '/MESQMS',

                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax_load(data ? $.extend(data, d) : $.extend(d, data), fn, err, context);
            },
            refresh: function () {
                if (mLineID <= 0) {
                    alert("无产线数据，请先确认");
                    return;
                }
                // if (mProductID <= 0) {
                //     alert("无车型数据,请先设置车型");
                //     return;
                // }
                model.com.getItemList({ LineID: mLineID, ProductID: mProductID, CustomerID: mCustomerID, ID: 0 }, function (resBomItem) {
                    //bom_id:{int} 
                    var name = '(' + FORMATTRT_BOMItem["LineID"](mLineID) + ")工序明细清单";
                    var nameLeft = FORMATTRT_BOMItem["LineID"](mLineID) + FORMATTRT_BOMItem["ProductID"](mProductID);

                    $("#zace-spanTextChange").html(name);
                    $(".zaceLineTitle").html(nameLeft);

                    if (resBomItem && resBomItem.list) {

                        var ZaceList = $com.util.Clone(resBomItem.list);
                        var ItemList = [];


                        //筛选工位级数据
                        for (var m = 0; m < ZaceList.length; m++) {
                            if (ZaceList[m].LevelID == 2) {
                                ItemList.push(ZaceList[m]);
                            }

                        }

                        DATAITEM = $com.util.Clone(resBomItem.list);

                        DATAITEMChange = $com.util.Clone(ItemList);
                        $.each(ItemList, function (i, item) {


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
                            if (item.LevelID < 4) {
                                item.ISAllowedInfo = "lmvt-do-info";
                            } else {
                                item.ISAllowedInfo = "lmvt-not-allowed-delete";
                            }

                            for (var p in item) {
                                if (!FORMATTRT_BOMItem[p])
                                    continue;
                                item[p] = FORMATTRT_BOMItem[p](item[p]);
                            }
                            item.WID = i + 1;
                        });
                        DATAItemSearch = $com.util.Clone(ItemList);
                        ////model.com.renderTree(ItemList);
                        $("#femi-bomItem-tbody").html($com.util.template(ItemList, HTML.TableBOMItemMode));

                        $('.partModeDe').show();
                        $('.partPointModeDe').hide();
                        //$page.getPage(ItemList, "#femi-bomItem-tbody", HTML.TableBOMItemMode, ".table-part");
                    }
                });
                model.com.getItemTree({ LineID: mLineID, ProductID: mProductID, ID: 0 }, function (resBomItem1) {
                    //bom_id:{int} 
                    if (resBomItem1 && resBomItem1.list) {
                        DATATree = $com.util.Clone(resBomItem1.list);
                        var ItemList = $com.util.Clone(resBomItem1.list);
                        model.com.renderTree(ItemList);
                    }
                });
                //所有数据 
                model.com.getItemList({ LineID: mLineID, ProductID: mProductID, CustomerID: mCustomerID, ID: 0 }, function (resBomItem) {
                    //bom_id:{int} 
                    if (resBomItem && resBomItem.list) {
                        DATAAllBasic = $com.util.Clone(resBomItem.list);
                    }

                });
            },
            RanderTree: function () {
                model.com.getItemTree({ LineID: mLineID, ID: 0, ProductID: mProductID }, function (resBomItem1) {
                    //bom_id:{int} 
                    if (resBomItem1 && resBomItem1.list) {
                        DATATree = $com.util.Clone(resBomItem1.list);
                        var ItemList = $com.util.Clone(resBomItem1.list);
                        model.com.renderTree(ItemList);
                        $("#areaTree").treeview('toggleNodeSelected', [ItemNode, { silent: false }]);
                        // if ($("#areaTree li span").length > 0)
                        //     $("#areaTree li span").each(function (j, jtem) {
                        //         if (mID != 0) {
                        //             var $Jtem = $(jtem),
                        //                 TreeID = Number($Jtem.attr("data-value"));

                        //             if (mID == TreeID) {
                        //                 $Jtem.css("color", "blue");
                        //             }

                        //         }
                        //     });
                    }
                });
            },
            refreshc: function () {





                if (mID > 0) {
                    model.com.getItemTree({ LineID: mLineID, ProductID: mProductID, ID: mID }, function (resBomItem1) {
                        //bom_id:{int} 
                        // var name = FORMATTRT_BOMItem["LineID"](mLineID)
                        var name = FORMATTRT_BOMItem["LineID"](mLineID) + "线—" + FORMATTRT_BOMItem["ProductID"](mProductID) + "—清单";
                        $("#zace-spanTextChange").html(name);

                        if (resBomItem1 && resBomItem1.list) {

                            var ItemList = $com.util.Clone(resBomItem1.list);
                            DATAITEM = $com.util.Clone(resBomItem1.list);

                            DATAITEMChange = $com.util.Clone(ItemList);
                            $.each(ItemList, function (i, item) {


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
                                if (item.LevelID < 4) {
                                    item.ISAllowedInfo = "lmvt-do-info";
                                } else {
                                    item.ISAllowedInfo = "lmvt-not-allowed-delete";
                                }

                                for (var p in item) {
                                    if (!FORMATTRT_BOMItem[p])
                                        continue;
                                    item[p] = FORMATTRT_BOMItem[p](item[p]);
                                }
                                item.WID = i + 1;
                            });
                            DATAItemSearch = $com.util.Clone(ItemList);
                            $("#femi-bomItem-tbody").html($com.util.template(ItemList, HTML.TableBOMItemMode));

                            $('.partModeDe').hide();
                            $('.partPointModeDe').show();
                        }
                    });

                } else {

                    model.com.getItemTree({ LineID: mLineID, ID: 0, ProductID: mProductID }, function (resBomItem1) {
                        //bom_id:{int} 
                        if (resBomItem1 && resBomItem1.list) {
                            DATATree = $com.util.Clone(resBomItem1.list);
                            var ItemList = $com.util.Clone(resBomItem1.list);
                            model.com.renderTree(ItemList);

                        }
                    });


                    model.com.getItemList({ LineID: mLineID, ProductID: mProductID, CustomerID: mCustomerID, ID: 0 }, function (resBomItem) {
                        //bom_id:{int} 
                        // var name = FORMATTRT_BOMItem["LineID"](mLineID)
                        var name = FORMATTRT_BOMItem["LineID"](mLineID) + "" + FORMATTRT_BOMItem["ProductID"](mProductID) + "产线清单";
                        $("#zace-spanTextChange").html(name);

                        if (resBomItem && resBomItem.list) {

                            var ItemList = $com.util.Clone(resBomItem.list);

                            DATAITEM = $com.util.Clone(resBomItem.list);

                            DATAITEMChange = $com.util.Clone(ItemList);
                            $.each(ItemList, function (i, item) {

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
                                if (item.LevelID < 4) {
                                    item.ISAllowedInfo = "lmvt-do-info";
                                } else {
                                    item.ISAllowedInfo = "lmvt-not-allowed-delete";
                                }

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

                            $('.partModeDe').hide();
                            $('.partPointModeDe').show();
                        }
                    });
                }


                //所有数据 
                model.com.getItemList({ LineID: mLineID, ProductID: mProductID, CustomerID: mCustomerID, ID: 0 }, function (resBomItem) {
                    //bom_id:{int} 
                    if (resBomItem && resBomItem.list) {
                        DATAAllBasic = $com.util.Clone(resBomItem.list);
                    }

                });



            },
            renderTree: function (list) {
                //list  ： Type List

                model.com.fullItems(list);

                list = model.com.StandardTreeBuild(list);

                TreeListCat = $com.util.Clone(list);

                $("#areaTree").treeview({

                    color: "black",
                    expandIcon: "glyphicon glyphicon-plus",
                    collapseIcon: "glyphicon glyphicon-minus",

                    preventUnselect: true,

                    levels: 0,

                    nodeIcon: "glyphicon glyphicon-tags",

                    showTags: true,
                    data: list,

                    onNodeSelected: function (event, data) {

                        mID = data.ID;

                        var _list = [];

                        for (var i = 0; i < DATAAllBasic.length; i++) {
                            if (mID == DATAAllBasic[i].ID) {
                                _list.push(DATAAllBasic[i]);
                            }
                        }

                        if (_list[0] && _list[0].LevelID == 4) {
                            //alert("工序无子集!");

                            // return false;
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

                        StandardNodeID = data.nodeId;
                        ItemNode = data.nodeId;
                        var sels = $("#areaTree").treeview('getSelected');
                        for (var i = 0; i < sels.length; i++) {
                            if (sels[i].nodeId == data.nodeId) {
                                continue;
                            }
                            $("#areaTree").treeview('unselectNode', [sels[i].nodeId, { silent: true }]);
                        }
                        $("#areaTree").treeview('selectNode', [data.nodeId, { silent: true }]);
                    },
                    onNodeUnselected: function (event, data) {

                        if (ItemNode != data.nodeId)
                            return false;

                        $("#areaTree").treeview('toggleNodeSelected', [ItemNode, { silent: true }]);
                    }

                });

                // $("#areaTree").html($com.util.template(list, HTML.TreeItemNode));
                // $("#areaTree").treeview({ collapsed: false });
            },

            StandardTreeBuild: function (list) {

                if (list.length > 0)
                    $.each(list, function (i, item) {
                        if (item.UnitList.length > 0) {
                            var Counts = item.UnitList.length;
                            item.text = item.Name;
                            item.nodes = item.UnitList;
                            item.tags = [Counts];
                            model.com.StandardTreeBuild(item.UnitList);
                        } else {
                            item.text = item.Name;
                            item.nodes = [];
                            item.tags = [0];
                        }
                    });

                return list;
            },

            EachPic: function (list, wLevelID, wID) {

                var NodeID = 0;

                if (list.length > 0)
                    $.each(list, function (i, item) {

                        if (item.LevelID == wLevelID && item.ID == wID) {
                            NodeID = item.nodeId;
                            return false
                        }

                    });

                return NodeID;
            },

            fullItems: function (list) {

                $.each(list, function (i, item) {

                    model.com.fullItems(item.UnitList);

                    item.Items = $com.util.template(item.UnitList, HTML.TreeItemNode);
                    if (item.Items.length > 0) {
                        item.Items = "<ul>" + item.Items + "</ul>";
                    }

                });
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
            //查询工步列表
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
            //查询工步列表
            getCRMCustomer: function (data, fn, context) {
                var d = {
                    $URI: "/Customer/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询工步列表
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
            //查询工位列表
            getFMCStation: function (data, fn, context) {
                var d = {
                    $URI: "/FMCStation/All",
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
            //获取树形
            getItemTree: function (data, fn, context) {
                var d = {
                    $URI: "/FMCLineUnit/Tree",
                    $TYPE: "get"
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
            //启用
            activeItem: function (data, fn, context) {
                var d = {
                    $URI: "/FMCLineUnit/Active",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //审核
            auditItem: function (data, fn, context) {
                var d = {
                    $URI: "/FMCLineUnit/Audit",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //删除
            deleteItem: function (data, fn, context) {
                var d = {
                    $URI: "/FMCLineUnit/Remove",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //查询车间
            getFMCWorkShop: function (data, fn, context) {
                var d = {
                    $URI: "/FMCWorkShop/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //查询产线
            getFMCLine: function (data, fn, context) {
                var d = {
                    $URI: "/FMCLine/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //工序
            getConfigAll: function (data, fn, context) {
                var d = {
                    $URI: "/APSLine/ConfigAll",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询模块ID对应枚举值
            getModuleAll: function (data, fn, context) {
                var d = {
                    $URI: "/MESEnum/All",
                    $TYPE: "get"
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