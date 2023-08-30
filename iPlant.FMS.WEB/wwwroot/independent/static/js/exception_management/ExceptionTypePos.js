require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($zace, $com) {

    var KEYWORD_Level_LIST,
        KEYWORD_Level,
        FORMATTRT_Level,
        DEFAULT_VALUE_Level,
        TypeSource_Level,
        model,
        DataAll,
        rightListO,
        DATABasic,
        DataAllConfirmBasic,
        DataAllConfirmChange,
        DataAllConfirm,
        DataAllSearch,
        DataAllFactorySearch,
        BusinessUnitID,
        FactoryID,
        WorkShopID,
        TempList,
        DataItem,
        SelectOneID,
        HTML,
        EXCResourseTypes;

    EXCResourseTypes = ["默认", "人工", "系统"];
    SelectOneID = 0;
    WorkShopID = BusinessUnitID = FactoryID = 0;
    DataAll = [];
    DataItem = [];
    DATABasic = [];
    DataAllConfirmBasic = [];
    DataAllConfirmChange = [];
    DataAllConfirm = [];
    DataAllFactorySearch = DataAllSearch = [];
    PositionTemp = {
        Active: 1,
        ID: 0,
        Name: "",
        ExceptionType: 0,
        ExceptionTypeName: "",
        TimeOutList: [],
        RespondLevel: 0,
        ReportTimes: 0,
        EXCTemplate: 0,
        ForwardTimes: 0,
        EXCRequestType: 0,
        EXCResponseType: 0,
        EXCConfirmType: 0,
        CreatorID: 0,
        EditorID: 0,
    };
    TempMode = {
        ID: 0,
        Sign: "",
        Time: 0,
        Responselevel: 0,
    };
    HTML = {
        TableMode: [
            '<tr data-color="">',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',

            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
            '<td data-title="ExceptionType" data-value="{{ExceptionType}}" >{{ExceptionType}}</td>',
            '<td data-title="RespondLevel" data-value="{{RespondLevel}}" >{{RespondLevel}}</td>',
            //'<td data-title="EXCRequestType" data-value="{{EXCRequestType}}" >{{EXCRequestType}}</td>',
            //'<td data-title="EXCResponseType" data-value="{{EXCResponseType}}" >{{EXCResponseType}}</td>',
            //'<td data-title="EXCConfirmType" data-value="{{EXCConfirmType}}" >{{EXCConfirmType}}</td>',
            '<td data-title="ReportTimes" data-value="{{ReportTimes}}" >{{ReportTimes}}</td>',
            '<td data-title="ForwardTimes" data-value="{{ForwardTimes}}" >{{ForwardTimes}}</td>',
            // '<td data-title="Factory" data-value="{{Factory}}" >{{Factory}}</td>',
            '<td data-title="CreatorID" data-value="{{CreatorID}}" >{{CreatorID}}</td>',
            '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
            '<td data-title="EditorID" data-value="{{EditorID}}" >{{EditorID}}</td>',
            '<td data-title="EditTime" data-value="{{EditTime}}" >{{EditTime}}</td>',
            '<td style="min-width: 50px" data-title="Active" data-value="{{Active}}"><span class="badge lmvt-badge {{ClassBadge}}">{{Badge}}</span>{{Active}}</td>',

            '<td style="min-width: 40px" data-title="Handle" data-value="{{ID}}"><div class="row">',
            '<div class="col-md-4 {{ISAllowed}} ">{{ISAllowedText}}</div>',
            '<div class="col-md-4 lmvt-do-info">修改</div>',
            '<div class="col-md-4"><UL id="lmvt-nav">',
            '<LI>更多<UL><LI data-value="{{ID}}" class="zace-add-levelTime">时长设置</LI>',
            // '<LI data-value="{{ID}}" class="lmvt-list">工序集</LI>',
            '</UL></LI></UL></div>',
            '</td>',

            '</tr>',
        ].join(""),
        TableTimeMode: [
            '<tr data-color="">',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="Responselevel" data-value="{{Responselevel}}" >{{Responselevel}}</td>',
            '<td data-title="Sign" data-value="{{Sign}}" >{{Sign}}</td>',
            '<td data-title="Time" data-value="{{Time}}" >{{Time}}</td>',
            '<td  style="display:none" data-title="WID" data-value="{{WID}}" >{{WID}}</td>',

            '<td style="min-width: 40px" data-title="Handle" data-value="{{WID}}"><div class="row">',
            '<div class="col-md-6 lmvt-do-info">修改</div>',
            '<div class="col-md-6 lmvt-allowed-delete">删除</div>',
            '</td>',

            '</tr>',
        ].join(""),


    },
        (function () {
            KEYWORD_Level_LIST = [
                "Name|规则名称",
                "ExceptionType|异常类型|ArrayOne",
                "RespondLevel|异常等级|ArrayOne",
                "EXCTemplate|发起模板",
                "EXCRequestType|发起方类型|ArrayOneControl",
                "EXCResponseType|处理方类型|ArrayOneControl|EXCRequestType",
                "EXCConfirmType|确认方类型|ArrayOneControl|EXCRequestType,EXCResponseType",
                "ReportTimes|上报层级",
                "ForwardTimes|转发次数",
                "Active|启用|ArrayOne",
                "CreatorID|创建者|ArrayOne",
                "EditorID|编辑者|ArrayOne",
                "CreateTime|时间|DateTime",
                "EditTime|时间|DateTime",
                "StatusPro|状态|ArrayOne",
                "Time|时长(分钟)",
                "Responselevel|层级",
            ];
            KEYWORD_Level = {};
            FORMATTRT_Level = {};

            DEFAULT_VALUE_Level = {
                Name: "",
                ExceptionType: 0,
                RespondLevel: 0,
                //FactoryID: 0,                      
                // EXCTemplate: 0,
                //EXCRequestType: 1,
                //EXCResponseType: 1,
                //EXCConfirmType: 1,
                ReportTimes: 0,
                ForwardTimes: 0,
            };

            TypeSource_Level = {
                Active: [
                    {
                        name: "启用",
                        value: 1
                    }, {
                        name: "禁用",
                        value: 0
                    }
                ],
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
                ExceptionType: [],
                EditorID: [],
                CreatorID: [],
                EXCRequestType: [],
                EXCResponseType: [],
                EXCConfirmType: [],
                StatusPro: [
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

                    },
                    {
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
        })();


    model = $com.Model.create({
        name: '岗位',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {

            $("body").delegate("#zace-edit-levelZace", "click", function () {

                model.com.refresh();

            });

            //隐藏
            $("body").delegate("#zace-close-level", "click", function () {

                $(".zzza").css("margin-right", "0px");
                $(".zzzb").css("width", "0px");
                $(".zzzb").hide();

            });
            //异常类型
            $("body").delegate("#lmvt-type", "click", function () {
                window.parent.iframeHeaderSet({ header: "异常类型", href: "./exception_management/ExceptionTypeMag.html", id: "ExceptionTypeMag", src: "./static/images/menu/basicSet/workingProcess.png" });
            });
            //
            $("body").delegate(".zace-add-levelTime", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DataAll.filter((item) => { return item.ID == wID });
                // var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                // if (!SelectData || !SelectData.length) {
                //     alert("请先选择一行数据再试！")
                //     return;
                // }
                // if (SelectData.length != 1) {
                //     alert("只能同时对一行数据操作！")
                //     return;
                // }

                SelectOneID = SelectData[0].ID;
                // $("#femi-riskLevelTime-tbody").html($com.util.template(SelectData[0].TimeOutList, HTML.TableTimeMode));
                $(".zzza").css("margin-right", "400px");
                $(".zzzb").css("width", "400px");
                $(".zzzb").show();

                //渲染时长
                rightListO = {};
                for (var i = 0; i < DataAll.length; i++) {
                    if (SelectOneID == DataAll[i].ID) {
                        rightListO = DataAll[i];
                    }
                }

                if (rightListO.TimeOutList) {

                    for (var i = 0; i < rightListO.TimeOutList.length; i++) {
                        rightListO.TimeOutList[i].WID = 1 + i;
                    }

                    DataItem = $com.util.Clone(rightListO.TimeOutList);


                    $("#femi-riskLevelTime-tbody").html($com.util.template(rightListO.TimeOutList, HTML.TableTimeMode));

                    $("#femi-riskLevelItem-tbody tr").each(function (i, item) {
                        var $this = $(this);
                        var colorName = $this.css("background-color");
                        $this.attr("data-color", colorName);



                    });
                }
            });
            //导出 
            $("body").delegate("#zace-exportApproval-level", "click", function () {
                //var m = 100;
                var $table = $(".table-partApproval"),
                    //fileName = "车间信息" + "(" + m + ")" + ".xls";
                    fileName = "异常规则.xls",
                    Title = "异常规则";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });

            });

            //修改
            $("body").delegate("#zace-edit-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                //if (SelectData[0].Status != 1) {
                //    alert("数据选择有误！")
                //    return;
                //}
                var default_value = {

                    Name: SelectData[0].Name,
                    //ExceptionType:SelectData[0].ExceptionType,
                    RespondLevel: SelectData[0].RespondLevel,
                    //EXCRequestType: SelectData[0].EXCRequestType,
                    //EXCResponseType: SelectData[0].EXCResponseType,
                    //EXCConfirmType: SelectData[0].EXCConfirmType,
                    ReportTimes: SelectData[0].ReportTimes,
                    ForwardTimes: SelectData[0].ForwardTimes,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    //for (var i = 0; i < TempList.length; i++) {
                    //    if (TempList[i].EXCRequestType == Number(rst.EXCRequestType)
                    //        && TempList[i].EXCResponseType == Number(rst.EXCResponseType)
                    //        && TempList[i].EXCConfirmType == Number(rst.EXCConfirmType)) {
                    //        SelectData[0].EXCTemplate = TempList[i].EXCTemplate;
                    //    }
                    //}
                    SelectData[0].Name = rst.Name;
                    SelectData[0].RespondLevel = Number(rst.RespondLevel);
                    //SelectData[0].EXCTemplate = Number(rst.EXCTemplate);
                    //SelectData[0].ExceptionType = Number(rst.ExceptionType);
                    //SelectData[0].ExceptionTypeName = FORMATTRT_Level.ExceptionType(Number(rst.ExceptionType));
                    SelectData[0].ReportTimes = Number(rst.ReportTimes);
                    SelectData[0].ForwardTimes = Number(rst.ForwardTimes);
                    //SelectData[0].TimeOutList[0].Sign = "收到待处理",
                    //SelectData[0].TimeOutList[0].ID = 2;

                    for (var i = 0; i < SelectData.length; i++) {
                        $com.util.deleteLowerProperty(SelectData[i]);
                    }
                    model.com.postRule({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                        //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                        //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));
                    })

                }, TypeSource_Level));
            });

            //修改 单条
            $("body").delegate("#femi-riskLevel-tbody .lmvt-do-info", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DataAll.filter((item) => { return item.ID == wID });

                // var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                // if (!SelectData || !SelectData.length) {
                //     alert("请先选择一行数据再试！")
                //     return;
                // }
                // if (SelectData.length != 1) {
                //     alert("只能同时对一行数据修改！")
                //     return;
                // }
                //if (SelectData[0].Status != 1) {
                //    alert("数据选择有误！")
                //    return;
                //}
                var default_value = {

                    Name: SelectData[0].Name,
                    //ExceptionType:SelectData[0].ExceptionType,
                    RespondLevel: SelectData[0].RespondLevel,
                    //EXCRequestType: SelectData[0].EXCRequestType,
                    //EXCResponseType: SelectData[0].EXCResponseType,
                    //EXCConfirmType: SelectData[0].EXCConfirmType,
                    ReportTimes: SelectData[0].ReportTimes,
                    ForwardTimes: SelectData[0].ForwardTimes,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    //for (var i = 0; i < TempList.length; i++) {
                    //    if (TempList[i].EXCRequestType == Number(rst.EXCRequestType)
                    //        && TempList[i].EXCResponseType == Number(rst.EXCResponseType)
                    //        && TempList[i].EXCConfirmType == Number(rst.EXCConfirmType)) {
                    //        SelectData[0].EXCTemplate = TempList[i].EXCTemplate;
                    //    }
                    //}
                    SelectData[0].Name = rst.Name;
                    SelectData[0].RespondLevel = Number(rst.RespondLevel);
                    //SelectData[0].EXCTemplate = Number(rst.EXCTemplate);
                    //SelectData[0].ExceptionType = Number(rst.ExceptionType);
                    //SelectData[0].ExceptionTypeName = FORMATTRT_Level.ExceptionType(Number(rst.ExceptionType));
                    SelectData[0].ReportTimes = Number(rst.ReportTimes);
                    SelectData[0].ForwardTimes = Number(rst.ForwardTimes);
                    //SelectData[0].TimeOutList[0].Sign = "收到待处理",
                    //SelectData[0].TimeOutList[0].ID = 2;

                    $com.util.deleteLowerProperty(SelectData);

                    model.com.postRule({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                        //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                        //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    })

                }, TypeSource_Level));


            });

            //zace-closeLine-level
            $("body").delegate("#zace-closeLine-level", "click", function () {

                $(".zzzb").hide();
                $(".zzza").css("margin-right", "0px");
                $(".zzzc").css("width", "0px");
                $(".zzzc").hide();

            });
            //启用
            $("body").delegate("#zace-active-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                //if (SelectData[0].Status != 1) {
                //    alert("数据选择有误！")
                //    return;
                //}
                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                model.com.activeRule({
                    data: SelectData,
                    Active: 1,
                }, function (res) {
                    alert("启用成功");
                    model.com.refresh();

                })
            });

            //启用 单条
            $("body").delegate("#femi-riskLevel-tbody .lmvt-do-active", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DataAll.filter((item) => { return item.ID == wID });

                // if (!SelectData || !SelectData.length) {
                //     alert("请先选择一行数据再试！")
                //     return;
                // }
                //if (SelectData[0].Status != 1) {
                //    alert("数据选择有误！")
                //    return;
                //}
                $com.util.deleteLowerProperty(SelectData);

                model.com.activeRule({
                    data: SelectData,
                    Active: 1,
                }, function (res) {
                    alert("启用成功");
                    model.com.refresh();

                })
            });

            //禁用
            $("body").delegate("#zace-disable-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                //if (SelectData[0].Status != 1) {
                //    alert("数据选择有误！")
                //    return;
                //}
                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                model.com.activeRule({
                    data: SelectData,
                    Active: 0,
                }, function (res) {
                    alert("禁用成功");
                    model.com.refresh();
                })

            });
            //禁用 单条
            $("body").delegate("#femi-riskLevel-tbody .lmvt-do-forbidden", "click", function () {
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DataAll.filter((item) => { return item.ID == wID });

                $com.util.deleteLowerProperty(SelectData);

                model.com.activeRule({
                    data: SelectData,
                    Active: 0,
                }, function (res) {
                    alert("禁用成功");
                    model.com.refresh();
                })

            });

            //新增
            $("body").delegate("#zace-add-level", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    for (var i = 0; i < TempList.length; i++) {
                        if (TempList[i].EXCRequestType == 1
                            && TempList[i].EXCResponseType == 1
                            && TempList[i].EXCConfirmType == 1) {
                            PositionTemp.EXCTemplate = TempList[i].EXCTemplate;
                        }
                    }

                    PositionTemp.ExceptionType = Number(rst.ExceptionType);
                    PositionTemp.RespondLevel = Number(rst.RespondLevel);
                    PositionTemp.Name = rst.Name;
                    // PositionTemp.EXCTemplate = Number(rst.EXCTemplate);

                    PositionTemp.ReportTimes = Number(rst.ReportTimes);
                    PositionTemp.ForwardTimes = Number(rst.ForwardTimes);


                    model.com.postRule({
                        data: PositionTemp,
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                    })

                }, TypeSource_Level));


            });
            //新增时长
            $("body").delegate("#zace-addTime-level", "click", function () {
                DEFAULT_VALUE_LevelTime = {
                    StatusPro: 1,
                    Time: 0,
                    Responselevel: 0,

                }
                $("body").append($com.modal.show(DEFAULT_VALUE_LevelTime, KEYWORD_Level, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    var se = [];
                    for (var i = 0; i < DataAll.length; i++) {
                        if (SelectOneID == DataAll[i].ID) {
                            se.push(DataAll[i]);
                        }
                    }
                    for (var i = 0; i < se.length; i++) {
                        $com.util.deleteLowerProperty(se[i]);
                    }
                    for (var m = 0; m < se[0].TimeOutList.length; m++) {
                        if (Number(rst.StatusPro) == se[0].TimeOutList[m].ID && Number(rst.Responselevel) == se[0].TimeOutList[m].Responselevel) {
                            alert("该层状态已添加！")
                            return false;
                        }
                    }
                    var _temp = $com.util.Clone(TempMode);
                    _temp.ID = Number(rst.StatusPro);
                    _temp.Sign = FORMATTRT_Level["StatusPro"](Number(rst.StatusPro));
                    _temp.Time = Number(rst.Time);
                    _temp.Responselevel = Number(rst.Responselevel);
                    se[0].TimeOutList.push(_temp);
                    model.com.postRule({
                        data: se[0],
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();

                    })

                }, TypeSource_Level));


            });
            //zace-editTime-level 修改时长
            $("body").delegate("#zace-editTime-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevelTime-tbody"), "WID", DataItem);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                //if (SelectData[0].Status != 1) {
                //    alert("数据选择有误！")
                //    return;
                //}
                var default_value = {
                    Time: SelectData[0].Time,
                    Responselevel: SelectData[0].Responselevel


                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    SelectData[0].Time = Number(rst.Time);
                    SelectData[0].Responselevel = Number(rst.Responselevel);

                    //// rightListO.TimeOutList = DataItem;
                    // for (var i = 0; i < DataAll.length; i++) {
                    //     if (SelectOneID == DataAll[i].ID) {
                    //         se.push(DataAll[i]);
                    //     }
                    // }

                    // for (var m = 0; m < se[0].TimeOutList.length; m++) {
                    //     if (SelectData[0] == se[0].TimeOutList[m].ID && Number(rst.Responselevel) == se[0].TimeOutList[m].Responselevel) {
                    //         alert("该层状态已添加！")
                    //         return false;
                    //     }
                    // }

                    for (var i = 0; i < SelectData.length; i++) {
                        $com.util.deleteLowerProperty(SelectData[i]);
                    }
                    for (var i = 0; i < rightListO.TimeOutList.length; i++) {
                        rightListO.TimeOutList[i].WID = 1 + i;
                    }

                    rightListO.TimeOutList = $com.util.Clone(DataItem);;

                    for (var i = 0; i < DataItem.length; i++) {
                        DataItem[i].WID = 1 + i;
                    }

                    for (var i = 0; i < rightListO.TimeOutList.length; i++) {
                        $com.util.deleteLowerProperty(rightListO.TimeOutList[i]);
                    }
                    var _list = [];
                    _list.push(rightListO);

                    for (var i = 0; i < _list.length; i++) {
                        $com.util.deleteLowerProperty(_list[i]);
                    }
                    model.com.postRule({
                        data: _list[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                        //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                        //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    })

                }, TypeSource_Level));


            });
            
            //修改时长 单条
            $("body").delegate("#femi-riskLevelTime-tbody .lmvt-do-info", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DataItem.filter((item) => { return item.WID == wID });

                var default_value = {
                    Time: SelectData[0].Time,
                    Responselevel: SelectData[0].Responselevel
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    SelectData[0].Time = Number(rst.Time);
                    SelectData[0].Responselevel = Number(rst.Responselevel);

                    //// rightListO.TimeOutList = DataItem;
                    // for (var i = 0; i < DataAll.length; i++) {
                    //     if (SelectOneID == DataAll[i].ID) {
                    //         se.push(DataAll[i]);
                    //     }
                    // }

                    // for (var m = 0; m < se[0].TimeOutList.length; m++) {
                    //     if (SelectData[0] == se[0].TimeOutList[m].ID && Number(rst.Responselevel) == se[0].TimeOutList[m].Responselevel) {
                    //         alert("该层状态已添加！")
                    //         return false;
                    //     }
                    // }

                    for (var i = 0; i < SelectData.length; i++) {
                        $com.util.deleteLowerProperty(SelectData[i]);
                    }
                    for (var i = 0; i < rightListO.TimeOutList.length; i++) {
                        rightListO.TimeOutList[i].WID = 1 + i;
                    }

                    rightListO.TimeOutList = $com.util.Clone(DataItem);;

                    for (var i = 0; i < DataItem.length; i++) {
                        DataItem[i].WID = 1 + i;
                    }

                    for (var i = 0; i < rightListO.TimeOutList.length; i++) {
                        $com.util.deleteLowerProperty(rightListO.TimeOutList[i]);
                    }
                    var _list = [];
                    _list.push(rightListO);

                    for (var i = 0; i < _list.length; i++) {
                        $com.util.deleteLowerProperty(_list[i]);
                    }
                    model.com.postRule({
                        data: _list[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                        //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                        //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    })

                }, TypeSource_Level));


            });

            $("body").delegate("#zace-searchZall-level", "click", function () {
                var default_value = {
                    BusinessUnitID: 0,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.BusinessUnitID = Number(rst.BusinessUnitID);
                    $com.table.filterByConndition($("#femi-riskLevel-tbody"), DataAll, default_value, "ID");

                }, TypeSource_Level));


            });
            
       
            $("body").delegate("#zace-disableTime-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevelTime-tbody"), "WID", DataItem);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return false;
                }
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {
                    return false;
                }

                DataItem = model.com.getNewList(DataItem, SelectData);

                for (var i = 0; i < DataItem.length; i++) {
                    DataItem[i].WID = 1 + i;
                }

                rightListO.TimeOutList = $com.util.Clone(DataItem);
                for (var i = 0; i < rightListO.TimeOutList.length; i++) {
                    $com.util.deleteLowerProperty(rightListO.TimeOutList[i]);
                }
                $com.util.deleteLowerProperty(rightListO);

                model.com.postRule({
                    data: rightListO,
                }, function (res) {
                    alert("删除成功");
                    model.com.refresh();
                    //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                    //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));
                })
            });

            //删除单条 
            $("body").delegate("#femi-riskLevelTime-tbody .lmvt-allowed-delete", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DataItem.filter((item) => { return item.WID == wID });

                if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {
                    return false;
                }

                DataItem = model.com.getNewList(DataItem, SelectData);

                for (var i = 0; i < DataItem.length; i++) {
                    DataItem[i].WID = 1 + i;
                }

                rightListO.TimeOutList = $com.util.Clone(DataItem);
                for (var i = 0; i < rightListO.TimeOutList.length; i++) {
                    $com.util.deleteLowerProperty(rightListO.TimeOutList[i]);
                }
                $com.util.deleteLowerProperty(rightListO);

                model.com.postRule({
                    data: rightListO,
                }, function (res) {
                    alert("删除成功");
                    model.com.refresh();
                    //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                    //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));
                })
            });
        },

        run: function () {
            var Userist = window.parent._UserAll;
            model.com.getEXCExceptionTypeAll({ RelevancyType: -1, StationType: -1, Name: "", Active: -1 }, function (res) {


                if (res && res.list) {
                    //DataLinelist = resW.list;
                    $.each(res.list, function (i, item) {
                        TypeSource_Level.ExceptionType.push({
                            name: item.Name,
                            value: item.ID,

                        });
                    });

                }
                if (res && res.list) {
                    //DataLinelist = resW.list;
                    $.each(Userist, function (i, item) {
                        TypeSource_Level.CreatorID.push({
                            name: item.Name,
                            value: item.ID,

                        });
                    });

                }
                if (res && res.list) {
                    //DataLinelist = resW.list;
                    $.each(Userist, function (i, item) {
                        TypeSource_Level.EditorID.push({
                            name: item.Name,
                            value: item.ID,

                        });
                    });

                }
                model.com.getEXCTemplate({}, function (data) {
                    if (data && data.list) {
                        TempList = data.list;

                        var _ReqType = {};
                        $.each(data.list, function (i, item) {
                            if (!_ReqType[item.EXCRequestType]) {
                                _ReqType[item.EXCRequestType] = {
                                    name: EXCResourseTypes[item.EXCRequestType],
                                    value: item.EXCRequestType,
                                    far: 0

                                };
                                TypeSource_Level.EXCRequestType.push(_ReqType[item.EXCRequestType]);
                            }


                            if ($com.util.findIndex(TypeSource_Level.EXCResponseType, function (element) {
                                return element.value == item.EXCResponseType && element.far == item.EXCRequestType
                            }) < 0) {
                                TypeSource_Level.EXCResponseType.push({
                                    name: EXCResourseTypes[item.EXCResponseType],
                                    value: item.EXCResponseType,
                                    far: item.EXCRequestType,

                                });
                            }

                            //TypeSource_Level.EXCConfirmType.push({
                            //    name: EXCResourseTypes[item.EXCConfirmType],
                            //    value: item.EXCConfirmType,
                            //    far: item.EXCResponseType,

                            //});

                            TypeSource_Level.EXCConfirmType.push({
                                name: EXCResourseTypes[item.EXCConfirmType],
                                value: item.EXCConfirmType,
                                far: item.EXCRequestType + "_" + item.EXCResponseType,

                            });
                        });
                    }

                    model.com.refresh();
                })



            });
            window.parent.lmvtEXCRule = 0;
            model.com.RepeatGetType();
        },

        com: {
            refresh: function () {

                model.com.getEXCExceptionRule({
                    ExceptionType: 0,
                    Name: "",
                    RespondLevel: -1,
                    RequestType: 0,
                    ResponseType: 0,
                    ConfirmType: 0,
                    Active: -1
                }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var Grade = $com.util.Clone(resP.list);
                        DATABasic = $com.util.Clone(resP.list);
                        for (var i = 0; i < Grade.length; i++) {
                            for (var j = 0; j < TempList.length; j++) {
                                if (Grade[i].EXCTemplate == TempList[j].EXCTemplate) {
                                    Grade[i].EXCRequestType == TempList[j].EXCRequestType;
                                    Grade[i].EXCResponseType == TempList[j].EXCResponseType;
                                    Grade[i].EXCConfirmType == TempList[j].EXCConfirmType;
                                }

                            }

                        }
                        DataAll = $com.util.Clone(Grade);

                        $.each(Grade, function (i, item) {

                            item.Badge = " ";

                            if (item.Active == 1) {
                                item.ISAllowedText = "禁用";
                                item.ISAllowed = "lmvt-do-forbidden";
                                item.ClassBadge = "lmvt-activeBadge";
                            } else {
                                item.ISAllowedText = "启用";
                                item.ISAllowed = "lmvt-do-active";
                                item.ClassBadge = "lmvt-forbiddenBadge";
                            }

                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }
                            item.WID = i + 1;

                        });
                        DataAllFactorySearch = $com.util.Clone(Grade);
                        $("#femi-riskLevel-tbody").html($com.util.template(Grade, HTML.TableMode));
                        $("#femi-riskLevel-tbody tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });

                        //渲染时长
                        rightListO = {};
                        for (var i = 0; i < DataAll.length; i++) {
                            if (SelectOneID == DataAll[i].ID) {
                                rightListO = DataAll[i];
                            }
                        }

                        if (rightListO.TimeOutList) {
                            for (var i = 0; i < rightListO.TimeOutList.length; i++) {
                                rightListO.TimeOutList[i].WID = 1 + i;
                            }
                            DataItem = $com.util.Clone(rightListO.TimeOutList);

                            $("#femi-riskLevelTime-tbody").html($com.util.template(rightListO.TimeOutList, HTML.TableTimeMode));

                            $("#femi-riskLevelItem-tbody tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);



                            });
                        }


                    }

                });




            },
            getFMCFactory: function (data, fn, context) {
                var d = {
                    $URI: "/FMCFactory/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取异常地点类型集合
            getEXCExceptionTypeAll: function (data, fn, context) {
                var d = {
                    $URI: "/EXCExceptionType/All",
                    $TYPE: "get",
                    $SERVER: "/MESQMS"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取模板
            getEXCTemplate: function (data, fn, context) {
                var d = {
                    $URI: "/EXCExceptionRule/Template",
                    $TYPE: "get",
                    $SERVER: "/MESQMS"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取所有设备/备件点检类型列表
            getEXCExceptionRule: function (data, fn, context) {
                var d = {
                    $URI: "/EXCExceptionRule/All",
                    $TYPE: "get",
                    $SERVER: "/MESQMS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //提交
            postRule: function (data, fn, context) {
                var d = {
                    $URI: "/EXCExceptionRule/Update",
                    $TYPE: "post",
                    $SERVER: "/MESQMS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //启用
            activeRule: function (data, fn, context) {
                var d = {
                    $URI: "/EXCExceptionRule/Active",
                    $TYPE: "post",
                    $SERVER: "/MESQMS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询工厂
            getFMCFactory: function (data, fn, context) {
                var d = {
                    $URI: "/FMCFactory/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询事业部
            getBusinessUnit: function (data, fn, context) {
                var d = {
                    $URI: "/BusinessUnit/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询模块ID对应枚举值
            getModuleAll: function (data, fn, context) {
                var d = {
                    $URI: "/MESEnum/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询车间列表
            getFMCWorkShop: function (data, fn, context) {
                var d = {
                    $URI: "/FMCWorkShop/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //保存车间列表
            postFMCWorkShop: function (data, fn, context) {
                var d = {
                    $URI: "/FMCWorkShop/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //审核
            postAudit: function (data, fn, context) {
                var d = {
                    $URI: "/FMCWorkShop/Audit",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //启用
            activeAudit: function (data, fn, context) {
                var d = {
                    $URI: "/FMCWorkShop/Active",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //导出
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
                        if (_source[i].ID == set_data[j].ID && _source[i].Responselevel == set_data[j].Responselevel) {
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
            RepeatGetType: function () {
                setTimeout(function () {
                    if (window.parent.lmvtEXCRule == 1) {
                        TypeSource_Level.ExceptionType = [];
                        TypeSource_Level.EXCRequestType = [];
                        TypeSource_Level.EXCResponseType = [];
                        model.com.getEXCExceptionTypeAll({ RelevancyType: -1, StationType: -1, Name: "", Active: -1 }, function (res) {
                            if (res && res.list) {
                                //DataLinelist = resW.list;
                                $.each(res.list, function (i, item) {
                                    TypeSource_Level.ExceptionType.push({
                                        name: item.Name,
                                        value: item.ID,
                                    });
                                });
                            }
                            model.com.getEXCTemplate({}, function (data) {
                                if (data && data.list) {
                                    TempList = data.list;

                                    var _ReqType = {};
                                    $.each(data.list, function (i, item) {
                                        if (!_ReqType[item.EXCRequestType]) {
                                            _ReqType[item.EXCRequestType] = {
                                                name: EXCResourseTypes[item.EXCRequestType],
                                                value: item.EXCRequestType,
                                                far: 0

                                            };
                                            TypeSource_Level.EXCRequestType.push(_ReqType[item.EXCRequestType]);
                                        }


                                        if ($com.util.findIndex(TypeSource_Level.EXCResponseType, function (element) {
                                            return element.value == item.EXCResponseType && element.far == item.EXCRequestType
                                        }) < 0) {
                                            TypeSource_Level.EXCResponseType.push({
                                                name: EXCResourseTypes[item.EXCResponseType],
                                                value: item.EXCResponseType,
                                                far: item.EXCRequestType,

                                            });
                                        }

                                        //TypeSource_Level.EXCConfirmType.push({
                                        //    name: EXCResourseTypes[item.EXCConfirmType],
                                        //    value: item.EXCConfirmType,
                                        //    far: item.EXCResponseType,
                                        //});

                                        TypeSource_Level.EXCConfirmType.push({
                                            name: EXCResourseTypes[item.EXCConfirmType],
                                            value: item.EXCConfirmType,
                                            far: item.EXCRequestType + "_" + item.EXCResponseType,
                                        });
                                    });
                                }
                                model.com.refresh();
                            })
                        });
                        window.parent.lmvtEXCRule = 0;
                    }
                    model.com.RepeatGetType();
                }, 500);

            },
        }
    }),

        model.init();


});