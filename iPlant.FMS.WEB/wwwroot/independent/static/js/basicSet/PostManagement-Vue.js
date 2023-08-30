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
        /*  var
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
                  DepartmentID: [],
              };
              KEYWORD_department_LIST = [
                  'ID|岗位编号',
                  'Name|岗位名称*',
                  'DepartmentID|所属部门|ArrayOne',
                  'EditTime|时间|DateTime',
                  'Remark|岗位描述',
              ];
              $com.util.configBuild(KEYWORD_department_LIST, KEYWORD_department, TypeSource_department, Formattrt_department);
          } )();*/

        var formSelectOptions = {
            DepartmentID: [],
        };
        var formOptions = [
            { label: '岗位编号', value: 'ID', span: 12 },
            { label: '岗位名称', value: 'Name', rules: [ 'required' ], span: 12 },
            {
                label: '所属部门', value: 'DepartmentID', span: 12, type: 'select',
                rules: [ 'required' ],
                clearable: true, options: formSelectOptions.DepartmentID,
            },
            { label: '岗位描述', value: 'Remark', type: 'textarea', span: 24 },

        ];


        var HTML = {
            TreeItemNode: [
                '<li class="range-role-li  {{Type}}" >',
                '<span style="vertical-align:top;font-size: 19px">',
                '<input type="checkbox" class="femi-tree-checkbox" style="margin: 1px 0 1px 10px"  value="{{FunctionID}}"/>{{Text}}',
                '</span>',
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
            roleAll: { type: 'get', url: '/Role/All' }, // 获取岗位列表
            roleTree: { type: 'get', url: '/Role/Tree' }, //   权限树
            roleSelect: { type: 'get', url: '/Role/Select' }, //  权限树
            updateSelect: { type: 'post', url: '/Role/UpdateSelect' }, //   编辑权限树
            roleUpdate: { type: 'post', url: '/Role/Update' }, // 新增/切换岗位
            roleDelete: { type: 'post', url: '/Role/Delete' }, // 删除岗位
            roleActive: { type: 'post', url: '/Role/Active' }, // 切换岗位状态
            departmentAll: { type: 'get', url: '/Department/AllDepartment' }, // 部门列表
            userAll: { type: 'get', url: '/User/All' }, // 人员列表
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
            { label: '序号', type: 'sequence', width: 60 },
            { label: '岗位编码', key: 'Code', width: 90 },
            { label: '岗位名称', key: 'Name' },
            { label: '所属部门', key: 'DepartmentName' },
            { label: '岗位人员数量', key: 'EmployeeCount', minWidth: 120  },
            { label: '编辑人', key: 'EditorName',minWidth: 120 },
            { label: '岗位描述', key: 'Remark' },
            { label: '编辑时间', key: 'EditTime', type: 'time', width: 150  },
            { label: '状态', key: 'Active', type: 'switch', show: 'jurisdiction' , width: 60},
            { label: '操作', type: 'operation', show: 'jurisdiction', width: 240 },
        ];
        // 搜索条件模板
        var searchTemplate = { Name: '', DepartmentID: '', Active: '-1' };
        // 最小有效日期
        var minTime = new Date('2020-01-01 00:00:00');

        var model = $com.Model.create({
            el: '#postManagement-body',
            name: '岗位管理',
            VueName: 'vm',
            mixins: [ $mixinsTools, $baseComponents ],
            data: {
                // 表头
                tableHead: tableHead,
                // 搜索框
                searchData: $com.util.Clone(searchTemplate),
                // 数据列表
                tableData: [],
                // 下拉框数据
                selectOptions: {
                    department: [],
                },
                // 主页面宽度
                pageWidth: 100,

                rightPageData: {
                    status: 0, // 0隐藏 1人员 2权限
                    title: '',
                    data: [],
                    checkID: undefined,
                },

                //用户权限
                jurisdiction: false,
            },
            computed: {
                leftWidht: function(){
                    return this.rightPageData.status === 0 ? '100%' : '80%';
                },
            },
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
                this.jurisdiction = $com.app.checkRole(104000);
            },
            mounted: function(){
            },
            methods: {
                // 查询
                search: function($event){
                    var that = this;
                    $com.app.loading('数据加载中...');

                    var params = $event ? that.searchData : searchTemplate;

                    http('roleAll', params, function(res){
                        $com.app.loaded();
                        that.tableData = res.list;
                    });
                },
                // 清空
                emptyClick: function(){
                    this.searchData.Name = '';
                    this.searchData.DepartmentID = '';
                    this.searchData.Active = '-1';
                },
                // 添加
                addClick: function(){
                    var that = this;
                    var myPopupForm = that.$refs['myPopupForm'];
                    var newOptions = {
                        Name: '',
                        DepartmentID: '',
                        Remark: '',
                    };
                    myPopupForm.open({
                        title: '新增岗位',
                        option: myPopupForm.newOptions(newOptions, formOptions),
                        confirm: function(rst){

                            if( !rst || $.isEmptyObject(rst) ){
                                return false;
                            }
                            var _data = {
                                ID: 0,
                                Name: rst.Name,
                                DepartmentID: Number(rst.DepartmentID),
                                SonList: [],
                                Active: 0,
                                Remark: rst.Remark,
                            };
                            for( var i = 0; i < that.tableData.length; i++ ){
                                if( rst.Name === that.tableData[i].Name ){
                                    alert('新增岗位已存在！');
                                    return false;
                                }
                            }
                            $com.util.deleteLowerProperty(_data);

                            http('roleUpdate', { data: _data }, function(res){
                                alert('新增成功！！');
                                that.search();
                            });

                        },
                    });
                    /*    return false;
                        var that = this;
                        var defaultValue = {
                            Name: '',
                            DepartmentID: 0,
                            Remark: '',
                        };
                        $('body').append($com.modal.show(defaultValue, KEYWORD_department, '新增岗位', function(rst){
                            //调用插入函数然后用load刷新数据源

                            if( !rst || $.isEmptyObject(rst) ){
                                return false;
                            }
                            var _data = {
                                ID: 0,
                                Name: rst.Name,
                                DepartmentID: Number(rst.DepartmentID),
                                SonList: [],
                                Active: 0,
                                Remark: rst.Remark,
                            };
                            for( var i = 0; i < that.tableData.length; i++ ){
                                if( rst.Name === that.tableData[i].Name ){
                                    alert('新增岗位已存在！');
                                    return false;
                                }
                            }
                            $com.util.deleteLowerProperty(_data);

                            http('roleUpdate', { data: _data }, function(res){
                                alert('新增成功！！');
                                that.search();
                            });

                        }, TypeSource_department));
                    */
                },
                // 编辑
                editClick: function(row){
                    var newRow = $com.util.Clone(row);
                    var that = this;
                    var myPopupForm = that.$refs['myPopupForm'];

                    var DepartmentID =this.ToolNewSelectOptions(
                        [row.DepartmentID],
                        [row.DepartmentName],
                        formSelectOptions.DepartmentID,
                    );
                    var newOptions = {
                        Name: newRow.Name,
                        DepartmentID: {
                            default:newRow.DepartmentID,
                            options:DepartmentID
                        },
                        Remark: newRow.Remark,
                    };
                    myPopupForm.open({
                        title: '修改岗位信息',
                        option: myPopupForm.newOptions(newOptions, formOptions),
                        confirm: function(rst){

                            //调用修改函数
                            if( !rst || $.isEmptyObject(rst) ){
                                return;
                            }

                            newRow.Name = rst.Name;
                            newRow.DepartmentID = rst.DepartmentID;
                            newRow.Remark = rst.Remark;


                            $com.util.deleteLowerProperty(newRow);
                            http('roleUpdate', { data: newRow }, function(res){
                                alert('修改成功！！');
                                that.search();
                            });

                        },
                    });

                    /*var newRow = $com.util.Clone(row);
                    var that = this;
                    var default_value = {
                        Name: newRow.Name,
                        DepartmentID: newRow.DepartmentID,
                        Remark: newRow.Remark,
                    };
                    $('body').append($com.modal.show(default_value, KEYWORD_department, '修改岗位', function(rst){
                        //调用修改函数
                        if( !rst || $.isEmptyObject(rst) ){
                            return;
                        }

                        newRow.Name = rst.Name;
                        newRow.DepartmentID = rst.DepartmentID;
                        newRow.Remark = rst.Remark;


                        $com.util.deleteLowerProperty(newRow);
                        http('roleUpdate', { data: newRow }, function(res){
                            alert('修改成功！！');
                            that.search();
                        });
                    }, TypeSource_department));
*/
                },
                // 删除
                removeClick: function(row){
                    var that = this;

                    if( row.Active !== 0 ){
                        return false;
                    }
                    if( !confirm('已选择1条数据，确定将其删除？') ){
                        return false;
                    }

                    http('roleDelete', { data: row }, function(res){
                        alert('删除成功！！');
                        that.search();

                        if( that.rightPageData.checkID === row.ID ){
                            that.hideRight();
                        }

                    });
                },
                // 切换激活状态
                activeChange: function(row){
                    var that = this;
                    var newActive = row.Active === 1 ? 2 : 1;
                    var data = {
                        Active: newActive,
                        data: [ row ],
                    };
                    http('roleActive', data, function(){
                        row.Active = newActive;
                        that.search();
                        alert('操作成功！');
                    });
                },
                // 查看人员
                showStaff: function(row){
                    var that = this;
                    $com.app.loading();
                    http('userAll', { RoleID: row.ID, Active: 1 }, function(res){
                        $com.app.loaded();
                        that.rightPageData.data = res.list;
                        that.rightPageData.title = row.Name;
                        that.rightPageData.status = 1;
                        that.rightPageData.checkID = row.ID;
                    });
                },
                // 查看权限
                showLimits: function(row){
                    var that = this;
                    that.rightPageData.title = row.Name;
                    that.rightPageData.status = 2;
                    that.rightPageData.data = row;
                    that.rightPageData.checkID = row.ID;
                    $com.app.loading();
                    http('roleSelect', { role_id: row.ID }, function(res){
                        $com.app.loaded();
                        model.com.renderTreeCheck(res.list);
                    });
                },
                // 保存权限编辑
                saveLimits: function($event){
                    var that = this;
                    var list = [];
                    $('#roleTree li span input[type=checkbox].femi-tree-checkbox').each(function(i, item){
                        if( item.checked || item.indeterminate ){
                            list.push({
                                FunctionID: Number($(item).val()),
                                Text: $(item).parent().text(),
                                RoleID: that.rightPageData.data.ID,
                            });
                        }
                    });
                    http('updateSelect', { data: list, RoleID: that.rightPageData.data.ID }, function(res){
                        alert('保存成功！');
                    });
                },
                // 隐藏右侧列表
                hideRight: function(){
                    this.rightPageData.checkID = undefined;
                    this.rightPageData.status = 0;
                    this.rightPageData.data = [];
                    this.rightPageData.title = '';
                },
                // 获取下拉框数据
                getSelectOptions: function(){
                    var that = this;
                    http('departmentAll', { Active: 1 }, function(res){

                        that.ToolArrReplace(formSelectOptions.DepartmentID, res.list);
                        that.selectOptions.department = res.list;
                        /*    TypeSource_department.DepartmentID = [];
                            res.list.forEach(function(item){
                                TypeSource_department.DepartmentID.push({
                                    name: item.Name,
                                    value: item.ID,
                                    far: null,
                                });
                            });*/
                    });
                },
            },
            events: function(){
                $('body').delegate('#roleTree .femi-tree-checkbox,#rangeTree .femi-tree-checkbox', 'change', function(){

                    var $this = $(this);

                    var $own_check = $this.parent('span').next('ul').find('.femi-tree-checkbox');

                    $own_check.prop('indeterminate', false);

                    var $Siblings = $this.parent('span').parent('li').parent('ul').children('li').children('span').children('.femi-tree-checkbox');

                    var $parent_check = $this.parent('span').parent('li').parent('ul').prev('span').children('.femi-tree-checkbox');

                    if( $this[0].checked ){
                        $own_check.prop('checked', true);
                        var Is_all = true;
                        $Siblings.each(function(i, item){
                            if( !item.checked ){
                                Is_all = false;
                            }
                        });
                        if( Is_all ){
                            $parent_check.prop('checked', true);
                            $parent_check.prop('indeterminate', false);
                        } else{
                            $parent_check.prop('checked', false);
                            $parent_check.prop('indeterminate', true);
                        }
                    } else{
                        $own_check.prop('checked', false);
                        var Is_all = true;
                        $Siblings.each(function(i, item){
                            if( item.checked || $(item).prop('indeterminate') ){
                                Is_all = false;
                            }
                        });
                        $parent_check.prop('checked', false);
                        if( Is_all ){
                            $parent_check.prop('indeterminate', false);
                        } else{
                            $parent_check.prop('indeterminate', true);
                        }
                    }

                    if( $parent_check[0] ){
                        CheckTree($parent_check);
                    }
                });

                function CheckTree($this){
                    var $Siblings = $this.parent('span').parent('li').parent('ul').children('li').children('span').children('.femi-tree-checkbox');

                    var $parent_check = $this.parent('span').parent('li').parent('ul').prev('span').children('.femi-tree-checkbox');

                    if( $this[0].checked ){

                        var Is_all = true;
                        $Siblings.each(function(i, item){
                            if( !item.checked ){
                                Is_all = false;
                            }
                        });
                        if( Is_all ){
                            $parent_check.prop('checked', true);
                            $parent_check.prop('indeterminate', false);
                        } else{
                            $parent_check.prop('checked', false);
                            $parent_check.prop('indeterminate', true);
                        }
                    } else{

                        var Is_all = true;
                        $Siblings.each(function(i, item){
                            if( item.checked || $(item).prop('indeterminate') ){
                                Is_all = false;
                            }
                        });
                        $parent_check.prop('checked', false);
                        if( Is_all ){
                            $parent_check.prop('indeterminate', false);
                        } else{
                            $parent_check.prop('indeterminate', true);
                        }
                    }

                    if( $parent_check[0] ){
                        CheckTree($parent_check);
                    }
                }
            },
            com: {
                renderTree: function(list){
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
                renderTreeCheck: function(list){
                    if( !$('#roleTree').children('li')[0] ){
                        http('roleTree', {}, function(res){
                            model.com.renderTree(res.list);
                            model.com.renderTreeCheck(list);
                        });
                        return false;
                    }
                    $('#roleTree li span input[type=checkbox].femi-tree-checkbox').prop('checked', false);
                    $('#roleTree li span input[type=checkbox].femi-tree-checkbox').prop('indeterminate', false);
                    $('#roleTree li span input[type=checkbox].femi-tree-checkbox').each(function(i, item){
                        var functionID = $(item).val();
                        if( !functionID || isNaN(functionID) ){
                            return true;
                        }
                        functionID = Number(functionID);

                        var _index = $com.util.findIndex(list, function(p){
                            return p.FunctionID == functionID;
                        });
                        if( _index < 0 ){
                            $(item).prop('checked', false);
                            return true;
                        }
                        $(item).prop('checked', true);
                        $(item).change();

                    });
                },
            },
        });
        model.init();
    });
