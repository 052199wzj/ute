require(
    [
        '../static/utils/js/jquery-3.1.1',
        '../static/utils/js/base/base',
        '../static/utils/vue/mixins/tools',
        '../static/utils/vue/mixins/baseComponents',
    ],
    function($alfie, $com, $mixinsTools, $baseComponents){
        /* 弹框 */
/*        var
            // 查询关键字
            KEYWORD_department = {},
            // 字段格式化对象
            Formattrt_department = {},
            // 定义字段格式(用于表格字段转换)
            KEYWORD_department_LIST,
            // 枚举对象(用于字段转换)
            TypeSource_department
        ;
        ( function(){
            // 下拉框数据  name-value
            TypeSource_department = {
                DepartmentID: [],
                LeaderID: [],
                MateID: [],
                ModuleID: [
                    { name: '默认', value: 0 },
                    { name: '生产', value: 1 },
                    { name: '质量', value: 2 },
                    { name: '工艺', value: 3 },
                    { name: '设备', value: 4 },
                    { name: '仓库', value: 5 },
                    { name: '计量', value: 6 },
                ],
            };
            KEYWORD_department_LIST = [
                'ID|班组编号',
                'Name|班组名称*',
                'ModuleID|职能',
                'DepartmentID|所属部门*|ArrayOneControl',
                'LeaderID|班组长|ArrayControl|DepartmentID',
                'MateID|班组成员|ArrayControl|DepartmentID',
                'CreateTime|申请时间|DateTime',
                'Remark|班组描述',
            ];
            $com.util.configBuild(KEYWORD_department_LIST, KEYWORD_department, TypeSource_department, Formattrt_department);
        } )();*/

        var formSelectOptions = {
            DepartmentID: [],
            LeaderID: [],
            MateID: [],
            ModuleID: [
                { name: '默认', value: 0 },
                { name: '生产', value: 1 },
                { name: '质量', value: 2 },
                { name: '工艺', value: 3 },
                { name: '设备', value: 4 },
                { name: '仓库', value: 5 },
                { name: '计量', value: 6 },
            ],
        };

        var validate = {
            name: function(rule, value, callback){
                for( let item of model.data.factoryList ){
                    if( item.Name === value ) return callback('班组名称重复!');
                }
                callback();
            },
        };
        var formOptions = [
            { label: '班组编号', value: 'ID' },
            {
                label: '班组名称', value: 'Name',
                rules: [ 'required' ],
            },
            { label: '职能', value: 'ModuleID' },
            {
                label: '所属部门', value: 'DepartmentID', rules: [ 'required' ],
                type: 'select', child: [ 'LeaderID', 'MateID' ],
                options: formSelectOptions.DepartmentID,
            },
            {
                label: '班组长', value: 'LeaderID',
                type: 'select', clearable: true, far: 'DepartmentID',
                options: formSelectOptions.LeaderID,
            },
            {
                label: '班组成员', value: 'MateID',
                type: 'select', multiple: true, clearable: true, far: 'DepartmentID',
                options: formSelectOptions.MateID,
            },
            { label: '班组描述', value: 'Remark', type: 'textarea' },
        ];

        /**
         *  请求列表
         *  url: string    请求地址 - 必填
         *  type: string   请求类型 - 必填
         *  errMsg:string   错误提示 - 可填 默认值为 httpErrMsg[$TYPE]
         */
        var uriList = {
            getData: { type: 'get', url: '/TeamManage/All' },
            upDate: { type: 'post', url: '/TeamManage/Update' },
            changeActive: { type: 'post', url: '/TeamManage/Active' },
            delete: { type: 'post', url: '/TeamManage/Delete' },

            getDepartment: { type: 'get', url: '/Department/AllDepartment' },
            getUser: { type: 'get', url: '/User/All' },
        };
        /**
         * 请求默认提示语
         * key: 请求类型
         * val: 提示文本
         */
        var httpErrMsg = {
            get: '获取失败，请检查网络',
            Get: '获取失败，请检查网络',
            post: '提交失败，请检查网络',
            Post: '提交失败，请检查网络',
        };

        /***
         * 公用请求方法
         * @param uriName   请求名称
         * @param data      数据
         * @param fn        回调函数
         * @param context   上下文
         */
        function http(uriName, data, fn, context){
            var u = uriList[uriName];
            var d = { $URI: u.url, $TYPE: u.type };

            function err(){
                $com.app.tip(u.errMsg || httpErrMsg[u.type]);
            }

            $com.app.ajax($.extend(d, data), fn, err, context);
        }

        // 表头
        var tableData = [
            { label: '序号', type: 'sequence' },
            { label: '班组编码', key: 'Code' },
            { label: '班组名称', key: 'Name' },
            { label: '所属部门', key: 'DepartmentName' },
            { label: '班组长', key: 'LeaderName' },
            { label: '成员', key: 'MateName' },
            { label: '申请人', key: 'Creator' },
            { label: '班组描述', key: 'Remark' },
            { label: '申请时间', key: 'CreateTime', type: 'time' },
            { label: '状态', key: 'Active', type: 'switch', show: 'jurisdiction' },
            { label: '操作', type: 'operation', show: 'jurisdiction' },
        ];
        // 搜索条件模板
        var searchTemplate = { Name: '', Active: '-1', DepartmentID: '' };
        // 最小有效日期
        var minTime = new Date('2020-01-01 00:00:00');

        var model = $com.Model.create({
            el: '#teamManagement-body',
            name: '班组管理',
            VueName: 'vm',
            mixins: [ $mixinsTools, $baseComponents ],
            data: {
                // 表头
                tableData: tableData,
                // 搜索框
                searchData: $com.util.Clone(searchTemplate),
                // 下拉框数据
                selectOptions: {
                    department: [],
                },
                // 数据列表
                factoryList: [],
                //用户权限
                jurisdiction: false,
            },
            computed: {},
            filters: {
                // 激活状态
                switchStatus: function(e){
                    // 0-从未激活 1-激活 2-关闭
                    return e === 1;
                },
                // 时间格式
                timeStr: function(e){
                    if( !e ){
                        return '-';
                    }
                    var now = new Date(e);
                    return now > minTime ? e : '-';
                },
            },
            watch: {},
            created: function(){
                this.search();
                this.getSelectOptions();
                this.jurisdiction = $com.app.checkRole(105000);
            },
            mounted: function(){
            },
            methods: {
                search: function($event){
                    var that = this;

                    var params = $event ? that.searchData : searchTemplate;

                    $com.app.loading('数据加载中...');
                    http('getData', params, function(res){
                        $com.app.loaded();
                        that.factoryList = res.list;
                    });
                },
                emptyClick: function(){
                    this.searchData = $com.util.Clone(searchTemplate);
                },
                addClick: function(){
                    var that = this;
                    var myPopupForm = that.$refs['myPopupForm'];
                    var newOptions = {
                        Name: { rules: [ 'required', { validator: validate.name, trigger: 'blur' } ] },
                        DepartmentID: '',
                        LeaderID: [],
                        MateID: '',
                        Remark: '',
                    };
                    myPopupForm.open({
                        title: '新增班组',
                        option: myPopupForm.newOptions(newOptions, formOptions),
                        confirm: function(rst){
                            if( !rst || $.isEmptyObject(rst) ){
                                return false;
                            }
                            rst.LeaderID = rst.LeaderID ? [ rst.LeaderID ] : [];
                            rst.MateID = rst.MateID || [];
                            var _data = {
                                ID: 0,
                                Name: rst.Name,
                                ModuleID: 1,
                                DepartmentID: Number(rst.DepartmentID),
                                LeaderID: rst.LeaderID,
                                MateID: [],
                                Active: 0,
                                Remark: rst.Remark,
                            };
                            rst.MateID.concat(rst.LeaderID).forEach(function(item){
                                _data.MateID.indexOf(item) === -1 && _data.MateID.push(item);
                            });
                            for( var i = 0; i < that.tableData.length; i++ ){
                                if( rst.Name === that.tableData[i].Name ){
                                    alert('新增班组已存在！');
                                    return false;
                                }
                            }
                            $com.util.deleteLowerProperty(_data);
                            http('upDate', { data: _data }, function(res){
                                alert('新增成功！！');
                                that.search();
                            });
                        },
                    });
                    /*
                    var that = this;
                    var defaultValue = {
                        Name: '',
                        DepartmentID: TypeSource_department.DepartmentID[0].value,
                        LeaderID: 0,
                        MateID: 0,
                        Remark: '',
                    };
                    $('body').append($com.modal.show(defaultValue, KEYWORD_department, '新增班组', function(rst){
                        //调用插入函数然后用load刷新数据源

                        if( !rst || $.isEmptyObject(rst) ){
                            return false;
                        }
                        var _data = {
                            ID: 0,
                            Name: rst.Name,
                            ModuleID: 1,
                            DepartmentID: Number(rst.DepartmentID),
                            LeaderID: rst.LeaderID,
                            MateID: [],
                            Active: 0,
                            Remark: rst.Remark,
                        };

                        rst.MateID.concat(rst.LeaderID).forEach(function(item){
                            _data.MateID.indexOf(item) === -1 && _data.MateID.push(item);
                        });

                        for( var i = 0; i < that.tableData.length; i++ ){
                            if( rst.Name === that.tableData[i].Name ){
                                alert('新增班组已存在！');
                                return false;
                            }
                        }
                        $com.util.deleteLowerProperty(_data);

                        http('upDate', { data: _data }, function(res){
                            alert('新增成功！！');
                            that.search();
                        });

                    }, TypeSource_department));
                    */
                },
                editClick: function(row){
                    var that = this;
                    var newRow = $com.util.Clone(row);
                    var myPopupForm = that.$refs['myPopupForm'];
                    var DepartmentID =  this.ToolNewSelectOptions(
                        [row.DepartmentID],
                        [row.DepartmentName],
                        formSelectOptions.DepartmentID,
                    );

                    var LeaderID =  this.ToolNewSelectOptions(
                        row.LeaderID,
                        row.LeaderName,
                        formSelectOptions.LeaderID,
                        'DepartmentID',
                        row.DepartmentID,
                    );

                    var MateID =  this.ToolNewSelectOptions(
                        row.MateID,
                        row.MateName,
                        formSelectOptions.LeaderID,
                        'DepartmentID',
                        row.DepartmentID,
                    );

                    var newOptions = {
                        Name: newRow.Name,
                        DepartmentID:{
                            default:newRow.DepartmentID,
                            options: DepartmentID,
                        },
                        LeaderID:{
                            default:newRow.LeaderID[0],
                            options: LeaderID,
                        },
                        MateID: {
                            default:newRow.MateID,
                            options: MateID,
                        },
                        Remark: newRow.Remark,
                    };
                    myPopupForm.open({
                        title: '修改班组',
                        option: myPopupForm.newOptions(newOptions, formOptions),
                        confirm: function(rst){
                            if( !rst || $.isEmptyObject(rst) ){
                                return;
                            }
                            rst.LeaderID = rst.LeaderID ? [ rst.LeaderID ] : [];
                            rst.MateID = rst.MateID || [];

                            newRow.Name = rst.Name;
                            newRow.DepartmentID = Number(rst.DepartmentID);
                            newRow.Remark = rst.Remark;
                            newRow.LeaderID = rst.LeaderID;
                            newRow.MateID = [];

                            rst.MateID.concat(rst.LeaderID).forEach(function(item){
                                newRow.MateID.indexOf(item) === -1 && newRow.MateID.push(item);
                            });

                            $com.util.deleteLowerProperty(newRow);
                            http('upDate', { data: newRow }, function(res){
                                alert('修改成功！！');
                                that.search();
                            });
                        },
                    });

                    /*
                    var newRow = $com.util.Clone(row);
                    newRow = $com.util.Clone(newRow);
                    var that = this;
                    var default_value = {
                        Name: newRow.Name,
                        DepartmentID: newRow.DepartmentID,
                        LeaderID: newRow.LeaderID,
                        MateID: newRow.MateID,
                        Remark: newRow.Remark,
                    };
                    $('body').append($com.modal.show(default_value, KEYWORD_department, '修改班组', function(rst){
                        //调用修改函数
                        if( !rst || $.isEmptyObject(rst) ){
                            return;
                        }

                        newRow.Name = rst.Name;
                        newRow.DepartmentID = Number(rst.DepartmentID);
                        newRow.Remark = rst.Remark;
                        newRow.LeaderID = rst.LeaderID;
                        newRow.MateID = [],


                            rst.MateID.concat(rst.LeaderID).forEach(function(item){
                                newRow.MateID.indexOf(item) === -1 && newRow.MateID.push(item);
                            });

                        $com.util.deleteLowerProperty(newRow);
                        http('upDate', { data: newRow }, function(res){
                            alert('修改成功！！');
                            that.search();
                        });
                    }, TypeSource_department));
                    */
                },
                removeClick: function(row){
                    var that = this;
                    if( row.Active !== 0 ){
                        return false;
                    }
                    if( !confirm('已选择1条数据，确定将其删除？') ){
                        return false;
                    }

                    http('delete', { data: row }, function(res){
                        alert('删除成功！！');
                        that.search();
                    });
                },
                activeChange: function(row){
                    var that = this;
                    var newActive = row.Active === 1 ? 2 : 1;
                    var data = {
                        Active: newActive,
                        data: [ row ],
                    };
                    http('changeActive', data, function(){
                        row.Active = newActive;
                        that.search();
                        alert('操作成功！');
                    });
                },
                // 获取select选项
                // type 类型 params 查询参数
                getSelectOptions: function(){
                    var that = this;
                    /*
                     uriName        {String}   请求名称
                     variatePopup   {String}   弹框变量名 TypeSource_department.*
                     department     {String}   搜索框变量名 - this.data.selectOptions.*
                     default        {Array}    默认值
                     far            {String}   受控制的key值
                     */
                    // 0-部门表 1-人员表
                    var getList = [
                        {
                            uriName: 'getDepartment',
                            variatePopup: 'DepartmentID',
                            selectOptions: 'department',
                        },
                        {
                            uriName: 'getUser',
                            variatePopup: 'LeaderID',
                            far: 'DepartmentID',
                        },
                        {
                            uriName: 'getUser',
                            variatePopup: 'MateID',
                            far: 'DepartmentID',
                        },
                    ];

                    getList.forEach(function(item){
                        http(item.uriName, { Active: 1 }, function(res){
                            if( item.selectOptions ){
                                that.selectOptions[item.selectOptions] = res.list;
                            }
                            if( item.variatePopup ){

                                that.ToolArrReplace(formSelectOptions[item.variatePopup], res.list);
                          /*      TypeSource_department[item.variatePopup] = item.default || [];
                                res.list.forEach(function(data){
                                    TypeSource_department[item.variatePopup].push({
                                        name: data.Name,
                                        value: data.ID,
                                        far: item.far ? data[item.far] : null,
                                    });
                                });*/
                            }
                        });
                    });


                },
            },
            events: function(){
            },
        });
        model.init();
    });
