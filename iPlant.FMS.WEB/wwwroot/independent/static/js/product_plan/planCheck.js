require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($zace, $com) {

    var KEYWORD,
		KEYWORD_LIST,
		model,
		DEFAULT_VALUE,
		TypeSource,
        DataAll,
        FORMATTRT,
        HTML,
		TIME;
 TIME=$com.util.format('yyyy-MM-dd ', new Date());
    KEYWORD_LIST = [
		"Name|姓名",
		"LoginName|用户名",
		"DepartmentID|部门|ArrayOneControl",
		"Position|岗位|ArrayOneControl|DepartmentID",
		"Manager|职位|ArrayOne",
		//"grad|学历|ArrayOne",
		"CreateDate|创建时间|DateTime",
		"Operator|操作员",
		"Phone|电话号码",
		"WeiXin|微信",
		"Email|邮箱",
		"PhoneMAC|MAC地址",
		"Active|状态|ArrayOne",
		"DepartureDate|离职时间|DateTime",
		"Date1|时间|Date"
    ];

    HTML = {
        ArrangeList: [
           '<tr>',
           '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></th>',
           '<td style="min-width: 50px" data-title="WID" data-value="{{WID}}" >{{ WID}}</td>',
           '<td style="min-width: 50px" data-title="TaskText" data-value="{{TaskText}}" >{{ TaskText}}</td>',
           '<td style="min-width: 50px" data-title="WorkShopName" data-value="{{WorkShopName}}" >{{ WorkShopName}}</td>',
           '<td  style="min-width: 50px" data-title="LineName" data-value="{{LineName}}" >{{ LineName}}</td>',
           '<td style="min-width: 50px" data-title="OrderNo" data-value="{{OrderNo}}" >{{ OrderNo}}</td>',
		   '<td style="min-width: 50px" data-title="" data-value="{{}}" >{{ }}</td>',
           '<td style="min-width: 50px" data-title="ProductNo" data-value="{{ProductNo}}" >{{ ProductNo}}</td>',
           '<td style="min-width: 50px" data-title="PartName" data-value="{{PartName}}" >{{ PartName}}</td>',
           '<td style="min-width: 50px" data-title="FQTY" data-value="{{FQTY}}" >{{ FQTY}}</td>',
       					 '<td style="min-width: 50px" data-title="FQTYShift" data-value="{{FQTYShift}}" >{{ FQTYShift}}</td>',
       					 '<td style="min-width: 50px" data-title="FQTYParts" data-value="{{FQTYParts}}" >{{ FQTYParts}}</td>',
       					 '<td style="min-width: 50px" data-title="FQTYDone" data-value="{{FQTYDone}}" >{{ FQTYDone}}</td>',
       					 '<td style="min-width: 50px" data-title="PartHours" data-value="{{PartHours}}" >{{ PartHours}}</td>',
       					 '<td style="min-width: 50px" data-title="CraftMinutes" data-value="{{CraftMinutes}}" >{{ CraftMinutes}}</td>',
       					 '<td style="min-width: 50px" data-title="BOMNo" data-value="{{BOMNo}}" >{{ BOMNo}}</td>',
       					 '<td style="min-width: 50px" data-title="MaterialName" data-value="{{MaterialName}}" >{{ MaterialName}}</td>',
                         ,
		   '<tr>'
        ].join(""),
        ArrangeList2: [
                          '<tr>',
                          '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></th>',
                          '<td style="min-width: 50px" data-title="WID" data-value="{{WID}}" >{{ WID}}</td>',
                          '<td style="min-width: 50px" data-title="TaskText" data-value="{{TaskText}}" >{{ TaskText}}</td>',
                          '<td  style="min-width: 50px" data-title="PartPointOrderID" data-value="{{PartPointOrderID}}" >{{ PartPointOrderID}}</td>',
                          '<td style="min-width: 50px" data-title="WorkShopName" data-value="{{WorkShopName}}" >{{ WorkShopName}}</td>',
                          '<td style="min-width: 50px" data-title="LineName" data-value="{{LineName}}" >{{ LineName}}</td>',
                          '<td style="min-width: 50px" data-title="OrderNo" data-value="{{OrderNo}}" >{{ OrderNo}}</td>',
                          '<td style="min-width: 50px" data-title="ProductNo" data-value="{{ProductNo}}" >{{ ProductNo}}</td>',
                          '<td style="min-width: 50px" data-title="PartName" data-value="{{PartName}}" >{{ PartName}}</td>',
                          '<td style="min-width: 50px" data-title="PartPointName" data-value="{{PartPointName}}" >{{ PartPointName}}</td>',
                          '<td style="min-width: 50px" data-title="DeviceNo" data-value="{{DeviceNo}}" >{{ DeviceNo}}</td>',
                          '<td style="min-width: 50px" data-title="MaterialName" data-value="{{MaterialName}}" >{{ MaterialName}}</td>',
                          '<td style="min-width: 50px" data-title="MaterialNo" data-value="{{MaterialNo}}" >{{ MaterialNo}}</td>',
                          '<td style="min-width: 50px" data-title="FQTYShift" data-value="{{FQTYShift}}" >{{ FQTYShift}}</td>',
                          '<td style="min-width: 50px" data-title="BGMode" data-name="{{BGMode}}" >{{ BGMode}}</td>',
                          '<td style="min-width: 50px" data-title="PLMode" data-name="{{PLMode}}" >{{PLMode}}</td>',
                          '</tr>',
        ].join(""),
        ArrangeList3: [
               '<tr>',
                '<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
               '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></th>',
               //'<td style="min-width: 50px" data-title="for2" data-value="{{for2}}" >{{for2}}</td>',
              
               '<td  style="min-width: 50px" data-title="WorkShopName" data-value="{{WorkShopName}}" >{{ WorkShopName}}</td>',
               '<td style="min-width: 50px" data-title="LineName" data-value="{{LineName}}" >{{ LineName}}</td>',
               '<td style="min-width: 50px" data-title="PartName" data-value="{{PartName}}" >{{ PartName}}</td>',
               '<td style="min-width: 50px" data-title="ProductNo" data-value="{{ProductNo}}" >{{ ProductNo}}</td>',
               '<td style="min-width: 50px" data-title="PartPointName" data-value="{{PartPointName}}" >{{ PartPointName}}</td>',
               '<td style="min-width: 50px" data-title="DeviceNo" data-value="{{DeviceNo}}" >{{ DeviceNo}}</td>',
               '<td  style="min-width: 50px" data-title="MemberName8001" data-value="{{MemberName8001}}" >{{ MemberName8001}}</td>',
               '<td  style="min-width: 50px " data-title="MemberName1001" data-value="{{MemberName1001}}" >{{ MemberName1001}}</td>',
               '<td  style="min-width: 50px" data-title="MemberName5001" data-value="{{MemberName5001}}" >{{ MemberName5001}}</td>',
               '<td  style="min-width: 50px" data-title="MemberName5002" data-value="{{MemberName5002}}" >{{ MemberName5002}}</td>',
               '<td  style="min-width: 50px" data-title="MemberName6001" data-value="{{MemberName6001}}" >{{ MemberName6001}}</td>',
               '<td  style="min-width: 50px" data-title="MemberName7001" data-value="{{MemberName7001}}" >{{ MemberName7001}}</td>',
               '<td  style="min-width: 50px" data-title="MemberName4001" data-value="{{MemberName4001}}" >{{ MemberName4001}}</td>',
               '<td  style="min-width: 50px" data-title="MemberName7002" data-value="{{MemberName7002}}" >{{ MemberName7002}}</td>',
               '<td  style="min-width: 50px" data-title="MemberName7004" data-value="{{MemberName7004}}" >{{ MemberName7004 }}</td>',
               '<tr>'
        ].join(""),
        ArrangeList4: [
                         '<tr>',
                         '<td style="min-width: 50px" data-title="for" data-value="{{for}}" >{{ for}}</td>',
                         '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></th>',
                         
                         '<td style="min-width: 50px" data-title="PositionName" data-value="{{PositionName}}" >{{ PositionName}}</td>',
                         '<td  style="min-width: 50px" data-title="MemberName" data-value="{{MemberName}}" >{{ MemberName}}</td>',
                         '</tr>',
        ].join(""),
        ArrangeList5: [
              '<tr>',
              '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></th>',
              //'<td style="min-width: 50px" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
              '<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
              '<td  style="min-width: 50px" data-title="WorkShopName" data-value="{{WorkShopName}}" >{{ WorkShopName}}</td>',
              '<td style="min-width: 50px" data-title="LineName" data-value="{{LineName}}" >{{ LineName}}</td>',
              '<td style="min-width: 50px" data-title="PartName" data-value="{{PartName}}" >{{ PartName}}</td>',
              '<td class="Duty2001" style="min-width: 50px" data-title="MemberName2001" data-value="{{MemberName2001}}" >{{ MemberName2001}}</td>',
              '<td class="Duty3001" style="min-width: 50px " data-title="MemberName3001" data-value="{{MemberName3001}}" >{{ MemberName3001}}</td>',
              '<tr>'
        ].join(""),


    }
    FORMATTRT = {};
    DataAll = [];
    KEYWORD = {};
    DEFAULT_VALUE = {
        Name: "",
        DepartmentID: 0,
        Position: 0,
        Manager: 0,
        Phone: "",
        WeiXin: "",
        Email: "",
        PhoneMAC: 0,
        Active: "禁用"
    };
    TypeSource = {
        Active: [{
            name: "激活",
            value: 1
        }, {
            name: "禁用",
            value: 0
        }],
        DepartmentID: [{
            name: "无",
            value: 0
        }],
        Position: [{
            name: "无",
            value: 0,
            far: 0
        }],
        Manager: [{
            name: "职员",
            value: 0
        }, {
            name: "经理",
            value: 1
        }, {
            name: "学徒工",
            value: 2
        }],
    };
    //排班模板
    $(function() {
        KETWROD_LIST_Arrange = [
            "BGMode|报工模式|ArrayOne",
            "PLMode|报工模式|ArrayOne",
        ];
        KETWROD_Template_Arrange = {};

        Formattrt_Arrange = {};

        TypeSource_Arrange = {
            BGMode: [{
                name: "自动流转",
                value: 2
            }, 
            {
                name: "流转报工",
                value: 3
            },
            {
                name: "体检报工",
                value: 1
            }
            ],
            PLMode: [{
                name: "仓库配料",
                value: 1
            },
            {
                name: "上道自动送料",
                value: 2
            },
            {
                name: "上道自动送料",
                value: 3
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
    });


    $.each(KEYWORD_LIST, function (i, item) {
        var detail = item.split("|");
        KEYWORD[detail[0]] = {
            index: i,
            name: detail[1],
            type: detail.length > 2 ? detail[2] : undefined,
            control: detail.length > 3 ? detail[3] : undefined
        };
        if (detail.length > 2) {
            FORMATTRT[detail[0]] = $com.util.getFormatter(TypeSource, detail[0], detail[2]);
        }
    });
    model = $com.Model.create({
        name: '用户管理',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
           
            
            //计划列表
            $("body").delegate("#planList", "click", function () {
               

                var text = $(this).text();
                $("#list").text(text);
			     model.com.plist();
             });
            
            //工序计划列表
            $("body").delegate("#wp_planList", "click", function () {
                var text = $(this).text();
                $("#list").text(text);
			     model.com.wplist();
			 });
            //生产排班
            $("body").delegate("#produ_sch", "click", function () {
                var text = $(this).text();
                $("#list").text(text);
			     model.com.prolist();
			 });
            //管理排班
            $("body").delegate("#mana_sch", "click", function () {
                $("#adminList").hide();
                $("#wp_plist").hide();
                $("#rootList").hide();
                $("#produList").hide();
                $("#plist").hide();
			     var text = $(this).text();
			     $("#list").text(text);

			 });
          
            //机电修排班
			 $("body").delegate("#root_sch", "click", function (res) {
			     var text = $(this).text();
			     $("#list").text(text);
			     model.com.rlist();
			 });
            //导出
			 $("body").delegate("#export_planList", "click", function () {
			     var today = TIME.substring(0, 10);
			     var $table = $("#plist"),
                   fileName = "工序段计划"+today+".xls",
                   Title = "工序段计划";
			     var params = $com.table.getExportParams($table, fileName, Title);

			     model.com.getExportExcel(params, function (res) {
			         var src = res.info.path;
			         window.open(src);
			     });


			 });
			 $("body").delegate("#export_wp_planList", "click", function () {
			     var today = TIME.substring(0, 10);
			     var $table = $("#wp_plist"),
                   fileName = "工序计划列表" + today + ".xls",
                   Title = "工序计划列表";
			     var params = $com.table.getExportParams($table, fileName, Title);

			     model.com.getExportExcel(params, function (res) {
			         var src = res.info.path;
			         window.open(src);
			     });


			 });
			 $("body").delegate("#export_produ_sch", "click", function () {
			     var today = TIME.substring(0, 10);
			     var $table = $("#produList"),
                   fileName = "生产排班" + today + ".xls",
                   Title = "生产排班";
			     var params = $com.table.getExportParams($table, fileName, Title);

			     model.com.getExportExcel(params, function (res) {
			         var src = res.info.path;
			         window.open(src);
			     });


			 });
			 $("body").delegate("#export_root_sch", "click", function () {
			     var today = TIME.substring(0, 10);
			     var $table = $("#rootList"),
                   fileName = "机电修排班" + today + ".xls",
                   Title = "机电修排班";
			     var params = $com.table.getExportParams($table, fileName, Title);

			     model.com.getExportExcel(params, function (res) {
			         var src = res.info.path;
			         window.open(src);
			     });


			 });


           
              //条件查询
			 $("body").delegate("#zace-search-user", "click", function () {
			     
                 var default_value = {
                        Date1: $com.util.format('yyyy-MM-dd ', new Date()),
                    };
                    $("body").append($com.modal.show(default_value, KEYWORD, "查询", function (rst) {
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        default_value.Date1 = $com.util.format('yyyy-MM-dd hh:mm:ss', rst.Date1);
                        TIME = default_value.Date1;
                        //$("#shifts").text(TIME.substring(0, 10));
                        if ($("#plist").is(":visible")) {
                            $("#list").text("计划列表");
                            model.com.plist();
                        }
                        if ($("#wp_plist").is(":visible")) {
                            $("#list").text("工序计划列表");
                            model.com.wplist();
                        }
                        if ($("#produList").is(":visible")) {
                            $("#list").text("生产排班");
                            model.com.prolist();
                        }
                        if ($("#rootList").is(":visible")) {
                            $("#list").text("机电修排班");
                            model.com.rlist();
                        }
                    }));
		
             
           });

            //模糊查询
            $("body").delegate("#femi-search-text-ledger", "change", function () {
                var $this = $(this),
                   value = $(this).val();
                if ($("#plist").is(":visible")) {
                   
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-user-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-user-tbody"), DataAll, value, "WID");
                
                }
                if ($("#wp_plist").is(":visible")) {
                   
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-user-tbody2").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-user-tbody2"), DataAll, value, "WID");

                }
                if ($("#produList").is(":visible")) {

                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-user-tbody3").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-user-tbody3"), DataAll, value, "WID");

                }
                if ($("#rootList").is(":visible")) {

                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-user-tbody5").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-user-tbody5"), DataAll, value, "WID");

                }
                    
            });

          

        },

        run: function () {
            //加载班次
            //$("#shifts").text(TIME.substring(0,10));
            
            $("#adminList").hide();
            $("#wp_plist").hide();
            $("#rootList").hide();
            $("#produList").hide();
          var today=parseInt(TIME.replace(/-/g,"")+"01");
		  today=parseInt((today+"01"));
            //计划列表数据

            
            model.com.getTaskList({
                WorkShopID: 1,
                LineID: 0,
                shift_id: today,
                //Time: '2019-02-15 10:00:00'
            }, function (res) {
                if (!res)
                    return;
                var list = res.list,
            		rst = [];
                for (var i = 0; i < list.length; i++) {
                    list[i].WID = i + 1;
                }
                DataAll = list;
                $("#femi-user-tbody").html($com.util.template(list, HTML.ArrangeList));
            
              });
           

        },

        com: {
            //获取工序模式列表
            getAPSPartPointMode: function (data, fn, context) {
                var d = {
                    $URI: "/APSPartPointMode/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            plist: function () {
                $("#plist").show();
                $("#adminList").hide();
                $("#wp_plist").hide();
                $("#rootList").hide();
                $("#produList").hide();
               
                var today = parseInt(TIME.replace(/-/g, "") + "01");
                today = parseInt((today + "01"));
                //计划列表数据
                model.com.getTaskList({
                    WorkShopID: 1,
                    LineID: 0,
                    shift_id: today,
                    //Time: '2019-02-15 10:00:00'
                }, function (res) {
                    if (!res)
                        return;
                    var list = res.list,
                        rst = [];
                    for (var i = 0; i < list.length; i++) {
                        list[i].WID = i + 1;
                    }
                    DataAll = list;
                    $("#femi-user-tbody").html($com.util.template(list, HTML.ArrangeList));

                });

            },
            wplist:function(){
                var today = parseInt(TIME.replace(/-/g, "") + "01");
                today = parseInt((today + "01"));
                $("#plist").hide();
                $("#wp_plist").show();
                $("#adminList").hide();
                $("#produList").hide();
                $("#rootList").hide();
                
                //工序计划列表数据
                model.com.wp_getTaskList({
                    WorkShopID: 0,
                    LineID: 0,
                    shift_id: today,
                    //Time: '2019-02-15 10:00:00'
                }, function (res) {
                    if (!res)
                        return;
                    var list = res.list;
                        
                    
                        for (var i = 0; i < list.length; i++) {
                            list[i].WID = i + 1;
                            list[i].PLMode = "";
                        }
                    
                    var list1 = list;
                    model.com.getAPSPartPointMode({
                        WorkShopID: 0,
                        LineID: 0,
                        PartID:0,
                        //Time: '2019-02-15 10:00:00'
                    }, function (res) {
                        if (!res)
                            return;
                        var list2 = res.list,
                            rst = [];
                        var list3= model.com.createModeList3(list1,list2);
                        $.each(list3, function (i, item) {
                            for (var p in item) {
                                if (!Formattrt_Arrange[p])
                                    continue;
                                item[p] = Formattrt_Arrange[p](item[p]);
                              
                            }
                            $("#femi-user-tbody2").html($com.util.template(list3, HTML.ArrangeList2));
                        
                    });
                    });

                });
            },
            prolist:function(){
                var today = parseInt(TIME.replace(/-/g, "") + "01");
                today = parseInt((today + "01"));
                $("#plist").hide();
                $("#wp_plist").hide();
                $("#adminList").hide();
                $("#produList").show();
                $("#rootList").hide();
                

                //根据班次获取工序任务列表    模板
                model.com.wp_getTaskList({ WorkShopID: 1, LineID: 0, shift_id: today }, function (res) {
                    var zList = res.list;
                    var res_Position_Basicz = $com.util.Clone(res.list);

                    var _list = model.com.AddText(zList);

                    //根据班次获取排班列表
                    model.com.getProduList({ WorkShopID: 1, LineID: 0, shift_id: today }, function (res) {
                        var zz = res.list;

                        var modelList = model.com.createModeList(_list, zz);

                        $.each(modelList, function (i, item) {
                            for (var p in item) {
                                if (!Formattrt_Arrange[p])
                                    continue;
                                item[p] = Formattrt_Arrange[p](item[p]);
                            }
                        });
                        
                        DataAll = modelList;
                        res_Position_BasiczList = $com.util.Clone(res.list);
                        $("#femi-user-tbody3").html($com.util.template(modelList, HTML.ArrangeList3));
                    });
                });

            },
            rlist:function(){
                var today = parseInt(TIME.replace(/-/g, "") + "01");
                today = parseInt((today + "01"));
                $("#plist").hide();
                $("#wp_plist").hide();
                $("#adminList").hide();
                $("#produList").hide();
                $("#rootList").show();                model.com.getDeviceAll({
                    WorkShopID: 0,
                    LineID: 0,
                    Module: 2001,
                    GroupID: 0,

                }, function (res) {


                    var res_Position_Basicz = $com.util.Clone(res.list);
                    var WorkLinePartList = [];
                    for (var i = 0; i < res_Position_Basicz.length; i++) {
                        res_Position_Basicz[i].PartPoint.WID = i + 1;
                        res_Position_Basicz[i].PartPoint.MemberName2001 = "";
                        res_Position_Basicz[i].PartPoint.MemberName3001 = "";

                        WorkLinePartList.push(res_Position_Basicz[i].PartPoint);

                    }
                    //根据班次获取排班列表
                    model.com.getProduList({ WorkShopID: 1, LineID: 0, shift_id: today }, function (res) {
                        var zzData = res.list;
                        var Wmodel = $com.util.Clone(WorkLinePartList);
                        var modelList = [];
                        if (zzData.length > 0) {
                             modelList = model.com.createModeList1(Wmodel, zzData);

                        }
                        for (var i = 0; i < list.length; i++) {
                            list[i].WID = i + 1;
                        }
                        DataAll = modelList;
                        res_Position_BasiczList = $com.util.Clone(res.list);
                        $("#femi-user-tbody5").html($com.util.template(modelList, HTML.ArrangeList5));




                    });
                });
            },
			
			//计划列表
			getTaskList: function(data, fn, context) {
				var d = {
					$URI: "/APSTask/PartAll",
					$TYPE: "get"
				};
			
				function err() {
					$com.app.tip('获取失败，请检查网络');
				}
			
				$com.app.ajax($.extend(d, data), fn, err, context);
			},
			//工序计划列表
			wp_getTaskList: function(data, fn, context) {
				var d = {
					$URI: "/APSTask/PartPointAll",
					$TYPE: "get"
				};
			
				function err() {
					$com.app.tip('获取失败，请检查网络');
				}
			
				$com.app.ajax($.extend(d, data), fn, err, context);
			},
            //生产排班
			getProduList: function (data, fn, context) {
			    var d = {
			        $URI: "/ScheduleWorker/GetByShfit",
			        $TYPE: "get"
			    };

			    function err() {
			        $com.app.tip('获取失败，请检查网络');
			    }

			    $com.app.ajax($.extend(d, data), fn, err, context);
			},
            //管理排班
			getAdminList: function (data, fn, context) {
			    var d = {
			        $URI: "/SchedulePosition/ManagerAll",
			        $TYPE: "get"
			    };

			    function err() {
			        $com.app.tip('获取失败，请检查网络');
			    }

			    $com.app.ajax($.extend(d, data), fn, err, context);
			},
            //机电修排班
			getRootList: function (data, fn, context) {
			    var d = {
			        $URI: "/SchedulePosition/DeviceAll",
			        $TYPE: "get"
			    };

			    function err() {
			        $com.app.tip('获取失败，请检查网络');
			    }

			    $com.app.ajax($.extend(d, data), fn, err, context);
			},
			//导出
			getExportExcel: function(data, fn, context) {
				var d = {
					$URI: "/Upload/ExportExcel",
					$TYPE: "post"
				};
			
				function err() {
					$com.app.tip('获取失败，请检查网络');
				}
			
				$com.app.ajax($.extend(d, data), fn, err, context);
			},
			createModeList: function (_list, zList) {
			    res_Position_Basic1001 = [];
			    res_Position_Basic8001 = [];
			    res_Position_Basic5001 = [];
			    res_Position_Basic5002 = [];
			    res_Position_Basic6001 = [];
			    res_Position_Basic7001 = [];
			    res_Position_Basic4001 = [];
			    res_Position_Basic7002 = [];
			    res_Position_Basic7004 = [];
			    for (var j = 0; j < _list.length; j++) {
			        for (var i = 0; i < zList.length; i++) {
			            switch (zList[i].ScheduleMode) {
			                case 1001:
			                    if (_list[j].WorkShopID == zList[i].WorkShopID && _list[j].LineID == zList[i].LineID && _list[j].PartID == zList[i].PartID && _list[j].PartPointID == zList[i].PartPointID) {
			                        _list[j].MemberName1001 = zList[i].MemberName;
			                        res_Position_Basic1001.push(zList[i]);

			                    }
			                    break;
			                case 8001:
			                    if (_list[j].WorkShopID == zList[i].WorkShopID && _list[j].LineID == zList[i].LineID && _list[j].PartID == zList[i].PartID && _list[j].PartPointID == zList[i].PartPointID) {

			                        _list[j].MemberName8001 = zList[i].MemberName;
			                        res_Position_Basic8001.push(zList[i]);

			                    }
			                    break;
			                case 5001:
			                    if (_list[j].WorkShopID == zList[i].WorkShopID && _list[j].LineID == zList[i].LineID && _list[j].PartID == zList[i].PartID && _list[j].PartPointID == zList[i].PartPointID) {

			                        _list[j].MemberName5001 = zList[i].MemberName;
			                        res_Position_Basic5001.push(zList[i]);

			                    }
			                    break;
			                case 5002:
			                    if (_list[j].WorkShopID == zList[i].WorkShopID && _list[j].LineID == zList[i].LineID && _list[j].PartID == zList[i].PartID && _list[j].PartPointID == zList[i].PartPointID) {

			                        _list[j].MemberName5002 = zList[i].MemberName;
			                        res_Position_Basic5002.push(zList[i]);

			                    }
			                    break;
			                case 6001:
			                    if (_list[j].WorkShopID == zList[i].WorkShopID && _list[j].LineID == zList[i].LineID && _list[j].PartID == zList[i].PartID && _list[j].PartPointID == zList[i].PartPointID) {

			                        _list[j].MemberName6001 = zList[i].MemberName;
			                        res_Position_Basic6001.push(zList[i]);

			                    }
			                    break;
			                case 7001:
			                    if (_list[j].WorkShopID == zList[i].WorkShopID && _list[j].LineID == zList[i].LineID && _list[j].PartID == zList[i].PartID && _list[j].PartPointID == zList[i].PartPointID) {

			                        _list[j].MemberName7001 = zList[i].MemberName;
			                        res_Position_Basic7001.push(zList[i]);

			                    }
			                    break;
			                case 4001:
			                    if (_list[j].WorkShopID == zList[i].WorkShopID && _list[j].LineID == zList[i].LineID && _list[j].PartID == zList[i].PartID && _list[j].PartPointID == zList[i].PartPointID) {

			                        _list[j].MemberName4001 = zList[i].MemberName;
			                        res_Position_Basic4001.push(zList[i]);

			                    }
			                    break;
			                case 7002:
			                    if (_list[j].WorkShopID == zList[i].WorkShopID && _list[j].LineID == zList[i].LineID && _list[j].PartID == zList[i].PartID && _list[j].PartPointID == zList[i].PartPointID) {

			                        _list[j].MemberName7002 = zList[i].MemberName;
			                        res_Position_Basic7002.push(zList[i]);

			                    }
			                    break;
			                case 7004:
			                    if (_list[j].WorkShopID == zList[i].WorkShopID && _list[j].LineID == zList[i].LineID && _list[j].PartID == zList[i].PartID && _list[j].PartPointID == zList[i].PartPointID) {

			                        _list[j].MemberName7004 = zList[i].MemberName;
			                        res_Position_Basic7004.push(zList[i]);

			                    }
			                    break;

			            }


			        }
			    }
			    return _list;

			},
			AddText: function (list) {
			    var _list = $com.util.Clone(list);
			    for (var i = 0; i < _list.length; i++) {
			        _list[i].WID = i + 1;
			        _list[i].MemberName8001 = "";
			        _list[i].MemberName1001 = "";
			        _list[i].MemberName5001 = "";
			        _list[i].MemberName5002 = "";
			        _list[i].MemberName6001 = "";
			        _list[i].MemberName7001 = "";
			        _list[i].MemberName4001 = "";
			        _list[i].MemberName7002 = "";
			        _list[i].MemberName7004 = "";
			    }
			    return _list;
			},
			getDeviceAll: function (data, fn, context) {
                var d = {
                    $URI: "/SchedulePosition/DeviceAll",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
			},
			createModeList1: function (_list, zList) {
			    res_Position_Basic2001 = [];
			    res_Position_Basic3001 = [];

			    for (var j = 0; j < _list.length; j++) {
			        for (var i = 0; i < zList.length; i++) {
			            switch (zList[i].ScheduleMode) {
			                case 2001:
			                    if (_list[j].WorkShopID == zList[i].WorkShopID && _list[j].LineID == zList[i].LineID &&
			                        //_list[j].PartID == zList[i].PartID &&
                                    _list[j].PartID == zList[i].PartPointID) {
			                        _list[j].MemberName2001 = zList[i].MemberName;
			                        res_Position_Basic2001.push(zList[i]);

			                    }
			                    break;
			                case 3001:
			                    if (_list[j].WorkShopID == zList[i].WorkShopID && _list[j].LineID == zList[i].LineID &&
			                        //_list[j].PartID == zList[i].PartID &&
                                    _list[j].PartID == zList[i].PartPointID) {

			                        _list[j].MemberName3001 = zList[i].MemberName;
			                        res_Position_Basic3001.push(zList[i]);

			                    }
			                    break;

			            }


			        }
			    }
			    return _list;

			},
			createModeList3: function (list1, list2) {
			    PLMode = [];
			    for (var j = 0; j < list1.length; j++) {
			        for (var i = 0; i < list2.length; i++) {
			         
			            if (list1[j].WorkShopID == list2[i].WorkShopID && list1[j].LineID == list2[i].LineID && list1[j].PartID == list2[i].PartID && list1[j].PartPointID == list2[i].PartPointID) {
			                        list1[j].PLMode = list2[i].PLMode;
			                        PLMode.push(list2[i]);
			                    }
			        }
			    }
			    return list1;

			},

            
            refresh: function () {
                model.com.get({}, function (res) {
                    if (res && res.list) {
                        // $('.tb_users').bootstrapTable('load', res.list);                      
                        var _list = $com.util.Clone(res.list);
                        $.each(_list, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT[p])
                                    continue;
                                item[p] = FORMATTRT[p](item[p]);
                            }
                        });
                        DataAll = res.list;
                        $("#femi-user-tbody").html($com.util.template(_list, HTML.TableUserItemNode));
                    }
                });
            },
            add: function (data, fn, context) {
                var d = {
                    $URI: "/User/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            reset: function (data, fn, context) {
                var d = {
                    $URI: "/User/RetrievePassword",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            active: function (data, fn, context) {
                var d = {
                    $URI: "/User/Active",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            utils: {
                getSon: function (list) {
                    var _rst = [];
                    $.each(list, function (i, item) {
                        _rst.push(item);
                        if (item.SonList) {
                            var _arr = model.com.utils.getSon(item.SonList);
                            _rst = _rst.concat(_arr);


                        }

                    });
                    return _rst;
                },
                getSource: function (list) {
                    var _rst = [];
                    $.each(list, function (i, item) {
                        if (item.Active)
                            _rst.push({
                                value: item.ID,
                                name: item.Name,
                                far: item.DepartmentID
                            });
                    });
                    return _rst;
                }
            }
        }
    });

    model.init();


});