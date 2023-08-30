require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/paging'], function ($yang, $com, $page) {

    var HTML,
        model,
        PropertyField,
        KEYWORD,
        StoreHouseList,
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
        newDataAllOriginal,
        DEFAULT_VALUE_Status,
        DataAll2,
        AllUser,
        AllBusinessUnit,
        AllFactory,
        AllWorkShop,
        AllLine,
        UseID,
        AllDeviceLedger,
        AllModelID,
        DeviceLedgerID,//使用记录的全局变量
        AllApply,
        DataAllOriginal,
        BOOL;
    BOOL = false;
    TIME = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date());
    Formattrt_Arrange = [];

    HTML = {
        DeviceTemplate: [
            '<tr data-color="">',
            '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td  data-title="WID" data-value="{{ID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td style="min-width: 50px" data-title="Code" data-value="{{Code}}">{{Code}}</td> ',
            '<td style="min-width: 50px" data-title="Name" data-value="{{Name}}">{{Name}}</td> ',
            '<td style="min-width: 50px" data-title="ModelID" data-value="{{ModelID}}">{{ModelID}}</td>',
            // '<td style="min-width: 50px" data-title="ApplyID" data-value="{{ApplyID}}">{{ApplyID}}</td>',
            '<td style="min-width: 50px" data-title="Life" data-value="{{Life}}">{{Life}}</td>    ',
            '<td style="min-width: 50px" data-title="ScrapValue " data-value="{{ScrapValue}}">{{ScrapValue}}</td>   ',
            '<td style="min-width: 50px" data-title="NetValue" data-value="{NetValue}}">{{NetValue}}</td>  ',
            '<td style="min-width: 50px" data-title="LimitCount" data-value="{{LimitCount}}">{{LimitCount}}</td>   ',
            '<td style="min-width: 50px" data-title="BusinessUnitID" data-value="{{BusinessUnitID}}">{{BusinessUnitID}}</td>    ',
            // '<td style="min-width: 50px" data-title="BaseID" data-value="{{BaseID}}">{{BaseID}}</td>    ',
            '<td style="min-width: 50px" data-title="WorkShopID" data-value="{{WorkShopID}}">{{WorkShopID}}</td>   ',
            '<td style="min-width: 50px" data-title="LineID" data-value="{{LineID}}">{{LineID}}</td> ',
            '<td style="min-width: 50px" data-title="EditorName" data-value="{EditorName}}">{{EditorName}}</td>  ',
            '<td style="min-width: 50px" data-title="EditTime" data-value="{EditTime}}">{{EditTime}}</td>',
            '<td data-title="Status" data-value="{{Status}}"><span class="badge lmvt-badge {{ClassBadge}}">{{Badge}}</span>{{Status}}</td>',
            '<td style="width: 200px" data-title="Handle" data-value="{{ID}}">',
            '<div class="row">',
            // '<div class="col-md-4 {{ISAllowed}}">{{ISAllowedText}}</div>',
            '<div class="col-md-4 lmvt-do-info lmvt-reset">修改</div>',
            '<div class="col-md-4 lmvt-do-info"><UL id="lmvt-nav">',
            '<LI class="lmvt-do-info">状态设置<UL><LI data-value="{{ID}}" id="active1">启用</LI>',
            '<LI data-value="{{ID}}" id="active2">封存</LI>',
            '<LI data-value="{{ID}}" id="active3">维修</LI>',
            '<LI data-value="{{ID}}" id="active4">保养</LI>',
            '<LI data-value="{{ID}}" id="active5">报废</LI>',
            '</UL></LI></UL></div>',
            '<div class="col-md-4 lmvt-do-info"><UL id="lmvt-nav">',
            '<LI class="lmvt-do-info">维保配置<UL>',
            '<LI data-value="{{ID}}" class="BYConfig">保养配置</LI>',
            '<LI data-value="{{ID}}" class="WXConfig">维修配置</LI>',
            '</UL></LI></UL></div>',
            '</div></td>',
            '</tr>',
        ].join(""),
        DeviceType: [
            '<tr data-color="">',
            '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td style="min-width: 50px" data-title="ApplyNo" data-value="{{ApplyNo}}">{{ApplyNo }}</td>   ',
            '<td style="min-width: 50px" data-title="SpareModelID" data-value="{{SpareModelID}}">{{SpareModelID}}</td>   ',
            '<td style="min-width: 50px" data-title="ApplicantID" data-value="{ApplicantID}}">{{ApplicantID}}</td>  ',
            '<td style="min-width: 50px" data-title="ApplicantTime" data-value="{ApplicantTime}}">{{ApplicantTime}}</td>  ',
            '<td data-title="ApproverID " data-value="{{ApproverID}}" >{{ApproverID}}</td>',
            '<td style="min-width: 50px" data-title="ApproverTime" data-value="{{ApproverTime}}">{{ApproverTime}}</td> ',
            '<td style="min-width: 50px" data-title="ConfirmID" data-value="{{ConfirmID}}">{{ConfirmID}}</td>   ',
            '<td style="min-width: 50px" data-title="ConfirmTime" data-value="{{ConfirmTime}}">{{ConfirmTime}}</td> ',
            '<td style="min-width: 50px" data-title="Status" data-value="{Status}}">{{Status}}</td>  ',
            '<td style="min-width: 50px" data-title="SpareNum" data-value="{SpareNum}}">{{SpareNum}}</td>  ',
            '<td style="min-width: 50px" data-title="SpareIDOptions" data-value="{SpareIDOptions}}">{{SpareIDOptions}}</td>  ',
            '</tr>',
        ].join(""),
        DeviceSupplier: [
            '<tr data-color="">',
            '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            //'<td style="min-width: 50px" data-title="SpareModelID" data-value="{{SpareModelID}}">{{SpareModelID}}</td> ',
            // '<td style="min-width: 50px" data-title="DeviceNo" data-value="{{DeviceNo}}">{{DeviceNo}}</td> ',
            '<td style="min-width: 50px" data-title="StartTime" data-value="{{StartTime}}">{{StartTime}}</td>  ',
            '<td style="min-width: 50px" data-title="EndTime" data-value="{{EndTime }}">{{EndTime}}</td>  ',
            '<td style="min-width: 50px" data-title="ProcessingMin" data-value="{{ProcessingMin}}">{{ProcessingMin}}</td> ',
            '<td style="min-width: 50px" data-title="ProcessingPartsNum" data-value="{{ProcessingPartsNum}}">{{ProcessingPartsNum }}</td>',
            // '<td style="min-width: 50px" data-title="Used" data-value="{{Used}}" >{{Used}}</td>',
            '</tr>',
        ].join(""),
    };

    PropertyField = ["Default", "SupplierID", "SystemID", "MachineTypeID", "ControllerTypeID", "DeviceTypeID"];
    DMSDeviceSource = [];
    DMSDevicePropertySource = [[], [], [], [], [], []];

    (function () {
        KETWROD_LIST_Arrange = [
            "Status|状态|ArrayOne",
            "ApplyID|申请单|ArrayOne",
            "OperatorID|录入人|ArrayOne",
            "ModelID|设备型号|ArrayOne",
            "BusinessUnitID|所属部门|ArrayOne",
            "BaseID|库位|ArrayOne",
            "FactoryID|生产基地下的工厂|ArrayOne",
            "WorkShopID|车间|ArrayOne",
            "LineID|产线|ArrayOne",
            "OperatorTime|时间|DateTime",
            "EditTime|时间|DateTime",
        ];

        KETWROD_Template_Arrange = {};

        Formattrt_Arrange = {};

        TypeSource_Arrange = {
            Status: [
                {
                    name: "封存",
                    value: 0
                },
                {
                    name: "在用",
                    value: 1
                },
                {
                    name: "维修",
                    value: 3
                },
                {
                    name: "保养",
                    value: 4
                }, {
                    name: "报废",
                    value: 5
                }

            ],
            ApplyID: [],
            OperatorID: [],
            ModelID: [
                {
                    name: "无",
                    value: 0,
                }
            ],
            BusinessUnitID: [
                {
                    name: "无",
                    value: 0,
                    far: 0,
                }
            ],
            FactoryID: [
                {
                    name: "无",
                    value: 0,
                    far: 0,

                }
            ],
            WorkShopID: [
                {
                    name: "无",
                    value: 0,
                    far: 0,

                }
            ],
            LineID: [
                {
                    name: "无",
                    value: 0,
                    far: 0,

                }
            ],
            BaseID: [
                {
                    name: "无",
                    value: 0,
                    far: 0
                }
            ],
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
            "ApplyNo|名称|",
            "ModelID|设备型号|",
            "BusinessUnitID|所属部门|",
            "WorkShopID|车间|",
            //"DeviceLedgerID|设备名称|",
            "ApplicantID|申请人|",
            "ApplicantTime|申请时刻|DateTime",
            "ApproverID|审批人|",
            "ApproverTime|审批时刻|DateTime",
            "ConfirmID|确认人|",
            "ConfirmTime|确认时刻|DateTime",
            //"Status|状态|",
            //"SpareNum|备件数量|",
        ];
        KEYWORD_Point_LIST1 = [
            "Name|设备名称",
            "DeviceNo|设备编码",
            "BusinessUnitID|部门|ArrayOne",
            "BaseID|库位|ArrayOne",
            //"FactoryID|生产基地下的工厂|ArrayOneControl",
            "WorkShopID|车间|ArrayOneControl|BusinessUnitID",
            "LineID|产线|ArrayOneControl|WorkShopID",
            "ModelID|设备型号|ArrayOne",
            "Status|状态|ArrayOne",
        ];
        KEYWORD_Point_LIST2 = [
            "ID|记录号|",
            "SpareLedgerID|备件|",
            "StartTime|开始时刻|DateTime",
            "EndTime|结束时刻|DateTime",
            "ProcessingMin|加工时长|",
            "ProcessingPartsNum|加工工件个数|",
        ];
        KEYWORD_Point_LIST3 = [
            "DeviceNo|设备型号|ArrayOne",
            "StartTime|开始时间|DateTime",
            "EndTime|结束时间|DateTime",
            //"Used|是否正在使用|ArrayOne",
        ];
        FORMATTRT = {};
        KEYWORD = {};
        KEYWORD1 = {};
        KEYWORD2 = {};
        KEYWORD3 = {};
        DEFAULT_VALUE = {

            ID: 0,
            SpareNo: "",
            AssetID: 0,
            SpareModelID: 0,
            SpareLife: 0,
            ScrapValue: 0,
            NetValue: 0,
            LimitCount: 0,
            Status: 0,
            OperatorID: 0,
            OperatorTime: TIME,
        };
        DEFAULT_VALUE1 = {
            ModelID: 0,
            BusinessUnitID: 0,
            FactoryID: 0,
            //WorkShopID: 0,
            LineID: 0,
        };
        DEFAULT_VALUE2 = {
            ID: 0,
            SpareLedgerID: "",
            StartTime: "",
            EndTime: "",
            ProcessingMin: 0,
            ProcessingPartsNum: 0,
        };
        DEFAULT_VALUE3 = {
            //DeviceNo: 0,
            StartTime: "2019-01-01",
            //hh:mm:ss
            EndTime: $com.util.format('yyyy-MM-dd', new Date()),
            Used: -1,
        };
        TypeSource_Point = {

        };
        TypeSource_Point1 = {
            ModelID: [
                {
                    name: "无",
                    value: 0,
                    far: 0
                }
            ],

            BusinessUnitID: [
                {
                    name: "无",
                    value: 0,
                    far: 0
                }
            ],
            FactoryID: [
                {
                    name: "无",
                    value: 0,
                    far: 0
                }
            ],
            WorkShopID: [
                {
                    name: "无",
                    value: 0,
                    far: 0
                }
            ],
            LineID: [
                {
                    name: "无",
                    value: 0,
                    far: 0
                }
            ],
            BaseID: [
                {
                    name: "无",
                    value: 0,
                    far: 0
                }
            ],

            Status: [

                {
                    name: "封存",
                    value: 0
                },
                {
                    name: "在用",
                    value: 1
                },
                {
                    name: "维修",
                    value: 3
                },
                {
                    name: "保养",
                    value: 4
                }, {
                    name: "报废",
                    value: 5
                }
            ],
        };
        TypeSource_Point2 = {
            OperatorID: []
        };
        TypeSource_Point3 = {
            DeviceNo: [
                {
                    name: "无",
                    value: 0
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
        $.each(KEYWORD_Point_LIST3, function (i, item) {
            var detail = item.split("|");
            KEYWORD3[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT[detail[0]] = $com.util.getFormatter(TypeSource_Point3, detail[0], detail[2]);
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
            //保养配置
            $("body").delegate(".BYConfig", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                //查看保养配置
                var vdata = { 'header': '保养配置', 'href': './process_control/DeviceMaintainControl.html?DeciceID=' + wID, 'id': 'BYConfigSetting', 'src': '/MESCore/upload/image/设备管理.png' };
                window.parent.iframeHeaderSet(vdata);
                window.callFunctionTrigger("BYConfigSetting", { LineID: wID });

            });
             //维修配置
             $("body").delegate(".WXConfig", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                //查看维修配置
                var vdata = { 'header': '维修配置', 'href': './process_control/DeviceRepairControl.html?DeciceID=' + wID, 'id': 'WXConfigSetting', 'src': '/MESCore/upload/image/配置.png' };
                window.parent.iframeHeaderSet(vdata);
                window.callFunctionTrigger("WXConfigSetting", { LineID: wID });

            });
            //新增
            $("body").delegate("#zace-add-Ledger", "click", function () {


                var DEFAULT_VALUEZace = {
                    Name: "",
                    DeviceNo: "",
                    BusinessUnitID: 0,
                    // BaseID: 0,
                };
                //将Json数据中的数据值改成对应默认值，然后传入进去
                $("body").append($com.modal.show(DEFAULT_VALUEZace, KEYWORD1, "新增", function (rst) {
                    //调用插入函数 

                    if (!rst || $.isEmptyObject(rst))
                        return;

                    var _data = {
                        ApplyID: 0,
                        AssetID: 0,
                        BaseID: 0,
                        BusinessUnitID: 0,
                        DeviceLife: 0,
                        DeviceNo: rst.DeviceNo,
                        FactoryID: 1,
                        ID: 0,
                        LimitCount: 0,
                        LineID: 0,
                        ModelID: 0,
                        Name: rst.Name,
                        NetValue: 0,
                        PositionID: 0,
                        ScrapValue: 0,
                        Status: 0,
                        WorkShopID: 0,
                    };


                    model.com.add({
                        data: _data
                    }, function (res) {
                        model.com.add({
                            data: res.info
                        }, function (res) {
                            alert("新增成功");
                            model.com.refresh();
                        });
                    })

                }, TypeSource_Point1));

            });
            //跳转申请单
            $("body").delegate("#useSpare", "click", function () {
                var SelectData = $com.table.getSelectionData($(".lmvt-device-body"), "ID", DataAllOriginal);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                window.parent.useSpareID = SelectData[0].ID;
                var vdata = { 'header': '已装备件', 'id': 'UseSpare', 'href': './device_manage/useSpare.html', 'src': './static/images/menu/deviceManage/sparePart.png' };
                window.parent.iframeHeaderSet(vdata);
            });
            //跳转申请单
            $("body").delegate("#device_apply", "click", function () {
                var vdata = { 'header': '设备申请单', 'id': 'DeviceApplyList', 'href': './device_manage/deviceApplyList.html', 'src': './static/images/menu/deviceManage/deviceMaintainLog.png' };
                window.parent.iframeHeaderSet(vdata);

            });
            //跳转申请单
            $("body").delegate("#route", "click", function () {
                var vdata = { 'header': '流程图', 'id': 'Route', 'href': './route_act/route.html', 'src': './static/images/menu/deviceManage/deviceMaintainLog.png' };
                window.parent.iframeHeaderSet(vdata);

            });
            //跳转设备模型
            $("body").delegate("#device_model", "click", function () {
                var vdata = { 'header': '设备模型', 'id': 'DeviceInfo', 'href': './device_manage/deviceInfo.html', 'src': './static/images/menu/deviceManage/deviceInformation.png' };
                window.parent.iframeHeaderSet(vdata);
            });
            $("body").delegate("#all-recond", "click", function () {
                var vdata = { 'header': '设备使用记录', 'id': 'AllRecond', 'href': './device_manage/allRecond.html', 'src': './static/images/menu/deviceManage/sparePart.png' };
                window.parent.iframeHeaderSet(vdata);
            });
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
            //条件查询
            $("body").delegate("#lmvt-left-check", "click", function () {
                var default_value = {
                    BusinessUnitID: 0,
                    //                     FactoryID: 0,
                    //                     WorkShopID: 0,
                    //                     LineID: 0,
                    //                     ModelID: 0,
                }
                $("body").append($com.modal.show(default_value, KEYWORD1, "查询", function (rst) {
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    model.com.get({
                        ModelID: 0, ApplyID: 0,
                        WorkShopID: 0, LineID: 0, Status: 0,
                        BusinessUnitID: Number(rst.BusinessUnitID), BaseID: 0, FactoryID: 0,
                    }, function (res) {
                        if (!res)
                            return;
                        var list = res.list;
                        RanderData = res.list;
                        RanderData = $com.util.Clone(RanderData);
                        $.each(RanderData, function (i, item) {
                            for (var p in item) {
                                if (!Formattrt_Arrange[p])
                                    continue;
                                item[p] = Formattrt_Arrange[p](item[p]);
                            }
                            item.WID = i + 1;

                        });
                        $(".lmvt-device-body").html($com.util.template(RanderData, HTML.DeviceTemplate));
                        $(".lmvt-device-body tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });
                    });
                }, TypeSource_Point1));
            });
            $("body").delegate("#lmvt-left-check1", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE3, KEYWORD3, "查询", function (rst) {
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    model.com.getRecond({
                        DeviceLedgerID: DeviceLedgerID, Used: -1, StartTime: $com.util.format('yyyy-MM-dd ', rst.StartTime), EndTime: $com.util.format('yyyy-MM-dd ', rst.EndTime)
                    }, function (res) {
                        if (!res)
                            return;
                        var list = res.list;
                        for (var i = 0; i < list.length; i++) {
                            if (list[i].Used == 0)
                                list[i].Used = "是";
                            if (list[i].Used == 1)
                                list[i].Used = "否";

                            list[i].WID = i + 1;

                        }
                        $(".lmvt-supplier-body").html($com.util.template(list, HTML.DeviceSupplier));
                        $(".lmvt-supplier-body tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });

                        // $(".lmvt-supplier-body").html($com.util.template(RanderData1, HTML.DeviceSupplier));
                    });
                }, TypeSource_Point3));
            });
            //Enter触发模糊查询事件
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var value = $("#femi-search-text-ledger").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $(".lmvt-device-body").children("tr").show();
                    else
                        $com.table.filterByLikeString($(".lmvt-device-body"), DataAll, value, "ID");
                }
            });
            //模糊查询
            $("body").delegate("#lmvt-left-checkZace", "click", function () {
                var value = $("#femi-search-text-ledger").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $(".lmvt-device-body").children("tr").show();
                else
                    $com.table.filterByLikeString($(".lmvt-device-body"), DataAll, value, "ID");
            });
            //相关申请
            // $("body").delegate("#clear_apply", "click", function () {
            //     var SelectData = $com.table.getSelectionData($(".lmvt-device-body"), "ID", DataAllOriginal);
            //     if (!SelectData || !SelectData.length) {
            //         alert("请先选择一行数据再试！")
            //         return;
            //     }
            //     if (SelectData.length != 1) {
            //         alert("只能同时对一行数据修改！")
            //         return;
            //     }
            //     for (var i = 0; i < AllApply.length; i++) {
            //         if (AllApply[i].ID == SelectData[0].ApplyID) {
            //             var data = {
            //                 ApplyNo: AllApply[i].ApplyNo,
            //                 ModelID: AllApply[i].ModelID,
            //                 BusinessUnitID: AllApply[i].BusinessUnitID,
            //                 LineID: AllApply[i].LineID,
            //                 DeviceLedgerID: AllApply[i].DeviceLedgerID,
            //                 ApplicantID: AllApply[i].ApplicantID,
            //                 ApplicantTime: AllApply[i].ApplicantTime,
            //                 ApproverID: AllApply[i].ApproverID,
            //                 ApproverTime: AllApply[i].ApproverTime,
            //                 ConfirmID: AllApply[i].ConfirmID,
            //                 ConfirmTime: AllApply[i].ConfirmTime,
            //                 Status: AllApply[i].Status,
            //                 SpareNum: AllApply[i].SpareNum,
            //             }
            //         }
            //     }
            //     if (!data) {
            //         alert("未查询到相关申请！");
            //         return false;
            //     }
            //     for (var i = 0; i < AllUser.length; i++) {
            //         if (AllUser[i].ID == data.ApplicantID) {
            //             data.ApplicantID = AllUser[i].Name;
            //         }
            //         if (AllUser[i].ID == data.ApproverID) {
            //             data.ApproverID = AllUser[i].Name;
            //         }
            //         if (AllUser[i].ID == data.ConfirmID) {
            //             data.ConfirmID = AllUser[i].Name;
            //         }
            //     }
            //     for (var i = 0; i < AllBusinessUnit.length; i++) {
            //         if (AllBusinessUnit[i].ID == data.BusinessUnitID) {
            //             data.BusinessUnitID = AllBusinessUnit[i].Name;
            //         }
            //     }
            //     for (var i = 0; i < AllLine.length; i++) {
            //         if (AllLine[i].ID == data.AllLine) {
            //             data.AllLine = AllLine[i].Name;
            //         }
            //     }
            //     for (var d = 0; d < AllDeviceLedger.length; d++) {
            //         if (data.ModelID == AllDeviceLedger[d].ID) {
            //             data.ModelID = AllDeviceLedger[d].ModelNo;
            //             //TypeSource_Arrange.ModelID.push({ name: AllDeviceLedger[d].ModelNo, value: AllDeviceLedger[d].ID });
            //         }
            //     }
            //     $("#lmvt-header-title1").text("申请单(" + data.ApplyNo + ")");
            //     $(".iplant-tool-right").css("width", "300px");
            //     $(".lmvt-container-device").css("margin-right", "300px");
            //     $(".iplant-tool-right").show();
            //     $(".lmvt-container-supplier").hide();
            //     $(".lmvt-container-system").show();
            //     $com.propertyGrid.show($("#femi-tb-scroll"), data, KEYWORD, TypeSource_Point);
            //     $(".form-control").attr("readonly", "readonly");
            // });
            //修改
            $("body").delegate(".lmvt-reset", "click", function () {
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = RanderDataBasic.filter((item) => { return item.ID == wID });

                var default_value = {
                    Name: SelectData[0].Name,
                    DeviceNo: SelectData[0].DeviceNo,
                    BusinessUnitID: SelectData[0].BusinessUnitID,
                    // BaseID: SelectData[0].BaseID,
                    // FactoryID: SelectData[0].FactoryID,
                    WorkShopID: SelectData[0].WorkShopID,
                    LineID: SelectData[0].LineID,
                    ModelID: SelectData[0].ModelID,
                };
                $("body").append($com.modal.show(default_value, KEYWORD1, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].Name = rst.Name;
                    //SelectData[0].ScrapValue = SelectData[0].ScrapValue;
                    //SelectData[0].NetValue = SelectData[0].NetValue;
                    //SelectData[0].LimitCount = SelectData[0].LimitCount;
                    SelectData[0].DeviceNo = rst.DeviceNo;
                    SelectData[0].BusinessUnitID = Number(rst.BusinessUnitID);
                    // SelectData[0].BaseID = Number(rst.BaseID);
                    SelectData[0].WorkShopID = Number(rst.WorkShopID);
                    SelectData[0].LineID = Number(rst.LineID);
                    SelectData[0].ModelID = Number(rst.ModelID);
                    for (var i = 0; i < newDataAllOriginal.length; i++) {
                        if (SelectData[0].ID == newDataAllOriginal[i].ID) {
                            newDataAllOriginal.splice(i, 1);
                        }
                    }
                    for (var k = 0; k < newDataAllOriginal.length; k++) {
                        if (newDataAllOriginal[k].DeviceNo == SelectData[0].DeviceNo) {
                            alert("设备编码不能重复！");
                            return;
                        }
                    }
                    for (var i = 0; i < SelectData.length; i++) {
                        $com.util.deleteLowerProperty(SelectData[i]);
                    }
                    model.com.add({
                        data: SelectData[0]
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                    });
                }, TypeSource_Point1));
            });
            //显示使用记录
            $("body").delegate("#device_supplier", "click", function () {
                var SelectData = $com.table.getSelectionData($(".lmvt-device-body"), "ID", DataAllOriginal);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                $("#lmvt-header-title").text("使用记录(" + SelectData[0].DeviceNo + ")");
                $(".iplant-tool-right").css("width", "500px");
                $(".lmvt-container-device").css("margin-right", "500px");
                $(".iplant-tool-right").show();
                $(".lmvt-container-system").hide();
                $(".lmvt-container-supplier").show();
                model.com.refreshST(SelectData[0].ID);
            });
            //隐藏右边框
            $("body").delegate("#femi-back-property", "click", function () {
                if ($(".lmvt-container-device").is(":visible")) {
                    $(".lmvt-container-device").css("width", "100%");
                    $(".lmvt-container-propertyGrid").hide();
                }
                //lmvt - container - system
                if ($(".lmvt-container-system").is(":visible")) {
                    $(".lmvt-container-system").css("width", "100%");
                    $(".lmvt-container-propertyGrid").hide();
                }
                //lmvt - container - supplier
                if ($(".lmvt-container-supplier").is(":visible")) {
                    $(".lmvt-container-supplier").css("width", "100%");
                    $(".lmvt-container-propertyGrid").hide();
                }
            });
            //隐藏基本配置
            $("body").delegate("#femi-hide-property", "click", function () {
                $(".lmvt-container-device").css("margin-right", "0px");
                $(".iplant-tool-right").hide();
                $(".lmvt-container-system").hide();
            });
            $("body").delegate("#femi-hide-property1", "click", function () {
                $(".lmvt-container-device").css("margin-right", "0px");
                $(".iplant-tool-right").hide();
                $(".lmvt-container-supplier").hide();
            });
            //状态更改
            $("body").delegate("#active1", "click", function () {
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = RanderDataBasic.filter((item) => { return item.ID == wID });
                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                var index = 0;
                for (var i = 0; i < SelectData.length; i++) {
                    SelectData[i].SpareNo = SelectData[i].SpareNo;
                    SelectData[i].SpareLife = SelectData[i].SpareLife;
                    SelectData[i].ScrapValue = SelectData[i].ScrapValue;
                    SelectData[i].NetValue = SelectData[i].NetValue;
                    SelectData[i].LimitCount = SelectData[i].LimitCount;
                    SelectData[i].SpareNo = SelectData[i].SpareNo;
                    SelectData[i].BusinessUnitID = SelectData[i].BusinessUnitID;
                    SelectData[i].FactoryID = SelectData[i].FactoryID;
                    SelectData[i].WorkShopID = SelectData[i].WorkShopID;
                    SelectData[i].LineID = SelectData[i].LineID;
                    SelectData[i].ModelID = SelectData[i].ModelID;
                    SelectData[i].Status = 1;
                    model.com.add(
                        { data: SelectData[i] }
                        , function (res) {
                            if (index == SelectData.length - 1) {
                                alert("更改完成");
                                model.com.refresh();
                            }
                            index++;
                        })
                }
            });
            $("body").delegate("#active2", "click", function () {
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = RanderDataBasic.filter((item) => { return item.ID == wID });
                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                var index = 0;
                for (var i = 0; i < SelectData.length; i++) {
                    SelectData[i].SpareNo = SelectData[i].SpareNo;
                    SelectData[i].SpareLife = SelectData[i].SpareLife;
                    SelectData[i].ScrapValue = SelectData[i].ScrapValue;
                    SelectData[i].NetValue = SelectData[i].NetValue;
                    SelectData[i].LimitCount = SelectData[i].LimitCount;
                    SelectData[i].SpareNo = SelectData[i].SpareNo;
                    SelectData[i].BusinessUnitID = SelectData[i].BusinessUnitID;
                    SelectData[i].FactoryID = SelectData[i].FactoryID;
                    SelectData[i].WorkShopID = SelectData[i].WorkShopID;
                    SelectData[i].LineID = SelectData[i].LineID;
                    SelectData[i].ModelID = SelectData[i].ModelID;
                    SelectData[i].Status = 0;
                    model.com.add(
                        { data: SelectData[i] }
                        , function (res) {
                            if (index == SelectData.length - 1) {
                                alert("更改完成");
                                model.com.refresh();
                            }
                            index++;
                        })
                }
            });
            $("body").delegate("#active3", "click", function () {
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = RanderDataBasic.filter((item) => { return item.ID == wID });
                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                var index = 0;
                for (var i = 0; i < SelectData.length; i++) {
                    SelectData[i].SpareNo = SelectData[i].SpareNo;
                    SelectData[i].SpareLife = SelectData[i].SpareLife;
                    SelectData[i].ScrapValue = SelectData[i].ScrapValue;
                    SelectData[i].NetValue = SelectData[i].NetValue;
                    SelectData[i].LimitCount = SelectData[i].LimitCount;
                    SelectData[i].SpareNo = SelectData[i].SpareNo;
                    SelectData[i].BusinessUnitID = SelectData[i].BusinessUnitID;
                    SelectData[i].FactoryID = SelectData[i].FactoryID;
                    SelectData[i].WorkShopID = SelectData[i].WorkShopID;
                    SelectData[i].LineID = SelectData[i].LineID;
                    SelectData[i].ModelID = SelectData[i].ModelID;
                    SelectData[i].Status = 3;
                    model.com.add(
                        { data: SelectData[i] }
                        , function (res) {
                            if (index == SelectData.length - 1) {
                                alert("更改完成");
                                model.com.refresh();
                            }
                            index++;
                        })
                }
            });
            $("body").delegate("#active4", "click", function () {
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = RanderDataBasic.filter((item) => { return item.ID == wID });
                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                var index = 0;
                for (var i = 0; i < SelectData.length; i++) {
                    SelectData[i].SpareNo = SelectData[i].SpareNo;
                    SelectData[i].SpareLife = SelectData[i].SpareLife;
                    SelectData[i].ScrapValue = SelectData[i].ScrapValue;
                    SelectData[i].NetValue = SelectData[i].NetValue;
                    SelectData[i].LimitCount = SelectData[i].LimitCount;
                    SelectData[i].SpareNo = SelectData[i].SpareNo;
                    SelectData[i].BusinessUnitID = SelectData[i].BusinessUnitID;
                    SelectData[i].FactoryID = SelectData[i].FactoryID;
                    SelectData[i].WorkShopID = SelectData[i].WorkShopID;
                    SelectData[i].LineID = SelectData[i].LineID;
                    SelectData[i].ModelID = SelectData[i].ModelID;
                    SelectData[i].Status = 4;
                    model.com.add(
                        { data: SelectData[i] }
                        , function (res) {
                            if (index == SelectData.length - 1) {
                                alert("更改完成");
                                model.com.refresh();
                            }
                            index++;
                        })
                }
            });
            $("body").delegate("#active5", "click", function () {
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = RanderDataBasic.filter((item) => { return item.ID == wID });
                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                var index = 0;
                for (var i = 0; i < SelectData.length; i++) {
                    SelectData[i].SpareNo = SelectData[i].SpareNo;
                    SelectData[i].SpareLife = SelectData[i].SpareLife;
                    SelectData[i].ScrapValue = SelectData[i].ScrapValue;
                    SelectData[i].NetValue = SelectData[i].NetValue;
                    SelectData[i].LimitCount = SelectData[i].LimitCount;
                    SelectData[i].SpareNo = SelectData[i].SpareNo;
                    SelectData[i].BusinessUnitID = SelectData[i].BusinessUnitID;
                    SelectData[i].FactoryID = SelectData[i].FactoryID;
                    SelectData[i].WorkShopID = SelectData[i].WorkShopID;
                    SelectData[i].LineID = SelectData[i].LineID;
                    SelectData[i].ModelID = SelectData[i].ModelID;
                    SelectData[i].Status = 5;
                    model.com.add(
                        { data: SelectData[i] }
                        , function (res) {
                            if (index == SelectData.length - 1) {
                                alert("更改完成");
                                model.com.refresh();
                            }
                            index++;
                        })
                }
            });
            //device_refresh
            $("body").delegate("#device_refresh", "click", function () {
                model.com.load();
                // alert("刷新成功");
            });
        },

        run: function () {


            model.com.load();
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
            //设备台账
            get: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceLedger/All",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getRecond: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceUsedRecord/All",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //备件记录
            getSupplier: function (data, fn, context) {
                //var d = {
                //    $URI: "/Device/All",
                //    $TYPE: "get"
                //};

                //function err() {
                //    $com.app.tip('获取失败，请检查网络');
                //}

                //$com.app.ajax($.extend(d, data), fn, err, context);
                //fn(DATA);
                fn({ list: DATA2 });


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
                $com.app.loading('数据加载中...');
                model.com.get({
                    ModelID: 0, WorkShopID: 0, LineID: 0,
                    BusinessUnitID: 0, BaseID: 0, FactoryID: 0,
                    ApplyID: 0, Type: 1
                }, function (res) {
                    if (!res)
                        return;
                    var list = res.list,
                        rst = [];

                    RanderData = res.list;
                    RanderDataBasic = $com.util.Clone(RanderData);
                    RanderData = $com.util.Clone(RanderData);
                    // model.com.getStoreHouseList({ 'ID': -1, 'Active': -1 }, function (resStore) {
                    //     if (!resStore)
                    //         return;
                    //     StoreHouseList = resStore.list;
                    //     for (var i = 0; i < StoreHouseList.length; i++) {
                    //         TypeSource_Arrange.BaseID.push({ name: StoreHouseList[i].Name, value: StoreHouseList[i].ID });
                    //     }
                    for (var i = 0; i < RanderData.length; i++) {
                        for (var j = 0; j < AllUser.length; j++) {
                            if (RanderData[i].OperatorID == AllUser[j].ID) {
                                TypeSource_Arrange.OperatorID.push({ name: AllUser[j].Name, value: AllUser[j].ID });
                            }

                        }
                        for (var m = 0; m < AllBusinessUnit.length; m++) {
                            if (RanderData[i].BusinessUnitID == AllBusinessUnit[m].ID) {
                                TypeSource_Arrange.BusinessUnitID.push({ name: AllBusinessUnit[m].Name, value: AllBusinessUnit[m].ID });
                            }
                        }
                        //for (var n = 0; n < AllFactory.length; n++) {
                        //    if (RanderData[i].FactoryID == AllFactory[n].ID) {
                        //        TypeSource_Arrange.FactoryID.push({ name: AllFactory[n].Name, value: AllFactory[n].ID });
                        //    }
                        //}
                        for (var a = 0; a < AllWorkShop.length; a++) {
                            if (RanderData[i].WorkShopID == AllWorkShop[a].ID) {
                                TypeSource_Arrange.WorkShopID.push({ name: AllWorkShop[a].Name, value: AllWorkShop[a].ID });
                            }
                        }
                        for (var b = 0; b < AllLine.length; b++) {
                            if (RanderData[i].LineID == AllLine[b].ID) {
                                TypeSource_Arrange.LineID.push({ name: AllLine[b].Name, value: AllLine[b].ID });
                            }
                        }
                        //for (var c = 0; c < AllDeviceLedger.length; c++) {
                        //    //if (RanderData[i].DeviceLedgerID == AllDeviceLedger[c].ID) {
                        //    //    TypeSource_Arrange.DeviceLedgerID.push({ name: AllDeviceLedger[c].DeviceNo, value: AllDeviceLedger[c].ID });
                        //    //}
                        //}
                        for (var d = 0; d < AllDeviceLedger.length; d++) {
                            if (RanderData[i].ModelID == AllDeviceLedger[d].ID) {
                                TypeSource_Arrange.ModelID.push({ name: AllDeviceLedger[d].ModelNo, value: AllDeviceLedger[d].ID });
                            }
                        }
                        // for (var e = 0; e < AllApply.length; e++) {
                        //     if (RanderData[i].ApplyID == AllApply[e].ID) {
                        //         TypeSource_Arrange.ApplyID.push({ name: AllApply[e].ApplyNo, value: AllApply[e].ID });
                        //     }
                        // }
                    }

                    $.each(RanderData, function (i, item) {
                        item.Badge = " ";

                        if (item.Status == 0) {
                            item.ISAllowedText = "封存";
                            item.ISAllowed = "lmvt-allowed-delete";
                            item.ClassBadge = "lmvt-defBadge";
                        } else if (item.Status == 1) {
                            item.ISAllowedText = "启用";
                            item.ISAllowed = "lmvt-do-active";
                            item.ClassBadge = "lmvt-activeBadge";
                        } else if (item.Status == 3) {
                            item.ISAllowedText = "维修";
                            item.ISAllowed = "lmvt-do-warning";
                            item.ClassBadge = "lmvt-warningBadge";
                        } else if (item.Status == 4) {
                            item.ISAllowedText = "保养";
                            item.ISAllowed = "lmvt-do-warning";
                            item.ClassBadge = "lmvt-warningBadge";
                        } else if (item.Status == 5) {
                            item.ISAllowedText = "报废";
                            item.ISAllowed = "lmvt-do-delete";
                            item.ClassBadge = "lmvt-defBadge";
                        }
                        for (var p in item) {
                            if (!Formattrt_Arrange[p])
                                continue;
                            item[p] = Formattrt_Arrange[p](item[p]);
                        }
                        item.WID = i + 1;
                    });
                    $(".lmvt-device-body").html($com.util.template(RanderData, HTML.DeviceTemplate));
                    $com.app.loaded();
                    //$page.getPage(RanderData, ".lmvt-device-body", HTML.DeviceTemplate, ".table-part");
                    $(".lmvt-device-body tr").each(function (i, item) {
                        var $this = $(this);
                        var colorName = $this.css("background-color");
                        $this.attr("data-color", colorName);



                    });
                    DataAllOriginal = list;//原始数据
                    newDataAllOriginal = $com.util.Clone(DataAllOriginal);
                    DataAll = RanderData;
                });

                // });

                //});
            },
            refreshST: function (ID) {
                $com.app.loading('数据加载中...');
                model.com.getRecond({
                    DeviceLedgerID: ID, Used: -1,
                }, function (res) {
                    if (!res)
                        return;
                    var list = res.list;
                    DeviceLedgerID = ID;
                    for (var i = 0; i < list.length; i++) {
                        TypeSource_Point3.DeviceNo.push({ name: list[i].DeviceNo, value: list[i].DeviceLedgerID });
                    }
                    RanderData1 = res.list;
                    for (var i = 0; i < RanderData1.length; i++) {
                        RanderData1[i].StartTime = $com.util.format("yyyy-MM-dd hh:mm:ss", RanderData1[i].StartTime);
                        RanderData1[i].EndTime = $com.util.format("yyyy-MM-dd hh:mm:ss", RanderData1[i].EndTime);
                        if (RanderData1[i].Used == 0)
                            RanderData1[i].Used = "是";
                        if (RanderData1[i].Used == 1)
                            RanderData1[i].Used = "否";

                        RanderData1[i].WID = i + 1;
                    }
                    $(".lmvt-supplier-body").html($com.util.template(RanderData1, HTML.DeviceSupplier));
                    // $page.getPage(RanderData1, ".lmvt-supplier-body", HTML.DeviceSupplier, ".table-part");
                    $com.app.loaded();
                    $(".lmvt-supplier-body tr").each(function (i, item) {
                        var $this = $(this);
                        var colorName = $this.css("background-color");
                        $this.attr("data-color", colorName);



                    });
                    DataAll2 = list;
                });
            },
            load: function () {

                AllUser = window.parent._UserAll;


                model.com.getBusinessUnit({

                }, function (res) {
                    if (!res)
                        return;
                    var list = res.list;
                    AllBusinessUnit = res.list;
                    for (var i = 0; i < list.length; i++) {
                        TypeSource_Point1.BusinessUnitID.push({ name: list[i].Name, value: list[i].ID, far: 0 });
                    }
                    //model.com.getFMCFactory({
                    //    OAGetType: 0
                    //}, function (res2) {
                    //    if (!res2)
                    //        return;
                    //    var list = res2.list;
                    //    AllFactory = res2.list;
                    //    for (var i = 0; i < list.length; i++) {
                    //        TypeSource_Point1.FactoryID.push({ name: list[i].Name, value: list[i].ID, far: 0 });
                    //    }
                    model.com.getFMCWorkShop({
                        FactoryID: 0, BusinessUnitID: 0, OAGetType: 0
                    }, function (res3) {
                        if (!res3)
                            return;
                        var list = res3.list;
                        AllWorkShop = res3.list;
                        for (var i = 0; i < list.length; i++) {
                            TypeSource_Point1.WorkShopID.push({ name: list[i].Name, value: list[i].ID, far: list[i].BusinessUnitID });
                        }
                        model.com.getFMCLine({
                            FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0, OAGetType: 0
                        }, function (res4) {
                            if (!res4)
                                return;
                            var list = res4.list;
                            AllLine = res4.list;
                            for (var i = 0; i < list.length; i++) {
                                TypeSource_Point1.LineID.push({ name: list[i].Name, value: list[i].ID, far: list[i].WorkShopID });
                            }
                            model.com.getDevice({
                                DeviceWorkType: 0, SupplierID: 0, ModelPropertyID: 0,
                                SystemID: 0, SystemPropertyID: 0, ControllerID: 0,
                                ControllerPropertyID: 0, Active: -1, SupplierModelNo: "",
                                SystemVersion: "", ControllerModel: "", Type: 1
                            }, function (res) {
                                if (!res)
                                    return;
                                var list1 = res.list;
                                AllDeviceLedger = res.list;
                                for (var i = 0; i < list1.length; i++) {
                                    //TypeSource_Point1.DeviceLedgerID.push({ name: list1[i].DeviceNo, value: list1[i].ID, far: list1[i].LineID });
                                    TypeSource_Point1.ModelID.push({ name: list1[i].ModelNo, value: list1[i].ID });
                                }
                                model.com.getSpare({
                                    SpareWorkType: 0, SupplierID: 0, ModelPropertyID: 0,
                                    SupplierModelNo: "", Active: -1
                                }, function (res) {
                                    if (!res)
                                        return;
                                    var list = res.list;
                                    AllModelID = res.list;
                                    for (var i = 0; i < list.length; i++) {
                                        // TypeSource_Point1.ModelID.push({ name: list[i].ModelNo, value: list[i].ID });
                                    }
                                    // model.com.getStoreHouseList({ 'ID': -1, 'Active': -1 }, function (resStore) {
                                    //     if (!resStore)
                                    //         return;
                                    //     StoreHouseList = resStore.list;
                                    // for (var i = 0; i < StoreHouseList.length; i++) {
                                    //     TypeSource_Point1.BaseID.push({ name: StoreHouseList[i].Name, value: StoreHouseList[i].ID });
                                    // }
                                    // model.com.getApply({
                                    //     ModelID: 0, ApplicantID: 0, ApproverID: 0,
                                    //     ConfirmID: 0, WorkShopID: 0, LineID: 0, OAGetType: 0,
                                    //     BusinessUnitID: 0, BaseID: 0, FactoryID: 0,
                                    // }, function (res) {
                                    //     if (!res)
                                    //         return;
                                    //     var list = res.list;
                                    //     AllApply = res.list;
                                    model.com.refresh();
                                    //if (BOOL == true) {
                                    //    model.com.refreshA();
                                    //    BOOL = false;
                                    //}
                                });
                                // });

                                // });
                            });
                        });
                    });

                });
            },
            //添加
            add: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceLedger/Update",
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
            },
            //所有设备
            getDevice: function (data, fn, context) {
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
            //"BusinessUnitID|所属部门|",
            getBusinessUnit: function (data, fn, context) {
                var d = {
                    $URI: "/Department/AllDepartment",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //"BaseID|所属生产基地|",
            getFMCStation: function (data, fn, context) {
                var d = {
                    $URI: "/User/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //"FactoryID|生产基地下的工厂|",
            getFMCFactory: function (data, fn, context) {
                var d = {
                    $URI: "/FMCFactory/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //"WorkShopID|车间|",
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
            //"LineID|产线|",
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
            // getApply: function (data, fn, context) {
            //     var d = {
            //         $URI: "/DeviceLedgerApply/All",
            //         $TYPE: "get"
            //     };

            //     function err() {
            //         $com.app.tip('获取失败，请检查网络');
            //     }

            //     $com.app.ajax($.extend(d, data), fn, err, context);
            // },
            // //获取库位列表
            // getStoreHouseList: function (data, fn, context) {
            //     var d = {
            //         $URI: "/LFS/StoreHouseAll",
            //         $TYPE: "Get",
            //         $SERVER: "/MESLFS"
            //     };

            //     function err() {
            //         $com.app.tip('获取库位列表失败，请检查网络!');
            //     }

            //     $com.app.ajax($.extend(d, data), fn, err, context);
            // },
        }
    });

    model.init();


});