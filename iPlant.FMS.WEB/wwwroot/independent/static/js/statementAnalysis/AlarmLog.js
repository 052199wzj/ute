require(
    [
        "../static/utils/js/jquery-3.1.1",
        "../static/utils/js/base/paging",
        "../static/utils/js/base/base",

    ],
    function ($alfie, $page, $com) {
        var excelParams = {
            fileName: "报警日志.xls",
            title: "报警日志",
            head: {
                "$index": "序号",
                "DeviceName": "设备名称",
                "DeviceNo": "设备编码",
                "AlarmCode": "报警编码",
                "AlarmName": "报警名称",
                "StatusTime": "起始时刻",
                "StatusTimeEnd": "结束时刻",
                "AlarmDesc": "报警描述",
            },
            order: [
                "$index",
                "DeviceName",
                "DeviceNo",
                "AlarmCode",
                "AlarmName",
                "StatusTime",
                "StatusTimeEnd",
                "AlarmDesc",
            ],
            AssetNoString: "",
        };
        var model = $com.Model.create({
            el: "#alarmLog",
            name: "报警日志",
            VueName: "vm",
            data: {
                Area: [], //区域
                AreaID: 35,
                DeviceType: [], //设备类型
                DeviceTypeID: null,
                DeviceList: [],
                timeSection: [
                    $com.util.format("yyyy-MM-dd", new Date(new Date().getTime() - 30 * 24 * 3600000)),
                    $com.util.format("yyyy-MM-dd", new Date()),
                ],
                alarmList: [],
                // 已勾选数据
                checkData: [],
            },
            computed: {},
            filters: {},
            watch: {
                //监听区域ID
                AreaID: function (newDeviceName, oldDeviceName) {
                    //变更设备类型选项
                    var wDevice = mDeviceList.filter(function (item) {
                        return item.AreaID === vm.AreaID;
                    });
                    vm.DeviceType = vm.deWeight(wDevice, "DeviceType");
                    vm.DeviceTypeID = null;
                },
            },
            created: function () {

                //给搜索框上的下拉框赋值
                //区域
                this.GetArea({Active: 1}, function (res) {
                    // res.list.forEach(function(item){
                    //     vm.Area.push({
                    //         ID: item.ID,
                    //         Value: item.Name + '(' + item.Code + ')',
                    //     });
                    // });
                    vm.Area = res.list;
                });
                //设备名称
                this.GetDevice({Active: 1}, function (res) {
                    //设备
                    mDeviceList = $com.util.Clone(res.list);
                    vm.DeviceList = mDeviceList.filter(function (item) {
                        return item.AreaID === vm.AreaID;
                    });
                    //设备类型
                    var wDevice = mDeviceList.filter(function (item) {
                        return item.AreaID === vm.AreaID;
                    });
                    vm.DeviceType = vm.deWeight(wDevice, "DeviceType");
                });

            },
            mounted: function () {
                this.refresh();
            },
            methods: {
                refresh: function () {
                    $com.app.loading("数据加载中...");
                    $page.init($(".el-table .el-table__body-wrapper > table tbody").closest("table"), null, {
                        $URI: "/DMSDeviceAlarm/All", 
                        $TYPE: "Get",
                        PageCountProp: "info",   //   服务器返回总页数的属性名称
                        DataListProp: "list",    //  服务器返回数据列表的属性名称
                        EventType: 2,
                        Active: -1,
                        AreaID: this.AreaID,
                        DeviceType: this.DeviceTypeID,
                        StartTime: this.timeSection[0],
                        wEndTime: this.timeSection[1],
                        PageSize: 20,
                        Deeps: 2,
                    }, function (res) {
                        res.forEach(function (item, index) {
                            item.$key = item.AlarmCode + item.StatusTime;
                        });

                        vm.alarmList = res;
                        $com.app.loaded();
                    });
                },
                //搜索按钮
                search: function () {
                    this.refresh();
                    this.clearSelection();
                },
                //重置按钮
                reset: function () {
                    vm.AreaID = 36;
                    vm.DeviceTypeID = null;
                    vm.timeSection.splice(0, 2,
                        $com.util.format("yyyy-MM-dd", new Date(new Date().getTime() - 30 * 24 * 3600000)),
                        $com.util.format("yyyy-MM-dd", new Date()),
                    );
                    this.clearSelection();
                },
                //数组去重
                deWeight: function (arr, key) {
                    if (!Array.isArray(arr)) {
                        console.error("type error!");
                        return;
                    }
                    for (var i = 0; i < arr.length - 1; i++) {
                        for (var j = i + 1; j < arr.length; j++) {
                            if (arr[i][key] == arr[j][key]) {
                                arr.splice(j, 1);
                                //因为数组长度减小1，所以直接 j++ 会漏掉一个元素，所以要 j--
                                j--;
                            }
                        }
                    }
                    return arr;
                },
                // 记录当前勾选的数据
                selectionChange: function (list) {
                    this.checkData = list;
                },
                // 清空已选
                clearSelection: function () {
                    this.$refs["myTable"].clearSelection();
                },
                //导出报警日志
                exportEx: function () {
                    var that = this;
                    if (that.checkData.length) {
                        that.exportOpen($com.util.Clone(that.checkData));
                        that.clearSelection();
                    } else {
                        var params = {
                            EventType: 2,
                            Active: -1,
                            AreaID: this.AreaID,
                            DeviceType: this.DeviceTypeID,
                            StartTime: this.timeSection[0],
                            wEndTime: this.timeSection[1],
                        };
                        this.GetAlarm(params, function (res) {
                            that.exportOpen(res.list);
                        });
                    }


                },
                exportOpen: function (data) {
                    data.forEach(function (item, i) {
                        item.$index = i + 1;
                    });

                    excelParams.data = data;
                    vm.postExportExcel(excelParams, function (res) {
                        var src = res.info.path;

                        if (src.indexOf("iPlantSCADA") !== -1) {
                            window.open(src);
                            alert("导出成功");
                        } else {
                            window.open("/iPlantSCADA" + src);
                            alert("导出成功");
                        }
                    });
                },
                // api - 导出
                postExportExcel: function (data, fn, context) {
                    var d = {
                        $URI: "/Upload/ExportExcel",
                        $TYPE: "post",
                    };

                    function err() {
                        $com.app.tip("获取失败，请检查网络");
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取区域信息
                GetArea: function (data, fn, context) {
                    var d = {
                        $URI: "/BMSRegion/All",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip("提交失败，请检查网络");
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取设备类型信息
                GetDeviceType: function (data, fn, context) {
                    var d = {
                        $URI: "/DMSDeviceType/All",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip("提交失败，请检查网络");
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取设备信息
                GetDevice: function (data, fn, context) {
                    var d = {
                        $URI: "/DMSDeviceLedger/All",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip("提交失败，请检查网络");
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                // 报警日志
                GetAlarm: function (data, fn, context) {
                    var d = {
                        $URI: "/DMSDeviceAlarm/All",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip("提交失败，请检查网络");
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

            },
            events: function () {
            },
        });
        model.init();
    });
