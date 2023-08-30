require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'],
    function ($lin, $com) {
        var mDeviceID;
        var model = $com.Model.create({
            el: "#fxy-StatusSurveillance",
            VueName: "vm",
            name: '设备状态监视',
            data: {
                list: [],////存储设备状态
                areaList: [],
                areaID: null,
                status: null,
            },
            type: $com.Model.MAIN, //主方法

            configure: function () {
                this.run();
            },
            events: function () {
            },
            run: function () {
                model.com.getArea({Active: 1}, function (res) {
                    model.data.areaList = res.list;
                });
                model.com.Refresh(-1, -1);
            },

            com: {

                Refresh: function (areaID, status) {
                    areaID = areaID || -1;
                    status = status || -1;
                    $com.app.loading('数据加载中...');
                    model.com.getDeviceStatus({AreaID: areaID, Status: status}, function (res) {
                        model.data.list = res.list;
                        model.data.list.forEach(function (item) {
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
                                item.StatusText = "调试"
                            }
                            switch (item.DeviceType) {
                                case 19:
                                    item.visualShow = true;
                                    break;
                                case 17:
                                    item.visualShow = true;
                                    break;
                                case 16:
                                    item.visualShow = true;
                                    break;
                                default:
                                    item.visualShow = false;
                            }
                        })
                        $com.app.loaded();
                    })
                },
                //可视化按钮
                visual: function (Device) {
                    var url = '';
                    switch (Device.DeviceType) {
                        case 19:
                            url = 'MobileCarRackMachine';
                            break;
                        case 17:
                            url = 'MetroReport';
                            break;
                        case 16:
                            url = 'LntegralCarLiftingMachine2';
                            break;
                    }
                    var vdata = {
                        'header': Device.DeviceName,
                        'id': url,
                        'href': `./process_control/${url}.html?ID=${Device.DeviceID}`,
                        'src': `./static/images/logpng/${url}.png`,
                    };
                    window.parent.iframeHeaderSet(vdata);
                    window.callFunctionTrigger(url, Device.DeviceID);
                },
                //鼠标移入移出事件
                mouseOver: function ($event, index) {
                    if (!vm.list[index].ImageIcon) {
                        return
                    }
                    $($(".equipment-drawing")[index]).fadeIn(300);
                    var wbodyWidth = $("body").width();
                    var wbodyHeight = $("body").height();
                    if (wbodyWidth - $event.pageX < 500) {
                        $($(".equipment-drawing")[index]).css({"left": "-63%"})
                    } else {
                        $($(".equipment-drawing")[index]).css({"left": "23%"})
                    }
                    if (wbodyHeight - $event.pageY < 380) {
                        $($(".equipment-drawing")[index]).css({"top": "-315%"})
                    } else {
                        $($(".equipment-drawing")[index]).css({"top": "15%"})
                    }
                },
                mouseLeave: function (index) {
                    $($(".equipment-drawing")[index]).fadeOut(300);
                },
                //点击设备详情界面
                particulars: function (ID, Button) {
                    var list = {ID, Button};
                    var vdata = {
                        'header': "设备详情",
                        'id': "DeviceParticulars",
                        'href': './process_control/DeviceParticulars.html?' + $com.uri.setUrlQuery(list),
                        'src': './static/images/logpng/车辆.png'
                    };
                    window.parent.iframeHeaderSet(vdata);
                    window.callFunctionTrigger("DeviceParticulars", list);

                },

                //搜索
                search: function () {
                    model.com.Refresh(model.data.areaID, model.data.status);
                },
                //重置
                reset: function () {
                    model.data.areaID = null;
                    model.data.status = null;
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
                //获取区域信息
                getArea: function (data, fn, context) {
                    var d = {
                        $URI: "/BMSRegion/All",
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