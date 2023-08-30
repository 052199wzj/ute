require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {
    var KEYWORD_Device_LIST_item,
        KEYWORD_Device_item,
        FORMATTRT_Device_item,
        DEFAULT_VALUE_Device_item,
        TypeSource_Device_item,

        KEYWORD_Device_LIST_time,
        KEYWORD_Device_time,
        FORMATTRT_Device_time,
        DEFAULT_VALUE_Device_time,
        TypeSource_Device_time,
        customArray,
        BYItem,
        mID,
        wID,
        flowID,
        model,
        item,
        HTML;

    var mcustomArray = [];
    modelID = 1;
    mID = 0;
    HTML = {
        TableNode_item: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
            '<td data-title="Type" data-value="{{Type}}" >{{Type}}</td>',
            '<td data-title="Engineer" data-value="{{Engineer}}" >{{Engineer}}</td>',
            '<td data-title="CreatTime" data-value="{{CreatTime}}" >{{CreatTime}}</td>',
            '<td data-title="EditTime" data-value="{{EditTime}}" >{{EditTime}}</td>',
            '<td data-title="Active" data-value="{{Active}}" >{{Active}}</td>',
            '</tr>',
        ].join(""),

        TableNode_time: [
            '<tr data-color="">',
            '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td>',
            '<td style="min-width: 50px" data-title="FlowType" data-value="{{FlowType}}">{{FlowType}}</td>',
            '<td style="min-width: 50px" data-title="StepEnum" data-value="{{StepEnum}}" >{{StepEnum}}</td>',
            '<td style="min-width: 50px" data-title="StepOrder" data-value="{{StepOrder}}">{{StepOrder}}</td>',
            '</tr>',
        ].join(""),

        TableNode_custom: [
            '<tr data-color="">',
            '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td>',
            '<td style="min-width: 50px" data-title="PropertyName" data-value="{{PropertyName}}">{{PropertyName}}</td>',
            '<td style="min-width: 50px" data-title="PropertyTypeName" data-value="{{PropertyTypeName}}">{{PropertyTypeName}}</td>',
            '<td style="min-width: 50px" data-title="PropertyValue" data-value="{{PropertyValue}}" >{{PropertyValue}}</td>',
            '<td style="min-width: 50px" data-title="PropertyType" data-value="{{PropertyType}}">{{PropertyType}}</td>',
            // '<td style="min-width: 50px" data-title="BusinessType" data-value="{{BusinessType}}">{{BusinessType}}</td>',
            '<td style="min-width: 50px" data-title="NotNull" data-value="{{NotNull}}">{{NotNull}}</td>',
            '<td style="min-width: 50px" data-title="FillFlow" data-value="{{FillFlow}}">{{FillFlow}}</td>',
            '<td style="min-width: 50px" data-title="PrevStepFill" data-value="{{PrevStepFill}}">{{PrevStepFill}}</td>',
            '<td style="min-width: 50px" data-title="StepFill" data-value="{{StepFill}}">{{StepFill}}</td>',
            '</tr>',
        ].join(""),
    };

    (function () {
        KEYWORD_Device_LIST_item = [
            "ID|编号",
            "Name|名称",
            "Type|类型|ArrayOne",
            "Engineer|操作员|ArrayOne",
            "CreatTime|创建时间|DateTime",
            "EditTime|编辑时间|DateTime",
            "Active|状态|ArrayOne",
        ];
        KEYWORD_Device_item = {};
        FORMATTRT_Device_item = {};
        DEFAULT_VALUE_Device_item = {
            Type: 0,
            Name: "",
        };

        TypeSource_Device_item = {
            Engineer: [{
                name: "无",
                value: 0
            }],
            Type: [
                {
                    name: "无",
                    value: 0
                },
                {
                    name: "移车",
                    value: 1
                }, {
                    name: "不合格评审",
                    value: 2
                }, {
                    name: "返修",
                    value: 3
                },{
                    name: "预检项",
                    value: 4
                },{
                    name: "预检单",
                    value: 5
                }
            ],
            Active: [{
                name: "禁用",
                value: 0
            }, {
                name: "启用",
                value: 1
            }],
        };


        $.each(KEYWORD_Device_LIST_item, function (i, item) {
            var detail = item.split("|");
            KEYWORD_Device_item[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_Device_item[detail[0]] = $com.util.getFormatter(TypeSource_Device_item, detail[0], detail[2]);
            }
        });
    })();
    (function () {
        KEYWORD_Device_LIST_time = [
            "ID|编号",
            "FlowType|流程名称|ArrayOne",
            "StepEnum|步骤名称|ArrayOne",
            "StepOrder|步骤顺序",
            "PropertyName|需填充的字段",
            "PropertyTypeName|需填充的字段名称",
            // "PropertyValue|需填充的值",
            "PropertyType|字段类型|ArrayOne",
            // "BusinessType|业务类型",
            "NotNull|是否必填|ArrayOne",
            "FillFlow|是否填充主流程数据|ArrayOne",
            "PrevStepFill|填充位置(前)|ArrayOne",
            "StepFill|填充位置(后)|ArrayOne",
        ];
        KEYWORD_Device_time = {};
        FORMATTRT_Device_time = {};
        DEFAULT_VALUE_Device_time = {
            // FlowName:"",
            // StepName:"",
            FlowType: 0,
            StepEnum: 0,
            StepOrder: 0,
            //需填充的字段名称
            PropertyName: "",
            //需填充的字段类型
            PropertyTypeName: "",
            //需填充的值
            // PropertyValue: "",
            //字段类型枚举
            PropertyType: 0,
            //业务类型
            // BusinessType: 0,
            //是否必填(针对填充的值)
            NotNull: 0,
            //填充主流程数据
            FillFlow: 0,
            //在哪流程之前填充
            PrevStepFill: 0,
            //在哪流程结束填充
            StepFill: 0,
        };

        TypeSource_Device_time = {
            // 1：部门ID 2：岗位ID 3：人员ID
            PropertyType:[
                {
                    name: "无",
                    value: 0
                }, {
                    name: "字符串",
                    value: 1
                }, {
                    name: "时间",
                    value: 2
                }, {
                    name: "数字",
                    value: 3
                }
            ],
            FlowType: [
                {
                    name: "无",
                    value: 0
                }
            ],
            StepEnum: [
                {
                    name: "无",
                    value: 0,
                },
                {
                    name: "发起申请",
                    value: 1
                }, {
                    name: "接收方工区审批",
                    value: 2
                }, {
                    name: "四工区审批",
                    value: 3
                }, {
                    name: "移车班成员处理",
                    value: 4
                }, {
                    name: "生产作业人员发起",
                    value: 5
                },{
                    name: "工区主管审批",
                    value: 6
                },{
                    name: "质检员进行填写",
                    value: 7
                },{
                    name: "质量工程师评级",
                    value: 8
                },{
                    name: "工艺员填写",
                    value: 9
                },{
                    name: "相关部门填写",
                    value: 10
                },{
                    name: "质量工程师填写",
                    value: 11
                },{
                    name: "质量工程师审批",
                    value: 12
                },{
                    name: "质量部长审批",
                    value: 13
                },{
                    name: "技术总工程师",
                    value: 14
                },{
                    name: "待确认",
                    value: 15
                },
                {
                    name: "人工填写预检项申请",
                    value: 16
                },
                {
                    name: "现场工艺审批",
                    value: 17
                },
                {
                    name: "技术中心审批",
                    value: 18
                },
                {
                    name: "创建预检单",
                    value: 19
                }
            ],
            NotNull: [
                {
                    name: "否",
                    value: 0
                },
                {
                    name: "是",
                    value: 1
                }
            ],
            FillFlow: [
                {
                    name: "否",
                    value: 0
                }, {
                    name: "是",
                    value: 1
                }
            ],
            PrevStepFill: [
                {
                    name: "无",
                    value: 0,
                },
                {
                    name: "发起申请",
                    value: 1
                }, {
                    name: "接收方工区审批",
                    value: 2
                }, {
                    name: "四工区审批",
                    value: 3
                }, {
                    name: "移车班成员处理",
                    value: 4
                }, {
                    name: "生产作业人员发起",
                    value: 5
                },{
                    name: "工区主管审批",
                    value: 6
                },{
                    name: "质检员进行填写",
                    value: 7
                },{
                    name: "质量工程师评级",
                    value: 8
                },{
                    name: "工艺员填写",
                    value: 9
                },{
                    name: "相关部门填写",
                    value: 10
                },{
                    name: "质量工程师填写",
                    value: 11
                },{
                    name: "质量工程师审批",
                    value: 12
                },{
                    name: "质量部长审批",
                    value: 13
                },{
                    name: "技术总工程师",
                    value: 14
                },{
                    name: "待确认",
                    value: 15
                },
                {
                    name: "人工填写预检项申请",
                    value: 16
                },
                {
                    name: "现场工艺审批",
                    value: 17
                },
                {
                    name: "技术中心审批",
                    value: 18
                },
                {
                    name: "创建预检单",
                    value: 19
                }
            ],
            StepFill: [
                {
                    name: "无",
                    value: 0,
                },
                {
                    name: "发起申请",
                    value: 1
                }, {
                    name: "接收方工区审批",
                    value: 2
                }, {
                    name: "四工区审批",
                    value: 3
                }, {
                    name: "移车班成员处理",
                    value: 4
                }, {
                    name: "生产作业人员发起",
                    value: 5
                },{
                    name: "工区主管审批",
                    value: 6
                },{
                    name: "质检员进行填写",
                    value: 7
                },{
                    name: "质量工程师评级",
                    value: 8
                },{
                    name: "工艺员填写",
                    value: 9
                },{
                    name: "相关部门填写",
                    value: 10
                },{
                    name: "质量工程师填写",
                    value: 11
                },{
                    name: "质量工程师审批",
                    value: 12
                },{
                    name: "质量部长审批",
                    value: 13
                },{
                    name: "技术总工程师",
                    value: 14
                },{
                    name: "待确认",
                    value: 15
                },
                {
                    name: "人工填写预检项申请",
                    value: 16
                },
                {
                    name: "现场工艺审批",
                    value: 17
                },
                {
                    name: "技术中心审批",
                    value: 18
                },
                {
                    name: "创建预检单",
                    value: 19
                }
            ],
        };


        $.each(KEYWORD_Device_LIST_time, function (x, item) {
            var detail = item.split("|");
            KEYWORD_Device_time[detail[0]] = {
                index: x,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_Device_time[detail[0]] = $com.util.getFormatter(TypeSource_Device_time, detail[0], detail[2]);
            }

        });
    })();
    (function () {
        KEYWORD_Device_LIST_custom = [
            "ID|编号",
            "PropertyName|需填充的字段",
            "PropertyTypeName|需填充的字段名称",
            // "PropertyValue|填充的值",
            "PropertyType|字段类型|ArrayOne",
            // "BusinessType|业务类型",
            "NotNull|是否必填|ArrayOne",
            "FillFlow|是否填充主流程数据|ArrayOne",
            "PrevStepFill|填充位置(前)|ArrayOne",
            "StepFill|填充位置(后)|ArrayOne",
        ];
        KEYWORD_Device_custom = {};
        FORMATTRT_Device_custom = {};
        DEFAULT_VALUE_Device_custom = {
            PropertyName: "",
            PropertyTypeName: "",
            // PropertyValue: "",
            PropertyType:0,
            NotNull: 0,
            FillFlow: 0,
            PrevStepFill: 0,
            StepFill: 0,
        };

        TypeSource_Device_custom = {
            PropertyType:[
                {
                    name: "无",
                    value: 0
                },
                {
                    name: "字符串",
                    value: 1
                }, {
                    name: "时间",
                    value: 2
                }, {
                    name: "数字",
                    value: 3
                }
            ],
            NotNull: [{
                name: "否",
                value: 0
            }, {
                name: "是",
                value: 1
            }],
            FillFlow: [
                {
                    name: "否",
                    value: 0
                }, {
                    name: "是",
                    value: 1
                }
            ],
            PrevStepFill: [
                {
                    name: "无",
                    value: 0,
                },
                {
                    name: "发起申请",
                    value: 1
                }, {
                    name: "接收方工区审批",
                    value: 2
                }, {
                    name: "四工区审批",
                    value: 3
                }, {
                    name: "移车班成员处理",
                    value: 4
                }, {
                    name: "生产作业人员发起",
                    value: 5
                },{
                    name: "工区主管审批",
                    value: 6
                },{
                    name: "质检员进行填写",
                    value: 7
                },{
                    name: "质量工程师评级",
                    value: 8
                },{
                    name: "工艺员填写",
                    value: 9
                },{
                    name: "相关部门填写",
                    value: 10
                },{
                    name: "质量工程师填写",
                    value: 11
                },{
                    name: "质量工程师审批",
                    value: 12
                },{
                    name: "质量部长审批",
                    value: 13
                },{
                    name: "技术总工程师",
                    value: 14
                },{
                    name: "待确认",
                    value: 15
                },
                {
                    name: "人工填写预检项申请",
                    value: 16
                },
                {
                    name: "现场工艺审批",
                    value: 17
                },
                {
                    name: "技术中心审批",
                    value: 18
                },
                {
                    name: "创建预检单",
                    value: 19
                }
            ],
            StepFill: [
                {
                    name: "无",
                    value: 0,
                },
                {
                    name: "发起申请",
                    value: 1
                }, {
                    name: "接收方工区审批",
                    value: 2
                }, {
                    name: "四工区审批",
                    value: 3
                }, {
                    name: "移车班成员处理",
                    value: 4
                }, {
                    name: "生产作业人员发起",
                    value: 5
                },{
                    name: "工区主管审批",
                    value: 6
                },{
                    name: "质检员进行填写",
                    value: 7
                },{
                    name: "质量工程师评级",
                    value: 8
                },{
                    name: "工艺员填写",
                    value: 9
                },{
                    name: "相关部门填写",
                    value: 10
                },{
                    name: "质量工程师填写",
                    value: 11
                },{
                    name: "质量工程师审批",
                    value: 12
                },{
                    name: "质量部长审批",
                    value: 13
                },{
                    name: "技术总工程师",
                    value: 14
                },{
                    name: "待确认",
                    value: 15
                }
                ,
                {
                    name: "人工填写预检项申请",
                    value: 16
                },
                {
                    name: "现场工艺审批",
                    value: 17
                },
                {
                    name: "技术中心审批",
                    value: 18
                },
                {
                    name: "创建预检单",
                    value: 19
                }
            ],
        };


        $.each(KEYWORD_Device_LIST_custom, function (i, item) {
            var detail = item.split("|");
            KEYWORD_Device_custom[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_Device_custom[detail[0]] = $com.util.getFormatter(TypeSource_Device_custom, detail[0], detail[2]);
            }
        });
    })();

    model = $com.Model.create({
        name: '移车配置',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            //权限设置模糊查询
            $("body").delegate("#zace-search-Device-item", "change", function () {

                var $this = $(this),
                    value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-Device-tbody-item").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-Device-tbody-item"), DataAll, value, "ID");
            });
            //新增配置
            $("body").delegate("#zace-add", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_Device_item, KEYWORD_Device_item, "新增", function (rst) {
                    //调用插入函数 

                    if (!rst || $.isEmptyObject(rst))
                        return;
                    var ItemTemp = {
                        ID: 0,
                        Type: Number(rst.Type),
                        Name: rst.Name,
                        TableName: "",
                        DBName: "",
                        DBType: 0,
                        creatTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                        Engineer: 0,
                        Active: 1,
                        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                    };
                    model.com.postFlowUpdate({
                        data: ItemTemp
                    }, function (res) {
                        model.com.refresh();
                        alert("新增成功");
                    })

                }, TypeSource_Device_item));
            });
            //修改配置
            $("body").delegate("#zace-edit", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-item"), "ID", DATABasic);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }

                var DEFAULT_VALUE_Device_itemEdite = {
                    Name: SelectData[0].Name,
                    Type: SelectData[0].Type,
                    Active: SelectData[0].Active,
                }
                $("body").append($com.modal.show(DEFAULT_VALUE_Device_itemEdite, KEYWORD_Device_item, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].Name = rst.Name;
                    SelectData[0].Type = Number(rst.Type);
                    SelectData[0].Active = Number(rst.Active);
                    SelectData[0].EditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                        $com.util.deleteLowerProperty(SelectData[0]);
                    model.com.postFlowUpdate({
                        data: SelectData[0]
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                    })

                }, TypeSource_Device_item));
            });


            //新增流程
            $("body").delegate("#zace-Device-addsh", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_Device_time, KEYWORD_Device_time, "新增", function (rst) {
                    //调用插入函数 

                    if (!rst || $.isEmptyObject(rst))
                        return;
                    var ItemTemp = {
                        ID: 0,
                        FlowID:0,
                        FlowType: Number(rst.FlowType),
                        // FlowName: "",
                        StepEnum: Number(rst.StepEnum),
                        StepName: "",
                        StepType: 0,
                        StepOrder: Number(rst.StepOrder),
                        OrderType: 1,
                        Active:1,
                        CustomList: [
                            {
                                //需填充的字段名称
                                PropertyName: rst.PropertyName,
                                //需填充的字段类型
                                PropertyTypeName: rst.PropertyTypeName,
                                //需填充的值
                                PropertyValue: "",
                                //字段类型枚举
                                PropertyType: rst.PropertyType,
                                //业务类型
                                BusinessType: 0,
                                //是否必填(针对填充的值)
                                NotNull: Number(rst.NotNull),
                                //填充主流程数据
                                FillFlow: Number(rst.FillFlow),
                                //在哪流程之前填充
                                PrevStepFill: Number(rst.PrevStepFill),
                                //在哪流程结束填充
                                StepFill: Number(rst.StepFill),
                            }
                        ],
                    };
                    model.com.postStepUpdate({
                        data: ItemTemp
                    }, function (res) {
                        alert("新增成功");
                        model.com.refreshflow();
                    })

                }, TypeSource_Device_time));


            });
            //修改流程
            $("body").delegate("#zace-edite", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-time"), "ID", DATABasic_Flow);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }

                var DEFAULT_VALUE_Device_timeEdite = {
                    FlowType: SelectData[0].FlowType,
                    StepEnum: SelectData[0].StepEnum,
                    StepOrder: SelectData[0].StepOrder,
                }
                $("body").append($com.modal.show(DEFAULT_VALUE_Device_timeEdite, KEYWORD_Device_time, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].FlowType = Number(rst.FlowType);
                    SelectData[0].StepEnum = Number(rst.StepEnum);
                    SelectData[0].StepOrder = Number(rst.StepOrder);
                    $com.util.deleteLowerProperty(SelectData[0]);
                    model.com.postStepUpdate({
                        data: SelectData[0]
                    }, function (res) {
                        alert("修改成功");
                        model.com.refreshflow();
                    })

                }, TypeSource_Device_time));


            });
            //修改自定义字段
            $("body").delegate("#zace-editeCustom", "click", function () {
                $com.util.deleteLowerProperty(mcustomArray);
                var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-custom"), "ID", mcustomArray);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }

                var DEFAULT_VALUE_Device_timeCustom = {
                    PropertyName: SelectData[0].PropertyName,
                    PropertyTypeName: SelectData[0].PropertyTypeName,
                    // PropertyValue: SelectData[0].PropertyValue,
                    PropertyType: SelectData[0].PropertyType,
                    // BusinessType: SelectData[0].BusinessType,
                    NotNull: SelectData[0].NotNull,
                    FillFlow: SelectData[0].FillFlow,
                    PrevStepFill: SelectData[0].PrevStepFill,
                    StepFill: SelectData[0].StepFill,
                }
                $("body").append($com.modal.show(DEFAULT_VALUE_Device_timeCustom, KEYWORD_Device_custom, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    // SelectData[0].PropertyName = rst.PropertyName;
                    // SelectData[0].PropertyTypeName = rst.PropertyTypeName;
                    // SelectData[0].PropertyValue = rst.PropertyValue;
                    // // SelectData[0].PropertyType = Number(rst.PropertyType);
                    // SelectData[0].NotNull = Number(rst.NotNull);
                    // SelectData[0].FillFlow = Number(rst.FillFlow);
                    // SelectData[0].PrevStepFill = Number(rst.PrevStepFill);
                    // SelectData[0].StepFill = Number(rst.StepFill);
                    $com.util.deleteLowerProperty(SelectData[0]);

                    customArray = [];
                    for (var i = 0; i < DATABasic_Flow.length; i++) {
                        if (wID == DATABasic_Flow[i].ID) {
                            customArray.push(DATABasic_Flow[i]);
                        }
                    }
                    for (var m = 0; m < customArray[0].CustomList.length; m++) {
                        customArray[0].CustomList[m].ID = m + 1;
                    }
                    for (var k = 0; k < customArray[0].CustomList.length; k++) {
                        if (customArray[0].CustomList[k].ID == SelectData[0].ID) {
                            customArray[0].CustomList[k].PropertyName = rst.PropertyName;
                            customArray[0].CustomList[k].PropertyTypeName = rst.PropertyTypeName;
                            // customArray[0].CustomList[k].PropertyValue = rst.PropertyValue;
                            customArray[0].CustomList[k].PropertyType = Number(rst.PropertyType);
                            customArray[0].CustomList[k].NotNull = Number(rst.NotNull);
                            customArray[0].CustomList[k].FillFlow = Number(rst.FillFlow);
                            customArray[0].CustomList[k].PrevStepFill = Number(rst.PrevStepFill);
                            customArray[0].CustomList[k].StepFill = Number(rst.StepFill);
                        }
                    }
                    $com.util.deleteLowerProperty(customArray[0]);
                    // customArray[0].CustomList = [];
                    // customArray[0].CustomList.push(SelectData[0]);
                    // for (var k = 0; k < customArray.length; k++) {
                    //     if (!customArray[k].FlowName) {
                    //         customArray[k].FlowName = "";
                    //     }
                    //     if (!customArray[k].StepName) {
                    //         customArray[k].StepName = "";
                    //     }
                    // }
                    model.com.postStepUpdate({
                        data: customArray[0]
                    }, function (res) {
                        alert("修改成功");
                        var ItemCustom = $com.util.Clone(customArray[0].CustomList);
                        mcustomArray = $com.util.Clone(customArray[0].CustomList);
                        for (var i = 0; i < mcustomArray.length; i++) {
                            mcustomArray[i].ID = i + 1;
                        }
                        $.each(ItemCustom, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Device_custom[p])
                                    continue;
                                item[p] = FORMATTRT_Device_custom[p](item[p]);
                            }
                        });

                        $("#femi-Device-tbody-custom").html($com.util.template(ItemCustom, HTML.TableNode_custom));
                    })

                }, TypeSource_Device_custom));


            });
            //新增自定义字段
            $("body").delegate("#zace-customadd", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_Device_custom, KEYWORD_Device_custom, "新增", function (rst) {
                    //调用插入函数 

                    if (!rst || $.isEmptyObject(rst))
                        return;
                    var ItemTemp = {

                        //需填充的字段名称
                        PropertyName: rst.PropertyName,
                        //需填充的字段类型
                        PropertyTypeName: rst.PropertyTypeName,
                        //需填充的值
                        PropertyValue: "",
                        //字段类型枚举
                        PropertyType: Number(rst.PropertyType),
                        //业务类型
                        BusinessType: 0,
                        //是否必填(针对填充的值)
                        NotNull: Number(rst.NotNull),
                        //填充主流程数据
                        FillFlow: Number(rst.FillFlow),
                        //在哪流程之前填充
                        PrevStepFill: Number(rst.PrevStepFill),
                        //在哪流程结束填充
                        StepFill: Number(rst.StepFill),
                    }
                    customArray = [];
                    for (var i = 0; i < DATABasic_Flow.length; i++) {
                        if (wID == DATABasic_Flow[i].ID) {
                            customArray.push(DATABasic_Flow[i]);
                        }
                    }
                    customArray[0].CustomList.push(ItemTemp);
                    model.com.postStepUpdate({
                        data: customArray[0]
                    }, function (res) {
                        alert("新增成功");

                        var ItemCustomAdd = $com.util.Clone(customArray[0].CustomList);
                        mcustomArray = $com.util.Clone(customArray[0].CustomList);
                        for (var i = 0; i < mcustomArray.length; i++) {
                            mcustomArray[i].ID = i + 1;
                        }
                        $.each(ItemCustomAdd, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Device_custom[p])
                                    continue;
                                item[p] = FORMATTRT_Device_custom[p](item[p]);
                            }
                        });
                        for (var k = 0; k < ItemCustomAdd.length; k++) {
                            ItemCustomAdd[k].ID = k + 1;
                        }
                        $("#femi-Device-tbody-custom").html($com.util.template(ItemCustomAdd, HTML.TableNode_custom));

                    })

                }, TypeSource_Device_custom));


            });
            //查看流程列表
            $("body").delegate("#zace-list", "click", function () {
                $(".zzza").hide();
                $(".zzzb").show();
                $(".zzzc").show();
            });
            $("body").delegate("#zace-back", "click", function () {
                $(".zzza").show();
                $(".zzzb").hide();
                $(".zzzc").hide();
            });

            //双击流程列表
            $("body").delegate("#femi-Device-tbody-time tr", "dblclick", function () {
                var $this = $(this);
                wID = Number($this.find('td[data-title=ID]').attr('data-value'));

                if (wID) {
                    var customArray = [];
                    for (var i = 0; i < DATABasic_Flow.length; i++) {
                        if (wID == DATABasic_Flow[i].ID) {
                            customArray = $com.util.Clone(DATABasic_Flow[i].CustomList);;
                        }
                    }
                    for (var k = 0; k < customArray.length; k++) {
                        customArray[k].ID = k + 1;
                    }
                    mcustomArray = $com.util.Clone(customArray);
                    $.each(mcustomArray, function (i, item) {
                        for (var p in item) {
                            if (!FORMATTRT_Device_custom[p])
                                continue;
                            item[p] = FORMATTRT_Device_custom[p](item[p]);
                        }
                    });
                    $("#femi-Device-tbody-custom").html($com.util.template(mcustomArray, HTML.TableNode_custom));

                }
            });
        },


        run: function () {
            model.com.getBPMFlowConfig({
                ID: -1, Type: -1, DBType: -1, Engineer: -1, Active: -1
            }, function (resItem) {
                if (!resItem)
                    return;
                if (resItem && resItem.list) {
                    var Item = $com.util.Clone(resItem.list);
                    BYItem = $com.util.Clone(resItem.list);
                    DATABasic = $com.util.Clone(resItem.list);
                    model.com.getUser({}, function (res) {
                        var mUser = res.list;
                        $.each(mUser, function (i, item) {
                            TypeSource_Device_item.Engineer.push({
                                name: item.Name,
                                value: item.ID,
                            })
                        });

                        $.each(Item, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Device_item[p])
                                    continue;
                                item[p] = FORMATTRT_Device_item[p](item[p]);
                            }
                        });
                        DataAll = $com.util.Clone(Item);
                        $("#femi-Device-tbody-item").html($com.util.template(Item, HTML.TableNode_item));
                    });

                    model.com.getBPMStepConfig({
                        FlowType: -1, StepType: -1, Active: 1
                    }, function (res) {
                        if (!res)
                            return;
                        if (res && res.list) {
                            var ItemFlow = $com.util.Clone(res.list);
                            FlowItem = $com.util.Clone(res.list);
                            DATABasic_Flow = $com.util.Clone(res.list);

                            $.each(DATABasic, function (i, item) {
                                TypeSource_Device_time.FlowType.push({
                                    name: item.Name,
                                    value: item.ID,
                                })
                            });


                            $.each(FlowItem, function (i, item) {
                                for (var p in item) {
                                    if (!FORMATTRT_Device_time[p])
                                        continue;
                                    item[p] = FORMATTRT_Device_time[p](item[p]);
                                }
                            });
                            DataAll_Flow = $com.util.Clone(FlowItem);
        
                            $("#femi-Device-tbody-time").html($com.util.template(FlowItem, HTML.TableNode_time));
                        }
        
                    });
                }
            });

          

        },

        com: {
            refresh: function (modelID) {
                model.com.getBPMFlowConfig({
                    ID: -1, Type: -1, DBType: -1, Engineer: -1, Active: -1
                }, function (resItem) {
                    if (!resItem)
                        return;
                    if (resItem && resItem.list) {
                        var Item = $com.util.Clone(resItem.list);
                        BYItem = $com.util.Clone(resItem.list);
                        DATABasic = $com.util.Clone(resItem.list);
                        model.com.getUser({}, function (res) {
                            var mUser = res.list;
                            $.each(mUser, function (i, item) {
                                TypeSource_Device_item.Engineer.push({
                                    name: item.Name,
                                    value: item.ID,
                                })
                            });
                            $.each(Item, function (i, item) {
                                for (var p in item) {
                                    if (!FORMATTRT_Device_item[p])
                                        continue;
                                    item[p] = FORMATTRT_Device_item[p](item[p]);
                                }
                            });
                            DataAll = $com.util.Clone(Item);
                            $("#femi-Device-tbody-item").html($com.util.template(Item, HTML.TableNode_item));
                        });
    
                    }
                });
            },
            refreshflow: function () {
                model.com.getBPMStepConfig({
                    FlowType: -1, StepType: -1, Active: 1
                }, function (res) {
                    if (!res)
                        return;
                    if (res && res.list) {
                        var ItemFlow = $com.util.Clone(res.list);
                        FlowItem = $com.util.Clone(res.list);
                        DATABasic_Flow = $com.util.Clone(res.list);
                        $.each(FlowItem, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Device_time[p])
                                    continue;
                                item[p] = FORMATTRT_Device_time[p](item[p]);
                            }
                        });
                        DataAll_Flow = $com.util.Clone(FlowItem);
                        $("#femi-Device-tbody-time").html($com.util.template(FlowItem, HTML.TableNode_time));
                    }

                });

            },
            //查询所有配置信息
            getBPMFlowConfig: function (data, fn, context) {
                var d = {
                    $URI: "/BPMFlowConfig/All",
                    $TYPE: "Get",
                    $SERVER: "/MESWDW"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //配置信息的新增或者修改
            postFlowUpdate: function (data, fn, context) {
                var d = {
                    $URI: "/BPMFlowConfig/Update",
                    $TYPE: "Post",
                    $SERVER: "/MESWDW"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //查询流程配置
            getBPMStepConfig: function (data, fn, context) {
                var d = {
                    $URI: "/BPMStepConfig/All",
                    $TYPE: "Get",
                    $SERVER: "/MESWDW"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //流程的新增或者更新
            postStepUpdate: function (data, fn, context) {
                var d = {
                    $URI: "/BPMStepConfig/Update",
                    $TYPE: "Post",
                    $SERVER: "/MESWDW"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
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
            getDepartment: function (data, fn, context) {
                var d = {
                    $URI: "/Department/AllDepartment",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            getPosition: function (data, fn, context) {
                var d = {
                    $URI: "/Department/AllPosition",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
        }
    }),

        model.init();

});