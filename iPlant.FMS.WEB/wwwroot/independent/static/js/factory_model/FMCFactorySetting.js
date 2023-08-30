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
        HTML;
    RoleNum = -1;
    DataAll =SearchAll= [];
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
        City: "",
        CityID: 0,
        Code: "",
        Country: "",
        CountryID: 0,
        CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Creator: window.parent.User_Info.Name,
        CreatorID: 0,
        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Editor: window.parent.User_Info.Name,
        EditorID: 0,
        ID: 0,
        Name: "",
        Province: "",
        ProvinceID: 0,
        Status: 1,
        StatusText: "",
    };


    ;
    HTML = {
        TableMode: [
				'<tr>',
				'<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
				'<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
				'<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
				'<td data-title="Code" data-value="{{Code}}" >{{Code}}</td>',
				'<td data-title="CountryID" data-value="{{CountryID}}" >{{CountryID}}</td>',
                '<td data-title="ProvinceID" data-value="{{ProvinceID}}" >{{ProvinceID}}</td>',
				'<td data-title="CityID" data-value="{{CityID}}" >{{CityID}}</td>',
				
                
                '<td data-title="Creator" data-value="{{Creator}}" >{{Creator}}</td>',
                 '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
                  '<td data-title="Editor" data-value="{{Editor}}" >{{Editor}}</td>',
                 '<td data-title="EditTime" data-value="{{EditTime}}" >{{EditTime}}</td>',
                '<td data-title="Auditor" data-value="{{Auditor}}" >{{Auditor}}</td>',
                 '<td data-title="AuditTime" data-value="{{AuditTime}}" >{{AuditTime}}</td>',
                 '<td data-title="Active" data-value="{{Active}}" >{{Active}}</td>',
                 '<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',
				'</tr>',
        ].join(""),



    }
    $(function () {
        KEYWORD_Level_LIST = [
         "Name|名称",
         "Code|编码",
         "CountryID|国家|ArrayOneControl",
         "ProvinceID|省份|ArrayOneControl|CountryID",
         "CityID|城市|ArrayOneControl|CountryID,ProvinceID",
         "Status|状态|ArrayOne",
         "Active|启用|ArrayOne",
         "CreateTime|时间|DateTime",
         "EditTime|时间|DateTime",
         "AuditTime|时间|DateTime",
        ];
        KEYWORD_Level = {};
        FORMATTRT_Level = {};

        DEFAULT_VALUE_Level = {
            Name: "",
            Code: "",
            CountryID: 0,
            //Status: 0,
            ProvinceID: 0,
            CityID: 0,
            //Active: true,
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
            CountryID: [
              {
                  name: "无",
                  value: 0,
                  far: 0
              }
            ],
            ProvinceID: [
             {
                 name: "无",
                 value: 0,
                 far: 0
             }
            ],
            CityID: [
             {
                 name: "无",
                 value: 0,
                 far: 0
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

            //工厂查询
            $("body").delegate("#zace-search-level", "input", function () {

                var $this = $(this),
                   value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAll, value, "ID");



            });
            //工厂修改
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
                if (SelectData[0].Status == 2) {
                    //alert("数据已提交，不能修改！");
                    alert("请选择状态为创建的数据!");
                    return;
                }
                if (SelectData[0].Status == 3) {
                    alert("请选择状态为创建的数据!")
                    return;
                }
                var default_value = {
                    Name: SelectData[0].Name,
                    Code: SelectData[0].Code,
                    CountryID: SelectData[0].CountryID,
                    ProvinceID: SelectData[0].ProvinceID,
                    CityID: SelectData[0].CityID,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].Name = rst.Name;
                    SelectData[0].Code = rst.Code;
                    SelectData[0].CountryID = Number(rst.CountryID);
                    SelectData[0].ProvinceID = Number(rst.ProvinceID);
                    SelectData[0].CityID = Number(rst.CityID);

                    for (var i = 0; i < SelectData.length; i++) {

                        $com.util.deleteLowerProperty(SelectData[i]);
                    }

                    model.com.postFMCFactory({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                        //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                        //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    })

                }, TypeSource_Level));


            });

            //工厂启用
            $("body").delegate("#zace-active-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                //if (SelectData[0].Status == 2) {
                //    alert("数据已提交，不能启用！")
                //    return;
                //}
                //if (SelectData[0].Status == 3) {
                //    alert("数据已审核，不能启用！")
                //    return;
                //}
                for (var i = 0; i < SelectData.length; i++) {

                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                model.com.activeAudit({
                    data: SelectData,
                    Active:1,
                }, function (res) {
                    alert("启用成功");
                    model.com.refresh();


                })




            });
            //工厂禁用
            $("body").delegate("#zace-disable-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                //if (SelectData[0].Status == 2) {
                //    alert("数据已提交，不能禁用！")
                //    return;
                //}
                //if (SelectData[0].Status == 3) {
                //    alert("数据已审核，不能禁用！")
                //    return;
                //}
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

            //工厂新增
            $("body").delegate("#zace-add-level", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    PositionTemp.CountryID = Number(rst.CountryID);
                    PositionTemp.ProvinceID = Number(rst.ProvinceID);
                    PositionTemp.CityID = Number(rst.CityID);
                    PositionTemp.Name = rst.Name;
                    //PositionTemp.Status = Number(rst.Status);
                    PositionTemp.Code = rst.Code;
                    //PositionTemp.Active = rst.Active;

                    model.com.postFMCFactory({
                        data: PositionTemp,
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                    })

                }, TypeSource_Level));


            });
            //工厂提交
            $("body").delegate("#zace-up-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }

                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].Status == 2 || SelectData[i].Status == 0) {
                        //alert("有数据已被提交,请重新选择!!");
                        alert("数据选择有误,请选择状态为创建的数据!!");
                        return;

                    }
                    else if (SelectData[i].Status == 3 || SelectData[i].Status == 4) {
                        alert("数据选择有误,请选择状态为创建的数据!!");
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
                    model.com.postFMCFactory({
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
            //工厂撤销
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

                    model.com.postFMCFactory({
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
          
            //工厂查询
            $("body").delegate("#zace-search-returnAudit", "input", function () {

                var $this = $(this),
                   value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevelAudit-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "ID");
            });

            //
            //条件查询
            $("body").delegate("#zace-searchZall-level", "click", function () {
                var default_value = {
                    CountryID: 0,
                    ProvinceID: 0,
                    CityID: 0,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.CountryID = Number(rst.CountryID);
                    default_value.ProvinceID = Number(rst.ProvinceID);
                    default_value.CityID = Number(rst.CityID);
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
                    CountryID: 0,
                    ProvinceID: 0,
                    CityID: 0,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.CountryID = Number(rst.CountryID);
                    default_value.ProvinceID = Number(rst.ProvinceID);
                    default_value.CityID = Number(rst.CityID);
                    $com.table.filterByConndition($("#femi-riskLevelApproval-tbody"), DATABasic, default_value, "ID");

                }, TypeSource_Level));


            });


            //==============我的审核
            //工厂审核
            $("body").delegate("#zace-audit-returnAudit", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevelAudit-tbody"), "ID", DataAllConfirmChange);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }

                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].Status == 1 || SelectData[i].Status == 0) {
                        alert("数据选择有误,请选择状态为待审核的数据!!");
                        return;

                    }
                    else if (SelectData[i].Status == 3 || SelectData[i].Status == 4) {
                        alert("数据选择有误,请选择状态为待审核的数据!!");
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
            //工厂反审核
            $("body").delegate("#zace-fan-returnAudit", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevelAudit-tbody"), "ID", DataAllConfirmChange);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }

                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].Status == 2 || SelectData[i].Status == 1) {
                        alert("数据选择有误,请选择状态为已审核的数据!!");
                        return;

                    }
                    else if (SelectData[i].Status == 0 || SelectData[i].Status == 4) {
                        alert("数据选择有误,请选择状态为已审核的数据!!");
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
            //模糊查询
            $("body").delegate("#zace-search-returnAudit", "input", function () {

                var $this = $(this),
                   value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevelAudit-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevelAudit-tbody"), DataAllSearch, value, "ID");



            });
            //条件查询
            $("body").delegate("#zace-returnAudit-level", "click", function () {
                var default_value = {
                    CountryID: 0,
                    ProvinceID: 0,
                    CityID: 0,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.CountryID = Number(rst.CountryID);
                    default_value.ProvinceID = Number(rst.ProvinceID);
                    default_value.CityID = Number(rst.CityID);
                    $com.table.filterByConndition($("#femi-riskLevelAudit-tbody"), DataAllConfirmChange, default_value, "ID");

                }, TypeSource_Level));


            });

            //跳转事业部
            $("body").delegate("#zace-business-level", "click", function () {
                var vdata = { 'header': '事业部', 'href': './factory_model/BusinessUnitSetting.html', 'id': 'BusinessUnitSetup', 'src': './static/images/menu/factoryModel/division.png' };
                window.parent.iframeHeaderSet(vdata);

            });
        },




        run: function () {

            //model.com.getArea({}, function (resA) {
            //    if (!resA)
            //        return;
            //    if (resA && resA.list) {
            //        $.each(resA.list, function (i, item) {
            //            TypeSource_Level.CountryID.push({
            //                name: item.Name,
            //                value: item.ID,
            //            });
            //            $.each(item.RegionList, function (l_i, l_item) {
            //                TypeSource_Level.ProvinceID.push({
            //                    name: l_item.Name,
            //                    value: l_item.ID,
            //                    far: item.ID
            //                });

            //                $.each(l_item.RegionList, function (c_i, c_item) {
            //                    TypeSource_Level.CityID.push({
            //                        name: c_item.Name,
            //                        value: c_item.ID,
            //                        far: item.ID + "_" + l_item.ID
            //                    });
            //                });
            //            });

            //        });
            //        //model.com.getRoleFounction({ FunctionID: 100305 }, function (resR) {
            //        //    if (!resR)
            //        //        return;
            //        //    if (resR && resR.info) {
            //        //        RoleNum = resR.info;

            //        //    }
            //            model.com.setMMM();
            //            model.com.refresh();
            //        //})
                 
            //    }



            //});
            model.com.refresh();
        },

        com: {
            setMMM: function () {
                setTimeout(function () {
                    if (window.parent._zaceAreaSet && window.parent._zaceAreaSet == 1) {
                        model.com.getArea({}, function (res) {
                            if (!res)
                                return;
                            if (res && res.list) {
                                TypeSource_Level.CountryID.splice(1, TypeSource_Level.CountryID.length - 1);
                                TypeSource_Level.ProvinceID.splice(1, TypeSource_Level.ProvinceID.length - 1);
                                TypeSource_Level.CityID.splice(1, TypeSource_Level.CityID.length - 1);

                                $.each(res.list, function (i, item) {
                                    TypeSource_Level.CountryID.push({
                                        name: item.Name,
                                        value: item.ID,
                                    });
                                    $.each(item.RegionList, function (l_i, l_item) {
                                        TypeSource_Level.ProvinceID.push({
                                            name: l_item.Name,
                                            value: l_item.ID,
                                            far: item.ID
                                        });

                                        $.each(l_item.RegionList, function (c_i, c_item) {
                                            TypeSource_Level.CityID.push({
                                                name: c_item.Name,
                                                value: c_item.ID,
                                                far: item.ID + "_" + l_item.ID
                                            });
                                        });
                                    });

                                });
                            }
                            window.parent._zaceAreaSet = 0;
                        });

                    }

                   
                    model.com.setMMM();
                }, 500);

            },
            refresh: function () {

                model.com.getFMCFactory({OAGetType:0}, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var Grade = $com.util.Clone(resP.list);
                        //所有数据
                        DATABasic = $com.util.Clone(resP.list);
                        var _list= $com.util.Clone(resP.list);
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
                model.com.getFMCFactory({ OAGetType: 0 }, function (resP) {
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

                    }

                });
                model.com.getFMCFactory({ OAGetType: 0 }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                      //审批
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


                    }

                });
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

            //查询区域
            getArea: function (data, fn, context) {
                var d = {
                    $URI: "/Area/Tree",
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
            //查询工厂列表
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
            //保存工厂列表
            postFMCFactory: function (data, fn, context) {
                var d = {
                    $URI: "/FMCFactory/Update",
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
                    $URI: "/FMCFactory/Audit",
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
                    $URI: "/FMCFactory/Active",
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