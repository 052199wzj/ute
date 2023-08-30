require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {
    var KEYWORD_Device_LIST_item,
        KEYWORD_Device_item,
        FORMATTRT_Device_item,
        DEFAULT_VALUE_Device_item,
        TypeSource_Device_item,

        KEYWORD_Device_LIST_itemG,
        KEYWORD_Device_itemG,
        FORMATTRT_Device_itemG,
        DEFAULT_VALUE_Device_itemG,
        TypeSource_Device_itemG,
        DJItem,
        mID,
        model,
        item,
        HTML;

    mID = 0;

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
            '<td style="min-width: 50px" data-title="SecondTime" data-value="{{SecondTime}}">{{SecondTime}}</td>',
            '<td style="min-width: 50px" data-title="CareItems" data-value="{{CareItems}}">{{CareItems}}</td>',
            '<td style="min-width: 50px" data-title="UnqualifiedOptions" data-value="{{UnqualifiedOptions}}">{{UnqualifiedOptions}}</td>',
            '<td style="min-width: 50px" data-title="Comment" data-value="{{Comment}}">{{Comment}}</td>',
            '<td style="min-width: 50px" data-title="OperatorTime" data-value="{{OperatorTime}}">{{OperatorTime}}</td>',
            '<td style="min-width: 50px" data-title="OperatorID" data-value="{{OperatorID}}">{{OperatorID}}</td>',
            '<td style="min-width: 50px" data-title="EditTime" data-value="{{EditTime}}">{{EditTime}}</td>',
            '<td style="min-width: 50px" data-title="EditorID" data-value="{{EditorID}}">{{EditorID}}</td>',
            //'<td style="min-width: 50px" data-title="BaseID" data-value="{{BaseID}}">{{BaseID}}</td>',
            '<td style="min-width: 50px" data-title="ConfigType " data-value="{{ConfigType}}">{{ConfigType}}</td>',
            '<td data-title="Active" data-value="{{Active}}"><span class="badge lmvt-badge {{ClassBadge}}">{{Badge}}</span>{{Active}}</td>',
            // '<td data-title="Active" data-value="{{Active}}" >{{Active}}</td>',
            '<td style="max-width: 80px" data-title="Handle" data-value="{{ID}}">',
            '<div class="row">',
            '<div class="col-md-6 {{ISAllowed}}">{{ISAllowedText}}</div>',
            '<div class="col-md-6 lmvt-do-info lmvt-reset">修改</div>',
            '</div></td>',
            '</tr>',
        ].join(""),
    }

    $(function () {
        KEYWORD_Device_LIST_item = [
            "ID|编号",
            "Name|名称",
            "FactoryID|工厂|ArrayOne",
            "BusinessUnitID|部门|ArrayOne",
            "WorkShopID|车间|ArrayOneControl",
            "LineID|产线|ArrayOneControl|WorkShopID",
            "ModelID|设备型号|ArrayOne",
            "CareItems|注意事项|InputArray",
            "UnqualifiedOptions|不合格选项|InputArray",
            "SecondTime|所需时间",
            "Comment|备注",
            "OperatorID|录入人|ArrayOne",
            "OperatorTime|录入时刻|DateTime",
            "EditTime|修改时刻|DateTime",
            "EditorID|修改人|ArrayOne",
            "Active|状态|ArrayOne",
            //"BaseID|基地",
            "ConfigType|类型|ArrayOne",

        ];
        KEYWORD_Device_item = {};
        FORMATTRT_Device_item = {};
        DEFAULT_VALUE_Device_item = {
            Name: "",
            ModelID: 0,
            UnqualifiedOptions: [],
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
            }],
            ConfigType: [{
                name: "设备",
                value: 1
            }, {
                name: "工位",
                value: 2
            }, {
                name: "生产",
                value: 3
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
    });

    $(function () {
        KEYWORD_Device_LIST_itemG = [
            "ID|编号|Readonly",
            "Name|名称|Readonly",
            "FactoryID|工厂|Readonly",
            "BusinessUnitID|部门|Readonly",
            "WorkShopID|车间|Readonly",
            "LineID|产线|Readonly",
            "ModelID|设备型号|Readonly",
            "CareItems|注意事项|InputArray",
            "UnqualifiedOptions|不合格选项|InputArray",
            "SecondTime|所需时间|Readonly",
            "Comment|备注|Readonly",
            "OperatorID|录入人|Readonly",
            "OperatorTime|录入时刻|Readonly",
            "EditTime|修改时刻|Readonly",
            "EditorID|修改人|Readonly",
            "Active|状态|Readonly",
            //"BaseID|基地|Readonly",
            "ConfigType|类型|Readonly",

        ];
        KEYWORD_Device_itemG = {};
        FORMATTRT_Device_itemG = {};
        DEFAULT_VALUE_Device_itemG = {
            Name: "",
            ModelID: 0,
            UnqualifiedOptions: [],
            CareItems: [],
            SecondTime: 0,
            Comment: "",
            Active: 0,
            BusinessUnitID: 0,
            WorkShopID: 0,
            LineID: 0,
        };

        TypeSource_Device_itemG = {
            ModelID: [],
            Active: [{
                name: "激活",
                value: 1
            }, {
                name: "禁用",
                value: 0
            }],
            OperatorID: [],
            EditorID: [],
            BusinessUnitID: [],
            WorkShopID: [],
            LineID: [],
            FactoryID: [],
        };


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
    model = $com.Model.create({
        name: '设备点检项',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {



            //设备点检(点检项)模糊查询
            $("body").delegate("#zace-search-Device-item", "change", function () {

                var $this = $(this),
                    value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-Device-tbody-item").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-Device-tbody-item"), DataAll, value, "ID");
            });

            //设备点检修改(项目表)
            $("body").delegate(".lmvt-reset", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DATABasic.filter((item) => { return item.ID == wID });
                var default_value = {
                    Name: SelectData[0].Name,
                    ModelID: SelectData[0].ModelID,
                    CareItems: SelectData[0].CareItems,
                    Comment: SelectData[0].Comment,
                    SecondTime: SelectData[0].SecondTime,
                    UnqualifiedOptions: SelectData[0].UnqualifiedOptions,
                    SecondTime: SelectData[0].SecondTime,
                    BusinessUnitID: SelectData[0].BusinessUnitID,
                    BaseID: SelectData[0].BaseID,
                    FactoryID: SelectData[0].FactoryID,
                    WorkShopID: SelectData[0].WorkShopID,
                    LineID: SelectData[0].LineID,
                    ConfigType: SelectData[0].ConfigType,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Device_item, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].Name = rst.Name;
                    SelectData[0].ModelID = rst.ModelID;
                    SelectData[0].CareItems = rst.CareItems;
                    SelectData[0].Comment = rst.Comment;
                    SelectData[0].SecondTime = rst.SecondTime;
                    SelectData[0].UnqualifiedOptions = rst.UnqualifiedOptions;
                    SelectData[0].BusinessUnitID = rst.BusinessUnitID;
                    SelectData[0].BaseID = rst.BaseID;
                    SelectData[0].FactoryID = rst.FactoryID;
                    SelectData[0].WorkShopID = rst.WorkShopID;
                    SelectData[0].LineID = rst.LineID;
                    SelectData[0].ConfigType = rst.ConfigType;
                    var _list = [];
                    for (var i = 0; i < DJItem.length; i++) {
                        if (SelectData[0].ID != DJItem[i].ID) {
                            _list.push(DJItem[i]);
                        }
                    }
                    for (var i = 0; i < _list.length; i++) {
                        if (_list[i].Name == rst.Name && _list[i].ModelID == Number(rst.ModelID)) {
                            alert("点检项出现重复！");
                            return false;
                        }
                    }

                    model.com.postDevicePointCheckItem({
                        data: SelectData[0]
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                    })

                }, TypeSource_Device_item));


            });

            //设备点检新增(项目表)
            $("body").delegate("#zace-add-Device-item", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_Device_item, KEYWORD_Device_item, "新增", function (rst) {
                    //调用插入函数 

                    if (!rst || $.isEmptyObject(rst))
                        return;

                    var ItemTemp = {
                        ID: 0,
                        Name: rst.Name,
                        ModelID: Number(rst.ModelID),
                        CareItems: rst.CareItems,
                        UnqualifiedOptions: rst.UnqualifiedOptions,
                        SecondTime: Number(rst.SecondTime),
                        Comment: rst.Comment,
                        OperatorTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                        OperatorID: 0,
                        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                        EditorID: 0,
                        Active: 1,
                        BusinessUnitID: Number(rst.BusinessUnitID),
                        FactoryID: 1,
                        WorkShopID: Number(rst.WorkShopID),
                        LineID: Number(rst.LineID),
                        ConfigType: 1,
                        BaseID: 0,

                    };
                    for (i = 0; i < DJItem.length; i++) {
                        if (DJItem[i].Name == rst.Name && DJItem[i].ModelID == Number(rst.ModelID)) {
                            alert("点检项出现重复！");
                            return false;
                        }
                    }
                    model.com.postDevicePointCheckItem({
                        data: ItemTemp
                    }, function (res) {
                        model.com.refresh();
                        alert("新增成功");

                    })

                }, TypeSource_Device_item));


            });


            //设备点检导出(项目表)
            $("body").delegate("#zace-export-Device-item", "click", function () {
                var $table = $(".table-part"),
                    fileName = "设备点检项目表.xls",
                    Title = "设备点检项目表";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });

            });

            //设备保养激活(项目表)
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

            //          //设备保养禁用(项目表)           
            $("body").delegate(".lmvt-allowed-delete", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));


                var SelectData = DATABasic.filter((item) => { return item.ID == wID });

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
                    CareItems: SelectData[0].CareItems,
                    UnqualifiedOptions: SelectData[0].UnqualifiedOptions,
                    //SecondTime: SelectData[0].SecondTime,
                    //Comment: SelectData[0].Comment,
                    //OperatorTime: SelectData[0].OperatorTime,
                    //OperatorID: SelectData[0].OperatorID,
                    //EditTime: SelectData[0].EditTime,
                    //EditorID: SelectData[0].EditorID,
                    //Active: SelectData[0].Active,
                    //BusinessUnitID: SelectData[0].BusinessUnitID,
                    //FactoryID: SelectData[0].FactoryID,
                    //WorkShopID: SelectData[0].WorkShopID,
                    //LineID: SelectData[0].LineID,
                    //ConfigType: SelectData[0].ConfigType,
                    //BaseID: SelectData[0].BaseID,
                };
                $("body").append($com.propertyGrid.show($(".Typetable-item"), default_value, KEYWORD_Device_itemG, TypeSource_Device_itemG));

            });
            //详情隐藏
            $("body").delegate("#cby-edit-yinc", "click", function () {
                $(".zzza").css("margin-right", "0px");
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
            model.com.getDepartment({}, function (res2) {
                wBusiness = res2.list;
                model.com.getDeviceModel({
                    DeviceWorkType: 0, SupplierID: 0, ModelPropertyID: 0, SystemID: 0,
                    SystemPropertyID: 0, ControllerID: 0, ControllerPropertyID: 0, Active: -1,
                    SupplierModelNo: "", SystemVersion: "", ControllerModel: ""
                }, function (res1) {
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

                //           ModelID:{int},Name:{String},DSType:{int}, Active:{int},StartTime:{DateTime},EndTime:{DateTime}
                model.com.getDevicePointCheckItem({
                    ModelID: -1,
                    Name: "",
                    Active: -1,
                    ConfigType: 1,
                    BusinessUnitID: -1,
                    BaseID: -1,
                    FactoryID: -1,
                    WorkShopID: -1,
                    LineID: -1
                }, function (resItem) {
                    if (!resItem)
                        return;
                    if (resItem && resItem.list) {
                        var Item = $com.util.Clone(resItem.list);
                        DJItem = $com.util.Clone(resItem.list);
                        DATABasic = $com.util.Clone(resItem.list);

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
                        //DataSH = $com.util.Clone(Item[0].LifeRatioList);
                        $("#femi-Device-tbody-item").html($com.util.template(Item, HTML.TableNode_item));
                        $("#femi-Device-tbody-item tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });

                        //if(mID>0){
                        //	var Dlist=[];
                        //for(var i=0;i<DATABasic.length;i++){
                        //	if(mID==DATABasic[i].ID)
                        //	{
                        //		Dlist.push(DATABasic[i]);
                        //		break;
                        //	}
                        //}
                        //$("#femi-Device-tbody-time").html($com.util.template(Dlist[0].LifeRatioList, HTML.TableNode_time));
                        //$("#femi-Device-tbody-time").html($com.util.template(Dlist[0].ValueRatioList, HTML.TableNode_time));
                        //$("#femi-Device-tbody-time").html($com.util.template(Dlist[0].ProcessingRatioList, HTML.TableNode_time));
                        //}

                    }

                });

                window.parent.DJ_Item = 1;

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
            //获取所有设备/备件点检项列表
            getDevicePointCheckItem: function (data, fn, context) {
                var d = {
                    $URI: "/DevicePointCheckItem/All",
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

            //添加或修改设备/备件点检项
            postDevicePointCheckItem: function (data, fn, context) {
                var d = {
                    $URI: "/DevicePointCheckItem/Update",
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
                    $URI: "/DeviceMaintainItem/Active",
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