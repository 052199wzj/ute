require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {

    var HTML,
        model,
        AllDeviceInfo,
        DeviceInfoSource,
        SystemList,
        ConsoleList,
        SupplierList,
        SupplierSource,
        DEFAULT_VALUE_Supplier,
        KEYWORD_LIST_Supplier,
        KEYWORD_Supplier,
        FORMATTRT_Supplier,
        TypeSource_Supplier,
        AllSu,
        AllUser,
        AllType,
        AllSpare,
        AllEquip,
        wModelNo,
        DEFAULT_VALUE_Device,
        KEYWORD_LIST_Device,
        KEYWORD_Device,
        FORMATTRT_Device,
        TypeSource_Device,
        DataAll,
        PropertyDataAll,
        DataAllOriginal,
        PropertyDataAllOriginal,
        BOOLEAN,
        PropertyField;
    SystemList = [];
    ConsoleList = [];
    SupplierList = [];
    BOOLEAN = false;
    HTML = {
        DeviceTemplate: [
            '<tr data-color="">',
            '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td style="min-width: 50px" data-title="ModelNo" data-value="{{ModelNo}}">{{ModelNo}}</td>   ',
            '<td style="min-width: 50px" data-title="WorkTypeName" data-value="{{WorkTypeName}}">{{WorkTypeName}}</td> ',
            '<td style="min-width: 50px" data-title="SupplierName" data-value="{{SupplierName}}">{{SupplierName}}</td> ',
            // '<td style="min-width: 50px" data-title="SupplierModelNo" data-value="{{SupplierModelNo}}">{{SupplierModelNo}}</td> ',
            '<td style="min-width: 50px" data-title="SystemName" data-value="{{SystemName}}">{{SystemName}}</td> ',
            '<td style="min-width: 50px" data-title="SystemVersion" data-value="{{SystemVersion}}">{{SystemVersion}}</td>   ',
            '<td style="min-width: 50px" data-title="ControllerName" data-value="{ControllerName}}">{{ControllerName}}</td>  ',
            '<td style="min-width: 50px" data-title="ControllerModel" data-value="{ControllerModel}}">{{ControllerModel}}</td>  ',
            '<td style="min-width: 50px" data-title="Cost" data-value="{Cost}}">{{Cost}}</td>',
            '<td style="min-width: 50px" data-title="Life" data-value="{Life}}">{{Life}}</td>',
            '<td style="min-width: 50px" data-title="LimitCount" data-value="{LimitCount}}">{{LimitCount}}</td>  ',
            '<td style="min-width: 50px" data-title="StockNum" data-value="{StockNum}}">{{StockNum}}</td>  ',
            '<td style="min-width: 50px" data-title="WarningCycle" data-value="{WarningCycle}}">{{WarningCycle}}</td>  ',
            '<td style="min-width: 50px" data-title="WarningNum" data-value="{WarningNum}}">{{WarningNum}}</td>  ',
            '<td style="min-width: 50px" data-title="OperatorID" data-value="{OperatorID}}">{{OperatorID}}</td>  ',
            '<td style="min-width: 50px" data-title="OperateTime" data-value="{OperateTime}}">{{OperateTime}}</td>  ',
            '<td data-title="Active" data-value="{{Active}}"><span class="badge lmvt-badge {{ClassBadge}}">{{Badge}}</span>{{Active}}</td>',
            // '<td data-title="Active" data-value="{{Active}}" >{{Active}}</td>',
            '<td style="max-width: 80px" data-title="Handle" data-value="{{ID}}">',
            '<div class="row">',
            '<div class="col-md-6 {{ISAllowed}}">{{ISAllowedText}}</div>',
            '<div class="col-md-6 lmvt-do-info lmvt-reset">修改</div>',
            '</div></td>',
            '</tr>',
        ].join(""),
        SystemTemplate: [
            '<tr data-color="">',
            '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td>    ',
            '<td style="min-width: 50px" data-title="SystemName" data-value="{{SystemName}}">{{SystemName}}</td>  ',
            '<td style="min-width: 50px" data-title="SystemVersion" data-value="{{SystemVersion}}">{{SystemVersion}}</td>   ',
            '<td style="min-width: 50px" data-title="OperatorID" data-value="{OperatorID}}">{{OperatorID}}</td>  ',
            '<td style="min-width: 50px" data-title="OperateTime" data-value="{OperateTime}}">{{OperateTime}}</td>',
            '<td style="min-width: 50px" data-title="Active" data-value="{{Active}}">{{Active}}</td> ',



            '</tr>',
        ].join(""),
        SupplierTemplate: [
            '<tr data-color="">',
            '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td>    ',
            '<td style="min-width: 50px" data-title="PropertyName" data-value="{{PropertyName}}">{{PropertyName}}</td>   ',
            '<td style="min-width: 50px" data-title="PropertyNo" data-value="{{PropertyNo}}">{{PropertyNo}}</td>  ',
            '<td style="min-width: 50px" data-title="OperatorID" data-value="{OperatorID}}">{{OperatorID}}</td>  ',
            '<td style="min-width: 50px" data-title="OperateTime" data-value="{OperateTime}}">{{OperateTime}}</td>',
            '<td style="min-width: 50px" data-title="Active" data-value="{{Active}}">{{Active}}</td>',

            // '<td style="max-width: 80px" data-title="Handle" data-value="{{ID}}">',
            // '<div class="row">',
            // '<div class="col-md-6 {{ISAllowed}}">{{ISAllowedText}}</div>',
            // '<div class="col-md-6 lmvt-do-info lmvt-reset">修改</div>',
            // '</div></td>',

            '</tr>',
        ].join(""),
        WorkTypeTemplate: [
            '<tr data-color="">',
            '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td>    ',
            '<td style="min-width: 50px" data-title="Name" data-value="{{Name}}">{{Name}}</td>   ',
            '<td style="min-width: 50px" data-title="OperatorID" data-value="{OperatorID}}">{{OperatorID}}</td>  ',
            '<td style="min-width: 50px" data-title="OperateTime" data-value="{OperateTime}}">{{OperateTime}}</td>',
            '<td style="min-width: 50px" data-title="Active" data-value="{{Active}}">{{Active}}</td> ',
            '</tr>',
        ].join(""),
        DeviceEquipSpare: [
            '<tr data-color="">',
            '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td style="min-width: 50px" data-title="DeviceSpareName" data-value="{{DeviceSpareName}}">{{DeviceSpareName}}</td> ',
            '<td style="min-width: 50px" data-title="DeviceModelID" data-value="{{DeviceModelID}}">{{DeviceModelID}}</td> ',
            '<td style="min-width: 50px" data-title="SpareModelID" data-value="{SpareModelID}}">{{SpareModelID}}</td>  ',
            '<td style="min-width: 50px" data-title="EquipNum" data-value="{EquipNum}}">{{EquipNum}}</td>',
            '<td style="min-width: 50px" data-title="OperatorID" data-value="{OperatorID}}">{{OperatorID}}</td>  ',
            '<td style="min-width: 50px" data-title="OperateTime" data-value="{OperateTime}}">{{OperateTime}}</td>',
            '<td style="min-width: 50px" data-title="Active" data-value="{Active}}">{{Active}}</td>',
            '</tr>',
        ].join(""),
    };
    //设备
    (function () {
        KEYWORD_LIST_Device = [
            "ModelNo|型号*",
            "DeviceWorkType|工作类型|ArrayOne",
            //字表供应商
            "SupplierName|供应商|ArrayOne",
            "SupplierNo|供应商编号",
            //子表控制器
            "ConName|名称|ArrayOne",
            "CustomName|自定义名称",
            "ConNo|类型",
            //子表可装备件
            "DeviceSpareName|名称",
            "DeviceModelID|设备型号|ArrayOne",
            "SpareModelID|备件型号|ArrayOne",
            "EquipOptions|可选备件列表|Array",
            "EquipNum|数量",
            //字表系统
            "SystName|系统名称|ArrayOne",
            "SysCustomName|自定义系统名称",
            "SysNo|系统版本",
            //字表加工类型
            "Name|名称",

            "SupplierID|供应商|ArrayOneControl",
            "SupplierModelNo|供应商型号|ArrayOneControl|SupplierID",
            "SystemID|系统名称|ArrayOneControl",
            "SystemVersion|系统版本|ArrayOneControl|SystemID",
            "ControllerName|控制器|ArrayOneControl",
            "ControllerModel|控制器类型|ArrayOneControl|ControllerName",
            "Cost|设备价值",
            "Life|设备寿命",
            "LimitCount|设备加工限制",
            "StockNum|库存数量",
            "WarningCycle|预警周期",
            "WarningNum|预警加工剩余数",
            "OperateTime|操作时刻|DataTime",
            "Active|状态|ArrayOne",
        ];
        FORMATTRT_Device = {};
        KEYWORD_Device = {};
        DEFAULT_VALUE_Device = {
            ModelNo: "",
            DeviceWorkType: 0,
            SupplierID: 0,
            // SupplierModelNo: 0,
            SystemID: 0,
            SystemVersion: "",
            ControllerName: 0,
            ControllerModel: 0,
            Cost: 0,
            Life: 0,
            LimitCount: 0,
            StockNum: 0,
            WarningCycle: 0,
            WarningNum: 0,
            // Active: 0,
        };

        TypeSource_Device = {
            DeviceWorkType: [
                {
                    name: "无",
                    value: 0
                }
            ],
            SupplierName: [
                {
                    name: "无",
                    value: 0
                }
            ],
            SupplierID: [
                {
                    name: "无",
                    value: 0
                }
            ],
            SupplierModelNo: [
                {
                    name: "无",
                    value: 0
                }
            ],
            SystemID: [
                {
                    name: "无",
                    value: 0
                }
            ],
            SystemVersion: [
                {
                    name: "无",
                    value: 0
                }
            ],
            ControllerName: [
                {
                    name: "无",
                    value: 0
                }
            ],
            ControllerModel: [
                {
                    name: "无",
                    value: 0
                }
            ],
            Active: [

                {
                    name: "激活",
                    value: 0
                },
                {
                    name: "禁用",
                    value: 1
                },
            ],
            ConName: [
                {
                    name: "无",
                    value: 0
                }
            ],
            SystName: [
                {
                    name: "无",
                    value: 0
                }
            ],
            DeviceModelID: [],
            SpareModelID: [],
            EquipOptions: [],
        };
        $.each(KEYWORD_LIST_Device, function (i, item) {
            var detail = item.split("|");
            KEYWORD_Device[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_Device[detail[0]] = $com.util.getFormatter(TypeSource_Device, detail[0], detail[2]);
            }
        });
    })();
    //设备初始加载
    (function () {
        KEYWORD_LIST_Supplier = [
            "SupplierID|可选供应商|ArrayOne",
            "InputSupplierName|新增供应商",
            "InputSupplierModelNo|新增供应商设备型号编码|",
            "Active|状态|ArrayOne",
            "OperatorID|录入人|ArrayOne",
            "DeviceWorkType|设备类型|ArrayOne",
            "DeviceModelID|设备型号|ArrayOne",
            "SpareModelID|备件型号|ArrayOne",
            "OperateTime|操作时刻|DateTime",
        ];
        KEYWORD_LIST_Supplier1 = [
            "OperatorID|录入人|ArrayOne",
            "Active|状态|ArrayOne",
            "OperateTime|操作时刻|DateTime",
        ];
        KEYWORD_LIST_Supplier2 = [
            "OperatorID|录入人|ArrayOne",
            "Active|状态|ArrayOne",
            "OperateTime|操作时刻|DateTime",
        ];
        KEYWORD_LIST_Supplier3 = [
            "OperatorID|录入人|ArrayOne",
            "Active|状态|ArrayOne",
            "OperateTime|操作时刻|DateTime",
        ];
        KEYWORD_LIST_Supplier4 = [
            "OperatorID|录入人|ArrayOne",
            "Active|状态|ArrayOne",
            "OperateTime|操作时刻|DateTime",
        ];
        FORMATTRT_Supplier = {};
        FORMATTRT_Supplier1 = {};
        FORMATTRT_Supplier2 = {};
        FORMATTRT_Supplier3 = {};
        FORMATTRT_Supplier4 = {};
        KEYWORD_Supplier = {};
        KEYWORD_Supplier1 = {};
        KEYWORD_Supplier2 = {};
        KEYWORD_Supplier3 = {};
        KEYWORD_Supplier4 = {};
        DEFAULT_VALUE_Supplier = {
            SupplierID: "",
            InputSupplierName: "",
            InputSupplierModelNo: "",
            Active: 0,

        };

        TypeSource_Supplier = {
            Active: [
                {
                    name: "保存",
                    value: 0
                }, {
                    name: "启用",
                    value: 1
                }, {
                    name: "禁用",
                    value: 2
                }],
            SupplierID: [],
            OperatorID: [],
            DeviceWorkType: [],
            DeviceModelID: [],
            SpareModelID: []
        };
        TypeSource_Supplier1 = {
            Active: [
                {
                    name: "保存",
                    value: 0
                }, {
                    name: "启用",
                    value: 1
                }, {
                    name: "禁用",
                    value: 2
                }],
            OperatorID: [],

        };
        TypeSource_Supplier2 = {
            Active: [
                {
                    name: "保存",
                    value: 0
                }, {
                    name: "启用",
                    value: 1
                }, {
                    name: "禁用",
                    value: 2
                }],
            OperatorID: [],
        };
        TypeSource_Supplier3 = {
            Active: [
                {
                    name: "保存",
                    value: 0
                }, {
                    name: "启用",
                    value: 1
                }, {
                    name: "禁用",
                    value: 2
                }],
            OperatorID: [],
        };
        TypeSource_Supplier4 = {
            Active: [
                {
                    name: "保存",
                    value: 0
                }, {
                    name: "启用",
                    value: 1
                }, {
                    name: "禁用",
                    value: 2
                }],
            OperatorID: [],
        };
        $.each(KEYWORD_LIST_Supplier, function (i, item) {
            var detail = item.split("|");
            KEYWORD_Supplier[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_Supplier[detail[0]] = $com.util.getFormatter(TypeSource_Supplier, detail[0], detail[2]);
            }

        });
        $.each(KEYWORD_LIST_Supplier1, function (i, item) {
            var detail = item.split("|");
            KEYWORD_Supplier1[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_Supplier1[detail[0]] = $com.util.getFormatter(TypeSource_Supplier1, detail[0], detail[2]);
            }

        });
        $.each(KEYWORD_LIST_Supplier2, function (i, item) {
            var detail = item.split("|");
            KEYWORD_Supplier2[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_Supplier2[detail[0]] = $com.util.getFormatter(TypeSource_Supplier2, detail[0], detail[2]);
            }

        });
        $.each(KEYWORD_LIST_Supplier3, function (i, item) {
            var detail = item.split("|");
            KEYWORD_Supplier3[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_Supplier3[detail[0]] = $com.util.getFormatter(TypeSource_Supplier3, detail[0], detail[2]);
            }
        });
        $.each(KEYWORD_LIST_Supplier4, function (i, item) {
            var detail = item.split("|");
            KEYWORD_Supplier4[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_Supplier4[detail[0]] = $com.util.getFormatter(TypeSource_Supplier4, detail[0], detail[2]);
            }
        });
    })();

    model = $com.Model.create({
        name: '设备信息',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            //跳转可装备件
            $("body").delegate("#epuipList", "click", function () {
                var vdata = { 'header': '可装备件', 'id': 'EpuipApplyList', 'href': './device_manage/epuipApplyList.html', 'src': './static/images/menu/deviceManage/sparePart.png' };
                window.parent.iframeHeaderSet(vdata);
            });
            //导入
            $("body").delegate("#lmvt-deviceinfo-input", "click", function () {
                $("#input-file").val("");
                $("#input-file").click();
            });
            $("body").delegate("#input-file", "change", function () {
                var $this = $(this);

                if (this.files.length == 0)
                    return;
                var fileData = this.files[0];

                var form = new FormData();
                form.append("file", fileData);

                model.com.postImportExcel(form, function (res) {
                    if (!res)
                        return;
                    var list = res.list,
                        rst = [];
                    if (list) {
                        var postData = res.list;
                        var DataParams = $com.table.postExportParams(postData, $(".deviceinfo-table"));
                        //保存
                        //$.each(DataParams, function (i, item) {
                        //    model.com.postWMSStockSave({
                        //        data: item,
                        //    }, function (res) {
                        //        alert("导入成功！！");
                        //    });
                        //});
                        model.com.refresh();
                    }
                });

            });
            //导出
            $("body").delegate("#lmvt-deviceinfo-output", "click", function () {
                var $table = $(".deviceinfo-table"),
                    fileName = "设备信息.xls",
                    Title = "设备信息";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });
            });
            //模糊查询
            $("body").delegate("#femi-search-text-ledger", "change", function () {
                var $this = $(this),
                    value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $(".lmvt-device-body").children("tr").show();
                else
                    $com.table.filterByLikeString($(".lmvt-device-body"), DataAll, value, "ID");
            });
            //条件查询
            $("body").delegate("#lmvt-left-check", "click", function () {
                var default_value = {
                    DeviceWorkType: 0, SupplierID: 0, SupplierModelNo: 0,
                    SystemID: 0, SystemVersion: 0, ControllerName: 0,
                    ControllerModel: 0
                }
                $("body").append($com.modal.show(default_value, KEYWORD_Device, "查询", function (rst) {
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    model.com.getDeviceInfoAll({
                        DeviceWorkType: rst.DeviceWorkType, SupplierID: rst.SupplierID, ModelPropertyID: rst.SupplierModelNo,
                        SystemID: rst.SystemID, SystemPropertyID: rst.SystemVersion, ControllerID: rst.ControllerName,
                        ControllerPropertyID: rst.ControllerModel, Active: -1, SupplierModelNo: "",
                        SystemVersion: "", ControllerModel: "", Type: 1
                    }, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];
                        if (list) {
                            AllDeviceInfo = res.list;
                            DeviceInfoSource = res.list;
                            AllDeviceInfo = $com.util.Clone(AllDeviceInfo);
                        }
                        for (var i = 0; i < AllDeviceInfo.length; i++) {
                            for (var j = 0; j < AllUser.length; j++) {
                                if (AllDeviceInfo[i].OperatorID == AllUser[j].ID) {
                                    TypeSource_Supplier.OperatorID.push({ name: AllUser[j].Name, value: AllUser[j].ID });
                                }
                            }
                            for (var n = 0; n < AllType.length; n++) {
                                if (AllDeviceInfo[i].DeviceWorkType == AllType[n].ID) {
                                    TypeSource_Supplier.DeviceWorkType.push({ name: AllType[n].Name, value: AllType[n].ID });
                                }
                            }

                        }
                        $.each(AllDeviceInfo, function (i, item) {

                            item.Badge = " ";

                            if (item.Active == 1) {
                                item.ISAllowedText = "禁用";
                                item.ISAllowed = "lmvt-allowed-delete";
                                item.ClassBadge = "lmvt-activeBadge";
                            } else if (item.Active == 2) {
                                item.ISAllowedText = "启用";
                                item.ISAllowed = "lmvt-do-active";
                                item.ClassBadge = "lmvt-forbiddenBadge";
                            } else {
                                item.ISAllowedText = "启用";
                                item.ISAllowed = "lmvt-do-active";
                                item.ClassBadge = "lmvt-defBadge";
                            }


                            for (var p in item) {
                                if (!FORMATTRT_Supplier[p])
                                    continue;
                                item[p] = FORMATTRT_Supplier[p](item[p]);
                            }
                        });
                        $(".lmvt-device-body").html($com.util.template(AllDeviceInfo, HTML.DeviceTemplate));
                        $(".lmvt-device-body tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });

                    });
                }, TypeSource_Device));
            });
            //刷新页面
            $("body").delegate("#lmvt-deviceinfo-refresh", "click", function () {
                model.com.load();
            });
            //新增
            $("body").delegate("#lmvt-deviceinfo-add", "click", function () {
                //将Json数据中的数据值改成对应默认值，然后传入进去
                $("body").append($com.modal.show(DEFAULT_VALUE_Device, KEYWORD_Device, "新增", function (rst) {
                    //调用插入函数 

                    if (!rst || $.isEmptyObject(rst))
                        return;
                    var _data = {
                        ID: 0,
                        ModelNo: rst.ModelNo,

                        WorkType: Number(rst.DeviceWorkType),

                        ModelPropertyID: Number(rst.SupplierID),
                        SystemPropertyID: Number(rst.SystemVersion),
                        ControllerPropertyID: Number(rst.ControllerModel),
                        Cost: Number(rst.Cost),
                        Life: Number(rst.Life),
                        LimitCount: Number(rst.LimitCount),
                        StockNum: Number(rst.StockNum),
                        WarningCycle: Number(rst.WarningCycle),
                        WarningNum: Number(rst.WarningNum),
                        // Active: rst.Active,
                    };
                    for (var i = 0; i < DataAllOriginal.length; i++) {
                        if (_data.ModelNo == DataAllOriginal[i].ModelNo) {
                            alert("设备型号不能重复！");
                            return;
                        }
                    }
                    model.com.add({
                        data: _data
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                    })
                }, TypeSource_Device));
            });
            //新增供应商
            $("body").delegate("#femi-add-property2", "click", function () {
                //将Json数据中的数据值改成对应默认值，然后传入进去
                var default_value = {

                    SupplierName: 0,
                    // SupplierNo: "",
                    // Active: 0,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Device, "新增", function (rst) {
                    //调用插入函数 

                    if (!rst || $.isEmptyObject(rst))
                        return;

                    // var cat = _this.OrderGrade.filter((item) => { return item.ID == Number(rst.SupplierName) })[0];
                    // AllSu

                    var _data = {
                        ID: 0,
                        PropertyNo: rst.SupplierNo,
                        PropertyID: Number(rst.SupplierName),
                        PropertyName: "",
                        Active: Number(rst.Active),
                        DSType: 1,
                        DevicePropertyType: 1,
                    };
                    for (var i = 0; i < AllSu.length; i++) {
                        if (_data.PropertyID == AllSu[i].ID) {
                            _data.PropertyName = AllSu[i].SupplierName;
                            _data.PropertyNo = AllSu[i].SupplierCode;
                        }
                    }
                    for (var n = 0; n < SupplierList.length; n++) {
                        if (_data.PropertyID == SupplierList[n].PropertyID && _data.PropertyNo == SupplierList[n].PropertyNo) {
                            alert("新增失败，请检查是否有重复！");
                            return;
                        }
                    }
                    model.com.addProperty({
                        data: _data
                    }, function (res) {
                        alert("新增成功");
                        model.com.load_supplier();
                    })
                }, TypeSource_Device));
            });
            //新增控制器
            $("body").delegate("#femi-add-property4", "click", function () {
                //将Json数据中的数据值改成对应默认值，然后传入进去
                var default_value = {
                    //"ConName|名称|ArrayOne",
                    //"CustomName|自定义名称",
                    //"ConNo|型号",
                    ConName: 0,
                    CustomName: "",
                    ConNo: "",
                    // Active: 0,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Device, "新增", function (rst) {
                    //调用插入函数 

                    if (!rst || $.isEmptyObject(rst))
                        return;
                    var _data = {
                        ID: 0,
                        PropertyNo: rst.ConNo,
                        ProID: Number(rst.ConName),
                        PropertyName: "",
                        PropertyID: 0,
                        CustomName: rst.CustomName,
                        Active: Number(rst.Active),
                        DSType: 1,
                        DevicePropertyType: 3,
                    };
                    if (_data.ProID != 0 && _data.CustomName) {
                        alert("自定义名称和选用名称不能同时使用！");
                        return;
                    }
                    if (_data.ProID != 0 && !_data.CustomName) {
                        _data.PropertyID = _data.ProID;
                        for (var i = 0; i < ConsoleList.length; i++) {
                            if (_data.PropertyID == ConsoleList[i].PropertyID) {
                                _data.PropertyName = ConsoleList[i].PropertyName;
                            }
                        }
                    }
                    if (_data.ProID == 0 && _data.CustomName) {
                        _data.PropertyName = _data.CustomName;
                        var maxID = 0;
                        for (var i = 0; i < ConsoleList.length; i++) {
                            if (ConsoleList[i].PropertyID > maxID) {
                                maxID = ConsoleList[i].PropertyID;
                            }
                        }
                        _data.PropertyID = maxID + 1;
                    }
                    for (var n = 0; n < ConsoleList.length; n++) {
                        if (_data.PropertyID == ConsoleList[n].PropertyID && _data.PropertyNo == ConsoleList[n].PropertyNo) {
                            alert("新增失败，请检查是否有重复！");
                            return;
                        }
                    }
                    model.com.addProperty({
                        data: _data
                    }, function (res) {
                        alert("新增成功");
                        model.com.load_console();
                    })
                }, TypeSource_Device));
            });
            //新增系统
            $("body").delegate("#femi-add-property1", "click", function () {
                //将Json数据中的数据值改成对应默认值，然后传入进去
                var default_value = {
                    //"SystName|系统名称|ArrayOne",
                    //"SysCustomName|自定义系统名称",
                    //"SysNo|系统版本",
                    SystName: 0,
                    SysCustomName: "",
                    SysNo: "",
                    // Active: 0,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Device, "新增", function (rst) {
                    //调用插入函数 

                    if (!rst || $.isEmptyObject(rst))
                        return;
                    var _data = {
                        ID: 0,
                        PropertyNo: rst.SysNo,
                        ProID: Number(rst.SystName),
                        PropertyName: 0,
                        PropertyID: 0,
                        SysCustomName: rst.SysCustomName,
                        Active: Number(rst.Active),
                        DSType: 1,
                        DevicePropertyType: 2,
                    };
                    if (_data.ProID != 0 && _data.SysCustomName) {
                        alert("自定义名称和选用名称不能同时使用！");
                        return;
                    }
                    if (_data.ProID != 0 && !_data.SysCustomName) {
                        _data.PropertyID = _data.ProID;
                        for (var i = 0; i < SystemList.length; i++) {
                            if (_data.ProID == SystemList[i].PropertyID) {
                                _data.PropertyName = SystemList[i].PropertyName;
                            }
                        }
                    }
                    if (_data.ProID == 0 && _data.SysCustomName) {
                        _data.PropertyName = _data.SysCustomName;
                        var maxID = 0;
                        for (var i = 0; i < SystemList.length; i++) {
                            if (SystemList[i].PropertyID > maxID) {
                                maxID = SystemList[i].PropertyID;
                            }
                        }
                        _data.PropertyID = maxID + 1;
                    }
                    for (var n = 0; n < SystemList.length; n++) {
                        if (_data.PropertyID == SystemList[n].PropertyID && _data.PropertyNo == SystemList[n].PropertyNo) {
                            alert("新增失败，请检查是否有重复！");
                            return;
                        }
                    }
                    model.com.addProperty({
                        data: _data
                    }, function (res) {
                        alert("新增成功");
                        model.com.load_system();
                    })
                }, TypeSource_Device));
            });
            //新增工作类型
            $("body").delegate("#femi-add-property5", "click", function () {
                //将Json数据中的数据值改成对应默认值，然后传入进去
                var default_value = {
                    Name: "",
                    // Active: 0,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Device, "新增", function (rst) {
                    //调用插入函数 

                    if (!rst || $.isEmptyObject(rst))
                        return;
                    var _data = {
                        ID: 0,
                        Name: rst.Name,
                        DSType: 1,
                        Active: rst.Active,
                    };

                    model.com.addType({
                        data: _data
                    }, function (res) {
                        alert("新增成功");
                        model.com.load_type();
                    })
                }, TypeSource_Device));
            });
            //新增可装备件
            $("body").delegate("#femi-add-property3", "click", function () {
                //将Json数据中的数据值改成对应默认值，然后传入进去
                var default_value = {
                    DeviceSpareName: "",
                    //DeviceModelID:0,
                    SpareModelID: 0,
                    EquipNum: 0,
                    EquipOptions: [],
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Device, "新增", function (rst) {
                    //调用插入函数 

                    if (!rst || $.isEmptyObject(rst))
                        return;
                    var _data = {
                        ID: 0,
                        DeviceSpareName: rst.DeviceSpareName,
                        DeviceModelID: wModelNo,
                        SpareModelID: rst.SpareModelID,
                        EquipNum: rst.EquipNum,
                        EquipOptions: rst.EquipOptions,
                    };
                    for (var i = 0; i < AllEquip.length; i++) {
                        if (_data.DeviceModelID == AllEquip[i].DeviceModelID && _data.DeviceSpareName == AllEquip[i].DeviceSpareName) {
                            alert("同设备不能有相同的名称，请更改！");
                            return;
                        }
                    }
                    model.com.addEquip({
                        data: _data
                    }, function (res) {
                        alert("新增成功");
                        model.com.refreshEp();
                    })
                }, TypeSource_Device));
            });
            //修改可装备件
            $("body").delegate("#femi-edit-property3", "click", function () {
                var SelectData = $com.table.getSelectionData($(".lmvt-equip-body"), 'ID', AllEquip);
                if (!SelectData || !SelectData.length) {
                    alert("至少选择一行数据！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能选择一条数据！")
                    return;
                }
                var default_value = {
                    DeviceSpareName: SelectData[0].DeviceSpareName,
                    // DeviceModelID:0,
                    SpareModelID: SelectData[0].SpareModelID,
                    EquipNum: SelectData[0].EquipNum,
                    EquipOptions: SelectData[0].EquipOptions,
                };

                $("body").append($com.modal.show(default_value, KEYWORD_Device, "修改", function (rst) {

                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    var _data = {
                        ID: SelectData[0].ID,
                        DeviceSpareName: rst.DeviceSpareName,
                        DeviceModelID: wModelNo,
                        SpareModelID: rst.SpareModelID,
                        EquipNum: rst.EquipNum,
                        EquipOptions: rst.EquipOptions,
                    };
                    for (var i = 0; i < AllEquip.length; i++) {
                        if (_data.DeviceModelID == AllEquip[i].DeviceModelID && _data.DeviceSpareName == AllEquip[i].DeviceSpareName && _data.ID != AllEquip[i].ID) {
                            alert("同设备不能有相同的名称，请更改！");
                            return;
                        }
                    }
                    model.com.addEquip({
                        data: _data
                    }, function (res) {
                        alert("修改成功");
                        model.com.refreshEp();
                    })
                }, TypeSource_Device));
            });
            //修改工作类型
            $("body").delegate("#femi-edit-property5", "click", function () {
                var SelectData = $com.table.getSelectionData($(".lmvt-type-body"), 'ID', AllType);
                if (!SelectData || !SelectData.length) {
                    alert("至少选择一行数据！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能选择一条数据！")
                    return;
                }
                var default_value = {
                    Name: SelectData[0].Name,
                    // Active: SelectData[0].Active,
                };

                $("body").append($com.modal.show(default_value, KEYWORD_Device, "修改", function (rst) {

                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    var _data = {
                        ID: SelectData[0].ID,
                        Name: rst.Name,
                        DSType: 1,
                        Active: rst.Active,
                    };

                    model.com.addType({
                        data: _data
                    }, function (res) {
                        alert("修改成功");
                        model.com.load_type();
                    })
                }, TypeSource_Device));
            });
            //修改系统
            $("body").delegate("#femi-edit-property1", "click", function () {
                var SelectData = $com.table.getSelectionData($(".lmvt-system-body"), 'ID', SystemList);
                if (!SelectData || !SelectData.length) {
                    alert("至少选择一行数据！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能选择一条数据！")
                    return;
                }
                var default_value = {
                    SystName: SelectData[0].PropertyID,
                    //CustomName: SelectData[0].PropertyName,
                    SysNo: SelectData[0].PropertyNo,
                    // Active: SelectData[0].Active,
                };

                $("body").append($com.modal.show(default_value, KEYWORD_Device, "修改", function (rst) {

                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    var _data = {
                        ID: SelectData[0].ID,
                        PropertyNo: rst.SysNo,
                        PropertyName: "",
                        PropertyID: Number(rst.SystName),
                        Active: Number(rst.Active),
                        DSType: 1,
                        DevicePropertyType: 2,
                    };
                    for (var i = 0; i < SystemList.length; i++) {
                        if (_data.PropertyID == SystemList[i].PropertyID) {
                            _data.PropertyName = SystemList[i].PropertyName;
                        }
                    }
                    for (var n = 0; n < SystemList.length; n++) {
                        if (_data.PropertyID == SystemList[n].PropertyID && _data.PropertyNo == SystemList[n].PropertyNo && _data.ID != SystemList[n].ID) {
                            alert("修改失败，请检查是否有重复！");
                            return;
                        }
                    }
                    model.com.addProperty({
                        data: _data
                    }, function (res) {
                        alert("修改成功");
                        model.com.load_system();
                    })
                }, TypeSource_Device));
            });
            //修改控制器
            $("body").delegate("#femi-edit-property4", "click", function () {
                var SelectData = $com.table.getSelectionData($(".lmvt-equip-body"), 'ID', ConsoleList);
                if (!SelectData || !SelectData.length) {
                    alert("至少选择一行数据！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能选择一条数据！")
                    return;
                }
                var default_value = {
                    ConName: SelectData[0].PropertyID,
                    //CustomName: SelectData[0].PropertyName,
                    ConNo: SelectData[0].PropertyNo,
                    // Active: SelectData[0].Active,
                };

                $("body").append($com.modal.show(default_value, KEYWORD_Device, "修改", function (rst) {

                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    var _data = {
                        ID: SelectData[0].ID,
                        PropertyNo: rst.ConNo,
                        PropertyName: "",
                        PropertyID: Number(rst.ConName),
                        Active: Number(rst.Active),
                        DSType: 1,
                        DevicePropertyType: 3,
                    };
                    for (var i = 0; i < ConsoleList.length; i++) {
                        if (_data.PropertyID == ConsoleList[i].PropertyID) {
                            _data.PropertyName = ConsoleList[i].PropertyName;
                        }
                    }
                    for (var n = 0; n < ConsoleList.length; n++) {
                        if (_data.PropertyID == ConsoleList[n].PropertyID && _data.PropertyNo == ConsoleList[n].PropertyNo && _data.ID != ConsoleList[n].ID) {
                            alert("修改失败，请检查是否有重复！");
                            return;
                        }
                    }
                    model.com.addProperty({
                        data: _data
                    }, function (res) {
                        alert("修改成功");
                        model.com.load_console();
                    })
                }, TypeSource_Device));
            });
            //修改  
            $("body").delegate(".lmvt-reset", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DataAllOriginal.filter((item) => { return item.ID == wID });
                var default_value = {
                    ModelNo: SelectData[0].ModelNo,
                    DeviceWorkType: SelectData[0].WorkType,
                    SupplierID: 0,
                    // SupplierModelNo: SelectData[0].ModelPropertyID,
                    SystemID: 0,
                    SystemVersion: SelectData[0].SystemPropertyID,
                    ControllerName: 0,
                    ControllerModel: SelectData[0].ControllerPropertyID,
                    Cost: SelectData[0].Cost,
                    Life: SelectData[0].Life,
                    LimitCount: SelectData[0].LimitCount,
                    StockNum: SelectData[0].StockNum,
                    WarningCycle: SelectData[0].WarningCycle,
                    WarningNum: SelectData[0].WarningNum,
                    // Active: SelectData[0].Active,
                };
                for (var i = 0; i < SupplierList.length; i++) {
                    if (SelectData[0].ModelPropertyID == SupplierList[i].ID) {
                        default_value.SupplierID = SupplierList[i].PropertyID;
                    }
                }
                for (var i = 0; i < SystemList.length; i++) {
                    if (SelectData[0].SystemPropertyID == SystemList[i].ID) {
                        default_value.SystemID = SystemList[i].PropertyID;
                    }
                }
                for (var i = 0; i < ConsoleList.length; i++) {
                    if (SelectData[0].ControllerPropertyID == ConsoleList[i].ID) {
                        default_value.ControllerName = ConsoleList[i].PropertyID;
                    }
                }
                $("body").append($com.modal.show(default_value, KEYWORD_Device, "修改", function (rst) {
                    
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    SelectData[0].ModelNo = rst.ModelNo;
                    SelectData[0].WorkType = Number(rst.DeviceWorkType);
                    SelectData[0].ModelPropertyID = Number(rst.SupplierID);
                    SelectData[0].SystemPropertyID = Number(rst.SystemVersion);
                    SelectData[0].ControllerPropertyID = Number(rst.ControllerModel),
                        SelectData[0].Cost = Number(rst.Cost),
                        SelectData[0].Life = Number(rst.Life),
                        SelectData[0].LimitCount = Number(rst.LimitCount),
                        SelectData[0].StockNum = Number(rst.StockNum),
                        SelectData[0].WarningCycle = Number(rst.WarningCycle),
                        SelectData[0].WarningNum = Number(rst.WarningNum);


                    for (var i = 0; i < DataAllOriginal.length; i++) {
                        if (SelectData[0].ModelNo == DataAllOriginal[i].ModelNo && SelectData[0].ID != DataAllOriginal[i].ID) {
                            alert("设备型号不能重复！");
                            return;
                        }
                    };

                    $com.util.deleteLowerProperty(SelectData[0]);

                    model.com.add({
                        data: SelectData[0]
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                    });
                }, TypeSource_Device));
            });
            //修改供应商  
            $("body").delegate("#femi-edit-property2", "click", function () {
                var SelectData = $com.table.getSelectionData($(".lmvt-supplier-body"), 'ID', SupplierList);
                if (!SelectData || !SelectData.length) {
                    alert("至少选择一行数据！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能选择一条数据！")
                    return;
                }
                var default_value = {
                    SupplierName: SelectData[0].PropertyID,
                    SupplierNo: SelectData[0].PropertyNo,
                    Active: SelectData[0].Active,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Device, "修改", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    var _data = {
                        ID: SelectData[0].ID,
                        PropertyName: "",
                        PropertyID: Number(rst.SupplierName),
                        PropertyNo: rst.SupplierNo,
                        Active: rst.Active,
                        DSType: 1,
                        DevicePropertyType: 1,
                    };
                    for (var i = 0; i < AllSu.length; i++) {
                        if (_data.PropertyID = AllSu[i].ID) {
                            _data.PropertyName = AllSu[i].SupplierName;
                        }
                    }
                    for (var n = 0; n < SupplierList.length; n++) {
                        if (_data.PropertyID == SupplierList[n].PropertyID && _data.PropertyNo == SupplierList[n].PropertyNo && _data.ID != SupplierList[n].ID) {
                            alert("修改失败，请检查是否有重复！");
                            return;
                        }
                    }
                    model.com.addProperty({
                        data: _data
                    }, function (res) {
                        alert("修改成功");
                        model.com.load_supplier();
                    })
                }, TypeSource_Device));
            });
            //隐藏
            $("body").delegate("#hideall", "click", function () {
                $(".lmvt-container-device").css("margin-right", "0px");
                $(".lmvt-container-system").hide();
                $(".lmvt-container-supplier").hide();
                $(".lmvt-container-equip").hide();
                $(".lmvt-container-controller").hide();
                $(".lmvt-container-type").hide();

                $(".iplant-tool-right").hide();
            });
            //展开系统信息
            $("body").delegate("#device_system", "click", function () {
                model.com.refreshSys();
                $(".lmvt-container-device").css("margin-right", "500px");
                $(".lmvt-container-system").show();
                $(".lmvt-container-supplier").hide();
                $(".lmvt-container-equip").hide();
                $(".lmvt-container-controller").hide();
                $(".lmvt-container-type").hide();

                // $(".lmvt-container-device").hide();

                $(".iplant-tool-right").show();
            });
            //展开加工类型
            $("body").delegate("#device_type", "click", function () {
                model.com.refreshTy();
                $(".lmvt-container-device").css("margin-right", "500px");
                $(".lmvt-container-system").hide();
                $(".lmvt-container-supplier").hide();
                $(".lmvt-container-equip").hide();
                $(".lmvt-container-controller").hide();
                $(".lmvt-container-type").show();

                // $(".lmvt-container-device").hide();

                $(".iplant-tool-right").show();
            });
            //展开供应商信息
            $("body").delegate("#device_supplier", "click", function () {
                model.com.refreshSu();
                $(".lmvt-container-device").css("margin-right", "500px");
                $(".lmvt-container-supplier").show();
                $(".lmvt-container-system").hide();
                $(".lmvt-container-equip").hide();
                $(".lmvt-container-controller").hide();
                $(".lmvt-container-type").hide();

                // $(".lmvt-container-device").hide();

                $(".iplant-tool-right").show();

            });
            //隐藏
            $("body").delegate("#lmvt-supplier-hide", "click", function () {

                $(".lmvt-container-device").css("margin-right", "0px");
                $(".lmvt-container-supplier").hide();
                $(".lmvt-container-system").hide();
                $(".lmvt-container-equip").hide();
                $(".lmvt-container-controller").hide();
                $(".lmvt-container-type").hide();

                $(".iplant-tool-right").hide();
            });
            //展开控制器
            $("body").delegate("#device_controller", "click", function () {
                model.com.refreshCo();
                $(".lmvt-container-device").css("margin-right", "500px");
                $(".lmvt-container-controller").show();
                $(".lmvt-container-system").hide();
                $(".lmvt-container-equip").hide();
                $(".lmvt-container-supplier").hide();
                $(".lmvt-container-type").hide();

                // $(".lmvt-container-device").hide();

                $(".iplant-tool-right").show();
            });
            //展开可装备类型信息    
            $("body").delegate("#device_equip", "click", function () {

                var is = model.com.refreshEp();
                if (is == true) {
                    return;
                }
                $(".lmvt-container-device").css("margin-right", "500px");
                $(".lmvt-container-equip").show();
                $(".lmvt-container-system").hide();
                $(".lmvt-container-supplier").hide();
                $(".lmvt-container-controller").hide();
                $(".lmvt-container-type").hide();

                $(".iplant-tool-right").show();
            });
            //禁用
            $("body").delegate(".lmvt-allowed-delete", "click", function () {
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));
                var SelectData = DataAllOriginal.filter((item) => { return item.ID == wID });

                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                model.com.modelActive(
                    { data: SelectData, Active: 2 }
                    , function (res) {
                        alert("禁用完成");
                        model.com.refresh();
                    });
            });
            //禁用供应商
            $("body").delegate("#no2", "click", function () {
                var SelectData = $com.table.getSelectionData($(".lmvt-supplier-body"), 'ID', SupplierList);

                if (!SelectData || !SelectData.length) {
                    alert("至少选择一行数据！")
                    return;
                }
                model.com.propertyActive(
                    { data: SelectData, Active: 2 }
                    , function (res) {
                        alert("禁用完成");
                        model.com.refreshSu();
                    });
            });
            //激活供应商
            $("body").delegate("#ok2", "click", function () {
                var SelectData = $com.table.getSelectionData($(".lmvt-supplier-body"), 'ID', SupplierList);

                if (!SelectData || !SelectData.length) {
                    alert("至少选择一行数据！")
                    return;
                }
                model.com.propertyActive(
                    { data: SelectData, Active: 1 }
                    , function (res) {
                        alert("激活完成");
                        model.com.refreshSu();
                    });
            });
            //禁用控制器
            $("body").delegate("#no4", "click", function () {
                var SelectData = $com.table.getSelectionData($(".lmvt-equip-body"), 'ID', ConsoleList);

                if (!SelectData || !SelectData.length) {
                    alert("至少选择一行数据！")
                    return;
                }
                model.com.propertyActive(
                    { data: SelectData, Active: 2 }
                    , function (res) {
                        alert("禁用完成");
                        model.com.refreshCo();
                    });
            });
            //禁用系统
            $("body").delegate("#no1", "click", function () {
                var SelectData = $com.table.getSelectionData($(".lmvt-system-body"), 'ID', SystemList);

                if (!SelectData || !SelectData.length) {
                    alert("至少选择一行数据！")
                    return;
                }
                model.com.propertyActive(
                    { data: SelectData, Active: 2 }
                    , function (res) {
                        alert("禁用完成");
                        model.com.refreshSys();
                    });
            });
            //禁用加工类型
            $("body").delegate("#no5", "click", function () {
                var SelectData = $com.table.getSelectionData($(".lmvt-type-body"), 'ID', AllType);

                if (!SelectData || !SelectData.length) {
                    alert("至少选择一行数据！")
                    return;
                }
                model.com.workActive(
                    { data: SelectData, Active: 2 }
                    , function (res) {
                        alert("禁用完成");
                        model.com.refreshTy();
                    });
            });
            //禁用加可装备件
            $("body").delegate("#no3", "click", function () {
                var SelectData = $com.table.getSelectionData($(".lmvt-equip-body"), 'ID', AllEquip);

                if (!SelectData || !SelectData.length) {
                    alert("至少选择一行数据！")
                    return;
                }
                model.com.eqActive(
                    { data: SelectData, Active: 1 }
                    , function (res) {
                        alert("禁用完成");
                        model.com.refreshEp();
                    });

            });
            //激活可装备件
            $("body").delegate("#ok3", "click", function () {
                var SelectData = $com.table.getSelectionData($(".lmvt-equip-body"), 'ID', AllEquip);

                if (!SelectData || !SelectData.length) {
                    alert("至少选择一行数据！")
                    return;
                }
                var index = 0;
                model.com.eqActive(
                    { data: SelectData, Active: 0 }
                    , function (res) {
                        alert("激活完成");
                        model.com.refreshEp();
                    });
            });
            //激活加工类型
            $("body").delegate("#ok5", "click", function () {
                var SelectData = $com.table.getSelectionData($(".lmvt-type-body"), 'ID', AllType);

                if (!SelectData || !SelectData.length) {
                    alert("至少选择一行数据！")
                    return;
                }
                model.com.workActive(
                    { data: SelectData, Active: 1 }
                    , function (res) {
                        alert("激活完成");
                        model.com.refreshTy();
                    });
            });
            //激活系统
            $("body").delegate("#ok1", "click", function () {
                var SelectData = $com.table.getSelectionData($(".lmvt-system-body"), 'ID', SystemList);

                if (!SelectData || !SelectData.length) {
                    alert("至少选择一行数据！")
                    return;
                }
                model.com.propertyActive(
                    { data: SelectData, Active: 1 }
                    , function (res) {
                        alert("激活完成");
                        model.com.refreshSys();
                    });

            });
            //激活控制器
            $("body").delegate("#ok4", "click", function () {
                var SelectData = $com.table.getSelectionData($(".lmvt-equip-body"), 'ID', ConsoleList);

                if (!SelectData || !SelectData.length) {
                    alert("至少选择一行数据！")
                    return;
                }
                model.com.propertyActive(
                    { data: SelectData, Active: 1 }
                    , function (res) {
                        alert("激活完成");
                        model.com.refreshCo();
                    });
            });
            //激活
            $("body").delegate(".lmvt-do-active", "click", function () {
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DataAllOriginal.filter((item) => { return item.ID == wID });

                $com.util.deleteLowerProperty(SelectData);
                model.com.modelActive(
                    { data: SelectData, Active: 1 }
                    , function (res) {
                        alert("激活完成");
                        model.com.refresh();
                    });
            });
        },

        run: function () {
            model.com.load();
        },

        com: {
            //所有备件
            getSpare: function (data, fn, context) {
                var d = {
                    $URI: "/SpareModel/All",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //可装备件
            getEquipSpare: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceEquipSpare/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //工作类型
            getType: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceWorkType/All",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //添加工作类型
            addType: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceWorkType/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);

            },
            //供应商信息
            getSupplier: function (data, fn, context) {
                var d = {
                    $URI: "/Supplier/All",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
                //fn(DATA);
                //fn({ list: DATA1 });
            },
            //所有用户
            getUser: function (data, fn, context) {
                var d = {
                    $URI: "/User/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //设备型号激活/禁用
            modelActive: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceModel/Active",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //设备属性激活/禁用
            propertyActive: function (data, fn, context) {
                var d = {
                    $URI: "/DevicePropertyModel/Active",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //加工类型激活/禁用
            workActive: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceWorkType/Active",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //加工类型激活/禁用
            eqActive: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceEquipSpare/Active",
                    $TYPE: "post"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //导入
            postImportExcel: function (data, fn, context) {
                var d = {
                    $URI: "/Upload/ImportExcel",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('导入失败，请检查网络');
                }

                $com.app.ajax_load(data ? $.extend(data, d) : $.extend(d, data), fn, err, context);
            },
            //导出
            postExportExcel: function (data, fn, context) {
                var d = {
                    $URI: "/Upload/ExportExcel",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //所有设备信息
            getDeviceInfoAll: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceModel/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);

            },
            //属性配置
            getProperty: function (data, fn, context) {
                var d = {
                    $URI: "/DevicePropertyModel/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getWorkShop: function (data, fn, context) {
                var d = {
                    $URI: "/WorkShop/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            refresh: function () {
                model.com.getDeviceInfoAll({
                    Active: -1, Type: 1,
                }, function (res) {
                    if (!res)
                        return;
                    var list = res.list,
                        rst = [];
                    if (list) {
                        AllDeviceInfo = res.list;
                        DeviceInfoSource = res.list;
                        AllDeviceInfo = $com.util.Clone(AllDeviceInfo);
                    }
                    for (var i = 0; i < AllDeviceInfo.length; i++) {
                        for (var j = 0; j < AllUser.length; j++) {
                            if (AllDeviceInfo[i].OperatorID == AllUser[j].ID) {
                                TypeSource_Supplier.OperatorID.push({ name: AllUser[j].Name, value: AllUser[j].ID });
                            }
                        }
                        for (var n = 0; n < AllType.length; n++) {
                            if (AllDeviceInfo[i].DeviceWorkType == AllType[n].ID) {
                                TypeSource_Supplier.DeviceWorkType.push({ name: AllType[n].Name, value: AllType[n].ID });
                            }
                        }

                    }
                    $.each(AllDeviceInfo, function (i, item) {
                        item.Badge = " ";

                        if (item.Active == 1) {
                            item.ISAllowedText = "禁用";
                            item.ISAllowed = "lmvt-allowed-delete";
                            item.ClassBadge = "lmvt-activeBadge";
                        } else if (item.Active == 2) {
                            item.ISAllowedText = "启用";
                            item.ISAllowed = "lmvt-do-active";
                            item.ClassBadge = "lmvt-forbiddenBadge";
                        } else {
                            item.ISAllowedText = "启用";
                            item.ISAllowed = "lmvt-do-active";
                            item.ClassBadge = "lmvt-defBadge";
                        }

                        for (var p in item) {
                            if (!FORMATTRT_Supplier[p])
                                continue;
                            item[p] = FORMATTRT_Supplier[p](item[p]);
                        }
                    });
                    $(".lmvt-device-body").html($com.util.template(AllDeviceInfo, HTML.DeviceTemplate));
                    $(".lmvt-device-body tr").each(function (i, item) {
                        var $this = $(this);
                        var colorName = $this.css("background-color");
                        $this.attr("data-color", colorName);



                    });

                    DataAll = AllDeviceInfo;
                    DataAllOriginal = list;//未处理后的数据
                });
            },
            refreshSu: function () {
                model.com.getProperty({
                    PropertyID: 0, PropertyName: "", PropertyNo: "",
                    PropertyType: 1, DSType: 1, Active: -1,
                }, function (res) {
                    if (!res)
                        return;
                    var list = res.list;
                    var ClonSupplierList = $com.util.Clone(list);
                    for (var i = 0; i < ClonSupplierList.length; i++) {
                        for (var j = 0; j < AllUser.length; j++) {
                            if (ClonSupplierList[i].OperatorID == AllUser[j].ID) {
                                TypeSource_Supplier1.OperatorID.push({ name: AllUser[j].Name, value: AllUser[j].ID });
                            }
                        }
                    }
                    $.each(ClonSupplierList, function (i, item) {
                        for (var p in item) {
                            if (!FORMATTRT_Supplier1[p])
                                continue;
                            item[p] = FORMATTRT_Supplier1[p](item[p]);
                        }
                    });
                    $(".lmvt-supplier-body").html($com.util.template(ClonSupplierList, HTML.SupplierTemplate));
                    $(".lmvt-supplier-body tr").each(function (i, item) {
                        var $this = $(this);
                        var colorName = $this.css("background-color");
                        $this.attr("data-color", colorName);



                    });

                    SupplierList = list;
                });
            },
            refreshCo: function () {
                model.com.getProperty({
                    PropertyID: 0, PropertyName: "", PropertyNo: "",
                    PropertyType: 3, DSType: 1, Active: -1,
                }, function (res) {
                    if (!res)
                        return;
                    var list = res.list;
                    var ClonConloseList = $com.util.Clone(list);
                    for (var i = 0; i < ClonConloseList.length; i++) {
                        for (var j = 0; j < AllUser.length; j++) {
                            if (ClonConloseList[i].OperatorID == AllUser[j].ID) {
                                TypeSource_Supplier2.OperatorID.push({ name: AllUser[j].Name, value: AllUser[j].ID });
                            }
                        }
                    }
                    $.each(ClonConloseList, function (i, item) {
                        for (var p in item) {
                            if (!FORMATTRT_Supplier2[p])
                                continue;
                            item[p] = FORMATTRT_Supplier2[p](item[p]);
                        }
                    });
                    $(".lmvt-equip-body").html($com.util.template(ClonConloseList, HTML.SupplierTemplate));
                    $(".lmvt-equip-body tr").each(function (i, item) {
                        var $this = $(this);
                        var colorName = $this.css("background-color");
                        $this.attr("data-color", colorName);
                    });

                    ConsoleList = list;
                });
            },
            refreshSys: function () {
                model.com.getProperty({
                    PropertyID: 0, PropertyName: "", PropertyNo: "",
                    PropertyType: 2, DSType: 1, Active: -1,
                }, function (res) {
                    if (!res)
                        return;
                    var list = res.list;
                    var ClonSystemList = $com.util.Clone(list);
                    for (var i = 0; i < ClonSystemList.length; i++) {
                        for (var j = 0; j < AllUser.length; j++) {
                            if (ClonSystemList[i].OperatorID == AllUser[j].ID) {
                                TypeSource_Supplier3.OperatorID.push({ name: AllUser[j].Name, value: AllUser[j].ID });
                            }
                        }
                    }
                    $.each(ClonSystemList, function (i, item) {
                        for (var p in item) {
                            if (!FORMATTRT_Supplier3[p])
                                continue;
                            item[p] = FORMATTRT_Supplier3[p](item[p]);
                        }
                    });
                    $(".lmvt-system-body").html($com.util.template(ClonSystemList, HTML.SupplierTemplate));
                    $(".lmvt-system-body tr").each(function (i, item) {
                        var $this = $(this);
                        var colorName = $this.css("background-color");
                        $this.attr("data-color", colorName);



                    });

                    SystemList = list;
                });
            },
            refreshTy: function () {
                model.com.getType({
                    PropertyID: 0,
                    PropertyName: "",
                    PropertyNo: "",
                    PropertyType: 0,
                    DSType: 1,
                    Active: -1,
                }, function (res) {
                    if (!res)
                        return;
                    var list = res.list;
                    AllType = res.list;

                    var ClonTypeList = $com.util.Clone(list);
                    for (var i = 0; i < ClonTypeList.length; i++) {
                        for (var j = 0; j < AllUser.length; j++) {
                            if (ClonTypeList[i].OperatorID == AllUser[j].ID) {
                                TypeSource_Supplier4.OperatorID.push({ name: AllUser[j].Name, value: AllUser[j].ID });
                            }
                        }
                    }
                    $.each(ClonTypeList, function (i, item) {
                        for (var p in item) {
                            if (!FORMATTRT_Supplier4[p])
                                continue;
                            item[p] = FORMATTRT_Supplier4[p](item[p]);
                        }
                    });
                    $(".lmvt-type-body").html($com.util.template(ClonTypeList, HTML.WorkTypeTemplate));
                    $(".lmvt-type-body tr").each(function (i, item) {
                        var $this = $(this);
                        var colorName = $this.css("background-color");
                        $this.attr("data-color", colorName);



                    });
                });
            },
            refreshEp: function () {
                var SelectData = $com.table.getSelectionData($(".lmvt-device-body"), 'ID', DataAllOriginal);
                var is = false;
                if (!SelectData || !SelectData.length) {
                    alert("至少选择一行数据！");
                    is = true;
                    return is;
                }
                if (SelectData.length != 1) {
                    alert("只能选择一条数据！");
                    is = true;;
                    return is;
                }
                wModelNo = SelectData[0].ID;
                model.com.getEquipSpare({
                    DeviceSpareName: "", DeviceModelID: SelectData[0].ID, SpareModelID: 0, active: -1
                }, function (res) {
                    if (!res)
                        return;
                    var list = res.list;
                    AllEquip = res.list;
                    var ClonSpareList = $com.util.Clone(list);
                    for (var i = 0; i < ClonSpareList.length; i++) {
                        for (var j = 0; j < AllDeviceInfo.length; j++) {
                            if (ClonSpareList[i].DeviceModelID == AllDeviceInfo[j].ID) {
                                TypeSource_Supplier.DeviceModelID.push({ name: AllDeviceInfo[j].ModelNo, value: AllDeviceInfo[j].ID });
                            }
                        }
                        for (var n = 0; n < AllSpare.length; n++) {
                            if (ClonSpareList[i].SpareModelID == AllSpare[n].ID) {
                                TypeSource_Supplier.SpareModelID.push({ name: AllSpare[n].ModelNo, value: AllSpare[n].ID });
                            }
                        }
                        for (var m = 0; m < AllUser.length; m++) {
                            if (ClonSpareList[i].OperatorID == AllUser[m].ID) {
                                TypeSource_Supplier.OperatorID.push({ name: AllUser[m].Name, value: AllUser[m].ID });
                            }
                        }
                    }
                    $.each(ClonSpareList, function (i, item) {
                        for (var p in item) {
                            if (!FORMATTRT_Supplier[p])
                                continue;
                            item[p] = FORMATTRT_Supplier[p](item[p]);
                        }
                    });
                    $(".lmvt-equip-body").html($com.util.template(ClonSpareList, HTML.DeviceEquipSpare));
                    $(".lmvt-equip-body tr").each(function (i, item) {
                        var $this = $(this);
                        var colorName = $this.css("background-color");
                        $this.attr("data-color", colorName);



                    });

                    DataAll = ClonSpareList;
                });
                //return is;
            },
            add: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceModel/Update",
                    $TYPE: "post"
                };
                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //新增-修改可装备件
            addEquip: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceEquipSpare/Update",
                    $TYPE: "post"
                };
                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            addProperty: function (data, fn, context) {
                var d = {
                    $URI: "/DevicePropertyModel/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            load: function () {

                model.com.getUser({

                }, function (res) {
                    if (!res)
                        return;
                    AllUser = res.list;
                    model.com.getType({
                        PropertyID: 0,
                        PropertyName: "",
                        PropertyNo: "",
                        PropertyType: 0,
                        DSType: 1,
                        Active: -1,
                    }, function (res) {
                        if (!res)
                            return;
                        var list = res.list;
                        AllType = res.list;
                        for (var i = 0; i < AllType.length; i++) {
                            TypeSource_Device.DeviceWorkType.push({ name: AllType[i].Name, value: AllType[i].ID });
                        }
                        model.com.getProperty({
                            PropertyID: 0, PropertyName: "", PropertyNo: "",
                            PropertyType: 1, DSType: 1, Active: -1,
                        }, function (res) {
                            if (!res)
                                return;
                            var list = res.list;
                            SupplierList = list;
                            for (var i = 0; i < list.length; i++) {
                                TypeSource_Device.SupplierID.push({ name: list[i].PropertyName, value: list[i].PropertyID, far: 0 });
                            }
                            for (var i = 0; i < list.length; i++) {
                                TypeSource_Device.SupplierModelNo.push({ name: list[i].PropertyNo, value: list[i].ID, far: list[i].PropertyID });
                            }

                            model.com.getProperty({
                                PropertyID: 0, PropertyName: "", PropertyNo: "",
                                PropertyType: 2, DSType: 1, Active: -1,
                            }, function (res) {
                                if (!res)
                                    return;
                                var list = res.list;
                                var obj = {};
                                SystemList = list;
                                for (var i = 0; i < list.length; i++) {
                                    if (!obj[list[i].PropertyName]) {
                                        TypeSource_Device.SystName.push({ name: list[i].PropertyName, value: list[i].PropertyID });
                                        TypeSource_Device.SystemID.push({ name: list[i].PropertyName, value: list[i].PropertyID, far: 0 });
                                        obj[list[i].PropertyName] = true;
                                    }
                                }
                                for (var i = 0; i < list.length; i++) {
                                    TypeSource_Device.SystemVersion.push({ name: list[i].PropertyNo, value: list[i].ID, far: list[i].PropertyID });
                                }
                                model.com.getProperty({
                                    PropertyID: 0, PropertyName: "", PropertyNo: "",
                                    PropertyType: 3, DSType: 1, Active: -1,
                                }, function (res) {
                                    if (!res)
                                        return;
                                    var list = res.list;
                                    var obj = {};
                                    ConsoleList = list;
                                    for (var i = 0; i < list.length; i++) {

                                        if (!obj[list[i].PropertyName]) {
                                            TypeSource_Device.ConName.push({ name: list[i].PropertyName, value: list[i].PropertyID });
                                            TypeSource_Device.ControllerName.push({ name: list[i].PropertyName, value: list[i].PropertyID, far: 0 });
                                            obj[list[i].PropertyName] = true;
                                        }
                                    }
                                    for (var i = 0; i < list.length; i++) {
                                        TypeSource_Device.ControllerModel.push({ name: list[i].PropertyNo, value: list[i].ID, far: list[i].PropertyID });
                                    }
                                    model.com.getSupplier({
                                        supplier_name: "",
                                        country_id: 0,
                                        province_id: 0,
                                        city_id: 0,
                                        active: 1
                                    }, function (res) {
                                        var list = res.list;
                                        AllSu = res.list;
                                        for (var i = 0; i < list.length; i++) {
                                            TypeSource_Device.SupplierName.push({ name: list[i].SupplierName, value: list[i].ID });
                                            //TypeSource_Device.SupplierID.push({ name: list[i].SupplierName, value: list[i].ID, far: 0 });
                                        }
                                        model.com.getSpare({
                                            SpareWorkType: 0, SupplierID: 0, ModelPropertyID: 0,
                                            SupplierModelNo: "", Active: -1
                                        }, function (res) {
                                            if (!res)
                                                return;
                                            var list = res.list;
                                            AllSpare = res.list;
                                            for (var i = 0; i < list.length; i++) {
                                                TypeSource_Device.SpareModelID.push({ name: list[i].ModelNo, value: list[i].ID });
                                                TypeSource_Device.EquipOptions.push({ name: list[i].ModelNo, value: list[i].ID });
                                            }
                                            model.com.refresh();
                                        });
                                    });
                                });
                            });

                        });
                    });
                });
            },
            load_supplier: function () {
                model.com.getProperty({
                    PropertyID: 0, PropertyName: "", PropertyNo: "",
                    PropertyType: 1, DSType: 1, Active: -1,
                }, function (res) {
                    if (!res)
                        return;
                    var list = res.list;
                    SupplierList = list;
                    TypeSource_Device.SupplierModelNo.splice(1, TypeSource_Device.SupplierModelNo.length - 1);
                    TypeSource_Device.SupplierID.splice(1, TypeSource_Device.SupplierID.length - 1);
                    for (var i = 0; i < list.length; i++) {
                        TypeSource_Device.SupplierID.push({ name: list[i].PropertyName, value: list[i].PropertyID, far: 0 });
                        TypeSource_Device.SupplierModelNo.push({ name: list[i].PropertyNo, value: list[i].ID, far: list[i].PropertyID });
                    }
                    model.com.refreshSu();
                });
            },
            load_system: function () {
                model.com.getProperty({
                    PropertyID: 0, PropertyName: "", PropertyNo: "",
                    PropertyType: 2, DSType: 1, Active: -1,
                }, function (res) {
                    if (!res)
                        return;
                    var list = res.list;
                    var obj = {};
                    SystemList = list;
                    TypeSource_Device.SystemVersion.splice(1, TypeSource_Device.SystemVersion.length - 1);
                    TypeSource_Device.SystName.splice(1, TypeSource_Device.SystName.length - 1);
                    TypeSource_Device.SystemID.splice(1, TypeSource_Device.SystemID.length - 1);
                    for (var i = 0; i < list.length; i++) {
                        if (!obj[list[i].PropertyName]) {
                            TypeSource_Device.SystName.push({ name: list[i].PropertyName, value: list[i].PropertyID, far: 0 });
                            TypeSource_Device.SystemID.push({ name: list[i].PropertyName, value: list[i].PropertyID, far: 0 });
                            obj[list[i].PropertyName] = true;
                        }
                        TypeSource_Device.SystemVersion.push({ name: list[i].PropertyNo, value: list[i].ID, far: list[i].PropertyID });
                    }
                    model.com.refreshSys();
                });
            },
            load_console: function () {
                model.com.getProperty({
                    PropertyID: 0, PropertyName: "", PropertyNo: "",
                    PropertyType: 3, DSType: 1, Active: -1,
                }, function (res) {
                    if (!res)
                        return;
                    var list = res.list;
                    ConsoleList = list;
                    TypeSource_Device.ControllerModel.splice(1, TypeSource_Device.ControllerModel.length - 1);
                    TypeSource_Device.ConName.splice(1, TypeSource_Device.ConName.length - 1);
                    TypeSource_Device.ControllerName.splice(1, TypeSource_Device.ControllerName.length - 1);
                    var obj = {};
                    for (var i = 0; i < list.length; i++) {
                        if (!obj[list[i].PropertyName]) {
                            TypeSource_Device.ConName.push({ name: list[i].PropertyName, value: list[i].PropertyID });
                            TypeSource_Device.ControllerName.push({ name: list[i].PropertyName, value: list[i].PropertyID, far: 0 });
                            obj[list[i].PropertyName] = true;
                        }
                        TypeSource_Device.ControllerModel.push({ name: list[i].PropertyNo, value: list[i].ID, far: list[i].PropertyID });
                    }
                    model.com.refreshCo();
                });
            },
            load_type: function () {
                model.com.getType({
                    PropertyID: 0,
                    PropertyName: "",
                    PropertyNo: "",
                    PropertyType: 0,
                    DSType: 1,
                    Active: -1,
                }, function (res) {
                    if (!res)
                        return;
                    var list = res.list;
                    AllType = res.list;
                    TypeSource_Device.DeviceWorkType.splice(1, TypeSource_Device.DeviceWorkType.length - 1);
                    for (var i = 0; i < AllType.length; i++) {
                        TypeSource_Device.DeviceWorkType.push({ name: AllType[i].Name, value: AllType[i].ID });
                    }
                    model.com.refreshTy();
                });
            },
            changeStatus: function (data, fn, context) {
                var d = {
                    $URI: "/Device/ChangeStatus",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            render: function (list) {
                var _list = $com.util.Clone(list);
                $.each(_list, function (i, item) {
                    for (var p in item) {
                        if (!FORMATTRT[p])
                            continue;
                        item[p] = FORMATTRT[p](item[p]);
                    }
                });
                $("#femi-ledger-tbody").html($com.util.template(_list, HTML.TableLedgerItemNode));
            },
            renderProerty: function (list) {
                var _list = $com.util.Clone(list);
                $.each(_list, function (i, item) {
                    for (var p in item) {
                        if (!FORMATTRT_PROPERTY[p])
                            continue;
                        item[p] = FORMATTRT_PROPERTY[p](item[p]);
                    }
                });
                $("#femi-ledger-property-tbody").html($com.util.template(_list, HTML.TablePropertyItemNode));
            }
        }
    });

    model.init();
});
