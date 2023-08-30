require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {
    var
    KEYWORD_Device_LIST_Type,
    KEYWORD_Device_Type,
    FORMATTRT_Device_Type,
    DEFAULT_VALUE_Device_Type,
    TypeSource_Device_Type,

    KEYWORD_Device_LIST_Type_,
    KEYWORD_Device_Type_,
    FORMATTRT_Device_Type_,
    DEFAULT_VALUE_Device_Type_,
    TypeSource_Device_Type_,

    DJType,
    dataitem,
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
               '<td style="min-width: 50px" data-title="BusinessUnitID" data-value="{{BusinessUnitID}}">{{BusinessUnitID}}</td>',
               //'<td style="min-width: 50px" data-title="WorkShopID" data-value="{{WorkShopID}}">{{WorkShopID}}</td>',
               '<td style="min-width: 50px" data-title="LineID" data-value="{{LineID}}">{{LineID}}</td>',
               '<td style="min-width: 50px" data-title="ModelID" data-value="{{ModelID}}">{{ModelID}}</td>',
               //'<td style="min-width: 50px" data-title="ConfigType" data-value="{{ConfigType}}">{{ConfigType}}</td>',
               '<td style="min-width: 50px" data-title="AgainInterval" data-value="{{AgainInterval}}">{{AgainInterval}}</td>',
               '<td style="min-width: 50px" data-title="CheckOptions" data-value="{{CheckOptions}}">{{CheckOptions}}</td>',
               '<td style="min-width: 50px" data-title="Comment" data-value="{{Comment}}">{{Comment}}</td>',
               //'<td style="min-width: 50px" data-title="Times" data-value="{{Times}}">{{Times}}</td>',
               '<td style="min-width: 50px" data-title="ResultRatio" data-value="{{ResultRatio}}">{{ResultRatio}}</td>',
               '<td style="min-width: 50px" data-title="OperatorID" data-value="{{OperatorID}}">{{OperatorID}}</td>',
               '<td style="min-width: 50px" data-title="OperatorTime" data-value="{{OperatorTime}}">{{OperatorTime}}</td>',
              '<td style="min-width: 50px" data-title="EditorID" data-value="{{EditorID}}">{{EditorID}}</td>',
           '<td style="min-width: 50px" data-title="EditTime" data-value="{{EditTime}}">{{EditTime}}</td>',
           '<td style="min-width: 50px" data-title="Active" data-value="{{Active}}">{{Active}}</td>',
    //      '<td style="min-width: 50px" data-title="DSType" data-value="{{DSType}}">{{DSType}}</td>',
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

    $(function () {
        KEYWORD_Device_LIST_TypeG = [
         "ID|编号",
         "Name|名称",
         "ModelID|车间",
         "AgainInterval|间隔时间",
         "CheckOptions|可选项",
         "Comment|备注",
         "Times|巡检次数",
         "OperatorID|操作员",
         "OperatorTime|录入时间",
         "Active|状态",
         "EditTime|编辑时间",
         "EditorID|编辑人",
//       "DSType|DSType"
        ];
        KEYWORD_Device_TypeG = {};
        FORMATTRT_Device_TypeG = {};

        TypeSource_Device_TypeG = {

        };

        $.each(KEYWORD_Device_LIST_TypeG, function (x, item) {
            var detail = item.split("|");
            KEYWORD_Device_TypeG[detail[0]] = {
                index: x,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_Device_TypeG[detail[0]] = $com.util.getFormatter(TypeSource_Device_TypeG, detail[0], detail[2]);
            }
        });
    });


    $(function () {
        KEYWORD_Device_LIST_Type = [
         "ID|编号",
         "Name|名称",
          "BusinessUnitID|事业部|ArrayOne",
          "WorkShopID|车间|ArrayOne",
          "LineID|产线|ArrayOne",
          "ModelID|车间|ArrayOneControl",
        // "ConfigType|类型|ArrayOne",
         "AgainInterval|间隔时间",
         "CheckOptions|可选项|ArrayControl|ModelID",
         "Comment|备注",
         "ResultRatio|合格比率",
         "OperatorID|操作员|ArrayOne",
         "OperatorTime|录入时间|DateTime",
         "Active|状态|ArrayOne",
         "EditTime|编辑时间|DateTime",
         "EditorID|编辑人|ArrayOne",
        ];
        KEYWORD_Device_Type = {};
        FORMATTRT_Device_Type = {};
        DEFAULT_VALUE_Device_Type = {
            Name: "",
            BusinessUnitID: 0,
           // WorkShopID: 0,
            LineID: 0,
            ConfigType: 2,
            ModelID: 0,
            CheckOptions: [],
            Comment: "",
            Active: 0,
            AgainInterval: 0,
            ResultRatio: 0,
        };

        TypeSource_Device_Type = {
            BusinessUnitID: [],
            WorkShopID: [],
            LineID: [],
            CheckOptions: [{
                name: "无",
                value: 0,
                far:0
            }],
            Active: [{
                name: "激活",
                value: 1
            }, {
                name: "禁用",
                value: 0
            }],
            ModelID: [{
                name: "无",
                value: 0,
                far:0
            }],
            EditorID: [{
                name: "无",
                value: 0
            }],
            OperatorID: [{
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
         "ModelID|车间|ArrayOne",
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
            ModelID: [],
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
        name: '设备点检',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {

            //设备点检(点检类型表)模糊查询
            $("body").delegate("#zace-search-Device-Type", "change", function () {

                var $this = $(this),
                   value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-Device-tbody-Type").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-Device-tbody-Type"), DataAll_Type, value, "ID");
            });

            //设备点检新增(点检类型)
            $("body").delegate("#zace-add-Device-Type", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_Device_Type, KEYWORD_Device_Type, "新增", function (rst) {
                    //调用插入函数 

                    if (!rst || $.isEmptyObject(rst))
                        return;

                    TypeTemp = {
                        ID: 0,
                        BaseID: 0,
                        FactoryID: 1,
                        Name: rst.Name,
                        BusinessUnitID: Number(rst.BusinessUnitID),
                        WorkShopID: Number(rst.ModelID),
                        LineID: Number(rst.LineID),
                        ConfigType:3,
                        ModelID: Number(rst.ModelID),
                        AgainInterval: Number(rst.AgainInterval),
                        CheckOptions: [],
                        ResultRatio: Number(rst.ResultRatio),
                        Comment: rst.Comment,
                        Times: 0,
                        OperatorID: 0,
                        OperatorTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                        Active: Number(rst.Active),
                        EditorID: 0,
                        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                    };
                    TypeTemp.CheckOptions = [];
                    for (var i = 0; i < rst.CheckOptions.length; i++) {
                        TypeTemp.CheckOptions.push(Number(rst.CheckOptions[i]));
                    }
                    for (var i = 0; i < DJType.length; i++) {
                        if (DJType[i].Name == rst.Name && DJType[i].ModelID == Number(rst.ModelID)) {
                            alert("点检类型重复！");
                            return false;
                        }
                    }


                    model.com.postDevicePointCheckType({
                        data: TypeTemp

                    }, function (res) {
                        model.com.refresh();
                        alert("新增成功");

                    })

                }, TypeSource_Device_Type));


            });

            //设备点检修改(类型表)
            $("body").delegate("#zace-edit-Device-Type", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-Type"), "ID", DATABasic_Type);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                var default_valueThree = {
                    BusinessUnitID: SelectData[0].BusinessUnitID,
                    //WorkShopID: SelectData[0].WorkShopID,
                    LineID: SelectData[0].LineID,
                    //ConfigType: SelectData[0].ConfigType,
                    Comment: SelectData[0].Comment,
                    Active: SelectData[0].Active,
                    AgainInterval: SelectData[0].AgainInterval,
                    Name: SelectData[0].Name,
                    ModelID: SelectData[0].ModelID,
                    CheckOptions: SelectData[0].CheckOptions,
                };
                $("body").append($com.modal.show(default_valueThree, KEYWORD_Device_Type, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].BusinessUnitID = Number(rst.BusinessUnitID),
                    SelectData[0].WorkShopID = Number(rst.ModelID),
                    SelectData[0].LineID = Number(rst.LineID),
                    // SelectData[0].ConfigType= Number(rst.ConfigType),
                    SelectData[0].Comment = rst.Comment;
                    SelectData[0].Active = rst.Active;
                    SelectData[0].AgainInterval = rst.AgainInterval;
                    SelectData[0].Name = rst.Name;
                    SelectData[0].ModelID = Number(rst.ModelID);

                    SelectData[0].CheckOptions = [];
                    for (var i = 0; i < rst.CheckOptions.length; i++) {
                        SelectData[0].CheckOptions.push(Number(rst.CheckOptions[i]));
                    }
                    var _list = [];
                    for (var i = 0; i < DJType.length; i++) {
                        if (SelectData[0].ID != DJType[i].ID) {
                            _list.push(DJType[i]);
                        }
                    }
                    for (var i = 0; i < _list.length; i++) {
                        if (_list[i].Name == rst.Name && _list[i].ModelID == Number(rst.ModelID)) {
                            alert("点检类型重复！");
                            return false;
                        }
                    }

                    model.com.postDevicePointCheckType({
                        data: SelectData[0]
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                    })

                }, TypeSource_Device_Type));


            });

            //设备点检激活(类型表)
            $("body").delegate("#zace-active-Device-Type", "click", function () {

                // var SelectData = $('.tb_users').bootstrapTable('getSelections');
                var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-Type"), "ID", DATABasic_Type);

                if (!SelectData || !SelectData.length) {
                    alert("至少选择一行数据！")
                    return;
                }
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其激活？")) {
                    return;
                }
                model.com.postActive({
                    data: SelectData,
                    Active: 1
                }, function (res) {
                    alert("激活成功");
                    model.com.refresh();
                })
            });

            //设备点检禁用(类型表)           
            $("body").delegate("#zace-remove-Device-Type", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-Type"), "ID", DATABasic_Type);

                if (!SelectData || !SelectData.length) {
                    alert("至少选择一行数据！")
                    return;
                }
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其禁用？")) {
                    return;
                }
                model.com.postActive({
                    data: SelectData,
                    Active: 0
                }, function (res) {
                    alert("禁用成功");
                    model.com.refresh();
                })
            });

            //设备点检导出(类型表)
            $("body").delegate("#zace-export-Device-Type", "click", function () {
                var $table = $(".table-part"),
                     fileName = "设备点检类型表.xls",
                     Title = "设备点检类型表";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });

            });

            //查看点检项
            $("body").delegate("#zace-type-search-Type", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-Type"), "ID", DATABasic_Type);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能查看一行数据详情！")
                    return;
                }
                var list = SelectData[0].CheckOptions;
                var listItem = [];

                for (var i = 0; i < list.length; i++) {
                    for (var j = 0; j < dataitem.length; j++) {
                        if (list[i] == dataitem[j].ID) {
                            listItem.push(dataitem[j]);
                        }
                    }
                }

                var _listZ = $com.util.Clone(listItem);
                $.each(_listZ, function (i, item) {
                    for (var p in item) {
                        if (!FORMATTRT_Device_Type_[p])
                            continue;
                        item[p] = FORMATTRT_Device_Type_[p](item[p]);
                    }
                });

                $("#femi-Device-tbody-Type_").html($com.util.template(_listZ, HTML.TableNode_Type_));
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



            //点检项隐藏
            $("body").delegate("#zace-edit-Device-TypeYC", "click", function () {
                $(".zzza").css("margin-right", "0px");
                $(".zzzb").hide();
                $(".zzzc").hide();
                $(".zzzb").width("0px");
            })
            //条件查询
            $("body").delegate("#zace-type-search-TypeZ", "click", function () {
                var default_value = {
                    LineID: 0,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Device_Type, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.LineID = Number(rst.LineID);
                    $com.table.filterByConndition($("#femi-Device-tbody-Type"), DATABasic_Type, default_value, "ID");

                }, TypeSource_Device_Type));


            });

        },





        run: function () {
            dataitem = [];
            var UserAllList = window.parent._UserAll;
            var LineAllList = window.parent._Line;
            var WorkShopAllList = window.parent._WorkShop;
            var BusinessAllList = window.parent._Business;

          

            model.com.getDevicePointCheckItem({ ModelID: -1, Name: "", Active: -1, StartTime: "2000-01-01", EndTime: "2000-01-01", ConfigType: 3, BusinessUnitID: -1, BaseID: -1, FactoryID: -1, WorkShopID: -1, LineID: -1 }, function (res1) {

                dataitem = res1.list;

                $.each(res1.list, function (i, item) {

                    TypeSource_Device_Type.CheckOptions.push({
                        name: item.Name,
                        value: item.ID,
                        far: item.ModelID
                    })                                 

                });
                $.each(LineAllList, function (i, item) {
                    TypeSource_Device_Type.LineID.push({
                        name: item.Name,
                        value: item.ID,
                        //  far:item.WorkShopID
                    });
                });

                $.each(UserAllList, function (i, item) {
                    TypeSource_Device_Type.OperatorID.push({
                        name: item.Operator,
                        value: item.ID,
                        far: null
                    })
                });
                TypeSource_Device_Type.EditorID = TypeSource_Device_Type.OperatorID;


                $.each(WorkShopAllList, function (i, item) {
                    TypeSource_Device_Type.WorkShopID.push({
                        name: item.Name,
                        value: item.ID,
                        far: 0
                    });
                });

                $.each(WorkShopAllList, function (i, item) {

                    TypeSource_Device_Type.ModelID.push({
                        name: item.Name,
                        value: item.ID,
                        far: null
                    })
                });
                TypeSource_Device_Type_.ModelID = TypeSource_Device_Type.ModelID;




                $.each(BusinessAllList, function (i, item) {
                    TypeSource_Device_Type.BusinessUnitID.push({
                        name: item.Name,
                        value: item.ID,
                    });
                });

                model.com.refresh();
            });



        },

        com: {
            refresh: function () {

                model.com.getDevicePointCheckType({
                    StationID: -1, Name: "", Active: -1,
                    StartTime: "2000-01-01", EndTime: "2000-01-01", ConfigType: 3,
                    BusinessUnitID: -1, BaseID: -1, FactoryID: -1, WorkShopID: -1, LineID: -1
                }, function (resType) {
                    if (!resType)
                        return;
                    if (resType && resType.list) {
                        var Type = $com.util.Clone(resType.list);
                        DJType = $com.util.Clone(resType.list);

                        DATABasic_Type = $com.util.Clone(resType.list);

                        $.each(Type, function (i, item) {
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
            },
            //查询事业部
            getBusinessUnit: function (data, fn, context) {
                var d = {
                    $URI: "/BusinessUnit/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询车间
            getFMCWorkShop: function (data, fn, context) {
                var d = {
                    $URI: "/FMCWorkShop/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //查询产线
            getFMCLine: function (data, fn, context) {
                var d = {
                    $URI: "/FMCLine/All",
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
                    $URI: "/DevicePointCheckType/Active",
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
            //获取所有用户信息
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

            //获取所有设备/备件点检类型列表
            getDevicePointCheckType: function (data, fn, context) {
                var d = {
                    $URI: "/DevicePointCheckType/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },


            //添加或修改设备/备件点检类型
            postDevicePointCheckType: function (data, fn, context) {
                var d = {
                    $URI: "/DevicePointCheckType/Update",
                    $TYPE: "post"
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