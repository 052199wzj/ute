require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/paging'], function ($zace, $com, $page) {

    var KEYWORD_Level_LIST,
        KEYWORD_Level,
        FORMATTRT_Level,
        DEFAULT_VALUE_Level,
        TypeSource_Level,
        model,
        StartTime,
        EndTime,
        DataAll,
        DATABasic,
        mConfigEdite,
        DataAllConfirmBasic,
        DataAllConfirmChange,
        DataAllConfirm,
        DataAllSearch,
        DataAllFactorySearch,
        mConfig,
        HTML;
    DataAll = [];
    DATABasic = [];
    zaceSelectData = [];
    DataAllConfirmBasic = [];
    DataAllConfirmChange = [];
    DataAllConfirm = [];
    DataAllFactorySearch = DataAllSearch = [];
    PositionTemp = {
        ID: 0,
        Code: "",
        LineID: "",
        ProductNo: "",
        CustomerID: 0,
        MaterialID: 0,
        UnitID: 0,
        EditorID: 0,
        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Type: 4,
        Number: 4,
        SupplierName: "",
        SupplierProductNo: "",
        SupplierPartNo: "",
        OrderID: 0,
        OrderNo: "",
        Status: 1,
        AuditorID: 0,
        AuditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Certificate: 0,
        Record: 0,
        QRCode: 0,
        Active: 0,
    };

    HTML = {
        TableMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td style="display:none" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            //'<td data-title="ProductName" data-value="{{ProductName}}" >{{ProductName}}</td>',
            '<td data-title="Code" data-value="{{Code}}" >{{Code}}</td>',
            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
            '<td data-title="LineID" data-value="{{LineID}}" >{{LineID}}</td>',
            '<td data-title="ProductNo" data-value="{{ProductNo}}" >{{ProductNo}}</td>',
            '<td data-title="CustomerID" data-value="{{CustomerID}}" >{{CustomerID}}</td>',
            // '<td data-title="MaterialID" data-value="{{MaterialID}}" >{{MaterialID}}</td>',
            // '<td data-title="UnitID" data-value="{{UnitID}}" >{{UnitID}}</td>',
            '<td data-title="EditorID" data-value="{{EditorID}}" >{{EditorID}}</td>',
            '<td data-title="EditTime" data-value="{{EditTime}}" >{{EditTime}}</td>',
            '<td data-title="SupplierName" data-value="{{SupplierName}}" >{{SupplierName}}</td>',
            '<td data-title="SupplierProductNo" data-value="{{SupplierProductNo}}" >{{SupplierProductNo}}</td>',
            '<td data-title="SupplierPartNo" data-value="{{SupplierPartNo}}" >{{SupplierPartNo}}</td>',
            // '<td data-title="OrderNo" data-value="{{OrderNo}}" >{{OrderNo}}</td>',
            // '<td data-title="AuditorID" data-value="{{AuditorID}}" >{{AuditorID}}</td>',
            // '<td data-title="AuditTime" data-value="{{AuditTime}}" >{{AuditTime}}</td>',
            '<td data-title="Certificate" data-value="{{Certificate}}" >{{Certificate}}</td>',
            '<td data-title="Record" data-value="{{Record}}" >{{Record}}</td>',
            '<td data-title="QRCode" data-value="{{QRCode}}" >{{QRCode}}</td>',
            // '<td data-title="Active" data-value="{{Active}}" >{{Active}}</td>',
            '</tr>',
        ].join(""),

        TableModeItem: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td style="display:none" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            //'<td data-title="ProductName" data-value="{{ProductName}}" >{{ProductName}}</td>',
            '<td data-title="Code" data-value="{{Code}}" >{{Code}}</td>',
            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',

            '<td data-title="SupplierName" data-value="{{SupplierName}}" >{{SupplierName}}</td>',
            '<td data-title="SupplierProductNo" data-value="{{SupplierProductNo}}" >{{SupplierProductNo}}</td>',
            '<td data-title="SupplierPartNo" data-value="{{SupplierPartNo}}" >{{SupplierPartNo}}</td>',

            '<td data-title="Certificate" data-value="{{Certificate}}" >{{Certificate}}</td>',
            '<td data-title="Record" data-value="{{Record}}" >{{Record}}</td>',
            '<td data-title="QRCode" data-value="{{QRCode}}" >{{QRCode}}</td>',
            // '<td data-title="Active" data-value="{{Active}}" >{{Active}}</td>',
            '</tr>',
        ].join(""),



    },
        (function () {
            KEYWORD_Level_LIST = [
                "Config|部件清单|ArrayOne",
                "CodeID|部件类型|ArrayOne",
                "Code|编码",
                "Name|名称",
                "OrderID|车号|ArrayOne",
                "LineID|修程|ArrayOne",
                "ProductNo|车号|ArrayOne",
                "CustomerID|配属局段|ArrayOne",
                "MaterialID|物料|ArrayOne",
                "UnitID|单位|ArrayOne",
                "EditTime|时间|DateTime",
                "Active|状态|ArrayOne",
                "SupplierName|部件厂家",
                "SupplierProductNo|部件型号",
                "SupplierPartNo|部件编号",
                "Certificate|是否有合格证|ArrayOne",
                "Record|电子履历|ArrayOne",
                "QRCode|是否有二维码|ArrayOne",
                "Status|状态|ArrayOne",
                "StartTime|开始日期|Date",
                "EndTime|结束日期|Date",
                "EditTime|编辑时间|DateTime",
                "AuditTime|审批时间|DateTime",
                "AuditorID|审批人|ArrayOne",
                "EditorID|编辑人|ArrayOne",
                "ConfigID|部件编码|ArrayOne"
            ];

            KEYWORD_Level = {};
            FORMATTRT_Level = {};

            DEFAULT_VALUE_Level = {
                LineID: 0,
                //  ProductNo: "",
                CustomerID: 0,
                // MaterialID: 0,
                // UnitID: 0,
            };

            TypeSource_Level = {
                ConfigID: [ {
                    name: "-",
                    value: 0
                },],
                OrderID: [],
                CodeID: [],
                Active: [
                    {
                        name: "未使用",
                        value: 0
                    }, {
                        name: "启用",
                        value: 1
                    }, {
                        name: "禁用",
                        value: 2
                    }

                ],
                Certificate: [
                    {
                        name: "否",
                        value: 0
                    }, {
                        name: "是",
                        value: 1
                    }
                ],
                Record: [
                    {
                        name: "否",
                        value: 0
                    }, {
                        name: "是",
                        value: 1
                    }
                ],
                QRCode: [
                    {
                        name: "否",
                        value: 0
                    }, {
                        name: "是",
                        value: 1
                    }
                ],
                Config: [
                ],
                LineID: [

                ],
                CustomerID: [
                    {
                        name: "无",
                        value: 0
                    },
                ],
                MaterialID: [
                    {
                        name: "无",
                        value: 0
                    },
                ],
                UnitID: [
                    {
                        name: "无",
                        value: 0
                    },
                ],
                EditorID: [
                    {
                        name: "无",
                        value: 0
                    },
                ],
                AuditorID: [
                    {
                        name: "无",
                        value: 0
                    },
                ],
                ProductNo: [

                ],
                Status: [
                    {
                        name: "已保存",
                        value: 1
                    },
                    {
                        name: "已提交",
                        value: 2
                    },
                    {
                        name: "已审批",
                        value: 3
                    },
                    {
                        name: "已驳回",
                        value: 4
                    },
                    {
                        name: "已取消",
                        value: 5
                    },
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
        name: '台车部件表',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            //导出
            $("body").delegate("#zace-export-active", "click", function () {
                var $table = $(".table-partCar>table"),
                    fileName ="台车部件.xls",
                    Title = "台车部件";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });

            });

            //部件表查询
            $("body").delegate("#zace-searchAllItem", "click", function () {
                var value = $("#zace-search-levelItem").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevelItem-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevelItem-tbody"), DataAllFactorySearchItem, value, "ID");
            });


            window.setFunctionTrigger("componentCar", function (res) {

                mOrderID = res.ID;
                mOrderName = res.Name;

                mPartNo = res.PartNo;


                mOrderName = mOrderName + '#' + mPartNo;
                $('.zaceTitle').text('(' + mOrderName + ')' + '台车部件表');
                model.com.loadZace();

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
                    $com.table.filterByConndition($("#femi-riskLevel-tbody"), DataAll, default_value, "WID");

                }, TypeSource_Level));




            });
            //Enter触发模糊查询事件
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var value = $("#zace-search-level").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-riskLevel-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "WID");
                }
            });
            //部件表查询
            $("body").delegate("#zace-searchAll", "click", function () {
                var value = $("#zace-search-level").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "WID");
            });

            $("body").delegate("#zace-edit-confirmReturn", "click", function () {


                $(".zzza").show();
                $(".zzza").css("margin-right", "0px");
                $(".zzzCopy").css("width", "0px");
                $(".zzzCopy").hide();

                $('.zaceWidth').css('min-width', '1000px');

            });


            //部件表修改
            $("body").delegate("#zace-edit-level", "click", function () {
                zaceSelectData = [];
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "WID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                // if (SelectData[0].Status != 0) {
                //     alert("请选择未使用数据！")
                //     return;
                // }

                $com.util.deleteLowerProperty(SelectData[0]);


                zaceSelectData = SelectData;


                $(".zzza").show();
                $(".zzza").css("margin-right", "600px");
                $(".zzzCopy").css("width", "600px");
                $(".zzzCopy").show();

                $('.zaceWidth').css('min-width', '1500px');


                $('#zace-edit-confirmOKReplace').hide();
                $('#zace-edit-confirmOKEdit').show();

                $com.app.loading('数据加载中...');
                model.com.getUnUsed({

                    OrderID: mOrderID, LineID: orderObj.LineID, ProductNo: orderObj.ProductNo, PartItemNo: SelectData[0].Code

                }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var Grade = $com.util.Clone(resP.list);
                        DATABasicItem = $com.util.Clone(resP.list);

                        DataAllConfirmItem = $com.util.Clone(resP.list);
                        for (var i = 0; i < Grade.length; i++) {
                            Grade[i].WID = i + 1;
                        }
                        DataAllItem = $com.util.Clone(Grade);

                        $.each(Grade, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }
                            // item.AuditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.AuditTimeAuditTime);
                        });
                        DataAllFactorySearchItem = $com.util.Clone(Grade);

                        $("#femi-riskLevelItem-tbody").html($com.util.template(Grade, HTML.TableModeItem));
                        $com.app.loaded();





                    }

                });


            });
            $("body").delegate("#zace-edit-confirmOKEdit", "click", function () {

                var SelectDataItem = $com.table.getSelectionData($("#femi-riskLevelItem-tbody"), "ID", DataAllItem);

                if (!SelectDataItem || !SelectDataItem.length) {
                    alert("请先选择一行数据再试！");
                    return;
                }
                if (SelectDataItem.length != 1) {
                    alert("只能选择一行数据修改！");
                    return;

                }

                // zaceSelectData[0].Code = SelectDataItem[0].Code;
                // zaceSelectData[0].Name = SelectDataItem[0].Name;
                // zaceSelectData[0].SupplierName = SelectDataItem[0].SupplierName;
                // zaceSelectData[0].SupplierProductNo = SelectDataItem[0].SupplierProductNo;
                // zaceSelectData[0].SupplierPartNo = SelectDataItem[0].SupplierPartNo;
                // zaceSelectData[0].Certificate = Number(SelectDataItem[0].Certificate);
                // zaceSelectData[0].Record = Number(SelectDataItem[0].Record);
                // zaceSelectData[0].QRCode = Number(SelectDataItem[0].QRCode);



                SelectDataItem[0].PartNo = orderObj.PartNo;
                SelectDataItem[0].OrderID = mOrderID;
                SelectDataItem[0].OrderNo = orderObj.OrderNo;
                SelectDataItem[0].LineID = orderObj.LineID;
                SelectDataItem[0].ProductNo = orderObj.ProductNo;
                SelectDataItem[0].CustomerID = orderObj.BureauSectionID;



                model.com.UpdateItem({
                    data: SelectDataItem,
                    ID: zaceSelectData[0].ID
                }, function (res) {
                    alert("修改成功");

                    $('#zace-edit-confirmReturn').click();
                    model.com.refresh();
                });
            });


            //部件替换
            $("body").delegate("#zace-edit-confirmReplace", "click", function () {
                zaceSelectData = [];
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "WID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据替换！")
                    return;
                }
                // if (SelectData[0].Status != 0) {
                //     alert("请选择未使用数据！")
                //     return;
                // }

                $com.util.deleteLowerProperty(SelectData[0]);


                zaceSelectData = SelectData;


                $(".zzza").show();
                $(".zzza").css("margin-right", "600px");
                $(".zzzCopy").css("width", "600px");
                $(".zzzCopy").show();

                $('.zaceWidth').css('min-width', '1500px');


                $('#zace-edit-confirmOKReplace').show();
                $('#zace-edit-confirmOKEdit').hide();

                $com.app.loading('数据加载中...');
                model.com.getUnUsed({

                    OrderID: mOrderID, LineID: orderObj.LineID, ProductNo: orderObj.ProductNo, PartItemNo: SelectData[0].Code

                }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var Grade = $com.util.Clone(resP.list);
                        DATABasicItem = $com.util.Clone(resP.list);

                        DataAllConfirmItem = $com.util.Clone(resP.list);
                        for (var i = 0; i < Grade.length; i++) {
                            Grade[i].WID = i + 1;
                        }
                        DataAllItem = $com.util.Clone(Grade);

                        $.each(Grade, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }
                            // item.AuditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.AuditTimeAuditTime);
                        });
                        DataAllFactorySearchItem = $com.util.Clone(Grade);

                        $("#femi-riskLevelItem-tbody").html($com.util.template(Grade, HTML.TableModeItem));
                        $com.app.loaded();





                    }

                });


            });
            $("body").delegate("#zace-edit-confirmOKReplace", "click", function () {

                var SelectDataItem = $com.table.getSelectionData($("#femi-riskLevelItem-tbody"), "ID", DataAllItem);

                if (!SelectDataItem || !SelectDataItem.length) {
                    alert("请先选择一行数据再试！");
                    return;
                }
                if (SelectDataItem.length != 1) {
                    alert("只能选择一行数据替换！");
                    return;

                }

                // zaceSelectData[0].Code = SelectDataItem[0].Code;
                // zaceSelectData[0].Name = SelectDataItem[0].Name;
                // zaceSelectData[0].SupplierName = SelectDataItem[0].SupplierName;
                // zaceSelectData[0].SupplierProductNo = SelectDataItem[0].SupplierProductNo;
                // zaceSelectData[0].SupplierPartNo = SelectDataItem[0].SupplierPartNo;
                // zaceSelectData[0].Certificate = Number(SelectDataItem[0].Certificate);
                // zaceSelectData[0].Record = Number(SelectDataItem[0].Record);
                // zaceSelectData[0].QRCode = Number(SelectDataItem[0].QRCode);



                SelectDataItem[0].PartNo = orderObj.PartNo;
                SelectDataItem[0].OrderID = mOrderID;
                SelectDataItem[0].OrderNo = orderObj.OrderNo;
                SelectDataItem[0].LineID = orderObj.LineID;
                SelectDataItem[0].ProductNo = orderObj.ProductNo;
                SelectDataItem[0].CustomerID = orderObj.BureauSectionID;



                model.com.UpdateItem({
                    data: SelectDataItem,
                    ID: zaceSelectData[0].ID,
                    IsReplace: 1

                }, function (res) {
                    alert("替换成功");

                    $('#zace-edit-confirmReturn').click();
                    model.com.refresh();
                });
            })

            //条件查询
            $("body").delegate("#zace-Device-searchface", "click", function () {
                mDefault_Value_Modal = {
                    "StartTime": "",
                    "EndTime": "",
                };
                $("body").append($com.modal.show(mDefault_Value_Modal, KEYWORD_Level, "查询", function (rst) {
                    if (!rst || $.isEmptyObject(rst)) {
                        return false;
                    }
                    StartTime = $com.util.format("yyyy-MM-dd", rst.StartTime);
                    EndTime = $com.util.format("yyyy-MM-dd", rst.EndTime);
                    model.com.refresh();

                }, TypeSource_Level));
            });
            //部件表提交
            $("body").delegate("#zace-edit-active", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "WID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                // if (SelectData.length != 1) {
                //     alert("只能同时对一行数据修改！")
                //     return;
                // }
                // if (SelectData[0].Status != 1) {
                //     alert("请选择已保存数据！")
                //     return;
                // }
                // if (SelectData[0].Status == 1) {
                //     SelectData[0].Status = 2;
                // }
                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }

                model.com.ActiveItem({
                    data: SelectData,
                    Active: 1
                }, function (res) {
                    alert("启用成功");
                    model.com.refresh();
                })

            });
            //部件表取消
            $("body").delegate("#zace-edit-disactive", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "WID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }

                model.com.ActiveItem({
                    data: SelectData,
                    Active: 0
                }, function (res) {
                    alert("禁用成功");
                    model.com.refresh();
                })

            });

            //部件表删除
            $("body").delegate("#zace-edit-delete", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "WID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！");
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作");
                    return;
                }
                if (SelectData[0].Status != 0) {
                    alert("请选择未使用数据！")
                    return;
                }
                $com.util.deleteLowerProperty(SelectData[0]);
                model.com.DeleteItem({
                    data: SelectData[0],
                }, function (res) {
                    alert("删除成功");
                    model.com.refresh();
                })

            });
        },




        run: function () {
            CodeAllObj={};
            mOrderID = Number(model.query.id);

            mOrderName = model.query.name;

            mPartNo = model.query.PartNo;


            mOrderName = mOrderName + '#' + mPartNo;

            $('.zaceTitle').text('(' + mOrderName + ')' + '台车部件表');
            StartTime = $com.util.format("yyyy-MM-dd", new Date().getTime() - 30 * 24 * 3600 * 1000);
            EndTime = $com.util.format("yyyy-MM-dd", new Date().getTime() + 24 * 3600 * 1000);

            model.com.loadZace();






        },

        com: {
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
            loadZace: function () {
                $com.app.loading('数据加载中...');
                //获取物料
                //获取修程
                model.com.getFMCLine({ FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0 }, function (resL) {
                    //TypeSource_Level.AuditorID.splice(1, TypeSource_Level.AuditorID.length - 1);
                    $.each(resL.list, function (i, item) {
                        TypeSource_Level.LineID.push({
                            name: item.Name,
                            value: item.ID,
                            far: 0
                        });
                    });
                    //单位列表
                    model.com.getMeteringSettingprice({}, function (resPrice) {
                        $.each(resPrice.list, function (i, item) {
                            TypeSource_Level.UnitID.push({
                                name: item.Name,
                                value: item.ID,
                                far: 0
                            })
                        });
                        //局段列表
                        model.com.getCustomer({ active: 2 }, function (resC) {
                            $.each(resC.list, function (i, item) {
                                TypeSource_Level.CustomerID.push({
                                    name: item.CustomerName,
                                    value: item.ID,
                                    far: 0
                                })
                            });
                            //查询车号 ProductNo
                            model.com.getFPCProduct({ ProductTypeID: 0, BusinessUnitID: 0 }, function (resP) {
                                $.each(resP.list, function (i, item) {
                                    TypeSource_Level.ProductNo.push({
                                        name: item.ProductName,
                                        value: item.ProductName,
                                        far: 0
                                    })
                                });
                            });
                            //查询部件库
                            model.com.getConfigAll({ ID: -1, PartConfigNo: "", PartConfigName: "", Active: -1 }, function (resConfig) {
                                mConfig = $com.util.Clone(resConfig.list);
                                mConfigEdite = $com.util.Clone(resConfig.list);
                                $.each(resConfig.list, function (i, item) {

                                    if (item.Active == 1) {
                                        TypeSource_Level.Config.push({
                                            name: item.Name,
                                            value: item.Name,
                                            far: 0
                                        })
                                    }

                                });
                                model.com.getUser({ active: -1 }, function (res) {
                                    $.each(res.list, function (i, item) {
                                        TypeSource_Level.AuditorID.push({
                                            name: item.Name,
                                            value: item.ID,
                                            far: 0
                                        })
                                    });
                                    $.each(res.list, function (i, item) {
                                        TypeSource_Level.EditorID.push({
                                            name: item.Name,
                                            value: item.ID,
                                            far: 0
                                        })
                                    });


                                    model.com.getOMSOrderStatus({ ID: mOrderID }, function (res) {
                                        orderObj = res.info;
                                        // $.each(res.list, function (i, item) {

                                        //     orderObj[item.ID] = item;
                                        //     TypeSource_Level.OrderID.push({
                                        //         name: item.PartNo,
                                        //         value: item.ID,
                                        //         far: 0
                                        //     })
                                        // });

                                        model.com.getTypeAll({}, function (resP) {

                                            TypeObj = {};
                                            TypeSource_Level.CodeID = [];
                                            $.each(resP.list, function (i, item) {
                                                TypeObj[item.ID] = item;
                                                if (item.Active == 1) {
                                                    TypeSource_Level.CodeID.push({
                                                        name: item.Name,
                                                        value: item.ID,
                                                        far: 0
                                                    })
                                                }

                                            });
                                            model.com.getConfigAll({ PartConfigNo: "", PartConfigName: "", Active: -1, ProductNo: "", CustomerID: -1, LineID: -1 }, function (resP) {

                                                $.each(resP.list, function (i, item) {
                                                    CodeAllObj[item.ID] = item;
                                                    TypeSource_Level.ConfigID.push({
                                                        name: item.Name + '【' + item.Code + '】',
                                                        value: item.ID,
                                                    });
                                                });

                                                model.com.refresh();
                                            });
                                           
                                        });
                                    });
                                });

                            });

                        });
                    });

                });
            },
             //查询部件清单
             getConfigAll: function (data, fn, context) {
                var d = {
                    $URI: "/MSSPart/ConfigAll",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询部件类型
            getTypeAll: function (data, fn, context) {
                var d = {
                    $URI: "/MSSPart/TypeAll",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            refresh: function () {
                $com.app.loading('数据加载中...');
                mLineID = orderObj.LineID;
                mProductNo = orderObj.ProductNo;
                mCustomerID = orderObj.BureauSectionID;

                model.com.getItemAll({
                    CustomerID: mCustomerID, LineID: mLineID, OrderID: mOrderID, ProductNo: mProductNo
                }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var Grade = $com.util.Clone(resP.list);
                        DATABasic = $com.util.Clone(resP.list);

                        DataAllConfirm = $com.util.Clone(resP.list);
                        for (var i = 0; i < Grade.length; i++) {
                            Grade[i].WID = i + 1;

                            Grade[i].Code = CodeAllObj[Grade[i].ConfigID].Code;
                        }
                        DataAll = $com.util.Clone(Grade);

                        $.each(Grade, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }
                            // item.AuditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.AuditTimeAuditTime);
                        });
                        DataAllFactorySearch = $com.util.Clone(Grade);

                        $("#femi-riskLevel-tbody").html($com.util.template(Grade, HTML.TableMode));
                        $com.app.loaded();


                    }

                });
            },
            getConfigAll: function (data, fn, context) {
                var d = {
                    $URI: "/MSSPart/ConfigAll",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //zaceItem
            getUnUsed: function (data, fn, context) {
                var d = {
                    $URI: "/MSSPart/UnUsedItemAll",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },



            //MESAPS/OMSOrder/StatusAll/   StatusList     
            getOMSOrderStatus: function (data, fn, context) {
                var d = {
                    $URI: "/OMSOrder/Info",
                    $TYPE: "get",
                    $SERVER: '/MESAPS'
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询部件库
            getConfigAll: function (data, fn, context) {
                var d = {
                    $URI: "/MSSPart/ConfigAll",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询部件----表
            getItemAll: function (data, fn, context) {
                var d = {
                    $URI: "/MSSPart/PartItemAll",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询部件表单条
            ItemInfo: function (data, fn, context) {
                var d = {
                    $URI: "/MSSPart/ItemInfo",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //部件表
            UpdateItem: function (data, fn, context) {
                var d = {
                    $URI: "/MSSPart/UseItem",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            ActiveItem: function (data, fn, context) {
                var d = {
                    $URI: "/MSSPart/ActiveItem",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //删除部件表
            DeleteItem: function (data, fn, context) {
                var d = {
                    $URI: "/MSSPart/DeleteItem",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //查询修程
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
            //局段列表
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
            //单位列表
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
            //车型查询
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
            getUser: function (data, fn, context) {
                var d = {
                    $URI: "/User/All",
                    $TYPE: "get",

                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
        }
    }),

        model.init();


});