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
        // 图表可选项列表
        chartOption: {
            "AlarmDuration": {label: "故障时长", type: "time"},
            "FailTimes": {label: "故障次数", type: "number"},
            "MTBF": {label: "平均故障间隔时间", type: "time"},
            "MTTF": {label: "平均无故障时长", type: "time"},
            "MTTR": {label: "平均修复时长", type: "time"},
            "Efficiency": {label: "稼动率", type: "percent"},
            "PlanDuration": {label: "计划工作时长", type: "time"},
            "TurnOnDuration": {label: "计划开机时长", type: "time"},
        },
        // 通用选项模板
        chartSetOptionsTemplate: {
            tooltip: {
                trigger: "axis",
                formatter: null,
            },
            legend: {
                orient: "vertical",
                type: "scroll",
                right: 10,
                top: 20,
                bottom: 20,
            },
            toolbox: {feature: {}},
            xAxis: {
                type: "category",
                boundaryGap: false,
                data: null,
            },
            yAxis: {type: "value"},
            series: null,
        },
        // 特殊选项模板
        chartOptionTemplate: {
            yAxis: {
                percent: {
                    axisLabel: {
                        formatter: function (v) {
                            return v * 100 + "%";
                        }
                    },
                },
                time: {
                    axisLabel: {
                        formatter: function (v) {
                            return tools.formatSec(v);
                        }
                    },
                }
            }
        },
    };

    var Api = {
        get: function (uri, data, fn, context) {
            var d = {$URI: uri, $TYPE: "get"};
            $com.app.ajax($.extend(d, data), fn, err, context);

            function err() {
                $com.app.tip("提交失败，请检查网络");
            }
        },
        // api - 获取能耗列表
        GetStatisticsTypeAll: function (data, fn) {
            Api.get("/DMSDeviceStatus/StatisticsTypeAll", data, fn);
        },
        // api - 区域列表
        GetAReaList: function (data, fn) {
            Api.get("/BMSRegion/All", data, fn);
        },
        // api - 设备列表
        GetDeviceList: function (data, fn) {
            Api.get("/DMSDeviceLedger/All", data, fn);
        },
    };

    var tools = {
        // 秒 ---> 时分秒
        formatSec: function (value) {
            if (!value) return 0;

            var second = parseInt(value);// 秒
            var min = 0;// 分
            var hour = 0;// 小时
            if (second > 60) {
                min = (second / 60) | 0;
                second = (second % 60) | 0;
                if (min > 60) {
                    hour = (min / 60) | 0;
                    min = (min % 60) | 0;
                }
            }
            var result = "" + (second) + "秒";
            if (min > 0) {
                result = "" + (min) + "分" + result;
            }
            if (hour > 0) {
                result = "" + (hour) + "小时" + result;
            }
            return result;
        },
        // 获取周
        getWeek: function (dt) {
            let d1 = new Date(dt);
            let d2 = new Date(dt);
            d2.setMonth(0);
            d2.setDate(1);
            let rq = d1 - d2;
            let days = Math.ceil(rq / (24 * 60 * 60 * 1000));
            let num = Math.ceil(days / 7);
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
        el: "#Efficency",
        VueName: "vm",
        name: "设备统计",
        data: {
            tableData: [],
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
            chartObjectName: "Efficiency",
            myChart: null,
        },
        computed: {
            // 设备列表  树状图
            DeviceTree: function () {
                if (!(this.selectOptions.AreaList.length && this.selectOptions.DeviceList.length)) return [];

                var area = $com.util.Clone(this.selectOptions.AreaList);
                var device = $com.util.Clone(this.selectOptions.DeviceList);

                var map = {};
                area.forEach(function (item) {
                    map[item.ID] = item;
                });
                device.forEach(function (item) {
                    (map[item.AreaID].children || (map[item.AreaID].children = [])).push(item);
                });

                this.inputDeviceDefault(area);

                return area;
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
            // 处理chart数据
            chartData: function () {
                var that = this;
                var data = this.tableData;
                var statType = this.searchData.StatType;

                // 生成x轴时间刻度
                var xAxisData = [];
                var startTime = new Date(this.searchData.StartTime);
                var endTime = new Date(this.searchData.EndTime);
                while (startTime < endTime) {
                    // 生成x轴刻度
                    xAxisData.push(tools.cartDateFormat(statType, startTime));
                    // 增加一个单位的时间
                    startTime = tools.cartDatePlus(statType, startTime);
                }

                // 处理y轴数据
                var series = [];
                data.forEach(function (device) {

                    var seriesData = [];
                    var map = {};
                    device["StatisticsInfoList"].forEach(function (item) {
                        map[
                            tools.cartDateFormat(statType, item["StatDate"])
                            ] = item[that.chartObjectName];
                    });
                    xAxisData.forEach(function (item) {
                        seriesData.push(map[item] ? map[item] < 0 ? 0 : map[item] : 0);
                    });

                    series.push({
                        name: device["DeviceNo"] + "(" + device["DeviceName"] + ")",
                        type: "line",
                        data: seriesData,
                        smooth: true
                    });
                });

                // 当前数据类型
                var type = globalData.chartOption[that.chartObjectName].type;

                // 处理Y轴数据的显示
                function filterValue(value) {
                    switch (type) {
                        case "time":
                            return tools.formatSec(value);
                        case "percent":
                            return (parseFloat(value) * 100).toFixed(2) + "%";
                        default:
                            return value;
                    }
                }

                var options = globalData.chartSetOptionsTemplate;
                options.series = series;
                options.tooltip.formatter = function (v) {
                    return [v[0].axisValueLabel]
                        .concat(
                            v.map(function (item) {
                                return item.marker + item.seriesName + ": " + filterValue(item.value);
                            })
                        ).join("<br/>");
                };
                options.xAxis.data = xAxisData;
                options.yAxis = globalData.chartOptionTemplate.yAxis[type] || {};
                return options;
            },
            // 图表类型可选项
            chartOptionArr: function () {
                var arr = [];
                for (let key in globalData.chartOption) {
                    arr.push({
                        value: key,
                        label: globalData.chartOption[key].label
                    });
                }
                return arr;
            },
        },
        watch: {
            DeviceTree: function (newDate) {
                newDate.length && this.search();
            }
        },
        created: function () {
            this.getSelectOptions();
        },
        mounted: function () {
            this.getMyChart();
        },
        methods: {
            // 搜索
            search: function () {
                var that = this;


                if (!that.searchData.DeviceID.length) {
                    alert("设备为必选项，已默认选中 \"" + that.DeviceTree[0].Name + " \"");
                    that.inputDeviceDefault();
                }
                var params = $com.util.Clone(that.searchData);
                (function () {
                    params.StartTime = params.StartTime && $com.util.format("yyyy-MM-dd", params.StartTime);
                    params.EndTime = params.EndTime && $com.util.format("yyyy-MM-dd", params.EndTime);
                    params.DeviceID = params.DeviceID.map(function (item) {
                        return item[1];
                    }).join(",");
                })();
                Api.GetStatisticsTypeAll(params, function (res) {
                    // 获取数据
                    that.tableData = res.list;
                    // 渲染折线图
                    that.renderMyChart();
                });
            },
            // 重置
            emptyClick: function () {
                this.searchData = $com.util.Clone(globalData.searchTemplate);
            },
            // 获取myChart
            getMyChart: function () {
                this.myChart = $echarts.init(document.getElementsByClassName("fzy-statistical-echarts")[0]);
                window.addEventListener("resize", this.myChart.resize);
            },
            // 渲染折线图
            renderMyChart: function () {
                // 清除已有配置项
                this.myChart.clear();
                // 写入新配置项
                this.myChart.setOption(this.chartData);
            },
            // 搜索框时间排序
            timeSort: function () {
                var startTime = new Date(this.searchData.StartTime);
                var endTime = new Date(this.searchData.EndTime);
                // 权重
                var weight = [0, 1, 7, 31, 92, 366][this.searchData.StatType];
                // 区间判断
                (Math.abs(endTime - startTime) > 86400000 * weight * 366)
                && alert("选择区间较大，可能会产生卡顿");
                // 排序
                if (startTime > endTime) {
                    var n = this.searchData.StartTime;
                    this.searchData.StartTime = this.searchData.EndTime;
                    this.searchData.EndTime = n;
                }
            },
            // 下拉框列表
            getSelectOptions: function () {
                var that = this;
                // 区域列表
                Api.GetAReaList({Active: 1}, function (res) {
                    that.selectOptions.AreaList = res.list;
                });
                // 设备列表
                Api.GetDeviceList({Active: 1}, function (res) {
                    that.selectOptions.DeviceList = res.list;
                });
            },
            // 给设备列表添加默认值
            inputDeviceDefault: function (DeviceTree) {
                DeviceTree = DeviceTree || this.DeviceTree;
                // 赋予默认值 为第一个区域的所有设备
                var areaID = DeviceTree[0].ID;
                this.searchData.DeviceID = DeviceTree[0].children.map(function (item) {
                    return [areaID, item.ID];
                });
            }
        },
        events: function () {
        },
    });
    model.init();
});
