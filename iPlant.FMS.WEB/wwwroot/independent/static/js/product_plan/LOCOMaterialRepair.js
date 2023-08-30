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
        DATAAllBusiness,
        DATAAllBusinessC,
        HTML;
    DATAAllBusiness = DATAAllBusinessC = [];
    DataAll = [];
    DATABasic = [];
    DataAllConfirmBasic = [];
    DataAllConfirmChange = [];
    DataAllConfirm = [];
    DataAllSearch = [];
    PositionTemp = {
        ID: 0,
        StationID: 0,
        PartNo: "",
        MaterialID: 0,
        ComponentName: '',
        SupplierID: 0,
        FQTY: 0,
        LinkmanID: 0,
        SupplierAddress: '',
        ApplyTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        SendRepairTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date('2000-1-1')),
        ReceiveRepairTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date('2000-1-1')),
        FinishRepairTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date('2000-1-1')),
        PlanReceiveDate: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        RequirementDate: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        RealPurchaseDur: 0,
        RequireDur: 0,
        Status: 1,
        Remark: '',
        GoodRemark: '',
        PurchaserID: 0,
        AtualReceiveDate: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Creator: window.parent.User_Info.Name,
        CreatorID: 0,
        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Editor: window.parent.User_Info.Name,
        EditorID: 0,
    };


    ;
    HTML = {
        TableMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            //'<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',

            '<td data-title="StationID" data-value="{{StationID}}" >{{StationID}}</td>',
            '<td data-title="PartNo" data-value="{{PartNo}}" >{{PartNo}}</td>',

            '<td data-title="MaterialID" data-value="{{MaterialID}}" >{{MaterialID}}</td>',
            '<td data-title="ComponentName" data-value="{{ComponentName}}" >{{ComponentName}}</td>',
            '<td data-title="ApplyTime" data-value="{{ApplyTime}}" >{{ApplyTime}}</td>',
            '<td data-title="PlanReceiveDate" data-value="{{PlanReceiveDate}}" >{{PlanReceiveDate}}</td>',
            '<td data-title="RequirementDate" data-value="{{RequirementDate}}" >{{RequirementDate}}</td>',
            '<td data-title="AtualReceiveDate" data-value="{{AtualReceiveDate}}" >{{AtualReceiveDate}}</td>',
            '<td data-title="RealPurchaseDur" data-value="{{RealPurchaseDur}}" >{{RealPurchaseDur}}</td>',
            '<td data-title="RequireDur" data-value="{{RequireDur}}" >{{RequireDur}}</td>',
            '<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',
            '<td data-title="Remark" data-value="{{Remark}}" >{{Remark}}</td>',

            '</tr>',
        ].join(""),



    };
    (function () {
        KEYWORD_Level_LIST = [
            "StationID|工位|ArrayOne",
            "PartNo|车号",
            "MaterialID|物料|ArrayOne",
            "ComponentName|部件",
            "ApplyTime|下车时间|DateTime",
            "PlanReceiveDate|预计到厂日期|Date",
            "RequirementDate|生产要求日期|Date",
            "AtualReceiveDate|实际到厂日期|Date",
            "RealPurchaseDur|实际检修周期",
            "RequireDur|工艺要求周期",
            "Status|状态|ArrayOne",
            "Remark|备注",


        ];
        KEYWORD_Level = {};
        FORMATTRT_Level = {};

        DEFAULT_VALUE_Level = {
            StationID: 0,
            PartNo: "",
            MaterialID: 0,
            ComponentName: '',
            ApplyTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
            PlanReceiveDate: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
            RequirementDate: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
            RealPurchaseDur: 0,
            RequireDur: 0,
            Status: 0,
            Remark: '',
            AtualReceiveDate: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),

        };

        TypeSource_Level = {

            Status: [
                {
                    name: "未到货",
                    value: 1
                }, {
                    name: "已到货",
                    value: 2
                }],
            StationID: [],
            MaterialID: [],



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
        name: 'LOCO',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            //Enter触发模糊查询事件
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var value = $("#zace-search-level").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-riskLevel-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllSearch, value, "ID");

                }
            });
            //查询
            $("body").delegate("#zace-search-level-pro", "click", function () {

                var value = $("#zace-search-level").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllSearch, value, "ID");



            });
            // 启用
            $("body").delegate("#zace-active-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                //if (SelectData[0].Status != 1) {
                //    alert("数据选择有误！")
                //    return;
                //}

                for (var i = 0; i < SelectData.length; i++) {

                    $com.util.deleteLowerProperty(SelectData[i]);
                }

                model.com.activeBusinessUnit({
                    data: SelectData,
                    Active: 1,
                }, function (res) {
                    alert("启用成功");
                    model.com.refresh();


                })




            });
            // 禁用
            $("body").delegate("#zace-disable-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                //if (SelectData[0].Status != 1) {
                //    alert("数据选择有误！")
                //    return;
                //}
                for (var i = 0; i < SelectData.length; i++) {

                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                model.com.activeBusinessUnit({
                    data: SelectData,
                    Active: 0,
                }, function (res) {
                    alert("禁用成功");
                    model.com.refresh();


                })

            });
            // 修改
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
                // if (SelectData[0].Status != 1) {
                //     alert("数据选择有误，请选择状态为创建的数据！")
                //     return;
                // }

                var default_value = {
                    StationID: SelectData[0].StationID,
                    PartNo: SelectData[0].PartNo,
                    MaterialID: SelectData[0].MaterialID,
                    ComponentName: SelectData[0].ComponentName,
                    ApplyTime: SelectData[0].ApplyTime,
                    PlanReceiveDate: SelectData[0].PlanReceiveDate,
                    RequirementDate: SelectData[0].RequirementDate,
                    AtualReceiveDate: SelectData[0].AtualReceiveDate,
                    RealPurchaseDur: SelectData[0].RealPurchaseDur,
                    RequireDur: SelectData[0].RequireDur,
                    Status: SelectData[0].Status,
                    Remark: SelectData[0].Remark,


                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;


                    SelectData[0].StationID = Number(rst.StationID);
                    SelectData[0].PartNo = rst.PartNo;
                    SelectData[0].MaterialID = Number(rst.MaterialID);
                    SelectData[0].ComponentName = rst.ComponentName;
                    SelectData[0].ApplyTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.ApplyTime));
                    SelectData[0].PlanReceiveDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.PlanReceiveDate)),
                        SelectData[0].RequirementDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.RequirementDate)),
                        SelectData[0].AtualReceiveDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.AtualReceiveDate)),
                        SelectData[0].RealPurchaseDur = rst.RealPurchaseDur,
                        SelectData[0].RequireDur = rst.RequireDur;
                    SelectData[0].Status = Number(rst.Status);
                    SelectData[0].Remark = rst.Remark;

                    for (var i = 0; i < SelectData.length; i++) {

                        $com.util.deleteLowerProperty(SelectData[i]);
                        SelectData[i].SendRepairTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].SendRepairTime));
                        SelectData[i].ReceiveRepairTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].ReceiveRepairTime));
                        SelectData[i].FinishRepairTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].FinishRepairTime));
                        SelectData[i].CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].CreateTime));
                        SelectData[i].EditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].EditTime));
                    }

                    model.com.postOMSOutsourceOrder({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                        //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                        //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    })

                }, TypeSource_Level));


            });
            // 新增
            $("body").delegate("#zace-add-level", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    //PositionTemp.Active = rst.Active;
                    PositionTemp.StationID = Number(rst.StationID);
                    PositionTemp.PartNo = rst.PartNo;
                    PositionTemp.MaterialID = Number(rst.MaterialID);
                    PositionTemp.ComponentName = rst.ComponentName;
                    PositionTemp.ApplyTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.ApplyTime));
                    PositionTemp.PlanReceiveDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.PlanReceiveDate)),
                        PositionTemp.RequirementDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.RequirementDate)),
                        PositionTemp.AtualReceiveDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.AtualReceiveDate)),
                        PositionTemp.RealPurchaseDur = rst.RealPurchaseDur,
                        PositionTemp.RequireDur = rst.RequireDur;
                    PositionTemp.Status = Number(rst.Status);
                    PositionTemp.Remark = rst.Remark;

                    model.com.postOMSOutsourceOrder({
                        data: PositionTemp,
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                    })



                }, TypeSource_Level));


            });
            // 提交
            $("body").delegate("#zace-up-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }

                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].Status == 2 || SelectData[i].Status == 0) {
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

                    model.com.postBusinessUnit({
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
            // 撤销
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

                    model.com.postBusinessUnit({
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
            //我的申请
            $("body").delegate("#zace-myApproval-level", "click", function () {
                $(".zzza").show();
                $(".zzzb").hide();
                $(".zzzc").hide();

            });
            //车间
            $("body").delegate("#zace-audit-workshop", "click", function () {
                var vdata = { 'header': '工厂设置', 'href': './factory_model/FMCFactorySetting.html', 'id': 'FMCFactorySetup', 'src': './static/images/menu/manageBOM.png' };
                window.parent.iframeHeaderSet(vdata);

            });

            // 审批查询
            $("body").delegate("#zace-search-returnAudit", "input", function () {

                var $this = $(this),
                    value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevelAudit-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevelAudit-tbody"), DataAllSearch, value, "ID");



            });
            // 所有查询
            $("body").delegate("#zace-search-returnAuditAll", "input", function () {

                var $this = $(this),
                    value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevelApprovalAll-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevelApprovalAll-tbody"), DataAllSearch, value, "ID");



            });

            //====所有
            $("body").delegate("#zace-allList-level", "click", function () {
                $(".zzza").hide();
                $(".zzzb").hide();
                $(".zzzc").show();

            });
            //====审批
            $("body").delegate("#zace-myAudit-level", "click", function () {
                $(".zzza").hide();
                $(".zzzb").show();
                $(".zzzc").hide();

            });

            // 审核
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

            // 反审核
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


            //所有条件查询
            $("body").delegate("#zace-searchAll-level", "click", function () {
                var default_value = {
                    Active: true,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.Active = eval(rst.Active.toLowerCase());

                    $com.table.filterByConndition($("#femi-riskLevelApprovalAll-tbody"), DATAAllBusiness, default_value, "ID");

                }, TypeSource_Level));


            });

            //申请条件查询
            $("body").delegate("#zace-searchZApproval-level", "click", function () {
                var default_value = {
                    Active: true,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.Active = eval(rst.Active.toLowerCase());
                    $com.table.filterByConndition($("#femi-riskLevel-tbody"), DATABasic, default_value, "ID");

                }, TypeSource_Level));


            });
            //审批条件查询
            $("body").delegate("#zace-searchAudit-level", "click", function () {
                var default_value = {
                    Active: true,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.Active = eval(rst.Active.toLowerCase());
                    $com.table.filterByConndition($("#femi-riskLevelAudit-tbody"), DataAllConfirmBasic, default_value, "ID");

                }, TypeSource_Level));


            });

            $("body").delegate("#zace-edit-levelZace", "click", function () {
                model.com.refresh();


            });
        },




        run: function () {

            model.com.getFPCPart({ FactoryID: 0, BusinessUnitID: 0 }, function (resP) {

                if (!resP)
                    return;

                $.each(resP.list, function (i, item) {
                    TypeSource_Level.StationID.push({
                        value: item.ID,
                        name: item.Name
                    });
                });

                model.com.getmaterialRecord({ material_no: "", material_name: "", type_id: 0, status: 0 }, function (resP) {
                    if (!resP)
                        return;

                    $.each(resP.list, function (i, item) {
                        TypeSource_Level.MaterialID.push({
                            value: item.ID,
                            name: item.MaterialName
                        });
                    });
                    model.com.refresh();
                });

            });
        },

        com: {
            refresh: function () {
                model.com.getOMSOutsourceOrder({}, function (resP) {
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
                            item.WID = i + 1;
                        });
                        DataAllSearch = $com.util.Clone(Grade);
                        $("#femi-riskLevel-tbody").html($com.util.template(Grade, HTML.TableMode));


                    }
                });
            },
            //查询所有物料
            getmaterialRecord: function (data, fn, context) {
                var d = {
                    $URI: "/Material/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getFPCPart: function (data, fn, context) {
                var d = {
                    $URI: "/FPCPart/All",
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
            //查询 列表
            getOMSOutsourceOrder: function (data, fn, context) {
                var d = {
                    $URI: "/OMSOutsourceOrder/All",
                    $TYPE: "get",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //保存 列表
            postOMSOutsourceOrder: function (data, fn, context) {
                var d = {
                    $URI: "/OMSOutsourceOrder/Update",
                    $TYPE: "post",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //审核
            postAudit: function (data, fn, context) {
                var d = {
                    $URI: "/OMSOutsourceOrder/Audit",
                    $TYPE: "post",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //启用
            activeOMSOutsourceOrder: function (data, fn, context) {
                var d = {
                    $URI: "/OMSOutsourceOrder/Active",
                    $TYPE: "post",
                    $SERVER: "/MESAPS"
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