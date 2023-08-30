require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {

    var HTML,
        model,
        PropertyField,
        KEYWORD,
        KEYWORD_PROPERTY,
        KEYWORD_LIST,
        KEYWORD_LIST_PROPERTY,
        DEFAULT_VALUE,
        DEFAULT_VALUE_PROPERTY,
        TypeSource,
        TypeSource_PROPERTY,
        FORMATTRT,
        FORMATTRT_PROPERTY,
        DMSDeviceSource,
        DMSDevicePropertySource,
        TypeSource_Point,
        DATA,
        DATA1,
        DATA2,
        Formattrt_Arrange,
        RanderData1,
        DataAll,
        DataAllTrue,
        DataAll2,
        DataType,
        AllUser,
        Allsu,
        AllSpareSu,
        AllType,
        Allspare,
        TIME;
    AllUser = [];
    TIME = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date());
    Formattrt_Arrange = [];

    HTML = {
        DeviceTemplate: [
            '<tr data-color="">',
            '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td style="min-width: 50px" data-title="ModelNo" data-value="{{ModelNo}}">{{ModelNo}}</td>   ',
            '<td style="min-width: 50px" data-title="WorkTypeName" data-value="{{WorkTypeName}}">{{WorkTypeName}}</td>   ',
            '<td style="min-width: 50px" data-title="SupplierName" data-value="{SupplierName}}">{{SupplierName}}</td>  ',
            // '<td style="min-width: 50px" data-title="SupplierModelNo " data-value="{{SupplierModelNo }}">{{SupplierModelNo }}</td> ',
            '<td style="min-width: 50px" data-title="Life" data-value="{Life}}">{{Life}}</td>  ',
            '<td style="min-width: 50px" data-title="Cost" data-value="{{Cost}}">{{Cost}}</td>    ',
            '<td style="min-width: 50px" data-title="WarningNum " data-value="{{WarningNum }}">{{WarningNum }}</td>   ',
            '<td style="min-width: 50px" data-title="StockNum" data-value="{StockNum}}">{{StockNum}}</td>  ',
            '<td style="min-width: 50px" data-title="WarningCycle" data-value="{WarningCycle}}">{{WarningCycle}}</td>  ',
            '<td style="min-width: 50px" data-title="WarningNum" data-value="{WarningNum}}">{{WarningNum}}</td>  ',
            '<td style="min-width: 50px" data-title="OperatorName" data-value="{OperatorName}}">{{OperatorName}}</td>  ',
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
        DeviceType: [
            '<tr data-color="">',
            '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td style="min-width: 50px" data-title="Name" data-value="{{Name}}">{{Name}}</td>   ',
            '<td style="min-width: 50px" data-title="OperatorName" data-value="{OperatorName}}">{{OperatorName}}</td>  ',
            '<td style="min-width: 50px" data-title="OperateTime" data-value="{OperateTime}}">{{OperateTime}}</td>  ',
            '<td style="min-width: 50px" data-title="Active" data-value="{Active}}">{{Active}}</td>',
            '</tr>',
        ].join(""),
        DeviceSupplier: [
            '<tr data-color="">',
            '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td style="min-width: 50px" data-title="PropertyNo " data-value="{{PropertyNo }}">{{PropertyNo }}</td>  ',
            '<td style="min-width: 50px" data-title="PropertyID" data-value="{{PropertyID}}">{{PropertyID}}</td>  ',
            '<td style="min-width: 50px" data-title="OperatorName" data-value="{OperatorName}}">{{OperatorName}}</td>  ',
            '<td style="min-width: 50px" data-title="OperateTime" data-value="{OperateTime}}">{{OperateTime}}</td>  ',
            '<td style="min-width: 50px" data-title="Active" data-value="{Active}}">{{Active}}</td>  ',
            '</tr>',
        ].join(""),
    };

    (function () {
        KETWROD_LIST_Arrange = [
            "Active|状态|ArrayOne",
            "OperatorID|录入人|ArrayOne",
            "PropertyID|供应商名称|ArrayOne",
            "WorkType|工作类型|ArrayOne",
            "OperateTime|操作时间|DateTime"
        ];
        KETWROD_Template_Arrange = {};

        Formattrt_Arrange = {};

        TypeSource_Arrange = {

            Active: [
                {
                    name: "启用",
                    value: 1
                },
                {
                    name: "默认",
                    value: 0
                },{
                    name: "禁用",
                    value: 2
                }
            ],
            OperatorID: [],
            PropertyID: [],
            WorkType: [],
        };
        $.each(KETWROD_LIST_Arrange, function (i, item) {
            var detail = item.split("|");
            KETWROD_Template_Arrange[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };

            if (detail.length > 2) {
                Formattrt_Arrange[detail[0]] = $com.util.getFormatter(TypeSource_Arrange, detail[0], detail[2]);
            }
        });
    })();

    (function () {
        KEYWORD_Point_LIST = [
            "ModelNo|备件型号|",
            "WorkType|工作类型|ArrayOne",
            "SI|供应商|ArrayOneControl",
            "ModelPropertyID|供应商型号|ArrayOneControl|SI",
            "Life|备件寿命|",
            "Cost|备件价值|",
            "LimitCount|备件加工限制|",
            "StockNum|库存数量|",
            "WarningCycle|预警周期|",
            "WarningNum|预警加工剩余数|",
            "Active|状态|ArrayOne",
        ];
        KEYWORD_Point_LIST1 = [
            "Name|类型名称|",
            "Active|状态|ArrayOne",

        ];
        KEYWORD_Point_LIST2 = [
            "PropertyNo|供应商型号|",
            "PropertyID|供应商名称|ArrayOne",
            "Active|状态|ArrayOne",
            "OperateTime|操作时间|DateTime"
        ];
        FORMATTRT = {};
        KEYWORD = {};
        KEYWORD1 = {};
        KEYWORD2 = {};
        DEFAULT_VALUE = {
            ModelNo: "",
            WorkType: 0,
            SI: 0,
            // ModelPropertyID: 0,
            Life: 0,
            Cost: 0,
            LimitCount: 0,
            WarningCycle: 0,
            WarningNum: 0,
            StockNum: 0,
            //Active: 0,
        };
        DEFAULT_VALUE1 = {
            ID: 0,
            Name: "",
            OperatorID: "",
            OperatorTime: TIME,
            // Active: 0,
        };
        DEFAULT_VALUE2 = {
            ID: 0,
            // PropertyNo: "",
            PropertyID: 0,
            // Active: 0,
        };
        TypeSource_Point = {
            Active: [{
                name: "启用",
                value: 1
            },
            {
                name: "禁用",
                value: 2
            },
            {
                name: "默认",
                value: 0
            },],
            ModelPropertyID: [
                {
                    name: "无",
                    value: 0,
                    far: 0
                }
            ],
            SI: [
                {
                    name: "无",
                    value: 0,
                    far: 0
                }
            ],
            OperatorID: [],
            WorkType: [
                {
                    name: "无",
                    value: 0,
                    far: 0
                }
            ],
        };
        TypeSource_Point1 = {

            Active: [{
                name: "禁用",
                value: 1
            },
            {
                name: "激活",
                value: 0
            },

            ],
            OperatorID: []

        };
        TypeSource_Point2 = {

            Active: [{
                name: "禁用",
                value: 1
            },
            {
                name: "激活",
                value: 0
            }
            ],
            OperatorID: [],
            PropertyID: []
        };
        $.each(KEYWORD_Point_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT[detail[0]] = $com.util.getFormatter(TypeSource_Point, detail[0], detail[2]);
            }
        });

        $.each(KEYWORD_Point_LIST1, function (i, item) {
            var detail = item.split("|");
            KEYWORD1[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT[detail[0]] = $com.util.getFormatter(TypeSource_Point1, detail[0], detail[2]);
            }
        });
        $.each(KEYWORD_Point_LIST2, function (i, item) {
            var detail = item.split("|");
            KEYWORD2[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT[detail[0]] = $com.util.getFormatter(TypeSource_Point2, detail[0], detail[2]);
            }
        });
    })();



    model = $com.Model.create({
        name: '设备台账方案',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            $("body").delegate("#lmvt-table-basic-add-templet", "click", function () {
                $("#input-file").val("");
                $("#input-file").click();

            });
            //导入
            $("body").delegate("#input-file", "change", function () {
                alert()
                var $this = $(this);

                if (this.files.length == 0)
                    return;
                var fileData = this.files[0];

                var form = new FormData();
                form.append("file", fileData);

                model.com.postImportExcel(form, function (res) {
                    console.log("sss");

                });

            });
            //导出
            $("body").delegate("#lmvt-table-basic-active-basic", "click", function () {
                var $table = $("#deviceSparePart1"),
                    fileName = "设备备件.xls",
                    Title = "设备备件";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.getExportExcel(params, function (res) {
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
                    WorkType: 0,
                    SI: 0,
                    ModelPropertyID: 0,
                    Active: -1,
                    SupplierModelNo: "",
                }
                $("body").append($com.modal.show(default_value, KEYWORD, "查询", function (rst) {
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    model.com.get({
                        WorkType: rst.WorkType,
                        SupplierID: rst.SI,
                        ModelPropertyID: rst.ModelPropertyID,
                        active: rst.Active,
                        SupplierModelNo: "",
                    }, function (res) {
                        if (!res)
                            return;
                        var list = res.list;
                        RanderData1 = res.list;
                        RanderData1 = $com.util.Clone(RanderData1);

                        for (var i = 0; i < RanderData1.length; i++) {
                            for (var j = 0; j < AllUser.length; j++) {
                                if (RanderData1[i].OperatorID == AllUser[j].ID) {
                                    TypeSource_Arrange.OperatorID.push({ name: AllUser[j].Name, value: AllUser[j].ID });
                                }
                            }
                        }
                        for (var m = 0; m < RanderData1.length; m++) {
                            for (var n = 0; n < AllType.length; n++) {
                                if (RanderData1[m].WorkType == AllType[n].ID) {
                                    TypeSource_Arrange.WorkType.push({ name: AllType[n].Name, value: AllType[n].ID });
                                }
                            }
                        }
                        $.each(RanderData1, function (i, item) {
                            for (var p in item) {
                                if (!Formattrt_Arrange[p])
                                    continue;
                                item[p] = Formattrt_Arrange[p](item[p]);
                            }
                        });
                        $(".lmvt-device-body").html($com.util.template(RanderData1, HTML.DeviceTemplate));
                        $(".lmvt-device-body tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });
                    });
                }, TypeSource_Point));
            });
            $("body").delegate("#femi-refresh-ledger", "click", function () {
                model.com.refresh();
            });
            //刷新页面
            $("body").delegate("#lmvt-deviceinfo-refresh", "click", function () {
                model.com.refresh();
            });
            //新增
            $("body").delegate("#zace-add-user", "click", function () {
                //将Json数据中的数据值改成对应默认值，然后传入进去
                $("body").append($com.modal.show(DEFAULT_VALUE, KEYWORD, "新增", function (rst) {
                    //调用插入函数 

                    if (!rst || $.isEmptyObject(rst))
                        return;

                    var _data = {
                        ID: 0,
                        ModelNo: rst.ModelNo,
                        WorkType: Number(rst.WorkType),
                        // ModelPropertyID: Number(rst.ModelPropertyID),

                        ModelPropertyID : Number(rst.SI),

                        Life: Number(rst.Life),
                        Cost: Number(rst.Cost),
                        limitCount: Number(rst.LimitCount),
                        StockNum: Number(rst.StockNum),
                        WarningCycle: Number(rst.WarningCycle),
                        WarningNum: Number(rst.WarningNum),
                        Active: 0,
                    };
                    for (var i = 0; i < DataAllTrue.length; i++) {
                        if (_data.ModelNo == DataAllTrue[i].ModelNo) {
                            alert("备件型号不能重复，请修改！");
                            return;
                        }
                    }
                    model.com.add(
                        { data: _data }
                        , function (res) {
                            alert("新增成功");
                            model.com.refresh();
                        })
                }, TypeSource_Point));
            });
            //新增备件类型
            $("body").delegate("#femi-add-property", "click", function () {

                //将Json数据中的数据值改成对应默认值，然后传入进去
                $("body").append($com.modal.show(DEFAULT_VALUE1, KEYWORD1, "新增", function (rst) {
                    //调用插入函数 

                    if (!rst || $.isEmptyObject(rst))
                        return;

                    var _data = {
                        ID: 0,
                        Name: rst.Name,
                        Active: Number(rst.Active),
                        DSType: 2,
                    };

                    model.com.addST(
                        { data: _data }
                        , function (res) {
                            alert("新增成功");
                            model.com.load_work();


                        });


                }, TypeSource_Point1));

            });
            //新增供应商
            $("body").delegate("#femi-add-property1", "click", function () {
                //将Json数据中的数据值改成对应默认值，然后传入进去
                $("body").append($com.modal.show(DEFAULT_VALUE2, KEYWORD2, "新增", function (rst) {
                    //调用插入函数 

                    if (!rst || $.isEmptyObject(rst))
                        return;
                    var _data = {
                        ID: 0,
                        // PropertyNo: rst.PropertyNo,
                        PropertyID: Number(rst.PropertyID),
                        PropertyName: "",
                        Active: Number(rst.Active),
                        DevicePropertyType: 1,
                        DSType: 2,
                    };
                    for (var i = 0; i < Allsu.length; i++) {
                        if (_data.PropertyID == Allsu[i].ID) {
                            _data.PropertyName = Allsu[i].SupplierName;
                            _data.PropertyNo = Allsu[i].SupplierCode;
                        }
                    }
                    for (var i = 0; i < DataAll2.length; i++) {
                        if (_data.PropertyID == DataAll2[i].PropertyID && _data.PropertyNo == DataAll2[i].PropertyNo) {
                            alert("同供应商备件型号重复，请更改！");
                            return;
                        }
                    }
                    model.com.addSL(
                        { data: _data }
                        , function (res) {
                            alert("新增成功");
                            model.com.load_su();
                        });
                }, TypeSource_Point2));
            });
            //修改
            $("body").delegate(".lmvt-reset", "click", function () {
                // var SelectData = $com.table.getSelectionData($(".lmvt-device-body"), "ID", DataAllTrue);
                // if (!SelectData || !SelectData.length) {
                //     alert("请先选择一行数据再试！");
                //     return;
                // }
                // if (SelectData.length != 1) {
                //     alert("只能同时对一行数据修改！");
                //     return;
                // }
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DataAllTrue.filter((item) => { return item.ID == wID });
                var default_value = {
                    ID: SelectData[0].ID,
                    WorkType: SelectData[0].WorkType,
                    ModelNo: SelectData[0].ModelNo,
                    ModelPropertyID: SelectData[0].ModelPropertyID,
                    Life: SelectData[0].Life,
                    Cost: SelectData[0].Cost,
                    LimitCount: SelectData[0].LimitCount,
                    StockNum: SelectData[0].StockNum,
                    WarningCycle: SelectData[0].WarningCycle,
                    WarningNum: SelectData[0].WarningNum,
                    // Active: SelectData[0].Active,
                };

                for (var i = 0; i < AllSpareSu.length; i++) {
                    if (AllSpareSu[i].PropertyName == SelectData[0].SupplierName) {
                        default_value.SI = AllSpareSu[i].PropertyID;
                    }
                }
                $("body").append($com.modal.show(default_value, KEYWORD, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].WorkType = Number(rst.WorkType);
                    SelectData[0].ModelNo = rst.ModelNo;
                    SelectData[0].ModelPropertyID = Number(rst.ModelPropertyID);
                    SelectData[0].Life = Number(rst.Life);
                    SelectData[0].Cost = Number(rst.Cost);
                    SelectData[0].LimitCount = Number(rst.LimitCount);
                    SelectData[0].StockNum = Number(rst.StockNum);
                    SelectData[0].WarningCycle = Number(rst.WarningCycle);
                    SelectData[0].WarningNum = Number(rst.WarningNum);
                    //SelectData[0].Active = Active;

                    var data_updata = {
                        ID: SelectData[0].ID,
                        WorkType: SelectData[0].WorkType,
                        ModelNo: SelectData[0].ModelNo,
                        ModelPropertyID: SelectData[0].ModelPropertyID,
                        Life: SelectData[0].Life,
                        Cost: SelectData[0].Cost,
                        LimitCount: SelectData[0].LimitCount,
                        StockNum: SelectData[0].StockNum,
                        WarningCycle: SelectData[0].WarningCycle,
                        WarningNum: SelectData[0].WarningNum,
                        Active: SelectData[0].Active,
                    }
                    for (var i = 0; i < DataAllTrue.length; i++) {
                        if (data_updata.ModelNo == DataAllTrue[i].ModelNo && data_updata.ID != DataAllTrue[i].ID) {
                            alert("备件型号不能重复，请修改！");
                            return;
                        }
                    }
                    model.com.add(
                        { data: data_updata }
                        , function (res) {
                            alert("修改成功");
                            model.com.refresh();
                        })

                }, TypeSource_Point));
            });
            //修改备件类型
            $("body").delegate("#femi-edit-property", "click", function () {

                var SelectData = $com.table.getSelectionData($(".lmvt-system-body"), "ID", DataAll2);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                var default_value = {

                    ID: SelectData[0].ID,
                    Name: SelectData[0].Name,
                    // Active: SelectData[0].Active,
                };
                $("body").append($com.modal.show(default_value, KEYWORD1, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].Name = rst.Name,
                        SelectData[0].Active = Number(rst.Active),

                        model.com.addST(
                            { data: SelectData[0] }
                            , function (res) {
                                alert("修改成功");
                                model.com.load_work();
                            })

                }, TypeSource_Point1));

            });
            //修改供应商
            $("body").delegate("#femi-edit-property1", "click", function () {

                var SelectData = $com.table.getSelectionData($(".lmvt-supplier-body"), "ID", DataAll2);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                var default_value = {
                    // ID: SelectData[0].ID,
                    // PropertyNo: SelectData[0].PropertyNo,
                    PropertyID: SelectData[0].PropertyID,
                    PropertyName: SelectData[0].PropertyName,
                    // Active: SelectData[0].Active,
                    DevicePropertyType: SelectData[0].DevicePropertyType,
                    DSType: 2,
                };
                $("body").append($com.modal.show(default_value, KEYWORD2, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].PropertyID = Number(rst.PropertyID);
                    SelectData[0].PropertyNo = rst.PropertyNo;
                    SelectData[0].Active = Number(rst.Active);
                    for (var n = 0; n < DataAll2.length; n++) {
                        if (SelectData[0].PropertyID == DataAll2[n].PropertyID && SelectData[0].PropertyNo == DataAll2[n].PropertyNo && SelectData[0].ID != DataAll2[n].ID) {
                            alert("同供应商设备型号重复,请更改！");
                            return;
                        }
                    }
                    model.com.addSL(
                        { data: SelectData[0] }
                        , function (res) {
                            alert("修改成功");
                            model.com.load_su();
                        });
                }, TypeSource_Point2));
            });
            //禁用
            $("body").delegate(".lmvt-allowed-delete", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DataAllTrue.filter((item) => { return item.ID == wID });

                $com.util.deleteLowerProperty(SelectData);

                model.com.modelActive(
                    { data: SelectData, Active: 2 }
                    , function (res) {
                        alert("禁用完成");
                        model.com.refresh();
                    });

            });
            //激活
            $("body").delegate(".lmvt-do-active", "click", function () {
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DataAllTrue.filter((item) => { return item.ID == wID });

                $com.util.deleteLowerProperty(SelectData);
                model.com.modelActive(
                    { data: SelectData, Active: 1 }
                    , function (res) {
                        alert("激活完成");
                        model.com.refresh();
                    });
            });
            //禁用备件类型
            $("body").delegate("#no", "click", function () {

                var SelectData = $com.table.getSelectionData($(".lmvt-system-body"), "ID", DataAll2);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行或多行数据再试！")
                    return;
                }
                model.com.workActive(
                    { data: SelectData, Active: 2 }
                    , function (res) {
                        alert("禁用完成");
                        model.com.refreshST();
                    });
            });
            //激活备件类型
            $("body").delegate("#ok", "click", function () {

                var SelectData = $com.table.getSelectionData($(".lmvt-system-body"), "ID", DataAll2);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行或多行数据再试！")
                    return;
                }
                model.com.workActive(
                    { data: SelectData, Active: 1 }
                    , function (res) {
                        alert("激活完成");
                        model.com.refreshST();
                    });
            });
            //禁用供应商
            $("body").delegate("#no1", "click", function () {
                var SelectData = $com.table.getSelectionData($(".lmvt-supplier-body"), "ID", DataAll2);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                model.com.propertyActive(
                    { data: SelectData, Active: 2 }
                    , function (res) {
                        alert("禁用完成");
                        model.com.refreshSL();
                    });
            });
            //激活供应商
            $("body").delegate("#ok1", "click", function () {
                var SelectData = $com.table.getSelectionData($(".lmvt-supplier-body"), "ID", DataAll2);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                model.com.propertyActive(
                    { data: SelectData, Active: 1 }
                    , function (res) {
                        alert("激活完成");
                        model.com.refreshSL();
                    });
            });
            //显示生备件类型
            $("body").delegate("#device_type", "click", function () {
                $(".lmvt-container-device").css("margin-right", "500px");
                $(".iplant-tool-right").show();
                $(".lmvt-container-supplier").hide();
                $(".lmvt-container-system").show();
                model.com.refreshST();
            });
            //显示供应商
            $("body").delegate("#device_supplier", "click", function () {
                $(".lmvt-container-device").css("margin-right", "500px");
                $(".iplant-tool-right").show();
                $(".lmvt-container-system").hide();
                $(".lmvt-container-supplier").show();
                model.com.refreshSL();
            });
            //隐藏基本配置
            $("body").delegate("#femi-hide-property", "click", function () {
                $(".lmvt-container-device").css("margin-right", "0px");
                $(".lmvt-container-device").show();
                $(".lmvt-container-system").hide();
                $(".iplant-tool-right").hide();
                $(".lmvt-container-propertyGrid").hide();
            });
            $("body").delegate("#femi-hide-property1", "click", function () {
                $(".lmvt-container-device").css("margin-right", "0px");
                $(".lmvt-container-device").show();
                $(".lmvt-container-supplier").hide();
                $(".iplant-tool-right").hide();
                $(".lmvt-container-propertyGrid").hide();
            });

        },

        run: function () {
            model.com.getSupplier({
                supplier_name: "",
                country_id: 0,
                province_id: 0,
                city_id: 0,
                active: -1
            }, function (res) {
                if (!res)
                    return;
                var list = res.list;
                Allsu = list;
                for (var i = 0; i < list.length; i++) {
                    TypeSource_Point2.PropertyID.push({ name: list[i].SupplierName, value: list[i].ID });
                }
                model.com.getSupplierSpare({
                    PropertyID: 0, PropertyName: "", PropertyNo: "",
                    PropertyType: 1, DSType: 2, Active: -1,
                }, function (res) {
                    if (!res)
                        return;
                    var list = res.list;
                    AllSpareSu = list;
                    var obj = {};
                    for (var i = 0; i < list.length; i++) {
                        if (!obj[list[i].PropertyName]) {
                            TypeSource_Point.SI.push({ name: list[i].PropertyName, value: list[i].ID, far: 0 });
                            obj[list[i].PropertyName] = true;
                        }
                    }
                    for (var j = 0; j < list.length; j++) {
                        TypeSource_Point.ModelPropertyID.push({ name: list[j].PropertyNo, value: list[j].ID, far: list[j].PropertyID });
                    }
                    model.com.getType({
                        PropertyID: 0,
                        PropertyName: "",
                        PropertyNo: "",
                        PropertyType: 0,
                        DSType: 2,
                        Active: -1,
                    }, function (res) {
                        if (!res)
                            return;
                        var list = res.list;
                        AllType = res.list;
                        for (var i = 0; i < list.length; i++) {
                            if (list[i].Name) {
                                TypeSource_Point.WorkType.push({ name: list[i].Name, value: list[i].ID })
                            }
                        }
                        model.com.getUser({

                        }, function (res) {
                            if (!res)
                                return;
                            var list = res.list;
                            AllUser = list;
                            model.com.refresh();
                        });
                    });
                });
            });

        },
        com: {
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
            //设备备件基本信息
            get: function (data, fn, context) {
                var d = {
                    $URI: "/SpareModel/All",
                    $TYPE: "get"
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

            },
            //备件供应商信息
            getSupplierSpare: function (data, fn, context) {
                var d = {
                    $URI: "/DevicePropertyModel/All",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //备件模型激活/禁用
            modelActive: function (data, fn, context) {
                var d = {
                    $URI: "/SpareModel/Active",
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
            //供应商激活/禁用
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
            //备件工作类型
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
            refresh: function () {

                model.com.get({
                    WorkType: 0,
                    SupplierID: 0,
                    ModelPropertyID: 0,
                    Active: -1,
                    SupplierModelNo: "",

                }, function (res) {
                    if (!res)
                        return;
                    var list = res.list;
                    DataAllTrue = $com.util.Clone(list);
                    RanderData1 = res.list;
                    RanderData1 = $com.util.Clone(RanderData1);

                    for (var i = 0; i < RanderData1.length; i++) {
                        for (var j = 0; j < AllUser.length; j++) {
                            if (RanderData1[i].OperatorID == AllUser[j].ID) {
                                TypeSource_Arrange.OperatorID.push({ name: AllUser[j].Name, value: AllUser[j].ID });
                            }
                        }
                    }
                    for (var m = 0; m < RanderData1.length; m++) {
                        for (var n = 0; n < AllType.length; n++) {
                            if (RanderData1[m].WorkType == AllType[n].ID) {
                                TypeSource_Arrange.WorkType.push({ name: AllType[n].Name, value: AllType[n].ID });
                            }
                        }
                    }
                    $.each(RanderData1, function (i, item) {
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
                            if (!Formattrt_Arrange[p])
                                continue;
                            item[p] = Formattrt_Arrange[p](item[p]);
                        }
                    });
                    $(".lmvt-device-body").html($com.util.template(RanderData1, HTML.DeviceTemplate));
                    $(".lmvt-device-body tr").each(function (i, item) {
                        var $this = $(this);
                        var colorName = $this.css("background-color");
                        $this.attr("data-color", colorName);



                    });
                    DataAll = RanderData1;
                });
            },
            refreshST: function () {
                model.com.getType({
                    DSType: 2, Active: -1,
                }, function (res) {
                    if (!res)
                        return;
                    var list = res.list;
                    DataAll2 = list;
                    RanderData = res.list;
                    DataSource = res.list;
                    RanderData = $com.util.Clone(RanderData);
                    for (var i = 0; i < RanderData.length; i++) {
                        if (!RanderData[i].ID)
                            RanderData[i].ID = i + 1;
                    }
                    model.com.getUser({
                    }, function (res1) {
                        if (!res1)
                            return;
                        var list3 = res1.list,
                            rst = [];

                        for (var i = 0; i < RanderData.length; i++) {
                            for (var j = 0; j < list3.length; j++) {

                                if (RanderData[i].OperatorID == list3[j].ID && !RanderData[i].OperatorName) {
                                    TypeSource_Arrange.OperatorID.push({ name: list3[j].Name, value: list3[j].ID });
                                }
                            }
                        }
                        $.each(RanderData, function (i, item) {
                            for (var p in item) {
                                if (!Formattrt_Arrange[p])
                                    continue;
                                item[p] = Formattrt_Arrange[p](item[p]);
                            }
                        });
                        $(".lmvt-system-body").html($com.util.template(RanderData, HTML.DeviceType));
                        $(".lmvt-system-body tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });

                    });


                });
            },
            load_work: function () {
                TypeSource_Point.WorkType.splice(1, TypeSource_Point.WorkType.length - 1);
                model.com.getType({
                    PropertyID: 0,
                    PropertyName: "",
                    PropertyNo: "",
                    PropertyType: 0,
                    DSType: 2,
                    Active: -1,
                }, function (res) {
                    if (!res)
                        return;
                    var list = res.list;
                    AllType = res.list;
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].Name) {
                            TypeSource_Point.WorkType.push({ name: list[i].Name, value: list[i].ID });
                        }
                    }
                    model.com.refreshST();
                });
            },
            refreshSL: function () {
                model.com.getSupplierSpare({
                    PropertyID: 0, PropertyName: "", PropertyNo: "",
                    PropertyType: 1, DSType: 2, Active: -1,
                }, function (res) {
                    if (!res)
                        return;
                    var list = res.list;
                    DataAll2 = list;
                    RanderData = res.list;
                    RanderData = $com.util.Clone(RanderData);

                    for (var i = 0; i < RanderData.length; i++) {
                        for (var j = 0; j < AllUser.length; j++) {

                            if (RanderData[i].OperatorID == AllUser[j].ID && !RanderData[i].OperatorName) {
                                TypeSource_Arrange.OperatorID.push({ name: AllUser[j].Name, value: AllUser[j].ID });
                            }
                        }
                    }

                    for (var i = 0; i < RanderData.length; i++) {
                        for (var j = 0; j < Allsu.length; j++) {
                            if (RanderData[i].PropertyID == Allsu[j].ID) {
                                TypeSource_Arrange.PropertyID.push({ name: Allsu[j].SupplierName, value: Allsu[j].ID });
                            }
                        }
                    }
                    $.each(RanderData, function (i, item) {
                        for (var p in item) {
                            if (!Formattrt_Arrange[p])
                                continue;
                            item[p] = Formattrt_Arrange[p](item[p]);
                        }
                    });
                    $(".lmvt-supplier-body").html($com.util.template(RanderData, HTML.DeviceSupplier));
                    $(".lmvt-supplier-body tr").each(function (i, item) {
                        var $this = $(this);
                        var colorName = $this.css("background-color");
                        $this.attr("data-color", colorName);



                    });
                });
            },
            load_su: function () {
                TypeSource_Point.SI.splice(1, TypeSource_Point.SI.length - 1);
                TypeSource_Point.ModelPropertyID.splice(1, TypeSource_Point.ModelPropertyID.length - 1);
                model.com.getSupplierSpare({
                    PropertyID: 0, PropertyName: "", PropertyNo: "",
                    PropertyType: 1, DSType: 2, Active: -1,
                }, function (res) {
                    if (!res)
                        return;
                    var list = res.list;

                    AllSpareSu = list;
                    var obj = {};
                    for (var i = 0; i < list.length; i++) {
                        if (!obj[list[i].PropertyName]) {
                            TypeSource_Point.SI.push({ name: list[i].PropertyName, value: list[i].ID, far: 0 });
                            obj[list[i].PropertyName] = true;
                        }
                    }
                    for (var j = 0; j < list.length; j++) {
                        TypeSource_Point.ModelPropertyID.push({ name: list[j].PropertyNo, value: list[j].ID, far: list[j].PropertyID });
                    }
                    model.com.refreshSL();
                });
            },
            //导出
            getExportExcel: function (data, fn, context) {
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
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax_load($.extend(d, data), fn, err, context);
            },
            getProperty: function (data, fn, context) {
                var d = {
                    $URI: "/Device/Property",
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
            refreshProperty: function (type) {
                model.com.getProperty({
                    type: type
                }, function (res) {
                    if (res && res.list) {
                        DMSDevicePropertySource[type] = res.list;
                        TypeSource[PropertyField[type]] = $com.table.getTypeSource(
                            DMSDevicePropertySource[type], "ID", "Name",
                            {
                                Active: true
                            });
                        model.com.renderProerty(DMSDevicePropertySource[type]);
                    }
                });
            },
            //添加
            add: function (data, fn, context) {
                var d = {
                    $URI: "/SpareModel/Update",
                    $TYPE: "post"
                };
                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //添加备件类型
            addST: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceWorkType/Update",
                    $TYPE: "post"
                };
                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //添加供应商
            addSL: function (data, fn, context) {
                var d = {
                    $URI: "/DevicePropertyModel/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);

                //DATA1.push(data);
                //fn({ list: 0 });
            },
            //修改
            modify: function (data, fn, context) {
                model.com.get({
                    type: -1
                }, function (res) {
                    if (!res)
                        return;
                    var list = res.list,
                        rst = [];

                    for (var i = 0; i < list.length; i++) {
                        if (data.ID == list[i].ID) {
                            list[i].ID = data.ID;
                            list[i].ModelNo = data.ModelNo;
                            list[i].SparePartsName = data.SparePartsName;
                            list[i].SupplierName = data.SupplierName;
                            list[i].Life = data.Life;
                            list[i].Cost = data.Cost;
                            list[i].LimitCount = data.LimitCount;
                            list[i].StockNum = data.StockNum;
                            list[i].OperatorID = data.OperatorID;
                            list[i].OperatorTime = data.OperatorTime;
                            list[i].active = data.active;
                        }
                    }
                });
                fn({ list: 0 });
            },

            addProperty: function (data, fn, context) {
                var d = {
                    $URI: "/Device/PropertySave",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
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