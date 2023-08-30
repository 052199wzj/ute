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
        mLineID,
        mProductID,
        DataLinelist,
        DataAllFactorySearch,
        HTML;

    mLineID = 1;
    mProductID = 0;
    DataAll = [];
    DATABasic = [];
    DataAllConfirmBasic = [];
    DataAllConfirmChange = [];
    DataAllConfirm = [];
    DataAllFactorySearch = DataAllSearch = [];
    PositionTemp = {
        Active: 1,
        CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Creator: window.parent.User_Info.Name,
        CreatorID: 0,
        AuditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Auditor: window.parent.User_Info.Name,
        AuditorID: 0,
        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Editor: window.parent.User_Info.Name,
        EditorID: 0,
        BusinessUnit: "",
        Factory: "",
        FQTY: 0,
        ID: 0,
        Line: "",
        PartPointID: 0,
        Period: 0,
        CalcFQTY: 0,
        ProductID: 0,
        ProductNo: "",
        ProductType: "",
        StationID: 0,
        Status: 3,
        StatusText: "",
    };

    HTML = {
        TableMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td style="display:none" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            //'<td data-title="Factory" data-value="{{Factory}}" >{{Factory}}</td>',
            '<td data-title="LineID" data-value="{{LineID}}" >{{LineID}}</td>',
            '<td data-title="PartID" data-value="{{PartID}}" >{{PartID}}</td>',
            // '<td data-title="PartPointID" data-value="{{PartPointID}}" >{{PartPointID}}</td>',
            '<td data-title="ProductName" data-value="{{ProductName}}" >{{ProductName}}</td>',
            '<td data-title="ProductNo" data-value="{{ProductNo}}" >{{ProductNo}}</td>',

            '<td data-title="APSStepNext" data-value="{{APSStepNext}}" >{{APSStepNext}}</td>',

            '<td data-title="FQTY" data-value="{{FQTY}}" >{{FQTY}}</td>',
            '<td data-title="CalcFQTY" data-value="{{CalcFQTY}}" >{{CalcFQTY}}</td>',
            // '<td data-title="Period" data-value="{{Period}}" >{{Period}}</td>',
            // '<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',
            '<td data-title="Creator" data-value="{{Creator}}" >{{Creator}}</td>',
            '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
            '<td data-title="Editor" data-value="{{Editor}}" >{{Editor}}</td>',
            '<td data-title="EditTime" data-value="{{EditTime}}" >{{EditTime}}</td>',
            '<td data-title="Active" data-value="{{Active}}"><span class="badge lmvt-badge {{ClassBadge}}">{{Badge}}</span>{{Active}}</td>',
            //'<td data-title="Auditor" data-value="{{Auditor}}" >{{Auditor}}</td>',
            //'<td data-title="AuditTime" data-value="{{AuditTime}}" >{{AuditTime}}</td>',
            '<td style="min-width: 40px" data-title="Handle" data-value="{{WID}}"><div class="row">',
            '<div class="col-md-6 {{ISAllowed}}">{{ISAllowedText}}</div>',
            '<div class="col-md-6 lmvt-do-info">修改</div>',
            '</td>',
            '</tr>',
        ].join(""),
    };
    (function () {
        KEYWORD_Level_LIST = [
            "ProductID|型号|ArrayOne",
            "PartPointID|工步|ArrayOne",
            "WorkShopID|车间|ArrayOne",
            "LineID|产线|ArrayOneControl",
            "PartID|工序|ArrayOneControl",
            "APSStepNext|工序偏移量",

            "FQTY|单次批量",
            "CalcFQTY|单日批量",
            "Period|加工周期(分钟)",
            "Active|启用|ArrayOne",
            "Status|状态|ArrayOne",
            "CreateTime|时间|DateTime",
            "EditTime|时间|DateTime",
        ];
        KEYWORD_Level = {};
        FORMATTRT_Level = {};

        DEFAULT_VALUE_Level = {
            FQTY: 0,
            CalcFQTY: 0,
            //WorkShopID: 0,
            LineID: 0,
            StationID: 0,
            //VersionNo: "",
            ProductID: 0,
            PartPointID: 0,

            APSStepNext: 0
        };

        TypeSource_Level = {
            PartID: [

            ],
            ProductID: [

            ],
            PartPointID: [

            ],
            WorkShopID: [

            ],
            LineID: [

            ],
            Active: [
                {
                    name: "禁用",
                    value: 0,
                }, {
                    name: "禁用",
                    value: 1,
                }, {
                    name: "启用",
                    value: 2,
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
                },],
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
        name: '工序工时',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {

            //保存
            $("body").delegate("#zace-save-level", "click", function () {

                var a = 0;
                for (var i = 0; i < DataAll.length; i++) {
                    DataAll[i].LineID = mLineID;
                    $com.util.deleteLowerProperty(DataAll[i]);
                }
                $com.app.loading();
                var WhileAdd = function () {

                    model.com.postFPCManuCapacity({
                        data: DataAll[a],
                    }, function (res) {
                        a++;

                        if (a == DataAll.length) {
                            $com.app.loaded();

                            //alert("保存成功");
                            model.com.refresh();
                        } else {
                            WhileAdd();
                        }
                    });

                }
                if (DataAll.length <= 0) {
                    alert("数据为空！！！");
                } else {
                    WhileAdd();
                }
            });
            ////条件查询
            //$("body").delegate("#zace-searchApproval-level", "click", function () {
            //    var default_value = {
            //        //WorkShopID: 0,
            //        LineID: 0,
            //        StationID: 0,

            //    };
            //    var default_valueChange = {                    
            //        StationID: 0,
            //    };
            //    $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


            //        if (!rst || $.isEmptyObject(rst))
            //            return;

            //        default_valueChange.StationID = Number(rst.StationID);
            //        $com.table.filterByConndition($("#femi-riskLevel-tbody"), DataAll, default_valueChange, "ID");

            //    }, TypeSource_Level));


            //});
            //查询
            $("body").delegate("#zace-searchApproval-level", "click", function () {
                var default_value = {
                    LineID: 0,
                    ProductID: 0,
                };

                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {

                    if (!rst || $.isEmptyObject(rst))
                        return;
                    mLineID = Number(rst.LineID);
                    mProductID = Number(rst.ProductID);
                    model.com.refresh();

                }, TypeSource_Level));
            });

            //查询
            $("body").delegate("#zace-search-levelPro", "click", function () {

                var $this = $(this),
                    value = $("#zace-search-level").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAll, value, "ID");
            });

            //查询
            $("body").delegate("#zace-search-level", "input", function () {

                var $this = $(this),
                    value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAll, value, "ID");



            });

            //修改 单条
            $("body").delegate(".lmvt-do-info", "click", function () {


                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DataAll.filter((item) => { return item.WID == wID });

                var default_value = {
                    //Status:SelectData[0].Status,
                    // FQTY: SelectData[0].FQTY,
                    // StationID: SelectData[0].StationID,
                    CalcFQTY: SelectData[0].CalcFQTY,
                    //  ProductID: SelectData[0].ProductID,
                    // PartPointID: SelectData[0].PartPointID,
                    APSStepNext: SelectData[0].APSStepNext,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    //SelectData[0].Status = Number(rst.Status);
                    // SelectData[0].FQTY = rst.FQTY;
                    //  SelectData[0].StationID = Number(rst.StationID);
                    SelectData[0].CalcFQTY = Number(rst.CalcFQTY);
                    //  SelectData[0].ProductID = Number(rst.ProductID);
                    //  SelectData[0].PartPointID = Number(rst.PartPointID);

                    SelectData[0].APSStepNext = Number(rst.APSStepNext);

                    var y = String(SelectData[0].CalcFQTY).indexOf(".") + 1;//获取小数点的位置
                    var yy = String(SelectData[0].FQTY).indexOf(".") + 1;//获取小数点的位置

                    if (y > 0 || yy > 0) {
                        alert("请输入整数！");
                        return false;
                    }

                    if (SelectData[0].ID == 0) {
                        var currentProfileIndex = (DataAll || []).findIndex((profile) => profile.WID === SelectData[0].WID);
                        DataAll[currentProfileIndex] = SelectData[0];
                        model.com.refreshFake();
                        alert("修改成功");
                    } else {
                        $com.util.deleteLowerProperty(SelectData);
                        model.com.postFPCManuCapacity({
                            data: SelectData[0],
                        }, function (res) {
                            alert("修改成功");
                            model.com.refresh();
                            //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                            //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                        })

                    }
                }, TypeSource_Level));


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
                var default_value = {
                    //Status:SelectData[0].Status,
                    //FQTY: SelectData[0].FQTY,
                    // StationID: SelectData[0].StationID,
                    CalcFQTY: SelectData[0].CalcFQTY,
                    //  ProductID: SelectData[0].ProductID,
                    // PartPointID: SelectData[0].PartPointID,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    //SelectData[0].Status = Number(rst.Status);
                    SelectData[0].FQTY = 1;
                    //  SelectData[0].StationID = Number(rst.StationID);
                    SelectData[0].CalcFQTY = Number(rst.CalcFQTY);
                    //  SelectData[0].ProductID = Number(rst.ProductID);
                    //  SelectData[0].PartPointID = Number(rst.PartPointID);

                    var y = String(SelectData[0].CalcFQTY).indexOf(".") + 1;//获取小数点的位置
                    var yy = String(SelectData[0].FQTY).indexOf(".") + 1;//获取小数点的位置

                    if (y > 0 || yy > 0) {
                        alert("请输入整数！");
                        return false;
                    }
                    for (var i = 0; i < SelectData.length; i++) {

                        $com.util.deleteLowerProperty(SelectData[i]);
                    }
                    model.com.postFPCManuCapacity({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                        //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                        //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    })

                }, TypeSource_Level));


            });
            //制造能力启用
            $("body").delegate("#zace-active-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].ID == 0) {
                        alert("数据有误！编号应大于零！");
                        return false;
                    }
                }

                for (var i = 0; i < SelectData.length; i++) {

                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                model.com.activeAudit({
                    data: SelectData,
                    Active: 1,
                }, function (res) {
                    alert("启用成功");
                    model.com.refresh();
                })
            });
            //制造能力启用 单条
            $("body").delegate(".lmvt-do-active", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DataAll.filter((item) => { return item.WID == wID });

                // for (var i = 0; i < SelectData.length; i++) {
                //     if (SelectData[i].ID == 0) {
                //         alert("数据有误！编号应大于零！");
                //         return false;
                //     }
                // }

                if (SelectData[0].ID == 0) {
                    SelectData[0].Active = 2;
                    var currentProfileIndex = (DataAll || []).findIndex((profile) => profile.WID === SelectData[0].WID);
                    DataAll[currentProfileIndex] = SelectData[0];
                    model.com.refreshFake();
                    alert("启用成功");
                } else {
                    $com.util.deleteLowerProperty(SelectData);
                    model.com.activeAudit({
                        data: SelectData[0],
                        Active: 2,
                    }, function (res) {
                        alert("启用成功");
                        model.com.refresh();
                    })

                }
            });
            //制造能力禁用 单条
            $("body").delegate(".lmvt-do-forbidden", "click", function () {
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DataAll.filter((item) => { return item.WID == wID });


                if (SelectData[0].ID == 0) {
                    SelectData[0].Active = 1;
                    var currentProfileIndex = (DataAll || []).findIndex((profile) => profile.WID === SelectData[0].WID);
                    DataAll[currentProfileIndex] = SelectData[0];
                    model.com.refreshFake();
                    alert("禁用成功");
                } else {
                    $com.util.deleteLowerProperty(SelectData);
                    model.com.activeAudit({
                        data: SelectData[0],
                        Active: 1,
                    }, function (res) {
                        alert("禁用成功");
                        model.com.refresh();
                    })

                }

                // $com.util.deleteLowerProperty(SelectData);

                // model.com.activeAudit({
                //     data: SelectData,
                //     Active: 0,
                // }, function (res) {
                //     alert("禁用成功");
                //     model.com.refresh();


                // })

            });
            //制造能力禁用
            $("body").delegate("#zace-disable-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].ID == 0) {
                        alert("数据有误！编号应大于零！");
                        return false;
                    }
                }

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
            //制造能力新增
            $("body").delegate("#zace-add-level", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    // PositionTemp.Active = rst.Active;
                    PositionTemp.FQTY = Number(rst.FQTY);
                    PositionTemp.CalcFQTY = Number(rst.CalcFQTY);
                    PositionTemp.StationID = Number(rst.StationID);
                    PositionTemp.ProductID = Number(rst.ProductID);
                    PositionTemp.PartPointID = Number(rst.PartPointID);

                    var y = String(PositionTemp.CalcFQTY).indexOf(".") + 1;//获取小数点的位置
                    var yy = String(PositionTemp.FQTY).indexOf(".") + 1;//获取小数点的位置

                    // if (y > 0 || yy > 0) {
                    //     alert("请输入整数！");
                    //     return false;
                    // }

                    model.com.postFPCManuCapacity({
                        data: PositionTemp,
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                    })

                }, TypeSource_Level));


            });

        },

        run: function () {

            model.com.getFPCProduct({}, function (resR1) {
                if (resR1 && resR1.list) {
                    DataProductlist = resR1.list;
                    $.each(resR1.list, function (i, item) {
                        TypeSource_Level.ProductID.push({
                            name: item.ProductNo,
                            value: item.ID,
                        });
                    });
                }
                model.com.getFPCPartPoint({}, function (resR2) {
                    if (resR2 && resR2.list) {
                        $.each(resR2.list, function (i, item) {
                            TypeSource_Level.PartPointID.push({
                                name: item.Name,
                                value: item.ID,
                            });
                        });
                    }
                    model.com.getFMCStation({}, function (resR2) {
                        if (resR2 && resR2.list) {
                            $.each(resR2.list, function (i, item) {
                                TypeSource_Level.PartID.push({
                                    name: item.Name,
                                    value: item.ID,

                                });
                            });
                        }
                        model.com.getFMCLine({ FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0 }, function (resW) {
                            if (resW && resW.list) {
                                DataLinelist = resW.list;
                                $.each(resW.list, function (i, item) {
                                    TypeSource_Level.LineID.push({
                                        name: item.Name,
                                        value: item.ID,
                                        // far: item.WorkShopID
                                    });
                                });
                            }

                            mLineID = DataLinelist[0].ID;
                            mProductID = DataProductlist[0].ID;
                            //model.com.setMMM();
                            model.com.refresh();

                        });
                    });
                });
            });

        },

        com: {
            setMMM: function () {
                setTimeout(function () {

                    if (window.parent._zaceProductSet && window.parent._zaceProductSet == 1) {
                        model.com.getFPCProduct({}, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {
                                //TypeSource_Level.AuditorID.splice(1, TypeSource_Level.AuditorID.length - 1);
                                TypeSource_Level.ProductID = [];
                                DataProductlist = resW.list;
                                $.each(resW.list, function (i, item) {
                                    TypeSource_Level.ProductID.push({
                                        name: item.ProductNo,
                                        value: item.ID,
                                    });
                                });
                            }
                            window.parent._zaceProductSet = 0;
                        });

                    }

                    if (window.parent._zaceLineSet && window.parent._zaceLineSet == 1) {
                        model.com.getFMCLine({ FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0 }, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {
                                //TypeSource_Level.AuditorID.splice(1, TypeSource_Level.AuditorID.length - 1);
                                TypeSource_Level.LineID = [];
                                DataLinelist = resW.list;
                                $.each(resW.list, function (i, item) {
                                    TypeSource_Level.LineID.push({
                                        name: item.Name,
                                        value: item.ID,
                                        // far: item.WorkShopID
                                    });
                                });
                            }
                            window.parent._zaceLineSet = 0;
                        });

                    }


                    model.com.setMMM();
                }, 500);

            },

            refreshFake: function () {
                var Grade = $com.util.Clone(DataAll);

                $.each(Grade, function (i, item) {

                    item.LineID = mLineID;

                    item.Badge = " ";

                    if (item.Active == 1) {
                        item.ISAllowedText = "禁用";
                        item.ISAllowed = "lmvt-do-forbidden";
                        item.ClassBadge = "lmvt-activeBadge";
                    } else {
                        item.ISAllowedText = "启用";
                        item.ISAllowed = "lmvt-do-active";
                        item.ClassBadge = "lmvt-forbiddenBadge";
                    }

                    for (var p in item) {
                        if (!FORMATTRT_Level[p])
                            continue;
                        item[p] = FORMATTRT_Level[p](item[p]);
                    }
                });
                DataAllFactorySearch = $com.util.Clone(Grade);

                $("#femi-riskLevel-tbody").html($com.util.template(Grade, HTML.TableMode));
            },

            refresh: function () {

                model.com.getFPCManuCapacityLineAll({ LineID: mLineID, ProductID: mProductID }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {

                        $.each(resP.list, function (i, item) {
                            item.WID = i + 1;
                            // item.LineID = mLineID;
                        });
                        var Grade = $com.util.Clone(resP.list);
                        DataAll = $com.util.Clone(resP.list);
                        var bool = true;

                        $.each(Grade, function (i, item) {

                            item.WID = i + 1;

                            item.LineID = mLineID;

                            item.Badge = " ";

                            if (item.Active == 1) {
                                item.ISAllowedText = "启用";
                                item.ISAllowed = "lmvt-do-active";
                                item.ClassBadge = "lmvt-forbiddenBadge";
                            } else if (item.Active == 0) {
                                item.ISAllowedText = "启用";
                                item.ISAllowed = "lmvt-do-active";
                                item.ClassBadge = "lmvt-forbiddenBadge";
                            } else {
                                item.ISAllowedText = "禁用";
                                item.ISAllowed = "lmvt-do-forbidden";
                                item.ClassBadge = "lmvt-activeBadge";
                            }

                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }
                        });
                        DataAllFactorySearch = $com.util.Clone(Grade);
                        $("#femi-riskLevel-tbody").html($com.util.template(Grade, HTML.TableMode));


                        // if (Grade.length > 0) {

                        //     //DATABasic = $com.util.Clone(resP.list);
                        //     for (var i = 0; i < Grade.length; i++) {
                        //         if (Grade[i].ID == 0) {
                        //             Grade[i].Status = 3;
                        //             Grade[i].FQTY = 1;
                        //             Grade[i].Active = 1;
                        //             Grade[i].LineID = mLineID;

                        //         } else {

                        //             Grade[i].LineID = mLineID;
                        //         }
                        //     }

                        //     for (var i = 0; i < Grade.length; i++) {
                        //         Grade[i].WID = i + 1;
                        //     }
                        //     DataAll = $com.util.Clone(Grade);

                        //     for (var index = 0; index < DataAll.length; index++) {
                        //         if (DataAll[index].ID == 0) {
                        //             $("#zace-save-level").click();
                        //             bool = false;
                        //             return false;
                        //         }

                        //     }
                        // }
                    }

                });
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
            //查询标准工序
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
            //查询产品
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
            //查询工位
            getFMCStation: function (data, fn, context) {
                var d = {
                    $URI: "/FPCPart/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //根据产线查询制造能力列表
            getFPCManuCapacityLineAll: function (data, fn, context) {
                var d = {
                    $URI: "/FPCManuCapacity/LineAll",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //查询制造能力列表
            getFPCManuCapacity: function (data, fn, context) {
                var d = {
                    $URI: "/FPCManuCapacity/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //保存制造能力列表
            postFPCManuCapacity: function (data, fn, context) {
                var d = {
                    $URI: "/FPCManuCapacity/Update",
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
                    $URI: "/FPCManuCapacity/Audit",
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
                    $URI: "/FPCManuCapacity/Active",
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