require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base',],
    function ($lin, $com) {
        var mDeviceID = 9;
        var model = $com.Model.create({
            el: "#fxy-GeneralPage",
            VueName: "vm",
            name: '通用界面',
            data: {
                Show:{
                    name:"隐藏",
                    bool:true,
                },
                bo: {
                    name: "高度",
                    bool: true
                },
                //开机
                StartingUp: {},
                //设备参数
                list: [],
                //报警
                Alarm: []

            },
            type: $com.Model.MAIN, //主方法

            configure: function () {
                this.run();
            },
            events: function () {
                window.setFunctionTrigger("GeneralPage", function (res) {
                    mDeviceID =  res.ID;
                    model.com.Refresh();
                });
            },

            run: function () {
                mDeviceID =  model.query.ID;
                model.com.Refresh()
            },

            com: {
                //刷新
                Refresh: function () {
                    model.com.DeviceRealParameter({DeviceID: mDeviceID}, function (res) {
                        var columns = [
                            {
                                field: 'ParameterName',
                                title: '参数名称'
                            }, {
                                field: 'ParameterCode',
                                title: '参数编码'
                            }, {
                                field: 'ParameterValue',
                                title: '参数值'
                            }, {
                                field: 'ParameterDesc',
                                title: '参数备注'
                            }
                        ]
                        model.com.table("#parameter", columns, res.list, 430)
                    });
                    model.com.getDeviceStatus({}, function (res) {
                        res.list.forEach(function (item) {
                            if (item.ID == mDeviceID) {
                                if (item.Status == 0) {
                                    item.bgColor = {
                                        color: "rgb(215,215,215)"
                                    };
                                    item.StatusText = "关机"
                                } else if (item.Status & 1) {
                                    item.bgColor = {
                                        color: 'rgb(178,238,84)'
                                    };
                                    item.StatusText = "开机"
                                } else if (item.Status & 2) {
                                    item.bgColor = {
                                        color: 'rgb(112,182,3)'
                                    };
                                    item.StatusText = "开机"
                                } else if (item.Status & 4) {
                                    item.bgColor = {
                                        color: 'red'
                                    };
                                    item.StatusText = "停止"
                                } else if (item.Status & 8) {
                                    item.bgColor = {
                                        color: '#3b0394'
                                    };
                                    item.StatusText = "急停"
                                } else if (item.Status & 16) {
                                    item.bgColor = {
                                        color: '#d58512'
                                    };
                                    item.StatusText = "报警"
                                } else if (item.Status & 32) {
                                    item.bgColor = {
                                        color: '#3E90C6'
                                    };
                                    item.StatusText = "手动"
                                } else if (item.Status & 64) {
                                    item.bgColor = {
                                        color: '#00FF00'
                                    };
                                    item.StatusText = "自动"
                                } else if (item.Status & 128) {
                                    item.bgColor = {
                                        color: '#7ee2b9'
                                    };
                                    item.StatusText = "预留"
                                }
                                model.data.StartingUp = item;

                                return false
                            }
                        })
                    });
                    model.com.DeviceAlarmGet({DeviceID: mDeviceID}, function (res) {
                        var columns = [{
                            field: 'AlarmCode',
                            title: '报警编码'
                        }, {
                            field: 'AlarmDescc',
                            title: '报警备注'
                        }, {
                            field: 'StatusTime',
                            title: '报警时刻'
                        }]
                        model.com.table("#fxy-alarm", columns, res.list, 300)
                    })
                },
                //切换
                Conceal:function(){
                    if (model.data.Show.bool){
                        model.data.Show = {
                            name:"显示",
                            bool:false,
                        }
                    }else {
                        model.data.Show = {
                            name:"隐藏",
                            bool:true,
                        }
                    }
                },
                //列表
                table: function (id, columns, data, height) {
                    //创建表格
                    $(id).bootstrapTable({
                        toolbar: "#toolbar",
                        height: height,
                        sortable: false,//是否排序
                        search: true, //是否显示表格搜索，此搜索是客户端搜索，不会进服务端
                        columns: columns,
                        data: data
                    })
                    //解决当浏览器窗口变化是，表头与表格不对齐
                    $(id).bootstrapTable(); // init via javascript
                    $(window).resize(function () {
                        $(id).bootstrapTable('resetView');
                    });
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
                DeviceRealParameter: function (data, fn, context) {
                    var d = {
                        $URI: "/DMSDeviceRealParameter/All",
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