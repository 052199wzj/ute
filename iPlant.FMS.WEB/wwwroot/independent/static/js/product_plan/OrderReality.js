require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/compareGantte'], function ($zace, $com, $ganttWeek) {


    var OrderNo="",
        PartNo = "",
        LineName = "",
        ProductNo = "",
        OrderID = 0,

        HTML;

    HTML = {


    };

    model = $com.Model.create({
        name: 'LOCO',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            window.setFunctionTrigger("RanderGantt", function (obj) {

                OrderNo = obj.OrderNo;
                ProductNo = obj.ProductNo;
                PartNo = obj.PartNo;
                OrderID = obj.OrderID;

                var arr = []
                if (!Array.isArray(OrderID)) {
                    arr = [OrderID];
                }
                model.com.randerGante(arr);
                $(".lmvt-partNoTitle").text(PartNo);
            });
        },

        run: function () {

            OrderNo = model.query.OrderNo;
            ProductNo = model.query.ProductNo;
            PartNo = model.query.PartNo;
            OrderID = model.query.OrderID;

            var arr = [OrderID];
            model.com.randerGante(arr);

            $(".lmvt-partNoTitle").text(PartNo);
        },

        com: {
            //获取实际与计划对比数据
            getCompareList: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskPart/CompareList",
                    $TYPE: "post",
                    $SERVER: '/MESAPS'
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //根据订单列表渲染甘特图
            randerGante: function (arr) {
                model.com.getCompareList({ data: arr }, function (res) {
                    if (res.StartTime == "2000-01-01 00:00:00") {
                        alert("所选订单存在异常");
                    } else {

                        var mStartTime = res.StartTime;
                        var mEndTime = res.EndTime;


                        var _list = res;

                        //mZaceTableGante = $com.util.Clone(res);
                        //mStationlist = $com.util.Clone(res.OrderColumn);
                        //mTableData = $com.util.Clone(res.TableInfoList);

                        //mApsList = $com.util.Clone(_list);


                        //渲染甘特数据
                        var AllGantte = $com.util.Clone(res.TreeList);
                        //需要回显数据
                        var BackRander = [];
                        $.each(AllGantte, function (j, jtem) {
                            $.each(jtem.TaskPartList, function (k, ktem) {
                                for (var m = 0; m < ktem.TaskPartList.length; m++) {

                                    if (new Date(ktem.TaskPartList[m].StartTime).getTime() >= new Date(mEndTime).getTime()) {
                                        BackRander.push(ktem.TaskPartList[m]);
                                        ktem.TaskPartList.splice(m, 1);
                                        m--;
                                    }

                                }


                            });
                        });

                        var position = {

                            //天数间隔
                            spacePx: 100.0,
                            //左边菜单栏像素
                            freedomPx: 250,
                            //最小高度
                            contextHight: 400,
                            //矩形边框
                            radius: 4,
                            tip: {
                                //提示条宽度，高度，行高
                                Text: { tipW: 170, tipH: 70, lineH: 20, titleH: 20 },
                                title: { text: '车号', prop: 'PartNo', visible: true },
                                line: [
                                    { text: '开始时间', prop: 'StartTime', visible: true },
                                    { text: '时长', prop: 'time', visible: false },

                                    { text: '备注', prop: 'TaskText', visible: true },
                                    { text: '冲突消息', prop: 'APSMessage', visible: false },//TaskText
                                ]
                            },

                            effect: {
 
                            },

                            //基本上部信息
                            orderinfo: {
                                OrderNo: OrderNo,
                                PartNo: PartNo,
                                LineName: "",
                                ProductNo: ProductNo,
                            },

                            //绘制开始日期与结束日期
                            series: {
                                data: [
                                    mStartTime,
                                    mEndTime,
                                ]
                            },

                            fn: function (source) {
                            },

                            Task: {
                                data: AllGantte,
                                dataList: res.list,
                            },

                            yAxis: {

                                data: ['任务一', '任务二', '任务三', '任务四', '任务五', '任务六', '任务七', '任务8', '任务9']

                            },
                        }

                        var counts = 0,
                            temp = true;

                        $.each(position.Task.data, function (m_n, m_ntem) {
                            $.each(m_ntem.TaskPartList, function (k_n, k_ntem) {
                                if (k_ntem.LineID != res.info) {
                                    m_ntem.TaskPartList.splice(k_n, 1);
                                    k_n--;
                                    return true;
                                } else {
                                    var obj = $com.util.Clone(k_ntem);
                                    position.orderinfo.LineName = $com.util.Clone(k_ntem.LineName);
                                    obj.LineID = -1;
                                    obj.LineName = "实际";
                                    m_ntem.TaskPartList.push(obj);
                                    k_ntem.LineName = "计划";
                                }
                            })
                        })
                        $.each(position.Task.data, function (j, jtem) {
                            $.each(jtem.TaskPartList, function (k, ktem) {
                                //if (!ktem.TaskPartList[0]) {
                                //    ktem.TaskPartList.push(Temp);
                                //}
                                if (ktem.LineID != res.info) {

                                    $.each(ktem.TaskPartList, function (m, mtem) {
                                        // <th style="min-width: 50px" data-order="PlanReceiveDate">计划进厂</th>
                                        // <th style="min-width: 50px" data-order="RealReceiveDate">实际进厂</th>
                                        // <th style="min-width: 50px" data-order="PlanFinishDate">预计完工</th>
                                        counts++;
                                        //天数

                                        //开工时间
                                        var reaStartTime = mtem.StartWorkTime,
                                        //完工时间
                                            reaEndTime = mtem.FinishWorkTime,
                                        //计划开工时间
                                            planStartTime = mtem.StartTime,
                                        //计划完工时间
                                            planEndTime = mtem.EndTime;

                                        //完工
                                        if (mtem.Status == 5) {
                                            //延期完工
                                            if (new Date($com.util.format("yyyy-MM-dd", reaStartTime)).getTime() > new Date($com.util.format("yyyy-MM-dd", planStartTime)).getTime() ||
                                                new Date($com.util.format("yyyy-MM-dd", reaEndTime)).getTime() > new Date($com.util.format("yyyy-MM-dd", planEndTime)).getTime()) {
                                                mtem.ColorList = ["#2E8B57"];
                                                mtem.time = model.com.GetDays(reaEndTime, reaStartTime);
                                                mtem.startDate = reaStartTime;
                                            } else {
                                                //正常完工
                                                if (new Date($com.util.format("yyyy-MM-dd", reaStartTime)).getTime() == new Date($com.util.format("yyyy-MM-dd", planStartTime)).getTime() &&
                                                new Date($com.util.format("yyyy-MM-dd", reaEndTime)).getTime() == new Date($com.util.format("yyyy-MM-dd", planEndTime)).getTime()) {
                                                    mtem.ColorList = ["#2E8B57"];
                                                    mtem.time = model.com.GetDays(reaEndTime, reaStartTime);
                                                    mtem.startDate = reaStartTime;
                                                    //mtem.color = 5;
                                                }
                                                    //提前完工
                                                else {
                                                    mtem.ColorList = ["#F59A23", "#2E8B57"];
                                                    mtem.time = model.com.GetDays(reaEndTime, reaStartTime);
                                                    mtem.startDate = reaStartTime;
                                                }
                                            }
                                        }
                                        //未完工
                                        if (mtem.Status == 4) {
                                            //提前开工
                                            if (new Date($com.util.format("yyyy-MM-dd", reaStartTime)).getTime() < new Date($com.util.format("yyyy-MM-dd", planStartTime)).getTime()) {
                                                mtem.ColorList = ["#F59A23", "darkgray"];
                                                mtem.time = model.com.GetDays(planStartTime, reaStartTime);
                                                mtem.startDate = reaStartTime;
                                                //mtem.color = 5;
                                            }
                                                //正常开工
                                            else if (new Date($com.util.format("yyyy-MM-dd", reaStartTime)).getTime() == new Date($com.util.format("yyyy-MM-dd", planStartTime)).getTime()) {
                                                mtem.ColorList = ["#F59A23", "darkgray"];
                                                mtem.time = model.com.GetDays(planStartTime, reaStartTime);
                                                mtem.startDate = reaStartTime;
                                                //mtem.color = 5;
                                            }
                                                //延期开工
                                            else {
                                                mtem.ColorList = ["#B22222", "darkgray"];
                                                mtem.time = model.com.GetDays(planStartTime, reaStartTime);
                                                mtem.startDate = reaStartTime;
                                            }
                                        }
                                        if (mtem.Status == 2) {
                                            //超时未开工
                                            if (new Date($com.util.format("yyyy-MM-dd", new Date())).getTime() >= new Date($com.util.format("yyyy-MM-dd", planStartTime)).getTime()) {
                                                mtem.ColorList = ["#B22222", "darkgray"];
                                                mtem.time = model.com.GetDays(planStartTime, planEndTime);
                                                mtem.startDate = planStartTime;
                                                //mtem.color = 5;
                                            }
                                                //未开工
                                            else {
                                                mtem.ColorList = ["darkgray"];
                                                mtem.time = model.com.GetDays(planStartTime, planEndTime);
                                                mtem.startDate = planStartTime;
                                            }
                                        }
                                        //if (mtem.Status.startsWith("2000-01-01") && mtem.FinishWorkTime.startsWith("2000-01-01")) {
                                        //    mtem.time = model.com.GetDays(mtem.StartTime, mtem.FinishWorkTime);

                                        //    mtem.StartTime = $com.util.format("yyyy-MM-dd", mtem.StartTime);
                                        //    mtem.EndTime = $com.util.format("yyyy-MM-dd hh:mm:ss", mtem.FinishWorkTime);
                                        //    mtem.startDate = mtem.StartTime;
                                        //    mtem.color = 5;
                                        //}
                                        ////开工未完成(并且未超时)
                                        //if (!mtem.StartWorkTime.startsWith("2000-01-01") && !mtem.FinishWorkTime.startsWith("2000-01-01") && new Date(mtem.StartWorkTime).getTime()) {
                                        //    mtem.time = model.com.GetDays(mtem.StartTime, mtem.FinishWorkTime);

                                        //    mtem.StartTime = $com.util.format("yyyy-MM-dd", mtem.StartTime);
                                        //    mtem.EndTime = $com.util.format("yyyy-MM-dd hh:mm:ss", mtem.FinishWorkTime);
                                        //    mtem.startDate = mtem.StartTime;
                                        //    mtem.color = 5;
                                        //}

                                        //mtem.time = model.com.GetDays(mtem.StartTime, mtem.FinishWorkTime);

                                        //mtem.StartTime = $com.util.format("yyyy-MM-dd", mtem.StartTime);
                                        //mtem.EndTime = $com.util.format("yyyy-MM-dd hh:mm:ss", mtem.FinishWorkTime);
                                        //mtem.startDate = mtem.StartTime;
                                        //mtem.color = "#3E90C6"


                                        //模板  无订单
                                        if (mtem.PartNo.length < 1) {
                                            mtem.startDate = $com.util.format("yyyy-MM-dd", '1970-1-1');
                                        }

                                    });
                                } else {
                                    $.each(ktem.TaskPartList, function (m, mtem) {
                                        mtem.time = model.com.GetDays(mtem.StartTime, mtem.EndTime);

                                        mtem.StartTime = $com.util.format("yyyy-MM-dd", mtem.StartTime);
                                        mtem.EndTime = $com.util.format("yyyy-MM-dd hh:mm:ss", mtem.EndTime);
                                        mtem.startDate = mtem.StartTime;
                                        mtem.ColorList = ["#3E90C6"];
                                    });
                                }
                            });
                        });

                        position.contextHight = counts * 25 * 2 + 54;



                        $(function () {

                            $ganttWeek.install($('.lmvt-gantt'), $(".lmvt-container-gantt"), position);

                            $ganttWeek.resfushCanvas(position.Task.data);

                        });

                        $(".lmvt-gantt").ready(function () {
                            var ScrollDiv = $(".lmvt-container-gantt");
                            $(".canvasLeft1").css("top", ScrollDiv.offset().top);
                            $(".canvasLeft1").css("left", ScrollDiv.offset().left);
                            $(".canvasLeft1").css("width", position.freedomPx);
                            $(".canvasLeft1").css("height", ScrollDiv.height());

                            $(".canvasTop1").css("top", ScrollDiv.offset().top);
                            $(".canvasTop1").css("left", ScrollDiv.offset().left);
                            $(".canvasTop1").css("width", ScrollDiv.width());
                            $(".canvasTop1").css("height", 52);
                        });

                        $com.app.loaded();
                    }
                });
            },

            getTableData: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskPart/TableList",
                    $TYPE: "post",
                    $SERVER: '/MESAPS'
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //工区工位
            getWorkAreaAll: function (data, fn, context) {
                var d = {
                    $URI: "/LFS/WorkAreaAll",
                    $TYPE: "Get",
                    $SERVER: "/MESLFS"
                };

                function err() {
                    $com.app.tip('获取库位列表失败，请检查网络!');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            postTreeList: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskPart/TreeList",
                    $TYPE: "post",
                    $SERVER: '/MESAPS'

                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            refreshPriority: function (data, index1, index2) {

                data = model.com.swapArr(data, index1, index2);

                for (var index = 0; index < data.length; index++) {
                    data[index].WID = index + 1;

                }

                var _list = $com.util.Clone(data);

                $.each(_list, function (i, item) {
                    for (var p in item) {
                        if (!FORMATTRT_LevelItem[p])
                            continue;
                        item[p] = FORMATTRT_LevelItem[p](item[p]);
                    }
                });
                $("#femi-orderPriority-tbody").html($com.util.template(_list, HTML.TableOrderMode));
                $("#femi-orderPriority-tbody tr").each(function (i, item) {
                    var $this = $(this);
                    var colorName = $this.css("background-color");
                    $this.attr("data-color", colorName);



                });





            },

            //查询订单列表
            getOMSOrder: function (data, fn, context) {
                var d = {
                    $URI: "/OMSOrder/All",
                    $TYPE: "get",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //
            postOMSManualScheduling: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskPart/ManualScheduling",
                    $TYPE: "post",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //保存排程结果
            postOMSOrderSaved: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskPart/SaveTaskList",
                    $TYPE: "post",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //优先级列表
            postOMSOrderPriority: function (data, fn, context) {
                var d = {
                    $URI: "/OMSOrder/OrderPriority",
                    $TYPE: "post",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询订单列表
            getOMSOrderList: function (data, fn, context) {
                var d = {
                    $URI: "/OMSOrder/OrderList",
                    $TYPE: "get",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            swapArr: function (arr, index1, index2) {
                /*数组两个元素位置互换*/
                arr[index1] = arr.splice(index2, 1, arr[index1])[0];
                return arr;
            },
            setMMM: function () {
                setTimeout(function () {
                    if (window.parent._zaceLineSet && window.parent._zaceLineSet == 1) {
                        model.com.getFMCLine({ FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0 }, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {
                                TypeSource_condition.LineID = [];
                                $.each(resW.list, function (i, item) {
                                    TypeSource_condition.LineID.push({
                                        name: item.Name,
                                        value: item.ID,
                                    });
                                });
                            }
                            window.parent._zaceLineSet = 0;
                        });

                    }

                    if (window.parent._zaceFactoryShift && window.parent._zaceFactoryShift == 1) {
                        model.com.getFMCWorkDay({}, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {
                                TypeSource_condition.WorkDayID = [];
                                $.each(resW.list, function (i, item) {
                                    TypeSource_condition.WorkDayID.push({
                                        name: item.Name,
                                        value: item.ID,

                                    });
                                });
                            }
                            window.parent._zaceFactoryShift = 0;
                        });

                    }
                    if (window.parent._zacePartSet && window.parent._zacePartSet == 1) {
                        model.com.getFPCPartAll({ FactoryID: -1, BusinessUnitID: -1, ProductTypeID: -1, OAGetType: -1 }, function (resW) {
                            if (resW && resW.list) {
                                AllPart = resW.list;
                            }
                            window.parent._zacePartSet = 0;
                        });

                    }
                    model.com.setMMM();
                }, 500);

            },
            refreshCondition: function () {
                mConditionList = [];
                for (var index = 0; index < mCondition.length; index++) {

                    if (mCondition[index] == 0) {
                        mCondition.splice(0, 1);
                    }



                }
                var _list = [];
                for (var index = 0; index < mCondition.length; index++) {
                    _list.push(Number(mCondition[index]));

                }
                mCondition = _list;
                for (var index = 0; index < mCondition.length; index++) {
                    for (var i = 0; i < Condition.length; i++) {
                        if (mCondition[index] > 0 && mCondition[index] == Condition[i].ID) {
                            mConditionList.push(Condition[i]);
                        }

                    }

                }

                for (var index = 0; index < mConditionList.length; index++) {
                    mConditionList[index].Priority = index + 1;
                }
                $("#femi-orderMakeAll-condition").html($com.util.template(mConditionList, HTML.TablePriority));
                $("#femi-orderMakeAll-condition tr").each(function (i, item) {
                    var $this = $(this);
                    var colorName = $this.css("background-color");
                    $this.attr("data-color", colorName);



                });
            },

            refreshC: function () {
                //排程条件
                model.com.getConditionInfo({ UnitID: 0, UnitLevel: 1, ShiftPeriod: 5, ShiftTime: MShiftTime, ShiftLevelID: 0, ShiftDays: MShiftsDays, WorkDayID: MWorkDayID }, function (res) {
                    if (!res)
                        return;
                    if (res && res.info) {
                        res.info.LineID = MlineID;
                        res.info.ShiftTime = MShiftTime;
                        res.info.WorkDayID = MWorkDayID;
                        res.info.ShiftDays = MShiftsDays;
                        if (res.info.MaxLoadRate != mMaxLoadRate) {
                            res.info.MaxLoadRate = mMaxLoadRate;
                        }
                        res.info.MaxLoadRate = parseFloat(res.info.MaxLoadRate);
                        res.info.MaxLoadRate = res.info.MaxLoadRate.toFixed(1);
                        res.info.condition = [0];
                        var _listinfo = $com.util.Clone(res.info);
                        DataCondition = $com.util.Clone(res.info);
                        conditionChange = $com.util.Clone(res.info);
                        $com.propertyGrid.show($(".zace-pripoty"), _listinfo, KEYWORD_condition, TypeSource_condition);

                        ganttDate = model.com.GetGanttDay(MShiftTime, MShiftsDays);


                        //var _list = [];
                        //_list.push(_listinfo);
                        //$.each(_list, function (i, item) {
                        //    for (var p in item) {
                        //        if (!FORMATTRT_condition[p])
                        //            continue;
                        //        item[p] = FORMATTRT_condition[p](item[p]);
                        //    }
                        //});

                        // $("#femi-orderPlanResult-tbody").html($com.util.template(_list, HTML.TableConditionMode));

                    }
                });
            },
            getListByOrderID: function (_list) {

                var _listOrder = [];
                for (var j = 0; j < _list.length; j++) {

                    for (var i = 0; i < _list.length; i++) {
                        if ((j + 1) == _list[i].OrderID) {
                            _listOrder.push(_list[i]);

                        }
                    }

                }
                return _listOrder;

            },




            //Day 班次
            getFMCWorkDay: function (data, fn, context) {
                var d = {
                    $URI: "/FMCWorkDay/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //订单自动排程
            postAutoScheduling: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskPart/AutoScheduling",
                    $TYPE: "post",
                    $SERVER: '/MESAPS'
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //甘特计算
            getGenerateGant: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskLine/GenerateGant",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //APSTask  LineAll
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

            //SCHShift
            getCreateShifID: function (data, fn, context) {
                var d = {
                    $URI: "/SCHShift/CreateShiftID",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取ConditionInfo列表
            getConditionInfo: function (data, fn, context) {
                var d = {
                    $URI: "/APSOrder/ConditionInfo",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取APS订单计划
            getSchedulePlan: function (data, fn, context) {
                var d = {
                    $URI: "/APSOrder/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //自动生成APS订单计划
            postSchedulePlan: function (data, fn, context) {
                var d = {
                    $URI: "/APSOrder/ModelAll",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //保存APS订单计划
            saveSchedulePlan: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskLine/SaveGant",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },



            //获取bom列表
            getBomList: function (data, fn, context) {
                var d = {
                    $URI: "/Bom/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
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

            //获取物料号列表
            getMaterialList: function (data, fn, context) {
                var d = {
                    $URI: "/Material/All",
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

            //查询
            getFMCUserId: function (data, fn, context) {
                var d = {
                    $URI: "/Role/UserAllByFunctionID",
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
            //查询工厂
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
            //查询事业部
            getBusinessUnit: function (data, fn, context) {
                var d = {
                    $URI: "/BusinessUnit/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询制造令
            getCommandAll: function (data, fn, context) {
                var d = {
                    $URI: "/MESOrder/CommandAll",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询车间列表
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

            //查询MES订单
            getMESOrderAll: function (data, fn, context) {
                var d = {
                    $URI: "/MESOrder/OrderAllByCommandID",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //添加生产制造令
            postCommandAdd: function (data, fn, context) {
                var d = {
                    $URI: "/MESOrder/CommandAdd",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //保存生产制造令
            postCommandSave: function (data, fn, context) {
                var d = {
                    $URI: "/MESOrder/CommandSave",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //保存MES订单
            postMESOrderSave: function (data, fn, context) {
                var d = {
                    $URI: "/MESOrder/MESOrderSave",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //审核命令票
            postAudit: function (data, fn, context) {
                var d = {
                    $URI: "/MESOrder/CommandAudit",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //反审核
            postReverseAudit: function (data, fn, context) {
                var d = {
                    $URI: "/MESOrder/CommandReverseAudit",
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
            //工段
            getFPCPartAll: function (data, fn, context) {
                var d = {
                    $URI: "/FPCPart/All",
                    $TYPE: "get"
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
            addDays: function (date, days) {
                if (days == undefined || days == '') {
                    days = 1;
                }
                var date = new Date(date);
                date.setDate(date.getDate() + days);
                var month = date.getMonth() + 1;
                var day = date.getDate();
                var mm = "'" + month + "'";
                var dd = "'" + day + "'";

                //单位数前面加0
                if (mm.length == 3) {
                    month = "0" + month;
                }
                if (dd.length == 3) {
                    day = "0" + day;
                }

                var time = date.getFullYear() + "-" + month + "-" + day;
                return time;
            },

            //得到最小与最大日期
            GetDate: function (source) {
                var arr = [],
                    maxDate = new Date(source[0].EndTime) / 1000 / 60 / 60 / 24,
                    minDate = new Date(source[0].StartTime) / 1000 / 60 / 60 / 24;
                if (source.length == 1) {
                    arr.push($com.util.format('yyyy-MM-dd', new Date(source[0].StartTime) - 7 * 1000 * 60 * 60 * 24));
                    arr.push($com.util.format('yyyy-MM-dd', new Date(source[0].EndTime) + 7 * 1000 * 60 * 60 * 24));
                }
                else {
                    $.each(source, function (i, item) {
                        if (new Date(item.StartTime) / 1000 / 60 / 60 / 24 <= minDate) {
                            minDate = new Date(item.StartTime) / 1000 / 60 / 60 / 24;
                        }
                        if (new Date(item.EndTime) / 1000 / 60 / 60 / 24 >= maxDate) {
                            maxDate = new Date(item.EndTime) / 1000 / 60 / 60 / 24;
                        }
                    });
                    arr.push($com.util.format('yyyy-MM-dd', new Date(minDate) * 1000 * 60 * 60 * 24));
                    arr.push($com.util.format('yyyy-MM-dd', new Date(maxDate) * 1000 * 60 * 60 * 24));
                }
                return arr;
            },
            //得到工段
            GetPartName: function (wid) {
                var Name;
                $.each(AllPart, function (j, item_j) {
                    if (item_j.ID == wid) {
                        Name = item_j.Name;
                        return false;
                    }
                });
                return Name;
            },
            //MaterialTaskProduct
            getMaterialTask: function (data, fn, context) {
                var d = {
                    $URI: "/MaterialTaskProduct/MaterialInfo",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //根据开始时间以及时长得到甘特图时间
            GetGanttDay: function (startdate, time) {
                var arr = [];
                arr.push($com.util.format('yyyy-MM-dd', startdate));
                arr.push($com.util.format('yyyy-MM-dd', (new Date(startdate).getTime() + time * 24 * 60 * 60 * 1000)));
                return arr;
            },

            getCanvas: function (data) {
                var arr = data;
                var beginX = 10;
                var beginY = 10;
                var w = 50;
                var h = 40;
                var zindexX, zindexY;
                var c = document.getElementById("myCanvas");
                var cxt = c.getContext("2d");
                cxt.font = "16px Georgia";
                // cxt.scale(0.5,0.5);
                var lineX, lineY;

                //得到每列最大字符串  
                var widthList = [50];
                var item = arr[0];
                for (var i = 1; i < item.length; i++) {
                    var _list = [];
                    var first = getIntOrStr(arr[0][i]);
                    if (i < 5) {
                        if (i == 3) {
                            first = "12345678";
                        } else if (i == 4) {
                            first = "1234567890";
                        } else {
                            for (var j = 0; j < arr.length; j++) {

                                if (getIntOrStr(arr[j][i]).length > first.length) {
                                    first = getIntOrStr(arr[j][i]);
                                }
                            }
                        }
                    } else {
                        //固定80
                        first = "1月1日";
                    }
                    //if (i < 5&& i>=3) {

                    //    first = getIntOrStr(4);

                    //    }
                    //}

                    widthList.push(first.length * 20 + 10);
                }
                //右距离20
                c.width = 20;
                for (var i = 0; i < widthList.length; i++) {
                    c.width += widthList[i];
                }
                c.height = arr.length * 40 + 10;
                //cxt.fillStyle = 'green';
                //cxt.textAlign = "center";
                //cxt.font = "16px Arial";
                //cxt.fillText('排程计划详情', c.width / 2, 33);

                //判断整数或字符串
                function getIntOrStr(data) {
                    if (data % 1 === 0) {
                        return data.toString();
                    }
                    else {
                        return data;
                    }
                }

                //画表格
                function createBlock(x, y) {
                    cxt.beginPath();
                    ////画布线条
                    //cxt.strokeStyle = 'blue';
                    //cxt.rect(0, 0, c.width, c.height);
                    //cxt.stroke();

                    //头部涂色
                    cxt.fillStyle = "#CAE1FF";//Grey  Silver
                    cxt.fillRect(0, 0, c.width - 20, 40);

                    for (l = 1; l <= arr.length; l++) {

                        var child = arr[l - 1];
                        for (r = 1; r <= child.length; r++) {
                            w = widthList[r - 1];
                            a = x;
                            for (var i = 1; i <= widthList.length; i++) {
                                if (i < r) {
                                    a += widthList[i - 1];
                                }
                            }
                            //a=x+(r-1)*w;
                            b = y + (l - 1) * h;
                            x_zuobiao = a + w / 2;
                            y_zuobiao = b + h / 2;
                            //lineX = a + w;
                            //lineY = b - h / 2;
                            cxt.rect(a, b, w, h);
                            cxt.fillStyle = 'black';
                            cxt.textAlign = "center";
                            cxt.font = "12px Arial";
                            cxt.fillText(child[r - 1], x_zuobiao, y_zuobiao + 5);
                            cxt.strokeStyle = '#000000';
                            cxt.stroke();
                        };
                        cxt.strokeStyle = '#000000';
                        cxt.stroke();
                    };
                };
                //原点开始
                createBlock(0, 0);
                c.onmousedown = function (ev) {
                    var e = ev || event;
                    var x = e.layerX;
                    var y = e.layerY;
                    var _info = getDataOne(x, y);
                    if (_info.length > 0) {
                        var row = _info[1];
                        var colunm = _info[0];
                        var colunmName = arr[0][colunm - 1];
                        var colunmNum = arr[row - 1][colunm - 1];
                        // alert("列:" + colunm + " " + "行:" + row);
                        alert(colunmName + " " + colunmNum);
                    }

                };

                //X,Y判断哪一个数据
                function getDataOne(x, y) {
                    var x0 = x, y0 = y;
                    //widthList  height 40  arr
                    //固定不动的宽度
                    var changeWidth = 0;
                    for (var i = 0; i < widthList.length; i++) {
                        if (i < 5) {
                            changeWidth += widthList[i];
                        }
                    }
                    if (x0 <= changeWidth || x0 >= (c.width - 20) || y0 <= 40 || y0 >= (c.height - 15)) {
                        return [];
                    }
                    else {
                        //距离初始日期点坐标
                        var x1 = x0 - changeWidth;
                        var y1 = y0 - 40;
                        var NumX = parseInt(x1 / 90) + 6;
                        var NumY = parseInt(y1 / 40) + 2;
                        return [NumX, NumY]

                    }
                };



            },

            //计算天数
            GetDays: function (startDate, endDate) {
                var days;
                days = (new Date(endDate) - new Date(startDate)) / 1000 / 60 / 60 / 24;
                days = Math.ceil(days);

                if (days < 1 && days>0.5) {
                    days = 1;
                }
                if (days < 0.5) {
                    days = 0.5;
                }

                return days;
            },


            //动态生成表格
            refreshTablePro: function (data) {
                //工序详情
                var _list = $com.util.Clone(data);
                var _head = $com.util.template({ ths: $com.util.template(_list[0], HTML.th) }, HTML.thead);

                $(".part-plan-div .table thead").html(_head);

                $.each(_list, function (i, item) {
                    if (i > 0) {
                        item.FQTYSum = 0;
                        $.each(item.TaskPartList, function (p, p_item) {
                            item.FQTYSum += p_item.FQTYShift;

                        });
                        item.tds = $com.util.template(item, HTML.td);
                        // if (item.TaskLineID > 0) {
                        //     item.Text = "已排";
                        // } else {
                        //     item.Text = "未排";
                        // }
                    }

                });
                $(".part-plan-div>.table tbody").html($com.util.template(_list.GantPartList, HTML.TableUserItemNode));

                $(".part-plan-div>.table tbody tr").each(function (i, item) {
                    var $this = $(this);
                    var colorName = $this.css("background-color");
                    $this.attr("data-color", colorName);



                });

                $(".zace-orderSchedule").hide();
                $(".zace-orderTaskLine").hide();
                $(".zace-orderTablePartShow").hide();
                $(".zace-orderTableTableShow").show();
            },

            getElementTop: function (el) {

                var actualTop = el.offset().top;

                var current = el.parent()[0];

                while (!current.body) {

                    actualTop += $(current).offset().top;

                    current = $(current).parent();

                }

                return actualTop;
            },
            getHourOrMinorSec: function (num) {
                var WSecond = num;
                var hour = parseInt(WSecond / 3600);
                var hourS = WSecond % 3600;

                var min = parseInt(hourS / 60);

                var sec = hourS % 60;
                if (hour > 0) {
                    return hour + "小时" + min + "分钟" + sec + "秒";
                } else {
                    if (min > 0) {
                        return min + "分钟" + sec + "秒";
                    } else {
                        return sec + "秒";
                    }
                }
            },
            getNewEntry: function (wdata) {
                var _list = wdata;
                var _Newlist = {
                    ColumnList: [],
                    GantPartList: [],
                    ID: 0,
                    TaskLineList: [],

                };
                for (var i = 0; i < _list.GantPartList.length; i++) {
                    if (_list.GantPartList[i].TaskLineID == 0) {
                        _Newlist.GantPartList.push(_list.GantPartList[i]);
                    }
                }
                for (var i = 0; i < _list.TaskLineList.length; i++) {
                    if (_list.TaskLineList[i].ID == 0) {
                        _Newlist.TaskLineList.push(_list.TaskLineList[i]);
                    }
                }
                _Newlist.ColumnList = _list.ColumnList;
                return _Newlist;
            },



            FullTemple: function (data, list, stationList) {
                var C_list = [];
                var _list = [];

                var _data = $com.util.Clone(list);
                for (p in data) {

                    C_list.push({
                        key: p,
                        value: data[p]
                    });


                }
                for (var index = 1; index < _data.length; index++) {

                    $com.util.deleteLowerProperty(_data[index]);
                    _list.push(_data[index]);


                }


                var ths = $com.util.template(stationList, HTML.th);
                var tds = $com.util.template(stationList, HTML.td);
                HTML.TableUserItemNode_F = HTML.TableUserItemNode + tds + " </tr>";
                HTML.thead_F = HTML.thead + ths + " </tr>";


                $(".part-plan-div>.table thead").html(HTML.thead_F);


                $.each(_list, function (i, item) {
                    for (var p in item) {
                        if (p.indexOf('Station') != -1) {
                            if ($com.util.format('yyyy-MM-dd', item[p]) < $com.util.format('yyyy-MM-dd', '2010-1-1')) {

                                item[p] = "/";
                            } else {
                                item[p] = ($com.util.format('yyyy-MM-dd', new Date(item[p]).getTime() + 12 * 3600000));
                            }
                        }
                        if (!FORMATTRT_LevelItem[p])
                            continue;
                        item[p] = FORMATTRT_LevelItem[p](item[p]);
                    }
                });


                $(".part-plan-div>.table tbody").html($com.util.template(_list, HTML.TableUserItemNode_F));




            }
        },

    }),

        model.init();
});
