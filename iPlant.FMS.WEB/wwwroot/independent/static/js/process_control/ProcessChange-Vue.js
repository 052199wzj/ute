require(
    [
        '../static/utils/js/jquery-3.1.1',
        '../static/utils/js/base/paging',
        '../static/utils/js/base/base',
    ],
    function ($alfie, $page, $com) {
        var AlarmTypeArray = ["默认", "状态", "报警", "参数"];
        var AlarmLevelArray = ["默认", "A级", "B级", "C级", "D级"];
        var StatusArray = ["默认", "已报修", "已检修"];
        // 最小有效日期
        var minTime = new Date('2020-01-01 00:00:00');

        var model = $com.Model.create({
            el: '#fxy-repairs',
            name: '设备报检修',
            VueName: 'vm',
            data: {
                popupData: {
                    toRepair: true,
                    show: false,
                    selectOptions: {
                        device: [],
                        alarmCode: [],
                        alarmLevel: [
                            {
                                Name: "A级",
                                ID: 1,
                            }, {
                                Name: "B级",
                                ID: 2,
                            }, {
                                Name: "C级",
                                ID: 3,
                            }, {
                                Name: "D级",
                                ID: 4,
                            }
                        ],
                        alarmType: [
                            {
                                Name: "默认",
                                ID: 0,
                            }, {
                                Name: "状态",
                                ID: 1,
                            }, {
                                Name: "报警",
                                ID: 2,
                            }, {
                                Name: "参数",
                                ID: 3,
                            }
                        ],
                        repairer: [],

                    },
                    rules: {
                        device: [{required: true, message: '请选择设备', trigger: 'change'}],
                        alarmName: [{required: true, message: '请输入报警名称', trigger: 'blur'}],
                        alarmLevel: [{required: true, message: '请选择报警等级', trigger: 'change'}],
                        repairer: [{required: true, message: '请选择检修人', trigger: 'change'}],
                    },
                    data: {
                        device: '',
                        alarmCode: '',
                        alarmName: '',
                        alarmRemark: '',
                        alarmLevel: '',
                        alarmType: '',
                        AlarmImage: [],
                        repairer: [],
                        repairsRemark: '',
                        repairsDate: {
                            start: '',
                            end: ''
                        },
                    },
                    dialogImageUrl: '',
                    dialogVisible: false,
                    serviceData: {},
                },
                activeName: 'first',//tabname
                RepairsList: [],//报修表
                SearchRepairs: {
                    AlarmLevelArray: "",
                    AlarmTypeArray: "",
                    StatusArray: "-1",
                    DateValueRepairs: [],
                },//报修搜索参数
                SearchService:{
                    AlarmLevelArray: "",
                    AlarmTypeArray: "",
                    StatusArray: "-1",
                    DateValueRepairs: [],
                },
                repairsParticularsShow: false,//报修详情显示与隐藏
                serviceParticularsShow: false,//检修详情显示与隐藏
                repairsParticularsObj: {},//报修详情数据
                serviceParticularsObj: {},//检修详情数据
                DeviceAlarmList: [],//设备报警表
                repairsCompile: {
                    AlarmCode: "",
                    AlarmLevel: "",
                    AlarmType: "",
                    AlarmRemark: "",
                },//报修编辑区数据
                serviceCompile: {},//检修编辑区数据
                AlarmImageList: [],//报修图片列表
                RepairImageList: [],//检修图片列表
                userList: [],//人员列表
                dialogImageUrl: '',
                dialogVisible: false,
                disabled: false,
                user: {},//登录信息
                repairsJurisdiction: false,//报修权限
                serviceJurisdiction: false,//检修权限
                imageUrlList: [],
            },
            computed: {},
            //过滤器
            filters: {
                AlarmType: function (value) {
                    return AlarmTypeArray[value]
                },
                AlarmLevel: function (value) {
                    return AlarmLevelArray[value]
                },
                Status: function (value) {
                    return StatusArray[value]
                },
                effectiveDate: function (e) {
                    if (!e) {
                        return '-';
                    }
                    var now = new Date(e);
                    return now > minTime ? e : '-';
                },
            },
            watch: {},
            created: function () {
                //获取设备列表
                this.getDMSDeviceLedger({
                    Active: 1
                }, function (resP) {
                    vm.popupData.selectOptions.device = $com.util.Clone(resP.list);
                });
                //获取人员列表
                this.getUser({Active: 1}, function (res) {
                    vm.popupData.selectOptions.repairer = $com.util.Clone(res.list);
                    $.each(res.list, function (i, item) {
                        vm.userList.push({
                            name: item.Name,
                            value: item.ID
                        });
                    })
                })
                //获取当前登录信息
                this.user = window.parent.User_Info;
                //判断是否有权限
                this.repairsJurisdiction = $com.app.checkRole(201001);//报修
                this.serviceJurisdiction = $com.app.checkRole(201002);//检修
            },
            mounted: function () {
                this.handleClick();
                //起始时间
                this.SearchRepairs.DateValueRepairs.splice(0, 2,
                    this.compareTime(new Date(), 30),
                    this.compareTime(new Date(), -1)
                );
                this.SearchService.DateValueRepairs.splice(0, 2,
                    this.compareTime(new Date(), 30),
                    this.compareTime(new Date(), -1)
                );
            },
            methods: {
                //报修刷新
                refresh: function (id,
                                   Status = -1,
                                   StartTime = this.compareTime(new Date(), 30),
                                   EndTime = this.compareTime(new Date(), -1),
                                   AlarmLevel = -1,
                                   AlarmType,
                ) {
                    AlarmType = AlarmType || -1;
                    $com.app.loading('数据加载中...');
                    $page.init($(id).closest("table"), null, {
                        $URI: "/DMSDeviceRepair/All", 
                        $TYPE: "Get",
                        PageCountProp: "info",   //   服务器返回总页数的属性名称
                        DataListProp: "list",    //  服务器返回数据列表的属性名称
                        PageSize: 20,
                        DeviceNo: "",
                        DeviceID: -1,
                        Status: Status,
                        StartTime: StartTime,
                        EndTime: EndTime,
                        AlarmLevel: AlarmLevel,
                        AlarmType: AlarmType,
                    }, function (res) {
                        res.forEach(function (item) {
                            item.isDelete = true;
                            item.isService = true;
                            item.isCompile = false;
                            if (!vm.repairsJurisdiction || item.CreatorID != Number(vm.user.UserID) || item.Status == 2) {
                                item.isDelete = false;
                            }
                            ;
                            if (!vm.serviceJurisdiction || item.Status == 2) {
                                item.isService = false;
                            }
                            ;
                            if (vm.serviceJurisdiction && item.Status == 2 && item.CreatorID != Number(vm.user.UserID) ) {
                                item.RepairerIDList.forEach(function (ID) {
                                    if (ID == Number(vm.user.UserID)) {
                                        item.isCompile = true;
                                    }
                                })
                            }
                            ;
                        })
                        model.data.RepairsList = res;
                        $com.app.loaded();
                    })
                },
                //报修按钮
                formDataShow: function () {
                    vm.popupData.toRepair = true;
                    vm.popupData.show = true;
                    this.$nextTick(function () {
                        vm.$refs['myForm'].resetFields();
                    })
                },
                //生成报警编码选择框数据
                fromDeviceChange: function (ID) {
                    vm.popupData.data.alarmCode = null;
                    vm.DeviceCurrentAlarm({DeviceID: ID, Active: 1}, function (res) {
                        vm.popupData.selectOptions.alarmCode = $com.util.Clone(res.list);
                    })
                },
                //自动生成报警名称
                fromAlarmCodeChange: function (AlarmCode) {
                    var AlarmCodeList = vm.popupData.selectOptions.alarmCode
                    for (var i in AlarmCodeList) {
                        if (AlarmCode === AlarmCodeList[i].AlarmCode){
                            vm.popupData.data.alarmName = AlarmCodeList[i].AlarmName;
                            return
                        }
                    }
                },
                //弹出框关闭方法
                close: function () {
                    vm.popupData.show = false;
                    vm.popupData.data = {
                        device: '',
                        alarmCode: '',
                        alarmName: '',
                        alarmRemark: '',
                        alarmLevel: '',
                        alarmType: '',
                        AlarmImage: [],
                        repairer: [],
                        repairsRemark: '',
                        repairsDate: {
                            start: '',
                            end: ''
                        },
                    }
                    vm.popupData.selectOptions.alarmCode = [];
                },
                //Tab点击事件
                handleClick: function (tab, event) {
                    if (this.activeName == "first") {
                       this.search("repairs")
                    } else if (this.activeName == "second") {
                        this.search("service")
                    }
                },
                //保存按钮
                saveClick: function (type) {
                    //this.$refs.test.submit();
                    if (type == 'repairs') {
                        vm.repairsCompile.AlarmImageList.splice(0, vm.repairsCompile.AlarmImageList.length);
                        vm.AlarmImageList.forEach(function (item) {
                            vm.repairsCompile.AlarmImageList.push(item.url);
                        })
                        this.UpdateDMSDeviceRepair({data: vm.repairsCompile}, function (res) {
                            alert("修改成功");
                            vm.goback('repairs');
                        })
                    } else if (type == 'service') {
                        var stratTime = $com.util.format('yyyy-MM-dd hh:mm:ss', vm.serviceCompile.RepairStartTime);
                        var endTime = $com.util.format('yyyy-MM-dd hh:mm:ss', vm.serviceCompile.RepairEndTime);
                        if (stratTime > endTime) {
                            alert('检修起始时间不得大于检修结束时间')
                            return
                        }
                        vm.serviceCompile.RepairImageList.splice(0, vm.serviceCompile.RepairImageList.length);
                        vm.RepairImageList.forEach(function (item) {
                            vm.serviceCompile.RepairImageList.push(item.url);
                        })
                        if (!vm.serviceCompile.RepairStartTime && !vm.serviceCompile.RepairEndTime) {
                            alert('请选择检修时间')
                            return
                        }
                        this.UpdateDMSDeviceRepair({data: vm.serviceCompile}, function (res) {
                            alert("修改成功");
                            vm.goback('service');
                        })
                    }

                },
                //上传图片
                uploadFileImg: function (file, type) {
                    var form = new FormData();
                    form.append("files", file.file);
                    vm.postUploadImage(form, function (data) {
                        vm[type].push(
                            {
                                url: data.file_url
                            }
                        );
                    });
                },
                //添加报修图片
                addUploadImg(file) {
                    var form = new FormData();
                    form.append("files", file.file);
                    vm.postUploadImage(form, function (data) {
                        vm.popupData.data.AlarmImage.push(
                            {
                                url: data.file_url
                            }
                        );
                    });
                },
                //删除图片
                handleRemove(file, type) {
                    if (type == 'repairs') {
                        this.AlarmImageList = this.AlarmImageList.filter(function (item) {
                            item.uid !== file.uid
                        });
                    } else if (type == 'service') {
                        this.RepairImageList = this.RepairImageList.filter(function (item) {
                            item.uid !== file.uid
                        });
                    } else if (type == 'add') {
                        this.popupData.data.AlarmImage = this.popupData.data.AlarmImage.filter(function (item) {
                            item.uid !== file.uid
                        });
                    }
                },
                //查看大图
                handlePictureCardPreview(file) {
                    this.dialogImageUrl = file.url;
                    this.dialogVisible = true;
                },
                //删除报修单
                deleteRepars: function (data) {
                    if (!data.isDelete) {
                        return;
                    }
                    if (!confirm("已选择" + 1 + "条数据，确定将其删除？")) {
                        return;
                    }
                    this.DeleteDMSDeviceRepair({data: [data]}, function (res) {
                        alert("删除成功!")
                        model.methods.refresh('#fxy-body-repairs');
                    })
                },
                //获取选中的code
                currentSel: function (code) {
                    var wDeviceAlarm = "";
                    wDeviceAlarm = this.DeviceAlarmList.filter(item => item.Code == code);
                    this.repairsCompile.AlarmName = wDeviceAlarm[0].Name;
                },
                //弹出框确认按钮
                confirm: function () {
                    vm.$refs['myForm'].validate(function (bool) {
                        if (!bool) return false
                        if (vm.popupData.toRepair) {
                            var _data = {
                                ID: 0,
                                DeviceID: vm.popupData.data.device,
                                AlarmCode: vm.popupData.data.alarmCode || "",
                                AlarmName: vm.popupData.data.alarmName,
                                AlarmRemark: vm.popupData.data.alarmRemark,
                                AlarmImageList: [],
                                AlarmLevel: vm.popupData.data.alarmLevel || "",
                                AlarmType: vm.popupData.data.alarmType || 0,
                                Status: 1,
                            };
                            vm.popupData.data.AlarmImage.forEach(function (item) {
                                _data.AlarmImageList.push(item.url)
                            });
                            model.methods.UpdateDMSDeviceRepair({
                                data: _data
                            }, function (res) {
                                vm.close();
                                alert("新增成功！！");
                                model.methods.refresh('#fxy-body-repairs');
                            });
                        } else {
                            var stratTime = $com.util.format('yyyy-MM-dd hh:mm:ss', vm.popupData.data.repairsDate.start);
                            var endTime = $com.util.format('yyyy-MM-dd hh:mm:ss', vm.popupData.data.repairsDate.end);
                            if (stratTime > endTime) {
                                alert('检修起始时间不得大于检修结束时间')
                                return
                            }
                            vm.popupData.serviceData.RepairerIDList = vm.popupData.data.repairer;
                            vm.popupData.serviceData.RepairRemark = vm.popupData.data.repairsRemark;
                            vm.popupData.serviceData.RepairStartTime = vm.popupData.data.repairsDate.start;
                            vm.popupData.serviceData.RepairEndTime = vm.popupData.data.repairsDate.end;
                            vm.popupData.serviceData.RepairTime = $com.util.format('yyyy-MM-dd hh:mm', new Date());
                            vm.popupData.serviceData.Status = 2;
                            model.methods.UpdateDMSDeviceRepair({
                                data: vm.popupData.serviceData
                            }, function (res) {
                                vm.close();
                                alert("检修成功！！");
                                model.methods.refresh('#fxy-body-service');
                            });
                        }

                    })

                },
                //检修
                service: function (data) {
                    this.$nextTick(function () {
                        vm.$refs['myForm'].resetFields();
                    })
                    vm.popupData.show = true;
                    vm.popupData.toRepair = false;
                    vm.popupData.serviceData = data;
                },
                //搜索按钮
                search: function (type) {
                    if (type === "repairs") {
                        this.refresh(
                            '#fxy-body-repairs',
                            this.SearchRepairs.StatusArray,
                            this.SearchRepairs.DateValueRepairs[0],
                            this.SearchRepairs.DateValueRepairs[1],
                            this.SearchRepairs.AlarmLevelArray,
                            this.SearchRepairs.AlarmTypeArray
                        )
                    } else if (type === "service") {
                        this.refresh(
                            '#fxy-body-service',
                            this.SearchService.StatusArray,
                            this.SearchService.DateValueRepairs[0],
                            this.SearchService.DateValueRepairs[1],
                            this.SearchService.AlarmLevelArray,
                            this.SearchService.AlarmTypeArray
                        )
                    }
                },
                //重置按钮
                reset: function (type) {
                    this[type] = {
                        AlarmLevelArray: "",
                        AlarmTypeArray: "",
                        StatusArray: "-1",
                        DateValueRepairs: [
                            this.compareTime(new Date(), 30),
                            this.compareTime(new Date(), -1)
                        ]
                    }
                },
                //报检修详情
                particulars: function (data, type) {
                    if (type === "repairs") {
                        vm.AlarmImageList.splice(0, vm.AlarmImageList.length)
                        vm.repairsParticularsShow = true;
                        vm.repairsParticularsObj = $com.util.Clone(data)
                        vm.repairsCompile = $com.util.Clone(data)
                        vm.repairsCompile.AlarmLevel = String(vm.repairsCompile.AlarmLevel);
                        vm.repairsCompile.AlarmType = String(vm.repairsCompile.AlarmType);
                        vm.getDMSDeviceParameter({DeviceID: data.DeviceID, DataClass: 2, Active: 1}, function (res) {
                            vm.DeviceAlarmList = res.list;
                        })
                        vm.repairsCompile.AlarmImageList.forEach(function (item) {
                            vm.AlarmImageList.push({url: item})
                        })
                    } else if (type === 'service') {
                        vm.serviceParticularsObj = $com.util.Clone(data)
                        vm.serviceCompile = $com.util.Clone(data);
                        var RepairerNameList = [];
                        RepairerNameList = vm.serviceCompile.Repairer.split(',');
                        vm.serviceCompile.RepairerIDList.splice(RepairerNameList.length,vm.serviceCompile.RepairerIDList.length);
                        vm.serviceParticularsShow = true;
                        vm.RepairImageList.splice(0, vm.RepairImageList.length)
                        vm.serviceCompile.RepairImageList.forEach(function (item) {
                            vm.RepairImageList.push({url: item})
                        })
                    }
                },
                //返回按钮
                goback: function (type) {
                    if (type == "repairs") {
                        this.repairsParticularsShow = false;
                        this.refresh('#fxy-body-repairs');
                    } else if (type == 'service') {
                        this.serviceParticularsShow = false;
                        this.refresh('#fxy-body-service');
                    }

                },
                //取当输入时间的前X天
                compareTime: function (myDate, selectDay) {
                    let lw = new Date(myDate - 1000 * 60 * 60 * 24 * selectDay);
                    let lastY = lw.getFullYear();
                    let lastM = lw.getMonth() + 1;
                    let lastD = lw.getDate();
                    let startdate = lastY + '-' + (lastM < 10 ? '0' + lastM : lastM) + '-' + (lastD < 10 ? '0' + lastD : lastD);
                    return startdate;
                },
                //删除报单修接口
                DeleteDMSDeviceRepair: function (data, fn, context) {
                    var d = {
                        $URI: "/DMSDeviceRepair/Delete",
                        $TYPE: "post",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //新增报修单/检修接口
                UpdateDMSDeviceRepair: function (data, fn, context) {
                    var d = {
                        $URI: "/DMSDeviceRepair/Update",
                        $TYPE: "post",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取设备
                getDMSDeviceLedger: function (data, fn, context) {
                    var d = {
                        $URI: "/DMSDeviceLedger/All",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取设备参数字典
                getDMSDeviceParameter: function (data, fn, context) {
                    var d = {
                        $URI: "/DMSDeviceParameter/All",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取人员接口
                getUser: function (data, fn, context) {
                    var d = {
                        $URI: "/User/All",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //上传图片
                postUploadImage: function (data, fn, context) {
                    var d = {
                        $URI: "/Upload/Submit",
                        $TYPE: "POST",
                    };

                    function err() {
                        $com.app.tip('上传失败，请检查网络');
                    }

                    $com.app.ajax_load($.extend(data, d), fn, err, context);
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
            },
            events: function () {
            },
        });
        model.init();
    });
