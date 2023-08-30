require([
    "../static/utils/js/jquery-3.1.1",
    "../static/utils/js/base/base",
    "../static/utils/js/base/echarts",

], function ($alfie, $com, $echarts) {

    var globalData = {
        // 搜索框模板
        searchTemplate: {
            AreaID: "", DeviceID: [], EnergyType: "1", StatType: 1,
            StartTime: new Date(new Date().getTime() - 30 * 24 * 3600 * 1000),
            EndTime: new Date(new Date().getTime() + 24 * 3600 * 1000),
        },
        enumerate: {
            EnergyType: ["", "电能"],
            StatType: ["", "按日统计", "按周统计", "按月统计", "按季统计", "按年统计"],
        },
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
                    return $com.util.format("yyyy", date) + "年" + tools.getWeek(date) + "周";
                    break;
                case 3:
                    return $com.util.format("yy年M月", date);
                case 4:
                    return $com.util.format("yy年q季度", date);
                case 5:
                    return $com.util.format("yyyy", date);
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
                case 4:
                    var m = date.getMonth() + (statType === 3 ? 1 : 3);
                    if (m < 12) {
                        date.setMonth(m);
                        break;
                    } else {
                        date.setFullYear(date.getFullYear() + 1);
                        date.setMonth(m - 12);
                    }
                    break;
                case 5:
                    date.setFullYear(date.getFullYear() + 1);
                    break;
            }
            return new Date(date);
        }
    };

    var model = $com.Model.create({
        el: "#energyConsumption",
        VueName: "vm",
        name: "能耗统计",
        data: {
            tableData: [],
            myChart: null,
            searchData: $com.util.Clone(globalData.searchTemplate),
            selectOptions: {
                AreaList: [],
                DeviceList: [],
                StatTypeList: [
                    {ID: 1, Name: "日"},
                    {ID: 2, Name: "周"},
                    {ID: 3, Name: "月"},
                    {ID: 4, Name: "季"},
                    {ID: 5, Name: "年"},
                ],
            },
        },
        computed: {
            // 筛选后的区域列表
            DeviceListShow: function () {
                var that = this;
                if (that.searchData.AreaID) {
                    that.searchData.DeviceID = [];
                    return that.selectOptions.DeviceList.filter(function (item) {
                        return item.AreaID === that.searchData.AreaID;
                    });
                }

                return that.selectOptions.DeviceList;
            },
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
                        option.format = "yyyy 第 WW 周";
                        break;
                    case 3:
                    case 4:
                        option.type = "month";
                        option.format = "yyyy 年 MM 月";
                        break;
                    case 5:
                        option.type = "year";
                        option.format = "yyyy 年";
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

            // 监听页面大小变化
            window.addEventListener("resize", this.myChart && this.myChart.resize);

        },
        methods: {
            search: function () {
                var that = this;
                var params = $com.util.Clone(that.searchData);

                params.StartTime = params.StartTime && $com.util.format("yyyy-MM-dd", params.StartTime);
                params.EndTime = params.EndTime && $com.util.format("yyyy-MM-dd", params.EndTime);
                params.DeviceID = params.DeviceID.join(",");

                this.GetDMSEnergyStatistics(params, function (res) {
                    // 获取数据
                    that.tableData = res.list;
                    // 渲染折线图
                    that.renderMyChart();
                });
            },
            emptyClick: function () {
                this.searchData = $com.util.Clone(globalData.searchTemplate);
            },
            // 获取myChart
            getMyChart: function () {
                this.myChart = $echarts.init(document.getElementsByClassName("fzy-statistical-echarts")[0]);
            },
            // 处理折线图数据
            myChartData: function () {
                var that = this;
                var statType = this.searchData.StatType;
                // echarts数据源
                var series = [];

                // 数据源
                var map = {};
                that.tableData.forEach(function (item) {
                    // 数据分类
                    (map[item.DeviceID] || (map[item.DeviceID] = {}))[
                        tools.cartDateFormat(statType, item.UpdateTime)
                        ] = item;
                });


                // 根据查询时间生成轴
                var xAxis = {
                    type: "category",
                    boundaryGap: false,
                    data: [],
                };
                var startTime = new Date(that.searchData.StartTime);
                var endTime = new Date(that.searchData.EndTime);
                while (startTime < endTime) {
                    // 生成x轴刻度
                    xAxis.data.push(
                        tools.cartDateFormat(statType, startTime)
                    );
                    // 增加一个单位的时间
                    startTime = tools.cartDatePlus(statType, startTime);
                }

                // 给每台设备生成数据
                for (let mapKey in map) {
                    var deviceList = map[mapKey];
                    var data = [];

                    // 通过x轴刻度添加数据
                    xAxis.data.forEach(function (item) {
                        data.push(deviceList[item] ? deviceList[item]["StatConsumption"] : 0);
                    });

                    // 获取设备名称
                    var deviceName = "";
                    for (const key in deviceList) {
                        deviceName = deviceList[key].DeviceName;
                        break;
                    }

                    series.push({
                        name: deviceName,
                        type: "line",
                        data: data,
                        smooth: true
                    });
                }

                return {
                    title: {text: "能耗统计"},
                    tooltip: {trigger: "axis", axisPointer: {type: "shadow"}},
                    legend: {
                        orient: "vertical",
                        type: "scroll",
                        right: 10,
                        top: 20,
                        bottom: 20,
                    },
                    toolbox: {feature: {}},
                    xAxis: xAxis,
                    yAxis: {type: "value"},
                    series: series,
                };
            },
            // 渲染折线图
            renderMyChart: function () {
                // 清除已有配置项
                this.myChart.clear();
                // 写入新配置项
                this.myChart.setOption(this.myChartData());
            },
            // 下拉框列表
            getSelectOptions: function () {
                var that = this;
                // 区域列表
                that.GetAReaList({Active: 1}, function (res) {
                    that.selectOptions.AreaList = res.list;
                });
                // 设备列表
                that.GetDeviceList({Active: 1}, function (res) {
                    that.selectOptions.DeviceList = res.list;
                });
            },
            // api - 获取能耗列表
            GetDMSEnergyStatistics: function (data, fn, context) {
                var d = {$URI: "/DMSEnergyStatistics/StatisticsAll", $TYPE: "get"};

                function err() {
                    $com.app.tip("提交失败，请检查网络");
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            // api - 区域列表
            GetAReaList: function (data, fn, context) {
                var d = {$URI: "/BMSRegion/All", $TYPE: "get"};

                function err() {
                    $com.app.tip("提交失败，请检查网络");
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            // api - 设备列表
            GetDeviceList: function (data, fn, context) {
                var d = {$URI: "/DMSDeviceLedger/All", $TYPE: "get"};

                function err() {
                    $com.app.tip("提交失败，请检查网络");
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            // 格式化枚举类型
            formatter: function (row, column) {
                return globalData.enumerate[column.property][row[column.property]];
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
