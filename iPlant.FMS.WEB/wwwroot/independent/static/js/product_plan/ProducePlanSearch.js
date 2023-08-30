require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/ganttSreach'], function ($zace, $com, $gantt) {

    var KEYWORD_Customer_LIST,
        KEYWORD_Customer,
        FORMATTRT_Customer,
        CustomerTemp,
        TypeSource_Customer,

        KEYWORD_LinkManCustomer_LIST,
        KEYWORD_LinkManCustomer,
        FORMATTRT_LinkManCustomer,
        CustomerTemp_LinkManCustomer,
        TypeSource_LinkManCustomer,
        MShiftID,
        MDayShiftID,
        model,
        WeekDatalistChange,
        DataAll,
        DATABasic,
        DataAll_Link,
        DATABasic_Link,
        WeekDatalist,
        DayDataList,
        MlineID,
        MStartTime,
        //日计划
        ChartData,
        HTML;
    MlineID = 1;
    WeekDatalist = DayDataList = WeekDatalistChange = [];
    MStartTime = $com.util.format('yyyy-MM-dd ', new Date());

    HTML = {
        TablePlanMode: [
            '<tr data-color="">',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            //'<td data-title="ShiftID" data-value="{{ShiftID}}" >{{ShiftID}}</td>',
            '<td data-title="ShiftName" data-value="{{ShiftName}}" >{{ShiftName}}</td>',
            '<td data-title="StartZ" data-value="{{StartZ}}" >{{StartZ}}</td>',
            '<td data-title="EndZ" data-value="{{EndZ}}" >{{EndZ}}</td>',
            '<td data-title="LineName" data-value="{{LineName}}" >{{LineName}}</td>',
            '<td data-title="MaterialNo" data-value="{{MaterialNo}}" >{{MaterialNo}}</td>',
            '<td data-title="MaterialName" data-value="{{MaterialName}}" >{{MaterialName}}</td>',
            '<td data-title="OrderNo" data-value="{{OrderNo}}" >{{OrderNo}}</td>',
            '<td data-title="FQTY" data-value="{{FQTY}}" >{{FQTY}}</td>',
            '<td data-title="FQTYShift" data-value="{{FQTYShift}}" >{{FQTYShift}}</td>',
            '<td data-title="ProductNo" data-value="{{ProductNo}}" >{{ProductNo}}</td>',
           
            '<td data-title="SubmitTime" data-value="{{SubmitTime}}" >{{SubmitTime}}</td>',
            '<td data-title="AuditorID" data-value="{{AuditorID}}" >{{AuditorID}}</td>',
            '<td data-title="AuditTime" data-value="{{AuditTime}}" >{{AuditTime}}</td>',
             '<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',
            '</tr>',
        ].join(""),

        TableDayPlanMode: [
            '<tr data-color="">',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            // '<td data-title="ShiftID" data-value="{{ShiftID}}" >{{ShiftID}}</td>',
            '<td data-title="ShiftName" data-value="{{ShiftName}}" >{{ShiftName}}</td>',
            '<td data-title="LineName" data-value="{{LineName}}" >{{LineName}}</td>',
            '<td data-title="PartName" data-value="{{PartName}}" >{{PartName}}</td>',
            '<td data-title="OrderNo" data-value="{{OrderNo}}" >{{OrderNo}}</td>',
            '<td data-title="ProductNo" data-value="{{ProductNo}}" >{{ProductNo}}</td>',
            '<td data-title="FQTYShift" data-value="{{FQTYShift}}" >{{FQTYShift}}</td>',
            '<td data-title="SubmitTime" data-value="{{SubmitTime}}" >{{SubmitTime}}</td>',

            '</tr>',
        ].join(""),
        TableUserItemNode: [
          '<tr data-color="">',
          '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
          //'<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
          '<td data-title="LineName" data-value="{{LineName}}" >{{LineName}}</td>',
          '<td data-title="PartName" data-value="{{PartName}}" >{{PartName}}</td>',
          '<td data-title="OrderNo" data-value="{{OrderNo}}" >{{OrderNo}}</td>',
          '<td data-title="ProductNo"  data-value="{{ProductNo}}" >{{ProductNo}}</td>',
          '<td data-title="FQTYSum"  data-value="{{FQTYSum}}" >{{FQTYSum}}</td>',
          '{{tds}}',
          '</tr>',
        ].join(""),

        thead: [
            '<tr>',
            '<th><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            //'<th data-order="ID"  style="min-width: 50px">序号</td>',
            '<th data-order="LineName" style="min-width: 50px" >产线</td>',
            '<th data-order="PartName" style="min-width: 50px" >工序</td>',
            '<th data-order="OrderNo" style="min-width: 50px" >订单</td>',
            '<th data-order="ProductNo" style="min-width: 50px" >规格</td>',
            '<th data-order="FQTYSum" style="min-width: 50px" >总数</td>',
            '{{ths}}',
            '</tr>',
        ].join(""),
        th: ['<th data-order="{{WorkDate}}" style="min-width: 50px" >{{ColumnText}}</th>'].join(""),
        td: ['<td  class="edit-td" data-title="{{ShiftDate}}"   data-value="{{FQTYShift}}" >{{FQTYShift}}</td>', ].join(""),

    }
    $(function () {
        KEYWORD_Customer_LIST = [

            "LineID|产线|ArrayOne",
            "StartDate|日期|Date",
            "SDate|日期|Date",
            "Shift|产线|ArrayOne",
        ];
        KEYWORD_Customer = {};
        FORMATTRT_Customer = {};

        TypeSource_Customer = {
            Shift: [
                {
                    name: "白班",
                    value: 1
                },
                {
                    name: "晚班",
                    value: 2
                }
            ],
            LineID: [],

        };

        $.each(KEYWORD_Customer_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD_Customer[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_Customer[detail[0]] = $com.util.getFormatter(TypeSource_Customer, detail[0], detail[2]);
            }
        });
    });

    $(function () {
        KEYWORD_LinkManCustomer_LIST = [
            "Status|状态|ArrayOne",
            "AuditorID|审批人|ArrayOne",
        ];
        KEYWORD_LinkManCustomer = {};
        FORMATTRT_LinkManCustomer = {};

        TypeSource_LinkManCustomer = {

            Status: [
                {
                    name: "创建",
                    value: 1
                }, {
                    name: "下达",
                    value: 2
                }, {
                    name: "审核",
                    value: 3
                }, {
                    name: "反审核",
                    value: 4
                }
            ],
            AuditorID: [],

        };

        $.each(KEYWORD_LinkManCustomer_LIST, function (x, item1) {
            var detail = item1.split("|");
            KEYWORD_LinkManCustomer[detail[0]] = {
                index: x,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_LinkManCustomer[detail[0]] = $com.util.getFormatter(TypeSource_LinkManCustomer, detail[0], detail[2]);
            }
        });
    });
    model = $com.Model.create({
        name: '联系人信息',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            //导出计划
            $("body").delegate("#zace-logout-tableOrderDay", "click", function () {
                var $table = $(".table-day-export"),
                    fileName = "工序计划" + MShiftID + ".xls",
                    Title = "工序计划";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });

            });
            //甘特图

            //日计划数据
            $("body").delegate("#zace-part-ganteMode", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-orderScheResult-tbody"), "ID", WeekDatalist);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                model.com.getAPSTaskGant({
                    data: SelectData
                }, function (res) {

                    var plan = res.info;
                    model.com.refreshTablePro(plan);
                    ChartData = $com.util.Clone(res.info);
                    $(".zzza").hide();
                    $(".zzzb").hide();
                    $(".zzzc").show();
                    var data = [],
                        //任务名称 
                        position = {
                            //天数间隔
                            spacePx: 30.0,
                            spacePy: 30.0,
                            //左边菜单栏像素
                            freedomPx: 500,
                            contextHight: 1500,
                            radius: 5,
                            //是否阶梯呈现
                            ladder: false,
                            tip: {
                                //提示条宽度，高度，行高
                                Text: { tipW: 160, tipH: 170, lineH: 25, titleH: 30 },
                                title: { text: '订单', prop: 'task', visible: true },
                                line: [
                                    { text: '物料号', prop: 'ProductNo', visible: true },
                                    { text: '开始时间', prop: 'startDate', visible: true },
                                    { text: '工段', prop: 'Part', visible: true },
                                    { text: '时长', prop: 'time', visible: true },
                                ]
                            },
                            series: {
                                //偏移方向 0都不能偏移，1向右偏移，-1向左偏移，2都能偏移。默认2
                                raiseDirection: 0,
                                //偏移天数
                                raise: 1,
                                data: [
                                    //"2018-01-01",
                                    //"2018-03-24",
                                ]
                            },
                            Task: {
                                data: [
                                    //{ task: "任务一", startDate: "2018-01-01", time: 4, color: "#191970", Line: "产线三", Part: "内膜" },
                                    //{ task: "任务二", startDate: "2018-01-01", time: 1, color: "DarkGreen", Line: "产线三", Part: "内膜" },
                                    //{ task: "任务三", startDate: "2018-01-03", time: 1, color: "DarkKhaki", Line: "产线三", Part: "内膜" },
                                    //{ task: "任务四", startDate: "2018-01-29", time: 50, color: "purple", Line: "产线二", Part: "内膜" },
                                    //{ task: "任务五", startDate: "2018-02-01", time: 10, color: "Brown", Line: "产线一", Part: "内膜" },
                                    //{ task: "任务六", startDate: "2018-02-12", time: 4, color: "black", Line: "产线四", Part: "内膜" },
                                    //{ task: "任务七", startDate: "2018-02-25", time: 5, color: "Khaki", Line: "产线五", Part: "内膜" },
                                    //{ task: "任务八", startDate: "2018-02-23", time: 3, color: "LightGray", Line: "产线五", Part: "内膜" },
                                    //{ task: "任务九", startDate: "2018-02-28", time: 1, color: "LightGray", Line: "产线二", Part: "内膜" },
                                ]
                            },

                            yAxis: {

                                data: []

                            },

                            fn: function (data, source, cate) {
                                var demo = cate;

                                //var obj1 = $(".lmvt-ALLAPSorder-body"),
                                //    obj2 = HTML.CountListAll;

                                //$.each(APS_arr, function (i, item_i) {
                                //    $.each(source, function (i, item_j) {
                                //        if (item_j.Part == item_i.PartName) {
                                //            item_i.StartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item_j.startDate);
                                //            item_i.FinishedTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(item_i.StartTime).getTime() + item_j.time * (24 * 3600000));
                                //        }
                                //    });

                                //});
                                //model.com.RenderOrder(obj1, APS_arr, obj2);
                            },
                        };

                    //position.series.data = model.com.GetDate(ganttData);




                    position.series.data.push(ChartData.ColumnList[0].WorkDate);
                    position.series.data.push(ChartData.ColumnList[ChartData.ColumnList.length - 1].WorkDate);

                    //颜色库


                    $.each(ChartData.GantPartList, function (i, item) {
                        position.yAxis.data.push(item.OrderNo);
                        var time = model.com.GetDays(item.StartDate, item.EndDate);
                        position.Task.data.push({
                            task: item.OrderNo,
                            startDate: item.StartDate,
                            time: time,
                            color: "green",
                            Line: item.LineName,
                            Part: item.PartName,
                            ProductNo: item.ProductNo,
                            FQTYPlan: item.FQTYPlan,
                            OrderNo: item.OrderNo,
                            OrderID: item.OrderID,
                            FQTYDone: item.FQTYDone,
                            Locked: item.Locked,
                            GroupID: item.GroupID
                        });
                    });
                    //Gant Column width Control:Max=60,Min=30;

                    if (ChartData.ColumnList.length > 0) {
                        position.spacePx = ($(".lmvt-container-gantt").width() - position.freedomPx) / ChartData.ColumnList.length;
                        if (ChartData.ColumnList.length == 10) {
                            position.spacePx = ($(".lmvt-container-gantt").width() - position.freedomPx) / (ChartData.ColumnList.length + 2);
                        }
                        else {
                            if (position.spacePx < 90)
                                position.spacePx = 90;
                            if (position.spacePx > 170)
                                position.spacePx = 170;
                        }

                    }

                    position.contextHight = 62 + ChartData.GantPartList.length * position.spacePy;

                    if (position.contextHight < 300)
                        position.contextHight = $(".lmvt-container-gantt").height();

                    //$(".lmvt-container-count-drawing-gantt").css("height", position.contextHight + "px");

                    $gantt.install($('.lmvt-gantt'), position, $(".lmvt-container-gantt"), ChartData.ColumnList);

                    $gantt.resfushCanvas(position.Task.data);

                    $(".lmvt-container-count-drawing").show();

                })
            });
            //返回
            $("body").delegate("#lmvt-back", "click", function () {
                $(".zzza").show();
                $(".zzzc").hide();
                $(".zzzb").hide();
            });
            //周计划查询
            $("body").delegate("#zace-search-Customer", "change", function () {

                var $this = $(this),
                    value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-orderScheResult-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-orderScheResult-tbody"), WeekDatalistChange, value, "ID");
            });
            //周计划导出
            $("body").delegate("#zace-export-Customer", "click", function () {

                var $table = $(".table-part"),
                    fileName = "周计划" + MShiftID + ".xls",
                   // fileName = "周计划.xls",
                    Title = "周计划";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });

            });

            //审核
            $("body").delegate("#zace-part-Audit", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-orderScheResult-tbody"), "ID", WeekDatalist);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其下达？")) {
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].Status != 1) {
                        alert("数据选择有误,请选择状态为创建的数据")
                        return false;
                    }
                }

                var a = 0;
                //$com.app.loading();
                var WhileAdd = function () {

                    model.com.postLineAssign({
                        ID: SelectData[a].ID
                    }, function (res) {
                        a++;

                        if (a == SelectData.length) {
                            //$com.app.loaded();

                            model.com.refresh();

                        } else {
                            WhileAdd();
                        }
                    });

                }
                if (SelectData.length <= 0) {
                    alert("数据为空！！！");
                } else {
                    WhileAdd();
                }


            });
            //反审核
            $("body").delegate("#zace-part-ReturnAudit", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-orderScheResult-tbody"), "ID", WeekDatalist);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其撤销？")) {
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].Status != 2) {
                        alert("数据选择有误,请选择状态为下达的数据")
                        return false;
                    }
                }

                var a = 0;
                //$com.app.loading();
                var WhileAdd = function () {

                    model.com.postLineReverse({
                        data: SelectData[a]
                    }, function (res) {
                        a++;

                        if (a == SelectData.length) {
                            //$com.app.loaded();

                            model.com.refresh();

                        } else {
                            WhileAdd();
                        }
                    });

                }
                if (SelectData.length <= 0) {
                    alert("数据为空！！！");
                } else {
                    WhileAdd();
                }

            });


            //周计划条件查询
            $("body").delegate("#zace-search-week", "click", function () {
                var default_value = {
                    LineID: 0,
                    StartDate: $com.util.format('yyyy-MM-dd ', new Date()),
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Customer, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    MlineID = Number(rst.LineID);
                    MStartTime = $com.util.format('yyyy-MM-dd', rst.StartDate);
                    model.com.refresh();
                }, TypeSource_Customer));


            });

            //周计划
            $("body").delegate("#zace-back-weekPlan", "click", function () {
                $('.zzza').show();
                $('.zzzb').hide();
                $(".zzzc").hide();
                model.com.refresh();
            });
            //日计划
            $("body").delegate("#zace-back-dayPlan", "click", function () {
                $('.zzzb').show();
                $('.zzza').hide();
                $(".zzzc").hide();
                model.com.refreshDay();
            });

            //日计划查询
            $("body").delegate("#zace-search-LinkManCustomer", "change", function () {

                var $this = $(this),
                    value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-dayPlan-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-dayPlan-tbody"), DayDataList, value, "ID");
            });

            //日计划导出
            $("body").delegate("#zace-export-LinkManCustomer", "click", function () {
                var $table = $(".table-partQ"),
                    fileName = "日计划" + MDayShiftID + ".xls",
                    Title = "日计划";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });

            });

            //日计划条件查询
            $("body").delegate("#zace-search-dayPlan", "click", function () {
                var default_value = {
                    LineID: 0,
                    SDate: $com.util.format('yyyy-MM-dd', new Date()),
                    // Shift: 1,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Customer, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;
                    MlineID = Number(rst.LineID);
                    default_value.SDate = $com.util.format('yyyy-MM-dd', rst.SDate);
                    //default_value.Shift = Number(rst.Shift);

                    MDayShiftID = model.com.getshiftID(default_value.SDate);
                    model.com.refreshDay();

                }, TypeSource_Customer));


            });

        },




        run: function () {
            var UserList = window.parent._UserAll;

            model.com.getFMCLine({ FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0 }, function (resW) {
                if (resW && resW.list) {
                    //DataLinelist = resW.list;
                    $.each(resW.list, function (i, item) {
                        TypeSource_Customer.LineID.push({
                            name: item.Name,
                            value: item.ID,

                        });
                    });

                }
                $.each(UserList, function (i, item) {
                    TypeSource_LinkManCustomer.AuditorID.push({
                        name: item.Name,
                        value: item.ID,

                    });
                });

                var Today = $com.util.format('yyyy-MM-dd', new Date());
                MDayShiftID = model.com.getshiftID(Today);
                model.com.setMMM();
                model.com.refresh();

            });


        },

        com: {

            GetMonday: function (dd) {
                var dd = new Date(dd);
                var week = dd.getDay(); //获取时间的星期数
                var minus = week>0 ? week - 1 : 6;
                dd.setDate(dd.getDate() - minus); //获取minus天前的日期 
                var y = dd.getFullYear();
                var m = dd.getMonth() + 1; //获取月份 
                var d = dd.getDate();
                return y + "-" + m + "-" + d;
            },

            addDate: function (date, days) {
                if (days == undefined || days == '') {
                    days = 1;
                }
                var date = new Date(date);
                date.setDate(date.getDate() + days);
                var month = date.getMonth() + 1; //月份从0开始所以需要+1
                month = month < 10 ? '0' + month : month;
                var day = date.getDate();
                day = day < 10 ? '0' + day : day;
                return date.getFullYear() + '-' + month + '-' + day;
            },
            refresh: function () {

                //得到班次
                model.com.getCreateShifID({ ShiftLevel: 5, Time: MStartTime }, function (resP) {

                    if (!resP)
                        return;
                    if (resP && resP.info) {

                        MShiftID = resP.info;
                    }

                    //计划
                    model.com.getAPSTaskLineAll({ LineID: MlineID, Status: -1, ShiftID: MShiftID }, function (resL) {

                        if (!resL)
                            return;
                        if (resL && resL.list) {
                            WeekDatalist = $com.util.Clone(resL.list);
                            var _list = $com.util.Clone(resL.list);
                            if (_list.length < 1) {
                                alert("没有数据！！！")
                                $("#femi-orderScheResult-tbody").html($com.util.template(_list, HTML.TablePlanMode));
                                $("#femi-orderScheResult-tbody tr").each(function (i, item) {
                                    var $this = $(this);
                                    var colorName = $this.css("background-color");
                                    $this.attr("data-color", colorName);



                                });
                                return false;
                            } else {
                                for (var i = 0; i < _list.length; i++) {
                                    var week = _list[i].ShiftID % 100;
                                    _list[i].ShiftName = week + "周";
                                    //年份
                                    Yeara = parseInt(_list[i].ShiftID / 10000);
                                    YearName = Yeara + "-01" + "-01";
                                    YearName = model.com.GetMonday(YearName);
                                    _list[i].StartZ = model.com.addDate(YearName, (week - 1) * 7);
                                    _list[i].EndZ = model.com.addDate(YearName, (week) * 7-1);
                                }
                                $.each(_list, function (i, item) {
                                    for (var p in item) {
                                        if (!FORMATTRT_LinkManCustomer[p])
                                            continue;
                                        item[p] = FORMATTRT_LinkManCustomer[p](item[p]);
                                    }
                                });
                                WeekDatalistChange = $com.util.Clone(_list);
                                $("#femi-orderScheResult-tbody").html($com.util.template(_list, HTML.TablePlanMode));
                                $("#femi-orderScheResult-tbody tr").each(function (i, item) {
                                    var $this = $(this);
                                    var colorName = $this.css("background-color");
                                    $this.attr("data-color", colorName);



                                });
                            }

                        }


                    });


                });




            },
            refreshDay: function () {
                model.com.getAPSTaskPartAll({ LineID: MlineID, ShiftID: MDayShiftID }, function (resLp) {
                    if (!resLp)
                        return;
                    if (resLp && resLp.list) {

                        DayDataList = $com.util.Clone(resLp.list);
                        var _list = $com.util.Clone(resLp.list);
                        if (_list.length < 1) {
                            alert("没有数据！！！")
                            $("#femi-dayPlan-tbody").html($com.util.template(_list, HTML.TableDayPlanMode));

                            $("#femi-dayPlan-tbody tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);



                            });
                            return false;
                        } else {
                            for (var i = 0; i < _list.length; i++) {
                                _list[i].ShiftName = model.com.getDate(_list[i].ShiftID);
                            }
                            $("#femi-dayPlan-tbody").html($com.util.template(_list, HTML.TableDayPlanMode));
                            $("#femi-dayPlan-tbody tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);



                            });
                        }
                    }

                });
            },
            //产线撤销审核
            postLineReverse: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskLine/Reverse",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //产线审核
            postLineAssign: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskLine/Assign",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //产线得到甘特
            getAPSTaskGant: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskLine/TaskLineGant",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //班次
            getCreateShifID: function (data, fn, context) {
                var d = {
                    $URI: "/SCHShift/CreateShifID",
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

            //产线任务
            getAPSTaskLineAll: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskLine/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //工序任务
            getAPSTaskPartAll: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskPart/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询顾客信息
            getCustomer: function (data, fn, context) {
                var d = {
                    $URI: "/Customer/All",
                    $TYPE: "get"
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
            //查询顾客联系人列表
            getLinkManCustomer: function (data, fn, context) {
                var d = {
                    $URI: "/LinkManCustomer/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
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
            getDate: function (id) {
                var dateS = "";
                var zDay = id;

                var a = parseInt(zDay / 10000);
                var b = zDay % 10000;
                var c = parseInt(b / 100);
                var d = b % 100;

                //dateS = a + "年" + c + "月" + d + "日";
                if (c < 10) {
                    c = "0" + c;
                }
                if (d < 10) {
                    d = "0" + d;
                }
                dateS = a + "-" + c + "-" + d;
                return dateS;
            },
            //计算天数
            GetDays: function (startDate, endDate) {
                var days;
                days = (new Date(endDate) - new Date(startDate)) / 1000 / 60 / 60 / 24;
                return days;
            },
            //动态生成表格
            refreshTablePro: function (data) {
                //工序详情
                var _list = $com.util.Clone(data);
                var _head = $com.util.template({ ths: $com.util.template(_list.ColumnList, HTML.th) }, HTML.thead);

                $(".part-plan-div .table thead").html(_head);

                $.each(_list.GantPartList, function (i, item) {
                    item.FQTYSum = 0;
                    $.each(item.TaskPartList, function (p, p_item) {
                        item.FQTYSum += p_item.FQTYShift;
                    });
                    item.tds = $com.util.template(item.TaskPartList, HTML.td);

                });
                $(".part-plan-div>.table tbody").html($com.util.template(_list.GantPartList, HTML.TableUserItemNode));
                $(".part-plan-div>.table tbody tr").each(function (i, item) {
                    var $this = $(this);
                    var colorName = $this.css("background-color");
                    $this.attr("data-color", colorName);



                });

            },
            setMMM: function () {
                setTimeout(function () {
                    if (window.parent._zaceUserAll && window.parent._zaceUserAll == 1) {
                        model.com.getUser({}, function (res) {
                            if (!res)
                                return;
                            if (res && res.list) {
                                //TypeSource_Level.AuditorID.splice(1, TypeSource_Level.AuditorID.length - 1);
                                TypeSource_LinkManCustomer.AuditorID = [];
                                $.each(res.list, function (i, item) {
                                    TypeSource_LinkManCustomer.AuditorID.push({
                                        name: item.Name,
                                        value: item.ID,

                                    });
                                });
                            }
                            window.parent._zaceUserAll = 0;
                        });

                    }

                    if (window.parent._zaceLineSet && window.parent._zaceLineSet == 1) {
                        model.com.getFMCLine({ FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0 }, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {
                                //TypeSource_Level.AuditorID.splice(1, TypeSource_Level.AuditorID.length - 1);
                                TypeSource_Customer.LineID = [];
                                $.each(resW.list, function (i, item) {
                                    TypeSource_Customer.LineID.push({
                                        name: item.Name,
                                        value: item.ID,
                                        //  far:item.WorkShopID
                                    });
                                });
                            }
                            window.parent._zaceLineSet = 0;
                        });

                    }
                    model.com.setMMM();
                }, 500);

            },

        }
    }),

        model.init();


});