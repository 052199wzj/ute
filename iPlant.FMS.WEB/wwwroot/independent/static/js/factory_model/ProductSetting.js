require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/paging', '../static/utils/js/base/materialSelect'], function ($zace, $com, $page, $materialSelect) {

    var KEYWORD_Level_LIST,
        KEYWORD_Level,
        FORMATTRT_Level,
        DEFAULT_VALUE_Level,
        TypeSource_Level,
        model,

        MaterialList,

        DataAll,
        DATABasic,
        DataAllConfirmBasic,
        DataAllConfirmChange,
        DataAllConfirm,
        DataAllSearch,
        DataAllFactorySearch,


        temp = false,

        HTML;
    DataAll = [];
    DATABasic = [];
    DataAllConfirmBasic = [];
    DataAllConfirmChange = [];
    DataAllConfirm = [];
    DataAllFactorySearch = DataAllSearch = [];
    PositionTemp = {
        Active: 0,
        Auditor: window.parent.User_Info.Name,
        AuditorID: 0,
        AuditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        BusinessUnitID: 0,
        BusinessUnit: "",
        CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Creator: window.parent.User_Info.Name,
        CreatorID: 0,
        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Editor: window.parent.User_Info.Name,
        EditorID: 0,
        ERPID: 0,
        ID: 0,
        ProductName: "",
        ProductNo: "",
        ProductCode: "",
        ProductType: "",
        ProductTypeID: 0,
        Length: 0,
        Status: 3,
        StatusText: "",
    };


    ;
    HTML = {
        TableMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td style="display:none" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',

            // '<td data-title="ProductCode" data-value="{{ProductCode}}" >{{ProductCode}}</td>',
            '<td data-title="ProductName" data-value="{{ProductName}}" >{{ProductName}}</td>',
            '<td data-title="ProductNo" data-value="{{ProductNo}}" >{{ProductNo}}</td>',

            // '<td data-title="Length" data-value="{{Length}}" >{{Length}}</td>',
            '<td data-title="ProductTypeID" data-value="{{ProductTypeID}}">{{ProductTypeID}}</td>',

            '<td data-title="MaterialName" data-value="{{MaterialName}}">{{MaterialName}}</td>',
            '<td data-title="MaterialNo" data-value="{{MaterialNo}}">{{MaterialNo}}</td>',

            '<td data-title="Creator" data-value="{{Creator}}" >{{Creator}}</td>',
            '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
            '<td data-title="Editor" data-value="{{Editor}}" >{{Editor}}</td>',
            '<td data-title="EditTime" data-value="{{EditTime}}" >{{EditTime}}</td>',
            '<td data-title="Active" data-value="{{Active}}" ><span class="badge lmvt-badge {{ClassBadge}}">{{Badge}}</span>{{Active}}</td>',
            '<td style="max-width: 80px" data-title="Handle" data-value="{{ID}}"><div class="row">',
            '<div class="col-md-4 {{ISAllowed}}">{{ISAllowedText}}</div>',
            '<div class="col-md-4 lmvt-do-info lmvt-reset">修改</div>',
            '<div class="col-md-4 lmvt-do-info lmvt-resetMa">物料绑定</div>',
            '</td>',
            '</tr>',
        ].join(""),
    },
        (function () {
            KEYWORD_Level_LIST = [
                "ProductName|名称",
                "ProductNo|型号",
                // "ProductCode|编码",
                "Length|长度(mm)",
                "BusinessUnitID|事业部|ArrayOneControl",
                "ProductTypeID|类型|ArrayOne",
                "TransportType|转运部件类型|ArrayOne",
                "Status|状态|ArrayOne",
                "CreateTime|时间|DateTime",
                "EditTime|时间|DateTime",
                "Active|状态|ArrayOne",
            ];
            KEYWORD_Level = {};
            FORMATTRT_Level = {};

            DEFAULT_VALUE_Level = {
                //Length: 0,
                ProductNo: "",
                ProductName: "",
                // ProductCode: "",
                ProductTypeID: 1,
                //ProductCode:"",         
            };

            TypeSource_Level = {
                Active: [{
                    name: "保存",
                    value: 0
                }, {
                    name: "启用",
                    value: 1
                }, {
                    name: "禁用",
                    value: 2
                }],
                BusinessUnitID: [{
                    name: "无",
                    value: 0,
                    far: 0
                }],
                ProductTypeID: [

                ],
                TransportType: [

                    {
                        name: "整车",
                        value: 1
                    },
                    {
                        name: "车体",
                        value: 2
                    },
                    {
                        name: "转向架",
                        value: 3
                    },
                    {
                        name: "假台车",
                        value: 4
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
        name: '产品类型',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            $("body").delegate("#zace-refresh-po", "click", function () {
                model.com.refresh();
            });

            //查看产品类型
            $("body").delegate("#lmvt-product-type", "click", function () {

                var vdata = { 'header': '产品类型', 'href': './factory_model/ProductType.html', 'id': 'ProductType', 'src': '/MESCore/upload/web/产品类型.svg' };
                window.parent.iframeHeaderSet(vdata);
                window.callFunctionTrigger("ProductType");

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
                        DataAllproduct = [];
                    for (var i = 0; i < DataAllFactorySearch.length; i++) {
                        if (DataAllFactorySearch[i].Active == "启用") {
                            DataAllproduct.push(DataAllFactorySearch[i]);
                        }
                    }
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllproduct, value, "ID");
                }
            });
            //产品规格查询
            $("body").delegate("#zace-searchAll", "click", function () {
                var value = $("#zace-search-level").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    DataAllproduct = [];
                for (var i = 0; i < DataAllFactorySearch.length; i++) {
                    if (DataAllFactorySearch[i].Active == "启用") {
                        DataAllproduct.push(DataAllFactorySearch[i]);
                    }
                }
                $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllproduct, value, "ID");
            });
            //产品规格修改单条
            $("body").delegate(".lmvt-reset", "click", function () {


                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DataAll.filter((item) => { return item.ID == wID });

                // var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                // if (!SelectData || !SelectData.length) {
                //     alert("请先选择一行数据再试！")
                //     return;
                // }
                // if (SelectData.length != 1) {
                //     alert("只能同时对一行数据修改！")
                //     return;
                // }
                // //if (SelectData[0].Status != 1) {
                // //    alert("数据选择有误！")
                // //    return;
                // //}
                var default_value = {
                    // Length: SelectData[0].Length,
                    ProductName: SelectData[0].ProductName,
                    ProductNo: SelectData[0].ProductNo,
                    ProductCode: SelectData[0].ProductCode,
                    ProductTypeID: SelectData[0].ProductTypeID,
                };

                // var _TypeSource_LevelTemp = $com.util.Clone(TypeSource_Level);
                // _TypeSource_LevelTemp.TransportType = [{
                //     name: "整车",
                //     value: 1
                // }, {
                //     name: "假台车",
                //     value: 4
                // }];
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].ProductName = rst.ProductName;
                    SelectData[0].ProductNo = rst.ProductNo;
                    SelectData[0].ProductCode = rst.ProductCode;
                    //SelectData[0].Length = rst.Length;
                    SelectData[0].ProductTypeID = Number(rst.ProductTypeID);
                    $com.util.deleteLowerProperty(SelectData);
                    model.com.postFPCProduct({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                    })

                }, TypeSource_Level));
            });

            //物料绑定
            $("body").delegate(".lmvt-resetMa", "click", function () {

                if (!temp) {
                    alert("物料数据加载中，请稍等");
                    return;
                }

                var $this = $(this);
                var WID = Number($this.closest("td").attr("data-value"));

                var SelectData = DataAll.filter((item) => { return item.ID == WID });

                // if (SelectData[0].Active > 0) {
                //     alert("已经使用，不允许修改");
                //     return false;
                // }

                $materialSelect.init(MaterialList, function (res) {

                    if (typeof (res) != "undefined") {

                        SelectData[0].MaterialID = res.ID;
                        SelectData[0].MaterialNo = res.MaterialNo;
                        SelectData[0].MaterialName = res.MaterialName;

                        $com.util.deleteLowerProperty(SelectData);

                        model.com.postFPCProduct({
                            data: SelectData[0],
                        }, function (res) {
                            alert("修改成功");
                            model.com.refresh();
                        })
                    }
                });



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
                    Length: SelectData[0].Length,
                    // ProductNo: SelectData[0].ProductNo,
                    // TransportType: SelectData[0].TransportType,
                };

                var _TypeSource_LevelTemp = $com.util.Clone(TypeSource_Level);

                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    // SelectData[0].ProductName = rst.ProductNo;
                    // SelectData[0].ProductNo = rst.ProductNo;
                    // SelectData[0].ProductCode = rst.ProductNo;
                    //SelectData[0].Length = rst.Length;
                    // SelectData[0].TransportType = Number(rst.TransportType);
                    for (var i = 0; i < SelectData.length; i++) {

                        $com.util.deleteLowerProperty(SelectData[i]);
                    }
                    model.com.postFPCProduct({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();


                    })

                }, _TypeSource_LevelTemp));


            });

            //产品规格启用 单条
            $("body").delegate(".lmvt-do-active", "click", function () {
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DataAll.filter((item) => { return item.ID == wID });

                if (SelectData[0].MaterialID <= 0) {
                    alert("该型号必须绑定物料才能启用,请绑定物料");
                    return false;
                }

                $com.util.deleteLowerProperty(SelectData);

                model.com.activeAudit({
                    data: SelectData,
                    Active: 1,
                }, function (res) {
                    alert("启用成功");
                    model.com.refresh();
                })
            });
            //产品规格启用
            $("body").delegate("#zace-active-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }



                $com.util.deleteLowerProperty(SelectData);
                model.com.activeAudit({
                    data: SelectData,
                    Active: 1,
                }, function (res) {
                    alert("启用成功");
                    model.com.refresh();


                })




            });

            //产品规格启用 单条
            $("body").delegate(".lmvt-do-forbidden", "click", function () {
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DataAll.filter((item) => { return item.ID == wID });

                // if (SelectData[0].MaterialID <= 0) {
                //     alert("该型号必须绑定物料才能启用,请绑定物料");
                //     return false;
                // }

                $com.util.deleteLowerProperty(SelectData);
                model.com.activeAudit({
                    data: SelectData,
                    Active: 2,
                }, function (res) {
                    alert("禁用成功");
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

                var _TypeSource_LevelTemp = $com.util.Clone(TypeSource_Level);
                // _TypeSource_LevelTemp.TransportType = [{
                //     name: "整车",
                //     value: 1
                // }, {
                //     name: "假台车",
                //     value: 4
                // }];
                $("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    PositionTemp.ProductName = rst.ProductName;
                    PositionTemp.ProductNo = rst.ProductNo;
                    PositionTemp.ProductCode = rst.ProductCode;
                    //PositionTemp.Length = rst.Length;
                    PositionTemp.ProductTypeID = Number(rst.ProductTypeID);

                    model.com.postFPCProduct({
                        data: PositionTemp,
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                    })

                }, _TypeSource_LevelTemp));


            });

        },




        run: function () {



            model.com.getFPCProductType({ BusinessUnitID: 0 }, function (resP) {
                $.each(resP.list, function (i, item) {
                    TypeSource_Level.ProductTypeID.push({
                        name: item.Name,
                        value: item.ID,
                    });
                });

                model.com.refresh();
                $com.app.loaded();


                model.com.getMaterialList({ material_no: "", material_name: "", type_id: 0, status: 0 }, function (resW) {
                    if (!resW)
                        return;
                    if (resW && resW.list) {

                        MaterialList = resW.list;

                        temp = true;

                    }

                });

            });






        },

        com: {
            //获取物料号列表
            getMaterialList: function (data, fn, context) {
                var d = {
                    $URI: "/Material/All",
                    $TYPE: "get"
                };

                function err() {

                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            refresh: function () {
                $com.app.loading('数据加载中...');
                model.com.getFPCProduct({ ProductTypeID: 0, BusinessUnitID: 0 }, function (resP) {
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

                            item.Badge = " ";

                            if (item.Active == 1) {
                                item.ISAllowedText = "禁用";
                                item.ISAllowed = "lmvt-do-forbidden";
                                item.ClassBadge = "lmvt-activeBadge";

                            } else if (item.Active == 2) {
                                item.ISAllowedText = "启用";
                                item.ISAllowed = "lmvt-do-active";
                                item.ClassBadge = "lmvt-forbiddenBadge";
                            } else {
                                item.ISAllowedText = "启用";
                                item.ISAllowed = "lmvt-do-active";
                                item.ClassBadge = "lmvt-defBadge";
                            }

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
            postFPCProduct: function (data, fn, context) {
                var d = {
                    $URI: "/FPCProduct/Update",
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
                    $URI: "/FPCProduct/Active",
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