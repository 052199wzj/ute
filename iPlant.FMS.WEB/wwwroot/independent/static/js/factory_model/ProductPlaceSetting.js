require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/paging'], function ($zace, $com, $page) {

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
        DataAllFactorySearch,
        HTML;
    DataAll = [];
    DATABasic = [];
    DataAllConfirmBasic = [];
    DataAllConfirmChange = [];
    DataAllConfirm = [];
    DataAllFactorySearch = DataAllSearch = [];
    PositionTemp = {
        ID: 0,
        Name: "",
        Active: 1,
        ProductID: 0,
        PlaceType: 1, //1台位  2库位
        ParentID: 0,
        PartID: 0,
        PartNo: "",
        length: 0,
        Status: 0,
    };


    ;
    HTML = {
        TableMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',

            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
            '<td data-title="Code" data-value="{{Code}}" >{{Code}}</td>',
            // '<td data-title="Length" data-value="{{Length}}" >{{Length}}</td>',
            '<td data-title="ParentID" data-value="{{ParentID}}">{{ParentID}}</td>',
            '<td data-title="OrderID" data-value="{{OrderID}}">{{OrderID}}</td>',
             '<td data-title="TransType" data-value="{{TransType}}" >{{TransType}}</td>',
            // '<td data-title="ProductID" data-value="{{ProductID}}" >{{ProductID}}</td>',
            // '<td data-title="PartNo" data-value="{{PartNo}}" >{{PartNo}}</td>',
            // '<td data-title="ProductNo" data-value="{{ProductNo}}" >{{ProductNo}}</td>',
            '<td data-title="Creator" data-value="{{Creator}}" >{{Creator}}</td>',
            '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
            // '<td data-title="Editor" data-value="{{Editor}}" >{{Editor}}</td>',
            // '<td data-title="EditTime" data-value="{{EditTime}}" >{{EditTime}}</td>',
            '<td data-title="Active" data-value="{{Active}}" >{{Active}}</td>',

            '</tr>',
        ].join(""),



    },
        (function () {
            KEYWORD_Level_LIST = [
                "Name|名称",
                "Code|编码",
                "Length|长度",
                "ProductID|车型|ArrayOne",
                "ParentID|绑定库位|ArrayOne",
                "OrderID|顺序",
                "TransType|操作类型|ArrayOne",
                "PartNo|车号",
                "Status|状态",
                "CreateTime|时间|DateTime",
                "EditTime|时间|DateTime",
                "Active|状态|ArrayOne",
            ];
            KEYWORD_Level = {};
            FORMATTRT_Level = {};

            DEFAULT_VALUE_Level = {
                Name: "",
                Code: "",
                Length: 0,
                ParentID:0,
                OrderID:0,
                TransType:0
                // Status:1,

                //ProductID: "",
                //PartNo:"",         
            };

            TypeSource_Level = {
                Active: [
                    {
                        name: "激活",
                        value: 1
                    }, {
                        name: "禁用",
                        value: 0
                    }
                ],
                TransType: [
                    {
                        name: "可新增",
                        value:  1
                    }, {
                        name: "可删除",
                        value: 2
                    }, {
                        name: "可新增、删除",
                        value: 3
                    }
                ],

                ProductID: [
                    {
                        name: "无",
                        value: 0
                    }],

                ParentID: [
                    {
                        name: "无",
                        value: 0
                    }],

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
        name: '岗位',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            $("body").delegate("#zace-refresh-po", "click", function () {

                model.com.refresh();


            });
            // 
            $("body").delegate("#zace-searchAll-level", "click", function () {
                var default_value = {
                    //Name:"",
                    ProductID: 0,
                    //PartNo:"",
                    //Position: 0,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.ProductID = Number(rst.ProductID);
                    //default_value.PartNo = rst.PartNo;
                    //default_value.Name = rst.Name;
                    $com.table.filterByConndition($("#femi-riskLevel-tbody"), DataAll, default_value, "ID");

                }, TypeSource_Level));




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

            //产品规格查询
            $("body").delegate("#zace-searchAll-levelZace", "click", function () {

                var
                    value = $("#zace-search-level").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "ID");



            });
            //产品规格修改
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
                //if (SelectData[0].Status != 1) {
                //    alert("数据选择有误！")
                //    return;
                //}
                var default_value = {
                    Name: SelectData[0].Name,
                    Code: SelectData[0].Code,
                    Length: SelectData[0].Length,
                    ParentID: SelectData[0].ParentID,
                    OrderID: SelectData[0].OrderID,
                    
                    TransType: SelectData[0].TransType,
                    // ProductID: SelectData[0].ProductID,
                    // PartNo: SelectData[0].PartNo.split("-")[1],
                    //ProductCode: SelectData[0].ProductCode,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].Name = rst.Name;
                    SelectData[0].Code = rst.Code;
                    SelectData[0].Length = rst.Length;
                    SelectData[0].ParentID = rst.ParentID;
                    SelectData[0].OrderID = rst.OrderID;
                    SelectData[0].TransType = rst.TransType;
                    // SelectData[0].PartNo = rst.PartNo;
                    // SelectData[0].ProductID = Number(rst.ProductID);
                    //SelectData[0].ProductCode = rst.ProductCode;      
                    // for (var i = 0; i < DataProductList.length; i++) {
                    //     if (SelectData[0].ProductID == DataProductList[i].ID) {
                    //         SelectData[0].ProductNo = DataProductList[i].ProductNo;
                    //     }
                    // }
                    // if (SelectData[0].ProductID > 0) {
                    //     SelectData[0].PartNo = FORMATTRT_Level["ProductID"](SelectData[0].ProductID) + "-" + SelectData[0].PartNo;
                    // } else {

                    //     SelectData[0].PartNo = "";
                    // }

                    for (var i = 0; i < SelectData.length; i++) {

                        $com.util.deleteLowerProperty(SelectData[i]);
                    }
                    model.com.postProductPlace({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();


                    })

                }, TypeSource_Level));


            });

            //产品规格修改
            $("body").delegate("#zace-edit-levelPro", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！")
                    return;
                }
                //if (SelectData[0].Status != 1) {
                //    alert("数据选择有误！")
                //    return;
                //}
                var default_value = {
                    // Name: SelectData[0].Name,
                    // Code: SelectData[0].Code,
                    ProductID: SelectData[0].ProductID,
                    PartNo: SelectData[0].PartNo.split("-")[1],
                    //ProductCode: SelectData[0].ProductCode,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    // SelectData[0].Name = rst.Name;
                    // SelectData[0].Code = rst.Code;
                    SelectData[0].PartNo = rst.PartNo;
                    SelectData[0].ProductID = Number(rst.ProductID);
                    //SelectData[0].ProductCode = rst.ProductCode;      
                    for (var i = 0; i < DataProductList.length; i++) {
                        if (SelectData[0].ProductID == DataProductList[i].ID) {
                            SelectData[0].ProductNo = DataProductList[i].ProductNo;
                        }
                    }
                    if (SelectData[0].ProductID > 0) {
                        SelectData[0].PartNo = FORMATTRT_Level["ProductID"](SelectData[0].ProductID) + "-" + SelectData[0].PartNo;
                    } else {

                        SelectData[0].PartNo = "";
                    }

                    for (var i = 0; i < SelectData.length; i++) {

                        $com.util.deleteLowerProperty(SelectData[i]);
                    }
                    model.com.postProductPlace({
                        data: SelectData[0],
                    }, function (res) {
                        alert("绑定成功");
                        model.com.refresh();


                    })

                }, TypeSource_Level));


            });
            //产品规格激活
            $("body").delegate("#zace-active-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {

                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                model.com.activeAudit({
                    data: SelectData,
                    Active: 1,
                }, function (res) {
                    alert("激活成功");
                    model.com.refresh();


                })




            });
            //产品规格禁用
            $("body").delegate("#zace-disable-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {

                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                model.com.activeAudit({
                    data: SelectData,
                    Active: 0,
                }, function (res) {
                    alert("禁用成功");
                    model.com.refresh();


                })

            });

            //产品规格新增
            $("body").delegate("#zace-add-level", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    PositionTemp.Name = rst.Name;
                    PositionTemp.Length = rst.Length;
                     PositionTemp.TransType = rst.TransType;
                    PositionTemp.OrderID = Number(rst.OrderID);
                    //sitionTemp.ProductID = Number(rst.ProductID);
                    PositionTemp.Code = rst.Code;
                    //sitionTemp.PartNo = rst.PartNo;
                    //for (var i = 0; i < DataProductList.length; i++) {
                    //    if (PositionTemp.ProductID == DataProductList[i].ID) {
                    //        PositionTemp.ProductNo = DataProductList[i].ProductNo;
                    //    }
                    //}

                    //PositionTemp.PartNo = FORMATTRT_Level["ProductID"](PositionTemp.ProductID) + "-" + PositionTemp.PartNo;
                    model.com.postProductPlace({
                        data: PositionTemp,
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                    })

                }, TypeSource_Level));


            });

        },




        run: function () {


            model.com.getFPCProduct({ ProductTypeID: 0, BusinessUnitID: 0 }, function (res1) {
                DataProductList = res1.list;
                $.each(res1.list, function (i, item) {
                    TypeSource_Level.ProductID.push({
                        name: item.ProductNo,
                        value: item.ID,

                    })
                });
                model.com.getStoreHouseList({ 'ID': -1, 'Active': -1 }, function (res) {
                    StoreHouseArray=res.list;
                    $.each(StoreHouseArray, function (i, item) {
                        TypeSource_Level.ParentID.push({
                            name: item.Name,
                            value: item.ID,
                        })
                    });
                    model.com.refresh();
                });

               
            });





        },

        com: {
            refresh: function () {

                model.com.getFPCProductPlace({ Active: -1, ProductID: 0, PartID: 0, PlaceType: 1 }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var Grade = $com.util.Clone(resP.list);
                        DATABasic = $com.util.Clone(resP.list);

                        //审核数据
                        DataAllConfirm = $com.util.Clone(resP.list);
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
                        //$page.getPage(Grade, "#femi-riskLevel-tbody", HTML.TableMode, ".table-part");
                    }

                });
            },
             //获取库位列表
             getStoreHouseList: function (data, fn, context) {
                var d = {
                    $URI: "/LFS/StoreHouseAll",
                    $TYPE: "Get",
                    $SERVER: "/MESLFS"
                };

                function err() {
                    $com.app.tip('获取库位列表失败，请检查网络!');
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
            //查询
            getFPCProductPlace: function (data, fn, context) {
                var d = {
                    $URI: "/FMCWorkspace/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //保存
            postProductPlace: function (data, fn, context) {
                var d = {
                    $URI: "/FMCWorkspace/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //激活
            activeAudit: function (data, fn, context) {
                var d = {
                    $URI: "/FMCWorkspace/Active",
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