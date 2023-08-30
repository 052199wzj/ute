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
            modelGetData: { type: 'get', url: '/DMSDeviceModel/All' },
            modelUpdate: { type: 'post', url: '/DMSDeviceModel/Update' },
            modelChangeActive: { type: 'post', url: '/DMSDeviceModel/Active' },
            modelDelete: { type: 'post', url: '/DMSDeviceModel/Delete' },

            typeGetData: { type: 'get', url: '/DMSDeviceType/All' },
        };
        var formSelectOptions = {
            DeviceType: [],
        };
        var formOptions = [
            { label: '设备型号名称', value: 'Name', rules: [ 'required' ] },
            {
                label: '设备类型', value: 'DeviceType', type: 'select', rules: [ 'required' ],
                options: formSelectOptions.DeviceType,
            },
            { label: '设备型号描述', value: 'Remark', type: 'textarea' },
        ];
        var searchTemplate = { Name: '', Active: '-1' };
        var model = $com.Model.create({
            el: '#deviceModel-body',
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
                this.getSelectOptions();
                this.jurisdiction = $com.app.checkRole(102000);
            },
            methods: {
                search: function($event){
                    var that = this;
                    var params = $event ? that.searchData : searchTemplate;
                    $com.app.loading('数据加载中...');
                    that.Http('modelGetData', params, function(res){
                        $com.app.loaded();
                        that.tableData = res.list;
                    });
                },
                emptyClick: function(){
                    this.searchData = $com.util.Clone(searchTemplate);
                },
                addClick: function(){
                    var that = this;
                    that.$refs['myPopupForm'].open({
                        title: '新增设备型号',
                        option: formOptions,
                        confirm: function(rst){
                            if( !rst || $.isEmptyObject(rst) ){
                                return false;
                            }
                            var _data = {
                                ID: 0,
                                Name: rst.Name,
                                DeviceType: Number(rst.DeviceType),
                                Active: 0,
                                Remark: rst.Remark,
                            };
                            var mData = that.tableData;
                            for( var i = 0; i < mData.length; i++ ){
                                if( rst.Name === mData[i].Name ){
                                    alert('新增设备型号已存在！');
                                    return false;
                                }
                            }
                            $com.util.deleteLowerProperty(_data);
                            that.Http('modelUpdate', { data: _data }, function(res){
                                alert('新增成功！！');
                                that.search();
                            });
                        },
                    });
                },
                editClick: function(row){
                    var that = this;
                    var newRow = $com.util.Clone(row);
                    var myPopupForm = that.$refs['myPopupForm'];


                    console.log(row);
                    var DeviceType =  this.ToolNewSelectOptions(
                        [newRow.DeviceType],
                        [newRow.DeviceTypeName],
                        formSelectOptions.DeviceType,
                    );

                    var newOptions = {
                        Name: newRow.Name,
                        Remark: newRow.Remark,
                        // DeviceType: newRow.DeviceType,
                        DeviceType:{
                            default:newRow.DeviceType,
                            options: DeviceType,
                        },
                    };
                    myPopupForm.open({
                        title: '编辑设备型号',
                        option: myPopupForm.newOptions(newOptions, formOptions),
                        confirm: function(rst){
                            //调用修改函数
                            if( !rst || $.isEmptyObject(rst) ){
                                return;
                            }
                            newRow.Name = rst.Name;
                            newRow.Remark = rst.Remark;
                            newRow.DeviceType = Number(rst.DeviceType);

                            that.Http('modelUpdate', { data: newRow }, function(res){
                                alert('修改成功！！');
                                that.search();
                            });
                        },
                    });
                },
                removeClick: function(row){
                    var that = this;
                    if( row.Active !== 0 ){
                        return false;
                    }
                    if( !confirm('已选择1条数据，确定将其删除？') ){
                        return false;
                    }
                    this.Http('modelDelete', { data: [ row ] }, function(res){
                        alert('删除成功！！');
                        that.search();
                    });
                },
                activeChange: function(row){
                    var that = this;
                    var newActive = row.Active === 1 ? 2 : 1;
                    var data = { Active: newActive, data: [ row ] };
                    that.Http('modelChangeActive', data, function(){
                        row.Active = newActive;
                        that.search();
                        alert('操作成功！');
                    });
                },
                getSelectOptions: function(){
                    var that = this;
                    that.Http('typeGetData', { Active: 1 }, function(res){
                        that.ToolArrReplace(formSelectOptions.DeviceType, res.list);
                    });
                },
                openType:function(){

                    var vdata = {
                        'header': '设备类型',
                        'href': './basic_Set/DeviceType-Vue.html',
                        'id': 'DeviceType-Vue',
                        'src':'./static/images/logpng/设备.png',
                        'refresh':true
                    };

                    window.parent.iframeHeaderSet(vdata);
                    window.callFunctionTrigger('DeviceType-Vue');
                }
            },
            events: function(){},
        });
        model.init();
    });
