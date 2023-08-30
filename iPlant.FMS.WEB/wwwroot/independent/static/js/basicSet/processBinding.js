require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'],
    function ($lin, $com) {

        var HTML,
            PartList_Basic_Son,
            ID,
            AllPartList_Position,
            temp,
            item_array,
            PositionList_Basic,
            PartList_Basic,
            Arrange_Basic,
            MessageGrade_Basic,
            PartList,
            res_Position_Basic,
            Arrange_Basic_List,
            Source_MessageGrade,

            TypeSource,

            DEFAULT_VALUE_MessageType,
            KETWROD_LIST_MessageType,
            KETWROD_Template_MessageType,
            Formattrt_MessageType,
            TypeSource_MessageType,

            DEFAULT_VALUE_Process,
            KETWROD_LIST_Process,
            KETWROD_Template_Process,
            Formattrt_Process,
            TypeSource_Process,

            DEFAULT_VALUE_Arrange,
            KETWROD_LIST_Arrange,
            KETWROD_Template_Arrange,
            Formattrt_Arrange,
            TypeSource_Arrange,

            DEFAULT_VALUE_MessageGrade,
            KETWROD_LIST_MessageGrade,
            KETWROD_Template_MessageGrade,
            Formattrt_MessageGrade,
            TypeSource_MessageGrade,

            HeadersPosition;

        HeadersPosition = {
            "8001": "操作员",
            "1001": "生产员",
            "5001": "巡检员",
            "5002": "入库检验员",
            "6001": "工艺员",
            "7001": "配料员",
            "2001": "电修工",
            "3001": "机修工",
            "4001": "计量算",
            "7002": "收料员",
            "7004": "辅料员",
        };

        Arrange_Basic_List = [];
        item_array = {};

        TypeSource = {
            WorkShopID: [
                {
                    name: "无",
                    value: 0,
                },

            ],
            LineID: [
                {
                    name: "无",
                    value: 0,
                },
            ],
            PartID: [
                {
                    name: "无",
                    value: 0,
                },
            ],
        };

        HTML = {

            PartList: [
                '<tr>',
                '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></th>',
                '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
                '<td style="min-width: 150px" data-title="WorkShopName" data-value="{{WorkShopName}}" >{{WorkShopName}}</td>',
                '<td style="min-width: 150px" data-title="LineName" data-value="{{LineName}}" >{{LineName}}</td>',
                '<td style="min-width: 150px" data-title="PartPointName" data-value="{{PartPointName}}" >{{PartPointName}}</td>',
                '<td style="min-width: 50px" data-title="Module_8001" data-value="{{Module_8001}}" >{{ Module_8001}}</td>',
                '<td style="min-width: 50px" data-title="Module_1001" data-value="{{Module_1001}}" >{{ Module_1001}}</td>',
                '<td style="min-width: 50px" data-title="Module_5001" data-value="{{Module_5001}}" >{{ Module_5001}}</td>',
                '<td style="min-width: 50px" data-title="Module_5002" data-value="{{Module_5002}}" >{{ Module_5002}}</td>',
                '<td style="min-width: 50px" data-title="Module_6001" data-value="{{Module_6001}}" >{{ Module_6001}}</td>',
                '<td style="min-width: 50px" data-title="Module_7001" data-value="{{Module_7001}}" >{{ Module_7001}}</td>',
                '<td style="min-width: 50px" data-title="Module_2001" data-value="{{Module_2001}}" >{{ Module_2001}}</td>',
                '<td style="min-width: 50px" data-title="Module_3001" data-value="{{Module_3001}}" >{{ Module_3001}}</td>',
                '<td style="min-width: 50px" data-title="Module_4001" data-value="{{Module_4001}}" >{{ Module_4001}}</td>',
                '<td style="min-width: 50px" data-title="Module_7002" data-value="{{Module_7002}}" >{{ Module_7002}}</td>',
                '<td style="min-width: 50px" data-title="Module_7004" data-value="{{Module_7004}}" >{{ Module_7004 }}</td>',
                '<tr>',
            ].join(""),

            ArrangeList: [
                '<tr>',
                '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></th>',
                '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
                '<td style="min-width: 50px" data-title="PositionName" data-value="{{PositionName}}" >{{ PositionName}}</td>',
                '<td style="min-width: 50px" data-title="Module_8001" data-value="{{Module_8001}}" >{{ Module_8001}}</td>',
                '<td style="min-width: 50px" data-title="Module_1001" data-value="{{Module_1001}}" >{{ Module_1001}}</td>',
                '<td style="min-width: 50px" data-title="Module_5001" data-value="{{Module_5001}}" >{{ Module_5001}}</td>',
                '<td style="min-width: 50px" data-title="Module_5002" data-value="{{Module_5002}}" >{{ Module_5002}}</td>',
                '<td style="min-width: 50px" data-title="Module_6001" data-value="{{Module_6001}}" >{{ Module_6001}}</td>',
                '<td style="min-width: 50px" data-title="Module_7001" data-value="{{Module_7001}}" >{{ Module_7001}}</td>',
                '<td style="min-width: 50px" data-title="Module_2001" data-value="{{Module_2001}}" >{{ Module_2001}}</td>',
                '<td style="min-width: 50px" data-title="Module_3001" data-value="{{Module_3001}}" >{{ Module_3001}}</td>',
                '<td style="min-width: 50px" data-title="Module_4001" data-value="{{Module_4001}}" >{{ Module_4001}}</td>',
                '<td style="min-width: 50px" data-title="Module_7002" data-value="{{Module_7002}}" >{{ Module_7002}}</td>',
                '<td style="min-width: 50px" data-title="Module_7004" data-value="{{Module_7004}}" >{{ Module_7004 }}</td>',
                '<tr>',
            ].join(""),

            MessageTypeList: [
                '<tr>',
                '<td style="width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></td>',
                '<td style="width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td>',
                '<td style="width: 150px" data-title="GradeID" data-value="{{GradeID}}">{{GradeID}}</td>',
                '<td style="width: 150px" data-title="Text" data-value="{{Text}}">{{Text}}</td>',
                '<td style="width: 150px" data-title="ModuleID" data-value="{{ModuleID}}">{{ModuleID}}</td>',
                '<td style="width: 200px" data-title="Operator" data-value="{{Operator}}">{{Operator}}</td>',
                '<td style="width: 200px" data-title="EditTime" data-value="{{EditTime}}">{{EditTime}}</td>',
                '</tr>',
            ].join(""),

            MessageGradeList: [
                '<tr>',
                '<td style="width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></td>',
                '<td style="width: 70px" data-title="ID" data-value="{{ID}}">{{ID}}</td>',
                '<td style="width: 70px" data-title="Grade" data-value="{{Grade}}">{{Grade}}</td>',
                '<td style="width: 150px" data-title="Text" data-value="{{Text}}">{{Text}}</td>',
                '<td style="width: 150px" data-title="Ignore" data-value="{{Ignore}}">{{Ignore}}</td>',
                '<td style="width: 150px" data-title="ModuleID" data-value="{{ModuleID}}">{{ModuleID}}</td>',
                '<td style="width: 150px" data-title="Operator" data-value="{{Operator}}">{{Operator}}</td>',
                '<td style="width: 200px" data-title="EditTime" data-value="{{EditTime}}">{{EditTime}}</td>',
                '</tr>',
            ].join(""),
        };

        //任务排班
        DEFAULT_VALUE_Arrange = {
            PositionDuty: "",
            MaxTasks: 0,
        };
        (function () {

            KETWROD_LIST_Arrange = [
                "PositionDuty|岗位职责|ArrayOne",
                "MaxTasks|最大任务量",
            ];

            KETWROD_Template_Arrange = {};

            Formattrt_Arrange = {};

            TypeSource_Arrange = {
                PositionDuty: [
                    {
                        name: "全部",
                        value: 0,
                    },
                    {
                        name: "操作员",
                        value: 8001,
                    },
                    {
                        name: "生产员",
                        value: 1001,
                    },
                    {
                        name: "巡检员",
                        value: 5001,
                    },
                    {
                        name: "入库检验员",
                        value: 5002,
                    },
                    {
                        name: "工艺员",
                        value: 6001,
                    },
                    {
                        name: "配料员",
                        value: 7001,
                    },
                    {
                        name: "电修员",
                        value: 2001,
                    },
                    {
                        name: "计量员",
                        value: 4001,
                    },
                    {
                        name: "收料员",
                        value: 7002,
                    },
                    {
                        name: "辅料员",
                        value: 7004,
                    },
                ],
            };

            $.each(KETWROD_LIST_Arrange, function (i, item) {
                var detail = item.split("|");
                KETWROD_Template_Arrange[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined,
                };

                if (detail.length > 2) {
                    Formattrt_Arrange[detail[0]] = $com.util.getFormatter(TypeSource_Arrange, detail[0], detail[2]);
                }
            });
        })();

        //工序绑定
        DEFAULT_VALUE_Process = {
            PositionDuty: "",
            DepartmentID: "",
            Position: "",
        };
        (function () {
            KETWROD_LIST_Process = [
                "PositionDuty|岗位职责|ArrayOne",
                "DepartmentID|部门|ArrayOneControl",
                "Position|岗位|ArrayOneControl|DepartmentID",
            ];
            KETWROD_Template_Process = {};

            Formattrt_Process = {};

            TypeSource_Process = {
                PositionDuty: [
                    {
                        name: "全部",
                        value: 0,
                    },
                    {
                        name: "操作员",
                        value: 8001,
                    },
                    {
                        name: "生产员",
                        value: 1001,
                    },
                    {
                        name: "巡检员",
                        value: 5001,
                    },
                    {
                        name: "入库检验员",
                        value: 5002,
                    },
                    {
                        name: "工艺员",
                        value: 6001,
                    },
                    {
                        name: "配料员",
                        value: 7001,
                    },
                    {
                        name: "电修员",
                        value: 2001,
                    },
                    {
                        name: "计量员",
                        value: 4001,
                    },
                    {
                        name: "收料员",
                        value: 7002,
                    },
                    {
                        name: "辅料员",
                        value: 7004,
                    },
                ],
                DepartmentID: [{
                    name: "无",
                    value: 0,
                }],
                Position: [{
                    name: "无",
                    value: 0,
                    far: 0,
                }],
            };

            $.each(KETWROD_LIST_Process, function (i, item) {
                var detail = item.split("|");
                KETWROD_Template_Process[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined,
                };

                if (detail.length > 2) {
                    Formattrt_Process[detail[0]] = $com.util.getFormatter(TypeSource_Process, detail[0], detail[2]);
                }
            });
        })();

        //消息类型
        DEFAULT_VALUE_MessageType = {
            ModuleID: "",
            GradeID: 0,
            Text: "",
        };
        (function () {
            KETWROD_LIST_MessageType = [
                "ModuleID|消息类型|ArrayOneControl",
                "GradeID|等级|ArrayOneControl|ModuleID",
                "Text|名称",
            ];

            KETWROD_Template_MessageType = {};

            Formattrt_MessageType = {};

            TypeSource_MessageType = {
                ModuleID: [
                    {
                        name: "系统消息",
                        value: 0,
                    },
                    {
                        name: "排班消息",
                        value: 1,
                    },
                    {
                        name: "生产计划消息",
                        value: 2,
                    },
                    {
                        name: "生产计划通知",
                        value: 3,
                    },

                ],
                GradeID: [
                    {
                        name: "无",
                        value: 0,
                        far: 0,
                    },
                ],

            };

            $.each(KETWROD_LIST_MessageType, function (i, item) {
                var detail = item.split("|");
                KETWROD_Template_MessageType[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined,
                };

                if (detail.length > 2) {
                    Formattrt_MessageType[detail[0]] = $com.util.getFormatter(TypeSource_MessageType, detail[0], detail[2]);
                }
            });
        })();

        //消息等级
        DEFAULT_VALUE_MessageGrade = {
            Text: "",
            Ignore: false,
            ModuleID: "",
        };
        (function () {
            KETWROD_LIST_MessageGrade = [
                "Grade|等级",
                "Text|名称",
                "Ignore|是否可忽略|ArrayOne",
                "ModuleID|消息类型|ArrayOne",
            ];

            KETWROD_Template_MessageGrade = {};

            Formattrt_MessageGrade = {};

            TypeSource_MessageGrade = {

                Ignore: [
                    {
                        name: "是",
                        value: true,
                    },
                    {
                        name: "否",
                        value: false,
                    },
                ],
                ModuleID: [
                    {
                        name: "系统消息",
                        value: 0,
                    },
                    {
                        name: "排班消息",
                        value: 1,
                    },
                    {
                        name: "生产计划消息",
                        value: 2,
                    },
                    {
                        name: "生产计划通知",
                        value: 3,
                    },
                ],
            };

            $.each(KETWROD_LIST_MessageGrade, function (i, item) {
                var detail = item.split("|");
                KETWROD_Template_MessageGrade[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined,
                };

                if (detail.length > 2) {
                    Formattrt_MessageGrade[detail[0]] = $com.util.getFormatter(TypeSource_MessageGrade, detail[0], detail[2]);
                }
            });
        })();

        model = $com.Model.create({
            name: '工序绑定',

            type: $com.Model.MAIN,

            configure: function () {
                this.run();
            },

            events: function () {

                //显示排班限制
                $("body").delegate("#lmvt-arrange", "click", function () {

                    $(".lmvt-container-message-body").hide();

                    $(".lmvt-container-process-body").hide();

                    $(".lmvt-container-arrange-body").show();

                    $(".changeName").text("排班限制");
                });
                //显示工序绑定
                $("body").delegate("#lmvt-process", "click", function () {
                    $(".lmvt-container-message-body").hide();

                    $(".lmvt-container-process-body").show();

                    $(".lmvt-container-arrange-body").hide();

                    $(".changeName").text("工序绑定");
                });
                //显示消息设置
                $("body").delegate("#lmvt-message", "click", function () {

                    $(".lmvt-container-process-body").hide();

                    $(".lmvt-container-message-body").show();

                    $(".lmvt-container-arrange-body").hide();

                    $(".changeName").text("排班限制");
                });

                //导出排班表
                $("body").delegate("#lmvt-output-arrange", "click", function () {

                    var $table = $(".arrange_table"),
                        fileName = "排班.xls",
                        Title = "排班";
                    var params = $com.table.getExportParams($table, fileName, Title);

                    model.com.postExportExcel(params, function (res) {
                        var src = res.info.path;
                        window.open(src);
                    });
                });
                //导出工序表
                $("body").delegate("#lmvt-output-process", "click", function () {

                    var $table = $(".process_table"),
                        fileName = "工序.xls",
                        Title = "工序";
                    var params = $com.table.getExportParams($table, fileName, Title);

                    model.com.postExportExcel(params, function (res) {
                        var src = res.info.path;
                        window.open(src);
                    });
                });

                //修改工序表
                $("body").delegate("#lmvt-change-process", "click", function () {

                    var SelectData = $com.table.getSelectionData($(".lmvt-process-body"), "ID", PartList_Basic_Son);
                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！");
                        return;
                    }

                    $("body").append($com.modal.show(DEFAULT_VALUE_Process, KETWROD_Template_Process, "修改", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;

                        rst.PositionDuty = Number(rst.PositionDuty);
                        rst.Position = Number(rst.Position);

                        var _data = model.com.getProcessData(res_Position_Basic, SelectData, rst);

                        model.com.postPositionSave({
                            Module: rst.PositionDuty,
                            data: _data,
                        }, function (res) {
                            alert("修改成功！！");

                            model.com.refresh();
                        });

                    }, TypeSource_Process));
                });
                //修改时间表
                $("body").delegate("#lmvt-change-arrange", "click", function () {


                    var SelectData = $com.table.getSelectionData($(".lmvt-arrange-body"), "ID", Arrange_Basic_List);
                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！");
                        return;
                    }

                    $("body").append($com.modal.show(DEFAULT_VALUE_Arrange, KETWROD_Template_Arrange, "修改", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;

                        rst.MaxTasks = Number(rst.MaxTasks);

                        var _data = model.com.getArrangeData(Arrange_Basic, SelectData, rst);

                        model.com.postScheduleLimitSave({
                            data: _data,
                        }, function (res) {
                            alert("修改成功！！");

                            model.com.refresh();
                        });

                    }, TypeSource_Arrange));

                });
                ////新增排班任务
                //$("body").delegate("#lmvt-add-arrange", "click", function () {

                //    $("body").append($com.modal.show(DEFAULT_VALUE_MessageType, KETWROD_Template_MessageType, "新增", function (rst) {
                //        //调用修改函数
                //        if (!rst || $.isEmptyObject(rst))
                //            return;

                //        var _data = {
                //            ID: 0,
                //            Text: rst.Text,
                //            GradeID: rst.GradeID,
                //            Operator: window.parent.User_Info.Name,
                //            EditTime: new Date(),
                //        };

                //        MessageType_Basic.push(_data);

                //        model.com.postTypeSave({
                //            data: MessageType_Basic
                //        }, function (res) {
                //            alert("新增成功！！");

                //            model.com.refresh();
                //        });

                //    }, TypeSource_MessageType));

                //});
                //新增类型
                $("body").delegate("#lmvt-message-type-add", "click", function () {

                    $("body").append($com.modal.show(DEFAULT_VALUE_MessageType, KETWROD_Template_MessageType, "新增", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;

                        rst.GradeID = Number(rst.GradeID);


                        var _data = {
                            ID: model.com.GetMaxID(MessageType_Basic_source),
                            Text: rst.Text,
                            ModuleID: rst.ModuleID,
                            GradeID: rst.GradeID,
                            Operator: window.parent.User_Info.Name,
                            EditTime: new Date(),
                        };

                        MessageType_Basic_source.push(_data);

                        model.com.postTypeSave({
                            data: MessageType_Basic_source,
                        }, function (res) {
                            alert("新增成功！！");


                            model.com.refresh();
                        });

                    }, TypeSource_MessageType));

                });
                //新增等级
                $("body").delegate("#lmvt-message-grade-add", "click", function () {

                    $("body").append($com.modal.show(DEFAULT_VALUE_MessageGrade, KETWROD_Template_MessageGrade, "新增", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;

                        rst.GradeID = Number(rst.GradeID);


                        var _data = {
                            ID: model.com.GetMaxID(Source_MessageGrade),
                            Grade: model.com.GetMaxID(Source_MessageGrade),
                            Text: rst.Text,
                            Ignore: rst.Ignore,
                            ModuleID: rst.ModuleID,
                            Operator: window.parent.User_Info.Name,
                            EditTime: new Date(),
                        };


                        Source_MessageGrade.push(_data);

                        model.com.postGradeSave({
                            data: Source_MessageGrade,
                        }, function (res) {
                            alert("新增成功！！");

                            model.com.refresh();
                        });

                    }, TypeSource_MessageGrade));

                });
                //模糊查询
                $("body").delegate("#femi-search-text-ledger", "change", function () {
                    var $this = $(this),
                        value = $(this).val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $(".lmvt-process-body").children("tr").show();
                    else
                        $com.table.filterByLikeString($(".lmvt-process-body"), PartList_Basic_Son, value, "ID");
                });
                //精准查询
                $("body").delegate("#lmvt-search-process", "click", function () {
                    var default_value = {
                            WorkShopID: 0,
                            LineID: 0,
                            PartID: 0,
                        },
                        KEYWORD = [
                            "WorkShopID|车间|ArrayOne",
                            "LineID|产线|ArrayOne",
                            "PartID|工序|ArrayOne",
                        ];


                    $("body").append($com.modal.show(default_value, KEYWORD, "查询", function (rst) {


                        if (!rst || $.isEmptyObject(rst))
                            return;

                        default_value.DepartmentID = Number(rst.DepartmentID);
                        default_value.Position = Number(rst.Position);
                        $com.table.filterByConndition($("#femi-user-tbody"), DataAll, default_value, "ID");

                    }, TypeSource));


                });
            },
            run: function () {
                model.com.refresh();
            },
            com: {
                //导出
                getExportExcel: function (data, fn, context) {
                    var d = {
                        $URI: "/Upload/ExportExcel",
                        $TYPE: "post",
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
                //工序
                getConfigAll: function (data, fn, context) {
                    var d = {
                        $URI: "/APSLine/ConfigAll",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //车间产线
                getWorkShop: function (data, fn, context) {
                    var d = {
                        $URI: "/WorkShop/All",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                getPositionAll: function (data, fn, context) {
                    var d = {
                        $URI: "/ApsPositionLimit/PositionAll",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                getScheduleLimitAll: function (data, fn, context) {
                    var d = {
                        $URI: "/ApsPositionLimit/ScheduleLimitAll",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                getTypeAll: function (data, fn, context) {
                    var d = {
                        $URI: "/ApsMessageManager/TypeAll",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                getGradeAll: function (data, fn, context) {
                    var d = {
                        $URI: "/ApsMessageManager/GradeAll",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                postPositionSave: function (data, fn, context) {
                    var d = {
                        $URI: "/ApsPositionLimit/PositionSave",
                        $TYPE: "post",
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                postExportExcel: function (data, fn, context) {
                    var d = {
                        $URI: "/Upload/ExportExcel",
                        $TYPE: "post",
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                postScheduleLimitSave: function (data, fn, context) {
                    var d = {
                        $URI: "/ApsPositionLimit/ScheduleLimitSave",
                        $TYPE: "post",
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                postTypeSave: function (data, fn, context) {
                    var d = {
                        $URI: "/ApsMessageManager/TypeSave",
                        $TYPE: "post",
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                postGradeSave: function (data, fn, context) {
                    var d = {
                        $URI: "/ApsMessageManager/GradeSave",
                        $TYPE: "post",
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                refresh: function () {
                    //得到部门
                    model.com.getDepartment({}, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];
                        if (list) {
                            rst = model.com.utils.getSon(list);
                        }

                        if (TypeSource_Process.DepartmentID.length > 1)
                            TypeSource_Process.DepartmentID.splice(1, TypeSource_Process.DepartmentID.length - 1);
                        TypeSource_Process.DepartmentID = TypeSource_Process.DepartmentID.concat(model.com.utils.getSource(rst));


                    });
                    //得到岗位
                    model.com.getPosition({}, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];
                        if (list) {
                            rst = model.com.utils.getSon(list);
                        }

                        if (TypeSource_Process.Position.length > 1)
                            TypeSource_Process.Position.splice(1, TypeSource_Process.Position.length - 1);
                        TypeSource_Process.Position = TypeSource_Process.Position.concat(model.com.utils.getSource(rst));
                    });
                    //工序绑定
                    model.com.getConfigAll({}, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];
                        if (res && res.list) {


                            PartList_Basic = res.list;
                            //工序列表
                            PartList_Basic_Son = model.com.getConactList(res.list);


                            PartList_Basic_Son = $com.util.Clone(PartList_Basic_Son);

                            $.each(PartList_Basic_Son, function (i, item) {


                                TypeSource.WorkShopID.push({
                                    name: item.WorkShopName,
                                    value: item.WorkShopID,
                                });


                                TypeSource.LineID.push({
                                    name: item.LineName,
                                    value: item.LineID,
                                });

                                TypeSource.PartID.push({
                                    name: item.PartName,
                                    value: item.PartID,
                                });

                            });

                            model.com.getPositionAll({WorkShopID: 0, LineID: 0, Module: 0}, function (res_position) {

                                res_Position_Basic = res_position;

                                $.each(res_position.list, function (i, item) {
                                    if (!item_array[item.PartPoint.WorkShopID])
                                        item_array[item.PartPoint.WorkShopID] = {};
                                    if (!item_array[item.PartPoint.WorkShopID][item.PartPoint.LineID])
                                        item_array[item.PartPoint.WorkShopID][item.PartPoint.LineID] = {};

                                    if (!item_array[item.PartPoint.WorkShopID][item.PartPoint.LineID][item.PartPoint.PartPointID])
                                        item_array[item.PartPoint.WorkShopID][item.PartPoint.LineID][item.PartPoint.PartPointID] = {};


                                    item_array[item.PartPoint.WorkShopID][item.PartPoint.LineID][item.PartPoint.PartPointID][item.ModuleID] = item.FMPositionID;

                                });

                                $.each(PartList_Basic_Son, function (i, item) {

                                    item.ID = i + 1;

                                    if (!item_array[item.WorkShopID])
                                        item_array[item.WorkShopID] = {};
                                    if (!item_array[item.WorkShopID][item.LineID])
                                        item_array[item.WorkShopID][item.LineID] = {};

                                    if (!item_array[item.WorkShopID][item.LineID][item.PartPointID])
                                        item_array[item.WorkShopID][item.LineID][item.PartPointID] = {};


                                    for (var p in HeadersPosition) {
                                        if (item_array[item.WorkShopID][item.LineID][item.PartPointID][p] == 0 || item_array[item.WorkShopID][item.LineID][item.PartPointID][p] == 412002)
                                            item_array[item.WorkShopID][item.LineID][item.PartPointID][p] = "";
                                        for (var i = 0; i < TypeSource_Process.Position.length; i++) {
                                            while (item_array[item.WorkShopID][item.LineID][item.PartPointID][p] == TypeSource_Process.Position[i].value) {
                                                item_array[item.WorkShopID][item.LineID][item.PartPointID][p] = TypeSource_Process.Position[i].name;
                                            }

                                        }

                                        item["Module_" + p] = item_array[item.WorkShopID][item.LineID][item.PartPointID][p];
                                    }


                                });

                                $(".lmvt-process-body").html($com.util.template(PartList_Basic_Son, HTML.PartList));
                            });

                        }

                    });
                    //排版限制
                    model.com.getScheduleLimitAll({WorkShopID: 0}, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];
                        if (res && res.list) {

                            Arrange_Basic = res.list;

                            Arrange_Basic = $com.util.Clone(Arrange_Basic);

                            $.each(Arrange_Basic, function (i, item) {

                                if (item.ModuleID == 1001)
                                    item["Module_" + 1001] = item.MaxTasks;
                                if (item.ModuleID == 2001)
                                    item["Module_" + 2001] = item.MaxTasks;
                                if (item.ModuleID == 3001)
                                    item["Module_" + 3001] = item.MaxTasks;
                                if (item.ModuleID == 4001)
                                    item["Module_" + 4001] = item.MaxTasks;
                                if (item.ModuleID == 5001)
                                    item["Module_" + 5001] = item.MaxTasks;
                                if (item.ModuleID == 5002)
                                    item["Module_" + 5002] = item.MaxTasks;
                                if (item.ModuleID == 6001)
                                    item["Module_" + 6001] = item.MaxTasks;
                                if (item.ModuleID == 7001)
                                    item["Module_" + 7001] = item.MaxTasks;
                                if (item.ModuleID == 7002)
                                    item["Module_" + 7002] = item.MaxTasks;
                                if (item.ModuleID == 7004)
                                    item["Module_" + 7004] = item.MaxTasks;
                                if (item.ModuleID == 8001)
                                    item["Module_" + 8001] = item.MaxTasks;

                            });
                        }

                        for (var i = 0; i < Arrange_Basic.length / 11; i++) {

                            for (var j = 0; j < 11; j++) {
                                if (j + 1 <= 11) {
                                    Arrange_Basic_List[i] = $.extend(Arrange_Basic_List[i], Arrange_Basic[j + 11 * i]);
                                    Arrange_Basic_List[i].ID = i + 1;
                                }
                            }
                        }


                        $(".lmvt-arrange-body").html($com.util.template(Arrange_Basic_List, HTML.ArrangeList));
                    });
                    //消息等级设置
                    model.com.getGradeAll({}, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];
                        if (list) {
                            MessageGrade_Basic = res.list;

                            Source_MessageGrade = res.list;

                            MessageGrade_Basic = $com.util.Clone(MessageGrade_Basic);

                            $.each(MessageGrade_Basic, function (i, item) {
                                if (item.Ignore == false)
                                    item.Ignore = "是";
                                if (item.Ignore == true)
                                    item.Ignore = "否";
                                if (item.ModuleID == 0)
                                    item.ModuleID = "系统消息";
                                if (item.ModuleID == 1)
                                    item.ModuleID = "排班消息";
                                if (item.ModuleID == 2)
                                    item.ModuleID = "生产计划消息";
                                if (item.ModuleID == 3)
                                    item.ModuleID = "生产计划通知";
                            });

                        }
                        $(".lmvt-message-grade-body").html($com.util.template(MessageGrade_Basic, HTML.MessageGradeList));

                        $.each(Source_MessageGrade, function (i, item) {

                            TypeSource_MessageType.GradeID.push({
                                name: item.Text,
                                value: item.Grade,
                                far: item.ModuleID,
                            });

                        });

                    });
                    //消息类型设置
                    model.com.getTypeAll({}, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];
                        if (res && res.list) {

                            MessageType_Basic = res.list;

                            MessageType_Basic_source = res.list;

                            MessageType_Basic = $com.util.Clone(MessageType_Basic);


                            $.each(MessageType_Basic, function (i, item) {

                                if (item.ModuleID == 0)
                                    item.ModuleID = "系统消息";
                                if (item.ModuleID == 1)
                                    item.ModuleID = "排班消息";
                                if (item.ModuleID == 2)
                                    item.ModuleID = "生产计划消息";
                                if (item.ModuleID == 3)
                                    item.ModuleID = "生产计划通知";
                            });

                        }
                        $(".lmvt-message-type-body").html($com.util.template(MessageType_Basic, HTML.MessageTypeList));
                    });
                },

                utils: {
                    getSon: function (list) {
                        var _rst = [];
                        $.each(list, function (i, item) {
                            _rst.push(item);
                            if (item.SonList) {
                                var _arr = model.com.utils.getSon(item.SonList);
                                _rst = _rst.concat(_arr);
                            }

                        });
                        return _rst;
                    },
                    getSource: function (list) {
                        var _rst = [];
                        $.each(list, function (i, item) {
                            if (item.Active)
                                _rst.push({
                                    far: item.DepartmentID,
                                    value: item.ID,
                                    name: item.Name,
                                });
                        });
                        return _rst;
                    },
                },

                getConactList: function (list) {
                    var _rst = [];
                    var _arr = [];
                    var _act = [];
                    $.each(list, function (i, item) {

                        _arr = item.PartPointList;
                        if (_arr && _arr.length > 0)
                            _rst = _rst.concat(_arr);

                        if (!item.PartList || item.PartList.length < 1)
                            return true;

                        $.each(item.PartList, function (j, otherItem) {

                            _act = otherItem.PartPointList;

                            if (_act && _act.length > 0)
                                _rst = _rst.concat(_act);

                        });
                    });
                    return _rst;
                },

                getProcessData: function (list, data, cat) {
                    var rst = [];
                    for (var i = 0; i < list.list.length; i++) {
                        var item_i = list.list[i];
                        for (var j = 0; j < data.length; j++) {
                            var item = data[j];

                            if (item_i.PartPoint.WorkShopID != item.WorkShopID
                                || item_i.PartPoint.PartID != item.PartID
                                || item_i.PartPoint.PartPointID != item.PartPointID
                                || item_i.PartPoint.LineID != item.LineID)

                                continue;

                            if (cat.PositionDuty == 0 || item_i.ModuleID == cat.PositionDuty) {

                                item_i.FMPositionID = cat.Position;
                                rst.push(item_i);
                                break;
                            }

                        }
                    }
                    return rst;
                },

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

                getArrangeData: function (list, data, cat) {

                    $.each(list, function (i, item) {
                        for (var j = 0; j < data.length; j++) {

                            var item_j = data[j];

                            if (item.PositionID == item_j.PositionID) {
                                if (item.ModuleID == cat.PositionDuty || cat.PositionDuty == 0) {

                                    item.MaxTasks = cat.MaxTasks;

                                }
                            }


                        }

                    });
                    return list;
                },

                getSon: function (list) {
                    var _rst = list;
                    $.each(list, function (i, item) {

                        _arr = item.PartPoint;
                        _rst = _rst.concat(_arr);

                    });
                    return _rst;
                },
                //转换
                Formate: function (list) {

                    if (list == 412004)
                        list = "粗细磨";
                    return list;
                },


            },
        });
        model.init();
    });