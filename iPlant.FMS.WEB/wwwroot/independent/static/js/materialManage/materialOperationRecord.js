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
        var tableHead = [
            { label: "序号", type: "sequence" },
            { label: "存放点", key: "MaterialStoragePoint" },
            { label: "物料编号", key: "MaterialNo" },
            { label: "物料名称", key: "MaterialName" },
            { label: "规格", key: "Groes" },
            { label: "批次", key: "MaterialBatch" },
            { label: "操作类型", key: "OperationTypeName" },
            { label: "数量", key: "Num" },
            { label: "创建人", key: "Creator" },
            { label: "创建时间", key: "CreateTime" },
            { label: "备注", key: "Remark" },
        ];
        // 搜索条件模板
        var searchTemplate = { MaterialStoragePoint: "", MaterialNo: "", MaterialName: "", MaterialBatch: "", OperationType: "-1" };

        var model = $com.Model.create({
            el: "#materialOperationRecord-body",
            name: "物料操作记录",
            VueName: "vm",
            mixins: [$mixinsTools, $baseComponents],
            data: {
                // 表头
                tableHead: tableHead,
                // 搜索框数据
                searchData: $com.util.Clone(searchTemplate),
                // 数据列表
                tableData: [],
            },
            filters: {

            },
            created: function () {
                this.search();
            },
            mounted: function () {
                this.search();
            },
            methods: {
                // 查询
                search: function ($event) {
                    var that = this;

                    var params = {
                        $URI: '/MSSMaterial/GetMaterialOperationRecord',
                        $TYPE: 'Get',
                        PageCountProp: 'info',
                        DataListProp: 'list',
                        MaterialStoragePoint: that.searchData.MaterialStoragePoint,
                        MaterialNo: that.searchData.MaterialNo,
                        MaterialName: that.searchData.MaterialName,
                        MaterialBatch: that.searchData.MaterialBatch,
                        OperationType: that.searchData.OperationType,
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
                    this.searchData.MaterialStoragePoint = "";
                    this.searchData.MaterialNo = "";
                    this.searchData.MaterialName = "";
                    this.searchData.MaterialBatch = "";
                    this.searchData.OperationType = "-1";
                }
            },
            events: function () {
            },
        });
        model.init();
    });
