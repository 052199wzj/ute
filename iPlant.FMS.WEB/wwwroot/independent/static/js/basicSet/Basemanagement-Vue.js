require(
    [
        '../static/utils/js/jquery-3.1.1',
        '../static/utils/js/base/base',
        '../static/utils/vue/mixins/tools',
        '../static/utils/vue/mixins/baseComponents',
    ],
    function($alfie, $com, $mixinsTools, $baseComponents){
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
                  // DepartmentID: [],
              };
              KEYWORD_department_LIST = [
                  'ID|基地编号',
                  'Code|基地编码*',
                  'Name|基地名称*',
                  'EditTime|时间|DateTime',
                  'Remark|基地描述',
              ];
              $com.util.configBuild(KEYWORD_department_LIST, KEYWORD_department, TypeSource_department, Formattrt_department);
          } )();*/

        // 验证函数
        var validate = {
            code: function(rule, value, callback){
                for( let item of model.data.tableData ){
                    if( item.Code === value ) return callback('基地编码重复!');
                }
                callback();
            },
            name: function(rule, value, callback){
                for( let item of model.data.tableData ){
                    if( item.Name === value ) return callback('基地名称重复!');
                }
                callback();
            },
        };
        // 弹框全局配置
        var formOptions = [
            {
                label: '基地编码', value: 'Code',span:24,
                rules: [ 'required', { validator: validate.code, trigger: 'blur' } ],
            },
            {
                label: '基地名称', value: 'Name',span:24,
                rules: [ 'required', { validator: validate.name, trigger: 'blur' } ],
            },
            { label: '基地描述', value: 'Remark', type: 'textarea',span:24 },
        ];
        // 表头
        var tableHead = [
            { label: '序号', type: 'sequence' },
            { label: '基地编码', key: 'Code' },
            { label: '基地名称', key: 'Name' },
            { label: '创建人', key: 'Creator' },
            { label: '编辑人', key: 'Editor' },
            { label: '基地描述', key: 'Remark' },
            { label: '创建时间', key: 'CreateTime', type: 'time' },
            { label: '编辑时间', key: 'EditTime', type: 'time' },
            { label: '状态', key: 'Active', type: 'switch', show: 'jurisdiction' },
            { label: '操作', type: 'operation', show: 'jurisdiction' },
        ];
        // 搜索条件模板
        var searchTemplate = { Name: '', Active: '-1' };
        // 最小有效日期
        var minTime = new Date('2020-01-01 00:00:00');

        /**
         *  请求列表
         *  url: string    请求地址 - 必填
         *  type: string   请求类型 - 必填
         *  errMsg:string   错误提示 - 可填 默认值为 httpErrMsg[$TYPE]
         */
        var uriList = {
            getData: { type: 'get', url: '/FMCFactory/All' },
            upDate: { type: 'post', url: '/FMCFactory/Update' },
            changeActive: { type: 'post', url: '/FMCFactory/Active' },
            delete: { type: 'post', url: '/FMCFactory/Delete' },
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

        var model = $com.Model.create({
            el: '#basemanagement-body',
            name: '基地管理',
            VueName: 'vm',
            mixins: [ $mixinsTools, $baseComponents ],
            data: {
                // 表头
                tableHead: tableHead,
                // 搜索框
                searchData: $com.util.Clone(searchTemplate),
                // 数据列表
                tableData: [],
                //用户权限
                jurisdiction: false,

                props: {
                    label: 'name',
                    children: 'zones'
                },
                count: 1
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
            created: function(){
                this.search();
                this.jurisdiction = $com.app.checkRole(106000);
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
                        that.tableData = res.list;
                    });
                },
                // 清空
                emptyClick: function(){
                    this.searchData = $com.util.Clone(searchTemplate);
                },
                addClick: function(){
                    var that = this;
                    that.$refs['myPopupForm'].open({
                        title: '新增基地',
                        option: formOptions,
                        confirm: function(rst){
                            if( !rst || $.isEmptyObject(rst) ){
                                return false;
                            }
                            var _data = {
                                ID: 0,
                                Code: String(rst.Code),
                                Name: rst.Name,
                                ParentID: Number(rst.ParentID),
                                SonList: [],
                                Active: 0,
                                Remark: rst.Remark,
                                Type: Number(rst.Type),
                            };
                            for( var i = 0; i < that.tableData.length; i++ ){
                                if( rst.Name === that.tableData[i].Name ){
                                    alert('新增基地已存在！');
                                    return false;
                                }
                            }
                            $com.util.deleteLowerProperty(_data);
                            http('upDate', { data: _data }, function(res){
                                alert('新增成功！！');
                                that.search();
                            });
                        },
                        style:{
                            dialogWidth:'650px',
                            labelPosition:'right',
                            labelWidth:'80px'
                        },
                    });

                    /*
                    var that = this;
                    var defaultValue = {
                        Code: '',
                        Name: '',
                        ParentID: 0,
                        Type: 0,
                        Remark: '',
                    };
                    $('body').append($com.modal.show(defaultValue, KEYWORD_department, '新增基地', function(rst){
                        //调用插入函数然后用load刷新数据源

                        if( !rst || $.isEmptyObject(rst) ){
                            return false;
                        }
                        var _data = {
                            ID: 0,
                            Code: String(rst.Code),
                            Name: rst.Name,
                            ParentID: Number(rst.ParentID),
                            SonList: [],
                            Active: 0,
                            Remark: rst.Remark,
                            Type: Number(rst.Type),
                        };
                        for( var i = 0; i < that.tableData.length; i++ ){
                            if( rst.Name === that.tableData[i].Name ){
                                alert('新增基地已存在！');
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
                    var newOptions = {
                        Name: { default: newRow.Name, rules: [ 'required' ] },
                        Code: { default: newRow.Code, rules: [ 'required' ] },
                        Remark: newRow.Remark,
                    };
                    myPopupForm.open({
                        title: '修改基地信息',
                        option: myPopupForm.newOptions(newOptions, formOptions),
                        confirm: function(rst){
                            //调用修改函数
                            if( !rst || $.isEmptyObject(rst) ){
                                return;
                            }

                            newRow.Name = rst.Name;
                            newRow.Code = String(rst.Code);
                            newRow.Remark = rst.Remark;

                            $com.util.deleteLowerProperty(newRow);
                            http('upDate', { data: newRow }, function(res){
                                alert('修改成功！！');
                                that.search();
                            });
                        },
                        style:{
                            dialogWidth:'700px',
                            labelPosition:'right',
                        },
                    });
                    /*
                    var newRow = $com.util.Clone(row)
                    var that = this;
                    var default_value = {
                        Name: newRow.Name,
                        Type: newRow.Type,
                        Code: newRow.Code,
                        Remark: newRow.Remark,
                    };
                    $('body').append($com.modal.show(default_value, KEYWORD_department, '修改基地', function(rst){
                        //调用修改函数
                        if( !rst || $.isEmptyObject(rst) ){
                            return;
                        }

                        newRow.Name = rst.Name;
                        newRow.Type = Number(rst.Type);
                        newRow.Code = String(rst.Code);
                        newRow.Remark = rst.Remark;

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

                    http('delete', { data: [ row ] }, function(res){
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

            },
            events: function(){
            },
            com: {},
        });
        model.init();
    });
