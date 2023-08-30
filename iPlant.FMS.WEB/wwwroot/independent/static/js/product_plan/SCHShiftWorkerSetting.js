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
        SelectedWorkShop,
		SelectedLine,
        Selectedmodule,
        Selectedtemplate,
        RoleNum,
        ShiftID,
        DataWorkderList,
        HTML;
    RoleNum = -1;
    DataAll = SearchAll = DataWorkderList=[];
    DATABasic = [];
    DataAllConfirmBasic = [];
    DataAllConfirmChange = [];
    DataAllConfirm = [];
    DataAllFactorySearch = DataAllSearch = [];
    PositionTemp = {
        Active: true,

        Available: true,
        BusinessUnit: "",

        Factory: "",
        FunctionID: 0,
        FunctionName: "",
        ID: 0,
        Line: "",
        LineID: 0,
        ModuleID: 0,
        ModuleName: "",
        PositionID: 0,
        PositionName: "",
        ShiftID: 0,
        ShiftName: "",
        WorkerName: "",
        WorkerID: 0,
        TemplateID: 1,
        Status: 1,
        StatusText: "",
        WorkShop: "",
        WorkShopID: 0,
    };
    ShiftID=0;
    SelectedWorkShop=1;
    SelectedLine = 1;
    Selectedmodule = 1;
    Selectedtemplate = 1;

    SelectedWorkShopPro = 0;
    SelectedLinePro = 0;
    SelectedmodulePro = 0;
    SelectedtemplatePro = 0;
    HTML = {
        TableMode: [
				'<tr data-color="">',
				'<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
				'<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
                 '<td data-title="ShiftID" data-value="{{ShiftID}}" >{{ShiftID}}</td>',
                '<td data-title="Factory" data-value="{{Factory}}" >{{Factory}}</td>',
				'<td data-title="BusinessUnit" data-value="{{BusinessUnit}}" >{{BusinessUnit}}</td>',
				'<td data-title="WorkShop" data-value="{{WorkShop}}" >{{WorkShop}}</td>',
				'<td data-title="Line" data-value="{{Line}}" >{{Line}}</td>',
                  '<td data-title="ModuleID" data-value="{{ModuleID}}" >{{ModuleID}}</td>',
				'<td data-title="FunctionName  " data-value="{{FunctionName}}" >{{FunctionName}}</td>',
                '<td data-title="PositionName " data-value="{{PositionName }}" >{{PositionName}}</td>',  
				//'<td data-title="TemplateID " data-value="{{TemplateID }}" >{{TemplateID }}</td>',
                '<td data-title="WorkerID" data-value="{{WorkerID}}" >{{WorkerID}}</td>',
                '<td data-title="Creator" data-value="{{Creator}}" >{{Creator}}</td>',
                 '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
                 '<td style="display:none" data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
				'</tr>',
        ].join(""),
        TableLiItemNode: [
                 '<li data-value="{{value}}" > ',
                 '<a href="javascript:;"> ',
                 '<span class=" glyphicon glyphicon-ok" aria-hidden="true" >{{name}}</span> ',
                 '</a> ',
                 '</li> ',
        ].join(""),

    }
    $(function () {
        KEYWORD_Level_LIST = [
         "WorkShopID|车间|ArrayOne",
         "LineID|产线|ArrayOneControl",
         "ModuleID|职能类别|ArrayOneControl",
         "TemplateID|模板|ArrayOneControl|LineID,ModuleID",
         "PositionID|岗位|ArrayOne",
         "SDate|日期|Date",
         "Shift|班次|ArrayOne",
         "WorkerID|人员|ArrayOne",
        ];
        KEYWORD_Level = {};
        FORMATTRT_Level = {};

        DEFAULT_VALUE_Level = {

            FunctionID: 0,
            //Status: 0,
            PositionID: 0,
        };

        TypeSource_Level = {
            ModuleID: [           
            ],
            WorkShopID: [
            ],
            LineID: [             
            ],
            WorkerID: [
            ],
            TemplateID: [           
            ],

            Shift: [              
           {
               name: "白班",
               value: 1
           }, 
           {
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


            //工位人员修改
            $("body").delegate("#zace-edit-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "WID", DataAll);

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

                    var _alistApproval = $com.util.Clone(DataAll);
                    $.each(_alistApproval, function (i, item) {
                        for (var p in item) {
                            if (!FORMATTRT_Level[p])
                                continue;
                            item[p] = FORMATTRT_Level[p](item[p]);
                        }
                    });
       
                    $("#femi-riskLevel-tbody").html($com.util.template(_alistApproval, HTML.TableMode));
                  
                    $("#femi-riskLevel-tbody tr").each(function (i, item) {
                        var $this = $(this);
                        var colorName = $this.css("background-color");
                        $this.attr("data-color", colorName);



                    });
                    //model.com.postSCHWorkerShiftAll({
                    //    data: DataAll,
                    //    ModuleID: Selectedmodule,
                    //    ShiftID: ShiftID,
                    //}, function (res) {
                    //    alert("修改成功");
                    //    model.com.refresh();
                    //    //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                    //    //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    //})

                }, TypeSource_Level));


            });



            //保存
            $("body").delegate("#zace-add-level", "click", function () {

                //$("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "新增", function (rst) {
                //    //调用插入函数 
                //    if (!rst || $.isEmptyObject(rst))
                //        return;

                //    PositionTemp.PositionID = Number(rst.PositionID);
                //    PositionTemp.FunctionID = Number(rst.FunctionID);

                //var list = [];
                //for (var i = 0; i < DataAll.length; i++) {
                //    if (DataAll[i].ID == 0) {
                //        list.push(DataAll[i]);
                //    }
                //}
                //if (list.length <= 0) {
                //    alert("保存成功！！！");
                //    return;
                //}
                if (!confirm("确认保存吗？")) {
                    return false;
                }
                for (var i = 0; i < DataAll.length; i++) {
                    if (DataAll[i].WorkerID == 0) {
                        alert("请给岗位安排人员！！！")
                        return false;
                    }
                }
                model.com.postSCHWorkerShiftAll({
                    data: DataAll,
                    ModuleID: Selectedmodule,
                    ShiftID: ShiftID,
                }, function (res) {

                    alert("保存成功");
                    model.com.refresh();
                }
                );



                //}, TypeSource_Level));


            });


            //跳转
            $("body").delegate("#zace-eye-level", "click", function () {
                var vdata = { 'header': '排班记录', 'href': './product_plan/SCHShiftWorkerInfo.html', 'id': 'SCHShiftWorkerInfo', 'src': './static/images/menu/basicSet/workingProcess.png' };
                window.parent.iframeHeaderSet(vdata);

            });
            //车间
            $("body").delegate(".workshop-items>li", "click", function () {
                var $this = $(this);
                SelectedWorkShop = Number($this.attr("data-value"));
                $("#workShopChoose").html(FORMATTRT_Level.WorkShopID(SelectedWorkShop));

                ////渲染line选择框
                //var _LineList = $com.util.findAll(TypeSource_Level.LineID, function (item_l) {
                //    return item_l.far == SelectedWorkShop;
                //});

                //$(".line-items").html($com.util.template(_LineList, HTML.TableLiItemNode));              
            });
            //产线
            $("body").delegate(".line-items>li", "click", function () {
                var $this = $(this);
                SelectedLine = Number($this.attr("data-value"));
                $("#lineChoose").html(FORMATTRT_Level.LineID(SelectedLine));
                ////渲染template选择框
                var _PartList = $com.util.findAll(TypeSource_Level.TemplateID, function (item_p) {
                    return item_p.far == (SelectedLine +"_"+ Selectedmodule);
                });
                $(".template-items").html($com.util.template(_PartList, HTML.TableLiItemNode));
             
            });
            //职能
            $("body").delegate(".module-items>li", "click", function () {
                var $this = $(this);
                Selectedmodule = Number($this.attr("data-value"));
                $("#moduleChoose").html(FORMATTRT_Level.ModuleID(Selectedmodule));

                var _PartList = $com.util.findAll(TypeSource_Level.TemplateID, function (item_p) {
                    return item_p.far == (SelectedLine + "_" + Selectedmodule);
                });
                $(".template-items").html($com.util.template(_PartList, HTML.TableLiItemNode));
            });
            //模板
            $("body").delegate(".template-items>li", "click", function () {
                var $this = $(this);
                Selectedtemplate = Number($this.attr("data-value"));
                $("#templateChoose").html(FORMATTRT_Level.TemplateID(Selectedtemplate));


             

            });

            $("body").delegate("#zace-search-level", "click", function () {
                var default_value = {
                    SDate: $com.util.format('yyyy-MM-dd', new Date()),
                    Shift: 1,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.SDate = $com.util.format('yyyy-MM-dd', rst.SDate);
                    default_value.Shift = Number(rst.Shift);
                   
                    ShiftID = model.com.getshiftID(default_value.SDate) * 10 + default_value.Shift;
                    SelectedWorkShopPro = SelectedWorkShop;
                    SelectedLinePro = SelectedLine;
                    SelectedmodulePro = Selectedmodule;
                    SelectedtemplatePro = Selectedtemplate;
                    model.com.refresh();
                  
                }, TypeSource_Level));


            });
          
        },




        run: function () {
          
            //model.com.getFMCLine({ FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0 }, function (resGroup) {
            //    DataAll_Line = resGroup.list;
            //    $("#workshop_select").empty();

            //    for (var i = 0; i < DataAll_Line.length; i++) {
            //        $("#workshop_select").append("<option value='" + DataAll_Line[i].ID + "'>" + DataAll_Line[i].Name + "</option>");
            //    }
            //    var obj = document.getElementById("workshop_select");
            //    for (i = 0; i < obj.length; i++) {
            //        if (obj[i].value == 1) {
            //            obj[i].selected = true;
            //            break;
            //        }
            //    }
            //   // $("#workshop_select").selectpicker();


            //});
            model.com.getFMCWorkShop({ FactoryID: 0, BusinessUnitID: 0 }, function (resW) {
                if (resW && resW.list) {
                    var _listW = $com.util.Clone(resW.list);
                    DataWorkShoplist = resW.list;
                    $.each(resW.list, function (i, item) {
                        TypeSource_Level.WorkShopID.push({
                            name: item.Name,
                            value: item.ID,
                            far:0,
                        });
                    });
                    SelectedWorkShop = _listW[0].ID;
                   
                    $(".workshop-items").html($com.util.template(TypeSource_Level.WorkShopID, HTML.TableLiItemNode));
                }
                       
            model.com.getFMCLine({ FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0 }, function (resW) {
                if (resW && resW.list) {
                    DataLinelist = resW.list;
                    var _listL = $com.util.Clone(resW.list);
                    $.each(resW.list, function (i, item) {
                        TypeSource_Level.LineID.push({
                            name: item.Name,
                            value: item.ID,
                            far: 0

                        });
                    });
                    SelectedLine = _listL[0].ID;                   
                    $(".line-items").html($com.util.template(TypeSource_Level.LineID, HTML.TableLiItemNode));
                }

                model.com.getSCHTemplate({ OAGetType: 0 }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var _listT = $com.util.Clone(resP.list);
                        $.each(resP.list, function (i, item) {
                            TypeSource_Level.TemplateID.push({
                                name: item.Name,
                                value: item.ID,
                                far: item.LineID +"_"+ item.ModuleID,
                            });
                        });
                    
                        Selectedtemplate = _listT[0].ID;
                    }
                    model.com.getModuleAll({ module: 400001 }, function (resModule) {
                    //model.com.getFunction({ workshopID: 0, lineID: 0 }, function (resModule) {
                        if (resModule && resModule.list) {
                            var _listM = $com.util.Clone(resModule.list);
                            $.each(resModule.list, function (i, item) {
                                TypeSource_Level.ModuleID.push({
                                    name: item.ItemName,
                                    value: item.ID,
                                    far: 0
                                })
                            });
                            Selectedmodule = _listM[0].ID;
                            $(".module-items").html($com.util.template(TypeSource_Level.ModuleID, HTML.TableLiItemNode));

                            var _PartList = $com.util.findAll(TypeSource_Level.TemplateID, function (item_p) {
                                return item_p.far == (SelectedLine + "_" + Selectedmodule);
                            });
                            $(".template-items").html($com.util.template(_PartList, HTML.TableLiItemNode));

                        }
                        model.com.getUser({}, function (resU) {
                            if (resU && resU.list) {
                                $.each(resU.list, function (i, item) {
                                    TypeSource_Level.WorkerID.push({
                                        name: item.Name,
                                        value: item.ID,
                                    })
                                });
                            }
                            var Today = $com.util.format('yyyy-MM-dd', new Date());
                            ShiftID = model.com.getshiftID(Today) * 10 + 1;

                            SelectedWorkShopPro = SelectedWorkShop;
                            SelectedLinePro = SelectedLine;
                            SelectedmodulePro = Selectedmodule;
                            SelectedtemplatePro = Selectedtemplate;
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
                                TypeSource_Level.WorkerID = [];
                                $.each(res.list, function (i, item) {
                                    TypeSource_Level.WorkerID.push({
                                        name: item.Name,
                                        value: item.ID,
                                    })
                                });
                            }
                            window.parent._zaceUserAll = 0;
                        });

                    }


                    if (window.parent._zaceTemplateMode && window.parent._zaceTemplateMode == 1) {
                        model.com.getSCHTemplate({ OAGetType: 0 }, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {
                                //TypeSource_Level.AuditorID.splice(1, TypeSource_Level.AuditorID.length - 1);
                                TypeSource_Level.TemplateID = [];
                                $.each(resW.list, function (i, item) {
                                    TypeSource_Level.TemplateID.push({
                                        name: item.Name,
                                        value: item.ID,
                                        far: item.LineID + "_" + item.ModuleID,
                                    });
                                });
                            }
                            window.parent._zaceTemplateMode = 0;
                        });

                    }

                    model.com.setMMM();
                }, 500);

            },
            refresh: function () {
               
                $("#workShopChoose").html(FORMATTRT_Level.WorkShopID(SelectedWorkShopPro));
                $("#lineChoose").html(FORMATTRT_Level.LineID(SelectedLinePro));
                $("#moduleChoose").html(FORMATTRT_Level.ModuleID(SelectedmodulePro));
                $("#templateChoose").html(FORMATTRT_Level.TemplateID(SelectedtemplatePro));
                model.com.getSCHWorker({ OAGetType: 0, TemplateID: SelectedtemplatePro, FunctionMode: SelectedmodulePro }, function (resPZ) {
                    if (!resPZ)
                        return;
                    if (resPZ && resPZ.list) {
                        DataWorkderList = $com.util.Clone(resPZ.list);

                    }
                    model.com.getSCHWorkerShiftAll({ WorkShop: SelectedWorkShopPro, LineID: SelectedLinePro, ModuleID: SelectedmodulePro, ShiftID: ShiftID, OAGetType: 0, }, function (resP) {
                        if (!resP)
                            return;
                        if (resP && resP.list) {

                            //审核数据
                            DataAllConfirm = $com.util.Clone(resP.list);
                            var _listApproval = $com.util.Clone(resP.list);
                            if (Selectedtemplate > 0 && _listApproval.length > 0 && _listApproval[0].ID==0) {
                                for (var i = 0; i < DataWorkderList.length; i++) {
                                    _listApproval[i].TemplateID = Selectedtemplate;
                                    _listApproval[i].WorkerID = DataWorkderList[i].WorkerID;

                                }
                            }
                            for (var i = 0; i < _listApproval.length; i++) {
                                _listApproval[i].WID = i + 1;
                            }
                            DataAll = $com.util.Clone(_listApproval);
                            $.each(_listApproval, function (i, item) {
                                for (var p in item) {
                                    if (!FORMATTRT_Level[p])
                                        continue;
                                    item[p] = FORMATTRT_Level[p](item[p]);
                                }
                            });
                            DataAllFactorySearch = $com.util.Clone(_listApproval);
                            if (SelectedWorkShop == 0 || SelectedLine == 0 || Selectedmodule == 0 || ShiftID == 0) {
                                var _listz = [];
                                $("#femi-riskLevel-tbody").html($com.util.template(_listz, HTML.TableMode));
                                $("#femi-riskLevel-tbody tr").each(function (i, item) {
                                    var $this = $(this);
                                    var colorName = $this.css("background-color");
                                    $this.attr("data-color", colorName);



                                });
                            } else {
                                $("#femi-riskLevel-tbody").html($com.util.template(_listApproval, HTML.TableMode));
                                $("#femi-riskLevel-tbody tr").each(function (i, item) {
                                    var $this = $(this);
                                    var colorName = $this.css("background-color");
                                    $this.attr("data-color", colorName);



                                });
                            }
                        }

                    });
                });
               


                //model.com.getSCHShift({ WorkShop: 0, LineID: 0, ModuleID: 1, ShiftID: 2019051201, OAGetType: 0, }, function (resP) {
                //    if (!resP)
                //        return;
                //    if (resP && resP.list) {

                //        Z = resP.list;
                //    }

                //});

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
        }
    }),

    model.init();


});