require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($zace, $com) {

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
        ID: 0,
        Name: "",
        ExceptionType: 0,
        ExceptionTypeName: "",
        TimeOutList: [],
        RespondLevel: 0,
        ReportTimes: 0,
        EXCTemplate: 0,
        ForwardTimes: 0,
        EXCRequestType: 0,
        EXCResponseType: 0,
        EXCConfirmType: 0,
        CreatorID: 0,

        EditorID: 0,

    };


    ;
    HTML = {
        TableMode: [
            '<tr data-color="">',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
            '<td data-title="StationTypeName" data-value="{{StationTypeName}}" >{{StationTypeName}}</td>',
            '<td data-title="AgainInterval" data-value="{{AgainInterval}}" >{{AgainInterval}}</td>',
            // '<td data-title="RelevancyTaskType" data-value="{{RelevancyTaskType}}" >{{RelevancyTaskType}}</td>',
            '<td data-title="ModeType" data-value="{{ModeType}}" >{{ModeType}}</td>',
            '<td data-title="CreatorID" data-value="{{CreatorID}}" >{{CreatorID}}</td>',
            '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
            '<td data-title="EditorID" data-value="{{EditorID}}" >{{EditorID}}</td>',
            '<td data-title="EditTime" data-value="{{EditTime}}" >{{EditTime}}</td>',
            '<td style="min-width: 50px" data-title="Active" data-value="{{Active}}"><span class="badge lmvt-badge {{ClassBadge}}">{{Badge}}</span>{{Active}}</td>',

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
                "ExceptionType|异常点类型|ArrayOne",
                "RelevancyTaskType|任务类型|ArrayOne",
                "ModeType|异常模式|ArrayOne",
                "AgainInterval|再次发起间隔时长",
                "DutyPositionID|责任岗位|Array",
                "ConfirmPositionID|确认岗位|ArrayOne",
                "ApproverPositionID|审批岗位|ArrayOne",
                "RespondLevel|响应等级|ArrayOne",
                "EXCTemplate|发起模板",
                "ReportTimes|上报次数",
                "ForwardTimes|转发次数",
                "Active|启用|ArrayOne",
                "CreatorID|创建者|ArrayOne",
                "EditorID|编辑者|ArrayOne",
                "CreateTime|时间|DateTime",
                "EditTime|时间|DateTime",
            ];
            KEYWORD_Level = {};
            FORMATTRT_Level = {};

            DEFAULT_VALUE_Level = {
                Name: "",
                ExceptionType: 0,
                //RelevancyTaskType: 0,
                ModeType: 0,
                AgainInterval: 0,
                //DutyPositionID: 0,
                //ConfirmPositionID: 0,
                //ApproverPositionID: 0,
                // Active:1,
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
                ModeType: [
                    {
                        name: "默认",
                        value: 0
                    }, {
                        name: "物料",
                        value: 1
                    }, {
                        name: "设备",
                        value: 2
                    },
                ],
                RespondLevel: [
                    {
                        name: "A",
                        value: 1
                    }, {
                        name: "B",
                        value: 2
                    }, {
                        name: "C",
                        value: 3
                    }, {
                        name: "D",
                        value: 4
                    }
                ],
                RelevancyTaskType: [
                    {
                        name: "默认",
                        value: 0
                    },
                    {
                        name: "保养",
                        value: 1
                    },
                    {
                        name: "维修",
                        value: 2
                    },
                    {
                        name: "点检",
                        value: 3
                    },
                    {
                        name: "配料",
                        value: 4
                    },
                    {
                        name: "巡检",
                        value: 5
                    },
                ],
                ExceptionType: [],
                EditorID: [],
                CreatorID: [],
                DutyPositionID: [],
                ConfirmPositionID: [],
                ApproverPositionID: [],
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
            //Enter触发模糊查询事件
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var value = $("#alfie-search-Device-item").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-riskLevel-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "ID");
                }
            });

            //查询
            $("body").delegate("#alfie-Device-search", "click", function () {
                var value = $("#alfie-search-Device-item").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "ID");
            });

            //导出 
            $("body").delegate("#zace-exportApproval-level", "click", function () {
                //var m = 100;
                var $table = $(".table-partApproval"),
                    //fileName = "车间信息" + "(" + m + ")" + ".xls";
                    fileName = "异常类型.xls",
                    Title = "异常类型";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });

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
                    Name: SelectData[0].Name,
                    ExceptionType: SelectData[0].StationType,
                    ModeType: SelectData[0].ModeType,
                    //RelevancyTaskType: SelectData[0].RelevancyTaskType,
                    AgainInterval: SelectData[0].AgainInterval,
                    //DutyPositionID: SelectData[0].DutyPositionID,
                    //ConfirmPositionID: SelectData[0].ConfirmPositionID,
                    //ApproverPositionID: SelectData[0].ApproverPositionID,
                    Active: SelectData[0].Active,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    SelectData[0].Name = rst.Name;
                    SelectData[0].StationType = Number(rst.ExceptionType);
                    SelectData[0].StationTypeName = FORMATTRT_Level["ExceptionType"](Number(rst.ExceptionType));
                    SelectData[0].ModeType = Number(rst.ModeType);
                    SelectData[0].AgainInterval = Number(rst.AgainInterval);
                    SelectData[0].Active = Number(rst.Active);
                    for (var i = 0; i < SelectData.length; i++) {
                        $com.util.deleteLowerProperty(SelectData[i]);
                    }
                    model.com.postEXCExceptionType({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                    })

                }, TypeSource_Level));
            });

            //修改  单条
            $("body").delegate(".lmvt-do-info", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DataAll.filter((item) => { return item.ID == wID });

                var default_value = {
                    Name: SelectData[0].Name,
                    ExceptionType: SelectData[0].StationType,
                    ModeType: SelectData[0].ModeType,
                    //RelevancyTaskType: SelectData[0].RelevancyTaskType,
                    AgainInterval: SelectData[0].AgainInterval,
                    //DutyPositionID: SelectData[0].DutyPositionID,
                    //ConfirmPositionID: SelectData[0].ConfirmPositionID,
                    //ApproverPositionID: SelectData[0].ApproverPositionID,
                    Active: SelectData[0].Active,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    SelectData[0].Name = rst.Name;
                    SelectData[0].StationType = Number(rst.ExceptionType);
                    SelectData[0].StationTypeName = FORMATTRT_Level["ExceptionType"](Number(rst.ExceptionType));
                    SelectData[0].ModeType = Number(rst.ModeType);
                    SelectData[0].AgainInterval = Number(rst.AgainInterval);
                    SelectData[0].Active = Number(rst.Active);
                    for (var i = 0; i < SelectData.length; i++) {
                        $com.util.deleteLowerProperty(SelectData[i]);
                    }
                    model.com.postEXCExceptionType({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                    })

                }, TypeSource_Level));
            });


            //zace-closeLine-level
            $("body").delegate("#zace-closeLine-level", "click", function () {

                $(".zzzb").hide();
                $(".zzza").css("margin-right", "0px");
                $(".zzzc").css("width", "0px");
                $(".zzzc").hide();

            });
            //启用
            $("body").delegate("#zace-active-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                // if (!confirm("已选择" + SelectData.length + "数据,是否启用？")) {
                //     return false;
                // }
                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                model.com.postEXCExceptionTypeActive({
                    data: SelectData,
                    Active: 1,
                }, function (res) {
                    alert("启用成功");
                    model.com.refresh();

                })
            });

            //启用 单条
            $("body").delegate(".lmvt-do-active", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DataAll.filter((item) => { return item.ID == wID });

                $com.util.deleteLowerProperty(SelectData);

                model.com.postEXCExceptionTypeActive({
                    data: SelectData,
                    Active: 1,
                }, function (res) {
                    alert("启用成功");
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
                // if (!confirm("已选择" + SelectData.length + "数据,是否禁用？")) {
                //     return false;
                // }
                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                model.com.postEXCExceptionTypeActive({
                    data: SelectData,
                    Active: 0,
                }, function (res) {
                    alert("禁用成功");
                    model.com.refresh();
                })

            });

            //禁用 单条
            $("body").delegate(".lmvt-do-forbidden", "click", function () {
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DataAll.filter((item) => { return item.ID == wID });

                $com.util.deleteLowerProperty(SelectData);

                model.com.postEXCExceptionTypeActive({
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


                    var _data = {
                        ID: 0,
                        Name: rst.Name,
                        StationType: Number(rst.ExceptionType),
                        StationTypeName: FORMATTRT_Level["ExceptionType"](Number(rst.ExceptionType)),
                        RelevancyTaskType: 0,
                        AgainInterval: Number(rst.AgainInterval),
                        DutyPositionID: [],
                        ModeType: Number(rst.ModeType),
                        ConfirmPositionID: 0,
                        ApproverPositionID: 0,
                        //Active: Number(rst.Active),
                    };

                    model.com.postEXCExceptionType({
                        data: _data,
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                    })

                }, TypeSource_Level));


            });



            $("body").delegate("#zace-searchZall-level", "click", function () {
                var default_value = {
                    BusinessUnitID: 0,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.BusinessUnitID = Number(rst.BusinessUnitID);
                    $com.table.filterByConndition($("#femi-riskLevel-tbody"), DataAll, default_value, "ID");

                }, TypeSource_Level));


            });

        },




        run: function () {
            var Userist = window.parent._UserAll;
            model.com.getEXCStationTypeAll({ RelevancyType: -1, Name: "", Active: -1 }, function (res) {

                if (res && res.list) {
                    //DataLinelist = resW.list;
                    $.each(res.list, function (i, item) {
                        TypeSource_Level.ExceptionType.push({
                            name: item.Name,
                            value: item.ID,

                        });
                    });

                }
                if (res && res.list) {
                    //DataLinelist = resW.list;
                    $.each(Userist, function (i, item) {
                        TypeSource_Level.CreatorID.push({
                            name: item.Name,
                            value: item.ID,
                        });
                    });

                }
                if (res && res.list) {
                    //DataLinelist = resW.list;
                    $.each(Userist, function (i, item) {
                        TypeSource_Level.EditorID.push({
                            name: item.Name,
                            value: item.ID,

                        });
                    });

                }
                model.com.getBPMPositionAll({ workshopID: -1, lineID: -1, OAGetType: -1 }, function (res) {

                    if (res && res.list) {
                        //DataLinelist = resW.list;
                        $.each(res.list, function (i, item) {
                            TypeSource_Level.DutyPositionID.push({
                                name: item.Name,
                                value: item.ID,

                            });
                        });
                        $.each(res.list, function (i, item) {
                            TypeSource_Level.ConfirmPositionID.push({
                                name: item.Name,
                                value: item.ID,

                            });
                        });
                        $.each(res.list, function (i, item) {
                            TypeSource_Level.ApproverPositionID.push({
                                name: item.Name,
                                value: item.ID,
                            });
                        });
                    }
                    model.com.refresh();
                });
            });







        },

        com: {
            refresh: function () {
                window.parent.lmvtEXCRule = 1;
                model.com.getEXCExceptionTypeAll({ RelevancyType: -1, StationType: -1, Name: "", Active: -1 }
                    , function (resP) {
                        if (!resP)
                            return;
                        if (resP && resP.list) {
                            var Grade = $com.util.Clone(resP.list);
                            DATABasic = $com.util.Clone(resP.list);

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
                            $("#femi-riskLevel-tbody tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);

                            });
                        }

                    });
            },
            //获取异常类型集合
            getEXCExceptionTypeAll: function (data, fn, context) {
                var d = {
                    $URI: "/EXCExceptionType/All",
                    $TYPE: "get",
                    $SERVER: "/MESQMS",
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取异常地点类型集合
            getEXCStationTypeAll: function (data, fn, context) {
                var d = {
                    $URI: "/EXCStationType/All",
                    $TYPE: "get",
                    $SERVER: "/MESQMS"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取所有设备/备件点检类型列表
            getEXCExceptionRule: function (data, fn, context) {
                var d = {
                    $URI: "/EXCExceptionRule/All",
                    $TYPE: "get",
                    $SERVER: "/MESQMS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取所有岗位信息
            getBPMPositionAll: function (data, fn, context) {
                var d = {
                    $URI: "/BMMPosition/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //新增异常类型
            postEXCExceptionType: function (data, fn, context) {
                var d = {
                    $URI: "/EXCExceptionType/Update",
                    $TYPE: "post",
                    $SERVER: "/MESQMS"
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //启用
            activeRule: function (data, fn, context) {
                var d = {
                    $URI: "/EXCExceptionRule/Active",
                    $TYPE: "post",
                    $SERVER: "/MESQMS"
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
            //查询车间列表
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
            //保存车间列表
            postFMCWorkShop: function (data, fn, context) {
                var d = {
                    $URI: "/FMCWorkShop/Update",
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
                    $URI: "/FMCWorkShop/Audit",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //启用
            postEXCExceptionTypeActive: function (data, fn, context) {
                var d = {
                    $URI: "/EXCExceptionType/Active",
                    $TYPE: "post",
                    $SERVER: "/MESQMS"
                };

                function err() {
                    $com.app.tip('启用失败，请检查网络');
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