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
        KETWROD_Template_Arrange,
        TypeSource_Arrange,
        TypeSource,
        TypeSource_PROPERTY,
        FORMATTRT,
        FORMATTRT_PROPERTY,
        DMSDeviceSource,
        DMSDevicePropertySource,
        Formattrt_Arrange,
        DATA,
        DataAll,
        DEFAULT_VALUE_Status,
        DataAll2,
        AllUser,
        AllSpare,
        AllDevice,
        AllEquip,
        BOOL,
        TIME;
   
    HTML = {
        DeviceEquipSpare: [
         '<tr data-color="">',
         '<td style="width: 3px"><input type="checkbox"',
         'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
         '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td>    ',
         '<td style="min-width: 50px" data-title="DeviceSpareName" data-value="{{DeviceSpareName}}">{{DeviceSpareName}}</td>   ',
         '<td style="min-width: 50px" data-title="SpareModelID" data-value="{SpareModelID}}">{{SpareModelID}}</td>  ',
         '<td style="min-width: 50px" data-title="DeviceModelID" data-value="{{DeviceModelID}}">{{DeviceModelID}}</td> ',
         '<td style="min-width: 50px" data-title="ControllerName" data-value="{ControllerName}}">{{ControllerName}}</td>',
         '<td style="min-width: 50px" data-title="ControllerModel" data-value="{ControllerModel}}">{{ControllerModel}}</td>  ',
         '<td style="min-width: 50px" data-title="SupplierName" data-value="{SupplierName}}">{{SupplierName}}</td>',
         '<td style="min-width: 50px" data-title="SupplierModelNo" data-value="{SupplierModelNo}}">{{SupplierModelNo}}</td>',
         '<td style="min-width: 50px" data-title="SystemName" data-value="{SystemName}}">{{SystemName}}</td>',
         '<td style="min-width: 50px" data-title="SystemVersion" data-value="{SystemVersion}}">{{SystemVersion}}</td>',
         '<td style="min-width: 50px" data-title="EquipNum" data-value="{EquipNum}}">{{EquipNum}}</td>',
         '<td style="min-width: 50px" data-title="OperatorID" data-value="{OperatorID}}">{{OperatorID}}</td>  ',
         '<td style="min-width: 50px" data-title="OperatorTime" data-value="{OperatorTime}}">{{OperatorTime}}</td>',
         '<td style="min-width: 50px" data-title="Active" data-value="{Active}}">{{Active}}</td>',
         '</tr>',
        ].join(""),
        DeviceEquipList: [
         '<tr data-color="">',
         '<td style="width: 3px"><input type="checkbox"',
         'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
         '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td>    ',
         '<td style="min-width: 50px" data-title="ModelNo" data-value="{{ModelNo}}">{{ModelNo}}</td>   ',
         '<td style="min-width: 50px" data-title="OperatorID" data-value="{OperatorID}}">{{OperatorID}}</td>  ',
         '<td style="min-width: 50px" data-title="OperatorTime" data-value="{OperatorTime}}">{{OperatorTime}}</td>',
         '<td style="min-width: 50px" data-title="Active" data-value="{Active}}">{{Active}}</td>',
         '</tr>',
        ].join(""),
    };

    (function () {
        KETWROD_LIST_Arrange = [
            "Active|状态|ArrayOne",
            "DeviceModelID|设备型号|ArrayOne",
            "SpareModelID|备件型号|ArrayOne",
            "EquipOptions|可选备件列表|Array",
            "OperatorID|录入人|ArrayOne",
        ];

        KETWROD_Template_Arrange = {};

        Formattrt_Arrange = {};

        TypeSource_Arrange = {
            Active: [{
                name: "激活",
                value: 0
            },
           {
               name: "禁用",
               value: 1
           }],
            DeviceModelID: [],
            SpareModelID: [],
            EquipOptions: [],
            OperatorID:[],
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
      
        KEYWORD_Point_LIST1 = [
            "DeviceSpareName|名称",
            "DeviceModelID|设备型号|ArrayOne",
            "SpareModelID|备件型号|ArrayOne",
            "EquipOptions|可选备件列表|Array",
            "EquipNum|数量",
            "Active|状态|ArrayOne",

        ];
       
        FORMATTRT = {};
        KEYWORD1 = {};
     
        DEFAULT_VALUE1 = {
            DeviceSpareName:"",
            DeviceModelID: 0,
            SpareModelID: 0,
            EquipOptions: [],
            EquipNum:0,
        };
        TypeSource_Point1 = {
            DeviceModelID: [
                {
                    name: "无",
                    value:0
                }
            ],
            SpareModelID: [
                 {
                     name: "无",
                     value: 0
                 }
            ],
            Active: [{
                name: "激活",
                value: 0
            },
         {
             name: "禁用",
             value: 1
         },
           {
               name: "全部",
               value: -1
           }
            ],
            EquipOptions: [],
        };

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
                        $(".lmvt-system-body").children("tr").show();
                    else
                        $com.table.filterByLikeString($(".lmvt-system-body"), DataAll, value, "ID");
            });
            //条件查询
            $("body").delegate("#lmvt-left-check", "click", function () {
                var default_value = {
                    DeviceSpareName: "",
                    DeviceModelID: 0,
                    SpareModelID: 0,
                    Active:-1,
                }
                $("body").append($com.modal.show(default_value, KEYWORD1, "查询", function (rst) {
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    model.com.getEquipSpare({
                        DeviceSpareName: rst.DeviceSpareName, DeviceModelID: rst.DeviceModelID, SpareModelID: rst.SpareModelID, active: rst.Active
                    }, function (res) {
                        if (!res)
                            return;
                        var list = res.list;
                        // AllEquip = res.list;
                        var ClonSpareList = $com.util.Clone(list);
                        for (var i = 0; i < ClonSpareList.length; i++) {
                            for (var j = 0; j < AllDevice.length; j++) {
                                if (ClonSpareList[i].DeviceModelID == AllDevice[j].ID) {
                                    TypeSource_Arrange.DeviceModelID.push({ name: AllDevice[j].ModelNo, value: AllDevice[j].ID });
                                    ClonSpareList[i].ControllerName = AllDevice[j].ControllerName;
                                    ClonSpareList[i].ControllerModel = AllDevice[j].ControllerModel;
                                    ClonSpareList[i].SupplierName = AllDevice[j].SupplierName;
                                    ClonSpareList[i].SupplierModelNo = AllDevice[j].SupplierModelNo;
                                    ClonSpareList[i].SystemName = AllDevice[j].SystemName;
                                    ClonSpareList[i].SystemVersion = AllDevice[j].SystemVersion;

                                }
                            }
                       
                        for (var n = 0; n < AllSpare.length; n++) {
                            if (ClonSpareList[i].SpareModelID == AllSpare[n].ID) {
                                TypeSource_Arrange.SpareModelID.push({ name: AllSpare[n].ModelNo, value: AllSpare[n].ID });
                            }
                        }
                        for (var m = 0; m < AllUser.length; m++) {
                            if (ClonSpareList[i].OperatorID == AllUser[m].ID) {
                                TypeSource_Arrange.OperatorID.push({ name: AllUser[m].Name, value: AllUser[m].ID });
                            }
                        }
                    }
                    $.each(ClonSpareList, function (i, item) {
                        for (var p in item) {
                            if (!Formattrt_Arrange[p])
                                continue;
                            item[p] = Formattrt_Arrange[p](item[p]);
                        }
                    });
                    $(".lmvt-system-body").html($com.util.template(ClonSpareList, HTML.DeviceEquipSpare));
                    $(".lmvt-system-body tr").each(function (i, item) {
                        var $this = $(this);
                        var colorName = $this.css("background-color");
                        $this.attr("data-color", colorName);



                    });
                    });
                }, TypeSource_Point1));
            });
            //新增可装备件
            $("body").delegate("#lmvt-deviceinfo-add", "click", function () {
           
                $("body").append($com.modal.show(DEFAULT_VALUE1, KEYWORD1, "新增", function (rst) {
                    //调用插入函数 

                    if (!rst || $.isEmptyObject(rst))
                        return;
                    var _data = {
                        ID: 0,
                        DeviceSpareName: rst.DeviceSpareName,
                        DeviceModelID: rst.DeviceModelID,
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
                        model.com.refresh();
                    })
                }, TypeSource_Point1));
            });
            //修改可装备件
            $("body").delegate("#lmvt-deviceinfo-edit", "click", function () {
                var SelectData = $com.table.getSelectionData($(".lmvt-system-body"), 'ID', AllEquip);
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
                    DeviceModelID: SelectData[0].DeviceModelID,
                    SpareModelID: SelectData[0].SpareModelID,
                    EquipNum: SelectData[0].EquipNum,
                    EquipOptions: SelectData[0].EquipOptions,
                };

                $("body").append($com.modal.show(default_value, KEYWORD1, "修改", function (rst) {

                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    var _data = {
                        ID: SelectData[0].ID,
                        DeviceSpareName: rst.DeviceSpareName,
                        DeviceModelID: rst.DeviceModelID,
                        SpareModelID: rst.SpareModelID,
                        EquipNum: rst.EquipNum,
                        EquipOptions: rst.EquipOptions,
                    };
                    for (var i = 0; i < AllEquip.length; i++) {
                        if (_data.DeviceModelID == AllEquip[i].DeviceModelID && _data.DeviceSpareName == AllEquip[i].DeviceSpareName && _data.ID!=AllEquip[i].ID) {
                            alert("同设备不能有相同的名称，请更改！");
                            return;
                        }
                    }
                    model.com.addEquip({
                        data: _data
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                    })
                }, TypeSource_Point1));
            });
            //禁用加可装备件
            $("body").delegate("#lmvt-deviceinfo-forbidden", "click", function () {
                var SelectData = $com.table.getSelectionData($(".lmvt-system-body"), 'ID', AllEquip);

                if (!SelectData || !SelectData.length) {
                    alert("至少选择一行数据！")
                    return;
                }
                model.com.eqActive(
                               { data: SelectData, Active: 1 }
                          , function (res) {
                              alert("禁用完成");
                              model.com.refresh();
                          });
            });
            //激活可装备件
            $("body").delegate("#lmvt-deviceinfo-active", "click", function () {
                var SelectData = $com.table.getSelectionData($(".lmvt-system-body"), 'ID', AllEquip);

                if (!SelectData || !SelectData.length) {
                    alert("至少选择一行数据！")
                    return;
                }
                model.com.eqActive(
                             { data: SelectData, Active: 0 }
                        , function (res) {
                            alert("激活完成");
                            model.com.refresh();
                        });
            });
            //隐藏
            $("body").delegate("#hide", "click", function () {
                $(".lmvt-container-apply").hide();
                $(".lmvt-container-system").css("margin-right", "0");
                $(".iplant-tool-right").hide();
            });
            //可选备件列表
            $("body").delegate("#lmvt-deviceinfo-list", "click", function () {
                var SelectData = $com.table.getSelectionData($(".lmvt-system-body"), 'ID', AllEquip);
                if (!SelectData || !SelectData.length) {
                    alert("至少选择一行数据！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能选择一条数据！")
                    return;
                }
                $(".iplant-tool-right").show();
                $(".lmvt-container-system").css("margin-right", "400px");
                $(".lmvt-container-apply").show();
                var list = SelectData[0].EquipOptions;
                var templateList = [];
                for (var i = 0; i < list.length; i++) {
                    for (var j = 0; j < AllSpare.length; j++) {
                        if (list[i] == AllSpare[j].ID) {
                            templateList.push(AllSpare[j]);
                        }
                    }
                }
                $.each(templateList, function (i, item) {
                    for (var p in item) {
                        if (!Formattrt_Arrange[p])
                            continue;
                        item[p] = Formattrt_Arrange[p](item[p]);
                    }
                });
                $(".lmvt-apply-body").html($com.util.template(templateList, HTML.DeviceEquipList));
                $(".lmvt-apply-body tr").each(function (i, item) {
                    var $this = $(this);
                    var colorName = $this.css("background-color");
                    $this.attr("data-color", colorName);



                });
            });
        },

        run: function () {
            model.com.load();
           
        },

        com: {
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
            get: function (data, fn, context) {
                var d = {
                    $URI: "/SpareLedgerApply/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
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
          
            refresh: function () {
                model.com.getEquipSpare({
                    DeviceSpareName: "", DeviceModelID: 0, SpareModelID: 0,active:-1
                }, function (res) {
                    if (!res)
                        return;
                    var list = res.list;
                    AllEquip = res.list;
                    var ClonSpareList = $com.util.Clone(list);
                    for (var i = 0; i < ClonSpareList.length; i++) {
                        for (var j = 0; j < AllDevice.length; j++) {
                            if (ClonSpareList[i].DeviceModelID == AllDevice[j].ID) {
                                TypeSource_Arrange.DeviceModelID.push({ name: AllDevice[j].ModelNo, value: AllDevice[j].ID });
                                ClonSpareList[i].ControllerName = AllDevice[j].ControllerName;
                                ClonSpareList[i].ControllerModel = AllDevice[j].ControllerModel;
                                ClonSpareList[i].SupplierName = AllDevice[j].SupplierName;
                                ClonSpareList[i].SupplierModelNo = AllDevice[j].SupplierModelNo;
                                ClonSpareList[i].SystemName = AllDevice[j].SystemName;
                                ClonSpareList[i].SystemVersion = AllDevice[j].SystemVersion;

                            }
                        }
                        for (var n = 0; n < AllSpare.length; n++) {
                            if (ClonSpareList[i].SpareModelID == AllSpare[n].ID) {
                                TypeSource_Arrange.SpareModelID.push({ name: AllSpare[n].ModelNo, value: AllSpare[n].ID });
                            }
                        }
                        for (var m = 0; m < AllUser.length; m++) {
                            if (ClonSpareList[i].OperatorID == AllUser[m].ID) {
                                TypeSource_Arrange.OperatorID.push({ name: AllUser[m].Name, value: AllUser[m].ID });
                            }
                        }
                    }
                    $.each(ClonSpareList, function (i, item) {
                        for (var p in item) {
                            if (!Formattrt_Arrange[p])
                                continue;
                            item[p] = Formattrt_Arrange[p](item[p]);
                        }
                    });
                    $(".lmvt-system-body").html($com.util.template(ClonSpareList, HTML.DeviceEquipSpare));
                    $(".lmvt-system-body tr").each(function (i, item) {
                        var $this = $(this);
                        var colorName = $this.css("background-color");
                        $this.attr("data-color", colorName);



                    });
                    DataAll = ClonSpareList;

                });
            },
  
        
            load: function () {
                model.com.getUser({

                }, function (res) {
                    if (!res)
                        return;
                       AllUser = res.list;
                        model.com.getSpare({
                            SpareWorkType: 0, SupplierID: 0, ModelPropertyID: 0,
                            SupplierModelNo: "", Active: -1
                        }, function (res) {
                            if (!res)
                                return;
                            var list = res.list;
                            AllSpare = res.list;
                            for (var i = 0; i < list.length; i++) {
                                TypeSource_Point1.SpareModelID.push({ name: list[i].ModelNo, value: list[i].ID });
                                TypeSource_Point1.EquipOptions.push({ name: list[i].ModelNo, value: list[i].ID });
                            }
                            model.com.getDeviceInfoAll({
                                DeviceWorkType:0,SupplierID:0,ModelPropertyID:0,
                                SystemID:0,SystemPropertyID:0,ControllerID:0,
                                ControllerPropertyID:0,Active:-1,SupplierModelNo:"",
                                SystemVersion:"",ControllerModel:"",
                            }, function (res) {
                                if (!res)
                                    return;
                                var list = res.list;
                                AllDevice = res.list;
                                for (var i = 0; i < list.length; i++) {
                                    TypeSource_Point1.DeviceModelID.push({ name: list[i].ModelNo, value: list[i].ID });
                                }
                                model.com.refresh();
                                });
                        });
                });
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