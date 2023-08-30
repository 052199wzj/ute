require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'],
    function ($yang, $com) {
        var HTML,
        model,
        KEYWORD,
        KEYWORD_LIST,
        DEFAULT_VALUE,
        TypeSource,
        FORMATTRT,

        data_product,
        data_lineEntry,
        data_line,
        data_Part,
        data_PartPoint;
        HTML = {
            TableProcessModelItemNode: [
                '<tr>',
			    '<td style="width: 3px"><input type="checkbox"',
			    '	class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
			    '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}"  >{{ID}}</td>	     ',
                '<td style="min-width: 50px" data-title="PartPointID" data-value="{{PartPointID}}"  >{{PartPointID}}</td>  ',
			    '<td style="min-width: 50px" data-title="PartPointName" data-value="{{PartPointName}}"  >{{PartPointName}}</td>  ',
			    '<td style="min-width: 50px" data-title="Active" data-value="{{Active}}"  >{{Active}}</td>  ',
			    '<td style="min-width: 50px" data-title="Creator" 	data-value="{{Creator}}" 	 >{{Creator}}</td>    ',
			    '<td style="min-width: 80px" data-title="CreateTime" 	data-value="{{CreateTime}}" 	 >{{CreateTime}}</td>  ',
			    '</tr>',
            ].join("")
        };
        (function () {
            KEYWORD_LIST = [
            "PartPointID|工序号",
			"PartPointName|工序名称",
            "Active|状态|ArrayOne",
            "Creator|创建者",
			"CreateTime|日期",
            ];
            FORMATTRT = {};
            KEYWORD = {};
            DEFAULT_VALUE = {
                PartPointID:0,
                PartPointName:"",
                Active:true
            };
            TypeSource = {
                PartPointName: [{
                    name: "全部",
                    value: 0,
                    far: 0
                }],                
                Active: [{
                    name: "关闭",
                    value: false,
                },
                {
                    name: "启用",
                    value: true,
                }],
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
        model = $com.Model.create({
            name: 'iPlant.MES',

            type: $com.Model.MAIN,

            configure: function () {
                this.run();

            },
            events: function () {
                //新增
                $("body").delegate("#cby-add-ledger", "click", function () {
                    $("body").append($com.modal.show(DEFAULT_VALUE, KEYWORD, "新增", function (rst) {
                        //调用插入函数 
                        if (!rst || $.isEmptyObject(rst))
                            return;                      
                        var _data = {
                            PartPointName: rst.PartPointName,
                            PartPointID:rst.PartPointID,
                            Active: Boolean(rst.Active),
                            DeviceID: 0,
                            PointMode: 0,
                            RiskID: 1,
                            WorkShopID: 0,
                            Creator: window.parent.User_Info.Name,
                            CreateTime: $com.util.format('yyyy-MM-dd HH:mm:ss', new Date())
                            };
                        data_PartPoint.push(_data);
                        model.com.addPartPiont({
                            data: data_PartPoint
                        }, function (res) {
                            alert("新增成功");
                            model.com.refresh();
                        })

                    }, TypeSource));
                });
                //修改
                $("body").delegate("#cby-edit-ledger", "click", function () {

                    var SelectData = $com.table.getSelectionData($("#cby-ledger-tbody"), 'ID', ProcessModelSource);


                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return;
                    }
                    if (SelectData.length != 1) {
                        alert("只能同时对一行数据修改！")
                        return;

                    }
                    var default_value = {
                        PartPointName:SelectData[0].PartPointName,
                        Active: SelectData[0].Active
                    }; 
                    $("body").append($com.modal.show(default_value, KEYWORD, "修改", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;

                        //工序修改
                        $.each(data_PartPoint, function (i, item) {
                            if (item.PartPointName == SelectData[0].PartPointName) {
                                item.PartPointName = rst.PartPointName,
                                item.Active = Boolean(rst.Active);
                                return false;
                            }
                        })
                        model.com.addPartPiont({
                            data: data_PartPoint
                        }, function (res) {
                            alert("修改成功");
                            model.com.refresh();
                        });

                        //工序段下修改
                        $.each(data_Part, function (i, item) {
                            $.each(item.PartPointList, function (p_i, p_item) {
                                if (p_item.PartPointName == SelectData[0].PartPointName) {
                                    p_item.PartPointName = rst.PartPointName;
                                }
                            });
                        });
                        model.com.addPart({
                            data: data_Part,
                        });

                        //产线下修改
                        $.each(data_line, function (l_i, l_item) {
                            $.each(l_item.PartList, function (p_i, p_item) {
                                $.each(p_item.PartPointList, function (pp_i, pp_item) {
                                    if (pp_item.PartPointName == SelectData[0].PartPointName) {
                                        pp_item.PartPointName = rst.PartPointName;
                                    }
                                });
                                if (p_item.PointGroupList.length != 0) {
                                    $.each(p_item.PointGroupList, function (g_i, g_item) {
                                        $.each(g_item.PartPointList, function (j_i, j_item) {
                                            if (j_item.PartPointName == SelectData[0].PartPointName) {
                                                j_item.PartPointName = rst.PartPointName;
                                            }
                                        });
                                    });
                                }
                            });
                        });
                        model.com.addLine({
                            data: data_line
                        });

                        //物理工厂下修改
                        $.each(data_lineEntry, function (i, item) {
                            $.each(item.GroupEntryList, function (g_i, g_item) {
                                $.each(g_item.PartList, function (p_i, p_item) {
                                    $.each(p_item.PartPointList, function (pp_i, pp_item) {
                                        if (pp_item.PartPointName == SelectData[0].PartPointName) {
                                            pp_item.PartPointName = rst.PartPointName;
                                        }
                                    });
                                });
                            });
                        });
                        $.each(data_lineEntry, function (i, item) {
                            model.com.addLineEntry({
                                data: item
                            })
                        });
                       
                        //产品工艺
                        $.each(data_product, function (i, item) {
                            $.each(item.PartList, function (p_i, p_item) {
                                $.each(p_item.PartPointList, function (pp_i, pp_item) {
                                    if (pp_item.PartPointName == SelectData[0].PartPointName) {
                                        pp_item.PartPointName = rst.PartPointName;
                                    }
                                })
                            })
                        })
                        model.com.postAPSProductTypeSave({
                            data: data_product
                        });
                    }, TypeSource));
                });
                //删除
                $("body").delegate("#cby-delete-ledger", "click", function () {
                    var SelectData = $com.table.getSelectionData($("#cby-ledger-tbody"), 'ID', ProcessModelSource);
                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return;
                    }
                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {
                        return;
                    }
                    var _data_PartPoint = $com.util.Clone(data_PartPoint);

                    data_PartPoint = model.com.getNewShiftList(_data_PartPoint, SelectData);

                    model.com.addPartPiont({
                        data: data_PartPoint
                    }, function (res) {
                        alert("删除成功");
                        model.com.refresh();
                    })
                });
                //模糊查询
                $("body").delegate("#cby-search-text-ledger", "input", function () {
                    var $this = $(this),
                        value = $(this).val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#cby-ledger-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#cby-ledger-tbody"), ProcessModelSource, value, "ID");
                });
                //模态框查询
                $("body").delegate("#cby-search-ledger", "click", function () {
                    //var default_value = {
                    //    PartPointName: "",
                    //    Active: true,
                    //};
                    //$("body").append($com.modal.show(default_value, KEYWORD, "查询", function (rst) {


                    //    if (!rst || $.isEmptyObject(rst))
                    //        return;

                    //    default_value.PartPointName = rst.PartPointName;
                    //    default_value.Active =rst.Active;
                    //    $com.table.filterByConndition($("#cby-ledger-tbody"), ProcessModelSource, default_value, "ID");

                    //}, TypeSource));
                });
            },
            run: function () {
                model.com.getAPSProductTypeAll({}, function (data) {
                    data_product = data.list;
                })
                model.com.getLineEntry({}, function (data) {
                    data_lineEntry = data.list;
                })
                model.com.getLine({}, function (data) {
                    data_line = data.list;
                })
                model.com.getPart({}, function (data) {
                    data_Part = data.list;
                });
                model.com.getPartPoint({}, function (data) {
                    data_PartPoint = data.list;
                    model.com.refresh();
                });
            },
            com: {
                getAPSProductTypeAll: function (data, fn, context) {
                    var d = {
                        $URI: "/APSProduct/TypeAll",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

               
                getPartPoint: function (data, fn, context) {
                    var d = {
                        $URI: "/APSPartPoint/All",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                getPart: function (data, fn, context) {
                    var d = {
                        $URI: "/APSPart/All",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                getLine: function (data, fn, context) {
                    var d = {
                        $URI: "/APSLine/ConfigAll",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                getLineEntry: function (data, fn, context) {
                    var d = {
                        $URI: "/APSLineEntry/LineEntryAll",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                addPartPiont: function (data, fn, context) {
                    var d = {
                        $URI: "/APSPartPoint/Save",
                        $TYPE: "post"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                addPart: function (data, fn, context) {
                    var d = {
                        $URI: "/APSPart/Save",
                        $TYPE: "post"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                addLine: function (data, fn, context) {
                    var d = {
                        $URI: "/APSLine/SaveLine",
                        $TYPE: "post"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                addLineEntry: function (data, fn, context) {
                    var d = {
                        $URI: "/APSLineEntry/LineEntrySave",
                        $TYPE: "post"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                postAPSProductTypeSave: function (data, fn, context) {
                    var d = {
                        $URI: "/APSProduct/TypeSave",
                        $TYPE: "post"
                    };
                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                refresh: function () {
                    $.each(data_PartPoint, function (i, item) {
                        TypeSource.PartPointName.push({
                            name: item.PartPointName,
                            value: item.PartPointID,
                            far: null
                        });
                    });

                    model.com.render(data_PartPoint);
                },
                render: function (list) {
                    var _list = $com.util.Clone(list);
                    $.each(_list, function (i, item) {
                        item.ID = i + 1;
                        for (var p in item) {
                            if (!FORMATTRT[p])
                                continue;
                            item[p] = FORMATTRT[p](item[p]);
                        }
                    });
                    ProcessModelSource = _list;
                    $("#cby-ledger-tbody").html($com.util.template(_list, HTML.TableProcessModelItemNode));
                },

                getNewShiftList: function (_source, set_data) {
                    if (!_source)
                        _source = [];
                    if (!set_data)
                        set_data = [];
                    var rst = [];
                    for (var i = 0; i < _source.length; i++) {
                        var NotOWn = false;
                        for (var j = 0; j < set_data.length; j++) {
                            if (_source[i].PartPointName == set_data[j].PartPointName) {
                                _source.splice(i, 1);
                                set_data.splice(j, 1);
                                NotOWn = true;
                            }
                            if (set_data.length < 1) {
                                break;
                            }
                            if (NotOWn) {
                                model.com.getNewShiftList(_source, set_data);
                            }
                        }

                    }
                    rst = _source;
                    return rst;
                },
                
            }
        })
        model.init();
    });