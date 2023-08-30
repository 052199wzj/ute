require(
    [
        '../static/utils/js/jquery-3.1.1',
        '../static/utils/js/base/base',
    ],
    function ($alfie, $com) {
        var n =27
        var model = $com.Model.create({
            el: '#screenDisplay',
            name: '广州地铁18号线万顷沙基地',
            VueName: 'vm',
            data: {
                areaList: [],
                // 数据列表
                tableData: [],
                timeSection: [
                    $com.util.format('yyyy-MM-dd', new Date(new Date().getTime() - 24 * 3600000)),
                    $com.util.format('yyyy-MM-dd', new Date()),
                ],
                statusCount:{},
                deviceSum:0,
            },
            computed: {
                // type: 0-维护 1-跟踪 2-统计
                orderOverview: function(){
                    var data = this.statusCount;
                    for( let key in data ){
                        data[key] === 'NaN%' && ( data[key] = '-' );
                    }
                    return [
                        { label: '全部工单', value: data.AllOrderNum, color: '#0ea9f7' },
                        { label: '待执行', value: data.TobeexecutedNum, color: '#e9967a' },
                        { label: '执行中', value: data.ExecutingNum, color: '#800080' },
                        { label: '暂停中', value: data.CalledoffNum, color: '#808080' },
                        { label: '已完成', value: data.FinishNum, color: '#008000' },
                        { label: '已关闭', value: data.CloseNum, color: '#ff0000' },
                    ];

                },


            },
            filters: {},
            watch: {},
            created: function () {
                var vm = this;
                vm.GetArea({Active: 1}, function (res) {
                    vm.areaList = res.list;
                    vm.areaList.forEach(function (item){
                        vm.$set(item,'status', {
                            Shutdown:0,
                            TurnOn:0,
                            Alarm:0,
                        })
                    })
                    vm.updateDevice();

                })

                this.getStatusCount();
            },
            mounted: function () {},
            methods: {
                orderDate:function (){
                    this.GetOrder({StationID: -1,PreStartTime:"2021-09-29",PreEndTime:"2021-09-29"},function (res){})
                },
                // 获取订单概览数据
                getStatusCount: function(){
                    var that = this;
                    var params = {
                        PreStartTime: that.timeSection[0],
                        PreEndTime: that.timeSection[1],
                    };
                    that.GetOrderStatus(params, function(res){
                       var statusCount = res.list;
                        var orderCount = {
                            AllOrderNum: 0,//所有订单
                            SurplusOrderNum: 0,//剩余订单
                            TobeexecutedNum: 0,//待执行
                            ExecutingNum: 0,//执行中
                            CalledoffNum: 0,//暂停中
                            FinishNum: 0,//已完成
                            CloseNum: 0,//已关闭
                            BeoverdueNum: 0,//已逾期
                            Percentage: 0,// 完工率
                        };
                        var TobeexecutedNumAdd = 0;
                        var FinishNumAdd = 0;
                        var SurplusOrderNumAdd = 0;
                        for( x in statusCount ){
                            switch( Number(x) ){
                                case -1:
                                    orderCount.AllOrderNum = statusCount[x];
                                    break;
                                case 0:
                                    SurplusOrderNumAdd = statusCount[x] + SurplusOrderNumAdd;
                                    orderCount.SurplusOrderNum = SurplusOrderNumAdd;

                                    TobeexecutedNumAdd = statusCount[x] + TobeexecutedNumAdd;
                                    orderCount.TobeexecutedNum = TobeexecutedNumAdd;
                                    break;
                                case 1:
                                    SurplusOrderNumAdd = statusCount[x] + SurplusOrderNumAdd;
                                    orderCount.SurplusOrderNum = SurplusOrderNumAdd;

                                    TobeexecutedNumAdd = statusCount[x] + TobeexecutedNumAdd;
                                    orderCount.TobeexecutedNum = TobeexecutedNumAdd;
                                    break;
                                case 2:
                                    SurplusOrderNumAdd = statusCount[x] + SurplusOrderNumAdd;
                                    orderCount.SurplusOrderNum = SurplusOrderNumAdd;

                                    TobeexecutedNumAdd = statusCount[x] + TobeexecutedNumAdd;
                                    orderCount.TobeexecutedNum = TobeexecutedNumAdd;
                                    break;
                                case 3:
                                    SurplusOrderNumAdd = statusCount[x] + SurplusOrderNumAdd;
                                    orderCount.SurplusOrderNum = SurplusOrderNumAdd;

                                    TobeexecutedNumAdd = statusCount[x] + TobeexecutedNumAdd;
                                    orderCount.TobeexecutedNum = TobeexecutedNumAdd;
                                    break;
                                case 4:
                                    SurplusOrderNumAdd = statusCount[x] + SurplusOrderNumAdd;
                                    orderCount.SurplusOrderNum = SurplusOrderNumAdd;
                                    orderCount.ExecutingNum = statusCount[x];
                                    break;
                                case 6:
                                    SurplusOrderNumAdd = statusCount[x] + SurplusOrderNumAdd;
                                    orderCount.SurplusOrderNum = SurplusOrderNumAdd;
                                    orderCount.CalledoffNum = statusCount[x];
                                    break;
                                case 9:
                                    orderCount.CloseNum = statusCount[x];
                                    break;
                                case 5:
                                    FinishNumAdd = statusCount[x] + FinishNumAdd;
                                    orderCount.FinishNum = FinishNumAdd;
                                    break;
                                case 7:
                                    FinishNumAdd = statusCount[x] + FinishNumAdd;
                                    orderCount.FinishNum = FinishNumAdd;
                                    break;
                                case 8:
                                    FinishNumAdd = statusCount[x] + FinishNumAdd;
                                    orderCount.FinishNum = FinishNumAdd;
                                    break;
                                case 10:
                                    orderCount.BeoverdueNum = statusCount[x];
                                    break;
                                default:
                                    break;
                            }
                        }
                        orderCount.Percentage = ( orderCount.FinishNum / orderCount.AllOrderNum * 100 ).toFixed(2) + '%';
                        that.statusCount = orderCount;
                    });
                },
                //设备数据动画
                deviceAnimation:function (){
                    vm.areaList.forEach(function (item){
                        if (item.deviceList.length>=4){
                            var ul = $("#areaID"+item.ID);
                            ul.animate({
                                   marginTop:"-10.5%"
                                }, 1000,function (){
                                item.deviceList.push(item.deviceList[0]);
                                ul.css({"margin-top":"0%"});
                                item.deviceList.splice(0,1)
                            } );
                        }
                    })
                },
                //更新设备参数
                updateDevice:function (){
                    var vm = this;
                    vm.GetDevice({Status: -1}, function (res) {
                        vm.deviceSum = res.list.length;
                        var map = {};
                        vm.areaList.forEach(function (item){
                            map[item.ID] = item;
                        })
                        res.list.forEach(function (item){
                            vm.deviceStatus(item,map[item.AreaID]);
                            (map[item.AreaID].deviceList || vm.$set(map[item.AreaID],'deviceList',[])).push(item);
                        })
                        vm.$nextTick(function (){
                            setInterval(vm.deviceAnimation,3000)
                        })
                    })
                },
                //处理设备状态
                deviceStatus:function (item,area){
                    if (item.Status === 0) {
                        item.colour = "rgb(137,132,132)"
                        item.StatusText = "关机"
                        area.status.Shutdown++;
                    } else if (item.Status & 1) {
                        item.colour = 'rgb(23,117,199)';
                        item.StatusText = "开机"
                        area.status.TurnOn++;
                    } else if (item.Status & 2) {
                        item.colour = 'rgb(44,217,47)';
                        item.StatusText = "运行"
                        area.status.TurnOn++;
                    } else if (item.Status & 4) {
                        item.colour = '#ff5000';
                        item.StatusText = "停止"
                        area.status.TurnOn++;
                    } else if (item.Status & 8) {
                        item.colour = '#eee307';
                        item.StatusText = "急停"
                        area.status.TurnOn++;
                    } else if (item.Status & 16) {
                        item.colour = '#f80404';
                        item.StatusText = "报警"
                        area.status.TurnOn++;
                        area.status.Alarm++;
                    } else if (item.Status & 32) {
                        item.colour = '#00fdd5';
                        item.StatusText = "手动"
                        area.status.TurnOn++;
                    } else if (item.Status & 64) {
                        item.colour = '#2c955e';
                        item.StatusText = "自动"
                        area.status.TurnOn++;
                    } else if (item.Status & 128) {
                        item.colour = '#db1c95';
                        item.StatusText = "调试"
                        area.status.TurnOn++;
                    }
                },
                //处理设备运行几率
                odds:function(numerator,denominator){
                    return ((numerator/denominator)*100).toFixed(0)+"%";
                },
                //获取区域信息
                GetArea: function (data, fn, context) {
                    var d = {
                        $URI: '/BMSRegion/All',
                        $TYPE: 'get',
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取设备信息
                GetDevice: function (data, fn, context) {
                    var d = {
                        $URI: '/DMSDeviceStatus/Current',
                        $TYPE: 'get',
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取设备信息
                GetOrder: function (data, fn, context) {
                    var d = {
                        $URI: '/OMSOrder/All',
                        $TYPE: 'get',
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取订单状态
                GetOrderStatus:function (data, fn, context) {
                    var d = {
                        $URI: '/OMSOrder/StatusCount',
                        $TYPE: 'get',
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
            },
            events: function () {

            },
        });
        model.init();
    });