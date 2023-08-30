require(
    [
        '../static/utils/js/jquery-3.1.1',
        '../static/utils/js/base/base',
        '../static/utils/js/base/jquery.treeview',
        '../static/utils/vue/mixins/tools',
        '../static/utils/vue/mixins/baseComponents',
    ],
    function($alfie, $com, $tree, $mixinsTools, $baseComponents){

        /* 弹框 */
        /*var
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
                ParentID: [ {
                    name: '无',
                    value: 0,
                } ],
                RoleID: [ {
                    name: '请选择',
                    value: -1,
                } ],
            };
            KEYWORD_department_LIST = [
                //
                'Text|权限名称*',
                'RoleID|父级权限ID|ArrayOne',
                'FunctionID|权限ID*',
                'FunctionID_R|权限ID*|Readonly',
                'Path|路径',
                'UserID|顺序',
            ];

            $com.util.configBuild(KEYWORD_department_LIST, KEYWORD_department, TypeSource_department, Formattrt_department);

        } )();*/


        var formOptions = [
            { label: '权限名称', value: 'Text', rules: [ 'required' ] },
            { label: '权限ID', value: 'FunctionID', rules: [ 'required' ] },
            { label: '路径', value: 'Path' },
            { label: '顺序', value: 'UserID', type: 'number' },
        ];

        var HTML = {
            TreeItemNode: [
                '<li class="range-role-li {{Type}}" >',
                '<span style="vertical-align:top;margin-left: 10px" class="jurisdiction-name" data-value="{{FunctionID}} ">{{Text}}</span> ',
                '<ul>{{Items}}</ul>',
                '</li> ',

            ].join(''),
        };

        /**
         *  请求列表
         *  $URI: string    请求地址 - 必填
         *  type: string   请求类型 - 必填
         *  errMsg:string   错误提示 - 可填 默认值为 httpErrMsg[$TYPE]
         */
        var uriList = {
            // 人员

            getData: { type: 'get', url: '/Role/TreeAll' },
            update: { type: 'post', url: '/Role/TreeUpdate' },
            delete: { type: 'post', url: '/Role/TreeDelete' },
            changeActive: { type: 'post', url: '/Role/TreeActive' },
            // 人员 end---

            roleSelect: { type: 'get', url: '/Role/Select' }, //  权限树
            getFunction: { type: 'get', url: '/Role/FunctionAll' }, // 权限列表
            roleTree: { type: 'get', url: '/Role/Tree' }, //   权限树


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

        // 表头
        var tableHead = [
            { label: '序号', type: 'sequence' },
            { label: '权限名称', key: 'Text' },
            { label: '权限ID', key: 'FunctionID' },
            { label: '上级权限ID', key: 'RoleID' },
            { label: '路径', key: 'Path' },
            { label: '顺序', key: 'UserID' },
            { label: '状态', key: 'TypeID', type: 'switch', show: 'jurisdiction' },
            { label: '操作', type: 'operation', show: 'jurisdiction' },
        ];
        // 搜索条件模板
        var searchTemplate = { Active: '-1', Name: '' };


        var model = $com.Model.create({
            el: '#postManagement-body',
            name: '组织架构',
            VueName: 'vm',
            mixins: [ $mixinsTools, $baseComponents ],
            data: {
                tableHead: tableHead, // 表头
                searchData: $com.util.Clone(searchTemplate),
                customSearchData: {
                    isCustomSearch: false,
                    Name: '',
                    data: [],
                },
                tableRoleID: 0, // 父级权限ID
                tableData: [], // 数据列表
                selectOptions: {
                    department: [],
                    role: [],
                }, // 下拉框数据
                tree: {
                    show: false,
                    title: '权限表',
                    dataAll: [], // 全部权限
                }, // 权限树数据
                //用户权限
                jurisdiction: false,
            },
            computed: {
                tableShow: function(){
                    var that = this;

                    if( that.customSearchData.isCustomSearch ){
                        return that.customSearchData.data;
                    } else{
                        return this.tableData.filter(function(item){
                            return item.RoleID === that.tableRoleID;
                        });
                    }
                },
            },
            filters: {
                // 激活状态
                switchStatus: function(e){
                    // 0-从未激活 1-激活 2-关闭
                    return e === 1;
                },
            },
            watch: {},
            created: function(){
                var that = this;
                that.search();
                that.getSelectOptions();
                this.jurisdiction = $com.app.checkRole(105000);
            },
            mounted: function(){
            },
            methods: {
                // 查询
                search: function($event){
                    var that = this;
                    $com.app.loading('数据加载中...');

                    var params = $event ? that.searchData : searchTemplate;

                    http('getData', params, function(res){
                        $com.app.loaded();
                        that.tableData = res.list;
                        model.com.eachTree();

                        // 点击查询按钮
                        if( $event ){
                            that.tableRoleID = 0;
                        }

                        if( $event && that.customSearchData.Name ){
                            // 赋值
                            that.customSearchData.isCustomSearch = true;
                            that.customSearchData.data = that.tableData.filter(function(item){
                                return item.Text.indexOf(that.customSearchData.Name) > -1;
                            });
                        } else{
                            that.customSearchData.isCustomSearch = false;
                            that.customSearchData.data = [];
                        }

                    });
                },
                // 清空
                emptyClick: function(){
                    this.customSearchData.Name = '';
                    this.searchData.Active = '-1';
                },
                // 添加
                addClick: function(){
                    var that = this;
                    this.$refs['myPopupForm'].open({
                        title: '新增权限',
                        option: formOptions,
                        confirm: function(rst){
                            if( !rst || $.isEmptyObject(rst) ){
                                return false;
                            }
                            var _data = {
                                ID: 0,
                                Text: rst.Text,
                                RoleID: that.tableRoleID, //父级权限
                                TypeID: 0,
                                FunctionID: rst.FunctionID,
                                Path: '',
                            };
                            for( var i = 0; i < that.tableShow.length; i++ ){
                                if( rst.Text == that.tableShow[i].Text ){
                                    alert('新增权限已存在！');
                                    return false;
                                }
                            }
                            if( rst.RoleID == rst.FunctionID ){
                                alert('您不能是自己的上级');
                                return false;
                            }
                            if( _data.Text == '' ){
                                alert('请输入完整信息');
                                return false;
                            }
                            $com.util.deleteLowerProperty(_data);

                            http('update', { data: _data }, function(res){
                                alert('新增成功！！');
                                that.search();
                            });
                        },
                    });
                    /*
                    var that = this;
                    var defaultValue = {
                        Text: '',
                        FunctionID: null,
                        Path: '',
                        UserID: 0,
                    };
                    $('body').append($com.modal.show(defaultValue, KEYWORD_department, '新增权限', function(rst){
                        //调用插入函数然后用load刷新数据源

                        if( !rst || $.isEmptyObject(rst) ){
                            return false;
                        }
                        var _data = {
                            ID: 0,
                            Text: rst.Text,
                            RoleID: that.tableRoleID, //父级权限
                            TypeID: 0,
                            FunctionID: rst.FunctionID,
                            Path: '',
                        };
                        for( var i = 0; i < that.tableShow.length; i++ ){
                            if( rst.Text == that.tableShow[i].Text ){
                                alert('新增权限已存在！');
                                return false;
                            }
                        }
                        if( rst.RoleID == rst.FunctionID ){
                            alert('您不能是自己的上级');
                            return false;
                        }
                        if( _data.Text == '' ){
                            alert('请输入完整信息');
                            return false;
                        }
                        $com.util.deleteLowerProperty(_data);

                        http('update', { data: _data }, function(res){
                            alert('新增成功！！');
                            that.search();
                        });

                    }, TypeSource_department));
                    */
                },
                // 编辑
                editClick: function(row){
                    var that = this;
                    var newRow = $com.util.Clone(row);
                    var myPopupForm = that.$refs['myPopupForm'];
                    var newOptions = {
                        Text: newRow.Text,
                        FunctionID: { default: newRow.FunctionID, disabled: true },
                        Path: newRow.Path,
                        UserID: newRow.UserID,
                    };
                    myPopupForm.open({
                        title: '修改权限信息',
                        option: myPopupForm.newOptions(newOptions, formOptions),
                        confirm: function(rst){
                            if( !rst || $.isEmptyObject(rst) ){
                                return;
                            }

                            newRow.Text = rst.Text;
                            newRow.Path = rst.Path;
                            newRow.UserID = rst.UserID;

                            $com.util.deleteLowerProperty(newRow);

                            http('update', { data: newRow }, function(res){
                                alert('修改成功！！');
                                that.search();
                            });
                        },
                    });
                    /*
                    var newRow = $com.util.Clone(row);
                    var that = this;
                    var default_value = {
                        Text: newRow.Text,
                        FunctionID_R: newRow.FunctionID,
                        Path: newRow.Path,
                        UserID: newRow.UserID,
                    };
                    $('body').append($com.modal.show(default_value, KEYWORD_department, '修改权限', function(rst){
                        //调用修改函数
                        if( !rst || $.isEmptyObject(rst) ){
                            return;
                        }

                        newRow.Text = rst.Text;
                        newRow.Path = rst.Path;
                        newRow.UserID = rst.UserID;

                        $com.util.deleteLowerProperty(newRow);

                        http('update', { data: newRow }, function(res){
                            alert('修改成功！！');
                            that.search();
                        });
                    }, TypeSource_department));
                    */
                },
                // 删除
                removeClick: function(row){
                    var that = this;
                    if( row.TypeID !== 0 ){
                        return false;
                    }

                    for( let i = 0, len = that.tableData.length; i < len; i++ ){
                        if( that.tableData[i].RoleID === row.FunctionID )
                            return alert('请先删除子权限');
                    }
                    if( !confirm('已选择1条数据，确定将其删除？') ){
                        return false;
                    }
                    that.tableData.forEach(function(item){
                        if( item.RoleID === row.FunctionID ){
                            return alert('您不能删除有下级的上级');
                        }
                    });

                    http('delete', { data: [ row.FunctionID ] }, function(res){
                        alert('删除成功！！');
                        that.search();
                    });
                },
                // 切换激活状态
                activeChange: function(row){
                    var that = this;
                    var newActive = row.TypeID === 1 ? 2 : 1;
                    var data = {
                        Active: newActive,
                        data: [ row.FunctionID ],
                    };
                    http('changeActive', data, function(){
                        row.TypeID = newActive;
                        that.search();
                        alert('操作成功！');
                    });
                },
                // 获取下拉框数据
                getSelectOptions: function(){
                    var that = this;
                    // 权限树数据
                    http('roleTree', {}, function(res){
                        that.tree.dataAll = res.list;
                    });
                },
            },
            events: function(){
                // 状态树点击
                $('body').delegate('.jurisdiction-name', 'click', function(){
                    var $this = $(this);
                    model.com.emptyTreeCheck();
                    $this.addClass('check');
                    var mRoleID = Number($this.closest('span').attr('data-value'));
                    model.data.tableRoleID = mRoleID;
                    model.com.emptyCustomSearchData();
                });
                $('body').delegate('#showAllTree', 'click', function(){
                    model.com.emptyTreeCheck();
                    model.data.tableRoleID = 0;
                    model.com.emptyCustomSearchData();
                });
            },
            com: {
                //权限树的显示
                renderTree: function(list){
                    $com.app.loading('数据加载中...');
                    var _data = FindData(0);
                    SetData(_data);

                    tempData(_data);
                    $('#roleTree').html($com.util.template(_data, HTML.TreeItemNode));
                    $('#roleTree').find('li ul').each(function(i, item){
                        if( $(item).children('li')[0] ){
                            return true;
                        }
                        $(item).remove();
                    });
                    $('#roleTree').treeview();

                    $com.app.loaded();

                    function SetData(_in_data){
                        $.each(_in_data, function(_in_i, _item){
                            var d = FindData(_item.FunctionID);
                            if( d.length ){
                                _item.items = d;
                                SetData(_item.items);
                            }
                        });

                    }

                    function FindData(wRoleID){
                        var _rst_Array = [];
                        $.each(list, function(i, item){
                            if( wRoleID == item.RoleID ){
                                _rst_Array.push(item);
                            }
                        });
                        return _rst_Array;
                    }

                    function tempData(_in_data_t){
                        $.each(_in_data_t, function(_in_i_t, _item_t){
                            _item_t.Type = '';
                            if( _item_t.items && _item_t.items.length ){
                                tempData(_item_t.items);
                                _item_t.Items = $com.util.template(_item_t.items, HTML.TreeItemNode);
                            }
                        });

                    }
                },
                //遍历权限树数据
                eachTree: function(list){
                    http('getData', { Active: -1 }, function(res){
                        var list = res.list;
                        model.com.renderTree(list);
                        topLevelTree = $com.util.Clone(list).filter(function(item){
                            return item.RoleID === 0;
                        });
                    });

                },
                // 清除权限树样式
                emptyTreeCheck: function(){
                    $('.jurisdiction-name').each(function(i, item){
                        $(item).removeClass('check');
                    });
                },
                // 清空自定义查询条件
                emptyCustomSearchData: function(){
                    model.data.customSearchData.isCustomSearch = false;
                    model.data.customSearchData.Name = '';
                    model.data.customSearchData.data = [];
                },
            },
        });
        model.init();
    });
