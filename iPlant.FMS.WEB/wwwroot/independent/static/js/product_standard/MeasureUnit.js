require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($zace, $com) {

    var KEYWORD_Unit_LIST,
        KEYWORD_Unit,
        FORMATTRT_Unit,
        UnitTemp ,
        TypeSource_Unit,

		model,
        DataAll,
        DATABasic,
        HTML;

 
    UnitTemp = {
    	Active:0,
    	Coefficient:0,
    	EditTime:$com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
    	Operator:window.parent.User_Info.Name,
    	OperatorID:0,
    	ERPMeasureUnitID:0,
    	ERPSourceUnitID:0,
    	ID:0,
    	MeasureUnitID:0,
    	SourceUnitID:0,
    };  
  
    HTML = {
        TableMode: [
				'<tr data-color="">',
				'<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
                '<td data-title="MeasureUnitID" data-value="{{MeasureUnitID}}" >{{MeasureUnitID}}</td>',
                '<td data-title="Coefficient" data-value="{{Coefficient}}" >{{Coefficient}}</td>', 
                '<td data-title="SourceUnitID" data-value="{{SourceUnitID}}" >{{SourceUnitID}}</td>',
//              '<td data-title="Active" data-value="{{Active}}" >{{Active}}</td>',
                '<td data-title="OperatorID" data-value="{{OperatorID}}" >{{OperatorID}}</td>',
                '<td data-title="EditTime" data-value="{{EditTime}}" >{{EditTime}}</td>',
				'</tr>',
        ].join(""),

        
    },
    (function () {
        KEYWORD_Unit_LIST = [
//       "Active|启用|ArrayOne",
         "SourceUnitID|原始数据|ArrayOne",
         "MeasureUnitID|最终数据|ArrayOne",
         "Coefficient|转换率", 
         "OperatorID|操作员|ArrayOne",
         "EditTime|编辑时间|DateTime",
        ];
        KEYWORD_Unit = {};
        FORMATTRT_Unit = {};

        TypeSource_Unit = {
            SourceUnitID:[],
            MeasureUnitID:[],
            OperatorID: [{
                name: "无",
                value: 0
            }]
//          Active: [
//          {
//              name: "启用",
//              value: 1
//          },{
//          	name: "禁用",
//              value: 0
//             }
//          ],
        };

        $.each(KEYWORD_Unit_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD_Unit[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_Unit[detail[0]] = $com.util.getFormatter(TypeSource_Unit, detail[0], detail[2]);
            }
        });
    })();

    
    model = $com.Model.create({
        name: '转换信息',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            //单位转换查询
            $("body").delegate("#zace-search-MeteringSetting-Unit", "input", function () {

                var $this = $(this),
                   value = $(this).val();
                if (value == undefined || value=="" || value.trim().length < 1)
                    $("#lmvt-device-body").children("tr").show();
                else
                    $com.table.filterByLikeString($("#lmvt-device-body"), DataAll, value, "ID");
            });

            //单位转换修改
            $("body").delegate("#lmvt-deviceinfo-edit", "click", function () {

                var SelectData = $com.table.getSelectionData($("#lmvt-device-body"), "ID", DATABasic);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                var Default_value = {
                    SourceUnitID: SelectData[0].SourceUnitID,
                    MeasureUnitID: SelectData[0].MeasureUnitID,
                    Coefficient: SelectData[0].Coefficient,
                };
                $("body").append($com.modal.show(Default_value, KEYWORD_Unit, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].SourceUnitID = Number(rst.SourceUnitID);
                    SelectData[0].MeasureUnitID = Number(rst.MeasureUnitID);
                    SelectData[0].Coefficient = rst.Coefficient;

                    for (var i = 0; i < SelectData.length; i++) {
                        $com.util.deleteLowerProperty(SelectData[i]);
                    }
                    model.com.PostUpdate({
                        data: SelectData[0]
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                    })

                }, TypeSource_Unit));


            });          
            //单位转换新增
            $("body").delegate("#lmvt-deviceinfo-add", "click", function () {
                var default_value = {
                    SourceUnitID: 0,
                    MeasureUnitID:0,
                    Coefficient:0,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Unit, "新增", function (rst) {
                    //调用插入函数 

                    if (!rst || $.isEmptyObject(rst))
                        return;

                    UnitTemp.SourceUnitID= Number(rst.SourceUnitID);
                    UnitTemp.MeasureUnitID= Number(rst.MeasureUnitID);
                    UnitTemp.Coefficient= Number(rst.Coefficient);

                    model.com.PostUpdate({
                        data: UnitTemp
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                    })

                }, TypeSource_Unit));
            });
            //单位转换导出
            $("body").delegate("#lmvt-deviceinfo-output", "click", function () {
                var $table = $(".table-part"),
                     fileName = "单位转换.xls",
                     Title = "单位转换";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });

            });
            
              $("body").delegate("#lmvt-deviceinfo-search","click",function(){
                var vdata = { 'header': '计量设置', 'href': './product_standard/MeteringSetting.html', 'id': 'MeteringSetup', 'src': './static/images/menu/basicSet/measurementSet.png'};
                    window.parent.iframeHeaderSet(vdata); 
           });
         
        },




        run: function () {   
        
//         model.com.refresh();
            //查询价格单位 
          model.com.getUnit({}, function (res1) {
                    $.each(res1.list, function (i, item) {
                        TypeSource_Unit.MeasureUnitID.push({
                            name: item.Name,
                            value: item.ID,
                            far: null
                        })
                    }); 
                    
                   TypeSource_Unit.SourceUnitID =TypeSource_Unit.MeasureUnitID
                   model.com.getUser({}, function (res1) {
                       $.each(res1.list, function (i, item) {
                           TypeSource_Unit.OperatorID.push({
                               name: item.Name,
                               value: item.ID,
                              
                           })
                       });

                       
                       model.com.refresh();
                   });
                });
          
        },

        com: {
            refresh: function () {

                model.com.getMeasureUnit({}, function (resS) {
                      if (!resS)
                        return;
                    if (resS && resS.list) {
                        Unit = $com.util.Clone(resS.list);
                        DATABasic = $com.util.Clone(resS.list);

                        $.each(Unit, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Unit[p])
                                    continue;
                                item[p] = FORMATTRT_Unit [p](item[p]);
                            }
                        });

                        //$.each(Unit, function (i, item) {
                        //    item.WID = i + 1;
                        //    item.OperatorID = model.com.GetName(item.OperatorID);
                        //});
                         DataAll = $com.util.Clone(Unit);
                        $("#lmvt-device-body").html($com.util.template(Unit, HTML.TableMode));
                        $("#lmvt-device-body tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });
                    }

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
            
            //查询转换单位
            getMeasureUnit: function (data, fn, context) {
                var d = {
                    $URI: "/MeasureUnit/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            }, 
            //启用顾客信息
            PostUpdate: function (data, fn, context) {
                var d = {
                    $URI: "/MeasureUnit/Update",
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
            //得到人名
            //GetName: function (id) {
            //    var name;
            //    $.each(window.parent._UserAll, function (i, item) {
            //        if (item.ID == id) {
            //            name = item.Name;
            //            return name;
            //        }
            //    });
            //    return name;
            //},
        }
    }),

    model.init();


});