require(
    [
        '../static/utils/js/jquery-3.1.1',
        '../static/utils/js/base/paging',
        '../static/utils/js/base/base',
        '../static/utils/vue/mixins/tools',
        '../static/utils/vue/mixins/baseComponents',
    ],
    function($alfie, $page, $com, $mixinsTools, $baseComponents){
        var minTime = new Date('2020-01-01 00:00:00');
        var UriList = {
            typeGetData: { type: 'get', url: '/DMSDeviceType/All' },
            typeUpdate: { type: 'post', url: '/DMSDeviceType/Update' },
            typeChangeActive: { type: 'post', url: '/DMSDeviceType/Active' },
            typeDelete: { type: 'post', url: '/DMSDeviceType/Delete' },
        };
        var formOptions = [
            { label: '设备类型名称', value: 'Name', rules: [ 'required' ], span: 24 },
            { label: '设备类型描述', value: 'Remark', type: 'textarea' },
        ];
        var searchTemplate = { Name: '', Active: '-1' };

        var model = $com.Model.create({
            el: '#deviceType-body',
            name: '设备类型',
            VueName: 'vm',
            mixins: [ $mixinsTools, $baseComponents ],
            data: {
                searchData: $com.util.Clone(searchTemplate),
                tableData: [],
                UriList: UriList,
                jurisdiction: false,       //用户权限
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
            created: function(){
                this.search();
                this.jurisdiction = $com.app.checkRole(102000);
            },
            methods: {
                search: function($event){
                    var that = this;
                    var params = $event ? that.searchData : searchTemplate;
                    $com.app.loading('数据加载中...');
                    that.Http('typeGetData', params, function(res){
                        $com.app.loaded();
                        that.tableData = res.list;
                    });
                },
                emptyClick: function(){
                    this.searchData = $com.util.Clone(searchTemplate);
                },
                addClick: function(){
                    var that = this;
                    this.$refs['myPopupForm'].open({
                        title: '新增设备类型',
                        option: formOptions,
                        confirm: function(rst){
                            if( !rst || $.isEmptyObject(rst) ){
                                return false;
                            }
                            var _data = {
                                ID: 0,
                                Name: rst.Name,
                                Active: 0,
                                Remark: rst.Remark,
                            };
                            var mData = that.tableData;
                            for( var i = 0; i < mData.length; i++ ){
                                if( rst.Name == mData[i].Name ){
                                    alert('新增设备类型已存在！');
                                    return false;
                                }
                            }
                            $com.util.deleteLowerProperty(_data);

                            that.Http('typeUpdate', { data: _data }, function(res){
                                alert('新增成功！！');
                                that.search();
                            });
                        },
                    });
                },
                editClick: function(row,index){
                    var that = this;
                    var myPopupForm = that.$refs['myPopupForm'];
                    var newOptions = {
                        Name: row.Name,
                        Remark: row.Remark,
                    };
                    myPopupForm.open({
                        title: '编辑设备类型',
                        option: myPopupForm.newOptions(newOptions, formOptions),
                        confirm: function(rst){
                            //调用修改函数
                            if( !rst || $.isEmptyObject(rst) ){
                                return;
                            }
                            var newRow = $com.util.Clone(row);
                            newRow.Name = rst.Name;
                            newRow.Remark = rst.Remark;

                            that.Http('typeUpdate', { data: newRow }, function(res){
                                // that.tableData.splice(index,1,res.info)
                                that.search();
                                alert('修改成功！！');
                            });
                        },
                    });

                },
                removeClick: function(row){
                    var that = this;
                    if( row.Active !== 0 ){ return false; }
                    if( !confirm('已选择1条数据，确定将其删除？') ){ return false; }
                    this.Http('typeDelete', { data: [ row ] }, function(res){
                        alert('删除成功！！');
                        that.search();
                    });
                },
                activeChange: function(row){
                    var that = this;
                    var newActive = row.Active === 1 ? 2 : 1;
                    var data = { Active: newActive, data: [ row ] };
                    that.Http('typeChangeActive', data, function(){
                        // row.Active = newActive;
                        that.search();
                        alert('操作成功！');
                    });
                },
            },
            events: function(){},
        });

        model.init();
    },
);
