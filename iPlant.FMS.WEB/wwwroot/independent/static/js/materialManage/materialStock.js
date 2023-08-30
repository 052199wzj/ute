require(
    [
        "../static/utils/js/jquery-3.1.1",
        "../static/utils/js/base/base",
        '../static/utils/js/base/paging',
        "../static/utils/vue/mixins/tools",
        "../static/utils/vue/mixins/baseComponents",
    ],
    function ($alfie, $com, $page, $mixinsTools, $baseComponents) {
        var formSelectOptions = {
            MaterialID: [],
            OperationType: [],
        };

        var formOptions = [
            {
                label: "物料", value: "MaterialID", type: 'select', rules: ["required"], options: formSelectOptions.MaterialID
                , span: 24
            },
            { label: "存放点", value: "MaterialStoragePoint", rules: ["required"] },
            { label: "批次", value: "MaterialBatch", rules: ["required"] },
            { label: "操作类型", value: "OperationType", type: 'select', rules: ["required"]},
            { label: "数量", value: "Num", rules: ["required"], type: 'number'  },
            { label: "备注", value: "Remark", type: 'textarea'}
        ];


        /**
         *  请求列表
         *  $URI: string    请求地址 - 必填
         *  type: string   请求类型 - 必填
         *  errMsg:string   错误提示 - 可填 默认值为 httpErrMsg[$TYPE]
         */
        var uriList = {
            getData: { type: "get", url: "/MSSMaterial/GetMaterialStock" },
            getMaterial: { type: "get", url: "/MSSMaterial/GetAll" },
            add: { type: "post", url: "/MSSMaterial/AddMaterialOperationRecord" }
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
            { label: "库存数量", key: "Num" },
            { label: "操作", type: "operation" },
        ];
        // 搜索条件模板
        var searchTemplate = { MaterialStoragePoint: "", MaterialNo: "", MaterialName: "", MaterialBatch: ""};

        var model = $com.Model.create({
            el: "#materialStock-body",
            name: "物料库存",
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
                        $URI: '/MSSMaterial/GetMaterialStock',
                        $TYPE: 'Get',
                        PageCountProp: 'info',
                        DataListProp: 'list',
                        MaterialStoragePoint: that.searchData.MaterialStoragePoint,
                        MaterialNo: that.searchData.MaterialNo,
                        MaterialName: that.searchData.MaterialName,
                        MaterialBatch: that.searchData.MaterialBatch,
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
                },
                // 添加出入库记录
                outInStoreClick: function () {
                    var that = this;
                    formSelectOptions.OperationType = [{ Name: "入库", ID: 1 }, { Name: "出库", ID: 2 }];
                    var myPopupForm = that.$refs["myPopupForm"];
                    var newOptions = {
                        MaterialID: '',
                        MaterialStoragePoint: '',
                        MaterialBatch: '',
                        OperationType: { options: formSelectOptions.OperationType },
                        Num: '',
                        Remark: ''
                    };
                    myPopupForm.open({
                        title: "物料出入库",
                        option: myPopupForm.newOptions(newOptions, formOptions),
                        confirm: function (rst) {
                            //调用修改函数
                            if (!rst || $.isEmptyObject(rst)) return false;
                            var _data = {
                                MaterialID: Number(rst.MaterialID),
                                MaterialStoragePoint: rst.MaterialStoragePoint,
                                MaterialBatch: rst.MaterialBatch,
                                OperationType: Number(rst.OperationType),
                                Num: Number(rst.Num),
                                Remark: rst.Remark,
                            };
                            http("add", { data: _data }, function (res) {
                                alert("记录增加成功！！");
                                that.search();
                            });
                        },
                    });
                },
                // 添加出入库记录
                outInStoreClick1: function (row) {
                    var that = this;
                    formSelectOptions.OperationType = [{ Name: "入库", ID: 1 }, { Name: "出库", ID: 2 }];
                    var newRow = $com.util.Clone(row);
                    var myPopupForm = that.$refs["myPopupForm"];
                    var MaterialID = that.ToolNewSelectOptions(
                        [row.MaterialID],
                        [row.MaterialNo + " - " + row.MaterialName],
                        formSelectOptions.MaterialID,
                    );
                    var newOptions = {
                        MaterialID: {
                            default: newRow.MaterialID,
                            options: MaterialID,
                            disabled: true
                        },
                        MaterialStoragePoint: { default:newRow.MaterialStoragePoint, disabled: true },
                        MaterialBatch: { default: newRow.MaterialBatch, disabled: true},
                        OperationType: { options: formSelectOptions.OperationType },
                        Num: '',
                        Remark: ''
                    };
                    myPopupForm.open({
                        title: "物料出入库",
                        option: myPopupForm.newOptions(newOptions, formOptions),
                        confirm: function (rst) {
                            //调用修改函数
                            if (!rst || $.isEmptyObject(rst)) return false;
                            newRow.MaterialID = Number(rst.MaterialID);
                            newRow.MaterialStoragePoint = rst.MaterialStoragePoint;
                            newRow.MaterialBatch = rst.MaterialBatch;
                            newRow.OperationType = Number(rst.OperationType);
                            newRow.Num = Number(rst.Num);
                            newRow.Remark = rst.Remark;
                            http("add", { data: newRow }, function (res) {
                                alert("记录增加成功！！");
                                that.search();
                            });
                        },
                    });
                },
                // 添加盘点记录
                inventoryClick: function () {
                    var that = this;
                    formSelectOptions.OperationType = [{ Name: "盘盈", ID: 4 }, { Name: "盘亏", ID: 5 }];

                    var myPopupForm = that.$refs["myPopupForm"];
                    var newOptions = {
                        MaterialID: '',
                        MaterialStoragePoint: '',
                        MaterialBatch: '',
                        OperationType: { options: formSelectOptions.OperationType },
                        Num: '',
                        Remark: ''
                    };
                    myPopupForm.open({
                        title: "物料盘点",
                        option: myPopupForm.newOptions(newOptions, formOptions),
                        confirm: function (rst) {
                            //调用修改函数
                            if (!rst || $.isEmptyObject(rst)) return false;
                            var _data = {
                                MaterialID: Number(rst.MaterialID),
                                MaterialStoragePoint: rst.MaterialStoragePoint,
                                MaterialBatch: rst.MaterialBatch,
                                OperationType: Number(rst.OperationType),
                                Num: Number(rst.Num),
                                Remark: rst.Remark,
                            };
                            http("add", { data: _data }, function (res) {
                                alert("记录增加成功！！");
                                that.search();
                            });
                        },
                    });
                },
                // 添加盘点记录
                inventoryClick1: function (row) {
                    var that = this;
                    formSelectOptions.OperationType = [{ Name: "盘盈", ID: 4 }, { Name: "盘亏", ID: 5 }];
                    
                    var newRow = $com.util.Clone(row);
                    var myPopupForm = that.$refs["myPopupForm"];
                    var MaterialID = this.ToolNewSelectOptions(
                        [row.MaterialID],
                        [row.MaterialNo + " - " + row.MaterialName],
                        formSelectOptions.MaterialID,
                    );
                    var newOptions = {
                        MaterialID: {
                            default: newRow.MaterialID,
                            options: MaterialID,
                            disabled: true
                        },
                        MaterialStoragePoint: { default: newRow.MaterialStoragePoint, disabled: true },
                        MaterialBatch: { default: newRow.MaterialBatch, disabled: true },
                        OperationType: { options: formSelectOptions.OperationType },
                        Num: '',
                        Remark: ''
                    };
                    myPopupForm.open({
                        title: "物料盘点",
                        option: myPopupForm.newOptions(newOptions, formOptions),
                        confirm: function (rst) {
                            //调用修改函数
                            if (!rst || $.isEmptyObject(rst)) return false;
                            newRow.MaterialID = Number(rst.MaterialID);
                            newRow.MaterialStoragePoint = rst.MaterialStoragePoint;
                            newRow.MaterialBatch = rst.MaterialBatch;
                            newRow.OperationType = Number(rst.OperationType);
                            newRow.Num = Number(rst.Num);
                            newRow.Remark = rst.Remark;

                            http("add", { data: newRow }, function (res) {
                                alert("记录增加成功！！");
                                that.search();
                            });
                        },
                    });
                },
                // 获取下拉框数据
                getSelectOptions: function () {
                    http("getMaterial", { Active: 1, Paging:0 }, function (res) {
                        var arr = formSelectOptions.MaterialID;
                        arr.splice(0, arr.length);
                        res.list.forEach(function (item) {
                            var mol = { Name: item.MaterialNo + " - " + item.MaterialName, ID: item.ID };
                            arr.push(mol);
                        });             
                    });
                },
            },
            events: function () {
            },
        });
        model.init();
    });
