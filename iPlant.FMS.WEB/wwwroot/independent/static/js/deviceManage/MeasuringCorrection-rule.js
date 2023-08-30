require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/bootstrap-treeview.min'], function ($yang, $com, $treeview) {
    var
        KEYWORD_Device_LIST_Regular,
        KEYWORD_Device_Regular,
        FORMATTRT_Device_Regular,
        DEFAULT_VALUE_Device_Regular,
        TypeSource_Device_Regular,

        KEYWORD_Device_LIST_Type,
        KEYWORD_Device_Type,
        FORMATTRT_Device_Type,
        DEFAULT_VALUE_Device_Type,
        TypeSource_Device_Type,

        KEYWORD_Device_LIST_time,
        KEYWORD_Device_time,
        FORMATTRT_Device_time,
        DEFAULT_VALUE_Device_time,
        TypeSource_Device_time,

        StandardID = 0,

        DeviceModelList,

        ModelID = 0,
        StandardObj,
        ModelObj = null,
        wModelID = 0,

        BYRule,
        BYType,
        DataBasic,
        BYTyperule,
        mID,
        DataAll,
        model,
        item,
        HTML;
    mID = 0;

    ItemTemp_SH = {
        CycleRatioList: [],
        PartsRatioList: [],
    };

    TimeTemp = {
        LeftTimes: 0,
        RightTimes: 0,
        Ratio: 0,
    };

    HTML = {
        TableNode_Type: [
            '<tr data-color="">',
            '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td style="min-width: 50px" data-title="WID" data-value="{{WID}}">{{WID}}</td>',
            '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td>',
            '<td style="min-width: 50px" data-title="Name" data-value="{{Name}}">{{Name}}</td>',
            '<td style="min-width: 50px" data-title="FactoryID" data-value="{{FactoryID}}">{{FactoryID}}</td>',
            '<td style="min-width: 50px" data-title="BusinessUnitID" data-value="{{BusinessUnitID}}">{{BusinessUnitID}}</td>',
            '<td style="min-width: 50px" data-title="WorkShopID" data-value="{{WorkShopID}}">{{WorkShopID}}</td>',
            '<td style="min-width: 50px" data-title="LineID" data-value="{{LineID}}">{{LineID}}</td>',
            '<td style="min-width: 50px" data-title="ModelID" data-value="{{ModelID}}">{{ModelID}}</td>',
            '</tr>',
        ].join(""),
        TableNode_Regular: [
            '<tr data-color="">',
            '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px"/></td> ',
            '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td>',
            '<td style="min-width: 50px" data-title="Name" data-value="{{Name}}">{{Name}}</td>',
            // '<td style="min-width: 50px" data-title="FactoryID" data-value="{{FactoryID}}">{{FactoryID}}</td>',

            // '<td style="min-width: 50px" data-title="BusinessUnitID" data-value="{{BusinessUnitID}}">{{BusinessUnitID}}</td>',
            // '<td style="min-width: 50px" data-title="WorkShopID" data-value="{{WorkShopID}}">{{WorkShopID}}</td>',
            // '<td style="min-width: 50px" data-title="LineID" data-value="{{LineID}}">{{LineID}}</td>',
            '<td style="min-width: 50px" data-title="WorkTypeID" data-value="{{WorkTypeID}}">{{WorkTypeCode}}({{WorkTypeName}})</td>',
            '<td style="min-width: 50px" data-title="ModelID" data-value="{{ModelID}}">{{ModelNo}}({{ModelName}})</td>',
            '<td style="min-width: 50px" data-title="StandardName" data-value="{{StandardName}}">{{StandardName}}</td>',
            '<td style="min-width: 50px" data-title="PDTimeC" data-value="{{PDTimeC}}">{{PDTimeC}}</td>',
            // '<td style="min-width: 50px" data-title="PDNumC" data-value="{{PDNumC}}">{{PDNumC}}</td>',
            //	    '<td style="min-width: 50px" data-title="CycleRatioList" data-value="{{CycleRatioList}}">{{CycleRatioList}}</td>',
            //	    '<td style="min-width: 50px" data-title="PartsRatioList" data-value="{{PartsRatioList}}">{{PartsRatioList}}</td>',
            '<td style="min-width: 50px" data-title="ModeOptions" data-value="{{ModeOptions}}">{{ModeOptions}}</td>',
            '<td style="min-width: 50px" data-title="Comment" data-value="{{Comment}}">{{Comment}}</td>',
            '<td style="min-width: 50px" data-title="CreatorName" data-value="{{CreatorName}}">{{CreatorName}}</td>',
            '<td style="min-width: 50px" data-title="CreateTime" data-value="{{CreateTime}}">{{CreateTime}}</td>',
            '<td style="min-width: 50px" data-title="EditorName" data-value="{{EditorName}}">{{EditorName}}</td>',
            '<td style="min-width: 50px" data-title="EditTime" data-value="{{EditTime}}">{{EditTime}}</td>',
            '<td data-title="Active" data-value="{{Active}}"><span class="badge lmvt-badge {{ClassBadge}}">{{Badge}}</span>{{Active}}</td>',
            // '<td data-title="Active" data-value="{{Active}}" >{{Active}}</td>',
            '<td style="max-width: 80px" data-title="Handle" data-value="{{ID}}">',
            '<div class="row">',
            '<div class="col-md-6 {{ISAllowed}}">{{ISAllowedText}}</div>',
            '<div class="col-md-6 lmvt-do-info lmvt-reset">修改</div>',
            '</div></td>',
            '</tr>',
        ].join(""),

        TableNode_time: [
            '<tr data-color="">',
            '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td style="min-width: 50px" data-title="LeftTimes" data-value="{{LeftTimes}}">{{LeftTimes}}</td>',
            '<td style="min-width: 50px" data-title="RightTimes" data-value="{{RightTimes}}">{{RightTimes}}</td>',
            '<td style="min-width: 50px" data-title="Ratio" data-value="{{Ratio}}" >{{Ratio}}</td>',
            '</tr>',
        ].join(""),
    }

    $(function () {
        KEYWORD_Device_LIST_Regular = [
            "ID|序号",
            "Name|名称*",

            "StandardID|保养规程|ArrayOne",

            "FactoryID|工厂|ArrayOne",
            "BusinessUnitID|部门|ArrayOne",
            "WorkShopID|车间|ArrayOne",
            "LineID|产线|ArrayOne",
            "ModelID|设备型号|ArrayOneControl",
            "TypeID|模板|ArrayOneControl|ModelID",
            "PDTimeC|保养周期(天)",
            "PDNumC|加工个数",
            "ModeOptions|模式列表|Array",
            "Comment|备注",
            "Times|次数",
            "CycleRatioList|周期倍率",
            "PartsRatioList|加工个数倍率",
            "OperatorID|录入人|ArrayOne",
            "OperatorTime|录入时间|DateTime",
            "EditorID|修改人|ArrayOne",
            "EditTime|修改时间|DateTime",
            "Active|状态|ArrayOne",
            "CreateTime|创建时间|DateTime",

            //"BaseID|基地",
        ];
        KEYWORD_Device_Regular = {};
        FORMATTRT_Device_Regular = {};
        DEFAULT_VALUE_Device_Regular = {
            Name: "",
            PDTimeC: 0,
            //PDNumC: 0,
            ModeOptions: [2],
            Comment: "",
            // StandardID: 0,
        };
        TypeSource_Device_Regular = {

            StandardID: [],

            ModeOptions: [{
                name: "周期保养",
                value: 2
            }],
            Active: [
                {
                    name: "激活",
                    value: 1
                }, {
                    name: "禁用",
                    value: 2
                }, {
                    name: "默认",
                    value: 0
                }],
            ModelID: [{
                name: "无",
                value: 0
            }],
            TypeID: [{
                name: "无",
                value: 0
            }],
            EditorID: [{
                name: "无",
                value: 0
            }],
            OperatorID: [{
                name: "无",
                value: 0
            }],
            BusinessUnitID: [{
                name: "无",
                value: 0
            }],
            FactoryID: [{
                name: "无",
                value: 0
            }],
            WorkShopID: [{
                name: "无",
                value: 0
            }],
            LineID: [{
                name: "无",
                value: 0
            }]
        };


        $.each(KEYWORD_Device_LIST_Regular, function (i, item) {
            var detail = item.split("|");
            KEYWORD_Device_Regular[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_Device_Regular[detail[0]] = $com.util.getFormatter(TypeSource_Device_Regular, detail[0], detail[2]);
            }
        });
    });

    $(function () {
        KEYWORD_Device_LIST_Type = [
            "ID|编号",
            "Name|名称",
            "FactoryID|工厂|ArrayOne",
            "BusinessUnitID|部门|ArrayOne",
            "WorkShopID|车间|ArrayOne",
            "LineID|产线|ArrayOne",
            "ModelID|设备型号|ArrayOne",
        ];
        KEYWORD_Device_Type = {};
        FORMATTRT_Device_Type = {};
        DEFAULT_VALUE_Device_Type = {};

        TypeSource_Device_Type = {
            Active: [{
                name: "默认",
                value: "0"
            }, {
                name: "激活",
                value: "1"
            }, {
                name: "禁用",
                value: "2"
            }],
            ModelID: [{
                name: "无",
                value: 0
            }],

            BusinessUnitID: [{
                name: "无",
                value: 0
            }],
            WorkShopID: [{
                name: "无",
                value: 0
            }],
            LineID: [{
                name: "无",
                value: 0
            }],
            FactoryID: [{
                name: "无",
                value: 0
            }]
        };


        $.each(KEYWORD_Device_LIST_Type, function (x, item) {
            var detail = item.split("|");
            KEYWORD_Device_Type[detail[0]] = {
                index: x,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_Device_Type[detail[0]] = $com.util.getFormatter(TypeSource_Device_Type, detail[0], detail[2]);
            }
        });
    });

    //  $(function () {
    //    KEYWORD_Device_LIST_RegularG = [
    //     "ID|序号|Readonly",
    //     "Name|名称|Readonly",
    //     "FactoryID|工厂|Readonly",
    //     "BusinessUnitID|部门|Readonly",
    //     "WorkShopID|车间|Readonly",
    //     "LineID|产线|Readonly",
    //      "ModelID|设备型号|Readonly",
    //     "TypeID|模板|Readonly",
    //     "PDTimeC|加工周期|Readonly",
    //     "PDNumC|加工个数|Readonly",
    //     "ModeOptions|模式列表|Readonly",
    //     "Comment|备注|Readonly",
    //     "CycleRatioList|周期倍率|Readonly",
    //     "PartsRatioList|加工个数倍率|Readonly",
    //     "OperatorID|录入人|Readonly",
    //     "OperatorTime|录入时间|Readonly",
    //     "EditorID|修改人|Readonly",
    //     "EditTime|修改时间|Readonly",
    //     "Active|状态|Readonly",
    //     //"BaseID|基地|Readonly",
    //    ];
    //    KEYWORD_Device_RegularG= {};
    //    FORMATTRT_Device_RegularG = {};
    //    DEFAULT_VALUE_Device_RegularG = {};
    //    TypeSource_Device_RegularG = {};


    //    $.each(KEYWORD_Device_LIST_RegularG , function (i, item) {
    //        var detail = item.split("|");
    //        KEYWORD_Device_RegularG[detail[0]] = {
    //            index: i,
    //            name: detail[1],
    //            type: detail.length > 2 ? detail[2] : undefined,
    //            control: detail.length > 3 ? detail[3] : undefined
    //        };
    //        if (detail.length > 2) {
    //            FORMATTRT_Device_RegularG[detail[0]] = $com.util.getFormatter(TypeSource_Device_RegularG, detail[0], detail[2]);
    //        }
    //    });
    //});

    $(function () {
        KEYWORD_Device_LIST_time = [
            "LeftTimes|左次数范围",
            "RightTimes|右次数范围",
            "Ratio|比率",
        ];
        KEYWORD_Device_time = {};
        FORMATTRT_Device_time = {};
        DEFAULT_VALUE_Device_time = {
            LeftTimes: 0,
            RightTimes: 0,
            Ratio: 0,
        };

        TypeSource_Device_time = {};


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
    });
    model = $com.Model.create({
        name: '量具校正',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            //刷新保养模板
            $("body").delegate("#zace-Device-refresh", "click", function () {
                model.com.refresh();
            });

            //设备保养新增(保养规则)
            $("body").delegate("#zace-add-Device-Regular", "click", function () {

                if (StandardObj.length <= 0) {
                    alert("当前量具未设置保养项点，请设置后重新再试");
                    return false;
                }

                $("body").append($com.modal.show(DEFAULT_VALUE_Device_Regular, KEYWORD_Device_Regular, "新增", function (rst) {

                    var wStandardObj = StandardObj;

                    ModelObj = DeviceModelList.filter(item => item.ID == wStandardObj.ProductID)[0];

                    var RuleTemp = {
                        ID: 0,
                        Code: "",
                        Name: rst.Name,
                        Type: 3,

                        StandardID: wStandardObj.ID,
                        // StandardCode: wStandardObj.Code,
                        // StandardName: wStandardObj.Remark,

                        WorkType: Number(wStandardObj.LineID),

                        MaintainType: 1,
                        ModelID: Number(wStandardObj.ProductID),
                        // ModelNo: ModelObj.ModelNo,
                        // ModelName: ModelObj.ModelName,
                        // TypeID: Number(StandardID),

                        PDTimeC: Number(rst.PDTimeC) * 24 * 1000 * 3600,
                        // PDNumC: Number(rst.PDNumC),
                        CycleRatioList: [],
                        PartsRatioList: [],
                        ModeOptions: [],
                        Comment: rst.Comment,
                        // OperatorID: 0,
                        // OperatorTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                        // EditorID: 0,
                        // EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                        Active: 0,
                        DSType: 1,
                        //BusinessUnitID: SelectData[0].BusinessUnitID,
                        //FactoryID: SelectData[0].FactoryID,
                        //WorkShopID: SelectData[0].WorkShopID,
                        //LineID: SelectData[0].LineID,
                        //BaseID: 0,
                    };

                    RuleTemp.ModeOptions = [];
                    for (var i = 0; i < rst.ModeOptions.length; i++) {
                        RuleTemp.ModeOptions.push(Number(rst.ModeOptions[i]));
                    }
                    if (RuleTemp.ModeOptions.length == 0) {
                        alert("保养模式列表不能为空，请选择保养模式列表！");
                        return false;
                    }
                    for (var i = 0; i < BYRule.length; i++) {
                        for (var j = 0; j < BYTyperule.length; j++) {
                            if (BYRule[i].Name == rst.Name && BYTyperule[j].ID == Number(rst.TypeID)) {
                                alert("保养规则重复！");
                                return false;
                            }
                        }
                    }

                    model.com.postDeviceMaintainRule({
                        data: RuleTemp
                    }, function (res) {
                        model.com.refresh();
                        alert("新增成功");

                    })

                }, TypeSource_Device_Regular));


            });
            //隐藏保养规则
            $("body").delegate("#zace-Device-yincType", "click", function () {

                $(".zzza").css("margin-right", "0px");
                $(".zzzd").hide();
                $(".zzzc").hide();
                $(".zzzb").hide();
                $(".zzzd").width("0px");
            })
            //设备保养新增(保养规则)
            $("body").delegate("#zace-Device-addType", "click", function () {

                // var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-Type"), "WID", BYType);

                // if (!SelectData || !SelectData.length) {
                //     alert("请先选择一行数据再试！")
                //     return;
                // }
                // if (SelectData.length != 1) {
                //     alert("只能同时对一行数据修改！")
                //     return;
                // }

                $("body").append($com.modal.show(DEFAULT_VALUE_Device_Regular, KEYWORD_Device_Regular, "新增", function (rst) {
                    var RuleTemp = {
                        ID: 0,
                        Name: rst.Name,
                        TypeID: Number(SelectData[0].ID),
                        ModelID: Number(SelectData[0].ModelID),
                        PDTimeC: Number(rst.PDTimeC),
                        PDNumC: Number(rst.PDNumC),
                        CycleRatioList: [],
                        PartsRatioList: [],
                        ModeOptions: [],
                        Comment: rst.Comment,
                        OperatorID: 0,
                        OperatorTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                        EditorID: 0,
                        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                        Active: 1,
                        DSType: 1,
                        //BusinessUnitID: SelectData[0].BusinessUnitID,
                        //FactoryID: SelectData[0].FactoryID,
                        //WorkShopID: SelectData[0].WorkShopID,
                        //LineID: SelectData[0].LineID,
                        //BaseID: 0,
                    };

                    RuleTemp.ModeOptions = [];
                    for (var i = 0; i < rst.ModeOptions.length; i++) {
                        RuleTemp.ModeOptions.push(Number(rst.ModeOptions[i]));
                    }
                    if (RuleTemp.ModeOptions.length == 0) {
                        alert("保养模式列表不能为空，请选择保养模式列表！");
                        return false;
                    }
                    for (var i = 0; i < BYRule.length; i++) {
                        for (var j = 0; j < BYTyperule.length; j++) {
                            if (BYRule[i].Name == rst.Name && BYTyperule[j].ID == Number(rst.TypeID)) {
                                alert("保养规则重复！");
                                return false;
                            }
                        }
                    }

                    model.com.postDeviceMaintainRule({
                        data: RuleTemp
                    }, function (res) {
                        model.com.refresh();
                        alert("新增成功");

                    })

                }, TypeSource_Device_Regular));

            });
            ////设备保养新增(保养规则)
            //$("body").delegate("#zace-add-Device-Regular", "click", function () {

            //    $("body").append($com.modal.show(DEFAULT_VALUE_Device_Regular, KEYWORD_Device_Regular, "新增", function (rst) {
            //        //调用插入函数 

            //       var   RuleTemp = {
            //            ID: 0,
            //            Name: rst.Name,
            //            TypeID: Number(rst.TypeID),
            //            ModelID: Number(rst.ModelID),
            //            PDTimeC: Number(rst.PDTimeC),
            //            PDNumC: Number(rst.PDNumC),
            //            CycleRatioList: [],
            //            PartsRatioList: [],
            //            ModeOptions: [],
            //            Comment: rst.Comment,
            //            OperatorID: 0,
            //            OperatorTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
            //            EditorID: 0,
            //            EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
            //            Active: 1,
            //            DSType: 1,
            //            //BusinessUnitID: Number(rst.BusinessUnitID),
            //            //FactoryID: 1,
            //            //WorkShopID: Number(rst.WorkShopID),
            //            //LineID: Number(rst.LineID),
            //            //BaseID: 0,
            //        };

            //        RuleTemp.ModeOptions= [];
            //        for(var i=0;i<rst.ModeOptions.length;i++)
            //        {
            //        	RuleTemp.ModeOptions.push(Number(rst.ModeOptions[i]));
            //        }
            //        if (RuleTemp.ModeOptions.length==0) {
            //            alert("保养模式列表不能为空，请选择保养模式列表！");
            //            return false;
            //        }
            //        for (var i = 0; i < BYRule.length; i++) {
            //            for (var j = 0; j < BYTyperule.length; j++) {
            //                if (BYRule[i].Name == rst.Name && BYTyperule[j].ID == Number(rst.TypeID)) {
            //                    alert("保养规则重复！");
            //                    return false;
            //                }
            //            }
            //        }

            //        model.com.postDeviceMaintainRule({
            //            data: RuleTemp
            //        }, function (res) {
            //            model.com.refresh();
            //            alert("新增成功");

            //        })

            //    }, TypeSource_Device_Regular));


            //});

            //设备保养激活(规则表)
            $("body").delegate(".lmvt-do-active", "click", function () {


                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DATABasic.filter((item) => { return item.ID == wID });

                $com.util.deleteLowerProperty(SelectData);
                model.com.postActive({
                    data: SelectData,
                    Active: 1,
                    Type: 1
                }, function (res) {
                    alert("激活成功");
                    model.com.refresh();
                })
            });

            //设备保养禁用(规则表)           
            $("body").delegate(".lmvt-allowed-delete", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DATABasic.filter((item) => { return item.ID == wID });

                $com.util.deleteLowerProperty(SelectData);
                model.com.postActive({
                    data: SelectData,
                    Active: 2,
                    Type: 3
                }, function (res) {
                    alert("禁用成功");
                    model.com.refresh();
                })
            });

            //设备保养修改(保养规则)
            $("body").delegate(".lmvt-reset", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DATABasic.filter((item) => { return item.ID == wID });
                var default_valueFive = {
                    Name: SelectData[0].Name,
                    // ModelID: SelectData[0].ModelID,
                    // TypeID: SelectData[0].TypeID,
                    Comment: SelectData[0].Comment,
                    PDTimeC: SelectData[0].PDTimeC / (24 * 1000 * 3600),
                    // PDNumC: SelectData[0].PDNumC,
                    ModeOptions: SelectData[0].ModeOptions,

                    //StandardID: SelectData[0].StandardID,

                    //Active:SelectData[0].Active,
                    //BusinessUnitID:SelectData[0].BusinessUnitID,
                    //FactoryID:SelectData[0].FactoryID,
                    //WorkShopID:SelectData[0].WorkShopID,
                    //LineID:SelectData[0].LineID,
                };
                $("body").append($com.modal.show(default_valueFive, KEYWORD_Device_Regular, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].Name = rst.Name;
                    // SelectData[0].ModelID = rst.ModelID;
                    // SelectData[0].TypeID = Number(rst.TypeID);
                    SelectData[0].PDTimeC = Number(rst.PDTimeC * (24 * 1000 * 3600));
                    // SelectData[0].PDNumC = Number(rst.PDNumC);
                    SelectData[0].ModeOptions = rst.ModeOptions;
                    SelectData[0].Comment = rst.Comment;

                    //SelectData[0].StandardID = Number(rst.StandardID);

                    //SelectData[0].Active = Number(rst.Active);
                    //SelectData[0].BusinessUnitID = Number(rst.BusinessUnitID);
                    //SelectData[0].FactoryID = Number(rst.FactoryID);
                    //SelectData[0].WorkShopID = Number(rst.WorkShopID);
                    //SelectData[0].LineID = Number(rst.LineID);

                    //保养规则
                    var _list = [];
                    for (var i = 0; i < BYRule.length; i++) {
                        if (SelectData[0].ID != BYRule[i].ID) {
                            _list.push(BYRule[i]);
                        }
                    }

                    for (var j = 0; j < _list.length; j++) {
                        if (_list[j].Name == rst.Name && _list[j].TypeID == Number(rst.TypeID)) {
                            alert("保养规则重复！");
                            return false;
                        }
                    }
                    //for (var k = 0; k < _list.length; k++) {
                    //    if (_list[k].ModelID == rst.ModelID && _list[k].TypeID == Number(rst.TypeID)) {
                    //        alert("保养模板重复！");
                    //        return false;
                    //    }
                    //}

                    $com.util.deleteLowerProperty(SelectData[0]);

                    model.com.postDeviceMaintainRule({
                        data: SelectData[0]
                    }, function (res) {
                        model.com.refresh();
                        alert("修改成功");
                    })

                }, TypeSource_Device_Regular));
            });

            $("body").delegate("#zace-search-userS", "click", function () {
                var value = $("#zace-search-Device-Regular").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-Device-tbody-Regular").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-Device-tbody-Regular"), DataAll, value, "ID");
                // $com.table.filterByLikeStringData($("#femi-Device-tbody-Regular"), DataAll, value, undefined, undefined, undefined, function (res) {
                //     $("#femi-Device-tbody-Regular").html($com.util.template(res, HTML.TableNode_Regular));
                // });
            });
                
            //设备保养(保养规则表)模糊查询
            $("body").delegate("#zace-search-Device-Regular", "change", function () {

                var $this = $(this),
                    value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-Device-tbody-Regular").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-Device-tbody-Regular"), DataAll, value, "ID");
            });

            //设备保养导出(规则表)
            $("body").delegate("#zace-export-Device-Regular", "click", function () {
                var $table = $(".table-part"),
                    fileName = "设备保养规则表.xls",
                    Title = "设备保养规则表";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });

            });


            // $("body").delegate("#cby-edit-XQ", "click", function () {

            //     var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-Regular"), "ID", DataAll);

            //   if (!SelectData || !SelectData.length) {
            //       alert("请先选择一行数据再试！")
            //       return;
            //   }
            //   if (SelectData.length != 1) {
            //       alert("只能同时对一行数据修改！")
            //       return;
            //   }

            //     $(".zzza").css("margin-right", "350px");
            //     $(".zzzb").css("width", "350px");
            //     $(".zzzb").show();
            //     $(".zzzc").hide();
            //     $(".zzzd").hide();

            //     var default_value = {
            //         ID: SelectData[0].ID,
            //         Name: SelectData[0].Name,
            //         TypeID: SelectData[0].TypeID,
            //         ModelID: SelectData[0].ModelID,
            //         Comment: SelectData[0].Comment,
            //         PDTimeC: SelectData[0].PDTimeC,
            //         PDNumC: SelectData[0].PDNumC,
            //         ModeOptions: SelectData[0].ModeOptions,
            //         //CycleRatioList: SelectData[0].CycleRatioList,
            //         //PartsRatioList: SelectData[0].PartsRatioList, 
            //         OperatorID: SelectData[0].OperatorID,
            //         OperatorTime: SelectData[0].OperatorTime,
            //         EditorID: SelectData[0].EditorID,
            //         EditTime: SelectData[0].EditTime,
            //         Active: SelectData[0].Active,
            //         BusinessUnitID: SelectData[0].BusinessUnitID,
            //         FactoryID: SelectData[0].FactoryID,
            //         WorkShopID: SelectData[0].WorkShopID,
            //         LineID: SelectData[0].LineID,
            //     };
            // $("body").append($com.propertyGrid.show($(".Typetable"),default_value, KEYWORD_Device_RegularG, TypeSource_Device_RegularG));

            //});
            // $("body").delegate("#cby-edit-ledger", "click", function () {

            //     $(".zzza").css("margin-right", "0px");
            //     $(".zzzb").hide();
            //     $(".zzzc").hide();
            //     $(".zzzd").hide();
            //     $(".zzzb").width("0px");
            //})

            $("body").delegate("#zace-type-search-Regular", "click", function () {
                var vdata = { 'header': '设备保养模板', 'href': './device_manage/deviceMaintain-type.html', 'id': 'DeviceMaintenance-type', 'src': './static/images/menu/deviceManage/deviceMaintainType.png' };
                window.parent.iframeHeaderSet(vdata);
            });



            //维修配置
            $("body").delegate("#zace-WX-Device-Regular", "click", function () {
                var vdata = { 'header': '设备维修配置', 'href': './device_manage/deviceRepair-rule.html', 'id': 'DeviceRepair-rule', 'src': './static/images/menu/deviceManage/deviceRepair.png' };
                window.parent.iframeHeaderSet(vdata);
            });
            //点检配置
            $("body").delegate("#zace-DJ-Device-Regular", "click", function () {
                var vdata = { 'header': '设备点检配置', 'href': './device_manage/devicePointCheck-rule.html', 'id': 'DevicePointCheck', 'src': './static/images/menu/deviceManage/deviceMaintainSet.png' };
                window.parent.iframeHeaderSet(vdata);
            });

            //备件保养配置
            $("body").delegate("#zace-BJBY-Device-Regular", "click", function () {
                var vdata = { 'header': '备件保养配置', 'href': './device_manage/deviceMaintain-rule-bj.html', 'id': 'DeviceMaintenance-bj', 'src': './static/images/menu/deviceManage/deviceMaintainSet.png' };
                window.parent.iframeHeaderSet(vdata);
            });

            //备件维修配置
            $("body").delegate("#zace-BJWX-Device-Regular", "click", function () {
                var vdata = { 'header': '备件维修配置', 'href': './device_manage/deviceRepair-rule-bj.html', 'id': 'DeviceRepair-rule-bj', 'src': './static/images/menu/deviceManage/deviceRepair.png' };
                window.parent.iframeHeaderSet(vdata);
            });

            //设备保养规则到加工个数倍率         
            $("body").delegate("#zace-edit-Device-JG", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-Regular"), "ID", DATABasic);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                DataSH = $com.util.Clone(SelectData[0].PartsRatioList);
                $("#femi-Device-tbody-time").html($com.util.template(DataSH, HTML.TableNode_time));
                $("#femi-Device-tbody-time tr").each(function (i, item) {
                    var $this = $(this);
                    var colorName = $this.css("background-color");
                    $this.attr("data-color", colorName);
                });
                mID = SelectData[0].ID;
                $("body").delegate("#zace-Device-addsh", "click", function () {

                    $("body").append($com.modal.show(DEFAULT_VALUE_Device_time, KEYWORD_Device_time, "新增", function (rst) {
                        //调用插入函数 

                        if (!rst || $.isEmptyObject(rst))
                            return;
                        TimeTemp.LeftTimes = Number(rst.LeftTimes);
                        TimeTemp.RightTimes = Number(rst.RightTimes);
                        TimeTemp.Ratio = Number(rst.Ratio);

                        SelectData[0].CycleRatioList.push(TimeTemp);
                        SelectData[0].PartsRatioList.push(TimeTemp);

                        $com.util.deleteLowerProperty(SelectData[0]);

                        model.com.postDeviceMaintainRule({
                            data: SelectData[0]
                        }, function (res) {
                            model.com.refresh();
                            alert("新增成功");

                        })

                    }, TypeSource_Device_time));


                });

                $(".zzza").css("margin-right", "400px");
                $(".zzzb").hide();
                $(".zzzd").hide();
                $(".zzzc").show();
                $(".zzzc").width("400px");
                $("#Sub-Tb-title").html("加工个数倍率");
            });

            //设备保养规则到周期倍率         
            $("body").delegate("#zace-add-Device-ZQ", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-Regular"), "ID", DATABasic);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                DataSH = $com.util.Clone(SelectData[0].CycleRatioList);
                $("#femi-Device-tbody-time").html($com.util.template(DataSH, HTML.TableNode_time));
                $("#femi-Device-tbody-time tr").each(function (i, item) {
                    var $this = $(this);
                    var colorName = $this.css("background-color");
                    $this.attr("data-color", colorName);



                });
                mID = SelectData[0].ID;
                $("body").delegate("#zace-Device-addsh", "click", function () {

                    $("body").append($com.modal.show(DEFAULT_VALUE_Device_time, KEYWORD_Device_time, "新增", function (rst) {
                        //调用插入函数 

                        if (!rst || $.isEmptyObject(rst))
                            return;
                        TimeTemp.LeftTimes = Number(rst.LeftTimes);
                        TimeTemp.RightTimes = Number(rst.RightTimes);
                        TimeTemp.Ratio = Number(rst.Ratio);

                        SelectData[0].CycleRatioList.push(TimeTemp);
                        SelectData[0].PartsRatioList.push(TimeTemp);

                        $com.util.deleteLowerProperty(SelectData[0]);

                        model.com.postDeviceMaintainRule({
                            data: SelectData[0]
                        }, function (res) {
                            model.com.refresh();
                            alert("新增成功");

                        })

                    }, TypeSource_Device_time));


                });

                $(".zzza").css("margin-right", "400px");
                $(".zzzc").show();
                $(".zzzb").hide();
                $(".zzzd").hide();
                $(".zzzc").width("400px");
                $("#Sub-Tb-title").html("周期倍率");
            });


            //倍率隐藏
            $("body").delegate("#zace-Device-yinc", "click", function () {
                $(".zzza").css("margin-right", "0px");
                $(".zzzb").hide();
                $(".zzzc").hide();
                $(".zzzd").hide();
                $(".zzzb").width("0px");
                $(".zzzc").width("0px");
            })

            window.setFunctionTrigger("deviceMaintain", function (obj) {

                model.com.refreshStandardInfo(obj.ID);

            });

        },





        run: function () {
            var wUser = window.parent._UserAll;
            // var wBusiness = window.parent._Business;
            var wFactory = window.parent._Factory;
            var wWorkShop = window.parent._WorkShop;
            var wLine = window.parent._Line;

            //标准的ID
            var ID = model.query.ID;

            BYTyperule = [];

            IPTMode = 20;
            // model.com.getDeviceModel({ Active: -1, Type: 1 }, function (res) {

            //     GruopAllTree = res.list;

            //     model.com.getDeviceLedgerAll({ ModelID: 0, WorkShopID: 0, LineID: 0, BusinessUnitID: 0, BaseID: 0, FactoryID: 0, Active: -1, Type: 3 }, function (resD) {
            //         var AllDeviceLedger = resD.list;

            //         $.each(GruopAllTree, function (i, item) {

            //             item.text = item.ModelNo;
            //             item.nodes = [];

            //             item.ISModel = true;

            //             // $.each(AllDeviceLedger, function (j, jtem) {
            //             //     if (jtem.ModelID == item.ID) {

            //             //         jtem.ISModel = false;

            //             //         jtem.text = jtem.Name;
            //             //         jtem.nodes = [];
            //             //         jtem.tags = [0];
            //             //         item.nodes.push(jtem);
            //             //     }
            //             // });

            //             var Counts = item.nodes.length;
            //             item.tags = [Counts];
            //         });

            //         $("#standardList").treeview({
            //             // color: "#428bca",

            //             // expandIcon: "glyphicon glyphicon-stop",
            //             // collapseIcon: "glyphicon glyphicon-unchecked",
            //             color: "black",
            //             expandIcon: "glyphicon glyphicon-plus",
            //             collapseIcon: "glyphicon glyphicon-minus",

            //             preventUnselect: true,

            //             levels: 0,

            //             nodeIcon: "glyphicon glyphicon-tags",

            //             showTags: true,
            //             data: GruopAllTree,

            //             onNodeSelected: function (event, data) {

            //                 NodeID = data.nodeId;
            //                 SelectedNode = data.nodeId;
            //                 var sels = $('#standardList').treeview('getSelected');
            //                 for (var i = 0; i < sels.length; i++) {
            //                     if (sels[i].nodeId == data.nodeId) {
            //                         continue;
            //                     }
            //                     $('#standardList').treeview('unselectNode', [sels[i].nodeId, { silent: true }]);
            //                 }
            //                 $("#standardList").treeview('selectNode', [data.nodeId, { silent: true }]);

            //                 if (!data.ISModel) {
            //                     wModelID = data.ID;
            //                     wGroupID = data.ModelID;
            //                 } else {
            //                     wModelID = 0;
            //                     StandardID = data.ID;
            //                 }
            //                 model.com.refreshStandard();

            //                 ModelObj = data;

            //                 //model.com.refreshPartAll();
            //                 model.com.refresh();
            //             },

            //             onNodeUnselected: function (event, data) {

            //                 if (SelectedNode != data.nodeId)
            //                     return false;

            //                 $('#standardList').treeview('toggleNodeSelected', [SelectedNode, { silent: true }]);
            //             }

            //         });
            //     });

            // });


            // model.com.getDeviceMaintainType({
            //     ModelID: -1, Name: "", DSType: 1, Active: -1,
            //     BusinessUnitID: 0, BaseID: 0, FactoryID: 0, WorkShopID: 0, LineID: 0
            // }, function (res1) {
            //     BYTyperule = res1.list;
            model.com.getDepartment({}, function (res2) {
                wBusiness = res2.list;
                // $.each(res1.list, function (i, item) {
                //     TypeSource_Device_Regular.TypeID.push({
                //         name: item.Name,
                //         value: item.ID,
                //         far: item.ModelID
                //     })
                // });

                $.each(wUser, function (i, item) {
                    TypeSource_Device_Regular.OperatorID.push({
                        name: item.Name,
                        value: item.ID,
                        far: null
                    })
                });

                $.each(wUser, function (i, item) {
                    TypeSource_Device_Regular.EditorID.push({
                        name: item.Name,
                        value: item.ID,
                        far: null
                    })
                });

                model.com.getDeviceModel({
                    Active: -1, Type: 3
                }, function (res1) {

                    DeviceModelList = res1.list;

                    $.each(res1.list, function (i, item) {
                        TypeSource_Device_Regular.ModelID.push({
                            name: item.ModelNo,
                            value: item.ID,
                            far: null
                        });
                        TypeSource_Device_Type.ModelID.push({
                            name: item.ModelNo,
                            value: item.ID,
                            far: null
                        })
                    });

                    $.each(wBusiness, function (i, item) {
                        TypeSource_Device_Regular.BusinessUnitID.push({
                            name: item.Name,
                            value: item.ID,
                            far: null
                        });
                        TypeSource_Device_Type.BusinessUnitID.push({
                            name: item.Name,
                            value: item.ID,
                            far: null
                        })
                    });

                    $.each(wWorkShop, function (i, item) {
                        TypeSource_Device_Regular.WorkShopID.push({
                            name: item.Name,
                            value: item.ID,
                            far: null
                        });
                        TypeSource_Device_Type.WorkShopID.push({
                            name: item.Name,
                            value: item.ID,
                            far: null
                        })
                    });

                    $.each(wLine, function (i, item) {
                        TypeSource_Device_Regular.LineID.push({
                            name: item.Name,
                            value: item.ID,
                            far: null
                        });
                        TypeSource_Device_Type.LineID.push({
                            name: item.Name,
                            value: item.ID,
                            far: null
                        })
                    });

                    $.each(wFactory, function (i, item) {
                        TypeSource_Device_Regular.FactoryID.push({
                            name: item.Name,
                            value: item.ID,
                            far: null
                        });
                        TypeSource_Device_Type.FactoryID.push({
                            name: item.Name,
                            value: item.ID,
                            far: null
                        })
                    });

                    model.com.refreshStandardInfo(ID);

                });
            });
            // });

        },

        com: {

            refreshPartAll: function () {
                model.com.getStandardAll({ IPTMode: IPTMode, BusinessUnitID: -1, BaseID: -1, FactoryID: -1, WorkShopID: -1, LineID: 0, PartID: -1, PartPointID: -1, StationID: wModelID, ProductID: StandardID }, function (res) {
                    StandardObj = res.list;

                    TypeSource_Device_Regular.StandardID = [];

                    $.each(StandardObj, function (i, item) {
                        TypeSource_Device_Regular.StandardID.push({
                            name: item.Remark,
                            value: item.ID
                        });
                    });
                });
            },

            refresh: function () {
                model.com.getDeviceMaintainRule({
                    ModelID: -1, Name: "", TypeID: 0, DSType: 1, Active: -1, BusinessUnitID: 0,
                    BaseID: 0, FactoryID: 0, WorkShopID: 0, LineID: 0, MaintainType: 1, Type: 3, StandardID: StandardObj.ID
                }, function (resRule) {
                    if (!resRule)
                        return;
                    if (resRule && resRule.list) {
                        var Rule = $com.util.Clone(resRule.list);
                        BYRule = $com.util.Clone(resRule.list);
                        DATABasic = $com.util.Clone(resRule.list);

                        $.each(Rule, function (i, item) {

                            item.Badge = " ";

                            item.PDTimeC = item.PDTimeC / (24 * 1000 * 3600)

                            if(item.ModelID==0){
                                item.ModelNo = "";
                                item.ModelName = "无";
                            }

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
                                if (!FORMATTRT_Device_Regular[p])
                                    continue;
                                item[p] = FORMATTRT_Device_Regular[p](item[p]);
                            }
                        });
                        DataAll = $com.util.Clone(Rule);
                        $("#femi-Device-tbody-Regular").html($com.util.template(Rule, HTML.TableNode_Regular));
                        $("#femi-Device-tbody-Regular tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);

                        });

                        if (mID > 0) {
                            var Dlist = [];
                            for (var i = 0; i < DATABasic.length; i++) {
                                if (mID == DATABasic[i].ID) {
                                    Dlist.push(DATABasic[i]);
                                    break;
                                }
                            }
                            $("#femi-Device-tbody-time").html($com.util.template(Dlist[0].CycleRatioList, HTML.TableNode_time));
                            $("#femi-Device-tbody-time tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);



                            });
                            $("#femi-Device-tbody-time").html($com.util.template(Dlist[0].PartsRatioList, HTML.TableNode_time));
                            $("#femi-Device-tbody-time tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);
                            });
                        }
                    }
                });

                // model.com.getDeviceMaintainType({
                //     ModelID: -1, Name: "", DSType: 1, Active: -1,
                //     BusinessUnitID: 0, BaseID: 0, FactoryID: 0, WorkShopID: 0, LineID: 0
                // }, function (resType) {
                //     if (!resType)
                //         return;
                //     if (resType && resType.list) {
                //         var Type = $com.util.Clone(resType.list);
                //         BYType = $com.util.Clone(resType.list);
                //         DATABasic_Type = $com.util.Clone(resType.list);

                //         $.each(Type, function (i, item) {
                //             for (var p in item) {
                //                 if (!FORMATTRT_Device_Type[p])
                //                     continue;
                //                 item[p] = FORMATTRT_Device_Type[p](item[p]);
                //             }
                //         });
                //         $.each(BYType, function (i, item) {
                //             item.WID = i + 1;
                //         });
                //         $.each(Type, function (i, item) {
                //             item.WID = i + 1;
                //         });
                //         DataAll_Type = $com.util.Clone(Type);
                //         $("#femi-Device-tbody-Type").html($com.util.template(Type, HTML.TableNode_Type));
                //         $("#femi-Device-tbody-Type tr").each(function (i, item) {
                //             var $this = $(this);
                //             var colorName = $this.css("background-color");
                //             $this.attr("data-color", colorName);



                //         });
                //     }
                // });
            },

            setType: function () {
                setTimeout(function () {
                    if (window.parent.BY_Type == 1) {
                        model.com.getDeviceMaintainType({
                            ModelID: -1, Name: "", DSType: 1, Active: -1,
                            BusinessUnitID: 0, BaseID: 0, FactoryID: 0, WorkShopID: 0, LineID: 0
                        }, function (res1) {
                            TypeSource_Device_Regular.TypeID.splice(1, TypeSource_Device_Regular.TypeID.length - 1);
                            $.each(res1.list, function (i, item) {
                                TypeSource_Device_Regular.TypeID.push({
                                    name: item.Name,
                                    value: item.ID,
                                    far: item.ModelID
                                })
                            });
                            window.parent.BY_Type = 0;
                        });
                    }
                    model.com.setType();
                }, 500);
            },

            refreshStandardInfo: function (ID) {

                model.com.getStandardInfo({
                    ID: ID
                }, function (res) {

                    StandardObj = res.info;
                    StandardID = res.info.ProductID;

                    model.com.refresh();
                });

            },

            //当前版本项表
            getStandardInfo: function (data, fn, context) {
                var d = {
                    $URI: "/IPTStandard/StandardInfo",
                    $TYPE: "get",
                    $SERVER: '/MESQMS',
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //版本查询
            getStandardAll: function (data, fn, context) {
                var d = {
                    $URI: "/IPTStandard/StandardAll",
                    $TYPE: "get",
                    $SERVER: '/MESQMS',
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //当前版本
            getStandardCurrent: function (data, fn, context) {
                var d = {
                    $URI: "/IPTStandard/Current",
                    $TYPE: "get",
                    $SERVER: '/MESQMS',
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //获取所有部门
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
            //获取所有设备型号（台账）
            getDeviceModel: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceModel/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //激活
            postActive: function (data, fn, context) {
                var d = {
                    $URI: "/DMSCalibration/RuleActive",
                    $TYPE: "post",
                    $SERVER: "/MESQMS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询台账
            getDeviceLedgerAll: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceLedger/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取所有设备
            getDeviceMaintainRule: function (data, fn, context) {
                var d = {
                    $URI: "/DMSCalibration/RuleAll",
                    $TYPE: "get",
                    $SERVER: "/MESQMS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //添加或修改设备
            postDeviceMaintainRule: function (data, fn, context) {
                var d = {
                    $URI: "/DMSCalibration/RuleUpdate",
                    $TYPE: "post",
                    $SERVER: "/MESQMS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            // //获取所有设备/备件保养模板列表
            // getDeviceMaintainType: function (data, fn, context) {
            //     var d = {
            //         $URI: "/DeviceMaintainType/All",
            //         $TYPE: "get"
            //     };

            //     function err() {
            //         $com.app.tip('获取失败，请检查网络');
            //     }

            //     $com.app.ajax($.extend(d, data), fn, err, context);
            // },

            //导出
            postExportExcel: function (data, fn, context) {
                var d = {
                    $URI: "/Upload/ExportExcel",
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
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getIPTStandard: function (data, fn, context) {
                var d = {
                    $URI: "/IPTStandard/Current",
                    $TYPE: "get",
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