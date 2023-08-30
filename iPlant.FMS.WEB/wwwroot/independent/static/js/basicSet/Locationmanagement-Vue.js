require(
    [
        '../static/utils/js/jquery-3.1.1',
        '../static/utils/js/base/base',
        '../static/utils/vue/mixins/tools',
        '../static/utils/vue/mixins/baseComponents',
    ],
    function($alfie, $com, $mixinsTools, $baseComponents){
        /* 弹框 */
  /*      var
            KEYWORD_department_Station = {},         // 查询关键字
            Formattrt_department_Station = {},            // 字段格式化对象
            KEYWORD_department_LIST_Station,            // 定义字段格式(用于表格字段转换)
            TypeSource_department_Station;            // 枚举对象(用于字段转换)

        var
            KEYWORD_department_Resource = {},        // 查询关键字
            Formattrt_department_Resource = {},       // 字段格式化对象
            KEYWORD_department_LIST_Resource,            // 定义字段格式(用于表格字段转换)
            TypeSource_department_Resource            // 枚举对象(用于字段转换)
        ;

        ( function(){
            // 下拉框数据  name-value
            TypeSource_department_Station = { AreaID: [] };
            KEYWORD_department_LIST_Station = [
                'ID|工位编号',
                'Code|工位编码*',
                'Name|工位名称*',
                'AreaID|上级区域*|ArrayOne',
                'WorkName|作业名称*',
                'EditTime|编辑时间|DateTime',
                'Remark|工位描述',
            ];
            $com.util.configBuild(
                KEYWORD_department_LIST_Station,
                KEYWORD_department_Station,
                TypeSource_department_Station,
                Formattrt_department_Station,
            );

            TypeSource_department_Resource = { Device: [] };
            KEYWORD_department_LIST_Resource = [
                'ID|资源编号',
                'Code|资源编码',
                'Name|资源名称',
                'StationCode|工位编码',
                'StationName|工位名称',
                'Device|设备名称|ArrayOne',
                'Type|类型',
                'EditTime|编辑时间|DateTime',
            ];
            $com.util.configBuild(
                KEYWORD_department_LIST_Resource,
                KEYWORD_department_Resource,
                TypeSource_department_Resource,
                Formattrt_department_Resource,
            );


        } )();*/
        var formSelectOptions = {
            AreaID: [],
            Device: [],
        };
        var formOptionsStation = [
            { label: '工位编码', value: 'Code', rules: [ 'required' ] },
            { label: '工位名称', value: 'Name', rules: [ 'required' ] },
            {
                label: '上级区域',
                value: 'AreaID',
                type: 'select',
                rules: [ 'required' ],
                options: formSelectOptions.AreaID,
            },
            { label: '作业名称', value: 'WorkName', rules: [ 'required' ] },
            { label: '工位描述', value: 'Remark', type: 'textarea' },
        ];
        var validate = {
            device: function(rule, value, callback){
                for( let item of model.data.tableDataResource ){
                    if( item.ID === value ) return callback('资源重复!');
                }
                callback();
            },
        };
        var formOptionsResource = [
            {
                label: '设备名称',
                value: 'Device',
                type: 'select',
                rules: [ 'required', { validator: validate.device, trigger: 'blur' } ],
                options: formSelectOptions.Device,
                span: 24,
            },
        ];
        //资源类型sub
        var typeString = [ '默认', '设备', '备件', '工装', '量具' ];
        // 表头
        var tableHeadStation = [
                { label: '序号', type: 'sequence' },
                { label: '工位编码', key: 'Code' },
                { label: '工位名称', key: 'Name' },
                { label: '上级区域', key: 'AreaName' },
                { label: '作业名称', key: 'WorkName' },
                { label: '工位描述', key: 'Remark' },
                { label: '创建时间', key: 'CreateTime', type: 'time' },
                { label: '编辑时间', key: 'EditTime', type: 'time' },
                { label: '状态', key: 'Active', type: 'switch', show: 'jurisdiction' },
                { label: '操作', type: 'operation', show: 'jurisdiction' },
            ],
            tableHeadResource = [
                { label: '序号', type: 'sequence' },
                { label: '资源编码', key: 'Code' },
                { label: '资源名称', key: 'Name' },
                // { label: '工位编码', key: 'StationCode' },
                // { label: '工位名称', key: 'StationName' },
                { label: '创建时间', key: 'CreateTime', type: 'time' },
                { label: '编辑时间', key: 'EditTime', type: 'time' },
                { label: '类型', key: 'Type', type: 'type' },
                { label: '状态', key: 'Active', type: 'switch', show: 'jurisdiction' },
                { label: '操作', type: 'operation', show: 'jurisdiction' },
            ]
        ;
        // 最小有效日期
        var minTime = new Date('2020-01-01 00:00:00');

        /**
         *  请求列表
         *  url: string    请求地址 - 必填
         *  type: string   请求类型 - 必填
         *  errMsg:string   错误提示 - 可填 默认值为 httpErrMsg[$TYPE]
         */
        var uriList = {
            // 工位 start
            getDataStation: { type: 'get', url: '/FMCStation/All' },
            upDateStation: { type: 'post', url: '/FMCStation/upDate' },
            changeActiveStation: { type: 'post', url: '/FMCStation/Active' },
            deleteStation: { type: 'post', url: '/FMCStation/Delete' },
            // 工位 end

            // 资源 start
            getDataResource: { type: 'get', url: '/FMCResource/All' },
            upDateResource: { type: 'post', url: '/FMCResource/upDate' },
            changeActiveResource: { type: 'post', url: '/FMCResource/Active' },
            deleteResource: { type: 'post', url: '/FMCResource/Delete' },
            // 资源 end

            // 区域列表
            getRegion: { type: 'get', url: '/BMSRegion/All' },
            // 设备列表
            getDevice: { type: 'get', url: '/DMSDeviceLedger/All' },

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


        // 搜索条件模板
        var searchTemplateStation = { Name: '', WorkAreaID: '', Active: '-1' };


        var model = $com.Model.create({
            el: '#locationmanagement-body',
            name: '工位管理',
            VueName: 'vm',
            mixins: [ $mixinsTools, $baseComponents ],
            data: {

                tableHeadStation: tableHeadStation, // 表头
                // 搜索框
                searchDataStation: $com.util.Clone(searchTemplateStation),
                tableDataStation: [], // 数据列表
                resourceData: { show: false, data: {} },     // 资源列表显示
                tableHeadResource: tableHeadResource, // 表头
                searchDataResource: { StationID: '', Active: '-1' },
                tableDataResource: [], // 数据列表

                // 下拉框数据
                selectOptions: {
                    region: [],// 区域
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
                typeString: function(e){
                    return typeString[e];
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
                this.searchStation();
                this.getselectOptions();
                this.jurisdiction = $com.app.checkRole(109000);
            },
            mounted: function(){
            },
            methods: {
                // 工位 start
                searchStation: function($event){
                    var that = this;

                    var params;
                    if( $event ){
                        params = that.searchDataStation;
                    } else{
                        params = searchTemplateStation;
                    }

                    $com.app.loading('数据加载中...');
                    http('getDataStation', params, function(res){
                        $com.app.loaded();
                        that.tableDataStation = res.list;
              /*          TypeSource_department_Station.ParentID = [];
                        res.list.forEach(function(item){
                            TypeSource_department_Station.ParentID.push({
                                name: item.Name,
                                value: item.ID,
                                far: null,
                            });
                        });*/
                    });
                },
                emptyClickStation: function(){
                    this.searchDataStation.Active = '-1';
                    this.searchDataStation.Name = '';
                    this.searchDataStation.WorkAreaID = '';
                },
                addClickStation: function(){
                    var that = this;
                    this.$refs['myPopupForm'].open({
                        title: '新增工位',
                        option: formOptionsStation,
                        confirm: function(rst){
                            if( !rst || $.isEmptyObject(rst) ){
                                return false;
                            }
                            var _data = {
                                ID: 0,
                                Name: rst.Name,
                                Code: rst.Code,
                                AreaID: rst.AreaID,
                                Active: 0,
                                Remark: rst.Remark,
                                WorkName: rst.WorkName,
                            };
                            for( var i = 0; i < that.tableDataStation.length; i++ ){
                                if( rst.Name === that.tableDataStation[i].Name ){
                                    alert('新增工位已存在！');
                                    return false;
                                }
                            }
                            $com.util.deleteLowerProperty(_data);

                            http('upDateStation', { data: _data }, function(res){
                                alert('新增成功！！');
                                that.searchStation();
                            });
                        },
                    });
                    /*var defaultValue = {
                        Name: '',
                        Code: '',
                        AreaID: 0,
                        Remark: '',
                        WorkName: '',
                        mode: 1,
                    };
                    $('body').append($com.modal.show(defaultValue, KEYWORD_department_Station, '新增工位', function (rst) {
                        //调用插入函数然后用load刷新数据源

                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }
                        var _data = {
                            ID: 0,
                            Name: rst.Name,
                            Code: rst.Code,
                            AreaID: rst.AreaID,
                            Active: 0,
                            Remark: rst.Remark,
                            WorkName: rst.WorkName,
                        };
                        for (var i = 0; i < that.tableDataStation.length; i++) {
                            if (rst.Name === that.tableDataStation[i].Name) {
                                alert('新增工位已存在！');
                                return false;
                            }
                        }
                        $com.util.deleteLowerProperty(_data);

                        http('upDateStation', {data: _data}, function (res) {
                            alert('新增成功！！');
                            that.searchStation();
                        });

                    }, TypeSource_department_Station));*/
                },
                editClickStation: function(row){
                    var that = this;
                    var newRow = $com.util.Clone(row);
                    var myPopupForm = that.$refs['myPopupForm'];

                    var AreaID=this.ToolNewSelectOptions(
                        [row.AreaID],
                        [row.AreaName],
                        formSelectOptions.AreaID,
                    );

                    var newOptions = {
                        Name: newRow.Name,
                        Code: newRow.Code,
                        AreaID: {
                            default:newRow.AreaID,
                            options: AreaID,
                        },
                        Remark: newRow.Remark,
                        WorkName: newRow.WorkName,
                    };
                    myPopupForm.open({
                        title: '修改工位信息',
                        option: myPopupForm.newOptions(newOptions, formOptionsStation),
                        confirm: function(rst){
                            if( !rst || $.isEmptyObject(rst) ){
                                return;
                            }
                            newRow.Name = rst.Name;
                            newRow.Code = rst.Code;
                            newRow.AreaID = rst.AreaID;
                            newRow.Remark = rst.Remark;
                            newRow.WorkName = rst.WorkName;

                            $com.util.deleteLowerProperty(newRow);
                            http('upDateStation', { data: newRow }, function(res){
                                alert('修改成功！！');
                                that.searchStation();
                            });
                        },
                    });
                    /*var default_value = {
                        Name: newRow.Name,
                        Code: newRow.Code,
                        AreaID: newRow.AreaID,
                        Remark: newRow.Remark,
                        WorkName: newRow.WorkName,
                    };
                    $('body').append($com.modal.show(default_value, KEYWORD_department_Station, '修改工位', function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst)) {
                            return;
                        }
                        newRow.Name = rst.Name;
                        newRow.Code = rst.Code;
                        newRow.AreaID = rst.AreaID;
                        newRow.Remark = rst.Remark;
                        newRow.WorkName = rst.WorkName;

                        $com.util.deleteLowerProperty(newRow);
                        http('upDateStation', {data: newRow}, function (res) {
                            alert('修改成功！！');
                            that.searchStation();
                        });
                    }, TypeSource_department_Station));*/
                },
                removeClickStation: function(row){
                    var that = this;
                    if( row.Active !== 0 ){
                        return false;
                    }
                    if( !confirm('已选择1条数据，确定将其删除？') ){
                        return false;
                    }

                    http('deleteStation', { data: [ row ] }, function(res){
                        alert('删除成功！！');
                        that.searchStation();
                    });
                },
                activeChangeStation: function(row){
                    var that = this;
                    var newActive = row.Active === 1 ? 2 : 1;
                    var data = {
                        Active: newActive,
                        data: [ row ],
                    };
                    http('changeActiveStation', data, function(){
                        row.Active = newActive;
                        that.searchStation();
                        alert('操作成功！');
                    });
                },
                // 工位 end

                // 资源 start
                searchResource: function(row){
                    var that = this;

                    // 工位页面至此
                    if( row ){
                        that.resourceData.show = true;
                        that.resourceData.data = row;
                        that.searchDataResource.StationID = row.ID;
                    }

                    var params = $com.util.Clone(that.searchDataResource);

                    // 传入false查询全部
                    if( row === false ) params.Active = -1;

                    $com.app.loading('数据加载中...');
                    http('getDataResource', params, function(res){
                        $com.app.loaded();
                        that.tableDataResource = res.list;
                    });
                },
                emptyClickResource: function(){
                    this.searchDataResource.Active = '-1';
                },
                addClickResource: function(){
                    var that = this;
                    var newOptions = {
                        Device: {
                            options: formSelectOptions.Device.filter(function(device){
                                for( let item of that.tableDataResource ){
                                    if( item.ResourceID === device.ID ) return false;
                                }
                                return true;
                            }),
                        },
                    };
                    this.$refs['myPopupForm'].open({
                        title: '新增资源',
                        option: that.$refs['myPopupForm'].newOptions(newOptions, formOptionsResource),
                        confirm: function(rst){
                            if( !rst || $.isEmptyObject(rst) ){
                                return false;
                            }
                            var _data = {
                                ResourceID: Number(rst.Device),
                                StationID: that.resourceData.data.ID,
                                Type: 1,
                            };
                            for( var i = 0; i < that.tableDataResource.length; i++ ){
                                if( rst.Name === that.tableDataResource[i].Name ){
                                    alert('新增资源已存在！');
                                    return false;
                                }
                            }
                            $com.util.deleteLowerProperty(_data);

                            http('upDateResource', { data: _data }, function(res){
                                alert('新增成功！！');
                                that.searchResource(false);
                            });
                        },
                    });
                    /*var defaultValue = {
                        StationID: 0,
                        Device: 0,
                        mode: 1,
                    };
                    var newTypeSource = $com.util.Clone(TypeSource_department_Resource);
                    var arr =that.tableDataResource.forEach(item => {
                            newTypeSource.Device = newTypeSource.Device.filter(items => items.value != item.ResourceID);
                        });
                    $('body').append($com.modal.show(defaultValue, KEYWORD_department_Resource, '新增资源', function (rst) {
                        //调用插入函数然后用load刷新数据源
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }
                        var _data = {
                            ResourceID: Number(rst.Device),
                            StationID: that.resourceData.data.ID,
                            Type: 1,
                        };
                        for (var i = 0; i < that.tableDataResource.length; i++) {
                            if (rst.Name === that.tableDataResource[i].Name) {
                                alert('新增资源已存在！');
                                return false;
                            }
                        }
                        $com.util.deleteLowerProperty(_data);

                        http('upDateResource', {data: _data}, function (res) {
                            alert('新增成功！！');
                            that.searchResource(false);
                        });

                    }, newTypeSource));*/
                },
                removeClickResource: function(row){
                    var that = this;
                    if( row.Active !== 0 ){
                        return false;
                    }
                    if( !confirm('已选择1条数据，确定将其删除？') ){
                        return false;
                    }

                    http('deleteResource', { data: [ row ] }, function(res){
                        alert('删除成功！！');
                        that.searchResource(false);
                    });
                },
                activeChangeResource: function(row){
                    var that = this;
                    var newActive = row.Active === 1 ? 2 : 1;
                    var data = {
                        Active: newActive,
                        data: [ row ],
                    };
                    http('changeActiveResource', data, function(){
                        row.Active = newActive;
                        that.searchResource(false);
                        alert('操作成功！');
                    });
                },
                // 资源 end

                getselectOptions: function(){
                    var that = this;
                    http('getRegion', { active: 1 }, function(res){
                        vm.ToolArrReplace(formSelectOptions.AreaID, res.list);
                        vm.selectOptions.region = res.list;
                        /*TypeSource_department_Station.AreaID = [];
                        res.list.forEach(function (item) {
                            TypeSource_department_Station.AreaID.push({
                                name: item.Name,
                                value: item.ID,
                                far: null,
                            });
                        });*/
                    });
                    http('getDevice', { active: 1 }, function(res){
                        vm.ToolArrReplace(formSelectOptions.Device, res.list);
                        /*res.list.forEach(function (item) {
                            TypeSource_department_Resource.Device.push({
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
