require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {
        var KEYWORD_Device_LIST_item,
        KEYWORD_Device_item,
        FORMATTRT_Device_item,
        DEFAULT_VALUE_Device_item,
        TypeSource_Device_item,
       
        KEYWORD_Device_LIST_itemG,
        KEYWORD_Device_itemG,
        FORMATTRT_Device_itemG,
        DEFAULT_VALUE_Device_itemG,
        TypeSource_Device_itemG,
        DJItem,
        mID,
		model,
        item,
        HTML;
        
        mID=0;
  
    HTML = {
       TableNode_item: [
            '<tr data-color="">',
            '<td style="width: 3px"><input type="checkbox"',
		    'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
	        '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td>',
            '<td style="min-width: 50px" data-title="Name" data-value="{{Name}}">{{Name}}</td>',
             '<td style="min-width: 50px" data-title="BusinessUnitID " data-value="{{BusinessUnitID }}">{{BusinessUnitID }}</td>',
             //'<td style="min-width: 50px" data-title="BaseID" data-value="{{BaseID}}">{{BaseID}}</td>',
             // '<td style="min-width: 50px" data-title="FactoryID " data-value="{{FactoryID }}">{{FactoryID }}</td>',
              '<td style="min-width: 50px" data-title="WorkShopID " data-value="{{WorkShopID }}">{{WorkShopID}}</td>',
              '<td style="min-width: 50px" data-title="LineID" data-value="{{LineID}}">{{LineID }}</td>',
            '<td style="min-width: 50px" data-title="ModelID" data-value="{{ModelID}}" >{{ModelID}}</td>',
             '<td style="min-width: 50px" data-title="SecondTime" data-value="{{SecondTime}}">{{SecondTime}}</td>',
            '<td style="min-width: 50px" data-title="CareItems" data-value="{{CareItems}}">{{CareItems}}</td>',
             '<td style="min-width: 50px" data-title="UnqualifiedOptions" data-value="{{UnqualifiedOptions}}">{{UnqualifiedOptions}}</td>',
             '<td style="min-width: 50px" data-title="Comment " data-value="{{Comment }}">{{Comment }}</td>',
            '<td style="min-width: 50px" data-title="OperatorTime " data-value="{{OperatorTime }}">{{OperatorTime }}</td>',
            '<td style="min-width: 50px" data-title="OperatorID " data-value="{{OperatorID }}">{{OperatorID }}</td>',
            '<td style="min-width: 50px" data-title="EditTime " data-value="{{EditTime }}">{{EditTime }}</td>',
            '<td style="min-width: 50px" data-title="EditorID " data-value="{{EditorID }}">{{EditorID }}</td>',
             '<td style="min-width: 50px" data-title="ConfigType " data-value="{{ConfigType}}">{{ConfigType}}</td>',
            '<td style="min-width: 50px" data-title="Active" data-value="{{Active}}">{{Active}}</td>',
            
             
			'</tr>',
        ].join(""),
    }

    $(function () {
        KEYWORD_Device_LIST_item = [
         "ID|编号",
         "Name|名称",
         "ModelID|工位|ArrayOne",
         "CareItems|注意事项|InputArray",
         "UnqualifiedOptions|不合格选项|InputArray",
         "SecondTime|所需时间",
         "Comment|备注|LongText",
         "Active|状态|ArrayOne",
         "OperatorID|录入人|ArrayOne",
         "OperatorTime|录入时刻|DateTime",
         "EditTime|修改时刻|DateTime",
         "EditorID|修改人|ArrayOne",
         "BusinessUnitID|部门|ArrayOne",
         "BaseID|基地",
         "FactoryID|工厂||ArrayOne",
         "WorkShopID|车间|ArrayOne",
         "LineID|产线|ArrayOne",
         "ConfigType|类型|ArrayOne",
         
        ];
        KEYWORD_Device_item = {};
        FORMATTRT_Device_item = {};
        DEFAULT_VALUE_Device_item = {
           Name: "",
           ModelID:0,
           UnqualifiedOptions:[],
           CareItems:[],
           SecondTime: 0,
           Comment: "",
           Active: 1,
           BusinessUnitID: 0,
           WorkShopID: 0,
           LineID: 0,
        };
       
        TypeSource_Device_item = {
     	     ModelID:[{
                name: "无",
                value: 0
            }],
     	     Active: [{
     	         name: "激活",
     	         value: 1
     	     }, {
     	         name: "禁用",
     	         value: 0
     	     }],
     	       OperatorID:[{
                name: "无",
                value: 0
            }],
     	      EditorID:[{
                name: "无",
                value: 0
            }],
     	      BusinessUnitID: [{
     	          name: "无",
     	          value: 0
     	      }],
     	      WorkShopID: [{
     	          name: "无",
     	          value: 0
     	      }],
     	      LineID: [{
     	          name: "无",
     	          value: 0
     	      }],
     	      FactoryID: [{
     	          name: "无",
     	          value: 0
     	      }],
     	      ConfigType: [{
     	          name: "设备",
     	          value: 1
     	      }, {
     	          name: "工位",
     	          value: 2
     	      }, {
     	          name: "生产",
     	          value: 3
     	      }],
        };
    

        $.each(KEYWORD_Device_LIST_item, function (i, item) {
            var detail = item.split("|");
            KEYWORD_Device_item[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_Device_item[detail[0]] = $com.util.getFormatter(TypeSource_Device_item, detail[0], detail[2]);
            }
        });
    });
        
    model = $com.Model.create({
        name: '设备点检项',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
           

            
            //设备点检(点检项)模糊查询
            $("body").delegate("#zace-search-Device-item", "change", function () {

                var $this = $(this),
                   value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-Device-tbody-item").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-Device-tbody-item"),DataAll, value, "ID");
            });
      
            //设备点检修改(项目表)
            $("body").delegate("#zace-edit-Device-item", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-item"), "ID", DATABasic);

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
                    ModelID: SelectData[0].ModelID,
                    CareItems: SelectData[0].CareItems,
                    Comment: SelectData[0].Comment,
                    SecondTime: SelectData[0].SecondTime,
                    UnqualifiedOptions: SelectData[0].UnqualifiedOptions,
                    SecondTime: SelectData[0].SecondTime,
                    BusinessUnitID: SelectData[0].BusinessUnitID,
                    Active: SelectData[0].Active,
                   // FactoryID: SelectData[0].FactoryID,
                    WorkShopID: SelectData[0].WorkShopID,
                    LineID: SelectData[0].LineID,
                   // ConfigType: SelectData[0].ConfigType,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Device_item, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].Name = rst.Name;
                    SelectData[0].ModelID = Number(rst.ModelID);
                    SelectData[0].CareItems= rst.CareItems; 
                    SelectData[0].Comment = rst.Comment;
                    SelectData[0].SecondTime = rst.SecondTime;
                    SelectData[0].UnqualifiedOptions = rst.UnqualifiedOptions;
                    SelectData[0].BusinessUnitID = Number(rst.BusinessUnitID);
                   // SelectData[0].BaseID = rst.BaseID;
                   // SelectData[0].FactoryID = rst.FactoryID;
                    SelectData[0].WorkShopID = Number(rst.WorkShopID);
                    SelectData[0].LineID = Number(rst.LineID);
                    SelectData[0].Active = Number(rst.Active);
                   // SelectData[0].ConfigType = rst.ConfigType;
                    var _list = [];
                    for (var i = 0; i < DJItem.length; i++) {
                        if (SelectData[0].ID != DJItem[i].ID) {
                            _list.push(DJItem[i]);
                        }
                    }
                    for (var i = 0; i < _list.length; i++) {
                        if (_list[i].Name == rst.Name && _list[i].ModelID == Number(rst.ModelID)) {
                            alert("点检项出现重复！");
                            return false;
                        }
                    }
       
                    model.com.postDevicePointCheckItem({
                        data: SelectData[0]
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                    })

                }, TypeSource_Device_item));


            });
          
            //设备点检新增(项目表)
            $("body").delegate("#zace-add-Device-item", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_Device_item, KEYWORD_Device_item, "新增", function (rst) {
                    //调用插入函数 

                    if (!rst || $.isEmptyObject(rst))
                        return;
                 
                 var  ItemTemp = {
                        ID: 0,
                        Name: rst.Name,
                        ModelID:Number(rst.ModelID),
                        CareItems: rst.CareItems,
                        UnqualifiedOptions: rst.UnqualifiedOptions,
                        SecondTime: Number(rst.SecondTime),
                        Comment: rst.Comment,
                        OperatorTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                        OperatorID: 0,
                        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                        EditorID: 0,
                        Active: Number(rst.Active),
                        BusinessUnitID: Number(rst.BusinessUnitID),
                        FactoryID: 1,
                        WorkShopID: Number(rst.WorkShopID),
                        LineID: Number(rst.LineID),
                        ConfigType: 2,
                        BaseID: 0,

                    };
                 for (i = 0; i < DJItem.length; i++) {
                     if (DJItem[i].Name == rst.Name && DJItem[i].ModelID == Number(rst.ModelID)) {
                         alert("点检项出现重复！");
                         return false;
                     }
                 }
                    model.com.postDevicePointCheckItem({
                        data: ItemTemp
                    }, function (res) {
                        model.com.refresh();
                        alert("新增成功");

                    })

                }, TypeSource_Device_item));


            });


            //设备点检导出(项目表)
            $("body").delegate("#zace-export-Device-item", "click", function () {
                var $table = $(".table-part"),
                     fileName = "点检项目表.xls",
                     Title = "点检项目表";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });

            });
            //筛选
            $("body").delegate("#zace-Device-Searchitem", "click", function () {
                var default_value = {
                    LineID: 0,
                    //WorkShopID: 0,
                    //LineID: 0,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Device_item, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.LineID = Number(rst.LineID);
                    //default_value.WorkShopID = Number(rst.WorkShopID);
                    //default_value.LineID = Number(rst.LineID);

                    $com.table.filterByConndition($("#femi-Device-tbody-item"), DJItem, default_value, "ID");
                   

                }, TypeSource_Device_item));


            });
