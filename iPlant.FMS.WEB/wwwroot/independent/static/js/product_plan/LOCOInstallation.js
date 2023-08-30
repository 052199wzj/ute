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
        LineID: 0,
        Status: 1,
        PartID: 0,
        ProductID: 0,
        MaterialID: 0,
        IsInstall: true,
        IsThisPart: true,
        Auditor: window.parent.User_Info.Name,
        AuditorID: 0,
        AuditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
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
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',

            '<td data-title="LineID" data-value="{{LineID}}" >{{LineID}}</td>',
            '<td data-title="PartID" data-value="{{PartID}}" >{{PartID}}</td>',
            '<td data-title="ProductID" data-value="{{ProductID}}" >{{ProductID}}</td>',
            '<td data-title="MaterialID" data-value="{{MaterialID}}" >{{MaterialID}}</td>',
            // '<td data-title="MaterialNo" data-value="{{MaterialNo}}" >{{MaterialNo}}</td>',
            '<td data-title="InstallCheckMode" data-value="{{InstallCheckMode}}" >{{InstallCheckMode}}</td>',
            // '<td data-title="BOMNo" data-value="{{BOMNo}}" >{{BOMNo}}</td>',
            //'<td data-title="IsThisPart" data-value="{{IsThisPart}}" >{{IsThisPart}}</td>',
            // '<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',
            '<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',
            '</tr>',
        ].join(""),



    };
    (function () {
        KEYWORD_Level_LIST = [
            "LineID|修程|ArrayOne",
            "PartID|工位|ArrayOne",
            "ProductID|车型|ArrayOne",
            "MaterialID|物料|ArrayOne",
            "InstallCheckMode|检查模式|ArrayOne",
            "IsInstall|是否必装|ArrayOne",
            "IsThisPart|是否在本工位|ArrayOne",
            "Status|状态|ArrayOne",
            "CreateTime|时间|DateTime",
            "EditTime|时间|DateTime",
            "AuditTime|时间|DateTime",

        ];
        KEYWORD_Level = {};
        FORMATTRT_Level = {};

        DEFAULT_VALUE_Level = {
            LineID: 0,
            Status: 1,
            PartID: 0,
            ProductID: 0,
            MaterialID: 0,
            InstallCheckMode: 4,
            // Active: 1,
            //Status: 1,
        };

        TypeSource_Level = {
            InstallCheckMode: [

                {
                    name: "检查并提示",
                    value: 1
                },
                {
                    name: "检查并影响本工位转序",
                    value: 2
                },
                {
                    name: "检查并影响上工位转序",
                    value: 3
                },
                {
                    name: "不检查冲突",
                    value: 4
                },
            ],

            Status: [
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
                },],
            LineID: [],
            PartID: [],
            ProductID: [],
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
            //激活
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
                    SelectData[i].PlanReceiveDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].PlanReceiveDate));
                    SelectData[i].RealReceiveDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].RealReceiveDate));
                    SelectData[i].PlanFinishDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].PlanFinishDate));
                    SelectData[i].RealStartDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].RealStartDate));
                    SelectData[i].RealFinishDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].RealFinishDate));
                    SelectData[i].RealSendDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].RealSendDate));
                    SelectData[i].AuditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].AuditTime));
                    SelectData[i].CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].CreateTime));
                    SelectData[i].EditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].EditTime));
                }

                model.com.activeOMSOrder({
                    data: SelectData,
                    Active: 1,
                }, function (res) {
                    alert("激活成功");
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
                //if (SelectData[0].Status != 1) {
                //    alert("数据选择有误！")
                //    return;
                //}
                for (var i = 0; i < SelectData.length; i++) {

                    $com.util.deleteLowerProperty(SelectData[i]);
                    SelectData[i].PlanReceiveDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].PlanReceiveDate));
                    SelectData[i].RealReceiveDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].RealReceiveDate));
                    SelectData[i].PlanFinishDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].PlanFinishDate));
                    SelectData[i].RealStartDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].RealStartDate));
                    SelectData[i].RealFinishDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].RealFinishDate));
                    SelectData[i].RealSendDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].RealSendDate));
                    SelectData[i].AuditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].AuditTime));
                    SelectData[i].CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].CreateTime));
                    SelectData[i].EditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].EditTime));
                }
                model.com.activeOMSOrder({
                    data: SelectData,
                    Active: 0,
                }, function (res) {
                    alert("禁用成功");
                    model.com.refresh();


                })

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
                // if (SelectData[0].Status != 1) {
                //     alert("数据选择有误，请选择状态为创建的数据！")
                //     return;
                // }

                var default_value = {
                    LineID: SelectData[0].LineID,
                    PartID: SelectData[0].PartID,
                    MaterialID: SelectData[0].MaterialID,
                    ProductID: SelectData[0].ProductID,
                    InstallCheckMode: SelectData[0].InstallCheckMode,
                    //IsThisPart: SelectData[0].IsThisPart,
                    Status: SelectData[0].Status,


                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;


                    SelectData[0].LineID = Number(rst.LineID);
                    SelectData[0].Status = Number(rst.Status);
                    SelectData[0].PartID = Number(rst.PartID);
                    SelectData[0].MaterialID = Number(rst.MaterialID);
                    SelectData[0].ProductID = Number(rst.ProductID);
                    SelectData[0].InstallCheckMode = Number(rst.InstallCheckMode);
                    //SelectData[0].IsThisPart = rst.IsThisPart;
                    // SelectData[0].Status = Number(rst.Status);

                    //格式化时间
                    SelectData[0].AuditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[0].AuditTime));
                    SelectData[0].CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[0].CreateTime));
                    SelectData[0].EditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[0].EditTime));
                    for (var i = 0; i < SelectData.length; i++) {

                        $com.util.deleteLowerProperty(SelectData[i]);
                    }

                    model.com.postAPSInstallation({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                        //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                        //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    })

                }, TypeSource_Level));


            });
            //新增
            $("body").delegate("#zace-add-level", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    //PositionTemp.Active = rst.Active;               
                    PositionTemp.LineID = Number(rst.LineID);
                    PositionTemp.Status = Number(rst.Status);
                    PositionTemp.PartID = Number(rst.PartID);
                    PositionTemp.MaterialID = Number(rst.MaterialID);
                    PositionTemp.ProductID = Number(rst.ProductID);
                    PositionTemp.InstallCheckMode = Number(rst.InstallCheckMode);
                    //PositionTemp.IsThisPart = rst.IsThisPart;

                    model.com.postAPSInstallation({
                        data: PositionTemp,
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                    })



                }, TypeSource_Level));


            });
            //提交
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

                    model.com.postOMSOrder({
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
            //撤销
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

            //审批查询
            $("body").delegate("#zace-search-returnAudit", "input", function () {

                var $this = $(this),
                    value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevelAudit-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevelAudit-tbody"), DataAllSearch, value, "ID");



            });
            //所有查询
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

            //审核
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

            //反审核
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

            model.com.getFMCLine({ FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0 }, function (resP) {
                if (!resP)
                    return;

                $.each(resP.list, function (i, item) {
                    TypeSource_Level.LineID.push({
                        value: item.ID,
                        name: item.Name
                    });
                });

                model.com.getFPCPart({ FactoryID: 0, BusinessUnitID: 0 }, function (resP) {

                    if (!resP)
                        return;

                    $.each(resP.list, function (i, item) {
                        TypeSource_Level.PartID.push({
                            value: item.ID,
                            name: item.Name
                        });
                    });

                    model.com.getFPCProduct({ ProductTypeID: 0, BusinessUnitID: 0 }, function (resP) {
                        if (!resP)
                            return;

                        $.each(resP.list, function (i, item) {
                            TypeSource_Level.ProductID.push({
                                value: item.ID,
                                name: item.ProductName
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
                });
            });
        },

        com: {
            refresh: function () {
                model.com.getAPSInstallation({}, function (resP) {
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
            //查询
            getFPCProduct: function (data, fn, context) {
                var d = {
                    $URI: "/FPCProduct/All",
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
            //查询产线列表
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
            //查询列表
            getAPSInstallation: function (data, fn, context) {
                var d = {
                    $URI: "/APSInstallation/All",
                    $TYPE: "get",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //保存列表
            postAPSInstallation: function (data, fn, context) {
                var d = {
                    $URI: "/APSInstallation/Update",
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
                    $URI: "/BusinessUnit/Audit",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //激活
            activeOMSOrder: function (data, fn, context) {
                var d = {
                    $URI: "/OMSOrder/Active",
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