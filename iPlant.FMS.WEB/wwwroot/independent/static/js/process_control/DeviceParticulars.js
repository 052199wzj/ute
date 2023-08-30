require([
        '../static/utils/js/jquery-3.1.1',
        '../static/utils/js/base/paging',
        '../static/utils/js/base/base',
        '../static/utils/js/base/echarts',
    ],
    function($lin, $page, $com, $echarts){
        window.HomeRefrush = function(){
            vm.AlarmCont = 0;
            vm.Refresh();
        };
        var Device;
        var myCharts= {};//存储Echarts 对象
        var wData = [];
        var colors = [ '#5470c6', '#91cc75' ];
        var colors3 = [ '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4',
                        '#ea7ccc' ];
        var AlarmTypeArray = [ '默认', '状态', '报警', '参数' ];
        var AlarmLevelArray = [ '默认', 'A级', 'B级', 'C级', 'D级' ];
        var StatusArray = [ '默认', '已报修', '已检修' ];
        var pic = {
            value: 1,
            name: '暂无数据'
        };
        var MaintenanceClassData =  [
            { value: 0, name: 'A级' },
            { value: 0, name: 'B级' },
            { value: 0, name: 'C级' },
            { value: 0, name: 'D级' },
        ];
        // 最小有效日期
        var minTime = new Date('2020-01-01 00:00:00');
        var model = $com.Model.create({
            el: '#fxy-particulars',
            VueName: 'vm',
            name: '设备状态监视',
            data: {
                AlarmCode: null,
                AlarmTable: {
                    show: true,
                    title: '当前报警',
                },//控制当前报警表
                LastMaintenance: {
                    AlarmType: '',
                    RepairRemark: '',
                    AlarmLevel: '',
                    RepairStartTime: '',
                    RepairEndTime:'',
                },
                Date: {
                    StartingTime: null,//选择起始时间
                    EndTime: null,//选择结束时间
                },//存储查询时间
                parameter: {},//存储点击单台设备传过来的参数
                ParameterList: [],//存储参数
                FaultType: {
                    title: {
                        text: '设备报警类型top5',
                        left: 'center',
                    },
                    tooltip: {
                        trigger: 'item',
                    },
                    legend: {
                        orient: 'vertical',
                        type: 'scroll',
                        right: 10,
                        top: 20,
                        bottom: 20,
                    },
                    series: [
                        {
                            type: 'pie',
                            radius: '50%',
                            data: [0],
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                                },
                            },
                        },
                    ],
                },//设备故障类型饼状图
                AlarmCurrentData: [],
                StatusMessages: {
                    color: colors,
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                        },
                    },
                    grid: {
                        right: '20%',
                    },
                    legend: {
                        orient: 'vertical',
                        type: 'scroll',
                        right: 10,
                        top: 20,
                        bottom: 20,
                        data: [ '状态频次', '状态时长' ],
                    },
                    xAxis: [
                        {
                            type: 'category',
                            axisTick: {
                                alignWithLabel: true,
                            },
                            data: [ '开机', '运行', '停止', '急停', '报警', '手动', '自动', '预留' ],
                        },
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '状态频次',
                            min: 0,
                            position: 'left',
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    color: colors[0],
                                },
                            },
                            axisLabel: {
                                formatter: '{value} 次',
                            },
                        },
                        {
                            type: 'value',
                            name: '状态时长',
                            min: 0,
                            position: 'right',
                            offset: 0,
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    color: colors[1],
                                },
                            },
                            axisLabel: {
                                formatter: '{value} H',
                            },
                        },
                    ],
                    series: [
                        {
                            name: '状态频次',
                            type: 'bar',
                            data: [ 0, 0, 0, 0, 0, 0, 0, 0 ],
                        },
                        {
                            name: '状态时长',
                            type: 'bar',
                            yAxisIndex: 1,
                            data: [ 0, 0, 0, 0, 0, 0, 0, 0 ],
                        },
                    ],
                },//状态记录柱状图
                HistoryAlarm: [],//历史报警数据
                HistoryStatusData: [],//状态统计数据
                AlarmCont: 0,//报警次数
                currentAssignmentShow: false,//当前作业类列表显示与隐藏
                visualShow: true,//可视化按钮的显示与隐藏
                AssignmentListCurrent: [
                    {
                        OrderNo: 0,
                        MetroNo: 0,
                        WorkPieceNo: 0,
                        StartTime: '2021-6-29',
                        EndTime: '2021-7-1',
                        StatusText: '关机',
                        Remark: '设备检修',
                        ItemList: [
                            {
                                ParameterNo: 1001,
                                DataType: 3,
                                SampleTime: '2020-1-1',
                                ParameterName: '径向圆跳动',
                                ParameterDesc: '备注',
                                ParameterValue: '前:100; 后200',
                            },
                            {
                                ParameterNo: 1001,
                                DataType: 2,
                                SampleTime: '2020-1-1',
                                ParameterName: '径向圆跳动',
                                ParameterDesc: '备注',
                                ParameterValue: 10,
                            },
                            {
                                ParameterNo: 1001,
                                DataType: 1,
                                SampleTime: '2020-1-1',
                                ParameterName: '径向圆跳动',
                                ParameterDesc: '备注',
                                ParameterValue: true,
                            },
                            {
                                ParameterNo: 1001,
                                DataType: 4,
                                SampleTime: '2020-1-1',
                                ParameterName: '径向圆跳动',
                                ParameterDesc: '备注',
                                ParameterValue: 2.2222,
                            },
                            {
                                ParameterNo: 1001,
                                DataType: 5,
                                SampleTime: '2020-1-1',
                                ParameterName: '径向圆跳动',
                                ParameterDesc: '备注',
                                ParameterValue: 3.3333333,
                            },
                        ],
                    },
                ],//当前作业信息
                AssignmentListHistory: [],//历史作业信息记录
                AssignmentListParticulars: {},//详情作业信息
                ParticularsShow: true,//作业信息详情切换
                MaintenanceData: [],//维修数据表
                MaintenanceCont:0,
                timeSearch:[],
                MaintenanceClass:{
                    title: {
                        text: '维修等级统计饼状图',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        orient: 'vertical',
                        type: 'scroll',
                        right: 10,
                        top: 20,
                        bottom: 20,
                    },
                    series: [
                        {
                            name: '维修等级',
                            type: 'pie',
                            radius: '50%',
                            data: [
                                { value: 0, name: 'A级' },
                                { value: 0, name: 'B级' },
                                { value: 0, name: 'C级' },
                                { value: 0, name: 'D级' },
                            ],
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                },
            },
            type: $com.Model.MAIN, //主方法
            configure: function(){
                this.run();
            },
            events: function(){
                window.setFunctionTrigger('DeviceParticulars', function(res){
                    Device = res;
                    if( vm.parameter.DeviceID != Device.ID ){
                        vm.parameter.DeviceID = Device.ID;
                        vm.parameter.Button = Device.Button;
                        vm.Refresh();
                    }

                });
                // 监听页面大小变化
                window.addEventListener('resize', function(){
                    for (const key in myCharts) {
                        myCharts[key].resize();
                    }
                });
            },
            run: function(){
                $com.app.loading('数据加载中...');
                vm.reset();
                Device = model.query;
                vm.parameter.DeviceID = Device.ID;
                vm.parameter.Button = Device.Button;
                vm.Refresh();
                //时间组件
                vm.getDate();
            },
            //过滤器
            filters: {
                AlarmType: function(value){
                    return AlarmTypeArray[value];
                },
                AlarmLevel: function(value){
                    return AlarmLevelArray[value];
                },
                Status: function(value){
                    return StatusArray[value];
                },
                time_H: function(msd){
                    var time =msd
                    if (null != time && "" != time) {
                        if (time > 60 && time < 60 * 60) {
                            time = parseInt(time / 60.0) + "分钟" + parseInt((parseFloat(time / 60.0) -
                                parseInt(time / 60.0)) * 60) + "秒";
                        }
                        else if (time >= 60 * 60 && time < 60 * 60 * 24) {
                            time = parseInt(time / 3600.0) + "小时" + parseInt((parseFloat(time / 3600.0) -
                                parseInt(time / 3600.0)) * 60) + "分钟" +
                                parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
                                    parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "秒";
                        } else if (time >= 60 * 60 * 24) {
                            time = parseInt(time / 3600.0/24) + "天" +parseInt((parseFloat(time / 3600.0/24)-
                                parseInt(time / 3600.0/24))*24) + "小时" + parseInt((parseFloat(time / 3600.0) -
                                parseInt(time / 3600.0)) * 60) + "分钟" +
                                parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
                                    parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "秒";
                        }
                        else {
                            time = parseInt(time) + "秒";
                        }
                    }
                    return time;
                },
                effectiveDate:function(e) {
                    if (!e) {
                        return '-';
                    }
                    var now = new Date(e);
                    return now > minTime ? e : '-';
                },
            },
            com: {
                Refresh: function(){
                    //更改Tab样式
                    vm.TabStyle(vm.parameter.Button);
                    //设备信息初始化
                    vm.Initialize(vm.parameter.DeviceID,vm.parameter.Button);

                },
                //改变tab样式
                TabStyle: function(Button = 'parameter'){
                    if( Button == 'parameter' ){
                        $($('.tag-vessel > li')[0]).addClass('active');
                        $($('.tab-content > div')[0]).addClass('in active');
                        $($('.tag-vessel > li')[1]).removeClass('active');
                        $($('.tab-content > div')[1]).removeClass('in active');
                        $($('.tag-vessel > li')[2]).removeClass('active');
                        $($('.tab-content > div')[2]).removeClass('in active');
                        $($('.tag-vessel > li')[3]).removeClass('active');
                        $($('.tab-content > div')[3]).removeClass('in active');
                        $($('.tag-vessel > li')[4]).removeClass('active');
                        $($('.tab-content > div')[4]).removeClass('in active');
                        $com.app.loading('数据加载中');
                        //获取参数
                        vm.getDeviceParameter({
                            DeviceID: vm.parameter.DeviceID,
                            StartTime: vm.timeSearch[0],
                            EndTime: vm.timeSearch[1],
                        }, function(res){
                            vm.ParameterList = res.list;
                            vm.ParameterList = vm.ParameterList.filter(function (item){
                               return  item.DataClass==3
                            })
                            $com.app.loaded();
                        });
                    } else if( Button == 'status' ){
                        $($('.tag-vessel > li')[2]).addClass('active');
                        $($('.tab-content > div')[2]).addClass('in active');
                        $($('.tag-vessel > li')[1]).removeClass('active');
                        $($('.tab-content > div')[1]).removeClass('in active');
                        $($('.tag-vessel > li')[0]).removeClass('active');
                        $($('.tab-content > div')[0]).removeClass('in active');
                        $($('.tag-vessel > li')[3]).removeClass('active');
                        $($('.tab-content > div')[3]).removeClass('in active');
                        $($('.tag-vessel > li')[4]).removeClass('active');
                        $($('.tab-content > div')[4]).removeClass('in active');
                        //设备状态
                        vm.HistoricalStatus(vm.timeSearch[0],vm.timeSearch[1]);

                    } else if( Button == 'alarm' ){
                        $($('.tag-vessel > li')[1]).addClass('active');
                        $($('.tab-content > div')[1]).addClass('in active');
                        $($('.tag-vessel > li')[2]).removeClass('active');
                        $($('.tab-content > div')[2]).removeClass('in active');
                        $($('.tag-vessel > li')[0]).removeClass('active');
                        $($('.tab-content > div')[0]).removeClass('in active');
                        $($('.tag-vessel > li')[3]).removeClass('active');
                        $($('.tab-content > div')[3]).removeClass('in active');
                        $($('.tag-vessel > li')[4]).removeClass('active');
                        $($('.tab-content > div')[4]).removeClass('in active');
                        //饼状图接口
                        vm.AlarmPieChart();
                        //当前报警
                        vm.DeviceCurrentAlarm({ DeviceID: vm.parameter.DeviceID, Active: -1 }, function(res){
                            if( res.list.length == 0 ){
                                vm.AlarmTable = {
                                    title: '当前无报警',
                                    show:false
                                };
                                return;
                            }
                            vm.AlarmTable = {
                                title: '当前报警信息',
                                show:true
                            };
                            vm.AlarmCurrentData = res.list;
                        });
                        //历史一个月报警
                        vm.HistoricalAlarm(vm.timeSearch[0],vm.timeSearch[1]);
                    } else if( Button == 'maintain' ){
                        //设备维修
                        vm.DeviceMaintenance(vm.timeSearch[0],vm.timeSearch[1]);
                        vm.maintainStatistics({DeviceID: vm.parameter.DeviceID,Status: 2,},function (res){
                            vm.MaintenanceCont = res.DataCount;
                            vm.LastMaintenance = res.list[res.list.length-1];
                            vm.MaintenanceClass.series[0].data = MaintenanceClassData;
                            res.list.forEach(function (item){
                                vm.MaintenanceClass.series[0].data[item.AlarmLevel-1].value++;
                            })
                            vm.ECharts('MaintenanceClass', vm.MaintenanceClass);
                        });
                    } else if( Button == 'assignment' ){
                        //当前作业信息
                        vm.Assignment();
                        //作业记录
                        vm.AssignmentHistory(vm.timeSearch[0],vm.timeSearch[1]);
                    }
                },
                //搜索按钮
                search: function(type){
                    if( type == 'Alarm' ){
                        vm.HistoricalAlarm(vm.timeSearch[0],vm.timeSearch[1]);
                    } else if( type == 'Status' ){
                        vm.HistoricalStatus(vm.timeSearch[0],vm.timeSearch[1]);
                    } else if( type == 'Maintain' ){
                        vm.DeviceMaintenance(vm.timeSearch[0],vm.timeSearch[1]);
                    } else if( type == 'Assignment' ){
                        //作业记录
                        vm.AssignmentHistory(vm.timeSearch[0],vm.timeSearch[1]);
                    }
                },
                //重置按钮
                reset: function(){
                    vm.timeSearch = [vm.compareTime(new Date(),30),vm.compareTime(new Date(),-1)]
                },
                //设备信息初始化
                Initialize: function(ID,Name){
                    $com.app.loading('数据加载中...');
                    vm.AlarmCont = 0;
                    vm.Show = false;
                    vm.DeviceStatusCurrent({ DeviceID: ID ,Status:-1}, function(res){
                        res.list.forEach(function(item){
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
                        vm.parameter = $com.util.Clone(res.list[0]);
                        switch( vm.parameter.DeviceType ){
                            case 19:
                                vm.visualShow = true;
                                break;
                            case 17:
                                vm.visualShow = true;
                                break;
                            case 16:
                                vm.visualShow = true;
                                break;
                            default:
                                vm.visualShow = false;
                        }
                        vm.parameter.Button = Name;
                        $com.app.loaded();
                    });
                },
                //故障类型图表
                faultType: function(Frequency){
                    if (Frequency.length === 0) {
                        vm.FaultType.series[0].data.splice(0, vm.FaultType.series[0].data.length);
                        vm.FaultType.series[0].data.push(pic);
                        vm.ECharts('pie-chart', vm.FaultType);
                        return
                    }
                    vm.FaultType.series[0].data = [];
                    var data,
                        MaxFiveData,
                        RestData,
                        AlarmCount = 0
                    ;
                    //故障次数排序
                    data = Frequency.sort(vm.sortBy('AlarmCount', false));
                    //取出前五项,和后面所有项
                    if( data.length > 5 ){
                        MaxFiveData = data.slice(0, 5);
                        RestData = data.slice(5, data.length);
                        //合并后面所有项的数据
                        for( var i = 0; i < RestData.length; i++ ){
                            AlarmCount += RestData[i].AlarmCount;
                        }
                        //加上其他项
                        MaxFiveData.push({
                            AlarmName: '其他',
                            AlarmCount: AlarmCount,
                        });
                    } else{
                        MaxFiveData = data;
                    }
                    MaxFiveData.forEach(function(item){
                        vm.FaultType.series[0].data.push({
                            value: item.AlarmCount,
                            name: item.AlarmName,
                        });
                    });
                    vm.ECharts('pie-chart', vm.FaultType);
                },
                //调用ECharts
                //调用ECharts
                ECharts: function (IDName, option) {
                    myCharts[IDName] || (myCharts[IDName] = $echarts.init(document.getElementById(IDName)))
                    // 清除已有配置项
                    myCharts[IDName].clear();
                    myCharts[IDName].setOption(option);
                },
                //选择时间组件
                getDate: function(){
                    $('.date').datetimepicker({
                        forceParse: 0,//设置为0，时间不会跳转1899，会显示当前时间。
                        language: 'zh-CN',//显示中文
                        format: 'yyyy-mm-dd',//显示格式
                        minView: 'month',//设置只显示到月份
                        initialDate: new Date(),//初始化当前日期
                        autoclose: true,//选中自动关闭
                        todayBtn: true,//显示今日按钮
                    });
                },
                //数组排序
                sortBy: function(attr, rev){
                    //第二个参数没有传递 默认升序排列
                    if( rev == undefined ){
                        rev = 1;
                    } else{
                        rev = ( rev ) ? 1 : -1;
                    }

                    return function(a, b){
                        a = a[attr];
                        b = b[attr];
                        if( a < b ){
                            return rev * -1;
                        }
                        if( a > b ){
                            return rev * 1;
                        }
                        return 0;
                    };
                },
                //取当输入时间的前X天
                compareTime: function(myDate, selectDay){
                    let lw = new Date(myDate - 1000 * 60 * 60 * 24 * selectDay);
                    let lastY = lw.getFullYear();
                    let lastM = lw.getMonth() + 1;
                    let lastD = lw.getDate();
                    let startdate = lastY + '-' + ( lastM < 10 ? '0' + lastM : lastM ) + '-' + ( lastD < 10 ? '0' + lastD : lastD );
                    return startdate;
                },
                //历史报警
                HistoricalAlarm: function(StartTime,wEndTime){
                    $com.app.loading('数据加载中...');
                    $page.init($('.HistoryAlarm .el-table .el-table__body-wrapper > table tbody').closest('table'), null, {
                        $URI: '/DMSDeviceAlarm/DeviceInfo', 
                        $TYPE: 'Get',
                        PageCountProp: 'info',   //   服务器返回总页数的属性名称
                        DataListProp: 'list',    //  服务器返回数据列表的属性名称
                        DeviceID: vm.parameter.DeviceID,
                        EventType: 2,
                        Active: -1,
                        StartTime:StartTime,
                        wEndTime: wEndTime,
                        PageSize: 10,
                        Deeps:2,
                    }, function(res, wPageSize, wPageIndex){
                        vm.HistoryAlarm = res;
                        $com.app.loaded();
                    });
                },
                //报警饼状图
                AlarmPieChart: function(){
                    vm.DeviceHistoryAlarm({
                        DeviceID: vm.parameter.DeviceID,
                        Status:-1,
                    }, function(res){
                        //故障类型饼状图
                        vm.faultType(res.Frequency);
                        vm.AlarmCont = 0;
                        //总共报警次数
                        res.Frequency.forEach(function(item){
                            vm.AlarmCont += item.AlarmCount;
                        });
                    });
                },
                //重写状态数据
                StatusData: function(key, arr, item){
                    if( Number(key) & 1 ){
                        arr.push(item[key]);
                    } else if( Number(key) & 2 ){
                        arr.push(item[key]);
                    } else if( Number(key) & 4 ){
                        arr.push(item[key]);
                    } else if( Number(key) & 8 ){
                        arr.push(item[key]);
                    } else if( Number(key) & 16 ){
                        arr.push(item[key]);
                    } else if( Number(key) & 32 ){
                        arr.push(item[key]);
                    } else if( Number(key) & 64 ){
                        arr.push(item[key]);
                    } else if( Number(key) & 128 ){
                        arr.push(item[key]);
                    }
                },
                //设备状态信息
                HistoricalStatus: function(StartTime,EndTime){
                    $com.app.loading('数据加载中...');
                    //设备状态信息
                    $page.init($('.HistoryStatusData .el-table .el-table__body-wrapper > table tbody').closest('table'), null, {
                        $URI: '/DMSDeviceStatus/DeviceInfo', 
                        $TYPE: 'Get',
                        PageCountProp: 'info',   //   服务器返回总页数的属性名称
                        DataListProp: 'list',    //  服务器返回数据列表的属性名称
                        DeviceID: vm.parameter.DeviceID,
                        StartTime: StartTime,
                        EndTime: EndTime,
                        PageSize: 10,
                        Deeps:2,
                    }, function(res, wPageSize, wPageIndex){
                        res.forEach(function(item){
                            if( item.Status == 0 ){
                                item.StatusText = '关机';
                            } else if( item.Status & 1 ){
                                item.StatusText = '开机';
                            } else if( item.Status & 2 ){
                                item.StatusText = '运行';
                            } else if( item.Status & 4 ){
                                item.StatusText = '停止';
                            } else if( item.Status & 8 ){
                                item.StatusText = '急停';
                            } else if( item.Status & 16 ){
                                item.StatusText = '报警';
                            } else if( item.Status & 32 ){
                                item.StatusText = '手动';
                            } else if( item.Status & 64 ){
                                item.StatusText = '自动';
                            } else if( item.Status & 128 ){
                                item.StatusText = '预留';
                            }
                        });
                        vm.HistoryStatusData = res;
                        $com.app.loaded();
                    });
                    //状态信息柱状体
                    vm.DeviceStatistics({
                        DeviceID: vm.parameter.DeviceID,
                        StartTime: StartTime,
                        EndTime: EndTime,
                        Status:-1,
                    }, function(res){
                            vm.DeviceInfoStatisticsHistogram(res.list[0]);
                    });

                },
                //维修界面
                DeviceMaintenance: function(StartTime,EndTime){
                    $com.app.loading('数据加载中...');
                    //维修界面
                    $page.init($('.MaintenanceData .el-table .el-table__body-wrapper > table tbody').closest('table'), null, {
                        $URI: '/DMSDeviceRepair/All', 
                        $TYPE: 'Get',
                        PageCountProp: 'info',   //   服务器返回总页数的属性名称
                        DataListProp: 'list',    //  服务器返回数据列表的属性名称
                        DeviceID: vm.parameter.DeviceID,
                        Status: 2,
                        StartTime: StartTime,
                        EndTime: EndTime,
                        PageSize: 10,
                        Deeps:2,
                    }, function(res){
                        vm.MaintenanceData = res;
                        $com.app.loaded();
                    });
                },
                //当前作业
                Assignment: function(){
                    vm.DeviceCurrentAssignment({ DeviceID: vm.parameter.DeviceID }, function(res){
                        if( res.list.length <= 0 ){
                            vm.currentAssignmentShow = true;
                            return;
                        }
                        res.list = vm.AssignmentListCurrent;
                    });
                },
                //作业记录
                AssignmentHistory: function(StartTime,EndTime){
                    $com.app.loading('数据加载中...');
                    $page.init($('.AssignmentListHistory .el-table .el-table__body-wrapper > table tbody').closest('table'), null, {
                        $URI: '/DMSProcessRecord/All', 
                        $TYPE: 'Get',
                        PageCountProp: 'info',   //   服务器返回总页数的属性名称
                        DataListProp: 'list',    //  服务器返回数据列表的属性名称
                        DeviceID: vm.parameter.DeviceID,
                        StartTime: StartTime,
                        EndTime: EndTime,
                        Active:1,
                        PageSize: 10,
                        Deeps:2,
                    }, function(res){
                        $com.app.loaded();
                        res.forEach(function(item){
                            item.ItemList.forEach(function(item){
                                switch( item.DataType ){
                                    case 4:
                                        item.ParameterValue = item.ParameterValue.toFixed(2);
                                        break;
                                    case 5:
                                        item.ParameterValue = item.ParameterValue.toFixed(4);
                                        break;
                                }
                            });
                        });
                        vm.AssignmentListHistory = res;

                    });
                },
                //可视化按钮
                visual: function(){
                    var ID = vm.parameter.DeviceID;
                    var url = '';
                    var header = '';
                    switch( vm.parameter.DeviceType ){
                        case 19:
                            url = 'MobileCarRackMachine';
                            header = '移动式架车机';
                            break;
                        case 17:
                            url = 'MetroReport';
                            header = '洗车机';
                            break;
                        case 16:
                            url = 'LntegralCarLiftingMachine2';
                            header = '整体式架车机';
                            break;
                    }
                    var vdata = {
                        'header': header,
                        'id': url,
                        'href': `./process_control/${ url }.html?ID=${ ID }`,
                        'src': `./static/images/logpng/${ url }.png`,
                    };
                    window.parent.iframeHeaderSet(vdata);
                    window.callFunctionTrigger(url, ID);
                },
                //作业详情按钮
                AssignmentParticulars: function(list){
                    vm.ParticularsShow = !vm.ParticularsShow;
                    vm.AssignmentListParticulars = list;
                },
                //作业详情界面返回按钮
                AssignmentGoBack(){
                    vm.ParticularsShow = !vm.ParticularsShow;
                },
                //单台设备状态信息统计表
                DeviceInfoStatisticsHistogram: function(data){
                    var StatusDuration = [];
                    var StatusTimes = [];
                    for( var key in data.StatusDurationDic ){
                        vm.StatusData(key, StatusDuration, data.StatusDurationDic);
                    }
                    for( var key in data.StatusTimesDic ){
                        vm.StatusData(key, StatusTimes, data.StatusTimesDic);
                    }
                    StatusDuration.forEach(function(item, index){
                        StatusDuration[index] = Number(( item / (60*60) ).toFixed(2));
                    });
                    vm.StatusMessages.series[1].data = StatusDuration;
                    vm.StatusMessages.series[0].data = StatusTimes;
                    vm.ECharts('device-status', vm.StatusMessages);
                },
                //刷新时保留Tab的状态
                TabName: function(name){
                    vm.parameter.Button = name;
                    vm.reset();
                    vm.TabStyle(name);
                },
                //获取维修信息
                getDMSDeviceRepair: function(data, fn, context){
                    var d = {
                        $URI: '/DMSDeviceRepair/All',
                        $TYPE: 'get',
                    };

                    function err(){
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取设备参数
                getDeviceParameter: function(data, fn, context){
                    var d = {
                        $URI: '/DMSDeviceRealParameter/All',
                        $TYPE: 'Get',

                    };

                    function err(){
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取状态
                DeviceStatistics: function(data, fn, context){
                    var d = {
                        $URI: '/DMSDeviceStatus/Statistics',
                        $TYPE: 'get',
                    };

                    function err(){
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取设备当前状态
                DeviceStatusCurrent: function(data, fn, context){
                    var d = {
                        $URI: '/DMSDeviceStatus/Current',
                        $TYPE: 'get',
                    };

                    function err(){
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取当前报警
                DeviceCurrentAlarm: function(data, fn, context){
                    var d = {
                        $URI: '/DMSDeviceAlarm/Current',
                        $TYPE: 'get',
                    };

                    function err(){
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取历史报警记录
                DeviceHistoryAlarm: function(data, fn, context){
                    var d = {
                        $URI: '/DMSDeviceAlarm/Statistics',
                        $TYPE: 'get',
                    };

                    function err(){
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取单台设备历史状态
                DeviceInfoStatistics: function(data, fn, context){
                    var d = {
                        $URI: '/DMSDeviceStatus/DeviceInfo',
                        $TYPE: 'get',
                    };

                    function err(){
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //设备当前作业
                DeviceCurrentAssignment: function(data, fn, context){
                    var d = {
                        $URI: '/DMSProcessRecord/Current',
                        $TYPE: 'get',
                    };

                    function err(){
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //作业历史
                DeviceRecordAssignment: function(data, fn, context){
                    var d = {
                        $URI: '/DMSProcessRecord/All',
                        $TYPE: 'get',
                    };

                    function err(){
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //作业历史
                maintainStatistics: function(data, fn, context){
                    var d = {
                        $URI: '/DMSDeviceRepair/All',
                        $TYPE: 'get',
                    };

                    function err(){
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
            },
        });
        model.init();


    });
