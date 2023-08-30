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
        SearchAll,
        ShiftID,
        RoleNum,
        HTML;
    mbool = true;
    ShiftID = 0;
    mFunctionID = 0;
    mModuleID = 0;
    RoleNum = -1;
    DataAll = SearchAll = [];
    DATABasic = [];
    DataAllConfirmBasic = [];
    DataAllConfirmChange = [];
    DataAllConfirm = [];
    DataAllFactorySearch = DataAllSearch = [];


    ;
    HTML = {
        TableMode: [
            '<tr data-color="">',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="BusinessUnit" data-value="{{BusinessUnit}}" >{{BusinessUnit}}</td>',
            //'<td data-title="Factory" data-value="{{Factory}}" >{{Factory}}</td>',
            '<td data-title="WorkShop" data-value="{{WorkShop}}" >{{WorkShop}}</td>',
            '<td data-title="LineID" data-value="{{LineID}}" >{{LineID}}</td>',
            '<td  data-title="StationID" data-value="{{StationID}}" >{{StationID}}</td>',
            '<td data-title="StationName" data-value="{{StationName}}" >{{StationName}}</td>',
            '<td data-title="ModuleName" data-value="{{ModuleName}}" >{{ModuleName}}</td>',
            '<td data-title="FunctionName" data-value="{{FunctionName}}" >{{FunctionName}}</td>',
            '<td data-title="PositionName" data-value="{{PositionName}}" >{{PositionName}}</td>',
            '<td  data-title="WorkerID" data-value="{{WorkerID}}" >{{WorkerID}}</td>',
            '<td data-title="WorkerName" data-value="{{WorkerName}}" >{{WorkerName}}</td>',
            '<td data-title="OnShift" data-value="{{OnShift}}" >{{OnShift}}</td>',
            '<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',
            '</tr>',
        ].join(""),

        TableItemMode: [
            '<tr data-color="">',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            //'<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td data-title="ModuleName" data-value="{{ModuleName}}" >{{ModuleName}}</td>',
            '<td data-title="FunctionName" data-value="{{FunctionName}}" >{{FunctionName}}</td>',
            '<td data-title="EventID" data-value="{{EventID}}" >{{EventID}}</td>',
            '<td data-title="EventName" data-value="{{EventName}}" >{{EventName}}</td>',
            '<td data-title="Active" data-value="{{Active}}" >{{Active}}</td>',
            '</tr>',
        ].join(""),

    };
    $(function () {
        KEYWORD_Level_LIST = [
            "LineID|产线|ArrayOne",
            //"WorkShopID|车间|ArrayOneControl",
            //"StationID|工位|ArrayOneControl|WorkShopID",
            //"PositionID|岗位|ArrayOne",
            "WorkShopID|车间",
            "StationID|工位",
            "ModuleID|职能|ArrayOne",
            "PositionID|岗位",
            "DeviceID|设备ID",
            "Status|状态|ArrayOne",
            "Active|激活|ArrayOne",
            "OnShift|来源|ArrayOne",
            "SDate|日期|Date",
            "Shift|班次|ArrayOne",
        ];
        KEYWORD_Level = {};
        FORMATTRT_Level = {};

        DEFAULT_VALUE_Level = {
            WorkShopID: 0,
            LineID: 0,
            StationID: 0,
            PositionID: 0,
            //  DeviceID:0,

        };

        TypeSource_Level = {
            OnShift: [
                {
                    name: "排班",
                    value: true,
                }, {
                    name: "模板",
                    value: false,
                },
            ],
            LineID: [
                {
                    name: "无",
                    value: 0,
                },
            ],
            Active: [
                {
                    name: "激活",
                    value: true,
                }, {
                    name: "禁用",
                    value: false,
                },
            ],
            Status: [
                //{
                //    name: "默认值",
                //    value: 0
                //},
                {
                    name: "创建",
                    value: 1,
                }, {
                    name: "待审核",
                    value: 2,
                }, {
                    name: "已审核",
                    value: 3,
                }, {
                    name: "撤销审核",
                    value: 4,
                }],
            Shift: [
                {
                    name: "白班",
                    value: 1,
                }, {
                    name: "晚班",
                    value: 2,
                },
            ],
            ModuleID: [],


        };

        $.each(KEYWORD_Level_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD_Level[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined,
            };
            if (detail.length > 2) {
                FORMATTRT_Level[detail[0]] = $com.util.getFormatter(TypeSource_Level, detail[0], detail[2]);
            }
        });
    });


    model = $com.Model.create({
        name: '岗位',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            //条件查询
            $("body").delegate("#zace-export-search", "click", function () {
                var default_value = {
                    ModuleID: 0,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.ModuleID = Number(rst.ModuleID);
                    $com.table.filterByConndition($("#femi-riskLevel-tbody"), DataAllConfirm, default_value, "ID");

                }, TypeSource_Level));


            });
            //
            $("body").delegate("#zace-search-level", "change", function () {

                var $this = $(this),
                    value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "ID");


            });

            //
            //条件查询
            $("body").delegate("#zace-searchZall-level", "click", function () {
                var default_value = {
                    OnShift: 0,
                    SDate: $com.util.format('yyyy-MM-dd', new Date()),
                    Shift: 1,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {

                    if (!rst || $.isEmptyObject(rst))
                        return;
                    // default_value.WorkShopID = Number(rst.WorkShopID);
                    mbool = eval(rst.OnShift.toLowerCase());
                    default_value.SDate = $com.util.format('yyyy-MM-dd', rst.SDate);
                    default_value.Shift = Number(rst.Shift);
                    ShiftID = model.com.getshiftID(default_value.SDate) * 10 + default_value.Shift;
                    model.com.refresh();

                }, TypeSource_Level));


            });


            //工位人员导出
            $("body").delegate("#zace-export-MeteringSetting", "click", function () {
                var $table = $(".zztable-part"),
                    fileName = "工位人员.xls",
                    Title = "工位人员";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });

            });
            //作业导出
            $("body").delegate("#zace-exportItem-level", "click", function () {
                var $table = $(".Itemtable-part"),
                    fileName = "作业集.xls",
                    Title = "作业集";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });

            });
            //双击.
            $("body").delegate("#femi-riskLevel-tbody tr", "dblclick", function () {

                var $this = $(this);
                var $table = $this.closest("table");
                var _listObj = {};
                var wID = Number($this.find('td[data-title=ID]').attr('data-value'));
                for (var i = 0; i < DataAll.length; i++) {
                    if (wID == DataAll[i].ID) {
                        _listObj = DataAll[i];
                    }
                }
                var wModuleName = _listObj.ModuleName;
                var wModuleID = 0;
                for (var i = 0; i < DataModuleList.length; i++) {
                    if (wModuleName == DataModuleList[i].ItemName) {
                        wModuleID = DataModuleList[i].ID;
                    }
                }
                mFunctionID = _listObj.FunctionID;
                mModuleID = wModuleID;
                model.com.refreshEvent();

                $table.find("tbody tr").each(function (i, item) {
                    var $tr = $(this);

                    if (wID == Number($tr.find("td[data-title=ID]").attr("data-value"))) {
                        $tr.css('background-color', '#7bf1b5');
                        temp = true;

                    } else {
                        if (!($tr.attr("data-color"))) {

                            $tr.css('background-color', '');
                        } else {

                            var colorPro = $tr.attr("data-color");
                            $tr.css('background-color', colorPro);
                        }
                    }
                });

                $(".zzzb").hide();
                //$(".zzza").css("width", "70%");
                //$(".zzzc").css("width", "29%");
                $(".zzzItem").css("width", "400px");
                $(".zzza").css("margin-right", "400px");
                $(".zzzItem").show();
                $(".zzza").show();
                return false;
            });
            $("body").delegate("#zace-closeItem-level", "click", function () {
                $(".zzzItem").css("width", "0px");
                $(".zzza").css("margin-right", "0px");
                $(".zzza").show();
                $(".zzzb").hide();
                $(".zzzItem").hide();
                model.com.refresh();
            });
        },


        run: function () {
            ShiftID = model.com.getshiftID($com.util.format('yyyy-MM-dd ', new Date())) * 10 + 1;
            model.com.getModuleAll({module: 400001}, function (resModule) {
                if (resModule && resModule.list) {
                    DataModuleList = resModule.list;
                    $.each(resModule.list, function (i, item) {
                        TypeSource_Level.ModuleID.push({
                            name: item.ItemName,
                            value: item.ID,
                            //far: 0
                        });
                    });
                }
                model.com.getFMCLine({FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0}, function (resP) {
                    if (resP && resP.list) {

                        $.each(resP.list, function (i, item) {
                            TypeSource_Level.LineID.push({
                                name: item.Name,
                                value: item.ID,
                                //far: 0
                            });
                        });
                    }
                    model.com.refresh();
                });
            });

        },

        com: {
            refresh: function () {


                //model.com.getSCHPosition({ OAGetType: 0, FillShift: mbool, ShiftID: ShiftID,PositionLevel:5}, function (resP) {
                //    if (!resP)
                //        return;
                //    if (resP && resP.list) {
                //        var list1 = $com.util.Clone(resP.list);

                model.com.getSCHPosition({
                    OAGetType: 0,
                    FillShift: mbool,
                    ShiftID: ShiftID,
                    PositionLevel: 0,
                }, function (resP2) {
                    if (!resP2)
                        return;
                    if (resP2 && resP2.list) {

                        var list2 = $com.util.Clone(resP2.list);

                        var listAl = [];
                        //for (var i = 0; i < list1.length; i++) {
                        //    if (list1[i].Status==3) {
                        //        listAl.push(list1[i]);
                        //    }


                        //}
                        for (var j = 0; j < list2.length; j++) {
                            if (list2[j].Status == 3) {
                                listAl.push(list2[j]);
                            }

                        }
                        //申请数据
                        DataAllConfirm = $com.util.Clone(listAl);
                        var _listApproval = $com.util.Clone(listAl);

                        DataAll = $com.util.Clone(_listApproval);
                        $.each(_listApproval, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }
                        });
                        DataAllFactorySearch = $com.util.Clone(_listApproval);
                        $("#femi-riskLevel-tbody").html($com.util.template(_listApproval, HTML.TableMode));
                        $("#femi-riskLevel-tbody tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);


                        });

                    }

                });

                //    }

                //});             

            },
            refreshEvent: function () {
                model.com.getBPMEvent({FunctionID: mFunctionID, FillShift: mbool, ShiftID: ShiftID}, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var GradeItem = $com.util.Clone(resP.list);
                        DATABasicItem = $com.util.Clone(resP.list);


                        DataAllItem = $com.util.Clone(GradeItem);
                        $.each(GradeItem, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);

                            }
                        });
                        $("#femi-riskLevelItem-tbody").html($com.util.template(GradeItem, HTML.TableItemMode));
                        $("#femi-riskLevelItem-tbody tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);


                        });
                    }

                });

            },
            //查询作业类型
            getBPMEvent: function (data, fn, context) {
                var d = {
                    $URI: "/BPMEvent/All",
                    $TYPE: "get",
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
                    $TYPE: "post",
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
                    $TYPE: "get",
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
                    $TYPE: "get",
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
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询岗位职能列表
            getPosition: function (data, fn, context) {
                var d = {
                    $URI: "/BPMPosition/All",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询权限
            getRoleFounction: function (data, fn, context) {
                var d = {
                    $URI: "/Role/UserRoleByFunctionID",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //查询区域
            getArea: function (data, fn, context) {
                var d = {
                    $URI: "/Area/Tree",
                    $TYPE: "get",
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
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询工位职责列表
            getSCHPosition: function (data, fn, context) {
                var d = {
                    $URI: "/SCHPosition/All",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //保存工位职责列表
            postSCHPosition: function (data, fn, context) {
                var d = {
                    $URI: "/SCHPosition/Update",
                    $TYPE: "post",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //审核
            postAudit: function (data, fn, context) {
                var d = {
                    $URI: "/SCHPosition/Audit",
                    $TYPE: "post",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //激活
            activeAudit: function (data, fn, context) {
                var d = {
                    $URI: "/SCHPosition/Active",
                    $TYPE: "post",
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
                    $TYPE: "post",
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
            getshiftID: function (date) {

                var date = new Date(date);
                var month = date.getMonth() + 1;
                var day = date.getDate();
                return date.getFullYear() + getFormatDate(month) + getFormatDate(day);


                // 日期月份/天的显示，如果是1位数，则在前面加上'0'
                function getFormatDate(arg) {
                    if (arg == undefined || arg == '') {
                        return '';
                    }

                    var re = arg + '';
                    if (re.length < 2) {
                        re = '0' + re;
                    }

                    return re;
                }


            },
        },
    }),

        model.init();


});