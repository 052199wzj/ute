require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($zace, $com) {

    var KEYWORD_Level_LISTPro,
        KEYWORD_LevelPro,
        FORMATTRT_LevelPro,
        DEFAULT_VALUE_LevelPro,
        TypeSource_LevelPro,
		model,
        DataAllPro,
        DATABasic,
        DataAllFactorySearchPro,
        SearchAll,
        TemplateID,
        ModuleID,
        RoleNum,
        HTML;
    
    TemplateID = 0;
    ModuleID = 0;

    DataAllPro= [];   
    DataAllFactorySearchPro = [];
 
    ;
    HTML = {
        TableModePro: [
				'<tr>',
				'<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
				'<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
                //'<td data-title="Factory " data-value="{{Factory }}" >{{Factory }}</td>',
				'<td data-title="BusinessUnit" data-value="{{BusinessUnit}}" >{{BusinessUnit}}</td>',
				'<td data-title="WorkShop" data-value="{{WorkShop}}" >{{WorkShop}}</td>',
				'<td data-title="Line" data-value="{{Line}}" >{{Line}}</td>',
                   '<td data-title="ModuleID" data-value="{{ModuleID}}" >{{ModuleID}}</td>',
				'<td data-title="FunctionName" data-value="{{FunctionName}}" >{{FunctionName}}</td>',
                '<td data-title="PositionName" data-value="{{PositionName }}" >{{PositionName}}</td>',             
				//'<td data-title="TemplateID " data-value="{{TemplateID }}" >{{TemplateID }}</td>',
                '<td data-title="WorkerID" data-value="{{WorkerID}}" >{{WorkerID}}</td>',
                '<td data-title="Creator" data-value="{{Creator}}" >{{Creator}}</td>',
                '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
                '<td  style="display:none" data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
                //  '<td data-title="Editor" data-value="{{Editor}}" >{{Editor}}</td>',
                // '<td data-title="EditTime" data-value="{{EditTime}}" >{{EditTime}}</td>',
                //'<td data-title="Auditor" data-value="{{Auditor}}" >{{Auditor}}</td>',
                // '<td data-title="AuditTime" data-value="{{AuditTime}}" >{{AuditTime}}</td>',
                // '<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',
				'</tr>',
        ].join(""),



    }
    $(function () {
        KEYWORD_Level_LISTPro = [        
         "FunctionID|组名称|ArrayOne",
         "TemplateID|模板|ArrayOne",
         "ModuleID|职能|ArrayOne",
         "PositionID|岗位|ArrayOne",
         "Status|状态|ArrayOne",
         "Active|激活|ArrayOne",
         "WorkerID|人员|ArrayOne",
        ];
        KEYWORD_LevelPro = {};
        FORMATTRT_LevelPro = {};

        DEFAULT_VALUE_LevelPro = {

            FunctionID: 0,
            //Status: 0,
            PositionID: 0,
        };

        TypeSource_LevelPro = {
            Active: [
              {
                  name: "激活",
                  value: true
              }, {
                  name: "禁用",
                  value: false
              }
            ],
            FunctionID: [
              {
                  name: "无",
                  value: 0,
                  far: 0
              }
            ],
            PositionID: [
             {
                 name: "无",
                 value: 0,
                 far: 0
             }
            ],
            TemplateID: [],
            ModuleID: [],
            WorkerID: [],
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
           }, ],



        };

        $.each(KEYWORD_Level_LISTPro, function (i, item) {
            var detail = item.split("|");
            KEYWORD_LevelPro[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_LevelPro[detail[0]] = $com.util.getFormatter(TypeSource_LevelPro, detail[0], detail[2]);
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


            //工位人员修改
            $("body").delegate("#zace-edit-levelPro", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevelPro-tbody"), "WID", DataAllPro);

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
                    WorkerID: SelectData[0].WorkerID,
                    //PositionID: SelectData[0].PositionID,


                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    SelectData[0].WorkerID = Number(rst.WorkerID);
                    // SelectData[0].FunctionID = Number(rst.FunctionID);

                    if (SelectData[0].ID > 0) {
                        model.com.postSCHWorker({
                            data: SelectData[0],
                        }, function (res) {
                            alert("修改成功");
                            model.com.refreshPro();
                            //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                            //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                        })
                    } else {
                        DataAllPro[SelectData[0].WID - 1].WorkerID = Number(rst.WorkerID);
                        DataAllFactorySearchPro[SelectData[0].WID - 1].WorkerID = Number(rst.WorkerID);
                        $("#femi-riskLevelPro-tbody").html($com.util.template(DataAllFactorySearchPro, HTML.TableMode));
                    }
                }, TypeSource_Level));


            });



            //工位人员新增
            $("body").delegate("#zace-add-levelPro", "click", function () {

                //$("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "新增", function (rst) {
                //    //调用插入函数 
                //    if (!rst || $.isEmptyObject(rst))
                //        return;

                //    PositionTemp.PositionID = Number(rst.PositionID);
                //    PositionTemp.FunctionID = Number(rst.FunctionID);

                var list = [];
                for (var i = 0; i < DataAllPro.length; i++) {
                    if (DataAllPro[i].ID == 0) {
                        list.push(DataAllPro[i]);
                    }
                }

                var a = 0;
                $com.app.loading();

                var WhileAdd = function () {

                    model.com.postSCHWorker({
                        data: list[a],
                    }, function (res) {
                        a++;

                        if (a == list.length) {
                            $com.app.loaded();

                            alert("保存成功");
                            model.com.refreshPro();
                        } else {
                            WhileAdd();
                        }
                    });

                }

                if (list.length <= 0) {
                    alert("保存成功！！！");
                    return;
                } else {
                    WhileAdd();
                }



                //}, TypeSource_Level));


            });


            //跳转事业部
            $("body").delegate("#zace-business-level", "click", function () {
                var vdata = { 'header': '事业部', 'href': './factory_model/BusinessUnitSetting.html', 'id': 'BusinessUnitSetup', 'src': './static/images/menu/manageBOM.png' };
                window.parent.iframeHeaderSet(vdata);

            });
        },




        run: function () {

            //TemplateID = window.parent.UserParams["SCHWorkerSetup"].TemplateID;
            //ModuleID = window.parent.UserParams["SCHWorkerSetup"].ModuleID;


            model.com.getModuleAll({ module: 400001 }, function (resModule) {
                if (resModule && resModule.list) {
                    $.each(resModule.list, function (i, item) {
                        TypeSource_LevelPro.ModuleID.push({
                            name: item.ItemName,
                            value: item.ID,
                            far: null
                        })
                    });

                }

                model.com.getSCHTemplate({ OAGetType: 0 }, function (resP) {
                    if (resP && resP.list) {
                        $.each(resP.list, function (i, item) {
                            TypeSource_LevelPro.TemplateID.push({
                                name: item.Name,
                                value: item.ID,
                                far: null
                            })
                        });

                    }
                    model.com.getUser({}, function (res) {
                        if (res && res.list) {
                            $.each(res.list, function (i, item) {
                                TypeSource_LevelPro.WorkerID.push({
                                    name: item.Name,
                                    value: item.ID,
                                    far: null
                                })
                            });

                        }

                        model.com.refreshPro();
                    });
                    
                });
            });





        },

        com: {
            refreshPro: function () {
                //TemplateID = window.parent._zaceTemplateID;
                //ModuleID = window.parent._zaceModuleID;
                var name = FORMATTRT_LevelPro["TemplateID"](TemplateID);
                $(".zace-text-change").html(name);
                if (true) {
                    model.com.getSCHWorker({ OAGetType: 0, TemplateID: TemplateID, FunctionMode: ModuleID }, function (resP) {
                        if (!resP)
                            return;
                        if (resP && resP.list) {

                            var _listApproval = $com.util.Clone(resP.list);
                            for (var i = 0; i < _listApproval.length; i++) {
                                _listApproval[i].WID = i + 1;
                            }
                            DataAllPro = $com.util.Clone(_listApproval);
                            $.each(_listApproval, function (i, item) {
                                for (var p in item) {
                                    if (!FORMATTRT_LevelPro[p])
                                        continue;
                                    item[p] = FORMATTRT_LevelPro[p](item[p]);
                                }
                            });
                            DataAllFactorySearchPro = $com.util.Clone(_listApproval);
                            $("#femi-riskLevelPro-tbody").html($com.util.template(_listApproval, HTML.TableModePro));

                        }

                    });
                }
               



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
            //查询排班列表
            getSCHWorkerShiftAll: function (data, fn, context) {
                var d = {
                    $URI: "/SCHWorker/ShiftAll",
                    $TYPE: "get"
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