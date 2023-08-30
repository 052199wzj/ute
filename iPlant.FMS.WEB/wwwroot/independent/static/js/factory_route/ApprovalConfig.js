require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/jquery.treeview'], function ($zace, $com) {

    var KEYWORD_Level_LIST,
        KEYWORD_Level,
        FORMATTRT_Level,
        DEFAULT_VALUE_Level,
        TypeSource_Level,
        model,
        mConfigVersion,
        DATABasicFlow,
        DataAll,
        DATABasic,
        VersionNo,
        newDATABasic,
        newArrayParent,
        ConfigAllArray,
        ModuleID,
        DataAllFactorySearch,

        HTML = {
            TreeItemNode: [
                '<li class="range-role-li" >',
                '<span style="">{{EventModuleName}}</span> ',
                '<ul>{{Items}}</ul>',
                '</li> ',

            ].join(""),
            TreeItemNodeItem: [
                '<li class="range-role-li" data-valueIndex={{Index}} id="mVersionNo">',
                '<span style="background-color:{{Color}};"  data-value={{EventModule}}>{{VersionNo}}</span> ',
                '<ul>{{Items}}</ul>',
                '</li> ',
            ].join(""),
            TableMode: [
                '<tr>',
                '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
                '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
                '<td data-title="EventModuleName" data-value="{{EventModuleName}}" >{{EventModuleName}}</td>',
                // '<td data-title="FunctionName" data-value="{{FunctionName}}" >{{FunctionName}}</td>',
                '<td data-title="VersionNo" data-value="{{VersionNo}}" >{{VersionNo}}</td>',
                '<td data-title="OrderID" data-value="{{OrderID}}" >{{OrderID}}</td>',
                '<td data-title="CreatorName" data-value="{{CreatorName}}" >{{CreatorName}}</td>',
                '<td data-title="EditorName" data-value="{{EditorName}}" >{{EditorName}}</td>',
                '<td data-title="EditTime" data-value="{{EditTime}}" >{{EditTime}}</td>',
                '<td data-title="Active" data-value="{{Active}}" >{{Active}}</td>',
                '</tr>',
            ].join(""),
        }
    $(function () {
        KEYWORD_Level_LIST = [
            "ID|编号",
            "Name|审批节点名称",
            "EventModule|事件类型|ArrayOne",
            "FunctionName|权限树名称",
            "VersionNo|版本信息",
            "OrderID|审批顺序",
            "CreatorName|创建人",
            "EditorName|编辑人",
            "EditTime|编辑时刻|DateTime",
            "Active|启用|ArrayOne",
        ];
        KEYWORD_Level = {};
        FORMATTRT_Level = {};

        DEFAULT_VALUE_Level = {
            Name: "",
            EventModule: 0,
            VersionNo: "",
            // OrderID: 0,
        };

        TypeSource_Level = {
            Active: [
                {
                    name: "默认",
                    value: 0
                },
                {
                    name: "启用",
                    value: 1
                }, {
                    name: "禁用",
                    value: 2
                }
            ],
            EventModule: [
                {
                    name: "无",
                    value: 0
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
        name: '审批配置',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            //启用
            $("body").delegate("#zace-active-level", "click", function () {
                // var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DATABasic);

                // if (!SelectData || !SelectData.length) {
                //     alert("请先选择一行数据再试！")
                //     return;
                // }
                // for (var i = 0; i < SelectData.length; i++) {

                //     $com.util.deleteLowerProperty(SelectData[i]);
                // }
                model.com.postactive({
                    VersionNo: VersionNo,
                    ModuleID: ModuleID,
                    Active: 1,
                }, function (res) {
                    alert("启用成功");
                    model.com.refresh(ModuleID, VersionNo);
                    model.com.getConfigVersion({
                        ModuleID: 0
                    }, function (resVersion) {
                        model.com.renderTree(resVersion.list);
                    });
                })

            });
            //禁用
            $("body").delegate("#zace-disable-level", "click", function () {
                // var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DATABasic);

                // if (!SelectData || !SelectData.length) {
                //     alert("请先选择一行数据再试！")
                //     return;
                // }
                // for (var i = 0; i < SelectData.length; i++) {

                //     $com.util.deleteLowerProperty(SelectData[i]);
                // }
                model.com.postactive({
                    VersionNo: VersionNo,
                    ModuleID: ModuleID,
                    Active: 2,
                }, function (res) {
                    alert("禁用成功");
                    model.com.refresh(ModuleID, VersionNo);
                    model.com.getConfigVersion({
                        ModuleID: 0
                    }, function (resVersion) {
                        model.com.renderTree(resVersion.list);
                    });
                })

            });

            //新增
            $("body").delegate("#zace-add-level", "click", function () {
                // OrderID = 0;
                // if (DATABasic.length == 0) {
                //     OrderID = 1;
                // } else {
                //     OrderID = Math.max.apply(Math, this.DATABasic.map(item => {
                //         return item.OrderID
                //     })) + 1;
                // }

                $("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    var ItemTemp = {
                        ID: 0,
                        Name: rst.Name,
                        EventModule: Number(rst.EventModule),
                        FunctionID: 0,
                        VersionNo: rst.VersionNo,
                        CreatorID: 0,
                        EditorID: 0,
                        OrderID: DATABasic.length + 1,
                        Active: 1,
                        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                        // AuditActions: [{
                        //     ID:1,
                        //     TaskID:26,
                        //     EventModule:1005,
                        //     ConfigID:1,
                        //     AuditorID:1,
                        //     Result:1,
                        //     Remark:"hah",
                        //     AuditorTime:$com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                        // }],
                    };

                    for (var m = 0; m < ConfigAllArray.length; m++) {
                        if (ConfigAllArray[m].VersionNo == rst.VersionNo && ConfigAllArray[m].EventModule == Number(rst.EventModule) && ConfigAllArray[m].Name == rst.Name) {
                            alert("新增重复！");
                            return false;
                        }
                    }

                    model.com.postConfig({
                        data: ItemTemp,
                    }, function (res) {
                        alert("新增成功");
                        $com.util.deleteLowerProperty(res.info);
                        VersionNo = res.info.VersionNo;
                        ModuleID = res.info.EventModule;
                        model.com.refresh(res.info.EventModule, res.info.VersionNo);
                        model.com.getConfigVersion({
                            ModuleID: 0
                        }, function (resVersion) {
                            model.com.renderTree(resVersion.list);
                        });
                    })

                }, TypeSource_Level));


            });

            //修改
            $("body").delegate("#zace-edit-level", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DATABasic);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                if (SelectData[0].Active == 1 || SelectData[0].Active == 2) {
                    alert("该状态下禁止修改！");
                    return false;
                }
                var DEFAULT_VALUE_Device_timeEdite = {
                    Name: SelectData[0].Name,
                    // EventModule: SelectData[0].EventModule,
                    // VersionNo: SelectData[0].VersionNo,
                    // OrderID: SelectData[0].OrderID,
                }
                $("body").append($com.modal.show(DEFAULT_VALUE_Device_timeEdite, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].Name = rst.Name;
                    // SelectData[0].EventModule = Number(rst.EventModule);
                    // SelectData[0].VersionNo = rst.VersionNo;
                    SelectData[0].EditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date());
                    $com.util.deleteLowerProperty(SelectData[0]);
                    model.com.postConfig({
                        data: SelectData[0]
                    }, function (res) {
                        alert("修改成功");
                        $com.util.deleteLowerProperty(res.info);
                        VersionNo = res.info.VersionNo;
                        ModuleID = res.info.EventModule;
                        model.com.refresh(res.info.EventModule, res.info.VersionNo);
                        model.com.getConfigVersion({
                            ModuleID: 0
                        }, function (resVersion) {
                            model.com.renderTree(resVersion.list);
                        });
                    })

                }, TypeSource_Level));


            });
            //查询
            $("body").delegate("#zace-searchZall-level", "click", function () {
                var default_value = {
                    FlowType: 0,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    // default_value.Active = eval(rst.Active.toLowerCase());
                    default_value.FlowType = Number(rst.FlowType);
                    DataAllList = [];
                    for (var i = 0; i < DataAll.length; i++) {
                        if (DataAll[i].FlowType == default_value.FlowType) {
                            DataAllList.push(DataAll[i]);
                        }
                    }
                    $com.table.filterByConndition($("#femi-riskLevel-tbody"), DataAllList, default_value, "ID");

                }, TypeSource_Level));
            });
            //Enter触发模糊查询事件
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var value = $("#zace-search-level").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-riskLevel-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DATABasic, value, "ID");
                }
            });
            // 查询
            $("body").delegate("#zace-Device-search", "click", function () {
                var value = $("#zace-search-level").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "ID");
            });
            //删除
            $("body").delegate("#zace-delete", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DATABasic);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData[0].Active == 1 || SelectData[0].Active == 2) {
                    alert("该状态下禁止删除！");
                    return false;
                }
                $com.util.deleteLowerProperty(SelectData[0]);
                model.com.postDelete({
                    data: SelectData[0],
                    VersionNo: SelectData[0].VersionNo,
                }, function (res) {
                    alert("删除成功");
                    model.com.refresh(ModuleID, VersionNo);
                    model.com.getConfigVersion({
                        ModuleID: 0
                    }, function (resVersion) {
                        model.com.renderTree(resVersion.list);
                    });
                })
            });

            //另存版本
            $("body").delegate("#zace-othersave", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DATABasic);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }

                var DEFAULT_VALUE_Device_timeEdite = {
                    Name: SelectData[0].Name,
                    EventModule: SelectData[0].EventModule,
                    VersionNo: SelectData[0].VersionNo,
                    // OrderID: SelectData[0].OrderID,
                }
                $("body").append($com.modal.show(DEFAULT_VALUE_Device_timeEdite, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    // for (var m = 0; m < newArrayParent.length; m++) {
                    //     for (var n = 0; n < newArrayParent[m].Items.length; n++) {
                    //         if (newArrayParent[m].Items[n].VersionNo == rst.VersionNo && newArrayParent[m].Items[n].EventModule == Number(rst.EventModule) && newArrayParent[m].Items[n].Name == rst.Name) {
                    //             alert("另存版本重复！");
                    //             return false;
                    //         }
                    //     }
                    // }
                    SelectData[0].Name = rst.Name;
                    SelectData[0].EventModule = Number(rst.EventModule);
                    SelectData[0].VersionNo = rst.VersionNo;
                    SelectData[0].OrderID = 1;
                    $com.util.deleteLowerProperty(SelectData[0]);
                    model.com.postOtherSave({
                        data: SelectData,
                        ModuleID: SelectData[0].EventModule,
                        VersionNo: SelectData[0].VersionNo,
                    }, function (res) {
                        alert("另存成功！");
                        $com.util.deleteLowerProperty(res.list[0]);
                        VersionNo = res.list[0].VersionNo;
                        ModuleID = res.list[0].EventModule;
                        model.com.refresh(res.list[0].EventModule, res.list[0].VersionNo);
                        model.com.getConfigVersion({
                            ModuleID: 0
                        }, function (resVersion) {
                            model.com.renderTree(resVersion.list);
                        });
                    })

                }, TypeSource_Level));


            });
            //上移
            $("body").delegate("#zace-aotu-upZ", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DATABasic);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！")
                    return;
                }

                if (SelectData[0].OrderID == 1) {
                    alert("已在第一行！");
                    return false;
                }
                SelectData[0].OrderID -= 1;
                var upData = model.com.getDataOne(SelectData[0].OrderID);
                upData[0].OrderID += 1;

                $com.util.deleteLowerProperty(SelectData[0]);
                $com.util.deleteLowerProperty(upData[0]);
                model.com.postConfig({
                    data: SelectData[0],
                }, function (res) {

                    model.com.postConfig({
                        data: upData[0],
                    }, function (res1) {
                        model.com.refresh(ModuleID, VersionNo);
                    })

                })



            });


            //下移
            $("body").delegate("#zace-aotu-downZ", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DATABasic);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！")
                    return;
                }
                if (SelectData[0].OrderID == DATABasic.length) {
                    alert("已在最后一行！");
                    return false;
                }

                SelectData[0].OrderID += 1;
                var upData = model.com.getDataOne(SelectData[0].OrderID);
                upData[0].OrderID -= 1;
                $com.util.deleteLowerProperty(SelectData[0]);
                $com.util.deleteLowerProperty(upData[0]);
                model.com.postConfig({
                    data: SelectData[0],
                }, function (res) {

                    model.com.postConfig({
                        data: upData[0],
                    }, function (res1) {
                        model.com.refresh(ModuleID, VersionNo);

                    })

                })

            });
            //点击数查看版本信息
            $("body").delegate("#roleTree li ul li", "click", function () {
                var $this = $(this),
                    mID = Number($this.attr("data-valueIndex"));
                wantArray = [];
                for (var m = 0; m < newArrayParent.length; m++) {
                    for (var n = 0; n < newArrayParent[m].Items.length; n++) {
                        if (newArrayParent[m].Items[n].Index == mID) {
                            wantArray.push(newArrayParent[m].Items[n]);
                        }
                    }
                }
                VersionNo = wantArray[0].VersionNo;
                ModuleID = wantArray[0].EventModule;
                if (VersionNo != "") {
                    model.com.refresh(ModuleID, VersionNo);
                } else {
                    alert("未查到数据！");
                    mConfigAll = [];
                    $("#femi-riskLevel-tbody").html($com.util.template(mConfigAll, HTML.TableMode));
                    return false;
                }


            });
            //双击流程列表
            // $("body").delegate("#femi-riskLevel-tbody tr", "dblclick", function () {
            //     var $this = $(this);
            //     wID = Number($this.find('td[data-title=ID]').attr('data-value'));
            //     $("#Config").hide();
            //     $("#ConfigTree").hide();
            //     $("#ConfigAction").show();
            // });
            // $("body").delegate("#zace-back", "click", function () {
            //     $("#Config").show();
            //     $("#ConfigTree").show();
            //     $("#ConfigAction").hide();
            // });
        },




        run: function () {
            model.com.getConfigAll({
                ModuleID: -1,
                Name: "",
                VersionNo: "",
                Active: -1,
                FunctionID: -1,
            }, function (res2) {
                ConfigAllArray = res2.list;
            });

            model.com.getConfigVersion({
                ModuleID: 0
            }, function (resVersion) {
                model.com.renderTree(resVersion.list);
                VersionNo = newArrayParent[0].Items[0].VersionNo;
                ModuleID = newArrayParent[0].Items[0].EventModule;
                model.com.getConfigAll({
                    ModuleID: newArrayParent[0].Items[0].EventModule,
                    Name: "",
                    VersionNo: newArrayParent[0].Items[0].VersionNo,
                    Active: -1,
                    FunctionID: -1,
                }, function (restConfigAll) {
                    $(".configTitle").text(restConfigAll.list[0].EventModuleName + "审批配置");
                    var mConfigAll = restConfigAll.list;
                    DATABasic = $com.util.Clone(restConfigAll.list);
                    newDATABasic = $com.util.Clone(restConfigAll.list);
                    model.com.getAll({
                        module: 400003
                    }, function (resAll) {
                        mConfigVersion = resAll.list;
                        $.each(mConfigVersion, function (i, item) {
                            TypeSource_Level.EventModule.push({
                                name: item.ItemText,
                                value: item.ID,
                            })
                        });
                        $.each(mConfigAll, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }
                        });
                        // mDataAll=$com.util.Clone(mConfigAll);
                        $("#femi-riskLevel-tbody").html($com.util.template(mConfigAll, HTML.TableMode));
                    });

                });
            });
        },

        com: {
            refresh: function (ModuleID, VersionNo) {
                model.com.getConfigAll({
                    ModuleID: -1,
                    Name: "",
                    VersionNo: "",
                    Active: -1,
                    FunctionID: -1,
                }, function (res2) {
                    ConfigAllArray = res2.list;
                });
                model.com.getConfigAll({
                    ModuleID: ModuleID,
                    Name: "",
                    VersionNo: VersionNo,
                    Active: -1,
                    FunctionID: -1,
                }, function (restConfigAll) {
                    $(".configTitle").text(restConfigAll.list[0].EventModuleName + "审批配置");
                    var mConfigAll = restConfigAll.list;
                    DATABasic = $com.util.Clone(restConfigAll.list);
                    newDATABasic = $com.util.Clone(restConfigAll.list);
                    mConfigAll = model.com.evlabc(mConfigAll);
                    $.each(mConfigAll, function (i, item) {
                        for (var p in item) {
                            if (!FORMATTRT_Level[p])
                                continue;
                            item[p] = FORMATTRT_Level[p](item[p]);
                        }
                    });
                    // mDataAll=$com.util.Clone(mConfigAll);
                    $("#femi-riskLevel-tbody").html($com.util.template(mConfigAll, HTML.TableMode));
                });
            },
            renderTree: function (list) {
                ArraySon = $com.util.Clone(list);
                ArrayParent = list;
                ArrayParent = removalArray(list);
                Index = 0;
                for (var i = 0; i < ArrayParent.length; i++) {
                    ArrayParent[i].Items = [];
                    for (var k = 0; k < ArraySon.length; k++) {
                        if (ArrayParent[i].EventModule == ArraySon[k].EventModule) {
                            ArraySon[k].Index = Index + 1;
                            if (ArraySon[k].Active == 0) {
                                ArraySon[k].Color = "gray";
                            }
                            if (ArraySon[k].Active == 1) {
                                ArraySon[k].Color = "green";
                            }
                            if (ArraySon[k].Active == 2) {
                                ArraySon[k].Color = "orange";
                            }
                            ArrayParent[i].Items.push(ArraySon[k]);
                            Index++;
                        }
                    }
                }
                newArrayParent = $com.util.Clone(ArrayParent);
                for (var i = 0; i < ArrayParent.length; i++) {
                    if (ArrayParent[i].Items && ArrayParent[i].Items.length > 0) {
                        if (ArrayParent[i].VersionNo != "") {
                            ArrayParent[i].Items = $com.util.template(ArrayParent[i].Items, HTML.TreeItemNodeItem);
                        } else {
                            ArrayParent[i].Items = [];
                            ArrayParent[i].Items = $com.util.template(ArrayParent[i].Items, HTML.TreeItemNodeItem);
                        }

                    }
                }
                $("#roleTree").html($com.util.template(ArrayParent, HTML.TreeItemNode));
                $("#roleTree").treeview();

                function removalArray(arr) {
                    len = arr.length;
                    for (i = 0; i < len; i++) {
                        for (j = i + 1; j < len; j++) {
                            if (arr[i].EventModule == arr[j].EventModule) {
                                arr.splice(j, 1);
                                len--;
                                j--;
                            }
                        }
                    }
                    return arr;
                };
            },
            evlabc: function (a) {//排序大小
                var i = j = t = 0;
                for (i = 0; i < a.length; i++) {
                    for (j = 0; j < a.length; j++) {
                        if (a[i].OrderID < a[j].OrderID) {
                            t = a[i];
                            a[i] = a[j];
                            a[j] = t;
                        }
                    }
                }
                return a;
            },
            getDataOne: function (Order) {
                var _list = [];
                for (var index = 0; index < newDATABasic.length; index++) {
                    if (Order == newDATABasic[index].OrderID) {
                        _list.push(newDATABasic[index]);
                    }

                }
                return _list;

            },
            //查看作业类型
            getAll: function (data, fn, context) {
                var d = {
                    $URI: "/MESEnum/All",
                    $TYPE: "get",
                    $SERVER: "/MESCore"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getConfigAll: function (data, fn, context) {
                var d = {
                    $URI: "/BFCAudit/ConfigAll",
                    $TYPE: "get",
                    $SERVER: "/MESCore"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getConfigVersion: function (data, fn, context) {
                var d = {
                    $URI: "/BFCAudit/ConfigVersion",
                    $TYPE: "get",
                    $SERVER: "/MESCore"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //新增或者修改
            postConfig: function (data, fn, context) {
                var d = {
                    $URI: "/BFCAudit/UpdateConfig",
                    $TYPE: "Post",
                    $SERVER: "/MESCore"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //启用
            postactive: function (data, fn, context) {
                var d = {
                    $URI: "/BFCAudit/ActiveConfig",
                    $TYPE: "Post",
                    $SERVER: "/MESCore"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //删除
            postDelete: function (data, fn, context) {
                var d = {
                    $URI: "/BFCAudit/DeleteConfig",
                    $TYPE: "Post",
                    $SERVER: "/MESCore"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //保存其他配置
            postOtherSave: function (data, fn, context) {
                var d = {
                    $URI: "/BFCAudit/OtherSaveConfig",
                    $TYPE: "Post",
                    $SERVER: "/MESCore"
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