//            //设备点检激活(项目表)
//			$("body").delegate("#zace-active-Device-item", "click", function() {

//				// var SelectData = $('.tb_users').bootstrapTable('getSelections');
//				var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-item"), "ID", DATABasic);

//				if (!SelectData || !SelectData.length) {
//					alert("至少选择一行数据！")
//					return;
//				}
//				if (!confirm("已选择" + SelectData.length + "条数据，确定将其激活？")) {
//					return;
//				}
//				model.com.postActive({
//					data: SelectData,
//					Active: 1
//				}, function(res) {
//					alert("激活成功");
//					model.com.refresh();
//				})
//			});
        
////          //设备点检禁用(项目表)           
//             $("body").delegate("#zace-remove-Device-item", "click", function() {

//				var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-item"), "ID", DATABasic);

//				if (!SelectData || !SelectData.length) {
//					alert("至少选择一行数据！")
//					return;
//				}
//				if (!confirm("已选择" + SelectData.length + "条数据，确定将其禁用？")) {
//					return;
//				}
//				model.com.postActive({
//					data: SelectData,
//					Active: 0
//				}, function(res) {
//					alert("禁用成功");
//					model.com.refresh();
//				})
//			});
           
   
        },


        run: function () {
            var wUser = window.parent._UserAll;
            var wBusiness  = window.parent._Business;
            var wFactory = window.parent._Factory;
            var wWorkShop = window.parent._WorkShop;
            var wLine = window.parent._Line;
            var wStation = window.parent._Station;
            model.com.getDeviceModel({ DeviceWorkType: 0, SupplierID: 0, ModelPropertyID: 0, SystemID: 0, SystemPropertyID: 0, ControllerID: 0, ControllerPropertyID: 0, Active: -1, SupplierModelNo: "", SystemVersion: "", ControllerModel: "", StartTime: "2019-02-10 15:38:29", EndTime: "2029-05-10 15:38:29" }, function (res1) {

                $.each(wStation, function (i, item) {

                    TypeSource_Device_item.ModelID.push({
                        name: item.Name,
                        value: item.ID,
                        far: null
                    })
                });
                

                $.each(wUser, function (i, item) {
                    TypeSource_Device_item.OperatorID.push({
                        name: item.Name,
                        value: item.ID,
                        far: null
                    })
                });
                
                $.each(wUser, function (i, item) {
                    TypeSource_Device_item.EditorID.push({
                        name: item.Name,
                        value: item.ID,
                        far: null
                    })
                });


                $.each(wBusiness, function (i, item) {
                         TypeSource_Device_item.BusinessUnitID.push({
                             name: item.Name,
                             value: item.ID,
                             far: null
                         })
                     });

                $.each(wWorkShop, function (i, item) {
                             TypeSource_Device_item.WorkShopID.push({
                                 name: item.Name,
                                 value: item.ID,
                                 far: null
                             })
                         });


                $.each(wLine, function (i, item) {
                                 TypeSource_Device_item.LineID.push({
                                     name: item.Name,
                                     value: item.ID,
                                     far: null
                                 })
                             });


                 $.each(wFactory, function (i, item) {
                                     TypeSource_Device_item.FactoryID.push({
                                         name: item.Name,
                                         value: item.ID,
                                         far: null
                                     })
                                 });

                 model.com.refresh();
                     });
        },

        com: {
            refresh: function () {

//           ModelID:{int},Name:{String},DSType:{int}, Active:{int},StartTime:{DateTime},EndTime:{DateTime}
                model.com.getDevicePointCheckItem({
                    ModelID: -1,
                    Name: "",
                    Active: -1,
                    StartTime: "2000-01-01",
                    EndTime: "2000-01-01",
                    ConfigType: 2,
                    BusinessUnitID: -1,
                    BaseID: -1,
                    FactoryID: -1,
                    WorkShopID: -1,
                    LineID:-1
                }, function (resItem) {
                    if (!resItem)
                        return;
                    if (resItem && resItem.list) {
                        var Item = $com.util.Clone(resItem.list);
                        DJItem = $com.util.Clone(resItem.list);
                        DATABasic = $com.util.Clone(resItem.list);

                        $.each(Item, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Device_item[p])
                                    continue;
                                item[p] = FORMATTRT_Device_item[p](item[p]);
                            }
                        });
                       DataAll = $com.util.Clone(Item);
                       //DataSH = $com.util.Clone(Item[0].LifeRatioList);
                        $("#femi-Device-tbody-item").html($com.util.template(Item, HTML.TableNode_item));                       
                        $("#femi-Device-tbody-item tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });
                    }

                }); 
                
                

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

            //添加或修改设备/备件点检项
            postDevicePointCheckItem: function (data, fn, context) {
                var d = {
                    $URI: "/DevicePointCheckItem/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            
            //激活
           postActive: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceMaintainItem/Active",
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
        }
    }),

model.init();
   
});