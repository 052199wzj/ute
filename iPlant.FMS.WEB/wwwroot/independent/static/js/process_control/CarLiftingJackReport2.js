require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/paging', '../static/utils/js/base/base'],
    function ($lin, $page, $com) {
        window.HomeRefrush = function () {
            model.data.Entirety = [];
            model.data.Move = [];
            model.data.list = [];
            model.com.Refresh();
        };

        var mZCommitStartTime = $com.util.format('yyyy-MM-dd', new Date().getTime() - 30 * 24 * 3600 * 1000);
        var mZCommitEndTime = $com.util.format('yyyy-MM-dd', new Date().getTime() + 24 * 3600 * 10);
        var alarmData = [
            {
                ID: "1.1",
                content: "",
            },
            {
                ID: "1.2",
                content: "",
            },
            {
                ID: "1.3",
                content: "",
            },
            {
                ID: "1.4",
                content: "",
            },
            {
                ID: "2.1",
                content: "",
            },
            {
                ID: "2.2",
                content: "",
            },
            {
                ID: "2.3",
                content: "",
            },
            {
                ID: "2.4",
                content: "",
            },
            {
                ID: "3.1",
                content: "",
            },
            {
                ID: "3.2",
                content: "",
            },
            {
                ID: "3.3",
                content: "",
            },
            {
                ID: "3.4",
                content: "",
            },
            {
                ID: "4.1",
                content: "",
            },
            {
                ID: "4.2",
                content: "",
            },
            {
                ID: "4.3",
                content: "",
            },
            {
                ID: "4.4",
                content: "",
            },
        ];
        var model = $com.Model.create({
            el: '#fxy-app',
            VueName: 'vm',
            name: '临线区',
            data: {
                date: '',//当前时间
                Area: {
                    DeviceCount: 0,//设备数量
                    OpenNum: 0,//开机数量
                    FaultNum: 0,//故障数量
                    CloseNum: 0,//关机数
                },
                Probability: {
                    Open: 0,//开机率
                    Close: 0,//关机率
                    Fault: 0,//故障率
                },
                //T3 区域ID为35     T2区域ID为33    移动式驾车机设备型号ID为19    洗车机为17   整体架车机为16
                //整体架车机 列表
                Entirety: [],
                //移动架车机
                Move: [],
                //设备列表
                list: [],
                Status: [],
                // EndTime: null,
                // StartingTime: null,
                timeSection: [mZCommitStartTime, mZCommitEndTime],
                Log: [],
                LogShow: true,
                DeviceID: 0,
                alarmList: {},
                alarmData: {},
            },
            type: $com.Model.MAIN, //主方法
            configure: function () {
                this.run();
            },
            events: function () {
                window.setFunctionTrigger('CarLiftingJackReport', function (res) {
                    model.data.Entirety = [];
                    model.data.Move = [];
                    model.data.list = [];
                    model.data.Area = res;
                    model.com.Refresh();
                });
            },
            filters: {
                time_H: function (ms) {
                    var days = parseInt(ms / (60 * 60 * 24));
                    var hours = parseInt((ms % (60 * 60 * 24)) / (60 * 60));
                    var minutes = parseInt((ms % (60 * 60)) / (60));
                    var seconds = parseInt(ms % (60));
                    var str = '';
                    days && (str += days + " 天 ");
                    hours && (str += hours + " 小时 ");
                    minutes && (str += minutes + " 分钟 ");
                    str += (seconds + " 秒 ");
                    return str;
                },
            },
            run: function () {
                // {StatusCount: "[object Object]", AreaID: "35", AreaNo: "T3", AreaName: "轮对构架检修区", DeviceCount: "1"}
                // .iFrame-center span

                model.data.Area = model.query;
                //时间组件
                // model.com.getDate();
                //初始化信息
                // model.com.initialize();
                model.com.Refresh();
            },
            computed: {
                // 整体式驾车机数据[{data: 设备报警列表, info: 设备信息}]
                statusOverview: function () {
                    var that = this;
                    var arr = [];
                    that.Entirety.forEach(function (item) {
                        arr.push({
                            info: item,
                            data: model.com.statusOverviewFn(that.alarmList[item.DeviceID] || [])
                        })
                    })
                    return arr;
                },
            },
            com: {
                //查看详情
                Particulars: function (ID) {
                    var list = {ID};
                    var vdata = {
                        'header': '设备详情',
                        'id': 'DeviceParticulars',
                        'href': './process_control/DeviceParticulars.html?' + $com.uri.setUrlQuery(list),
                        'src': './static/images/logpng/车辆.png',
                    };
                    window.parent.iframeHeaderSet(vdata);
                    window.callFunctionTrigger('DeviceParticulars', list);
                },
                //查看日志
                ViewLog: function (ID) {
                    model.data.DeviceID = ID;
                    model.data.LogShow = !model.data.LogShow;
                    model.com.LogTable();
                },
                //搜索
                searchLog: function () {
                    model.com.LogTable();
                },

                //处理报警数据
                AlarmTips: function (list, device) {
                    if (list) {
                        device.currentAlarm.forEach(function (alarm) {
                            var n = 0;
                            list.forEach(function (item) {
                                if (item.AlarmName.search(alarm.ID) !== -1) {
                                    if (n) {
                                        alarm.content += "</br>";
                                        alarm.content += item.AlarmName;
                                    } else {
                                        alarm.content = item.AlarmName;
                                        n++;
                                    }
                                }
                            })
                        });

                    }
                },
                //获取日志数据
                LogTable: function () {
                    $com.app.loading('数据加载中...');
                    $page.init($('#log').closest('table'), null, {
                        $URI: '/DMSDeviceStatus/DetailDeviceInfo', 
                        $TYPE: 'Get',
                        PageCountProp: 'info',   //   服务器返回总页数的属性名称
                        DataListProp: 'list',    //  服务器返回数据列表的属性名称
                        DeviceID: model.data.DeviceID,
                        Status: 1,
                        EndTime: model.data.timeSection[1],
                        StartingTime: model.data.timeSection[0],
                        PageSize: 10,
                    }, function (res, wPageSize, wPageIndex) {
                        model.data.Log = res;
                        $com.app.loaded();
                    });
                },
                //重置
                reset: function () {
                    model.data.timeSection.splice(0, 2,
                        mZCommitStartTime, mZCommitEndTime,
                    );
                },
                //刷新
                Refresh: function () {
                    $com.app.loading('数据加载中...');
                    model.com.getAreaDeviceState({AreaID: model.data.Area.AreaID, Status: -1}, function (res) {
                        model.data.list = res.list;
                        model.data.Probability.Open = Number((model.data.Area.OpenNum / model.data.Area.DeviceCount).toFixed(2)) * 100;
                        model.data.Probability.Close = Number((model.data.Area.CloseNum / model.data.Area.DeviceCount).toFixed(2)) * 100;
                        model.data.Probability.Fault = Number((model.data.Area.FaultNum / model.data.Area.DeviceCount).toFixed(2)) * 100;
                        res.list.forEach(function (item) {
                            if (item.DeviceType == 16) {
                                model.data.Entirety.push(item);
                            } else if (item.DeviceType == 19) {
                                model.data.Move.push(item);
                            }
                            ;
                            if (item.Status == 0) {
                                item.colour = "rgb(137,132,132)"
                                item.StatusText = "关机"
                            } else if (item.Status & 1) {
                                item.colour = 'rgb(23,117,199)';
                                item.StatusText = "开机"
                            } else if (item.Status & 2) {
                                item.colour = 'rgb(44,217,47)';
                                item.StatusText = "运行"
                            } else if (item.Status & 4) {
                                item.colour = '#ff5000';
                                item.StatusText = "停止"
                            } else if (item.Status & 8) {
                                item.colour = '#eee307';
                                item.StatusText = "急停"
                            } else if (item.Status & 16) {
                                item.colour = '#f80404';
                                item.StatusText = "报警"
                            } else if (item.Status & 32) {
                                item.colour = '#00fdd5';
                                item.StatusText = "手动"
                            } else if (item.Status & 64) {
                                item.colour = '#2c955e';
                                item.StatusText = "自动"
                            } else if (item.Status & 128) {
                                item.colour = '#db1c95';
                                item.StatusText = "预留"
                            }
                        });
                    });


                    vm.DeviceAlarmGet({AreaID: model.data.Area.AreaID, Active: -1}, function (res) {
                        var alarm = {};
                        res.list.forEach(function (item) {
                            (alarm[item.DeviceID] || (alarm[item.DeviceID] = [])).push(item);
                        });
                        vm.alarmList = alarm;
                        vm.moveDevice(alarm);
                        $com.app.loaded();
                    })

                },
                //处理移动驾车机报警
                moveDevice: function (data) {
                    for (const dataKey in data) {
                        vm.Move.forEach(function (device) {
                            if (!device.currentAlarm) {
                                var arr = $com.util.Clone(alarmData);
                                vm.$set(device, 'currentAlarm', arr);
                            }
                            if (device.DeviceID == dataKey) {
                                vm.AlarmTips(data[dataKey], device)
                            }
                        })
                    }
                },
                //获取当前区域设备的状态
                getAreaDeviceState: function (data, fn, context) {
                    var d = {
                        $URI: '/DMSDeviceStatus/Current',
                        $TYPE: 'Get',
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取当前报警信息
                DeviceAlarmGet: function (data, fn, context) {
                    var d = {
                        $URI: "/DMSDeviceAlarm/Current",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                // 整理后的整体式地下驾车机组报警参数
                statusOverviewFn: function (data) {

                    var arr = []
                    for (var i = 1; i < 17; i++) arr.push({bh1: [], bh2: [], ch: [], rest: []})

                    data.forEach(function (item) {
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
            }
        })
        model.init();


    });

