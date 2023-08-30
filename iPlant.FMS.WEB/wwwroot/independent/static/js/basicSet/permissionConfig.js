require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/jquery.treeview'], function ($zace, $com) {

    var KEYWORD_Level_LIST,
        KEYWORD_Level,
        FORMATTRT_Level,
        DEFAULT_VALUE_Level,
        TypeSource_Level,
        model,
        DATABasicFlow,
        DataAll,
        DATABasic,
        DataAllFactorySearch,

        HTML = {
            TreeItemNode: [
                '<li class="range-role-li  {{Type}}" >',
                '<span style="vertical-align:top;"><input type="checkbox" class="femi-tree-checkbox" style="margin: 1px 0px 1px"  value="{{FunctionID}}"  />{{Text}}</span> ',
                '<ul>{{Items}}</ul>',
                '</li> ',

            ].join(""),
            TableMode: [
                '<tr>',
                '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
                '<td data-title="FlowType" data-value="{{FlowType}}" >{{FlowType}}</td>',
                '<td data-title="StepEnum" data-value="{{StepEnum}}" >{{StepEnum}}</td>',
                '<td data-title="StepOrder" data-value="{{StepOrder}}" >{{StepOrder}}</td>',
                '<td data-title="RoleName" data-value="{{RoleName}}" >{{RoleName}}</td>',
                '<td data-title="Active" data-value="{{Active}}" >{{Active}}</td>',
                '</tr>',
            ].join(""),

        };
    $(function () {
        KEYWORD_Level_LIST = [
            "ID|编号",
            "FlowType|流程名称|ArrayOne",
            "StepEnum|步骤名称|ArrayOneControl|FlowType",
            "StepOrder|步骤顺序",
            "StepType|步骤类型",
            "RoleName|权限名称",
            "Active|激活|ArrayOne",
        ];
        KEYWORD_Level = {};
        FORMATTRT_Level = {};

        DEFAULT_VALUE_Level = {
            FlowType: 0,
            StepEnum: 0,
            StepOrder: 0,
            StepType: 0,
        };

        TypeSource_Level = {
            Active: [
                {
                    name: "激活",
                    value: true,
                }, {
                    name: "禁用",
                    value: false,
                },
            ],
            FlowType: [
                {
                    name: "无",
                    value: 0,
                },
            ],
            StepEnum: [
                {
                    name: "无",
                    value: 0,
                },
                {
                    name: "发起申请",
                    value: 1,
                }, {
                    name: "接收方工区审批",
                    value: 2,
                }, {
                    name: "四工区审批",
                    value: 3,
                }, {
                    name: "移车班成员处理",
                    value: 4,
                }, {
                    name: "生产作业人员发起",
                    value: 5,
                }, {
                    name: "工区主管审批",
                    value: 6,
                }, {
                    name: "质检员进行填写",
                    value: 7,
                }, {
                    name: "质量工程师评级",
                    value: 8,
                }, {
                    name: "工艺员填写",
                    value: 9,
                }, {
                    name: "相关部门填写",
                    value: 10,
                }, {
                    name: "质量工程师填写",
                    value: 11,
                }, {
                    name: "质量工程师审批",
                    value: 12,
                }, {
                    name: "质量部长审批",
                    value: 13,
                }, {
                    name: "技术总工程师",
                    value: 14,
                }, {
                    name: "待确认",
                    value: 15,
                }, {
                    name: "检验员发起返修单",
                    value: 16,
                },
                {
                    name: "检验员发起返修项",
                    value: 17,
                },
                {
                    name: "四工区主管分配",
                    value: 18,
                },
                {
                    name: "工区主管处理",
                    value: 19,
                },
                {
                    name: "班组长已分配",
                    value: 20,
                },
                {
                    name: "班组成员已完工",
                    value: 21,
                },
                {
                    name: "班组长已确认",
                    value: 22,
                },
                {
                    name: "检验员已确认",
                    value: 23,
                },
                {
                    name: "检验员上传照片",
                    value: 24,
                },
                {
                    name: "检验员确认",
                    value: 25,
                },
                {
                    name: "质检员发起",
                    value: 26,
                },
                {
                    name: "质量工程师发起",
                    value: 27,
                },
            ],
        };

        $.each(KEYWORD_Level_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD_Level[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined,
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
            $("body").delegate("#zace-refresh-po", "click", function () {

                model.com.refresh();


            });
            //流程步骤配置列表
            $("body").delegate("#femi-tree-update", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！");
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！");
                    return;
                }
                list = [];
                $("#roleTree li span input[type=checkbox].femi-tree-checkbox").each(function (i, item) {
                    if (item.checked) {
                        list.push({
                            FunctionID: Number($(item).val()),
                            Text: $(item).parent().text(),
                        });
                    }
                });
                if (list.length == 0 || list.length > 1) {
                    alert("请勾选权限树中的一项！");
                    return false;
                }
                SelectData[0].FlowID = SelectData[0].FlowType;
                SelectData[0].RoleID = list[0].FunctionID;
                SelectData[0].RoleName = list[0].Text;
                $com.util.deleteLowerProperty(SelectData[0]);
                model.com.postStepConfig({
                    data: SelectData[0],
                }, function (res) {
                    alert("权限绑定成功！");
                    model.com.refresh();
                });
            });
            //激活
            $("body").delegate("#zace-active-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！");
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {

                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                model.com.postactive({
                    data: SelectData,
                    Active: 1,
                }, function (res) {
                    alert("激活成功");
                    model.com.refresh();
                });

            });
            //禁用
            $("body").delegate("#zace-disable-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！");
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {

                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                model.com.postactive({
                    data: SelectData,
                    Active: 0,
                }, function (res) {
                    alert("禁用成功");
                    model.com.refresh();


                });

            });

            //新增
            $("body").delegate("#zace-add-level", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    var ItemTemp = {
                        ID: 0,
                        FlowID: Number(rst.FlowType),
                        FlowType: Number(rst.FlowType),
                        // FlowName: "",
                        StepEnum: Number(rst.StepEnum),
                        StepName: "",
                        StepType: Number(rst.StepType),
                        StepOrder: Number(rst.StepOrder),
                        OrderType: 1,
                        Active: 1,
                        CustomList: [],
                        RoleID: 0,
                        RoleName: "",
                        Engineer: 0,
                        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                        NextOrderMap: {},
                    };

                    model.com.postStepConfig({
                        data: ItemTemp,
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                    });

                }, TypeSource_Level));


            });

            //修改流程
            $("body").delegate("#zace-edit-level", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！");
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！");
                    return;
                }

                var DEFAULT_VALUE_Device_timeEdite = {
                    FlowType: SelectData[0].FlowType,
                    StepEnum: SelectData[0].StepEnum,
                    StepOrder: SelectData[0].StepOrder,
                    StepType: SelectData[0].StepType,
                };
                $("body").append($com.modal.show(DEFAULT_VALUE_Device_timeEdite, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].FlowType = Number(rst.FlowType);
                    SelectData[0].StepEnum = Number(rst.StepEnum);
                    SelectData[0].StepOrder = Number(rst.StepOrder);
                    SelectData[0].StepType = Number(rst.StepType);
                    SelectData[0].FlowID = Number(rst.FlowType);
                    $com.util.deleteLowerProperty(SelectData[0]);
                    model.com.postStepConfig({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                    });

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
                        $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "ID");
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

            //取消
            $("body").delegate("#zace-quxiao", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！");
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！");
                    return;
                }
                SelectData[0].RoleID = 0;
                SelectData[0].RoleName = "";
                $com.util.deleteLowerProperty(SelectData[0]);
                model.com.postStepConfig({
                    data: SelectData[0],
                }, function (res) {
                    alert("解除绑定成功");
                    model.com.refresh();
                });

            });
        },


        run: function () {
            model.com.getRoleTree({}, function (res) {
                model.com.renderTree(res.list);
            });
            model.com.getBPMFlowConfig({
                ID: -1, Type: -1, DBType: -1, Engineer: -1, Active: -1,
            }, function (resItem) {
                if (!resItem)
                    return;
                if (resItem && resItem.list) {
                    DATABasicFlow = $com.util.Clone(resItem.list);
                    model.com.getstep({FlowID: -1, FlowType: -1, StepType: -1, Active: -1}, function (resP) {
                        if (!resP)
                            return;
                        if (resP && resP.list) {
                            var Grade = $com.util.Clone(resP.list);
                            DATABasic = $com.util.Clone(resP.list);

                            DataAll = $com.util.Clone(Grade);
                            $.each(DATABasicFlow, function (i, item) {
                                TypeSource_Level.FlowType.push({
                                    name: item.Name,
                                    value: item.ID,
                                });
                            });
                            $.each(Grade, function (i, item) {
                                for (var p in item) {
                                    if (!FORMATTRT_Level[p])
                                        continue;
                                    item[p] = FORMATTRT_Level[p](item[p]);
                                }
                            });
                            DataAllFactorySearch = $com.util.Clone(Grade);
                            $("#femi-riskLevel-tbody").html($com.util.template(Grade, HTML.TableMode));
                        }

                    });
                    window.parent._zaceWorkShop = 1;
                }
            });
        },

        com: {

            refresh: function () {
                model.com.getstep({FlowID: -1, FlowType: -1, StepType: -1, Active: -1}, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var Grade = $com.util.Clone(resP.list);
                        DATABasic = $com.util.Clone(resP.list);
                        DataAll = $com.util.Clone(Grade);
                        $.each(Grade, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }
                        });
                        DataAllFactorySearch = $com.util.Clone(Grade);
                        $("#femi-riskLevel-tbody").html($com.util.template(Grade, HTML.TableMode));
                    }

                });
                window.parent._zaceWorkShop = 1;


            },
            renderTree: function (list) {
                model._treeData = list;
                var _data = FindData(0);
                SetData(_data);

                tempData(_data);

                $("#roleTree").html($com.util.template(_data, HTML.TreeItemNode));

                $("#roleTree").treeview();

                function SetData(_in_data) {
                    $.each(_in_data, function (_in_i, _item) {
                        _item.items = FindData(_item.FunctionID);
                        if (_item.items.length)
                            SetData(_item.items);
                    });

                }

                function FindData(wRoleID) {
                    var _rst_Array = [];
                    $.each(list, function (i, item) {
                        if (wRoleID == item.RoleID) {
                            _rst_Array.push(item);
                        }
                    });
                    return _rst_Array;
                }

                function tempData(_in_data_t) {
                    $.each(_in_data_t, function (_in_i_t, _item_t) {
                        _item_t.Items = '';
                        _item_t.Type = '';
                        if (_item_t.items.length) {
                            tempData(_item_t.items);
                            _item_t.Items = $com.util.template(_item_t.items, HTML.TreeItemNode);
                        }
                    });
                }

            },
            //权限树
            getRoleTree: function (data, fn, context) {
                var d = {
                    $URI: "/Role/Tree",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //条件查询步骤列表
            getstep: function (data, fn, context) {
                var d = {
                    $URI: "/BPMStepConfig/All",
                    $TYPE: "Get",
                    $SERVER: "/MESWDW",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },


            //新增或者修改
            postStepConfig: function (data, fn, context) {
                var d = {
                    $URI: "/BPMStepConfig/Update",
                    $TYPE: "Post",
                    $SERVER: "/MESWDW",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //激活
            postactive: function (data, fn, context) {
                var d = {
                    $URI: "/BPMStepConfig/Active",
                    $TYPE: "Post",
                    $SERVER: "/MESWDW",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询所有配置信息
            getBPMFlowConfig: function (data, fn, context) {
                var d = {
                    $URI: "/BPMFlowConfig/All",
                    $TYPE: "Get",
                    $SERVER: "/MESWDW",
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
        },
    }),

        model.init();


});