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
        BOMType: 0,
        OrderID: 0,
        WBSNo: '',
        PartNo: '',
        LineID: 0,
        ProductID: 0,
        CustomerID: 0,

        PartID: 0,
        PartPointID: 0,
        MaterialID: 0,
        Number: 0.0,

        UnitID: 0,
        ReplaceType: 0,
        OutsourceType: 0,
        OriginalType: 0,

        DisassyType: 0,
        OverLine: 0,
        PartChange: 0,

        StockID: 0,
        QTType: 0,
        QTItemType: 0,
        CustomerMaterial: 0,

        Status: 0,








    };


    ;
    HTML = {
        TableMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td style="display:none" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            //'<td data-title="ProductName" data-value="{{ProductName}}" >{{ProductName}}</td>',
            '<td data-title="BOMType" data-value="{{BOMType}}" >{{BOMType}}</td>',
            '<td data-title="ProductNo" data-value="{{ProductNo}}" >{{ProductNo}}</td>',
            '<td data-title="LineName" data-value="{{LineName}}" >{{LineName}}</td>',
            '<td data-title="CustomerCode" data-value="{{CustomerCode}}" >{{CustomerCode}}</td>',
            '<td data-title="WBSNo" data-value="{{WBSNo}}" >{{WBSNo}}</td>',
            '<td data-title="PartName" data-value="{{PartName}}" >{{PartName}}</td>',
            '<td data-title="PartPointName" data-value="{{PartPointName}}" >{{PartPointName}}</td>',
            '<td data-title="MaterialNo" data-value="{{MaterialNo}}" >{{MaterialNo}}</td>',
            '<td data-title="MaterialName" data-value="{{MaterialName}}" >{{MaterialName}}</td>',
            '<td data-title="Number" data-value="{{Number}}" >{{Number}}</td>',
            '<td data-title="UnitText" data-value="{{UnitText}}" >{{UnitText}}</td>',
            '<td data-title="ReplaceType" data-value="{{ReplaceType}}" >{{ReplaceType}}</td>',
            '<td data-title="OutsourceType" data-value="{{OutsourceType}}" >{{OutsourceType}}</td>',
            '<td data-title="OriginalType" data-value="{{OriginalType}}" >{{OriginalType}}</td>',
            '<td data-title="DisassyType" data-value="{{DisassyType}}" >{{DisassyType}}</td>',
            '<td data-title="OverLine" data-value="{{OverLine}}" >{{OverLine}}</td>',
            '<td data-title="PartChange" data-value="{{PartChange}}" >{{PartChange}}</td>',
            '<td data-title="StockID" data-value="{{StockID}}" >{{StockID}}</td>',
            '<td data-title="QTType" data-value="{{QTType}}" >{{QTType}}</td>',
            '<td data-title="QTItemType" data-value="{{QTItemType}}" >{{QTItemType}}</td>',
            '<td data-title="CustomerMaterial" data-value="{{CustomerMaterial}}" >{{CustomerMaterial}}</td>',
            // '<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',
            '</tr>',
        ].join(""),



    },
        (function () {
            KEYWORD_Level_LIST = [

                "BOMType|BOM类型|ArrayOne",
                "OrderID|订单|ArrayOne",
                "LineID|修程|ArrayOneControl",
                "ProductID|车型|ArrayOne",
                "PartID|工位|ArrayOneControl",
                "PartPointID|工序|ArrayOneControl|PartID",
                "MaterialID|物料|ArrayOneControl|PartID,PartPointID",
                "UnitID|单位|ArrayOne",


                'Number|数量',
                "ReplaceType|必换偶换|ArrayOne",
                "OutsourceType|必修偶修|ArrayOne",
                "OriginalType|原拆原装要求|ArrayOne",
                "DisassyType|是否拆解下车|ArrayOne",
                "OverLine|是否超修程|ArrayOne",
                "PartChange|是否呼唤件|ArrayOne",

                //"StockID|仓库号|ArrayOne",
                "StockID|仓库号",

                "QTType|质量损失大类|ArrayOne",

                "QTItemType|质量损失小类|ArrayOne",

                "CustomerMaterial|客户供料|ArrayOne",

                "Status|状态|ArrayOne",
            ];
            KEYWORD_Level = {};
            FORMATTRT_Level = {};

            DEFAULT_VALUE_Level = {
                BOMType: 0,
                PartID: 0,
                PartPointID: 0,
                MaterialID: 0,
                Number: 0.0,
                ReplaceType: 0,
                OutsourceType: 0,
                OriginalType: 0,
                DisassyType: 0,
                OverLine: 0,
                PartChange: 0,
                StockID: 1100,
                QTType: 0,
                QTItemType: 0,
                CustomerMaterial: 0,
            };

            TypeSource_Level = {
                OrderID: [],
                LineID: [],
                ProductID: [],
                CustomerID: [],
                PartID: [],
                PartPointID: [],
                MaterialID: [],
                UnitID: [],
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
                        name: "委外必修件",
                        value: 1
                    }, {
                        name: "委外偶修件",
                        value: 2
                    }, {
                        name: "自修必修",
                        value: 3
                    }, {
                        name: "自修偶修",
                        value: 4
                    }, {
                        name: "其他",
                        value: 0
                    }

                ],
                OriginalType: [{
                    name: "否",
                    value: 0
                }, {
                    name: "是",
                    value: 1
                }],
                DisassyType: [{
                    name: "否",
                    value: 0
                }, {
                    name: "是",
                    value: 1
                }],
                OverLine: [{
                    name: "否",
                    value: 0
                }, {
                    name: "是",
                    value: 1
                }],
                PartChange: [{
                    name: "否",
                    value: 0
                }, {
                    name: "是",
                    value: 1
                }],
                StockID: [{
                    name: "新造",
                    value: 1100
                }, {
                    name: "检修",
                    value: 1200
                }],
                QTType: [
                    {
                        name: "-",
                        value: 0
                    }, {
                        name: "报废",
                        value: 1
                    }, {
                        name: "返工返修",
                        value: 2
                    }, {
                        name: "停产",
                        value: 3
                    }, {
                        name: "内部质量收入",
                        value: 4
                    }],
                QTItemType: [{
                    name: "-",
                    value: 0
                }, {
                    name: "设计差错",
                    value: 1
                }, {
                    name: "工艺差错",
                    value: 2
                }, {
                    name: "制造差错",
                    value: 3
                }, {
                    name: "供方原因",
                    value: 4
                }, {
                    name: "其他原因",
                    value: 5
                }],
                CustomerMaterial: [{
                    name: "否",
                    value: 0
                }, {
                    name: "是",
                    value: 1
                }],
                Status: [{
                    name: "保存",
                    value: 1
                }, {
                    name: "待审批",
                    value: 2
                }, {
                    name: "已审批",
                    value: 3
                }, {
                    name: "驳回",
                    value: 4
                }],




                BOMType: [{
                    name: "新造",
                    value: 1
                }, {
                    name: "检修",
                    value: 2
                }, {
                    name: "计划外",
                    value: 9
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
        name: 'Bom',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {

            window.setFunctionTrigger("BomExportSetting", function (res) {

                mOrderID = res.ID;
                mOrderName = res.Name;
                mPartNo = res.PartNo;

                mProductNo = res.Name;


                mPartNo = mProductNo + '#' + mPartNo;
                $('.zace-header-title').text('(' + mPartNo + ')' + '台车Bom');
                model.com.loadZace();
                // alert(res.ID);
                //刷新
            });


            $("body").delegate("#zace-refresh-po", "click", function () {

                model.com.refresh();


            });
            // 
            $("body").delegate("#zace-searchAll-level", "click", function () {
                var default_value = {
                    Active: 1,
                    //Position: 0,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.Active = eval(rst.Active.toLowerCase());
                    $com.table.filterByConndition($("#femi-riskLevel-tbody"), DataAll, default_value, "ID");

                }, TypeSource_Level));




            });
            //Enter触发模糊查询事件
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                     var value = $("#zace-search-level").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "ID");
                }
            });
            //产品规格查询
            $("body").delegate("#zace-searchAll", "click", function () {
                var value = $("#zace-search-level").val();
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
                    Number: SelectData[0].Number,

                };


                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].Number = rst.Number;

                    for (var i = 0; i < SelectData.length; i++) {

                        $com.util.deleteLowerProperty(SelectData[i]);
                    }
                    model.com.postBomExport({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();


                    })

                }, TypeSource_Level));


            });


            //删除
            $("body").delegate("#zace-edit-remove", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }

                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！")
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {

                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                model.com.deleteBomExport({
                    data: SelectData[0],

                }, function (res) {
                    alert("删除成功");
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
                    Active: 2,
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

                    PositionTemp.OrderID = mOrderInfo.ID;
                    PositionTemp.WBSNo = mOrderInfo.WBSNo;
                    PositionTemp.PartNo = mOrderInfo.PartNo;
                    PositionTemp.LineID = mOrderInfo.LineID;
                    PositionTemp.ProductID = mOrderInfo.ProductID;
                    PositionTemp.CustomerID = mOrderInfo.BureauSectionID;

                    PositionTemp.MaterialNo = modeMaterial[rst.MaterialID].MaterialNo;
                    PositionTemp.BOMType = rst.BOMType;
                    PositionTemp.PartID = rst.PartID;
                    PositionTemp.PartPointID = rst.PartPointID;
                    PositionTemp.MaterialID = modeMaterial[rst.MaterialID].MaterialID;
                    PositionTemp.Number = Number(rst.Number);

                    PositionTemp.ReplaceType = Number(rst.ReplaceType);
                    PositionTemp.OutsourceType = Number(rst.OutsourceType);
                    PositionTemp.OriginalType = Number(rst.OriginalType);
                    PositionTemp.DisassyType = Number(rst.DisassyType);
                    PositionTemp.OverLine = Number(rst.OverLine);
                    PositionTemp.PartChange = Number(rst.PartChange);
                    PositionTemp.StockID = Number(rst.StockID);
                    PositionTemp.QTType = Number(rst.QTType);
                    PositionTemp.QTItemType = Number(rst.QTItemType);
                    PositionTemp.CustomerMaterial = Number(rst.CustomerMaterial);


                    model.com.postBomExport({
                        data: PositionTemp,
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                    })

                }, TypeSource_Level));


            });

            $("body").delegate("#zace-active-ExportReport", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {

                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                if (!confirm("确定导出" + "台车Bom吗？")) {
                    return;
                }

                // $com.util.deleteLowerProperty(DATABasicItem[0]);
                $com.app.loading('数据加载中...');
                model.com.exportReport({
                    data: SelectData,


                }, function (res) {

                    window.open(res.info);

                    console.log('导出成功。。。。');
                    $com.app.loaded();
                })



            });

        },




        run: function () {


            mOrderID = model.query.id;
            mOrderName = model.query.name;
            mPartNo = model.query.PartNo;

            mProductNo = model.query.name;


            mPartNo = mProductNo + '#' + mPartNo;
            // mOrderID=45;
            // mOrderName='HXD1C（高原）#测试06';

            $('.zace-header-title').text('【' + mPartNo + '】' + '台车Bom');
            model.com.loadZace();






        },

        com: {

            exportReport: function (data, fn, context) {
                var d = {
                    $URI: "/IPTStandard/ExportAPSBOM",
                    $TYPE: "Post",
                    $SERVER: '/MESQMS',
                };

                function err() {
                    console.log('导出。。。');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //查询信息
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
            //查询产线列表
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
            loadZace: function () {
                model.com.getOMSOrderInfo({ ID: mOrderID }, function (resP) {
                    if (!resP)
                        return;

                    mOrderInfo = $com.util.Clone(resP.info);
                    model.com.getCustomer({ active: 2 }, function (resP) {
                        if (!resP)
                            return;

                        $.each(resP.list, function (i, item) {
                            TypeSource_Level.CustomerID.push({
                                value: item.ID,
                                name: item.CustomerName
                            });
                        });

                        model.com.getFPCProduct({ ProductTypeID: 0, BusinessUnitID: 0 }, function (resP) {
                            if (!resP)
                                return;

                            $.each(resP.list, function (i, item) {

                                if (item.Active == 1) {
                                    TypeSource_Level.ProductID.push({
                                        value: item.ID,
                                        name: item.ProductName
                                    });
                                }

                            });

                            model.com.get({ active: 1 }, function (resP) {
                                if (!resP)
                                    return;

                                // $.each(resP.list, function (i, item) {
                                //     TypeSource_Level.CreatorID.push({
                                //         value: item.ID,
                                //         name: item.Name
                                //     });
                                // });

                                model.com.getItemList({ LineID: mOrderInfo.LineID, ProductID: mOrderInfo.ProductID, CustomerID: 0 }, function (resP) {
                                    if (!resP)
                                        return;

                                    $.each(resP.list, function (i, item) {
                                        if (item.LevelID == 2) {
                                            TypeSource_Level.PartID.push({
                                                name: item.Name,
                                                value: item.UnitID,
                                                far: 0,

                                            });


                                        } else if (item.LevelID == 3) {
                                            TypeSource_Level.PartPointID.push({
                                                name: item.Name,
                                                value: item.UnitID,
                                                far: item.ParentUnitID,
                                            });
                                        }
                                    });

                                    model.com.getBomItemList({ bom_id: 0, PlaceID: 0, LineID: mOrderInfo.LineID, ProductID: mOrderInfo.ProductID, CustomerID: mOrderInfo.CustomerID, IsList: true }, function (resP) {

                                        if (!resP)
                                            return;
                                        modeMaterial = {},
                                            $.each(resP.list, function (i, item) {
                                                modeMaterial[item.ID] = item;
                                                TypeSource_Level.MaterialID.push({
                                                    name: item.MaterialNo,
                                                    value: item.ID,
                                                    far: item.PlaceID + '_' + item.PartPointID,

                                                });

                                            });

                                        model.com.refresh();



                                    });

                                });

                            });
                        });
                    });
                });
            },

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
            getOMSOrderInfo: function (data, fn, context) {
                var d = {
                    $URI: "/OMSOrder/Info",
                    $TYPE: "get",
                    $SERVER: "/MESAPS"
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


            get: function (data, fn, context) {
                var d = {
                    $URI: "/User/All",
                    $TYPE: "get",

                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getAPSBOM: function (data, fn, context) {
                var d = {
                    $URI: "/APSBOM/All",
                    $TYPE: "get",

                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            refresh: function () {
                $com.app.loading('数据加载中...');
                model.com.getAPSBOM({ OrderID: mOrderID }, function (resP) {
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
                        });
                        DataAllFactorySearch = $com.util.Clone(Grade);
                        $("#femi-riskLevel-tbody").html($com.util.template(Grade, HTML.TableMode));
                        $com.app.loaded();
                        // $page.getPage(Grade, "#femi-riskLevel-tbody", HTML.TableMode, ".table-part");
                    }

                });
            },
            //查询产品类别列表
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
            //保存
            postBomExport: function (data, fn, context) {
                var d = {
                    $URI: "/APSBOM/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //
            deleteBomExport: function (data, fn, context) {
                var d = {
                    $URI: "/APSBOM/Delete",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            auditBomExport: function (data, fn, context) {
                var d = {
                    $URI: "/APSBOM/Audit",
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