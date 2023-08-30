require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($zace, $com) {

    var KEYWORD_Level_LIST,
        KEYWORD_Level,
        FORMATTRT_Level,
        DEFAULT_VALUE_Level,
        TypeSource_Level,
		model,
        DataAll,
        DataAllFactorySearch,
        HTML;
    DataProduct=[];
    DataAll = [];
    DataAllFactorySearch = [];
    mProductID = 0;
    PositionTemp = {
        ID: 0,
        ProductID: 0,
        ProductNo: "",
        ParameterName: "",
        ParameterType: 0,
        ValueType: 0,
    };


    ;
    HTML = {
        TableMode: [
				'<tr>',
				'<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
				'<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
				'<td data-title="ProductNo" data-value="{{ProductNo}}" >{{ProductNo}}</td>',
                '<td data-title="ParameterName" data-value="{{ParameterName}}" >{{ParameterName}}</td>',
				'<td data-title="ParameterType" data-value="{{ParameterType}}" >{{ParameterType}}</td>',
                '<td data-title="ValueType" data-value="{{ValueType}}" >{{ValueType}}</td>',
                '<td data-title="OperatorName" data-value="{{OperatorName}}" >{{OperatorName}}</td>',
                '<td data-title="OperateTime" data-value="{{OperateTime}}" >{{OperateTime}}</td>',
				'</tr>',
        ].join(""),



    }
    $(function () {
        KEYWORD_Level_LIST = [
         "ProductID|产品|ArrayOne",
         "ParameterName|参数名",         
         "ParameterType|参数类型|ArrayOne",
         "ValueType|参数值类型|ArrayOne",
        ];
        KEYWORD_Level = {};
        FORMATTRT_Level = {};

        DEFAULT_VALUE_Level = {
            ProductID: "",
            ParameterName: "",
            ParameterType: 0,
            ValueType: 0,
            //Active: true,
        };

        TypeSource_Level = {
            ProductID: [
              {
                  name: "无",
                  value: 0,
              }
            ],
            ParameterType: [
             {
                 name: "无",
                 value: 0,
               
             }
            ],
            ValueType: [
            {
                name: "无",
                value: 0,

            }
            ],



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


    model = $com.Model.create({
        name: '岗位',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            // 查询
            $("body").delegate("#zace-searchAll-level", "click", function () {
                var default_value = {
                    ProductID: 0,
                    //Position: 0,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.ProductID = Number(rst.ProductID);
                   // $com.table.filterByConndition($("#femi-parameter-tbody"), DataAll, default_value, "ID");
                    mProductID = default_value.ProductID;
                    model.com.refresh();
                }, TypeSource_Level));




            });

            //模糊查询
            $("body").delegate("#zace-search-level", "input", function () {

                var $this = $(this),
                   value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-parameter-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-parameter-tbody"), DataAllFactorySearch, value, "ID");



            });
            //产品规格修改
            $("body").delegate("#zace-edit-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-parameter-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }

                var default_value = {
                    ProductID: SelectData[0].ProductID,
                    ParameterType: SelectData[0].ParameterType,
                    ParameterName: SelectData[0].ParameterName,
                    ValueType: SelectData[0].ValueType,                  
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].ParameterName = rst.ParameterName;                  
                    SelectData[0].ValueType = Number(rst.ValueType);
                    SelectData[0].ParameterType = Number(rst.ParameterType);
                    SelectData[0].ProductID = Number(rst.ProductID);

                    for (var i = 0; i < DataProduct.length; i++) {
                        if (SelectData[0].ProductID == DataProduct[i].ID) {
                            SelectData[0].ProductNo = DataProduct[i].ProductNo;
                        }
                    }
                    model.com.postProductParameter({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();

                    })

                }, TypeSource_Level));


            });

            //产品规格新增
            $("body").delegate("#zace-add-level", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    PositionTemp.ProductID = Number(rst.ProductID);
                    PositionTemp.ParameterType = Number(rst.ParameterType);
                    PositionTemp.ParameterName = rst.ParameterName;
                    PositionTemp.ValueType = Number(rst.ValueType);
                    for (var i = 0; i < DataProduct.length; i++) {
                        if (PositionTemp.ProductID == DataProduct[i].ID) {
                            PositionTemp.ProductNo = DataProduct[i].ProductNo;
                        }
                    }
                  

                    model.com.postProductParameter({
                        data: PositionTemp,
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                    })

                }, TypeSource_Level));


            });
        },




        run: function () {



            model.com.getFPCProduct({ ProductTypeID: 0, BusinessUnitID: 0 }, function (resP) {
                if (resP && resP.list) {
                    DataProduct=resP.list;
                    $.each(resP.list, function (i, item) {
                        TypeSource_Level.ProductID.push({
                            name: item.ProductNo,
                            value: item.ID,
                        });
                    });

                }

                model.com.getProductParameterType({}, function (resP) {
                    if (resP && resP.list) {
                        $.each(resP.list, function (i, item) {
                            TypeSource_Level.ParameterType.push({
                                name: item.Description,
                                value: item.Value,
                            });
                        });

                    }

                    model.com.getProductValueType({}, function (resP) {
                        if (resP && resP.list) {
                            $.each(resP.list, function (i, item) {
                                TypeSource_Level.ValueType.push({
                                    name: item.Description,
                                    value: item.Value,
                                });
                            });

                        }

                     
                        model.com.refresh();
                    });
                });
            });






        },

        com: {
            setMMM: function () {
                setTimeout(function () {
                    if (window.parent._zaceProductType && window.parent._zaceProductType == 1) {
                        model.com.getFPCProductType({ BusinessUnitID: 0 }, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {

                                //TypeSource_materialRecord.SupplierID = [];
                                TypeSource_Level.ProductTypeID.splice(1, TypeSource_Level.ProductTypeID.length - 1);
                                $.each(resW.list, function (i, item) {
                                    TypeSource_Level.ProductTypeID.push({
                                        name: item.Name,
                                        value: item.ID,
                                        far: item.BusinessUnitID
                                    });
                                });
                            }
                            window.parent._zaceProductType = 0;
                        });

                    }
                    model.com.setMMM();
                }, 500);

            },
            refresh: function () {

                model.com.getProductParameter({ ID: 0, ProductID: mProductID, ProductNo: "", StartTime: "2000-01-01", EndTime: "2000-01-01" }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var Grade = $com.util.Clone(resP.list);
                        DataAll = $com.util.Clone(resP.list);

                        $.each(Grade, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }
                        });
                        DataAllFactorySearch = $com.util.Clone(Grade);
                        $("#femi-parameter-tbody").html($com.util.template(Grade, HTML.TableMode));




                    }

                });
            },


            //查询产品列表
            getFPCProduct: function (data, fn, context) {
                var d = {
                    $URI: "/FPCProduct/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询产品参数类型
            getProductValueType: function (data, fn, context) {
                var d = {
                    $URI: "/TBT/QueryValueTypeList",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询产品参数类型
            getProductParameterType: function (data, fn, context) {
                var d = {
                    $URI: "/TBT/QueryParameterTypeList",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询产品参数
            getProductParameter: function (data, fn, context) {
                var d = {
                    $URI: "/TBT/QueryParamsSettingList",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //保存产品参数
            postProductParameter: function (data, fn, context) {
                var d = {
                    $URI: "/TBT/SaveParamsSetting",
                    $TYPE: "post"
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
        }
    }),

    model.init();


});