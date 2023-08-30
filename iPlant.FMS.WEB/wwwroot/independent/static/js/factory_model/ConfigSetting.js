require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($zace, $com) {

    var KEYWORD_Level_LIST,
        KEYWORD_Level,
        FORMATTRT_Level,
        DEFAULT_VALUE_Level,
        TypeSource_Level,
        model,
        mStatonList,
        DataAll,
        DATABasic,
        DataAllConfirmBasic,
        DataAllConfirmChange,
        DataAllConfirm,
        DataAllSearch,
        DataAllFactorySearch,
        BusinessUnitID,
        FactoryID,
        WorkShopID,
        mLineID,
        mWorkShopID,
        gyFlag = false,
        zlFlag = false,
        HTML;
    WorkShopID = BusinessUnitID = FactoryID = 0;
    DataAll = [];
    DATABasic = [];
    DataAllConfirmBasic = [];
    DataAllConfirmChange = [];
    DataAllConfirm = [];
    DataAllFactorySearch = DataAllSearch = [];

    HTML = {
        TableMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            // '<td data-title="WorkShopName" data-value="{{WorkShopName}}" >{{WorkShopName}}</td>',
            // '<td data-title="LineName" data-value="{{LineName}}" >{{LineName}}</td>',
            '<td data-title="PartName" data-value="{{PartName}}" >{{PartName}}</td>',
            // '<td data-title="StepName" data-value="{{StepName}}" >{{StepName}}</td>',
            '<td data-title="EndStationName" data-value="{{EndStationName}}" >{{EndStationName}}</td>',
            '<td data-title="Editor" data-value="{{Editor}}" >{{Editor}}</td>',
            '<td data-title="EditTime" data-value="{{EditTime}}" >{{EditTime}}</td>',

            '<td data-title="FirstEnable" data-value="{{FirstEnable}}" >{{FirstEnable}}</td>',
            '<td data-title="FirstConditionNum" data-value="{{FirstConditionNum}}" >{{FirstConditionNum}}</td>',
            '<td data-title="FirstConditionNumMax" data-value="{{FirstConditionNumMax}}" >{{FirstConditionNumMax}}</td>',
            '<td data-title="FirstControl" data-value="{{FirstControl}}" >{{FirstControl}}</td>',
            '<td data-title="GYLoopEnable" data-value="{{GYLoopEnable}}" >{{GYLoopEnable}}</td>',
            '<td data-title="GYLoopControl" data-value="{{GYLoopControl}}" >{{GYLoopControl}}</td>',
            '<td data-title="GYLoopInterval" data-value="{{GYLoopInterval}}" >{{GYLoopInterval}}</td>',
            '<td data-title="QTLoopEnable" data-value="{{QTLoopEnable}}" >{{QTLoopEnable}}</td>',
            '<td data-title="QTLoopControl" data-value="{{QTLoopControl}}" >{{QTLoopControl}}</td>',
            '<td data-title="QTLoopInterval" data-value="{{QTLoopInterval}}">{{QTLoopInterval}}</td>',

            '<td style="min-width: 40px; display:{{AllDISPLAY}}" data-title="Handle" data-value="{{ID}}"><div class="row">',
            // '<div class="col-md-6 {{ISAllowed}} ">{{ISAllowedText}}</div>',
            '<div class="col-md-{{GY}} lmvt-do-infoGY" style="display:{{GYDISPLAY}}" >工艺修改</div>',
            '<div class="col-md-{{ZL}} lmvt-do-infoZL" style="display:{{ZLDISPLAY}}">质量修改</div>',
            '</td>',

            '</tr>',
        ].join(""),
        TableLineMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
            '<td data-title="Code" data-value="{{Code}}" >{{Code}}</td>',
            '<td data-title="WorkShop" data-value="{{WorkShop}}" >{{WorkShop}}</td>',

            '</tr>',
        ].join(""),


    };
    (function () {
        KEYWORD_Level_LIST = [
            "WorkShopID|车间|ArrayOne",
            "LineID|产线|ArrayOne",
            "EditTime|时间|DateTime",
            "FirstEnable|启用首检|ArrayOne",
            "FirstConditionNum|触发首检条件",
            "FirstConditionNumMax|允许自检最大数",
            "FirstControl|首检控制自检|ArrayOne",
            "GYLoopEnable|工艺巡检启用|ArrayOne",
            "GYLoopControl|工艺巡检控制自检|ArrayOne",
            "GYLoopInterval|工艺巡检周期",
            "QTLoopEnable|质量巡检启用|ArrayOne",
            "QTLoopControl|质量巡检控制自检|ArrayOne",
            "QTLoopInterval|质量巡检周期",
            "EndStationIDList|工位|Array"
        ];
        KEYWORD_Level = {};
        FORMATTRT_Level = {};

        DEFAULT_VALUE_Level = {
            // WorkShopID: "",
            LineID: "",
        };
        TypeSource_Level = {
            EndStationIDList: [
            ],
            GYLoopControl: [{
                name: "否",
                value: 0,
            }, {
                name: "是",
                value: 1,
            }],
            QTLoopControl: [{
                name: "否",
                value: 0,
            }, {
                name: "是",
                value: 1,
            }],
            GYLoopEnable: [{
                name: "否",
                value: 0,
            }, {
                name: "是",
                value: 1,
            }],
            QTLoopEnable: [{
                name: "否",
                value: 0,
            }, {
                name: "是",
                value: 1,
            }],
            FirstEnable: [{
                name: "否",
                value: 0,
            }, {
                name: "是",
                value: 1,
            }],
            FirstControl: [{
                name: "否",
                value: 0,
            }, {
                name: "是",
                value: 1,
            }],
            WorkShopID: [
                {
                    name: "无",
                    value: 0,
                }
            ],

            LineID: [
                {
                    name: "无",
                    value: 0,
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
    })();


    model = $com.Model.create({
        name: '首巡检配置',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            $("body").delegate("#zace-refresh-po", "click", function () {
                model.com.refresh();
            });


            //配置工艺修改
            $("body").delegate(".lmvt-do-infoGY", "click", function () {
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));
                var SelectData = DataAll.filter((item) => { return item.ID == wID });
                model.com.getItemList({
                    LineID: SelectData[0].LineID, IsStruct: 1
                }, function (resItem) {
                    mStatonList = [];
                    TypeSource_Level.EndStationIDList = [];
                    //找到工序下工位
                    mStatonList = model.com.StatonList(resItem.list, SelectData[0].PartID);

                    $.each(mStatonList, function (i, item) {
                        TypeSource_Level.EndStationIDList.push({
                            name: item.Name,
                            value: item.UnitID,
                            far: 0,
                        });
                    });

                    var default_value = {
                        FirstEnable: SelectData[0].FirstEnable,
                        FirstConditionNum: SelectData[0].FirstConditionNum,
                        FirstConditionNumMax: SelectData[0].FirstConditionNumMax,
                        FirstControl: SelectData[0].FirstControl,
                        GYLoopEnable: SelectData[0].GYLoopEnable,
                        GYLoopControl: SelectData[0].GYLoopControl,
                        GYLoopInterval: SelectData[0].GYLoopInterval,
                        EndStationIDList: SelectData[0].EndStationID,
                        // QTLoopEnable: SelectData[0].QTLoopEnable,
                        // QTLoopControl: SelectData[0].QTLoopControl,
                        // QTLoopInterval: SelectData[0].QTLoopInterval,
                    };
                    $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        SelectData[0].FirstEnable = Number(rst.FirstEnable);
                        SelectData[0].FirstConditionNum = rst.FirstConditionNum;
                        SelectData[0].FirstConditionNumMax = rst.FirstConditionNumMax;
                        SelectData[0].FirstControl = Number(rst.FirstControl);
                        SelectData[0].GYLoopEnable = Number(rst.GYLoopEnable);
                        SelectData[0].GYLoopControl = Number(rst.GYLoopControl);
                        SelectData[0].GYLoopInterval = rst.GYLoopInterval;
                        SelectData[0].EndStationID = rst.EndStationIDList;
                        // SelectData[0].QTLoopEnable = Number(rst.QTLoopEnable);
                        // SelectData[0].QTLoopControl = Number(rst.QTLoopControl);
                        // SelectData[0].QTLoopInterval = rst.QTLoopInterval;
                        for (var i = 0; i < SelectData.length; i++) {
                            $com.util.deleteLowerProperty(SelectData[i]);
                        }
                        model.com.postUpdate({
                            data: SelectData,
                        }, function (res) {
                            alert("修改成功");
                            model.com.refresh(mWorkShopID, mLineID);
                        })

                    }, TypeSource_Level));
                });

            });

            //配置质量修改
            $("body").delegate(".lmvt-do-infoZL", "click", function () {
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));
                var SelectData = DataAll.filter((item) => { return item.ID == wID });

                model.com.getItemList({
                    LineID: SelectData[0].LineID, IsStruct: 1
                }, function (resItem) {
                    mStatonList = [];
                    TypeSource_Level.EndStationIDList = [];
                    //找到工序下工位
                    mStatonList = model.com.StatonList(resItem.list, SelectData[0].PartID);

                    $.each(mStatonList, function (i, item) {
                        TypeSource_Level.EndStationIDList.push({
                            name: item.Name,
                            value: item.UnitID,
                            far: 0,
                        });
                    });

                    var default_value = {
                        FirstEnable: SelectData[0].FirstEnable,
                        FirstConditionNum: SelectData[0].FirstConditionNum,
                        FirstConditionNumMax: SelectData[0].FirstConditionNumMax,
                        FirstControl: SelectData[0].FirstControl,
                        // GYLoopEnable: SelectData[0].GYLoopEnable,
                        // GYLoopControl: SelectData[0].GYLoopControl,
                        // GYLoopInterval: SelectData[0].GYLoopInterval,
                        QTLoopEnable: SelectData[0].QTLoopEnable,
                        QTLoopControl: SelectData[0].QTLoopControl,
                        QTLoopInterval: SelectData[0].QTLoopInterval,
                        EndStationIDList: SelectData[0].EndStationID,
                    };
                    $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        SelectData[0].FirstEnable = Number(rst.FirstEnable);
                        SelectData[0].FirstConditionNum = rst.FirstConditionNum;
                        SelectData[0].FirstConditionNumMax = rst.FirstConditionNumMax;
                        SelectData[0].FirstControl = Number(rst.FirstControl);
                        // SelectData[0].GYLoopEnable = Number(rst.GYLoopEnable);
                        // SelectData[0].GYLoopControl = Number(rst.GYLoopControl);
                        // SelectData[0].GYLoopInterval = rst.GYLoopInterval;
                        SelectData[0].QTLoopEnable = Number(rst.QTLoopEnable);
                        SelectData[0].QTLoopControl = Number(rst.QTLoopControl);
                        SelectData[0].QTLoopInterval = rst.QTLoopInterval;
                        SelectData[0].EndStationID = rst.EndStationIDList;
                        for (var i = 0; i < SelectData.length; i++) {
                            $com.util.deleteLowerProperty(SelectData[i]);
                        }
                        model.com.postUpdate({
                            data: SelectData,
                        }, function (res) {
                            alert("修改成功");
                            model.com.refresh(mWorkShopID, mLineID);
                        })

                    }, TypeSource_Level));
                });
            });

            //Enter触发模糊查询事件
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var
                        value = $("#zace-search-level").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-riskLevel-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "ID");
                }
            });
            // 查询
            $("body").delegate("#zace-searchZall-Zace", "click", function () {

                var value = $("#zace-search-level").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "ID");

            });


            $("body").delegate("#zace-searchC-level", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "查询", function (rst) {

                    if (!rst || $.isEmptyObject(rst))
                        return;

                    mWorkShopID = rst.WorkShopID;
                    mLineID = rst.LineID;
                    model.com.refresh(-1, mLineID);
                }, TypeSource_Level));

            });
            window.setFunctionTrigger("ConfigSetting", function (res) {
                mLineID = res.LineID;
                model.com.refresh(-1,mLineID);
            });
        },


        run: function () {
            LoginOBJ = window.parent.User_Info;
            // model.com.getFunctionAll({
            //     OperatorID: LoginID
            // }, function (resUser) {
            //     wFunctionAll = resUser.list;

                for (var i = 0; i < LoginOBJ.RoleList.length; i++) {
                    if (LoginOBJ.RoleList[i].FunctionID == 130101) {
                        gyFlag = true;
                    }
                    if (LoginOBJ.RoleList[i].FunctionID == 130102) {
                        zlFlag = true;
                    }
                }
                model.com.getFMCWorkShop({ FactoryID: 0, BusinessUnitID: 0 }, function (resP) {
                    $.each(resP.list, function (i, item) {
                        TypeSource_Level.WorkShopID.push({
                            name: item.Name,
                            value: item.ID,
                            far: 0,
                        });
                    })

                    mWorkShopID = !TypeSource_Level.WorkShopID[1].value && !TypeSource_Level.WorkShopID[1] ? "-1" : TypeSource_Level.WorkShopID[1].value
                    model.com.getFMCLine({ FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0 }, function (resL) {
                        $.each(resL.list, function (i, item) {
                            TypeSource_Level.LineID.push({
                                name: item.Name,
                                value: item.ID,
                                far: 0,
                            });
                        });
                        mLineID = !TypeSource_Level.LineID[1].value && !TypeSource_Level.LineID[1] ? "-1" : TypeSource_Level.LineID[1].value;
                        model.com.refresh(mWorkShopID, mLineID);
                    });
                });
            // });

        },

        com: {

            refresh: function (mWorkShopID, mLineID) {
                if (mLineID <= 0) {
                    alert("无产线数据，请先确认好");
                    return;
                }
                //申请
                model.com.getAll({ WorkShopID: -1, LineID: mLineID, PartID: -1, StepID: -1 }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var Grade = $com.util.Clone(resP.list);
                        if (Grade.length > 0) {
                            $(".zace-header-titleConfig").text(Grade[0].LineName + "首巡检配置");
                        }else{
                            $(".zace-header-titleConfig").text("首巡检配置");
                        }
                        DATABasic = $com.util.Clone(resP.list);

                        DataAll = $com.util.Clone(Grade);

                        $.each(Grade, function (i, item) {


                            if (gyFlag && !zlFlag) {
                                item.GYDISPLAY = "show";
                                item.ZLDISPLAY = "none";
                                item.GY = 12;
                            }

                            if (!gyFlag && zlFlag) {
                                item.GYDISPLAY = "none";
                                item.ZLDISPLAY = "show";
                                item.ZL = 12;
                            }

                            if (!gyFlag && !zlFlag) {
                                item.AllDISPLAY = "none";
                            }

                            if (gyFlag && zlFlag) {
                                item.GYDISPLAY = "show";
                                item.ZLDISPLAY = "show";
                                item.GY = 6;
                                item.ZL = 6;
                            }

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
                        if (!gyFlag && !zlFlag) {
                            $("#Opter").hide();
                            $(".table-partApproval thead tr #Opter").hide();
                        }
                    }

                });
                window.parent._zaceWorkShop = 1;

            },

            StatonList: function (PartList, PartID) {
                var StationArray = [];
                for (var i = 0; i < PartList.length; i++) {
                    if (PartList[i].UnitID == PartID && PartList[i].UnitList.length > 0) {
                        for (var j = 0; j < PartList[i].UnitList.length; j++) {
                            for (var k = 0; k < PartList[i].UnitList[j].UnitList.length; k++) {
                                StationArray.push(PartList[i].UnitList[j].UnitList[k]);
                            }
                        }
                    }
                }
                StationArray = model.com.unique(StationArray);
                return StationArray
            },
            unique: function (arr) {
                for (var i = 0; i < arr.length; i++) {
                    for (var j = i + 1; j < arr.length; j++) {
                        if (arr[i].UnitID == arr[j].UnitID) { //第一个等同于第二个，splice方法删除第二个
                            arr.splice(j, 1);
                            j--;
                        }
                    }
                }
                return arr;
            },
            //获取用户权限
            getFunctionAll: function (data, fn, context) {
                var d = {
                    $URI: "/Role/FunctionAll",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取列表 工序下工位    http://10.30.113.202:8088/MESCore/api/FMCLineUnit/All?LineID=1&IsStruct=1
            getItemList: function (data, fn, context) {
                var d = {
                    $URI: "/FMCLineUnit/All",
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
            //查询产线
            getFMCLine: function (data, fn, context) {
                var d = {
                    $URI: "/FMCLine/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //查询所有
            getAll: function (data, fn, context) {
                var d = {
                    $URI: "/QMSCheckConfig/All",
                    $TYPE: "get",
                    $SERVER: '/MESQMS',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //保存
            postUpdate: function (data, fn, context) {
                var d = {
                    $URI: "/QMSCheckConfig/Update",
                    $TYPE: "post",
                    $SERVER: '/MESQMS',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //  查单条
            getInfo: function (data, fn, context) {
                var d = {
                    $URI: "/QMSCheckConfig/Info",
                    $TYPE: "get",
                    $SERVER: '/MESQMS',
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