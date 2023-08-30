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
        
         mResult,
        resTaskList,
        Task1,
        DATABasic_Result,
        DATABasic_TaskSpot,
        wSelect,
        wlist,
         DateItem,
        wPointCheck,
        TableAptitudeItemNode_task,
		model,
        item,
        HTML;
   
    TaskTemp={
    	ID:0,
    	DeviceID: 0,
    	DeviceNo: "",
    	WorkShopID: 0,
    	LineID: 0,
    	ActiveTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
    	ModuleVersionID: 0,
    	OperatorID:0,
    	Result:false,
    	ShiftID: 0,
    	Status: 1,
    	SubmitTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
    	TaskMode:0,
    	TaskType: 0,
    	Times: 0,
    };
    ItemTemp = {
        ID: 0,
        ItemID: 0,
        TaskID: 0,
        Result: 0,
        Reason: "",
        Comment: "",
        TaskType: 0,
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
            '<td style="min-width: 50px" data-title="DeviceName" data-value="{{DeviceName}}">{{DeviceName}}</td>',
            '<td style="min-width: 50px" data-title="DeviceNo" data-value="{{DeviceNo}}">{{DeviceNo}}</td>',
            '<td style="min-width: 50px" data-title="WorkShopName" data-value="{{WorkShopName}}">{{WorkShopName}}</td>',
            '<td style="min-width: 50px" data-title="LineName" data-value="{{LineName}}">{{LineName}}</td>',
	       '<td style="min-width: 50px" data-title="ModuleVersionID" data-value="{{ModuleVersionID}}">{{ModuleVersionID }}</td>',
	       '<td style="min-width: 50px" data-title="OperatorName" data-value="{{OperatorName}}">{{OperatorName}}</td>',
           '<td style="min-width: 50px" data-title="Result" data-value="{{Result}}">{{Result}}</td>',
           '<td style="min-width: 50px" data-title="ShiftID" data-value="{{ShiftID}}">{{ShiftID}}</td>',
            '<td style="min-width: 50px" data-title="ActiveTime" data-value="{{ActiveTime}}">{{ActiveTime}}</td>',
           '<td style="min-width: 50px" data-title="SubmitTime" data-value="{{SubmitTime}}">{{SubmitTime}}</td>',
           '<td style="min-width: 50px" data-title="ModeText" data-value="{{ModeText}}">{{ModeText}}</td>',
           '<td style="min-width: 50px" data-title="TypeText" data-value="{{TypeText}}">{{TypeText}}</td>',
           '<td style="min-width: 50px" data-title="Times" data-value="{{Times}}">{{Times}}</td>',
          '<td style="min-width: 50px" data-title="Status" data-value="{{Status}}">{{Status}}</td>',
		  '</tr>',
     ].join(""),
     TableNode_Item: [
         '<tr data-color="">',
         '<td style="width: 3px"><input type="checkbox"',
       'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
        '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td>',
         '<td style="min-width: 50px" data-title="ItemID" data-value="{{ItemID}}">{{ItemID}}</td>',
         //'<td style="min-width: 50px" data-title="TaskID" data-value="{{TaskID}}">{{TaskID}}</td>',
        '<td style="min-width: 50px" data-title="Result" data-value="{{Result}}">{{Result}}</td>',
         '<td style="min-width: 50px" data-title="Reason" data-value="{{Reason}}">{{Reason}}</td>',
          '<td style="min-width: 50px" data-title="Comment" data-value="{{Comment}}">{{Comment}}</td>',
        '<td style="min-width: 50px" data-title="TaskType" data-value="{{TaskType}}">{{TaskType}}</td>',
        '<td style="min-width: 50px" data-title="EditTime" data-value="{{EditTime}}">{{EditTime}}</td>',
        '<td style="min-width: 50px" data-title="Resource" data-value="{{Resource}}">{{Resource}}</td>',
       '</tr>',
     ].join(""),
    },
      //resTaskList = [
      //                {
      //                    ID: 1, DeviceName: "DE-M74839", DeviceNo: "DE-M74839-2019-05-00000", WorkShopName: "模组", LineName: "160V产线", ModuleVersionID: "2",
      //                    OperatorName: "admin", Result: "合格", ShiftID: "20190801", Status: "待开始", ActiveTime: "2019-07-30 09:37:17",
      //                    SubmitTime: "2019-07-30 09:37:17", ModeText: "模式1", TypeText: "设备", Times: "5"
      //                }
      // ];
    
     $(function () {
         KEYWORD_Device_LIST_task = [
          "ID|序号",
          "DeviceName|设备号",
          "DeviceNo|设备编码",
          "WorkShopName|车间",
          "LineName|产线",
          "ActiveTime|激活时刻|DateTime",
          "ModuleVersionID|点检模板",
          "OperatorName|操作员",
          "Result|结果|ArrayOne",
          "ShiftID|班次",
          "Status|状态|ArrayOne",
          "SubmitTime|提交时刻|DateTime",
          "ModeText|任务模式",
          "TypeText|任务类型",
          "Times|次数",
         ];
         KEYWORD_Device_task = {};
         FORMATTRT_Device_task = {};
         DEFAULT_VALUE_Device_task = {
          
         };

         TypeSource_Device_task = {
             Result:[{
                 name: "不合格",
                 value: false
             }, {
                 name: "合格",
                 value: true
             }],
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
 
        	//OperatorID: [{}],
        	//DeviceID: [{}],
        	//WorkShopID: [{}],
        	//LineID: [{}],
        	TypeID: [{}]
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
         "ID|序号|Readonly",
         "DeviceID|设备号|Readonly",
         "DeviceNo|设备编码|Readonly",
         "WorkShopName|车间|Readonly",
         "LineName|产线|Readonly",
         "ActiveTime|激活时刻|Readonly",
         "ModuleVersionID|点检模板|Readonly",
         "OperatorName|操作员|Readonly",
         "Result|结果|Readonly",
         "ShiftID|班次|Readonly",
         "Status|状态|Readonly",
         "SubmitTime|提交时刻|Readonly",
         "ModeText|任务模型|Readonly",
         "TypeText|任务类型|Readonly",
         "Times|次数|Readonly",
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
          "ItemID|点检项|ArrayOne",
          "TaskID|任务编号",
           "Result|结果|ArrayOne",
           "Reason|理由",
           "Comment|备注",
          "TaskType|任务类型|ArrayOne",
          "EditTime|修改时刻|DateTime",
          "Resource|资源|ArrayOne",
         ];
         KEYWORD_Device_Item = {

         };
         FORMATTRT_Device_Item = {};
         DEFAULT_VALUE_Device_Item = {
            
         };
         TypeSource_Device_Item = {
             Result: [{
                 name: "合格",
                 value: 1
             }, {
                 name: "不合格",
                 value: 0
             }],
             TaskType: [
              {
                  name: "保养",
                  value: 1
             },{
                 name: "维修",
                 value:  2
             } , {
                 name: "点检",
                 value: 3
             }],
             Resource: [{
                 name: "DMS",
                 value: 1
             }, {
                 name: "MES",
                 value: 2
             }],
             ItemID: [{
                 name: "焊头",
                 value: 6
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
         model = $com.Model.create({
             name: '点检日志',

             type: $com.Model.MAIN,

             configure: function () {
                 this.run();

             },

             events: function () { 
            
            //模糊查询所有列表
                 $("body").delegate("#zace-search-Device-task", "change", function () {

                     var $this = $(this),
                        value = $(this).val();
                     if (value == undefined || value == "" || value.trim().length < 1)
                         $("#femi-Device-tbody-task").children("tr").show();
                     else
                         $com.table.filterByLikeString($("#femi-Device-tbody-task"), DataAll_TaskSpot, value, "ID");
                 });
                 //点检日志导出（任务）
                 $("body").delegate("#zace-export-Device-task", "click", function () {
                     var $table = $(".table-part-Record"),
                          fileName = "点检记录列表.xls",
                          Title = "点检记录列表";
                     var params = $com.table.getExportParams($table, fileName, Title);

                     model.com.postExportExcel(params, function (res) {
                         var src = res.info.path;
                         window.open(src);
                     });

                 });

                 //查看任务详情
                 $("body").delegate("#zace-XQ", "click", function () {

                     var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-task"), "ID", DataAll_TaskSpot);

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

                     var default_value = {
                         ID: SelectData[0].ID,
                         DeviceName: SelectData[0].DeviceName,
                         DeviceNo: SelectData[0].DeviceNo,
                         WorkShopName: SelectData[0].WorkShopName,
                         LineName: SelectData[0].LineName,
                         ActiveTime: SelectData[0].ActiveTime,
                         ModuleVersionID: SelectData[0].ModuleVersionID,
                         OperatorName: SelectData[0].OperatorName,
                         Result: SelectData[0].Result,
                         ShiftID: SelectData[0].ShiftID,
                         Status: SelectData[0].Status,
                         SubmitTime: SelectData[0].SubmitTime,
                         ModeText: SelectData[0].ModeText,
                         TypeText: SelectData[0].TypeText,
                         Times: SelectData[0].Times,
                     };
                     $("body").append($com.propertyGrid.show($(".Typetable-task"), default_value, KEYWORD_Device_taskG, TypeSource_Device_taskG));

                 });
                 //隐藏(查看任务详情)
                 $("body").delegate("#cby-edit-ledger-YINC", "click", function () {
                     $(".zzza").css("margin-right", "0px");
                     $(".zzzb").hide();
                     $(".zzzc").hide();
                     $(".zzzb").width("0px");
                 })

 

                 //查看点检结果        
                 $("body").delegate("#zace-item-Device-DJResult", "click", function () {

                     var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-task"), "ID", DATABasic_TaskSpot);
               
                     if (!SelectData || !SelectData.length) {
                         alert("请先选择一行数据再试！")
                         return;
                     }
                     if (SelectData.length != 1) {
                         alert("只能同时对一行数据修改！")
                         return;
                     }
                     mResult = [];
                     for (var i = 0; i < DATABasic_TaskSpot.length; i++) {
                         for (var j = 0; j < DATABasic_Result.length; j++) {
                             if (DATABasic_TaskSpot[i].ID == DATABasic_Result[j].TaskID) {
                                 mResult.push(DATABasic_Result[j]);
                             }
                         }
                     }
                     var wlist = $com.util.Clone(mResult);
                     $.each(wlist, function (i, item) {
                         for (var p in item) {
                             if (!FORMATTRT_Device_Item[p])
                                 continue;
                             item[p] = FORMATTRT_Device_Item[p](item[p]);
                         }
                     });
                     $("#femi-Device-tbody-Item").html($com.util.template(wlist, HTML.TableNode_Item));
                     $("#femi-Device-tbody-Item tr").each(function (i, item) {
                         var $this = $(this);
                         var colorName = $this.css("background-color");
                         $this.attr("data-color", colorName);



                     });

                     $(".zzza").css("margin-right", "600px");
                     $(".zzzb").hide();
                     $(".zzzc").width("600px");
                     $(".zzzc").show();
                  
            });
                 //点检结果我的隐藏（我的点检）
                 $("body").delegate("#zace-Device-yinc", "click", function () {
                     $(".zzza").css("margin-right", "0px");
                     $(".zzza").show();
                     $(".zzzb").hide();
                     $(".zzzc").hide();
                     $(".zzzc").width("0px");
                 });
                 //备件维修日志
                 $("body").delegate("#zace-BJWX-Device-Apply", "click", function () {
                     var vdata = { 'header': '备件维修日志', 'href': './device_manage/deviceRepairRrecord-task-bj.html', 'id': 'deviceRepairRrecord-task-bj', 'src': './static/images/menu/deviceManage/deviceRepairLog.png' };
                     window.parent.iframeHeaderSet(vdata);
                 });
                 //设备维修日志
                 $("body").delegate("#zace-WX-Device-Apply", "click", function () {
                     var vdata = { 'header': '设备维修日志', 'href': './device_manage/deviceRepairRrecord-task.html', 'id': 'deviceRepairRrecord-task', 'src': './static/images/menu/deviceManage/deviceRepairLog.png' };
                     window.parent.iframeHeaderSet(vdata);
                 });

                 //备件点检日志
                 $("body").delegate("#zace-BJBY-Device-Apply", "click", function () {
                     var vdata = { 'header': '备件点检日志', 'href': './device_manage/deviceMaintainRrecord-task-bj.html', 'id': 'DeviceMaintainRrecord-task-bj', 'src': './static/images/menu/deviceManage/sparePartMaintainLog.png' };
                     window.parent.iframeHeaderSet(vdata);
                 });

                 //设备点检日志
                 $("body").delegate("#zace-BY-Device-Apply", "click", function () {
                     var vdata = { 'header': '设备点检日志', 'href': './device_manage/deviceMaintainRrecord-task.html', 'id': 'DeviceMaintain-task', 'src': './static/images/menu/deviceManage/sparePartMaintainLog.png' };
                     window.parent.iframeHeaderSet(vdata);
                 });


                 //设备点检日志(旧)
                 $("body").delegate("#zace-item-Device-DJ", "click", function () {
                     var vdata = { 'header': '旧设备点检日志', 'href': './device_manage/devicePointCheckRrecord-taskold.html', 'id': 'devicePointCheckRrecord-taskold', 'src': './static/images/menu/deviceManage/deviceRepairLog.png' };
                     window.parent.iframeHeaderSet(vdata);
                 });
             },





             run: function () {
                 //var wWorkShop = window.parent._WorkShop;
                 //var wLine = window.parent._Line;
                 //var wUser = window.parent._UserAll;
                 DateItem = [];
                 model.com.getDevicePointCheckItem({
                     ModelID: -1,
                     Name: "",
                     Active: -1,
                     StartTime: "2000-01-01",
                     EndTime: "2000-01-01",
                     ConfigType: 1,
                     BusinessUnitID: -1,
                     BaseID: -1,
                     FactoryID: -1,
                     WorkShopID:-1,
                     LineID: -1
                 }, function (res1) {
                     DateItem = res1.list;
                     $.each(res1.list, function (i, item) {
                         TypeSource_Device_Item.ItemID.push({
                             name: item.Name,
                             value: item.ID,
                             far: null
                         })
                     });
               
                     model.com.getDevicePointCheckType({
                         ModelID: -1,
                         Name: "",
                         Active: -1,
                         StartTime: "2000-01-01",
                         EndTime: "2000-01-01",
                         ConfigType: 1,
                         BusinessUnitID: -1,
                         BaseID: -1,
                         FactoryID: -1,
                         WorkShopID:-1,
                         LineID: -1
                     }, function (res3) {
                         $.each(res3.list, function (i, item) {

                             TypeSource_Device_task.TypeID.push({
                                 name: item.Name,
                                 value: item.ID,
                                 far: null
                             })
                         });
                         //$.each(wWorkShop, function (i, item) {
                         //    TypeSource_Device_task.WorkShopID.push({
                         //        name: item.Name,
                         //        value: item.ID,
                         //        far: null
                         //    })
                         //});

                         //$.each(wLine, function (i, item) {
                         //    TypeSource_Device_task.LineID.push({
                         //        name: item.Name,
                         //        value: item.ID,
                         //        far: null
                         //    })
                         //});
                         //$.each(wUser, function (i, item) {
                         //    TypeSource_Device_task.OperatorID.push({
                         //        name: item.Operator,
                         //        value: item.ID,
                         //        far: null
                         //    })
                         //});
                                 model.com.refresh();
                          });
                });
                 
               
             },

             com: {

                 refresh: function () {
                     //$("#femi-Device-tbody-task").html($com.util.template(resTaskList, HTML.TableNode_task));

                     model.com.getSFCTaskSpot({ EventID: 4001, person_judge: window._person_judge ? window._person_judge : 1 }, function (resTaskSpot) {
                         if (!resTaskSpot)
                             return;
                         if (resTaskSpot && resTaskSpot.list) {
                             var TaskSpot = $com.util.Clone(resTaskSpot.list);
                             DATABasic_TaskSpot = $com.util.Clone(resTaskSpot.list);
                             $.each(TaskSpot, function (i, item) {
                                 for (var p in item) {
                                     if (!FORMATTRT_Device_task[p])
                                         continue;
                                     item[p] = FORMATTRT_Device_task[p](item[p]);
                                 }
                             });
                             DataAll_TaskSpot = $com.util.Clone(TaskSpot);

                             $("#femi-Device-tbody-task").html($com.util.template(TaskSpot, HTML.TableNode_task));
                             $("#femi-Device-tbody-task tr").each(function (i, item) {
                                 var $this = $(this);
                                 var colorName = $this.css("background-color");
                                 $this.attr("data-color", colorName);



                             });

                         }

                     });

                     model.com.getDeviceItemResult({ TaskID: 0, TaskType: 0, Resource: 0, StartTime: "2000-04-26 19:15:19", EndTime: "4029-05-5 10:15:19" }, function (resResult) {
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

                             $("#femi-Device-tbody-Item").html($com.util.template(Result, HTML.TableNode_Item));
                             $("#femi-Device-tbody-Item tr").each(function (i, item) {
                                 var $this = $(this);
                                 var colorName = $this.css("background-color");
                                 $this.attr("data-color", colorName);



                             });

                         }
                     });

                 },

                 //查询点检任务
                 getSFCTaskSpot: function (data, fn, context) {
                     var d = {
                         $URI: "/SFCTaskSpot/All",
                         $TYPE: "get"
                     };

                     function err() {
                         $com.app.tip('获取失败，请检查网络');
                     }

                     $com.app.ajax($.extend(d, data), fn, err, context);
                 },
                 //工序任务操作（开工/完工）
                 postSFCTaskSpot: function (data, fn, context) {
                     var d = {
                         $URI: "/SFCTaskSpot/Update",
                         $TYPE: "post"
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
             }
         }),

model.init();

});