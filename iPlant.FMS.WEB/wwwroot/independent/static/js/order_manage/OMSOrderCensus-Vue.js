require(
    [
        '../static/utils/js/jquery-3.1.1',
        '../static/utils/js/base/base',
        '../static/utils/js/base/paging',
        '../static/utils/vue/mixins/tools',
        '../static/utils/vue/components/fzy/fzy-table/index',
    ],
    function($alfie, $com,$page, mixinsTools, componentsTable){
        /* 弹框 */
        var
            // 查询关键字
            KEYWORD = {},
            // 字段格式化对象
            Formattrt = {},
            // 定义字段格式(用于表格字段转换)
            KEYWORD_LIST,
            // 枚举对象(用于字段转换)
            TypeSource
        ;
        ( function(){
            // 下拉框数据  班组列表 班组成员  工位
            TypeSource = {
                StationID: [], // 工位
                TeamID: [],// 班组
                WorkerIDList: [], // 班组成员
                Status: [
                    {
                        name: '无',
                        value: 0,
                    },
                    {
                        name: '已保存',
                        value: 1,
                    },
                    {
                        name: '已制定',
                        value: 2,
                    },
                    {
                        name: '已下达',
                        value: 3,
                    },
                    {
                        name: '已开工',
                        value: 4,
                    },
                    {
                        name: '已完工',
                        value: 5,
                    },
                    {
                        name: '暂停中',
                        value: 6,
                    },
                    {
                        name: '已入库',
                        value: 7,
                    },
                    {
                        name: '已上传',
                        value: 8,
                    },
                    {
                        name: '已关闭',
                        value: 9,
                    } ],
                UserAll: [],
            };
            KEYWORD_LIST = [
                'OrderNo|订单编号*',
                'WBSNo|WBS编号',
                'PartNo|车号*',
                'StationID|工位*|ArrayOne',
                'TeamID|班组|ArrayOneControl',
                'WorkerIDList|班组成员|ArrayControl|TeamID',
                'CustomerID|客户(18号线)',
                'FactoryID|基地(万倾沙)',
                'PlanReceiveDate|计划进厂|Date',
                'RealReceiveDate|实际进厂|Date',
                'PlanFinishDate|预计完工|Date',
                'RealStartDate|实际开工|DateTime',
                'RealFinishDate|实际完工|DateTime',
                'RealSendDate|交车日期|Date',
                'Remark|备注',
                'Status|状态|ArrayOne',
                'CreateTime|时间|DateTime',
                'EditTime|时间|DateTime',
            ];

            $com.util.configBuild(KEYWORD_LIST, KEYWORD, TypeSource, Formattrt);

        } )();

        // 最小有效日期
        var minTime = new Date('2020-01-01 00:00:00');
        // 请求列表
        var UriList = {
            getOrder: { type: 'get', url: '/OMSOrder/All' },
            updateOrder: { type: 'post', url: '/OMSOrder/Update' },
            updateOrderList: { type: 'post', url: '/OMSOrder/UpdateList' },
            editOrder: { type: 'post', url: '/OMSOrder/Audit' },
            deleteOrder: { type: 'post', url: '/OMSOrder/Delete' },
            // 订单状态
            getStatusCount: { type: 'get', url: '/OMSOrder/StatusCount' },
            // 工位
            getFMCStation: { type: 'get', url: '/FMCStation/All' },
            // 班组
            getTeamManage: { type: 'get', url: '/TeamManage/All' },
            // 人员列表
            getUser: { type: 'get', url: '/User/All' },
        };
        // 表头 0-维护 1-跟踪 2-统计
        var tableHead = [
            { label: '序号', type: 'index' },
            { label: '车号', key: 'PartNo' },
            { label: '路线号', key: 'Customer' },
            { label: '工单编号', key: 'OrderNo' },
            { label: '下达时间', key: 'AuditTime', type: 'time' },
            { label: '作业名称', key: 'WorkName' },
            { label: '作业班组', key: 'TeamName' },
            { label: '作业人员', key: 'WorkerName' },
            { label: '计划日期', key: 'PlanReceiveDate', type: 'time' },
            { label: '逾期时间', key: 'OverTimeText', type: 'time' },
            { label: '订单状态', slot: 'status' },
            { label: '操作', slot: 'operation' },
        ];
        // 订单状态 (index: 0-9)
        var orderStatusStr = [ '无', '已保存', '已制定', '已下达', '已开工', '已完工', '暂停中', '已入库', '已上传', '已关闭' ];
        // 搜索条件模板
        var searchTemplate = {
            StatusList: [],
            OrderNo: '',
            timeSection: [
                $com.util.format('yyyy-MM-dd', new Date().getTime() - 30 * 24 * 3600 * 1000),
                $com.util.format('yyyy-MM-dd', new Date().getTime() + 24 * 3600 * 1000),
            ],
        };

        // 处理表格需要用到的数据
        var mFMCStation = [];
        var mTeamManage = [];
        var wUser = [];

        /**
         * StatusList      工单状态
         * OrderNo         工单编号
         * 作业名称 ？？？
         *
         * 开始/结束时间
         *      PreStartTime
         *      PreEndTime
         */

        var model = $com.Model.create({
            el: '#order-revice-body',
            name: '工单维护',
            VueName: 'vm',
            mixins: [ mixinsTools ],
            components: { fzyTable: componentsTable },
            data: {
                // 请求列表
                UriList: UriList,
                // 表头
                tableHead: tableHead,
                // 搜索框
                searchData: $com.util.Clone(searchTemplate),
                // 实际日期 or 计划日期
                timeType:'计划日期',
                // 数据列表
                tableData: [],
                // 工单总览
                statusCount: {},
                // 导入
                importData: {
                    status: 0, // 0-隐藏 1-导入中 2-导入成功
                    data: {
                        finishDate: [],
                        unFinishDate: [],
                    },
                },
            },
            computed: {
                // 工单总览 - 用于显示
                /*      orderOverview: function(){
                          var data = this.statusCount;
                          return [
                              { label: '全部工单', value: data.AllOrderNum, color: '#0ea9f7' },
                              // { label: '剩余订单', value: data.SurplusOrderNum, color: '#0ea9f7' },
                              { label: '待执行', value: data.TobeexecutedNum, color: '#e9967a' },
                              { label: '执行中', value: data.ExecutingNum, color: '#800080' },
                              { label: '被叫停', value: data.CalledoffNum, color: '#808080' },
                              { label: '已完成', value: data.FinishNum, color: '#008000' },
                              { label: '已关闭', value: data.CloseNum, color: '#ff0000' },
                          ];
                      },*/
            },
            filters: {
                // 激活状态
                switchStatus: function(e){
                    // 0-从未激活 1-激活 2-关闭
                    return e === 1;
                },
                // 订单状态
                orderStatusStr: function(e){
                    return orderStatusStr[e];
                },
                // 时间格式
                timeStr: function(e){
                    if( !e ){
                        return '-';
                    }
                    var now = new Date(e);
                    return now > minTime ? e : '-';
                },
                dateStr: function(e){
                    if( !e ){
                        return '-';
                    }
                    var now = new Date(e);
                    return now > minTime ? vm.ToolFormatTime('yyyy-mm-dd',e) : '-';
                },
            },
            watch: {},
            created: function(){
            },
            mounted: function(){
                this.search();
            },
            methods: {
                // type: 0-维护 1-跟踪 2-统计
                orderOverview(type){
                    var data = this.statusCount;
                    for( let key in data ){
                        data[key] === 'NaN%' && ( data[key] = '-' );
                    }
                    var arr = [];
                    /*
                        { label: '全部工单', value: data.AllOrderNum, color: '#0ea9f7' },
                        { label: '剩余订单', value: data.SurplusOrderNum, color: 'red' },
                        { label: '待执行', value: data.TobeexecutedNum, color: '#e9967a' },
                        { label: '执行中', value: data.ExecutingNum, color: '#800080' },
                        { label: '被叫停', value: data.CalledoffNum, color: '#808080' },
                        { label: '已完成', value: data.FinishNum, color: '#008000' },
                        { label: '已关闭', value: data.CloseNum, color: '#ff0000' },
                        { label: '已逾期', value: data.BeoverdueNum, color: 'red' },
                        { label: '完工率', value: data.Percentage, color: 'red' },
                    */

                    if( type === 0 ){
                        // 全部工单 待执行 执行中 被叫停 已完成 已关闭
                        arr = [
                            { label: '全部工单', value: data.AllOrderNum, color: '#0ea9f7' },
                            { label: '待执行', value: data.TobeexecutedNum, color: '#e9967a' },
                            { label: '执行中', value: data.ExecutingNum, color: '#800080' },
                            { label: '被叫停', value: data.CalledoffNum, color: '#808080' },
                            { label: '已完成', value: data.FinishNum, color: '#008000' },
                            { label: '已关闭', value: data.CloseNum, color: '#ff0000' },
                        ];
                    } else if( type === 1 ){
                        // 全部工单 剩余订单 待执行 执行中 被叫停 已逾期 已完成
                        arr = [
                            { label: '全部工单', value: data.AllOrderNum, color: '#0ea9f7' },
                            { label: '剩余订单', value: data.SurplusOrderNum, color: '#0ea9f7' },
                            { label: '待执行', value: data.TobeexecutedNum, color: '#e9967a' },
                            { label: '执行中', value: data.ExecutingNum, color: '#800080' },
                            { label: '被叫停', value: data.CalledoffNum, color: '#808080' },
                            { label: '已逾期', value: data.BeoverdueNum, color: '#ff0000' },
                            { label: '已完成', value: data.FinishNum, color: '#008000' },
                        ];
                    } else{
                        // 计算最大逾期时间和平均逾期时间
                        var max = 0, all = 0;
                        this.tableData.forEach(function(item){
                            max = item.OverTime > max ? item.OverTime : max;
                            all += item.OverTime;
                        });
                        var average = all / this.tableData.length;

                        arr = [
                            { label: '全部工单', value: data.AllOrderNum, color: '#0ea9f7' },
                            { label: '已完成', value: data.FinishNum, color: '#008000' },
                            { label: '已关闭', value: data.CloseNum, color: '#ff0000' },
                            { label: '完工率', value: data.Percentage, color: '#008000' },
                            { label: '最大逾期时间', value: timeStamp(max), color: '#e9967a' },
                            { label: '平均逾期时间', value: timeStamp(average), color: '#e9967a' },
                        ];

                        function timeStamp(StatusMinute){
                            var day = parseInt(StatusMinute / 60 / 24);
                            var hour = parseInt(StatusMinute / 60 % 24);
                            var min = parseInt(StatusMinute % 60);
                            StatusMinute = '';
                            if( day > 0 ){
                                StatusMinute = day + '天';
                            } else if( hour > 0 ){
                                StatusMinute += hour + '小时';
                            } else if( min > 0 ){
                                StatusMinute += parseFloat(min) + '分钟';
                            }
                            return StatusMinute == '' ? '0分钟' : StatusMinute;
                        }
                    }
                    return arr;
                },
                // 查询
                search: function($event){
                    var that = this;
                    var params = {
                        $URI: '/OMSOrder/All',
                      
                        $TYPE: 'Get',
                        PageCountProp: 'info',
                        DataListProp: 'list',
                        StatusList: that.searchData.StatusList.join(','),
                        StationID: -1,
                        OrderNo: that.searchData.OrderNo,
                        PageSize: 20,
                        Deeps: 4,
                    };

                    if( that.timeType==='计划日期' ){
                        params.PreStartTime=that.searchData.timeSection[0]
                        params.PreEndTime= that.searchData.timeSection[1]
                    }else{
                        params.RelStartTime=that.searchData.timeSection[0]
                        params.RelEndTime= that.searchData.timeSection[1]
                    }
                    $com.app.loading('数据加载中...');
                    $page.init($('.el-table .el-table__body-wrapper > table'), null, params, function(res){
                        $com.app.loaded();
                        that.tableData = res;
                    });

                    this.getStatusCount();
                },
                // 切换搜索条件中的时时间
                timeTypeChange:function(e){
                    this.timeType=e
                },
                // 清空
                emptyClick: function(){
                    this.searchData = $com.util.Clone(searchTemplate);
                    this.timeType='计划日期'
                },
                // 查看详情
                infoClick: function(row){
                    var vdata = {
                        'header': '工单详情',
                        'href': './order_manage/OMSOrderInfo_Vue.html?wID=' + row.ID,
                        'id': 'OMSOrderInfo_Vue',
                        'src': './static/images/logpng/监控.png',
                    };

                    window.parent.iframeHeaderSet(vdata);
                    window.callFunctionTrigger('OMSOrderInfo_Vue', { wID: row.ID });
                },
                // 删除订单
                removeClick: function(row){
                    var that = this;
                    if( !confirm('已选择1条数据，确定将其删除？') ){
                        return false;
                    }

                    this.Http('deleteOrder', { data: [ row ] }, function(res){
                        alert('删除成功！！');
                        that.search();
                    });
                },
                // 获取下拉框数据
 /*               getSelectOptions: function(){
                    var that = this;
                    // 人员列表 and 班组列表
                    that.Http('getUser', { Active: 1 }, function(res){
                        wUser = res.list;
                        var UserAll = res.list; // 全部人员
                        var WorkerIDList = []; // 班组人员

                        TypeSource.TeamID = [ { name: '无', value: 0 } ];
                        TypeSource.WorkerIDList = [ { name: '无', value: 0 } ];

                        that.Http('getTeamManage', { Active: 1 }, function(res){
                            mTeamManage = res.list;
                            res.list.forEach(function(team){
                                // 添加班组
                                TypeSource.TeamID.push({ name: team.Name, value: team.ID });
                                // 添加班组成员
                                team.MateID.forEach(function(user){
                                    WorkerIDList.push({ value: user, far: team.ID });
                                });
                            });

                            // 给班组成员Name属性
                            WorkerIDList.forEach(function(item){
                                item.name = UserAll.filter(function(user){
                                    return user.ID === item.value;
                                })[0].Name;
                            });
                            TypeSource.WorkerIDList = TypeSource.WorkerIDList.concat(WorkerIDList);

                        });
                    });
                    // 工位列表
                    that.Http('getFMCStation', { Active: 1 }, function(res){
                        mFMCStation = res.list;
                        res.list.forEach(function(item){
                            TypeSource.StationID.push({
                                name: item.Name,
                                value: item.ID,
                            });
                        });
                    });

                },*/
                // 获取订单概览数据
                getStatusCount: function(){
                    var that = this;
                    var params = {
                        StatusList: that.searchData.StatusList.join(','),
                        OrderNo: that.searchData.OrderNo,
                        PreStartTime: that.searchData.timeSection[0],
                        PreEndTime: that.searchData.timeSection[1],
                    };
                    this.Http('getStatusCount', params, function(res){
                        statusCount = res.list;

                        var orderCount = {
                            AllOrderNum: 0,//所有订单
                            SurplusOrderNum: 0,//剩余订单
                            TobeexecutedNum: 0,//待执行
                            ExecutingNum: 0,//执行中
                            CalledoffNum: 0,//被叫停
                            FinishNum: 0,//已完成
                            CloseNum: 0,//已关闭
                            BeoverdueNum: 0,//已逾期
                            Percentage: 0,// 完工率
                        };
                        var TobeexecutedNumAdd = 0;
                        var FinishNumAdd = 0;
                        var SurplusOrderNumAdd = 0;
                        for( x in statusCount ){
                            switch( Number(x) ){
                                case -1:
                                    orderCount.AllOrderNum = statusCount[x];
                                    break;
                                case 0:
                                    SurplusOrderNumAdd = statusCount[x] + SurplusOrderNumAdd;
                                    orderCount.SurplusOrderNum = SurplusOrderNumAdd;

                                    TobeexecutedNumAdd = statusCount[x] + TobeexecutedNumAdd;
                                    orderCount.TobeexecutedNum = TobeexecutedNumAdd;
                                    break;
                                case 1:
                                    SurplusOrderNumAdd = statusCount[x] + SurplusOrderNumAdd;
                                    orderCount.SurplusOrderNum = SurplusOrderNumAdd;

                                    TobeexecutedNumAdd = statusCount[x] + TobeexecutedNumAdd;
                                    orderCount.TobeexecutedNum = TobeexecutedNumAdd;
                                    break;
                                case 2:
                                    SurplusOrderNumAdd = statusCount[x] + SurplusOrderNumAdd;
                                    orderCount.SurplusOrderNum = SurplusOrderNumAdd;

                                    TobeexecutedNumAdd = statusCount[x] + TobeexecutedNumAdd;
                                    orderCount.TobeexecutedNum = TobeexecutedNumAdd;
                                    break;
                                case 3:
                                    SurplusOrderNumAdd = statusCount[x] + SurplusOrderNumAdd;
                                    orderCount.SurplusOrderNum = SurplusOrderNumAdd;

                                    TobeexecutedNumAdd = statusCount[x] + TobeexecutedNumAdd;
                                    orderCount.TobeexecutedNum = TobeexecutedNumAdd;
                                    break;
                                case 4:
                                    SurplusOrderNumAdd = statusCount[x] + SurplusOrderNumAdd;
                                    orderCount.SurplusOrderNum = SurplusOrderNumAdd;
                                    orderCount.ExecutingNum = statusCount[x];
                                    break;
                                case 6:
                                    SurplusOrderNumAdd = statusCount[x] + SurplusOrderNumAdd;
                                    orderCount.SurplusOrderNum = SurplusOrderNumAdd;
                                    orderCount.CalledoffNum = statusCount[x];
                                    break;
                                case 9:
                                    orderCount.CloseNum = statusCount[x];
                                    break;
                                case 5:
                                    FinishNumAdd = statusCount[x] + FinishNumAdd;
                                    orderCount.FinishNum = FinishNumAdd;
                                    break;
                                case 7:
                                    FinishNumAdd = statusCount[x] + FinishNumAdd;
                                    orderCount.FinishNum = FinishNumAdd;
                                    break;
                                case 8:
                                    FinishNumAdd = statusCount[x] + FinishNumAdd;
                                    orderCount.FinishNum = FinishNumAdd;
                                    break;
                                case 10:
                                    orderCount.BeoverdueNum = statusCount[x];
                                    break;
                                default:
                                    break;
                            }
                        }
                        orderCount.Percentage = ( orderCount.FinishNum / orderCount.AllOrderNum * 100 ).toFixed(2) + '%';

                        that.statusCount = orderCount;
                    });
                },
                // 下一步
                nextClick: function(){
                    var that = this;
                    var finishDate = that.importData.data.finishDate;

                    if( finishDate.length ){
                        that.Http('updateOrderList', { data: finishDate }, function(res){
                            that.search();
                            that.importData.status = 2;
                        });
                    } else{
                        alert('未查到可导入工单！');
                        return false;
                    }
                },
                // 导入完成
                accomplishClick: function(){
                    this.importData.status = 0;
                    this.ToolArrEmpty(
                        this.importData.data.finishDate,
                        this.importData.data.unFinishDate,
                    );

                },
            },
            events: function(){
            },
        });
        model.init();
    });
