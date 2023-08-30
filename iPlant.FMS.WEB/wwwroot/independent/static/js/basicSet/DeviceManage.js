require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($alfie, $com) {
    var Formattrt_Ledger; //字段格式化对象
    var KEYWORD_Ledger; //查询关键字
    var KEYWORD_Ledger_LIST; //定义字段格式(用于表格字段转换)
    var TypeSource_Ledger; //枚举对象(用于字段转换)
    var mCloneData; //克隆的数据源(用于模糊查询)
    var HTML; //HTML模板
    var mActive = -1;
    var mID = -1;
    var mCode = '';
    var mData;
    var NewDate = [];
    var TestArray;
    var Formattrt_type; //字段格式化对象
    var KEYWORD_type; //查询关键字
    var KEYWORD_type_LIST; //定义字段格式(用于表格字段转换)
    var TypeSource_type; //枚举对象(用于字段转换)
    var mNameType = '';
    var mActiveType = -1;
    var mDataType;

    var Formattrt_model; //字段格式化对象
    var KEYWORD_model; //查询关键字
    var KEYWORD_model_LIST; //定义字段格式(用于表格字段转换)
    var TypeSource_model; //枚举对象(用于字段转换)
    var mNameModel = '';
    var mActiveModel = -1;
    var mDataModel;
    var mNameLedger = '';
    var mActiveLedger = -1;
    var mDataType = -1;

    var Formattrt_Dictionary; //字段格式化对象
    var KEYWORD_Dictionary; //查询关键字
    var KEYWORD_Dictionary_LIST; //定义字段格式(用于表格字段转换)
    var TypeSource_Dictionary; //枚举对象(用于字段转换)
    var mNameDictionary = '';
    var mActiveDictionary = 1;
    var mDataDictionary;
    var mNameDictionary = '';
    var mActiDictionary = -1;
    var CheckDataCode;
    var DeviceID;
    var AssetNoString;
    var mDataClassify = 1;

    HTML = {
        IMG: '<li class="upload-img"><img src="{{Src}}" data-id="{{Id}}" data-source="{{Src}}" class="image-show"></li>',
        Photo: [
            '<div class="lmvt-show-photo" style="position: fixed;z-index: 2001;top: 0;right: 0;left: 0;bottom: 0;background: rgba(0, 0, 0, 0.5);text-align: center">',
            '<svg t="1562913698052" class="lmvt-remove-photo" style="position:absolute;top:10;right:10" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2620" width="50" height="50"><path d="M684.642617 277.598412l-1.436722-1.467421c-12.489452-12.461823-32.730449-12.461823-45.159526 0L479.700991 434.510138l-158.286026-158.315702c-12.555967-12.524245-32.793894-12.524245-45.225017 0-12.555967 12.462846-12.555967 32.701796 0 45.223994l158.348448 158.317749L276.129573 638.049834c-12.495592 12.429077-12.495592 32.671097 0 45.163619l1.49812 1.434675c12.429077 12.494569 32.66905 12.494569 45.221948 0l158.287049-158.286026 158.283979 158.286026c12.491499 12.494569 32.731472 12.494569 45.220924 0 12.495592-12.493545 12.495592-32.731472 0-45.222971l-158.285003-158.285003 158.285003-158.314679C697.138209 310.299185 697.138209 290.060235 684.642617 277.598412" p-id="2621" fill="#e6e6e6"></path><path d="M818.88197 140.522454c-187.332573-187.363272-491.033479-187.363272-678.364005 0-187.329503 187.329503-187.329503 491.032456 0 678.362982 187.330526 187.392948 491.031433 187.392948 678.364005 0C1006.274918 631.55491 1006.274918 327.851956 818.88197 140.522454M773.656953 773.660418c-162.344458 162.343435-425.569512 162.407903-587.914994 0-162.40688-162.344458-162.40688-425.602258 0-587.914994 162.344458-162.40688 425.569512-162.40688 587.914994 0C936.063833 348.059184 936.000388 611.31596 773.656953 773.660418" p-id="2622" fill="#e6e6e6"></path></svg>',
            '<div data-index="0" class="lmvt-change-photo" style="position: fixed;top: 60px;right: 60px;left: 60px;bottom: 60px;background-size:100% 100%;width: auto;height: auto;">',
            // '<img class="zacelmvt-img" style="position: fixed;top: 60px;right: 60px;left: 60px;bottom: 60px;background-size:auto 100%;width: auto;height: auto;" />',
            '</div>',
            '<div class="lmvt-bottom">',
            '<div class="lmvt-bottom-left">',
            '<svg t="1562913570901" class="icon" style="float:left;margin-left:10px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1103" width="30" height="30">',
            '<path d="M512 0a512 512 0 1 0 512 512 512 512 0 0 0-512-512z m0 896a384 384 0 1 1 384-384 384 384 0 0 1-384 384z" fill="#e6e6e6" p-id="1104"></path>',
            '<path d="M493.44 247.04a64 64 0 0 0-90.88 90.88L576 512l-173.44 174.08a64 64 0 0 0 90.88 90.88l219.52-219.52a64 64 0 0 0 0-90.88z" fill="#e6e6e6" p-id="1105"></path></svg>',
            '</div>',
            '<div class="lmvt-bottom-right">',
            '<svg t="1562912869524" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" ',
            ' p-id="1469" width="30" style="float:right;margin-right:10px" height="30"><path d="M512 0a512 512 0 1 0 512 512 512 512 0 0 0-512-512z m0 896a384 384 0 1 1 384-384 384 384 0 0 1-384 384z" ',
            ' fill="#e6e6e6" p-id="1470"></path><path d="M616.96 272.64a58.24 58.24 0 0 0-81.92 0l-198.4 198.4a58.88 58.88 0 0 0 0 81.92l198.4 198.4a58.24 58.24 0 1 0 81.92-81.92L459.52 512l157.44-157.44a58.24 58.24 0 0 0 0-81.92z" fill="#e6e6e6" p-id="1471"></path></svg>',
            '</div>',
            '</div>',
            '</div>',
        ].join(''),
        TableNode_item: [
            '<tr data-color="">',
            // '<td style="width: 3px"><input type="checkbox"',
            // 'class="femi-tb-checkbox" style="margin: 1px 0px 1px;" /></td> ',
            '<td style="min-width:50px;" data-title="ID" data-value="{{ID}}">{{WID}}</td>',
            '<td style="min-width: 50px" data-title="AssetNo" data-value="{{AssetNo}}">{{AssetNo}}</td>',
            '<td style="min-width: 50px" data-title="Code" data-value="{{Code}}">{{Code}}</td>',
            '<td style="min-width: 50px" data-title="Name" data-value="{{Name}}">{{Name}}</td>',
            '<td style="min-width: 50px" data-title="ModelName" data-value="{{ModelName}}">{{ModelName}}</td>',
            '<td style="min-width: 50px" data-title="DeviceTypeName" data-value="{{DeviceTypeName}}">{{DeviceTypeName}}</td>',
            '<td style="min-width: 50px" data-title="PositionText" data-value="{{PositionText}}">{{PositionText}}</td>',
            '<td style="min-width: 50px" data-title="DeviceIP" data-value="{{DeviceIP}}">{{DeviceIP}}</td>',
            '<td style="min-width: 50px" data-title="MaintainDate" data-value="{{MaintainDate}}">{{MaintainDate}}</td>',
            '<td style="min-width: 50px" data-title="MaintainerName" data-value="{{MaintainerName}}">{{MaintainerName}}</td>',
            '<td style="min-width: 50px" data-title="Remark" data-value="{{Remark}}">{{Remark}}</td>',
            '<td data-title="ImageIcon" data-value="{{ImageIcon}}">{{ImageItem}}</td>',
            '<td data-title="AcceptanceDate" data-value="{{AcceptanceDate}}">{{AcceptanceDate}}</td>',
            '<td data-title="SupplierCode" data-value="{{SupplierCode}}">{{SupplierCode}}</td>',
            '<td data-title="SupplierContactInfo" data-value="{{SupplierContactInfo}}">{{SupplierContactInfo}}</td>',
            '<td data-title="SupplierName" data-value="{{SupplierName}}">{{SupplierName}}</td>',
            '<td data-title="Active" data-value="{{Active}}"data-id="{{ID}}"  class="ActiveSubmit" > <input type="checkbox"  class="{{Switch}}" /></td>',
            '<td style="width: 150px" data-title="Handle" data-value="{{ID}}"><div class="row">',
            '<div class="col-md-4 lmvt-do-info lmvt-resetPencil"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>编辑</div>',
            '<div class="col-md-4 lmvt-do-info lmvt-delete"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span>删除</div>',
            '<div class="col-md-4 lmvt-do-info lmvt-DateDictionary"><span class="glyphicon glyphicon-cog" aria-hidden="true"></span>字典</div>',
            '</div></td>',
            '</tr>',
        ].join(''),
        IMGLIST: '<img src= "{{SrcList}}" data-source="{{SrcList}}" style="width:25px;height:25px;"/>',
        TableNode_type: [
            '<tr data-color="">',
            // '<td style="width: 3px"><input type="checkbox"',
            // 'class="femi-tb-checkbox" style="margin: 1px 0px 1px;" /></td> ',
            '<td style="min-width: 50px;" data-title="ID" data-value="{{ID}}">{{WID}}</td>',
            '<td style="min-width: 50px" data-title="Code" data-value="{{Code}}">{{Code}}</td>',
            '<td style="min-width: 50px" data-title="Name" data-value="{{Name}}">{{Name}}</td>',
            '<td style="min-width: 50px" data-title="OperatorName" data-value="{{OperatorName}}">{{OperatorName}}</td>',
            '<td style="min-width: 50px" data-title="OperateTime" data-value="{{OperateTime}}">{{OperateTime}}</td>',
            '<td style="min-width: 50px" data-title="Remark" data-value="{{Remark}}">{{Remark}}</td>',
            '<td data-title="Active" data-value="{{Active}}"data-id="{{ID}}"  class="ActiveSubmitType" > <input type="checkbox"  class="{{Switch}}" /></td>',
            '<td style="max-width: 80px" data-title="Handle" data-value="{{ID}}"><div class="row">',
            '<div class="col-md-6 lmvt-do-info lmvt-resetPencilType"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>编辑</div>',
            '<div class="col-md-6 lmvt-do-info lmvt-deleteType"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span>删除</div>',
            '</div></td>',
            '</tr>',
        ].join(''),
        TableNode_model: [
            '<tr data-color="">',
            // '<td style="width: 3px"><input type="checkbox"',
            // 'class="femi-tb-checkbox" style="margin: 1px 0px 1px;" /></td> ',
            '<td style="min-width: 50px;" data-title="ID" data-value="{{ID}}">{{WID}}</td>',
            '<td style="min-width: 50px" data-title="Code" data-value="{{Code}}">{{Code}}</td>',
            '<td style="min-width: 50px" data-title="Name" data-value="{{Name}}">{{Name}}</td>',
            '<td style="min-width: 50px" data-title="DeviceTypeName" data-value="{{DeviceTypeName}}">{{DeviceTypeName}}</td>',
            '<td style="min-width: 50px" data-title="OperatorName" data-value="{{OperatorName}}">{{OperatorName}}</td>',
            '<td style="min-width: 50px" data-title="OperateTime" data-value="{{OperateTime}}">{{OperateTime}}</td>',
            '<td style="min-width: 50px" data-title="Remark" data-value="{{Remark}}">{{Remark}}</td>',
            '<td data-title="Active" data-value="{{Active}}"data-id="{{ID}}"  class="ActiveSubmitModel" > <input type="checkbox"  class="{{Switch}}" /></td>',
            '<td style="max-width: 80px" data-title="Handle" data-value="{{ID}}"><div class="row">',
            '<div class="col-md-6 lmvt-do-info lmvt-resetPencilModel"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>编辑</div>',
            '<div class="col-md-6 lmvt-do-info lmvt-deleteModel"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span>删除</div>',
            '</div></td>',
            '</tr>',
        ].join(''),


        TableNode_Dictionary: [
            '<tr data-color="">',
            // '<td style="width: 3px"><input type="checkbox"',
            // 'class="femi-tb-checkbox" style="margin: 1px 0px 1px;" /></td> ',
            '<td style="min-width: 50px;" data-title="ID" data-value="{{ID}}">{{WID}}</td>',
            '<td style="min-width: 50px" data-title="DeviceName" data-value="{{DeviceName}}">{{DeviceName}}</td>',
            '<td style="min-width: 50px" data-title="DeviceNo" data-value="{{DeviceNo}}">{{DeviceNo}}</td>',
            '<td style="min-width: 50px" data-title="Protocol" data-value="{{Protocol}}">{{Protocol}}</td>',
            '<td style="min-width: 50px" data-title="VariableName" data-value="{{VariableName}}">{{VariableName}}</td>',
            '<td style="min-width: 50px" data-title="Code" data-value="{{Code}}">{{Code}}</td>',
            '<td style="min-width: 50px" data-title="Name" data-value="{{Name}}">{{Name}}</td>',
            '<td style="min-width: 50px" data-title="AnalysisOrder" data-value="{{AnalysisOrder}}">{{AnalysisOrder}}</td>',
            '<td style="min-width: 50px" data-title="DataTypeText" data-value="{{DataTypeText}}">{{DataTypeText}}</td>',
            '<td style="min-width: 50px" data-title="DataLength" data-value="{{DataLength}}">{{DataLength}}</td>',
            '<td style="min-width: 50px" data-title="OPCClass" data-value="{{OPCClass}}">{{OPCClass}}</td>',
            '<td style="min-width: 50px" data-title="KeyChar" data-value="{{KeyChar}}">{{KeyChar}}</td>',
            '<td style="min-width: 50px" data-title="AuxiliaryChar" data-value="{{AuxiliaryChar}}">{{AuxiliaryChar}}</td>',
            '<td style="min-width: 50px" data-title="DataClassText" data-value="{{DataClassText}}">{{DataClassText}}</td>',
            '<td style="width: 180px" data-title="ParameterDesc" data-value="{{ParameterDesc}}">{{ParameterDesc}}</td>',
            '<td data-title="Active" data-value="{{Active}}"data-id="{{ID}}"  class="ActiveSubmitDictionary" > <input type="checkbox"  class="{{Switch}}" /></td>',
            '<td style="max-width: 100px" data-title="Handle" data-value="{{ID}}"><div class="row">',
            '<div class="col-md-6 lmvt-do-info lmvt-resetPencilDictionary"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>编辑</div>',
            '<div class="col-md-6 lmvt-do-info lmvt-deleteDictionary"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span>删除</div>',
            '</div></td>',
            '</tr>',
        ].join(''),

    };

    (function () {
        KEYWORD_Ledger_LIST = [
            'Name|设备名称*',
            'Code|设备编码*',
            'AssetNo|采集编号',
            'ModelID|设备型号*|ArrayOne',
            'AreaID|所在区域*|ArrayOne',
            'DeviceIP|IP地址',
            'AcceptanceDate|验收日期|DateTime',
            'SupplierCode|供应上编码',
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
            MaintainerIDList: [{
                name: '无',
                value: 0,
            }],
        };

        $.each(KEYWORD_Ledger_LIST, function (i, item) {
            var detail = item.split('|');
            KEYWORD_Ledger[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
            };
            if (detail.length > 2) {
                Formattrt_Ledger[detail[0]] = $com.util.getFormatter(TypeSource_Ledger, detail[0], detail[2]);
            }
        });
    })();

    (function () {
        KEYWORD_type_LIST = [
            'ID|设备类型编号',
            'Name|设备类型名称*',
            'Remark|设备类型描述',
        ];


        KEYWORD_type = {};
        Formattrt_type = {};
        TypeSource_type = {};

        $.each(KEYWORD_type_LIST, function (i, item) {
            var detail = item.split('|');
            KEYWORD_type[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
            };
            var _column = {
                field: detail[0],
                title: detail[1],
                align: 'center',
                valign: 'middle',
                sortable: true,
            };
            if (detail.length > 2) {
                Formattrt_type[detail[0]] = $com.util.getFormatter(TypeSource_type, detail[0], detail[2]);
            }
        });
    })();

    (function () {
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

        $.each(KEYWORD_model_LIST, function (i, item) {
            var detail = item.split('|');
            KEYWORD_model[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
            };

            if (detail.length > 2) {
                Formattrt_model[detail[0]] = $com.util.getFormatter(TypeSource_model, detail[0], detail[2]);
            }
        });
    })();

    (function () {
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
            DataType: [{
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
            }],
            DataClass: [{
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
            }],
        };

        $.each(KEYWORD_Dictionary_LIST, function (i, item) {
            var detail = item.split('|');
            KEYWORD_Dictionary[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
            };

            if (detail.length > 2) {
                Formattrt_Dictionary[detail[0]] = $com.util.getFormatter(TypeSource_Dictionary, detail[0], detail[2]);
            }
        });
    })();

    model = $com.Model.create({
        name: '设备台帐',

        type: $com.Model.MAIN, //主方法

        configure: function () {
            this.run();
        },

        events: function () {
            $('body').delegate('#femi-Device-tbody-item tr td[data-title=ImageIcon] img', 'click', function () {
                var farImg = $(this).parent(),
                    imgObj = {},
                    imgList = [];
                $.each(farImg.children(), function (i, item) {
                    imgObj = $(item).attr('data-source');
                    imgList.push(imgObj);
                });
                PhotoList = imgList;
                $('body').append(HTML.Photo);
                var imgSrc = $(this).attr('src');
                $.each(PhotoList, function (p_i, p_item) {
                    var pImg = p_item;
                    if (pImg == imgSrc) {
                        $('.lmvt-change-photo').attr('data-index', p_i);
                        return false;
                    }
                });

                $('.lmvt-change-photo').css('background', 'url(' + imgSrc + ') ' + 'no-repeat center');
            });

            //移除photo
            $('body').delegate('.lmvt-remove-photo', 'click', function () {
                $('.lmvt-show-photo').remove();
            });

            //右看图片
            $('body').delegate('.lmvt-bottom-left', 'click', function () {
                var index = Number($('.lmvt-change-photo').attr('data-index'));
                if (PhotoList) {
                    if (index == PhotoList.length - 1) {
                        alert('这是最后一张图片！');
                        return false;
                    } else {
                        $('.lmvt-change-photo').css('background', 'url(' + PhotoList[index + 1] + ') ' + 'no-repeat center');
                        $('.lmvt-change-photo').attr('data-index', index + 1);
                    }
                }
            });
            //左看图片
            $('body').delegate('.lmvt-bottom-right', 'click', function () {
                var index = Number($('.lmvt-change-photo').attr('data-index'));
                if (PhotoList) {
                    if (index == 0) {
                        alert('这是第一张图片！');
                        return false;
                    } else {
                        $('.lmvt-change-photo').css('background', 'url(' + PhotoList[index - 1] + ') ' + 'no-repeat center');
                        $('.lmvt-change-photo').attr('data-index', index - 1);
                    }
                }

            });
            //设备台帐新增
            $('body').delegate('#alfie-add-level', 'click', function () {
                //将Json数据中的数据值改成对应默认值，然后传入进去
                DEFAULT_VALUE_D = {
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
                    SupplierContactInfo: 0,
                    SupplierName: '',
                    Remark: '',
                    ImageIcon: '',
                };
                $('body').append($com.modal.show(DEFAULT_VALUE_D, KEYWORD_Ledger, '新增设备台帐', function (rst) {
                    //调用插入函数然后用load刷新数据源

                    if (!rst || $.isEmptyObject(rst))
                        return false;
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
                        AcceptanceDate: res.AcceptanceDate,
                        SupplierCode: res.SupplierCode,
                        SupplierContactInfo: res.SupplierContactInfo,
                        SupplierName: res.SupplierName,
                        ModelID: Number(rst.ModelID),
                        ImageIcon: rst.ImageIcon,
                    };
                    for (var i = 0; i < mData.length; i++) {
                        if (rst.Name == mData[i].Name) {
                            alert('新增设备台帐已存在！');
                            return false;
                        }
                    }
                    $com.util.deleteLowerProperty(_data);

                    model.com.postDMSDeviceLedger({
                        data: _data,
                    }, function (res) {
                        alert('新增成功！！');
                        model.com.refresh();
                    });
                }, TypeSource_Ledger));
            });
            //设备台帐修改
            $('body').delegate('.lmvt-resetPencil', 'click', function () {
                var $this = $(this),
                    wID = Number($this.closest('td').attr('data-value'));

                var SelectData = mData.filter((item) => {
                    return item.ID == wID;
                });

                if (!SelectData || !SelectData.length) {
                    alert('请先选择一行数据再试！');
                    return;
                }
                if (SelectData.length != 1) {
                    alert('只能同时对一行数据修改！');
                    return;
                }

                var default_value = {
                    Name: SelectData[0].Name,
                    Code: SelectData[0].Code,
                    AssetNo: SelectData[0].AssetNo,
                    ModelID: SelectData[0].ModelID,
                    DeviceIP: SelectData[0].DeviceIP,
                    AreaID: SelectData[0].AreaID,
                    MaintainerIDList: SelectData[0].MaintainerIDList,
                    AcceptanceDate: SelectData[0].AcceptanceDate,
                    SupplierCode: SelectData[0].SupplierCode,
                    SupplierContactInfo: SelectData[0].SupplierContactInfo,
                    SupplierName: SelectData[0].SupplierName,
                    Remark: SelectData[0].Remark,
                    ImageIcon: SelectData[0].ImageIcon,
                };
                $('body').append($com.modal.show(default_value, KEYWORD_Ledger, '修改', function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].Name = rst.Name;
                    SelectData[0].Code = rst.Code;
                    SelectData[0].AssetNo = rst.AssetNo;
                    SelectData[0].ModelID = Number(rst.ModelID);
                    SelectData[0].DeviceIP = rst.DeviceIP;
                    SelectData[0].AreaID = rst.AreaID;
                    SelectData[0].MaintainerIDList = rst.MaintainerIDList;
                    SelectData[0].AcceptanceDate = rst.AcceptanceDate,
                        SelectData[0].SupplierCode = rst.SupplierCode,
                        SelectData[0].SupplierCode = rst.SupplierContactInfo,
                        SelectData[0].SupplierCode = rst.SupplierName,
                        SelectData[0].Remark = rst.Remark;
                    SelectData[0].ImageIcon = rst.ImageIcon;
                    $com.util.deleteLowerProperty(SelectData[0]);
                    model.com.postDMSDeviceLedger({
                        data: SelectData[0],
                    }, function (res) {
                        alert('修改成功！！');
                        model.com.refresh();
                    });

                }, TypeSource_Ledger));
            });
            //设备台帐删除
            $('body').delegate('.lmvt-delete', 'click', function () {
                // var SelectData = $com.table.getSelectionData($(".l-containe-canvas-table .l-Ledger-body"), "ID", AllLedger);

                var $this = $(this),
                    wID = Number($this.closest('td').attr('data-value'));

                var SelectData = mData.filter((item) => {
                    return item.ID == wID;
                });

                if (!SelectData || !SelectData.length) {
                    alert('至少选择一行数据再试！');
                    return;
                }
                if (SelectData[0].Active != 0) {
                    alert('已激活或者禁用数据无法删除！');
                    return;
                }

                if (!confirm('已选择' + SelectData.length + '条数据，确定将其删除？')) {
                    return;
                }

                model.com.DeleteDMSDeviceLedger({
                    data: SelectData,
                }, function (res) {
                    alert('删除成功！！');
                    model.com.refresh();
                });
            });
            //设备台帐激活 禁用
            $('body').delegate('.ActiveSubmit', 'click', function () {
                var $this = $(this),
                    wActiveID = Number($this.attr('data-value'));
                wID = Number($this.attr('data-id'));

                var SelectData = mData.filter((item) => {
                    return item.ID == wID;
                });

                if (!SelectData || !SelectData.length) {
                    alert('请先选择一行数据再试！');
                    return;
                }
                if (wActiveID == 1) {
                    wActiveID = 2;
                } else {
                    wActiveID = 1;
                }

                model.com.ActivDeviceLedger({
                    Active: wActiveID,
                    data: SelectData,
                }, function (res) {
                    alert('操作成功！');
                    model.com.refresh();
                });
            });
            //设备台帐  查看数据字典
            $('body').delegate('.lmvt-DateDictionary', 'click', function () {
                var $this = $(this),
                    wID = Number($this.closest('td').attr('data-value'));

                var SelectData = mData.filter((item) => {
                    return item.ID == wID;
                });

                if (!SelectData || !SelectData.length) {
                    alert('请先选择一行数据再试！');
                    return;
                }
                if (SelectData.length != 1) {
                    alert('只能同时对一行数据修改！');
                    return;
                }
                DeviceID = SelectData[0].ID;
                //采集编号
                AssetNoString = SelectData[0].AssetNo;
                $('.zzzb').hide();
                $('.zzza').hide();
                $('.zzzc').hide();
                $('.zzzd').show();
                $(window).resize();
                model.com.refreshDictionary();
            });
            //设备台帐重置
            $('body').delegate('#lmvt-reset', 'click', function () {
                $('.selectpicker').selectpicker('deselectAll');
                mActiveLedger = -1;
                $('#alfie-query-Code').val('');
                mNameLedger = '';
            });
            //设备台帐查询
            $('body').delegate('#lmvt-search', 'click', function () {
                mActiveLedger = $('#alfie-query-status').val();
                mNameLedger = $('#alfie-query-Code').val();

                model.com.refresh();
            });

            //数据字典新增
            $('body').delegate('#alfie-add-level-Date', 'click', function () {

                //将Json数据中的数据值改成对应默认值，然后传入进去
                DEFAULT_VALUE_D = {
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
                $('body').append($com.modal.show(DEFAULT_VALUE_D, KEYWORD_Dictionary, '新增设备台帐', function (rst) {
                    //调用插入函数然后用load刷新数据源

                    if (!rst || $.isEmptyObject(rst))
                        return false;
                    var _data = {
                        ID: 0,
                        Name: rst.Name,
                        DeviceID: DeviceID,
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
                    for (var i = 0; i < mDataDictionary.length; i++) {
                        if (rst.Name == mDataDictionary[i].Name) {
                            alert('新增数据字典已存在！');
                            return false;
                        }
                    }
                    $com.util.deleteLowerProperty(_data);

                    model.com.postDMSDeviceParameter({
                        data: _data,
                    }, function (res) {
                        alert('新增成功！！');
                        model.com.refreshDictionary();
                    });
                }, TypeSource_Dictionary));
            });
            //数据字典修改
            $('body').delegate('.lmvt-resetPencilDictionary', 'click', function () {
                var $this = $(this),
                    wID = Number($this.closest('td').attr('data-value'));

                var SelectData = mDataDictionary.filter((item) => {
                    return item.ID == wID;
                });

                if (!SelectData || !SelectData.length) {
                    alert('请先选择一行数据再试！');
                    return;
                }
                if (SelectData.length != 1) {
                    alert('只能同时对一行数据修改！');
                    return;
                }
                var default_value = {
                    Name: SelectData[0].Name,
                    Protocol: SelectData[0].Protocol,
                    VariableName: SelectData[0].VariableName,
                    DataType: SelectData[0].DataType,
                    DataLength: SelectData[0].DataLength,
                    OPCClass: SelectData[0].OPCClass,
                    KeyChar: SelectData[0].KeyChar,
                    AuxiliaryChar: SelectData[0].AuxiliaryChar,
                    ParameterDesc: SelectData[0].ParameterDesc,
                    DataClass: SelectData[0].DataClass,
                    AnalysisOrder: SelectData[0].AnalysisOrder,
                };
                $('body').append($com.modal.show(default_value, KEYWORD_Dictionary, '修改', function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].Name = rst.Name;
                    SelectData[0].Protocol = rst.Protocol;
                    SelectData[0].DataType = Number(rst.DataType);
                    SelectData[0].AnalysisOrder = Number(rst.AnalysisOrder);
                    SelectData[0].VariableName = rst.VariableName;
                    SelectData[0].DataLength = rst.DataLength;
                    SelectData[0].OPCClass = rst.OPCClass;
                    SelectData[0].KeyChar = rst.KeyChar;
                    SelectData[0].AuxiliaryChar = rst.AuxiliaryChar;
                    SelectData[0].DataClass = rst.DataClass;
                    SelectData[0].ParameterDesc = rst.ParameterDesc;
                    $com.util.deleteLowerProperty(SelectData[0]);
                    model.com.postDMSDeviceParameter({
                        data: SelectData[0],
                    }, function (res) {
                        alert('修改成功！！');
                        model.com.refreshDictionary();
                    });

                }, TypeSource_Dictionary));
            });
            //数据字典删除
            $('body').delegate('.lmvt-deleteDictionary', 'click', function () {
                // var SelectData = $com.table.getSelectionData($(".l-containe-canvas-table .l-Ledger-body"), "ID", AllLedger);

                var $this = $(this),
                    wID = Number($this.closest('td').attr('data-value'));

                var SelectData = mDataDictionary.filter((item) => {
                    return item.ID == wID;
                });

                if (!SelectData || !SelectData.length) {
                    alert('至少选择一行数据再试！');
                    return;
                }
                if (SelectData[0].Active != 0) {
                    alert('已激活或者禁用数据无法删除！');
                    return;
                }

                if (!confirm('已选择' + SelectData.length + '条数据，确定将其删除？')) {
                    return;
                }

                model.com.DeleteDMSDeviceParameter({
                    data: SelectData,
                }, function (res) {
                    alert('删除成功！！');
                    model.com.refreshDictionary();
                });
            });
            //数据字典激活 禁用
            $('body').delegate('.ActiveSubmitDictionary', 'click', function () {
                var $this = $(this),
                    wActiveID = Number($this.attr('data-value'));
                wID = Number($this.attr('data-id'));

                var SelectData = mDataDictionary.filter((item) => {
                    return item.ID == wID;
                });

                if (!SelectData || !SelectData.length) {
                    alert('请先选择一行数据再试！');
                    return;
                }
                if (wActiveID == 1) {
                    wActiveID = 2;
                } else {
                    wActiveID = 1;
                }

                model.com.ActiveDMSDeviceParameter({
                    Active: wActiveID,
                    data: SelectData,
                }, function (res) {
                    alert('操作成功！');
                    model.com.refreshDictionary();
                });
            });

            //数据字典导入

            //导入
            $('body').delegate('#lmvt-materialRecord-input', 'click', function () {
                $('#input-file').val('');
                $('#input-file').click();
            });
            $('body').delegate('#input-file', 'input', function () {
                var $this = $(this);

                if (this.files.length == 0)
                    return;


                if (!extLimit(['xlsx', 'xls']).has(this.files[0].name)) {
                    alert('请上传正确的Excel文件！');
                    clearFiles();
                    return;
                }
                var fileData = this.files[0];

                var form = new FormData();
                form.append('file', fileData);

                model.com.postImportExcel(form, function (res) {
                    if (!res)
                        return;
                    // res.list.splice(0, 1);//删除第一行
                    var list = res.list,
                        rst = [];
                    if (list) {

                        var postData = res.list;

                        var DataParams = $com.table.postExportParams(postData, $('.table-partDictionary>table'));
                        var arr1 = [];
                        var arr1List = [];
                        for (var i = 0; i < DataParams.length; i++) {
                            arr1.push(DataParams[i].Code);
                            arr1List.push(DataParams[i]);
                        }

                        var arr2 = [];
                        var arr2List = [];
                        for (var i = 0; i < arr1.length; i++) {
                            if (arr2.indexOf(arr1[i]) == -1) {
                                arr2.push(arr1[i]);
                                arr2List.push(arr1List[i]);
                            }
                        }

                        var list = model.com.getNewList(CheckDataCode, arr2List);
                        if (list.length != arr1List.length) {
                            if (!confirm('导入数据重复' + '，确定是否继续？')) {
                                return false;
                            }

                        }

                        if (list.length < 1) {
                            alert('导入数据全部存在！');
                            return;
                        }
                        var getNewList = [];
                        $.each(list, function (i, item) {
                            if (item.DeviceNo == AssetNoString) {
                                item.Name = item.Name;
                                item.Code = item.Code;
                                // item.Remark = item.Remark;
                                item.DeviceID = DeviceID;
                                if (item.AnalysisOrder.length != 0) {
                                    item.AnalysisOrder = Number(item.AnalysisOrder);
                                } else {
                                    item.AnalysisOrder = 0;
                                }

                                item.DeviceName = item.DeviceName;
                                item.DeviceNo = item.DeviceNo;
                                item.Protocol = item.Protocol + '';
                                item.VariableName = item.VariableName + '';

                                item.DataLength = Number(item.DataLength);
                                item.OPCClass = item.OPCClass + '';
                                item.KeyChar = item.KeyChar + '';
                                item.AuxiliaryChar = item.AuxiliaryChar + '';
                                // item.DataClass = item.DataClassText;
                                // item.DataClassText = item.DataClassText + "";
                                if (item.DataClassText == '状态') {
                                    item.DataClass = 1;
                                } else if (item.DataClassText == '报警') {
                                    item.DataClass = 2;
                                } else if (item.DataClassText == '参数') {
                                    item.DataClass = 3;
                                }
                                if (item.DataTypeText == 'int' || item.DataTypeText == 'Int') {
                                    item.DataType = 2;
                                } else if (item.DataTypeText == 'bool' || item.DataTypeText == 'Bool') {
                                    item.DataType = 1;
                                } else if (item.DataTypeText == 'string' || item.DataTypeText == 'String') {
                                    item.DataType = 3;
                                } else if (item.DataTypeText == 'float' || item.DataTypeText == 'Float') {
                                    item.DataType = 4;
                                } else if (item.DataTypeText == 'double' || item.DataTypeText == 'Double') {
                                    item.DataType = 5;
                                }
                                item.Active = Number(item.Active);
                                item.ID = 0;
                                getNewList.push(item);
                            }


                        });
                        var a = 0;
                        $com.app.loading();
                        var WhileAdd = function () {
                            model.com.postDMSDeviceParameter({
                                data: getNewList[a],
                            }, function (res) {
                                a++;

                                if (a == getNewList.length) {
                                    $com.app.loaded();

                                    alert('导入成功');
                                    model.com.refreshDictionary();
                                } else {
                                    WhileAdd();
                                }
                            });

                        };
                        if (getNewList.length <= 0) {
                            alert('导入数据为空！！！');
                        } else {
                            WhileAdd();
                        }

                    }

                });

                function clearFiles() {
                    self.value = '';
                }

                function extLimit(exts) {
                    return {
                        has: function (file) {
                            var arr = file.split('.'),
                                ext = arr[arr.length - 1].toLowerCase();

                            return exts.indexOf(ext) > -1 ? true : false;
                        },
                    };
                }
            });

            //导出
            $('body').delegate('#zace-exportApproval-level', 'click', function () {
                var $table = $('.table-partApproval'),
                    fileName = '数据字典.xls',
                    Title = '数据字典';
                var params = $com.table.getExportParams($table, fileName, Title);

                if (params.data.length < 1) {
                    params.data = mDataDictionary;
                }

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;

                    if (src.indexOf('iPlantSCADA') != -1) {
                        window.open(src);
                        alert('导出成功');
                    } else {
                        window.open('/iPlantSCADA' + src);
                    }
                });
            });


            //数据字典重置
            $('body').delegate('#lmvt-resetDictionary', 'click', function () {
                $('.selectpicker').selectpicker('deselectAll');
                $('#alfie-query-statusDictionary').val('1');
                $('#alfie-query-Dictionary').val('');
                mNameDictionary = '';
            });
            //数据字典查询
            $('body').delegate('#lmvt-searchDictionary', 'click', function () {
                mActiveDictionary = $('#alfie-query-statusDictionary').val();
                mNameDictionary = $('#alfie-query-Dictionary').val();
                mDataType = $('#alfie-query-DataType').val();
                mDataClassify = $('#alfie-query-DataClassify').val();
                model.com.refreshDictionary();
            });

            //数据字典返回
            $('body').delegate('#alfie-add-level-back', 'click', function () {
                $('.zzzb').hide();
                $('.zzza').show();
                $('.zzzc').hide();
                $('.zzzd').hide();
                $(window).resize();

            });


            //查看设备类型
            $('body').delegate('.alfie-type-level', 'click', function () {
                $('.zzzb').show();
                $('.zzza').hide();
                $('.zzzc').hide();
                $('.zzzd').hide();
                $(window).resize();
                model.com.refreshType();
            });
            //查看设备模型
            $('body').delegate('.alfie-model-level', 'click', function () {
                $('.zzzb').hide();
                $('.zzza').hide();
                $('.zzzc').show();
                $('.zzzd').hide();
                $(window).resize();

                model.com.getDMSDeviceType({
                    Active: 1,
                }, function (res) {
                    TypeSource_model.DeviceType = [{name: '无', value: 0}];
                    $.each(res.list, function (i, item) {
                        TypeSource_model.DeviceType.push({
                            name: item.Name,
                            value: item.ID,
                        });
                    });
                    model.com.refreshModel();
                });
            });
            //查看设备台帐
            $('body').delegate('.alfie-device-level', 'click', function () {
                $('.zzzb').hide();
                $('.zzza').show();
                $('.zzzc').hide();
                $('.zzzd').hide();
                $(window).resize();
            });

            //设备类型新增
            $('body').delegate('#alfie-add-level-type', 'click', function () {
                //将Json数据中的数据值改成对应默认值，然后传入进去
                DEFAULT_VALUE_D = {
                    Name: '',
                    Remark: '',
                };
                $('body').append($com.modal.show(DEFAULT_VALUE_D, KEYWORD_type, '新增设备类型', function (rst) {
                    //调用插入函数然后用load刷新数据源

                    if (!rst || $.isEmptyObject(rst))
                        return false;
                    var _data = {
                        ID: 0,
                        Name: rst.Name,
                        Active: 0,
                        Remark: rst.Remark,
                    };
                    for (var i = 0; i < mDataType.length; i++) {
                        if (rst.Name == mDataType[i].Name) {
                            alert('新增设备类型已存在！');
                            return false;
                        }
                    }

                    $com.util.deleteLowerProperty(_data);
                    model.com.UpdateDMSDeviceType({
                        data: _data,
                    }, function (res) {
                        alert('新增成功！！');
                        model.com.refreshType();
                    });
                }, TypeSource_type));
            });
            //设备类型修改
            $('body').delegate('.lmvt-resetPencilType', 'click', function () {

                var $this = $(this),
                    wID = Number($this.closest('td').attr('data-value'));

                var SelectData = mDataType.filter((item) => {
                    return item.ID == wID;
                });

                if (!SelectData || !SelectData.length) {
                    alert('请先选择一行数据再试！');
                    return;
                }
                if (SelectData.length != 1) {
                    alert('只能同时对一行数据修改！');
                    return;
                }
                var default_value = {
                    Name: SelectData[0].Name,
                    Remark: SelectData[0].Remark,
                };
                $('body').append($com.modal.show(default_value, KEYWORD_type, '修改', function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].Name = rst.Name;
                    SelectData[0].Remark = rst.Remark;
                    $com.util.deleteLowerProperty(SelectData[0]);
                    model.com.UpdateDMSDeviceType({
                        data: SelectData[0],
                    }, function (res) {
                        alert('修改成功！！');
                        model.com.refreshType();
                    });

                }, TypeSource_type));
            });
            //设备类型删除
            $('body').delegate('.lmvt-deleteType', 'click', function () {

                var $this = $(this),
                    wID = Number($this.closest('td').attr('data-value'));

                var SelectData = mDataType.filter((item) => {
                    return item.ID == wID;
                });

                if (!SelectData || !SelectData.length) {
                    alert('至少选择一行数据再试！');
                    return;
                }
                if (SelectData[0].Active != 0) {
                    alert('已激活或者禁用数据无法删除！');
                    return;
                }

                if (!confirm('已选择' + SelectData.length + '条数据，确定将其删除？')) {
                    return;
                }

                model.com.DeleteDMSDeviceType({
                    data: SelectData,
                }, function (res) {
                    alert('删除成功！！');
                    model.com.refreshType();
                });
            });
            //设备类型激活 禁用
            $('body').delegate('.ActiveSubmitType', 'click', function () {
                var $this = $(this),
                    wActiveID = Number($this.attr('data-value'));
                wID = Number($this.attr('data-id'));

                var SelectData = mDataType.filter((item) => {
                    return item.ID == wID;
                });

                if (!SelectData || !SelectData.length) {
                    alert('请先选择一行数据再试！');
                    return;
                }
                if (wActiveID == 1) {
                    wActiveID = 2;
                } else {
                    wActiveID = 1;
                }

                model.com.ActiveDMSDeviceType({
                    Active: wActiveID,
                    data: SelectData,
                }, function (res) {
                    alert('操作成功！');
                    model.com.refreshType();
                });
            });

            //设备台帐重置
            $('body').delegate('#lmvt-resetType', 'click', function () {
                $('.selectpicker').selectpicker('deselectAll');
                mActiveType = -1;
                $('#alfie-query-CodeType').val('');
                mNameType = '';
            });
            //设备台帐查询
            $('body').delegate('#lmvt-searchType', 'click', function () {
                mActiveType = $('#alfie-query-statusType').val();
                mNameType = $('#alfie-query-CodeType').val();
                model.com.refreshType();
            });


            //设备型号新增
            $('body').delegate('#alfie-add-level-model', 'click', function () {
                //将Json数据中的数据值改成对应默认值，然后传入进去
                DEFAULT_VALUE_D = {
                    Name: '',
                    Remark: '',
                    DeviceType: 0,
                };
                $('body').append($com.modal.show(DEFAULT_VALUE_D, KEYWORD_model, '新增设备型号', function (rst) {
                    //调用插入函数然后用load刷新数据源

                    if (!rst || $.isEmptyObject(rst))
                        return false;
                    var _data = {
                        ID: 0,
                        Name: rst.Name,
                        DeviceType: Number(rst.DeviceType),
                        Active: 0,
                        Remark: rst.Remark,
                    };
                    for (var i = 0; i < mDataModel.length; i++) {
                        if (rst.Name == mDataModel[i].Name) {
                            alert('新增设备型号已存在！');
                            return false;
                        }
                    }

                    $com.util.deleteLowerProperty(_data);
                    model.com.UpdateDMSDeviceModel({
                        data: _data,
                    }, function (res) {
                        alert('新增成功！！');
                        model.com.refreshModel();
                    });
                }, TypeSource_model));
            });

            //设备型号修改
            $('body').delegate('.lmvt-resetPencilModel', 'click', function () {

                var $this = $(this),
                    wID = Number($this.closest('td').attr('data-value'));

                var SelectData = mDataModel.filter((item) => {
                    return item.ID == wID;
                });

                if (!SelectData || !SelectData.length) {
                    alert('请先选择一行数据再试！');
                    return;
                }
                if (SelectData.length != 1) {
                    alert('只能同时对一行数据修改！');
                    return;
                }
                var default_value = {
                    Name: SelectData[0].Name,
                    Remark: SelectData[0].Remark,
                    DeviceType: SelectData[0].DeviceType,
                };
                $('body').append($com.modal.show(default_value, KEYWORD_model, '修改', function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].Name = rst.Name;
                    SelectData[0].Remark = rst.Remark;
                    SelectData[0].DeviceType = Number(rst.DeviceType);
                    $com.util.deleteLowerProperty(SelectData[0]);
                    model.com.UpdateDMSDeviceModel({
                        data: SelectData[0],
                    }, function (res) {
                        alert('修改成功！！');
                        model.com.refreshModel();
                    });

                }, TypeSource_model));
            });

            //设备型号删除
            $('body').delegate('.lmvt-deleteModel', 'click', function () {

                var $this = $(this),
                    wID = Number($this.closest('td').attr('data-value'));

                var SelectData = mDataModel.filter((item) => {
                    return item.ID == wID;
                });

                if (!SelectData || !SelectData.length) {
                    alert('至少选择一行数据再试！');
                    return;
                }
                if (SelectData[0].Active != 0) {
                    alert('已激活或者禁用数据无法删除！');
                    return;
                }

                if (!confirm('已选择' + SelectData.length + '条数据，确定将其删除？')) {
                    return;
                }

                model.com.DeleteDMSDeviceModel({
                    data: SelectData,
                }, function (res) {
                    alert('删除成功！！');
                    model.com.refreshModel();
                });
            });

            //设备型号激活 禁用
            $('body').delegate('.ActiveSubmitModel', 'click', function () {
                var $this = $(this),
                    wActiveID = Number($this.attr('data-value'));
                wID = Number($this.attr('data-id'));

                var SelectData = mDataModel.filter((item) => {
                    return item.ID == wID;
                });

                if (!SelectData || !SelectData.length) {
                    alert('请先选择一行数据再试！');
                    return;
                }
                if (wActiveID == 1) {
                    wActiveID = 2;
                } else {
                    wActiveID = 1;
                }

                model.com.ActiveDMSDeviceModel({
                    Active: wActiveID,
                    data: SelectData,
                }, function (res) {
                    alert('操作成功！');
                    model.com.refreshModel();
                });
            });

            //设备型号重置
            $('body').delegate('#lmvt-resetModel', 'click', function () {
                $('.selectpicker').selectpicker('deselectAll');
                mActiveModel = -1;
                $('#alfie-query-model').val('');
                mNameModel = '';
            });
            //设备型号查询
            $('body').delegate('#lmvt-searchModel', 'click', function () {
                mActiveModel = $('#alfie-query-statusModel').val();
                mNameModel = $('#alfie-query-model').val();
                model.com.refreshModel();
            });
        },

        run: function () {
            // 开关
            $('.selectpicker').selectpicker({
                noneSelectedText: '请选择', //默认显示内容
                deselectAllText: '全不选',
                selectAllText: '全选',
            });
            $('#alfie-query-DataClassify').val('1').selectpicker('refresh');
            $('#alfie-query-statusDictionary').val('1').selectpicker('refresh');
            model.com.getBMSRegion({
                ParentID: -1,
                Active: mActive,
                Name: mCode,
            }, function (res) {
                $.each(res.list, function (i, item) {
                    TypeSource_Ledger.AreaID.push({
                        name: item.Name,
                        value: item.ID,
                    });
                });
                model.com.getDMSDeviceModel({
                    Active: 1,
                }, function (resD) {
                    $.each(resD.list, function (i, item) {
                        TypeSource_Ledger.ModelID.push({
                            name: item.Name,
                            value: item.ID,
                        });
                    });
                    model.com.getUser({
                        active: 1,
                    }, function (res) {
                        $.each(res.list, function (i, item) {
                            TypeSource_Ledger.MaintainerIDList.push({
                                name: item.Name,
                                value: item.ID,
                            });
                        });
                        model.com.refresh();
                    });
                });
            });
        },

        com: {
            refreshModel: function () {
                $com.app.loading('数据加载中...');
                model.com.getDMSDeviceModel({
                    Name: mNameModel,
                    Active: mActiveModel,
                }, function (res) {
                    if (res && res.list) {
                        mDataModel = $com.util.Clone(res.list);
                        //数据源字段模板转换
                        var wItem = $com.util.Clone(mDataModel);

                        $.each(wItem, function (i, item) {
                            if (item.Active == 1) {
                                item.Switch = 'switchTrue';
                            } else {
                                item.Switch = 'switchFalse';
                            }
                            item.WID = i + 1;
                        });
                        mCloneDataModel = $com.util.Clone(wItem);
                        $('#femi-model-tbody-item').html($com.util.template(wItem, HTML.TableNode_model));
                        model.com.deleteClass('.lmvt-deleteModel', mDataModel);
                        $com.app.loaded();
                    }
                });
            },
            refreshDictionary: function () {
                $com.app.loading('数据加载中...');
                //查看数据字典
                model.com.getDMSDeviceParameter({
                    Active: mActiveDictionary,
                    Name: mNameDictionary,
                    VariableName: '',
                    DeviceID: DeviceID,
                    DeviceNo: '',
                    DeviceName: '',
                    Protocol: '',
                    OPCClass: '',
                    DataType: mDataType,
                    DataClass: mDataClassify,
                }, function (res) {
                    mDataDictionary = $com.util.Clone(res.list);
                    CheckDataCode = $com.util.Clone(res.list);
                    //数据源字段模板转换
                    var wItem = $com.util.Clone(mDataDictionary);

                    $.each(wItem, function (i, item) {
                        if (item.Active == 1) {
                            item.Switch = 'switchTrue';
                        } else {
                            item.Switch = 'switchFalse';
                        }
                        item.WID = i + 1;
                    });
                    mCloneDataDictionary = $com.util.Clone(wItem);
                    $('#femi-Date-tbody-item').html($com.util.template(wItem, HTML.TableNode_Dictionary));
                    model.com.deleteClass('.lmvt-deleteDictionary', wItem);
                    $com.app.loaded();
                });

            },
            getBMSRegion: function (data, fn, context) {
                var d = {
                    $URI: '/BMSRegion/All',
                    $TYPE: 'Get',

                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //导入
            postImportExcel: function (data, fn, context) {
                var d = {
                    $URI: '/Upload/ImportExcel',
                    $TYPE: 'post',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax_load(data ? $.extend(data, d) : $.extend(d, data), fn, err, context);
            },
            //导出
            postExportExcel: function (data, fn, context) {
                var d = {
                    $URI: '/Upload/ExportExcel',
                    $TYPE: 'post',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getDMSDeviceParameter: function (data, fn, context) {
                var d = {
                    $URI: '/DMSDeviceParameter/All',
                    $TYPE: 'Get',

                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getDMSDeviceModel: function (data, fn, context) {
                var d = {
                    $URI: '/DMSDeviceModel/All',
                    $TYPE: 'Get',

                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //新增修改设备类型
            UpdateDMSDeviceModel: function (data, fn, context) {
                var d = {
                    $URI: '/DMSDeviceModel/Update',
                    $TYPE: 'post',
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //激活禁用设备类型
            ActiveDMSDeviceModel: function (data, fn, context) {
                var d = {
                    $URI: '/DMSDeviceModel/Active',
                    $TYPE: 'post',
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //删除设备类型
            DeleteDMSDeviceModel: function (data, fn, context) {
                var d = {
                    $URI: '/DMSDeviceModel/Delete',
                    $TYPE: 'post',
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getNewList: function (_source, set_data) {
                if (!_source)
                    _source = [];
                if (!set_data)
                    set_data = [];
                var rst = [];
                if (_source.length >= set_data.length) {
                    for (var i = 0; i < _source.length; i++) {
                        var NotOWn = false;
                        for (var j = 0; j < set_data.length; j++) {
                            if (_source[i].Code == set_data[j].Code) {
                                _source.splice(i, 1);
                                set_data.splice(j, 1);
                                NotOWn = true;
                            }
                            if (set_data.length < 1) {
                                break;
                            }
                            if (_source.length < 1) {
                                break;
                            }
                            if (NotOWn) {
                                model.com.getNewList(_source, set_data);
                            }
                        }

                    }
                    rst = set_data;
                    return rst;
                } else {
                    for (var i = 0; i < set_data.length; i++) {
                        var NotOWn = false;
                        for (var j = 0; j < _source.length; j++) {
                            if (set_data[i].Code == _source[j].Code) {
                                set_data.splice(i, 1);
                                _source.splice(j, 1);
                                NotOWn = true;
                            }
                            if (_source.length < 1) {
                                break;
                            }
                            if (set_data.length < 1) {
                                break;
                            }
                            if (NotOWn) {
                                model.com.getNewList(set_data, _source);
                            }
                        }

                    }
                    rst = set_data;
                    return rst;

                }

            },
            //刷新界面
            refreshType: function () {
                $com.app.loading('数据加载中...');
                model.com.getDMSDeviceType({
                    Name: mNameType,
                    Active: mActiveType,
                }, function (res) {
                    if (res && res.list) {
                        mDataType = $com.util.Clone(res.list);
                        //数据源字段模板转换
                        var wItem = $com.util.Clone(mDataType);

                        $.each(wItem, function (i, item) {
                            if (item.Active == 1) {
                                item.Switch = 'switchTrue';
                            } else {
                                item.Switch = 'switchFalse';
                            }
                            item.WID = i + 1;
                        });
                        mCloneDataType = $com.util.Clone(wItem);
                        $('#femi-type-tbody-item').html($com.util.template(wItem, HTML.TableNode_type));
                        model.com.deleteClass('.lmvt-deleteType', mDataType);
                        $com.app.loaded();
                    }
                });
            },

            getDMSDeviceType: function (data, fn, context) {
                var d = {
                    $URI: '/DMSDeviceType/All',
                    $TYPE: 'Get',

                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //新增修改设备类型
            UpdateDMSDeviceType: function (data, fn, context) {
                var d = {
                    $URI: '/DMSDeviceType/Update',
                    $TYPE: 'post',
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //激活禁用设备类型
            ActiveDMSDeviceType: function (data, fn, context) {
                var d = {
                    $URI: '/DMSDeviceType/Active',
                    $TYPE: 'post',
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //删除设备类型
            DeleteDMSDeviceType: function (data, fn, context) {
                var d = {
                    $URI: '/DMSDeviceType/Delete',
                    $TYPE: 'post',
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //刷新界面
            refresh: function () {

                $com.app.loading('数据加载中...');
                model.com.getDMSDeviceLedger({
                    Name: mNameLedger,
                    Active: mActiveLedger,
                }, function (res) {
                    if (res && res.list) {
                        mData = $com.util.Clone(res.list);
                        //数据源字段模板转换
                        var wItem = $com.util.Clone(mData);

                        $.each(wItem, function (i, item) {
                            if (item.Active == 1) {
                                item.Switch = 'switchTrue';
                            } else {
                                item.Switch = 'switchFalse';
                            }
                            item.WID = i + 1;
                        });
                        wItem.forEach(element => {
                            ImagePathArray = [];
                            if (element.ImageIcon.length > 0) {
                                element.ImageIcon.split(',').forEach(element1 => {
                                    SrcListObj = {
                                        SrcList: element1,
                                    };
                                    if (SrcListObj.SrcList != '') {
                                        ImagePathArray.push(SrcListObj);
                                    }
                                });
                                if (ImagePathArray.length > 0) {
                                    element.ImageItem = $com.util.template(ImagePathArray, HTML.IMGLIST);
                                } else {
                                    element.ImageItem = '';
                                }
                            }

                        });
                        mCloneData = $com.util.Clone(wItem);


                        $('#femi-Device-tbody-item').html($com.util.template(wItem, HTML.TableNode_item));
                        model.com.deleteClass('.lmvt-delete', mData);
                        $com.app.loaded();
                    }
                });
            },
            //删除按钮样式的变化
            deleteClass: function (name, data) {
                data.forEach((element, index) => {
                    if (element.Active > 0) {
                        $($(name)[index]).css({'cursor': 'not-allowed', 'color': 'RGB(204, 204, 204)'});
                        $(name)[index].onclick = function (event) {
                            event.stopPropagation();
                        };
                    }
                });
            },
            //获取人员列表
            getUser: function (data, fn, context) {
                var d = {
                    $URI: '/User/All',
                    $TYPE: 'get',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            arryOnea: function (data) {
                var temp = {};
                var arr = [];
                var len = data.length;
                for (var i = 0; i < len; i++) {
                    if (!temp[data[i].value]) {
                        temp[data[i].value] = 'abc';
                        arr.push(data[i]);
                    }
                }
                return arr;
            },

            //获取台帐
            getDMSDeviceLedger: function (data, fn, context) {
                var d = {
                    $URI: '/DMSDeviceLedger/All',
                    $TYPE: 'get',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //新增修改数据字典
            postDMSDeviceParameter: function (data, fn, context) {
                var d = {
                    $URI: '/DMSDeviceParameter/Update',
                    $TYPE: 'post',
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //删除数据字典
            DeleteDMSDeviceParameter: function (data, fn, context) {
                var d = {
                    $URI: '/DMSDeviceParameter/Delete',
                    $TYPE: 'post',
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            ActiveDMSDeviceParameter: function (data, fn, context) {
                var d = {
                    $URI: '/DMSDeviceParameter/Active',
                    $TYPE: 'post',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //新增修改设备台帐
            postDMSDeviceLedger: function (data, fn, context) {
                var d = {
                    $URI: '/DMSDeviceLedger/Update',
                    $TYPE: 'post',
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //删除设备台帐
            DeleteDMSDeviceLedger: function (data, fn, context) {
                var d = {
                    $URI: '/DMSDeviceLedger/Delete',
                    $TYPE: 'post',
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            ActivDeviceLedger: function (data, fn, context) {
                var d = {
                    $URI: '/DMSDeviceLedger/Active',
                    $TYPE: 'post',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
        },
    })
    model.init();
});
