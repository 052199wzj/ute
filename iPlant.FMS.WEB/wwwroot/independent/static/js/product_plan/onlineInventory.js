require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {

    var KEYWORD_MODE_LIST,//工序
       KEYWORD_MODE,
       FORMATTRT_MODE,
       DEFAULT_VALUE_MODE,
       TypeSource_MODE,
      
       FORMATTRT

    List1 = [];
    List2 = [];
    TIME = $com.util.format('yyyy-MM-dd hh:mm:ss', '2019-2-11 11:11:11');
    TIME2 = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date());
   
    HTML = { 
        TablePartMode: [
                 '<tr data-color="">',
                 '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                 '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
                 '<td data-title="LineName" data-value="{{LineName}}" >{{LineName}}</td>',
                 '<td data-title="PartName" data-value="{{PartName}}" >{{PartName}}</td>',
                 '<td data-title="PartPointName" data-value="{{PartPointName}}" >{{PartPointName}}</td>',
                 '<td data-title="MaterialName" data-value="{{MaterialName}}" >{{MaterialName}}</td>',
                 '<td data-title="MaterialNo" data-value="{{MaterialNo}}" >{{MaterialNo}}</td>',
                 '<td data-title="FQTYOutStock" data-value="{{FQTYOutStock}}" >{{FQTYOutStock}}</td>',
                 '<td data-title="FQTYInStock" data-value="{{FQTYInStock}}" >{{FQTYInStock}}</td>',
                 '<td data-title="FQTYOnSite" data-value="{{FQTYOnSite}}" >{{FQTYOnSite}}</td>',
                 '<td data-title="FQTYInventroy" data-value="{{FQTYInventroy}}" >{{FQTYInventroy}}</td>',
                 '<td data-title="InventroyTime" data-value="{{InventroyTime}}" >{{InventroyTime}}</td>',
                 '<td data-title="SubmitTime" data-value="{{SubmitTime}}" >{{SubmitTime}}</td>',                 
                 '</tr>',
        ].join(""),
       TablePropertyItemNode: [
			'<tr data-color="">',
			'<td style="width: 3px"><input type="checkbox"    ',
			'	class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
			'<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
			'<td style="min-width: 50px" data-title="Name" data-value="{{Name}}">{{Name}}</td>    ',
			'<td style="min-width: 50px" data-title="Operator" data-value="{{Operator}}">{{Operator}}</td>   ',
			'<td style="min-width: 50px" data-title="EditTime" data-value="{{EditTime}}">{{EditTime}}</td> ',
			'<td style="min-width: 50px" data-title="Active" data-value="{Active}}">{{Active}}</td>  ',
			'</tr>',
        ].join(""),
    };


 
    (function () {
        KEYWORD_LIST = [
			"DeviceNo|设备号",
			"DeviceName|名称",
			"WorkShopID|车间|ArrayOne",
			"LineID|产线|ArrayOne|workShopID",
			"DeviceTypeID|设备类型|ArrayOne",
			"SupplierID|供应商|ArrayOne",
			"MachineTypeID|机器型号|ArrayOne",
			"SystemID|系统|ArrayOne",
			"ControllerTypeID|控制器|ArrayOne",
			"IP|IP|IP",
			"Price|净值",
			"Depreciation|残值",
			"Status|状态|ArrayOne",
			"EditTime|录入时间|DateTime",
            "Date1|起始日期|Date",
            "Date2|结束日期|Date"
        ];
        FORMATTRT = {};
        KEYWORD = {};
        DEFAULT_VALUE = {
            DeviceNo: "",
            DeviceName: "",
            WorkShopID: 0,
            LineID: 0,
            DeviceTypeID: 0,
            SupplierID: 0,
            MachineTypeID: 0,
            SystemID: 0,
            ControllerTypeID: 0,
            IP: "",
            Price: 0,
            Depreciation: 0,
        };

        TypeSource = {
            WorkShopID: [{
                name: "全部",
                value: 0
            }],
            LineID: [{
                name: "全部",
                value: 0,
                far: 0
            }],
            DeviceTypeID: [],
            SupplierID: [],
            DeviceTypeID: [],
            MachineTypeID: [],
            SystemID: [],
            ControllerTypeID: [],
            Status: [{
                name: "未知",
                value: 0
            }, {
                name: "启用",
                value: 1
            }, {
                name: "保养",
                value: 2
            }, {
                name: "故障",
                value: 3
            }, {
                name: "报废",
                value: 4
            }]
        };
        $.each(KEYWORD_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT[detail[0]] = $com.util.getFormatter(TypeSource, detail[0], detail[2]);
            }

        });

    })();

    $(function () {
        KEYWORD_Point_LIST = [
         "WorkShopID|车间|ArrayOneControl",
         "LineID|产线|ArrayOneControl|WorkShopID",
         "ProductName|规格名称",
         "ProductNo|规格编号|ArrayOne",
         "PartPointID|工序|ArrayOne|PartPointID",
         "Hours|标准工时(秒)",
         "PartLiftMinutes|换装换型时间(分钟)",
         "NormalTaskRatio|正常排班系数",
         "MaxTaskRatio|最大排班系数",
         "Creator|创建者",
         "CreateTime|创建时间|Date",
         "OperatorID|操作员|ArrayOne",
        ];
        KEYWORD_Point = {};
        FORMATTRT_Point = {};
        DEFAULT_VALUE_Point = {
            hours: 0,
            PartLiftMinutes: 0,
            NormalTaskRatio: 0.0,
            MaxTaskRatio: 0.0,

        };
        TypeSource_Point = {
            WorkShopID: [
                {
                    name: "全部",
                    value: 0,
                },
                  {
                      name: "磨加工车间",
                      value: 1,
                  },
                    {
                        name: "装配车间",
                        value: 2,
                    },
                      {
                          name: "保持架车间",
                          value: 3,
                      },

            ],
            LineID: [{
                name: "全部",
                value: 0,
            },
            {
                name: "产线1",
                value: 1,
            },
            {
                name: "产线2",
                value: 2,
            },
            {
                name: "产线3",
                value: 3,
            },
            {
                name: "产线4",
                value: 4,
            },
            {
                name: "产线5",
                value: 5,
            },
            {
                name: "产线6",
                value: 6,
            },
            {
                name: "产线7",
                value: 7,
            },
            {
                name: "产线8",
                value: 8,
            },
             {
                 name: "产线9",
                 value: 9,
             },
            {
                name: "产线10",
                value: 10,
            },
            {
                name: "产线11",
                value: 11,
            },
            {
                name: "产线12",
                value: 12,
            },
              {
                  name: "通用设备产线",
                  value: 13,
              },

            ],
            OperatorID: [{
                name: "admin",
                value: 1,

            },
            {
                name: "",
                value: 0,

            },
            ],
            ProductNo: [{
                name: "全部",
                value: 0,
                far: null,
            },
            ],


        };

        $.each(KEYWORD_Point_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD_Point[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_Point[detail[0]] = $com.util.getFormatter(TypeSource_Point, detail[0], detail[2]);
            }
        });
    });
   
    model = $com.Model.create({
        name: 'iPlant.MES',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {

            //查询
            $("body").delegate("#zace-search-part", "click", function () {
                //var isCheck = $("input[type='checkbox']").is('checked');
                //alert(isCheck);
                var default_value = {
                    WorkShopID: 0,
                    LineID: 0,
                    //ProductNo: '0',
                };
                $("body").append($com.modal.show(default_value, KEYWORD_MODE, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.WorkShopID = rst.WorkShopID;
                    default_value.LineID = rst.LineID;
                    //default_value.ProductNo = rst.ProductNo;
                    if (default_value.WorkShopID == 0 || default_value.LineID == 0) {
                        alert("请重新选择");
                    }
                    else {

                      
                        model.com.getAll({ WorkShopID: default_value.WorkShopID, LineID: default_value.LineID, DeviceID: 0, MaterialNo: "" }, function (data) {
                            var list = data.list;
                            $.each(list, function (i, item) {
                                for (var p in item) {
                                    if (!FORMATTRT_Point[p])
                                        continue;
                                    item[p] = FORMATTRT_Point[p](item[p]);
                                }
                                for (var i = 0; i < list.length; i++) {
                                    list[i].WID = i + 1;
                                }
                            });
                            $("#femi-factoryTime-tbody1").html($com.util.template(list, HTML.TablePartMode));
                            $("#femi-factoryTime-tbody1 tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);



                            });
                        });

                    }
                }, TypeSource_MODE));


            });

            //查询2
            $("body").delegate("#zace-search-part1", "click", function () {
               
                var default_value = {
                    Date1: $com.util.format('yyyy-MM-dd ', '2019-02-11'),
                    Date2: $com.util.format('yyyy-MM-dd ', new Date()),
                };
                $("body").append($com.modal.show(default_value, KEYWORD, "查询", function (rst) {
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    default_value.Date1 = $com.util.format('yyyy-MM-dd hh:mm:ss', rst.Date1);
                    default_value.Date2 = $com.util.format('yyyy-MM-dd hh:mm:ss', rst.Date2);
                    TIME = default_value.Date1;
                    TIME2 = default_value.Date2;
                    if (DATA != "") {
                        model.com.getPartPointItem({ DeviceID: DATA[0].DeviceID, MaterialNo: DATA[0].MaterialNo, DTStart: TIME, DTEnd: TIME2 },function (data12) {
                            var list1 = data12.list;
                            List1 = list1;

                       
                        });
                        model.com.getItemAll({ DeviceID: DATA[0].DeviceID, MaterialNo: DATA[0].MaterialNo, DTStart: TIME, DTEnd: TIME2 }, function (data4) {
                            var list2 = data4.info;
                            List2 = list2;


                        });
                        if (List1.length < 1 && List2.length < 1) {
                           
                            var str = "";
                            str += '<tr>';
                            str += '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>';
                            str += '<td>1</td>';
                            str += '<td>出库统计</td>';
                            str += '<td></td>';
                            str += '<td></td>';
                            str += '<td></td>';
                            str += "<td>" + DATA[0].MaterialNo + "</td>";
                            str += "<td>" + DATA[0].MaterialName + "</td>";
                            str += '<td></td>';
                            str += '<td></td>';
                            str += '<td></td>';
                            str += '<td></td>';
                            str += '<td></td>';


                            str += "</tr>";

                            str += '<tr>';
                            str += '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>';
                            str += '<td>2</td>';
                            str += '<td>报工统计</td>';
                            str += '<td></td>';
                            str += '<td></td>';
                            str += '<td></td>';
                            str += "<td>" + DATA[0].MaterialNo + "</td>";
                            str += "<td>" + DATA[0].MaterialName + "</td>";
                            str += '<td></td>';
                            str += '<td></td>';
                            str += '<td></td>';
                            str += '<td></td>';
                            str += '<td></td>';

                            str += "</tr>";
                            $("#femi-ledger-property-tbody").html(str);

                        }
                        if (List1.length >0 && List2.length < 1) {
                            
                            var str = "";
                            str += '<tr>';
                            str += '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>';
                            str += '<td>1</td>';
                            str += '<td>出库统计</td>';
                            str += '<td></td>';
                            str += '<td></td>';
                            str += '<td></td>';
                            str += "<td>" + DATA[0].MaterialNo + "</td>";
                            str += "<td>" + DATA[0].MaterialName + "</td>";
                            str += '<td></td>';
                            str += '<td></td>';
                            str += '<td></td>';
                            str += '<td></td>';
                            str += '<td></td>';
                            str += "</tr>";

                            for (var i = 0; i < List1.length; i++) {

                                str += '<tr>';
                                str += '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>';
                                str += "<td>" + i + 2 + "</td>";
                                str += '<td>报工统计</td>';
                                str += "<td>" + List1[i].WorkShopID + "</td>";
                                str += "<td>" + List1[i].LineName + "</td>";;
                                str += "<td>" + List1[i].PartPointName + "</td>";
                                str += "<td>" + DATA[0].MaterialNo + "</td>";
                                str += "<td>" + DATA[0].MaterialName + "</td>";
                                str += "<td>" + List1[i].MaterialNo + "</td>";
                                str += "<td>" + List1[i].MaterialName + "</td>";
                                str += "<td>" + List1[i].FQTY + "</td>";
                                str += "<td>" + List1[i].OperatorName + "</td>";
                                str += "<td>" + List1[i].BGTime + "</td>";
                                str += "</tr>";
                            }
                            $("#femi-ledger-property-tbody").html(str);

                        }
                        if (List1.length < 1 && List2.length >0) {
                           
                            var str = "";
                            for (var i = 0; i < List2.length; i++) {

                                str += '<tr>';
                                str += '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>';
                                str += "<td>" + i + 1 + "</td>";
                                str += '<td>入库统计</td>';
                                str += "<td>" + List1[i].WorkShopID + "</td>";
                                str += "<td>" + List1[i].LineName + "</td>";;
                                str += "<td>" + List1[i].PartPointName + "</td>";
                                str += "<td>" + DATA[0].MaterialNo + "</td>";
                                str += "<td>" + DATA[0].MaterialName + "</td>";
                                str += "<td>" + List1[i].MaterialNo + "</td>";
                                str += "<td>" + List1[i].MaterialName + "</td>";
                                str += "<td>" + List1[i].FQTYPL + "</td>";
                                str += "<td>" + List1[i].PLOperatorName + "</td>";
                                str += "<td>" + List1[i].PLTime + "</td>";
                                str += "</tr>";
                            }
                            str += '<tr>';
                            str += '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>';
                            str += "<td>" + List2.length + 1 + "</td>";
                            str += '<td>报工统计</td>';
                            str += '<td></td>';
                            str += '<td></td>';
                            str += '<td></td>';
                            str += "<td>" + DATA[0].MaterialNo + "</td>";
                            str += "<td>" + DATA[0].MaterialName + "</td>";
                            str += '<td></td>';
                            str += '<td></td>';
                            str += '<td></td>';
                            str += '<td></td>';
                            str += '<td></td>';

                            str += "</tr>";
                            $("#femi-ledger-property-tbody").html(str);
                        }
                        if (List1.length >0 && List2.length >0) {
                            
                            var str = "";
                            for (var i = 0; i < List2.length; i++) {

                                str += '<tr>';
                                str += '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>';
                                str += "<td>" + i + 1 + "</td>";
                                str += '<td>入库统计</td>';
                                str += "<td>" + List1[i].WorkShopID + "</td>";
                                str += "<td>" + List1[i].LineName + "</td>";;
                                str += "<td>" + List1[i].PartPointName + "</td>";
                                str += "<td>" + DATA[0].MaterialNo + "</td>";
                                str += "<td>" + DATA[0].MaterialName + "</td>";
                                str += "<td>" + List1[i].MaterialNo + "</td>";
                                str += "<td>" + List1[i].MaterialName + "</td>";
                                str += "<td>" + List1[i].FQTYPL + "</td>";
                                str += "<td>" + List1[i].PLOperatorName + "</td>";
                                str += "<td>" + List1[i].PLTime + "</td>";
                                str += "</tr>";
                            }
                            for (var i = 0; i < List1.length; i++) {

                                str += '<tr>';
                                str += '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>';
                                str += "<td>" + List2.length + i + "</td>";
                                str += '<td>报工统计</td>';
                                str += "<td>" + List1[i].WorkShopID + "</td>";
                                str += "<td>" + List1[i].LineName + "</td>";;
                                str += "<td>" + List1[i].PartPointName + "</td>";
                                str += "<td>" + DATA[0].MaterialNo + "</td>";
                                str += "<td>" + DATA[0].MaterialName + "</td>";
                                str += "<td>" + List1[i].MaterialNo + "</td>";
                                str += "<td>" + List1[i].MaterialName + "</td>";
                                str += "<td>" + List1[i].FQTY + "</td>";
                                str += "<td>" + List1[i].OperatorName + "</td>";
                                str += "<td>" + List1[i].BGTime + "</td>";
                                str += "</tr>";
                            }
                            $("#femi-ledger-property-tbody").html(str);
                        }

                    }

                }));

            });


            //导出1
            $("body").delegate("#zace-export-part", "click", function () {
                var $table = $("#table1"),
                     fileName = "在线库存.xls",
                     Title = "在线库存";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });

            });
          
          
        },

        run: function () {
         

            model.com.getMaterialOnline({
                LineID:0,
                PartID:0,
                PartPointID:0,
                StationID:0,
                MaterialNo:""


            }, function (res) {
                var z=res;

                $("#femi-userInStock-tbody").html($com.util.template(res.list, HTML.TablePartMode));
                $("#femi-userInStock-tbody tr").each(function (i, item) {
                    var $this = $(this);
                    var colorName = $this.css("background-color");
                    $this.attr("data-color", colorName);



                });
            })

        },

        com: {

            getMaterialOnline: function (data, fn, context) {
                var d = {
                    $URI: "/MaterialOnline/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
           
           
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

        }
    });

    model.init();


});