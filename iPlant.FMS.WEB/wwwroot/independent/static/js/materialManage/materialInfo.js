require(
    [
        "../static/utils/js/jquery-3.1.1",
        "../static/utils/js/base/base",
        '../static/utils/js/base/paging',
        "../static/utils/vue/mixins/tools",
        "../static/utils/vue/mixins/baseComponents",
    ],
    function ($alfie, $com, $page, $mixinsTools, $baseComponents) {

        var formOptions = [
            { label: "ID", value: "ID" },
            { label: "物料编号", value: "MaterialNo", rules: ["required"] },
            { label: "物料名称", value: "MaterialName", rules: ["required"] },
            { label: "规格", value: "Groes" },
            { label: "备注", value: "Remark", type: 'textarea'}
        ];

        /**
         *  请求列表
         *  $URI: string    请求地址 - 必填
         *  type: string   请求类型 - 必填
         *  errMsg:string   错误提示 - 可填 默认值为 httpErrMsg[$TYPE]
         */
        var uriList = {
            getData: { type: "get", url: "/MSSMaterial/GetAll" },
            update: { type: "post", url: "/MSSMaterial/Update" },
            delete: { type: "post", url: "/MSSMaterial/Delete" },
            changeActive: { type: "post", url: "/MSSMaterial/Active" }
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

        // 导出/导出数据字典时需要的参数
        var excelParams = {
            fileName: '物料信息列表.xls',
            title: '物料信息列表',
            head: {
                'ID': '序号',
                'MaterialNo': '物料编号',
                'MaterialName': '物料名称',
                'Groes': '规格',
                'Creator': '创建人',
                'CreateTime': '创建时间',
                'Editor': '编辑人',
                'EditTime': '编辑时间',
                'Remark': '备注',
                'Active': '状态',
            },
            order: ['ID', 'MaterialNo', 'MaterialName', 'Groes', 'Creator', 'CreateTime', 'Editor', 'EditTime',
                'Remark', 'Active'
            ],
            AssetNoString: '',
        };

        // 激活状态 (index: 0-1)
        var activeStatusStr = [
            '不启用',
            '启用'
        ];

        // 表头
        var tableHead = [
            { label: "序号", type: "sequence" },
            { label: "物料编号", key: "MaterialNo" },
            { label: "物料名称", key: "MaterialName" },
            { label: "规格", key: "Groes" },
            { label: "创建人", key: "Creator" },
            { label: "创建时间", key: "CreateTime"},
            { label: "编辑人", key: "Editor" },
            { label: "编辑时间", key: "EditTime" },
            { label: "备注", key: "Remark" },
            { label: "状态", key: "Active", type: "switch"},
            { label: "操作", type: "operation" },
        ];
        // 搜索条件模板
        var searchTemplate = { MaterialNo: "", MaterialName: "", Groes: "", Active: "-1" };

        var model = $com.Model.create({
            el: "#materialInfo-body",
            name: "物料信息管理",
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
                // 激活状态
                switchStatus: function (e) {
                    // 0-从未激活 1-激活 2-关闭
                    return e === 1;
                }
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
                        $URI: '/MSSMaterial/GetAll',
                        $TYPE: 'Get',
                        PageCountProp: 'info',
                        DataListProp: 'list',
                        MaterialNo: that.searchData.MaterialNo,
                        MaterialName: that.searchData.MaterialName,
                        Groes: that.searchData.Groes,
                        Active: that.searchData.Active,
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
                    this.searchData.MaterialNo = "";
                    this.searchData.MaterialName = "";
                    this.searchData.Groes = "";
                    this.searchData.Active = "-1";
                },
                // 添加
                addClick: function () {

                    var that = this;
                    var myPopupForm = that.$refs["myPopupForm"];
                    var newOptions = {
                        MaterialNo: '',
                        MaterialName: '',
                        Groes: { span: 24 },
                        Remark: ''
                    };
                    myPopupForm.open({
                        title: "新增物料",
                        option: myPopupForm.newOptions(newOptions, formOptions),
                        confirm: function (rst) {
                            if (!rst || $.isEmptyObject(rst)) {
                                return false;
                            }
                            var _data = {
                                ID: 0,
                                MaterialNo: rst.MaterialNo,
                                MaterialName: rst.MaterialName,
                                Groes: rst.Groes,
                                Remark: rst.Remark,
                                Active: 1
                            };
                            http("update", { data: _data }, function (res) {
                                alert("新增成功！！");
                                that.search();
                            });
                        },
                    });

                },
                exportClick: function () {
                    var that = this;
                    var params = {
                        MaterialNo: that.searchData.MaterialNo,
                        MaterialName: that.searchData.MaterialName,
                        Groes: that.searchData.Groes,
                        Active: that.searchData.Active,
                        Paging: 0
                    };
                    http("getData", params , function (res) {
                        model.com.Exportexcel(res.list);
                    });
                },
                // 编辑
                editClick: function (row) {
                    var that = this;
                    var newRow = $com.util.Clone(row);
                    var myPopupForm = that.$refs["myPopupForm"];
                    var newOptions = {
                        //ID: newRow.ID,
                        MaterialNo: newRow.MaterialNo,
                        MaterialName: newRow.MaterialName,
                        Groes: newRow.Groes,
                        Remark: newRow.Remark
                    };
                    myPopupForm.open({
                        title: "修改物料信息",
                        option: myPopupForm.newOptions(newOptions, formOptions),
                        confirm: function (rst) {
                            //调用修改函数
                            if (!rst || $.isEmptyObject(rst)) return false;
                            newRow.MaterialNo = rst.MaterialNo;
                            newRow.MaterialName = rst.MaterialName;
                            newRow.Groes = rst.Groes;
                            newRow.Remark = rst.Remark;

                            http("update", { data: newRow }, function (res) {
                                alert("修改成功！！");
                                that.search();
                            });
                        },
                    });
                },
                // 删除
                removeClick: function (row) {
                    var that = this;
                    if (!confirm("已选择1条数据，确定将其删除？")) {
                        return false;
                    }
                    http("delete", { data: [row] }, function (res) {
                        alert("删除成功！！");
                        that.search();
                    });
                },
                // 切换激活状态
                activeChange: function (row) {
                    var that = this;
                    var newActive = row.Active === 1 ? 0 : 1;
                    var data = {
                        Active: newActive,
                        data: [row],
                    };
                    http("changeActive", data, function () {
                        row.Active = newActive;
                        that.search();
                        alert("操作成功！");
                    });
                },
            },
            events: function () {
            },
            com: {
                Exportexcel: function (data) {
                    excelParams.data = $com.util.Clone(data);
                    // 处理data数据
                    excelParams.data.forEach(function (item) {
                        // Active转为可阅读文本
                        item.Active = activeStatusStr[item.Active];
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
