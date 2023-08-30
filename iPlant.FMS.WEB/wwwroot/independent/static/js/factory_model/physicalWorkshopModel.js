require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/jquery.treeview'],
    function ($yang, $com, $treeview) {
        var HTML,
            model,

            KEYWORD_LIST,
            FORMATTRT,
            KEYWORD,
            DEFAULT_VALUE,
            TypeSource,

            KEYWORD_LIST_part,
            FORMATTRT_part,
            KEYWORD_part,
            DEFAULT_VALUE_part,
            TypeSource_part,

            KEYWORD_LIST_partpoint,
            FORMATTRT_partpoint,
            KEYWORD_partpoint,
            DEFAULT_VALUE_partpoint,
            TypeSource_partpoint,

            KEYWORD_LIST_device,
            FORMATTRT_device,
            KEYWORD_device,
            DEFAULT_VALUE_device,
            TypeSource_device,

            KEYWORD_LIST_deviceGroup,
            FORMATTRT_deviceGroup,
            KEYWORD_deviceGroup,
            DEFAULT_VALUE_deviceGroup,
            TypeSource_deviceGroup,

            KEYWORD_LIST_Device,
            FORMATTRT_Device,
            KEYWORD_Device,
            DEFAULT_VALUE_Device,
            TypeSource_Device,

            KEYWORD_LIST_Part,
            FORMATTRT_Part,
            KEYWORD_Part,
            DEFAULT_VALUE_Part,
            TypeSource_Part,

            EYWORD_LIST_Partpoint,
            FORMATTRT_Partpoint,
            KEYWORD_Partpoint,
            DEFAULT_VALUE_Partpoint,
            TypeSource_Partpoint,

            dataAll,
            workshop_source,
            data_part,
            data_partpoint,
            data_deviceGroup,
            data_risk,
            data_device,
            data_workshop,

            DeviceGroupSource,
            PartPointSource,
            DeviceSource,

            flag,
            $check,
            _groupID;
        HTML = {
            TreeWorkshopItemNode: [
				'<li data-value="{{WorkShopID}}" class="workshop">',
				'<span style="vertical-align:top;"><input type="checkbox" class="femi-tree-checkbox" style="margin: 1px 0px 1px"  value="{{FunctionID}}"  />{{WorkShopName}}</span> ',
				'<ul>{{Items}}</ul>',
				'</li> ',
            ].join(""),
            TreeLineItemNode: [
               '<li data-value="{{LineID}}" class="line">',
               '<span style="vertical-align:top;"><input type="checkbox" class="femi-tree-checkbox" style="margin: 1px 0px 1px"  value="{{FunctionID}}"  />{{LineName}}</span> ',
               '<ul>{{Items}}</ul>',
               '</li> ',
            ].join(""),

            TreePartGroupItemNode: [
               '<li data-value="{{GroupID}}"  class="click-delegate partgroup">',
               '<span style="vertical-align:top;"><input type="checkbox" class="femi-tree-checkbox" style="margin: 1px 0px 1px"  value="{{FunctionID}}"  />{{GroupName}}</span> ',
               '<ul>{{Items}}</ul>',
               '</li> ',
            ].join(""),
            TreePartItemNode: [
                '<li data-value="{{PartID}}"  class="click-delegate part">',
               '<span style="vertical-align:top;"><input type="checkbox" class="femi-tree-checkbox" style="margin: 1px 0px 1px"  value="{{FunctionID}}"  />{{PartName}}</span> ',
               '<ul>{{Items}}</ul>',
               '</li> ',
            ].join(""),
            TreePartPointItemNode: [
                '<li data-value="{{PartPointID}}"  class="partpoint">',
               '<span style="vertical-align:top;"><input type="checkbox" class="femi-tree-checkbox" style="margin: 1px 0px 1px"  value="{{FunctionID}}"  />{{PartPointName}}</span> ',
               '</li> ',
            ].join(""),
            TreeDeviceGroupItemNode: [
                '<li data-value="{{GroupID}}"class="devicegroup">',
               '<span style="vertical-align:top;"><input type="checkbox" class="femi-tree-checkbox" style="margin: 1px 0px 1px"  value="{{FunctionID}}"  />{{GroupName}}</span> ',
               '</li> ',
            ].join(""),
            PartGroupItemNode: [
                '<tr><td style="widtd: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></td>',
                '<td style="min-widtd:50px"   data-title="OnlyID" data-value = "{{OnlyID}}">{{OnlyID}}</td>',
                '<td style="min-widtd:50px"   data-title="DeviceNo" data-value = "{{DeviceNo}}">{{DeviceNo}}</td>',
                '<td style="min-widtd:50px"   data-title="Priority" data-value = "{{Priority}}">{{Priority}}</td>',
                '</tr>',
            ].join(""),
            PartPointItemNode: [
               '<tr><td style="widtd: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></td>',
               '<td style="min-widtd:50px"   data-title="OnlyID" data-value = "{{OnlyID}}">{{OnlyID}}</td>',
               '<td style="min-widtd:50px"   data-title="PartName" data-value = "{{PartName}}">{{PartName}}</td>',
               '<td style="min-widtd:50px"   data-title="PartPointName" data-value = "{{PartPointName}}">{{PartPointName}}</td>',
               '<td style="min-widtd:50px"   data-title="DeviceNo" data-value = "{{DeviceNo}}">{{DeviceNo}}</td>',
               '<td style="min-widtd:50px"   data-title="RiskText" data-value = "{{RiskText}}">{{RiskText}}</td>',
               '<td style="min-widtd:50px"   data-title="MaterialPL" data-value = "{{MaterialPL}}">{{MaterialPL}}</td>',
               '<td style="min-widtd:50px"   data-title="MaterialBG" data-value = "{{MaterialBG}}">{{MaterialBG}}</td>',
               '<td style="min-widtd:50px"   data-title="PointMode" data-value = "{{PointMode}}">{{PointMode}}</td>',
               '<td style="min-widtd:50px"   data-title="Creator" data-value = "{{Creator}}">{{Creator}}</td>',
               '<td style="min-widtd:50px"   data-title="CreateTime" data-value = "{{CreateTime}}">{{CreateTime}}</td>',
               '</tr>',
            ].join(""),
            DeviceItemNode: [
                 '<tr><td style="widtd: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></td>',
                '<td style="min-widtd:50px"   data-title="OnlyID" data-value = "{{OnlyID}}">{{OnlyID}}</td>',
                '<td style="min-widtd:50px"   data-title="DeviceNo" data-value = "{{DeviceNo}}">{{DeviceNo}}</td>',
                '<td style="min-widtd:50px"   data-title="Priority" data-value = "{{Priority}}">{{Priority}}</td>',
                '</tr>',
            ].join("")
        };

        //partGroup(tree)
        (function () {
            KEYWORD_LIST = [
                "GroupID|工序组编号",
                "GroupName|工序组名称",
                "Type|组类型|ArrayOneControl",
                "DeviceGroupList|设备组名|ArrayOneControl|Type"
            ];
            FORMATTRT = {};
            KEYWORD = {};
            DEFAULT_VALUE = {
                GroupID: 0,
                GroupName: "",
                Type: 0,
                DeviceGroupList: 0
            };
            TypeSource = {
                GroupID: [{
                    name: "无",
                    value: 0
                }],
                GroupName: [{
                    name: "无",
                    value: 0,
                }],
                Type: [
                    {
                        name: "共用",
                        value: 1
                    },
                    {
                        name: "专用",
                        value: 2
                    }
                ],
                DeviceGroupList: [{
                    name: "无",
                    value: 0,
                    far: 2
                }]

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
        //part(tree)
        (function () {
            KEYWORD_LIST_part = [
                "PartList|工序段名称|Array"
            ];
            FORMATTRT_part = {};
            KEYWORD_part = {};
            DEFAULT_VALUE_part = {
                PartList: "",
            };
            TypeSource_part = {};
            $.each(KEYWORD_LIST_part, function (i, item) {
                var detail = item.split("|");
                KEYWORD_part[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };
                if (detail.length > 2) {
                    FORMATTRT_part[detail[0]] = $com.util.getFormatter(TypeSource_part, detail[0], detail[2]);
                }

            });
        })();
        //partpoint(tree)
        (function () {
            KEYWORD_LIST_partpoint = [
                "PartPointList|工序名称|Array"
            ];
            FORMATTRT_partpoint = {};
            KEYWORD_partpoint = {};
            DEFAULT_VALUE_partpoint = {
                PartPointList: "",
            };
            TypeSource_partpoint = {

            };
            $.each(KEYWORD_LIST_partpoint, function (i, item) {
                var detail = item.split("|");
                KEYWORD_partpoint[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };
                if (detail.length > 2) {
                    FORMATTRT_partpoint[detail[0]] = $com.util.getFormatter(TypeSource_partpoint, detail[0], detail[2]);
                }

            });
        })();
        //device(table)
        (function () {
            KEYWORD_LIST_device = [
                "DeviceGroupName|设备组名称|ArrayOne"
            ];
            FORMATTRT_device = {};
            KEYWORD_device = {};
            DEFAULT_VALUE_device = {
                DeviceGroupName: ""
            };
            TypeSource_device = {
                DeviceGroupName: [{
                    name: "",
                    value: 0
                }]
            };
            $.each(KEYWORD_LIST_device, function (i, item) {
                var detail = item.split("|");
                KEYWORD_device[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };
                if (detail.length > 2) {
                    FORMATTRT_device[detail[0]] = $com.util.getFormatter(TypeSource_device, detail[0], detail[2]);
                }
            });
        })();

        //deviceGroup(tableTree)
        (function () {
            KEYWORD_LIST_deviceGroup = [
                "GroupID|组编号",
                "GroupName|组名称"
            ];
            FORMATTRT_deviceGroup = {};
            KEYWORD_deviceGroup = {};
            DEFAULT_VALUE_deviceGroup = {
                GroupID: 0,
                GroupName: ""
            };
            TypeSource_deviceGroup = {};
            $.each(KEYWORD_LIST_deviceGroup, function (i, item) {
                var detail = item.split("|");
                KEYWORD_deviceGroup[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };
                if (detail.length > 2) {
                    FORMATTRT_deviceGroup[detail[0]] = $com.util.getFormatter(TypeSource_deviceGroup, detail[0], detail[2]);
                }
            });
        })();
        //Device(tableTree)
        (function () {
            KEYWORD_LIST_Device = [
               "WorkShopList|车间|ArrayOneControl",
               "LineList|产线|ArrayOneControl|WorkShopList",
               "DeviceList|设备|ArrayControl|WorkShopList,LineList"
            ];
            FORMATTRT_Device = {};
            KEYWORD_Device = {};
            DEFAULT_VALUE_Device = {
                WorkShopList: 0,
                LineList: 0,
                DeviceList: 0
            };
            TypeSource_Device = {
                WorkShopList: [{
                    name: "全部",
                    value: 0,
                    far: 0
                }],
                LineList: [{
                    name: "全部",
                    value: 0,
                    far: 0
                }],
                DeviceList: [{
                    name: "全部",
                    value: 0,
                    far: 0
                }]
            };
            $.each(KEYWORD_LIST_Device, function (i, item) {
                var detail = item.split("|");
                KEYWORD_Device[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };
                if (detail.length > 2) {
                    FORMATTRT_Device[detail[0]] = $com.util.getFormatter(TypeSource_Device, detail[0], detail[2]);
                }
            });
        })();
        //PartGroup(table)
        //Part(table)
        (function () {
            //    KEYWORD_LIST_Part = [
            //        "GroupID|顺序",
            //        "PartID|工序段",
            //        "PartPoint|工序",
            //        "DeviceID|设备",
            //        "RiskID|风险",
            //        "MaterialPL|配料模式",
            //        "MaterialBG|报工模式",
            //        "PointMode|加工模式"
            //    ];
            //    FORMATTRT_Part = {};
            //    KEYWORD_Part = {};
            //    DEFAULT_VALUE_Part = {

            //    };
            //    TypeSource_Part = {};
            //    $.each(KEYWORD_LIST_Part, function (i, item) {
            //        var detail = item.split("|");
            //        KEYWORD_Part[detail[0]] = {
            //            index: i,
            //            name: detail[1],
            //            type: detail.length > 2 ? detail[2] : undefined,
            //            control: detail.length > 3 ? detail[3] : undefined
            //        };
            //        if (detail.length > 2) {
            //            FORMATTRT_Part[detail[0]] = $com.util.getFormatter(TypeSource_Part, detail[0], detail[2]);
            //        }

            //    });
        })();
        //Partpoint(table)
        (function () {
            KEYWORD_LIST_Partpoint = [
                "PartPointName|工序|LongText",
                "RiskList|风险|ArrayOne",
                "DeviceList|设备|ArrayOne",
                "MaterialPL|配料模式|ArrayOne",
                "MaterialBG|报工模式|ArrayOne",
                "PointMode|加工模式|ArrayOne",
            ];
            FORMATTRT_Partpoint = {};
            KEYWORD_Partpoint = {};
            DEFAULT_VALUE_Partpoint = {
                RiskList: "",
                DeviceList: "",
                MaterialPL: "",
                MaterialBG: "",
                PointMode: ""
            };
            TypeSource_Partpoint = {
                RiskList: [{
                    name: "未知",
                    value: 0
                }],
                DeviceList: [{
                    name: "无",
                    value: 0
                }],
                MaterialPL: [
                {
                    name: "未知",
                    value: 0
                },
                {
                    name: "仓库配料",
                    value: 1
                },
                {
                    name: "上道自动送料",
                    value: 2
                },
                {
                    name: "上道人工送料",
                    value: 3
                }],
                MaterialBG: [
               {
                   name: "未知",
                   value: 0
               },
               {
                   name: "流转报工",
                   value: 1
               },
               {
                   name: "免检报工",
                   value: 2
               },
               {
                   name: "检验报工",
                   value: 3
               },
               {
                   name: "流转检验",
                   value: 4
               }
                ],
                PointMode: [
              {
                  name: "未知",
                  value: 0
              },
              {
                  name: "一对一",
                  value: 1
              },
              {
                  name: "一对多只选一",
                  value: 2
              },
              {
                  name: "一对多多选",
                  value: 3
              },
              {
                  name: "一对多多选自由选择",
                  value: 4
              }
                ],

            };
            $.each(KEYWORD_LIST_Partpoint, function (i, item) {
                var detail = item.split("|");
                KEYWORD_Partpoint[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };
                if (detail.length > 2) {
                    FORMATTRT_Partpoint[detail[0]] = $com.util.getFormatter(TypeSource_Partpoint, detail[0], detail[2]);
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
                //Tree的添加事件
                $("body").delegate("#cby-tree-add", "click", function () {
                    var flag,
                        $Input = $("#physicalWorkshopTree li input[type=checkbox]:checked"),
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
                        } else if ($this.hasClass("partgroup")) {
                            flag = 2;
                        } else if ($this.hasClass("part")) {
                            flag = 3;
                        } else {
                            alert("不能对组进行添加操作！");
                            return false;
                        }
                    }
                    model.com.chooseAdd(flag, $this);
                });
                //Tree的删除事件
                $("body").delegate("#cby-tree-delete", "click", function () {

                    var $Input = $("#physicalWorkshopTree li input[type=checkbox]:checked"),
                        $this = undefined;
                    if ($Input.length == 0) {
                        alert("请选择需要删除的项！");
                        return false;
                    }

                    var $workshopInput = $("#physicalWorkshopTree li.workshop>span>input[type=checkbox]:checked");
                    var $lineInput = $("#physicalWorkshopTree li.line>span>input[type=checkbox]:checked");
                    var $partgroupInput = $("#physicalWorkshopTree li.partgroup>span>input[type=checkbox]:checked");
                    var $partInput = $("#physicalWorkshopTree li.part>span>input[type=checkbox]:checked");
                    var $partpointInput = $("#physicalWorkshopTree li.partpoint>span>input[type=checkbox]:checked");
                    var flag;
                    if ($partpointInput.length > 0) {
                        var $partpoint = $partpointInput.closest("li");
                        //删工序
                        flag = 0;
                        model.com.chooseDel(flag, $partpoint);
                    }
                    if ($partInput.length > 0) {
                        var $part = $partInput.closest("li");
                        //删工序段
                        flag = 1;
                        model.com.chooseDel(flag, $part);
                    }
                    if ($partgroupInput.length > 0) {
                        var $partgroup = $partgroupInput.closest("li");
                        //删工序段组
                        flag = 2;
                        model.com.chooseDel(flag, $partgroup);
                    }
                    if ($lineInput.length > 0) {
                        var $line = $lineInput.closest("li");
                        //删产线
                        flag = 3;
                        model.com.chooseDel(flag, $line);
                    }
                    if ($workshopInput.length > 0) {
                        var $workshop = $workshopInput.closest("li").attr("data-value");
                        //删车间
                        flag = 4;
                        model.com.chooseDel(flag, $workshop);
                    }
                });
                //Tree的点击事件
                $("body").delegate("li.click-delegate", "click", function () {

                    if (flag > 0) {
                        flag--;
                        return;
                    }
                    var $this = $(this);
                    if ($this.hasClass("partgroup")) {
                        flag = 0;
                        $check = $this;
                    } else if ($this.hasClass("part")) {
                        flag = 1;
                        $check = $this;
                    }

                    model.com.chooseEvent(flag, $check);
                });
                //Tree的修改组类型事件
                $("body").delegate("#cby-tree-edit", "click", function () {
                    var $Input = $("#physicalWorkshopTree li input[type=checkbox]:checked"),
                        groupID = $Input.closest("li.partgroup").attr("data-value"),
                        lineID = $Input.closest("li.line").attr("data-value"),
                        workshopID = $Input.closest("li.workshop").attr("data-value");
                    $.each(dataAll.list, function (i, item) {
                        if (item.WorkShopID == workshopID && item.LineID == lineID) {
                            $.each(item.GroupEntryList, function (g_i, g_item) {
                                if (g_item.GroupID == groupID) {
                                    if (g_item.Type == 1) {
                                        g_item.Type = 2;
                                        model.com.refreshTree(dataAll.list);
                                        model.com.refreshGroup(groupID, lineID, workshopID);
                                        return false;
                                    } else if (g_item.Type == 2) {
                                        g_item.Type = 1;
                                        model.com.refreshTree(dataAll.list);
                                        model.com.refreshGroup(groupID, lineID, workshopID)
                                        return false;
                                    }
                                }
                            });
                        }
                    });
                });

                //设备表的新增设备操作
                $("body").delegate("#add-device", "click", function () {
                    var groupID = $check.attr("data-value"),
                        lineID = $check.closest("li.line").attr("data-value"),
                        workshopID = $check.closest("li.workshop").attr("data-value");

                    TypeSource_device = {
                        DeviceGroupName: [{
                            name: "",
                            value: 0
                        }]
                    };
                    $.each(data_deviceGroup, function (g_i, g_item) {
                        TypeSource_device.DeviceGroupName.push({
                            name: g_item.GroupName,
                            value: g_item.GroupID
                        });
                    });
                    var temp = true;
                    $.each(dataAll.list, function (i, item) {
                        if (item.WorkShopID == workshopID && item.LineID == lineID) {
                            $.each(item.GroupEntryList, function (g_i, g_item) {
                                if (g_item.GroupID == groupID) {
                                    if (g_item.Type == 2) {
                                        temp = false;
                                        return false;
                                    }
                                }
                            });
                        }
                    });
                    if (temp == false) {
                        alert("专用组下不可添加设备！！！");
                        return false;
                    }
                    $("body").append($com.modal.show(DEFAULT_VALUE_device, KEYWORD_device, "新增设备", function (rst) {
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        $.each(dataAll.list, function (i, item) {
                            if (item.WorkShopID == workshopID && item.LineID == lineID) {
                                $.each(item.GroupEntryList, function (g_i, g_item) {
                                    if (g_item.GroupID == groupID) {
                                        g_item.DeviceGroupList = rst.DeviceGroupName;
                                        return false;
                                    }
                                })
                            }
                        });
                        $.each(dataAll.list, function (i, item_i) {
                            model.com.addPartGroup({
                                data: item_i,
                            });
                        });
                        alert("新增成功！！");
                        model.com.refreshGroup(groupID, lineID, workshopID);
                    }, TypeSource_device))
                });
                //设备表的删除操作
                $("body").delegate("#cby-delete-partGroup", "click", function () {
                    var groupID = $check.attr("data-value"),
                        lineID = $check.closest("li.line").attr("data-value"),
                        workshopID = $check.closest("li.workshop").attr("data-value");

                    $.each(dataAll.list, function (i, item) {
                        if (item.WorkShopID == workshopID && item.LineID == lineID) {
                            $.each(item.GroupEntryList, function (g_i, g_item) {
                                if (g_item.GroupID == Number(groupID)) {
                                    g_item.DeviceGroupList = 0;
                                    return false;
                                }
                            })
                        }
                    })

                    $.each(dataAll.list, function (i, item_i) {
                        model.com.addPartGroup({
                            data: item_i,
                        });
                    });
                    alert("删除成功！！");
                    model.com.refreshGroup(groupID, lineID, workshopID);
                });
                //设备表的查询操作
                $("body").delegate("#cby-search-text-ledger", "change", function () {
                    var $this = $(this),
                        value = $(this).val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#cby-PartGroup-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#cby-PartGroup-tbody"), DeviceGroupSource, value, "OnlyID");
                });
                //设备表的新增设备组操作
                $("body").delegate("#add-deviceGroup", "click", function () {
                    var groupID = $check.attr("data-value"),
                        lineID = $check.closest("li.line").attr("data-value"),
                        workshopID = $check.closest("li.workshop").attr("data-value");
                    model.com.refreshDeviceTree();
                    $("#deviceTable").hide();
                    $("#partpointTable").hide();
                    $("#device").show();
                    $("#deviceGroupTable").show();
                });

                //工序表的修改操作
                $("body").delegate("#cby-edit-PartPoint", "click", function () {
                    var SelectData = $com.table.getSelectionData($("#cby-PartPoint-tbody"), 'OnlyID', PartPointSource);
                    if (SelectData.length == 0) {
                        alert("请选择一行数据进行操作！！！");
                        return false;
                    }
                    else if (SelectData.length > 1) {
                        alert("只能对一行数据进行操作！！！");
                        return false;
                    }
                    var partID = SelectData[0].PartID,
                        partGroupID = $check.closest("li.partgroup").attr("data-value"),
                        lineID = $check.closest("li.line").attr("data-value"),
                        workShopID = $check.closest("li.workshop").attr("data-value");
                    //拿到该工序段下所属组的类别
                    var groupType, groupID;
                    $.each(dataAll.list, function (i, item) {
                        if (item.WorkShopID == workShopID && item.LineID == lineID)
                            $.each(item.GroupEntryList, function (g_i, g_item) {
                                if (g_item.GroupID == partGroupID)
                                    $.each(g_item.PartList, function (p_i, p_item) {
                                        if (p_item.PartID == partID) {
                                            groupType = g_item.Type,
                                            groupID = g_item.GroupID;
                                            return false;
                                        }
                                    });
                            });
                    });
                    //根据类型来选择新增的内容
                    if (groupType == 1) {
                        TypeSource_Partpoint.RiskList =
                            [{
                                name: "未知",
                                value: 0
                            }];
                        TypeSource_Partpoint.DeviceList =
                            [{
                                name: "无",
                                value: 0
                            }];
                        //选择该工序段的某个工序下添加内容
                        $.each(data_risk, function (i, item) {
                            TypeSource_Partpoint.RiskList.push({
                                name: item.RiskText,
                                value: item.RiskID
                            })
                        });
                    }
                    else if (groupType == 2) {

                        TypeSource_Partpoint.RiskList =
                            [{
                                name: "未知",
                                value: 0
                            }],
                        TypeSource_Partpoint.DeviceList =
                            [{
                                name: "无",
                                value: 0
                            }];

                        //拿到风险可选项
                        $.each(data_risk, function (i, item) {
                            TypeSource_Partpoint.RiskList.push({
                                name: item.RiskText,
                                value: item.RiskID
                            })
                        });
                        //拿到设备可选项
                        var deviceList = [];
                        $.each(data_device, function (i, item) {
                            if (item.WorkShopID == workShopID && item.LineID == lineID) {
                                deviceList.push(item);
                            }
                        })
                        $.each(deviceList, function (i, item) {
                            TypeSource_Partpoint.DeviceList.push({
                                name: item.DeviceNo,
                                value: item.DeviceID
                            })
                        })
                    }
                    //填充默认显示项
                    $.each(TypeSource_Partpoint.MaterialPL, function (i, item) {
                        if (item.name == SelectData[0].MaterialPL) {
                            DEFAULT_VALUE_Partpoint.MaterialPL = item.value;
                            return false;
                        }
                    });
                    $.each(TypeSource_Partpoint.MaterialBG, function (i, item) {
                        if (item.name == SelectData[0].MaterialBG) {
                            DEFAULT_VALUE_Partpoint.MaterialBG = item.value;
                            return false;
                        }
                    });
                    $.each(TypeSource_Partpoint.PointMode, function (i, item) {
                        if (item.name == SelectData[0].PointMode) {
                            DEFAULT_VALUE_Partpoint.PointMode = item.value;
                            return false;
                        }
                    });
                    DEFAULT_VALUE_Partpoint.PartPointName = SelectData[0].PartPointName;
                    DEFAULT_VALUE_Partpoint.RiskList = SelectData[0].RiskID;
                    DEFAULT_VALUE_Partpoint.DeviceList = SelectData[0].DeviceID;

                    $("body").append($com.modal.show(DEFAULT_VALUE_Partpoint, KEYWORD_Partpoint, "修改设备", function (rst) {
                        //调用插入函数 
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        var partpointSource = {
                            Active: SelectData[0].Active,
                            AlarmSeconds: SelectData[0].AlarmSeconds,
                            CreateTime: $com.util.format('yyyy-MM-dd HH:mm:ss', new Date()),
                            Creator: SelectData[0].Creator,
                            DeviceID: Number(rst.DeviceList),
                            DeviceNo: "",
                            IPTSeconds: SelectData[0].IPTSeconds,
                            InstanceID: SelectData[0].InstanceID,
                            LineID: SelectData[0].WorkShopID,
                            LineName: SelectData[0].WorkShopID,
                            MaterialBG: Number(rst.MaterialBG),
                            MaterialPL: Number(rst.MaterialPL),
                            Mode: SelectData[0].Mode,
                            OrderID: SelectData[0].OrderID,
                            PartID: SelectData[0].PartID,
                            PartName: SelectData[0].PartName,
                            PartPointID: SelectData[0].PartPointID,
                            PartPointName: SelectData[0].PartPointName,
                            PointMode: Number(rst.PointMode),
                            RiskID: Number(rst.RiskList),
                            RiskText: "",
                            WorkShopID: SelectData[0].WorkShopID,
                            WorkShopName: SelectData[0].WorkShopName

                        }
                        $.each(data_risk, function (i, item) {
                            if (item.RiskID == rst.RiskList) {
                                partpointSource.RiskText = item.RiskText;
                                return false;
                            }
                        })
                        $.each(data_device, function (i, item) {
                            if (item.DeviceID == rst.DeviceList) {
                                partpointSource.DeviceNo = item.DeviceNo;
                                return false;
                            }
                        })
                        $.each(dataAll.list, function (i, item) {
                            if (item.WorkShopID == workShopID && item.LineID == lineID) {
                                $.each(item.GroupEntryList, function (g_i, g_item) {
                                    if (g_item.GroupID == partGroupID) {
                                        $.each(g_item.PartList, function (p_i, p_item) {
                                            if (p_item.PartID == partID) {
                                                $.each(p_item.PartPointList, function (pp_i, pp_item) {
                                                    if (pp_item.PartPointID == SelectData[0].PartPointID) {
                                                        p_item.PartPointList[pp_i] = partpointSource;
                                                        return false;
                                                    }
                                                });
                                            }
                                        })

                                    }
                                });
                            }
                        });
                        $.each(dataAll.list, function (i, item) {
                            model.com.addPartGroup({
                                data: item,
                            });
                        });
                        alert("修改成功！！");
                        model.com.refreshPart(partID, partGroupID, lineID, workShopID);
                    }, TypeSource_Partpoint));

                });
                //工序表的删除操作
                $("body").delegate("#cby-delete-PartPoint", "click", function () {
                    var partID = $check.attr("data-value"),
                        partGroupID = $check.closest("li.partgroup").attr("data-value"),
                        lineID = $check.closest("li.line").attr("data-value"),
                        workshopID = $check.closest("li.workshop").attr("data-value");

                    $.each(dataAll.list, function (i, item) {
                        if (item.WorkShopID == workshopID && item.LineID == lineID) {
                            $.each(item.GroupEntryList, function (g_i, g_item) {
                                if (g_item.GroupID == Number(partGroupID)) {
                                    $.each(g_item.PartList, function (p_i, p_item) {
                                        if (p_item.PartID == partID) {
                                            p_item.PartPointList = [];
                                            return false;
                                        }
                                    });
                                }
                            })
                        }
                    })

                    $.each(dataAll.list, function (i, item) {
                        model.com.addPartGroup({
                            data: item,
                        });
                    });
                    alert("删除成功！！");
                    model.com.refreshPart(partID, partGroupID, lineID, workshopID);
                });
                //工序表的工序上移操作
                $("body").delegate("#cby-up-PartPoint", "click", function () {
                    var SelectData = $com.table.getSelectionData($("#cby-PartPoint-tbody"), 'OnlyID', PartPointSource);
                    var onlyID = SelectData[0].OnlyID;
                    if (onlyID == 1) {
                        alert("已经在第一行！！！");
                        return false;
                    }
                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return false;
                    } else if (SelectData.length > 1) {
                        alert(" 一次只能对一行数据移动！")
                        return false;
                    }
                    var flag;
                    var partID = $check.attr("data-value"),
                        partGroupID = $check.closest("li.partgroup").attr("data-value"),
                        lineID = $check.closest("li.line").attr("data-value"),
                        workshopID = $check.closest("li.workshop").attr("data-value");
                    $.each(dataAll.list, function (i, item) {
                        if (item.WorkShopID == workshopID && item.LineID == lineID) {
                            $.each(item.GroupEntryList, function (g_i, g_item) {
                                if (g_item.GroupID == partGroupID) {
                                    $.each(g_item.PartList, function (p_i, p_item) {
                                        if (p_item.PartID == partID) {
                                            $.each(p_item.PartPointList, function (pp_i, pp_item) {
                                                if (SelectData[0].OrderID == pp_item.OrderID) {
                                                    var temp = $com.util.Clone(pp_item);
                                                    var wPrevOrderID = p_item.PartPointList[pp_i - 1].OrderID;
                                                    p_item.PartPointList[pp_i] = p_item.PartPointList[pp_i - 1];
                                                    p_item.PartPointList[pp_i].OrderID = temp.OrderID;

                                                    p_item.PartPointList[pp_i - 1] = temp;
                                                    p_item.PartPointList[pp_i - 1].OrderID = wPrevOrderID;

                                                    return false;
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                    if (flag == 0)
                        return false;
                    if (flag != 0) {
                        //修改显示OnlyID
                        var $selectedTr = $("#cby-PartPoint-tbody input:checked").closest("tr");
                        var $preSelectedTr = $selectedTr.prev("tr");

                        var onlyid = $selectedTr.find("td[data-title=OnlyID]").html();
                        var preOnlyID = $preSelectedTr.find("td[data-title=OnlyID]").html();
                        var tempOnlyID = onlyid;
                        $selectedTr.find("td[data-title=OnlyID]").html(preOnlyID);
                        $preSelectedTr.find("td[data-title=OnlyID]").html(tempOnlyID);

                        //修改DATA -OrderID
                        $selectedTr.find("td[data-title=OnlyID]").attr("data-value", $selectedTr.find("td[data-title=OnlyID]").html());
                        $preSelectedTr.find("td[data-title=OnlyID]").attr("data-value", $preSelectedTr.find("td[data-title=OnlyID]").html());

                        //修改显示数据
                        var $temp = $preSelectedTr.children();
                        $preSelectedTr.html($selectedTr.children());
                        $selectedTr.html($temp);
                        $selectedTr = $preSelectedTr;

                        $.each(dataAll.list, function (i, item) {
                            model.com.addPartGroup({
                                data: item,
                            });
                        });
                    }
                        
                    
                    
                    //model.com.refreshPart(partID, partGroupID, lineID, workshopID);

                });
                //工序表的工序下移操作
                $("body").delegate("#cby-down-PartPoint", "click", function () {
                    var SelectData = $com.table.getSelectionData($("#cby-PartPoint-tbody"), 'OnlyID', PartPointSource);
                    var onlyID = SelectData[0].OnlyID, maxLength = PartPointSource.length;
                    if (onlyID == maxLength) {
                        alert("已经在最后一行！！！");
                        return false;
                    }

                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return false;
                    } else if (SelectData.length > 1) {
                        alert(" 一次只能对一行数据移动！")
                        return false;
                    }
                    var partID = $check.attr("data-value"),
                        partGroupID = $check.closest("li.partgroup").attr("data-value"),
                        lineID = $check.closest("li.line").attr("data-value"),
                        workshopID = $check.closest("li.workshop").attr("data-value");
                    var flag=true;
                    $.each(dataAll.list, function (i, item) {
                        if (item.WorkShopID == workshopID && item.LineID == lineID) {
                            $.each(item.GroupEntryList, function (g_i, g_item) {
                                if (g_item.GroupID == partGroupID) {
                                    $.each(g_item.PartList, function (p_i, p_item) {
                                        if (p_item.PartID == partID) {
                                            $.each(p_item.PartPointList, function (pp_i, pp_item) {
                                                if (SelectData[0].OrderID == pp_item.OrderID) {
                                                    var temp = $com.util.Clone(pp_item);
                                                    var wNextOrderID = p_item.PartPointList[pp_i + 1].OrderID
                                                    p_item.PartPointList[pp_i] = p_item.PartPointList[pp_i + 1];
                                                    p_item.PartPointList[pp_i].OrderID = temp.OrderID;

                                                    p_item.PartPointList[pp_i + 1] = temp;
                                                    p_item.PartPointList[pp_i + 1].OrderID = wNextOrderID;

                                                    return false;
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                    if (flag == false) {
                        alert("已经是最后一行了！！")
                        return false;
                    }
                    if (flag == true) {
                        //修改显示OnlyID
                        var $selectedTr = $("#cby-PartPoint-tbody input:checked").closest("tr");
                        var $nextSelectedTr = $selectedTr.next("tr");

                        var onlyid = $selectedTr.find("td[data-title=OnlyID]").html();
                        var nextOnlyID = $nextSelectedTr.find("td[data-title=OnlyID]").html();
                        var tempOnlyID = onlyid;

                        $selectedTr.find("td[data-title=OnlyID]").html(nextOnlyID);
                        $nextSelectedTr.find("td[data-title=OnlyID]").html(tempOnlyID);

                        //修改DATA -OnlyID
                        $selectedTr.find("td[data-title=OnlyID]").attr("data-value", $selectedTr.find("td[data-title=OnlyID]").html());
                        $nextSelectedTr.find("td[data-title=OnlyID]").attr("data-value", $nextSelectedTr.find("td[data-title=OnlyID]").html());

                        //修改显示数据
                        var $temp = $nextSelectedTr.children();
                        $nextSelectedTr.html($selectedTr.children());
                        $selectedTr.html($temp);
                        $selectedTr = $nextSelectedTr;

                        $.each(dataAll.list, function (i, item) {
                            model.com.addPartGroup({
                                data: item,
                            });
                        });
                    }
    
                    //model.com.refreshPart(partID, partGroupID, lineID, workshopID);

                });
                //工序表的模糊查询
                $("body").delegate("#cby-search-text-ledger", "change", function () {
                    var $this = $(this),
                        value = $(this).val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#cby-PartPoint-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#cby-PartPoint-tbody"), PartPointSource, value, "OnlyID");
                });

                //设备组的点击事件
                $("body").delegate("#deviceGroupTree li", "click", function () {
                    var $this = $(this),
                        groupID = $this.attr("data-value"),
                        deviceList = [];
                    _groupID = groupID;
                    $("#deviceGroupTree li").css("color", "black");
                    $this.css("color", "blue");
                    $.each(data_deviceGroup, function (d_i, d_item) {
                        if (d_item.GroupID == groupID) {
                            deviceList = d_item.DeviceList;
                            $.each(deviceList, function (i, item) {
                                item.OnlyID = i + 1;
                            })
                        }
                    });
                    model.com.renderDeviceGroup(deviceList);
                });
                //设备组的新增操作
                $("body").delegate("#cby-tree-add-deviceGroup", "click", function () {
                    DEFAULT_VALUE_deviceGroup.GroupID = model.com.GetMaxID(data_deviceGroup);
                    $("body").append($com.modal.show(DEFAULT_VALUE_deviceGroup, KEYWORD_deviceGroup, "新增设备组", function (rst) {
                        if (!rst || $.isEmptyObject(rst))
                            return false;
                        var deviceGroupSource = {
                            GroupID: rst.GroupID,
                            GroupName: rst.GroupName,
                            DeviceList: []
                        }
                        data_deviceGroup.push(deviceGroupSource);

                        model.com.addDeviceGroup({
                            data: data_deviceGroup,
                        }, function (res) {
                            if (res != 0) {
                                alert("新增成功！！");
                                model.com.refreshDeviceTree();
                            }
                            else {
                                alert("新增失败！！");
                            }
                        });
                    }, TypeSource_deviceGroup))
                });
                //设备组的删除操作
                $("body").delegate("#cby-tree-delete-deviceGroup", "click", function () {
                    var selectData = [];
                    $.each($("#deviceGroupTree").find('li').find('input'), function (i, item) {
                        if ($(item).is(":checked")) {
                            var k = {
                                GroupID: $(item).closest('li').attr("data-value")
                            }
                            selectData.push(k);
                        }
                    });
                    model.com.getNewShiftList(selectData, data_deviceGroup);
                    model.com.addDeviceGroup({
                        data: data_deviceGroup,
                    }, function (res) {
                        if (res != 0) {
                            alert("删除成功！！");
                            model.com.refreshDeviceTree();
                        }
                        else {
                            alert("删除失败！！");
                        }
                    })
                });
                //设备组下新增设备操作
                $("body").delegate("#cby-add-deviceGroup", "click", function () {
                    var DeviceArr = [],
                        DeviceTemp_W = {
                            WorkShopID: 0,
                            WorkShopName: "",
                            LineList: [],
                            LineDevice: {}
                        },
                        DeviceTemp_L = {
                            LineID: 0,
                            LineName: "",
                            DeviceList: []
                        };
                    //设备缓存变量
                    var _Device = {};

                    //得到车间产线
                    $.each(data_device, function (i, item) {
                        var _DeviceItem_W = {};
                        //获取车间设备结构
                        if (_Device[item.WorkShopID]) {
                            //存在则取出
                            _DeviceItem_W = _Device[item.WorkShopID];
                        }
                        else {
                            //不存在 则创建车间设备结构  并添加到结果数组与设备缓存变量中
                            _DeviceItem_W = $com.util.Clone(DeviceTemp_W);
                            _DeviceItem_W.WorkShopID = item.WorkShopID;
                            _DeviceItem_W.WorkShopName = item.WorkShopName;

                            DeviceArr.push(_DeviceItem_W);
                            _Device[item.WorkShopID]=(_DeviceItem_W);
                        }

                        var _DeviceItem_L = {};
                        //获取车间设备结构
                        if (_DeviceItem_W.LineDevice[item.LineID]) {
                            //存在则取出
                            _DeviceItem_L = _DeviceItem_W.LineDevice[item.LineID];
                        }
                        else {
                            //不存在 则创建产线设备结构  并添加到车间设备结构中的产线数组与其对应设备缓存变量中
                            _DeviceItem_L = $com.util.Clone(DeviceTemp_L);

                            _DeviceItem_L.LineID = item.LineID;
                            _DeviceItem_L.LineName = item.LineName;

                            _DeviceItem_W.LineList.push(_DeviceItem_L);
                            _DeviceItem_W.LineDevice[item.LineID]=(_DeviceItem_L);
                        }

                        _DeviceItem_L.DeviceList.push(item);

                    });
                    TypeSource_Device = {
                        WorkShopList: [{
                            name: "全部",
                            value: 0,
                            far: 0
                        }],
                        LineList: [{
                            name: "全部",
                            value: 0,
                            far: 0
                        }],
                        DeviceList: [{
                            name: "全部",
                            value: 0,
                            far: 0
                        }]
                    };
                    $.each(DeviceArr, function (i, item) {
                        TypeSource_Device.WorkShopList.push({
                            name: item.WorkShopName,
                            value: item.WorkShopID
                        });
                        $.each(item.LineList, function (l_i, l_item) {
                            TypeSource_Device.LineList.push({
                                name: l_item.LineName,
                                value: l_item.LineID,
                                far: item.WorkShopID
                            });
                            $.each(l_item.DeviceList, function (d_i, d_item) {
                                TypeSource_Device.DeviceList.push({
                                    name: d_item.DeviceNo,
                                    value: d_item.DeviceID,
                                    far: item.WorkShopID + "_" + l_item.LineID
                                });
                            });
                        });
                    });

                    $("body").append($com.modal.show(DEFAULT_VALUE_Device, KEYWORD_Device, "新增设备", function (rst) {
                        if (!rst || $.isEmptyObject(rst))
                            return false;
                        //拿到此设备组的所有设备
                        var deviceList=[],deviceAll=[];
                        $.each(data_deviceGroup, function (i, item) {
                            $.each(item.DeviceList, function (d_i, d_item) {
                                deviceAll.push(d_item);
                            });
                            if (item.GroupID == _groupID) {
                                deviceList = item.DeviceList;
                            }
                        });
                        //删除设备组中已存在的设备
                        var _list = $com.util.Clone(rst.DeviceList),
                            _aList = $com.util.Clone(deviceAll),
                            _deviceAll = model.com.getNewDeviceArr(_list, _aList);

                        var DeviceSource = {
                            DeviceID: 0,
                            DeviceNo: "",
                            Priority:0
                        }
                        //拿到筛选后的设备
                        var selectDeviceArr = [];
                        $.each(_deviceAll, function (_d_i, _d_item) {
                            $.each(data_device, function (i, item) {
                                if (item.DeviceID == _d_item) {
                                    var _DeviceSource=$com.util.Clone(DeviceSource);
                                    _DeviceSource.DeviceID = item.DeviceID,
                                    _DeviceSource.DeviceNo = item.DeviceNo,
                                    _DeviceSource.Priority = model.com.getMaxPriority(deviceList) + _d_i;
                                    selectDeviceArr.push(_DeviceSource);
                                }
                            })
                        });

                        //添加设备
                        $.each(data_deviceGroup, function (d_i, d_item) {
                            if (d_item.GroupID == _groupID) {
                                d_item.DeviceList = d_item.DeviceList.concat(selectDeviceArr);
                                return false;
                            }
                        });
                        model.com.addDeviceGroup({
                            data: data_deviceGroup,
                        }, function (res) {
                            if (res != 0) {
                                alert("新增成功！！");
                                model.com.renderDeviceGroup(data_deviceGroup);
                            }
                            else {
                                alert("新增失败！！");
                            }
                        });
                    },TypeSource_Device))
                });
                //设备组下删除设备操作
                $("body").delegate("#cby-delete-deviceGroup", "click", function () {
                    //拿到点击的设备组ID
                    var groupID = _groupID;
                    var deviceList = [];
                    $.each(data_deviceGroup, function (i, item) {
                        if (item.GroupID == Number(groupID)) {
                            deviceList = item.DeviceList;
                            return false;
                        }
                    });
                    //拿到选择项
                    var SelectData = $com.table.getSelectionData($("#cby-deviceGroup-tbody"), "OnlyID", DeviceSource);

                    if (!SelectData || !SelectData.length) {
                        alert("请先选择至少一行数据再试！")
                        return;
                    }
                    //删除所选的项
                    var wlist = $com.util.Clone(deviceList)
                    var list = model.com.getNewDeviceList(wlist, SelectData);
                    //替换
                    $.each(data_deviceGroup, function (i, item) {
                        if (item.GroupID == groupID)
                            item.DeviceList = list;
                        return false;
                    });
                    model.com.addDeviceGroup({
                        data: data_deviceGroup,
                    }, function (res) {
                        if (res != 0) {
                            alert("删除成功！！");
                            model.com.renderDeviceGroup(data_deviceGroup);
                        }
                        else {
                            alert("删除失败！！");
                        }
                    });
                });
                //设备组设备上移操作
                $("body").delegate("#cby-up-Priority", "click", function () {
                    var SelectData = $com.table.getSelectionData($("#cby-deviceGroup-tbody"), 'OnlyID', DeviceSource);
                    var onlyID = SelectData[0].OnlyID;
                    if (onlyID == 1) {
                        alert("已经在第一行！！！");
                        return false;
                    }
                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return false;
                    } else if (SelectData.length > 1) {
                        alert(" 一次只能对一行数据移动！")
                        return false;
                    }
                    var flag = true;
                    $.each(data_deviceGroup, function (i, item) {
                        if (item.GroupID == _groupID) {
                            $.each(item.DeviceList, function (d_i, d_item) {
                                if (SelectData[0].OnlyID == d_item.OnlyID) {
                                    if (d_i == 0) {
                                        flag = false;
                                        alert("不能对第一行数据进行操作！！");
                                        return false;
                                    }
                                    var temp = $com.util.Clone(d_item);
                                    var wPrevPriority = item.DeviceList[d_i - 1].Priority;
                                    item.DeviceList[d_i] = item.DeviceList[d_i - 1];
                                    item.DeviceList[d_i].Priority = temp.Priority;

                                    item.DeviceList[d_i - 1] = temp;
                                    item.DeviceList[d_i - 1].Priority = wPrevPriority;

                                    return false;
                                }
                            });
                        }
                    });
                    if (flag == false) {
                        return false;
                    }
                    //修改显示OnlyID
                    var $selectedTr = $("#cby-deviceGroup-tbody input:checked").closest("tr");
                    var $preSelectedTr = $selectedTr.prev("tr");

                    var onlyid = $selectedTr.find("td[data-title=OnlyID]").html();
                    var preOnlyID = $preSelectedTr.find("td[data-title=OnlyID]").html();
                    var tempOnlyID = onlyid;
                    $selectedTr.find("td[data-title=OnlyID]").html(preOnlyID);
                    $preSelectedTr.find("td[data-title=OnlyID]").html(tempOnlyID);

                    //修改显示Priority
                    var $selectedTr = $("#cby-deviceGroup-tbody input:checked").closest("tr");
                    var $preSelectedTr = $selectedTr.prev("tr");

                    var priority = $selectedTr.find("td[data-title=Priority]").html();
                    var prePriority = $preSelectedTr.find("td[data-title=Priority]").html();
                    var tempPriority = priority;
                    $selectedTr.find("td[data-title=Priority]").html(prePriority);
                    $preSelectedTr.find("td[data-title=Priority]").html(tempPriority);

                    //修改DATA -OnlyID
                    $selectedTr.find("td[data-title=OnlyID]").attr("data-value", $selectedTr.find("td[data-title=OnlyID]").html());
                    $preSelectedTr.find("td[data-title=OnlyID]").attr("data-value", $preSelectedTr.find("td[data-title=OnlyID]").html());

                    //修改显示数据
                    var $temp = $preSelectedTr.children();
                    $preSelectedTr.html($selectedTr.children());
                    $selectedTr.html($temp);
                    $selectedTr = $preSelectedTr;

                    model.com.addDeviceGroup({
                        data: data_deviceGroup,
                    });
                   
                });
                //设备组设备下移操作
                $("body").delegate("#cby-down-Priority", "click", function () {
                    var SelectData = $com.table.getSelectionData($("#cby-deviceGroup-tbody"), 'OnlyID', DeviceSource);
                    var onlyID = SelectData[0].OnlyID,
                        maxLength = DeviceSource.length;
                    if (onlyID == maxLength) {
                        alert("已经在最后一行了！！！");
                        return false;
                    }
                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return false;
                    } else if (SelectData.length > 1) {
                        alert(" 一次只能对一行数据移动！")
                        return false;
                    }
                    var flag = true;
                    $.each(data_deviceGroup, function (i, item) {
                        if (item.GroupID == _groupID) {
                            $.each(item.DeviceList, function (d_i, d_item) {
                                if (SelectData[0].OnlyID == d_item.OnlyID) {
                                    if (d_i == item.DeviceList.length - 1) {
                                        flag = false;
                                        alert("不能对最后一行数据进行操作！！");
                                        return false;
                                    }
                                    var temp = $com.util.Clone(d_item);
                                    var wNextPriority = item.DeviceList[d_i + 1].Priority;
                                    item.DeviceList[d_i] = item.DeviceList[d_i + 1];
                                    item.DeviceList[d_i].Priority = temp.Priority;

                                    item.DeviceList[d_i + 1] = temp;
                                    item.DeviceList[d_i + 1].Priority = wNextPriority;

                                    return false;
                                }
                            });
                        }
                    });
                    if (flag == false) {
                        return false;
                    }
                    //修改显示OnlyID
                    var $selectedTr = $("#cby-deviceGroup-tbody input:checked").closest("tr");
                    var $nextSelectedTr = $selectedTr.next("tr");

                    var onlyid = $selectedTr.find("td[data-title=OnlyID]").html();
                    var nextOnlyID = $nextSelectedTr.find("td[data-title=OnlyID]").html();
                    var tempOnlyID = onlyid;

                    $selectedTr.find("td[data-title=OnlyID]").html(nextOnlyID);
                    $nextSelectedTr.find("td[data-title=OnlyID]").html(tempOnlyID);

                    //修改DATA -OnlyID
                    $selectedTr.find("td[data-title=OnlyID]").attr("data-value", $selectedTr.find("td[data-title=OnlyID]").html());
                    $nextSelectedTr.find("td[data-title=OnlyID]").attr("data-value", $nextSelectedTr.find("td[data-title=OnlyID]").html());

                    //修改显示Priority
                    var $selectedTr = $("#cby-deviceGroup-tbody input:checked").closest("tr");
                    var $nextSelectedTr = $selectedTr.next("tr");

                    var priority = $selectedTr.find("td[data-title=Priority]").html();
                    var nextPriority = $nextSelectedTr.find("td[data-title=Priority]").html();
                    var tempPriority = priority;
                    $selectedTr.find("td[data-title=Priority]").html(nextPriority);
                    $nextSelectedTr.find("td[data-title=Priority]").html(tempPriority);

                    //修改显示数据
                    var $temp = $nextSelectedTr.children();
                    $nextSelectedTr.html($selectedTr.children());
                    $selectedTr.html($temp);
                    $selectedTr = $nextSelectedTr;


                    model.com.addDeviceGroup({
                        data: data_deviceGroup,
                    });

                });
                //设备组下查询设备操作
                $("body").delegate("#cby-search-text-ledger", "change", function () {
                    var $this = $(this),
                        value = $(this).val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#cby-deviceGroup-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#cby-deviceGroup-tbody"), DeviceSource, value, "OnlyID");
                });
            },
            run: function () {
                model.com.getLineEntry({}, function (data) {
                    dataAll = data;
                    model.com.refreshTree(dataAll.list);
                });
                model.com.getPart({}, function (data) {
                    data_part = data.list;
                });
                model.com.getPartPoint({}, function (data) {
                    data_partpoint = data.list;
                });
                model.com.getDeviceGroup({}, function (data) {
                    data_deviceGroup = data.list;
                });
                model.com.getRisk({}, function (data) {
                    data_risk = data.list;
                });
                model.com.getDeviceAll({}, function (data) {
                    data_device = data.list;
                });
                model.com.getWorkShop({}, function (data) {
                    data_workshop = data.list;
                });
                $("#deviceTable").hide();
                $("#partpointTable").hide();
                $("#deviceGroupTable").hide();
                $("#device").hide();
            },
            com: {
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
                getDeviceGroup: function (data, fn, context) {
                    var d = {
                        $URI: "/APSDeviceGroup/All",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                getRisk: function (data, fn, context) {
                    var d = {
                        $URI: "/RiskGrade/All",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                getDeviceAll: function (data, fn, context) {
                    var d = {
                        $URI: "/Device/All",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
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

                addPartGroup: function (data, fn, context) {
                    var d = {
                        $URI: "/APSLineEntry/LineEntrySave",
                        $TYPE: "post"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                addDeviceGroup: function (data, fn, context) {
                    var d = {
                        $URI: "/APSDeviceGroup/Save",
                        $TYPE: "post"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                refreshTree: function (data) {
                    //获得车间产线
                    var newWorkshopArr = [];
                    var _dataAll = $com.util.Clone(data);
                    $.each(_dataAll, function (i, item) {
                        for (var j = 0; j < newWorkshopArr.length; j++) {
                            if (newWorkshopArr[j].WorkShopID == item.WorkShopID) {
                                newWorkshopArr[j].LineList.push({
                                    LineID: item.LineID,
                                    LineName: item.LineName,
                                    GroupEntryList: item.GroupEntryList
                                });
                                return;
                            }
                        }
                        //第一次没有数据时直接添加
                        newWorkshopArr.push({
                            WorkShopID: item.WorkShopID,
                            WorkShopName: item.WorkShopName,
                            LineList: [{
                                LineID: item.LineID,
                                LineName: item.LineName,
                                GroupEntryList: item.GroupEntryList
                            }]
                        })

                        var arr = newWorkshopArr;
                        model.com.renderTree(arr);
                    })
                },
                renderTree: function (list) {
                    $.each(list, function (i, item) {
                        $.each(item.LineList, function (l_i, l_item) {
                            $.each(l_item.GroupEntryList, function (g_i, g_item) {
                                $.each(g_item.PartList, function (p_i, p_item) {
                                    p_item.Items = $com.util.template(p_item.PartPointList, HTML.TreePartPointItemNode);
                                })
                                g_item.Items = $com.util.template(g_item.PartList, HTML.TreePartItemNode);
                            })
                            l_item.Items = $com.util.template(l_item.GroupEntryList, HTML.TreePartGroupItemNode);
                        })
                        item.Items = $com.util.template(item.LineList, HTML.TreeLineItemNode);
                    })
                    workshop_source = list;
                    $("#physicalWorkshopTree").html($com.util.template(list, HTML.TreeWorkshopItemNode));
                    $("#physicalWorkshopTree").treeview();
                },

                refreshGroup: function (partgroupID, lineID, workshopID) {
                    //拿到工序段组对应的设备组
                    var deviceList = [],type;
                    $.each(dataAll.list, function (i, item) {
                        if (item.WorkShopID == workshopID && item.LineID == lineID) {
                            $.each(item.GroupEntryList, function (g_i, g_item) {
                                if (g_item.GroupID == partgroupID) {
                                    type = g_item.Type;
                                    $.each(data_deviceGroup, function (d_i, d_item) {
                                        if (g_item.DeviceGroupList != 0) {
                                            if (g_item.DeviceGroupList == d_item.GroupID) {
                                                deviceList = d_item.DeviceList;
                                                return false;
                                            }
                                        }
                                        else if (g_item.DeviceGroupList == 0) {
                                            deviceList = [];
                                        }
                                    })
                                }
                            })
                        }
                    });
                    if (type == 1) {
                        $("#cby-change-name").text("共用");
                    } else if (type == 2) {
                        $("#cby-change-name").text("专用");
                    }
                    $.each(deviceList, function (i, item) {
                        item.OnlyID = i + 1;
                    })
                    //渲染设备组列表
                    model.com.renderGroup(deviceList);
                },
                renderGroup: function (list) {
                    var _list = $com.util.Clone(list),
                        _data = [];
                    $.each(_list, function (i, item) {
                        for (var p in item) {
                            if (!FORMATTRT[p])
                                continue;
                            item[p] = FORMATTRT[p](item[p]);
                        }
                        _data.push(item);
                    });
                    DeviceGroupSource = _data;
                    $("#cby-PartGroup-tbody").html($com.util.template(_data, HTML.PartGroupItemNode));
                },

                refreshPart: function (partID, partGroupID, lineID, workShopID) {
                    var partPointList = [];
                    $.each(dataAll.list, function (i, item) {
                        if (item.WorkShopID == workShopID && item.LineID == lineID) {
                            $.each(item.GroupEntryList, function (g_i, g_item) {
                                if (g_item.GroupID == partGroupID) {
                                    $.each(g_item.PartList, function (p_i, p_item) {
                                        if (p_item.PartID == partID) {
                                            partPointList = p_item.PartPointList;
                                            return false;
                                        }
                                    })
                                }
                            })
                        }
                    });
                    $.each(partPointList, function (i, item) {
                        item.OnlyID = i + 1;
                    });
                    $.each(partPointList, function (pp_i, pp_item) {
                        $.each(data_risk, function (r_i, r_item) {
                            if (pp_item.RiskID == r_item.RiskID)
                                pp_item.RiskText = r_item.RiskText;
                        });
                    });
                    model.com.renderPart(partPointList);
                },
                renderPart: function (list) {
                    var _list = $com.util.Clone(list),
                        _data = [];

                    $.each(_list, function (i, item) {
                        for (var p in item) {
                            if (!FORMATTRT_Partpoint[p])
                                continue;
                            item[p] = FORMATTRT_Partpoint[p](item[p]);
                        }
                        _data.push(item);
                    });
                    PartPointSource = _data;
                    $("#cby-PartPoint-tbody").html($com.util.template(_data, HTML.PartPointItemNode));
                },

                refreshDeviceTree: function () {
                    $("#deviceGroupTree").html($com.util.template(data_deviceGroup, HTML.TreeDeviceGroupItemNode));
                    $("#deviceGroupTree").treeview();
                },
                renderDeviceGroup: function (list) {
                    var _list = $com.util.Clone(list),
                        _data = [];

                    $.each(_list, function (i, item) {
                        for (var p in item) {
                            if (!FORMATTRT_deviceGroup[p])
                                continue;
                            item[p] = FORMATTRT_deviceGroup[p](item[p]);
                        }
                        _data.push(item);
                    });
                    DeviceSource = _data;
                    $("#cby-deviceGroup-tbody").html($com.util.template(_data, HTML.DeviceItemNode));
                },

                chooseAdd: function (flag, $this) {
                    switch (flag) {
                        case 0: //line

                            var $far = $this.closest("ul").closest("li"),
                                shopID = $far.attr("data-value"),
                                lineID = $this.attr("data-value");
                            model.com.addUtils.line();


                            break;
                        case 1://partgroup   

                            var lineID = $this.attr("data-value"),
                                shopID = $this.closest("li.workshop").attr("data-value");
                            model.com.addUtils.partgroup(lineID, shopID);

                            break;

                        case 2: //part
                            var partGroupID = $this.attr("data-value"),
                                lineID = $this.closest("li.line").attr("data-value"),
                                workShopID = $this.closest("li.workshop").attr("data-value");

                            model.com.addUtils.part(workShopID, lineID, partGroupID);
                            break;
                        case 3: //partpoint
                            var partID = $this.attr("data-value"),
                                partGroupID = $this.closest("li.partgroup").attr("data-value"),
                                lineID = $this.closest("li.line").attr("data-value"),
                                workShopID = $this.closest("li.workshop").attr("data-value");
                            model.com.addUtils.partpoint(partID, partGroupID, lineID, workShopID);
                            break;
                        default: //workshop
                            model.com.addUtils.workShop();
                            break;
                    }
                },
                addUtils: {
                    workShop: function () {

                    },
                    line: function () {

                    },
                    partgroup: function (lineID, shopID) {
                        var $input = $(".line input[type=checkbox]:checked");
                        //判断是否产线被选择
                        if ($input) {
                            //选择的是唯一产线
                            if ($input.length == 1) {
                                //设定模态框的默认值
                                var _workshopName, _lineName;
                                TypeSource.DeviceGroupList = [{
                                    name: "无",
                                    value: 0,
                                    far: 2
                                }];
                                $.each(dataAll.list, function (i, item) {
                                    if (item.WorkShopID == shopID && item.LineID == lineID) {
                                        _workshopName = item.WorkShopName,
                                        _lineName = item.LineName;
                                        $.each(item.GroupEntryList, function (g_i, g_item) {
                                            DEFAULT_VALUE.GroupID = item.GroupEntryList.length + 1;
                                            $.each(data_deviceGroup, function (d_i, d_item) {
                                                TypeSource.DeviceGroupList.push({
                                                    name: d_item.GroupName,
                                                    value: d_item.GroupID,
                                                    far: 1
                                                });
                                            });
                                            return false;
                                        })
                                    }
                                })

                                //添加
                                $("body").append($com.modal.show(DEFAULT_VALUE, KEYWORD, "新增工序段组", function (rst) {
                                    if (!rst || $.isEmptyObject(rst))
                                        return false;
                                    var typtText;
                                    if (rst.Type == 2) {
                                        typtText = "专用"
                                    } else if (rst.Type == 1) {
                                        typtText = "共用"
                                    }
                                    var PartGroupSource = {
                                        Creator: window.parent.User_Info.Name,
                                        CreateTime: $com.util.format('yyyy-MM-dd HH:mm:ss', new Date()),
                                        DeviceGroupList: 0,
                                        GroupID: Number(rst.GroupID),
                                        GroupName: rst.GroupName,
                                        InstanceID: 0,
                                        LineID: Number(lineID),
                                        LineName: _lineName,
                                        Type: Number(rst.Type),
                                        TypeText: typtText,
                                        WorkShopID: Number(shopID),
                                        WorkShopName: _workshopName,
                                        PartList: []
                                    }

                                    $.each(dataAll.list, function (i, item) {
                                        if (item.LineID == lineID && item.WorkShopID == shopID) {
                                            //若此此产线下存在工序段组，则要进行唯一判断
                                            if (item.GroupEntryList.length > 0) {
                                                $.each(item.GroupEntryList, function (l_i, l_item) {
                                                    if (l_item.GroupID == rst.GroupID || l_item.GroupName == rst.GroupName) {
                                                        alert("输入的工序段组重复！");
                                                        return false;
                                                    }
                                                    else {
                                                        PartGroupSource.DeviceGroupList = rst.DeviceGroupList;
                                                        item.GroupEntryList.push(PartGroupSource);
                                                        return false;

                                                    }
                                                })
                                            }
                                                //若次产线下无工序段组，则直接添加
                                            else {
                                                PartGroupSource.DeviceGroupList = rst.DeviceGroupList;
                                                item.GroupEntryList.push(PartGroupSource);
                                                return false;
                                            }
                                        }
                                    })
                                    $.each(dataAll.list, function (i, item_i) {
                                        model.com.addPartGroup({
                                            data: item_i,
                                        });
                                    });
                                    alert("新增成功！！");
                                    model.com.refreshTree(dataAll.list);

                                }, TypeSource))
                            }
                            else {
                                alert("只能对一个产线进行添加操作！");
                            }
                        }
                        else {
                            alert("请选择产线！")
                        }
                    },
                    part: function (workShopID, lineID, partGroupID) {
                        var $input = $(".partgroup input[type=checkbox]:checked");
                        if ($input) {
                            if ($input.length == 1) {
                                //拿到所有的工序段
                                var partList = [];
                                $.each(data_part, function (i, item) {
                                    partList.push(item);
                                })

                                //拿到勾选项下的组对应的工序段
                                var _partList = [];
                                $.each(dataAll.list, function (i, item) {
                                    if (item.WorkShopID == workShopID && item.LineID == lineID) {
                                        $.each(item.GroupEntryList, function (g_i, g_item) {
                                            if (g_item.GroupID == partGroupID) {
                                                _partList = g_item.PartList;
                                            }
                                        });
                                    }
                                });

                                //将重复的工序段从模态框中删除
                                var partList = $com.util.Clone(partList);
                                if (_partList.length != 0) {
                                    $.each(_partList, function (_i, _item) {
                                        if (_partList.length != 0) {
                                            var _index = -1;
                                            $.each(partList, function (i, item) {
                                                if (_item.PartName == item.PartName) {
                                                    _index = i;
                                                }
                                            })
                                            if (_index >= 0)
                                                partList.splice(_index, 1);
                                        }
                                    })
                                }
                                //将模态框中的值填充
                                var PartList = [];
                                $.each(partList, function (i, item) {
                                    PartList.push({
                                        name: item.PartName,
                                        value: item.PartID
                                    })
                                })
                                TypeSource_part.PartList = PartList;
                                //添加工序段
                                $("body").append($com.modal.show(DEFAULT_VALUE_part, KEYWORD_part, "新增工序段", function (rst) {
                                    if (!rst || $.isEmptyObject(rst))
                                        return false;
                                    var groupID = $input.closest("li").attr("data-value"),
                                        lineID = $input.closest("li .line").attr("data-value"),
                                        workshopID = $input.closest("li.workshop").attr("data-value");

                                    //将选中项的item添加进新数组
                                    var arr = [];
                                    $.each(partList, function (i, item) {
                                        $.each(rst.PartList, function (p_i, p_item) {
                                            if (p_item == item.PartID) {
                                                arr.push(item);
                                            }
                                        })
                                    })
                                    PartSource = arr;
                                    //添加到原始数据中去
                                    $.each(dataAll.list, function (i, item) {
                                        if (item.WorkShopID == workShopID && item.LineID == lineID) {
                                            $.each(item.GroupEntryList, function (g_i, g_item) {
                                                if (g_item.GroupID == partGroupID) {
                                                    $.each(arr, function (_i, _item) {
                                                        _item.LineID = lineID,
                                                        _item.LineName = g_item.LineName,
                                                        _item.OrderID = model.com.GetMaxID(g_item.PartList),
                                                        _item.WorkShopID = workshopID,
                                                        _item.WorkShopName = g_item.WorkShopName;
                                                    });
                                                    g_item.PartList = g_item.PartList.concat(PartSource);
                                                }
                                            })
                                        }
                                    })

                                    $.each(dataAll.list, function (i, item_i) {

                                        model.com.addPartGroup({
                                            data: item_i,
                                        });
                                    });
                                    alert("新增成功！");
                                    model.com.refreshTree(dataAll.list);

                                }, TypeSource_part))
                            }
                            else {
                                alert("只能对一个工序段组进行添加操作！");
                                return false;
                            }
                        } else {
                            alert("请选择一个工序段组进行添加！");
                            return false;
                        }
                    },
                    partpoint: function (partID, partGroupID, lineID, workShopID) {
                        var $input = $(".part input[type=checkbox]:checked");
                        if ($input) {
                            if ($input.length == 1) {
                                var workshopName, lineName;
                                //拿到所有的工序
                                var partPointList = [];
                                $.each(data_partpoint, function (i, item) {
                                    partPointList.push(item);
                                })
                                //拿到此工序段下的工序
                                var _partPointList = [];
                                $.each(dataAll.list, function (i, item) {
                                    if (item.WorkShopID == workShopID && item.LineID == lineID) {
                                        $.each(item.GroupEntryList, function (g_i, g_item) {
                                            if (g_item.GroupID == partGroupID) {
                                                $.each(g_item.PartList, function (p_i, p_item) {
                                                    if (p_item.PartID == partID) {
                                                        _partPointList = p_item.PartPointList;
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                                //将重复的工序段从模态框中删除
                                var partPointList = $com.util.Clone(partPointList);
                                if (_partPointList.length != 0) {
                                    $.each(_partPointList, function (_i, _item) {
                                        var _index = -1;
                                        $.each(partPointList, function (i, item) {
                                            if (_item.PartPointName == item.PartPointName) {
                                                _index = i;
                                            }
                                        })
                                        if (_index >= 0)
                                            partPointList.splice(_index, 1);

                                    })
                                }

                                //填充模态框中的值
                                var PartPointList = [];
                                $.each(partPointList, function (i, item) {
                                    PartPointList.push({
                                        name: item.PartPointName,
                                        value: item.PartPointID
                                    })
                                })
                                TypeSource_partpoint.PartPointList = PartPointList;
                                //添加工序
                                $("body").append($com.modal.show(DEFAULT_VALUE_partpoint, KEYWORD_partpoint, "新增工序", function (rst) {
                                    if (!rst || $.isEmptyObject(rst))
                                        return false;
                                    var PartPointSource = [];

                                    //将选中项的item添加进新数组
                                    var arr = [];
                                    $.each(partPointList, function (i, item) {
                                        $.each(rst.PartPointList, function (p_i, p_item) {
                                            if (p_item == item.PartPointID) {
                                                arr.push(item);
                                            }
                                        })
                                    })
                                    PartPointSource = arr;
                                    //添加到原始数据中去
                                    $.each(dataAll.list, function (i, item) {
                                        if (item.WorkShopID == workShopID && item.LineID == lineID) {
                                            $.each(item.GroupEntryList, function (g_i, g_item) {
                                                if (g_item.GroupID == partGroupID) {
                                                    $.each(g_item.PartList, function (p_i, p_item) {
                                                        if (p_item.PartID == partID) {
                                                            $.each(arr, function (_i, _item) {
                                                                _item.LineID = p_item.LineID,
                                                                _item.LineName = p_item.LineName,
                                                                _item.WorkShopID = p_item.WorkShopID,
                                                                _item.WorkShopName = p_item.WorkShopName,
                                                                _item.OrderID = (p_item.PartPointList).length + 1,
                                                                _item.PartID = p_item.PartID,
                                                                _item.PartName = p_item.PartName;
                                                            })
                                                            p_item.PartPointList = p_item.PartPointList.concat(PartPointSource);
                                                        }
                                                    })

                                                }
                                            })
                                        }
                                    })

                                    $.each(dataAll.list, function (i, item_i) {

                                        model.com.addPartGroup({
                                            data: item_i,
                                        });
                                        alert("新增成功！！");
                                        model.com.refreshTree(dataAll.list);
                                    });

                                }, TypeSource_partpoint))

                            } else {
                                alert("只能对一个工序段添加工序！")
                            }
                        } else {
                            alert("请选择工序段！")
                        }
                    }
                },
                chooseDel: function (flag, $input) {
                    switch (flag) {
                        case 0: //partpoint
                            model.com.delUtils.partpoint($input);
                            break;
                        case 1://part                          
                            model.com.delUtils.part($input);

                            break;
                        case 2://partgroup                          
                            model.com.delUtils.partgroup($input);

                            break;
                        case 3: //line
                            model.com.delUtils.line($input);
                            break;

                        case 4: //workshop
                            model.com.delUtils.workshop($input);
                            break;
                        default: //车间
                            break;
                    }
                },
                delUtils: {
                    partpoint: function ($partpoint) {
                        var selectData = [];
                        $.each($("#physicalWorkshopTree").find('li').find('input'), function (i, item) {
                            if ($(item).is(":checked")) {
                                var k = {
                                    PartPointID: $(item).closest("li").attr("data-value"),
                                    PartID: $(item).closest("li.part").attr("data-value"),
                                    PartGroupID: $(item).closest("li.partgroup").attr("data-value"),
                                    LineID: $(item).closest("li.line").attr("data-value"),
                                    WorkShopID: $(item).closest("li.workshop").attr("data-value"),
                                }
                                selectData.push(k);
                            }
                        });
                        var delPartPoint = [];
                        $.each(selectData, function (s_i, s_item) {
                            if (selectData.length == 0)
                                return false;
                            $.each(dataAll.list, function (i, item) {
                                if (item.WorkShopID == s_item.WorkShopID && s_item.LineID == item.LineID) {
                                    $.each(item.GroupEntryList, function (g_i, g_item) {
                                        if (g_item.GroupID == s_item.PartGroupID) {
                                            $.each(g_item.PartList, function (p_i, p_item) {
                                                if (p_item.PartID == s_item.PartID) {
                                                    $.each(p_item.PartPointList, function (pp_i, pp_item) {
                                                        if (pp_item.PartPointID == s_item.PartPointID) {
                                                            p_item.PartPointList =
                                                                model.com.getNewPartPointList(p_item.PartPointList, selectData);
                                                            return false;
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        })

                        $.each(dataAll.list, function (i, item_i) {
                            model.com.addPartGroup({
                                data: item_i,
                            });
                        });
                        alert("删除成功！！");
                        model.com.refreshTree(dataAll.list);
                    },
                    part: function ($part) {
                        var selectData = [];
                        //找到被选中的元素的GruopID
                        $.each($("#physicalWorkshopTree").find('li').find('input'), function (i, item) {
                            if ($(item).is(":checked")) {
                                var k = {
                                    PartID: $(item).closest("li").attr("data-value"),
                                    PartGroupID: $(item).closest('li.partgroup').attr("data-value"),
                                    LineID: $(item).closest('li.line').attr("data-value"),
                                    WorkShopID: $(item).closest('li.workshop').attr("data-value")
                                }
                                selectData.push(k);
                            }
                        });

                        $.each(selectData, function (s_i, s_item) {
                            if (selectData.length == 0)
                                return false;
                            $.each(dataAll.list, function (i, item) {
                                if (item.WorkShopID == s_item.WorkShopID && item.LineID == s_item.LineID) {
                                    $.each(item.GroupEntryList, function (g_i, g_item) {
                                        if (g_item.GroupID == s_item.PartGroupID) {
                                            $.each(g_item.PartList, function (p_i, p_item) {
                                                if (p_item.PartID == s_item.PartID) {
                                                    model.com.getNewPartList(g_item.PartList, selectData);
                                                    return false;
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        });
                        $.each(dataAll.list, function (i, item_i) {
                            model.com.addPartGroup({
                                data: item_i,
                            });
                        });
                        alert("删除成功！！");
                        model.com.refreshTree(dataAll.list);
                    },
                    partgroup: function ($partgroup) {
                        var selectData = [];
                        $.each($("#physicalWorkshopTree").find('li').find('input'), function (i, item) {
                            if ($(item).is(":checked")) {
                                var k = {
                                    GroupID: $(item).closest("li").attr("data-value"),
                                    LineID: $(item).closest("li.line").attr("data-value"),
                                    WorkShopID: $(item).closest("li.workshop").attr("data-value"),
                                }
                                selectData.push(k);
                            }
                        });

                        $.each(selectData, function (s_i, s_item) {
                            if (selectData.length == 0)
                                return false;
                            $.each(dataAll.list, function (i, item) {
                                if (item.WorkShopID == s_item.WorkShopID && item.LineID == s_item.LineID) {
                                    $.each(item.GroupEntryList, function (g_i, g_item) {
                                        if (g_item.GroupID == s_item.GroupID) {
                                            model.com.getNewPartGroupList(item.GroupEntryList, selectData);
                                            return false;
                                        }
                                    })
                                }
                            })
                        })

                        $.each(dataAll.list, function (i, item_i) {
                            model.com.addPartGroup({
                                data: item_i,
                            });
                        });
                        alert("删除成功！！");
                        model.com.refreshTree(dataAll.list);
                    },
                    line: function ($line) {

                    },
                    workshop: function ($workshop) {

                    },
                },
                chooseEvent: function (flag, $this) {
                    switch (flag) {
                        case 0: //partgroup

                            var partGroupID = $this.attr("data-value"),
                                lineID = $this.closest("li.line").attr("data-value"),
                                workShopID = $this.closest("li.workshop").attr("data-value");
                            
                            $("#physicalWorkshopTree li").css("color", "black");
                            $this.css("color", "blue");
                            $("#partpointTable").hide();
                            $("#device").hide();
                            $("#deviceGroupTable").hide();
                            $("#deviceTable").show();
                            model.com.refreshGroup(partGroupID, lineID, workShopID);

                            break;
                        case 1://part
                            var partID = $this.attr("data-value"),
                                partGroupID = $this.closest("li.partgroup").attr("data-value"),
                                lineID = $this.closest("li.line").attr("data-value"),
                                workShopID = $this.closest("li.workshop").attr("data-value");


                            $("#physicalWorkshopTree li").css("color", "black");
                            $this.css("color", "blue");
                            $("#deviceTable").hide();
                            $("#device").hide();
                            $("#deviceGroupTable").hide();
                            $("#partpointTable").show();
                            model.com.refreshPart(partID, partGroupID, lineID, workShopID);

                            break;
                        default:
                            break;
                    }
                },

                GetMaxID: function (_source, prop) {
                    var id = 0;
                    if (!_source)
                        _source = [];

                    if (!prop)
                        prop = "GroupID";
                    $.each(_source, function (i, item) {
                        if (item[prop] > id)
                            id = item[prop];
                    });
                    return id + 1;
                },
                GetMaxPartID: function (_source, prop) {
                    var id = 0;
                    if (!_source)
                        _source = [];

                    if (!prop)
                        prop = "PartID";
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
                getMaxPriority: function (_source, prop) {
                    var id = 0;
                    if (!_source)
                        _source = [];

                    if (!prop)
                        prop = "Priority";
                    $.each(_source, function (i, item) {
                        if (item[prop] > id)
                            id = item[prop];
                    });
                    return id + 1;
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
                            if (_source[i].GroupID == set_data[j].GroupID) {
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
                                model.com.getNewShiftList(_source, set_data);
                            }
                        }

                    }
                    rst = _source;
                    return rst;
                },
                getNewPartGroupList: function (_source, set_data) {
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
                                model.com.getNewPartGroupList(_source, set_data);
                            }
                        }

                    }
                    rst = _source;
                    return rst;
                },
                getNewDeviceList: function (_source, set_data) {
                    if (!_source)
                        _source = [];
                    if (!set_data)
                        set_data = [];
                    var rst = [];
                    for (var i = 0; i < _source.length; i++) {
                        var NotOWn = false;
                        for (var j = 0; j < set_data.length; j++) {
                            if (_source[i].OnlyID == set_data[j].OnlyID) {
                                _source.splice(i, 1);
                                set_data.splice(j, 1);
                                NotOWn = true;
                            }
                            if (set_data.length < 1) {
                                break;
                            }
                            if (NotOWn) {
                                model.com.getNewDeviceList(_source, set_data);
                            }
                        }

                    }
                    rst = _source;
                    return rst;
                },
                getNewDeviceArr: function (_source, set_data) {
                    if (!_source)
                        _source = [];
                    if (!set_data)
                        set_data = [];
                    var rst = [];
                    for (var i = 0; i < _source.length; i++) {
                        var NotOWn = false;
                        for (var j = 0; j < set_data.length; j++) {
                            if (_source[i] == set_data[j].DeviceID) {
                                _source.splice(i, 1);
                                set_data.splice(j, 1);
                                NotOWn = true;
                            }
                            if (set_data.length < 1) {
                                break;
                            }
                            if (NotOWn) {
                                model.com.getNewDeviceArr(_source, set_data);
                            }
                        }

                    }
                    rst = _source;
                    return rst;
                },
            }
        });
        model.init();
    });