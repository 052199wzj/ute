require([
    "../static/utils/js/jquery-3.1.1",
    "../static/utils/js/base/paging",
    "../static/utils/js/base/base",
    "../static/utils/vue/mixins/tools",
], function ($lin, $page, $com, $mixinTools) {
    var globalData = {
        // 工单ID
        orderID: "",
        orderStatus: ["无", "已保存", "已制定", "已下达", "已开工", "已完工", "暂停中", "已入库", "已上传", "已关闭"],
        // 订单状态 - 步骤条对应进度  (index: 0-9)
        orderStatusLineBarIndex: [0, 0, 0, 0, 1, 2, 1, 2, 3, 2],
        // 当前状态是否为异常 Boolean
        orderStatusLineBarisErr: [0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
        // 人员列表
        UserAll: window.parent._UserAll.filter(function (item) {
            return item.Active === 1;
        }),
        // 近一个月
        aMonthAgo: $com.util.format("yyyy-MM-dd", new Date().getTime() - 30 * 86400000),
        // 当日
        today: $com.util.format("yyyy-MM-dd", new Date().getTime()),
        uriList: {
            orderInfo: {type: "Get", url: "/OMSOrder/Info"}, // 工单详情
            dmsProcessRecord: {type: "Get", url: "/DMSDeviceRepair/All"}, // 部件检修明细
            orderUpdate: {type: "Post", url: "/OMSOrder/Update"}, // 修改工单
            fMCStation: {type: "Get", url: "/FMCStation/All"}, // 工位列表
            teamManageAll: {type: "Get", url: "/TeamManage/All"}, // 班组列表
            getUser: {type: "Get", url: "/User/All"}, // 人员列表
        },
    };
    var that;
    var model = $com.Model.create({
        el: "#fzy-oms-order-info",
        VueName: "vm",
        name: "订单详情",
        mixins: [$mixinTools],
        data: {
            status: {
                // 正在编辑
                edit: false,
                // 查看详情
                info: false,
                // 是否拥有工单维护或跟踪权限
                isCheckRole: $com.app.checkRole(301000) || $com.app.checkRole(303000),
            },
            // 订单详情
            orderInfo: {},
            editOrder: {},
            // 下拉框 - 原始数据
            selectOptions: {
                teamManageList: [], // 班组列表
                fMCStationList: [], // 工位列表
                userList: [], // 人员列表
            },
            newSelectOptions: {
                teamManageList: [], // 班组列表
                fMCStationList: [], // 工位列表
                userList: [], // 人员列表
            },

            UriList: globalData.uriList, // 请求列表
            dmsProcessRecord: [], // 部件检修明细表
            dmsProcessRecordInfo: [], // 工件参数列表
        },
        computed: {
            // 部件检修明细表 表头
            dmsProcessRecordTh: function () {
                if (!that.dmsProcessRecord.length) return [];
                return that.dmsProcessRecord[0].ItemList.slice(0, 6);
            },
            // 进度条下标
            lineBarIndex: function () {
                return globalData.orderStatusLineBarIndex[that.orderInfo.Status];
            },
        },
        filters: {
            // 设备状态
            orderStatus: function (e) {
                return globalData.orderStatus[e];
            },
            teamName: function (teamID) {
                if (!teamID) return "";
                try {
                    return that.selectOptions.teamManageList.filter(function (item) {
                        return item.ID === teamID;
                    })[0].Name;
                } catch {
                    return "";
                }

            },
            fmsName: function (fmsID) {
                if (!fmsID) return "";
                try {
                    return that.selectOptions.fMCStationList.filter(function (item) {
                        return item.ID === fmsID;
                    })[0].Name;
                } catch {
                    return "";
                }

            },
            workerIDList: function (e) {
                if (!e) return "";
                try {
                    var arr = [];
                    e.forEach(function (id) {
                        var user = globalData.UserAll.filter(function (user) {
                            return user.ID === id;
                        })[0];
                        arr.push(user.Name);
                    });
                    return arr.join(",");
                } catch {
                    return "";
                }

            },
        },
        created: function () {
            that = this;
        },
        methods: {
            getData: function () {
                $com.app.loading("数据加载中...");
                var isOK = 0, httpNum = 4; // 请求次数
                function loaded() {
                    ++isOK < httpNum || $com.app.loaded();
                }

                // 班组列表 - 仅首次加载
                if (!that.selectOptions.fMCStationList.length) {
                    that.Http("teamManageAll", {Active: 1}, function (res) {
                        res.list.unshift({ID: 0, Name: "请选择"});
                        that.selectOptions.teamManageList = res.list;
                        loaded();
                    });
                } else loaded();

                // 工位列表 - 仅首次加载
                if (!that.selectOptions.fMCStationList.length) {
                    that.Http("fMCStation", {Active: 1}, function (res) {
                        that.selectOptions.fMCStationList = res.list;
                        loaded();
                    });
                } else loaded();

                // 工单详情
                that.Http("orderInfo", {ID: globalData.orderID}, function (res) {
                    that.orderInfo = res.info;
                    loaded();
                });

                // 部件检修明细表
                $page.init($("#femi-Device-tbody-item").closest("table"), null, {
                    $URI: "/DMSProcessRecord/All", 
                    $TYPE: "Get",
                    PageCountProp: "info",   //   服务器返回总页数的属性名称
                    DataListProp: "list",    //  服务器返回数据列表的属性名称
                    OrderID: model.data.orderInfo.ID,
                    Active: 1,
                    PageSize: 10,
                }, function (res) {
                    model.data.dmsProcessRecord = res;
                    loaded();
                });
            },
            // 步骤条图标
            getLineBarIcon: function (index) {
                if (this.lineBarIndex > index) {
                    return "../static/images/checkbox/Time_bule.png";
                } else if (this.lineBarIndex < index) {
                    return "../static/images/checkbox/Time_gray.png";
                } else {
                    return globalData.orderStatusLineBarisErr[this.orderInfo.Status]
                        ? "../static/images/checkbox/Time_red.png"
                        : "../static/images/checkbox/Time_yellow.png";
                }
            },
            // 编辑
            editClick: function () {

                if (that.status.edit) save();
                else edit();


                function edit() {


                    var a = {
                        "WorkerIDList": [202367],
                        "WorkerName": "李磊",
                        "ID": 91,
                        "CommandID": 36,
                        "ERPID": 0,
                        "OrderNo": "123123",
                        "LineID": 0,
                        "LineName": "",
                        "Status": 5,
                        "PlanReceiveDate": "2021-08-31 00:00:00",
                        "PlanFinishDate": "2021-09-30 00:00:00",
                        "RealStartDate": "2000-01-01 00:00:00",
                        "RealFinishDate": "2000-01-01 00:00:00",
                        "RealSendDate": "2000-01-01 00:00:00",
                        "Remark": "",
                        "StationID": 105,
                        "StationNo": "L-0001",
                        "StationName": "整体式地下架车机组",
                        "WorkName": "整体式地下架车机组",
                        "TeamID": 27,
                        "TeamNo": "BZ-00025",
                        "TeamName": "油漆班",
                        "CreatorID": 1,
                        "Creator": "superName",
                        "CreateTime": "2021-09-24 09:53:58",
                        "EditorID": 1,
                        "Editor": "superName",
                        "EditTime": "2021-09-24 10:59:56",
                        "AuditorID": 1,
                        "Auditor": "superName",
                        "AuditTime": "2021-09-24 10:05:12",
                        "OverTime": 11437920,
                        "OverTimeText": "7943天0小时0分钟",
                        "PartNo": "12",
                        "WBSNo": "12",
                        "ProductID": 0,
                        "ProductNo": "",
                        "CustomerID": 1,
                        "Customer": "18号线",
                        "ContactCode": "",
                        "LinkManID": 0,
                        "LinkMan": "",
                        "FactoryID": 1,
                        "Factory": "广州地铁安检培训基地",
                        "BusinessUnitID": 0,
                        "BusinessUnit": "",
                        "WorkShopID": 0,
                        "WorkShopName": "",
                    };
                    that.newSelectOptions.teamManageList = that.ToolNewSelectOptions(
                        [that.orderInfo.TeamNo],
                        [that.orderInfo.TeamName],
                        that.selectOptions.teamManageList,
                    );
                    that.newSelectOptions.fMCStationList = that.ToolNewSelectOptions(
                        [that.orderInfo.StationID],
                        [that.orderInfo.StationName],
                        that.selectOptions.fMCStationList,
                    );
                    that.newSelectOptions.userList = that.selectOptions.userList;


                    that.editOrder = that.ToolDeepClone(that.orderInfo);

                    var newWorkerIDList = [];
                    var WorkerIDList = that.editOrder.WorkerIDList;
                    for (let i in WorkerIDList) {
                        var len = that.newSelectOptions.userList.filter(function (item) {
                            return item.ID === WorkerIDList[i].ID;
                        }).length;
                        if (len > 1) {
                            newWorkerIDList.push(WorkerIDList[i]);
                            break;
                        }
                    }
                    that.editOrder.WorkerIDList = newWorkerIDList;

                    that.getUserList(that.editOrder.TeamID);
                }

                function save() {
                    if (!that.editOrder.OrderNo) return $com.app.tip("订单编号不能为空");
                    that.Http("orderUpdate", {data: that.editOrder}, function (res) {
                        that.orderInfo = res.info;
                        $com.app.tip("保存成功");
                    });
                }

                that.status.edit = !that.status.edit;

            },
            // 取消编辑
            cancelClick: function () {
                that.status.edit = false;
            },
            // 选择班组
            teamIDChange(teamID) {
                that.ToolArrEmpty(that.editOrder.WorkerIDList);
                that.getUserList(teamID);
            },
            // 获取当前人员列表
            getUserList: function (teamID) {
                try {
                    var teamManageUser = that.selectOptions.teamManageList.filter(function (item) {
                        return item.ID === teamID;
                    })[0].MateID;
                    that.selectOptions.userList = globalData.UserAll.filter(function (item) {
                        return teamManageUser.indexOf(item.ID) !== -1;
                    });
                } catch {
                    that.selectOptions.userList = [];
                }
            },
            // 查看详情
            dmsProcessRecordInfoClick: function (e) {
                that.dmsProcessRecordInfo = e;
                that.status.info = true;
            },
        },
        events: function () {
        },
        configure: function () {
            globalData.orderID = model.query.wID;
            model.methods.getData();
        },
    });
    model.init();

    window.HomeRefrush = function () {
        model.data.status.edit = false;
        model.data.status.info = false;
        model.methods.getData();
    };

});
