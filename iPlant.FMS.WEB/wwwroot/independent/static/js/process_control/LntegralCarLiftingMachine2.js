require(
    [
        '../static/utils/js/jquery-3.1.1',
        '../static/utils/js/base/base'
    ],
    function ($lin, $com) {
        var mDeviceID;
        var model = $com.Model.create({
            el: '#fxy-app',
            VueName: 'vm',
            name: '移动式架车机',
            type: $com.Model.MAIN, //主方法
            data: {
                changName: '高度',
                newDate: '',
                //高度限位螺母
                change: [
                    {
                        name: '高度',
                        bool: true,
                    },
                    {
                        name: '限位',
                        bool: false,
                    },
                    {
                        name: '螺母',
                        bool: false,
                    },
                ],
                //开机
                StartingUp: {},
                info: {},
                // 当前报警
                alarmCurrent: [],
            },
            computed: {
                // 持续状态时长
                duration: function () {
                    return this.time_s(this.StartingUp.Duration);
                },
                // 整理后的整体式地下驾车机组报警参数
                statusOverview: function () {
                    /*                    var testarr = [
                                            "BH1.1安全螺母故障",
                                            "BH2.2安全螺母故障",
                                            "BH3.1安全螺母故障",
                                            "BH4.2安全螺母故障",
                                            "CH5安全螺母1故障",
                                            "6坑急停状态",
                                            "7坑急停状态",
                                        ]*/

                    /*  var testarr = [
                          "电源相序故障",
                          "BH1.1安全螺母故障",
                          "BH1.2安全螺母故障",
                          "BH2.1安全螺母故障",
                          "BH2.2安全螺母故障",
                          "BH3.1安全螺母故障",
                          "BH3.2安全螺母故障",
                          "BH4.1安全螺母故障",
                          "BH4.2安全螺母故障",
                          "BH5.1安全螺母故障",
                          "BH5.2安全螺母故障",
                          "BH6.1安全螺母故障",
                          "BH6.2安全螺母故障",
                          "BH7.1安全螺母故障",
                          "BH7.2安全螺母故障",
                          "BH8.1安全螺母故障",
                          "BH8.2安全螺母故障",
                          "BH9.1安全螺母故障",
                          "BH9.2安全螺母故障",
                          "BH10.1安全螺母故障",
                          "BH10.2安全螺母故障",
                          "BH11.1安全螺母故障",
                          "BH11.2安全螺母故障",
                          "BH12.1安全螺母故障",
                          "BH12.2安全螺母故障",
                          "BH13.1安全螺母故障",
                          "BH13.2安全螺母故障",
                          "BH14.1安全螺母故障",
                          "BH14.2安全螺母故障",
                          "BH15.1安全螺母故障",
                          "BH15.2安全螺母故障",
                          "BH16.1安全螺母故障",
                          "BH16.2安全螺母故障",
                          "BH1.1工作螺母故障",
                          "BH1.2工作螺母故障",
                          "BH2.1工作螺母故障",
                          "BH2.2工作螺母故障",
                          "BH3.1工作螺母故障",
                          "BH3.2工作螺母故障",
                          "BH4.1工作螺母故障",
                          "BH4.2工作螺母故障",
                          "BH5.1工作螺母故障",
                          "BH5.2工作螺母故障",
                          "BH6.1工作螺母故障",
                          "BH6.2工作螺母故障",
                          "BH7.1工作螺母故障",
                          "BH7.2工作螺母故障",
                          "BH8.1工作螺母故障",
                          "BH8.2工作螺母故障",
                          "BH9.1工作螺母故障",
                          "BH9.2工作螺母故障",
                          "BH10.1工作螺母故障",
                          "BH10.2工作螺母故障",
                          "BH11.1工作螺母故障",
                          "BH11.2工作螺母故障",
                          "BH12.1工作螺母故障",
                          "BH12.2工作螺母故障",
                          "BH13.1工作螺母故障",
                          "BH13.2工作螺母故障",
                          "BH14.1工作螺母故障",
                          "BH14.2工作螺母故障",
                          "BH15.1工作螺母故障",
                          "BH15.2工作螺母故障",
                          "BH16.1工作螺母故障",
                          "BH16.2工作螺母故障",
                          "CH1安全螺母故障",
                          "CH2安全螺母故障",
                          "CH3安全螺母故障",
                          "CH4安全螺母故障",
                          "CH5安全螺母故障",
                          "CH6安全螺母故障",
                          "CH7安全螺母故障",
                          "CH8安全螺母故障",
                          "CH9安全螺母故障",
                          "CH10安全螺母故障",
                          "CH11安全螺母故障",
                          "CH12安全螺母故障",
                          "CH13安全螺母故障",
                          "CH14安全螺母故障",
                          "CH15安全螺母故障",
                          "CH16安全螺母故障",
                          "CH1工作螺母故障",
                          "CH2工作螺母故障",
                          "CH3工作螺母故障",
                          "CH4工作螺母故障",
                          "CH5工作螺母故障",
                          "CH6工作螺母故障",
                          "CH7工作螺母故障",
                          "CH8工作螺母故障",
                          "CH9工作螺母故障",
                          "CH10工作螺母故障",
                          "CH11工作螺母故障",
                          "CH12工作螺母故障",
                          "CH13工作螺母故障",
                          "CH14工作螺母故障",
                          "CH15工作螺母故障",
                          "CH16工作螺母故障",
                          "车体同步控制故障",
                          "转向架同步控制故障",
                          "上升接触器状态",
                          "下降接触器状态",
                          "1坑急停状态",
                          "2坑急停状态",
                          "3坑急停状态",
                          "4坑急停状态",
                          "5坑急停状态",
                          "6坑急停状态",
                          "7坑急停状态",
                          "8坑急停状态",
                          "9坑急停状态",
                          "10坑急停状态",
                          "11坑急停状态",
                          "12坑急停状态",
                          "13坑急停状态",
                          "14坑急停状态",
                          "15坑急停状态",
                          "16坑急停状态",
                          "BH1.1电机超温报警",
                          "BH1.2电机超温报警",
                          "BH2.1电机超温报警",
                          "BH2.2电机超温报警",
                          "BH3.1电机超温报警",
                          "BH3.2电机超温报警",
                          "BH4.1电机超温报警",
                          "BH4.2电机超温报警",
                          "BH5.1电机超温报警",
                          "BH5.2电机超温报警",
                          "BH6.1电机超温报警",
                          "BH6.2电机超温报警",
                          "BH7.1电机超温报警",
                          "BH7.2电机超温报警",
                          "BH8.1电机超温报警",
                          "BH8.2电机超温报警",
                          "BH9.1电机超温报警",
                          "BH9.2电机超温报警",
                          "BH10.1电机超温报警",
                          "BH10.2电机超温报警",
                          "BH11.1电机超温报警",
                          "BH11.2电机超温报警",
                          "BH12.1电机超温报警",
                          "BH12.2电机超温报警",
                          "BH13.1电机超温报警",
                          "BH13.2电机超温报警",
                          "BH14.1电机超温报警",
                          "BH14.2电机超温报警",
                          "BH15.1电机超温报警",
                          "BH15.2电机超温报警",
                          "BH16.1电机超温报警",
                          "BH16.2电机超温报警",
                          "BH1.1电机超流报警",
                          "BH1.2电机超流报警",
                          "BH2.1电机超流报警",
                          "BH2.2电机超流报警",
                          "BH3.1电机超流报警",
                          "BH3.2电机超流报警",
                          "BH4.1电机超流报警",
                          "BH4.2电机超流报警",
                          "BH5.1电机超流报警",
                          "BH5.2电机超流报警",
                          "BH6.1电机超流报警",
                          "BH6.2电机超流报警",
                          "BH7.1电机超流报警",
                          "BH7.2电机超流报警",
                          "BH8.1电机超流报警",
                          "BH8.2电机超流报警",
                          "BH9.1电机超流报警",
                          "BH9.2电机超流报警",
                          "BH10.1电机超流报警",
                          "BH10.2电机超流报警",
                          "BH11.1电机超流报警",
                          "BH11.2电机超流报警",
                          "BH12.1电机超流报警",
                          "BH12.2电机超流报警",
                          "BH13.1电机超流报警",
                          "BH13.2电机超流报警",
                          "BH14.1电机超流报警",
                          "BH14.2电机超流报警",
                          "BH15.1电机超流报警",
                          "BH15.2电机超流报警",
                          "BH16.1电机超流报警",
                          "BH16.2电机超流报警",
                          "BH1.1压力监测",
                          "BH1.2压力监测",
                          "BH2.1压力监测",
                          "BH2.2压力监测",
                          "BH3.1压力监测",
                          "BH3.2压力监测",
                          "BH4.1压力监测",
                          "BH4.2压力监测",
                          "BH5.1压力监测",
                          "BH5.2压力监测",
                          "BH6.1压力监测",
                          "BH6.2压力监测",
                          "BH7.1压力监测",
                          "BH7.2压力监测",
                          "BH8.1压力监测",
                          "BH8.2压力监测",
                          "BH9.1压力监测",
                          "BH9.2压力监测",
                          "BH10.1压力监测",
                          "BH10.2压力监测",
                          "BH11.1压力监测",
                          "BH11.2压力监测",
                          "BH12.1压力监测",
                          "BH12.2压力监测",
                          "BH13.1压力监测",
                          "BH13.2压力监测",
                          "BH14.1压力监测",
                          "BH14.2压力监测",
                          "BH15.1压力监测",
                          "BH15.2压力监测",
                          "BH16.1压力监测",
                          "BH16.2压力监测",
                          "BH1.1上上限位",
                          "BH1.2上上限位",
                          "BH2.1上上限位",
                          "BH2.2上上限位",
                          "BH3.1上上限位",
                          "BH3.2上上限位",
                          "BH4.1上上限位",
                          "BH4.2上上限位",
                          "BH5.1上上限位",
                          "BH5.2上上限位",
                          "BH6.1上上限位",
                          "BH6.2上上限位",
                          "BH7.1上上限位",
                          "BH7.2上上限位",
                          "BH8.1上上限位",
                          "BH8.2上上限位",
                          "BH9.1上上限位",
                          "BH9.2上上限位",
                          "BH10.1上上限位",
                          "BH10.2上上限位",
                          "BH11.1上上限位",
                          "BH11.2上上限位",
                          "BH12.1上上限位",
                          "BH12.2上上限位",
                          "BH13.1上上限位",
                          "BH13.2上上限位",
                          "BH14.1上上限位",
                          "BH14.2上上限位",
                          "BH15.1上上限位",
                          "BH15.2上上限位",
                          "BH16.1上上限位",
                          "BH16.2上上限位",
                          "BH1.1下下限位",
                          "BH1.2下下限位",
                          "BH2.1下下限位",
                          "BH2.2下下限位",
                          "BH3.1下下限位",
                          "BH3.2下下限位",
                          "BH4.1下下限位",
                          "BH4.2下下限位",
                          "BH5.1下下限位",
                          "BH5.2下下限位",
                          "BH6.1下下限位",
                          "BH6.2下下限位",
                          "BH7.1下下限位",
                          "BH7.2下下限位",
                          "BH8.1下下限位",
                          "BH8.2下下限位",
                          "BH9.1下下限位",
                          "BH9.2下下限位",
                          "BH10.1下下限位",
                          "BH10.2下下限位",
                          "BH11.1下下限位",
                          "BH11.2下下限位",
                          "BH12.1下下限位",
                          "BH12.2下下限位",
                          "BH13.1下下限位",
                          "BH13.2下下限位",
                          "BH14.1下下限位",
                          "BH14.2下下限位",
                          "BH15.1下下限位",
                          "BH15.2下下限位",
                          "BH16.1下下限位",
                          "BH16.2下下限位",
                          "BH1.1上限位",
                          "BH1.2上限位",
                          "BH2.1上限位",
                          "BH2.2上限位",
                          "BH3.1上限位",
                          "BH3.2上限位",
                          "BH4.1上限位",
                          "BH4.2上限位",
                          "BH5.1上限位",
                          "BH5.2上限位",
                          "BH6.1上限位",
                          "BH6.2上限位",
                          "BH7.1上限位",
                          "BH7.2上限位",
                          "BH8.1上限位",
                          "BH8.2上限位",
                          "BH9.1上限位",
                          "BH9.2上限位",
                          "BH10.1上限位",
                          "BH10.2上限位",
                          "BH11.1上限位",
                          "BH11.2上限位",
                          "BH12.1上限位",
                          "BH12.2上限位",
                          "BH13.1上限位",
                          "BH13.2上限位",
                          "BH14.1上限位",
                          "BH14.2上限位",
                          "BH15.1上限位",
                          "BH15.2上限位",
                          "BH16.1上限位",
                          "BH16.2上限位",
                          "BH1.1下限位",
                          "BH1.2下限位",
                          "BH2.1下限位",
                          "BH2.2下限位",
                          "BH3.1下限位",
                          "BH3.2下限位",
                          "BH4.1下限位",
                          "BH4.2下限位",
                          "BH5.1下限位",
                          "BH5.2下限位",
                          "BH6.1下限位",
                          "BH6.2下限位",
                          "BH7.1下限位",
                          "BH7.2下限位",
                          "BH8.1下限位",
                          "BH8.2下限位",
                          "BH9.1下限位",
                          "BH9.2下限位",
                          "BH10.1下限位",
                          "BH10.2下限位",
                          "BH11.1下限位",
                          "BH11.2下限位",
                          "BH12.1下限位",
                          "BH12.2下限位",
                          "BH13.1下限位",
                          "BH13.2下限位",
                          "BH14.1下限位",
                          "BH14.2下限位",
                          "BH15.1下限位",
                          "BH15.2下限位",
                          "BH16.1下限位",
                          "BH16.2下限位",
                          "CH1电机超温报警",
                          "CH2电机超温报警",
                          "CH3电机超温报警",
                          "CH4电机超温报警",
                          "CH5电机超温报警",
                          "CH6电机超温报警",
                          "CH7电机超温报警",
                          "CH8电机超温报警",
                          "CH9电机超温报警",
                          "CH10电机超温报警",
                          "CH11电机超温报警",
                          "CH12电机超温报警",
                          "CH13电机超温报警",
                          "CH14电机超温报警",
                          "CH15电机超温报警",
                          "CH16电机超温报警",
                          "CH1电机超流报警",
                          "CH2电机超流报警",
                          "CH3电机超流报警",
                          "CH4电机超流报警",
                          "CH5电机超流报警",
                          "CH6电机超流报警",
                          "CH7电机超流报警",
                          "CH8电机超流报警",
                          "CH9电机超流报警",
                          "CH10电机超流报警",
                          "CH11电机超流报警",
                          "CH12电机超流报警",
                          "CH13电机超流报警",
                          "CH14电机超流报警",
                          "CH15电机超流报警",
                          "CH16电机超流报警",
                          "CH1上上限位",
                          "CH2上上限位",
                          "CH3上上限位",
                          "CH4上上限位",
                          "CH5上上限位",
                          "CH6上上限位",
                          "CH7上上限位",
                          "CH8上上限位",
                          "CH9上上限位",
                          "CH10上上限位",
                          "CH11上上限位",
                          "CH12上上限位",
                          "CH13上上限位",
                          "CH14上上限位",
                          "CH15上上限位",
                          "CH16上上限位",
                          "CH1下下限位",
                          "CH2下下限位",
                          "CH3下下限位",
                          "CH4下下限位",
                          "CH5下下限位",
                          "CH6下下限位",
                          "CH7下下限位",
                          "CH8下下限位",
                          "CH9下下限位",
                          "CH10下下限位",
                          "CH11下下限位",
                          "CH12下下限位",
                          "CH13下下限位",
                          "CH14下下限位",
                          "CH15下下限位",
                          "CH16下下限位",
                          "CH1上限位",
                          "CH2上限位",
                          "CH3上限位",
                          "CH4上限位",
                          "CH5上限位",
                          "CH6上限位",
                          "CH7上限位",
                          "CH8上限位",
                          "CH9上限位",
                          "CH10上限位",
                          "CH11上限位",
                          "CH12上限位",
                          "CH13上限位",
                          "CH14上限位",
                          "CH15上限位",
                          "CH16上限位",
                          "CH1下限位",
                          "CH2下限位",
                          "CH3下限位",
                          "CH4下限位",
                          "CH5下限位",
                          "CH6下限位",
                          "CH7下限位",
                          "CH8下限位",
                          "CH9下限位",
                          "CH10下限位",
                          "CH11下限位",
                          "CH12下限位",
                          "CH13下限位",
                          "CH14下限位",
                          "CH15下限位",
                          "CH16下限位",
                          "电气控制柜上的急停",

                      ]*/

                    var arr = []
                    for (var i = 1; i < 17; i++) arr.push({bh1: [], bh2: [], ch: [], rest: []})

                    this.alarmCurrent.forEach(function (item) {
                        var DeviceName = item.AlarmName;

                        var bh1 = DeviceName.match(/BH[0-9]+.1/)
                        var bh2 = DeviceName.match(/BH[0-9]+.2/)
                        var ch = DeviceName.match(/CH[0-9]+/)

                        var index = 0;
                        try {
                            if (bh1 || bh2 || ch) {
                                index = DeviceName.match(/[BH|CH][0-9]+./)[0].match(/[0-9]+/)[0]
                            } else if (/[0-9]+坑/.test(DeviceName)) {
                                index = DeviceName.match(/[0-9]+/)[0]
                            } else return;
                        } catch {
                            return;
                        }

                        var key = bh1 ? 'bh1' : bh2 ? 'bh2' : ch ? 'ch' : 'rest'
                        arr[index - 1][key].push(DeviceName)

                    })
                    return arr
                },
            },
            configure: function () {
                this.run();
            },
            events: function () {
                window.setFunctionTrigger('LntegralCarLiftingMachine2', function (res) {
                    mDeviceID = res.ID;
                    model.com.Refresh();
                });
            },
            run: function () {
                mDeviceID = model.query.ID;
                //格式化日期格式
                Date.prototype.Format = function (fmt) {
                    var o = {
                        'M+': this.getMonth() + 1, //月份
                        'd+': this.getDate(), //日
                        'H+': this.getHours(), //小时
                        'm+': this.getMinutes(), //分
                        's+': this.getSeconds(), //秒
                        'q+': Math.floor((this.getMonth() + 3) / 3), //季度
                        'S': this.getMilliseconds(), //毫秒
                    };
                    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
                    for (var k in o)
                        if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1)
                            ? (o[k])
                            : (('00' + o[k]).substr(('' + o[k]).length)));
                    return fmt;
                };
                setInterval(function () {
                    model.data.newDate = new Date().Format('yyyy-MM-dd HH:mm:ss');
                }, 1000);

                model.com.Refresh();
                setInterval(model.com.Refresh, 10000)

            },
            com: {
                Refresh: function () {
                    model.com.getDeviceStatus({DeviceID: mDeviceID, Active: -1, Status: -1}, function (res) {
                        if (res.list[0].Status == 0) {
                            res.list[0].bgColor = {
                                color: 'rgb(137,132,132)',
                            };
                            res.list[0].StatusText = '关机';
                        } else if (res.list[0].Status & 1) {
                            res.list[0].bgColor = {
                                color: 'rgb(23,117,199)',
                            };
                            res.list[0].StatusText = '开机';
                        } else if (res.list.Status & 2) {
                            res.list[0].bgColor = {
                                color: 'rgb(44,217,47)',
                            };
                            res.list[0].StatusText = '运行';
                        } else if (res.list[0].Status & 4) {
                            res.list[0].bgColor = {
                                color: '#ff5000',
                            };
                            res.list[0].StatusText = '停止';
                        } else if (res.list[0].Status & 8) {
                            res.list[0].bgColor = {
                                color: '#eee307',
                            };
                            res.list[0].StatusText = '急停';
                        } else if (res.list[0].Status & 16) {
                            res.list[0].bgColor = {
                                color: '#f80404',
                            };
                            res.list[0].StatusText = '报警';
                        } else if (res.list[0].Status & 32) {
                            res.list[0].bgColor = {
                                color: '#00fdd5',
                            };
                            res.list[0].StatusText = '手动';
                        } else if (res.list[0].Status & 64) {
                            res.list[0].bgColor = {
                                color: '#2c955e',
                            };
                            res.list[0].StatusText = '自动';
                        } else if (res.list[0].Status & 128) {
                            res.list[0].bgColor = {
                                color: '#db1c95',
                            };
                            res.list[0].StatusText = '预留';
                        }
                        model.data.StartingUp = res.list[0];
                    });
                    model.com.DeviceParameterGet({DeviceID: mDeviceID}, function (res) {
                        model.data.info = res.info;
                    });
                    // 当前报警
                    model.com.DeviceAlarmCurrent({DeviceID: mDeviceID, Active: -1}, function (res) {
                        model.data.alarmCurrent = res.list
                    });

                },
                switchover(n) {
                    if (n == 0) {
                        this.changName = this.change[n].name;
                        this.change[n].bool = true;
                        this.change[1].bool = false;
                        this.change[2].bool = false;
                    } else if (n == 1) {
                        this.changName = this.change[n].name;
                        this.change[n].bool = true;
                        this.change[0].bool = false;
                        this.change[2].bool = false;
                    } else {
                        this.changName = this.change[2].name;
                        this.change[2].bool = true;
                        this.change[0].bool = false;
                        this.change[1].bool = false;
                    }
                },
                //跳转到通用界面
                General() {
                    var vdata = {
                        'header': '整体式架车机',
                        'id': 'GeneralPage',
                        'href': `./process_control/GeneralPage.html?ID=${mDeviceID}`,
                        'src': `./static/images/logpng/GeneralPage.png`,
                    };
                    window.parent.iframeHeaderSet(vdata);
                    window.callFunctionTrigger('GeneralPage', mDeviceID);
                },
                //获取报警信息
                DeviceAlarmGet: function (data, fn, context) {
                    var d = {
                        $URI: '/DMSDeviceAlarm/All',
                        $TYPE: 'get',
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取当前报警信息
                DeviceAlarmCurrent: function (data, fn, context) {
                    var d = {
                        $URI: "/DMSDeviceAlarm/Current",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取设备信息
                DeviceParameterGet: function (data, fn, context) {
                    var d = {
                        $URI: '/DMSDeviceRealParameter/DeviceCurrentAll',
                        $TYPE: 'get',
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取所有设备状态信息
                getDeviceStatus: function (data, fn, context) {
                    var d = {
                        $URI: '/DMSDeviceStatus/Current',
                        $TYPE: 'Get',

                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                // 时间转换
                time_s: function (s) {
                    var days = parseInt(s / (60 * 60 * 24));
                    var hours = parseInt((s % (60 * 60 * 24)) / (60 * 60));
                    var minutes = parseInt((s % (60 * 60)) / (60));
                    var seconds = parseInt(s % (60));
                    var str = '';
                    days && (str += days + ' 天 ');
                    hours && (str += hours + ' 小时 ');
                    minutes && (str += minutes + ' 分钟 ');
                    str += (seconds + ' 秒 ');
                    return str;
                },
            },
        });
        model.init();


    });
