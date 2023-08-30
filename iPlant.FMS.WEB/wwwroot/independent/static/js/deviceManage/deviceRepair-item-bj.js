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
        BJWXItem,
        mID,
        model,
        item,
        HTML;

    mID = 0;
    ItemTemp_SH = {
        LifeRatioList: [],
        ValueRatioList: [],
        ProcessingRatioList: [],
    };
    TimeTemp = {
        LeftTimes: 0,
        RightTimes: 0,
        Ratio: 0,
    };

    HTML = {
        TableNode_item: [
            '<tr data-color="">',
            '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td>',
            '<td style="min-width: 50px" data-title="Name" data-value="{{Name}}">{{Name}}</td>',
            // '<td style="min-width: 50px" data-title="FactoryID" data-value="{{FactoryID}}">{{FactoryID}}</td>',
            '<td style="min-width: 50px" data-title="BusinessUnitID" data-value="{{BusinessUnitID}}">{{BusinessUnitID}}</td>',
            '<td style="min-width: 50px" data-title="WorkShopID" data-value="{{WorkShopID}}">{{WorkShopID}}</td>',
            '<td style="min-width: 50px" data-title="LineID" data-value="{{LineID}}">{{LineID}}</td>',
            '<td style="min-width: 50px" data-title="ModelID" data-value="{{ModelID}}" >{{ModelID}}</td>',
            '<td style="min-width: 50px" data-title="LifeWastage" data-value="{{LifeWastage}}">{{LifeWastage}}</td>',
            '<td style="min-width: 50px" data-title="ValueExpenditure" data-value="{{ValueExpenditure}}">{{ValueExpenditure}}</td>',
            '<td style="min-width: 50px" data-title="ProcessingLimitE" data-value="{{ProcessingLimitE}}">{{ProcessingLimitE}}</td>',
            //	        '<td style="min-width: 50px" data-title="LifeRatioList" data-value="{{LifeRatioList}}">{{LifeRatioList}}</td>',
            //	        '<td style="min-width: 50px" data-title="ValueRatioList " data-value="{{ValueRatioList }}">{{ValueRatioList }}</td>',
            //	        '<td style="min-width: 50px" data-title="ProcessingRatioList" data-value="{{ProcessingRatioList}}">{{ProcessingRatioList}}</td>',
            '<td style="min-width: 50px" data-title="CareItems" data-value="{{CareItems}}">{{CareItems}}</td>',
            '<td style="min-width: 50px" data-title="SecondTime" data-value="{{SecondTime}}">{{SecondTime}}</td>',
            '<td style="min-width: 50px" data-title="Comment" data-value="{{Comment}}">{{Comment}}</td>',
            '<td style="min-width: 50px" data-title="OperatorTime" data-value="{{OperatorTime}}">{{OperatorTime}}</td>',
            '<td style="min-width: 50px" data-title="OperatorID" data-value="{{OperatorID}}">{{OperatorID}}</td>',
            '<td style="min-width: 50px" data-title="EditTime" data-value="{{EditTime}}">{{EditTime}}</td>',
            '<td style="min-width: 50px" data-title="EditorID" data-value="{{EditorID}}">{{EditorID}}</td>',
            '<td data-title="Active" data-value="{{Active}}"><span class="badge lmvt-badge {{ClassBadge}}">{{Badge}}</span>{{Active}}</td>',
            // '<td data-title="Active" data-value="{{Active}}" >{{Active}}</td>',
            '<td style="max-width: 80px" data-title="Handle" data-value="{{ID}}">',
            '<div class="row">',
            '<div class="col-md-6 {{ISAllowed}}">{{ISAllowedText}}</div>',
            '<div class="col-md-6 lmvt-do-info lmvt-reset">修改</div>',
            '</div></td>',
            //'<td style="min-width: 50px" data-title="BaseID" data-value="{{BaseID}}">{{BaseID}}</td>',
            //          '<td style="min-width: 50px" data-title="DSType" data-value="{{DSType}}">{{DSType}}</td>',
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
        KEYWORD_Device_LIST_item = [
            "ID|编号",
            "Name|设备名称",
            "FactoryID|工厂|ArrayOne",
            "BusinessUnitID|部门|ArrayOne",
            "WorkShopID|车间|ArrayOneControl",
            "LineID|产线|ArrayOneControl|WorkShopID",
            "ModelID|备件型号|ArrayOne",
            "LifeWastage|寿命损耗",
            "ValueExpenditure|价值损耗",
            "ProcessingLimitE|加工限制损耗",
            "LifeRatioList|寿命损耗倍率",
            "ValueRatioList|价值损耗倍率",
            "ProcessingRatioList|加工限制损耗倍率",
            "CareItems|注意事项|InputArray",
            "SecondTime|所需时间",
            "Comment|备注",
            "OperatorID|录入人|ArrayOne",
            "OperatorTime|录入时刻|DateTime",
            "EditTime|修改时刻|DateTime",
            "EditorID|修改人|ArrayOne",
            "Active|状态|ArrayOne",
            //"BaseID|基地",
        ];
        KEYWORD_Device_item = {};
        FORMATTRT_Device_item = {};
        DEFAULT_VALUE_Device_item = {
            Name: "",
            ModelID: 0,
            LifeWastage: 0,
            ValueExpenditure: 0,
            ProcessingLimitE: 0,
            CareItems: [],
            SecondTime: 0,
            Comment: "",
            //Active: 0,
            BusinessUnitID: 0,
            WorkShopID: 0,
            LineID: 0,
        };

        TypeSource_Device_item = {
            ModelID: [{
                name: "无",
                value: 0
            }],
            Active: [{
                name: "激活",
                value: 1
            }, {
                name: "禁用",
                value: 0
            }],
            OperatorID: [{
                name: "无",
                value: 0
            }],
            EditorID: [{
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
    });

    $(function () {
        KEYWORD_Device_LIST_itemG = [
            "ID|编号|Readonly",
            "Name|设备名称|Readonly",
            "FactoryID|工厂|Readonly",
            "BusinessUnitID|部门|Readonly",
            "WorkShopID|车间|Readonly",
            "LineID|产线|Readonly",
            "ModelID|备件型号|Readonly",
            "LifeWastage|寿命损耗|Readonly",
            "ValueExpenditure|价值损耗|Readonly",
            "ProcessingLimitE|加工限制损耗|Readonly",
            "LifeRatioList|寿命损耗倍率|Readonly",
            "ValueRatioList|价值损耗倍率|Readonly",
            "ProcessingRatioList|加工限制损耗倍率|Readonly",
            "CareItems|注意事项|InputArray",
            "SecondTime|所需时间|Readonly",
            "Comment|备注|Readonly",
            "OperatorID|录入人|Readonly",
            "OperatorTime|录入时刻|Readonly",
            "EditTime|修改时刻|Readonly",
            "EditorID|修改人|Readonly",
            "Active|状态|Readonly",
            //"BaseID|基地|Readonly",      
        ];
        KEYWORD_Device_itemG = {};
        FORMATTRT_Device_itemG = {};
        DEFAULT_VALUE_Device_itemG = {};

        TypeSource_Device_itemG = {};


        $.each(KEYWORD_Device_LIST_itemG, function (i, item) {
            var detail = item.split("|");
            KEYWORD_Device_itemG[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_Device_itemG[detail[0]] = $com.util.getFormatter(TypeSource_Device_itemG, detail[0], detail[2]);
            }
        });
    });
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
        name: '设备维修',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {



            //设备维修(维修项)模糊查询
            $("body").delegate("#zace-search-Device-item", "change", function () {

                var $this = $(this),
                    value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-Device-tbody-item").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-Device-tbody-item"), DataAll, value, "ID");
            });

            //设备维修修改(项目表)
            $("body").delegate(".lmvt-reset", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DATABasic.filter((item) => { return item.ID == wID });
                var default_value = {
                    Name: SelectData[0].Name,
                    ModelID: SelectData[0].ModelID,
                    LifeWastage: SelectData[0].LifeWastage,
                    ValueExpenditure: SelectData[0].ValueExpenditure,
                    ProcessingLimitE: SelectData[0].ProcessingLimitE,
                    CareItems: SelectData[0].CareItems,
                    Comment: SelectData[0].Comment,
                    BusinessUnitID: SelectData[0].BusinessUnitID,
                    FactoryID: SelectData[0].FactoryID,
                    WorkShopID: SelectData[0].WorkShopID,
                    LineID: SelectData[0].LineID,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Device_item, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].Name = rst.Name;
                    SelectData[0].ModelID = rst.ModelID;
                    SelectData[0].LifeWastage = rst.LifeWastage;
                    SelectData[0].ValueExpenditure = rst.ValueExpenditure;
                    SelectData[0].ProcessingLimitE = rst.ProcessingLimitE;
                    SelectData[0].CareItems = rst.CareItems;
                    SelectData[0].Comment = rst.Comment;
                    SelectData[0].BusinessUnitID = rst.BusinessUnitID;
                    SelectData[0].FactoryID = rst.FactoryID;
                    SelectData[0].WorkShopID = rst.WorkShopID;
                    SelectData[0].LineID = rst.LineID;
                    var _list = [];
                    for (var i = 0; i < BJWXItem.length; i++) {
                        if (SelectData[0].ID != BJWXItem[i].ID) {
                            _list.push(BJWXItem[i]);
                        }
                    }
                    for (i = 0; i < _list.length; i++) {
                        if (_list[i].Name == rst.Name && _list[i].ModelID == Number(rst.ModelID)) {
                            alert("维修项出现重复！");
                            return false;
                        }
                    }
                    model.com.postDeviceRepairItem({
                        data: SelectData[0]
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                    })

                }, TypeSource_Device_item));


            });

            //设备维修新增(项目表)
            $("body").delegate("#zace-add-Device-item", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_Device_item, KEYWORD_Device_item, "新增", function (rst) {
                    //调用插入函数 

                    if (!rst || $.isEmptyObject(rst))
                        return;

                    ItemTemp = {
                        ID: 0,
                        Name: rst.Name,
                        ModelID: Number(rst.ModelID),
                        LifeWastage: Number(rst.LifeWastage),
                        ValueExpenditure: Number(rst.ValueExpenditure),
                        ProcessingLimitE: Number(rst.ProcessingLimitE),
                        LifeRatioList: [],
                        ValueRatioList: [],
                        ProcessingRatioList: [],
                        CareItems: rst.CareItems,
                        SecondTime: Number(rst.SecondTime),
                        Comment: rst.Comment,
                        OperatorTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                        OperatorID: 0,
                        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                        EditorID: 0,
                        Active: 1,
                        DSType: 2,
                        BusinessUnitID: Number(rst.BusinessUnitID),
                        FactoryID: 1,
                        WorkShopID: Number(rst.WorkShopID),
                        LineID: Number(rst.LineID),
                        ConfigType: 1,
                        BaseID: 0,
                    };
                    for (i = 0; i < BJWXItem.length; i++) {
                        if (BJWXItem[i].Name == rst.Name && BJWXItem[i].ModelID == Number(rst.ModelID)) {
                            alert("维修项出现重复！");
                            return false;
                        }
                    }
                    model.com.postDeviceRepairItem({
                        data: ItemTemp
                    }, function (res) {
                        model.com.refresh();
                        alert("新增成功");

                    })

                }, TypeSource_Device_item));


            });


            //设备维修导出(项目表)
            $("body").delegate("#zace-export-Device-item", "click", function () {
                var $table = $(".table-part"),
                    fileName = "设备维修项目表.xls",
                    Title = "设备维修项目表";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });

            });

            //设备维修激活(项目表)
            $("body").delegate(".lmvt-do-active", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DATABasic.filter((item) => { return item.ID == wID });

                $com.util.deleteLowerProperty(SelectData);
                model.com.postActive({
                    data: SelectData,
                    Active: 1
                }, function (res) {
                    alert("激活成功");
                    model.com.refresh();
                })
            });

            //          //设备维修禁用(项目表)           
            $("body").delegate(".lmvt-allowed-delete", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));


                var SelectData = DATABasic.filter((item) => { return item.ID == wID });

                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                model.com.postActive({
                    data: SelectData,
                    Active: 0
                }, function (res) {
                    alert("禁用成功");
                    model.com.refresh();
                })
            });

            //设备维修项目到寿命损耗倍率          
            $("body").delegate("#zace-Device-Ratio", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-item"), "ID", DATABasic);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                DataSH = $com.util.Clone(SelectData[0].ValueRatioList);
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

                        SelectData[0].LifeRatioList.push(TimeTemp);
                        SelectData[0].ValueRatioList.push(TimeTemp);
                        SelectData[0].ProcessingRatioList.push(TimeTemp);

                        model.com.postDeviceRepairItem({
                            data: SelectData[0]
                        }, function (res) {
                            model.com.refresh();
                            alert("新增成功");

                        })

                    }, TypeSource_Device_time));


                });

                $(".zzza").css("margin-right", "400px");
                $(".zzzc").hide();
                $(".zzzb").width("400px");
                $(".zzzb").show();
                $("#Sub-Tb-title").html("寿命损耗倍率");
            });

            //设备维修项目到价值损耗倍率          
            $("body").delegate("#zace-Device-Ratio-Value", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-item"), "ID", DATABasic);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                DataSH = $com.util.Clone(SelectData[0].ValueRatioList);
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

                        SelectData[0].LifeRatioList.push(TimeTemp);
                        SelectData[0].ValueRatioList.push(TimeTemp);
                        SelectData[0].ProcessingRatioList.push(TimeTemp);


                        model.com.postDeviceRepairItem({
                            data: SelectData[0]
                        }, function (res) {
                            model.com.refresh();
                            alert("新增成功");

                        })

                    }, TypeSource_Device_time));


                });

                $(".zzza").css("margin-right", "400px");
                $(".zzzb").show();
                $(".zzzc").hide();
                $(".zzzb").width("400px");
                $("#Sub-Tb-title").html("价值损耗倍率");

            });

            //设备维修项目到加工限制损耗倍率          
            $("body").delegate("#zace-Device-Ratio-JG", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-item"), "ID", DATABasic);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }

                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                DataSH = $com.util.Clone(SelectData[0].ProcessingRatioList);
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

                        SelectData[0].LifeRatioList.push(TimeTemp);
                        SelectData[0].ValueRatioList.push(TimeTemp);
                        SelectData[0].ProcessingRatioList.push(TimeTemp);


                        model.com.postDeviceRepairItem({
                            data: SelectData[0]
                        }, function (res) {
                            model.com.refresh();
                            alert("新增成功");

                        })

                    }, TypeSource_Device_time));


                });





                $(".zzza").css("margin-right", "400px");
                $(".zzzb").show();
                $(".zzzc").hide();
                $(".zzzb").width("400px");
                $("#Sub-Tb-title").html("加工限制损耗倍率");
            });
            //倍率隐藏
            $("body").delegate("#zace-Device-yinc", "click", function () {
                $(".zzza").css("margin-right", "0px");
                $(".zzzb").hide();
                $(".zzzc").hide();
                $(".zzzb").width("0px");
            })

            //查看详情          
            $("body").delegate("#zace-search", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-item"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                $(".zzza").css("margin-right", "350px");
                $(".zzzb").hide();
                $(".zzzc").css("width", "350px");
                $(".zzzc").show();


                var default_value = {
                    ID: SelectData[0].ID,
                    Name: SelectData[0].Name,
                    //ModelID: SelectData[0].ModelID,
                    //LifeWastage: SelectData[0].LifeWastage,
                    //ValueExpenditure: SelectData[0].ValueExpenditure,
                    //ProcessingLimitE: SelectData[0].ProcessingLimitE,
                    //LifeRatioList: SelectData[0].LifeRatioList,
                    //ValueRatioList: SelectData[0].ValueRatioList,
                    //ProcessingRatioList: SelectData[0].ProcessingRatioList,
                    CareItems: SelectData[0].CareItems,
                    //SecondTime: SelectData[0].SecondTime,
                    //Comment: SelectData[0].Comment,
                    //OperatorTime: SelectData[0].OperatorTime,
                    //OperatorID: SelectData[0].OperatorID,
                    //EditTime: SelectData[0].EditTime,
                    //EditorID: SelectData[0].EditorID,
                    //Active: SelectData[0].Active,
                    //DSType: SelectData[0].DSType,
                    //BusinessUnitID: SelectData[0].BusinessUnitID,
                    //FactoryID: SelectData[0].FactoryID,
                    //WorkShopID: SelectData[0].WorkShopID,
                    //LineID: SelectData[0].LineID,
                };
                $("body").append($com.propertyGrid.show($(".Typetable-item"), default_value, KEYWORD_Device_itemG, TypeSource_Device_itemG));

            });
            //详情隐藏
            $("body").delegate("#cby-edit-yinc", "click", function () {
                $(".zzza").css("margin-right", "0px");
                $(".zzzb").hide();
                $(".zzzc").hide();
                $(".zzzb").width("0px");
            })

        },


        run: function () {
            var wUser = window.parent._UserAll;
            // var wBusiness = window.parent._Business;
            var wFactory = window.parent._Factory;
            var wWorkShop = window.parent._WorkShop;
            var wLine = window.parent._Line;
            model.com.getSpareModel({
                SpareWorkType: 0, SupplierID: 0, ModelPropertyID: 0,
                Active: -1, SupplierModelNo: ""
            }, function (res1) {
                model.com.getDepartment({}, function (res2) {
                    wBusiness = res2.list;
                    $.each(res1.list, function (i, item) {

                        TypeSource_Device_item.ModelID.push({
                            name: item.ModelNo,
                            value: item.ID,
                            far: null
                        })
                    });

                    $.each(wUser, function (i, item) {
                        TypeSource_Device_item.OperatorID.push({
                            name: item.Name,
                            value: item.ID,
                            far: null
                        })
                    });

                    $.each(wUser, function (i, item) {
                        TypeSource_Device_item.EditorID.push({
                            name: item.Name,
                            value: item.ID,
                            far: null
                        })
                    });
                    $.each(wBusiness, function (i, item) {
                        TypeSource_Device_item.BusinessUnitID.push({
                            name: item.Name,
                            value: item.ID,
                            far: null
                        })
                    });

                    $.each(wWorkShop, function (i, item) {
                        TypeSource_Device_item.WorkShopID.push({
                            name: item.Name,
                            value: item.ID,
                            far: item.BusinessUnitID,
                        })
                    });

                    $.each(wLine, function (i, item) {
                        TypeSource_Device_item.LineID.push({
                            name: item.Name,
                            value: item.ID,
                            far: item.WorkShopID + "_" + item.BusinessUnitID,
                        })
                    });

                    $.each(wFactory, function (i, item) {
                        TypeSource_Device_item.FactoryID.push({
                            name: item.Name,
                            value: item.ID,
                            far: null
                        })
                    });

                    model.com.refresh();
                });
            });
        },

        com: {
            refresh: function () {

                model.com.getDeviceRepairItem({
                    ModelID: -1, Name: "", DSType: 2, Active: -1,
                    BusinessUnitID: 0, BaseID: 0, FactoryID: 0, WorkShopID: 0, LineID: 0
                }, function (resItem) {
                    if (!resItem)
                        return;
                    if (resItem && resItem.list) {
                        var Item = $com.util.Clone(resItem.list);

                        DATABasic = $com.util.Clone(resItem.list);
                        BJWXItem = $com.util.Clone(resItem.list);
                        $.each(Item, function (i, item) {
                            item.Badge = " ";

                            if (item.Active == 1) {
                                item.ISAllowedText = "禁用";
                                item.ISAllowed = "lmvt-allowed-delete";
                                item.ClassBadge = "lmvt-activeBadge";

                            } else {
                                item.ISAllowedText = "启用";
                                item.ISAllowed = "lmvt-do-active";
                                item.ClassBadge = "lmvt-defBadge";
                            }
                            for (var p in item) {
                                if (!FORMATTRT_Device_item[p])
                                    continue;
                                item[p] = FORMATTRT_Device_item[p](item[p]);
                            }
                        });
                        DataAll = $com.util.Clone(Item);
                        $("#femi-Device-tbody-item").html($com.util.template(Item, HTML.TableNode_item));
                        $("#femi-Device-tbody-item tr").each(function (i, item) {
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
                            $("#femi-Device-tbody-time").html($com.util.template(Dlist[0].LifeRatioList, HTML.TableNode_time));
                            $("#femi-Device-tbody-time").html($com.util.template(Dlist[0].ValueRatioList, HTML.TableNode_time));
                            $("#femi-Device-tbody-time").html($com.util.template(Dlist[0].ProcessingRatioList, HTML.TableNode_time));
                            $("#femi-Device-tbody-time tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);


                            });

                        }

                    }

                });

                window.parent.BJWX_Item = 1;

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
            //获取所有设备/备件维修项列表
            getDeviceRepairItem: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceRepairItem/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //获取所有设备型号（台账）
            getSpareModel: function (data, fn, context) {
                var d = {
                    $URI: "/SpareModel/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //添加或修改设备/备件维修项
            postDeviceRepairItem: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceRepairItem/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //激活
            postActive: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceRepairItem/Active",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
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
        }
    }),

        model.init();

});