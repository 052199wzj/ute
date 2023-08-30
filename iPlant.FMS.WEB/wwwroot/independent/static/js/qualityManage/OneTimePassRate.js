require(
    [
        "../static/utils/js/jquery-3.1.1",
        "../static/utils/js/base/base",
        '../static/utils/js/base/paging',
        "../static/utils/vue/mixins/tools",
        "../static/utils/vue/mixins/baseComponents",
        "../static/utils/js/base/echarts",
    ],
    function ($alfie, $com, $page, $mixinsTools, $baseComponents,$echarts) {
        /**
         *  请求列表
         *  $URI: string    请求地址 - 必填
         *  type: string   请求类型 - 必填
         *  errMsg:string   错误提示 - 可填 默认值为 httpErrMsg[$TYPE]
         */
        var uriList = {
            getProduct: { type: "get", url: "/FPCProduct/GetAll" },
            getChart: { type: "get", url: "/QMSQuality/GetOneTimePassRateForChart" },
            getData: { type: "get", url:"/QMSQuality/GetOneTimePassRate" }
        };
        /**
         * 请求默认提示语
         * key: 请求类型
         * val: 提示文本
         */
        var httpErrMsg = {
            Get: "获取失败，请检查网络",
            get: "获取失败，请检查网络",
            Post: "提交失败，请检查网络",
            post: "提交失败，请检查网络",
        };

        /***
         * 公用请求方法
         * @param uriName   请求名称
         * @param data      数据
         * @param fn        回调函数
         * @param context   上下文
         */
        function http(uriName, data, fn, context) {
            var u = uriList[uriName];
            var d = { $URI: u.url, $TYPE: u.type };

            function err() {
                $com.app.tip(u.errMsg || httpErrMsg[u.type]);
            }

            $com.app.ajax($.extend(d, data), fn, err, context);
        };

        var tools = {
            // 获取周
            getWeek: function (dt) {
                var d1 = new Date(dt);
                var d2 = new Date(dt);
                d2.setMonth(0);
                d2.setDate(1);
                var rq = d1 - d2;
                var days = Math.ceil(rq / (24 * 60 * 60 * 1000));
                var num = Math.ceil(days / 7);
                return num;
            },
            // 处理chart时间格式
            cartDateFormat: function (statType, date) {
                date = new Date(date);
                switch (statType) {
                    case 2:
                        return $com.util.format("yyyy", date) + "年第" + tools.getWeek(date) + "周";
                        break;
                    case 3:
                        return $com.util.format("yy年M月", date);
                    default:
                        return $com.util.format("yyyy/MM/dd", date);
                }
            },
            // x轴时间刻度递增
            cartDatePlus: function (statType, date) {
                date = new Date(date);
                switch (statType) {
                    case 1:
                        date = date.getTime() + 86400000;
                        break;
                    case 2:
                        date = date.getTime() + 604800000;
                        break;
                    case 3:
                        var m = date.getMonth() + 1;
                        if (m < 12) {
                            date.setMonth(m);
                            break;
                        } else {
                            date.setFullYear(date.getFullYear() + 1);
                            date.setMonth(m - 12);
                        }
                        break;
                }
                return new Date(date);
            }
        };
       
        // 搜索条件模板
        var searchTemplate = {
            ProductID: [], StatType: 1,
            StartTime: new Date(new Date().getTime() - 30 * 24 * 3600 * 1000),
            EndTime: new Date(new Date().getTime() + 24 * 3600 * 1000),
        };

        var model = $com.Model.create({
            el: "#OneTimePassRate-body",
            name: "一次性合格率",
            VueName: "vm",
            mixins: [$mixinsTools, $baseComponents],
            data: {
                // 表头
                //tableHead: tableHead,
                myChart: null,
                // 搜索框数据
                searchData: $com.util.Clone(searchTemplate),
                // 数据列表
                tableData: [],
                //图表数据
                chartData:[],
                //下拉框数据
                selectOptions: {
                    ProductList: [],
                    StatTypeList: [
                        { ID: 1, Name: "日" },
                        { ID: 2, Name: "周" },
                        { ID: 3, Name: "月" }
                    ],
                },
                xAxisData :[],
                okData :[],
                ngData :[],
                numData :[],
                passRateData :[],
                oneTimePassRateData :[],
            },
            filters: {

            },
            computed: {
                // 切换查询模式
                pickerOptions: function () {

                    var option = {};

                    switch (this.searchData.StatType) {
                        case 1:
                            option.type = "date";
                            option.format = "yyyy年MM月dd日";
                            break;
                        case 2:
                            option.type = "week";
                            option.format = "yyyy年第 WW 周";
                            break;
                        case 3:
                            option.type = "month";
                            option.format = "yyyy 年 MM 月";
                            break;
                        default:
                            break;
                    }

                    return option;
                },

            },
            created: function () {
                this.getSelectOptions();
            },
            mounted: function () {
                this.getMyChart();
                this.search();
            },
            methods: {
                // 查询
                search: function ($event) {
                    //var that = this;
                    //$com.app.loading("数据加载中...");
                    //that.getChartData();
                    //http("getData", {
                    //    ProductID: that.searchData.ProductID.join(","),
                    //    StatType: that.searchData.StatType,
                    //    StartTime: that.searchData.StartTime && $com.util.format("yyyy-MM-dd", that.searchData.StartTime),
                    //    EndTime: that.searchData.EndTime && $com.util.format("yyyy-MM-dd", that.searchData.EndTime)
                    //}, function (res) {
                    //    $com.app.loaded();
                    //    that.tableData = res.list;
                    //    // 渲染图表
                    //    that.renderMyChart();
                    //});

                    var that = this;
                     // $com.app.loading("数据加载中...");
                    that.getChartData();
                    var params = {
                        $URI: '/QMSQuality/GetOneTimePassRate',
                        $TYPE: 'Get',
                        PageCountProp: 'info',
                        DataListProp: 'list',
                        ProductID: that.searchData.ProductID.join(","),
                        StatType: that.searchData.StatType,
                        StartTime: that.searchData.StartTime && $com.util.format("yyyy-MM-dd", that.searchData.StartTime),
                        EndTime: that.searchData.EndTime && $com.util.format("yyyy-MM-dd", that.searchData.EndTime),
                        PageSize: 10,
                        Deeps: 2,
                    };
                    $com.app.loading("数据加载中...");
                    $page.init($('.el-table .el-table__body-wrapper > table'), null, params, function (res) {
                        $com.app.loaded();
                        that.tableData = res;
                        // 渲染图表
                        that.renderMyChart();
                    });
                },
                // 清空
                emptyClick: function () {
                    this.searchData = $com.util.Clone(searchTemplate);
                },
                // 获取myChart
                getMyChart: function () {
                    this.myChart = $echarts.init(document.getElementsByClassName("fzy-statistical-echarts")[0]);
                },
                // 处理图表数据
                myChartData: function () {
                    var that = this;
                    return {
                        title: { text: "一次性合格率图表" },
                        tooltip: {
                            trigger: "axis",
                            axisPointer: {
                                type: 'cross'
                            }
                        },
                        legend: {
                            orient: "vertical",
                            type: "scroll",
                            right: 10,
                            top: 20,
                            bottom: 20,
                        },
                        toolbox: { feature: {} },
                        xAxis: [
                            {
                                type: 'category',
                                data: that.xAxisData,
                                axisPointer: {
                                    type: 'shadow'
                                }
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                name: '数量',
                            },
                            {
                                type: 'value',
                                name: '百分比',
                                axisLabel: {
                                    formatter: '{value}%'
                                }
                            }
                        ],
                        series: [
                            {
                                name: '合格数',
                                type: 'bar',
                                data: that.okData
                            },
                            {
                                name: '不合格数',
                                type: 'bar',
                                data: that.ngData
                            },
                            {
                                name: '总数',
                                type: 'bar',
                                data: that.numData
                            },
                            {
                                name: '合格率',
                                type: 'line',
                                yAxisIndex: 1,
                                data: that.passRateData
                            }, {
                                name: '一次性合格率',
                                type: 'line',
                                yAxisIndex: 1,
                                data: that.oneTimePassRateData
                            }
                        ],
                    };
                },
                // 渲染折线图
                renderMyChart: function () {
                    var that = this;
                    // 清除已有配置项
                    this.myChart.clear();

                    // 写入新配置项
                    setTimeout(function () {
                        that.myChart.setOption(that.myChartData());
                    }, 1000);
                },
                // 获取图表数据
                getChartData: function () {
                    var that = this;
                    http("getChart", {
                        ProductID: that.searchData.ProductID.join(","),
                        StatType: that.searchData.StatType,
                        StartTime: that.searchData.StartTime && $com.util.format("yyyy-MM-dd", that.searchData.StartTime),
                        EndTime: that.searchData.EndTime && $com.util.format("yyyy-MM-dd", that.searchData.EndTime)
                    }, function (res) {
                        that.xAxisData = [];
                        that.okData = [];
                        that.ngData = [];
                        that.numData = [];
                        that.passRateData = [];
                        that.oneTimePassRateData = [];
                        res.list.forEach(function (item) {
                            that.xAxisData.push(item.StrDate);
                            that.okData.push(item.OKNum);
                            that.ngData.push(item.NGNum);
                            that.numData.push(item.Num);
                            that.passRateData.push(item.PassRate);
                            that.oneTimePassRateData.push(item.OneTimePassRate);
                        });
                    });
                },
                // 获取下拉框数据
                getSelectOptions: function () {
                    var that = this;
                    http("getProduct", { Active: 1, Paging: 0 }, function (res) {
                        that.selectOptions.ProductList = res.list;
                    });
                },
                // 搜索框时间变化  -- 当开始时间>结束时间时调换开始&结束时间
                pickerChange() {
                    var startTime = new Date(this.searchData.StartTime);
                    var endTime = new Date(this.searchData.EndTime);

                    // 权重
                    var weight = [0, 1, 7, 31, 92, 366][this.searchData.StatType];
                    // 区间判断
                    (Math.abs(endTime - startTime) > 86400000 * weight * 100)
                        && alert("选择区间较大，可能会产生卡顿");

                    // 排序
                    if (startTime > endTime) {
                        var n = this.searchData.StartTime;
                        this.searchData.StartTime = this.searchData.EndTime;
                        this.searchData.EndTime = n;
                    }
                },
            },
            events: function () {
            },
        });
        model.init();
    });
