require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {
    var
        KEYWORD_Device_LIST_Type,
        KEYWORD_Device_Type,
        FORMATTRT_Device_Type,
        DEFAULT_VALUE_Device_Type,
        TypeSource_Device_Type,

        //KEYWORD_Device_LIST_Type_,
        //KEYWORD_Device_Type_,
        //FORMATTRT_Device_Type_,
        //DEFAULT_VALUE_Device_Type_,
        //TypeSource_Device_Type_,

        BYType,
        WDataItem,
        model,
        item,
        HTML;


    HTML = {

        TableNode_Type: [
            '<tr data-color="">',
            '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td>',
            '<td style="min-width: 50px" data-title="Name" data-value="{{Name}}">{{Name}}</td>',
            // '<td style="min-width: 50px" data-title="FactoryID" data-value="{{FactoryID}}">{{FactoryID}}</td>',
            '<td style="min-width: 50px" data-title="BusinessUnitID" data-value="{{BusinessUnitID}}">{{BusinessUnitID}}</td>',
            '<td style="min-width: 50px" data-title="WorkShopID" data-value="{{WorkShopID}}">{{WorkShopID}}</td>',
            '<td style="min-width: 50px" data-title="LineID" data-value="{{LineID}}">{{LineID}}</td>',
            '<td style="min-width: 50px" data-title="ModelID" data-value="{{ModelID}}">{{ModelID}}</td>',
            '<td style="min-width: 50px" data-title="MaintainOptions" data-value="{{MaintainOptions}}">{{MaintainOptions}}</td>',
            '<td style="min-width: 50px" data-title="AgainInterval" data-value="{{AgainInterval}}">{{AgainInterval}}</td>',
            '<td style="min-width: 50px" data-title="Comment" data-value="{{Comment}}">{{Comment}}</td>',
            '<td style="min-width: 50px" data-title="OperatorID" data-value="{{OperatorID}}">{{OperatorID}}</td>',
            '<td style="min-width: 50px" data-title="OperatorTime" data-value="{{OperatorTime}}">{{OperatorTime}}</td>',
            '<td style="min-width: 50px" data-title="EditorID" data-value="{{EditorID}}">{{EditorID}}</td>',
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

        TableNode_Type_: [
            '<tr data-color="">',
            '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td>',
            '<td style="min-width: 50px" data-title="Name" data-value="{{Name}}">{{Name}}</td>',
            '<td style="min-width: 50px" data-title="ModelID" data-value="{{ModelID}}">{{ModelID}}</td>',
            '<td style="min-width: 50px" data-title="CareItems" data-value="{{CareItems}}">{{CareItems}}</td>',
            '<td style="min-width: 50px" data-title="Comment" data-value="{{Comment}}">{{Comment}}</td>',
            '</tr>',
        ].join(""),

    }

    //  $(function () {
    //    KEYWORD_Device_LIST_TypeG = [
    //     "ID|编号|Readonly",
    //     "Name|名称|Readonly",
    //     "FactoryID|工厂|Readonly",
    //     "BusinessUnitID|部门|Readonly",
    //     "WorkShopID|车间|Readonly",
    //     "LineID|产线|Readonly",
    //     "ModelID|设备型号|Readonly",
    //     "MaintainOptions|可选项|Readonly",
    //     "AgainInterval|间隔时间|Readonly",         
    //     "Comment|备注|Readonly",
    //     "Times|次数|Readonly",
    //     "OperatorID|操作员|Readonly",
    //     "OperatorTime|录入时间|Readonly",
    //     "EditTime|编辑时间|Readonly",
    //     "EditorID|编辑人|Readonly",
    //      "Active|状态|Readonly",
    //     //"BaseID|基地|Readonly",
    //    ];
    //    KEYWORD_Device_TypeG= {};
    //    FORMATTRT_Device_TypeG = {};

    //    TypeSource_Device_TypeG = {

    //    };

    //    $.each(KEYWORD_Device_LIST_TypeG , function (x, item) {
    //        var detail = item.split("|");
    //        KEYWORD_Device_TypeG[detail[0]] = {
    //            index: x,
    //            name: detail[1],
    //            type: detail.length > 2 ? detail[2] : undefined,
    //            control: detail.length > 3 ? detail[3] : undefined
    //        };
    //        if (detail.length > 2) {
    //            FORMATTRT_Device_TypeG[detail[0]] = $com.util.getFormatter(TypeSource_Device_TypeG, detail[0], detail[2]);
    //        }
    //    });
    //});              


    $(function () {
        KEYWORD_Device_LIST_Type = [
            "ID|编号",
            "Name|名称",
            "FactoryID|工厂|ArrayOne",
            "BusinessUnitID|部门|ArrayOneControl",
            "WorkShopID|车间|ArrayOneControl|BusinessUnitID",
            "LineID|产线|ArrayOneControl|BusinessUnitID,WorkShopID",
            "ModelID|设备型号|ArrayOneControl",
            "MaintainOptions|可选项|ArrayControl|ModelID",
            "AgainInterval|间隔时间",
            "Comment|备注",
            "OperatorID|操作员|ArrayOne",
            "OperatorTime|录入时间|DateTime",
            "EditTime|编辑时间|DateTime",
            "EditorID|编辑人|ArrayOne",
            "Active|状态|ArrayOne",
            //"BaseID|基地",
        ];
        KEYWORD_Device_Type = {};
        FORMATTRT_Device_Type = {};
        DEFAULT_VALUE_Device_Type = {
            Name: "",
            ModelID: 0,
            MaintainOptions: [],
            Comment: "",
            AgainInterval: 0,
            BusinessUnitID: 0,
            WorkShopID: 0,
            LineID: 0,
        };

        TypeSource_Device_Type = {
            Active: [{
                name: "激活",
                value: "1"
            }, {
                name: "禁用",
                value: "0"
            }],
            ModelID: [{
                name: "无",
                value: 0
            }],
            MaintainOptions: [{
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
                value: 0,
                far: 0,
            }],
            WorkShopID: [{
                name: "无",
                value: 0,
                far: 0,
            }],
            LineID: [{
                name: "无",
                value: 0,
                far: 0,
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


    $(function () {
        KEYWORD_Device_LIST_Type_ = [
            "ID|序号",
            "Name|名称",
            "ModelID|设备型号|ArrayOne",
            "CareItem|注意事项",
            "Comment|备注",

        ];
        KEYWORD_Device_Type_ = {};
        FORMATTRT_Device_Type_ = {};
        DEFAULT_VALUE_Device_Type_ = {
            Name: "",
            ID: 1,
            ModelID: 0,
            Comment: "",
            CareItem: "",
        };

        TypeSource_Device_Type_ = {
            ModelID: [{
                name: "无",
                value: 0
            }]
        };


        $.each(KEYWORD_Device_LIST_Type_, function (i, item) {
            var detail = item.split("|");
            KEYWORD_Device_Type_[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_Device_Type_[detail[0]] = $com.util.getFormatter(TypeSource_Device_Type_, detail[0], detail[2]);
            }
        });
    });

    model = $com.Model.create({
        name: '设备保养',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {

            //设备保养(保养模板表)模糊查询
            $("body").delegate("#zace-search-Device-Type", "change", function () {

                var $this = $(this),
                    value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-Device-tbody-Type").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-Device-tbody-Type"), DataAll_Type, value, "ID");
            });

            //设备保养新增(保养模板)
            $("body").delegate("#zace-add-Device-Type", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_Device_Type, KEYWORD_Device_Type, "新增", function (rst) {
                    //调用插入函数 

                    if (!rst || $.isEmptyObject(rst))
                        return;

                    var TypeTemp = {
                        ID: 0,
                        Name: rst.Name,
                        ModelID: Number(rst.ModelID),
                        AgainInterval: Number(rst.AgainInterval),
                        MaintainOptions: [],
                        Comment: rst.Comment,
                        Times: 0,
                        OperatorID: 0,
                        OperatorTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                        Active: 0,
                        EditorID: 0,
                        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                        DSType: 1,
                        BusinessUnitID: Number(rst.BusinessUnitID),
                        FactoryID: 1,
                        WorkShopID: Number(rst.WorkShopID),
                        LineID: Number(rst.LineID),
                        BaseID: 0,
                    };
                    TypeTemp.MaintainOptions = [];
                    for (var i = 0; i < rst.MaintainOptions.length; i++) {
                        TypeTemp.MaintainOptions.push(Number(rst.MaintainOptions[i]));
                    }

                    for (var i = 0; i < BYType.length; i++) {
                        if (BYType[i].Name == rst.Name && BYType[i].ModelID == Number(rst.ModelID)) {
                            alert("保养模板重复！");
                            return false;
                        }
                    }
                    if (TypeTemp.ModelID == 0) {
                        alert("请选择设备型号！");
                        return false;
                    }
                    model.com.postDeviceMaintainType({
                        data: TypeTemp

                    }, function (res) {
                        model.com.refresh();
                        alert("新增成功");

                    })

                }, TypeSource_Device_Type));


            });

            //设备保养修改(模板表)
            $("body").delegate(".lmvt-reset", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DATABasic_Type.filter((item) => { return item.ID == wID });
                if (SelectData[0].Active == 1) {
                    alert("激活状态下禁止修改！");
                } else {
                    var default_valueThree = {
                        Name: SelectData[0].Name,
                        ModelID: SelectData[0].ModelID,
                        Comment: SelectData[0].Comment,
                        //Active: SelectData[0].Active,
                        AgainInterval: SelectData[0].AgainInterval,
                        MaintainOptions: SelectData[0].MaintainOptions,
                        BusinessUnitID: SelectData[0].BusinessUnitID,
                        FactoryID: SelectData[0].FactoryID,
                        WorkShopID: SelectData[0].WorkShopID,
                        LineID: SelectData[0].LineID,
                    };
                    $("body").append($com.modal.show(default_valueThree, KEYWORD_Device_Type, "修改", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        SelectData[0].Comment = rst.Comment;
                        //SelectData[0].Active = rst.Active;
                        SelectData[0].AgainInterval = rst.AgainInterval;
                        SelectData[0].Name = rst.Name;
                        SelectData[0].ModelID = rst.ModelID;
                        SelectData[0].BusinessUnitID = rst.BusinessUnitID;
                        SelectData[0].FactoryID = rst.FactoryID;
                        SelectData[0].WorkShopID = rst.WorkShopID;
                        SelectData[0].LineID = rst.LineID;
                        SelectData[0].MaintainOptions = [];
                        for (var i = 0; i < rst.MaintainOptions.length; i++) {
                            SelectData[0].MaintainOptions.push(Number(rst.MaintainOptions[i]));
                        }
                        var _list = [];
                        for (var i = 0; i < BYType.length; i++) {
                            if (SelectData[0].ID != BYType[i].ID) {
                                _list.push(BYType[i]);
                            }
                        }
                        for (var i = 0; i < _list.length; i++) {
                            if (_list[i].Name == rst.Name && _list[i].ModelID == Number(rst.ModelID)) {
                                alert("保养模板重复！");
                                return false;
                            }
                        }

                        model.com.postDeviceMaintainType({
                            data: SelectData[0]
                        }, function (res) {
                            alert("修改成功");
                            model.com.refresh();
                        })

                    }, TypeSource_Device_Type));
                }

            });
            //设备保养激活(类型表)
            $("body").delegate(".lmvt-do-active", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DATABasic_Type.filter((item) => { return item.ID == wID });

                // var SelectData = $('.tb_users').bootstrapTable('getSelections');
                // var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-Type"), "ID", DATABasic_Type);

                // if (!SelectData || !SelectData.length) {
                //     alert("请先选择一行数据再试！")
                //     return;
                // }
                // if (SelectData.length != 1) {
                //     alert("只能同时对一行数据操作！")
                //     return;
                // }
                // if (SelectData[0].Active == 1) {
                //     alert("该数据已经激活！")
                //     return;
                // }
                // if (!confirm("已选择" + SelectData.length + "条数据，确定将其激活？")) {
                //     return;
                // }
                var list = [];
                for (var j = 0; j < BYType.length; j++) {
                    if (BYType[j].ID != Number(SelectData[0].ID)) {
                        list.push(BYType[j]);
                    }
                }
                for (var i = 0; i < list.length; i++) {
                    if (list[i].ModelID == Number(SelectData[0].ModelID)) {
                        if (list[i].Active == 1) {
                            alert("该设备型号下已经存在激活状态,请重新输入！");
                            return false;
                        }
                    }
                }
                //for (var j = 0; j < BYType.length; j++) {
                //    if (BYType[j].ModelID == Number(SelectData[0].ModelID) && BYType[j].Name == Number(SelectData[0].Name)) {
                //        if (BYType[j].Active == 1) {
                //            alert("该设备型号下已经存在激活状态,请重新输入！");
                //            return false;
                //        }

                //    }
                //}
                model.com.postActive({
                    data: SelectData,
                    Active: 1
                }, function (res) {
                    alert("激活成功");
                    model.com.refresh();
                })
            });

            //          //设备保养禁用(类型表)           
            $("body").delegate(".lmvt-allowed-delete", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));


                var SelectData = DATABasic_Type.filter((item) => { return item.ID == wID });

                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                model.com.postActive({
                    data: SelectData,
                    Active: 2
                }, function (res) {
                    alert("禁用成功");
                    model.com.refresh();
                })
            });

            //设备保养导出(模板表)
            $("body").delegate("#zace-export-Device-Type", "click", function () {
                var $table = $(".table-part"),
                    fileName = "设备保养模板表.xls",
                    Title = "设备保养模板表";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });

            });
            //设备保养模板(从设备保养模板到保养项)
            $("body").delegate("#zace-type-search-Type", "click", function () {
                var _vdata = { 'header': '设备保养项目', 'href': './device_manage/deviceMaintain-item.html', 'id': 'DeviceMaintenance-item', 'src': './static/images/menu/deviceManage/deviceMaintainItem.png' };
                window.parent.iframeHeaderSet(_vdata);
            });


            //查看保养项
            $("body").delegate("#zace-type-X", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-Type"), "ID", DATABasic_Type);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                var list = SelectData[0].MaintainOptions;
                var listItem = [];

                for (var i = 0; i < list.length; i++) {
                    for (var j = 0; j < WDataItem.length; j++) {
                        if (list[i] == WDataItem[j].ID) {
                            listItem.push(WDataItem[j]);
                        }
                    }
                }
                var _listz = $com.util.Clone(listItem);
                $.each(_listz, function (i, item) {
                    for (var p in item) {
                        if (!FORMATTRT_Device_Type_[p])
                            continue;
                        item[p] = FORMATTRT_Device_Type_[p](item[p]);
                    }
                });

                $("#femi-Device-tbody-Type_").html($com.util.template(_listz, HTML.TableNode_Type_));
                $("#femi-Device-tbody-Type_ tr").each(function (i, item) {
                    var $this = $(this);
                    var colorName = $this.css("background-color");
                    $this.attr("data-color", colorName);



                });


                $(".zzza").css("margin-right", "400px");
                $(".zzzb").show();
                $(".zzzb").css("width", "400px");
                $(".zzzc").hide();
            });

            //保养项隐藏
            $("body").delegate("#zace-edit-Device-TypeYC", "click", function () {
                $(".zzza").css("margin-right", "0px");
                $(".zzzb").hide();
                $(".zzzc").hide();
                $(".zzzb").width("0px");
            })
            //查看详情
            //  $("body").delegate("#zace-type-search-XQ", "click", function () {

            //     var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-Type"), "ID", DataAll_Type);

            //     if (!SelectData || !SelectData.length) {
            //         alert("请先选择一行数据再试！")
            //         return;
            //     }
            //     if (SelectData.length != 1) {
            //         alert("只能同时对一行数据修改！")
            //         return;
            //     }
            //     $(".zzza").css("margin-right", "350px");
            //     $(".zzzb").hide();
            //     $(".zzzc").css("width", "350px");
            //     $(".zzzc").show();


            //     var default_value = {
            //         ID: SelectData[0].ID,
            //         Name: SelectData[0].Name,
            //         ModelID: SelectData[0].ModelID, 
            //         AgainInterval: SelectData[0].AgainInterval,
            //         Comment: SelectData[0].Comment,
            //         MaintainOptions: SelectData[0].MaintainOptions,
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
            // $("body").append($com.propertyGrid.show($(".Typetable-type"),default_value, KEYWORD_Device_TypeG, TypeSource_Device_TypeG));

            //});

            // //保养详情隐藏
            // $("body").delegate("#cby-edit-ledger-YINC","click",function(){
            //     $(".zzza").css("margin-right", "0px");
            //     $(".zzzb").hide();
            //     $(".zzzc").hide();
            //     $(".zzzc").width("0px");
            // })

        },





        run: function () {
            var wUser = window.parent._UserAll;
            // var wBusiness = window.parent._Business;
            var wFactory = window.parent._Factory;
            var wWorkShop = window.parent._WorkShop;
            var wLine = window.parent._Line;
            WDataItem = [];
            model.com.getDeviceMaintainItem({
                ModelID: -1, Name: "", DSType: 1, Active: -1,
                BusinessUnitID: 0, BaseID: 0, FactoryID: 0, WorkShopID: 0, LineID: 0
            }, function (res1) {

                WDataItem = res1.list;
                model.com.getDepartment({}, function (res2) {
                    wBusiness = res2.list;
                    $.each(res1.list, function (i, item) {

                        TypeSource_Device_Type.MaintainOptions.push({
                            name: item.Name,
                            value: item.ID,
                            far: item.ModelID
                        })
                    });
                    model.com.getDeviceModel({
                        DeviceWorkType: 0, SupplierID: 0, ModelPropertyID: 0, SystemID: 0,
                        SystemPropertyID: 0, ControllerID: 0, ControllerPropertyID: 0, Active: -1,
                        SupplierModelNo: "", SystemVersion: "", ControllerModel: ""
                    }, function (res2) {

                        $.each(res2.list, function (i, item) {

                            TypeSource_Device_Type.ModelID.push({
                                name: item.ModelNo,
                                value: item.ID,
                                far: null
                            })
                        });
                        $.each(res2.list, function (i, item) {

                            TypeSource_Device_Type_.ModelID.push({
                                name: item.ModelNo,
                                value: item.ID,
                                far: null
                            })
                        });
                        $.each(wUser, function (i, item) {
                            TypeSource_Device_Type.OperatorID.push({
                                name: item.Operator,
                                value: item.ID,
                                far: null
                            })
                        });
                        $.each(wUser, function (i, item) {
                            TypeSource_Device_Type.EditorID.push({
                                name: item.Name,
                                value: item.ID,
                                far: null
                            })
                        });
                        $.each(wBusiness, function (i, item) {
                            TypeSource_Device_Type.BusinessUnitID.push({
                                name: item.Name,
                                value: item.ID,
                                far: null
                            })
                        });
                        $.each(wWorkShop, function (i, item) {
                            TypeSource_Device_Type.WorkShopID.push({
                                name: item.Name,
                                value: item.ID,
                                far: item.BusinessUnitID,
                            })
                        });
                        $.each(wLine, function (i, item) {
                            TypeSource_Device_Type.LineID.push({
                                name: item.Name,
                                value: item.ID,
                                far: item.WorkShopID + "_" + item.BusinessUnitID,
                            })
                        });
                        $.each(wFactory, function (i, item) {
                            TypeSource_Device_Type.FactoryID.push({
                                name: item.Name,
                                value: item.ID,
                                far: null
                            })
                        });

                        model.com.refresh();
                        model.com.setItem();
                    });
                });
            });
        },

        com: {
            refresh: function () {
                model.com.getDeviceMaintainType({
                    ModelID: -1, Name: "", DSType: 1, Active: -1,
                    BusinessUnitID: 0, BaseID: 0, FactoryID: 0, WorkShopID: 0, LineID: 0
                }, function (resType) {
                    if (!resType)
                        return;
                    if (resType && resType.list) {
                        var Type = $com.util.Clone(resType.list);
                        BYType = $com.util.Clone(resType.list);
                        DATABasic_Type = $com.util.Clone(resType.list);

                        $.each(Type, function (i, item) {
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
                                if (!FORMATTRT_Device_Type[p])
                                    continue;
                                item[p] = FORMATTRT_Device_Type[p](item[p]);
                            }
                        });
                        DataAll_Type = $com.util.Clone(Type);
                        $("#femi-Device-tbody-Type").html($com.util.template(Type, HTML.TableNode_Type));
                        $("#femi-Device-tbody-Type tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });

                    }
                });
                window.parent.BY_Type = 1;
            },
            setItem: function () {
                setTimeout(function () {
                    if (window.parent.BY_Item == 1) {
                        model.com.getDeviceMaintainItem({
                            ModelID: -1, Name: "", DSType: 1, Active: -1,
                            BusinessUnitID: 0, BaseID: 0, FactoryID: 0, WorkShopID: 0, LineID: 0
                        }, function (res1) {

                            TypeSource_Device_Type.MaintainOptions.splice(1, TypeSource_Device_Type.MaintainOptions.length - 1);

                            $.each(res1.list, function (i, item) {

                                TypeSource_Device_Type.MaintainOptions.push({
                                    name: item.Name,
                                    value: item.ID,
                                    far: item.ModelID
                                })
                            });
                            window.parent.BY_Item = 0;
                        });
                    }
                    model.com.setItem();
                }, 500);
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
            //激活
            postActive: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceMaintainType/Active",
                    $TYPE: "post"
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

            //获取所有设备/备件保养模板列表
            getDeviceMaintainType: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceMaintainType/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },


            //添加或修改设备/备件保养模板
            postDeviceMaintainType: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceMaintainType/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //获取所有设备/备件保养项列表
            getDeviceMaintainItem: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceMaintainItem/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },


            //添加或修改设备/备件保养项
            postDeviceMaintainItem: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceMaintainItem/Update",
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