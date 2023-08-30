require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'],
    function ($lin, $com) {

        var HTML,
            orderAllList,
            orderAll,
            orderFirst,
            PartList_Basic,

           DEFAULT_VALUE_ArrangeModeTime,//空闲工时
           KETWROD_LIST_ArrangeModeTime,
           KETWROD_Template_ArrangeModeTime,
           Formattrt_ArrangeModeTime,
           TypeSource_ArrangeModeTime,

           DataOrderAll,
           ModeAllList,
           PlanPartTemp,
           DataPointALL,
           DataPartALL,
           PartAll,
           DATAZZ,
           DATABASIC,
           mID,
           PlanPointTemp,
           DataUser;


        DataUser = [];
        DataOrderAll = [];
        ModeAllList = [];
        DataPointALL = [];
        DataPartALL = [];
        PartAll = [];
        Time = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date());
        ShiftID = 0;
        WorkShopID = 0;
        LineID = 0;

        PlanTimeTemp = {
            WID: 0,
            WorkShopID: 0,
            LineID: 0,
            GroupName: '',
            ZoneHours: 0,
            ShiftRatio: 0,
            Subduction: 0,
            Ratio: 0,
            OrderNo: '',
            PartID: 0,
            FQTYShift: 0,
            AlarmSecond: 0,
            IPISecond: 0



        };

        HTML = {  
            //空闲工时
            PlanTimeList: [
           '<tr>',
           '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></th>',
            '<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px" data-title="WorkShopID" data-value="{{WorkShopID}}" >{{ WorkShopID}}</td>',
            '<td  style="min-width: 50px" data-title="LineID" data-value="{{LineID}}" >{{ LineID}}</td>',
             '<td style="min-width: 50px" data-title="GroupName" data-value="{{GroupName}}" >{{ GroupName}}</td>',
            '<td style="min-width: 50px" data-title="ZoneHours" data-value="{{ZoneHours}}" >{{ ZoneHours}}</td>',
             '<td style="min-width: 50px" data-title="ShiftRatio" data-value="{{ShiftRatio}}" >{{ShiftRatio}}</td>',
            '<td style="min-width: 50px" data-title="Subduction" data-value="{{Subduction}}" >{{ Subduction}}</td>',
            '<td style="width: 80px;" data-title="Ratio" data-value="{{Ratio}}" >',
             '<div style="height:25px;width:80px;overflow:hidden">',
            '<div class="upDiv" style="width:70px;height:25px;background:green;border-radius:10px"></div>',
            '<div class="downDiv" style="position:relative;top:-25px;width:{{RatioNum}}px;height:25px;background:orange;border-radius:10px;text-align:center;line-height:25px">{{Ratio}}</div>',
            '</div>', 

            '</td>',
            '<td style="min-width: 50px" data-title="OrderNo" data-value="{{OrderNo}}" >{{ OrderNo}}</td>',
            '<td style="min-width: 50px" data-title="PartID" data-value="{{PartID}}" >{{ PartID}}</td>',
            '<td style="min-width: 50px" data-title="FQTYShift" data-value="{{FQTYShift}}" >{{ FQTYShift}}</td>',
            '<td style="min-width: 50px" data-title="AlarmSecond" data-value="{{AlarmSecond}}" >{{ AlarmSecond}}</td>',
            '<td style="min-width: 50px" data-title="IPISecond" data-value="{{IPISecond}}" >{{ IPISecond}}</td>',


           '<tr>'
            ].join(""),

        }
        //空闲工时列表
        $(function () {
            KETWROD_LIST_ArrangeModeTime = [
                "WorkShopID|车间|ArrayOneControl",
                "LineID|产线|ArrayOneControl|WorkShopID",
                "PartID|工序段|ArrayOne",
                //"PartPointID|工序|ArrayOne",
                "Time|日期|Date",
            ];
            KETWROD_Template_ArrangeModeTime = {};

            Formattrt_ArrangeModeTime = {};

            TypeSource_ArrangeModeTime = {
                WorkShopID: [{
                    name: "全部",
                    value: 0
                },
                ],
                LineID: [{
                    name: "全部",
                    value: 0,
                    far: 0,
                }
                ],
                PartID: [{
                    name: "",
                    value: 0,
                    far: undefined,
                },

                ],

            };

            $.each(KETWROD_LIST_ArrangeModeTime, function (i, item) {
                var detail = item.split("|");
                KETWROD_Template_ArrangeModeTime[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_ArrangeModeTime[detail[0]] = $com.util.getFormatter(TypeSource_ArrangeModeTime, detail[0], detail[2]);
                }
            });
        });

        model = $com.Model.create({
            name: '生产订单',

            type: $com.Model.MAIN,

            configure: function () {
                this.run();
            },

            events: function () {
                // 订单列表
                $("body").delegate("#femi-canvas-show3", "click", function () {
                    $(".zace-left").show();
                    $(".zace-leftShow").hide();
                    $(".zace-planPart").hide();
                    $(".zace-planPartPoint").hide();
                    $(".zace-orderMakeMode").hide();
                    $(".zace-orderMake").hide();
                    $(".zace-orderMakeTask").hide();
                    $(".zace-orderDevice").hide();
                    $(".zace-orderMakePlan").hide();
                    $(".zace-orderMakePlanPartPoint").hide();
                });
                //工序段列表
                $("body").delegate("#femi-canvas-show2", "click", function () {
                    $(".zace-left").hide();
                    $(".zace-leftShow").hide();
                    $(".zace-planPart").show();
                    $(".zace-planPartPoint").hide();
                    $(".zace-orderDevice").hide();
                    $(".zace-orderMakeMode").hide();
                    $(".zace-orderMake").hide();
                    $(".zace-orderMakeTask").hide();
                    $(".zace-orderMakePlan").hide();
                    $(".zace-orderMakePlanPartPoint").hide();
                });
                //工序列表
                $("body").delegate("#femi-canvas-show1", "click", function () {
                    $(".zace-left").hide();
                    $(".zace-leftShow").hide();
                    $(".zace-planPart").hide();
                    $(".zace-orderMakeMode").hide();
                    $(".zace-planPartPoint").show();
                    $(".zace-orderMake").hide();
                    $(".zace-orderDevice").hide();
                    $(".zace-orderMakeTask").hide();
                    $(".zace-orderMakePlan").hide();
                    $(".zace-orderMakePlanPartPoint").hide();
                });

                //所选订单集合列表
                $("body").delegate("#femi-canvas-show8", "click", function () {
                    $(".zace-left").hide();
                    $(".zace-leftShow").hide();
                    $(".zace-planPart").hide();
                    $(".zace-planPartPoint").hide();
                    $(".zace-orderMakeMode").hide();
                    $(".zace-orderMakeTask").hide();
                    $(".zace-orderDevice").hide();
                    $(".zace-orderMake").show();
                    $(".zace-orderMakePlan").hide();
                    $(".zace-orderMakePlanPartPoint").hide();
                });

                //模板列表
                $("body").delegate("#femi-canvas-show4", "click", function () {
                    $(".zace-left").hide();
                    $(".zace-leftShow").hide();
                    $(".zace-planPart").hide();
                    $(".zace-planPartPoint").hide();
                    $(".zace-orderMake").hide();
                    $(".zace-orderMakeMode").show();
                    $(".zace-orderMakeTask").hide();
                    $(".zace-orderDevice").hide();
                    $(".zace-orderMakeTime").hide();
                    $(".zace-orderMakePlan").hide();
                    $(".zace-orderMakePlanPartPoint").hide();
                });

                //任务完成情况femi-canvas-show6
                $("body").delegate("#femi-canvas-show6", "click", function () {
                    $(".zace-left").hide();
                    $(".zace-leftShow").hide();
                    $(".zace-planPart").hide();
                    $(".zace-planPartPoint").hide();
                    $(".zace-orderMake").hide();
                    $(".zace-orderMakeMode").hide();
                    $(".zace-orderMakeTask").show();
                    $(".zace-orderDevice").hide();
                    $(".zace-orderMakeTime").hide();
                    $(".zace-orderMakePlan").hide();
                    $(".zace-orderMakePlanPartPoint").hide();
                });
                //空闲工时  
                $("body").delegate("#femi-canvas-show7", "click", function () {

                    //windows.parent.iframeHeaderSet();

                    $(".zace-left").hide();
                    $(".zace-leftShow").hide();
                    $(".zace-planPart").hide();
                    $(".zace-planPartPoint").hide();
                    $(".zace-orderMake").hide();
                    $(".zace-orderMakeMode").hide();
                    $(".zace-orderMakeTask").hide();
                    $(".zace-orderMakeTime").show();
                    $(".zace-orderDevice").hide();
                    $(".zace-orderMakePlan").hide();
                    $(".zace-orderMakePlanPartPoint").hide();
                });


                //生成工序段计划
                $("body").delegate("#femi-canvas-showPart", "click", function () {

                    $(".zace-left").hide();
                    $(".zace-leftShow").hide();
                    $(".zace-planPart").hide();
                    $(".zace-planPartPoint").hide();
                    $(".zace-orderMake").hide();
                    $(".zace-orderMakeMode").hide();
                    $(".zace-orderMakeTask").hide();
                    $(".zace-orderMakeTime").hide();
                    $(".zace-orderMakePlanPartPoint").hide();
                    $(".zace-orderMakePlan").show();
                });
                //工序计划  
                $("body").delegate("#femi-canvas-showPartPoint", "click", function () {

                    $(".zace-left").hide();
                    $(".zace-leftShow").hide();
                    $(".zace-planPart").hide();
                    $(".zace-planPartPoint").hide();
                    $(".zace-orderMake").hide();
                    $(".zace-orderMakeMode").hide();
                    $(".zace-orderMakeTask").hide();
                    $(".zace-orderMakePlan").hide();
                    $(".zace-orderMakeTime").hide();
                    $(".zace-orderMakePlanPartPoint").show();
                });

                //任务完成情况查询
                $("body").delegate("#zace-search-orderTaskSearch", "click", function () {
                    var default_value = {
                        Time: $com.util.format('yyyy-MM-dd ', new Date()),
                    };
                    $("body").append($com.modal.show(default_value, KETWROD_Template_ArrangeModeTask, "查询", function (rst) {
                        if (!rst || $.isEmptyObject(rst))
                            return;

                        default_value.Time = $com.util.format('yyyy-MM-dd hh:mm:ss', rst.Time);
                        Time = default_value.Time;
                        model.com.refresh();

                    }));
                });

                //模板设置查询   zace-search-orderSearch
                $("body").delegate("#zace-search-orderSearch", "click", function () {
                    var default_value = {
                        WorkShopID: 0,
                        LineID: 0,
                        Time: $com.util.format('yyyy-MM-dd ', new Date()),
                    };
                    $("body").append($com.modal.show(default_value, KETWROD_Template_ArrangeMode, "查询", function (rst) {


                        if (!rst || $.isEmptyObject(rst))
                            return;
                        default_value.WorkShopID = rst.WorkShopID;
                        default_value.LineID = rst.LineID;
                        default_value.Time = $com.util.format('yyyy-MM-dd hh:mm:ss', rst.Time);

                        LineID = parseInt(default_value.LineID);
                        WorkShopID = parseInt(default_value.WorkShopID);
                        Time = default_value.Time;
                        model.com.refresh();

                    }, TypeSource_ArrangeMode));
                    //$(".zace-left").hide();
                    //$(".zace-leftShow").hide();
                    //$(".zace-planPart").hide();
                    //$(".zace-planPartPoint").hide();
                    //$(".zace-orderMake").hide();
                    //$(".zace-orderMakeMode").show();
                });
                //返回到订单查询
                $("body").delegate("#zace-exit-order", "click", function () {
                    $(".zace-left").show();
                    $(".zace-leftShow").hide();
                    $(".zace-planPart").hide();
                    $(".zace-planPartPoint").hide();
                    $(".zace-orderMake").hide();
                    $(".zace-orderMakeTask").hide();
                });

                //返回到订单集合
                $("body").delegate("#zace-exit-orderPlan", "click", function () {
                    $(".zace-left").hide();
                    $(".zace-leftShow").hide();
                    $(".zace-planPart").hide();
                    $(".zace-planPartPoint").hide();
                    $(".zace-orderMakeMode").hide();
                    $(".zace-orderMakeTask").hide();
                    $(".zace-orderMake").show();
                    $(".zace-orderMakePlan").hide();
                    $(".zace-orderMakePlanPartPoint").hide();
                });
                //订单导出
                $("body").delegate("#zace-down-schedule", "click", function () {
                    var $table = $(".zace-table-export"),
                      fileName = "订单列表.xls",
                      Title = "订单列表";
                    var params = $com.table.getExportParams($table, fileName, Title);

                    model.com.getExportExcel(params, function (res) {
                        var src = res.info.path;
                        window.open(src);
                    });


                });
                //工序段导出
                $("body").delegate("#zace-export-part", "click", function () {
                    var $table = $(".zace-export-Part"),
                      fileName = "工序段列表.xls",
                      Title = "工序段列表";
                    var params = $com.table.getExportParams($table, fileName, Title);

                    model.com.getExportExcel(params, function (res) {
                        var src = res.info.path;
                        window.open(src);
                    });


                });
                //工序导出
                $("body").delegate("#zace-export-partPoint", "click", function () {
                    var $table = $(".zace-export-partPoint"),
                      fileName = "工序列表.xls",
                      Title = "工序列表";
                    var params = $com.table.getExportParams($table, fileName, Title);

                    model.com.getExportExcel(params, function (res) {
                        var src = res.info.path;
                        window.open(src);
                    });


                });

                //工序段查询   
                $("body").delegate("#zace-search-part", "click", function () {
                    var default_value = {
                        Time: $com.util.format('yyyy-MM-dd ', new Date()),
                    };
                    $("body").append($com.modal.show(default_value, KETWROD_Template_ArrangePart, "查询", function (rst) {
                        if (!rst || $.isEmptyObject(rst))
                            return;

                        default_value.Time = $com.util.format('yyyy-MM-dd hh:mm:ss', rst.Time);
                        Time = default_value.Time;
                        model.com.refresh();

                    }));



                });

                //工序查询   
                $("body").delegate("#zace-search-partPoint", "click", function () {
                    var default_value = {
                        Time: $com.util.format('yyyy-MM-dd ', new Date()),
                    };
                    $("body").append($com.modal.show(default_value, KETWROD_Template_ArrangePoint, "查询", function (rst) {
                        if (!rst || $.isEmptyObject(rst))
                            return;

                        default_value.Time = $com.util.format('yyyy-MM-dd hh:mm:ss', rst.Time);
                        Time = default_value.Time;
                        model.com.refresh();

                    }));



                });

                //-----------订单详情-------------
                //双击
                $("body").delegate("#femi-order-tbody tr", "dblclick", function () {

                    var $this = $(this);
                    var wWorkShopID = $this.find('td[data-title=WorkShopID]').attr('data-value');
                    var wLineID = $this.find('td[data-title=LineID]').attr('data-value');
                    var wOrderNo = $this.find('td[data-title=OrderNo]').attr('data-value');
                    var wProductNo = $this.find('td[data-title=ProductNo]').attr('data-value');

                    var data = $com.util.Clone(orderAll);

                    var _list = model.com.orderList(data, wWorkShopID, wLineID, wOrderNo, wProductNo);

                    $.each(_list, function (i, item) {
                        for (var p in item) {
                            if (!Formattrt_ArrangeDetail[p])
                                continue;
                            item[p] = Formattrt_ArrangeDetail[p](item[p]);
                        }
                    });

                    for (var i = 0; i < _list.length; i++) {
                        _list[i].WID = i + 1;

                    }
                    $("#femi-orderAll-tbody").html($com.util.template(_list, HTML.OrderDetailList));

                    $(".zace-leftShow").show();
                    $(".zace-left").hide();
                    $(".zace-planPart").hide();
                    $(".zace-planPartPoint").hide();
                    $(".zace-orderMakeMode").hide();
                    $(".zace-orderMakeTask").hide();
                    $(".zace-orderMakeTime").hide();
                    $(".zace-orderDevice").hide();
                    $(".zace-orderMakePlan").hide();
                    $(".zace-orderMakePlanPartPoint").hide();

                });
                //返回
                $("body").delegate("#zace-search-exitPlan", "click", function () {

                    $(".zace-leftShow").hide();
                    $(".zace-left").show();
                    $(".zace-planPart").hide();
                    $(".zace-orderMake").hide();
                    $(".zace-planPartPoint").hide();
                    $(".zace-orderMakeMode").hide();
                    $(".zace-orderMakeTask").hide();
                    $(".zace-orderMakeTime").hide();
                    $(".zace-orderDevice").hide();
                    $(".zace-orderMakePlan").hide();
                    $(".zace-orderMakePlanPartPoint").hide();

                });

                //---------计划制定----------zace-plan-maker
                $("body").delegate("#zace-plan-maker", "click", function () {
                    var SelectData = $com.table.getSelectionData($("#femi-order-tbody"), "WID", orderAllList);
                    if (!SelectData || !SelectData.length) {
                        alert("请先选择至少一行数据再试！")
                        return;
                    }
                    $(".zace-left").hide();
                    $(".zace-leftShow").hide();
                    $(".zace-planPart").hide();
                    $(".zace-planPartPoint").hide();
                    $(".zace-orderMakeMode").hide();
                    $(".zace-orderMakeTask").hide();
                    $(".zace-orderMakePlan").hide();
                    $(".zace-orderMakeTime").hide();
                    $(".zace-orderMakePlanPartPoint").hide();
                    $(".zace-orderDevice").hide();
                    $(".zace-orderMake").show();
                    DataOrderAll = SelectData;
                    $("#femi-orderMake-tbody").html($com.util.template(SelectData, HTML.ArrangeList));

                });

                //生成计划 
                $("body").delegate("#femi-canvas-showPartPlan", "click", function () {
                    var SelectData = $com.table.getSelectionData($("#femi-orderMake-tbody"), "WID", DataOrderAll);
                    if (!SelectData || !SelectData.length) {
                        alert("请先选择至少一行数据再试！")
                        return;
                    }
                    var data = $com.util.Clone(orderAll);
                    var modeAllList = [];
                    for (var i = 0; i < SelectData.length; i++) {

                        var _list = model.com.orderList(data, SelectData[i].WorkShopID, SelectData[i].LineID, SelectData[i].OrderNo, SelectData[i].ProductNo);
                        for (var j = 0; j < _list.length; j++) {
                            modeAllList.push(_list[j]);
                        }
                    }
                    var wList = model.com.createPartTemp(modeAllList);

                    DataPartALL = $com.util.Clone(wList);
                    for (var i = 0; i < DataPartALL.length; i++) {
                        DataPartALL[i].WID = i + 1;

                    }
                    $("#femi-orderMakePlan-tbody").html($com.util.template(DataPartALL, HTML.PlanPartModeList));

                    //下达计划
                    $("body").delegate("#zace-plan-orderX", "click", function () {
                        //postPartAll

                        model.com.postPartAll({
                            data: wList,
                            shift_id: ShiftID,
                        }, function (res) {
                            alert("保存成功");
                            // model.com.refresh();
                        })



                    });



                    //工序  
                    var wModelList = model.com.newPointList(model.com.createPartPointTemp(wList));
                    for (var i = 0; i < wModelList.length; i++) {
                        wModelList[i].WID = i + 1;
                        wModelList[i].PLMode = 0;

                    }
                    DataPointALL = $com.util.Clone(wModelList);

                    DataPointALL = model.com.addPLMode(DataPointALL, ModeAllList);

                    for (var i = 0; i < DataPointALL.length; i++) {
                        DataPointALL[i].WID = i + 1;

                    }

                    $("#femi-orderMakePlanPartPoint-tbody").html($com.util.template(DataPointALL, HTML.PlanPartPointModeList));



                    $(".zace-left").hide();
                    $(".zace-leftShow").hide();
                    $(".zace-planPart").hide();
                    $(".zace-planPartPoint").hide();
                    $(".zace-orderMake").hide();
                    $(".zace-orderMakeMode").hide();
                    $(".zace-orderMakeTask").hide();
                    $(".zace-orderMakeTime").hide();
                    $(".zace-orderMakePlanPartPoint").hide();
                    $(".zace-orderDevice").hide();
                    $(".zace-orderMakePlan").show();
                });

                //双击设备
                $("body").delegate("#femi-orderMakePlanPartPoint-tbody td[data-title=DeviceNo]", "dblclick", function () {

                    $(".zace-left").hide();
                    $(".zace-leftShow").hide();
                    $(".zace-planPart").hide();
                    $(".zace-planPartPoint").hide();
                    $(".zace-orderMake").hide();
                    $(".zace-orderMakeMode").hide();
                    $(".zace-orderMakeTask").hide();
                    $(".zace-orderMakeTime").hide();
                    $(".zace-orderMakePlanPartPoint").hide();
                    $(".zace-orderDevice").show();
                    $(".zace-orderMakePlan").hide();

                    var $this = $(this);
                    var name = $this.attr('data-value');
                    mID = $this.parent().find("td[data-title=WID]").attr("data-value");
                });
                //设备列表双击修改  工序设备
                $("body").delegate("#femi-orderDevice-tbody tr", "dblclick", function () {
                    var $this = $(this);

                    var WName = $this.find('td[data-title=PartName]').attr('data-value');

                    DataPointALL[mID - 1].DeviceNo = WName;

                    $(".zace-left").hide();
                    $(".zace-leftShow").hide();
                    $(".zace-planPart").hide();
                    $(".zace-planPartPoint").hide();
                    $(".zace-orderMake").hide();
                    $(".zace-orderMakeMode").hide();
                    $(".zace-orderMakeTask").hide();
                    $(".zace-orderMakeTime").hide();
                    $(".zace-orderMakePlanPartPoint").show();
                    $(".zace-orderDevice").hide();
                    $(".zace-orderMakePlan").hide();

                    $("#femi-orderMakePlanPartPoint-tbody").html($com.util.template(DataPointALL, HTML.PlanPartPointModeList));


                });

                //设备返回
                $("body").delegate("#zace-exit-orderDevice", "click", function () {
                    $(".zace-left").hide();
                    $(".zace-leftShow").hide();
                    $(".zace-planPart").hide();
                    $(".zace-planPartPoint").hide();
                    $(".zace-orderMake").hide();
                    $(".zace-orderMakeMode").hide();
                    $(".zace-orderMakeTask").hide();
                    $(".zace-orderDevice").hide();
                    $(".zace-orderMakeTime").hide();
                    $(".zace-orderMakePlan").hide();
                    $(".zace-orderMakePlanPartPoint").show();
                });


                //设备查询
                $("body").delegate("#zace-exit-searchDevice", "click", function () {
                    var default_value = {
                        WorkShopID: 0,
                        LineID: 0,
                    };
                    $("body").append($com.modal.show(default_value, KETWROD_Template_ArrangeDevice, "查询", function (rst) {
                        if (!rst || $.isEmptyObject(rst))
                            return;

                        default_value.WorkShopID = Number(rst.WorkShopID);
                        default_value.LineID = Number(rst.LineID);
                        $com.table.filterByConndition($("#femi-orderDevice-tbody"), DataDeviceAll, default_value, "WID");


                    }, TypeSource_ArrangeDevice));



                });



                //==================
                //修改工序列表
                $("body").delegate("#zace-edit-orderPoint", "click", function () {

                    var SelectData = $com.table.getSelectionData($("#femi-orderMakePlanPartPoint-tbody"), "WID", DataPointALL);
                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return;
                    }
                    if (SelectData.length != 1) {
                        alert("只能同时对一行数据修改！")
                        return;
                    }

                    var default_value = {
                        FQTYShift: SelectData[0].FQTYShift,
                        BGMode: SelectData[0].BGMode,
                        PLMode: SelectData[0].PLMode,
                    };
                    if (model.com.compareDate(new Date(Time), new Date())) {
                        $("body").append($com.modal.show(default_value, KETWROD_Template_ArrangeSPoint, "修改", function (rst) {
                            //调用修改函数
                            if (!rst || $.isEmptyObject(rst))
                                return;

                            SelectData[0].FQTYShift = Number(rst.FQTYShift);
                            SelectData[0].BGMode = Number(rst.BGMode);
                            SelectData[0].PLMode = Number(rst.PLMode);


                            $("#femi-orderMakePlanPartPoint-tbody").html($com.util.template(DataPointALL, HTML.PlanPartPointModeList));

                        }, TypeSource_ArrangeSPoint));
                    } else {
                        alert("操作失败");

                    }
                });


                //修改工序段列表
                $("body").delegate("#zace-edit-orderPart", "click", function () {

                    // var SelectData = $com.table.getSelectionData($("#femi-orderMakePlan-tbody"), "WID", DataPartALL);
                    var SelectData = $com.table.getSelectionData($("#femi-orderMakePlan-tbody"), "PartID", DataPartALL);
                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return;
                    }
                    if (SelectData.length != 1) {
                        alert("只能同时对一行数据修改！")
                        return;
                    }

                    var default_value = {
                        FQTYShift: SelectData[0].FQTYShift,
                        Priority: SelectData[0].Priority,
                        FQTYParts: SelectData[0].FQTYParts,
                    };
                    if (model.com.compareDate( new Date(Time), new Date())) {
                        $("body").append($com.modal.show(default_value, KETWROD_Template_ArrangeSPart, "修改", function (rst) {
                            //调用修改函数
                            if (!rst || $.isEmptyObject(rst))
                                return;

                            SelectData[0].FQTYShift = Number(rst.FQTYShift);
                            SelectData[0].Priority = Number(rst.Priority);
                            SelectData[0].FQTYParts = Number(rst.FQTYParts);


                            $("#femi-orderMakePlan-tbody").html($com.util.template(DataPartALL, HTML.PlanPartModeList));

                        }, TypeSource_ArrangeSPart));
                    } else {
                        alert("操作失败");
                    }
                    
                });

                //删除工序段任务
                $("body").delegate("#zace-plan-orderD", "click", function () {
                    var SelectData = $com.table.getSelectionData($("#femi-orderMakePlan-tbody"), "PartID", DATAZZ);
                    if (!SelectData || !SelectData.length) {
                        alert("请先选择至少一行数据再试！")
                        return;
                    }
                    var _list = [];
                    for (var i = 0; i < SelectData.length; i++) {
                        _list.push(DATABASIC[SelectData[i].WID - 1]);
                    }
                    if (model.com.compareDate(new Date(Time),new Date())) {
                        model.com.deletePartAll({
                            data: _list,
                            shift_id: ShiftID,

                        }, function (resz) {
                            alert("删除成功");
                            model.com.refresh();
                        });
                    } else {
                        alert("操作失败");
                    }
                  

                });

                //查询  
                $("body").delegate("#zace-search-orderPoint", "click", function () {
                    var default_value = {
                        Time: $com.util.format('yyyy-MM-dd ', new Date()),
                    };
                    $("body").append($com.modal.show(default_value, KETWROD_Template_ArrangePoint, "查询", function (rst) {
                        if (!rst || $.isEmptyObject(rst))
                            return;

                        default_value.Time = $com.util.format('yyyy-MM-dd hh:mm:ss', rst.Time);
                        Time = default_value.Time;
                        model.com.refresh();

                    }));



                });

                //详情
                $("body").delegate("#zace-search-orderTimeDetail", "click", function () {
                    alert(1);

                    $(".zace-left").hide();
                    $(".zace-leftShow").hide();
                    $(".zace-planPart").hide();
                    $(".zace-planPartPoint").hide();
                    $(".zace-orderMake").hide();
                    $(".zace-orderMakeMode").hide();
                    $(".zace-orderMakeTask").hide();
                    $(".zace-orderDevice").hide();
                    $(".zace-orderMakeTime").hide();
                    $(".zace-orderMakePlan").hide();
                    $(".zace-orderMakePlanPartPoint").show();
                });
            },
            run: function () {
    

                WorkShopID = window.parent.UserParams["FreeTime"].WorkShopID;
                LineID = window.parent.UserParams["FreeTime"].LineID;
                Time = window.parent.UserParams["FreeTime"].Time;
                //车间产线
                model.com.getWorkShop({}, function (data) {

                    $.each(data.list, function (i, item) {
                        TypeSource_ArrangeModeTime.WorkShopID.push({
                            name: item.WorkShopName,
                            value: item.ID,
                            far: null
                        });
                        $.each(item.LineList, function (l_i, l_item) {
                            TypeSource_ArrangeModeTime.LineID.push({
                                name: l_item.ItemName,
                                value: l_item.ID,
                                far: item.ID
                            });
                        });
                    });

                    model.com.getConfigAll({}, function (res) {
                        if (!res)
                            return;
                        if (res && res.list) {
                            PartAll = res.list[0].PartList;
                            $.each(res.list, function (p_i, p_item) {
                                TypeSource_ArrangeModeTime.PartID = TypeSource_ArrangeModeTime.PartID.concat($com.table.getTypeSource(p_item.PartList, "PartID", "PartName"));

                                $.each(p_item.PartList, function (pp_i, pp_item) {
                                  
                                });
                            });
                             model.com.refresh();

                        }

                    });
                });

             

            },
            com: {
                refresh: function () {
                    WorkShopID = window.parent.UserParams["FreeTime"].WorkShopID;
                    LineID = window.parent.UserParams["FreeTime"].LineID;
                    Time = window.parent.UserParams["FreeTime"].Time;
                    ShiftID = parseInt(model.com.getshiftID(Time));
                    //alert(model.com.compareDate(new Date(Time), new Date()));                  
                    //模板设置
                    model.com.getVirtualAll({ WorkShopID: WorkShopID, LineID: LineID, shift_id: ShiftID }, function (rew) {

                        var ww = rew.list;                 
                        //空闲工时
                        var _listTime = [];
                        for (var i = 0; i < ww.length; i++) {
                            var _temp = $com.util.Clone(PlanTimeTemp);
                            _temp.WID = i + 1;
                           // _temp.OrderNo = ww[i].OrderNo;
                            _temp.WorkShopID = ww[i].WorkShopID;
                            _temp.LineID = ww[i].LineID;
                            _temp.GroupName = ww[i].GroupName;
                            _temp.ZoneHours = ww[i].ZoneHours;
                            _temp.ShiftRatio = ww[i].ShiftRatio;
                            _temp.Subduction = _temp.ZoneHours - _temp.ShiftRatio;
                            _temp.Ratio = _temp.Subduction / _temp.ZoneHours;
                            _listTime.push(_temp);
                            _listTime[i].ZoneHours = model.com.Translate(_listTime[i].ZoneHours);
                            _listTime[i].ShiftRatio = model.com.Translate(_listTime[i].ShiftRatio);
                            _listTime[i].Subduction = model.com.Translate(_listTime[i].Subduction);
                            _listTime[i].RatioNum = _listTime[i].Ratio * 70;
                            _listTime[i].Ratio = model.com.toPercent(_listTime[i].Ratio);
                         
                        }
                     
                        $.each(_listTime, function (i, item) {
                            for (var p in item) {
                                if (!Formattrt_ArrangeModeTime[p])
                                    continue;
                                item[p] = Formattrt_ArrangeModeTime[p](item[p]);
                            }
                        });


                        $("#femi-orderMakeTime-tbody").html($com.util.template(_listTime, HTML.PlanTimeList));


                    });

                },

                //秒转换成小时 分钟 秒
                Translate: function (num) {

                    var Stext;
                    var hour = 0;
                    var yhour = 0;
                    var min = 0;
                    var ymin = 0;
                    var sec = 0;

                    if (num / 3600 > 0) {
                        hour = parseInt(num / 3600);
                        yhour = num % 3600;

                    }
                    if (yhour / 60 > 0) {
                        min = parseInt(yhour / 60);
                        ymin = yhour % 60;


                    }
                    if (ymin > 0) {
                        sec = ymin;
                    }
                    function getFormatz(arg) {
                        var re = arg + '';
                        if (re.length < 2) {
                            re = '0' + re;
                        }

                        return re;
                    }
                    return getFormatz(hour) + '小时' + getFormatz(min) + '分钟' + getFormatz(sec) + '秒';

                },

                //百分比
                toPercent: function (point) {
                    if (point == 0) {
                        return 0;
                    }
                    var str = Number(point * 100).toFixed();
                    str += "%";
                    return str;
                },
                //模块
                getVirtualAll: function (data, fn, context) {
                    var d = {
                        $URI: "/APSPartEntry/VirtualAll",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                //导出
                getExportExcel: function (data, fn, context) {
                    var d = {
                        $URI: "/Upload/ExportExcel",
                        $TYPE: "post"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },             
                //根据班次获取工序段任务列表
                getTaskPart: function (data, fn, context) {
                    var d = {
                        $URI: "/APSTask/PartAll",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //根据班次获取工序任务列表
                getTaskPointAll: function (data, fn, context) {
                    var d = {
                        $URI: "/APSTask/PartPointAll",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //工序
                getConfigAll: function (data, fn, context) {
                    var d = {
                        $URI: "/APSLine/ConfigAll",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //车间产线
                getWorkShop: function (data, fn, context) {
                    var d = {
                        $URI: "/WorkShop/All",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },    
                //shiftID
                getshiftID: function (date) {

                    var date = new Date(date);
                    var month = date.getMonth() + 1;
                    var day = date.getDate();
                    return date.getFullYear() + getFormatDate(month) + getFormatDate(day) + '01';


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
             
                utils: {
                    getSon: function (list) {
                        var _rst = [];
                        $.each(list, function (i, item) {
                            _rst.push(item);
                            if (item.SonList) {
                                var _arr = model.com.utils.getSon(item.SonList);
                                _rst = _rst.concat(_arr);


                            }

                        });
                        return _rst;
                    },
                    getSource: function (list) {
                        var _rst = [];
                        $.each(list, function (i, item) {
                            if (item.Active)
                                _rst.push({
                                    value: item.ID,
                                    name: item.Name,
                                    far: item.DepartmentID
                                });
                        });
                        return _rst;
                    }
                },              
            },


        });
        model.init();
    });