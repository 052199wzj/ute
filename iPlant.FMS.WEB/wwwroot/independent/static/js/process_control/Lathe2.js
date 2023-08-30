require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base',],
    function ($lin, $com) {
        var mDeviceID = 9;
        var model = $com.Model.create({
            el: "#fxy-app",
            VueName: "vm",
            name: '通用界面',
            data: {
                bo: {
                    name: "高度",
                    bool: true
                },
                //开机
                StartingUp: {},
                //设备参数
                list:[],
                //报警
                Alarm:[]

            },
            type: $com.Model.MAIN, //主方法

            configure: function () {
                this.run();
            },
            events: function () {
                // window.setFunctionTrigger("GeneralPage", function (res) {
                //     mDeviceID =  res.ID;
                //     model.com.Refresh();
                // });
            },

            run: function () {
                var columns1 =[{
                    field: 'AlarmCode',
                    title: '报警编码'
                }, {
                    field: 'AlarmDescc',
                    title: '报警备注'
                }, {
                    field: 'StatusTime',
                    title: '报警时刻'
                }]
                model.com.table("#fxy-alarm",columns1,[])
                var columns2 =[{
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
                }]
                model.com.table("#parameter",columns2,[])
                //     mDeviceID =  model.query.ID;
                model.com.Refresh()
            },

            com: {
                Refresh:function () {
                    model.com.DeviceRealParameter({DeviceID:mDeviceID},function (res) {

                    });
                    model.com.getDeviceStatus({},function (res) {
                        res.list.forEach(function (item) {
                            if (item.ID == mDeviceID){
                                if (item.Status==0){
                                    item.bgColor = {
                                        color:"rgb(215,215,215)"
                                    };
                                    item.StatusText = "关机"
                                }else if (item.Status & 1){
                                    item.bgColor = {
                                        color:'rgb(112,182,3)'
                                    };
                                    item.StatusText = "开机"
                                }
                                else if (item.Status & 2){
                                    item.bgColor = {
                                        color:'rgb(112,182,3)'
                                    };
                                    item.StatusText = "开机"
                                }else if (item.Status & 4){
                                    item.bgColor = {
                                        color:'red'
                                    };
                                    item.StatusText = "停止"
                                }else if (item.Status & 8){
                                    item.bgColor = {
                                        color:'#3b0394'
                                    };
                                    item.StatusText = "急停"
                                }else if (item.Status & 16){
                                    item.bgColor = {
                                        color:'#d58512'
                                    };
                                    item.StatusText = "报警"
                                }else if (item.Status & 32){
                                    item.bgColor = {
                                        color:'#3E90C6'
                                    };
                                    item.StatusText = "手动"
                                }else if (item.Status & 64){
                                    item.bgColor = {
                                        color:'#00FF00'
                                    };
                                    item.StatusText = "自动"
                                }else if (item.Status & 128){
                                    item.bgColor = {
                                        color:'#00FF00'
                                    };
                                    item.StatusText = "预留"
                                }
                                model.data.StartingUp = item;

                                return false
                            }
                        })
                    });
                    model.com.DeviceAlarmGet({},function (res) {

                    })
                },
                table:function(id,columns,data){
                    $(id).bootstrapTable({
                        toolbar: "#toolbar",
                        // striped: true, //是否显示行间隔色
                        height:280,
                        sortable: false,//是否排序
                        // search: true, //是否显示表格搜索，此搜索是客户端搜索，不会进服务端
                        // strictSearch: true, //是否显示刷新
                        //showColumns: true, //是否显示所有的列
                        // showRefresh: true, //是否显示刷新按钮
                        //minimumCountColumns: 2, //最少允许的列数
                        // showToggle:true, //是否显示详细视图和列表视图的切换按钮
                        // cardView: false, //是否显示详细视图
                        columns: columns,
                        data: data
                    })
                },
                //获取报警信息
                DeviceAlarmGet: function (data, fn, context) {
                    var d = {
                        $URI: "/DMSDeviceAlarm/DeviceInfo",
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