require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/paging', '../static/utils/js/base/base'],
    function ($lin, $page, $com) {

        var testData = [
            {
                OrderNo: '假数据!',
                MetroNo: '假数据',
                WorkPieceNo: '假数据',
                StartTime: '假数据',
                EndTime: '假数据',
                StatusText: '假数据',
                Remark: '假数据',
                ItemList: [
                    {
                        ParameterNo: 1001,
                        DataType: 3,
                        SampleTime: '2020-1-1',
                        ParameterName: '径向圆跳动',
                        ParameterDesc: '备注',
                        ParameterValue: '前:100; 后200',
                    },
                    {
                        ParameterNo: 1001,
                        DataType: 2,
                        SampleTime: '2020-1-1',
                        ParameterName: '径向圆跳动',
                        ParameterDesc: '备注',
                        ParameterValue: 10,
                    },
                    {
                        ParameterNo: 1001,
                        DataType: 1,
                        SampleTime: '2020-1-1',
                        ParameterName: '径向圆跳动',
                        ParameterDesc: '备注',
                        ParameterValue: true,
                    },
                    {
                        ParameterNo: 1001,
                        DataType: 4,
                        SampleTime: '2020-1-1',
                        ParameterName: '径向圆跳动',
                        ParameterDesc: '备注',
                        ParameterValue: 2.2222,
                    },
                    {
                        ParameterNo: 1001,
                        DataType: 5,
                        SampleTime: '2020-1-1',
                        ParameterName: '径向圆跳动',
                        ParameterDesc: '备注',
                        ParameterValue: 3.3333333,
                    },
                ],
            },
            {
                OrderNo: 0,
                MetroNo: 0,
                WorkPieceNo: 0,
                StartTime: '2021-6-29',
                EndTime: '2021-7-1',
                StatusText: '关机',
                Remark: '设备检修',
                ItemList: [
                    {
                        ParameterNo: 1001,
                        DataType: 3,
                        SampleTime: '2020-1-1',
                        ParameterName: '径向圆跳动',
                        ParameterDesc: '备注',
                        ParameterValue: '前:100; 后200',
                    },
                    {
                        ParameterNo: 1001,
                        DataType: 2,
                        SampleTime: '2020-1-1',
                        ParameterName: '径向圆跳动',
                        ParameterDesc: '备注',
                        ParameterValue: 10,
                    },
                    {
                        ParameterNo: 1001,
                        DataType: 1,
                        SampleTime: '2020-1-1',
                        ParameterName: '径向圆跳动',
                        ParameterDesc: '备注',
                        ParameterValue: true,
                    },
                    {
                        ParameterNo: 1001,
                        DataType: 4,
                        SampleTime: '2020-1-1',
                        ParameterName: '径向圆跳动',
                        ParameterDesc: '备注',
                        ParameterValue: 2.2222,
                    },
                    {
                        ParameterNo: 1001,
                        DataType: 5,
                        SampleTime: '2020-1-1',
                        ParameterName: '径向圆跳动',
                        ParameterDesc: '备注',
                        ParameterValue: 3.3333333,
                    },
                ],
            },
        ];

        var HTML = {
            selectOption: '<option value="{{ID}}">{{Name}}</option>',
        };

        var globalData = {
            orderID: '',// 工单ID
            UserAll: window.parent._UserAll.filter(function (item) {
                return item.Active === 1;
            }),
            orderInfoBackup: {}, // 订单详情备份
            // 订单状态 (index: 0-9)
            orderStatus: ['无', '已保存', '已制定', '已下达', '已开工', '已完工', '暂停中', '已入库', '已上传', '已关闭'],
            // 订单状态 - 步骤条对应进度  (index: 0-9)
            orderStatusLineBarIndex: [0, 0, 0, 0, 1, 2, 1, 2, 3, 2],
            // 当前状态是否为异常 Boolean
            orderStatusLineBarisErr: [0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
            // 近一个月
            aMonthAgo: $com.util.format('yyyy-MM-dd', new Date().getTime() - 30 * 86400000),
            // 当日
            today: $com.util.format('yyyy-MM-dd', new Date().getTime()),
            // 服务器最小日期 小于该日期则为非法日期(无效)
            minTime: new Date(2020, 0, 1),
            // 是否拥有工单维护或跟踪权限
            isCheckRole: $com.app.checkRole(301000) || $com.app.checkRole(303000),
        };
        /**
         *  请求列表
         *  $URI: string    请求地址 - 必填
         *  type: string   请求类型 - 必填
         *  errMsg:string   错误提示 - 可填 默认值为 httpErrMsg[$TYPE]
         */
        var uriList = {
            orderInfo: {type: 'Get', url: '/OMSOrder/Info'}, // 工单详情
            dmsProcessRecord: {type: 'Get', url: '/DMSDeviceRepair/All'}, // 部件检修明细
            orderUpdate: {type: 'Post', url: '/OMSOrder/Update'}, // 修改工单
            fMCStation: {type: 'Get', url: '/FMCStation/All'}, // 工位列表
            teamManageAll: {type: 'Get', url: '/TeamManage/All'}, // 班组列表
            getUser: {type: 'Get', url: '/User/All'}, // 人员列表
        };
        /**
         * 请求默认提示语
         * key: 请求类型
         * val: 提示文本
         */
        var httpErrMsg = {
            Get: '获取失败，请检查网络',
            get: '获取失败，请检查网络',
            Post: '提交失败，请检查网络',
            post: '提交失败，请检查网络',
        };

        var model = $com.Model.create({
            el: '#fzy-oms-order-info',
            VueName: 'vm',
            name: '订单详情',
            data: {
                isEdit: false, // 是否处于编辑状态
                isInfo: false, // 是否处于查看详情状态
                orderInfo: {}, // 订单详情
                dmsProcessRecord: [], // 部件检修明细表
                dmsProcessRecordInfo: [], // 工件参数列表
                teamManageList: [], // 班组列表
                fMCStationList: [], // 工位列表
                userAll: globalData.UserAll, // 全部人员
                // 是否拥有工单维护或跟踪权限
                isCheckRole: globalData.isCheckRole,
            },
            computed: {
                // 部件检修明细表 表头
                dmsProcessRecordTh: function () {
                    if (!this.dmsProcessRecord.length) return [];
                    return this.dmsProcessRecord[0].ItemList.slice(0, 6);
                },
                // 进度条下标
                lineBarIndex: function () {
                    return globalData.orderStatusLineBarIndex[this.orderInfo.Status];
                },
            },
            filters: {
                // 设备状态
                orderStatus: function (e) {
                    return globalData.orderStatus[e];
                },
                // 小数点后2位
                decimal2: function (e) {
                    return Number(e).toFixed(2);
                },
                decimal4: function (e) {
                    return Number(e).toFixed(4);
                },
                validTime: function (e) {
                    return $com.util.toDate(e) >= globalData.minTime
                        ? $com.util.format('yyyy-MM-dd', e)
                        : '-';
                },
            },
            configure: function () {
                this.run();
            },
            run: function () {
                // 首次进入页面
                globalData.orderID = model.query.wID;
                $('#fzy-user-list-select').attr('disabled', true).selectpicker('refresh');
                model.com.refresh();
            },
            events: function () {
                // 二次加载页面
                window.setFunctionTrigger('OMSOrderInfo', function (res) {
                    globalData.orderID = res.wID;
                    model.com.refresh();
                });
                // 作业人员下拉框
                $('body').delegate('#fzy-user-list-select', 'change', function (event) {
                    if (!model.data.isEdit) return false;
                    model.data.orderInfo.WorkerIDList = $('#fzy-user-list-select').val();
                });
            },
            com: {
                // 刷新
                refresh: function () {
                    $com.app.loading('数据加载中...');
                    var isOK = 0, httpNum = 4; // 请求次数
                    function loaded() {
                        if (++isOK < httpNum) return false;
                        $com.app.loaded();
                        model.com.getUserList(true);
                    }

                    // 工单详情
                    model.http('orderInfo', {ID: globalData.orderID}, function (res) {
                        model.data.orderInfo = res.info;
                        loaded();
                    });
                    // 部件检修明细表
                    $page.init($('#femi-Device-tbody-item').closest('table'), null, {
                        $URI: '/DMSProcessRecord/All',
                        
                        $TYPE: 'Get',
                        PageCountProp: 'info',   //   服务器返回总页数的属性名称
                        DataListProp: 'list',    //  服务器返回数据列表的属性名称
                        OrderID: model.data.orderInfo.ID,
                        Active: -1,
                        StartTime: globalData.aMonthAgo,
                        EndTime: globalData.today,
                        PageSize: 10,
                    }, function (res) {
                        if (res.length) model.data.dmsProcessRecord = res;
                        else model.data.dmsProcessRecord = testData;
                        loaded();
                    });

                    // 班组列表 - 仅首次加载
                    if (!model.data.fMCStationList.length) {
                        model.http('teamManageAll', {Active: 1}, function (res) {
                            model.data.teamManageList = res.list;
                            loaded();
                        });
                    } else loaded();
                    // 工位列表 - 仅首次加载
                    if (!model.data.fMCStationList.length) {
                        model.http('fMCStation', {Active: 1}, function (res) {
                            model.data.fMCStationList = res.list;
                            loaded();
                        });
                    } else loaded();
                },
                // 获取班组人员 isInitialize - 是否为初始化,非初始化时需清空已选中部分
                getUserList: function (isInitialize) {
                    var select = $('#fzy-user-list-select');

                    var teamManageUser = []
                    // 当前班组
                    try {
                        teamManageUser = model.data.teamManageList.filter(function (item) {
                            return item.ID === model.data.orderInfo.TeamID;
                        })[0].MateID;
                    } catch {
                        select.selectpicker('val', []).trigger('change');
                        return false;
                    }
                    // 当前班组人员
                    var userList = model.data.userAll.filter(function (item) {
                        return teamManageUser.indexOf(item.ID) !== -1;
                    });



                    select
                        .html($com.util.template(userList, HTML.selectOption))
                        .selectpicker('refresh');

                    // 赋值
                    if (!isInitialize) model.data.orderInfo.WorkerIDList = [];
                    select.selectpicker('val', model.data.orderInfo.WorkerIDList).trigger('change');
                },
                // 编辑/保存 按钮
                editClick: function () {
                    // var select = $('#fzy-user-list-select');
                    var select = $('td > select');

                    if (model.data.isEdit) {
                        // 保存
                        if (!model.data.orderInfo.OrderNo) return $com.app.tip('订单编号不能为空');
                        model.http('orderUpdate', {data: model.data.orderInfo}, function (res) {
                            model.data.isEdit = false;
                            select.attr('disabled', true).selectpicker('refresh');
                            model.data.orderInfo = res.info;
                            $com.app.tip('保存成功');
                            globalData.orderInfoBackup = {};
                        });

                    } else {
                        Object.assign(globalData.orderInfoBackup, model.data.orderInfo);
                        // 编辑
                        model.data.isEdit = true;
                        select.attr('disabled', false).selectpicker('refresh');
                    }
                },
                // 取消编辑
                cancelClick: function () {
                    Object.assign(model.data.orderInfo, globalData.orderInfoBackup);
                    globalData.orderInfoBackup = {};
                    model.data.isEdit = false;
                    // $('#fzy-user-list-select').attr('disabled', true).selectpicker('refresh');
                    $('td > select').attr('disabled', true).selectpicker('refresh');
                },
                // 查看详情
                dmsProcessRecordInfoClick: function (e) {
                    this.dmsProcessRecordInfo = e;
                    this.isInfo = true;
                },
                // 步骤条图标
                getLineBarIcon: function (index) {
                    if (this.lineBarIndex > index) {
                        return '../static/images/checkbox/Time_bule.png';
                    } else if (this.lineBarIndex < index) {
                        return '../static/images/checkbox/Time_gray.png';
                    } else {
                        return globalData.orderStatusLineBarisErr[this.orderInfo.Status]
                            ? '../static/images/checkbox/Time_red.png'
                            : '../static/images/checkbox/Time_yellow.png';
                    }
                },
            },
            /***
             * 公用请求方法
             * @param urlName   请求名称
             * @param data      数据
             * @param fn        回调函数
             * @param context   上下文
             */
            http: function (uriName, data, fn, context) {
                var u = uriList[uriName];

                var d = {$URI: u.url, $TYPE: u.type};

                function err() {
                    $com.app.tip(u.errMsg || httpErrMsg[u.type]);
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
        });
        model.init();
        // 刷新事件
        window.HomeRefrush = function () {
            model.com.refresh();
        };

    });