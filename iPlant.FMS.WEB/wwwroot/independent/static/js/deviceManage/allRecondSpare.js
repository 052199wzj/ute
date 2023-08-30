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
        DataAllOriginal,
        AllUser,
        AllSpare,
        AllDevice,
        AllEquip,
      
   
    HTML = {
        DeviceSupplier: [
          '<tr data-color="">',
          '<td style="width: 3px"><input type="checkbox"',
          'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
          '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
          '<td style="min-width: 50px" data-title="SpareNo" data-value="{{SpareNo}}">{{SpareNo}}</td> ',
          '<td style="min-width: 50px" data-title="DeviceNo" data-value="{{DeviceNo}}">{{DeviceNo}}</td> ',
          '<td style="min-width: 50px" data-title="StartTime " data-value="{StartTime }}">{{StartTime }}</td>  ',
          '<td style="min-width: 50px" data-title="EndTime " data-value="{EndTime }}">{{EndTime }}</td>  ',
          '<td style="min-width: 50px" data-title="ProcessingMin  " data-value="{{ProcessingMin  }}">{{ProcessingMin  }}</td> ',
          '<td style="min-width: 50px" data-title="ProcessingPartsNum " data-value="{{ProcessingPartsNum }}" >{{ProcessingPartsNum }}</td>',
         // '<td style="min-width: 50px" data-title="Used" data-value="{{Used}}" >{{Used}}</td>',
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
            "SpareNo|备件编码|ArrayOne",
            "DeviceNo|设备编码|ArrayOne",
            "StartTime|开始时间|Date",
            "EndTime|结束时间|Date",
            //"Used|是否正在使用|ArrayOne",
        ];
       
        FORMATTRT = {};
        KEYWORD1 = {};
     
        DEFAULT_VALUE1 = {
            SpareNo:0,
            DeviceNo: 0,
            StartTime: "2019-01-01",
           //hh:mm:ss
            EndTime:$com.util.format('yyyy-MM-dd', new Date()),
            Used:-1,
        };
        TypeSource_Point1 = {
            SpareNo: [
                {
                    name: "无",
                    value: 0
                }
            ],
            DeviceNo: [
                {
                    name: "无",
                    value:0
                }
            ],
            Used: [
                 {
                     name: "无",
                     value: -1
                 },
                {
                    name: "是",
                    value: 0
                },
                {
                     name: "否",
                     value: 1
                 }
            ],
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
                var $table = $("#recondList"),
                  fileName = "备件使用记录.xls",
                  Title = "备件使用记录";
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
                        $com.table.filterByLikeString($(".lmvt-system-body"), DataAll2, value, "ID");
            });
            //条件查询
            $("body").delegate("#lmvt-left-check", "click", function () {
                $("body").append($com.modal.show(DEFAULT_VALUE1, KEYWORD1, "查询", function (rst) {
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    model.com.getRecond({
                        SpareLedgerID:rst.SpareNo, DeviceLedgerID: rst.DeviceNo, Used: rst.Used, StartTime: rst.StartTime, EndTime: rst.StartTime
                    }, function (res) {
                        if (!res)
                            return;
                        var list = res.list;
                        for (var i = 0; i < list.length; i++) {
                            if (list[i].Used == 0)
                                list[i].Used = "是";
                            if (list[i].Used == 1)
                                list[i].Used = "否";
                        }
                        $(".lmvt-system-body").html($com.util.template(list, HTML.DeviceSupplier));
                        $(".lmvt-system-body tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });
                    });
                }, TypeSource_Point1));
            });
        },

        run: function () {
           // model.com.load();
            model.com.getRecond({
                SpareLedgerID: 0, DeviceLedgerID: 0, Used: -1,
            }, function (res) {
                if (!res)
                    return;
                var list = res.list;
                for (var i = 0; i < list.length; i++) {
                    TypeSource_Point1.DeviceNo.push({ name: list[i].DeviceNo, value: list[i].DeviceLedgerID });
                    TypeSource_Point1.SpareNo.push({ name: list[i].SpareNo, value: list[i].SpareLedgerID });
                }
                DataAllOriginal = list;
                RanderData1 = res.list;
                for (var i = 0; i < RanderData1.length; i++) {
                    if (RanderData1[i].Used == 0)
                        RanderData1[i].Used = "是";
                    if (RanderData1[i].Used == 1)
                        RanderData1[i].Used = "否";
                }
                $(".lmvt-system-body").html($com.util.template(RanderData1, HTML.DeviceSupplier));
                $(".lmvt-system-body tr").each(function (i, item) {
                    var $this = $(this);
                    var colorName = $this.css("background-color");
                    $this.attr("data-color", colorName);



                });
                DataAll2 = RanderData1;
            });
        },

        com: {
            getRecond: function (data, fn, context) {
                var d = {
                    $URI: "/SpareUsedRecord/All",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
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