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
        DataLinelist,
        DATAAllBasic,
        DataAllBSearch,

        wLineID = 1,

        HTML;
    DataAll = DataLinelist = [];
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
        Available: 1,
        BusinessUnit: "",
        //BusinnessUnitID: 0,     /// 
        Code: "",
        CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Creator: window.parent.User_Info.Name,
        CreatorID: 0,
        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Editor: window.parent.User_Info.Name,
        EditorID: 0,
        DeviceID: 0,
        DeviceNo: "",
        Factory: "",
        //FactoryID: 0,         ///
        ID: 0,
        Name: "",
        WorkShop: "",
        WorkShopID: 0,
        Line: "",
        LineID: wLineID,
        Status: 1,
        StatusText: "",
        ResourceID: 0,
        ResourceName: "",
        IPTModuleID: 0,
        EnableShiftIPT01: 1,
        EnableShiftIPT02: 1
    };


    ;
    HTML = {
        TableMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
            '<td data-title="Code" data-value="{{Code}}" >{{Code}}</td>',

            '<td data-title="IPTModuleID" data-value="{{IPTModuleID}}" >{{IPTModuleID}}</td>',
            '<td data-title="IsCalcPD" data-value="{{IsCalcPD}}" >{{IsCalcPD}}</td>',

            '<td data-title="Creator" data-value="{{Creator}}" >{{Creator}}</td>',
            '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
            '<td data-title="Editor" data-value="{{Editor}}" >{{Editor}}</td>',
            '<td data-title="EditTime" data-value="{{EditTime}}" >{{EditTime}}</td>',
            '<td data-title="Active" data-value="{{Active}}" ><span class="badge lmvt-badge {{ClassBadge}}">{{Badge}}</span>{{Active}}</td>',

            '<td style="min-width: 40px" data-title="Handle" data-value="{{ID}}"><div class="row">',
            '<div class="col-md-6 {{ISAllowed}} ">{{ISAllowedText}}</div>',
            '<div class="col-md-6 lmvt-do-info">修改</div>',
            '</td>',

            '</tr>',
        ].join(""),



    },
        (function () {
            KEYWORD_Level_LIST = [
                "Name|名称",
                "Code|编码",

                "IPTModuleID|遏制工位|ArrayOne",
                "IsCalcPD|尾工位|ArrayOne",

                //"WorkShopID|车间|ArrayOneControl",
                //"LineID|产线|ArrayOneControl|WorkShopID",
                "WorkShopID|修程|ArrayOneControl",
                "LineID|工区|ArrayOneControl|WorkShopID",
                "ResourceID|班组|ArrayOne",
                "DeviceID|设备号|ArrayOne",
                // "IPTModuleID|点检模板|ArrayOne",
                //"IPTModuleID|点检模板",
                "Status|状态|ArrayOne",
                "EnableShiftIPT01|班前点检|ArrayOne",
                "EnableShiftIPT02|班后点检|ArrayOne",
                "Active|激活|ArrayOne",
                "CreateTime|时间|DateTime",
                "EditTime|时间|DateTime",
            ];
            KEYWORD_Level = {};
            FORMATTRT_Level = {};

            DEFAULT_VALUE_Level = {
                Name: "",
                Code: "",
                IPTModuleID: 0,
                IsCalcPD: 0,
            };

            TypeSource_Level = {
                IPTModuleID: [
                    {
                        name: "是",
                        value: 1
                    }, {
                        name: "否",
                        value: 0
                    }
                ],
                IsCalcPD: [
                    {
                        name: "是",
                        value: 1
                    }, {
                        name: "否",
                        value: 0
                    }
                ],
                Active: [
                    {
                        name: "启用",
                        value: 1
                    }, {
                        name: "禁用",
                        value: 2
                    }
                ],
                EnableShiftIPT01: [
                    {
                        name: "是",
                        value: true
                    }, {
                        name: "否",
                        value: false
                    }
                ],
                EnableShiftIPT02: [
                    {
                        name: "是",
                        value: true
                    }, {
                        name: "否",
                        value: false
                    }
                ],
                DeviceID: [],
                // IPTModuleID: [],
                WorkShopID: [
                    {
                        name: "无",
                        value: 0,
                        // far: 0
                    }
                ],
                ResourceID: [
                    {
                        name: "无",
                        value: 0,
                        // far: 0
                    }
                ],
                LineID: [
                    {
                        name: "无",
                        value: 0,
                        // far: 0
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
        name: '岗位',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {

            //条件查询
            $("body").delegate("#zace-searchApproval-level", "click", function () {
                var default_value = {
                    Active: 1,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.Active = eval(rst.Active.toLowerCase());
                    /// default_value.Position = Number(rst.Position);
                    $com.table.filterByConndition($("#femi-riskLevel-tbody"), DataAll, default_value, "ID");

                }, TypeSource_Level));


            });



            //导出 
            $("body").delegate("#zace-exportApproval-level", "click", function () {
                var $table = $(".table-partApproval"),
                    fileName = "工位信息.xls",
                    Title = "工位信息";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });



            });





            //工位查询 申请
            $("body").delegate("#zace-search-approval", "input", function () {

                var $this = $(this),
                    value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "ID");



            });

            //工位修改 单条
            $("body").delegate(".lmvt-do-info", "click", function () {
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DataAll.filter((item) => { return item.ID == wID });
                var default_value = {



                    // WorkShopID: SelectData[0].WorkShopID,
                    // LineID: SelectData[0].LineID,
                    Name: SelectData[0].Name,

                    Code: SelectData[0].Code,

                    IPTModuleID: SelectData[0].IPTModuleID,
                    IsCalcPD: SelectData[0].IsCalcPD,

                    // ResourceID: SelectData[0].ResourceID,


                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].Name = rst.Name;
                    SelectData[0].Code = rst.Code;

                    SelectData[0].IPTModuleID = rst.IPTModuleID;
                    SelectData[0].IsCalcPD = rst.IsCalcPD;
                    //SelectData[0].WorkShopID = Number(rst.WorkShopID);
                    //SelectData[0].LineID = Number(rst.LineID);
                    //SelectData[0].ResourceID = Number(rst.ResourceID);

                    for (var i = 0; i < SelectData.length; i++) {

                        $com.util.deleteLowerProperty(SelectData[i]);
                    }

                    model.com.postFMCStation({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                        //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                        //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    })

                }, TypeSource_Level));


            });

            //工位修改
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
                    //WorkShopID: SelectData[0].WorkShopID,
                    //LineID: SelectData[0].LineID,
                    Name: SelectData[0].Name,

                    Code: SelectData[0].Code,
                    // ResourceID: SelectData[0].ResourceID,


                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].Name = rst.Name;
                    SelectData[0].Code = rst.Code;
                    //SelectData[0].WorkShopID = Number(rst.WorkShopID);
                    //SelectData[0].LineID = Number(rst.LineID);
                    //SelectData[0].ResourceID = Number(rst.ResourceID);

                    for (var i = 0; i < SelectData.length; i++) {

                        $com.util.deleteLowerProperty(SelectData[i]);
                    }

                    model.com.postFMCStation({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                        //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                        //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    })

                }, TypeSource_Level));


            });

            //工位激活 单条
            $("body").delegate(".lmvt-do-active", "click", function () {
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DataAll.filter((item) => { return item.ID == wID });
                $com.util.deleteLowerProperty(SelectData);
                model.com.activeAudit({
                    data: SelectData,
                    Active: 1,
                }, function (res) {
                    alert("激活成功");
                    model.com.refresh();


                })

            });

            //工位激活
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
            //工位禁用 单条
            $("body").delegate(".lmvt-do-forbidden", "click", function () {
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DataAll.filter((item) => { return item.ID == wID });
                $com.util.deleteLowerProperty(SelectData);
                model.com.activeAudit({
                    data: SelectData,
                    Active: 0,
                }, function (res) {
                    alert("禁用成功");
                    model.com.refresh();
                })

            });
            //工位禁用
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

            //工位新增
            $("body").delegate("#zace-add-level", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    //PositionTemp.WorkShopID = Number(rst.WorkShopID);
                    //PositionTemp.LineID = Number(rst.LineID);
                    PositionTemp.Name = rst.Name;
                    PositionTemp.Code = rst.Code;
                    //PositionTemp.ResourceID = Number(rst.ResourceID);

                    //PositionTemp.EnableShiftIPT01 = eval(rst.EnableShiftIPT01.toLowerCase());
                    //PositionTemp.EnableShiftIPT02 = eval(rst.EnableShiftIPT02.toLowerCase());

                    model.com.postFMCStation({
                        data: PositionTemp,
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                    })

                }, TypeSource_Level));
            });
            //
            $("body").delegate("#zace-refresh-po", "click", function () {

                model.com.refresh();

            });

            window.setFunctionTrigger("StationSetupSetting", function (res) {
                wLineID = res.LineID
                model.com.refresh();
            });

        },

        run: function () {
            var wDevice = window.parent._Device;

            wLineID = Number(model.query.LineID);

            model.com.refresh();
            //model.com.getFMCLine({ FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0 }, function (resW) {
            //    if (resW && resW.list) {
            //        DataLinelist = resW.list;
            //        $.each(resW.list, function (i, item) {
            //            TypeSource_Level.LineID.push({
            //                name: item.Name,
            //                value: item.ID,
            //                far:item.WorkShopID
            //            });
            //        });

            //    }
            //    model.com.getFMCWorkShop({ FactoryID: 0, BusinessUnitID: 0 }, function (resW) {
            //        if (resW && resW.list) {
            //            DataWorkShoplist = resW.list;
            //            $.each(resW.list, function (i, item) {
            //                TypeSource_Level.WorkShopID.push({
            //                    name: item.Name,
            //                    value: item.ID,
            //                    far: 0
            //                });
            //            });

            //        }
            //        model.com.getFMCResource({ FactoryID: 0, BusinessUnitID: 0 }, function (resR) {
            //            if (resR && resR.list) {

            //                $.each(resR.list, function (i, item) {
            //                    TypeSource_Level.ResourceID.push({
            //                        name: item.Name,
            //                        value: item.ID,
            //                        far: 0
            //                    });
            //                });

            //            }





            //        });
            //    });
            //});


        },

        com: {
            setMMM: function () {
                setTimeout(function () {
                    if (window.parent._zaceStaResource && window.parent._zaceStaResource == 1) {
                        model.com.getFMCResource({ FactoryID: 0, BusinessUnitID: 0 }, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {
                                //TypeSource_materialRecord.SupplierID = [];
                                TypeSource_Level.ResourceID.splice(1, TypeSource_Level.ResourceID.length - 1);
                                $.each(resW.list, function (i, item) {
                                    TypeSource_Level.ResourceID.push({
                                        name: item.Name,
                                        value: item.ID,
                                        far: 0
                                    });
                                });
                            }
                            window.parent._zaceStaResource = 0;
                        });

                    }
                    if (window.parent._zaceLineSet && window.parent._zaceLineSet == 1) {
                        model.com.getFMCLine({ FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0 }, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {
                                //TypeSource_materialRecord.SupplierID = [];
                                TypeSource_Level.LineID.splice(1, TypeSource_Level.LineID.length - 1);
                                DataLinelist = resW.list;
                                $.each(resW.list, function (i, item) {
                                    TypeSource_Level.LineID.push({
                                        name: item.Name,
                                        value: item.ID,
                                        //  far:item.WorkShopID
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
                                //TypeSource_materialRecord.SupplierID = [];
                                TypeSource_Level.WorkShopID.splice(1, TypeSource_Level.WorkShopID.length - 1);
                                DataWorkShoplist = resW.list;
                                $.each(resW.list, function (i, item) {
                                    TypeSource_Level.WorkShopID.push({
                                        name: item.Name,
                                        value: item.ID,
                                        far: 0
                                    });
                                });
                            }
                            window.parent._zaceWorkShop = 0;
                        });

                    }

                    model.com.setMMM();
                }, 500);

            },
            refresh: function () {

                //申请
                model.com.getFMCStation({ LineID: wLineID }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var Grade = $com.util.Clone(resP.list);
                        DATABasic = $com.util.Clone(resP.list);

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
                            } else {
                                item.ISAllowedText = "启用";
                                item.ISAllowed = "lmvt-do-active";
                                item.ClassBadge = "lmvt-forbiddenBadge";
                            }

                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }
                        });
                        DataAllFactorySearch = $com.util.Clone(Grade);
                        $("#femi-riskLevel-tbody").html($com.util.template(Grade, HTML.TableMode));

                        //$page.getPage(Grade, "#femi-riskLevel-tbody", HTML.TableMode, ".table-part");
                    }

                });


            },
            //获取所有设备/备件点检类型列表
            getDevicePointCheckType: function (data, fn, context) {
                var d = {
                    $URI: "/DevicePointCheckType/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询设备
            getDeviceModel: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceModel/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //查询资源组列表
            getFMCResource: function (data, fn, context) {
                var d = {
                    $URI: "/FMCResource/All",
                    $TYPE: "get"
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
            //保存工位列表
            postFMCStation: function (data, fn, context) {
                var d = {
                    $URI: "/FMCStation/Update",
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
                    $URI: "/FMCStation/Audit",
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
                    $URI: "/FMCStation/Active",
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