require(
    [
        '../static/utils/js/jquery-3.1.1',
        '../static/utils/js/base/paging',
        '../static/utils/js/base/base',
        '../static/utils/vue/mixins/tools',
        '../static/utils/vue/mixins/baseComponents',
    ],
    function($alfie, $page, $com, $mixinsTools, $baseComponents){

        var UriList = {
            // 台账
            ledgerGetData: { type: 'get', url: '/DMSDeviceLedger/All' },
            ledgerUpdate: { type: 'post', url: '/DMSDeviceLedger/Update' },
            ledgerChangeActive: { type: 'post', url: '/DMSDeviceLedger/Active' },
            ledgerDelete: { type: 'post', url: '/DMSDeviceLedger/Delete' },
            // 字典
            dictGetData: { type: 'get', url: '/DMSDeviceParameter/All' },
            dictUpdate: { type: 'post', url: '/DMSDeviceParameter/Update' },
            dictChangeActive: { type: 'post', url: '/DMSDeviceParameter/Active' },
            dictDelete: { type: 'post', url: '/DMSDeviceParameter/Delete' },
            // select
            getBMSRegion: { type: 'get', url: '/BMSRegion/All' },// 区域列表
            getUser: { type: 'get', url: '/User/All' },// 人员列表

            typeGetData: { type: 'get', url: '/DMSDeviceType/All' },
            modelGetData: { type: 'get', url: '/DMSDeviceModel/All' },
        };
        var minTime = new Date('2020-01-01 00:00:00');

        var excelParams = {
            fileName: '数据字典.xls',
            title: '数据字典',
            head: {
                '$index': '序号',
                'DeviceName': '设备名称',
                'DeviceNo': '设备编码',
                'AssetNo': '采集编号',
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
            },
            order: [
                '$index',
                'DeviceName',
                'DeviceNo',
                'AssetNo',
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
            ],
            AssetNoString: '',
        };

        var statusDic = {
            Active: [ '保存', '启用', '禁用' ],
            DataClass: [ '默认', '状态', '报警', '设备参数', '作业参数', '能源参数' ],
            DataType: [ '默认', 'bool', 'int', 'string', 'float', 'double','short' ],
        };

        function statusCut(data, dic){
            return isNaN(Number(data)) ? dic.indexOf(data) : dic[data];
        }


        var searchTemplate = {
            ledger: { Name: '', DeviceType: '', ModelID: '', AreaID: '', Active: '-1' },
            dict: { DeviceID: '', DataType: '', DataClass: '1', Name: '', Active: '1' },
        };
        var formSelectOptions = {
            ModelID: [],
            AreaID: [],
            MaintainerIDList: [],
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
                    {
                        Name: 'short',
                        ID: 6,
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
                        Name: '设备参数',
                        ID: 3,
                    }, {
                        Name: '作业参数',
                        ID: 4,
                    }, {
                        Name: '能源参数',
                        ID: 5,
                    },
                ],
            },
            { label: '参数描述', value: 'ParameterDesc', type: 'textarea' },
        ];

        var model = $com.Model.create({
            el: '#deviceManage-body',
            name: '设备台账',
            VueName: 'vm',
            mixins: [ $mixinsTools, $baseComponents ],
            data: {
                // 台账ledger 数据字典dict
                status: 'ledger',
                // 搜索框
                searchData: {
                    ledger: $com.util.Clone(searchTemplate.ledger),
                    dict: $com.util.Clone(searchTemplate.dict),
                },
                ledgerTableData: [],
                ledgerData: {},
                dictTableData: [],
                selectOptions: {
                    DeviceType: [],
                    ModelList: [],
                    AreaList: [],
                },
                //用户权限
                jurisdiction: false,
                UriList: UriList,
                DataType:statusDic.DataType,
            },
            computed: {},
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
            watch: {},
            created: function(){
                this.search();
                this.getSelectOptions();
                this.jurisdiction = $com.app.checkRole(102000);
            },
            mounted: function(){
            },
            methods: {
                showInfo: function(row){
                    var option = [
                        { label: '供应商名称:', value: 'label1', type: 'text', default: row.SupplierName || '-', span: 24 },
                        { label: '供应商编码:', value: 'label2', type: 'text', default: row.SupplierName || '-', span: 24 },
                        {
                            label: '供应商电话:',
                            value: 'label3',
                            type: 'text',
                            default: row.SupplierContactInfo || '-',
                            span: 24,
                        },
                        { label: '描述:', value: 'label5', type: 'text', default: row.Remark || '-', span: 24 },
                        {
                            label: '设备图片:',
                            value: 'label4',
                            type: 'file-img',
                            disabled: true,
                            default: row.ImageIcon ? [ { url: row.ImageIcon } ] : [],
                            span: 24,
                        },
                    ];
                    this.$refs['myPopupForm'].open({
                        title: '设备详情',
                        option: option,
                        style: {
                            labelPosition: 'right',
                            hideConfirm: true,
                        },
                    });
                },
                // 搜索
                search: function($event){
                    var that = this;
                    if( that.status === 'ledger' ){
                        var params = $event ? that.searchData.ledger : searchTemplate.ledger;
                        $com.app.loading('数据加载中...');
                        that.Http('ledgerGetData', params, function(res){
                            $page.init(
                                $('.el-table .el-table__body-wrapper > table'),
                                res.list, {
                                    Deeps: 4,
                                    PageSize: 20,
                                }, function(list){
                                    that.ledgerTableData = list;
                                },
                            );
                            $com.app.loaded();
                        });

                    } else if( that.status === 'dict' ){
                        var params = $event ? that.searchData.dict : searchTemplate.dict;
                        that.Http('dictGetData', params, function(res){
                            $page.init(
                                $('.el-table .el-table__body-wrapper > table'),
                                res.list, {
                                    Deeps: 4,
                                    PageSize: 20,
                                }, function(list){
                                    list.forEach(function(item, index){
                                        item.AssetNo = model.data.ledgerData.AssetNo;
                                        item.$index = index + 1;
                                    });
                                    that.dictTableData = list;
                                },
                            );
                            $com.app.loaded();
                        });
                    }
                },
                // 清空搜索条件
                emptyClick: function(){
                    var that = this;
                    if( that.status === 'ledger' ){
                        that.searchData.ledger = $com.util.Clone(searchTemplate.ledger);
                    } else if( that.status === 'dict' ){
                        that.searchData.dict = $com.util.Clone(searchTemplate.dict);
                    }
                },
                // 添加
                addClick: function(){
                    var that = this;
                    if( that.status === 'ledger' ){
                        that.$refs['myPopupForm'].open({
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
                                that.Http('ledgerUpdate', { data: _data }, function(res){
                                    alert('新增成功！！');
                                    that.search();
                                });
                            },
                        });
                    }
                    if( that.status === 'dict' ){
                        that.$refs['myPopupForm'].open({
                            title: '新增设备参数',
                            option: formOptionsDic,
                            confirm: function(rst){
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
                                var mData = that.dictTableData;
                                for( var i = 0; i < mData.length; i++ ){
                                    if( rst.Name == mData[i].Name ){
                                        alert('新增参数已存在！');
                                        return false;
                                    }
                                }
                                $com.util.deleteLowerProperty(_data);
                                that.Http('dictUpdate', { data: _data }, function(res){
                                    alert('新增成功！！');
                                    that.search();
                                });
                            },
                        });
                    }
                },
                // 编辑
                editClick: function(row){
                    var that = this;
                    var myPopupForm = that.$refs['myPopupForm'];
                    if( that.status === 'ledger' ){
                        var ModelID = this.ToolNewSelectOptions(
                            [ row.ModelID ],
                            [ row.ModelName ],
                            formSelectOptions.ModelID,
                        );
                        var AreaID = this.ToolNewSelectOptions(
                            [ row.AreaID ],
                            [ row.PositionText ],
                            formSelectOptions.AreaID,
                        );

                        var newMaintainerIDList = [];
                        for( let i in row.MaintainerName.split(',') )
                            newMaintainerIDList.push(row.MaintainerIDList[i]);
                        var MaintainerIDList = this.ToolNewSelectOptions(
                            newMaintainerIDList,
                            row.MaintainerName,
                            formSelectOptions.MaintainerIDList,
                        );

                        var newOptions = {
                            Name: row.Name,
                            Code: row.Code,
                            AssetNo: row.AssetNo,
                            ModelID: {
                                default: row.ModelID,
                                options: ModelID,
                            },
                            AreaID: {
                                default: row.AreaID,
                                options: AreaID,
                            },
                            DeviceIP: row.DeviceIP,
                            AcceptanceDate: row.AcceptanceDate,
                            Name: row.Name,
                            SupplierCode: row.SupplierCode,
                            SupplierName: row.SupplierName,
                            MaintainerIDList: {
                                default: newMaintainerIDList,
                                options: MaintainerIDList,
                            },
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
                                row.MaintainerIDList = rst.MaintainerIDList[0] === null ? [] : rst.MaintainerIDList;
                                row.AcceptanceDate = rst.AcceptanceDate;
                                row.SupplierCode = rst.SupplierCode;
                                row.SupplierContactInfo = rst.SupplierContactInfo;
                                row.SupplierName = rst.SupplierName;
                                row.Remark = rst.Remark;
                                row.ImageIcon = rst.ImageIcon[0];
                                $com.util.deleteLowerProperty(row);
                                that.Http('ledgerUpdate', { data: row }, function(res){
                                    alert('修改成功！！');
                                    that.search();
                                });
                            },
                        });
                    }
                    if( that.status === 'dict' ){
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

                                that.Http('dictUpdate', { data: row }, function(res){
                                    alert('修改成功！！');
                                    that.search();
                                });
                            },
                        });
                    }
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

                    if( that.status === 'ledger' ){
                        this.Http('ledgerDelete', { data: [ row ] }, function(res){
                            alert('删除成功！！');
                            that.search();
                        });
                    }
                    if( that.status === 'dict' ){
                        this.Http('dictDelete', { data: [ row ] }, function(res){
                            alert('删除成功！！');
                            that.search();
                        });
                    }
                },
                // 切换状态
                activeChange: function(row){
                    var that = this;

                    var newActive = row.Active === 1 ? 2 : 1;
                    var data = {
                        Active: newActive,
                        data: [ row ],
                    };
                    if( that.status === 'ledger' ){
                        that.Http('ledgerChangeActive', data, function(){
                            row.Active = newActive;
                            that.search();
                            alert('操作成功！');
                        });
                    }
                    if( that.status === 'dict' ){
                        that.Http('dictChangeActive', data, function(){
                            row.Active = newActive;
                            that.search();
                            alert('操作成功！');
                        });
                    }
                },
                // 显示字典
                showDict: function(row){
                    var that = this;
                    searchTemplate.dict.DeviceID = row.ID;
                    that.searchData.dict = $com.util.Clone(searchTemplate.dict);
                    that.status = 'dict';
                    that.ledgerData = row;
                    this.search();

                    excelParams.AssetNoString = row.AssetNo;
                },
                // 隐藏字典
                hideDict: function(){
                    this.status = 'ledger';
                    this.ledgerData = {};
                    searchTemplate.dict.DeviceID = '';
                    excelParams.AssetNoString = '';
                },
                // 获取下拉框数据
                getSelectOptions: function(){
                    var that = this;
                    that.Http('typeGetData', { Active: 1 }, function(res){
                        that.ToolArrReplace(that.selectOptions.DeviceType, res.list);
                    });
                    that.Http('modelGetData', { Active: 1 }, function(res){
                        that.ToolArrReplace(that.selectOptions.ModelList, res.list);
                        that.ToolArrReplace(formSelectOptions.ModelID, res.list);
                    });
                    that.Http('getBMSRegion', { Active: 1 }, function(res){
                        that.ToolArrReplace(that.selectOptions.AreaList, res.list);
                        that.ToolArrReplace(formSelectOptions.AreaID, res.list);
                    });
                    that.Http('getUser', { Active: 1 }, function(res){
                        that.ToolArrReplace(formSelectOptions.MaintainerIDList, res.list);
                    });
                },
                // 打开设备型号页
                openModel: function(){
                    var vdata = {
                        'header': '设备型号',
                        'href': './basic_Set/DeviceModel-Vue.html',
                        'id': 'DeviceModel-Vue',
                        'src': './static/images/logpng/设备.png',
                        'refresh': false,
                    };

                    window.parent.iframeHeaderSet(vdata);
                    window.callFunctionTrigger('DeviceModel-Vue');

                },
            },
            events: function(){
                //导出
                $('body').delegate('#zace-exportApproval-level', 'click', function(){
                    excelParams.data = $com.util.Clone(model.data.dictTableData);

                    excelParams.data.forEach(function(item){
                        item.Active = statusCut(item.Active, statusDic.Active);
                    });
                    model.com.postExportExcel(excelParams, function(res){
                        var src = res.info.path;

                        if( src.indexOf('iPlantSCADA') !== -1 ){
                            window.open(src);
                            alert('导出成功');
                        } else{
                            window.open('/iPlantSCADA' + src);
                            alert('导出成功');
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


                            var CheckDataCode = $com.util.Clone(model.data.ledgerTableData);
                            var list = model.com.getNewList(CheckDataCode, arr2List);
                            if( list.length !== arr1List.length ){
                                if( !confirm('导入数据重复，确定是否继续？') ){
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
                                    item.Name = item.Name + '';
                                    item.Code = item.Code + '';
                                    item.AssetNo = item.AssetNo + '';
                                    if( item.AnalysisOrder.length !== 0 ){
                                        item.AnalysisOrder = Number(item.AnalysisOrder);
                                    } else{
                                        item.AnalysisOrder = 0;
                                    }
                                    item.DataLength = Number(item.DataLength);
                                    // item.DataClass = item.DataClassText;
                                    // item.DataClassText = item.DataClassText + "";
                                    item.DataClass = statusCut(item.DataClassText, statusDic.DataClass);
                                    item.DataType = statusCut(item.DataTypeText.toLowerCase(), statusDic.DataType);
                                    item.Active = statusCut(item.Active, statusDic.Active);
                                    item.ID = 0;
                                    item.DeviceID = model.data.ledgerData.ID;
                                    delete item.$index;
                                    getNewList.push(item);
                                }
                            });


                            if( getNewList.length < 1 ){
                                alert('可导入数据为空！');
                                return;
                            }

                            $com.app.loading();
                            model.com.postDMSDeviceParameter({ data: getNewList }, function(res){
                                $com.app.loaded();
                                if( res.list.length ){
                                    var h = vm.$createElement;
                                    var msg = [];

                                    res.list.forEach(function(item){
                                        msg.push(h('p', null, item));
                                    });

                                    var dom = h('div', {
                                        style: { 'maxHeight': '50vh', 'overflow': 'auto' },
                                    }, msg);

                                    vm.$alert(dom, '错误信息', {
                                        confirmButtonText: '确定',
                                        callback: action => {
                                            this.$message({
                                                type: 'info',
                                                message: `action: ${ action }`,
                                            });
                                        },
                                    });
                                } else{

                                    alert('导入成功');
                                    model.methods.search.call(vm);
                                }

                            });

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
                        $URI: '/DMSDeviceParameter/UpdateList',
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
