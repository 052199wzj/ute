require(
    [
        "../static/utils/js/jquery-3.1.1",
        "../static/utils/js/base/base",
        "../static/utils/js/base/paging",
    ],
    function ($alfie, $com, $page) {

        var globalData = {
            // 搜索条件模板
            searchTemplate: {
                ProjectName: "",
                UserID: "",
                ResponseStatus: "",
                IntervalMin: "",
                IntervalMax: "",
                timeSection: [
                    $com.util.format("yyyy-MM-dd", new Date().getTime()),
                    $com.util.format("yyyy-MM-dd", new Date().getTime() + 86400000)
                ],
                // page.init
                PageSize: 20,
                PageIndex: 1,
                $URI: "/HomePage/GetApiLog",
                $TYPE: "Get", 
                PageCountProp: "info",
                DataListProp: "list",
                Deeps: 4,
            },
            // 工程名称列表
            projectName: [
                {ID: "/iPlantSCADA", Name: "/iPlantSCADA"},
            ],
            // 响应码列表
            responseStatus: [1000, 200, 400, 401, 404, 500, 501, 502, 504]
        };

        var Api = {
            // 访问日志
            getApiLog: function (data, fn, context) {
                var d = {
                    $URI: "/HomePage/GetApiLog",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip("提交失败，请检查网络");
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            // 用户列表
            getUser: function (data, fn, context) {
                var d = {
                    $URI: "/User/All",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip("提交失败，请检查网络");
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
        };

        var model = $com.Model.create({
            el: "#access-log-body",
            name: "访问日志",
            VueName: "vm",
            data: {
                searchData: $com.util.Clone(globalData.searchTemplate),
                tableData: [],
                selectOptions: {
                    user: [{ID: "-100", Name: "SHRIS"}].concat(window.parent._UserAll),
                    projectName: globalData.projectName,
                    responseStatus: globalData.responseStatus,
                }
            },
            computed: {
                // 用户姓名 key：用户ID value：用户名
                userName: function () {
                    var map = {};
                    this.selectOptions.user.forEach(function (item) {
                        map[item.ID + ""] = item.Name;
                    });
                    return map;
                }
            },
            filters: {},
            watch: {},
            mounted: function () {
                this.search();
            },
            methods: {
                search: function () {
                    $com.app.loading();
                    var that = this;
                    var params = $com.util.Clone(that.searchData);

                    // 处理请求参数
                    (function () {
                        params.StartTime = params.timeSection[0];
                        params.EndTime = params.timeSection[1];
                        delete params.timeSection;
                    })();

                    $page.init($(".el-table .el-table__body-wrapper > table"), null, params, function (res) {
                        that.tableData = res;
                        $com.app.loaded();
                    });
                },
                emptyClick: function () {
                    this.searchData = $com.util.Clone(globalData.searchTemplate);
                },
                // 响应时长输入
                IntervalInput: function () {

                    // 用于保证min<max
                    var min = Number(this.searchData.IntervalMin);
                    var max = Number(this.searchData.IntervalMax);


                    if (isNaN(min)) {
                        this.searchData.IntervalMin = "";
                    } else if (isNaN(max)) {
                        this.searchData.IntervalMax = "";
                    } else {
                        if (min > max && max !== 0) {
                            this.searchData.IntervalMin = max;
                            this.searchData.IntervalMax = min;
                        }
                    }
                },
                // user  ID转Name
                formatterUser: function (row) {
                    return this.userName[row.LoginID];
                },
                // 如果为空则不展示空数组
                formatterParams: function (row) {
                    return row["Params"] === "[]" ? "" : row["Params"];
                },
            },
            events: function () {
            },
        });
        model.init();
    });
