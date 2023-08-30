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
        BusinessUnitID,
        FactoryID,
        WorkShopID,
        HTML;
    WorkShopID = BusinessUnitID = FactoryID = 0;
    DataAll = [];
    DATABasic = [];
    DataAllConfirmBasic = [];
    DataAllConfirmChange = [];
    DataAllConfirm = [];
    DataAllFactorySearch = DataAllSearch = [];
    PositionTemp = {
        Active: 1,
        Auditor: window.parent.User_Info.Name,
        AuditorID: 0,
        AuditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        BusinessUnitID: 0,
        BusinessUnit: "",
        Code: "",
        CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Creator: window.parent.User_Info.Name,
        CreatorID: 0,
        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Editor: window.parent.User_Info.Name,
        EditorID: 0,
        ERPID: 0,
        Factory: "",
        FactoryID: 1,
        ID: 0,
        Name: "",
        ProductType: "",
        ProductTypeID: 0,
        Status: 3,
        StatusText: "",
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
            '<td data-title="Creator" data-value="{{Creator}}" >{{Creator}}</td>',
            '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
            '<td data-title="Editor" data-value="{{Editor}}" >{{Editor}}</td>',
            '<td data-title="EditTime" data-value="{{EditTime}}" >{{EditTime}}</td>',
            '<td data-title="Active" data-value="{{Active}}" >{{Active}}</td>',

            '</tr>',
        ].join(""),
        TableLineMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
            '<td data-title="Code" data-value="{{Code}}" >{{Code}}</td>',
            '<td data-title="WorkShop" data-value="{{WorkShop}}" >{{WorkShop}}</td>',

            '</tr>',
        ].join(""),


    },
        (function () {
            KEYWORD_Level_LIST = [
                "Name|名称",
                "Code|编码",
                "BusinessUnitID|事业部|ArrayOneControl",
                "FactoryID|工厂名|ArrayOne",
                "ProductTypeID|产品类型|ArrayOneControl|BusinessUnitID",
                "Status|状态|ArrayOne",
                "Active|启用|ArrayOne",
                "CreateTime|时间|DateTime",
                "EditTime|时间|DateTime",
            ];
            KEYWORD_Level = {};
            FORMATTRT_Level = {};

            DEFAULT_VALUE_Level = {
                Name: "",
                Code: "",
            };

            TypeSource_Level = {
                Active: [
                    {
                        name: "启用",
                        value: 1
                    }, {
                        name: "禁用",
                        value: 0
                    }
                ],
                BusinessUnitID: [
                    {
                        name: "无",
                        value: 0,
                        far: 0
                    }
                ],
                ProductTypeID: [
                    {
                        name: "无",
                        value: 0,
                        far: 0
                    }
                ],
                FactoryID: [
                    {
                        name: "无",
                        value: 0,
                        far: 0
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
                    },],



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
        name: '预检报告',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            $("body").delegate("#zace-refresh-po", "click", function () {

                model.com.refresh();


            });
            //导出 
            $("body").delegate("#zace-exportApproval-level", "click", function () {
                var $table = $(".table-partApproval"),
                    fileName = "工位配置.xls",
                    Title = "工位配置";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });



            });
            //导出 
            $("body").delegate("#zace-exportAll-level", "click", function () {
                var $table = $(".table-partAll"),
                    fileName = "工位配置.xls",
                    Title = "工位配置";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });



            });
            //导出 
            $("body").delegate("#zace-exportAudit-level", "click", function () {
                var $table = $(".table-partAudit"),
                    fileName = "工位配置.xls",
                    Title = "工位配置";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });



            });

            //工序库修改
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

                var default_value = {
                    Name: SelectData[0].Name,
                    Code: SelectData[0].Code,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].Name = rst.Name;
                    SelectData[0].Code = rst.Code;

                    for (var i = 0; i < SelectData.length; i++) {

                        $com.util.deleteLowerProperty(SelectData[i]);
                    }

                    model.com.postFPCPart({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                        //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                        //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    })

                }, TypeSource_Level));


            });


            $("body").delegate("#zace-closeLine-level", "click", function () {

                $(".zzzb").hide();
                $(".zzza").css("margin-right", "0px");
                $(".zzzc").css("width", "0px");
                $(".zzzc").hide();

            });



            //工序库启用
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
                    alert("启用成功");
                    model.com.refresh();


                })




            });
            //工序库禁用
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

            //工序库新增
            $("body").delegate("#zace-add-level", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    PositionTemp.Name = rst.Name;
                    PositionTemp.Code = rst.Code;

                    model.com.postFPCPart({
                        data: PositionTemp,
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                    })

                }, TypeSource_Level));


            });

            //申请 条件查询
            $("body").delegate("#zace-searchZall-level", "click", function () {
                var default_value = {
                    Active: 0,

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
                    var
                        value = $("#zace-search-level").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-riskLevel-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "ID");
                }
            });
            //我的申请  工序库查询
            $("body").delegate("#zace-searchZall-levelZace", "click", function () {

                var
                    value = $("#zace-search-level").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "ID");



            });

            //我的审批  工序库查询
            $("body").delegate("#zace-search-returnApproval", "input", function () {

                var $this = $(this),
                    value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevelAudit-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevelAudit-tbody"), DataAllSearch, value, "ID");

            });
        },




        run: function () {

            model.com.refresh();

        },

        com: {
            setMMM: function () {
                setTimeout(function () {
                    if (window.parent._zaceProductType && window.parent._zaceProductType == 1) {
                        model.com.getFPCProductType({ BusinessUnitID: 0 }, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {

                                //TypeSource_materialRecord.SupplierID = [];
                                TypeSource_Level.ProductTypeID.splice(1, TypeSource_Level.ProductTypeID.length - 1);
                                $.each(resW.list, function (i, item) {
                                    TypeSource_Level.ProductTypeID.push({
                                        name: item.Name,
                                        value: item.ID,
                                        far: item.BusinessUnitID
                                    });
                                });
                            }
                            window.parent._zaceProductType = 0;
                        });

                    }

                    if (window.parent._zaceBusinessUnit && window.parent._zaceBusinessUnit == 1) {
                        model.com.getBusinessUnit({}, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {
                                //TypeSource_materialRecord.SupplierID = [];
                                TypeSource_Level.BusinessUnitID.splice(1, TypeSource_Level.BusinessUnitID.length - 1);
                                $.each(resW.list, function (i, item) {
                                    TypeSource_Level.BusinessUnitID.push({
                                        name: item.Name,
                                        value: item.ID,
                                        far: 0
                                    });
                                });
                            }
                            window.parent._zaceBusinessUnit = 0;
                        });

                    }

                    model.com.setMMM();
                }, 500);

            },
            refresh: function () {

                //申请
                model.com.getReport({ FactoryID: 0, BusinessUnitID: 0 }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {

                        $.each(resP.list, function (j, item_j) {
                           
                            item.WID = i + 1;
                        });

                        var Grade = $com.util.Clone(resP.list);
                        DATABasic = $com.util.Clone(resP.list);

                        DataAll = $com.util.Clone(Grade);
                        

                        // $.each(Grade, function (i, item) {
                        //     for (var p in item) {
                        //         if (!FORMATTRT_Level[p])
                        //             continue;
                        //         item[p] = FORMATTRT_Level[p](item[p]);
                        //     }
                        //     item.WID = i + 1;
                        // });
                        DataAllFactorySearch = $com.util.Clone(Grade);
                        $("#femi-riskLevel-tbody").html($com.util.template(Grade, HTML.TableMode));
                        //$page.getPage(Grade, "#femi-riskLevel-tbody", HTML.TableMode, ".table-part");
                    }

                });




            },
             //查询报告
             getReport: function (data, fn, context) {
                var d = {
                    $URI: "/IPTPreCheckReport/AuditList",
                    $TYPE: "get",
                    $Server:'MESQMS',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //查询产品类型
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

            //查询
            getFMCUserId: function (data, fn, context) {
                var d = {
                    $URI: "/Role/UserAllByFunctionID",
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
            //查询事业部
            getBusinessUnit: function (data, fn, context) {
                var d = {
                    $URI: "/BusinessUnit/All",
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
            //保存工序库列表
            postFPCPart: function (data, fn, context) {
                var d = {
                    $URI: "/FPCPart/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //审核
            postAudit: function (data, fn, context) {
                var d = {
                    $URI: "/FPCPart/Audit",
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
                    $URI: "/FPCPart/Active",
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