require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($zace, $com) {

    var KEYWORD_MeteringSetting_LIST_Price,
        KEYWORD_MeteringSetting_LIST_Package,
        KEYWORD_MeteringSetting_LIST_group,

        KEYWORD_MeteringSetting_Price,
        KEYWORD_MeteringSetting_Package,
        KEYWORD_MeteringSetting_group,

        FORMATTRT_MeteringSetting_Price,
        FORMATTRT_MeteringSetting_Package,
        FORMATTRT_MeteringSetting_group,

        DEFAULT_VALUE_MeteringSetting_Price,
        DEFAULT_VALUE_MeteringSetting_Package,
        DEFAULT_VALUE_MeteringSetting_group,

        TypeSource_MeteringSetting_Price,
        TypeSource_MeteringSetting_Package,
        TypeSource_MeteringSetting_group,

        DATABasic_group,
        DataAll_group,
        mPackageID,
        PackageActive,
        materialNoAll,
        resPackageList,
        changeName,
        model,
        DataAll_Price,
        Price,
        DATABasic_Price,
        DataAll_Package,
        DATABasic_Package,
        DATAMeteringSettingBasic,
        mMeteringSettingID,
        HTML;
    CheckDataCode = [];
    groupTemp = {
        Name: "",
        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        ID: 0,
        OperatorID: 0,
        ERPUnitGroupID: 0,
        Active: 0,
        //          Operator:window.parent.User_Info.Name,
    };
    UnitTemp = {
        Name: "",
        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        ID: 0,
        OperatorID: 0,
        ERPUnitID: 0,
        Active: 0,
        GroupID: 0,
        Operator: window.parent.User_Info.Name,
    };
    PackageTemp = {
        ID: 0,
        Name: "",
        MaterialNo: "",
        OperatorID: 0,
        Operator: "",
        UnitText: "",
        FQTY: 0,
        Active: 0,
        ERPPackageID: 0,
        UnitID: 0,
        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
    };
    HTML = {
        //单位分组
        TableModegroup: [
            '<tr data-color="">',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="WID"  style="display:none"  data-value="{{WID}}" >{{WID}}</td>',
            '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',

            //'<td data-title="ERPUnitGroupID" data-value="{{ERPUnitGroupID}}" >{{ERPUnitGroupID}}</td>',
            // '<td data-title="Operator" data-value="{{Operator}}" >{{Operator}}</td>',
            '<td data-title="EditTime" data-value="{{EditTime}}" >{{EditTime}}</td>',
            //'<td data-title="Active" data-value="{{Active}}" >{{Active}}</td>',
            '</tr>',
        ].join(""),


        //单位管理
        TableMode: [
            '<tr data-color="">',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="WID"   data-value="{{WID}}" >{{WID}}</td>',
            '<td data-title="ID" style="min-width: 50px;display:none" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',

            // '<td data-title="ERPUnitID" data-value="{{ERPUnitID}}" >{{ERPUnitID}}</td>',
            // '<td data-title="GroupID" data-value="{{GroupID}}" >{{GroupID}}</td>',
            // '<td data-title="OperatorID" data-value="{{OperatorID}}" >{{OperatorID}}</td>',
            '<td data-title="EditTime" data-value="{{EditTime}}">{{EditTime}}</td>',
            '<td data-title="Active" data-value="{{Active}}"><span class="badge lmvt-badge {{ClassBadge}}">{{Badge}}</span>{{Active}}</td>',
            '</tr>',
        ].join(""),
        TableModeOne: [
            //包装配置
            '<tr data-color="">',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" data-title="femi-tb-checkbox"/></td>',
            '<td data-title="WID" style="min-width: 50px;display:none"  data-value="{{WID}}" >{{WID}}</td>',
            '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
            '<td data-title="MaterialNo" data-value="{{MaterialNo}}" >{{MaterialNo}}</td>',

            '<td data-title="FQTY" data-value="{{FQTY}}">{{FQTY}}</td>',

            '<td data-title="ERPPackageID" data-value="{{ERPPackageID}}" >{{ERPPackageID}}</td>',
            '<td data-title="UnitID" data-value="{{UnitID}}" >{{UnitID}}</td>',
            '<td data-title="OperatorID" data-value="{{OperatorID}}" >{{OperatorID}}</td>',
            '<td data-title="EditTime" data-value="{{EditTime}}">{{EditTime}}</td>',
            '<td data-title="Active" data-value="{{Active}}">{{Active}}</td>',
            '</tr>',
        ].join(""),


    },

        (function () {
            KEYWORD_MeteringSetting_LIST_Price = [
                "WID|序号",
                "Name|单位名称",
                "Operator|操作员",
                "OperatorID|操作员|ArrayOne",
                // "ERPUnitID|ERP单位",
                // "GroupID|分组|ArrayOne",
                "Active|状态|ArrayOne",
                "EditTime|编辑时间|DateTime",
            ];
            KEYWORD_MeteringSetting_Price = {};
            FORMATTRT_MeteringSetting_Price = {};
            DEFAULT_VALUE_MeteringSetting_Price = {
                Name: "",
                // GroupID: 0,
                // ERPUnitID: 0,
            };

            TypeSource_MeteringSetting_Price = {
                Active: [{
                    name: "启用",
                    value: 1
                }, {
                    name: "禁用",
                    value: 0
                }],
                OperatorID: [{
                    name: "无",
                    value: 0
                }],
                GroupID: [{
                    name: "无",
                    value: 0
                }]
            };


            $.each(KEYWORD_MeteringSetting_LIST_Price, function (i, item) {
                var detail = item.split("|");
                KEYWORD_MeteringSetting_Price[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };
                if (detail.length > 2) {
                    FORMATTRT_MeteringSetting_Price[detail[0]] = $com.util.getFormatter(TypeSource_MeteringSetting_Price, detail[0], detail[2]);
                }
            });
        })();

    (function () {
        KEYWORD_MeteringSetting_LIST_Package = [
            "WID|序号",
            "ID|包装序号",
            "Name|包装名称",
            "OperatorID|操作员|ArrayOne",
            "MaterialNo|物料档案|ArrayOne",
            "EditTime|编辑时间|DateTime",
            "ERPPackageID|ERP包装",
            "FQTY|数量",
            "Active|状态|ArrayOne",
            "UnitID|单位|ArrayOne",
        ];

        KEYWORD_MeteringSetting_Package = {};
        FORMATTRT_MeteringSetting_Package = {};

        DEFAULT_VALUE_MeteringSetting_Package = {
            Name: "",
        };

        TypeSource_MeteringSetting_Package = {
            Active: [{
                name: "启用",
                value: 1
            }, {
                name: "禁用",
                value: 0
            }],
            UnitID: [{
                name: "全部",
                value: 0
            }],
            MaterialNo: [{
                name: "全部",
                value: 0
            }],
            OperatorID: [{
                name: "全部",
                value: 0
            }]
        };

        $.each(KEYWORD_MeteringSetting_LIST_Package, function (x, item1) {
            var detail = item1.split("|");
            KEYWORD_MeteringSetting_Package[detail[0]] = {
                index: x,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_MeteringSetting_Package[detail[0]] = $com.util.getFormatter(TypeSource_MeteringSetting_Package, detail[0], detail[2]);
            }
        });


    })();

    (function () {
        KEYWORD_MeteringSetting_LIST_group = [
            "WID|序号",
            "ID|分组号",
            "Name|分组名",
            "OperatorID|操作员|ArrayOne",
            "EditTime|编辑时间|DateTime",
            "ERPUnitGroupID|ERP单位分组",
            "Active|状态|ArrayOne",
        ];

        KEYWORD_MeteringSetting_group = {};
        FORMATTRT_MeteringSetting_group = {};

        DEFAULT_VALUE_MeteringSetting_group = {
            Name: "",
            //ERPUnitGroupID:0,
        };

        TypeSource_MeteringSetting_group = {
            Active: [{
                name: "启用",
                value: 1
            }, {
                name: "禁用",
                value: 0
            }],
            OperatorID: [{
                name: "无",
                value: 0
            }]
        };

        $.each(KEYWORD_MeteringSetting_LIST_group, function (z, item1) {
            var detail = item1.split("|");
            KEYWORD_MeteringSetting_group[detail[0]] = {
                index: z,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_MeteringSetting_group[detail[0]] = $com.util.getFormatter(TypeSource_MeteringSetting_group, detail[0], detail[2]);
            }
        });


    })();
    model = $com.Model.create({
        name: '计量设置',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            //导出 
            $("body").delegate("#zace-exportApproval-level", "click", function () {
                var $table = $(".table-partApproval"),
                    fileName = "单位管理.xls",
                    Title = "单位管理";
                var params = $com.table.getExportParams($table, fileName, Title);

                if (params.data.length < 1) {
                    alert('请选择需要导出的数据！');
                    return false;
                }

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });



            });
            $("body").delegate("#lmvt-materialRecord-refresh", "click", function () {
                model.com.refresh();
            });

            //导入
            $("body").delegate("#lmvt-materialRecord-input", "click", function () {
                $("#input-file").val("");
                $("#input-file").click();
            });
            $("body").delegate("#input-file", "input", function () {
                var $this = $(this);

                if (this.files.length == 0)
                    return;


                if (!extLimit(['xlsx', 'xls']).has(this.files[0].name)) {
                    alert("请上传正确的Excel文件！");
                    clearFiles();
                    return;
                }
                var fileData = this.files[0];

                var form = new FormData();
                form.append("file", fileData);

                model.com.postImportExcel(form, function (res) {
                    if (!res)
                        return;
                    res.list.splice(0, 1);//删除第一行
                    var list = res.list,
                        rst = [];
                    if (list) {

                        var postData = res.list;

                        var DataParams = $com.table.postExportParams(postData, $(".table-part>table"));
                        var arr1 = [];
                        var arr1List = [];
                        for (var i = 0; i < DataParams.length; i++) {
                            arr1.push(DataParams[i].Name);
                            arr1List.push(DataParams[i]);
                        }

                        var arr2 = [];
                        var arr2List = [];
                        for (var i = 0; i < arr1.length; i++) {
                            if (arr2.indexOf(arr1[i]) == -1) {
                                arr2.push(arr1[i])
                                arr2List.push(arr1List[i]);
                            }
                        }

                        var list = model.com.getNewList(CheckDataCode, arr2List);
                        if (list.length != arr1List.length) {
                            if (!confirm("导入数据重复" + "，确定是否继续？")) {
                                model.com.refresh();
                                return false;
                            }

                        }

                        if (list.length < 1) {
                            alert("导入数据全部存在！");
                            model.com.refresh();
                            return;
                        }

                        $.each(list, function (i, item) {
                            item.Name = item.Name;
                            item.Active = 1;
                            item.ID = 0;
                            item.ERPUnitID = 0;
                            item.GroupID = 0;
                        });



                        var a = 0;

                        $com.app.loading();

                        var WhileAdd = function () {

                            model.com.PostUpdate({
                                data: list[a],
                            }, [function (res) {
                                a++;

                                if (a == list.length) {
                                    $com.app.loaded();

                                    alert("导入成功");
                                    model.com.refresh();
                                } else {
                                    WhileAdd();
                                }
                            }, function (res2) {

                                $com.app.loaded();
                                model.com.refresh();
                            }]);

                        }
                        if (list.length <= 0) {
                            alert("导入数据为空！！！");
                        } else {
                            WhileAdd();
                        }

                    }

                });
                function clearFiles() {
                    self.value = "";
                }

                function extLimit(exts) {
                    return {
                        has: function (file) {
                            var arr = file.split("."),
                                ext = arr[arr.length - 1].toLowerCase();

                            return exts.indexOf(ext) > -1 ? true : false;
                        }
                    };
                }
            });


            $("body").delegate("#zace-search-UnitSetting", "click", function () {
                var default_value = {
                    GroupID: 0,
                    //Position: 0,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.GroupID = Number(rst.GroupID);
                    $com.table.filterByConndition($("#femi-MeteringSetting-tbody_Price"), DataAll_Price, default_value, "ID");

                }, TypeSource_Level));




            });
            //计量设置修改(单位分组)
            $("body").delegate("#zace-edit-MeteringSetting-group", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-MeteringSetting-tbody-group"), "ID", DATABasic_group);

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
                    //Active: SelectData[0].Active
                };

                $("body").append($com.modal.show(default_value, KEYWORD_MeteringSetting_group, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].Name = rst.Name;
                    //SelectData[0].Active = Number(rst.Active);

                    for (var i = 0; i < SelectData.length; i++) {
                        $com.util.deleteLowerProperty(SelectData[i]);
                    }

                    model.com.postUpdateGroup({
                        data: SelectData[0]
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                    })

                }, TypeSource_MeteringSetting_group));


            });




            //计量设置查询(单位分组)
            $("body").delegate("#zace-search-MeteringSetting-group-", "input", function () {

                var $this = $(this),
                    value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-MeteringSetting-tbody-group").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-MeteringSetting-tbody-group"), group, value, "ID");


            });
            //分组查询
            $("body").delegate("#zace-MeteringSetting-group", "click", function () {
                $('.zzzb').width("54%");
                $('.zzzc').show();
                $('.zzzc').width("45%");
            })


            //计量设置新增(单位分组)
            $("body").delegate("#zace-add-MeteringSetting-group", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_MeteringSetting_group, KEYWORD_MeteringSetting_group, "新增", function (rst) {
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    groupTemp.Name = rst.Name;
                    //groupTemp.ERPUnitGroupID = Number(rst.ERPUnitGroupID);
                    model.com.postUpdateGroup({
                        data: groupTemp
                    }, function (res) {
                        model.com.refresh();
                        alert("新增成功");
                    })

                }, TypeSource_MeteringSetting_group))

            });


            $("body").delegate("#zace-back-MeteringSetting-group", "click", function () {
                $('.zzzb').show();
                $('.zzzb').css("width", "100%");
                $('.zzzc').hide();
            })
            //Enter触发模糊查询事件
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var value = $("#zace-search-MeteringSetting_Price").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-MeteringSetting-tbody_Price").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-MeteringSetting-tbody_Price"), Price, value, "ID");
                }
            });
            //单位管理
            $("body").delegate("#zace-searchAll-levelZace", "click", function () {

                var value = $("#zace-search-MeteringSetting_Price").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-MeteringSetting-tbody_Price").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-MeteringSetting-tbody_Price"), Price, value, "ID");
            });
            // 禁用单位管理
            $("body").delegate("#zace-remove-MeteringSetting_Price", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-MeteringSetting-tbody_Price"), "ID", DataAll_Price);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }

                model.com.PostActive({
                    data: SelectData,
                    Active: 0
                }, function (res) {
                    alert("禁用成功");
                    model.com.refresh();
                })
            });

            //启用单位管理
            $("body").delegate("#zace-ok-MeteringSetting_Price", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-MeteringSetting-tbody_Price"), "WID", DataAll_Price);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                model.com.PostActive({
                    data: SelectData,
                    Active: 1
                }, function (res) {
                    alert("启用成功");
                    model.com.refresh();
                })
            });
            //单位管理（修改）
            $("body").delegate("#zace-edit-MeteringSetting_Price", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-MeteringSetting-tbody_Price"), "WID", DataAll_Price);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                //SelectData[0].GroupID = 2;
                var default_value = {
                    Name: SelectData[0].Name,
                    // GroupID: SelectData[0].GroupID,
                    // ERPUnitID: SelectData[0].ERPUnitID,
                };
                var Wid = SelectData[0].WID;
                $("body").append($com.modal.show(default_value, KEYWORD_MeteringSetting_Price, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    for (var k = 0; k < CheckDataCode.length; k++) {
                        if (rst.Name == CheckDataCode[k].Name && CheckDataCode[k].ID != SelectData[0].ID) {
                            alert('单位 ' + rst.Name + ' 已存在');
                            return false;
                        };

                    }

                    SelectData[0].Name = rst.Name;
                    // SelectData[0].GroupID = Number(rst.GroupID);
                    // SelectData[0].ERPUnitID = Number(rst.ERPUnitID);

                    for (var i = 0; i < SelectData.length; i++) {
                        $com.util.deleteLowerProperty(SelectData[i]);
                    }

                    model.com.PostUpdate({
                        data: SelectData[0]
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                    })

                }, TypeSource_MeteringSetting_Price));


            });


            //单位管理（新增）
            $("body").delegate("#zace-add-MeteringSetting_Price", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_MeteringSetting_Price, KEYWORD_MeteringSetting_Price, "新增", function (rst) {
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    UnitTemp.Name = rst.Name;
                    //                 UnitTemp.ID =model.com.GetMaxID(DataAll_Price);
                    // UnitTemp.GroupID = Number(rst.GroupID);
                    // UnitTemp.ERPUnitID = Number(rst.ERPUnitID);

                    for (var k = 0; k < CheckDataCode.length; k++) {
                        if (UnitTemp.Name == CheckDataCode[k].Name) {
                            alert('单位 ' + UnitTemp.Name + ' 已存在');
                            return false;
                        };

                    }
                    model.com.PostUpdate({
                        data: UnitTemp
                    }, function (res) {
                        model.com.refresh();
                        alert("新增成功");
                    })

                }, TypeSource_MeteringSetting_Price))

            });

            $("body").delegate("#zace-back-MeteringSetting-Unit", "click", function () {
                var vdata = { 'header': '单位转换', 'href': './product_standard/MeasureUnit.html', 'id': 'MeasureUnit', 'src': './static/images/menu/basicSet/measurementSet.png' };
                window.parent.iframeHeaderSet(vdata);
            })



            //计量设置新增(保存包装配置)
            $("body").delegate("#zace-add-MeteringSetting_Package", "click", function () {
                $("body").append($com.modal.show(DEFAULT_VALUE_MeteringSetting_Package, KEYWORD_MeteringSetting_Package, "新增", function (rst) {
                    //调用插入函数 

                    if (!rst || $.isEmptyObject(rst))
                        return;

                    PackageTemp.Name = rst.Name;
                    PackageTemp.FQTY = Number(rst.FQTY);
                    PackageTemp.Active = Number(rst.Active);
                    PackageTemp.UnitID = Number(rst.UnitID);
                    var _list = [];

                    _list.push(PackageTemp);

                    model.com.postMeteringSettingPackage({
                        data: _list[0],

                    }, function (res) {
                        model.com.refresh();
                        alert("新增成功");

                    })

                }, TypeSource_MeteringSetting_Package));


            });


            //计量设置导出(价格)
            $("body").delegate("#zace-export-MeteringSetting", "click", function () {
                var $table = $(".table-part"),
                    fileName = "计量设置.xls",
                    Title = "计量设置";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });

            });
            //单位转换导出(价格)
            $("body").delegate("#zace-export-UnitSetting", "click", function () {
                var $table = $("#unit-table"),
                    fileName = "单位管理.xls",
                    Title = "单位管理";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });

            });
            //计量设置返回（价格）
            $("body").delegate("#zace-back-MeteringSetting_Price", "click", function () {
                $('.zzza').width("100%");
                $('.zzzb').hide();

            });

            //计量设置单位序号（包装配置）
            $("body").delegate("#femi-MeteringSetting-tbody_Package tr", "dblclick", function () {
                var $this = $(this);
                mMeteringSettingID = $this.find("td[data-title='WID']").attr("data-value");
                //              console.log(DATABasic_Package[mMeteringSettingID-1].UnitID);
                if ($this.children('th')[0]) {
                    return true;
                }
                $('.zzza').width("50%");
                $('.zzzb').show();


            });


            //计量设置双击名称
            $("body").delegate("#femi-MeteringSetting-tbody_Price td[data-title='Name']", "dblclick", function () {
                var $this = $(this);
                mID = $this.parent().find("td[data-title='WID']").attr("data-value");

                DataAll_Package[mMeteringSettingID - 1].UnitID = Number(DataAll_Price[mID - 1].ID);
                model.com.postMeteringSettingPackage({
                    data: DataAll_Package[mMeteringSettingID - 1]
                }, function (res) {
                    alert("修改成功");
                    model.com.refresh();

                });
                //              $.each(resPackageList, function (i, item) {
                //                  if (item.ID == mMeteringSettingID)
                //                      item.UnitID = changeName;
                //              });
                $('.zzza').width("100%");
                $('.zzzb').hide();
                model.com.refresh();
            });





            //禁用单位(包装配置)
            $("body").delegate("#zace-remove-MeteringSetting_Package", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-MeteringSetting-tbody_Package"), "ID", DataAll_Package);

                if (!SelectData || !SelectData.length) {
                    alert("至少选择一行数据！")
                    return;
                }
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其禁用？")) {
                    return;
                }

                model.com.postActive_Package({
                    data: SelectData,
                    active: 0
                }, function (res) {
                    alert("禁用成功");
                    model.com.refresh();
                })


            });


            //启用包装配置
            $("body").delegate("#zace-active-MeteringSetting_Package", "click", function () {


                var SelectData = $com.table.getSelectionData($("#femi-MeteringSetting-tbody_Package"), "ID", DataAll_Package);

                if (!SelectData || !SelectData.length) {
                    alert("至少选择一行数据！")
                    return;
                }
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其启用？")) {
                    return;
                }
                model.com.postActive_Package({
                    data: SelectData,
                    active: 1
                }, function (res) {
                    alert("启用成功");
                    model.com.refresh();
                })
            });

            //修改包装配置
            $("body").delegate("#zace-edit-MeteringSetting_Package", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-MeteringSetting-tbody_Package"), "ID", DataAll_Package);
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
                    FQTY: SelectData[0].FQTY,
                    Active: SelectData[0].Active,
                    UnitID: SelectData[0].UnitID,
                };

                $("body").append($com.modal.show(default_value, KEYWORD_MeteringSetting_Package, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    SelectData[0].Name = rst.Name;
                    SelectData[0].FQTY = Number(rst.FQTY);
                    SelectData[0].Active = Number(rst.Active);
                    SelectData[0].UnitID = Number(rst.UnitID);



                    model.com.postMeteringSettingPackage({
                        data: SelectData[0]
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                    })

                }, TypeSource_MeteringSetting_Package));
            });


        },





        run: function () {
            //          model.com.refresh();
            $('.zzza').hide();
            $('.zzzc').hide();
            $com.app.loading('数据加载中...');

            // model.com.getUnit({}, function (resPrice) {
            //     $.each(resPrice.list, function (i, item) {
            //         TypeSource_MeteringSetting_Package.UnitID.push({
            //             name: item.Name,
            //             value: item.ID,
            //             far: null
            //         })
            //     });
            model.com.GetUser({}, function (resUser) {
                $.each(resUser.list, function (i, item) {
                    TypeSource_MeteringSetting_Price.OperatorID.push({
                        name: item.Name,
                        value: item.ID,
                        far: null
                    })
                });
                model.com.refresh();
            });
            //         model.com.GetMaterialNo({ material_no: "", material_name: "", type_id: 0, status: 0 }, function (resNO) {
            //             $.each(resNO.list, function (i, item) {
            //                 TypeSource_MeteringSetting_Package.MaterialNo.push({
            //                     name: item.Name,
            //                     value: item.ID,
            //                     far: null
            //                 })
            //             });
            //             model.com.getGroupAll({}, function (resGroup) {
            //                 $.each(resGroup.list, function (i, item) {
            //                     TypeSource_MeteringSetting_Price.GroupID.push({
            //                         name: item.Name,
            //                         value: item.ID,
            //                         far: null
            //                     })
            //                 });
            //                 model.com.refresh();
            //             });
            //         });
            //     });
            // });






        },

        com: {
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

            refresh: function () {
                $com.app.loading('数据加载中...');
                //单位分组
                // model.com.getGroupAll({}, function (resgroup) {
                //     if (!resgroup)
                //         return;
                //     if (resgroup && resgroup.list) {
                //         group = $com.util.Clone(resgroup.list);
                //         DATABasic_group = $com.util.Clone(resgroup.list);

                //         $.each(group, function (i, item) {
                //             for (var p in item) {
                //                 if (!FORMATTRT_MeteringSetting_group[p])
                //                     continue;
                //                 item[p] = FORMATTRT_MeteringSetting_group[p](item[p]);
                //             }
                //         });

                //         $.each(group, function (i, item) {
                //             item.WID = i + 1;
                //         });
                //         DataAll_group = $com.util.Clone(group);
                //         $("#femi-MeteringSetting-tbody-group").html($com.util.template(group, HTML.TableModegroup));

                //         $("#femi-MeteringSetting-tbody-group tr").each(function (i, item) {
                //             var $this = $(this);
                //             var colorName = $this.css("background-color");
                //             $this.attr("data-color", colorName);



                //         });

                //     }
                // });
                //单位管理
                model.com.getUnit({}, function (resPrice) {
                    if (!resPrice)
                        return;
                    if (resPrice && resPrice.list) {
                        Price = $com.util.Clone(resPrice.list);
                        DATABasic_Price = $com.util.Clone(resPrice.list);
                        CheckDataCode = $com.util.Clone(resPrice.list);
                        $.each(Price, function (i, item) {
                            item.WID = i + 1;
                        });
                        DataAll_Price = $com.util.Clone(Price);
                        $.each(Price, function (i, item) {

                            item.Badge = " ";

                            if (item.Active == 1) {
                                item.ClassBadge = "lmvt-activeBadge";
                            } else {
                                item.ClassBadge = "lmvt-forbiddenBadge";
                            }

                            for (var p in item) {
                                if (!FORMATTRT_MeteringSetting_Price[p])
                                    continue;
                                item[p] = FORMATTRT_MeteringSetting_Price[p](item[p]);
                            }
                        });
                        $("#femi-MeteringSetting-tbody_Price").html($com.util.template(Price, HTML.TableMode));
                        $com.app.loaded();
                        $("#femi-MeteringSetting-tbody_Price tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);
                        });

                    }

                });




                //              $("#femi-MeteringSetting-tbody_Package").html($com.util.template(resPackageList, HTML.TableModeOne));
                // 查询包装配置
                // model.com.getMeteringSettingPackage({ MaterialNo: "s2" }, function (resPackage) {
                //     if (!resPackage)
                //         return;
                //     if (resPackage && resPackage.list) {
                //         //                          var Package = $com.util.Clone(resPackage.list);
                //         DATABasic_Package = $com.util.Clone(resPackage.list);
                //         DataAll_Package = $com.util.Clone(resPackage.list);
                //         $.each(DATABasic_Package, function (i, item) {
                //             item.WID = i + 1;
                //         });
                //         $.each(DATABasic_Package, function (x, item1) {
                //             for (var q in item1) {
                //                 if (!FORMATTRT_MeteringSetting_Package[q])

                //                     continue;
                //                 item1[q] = FORMATTRT_MeteringSetting_Package[q](item1[q]);
                //             }

                //         });

                //         $("#femi-MeteringSetting-tbody_Package").html($com.util.template(DATABasic_Package, HTML.TableModeOne));
                //         $("#femi-MeteringSetting-tbody_Package tr").each(function (i, item) {
                //             var $this = $(this);
                //             var colorName = $this.css("background-color");
                //             $this.attr("data-color", colorName);



                //         });

                //     }

                // });


                //             model.com.getMeasureUnit({}, function (resUnit) {
                //                  if (!resUnit)
                //                      return;
                //                 
                //
                //              });



            },

            //查询单位组列表
            getGroupAll: function (data, fn, context) {
                var d = {
                    $URI: "/Unit/GroupAll",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //保存单位组列表
            postUpdateGroup: function (data, fn, context) {
                var d = {
                    $URI: "/Unit/UpdateGroup",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //查询单位
            getUnit: function (data, fn, context) {
                var d = {
                    $URI: "/Unit/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },


            //保存单位(参数data:{MSSUnit})
            PostUpdate: function (data, fn, context) {
                var d = {
                    $URI: "/Unit/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //启用单位(参数data:{MSSUnit[]}，active:{int})
            PostActive: function (data, fn, context) {
                var d = {
                    $URI: "/Unit/Active",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //用户表
            GetUser: function (data, fn, context) {
                var d = {
                    $URI: "/User/All",
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
                            if (_source[i].Name == set_data[j].Name) {
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
                            if (set_data[i].Name == _source[j].Name) {
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
                                model.com.getNewList(_source, set_data);
                            }
                        }

                    }
                    rst = set_data;
                    return rst;

                }

            },

            //计量设置(保存包装配置)
            //          postMeteringSettingPackage: function (data, fn, context) {
            //              
            //				//保存到变量中
            //              fn();
            //          },
            postMeteringSettingPackage: function (data, fn, context) {
                var d = {
                    $URI: "/Package/Save",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },


            //查询计量设置列表(查询包装配置)
            //          getMeteringSettingPackage: function (data, fn, context) {
            //              fn(resPackageList);
            //          },

            getMeteringSettingPackage: function (data, fn, context) {
                var d = {
                    $URI: "/Package/Get",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //物料号
            //Material_no：{String} ,material_name:{String} ,type_id:{int} ,status:{int}
            GetMaterialNo: function (data, fn, context) {
                var d = {
                    $URI: "/Material/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //启用单位(包装配置)
            postActive_Package: function (data, fn, context) {
                var d = {
                    $URI: "/Package/Active",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //得到ID
            GetMaxID: function (_source) {
                var id = 0;
                if (!_source)
                    _source = [];
                $.each(_source, function (i, item) {
                    if (item.ID > id)
                        id = item.ID;
                });
                return id + 1;

            },



        }
    }),

        model.init();


});