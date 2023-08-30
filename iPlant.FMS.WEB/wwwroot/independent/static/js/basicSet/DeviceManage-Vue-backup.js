require(
    [
        '../static/utils/js/jquery-3.1.1',
        '../static/utils/js/base/paging',
        '../static/utils/js/base/base',
        '../static/utils/vue/mixins/tools',
        '../static/utils/vue/mixins/baseComponents',
    ],
    function($alfie, $page, $com, $mixinsTools, $baseComponents){

        /*
             // 台账
             var Formattrt_Ledger;
             var KEYWORD_Ledger;
             var KEYWORD_Ledger_LIST;
             var TypeSource_Ledger;
             // 类型
             var Formattrt_type;
             var KEYWORD_type;
             var KEYWORD_type_LIST;
             var TypeSource_type;
             // 型号
             var Formattrt_model;
             var KEYWORD_model;
             var KEYWORD_model_LIST;
             var TypeSource_model;
             // 字典
             var Formattrt_Dictionary;
             var KEYWORD_Dictionary;
             var KEYWORD_Dictionary_LIST;
             var TypeSource_Dictionary;
             // 台账
             ( function(){
                 KEYWORD_Ledger_LIST = [
                     'Name|设备名称*',
                     'Code|设备编码*',
                     'AssetNo|采集编号',
                     'ModelID|设备型号*|ArrayOne',
                     'AreaID|所在区域*|ArrayOne',
                     'DeviceIP|IP地址',
                     'AcceptanceDate|验收日期|Date',
                     'SupplierCode|供应商编码',
                     'SupplierContactInfo|供应商电话',
                     'SupplierName|供应商名称',
                     'MaintainerIDList|维护人员|Array',
                     'Remark|描述',
                     'ImageIcon|设备图片|File',

                 ];
                 KEYWORD_Ledger = {};
                 Formattrt_Ledger = {};
                 TypeSource_Ledger = {
                     ModelID: [],
                     AreaID: [],
                     MaintainerIDList: [],
                 };

                 $com.util.configBuild(KEYWORD_Ledger_LIST, KEYWORD_Ledger, TypeSource_Ledger, Formattrt_Ledger);

             } )();
             // 类型
             ( function(){
                 KEYWORD_type_LIST = [
                     'ID|设备类型编号',
                     'Name|设备类型名称*',
                     'Remark|设备类型描述',
                 ];


                 KEYWORD_type = {};
                 Formattrt_type = {};
                 TypeSource_type = {};

                 $com.util.configBuild(KEYWORD_type_LIST, KEYWORD_type, TypeSource_type, Formattrt_type);
             } )();
             // 型号
             ( function(){
                 KEYWORD_model_LIST = [
                     'Name|设备型号名称*',
                     'DeviceType|设备类型*|ArrayOne',
                     'Remark|设备型号描述',
                 ];


                 KEYWORD_model = {};
                 Formattrt_model = {};
                 TypeSource_model = {
                     DeviceType: [],
                 };

                 $com.util.configBuild(KEYWORD_model_LIST, KEYWORD_model, TypeSource_model, Formattrt_model);
             } )();
             // 字典
             ( function(){
                 KEYWORD_Dictionary_LIST = [
                     'Code|参数代码',
                     'Name|参数名称*',
                     'AnalysisOrder|状态顺序',
                     'DeviceName|设备名称',
                     'Protocol|通信方式',
                     'VariableName|变量名称*',
                     'DataType|数据类型*|ArrayOne',
                     'DataLength|长度',
                     'OPCClass|OPC参数名',
                     'KeyChar|字符主键',
                     'AuxiliaryChar|字符辅键',
                     'DataClass|数据分类*|ArrayOne',
                     'ParameterDesc|参数描述',
                 ];
                 KEYWORD_Dictionary = {};
                 Formattrt_Dictionary = {};
                 TypeSource_Dictionary = {
                     DataType: [ {
                         name: '默认',
                         value: 0,
                     }, {
                         name: 'bool',
                         value: 1,
                     }, {
                         name: 'int',
                         value: 2,
                     }, {
                         name: 'string',
                         value: 3,
                     }, {
                         name: 'float',
                         value: 4,
                     }, {
                         name: 'double',
                         value: 5,
                     } ],
                     DataClass: [ {
                         name: '默认',
                         value: 0,
                     }, {
                         name: '状态',
                         value: 1,
                     }, {
                         name: '报警',
                         value: 2,
                     }, {
                         name: '参数',
                         value: 3,
                     } ],
                 };


                 $com.util.configBuild(KEYWORD_Dictionary_LIST, KEYWORD_Dictionary, TypeSource_Dictionary, Formattrt_Dictionary);
             } )();*/

        var formSelectOptions = {
            ModelID: [],
            AreaID: [],
            MaintainerIDList: [],
            DeviceType: [],
        };

        var formOptionsLedger = [
            { label: '设备名称', value: 'Name', rules: [ 'required' ] },
            { label: '设备编码', value: 'Code', rules: [ 'required' ] },
            { label: '采集编号', value: 'AssetNo' },
            {
                label: '设备型号', value: 'ModelID', type: 'select', rules: [ 'required' ],
                clearable: true, options: formSelectOptions.ModelID,
            },
            {
                label: '所在区域', value: 'AreaID', type: 'select', rules: [ 'required' ],
                clearable: true, options: formSelectOptions.AreaID,
            },
            { label: 'IP地址', value: 'DeviceIP' },
            { label: '验收日期', value: 'AcceptanceDate', type: 'date' },
            { label: '供应商编码', value: 'SupplierCode' },
            { label: '供应商名称', value: 'SupplierName' },
            {
                label: '维护人员', value: 'MaintainerIDList', type: 'select',
                clearable: true, multiple: true,
                options: formSelectOptions.MaintainerIDList,
            },
            { label: '描述', value: 'Remark', type: 'textarea' },
            { label: '设备图片', value: 'ImageIcon', type: 'file-img', limit: 1 },
        ];

        var formOptionsType = [
            // { label: '设备类型编号', value: 'ID' },
            { label: '设备类型名称', value: 'Name', rules: [ 'required' ], span: 24 },
            { label: '设备类型描述', value: 'Remark', type: 'textarea' },
        ];

        // 'ID|设备类型编号',
        // 'Name|设备类型名称*',
        // 'Remark|设备类型描述',

        var formOptionsModel = [
            { label: '设备型号名称', value: 'Name', rules: [ 'required' ] },
            {
                label: '设备类型', value: 'DeviceType', type: 'select', rules: [ 'required' ],
                options: formSelectOptions.DeviceType,
            },
            { label: '设备型号描述', value: 'Remark', type: 'textarea' },
        ];

        var formOptionsDic = [
            { label: '参数名称', value: 'Name', rules: [ 'required' ] },
            { label: '状态顺序', value: 'AnalysisOrder', type: 'number' },
            { label: '通信方式', value: 'Protocol' },
            { label: '变量名称', value: 'VariableName', rules: [ 'required' ] },
            {
                label: '数据类型',
                value: 'DataType',
                type: 'select',
                rules: [ 'required' ],
                options: [
                    {
                        Name: '默认',
                        ID: 0,
                    }, {
                        Name: 'bool',
                        ID: 1,
                    }, {
                        Name: 'int',
                        ID: 2,
                    }, {
                        Name: 'string',
                        ID: 3,
                    }, {
                        Name: 'float',
                        ID: 4,
                    }, {
                        Name: 'double',
                        ID: 5,
                    },
                ],
            },
            { label: '长度', value: 'DataLength', type: 'number' },
            { label: 'OPC参数名', value: 'OPCClass' },
            { label: '字符主键', value: 'KeyChar' },
            { label: '字符辅键', value: 'AuxiliaryChar' },
            {
                label: '数据分类',
                value: 'DataClass',
                rules: [ 'required' ],
                type: 'select',
                options: [
                    {
                        Name: '默认',
                        ID: 0,
                    }, {
                        Name: '状态',
                        ID: 1,
                    }, {
                        Name: '报警',
                        ID: 2,
                    }, {
                        Name: '参数',
                        ID: 3,
                    },
                ],
            },
            { label: '参数描述', value: 'ParameterDesc', type: 'textarea' },
        ];
        // 表头
        var tableHead = {
            ledger: [
                { label: '序号', type: 'sequence', width: 50 },
                { label: '采集编号', key: 'AssetNo', width: 80 },
                { label: '编码', key: 'Code', width: 60 },
                { label: '名称', key: 'Name' },
                { label: '设备型号', key: 'ModelName' },
                { label: '设备类型名称', key: 'DeviceTypeName', width: 120 },
                { label: '所在区域', key: 'PositionText', width: 200 },
                { label: 'IP地址', key: 'DeviceIP' },
                { label: '维护日期', key: 'MaintainDate', type: 'time' },
                { label: '维护人员', key: 'MaintainerName' },
                { label: '设备图片', key: 'ImageIcon', type: 'image' },
                { label: '描述', key: 'Remark' },
                { label: '验收日期', key: 'AcceptanceDate', type: 'time' },
                { label: '供应商编码', key: 'SupplierCode' },
                { label: '供应商电话', key: 'SupplierContactInfo' },
                { label: '供应商名称', key: 'SupplierName' },
                { label: '状态', key: 'Active', type: 'switch', show: 'jurisdiction' },
                { label: '操作', type: 'operation-ledger', show: 'jurisdiction', operation: 'true', width: 150 },
            ],
            model: [
                { label: '序号', type: 'sequence' },
                { label: '编码', key: 'Code' },
                { label: '名称', key: 'Name' },
                { label: '所属类型', key: 'DeviceTypeName' },
                { label: '申请人', key: 'OperatorName' },
                { label: '描述', key: 'Remark' },
                { label: '申请时间', key: 'OperateTime', type: 'time' },
                { label: '状态', key: 'Active', type: 'switch', show: 'jurisdiction' },
                { label: '操作', type: 'operation', show: 'jurisdiction' },
            ],
            type: [
                { label: '序号', type: 'sequence' },
                { label: '编码', key: 'Code' },
                { label: '名称', key: 'Name' },
                { label: '申请人', key: 'OperatorName' },
                { label: '描述', key: 'Remark' },
                { label: '申请时间', key: 'OperateTime', type: 'time' },
                { label: '状态', key: 'Active', type: 'switch', show: 'jurisdiction' },
                { label: '操作', type: 'operation', show: 'jurisdiction' },
            ],
            dict: [
                { label: '序号', type: 'sequence' },
                { label: '设备名称', key: 'DeviceName' },
                { label: '设备编码', key: 'DeviceNo' },
                { label: '通信方式', key: 'Protocol' },
                { label: '变量名称', key: 'VariableName' },
                { label: '参数代码', key: 'Code' },
                { label: '参数名称', key: 'Name' },
                { label: '状态顺序', key: 'AnalysisOrder' },
                { label: '数据类型', key: 'DataTypeText' },
                { label: '长度', key: 'DataLength' },
                { label: 'OPC参数名', key: 'OPCClass' },
                { label: '字符主键', key: 'KeyChar' },
                { label: '字符辅键', key: 'AuxiliaryChar' },
                { label: '数据分类', key: 'DataClassText' },
                { label: '备注', key: 'ParameterDesc' },
                { label: '状态', key: 'Active', type: 'switch', show: 'jurisdiction' },
                { label: '操作', type: 'operation', show: 'jurisdiction' },
            ],
        };
        // 最小有效日期
        var minTime = new Date('2020-01-01 00:00:00');

        // 导出/导出数据字典时需要的参数
        var excelParams = {
            fileName: '数据字典.xls',
            title: '数据字典',
            head: {
                'ID': '序号',
                'DeviceName': '设备名称',
                'DeviceNo': '设备编码',
                'Protocol': '通信方式',
                'VariableName': '变量名称',
                'Code': '参数代码',
                'Name': '参数名称',
                'AnalysisOrder': '状态顺序',
                'DataTypeText': '数据类型',
                'DataLength': '长度',
                'OPCClass': 'OPC参数名',
                'KeyChar': '字符主键',
                'AuxiliaryChar': '字符辅键',
                'DataClassText': '数据分类',
                'ParameterDesc': '备注',
                'Active': '状态',
                'Operate': '操作',
            },
            order: [
                'ID',
                'DeviceName',
                'DeviceNo',
                'Protocol',
                'VariableName',
                'Code',
                'Name',
                'AnalysisOrder',
                'DataTypeText',
                'DataLength',
                'OPCClass',
                'KeyChar',
                'AuxiliaryChar',
                'DataClassText',
                'ParameterDesc',
                'Active',
                'Operate',
            ],
            AssetNoString: '',
        };
        var rowData ={}

        /**
         *  请求列表
         *  url: string    请求地址 - 必填
         *  type: string   请求类型 - 必填
         *  errMsg:string   错误提示 - 可填 默认值为 httpErrMsg[$TYPE]
         */
        var uriList = {
            // 台账
            ledgerGetData: { type: 'get', url: '/DMSDeviceLedger/All' },
            ledgerUpdate: { type: 'post', url: '/DMSDeviceLedger/Update' },
            ledgerChangeActive: { type: 'post', url: '/DMSDeviceLedger/Active' },
            ledgerDelete: { type: 'post', url: '/DMSDeviceLedger/Delete' },
            // 型号
            modelGetData: { type: 'get', url: '/DMSDeviceModel/All' },
            modelUpdate: { type: 'post', url: '/DMSDeviceModel/Update' },
            modelChangeActive: { type: 'post', url: '/DMSDeviceModel/Active' },
            modelDelete: { type: 'post', url: '/DMSDeviceModel/Delete' },
            // 类型
            typeGetData: { type: 'get', url: '/DMSDeviceType/All' },
            typeUpdate: { type: 'post', url: '/DMSDeviceType/Update' },
            typeChangeActive: { type: 'post', url: '/DMSDeviceType/Active' },
            typeDelete: { type: 'post', url: '/DMSDeviceType/Delete' },
            // 字典
            dictGetData: { type: 'get', url: '/DMSDeviceParameter/All' },
            dictUpdate: { type: 'post', url: '/DMSDeviceParameter/Update' },
            dictChangeActive: { type: 'post', url: '/DMSDeviceParameter/Active' },
            dictDelete: { type: 'post', url: '/DMSDeviceParameter/Delete' },

            // select
            getBMSRegion: { type: 'get', url: '/BMSRegion/All' },// 区域列表
            getUser: { type: 'get', url: '/User/All' },// 人员列表

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
        // 获取table数据的请求
        /*      var getDataUrl = {
                  ledger: '/DMSDeviceLedger/All',
                  model: '/DMSDeviceModel/All',
                  type: '/DMSDeviceType/All',
                  dict: '/DMSDeviceParameter/All',
              };*/

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

            return $com.app.ajax($.extend(d, data), fn, err, context);
        }

        var searchTemplate = {
            ledger: { Name: '', DeviceType: '', ModelID: '', AreaID: '', Active: '-1' },
            model: { Name: '', Active: '-1' },
            type: { Name: '', Active: '-1' },
            dict: { DeviceID: '', DataType: '', DataClass: '1', Name: '', Active: '1' },
        };

        var model = $com.Model.create({
            el: '#deviceManage-body',
            name: '设备台账',
            VueName: 'vm',
            mixins: [ $mixinsTools, $baseComponents ],
            data: {
                // 台账ledger  型号model  类型type  数据字典dict
                status: 'ledger',
                // 搜索框
                searchData: {
                    ledger: $com.util.Clone(searchTemplate.ledger),
                    model: $com.util.Clone(searchTemplate.model),
                    type: $com.util.Clone(searchTemplate.type),
                    dict: $com.util.Clone(searchTemplate.dict),

                    /*
                     ledger: { Name: '', DeviceType: '', ModelID: '', AreaID: '', Active: '-1' },
                     model: { Name: '', Active: '-1' },
                     type: { Name: '', Active: '-1' },
                     dict: { DeviceID: '', DataType: '', DataClass: '1', Name: '', Active: '1' },
                    */
                },
                selectOptions: {
                    DeviceType: [],
                    ModelID: [],
                    AreaID: [],
                },
                // 数据列表
                tableDataAll: { ledger: [], model: [], type: [], dict: [] },
                //用户权限
                jurisdiction: false,
            },
            computed: {
                tableHead: function(){
                    return tableHead[this.status];
                },
                tableData: function(){
                    return this.tableDataAll[this.status];
                },
                // 搜索栏设备类型过滤
                modelListFilter: function(){
                    var modelList = this.selectOptions.ModelID;
                    var typeID = this.searchData.ledger.DeviceType;

                    if( typeID ){
                        if( this.backupTypeID !== typeID ){
                            this.backupTypeID = typeID;
                            this.searchData.ledger.ModelID = '';
                        }
                        return modelList.filter(function(item){
                            return item.DeviceType === typeID;
                        });
                    }
                    return modelList;
                },
            },
            filters: {
                // 激活状态
                switchStatus: function(e){
                    // 0-从未激活 1-激活 2-关闭
                    return e === 1;
                },
                // title Str
                statusStr: function(e){
                    switch( e ){
                        case 'ledger':
                            return '设备台账';
                        case 'type':
                            return '设备类型';
                        case 'model':
                            return '设备型号';
                    }
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
            watch: {
                status: function(){
                    this.search();
                },
            },
            created: function(){
                this.search();
                this.getSelectOptions('created');
                this.jurisdiction = $com.app.checkRole(102000);
            },
            mounted: function(){

            },
            methods: {
                // 查询 (首次查询通过computed-tableData自动触发)
                search: function($event){
                    /*var that = this,
                        params,
                        data = this.tableDataAll[this.status]
                    ;

                    if( $event ){
                        params = that.searchData[that.status];
                    } else{
                        params = searchTemplate[that.status];
                    }

                    var options = {
                        $URI: getDataUrl[that.status],
                        $SERVER: '/iPlantSCADA',
                        $TYPE: 'Get',
                        PageCountProp: 'info',   //   服务器返回总页数的属性名称
                        DataListProp: 'list',    //  服务器返回数据列表的属性名称
                        PageSize: 10,
                    };
                    for( let key in params ){
                        options[key] = params[key];
                    }

                    $page.init($('.fzy-table'), null, options, function(res){
                        data.splice(0, data.length);
                        res.forEach(function(item){
                            data.push(item);
                        });
                        that.getSelectOptions(that.status);
                        $com.app.loaded();
                    });*/

                    var
                        that = this,
                        url = that.status + 'GetData',
                        params,
                        data = this.tableDataAll[this.status]
                    ;
                    if( $event ){
                        params = that.searchData[that.status];
                    } else{
                        params = searchTemplate[that.status];
                    }
                    $com.app.loading('数据加载中...');


                    http(url, params, function(res){
                        data.splice(0, data.length);
                        res.list.forEach(function(item){
                            data.push(item);
                        });
                        that.getSelectOptions(that.status);
                        $com.app.loaded();
                    });
                },
                // 清空
                emptyClick: function(){

                    var data = this.searchData[this.status];
                    if( this.status === 'dict' ){
                        data.DataType = '';
                        data.Name = '';
                        data.DataClass = '1';
                        data.Active = '1';
                    } else{
                        for( var key in data ){
                            data[key] = '';
                        }
                        data.Active = '-1';
                    }

                },
                // 添加事件  通过status分发任务
                addClick: function(){
                    this[this.status + 'Add']();
                },
                ledgerAdd: function(){

                    var that = this;

                    this.$refs['myPopupForm'].open({
                        title: '新增设备台帐',
                        option: formOptionsLedger,
                        confirm: function(rst){
                            if( !rst || $.isEmptyObject(rst) ){
                                return false;
                            }
                            var _data = {
                                ID: 0,
                                Name: rst.Name,
                                Code: rst.Code,
                                AssetNo: rst.AssetNo,
                                Active: 0,
                                Remark: rst.Remark,
                                AreaID: rst.AreaID,
                                PositionText: rst.PositionText,
                                DeviceIP: rst.DeviceIP,
                                MaintainerIDList: rst.MaintainerIDList,
                                AcceptanceDate: rst.AcceptanceDate,
                                SupplierCode: rst.SupplierCode,
                                SupplierContactInfo: rst.SupplierContactInfo,
                                SupplierName: rst.SupplierName,
                                ModelID: Number(rst.ModelID),
                                ImageIcon: rst.ImageIcon[0],
                            };
                            $com.util.deleteLowerProperty(_data);
                            http('ledgerUpdate', { data: _data }, function(res){
                                alert('新增成功！！');
                                that.search();
                            });
                        },
                    });

                    /*
                    var that = this;
                    var DEFAULT_VALUE_D = {
                        Name: '',
                        Code: '',
                        AssetNo: '',
                        ModelID: 0,
                        AreaID: 0,
                        DeviceIP: '',
                        PositionText: '',
                        MaintainerIDList: 0,
                        AcceptanceDate: new Date(),
                        SupplierCode: '',
                        SupplierContactInfo: '',
                        SupplierName: '',
                        Remark: '',
                        ImageIcon: '',
                    };
                    $('body').append($com.modal.show(DEFAULT_VALUE_D, KEYWORD_Ledger, '新增设备台帐', function (rst) {
                        //调用插入函数然后用load刷新数据源

                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }
                        var _data = {
                            ID: 0,
                            Name: rst.Name,
                            Code: rst.Code,
                            AssetNo: rst.AssetNo,
                            Active: 0,
                            Remark: rst.Remark,
                            AreaID: rst.AreaID,
                            PositionText: rst.PositionText,
                            DeviceIP: rst.DeviceIP,
                            MaintainerIDList: rst.MaintainerIDList,
                            AcceptanceDate: rst.AcceptanceDate,
                            SupplierCode: rst.SupplierCode,
                            SupplierContactInfo: rst.SupplierContactInfo,
                            SupplierName: rst.SupplierName,
                            ModelID: Number(rst.ModelID),
                            ImageIcon: rst.ImageIcon,
                        };
                    $com.util.deleteLowerProperty(_data);

                    http('ledgerUpdate', {data: _data}, function (res) {
                        alert('新增成功！！');
                        that.search();
                    });
                }, TypeSource_Ledger));
*/
                },
                typeAdd: function(){
                    var that = this;
                    this.$refs['myPopupForm'].open({
                        title: '新增设备类型',
                        option: formOptionsType,
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
                            var mData = that.tableDataAll[that.status];
                            for( var i = 0; i < mData.length; i++ ){
                                if( rst.Name == mData[i].Name ){
                                    alert('新增设备类型已存在！');
                                    return false;
                                }
                            }
                            $com.util.deleteLowerProperty(_data);

                            http('typeUpdate', { data: _data }, function(res){
                                alert('新增成功！！');
                                that.search();
                            });
                        },
                    });

                    /*               var that = this;
                                   var DEFAULT_VALUE_D = {
                                       Name: '',
                                       Remark: '',
                                   };
                                   $('body').append($com.modal.show(DEFAULT_VALUE_D, KEYWORD_type, '新增设备类型', function(rst){
                                       //调用插入函数然后用load刷新数据源

                                       if( !rst || $.isEmptyObject(rst) ){
                                           return false;
                                       }
                                       var _data = {
                                           ID: 0,
                                           Name: rst.Name,
                                           Active: 0,
                                           Remark: rst.Remark,
                                       };
                                       var mData = that.tableDataAll[that.status];
                                       for( var i = 0; i < mData.length; i++ ){
                                           if( rst.Name == mData[i].Name ){
                                               alert('新增设备类型已存在！');
                                               return false;
                                           }
                                       }
                                       $com.util.deleteLowerProperty(_data);

                                       http('typeUpdate', { data: _data }, function(res){
                                           alert('新增成功！！');
                                           that.search();
                                       });
                                   }, TypeSource_type));*/
                },
                modelAdd: function(){
                    var that = this;
                    that.$refs['myPopupForm'].open({
                        title: '新增设备型号',
                        option: formOptionsModel,
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
                            var mData = that.tableDataAll[that.status];
                            for( var i = 0; i < mData.length; i++ ){
                                if( rst.Name === mData[i].Name ){
                                    alert('新增设备型号已存在！');
                                    return false;
                                }
                            }
                            $com.util.deleteLowerProperty(_data);
                            http('modelUpdate', { data: _data }, function(res){
                                alert('新增成功！！');
                                that.search();
                            });
                        },
                    });
                    /*                    var DEFAULT_VALUE_D = {
                                            Name: '',
                                            Remark: '',
                                            DeviceType: 0,
                                        };
                                        $('body').append($com.modal.show(DEFAULT_VALUE_D, KEYWORD_model, '新增设备型号', function(rst){
                                            //调用插入函数然后用load刷新数据源

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
                                            var mData = that.tableDataAll[that.status];
                                            for( var i = 0; i < mData.length; i++ ){
                                                if( rst.Name == mData[i].Name ){
                                                    alert('新增设备型号已存在！');
                                                    return false;
                                                }
                                            }
                                            $com.util.deleteLowerProperty(_data);

                                            http('modelUpdate', { data: _data }, function(res){
                                                alert('新增成功！！');
                                                that.search();
                                            });
                                        }, TypeSource_model));*/
                },
                dictAdd: function(){
                    var that = this;
                    that.$refs['myPopupForm'].open({
                        title: '新增设备参数',
                        option: formOptionsDic,
                        confirm: function(rst){
                            console.log(rst);
                            if( !rst || $.isEmptyObject(rst) ){
                                return false;
                            }

                            var _data = {
                                ID: 0,
                                Name: rst.Name,
                                DeviceID: that.searchData.dict.DeviceID,
                                Protocol: rst.Protocol,
                                VariableName: rst.VariableName,
                                Active: 0,
                                DataLength: rst.DataLength,
                                OPCClass: rst.OPCClass,
                                KeyChar: rst.KeyChar,
                                ParameterDesc: rst.ParameterDesc,
                                AuxiliaryChar: rst.AuxiliaryChar,
                                DataClass: Number(rst.DataClass || 0),
                                DataType: Number(rst.DataType || 0),
                                AnalysisOrder: Number(rst.AnalysisOrder || 0),
                            };
                            var mData = that.tableDataAll[that.status];
                            for( var i = 0; i < mData.length; i++ ){
                                if( rst.Name == mData[i].Name ){
                                    alert('新增参数已存在！');
                                    return false;
                                }
                            }
                            $com.util.deleteLowerProperty(_data);
                            http('dictUpdate', { data: _data }, function(res){
                                alert('新增成功！！');
                                that.search();
                            });
                        },
                    });
                    /*     var DEFAULT_VALUE_D = {
                             Name: '',
                             Protocol: '',
                             VariableName: '',
                             DataType: '',
                             DataLength: 0,
                             OPCClass: '',
                             KeyChar: '',
                             AuxiliaryChar: '',
                             DataClass: 0,
                             ParameterDesc: '',
                             AnalysisOrder: 0,
                         };
                         $('body').append($com.modal.show(DEFAULT_VALUE_D, KEYWORD_Dictionary, '新增设备参数', function(rst){
                             console.log(rst);
                             if( !rst || $.isEmptyObject(rst) ){
                                 return false;
                             }
                             var _data = {
                                 ID: 0,
                                 Name: rst.Name,
                                 DeviceID: that.searchData.dict.DeviceID,
                                 Protocol: rst.Protocol,
                                 VariableName: rst.VariableName,
                                 Active: 0,
                                 DataLength: rst.DataLength,
                                 OPCClass: rst.OPCClass,
                                 KeyChar: rst.KeyChar,
                                 ParameterDesc: rst.ParameterDesc,
                                 AuxiliaryChar: rst.AuxiliaryChar,
                                 DataClass: Number(rst.DataClass),
                                 DataType: Number(rst.DataType),
                                 AnalysisOrder: Number(rst.AnalysisOrder),
                             };
                             var mData = that.tableDataAll[that.status];
                             for( var i = 0; i < mData.length; i++ ){
                                 if( rst.Name == mData[i].Name ){
                                     alert('新增参数已存在！');
                                     return false;
                                 }
                             }
                             $com.util.deleteLowerProperty(_data);

                             http('dictUpdate', { data: _data }, function(res){
                                 alert('新增成功！！');
                                 that.search();
                             });
                         }, TypeSource_Dictionary));*/
                },
                // 编辑事件  通过status分发任务
                editClick: function(row){
                    this[this.status + 'Edit']($com.util.Clone(row));
                },
                ledgerEdit: function(row){
                    var that = this;
                    var myPopupForm = that.$refs['myPopupForm'];
                    var newOptions = {
                        Name: row.Name,
                        Code: row.Code,
                        AssetNo: row.AssetNo,
                        ModelID: row.ModelID,
                        AreaID: row.AreaID,
                        DeviceIP: row.DeviceIP,
                        AcceptanceDate: row.AcceptanceDate,
                        Name: row.Name,
                        SupplierCode: row.SupplierCode,
                        SupplierName: row.SupplierName,
                        MaintainerIDList: row.MaintainerIDList,
                        Remark: row.Remark,
                        ImageIcon: row.ImageIcon ? [ { url: row.ImageIcon } ] : [],
                    };
                    myPopupForm.open({
                        title: '修改设备台帐(' + row.Name + ')',
                        option: myPopupForm.newOptions(newOptions, formOptionsLedger),
                        confirm: function(rst){
                            //调用修改函数
                            if( !rst || $.isEmptyObject(rst) ){
                                return;
                            }
                            row.Name = rst.Name;
                            row.Code = rst.Code;
                            row.AssetNo = rst.AssetNo;
                            row.ModelID = Number(rst.ModelID);
                            row.DeviceIP = rst.DeviceIP;
                            row.AreaID = rst.AreaID;
                            row.MaintainerIDList = rst.MaintainerIDList;
                            row.AcceptanceDate = rst.AcceptanceDate;
                            row.SupplierCode = rst.SupplierCode;
                            row.SupplierContactInfo = rst.SupplierContactInfo;
                            row.SupplierName = rst.SupplierName;
                            row.Remark = rst.Remark;
                            row.ImageIcon = rst.ImageIcon[0];
                            $com.util.deleteLowerProperty(row);
                            http('ledgerUpdate', { data: row }, function(res){
                                alert('修改成功！！');
                                that.search();
                            });
                        },
                    });

                    /*             var that = this;
                                 var default_value = {
                                     Name: row.Name,
                                     Code: row.Code,
                                     AssetNo: row.AssetNo,
                                     ModelID: row.ModelID,
                                     DeviceIP: row.DeviceIP,
                                     AreaID: row.AreaID,
                                     MaintainerIDList: row.MaintainerIDList,
                                     AcceptanceDate: row.AcceptanceDate,
                                     SupplierCode: row.SupplierCode,
                                     SupplierContactInfo: row.SupplierContactInfo,
                                     SupplierName: row.SupplierName,
                                     Remark: row.Remark,
                                     ImageIcon: row.ImageIcon,
                                 };
                                 $('body').append($com.modal.show(default_value, KEYWORD_Ledger, '修改', function(rst){
                                     //调用修改函数
                                     if( !rst || $.isEmptyObject(rst) ){
                                         return;
                                     }
                                     row.Name = rst.Name;
                                     row.Code = rst.Code;
                                     row.AssetNo = rst.AssetNo;
                                     row.ModelID = Number(rst.ModelID);
                                     row.DeviceIP = rst.DeviceIP;
                                     row.AreaID = rst.AreaID;
                                     row.MaintainerIDList = rst.MaintainerIDList;
                                     row.AcceptanceDate = rst.AcceptanceDate;
                                     row.SupplierCode = rst.SupplierCode;
                                     row.SupplierContactInfo = rst.SupplierContactInfo;
                                     row.SupplierName = rst.SupplierName;
                                     row.Remark = rst.Remark;
                                     row.ImageIcon = rst.ImageIcon;
                                     $com.util.deleteLowerProperty(row);
                                     http('ledgerUpdate', { data: row }, function(res){
                                         alert('修改成功！！');
                                         that.search();
                                     });

                                 }, TypeSource_Ledger));*/
                },
                typeEdit: function(row){

                    var that = this;
                    var myPopupForm = that.$refs['myPopupForm'];
                    var newOptions = {
                        Name: row.Name,
                        Remark: row.Remark,
                    };
                    myPopupForm.open({
                        title: '编辑设备类型',
                        option: myPopupForm.newOptions(newOptions, formOptionsType),
                        confirm: function(rst){
                            //调用修改函数
                            if( !rst || $.isEmptyObject(rst) ){
                                return;
                            }
                            row.Name = rst.Name;
                            row.Remark = rst.Remark;

                            http('typeUpdate', { data: row }, function(res){
                                alert('修改成功！！');
                                that.search();
                            });
                        },
                    });

                    /*     var that = this;
                         var default_value = {
                             Name: row.Name,
                             Remark: row.Remark,
                         };
                         $('body').append($com.modal.show(default_value, KEYWORD_type, '修改', function(rst){
                             //调用修改函数
                             if( !rst || $.isEmptyObject(rst) ){
                                 return;
                             }
                             row.Name = rst.Name;
                             row.Remark = rst.Remark;

                             http('typeUpdate', { data: row }, function(res){
                                 alert('修改成功！！');
                                 that.search();
                             });

                         }, TypeSource_type));*/
                },
                modelEdit: function(row){
                    var that = this;
                    var myPopupForm = that.$refs['myPopupForm'];
                    var newOptions = {
                        Name: row.Name,
                        Remark: row.Remark,
                        DeviceType: row.DeviceType,
                    };
                    myPopupForm.open({
                        title: '编辑设备型号',
                        option: myPopupForm.newOptions(newOptions, formOptionsModel),
                        confirm: function(rst){
                            //调用修改函数
                            if( !rst || $.isEmptyObject(rst) ){
                                return;
                            }
                            row.Name = rst.Name;
                            row.Remark = rst.Remark;
                            row.DeviceType = Number(rst.DeviceType);

                            http('modelUpdate', { data: row }, function(res){
                                alert('修改成功！！');
                                that.search();
                            });
                        },
                    });
                    /*          var default_value = {
                                  Name: row.Name,
                                  Remark: row.Remark,
                                  DeviceType: row.DeviceType,
                              };
                              $('body').append($com.modal.show(default_value, KEYWORD_model, '修改', function(rst){
                                  //调用修改函数
                                  if( !rst || $.isEmptyObject(rst) ){
                                      return;
                                  }
                                  row.Name = rst.Name;
                                  row.Remark = rst.Remark;
                                  row.DeviceType = Number(rst.DeviceType);

                                  http('modelUpdate', { data: row }, function(res){
                                      alert('修改成功！！');
                                      that.search();
                                  });

                              }, TypeSource_model));*/
                },
                dictEdit: function(row){
                    var that = this;
                    var myPopupForm = that.$refs['myPopupForm'];
                    var newOptions = {
                        Name: row.Name,
                        Protocol: row.Protocol,
                        VariableName: row.VariableName,
                        DataType: row.DataType,
                        DataLength: row.DataLength,
                        OPCClass: row.OPCClass,
                        KeyChar: row.KeyChar,
                        AuxiliaryChar: row.AuxiliaryChar,
                        ParameterDesc: row.ParameterDesc,
                        DataClass: row.DataClass,
                        AnalysisOrder: row.AnalysisOrder,
                    };
                    myPopupForm.open({
                        title: '编辑设备参数',
                        option: myPopupForm.newOptions(newOptions, formOptionsDic),
                        confirm: function(rst){
                            if( !rst || $.isEmptyObject(rst) ){
                                return;
                            }
                            row.Name = rst.Name;
                            row.Protocol = rst.Protocol;
                            row.DataType = Number(rst.DataType);
                            row.AnalysisOrder = Number(rst.AnalysisOrder);
                            row.VariableName = rst.VariableName;
                            row.DataLength = rst.DataLength;
                            row.OPCClass = rst.OPCClass;
                            row.KeyChar = rst.KeyChar;
                            row.AuxiliaryChar = rst.AuxiliaryChar;
                            row.DataClass = rst.DataClass;
                            row.ParameterDesc = rst.ParameterDesc;

                            http('dictUpdate', { data: row }, function(res){
                                alert('修改成功！！');
                                that.search();
                            });
                        },
                    });
                    /*                    var default_value = {
                                            Name: row.Name,
                                            Protocol: row.Protocol,
                                            VariableName: row.VariableName,
                                            DataType: row.DataType,
                                            DataLength: row.DataLength,
                                            OPCClass: row.OPCClass,
                                            KeyChar: row.KeyChar,
                                            AuxiliaryChar: row.AuxiliaryChar,
                                            ParameterDesc: row.ParameterDesc,
                                            DataClass: row.DataClass,
                                            AnalysisOrder: row.AnalysisOrder,
                                        };
                                        $('body').append($com.modal.show(default_value, KEYWORD_Dictionary, '修改', function(rst){
                                            //调用修改函数
                                            if( !rst || $.isEmptyObject(rst) ){
                                                return;
                                            }
                                            row.Name = rst.Name;
                                            row.Protocol = rst.Protocol;
                                            row.DataType = Number(rst.DataType);
                                            row.AnalysisOrder = Number(rst.AnalysisOrder);
                                            row.VariableName = rst.VariableName;
                                            row.DataLength = rst.DataLength;
                                            row.OPCClass = rst.OPCClass;
                                            row.KeyChar = rst.KeyChar;
                                            row.AuxiliaryChar = rst.AuxiliaryChar;
                                            row.DataClass = rst.DataClass;
                                            row.ParameterDesc = rst.ParameterDesc;

                                            http('dictUpdate', { data: row }, function(res){
                                                alert('修改成功！！');
                                                that.search();
                                            });

                                        }, TypeSource_Dictionary));*/
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
                    // 通过status选择不同的URL
                    http(that.status + 'Delete', { data: [ row ] }, function(res){
                        alert('删除成功！！');
                        that.search();
                    });
                },
                // 切换状态
                activeChange: function(row){
                    var that = this;
                    var newActive = row.Active === 1 ? 2 : 1;
                    var data = {
                        Active: newActive,
                        data: [ row ],
                    };
                    // 通过status选择不同的URL
                    http(that.status + 'ChangeActive', data, function(){
                        row.Active = newActive;
                        that.search();
                        // alert('操作成功！');
                    });
                },
                // 字典页 显示/隐藏
                showDict: function(row){
                    rowData = row
                    searchTemplate.dict.DeviceID = row.ID;

                    this.searchData.dict.DeviceID = row.ID;
                    this.status = 'dict';
                    excelParams.AssetNoString = row.AssetNo;
                },
                hideDict: function(){
                    this.status = 'ledger';
                    this.tableDataAll.dict=[];
                    this.searchData.dict.DeviceID = '';
                    excelParams.AssetNoString = '';
                },
                // 获取下拉列表数据
                getSelectOptions: function(type){
                    var that = this;
                    switch( type ){
                        case 'created':
                            getUser();
                            getBMSRegion();
                            break;
                        case 'ledger' :
                            typeGetData();
                            modelGetData();
                            break;
                        case 'model' :
                            typeGetData();
                            break;
                    }

                    // 设备型号
                    function modelGetData(){
                        http('modelGetData', { Active: 1 }, function(res){

                            that.ToolArrReplace(formSelectOptions.ModelID, res.list);

                            that.selectOptions.ModelID = res.list;
                            /*  TypeSource_Ledger.ModelID = [];
                              res.list.forEach(function(item){
                                  TypeSource_Ledger.ModelID.push({
                                      name: item.Name,
                                      value: item.ID,
                                  });
                              });*/
                        });
                    }

                    // 设备类型
                    function typeGetData(){

                        http('typeGetData', { Active: 1 }, function(res){

                            that.ToolArrReplace(formSelectOptions.DeviceType, res.list);

                            that.selectOptions.DeviceType = res.list;
                            /* res.list.forEach(function(item){
                                 TypeSource_model.DeviceType.push({
                                     name: item.Name,
                                     value: item.ID,
                                 });
                             });*/
                        });
                    }

                    // 所在区域
                    function getBMSRegion(){
                        http('getBMSRegion', { Active: 1 }, function(res){

                            that.ToolArrReplace(formSelectOptions.AreaID, res.list);

                            that.selectOptions.AreaID = res.list;
                            /*   TypeSource_Ledger.AreaID = [];
                               res.list.forEach(function(item){
                                   TypeSource_Ledger.AreaID.push({
                                       name: item.Name,
                                       value: item.ID,
                                   });
                               });*/
                        });
                    }

                    // 维护人员
                    function getUser(){
                        http('getUser', { Active: 1 }, function(res){

                            that.ToolArrReplace(formSelectOptions.MaintainerIDList, res.list);

                            /* TypeSource_Ledger.MaintainerIDList = [];
                             res.list.forEach(function(item){
                                 TypeSource_Ledger.MaintainerIDList.push({
                                     name: item.Name,
                                     value: item.ID,
                                 });
                             });*/
                        });
                    }


                },
            },
            events: function(){
                //导出
                $('body').delegate('#zace-exportApproval-level', 'click', function(){
                    excelParams.data = $com.util.Clone(model.data.tableDataAll.dict);
                    model.com.postExportExcel(excelParams, function(res){
                        var src = res.info.path;

                        if( src.indexOf('iPlantSCADA') != -1 ){
                            window.open(src);
                            alert('导出成功');
                        } else{
                            window.open('/iPlantSCADA' + src);
                        }
                    });
                });
                //导入
                $('body').delegate('#lmvt-materialRecord-input', 'click', function(){
                    $('#input-file').val('');
                    $('#input-file').click();
                });
                $('body').delegate('#input-file', 'input', function(){
                    var $this = $(this);

                    if( this.files.length == 0 ){
                        return;
                    }


                    if( !extLimit([ 'xlsx', 'xls' ]).has(this.files[0].name) ){
                        alert('请上传正确的Excel文件！');
                        clearFiles();
                        return;
                    }
                    var fileData = this.files[0];

                    var form = new FormData();
                    form.append('file', fileData);

                    model.com.postImportExcel(form, function(res){
                        if( !res ){
                            return;
                        }
                        // res.list.splice(0, 1);//删除第一行
                        var list = res.list,
                            rst = [];
                        if( list ){

                            var postData = res.list;

                            /*   var DataParams = $com.table.postExportParams(postData, $('table'));*/

                            var DataParams = [];
                            list.forEach(function(item){
                                var obj = {};
                                for( var objKey in excelParams.head ){
                                    obj[objKey] = item[excelParams.head[objKey]];
                                }
                                DataParams.push(obj);
                            });

                            var arr1 = [];
                            var arr1List = [];
                            for( var i = 0; i < DataParams.length; i++ ){
                                arr1.push(DataParams[i].Code);
                                arr1List.push(DataParams[i]);
                            }

                            var arr2 = [];
                            var arr2List = [];
                            for( var i = 0; i < arr1.length; i++ ){
                                if( arr2.indexOf(arr1[i]) == -1 ){
                                    arr2.push(arr1[i]);
                                    arr2List.push(arr1List[i]);
                                }
                            }


                            var CheckDataCode = $com.util.Clone(model.data.tableDataAll.dict);
                            var list = model.com.getNewList(CheckDataCode, arr2List);
                            if( list.length != arr1List.length ){
                                if( !confirm('导入数据重复' + '，确定是否继续？') ){
                                    return false;
                                }

                            }

                            if( list.length < 1 ){
                                alert('导入数据全部存在！');
                                return;
                            }

                            var getNewList = [];
                            $.each(list, function(i, item){
                                if( item.AssetNo == excelParams.AssetNoString ){
                                    item.Name = item.Name+ '';
                                    item.Code = item.Code+ '';
                                    item.AssetNo = item.AssetNo + '';
                                    if( item.AnalysisOrder.length != 0 ){
                                        item.AnalysisOrder = Number(item.AnalysisOrder);
                                    } else{
                                        item.AnalysisOrder = 0;
                                    }

                                    item.DeviceName = item.DeviceName + '';
                                    item.DeviceNo = rowData.DeviceNo + '';
                                    item.Protocol = item.Protocol + '';
                                    item.VariableName = item.VariableName + '';

                                    item.DataLength = Number(item.DataLength);
                                    item.OPCClass = item.OPCClass + '';
                                    item.KeyChar = item.KeyChar + '';
                                    item.AuxiliaryChar = item.AuxiliaryChar + '';
                                    // item.DataClass = item.DataClassText;
                                    // item.DataClassText = item.DataClassText + "";
                                    if( item.DataClassText == '状态' ){
                                        item.DataClass = 1;
                                    } else if( item.DataClassText == '报警' ){
                                        item.DataClass = 2;
                                    } else if( item.DataClassText == '参数' ){
                                        item.DataClass = 3;
                                    }
                                    if( item.DataTypeText == 'int' || item.DataTypeText == 'Int' ){
                                        item.DataType = 2;
                                    } else if( item.DataTypeText == 'bool' || item.DataTypeText == 'Bool' ){
                                        item.DataType = 1;
                                    } else if( item.DataTypeText == 'string' || item.DataTypeText == 'String' ){
                                        item.DataType = 3;
                                    } else if( item.DataTypeText == 'float' || item.DataTypeText == 'Float' ){
                                        item.DataType = 4;
                                    } else if( item.DataTypeText == 'double' || item.DataTypeText == 'Double' ){
                                        item.DataType = 5;
                                    }
                                    item.Active = Number(item.Active);
                                    item.ID = 0;
                                    getNewList.push(item);
                                }
                            });
                            console.log(getNewList);
                            var a = 0;
                            $com.app.loading();
                            var WhileAdd = function(){
                                model.com.postDMSDeviceParameter({
                                    data: getNewList[a],
                                }, function(res){
                                    a++;
                                    console.log(res);
                                    if( a == getNewList.length ){
                                        $com.app.loaded();

                                        alert('导入成功');
                                        // 刷新
                                        // model.com.refreshDictionary();
                                        model.methods.search.call(vm);
                                    } else{
                                        WhileAdd();
                                    }
                                });

                            };

                            if( getNewList.length <= 0 ){
                                alert('导入数据为空！！！');
                            } else{
                                WhileAdd();
                            }

                        }

                    });

                    function clearFiles(){
                        self.value = '';
                    }

                    function extLimit(exts){
                        return {
                            has: function(file){
                                var arr = file.split('.'),
                                    ext = arr[arr.length - 1].toLowerCase();
                                return exts.indexOf(ext) > -1;
                            },
                        };
                    }
                });
            },
            com: {
                //导出
                postExportExcel: function(data, fn, context){
                    var d = {
                        $URI: '/Upload/ExportExcel',
                        $TYPE: 'post',
                    };
                    function err(){
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //导入
                postImportExcel: function(data, fn, context){
                    var d = {
                        $URI: '/Upload/ImportExcel',
                        $TYPE: 'post',
                    };

                    function err(){
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax_load(data ? $.extend(data, d) : $.extend(d, data), fn, err, context);
                },
                getNewList: function(_source, set_data){
                    if( !_source ){
                        _source = [];
                    }
                    if( !set_data ){
                        set_data = [];
                    }
                    var rst = [];
                    if( _source.length >= set_data.length ){
                        for( var i = 0; i < _source.length; i++ ){
                            var NotOWn = false;
                            for( var j = 0; j < set_data.length; j++ ){
                                if( _source[i].Code == set_data[j].Code ){
                                    _source.splice(i, 1);
                                    set_data.splice(j, 1);
                                    NotOWn = true;
                                }
                                if( set_data.length < 1 ){
                                    break;
                                }
                                if( _source.length < 1 ){
                                    break;
                                }
                                if( NotOWn ){
                                    model.com.getNewList(_source, set_data);
                                }
                            }

                        }
                        rst = set_data;
                        return rst;
                    } else{
                        for( var i = 0; i < set_data.length; i++ ){
                            var NotOWn = false;
                            for( var j = 0; j < _source.length; j++ ){
                                if( set_data[i].Code == _source[j].Code ){
                                    set_data.splice(i, 1);
                                    _source.splice(j, 1);
                                    NotOWn = true;
                                }
                                if( _source.length < 1 ){
                                    break;
                                }
                                if( set_data.length < 1 ){
                                    break;
                                }
                                if( NotOWn ){
                                    model.com.getNewList(set_data, _source);
                                }
                            }

                        }
                        rst = set_data;
                        return rst;

                    }

                },
                //新增修改数据字典
                postDMSDeviceParameter: function(data, fn, context){
                    var d = {
                        $URI: '/DMSDeviceParameter/Update',
                        $TYPE: 'post',
                    };

                    function err(){
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
            },
        });
        model.init();
    });
