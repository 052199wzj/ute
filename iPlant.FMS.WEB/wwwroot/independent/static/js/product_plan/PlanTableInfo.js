require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($zace, $com) {


    var OrderNo = "",
        PartNo = "",
        LineName = "",
        ProductNo = "",
        OrderID = 0,
        Tree,
        OrderList,
        PartList,
        TreeNumber,
        PTD = "",
        StartTime,
        EndTime,
        cat,
        //待回送
        Willback,
        //C5C6
        RanderOrderList,
        LineID,
        //全部显示
        AllData,
        //在修
        Doing,
        //已出厂
        HasOut,

        KEYWORD_Level_LIST,
        KEYWORD_Level,
        NowMonth,
        FORMATTRT_Level,
        DEFAULT_VALUE_Level,
        TypeSource_Level,

        RFOrderList,

        OnceTemp = true,

        HTML;

    (function () {
        KEYWORD_Level_LIST = [
            "Month|月份|ArrayOne",
        ];
        KEYWORD_Level = {};
        FORMATTRT_Level = {};

        DEFAULT_VALUE_Level = {

        };

        TypeSource_Level = {
            Month: []
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

    HTML = {
        //工位头部模板
        PartTP: [
            '<th style="min-width: 80px;">{{StationName}}</th>',
        ].join(""),

        //月详情对应第一块模板
        MonthFristTemplate: [
            '<tr style="font-size: 18px;color:#3E90C6">',
                '<td rowspan="3" style="font-size: 24px;">{{PartNo}}</td>',
                '<td style="font-size: 18px;color:#3E90C6">计划完工</td>',
                '{{Secendplan}}',
            '</tr>',
            '<tr>',
            '    <td style="font-size: 18px;color:green">实际完工</td>',
                '{{Secendrea}}',
            '</tr>',
            '<tr style="">',
                '<td style="font-size: 18px;color:red">落后计划</td>',
                '{{Secenddelay}}',
            '</tr>',
        ].join(""),

        //修程对应第一块模板
        PlanFristTemplate: [
            '<tr  data-partNo={{PartNo}} style="font-size: 18px;color:#3E90C6">',
                '<td class="lmvt-compareGantt"  rowspan="2" style="font-size: 24px;">{{PartNo}}</td>',
                '<td class="lmvt-showNeed" style="font-size: 18px;color:#3E90C6;height:51px">计划完工</td>',
                '{{Secendplan}}',
            '</tr>',
            '<tr data-partNo={{PartNo}} style="font-size: 18px;color:green">',
            '    <td class="lmvt-showNeed" style="font-size: 18px;color:green;height:51px">实际完工</td>',
                '{{Secendrea}}',
            '</tr>',
            '<tr data-partNo={{PartNo}} style="font-size: 18px;color:red">',
                '<td class="lmvt-LineID" data-partNo={{PartNo}} rowspan="1" style="font-size: 24px;color:#3E90C6">{{Line}}</td>',
                '<td class="lmvt-showNeed" style="font-size: 18px;color:red">落后计划</td>',
                '{{Secenddelay}}',
            '</tr>',
        ].join(""),
        //修程对应第二块模板
        PlanSecendTemplate: [
            '<tr> ',
                '<td class="lmvt-plan-{{LineID}}" style="font-size: 18px;color:#3E90C6;height:51px">计划完工</td>',
                '{{Secendplan}}',
            '</tr>',
            '<tr style="">',
                '<td class="lmvt-rea-{{LineID}}" style="font-size: 18px;color:green;height:51px">实际完工</td>',
                '{{Secendrea}}',
            '</tr>',
            '<tr style="">',
                '<td class="lmvt-delay-{{LineID}}" style="font-size: 18px;color:red">落后计划</td>',
                '{{Secenddelay}}',
            '</tr>',
        ].join(""),
        NumberTemplate: [
            '<td style="font-size: 15px;background-color:{{color}};color:{{fontColor}}">{{Number}}</td>',
        ].join(""),

        TDTP: [
            '<td>{{PartName}}</td>',
        ].join(""),
        PartNameTP: [
            '<tr data-color=""><td>{{LineName}}</td>{{PartList}}</tr>',
        ].join(""),


        ReaTD: [
          '<td>{{reaNumber}}</td>',
        ].join(""),
        DelayTD: [
          '<td>{{delayNumber}}</td>',
        ].join(""),

        PlanTR: [
            '<tr><td>{{TypeName}}</td>{{CountList}}</tr>',
        ].join(""),
    };

    Tree = [
    ];

    TreeNumber = [

    ];

    model = $com.Model.create({
        name: 'LOCO',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            //window.parent.randerMonthReport = function (wStartTime, wEndTime) {
            //    if (!wStartTime) {
            //        wStartTime = $com.util.format("yyyy-MM-dd", new Date());
            //    }
            //    if (!wEndTime) {
            //        wEndTime = $com.util.format("yyyy-MM-dd", new Date().getTime() + 24 * 60 * 60 * 1000);
            //    }
            //    model.com.rander(wStartTime, wEndTime);
            //};
            //
            //查询
            $("body").delegate("#lmvt-search", "click", function () {

                var default_value = {
                    Month: NowMonth
                }

                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    var num = (rst.Month);

                    NowMonth = num;

                    StartTime = $com.util.format("yyyy-MM-01", new Date().getFullYear() + "-" + num);

                    EndTime = new Date().getFullYear() + '-' + num + '-' + new Date(new Date().getFullYear(), num, 0).getDate();

                    model.com.rander(StartTime, EndTime, Willback, LineID, AllData, Doing, HasOut);

                    var Str = "(" + (new Date().getFullYear()) + "年" + NowMonth + "月" + ")";
                    $(".lmvt-Year").text(Str);

                }, TypeSource_Level));
            });
            //模糊查询
            $("body").delegate("#lmvt-LikeString-Search", "click", function () {
                var value = $("#alfie-search-Device-item").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $(".lmvt-order-body").children("tr").show();
                else
                    $com.table.filterByLikeString($(".lmvt-order-body"), RanderOrderList, value, "Number");
            });
            //已出厂
            $("body").delegate("#lmvt-out", "click", function () {
                AllData = false;
                Willback = false;
                Doing = false;
                HasOut = true;

                model.com.rander(StartTime, EndTime, Willback, LineID, AllData, Doing, HasOut);
                $(".lmvt-changeOption").text("已出厂");
            });
            //在修中
            $("body").delegate("#lmvt-doing", "click", function () {
                AllData = false;
                Willback = false;
                Doing = true;
                HasOut = false;
                model.com.rander(StartTime, EndTime, Willback, LineID, AllData, Doing, HasOut);
                $(".lmvt-changeOption").text("在修中");
            });
            //待回送查看
            $("body").delegate("#lmvt-back", "click", function () {
                AllData = false;
                Willback = true;
                Doing = false;
                HasOut = false;


                model.com.rander(StartTime, EndTime, Willback, LineID, AllData, Doing, HasOut);
                $(".lmvt-changeOption").text("待回送");
            });
            //全部
            $("body").delegate("#lmvt-AllData", "click", function () {
                AllData = true;
                Willback = false;
                Doing = false;
                HasOut = false;

                model.com.rander(StartTime, EndTime, Willback, LineID, AllData, Doing, HasOut);
                $(".lmvt-changeOption").text("全部");
            });
            //C5修程
            $("body").delegate("#lmvt-five", "click", function () {

                LineID = 1;

                model.com.rander(StartTime, EndTime, Willback, LineID, AllData, Doing, HasOut);
                $(".lmvt-changeLine").text("C5");
            });
            //C6修程
            $("body").delegate("#lmvt-six", "click", function () {

                LineID = 2;

                model.com.rander(StartTime, EndTime, Willback, LineID, AllData, Doing, HasOut);
                $(".lmvt-changeLine").text("C6");
            });
            //全部修程
            $("body").delegate("#lmvt-AllLine", "click", function () {

                LineID = 0;

                model.com.rander(StartTime, EndTime, Willback, LineID, AllData, Doing, HasOut);
                $(".lmvt-changeLine").text("全部");
            });

            window.setFunctionTrigger("randerMonthReport", function (obj) {

                if (!obj.startTime) {
                    obj.startTime = $com.util.format("yyyy-MM-dd", new Date());
                }
                if (!obj.endTime) {
                    obj.endTime = $com.util.format("yyyy-MM-dd", new Date().getTime() + 24 * 60 * 60 * 1000);
                }
                StartTime = obj.startTime;
                EndTime = obj.endTime;

                NowMonth = new Date(obj.startTime).getMonth() + 1;

                model.com.rander(obj.startTime, obj.endTime, Willback, LineID, AllData, Doing, HasOut);
                var Str = "(" + (new Date().getFullYear()) + "年" + (NowMonth) + "月" + ")";

                $(".lmvt-Year").text(Str);
            });

            $("body").delegate(".lmvt-order-body tr", "dblclick", function () {
                var $this = $(this),
                    partNo = $this.attr("data-partNo");
                $.each(RanderOrderList, function (i, item) {
                    if (partNo == item.PartNo) {
                        model.com.getOMSInfo({ ID: item.List[0].OrderID }, function (res) {
                            var vdata = { 'header': '甘特对比报表', 'href': './product_plan/OrderReality.html?OrderID=' + item.List[0].OrderID + "&OrderNo=" + res.info.OrderNo + "&ProductNo=" + res.info.ProductNo + "&PartNo=" + item.List[0].PartNo, 'id': 'OrderReality', 'src': './static/images/menu/newfactoryModel/techniquePart.png' };
                            window.parent.iframeHeaderSet(vdata);
                            window.callFunctionTrigger("RanderGantt", { OrderID: item.List[0].OrderID, OrderNo: res.info.OrderNo, ProductNo: res.info.ProductNo, PartNo: item.List[0].PartNo });
                        });

                    }
                });
            });
            //window.setFunctionTrigger("randerMonthReport", function (wStartTime, wEndTime) {
            //    model.com.rander(wStartTime, wEndTime);
            //});

        },

        run: function () {
            //var StartTime = $com.util.format("yyyy", new Date()),
            //    EndTime = $com.util.format("yyyy-MM-dd", new Date());
            StartTime = model.query.startTime;
            EndTime = model.query.endTime;

            var Str = "(" + (new Date().getFullYear()) + "年" + (new Date().getMonth() + 1) + "月" + ")";
            $(".lmvt-Year").text(Str);

            NowMonth = new Date().getMonth() + 1;

            for (var i = 1; i <= NowMonth; i++) {
                TypeSource_Level.Month.push(
                    {
                        name: i + "月",
                        value: i
                    }
                );
            }

            //C5C6
            LineID = 0;
            //全部显示
            AllData = true;

            Willback = false;
            Doing = false;
            HasOut = false;

            OnceTemp = true;
            model.com.rander(StartTime, EndTime, Willback, LineID, AllData, Doing, HasOut);

        },

        com: {
            //冒泡排序
            bubble: function (arr) {
                for (var i = 0; i < arr.length - 1; i++) {
                    for (var j = 0; j < arr.length - 1 - i; j++) {
                        //Status狀態小的放在前面
                        if (arr[j].Order.Status > arr[j + 1].Order.Status) {
                            var temp = arr[j];
                            arr[j] = arr[j + 1];
                            arr[j + 1] = temp;
                        }
                    }

                }
                return arr
            },

            rander: function (StartTime, EndTime, Willback, LineID, AllData, Doing, HasOut) {
                model.com.getRPTOrderPartAll({ LineID: -1, StartTime: StartTime, EndTime: EndTime }, function (res) {
                    //这里是不是不用每次都调用接口

                    model.com.getWorkAreaAll({ ID: -1, Active: -1 }, function (res1) {
                        res1.list.sort(function (a, b) { return Number(a.OrderNum) - Number(b.OrderNum) });
                        var OrderList = [];
                        if (!AllData) {
                            $.each(res.list, function (i, item) {
                                var OrderStatus = item.Order.Status;
                                if (Doing) {
                                    if (OrderStatus == 2 || OrderStatus == 3 || OrderStatus == 4) {
                                        if (LineID != 0) {
                                            if (LineID == item.LineID) {
                                                OrderList.push(item);
                                            }
                                        } else {
                                            OrderList.push(item);
                                        }

                                    }

                                } else if (Willback) {
                                    if (OrderStatus == 5 || OrderStatus == 6 || OrderStatus == 7) {
                                        if (LineID != 0) {
                                            if (LineID == item.LineID) {
                                                OrderList.push(item);
                                            }
                                        } else {
                                            OrderList.push(item);
                                        }
                                    }
                                } else if (HasOut) {
                                    if (OrderStatus == 8) {
                                        if (LineID != 0) {
                                            if (LineID == item.LineID) {
                                                OrderList.push(item);
                                            }
                                        } else {
                                            OrderList.push(item);
                                        }
                                    }
                                }
                            });
                        } else {
                            $.each(res.list, function (i, item) {
                                if (LineID != 0) {
                                    if (LineID == item.LineID) {
                                        OrderList.push(item);
                                    }
                                } else {
                                    OrderList.push(item);
                                }
                            });
                        }

                        PartList = [];
                        $.each(res1.list, function (i, item) {
                            if (item.Active == 1 && item.WorkAreaID > 0) {
                                PartList.push(item);
                            }
                        });

                        if (OnceTemp) {
                            $(".lmvt-order-thead").append($com.util.template(PartList, HTML.PartTP));
                            OnceTemp = false;
                        }
                        //排序
                        OrderList = model.com.bubble(OrderList);

                        var obj = {},
                            cat = [],
                            temp = true;
                        $.each(OrderList, function (i, item) {

                            if (!obj[item.PartNo]) {
                                obj[item.PartNo] = {};
                                cat.push({
                                    PartNo: item.PartNo,
                                    List: []
                                })
                            }
                            $.each(cat, function (j, jtem) {
                                if (jtem.PartNo == item.PartNo) {
                                    jtem.List.push(item);
                                }
                            });
                        });

                        $.each(cat, function (m, mtem) {

                            var RanderTP = {};
                            RanderTP.Plan = [];
                            RanderTP.Rea = [];
                            RanderTP.Delay = [];
                            var index = [];
                            $.each(PartList, function (i, item) {
                                $.each(mtem.List, function (j, jtem) {
                                    if (item.StationID == jtem.PartID) {
                                        var ISNewMonth = new Date(jtem.PlantDate).getMonth();
                                        if (ISNewMonth == new Date(StartTime).getMonth()) {
                                            RanderTP.Plan.push({
                                                Number: $com.util.format("MM-dd", jtem.PlantDate),
                                                color: "#3E90C6",
                                                fontColor: "#FFFFFF"
                                            });
                                            if (jtem.LaterDay > 0) {
                                                RanderTP.Rea.push({
                                                    Number: $com.util.format("yyyy-MM-dd", jtem.RealDate) == "2000-01-01" ? " " : $com.util.format("MM-dd", jtem.RealDate),
                                                    color: "#b3374c",
                                                    fontColor: "#FFFFFF"
                                                });
                                            } else {
                                                RanderTP.Rea.push({
                                                    Number: $com.util.format("yyyy-MM-dd", jtem.RealDate) == "2000-01-01" ? " " : $com.util.format("MM-dd", jtem.RealDate),
                                                    color: "seagreen",
                                                    fontColor: "#FFFFFF"
                                                });
                                            }

                                            RanderTP.Delay.push({
                                                Number: Number(jtem.LaterDay <= 0 ? 0 : jtem.LaterDay),
                                                color: "",
                                                fontColor: "#000000"
                                            });
                                        } else {
                                            RanderTP.Plan.push({
                                                Number: $com.util.format("MM-dd", jtem.PlantDate),
                                                color: "",
                                                fontColor: "#000000"
                                            });

                                            RanderTP.Rea.push({
                                                Number: $com.util.format("yyyy-MM-dd", jtem.RealDate) == "2000-01-01" ? " " : $com.util.format("MM-dd", jtem.RealDate),
                                                color: "",
                                                fontColor: "#000000"
                                            });


                                            RanderTP.Delay.push({
                                                Number: Number(jtem.LaterDay <= 0 ? 0 : jtem.LaterDay),
                                                color: "",
                                                fontColor: "#000000"
                                            });
                                        }
                                        index.push(item.ID);
                                        mtem.Line = jtem.Line;
                                        return true;
                                    }
                                });
                            });

                            var arr1 = $com.util.Clone(PartList);
                            var arr2 = $com.util.Clone(index);

                            var arr = model.com.getNewList(arr1, arr2);
                            $.each(arr, function (j, jtem) {
                                $.each(PartList, function (i, item) {
                                    if (item.ID == jtem.ID) {
                                        RanderTP.Plan.splice(i, 0, { Number: "" });
                                        RanderTP.Rea.splice(i, 0, { Number: "" });
                                        RanderTP.Delay.splice(i, 0, { Number: "" });
                                        return true;
                                    }
                                });
                            });


                            mtem.Secendplan = $com.util.template(RanderTP.Plan, HTML.NumberTemplate);
                            mtem.Secendrea = $com.util.template(RanderTP.Rea, HTML.NumberTemplate);
                            mtem.Secenddelay = $com.util.template(RanderTP.Delay, HTML.NumberTemplate);


                        });

                        RanderOrderList = $com.util.Clone(cat);

                        $(".lmvt-order-body").html($com.util.template(cat, HTML.PlanFristTemplate));

                    });
                });
            },
            DateDiff: function (sDate1, sDate2) {
                var aDate, oDate1, oDate2, iDays
                aDate = sDate1.split("-")
                oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]) //转换为12-18-2006格式 
                aDate = sDate2.split("-")
                oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
                iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24) //把相差的毫秒数转换为天数 
                return iDays
            },
            //查询当月订单
            getRFOrderList: function (data, fn, context) {
                var d = {
                    $URI: "/OMSOrder/RFOrderList",
                    $TYPE: "get",
                    $SERVER: '/MESAPS'
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询信息
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
            //全年统计信息
            getRPTCustomerShiftInfo: function (data, fn, context) {
                var d = {
                    $URI: "/RPTCustomerShift/Info",
                    $TYPE: "get",
                    $SERVER: '/MESAPS'
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //在厂局段信息
            getRPTCustomerShiftAll: function (data, fn, context) {
                var d = {
                    $URI: "/RPTCustomerShift/All",
                    $TYPE: "get",
                    $SERVER: '/MESAPS'
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
                        if (_source[i].ID == set_data[j]) {
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





            //月详情报表
            getRPTOrderPartAll: function (data, fn, context) {
                var d = {
                    $URI: "/RPTOrderPart/All",
                    $TYPE: "get",
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




            //查询订单详情
            getOMSInfo: function (data, fn, context) {
                var d = {
                    $URI: "/OMSOrder/Info",
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

                if (days < 1) {
                    days = 1;
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
