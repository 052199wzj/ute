require(
    [
        '../static/utils/js/jquery-3.1.1',
        '../static/utils/js/base/base',
        '../static/utils/vue/components/vue2-org-tree/index',
        '../static/utils/vue/mixins/tools',
        '../static/utils/vue/mixins/baseComponents',
    ],
    function($alfie, $com, $vue2OrgTree, $mixinsTools, $baseComponents){

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
            getUser: { type: 'get', url: '/User/All' },
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

        http('getDepartment', {}, function(res){

        }, this);

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
                    TypeSource_department = {
                        ManagerIDList: [],
                        ParentID: [],
                        Type: [
                            { name: '部门', value: 1 },
                            { name: '工区', value: 2 },
                            { name: '班组', value: 3 },
                            { name: '供应商', value: 11 },
                        ],
                    };
                    KEYWORD_department_LIST = [
                        'Name|组织名称*',
                        'ManagerIDList|管理员|Array',
                        'ParentID|上级组织|ArrayOne',
                        'Type|类别*|ArrayOne',
                        'Remark|组织描述',
                    ];
                    $com.util.configBuild(KEYWORD_department_LIST, KEYWORD_department, TypeSource_department, Formattrt_department);
                } )();*/

        var formSelectOptions = {
            ManagerIDList: [],
            ParentID: [],
            Type: [
                { Name: '部门', ID: 1 },
                { Name: '工区', ID: 2 },
                { Name: '班组', ID: 3 },
                { Name: '供应商', ID: 11 },
            ],
        };

        var formOptions = [
            { label: '组织名称', value: 'Name', rules: [ 'required' ] },
            {
                label: '管理员', value: 'ManagerIDList',
                type: 'select', multiple: true, clearable: true, options: formSelectOptions.ManagerIDList,
            },
            {
                label: '上级组织', value: 'ParentID',
                type: 'select', options: formSelectOptions.ParentID,
            },
            {
                label: '类别', value: 'Type', rules: [ 'required' ],
                type: 'select', options: formSelectOptions.Type,
            },
            { label: '组织描述', value: 'Remark', type: 'textarea' },
        ];

        // 表头
        var tableHead = [
            { label: '序号', type: 'sequence', width: 60 },
            { label: '部门编码', key: 'Code', width: 90 },
            { label: '部门名称', key: 'Name' },
            { label: '上级部门', key: 'ParentName' },
            { label: '部门成员数量', key: 'EmployeeCount', minWidth: 120 },
            { label: '部门描述', key: 'Remark' },
            { label: '申请时间', key: 'CreateTime', type: 'time', width: 150 },
            { label: '编辑时间', key: 'EditTime', type: 'time', width: 150 },
            { label: '状态', key: 'Active', type: 'switch', show: 'jurisdiction', width: 60 },
            { label: '操作', type: 'operation', show: 'jurisdiction', width: 120 },
        ];
        // 搜索条件模板
        var searchTemplate = { Name: '', Active: '-1' };
        // 最小有效日期
        var minTime = new Date('2020-01-01 00:00:00');

        var model = $com.Model.create({
            el: '#department-body',
            name: '组织架构',
            VueName: 'vm',
            mixins: [ $mixinsTools, $baseComponents ],
            components: {
                'vue2-org-tree': $vue2OrgTree,
            },
            data: {
                // 用户列表
                userAll: [],
                // 表头
                tableHead: tableHead,
                // 搜索框
                searchData: $com.util.Clone(searchTemplate),
                // 数据列表
                departmentList: [],
                // 组织架构图
                tree: {
                    show: false,
                    data: { label: '加载中', children: [] },
                },
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
                this.getSelectOptions_One();
                this.jurisdiction = $com.app.checkRole(103000);
            },
            mounted: function(){
            },
            methods: {
                // 查询数据
                search: function($event){
                    var that = this;

                    var params = $event ? that.searchData : searchTemplate;

                    $com.app.loading('数据加载中...');
                    http('getDepartment', params, function(res){
                        $com.app.loaded();
                        that.departmentList = res.list;
                        that.getSelectOptions();
                    });
                },
                // 清空查询条件
                emptyClick: function(){
                    this.searchData.Name = '';
                    this.searchData.Active = '-1';
                },
                // 获取人员列表
                getUserList(departmentID){
                    var userList = this.userAll.filter(function(item){
                        return item.DepartmentID === departmentID;
                    });

                    this.ToolArrReplace(formSelectOptions.ManagerIDList, userList);

                    /* TypeSource_department.ManagerIDList = [];
                     userList.forEach(function(item){
                         TypeSource_department.ManagerIDList.push({
                             name: item.Name,
                             value: item.ID,
                             far: null,
                         });
                     });*/
                },
                // 添加
                addClick: function(){
                    var that = this;
                    var myPopupForm = that.$refs['myPopupForm'];
                    var newOptions = {
                        Name: { span: 24 },
                        ParentID: '',
                        Type: '',
                        Remark: '',
                    };
                    myPopupForm.open({
                        title: '新增组织',
                        option: myPopupForm.newOptions(newOptions, formOptions),
                        confirm: function(rst){
                            if( !rst || $.isEmptyObject(rst) ){
                                return false;
                            }
                            var _data = {
                                Active: 0,
                                Name: rst.Name,
                                ParentID: Number(rst.ParentID),
                                Type: Number(rst.Type),
                                Remark: rst.Remark,
                            };
                            for( var i = 0; i < that.departmentList.length; i++ ){
                                if( rst.Name === that.departmentList[i].Name ){
                                    alert('新增组织已存在！');
                                    return false;
                                }
                            }
                            $com.util.deleteLowerProperty(_data);

                            http('updateDepartment', { data: _data }, function(res){
                                alert('新增成功！！');
                                that.search();
                            });
                        },
                    });
                    /*         var that = this;
                             var defaultValue = {
                                 Name: '',
                                 ParentID: 0,
                                 Type: 0,
                                 Remark: '',
                             };
                             $('body').append($com.modal.show(defaultValue, KEYWORD_department, '新增组织', function(rst){
                                 //调用插入函数然后用load刷新数据源

                                 if( !rst || $.isEmptyObject(rst) ){
                                     return false;
                                 }
                                 var _data = {
                                     Active: 0,
                                     Name: rst.Name,
                                     ParentID: Number(rst.ParentID),
                                     Type: Number(rst.Type),
                                     Remark: rst.Remark,
                                 };
                                 for( var i = 0; i < that.departmentList.length; i++ ){
                                     if( rst.Name === that.departmentList[i].Name ){
                                         alert('新增组织已存在！');
                                         return false;
                                     }
                                 }
                                 $com.util.deleteLowerProperty(_data);

                                 http('updateDepartment', { data: _data }, function(res){
                                     alert('新增成功！！');
                                     that.search();
                                 });

                             }, TypeSource_department));*/
                },
                // 编辑
                editClick: function(row){
                    var newRow = $com.util.Clone(row);

                    var that = this;
                    that.getUserList(newRow.ID);
                    var myPopupForm = that.$refs['myPopupForm'];

                    var ManagerIDList = that.ToolNewSelectOptions(
                        row.ManagerIDList,
                        row.ManagerName,
                        formSelectOptions.ManagerIDList,
                    );

                    var newOptions = {
                        Name: newRow.Name,
                        Type: newRow.Type,
                        ParentID: {
                            default: newRow.ParentID,
                            options: formSelectOptions.ParentID.filter(function(item){
                                return item.ID !== newRow.ID;
                            }),
                        },
                        Remark: newRow.Remark,
                        ManagerIDList: {
                            default: newRow.ManagerIDList,
                            options: ManagerIDList,
                        },
                    };
                    myPopupForm.open({
                        title: '修改组织信息',
                        option: myPopupForm.newOptions(newOptions, formOptions),
                        confirm: function(rst){
                            if( !rst || $.isEmptyObject(rst) ){
                                return;
                            }
                            newRow.Name = rst.Name;
                            newRow.Type = Number(rst.Type);
                            newRow.ParentID = Number(rst.ParentID);
                            newRow.Remark = rst.Remark;
                            newRow.ManagerIDList = rst.ManagerIDList;
                            $com.util.deleteLowerProperty(newRow);
                            http('updateDepartment', { data: newRow }, function(res){
                                alert('修改成功！！');
                                that.search();
                            });
                        },
                    });

                    /*      var newRow = $com.util.Clone(row);
                          var that = this;
                          this.getUserList(newRow.ID);
                          var default_value = {
                              Name: newRow.Name,
                              Type: newRow.Type,
                              ParentID: newRow.ParentID,
                              Remark: newRow.Remark,
                              ManagerIDList: newRow.ManagerIDList,
                          };

                          var new_TypeSource = $com.util.Clone(TypeSource_department);
                          new_TypeSource.ParentID =
                              TypeSource_department.ParentID.filter(function(item){
                                  return item.value !== newRow.ID;
                              });

                          $('body').append($com.modal.show(default_value, KEYWORD_department, '修改组织', function(rst){
                              //调用修改函数
                              if( !rst || $.isEmptyObject(rst) ){
                                  return;
                              }
                              newRow.Name = rst.Name;
                              newRow.Type = Number(rst.Type);
                              newRow.ParentID = Number(rst.ParentID);
                              newRow.Remark = rst.Remark;
                              newRow.ManagerIDList = rst.ManagerIDList;
                              $com.util.deleteLowerProperty(newRow);
                              http('updateDepartment', { data: newRow }, function(res){
                                  alert('修改成功！！');
                                  that.search();
                              });
                          }, new_TypeSource));*/

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
                        that.search();
                        alert('操作成功！');
                    });

                },
                // 删除组织
                removeClick: function(row, index){
                    var that = this;
                    if( row.Active !== 0 ){
                        return false;
                    }
                    if( !confirm('已选择1条数据，确定将其删除？') ){
                        return false;
                    }

                    http('deleteDepartment', { data: [ row ] }, function(res){
                        alert('删除成功！！');
                        that.search();
                    });
                },
                // 获取下拉框数据
                getSelectOptions_One: function(){
                    var that = this;
                    http('getUser', { Active: 1 }, function(res){
                        that.userAll = res.list;
                    });
                },
                getSelectOptions: function(){
                    var that = this;
                    http('getDepartment', { Active: 1 }, function(res){

                        that.ToolArrReplace(formSelectOptions.ParentID, res.list);
                        formSelectOptions.ParentID.unshift({ Name: '请选择', ID: 0 });

                        /* TypeSource_department.ParentID = [];
                         TypeSource_department.ParentID.push({
                             name: '请选择',
                             value: 0,
                             far: null,
                         });
                         res.list.forEach(function(item){
                             TypeSource_department.ParentID.push({
                                 name: item.Name,
                                 value: item.ID,
                                 far: null,
                             });
                         });*/
                    });
                },
                /* tree start */
                getOrganizationChart(){
                    var data = $com.util.Clone(this.departmentList),
                        arr = findData(0)
                    ;
                    // 展开
                    data.forEach(function(item){
                        item.expand = true;
                    });

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
                    if( data.Active !== 1 ){
                        str += ' forbidden';
                    }
                    return str;
                },
                // 渲染
                renderContent(h, data){
                    var str = data.Name;
                    if( data.Active !== 1 ){
                        str += '(已关闭)';
                        return str;
                    }
                    if( data.ManagerName ){
                        str += `(${ data.ManagerName })`;
                    }

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
