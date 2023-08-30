require(
    [
        '../static/utils/js/jquery-3.1.1',
        '../static/utils/js/base/base',
        '../static/utils/vue-components/vue2-org-tree/index',
    ],
    function($alfie, $com, $vue2OrgTree){

        /**
         *  请求列表
         *  $URI: string    请求地址 - 必填
         *  type: string   请求类型 - 必填
         *  errMsg:string   错误提示 - 可填 默认值为 httpErrMsg[$TYPE]
         */
        var uriList = {
            getDepartment: { type: 'Get', url: '/Department/AllDepartment' }, // 部门列表
            updateDepartment: { type: 'Post', url: '/Department/UpdateDepartment' }, // 新增/修改部门
            deleteDepartment: { type: 'Post', url: '/Department/DeleteDepartment' }, // 删除部门
            activeDepartment: { type: 'Post', url: '/Department/ActiveDepartment' }, // 切换状态
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

        /* 弹框 */
        var
            // 查询关键字
            keywordDepartment = {},
            // 字段格式化对象
            formattrtDepartment = {},
            // 定义字段格式(用于表格字段转换)
            keywordDepartmentList,
            // 枚举对象(用于字段转换)
            typeSourceDepartment
        ;
        ( function(){
            typeSourceDepartment = {
                ManagerIDList: [],
                ParentID: [],
                Type: [
                    { name: '部门', value: 1 },
                    { name: '工区', value: 2 },
                    { name: '班组', value: 3 },
                    { name: '供应商', value: 11 },
                ],
            };
            keywordDepartmentList = [
                'Name|部门名称*',
                'ManagerIDList|管理员|Array',
                'ParentID|上级部门|ArrayOne',
                'Type|类别*|ArrayOne',
                'Remark|部门描述',
            ];
            $.each(keywordDepartmentList, function(i, item){
                var detail = item.split('|');
                keywordDepartment[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                };
                if( detail.length > 2 ){
                    formattrtDepartment[detail[0]] = $com.util.getFormatter(typeSourceDepartment, detail[0], detail[2]);
                }
            });
        } )();


        var model = $com.Model.create({
            el: '#department-management-body',
            name: '组织架构',
            VueName: 'vm',
            components: {
                'vue2-org-tree': $vue2OrgTree,
            },
            data: {
                // 用户列表
                userAll: window.parent._UserAll.filter(function(item){
                    return item.Active === 1;
                }),
                // 表头
                tableData: [
                    { label: '序号', type: 'sequence' },
                    { label: '部门编码', key: 'Code' },
                    { label: '部门名称', key: 'Name' },
                    { label: '上级部门', key: 'ParentName' },
                    { label: '部门成员数量', key: 'EmployeeCount' },
                    { label: '部门描述', key: 'Remark' },
                    { label: '申请时间', key: 'CreateTime' },
                    { label: '编辑时间', key: 'EditTime' },
                    { label: '状态', key: 'Active', type: 'switch' },
                    { label: '操作', type: 'operation' },
                ],
                // 搜索框
                searchData: {
                    Name: '',
                    Active: '-1',
                },
                // 数据列表
                departmentList: [],
                // 组织架构图
                tree: {
                    show: false,
                    data: { label: '加载中', children: [] },
                },

            },
            computed: {},
            filters: {
                // 激活状态
                switchStatus: function(e){
                    // 0-从未激活 1-激活 2-关闭
                    return e === 1;
                },
            },
            watch: {},
            created: function(){
                this.search();
            },
            mounted: function(){
            },
            methods: {
                // 查询数据
                search: function(){
                    var that = this;
                    $com.app.loading('数据加载中...');
                    http('getDepartment', that.searchData, function(res){
                        $com.app.loaded();
                        that.departmentList = res.list;
                    });
                    this.getDepartment();
                },
                // 获取部门列表
                getDepartment: function(){
                    http('getDepartment', { Active: 1 }, function(res){
                        typeSourceDepartment.ParentID = [];
                        typeSourceDepartment.ParentID.push({
                            name: '请选择',
                            value: 0,
                            far: null,
                        });
                        res.list.forEach(function(item){
                            typeSourceDepartment.ParentID.push({
                                name: item.Name,
                                value: item.ID,
                                far: null,
                            });
                        });
                    });
                },
                // 获取人员列表
                getUserList(departmentID){
                    var userList = this.userAll.filter(function(item){
                        return item.DepartmentID === departmentID;
                    });
                    typeSourceDepartment.ManagerIDList = [];
                    userList.forEach(function(item){
                        typeSourceDepartment.ManagerIDList.push({
                            name: item.Name,
                            value: item.ID,
                            far: null,
                        });
                    });
                    console.log(typeSourceDepartment.ManagerIDList);
                },
                // 清空查询条件
                emptyClick: function(){
                    this.searchData.Name = '';
                    this.searchData.Active = '-1';
                },
                // 添加
                addClick: function(){
                    var that = this;
                    var defaultValue = {
                        Name: '',
                        ParentID: 0,
                        Type: 0,
                        Remark: '',
                    };
                    $('body').append($com.modal.show(defaultValue, keywordDepartment, '新增部门', function(rst){
                        //调用插入函数然后用load刷新数据源

                        if( !rst || $.isEmptyObject(rst) )
                            return false;
                        var _data = {
                            Active: 0,
                            Name: rst.Name,
                            ParentID: Number(rst.ParentID),
                            Type: Number(rst.Type),
                            Remark: rst.Remark,
                        };
                        for( var i = 0; i < that.departmentList.length; i++ ){
                            if( rst.Name === that.departmentList[i].Name ){
                                alert('新增部门已存在！');
                                return false;
                            }
                        }
                        $com.util.deleteLowerProperty(_data);

                        http('updateDepartment', { data: _data }, function(res){
                            alert('新增成功！！');
                            that.search();
                        });

                    }, typeSourceDepartment));
                },
                // 编辑
                editClick: function(row){
                    var that = this;
                    this.getUserList(row.ID);
                    var default_value = {
                        Name: row.Name,
                        Type: row.Type,
                        ParentID: row.ParentID,
                        Remark: row.Remark,
                        ManagerIDList: row.ManagerIDList,
                    };
                    $('body').append($com.modal.show(default_value, keywordDepartment, '修改部门', function(rst){
                        //调用修改函数
                        if( !rst || $.isEmptyObject(rst) ) return;
                        row.Name = rst.Name;
                        row.Type = Number(rst.Type);
                        row.ParentID = Number(rst.ParentID);
                        row.Remark = rst.Remark;
                        row.ManagerIDList = rst.ManagerIDList;
                        $com.util.deleteLowerProperty(row);
                        http('updateDepartment', { data: row }, function(res){
                            alert('修改成功！！');
                            that.search();
                        });
                    }, typeSourceDepartment));

                },
                // 切换激活状态
                activeChange: function(row){
                    var that = this;
                    var newActive = row.Active === 1 ? 2 : 1;
                    var data = {
                        Active: newActive,
                        data: [ row ],
                    };
                    http('activeDepartment', data, function(){
                        row.Active = newActive;
                        that.getDepartment();
                        alert('操作成功！');
                    });

                },
                // 删除组织
                removeClick: function(row, index){
                    var that = this;
                    if( row.Active !== 0 ) return false;
                    if( !confirm('已选择1条数据，确定将其删除？') ) return false;

                    http('deleteDepartment', { data: [ row ] }, function(res){
                        alert('删除成功！！');
                        that.departmentList.splice(index, 1);
                        this.getDepartment();
                    });
                },
                /* tree start */
                getOrganizationChart(){
                    var data = $com.util.Clone(this.departmentList),
                        arr = findData(0)
                    ;
                    // 展开
                    data.forEach(function(item){
                        item.expand=true
                    })

                    setData(arr);
                    this.tree.data = arr[0];

                    this.tree.show = true;

                    function setData(wData){
                        wData.forEach(function(item){
                            var d = findData(item.ID);
                            if( d.length ){
                                // 父级关闭时自动关闭子集
                                if( item.Active !== 1 ){
                                    d.forEach(function(item){
                                        item.Active = 2;
                                    });
                                }
                                item.children = d;
                                setData(item.children);
                            }
                        });
                    }

                    function findData(ParentID){
                        return data.filter(function(item){
                            return item.ParentID === ParentID;
                        });
                    }
                },
                // class
                labelClass(data){
                    var str = 'tree-node-style ';
                    str += ( 'type-' + data.Type );
                    if( data.Active !== 1 ) str += ' forbidden';
                    return str;
                },
                // 渲染
                renderContent(h, data){
                    var str = data.Name;
                    if( data.Active !== 1 ){
                        str += '(已关闭)';
                        return str;
                    }
                    if( data.ManagerName ) str += `(${ data.ManagerName })`;

                    return str;
                },
                // 展开
                onExpand(e, data){
                    if( 'expand' in data ){
                        data.expand = !data.expand;
                        if( !data.expand && data.children ){
                            this.collapse(data.children);
                        }
                    } else{
                        this.$set(data, 'expand', true);
                    }
                },
                // 收起
                collapse(nodes){
                    nodes.forEach(node => {
                        if( node.expand ){
                            node.expand = false;
                        }

                        node.children && this.collapse(node.children);
                    });
                },
                /*
                onNodeClick(e, data){
                    console.log('CLICK', e);
                    this.$set(data, 'selectedKey', !data['selectedKey']);
                },
                onNodeMouseOver(e, data){
                    console.log('MOUSE OVER', e, data);
                },
                onNodeMouseOut(e, data){
                    console.log('MOUSE OUT', e);
                },
                onNodeDrop(e, drag, drop){
                    console.log('DROP', e);
                    console.log('drag:', drag);
                    console.log('drop:', drop);
                },
                */
                /* tree end */
            },
            events: function(){
            },
        });
        model.init();
    });