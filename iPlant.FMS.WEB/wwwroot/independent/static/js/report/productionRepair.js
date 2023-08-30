require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {
    var KEYWORD_Device_LIST_item,
        KEYWORD_Device_item,
        FORMATTRT_Device_item,
        DEFAULT_VALUE_Device_item,
        TypeSource_Device_item,
        ItemShow,
        wCloneLine,
        mLineID = -1,
        wFlag = true,
        mData,
        queryAll,
        HTML;

    HTML = {
        TableNode_item: [
            '<tr data-color="">',
            '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td>',
            '<td style="min-width: 50px" data-title="ProductNo" data-value="{{ProductNo}}">{{ProductNo}}</td>',
            '<td style="min-width: 50px" data-title="PartNo" data-value="{{PartNo}}">{{PartNo}}</td>',
            '<td style="min-width: 50px" data-title="LineName" data-value="{{LineName}}">{{LineName}}</td>',
            '<td style="min-width: 50px" data-title="Customer" data-value="{{Customer}}">{{Customer}}</td>',
            '<td style="min-width: 50px" data-title="RealReceiveDate" data-value="{{RealReceiveDate}}">{{RealReceiveDate}}</td>',
            '<td style="min-width: 50px" data-title="RealStartDate" data-value="{{RealStartDate}}">{{RealStartDate}}</td>',
            '<td style="min-width: 50px" data-title="RealFinishDate" data-value="{{RealFinishDate}}">{{RealFinishDate}}</td>',
            '<td style="min-width: 50px" data-title="AddTimes" data-value="{{AddTimes}}">{{AddTimes}}</td>',
            '<td style="min-width: 50px" data-title="AvgTimes" data-value="{{AvgTimes}}">{{AvgTimes}}</td>',
            '</tr>',
        ].join(""),
        TableNode_repair: [
            '<tr data-color="">',
            '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td style="min-width: 50px" data-title="WID" data-value="{{WID}}">{{WID}}</td>',
            '<td style="min-width: 50px" data-title="LineName" data-value="{{LineName}}">{{LineName}}</td>',
            '<td style="min-width: 50px" data-title="YearEnter" data-value="{{YearEnter}}">{{YearEnter}}</td>',
            '<td style="min-width: 50px" data-title="MonthFinsh" data-value="{{MonthFinsh}}">{{MonthFinsh}}</td>',
            '<td style="min-width: 50px" data-title="YearFinsh" data-value="{{YearFinsh}}">{{YearFinsh}}</td>',
            '<td style="min-width: 50px" data-title="AddAllTimes" data-value="{{AddAllTimes}}">{{AddAllTimes}}</td>',
            '<td style="min-width: 50px" data-title="AvgAddAllTimes" data-value="{{AvgAddAllTimes}}">{{AvgAddAllTimes}}</td>',
            '</tr>',
        ].join(""),
    }

    $(function () {
        KEYWORD_Device_LIST_item = [
            "LineID|修程|ArrayOne",
            "CustomerID|配属局段|ArrayOne",
            "ProductID|车型|ArrayOne",
            "PartNo|车号|ArrayOne",
            // "StartTime|开始时间|Date",
            // "EndTime|结束时间|Date",
            "YearTime|选择年份|ArrayOne",
        ];
        KEYWORD_Device_item = {};
        FORMATTRT_Device_item = {};
        DEFAULT_VALUE_Device_item = {};
        TypeSource_Device_item = {
            LineID: [
                {
                    'name': "全部",
                    'value': 0
                },
            ],
            CustomerID: [
                {
                    'name': "全部",
                    'value': 0
                },
            ],
            ProductID: [
                {
                    'name': "全部",
                    'value': 0
                },
            ],
            PartNo: [
                {
                    'name': "全部",
                    'value': "无"
                },
            ],
            YearTime: [

            ],
        };


        $.each(KEYWORD_Device_LIST_item, function (i, item) {
            var detail = item.split("|");
            KEYWORD_Device_item[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_Device_item[detail[0]] = $com.util.getFormatter(TypeSource_Device_item, detail[0], detail[2]);
            }
        });
    });
    model = $com.Model.create({
        name: '生产报表',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();
        },

        events: function () {
            //Enter触发模糊查询事件
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var value = $("#zace-search-Device-item").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-Device-tbody-item").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-Device-tbody-item"), ItemShow, value, "ID");
                }
            });
            //模糊查询
            $("body").delegate("#zace-Device-search", "click", function () {
                var value = $("#zace-search-Device-item").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-Device-tbody-item").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-Device-tbody-item"), ItemShow, value, "ID");
            });

            //条件查询
            $("body").delegate("#zace-search", "click", function () {
                NowTime = $com.util.format("yyyy-MM-dd", new Date());
                var YearArray = NowTime.split('-');
                var default_value = {
                    LineID: 0,
                    CustomerID: 0,
                    ProductID: 0,
                    PartNo: 0,
                    YearTime: YearArray[0],
                    // StartTime: $com.util.format("yyyy", new Date().getTime() - 365 * 24 * 3600 * 1000),
                    // EndTime: $com.util.format("yyyy", new Date().getTime() + 24 * 3600 * 1000),
                    // YearTime: $com.util.format("yyyy", new Date()),
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Device_item, "查询", function (rst) {
                    if (!rst || $.isEmptyObject(rst)) {
                        return false;
                    }
                    YearTime = Number(rst.YearTime);
                    var days = new Date(YearTime, 12, 0);
                    days = days.getDate(); //获取当前日期中月的天数
                    queryAll = {
                        LineID: Number(rst.LineID) == 0 ? -1 : Number(rst.LineID),
                        CustomerID: Number(rst.CustomerID) == 0 ? -1 : Number(rst.CustomerID),
                        ProductID: Number(rst.ProductID) == 0 ? -1 : Number(rst.ProductID),
                        PartNo: rst.PartNo == "无" ? "" : rst.PartNo,
                        StartTime: YearTime + "-01-01",
                        EndTime: YearTime + "-12-" + days,
                    };

                    $("#Year").text(YearTime);
                    $("#NameCar").text("");
                    $("#showText").text("全部");
                    wCloneLine.forEach(element => {
                        if (element.value == queryAll.LineID) {
                            $("#NameCar").text(element.name);
                            $("#showText").text(element.name);
                        }
                    });
                    model.com.refresh();
                    // model.com.getRFOrderList(queryAll, function (res) {
                    //     if (res && res.list) {
                    //         alert("查询成功！");
                    //         wOrderList = res.list.filter(p => p.Status == 5 || p.Status == 6 || p.Status == 7 || p.Status == 8);
                    //         var wTimeAll = $com.util.Clone(wOrderList);
                    //         var moduleTime = "2010-01-01 00:00:00";
                    //         for (var i = 0; i < wTimeAll.length; i++) {
                    //             wTimeAll[i].ID = i + 1;
                    //             if (Date.parse(wTimeAll[i].RealFinishDate) > Date.parse(wTimeAll[i].RealStartDate) && Date.parse(wTimeAll[i].RealFinishDate) > Date.parse(moduleTime)) {
                    //                 wTimeAll[i].AddTimes = model.com.getDays($com.util.format("yyyy-MM-dd", new Date(wTimeAll[i].RealStartDate)), $com.util.format("yyyy-MM-dd", new Date(wTimeAll[i].RealFinishDate)));
                    //             } else if (Date.parse(wTimeAll[i].RealStartDate) > Date.parse(moduleTime) && Date.parse(wTimeAll[i].RealFinishDate) < Date.parse(moduleTime)) {
                    //                 wTimeAll[i].AddTimes = model.com.getDays($com.util.format("yyyy-MM-dd", new Date(wTimeAll[i].RealStartDate)), $com.util.format("yyyy-MM-dd", new Date()));
                    //             } else {
                    //                 wTimeAll[i].AddTimes = 0;
                    //             }

                    //             if (Date.parse(wTimeAll[i].RealFinishDate) > Date.parse(wTimeAll[i].RealReceiveDate) && Date.parse(wTimeAll[i].RealFinishDate) > Date.parse(moduleTime)) {
                    //                 wTimeAll[i].AvgTimes = model.com.getDays($com.util.format("yyyy-MM-dd", new Date(wTimeAll[i].RealReceiveDate)), $com.util.format("yyyy-MM-dd", new Date(wTimeAll[i].RealFinishDate)));
                    //             } else if (Date.parse(wTimeAll[i].RealReceiveDate) > Date.parse(moduleTime) && Date.parse(wTimeAll[i].RealFinishDate) < Date.parse(moduleTime)) {
                    //                 wTimeAll[i].AvgTimes = model.com.getDays($com.util.format("yyyy-MM-dd", new Date(wTimeAll[i].RealReceiveDate)), $com.util.format("yyyy-MM-dd", new Date()));
                    //             } else {
                    //                 wTimeAll[i].AvgTimes = 0;
                    //             }

                    //             if (Date.parse(wTimeAll[i].RealReceiveDate) < Date.parse(moduleTime)) {
                    //                 wTimeAll[i].RealReceiveDate = "-";
                    //             }
                    //             if (Date.parse(wTimeAll[i].RealStartDate) < Date.parse(moduleTime)) {
                    //                 wTimeAll[i].RealStartDate = "-";
                    //             }
                    //             if (Date.parse(wTimeAll[i].RealFinishDate) < Date.parse(moduleTime)) {
                    //                 wTimeAll[i].RealFinishDate = "-";
                    //             }
                    //             // AddAllTimes = AddAllTimes + Item[i].AvgTimes;

                    //         }
                    //         $("#femi-Device-tbody-item").html($com.util.template(wTimeAll, HTML.TableNode_item));
                    //     }
                    // });


                }, TypeSource_Device_item));
            });
            $("body").delegate("#zace-Device-refresh", "click", function () {
                mLineID = -1;
                $("#NameCar").text("");
                $("#showText").text("全部");
                model.com.findYear();
                model.com.refresh();
            });

            //监听select事件
            $("body").delegate("#Select li", "click", function () {
                var $this = $(this);
                wSelectID = Number($this.attr("data-value"));
                wSelectName = $this.find("a").text();
                $("#NameCar").text(wSelectName+'修');
                if (wSelectID == 0) {
                    $("#NameCar").text("");
                }
                $("#showText").text(wSelectName);
                mLineID = wSelectID;
                model.com.refresh();
                // lSelectID = Number($('#lmvt-select-Line option:selected').attr("value"));
            });
            // //检修概况隐藏
            // $("body").delegate("#zace-hide", "click", function () {
            //     $("#zace-show").show();
            //     $("#detail").hide();
            // });
            // //检修概况显示
            // $("body").delegate("#zace-show", "click", function () {
            //     $("#zace-hide").show();
            //     $("#detail").show();
            // });
        },


        run: function () {
            $com.app.loading('数据加载中...');
            StartTime = $com.util.format("yyyy-MM-dd", new Date().getTime() - 30 * 24 * 3600 * 1000);
            EndTime = $com.util.format("yyyy-MM-dd", new Date().getTime() + 24 * 3600 * 1000);

            NowTime = $com.util.format("yyyy-MM-dd", new Date());

            model.com.findYear();
            model.com.getInfo({
                LineID: -1, ShiftDate: NowTime, ShiftPeriod: 4
            }, function (res) {
                wData = res.list;
            });



            model.com.getRFOrderList({ CustomerID: -1, LineID: -1, ProductID: -1, PartNo: "", StartTime: "2000-1-1", EndTime: "2000-1-1" }, function (resrReport) {
                //选择年份
                for (var i = 2011; i < 2100; i++) {
                    TypeSource_Device_item.YearTime.push({
                        name: i,
                        value: i,
                    });
                }
                $.each(resrReport.list, function (i, item) {
                    if (item.Status == 5 || item.Status == 6 || item.Status == 7 || item.Status == 8) {

                        //车号
                        TypeSource_Device_item.PartNo.push({
                            name: item.PartNo,
                            value: item.PartNo,
                            far: 0
                        });
                        // 车型
                        TypeSource_Device_item.ProductID.push({
                            name: item.ProductNo,
                            value: item.ProductID,
                            far: 0
                        });

                        //修程
                        TypeSource_Device_item.LineID.push({
                            name: item.LineName,
                            value: item.LineID,
                            far: 0
                        });

                        //配属局段
                        TypeSource_Device_item.CustomerID.push({
                            name: item.Customer,
                            value: item.CustomerID,
                            far: 0
                        });
                    }
                });
                TypeSource_Device_item.PartNo = model.com.unique(TypeSource_Device_item.PartNo);
                TypeSource_Device_item.ProductID = model.com.unique(TypeSource_Device_item.ProductID);
                TypeSource_Device_item.LineID = model.com.unique(TypeSource_Device_item.LineID);
                TypeSource_Device_item.CustomerID = model.com.unique(TypeSource_Device_item.CustomerID);
                var wkay = [];
                wClone = $com.util.Clone(TypeSource_Device_item.LineID);
                wClone[0].name = "全部";
                // wClone = wClone.filter(p => p.value != 0);
                wCloneLine = $com.util.Clone(TypeSource_Device_item.LineID);
                $.each(wClone, function (i, item) {
                    wkay.push('<li class="device_property" data-value=' + item.value + ' ><a href="javascript:;"><span class="glyphicon glyphicon-star" aria-hidden="true"></span>' + item.name + '</a></li>');
                });
                $('#Select').html(wkay.join(""));
                model.com.refresh();

            });

        },

        com: {
            refresh: function () {
                queryAll.LineID = mLineID;
                model.com.getRFOrderList(queryAll, function (res) {
                    if (res && res.list) {
                        wOrderList = res.list.filter(p => p.Status == 5 || p.Status == 6 || p.Status == 7 || p.Status == 8);
                        mData = $com.util.Clone(wOrderList);

                        var Item = $com.util.Clone(wOrderList);
                        var moduleTime = "2010-01-01 00:00:00";

                        for (var i = 0; i < Item.length; i++) {
                            Item[i].ID = i + 1;
                            if (Date.parse(Item[i].RealFinishDate) > Date.parse(Item[i].RealStartDate) && Date.parse(Item[i].RealFinishDate) > Date.parse(moduleTime)) {
                                Item[i].AddTimes = model.com.getDays($com.util.format("yyyy-MM-dd", new Date(Item[i].RealStartDate)), $com.util.format("yyyy-MM-dd", new Date(Item[i].RealFinishDate)));
                            } else if (Date.parse(Item[i].RealStartDate) > Date.parse(moduleTime) && Date.parse(Item[i].RealFinishDate) < Date.parse(moduleTime)) {
                                Item[i].AddTimes = model.com.getDays($com.util.format("yyyy-MM-dd", new Date(Item[i].RealStartDate)), $com.util.format("yyyy-MM-dd", new Date()));
                            } else {
                                Item[i].AddTimes = 0;
                            }

                            if (Date.parse(Item[i].RealFinishDate) > Date.parse(Item[i].RealReceiveDate) && Date.parse(Item[i].RealFinishDate) > Date.parse(moduleTime)) {
                                Item[i].AvgTimes = model.com.getDays($com.util.format("yyyy-MM-dd", new Date(Item[i].RealReceiveDate)), $com.util.format("yyyy-MM-dd", new Date(Item[i].RealFinishDate)));
                            } else if (Date.parse(Item[i].RealReceiveDate) > Date.parse(moduleTime) && Date.parse(Item[i].RealFinishDate) < Date.parse(moduleTime)) {
                                Item[i].AvgTimes = model.com.getDays($com.util.format("yyyy-MM-dd", new Date(Item[i].RealReceiveDate)), $com.util.format("yyyy-MM-dd", new Date()));
                            } else {
                                Item[i].AvgTimes = 0;
                            }

                            if (Date.parse(Item[i].RealReceiveDate) < Date.parse(moduleTime)) {
                                Item[i].RealReceiveDate = "-";
                            }
                            if (Date.parse(Item[i].RealStartDate) < Date.parse(moduleTime)) {
                                Item[i].RealStartDate = "-";
                            }
                            if (Date.parse(Item[i].RealFinishDate) < Date.parse(moduleTime)) {
                                Item[i].RealFinishDate = "-";
                            }
                            // AddAllTimes = AddAllTimes + Item[i].AvgTimes;

                        }
                        // AvgAddAllTimes = parseInt( AddAllTimes / Item.length);

                        // alert(AddAllTimes + "++" + AvgAddAllTimes);d

                        ItemShow = $com.util.Clone(Item);
                        //             '<td style="min-width: 50px" data-title="AddTimes" data-value="{{AddTimes}}">{{AddTimes}}</td>',
                        // '<td style="min-width: 50px" data-title="AvgTimes" data-value="{{AvgTimes}}">{{AvgTimes}}</td>',
                        $("#femi-Device-tbody-item").html($com.util.template(Item, HTML.TableNode_item));
                        if (wFlag) {
                            model.com.refreshRepair(Item);
                            wFlag = false;
                        }

                        $com.app.loaded();
                    }
                });
            },
            refreshRepair: function (Item) {
                model.com.getInfo({ LineID: -1, ShiftDate: NowTime, ShiftPeriod: 4 }, function (res) {
                    if (res && res.list) {
                        mDataRepair = $com.util.Clone(res.list);

                        var wItemRepairList = $com.util.Clone(res.list);

                        wItemRepairList.forEach(p => {
                            //翻译修程
                            if (wCloneLine.some(q => q.value == p.LineID)) {
                                p.LineName = wCloneLine.filter(q => q.value == p.LineID)[0].name;
                            }

                            var wTempList = Item.filter(q => q.LineID == p.LineID);
                            if (wTempList.length > 0) {
                                //计算总停时
                                p.AddAllTimes = model.com.GetTotalStopTime(wTempList);
                                //计算平均停时
                                p.AvgAddAllTimes = model.com.GetAvgStopTime(wTempList);
                            }
                        });
                        for (var i = 0; i < wItemRepairList.length; i++) {
                            wItemRepairList[i].WID = i + 1;
                        }
                        ItemRepairShow = $com.util.Clone(wItemRepairList);
                        $("#detail").html($com.util.template(wItemRepairList, HTML.TableNode_repair));
                        $com.app.loaded();
                    }
                });
            },
            getMonthLength: function (date) {
                let d = new Date(date)
                // 将日期设置为下月一号
                d.setMonth(d.getMonth() + 1)
                d.setDate('1')
                // 获取本月最后一天
                d.setDate(d.getDate() - 1)
                return d.getDate()
            },
            findYear: function () {
                var NowTime = $com.util.format("yyyy-MM-dd", new Date());
                var monthArray = NowTime.split('-');
                var year = monthArray[0]; //获取当前日期的年份  
                var days = new Date(year, 12, 0);
                days = days.getDate(); //获取当前日期中月的天数

                StartTimeM = year  + "-01-01";
                EndTimeM = year + '-12-' + days;

                $("#Year").text(monthArray[0]);
                queryAll = {
                    LineID: -1,
                    CustomerID: -1,
                    ProductID: -1,
                    PartNo: "",
                    StartTime: StartTimeM,
                    EndTime: EndTimeM,
                };
            },
            //获取检修概况
            getInfo: function (data, fn, context) {
                var d = {
                    $URI: "/RPTProductShift/Info",
                    $TYPE: "get",
                    $SERVER: "/MESAPS",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取订单集合
            getRFOrderList: function (data, fn, context) {
                var d = {
                    $URI: "/OMSOrder/RFOrderList",
                    $TYPE: "get",
                    $SERVER: "/MESAPS",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            unique: function (arr) {
                for (var i = 0; i < arr.length; i++) {
                    for (var j = i + 1; j < arr.length; j++) {
                        if (arr[i].value == arr[j].value) { //第一个等同于第二个，splice方法删除第二个
                            arr.splice(j, 1);
                            j--;
                        }
                    }
                }
                return arr;
            },
            getDays: function (stratDateStr, endDateStr) {
                var stratDateArr, endDateArr, days;
                stratDateArr = stratDateStr.split('-');
                endDateArr = endDateStr.split('-');
                var newDateS = new Date(Date.UTC(stratDateArr[0], stratDateArr[1] - 1, stratDateArr[2]));
                var newDateE = new Date(Date.UTC(endDateArr[0], endDateArr[1] - 1, endDateArr[2]));
                days = parseInt(Math.abs(newDateE - newDateS) / 1000 / 60 / 60 / 24);
                return days;
            },
            GetTotalStopTime: function (wTempList) {
                var wResult = 0;
                try {
                    if (wTempList == null || wTempList.length <= 0) {
                        return wResult;
                    }

                    wTempList.forEach(element => {
                        wResult += element.AvgTimes;
                    });
                } catch (error) {
                    console.log(error);
                }
                return wResult;
            },
            GetAvgStopTime: function (wTempList) {
                var wResult = 0;
                try {
                    if (wTempList == null || wTempList.length <= 0) {
                        return wResult;
                    }

                    wTempList.forEach(element => {
                        wResult += element.AvgTimes;
                    });

                    wResult = parseInt(wResult / wTempList.length);
                } catch (error) {
                    console.log(error);
                }
                return wResult;
            }
        }
    }),

        model.init();

});