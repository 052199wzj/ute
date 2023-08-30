require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/Vue', '../static/utils/js/base/echarts.min'], function ($zace, $com, Vue, echarts) {

    (function () {
        $(".ds-search-top-contain").resize(function (e) {
            var $this = $(this);
            var _SearchShowMode = $this.attr("data-show-mode");

            if (_SearchShowMode == 0) {
                var _MaxLength = this.offsetWidth - 10;
                var _Length = $this.children(".ds-search-btn-group")[0].offsetWidth + 60;
                $this.children(".ds-search-item-group:not(.ds-search-btn-group)").each(function (i, item) {
                    _Length += $(item).width();
                    if (_Length >= _MaxLength) {
                        $(item).hide();
                    } else {
                        $(item).show();
                    }
                });
                if (_Length >= _MaxLength) {
                    $("#lmvt-resetZK").show();
                    $("#lmvt-resetSQ").hide();
                } else if (_Length < _MaxLength) {
                    $("#lmvt-resetSQ").hide();
                    $("#lmvt-resetZK").hide();
                }
            } else {
                $this.children(".ds-search-item-group:not(.ds-search-btn-group)").each(function (i, item) {
                    $(item).show();
                });
                $("#lmvt-resetZK").hide();
                $("#lmvt-resetSQ").show();
            }
            var wTarget = this.offsetHeight;
            // 设置div
            var height = "100% - " + wTarget + "px";
            $this.closest(".ds-search-top").css("height", wTarget + "px");
            $this.closest(".ds-search-top").next(".ds-contain-middle").css("height", "calc( " + height + ")");
        });
    })();

    var app = new Vue({
        el: '#lmvt-vueApp',
        data: {

           
            StartTime: $com.util.format("yyyy-MM-dd", new Date().getTime() - 7 * 3600000 * 24),
            EndTime: $com.util.format("yyyy-MM-dd", new Date().getTime() + 0 * 3600000 * 24),
           
            //车间集合
            WorkShopList: [],
            WorkShopID: 1,

            LineID: 1,

            DateList: [],
            //元数据
            GradeSource: [],
            //班组
            TeamList: [],

            NowTime: new Date(),
 
 
         

            AllMonList: [],

            //直通率
            RolledList: [],
            //投入数
            IncomList: [],
            //产出数
            OutList: [],
            //趋势
            LineList: [],
            option: [],
        },
        beforeCreate() {
            _this = this;
        },

        created: function () {
            var VueThis = this;

            $(document).ready(function () {
                //_this.StartTime = $com.util.format("yyyy-MM-dd hh:mm", new Date().getTime() - 7 * 3600000 * 24);
                //_this.EndTime = $com.util.format("yyyy-MM-dd hh:mm", new Date());
                $("#lmvt-startTime").datetimepicker({
                    format: 'yyyy-mm-dd',//显示格式
                    // startView: 2,
                    minView: 2,
                    maxView: 2,
                    language: 'zh-CN',
                    autoclose: 1,//选择后自动关闭
                    clearBtn: false,//清除按钮
                }).on('changeDate', function (ev) {
                    _this.StartTime = $("#lmvt-startTime").val();

                    $("#lmvt-endTime").datetimepicker("setStartDate", _this.StartTime.toString("yyyy-MM-dd"));
                });
                $("#lmvt-endTime").datetimepicker({
                    format: 'yyyy-mm-dd',//显示格式
                    // startView: 2,
                    minView: 2,
                    maxView: 2,
                    language: 'zh-CN',
                    autoclose: 1,//选择后自动关闭
                    clearBtn: false,//清除按钮
                }).on('changeDate', function (ev) {

                    _this.EndTime = $("#lmvt-endTime").val();
                    $("#lmvt-startTime").datetimepicker("setEndDate", _this.EndTime.toString("yyyy-MM-dd"));
                });
            });
            VueThis.refresh();
            // VueThis.getFMCLine({ FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0 }, function (resP) {
            //     if (!resP)
            //         return;

            //     $.each(resP.list, function (i, item) {
            //         TypeSource_Level.LineID.push({
            //             value: item.ID,
            //             name: item.Name
            //         });
            //     });
            //     TypeSource_Level_Order.FactoryID = TypeSource_Level.LineID;
            //     VueThis.getCustomer({ active: 2 }, function (resP) {
            //         if (!resP)
            //             return;

            //         $.each(resP.list, function (i, item) {
            //             TypeSource_Level.BureauSectionID.push({
            //                 value: item.ID,
            //                 name: item.CustomerName
            //             });
            //         });
            //         TypeSource_Level_Order.CustomerID = TypeSource_Level.BureauSectionID;
            //         VueThis.getFPCProduct({ ProductTypeID: 0, BusinessUnitID: 0 }, function (resP) {
            //             if (!resP)
            //                 return;

            //             $.each(resP.list, function (i, item) {

            //                 if (item.Active == 1) {
            //                     TypeSource_Level.ProductID.push({
            //                         value: item.ID,
            //                         name: item.ProductNo
            //                     });
            //                 }

            //             });
            //             TypeSource_Level_Order.BusinessUnitID = TypeSource_Level.ProductID;


            //             $(document).ready(function () {
            //                 //_this.StartTime = $com.util.format("yyyy-MM-dd hh:mm", new Date().getTime() - 7 * 3600000 * 24);
            //                 //_this.EndTime = $com.util.format("yyyy-MM-dd hh:mm", new Date());
            //                 $("#lmvt-startTime").datetimepicker({
            //                     format: 'yyyy-mm-dd',//显示格式
            //                     // startView: 2,
            //                     minView: 2,
            //                     maxView: 2,
            //                     language: 'zh-CN',
            //                     autoclose: 1,//选择后自动关闭
            //                     clearBtn: false,//清除按钮
            //                 }).on('changeDate', function (ev) {
            //                     _this.StartTime = $("#lmvt-startTime").val();

            //                     $("#lmvt-endTime").datetimepicker("setStartDate", _this.StartTime.toString("yyyy-MM-dd"));
            //                 });
            //                 $("#lmvt-endTime").datetimepicker({
            //                     format: 'yyyy-mm-dd',//显示格式
            //                     // startView: 2,
            //                     minView: 2,
            //                     maxView: 2,
            //                     language: 'zh-CN',
            //                     autoclose: 1,//选择后自动关闭
            //                     clearBtn: false,//清除按钮
            //                 }).on('changeDate', function (ev) {

            //                     _this.EndTime = $("#lmvt-endTime").val();
            //                     $("#lmvt-startTime").datetimepicker("setEndDate", _this.EndTime.toString("yyyy-MM-dd"));
            //                 });

            //                 _this.getFMCWorkShop({}, function (res) {

            //                     $("#WorkShopSelect").ready(function () {
            //                         $("#WorkShopSelect").selectpicker('refresh');
            //                     });

            //                     _this.WorkShopList = res.list;


            //                 });


            //             });
            //         });
            //     });
            // });
        },

        methods: {

            //获取所有的日期
            getDateList: function () {

                var start = new Date(_this.StartTime.replace(/-/g, "/"));

                var end = new Date(_this.EndTime.replace(/-/g, "/"));
                _this.DateList = [];
                do {

                    _this.DateList.push(start.getFullYear() + "-" + (start.getMonth() + 1) + "-" + start.getDate());
                    start.setDate(start.getDate() + 1);

                } while (end >= start)

            },

            //查询
            Search: function () {
                $com.app.loading('数据加载中！！');

                // _this.ProductNo = $("#ProductNoSelect").find("option:selected").val();

                _this.refresh();

                // $com.app.loaded();
            },

            //获取所有的日期
            getDateList: function () {

                var start = new Date(_this.StartTime.replace(/-/g, "/"));

                var end = new Date(_this.EndTime.replace(/-/g, "/"));
                _this.DateList = [];
                do {

                    _this.DateList.push(start.getFullYear() + "-" + (start.getMonth() + 1) + "-" + start.getDate());
                    start.setDate(start.getDate() + 1);

                } while (end >= start)

            },
            //查看详情
            refresh: function () {

                _this.getDateList();




                var StartShiftID = $com.util.format("yyyyMMdd", _this.StartTime),
                    EndShiftID = $com.util.format("yyyyMMdd", _this.EndTime);

                // //直通率
                // RolledList: [],
                //     //投入数
                //     IncomList: [],
                //         //产出数
                //         OutList: [],
                //             //趋势
                //             LineList: [],

                _this.RolledList = [];
                _this.IncomList = [];
                _this.OutList = [];
                _this.LineList = [];

                _this.getSFCTaskPartShiftAll({ WorkShopID: _this.WorkShopID, LineID: _this.LineID, StartShiftID: StartShiftID, EndShiftID: EndShiftID }, function (res) {
                    if (res.list) {
                        $.each(res.list, function (i, item) {
                            var RolledList = 0;
                            if (item.FQTYDone == 0) {
                                RolledList = 0;
                            } else {
                                RolledList = Number((item.FQTYDone) / (item.FQTYDone + item.FQTYBad)).toFixed(0) * 100;
                            }

                            _this.RolledList.push(RolledList);
                            _this.IncomList.push(item.FQTYDone + item.FQTYBad);
                            _this.OutList.push(item.FQTYDone);
                            _this.LineList.push(item.FQTYDone);
                        });

                        $(function () {
                            initData();
                        });

                        //生成数据
                        function initData() {
                            buildChart();
                        }

                        //生成Echarts图形
                        function buildChart() {
                            var chart = document.getElementById('barsDemo');
                            var echart = echarts.init(chart);
                            _this.option = {
                                //头部
                                title: {
                                    text: '160V生产信息报表',
                                    x: '100',
                                    backgroundColor: 'rgba(0,0,0,0)', //标题背景颜色，默认'rgba(0,0,0,0)'透明
                                    borderColor: '#999',
                                    textStyle: {
                                        color: "#C7001A"
                                    }
                                },
                                //滑动组件
                                dataZoom: [//滑动条
                                    {
                                        type: 'slider',
                                        show: true,
                                        xAxisIndex: [0],
                                        start: 0,
                                        end: 100
                                    },
                                    // {
                                    //     type: 'slider',
                                    //     show: true,
                                    //     yAxisIndex: [0],
                                    //     left: '93%',
                                    //     start: 29,
                                    //     end: 36
                                    // }
                                ],

                                tooltip: {
                                    trigger: 'axis',
                                    axisPointer: {
                                        type: 'cross',
                                        crossStyle: {
                                            color: '#999'
                                        }
                                    }
                                },
                                toolbox: {
                                    feature: {
                                        dataView: { show: true, readOnly: true },
                                        magicType: { show: true, type: ['line', 'bar'] },
                                        restore: { show: true },
                                        saveAsImage: { show: true }
                                    },
                                    x: $("#barsDemo").width() - 250,
                                },
                                legend: {
                                    data: ['日产量趋势', '直通率', '投入数', '产出数']
                                },
                                xAxis: [
                                    {
                                        type: 'category',
                                        data: _this.DateList,
                                        axisPointer: {
                                            type: 'shadow'
                                        }
                                    }
                                ],
                                yAxis: [
                                    {
                                        type: 'value',
                                        name: '数量',
                                        min: 0,
                                        max: 500,
                                        interval: 60,
                                        axisLabel: {
                                            formatter: '{value} 个'
                                        }
                                    },
                                    {
                                        type: 'value',
                                        name: '百分比',
                                        min: 0,
                                        max: 100,
                                        interval: 20,
                                        axisLabel: {
                                            formatter: '{value} %'
                                        }
                                    }
                                ],
                                series: [
                                    {
                                        name: '直通率',
                                        type: 'bar',
                                        data: _this.RolledList,
                                        ID: 1,
                                        yAxisIndex: 1,
                                        itemStyle: {
                                            normal: {
                                                // color: "#91AB65",
                                                label: {
                                                    show: true,		//开启显示
                                                    position: 'top',	//在上方显示
                                                    textStyle: {	    //数值样式
                                                        // color: '#91AB65',
                                                        fontSize: 16
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        name: '投入数',
                                        type: 'bar',
                                        data: _this.IncomList,
                                        ID: 2,
                                        yAxisIndex: 0,
                                        itemStyle: {
                                            normal: {
                                                // color: "#008B8B",
                                                label: {
                                                    show: true,		//开启显示
                                                    position: 'top',	//在上方显示
                                                    textStyle: {	    //数值样式
                                                        // color: '#008B8B',
                                                        fontSize: 16
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        name: '产出数',
                                        type: 'bar',
                                        data: _this.OutList,
                                        ID: 3,
                                        yAxisIndex: 0,
                                        itemStyle: {
                                            normal: {
                                                // color: "#6495ED",
                                                label: {
                                                    show: true,		//开启显示
                                                    position: 'top',	//在上方显示
                                                    textStyle: {	    //数值样式
                                                        color: '#6495ED',
                                                        fontSize: 16
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        name: '日产量趋势',
                                        type: 'line',
                                        yAxisIndex: 1,
                                        data: _this.LineList,
                                        ID: 4,
                                        yAxisIndex: 0,
                                        itemStyle: {
                                            normal: {
                                                // color: "#FF7F50",
                                                label: {
                                                    show: true,		//开启显示
                                                    position: 'left',	//在上方显示
                                                    textStyle: {	    //数值样式
                                                        // color: 'black',
                                                        fontSize: 16
                                                    }
                                                }
                                            }
                                        }
                                    }
                                ]
                            };
                            echart.setOption(_this.option);
                            $com.app.loaded();
                        }


                    } else {
                        alert("未查询到信息");
                        $com.app.loaded();
                    }
                });


                //$com.app.loading('数据加载中！！');
                // ProductID: _this.ProductID, ProductNo: _this.ProductNo, MaterialNo: _this.MaterialNo
                // this.getSFCTaskIPTTableAll({ ModulePartNo: _this.ModuleNo, LineID: 1, TaskType: 6, StartTime: _this.StartTime, EndTime: _this.EndTime }, function (resP) {
                //     if (!resP)
                //         return;
                //     if (resP && resP.list) {

                //         // if()
                //         var Grade = $com.util.Clone(resP.list);
                //         _this.GradeSource = $com.util.Clone(resP.list);
                //         $.each(Grade, function (i, item) {

                //             item.WID = i + 1;
                //             item.Badge = " ";

                //             //item.CreatorID = UserAll.filter((item) => { return item.ID == item.CreatorID })[0].Name;
                //             //item.EditorID = UserAll.filter((item) => { return item.ID == item.EditorID })[0].Name;
                //             item.CreateTime = $com.util.format("yyyy-MM-dd", item.CreateTime);
                //             item.EditTime = $com.util.format("yyyy-MM-dd", item.EditTime);
                //         });

                //         // _this.Grade = Grade;

                //         _this.AllMonList = Grade;

                //         $page.init($(".table-partApprovalCheck"), Grade, "", function (res) {
                //             _this.Grade = res;
                //         });
                //     };

                //     $com.app.loaded();

                // });

            },

            reset: function () {

            },

            //
            getSFCTaskPartShiftAll: function (data, fn, context) {
                var d = {
                    $URI: "/SFCTaskPart/ShiftAll",
                    $TYPE: "get",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
        },

    });

});