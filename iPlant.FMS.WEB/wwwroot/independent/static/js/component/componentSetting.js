require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/paging'], function ($zace, $com, $page) {

    var KEYWORD_Level_LIST,
        KEYWORD_Level,
        FORMATTRT_Level,
        DEFAULT_VALUE_Level,
        TypeSource_Level,

        KEYWORD_Level_LISTType,
        KEYWORD_LevelType,
        FORMATTRT_LevelType,
        DEFAULT_VALUE_LevelType,
        TypeSource_LevelType,
        wMaterialAll = [],
        supplierList,
        MaterialList,
        ProductID_Name = {},
        TypeName = {},
        mLineID,
        SupplierID,
        mProductID,
        wFPCProduct,
        model,
        mMateriaID = 0,
        mUnitID = 0,
        DataAll,
        DATABasic,
        DataAllConfirmBasic,
        DataAllConfirmChange,
        DataAllConfirm,
        DataAllSearch,
        DataAllFactorySearch,
        mFMCLine,
        mSettingprice,
        mCustomer,
        mTypeAll,
        ArrayList,
        HTML;
    DataAll = [];
    DATABasic = [];
    DataAllConfirmBasic = [];
    DataAllConfirmChange = [];
    DataAllConfirm = [];
    DataAllFactorySearch = DataAllSearch = [];

    PositionTemp = {
        ID: 0,
        Code: "",
        Name: "",
        LineID: 0,
        LineName: "",
        ProductNo: "",
        CustomerID: 0,
        CustomerName: "",
        MaterialID: 0,
        MaterialNo: "",
        MaterialName: "",
        UnitID: 0,
        UnitText: "",
        EditorID: 0,
        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Editor: "",
        Active: 0,
        SupplierList: [],
        PartTypeID: 0,
    };

    PositionTempType = {
        ID: 0,
        Code: "",
        Name: "",
        EditorID: 0,
        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Editor: "",
        Active: 0,
    };


    ;
    HTML = {
        TableMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td style="display:none" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
            '<td data-title="PartTypeID" data-value="{{PartTypeID}}" >{{PartTypeID}}</td>',
            '<td data-title="LineName" data-value="{{LineName}}" >{{LineName}}</td>',
            '<td data-title="ProductNo" data-value="{{ProductNo}}" >{{ProductNo}}</td>',
            '<td data-title="CustomerName" data-value="{{CustomerName}}" >{{CustomerName}}</td>',
            '<td data-title="MaterialNo" data-value="{{MaterialNo}}" >{{MaterialNo}}</td>',
            '<td data-title="MaterialName" data-value="{{MaterialName}}" >{{MaterialName}}</td>',
            '<td data-title="UnitText" data-value="{{UnitText}}" >{{UnitText}}</td>',
            '<td data-title="Editor" data-value="{{Editor}}" >{{Editor}}</td>',
            '<td data-title="EditTime" data-value="{{EditTime}}" >{{EditTime}}</td>',
            '<td data-title="Active" data-value="{{Active}}" >{{ActiveText}}</td>',
            '</tr>',
        ].join(""),
        TableModeType: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td style="display:none" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td data-title="Code" data-value="{{Code}}" >{{Code}}</td>',
            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
            '<td data-title="Editor" data-value="{{Editor}}" >{{Editor}}</td>',
            '<td data-title="EditTime" data-value="{{EditTime}}" >{{EditTime}}</td>',
            '<td data-title="Active" data-value="{{Active}}" >{{ActiveText}}</td>',
            '</tr>',
        ].join(""),

        TableSupplier: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td style="display:none" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td data-title="ItemName" data-value="{{ItemName}}" >{{ItemName}}</td>',
            '<td data-title="ItemText" data-value="{{ItemText}}" >{{ItemText}}</td>',
            '</tr>',
        ].join(""),

        TableBOMItemMode: [
            '<tr data-color="">',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  style ="display:none" data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td data-title="ProductQD" data-value="{{ProductQD}}" >{{ProductQD}}</td>',
            // '<td data-title="PlaceID" data-value="{{PlaceID}}" >{{PlaceID}}</td>',
            // '<td data-title="PlaceName" data-value="{{PlaceName}}" >{{PlaceName}}</td>',
            '<td data-title="PartPointName" data-value="{{PartPointName}}" >{{PartPointName}}</td>',
            '<td data-title="MaterialNo" data-value="{{MaterialNo}}">{{MaterialNo}}</td>',

            '<td data-title="MaterialName" data-value="{{MaterialID}}">{{MaterialName}}</td>',
            '<td data-title="UnitText" data-value="{{UnitID}}">{{UnitText}}</td>',

            //'<td data-title="DeviceNo" data-value="{{DeviceNo}}" >{{DeviceNo}}</td>',
            '<td data-title="BOMType" data-value="{{BOMType}}" >{{BOMType}}</td>',
            '<td data-title="MaterialNumber" data-value="{{MaterialNumber}}" >{{MaterialNumber}}</td>',
            '<td data-title="ReplaceType" data-value="{{ReplaceType}}" >{{ReplaceType}}</td>',
            '<td data-title="OutsourceType" data-value="{{OutsourceType}}" >{{OutsourceType}}</td>',
            '<td data-title="Remark" data-value="{{Remark}}" >{{Remark}}</td>',
            // '<td data-title="Active" data-value="{{Active}}" >{{Active}}</td>',

            '</tr>',
        ].join(""),

    },
        (function () {
            KEYWORD_Level_LIST = [
                "Code|编码",
                "Name|名称",
                "PartTypeID|类型|ArrayOne",
                "CodeID|类型|ArrayOne",
                "LineID|修程|ArrayOne",
                "ProductNo|车型|ArrayOne",
                "CustomerID|配属局段|ArrayOne",
                "MaterialNameReadonly|物料|Readonly",
                "UnitID|单位|ArrayOne",
                "EditTime|时间|DateTime",
                "Active|状态|ArrayOne",
            ];
            KEYWORD_Level = {};
            FORMATTRT_Level = {};

            DEFAULT_VALUE_Level = {
                Name: "",
                PartTypeID: 0,
                LineID: 0,
                ProductNo: "",
                CustomerID: 0,
                MaterialNameReadonly: "",
                // UnitID: 0,
            };

            TypeSource_Level = {
                PartTypeID: [],
                Active: [
                    {
                        name: "未启用",
                        value: 0
                    },
                    {
                        name: "启用",
                        value: 1
                    }, {
                        name: "禁用",
                        value: 2
                    }
                ],
                LineID: [
                    // {
                    //     name: "无",
                    //     value: 0
                    // },
                ],
                CustomerID: [
                    // {
                    //     name: "无",
                    //     value: 0
                    // },
                ],
                // MaterialID: [
                //     {
                //         name: "无",
                //         value: 0
                //     },
                // ],
                UnitID: [
                    {
                        name: "无",
                        value: 0
                    },
                ],
                ProductNo: [
                    // {
                    //     name: "无",
                    //     value: 0
                    // },
                ],

            };

            $.each(KEYWORD_Level_LIST, function (i, item) {
                var detail = item.split("|");
                KEYWORD_Level[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };
                if (detail.length > 2) {
                    FORMATTRT_Level[detail[0]] = $com.util.getFormatter(TypeSource_Level, detail[0], detail[2]);
                }
            });
        })();

    (function () {
        KEYWORD_Level_LISTType = [
            "Code|编码",
            "Name|名称",
            "EditTime|时间|DateTime",
            "Active|状态|ArrayOne",
        ];
        KEYWORD_LevelType = {};
        FORMATTRT_LevelType = {};

        DEFAULT_VALUE_LevelType = {
            Name: "",
            // Code: '',
        };

        TypeSource_LevelType = {
            Active: [
                {
                    name: "未启用",
                    value: 0
                },
                {
                    name: "启用",
                    value: 1
                }, {
                    name: "禁用",
                    value: 2
                }
            ],

        };

        $.each(KEYWORD_Level_LISTType, function (i, item) {
            var detail = item.split("|");
            KEYWORD_LevelType[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_LevelType[detail[0]] = $com.util.getFormatter(TypeSource_LevelType, detail[0], detail[2]);
            }
        });
    })();

    (function () {
        KEYWORD_Level_LISTSupplier = [
            "ItemName|供应商名称",
            "ItemText|供应商型号",
        ];
        KEYWORD_LevelSupplier = {};
        FORMATTRT_LevelSupplier = {};

        DEFAULT_VALUE_LevelSupplier = {
            ItemName: "",
            ItemText: "",
        };

        TypeSource_LevelSupplier = {

        };

        $.each(KEYWORD_Level_LISTSupplier, function (i, item) {
            var detail = item.split("|");
            KEYWORD_LevelSupplier[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_LevelSupplier[detail[0]] = $com.util.getFormatter(TypeSource_LevelSupplier, detail[0], detail[2]);
            }
        });
    })();

    (function () {
        KEYWORD_BOMItem_LIST = [
            "ProductQD|局段",
            "BOMType|类型|ArrayOne",
            "MaterialNumber|数量",
            "Remark|备注",
            "TypeID|类型|ArrayOne",
            // "MaterialUnit|用量:分子",
            // "MaterialUnitRatio|用量:分母",
            "ReplaceType|必换偶换|ArrayOne",
            "OutsourceType|必修偶修|ArrayOne",
            // "DeviceNo|设备号",
            // "ParentID|ParentID",
            // "GradeID|GradeID",

            "Active|状态|ArrayOne",
        ];
        KEYWORD_BOMItem = {};
        FORMATTRT_BOMItem = {};
        DEFAULT_VALUE_BOMItem = {

        };
        TypeSource_BOMItem = {
            ReplaceType: [
                {
                    name: "-",
                    value: 0
                },
                {
                    name: "必换",
                    value: 1
                }, {
                    name: "偶换",
                    value: 2
                }
            ],
            OutsourceType: [
                {
                    name: "-",
                    value: 0
                },
                {
                    name: "委外必修件",
                    value: 1
                }, {
                    name: "委外偶修件",
                    value: 2
                }

            ],
            Active: [{
                name: "禁用",
                value: 0
            }, {
                name: "激活",
                value: 1
            }],
            BOMType: [{
                name: "新造",
                value: 1
            }, {
                name: "检修",
                value: 2
            }],

            TypeID: [{
                name: "无",
                value: 0
            }],
        };

        $.each(KEYWORD_BOMItem_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD_BOMItem[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_BOMItem[detail[0]] = $com.util.getFormatter(TypeSource_BOMItem, detail[0], detail[2]);
            }
        });
    })();
    model = $com.Model.create({
        name: '部件清单',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            // $("input").click(function(e){
            //     　　$(this).select();
            //     });
            //     //阻止chrome自己的mouseup事件即可。
            //     $("input").mouseup(function(e){
            //         if(window.navigator.userAgent.indexOf("Chrome")!=-1){
            //             var event = e||window.event; 
            //             event.preventDefault(); 
            //         }
            //     });
            function extLimit(exts) {
                return {
                    has: function (file) {
                        var arr = file.split("."),
                            ext = arr[arr.length - 1].toLowerCase();

                        return exts.indexOf(ext) > -1 ? true : false;
                    }
                };
            }

            var UpdateType = function (ArrayTypeList, ArrayList, fn) {
                var TypeActiveList = [];
                var a = 0;
                if (ArrayTypeList.length <= 0) {
                    UpdateConfig(ArrayList, mFMCLine, mSettingprice, mCustomer);
                } else {
                    var WhileAddType = function () {
                        model.com.UpdateType({
                            data: ArrayTypeList[a],
                        }, function (res) {
                            a++;
                            if (res.info.ID) {
                                TypeActiveList.push(res.info);
                            }
                            if (a == ArrayTypeList.length) {
                                WhileActiveType(TypeActiveList, ArrayList);
                            } else {
                                WhileAddType();
                            }
                        });

                    }
                    var WhileActiveType = function (TypeActiveList, ArrayList) {
                        model.com.ActiveType({
                            data: TypeActiveList,
                            Active: 1,
                        }, function (res) {
                            UpdateConfig(ArrayList, mFMCLine, mSettingprice, mCustomer);
                            // if (b == TypeActiveList.length) {
                            //     // if (fn) {
                            //     //     fn();
                            //     // }
                            // } else {
                            //     WhileActiveType();
                            // }
                        });

                    }
                    WhileAddType();


                }
            }


            var UpdateConfig = function (ArrayList, wFMCLine, wSettingprice, wCustomer) {
                if (ArrayList.length <= 0) {
                    alert("导入数据为空！！！");
                }
                model.com.getTypeAll({}, function (resType) {
                    mTypeAll = resType.list;
                    model.com.getMaterialList({ material_no: "", material_name: "", type_id: 0, status: 0 }, function (resW) {
                        wMaterialList = resW.list;
                        var CodeBool = false, NameBool = false;
                        $.each(ArrayList, function (i, item) {
                            item.Active = 0;
                            // if (item.Active == "未启用") {
                            //     item.Active = 0;
                            // } else if (item.Active == "启用") {
                            //     item.Active = 1;
                            // } else if (item.Active == "禁用") {
                            //     item.Active = 2;
                            // }
                            for (var i = 0; i < wMaterialList.length; i++) {
                                if (item.MaterialNo == wMaterialList[i].MaterialNo) {
                                    item.MaterialID = wMaterialList[i].ID;
                                }
                            }
                            for (var i = 0; i < wFMCLine.length; i++) {
                                if (item.LineName == wFMCLine[i].Name) {
                                    item.LineID = wFMCLine[i].ID;
                                }
                            }
                            for (var i = 0; i < wSettingprice.length; i++) {
                                if (item.UnitText == wSettingprice[i].Name) {
                                    item.UnitID = wSettingprice[i].ID;
                                }
                            }
                            for (var i = 0; i < wCustomer.length; i++) {
                                if (item.CustomerName == wCustomer[i].CustomerName) {
                                    item.CustomerID = wCustomer[i].ID;
                                }
                            }

                            for (var i = 0; i < mTypeAll.length; i++) {
                                if (item.Code == mTypeAll[i].Code) {
                                    // item.Code = mTypeAll[i].Code;
                                    item.PartTypeID = mTypeAll[i].ID;
                                }
                            }
                            // item.Code = item.Code;
                            item.Name = item.Name;
                            // item.ProductNo = item.ProductNo;
                            item.ID = 0;
                            item.EditorID = 0;
                            item.Editor = "";
                            item.EditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date());
                            item.SupplierList = [];

                            if (item.Code == "") {
                                CodeBool = true;
                            }
                            if (item.Name == "") {
                                NameBool = true;
                            }
                        });

                        if (CodeBool) {
                            alert("部件编码不能为空！")
                            return false;
                        }

                        if (NameBool) {
                            alert("部件名称不能为空！")
                            return false;
                        }
                        var a = 0;
                        var WhileAdd = function () {
                            model.com.UpdateConfig({
                                data: ArrayList[a],
                            }, function (res) {
                                a++;
                                if (a == ArrayList.length) {
                                    $com.app.loaded();

                                    alert("导入成功");
                                    model.com.refresh();
                                } else {
                                    WhileAdd();
                                }
                            });

                        }
                        if (ArrayList.length <= 0) {
                            alert("导入数据为空！！！");
                        } else {
                            WhileAdd();
                        }
                    });
                });


            }

            $("body").delegate("#zace-import", "click", function () {
                $("#input-file").val("");
                $("#input-file").click();
            });

            $("body").delegate("#input-file", "input", function () {
                var $this = $(this);

                if (this.files.length == 0)
                    return;
                var fileData = this.files[0];

                var form = new FormData();
                form.append("file", fileData);
                $com.app.loading("数据导入中...");
                model.com.postImportExcel(form, function (res) {
                    if (!res)
                        return;
                    var postData = res.list,
                        rst = [];
                    if (!postData || postData.length <= 1) {

                        alert("导入数据不能为空!");
                        return;
                    }

                    // var DataParams = $com.table.postExportParams(postData, $(".table-part>table"));
                    var DataParams = $com.table.postExportParams(postData, $(".table-partList"));
                    var ArrayList = [];
                    for (var i = 1; i < DataParams.length; i++) {
                        ArrayList.push(DataParams[i]);
                    }
                    //剔除部件清单中已经存在的数据 部件清单所有数据（DATABasic）
                    // var submitList=[];
                    for (var i = 0; i < ArrayList.length; i++) {
                        for (var j = 0; j < DATABasic.length; j++) {
                            if (ArrayList[i].Name == DATABasic[j].Name && ArrayList[i].LineName == DATABasic[j].LineName && ArrayList[i].ProductNo == DATABasic[j].ProductNo) {
                                ArrayList.splice(i, 1);
                            }
                        }
                    }


                    CopyArrayList = $com.util.Clone(ArrayList);
                    //将导入数据与原始部件类型数据进行对比找到没有的部件类型，并新增

                    for (var i = 0; i < CopyArrayList.length; i++) {
                        for (var j = 0; j < wTypeAll.length; j++) {
                            if (CopyArrayList[i].Name == wTypeAll[j].Name) {
                                CopyArrayList.splice(i, 1);
                                if (CopyArrayList.length == 0) {
                                    break;
                                }
                            }
                        }
                    }

                    ArrayTypeList = [];
                    for (var i = 0; i < CopyArrayList.length; i++) {
                        ArrayTypeList.push({
                            ID: 0,
                            Code: CopyArrayList[i].Code,
                            Name: CopyArrayList[i].Name,
                            EditorID: 0,
                            EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                            Editor: "",
                            Active: 0,
                        });
                    }

                    UpdateType(ArrayTypeList, ArrayList, function () {
                        // UpdateConfig(ArrayList, mFMCLine, mSettingprice, mCustomer); 
                    });


                });

            });


            //部件清单导出
            $("body").delegate("#zace-export", "click", function () {
                var $table = $(".table-partList"),
                    fileName = "部件清单表.xls",
                    Title = "部件清单表";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });

            });
            //类型新增
            $("body").delegate("#zace-add-levelType", "click", function () {
                $("body").append($com.modal.show(DEFAULT_VALUE_LevelType, KEYWORD_LevelType, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    PositionTempType.Name = rst.Name;
                  

                    if (rst.Name == "") {
                        alert("请填写类型名称");
                        return false;
                    }
                    for (var m = 0; m < DATABasicType.length; m++) {
                        if (rst.Name == DATABasicType[m].Name) {
                            alert("部件名称重复！");
                            return false;
                        }
                    }
                    model.com.UpdateType({
                        data: PositionTempType,
                    }, function (res) {
                        alert("新增成功");
                        model.com.refreshType();
                    })

                }, TypeSource_LevelType));

            });

            //类型修改
            $("body").delegate("#zace-edit-levelType", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevelType-tbody"), "ID", DataAllType);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                var default_value = {
                    Name: SelectData[0].Name,
                    // Code:SelectData[0].Code,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_LevelType, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    // SelectData[0].Code = "MSS20200001";
                    SelectData[0].Name = rst.Name;
                    //  SelectData[0].Code = rst.Code;


                    for (var i = 0; i < SelectData.length; i++) {

                        $com.util.deleteLowerProperty(SelectData[i]);
                    }
                    model.com.UpdateType({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refreshType();


                    })

                }, TypeSource_LevelType));


            });
            //类型启用
            $("body").delegate("#zace-active-levelType", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevelType-tbody"), "ID", DataAllType);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {

                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                model.com.ActiveType({
                    data: SelectData,
                    Active: 1,
                }, function (res) {
                    alert("启用成功");
                    model.com.refreshType();
                })




            });
            //类型禁用
            $("body").delegate("#zace-disable-levelType", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevelType-tbody"), "ID", DataAllType);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {

                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                model.com.ActiveType({
                    data: SelectData,
                    Active: 2,
                }, function (res) {
                    alert("禁用成功");
                    model.com.refreshType();


                })

            });
            //类型删除
            $("body").delegate("#zace-edit-deleteType", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevelType-tbody"), "ID", DataAllType);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                if (SelectData[0].Active != 0) {
                    alert("请选择未启用数据！");
                    return false;
                }
                model.com.DeleteType({
                    data: SelectData[0],
                }, function (res) {
                    alert("删除成功");
                    model.com.refreshType();
                })
            });
            //查看部件类型
            $("body").delegate("#zace-refresh-eye", "click", function () {
                $(".zzza").hide();
                $(".zzzaType").show();
                $(".zzzaType").width("100%");
                $(".zzzaSupplier").hide();
                model.com.refreshType();
            });
            //查看部件类型
            // $("body").delegate("#femi-riskLevel-tbody tr", "dblclick", function () {
            //     $(".zzza").hide();
            //     $(".zzzaType").show();
            //     $(".zzzaType").width("100%");
            //     $(".zzzaSupplier").hide();
            //     model.com.refreshType();
            // });
            //返回
            $("body").delegate("#zace-back", "click", function () {
                $(".zzza").show();
                $(".zzzaType").hide();
                $(".zzza").width("100%");
                $(".zzzaSupplier").hide();
                model.com.refresh();
            });



            $("body").delegate("#zace-refresh-close", "click", function () {

                $(".zzzaType").css("width", "0px");
                $(".zzza").css("margin-right", "0px");
                $(".zzza").show();
                $(".zzzaType").hide();
                model.com.refresh();


            });


            $("body").delegate("#zace-refresh-po", "click", function () {

                model.com.refresh();


            });
            // 
            $("body").delegate("#zace-searchAll-level", "click", function () {
                var default_value = {
                    Active: 1,
                    //Position: 0,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.Active = eval(rst.Active.toLowerCase());
                    $com.table.filterByConndition($("#femi-riskLevel-tbody"), DataAll, default_value, "ID");

                }, TypeSource_Level));




            });
            //Enter触发模糊查询事件
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var value = $("#zace-search-level").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-riskLevel-tbody").children("tr").show();
                    else

                        $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "ID");
                }
            });
            //部件清单查询
            $("body").delegate("#zace-searchAll", "click", function () {
                var value = $("#zace-search-level").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else

                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "ID");
            });
            //部件清单新增
            $("body").delegate("#zace-add-level", "click", function () {
                $("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    PositionTemp.PartTypeID = Number(rst.PartTypeID);

                    PositionTemp.Name = rst.Name;

                    PositionTemp.LineID = Number(rst.LineID);
                    PositionTemp.Code =TypeObj[PositionTemp.PartTypeID].Code;
                    PositionTemp.CustomerID = Number(rst.CustomerID);
                    PositionTemp.MaterialID = mMateriaID;
                    PositionTemp.UnitID = mUnitID;

                    for (var j = 0; j < wFPCProduct.length; j++) {
                        if (wFPCProduct[j].ID == Number(rst.ProductNo)) {
                            PositionTemp.ProductNo = wFPCProduct[j].ProductName;
                        }
                    }

                    // if (rst.Name == "") {
                    //     alert("请填写部件名称！");
                    //     return false;
                    // }
                    // for (var m = 0; m < DATABasic.length; m++) {
                    //     if (rst.Name == DATABasic[m].Name) {
                    //         alert("部件名称重复！");
                    //         return false;
                    //     }
                    // }
                    model.com.UpdateConfig({
                        data: PositionTemp,
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                    })

                }, TypeSource_Level));

            });
            //查看供应商
            $("body").delegate("#femi-riskLevelType-tbody tr", "dblclick", function () {
                var SelectData = [];
                var $this = $(this);
                SupplierID = Number($this.find('td[data-title=ID]').attr('data-value'));
                // var colorName = $this.css("background-color");
                // $this.css("background-color", "Aqua");
                // $this.siblings().css("background-color", "");
                $(".zzza").hide();
                $(".zzzaType").show();
                $(".zzzaType").width("65%");
                $(".zzzaSupplier").show();
                $(".zzzaSupplier").width("35%");
                SelectData = supplierList.filter(p => p.ID == SupplierID);
                $("#suppliertitle").text("(" + SelectData[0].Name + ")" + "供应商");
                for (var i = 0; i < SelectData[0].SupplierList.length; i++) {
                    SelectData[0].SupplierList[i].WID = i + 1;
                }
                $("#femi-riskLevelSupplier-tbody").html($com.util.template(SelectData[0].SupplierList, HTML.TableSupplier));
            });
            //供应商
            $("body").delegate("#zace-supplier", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevelType-tbody"), "ID", DataAllType);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                SupplierID = SelectData[0].ID;

                $(".zzza").hide();
                $(".zzzaType").show();
                $(".zzzaType").width("65%");
                $(".zzzaSupplier").show();
                $(".zzzaSupplier").width("35%");

                $("#suppliertitle").text("(" + SelectData[0].Name + ")" + "供应商");
                for (var i = 0; i < SelectData[0].SupplierList.length; i++) {
                    SelectData[0].SupplierList[i].WID = i + 1;
                }
                $("#femi-riskLevelSupplier-tbody").html($com.util.template(SelectData[0].SupplierList, HTML.TableSupplier));
            });
            //供应商新增
            $("body").delegate("#zace-add-supplier", "click", function () {

                wSupplierArray = [];
                for (var i = 0; i < supplierList.length; i++) {
                    if (supplierList[i].ID == SupplierID) {
                        wSupplierArray.push(supplierList[i]);
                    }
                }

                $("body").append($com.modal.show(DEFAULT_VALUE_LevelSupplier, KEYWORD_LevelSupplier, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    TempSupplier = {
                        ID: 0,
                        ItemName: rst.ItemName,
                        ItemText: rst.ItemText,
                    }
                    wSupplierArray[0].SupplierList.push(TempSupplier);

                    for (j = 0; j < wSupplierArray[0].SupplierList.length; j++) {
                        wSupplierArray[0].SupplierList[j].ID = j + 1;
                    }

                    $com.util.deleteLowerProperty(wSupplierArray[0]);
                    model.com.UpdateType({
                        data: wSupplierArray[0],
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                        model.com.refreshType();
                        // model.com.getConfigAll({ PartConfigNo: "", PartConfigName: "", Active: -1, ProductNo: "", CustomerID: -1, LineID: -1 }, function (resP) {
                        //     supplierList = $com.util.Clone(resP.list);
                        wSupplierList = [];
                        for (var i = 0; i < supplierList.length; i++) {
                            if (supplierList[i].ID == SupplierID) {
                                wSupplierList.push(supplierList[i]);
                            }
                        }
                        for (j = 0; j < wSupplierList[0].SupplierList.length; j++) {
                            wSupplierList[0].SupplierList[j].WID = j + 1;
                        }

                        $("#femi-riskLevelSupplier-tbody").html($com.util.template(wSupplierList[0].SupplierList, HTML.TableSupplier));
                        // });
                    })

                }, TypeSource_LevelSupplier));

            });
            //供应商修改
            $("body").delegate("#zace-edit-supplier", "click", function () {
                wSupplierArrayEdit = [];
                for (var i = 0; i < supplierList.length; i++) {
                    if (supplierList[i].ID == SupplierID) {
                        wSupplierArrayEdit.push(supplierList[i]);
                    }
                }
                var SelectData = $com.table.getSelectionData($("#femi-riskLevelSupplier-tbody"), "ID", wSupplierArrayEdit[0].SupplierList);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                var default_valueSupplier = {
                    ItemName: SelectData[0].ItemName,
                    ItemText: SelectData[0].ItemText,
                };

                $("body").append($com.modal.show(default_valueSupplier, KEYWORD_LevelSupplier, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    for (var i = 0; i < wSupplierArrayEdit[0].SupplierList.length; i++) {
                        if (wSupplierArrayEdit[0].SupplierList[i].ID == SelectData[0].ID) {
                            wSupplierArrayEdit[0].SupplierList[i].ItemName = rst.ItemName;
                            wSupplierArrayEdit[0].SupplierList[i].ItemText = rst.ItemText;
                        }
                    }
                    $com.util.deleteLowerProperty(wSupplierArrayEdit[0]);
                    model.com.UpdateType({
                        data: wSupplierArrayEdit[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                        model.com.refreshType();
                        // model.com.getConfigAll({ PartConfigNo: "", PartConfigName: "", Active: -1, ProductNo: "", CustomerID: -1, LineID: -1 }, function (resP) {
                        //     supplierList = $com.util.Clone(resP.list);
                        wSupplierList = [];
                        for (var i = 0; i < supplierList.length; i++) {
                            if (supplierList[i].ID == SupplierID) {
                                wSupplierList.push(supplierList[i]);
                            }
                        }
                        for (j = 0; j < wSupplierList[0].SupplierList.length; j++) {
                            wSupplierList[0].SupplierList[j].WID = j + 1;
                        }

                        $("#femi-riskLevelSupplier-tbody").html($com.util.template(wSupplierList[0].SupplierList, HTML.TableSupplier));
                    });
                    // })
                }, TypeSource_LevelSupplier));
            });
            //供应商隐藏
            $("body").delegate("#zace-supplier-close", "click", function () {
                $(".zzza").hide();
                $(".zzzaType").show();
                $(".zzzaType").width("100%");
                $(".zzzaSupplier").hide();
                $(".zzzaSupplier").width("0%");
            });
            //供应商删除
            $("body").delegate("#zace-delete-supplier", "click", function () {
                wSupplierArraydelete = [];
                for (var i = 0; i < supplierList.length; i++) {
                    if (supplierList[i].ID == SupplierID) {
                        wSupplierArraydelete.push(supplierList[i]);
                    }
                }
                var SelectData = $com.table.getSelectionData($("#femi-riskLevelSupplier-tbody"), "ID", wSupplierArraydelete[0].SupplierList);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }

                wSupplierArraysubmit = [];
                for (var k = 0; k < wSupplierArraydelete[0].SupplierList.length; k++) {
                    for (m = 0; m < SelectData.length; m++) {
                        if (SelectData[m].ID == wSupplierArraydelete[0].SupplierList[k].ID) {
                            wSupplierArraysubmit.push(SelectData[m]);
                        }
                    }
                }
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {
                    return;
                }
                for (var i = 0; i < wSupplierArraydelete[0].SupplierList.length; i++) {
                    for (var j = 0; j < wSupplierArraysubmit.length; j++) {
                        if (wSupplierArraydelete[0].SupplierList[i].ID == wSupplierArraysubmit[j].ID) {
                            wSupplierArraydelete[0].SupplierList.splice(i, 1);
                        }
                    }

                }
                // console.log(wSupplierArraydelete[0].SupplierList);
                $com.util.deleteLowerProperty(wSupplierArraydelete[0]);
                model.com.UpdateType({
                    data: wSupplierArraydelete[0],
                }, function (res) {
                    alert("删除成功");
                    model.com.refresh();
                    model.com.refreshType();
                    // model.com.getConfigAll({ PartConfigNo: "", PartConfigName: "", Active: -1, ProductNo: "", CustomerID: -1, LineID: -1 }, function (resP) {
                    //     supplierList = $com.util.Clone(resP.list);
                    wSupplierList = [];
                    for (var i = 0; i < supplierList.length; i++) {
                        if (supplierList[i].ID == SupplierID) {
                            wSupplierList.push(supplierList[i]);
                        }
                    }
                    for (j = 0; j < wSupplierList[0].SupplierList.length; j++) {
                        wSupplierList[0].SupplierList[j].WID = j + 1;
                    }

                    $("#femi-riskLevelSupplier-tbody").html($com.util.template(wSupplierList[0].SupplierList, HTML.TableSupplier));
                    // });

                })
            });
            //部件清单修改
            $("body").delegate("#zace-edit-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                var default_value = {
                    Name: SelectData[0].Name,
                   // PartTypeID: SelectData[0].PartTypeID,
                    LineID: SelectData[0].LineID,
                    // ProductNo:ProductID_Name[SelectData[0].ProductNo].ID,
                    CustomerID: SelectData[0].CustomerID,
                    MaterialNameReadonly: SelectData[0].MaterialName,
                    // UnitID: SelectData[0].UnitID,
                };
                if (SelectData[0].ProductNo == "") {
                    default_value.ProductNo = 0;
                } else {
                    default_value.ProductNo = ProductID_Name[SelectData[0].ProductNo].ID;
                }
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    // MaterialList = wMaterialAll.filter(p => p.MaterialName == rst.MaterialName.trim());
                    // if (MaterialList.length == 0) {
                    //     alert("请正确填写物料名称！");
                    //     return false;
                    // }

                    // SelectData[0].PartTypeID = Number(rst.PartTypeID);
                    SelectData[0].Name = rst.Name; 
                    SelectData[0].LineID = Number(rst.LineID);
                    // SelectData[0].Code =TypeObj[SelectData[0].PartTypeID].Code;
                    SelectData[0].CustomerID = Number(rst.CustomerID);

                    SelectData[0].MaterialID = mMateriaID;
                    SelectData[0].UnitID = mUnitID;
                    // SelectData[0].UnitID = Number(rst.UnitID);
                    // for (var i = 0; i < wMaterialAll.length; i++) {
                    //     if (wMaterialAll[i].MaterialID = Number(rst.MaterialID)) {
                    //         SelectData[0].UnitID = wMaterialAll[i].UnitID;
                    //         SelectData[0].UnitText = wMaterialAll[i].UnitText;
                    //     }
                    // }
                    for (var j = 0; j < wFPCProduct.length; j++) {
                        if (wFPCProduct[j].ID == Number(rst.ProductNo)) {
                            SelectData[0].ProductNo = wFPCProduct[j].ProductName;
                        }
                    }
                    for (var i = 0; i < SelectData.length; i++) {

                        $com.util.deleteLowerProperty(SelectData[i]);
                    }
                    model.com.UpdateConfig({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                    })

                }, TypeSource_Level));


            });
            //部件清单启用
            $("body").delegate("#zace-active-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {

                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                model.com.ActiveConfig({
                    data: SelectData,
                    Active: 1,
                }, function (res) {
                    alert("启用成功");
                    model.com.refresh();
                })




            });
            //部件清单禁用
            $("body").delegate("#zace-disable-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {

                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                model.com.ActiveConfig({
                    data: SelectData,
                    Active: 2,
                }, function (res) {
                    alert("禁用成功");
                    model.com.refresh();


                })

            });
            //部件删除
            $("body").delegate("#zace-edit-delete", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                if (SelectData[0].Active != 0) {
                    alert("请选择未启用数据！");
                    return false;
                }

                model.com.DeleteConfig({
                    data: SelectData[0],
                }, function (res) {
                    alert("删除成功");
                    model.com.refresh();
                })
            });

            //事件监听
            // $("body").delegate(".modal .modal-dialog .modal-content .femi-modal-body .femi-modal-item", "change", function () {
            //     alert("111");
            //     var $this = $(this),
            //         value = $(this).val();
            //     if (value == undefined || value == "" || value.trim().length < 1)
            //         $("#femi-Device-tbody-Type").children("tr").show();
            //     else
            //         $com.table.filterByLikeString($("#femi-Device-tbody-Type"), DataAll_Type, value, "ID");
            // });
            //监听修程
            // $("body").delegate(".modal .femi-modal-body .femi-modal-item select#modal_select_LineID", "change", function (e) {
            //     var $this = $(this),
            //         name = $this.attr("data-name"),
            //         value = $this.val();
            //     mLineID = value;

            //     var $MaterialSelect = $("#modal_select_MaterialID");
            //     var $MaterialUL_DIV = $MaterialSelect.closest(".femi-modal-item").find(".dropdown-menu.open ul.dropdown-menu.inner.selectpicker ");
            //     var SELECT_OPTION_HTML = '<option value="{{value}}" >{{name}}</option>';
            //     var SELECT_LI_HTML = '<li rel="{{value}}"><a tabindex="0" class="" style=""><span class="text">{{name}}</span><i class="glyphicon glyphicon-ok icon-ok check-mark"></i></a></li>';

            //     model.com.getMaterialAll({
            //         bom_id: -1, PlaceID: -1, LineID: mLineID, ProductID: mProductID, PartPointID: -1, CustomerID: -1, BPMType: -1, ReplaceType: -1, OutsourceType: -1, IsList: -1
            //     }, function (resAll) {
            //         wMaterialAll = resAll.list;
            //         TypeSource_Level.MaterialID.splice(1, TypeSource_Level.MaterialID.length);

            //         $.each(wMaterialAll, function (i, item) {
            //             if (item.Active == 1) {
            //                 TypeSource_Level.MaterialID.push({
            //                     name: item.MaterialName,
            //                     value: item.MaterialID,
            //                     far: 0
            //                 });
            //             }

            //         });
            //         $MaterialSelect.html($com.util.template(TypeSource_Level.MaterialID, SELECT_OPTION_HTML));
            //         $MaterialUL_DIV.html($com.util.template(TypeSource_Level.MaterialID, SELECT_LI_HTML));
            //     });
            // });
            //监听车型
            // $("body").delegate(".modal .femi-modal-body .femi-modal-item select#modal_select_ProductNo", "change", function (e) {
            //     var $this = $(this),
            //         name = $this.attr("data-name"),
            //         value = $this.val();
            //     //将ProductNo转为ProductID调用boMItem接口 
            //     mProductID = value;

            //     var $MaterialSelect = $("#modal_select_MaterialID");
            //     var $MaterialUL_DIV = $MaterialSelect.closest(".femi-modal-item").find(".dropdown-menu.open ul.dropdown-menu.inner.selectpicker ");
            //     var SELECT_OPTION_HTML = '<option value="{{value}}" >{{name}}</option>';
            //     var SELECT_LI_HTML = '<li rel="{{value}}"><a tabindex="0" class="" style=""><span class="text">{{name}}</span><i class="glyphicon glyphicon-ok icon-ok check-mark"></i></a></li>';

            //     model.com.getMaterialAll({
            //         bom_id: -1, PlaceID: -1, LineID: mLineID, ProductID: mProductID, PartPointID: -1, CustomerID: -1, BPMType: -1, ReplaceType: -1, OutsourceType: -1, IsList: -1
            //     }, function (resAll) {
            //         wMaterialAll = resAll.list;
            //         TypeSource_Level.MaterialID.splice(1, TypeSource_Level.MaterialID.length);

            //         $.each(wMaterialAll, function (i, item) {
            //             if (item.Active == 1) {
            //                 TypeSource_Level.MaterialID.push({
            //                     name: item.MaterialName,
            //                     value: item.MaterialID,
            //                     far: 0
            //                 });
            //             }
            //         });
            //         $MaterialSelect.html($com.util.template(TypeSource_Level.MaterialID, SELECT_OPTION_HTML));
            //         $MaterialUL_DIV.html($com.util.template(TypeSource_Level.MaterialID, SELECT_LI_HTML));

            //     });
            // });
            //双击直接返回部件清单界面
            $("body").delegate("#femi-riskLevelMaterial-tbody tr", "dblclick", function () {
                // '<td data-title="MaterialName" data-value="{{MaterialName}}" data-MateriaID="{{MateriaID}}" >{{MaterialName}}</td>',
                // '<td data-title="UnitText" data-value="{{UnitID}}" >{{UnitText}}</td>',
                var $this = $(this);
                // mMateriaID = Number($this.find('td[data-title=MaterialName]').attr('data-MateriaID'));
                mUnitID = Number($this.find('td[data-title=UnitText]').attr('data-value'));
                mMateriaID = Number($this.find('td[data-title=MaterialName]').attr('data-value'));
                MaterialName = $this.find('td[data-title=MaterialName]').text();
                $(".modal .femi-modal-body .femi-modal-item input[data-name=MaterialNameReadonly]").val(MaterialName);
                $("#femi-riskLevelMaterial-tbody").html('<tr><td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></td><td colspan="15">等待数据加载</td></tr>');
                $(".zzzaMaterial").hide();

                $(".zzzaMaterial_self").show();
                $(".modal-backdrop").show();
                $(".modal.fade.in").show();

            });
            $("body").delegate("#zaceMaterial-back", "click", function () {
                $("#femi-riskLevelMaterial-tbody").html('<tr><td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></td><td colspan="15">等待数据加载</td></tr>');
                $(".zzzaMaterial").hide();
                $(".zzzaMaterial_self").show();
                $(".modal-backdrop").show();
                $(".modal.fade.in").show();
            });
            //Enter触发模糊查询事件
            // $(document).keyup(function (event) {
            //     $com.app.loading('数据加载中...');
            //     if (event.keyCode == 13) {
            //         var value = $("#zace-search-Material").val();
            //         if (value == undefined || value == "" || value.trim().length < 1){
            //             $("#femi-riskLevelMaterial-tbody").children("tr").show();
            //         }else{
            //             $com.table.filterByLikeString($("#femi-riskLevelMaterial-tbody"), wMaterialAll, value, "ID");
            //         }
            //         $com.app.loaded();
            //     }
            // });
            //物料查询
            $("body").delegate("#zace-searchAllMaterial", "click", function () {
                $com.app.loading('数据加载中...');
                var value = $("#zace-search-Material").val();
                if (value == undefined || value == "" || value.trim().length < 1) {
                    $("#femi-riskLevelMaterial-tbody").children("tr").show();
                } else {
                    $com.table.filterByLikeString($("#femi-riskLevelMaterial-tbody"), wMaterialAll, value, "ID");
                }
                $com.app.loaded();
            });
            $("body").delegate(".modal .femi-modal-body .femi-modal-item input[data-name=MaterialNameReadonly]", "click", function () {
                $this = $(this);
                var value = $this.val().trim();

                var LineID = Number($(".modal .femi-modal-body .femi-modal-item select#modal_select_LineID").val()) == 0 ? -1 : Number($(".modal .femi-modal-body .femi-modal-item select#modal_select_LineID").val());
                var ProductID = Number($(".modal .femi-modal-body .femi-modal-item select#modal_select_ProductNo").val()) == 0 ? -1 : Number($(".modal .femi-modal-body .femi-modal-item select#modal_select_ProductNo").val());
                var CustomerID = Number($(".modal .femi-modal-body .femi-modal-item select#modal_select_CustomerID").val()) == 0 ? -1 : Number($(".modal .femi-modal-body .femi-modal-item select#modal_select_CustomerID").val());
                if (LineID == -1) {
                    alert("修程必填!");
                    return false;
                }
                if (ProductID == -1) {
                    alert("车型必填!");
                    return false;
                }
                if (CustomerID == -1) {
                    alert("配属局段必填!");
                    return false;
                }
                $(".zzzaMaterial").show();
                $(".zzzaMaterial_self").hide();
                $(".modal-backdrop").hide();
                $(".modal.fade.in").hide();



                $com.app.loading('数据加载中...');
                // $("div.femi-modal").attr("background-color","black");
                model.com.getMaterialAll({
                    bom_id: -1, PlaceID: -1, LineID: LineID, ProductID: ProductID, PartPointID: -1, CustomerID: CustomerID, BOMType: -1, ReplaceType: -1, OutsourceType: -1, IsList: -1
                }, function (resAll) {
                    // model.com.loadingCopy('数据加载中...');

                    wMaterialAll = resAll.list.filter(p => p.Active == 1);
                    BOMItem = $com.util.Clone(resAll.list);
                    $.each(BOMItem, function (i, item) {
                        item.WID = i + 1;
                        for (var p in item) {
                            if (!FORMATTRT_BOMItem[p])
                                continue;
                            item[p] = FORMATTRT_BOMItem[p](item[p]);
                        }
                    });
                    $("#femi-riskLevelMaterial-tbody").html($com.util.template(BOMItem, HTML.TableBOMItemMode));
                    // model.com.loadedCopy();
                    $com.app.loaded();
                });


                // MaterialList = wMaterialAll.filter(p => p.MaterialName == value);
                // if (MaterialList.length == 0) {
                //     alert("请正确填写物料名称！");
                //     return false;
                // }
            });
        },




        run: function () {
            $com.app.loading('数据加载中...');
            // model.com.getMaterialAll({
            //     bom_id: -1, PlaceID: -1, LineID: -1, ProductID: -1, PartPointID: -1, CustomerID: -1, BPMType: -1, ReplaceType: -1, OutsourceType: -1, IsList: -1
            // }, function (res) {
            //     wMaterialAll = res.list;
            // });
            //获取物料
            // model.com.getMaterialList({ material_no: "", material_name: "", type_id: 0, status: 0 }, function (resW) {
            //     //TypeSource_materialRecord.SupplierID.splice(1, TypeSource_materialRecord.SupplierID.length - 1);
            //     $.each(resW.list, function (i, item) {
            //         TypeSource_Level.MaterialID.push({
            //             name: item.MaterialNo,
            //             value: item.ID,
            //             far: 0
            //         })
            //     });
            //获取修程
            model.com.getFMCLine({ FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0 }, function (resL) {
                //TypeSource_Level.AuditorID.splice(1, TypeSource_Level.AuditorID.length - 1);
                mFMCLine = resL.list;
                $.each(resL.list, function (i, item) {
                    TypeSource_Level.LineID.push({
                        name: item.Name,
                        value: item.ID,
                        far: 0
                    });
                });
                mLineID = TypeSource_Level.LineID[0].value;
                //单位列表
                model.com.getMeteringSettingprice({}, function (resPrice) {
                    mSettingprice = resPrice.list;
                    $.each(resPrice.list, function (i, item) {
                        TypeSource_Level.UnitID.push({
                            name: item.Name,
                            value: item.ID,
                            far: 0
                        })
                    });
                    //局段列表
                    model.com.getCustomer({ active: 2 }, function (resC) {
                        mCustomer = resC.list;
                        $.each(resC.list, function (i, item) {
                            TypeSource_Level.CustomerID.push({
                                name: item.CustomerName,
                                value: item.ID,
                                far: 0
                            })
                        });
                        //查询车型 ProductNo
                        model.com.getFPCProduct({ ProductTypeID: 0, BusinessUnitID: 0 }, function (resP) {
                            wFPCProduct = $com.util.Clone(resP.list);
                            $.each(resP.list, function (i, item) {
                                if (item.Active == 1 && item.TransportType == 1) {
                                    ProductID_Name[item.ProductNo] = item;
                                    TypeSource_Level.ProductNo.push({
                                        name: item.ProductNo,
                                        value: item.ID,
                                        far: 0
                                    })
                                }
                            });
                            mProductID = TypeSource_Level.ProductNo[0].value;
                            model.com.getTypeAll({}, function (resP) {
                                wTypeAll = resP.list;
                                TypeObj = {};
                                TypeSource_Level.PartTypeID = [];
                                $.each(resP.list, function (i, item) {
                                    TypeObj[item.ID] = item;
                                    TypeName[item.Code] = item;
                                    if (item.Active == 1) {
                                        TypeSource_Level.PartTypeID.push({
                                            name: item.Name + '【' + item.Code + '】',
                                            value: item.ID,
                                            far: 0
                                        })
                                    }

                                });
                                // model.com.getMaterialAll({
                                //     bom_id: -1, PlaceID: -1, LineID: -1, ProductID: -1, PartPointID: -1, CustomerID: -1, BOMType: -1, ReplaceType: -1, OutsourceType: -1, IsList: -1
                                // }, function (resAll) {
                                //     wMaterialAll = resAll.list;
                                // TypeSource_Level.MaterialID.splice(1, TypeSource_Level.MaterialID.length);
                                // $.each(wMaterialAll, function (i, item) {
                                //     if (item.Active == 1) {
                                //         TypeSource_Level.MaterialID.push({
                                //             name: item.MaterialName,
                                //             value: item.MaterialID,
                                //         });
                                //     }
                                // });
                                model.com.refresh();
                            });

                        });
                    });

                });
            });

            // });

            // });






        },

        com: {
            refresh: function () {
                $com.app.loading('数据加载中...');
                model.com.getConfigAll({ PartConfigNo: "", PartConfigName: "", Active: -1, ProductNo: "", CustomerID: -1, LineID: -1 }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {

                        var Grade = $com.util.Clone(resP.list);
                        DATABasic = $com.util.Clone(resP.list);

                        //审核数据
                        DataAllConfirm = $com.util.Clone(resP.list);

                        DataAll = $com.util.Clone(Grade);
                        for (var i = 0; i < Grade.length; i++) {
                            Grade[i].WID = i + 1;
                        }
                        $.each(Grade, function (i, item) {
                            if (item.Active == 0) {
                                item.ActiveText = "未启用";
                            } else if (item.Active == 1) {
                                item.ActiveText = "启用";
                            } else if (item.Active == 2) {
                                item.ActiveText = "禁用";
                            }
                            if (item.UnitID == 0) {
                                item.UnitText = "";
                            }
                            //   item.EditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.EditTime);

                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                if (p == 'ProductNo')
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }

                        });
                        DataAllFactorySearch = $com.util.Clone(Grade);
                        $("#femi-riskLevel-tbody").html($com.util.template(Grade, HTML.TableMode));
                        $com.app.loaded();
                        // $page.getPage(Grade, "#femi-riskLevel-tbody", HTML.TableMode, ".table-part");
                    }

                });
            },

            refreshType: function () {
                $com.app.loading('数据加载中...');
                model.com.getTypeAll({}, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        supplierList = $com.util.Clone(resP.list);
                        TypeSource_Level.PartTypeID = [];
                        TypeObj = {};
                        $.each(resP.list, function (i, item) {
                            TypeObj[item.ID] = item;
                            if (item.Active == 1) {
                              
                                TypeSource_Level.PartTypeID.push({
                                    name: item.Name + '【' + item.Code + '】',
                                    value: item.ID,
                                    far: 0
                                })
                            }
                        });

                        var Grade = $com.util.Clone(resP.list);
                        DATABasicType = $com.util.Clone(resP.list);

                        //审核数据
                        DataAllConfirmType = $com.util.Clone(resP.list);

                        DataAllType = $com.util.Clone(Grade);
                        for (var i = 0; i < Grade.length; i++) {
                            Grade[i].WID = i + 1;
                        }
                        $.each(Grade, function (i, item) {
                            if (item.Active == 0) {
                                item.ActiveText = "未启用";
                            } else if (item.Active == 1) {
                                item.ActiveText = "启用";
                            } else if (item.Active == 2) {
                                item.ActiveText = "禁用";
                            }


                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                if (p == 'ProductNo')
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }
                        });
                        DataAllFactorySearchType = $com.util.Clone(Grade);
                        $("#femi-riskLevelType-tbody").html($com.util.template(Grade, HTML.TableModeType));
                        $com.app.loaded();
                        // $page.getPage(Grade, "#femi-riskLevel-tbody", HTML.TableMode, ".table-part");
                    }

                });
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
                            if (_source[i].MaterialNo == set_data[j].MaterialNo) {
                                _source.splice(i, 1);
                                set_data.splice(j, 1)
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
                            if (set_data[i].MaterialNo == _source[j].MaterialNo) {
                                set_data.splice(i, 1);
                                _source.splice(j, 1)
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

                $com.app.ajax_load(data ? $.extend(data, d) : $.extend(d, data), fn, err, context);
            },
            //新增类型
            UpdateType: function (data, fn, context) {
                var d = {
                    $URI: "/MSSPart/UpdateType",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //删除类型
            DeleteType: function (data, fn, context) {
                var d = {
                    $URI: "/MSSPart/DeleteType",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //启用类型
            ActiveType: function (data, fn, context) {
                var d = {
                    $URI: "/MSSPart/ActiveType",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询部件类型
            getTypeAll: function (data, fn, context) {
                var d = {
                    $URI: "/MSSPart/TypeAll",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },


            //查询部件清单
            getConfigAll: function (data, fn, context) {
                var d = {
                    $URI: "/MSSPart/ConfigAll",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询部件清单中单条
            getConfigInfo: function (data, fn, context) {
                var d = {
                    $URI: "/MSSPart/ConfigInfo",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //新增部件清单
            UpdateConfig: function (data, fn, context) {
                var d = {
                    $URI: "/MSSPart/UpdateConfig",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //删除部件清单
            DeleteConfig: function (data, fn, context) {
                var d = {
                    $URI: "/MSSPart/DeleteConfig",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //启用
            ActiveConfig: function (data, fn, context) {
                var d = {
                    $URI: "/MSSPart/ActiveConfig",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询修程
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
            //局段列表
            getCustomer: function (data, fn, context) {
                var d = {
                    $URI: "/Customer/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取物料号列表
            getMaterialAll: function (data, fn, context) {
                var d = {
                    $URI: "/BomItem/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //条件筛选物料
            getMaterialList: function (data, fn, context) {
                var d = {
                    $URI: "/Material/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //单位列表
            getMeteringSettingprice: function (data, fn, context) {
                var d = {
                    $URI: "/Unit/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //车型查询
            getFPCProduct: function (data, fn, context) {
                var d = {
                    $URI: "/FPCProduct/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            loadingCopy: function (content) {

                var _html = [
                    '<div  class="femi-modalCopy femi-loading"  >',
                    '<div></div>',
                    '<p>{{content}}</p>',
                    '</div>',
                    '<div class="femi-modalCopy-backdrop in femi-loading"  ></div>'
                ].join('');

                if ($('.femi-loading').length > 0) {
                    $('.femi-loading').remove();
                }
                $('body').append($com.util.template({
                    content: content || 'loading...'
                }, _html));

            },

            loadedCopy: function () {
                if ($('.femi-loading').length > 0) {
                    $('.femi-loading').remove();
                }
            },

        }
    }),

        model.init();


});