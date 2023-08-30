require(
    [
        "../static/utils/js/jquery-3.1.1",
        "../static/utils/js/base/base",
        '../static/utils/js/base/paging',
        "../static/utils/vue/mixins/tools",
        "../static/utils/vue/mixins/baseComponents",
    ],
    function ($alfie, $com, $page, $mixinsTools, $baseComponents) {
        /**
         *  请求列表
         *  $URI: string    请求地址 - 必填
         *  type: string   请求类型 - 必填
         *  errMsg:string   错误提示 - 可填 默认值为 httpErrMsg[$TYPE]
         */
        var uriList = {
            getData: { type: "get", url: "/QMSQuality/GetWorkpieceCheckResult" },
            getProduct: { type: "get", url: "/FPCProduct/GetAll" }
        };
        /**
         * 请求默认提示语
         * key: 请求类型
         * val: 提示文本
         */
        var httpErrMsg = {
            Get: "获取失败，请检查网络",
            get: "获取失败，请检查网络",
            Post: "提交失败，请检查网络",
            post: "提交失败，请检查网络",
        };

        /***
         * 公用请求方法
         * @param uriName   请求名称
         * @param data      数据
         * @param fn        回调函数
         * @param context   上下文
         */
        function http(uriName, data, fn, context) {
            var u = uriList[uriName];
            var d = { $URI: u.url, $TYPE: u.type };

            function err() {
                $com.app.tip(u.errMsg || httpErrMsg[u.type]);
            }

            $com.app.ajax($.extend(d, data), fn, err, context);
        };

        // 导出/导出数据字典时需要的参数
        var excelParams = {
            fileName: '工件检测结果列表.xls',
            title: '工件检测结果列表',
            head: {
                'ID': '序号',
                'OrderNo': '订单号',
                'ProductNo': '产品编号',
                'ProductName': '产品名称',
                'WorkpieceNo': '工件编码',
                'LargeDiameter': '大径(mm)',
                'MiddleDiameter': '中径(mm)',
                'SmallDiameter': '小径(mm)',
                'Pitch': '螺距(mm)',
                'CheckParameter1': '检测参数1',
                'CheckParameter2': '检测参数2',
                'CheckParameter3': '检测参数3',
                'CheckParameter4': '检测参数4',
                'CheckParameter5': '检测参数5',
                'CheckParameter6': '检测参数6',
                'CheckParameter7': '检测参数7',
                'CheckParameter8': '检测参数8',
                'CheckParameter9': '检测参数9',
                'CheckParameter10': '检测参数10',
                'CheckParameter11': '检测参数11',
                'CheckParameter12': '检测参数12',
                'CheckParameter13': '检测参数13',
                'CheckParameter14': '检测参数14',
                'CheckParameter15': '检测参数15',
                'CreateTime': '检测时间',
                'CheckResult': '检测结果',
            },
            order: ['ID', 'OrderNo', 'ProductNo', 'ProductName', 'WorkpieceNo', 'LargeDiameter', 'MiddleDiameter', 'SmallDiameter',
                'Pitch', 'CheckParameter1', 'CheckParameter2', 'CheckParameter3', 'CheckParameter4', 'CheckParameter5', 'CheckParameter6',
                'CheckParameter7', 'CheckParameter8', 'CheckParameter9', 'CheckParameter10', 'CheckParameter11', 'CheckParameter12', 'CheckParameter13',
                'CheckParameter14', 'CheckParameter15', 'CreateTime', 'CheckResult',
            ],
            AssetNoString: '',
        };

        // 表头
        var tableHead = [
            { label: "序号", type: "sequence" },
            { label: "订单号", key: "OrderNo" },
            { label: "产品编号", key: "ProductNo" },
            { label: "产品名称", key: "ProductName" },
            { label: "工件编码", key: "WorkpieceNo" },
            { label: "大径(mm)", key: "LargeDiameter" },
            { label: "中径(mm)", key: "MiddleDiameter" },
            { label: "小径(mm)", key: "SmallDiameter" },
            { label: "螺距(mm)", key: "Pitch" },
            { label: "检测参数1", key: "CheckParameter1" },
            { label: "检测参数2", key: "CheckParameter2" },
            { label: "检测参数3", key: "CheckParameter3" },
            { label: "检测参数4", key: "CheckParameter4" },
            { label: "检测参数5", key: "CheckParameter5" },
            { label: "检测参数6", key: "CheckParameter6" },
            { label: "检测参数7", key: "CheckParameter7" },
            { label: "检测参数8", key: "CheckParameter8" },
            { label: "检测参数9", key: "CheckParameter9" },
            { label: "检测参数10", key: "CheckParameter10" },
            { label: "检测参数11", key: "CheckParameter11" },
            { label: "检测参数12", key: "CheckParameter12" },
            { label: "检测参数13", key: "CheckParameter13" },
            { label: "检测参数14", key: "CheckParameter14" },
            { label: "检测参数15", key: "CheckParameter15" },
            { label: "检测时间", key: "CreateTime" },
            { label: "检测结果", key: "CheckResult" },
        ];

        // 搜索条件模板
        var searchTemplate = {
            OrderNo: "", ProductID: [], WorkpieceNo: "",
            StartTime: new Date(new Date().setHours(0, 0, 0, 0) - 30 * 24 * 60 * 60 * 1000), EndTime: new Date(new Date().setHours(23,59,59,999)),
        };

        var model = $com.Model.create({
            el: "#workpieceCheckResult-body",
            name: "质量抽检记录",
            VueName: "vm",
            mixins: [$mixinsTools, $baseComponents],
            data: {
                // 表头
                tableHead: tableHead,
                // 搜索框数据
                searchData: $com.util.Clone(searchTemplate),
                // 数据列表
                tableData: [],
                //下拉框数据
                selectOptions: {
                    ProductList: []
                },
            },
            filters: {

            },
            created: function () {
                this.search();
                this.getSelectOptions();
            },
            mounted: function () {
                this.search();
            },
            methods: {
                // 查询
                search: function ($event) {
                    var that = this;
                    var params = {
                        $URI: '/QMSQuality/GetWorkpieceCheckResult',
                        $TYPE: 'Get',
                        PageCountProp: 'info',
                        DataListProp: 'list',
                        OrderNo: that.searchData.OrderNo,
                        ProductID: that.searchData.ProductID.join(","),
                        WorkpieceNo: that.searchData.WorkpieceNo,
                        StartTime: that.searchData.StartTime == null ? "" : $com.util.format("yyyy-MM-dd hh:mm:ss", that.searchData.StartTime),
                        EndTime: that.searchData.EndTime == null ? "" : $com.util.format("yyyy-MM-dd hh:mm:ss", that.searchData.EndTime),
                        Paging: 1,
                        PageSize: 20,
                        Deeps: 4,
                    };
                    $com.app.loading("数据加载中...");
                    $page.init($('.el-table .el-table__body-wrapper > table'), null, params, function (res) {
                        $com.app.loaded();
                        that.tableData = res;
                    });
                },
                // 清空
                emptyClick: function () {
                    this.searchData = $com.util.Clone(searchTemplate);
                },
                exportClick: function () {
                    var that = this;
                    var params = {
                        OrderNo: that.searchData.OrderNo,
                        ProductID: that.searchData.ProductID.join(","),
                        WorkpieceNo: that.searchData.WorkpieceNo,
                        StartTime: that.searchData.StartTime == null ? "" : $com.util.format("yyyy-MM-dd hh:mm:ss", that.searchData.StartTime),
                        EndTime: that.searchData.EndTime == null ? "" : $com.util.format("yyyy-MM-dd hh:mm:ss", that.searchData.EndTime),
                        Paging: 0
                    };
                    http("getData", params, function (res) {
                        model.com.Exportexcel(res.list);
                    });
                },
                // 获取下拉框数据
                getSelectOptions: function () {
                    var that = this;
                    http("getProduct", { Active: 1, Paging: 0}, function (res) {
                        that.selectOptions.ProductList = res.list;
                    });
                },
                // 搜索框时间变化  -- 当开始时间>结束时间时调换开始&结束时间
                pickerChange() {
                    var startTime = new Date(this.searchData.StartTime);
                    var endTime = new Date(this.searchData.EndTime);

                    // 排序
                    if (startTime > endTime) {
                        var n = this.searchData.StartTime;
                        this.searchData.StartTime = this.searchData.EndTime;
                        this.searchData.EndTime = n;
                    }
                },
            },
            events: function () {
            },
            com: {
                Exportexcel: function (data) {
                    excelParams.data = $com.util.Clone(data);
                    // 处理data数据
                    excelParams.data.forEach(function (item) {
                        // 无效时间转换为空
                        var min = new Date('2020-01-01 00:00:00');
                        tableHead.forEach(function (column) {
                            if (column.type === 'time') {
                                var now = new Date(item[column.key]);
                                if (now < min) item[column.key] = '';

                            }
                        });
                    });

                    model.com.postExportExcel(excelParams, function (res) {
                        var src = res.info.path;
                        debugger;
                        console.log(src);
                        if (src.indexOf('iPlantSCADA') != -1) {
                            window.open(src);
                            alert('导出成功');
                        } else {
                            window.open('/iPlantSCADA' + src);
                        }
                    });
                },
                //导出
                postExportExcel: function (data, fn, context) {
                    var d = {
                        $URI: '/Upload/ExportExcel',
                        $TYPE: 'post',
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                }
            }
        });
        model.init();
    });
