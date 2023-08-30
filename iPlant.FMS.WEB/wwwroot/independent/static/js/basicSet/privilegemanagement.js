require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {
    var KEYWORD_Device_LIST_item,
        KEYWORD_Device_item,
        FORMATTRT_Device_item,
        DEFAULT_VALUE_Device_item,
        TypeSource_Device_item,

        KEYWORD_Device_LIST_time,
        KEYWORD_Device_time,
        FORMATTRT_Device_time,
        DEFAULT_VALUE_Device_time,
        TypeSource_Device_time,
        BYItem,
        mID,
        flowID,
        model,
        item,
        HTML;
    modelID = 1;
    mID = 0;
    HTML = {
        TableNode_item: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="FunctionID" data-value="{{FunctionID}}" >{{FunctionID}}</td>',
            '<td data-title="FunctionName" data-value="{{FunctionName}}" >{{FunctionName}}</td>',
            '<td data-title="ModeName" data-value="{{ModeName}}" >{{ModeName}}</td>',
            '</tr>',
        ].join(""),

        TableNode_time: [
            '<tr data-color="">',
            '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td>',
            '<td style="min-width: 50px" data-title="FlowName" data-value="{{FlowName}}">{{FlowName}}</td>',
            '<td style="min-width: 50px" data-title="OperatorAuthorName" data-value="{{OperatorAuthorName}}" >{{OperatorAuthorName}}</td>',
            '<td style="min-width: 50px" data-title="Type" data-value="{{Type}}">{{Type}}</td>',
            '</tr>',
        ].join(""),
    };

    (function () {
        KEYWORD_Device_LIST_item = [
            // "ID|编号",
            "FunctionID|节点号",
            "FunctionName|节点名称",
            "ModeName|类型",
        ];
        KEYWORD_Device_item = {};
        FORMATTRT_Device_item = {};
        DEFAULT_VALUE_Device_item = {};

        TypeSource_Device_item = {};


        $.each(KEYWORD_Device_LIST_item, function (i, item) {
            var detail = item.split("|");
            KEYWORD_Device_item[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined,
            };
            if (detail.length > 2) {
                FORMATTRT_Device_item[detail[0]] = $com.util.getFormatter(TypeSource_Device_item, detail[0], detail[2]);
            }
        });
    })();
    (function () {
        KEYWORD_Device_LIST_time = [
            // "ID|编号",
            // "FlowID|节点号|ArrayOne",
            "FlowName|节点名称|ArrayOne",
            "OperatorAuthorName|操作权限名称",
            "Type|操作权限类型|ArrayOneControl",
            "OperatorAuthor|操作员|ArrayOneControl|Type",
        ];
        KEYWORD_Device_time = {};
        FORMATTRT_Device_time = {};
        DEFAULT_VALUE_Device_time = {
            FlowName: "",
            Type: 0,
            OperatorAuthor: 0,
        };

        TypeSource_Device_time = {
            // 1：部门ID 2：岗位ID 3：人员ID
            Type: [
                {
                    name: "无",
                    value: 0,
                },
                {
                    name: "部门",
                    value: 1,
                }, {
                    name: "岗位",
                    value: 2,
                }, {
                    name: "人员",
                    value: 3,
                },
            ],
            OperatorAuthor: [{
                name: "无",
                value: 0,
                far: 0,
            }],
            FlowName: [
                {
                    name: "无",
                    value: 0,
                    far: 0,
                },
            ],
        };


        $.each(KEYWORD_Device_LIST_time, function (x, item) {
            var detail = item.split("|");
            KEYWORD_Device_time[detail[0]] = {
                index: x,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined,
            };
            if (detail.length > 2) {
                FORMATTRT_Device_time[detail[0]] = $com.util.getFormatter(TypeSource_Device_time, detail[0], detail[2]);
            }

        });
    })();


    model = $com.Model.create({
        name: '权限设置',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            //权限设置模糊查询
            $("body").delegate("#zace-search-Device-item", "change", function () {

                var $this = $(this),
                    value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-Device-tbody-item").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-Device-tbody-item"), DataAll, value, "ID");
            });

            //查看节点
            // $("body").delegate("#zace-item", "click", function () {
            $("body").delegate("#femi-Device-tbody-item tr", "dblclick", function () {
                var $this = $(this);
                wID = Number($this.find('td[data-title=ID]').attr('data-value'));
                if (wID) {
                    flowID = wID;
                    model.com.refreshflow(flowID);
                }
            });
            //查看返修
            $("body").delegate("#zace-search", "click", function () {
                var modelID = 2;
                model.com.refresh(modelID);
            });
            //新增节点
            $("body").delegate("#zace-Device-addsh", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_Device_time, KEYWORD_Device_time, "新增", function (rst) {
                    //调用插入函数 

                    if (!rst || $.isEmptyObject(rst))
                        return;
                    var ItemTemp = {
                        ID: 0,
                        FlowID: Number(rst.FlowName),
                        OperatorAuthor: Number(rst.OperatorAuthor),
                        Type: Number(rst.Type),
                    };
                    flowID = ItemTemp.FlowID;
                    model.com.postUpdate({
                        data: ItemTemp,
                    }, function (res) {
                        model.com.refresh();
                        alert("新增成功");
                        model.com.refreshflow(flowID);
                    });

                }, TypeSource_Device_time));


            });
            //修改节点
            $("body").delegate("#zace-edite", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-time"), "ID", DATABasic_Flow);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！");
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！");
                    return;
                }

                var DEFAULT_VALUE_Device_timeEdite = {
                    Type: SelectData[0].Type,
                    OperatorAuthor: SelectData[0].OperatorAuthor,
                };
                $("body").append($com.modal.show(DEFAULT_VALUE_Device_timeEdite, KEYWORD_Device_time, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].OperatorAuthor = Number(rst.OperatorAuthor);
                    SelectData[0].Type = Number(rst.Type);
                    flowID = SelectData[0].FlowID;

                    $com.util.deleteLowerProperty(SelectData[0]);
                    model.com.postUpdate({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refreshflow(flowID);
                    });

                }, TypeSource_Device_time));


            });

            //删除节点
            $("body").delegate("#zace-Device-trash", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-time"), "ID", DataAll_Flow);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！");
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！");
                    return;
                }
                $com.util.deleteLowerProperty(SelectData[0]);
                flowID = SelectData[0].FlowID;
                model.com.postDelete({
                    data: SelectData[0],
                }, function (res) {
                    alert("删除成功");
                    model.com.refreshflow(flowID);
                });
            });
        },


        run: function () {
            model.com.getItem({
                ModelID: 1, ID: -1,
            }, function (resItem) {
                if (!resItem)
                    return;
                if (resItem && resItem.list) {
                    var Item = $com.util.Clone(resItem.list);
                    BYItem = $com.util.Clone(resItem.list);
                    DATABasic = $com.util.Clone(resItem.list);

                    $.each(DATABasic, function (i, item) {
                        TypeSource_Device_time.FlowName.push({
                            name: item.FunctionName,
                            value: item.ID,
                            far: 0,
                        });
                    });

                    $.each(Item, function (i, item) {
                        for (var p in item) {
                            if (!FORMATTRT_Device_item[p])
                                continue;
                            item[p] = FORMATTRT_Device_item[p](item[p]);
                        }
                    });
                    DataAll = $com.util.Clone(Item);
                    $("#femi-Device-tbody-item").html($com.util.template(Item, HTML.TableNode_item));
                }

            });
            // WDataItem_user = [];
            // WDataItem_Department = [];
            // WDataItem_Position = [];
            WDataItem_All = [];
            model.com.getUser({}, function (res1) {
                for (var i = 0; i < res1.list.length; i++) {
                    if (res1.list[i].Active == 1) {
                        res1.list[i].Type = 3;
                        WDataItem_All.push(res1.list[i]);
                    }
                }
                model.com.getDepartment({}, function (res2) {
                    for (var j = 0; j < res2.list.length; j++) {
                        res2.list[j].Type = 1;
                        WDataItem_All.push(res2.list[j]);
                    }
                    model.com.getPosition({}, function (res3) {
                        for (var k = 0; k < res3.list.length; k++) {
                            res3.list[k].Type = 2;
                            WDataItem_All.push(res3.list[k]);
                        }
                        $.each(WDataItem_All, function (i, item) {
                            TypeSource_Device_time.OperatorAuthor.push({
                                name: item.Name,
                                value: item.ID,
                                far: item.Type,
                            });
                        });
                        // console.log(TypeSource_Device_time.OperatorAuthor);
                    });
                });
            });

        },

        com: {
            refresh: function (modelID) {
                model.com.getItem({
                    ModelID: modelID, ID: -1,
                }, function (resItem) {
                    if (!resItem)
                        return;
                    if (resItem && resItem.list) {
                        var Item = $com.util.Clone(resItem.list);
                        BYItem = $com.util.Clone(resItem.list);
                        DATABasic = $com.util.Clone(resItem.list);
                        $.each(Item, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Device_item[p])
                                    continue;
                                item[p] = FORMATTRT_Device_item[p](item[p]);
                            }
                        });
                        DataAll = $com.util.Clone(Item);

                        $("#femi-Device-tbody-item").html($com.util.template(Item, HTML.TableNode_item));
                    }

                });
            },
            refreshflow: function (flowID) {
                model.com.getFlow({
                    FlowID: flowID, ID: -1,
                }, function (res) {
                    if (!res)
                        return;
                    if (res && res.list) {
                        var ItemFlow = $com.util.Clone(res.list);
                        FlowItem = $com.util.Clone(res.list);
                        DATABasic_Flow = $com.util.Clone(res.list);
                        $.each(FlowItem, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Device_time[p])
                                    continue;
                                item[p] = FORMATTRT_Device_time[p](item[p]);
                            }
                        });
                        DataAll_Flow = $com.util.Clone(FlowItem);
                        for (var i = 0; i < FlowItem.length; i++) {
                            for (var j = 0; j < DataAll.length; j++) {
                                if (FlowItem[i].FlowID == DataAll[j].ID) {
                                    FlowItem[i].FlowName = DataAll[j].FunctionName;
                                }
                            }
                        }
                        $("#femi-Device-tbody-time").html($com.util.template(FlowItem, HTML.TableNode_time));
                    }

                });
            },
            //查询所有节点信息
            getItem: function (data, fn, context) {
                var d = {
                    $URI: "/FPRFeature/All",
                    $TYPE: "Get",
                    $SERVER: "/MESNCR",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //条件查询
            getFlow: function (data, fn, context) {
                var d = {
                    $URI: "/FPRAuthor/All",
                    $TYPE: "Get",
                    $SERVER: "/MESNCR",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //新增或者跟新
            postUpdate: function (data, fn, context) {
                var d = {
                    $URI: "/FPRAuthor/Update",
                    $TYPE: "Post",
                    $SERVER: "/MESNCR",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //删除权限项
            postDelete: function (data, fn, context) {
                var d = {
                    $URI: "/FPRAuthor/Delete",
                    $TYPE: "Post",
                    $SERVER: "/MESNCR",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getUser: function (data, fn, context) {
                var d = {
                    $URI: "/User/All",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getDepartment: function (data, fn, context) {
                var d = {
                    $URI: "/Department/AllDepartment",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            getPosition: function (data, fn, context) {
                var d = {
                    $URI: "/Department/AllPosition",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
        },
    }),

        model.init();

});