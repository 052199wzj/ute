require(
    [
        '../static/utils/js/jquery-3.1.1',
        '../static/utils/js/base/base',
    ],
    function ($alfie, $com) {
        var model = $com.Model.create({
            el: '#systemLog',
            name: '异常日志',
            VueName: 'vm',
            data: {
                //日志列表
                logList: [],

                props: {
                    label: 'CatalogName',
                    children: 'SubCatalogList'
                },
                //已选中的节点
                checkedList: {},
                //日志内容
                logContent: [],
                //当前展示的日志
                logInfo: {},
                //安全模式
                safeMode: true,

            },
            computed: {},
            filters: {},
            watch: {
                safeMode: function () {
                    this.emptyCheck();
                }
            },
            created: function () {
                this.refresh();
            },
            mounted: function () {},
            methods: {
                refresh:function () {
                    var that = this
                    $com.app.loading('数据加载中...');
                    that.getLog({}, function (res) {
                        that.logList = res.list;
                        $com.app.loaded();
                    })
                },
                //清空勾选
                emptyCheck:function () {
                    this.$refs.tree.setCheckedKeys([]);
                },
                //删除日志
                deleteLog: function () {
                    if (!vm.checkedList.length){
                        return alert("请选择日志")
                    }
                    var arr = [];
                    for (const key in vm.checkedList) {
                        arr.push(vm.checkedList[key].FilePath);
                    }
                    vm.DeleteList({data: arr}, function (res) {
                            alert("删除成功");
                            vm.emptyCheck();
                            vm.refresh();
                    })
                },
                //下载日志
                downloadLog: function () {
                    if (vm.logInfo.FilePath) {
                        window.open("/iPlantSCADA/api/ELG/FileDownload?path=" + vm.logInfo.FilePath);
                    }else {
                        alert("请点击所要下载的日志")
                    }
                },
                //选中事件
                logCheckChange(data, checked, indeterminate) {
                    if (checked) {
                        vm.checkedList[data.CatalogID] = data;
                    } else {
                        delete vm.checkedList[data.CatalogID];
                    }
                },
                //点击事件
                logNodeClick(data) {
                    if (!data.IsCatalog) {
                        if (vm.logInfo.CatalogID!==data.CatalogID){
                            $(".logInfoContent").scrollTop(0);
                        }
                        vm.logInfo = data;
                        $com.app.loading('数据加载中...');
                        vm.getLogInfo({Path: data.FilePath}, function (res) {
                            if (res.list) {
                                vm.logContent = res.list;
                            } else if (res.info) {
                                vm.logContent = res.info;
                            }
                            $com.app.loaded();
                        })
                    }
                },
                //获取日志
                getLog: function (data, fn, context) {
                    var d = {
                        $URI: '/ELG/LogList',
                        $TYPE: 'get',
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //查询单个日志
                getLogInfo: function (data, fn, context) {
                    var d = {
                        $URI: '/ELG/LogInfo',
                        $TYPE: 'get',
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //下载日志
                fileDownloadLog: function (data, fn, context) {
                    var d = {
                        $URI: '/ELG/FileDownload',
                        $TYPE: 'get',
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //删除日志
                DeleteList: function (data, fn, context) {
                    var d = {
                        $URI: '/ELG/DeleteList',
                        $TYPE: 'post',
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