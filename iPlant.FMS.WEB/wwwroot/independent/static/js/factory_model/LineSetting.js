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
        WorkShopID,
        BusinessUnitID,
        FactoryID,
        DATAAllBasic,
        DataAllBSearch,
        DataWorkShoplist,
        HTML;


    DataAll = DataWorkShoplist = [];
    WorkShopID = 0;
    BusinessUnitID = 0;
    FactoryID = 0;
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
        BusinessUnit: "",
        BusinessCode: "",
        BusinessUnitID: 0,
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
        FactoryCode: "",
        ID: 0,
        Mode: 0,
        ModeText: "",
        Name: "",
        ShiftID: 0,
        ShiftName: "",
        UnitList: [],
        WorkShop: "",
        WorkShopID: 0,
        WorkShopCode: "",
        Status: 1,
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
            //'<td data-title="WorkShopID" data-value="{{WorkShopID}}" >{{WorkShopID}}</td>',
            '<td data-title="Creator" data-value="{{Creator}}" >{{Creator}}</td>',
            '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
            '<td data-title="Editor" data-value="{{Editor}}" >{{Editor}}</td>',
            '<td data-title="EditTime" data-value="{{EditTime}}" >{{EditTime}}</td>',
            '<td data-title="Active" data-value="{{Active}}" ><span class="badge lmvt-badge {{ClassBadge}}">{{Badge}}</span>{{Active}}</td>',

            '<td style="min-width: 40px" data-title="Handle" data-value="{{ID}}"><div class="row">',
            // '<div style="color: #409EFF;" class="col-md-3 lmvt-infoConfig" >首巡检配置</div>',
            // '<div style="color: #409EFF;" class="col-md-3 lmvt-info" >详情</div>',
            '<div class="col-md-4 {{ISAllowed}} ">{{ISAllowedText}}</div>',
            '<div class="col-md-4 lmvt-do-info">修改</div>',
            '<div class="col-md-4"><UL id="lmvt-nav">',
            '<LI>更多<UL>',
            '<LI data-value="{{ID}}" class="lmvt-info">产线配置</LI>',
            '<LI data-value="{{ID}}" class="lmvt-infoConfig">首巡检配置</LI>',
            '<LI data-value="{{ID}}" class="lmvt-stationInfo">工位列表</LI>',
            '</UL></LI></UL></div>',
            '</td>',

            '</tr>',
        ].join(""),



    },
        (function () {
            KEYWORD_Level_LIST = [
                "Name|名称",
                "Code|编码",
                //"BusinessUnitID|事业部|ArrayOneControl",
                "WorkShopID|车间|ArrayOne",
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
                //WorkShopID:0
            };

            TypeSource_Level = {
                Active: [
                    {
                        name: "未使用",
                        value: 0
                    },
                    {
                        name: "启用",
                        value: 1
                    },
                    {
                        name: "禁用",
                        value: 2
                    }
                ],
                WorkShopID: [

                ],
                BusinessUnitID: [

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
        name: '产线',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            //工位
            $("body").delegate(".lmvt-stationInfo", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var vdata = { 'header': '工位配置', 'href': './factory_model/StationSetupSetting.html?LineID=' + wID, 'id': 'StationSetupSetting', 'src': '/MESCore/upload/web/工位配置NB.svg' };
                window.parent.iframeHeaderSet(vdata);
                window.callFunctionTrigger("StationSetupSetting", { LineID: wID });
            });

            $("body").delegate(".lmvt-infoConfig", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                //查看首巡检配置
                var vdata = { 'header': '首巡检配置', 'href': './factory_model/ConfigSetting.html?LineID=' + wID, 'id': 'ConfigSetting', 'src': '/MESCore/upload/web/配置检查.svg' };
                window.parent.iframeHeaderSet(vdata);
                window.callFunctionTrigger("ConfigSetting", { LineID: wID });

            });

            $("body").delegate(".lmvt-info", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                //查看产线单元明细
                var vdata = { 'header': '产线单元明细', 'href': './factory_route/FMCLineUnitSetting.html?LineID=' + wID, 'id': 'FMCLineUnitSetting', 'src': '/MESCore/upload/web/工序单元明细.svg' };
                window.parent.iframeHeaderSet(vdata);
                window.callFunctionTrigger("FMCLineUnitSetting", { LineID: wID });

            });

            $("body").delegate("#zace-refresh-po", "click", function () {

                model.com.refresh();


            });
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
                    fileName = "工区信息.xls",
                    Title = "工区信息";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });



            });
            //Enter触发模糊查询事件
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var
                        value = $("#zace-search-approval").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-riskLevel-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "ID");
                }
            });
            //查询
            $("body").delegate("#zace-searchApproval-levelZace", "click", function () {

                var
                    value = $("#zace-search-approval").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "ID");



            });

            //修改
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
                    //Status: SelectData[0].Status,
                    Name: SelectData[0].Name,
                    Code: SelectData[0].Code,
                    //WorkShopID: SelectData[0].WorkShopID,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].Name = rst.Name;
                    SelectData[0].Code = rst.Code;
                    //SelectData[0].WorkShopID = Number(rst.WorkShopID);

                    for (var i = 0; i < SelectData.length; i++) {

                        $com.util.deleteLowerProperty(SelectData[i]);
                    }

                    model.com.postFMCLine({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();

                    })

                }, TypeSource_Level));


            });

            //修改 单条
            $("body").delegate(".lmvt-do-info", "click", function () {
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DataAll.filter((item) => { return item.ID == wID });

                var default_value = {
                    //Status: SelectData[0].Status,
                    Name: SelectData[0].Name,
                    Code: SelectData[0].Code,
                    //WorkShopID: SelectData[0].WorkShopID,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].Name = rst.Name;
                    SelectData[0].Code = rst.Code;
                    //SelectData[0].WorkShopID = Number(rst.WorkShopID);

                    for (var i = 0; i < SelectData.length; i++) {

                        $com.util.deleteLowerProperty(SelectData[i]);
                    }

                    model.com.postFMCLine({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();

                    })

                }, TypeSource_Level));


            });

            //启用单条
            $("body").delegate(".lmvt-do-active", "click", function () {
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DataAll.filter((item) => { return item.ID == wID });


                $com.util.deleteLowerProperty(SelectData);
                model.com.activeAudit({
                    data: SelectData,
                    Active: 1,
                }, function (res) {
                    alert("启用成功");
                    model.com.refresh();


                })




            });

            //启用
            $("body").delegate("#zace-active-level", "click", function () {
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DataAll.filter((item) => { return item.ID == wID });


                $com.util.deleteLowerProperty(SelectData);
                model.com.activeAudit({
                    data: SelectData,
                    Active: 1,
                }, function (res) {
                    alert("启用成功");
                    model.com.refresh();


                })




            });
            //禁用单条
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
            //禁用
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

            //新增
            $("body").delegate("#zace-add-level", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    PositionTemp.Name = rst.Name;
                    PositionTemp.Code = rst.Code;
                    PositionTemp.WorkShopID = 1;

                    model.com.postFMCLine({
                        data: PositionTemp,
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                    })

                }, TypeSource_Level));


            });



        },




        run: function () {
            model.com.getFMCWorkShop({ FactoryID: 0, BusinessUnitID: 0 }, function (resP) {
                if (!resP)
                    return;

                $.each(resP.list, function (i, item) {
                    TypeSource_Level.WorkShopID.push({
                        value: item.ID,
                        name: item.Name
                    });
                });
                model.com.refresh();
            });

        },

        com: {
            refresh: function () {
                //申请
                model.com.getFMCLine({ FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0 }, function (resP) {
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
                            item.WID = i + 1;
                        });
                        DataAllFactorySearch = $com.util.Clone(Grade);
                        $("#femi-riskLevel-tbody").html($com.util.template(Grade, HTML.TableMode));
                        //$page.getPage(Grade, "#femi-riskLevel-tbody", HTML.TableMode, ".table-part");

                    }

                });
            },
            setMMM: function () {
                setTimeout(function () {
                    if (window.parent._zaceWorkShop == 1) {
                        model.com.getFMCWorkShop({ FactoryID: 0, BusinessUnitID: 0 }, function (resW) {
                            if (resW && resW.list) {
                                DataWorkShoplist = resW.list;
                                TypeSource_Level.WorkShopID = [];
                                $.each(resW.list, function (i, item) {
                                    TypeSource_Level.WorkShopID.push({
                                        name: item.Name,
                                        value: item.ID,
                                        far: item.BusinessUnitID,
                                    });
                                });

                            }
                            window.parent._zaceWorkShop = 0;


                        });

                    }
                    model.com.setMMM();
                }, 500);

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
            //保存产线列表
            postFMCLine: function (data, fn, context) {
                var d = {
                    $URI: "/FMCLine/Update",
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
                    $URI: "/FMCLine/Audit",
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
                    $URI: "/FMCLine/Active",
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