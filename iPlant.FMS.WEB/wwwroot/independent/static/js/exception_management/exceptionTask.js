require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'],
    function ($lin, $com) {

        var HTML,

            //查询时间
            StartTime,
            EndTime,
            //编码集合
            CodeList,
            //异常地点集合
            EXCStationSource,
            EXCStationList,
            //异常类型
            EXCTypeSource,
            EXCTypeList,
            //全局ID
            StationPointID,
            //人员信息
            UserAll,
            //类型
            Defaul_Value_Type,
            KETWROD_LIST_Type,
            KETWROD_Type,
            Formattrt_Type,
            TypeSource_Type,
            //规则
            Defaul_Value_Search,
            KETWROD_LIST_Search,
            KETWROD_Search,
            Formattrt_Search,
            TypeSource_Search,
            partSource;

        HTML = {
            EXCTaskList: [
                '<tr data-color="">',
                '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></th>',
                '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
                '<td style="min-width: 60px" data-title="StationNo" data-value="{{StationNo}}">{{StationNo}}</td>',
                '<td style="min-width: 60px" data-title="StationTypeName" data-value="{{StationTypeName}}">{{ StationTypeName}}</td>',
                '<td style="min-width: 50px" data-title="ExceptionTypeName" data-value="{{ExceptionTypeName}}" >{{ ExceptionTypeName}}</td>',
                // '<td style="min-width: 50px" data-title="ReportTimes" data-value="{{ReportTimes}}" >{{ ReportTimes}}</td>',
                // '<td style="min-width: 50px" data-title="ForwardTimes" data-value="{{ForwardTimes}}" >{{ ForwardTimes}}</td>',
                '<td style="min-width: 50px" data-title="RespondLevel" data-value="{{RespondLevel}}" >{{ RespondLevel}}</td>',
                '<td style="min-width: 50px" data-title="DisplayBoard" data-value="{{DisplayBoard}}" >{{ DisplayBoard}}</td>',
                '<td style="min-width: 50px" data-title="OnSite" data-value="{{OnSite}}" >{{ OnSite}}</td>',
                '<td style="min-width: 80px" data-title="Comment" data-value="{{Comment}}" >{{ Comment}}</td>',
                '<td style="min-width: 50px" data-title="ApplicantTime" data-value="{{ApplicantTime}}" >{{ ApplicantTime}}</td>',
                '<td style="min-width: 60px" data-title="ApplicantID" data-value="{{ApplicantID}}">{{ApplicantID}}</td>',
                '<td style="min-width: 60px" data-title="ConfirmID" data-value="{{ConfirmID}}">{{ ConfirmID}}</td>',
                '<td style="min-width: 50px" data-title="OperatorID" data-value="{{OperatorID}}" >{{ OperatorID}}</td>',
                '<td style="min-width: 50px" data-title="CreateTime" data-value="{{CreateTime}}" >{{ CreateTime}}</td>',
                '<td style="min-width: 50px" data-title="ExpireTime" data-value="{{ExpireTime}}" >{{ ExpireTime}}</td>',
                '<td style="min-width: 80px" data-title="EditTime" data-value="{{EditTime}}" >{{ EditTime}}</td>',
                '<td style="min-width: 50px" data-title="Status" data-value="{{Status}}" >{{ Status}}</td>',
                '</tr>'
            ].join(""),

            EXCStationTypeList: [
                '<tr data-color="">',
                '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></th>',
                '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
                '<td style="min-width: 80px" data-title="Name" data-value="{{Name}}">{{Name}}</td>',
                '<td style="min-width: 50px" data-title="RelevancyType" data-value="{{RelevancyType}}">{{RelevancyType}}</td>',
                '<td style="min-width: 80px" data-title="CreatorID" data-value="{{CreatorID}}">{{CreatorID}}</td>',
                '<td style="min-width: 50px" data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
                '<td style="min-width: 80px" data-title="EditorID" data-value="{{EditorID}}" >{{EditorID}}</td>',
                '<td style="min-width: 50px" data-title="EditTime" data-value="{{EditTime}}" >{{EditTime}}</td>',
                '<td style="min-width: 50px" data-title="Active" data-value="{{Active}}" >{{ Active}}</td>',
                '</tr>',
            ].join(""),

            MAIN_LIST: ['<li class="list-li">',
                '<div class="list-group-item" data-render="1">',
                    '<div class="list-group-item-cell item-static item-title">',
                        '<span>{{Name}}</span>',
                    '</div>',
                    '<div class="list-group-item-cell item-static" style="width:20%">',
                        '<span>{{State}}</span>',
                    '</div>',
                    '<div class="list-group-item-cell item-control" style="width:12%">',
                        '<a href="javascript:;" class="{{ClassName}}" data-action="{{Action}}" data-id="{{ID}}">操作</a>',
                    '</div>',
                    '<div class="list-group-item-cell item-icon" style="width:7%">',
                        '<i class="icon icon-arrow-right icon-arrow-expand"></i>',
                    '</div>',
                '</div>',
                '<ul class="list-group-sub list-group" style="display:block">{{List}}</ul>',
            '</li>'].join(""),
        };

        //新增异常类型
        Defaul_Value_Type = {
            Name: "",
            RelevancyType: 0,
            Active: 0,
        };
        (function () {

            KETWROD_LIST_Type = [
                "Name|名称",
                "RelevancyType|关联类型|ArrayOne",
                "Active|状态|ArrayOne",
                 "RespondLevel|异常等级|ArrayOne"
            ];

            KETWROD_Type = {};

            Formattrt_Type = {};

            TypeSource_Type = {
                RespondLevel: [
               {
                   name: "A",
                   value: 1
               }, {
                   name: "B",
                   value: 2
               }, {
                   name: "C",
                   value: 3
               }, {
                   name: "D",
                   value: 4
               }
                ],
                RelevancyType: [
                    {
                        name: "默认",
                        value: 0
                    },
                    {
                        name: "事业部",
                        value: 1
                    },
                    {
                        name: "工厂",
                        value: 2
                    },
                    {
                        name: "车间",
                        value: 3
                    },
                    {
                        name: "产线",
                        value: 4
                    },
                    {
                        name: "工位",
                        value: 5
                    },
                    {
                        name: "仓库",
                        value: 6
                    },
                    {
                        name: "仓位",
                        value: 7
                    },
                    {
                        name: "设备",
                        value: 8
                    },
                    {
                        name: "备件",
                        value: 9
                    },
                ],
                Active: [
                    {
                        name: "启用",
                        value: 1
                    },
                    {
                        name: "禁用",
                        value: 0
                    }
                ]
            };

            $.each(KETWROD_LIST_Type, function (i, item) {
                var detail = item.split("|");
                KETWROD_Type[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_Type[detail[0]] = $com.util.getFormatter(TypeSource_Type, detail[0], detail[2]);
                }
            });
        })();

        //异常任务单查询
        Defaul_Value_Search = {
            StartTime: new Date(),
            EndTime: new Date(),
        };
        (function () {

            KETWROD_LIST_Search = [
                "StartTime|开始时间|Date",
                "EndTime|结束时间|Date",
                "DisplayBoard|是否显示|ArrayOne",
                "Status|状态|ArrayOne"
            ];

            KETWROD_Search = {};

            Formattrt_Search = {};

            TypeSource_Search = {
                DisplayBoard: [
                    {
                        name: "是",
                        value: true
                    },
                    {
                        name: "否",
                        value: false
                    },
                ],
                Status: [
                    {
                        name: "默认",
                        value: 0
                    },
                    {
                        name: "待处理",
                        value: 1
                    },
                    {
                        name: "收到待处理",
                        value: 2
                    },
                    {
                        name: "到场待处理",
                        value: 3
                    },
                    {
                        name: "待确认",
                        value: 4
                    },
                    {
                        name: "已转发",
                        value: 5
                    },
                    {
                        name: "已确认",
                        value: 6
                    }, {
                        name: "驳回待处理",
                        value: 7
                    },
                    {
                        name: "超时上报",
                        value: 8
                    },
                    {
                        name: "已撤销",
                        value: 9
                    },

                ]
            };

            $.each(KETWROD_LIST_Search, function (i, item) {
                var detail = item.split("|");
                KETWROD_Search[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_Search[detail[0]] = $com.util.getFormatter(TypeSource_Search, detail[0], detail[2]);
                }
            });
        })();
        model = $com.Model.create({
            name: '异常任务',

            type: $com.Model.MAIN,

            configure: function () {
                this.run();
            },

            events: function () {
                // $("body").delegate(".lmvt-encoding-body tr", "bdclick", function () {
                //     var $this = $(this),
                //         id = Number($this.find("td[data-title=ID]").attr("data-value"));
                //     $.each(EXCStationSource, function (i, item) {
                //         if (id == item.ID) {
                //             model.com.render(item.ApplyID);
                //             return false;
                //         }
                //     });
                // });
                // //双击任务
                //$("body").delegate(".lmvt-Station-body tr", "dblclick", function () {
                //    var $this = $(this),
                //        id = $this.find("td[data-title=ID]").attr("data-value");
                //    $.each(EXCStationSource, function (i, item) {
                //        if (id == item.ID) {
                //            model.com.render(item.ApplyID);
                //            return false;
                //        }
                //    });
                //});
                //处理详情
                $("body").delegate("#lmvt-exception-action", "click", function () {
                    var SelectData = $com.table.getSelectionData($(".lmvt-Station-body"), "ID", EXCStationSource);
                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return;
                    }
                    if (SelectData.length != 1) {
                        alert("只能同时查看一行数据！")
                        return;
                    }



                    $(".lmvt-container-main-exception").css("width", "68%");
                    $(".lmvt-container-main-exception").css("padding-right", "10px");
                    $(".lmvt-container-typt-exception").show();
                    
                    model.com.getEXCCallTaskTree({ TaskID:SelectData[0].ID,TagValue:1,DispatchID:1}, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];
                        if (list) {
                            var data = res.info;

                        }

                    });
                });


                //双击任务
                $("body").delegate("#lmvt-station-type", "click", function () {
                    $(".lmvt-container-main-exception").css("width", "58%");
                    $(".lmvt-container-main-exception").css("padding-right", "10px");
                    $(".lmvt-container-typt-exception").show();

                    model.com.render();
                });

                //查看任务申请单
                $("body").delegate("#lmvt-exception-apply", "click", function () {
                    window.parent.iframeHeaderSet({ header: "异常申请", href: "./device_manage/exceptionApply.html", id: "ExceptionApply", src: "./static/images/menu/basicSet/workingProcess.png" });
                });

                //查询异常任务
                $("body").delegate("#lmvt-task-Search", "click", function () {
                    $("body").append($com.modal.show(Defaul_Value_Search, KETWROD_Search, "查询", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }

                        StartTime = $com.util.format("yyyy-MM-dd", rst.StartTime);
                        EndTime = $com.util.format("yyyy-MM-dd", rst.EndTime);

                        model.com.refresh();

                    }, TypeSource_Search));
                });
                //修改
                $("body").delegate("#lmvt-type-change", "click", function () {

                    var SelectData = $com.table.getSelectionData($(".lmvt-type-body"), "ID", EXCTypeSource);
                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return;
                    }
                    if (SelectData.length != 1) {
                        alert("只能同时对一行数据修改！")
                        return;
                    }
                    var default_value = {
                        Name: SelectData[0].Name,
                        RelevancyType: SelectData[0].RelevancyType,
                        Active: SelectData[0].Active,
                    };
                    $("body").append($com.modal.show(default_value, KETWROD_Type, "修改", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;

                        SelectData[0].Name = rst.Name;
                        SelectData[0].RelevancyType = Number(rst.RelevancyType);
                        SelectData[0].Active = Number(rst.Active);

                        for (var i = 0; i < SelectData.length; i++) {
                            $com.util.deleteLowerProperty(SelectData[i]);
                        }
                        model.com.postEXCStationTypeUpdate({
                            data: SelectData[0],
                        }, function (res) {
                            alert("修改成功！！");
                            model.com.render();
                        });

                    }, TypeSource_Type));

                });
                //启用
                $("body").delegate("#lmvt-type-active", "click", function () {

                    var SelectData = $com.table.getSelectionData($(".lmvt-type-body"), "ID", EXCTypeSource);
                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return;
                    }
                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其启用？")) {
                        return;
                    }
                   
                    for (var i = 0; i < SelectData.length; i++) {
                        $com.util.deleteLowerProperty(SelectData[i]);
                    }
                    model.com.postEXCStationTypeActive({
                        data: SelectData,
                        Active: 1
                    }, function (res) {
                        alert("启用成功！！");
                        model.com.render();
                    });
                });
                //冻结
                $("body").delegate("#lmvt-type-stop", "click", function () {

                    var SelectData = $com.table.getSelectionData($(".lmvt-type-body"), "ID", EXCTypeSource);
                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return;
                    }
                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其禁用？")) {
                        return;
                    }
                    for (var i = 0; i < SelectData.length; i++) {
                        $com.util.deleteLowerProperty(SelectData[i]);
                    }

                    model.com.postEXCStationTypeActive({
                        data: SelectData,
                        Active: 0
                    }, function (res) {
                        alert("禁用成功！！");
                        model.com.render();
                    });
                });
                //冻结
                $("body").delegate("#lmvt-type-back", "click", function () {
                    $(".lmvt-container-main-exception").css("width", "100%");
                    $(".lmvt-container-main-exception").css("padding-right", "0px");
                    $(".lmvt-container-typt-exception").hide();
                });
            },
            run: function () {
                model.com.getUserAll({ active: -1 }, function (res) {
                    if (!res)
                        return;
                    var list = res.list,
                        rst = [];
                    if (list) {
                        UserAll = $com.util.Clone(res.list);
                        //model.com.refresh();
                    }

                });
            },
            com: {
                //获取异常申请单
                getEXCCallApplyInfo: function (data, fn, context) {
                    var d = {
                        $URI: "/EXCCallApply/Info",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取异常任务单据 
                getEXCCallTaskAll: function (data, fn, context) {
                    var d = {
                        $URI: "/EXCCallTask/All",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取异常地点类型
                getEXCStationTypeInfo: function (data, fn, context) {
                    var d = {
                        $URI: "/EXCStationType/Info",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取异常地点类型集合
                getEXCStationTypeAll: function (data, fn, context) {
                    var d = {
                        $URI: "/EXCStationType/All",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //人员信息
                getUserAll: function (data, fn, context) {
                    var d = {
                        $URI: "/User/All",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //增加修改
                postEXCStationTypeUpdate: function (data, fn, context) {
                    var d = {
                        $URI: "/EXCStationType/Update",
                        $TYPE: "post"
                    };
                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //启用关闭
                postEXCStationTypeActive: function (data, fn, context) {
                    var d = {
                        $URI: "/EXCStationType/Active",
                        $TYPE: "post"
                    };
                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //处理详情
                getEXCCallTaskTree: function (data, fn, context) {
                    var d = {
                        $URI: "/EXCCallTask/Tree",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                refresh: function () {
                    //任务单据
                    model.com.getEXCCallTaskAll({ ApplyID: -1, StationType: -1, StationName: "", StationID: -1, RespondLevel: -1, DisplayBoard: -1, OnSite: -1, Status: -1, ApplicantID: -1, OperatorID: -1, ConfirmID: -1, ShiftID: -1, StartTime: StartTime, EndTime: EndTime, OAGetType: -1 }, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];
                        if (list) {
                            //CodeSource = res.list
                            EXCStationSource = $com.util.Clone(res.list);
                            //CodeList = res.list;
                            EXCStationList = $com.util.Clone(res.list);
                            $.each(EXCStationList, function (i, item) {
                                for (var p in item) {
                                    if (!Formattrt_Search[p])
                                        continue;
                                    item[p] = Formattrt_Search[p](item[p]);
                                }
                                item.ApplicantID = model.com.GetUser(item.ApplicantID);
                                item.ConfirmID = model.com.GetUser(item.ConfirmID);
                                item.OperatorID = model.com.GetUser(item.OperatorID);

                                item.ApplicantTime = $com.util.format("yyyy-MM-dd hh:mm:ss", item.ApplicantTime);
                                item.ConfirmTime = $com.util.format("yyyy-MM-dd hh:mm:ss", item.ConfirmTime);
                                item.OperatorTime = $com.util.format("yyyy-MM-dd hh:mm:ss", item.OperatorTime);
                            });
                            $(".lmvt-Station-body").html($com.util.template(EXCStationList, HTML.EXCTaskList));
                            $(".lmvt-Station-body tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);



                            });
                        }

                    });

                },

                render: function (ID) {

                    $(".lmvt-container-main-exception").css("width", "58%");
                    $(".lmvt-container-main-exception").css("padding-right", "10px");
                    $(".lmvt-container-typt-exception").show();

                    model.com.getEXCCallApplyInfo({ ID: ID }, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];
                        if (list) {
                            $com.propertyGrid.show($(".lmvt-property"), res.info, KEYWORD_condition, TypeSource_condition);
                        }
                    });
                },

                GetUser: function (id) {
                    var name;
                    $.each(UserAll, function (i, itme) {
                        if (id == itme.ID) {
                            name = itme.Name;
                            return name;
                        }
                    });
                    return name;
                },
            },


        });
        model.init();
    });