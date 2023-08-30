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
        RoleNum,
        DataModuleList,
        HTML;
    RoleNum = -1;
    DataAll =SearchAll= [];
    DATABasic = [];
    DataAllConfirmBasic = [];
    DataAllConfirmChange = [];
    DataAllConfirm = [];
    DataAllFactorySearch = DataAllSearch = [];
    DataModuleList = [];
    PositionTemp = {
        Auditor: window.parent.User_Info.Name,
        AuditorID: 0,
        AuditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Creator: window.parent.User_Info.Name,
        CreatorID: 0,
        FunctionID: 0,
        ModuleID: 0,
        ModuleName :"",
        FunctionText: "",
        ID: 0,
        LineID: 0,
        LineName: "",
        Name: "",
        Status: 1,
        StatusText: "",
        Text: "",
        ParentID: 0,
        ParentName: "",
        VersionText: "",
        WorkShopID: 0,
        WorkShopName: ""
    };


    ;
    HTML = {
        TableMode: [
				'<tr>',
				'<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                //'<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
				'<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
                '<td data-title="ModuleName" data-value="{{ModuleName}}" >{{ModuleName}}</td>',
                '<td data-title="FunctionID" data-value="{{FunctionID}}" >{{FunctionID}}</td>',
				'<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
                '<td data-title="VersionText" data-value="{{VersionText}}" >{{VersionText}}</td>',
                 //'<td data-title="Text" data-value="{{Text}}" >{{Text}}</td>',
				'<td data-title="WorkShopID" data-value="{{WorkShopID}}" >{{WorkShopID}}</td>',
				'<td data-title="LineID" data-value="{{LineID}}" >{{LineID}}</td>',
            
                '<td data-title="ParentID" data-value="{{ParentID}}" >{{ParentID}}</td>',
                '<td data-title="Creator" data-value="{{Creator}}" >{{Creator}}</td>',
                 '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
                '<td data-title="Auditor" data-value="{{Auditor}}" >{{Auditor}}</td>',
                 '<td data-title="AuditTime" data-value="{{AuditTime}}" >{{AuditTime}}</td>',
                 '<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',
				'</tr>',
        ].join(""),



    };
    (function () {
        KEYWORD_Level_LIST = [
         "Name|名称",
         "VersionText|编码",
         "Text|备注",
         "WorkShopID|车间|ArrayOne",
         "LineID|产线|ArrayOne",
         "FunctionID|组名称|ArrayOne",
         "ParentID|上级岗位|ArrayOne",
          //"ParentID|上级岗位",
         "CreateTime|时间|DateTime",
         "AuditTime|时间|DateTime",
        ];
        KEYWORD_Level = {};
        FORMATTRT_Level = {};

        DEFAULT_VALUE_Level = {
            FunctionID: 0,
            LineID: 0,
            Name: "",
            //Status: 0,
            //Text: "",
            VersionText: "",
            ParentID:0,
            WorkShopID: 0,
        };

        TypeSource_Level = {
            FunctionID: [
              {
                  name: "无",
                  value: 0
              }
            ],
            ParentID: [
             {
                 name: "无",
                 value: 0
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

            //导出
            $("body").delegate("#zace-logout-tableOrder", "click", function () {
                var $table = $(".table-partApproval"),
                    fileName = "岗位管理.xls",
                    Title = "岗位管理";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });

            });


            //岗位角色查询
            $("body").delegate("#zace-search-level", "input", function () {

                var $this = $(this),
                   value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "ID");



            });
            //岗位角色修改
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
                if (SelectData[0].Status != 1) {
                    alert("数据选择有误,请选择状态为创建的数据")
                    return;
                }
                var default_value = {
                    Name: SelectData[0].Name,
                    VersionText: SelectData[0].VersionText,
                   // Text: SelectData[0].Text,
                    FunctionID: SelectData[0].FunctionID,
                    WorkShopID: SelectData[0].WorkShopID,
                    LineID: SelectData[0].LineID,
                    ParentID: SelectData[0].ParentID,


                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].VersionText = rst.VersionText;
                   // SelectData[0].Text = rst.Text;
                    SelectData[0].Name = rst.Name;
                    SelectData[0].FunctionID = Number(rst.FunctionID);

                    SelectData[0].WorkShopID = Number(rst.WorkShopID);
                    SelectData[0].LineID = Number(rst.LineID);
                    SelectData[0].ParentID = Number(rst.ParentID);
                    for (var i = 0; i < DataModuleList.length; i++) {
                        if (SelectData[0].FunctionID == DataModuleList[i].ID) {
                            SelectData[0].ModuleID = DataModuleList[i].ModuleID;
                            SelectData[0].ModuleName = DataModuleList[i].ModuleName;

                        }
                    }
                    for (var i = 0; i < SelectData.length; i++) {

                        $com.util.deleteLowerProperty(SelectData[i]);
                    }
                    model.com.postPosition({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                        //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                        //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    })

                }, TypeSource_Level));


            });
         
            //岗位角色新增
            $("body").delegate("#zace-add-level", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    PositionTemp.FunctionID = Number(rst.FunctionID);
                    PositionTemp.ParentID = Number(rst.ParentID);
                    PositionTemp.WorkShopID = Number(rst.WorkShopID);
                    PositionTemp.LineID = Number(rst.LineID);
                    PositionTemp.Name = rst.Name;
                    //PositionTemp.Status = Number(rst.Status);
                   // PositionTemp.Text = rst.Text;
                    PositionTemp.VersionText = rst.VersionText;


                    for (var i = 0; i < DataModuleList.length; i++) {
                        if (PositionTemp.FunctionID == DataModuleList[i].ID) {
                            PositionTemp.ModuleID = DataModuleList[i].ModuleID;
                            PositionTemp.ModuleName = DataModuleList[i].ModuleName;

                        }
                    }


                    model.com.postPosition({
                        data: PositionTemp,
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                    })

                }, TypeSource_Level));


            });
            //岗位角色提交
            $("body").delegate("#zace-up-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }

                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].Status == 2 || SelectData[i].Status == 0) {
                        alert("数据选择有误,请选择状态为创建的数据!");
                        return;

                    }
                    else if (SelectData[i].Status == 3 || SelectData[i].Status == 4) {
                        alert("数据选择有误,请选择状态为创建的数据!");
                        return;
                    }

                }
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其提交？")) {
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {

                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                var a = 0;
                for (var i = 0; i < SelectData.length; i++) {

                    //var wid = SelectData[i].WID;
                    SelectData[i].Status = 2;
                    model.com.postPosition({
                        data: SelectData[i],
                    }, function (res) {
                        a++;
                        if (a == SelectData.length) {
                            alert("提交成功");
                            model.com.refresh();
                        }
                    })
                }
            });
            //岗位角色撤销
            $("body").delegate("#zace-return-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }

                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].Status == 1 || SelectData[i].Status == 0) {
                        alert("数据选择有误,请选择状态为待审核的数据!");
                        return;

                    }
                    else if (SelectData[i].Status == 3 || SelectData[i].Status == 4) {
                        alert("数据选择有误,请选择状态为待审核的数据!");
                        return;
                    }

                }
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其撤回？")) {
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {

                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                var a = 0;
                for (var i = 0; i < SelectData.length; i++) {

                    //var wid = SelectData[i].WID;
                    SelectData[i].Status = 1;

                    model.com.postPosition({
                        data: SelectData[i],
                    }, function (res) {
                        a++;
                        if (a == SelectData.length) {
                            alert("撤销成功");
                            model.com.refresh();
                        }
                    })
                }



            });
            //===========
            //我的审核
            $("body").delegate("#zace-myAudit-level", "click", function () {
                //if (RoleNum != -1) {

                    $(".zzza").hide();
                    $(".zzzb").show();
                    $(".zzzc").hide();

                //} else {
                //    alert("无权限");
                //}
               

            });
            //我的申请
            $("body").delegate("#zace-myApproval-level", "click", function () {
                $(".zzza").show();
                $(".zzzb").hide();
                $(".zzzc").hide();

            });
          
           
            //条件查询
            $("body").delegate("#zace-searchZall-level", "click", function () {
                var default_value = {
                    FunctionID: 0,
                   
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.FunctionID = Number(rst.FunctionID);
                    $com.table.filterByConndition($("#femi-riskLevel-tbody"), DataAll, default_value, "ID");

                }, TypeSource_Level));


            });

            //=================所有列表
            $("body").delegate("#zace-allList-level", "click", function () {
                $(".zzza").hide();
                $(".zzzb").hide();
                $(".zzzc").show();

            });
            //模糊查询
            $("body").delegate("#zace-search-returnAllList", "input", function () {

                var $this = $(this),
                   value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevelApproval-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevelApproval-tbody"), SearchAll, value, "ID");



            });
            //条件查询
            $("body").delegate("#zace-returnAllList-level", "click", function () {
                var default_value = {
                    FunctionID: 0,
                   
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.FunctionID = Number(rst.FunctionID);
                    $com.table.filterByConndition($("#femi-riskLevelApproval-tbody"), DATABasic, default_value, "ID");

                }, TypeSource_Level));


            });
            //审批查询
            $("body").delegate("#zace-returnAudit-level", "click", function () {
                var default_value = {
                    FunctionID: 0,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.FunctionID = Number(rst.FunctionID);
                    $com.table.filterByConndition($("#femi-riskLevelAudit-tbody"), DataAllConfirmChange, default_value, "ID");

                }, TypeSource_Level));


            });

            //==============我的审核
            //岗位角色审核
            $("body").delegate("#zace-audit-returnAudit", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevelAudit-tbody"), "ID", DataAllConfirmChange);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }

                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].Status == 1 || SelectData[i].Status == 0) {
                        alert("数据选择有误,请选择状态为待审核的数据!");
                        return;

                    }
                    else if (SelectData[i].Status == 3 || SelectData[i].Status == 4) {
                        alert("数据选择有误,请选择状态为待审核的数据!");
                        return;
                    }

                }
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其审核？")) {
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {

                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                var a = 0;
                for (var i = 0; i < SelectData.length; i++) {

                    // var wid = SelectData[i].WID;
                    SelectData[i].Status = 3;

                    model.com.postAudit({
                        data: SelectData[i],
                    }, function (res) {
                        a++;
                        if (a == SelectData.length) {
                            alert("审核成功");
                            model.com.refresh();
                        }
                    })
                }
            });
            //岗位角色反审核
            $("body").delegate("#zace-fan-returnAudit", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevelAudit-tbody"), "ID", DataAllConfirmChange);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }

                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].Status == 2 || SelectData[i].Status == 1) {
                        alert("数据选择有误,请选择状态为已审核的数据!");
                        return;

                    }
                    else if (SelectData[i].Status == 0 || SelectData[i].Status == 4) {
                        alert("数据选择有误,请选择状态为已审核的数据!");
                        return;
                    }

                }
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其反审核？")) {
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {

                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                var a = 0;
                for (var i = 0; i < SelectData.length; i++) {

                    //var wid = SelectData[i].WID;
                    SelectData[i].Status = 1;

                    model.com.postAudit({
                        data: SelectData[i],
                    }, function (res) {
                        a++;
                        if (a == SelectData.length) {
                            alert("反审核成功");
                            model.com.refresh();
                        }
                    })
                }
            });
            //岗位角色查询
            $("body").delegate("#zace-search-returnAudit", "input", function () {

                var $this = $(this),
                   value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevelAudit-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevelAudit-tbody"), DataAllSearch, value, "ID");
            });


            //跳转岗位职能
            $("body").delegate("#zace-business-level", "click", function () {
                var vdata = { 'header': '事业部', 'href': './factory_model/BusinessUnitSetting.html', 'id': 'BusinessUnitSetup', 'src': './static/images/menu/manageBOM.png'};
                window.parent.iframeHeaderSet(vdata);

            });
        },




        run: function () {

           
            model.com.getFunction({ workshopID: 0, lineID: 0 }, function (resModule) {
                if (resModule && resModule.list) {
                    DataModuleList = resModule.list;
                    $.each(resModule.list, function (i, item) {
                        TypeSource_Level.FunctionID.push({
                            name: item.Name,
                            value: item.ID,
                            far: null
                        })
                    });
                    model.com.getFMCLine({ FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0 }, function (resW) {
                        if (resW && resW.list) {
                            //DataLinelist = resW.list;
                            $.each(resW.list, function (i, item) {
                                TypeSource_Level.LineID.push({
                                    name: item.Name,
                                    value: item.ID,
                                    far: 0
                                });
                            });

                        }
                        model.com.getFMCWorkShop({ FactoryID: 0, BusinessUnitID: 0 }, function (resW) {
                            if (resW && resW.list) {
                                // DataWorkShoplist = resW.list;
                                $.each(resW.list, function (i, item) {
                                    TypeSource_Level.WorkShopID.push({
                                        name: item.Name,
                                        value: item.ID,
                                        far: 0
                                    });
                                });

                            }
                            model.com.getPosition({ OAGetType: 0 }, function (resP) {
                                if (!resP)
                                    return;
                                if (resP && resP.list) {
                                    $.each(resP.list, function (i, item) {
                                        TypeSource_Level.ParentID.push({
                                            name: item.Name,
                                            value: item.ID,
                                            far: 0
                                        });
                                    });
                                }
                                // model.com.setMMM();
                                // model.com.setMMMP();
                                model.com.refresh();
                            });
                           
                        });
                    });
                }
            });
                 
                          
        },

        com: {
            refresh: function () {

                model.com.getPosition({ OAGetType: 0 }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        //按照职能排序
                        var viewList = [];
                        viewList = model.com.getOrderList(resP.list);

                        var Grade = $com.util.Clone(viewList);
                        //所有数据
                        DATABasic = $com.util.Clone(viewList);
                        var _list = $com.util.Clone(viewList);
                        $.each(_list, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }
                        });
                        SearchAll = $com.util.Clone(_list);
                        $("#femi-riskLevelApproval-tbody").html($com.util.template(_list, HTML.TableMode));

                       

                    }

                });
                model.com.getPosition({ OAGetType: 0 }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        //按照职能排序
                        var viewList = [];
                        viewList = model.com.getOrderList(resP.list);

                        //审请
                        DataAllConfirm = $com.util.Clone(viewList);
                        var _listApproval = $com.util.Clone(viewList);
                      
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

                    }

                });
                //审批
                model.com.getPosition({ OAGetType: 0 }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {

                        //按照职能排序
                        var viewList = [];
                        viewList = model.com.getOrderList(resP.list);

                        DataAllConfirmChange = $com.util.Clone(viewList);;
                     
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


                    }

                });
                window.parent._zacePositionUser = 1;
            },
            setMMMP: function () {
                setTimeout(function () {

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


                    model.com.setMMMP();
                }, 500);

            },
            setMMM: function () {
                setTimeout(function () {
                    if (window.parent._zacePositionUser == 1) {
                        model.com.getPosition({ OAGetType: 0 }, function (resP) {
                            if (!resP)
                                return;
                            if (resP && resP.list) {
                                TypeSource_Level.ParentID.splice(1, TypeSource_Level.ParentID.length - 1);
                                $.each(resP.list, function (i, item) {
                                    TypeSource_Level.ParentID.push({
                                        name: item.Name,
                                        value: item.ID,
                                        far: 0
                                    });
                                });
                            }
                            window.parent._zacePositionUser = 0;
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


            //查询岗位列表
            getPosition: function (data, fn, context) {
                var d = {
                    $URI: "/BPMPosition/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //保存岗位列表
            postPosition: function (data, fn, context) {
                var d = {
                    $URI: "/BPMPosition/Update",
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
                    $URI: "/BPMPosition/Audit",
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
                    $URI: "/BPMPosition/Active",
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
            getOrderList: function (data) {
                var _list = [];
                for (var i = 0; i < DataModuleList.length; i++) {

                    for (var j = 0; j < data.length; j++) {
                        if (DataModuleList[i].ID == data[j].ModuleID) {

                            _list.push(data[j]);
                        }
                    }
                }

                return _list;


            },
        }
    }),

    model.init();


});