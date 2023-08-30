require(
    [
        '../static/utils/js/jquery-3.1.1',
        '../static/utils/js/base/base',
        '../static/utils/js/base/echarts'
    ],
    function($alfie, $com, $echarts){
        var myCharts={};
        var option={
            animation:false,
            title: {
                text: '',
                left: '37%',
                top:"5%",
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
                    type: 'pie',
                    radius: '50%',
                    data: [
                        { value: 1048, name: '磁盘空间' },
                        { value: 735, name: '硬盘空闲空间' },
                    ],
                    center: ['45%', '55%'],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
            /*MaxConnection：最大连接数
            CurrentConnection：当前连接数
            TotalPhysicalMemory：实际总内存
            AvailablePhysicalMemory：实际可用内存
            TotalVirtualMemory：总虚拟内存
            AvailableVirtualMemory：可用虚拟内存
            OSFullName：系统名称
            OSVersion：系统版本
            OSPlatform：操作系统平台
            ProcessorCount：处理器数量
            CPURate：CPU使用率
            DiskName：磁盘名称
            HardDiskSpace：磁盘空间
            HardDiskFreeSpace：硬盘空闲空间*/
        var model = $com.Model.create({
            el: '#systemPerformance',
            name: '系统性能数据',
            VueName: 'vm',
            data: {
                systemInfo:{},
                Connection:{
                    animation:false,
                    title: {
                        text: '连接数量',
                        left: '37%',
                        top:"5%",
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
                            type: 'pie',
                            radius: '50%',
                            data: [
                                { value: 1048, name: '剩余可连接数量' },
                                { value: 735, name: '当前连接数量' },
                            ],
                            center: ['45%', '55%'],
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            },
                        }
                    ]
                },
                Memory:[
                    {
                        animation:false,
                        title: {
                            text: '实际内存(MB)',
                            left: '37%',
                            top:"5%",
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter:function (params) {
                                return params.marker + params.name+":"+params.value.toFixed(2)+"MB";
                            }
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
                                center: ['45%', '55%'],
                                data: [
                                    { value: 1048, name: '已使用实际内存' },
                                    { value: 735, name: '可用实际内存' },
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
                    {
                        animation:false,
                        title: {
                            text: '虚拟内存(MB)',
                            left: '37%',
                            top:"5%",
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter:function (params) {
                                return params.marker + params.name+":"+params.value.toFixed(2)+"MB";
                            }
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
                                center: ['45%', '55%'],
                                data: [
                                    { value: 1048, name: '已使用虚拟内存' },
                                    { value: 735, name: '可用虚拟内存' },
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
                ],
                CPURate:{
                    tooltip: {
                        trigger: 'axis',
                        formatter:function (params) {
                            return params[0].name+"<br/>"+params[0].seriesName+":"+params[0].data+"%";
                        }
                    },
                    title: {
                        text: 'CPU使用率',
                        top: 10
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        data: []
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: "{value}%",
                        },
                    },
                    series: [
                        {
                            name:"CPU使用率",
                            data: [],
                            type: 'line',
                            smooth: true
                        }
                    ]
                },
                disk:[],
                minute:4,
            },
            computed: {},
            filters: {},
            watch: {},
            created: function(){
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
            },
            mounted: function(){
                var vm = this;
                vm.refresh();
                this.timer = setInterval(function (){
                    vm.refresh();
                },20000);
            },
            beforeDestroy:function (){
                clearInterval(this.timer);
            },
            methods: {
                refresh:function (){
                    var vm = this;
                    vm.GetSystem({},function (res){
                        vm.systemInfo = res.info;
                       vm.$nextTick(function (){
                           vm.newECharts();
                       })
                    })
                },
                //确认按钮事件
                affirm:function (){
                    if (isNaN(vm.minute)){
                        alert("请输入一个数字");
                        return ;
                    }
                    if (vm.minute>10){
                        alert("不得查看大于10分钟的CPU使用率");
                        return;
                    }
                   return  vm.minute*60/20;
                },
                //处理折线图数据
                lineChart:function (data){
                    if (vm.CPURate.series[0].data.length>=vm.affirm()){
                        var n = vm.CPURate.series[0].data.length - vm.affirm()
                        vm.CPURate.series[0].data.splice(0,n);
                        vm.CPURate.xAxis.data.splice(0,n);
                    }
                        vm.CPURate.series[0].data.push(Number((data.toFixed(2))));
                        vm.CPURate.xAxis.data.push(new Date().Format("HH:mm:ss"))
                        vm.ECharts("CPURate",vm.CPURate)
                },
                //处理数据
                pieChart:function (sun,residue,obj,ID){
                    obj.series[0].data[0].value = Number((sun-residue).toFixed(2));
                    obj.series[0].data[1].value = Number(residue.toFixed(2));
                    vm.ECharts(ID,obj);
                },
                //实例化Echarts
                newECharts:function (){
                    var obj = vm.systemInfo.ComputerInfo
                    vm.pieChart(vm.systemInfo.MaxConnection,vm.systemInfo.CurrentConnection,vm.Connection,"connection");
                    vm.pieChart(Number((obj.TotalPhysicalMemory).toFixed(2)),obj.AvailablePhysicalMemory,vm.Memory[0],"realMemory");
                    vm.pieChart(Number((obj.TotalVirtualMemory).toFixed(2)),obj.AvailableVirtualMemory,vm.Memory[1],"virtualMemory");
                    vm.lineChart(obj.CPURate);
                    vm.systemInfo.DiskList.forEach(function (item,index){
                        if (!myCharts[item.DiskName]){
                            var obj = $com.util.Clone(option);
                            obj.title.text = item.DiskName+"盘:磁盘空间"
                            obj.tooltip.formatter = function (params) {
                                return params.marker + params.name+":"+params.value.toFixed(2)+"GB";
                            }
                            vm.disk.push(obj);
                            vm.pieChart(item.HardDiskSpace,item.HardDiskFreeSpace,vm.disk[index],item.DiskName);
                        }else {
                            vm.pieChart(item.HardDiskSpace,item.HardDiskFreeSpace,vm.disk[index],item.DiskName);
                        }
                    })
                },
                //调用ECharts
                ECharts: function (IDName, option) {
                    myCharts[IDName] || (myCharts[IDName] = $echarts.init(document.getElementById(IDName)));
                    // 清除已有配置项
                    myCharts[IDName].clear();
                    //重新写入数据
                    myCharts[IDName].setOption(option);
                },
                //获取内存信息
                GetSystem: function (data, fn, context) {
                    var d = {
                        $URI: "/HomePage/GetCurrentServerStatus",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip("提交失败，请检查网络");
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
            },
            events: function(){
                window.addEventListener("resize", function (){
                    for (const key in myCharts) {
                        myCharts[key].resize();
                    }
                });
            },
        });
        model.init();
    });