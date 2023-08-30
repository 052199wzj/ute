require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'],
    function ($lin, $com) {
        var mDeviceID ;
        var model = $com.Model.create({
            el: "#fxy-app",
            VueName: "vm",
            name: '移动式架车机',
            data: {
                newdate:"",
                //高度限位切换
                bo: {
                    name: "高度",
                    bool: true
                },
                //报警
                parameter:{},//设备参数和报警
                deviceData:{},//设备实时参数
                alarmList:[],
                alarmData:[
                    {
                        ID:"1.1",
                        content:"",
                    },
                    {
                        ID:"1.2",
                        content:"",
                    },
                    {
                        ID:"1.3",
                        content:"",
                    },
                    {
                        ID:"1.4",
                        content:"",
                    },
                    {
                        ID:"2.1",
                        content:"",
                    },
                    {
                        ID:"2.2",
                        content:"",
                    },
                    {
                        ID:"2.3",
                        content:"",
                    },
                    {
                        ID:"2.4",
                        content:"",
                    },
                    {
                        ID:"3.1",
                        content:"",
                    },
                    {
                        ID:"3.2",
                        content:"",
                    },
                    {
                        ID:"3.3",
                        content:"",
                    },
                    {
                        ID:"3.4",
                        content:"",
                    },
                    {
                        ID:"4.1",
                        content:"",
                    },
                    {
                        ID:"4.2",
                        content:"",
                    },
                    {
                        ID:"4.3",
                        content:"",
                    },
                    {
                        ID:"4.4",
                        content:"",
                    },
                ]
            },
            type: $com.Model.MAIN, //主方法

            configure: function () {
                this.run();
            },
            events: function () {
                window.setFunctionTrigger("MobileCarRackMachine", function (res) {
                    mDeviceID =  res.ID;
                    model.com.Refresh();
                });
            },
            filters: {
                time_H: function(ms){
                    var days = parseInt(ms / (60 * 60 * 24));
                    var hours = parseInt((ms % (60 * 60 * 24)) / (60 * 60));
                    var minutes = parseInt((ms % (60 * 60)) / ( 60));
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
                mDeviceID =  model.query.ID
                //格式化日期格式
                Date.prototype.Format = function (fmt) {
                    var o = {
                        "M+": this.getMonth() + 1, //月份
                        "d+": this.getDate(), //日
                        "H+": this.getHours(), //小时
                        "m+": this.getMinutes(), //分
                        "s+": this.getSeconds(), //秒
                        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                        "S": this.getMilliseconds() //毫秒
                    };
                    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                    for (var k in o)
                        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                    return fmt;
                }
                setInterval(function () {
                    model.data.newdate = new Date().Format("yyyy-MM-dd HH:mm:ss");
                },1000)
                model.com.Refresh();
                setInterval(function () {
                    model.com.Refresh();
                },60000)
            },

            com: {
                //刷新页面
                Refresh:function(){
                    model.com.getDeviceStatus({DeviceID:6,Active:-1,Status:-1},function (res) {
                            res.list.forEach(function (item) {
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
                        })
                            vm.deviceData = res.list[0];
                    })
                    model.com.DeviceParameterGet({DeviceID:mDeviceID}, function (res) {
                            vm.parameter = res.info;
                    })
                    vm.DeviceAlarmGet({DeviceID:mDeviceID,Active:-1},function (res){
                        vm.alarmList = res.list;
                        vm.AlarmTips(vm.alarmList);
                    })
                },
                //切换高度和限位
                switchover(n) {
                    if (n) {
                        model.data.bo = {name: "限位", bool: false}
                    } else {
                        model.data.bo = {name: "高度", bool: true}
                    }
                },
                //跳转到通用界面
                General(){
                    var vdata = {
                        'header': "通用界面",
                        'id':"GeneralPage",
                        'href': `./process_control/GeneralPage.html?ID=${mDeviceID}`,
                        'src': `./static/images/logpng/GeneralPage.png`
                    };
                    window.parent.iframeHeaderSet(vdata);
                    window.callFunctionTrigger("GeneralPage",mDeviceID);
                },
                //处理报警数据
                AlarmTips:function (list){
                    if (list){
                        vm.alarmData.forEach(function (alarm){
                            var n = 0;
                            list.forEach(function (item){
                                if (item.AlarmName.search(alarm.ID)!==-1){
                                    if (n){
                                        alarm.content += "</br>";
                                        alarm.content += item.AlarmName;
                                    }else {
                                        alarm.content = item.AlarmName;
                                        n++;
                                    }
                                }
                            })
                        })
                    }
                },
                //获取报警信息
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
                //获取设备信息
                DeviceParameterGet: function (data, fn, context) {
                    var d = {
                        $URI: "/DMSDeviceRealParameter/DeviceCurrentAll",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取所有设备状态信息
                getDeviceStatus: function (data, fn, context) {
                    var d = {
                        $URI: "/DMSDeviceStatus/Current",
                        $TYPE: "Get",

                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
            }
        })
        model.init();


    });