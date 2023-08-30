require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($zace, $com) {

    var KEYWORD_Level_LIST,
        KEYWORD_Level,
        FORMATTRT_Level,
        DEFAULT_VALUE_Level,
        TypeSource_Level,
		model,
        DataConfigAll,
        DataConfigBasic,
        DataConfigSearch,
        HTML,
        DataConfigRun,
        mid,
        DSType,
        DataConfig,
        KEYWORD_TimeConfig_LIST,
        KEYWORD_TimeConfig,
        FORMATTRT_TimeConfig,
        LinkManTemp,
        TypeSource_TimeConfig,

        KEYWORD_RunConfig_LIST,
        KEYWORD_RunConfig,
        FORMATTRT_RunConfig,
        TypeSource_RunConfig,


        KEYWORD_TaskConfig_LIST,
        KEYWORD_TaskConfig,
        FORMATTRT_TaskConfig,
        TypeSource_TaskConfig,

        KEYWORD_Device_LIST_Item,
        KEYWORD_Device_Item,
        FORMATTRT_Device_Item,
        TypeSource_Device_Item,
        DATAPointCheckList,
        DATARepairList,
        DATAMaintainList,
        ZHTemp,
        DataAll,
        DataAllSearch,
        DATAMPRSearch,
        SDate,
        EDate,
        DATABasic;
    DSType = 1;
    ZHTemp = {
        ItemID: 0,
        Name: "",
        CareItems: [],
        BYComment: "",
        Result: true,
        JGComment: "",
        Reason: "",
    };
    DATAPointCheckList = DATARepairList = DATAMaintainList = [];
    DataConfig = DataConfigRun = {};
    DATAMPRSearch = [];
    HTML = {
        TableWarnMode: [
				'<tr data-color="">',
				'<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
                '<td data-title="ModelNo" data-value="{{ModelNo}}" >{{ModelNo}}</td>',
                '<td data-title="WorkType" data-value="{{WorkType}}" >{{WorkType}}</td>',
                '<td data-title="SupplierName" data-value="{{SupplierName}}" >{{SupplierName}}</td>',
               '<td data-title="SupplierModelNo" data-value="{{SupplierModelNo}}" >{{SupplierModelNo}}</td>',
                '<td data-title="NeedNum" data-value="{{NeedNum}}" >{{NeedNum}}</td>',
                '<td data-title="StockNum" data-value="{{StockNum}}" >{{StockNum}}</td>',
                  '<td data-title="WarningInterval" data-value="{{WarningInterval}}" >{{WarningInterval}}</td>',
                '<td data-title="WarningTime" data-value="{{WarningTime}}" >{{WarningTime}}</td>',
                 '<td data-title="ReplaceOptions" data-value="{{ReplaceOptions}}" >{{ReplaceOptions}}</td>',
                '<td data-title="ReplaceMinTime" data-value="{{ReplaceMinTime}}" >{{ReplaceMinTime}}</td>',
                '<td data-title="DSType" data-value="{{DSType}}" >{{DSType}}</td>',
                '<td data-title="Active" data-value="{{Active}}" >{{Active}}</td>',

				'</tr>',
        ].join(""),

        TableApplyMode: [
              '<tr data-color="">',
              '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
              '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
              '<td data-title="ApplyNo" data-value="{{ApplyNo}}" >{{ApplyNo}}</td>',
              '<td data-title="ModelID" data-value="{{ModelID}}" >{{ModelID}}</td>',
              '<td data-title="LedgerID" data-value="{{LedgerID}}" >{{LedgerID}}</td>',
              '<td data-title="TypeID" data-value="{{TypeID}}" >{{TypeID}}</td>',
               '<td data-title="Reason" data-value="{{Reason}}" >{{Reason}}</td>',
              '<td data-title="TaskTime" data-value="{{TaskTime}}" >{{TaskTime}}</td>',
              '<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',
              '<td data-title="ApplicantID" data-value="{{ApplicantID}}" >{{ApplicantID}}</td>',
              '<td data-title="ApplicantTime" data-value="{{ApplicantTime}}" >{{ApplicantTime}}</td>',
              // '<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
              '</tr>',
        ].join(""),

        TableSetMode: [
				'<tr data-color="">',
				'<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                //'<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
				'<td data-title="DeviceMaintain" data-value="{{DeviceMaintain}}" >{{DeviceMaintain}}</td>',
				'<td data-title="SpareMaintain" data-value="{{SpareMaintain}}" >{{SpareMaintain}}</td>',
				'<td data-title="DeviceCheck" data-value="{{DeviceCheck}}" >{{DeviceCheck}}</td>',
				'<td data-title="DeviceRepair" data-value="{{DeviceRepair}}" >{{DeviceRepair}}</td>',
                '<td data-title="SpareRepair" data-value="{{SpareRepair}}" >{{SpareRepair}}</td>',
				'<td data-title="DeviceLedger" data-value="{{DeviceLedger}}" >{{DeviceLedger}}</td>',
				'<td data-title="SpareLedger" data-value="{{SpareLedger}}" >{{SpareLedger}}</td>',

				'</tr>',
        ].join(""),

        TableNode_Item: [
         '<tr data-color="">',
         '<td style="width: 3px"><input type="checkbox"', 'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
           '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td>',
        '<td style="min-width: 50px" data-title="Name" data-value="{{Name}}">{{Name}}</td>',
         '<td style="min-width: 50px" data-title="SecondTime" data-value="{{SecondTime}}">{{SecondTime}}</td>',
          '<td style="min-width: 50px" data-title="Comment" data-value="{{Comment}}">{{Comment}}</td>',
        '<td style="min-width: 50px" data-title="Times" data-value="{{Times}}">{{Times}}</td>',


       '</tr>',
        ].join(""),

    }
    //库存预警查询
    $(function () {
        KEYWORD_Level_LIST = [
         "WorkType|加工类型|ArrayOne",
          "ReplaceOptions|需替换设备|ArrayOne",
          "DSType|类别|ArrayOne",
          "Active|激活|ArrayOne",
          "Stime|开始时间|DateTime",
          "Etime|结束时间|DateTime",
        ];
        KEYWORD_Level = {};
        FORMATTRT_Level = {};


        TypeSource_Level = {
            Active: [
                {
                    name: "禁用",
                    value: 0
                },
                 {
                     name: "激活",
                     value: 1
                 }
            ],
            DSType: [
              {
                  name: "设备",
                  value: 1
              },
               {
                   name: "备件",
                   value: 2
               }
            ],
            WorkType: [],
            ReplaceOptions: [],

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
    });
    //时间配置
    $(function () {
        KEYWORD_TimeConfig_LIST = [
         "DeviceMaintain|设备保养申请超时",
         "SpareMaintain|备件保养申请超时",
         "DeviceCheck|设备点检申请超时",
         "DeviceRepair|设备维修申请超时",
         "SpareRepair|备件维修申请超时",
         "DeviceLedger|设备台账申请超时",
         "SpareLedger|备件台账申请超时",
        ];
        KEYWORD_TimeConfig = {};
        FORMATTRT_TimeConfig = {};

        TypeSource_TimeConfig = {

        };

        $.each(KEYWORD_TimeConfig_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD_TimeConfig[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_TimeConfig[detail[0]] = $com.util.getFormatter(TypeSource_TimeConfig, detail[0], detail[2]);
            }
        });
    });

    //运行配置
    $(function () {
        KEYWORD_RunConfig_LIST = [
         "DeviceCheck|设备点检刷新频率",
         "DeviceMaintain|设备保养刷新频率",
         "DeviceRepair|设备维修刷新频率",
         "DeviceWarning|设备预警刷新频率",
         "SpareMaintain|备件保养刷新频率",
         "SpareRepair|备件维修刷新频率",
         "SpareWarning|备件预警刷新频率",
        ];
        KEYWORD_RunConfig = {};
        FORMATTRT_RunConfig = {};

        TypeSource_RunConfig = {

        };

        $.each(KEYWORD_RunConfig_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD_RunConfig[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_RunConfig[detail[0]] = $com.util.getFormatter(TypeSource_RunConfig, detail[0], detail[2]);
            }
        });
    });

    //任务时间配置
    $(function () {
        KEYWORD_TaskConfig_LIST = [
         "ModelID|设备|ArrayOne",
          "Reason|理由",
         "TaskTime|任务时间|DateTime",
         "LedgerID|设备台账|ArrayOne",
         "TypeID|类型|ArrayOne",
         "ApplicantID|申请人|ArrayOne",
          "Status|状态|ArrayOne",
        ];
        KEYWORD_TaskConfig = {};
        FORMATTRT_TaskConfig = {};

        TypeSource_TaskConfig = {
            ModelID: [
            {
                name: "无",
                value: 0
            }],
            LedgerID: [{
                name: "无",
                value: 0
            }],
            TypeID: [{
                name: "无",
                value: 0
            }],
            ApplicantID: [{
                name: "无",
                value: 0
            }],

            Status: [{
                name: "默认",
                value: 0
            }, {
                name: "待审核",
                value: 1
            }, {
                name: "已撤销",
                value: 2
            }, {
                name: "已审核",
                value: 3
            }, {
                name: "已驳回",
                value: 4
            }, {
                name: "已确认",
                value: 5
            }],
        };

        $.each(KEYWORD_TaskConfig_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD_TaskConfig[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_TaskConfig[detail[0]] = $com.util.getFormatter(TypeSource_TaskConfig, detail[0], detail[2]);
            }
        });
    });

    //详情
    $(function () {
        KEYWORD_Device_LIST_Item = [
         "ItemID|保养项编号",
         "Name|保养项名称",
         "CareItems|注意事项",
         "BYComment|保养项备注",
         "Result|结果|ArrayOne",
         "JGComment|结果备注",
         "Reason|原因",


        ];
        KEYWORD_Device_Item = {};
        FORMATTRT_Device_Item = {};

        TypeSource_Device_Item = {
            Result: [{
                name: "合格",
                value: true
            }, {
                name: "不合格",
                value: false
            }],
        };


        $.each(KEYWORD_Device_LIST_Item, function (x, item) {
            var detail = item.split("|");
            KEYWORD_Device_Item[detail[0]] = {
                index: x,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_Device_Item[detail[0]] = $com.util.getFormatter(TypeSource_Device_Item, detail[0], detail[2]);
            }
        });
    });

    model = $com.Model.create({
        name: '设备预警',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {


            //模糊查询
            $("body").delegate("#zace-search-warning", "change", function () {
                var $this = $(this),
					value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-warning-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-warning-tbody"), DataConfigSearch, value, "ID");
            });
            //条件查询
            $("body").delegate("#zace-search-warningZ", "click", function () {
                var default_value = {
                    DSType: 0,
                    Stime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                    Etime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date())
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    DSType = Number(rst.DSType);
                    SDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.Stime));
                    EDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.Etime));
                    model.com.refresh();


                }, TypeSource_Level));


            });


            //审批
            $("body").delegate("#zace-up-level", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-riskApplyLevel-tbody"), "ID", DATAMPR);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！")
                    return;
                }
                if (SelectData[0].Status != 1) {
                    alert("请选择待审核的数据！");
                    return false;
                }
                var default_value = {
                    Reason: SelectData[0].Reason,
                    TaskTime: SelectData[0].TaskTime,

                };


                $("body").append($com.modal.show(default_value, KEYWORD_TaskConfig, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    SelectData[0].Reason = rst.Reason;
                    SelectData[0].TaskTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.TaskTime));
                    SelectData[0].Status = 3;

                    if (SelectData[0].MRPID == 1) {

                        model.com.postDeviceMaintainApply({
                            data: SelectData[0]
                        }, function (res) {
                            alert("审批成功");
                            model.com.refresh();
                        })

                    } else if (SelectData[0].MRPID == 2) {

                        model.com.postDevicePointCheckApply({
                            data: SelectData[0]
                        }, function (res) {
                            alert("审批成功");
                            model.com.refresh();
                        })

                    } else {

                        model.com.postDeviceRepairApply({
                            data: SelectData[0]
                        }, function (res) {
                            alert("审批成功");
                            model.com.refresh();
                        })
                    }



                }, TypeSource_TaskConfig));
            });

            //驳回
            $("body").delegate("#zace-return-level", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-riskApplyLevel-tbody"), "ID", DATAMPR);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！")
                    return;
                }
                if (SelectData[0].Status != 3) {
                    alert("请选择状态为已审核的数据!");
                    return false;
                }
                var default_value = {
                    Reason: SelectData[0].Reason,
                    //TaskTime: SelectData[0].TaskTime,

                };


                $("body").append($com.modal.show(default_value, KEYWORD_TaskConfig, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    SelectData[0].Reason = rst.Reason;
                    //SelectData[0].TaskTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.TaskTime));
                    SelectData[0].Status = 4;

                    if (SelectData[0].MRPID == 1) {

                        model.com.postDeviceMaintainApply({
                            data: SelectData[0]
                        }, function (res) {
                            alert("驳回成功");
                            model.com.refresh();
                        })

                    } else if (SelectData[0].MRPID == 2) {

                        model.com.postDevicePointCheckApply({
                            data: SelectData[0]
                        }, function (res) {
                            alert("驳回成功");
                            model.com.refresh();
                        })

                    } else {

                        model.com.postDeviceRepairApply({
                            data: SelectData[0]
                        }, function (res) {
                            alert("驳回成功");
                            model.com.refresh();
                        })
                    }



                }, TypeSource_TaskConfig));
            });
            //任务时间配置  结果详情
            $("body").delegate("#zace-result-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskApplyLevel-tbody"), "ID", DATAMPR);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }

                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！")
                    return;
                }
                if (SelectData[0].MRPID == 1) {

                    model.com.refreshRightM(SelectData[0]);

                } else if (SelectData[0].MRPID == 2) {

                    model.com.refreshRightP(SelectData[0]);

                } else {

                    model.com.refreshRightR(SelectData[0]);
                }

                $(".zzzc").hide();
                $(".zzzRunSet").hide();
                $(".zzzTimeSet").hide();
                $(".zzzm").css("margin-right", "400px");
                $(".zzzn").css("width", "400px");
                $(".zzzn").show();
                $(".zzzm").show();

                //$("body").append($com.propertyGrid.show($(".zace-timeSet-show"), DataConfig, KEYWORD_TimeConfig, TypeSource_TimeConfig));

            });

            //任务时间模糊查询
            $("body").delegate("#zace-search-level", "change", function () {
                var $this = $(this),
					value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskApplyLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskApplyLevel-tbody"), DATAMPRSearch, value, "ID");
            });
            //任务时间 条件查询
            $("body").delegate("#zace-searchQuery-level", "click", function () {
                var default_value = {
                    //  ApplyNo: "",
                    ModelID: 0,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_TaskConfig, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    //default_value.ApplyNo = rst.ApplyNo;
                    default_value.ModelID = Number(rst.ModelID);

                    $com.table.filterByConndition($("#femi-riskApplyLevel-tbody"), DATAMPR, default_value, "ID");

                }, TypeSource_TaskConfig));


            });
            //配置 
            $("body").delegate("#zace-open-TaskwarningZ", "click", function () {
                $(".zzzc").hide();

                $(".zzzm").css("margin-right", "0px");
                $(".zzzRunSet").css("width", "0px");
                $(".zzzTimeSet").css("width", "0px");
                $(".zzzn").css("width", "0px");
                $(".zzzn").hide();
                $(".zzzTimeSet").hide();
                $(".zzzm").show();
                $(".zzzRunSet").hide();
            });
            //库存预警 
            $("body").delegate("#zace-return-configSet", "click", function () {
                $(".zzzTimeSet").hide();
                $(".zzzRunSet").hide();
                $(".zzzm").hide();
                $(".zzzn").hide();
                $(".zzzc").show();
            });

            //运行 配置
            $("body").delegate("#zace-open-runSet", "click", function () {


                $(".zzzc").hide();
                $(".zzzn").hide();
                $(".zzzTimeSet").hide();
                $(".zzzm").css("margin-right", "400px");
                $(".zzzRunSet").css("width", "400px");
                $(".zzzRunSet").show();
                $(".zzzm").show();
            });

            //时间配置
            $("body").delegate("#zace-open-timeSet", "click", function () {
                $(".zzzc").hide();
                $(".zzzn").hide();
                $(".zzzRunSet").hide();
                $(".zzzm").css("margin-right", "400px");
                $(".zzzTimeSet").css("width", "400px");
                $(".zzzTimeSet").show();
                $(".zzzm").show();
            });


            //隐藏 配置
            $("body").delegate("#zace-closePart-level", "click", function () {
                $(".zzzc").hide();
                $(".zzzRunSet").hide();
                $(".zzzTimeSet").hide();
                $(".zzzm").css("margin-right", "0px");
                $(".zzzn").css("width", "0px");
                $(".zzzm").show();
                $(".zzzn").hide();
            });

            //隐藏 配置
            $("body").delegate("#zace-closeTimeSet-level", "click", function () {
                $(".zzzc").hide();
                $(".zzzRunSet").hide();
                $(".zzzn").hide();
                $(".zzzm").css("margin-right", "0px");
                $(".zzzTimeSet").css("width", "0px");
                $(".zzzm").show();
                $(".zzzTimeSet").hide();
            });

            //隐藏 配置
            $("body").delegate("#zace-closeRunSet-level", "click", function () {
                $(".zzzc").hide();
                $(".zzzn").hide();
                $(".zzzTimeSet").hide();
                $(".zzzm").css("margin-right", "0px");
                $(".zzzRunSet").css("width", "0px");
                $(".zzzm").show();
                $(".zzzRunSet").hide();
            });

            //保存运行配置
            $("body").delegate("#zace-saved-RunTime", "click", function () {
                var suc = $com.propertyGrid.getData($(".zace-runSet-show"));
                var _data = suc.data;
                var xDeviceCheck = String(_data.DeviceCheck).indexOf(".") + 1;//获取小数点的位置
                var xDeviceMaintain = String(_data.DeviceMaintain).indexOf(".") + 1;//获取小数点的位置
                var xDeviceRepair = String(_data.DeviceRepair).indexOf(".") + 1;//获取小数点的位置
                var xDeviceWarning = String(_data.DeviceWarning).indexOf(".") + 1;//获取小数点的位置
                var xSpareMaintain = String(_data.SpareMaintain).indexOf(".") + 1;//获取小数点的位置
                var xSpareRepair = String(_data.SpareRepair).indexOf(".") + 1;//获取小数点的位置
                var xSpareWarning = String(_data.SpareWarning).indexOf(".") + 1;//获取小数点的位置

                if (xDeviceCheck > 0 || xDeviceMaintain > 0 || xDeviceRepair || xDeviceWarning || xSpareMaintain || xSpareRepair || xSpareWarning) {
                    alert("请输入整数！");
                    return false;
                }

                model.com.postConfigSet({
                    data: _data
                }, function (res) {
                    alert("保存成功");
                    model.com.refresh();
                })


            });

            //保存时间配置
            $("body").delegate("#zace-saved-TimeSet", "click", function () {

                var suc = $com.propertyGrid.getData($(".zace-timeSet-show"));
                var _data = suc.data;
                var xDeviceMaintain = String(_data.DeviceMaintain).indexOf(".") + 1;//获取小数点的位置
                var xSpareMaintain = String(_data.SpareMaintain).indexOf(".") + 1;//获取小数点的位置
                var xDeviceCheck = String(_data.DeviceCheck).indexOf(".") + 1;//获取小数点的位置
                var xDeviceRepair = String(_data.DeviceRepair).indexOf(".") + 1;//获取小数点的位置
                var xSpareRepair = String(_data.SpareRepair).indexOf(".") + 1;//获取小数点的位置
                var xDeviceLedger = String(_data.DeviceLedger).indexOf(".") + 1;//获取小数点的位置
                var xSpareLedger = String(_data.SpareLedger).indexOf(".") + 1;//获取小数点的位置

                if (xDeviceMaintain > 0 || xSpareMaintain > 0 || xDeviceCheck || xDeviceRepair || xSpareRepair || xDeviceLedger || xSpareLedger) {
                    alert("请输入整数！");
                    return false;
                }

                model.com.postTime({
                    data: _data
                }, function (res) {
                    alert("保存成功");
                    model.com.refresh();
                })


            });


        },




        run: function () {
            model.com.getDevicePointCheckItem({ ModelID: -1, Name: "", Active: -1, StartTime: "2000-04-26 19:15:19", EndTime: "5029-05-5 10:15:19" }, function (resItem) {
                if (!resItem)
                    return;
                if (resItem && resItem.list) {
                    DATAPointCheckList = resItem.list;
                }
            });

            model.com.getDeviceRepairItem({ ModelID: -1, Name: "", DSType: 0, Active: -1, StartTime: "2000-04-26 19:15:19", EndTime: "5029-05-5 10:15:19" }, function (resItem) {
                if (!resItem)
                    return;
                if (resItem && resItem.list) {
                    DATARepairList = $com.util.Clone(resItem.list);
                }
            });
            model.com.getDeviceMaintainItem({ ModelID: -1, Name: "", DSType: 0, Active: -1, StartTime: "2000-04-26 19:15:19", EndTime: "5029-05-5 10:15:19" }, function (resItem) {
                if (!resItem)
                    return;
                if (resItem && resItem.list) {
                    DATAMaintainList = $com.util.Clone(resItem.list);
                }
            });
            model.com.getDeviceRepairType({ ModelID: -1, Name: "", DSType: 0, Active: -1, StartTime: "2019-04-10 15:38:29", EndTime: "2029-05-10 15:38:29" }, function (res2) {
                $.each(res2.list, function (i, item) {
                    TypeSource_TaskConfig.TypeID.push({
                        name: item.Name,
                        value: item.ID,
                        far: null
                    })
                });
                model.com.getDeviceLedger({ ModelID: -1, WorkShopID: 0, LineID: 0, BusinessUnitID: 0, BaseID: 0, FactoryID: 0, Status: 0 }, function (res3) {
                    //if (!res3)
                    //    return;
                    $.each(res3.list, function (i, item) {
                        TypeSource_TaskConfig.LedgerID.push({
                            name: item.Name,
                            value: item.ID,
                            far: null
                        })
                    });
                    model.com.getUser({}, function (res2) {
                        //if (!res2)
                        //return;
                        $.each(res2.list, function (i, item) {
                            TypeSource_TaskConfig.ApplicantID.push({
                                name: item.Name,
                                value: item.ID,
                                far: null
                            })
                        });

                        model.com.getDeviceModel({ DeviceWorkType: 0, SupplierID: 0, ModelPropertyID: 0, SystemID: 0, SystemPropertyID: 0, ControllerID: 0, ControllerPropertyID: 0, Active: -1, SupplierModelNo: "", SystemVersion: "", ControllerModel: "", StartTime: "2019-02-10 15:38:29", EndTime: "2029-05-10 15:38:29" }, function (res1) {
                            //if (!res1)
                            //return;
                            $.each(res1.list, function (i, item) {

                                TypeSource_TaskConfig.ModelID.push({
                                    name: item.ModelNo,
                                    value: item.ID,
                                    far: null
                                })
                            });
                            TypeSource_Level.ReplaceOptions = TypeSource_TaskConfig.ModelID;
                            model.com.getDeviceWorkType({ Active: -1, DSType: 0 }, function (res1) {
                                //if (!res1)
                                //return;
                                $.each(res1.list, function (i, item) {
                                    TypeSource_Level.WorkType.push({
                                        name: item.Name,
                                        value: item.ID,
                                        far: null
                                    })
                                });
                                EDate = $com.util.format('yyyy-MM-dd hh:mm', new Date());
                                var time = model.com.addDate(EDate, -1);
                                SDate = $com.util.format('yyyy-MM-dd hh:mm', new Date(time));
                                model.com.refresh();
                            });
                        });

                    });
                });
            });


        },

        com: {
            refresh: function () {
                //预警查询
                model.com.getConfigAll({ ModelID: 0, ModelNo: "", WorkType: 0, SupplierID: 0, SupplierModelNo: "", DSType: DSType, Active: -1, StartTime: SDate, EndTime: EDate }, function (resS) {
                    if (!resS)
                        return;
                    if (resS && resS.list) {

                        DataConfigBasic = $com.util.Clone(resS.list);
                        DataConfigAll = $com.util.Clone(resS.list)
                        var _list = $com.util.Clone(DataConfigAll);
                        $.each(_list, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }
                        });
                        DataConfigSearch = $com.util.Clone(_list);
                        //var zz = [];
                        //for (var i = 0; i < 100; i++) {
                        //    zz.push(_list[i]);
                        //}
                        //
                        $("#femi-warning-tbody").html($com.util.template(_list, HTML.TableWarnMode));
                        $("#femi-warning-tbody tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });

                    }

                });


                //保养MRPID  1;  点检项  2   维修项 3
                model.com.getDeviceMaintainApply({
                    ModelID: -1, Name: "", TypeID: 0, DSType: 1, Status: 0, LedgerID: 0, ApplicantID: 0,
                    ApproverID: 0, ConfirmID: 0, OAGetType: 0, StartTime: "2000-04-26 19:15:19", EndTime: "5029-05-5 10:15:19",
                    BusinessUnitID: -1, BaseID: -1, FactoryID: -1, WorkShopID: -1, LineID: -1
                }, function (resM) {
                    if (!resM)
                        return;
                    if (resM && resM.list) {
                        DataMain = $com.util.Clone(resM.list);

                        for (var i = 0; i < DataMain.length; i++) {
                            DataMain[i].MRPID = 1;
                        }
                    }

                    model.com.getDevicePointCheckApply({
                       
                    }, function (resP) {
                        if (!resP)
                            return;
                        if (resP && resP.list) {
                            DataPoint = $com.util.Clone(resP.list);
                            for (var i = 0; i < DataPoint.length; i++) {
                                DataPoint[i].MRPID = 2;
                            }
                        }

                        model.com.getDeviceRepairApply({
                            ModelID: -1, Name: "", TypeID: 0, DSType: 1, Status: 0, LedgerID: 0, ApplicantID: 0,
                            ApproverID: 0, ConfirmID: 0, OAGetType: 0, StartTime: "2000-04-26 19:15:19", EndTime: "5029-05-5 10:15:19",
                            BusinessUnitID: -1, BaseID: -1, FactoryID: -1, WorkShopID: -1, LineID: -1
                        }, function (resR) {
                            if (!resR)
                                return;
                            if (resR && resR.list) {
                                DataRepair = $com.util.Clone(resR.list);
                                for (var i = 0; i < DataRepair.length; i++) {
                                    DataRepair[i].MRPID = 3;
                                }
                            }

                            var _list = [];
                            for (var i = 0; i < DataMain.length; i++) {
                                _list.push(DataMain[i]);
                            }
                            for (var j = 0; j < DataPoint.length; j++) {
                                _list.push(DataPoint[j]);
                            }
                            for (var n = 0; n < DataRepair.length; n++) {
                                _list.push(DataRepair[n]);
                            }
                            for (var i = 0; i < _list.length; i++) {
                                _list[i].WID = i + 1;
                            }
                            DATAMPR = $com.util.Clone(_list);

                            $.each(_list, function (i, item) {
                                for (var p in item) {
                                    if (!FORMATTRT_TaskConfig[p])
                                        continue;
                                    item[p] = FORMATTRT_TaskConfig[p](item[p]);
                                }
                            });
                            DATAMPRSearch = $com.util.Clone(_list);
                            $("#femi-riskApplyLevel-tbody").html($com.util.template(_list, HTML.TableApplyMode));
                            $("#femi-riskApplyLevel-tbody tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);



                            });

                        });
                    });
                });

                //时间配置
                model.com.getTime({}, function (resS) {
                    if (!resS)
                        return;
                    if (resS && resS.info) {
                        DataConfig = $com.util.Clone(resS.info);

                        // $("#femi-configSet-tbody").html($com.util.template(DataConfig, HTML.TableSetMode));
                        $com.propertyGrid.show($(".zace-timeSet-show"), DataConfig, KEYWORD_TimeConfig, TypeSource_TimeConfig);
                    }



                });
                //运行配置
                model.com.getConfigSet({}, function (resS) {
                    if (!resS)
                        return;
                    if (resS && resS.info) {
                        DataConfigRun = $com.util.Clone(resS.info);

                        $com.propertyGrid.show($(".zace-runSet-show"), DataConfigRun, KEYWORD_RunConfig, TypeSource_RunConfig);

                    }



                });
            },

            //保养项目
            refreshRightM: function (data) {
                var _list = [];
                var itemList = data.MaintainItemOptions;
                if (itemList.length < 0) {
                    alert("没有保养项!")
                    return false;
                }
                for (var i = 0; i < itemList.length; i++) {
                    for (var j = 0; j < DATAMaintainList.length; j++) {
                        if (itemList[i] == DATAMaintainList[j].ID) {
                            _list.push(DATAMaintainList[j]);
                        }
                    }
                }

                $("#femi-riskAppplyResult-tbody").html($com.util.template(_list, HTML.TableNode_Item));
                $("#femi-riskAppplyResult-tbody tr").each(function (i, item) {
                    var $this = $(this);
                    var colorName = $this.css("background-color");
                    $this.attr("data-color", colorName);



                });
            },
            //点检项目
            refreshRightP: function (data) {
                var _list = [];
                var itemList = data.CheckOptions;
                if (itemList.length < 0) {
                    alert("没有保养项!")
                    return false;
                }
                for (var i = 0; i < itemList.length; i++) {
                    for (var j = 0; j < DATAPointCheckList.length; j++) {
                        if (itemList[i] == DATAPointCheckList[j].ID) {
                            _list.push(DATAPointCheckList[j]);
                        }
                    }
                }

                $("#femi-riskAppplyResult-tbody").html($com.util.template(_list, HTML.TableNode_Item));
                $("#femi-riskAppplyResult-tbody tr").each(function (i, item) {
                    var $this = $(this);
                    var colorName = $this.css("background-color");
                    $this.attr("data-color", colorName);



                });
            },
            //维修
            refreshRightR: function (data) {
                var _list = [];
                var itemList = data.RepairItemOptions;
                if (itemList.length < 0) {
                    alert("没有保养项!")
                    return false;
                }
                for (var i = 0; i < itemList.length; i++) {
                    for (var j = 0; j < DATARepairList.length; j++) {
                        if (itemList[i] == DATARepairList[j].ID) {
                            _list.push(DATARepairList[j]);
                        }
                    }
                }

                $("#femi-riskAppplyResult-tbody").html($com.util.template(_list, HTML.TableNode_Item));
            },


            //获取所有设备/备件工作类型
            getDeviceWorkType: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceWorkType/All",
                    $TYPE: "get"
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


            //获取所有设备台账
            getDeviceLedger: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceLedger/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //获取所有设备/备件保养类型列表
            getDeviceRepairType: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceRepairType/All",
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

            //查询保养申请列表
            getDeviceMaintainApply: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceMaintainApply/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //修改保养申请列表
            postDeviceMaintainApply: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceMaintainApply/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },


            //查询维修申请列表
            getDeviceRepairApply: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceRepairApply/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //修改维修申请列表
            postDeviceRepairApply: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceRepairApply/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //查询点检申请列表
            getDevicePointCheckApply: function (data, fn, context) {
                var d = {
                    $URI: "/DevicePointCheckApply/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //修改点检申请列表
            postDevicePointCheckApply: function (data, fn, context) {
                var d = {
                    $URI: "/DevicePointCheckApply/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //查询库存预警
            getConfigAll: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceStockWarning/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询运行配置
            getConfigSet: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceStockWarning/RunIntervalInfo",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //保存运行配置
            postConfigSet: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceStockWarning/RunIntervalUpdate",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询时间配置
            getTime: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceStockWarning/TimeInfo",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //保存时间配置
            postTime: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceStockWarning/TimeUpdate",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //删除得到新的数据
            getNewList: function (_source, set_data) {
                if (!_source)
                    _source = [];
                if (!set_data)
                    set_data = [];
                var rst = [];
                for (var i = 0; i < _source.length; i++) {
                    var NotOWn = false;
                    for (var j = 0; j < set_data.length; j++) {
                        if (_source[i].RiskID == set_data[j].RiskID) {
                            _source.splice(i, 1);
                            set_data.splice(j, 1);
                            NotOWn = true;
                        }
                        if (set_data.length < 1) {
                            break;
                        }
                        if (NotOWn) {
                            model.com.getNewList(_source, set_data);
                        }
                    }

                }
                rst = _source;
                return rst;
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
            addDate: function (date, days) {
                if (days == undefined || days == '') {
                    days = 1;
                }
                var date = new Date(date);
                date.setDate(date.getDate() + days);
                var month = date.getMonth() + 1;
                var day = date.getDate();
                var mm = "'" + month + "'";
                var dd = "'" + day + "'";

                //单位数前面加0
                if (mm.length == 3) {
                    month = "0" + month;
                }
                if (dd.length == 3) {
                    day = "0" + day;
                }

                var time = date.getFullYear() + "-" + month + "-" + day
                return time;
            },
        }
    }),

    model.init();


});