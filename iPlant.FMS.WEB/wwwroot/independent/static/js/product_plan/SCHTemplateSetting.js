require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($zace, $com) {

    var KEYWORD_Level_LIST,
        KEYWORD_Level,
        FORMATTRT_Level,
        DEFAULT_VALUE_Level,
        TypeSource_Level,

        KEYWORD_Level_LISTPro,
        KEYWORD_LevelPro,
        FORMATTRT_LevelPro,
        DEFAULT_VALUE_LevelPro,
        TypeSource_LevelPro,
		model,
        DataAll,
        DATABasic,
        DataAllConfirmBasic,
        DataAllConfirmChange,
        DataAllConfirm,
        DataAllSearch,
        DataAllFactorySearch,
        SearchAll,
        DataAllPro,
        DataAllFactorySearchPro,
        RoleNum,
          TemplateID,
        ModuleID,
        HTML;

    DataAllPro = [];
    DataAllFactorySearchPro = [];
    RoleNum = -1;
    TemplateID = 0;
    ModuleID = 0;
    DataAll = SearchAll = [];
    DATABasic = [];
    DataAllConfirmBasic = [];
    DataAllConfirmChange = [];
    DataAllConfirm = [];
    DataAllFactorySearch = DataAllSearch = [];
    PositionTemp = {
        Active: true,
        BusinessUnit: "",
        Factory: "",
        CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Creator: window.parent.User_Info.Name,
        CreatorID: 0,
        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Editor: window.parent.User_Info.Name,
        EditorID: 0,
        ID: 0,
        Line: "",
        LineID: 0,
        ModuleID: 0,
        ModuleName: "",
        Name: "",
        WorkShop: "",
        WorkShopID: 0,
    };


    ;
    HTML = {
        TableMode: [
				'<tr data-color="">',
				'<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
				'<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
                '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
				'<td data-title="BusinessUnit" data-value="{{BusinessUnit}}" >{{BusinessUnit}}</td>',
				//'<td data-title="Factory" data-value="{{Factory}}" >{{Factory}}</td>',
				'<td data-title="WorkShop" data-value="{{WorkShop}}" >{{WorkShop}}</td>',
                '<td data-title="Line" data-value="{{Line}}" >{{Line}}</td>',
				'<td data-title="ModuleID" data-value="{{ModuleID}}" >{{ModuleID}}</td>',
                
                '<td data-title="Creator" data-value="{{Creator}}" >{{Creator}}</td>',
                 '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
                  '<td data-title="Editor" data-value="{{Editor}}" >{{Editor}}</td>',
                 '<td data-title="EditTime" data-value="{{EditTime}}" >{{EditTime}}</td>',
                 '<td data-title="Active" data-value="{{Active}}" >{{Active}}</td>',
				'</tr>',
        ].join(""),
        TableModePro: [
				'<tr data-color="">',
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
    //模板
    $(function () {
        KEYWORD_Level_LIST = [
         "Name|名称",
         "WorkShopID|车间|ArrayOne",
         "LineID|产线|ArrayOne",
         "ModuleID|职能|ArrayOne",
         "Active|激活|ArrayOne",
        ];
        KEYWORD_Level = {};
        FORMATTRT_Level = {};

        DEFAULT_VALUE_Level = {
            Name: "",
            LineID: 0,
            WorkShopID: 0,
            ModuleID: 0,

        };

        TypeSource_Level = {
            Active: [
              {
                  name: "激活",
                  value: true
              }, {
                  name: "禁用",
                  value: false
              }
            ],
            WorkShopID: [
              //{
              //    name: "无",
              //    value: 0,
              //    far: 0
              //}
            ],
            LineID: [
             //{
             //    name: "无",
             //    value: 0,
             //    far: 0
             //}
            ],
            ModuleID: [
           //{
           //    name: "默认值",
           //    value: 0,            
           //}
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
    });
    //岗位人员
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
            //条件查询
            $("body").delegate("#zace-searchZall-level", "click", function () {
                var default_value = {

                    ModuleID: 0,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.ModuleID = Number(rst.ModuleID);
                    $com.table.filterByConndition($("#femi-riskLevel-tbody"), DataAll, default_value, "ID");

                }, TypeSource_Level));


            });
            //模板查询
            $("body").delegate("#zace-search-level", "change", function () {

                var $this = $(this),
                   value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "ID");



            });
            //模板修改
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
                    WorkShopID: SelectData[0].WorkShopID,
                    LineID: SelectData[0].LineID,
                    Name: SelectData[0].Name,
                    ModuleID: SelectData[0].ModuleID,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].Name = rst.Name;
                    SelectData[0].LineID = Number(rst.LineID);
                    SelectData[0].WorkShopID = Number(rst.WorkShopID);
                    SelectData[0].ModuleID = Number(rst.ModuleID);

                    model.com.postSCHTemplate({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                        //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                        //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    })

                }, TypeSource_Level));


            });

            //模板激活
            $("body").delegate("#zace-active-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }

                model.com.activeAudit({
                    data: SelectData,
                    Active: 1,
                }, function (res) {
                    alert("激活成功");
                    model.com.refresh();


                })




            });
            //模板禁用
            $("body").delegate("#zace-disable-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }

                model.com.activeAudit({
                    data: SelectData,
                    Active: 0,
                }, function (res) {
                    alert("禁用成功");
                    model.com.refresh();


                })

            });

            //模板新增
            $("body").delegate("#zace-add-level", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    PositionTemp.Name = rst.Name;
                    PositionTemp.LineID = Number(rst.LineID);
                    PositionTemp.WorkShopID = Number(rst.WorkShopID);
                    PositionTemp.ModuleID = Number(rst.ModuleID);
                    model.com.postSCHTemplate({
                        data: PositionTemp,
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                    })

                }, TypeSource_Level));


            });

            //zace-send-schPosition
            //跳转
            $("body").delegate("#zace-send-schPosition", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！")
                    return;
                }
                TemplateID = SelectData[0].ID;
                ModuleID = SelectData[0].ModuleID;

                //window.parent._zaceTemplateID = TemplateID;
                //window.parent._zaceModuleID = ModuleID;
                //var vdata = { 'header': '岗位人员', 'href': './basic_Set/SCHWorkerSetting.html', 'id': 'SCHWorkerSetup', 'src': './static/images/menu/basicSet/workingProcess.png', 'TemplateID': TemplateID, 'ModuleID': ModuleID, };
                //window.parent.iframeHeaderSet(vdata);
                $(".zzza").hide();
                $(".zzzab").show();
                model.com.refreshPro();
            });
            $("body").delegate("#zace-return-levelPro", "click", function () {
                $(".zzza").show();
                $(".zzzab").hide();

            });
            //跳转
            $("body").delegate("#zace-send-staPosition", "click", function () {
                var vdata = { 'header': '工位人员', 'href': './basic_Set/StaPositionSetting.html', 'id': 'StaPositionSetting', 'src': './static/images/menu/basicSet/positionSet.png' };
                window.parent.iframeHeaderSet(vdata);

            });
            //人员修改
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
                $("body").append($com.modal.show(default_value, KEYWORD_LevelPro, "修改", function (rst) {
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
                        DataAllFactorySearchPro[SelectData[0].WID - 1].WorkerID = FORMATTRT_LevelPro["WorkerID"](Number(rst.WorkerID))
                        $("#femi-riskLevelPro-tbody").html($com.util.template(DataAllFactorySearchPro, HTML.TableModePro));
                        $("#femi-riskLevelPro-tbody tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });
                    }
                }, TypeSource_LevelPro));


            });



            //工位人员新增
            $("body").delegate("#zace-add-levelPro", "click", function () {

                //$("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "新增", function (rst) {
                //    //调用插入函数 
                //    if (!rst || $.isEmptyObject(rst))
                //        return;

                //    PositionTemp.PositionID = Number(rst.PositionID);
                //    PositionTemp.FunctionID = Number(rst.FunctionID);
                if (!confirm("确定保存吗？")) {
                    return false;
                }
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
                    alert("请修改数据即可！！！");
                    return;
                } else {
                    WhileAdd();
                }



                //}, TypeSource_Level));


            });
        },




        run: function () {




            model.com.getFMCLine({ FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0 }, function (resW) {
                if (resW && resW.list) {
                    $.each(resW.list, function (i, item) {
                        TypeSource_Level.LineID.push({
                            name: item.Name,
                            value: item.ID,
                            far: 0
                            //item.WorkShopID
                        });
                    });

                }
                model.com.getFMCWorkShop({ FactoryID: 0, BusinessUnitID: 0 }, function (resW) {
                    if (resW && resW.list) {
                        $.each(resW.list, function (i, item) {
                            TypeSource_Level.WorkShopID.push({
                                name: item.Name,
                                value: item.ID,
                                far: 0
                            });
                        });

                    }
                    model.com.getModuleAll({ module: 400001 }, function (resModule) {
                        //model.com.getFunction({ workshopID: 0, lineID: 0 }, function (resModule) {
                        if (resModule && resModule.list) {
                            $.each(resModule.list, function (i, item) {
                                TypeSource_Level.ModuleID.push({
                                    name: item.ItemName,
                                    value: item.ID,
                                    far: null
                                })
                            });
                            TypeSource_LevelPro.ModuleID = TypeSource_Level.ModuleID;
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
                                model.com.setMMM();
                                model.com.refresh();
                            });

                        });
                    });

                });


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
                                TypeSource_LevelPro.WorkerID = [];
                                $.each(res.list, function (i, item) {
                                    TypeSource_LevelPro.WorkerID.push({
                                        name: item.Name,
                                        value: item.ID,
                                        far: null
                                    })
                                });
                            }
                            window.parent._zaceUserAll = 0;
                        });

                    }
                    if (window.parent._zaceWorkShop && window.parent._zaceWorkShop == 1) {
                        model.com.getFMCWorkShop({ FactoryID: 0, BusinessUnitID: 0 }, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {
                                //TypeSource_Level.AuditorID.splice(1, TypeSource_Level.AuditorID.length - 1);
                                TypeSource_Level.WorkShopID = [];
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

                    if (window.parent._zaceLineSet && window.parent._zaceLineSet == 1) {
                        model.com.getFMCLine({ FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0 }, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {
                                //TypeSource_Level.AuditorID.splice(1, TypeSource_Level.AuditorID.length - 1);
                                TypeSource_Level.LineID = [];
                                $.each(resW.list, function (i, item) {
                                    TypeSource_Level.LineID.push({
                                        name: item.Name,
                                        value: item.ID,
                                        far: 0
                                        //item.WorkShopID
                                    });
                                });
                            }
                            window.parent._zaceLineSet = 0;
                        });

                    }

                    if (window.parent._zaceTemplateMode && window.parent._zaceTemplateMode == 1) {
                        model.com.getSCHTemplate({ OAGetType: 0 }, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {
                                //TypeSource_Level.AuditorID.splice(1, TypeSource_Level.AuditorID.length - 1);
                                TypeSource_LevelPro.TemplateID = [];
                                $.each(resW.list, function (i, item) {
                                    TypeSource_LevelPro.TemplateID.push({
                                        name: item.Name,
                                        value: item.ID,
                                        far: null
                                    })
                                });
                            }
                            window.parent._zaceTemplateMode = 0;
                        });

                    }

                    model.com.setMMM();
                }, 500);

            },

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
                            $("#femi-riskLevelPro-tbody tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);



                            });
                        }

                    });
                }




            },
            refresh: function () {
                model.com.getSCHTemplate({ OAGetType: 0 }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {

                        //审核数据
                        DataAllConfirm = $com.util.Clone(resP.list);
                        var _listApproval = $com.util.Clone(resP.list);

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
                model.com.getSCHTemplate({ OAGetType: 0 }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {

                        DataAllConfirmChange = $com.util.Clone(resP.list);;

                        DataAllConfirmBasic = $com.util.Clone(DataAllConfirmChange);

                        var _listC = $com.util.Clone(DataAllConfirmChange);
                        $.each(_listC, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }
                        });
                        DataAllSearch = $com.util.Clone(_listC);
                        $("#femi-riskLevelAudit-tbody").html($com.util.template(_listC, HTML.TableMode));
                        $("#femi-riskLevelAudit-tbody tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });


                    }

                });
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
            //查询岗位职能列表
            getFunction: function (data, fn, context) {
                var d = {
                    $URI: "/BPMFunction/All",
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
            //查询岗位职能列表
            getPosition: function (data, fn, context) {
                var d = {
                    $URI: "/BPMFunction/All",
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
            //保存模板列表
            postSCHTemplate: function (data, fn, context) {
                var d = {
                    $URI: "/SCHTemplate/Update",
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
                    $URI: "/SCHTemplate/Audit",
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
                    $URI: "/SCHTemplate/Active",
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