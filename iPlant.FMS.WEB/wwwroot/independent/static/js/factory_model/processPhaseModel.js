require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/jquery.treeview'],
    function ($yang, $com, $treeview) {
        var HTML,
            TypeSource,
            KEYWORD_LIST,
            FORMATTRT,
            KEYWORD,
            DEFAULT_VALUE,

            TypeSource_PartPoint,
            KEYWORD_LIST_PartPoint,
            FORMATTRT_PartPoint,
            KEYWORD_PartPoint,
            DEFAULT_VALUE_PartPoint,

            flag = 0,
            dataPart,
            dataPartPoint,
            partid,
            PartPointSource;

        HTML = {
            TreePartItemNode: [
                '<li data-value="{{PartID}}"  class="click-delegate part">',
                '<span style="vertical-align:top;"><input type="checkbox" class="femi-tree-checkbox" style="margin: 1px 0px 1px"  value="{{FunctionID}}"  />{{PartName}}</span> ',
                '<ul>{{Items}}</ul>',
                '</li> ',
            ].join(""),
            TreePartPointItemNode: [
               '<li data-value="{{PartPointID}}"  class="click-delegate partpoint" >',
               '<span style="vertical-align:top;"><input type="checkbox" class="femi-tree-checkbox" style="margin: 1px 0px 1px"  value="{{FunctionID}}"  />{{PartPointName}}</span> ',
               '</li> ',
            ].join(""),
            PartItemNode: [
               '<tr><td style="widtd: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></td>',
               '<td style="min-widtd:50px"   data-title="OrderID" data-value ="{{OrderID}}" >{{OrderID}}</td>',
               '<td style="min-width: 50px" data-title="PartPointName" data-value="{{PartPointName}}"  >{{PartPointName}}</td>  ',
               '<td style="min-widtd:50px"   data-title="Creator" data-value = "{{Creator}}" >{{Creator}}</td>',
               '<td style="min-widtd:50px"   data-title="CreateTime" data-value = "{{CreateTime}}">{{CreateTime}}</td>',
               '</tr>',
            ].join(""),
        };
        (function () {
            KEYWORD_LIST = [
            "PartID|工序段编号",
            "PartName|工序段名",
            "PartPointList|工序选择|Array"
            ];
            FORMATTRT = {};
            KEYWORD = {};
            DEFAULT_VALUE = {
                PartID: 0,
                PartName: "",
                PartPointList: ""
            };
            TypeSource = {
                PartID:[{
                    name: "全部",
                    value: 0,
                }],
                PartName: [{
                    name: "全部",
                    value: 0,
                    far: 0
                }],
                PartPointList:[]
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
        (function () {
            KEYWORD_LIST_PartPoint = [
            "PartID|工序段编号|LongText",
            "PartName|工序名|LongText",
            "PartPointList|工序选择|Array"
            ];
            FORMATTRT_PartPoint = {};
            KEYWORD_PartPoint = {};
            DEFAULT_VALUE_PartPoint = {
                PartID: 0,
                PartName: "",
                PartPointList: ""
            };
            TypeSource_PartPoint = {
                PartPointList:[]
            };

            $.each(KEYWORD_LIST_PartPoint, function (i, item) {
                var detail = item.split("|");
                KEYWORD_PartPoint[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined
                };
                if (detail.length > 2) {
                    FORMATTRT_PartPoint[detail[0]] = $com.util.getFormatter(TypeSource_PartPoint, detail[0], detail[2]);
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
                //点击事件
                $("body").delegate("li.click-delegate", "click", function () {
                    if (flag > 0) {
                        flag--;
                        return;
                    }
                    var $this = $(this);
                    if ($this.hasClass("part")) {
                        flag = 1;
                    } else if ($this.hasClass("partpoint")) {
                        flag = 2;
                    }
                    model.com.chooseEvent(flag, $this);
                });
                //Tree新增工序段
                $("body").delegate("#cby-tree-add", "click", function () {
                    //拿到所有的工序段
                    var _partpointList = [];
                    $.each(dataPartPoint, function (i, item) {
                        _partpointList.push({
                            name: item.PartPointName,
                            value: item.PartPointID
                        })
                    })
                    TypeSource.PartPointList = _partpointList;
                    DEFAULT_VALUE.PartID = dataPart.length+1;
                    $("body").append($com.modal.show(DEFAULT_VALUE, KEYWORD, "新增工序段", function (rst) {
                        if (!rst || $.isEmptyObject(rst))
                            return false;

                        var PartSource = {
                            PartID: rst.PartID,
                            PartName: rst.PartName,
                            creator: window.parent.User_Info.Name
                        };
                        PartSource.PartPointList = [];
                        //模态框中已选中的PartPointList的列表
                        var PartPointList = rst.PartPointList;

                        var _part = [];
                        $.each(dataPart, function (i, item) {
                            if (item.PartID != rst.PartID) {
                                if (item.PartName != rst.PartName) {
                                    return;
                                } else {
                                    alert("工序段名称重复！");
                                    return false;
                                }
                            } else {
                                alert("工序段编号重复！")
                                return false;
                            }    
                        })
                        $.each(PartPointList, function (r_i, r_item) {
                            $.each(dataPartPoint, function (pp_i, pp_item) {
                                if (r_item == pp_item.PartPointID) {
                                    _part.push(pp_item);
                                }
                            })
                        })
                        PartSource.PartPointList = _part;
                        dataPart.push(PartSource);

                        model.com.addPart({
                            data: dataPart,
                        }, function (res) {
                            if (res != 0) {
                                alert("新增成功！！");
                                model.com.refreshTree();
                                model.com.refreshPartPoint(rst.PartID);
                            }
                            else {
                                alert("新增失败！！");
                            }
                        });
                    }, TypeSource))
                });
                //删除事件
                $("body").delegate("#cby-tree-delete", "click", function () {
                    var $Input = $("#PartTree li input[type=checkbox]:checked"),
                       $this = undefined;
                    if ($Input.length == 0) {
                        alert("请选择需要删除的项！");
                        return false;
                    }
                    var $partInput = $("#PartTree li.part>span>input[type=checkbox]:checked");
                    var $partpointInput = $("#PartTree li.partpoint>span>input[type=checkbox]:checked")
                    if ($partInput.length > 0) {
                        var $part = $partInput.closest("li");
                        //删工序段
                        flag = 1;
                        model.com.chooseDel(flag, $part);
                    }
                    if ($partpointInput.length > 0) {
                        var $partpoint = $partpointInput.closest("li");
                        //删工序
                        flag = 2;
                        model.com.chooseDel(flag, $partpoint);
                    }
                });
                //Table新增工序
                $("body").delegate("#cby-add-partPoint", "click", function () {
                    //找到Tree中被点击的工序段的PartID
                    DEFAULT_VALUE_PartPoint.PartID = partid;
                    $.each(dataPart, function (i, item) {
                        if (item.PartID == partid) {
                            DEFAULT_VALUE_PartPoint.PartName = item.PartName;
                            return false;
                        }
                    })
                    //拿到所有的工序
                    var _partpointList = [];
                    $.each(dataPartPoint, function (i, item) {
                        _partpointList.push({
                            name: item.PartPointName,
                            value: item.PartPointID
                        })
                    })

                    //拿到该工序段下已经存在的工序
                    var partpointList = [];
                    $.each(dataPart, function (i, item) {
                        if (item.PartID == partid) {
                            partpointList = item.PartPointList;
                            return false;
                        }
                    })
                    //删除已存在的工序
                    var partpointArr = $com.util.Clone(_partpointList);
                    var PartPointList = $com.util.Clone(partpointList);
                    var _partpointArr = model.com.getNewPartPointArr(partpointArr, PartPointList);

                    TypeSource_PartPoint.PartPointList = _partpointArr;

                    $("body").append($com.modal.show(DEFAULT_VALUE_PartPoint, KEYWORD_PartPoint, "新增工序", function (rst) {
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        var PartPointSource = {};

                        var _PartPointList = [];
                        $.each(dataPart, function (i, item) {
                            if (item.PartID == rst.PartID && item.PartName == rst.PartName) {
                                $.each(dataPartPoint, function (p_i, p_item) {
                                    $.each(rst.PartPointList, function (r_i, r_item) {
                                        if (p_item.PartPointID == r_item) {
                                            _PartPointList.push(p_item);
                                        }
                                    })

                                })
                                PartPointSource.PartPointList = _PartPointList;
                                item.PartPointList = item.PartPointList.concat(_PartPointList);

                            }
                        });

                        model.com.addPart({
                            data: dataPart
                        }, function (res) {
                            alert("新增成功");
                            model.com.refreshTree();
                            model.com.refreshPartPoint(rst.PartID);
                        })
                    }, TypeSource_PartPoint))
                });
                //上移工序
                $("body").delegate("#cby-up-partPoint", "click", function () {
                    var SelectData = $com.table.getSelectionData($("#cby-PartPoint-tbody"), 'OrderID', PartPointSource);
                    //判断是否在第一行
                    if (SelectData[0].OrderID == 1) {
                        alert("已在第一项！！！");
                        return false;
                    }
                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return false;
                    } else if (SelectData.length>1) {
                        alert(" 一次只能对一行数据移动！")
                        return false;
                    }
                    var _partid = partid,
                        partpointid = SelectData[0].PartPointID;
                    
                    //修改内部数据
                    var flag = true;
                    $.each(dataPart, function (i, item) {
                        if (item.PartID == _partid) {
                            $.each(item.PartPointList, function (p_i, p_item) {
                                if (SelectData[0].OrderID == p_item.OrderID) {
                                    var temp = $com.util.Clone(p_item);
                                    var wPrevOrderID = item.PartPointList[p_i - 1].OrderID
                                    item.PartPointList[p_i] = item.PartPointList[p_i - 1];
                                    item.PartPointList[p_i].OrderID = temp.OrderID;

                                    item.PartPointList[p_i - 1] = temp;
                                    item.PartPointList[p_i - 1].OrderID = wPrevOrderID;

                                    return false;
                                }
                            })
                        }
                    });
                    //修改显示OrderID
                    var $selectedTr = $("#cby-PartPoint-tbody input:checked").closest("tr");
                    var $preSelectedTr = $selectedTr.prev("tr");

                    var orderid = $selectedTr.find("td[data-title=OrderID]").html();
                    var preOrderid = $preSelectedTr.find("td[data-title=OrderID]").html();
                    var tempOrderID = orderid;

                    var temp;
                    $selectedTr.find("td[data-title=OrderID]").html(preOrderid);
                    $preSelectedTr.find("td[data-title=OrderID]").html(tempOrderID);

                    //修改DATA -OrderID
                    $selectedTr.find("td[data-title=OrderID]").attr("data-value", $selectedTr.find("td[data-title=OrderID]").html());
                    $preSelectedTr.find("td[data-title=OrderID]").attr("data-value", $preSelectedTr.find("td[data-title=OrderID]").html());

                    //修改显示数据
                    var $temp = $preSelectedTr.children();
                    $preSelectedTr.html($selectedTr.children());
                    $selectedTr.html($temp);
                    $selectedTr = $preSelectedTr;

                    model.com.addPart({
                        data: dataPart
                    })
                });
                //下移工序
                $("body").delegate("#cby-down-partPoint", "click", function () {
                    var SelectData = $com.table.getSelectionData($("#cby-PartPoint-tbody"), 'OrderID', PartPointSource);
                    var maxLength = PartPointSource.length;
                    if (SelectData[0].OrderID == maxLength) {
                        alert("已经在最后一行！！！");
                        return false;
                    }

                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！");
                        return false;
                    } else if (SelectData.length > 1) {
                        alert(" 一次只能对一行数据移动！");
                        return false;
                    }
                    var _partid = partid;
                    var flag = true;
                    $.each(dataPart, function (i, item) {
                        if (item.PartID == _partid) {
                            $.each(item.PartPointList, function (p_i, p_item) {
                                if (SelectData[0].OrderID == p_item.OrderID) {
                                    var temp = $com.util.Clone(p_item);
                                    var wNextOrderID = item.PartPointList[p_i + 1].OrderID
                                    item.PartPointList[p_i] = item.PartPointList[p_i + 1];
                                    item.PartPointList[p_i].OrderID = temp.OrderID;

                                    item.PartPointList[p_i + 1] = temp;
                                    item.PartPointList[p_i + 1].OrderID = wNextOrderID;

                                    return false;
                                }
                                
                            })
                        }
                    });

                    
                    var $selectedTr = $("#cby-PartPoint-tbody input:checked").closest("tr");
                    var $nextSelectedTr = $selectedTr.next("tr");
                    //修改显示OrderID

                    //var orderid = $selectedTr.find("td[data-title=OrderID]").html();
                    //var nextOrderID = $nextSelectedTr.find("td[data-title=OrderID]").html();
                    //var tempOrderID = orderid;

                    //$selectedTr.find("td[data-title=OrderID]").html(nextOrderID);
                    //$nextSelectedTr.find("td[data-title=OrderID]").html(tempOrderID);


                    var orderid = $selectedTr.find("td[data-title=OrderID]").html();
                    $selectedTr.find("td[data-title=OrderID]").html($nextSelectedTr.find("td[data-title=OrderID]").html());
                    $nextSelectedTr.find("td[data-title=OrderID]").html(orderid);
                      
                    //修改显示数据
                    var $temp = $nextSelectedTr.children();
                    $nextSelectedTr.html($selectedTr.children());
                    $selectedTr.html($temp);
                    $selectedTr = $nextSelectedTr;

                    //修改DATA -OrderID
                    $selectedTr.find("td[data-title=OrderID]").attr("data-value", $selectedTr.find("td[data-title=OrderID]").html());
                    $nextSelectedTr.find("td[data-title=OrderID]").attr("data-value", $nextSelectedTr.find("td[data-title=OrderID]").html());

                    model.com.addPart({
                        data: dataPart
                    })
                    model.com.addPart({
                        data: dataPart
                    }, function (res) {
                        //model.com.refreshTree();
                        //model.com.refreshPartPoint(_partid);
                    })
                });
                //删除工序
                $("body").delegate("#cby-delete-partPoint", "click", function () {
                    var SelectData = $com.table.getSelectionData($("#cby-PartPoint-tbody"), 'OrderID', PartPointSource);
                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return;
                    }
                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {
                        return;
                    }
                    var partpointList = [];

                    $.each(dataPart, function (i, item) {
                        if (item.PartID == partid) {
                            partpointList = item.PartPointList;
                            return false;
                        }
                    });
                    var _partpointList = $com.util.Clone(partpointList);
                    var arr = model.com.getNewPartPointList(_partpointList, SelectData);

                    $.each(dataPart, function (i, item) {
                        if (item.PartID == partid) {
                            item.PartPointList = arr;
                            return false;
                        }
                    });

                    model.com.addPart({
                        data: dataPart
                    }, function (res) {
                        alert("删除成功");
                        model.com.refreshTree();
                        model.com.refreshPartPoint(partid);
                    })
                });
                //模糊查询工序
                $("body").delegate("#cby-search-text-ledger", "input", function () {
                    var $this = $(this),
                        value = $(this).val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#cby-PartPoint-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#cby-PartPoint-tbody"), PartPointSource, value, "OrderID");
                });
                //精准查询
                $("body").delegate("#cby-search-ledger", "click", function () {

                    var default_value = {
                        PartPointName: ""
                    };

                    $("body").append($com.modal.show(default_value, KEYWORD_PartPoint, "查询", function (rst) {


                        if (!rst || $.isEmptyObject(rst))
                            return;

                        default_value.PartPointName = rst.PartPointName;

                        $com.table.filterByConndition($("#cby-ledger-tbody"), PartPointSource, default_value, "OrderID");

                    }, TypeSource_PartPoint));

                });
            },
            run: function () {
                model.com.getPartPoint({}, function (data_PartPoint) {
                    dataPartPoint = data_PartPoint.list;
                });
                model.com.refreshTree();
            },
            com: {
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
                refreshTree: function () {
                    model.com.getPart({}, function (data_Part) {
                        dataPart = data_Part.list;
                        model.com.renderTree(dataPart);
                    });
                },
                renderTree: function (list) {
                    model._treeData = list;
                    $.each(list, function (i, item) {
                        item.Items=$com.util.template(item.PartPointList, HTML.TreePartPointItemNode);
                    });
                   
                    $("#PartTree").html($com.util.template(list, HTML.TreePartItemNode));
                    $("#PartTree").treeview();
                },
                refreshPartPoint: function (PartID) {
                    var p_data = [];
                    $.each(dataPart, function (i, item) {
                        if (item.PartID == PartID) {
                            var PartPointList = [];
                            PartPointList = item.PartPointList;
                            p_data = PartPointList;
                            return false;
                        }

                    })
                    model.com.renderPartPoint(p_data);
                },
                renderPartPoint: function (list) {
                    $.each(list, function (i, item) {
                        item.OrderID = i + 1;
                    })
                    var _list = $com.util.Clone(list);                   
                    $.each(_list, function (i, item) {
                        for (var p in item) {
                            if (!FORMATTRT[p])
                                continue;
                            item[p] = FORMATTRT[p](item[p]);
                        }
                    });
                    $("#cby-PartPoint-tbody").html($com.util.template(_list, HTML.PartItemNode));
                    PartPointSource=_list;
                },
                //list  需要添加orderID的数据列表 注意 单层 orderID：工序段顺序ID list：此工序段下工序列表 
                addOrder: function (list, orderID) {

                    $.each(list,function (i, item) {
                        item.OrderID_P = orderID;
                    });
                },
                chooseEvent: function (flag, $this) {
                    switch (flag) {
                        case 1://part
                            var PartID = $this.attr("data-value");
                            partid = PartID;
                            $("#PartTree li").css("color", "black");
                            $this.css("color", "blue");
                            model.com.refreshPartPoint(PartID);
                            break;

                        case 2: //partpoint
                           
                            break;
                        default:
                            break;
                    }
                },
                chooseDel: function (flag, $input) {
                    switch (flag) {
                        
                        case 1://part                          
                            model.com.delUtils.part($input);

                            break;

                        case 2: //partpoint
                            model.com.delUtils.partpoint($input);
                            break;
                        default: 
                            break;
                    }
                },
                delUtils: {
                    part: function ($part) {
                        var selectData = [];
                        //找到被选中的元素的PartID
                        var _PartID;
                        $.each($("#PartTree").find('li').find('input'), function (i, item) {
                            if ($(item).is(":checked")) {
                                var k = {
                                    PartID: $(item).closest("li.part").attr("data-value"),
                                }
                                selectData.push(k);
                            }
                        });
                        //删除选择的工序段
                        var partList = $com.util.Clone(dataPart);
                        var _partList = model.com.getNewPartList(partList, selectData);
                        dataPart = _partList;
                        
                        model.com.addPart({
                            data: dataPart,
                        }, function (res) {
                            alert("删除成功！！");
                            model.com.refreshTree();
                        });
                    },
                    partpoint: function ($partpoint) {
                        var selectData = [];
                        //找到被选中的元素的PartID
                        $.each($("#PartTree").find('li').find('input'), function (i, item) {
                            if ($(item).is(":checked")) {
                                var k = {
                                    PartPointID: $(item).closest("li.partpoint").attr("data-value"),
                                    PartID: $(item).closest("li.part").attr("data-value")
                                }
                                selectData.push(k);
                            }
                        });
                        //拿到此工序段的所有工序
                        var partPointList = [];
                        $.each(dataPart, function (p_i, p_item) {
                            if ( p_item.PartID==$partpoint.closest("li.part").attr("data-value")) {
                                partPointList = p_item.PartPointList;
                                return false;
                            }
                        })
                        //删除选择的工序
                        var _partPointList = $com.util.Clone(partPointList);
                        var arr = model.com.getNewShiftList(_partPointList, selectData);

                        $.each(dataPart, function (p_i, p_item) {
                            if (p_item.PartID == $partpoint.closest("li.part").attr("data-value")) {
                                p_item.PartPointList = arr;
                                return false;
                            }
                        })

                        model.com.addPart({
                            data: dataPart,
                        }, function (res) {
                            alert("删除成功！！");
                            model.com.refreshTree();
                        });
                    }
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
                            if (_source[i].PartPointID == set_data[j].PartPointID) {
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
                getNewPartList: function (_source, set_data) {
                    if (!_source)
                        _source = [];
                    if (!set_data)
                        set_data = [];
                    var rst = [];
                    for (var i = 0; i < _source.length; i++) {
                        var NotOWn = false;
                        for (var j = 0; j < set_data.length; j++) {
                            if (_source[i].PartID == set_data[j].PartID) {
                                _source.splice(i, 1);
                                set_data.splice(j, 1);
                                NotOWn = true;
                            }
                            if (set_data.length < 1) {
                                break;
                            }
                            if (NotOWn) {
                                model.com.getNewPartList(_source, set_data);
                            }
                        }

                    }
                    rst = _source;
                    return rst;
                },
                getNewPartPointList: function (_source, set_data) {
                    if (!_source)
                        _source = [];
                    if (!set_data)
                        set_data = [];
                    var rst = [];
                    for (var i = 0; i < _source.length; i++) {
                        var NotOWn = false;
                        for (var j = 0; j < set_data.length; j++) {
                            if (_source[i].PartPointID == set_data[j].PartPointID) {
                                _source.splice(i, 1);
                                set_data.splice(j, 1);
                                NotOWn = true;
                            }
                            if (set_data.length < 1) {
                                break;
                            }
                            if (NotOWn) {
                                model.com.getNewPartList(_source, set_data);
                            }
                        }

                    }
                    rst = _source;
                    return rst;
                },
                getNewPartPointArr: function (_source, set_data) {
                    if (!_source)
                        _source = [];
                    if (!set_data)
                        set_data = [];
                    var rst = [];
                    for (var i = 0; i < _source.length; i++) {
                        var NotOWn = false;
                        for (var j = 0; j < set_data.length; j++) {
                            if (_source[i].value == set_data[j].PartPointID) {
                                _source.splice(i, 1);
                                set_data.splice(j, 1);
                                NotOWn = true;
                            }
                            if (set_data.length < 1) {
                                break;
                            }
                            if (NotOWn) {
                                model.com.getNewPartList(_source, set_data);
                            }
                        }

                    }
                    rst = _source;
                    return rst;
                }
            }
        })
         model.init();
    });