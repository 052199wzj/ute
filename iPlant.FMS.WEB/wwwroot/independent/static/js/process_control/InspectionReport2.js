require([
        '../static/utils/js/jquery-3.1.1',
        '../static/utils/js/base/paging',
        '../static/utils/js/base/base',
    ],
    function($lin, $page, $com){
        var mZCommitStartTime = $com.util.format('yyyy-MM-dd', new Date().getTime() - 30 * 24 * 3600 * 1000);
        var mZCommitEndTime = $com.util.format('yyyy-MM-dd', new Date().getTime() + 24 * 3600 * 10);

        var model = $com.Model.create({
            el: '#fzy-accessLibrary',
            VueName: 'vm',
            name: '检修库监视',
            data: {
                // 设备状态总览
                overviewEquipmentStatus: {
                    DeviceCount: 0,
                    off: 0, // 关机
                    on: 0,// 开机
                    alarm: 0, // 报警 - 故障
                },
                // 设备状态总览 - 列表显示
                overviewEquipmentStatusList: [],
                // 设备列表
                deviceList: [],
                deviceHistory: {
                    show: false,
                    search: {
                        startTime: '',
                        endTime: '',
                        timeSection: [ mZCommitStartTime, mZCommitEndTime ],
                    },
                    check: {},
                    data: [],
                },
            },
            computed: {},
            filters: {
                // 百分号
                percent: fzyTools.vue.filters.percent,
                // 设备状态
                deviceStatus: fzyTools.vue.filters.deviceStatus,
                // ms 转时分秒
                toDHMS: fzyTools.vue.filters.toDHMS,
            },
            configure: function(){
                this.run();
            },
            events: function(){
            },
            run: function(){
                model.com.getEquipmentList();
                model.com.getCurrentArea();
            },
            com: {
                // 获取机器状态
                getStatus: fzyTools.vue.methods.getStatus,
                // 设备状态
                getCurrentArea: function(){
                    model.com.getCurrentAreaHttp({
                        Name: '',
                        AssetNo: '',
                        DeviceType: -1,
                        ModelID: -1,
                        FactoryID: -1,
                        WorkShopID: -1,
                        LineID: -1,
                        TeamID: -1,
                        AreaID: -1,
                        Status:-1,
                    }, function(res){
                        var s = model.data.overviewEquipmentStatus;
                        res.list.forEach(function(item){
                            item.StatusCount_ = model.com.getStatus(item.StatusCount);
                            s.DeviceCount += item.DeviceCount;
                            s.off += item.StatusCount_.off;
                            s.on += item.StatusCount_.on;
                            s.alarm += item.StatusCount_.alarm;
                        });
                        model.data.overviewEquipmentStatusList = res.list;

                    });
                },
                // 设备状态点击事件
                districtClick: function(district){
                    district.OpenNum = district.StatusCount_.on;//开机数量
                    district.CloseNum = district.StatusCount_.off;//关机数
                    district.FaultNum = district.StatusCount_.alarm;//故障数量
                    var vdata = {
                        'header': district.AreaName,
                        'href': './process_control/CarLiftingJackReport2.html?' + $com.uri.setUrlQuery(district),
                        'id': 'CarLiftingJackReport2',
                        'src': './static/images/logpng/监控.png',
                    };

                    window.parent.iframeHeaderSet(vdata);
                    window.callFunctionTrigger('CarLiftingJackReport2', district);
                },
                // 设备状态边框颜色
                equipmentBorderColor: function(status){
                    if( status.alarm ){
                        return '#D9001B';
                    }
                    if( status.on ){
                        return '#51D351';
                    }
                    return '#999999';
                },
                // 获取设备列表
                getEquipmentList: function(){
                    $com.app.loading('数据加载中...');
                    // $page.init($('#fzy-equipment-table').closest('table'), null, {
                    //     $URI: '/DMSDeviceStatus/Current', 
                    //     $TYPE: 'Get',
                    //     PageCountProp: 'info',   //   服务器返回总页数的属性名称
                    //     DataListProp: 'list',    //  服务器返回数据列表的属性名称
                    //     PageSize: 10,
                    // }, function(res){
                    //     model.data.deviceList = res;
                    //     $com.app.loaded();
                    //
                    // });
                    model.com.getDeviceStatus({Status:-1},function (res){
                        model.data.deviceList = res.list;
                        $com.app.loaded();
                    })
                },
                // 设备详情按钮
                deviceInfoClick: function(device){
                    var list = { ID: device.DeviceID };
                    var vdata = {
                        'header': '设备详情',
                        'id': 'DeviceParticulars',
                        'href': './process_control/DeviceParticulars.html?' + $com.uri.setUrlQuery(list),
                        'src': './static/images/logpng/车辆.png',
                    };
                    window.parent.iframeHeaderSet(vdata);
                    window.callFunctionTrigger('DeviceParticulars', list);
                },
                // 查看历史按钮
                deviceHistoryClick: function(device){
                    model.data.deviceHistory.show = true;
                    model.data.deviceHistory.check = device;
                    $com.app.loading('数据加载中...');
                    $page.init($('#fzy-device-history-table').closest('table'), null, {
                        $URI: '/DMSDeviceStatus/DetailDeviceInfo', 
                        $TYPE: 'Get',
                        PageCountProp: 'info',   //   服务器返回总页数的属性名称
                        DataListProp: 'list',    //  服务器返回数据列表的属性名称
                        DeviceID: device.DeviceID,
                        Status: 1,
                        EndTime:  model.data.deviceHistory.search.timeSection[1],
                        StartingTime: model.data.deviceHistory.search.timeSection[0],
                        PageSize: 10,
                    }, function(res){
                        $com.app.loaded();
                        model.data.deviceHistory.data = res;
                    });
                },
                // 重置输入框
                removeInput(){
                    model.data.deviceHistory.search.timeSection.splice(0, 2,
                        mZCommitStartTime, mZCommitEndTime,
                    );
                },
                // 查询
                searchClick(){
                    model.com.deviceHistoryClick(model.data.deviceHistory.check);
                },
                // http --------------------------
                //获取当前区域
                // 设备状态
                getCurrentAreaHttp: function(data, fn, context){
                    var d = {
                        $URI: '/DMSDeviceStatus/CurrentArea',
                        $TYPE: 'Get',
                    };

                    function err(){
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取单条设备
                getDeviceInfoHttp: function(data, fn, context){
                    var d = {
                        $URI: '/DMSDeviceStatus/DetailDeviceInfo',
                        $TYPE: 'Get',

                    };

                    function err(){
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取单条设备
                getDeviceStatus: function(data, fn, context){
                    var d = {
                        $URI: '/DMSDeviceStatus/Current',
                        $TYPE: 'Get',

                    };

                    function err(){
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
            },

        });
        model.init();
    });
