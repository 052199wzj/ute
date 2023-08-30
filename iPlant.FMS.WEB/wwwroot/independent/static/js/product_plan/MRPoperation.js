require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($zace, $com) {

    var KEYWORD_Level_LIST,
        KEYWORD_Level,
        FORMATTRT_Level,
        DEFAULT_VALUE_Level,
        TypeSource_Level,
		model,
        OrderItemSourceBasic,
        OrderItemSourceChange,
        OrderItemSourceChangeS,
        DataAll,
        DATABasic,
        MRPOrderAll,
        OrderEntryListAll,
        HTML;

    OrderEntryListAll = [];
    MRPOrderTemp = {
        BOMID: 0,
        BOMNo: "",
        BOMType: "",
        DemandEndTime: "2019-04-21 08:00:00",
        DemandStartTime: "2019-04-10 08:00:00",
        FQTY: 0.0,
        GradeID: 0,
        ID: 0,
        LineID: 0,
        MaterialID: 0,
        MaterialName: "",
        MaterialNo: "",
        MRPID: 0,
        MRPNo: "",
        OrderID: "",
        OrderNo: "",
        PartID: "",
        PartName: "",
        Type: 0,
        WorkShopID: 0,
        WorkShopText: 0
    };

    MRPEntryTemp = {
        Auditor: "admin",
        AuditorID: 1,
        AuditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        BOMGrade: 0,
        ID: 0,
        IsMRP: true,
        LineMode: 0,
        MergeMode: 0,
        MRPNo: "",
        Operator: "admin",
        OperatorID: 1,
        ProduceMode: 0,
        Status: 0,
        StockList: [],
        SubmitTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
    };

    ;
    HTML = {
        TableMRPOutProduct: [
				'<tr>',
				'<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
				'<td data-title="MRPID" data-value="{{MRPID}}" >{{MRPID}}</td>',
				'<td data-title="MaterialID" data-value="{{MaterialID}}" >{{MaterialID}}</td>',
				'<td data-title="MaterialNo" data-value="{{MaterialNo}}" >{{MaterialNo}}</td>',
				'<td data-title="BOMID" data-value="{{BOMID}}" >{{BOMID}}</td>',
                '<td data-title="BOMNo" data-value="{{BOMNo}}" >{{BOMNo}}</td>',
				'<td data-title="StartTime" data-value="{{StartTime}}" >{{StartTime}}</td>',
				'<td data-title="EndTime" data-value="{{EndTime}}" >{{EndTime}}</td>',
                '<td data-title="MarginFQTY" data-value="{{MarginFQTY}}" >{{MarginFQTY}}</td>',
                '<td data-title="ToProduceFQTY" data-value="{{ToProduceFQTY}}" >{{ToProduceFQTY}}</td>',
                '<td data-title="Type" data-value="{{Type}}" >{{Type}}</td>',
                '<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',
                 '<td data-title="UnitID" data-value="{{UnitID}}" >{{UnitID}}</td>',
				'</tr>',
        ].join(""),
        TableMRPProduct: [
              '<tr>',
              '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
              '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
              '<td data-title="MRPID" data-value="{{MRPID}}" >{{MRPID}}</td>',
              '<td data-title="MaterialID" data-value="{{MaterialID}}" >{{MaterialID}}</td>',
              '<td data-title="MaterialNo" data-value="{{MaterialNo}}" >{{MaterialNo}}</td>',
              '<td data-title="UnitID" data-value="{{UnitID}}" >{{UnitID}}</td>',
              '<td data-title="BOMNo" data-value="{{BOMNo}}" >{{BOMNo}}</td>',
              '<td data-title="BOMType" data-value="{{BOMType}}" >{{BOMType}}</td>',
              '<td data-title="MarginFQTY" data-value="{{MarginFQTY}}" >{{MarginFQTY}}</td>',
              '<td data-title="ToProduceFQTY" data-value="{{ToProduceFQTY}}" >{{ToProduceFQTY}}</td>',
              '<td data-title="DemandStartTime" data-value="{{DemandStartTime}}" >{{DemandStartTime}}</td>',
              '<td data-title="DemandEndTime" data-value="{{DemandEndTime}}" >{{DemandEndTime}}</td>',
              '<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',
               '<td data-title="Type" data-value="{{Type}}" >{{Type}}</td>',
              '</tr>',
        ].join(""),

        TablePurchaseMode: [
				'<tr>',
				'<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
				'<td data-title="MRPID" data-value="{{MRPID}}" >{{MRPID}}</td>',
				'<td data-title="MaterialID" data-value="{{MaterialID}}" >{{MaterialID}}</td>',
				'<td data-title="MaterialNo" data-value="{{MaterialNo}}" >{{MaterialNo}}</td>',
				'<td data-title="UnitID" data-value="{{UnitID}}" >{{UnitID}}</td>',
                '<td data-title="MarginFQTY" data-value="{{MarginFQTY}}" >{{MarginFQTY}}</td>',
				'<td data-title="OrderFQTY" data-value="{{OrderFQTY}}" >{{OrderFQTY}}</td>',
				'<td data-title="Price" data-value="{{Price}}" >{{Price}}</td>',
                '<td data-title="Money" data-value="{{Money}}" >{{Money}}</td>',
                '<td data-title="DemandTime" data-value="{{DemandTime}}" >{{DemandTime}}</td>',
                '<td data-title="OrderTime" data-value="{{OrderTime}}" >{{OrderTime}}</td>',
                '<td data-title="SupplierID" data-value="{{SupplierID}}" >{{SupplierID}}</td>',
                 '<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',
                '<td data-title="SafeMode" data-value="{{SafeMode}}" >{{SafeMode}}</td>',
                '<td data-title="StockID" data-value="{{StockID}}" >{{StockID}}</td>',
				'</tr>',
        ].join(""),
        TableMaterialMode: [
              '<tr>',
              '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
              '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
              //'<td data-title="MRPID" data-value="{{MRPID}}" >{{MRPID}}</td>',
              //'<td data-title="GradeID" data-value="{{GradeID}}" >{{GradeID}}</td>',
              '<td data-title="MaterialID" data-value="{{MaterialID}}" >{{MaterialID}}</td>',
              '<td data-title="MaterialNo" data-value="{{MaterialNo}}" >{{MaterialNo}}</td>',
              '<td data-title="BadRatio" data-value="{{BadRatio}}" >{{BadRatio}}</td>',
              '<td data-title="DemandFQTY" data-value="{{DemandFQTY}}" >{{DemandFQTY}}</td>',
              '<td data-title="AvailableFQTY" data-value="{{AvailableFQTY}}" >{{AvailableFQTY}}</td>',
              '<td data-title="MarginFQTY" data-value="{{MarginFQTY}}" >{{MarginFQTY}}</td>',
              '<td data-title="StockFQTY" data-value="{{StockFQTY}}" >{{StockFQTY}}</td>',
              '<td data-title="OnBuyFQTY" data-value="{{OnBuyFQTY}}" >{{OnBuyFQTY}}</td>',
              '<td data-title="OnFactoryFQTY" data-value="{{OnFactoryFQTY}}" >{{OnFactoryFQTY}}</td>',
              '<td data-title="OnSaleFQTY" data-value="{{OnSaleFQTY}}" >{{OnSaleFQTY}}</td>',
               '<td data-title="SafeFQTY" data-value="{{SafeFQTY}}" >{{SafeFQTY}}</td>',
              //'<td data-title="LossFQTY" data-value="{{LossFQTY}}" >{{LossFQTY}}</td>',
              //'<td data-title="FrozenFQTY" data-value="{{FrozenFQTY}}" >{{FrozenFQTY}}</td>',
              //  '<td data-title="UnitID" data-value="{{UnitID}}" >{{UnitID}}</td>',
              '<td data-title="TypeID" data-value="{{TypeID}}" >{{TypeID}}</td>',
              //'<td data-title="BuyDays" data-value="{{BuyDays}}" >{{BuyDays}}</td>',
              // '<td data-title="StockID" data-value="{{StockID}}" >{{StockID}}</td>',
              //'<td data-title="SafeMode" data-value="{{SafeMode}}" >{{SafeMode}}</td>',
              '<td data-title="SupplierID" data-value="{{SupplierID}}" >{{SupplierID}}</td>',



              '</tr>',
        ].join(""),

        TableMRPExceptionMode: [
             '<tr>',
             '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
             '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',             
             '<td data-title="Type" data-value="{{Type}}" >{{Type}}</td>',
             '<td data-title="MaterialID" data-value="{{MaterialID}}" >{{MaterialID}}</td>',
             '<td data-title="MaterialNo" data-value="{{MaterialNo}}" >{{MaterialNo}}</td>',
             '<td data-title="ExceptionText" data-value="{{ExceptionText}}" >{{ExceptionText}}</td>',
             '</tr>',
        ].join(""),

        OrderItemList: [
          '<tr>',
          '<td style="width: 3px"><input type="checkbox"',
          'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
          '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td>',
          '<td style="min-width: 50px" data-title="OrderID" data-value="{{OrderID}}">{{OrderID}}</td>',
          '<td style="min-width: 50px" data-title="BOMID" data-value="{{BOMID}}">{{BOMID}}</td>',
          //'<td style="min-width: 50px" data-title="ItemName" data-value="{{ItemName}}">{{ItemName}}</td>',
          '<td style="min-width: 50px" data-title="MRPID" data-value="{{MRPID}}">{{MRPID}}</td> ',
          '<td style="min-width: 50px" data-title="GradeID" data-value="{{GradeID}}">{{GradeID}}</td>',
          '<td style="min-width: 50px" data-title="FQTY" data-value="{{FQTY}}">{{FQTY}}</td>',
          '<td style="min-width: 50px" data-title="MaterialNo" data-value="{MaterialNo}}">{{MaterialNo}}</td>',
          '<td style="min-width: 50px" data-title="MaterialName" data-value="{MaterialName}}">{{MaterialName}}</td>',
          '<td style="min-width: 50px" data-title="WorkShopID" data-value="{WorkShopID}}">{{WorkShopID}}</td>',
          '<td style="min-width: 50px" data-title="LineID" data-value="{LineID}}">{{LineID}}</td>',
          '<td style="min-width: 50px" data-title="PartID" data-value="{PartID}}">{{PartID}}</td>',
          '<td style="min-width: 50px" data-title="Type" data-value="{Type}}">{{Type}}</td>',
          '</tr>',
        ].join(""),


    }
    $(function () {
        KEYWORD_Level_LIST = [
         "RiskText|风险等级名称",
         "Count1Week|计量周期",
         "Count1Unit|计量单位|ArrayOne",
         "Count2Week|质量周期",
         "Count2Unit|质量单位|ArrayOne",
         "Count3Week|工艺周期",
         "Count3Unit|工艺单位|ArrayOne",
         "AuditTime|创建时间|Date",
         "EditTime|编辑时间|Date",
        ];
        KEYWORD_Level = {};
        FORMATTRT_Level = {};

        DEFAULT_VALUE_Level = {
            AuditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
            Auditor: window.parent.User_Info.Name,
            Author: window.parent.User_Info.Name,
            EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
            ID: 1,
            ItemList: [
             {
                 CycleUnit: 0, //循环单元
                 ID: 1,
                 PatrolCycle: 0,//巡逻周期 
                 Type: 1,
             },
             {
                 CycleUnit: 0,
                 ID: 2,
                 PatrolCycle: 0,
                 Type: 2,
             }, {
                 CycleUnit: 0,
                 ID: 3,
                 PatrolCycle: 0,
                 Type: 3,
             }, ],
            RiskID: 1,
            RiskText: "",
        };

        TypeSource_Level = {
            Count1Unit: [
              {
                  name: "未知",
                  value: 0
              },
              {
                  name: "分钟",
                  value: 1
              },
              {
                  name: "小时",
                  value: 2
              },
              {
                  name: "天",
                  value: 3
              },
              {
                  name: "周",
                  value: 4
              },
              {
                  name: "月",
                  value: 5
              },
              {
                  name: "年",
                  value: 6
              },
            ],
            Count2Unit: [
            {
                name: "未知",
                value: 0
            },
            {
                name: "分钟",
                value: 1
            },
            {
                name: "小时",
                value: 2
            },
            {
                name: "天",
                value: 3
            },
            {
                name: "周",
                value: 4
            },
            {
                name: "月",
                value: 5
            },
            {
                name: "年",
                value: 6
            },
            ],
            Count3Unit: [
            {
                name: "未知",
                value: 0
            },
            {
                name: "分钟",
                value: 1
            },
            {
                name: "小时",
                value: 2
            },
            {
                name: "天",
                value: 3
            },
            {
                name: "周",
                value: 4
            },
            {
                name: "月",
                value: 5
            },
            {
                name: "年",
                value: 6
            },
            ]



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
    });


    model = $com.Model.create({
        name: 'MRP运算',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            ////修改 订单
            //$("body").delegate("#zace-update-ZaceData", "click", function () {
            //    var SelectData = $com.table.getSelectionData($("#zace-SaleorderItem-body"), "WID", OrderItemSourceChange);
            //    if (!SelectData || !SelectData.length) {
            //        alert("请先选择一行数据再试！")
            //        return;
            //    }


            //        model.com.postOrder({
            //            data: mrpOrder,
            //            mrpentry:MRPEntry

            //        }, function (res) {
            //            alert("修改成功");
            //            model.com.refresh();
            //        })


            //});
            //MRP物料
            $("body").delegate("#zace-MRP1-level", "click", function () {
                $('.zzza').hide();
                $('.zzzb').show();
                $(".zzzc").hide();
                $(".zzzd").hide();
                $(".zzze").hide();
                $(".zzzf").hide();
            })
            //MRP采购
            $("body").delegate("#zace-MRP2-level", "click", function () {
                $('.zzza').hide();
                $('.zzzb').hide();
                $(".zzzc").show();
                $(".zzzd").hide();
                $(".zzze").hide();
                $(".zzzf").hide();
            })
            //采购建议
            $("body").delegate("#zace-MRP3-level", "click", function () {
                $('.zzza').hide();
                $('.zzzb').hide();
                $(".zzzc").hide();
                $(".zzzd").show();
                $(".zzze").hide();
                $(".zzzf").hide();
            })
            //MRP委外生产建议
            $("body").delegate("#zace-MRP4-level", "click", function () {
                $('.zzza').hide();
                $('.zzzb').hide();
                $(".zzzc").hide();
                $(".zzzd").hide();
                $(".zzze").hide();
                $(".zzzf").show();
            });
            //zace-MRP5-level 异常
            $("body").delegate("#zace-MRP5-level", "click", function () {
                $('.zzza').hide();
                $('.zzzb').hide();
                $(".zzzc").hide();
                $(".zzzd").hide();
                $(".zzze").show();
                $(".zzzf").hide();
            });

            $("body").delegate("#zace-backward-level", "click", function () {
                $(".zzza").show();
                $(".zzzb").hide();
                $(".zzzc").hide();
                $(".zzzd").hide();
                $(".zzze").hide();
                $(".zzzf").hide();

            })
            $("body").delegate("#zace-backward1-level", "click", function () {
                $('.zzza').show();
                $('.zzzb').hide();
                $(".zzzc").hide();
                $(".zzzd").hide();
                $(".zzze").hide();
                $(".zzzf").hide();

            })

            //zace - update - ZaceData
            $("body").delegate("#zace-update-ZaceData", "click", function () {

                var SelectData = $com.table.getSelectionData($("#zace-SaleorderItem-body"), "ID", MRPOrderAll);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                $('.zzza').hide();
                $('.zzzb').show();
                $(".zzzc").hide();
                $(".zzzd").hide();
                $(".zzze").hide();
                $(".zzzf").hide();



                model.com.postOrder({
                    data: SelectData,
                    mrpentry: MRPEntryTemp

                }, function (resO) {
                    alert("提交成功");
                    OrderEntryListAll = resO.info.OrderEntryList;
                    model.com.refresh();


                });
            })
        },





        run: function () {
            $(".zzzb").hide();
            $(".zzzc").hide();
            $(".zzzd").hide();
            $(".zzze").hide();
            $(".zzzf").hide();

            model.com.refresh();
        },

        com: {
            refresh: function () {
                //model.com.getOrderItem({ orderid: 2 }, function (resO) {
                //    if (resO && resO.list) {

                //        OrderItemSourceBasic = resO.list;
                //        OrderItemSourceChange = $com.util.Clone(resO.list);

                //        $.each(OrderItemSourceChange, function (i, item) {
                //            item.WID = i + 1;
                //        });

                //        var _listz = $com.util.Clone(OrderItemSourceChange);
                //        //$.each(_listz, function (i, item) {
                //        //    for (var p in item) {
                //        //        if (!FORMATTRT_OrderItem[p])
                //        //            continue;
                //        //        item[p] = FORMATTRT_OrderItem[p](item[p]);
                //        //    }
                //        //});
                //        OrderItemSourceChangeS = $com.util.Clone(_listz);
                //        //$("#zace-SaleorderItem-body").html($com.util.template(_listz, HTML.OrderItemList));
                //    }

                //});
                model.com.getMRPOrderList({ mrpordertype: 1, orderstatus: 1, materialno: "06.04.1003", starttime: "2000-01-01 08:00:00", endtime: "2030-01-01 08:00:00" }, function (resM) {
                    if (resM && resM.list) {

                        MRPOrderAll = resM.list;
                        $("#zace-SaleorderItem-body").html($com.util.template(MRPOrderAll, HTML.OrderItemList));
                    }


                });
                if (OrderEntryListAll.length > 0) {
                    var listMaterial = [];
                    var listPurchase = [];
                    var listProduct = [];
                    var listOutProduct = [];
                    var listException = [];
                    for (var i = 0; i < OrderEntryListAll.length; i++) {
                        if (OrderEntryListAll[i].ExceptionList.length > 0) {
                            for (var j = 0; j < OrderEntryListAll[i].ExceptionList.length; j++) {
                                listException.push(OrderEntryListAll[i].ExceptionList[j]);

                            }
                        }

                    }
                    for (var i = 0; i < OrderEntryListAll.length; i++) {
                        if (OrderEntryListAll[i].MaterialList.length > 0) {
                            for (var j = 0; j < OrderEntryListAll[i].MaterialList.length; j++) {
                                listMaterial.push(OrderEntryListAll[i].MaterialList[j]);

                            }
                        }

                    }
                    for (var i = 0; i < OrderEntryListAll.length; i++) {
                        if (OrderEntryListAll[i].PurchaseList.length > 0) {
                            for (var j = 0; j < OrderEntryListAll[i].PurchaseList.length; j++) {
                                listPurchase.push(OrderEntryListAll[i].PurchaseList[j]);

                            }
                        }

                    }
                    for (var i = 0; i < OrderEntryListAll.length; i++) {
                        if (OrderEntryListAll[i].ProductList.length > 0) {
                            for (var j = 0; j < OrderEntryListAll[i].ProductList.length; j++) {
                                listProduct.push(OrderEntryListAll[i].ProductList[j]);

                            }
                        }

                    }
                    for (var i = 0; i < OrderEntryListAll.length; i++) {
                        if (OrderEntryListAll[i].OutProductList.length > 0) {
                            for (var j = 0; j < OrderEntryListAll[i].OutProductList.length; j++) {
                                listOutProduct.push(OrderEntryListAll[i].OutProductList[j]);

                            }
                        }

                    }
                    $("#femi-MRPException-tbody").html($com.util.template(listException, HTML.TableMRPExceptionMode));
                    $("#femi-MRPMaterial-tbody").html($com.util.template(listMaterial, HTML.TableMaterialMode));
                    $("#femi-MRPPurchase-tbody").html($com.util.template(listPurchase, HTML.TablePurchaseMode));
                    $("#femi-MRPProduct-tbody").html($com.util.template(listProduct, HTML.TableMRPProduct));
                    $("#femi-MRPOutProduct-tbody").html($com.util.template(listOutProduct, HTML.TableMRPOutProduct));
                }
            },


            postOrder: function (data, fn, context) {
                var d = {
                    $URI: "/MRP/MRPGenerate",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //订单详细信息
            getOrderItem: function (data, fn, context) {
                var d = {
                    $URI: "/CRMSaleOrder/CRMItemAll",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },


            getMRPOrderList: function (data, fn, context) {
                var d = {
                    $URI: "/MRP/MRPOrderAll",
                    $TYPE: "get"
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