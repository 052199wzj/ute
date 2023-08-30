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
            getProduct: { type: "get", url: "/FPCProduct/GetAll" },
            getWorkpieceRepair: { type: "get", url: "/QMSQuality/GetWorkpieceRepairRecord" },
            getThreeDimensionalCheckResult: { type: "get", url: "/QMSQuality/GetThreeDimensionalCheckResult" },
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
        }

        // 表头
        //var tableHead = [
        //    { label: "序号", type: "sequence" },
        //    { label: "订单号", key: "OrderNo" },
        //    { label: "产品编号", key: "ProductNo" },
        //    { label: "产品名称", key: "ProductName" },
        //    { label: "工件编码", key: "WorkpieceNo" },
        //    { label: "大径(mm)", key: "LargeDiameter" },
        //    { label: "中径(mm)", key: "MiddleDiameter" },
        //    { label: "小径(mm)", key: "SmallDiameter" },
        //    { label: "螺距(mm)", key: "Pitch" },
        //    { label: "抽检人", key: "Creator" },
        //    { label: "抽检时间", key: "CreateTime" },
        //    { label: "抽检结果", key: "SpotCheckResult" },
        //    { label: "不合格原因", key: "NokReason" },
        //];
        // 搜索条件模板
        var searchTemplate = {
            OrderNo: "", ProductID: [], WorkpieceNo: "", ProcessStatus: "-1",
            StartTime: new Date(new Date().setHours(0, 0, 0, 0) - 30 * 24 * 60 * 60 * 1000), EndTime: new Date(new Date().setHours(23,59,59,999)),
        };

        var model = $com.Model.create({
            el: "#workpieceQualityInfo-body",
            name: "工件质量信息",
            VueName: "vm",
            mixins: [$mixinsTools, $baseComponents],
            data: {
                // 表头
                //tableHead: tableHead,
                // 搜索框数据
                searchData: $com.util.Clone(searchTemplate),
                // 数据列表
                tableData: [],
                //返修记录
                workPieceRepairTableData: [],
                //三坐标结果
                threeDimensionalTableData:[],
                //下拉框数据
                selectOptions: {
                    ProductList: []
                },
                workPieceRepairDialogTableVisible : false,
                threeDimensionalDialogTableVisible: false,
                workpieceData: { OrderNo: "", ProductName: "", ProductNo: "", WorkpieceNo: "", ThreeDimensionalResult:""},
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
                        $URI: '/QMSQuality/GetWorkpieceQualityInfo',
                        $TYPE: 'Get',
                        PageCountProp: 'info',
                        DataListProp: 'list',
                        OrderNo: that.searchData.OrderNo,
                        ProductID: that.searchData.ProductID.join(","),
                        WorkpieceNo: that.searchData.WorkpieceNo,
                        ProcessStatus: that.searchData.ProcessStatus,
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
                repairCountClick: function (WorkpieceNo) {
                    var that = this;
                    http("getWorkpieceRepair", { WorkpieceNo: WorkpieceNo, Paging: 0 }, function (res) {
                        that.workPieceRepairTableData = res.list;
                        that.workPieceRepairDialogTableVisible = true;
                    });
                },
                threeDimensionalClick: function (row) {
                    var that = this;
                    that.workpieceData.OrderNo = row.OrderNo;
                    that.workpieceData.ProductName = row.ProductName;
                    that.workpieceData.ProductNo = row.ProductNo;
                    that.workpieceData.WorkpieceNo = row.WorkpieceNo;
                    that.workpieceData.ThreeDimensionalResult = row.ThreeDimensionalResult;
                    console.log(that.workpieceData);
                    http("getThreeDimensionalCheckResult", { WorkpieceID: row.WorkpieceID, Paging: 0 }, function (res) {
                        that.threeDimensionalTableData = res.list;
                        that.threeDimensionalDialogTableVisible = true;
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
        });
        model.init();
    });
