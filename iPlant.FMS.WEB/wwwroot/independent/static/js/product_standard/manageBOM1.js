require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/jquery.treeview',], function ($zace, $com, $tree) {

    var model,
        DATAChange,
        DATA,
        DATAITEM,
        DATAITEMChange,
        mBomId,
        KEYWORD_BOM_LIST,
        KEYWORD_BOM,
        FORMATTRT_BOM,
        TypeSource_BOM,
        MaterialList,
        PartList,
        PartPointList,
        BOMTemp,
        TypeList,
        DataLinelist,
        DataWorkShoplist,
        KEYWORD_BOMItem_LIST,
        KEYWORD_BOMItem,
        FORMATTRT_BOMItem,
        TypeSource_BOMItem,
        DataMaterialList,
        TreeList,
        DATAItemSearch,
        DataMateialBasic,
        DATASearch,
        mID,
        mPlaceID,
        DataZZZ,
        mItemID,
        DataZaItem,
        boolImport,
        ZStationList,
        HTML;
    boolImport = true;
    mBomId = 0;
    mPlaceID = 0
    DATAITEMChange = DATAItemSearch = DATASearch = [];
    MaterialList = [];
    DATAITEM = [];
    DATAChange = [];
    DataZaItem = [];
    DATA = TreeList = [];
    ProductList = [];
    mTypeItemRefresh=1;

    BOMItemTemp = {
        Active: 0,
        Auditor: window.parent.User_Info.Name,
        AuditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Author: window.parent.User_Info.Name,
        BOMID: 0,
        DeviceNo: "",
        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        ID: 0,
        LossRatio: 0,
        BOMType: 1,
        PlaceID: 0,
        MaterialID: 0,
        MaterialName: "",
        MaterialNo: "",
        PartPointName: "",
        Type: "",
        MaterialUnit: 0,
        MaterialUnitRatio: 0,
        PartPointID: 0,
        TypeID: 0,
        ParentID: 0,
        GradeID: 1,
        ItemList: [],
        UnitID: 0,
        UnitText: "",
        MaterialNumber: 0,
        ProductQD: "",
        Remark: "",


    };


    BOMListTemp = {
        AuditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Auditor: window.parent.User_Info.Name,
        Author: window.parent.User_Info.Name,
        BOMItemList: [],
        BOMName: "",
        BOMNo: "",
        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        ID: 0,
        LineID: 0,
        LineName: "",
        MaterialID: 1,
        MaterialName: "",
        MaterialNo: "",
        PartID: 0,
        PartName: "",
        Status: 1,
        ProductID: 0,
        StatusText: "",
        Type: "",
        TypeID: 0,
        WorkShop: "",
        WorkShopID: 0,
        CustomerID:0,
    }

    HTML = {
        TableBOMMode: [
            '<tr data-color="">',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',

            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td data-title="BOMNo" data-value="{{BOMNo}}" >{{BOMNo}}</td>',
            '<td data-title="BOMName" data-value="{{BOMName}}" >{{BOMName}}</td>',
            '<td data-title="CustomerID" data-value="{{CustomerID}}" >{{CustomerID}}</td>',
            '<td data-title="LineID" data-value="{{LineID}}" >{{LineID}}</td>',
            '<td data-title="ProductID" data-value="{{ProductID}}" >{{ProductID}}</td>',   
            // '<td data-title="PartID" data-value="{{PartID}}" >{{PartID}}</td>',
            //'<td data-title="MaterialNo" data-value="{{MaterialNo}}" >{{MaterialNo}}</td>',
            //'<td data-title="MaterialName" data-value="{{MaterialName}}" >{{MaterialName}}</td>',
         
            //'<td data-title="WorkShopID" data-value="{{WorkShopID}}" >{{WorkShopID}}</td>',

            //'<td data-title="PartID" data-value="{{PartID}}" >{{PartID}}</td>',
            //'<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',
            '<td data-title="Auditor" data-value="{{Auditor}}" >{{Auditor}}</td>',
            '<td data-title="EditTime" data-value="{{EditTime}}" >{{EditTime}}</td>',

            '</tr>',
        ].join(""),
        TableBOMItemMode: [
            '<tr data-color="">',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  style ="display:none" data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            // '<td data-title="ProductQD" data-value="{{ProductQD}}" >{{ProductQD}}</td>',
            '<td data-title="PlaceID" data-value="{{PlaceID}}" >{{PlaceID}}</td>',
            '<td data-title="PlaceNo" data-value="{{PlaceNo}}" >{{PlaceNo}}</td>',
            '<td data-title="PartPointID" data-value="{{PartPointID}}" >{{PartPointID}}</td>',
            '<td data-title="MaterialID" data-value="{{MaterialID}}" >{{MaterialID}}</td>',
            '<td data-title="MaterialName" data-value="{{MaterialName}}" >{{MaterialName}}</td>',
            '<td data-title="UnitID" data-value="{{UnitID}}" >{{UnitID}}</td>',
            //'<td data-title="DeviceNo" data-value="{{DeviceNo}}" >{{DeviceNo}}</td>',
            '<td data-title="BOMType" data-value="{{BOMType}}" >{{BOMType}}</td>',
            '<td data-title="MaterialNumber" data-value="{{MaterialNumber}}" >{{MaterialNumber}}</td>',
            '<td data-title="ReplaceType" data-value="{{ReplaceType}}" >{{ReplaceType}}</td>',
            '<td data-title="OutsourceType" data-value="{{OutsourceType}}" >{{OutsourceType}}</td>',
            '<td data-title="Remark" data-value="{{Remark}}" >{{Remark}}</td>',
            '<td data-title="Active" data-value="{{Active}}" >{{Active}}</td>',

            '</tr>',
        ].join(""),



        TreeItemNode: [
            '<li data-titie="{{MaterialID}}"  data-value="{{MaterialID}}" >',
            '<span style="vertical-align:top;" data-value="{{ID}}"}" >{{MaterialName}}</span> ',
            '<ul>{{Items}}',
            '</ul>',
            '</li>',
        ].join(""),

    },
        // Bom
        (function () {
            KEYWORD_BOM_LIST = [
                "BOMNo|BOM编码",
                "BOMName|BOM名称",
                //"MaterialID|物料No",
                "CustomerID|配属局段|ArrayOne",
                "LineID|修程|ArrayOne",
                "ProductID|车型|ArrayOne",
                "MaterialID|物料No|ArrayOne",
              
                "WorkShopID|车间|ArrayOne",
             
                "PartID|工位|ArrayOne",
                "Status|状态|ArrayOne",
                "EditTime|编辑时间|DateTime",


            ];
            KEYWORD_BOM = {};
            FORMATTRT_BOM = {};
            DEFAULT_VALUE_BOM = {

            };
            TypeSource_BOM = {
                Status: [{
                    name: "默认",
                    value: 0
                }, {
                    name: "创建",
                    value: 1
                }, {
                    name: "待审核",
                    value: 2
                }, {
                    name: "已审核",
                    value: 3
                }, {
                    name: "审核撤销",
                    value: 4
                }],
                WorkShopID: [],
                LineID: [],
                PartID: [],
                MaterialID: [],
           
                ProductID: [],
                CustomerID:[],


            };

            $.each(KEYWORD_BOM_LIST, function (i, item) {
                var detail = item.split("|");
                KEYWORD_BOM[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };
                if (detail.length > 2) {
                    FORMATTRT_BOM[detail[0]] = $com.util.getFormatter(TypeSource_BOM, detail[0], detail[2]);
                }
            });
        })();

    // BomItem
    (function () {
        KEYWORD_BOMItem_LIST = [
            "ProductQD|局段",
            "PlaceID|台位|ArrayOne",
            "PlaceProID|台位|ArrayOne",
            "PlaceSearchID|台位|ArrayOne",
            "PartPointID|工序|ArrayOne",
            "MaterialID|物料号|ArrayOne",
            "UnitID|单位|ArrayOne",
            "BOMType|类型|ArrayOne",
            "MaterialNumber|数量",
            "Remark|备注",
            "TypeID|类型|ArrayOne",
            "MaterialUnit|用量:分子",
            "MaterialUnitRatio|用量:分母",
            "ReplaceType|必换偶换|ArrayOne",
            "OutsourceType|必修偶修|ArrayOne",
            "DeviceNo|设备号",
            "ParentID|ParentID",
            "GradeID|GradeID",


            "Active|状态|ArrayOne",
        ];
        KEYWORD_BOMItem = {};
        FORMATTRT_BOMItem = {};
        DEFAULT_VALUE_BOMItem = {

        };
        TypeSource_BOMItem = {
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
            Active: [{
                name: "禁用",
                value: 0
            }, {
                name: "启用",
                value: 1
            }],
            BOMType: [{
                name: "新造",
                value: 1
            }, {
                name: "检修",
                value: 2
            }],
            PartPointID: [],
            MaterialID: [],
            UnitID: [{
                name: "无",
                value: 0
            }],
            TypeID: [{
                name: "无",
                value: 0
            }],
            PlaceID: [{
                name: "无",
                value: 0
            }],
            PlaceProID: [{
                name: "无",
                value: 0
            }],
            PlaceSearchID: [{
                name: "全部",
                value: 0
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
        name: 'BOM管理',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            //双击显示子项
            $("body").delegate("#femi-bom-tbody tr", "dblclick", function () {
                $(".zace-BomItem").show();
                $(".zace-Bom").hide();
                var $this = $(this);
                var WName = $this.find('td[data-title=BOMName]').attr('data-value');
                mBomId = Number($this.find('td[data-title=ID]').attr('data-value'));
                $("#zace-spanTextChange").html(WName + "子项");
                if (mBomId > 0) {
                    $(".zace-zace-show").show();

                    mPlaceID = 0;
                    model.com.refreshAAAItem();

                } else {
                    $(".zace-zace-show").hide();
                    $(".zace-BomItem").show();
                    $(".zace-Bom").hide();
                    //DataZaItem = _plistItem;
                    $("#femi-bomItem-tbody").html($com.util.template(DataZaItem, HTML.TableBOMItemMode));
                    $("#femi-bomItem-tbody tr").each(function (i, item) {
                        var $this = $(this);
                        var colorName = $this.css("background-color");
                        $this.attr("data-color", colorName);



                    });
                }
                mTypeItemRefresh=2;

            });

            //返回
            $("body").delegate("#zace-close-bomItem", "click", function () {
                $(".zace-BomItem").hide();
                $(".zace-Bom").show();
                mTypeItemRefresh=1;
            });

            //新增 BOM
            $("body").delegate("#zace-add-bom", "click", function () {

                var default_value = {
                    ProductID: 0,
                    //BOMName: "",
                    //BOMNo: "",
                    LineID: 0,
                    // MaterialID: 0,
                    // PartID: 0,
                    // Status: 0,
                    CustomerID: 0
                };
                $("body").append($com.modal.show(default_value, KEYWORD_BOM, "新增", function (rst) {
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    var _data = {
                        //BOMName: rst.BOMName,
                        //BOMNo: rst.BOMNo,
                        LineID: Number(rst.LineID),
                        ProductID: Number(rst.ProductID),
                        //MaterialID: Number(rst.MaterialID),
                        // PartID: Number(rst.PartID),
                        //Status: Number(rst.Status),
                        CustomerID: Number(rst.CustomerID),
                    };
                    var _temp = $com.util.Clone(BOMListTemp);
                    _temp.MaterialID = MaterialList[0].ID;//定死物料第一条
                    _temp.ProductID = _data.ProductID;
                    for (var i = 0; i < ProductList.length; i++) {
                        if (_temp.ProductID == ProductList[i].ID) {

                            _temp.BOMName = ProductList[i].ProductName + "-" + FORMATTRT_BOM["LineID"](Number(rst.LineID));
                            //+FORMATTRT_BOM["PartID"](Number(rst.PartID));
                            _temp.BOMNo = ProductList[i].ProductName + "-" + FORMATTRT_BOM["LineID"](Number(rst.LineID));

                        }
                    }

                    _temp.LineID = _data.LineID;

                    //_temp.LineID = _data.LineID;

                     _temp.CustomerID = _data.CustomerID;

                    for (var i = 0; i < MaterialList.length; i++) {
                        if (_temp.MaterialID == MaterialList[i].ID) {
                            _temp.TypeID = MaterialList[i].TypeID;
                        }

                    }
                    model.com.postBom({
                        data: _temp
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                        boolImport = true;
                    })

                }, TypeSource_BOM));

            });
            //修改 BOM
            $("body").delegate("#zace-edit-bom", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-bom-tbody"), "ID", DATAChange);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                var default_value = {
                    ProductID: SelectData[0].ProductID,
                    //BOMName: SelectData[0].BOMName,
                    //MaterialID: SelectData[0].MaterialID,
                    CustomerID: SelectData[0].CustomerID,
                    LineID: SelectData[0].LineID,
                    // PartID: SelectData[0].PartID,
                    // Status: SelectData[0].Status,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_BOM, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].ProductID = Number(rst.ProductID);
                    //SelectData[0].MaterialID=Number(rst.MaterialID);
                    //SelectData[0].BOMNo = rst.BOMNo;
                    //SelectData[0].BOMName = rst.BOMName;
                    //DATA[Wid - 1].MaterialID = Number(rst.MaterialID);
                    SelectData[0].CustomerID = Number(rst.CustomerID);
                    SelectData[0].LineID = Number(rst.LineID);
                    //SelectData[0].PartID = Number(rst.PartID);
                    //SelectData[0].Status = Number(rst.Status);
                    //SelectData[0].EditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date());
                    //SelectData[0].Auditor = window.parent.User_Info.Name;
                    //for (var i = 0; i < MaterialList.length; i++) {
                    //    if (DATA[Wid - 1].MaterialID == MaterialList[i].ID) {
                    //        DATA[Wid - 1].TypeID = MaterialList[i].TypeID;
                    //    }

                    //}
                    //for (var i = 0; i < MaterialList.length; i++) {
                    //    if (SelectData[0].MaterialID == MaterialList[i].ID) {
                    //        SelectData[0].TypeID = MaterialList[i].TypeID;
                    //    }

                    //}  
                    for (var i = 0; i < ProductList.length; i++) {
                        if (SelectData[0].ProductID == ProductList[i].ID) {

                            SelectData[0].BOMName = ProductList[i].ProductName + "-" + FORMATTRT_BOM["LineID"](SelectData[0].LineID);
                            SelectData[0].BOMNo = ProductList[i].ProductName + "-" + FORMATTRT_BOM["LineID"](SelectData[0].LineID);

                        }
                    }
                    for (var i = 0; i < SelectData.length; i++) {
                        $com.util.deleteLowerProperty(SelectData[i]);
                    }
                    model.com.postBom({
                        data: SelectData[0]
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                        boolImport = true;
                    })

                }, TypeSource_BOM));

            });
            //删除 BOM
            $("body").delegate("#zace-delete-bom", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-bom-tbody"), "ID", DATAChange);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("一次只能删一个Bom主项！")
                    return;
                }
                if (!confirm("确定将其删除？")) {
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }

                model.com.deleteBom({
                    data: SelectData[0]
                }, function (res1) {
                    var pid = SelectData[0].ID;
                    model.com.refreshDeleteBom(pid);
                })
            });
            //条件查询
            $("body").delegate("#zace-search-bom", "click", function () {
                var default_value = {
                    LineID: 0,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_BOM, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.LineID = Number(rst.LineID);
                    //default_value.Position = Number(rst.Position);
                    $com.table.filterByConndition($("#femi-bom-tbody"), DATAChange, default_value, "ID");

                }, TypeSource_BOM));


            });
            //Enter触发模糊查询事件
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {

                    if ( mTypeItemRefresh==1) {
                        var value = $("#femi-search-text-ledger").val();
                        if (value == undefined || value == "" || value.trim().length < 1)
                            $("#femi-bom-tbody").children("tr").show();
                        else
                            $com.table.filterByLikeString($("#femi-bom-tbody"), DATASearch, value, "ID");
                    } else {
                        var value = $("#femi-search-text-ledgerItemBom").val();
                        if (value == undefined || value == "" || value.trim().length < 1)
                            $("#femi-bomItem-tbody").children("tr").show();
                        else
                            $com.table.filterByLikeString($("#femi-bomItem-tbody"), DATAItemSearch, value, "ID");
                    }
                
                }
            });
            //模糊查询
            $("body").delegate("#zace-search-bomZace", "click", function () {
                var value = $("#femi-search-text-ledger").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-bom-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-bom-tbody"), DATASearch, value, "ID");
            });

            $("body").delegate("#zace-search-bomZaceItemBom", "click", function () {
                var value = $("#femi-search-text-ledgerItemBom").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-bomItem-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-bomItem-tbody"), DATAItemSearch, value, "ID");
            });


            //新增 BOMItem
            $("body").delegate("#zace-add-bomItem", "click", function () {
                var default_value = {
                    Remark: "",
                    //ProductQD: "",
                    PlaceID: 0,
                    BOMType: 2,
                    MaterialID: 0,
                    MaterialNumber: 0,
                    // UnitID: 0,
                    PartPointID: 0,
                    ReplaceType:0,
                    OutsourceType:0,
                    //ParentID: 0,
                    //GradeID:0,
                    // Active: 0,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_BOMItem, "新增", function (rst) {
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    var _data = {
                        MaterialID: Number(rst.MaterialID),
                        MaterialNumber: Number(rst.MaterialNumber),
                        PlaceID: Number(rst.PlaceID),
                        BOMType: Number(rst.BOMType),
                        Remark: rst.Remark,
                        //ProductQD: rst.ProductQD,
                        PartPointID: Number(rst.PartPointID),
                        ReplaceType: Number(rst.ReplaceType),
                        OutsourceType: Number(rst.OutsourceType),
                        //UnitID: Number(rst.UnitID),
                    };
                    var _list = [];
                    var _temp = $com.util.Clone(BOMItemTemp);
                    _temp.MaterialID = _data.MaterialID;
                    _temp.ReplaceType = _data.ReplaceType;
                    _temp.OutsourceType = _data.OutsourceType;
                    //_temp.DeviceNo = _data.DeviceNo;
                    _temp.MaterialNumber = _data.MaterialNumber;
                    _temp.PlaceID = _data.PlaceID;
                    _temp.BOMType = _data.BOMType;
                    _temp.Remark = _data.Remark;
                    //_temp.ProductQD = _data.ProductQD;
                    _temp.PartPointID = _data.PartPointID;
                    //_temp.UnitID = _data.UnitID;
                    _temp.BOMID = mBomId;
                    for (var i = 0; i < MaterialList.length; i++) {
                        if (_temp.MaterialID == MaterialList[i].ID) {
                            _temp.TypeID = MaterialList[i].TypeID;
                            _temp.UnitID = MaterialList[i].CYUnitID;
                            _temp.MaterialName = MaterialList[i].MaterialName;
                            _temp.MaterialNo = MaterialList[i].MaterialNo;
                        }

                    }

                    // _temp.Remark = FORMATTRT_BOMItem["PlaceProID"](_temp.PlaceID) + " " + FORMATTRT_BOMItem["PartPointID"](_temp.PartPointID);



                    model.com.postBomItem({
                        data: _temp
                    }, function (res) {
                        alert("新增成功");
                        model.com.refreshAAAItem();

                        boolImport = true;
                    })

                }, TypeSource_BOMItem));
            });
            //修改 BOMItem
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
                var default_value = {
                    // ProductQD: SelectData[0].ProductQD,
                    Remark: SelectData[0].Remark,
                    PlaceID: SelectData[0].PlaceID,
                    BOMType: SelectData[0].BOMType,
                    MaterialID: SelectData[0].MaterialID,
                    MaterialNumber: SelectData[0].MaterialNumber,
                    // UnitID: SelectData[0].UnitID,
                    PartPointID: SelectData[0].PartPointID,
                    ReplaceType: SelectData[0].ReplaceType,
                    OutsourceType: SelectData[0].OutsourceType,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_BOMItem, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    // SelectData[0].ProductQD = rst.ProductQD;
                    SelectData[0].Remark = rst.Remark;
                    SelectData[0].PlaceID = Number(rst.PlaceID);
                    SelectData[0].ReplaceType = Number(rst.ReplaceType);
                    SelectData[0].OutsourceType = Number(rst.OutsourceType);
                    SelectData[0].BOMType = Number(rst.BOMType);
                    SelectData[0].MaterialID = Number(rst.MaterialID);
                    SelectData[0].MaterialNumber = Number(rst.MaterialNumber);
                    //SelectData[0].UnitID = Number(rst.UnitID);
                    SelectData[0].PartPointID = Number(rst.PartPointID);
                    // SelectData[0].MaterialID = Number(rst.MaterialID);
                    // DATAITEM[Wid - 1].ItemList.push(DATAITEM[3]);
                    for (var i = 0; i < MaterialList.length; i++) {
                        if (SelectData[0].MaterialID == MaterialList[i].ID) {
                            SelectData[0].TypeID = MaterialList[i].TypeID;
                            SelectData[0].UnitID = MaterialList[i].CYUnitID;
                            SelectData[0].MaterialName = MaterialList[i].MaterialName;
                            SelectData[0].MaterialNo = MaterialList[i].MaterialNo;
                        }

                    }
                    //SelectData[0].Remark = FORMATTRT_BOMItem["PlaceID"](SelectData[0].PlaceID) + " " + FORMATTRT_BOMItem["PartPointID"](SelectData[0].PlaceID);;
                    for (var i = 0; i < SelectData.length; i++) {
                        $com.util.deleteLowerProperty(SelectData[i]);
                    }
                    model.com.postBomItem({
                        data: SelectData[0]
                    }, function (res) {
                        alert("修改成功");
                        model.com.refreshAAAItem();
                        boolImport = true;
                    })

                }, TypeSource_BOMItem));
            });
            //删除 BOMItem
            $("body").delegate("#zace-delete-bomItem", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-bomItem-tbody"), "WID", DATAITEMChange);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                var a = 0;
                $com.app.loading();
                var WhileAdd = function () {

                    model.com.deleteBomItem({
                        data: SelectData[a],
                    }, function (res) {
                        a++;

                        if (a == SelectData.length) {
                            $com.app.loaded();

                            model.com.refreshAAAItem();
                            boolImport = true;

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

                var default_value = {
                    MaterialID: 0,
                    LossRatio: 0,
                    //DeviceNo: "",
                    MaterialUnit: 0,
                    MaterialUnitRatio: 0,
                    PartPointID: 0,
                    //ParentID: 0,
                    //GradeID:0,
                    // Active: 0,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_BOMItem, "新增", function (rst) {
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    var _data = {
                        MaterialID: Number(rst.MaterialID),
                        LossRatio: Number(rst.LossRatio),
                        //DeviceNo: rst.DeviceNo,
                        MaterialUnit: Number(rst.MaterialUnit),
                        MaterialUnitRatio: Number(rst.MaterialUnitRatio),
                        PartPointID: Number(rst.PartPointID),
                        //ParentID: Number(rst.ParentID),
                        //GradeID: Number(rst.GradeID),
                    };

                    var _temp = $com.util.Clone(BOMItemTemp);
                    _temp.MaterialID = _data.MaterialID;
                    //_temp.DeviceNo = _data.DeviceNo;
                    _temp.LossRatio = _data.LossRatio;
                    _temp.MaterialUnit = _data.MaterialUnit;
                    _temp.MaterialUnitRatio = _data.MaterialUnitRatio;
                    _temp.PartPointID = _data.PartPointID;
                    _temp.MaterialUnitRatio = _data.MaterialUnitRatio;
                    _temp.ParentID = SelectData[0].ID;
                    _temp.GradeID = SelectData[0].GradeID + 1;
                    _temp.BOMID = mBomId;
                    for (var i = 0; i < MaterialList.length; i++) {
                        if (_temp.MaterialID == MaterialList[i].ID) {
                            _temp.TypeID = MaterialList[i].TypeID;
                            _temp.UnitID = MaterialList[i].CYUnitID;
                            _temp.MaterialName = MaterialList[i].MaterialName;
                            _temp.MaterialNo = MaterialList[i].MaterialNo;
                        }

                    }

                    model.com.postBomItem({
                        data: _temp
                    }, function (res) {
                        alert("新增子项成功");
                        model.com.refreshAAAItem();
                        boolImport = true;
                    })

                }, TypeSource_BOMItem));
            });
            //启用 BOMItem
            $("body").delegate("#zace-active-bomItem", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-bomItem-tbody"), "ID", DATAITEMChange);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                model.com.activeBomItem({
                    data: SelectData,
                    active: 1
                }, function (res1) {
                    alert("启用成功");
                    model.com.refreshAAAItem();
                    boolImport = true;
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
                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                model.com.activeBomItem({
                    data: SelectData,
                    active: 0
                }, function (res1) {
                    alert("禁用成功");
                    model.com.refreshAAAItem();
                    boolImport = true;
                })
            });

            //条件查询
            $("body").delegate("#zace-search-bomItem", "click", function () {
                var default_value = {
                    PlaceSearchID: 0,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_BOMItem, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    mPlaceID = Number(rst.PlaceSearchID);
                    model.com.refreshAAAItem();
                    //$com.table.filterByConndition($("#femi-bomItem-tbody"), DATAITEMChange, default_value, "ID");

                }, TypeSource_BOMItem));


            });
            //刷新
            $("body").delegate("#zace-refresh-bom", "click", function () {

                model.com.refresh();
                boolImport = true;
            });

            $("body").delegate("#zace-refresh-bomItemZace", "click", function () {
                mPlaceID = 0;
                model.com.refreshAAAItem();
            });
            //导入
            $("body").delegate("#zace-import-bom", "click", function () {
                if (boolImport) {
                    $("#input-file").val("");
                    $("#input-file").click();
                } else {
                    alert("请把导入数据操作完！！！");
                    return false;
                }


            });
            $("body").delegate("#input-file", "input", function () {
                var $this = $(this);

                if (this.files.length == 0)
                    return;
                var fileData = this.files[0];

                var form = new FormData();
                form.append("file", fileData);

                model.com.postImportExcel(form, function (res) {
                    if (!res)
                        return;
                    var list = res.list;
                    var listInfo = res.info;
                    var postData = res.list;

                    var DataParams = $com.table.postExportParams(postData, $(".table-part>table"));


                    var arr2List = DataParams;


                    var list = model.com.getNewList(DATAITEM, arr2List);
                    if (list.length != arr1List.length) {
                        if (!confirm("导入数据重复" + (arr1List.length - list.length) + "条，确定是否继续？")) {
                            return false;
                        }

                    }
                    var CABool = false;  //Bom类型
                    var CBBool = false;  //物料No
                    var CDBool = false;  //台位
                    var CEBoll = false;  //工序

                    $.each(list, function (i, item) {
                        if (item.BOMType <= 2) {
                            CABool = true;

                        }


                        for (var i = 0; i < MaterialList.length; i++) {
                            if (item.MaterialID == MaterialList[i].MaterialNo) {
                                item.MaterialID = MaterialList[i].ID;
                                item.UnitID = MaterialList[i].CYUnitID;
                                item.MaterialName = MaterialList[i].MaterialName;
                                item.MaterialNo = MaterialList[i].MaterialNo;
                                CBBool = true;
                                break;
                            }
                        }
                        for (var i = 0; i < ZStationList.length; i++) {
                            if (item.PlaceID == ZStationList[i].Code) {
                                item.PlaceID == ZStationList[i].ID;
                                CDBool = true;
                                break;
                            }
                        }
                        for (var i = 0; i < PartPointList.length; i++) {
                            if (item.PartPointName == PartPointList[i].Name) {
                                item.PartPointID == PartPointList[i].ID;
                                CEBool = true;
                                break;
                            }
                        }

                    });

                    if (!CABool) {
                        alert("BOM类型输入有误！")
                        return false;
                    }

                    if (!CBBool) {
                        alert("物料号输入有误！")
                        return false;
                    }


                    if (!CDBool) {
                        alert("台位信息输入有误！")
                        return false;
                    }
                    if (!CEBool) {
                        alert("工序信息输入有误！")
                        return false;
                    }

                    var _ItemTemp = [];
                    var ItemList = $com.util.Clone(DATAITEM);
                    $.each(list, function (i, item) {
                        var _temp = $com.util.Clone(BOMItemTemp);
                        _temp.LossRatio = item.LossRatio;
                        _temp.BOMType = item.BOMType;
                        _temp.MaterialID = item.MaterialID;
                        _temp.UnitID = item.UnitID;
                        _temp.PartPointID = item.PartPointID;
                        _temp.PlaceID = item.PlaceID;
                        _temp.BOMID = mBomId;
                        _temp.MaterialName = item.MaterialName;
                        _temp.MaterialNo = item.MaterialNo;
                        _ItemTemp.push(_temp);
                        ItemList.push(_temp);


                    });

                    DATAITEM = $com.util.Clone(ItemList);
                    for (var i = 0; i < ItemList.length; i++) {
                        ItemList[i].WID = i + 1;
                        for (var j = 0; j < ZStationList.length; j++) {
                            if (ZStationList[i].ID == ItemList[i].PlaceID) {
                                ItemList[i].PlaceNo = ZStationList[i].Code;
                                break;
                            }
                        }

                    }
                    DATAITEMChange = $com.util.Clone(ItemList);

                    $.each(FORMATTRT_BOMItem, function (i, item) {
                        for (var p in item) {
                            if (!FORMATTRT_BOMItem[p])
                                continue;
                            item[p] = FORMATTRT_BOMItem[p](item[p]);
                        }
                    });

                    DATAItemSearch = $com.util.Clone(ItemList);

                    //model.com.renderTree(ItemList);
                    $("#femi-bomItem-tbody").html($com.util.template(ItemList, HTML.TableBOMItemMode));
                    $("#femi-bomItem-tbody tr").each(function (i, item) {
                        var $this = $(this);
                        var colorName = $this.css("background-color");
                        $this.attr("data-color", colorName);



                    });





                    $("#femi-bom-tbody").html($com.util.template(_list, HTML.TableBOMMode));
                    $("#femi-bom-tbody tr").each(function (i, item) {
                        var $this = $(this);
                        var colorName = $this.css("background-color");
                        $this.attr("data-color", colorName);



                    });



                });
            });
            //$("body").delegate("#areaTree li span", "click", function () {
            //    var $this = $(this);
            //    var id = Number($this.attr("data-value"));
            //    alert(id);
            //    return false;
            //});
            $("body").delegate("#zace-save-bomAll", "click", function () {
                if (DATAITEM && DATAITEM.length > 0) {
                    var p = 0;

                    //$com.app.loading();
                    var WhileAddz = function () {

                        model.com.postBomItem({
                            data: DATAITEM[p],
                        }, function (res) {
                            p++;

                            if (p == DATAITEM.length) {
                                $com.app.loaded();

                                alert("更新成功");
                                model.com.refresh();
                                boolImport = true;
                            } else {
                                WhileAddz();
                            }
                        });

                    }
                    if (DATAITEM.length <= 0) {
                        alert("数据为空！！！");
                    } else {
                        WhileAddz();
                    }
                } else {
                    alert("数据为空！！！");
                }



            });
        },

        run: function () {

            //获取车间 产线信息
            var WWorkShopList = window.parent._WorkShop;
            var WLineList = window.parent._Line;
            $com.app.loading('数据加载中...');

            model.com.getFPCProduct({ ProductTypeID: 0, BusinessUnitID: 0 }, function (resR1) {
                if (resR1 && resR1.list) {
                    ProductList = resR1.list;
                    $.each(resR1.list, function (i, item) {
                        TypeSource_BOM.ProductID.push({
                            name: item.ProductNo,
                            value: item.ID,
                        });
                    });
                }
                model.com.getFPCPartPoint({ FactoryID: 0, BusinessUnitID: 0, ProductTypeID: 0 }, function (resR2) {
                    if (resR2 && resR2.list) {
                        //工序
                        PartPointList = resR2.list;
                        $.each(resR2.list, function (i, item) {
                            TypeSource_BOMItem.PartPointID.push({
                                name: item.Name,
                                value: item.ID,
                            });
                        });
                    }
                    model.com.getMaterialList({ material_no: "", material_name: "", type_id: 0, status: 0 }, function (res) {
                        $.each(res.list, function (i, item) {
                            //物料
                            MaterialList = res.list;
                            TypeSource_BOM.MaterialID.push({
                                name: item.MaterialNo,
                                // name: item.MaterialNo + "/" + item.MaterialName,
                                value: item.ID,
                                far: null
                            })
                            TypeSource_BOMItem.MaterialID = TypeSource_BOM.MaterialID;
                        });

                        model.com.getCustomer({ active: 2 }, function (resModule) {
                            if (resModule && resModule.list) {
                               
                                $.each(resModule.list, function (i, item) {
                                    TypeSource_BOM.CustomerID.push({
                                        name: item.CustomerName,
                                        value: item.ID,
                                        far: null
                                    })
                                });
                             
                            }

                            model.com.getMeteringSettingprice({}, function (resPrice) {
                                $.each(resPrice.list, function (i, item) {
                                    TypeSource_BOMItem.UnitID.push({
                                        name: item.Name,
                                        value: item.ID,
                                        far: null
                                    })
                                });
                                //产线
                                DataLinelist = WLineList;
                                $.each(WLineList, function (i, item) {
                                    TypeSource_BOM.LineID.push({
                                        name: item.Name,
                                        value: item.ID,
                                        far: 0
                                    });
                                });

                                //车间
                                DataWorkShoplist = WWorkShopList;
                                $.each(DataWorkShoplist, function (i, item) {
                                    TypeSource_BOM.WorkShopID.push({
                                        name: item.Name,
                                        value: item.ID,
                                        far: 0
                                    });
                                });
                                //工位
                                model.com.getFPCPart({ FactoryID: 0, BusinessUnitID: 0 }, function (resPrice) {
                                    //工位
                                    ZStationList = resPrice.list;
                                    $.each(resPrice.list, function (i, item) {
                                        TypeSource_BOMItem.PlaceID.push({
                                            name: item.Name,
                                            value: item.ID,

                                        })
                                    });
                                    TypeSource_BOM.PartID=TypeSource_BOMItem.PlaceID;
                                    $.each(resPrice.list, function (i, item) {
                                        TypeSource_BOMItem.PlaceProID.push({
                                            name: item.Code,
                                            value: item.ID,

                                        })
                                    });
                                    $.each(resPrice.list, function (i, item) {
                                        TypeSource_BOMItem.PlaceSearchID.push({
                                            name: item.Code,
                                            value: item.ID,

                                        })
                                    });
                                    // model.com.setMMM();
                                    model.com.refresh();

                                });

                            });
                        });

                    });
                });



            });




        },

        com: {
              //查询局段信息
            getCustomer: function (data, fn, context) {
                var d = {
                    $URI: "/Customer/All",
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
            //查询列表
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

            setMMM: function () {
                setTimeout(function () {

                    if (window.parent._zaceLineSet && window.parent._zaceLineSet == 1) {
                        model.com.getFMCLine({ FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0 }, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {
                                DataLinelist = resW.list;
                                //TypeSource_Level.AuditorID.splice(1, TypeSource_Level.AuditorID.length - 1);
                                TypeSource_BOM.LineID = [];
                                $.each(resW.list, function (i, item) {
                                    TypeSource_BOM.LineID.push({
                                        name: item.Name,
                                        value: item.ID,
                                        far: 0
                                    });
                                });
                            }
                            window.parent._zaceLineSet = 0;
                        });

                    }

                    if (window.parent._zaceWorkShop && window.parent._zaceWorkShop == 1) {
                        model.com.getFMCWorkShop({ FactoryID: 0, BusinessUnitID: 0 }, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {
                                DataWorkShoplist = resW.list;
                                //TypeSource_Level.AuditorID.splice(1, TypeSource_Level.AuditorID.length - 1);
                                TypeSource_BOM.WorkShopID = [];
                                $.each(resW.list, function (i, item) {
                                    TypeSource_BOM.WorkShopID.push({
                                        name: item.Name,
                                        value: item.ID,
                                        far: 0
                                    });
                                });

                            }
                            window.parent._zaceWorkShop = 0;
                        });

                    }

                    if (window.parent._zaceMaterialRecord && window.parent._zaceMaterialRecord == 1) {
                        model.com.getMaterialList({ material_no: "", material_name: "", type_id: 0, status: 0 }, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {
                                MaterialList = resW.list;
                                TypeSource_BOM.MaterialID = [];

                                //TypeSource_materialRecord.SupplierID.splice(1, TypeSource_materialRecord.SupplierID.length - 1);
                                $.each(resW.list, function (i, item) {
                                    TypeSource_BOM.MaterialID.push({
                                        name: item.MaterialNo,
                                        value: item.ID,
                                        far: null
                                    })
                                    TypeSource_BOMItem.MaterialID = TypeSource_BOM.MaterialID;
                                });
                            }
                            window.parent._zaceMaterialRecord = 0;
                        });

                    }
                    if (window.parent._zacePartPointSet && window.parent._zacePartPointSet == 1) {
                        model.com.getFPCPartPoint({ FactoryID: 0, BusinessUnitID: 0, ProductTypeID: 0 }, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {
                                PartPointList = resW.list;
                                //TypeSource_Level.AuditorID.splice(1, TypeSource_Level.AuditorID.length - 1);
                                TypeSource_BOMItem.PlaceID = [];
                                $.each(resW.list, function (i, item) {
                                    TypeSource_BOMItem.PlaceID.push({
                                        name: item.Name,
                                        value: item.ID,
                                    });
                                });
                                TypeSource_BOMItem.PlaceProID = [];
                                $.each(resW.list, function (i, item) {
                                    TypeSource_BOMItem.PlaceProID.push({
                                        name: item.Code,
                                        value: item.ID,

                                    })
                                });
                                TypeSource_BOMItem.PlaceSearchID = [];
                                $.each(resW.list, function (i, item) {
                                    TypeSource_BOMItem.PlaceSearchID.push({
                                        name: item.Code,
                                        value: item.ID,

                                    })
                                });
                            }
                            window.parent._zacePartPointSet = 0;
                        });

                    }
                    if (window.parent._zaceRoutePartSet && window.parent._zaceRoutePartSet == 1) {
                        model.com.getFPCRoutePart({ RouteID: 0 }, function (resR1) {
                            if (!resR1)
                                return;
                            if (resR1 && resR1.list) {
                                //TypeSource_Level.AuditorID.splice(1, TypeSource_Level.AuditorID.length - 1);
                                TypeSource_BOM.PartID = [];
                                PartList = resR1.list;
                                $.each(resR1.list, function (i, item) {
                                    TypeSource_BOM.PartID.push({
                                        name: item.Name,
                                        value: item.ID,
                                    });
                                });
                            }
                            window.parent._zaceRoutePartSet = 0;
                        });

                    }

                    model.com.setMMM();
                }, 500);

            },
            refresh: function () {
                $com.app.loading('数据加载中...');
                // bom_no:{String} , bom_name:{String} ,workshop_id:{int} ,type_id:{int} ,status:{int}
                model.com.getBomList({ bom_no: "", bom_name: "", workshop_id: 0, type_id: 0, status: 0 }, function (resBom) {
                    if (resBom && resBom.list) {

                        var _list = $com.util.Clone(resBom.list);

                        DATA = $com.util.Clone(resBom.list);


                        DATAChange = $com.util.Clone(_list);

                        $.each(_list, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_BOM[p])
                                    continue;
                                item[p] = FORMATTRT_BOM[p](item[p]);
                            }

                            item.WID = i + 1;
                        });
                        DATASearch = $com.util.Clone(_list);

                        $("#femi-bom-tbody").html($com.util.template(_list, HTML.TableBOMMode));
                        $com.app.loaded();
                        $("#femi-bom-tbody tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });
                    }
                });



                //model.com.getBomItemList({ bom_id: mBomId,placeID:mPlaceID, IsList: true }, function (resBomItem) {
                //    //bom_id:{int} 
                //    if (resBomItem && resBomItem.list) {

                //        var ItemList = $com.util.Clone(resBomItem.list);

                //        DATAITEM = $com.util.Clone(resBomItem.list);
                //        for (var i = 0; i < ItemList.length; i++) {
                //            ItemList[i].WID = i + 1;
                //            for (var j = 0; j < ZStationList.length; j++) {
                //                if (ZStationList[i].ID == ItemList[i].PlaceID) {
                //                    ItemList[i].PlaceNo = ZStationList[i].Code;
                //                    break;
                //                }
                //            }

                //        }
                //        DATAITEMChange = $com.util.Clone(ItemList);

                //        $.each(ItemList, function (i, item) {
                //            for (var p in item) {
                //                if (!FORMATTRT_BOMItem[p])
                //                    continue;
                //                item[p] = FORMATTRT_BOMItem[p](item[p]);
                //            }
                //        });

                //        DATAItemSearch = $com.util.Clone(ItemList);

                //        //model.com.renderTree(ItemList);
                //        $("#femi-bomItem-tbody").html($com.util.template(ItemList, HTML.TableBOMItemMode));
                //        $("#femi-bomItem-tbody tr").each(function (i, item) {
                //            var $this = $(this);
                //            var colorName = $this.css("background-color");
                //            $this.attr("data-color", colorName);



                //        });
                //    }
                //});
                //model.com.getBomItemList({ bom_id: mBomId, IsList: false }, function (resBomItem1) {
                //    //bom_id:{int} 
                //    if (resBomItem1 && resBomItem1.list) {
                //        TreeList = $com.util.Clone(resBomItem1.list);
                //        var ItemList = $com.util.Clone(resBomItem1.list);
                //        model.com.renderTree(ItemList);
                //    }
                //});



            },
            refreshAAAItem: function () {
                model.com.getBomItemList({ bom_id: mBomId, PlaceID: 0, IsList: true }, function (resBomItem) {
                    //bom_id:{int} 
                    if (resBomItem && resBomItem.list) {

                        var ItemList = $com.util.Clone(resBomItem.list);

                        DATAITEM = $com.util.Clone(resBomItem.list);
                        for (var i = 0; i < ItemList.length; i++) {
                            ItemList[i].WID = i + 1;
                            for (var j = 0; j < ZStationList.length; j++) {
                                if (ZStationList[j].ID == ItemList[i].PlaceID) {
                                    ItemList[i].PlaceNo = ZStationList[j].Code;

                                }
                            }

                        }


                        DATAITEMChange = $com.util.Clone(ItemList);
                        $.each(ItemList, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_BOMItem[p])
                                    continue;
                                item[p] = FORMATTRT_BOMItem[p](item[p]);
                            }
                        });
                        DATAItemSearch = $com.util.Clone(ItemList);
                        //model.com.renderTree(ItemList);
                        $("#femi-bomItem-tbody").html($com.util.template(ItemList, HTML.TableBOMItemMode));
                        $("#femi-bomItem-tbody tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });
                    }
                });
                model.com.getBomItemList({ bom_id: mBomId, IsList: false }, function (resBomItem1) {
                    //bom_id:{int} 
                    if (resBomItem1 && resBomItem1.list) {
                        TreeList = $com.util.Clone(resBomItem1.list);
                        var ItemList = $com.util.Clone(resBomItem1.list);
                        model.com.renderTree(ItemList);
                    }
                });
            },
            refreshBom: function () {
                // bom_no:{String} , bom_name:{String} ,workshop_id:{int} ,type_id:{int} ,status:{int}
                model.com.getBomList({ bom_no: "", bom_name: "", workshop_id: 0, type_id: 0, status: 0 }, function (resBom) {
                    if (resBom && resBom.list) {
                        var _list = $com.util.Clone(resBom.list);
                        DATA = $com.util.Clone(resBom.list);
                        DATAChange = $com.util.Clone(_list);

                        var WBid = DATAChange[DATAChange.length - 1].ID;
                        for (var i = 0; i < DataZZZ.length; i++) {
                            DataZZZ[i].BOMID = WBid;
                        }

                        //导入层级为1的数据
                        var a = 0;

                        $com.app.loading();
                        var WhileAdd = function () {

                            model.com.postBomItem({
                                data: DataZZZ[a],
                            }, function (res) {
                                a++;

                                if (a == DataZZZ.length) {
                                    // $com.app.loaded();        
                                    mBomId = WBid;
                                    model.com.refreshBomItem();

                                } else {
                                    WhileAdd();
                                }
                            });

                        }
                        if (DataZZZ.length <= 0) {
                            alert("导入数据为空！！！");
                        } else {
                            WhileAdd();
                        }

                    }
                });
            },
            refreshBomItem: function () {

                model.com.getBomItemList({ bom_id: mBomId, IsList: false }, function (resBomItem1) {
                    //bom_id:{int} 
                    if (resBomItem1 && resBomItem1.list) {
                        TreeList = $com.util.Clone(resBomItem1.list);

                        //层级为2所有数据
                        var _listBomItemAll = [];
                        for (var i = 0; i < ItemList.length; i++) {
                            ItemList[i].WID = i + 1;
                            for (var j = 0; j < ZStationList.length; j++) {
                                if (ZStationList[j].ID == ItemList[i].PlaceID) {
                                    ItemList[i].PlaceNo = ZStationList[j].Code;

                                }
                            }

                        }

                        var p = 0;

                        //$com.app.loading();
                        var WhileAddz = function () {

                            model.com.postBomItem({
                                data: _listBomItemAll[p],
                            }, function (res) {
                                p++;

                                if (p == _listBomItemAll.length) {
                                    $com.app.loaded();

                                    alert("导入成功");
                                    model.com.refresh();
                                    boolImport = true;
                                } else {
                                    WhileAddz();
                                }
                            });

                        }
                        if (_listBomItemAll.length <= 0) {
                            alert("导入数据为空！！！");
                        } else {
                            WhileAddz();
                        }

                    }
                });



            },
            refreshDeleteBom: function (id) {
                model.com.getBomItemList({ bom_id: id, IsList: true }, function (resBomItem) {
                    //bom_id:{int} 
                    if (resBomItem && resBomItem.list) {

                        var ItemList = $com.util.Clone(resBomItem.list);

                        if (ItemList.length > 0) {
                            var a = 0;

                            $com.app.loading();
                            var WhileAdd = function () {

                                model.com.deleteBomItem({
                                    data: ItemList[a],
                                }, function (res) {
                                    a++;

                                    if (a == ItemList.length) {
                                        $com.app.loaded();

                                        model.com.refresh();
                                        boolImport = true;

                                    } else {
                                        WhileAdd();
                                    }
                                });

                            }
                            if (ItemList.length <= 0) {
                                alert("删除数据为空！！！");
                            } else {
                                WhileAdd();
                            }
                        } else {
                            model.com.refresh();
                            boolImport = true;
                        }



                    }
                });

            },
            renderTree: function (list) {
                //list  ： Type List

                model.com.fullItems(list);

                $("#areaTree").html($com.util.template(list, HTML.TreeItemNode));
                $("#areaTree").treeview();
            },
            fullItems: function (list) {

                $.each(list, function (i, item) {

                    model.com.fullItems(item.ItemList);

                    item.Items = $com.util.template(item.ItemList, HTML.TreeItemNode);


                });
            },

            //单位
            getMeteringSettingprice: function (data, fn, context) {
                var d = {
                    $URI: "/Unit/All",
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
            //导入
            postImportExcel: function (data, fn, context) {
                var d = {
                    $URI: "/Upload/ImportExcel",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax_load(data ? $.extend(data, d) : $.extend(d, data), fn, err, context);
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
            //获取bom列表
            getBomList: function (data, fn, context) {
                var d = {
                    $URI: "/Bom/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取物料号列表
            getMaterialList: function (data, fn, context) {
                var d = {
                    $URI: "/Material/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取bom
            getBom: function (data, fn, context) {
                var d = {
                    $URI: "/Bom/Info",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //更新/新增bom
            postBom: function (data, fn, context) {
                var d = {
                    $URI: "/Bom/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getNewList: function (_source, set_data) {
                if (!_source)
                    _source = [];
                if (!set_data)
                    set_data = [];
                var rst = [];
                if (_source.length >= set_data.length) {
                    for (var i = 0; i < _source.length; i++) {
                        var NotOWn = false;
                        for (var j = 0; j < set_data.length; j++) {
                            if (_source[i].MaterialNo == set_data[j].MaterialNo && _source[i].PartPointName == set_data[j].PartPointName && FORMATTRT_BOMItem["PlaceProID"](_source[i].PlaceID) == set_data[j].PlaceID) {
                                _source.splice(i, 1);
                                set_data.splice(j, 1)
                                NotOWn = true;
                            }
                            if (set_data.length < 1) {
                                break;
                            }
                            if (_source.length < 1) {
                                break;
                            }
                            if (NotOWn) {
                                model.com.getNewList(_source, set_data);
                            }
                        }

                    }
                    rst = set_data;
                    return rst;
                } else {
                    for (var i = 0; i < set_data.length; i++) {
                        var NotOWn = false;
                        for (var j = 0; j < _source.length; j++) {
                            if (_source[i].MaterialNo == set_data[j].MaterialNo && _source[i].PartPointName == set_data[j].PartPointName && FORMATTRT_BOMItem["PlaceProID"](_source[i].PlaceID) == set_data[j].PlaceID) {
                                set_data.splice(i, 1);
                                _source.splice(j, 1)
                                NotOWn = true;
                            }
                            if (_source.length < 1) {
                                break;
                            }
                            if (set_data.length < 1) {
                                break;
                            }
                            if (NotOWn) {
                                model.com.getNewList(set_data, _source);
                            }
                        }

                    }
                    rst = set_data;
                    return rst;

                }

            },
            //删除bom
            deleteBom: function (data, fn, context) {
                var d = {
                    $URI: "/Bom/Delete",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
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
            //获取BOM子项
            getBomItem: function (data, fn, context) {
                var d = {
                    $URI: "/BomItem/Info",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //Update 新增
            postBomItem: function (data, fn, context) {
                var d = {
                    $URI: "/BomItem/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //删除
            deleteBomItem: function (data, fn, context) {
                var d = {
                    $URI: "/BomItem/Delete",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //启用
            activeBomItem: function (data, fn, context) {
                var d = {
                    $URI: "/BomItem/Active",
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
            //bom
            createPart: function () {
                var _list = [];
                var _temp = $com.util.Clone(BOMListTemp);
                _list.push(_temp);

                return _list;
            },
            //bomItem
            createPart1: function () {
                var _list = [];
                var _temp = $com.util.Clone(BOMItemTemp);
                _list.push(_temp);

                return _list;
            },
            getBomItemOne: function (data) {
                var _tempItema = $com.util.Clone(BOMItemTemp);
                _tempItema.GradeID = data.GradeID;
                _tempItema.LossRatio = data.LossRatio;
                _tempItema.MaterialNo = data.MaterialNo;
                //_tempItema.MaterialName = listInfo.BOMItemList[i].MaterialName;
                _tempItema.MaterialUnit = data.MaterialUnit;
                _tempItema.MaterialUnitRatio = data.MaterialUnitRatio;
                _tempItema.PartPointName = data.PartPointName;
                _tempItema.Type = data.Type;
                _tempItema.UnitName = data.UnitName;
                _tempItema.ItemList = [];
                var partPointBool = false;
                for (var i = 0; i < PartPointList.length; i++) {
                    if (_tempItema.PartPointName == PartPointList[i].Name) {
                        _tempItema.PartPointID = PartPointList[i].ID;
                        partPointBool = true;
                    }
                }
                if (!partPointBool) {
                    alert("工步名称输入有误！")
                    return false;
                }

                var materItemBool = false;
                for (var i = 0; i < MaterialList.length; i++) {
                    if (_tempItema.MaterialNo == MaterialList[i].MaterialNo) {
                        _tempItema.MaterialID = MaterialList[i].ID;
                        _tempItema.MaterialName = MaterialList[i].MaterialName;
                        _tempItema.TypeID = MaterialList[i].TypeID;
                        _tempItema.UnitID = MaterialList[i].CYUnitID;
                        materItemBool = true;
                    }
                }
                if (!materItemBool) {
                    alert("子项物料号输入有误！")
                    return false;
                }

                return _tempItema;

            },
        }
    });

    model.init();


});