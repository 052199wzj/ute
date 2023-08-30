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
        HTML;

    DataAll = [];
    DATABasic = [];
    DataAllConfirmBasic = [];
    DataAllConfirmChange = [];
    DataAllConfirm = [];
    DataAllFactorySearch = DataAllSearch = [];
    SWorkFlow = {
        Active: true,
        EntryID: 0,
        EntryName: "",
        EntryType: 0,
        ID: 0,
        LineID: 0,
        LineName: "",
        Status: 1,
        WorkFlowID: 0,
        WorkFlowName: "",
        WorkShopID: 0,
        WorkShopName: "",
    };


    ;
    HTML = {
        TableMode: [
				'<tr data-color="">',
				'<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
				'<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
				'<td data-title="WorkShopName" data-value="{{WorkShopName}}" >{{WorkShopName}}</td>',
				'<td data-title="LineName" data-value="{{LineName}}" >{{LineName}}</td>',
                '<td data-title="EntryType" data-value="{{EntryType}}" >{{EntryType}}</td>',
                '<td data-title="EntryName" data-value="{{EntryName}}" >{{EntryName}}</td>',
                '<td data-title="WorkFlowName" data-value="{{WorkFlowName}}" >{{WorkFlowName}}</td>',
				//'<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',
                '<td data-title="Active" data-value="{{Active}}" >{{Active}}</td>',
                '<td data-title="Creator" data-value="{{Creator}}" >{{Creator}}</td>',
                 '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
                //'<td data-title="Auditor" data-value="{{Auditor}}" >{{Auditor}}</td>',
                // '<td data-title="AuditTime" data-value="{{AuditTime}}" >{{AuditTime}}</td>',
				'</tr>',
        ].join(""),



    }
    $(function () {
        KEYWORD_Level_LIST = [
         "WorkShopID|车间|ArrayOne",
         "LineID|产线|ArrayOne",
          "EntryType|实体类型|ArrayOne",
         "EntryID|名称|ArrayOne",
        
         "StationID|工位|ArrayOne",
         "PartID|工步|ArrayOne",
          "WorkFlowID|工作流程|ArrayOne",
         "Status|状态|ArrayOne",
         "Active|激活|ArrayOne",
        ];
        KEYWORD_Level = {};
        FORMATTRT_Level = {};

        DEFAULT_VALUE_LevelSta = {
            WorkShopID: 1,
            LineID: 1,
            //EntryType: 5,
            StationID: 0,
            WorkFlowID:0,
        };

        DEFAULT_VALUE_LevelPart = {
            WorkShopID: 1,
            LineID: 1,
            //EntryType: 4,
            PartID: 0,
            WorkFlowID: 0,
        };

        DEFAULT_VALUE_LevelWork = {
            //WorkShopID: 1,
            //LineID: 1,
            //EntryType: 3,
            WorkShopID: 0,
            WorkFlowID: 0,
        };

        DEFAULT_VALUE_LevelLine = {
            WorkShopID: 1,
            //LineID: 1,
            //EntryType: 2,
            LineID: 0,
            WorkFlowID: 0,
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
              {
                  name: "无",
                  value: 0,
                  far: 0
              }
            ],
            LineID: [
             {
                 name: "无",
                 value: 0,
                 far: 0
             }
            ],
            WorkFlowID: [
           {
               name: "无",
               value: 0,
           }
            ],
            PartID: [
             {
                 name: "无",
                 value: 0,
                 far: 0
             }
            ],
            StationID: [
            {
                name: "无",
                value: 0,
                far: 0
            }
            ],
            EntryType: [
            {
                name: "产线",
                value: 2,
            },
            {
                name: "车间",
                value: 3,
            },
            {
                name: "工步",
                value: 4,
            },
            {
                name: "工位",
                value: 5,
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
    });


    model = $com.Model.create({
        name: '岗位',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {

            //zace-myAuditPro-level
            $("body").delegate("#zace-myAuditPro-level", "click", function () {
                var default_value = {
                    EntryType: 0,
                  
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.EntryType = Number(rst.EntryType);
                    $com.table.filterByConndition($("#femi-riskLevel-tbody"), DataAll, default_value, "ID");

                }, TypeSource_Level));


            });
            //工位流程查询
            $("body").delegate("#zace-search-level", "change", function () {

                var $this = $(this),
                   value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "ID");



            });
            //工位流程修改
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
                //if (SelectData[0].Status != 1) {
                //    alert("数据选择有误！")
                //    return;
                //}
                if (SelectData[0].EntryType==5) {
                    var default_value = {
                        WorkShopID: SelectData[0].WorkShopID,
                        LineID: SelectData[0].LineID,
                      
                        WorkFlowID: SelectData[0].WorkFlowID,
                        StationID: SelectData[0].EntryID,
                        Active: SelectData[0].Active,
                    };
                    $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        SelectData[0].WorkShopID = Number(rst.WorkShopID);
                        SelectData[0].LineID = Number(rst.LineID);                       
                        SelectData[0].WorkFlowID = Number(rst.WorkFlowID);
                        SelectData[0].EntryID = Number(rst.StationID);
                        //SelectData[0].FactoryID = Number(rst.FactoryID);
                        SelectData[0].Active = rst.Active;

                        model.com.postSFCWorkFlow({
                            data: SelectData[0],
                        }, function (res) {
                            alert("修改成功");
                            model.com.refresh();
                            //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                            //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                        })

                    }, TypeSource_Level));
                } else if (SelectData[0].EntryType == 4) {

                    var default_value = {
                        WorkShopID: SelectData[0].WorkShopID,
                        LineID: SelectData[0].LineID,
                      
                        WorkFlowID: SelectData[0].WorkFlowID,
                        PartID: SelectData[0].EntryID,
                        Active: SelectData[0].Active,
                    };
                    $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        SelectData[0].WorkShopID = Number(rst.WorkShopID);
                        SelectData[0].LineID = Number(rst.LineID);                       
                        SelectData[0].WorkFlowID = Number(rst.WorkFlowID);
                        SelectData[0].EntryID = Number(rst.PartID);
                        //SelectData[0].FactoryID = Number(rst.FactoryID);
                        SelectData[0].Active = rst.Active;

                        model.com.postSFCWorkFlow({
                            data: SelectData[0],
                        }, function (res) {
                            alert("修改成功");
                            model.com.refresh();
                            //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                            //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                        })

                    }, TypeSource_Level));

                } else if (SelectData[0].EntryType == 3) {

                    var default_value = {
                       
                        WorkFlowID: SelectData[0].WorkFlowID,
                        WorkShopID: SelectData[0].EntryID,
                        Active: SelectData[0].Active,
                    };
                    $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        SelectData[0].WorkShopID = Number(rst.WorkShopID);                     
                        SelectData[0].WorkFlowID = Number(rst.WorkFlowID);
                        SelectData[0].EntryID = Number(rst.WorkShopID);
                        SelectData[0].Active = rst.Active;

                        model.com.postSFCWorkFlow({
                            data: SelectData[0],
                        }, function (res) {
                            alert("修改成功");
                            model.com.refresh();
                            //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                            //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                        })

                    }, TypeSource_Level));

                } else if (SelectData[0].EntryType == 2) {

                    var default_value = {
                        WorkShopID: SelectData[0].WorkShopID,
                        WorkFlowID: SelectData[0].WorkFlowID,
                        LineID: SelectData[0].EntryID,
                        Active: SelectData[0].Active,
                    };
                    $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        SelectData[0].WorkShopID = Number(rst.WorkShopID);
                        SelectData[0].LineID = Number(rst.LineID);
                        SelectData[0].WorkFlowID = Number(rst.WorkFlowID);
                        SelectData[0].EntryID = Number(rst.LineID);
                        SelectData[0].Active = rst.Active;

                        model.com.postSFCWorkFlow({
                            data: SelectData[0],
                        }, function (res) {
                            alert("修改成功");
                            model.com.refresh();
                            //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                            //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                        })

                    }, TypeSource_Level));

                }


            });


            //工位流程激活
            $("body").delegate("#zace-active-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData[0].Status != 1) {
                    alert("数据选择有误！")
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
            //工位流程禁用
            $("body").delegate("#zace-disable-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData[0].Status != 1) {
                    alert("数据选择有误！")
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

            //工位流程新增
            $("body").delegate("#zace-add-level", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_LevelSta, KEYWORD_Level, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SWorkFlow.WorkShopID = Number(rst.WorkShopID);
                    SWorkFlow.LineID = Number(rst.LineID);
                    SWorkFlow.EntryType = 5;
                    SWorkFlow.EntryID = Number(rst.StationID);
                    SWorkFlow.WorkFlowID = Number(rst.WorkFlowID);

                    model.com.postSFCWorkFlow({
                        data: SWorkFlow,
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                    })

                }, TypeSource_Level));


            });
            //工序流程新增
            $("body").delegate("#zace-add-levelPart", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_LevelPart, KEYWORD_Level, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SWorkFlow.WorkShopID = Number(rst.WorkShopID);
                    SWorkFlow.LineID = Number(rst.LineID);
                    SWorkFlow.EntryType = 4;
                    SWorkFlow.EntryID = Number(rst.PartID);
                    SWorkFlow.WorkFlowID = Number(rst.WorkFlowID);

                    model.com.postSFCWorkFlow({
                        data: SWorkFlow,
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                    })

                }, TypeSource_Level));


            });

            //车间流程新增
            $("body").delegate("#zace-add-levelWork", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_LevelWork, KEYWORD_Level, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SWorkFlow.WorkShopID = Number(rst.WorkShopID);
                    SWorkFlow.LineID = 0;
                    SWorkFlow.EntryType = 3;
                    SWorkFlow.EntryID = Number(rst.WorkShopID);
                    SWorkFlow.WorkFlowID = Number(rst.WorkFlowID);

                    model.com.postSFCWorkFlow({
                        data: SWorkFlow,
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                    })

                }, TypeSource_Level));


            });
            //产线流程新增
            $("body").delegate("#zace-add-levelLine", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_LevelLine, KEYWORD_Level, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SWorkFlow.WorkShopID = Number(rst.WorkShopID);
                    SWorkFlow.LineID = Number(rst.LineID);
                    SWorkFlow.EntryType = 2;
                    SWorkFlow.EntryID = Number(rst.LineID);
                    SWorkFlow.WorkFlowID = Number(rst.WorkFlowID);

                    model.com.postSFCWorkFlow({
                        data: SWorkFlow,
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                    })

                }, TypeSource_Level));


            });

            //工位流程提交
            $("body").delegate("#zace-up-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }

                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].Status == 2 || SelectData[i].Status == 0) {
                        alert("有数据已被提交,请重新选择!!");
                        return;

                    }
                    else if (SelectData[i].Status == 3 || SelectData[i].Status == 4) {
                        alert("有数据已被审核,请重新选择!!");
                        return;
                    }

                }
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其提交？")) {
                    return;
                }

                for (var i = 0; i < SelectData.length; i++) {

                    //var wid = SelectData[i].WID;
                    SelectData[i].Status = 2;
                    model.com.postSFCWorkFlow({
                        data: SelectData[i],
                    }, function (res) {
                        alert("提交成功");
                        model.com.refresh();
                    })
                }
            });
            //工位流程撤销
            $("body").delegate("#zace-return-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }

                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].Status == 1 || SelectData[i].Status == 0) {
                        alert("数据选择有误,请重新选择!");
                        return;

                    }
                    else if (SelectData[i].Status == 3 || SelectData[i].Status == 4) {
                        alert("有数据已被审核,请重新选择!");
                        return;
                    }

                }
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其撤回？")) {
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {

                    //var wid = SelectData[i].WID;
                    SelectData[i].Status = 1;

                    model.com.postSFCWorkFlow({
                        data: SelectData[i],
                    }, function (res) {
                        model.com.refresh();
                    })
                }



            });
            //===========
            //我的审核
            $("body").delegate("#zace-myAudit-level", "click", function () {
                $(".zzza").hide();
                $(".zzzb").show();

            });
            //返回
            $("body").delegate("#zace-returnAudit-level", "click", function () {
                $(".zzza").show();
                $(".zzzb").hide();

            });
            //工位流程查询
            $("body").delegate("#zace-search-returnAudit", "change", function () {

                var $this = $(this),
                   value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevelAudit-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevelAudit-tbody"), DataAllSearch, value, "ID");



            });
            //工位流程审核
            $("body").delegate("#zace-audit-returnAudit", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevelAudit-tbody"), "ID", DataAllConfirmChange);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }

                //for (var i = 0; i < SelectData.length; i++) {
                //    if (SelectData[i].Status == 1 || SelectData[i].Status == 0) {
                //        alert("数据选择,请重新选择!!");
                //        return;

                //    }
                //    else if (SelectData[i].Status == 3 || SelectData[i].Status == 4) {
                //        alert("有数据已被审核,请重新选择!!");
                //        return;
                //    }

                //}
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其审核？")) {
                    return;
                }

                for (var i = 0; i < SelectData.length; i++) {

                    // var wid = SelectData[i].WID;
                    SelectData[i].Status = 3;

                    model.com.postAudit({
                        data: SelectData[i],
                        status:3
                    }, function (res) {
                        alert("审核成功");
                        model.com.refresh();
                    })
                }
            });
            //工位流程反审核
            $("body").delegate("#zace-fan-returnAudit", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevelAudit-tbody"), "ID", DataAllConfirmChange);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }

                //for (var i = 0; i < SelectData.length; i++) {
                //    if (SelectData[i].Status == 2 || SelectData[i].Status == 1) {
                //        alert("数据选择有误,请重新选择!!");
                //        return;

                //    }
                //    else if (SelectData[i].Status == 0 || SelectData[i].Status == 4) {
                //        alert("数据选择有误,请重新选择!!");
                //        return;
                //    }

                //}
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其反审核？")) {
                    return;
                }

                for (var i = 0; i < SelectData.length; i++) {

                    //var wid = SelectData[i].WID;
                    SelectData[i].Status = 1;

                    model.com.postAudit({
                        data: SelectData[i],
                        status: 0
                    }, function (res) {
                        alert("反审核成功");
                        model.com.refresh();
                    })
                }
            });


        },




        run: function () {
            var workShopList = window.parent._WorkShop;
            var lineList = window.parent._Line;
            var stationList = window.parent._Station;
            model.com.getModuleAll({ module: 700001 }, function (resP) {
                if (!resP)
                    return;
                if (resP && resP.list) { }
            
            $.each(workShopList, function (i, item) {
                TypeSource_Level.WorkShopID.push({
                    name: item.Name,
                    value: item.ID,
                });
            });
            $.each(lineList, function (i, item) {
                TypeSource_Level.LineID.push({
                    name: item.Name,
                    value: item.ID,
                });
            });
            $.each(stationList, function (i, item) {
                TypeSource_Level.StationID.push({
                    name: item.Name,
                    value: item.ID,
                });
            });


            model.com.getBPMWorkFlowAll({ workshopID: 0, lineID: 0 }, function (resW) {
                if (resW && resW.list) {
                    $.each(resW.list, function (i, item) {
                        TypeSource_Level.WorkFlowID.push({
                            name: item.Name,
                            value: item.ID,
                            far: null
                        })
                    });
                }
                model.com.getFPCPartPoint({ FactoryID: 0, BusinessUnitID: 0 }, function (resP) {
                    if (resP && resP.list) {
                        $.each(resP.list, function (i, item) {
                            TypeSource_Level.PartID.push({
                                name: item.Name,
                                value: item.ID,
                                far: null
                            })
                        });
                    }

                    model.com.refresh();
                });
               
            });
            });
            
        },

        com: {
            refresh: function () {
                model.com.getModuleAll({module:700001}, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) { }
                });
               
                model.com.getSFCWorkFlow({ EntryID:0,EntryType:0 }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var Grade = $com.util.Clone(resP.list);
                        DATABasic = $com.util.Clone(resP.list);

                        //审核数据
                        DataAllConfirm = $com.util.Clone(resP.list);

                        DataAll = $com.util.Clone(Grade);

                        $.each(Grade, function (i, item) {
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


                        //===========审核
                        DataAllConfirmChange = $com.util.Clone(resP.list);

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
            //查询工步列表
            getFPCPartPoint: function (data, fn, context) {
                var d = {
                    $URI: "/FPCPartPoint/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //所有工作流程信息
            getBPMWorkFlowAll: function (data, fn, context) {
                var d = {
                    $URI: "/BPMWorkFlow/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //查询模块ID对应枚举值 700001
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
            //查询工位流程列表
            getSFCWorkFlow: function (data, fn, context) {
                var d = {
                    $URI: "/SFCWorkFlow/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //保存工位流程列表
            postSFCWorkFlow: function (data, fn, context) {
                var d = {
                    $URI: "/SFCWorkFlow/Update",
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
                    $URI: "/SFCWorkFlow/Audit",
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