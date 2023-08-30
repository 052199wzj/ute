require(
    [
        '../static/utils/js/jquery-3.1.1',
        '../static/utils/js/base/base',
        '../static/utils/vue/mixins/tools',
        '../static/utils/vue/mixins/baseComponents',
    ],
    function($alfie, $com, $mixinsTools, $baseComponents){

        var formSelectOptions = {
            ParentID: [],
        };
        // 弹框全局配置
        var formOptions = [
            { label: '区域编码', value: 'Code', span: 8 },
            { label: '区域名称', value: 'Name', rules: [ 'required' ], span: 8 },
            {
                label: '上级区域', value: 'ParentID', type: 'select', span: 8,
                clearable: true, options: formSelectOptions.ParentID,
            },
            { label: '区域描述', value: 'Remark', type: 'textarea' },
        ];

        // 表头
        var tableHead = [
            { label: '序号', type: 'sequence' },
            { label: '区域编码', key: 'Code' },
            { label: '区域名称', key: 'Name' },
            { label: '上级区域名称', key: 'ParentName' },
            { label: '操作人', key: 'OperatorName' },
            { label: '描述', key: 'Remark' },
            { label: '操作时间', key: 'OperateTime', type: 'time' },
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
            getData: { type: 'get', url: '/BMSRegion/All' },
            upDate: { type: 'post', url: '/BMSRegion/Update' },
            changeActive: { type: 'post', url: '/BMSRegion/Active' },
            delete: { type: 'post', url: '/BMSRegion/Delete' },
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
            el: '#areaManagement-body',
            name: '区域管理',
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
                this.jurisdiction = $com.app.checkRole(107000);
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
                        $event || that.getSelectOptions();
                    });
                },
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
                                Code: rst.Code,
                                Name: rst.Name,
                                ParentID: Number(rst.ParentID) || 0,
                                Active: 0,
                                Remark: rst.Remark,
                            };
                            for( var i = 0; i < that.tableData.length; i++ ){
                                if( rst.Name === that.tableData[i].Name ){
                                    alert('新增区域已存在！');
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
                        Code: '',
                        Name: '',
                        ParentID: 0,
                        Remark: '',
                    };
                    $('body').append($com.modal.show(defaultValue, KEYWORD_department, '新增区域', function(rst){
                        //调用插入函数然后用load刷新数据源

                        if( !rst || $.isEmptyObject(rst) ){
                            return false;
                        }
                        var _data = {
                            ID: 0,
                            Code: rst.Code,
                            Name: rst.Name,
                            ParentID: Number(rst.ParentID),
                            Active: 0,
                            Remark: rst.Remark,
                        };
                        for( var i = 0; i < that.tableData.length; i++ ){
                            if( rst.Name === that.tableData[i].Name ){
                                alert('新增区域已存在！');
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
                    var ParentID = this.ToolNewSelectOptions(
                        [ row.ParentID ],
                        [ row.ParentName ],
                        formSelectOptions.ParentID,
                    ).filter(function(item){ return item.ID !== row.ID; });
                    var newOptions = {
                        Name: newRow.Name,
                        ParentID: {
                            default: newRow.ParentID || '',
                            options: ParentID,
                        },
                        Remark: newRow.Remark,
                        Code: { default: newRow.Code, rules: [ 'required' ] },
                    };
                    myPopupForm.open({
                        title: '修改区域信息',
                        option: myPopupForm.newOptions(newOptions, formOptions),
                        confirm: function(rst){
                            if( !rst || $.isEmptyObject(rst) ){
                                return;
                            }

                            newRow.Name = rst.Name;
                            newRow.ParentID = Number(rst.ParentID) || 0;
                            newRow.Remark = rst.Remark;
                            newRow.Code = rst.Code;

                            $com.util.deleteLowerProperty(newRow);
                            http('upDate', { data: newRow }, function(res){
                                alert('修改成功！！');
                                that.search();
                            });
                        },
                    });


                    /*
                    var newRow = $com.util.Clone(row);
                    var that = this;
                    var default_value = {
                        Name: newRow.Name,
                        ParentID: newRow.ParentID,
                        Remark: newRow.Remark,
                        Code: newRow.Code,
                    };

                    var new_TypeSource = $com.util.Clone(TypeSource_department);
                    new_TypeSource.ParentID =
                        TypeSource_department.ParentID.filter(function(item){
                            return item.value !== row.ID;
                        });

                    $('body').append($com.modal.show(default_value, KEYWORD_department, '修改区域', function(rst){
                        //调用修改函数
                        if( !rst || $.isEmptyObject(rst) ){
                            return;
                        }

                        newRow.Name = rst.Name;
                        newRow.ParentID = Number(rst.ParentID);
                        newRow.Remark = rst.Remark;
                        newRow.Code = rst.Code;

                        $com.util.deleteLowerProperty(newRow);
                        http('upDate', { data: newRow }, function(res){
                            alert('修改成功！！');
                            that.search();
                        });
                    }, new_TypeSource));
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
                getSelectOptions: function(){
                    var that = this;
                    http('getData', { Active: 1 }, function(res){

                        that.ToolArrReplace(formSelectOptions.ParentID, res.list);
                        /*
                                                TypeSource_department.ParentID = [ {
                                                    name: '无',
                                                    value: null,
                                                    far: null,
                                                } ];
                                                res.list.forEach(function(item){
                                                    TypeSource_department.ParentID.push({
                                                        name: item.Name,
                                                        value: item.ID,
                                                        far: null,
                                                    });
                                                });*/
                    });
                },
            },
            events: function(){
            },
        });
        model.init();
    });
