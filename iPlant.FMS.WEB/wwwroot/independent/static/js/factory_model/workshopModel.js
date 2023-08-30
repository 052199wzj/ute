require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/jquery.treeview'],
    function ($yang, $com, $treeview) {
        var HTML,
            KEYWORD,
            KEYWORD_WORKSHOP,
            KEYWORD_Line,
            KEYWORD_Group,

            KEYWORD_LIST,
            KETWROD_LIST_WORKSHOP,
            KEYWORD_LIST_Line,
            KEYWORD_LIST_Group,

            FORMATTRT,
            Formattrt_WORKSHOP,
            FORMATTRT_Line,
            FORMATTRT_Group,

            model,

            DEFAULT_VALUE,
            DEFAULT_VALUE_WORKSHOP,
            DEFAULT_VALUE_LINE,
            DEFAULT_VALUE_Group,

            TypeSource,
            TypeSource_Line,
            TypeSource_Group,
            TypeSource_WORKSHOP,

            KEYWORD_LIST_Part,
            FORMATTRT_Part,
            KEYWORD_Part,
            DEFAULT_VALUE_Part,
            TypeSource_Part,

            KEYWORD_LIST_group,
            FORMATTRT_group,
            KEYWORD_group,
            DEFAULT_VALUE_group,
            TypeSource_group,

            ProcessSource,
            partSource,
            groupSource,



            workshop_source,
            dataAll,
            _data_Line,
            data_part,

            PartOrderID,
            PartPointOrderID,


            w_d,
            l_d,
            p_d,
            flag = 0,
            $check;
        HTML = {
            TreeWorkshopItemNode: [
				'<li data-value="{{ID}}" class="workshop">',
				'<span style="vertical-align:top;"><input type="checkbox" class="femi-tree-checkbox" style="margin: 1px 0px 1px"  value="{{FunctionID}}"  />{{WorkShopName}}</span> ',
				'<ul>{{Items}}</ul>',
				'</li> ',
            ].join(""),
            TreeLineItemNode: [
               '<li data-value="{{ID}}" class="click-delegate line">',
               '<span style="vertical-align:top;"><input type="checkbox" class="femi-tree-checkbox" style="margin: 1px 0px 1px"  value="{{FunctionID}}"  />{{ItemName}}</span> ',
               '<ul>{{Items}}</ul>',
               '</li> ',
            ].join(""),

            TreePartItemNode: [
                '<li data-value="{{PartID}}"  class="click-delegate part">',
               '<span style="vertical-align:top;"><input type="checkbox" class="femi-tree-checkbox" style="margin: 1px 0px 1px"  value="{{FunctionID}}"  />{{PartName}}</span> ',
               '<ul>{{Items}}</ul>',
               '</li> ',
            ].join(""),
            TreeGroupItemNode: [
                '<li data-value="{{GroupID}}"  class="click-delegate group">',
               '<span style="vertical-align:top;"><input type="checkbox" class="femi-tree-checkbox" style="margin: 1px 0px 1px"  value="{{FunctionID}}"  />{{GroupName}}</span> ',
               '</li> ',
            ].join(""),
            PartPointItemNode: [
                '<tr><td style="widtd: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></td>',
                '<td style="min-widtd:50px"   data-title="OnlyID" data-value = "{{OnlyID}}">{{OnlyID}}</td>',
                '<td style="min-widtd:50px"   data-title="OrderID_P" data-value = "{{OrderID_P}}">{{OrderID_P}}</td>',
                '<td style="min-widtd:50px"   data-title="PartPointOrderID" data-value = "{{PartPointOrderID}}">{{PartPointOrderID}}</td>',
			    '<td style="min-width: 50px" data-title="WorkShopName" data-value="{{WorkShopName}}"  >{{WorkShopName}}</td> ',
			    '<td style="min-width: 50px" data-title="LineName" data-value="{{LineName}}"  >{{LineName}}</td> ',
			    '<td style="min-width: 50px" data-title="PartName" data-value="{{PartName}}"  >{{PartName}}</td>   ',
			    '<td style="min-width: 50px" data-title="PartPointName" data-value="{{PartPointName}}"  >{{PartPointName}}</td>  ',
                '<td style="min-widtd:50px"   data-title="Creator" data-value = {{Creator}}>{{Creator}}</td>',
                '<td style="min-widtd:50px"   data-title="CreateTime" data-value = {{CreateTime}}>{{CreateTime}}</td>',
                '</tr>',
            ].join(""),
            PartItemNode: [
                '<tr><td style="widtd: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></td>',
                '<td style="min-widtd:50px"   data-title="PartPointOrderID" data-value =" {{PartPointOrderID}}">{{PartPointOrderID}}</td>',
                '<td style="min-width: 50px" data-title="PartPointName" data-value="{{PartPointName}}"  >{{PartPointName}}</td>  ',
                '<td style="min-widtd:50px"   data-title="Creator" data-value = "{{Creator}}">{{Creator}}</td>',
                '<td style="min-widtd:50px"   data-title="CreateTime" data-value = "{{CreateTime}}">{{CreateTime}}</td>',
                '</tr>',
            ].join(""),
            GroupItemNode: [
                '<tr><td style="widtd: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></td>',
                '<td style="min-widtd:50px"   data-title="OrderID" data-value = "{{OrderID}}">{{OrderID}}</td>',
                '<td style="min-width: 50px" data-title="PartPointName" data-value="{{PartPointName}}"  >{{PartPointName}}</td>  ',
                '<td style="min-widtd:50px"   data-title="Creator" data-value = "{{Creator}}">{{Creator}}</td>',
                '<td style="min-widtd:50px"   data-title="CreateTime" data-value = "{{CreateTime}}">{{CreateTime}}</td>',
                '</tr>',
            ].join("")
        };
        
        (function () {
            KEYWORD_LIST = [
			"WorkShopID|车间|ArrayOne",
			"LineID|产线|ArrayOneControl|WorkShopID",
            "PartID|工序段|ArrayOneControl|LineID",
            "GroupID|工序组名|ArrayOneControl|PartID",
            "PartPointID|工序名|ArrayOne",
            "PartPointList|工序|Array"
            ];
            FORMATTRT = {};
            KEYWORD = {};
            DEFAULT_VALUE = {
                PartID: "",
                GroupID: "",
                PartPointList: ""
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
                PartID: [{
                    name: "全部",
                    value: 0,
                    far: 0,
                }],
                GroupID: [{
                    name: "全部",
                    value: 0,
                    far: 0
                }],
                PartPointID: [{
                    name: "全部",
                    value: 0,
                    far: 0
                }],
                PartPointList: [],
            };
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
        })();
        //workshop(tree)
        (function () {
            KEYWORD_LIST_WORKSHOP = [
                "WorkShopID|车间名称"
            ];
            KEYWORD_WORKSHOP = {};
            DEFAULT_VALUE_WORKSHOP = {
                WorkShopID: ""
            };

            Formattrt_WORKSHOP = {};

            TypeSource_WORKSHOP = {
                WorkShopID: [
                   {
                       name: "",
                       value: 0
                   }
                ]
            };
            $.each(KEYWORD_LIST_WORKSHOP, function (i, item) {
                var detail = item.split("|");
                KEYWORD_WORKSHOP[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_WORKSHOP[detail[0]] = $com.util.getFormatter(TypeSource_WORKSHOP, detail[0], detail[2]);
                }
            });
        })();
        //line(tree)
        (function () {
            KEYWORD_LIST_Line = [
                 "ItemName|产线名称"
            ];
            KEYWORD_Line = {};

            Formattrt_Line = {};
            DEFAULT_VALUE_LINE = {
                ItemName: ""
            };
            TypeSource_Line = {
                ItemName: [
                  {
                      name: "",
                      value: 0
                  }
                ]
            };

            $.each(KEYWORD_LIST_Line, function (i, item) {
                var detail = item.split("|");
                KEYWORD_Line[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_Line[detail[0]] = $com.util.getFormatter(TypeSource_Line, detail[0], detail[2]);
                }
            });
        })();
        //Group(tree)
        (function () {
            KEYWORD_LIST_Group = [
                "GroupID|工序组编号|LongText",
                "GroupName|工序组名称",
                "PartPointList|工序名|Array|PartID"
            ];
            KEYWORD_Group = {};

            Formattrt_Group = {};
            DEFAULT_VALUE_Group = {
                GroupID: 0,
                GroupName: "",
                PartPointList: ""
            };
            TypeSource_Group = {
                GroupName: [
                  {
                      name: "",
                      value: 0
                  }
                ],
                PartPointList: [

                ]
            };

            $.each(KEYWORD_LIST_Group, function (i, item) {
                var detail = item.split("|");
                KEYWORD_Group[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_Group[detail[0]] = $com.util.getFormatter(TypeSource_Group, detail[0], detail[2]);
                }
            });
        })();
        //part(tree)
        (function () {
            KEYWORD_LIST_part = [
                "WorkShopID|车间编号|LongText",
                "WorkShopName|车间名称|LongText",
                "LineID|产线编号|LongText",
                "LineName|产线名称|LongText",
                "PartList|工序段名称|Array",
            ];
            KEYWORD_part = {};
            DEFAULT_VALUE_part = {
                WorkShopID: 0,
                WorkShopName: "",
                LineID: 0,
                LineName: "",
                PartList: "",
            };

            Formattrt_part = {};

            TypeSource_part = {

            };
            $.each(KEYWORD_LIST_part, function (i, item) {
                var detail = item.split("|");
                KEYWORD_part[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_part[detail[0]] = $com.util.getFormatter(TypeSource_part, detail[0], detail[2]);
                }
            });
        })();
        //Part(table)
        (function () {
            KEYWORD_LIST_Part = [
                "PartName|工序段名称|LongText",
                "PartPointList|工序名称|Array",
            ];
            KEYWORD_Part = {};
            DEFAULT_VALUE_Part = {
                PartName: "",
                PartPointList: "",
            };

            Formattrt_Part = {};

            TypeSource_Part = {
               
                PartPointList:[]
            };
            $.each(KEYWORD_LIST_Part, function (i, item) {
                var detail = item.split("|");
                KEYWORD_Part[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_Part[detail[0]] = $com.util.getFormatter(TypeSource_Part, detail[0], detail[2]);
                }
            });
        })();
        //group(table)
        (function () {
            KEYWORD_LIST_group = [
                "PartName|工序段名称|LongText",
                "GroupName|组名称|LongText",
                "PartPointList|工序名称|Array",
            ];
            KEYWORD_group = {};
            DEFAULT_VALUE_group = {
                PartName: "",
                GroupName:"",
                PartPointList: "",
            };

            Formattrt_group = {};

            TypeSource_group = {

                PartPointList: []
            };
            $.each(KEYWORD_LIST_group, function (i, item) {
                var detail = item.split("|");
                KEYWORD_group[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_group[detail[0]] = $com.util.getFormatter(TypeSource_group, detail[0], detail[2]);
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
                    if ($this.hasClass("line")) {
                        flag = 0;
                        $check = $this;
                    } else if ($this.hasClass("part")) {
                        flag = 1;
                        $check = $this;
                    } else if ($this.hasClass("group")) {
                        flag = 2;
                        $check = $this;
                    }

                    model.com.chooseEvent(flag, $this);
                })
                //新增事件
                $("body").delegate("#cby-tree-add", "click", function () {
                    var flag,
                        $Input = $("#workshopTree li input[type=checkbox]:checked"),
                        $this = undefined;
                    if ($Input.length > 1) {
                        alert("只能对一个数据进行添加操作！");
                        return false;
                    } else if ($Input.length == 0) {
                        flag = -1;
                    } else {
                        $this = $Input.closest("li");
                        if ($this.hasClass("workshop")) {
                            flag = 0;
                        } else if ($this.hasClass("line")) {
                            flag = 1;
                        } else if ($this.hasClass("part")) {
                            flag = 2;
                        } else {
                            alert("不能对组进行添加操作！");
                            return false;
                        }
                    }
                    model.com.chooseAdd(flag, $this);
                })
                //删除事件
                $("body").delegate("#cby-tree-delete", "click", function () {

                    var $Input = $("#workshopTree li input[type=checkbox]:checked"),
                       $this = undefined;
                    if ($Input.length == 0) {
                        alert("请选择需要删除的项！");
                        return false;
                    }

                    var $workshopInput = $("#workshopTree li.workshop>span>input[type=checkbox]:checked");
                    var $lineInput = $("#workshopTree li.line>span>input[type=checkbox]:checked");
                    var $partInput = $("#workshopTree li.part>span>input[type=checkbox]:checked");
                    var $groupInput = $("#workshopTree li.group>span>input[type=checkbox]:checked");
                    var flag;
                    if ($groupInput.length > 0) {
                        var $group = $groupInput.closest("li");
                        //删组
                        flag = 0;
                        model.com.chooseDel(flag);
                    }
                    if ($partInput.length > 0) {
                        var $part = $partInput.closest("li");
                        //删工序段
                        flag = 1;
                        model.com.chooseDel(flag, $part);
                    }
                    if ($lineInput.length > 0) {
                        var $line = $lineInput.closest("li");
                        //删产线
                        flag = 2;
                        model.com.chooseDel(flag, $line);
                    }
                    if ($workshopInput.length > 0) {
                        var $workshop = $workshopInput.closest("li").attr("data-value");
                        //删车间
                        flag = 3;
                        model.com.chooseDel(flag, $workshop);
                    }
                });
                //另存为
                $("body").delegate("#cby-tree-save", "click", function () {
                    //判断是否勾选产线
                    //存在且唯一，则获取此产线对应的数据，否则弹窗提示_Line
                    var $input = $(".line input[type=checkbox]:checked");
                    if ($input[0]) {
                        if ($input.length == 1) {
                            //拿到对应的车间和产线ID
                            var _LineID = $input.closest("li").attr("data-value");
                            var _WorkShopID = $input.closest("ul").closest("li").attr("data-value");
                            //获得当前勾选的产线对应的数据
                            var sel_data_Line = $com.util.find(dataAll.list, function (p) {
                                return p.WorkShopID == _WorkShopID && p.LineID == _LineID;
                            });
                            var sel_data;
                            $.each(workshop_source, function (i, item) {
                                if (item.ID != _WorkShopID)
                                    return true;

                                sel_data = $com.util.find(item.LineList, function (p_l) {
                                    return p_l.ID == _LineID;
                                });
                            });

                            if (!sel_data || !sel_data_Line) {
                                alert("此产线对应的元数据不存在");
                                return;
                            }
                            //克隆 防止引用传递修改原始值
                            sel_data = $com.util.Clone(sel_data);
                            sel_data_Line = $com.util.Clone(sel_data_Line);

                            //更改产线的ID和ItemName
                            $("body").append($com.modal.show(DEFAULT_VALUE_LINE, KEYWORD_Line, "新增产线", function (rst) {
                                if (!rst || $.isEmptyObject(rst))
                                    return false;
                                //拿到新增产线的名称 
                                //workshop
                                sel_data.ID = model.com.GetMaxID(workshop_source);
                                sel_data.ItemName = rst.ItemName;
                                sel_data.Creator = window.parent.User_Info.Name;
                                sel_data.CreateTime = $com.util.format("yyyy-MM-dd hh:mm:ss", new Date());

                                //line
                                sel_data_Line.LineID = sel_data.ID;
                                sel_data_Line.LineName = sel_data.ItemName;
                                sel_data_Line.Creator = sel_data.Creator;
                                sel_data_Line.CreateTime = sel_data.CreateTime;

                                //判断添加进去的产线名是否与其他产线重复  
                                var _judge = $com.util.findIndex(dataAll.list, function (p) {
                                    return p.WorkShopID == sel_data_Line.WorkShopID && p.LineName == sel_data_Line.LineName;
                                }) >= 0;

                                _judge = _judge || $com.util.findIndex(workshop_source, function (p) {

                                    return p.ID == _WorkShopID
                                        && $com.util.findIndex(p.LineList, function (p_l) {
                                            return p_l.ItemName == sel_data.ItemName;
                                        }) >= 0;
                                }) >= 0;

                                if (_judge) {
                                    alert("产线名称重复！");
                                    return;
                                }

                                //将新生成的产线数据添加到元数据中
                                $.each(workshop_source, function (i, item) {
                                    if (item.ID == _WorkShopID) {
                                        workshop_source[i].LineList.push(sel_data)
                                    }
                                });
                                $.each(sel_data_Line.PartList, function (i, item) {
                                    item.LineID = sel_data_Line.LineID;
                                    item.LineName = sel_data_Line.LineName;
                                    item.Creator = sel_data_Line.Creator;
                                    item.CreateTime = sel_data_Line.CreateTime;
                                    $.each(item.PartPointList, function (i_p, item_p) {
                                        item_p.LineID = sel_data_Line.LineID;
                                        item_p.LineName = sel_data_Line.LineName;
                                        item_p.Creator = sel_data_Line.Creator;
                                        item_p.CreateTime = sel_data_Line.CreateTime;
                                    });
                                });

                                dataAll.list.push(sel_data_Line);

                                //重新加载数据
                                model.com.addWorkShop({
                                    data: workshop_source,
                                }, function (res) {
                                    model.com.addLine({
                                        data: dataAll.list
                                    }, function (res) {
                                        alert("新增成功！！");
                                        model.com.refreshTree();
                                        model.com.refreshLine(_WorkShopID, _LineID);
                                    });

                                });



                            }, TypeSource_Line))

                        }
                        else {
                            alert("只能对一个产线进行复制操作！")
                        }
                    }
                    else {
                        alert("未选择需要复制的产线！")
                    }
                });
                //产线下删除工序
                $("body").delegate("#cby-delete-partPoint", "click", function () {
                    var SelectData = $com.table.getSelectionData($("#cby-PartPoint-tbody"), 'OnlyID', ProcessSource);
                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return;
                    }
                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {
                        return;
                    }
                    //找到OnlyID相同的一行，拿到其工序ID
                    $.each(dataAll.list, function (i, item) {
                        if (item.WorkShopID == SelectData[0].WorkShopID && item.LineID == SelectData[0].LineID) {
                            w_d = item.WorkShopID,
                            l_d = item.LineID;
                            var arr = [];
                            $.each(item.PartList, function (p_i, p_item) {
                                if (SelectData.length == 0)
                                    return false;
                                if (p_item.PartID == SelectData[0].PartID) {
                                    var partPointID;
                                    $.each(p_item.PartPointList, function (pp_i, pp_item) {
                                        if (pp_item.OnlyID == SelectData[0].OnlyID) {
                                            partPointID = pp_item.PartPointID;
                                            model.com.getNewPartPointList(p_item.PartPointList, SelectData);
                                            return false;
                                        }
                                    });
                                    $.each(p_item.PointGroupList, function (g_i, g_item) {
                                        $.each(g_item.PartPointList, function (_pp_i, _pp_item) {
                                            if (_pp_item.PartPointID == partPointID) {
                                                model.com.getNewPartPointList(g_item.PartPointList, SelectData);
                                                return false;
                                            }
                                        });
                                    });
                                }
                            });
                        }
                    });

                    model.com.addLine({
                        data: dataAll.list
                    }, function (res) {
                        alert("删除成功");
                        model.com.refreshLine(w_d, l_d);
                    })
                });
                //产线下模糊查询工序
                $("body").delegate("#cby-search-text-ledger", "input", function () {
                    var $this = $(this),
                        value = $(this).val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#cby-PartPoint-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#cby-PartPoint-tbody"), ProcessSource, value, "OnlyID");
                });

                //工序段下添加工序
                $("body").delegate("#cby-add-part-partPoint", "click", function () {
                    var partID = $check.attr("data-value"),
                        lineID = $check.closest("li.line").attr("data-value"),
                        workshopID = $check.closest("li.workshop").attr("data-value");
                    TypeSource_Part.PartPointList=[{
                        name: "",
                        value:0
                    }];
                    //拿到此工序段下所有工序
                    var PartPointList = [];
                    $.each(data_part.list, function (i, item) {
                        if (item.PartID == partID) {
                            PartPointList = item.PartPointList;
                            return false;
                        }
                    });
                    //拿到此工序段下的工序
                    var partPointList = [],
                        partName;
                    $.each(dataAll.list, function (i, item) {
                        if (item.WorkShopID == workshopID && item.LineID == lineID) {
                            $.each(item.PartList, function (p_i, p_item) {
                                if (p_item.PartID == partID) {
                                    partName = p_item.PartName;
                                    partPointList = p_item.PartPointList;
                                    return false;
                                }
                            })
                        }
                    });
                    //删除相同工序
                    var _PartPointList = $com.util.Clone(PartPointList);
                    var _partPointList = $com.util.Clone(partPointList);

                    var _partpointList = model.com.getNewPartPointList(_PartPointList, _partPointList);
                    //填充模态框的值
                    DEFAULT_VALUE_Part.PartName = partName;
                    $.each(_partpointList, function (i, item) {
                        TypeSource_Part.PartPointList.push({
                            name: item.PartPointName,
                            value: item.PartPointID
                        });
                    });
                    var partPointItem = $com.util.Clone(_partpointList);
                    $("body").append($com.modal.show(DEFAULT_VALUE_Part, KEYWORD_Part, "新增工序", function (rst) {
                        //调用插入函数 
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        $.each(dataAll.list, function (i, item) {
                            if (item.WorkShopID == workshopID && item.LineID == lineID) {
                                $.each(item.PartList, function (p_i, p_item) {
                                    if (p_item.PartID == partID) {
                                        $.each(partPointItem, function (_pp_i, _pp_item) {
                                            _pp_item.LineID = lineID,
                                            _pp_item.LineName = p_item.LineName,
                                            _pp_item.WorkShopID = workshopID,
                                            _pp_item.WorkShopName = p_item.WorkShopName,
                                            _pp_item.PartID = partID,
                                            _pp_item.PartName = p_item.PartName;
                                        });
                                        var arr = [];
                                        $.each(rst.PartPointList, function (r_i, r_item) {
                                            $.each(partPointItem, function (_p_i, _p_item) {
                                                if (r_item == _p_item.PartPointID) {
                                                    _p_item.OrderID = model.com.GetMaxOrderID(partPointList) + r_i;
                                                    arr.push(_p_item);
                                                    p_item.PartPointList = partPointList.concat(arr);
                                                }
                                            });
                                        });
                                        return false;
                                    }
                                });
                            }
                        });
                        model.com.addLine({
                            data: dataAll.list
                        }, function (res) {
                            alert("新增成功");
                            model.com.refreshLine(workshopID, lineID);
                            model.com.refreshPart(workshopID, lineID, partID);
                        })
                    }, TypeSource_Part))
                });
                //工序段表下删除工序
                $("body").delegate("#cby-delete-part-partPoint", "click", function () {
                        var SelectData = $com.table.getSelectionData($("#cby-part-tbody"), 'PartPointOrderID', partSource);
                        if (!SelectData || !SelectData.length) {
                            alert("请先选择一行数据再试！")
                            return;
                        }
                        if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {
                            return;
                        }
                        var workshopID, lineID, partID;
                        $.each(dataAll.list, function (i, item) {
                            if (SelectData.length == 0)
                                return false;
                            if (item.WorkShopID == SelectData[0].WorkShopID && item.LineID == SelectData[0].LineID) {
                                workshopID = item.WorkShopID,
                                lineID = item.LineID;
                                $.each(item.PartList, function (p_i, p_item) {
                                    if (p_item.PartID == SelectData[0].PartID) {
                                        partID = p_item.PartID;
                                        p_item.PartPointList = model.com.getNewPartPointList(p_item.PartPointList, SelectData);
                                        return false;
                                    }
                                });
                            }
                        })
                        
                        model.com.addLine({
                            data: dataAll.list
                        }, function (res) {
                            alert("删除成功");
                            model.com.refreshLine(workshopID, lineID);
                            model.com.refreshPart(workshopID, lineID, partID);
                        });
                });
                //工序段下模糊查询工序
                $("body").delegate("#cby-search-text-ledger", "input", function () {
                    var $this = $(this),
                        value = $(this).val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#cby-part-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#cby-part-tbody"), partSource, value, "PartPointOrderID");
                });

                //组下添加工序
                $("body").delegate("#cby-add-group-partPoint", "click", function () {
                    var groupID = $check.attr("data-value"),
                        partID = $check.closest("li.part").attr("data-value"),
                        lineID = $check.closest("li.line").attr("data-value"),
                        workshopID = $check.closest("li.workshop").attr("data-value");
                    TypeSource_group.PartPointList = [];
                    //拿到此工序段的所有工序
                    var PartPointList = [], GroupPartPointList = [], partName, groupName, _GroupPartPointList = [];
                    $.each(dataAll.list, function (i, item) {
                        if (item.WorkShopID == workshopID && item.LineID == lineID) {
                            $.each(item.PartList, function (p_i, p_item) {
                                if (p_item.PartID == partID) {
                                    //拿到此工序段下所有工序
                                    PartPointList = p_item.PartPointList,
                                    partName = p_item.PartName;
                                    //拿到所有组
                                    GroupPartPointList = p_item.PointGroupList;

                                    $.each(p_item.PointGroupList, function (g_i, g_item) {
                                        if (g_item.GroupID == groupID) {
                                            groupName = g_item.GroupName;
                                            //_GroupPartPointList = g_item.PartPointList;
                                            return false;
                                        }
                                    });
                                    return false;
                                }
                            });
                        }
                    });
                    DEFAULT_VALUE_group.PartName = partName,
                    DEFAULT_VALUE_group.GroupName = groupName;
                    //删除已经在其他组中重复的工序
                    var groupPartPointList = [];
                    var _GroupPartPointList = $com.util.Clone(GroupPartPointList),
                        _PartPointList = $com.util.Clone(PartPointList);
                    $.each(_GroupPartPointList, function (g_i, g_item) {
                        $.each(g_item.PartPointList, function (p_i, p_item) {
                            $.each(_PartPointList, function (_p_i, _p_item) {
                                groupPartPointList = model.com.getNewPartPointList(_PartPointList, g_item.PartPointList);
                                return false;
                            });
                        })
                    });
                    $.each(groupPartPointList, function (i, item) {
                        TypeSource_group.PartPointList.push({
                            name: item.PartPointName,
                            value: item.PartPointID
                        })
                    });

                    $("body").append($com.modal.show(DEFAULT_VALUE_group, KEYWORD_group, "新增工序", function (rst) {
                        //调用插入函数 
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        var arr = [];
                        //将选择的项拿出来
                        $.each(rst.PartPointList, function (r_i, r_item) {
                            $.each(groupPartPointList, function (i, item) {
                                if (r_item == item.PartPointID) {
                                    arr.push(item);
                                }
                            })
                        });
                        //插入元数据
                        var _arr = $com.util.Clone(arr);
                        $.each(dataAll.list, function (i, item) {
                            if (item.WorkShopID == workshopID && item.LineID == lineID) {
                                $.each(item.PartList, function (p_i, p_item) {
                                    if (p_item.PartID == partID) {
                                        $.each(p_item.PointGroupList, function (g_i, g_item) {
                                            if (g_item.GroupID == groupID) {
                                                g_item.PartPointList = g_item.PartPointList.concat(_arr);
                                                return false;
                                            }
                                        });
                                        return false;
                                    }
                                });
                            }
                        });

                        model.com.addLine({
                            data: dataAll.list
                        }, function (res) {
                            alert("新增成功");
                            model.com.refreshLine(workshopID, lineID);
                            model.com.refreshGroup(workshopID, lineID, partID, groupID);
                        })
                    }, TypeSource_group))
                });
                //组下删除工序
                $("body").delegate("#cby-delete-group-partPoint", "click", function () {
                    var SelectData = $com.table.getSelectionData($("#cby-group-tbody"), 'OrderID', groupSource);
                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return;
                    }
                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {
                        return;
                    }
                    var workshopID = $check.closest("li.workshop").attr("data-value"),
                        lineID = $check.closest("li.line").attr("data-value"),
                        partID = $check.closest("li.part").attr("data-value"),
                        groupID = $check.closest("li.group").attr("data-value");

                    var partpointArr = [];
                    //找到对应组下工序
                    $.each(dataAll.list, function (i, item) {
                        if (SelectData.length == 0)
                            return false;
                        if (item.WorkShopID == workshopID && item.LineID == lineID) {
                            $.each(item.PartList, function (p_i, p_item) {
                                if (p_item.PartID == partID) {
                                    $.each(p_item.PointGroupList, function (g_i, g_item) {
                                        if (g_item.GroupID == groupID) {
                                            $.each(g_item.PartPointList, function (pp_i, pp_item) {
                                                partpointArr = $com.util.Clone(g_item.PartPointList);
                                                g_item.PartPointList = model.com.getNewArr(partpointArr, SelectData);
                                                return false;
                                            })
                                        } 
                                    })


                                }
                            });
                        }
                    });
                    
                    $.each(dataAll.list, function (i, item) {
                        if (SelectData.length == 0)
                            return false;
                        if (item.WorkShopID == workshopID && item.LineID == lineID) {
                            $.each(item.PartList, function (p_i, p_item) {
                                if (p_item.PartID == partID) {
                                    $.each(p_item.PointGroupList, function (g_i, g_item) {
                                        if (g_item.GroupID == groupID) {
                                            $.each(g_item.PartPointList, function (pp_i, pp_item) {
                                                g_item.PartPointList = partpointArr;
                                                return false;
                                            })
                                        }
                                    });
                                }
                            });
                        }
                    })
                    model.com.addLine({
                        data: dataAll.list
                    }, function (res) {
                        alert("删除成功");
                        model.com.refreshLine(workshopID, lineID);
                        model.com.refreshGroup(workshopID, lineID, partID,groupID);
                    });
                });
                //组下查询工序
                $("body").delegate("#cby-search-text-ledger", "input", function () {
                    var $this = $(this),
                        value = $(this).val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#cby-group-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#cby-group-tbody"), groupSource, value, "OrderID");
                });

            },

            run: function () {
                $(".cby-full-bd-part").hide();
                $(".cby-full-bd-group").hide();
                model.com.getLine({}, function (data_Line) {
                    _data_Line = data_Line;
                });
                model.com.getPartListAll({}, function (data) {
                    data_part = data;
                })
                model.com.refreshTree();
                model.com.refreshLine();
            },
            com: {
                getWorkShop: function (data, fn, context) {
                    var d = {
                        $URI: "/WorkShop/All",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //返回 APSLine[] 
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
                getPartListAll: function (data, fn, context) {
                    var d = {
                        $URI: "/APSPart/All",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                addWorkShop: function (data, fn, context) {
                    var d = {
                        $URI: "/WorkShop/Update",
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

                refreshTree: function () {
                    //获得此LineID的工序段列表
                    function getPartList(_WorkShopID, _LineID, LineList) {
                        var PartList = [];
                        $.each(LineList, function (_i, _item) {
                            if (_item.LineID == _LineID && _item.WorkShopID == _WorkShopID) {
                                PartList = _item.PartList;
                            }
                        })
                        return PartList;
                    };
                    //获得车间产线
                    model.com.getWorkShop({}, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];
                        if (list) {
                            workshop_source = res.list;
                            workshop_source = $com.util.Clone(workshop_source);
                        }
                        model.com.getLine({}, function (Part_data) {
                            Part_Source = Part_data.list;
                            $.each(workshop_source, function (l_i, l_item) {
                                //l_item workshop
                                $.each(l_item.LineList, function (p_i, p_item) {
                                    //p_item Line
                                    //获得当前Line的工序段列表
                                    p_item.PartList = getPartList(l_item.ID, p_item.ID, Part_Source);
                                })
                            })
                            model.com.renderTree(workshop_source);
                        })
                    });
                },
                renderTree: function (list) {
                    model._treeData = list;
                    $.each(list, function (i, item) {
                        $.each(item.LineList, function (_i, _item) {
                            $.each(_item.PartList, function (p_i, p_item) {

                                p_item.Items = $com.util.template(p_item.PointGroupList, HTML.TreeGroupItemNode);
                            })
                            _item.Items = $com.util.template(_item.PartList, HTML.TreePartItemNode);
                        })
                        item.Items = $com.util.template(item.LineList, HTML.TreeLineItemNode);
                    })
                    workshop_source = list;
                    $("#workshopTree").html($com.util.template(list, HTML.TreeWorkshopItemNode));
                    $("#workshopTree").treeview();

                },

                refreshLine: function (f_ID, s_ID) {
                    model.com.getWorkShop({}, function (data) {
                        //获取车间
                        $.each(data.list, function (i, item) {
                            TypeSource.WorkShopID.push({
                                name: item.WorkShopName,
                                value: item.ID,
                                far: null
                            })
                            //获取产线
                            $.each(item.LineList, function (l_i, l_item) {
                                TypeSource.LineID.push({
                                    name: l_item.ItemName,
                                    value: l_item.ID,
                                    far: item.ID
                                })
                            });
                        });
                        TypeSource.PartID.splice(1, TypeSource.PartID.length - 1);
                        TypeSource.PartPointID.splice(1, TypeSource.PartPointID.length - 1);


                        model.com.getLine({}, function (data_Line) {
                            dataAll = data_Line;
                            var _data = [];
                            //data_Line.list: APSLine[]
                            $.each(data_Line.list, function (p_i, p_item) {
                                //p_item ： APSLine
                                TypeSource.PartID = TypeSource.PartID.concat($com.table.getTypeSource(p_item.PartList, "PartID", "PartName"));

                                //  p_item.PartPointList:APSPartPoint[]
                                if (p_item.PartPointList && p_item.PartPointList.length > 0) {

                                    TypeSource.PartPointID = TypeSource.PartPointID.concat($com.table.getTypeSource(p_item.PartPointList, "PartPointID", "PartPointName", undefined, "PartID"));

                                    _data = _data.concat(p_item.PartPointList);
                                }
                                //  p_item.PartList:APSPart[]
                                $.each(p_item.PartList, function (pp_i, pp_item) {
                                    //pp_item : APSPart
                                    TypeSource.PartPointID = TypeSource.PartPointID.concat($com.table.getTypeSource(pp_item.PartPointList, "PartPointID", "PartPointName", undefined, "PartID"));
                                    _data = _data.concat(pp_item.PartPointList);

                                    var order = [];
                                    order.push(pp_item.PartOrderID);

                                    model.com.addOrder(pp_item.PartPointList, pp_item.OrderID);
                                    //// pp_item.PartPointList:APSPartPoint[]
                                    //$.each(pp_item.PartPointList, function (_i, _item) {
                                    //    //_item :APSPartPoint
                                    //    _item.OrderID_P = pp_item.OrderID; 
                                    //})
                                });
                                ProcessSource = _data;
                                model.com.addID(ProcessSource);
                            });
                            model.com.renderLine(_data, f_ID, s_ID);
                        });
                    });
                },
                renderLine: function (list, ff_ID, ss_ID) {
                    var _list = $com.util.Clone(list),
                        _data = [];
                    $.each(_list, function (i, item) {
                        if ((item.WorkShopID == ff_ID) && (item.LineID == ss_ID))
                            _data.push(item);

                        item.PartPointOrderID = item.OrderID;
                        return true;
                        for (var p in item) {
                            if (!FORMATTRT[p])
                                continue;
                            item[p] = FORMATTRT[p](item[p]);
                        }
                    });
                    $("#cby-PartPoint-tbody").html($com.util.template(_data, HTML.PartPointItemNode));
                    ProcessSource = _data;
                },

                refreshPart: function (f_ID, s_ID, praS_ID) {
                    model.com.getWorkShop({}, function (data) {
                        //获取车间
                        $.each(data.list, function (i, item) {
                            TypeSource.WorkShopID.push({
                                name: item.WorkShopName,
                                value: item.ID,
                                far: null
                            })
                            //获取产线
                            $.each(item.LineList, function (l_i, l_item) {
                                TypeSource.LineID.push({
                                    name: l_item.ItemName,
                                    value: l_item.ID,
                                    far: item.ID
                                })
                            });
                        });
                        TypeSource.PartID.splice(1, TypeSource.PartID.length - 1);
                        TypeSource.PartPointID.splice(1, TypeSource.PartPointID.length - 1);


                        model.com.getLine({}, function (data_Line) {
                            dataAll = data_Line;
                            var _data = [];
                            $.each(data_Line.list, function (i, item) {
                                if (item.WorkShopID == f_ID && item.LineID == s_ID) {
                                    $.each(item.PartList, function (p_i, p_item) {
                                        if (p_item.PartID == praS_ID) {
                                            $.each(p_item.PartPointList, function (pp_i, pp_item) {
                                                pp_item.OrderID = pp_i + 1;
                                            })
                                        }
                                    })
                                }
                            });

                            //data_Line.list: APSLine[]
                            $.each(data_Line.list, function (p_i, p_item) {
                                //p_item ： APSLine
                                TypeSource.PartID = TypeSource.PartID.concat($com.table.getTypeSource(p_item.PartList, "PartID", "PartName"));

                                //  p_item.PartPointList:APSPartPoint[]
                                if (p_item.PartPointList && p_item.PartPointList.length > 0) {

                                    TypeSource.PartPointID = TypeSource.PartPointID.concat($com.table.getTypeSource(p_item.PartPointList, "PartPointID", "PartPointName", undefined, "PartID"));

                                    _data = _data.concat(p_item.PartPointList);
                                }
                                //  p_item.PartList:APSPart[]
                                $.each(p_item.PartList, function (pp_i, pp_item) {
                                    //pp_item : APSPart
                                    TypeSource.PartPointID = TypeSource.PartPointID.concat($com.table.getTypeSource(pp_item.PartPointList, "PartPointID", "PartPointName", undefined, "PartID"));
                                    _data = _data.concat(pp_item.PartPointList);
                                });
                            });
                            model.com.renderPart(_data, f_ID, s_ID, praS_ID);
                        });
                    });
                },
                renderPart: function (list, ff_ID, ss_ID, p_ID) {
                    var _list = $com.util.Clone(list),
                        _data = [];
                    $.each(_list, function (i, item) {
                        if ((item.WorkShopID == ff_ID) && (item.LineID == ss_ID) && (item.PartID == p_ID))
                            _data.push(item);
                       
                        item.PartPointOrderID = item.OrderID;
                        return true;
                        for (var p in item) {
                            if (!FORMATTRT[p])
                                continue;
                            item[p] = FORMATTRT[p](item[p]);
                        }
                    });
                    $("#cby-part-tbody").html($com.util.template(_data, HTML.PartItemNode));
                    partSource = _data;
                },

                refreshGroup: function (shopID, lineID, partID, groupID) {
                    var _data = [];
                    $.each(dataAll.list, function (i, item) {
                        if (item.WorkShopID == shopID && item.LineID == lineID)
                            $.each(item.PartList, function (p_i, p_item) {
                                if (p_item.PartID == partID) {
                                    $.each(p_item.PointGroupList, function (g_i, g_item) {
                                        if (g_item.GroupID == groupID) {
                                            $.each(g_item.PartPointList, function (_g_i, _g_item) {
                                                _data.push(_g_item);
                                            })
                                        }
                                    })
                                }
                            })
                    })
                    model.com.renderGroup(_data);
                },
                renderGroup: function (list) {
                    var _list = $com.util.Clone(list);
                    $.each(_list, function (i, item) {
                        for (var p in item) {
                            if (!FORMATTRT[p])
                                continue;
                            item[p] = FORMATTRT[p](item[p]);
                        }
                    });
                    $("#cby-group-tbody").html($com.util.template(_list, HTML.GroupItemNode));
                    groupSource = _list;
                },

                //list  需要添加orderID的数据列表 注意 单层 orderID：工序段顺序ID list：此工序段下工序列表 
                addOrder: function (list, orderID) {
                    $.each(list, function (i, item) {
                        item.OrderID_P = orderID;
                    });
                },
                addID: function (list) {
                    $.each(list, function (i, item) {
                        item.OnlyID = i + 1;
                    })
                },
                GetMaxID: function (_source, prop) {
                    var id = 0;
                    if (!_source)
                        _source = [];

                    if (!prop)
                        prop = "ID";
                    $.each(_source, function (i, item) {
                        if (item[prop] > id)
                            id = item[prop];
                    });
                    return id + 1;
                },
                GetMaxOrderID: function (_source, prop) {
                    var id = 0;
                    if (!_source)
                        _source = [];

                    if (!prop)
                        prop = "OrderID";
                    $.each(_source, function (i, item) {
                        if (item[prop] > id)
                            id = item[prop];
                    });
                    return id + 1;
                },
                getPart: function () {
                    model.com.getPartListAll({}, function (data) {
                        data_part = data;
                    });
                    return data_part;
                },
                getGroupID: function (_source, _WorkShopID, _LineID, _PartID) {
                    var s, group;
                    $.each(_source.list, function (i, item) {
                        if ((item.WorkShopID == _WorkShopID) && (item.LineID == _LineID)) {
                            $.each(item.PartList, function (p_i, p_item) {
                                if (p_item.PartID == _PartID) {
                                    group = p_item.PointGroupList;
                                   
                                }
                            })
                        }
                    })
                    if (group.length == 0) {
                        s = 0;
                        return ++s;
                    }
                    if (group.length >=1)
                        var arr = [];
                        $.each(group, function (g_i, g_item) {
                            arr.push(g_item.GroupID);
                        })
                        s = Math.max.apply(null,arr);

                        //for (var j = 0; j < group.length; j++) {
                        //    if (s < group[j + 1].GroupID) {
                        //        s = group[j + 1].GroupID;
                        //    }
                        //    else {
                        //        return ++s;
                        //    }
                        //}
                    return ++s;
                },
                getPartPointList: function (_source, _WorkShopID, _LineID, _PartID) {
                    var PartPointList = [];
                    $.each(_source.list, function (i, item) {
                        if (item.PartID == _PartID) {
                            $.each(item.PartPointList, function (pp_i, pp_item) {
                                PartPointList.push({
                                    name: pp_item.PartPointName,
                                    value: pp_i
                                })
                            })
                        }                        
                    })
                    return PartPointList;
                },

                chooseEvent: function (flag, $this) {
                    switch (flag) {
                        case 0: //line

                            var $far = $this.closest("ul").closest("li"),
                                TreeID = $far.attr("data-value"),
                                SonID = $this.attr("data-value");

                            $("#workshopTree li ul li").css("color", "black");
                            $this.css("color", "blue");
                            $(".cby-full-bd-part").hide();
                            $(".cby-full-bd").show();
                            model.com.refreshLine(TreeID, SonID);

                            break;
                        case 1://part
                            var graSonID = $this.attr("data-value"),
                                SonID = $this.closest("li.line").attr("data-value"),
                                TreeID = $this.closest("li.workshop").attr("data-value");

                            $("#workshopTree li ul li").css("color", "black");
                            $this.css("color", "blue");
                            $(".cby-full-bd").hide();
                            $(".cby-full-bd-group").hide();
                            $(".cby-full-bd-part").show();
                            model.com.refreshPart(TreeID, SonID, graSonID);

                            break;

                        case 2: //group
                            var groupID = $this.attr("data-value"),
                                partID = $this.closest("li.part").attr("data-value"),
                                lineID = $this.closest("li.line").attr("data-value"),
                                shopID = $this.closest("li.workshop").attr("data-value");

                            $("#workshopTree li ul li").css("color", "black");
                            $this.css("color", "blue");
                            $(".cby-full-bd").hide();
                            $(".cby-full-bd-part").hide();
                            $(".cby-full-bd-group").show();
                            model.com.refreshGroup(shopID, lineID, partID, groupID);
                            break;
                        default:
                            break;
                    }
                },
                chooseAdd: function (flag, $this) {
                    switch (flag) {
                        case 0: //line
                            var shopID = $this.attr("data-value");
                            model.com.addUtils.line(shopID);

                            break;
                        case 1://part                          
                            var lineID = $this.attr("data-value"),
                                shopID = $this.closest("li.workshop").attr("data-value");

                            model.com.addUtils.part(lineID, shopID);

                            break;

                        case 2: //group
                            var groupID = $this.attr("data-value"),
                                partID = $this.parent("ul").parent("li").attr("data-value"),
                                lineID = $this.parent("ul").parent("li").parent("ul").parent("li").attr("data-value"),
                                shopID = $this.parent("ul").parent("li").parent("ul").parent("li").parent("ul").parent("li").attr("data-value");
                            model.com.addUtils.group();
                            break;
                        default: //车间
                            model.com.addUtils.workShop();
                            break;
                    }
                },
                addUtils: {
                    workShop: function () {
                        $("body").append($com.modal.show(DEFAULT_VALUE_WORKSHOP, KEYWORD_WORKSHOP, "新增车间", function (rst) {
                            if (!rst || $.isEmptyObject(rst))
                                return false;

                            var w_Data = {
                                ID: model.com.GetMaxID(workshop_source),
                                WorkShopID: rst.WorkShopID,
                                WorkShopName: rst.WorkShopID,
                                CreateTime: new Date(),
                                Creator: window.parent.User_Info.Name
                            };
                            var far = [];
                            $.each($("#workshopTree").children('li').children('span').children('input'), function (i, item) {

                                if ($(item).is(":checked")) {
                                    far.push($(item).closest('li').attr("data-value") - 1);
                                }
                            });
                            workshop_source.push(w_Data);
                            var temp = true;
                            $.each(far, function (i, item_i) {
                                $.each(workshop_source[item_i].LineList, function (j, item_j) {
                                    if (item_j.WorkShopID == rst.WorkShopID) {
                                        temp = false;
                                        alert("不能添加重复的")
                                        return;
                                    }
                                });
                                if (temp) {
                                    workshop_source[item_i].LineList.push(w_Data);
                                }
                            });

                            if (temp) {
                                model.com.addWorkShop({
                                    data: workshop_source,
                                }, function (res) {
                                    alert("新增成功！！");
                                    model.com.refreshTree();
                                });
                            }
                            return false;
                        }, TypeSource_WORKSHOP));
                    },
                    line: function (shopID) {

                        //勾选添加勾选项的产线
                        $("body").append($com.modal.show({ LineName: "" }, { LineName: { index: 0, name: "产线名称" } }, "新增产线", function (rst) {
                            if (!rst || $.isEmptyObject(rst))
                                return false;
                            //拿到新增产线的名称

                            var _workshopObject = undefined;
                            $.each(workshop_source, function (i, item) {
                                if (item.ID == shopID)
                                    _workshopObject = item;
                            })

                            if (!_workshopObject) {
                                alert("选中的车间不存在！！！");
                                return false;
                            }
                            //获取新增产线在此车间的自增ID : LineID
                            var _lineID = model.com.GetMaxID(_workshopObject.LineList);
                            var inputLine = {
                                CreateTime: $com.util.format('yyyy-MM-dd HH:mm:ss', new Date()),
                                Creator: window.parent.User_Info.Name,
                                ID: _lineID,
                                ItemName: rst.LineName,
                            };

                            var data = {
                                CreateTime: $com.util.format('yyyy-MM-dd', new Date()),
                                Creator: window.parent.User_Info.Name,
                                WorkShopID: _workshopObject.ID,
                                WorkShopName: _workshopObject.WorkShopName,
                                LineID: _lineID,
                                LineName: rst.LineName,
                                PartList: []
                            }
                            //判断添加进去的值是否与其他产线重复
                            var temp = false;
                            $.each(_workshopObject.LineList, function (j, item_j) {
                                if (item_j.ItemName == inputLine.ItemName) {
                                    temp = true;
                                }
                            });
                            $.each(dataAll.list, function (i, item) {
                                if (item.WorkShopID == shopID) {
                                    if (item.LineID == _lineID || item.LineName == data.LineName) {
                                        temp = true;
                                        return false;
                                    }
                                }
                            })

                            if (temp) {
                                alert("产线名或产线ID重复！！！");
                                return false;
                            }

                            _workshopObject.LineList.push(inputLine);

                            dataAll.list.push(data);

                            model.com.addWorkShop({
                                data: workshop_source,
                            }, function (res) {
                                model.com.addLine({
                                    data: dataAll.list,
                                }, function (res) {
                                    model.com.refreshTree();
                                });
                            });
                        }));
                    },
                    part: function (lineID, shopID) {
                        var $input = $(".line input[type=checkbox]:checked");
                        if ($input) {
                            //勾选项存在且唯一
                            if (($input.length == 1)) {

                                //拿到对应车间产线的名字,拿到此产线下的工序段
                                var workshopName, lineName, partList;
                                //拿到车间名
                                $.each(workshop_source, function (i, item) {
                                    if (item.ID == shopID) {
                                        workshopName = item.WorkShopName;
                                    }
                                })
                                $.each(dataAll.list, function (i, item) {
                                    if (item.WorkShopID == shopID && item.LineID == lineID) {
                                        lineName = item.LineName;
                                        partList = item.PartList;
                                    }
                                })

                                //设定弹框的值
                                DEFAULT_VALUE_part.WorkShopID = shopID;
                                DEFAULT_VALUE_part.WorkShopName = workshopName;
                                DEFAULT_VALUE_part.LineID = lineID;
                                DEFAULT_VALUE_part.LineName = lineName;

                                //拿到所有工序段
                                var PartList = model.com.getPart().list;

                                //将此产线下已存在的工序段删除
                                if (partList.length != 0) {
                                    $.each(partList, function (i, item) {
                                        var _index = -1;
                                        $.each(PartList, function (a_i, a_item) {
                                            if (item.PartName == a_item.PartName) {
                                                _index = a_i;
                                            }
                                        })
                                        if (_index >= 0)
                                            PartList.splice(_index, 1);
                                    })
                                };
                                if (PartList.length == 0) {
                                    alert("此产线下没有可选工序段!");
                                    return false;
                                }
                                //将符合条件的工序段赋值给TypeSource_part
                                var arr = [];
                                $.each(PartList, function (i, item) {
                                    arr.push({
                                        name: item.PartName,
                                        value: item.PartID
                                    })
                                });
                                TypeSource_part.PartList = arr;
                                //添加工序段
                                $("body").append($com.modal.show(DEFAULT_VALUE_part, KEYWORD_part, "新增工序段", function (rst) {
                                    if (!rst || $.isEmptyObject(rst))
                                        return false;

                                    //将模态框中的值存在PartSource中

                                    //模态框中已选中的Part的列表
                                    var r_PartList = rst.PartList;

                                    //添加选中的工序段

                                    var PartTemplate = {
                                        WorkShopID: rst.WorkShopID,
                                        WorkShopName: rst.WorkShopName,
                                        LineID: rst.LineID,
                                        LineName: rst.LineName,
                                        PartID: 0,
                                        PartName: "",
                                        OrderID: 0,
                                        PartPointList: [],
                                    };

                                    //拿到此产线下的工序段
                                    var _partList = [];

                                    $.each(PartList, function (p_i, p_item) {
                                        $.each(r_PartList, function (r_i, r_item) {
                                            if (r_item == p_item.PartID) {
                                                var _PartItem = $com.util.Clone(PartTemplate);
                                                $.each(p_item.PartPointList, function (pp_i, pp_item) {
                                                    pp_item.WorkShopName = rst.WorkShopName,
                                                    pp_item.LineName = rst.LineName;
                                                    pp_item.OrderID = pp_i + 1;
                                                    _PartItem.PartPointList.push(pp_item);
                                                });
                                                _PartItem.PartID = p_item.PartID;
                                                _PartItem.PartName = p_item.PartName;
                                                p_item.OrderID = p_i + 1;
                                                _PartItem.OrderID = p_item.OrderID;
                                                _partList.push(_PartItem);
                                            }
                                        })
                                    });

                                    $.each(dataAll.list, function (i, item) {
                                        if ((item.WorkShopID == shopID) && (item.LineID == lineID)) {
                                            item.PartList = item.PartList.concat(_partList);
                                        }
                                    });
                                    //将所选项的工序段添加到工序段下



                                    model.com.addLine({
                                        data: dataAll.list,
                                    },
                                    function (res) {
                                        if (res != 0) {
                                            alert("新增成功！！");
                                            model.com.refreshTree();
                                            model.com.refreshLine(shopID, lineID);
                                        }
                                        else {
                                            alert("新增失败！！");
                                        }
                                    });
                                }, TypeSource_part))
                            }

                            else {
                                alert("只能对一个产线进行添加工序段操作！")
                            }
                        }
                        else {
                            alert("请勾选产线！")
                        }
                    },
                    group: function () {
                        var $input = $(".part input[type=checkbox]:checked");
                        //判断是否勾选工序段

                        //若未勾选则提示勾选
                        if ($input) {
                            //若勾选则判断是否唯一

                            //存在且唯一：就在此工序段下的PointGroupList[]中添加组的编号和名称
                            if ($input.length == 1) {
                                var _PartID = Number($input.closest("li").attr("data-value"));
                                var _LineID = Number($input.closest("ul").closest("li").attr("data-value"));
                                var _WorkShopID = Number($input.closest("ul").closest("li").parent("ul").parent("li").attr("data-value"));
                                var _WorkShopName, _LineName;

                                //设置模态框中的内容
                                DEFAULT_VALUE_Group.GroupID = model.com.getGroupID(dataAll, _WorkShopID, _LineID, _PartID);
                                TypeSource_Group.PartPointList = [];
                                //拿到此工序段下的工序组
                                var group, arr = [], PartPointList;
                                $.each(dataAll.list, function (i, item) {
                                    if ((item.WorkShopID == _WorkShopID) && (item.LineID == _LineID)) {
                                        _WorkShopName = item.WorkShopName,
                                        _LineName = item.LineName;
                                        $.each(item.PartList, function (p_i, p_item) {
                                            if (p_item.PartID == _PartID) {
                                                PartPointList = p_item.PartPointList;
                                                group = p_item.PointGroupList;
                                                if (group.length == 0)
                                                    return false;
                                                $.each(group, function (g_i, g_item) {
                                                    $.each(g_item.PartPointList,function(_p_i,_p_item){
                                                        arr.push(_p_item);
                                                    })
                                                })
                                                return false;
                                            }
                                        })
                                    }
                                });
                                
                                var _PartPointList = $com.util.Clone(PartPointList);
                                var _arr = model.com.getNewPartPointList(_PartPointList, arr);
                                //若此工序段下存在组,则将重复的工序删除
                                if (group.length != 0) {
                                    $.each(_arr, function (i, item) {
                                        TypeSource_Group.PartPointList.push({
                                            name: item.PartPointName,
                                            value: item.PartPointID
                                        })
                                    });
                                }
                                else {
                                    $.each(PartPointList, function (i, item) {
                                        TypeSource_Group.PartPointList.push({
                                            name: item.PartPointName,
                                            value: item.PartPointID
                                        })
                                    });
                                };
                                $("body").append($com.modal.show(DEFAULT_VALUE_Group, KEYWORD_Group, "新增工序组", function (rst) {
                                    if (!rst || $.isEmptyObject(rst))
                                        return false;

                                    var r_partPointList = rst.PartPointList;
                                    var r_PartPointList = [];
                                    //将选取的工序名赋值给r_partPointList
                                    $.each(r_partPointList, function (r_i, r_item) {
                                        $.each(TypeSource_Group.PartPointList, function (t_i, t_item) {
                                            if (t_item.value == r_item) {
                                                r_PartPointList.push(t_item);
                                            }
                                        })
                                    })

                                    //判断添加的工序段是否已经存在与工序组中
                                    var GroupSource = {
                                        creator: window.parent.User_Info.Name,
                                        GroupID: Number(rst.GroupID),
                                        GroupName: rst.GroupName,
                                        PartPointList: []
                                    };
                                    //将选择的工序内容添加到GroupSource中
                                    var GroupItem = $com.util.Clone(GroupSource);
                                    var partPointList = [];
                                    $.each(r_PartPointList, function (r_i, r_item) {
                                        $.each(_PartPointList, function (p_i, p_item) {
                                            if (r_item.name == p_item.PartPointName) {
                                                p_item.WorkShopName = _WorkShopName,
                                                p_item.LineName = _LineName;
                                                p_item.OrderID = p_i + 1;
                                                partPointList.push(p_item);
                                            }
                                        })
                                    })
                                    GroupItem.PartPointList = partPointList;

                                   //将选择的组添加到元数据中
                                    $.each(dataAll.list, function (i, item) {
                                        if ((item.WorkShopID == _WorkShopID) && (item.LineID == _LineID)) {
                                            $.each(item.PartList, function (p_i, p_item) {
                                                if (p_item.PartID == _PartID) {
                                                    p_item.PointGroupList.push(GroupItem);
                                                    return false;
                                                }
                                            })
                                        }
                                    });

                                    model.com.addLine({
                                        data: dataAll.list,
                                    },
                                    function (res) {
                                        if (res != 0) {
                                            alert("新增成功！！");
                                            model.com.refreshTree();
                                            model.com.refreshLine(_WorkShopID, _LineID);
                                        }
                                        else {
                                            alert("新增失败！！");
                                        }
                                    });

                                }, TypeSource_Group))

                            }
                            else {
                                alert("只能对一个工序段添加组！")
                            }
                        }
                        else {
                            alert("请勾选工序段！")
                        }
                    },
                },
                chooseDel: function (flag, $input) {
                    switch (flag) {
                        case 0: //group
                            model.com.delUtils.group();
                            break;
                        case 1://part                          
                            model.com.delUtils.part($input);

                            break;

                        case 2: //line
                            model.com.delUtils.line($input);
                            break;

                        case 3: //workshop
                            model.com.delUtils.workshop($input);
                            break;
                        default: //车间
                            break;
                    }
                },
                delUtils: {
                    group: function () {
                        var selectData = [];
                        //找到被选中的元素的GruopID
                        $.each($("#workshopTree").find('li').find('input'), function (i, item) {
                            if ($(item).is(":checked")) {
                                var k = {
                                    GroupID: $(item).closest('li').attr("data-value"),
                                    PartID: $(item).closest('li').parent("ul").parent("li").attr("data-value"),
                                    LineID: $(item).closest('li').parent("ul").parent("li").parent("ul").parent("li").attr("data-value"),
                                    WorkShopID: $(item).closest('li').parent("ul").parent("li").parent("ul").parent("li").parent("ul").parent("li").attr("data-value")
                                }
                                selectData.push(k);
                            }
                        });
                        var _workshopID, _lineID;
                        if (selectData.length == 0)
                            return false;
                        $.each(selectData, function (s_i, s_item) {
                            $.each(dataAll.list, function (i, item) {
                                if (item.WorkShopID == s_item.WorkShopID && item.LineID == s_item.LineID) {
                                    _workshopID = item.WorkShopID;
                                    _lineID = item.LineID;
                                    $.each(item.PartList, function (p_i, p_item) {
                                        if (p_item.PartID == s_item.PartID) {
                                            var arr = [];
                                            $.each(p_item.PointGroupList, function (g_i, g_item) {
                                                //将被选择的元素删除
                                                p_item.PointGroupList = model.com.getNewGroupList(p_item.PointGroupList, selectData);
                                                return false;
                                            });    
                                        }
                                    });
                                }
                            });
                        });
                        model.com.addLine({
                            data: dataAll.list,
                        }, function (res) {
                            alert("删除成功！！");
                            model.com.refreshTree();
                            model.com.refreshLine(_workshopID, _lineID);
                        });
                    },
                    part: function () {
                        var selectData = [];
                        //找到被选中的元素的GruopID
                        $.each($("#workshopTree").find('li').find('input'), function (i, item) {
                            if ($(item).is(":checked")) {
                                var k = {
                                    PartID: $(item).closest('li').attr("data-value"),
                                    LineID: $(item).closest('li.line').attr("data-value"),
                                    WorkShopID: $(item).closest('li.workshop').attr("data-value")
                                }
                                selectData.push(k);
                            }
                        });
                        var _workshopID, _lineID;
                        $.each(selectData, function (s_i, s_item) {
                            $.each(dataAll.list, function (i, item) {
                                if (item.WorkShopID == s_item.WorkShopID && item.LineID == s_item.LineID) {
                                    _workshopID = item.WorkShopID;
                                    _lineID = item.LineID;
                                    $.each(item.PartList, function (p_i, p_item) {
                                        if (p_item.PartID == s_item.PartID) {
                                            item.PartList.splice(p_i, 1);
                                            return false;
                                        }
                                    });
                                }
                            });
                        });
                        model.com.addLine({
                            data: dataAll.list,
                        }, function (res) {
                            alert("删除成功！！");
                            model.com.refreshTree();
                            model.com.refreshLine(_workshopID, _lineID);
                        });
                    },
                    line: function ($line) {
                        var selectData = [];
                        $.each($("#workshopTree").find('li').find('input'), function (i, item) {
                            if ($(item).is(":checked")) {
                                var k = {
                                    LineID: $line.attr("data-value"),
                                    WorkShopID: $line.closest("li.workshop").attr("data-value"),
                                }
                                selectData.push(k);
                            }
                        });
                        $.each(selectData, function (s_i, s_item) {
                            if (selectData.length == 0)
                                return false;
                            $.each(workshop_source, function (i, item) {
                                if (item.ID == s_item.WorkShopID) {
                                    $.each(item.LineList, function (l_i, l_item) {
                                        if (l_item.ID == s_item.LineID) {
                                            model.com.getNewLineList(item.LineList, selectData);
                                            return false;
                                        }
                                    })
                                }
                            });
                        });
                        $.each(selectData, function (s_i, s_item) {
                            if (selectData.length == 0)
                                return false;
                            $.each(dataAll.list, function (i, item) {
                                if (s_item.WorkShopID == item.WorkShopID && s_item.LineID == item.LineID) {
                                    model.com.getNewlineList(dataAll.list, selectData);
                                    return false;
                                }
                            })
                        })
                        model.com.addWorkShop({
                            data: workshop_source,
                        }, function (res) {
                            model.com.addLine({
                                data: dataAll.list,
                            }, function (res) {
                                model.com.refreshTree();
                            });
                        });

                    },
                    workshop: function ($workshop) {
                        var selectData = [];

                        $.each($("#workshopTree").find('li').find('input'), function (i, item) {
                            if ($(item).is(":checked")) {
                                var k = {
                                    WorkShopID: $workshop
                                }
                                selectData.push(k);
                            }
                        });
                        $.each(selectData, function (s_i, s_item) {
                            if (selectData.length == 0)
                                return false;
                            $.each(workshop_source, function (i, item) {
                                if (item.ID == s_item.WorkShopID) {
                                    model.com.getNewWorkShopList(workshop_source, selectData);
                                    return false;
                                }
                            });
                        });
                        model.com.addWorkShop({
                            data: workshop_source,
                        }, function (res) {
                            alert("删除成功！！");
                            model.com.refreshTree();
                        });

                    },
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
                getNewLineList: function (_source, set_data) {
                    if (!_source)
                        _source = [];
                    if (!set_data)
                        set_data = [];
                    var rst = [];
                    for (var i = 0; i < _source.length; i++) {
                        var NotOWn = false;
                        for (var j = 0; j < set_data.length; j++) {
                            if (_source[i].ID == set_data[j].LineID) {
                                _source.splice(i, 1);
                                set_data.splice(j, 1);
                                NotOWn = true;
                            }
                            if (set_data.length < 1) {
                                break;
                            }
                            if (NotOWn) {
                                model.com.getNewLineList(_source, set_data);
                            }
                        }

                    }
                    rst = _source;
                    return rst;
                },
                getNewWorkShopList: function (_source, set_data) {
                    if (!_source)
                        _source = [];
                    if (!set_data)
                        set_data = [];
                    var rst = [];
                    for (var i = 0; i < _source.length; i++) {
                        var NotOWn = false;
                        for (var j = 0; j < set_data.length; j++) {
                            if (_source[i].ID == set_data[j].WorkShopID) {
                                _source.splice(i, 1);
                                set_data.splice(j, 1);
                                NotOWn = true;
                            }
                            if (set_data.length < 1) {
                                break;
                            }
                            if (NotOWn) {
                                model.com.getNewWorkShopList(_source, set_data);
                            }
                        }

                    }
                    rst = _source;
                    return rst;
                },
                getNewlineList: function (_source, set_data) {
                    if (!_source)
                        _source = [];
                    if (!set_data)
                        set_data = [];
                    var rst = [];
                    for (var i = 0; i < _source.length; i++) {
                        var NotOWn = false;
                        for (var j = 0; j < set_data.length; j++) {
                            if (_source[i].LineID == set_data[j].LineID) {
                                _source.splice(i, 1);
                                set_data.splice(j, 1);
                                NotOWn = true;
                            }
                            if (set_data.length < 1) {
                                break;
                            }
                            if (NotOWn) {
                                model.com.getNewlineList(_source, set_data);
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
                                model.com.getNewPartPointList(_source, set_data);
                            }
                        }

                    }
                    rst = _source;
                    return rst;
                },
                getNewGroupList: function (_source, set_data) {
                    if (!_source)
                        _source = [];
                    if (!set_data)
                        set_data = [];
                    var rst = [];
                    for (var i = 0; i < _source.length; i++) {
                        var NotOWn = false;
                        for (var j = 0; j < set_data.length; j++) {
                            if (_source[i].GroupID == set_data[j].GroupID) {
                                _source.splice(i, 1);
                                set_data.splice(j, 1);
                                NotOWn = true;
                            }
                            if (set_data.length < 1) {
                                break;
                            }
                            if (NotOWn) {
                                model.com.getNewGroupList(_source, set_data);
                            }
                        }

                    }
                    rst = _source;
                    return rst;
                },
                getNewArr: function (_source, set_data) {
                    if (!_source)
                        _source = [];
                    if (!set_data)
                        set_data = [];
                    var rst = [];
                    for (var i = 0; i < _source.length; i++) {
                        var NotOWn = false;
                        for (var j = 0; j < set_data.length; j++) {
                            if (_source[i].OrderID == set_data[j].OrderID) {
                                _source.splice(i, 1);
                                set_data.splice(j, 1);
                                NotOWn = true;
                            }
                            if (set_data.length < 1) {
                                break;
                            }
                            if (NotOWn) {
                                model.com.getNewArr(_source, set_data);
                            }
                        }

                    }
                    rst = _source;
                    return rst;
                },
                //去重
                deleteDuplicate: function (oldArr) {
                    for (var i = 0; i < oldArr.length; i++) {
                        for (var j = 0; j < oldArr.length; j++) {
                            if (i == j)
                                continue;
                            if (oldArr[i].PartPointName == oldArr[j].PartPointName) {
                                oldArr.splice(i, 1);
                                i++;
                                break;
                            }
                        }
                    }
                    return oldArr;
                }
            }
        })
        model.init();
    });