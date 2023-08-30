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
        Selectedmodule,
        ShiftID,
        RoleNum,
        HTML;
    RoleNum = -1;
    Selectedmodule = 0;
    ShiftID = 0;
    mModuleID = 0;
    mShiftID = 0;
    DataAll = [];
    SearchAll = [];
    DATABasic = [];
    DataAllConfirmBasic = [];
    DataAllConfirmChange =[];
    DataAllConfirm = [];
    DataAllFactorySearch = DataAllSearch = [];

    ;
    HTML = {
        TableMode: [
				'<tr data-color="">',
				'<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
				'<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',              
				'<td data-title="ModuleName  " data-value="{{ModuleName}}" >{{ModuleName}}</td>',
                '<td data-title="ShiftID" data-value="{{ShiftID}}" >{{ShiftID}}</td>',               
                '<td data-title="Creator" data-value="{{Creator}}" >{{Creator}}</td>',
                 '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',                 
				'</tr>',
        ].join(""),
        TableModeItem: [
               '<tr data-color="">',
               '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
               '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
                '<td data-title="ShiftID" data-value="{{ShiftID}}" >{{ShiftID}}</td>',
               //'<td data-title="Factory " data-value="{{Factory }}" >{{Factory }}</td>',
               '<td data-title="BusinessUnit" data-value="{{BusinessUnit}}" >{{BusinessUnit}}</td>',
               '<td data-title="WorkShop" data-value="{{WorkShop}}" >{{WorkShop}}</td>',
               '<td data-title="Line" data-value="{{Line}}" >{{Line}}</td>',
                 '<td data-title="ModuleID" data-value="{{ModuleID}}" >{{ModuleID}}</td>',
               '<td data-title="FunctionName" data-value="{{FunctionName}}" >{{FunctionName}}</td>',
               '<td data-title="PositionName" data-value="{{PositionName}}" >{{PositionName}}</td>',             
               '<td data-title="WorkerID" data-value="{{WorkerID}}" >{{WorkerID}}</td>',
               '<td data-title="Creator" data-value="{{Creator}}" >{{Creator}}</td>',
                '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',              
               '</tr>',
        ].join(""),
                                
    }
    $(function () {
        KEYWORD_Level_LIST = [    
         "LineID|产线|ArrayOneControl",
         "TemplateID|模板|ArrayOneControl|LineID",
         "ModuleID|职能|ArrayOne",
         "PositionID|岗位|ArrayOne",          
         "Status|状态|ArrayOne",
         "Active|激活|ArrayOne",
         "WorkerID|人员|ArrayOne",
          "SDate|日期|Date",
         "Shift|班次|ArrayOne",
        ];
        KEYWORD_Level = {};
        FORMATTRT_Level = {};
      
        TypeSource_Level = {
      
            ModuleID: [
           {
               name: "全部",
               value: 0,
               far: 0
           }
            ],
            WorkerID:[],
            Shift: [
           {
               name: "白班",
               value: 1
           }, {
               name: "晚班",
               value: 2
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
        name: '岗位',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {

            //条件查询
            $("body").delegate("#zace-search-user", "click", function () {
                var default_value = {
                    SDate: $com.util.format('yyyy-MM-dd', new Date()),
                    Shift: 1,
                    ModuleID: 0,
                  
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.ModuleID = Number(rst.ModuleID);
                    default_value.SDate = $com.util.format('yyyy-MM-dd', rst.SDate);
                    default_value.Shift = Number(rst.Shift);

                    mModuleID = default_value.ModuleID;
                    mShiftID = model.com.getshiftID(default_value.SDate) * 10 + default_value.Shift;

                    model.com.refresh();
                    //$com.table.filterByConndition($("#femi-riskLevel-tbody"), DataAll, default_value, "ID");

                }, TypeSource_Level));


            });

            //模糊查询
            $("body").delegate("#femi-search-text-ledger", "change", function () {
                var $this = $(this),
					value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAll, value, "ID");
            });


            //
            $("body").delegate("#zace-search-Detail", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能操作一行！")
                    return;
                }
                Selectedmodule = SelectData[0].ModuleID;
                ShiftID = SelectData[0].ShiftID;

                model.com.refreshItem();
                $(".zzza").hide();
                $(".zzzb").show();

            });
         
            //条件查询
            $("body").delegate("#zace-search-userItem", "click", function () {
                var default_value = {
                    WorkerID: 0,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.WorkerID = Number(rst.WorkerID);

                    $com.table.filterByConndition($("#femi-riskLevelItem-tbody"), DataAllConfirm, default_value, "ID");

                }, TypeSource_Level));


            });

            //模糊查询
            $("body").delegate("#femi-search-text-ledgerItem", "change", function () {
                var $this = $(this),
					value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevelItem-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevelItem-tbody"), DataAllConfirmChange, value, "ID");
            });

            //返回zace-return-Detail
            $("body").delegate("#zace-return-Detail", "click", function () {
                $(".zzzb").hide();
                $(".zzza").show();

            });
            $("body").delegate("#zace-search-refresh", "click", function () {
               
                mShiftID = 0;
                model.com.refresh();
            });
        },




        run: function () {                           
            var UserList = window.parent._UserAll;
            model.com.getModuleAll({ module: 400001 }, function (resModule) {
                if (resModule && resModule.list) {
                    $.each(resModule.list, function (i, item) {
                        TypeSource_Level.ModuleID.push({
                            name: item.ItemName,
                            value: item.ID,
                            far: 0
                        })
                    });
                    
                }
                $.each(UserList, function (i, item) {
                    TypeSource_Level.WorkerID.push({
                        name: item.Name,
                        value: item.ID,
                        far: 0
                    })
                });

                model.com.setMMM();

                model.com.refresh();
            });
        },
     
        com: {
            setMMM: function () {
                setTimeout(function () {

                    if (window.parent._zaceUserAll && window.parent._zaceUserAll == 1) {
                        model.com.getUser({}, function (res) {
                            if (!res)
                                return;
                            if (res && res.list) {
                                //TypeSource_Level.AuditorID.splice(1, TypeSource_Level.AuditorID.length - 1);
                                TypeSource_Level.WorkerID = [];
                                $.each(res.list, function (i, item) {
                                    TypeSource_Level.WorkerID.push({
                                        name: item.Name,
                                        value: item.ID,
                                        far: 0
                                    })
                                });
                            }
                            window.parent._zaceUserAll = 0;
                        });

                    }


                    model.com.setMMM();
                }, 500);

            },

            refresh: function () {
                                         
                model.com.getSCHShift({ WorkShop: 0, LineID: 0, ModuleID: mModuleID, ShiftID: mShiftID, OAGetType: 0, }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {

                        if (mShiftID==0) {

                            DataAll = $com.util.Clone(resP.list);;
                            $("#femi-riskLevel-tbody").html($com.util.template(DataAll, HTML.TableMode));
                            $("#femi-riskLevel-tbody tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);



                            });

                        } else {

                            var _list = $com.util.Clone(resP.list);
                            var list = [];
                            for (var i = 0; i < _list.length; i++) {
                                if (_list[i].ShiftID == mShiftID) {
                                    list.push(_list[i]);
                                }
                            }
                            DataAll = $com.util.Clone(list);;
                            $("#femi-riskLevel-tbody").html($com.util.template(DataAll, HTML.TableMode));
                            $("#femi-riskLevel-tbody tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);



                            });
                        }
                       
                    }

                });
             
              
            },
            refreshItem: function () {
                model.com.getSCHWorkerShiftAll({ ModuleID: Selectedmodule, ShiftID: ShiftID, OAGetType: 0, }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {

                        //审核数据
                        DataAllConfirm = $com.util.Clone(resP.list);
                        var _list = $com.util.Clone(resP.list);
                        $.each(_list, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }
                        });
                        DataAllConfirmChange = $com.util.Clone(_list);
                        $("#femi-riskLevelItem-tbody").html($com.util.template(_list, HTML.TableModeItem));
                        $("#femi-riskLevelItem-tbody tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });

                    }

                });

            },
            getUser: function (data, fn, context) {
                var d = {
                    $URI: "/User/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
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
            //查询历史所有排班列表
            getSCHShift: function (data, fn, context) {
                var d = {
                    $URI: "/SCHShift/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //查询排班列表
            getSCHWorkerShiftAll: function (data, fn, context) {
                var d = {
                    $URI: "/SCHShiftWorker/ShiftAll",
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
            postSCHWorkerShiftAll: function (data, fn, context) {
                var d = {
                    $URI: "/SCHShiftWorker/ShiftUpdate",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //查询模板列表
            getSCHTemplate: function (data, fn, context) {
                var d = {
                    $URI: "/SCHTemplate/All",
                    $TYPE: "get"
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
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //查询工位职责
            getSCHPosition: function (data, fn, context) {
                var d = {
                    $URI: "/SCHPosition/All",
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
            //查询工位人员列表
            getSCHWorker: function (data, fn, context) {
                var d = {
                    $URI: "/SCHWorker/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //保存工位人员列表
            postSCHWorker: function (data, fn, context) {
                var d = {
                    $URI: "/SCHWorker/Update",
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
                    $URI: "/SCHWorker/Audit",
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
                    $URI: "/SCHWorker/Active",
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