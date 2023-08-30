require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/jquery.treeview', '../static/utils/js/base/tooltip', '../static/utils/js/base/route_new'], function ($zace, $com, $treeview, $tooltip, $route) {

    var KEYWORD_Level_LIST,
        KEYWORD_Level,
        FORMATTRT_Level,
        DEFAULT_VALUE_Level,
        TypeSource_Level,
        KEYWORD_condition_LIST,
        KEYWORD_condition,
        FORMATTRT_condition,
        DEFAULT_VALUE_condition,
        TypeSource_condition,
        mProductID,
        model,
        DataAll,
        DataCustomer,
        DataBasicGrid,
        DATABasic,
        DataAllConfirmBasic,
        DataAllConfirmChange,
        DataAllConfirm,
        DataShow,
        DataAllSearch,
        DataAllFactorySearch,
        mWidth,
        HTML;

    var mZacePart = [];//工段 （工位表）
    var RouteID;
    dataRoute = [];
    RouteColor = {};
    DataShow = {};
    dataPart = [];
    dataPartPoint = [];
    DataAll = [];
    DATABasic = [];
    DataAllConfirmBasic = [];
    DataAllConfirmChange = [];
    DataAllConfirm = [];
    mProductID = 0;
    DataAllFactorySearch = DataAllSearch = [];
    PositionTemp = {
        Active: true,
        Auditor: window.parent.User_Info.Name,
        AuditorID: 0,
        AuditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        BusinessUnit: "",
        CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Creator: window.parent.User_Info.Name,
        CreatorID: 0,
        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Editor: window.parent.User_Info.Name,
        EditorID: 0,
        Factory: "",
        ID: 0,
        Line: "",
        ProductID: 0,
        ProductNo: "",
        ProductType: "",
        RouteID: 0,
        RouteName: "",
        VersionNo: "",
        Status: 3,
        StatusText: "",
    };

    PositionTempRoute = {
        Active: true,
        Auditor: window.parent.User_Info.Name,
        AuditorID: 0,
        AuditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        BusinessUnit: "",
        BusinessUnitID: 1,
        CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Creator: window.parent.User_Info.Name,
        CreatorID: 0,
        Description: "",
        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Editor: window.parent.User_Info.Name,
        EditorID: 0,
        Factory: "",
        FactoryID: 1,
        LineID: 0,
        ID: 0,
        Name: "",
        ProductType: "",
        ProductTypeID: 0,
        Status: 1,
        StatusText: "",
        VersionNo: "",
    };
    ZaceData = [];
    DataTemp = {
        level: 0,
        list: []
    }

    Temp = {
        ID: 0,
        ProductID: 0,
        RouteID: 0,
        PartID: 0,
        PartPointID: 0,
        ItemID: 0,
        ItemValue: 0,


    }
        ;
    HTML = {
        TableMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',

            // '<td data-title="RouteName" data-value="{{RouteName}}" >{{RouteName}}</td>',
            '<td data-title="VersionNo" data-value="{{VersionNo}}" >{{VersionNo}}</td>',
            // '<td data-title="BusinessUnit" data-value="{{BusinessUnit}}" >{{BusinessUnit}}</td>',
            // '<td data-title="Factory" data-value="{{Factory}}" >{{Factory}}</td>',
            '<td data-title="Line" data-value="{{Line}}" >{{Line}}</td>',
            // '<td data-title="ProductType" data-value="{{ProductType}}" >{{ProductType}}</td>',
            '<td data-title="ProductNo" data-value="{{ProductNo}}" >{{ProductNo}}</td>',
            //'<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',

            '<td data-title="Creator" data-value="{{Creator}}" >{{Creator}}</td>',
            '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
            // '<td data-title="Editor" data-value="{{Editor}}" >{{Editor}}</td>',
            // '<td data-title="EditTime" data-value="{{EditTime}}" >{{EditTime}}</td>',
            // '<td data-title="Active" data-value="{{Active}}" >{{Active}}</td>',
            //'<td data-title="Auditor" data-value="{{Auditor}}" >{{Auditor}}</td>',
            // '<td data-title="AuditTime" data-value="{{AuditTime}}" >{{AuditTime}}</td>',
            '</tr>',
        ].join(""),



    };
    (function () {
        KEYWORD_Level_LIST = [
            "Name|名称",
            "VersionNo|编码",
            "LineID|修程|ArrayOne",

            "RouteID|工艺路线|ArrayOne",
            "PartID|工区|ArrayOne",
            "PartPointID|工位|ArrayOne",
            "ProductID|车型|ArrayOne",
            "Status|状态|ArrayOne",
            "Active|启用|ArrayOne",
            "CreateTime|时间|DateTime",
            "EditTime|时间|DateTime",
        ];
        KEYWORD_Level = {};
        FORMATTRT_Level = {};

        DEFAULT_VALUE_Level = {
            // Name: "",
            // VersionNo: "",
            LineID: 0,
            ProductID: 0,
            //RouteID: 0,
            // Active: true,
        };

        TypeSource_Level = {
            Active: [
                {
                    name: "启用",
                    value: 1
                }, {
                    name: "禁用",
                    value: 0
                }
            ],
            LineID: [
            ],
            RouteID: [
                {
                    name: "无",
                    value: 0,
                }
            ],
            PartID: [
                {
                    name: "无",
                    value: 0,
                }
            ],
            ProductID: [],
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

    (function () {
        KEYWORD_condition_LIST = [
            "RouteNameZ|路线|Readonly",
            "PartNameZ|工位|Readonly",
            //"PartPointNameZ|工位|Readonly",


        ];
        KEYWORD_condition = {};
        FORMATTRT_condition = {};



        TypeSource_condition = {


        };

        $.each(KEYWORD_condition_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD_condition[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_condition[detail[0]] = $com.util.getFormatter(TypeSource_condition, detail[0], detail[2]);
            }
        });
    })();
    model = $com.Model.create({
        name: '路线',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            $("body").delegate("#zace-zace-refresh", "click", function () {

                model.com.refresh();

            });
            //zace-search-routeLine
            //条件查询
            $("body").delegate("#zace-search-routeLine", "click", function () {
                var default_value = {
                    RouteID: 0,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.RouteID = Number(rst.RouteID);

                    $com.table.filterByConndition($("#femi-riskLevel-tbody"), DataAll, default_value, "ID");

                }, TypeSource_Level));


            });
            //Enter触发模糊查询事件
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var
                        value = $("#zace-search-level").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-riskLevel-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "ID");
                }
            });
            //产品工艺路线查询
            $("body").delegate("#zace-myAudit-levelZace", "click", function () {

                var
                    value = $("#zace-search-level").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "ID");



            });
            //产品工艺路线修改
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
                var default_value = {
                    ProductID: SelectData[0].ProductID,
                    //RouteID: SelectData[0].RouteID,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].ProductID = Number(rst.ProductID);
                    //SelectData[0].RouteID = Number(rst.RouteID);
                    // SelectData[0].Active = rst.Active;
                    for (var i = 0; i < SelectData.length; i++) {
                        $com.util.deleteLowerProperty(SelectData[i]);
                    }
                    model.com.postFPCProductRoute({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                        //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                        //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    })

                }, TypeSource_Level));


            });

            //产品工艺路线启用
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
                model.com.activeAudit({
                    data: SelectData,
                    Active: 1,
                }, function (res) {
                    alert("启用成功");
                    model.com.refresh();


                })




            });
            //产品工艺路线禁用
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
                model.com.activeAudit({
                    data: SelectData,
                    Active: 0,
                }, function (res) {
                    alert("禁用成功");
                    model.com.refresh();


                })

            });

            //产品工艺路线新增
            $("body").delegate("#zace-add-level", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    PositionTemp.ProductID = Number(rst.ProductID);

                    PositionTempRoute.LineID = Number(rst.LineID);


                    PositionTempRoute.Name =FORMATTRT_Level["LineID"](Number(rst.LineID))+"-"+FORMATTRT_Level["ProductID"](Number(rst.ProductID));
                    PositionTempRoute.VersionNo = PositionTempRoute.Name;

                    model.com.postFPCRoute({
                        data: PositionTempRoute,
                    }, function (res) {

                        PositionTemp.RouteID = Number(res.info.ID);
                        model.com.postFPCProductRoute({
                            data: PositionTemp,
                        }, function (res) {
                            alert("新增成功");
                            model.com.refresh();
                        })
                      
                    })


                  

                }, TypeSource_Level));


            });
            //产品工艺路线提交
            $("body").delegate("#zace-up-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }

                //for (var i = 0; i < SelectData.length; i++) {
                //    if (SelectData[i].Status == 2 || SelectData[i].Status == 0) {
                //        alert("有数据已被提交,请重新选择!!");
                //        return;

                //    }
                //    else if (SelectData[i].Status == 3 || SelectData[i].Status == 4) {
                //        alert("有数据已被审核,请重新选择!!");
                //        return;
                //    }

                //}
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其提交？")) {
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                for (var i = 0; i < SelectData.length; i++) {

                    //var wid = SelectData[i].WID;
                    SelectData[i].Status = 2;
                    model.com.postFPCProductRoute({
                        data: SelectData[i],
                    }, function (res) {
                        alert("提交成功");
                        model.com.refresh();
                    })
                }
            });
            //产品工艺路线撤销
            $("body").delegate("#zace-return-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }

                //for (var i = 0; i < SelectData.length; i++) {
                //    if (SelectData[i].Status == 1 || SelectData[i].Status == 0) {
                //        alert("数据选择有误,请重新选择!");
                //        return;

                //    }
                //    else if (SelectData[i].Status == 3 || SelectData[i].Status == 4) {
                //        alert("有数据已被审核,请重新选择!");
                //        return;
                //    }

                //}
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其撤回？")) {
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                for (var i = 0; i < SelectData.length; i++) {

                    //var wid = SelectData[i].WID;
                    SelectData[i].Status = 1;

                    model.com.postFPCProductRoute({
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
                $(".zzzc").hide();

            });


            $("body").delegate("#zace-addLine-levelReturn", "click", function () {

                $('.zace-cbd-contain').show();
                $(".zzza").show();
                $('.zzzb').hide();
                $('.zzzc').hide();

                $('#DragLine').html('');  //清空隐藏
                $('#DragLine').hide();
                $(".route-main").hide();
                $('.zace-line-route').hide();





            });

            $("body").delegate("#zace-open-routeLine", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！")
                    return;
                }

                $('.zace-cbd-contain').hide();
                $(".zzza").hide();
                $('#DragLine').show();
                $('#Drag').hide();
                $('.zace-line-route').show();




                mProductID = SelectData[0].ProductID;
                var _dataRoute = $com.util.Clone(dataRoute);
                RouteID = SelectData[0].RouteID;



                model.com.getPartAll({}, function (resW) {
                    if (!resW)
                        return;
                    if (resW && resW.list) {

                        var _dataPart = $com.util.Clone(resW.list);
                        mZacePart = $com.util.Clone(resW.list);


                        model.com.renderRouteChart(RouteID, _dataPart);




                        var title = FORMATTRT_Level["RouteID"](RouteID) + "工艺流程";
                        $(".zace-titleZ").html(title);
                    }

                });








            });
            $("body").delegate("#zace-addLine-pencil", "click", function () {


                $('.zace-cbd-contain').hide();
                $(".zzza").hide();
                $('#DragLine').show();
                $('#Drag').hide();
                $(".route-main").hide();

                $('.zace-line-route').show();






                _dataPart = $com.util.Clone(mZacePart);
                model.com.renderRouteChart(RouteID, _dataPart);




                var title = FORMATTRT_Level["RouteID"](RouteID) + "工艺流程";
                $(".zace-titleZ").html(title);



            });


            $("body").delegate("#zace-addLine-drag", "click", function () {


                $('.zace-cbd-contain').hide();
                $(".zzza").hide();
                $('#DragLine').hide();
                $('#Drag').show();
                $('.zace-line-route').show();
                $(".route-main").hide();





                _dataPart = $com.util.Clone(mZacePart);
                model.com.renderRouteChartDragLine(RouteID, _dataPart);




                var title = FORMATTRT_Level["RouteID"](RouteID) + "工艺流程";
                $(".zace-titleZ").html(title);



            });

            //返回
            $("body").delegate("#zace-returnAudit-level", "click", function () {
                $(".zzza").show();
                $(".zzzb").hide();
                $(".zzzc").hide();

            });
            //返回
            $("body").delegate("#returnChart", "click", function () {
                $(".zzza").show();
                $(".zzzb").hide();
                $(".zzzc").hide();

            });
            //隐藏
            $("body").delegate("#zace-close-detail", "click", function () {

                $(".right-contain").css("width", "0px");
                $(".left-containPro").css("margin-right", "0px");
                $(".right-contain").hide();
            });

            //产品工艺查询
            $("body").delegate("#zace-search-returnAudit", "input", function () {

                var $this = $(this),
                    value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevelAudit-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevelAudit-tbody"), DataAllSearch, value, "ID");



            });
            //产品工艺审核
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
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                for (var i = 0; i < SelectData.length; i++) {

                    // var wid = SelectData[i].WID;
                    SelectData[i].Status = 3;

                    model.com.postAudit({
                        data: SelectData[i],
                    }, function (res) {
                        alert("审核成功");
                        model.com.refresh();
                    })
                }
            });
            //产品工艺路线反审核
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
                    $com.util.deleteLowerProperty(SelectData[i]);
                }

                for (var i = 0; i < SelectData.length; i++) {

                    //var wid = SelectData[i].WID;
                    SelectData[i].Status = 1;

                    model.com.postAudit({
                        data: SelectData[i],
                    }, function (res) {
                        alert("反审核成功");
                        model.com.refresh();
                    })
                }
            });

            $("body").delegate("#zace-save-detail", "click", function () {
                var suc = $com.propertyGrid.getData($(".zace-pripoty"));
                var _data = suc.data;
                var _list = [];
                if (DataBasicGrid.list.length < 1) {
                    for (var i = 0; i < DataCustomer.length; i++) {
                        var _Temp = $com.util.Clone(Temp);
                        _Temp.PartID = DataBasicGrid.info.PartID;
                        _Temp.PartPointID = DataBasicGrid.info.PartPointID;
                        _Temp.RouteID = DataBasicGrid.info.RouteID;
                        _Temp.ProductID = mProductID;
                        _Temp.ItemID = i + 1;
                        _Temp.ItemValue = suc.data["Custom_" + _Temp.ItemID];
                        _list.push(_Temp);
                    }




                    model.com.postFPCRoutePartPoint({
                        data: DataBasicGrid.info,
                        list: _list
                    }, function (res) {
                        alert("保存成功");
                        model.com.refresh();

                    })
                } else {
                    for (var i = 0; i < DataBasicGrid.list.length; i++) {

                        DataBasicGrid.list[i].ItemValue = suc.data["Custom_" + DataBasicGrid.list[i].ItemID];

                    }




                    model.com.postFPCRoutePartPoint({
                        data: DataBasicGrid.info,
                        list: DataBasicGrid.list
                    }, function (res) {
                        alert("保存成功");
                        model.com.refresh();

                    })

                }

            });



            //
            $("body").delegate("#zace-addLine-save", "click", function () {


                var _list = [];
                for (var i = 0; i < mZacePart.length; i++) {

                    $com.util.deleteLowerProperty(mZacePart[i]);
                    if (RouteID == mZacePart[i].RouteID) {
                        _list.push(mZacePart[i]);
                    }
                }




                var a = 0;
                for (var m = 0; m < _list.length; m++) {

                    model.com.postPartAll({
                        data: _list[m],
                    }, function (res) {
                        a++;
                        if (a == _list.length) {
                            alert("保存成功");
                        }
                    })
                }



            });






        },




        run: function () {
            // model.com.getConfig({}, function (resC) {
            //     if (!resC)
            //         return;
            //     if (resC && resC.list) {
            //         var listC = resC.list;
            //         DataCustomer=resC.list;
            //         $.each(listC, function (i, item) {
            //             KEYWORD_condition["Custom_"+item.PropertyID] = {
            //                 index: i + 3,
            //                 name: item.PropertyName,
            //                 type: item.PropertyType, 
            //             }; 
            //             FORMATTRT_condition["Custom_" + item.PropertyID] = $com.util.getFormatter(TypeSource_condition, "Custom_" + item.PropertyID, item.PropertyType); 
            //         });

            //     }

            // })
            $com.app.loading('数据加载中...');
            model.com.getFPCRoute({ FactoryID: 0, ProductTypeID: 0, BusinessUnitID: 0 }, function (resPZ) {
                if (resPZ && resPZ.list) {
                    dataRoute = resPZ.list;
                    $.each(resPZ.list, function (i, item) {
                        TypeSource_Level.RouteID.push({
                            name: item.Name,
                            value: item.ID,
                        });
                    });
                    //TypeSource_condition.RouteID = TypeSource_Level.RouteID;
                }
                model.com.getFPCProduct({ BusinessUnitID: 0, ProductTypeID: 0 }, function (resBZ) {
                    if (resBZ && resBZ.list) {
                        $.each(resBZ.list, function (i, item) {
                            TypeSource_Level.ProductID.push({
                                name: item.ProductNo,
                                value: item.ID,
                            });
                        });

                    }
                    model.com.getPartAll({}, function (data) {
                        dataPart = data.list;
                        $.each(data.list, function (i, item) {
                            TypeSource_Level.PartID.push({
                                name: item.Name,
                                value: item.ID,
                            });
                        });
                        model.com.getFMCLineAll({}, function (resBZ) {
                            if (resBZ && resBZ.list) {
                                $.each(resBZ.list, function (i, item) {
                                    TypeSource_Level.LineID.push({
                                        name: item.Name,
                                        value: item.ID,
                                        far: 0,
                                    });
                                });

                            }

                            model.com.refresh();
                            model.com.setMMM();
                        });
                    });



                });
            });





        },

        com: {
            //保存产品路线列表
            postFPCRoute: function (data, fn, context) {
                var d = {
                    $URI: "/FPCRoute/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //审
            //查询产线
            getFMCLineAll: function (data, fn, context) {
                var d = {
                    $URI: "/FMCLine/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            setMMM: function () {
                setTimeout(function () {
                    if (window.parent._zaceRoutePartPointSet && window.parent._zaceRoutePartPointSet == 1) {
                        model.com.getPartPointAll({}, function (data) {
                            dataPartPoint = data.list;
                            window.parent._zaceRoutePartPointSet = 0;
                        });

                    }
                    if (window.parent._zaceRoutePartSet && window.parent._zaceRoutePartSet == 1) {
                        model.com.getPartAll({}, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {

                                //TypeSource_materialRecord.SupplierID = [];
                                TypeSource_Level.PartID.splice(1, TypeSource_Level.PartID.length - 1);
                                dataPart = resW.list;
                                $.each(resW.list, function (i, item) {
                                    TypeSource_Level.PartID.push({
                                        name: item.Name,
                                        value: item.ID,
                                    });
                                });
                            }
                            window.parent._zaceRoutePartSet = 0;
                        });

                    }
                    if (window.parent._zaceRouteSet && window.parent._zaceRouteSet == 1) {
                        model.com.getFPCRoute({ FactoryID: 0, ProductTypeID: 0, BusinessUnitID: 0 }, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {
                                //TypeSource_materialRecord.SupplierID = [];
                                TypeSource_Level.RouteID.splice(1, TypeSource_Level.RouteID.length - 1);
                                dataRoute = resW.list;
                                $.each(resW.list, function (i, item) {
                                    TypeSource_Level.RouteID.push({
                                        name: item.Name,
                                        value: item.ID,
                                    });
                                });
                            }
                            window.parent._zaceRouteSet = 0;
                        });

                    }
                    if (window.parent._zaceProductSet && window.parent._zaceProductSet == 1) {
                        model.com.getFPCProduct({ BusinessUnitID: 0, ProductTypeID: 0 }, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {

                                //TypeSource_materialRecord.SupplierID = [];
                                TypeSource_Level.ProductID.splice(1, TypeSource_Level.ProductID.length - 1);
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
                    model.com.setMMM();
                }, 500);

            },
            refresh: function () {
                $com.app.loading('数据加载中...');
                model.com.getFPCProductRoute({ RouteID: 0, ProductID: 0 }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var Grade = $com.util.Clone(resP.list);
                        DATABasic = $com.util.Clone(resP.list);

                        //审核数据
                        DataAllConfirm = $com.util.Clone(resP.list);
                        for (var i = 0; i < Grade.length; i++) {
                            Grade[i].WID = i + 1;
                        }
                        DataAll = $com.util.Clone(Grade);

                        $.each(Grade, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }
                            item.WID = i + 1;
                        });
                        DataAllFactorySearch = $com.util.Clone(Grade);
                        $("#femi-riskLevel-tbody").html($com.util.template(Grade, HTML.TableMode));
                        $com.app.loaded();

                        //===========审核
                        DataAllConfirmChange = [];
                        for (var i = 0; i < DataAllConfirm.length; i++) {
                            if (DataAllConfirm[i].Status == 2 || (DataAllConfirm[i].Status == 3 && DataAllConfirm[i].Auditor == window.parent.User_Info.Name)) {
                                DataAllConfirmChange.push(DataAllConfirm[i]);
                            }
                        }
                        DataAllConfirmBasic = $com.util.Clone(DataAllConfirmChange);
                        for (var j = 0; j < DataAllConfirmChange.length; j++) {
                            DataAllConfirmChange[j].WID = j + 1;
                        }
                        var _listC = $com.util.Clone(DataAllConfirmChange);
                        $.each(_listC, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }
                            item.WID = i + 1;
                        });
                        DataAllSearch = $com.util.Clone(_listC);
                        $("#femi-riskLevelAudit-tbody").html($com.util.template(_listC, HTML.TableMode));


                    }

                });
            },
            refreshGrid: function (id, productId) {
                $com.app.loading('数据加载中...');
                model.com.getFPCRoutePartPointInfo({ ID: id, ProductID: productId }, function (resP1) {
                    if (!resP1)
                        return;
                    if (resP1) {
                        var data = resP1;

                        DataBasicGrid = resP1;
                        var _showData = {};
                        for (var i = 0; i < dataPartPoint.length; i++) {
                            if (id == dataPartPoint[i].ID) {
                                _showData = $com.util.Clone(dataPartPoint[i]);
                            }
                        }
                        DataShow = _showData;

                        var _showDataT = {};
                        if (DataBasicGrid.list.length < 1) {
                            _showDataT.RouteNameZ = DataBasicGrid.info.RouteName;
                            //FORMATTRT_Level["RouteID"](DataBasicGrid.info.RouteID);
                            _showDataT.PartNameZ = DataBasicGrid.info.Name;
                            //_showDataT.PartPointNameZ = DataShow.PartPointName;

                            for (var property in KEYWORD_condition) {
                                if (_showDataT[property] || _showDataT[property] == false || _showDataT[property] == 0)
                                    continue;
                                _showDataT[property] = "";
                            }



                            //KEYWORD_condition.Creator = {
                            //    control: undefined,
                            //    index: 2,
                            //name: "创建者",
                            //type: "Readonly",

                            //}

                            $com.propertyGrid.show($(".zace-pripoty"), _showDataT, KEYWORD_condition, TypeSource_condition);
                        } else {

                            _showDataT.RouteNameZ = DataBasicGrid.info.RouteName;
                            _showDataT.PartNameZ = DataBasicGrid.info.Name;
                            // _showDataT.PartPointNameZ = DataShow.PartPointName;

                            for (var property in KEYWORD_condition) {
                                if (_showDataT[property] || _showDataT[property] == false || _showDataT[property] == 0)
                                    continue;
                                _showDataT[property] = "";
                            }

                            for (var i = 0; i < DataBasicGrid.list.length; i++) {
                                var num = 0;
                                num = i + 1;
                                _showDataT["Custom_" + num] = DataBasicGrid.list[i].ItemValue;
                                if (_showDataT["Custom_" + num] == false || _showDataT["Custom_" + num] == "false") {
                                    _showDataT["Custom_" + num] = false;
                                }
                                if (_showDataT["Custom_" + num] == true || _showDataT["Custom_" + num] == "true") {
                                    _showDataT["Custom_" + num] = true;
                                }
                            }

                            //KEYWORD_condition.Creator = {
                            //    control: undefined,
                            //    index: 2,
                            //name: "创建者",
                            //type: "Readonly",

                            //}

                            $com.propertyGrid.show($(".zace-pripoty"), _showDataT, KEYWORD_condition, TypeSource_condition);
                            $com.app.loaded();
                        }

                    }

                });
            },
            refreshStationGrid: function (id) {

                $com.app.loading('数据加载中...');
                var obj = {};
                for (var i = 0; i < dataPart.length; i++) {

                    if (id == dataPart[i].ID) {
                        obj = dataPart[i];
                    }
                }


                var _showDataT = {};

                _showDataT.RouteNameZ = obj.RouteName;
                //FORMATTRT_Level["RouteID"](DataBasicGrid.info.RouteID);
                _showDataT.PartNameZ = obj.Name;
                //_showDataT.PartPointNameZ = DataShow.PartPointName;



                $com.propertyGrid.show($(".zace-pripoty"), _showDataT, KEYWORD_condition, TypeSource_condition);
                $com.app.loaded();



            },
            getConfig: function (data, fn, context) {
                var d = {
                    $URI: "/FPCProductCustom/Config",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getPartBasicAll: function (data, fn, context) {
                var d = {
                    $URI: "/FPCPart/All",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getPartAll: function (data, fn, context) {
                var d = {
                    $URI: "/FPCRoutePart/All",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            postPartAll: function (data, fn, context) {
                var d = {
                    $URI: "/FPCRoutePart/Update",
                    $TYPE: "post"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },


            getPartPointAll: function (data, fn, context) {
                var d = {
                    $URI: "/FPCRoutePartPoint/All",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //保存工序段列表
            postFPCRoutePartPoint: function (data, fn, context) {
                var d = {
                    $URI: "/FPCRoutePartPoint/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询某个工序
            getFPCRoutePartPointInfo: function (data, fn, context) {
                var d = {
                    $URI: "/FPCRoutePartPoint/Info",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询路线
            getFPCRoute: function (data, fn, context) {
                var d = {
                    $URI: "/FPCRoute/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            OrderList: function (data) {
                var _list = [];
                for (var i = 0; i < data.length; i++) {

                    for (var j = 0; j < data.length; j++) {
                        if ((i + 1) == data[j].OrderID) {
                            _list.push(data[j]);
                        }
                    }

                }
                return _list;

            },
            renderRouteChart: function (RouteID, _dataPart) {

                //拿到此路线下对应的工序段
                var OrderIDList = [];   //順序ID集合
                var routePartArr = [];
                ZaceData = [];   //初始化
                $.each(_dataPart, function (p_i, p_item) {
                    if (RouteID == p_item.RouteID) {
                        routePartArr.push(p_item);
                    }
                    OrderIDList.push(p_item.OrderID);
                });
                OrderIDList = model.com.arryOnea(OrderIDList);

                for (var i = 0; i < OrderIDList.length; i++) {
                    var temp = $com.util.Clone(DataTemp);
                    for (var j = 0; j < routePartArr.length; j++) {
                        if (OrderIDList[i] == routePartArr[j].OrderID) {
                            temp.level = OrderIDList[i];
                            temp.list.push(routePartArr[j]);

                        }

                    }

                    ZaceData.push(temp);




                }


                var routePartArrZace = $com.util.Clone(ZaceData);

                $('#DragLine').html('');
                // var orderPartPointArr = [],
                //     orderPartArr = [];
                // //var _newOrderPart = [];
                // //var _newOrderPartPoint = [];

                // _routePartArr = $com.util.Clone(routePartArr),
                // _routePartArr = model.com.OrderList(_routePartArr);

                // _dataPartPoint = $com.util.Clone(dataPartPoint);
                // //拿到此路线下所有工序段下的工序
                // $.each(_routePartArr, function (i, item) {
                //     $.each(_dataPartPoint, function (p_i, p_item) {
                //         if (item.ID == p_item.PartID) {
                //             orderPartPointArr.push(p_item);
                //         }
                //     });
                //     orderPartPointArr = model.com.OrderList(orderPartPointArr);
                //     orderPartArr = orderPartArr.concat(orderPartPointArr);
                //     orderPartPointArr = [];
                // });

                // //得到的数据排序

                // //添加唯一顺序字段OrderID
                // for (var i = 0; i < orderPartArr.length; i++) {
                //     orderPartArr[i].OrderIDPro = i + 1;
                // }  //////////////////////// 20191220

                //显示流程图

                //为流程图添加方法
                //创建悬浮框方法
                var mouseoverFn = function (data, json) {
                    var cv = $(".left-contain").scrollTop();
                    //var cl = $("#ChartRoute").scrollLeft();
                    var $target = {
                        offset: function () {
                            return {
                                left: json.X + json.left + 300 + 15,
                                top: json.Y + json.top + 60 - cv,
                            };
                        },
                        width: function () {
                            return json.width;
                        },
                        height: function () {
                            return json.height;
                        },
                    }
                    //var x = json.X + json.left;
                    //var y = json.Y + json.top - cv;
                    //  alert(json.Y + "   ---   " + json.top);
                    var dataHtml = model.com.changeData(data);
                    //$tooltip.show({ target: $target, object: dataHtml, orientation: 2, Choice_color: 4, max_width: 200, fontsize: 13, });
                }
                var mouseoutFn = function (data) {
                    $tooltip.clear();
                }
                //点击方法
                var clickFn = function (data, json) {
                    var _info = data;
                    var showInfo = $com.util.Clone(_info);
                    //var _showData = {};
                    //for (var i = 0; i < dataPartPoint.length; i++) {
                    //    if (showInfo.ID == dataPartPoint[i].ID) {
                    //        _showData = $com.util.Clone(dataPartPoint[i]);
                    //    }
                    //}
                    //DataShow = _showData;
                    //20191209

                    // model.com.refreshStationGrid(showInfo.ID);
                    // //model.com.refreshGrid(showInfo.ID,mProductID);



                    // $(".right-contain").css("width", "400px");
                    // $(".left-containPro").css("margin-right", "400px");
                    // $(".right-contain").show();
                    //20191209
                }
                var dragFn = function (data) {
                    var _data = data.data.data;

                    $.each(mZacePart, function (j, item_j) {
                        $.each(_data, function (i, item) {
                            if (item.ID != item_j.PartID)
                                return true;

                            item_j.OrderID = item.OrderID;
                            item_j.PrevPartID = item.PrevID;

                            item_j.NextPartIDMap = {};
                            if (item.NextIDList && item.NextIDList.length > 0) {

                                $.each(item.NextIDList, function (k, item_k) {
                                    item_j.NextPartIDMap[item_k + ""] = 0;
                                    console.log(j);
                                });
                            }

                        });
                    });

                }
                //1 置空
                $("#ChartPartPoint").html("");
                //$(".zzzc").show();

                //2 创建结构
                var dataObj = {

                    data: [],
                    dataSet: {//对应关系
                        "Text": "KKK", //显示字段名称
                        "Index": "ID", //索引字段名称
                        "PrevIndex": "PrevID", //上级字段名称
                        "NextIndex": "NextIDList", //下级字段名称
                        "FatherID": "FatherID",  //父级ID
                        "BGC": "abc", //背景色字段名称
                        "FGC": "bcd", //前景色字段名称
                    },
                    background_color: 'transparent', //流程框背景颜色
                    foreground_color: 'red', //箭头颜色 
                    fn_mouseover: mouseoverFn, //鼠标悬停触发
                    fn_mouseout: mouseoutFn, //鼠标移走事件
                    fn_click: clickFn, //鼠标单击
                    fn_drag: dragFn, //鼠标拖动
                    constant: {
                        lineOperation: true,
                        // dottedLine: true,
                        font: "bold 15px 宋体",//字体样式
                        fontSize: 15,//字体大小
                        rect_width: 200, //矩形的宽
                        rect_height: 50,
                    },
                }
                //3 填充data
                if (routePartArrZace.length != 0) {
                    $.each(routePartArrZace, function (i, item) {
                        var orderList = [];

                        //跳线集合
                        if (i <= routePartArrZace.length - 2) {
                            for (var m = 0; m < routePartArrZace[i + 1].list.length; m++) {
                                orderList.push(routePartArrZace[i + 1].list[m].ID);

                            }
                        }
                        for (var index = 0; index < item.list.length; index++) {
                            var C_list = [];
                            var obj = item.list[index];
                            for (p in obj.NextPartIDMap) {

                                C_list.push({
                                    key: p,
                                    value: obj.NextPartIDMap[p]
                                });


                            }
                            var _listZace = [];
                            for (var j = 0; j < C_list.length; j++) {
                                _listZace.push(C_list[j].key);

                            }

                            dataObj.data.push({
                                // title: item.PartPointName,
                                // ID: item.OrderIDPro,
                                // ZID:item.ID,
                                // PrevID: item.OrderIDPro - 1,
                                // NextID: 0,
                                // backgroundColor: model.com.getRandomColor(item.PartID),
                                // foregroundColor: "white",
                                // PartName: FORMATTRT_Level["PartID"](item.PartID),
                                // RouteName: FORMATTRT_Level["RouteID"](item.RouteID),
                                // VersionNo: item.VersionNo,

                                "KKK": obj.Name, //显示字段名称
                                "ID": obj.PartID, //索引字段名称
                                "PrevID": obj.PrevPartID,
                                //i == 0 ? 0 : routePartArr[i - 1].list[0].ID, //上级字段名称
                                "NextIDList": _listZace.length > 0 ? _listZace : [], //orderList, //跳线集合
                                "OrderID": item.level, //第几层
                                "Type": 1,
                                "abc": "orange", //背景色字段名称
                                "bcd": "black", //前景色字段名称

                            });
                        }

                    });


                    //4 显示流程图
                    $route.show($('#DragLine'), dataObj);
                }
                else {
                    return false;
                }
            },


            renderRouteChartDragLine: function (RouteID, _dataPart) {

                //拿到此路线下对应的工序段
                var OrderIDList = [];   //順序ID集合
                var routePartArr = [];
                ZaceData = [];   //初始化
                $.each(_dataPart, function (p_i, p_item) {
                    if (RouteID == p_item.RouteID) {
                        routePartArr.push(p_item);
                    }
                    OrderIDList.push(p_item.OrderID);
                });
                OrderIDList = model.com.arryOnea(OrderIDList);

                for (var i = 0; i < OrderIDList.length; i++) {
                    var temp = $com.util.Clone(DataTemp);
                    for (var j = 0; j < routePartArr.length; j++) {
                        if (OrderIDList[i] == routePartArr[j].OrderID) {
                            temp.level = OrderIDList[i];
                            temp.list.push(routePartArr[j]);

                        }

                    }

                    ZaceData.push(temp);




                }


                var routePartArrZace = $com.util.Clone(ZaceData);

                $('#Drag').html('');
                // var orderPartPointArr = [],
                //     orderPartArr = [];
                // //var _newOrderPart = [];
                // //var _newOrderPartPoint = [];

                // _routePartArr = $com.util.Clone(routePartArr),
                // _routePartArr = model.com.OrderList(_routePartArr);

                // _dataPartPoint = $com.util.Clone(dataPartPoint);
                // //拿到此路线下所有工序段下的工序
                // $.each(_routePartArr, function (i, item) {
                //     $.each(_dataPartPoint, function (p_i, p_item) {
                //         if (item.ID == p_item.PartID) {
                //             orderPartPointArr.push(p_item);
                //         }
                //     });
                //     orderPartPointArr = model.com.OrderList(orderPartPointArr);
                //     orderPartArr = orderPartArr.concat(orderPartPointArr);
                //     orderPartPointArr = [];
                // });

                // //得到的数据排序

                // //添加唯一顺序字段OrderID
                // for (var i = 0; i < orderPartArr.length; i++) {
                //     orderPartArr[i].OrderIDPro = i + 1;
                // }  //////////////////////// 20191220

                //显示流程图

                //为流程图添加方法
                //创建悬浮框方法
                var mouseoverFn = function (data, json) {
                    var cv = $(".left-contain").scrollTop();
                    //var cl = $("#ChartRoute").scrollLeft();
                    var $target = {
                        offset: function () {
                            return {
                                left: json.X + json.left + 300 + 15,
                                top: json.Y + json.top + 60 - cv,
                            };
                        },
                        width: function () {
                            return json.width;
                        },
                        height: function () {
                            return json.height;
                        },
                    }
                    //var x = json.X + json.left;
                    //var y = json.Y + json.top - cv;
                    //  alert(json.Y + "   ---   " + json.top);
                    var dataHtml = model.com.changeData(data);
                    //$tooltip.show({ target: $target, object: dataHtml, orientation: 2, Choice_color: 4, max_width: 200, fontsize: 13, });
                }
                var mouseoutFn = function (data) {
                    $tooltip.clear();
                }
                //点击方法
                var clickFn = function (data, json) {
                    var _info = data;
                    var showInfo = $com.util.Clone(_info);
                    //var _showData = {};
                    //for (var i = 0; i < dataPartPoint.length; i++) {
                    //    if (showInfo.ID == dataPartPoint[i].ID) {
                    //        _showData = $com.util.Clone(dataPartPoint[i]);
                    //    }
                    //}
                    //DataShow = _showData;
                    //20191209

                    model.com.refreshStationGrid(showInfo.ID);
                    //model.com.refreshGrid(showInfo.ID,mProductID);



                    $(".right-contain").css("width", "400px");
                    $(".left-containPro").css("margin-right", "400px");
                    $(".right-contain").show();
                    //20191209
                }
                var dragFn = function (data) {
                    var _data = data.data.data;

                    $.each(mZacePart, function (j, item_j) {
                        $.each(_data, function (i, item) {
                            if (item.ID != item_j.PartID)
                                return true;

                            item_j.OrderID = item.OrderID;
                            item_j.PrevPartID = item.PrevID;

                            item_j.NextPartIDMap = {};
                            if (item.NextIDList && item.NextIDList.length > 0) {

                                $.each(item.NextIDList, function (k, item_k) {
                                    item_j.NextPartIDMap[item_k + ""] = 0;
                                    console.log(j);
                                });
                            }

                        });
                    });

                }
                //1 置空
                // $("#ChartPartPoint").html("");
                //$(".zzzc").show();

                //2 创建结构
                var dataObj = {

                    data: [],
                    dataSet: {//对应关系
                        "Text": "KKK", //显示字段名称
                        "Index": "ID", //索引字段名称
                        "PrevIndex": "PrevID", //上级字段名称
                        "NextIndex": "NextIDList", //下级字段名称
                        "FatherID": "FatherID",  //父级ID
                        "BGC": "abc", //背景色字段名称
                        "FGC": "bcd", //前景色字段名称
                    },
                    background_color: 'transparent', //流程框背景颜色
                    foreground_color: 'red', //箭头颜色 
                    fn_mouseover: mouseoverFn, //鼠标悬停触发
                    fn_mouseout: mouseoutFn, //鼠标移走事件
                    fn_click: clickFn, //鼠标单击
                    fn_drag: dragFn, //鼠标拖动
                    constant: {
                        //lineOperation: true,
                        // dottedLine: true,
                        font: "bold 15px 宋体",//字体样式
                        fontSize: 15,//字体大小
                        rect_width: 200, //矩形的宽
                        rect_height: 50,
                    },
                }
                //3 填充data
                if (routePartArrZace.length != 0) {
                    $.each(routePartArrZace, function (i, item) {
                        var orderList = [];

                        //跳线集合
                        if (i <= routePartArrZace.length - 2) {
                            for (var m = 0; m < routePartArrZace[i + 1].list.length; m++) {
                                orderList.push(routePartArrZace[i + 1].list[m].ID);

                            }
                        }
                        for (var index = 0; index < item.list.length; index++) {
                            var C_list = [];
                            var obj = item.list[index];
                            for (p in obj.NextPartIDMap) {

                                C_list.push({
                                    key: p,
                                    value: obj.NextPartIDMap[p]
                                });


                            }
                            var _listZace = [];
                            for (var j = 0; j < C_list.length; j++) {
                                _listZace.push(C_list[j].key);

                            }

                            dataObj.data.push({
                                // title: item.PartPointName,
                                // ID: item.OrderIDPro,
                                // ZID:item.ID,
                                // PrevID: item.OrderIDPro - 1,
                                // NextID: 0,
                                // backgroundColor: model.com.getRandomColor(item.PartID),
                                // foregroundColor: "white",
                                // PartName: FORMATTRT_Level["PartID"](item.PartID),
                                // RouteName: FORMATTRT_Level["RouteID"](item.RouteID),
                                // VersionNo: item.VersionNo,

                                "KKK": obj.Name, //显示字段名称
                                "ID": obj.PartID, //索引字段名称
                                "PrevID": obj.PrevPartID,
                                //i == 0 ? 0 : routePartArr[i - 1].list[0].ID, //上级字段名称
                                "NextIDList": _listZace.length > 0 ? _listZace : [], //orderList, //跳线集合
                                "OrderID": item.level, //第几层
                                "Type": 1,
                                "abc": "orange", //背景色字段名称
                                "bcd": "black", //前景色字段名称

                            });
                        }

                    });


                    //4 显示流程图
                    $route.show($('#Drag'), dataObj);
                }
                else {
                    return false;
                }
            },
            getRandomColor: function (partID) {
                if (!RouteColor[partID]) {
                    RouteColor[partID] = 'rgb(' + (Math.floor(Math.random() * 255)) + ',' + (Math.floor(Math.random() * 255)) + ',' + (Math.floor(Math.random() * 255)) + ')';
                }

                return RouteColor[partID];
            },
            changeData: function (data) {
                var obj = {
                    工序名: ":" + data.title,
                    顺序: ":" + data.ID,
                    工序段名: ":" + data.PartName,
                    路线名: ":" + data.RouteName,
                    路线编码: ":" + data.VersionNo,
                }
                return obj;
            },

            //查询产品规格
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
            //查询产品工艺路线列表
            getFPCProductRoute: function (data, fn, context) {
                var d = {
                    $URI: "/FPCProductRoute/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //保存产品工艺路线列表
            postFPCProductRoute: function (data, fn, context) {
                var d = {
                    $URI: "/FPCProductRoute/Update",
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
                    $URI: "/FPCProductRoute/Audit",
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
                    $URI: "/FPCProductRoute/Active",
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
            arryOnea: function (data) {
                var temp = {};
                var arr = [];
                var len = data.length;
                for (var i = 0; i < len; i++) {
                    if (!temp[data[i]]) {
                        temp[data[i]] = "abc";
                        arr.push(data[i]);
                    }
                }
                return arr;
            },
        }
    }),

        model.init();


});