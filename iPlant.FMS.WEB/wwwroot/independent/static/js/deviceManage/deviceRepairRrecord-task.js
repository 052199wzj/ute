require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {
    var
    KEYWORD_Device_LIST_task,
    KEYWORD_Device_task,
    FORMATTRT_Device_task,
    DEFAULT_VALUE_Device_task,
    TypeSource_Device_task,

     KEYWORD_Device_LIST_Item,
    KEYWORD_Device_Item,
    FORMATTRT_Device_Item,
    DEFAULT_VALUE_Device_Item,
    TypeSource_Device_Item,

    KEYWORD_Device_LIST_ItemX,
    KEYWORD_Device_ItemX,
    FORMATTRT_Device_ItemX,
    DEFAULT_VALUE_Device_ItemX,
    TypeSource_Device_ItemX,
        
         //查询时间
        StartTime,
        EndTime,
        wTask,
        DATABasic_Result,
        wSelect,
        TaskAll,
        TaskItem,
        wlist,
        DateItem,
        wPointCheck,
        TableAptitudeItemNode_task,
        resApplyList,
        mDeviceID,
		model,
        item,
        HTML;
   
    TaskTemp={
    	ID:0,
    	ApplyID:0,
    	ModelID:0,
    	LedgerID:0,
    	TypeID:0,
    	RepairItemOptions:[],
    	ResultList:[],
    	OperatorID:0,
    	ConfirmID:0,
    	StartTime:$com.util.format('yyyy-MM-dd hh:mm:ss',new Date()),
    	EndTime:$com.util.format('yyyy-MM-dd hh:mm:ss',new Date()),
    	ConfirmTime:$com.util.format('yyyy-MM-dd hh:mm:ss',new Date()),
    	Status:0,
    	Comment:"",
    	Reason:"",
    	LifeWastage:0,
    	ValueWastage:0,
    	LimitWastage:0,
    	PDNumCur: 0,
    	PDTimeCur: 0,
        CurrentTimes:0,
    };
    ItemTemp = {
        ID: 0,
        WID: 0,
        ItemID: 0,
        TaskID: 0,
        Result: false,
        Reason: [],
        Comment: "",
        TaskType: 1,
        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Resource: 1,
    };
    DATABasic_Result = [];

    HTML = {
      
     TableNode_task: [
            '<tr data-color="">',
            '<td style="width: 3px"><input type="checkbox"',
		  'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
	       '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td>',
            '<td style="min-width: 50px" data-title="ApplyID" data-value="{{ApplyID}}">{{ApplyID}}</td>',
            '<td style="min-width: 50px" data-title="ApplyNo" data-value="{{ApplyNo}}">{{ApplyNo}}</td>',
            '<td style="min-width: 50px" data-title="ModelID" data-value="{{ModelID}}">{{ModelID}}</td>',
            '<td style="min-width: 50px" data-title="LedgerID" data-value="{{LedgerID}}">{{LedgerID}}</td>',
            '<td style="min-width: 50px" data-title="TypeID" data-value="{{TypeID}}">{{TypeID}}</td>',
	        //'<td style="min-width: 50px" data-title="RepairItemOptions" data-value="{{RepairItemOptions}}">{{RepairItemOptions}}</td>',
	        //'<td style="min-width: 50px" data-title="ResultList" data-value="{{ResultList}}">{{ResultList}}</td>',
	       '<td style="min-width: 50px" data-title="OperatorID" data-value="{{OperatorID}}">{{OperatorID }}</td>',
	       '<td style="min-width: 50px" data-title="ConfirmID" data-value="{{ConfirmID}}">{{ConfirmID}}</td>',
           '<td style="min-width: 50px" data-title="LifeWastage" data-value="{{LifeWastage}}">{{LifeWastage}}</td>',
           '<td style="min-width: 50px" data-title="ValueWastage" data-value="{{ValueWastage}}">{{ValueWastage}}</td>',
           '<td style="min-width: 50px" data-title="LimitWastage" data-value="{{LimitWastage}}">{{LimitWastage}}</td>',
            '<td style="min-width: 50px" data-title="PDNumCur" data-value="{{PDNumCur}}">{{PDNumCur}}</td>',
            '<td style="min-width: 50px" data-title="PDTimeCur" data-value="{{PDTimeCur}}">{{PDTimeCur}}</td>',
           '<td style="min-width: 50px" data-title="CurrentTimes" data-value="{{CurrentTimes}}">{{CurrentTimes}}</td>',
             '<td style="min-width: 50px" data-title="StartTime" data-value="{{StartTime}}">{{StartTime}}</td>',
           '<td style="min-width: 50px" data-title="EndTime" data-value="{{EndTime}}">{{EndTime}}</td>',
           '<td style="min-width: 50px" data-title="ConfirmTime" data-value="{{ConfirmTime}}">{{ConfirmTime}}</td>',
              '<td style="min-width: 50px" data-title="Comment" data-value="{{Comment}}">{{Comment}}</td>',
           '<td style="min-width: 50px" data-title="Reason" data-value="{{Reason}}">{{Reason}}</td>',
           '<td style="min-width: 50px" data-title="Status" data-value="{{Status}}">{{Status}}</td>',
//         '<td style="min-width: 50px" data-title="DSType" data-value="{{DSType}}">{{DSType}}</td>',
		  '</tr>',
     ].join(""),
     TableNode_Item: [
         '<tr data-color="">',
         '<td style="width: 3px"><input type="checkbox"',
       'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
         '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td>',
         '<td style="min-width: 50px" data-title="ItemName" data-value="{{ItemName}}">{{ItemName}}</td>',
         //'<td style="min-width: 50px" data-title="TaskID" data-value="{{TaskID}}">{{TaskID}}</td>',
        '<td style="min-width: 50px" data-title="Result" data-value="{{Result}}">{{Result}}</td>',
         //'<td style="min-width: 50px" data-title="Reason" data-value="{{Reason}}">{{Reason}}</td>',
          '<td style="min-width: 50px" data-title="Comment" data-value="{{Comment}}">{{Comment}}</td>',
        //'<td style="min-width: 50px" data-title="TaskType" data-value="{{TaskType}}">{{TaskType}}</td>',
        '<td style="min-width: 50px" data-title="EditTime" data-value="{{EditTime}}">{{EditTime}}</td>',
        '<td style="min-width: 50px" data-title="Resource" data-value="{{Resource}}">{{Resource}}</td>',
         //'<td style="min-width: 50px" data-title="WID" data-value="{{WID}}">{{WID}}</td>',
      
       '</tr>',
     ].join(""),

     TableNode_ItemX: [
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
   
    //维修任务查询
    Defaul_Value_Search = {
        StartTime: new Date(),
        EndTime: new Date(),
    };
    (function () {

        KETWROD_LIST_Search = [
            "StartTime|开始时间|Date",
            "EndTime|结束时间|Date",
        ];

        KETWROD_Search = {};

        Formattrt_Search = {};

        TypeSource_Search = {};

        $.each(KETWROD_LIST_Search, function (i, item) {
            var detail = item.split("|");
            KETWROD_Search[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };

            if (detail.length > 2) {
                Formattrt_Search[detail[0]] = $com.util.getFormatter(TypeSource_Search, detail[0], detail[2]);
            }
        });
    })();
     $(function () {
        KEYWORD_Device_LIST_task = [
         "ID|维修任务单",
         "ApplyID|申请单号",
         "ApplyNo|申请单编号",
         "ModelID|设备型号|ArrayOne",
         "LedgerID|设备编码|ArrayOne",
         "TypeID|模板|ArrayOne",
         //"RepairItemOptions|保养项列表|Array",
         //"ResultList|保养项结果列表|InputArray",
         "OperatorID|维修人|ArrayOne",
         "ConfirmID|确认人|ArrayOne",
         "EndTime|结束时间|DateTime",
         "StartTime|开始时间|DateTime",
         "ConfirmTime|确认时间|DateTime",
         "Status|单据状态|ArrayOne",
         "Comment|备注",
         "Reason|理由",
         "LifeWastage|寿命损耗",
         "ValueWastage|价值损耗",
         "LimitWastage|加工数损耗",
         "PDNumCur|加工数",
         "PDTimeCur |加工时长",
         "CurrentTimes|维修次数",
        ];
        KEYWORD_Device_task = {};
        FORMATTRT_Device_task = {};
        DEFAULT_VALUE_Device_task = {
            ApplyID: 0,
            ModelID: 0,
            LedgerID: 0,
            TypeID: 0,
            RepairItemOptions:[],
            ResultList: [],
            OperatorID: 0,
            ConfirmID: 0,
            Status: 0,
            Comment: "",
            Reason: "",
            LifeWastage:0,
            ValueWastage: 0,
            LimitWastage: 0,
            PDNumCur: 0,
            PDTimeCur: 0,
            CurrentTimes: 0,
        };

        TypeSource_Device_task = {
        	Status:[{
        		 name: "默认",
                 value: 0
        	},{
        		name: "待开始",
                value: 1
        	},{
        		name: "执行中",
                value: 2
        	},{
        		name: "待确认",
                value: 3
        	},{
        		name:"已驳回",
        		value: 4
        	},{
        		name:"已确认",
        		value: 5
        	}],
        	RepairItemOptions: [{
        	    name: "无",
        	    value: 0
        	}],
        	OperatorID: [],
        	ConfirmID: [],
        	LedgerID: [{
        	    name: "无",
        	    value: 0
        	}],
        	TypeID: [{
        	    name: "无",
        	    value: 0
        	}],
        	ModelID: [{
        	    name: "无",
        	    value: 0
        	}]
        };
    

        $.each(KEYWORD_Device_LIST_task, function (x, item) {
            var detail = item.split("|");
            KEYWORD_Device_task[detail[0]] = {
                index: x,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_Device_task[detail[0]] = $com.util.getFormatter(TypeSource_Device_task, detail[0], detail[2]);
            }
        });
    });
    
     $(function () {
         KEYWORD_Device_LIST_taskG = [
          "ID|维修任务单|Readonly",
          "ApplyID|维修申请单|Readonly",
          "ModelID|设备型号|Readonly",
          "ApplyNo|申请单号|Readonly",
          "LedgerID|台账|Readonly",
          "TypeID|模板|Readonly",
          //"RepairItemOptions|保养项列表",
          //"ResultList|保养项结果列表",
          "OperatorID|维修人|Readonly",
          "ConfirmID|确认人|Readonly",
          "EndTime|结束时间|Readonly",
          "StartTime|开始时间|Readonly",
          "ConfirmTime|确认时间|Readonly",
          "Status|单据状态|Readonly",
          "Comment|备注|Readonly",
          "Reason|理由|Readonly",
          "LifeWastage|寿命损耗|Readonly",
          "ValueWastage|价值损耗|Readonly",
          "LimitWastage|加工数损耗|Readonly",
          "PDNumCur|加工数|Readonly",
          "PDTimeCur |加工时长|Readonly",
          "CurrentTimes|维修次数|Readonly",
         ];
         KEYWORD_Device_taskG = {};
         FORMATTRT_Device_taskG = {};
         DEFAULT_VALUE_Device_taskG = {};
         TypeSource_Device_taskG = { };


         $.each(KEYWORD_Device_LIST_taskG, function (x, item) {
             var detail = item.split("|");
             KEYWORD_Device_taskG[detail[0]] = {
                 index: x,
                 name: detail[1],
                 type: detail.length > 2 ? detail[2] : undefined,
                 control: detail.length > 3 ? detail[3] : undefined
             };
             if (detail.length > 2) {
                 FORMATTRT_Device_taskG[detail[0]] = $com.util.getFormatter(TypeSource_Device_taskG, detail[0], detail[2]);
             }
         });
     });
     
     $(function () {
         KEYWORD_Device_LIST_Item = [
          "ID|序号",
          "ItemID|保养项|ArrayOne",
          "TaskID|任务编号",
          "Result|结果|ArrayOne",
          "Reason|理由",
          "Comment|备注",
          "TaskType|任务类型|ArrayOne",
          "EditTime|修改时刻|DateTime",
          "Resource|资源|ArrayOne",
        

         ];
         KEYWORD_Device_Item = {};
         FORMATTRT_Device_Item = {};
         DEFAULT_VALUE_Device_Item = {
            
         };
         TypeSource_Device_Item = {
             Result: [{
                 name: "完成",
                 value: true
             }, {
                 name: "未完成",
                 value: false
             }],
             TaskType: [
              {
                  name: "保养",
                  value: 1
              }],
             //Reason: [{}],
             Resource: [{
                 name: "DMS",
                 value: 1
             }, {
                 name: "MES",
                 value: 2
             }],
             ItemID: [{
                 name: "无",
                 value: 0
             }]
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

     $(function () {
         KEYWORD_Device_LIST_ItemX = [
            "ID|序号",
           "Name|名称",
           "ModelID|设备型号|ArrayOne",
           "CareItems|注意事项",
           "Comment|备注",

         ];
         KEYWORD_Device_ItemX = {};
         FORMATTRT_Device_ItemX = {};
         DEFAULT_VALUE_Device_ItemX = {

         };
         TypeSource_Device_ItemX = {

             ModelID: [{
                 name: "无",
                 value: 0
             }]
         };


         $.each(KEYWORD_Device_LIST_ItemX, function (x, item) {
             var detail = item.split("|");
             KEYWORD_Device_ItemX[detail[0]] = {
                 index: x,
                 name: detail[1],
                 type: detail.length > 2 ? detail[2] : undefined,
                 control: detail.length > 3 ? detail[3] : undefined
             };
             if (detail.length > 2) {
                 FORMATTRT_Device_ItemX[detail[0]] = $com.util.getFormatter(TypeSource_Device_ItemX, detail[0], detail[2]);
             }
         });
     });
    model = $com.Model.create({
        name: '维修日志',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
           
            //查询维修任务
            $("body").delegate("#zace-Device-search", "click", function () {
                $("body").append($com.modal.show(Defaul_Value_Search, KETWROD_Search, "查询", function (rst) {
                    if (!rst || $.isEmptyObject(rst)) {
                        return false;
                    }

                    StartTime = $com.util.format("yyyy-MM-dd", rst.StartTime);
                    EndTime = $com.util.format("yyyy-MM-dd", rst.EndTime);

                    model.com.refresh();

                }, TypeSource_Search));
            });
             //保养日志(从任务单到申请单)
                 $("body").delegate("#zace-edit-Device-apply","click",function(){
                     var vdata = { 'header': '设备维修申请单', 'href': './device_manage/deviceRepairRrecord-apply.html', 'id': 'deviceRepairRrecord-apply', 'src': './static/images/menu/deviceManage/deviceRepairLog.png' };
                    window.parent.iframeHeaderSet(vdata); 
           })
                   
            
            $("body").delegate("#zace-search-Device-task", "change", function () {

                var $this = $(this),
                   value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-Device-tbody-task").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-Device-tbody-task"), DataAll_Task, value, "ID");
            });
            //维修日志导出（所有任务）
            $("body").delegate("#zace-export-Device-task", "click", function () {
                var $table = $("#deviceePart-All"),
                     fileName = "维修记录列表.xls",
                     Title = "维修记录列表";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });

            });
            //维修日志导出（我的维修）
            $("body").delegate("#zace-export-Device-BY", "click", function () {
                var $table = $("#deviceePart-BY"),
                     fileName = "维修记录我的保养列表.xls",
                     Title = "维修记录我的保养列表";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });

            });

            //维修日志导出（我的确认）
            $("body").delegate("#zace-export-Device-QRDC", "click", function () {
                var $table = $("#deviceePart-QR"),
                     fileName = "维修记录我的确认列表.xls",
                     Title = "维修记录我的确认列表";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });

            });

            //查看任务详情
            $("body").delegate("#zace-XQ", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-task"), "ID", DataAll_Task);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
 
                $(".zzza").css("margin-right", "350px");
                $(".zzzc").hide();
                $(".zzzb").width("350px");
                $(".zzzb").show();
                $(".zzzd").hide();
                $(".zzze").hide();
                $(".zzzf").hide();
                $(".zzzg").hide();

                var default_value = {
                    ID: SelectData[0].ID,
                    ApplyID: SelectData[0].ApplyID,
                    ModelID: SelectData[0].ModelID,
                    LedgerID: SelectData[0].LedgerID,
                    TypeID: SelectData[0].TypeID,
                    //RepairItemOptions: SelectData[0].RepairItemOptions,
                    //ResultList: SelectData[0].ResultList,
                    OperatorID: SelectData[0].OperatorID,
                    ConfirmID: SelectData[0].ConfirmID,
                    StartTime: SelectData[0].StartTime,
                    EndTime: SelectData[0].EndTime,
                    ConfirmTime: SelectData[0].ConfirmTime,
                    Status: SelectData[0].Status,
                    Comment: SelectData[0].Comment,
                    Reason: SelectData[0].Reason,
                    LifeWastage: SelectData[0].LifeWastage,
                    ValueWastage: SelectData[0].ValueWastage,
                    LimitWastage: SelectData[0].LimitWastage,
                    PDTimeCur: SelectData[0].PDTimeCur,
                    PDNumCur: SelectData[0].PDNumCur,
                    CurrentTimes: SelectData[0].CurrentTimes,
                };
                $("body").append($com.propertyGrid.show($(".Typetable-task"), default_value, KEYWORD_Device_taskG, TypeSource_Device_taskG));

            });
            //隐藏(查看任务详情)
            $("body").delegate("#cby-edit-ledger-YINC", "click", function () {
                $(".zzza").css("margin-right", "0px");
                $(".zzzb").hide();
                $(".zzzc").hide();
                $(".zzzb").width("0px");
                $(".zzzd").hide();
                $(".zzze").hide();
                $(".zzzf").hide();
                $(".zzzg").hide();
            })

         

            //执行
            $("body").delegate("#zace-ZX-Device-task", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-BY"), "ID", DATABasic_BY);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                //SelectData[0].Status = 5;
                if (SelectData[0].Status == 1) {
                    SelectData[0].Status = 2;
                } else {
                    alert("该状态下无法操作！")
                    return;
                }
                model.com.postDeviceRepairTask({
                    data: SelectData[0]
                }, function (res) {
                    alert("执行成功");
                    model.com.refresh();
                })
            });

            ////待确认
            //$("body").delegate("#zace-DQR-Device-task", "click", function () {
            //    var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-BY"), "ID", DATABasic_BY);

            //    if (!SelectData || !SelectData.length) {
            //        alert("请先选择一行数据再试！")
            //        return;
            //    }
            //    if (SelectData.length != 1) {
            //        alert("只能同时对一行数据修改！")
            //        return;
            //    }
            //    //SelectData[0].Status = 5;
            //    if (SelectData[0].Status == 2 || SelectData[0].Status==4) {
            //        SelectData[0].Status = 3;
            //    } else {
            //        alert("该状态下无法操作！")
            //        return;
            //    }
            //    model.com.postDeviceRepairTask({
            //        data: SelectData[0]
            //    }, function (res) {
            //        alert("执行成功");
            //        model.com.refresh();
            //    })
            //});


            //已确认

            $("body").delegate("#zace-export-Device-QR", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-QR"), "ID", DATABasic_QR);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                //SelectData[0].Status = 5;
                if (SelectData[0].Status == 3) {
                    SelectData[0].Status = 5;
                } else {
                    alert("该状态下无法操作！")
                    return;
                }
                var default_value = {
                    Reason: SelectData[0].Reason,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Device_task, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    SelectData[0].Reason = rst.Reason;

                    model.com.postDeviceRepairTask({
                        data: SelectData[0]
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                    });

                }, TypeSource_Device_task));

            });
            //驳回

            $("body").delegate("#zace-BH-Device-QR", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-QR"), "ID", DATABasic_QR);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                //SelectData[0].Status = 5;
                if (SelectData[0].Status == 3) {
                    SelectData[0].Status = 4;
                } else {
                    alert("该状态下无法操作！")
                    return;
                }
                var default_value = {
                    Reason: SelectData[0].Reason,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Device_task, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    SelectData[0].Reason = rst.Reason;

                    model.com.postDeviceRepairTask({
                        data: SelectData[0]
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                    });

                }, TypeSource_Device_task));

                   
            });


            //查看所有列表
            $("body").delegate("#zace-All-Device-Task", "click", function () {

                $(".zzza").show();
                $(".zzza").css("margin-right", "0px");
                $(".zzzb").hide();
                $(".zzzc").hide();
                $(".zzzd").hide();
                $(".zzze").hide();
                $(".zzzf").hide();
                $(".zzzg").hide();
            });

            //我的保养
            $("body").delegate("#zace-SQ-Device-Task", "click", function () {

                $(".zzza").hide();
                $(".zzzb").hide();
                $(".zzzc").show();
                $(".zzzc").css("margin-right", "0px");
                $(".zzzd").hide();
                $(".zzze").hide();
                $(".zzzf").hide();
                $(".zzzg").hide();
            });
            //我的确认
            $("body").delegate("#zace-QR-Device-Task", "click", function () {

                $(".zzza").hide();
                $(".zzzb").hide();
                $(".zzzc").hide();
                $(".zzzd").show();
                $(".zzzd").css("margin-right", "0px");
                $(".zzze").hide();
                $(".zzzf").hide();
                $(".zzzg").hide();
            });
            //查看保养项(所有列表)
            $("body").delegate("#zace-item-Device-baoyang", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-task"), "ID", DATABasic_Task);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }

                var list = SelectData[0].RepairItemOptions;
                var listItem = [];

                for (var i = 0; i < list.length; i++) {
                    for (var j = 0; j < DateItem.length; j++) {
                        if (list[i] == DateItem[j].ID) {
                            listItem.push(DateItem[j]);
                        }
                    }
                }
                var wList = $com.util.Clone(listItem);
                $.each(wList, function (i, item) {
                    for (var p in item) {
                        if (!FORMATTRT_Device_ItemX[p])
                            continue;
                        item[p] = FORMATTRT_Device_ItemX[p](item[p]);
                    }
                });

                $("#femi-Device-tbody-All").html($com.util.template(wList, HTML.TableNode_ItemX));
                $("#femi-Device-tbody-All tr").each(function (i, item) {
                    var $this = $(this);
                    var colorName = $this.css("background-color");
                    $this.attr("data-color", colorName);



                });

                $(".zzza").css("margin-right", "450px");
                $(".zzzc").hide();
                $(".zzzf").width("450px");
                $(".zzzf").show();
                $(".zzzd").hide();
                $(".zzze").hide();
                $(".zzzb").hide();
                $(".zzzg").hide();
            });
            //隐藏保养项(所有列表)
            $("body").delegate("#zace-Device-YC", "click", function () {

                $(".zzza").css("margin-right", "0px");
                $(".zzzb").hide();
                $(".zzzc").hide();
                $(".zzzf").width("0px");
                $(".zzzd").hide();
                $(".zzze").hide();
                $(".zzzf").hide();
                $(".zzzg").hide();
            });

            //查看保养结果 （我的保养）       
            $("body").delegate("#zace-item-Device-apply", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-BY"), "ID", DATABasic_BY);
               
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                if (SelectData[0].Status == 2) {
                    //Result里面没有数据
                    wSelect = SelectData[0];
                    wRepairItemOptions = SelectData[0].RepairItemOptions;
                    var wlistResult = [];
                    Task1 = [];
                    for (var m = 0; m < DATABasic_Result.length; m++) {
                        if (SelectData[0].ID == DATABasic_Result[m].TaskID) {
                            wlistResult.push(DATABasic_Result[m]);
                        }
                    }

                    if (wlistResult.length < 1) {
                        var wlist = [];

                        for (var i = 0; i < wRepairItemOptions.length; i++) {
                            for (var j = 0; j < DateItem.length; j++) {
                                if (wRepairItemOptions[i] == DateItem[j].ID) {
                                    wlist.push(DateItem[j]);
                                }
                            }
                        }

                        var _list1 = [];
                        for (var i = 0; i < wlist.length; i++) {
                            var temp = $com.util.Clone(ItemTemp);
                            temp.ItemID = wlist[i].ID;
                            temp.TaskID = SelectData[0].ID;
                            _list1.push(temp);
                        }
                        for (i = 0; i < _list1.length; i++) {
                            _list1[i].ItemName = FORMATTRT_Device_Item["ItemID"](_list1[i].ItemID);
                        }
                        Task1 = $com.util.Clone(_list1);
                        var Task = $com.util.Clone(_list1);
                        $.each(Task, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Device_Item[p])
                                    continue;
                                item[p] = FORMATTRT_Device_Item[p](item[p]);
                            }
                        });

                        $("#femi-Device-tbody-Item").html($com.util.template(Task, HTML.TableNode_Item));
                        $("#femi-Device-tbody-Item tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });

                        $("body").delegate("#zace-Device-edit", "click", function () {
                            var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-Item"), "ItemName", Task1);
                            var default_value_result = {
                                Result: SelectData[0].Result,
                                //Reason: SelectData[0].Reason,
                                Comment: SelectData[0].Comment,
                                //TaskType: SelectData[0].TaskType,
                                Resource: SelectData[0].Resource,
                            };
                            $("body").append($com.modal.show(default_value_result, KEYWORD_Device_Item, "修改", function (rst) {
                                //调用修改函数
                                if (!rst || $.isEmptyObject(rst))
                                    return;
                                //eval(rst.Result.toLowerCase());
                                //SelectData[0].Reason = rst.Reason;
                                SelectData[0].Result = eval(rst.Result.toLowerCase());
                                SelectData[0].Comment = rst.Comment;
                                //SelectData[0].TaskType = Number(rst.TaskType);
                                SelectData[0].Resource = Number(rst.Resource);
                                var _wlist = $com.util.Clone(Task1);
                                wTask = $com.util.Clone(Task1);
                                for (i = 0; i < _wlist.length; i++) {
                                    _wlist[i].ItemName = FORMATTRT_Device_Item["ItemID"](_wlist[i].ItemID);
                                }
                                $.each(_wlist, function (i, item) {
                                    for (var p in item) {
                                        if (!FORMATTRT_Device_Item[p])
                                            continue;
                                        item[p] = FORMATTRT_Device_Item[p](item[p]);
                                    }
                                });
                                $("#femi-Device-tbody-Item").html($com.util.template(_wlist, HTML.TableNode_Item));
                                $("#femi-Device-tbody-Item tr").each(function (i, item) {
                                    var $this = $(this);
                                    var colorName = $this.css("background-color");
                                    $this.attr("data-color", colorName);



                                });

                            }, TypeSource_Device_Item));


                        });
                    } else {
                        //Result里面有数据
                        var Task = $com.util.Clone(wlistResult);
                        var wTaskBY = $com.util.Clone(wlistResult);
                        $.each(Task, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Device_Item[p])
                                    continue;
                                item[p] = FORMATTRT_Device_Item[p](item[p]);
                            }
                        });

                        $("#femi-Device-tbody-Item").html($com.util.template(Task, HTML.TableNode_Item));
                        $("#femi-Device-tbody-Item tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });

                        $("body").delegate("#zace-Device-edit", "click", function () {
                            var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-Item"), "ID", wTaskBY);
                            var default_value_result = {
                                Result: SelectData[0].Result,
                                //Reason: SelectData[0].Reason,
                                Comment: SelectData[0].Comment,
                                //TaskType: SelectData[0].TaskType,
                                Resource: SelectData[0].Resource,
                            };
                            $("body").append($com.modal.show(default_value_result, KEYWORD_Device_Item, "修改", function (rst) {
                                //调用修改函数
                                if (!rst || $.isEmptyObject(rst))
                                    return;
                                //eval(rst.Result.toLowerCase());
                                //SelectData[0].Reason = rst.Reason;
                                SelectData[0].Result = eval(rst.Result.toLowerCase());
                                SelectData[0].Comment = rst.Comment;
                                //SelectData[0].TaskType = Number(rst.TaskType);
                                SelectData[0].Resource = Number(rst.Resource);
                                var _wlist = $com.util.Clone(wTaskBY);
                                wTask = $com.util.Clone(wTaskBY);
                                for (i = 0; i < _wlist.length; i++) {
                                    _wlist[i].ItemName = FORMATTRT_Device_Item["ItemID"](_wlist[i].ItemID);
                                }
                                $.each(_wlist, function (i, item) {
                                    for (var p in item) {
                                        if (!FORMATTRT_Device_Item[p])
                                            continue;
                                        item[p] = FORMATTRT_Device_Item[p](item[p]);
                                    }
                                });
                                $("#femi-Device-tbody-Item").html($com.util.template(_wlist, HTML.TableNode_Item));
                                $("#femi-Device-tbody-Item tr").each(function (i, item) {
                                    var $this = $(this);
                                    var colorName = $this.css("background-color");
                                    $this.attr("data-color", colorName);



                                });

                            }, TypeSource_Device_Item));


                        });

                    }



                    $(".zzzc").css("margin-right", "540px");
                    $(".zzza").hide();
                    $(".zzze").width("540px");
                    $(".zzze").show();
                    $(".zzzb").hide();
                    $(".zzzd").hide();
                    $(".zzzf").hide();
                    $(".zzzg").hide();
                    $("#zace-Device-edit").show();
                    $("#zace-Device-TiJiao").show();
                } else {
                    wSelect = SelectData[0];
                    wRepairItemOptions = SelectData[0].RepairItemOptions;
                    var wlistResult = [];
                    Task1 = [];
                    for (var m = 0; m < DATABasic_Result.length; m++) {
                        if (SelectData[0].ID == DATABasic_Result[m].TaskID) {
                            wlistResult.push(DATABasic_Result[m]);
                        }
                    }
                    var Task = $com.util.Clone(wlistResult);
                    for (i = 0; i < Task.length; i++) {
                        Task[i].ItemName = FORMATTRT_Device_Item["ItemID"](Task[i].ItemID);
                    }
                    $.each(Task, function (i, item) {
                        for (var p in item) {
                            if (!FORMATTRT_Device_Item[p])
                                continue;
                            item[p] = FORMATTRT_Device_Item[p](item[p]);
                        }
                    });

                    $("#femi-Device-tbody-Item").html($com.util.template(Task, HTML.TableNode_Item));
                    $("#femi-Device-tbody-Item tr").each(function (i, item) {
                        var $this = $(this);
                        var colorName = $this.css("background-color");
                        $this.attr("data-color", colorName);



                    });

                    $(".zzzc").css("margin-right", "540px");
                    $(".zzza").hide();
                    $(".zzze").width("540px");
                    $(".zzze").show();
                    $(".zzzb").hide();
                    $(".zzzd").hide();
                    $(".zzzf").hide();
                    $(".zzzg").hide();
                    $("#zace-Device-edit").hide();
                    $("#zace-Device-TiJiao").hide();

                }
               
            });

            //提交
            $("body").delegate("#zace-Device-TiJiao", "click", function () {
                model.com.postDeviceItemResult({
                    data: wTask
                }, function (res) {
                    alert("提交成功，点击确认按钮请填写保养任务备注！");
                    model.com.refresh();
                    var wTaskTJ = $com.util.Clone(res.list);
                    for (i = 0; i < wTaskTJ.length; i++) {
                        wTaskTJ[i].ItemName = FORMATTRT_Device_Item["ItemID"](wTaskTJ[i].ItemID);
                    }
                    $.each(wTaskTJ, function (i, item) {
                        for (var p in item) {
                            if (!FORMATTRT_Device_Item[p])
                                continue;
                            item[p] = FORMATTRT_Device_Item[p](item[p]);
                        }
                    });
                    $("#femi-Device-tbody-Item").html($com.util.template(wTaskTJ, HTML.TableNode_Item));
                    $("#femi-Device-tbody-Item tr").each(function (i, item) {
                        var $this = $(this);
                        var colorName = $this.css("background-color");
                        $this.attr("data-color", colorName);



                    });
                });

                var default_value = {
                    Comment: wSelect.Comment,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Device_task, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    wSelect.Comment = rst.Comment;
                    if (wSelect.Status == 2) {
                        wSelect.Status = 3;
                    } else {
                        alert("该状态下无法操作！")
                        return;
                    }

                    model.com.postDeviceRepairTask({
                        data: wSelect
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                    });

                }, TypeSource_Device_task));
            });
            //保养结果我的隐藏（我的保养）
            $("body").delegate("#zace-Device-yinc", "click", function () {

                $(".zzza").hide();
                $(".zzzb").hide();
                $(".zzzc").show();
                $(".zzzc").css("margin-right", "0px");
                $(".zzzd").hide();
                $(".zzze").hide();
                $(".zzze").width("0px");
                $(".zzzf").hide();
                $(".zzzg").hide();
            });

          

            //查看保养结果 （我的确认）       
            $("body").delegate("#zace-item-Device-apply-QR", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-QR"), "ID", DATABasic_QR);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                wRepairItemOptions = SelectData[0].RepairItemOptions;
                var wlistResult = [];
                for (var m = 0; m < DATABasic_Result.length; m++) {
                    if (SelectData[0].ID == DATABasic_Result[m].TaskID) {
                        wlistResult.push(DATABasic_Result[m]);
                    }
                }
                var wTaskQr = $com.util.Clone(wlistResult);
                for (i = 0; i < wTaskQr.length; i++) {
                    wTaskQr[i].ItemName = FORMATTRT_Device_Item["ItemID"](wTaskQr[i].ItemID);
                }
                $.each(wTaskQr, function (i, item) {
                    for (var p in item) {
                        if (!FORMATTRT_Device_Item[p])
                            continue;
                        item[p] = FORMATTRT_Device_Item[p](item[p]);
                    }
                });

                $("#femi-Device-tbody-Item-QR").html($com.util.template(wTaskQr, HTML.TableNode_Item));
                $("#femi-Device-tbody-Item-QR tr").each(function (i, item) {
                    var $this = $(this);
                    var colorName = $this.css("background-color");
                    $this.attr("data-color", colorName);



                });

                $(".zzzd").css("margin-right", "540px");
                $(".zzza").hide();
                $(".zzzg").width("540px");
                $(".zzzg").show();
                $(".zzzb").hide();
                $(".zzzc").hide();
                $(".zzze").hide();
                $(".zzzf").hide();
                $("#zace-Device-edit-QR").hide();
                $("#zace-Device-TiJiao-QR").hide();
               
            });
            //保养结果我的隐藏（我的保养）
            $("body").delegate("#zace-Device-yinc-QR", "click", function () {

                $(".zzza").hide();
                $(".zzzb").hide();
                $(".zzzc").hide();
                $(".zzzd").show();
                $(".zzzd").css("margin-right", "0px");
                $(".zzze").hide();
                $(".zzzf").hide();
                $(".zzzg").hide();
                $(".zzzg").width("0px");
            });
        
                     //设备点检日志
            $("body").delegate("#zace-DJ-Device-Apply", "click", function () {
                var vdata = { 'header': '设备点检日志', 'href': './device_manage/devicePointCheckRrecord-task.html', 'id': 'devicePointCheckRrecord-task', 'src': './static/images/menu/deviceManage/deviceRepairLog.png' };
                window.parent.iframeHeaderSet(vdata);
            });
            //设备保养日志
            $("body").delegate("#zace-BY-Device-Apply", "click", function () {
                var vdata = { 'header': '设备保养日志', 'href': './device_manage/deviceMaintainRrecord-task.html', 'id': 'DeviceMaintain-task', 'src': './static/images/menu/deviceManage/sparePartMaintainLog.png' };
                window.parent.iframeHeaderSet(vdata);
            });

            //备件保养日志
            $("body").delegate("#zace-BJBY-Device-Apply", "click", function () {
                var vdata = { 'header': '备件保养日志', 'href': './device_manage/deviceMaintainRrecord-task-bj.html', 'id': 'DeviceMaintainRrecord-task-bj', 'src': './static/images/menu/deviceManage/sparePartMaintainLog.png' };
                window.parent.iframeHeaderSet(vdata);
            });

            //备件维修日志
            $("body").delegate("#zace-BJWX-Device-Apply", "click", function () {
                var vdata = { 'header': '备件维修日志', 'href': './device_manage/deviceRepairRrecord-task-bj.html', 'id': 'deviceRepairRrecord-task-bj', 'src': './static/images/menu/deviceManage/deviceRepairLog.png' };
                window.parent.iframeHeaderSet(vdata);
            });



        },





        run: function () {
            EndTime = $com.util.format("yyyy-MM-dd", new Date().getTime() + 24 * 3600 * 1000);
            StartTime = $com.util.format("yyyy-MM-dd", new Date().getTime() - 7 * 24 * 3600 * 1000);
            DateItem = [];
            var wUser = window.parent._UserAll;
            var wDevice = window.parent._Device;
            model.com.getDeviceModel({
                DeviceWorkType: 0, SupplierID: 0, ModelPropertyID: 0, SystemID: 0, SystemPropertyID: 0,
                ControllerID: 0, ControllerPropertyID: 0, Active: -1, SupplierModelNo: "", SystemVersion: "", ControllerModel: ""
            }, function (res4) {
                $.each(res4.list, function (i, item) {
                    TypeSource_Device_task.ModelID.push({
                        name: item.ModelNo,
                        value: item.ID,
                        far: null
                    })
                });
                $.each(res4.list, function (i, item) {
                    TypeSource_Device_ItemX.ModelID.push({
                        name: item.ModelNo,
                        value: item.ID,
                        far: null
                    })
                });
                $.each(wUser, function (i, item) {
                    TypeSource_Device_task.OperatorID.push({
                        name: item.Name,
                        value: item.ID,
                        far: null
                    })
                });

                $.each(wUser, function (i, item) {
                    TypeSource_Device_task.ConfirmID.push({
                        name: item.Name,
                        value: item.ID,
                        far: null
                    })
                });
                $.each(wDevice, function (i, item) {

                    TypeSource_Device_task.LedgerID.push({
                        name: item.DeviceNo,
                        value: item.ID,
                        far: null
                    })
                });

                model.com.getDeviceRepairType({
                    ModelID: -1, Name: "", DSType: 1, Active: -1,BusinessUnitID: 0, BaseID: 0, FactoryID: 0, WorkShopID: 0, LineID: 0
                }, function (res3) {

                    $.each(res3.list, function (i, item) {
                        TypeSource_Device_task.TypeID.push({
                            name: item.Name,
                            value: item.ID,
                            far: null
                        })
                    });
                    model.com.getDeviceRepairItem({
                        ModelID: -1, Name: "", DSType: 1, Active: -1, BusinessUnitID: 0, BaseID: 0, FactoryID: 0, WorkShopID: 0, LineID: 0
                    }, function (res1) {
                        DateItem = res1.list;
                        $.each(res1.list, function (i, item) {

                            TypeSource_Device_task.RepairItemOptions.push({
                                name: item.Name,
                                value: item.ID,
                                far: null
                            })
                        });
                        $.each(res1.list, function (i, item) {
                            TypeSource_Device_Item.ItemID.push({
                                name: item.Name,
                                value: item.ID,
                                far: null
                            })
                        });

                        model.com.refresh();
                    });

                });
            });
        },

        com: {
            refresh: function () {
                //ModelID:{int},LedgerID:{int},TypeID:{int}, ApplicantID:{int},ApproverID:{int},ConfirmID:{int},DSType:{int}, Status:{int},StartTime:{DateTime},EndTime:{DateTime}
                model.com.getDeviceRepairTask({
                    ModelID: -1, LedgerID: 0, TypeID: 0, OAGetType: 0, ApplicantID: 0, ApproverID: 0,
                    ConfirmID: 0, DSType: 1, Status: 0, StartTime: StartTime, EndTime: EndTime,
                    BusinessUnitID: -1, BaseID: -1, FactoryID: -1, WorkShopID: -1, LineID: -1
                }, function (resTask) {
                    if (!resTask)
                        return;
                    if (resTask && resTask.list) {
                        var Task = $com.util.Clone(resTask.list);

                        DATABasic_Task = $com.util.Clone(resTask.list);

                        $.each(Task, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Device_task[p])
                                    continue;
                                item[p] = FORMATTRT_Device_task[p](item[p]);
                            }
                        });
                        DataAll_Task = $com.util.Clone(Task);

                        $("#femi-Device-tbody-task").html($com.util.template(Task, HTML.TableNode_task));
                        $("#femi-Device-tbody-task tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });
                    }

                });

                model.com.getDeviceRepairTask({
                    ModelID: -1, LedgerID: 0, TypeID: 0, OAGetType: 0, ApplicantID: 0,
                    ApproverID: 0, ConfirmID: 0, DSType: 1, Status: 0, 
                    BusinessUnitID: -1, BaseID: -1, FactoryID: -1, WorkShopID: -1, LineID: -1
                }, function (resQR) {
                    if (!resQR)
                        return;
                    if (resQR && resQR.list) {
                       var QR = $com.util.Clone(resQR.list);

                        DATABasic_QR = $com.util.Clone(resQR.list);

                        $.each(QR, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Device_task[p])
                                    continue;
                                item[p] = FORMATTRT_Device_task[p](item[p]);
                            }
                        });
                        DataAll_QR = $com.util.Clone(QR);
                    

                        $("#femi-Device-tbody-QR").html($com.util.template(QR, HTML.TableNode_task));
                        $("#femi-Device-tbody-QR tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });

                    }

                });

                model.com.getDeviceRepairTask({
                    ModelID: -1, LedgerID: 0, TypeID: 0, OAGetType: 0, ApplicantID: 0, ApproverID: 0,
                    ConfirmID: 0, DSType: 1, Status: 0,
                    BusinessUnitID: -1, BaseID: -1, FactoryID: -1, WorkShopID: -1, LineID: -1
                }, function (resBY) {
                    if (!resBY)
                        return;
                    if (resBY && resBY.list) {
                        var BY = $com.util.Clone(resBY.list);

                        DATABasic_BY = $com.util.Clone(resBY.list);

                        $.each(BY, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Device_task[p])
                                    continue;
                                item[p] = FORMATTRT_Device_task[p](item[p]);
                            }
                        });
                        DataAll_BY = $com.util.Clone(BY);

                        $("#femi-Device-tbody-BY").html($com.util.template(BY, HTML.TableNode_task));
                        $("#femi-Device-tbody-BY tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });

                    }

                });
                model.com.getDeviceItemResult({
                    TaskID: 0, TaskType: 0, Resource: 1
                }, function (resResult) {
                    if (!resResult)
                        return;
                    if (resResult && resResult.list) {
                        var Result = $com.util.Clone(resResult.list);

                        DATABasic_Result = $com.util.Clone(resResult.list);

                        $.each(Result, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Device_Item[p])
                                    continue;
                                item[p] = FORMATTRT_Device_Item[p](item[p]);
                            }
                        });
                        DataAll_Result = $com.util.Clone(Result);

                        //$("#femi-Device-tbody-Item").html($com.util.template(Result, HTML.TableNode_Item));
                        //$("#femi-Device-tbody-Item tr").each(function (i, item) {
                        //    var $this = $(this);
                        //    var colorName = $this.css("background-color");
                        //    $this.attr("data-color", colorName);



                        //});

                    }
                });
            },
            //获取所有设备/备件保养项列表
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
            //获取所有设备/备件保养项列表
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

           
            //获取所有设备/备件保养任务列表
            getDeviceRepairTask: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceRepairTask/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },


            //添加或修改设备/备件保养任务
            postDeviceRepairTask: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceRepairTask/Update",
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
            //得到ID
            GetMaxID: function (_source) {
                var id = 0;
                if (!_source)
                    _source = [];
                $.each(_source, function (i, item) {
                    if (item.ItemID > id)
                        id = item.ItemID;
                });
                return id + 1;

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
            //根据条件获取填写结果表
            getDeviceItemResult: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceItemResult/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //提交结果表
            postDeviceItemResult: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceItemResult/Update",
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