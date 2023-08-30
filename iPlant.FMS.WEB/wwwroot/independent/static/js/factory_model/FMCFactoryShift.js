require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($zace, $com) {

    var KEYWORD_MODE,
        KEYWORD_SHIFT,
        KEYWORD_ZONE,
        KEYWORD_SHIFT_LIST,
        FORMATTRT_SHIFT,
        FORMATTRT_ZONE,
        FORMATTRT_MODE,
        TypeSource_SHIFT,
        TypeSource_MODE,
        TypeSource_ZONE,
        KEYWORD_MODE_LIST,
        KEYWORD_ZONE_LIST,
        DEFAULT_VALUE_Mode,
        DEFAULT_VALUE_SHIFT,
        DEFAULT_VALUE_ZONE,
        model,
        DataModule1List,
        Did,
        ZDataAll,
        ZDataAllChange,
        ZDataAllShift,
        ZDataAllZone,
        mDayID,
        mDayName,
        mShiftID,
        mShiftName,
        HTML;
    DataModule1List = [];
    ZDataAll = [];
    ZDataAllShift = [];
    ZDataAllZone = [];
    ZDataAllChange = [];
    Did = 0;
    mDayID = mShiftID = 0;
    mDayName = mShiftName = "";
    TempWorkDay = {
        Active: 1,
        EndTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date("2019-01-01 00:00:00")),
        Factory: "",
        FactoryID: 0,
        ID: 0,
        IdleMinutes: 0,
        ShiftList: [],
        Minutes: 0,
        Name: "",
        StartTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date("2019-01-01 00:00:00")),
        Status: 3,
        StatusText: "",
        WorkMinutes: 0,
    };

    TempShift = {
        Active: 1,
        EndTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date("2019-01-01 00:00:00")),
        ID: 0,
        IdleMinutes: 0,
        IdleZoneList: [],
        LevelID: 0,
        Minutes: 0,
        Name: "",
        StartTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date("2019-01-01 00:00:00")),
        WorkDayID: 0,
        WorkMinutes: 0,
    };
    TempZone = {
        ID: 0,
        ZoneName: "",
        IdleOrWork: true,
        Minutes: 0,
        ShiftID: 1,
        StartTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
    };

    HTML = {
        TableWorkDayNode: [
            '<tr data-color="">',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  data-title="WID" data-value="{{WID}}">{{WID}}</td>',
            '<td  style="display:none" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="Name" data-value="{{Name}}">{{Name}}</td>',
            '<td data-title="StartTime" data-value="{{StartTime}}">{{StartTime}}</td>',
            '<td data-title="EndTime" data-value="{{EndTime}}">{{EndTime}}</td>',
            '<td data-title="Minutes" data-value="{{Minutes}}">{{Minutes}}</td>',
            '<td data-title="IdleMinutes" data-value="{{IdleMinutes}}">{{IdleMinutes}}</td>',
            '<td data-title="WorkMinutes" data-value="{{WorkMinutes}}">{{WorkMinutes}}</td>',
            '<td data-title="Creator" data-value="{{Creator}}">{{Creator}}</td>',
            '<td data-title="CreateTime" data-value="{{CreateTime}}">{{CreateTime}}</td>',
            '<td data-title="Editor" data-value="{{Editor}}">{{Editor}}</td>',
            '<td data-title="EditTime" data-value="{{EditTime}}">{{EditTime}}</td>',

            '<td data-title="Active" data-value="{{Active}}"><span class="badge lmvt-badge {{ClassBadge}}">{{Badge}}</span>{{Active}}</td>',

            '<td style="max-width: 80px" data-title="Handle" data-value="{{ID}}"><div class="row">',

            '<div class="col-md-4 lmvt-do-info lmvt-info">详情</div>',
            '<div class="col-md-4 {{ISAllowed}}">{{ISAllowedText}}</div>',
            '<div class="col-md-4 lmvt-do-info lmvt-reset">修改</div>',
            // '<div class="col-md-4 lmvt-do-info"><UL id=nav>',
            // '<LI>更多<UL><LI data-value="{{ID}}" class="lmvt-delete">删除</LI>',
            // '</UL></LI></UL></div>',
            '</div></td>',
            //'<td data-title="DepartureDate" data-value="{{DepartureDate}}" >{{DepartureDate}}</td>',
            '</tr>',
        ].join(""),

        TableShiftNode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',

            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
            //'<td data-title="LevelID" data-value="{{LevelID}}" >{{LevelID}}</td>',
            '<td data-title="StartTime" data-value="{{StartTime}}" >{{StartTime}}</td>',
            '<td data-title="EndTime" data-value="{{EndTime}}" >{{EndTime}}</td>',
            '<td data-title="Minutes" data-value="{{Minutes}}" >{{Minutes}}</td>',
            '<td data-title="IdleMinutes" data-value="{{IdleMinutes}}" >{{IdleMinutes}}</td>',
            '<td data-title="WorkMinutes" data-value="{{WorkMinutes}}" >{{WorkMinutes}}</td>',
            // '<td data-title="Active" data-value="{{Active}}" >{{Active}}</td>',
            '<td data-title="Creator" data-value="{{Creator}}" >{{Creator}}</td>',
            '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',

            '<td style="max-width: 80px" data-title="Handle" data-value="{{ID}}"><div class="row">',
            // '<div class="col-md-6 {{ISAllowed}}">{{ISAllowedText}}</div>',
            '<div class="col-md-6 lmvt-do-info lmvt-shfitInfo">详情</div>',
            '<div class="col-md-6 lmvt-do-info lmvt-resetinfo">修改</div>',
            '</div></td>',

            '</tr>',
        ].join(""),
        TableZoneNode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',

            '<td data-title="ZoneName" data-value="{{ZoneName}}" >{{ZoneName}}</td>',
            '<td data-title="StartTime" data-value="{{StartTime}}" >{{StartTime}}</td>',
            '<td data-title="Minutes" data-value="{{Minutes}}" >{{Minutes}}</td>',
            '<td data-title="IdleOrWork" data-value="{{IdleOrWork}}" >{{IdleOrWork}}</td>',
            '<td style="max-width: 80px" data-title="Handle" data-value="{{ID}}"><div class="row">',
            // '<div class="col-md-6 {{ISAllowed}}">{{ISAllowedText}}</div>',
            '<div class="col-md-12 lmvt-do-info lmvt-resetDetail">修改</div>',
            '</div></td>',
            '</tr>',
        ].join(""),


    };
    //day设置
    (function () {
        KEYWORD_MODE_LIST = [
            "Name|名称",
            "StartTime|开始时间|DateTime",
            "EndTime|结束时间|DateTime",
            "CreateTime|创建时间|DateTime",
            "EditTime|编辑时间|DateTime",
            "Minutes|时长",
            "IdleMinutes|休息时长",
            "WorkMinutes|工作时长",
            "Active|启用|ArrayOne",
        ];
        DEFAULT_VALUE_Mode = {
            Name: "",
        };
        KEYWORD_MODE = {};
        FORMATTRT_MODE = {};
        TypeSource_MODE = {
            Active: [{
                name: "默认",
                value: 0,
            }, {
                name: "启用",
                value: 1,
            }, {
                name: "禁用",
                value: 2,
            }]

        };

        $.each(KEYWORD_MODE_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD_MODE[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_MODE[detail[0]] = $com.util.getFormatter(TypeSource_MODE, detail[0], detail[2]);
            }
        });
    })();
    //shift设置
    (function () {
        KEYWORD_SHIFT_LIST = [
            "Name|名称",
            "LevelID|名称|ArrayOne",
            "StartTime|开始时间|Time",
            "EndTime|结束时间|Time",
            "Minutes|时长",
            "IdleMinutes|休息时长",
            "WorkMinutes|工作时长",
            "Active|启用|ArrayOne",
            "CreateTime|创建时间|DateTime",
        ];
        KEYWORD_SHIFT = {};
        FORMATTRT_SHIFT = {};
        DEFAULT_VALUE_SHIFT = {
            LevelID: 0,
        };
        TypeSource_SHIFT = {
            Active: [
                {
                    name: "默认",
                    value: 0,
                }, {
                    name: "启用",
                    value: 1,
                }, {
                    name: "禁用",
                    value: 2,
                }],
            LevelID: [],

        };

        $.each(KEYWORD_SHIFT_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD_SHIFT[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_SHIFT[detail[0]] = $com.util.getFormatter(TypeSource_SHIFT, detail[0], detail[2]);
            }
        });
    })();
    //zone详情
    (function () {
        KEYWORD_ZONE_LIST = [
            "ZoneName|名称",
            "StartTime|开始时间|Time",
            "EndTime|结束时间|Time",
            "Minutes|时长",
            "IdleOrWork|工作|ArrayOne",
        ];
        KEYWORD_ZONE = {};
        FORMATTRT_ZONE = {};
        DEFAULT_VALUE_ZONE = {
            ZoneName: "",
            //Minutes: 0,
            IdleOrWork: true,
            StartTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
            EndTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        };
        DEFAULT_VALUE_ZONE1 = {
            ZoneName: "",
            // Minutes: 0,
            EndTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
            IdleOrWork: true,
        };

        TypeSource_ZONE = {
            IdleOrWork: [{
                name: "是",
                value: true
            }, {
                name: "否",
                value: false
            }],
        };

        $.each(KEYWORD_ZONE_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD_ZONE[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_ZONE[detail[0]] = $com.util.getFormatter(TypeSource_ZONE, detail[0], detail[2]);
            }
        });
    })();


    model = $com.Model.create({
        name: '作息管理',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            $("body").delegate("#zace-update-zaceRefresh", "click", function () {

                model.com.refresh();
            });
            $("body").delegate("#zace-update-zaceRefreshItem", "click", function () {

                model.com.refresh();
            });

            //day 新增
            $("body").delegate("#zace-add-day", "click", function () {

                //将Json数据中的数据值改成对应默认值，然后传入进去
                $("body").append($com.modal.show(DEFAULT_VALUE_Mode, KEYWORD_MODE, "新增", function (rst) {
                    //调用插入函数 

                    if (!rst || $.isEmptyObject(rst))
                        return;
                    TempWorkDay.Name = rst.Name;
                    model.com.updateFMCWorkDay({
                        data: TempWorkDay,
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                    })

                }, TypeSource_MODE));
            });
            //day 修改
            $("body").delegate(".lmvt-reset", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = ZDataAll.filter((item) => { return item.ID == wID });

                var default_value = {
                    Name: SelectData[0].Name,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_MODE, "修改", function (rst) {
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].Name = rst.Name;
                    SelectData[0].StartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[0].StartTime));
                    SelectData[0].EndTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[0].EndTime));
                    for (var i = 0; i < SelectData.length; i++) {

                        $com.util.deleteLowerProperty(SelectData[i]);
                    }

                    model.com.updateFMCWorkDay({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                    })

                }, TypeSource_MODE));
            });
            // //双击作息时间  展示班次
            // $("body").delegate("#femi-day-tbody tr", "dblclick", function () {
            //     var $this = $(this);
            //     mDayName = $this.find('td[data-title=Name]').attr('data-value');
            //     mDayID = Number($this.find('td[data-title=ID]').attr('data-value'));

            //     $("#zace-sapn-shiftText").html(mDayName + "班次列表");
            //     model.com.refresh();
            //     $(".zzzz").hide();
            //     $(".zzzc").css("width", "0px")
            //     $(".zzza").css("margin-right", "0px");
            //     $(".zzzc").hide();
            //     $(".zzza").show();
            // });

            //双击作息时间  展示班次
            $("body").delegate(".lmvt-info", "click", function () {
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = ZDataAll.filter((item) => { return item.ID == wID });

                mDayName = SelectData[0].Name;
                mDayID = SelectData[0].ID;

                // mDayName = $this.find('td[data-title=Name]').attr('data-value');
                // mDayID = Number($this.find('td[data-title=ID]').attr('data-value'));

                $("#zace-sapn-shiftText").html(mDayName + "班次列表");
                model.com.refresh();
                $(".zzzz").hide();
                $(".zzzc").css("width", "0px")
                $(".zzza").css("margin-right", "0px");
                $(".zzzc").hide();
                $(".zzza").show();
            });

            // //  双击班次   展开详情
            // $("body").delegate("#femi-shift-tbody tr", "dblclick", function () {
            //     var $this = $(this);
            //     mShiftName = $this.find('td[data-title=Name]').attr('data-value');
            //     mShiftID = Number($this.find('td[data-title=ID]').attr('data-value'));

            //     $("#zace-sapn-zoneText").html(mShiftName + "详情");
            //     model.com.refresh();
            //     $(".zzzz").hide();
            //     $(".zzzc").css("width", "450px");
            //     $(".zzza").css("margin-right", "450px");
            //     $(".zzzc").show();
            //     $(".zzza").show();
            // });


            //  双击班次   展开详情
            $("body").delegate(".lmvt-shfitInfo", "click", function () {
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = ZDataAllShift.filter((item) => { return item.ID == wID });

                mShiftName = SelectData[0].Name;
                mShiftID = SelectData[0].ID;

                $("#zace-sapn-zoneText").html(mShiftName + "详情");
                model.com.refresh();
                $(".zzzz").hide();
                $(".zzzc").css("width", "450px");
                $(".zzza").css("margin-right", "450px");
                $(".zzzc").show();
                $(".zzza").show();

            });

            //day 禁用
            $("body").delegate(".lmvt-allowed-delete", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));


                var SelectData = ZDataAll.filter((item) => { return item.ID == wID });

                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                for (var i = 0; i < SelectData.length; i++) {

                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                model.com.activeFMCWorkDay({
                    data: SelectData,
                    Active: 2
                }, function (res) {
                    alert("禁用成功");
                    model.com.refresh();
                })

            });
            //day 启用
            $("body").delegate(".lmvt-do-active", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));
                var SelectData = ZDataAll.filter((item) => { return item.ID == wID });
                for (var i = 0; i < SelectData.length; i++) {

                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                model.com.activeFMCWorkDay({
                    data: SelectData,
                    Active: 1
                }, function (res) {
                    alert("启用成功");
                    model.com.refresh();
                })

            });

            //条件查询
            // $("body").delegate("#zace-searchZall-day", "click", function () {
            //     // var default_value = {
            //     //     Active: true,
            //     // };
            //     // $("body").append($com.modal.show(default_value, KEYWORD_MODE, "查询", function (rst) {


            //     //     if (!rst || $.isEmptyObject(rst))
            //     //         return;

            //     //     default_value.Active = eval(rst.Active.toLowerCase());
            //     //     $com.table.filterByConndition($("#femi-day-tbody"), ZDataAll, default_value, "ID");

            //     // }, TypeSource_MODE));


            // });
            //Enter触发模糊查询事件
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var $this = $(this),
                        value = $("#zace-search-day").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-day-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-day-tbody"), ZDataAllChange, value, "ID");
                }
            });
            //模糊查询
            $("body").delegate("#zace-searchZall-day", "click", function () {
                var $this = $(this),
                    value = $("#zace-search-day").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-day-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-day-tbody"), ZDataAllChange, value, "ID");
            });



            //shift 新增
            $("body").delegate("#zace-add-shift", "click", function () {
                if (ZDataAllShift.length < 1) {
                    //将Json数据中的数据值改成对应默认值，然后传入进去
                    $("body").append($com.modal.show(DEFAULT_VALUE_SHIFT, KEYWORD_SHIFT, "新增", function (rst) {
                        //调用插入函数 

                        if (!rst || $.isEmptyObject(rst))
                            return;
                        TempShift.LevelID = Number(rst.LevelID);
                        TempShift.WorkDayID = mDayID;

                        for (var i = 0; i < DataModule1List.length; i++) {
                            if (TempShift.LevelID == DataModule1List[i].ID) {
                                TempShift.Name = DataModule1List[i].ItemName;

                            }
                        }
                        //for (var i = 0; i < SelectData.length; i++) {

                        $com.util.deleteLowerProperty(TempShift);
                        // }
                        model.com.updateFMCShift({
                            data: TempShift,
                        }, function (res) {
                            alert("新增成功");
                            model.com.refresh();
                        })

                    }, TypeSource_SHIFT));
                } else {
                    //将Json数据中的数据值改成对应默认值，然后传入进去
                    $("body").append($com.modal.show(DEFAULT_VALUE_SHIFT, KEYWORD_SHIFT, "新增", function (rst) {
                        //调用插入函数 

                        if (!rst || $.isEmptyObject(rst))
                            return;
                        TempShift.LevelID = Number(rst.LevelID);
                        TempShift.WorkDayID = mDayID;
                        var wId = ZDataAllShift.length - 1;
                        TempShift.StartTime = TempShift.EndTime = ZDataAllShift[wId].EndTime;
                        for (var i = 0; i < DataModule1List.length; i++) {
                            if (TempShift.LevelID == DataModule1List[i].ID) {
                                TempShift.Name = DataModule1List[i].ItemName;

                            }
                        }
                        $com.util.deleteLowerProperty(TempShift);
                        model.com.updateFMCShift({
                            data: TempShift,
                        }, function (res) {
                            alert("新增成功");
                            model.com.refresh();
                        })

                    }, TypeSource_SHIFT));
                }
            });
            //shift 修改
            $("body").delegate(".lmvt-resetinfo", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = ZDataAllShift.filter((item) => { return item.ID == wID });


                var default_value = {
                    LevelID: SelectData[0].LevelID,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_SHIFT, "修改", function (rst) {
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    SelectData[0].LevelID = Number(rst.LevelID);
                    SelectData[0].StartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[0].StartTime));
                    SelectData[0].EndTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[0].EndTime));
                    for (var i = 0; i < DataModule1List.length; i++) {
                        if (SelectData[0].LevelID == DataModule1List[i].ID) {
                            SelectData[0].Name = DataModule1List[i].ItemName;

                        }
                    }
                    for (var i = 0; i < SelectData.length; i++) {

                        $com.util.deleteLowerProperty(SelectData[i]);
                    }
                    model.com.updateFMCShift({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                    })

                }, TypeSource_SHIFT));
            });


            //返回
            $("body").delegate("#zace-logOut-shift", "click", function () {
                $(".zzzz").show();
                $(".zzzc").hide();
                $(".zzza").hide();

            });

            //zone 新增
            $("body").delegate("#zace-add-zone", "click", function () {

                //if (mShiftID == ZDataAllShift[0].ID)
                //{


                if (ZDataAllZone.length < 1) {
                    var wid = 0;
                    for (var i = 0; i < ZDataAllShift.length; i++) {
                        if (mShiftID == ZDataAllShift[i].ID) {
                            wid = i;
                        }
                    }
                    DEFAULT_VALUE_ZONE.EndTime = DEFAULT_VALUE_ZONE.StartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(ZDataAllShift[wid].StartTime));
                    //将Json数据中的数据值改成对应默认值，然后传入进去
                    $("body").append($com.modal.show(DEFAULT_VALUE_ZONE, KEYWORD_ZONE, "新增", function (rst) {
                        //调用插入函数 

                        if (!rst || $.isEmptyObject(rst))
                            return;
                        TempZone.ShiftID = mShiftID;
                        TempZone.IdleOrWork = eval(rst.IdleOrWork.toLowerCase());
                        TempZone.ZoneName = rst.ZoneName;
                        //TempZone.Minutes = Number(rst.Minutes);
                        //var result = (TempZone.Minutes.toString()).indexOf(".");
                        //if (result != -1) {
                        //    alert("时长为整数!!!");
                        //    return;
                        //}
                        var endTime = $com.util.format("yyyy-MM-dd hh:mm:ss", new Date(rst.EndTime));
                        TempZone.StartTime = $com.util.format("yyyy-MM-dd hh:mm:ss", new Date(rst.StartTime));
                        //if (TempZone.Minutes <= 0) {
                        TempZone.Minutes = model.com.getMIn(TempZone.StartTime, endTime)

                        //alert(TempZone.Minutes);
                        //}
                        if (TempZone.Minutes < 0) {
                            //说明时间隔一天 加一天
                            TempZone.Minutes += 1440;
                        }


                        ZDataAllZone.push(TempZone);

                        for (var i = 0; i < ZDataAllZone.length; i++) {

                            ZDataAllZone[i].StartTime = $com.util.format("yyyy-MM-dd hh:mm:ss", new Date(ZDataAllZone[i].StartTime));

                            $com.util.deleteLowerProperty(ZDataAllZone[i]);

                        }


                        model.com.updateFMCTimeZone({
                            ShiftID: mShiftID,
                            data: ZDataAllZone,
                        }, function (res) {


                            //保存shift
                            var _list = [];
                            for (var i = 0; i < ZDataAllShift.length; i++) {
                                if (mShiftID == ZDataAllShift[i].ID) {
                                    _list.push(ZDataAllShift[i]);
                                }
                            }

                            _list[0].StartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(TempZone.StartTime));
                            _list[0].Minutes = 0;
                            _list[0].IdleMinutes = 0;
                            _list[0].WorkMinutes = 0;
                            for (var i = 0; i < ZDataAllZone.length; i++) {
                                if (ZDataAllZone[i].IdleOrWork) {
                                    _list[0].WorkMinutes += ZDataAllZone[i].Minutes;

                                } else {
                                    _list[0].IdleMinutes += ZDataAllZone[i].Minutes;
                                }
                            }
                            _list[0].Minutes = _list[0].IdleMinutes + _list[0].WorkMinutes;
                            _list[0].EndTime = model.com.getTime(_list[0].StartTime, _list[0].Minutes);
                            _list[0].EndTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(_list[0].EndTime));

                            $com.util.deleteLowerProperty(_list[0]);

                            model.com.updateFMCShift({
                                data: _list[0]
                            }, function (res) {

                                //保存workDay
                                var _listDay = [];
                                for (var i = 0; i < ZDataAll.length; i++) {
                                    if (mDayID == ZDataAll[i].ID) {
                                        _listDay.push(ZDataAll[i]);
                                    }
                                }

                                _listDay[0].StartTime = ZDataAllShift[0].StartTime;
                                _listDay[0].Minutes = 0;
                                _listDay[0].IdleMinutes = 0;
                                _listDay[0].WorkMinutes = 0;
                                for (var i = 0; i < ZDataAllShift.length; i++) {
                                    if (ZDataAllShift[i].Active) {
                                        _listDay[0].WorkMinutes += ZDataAllShift[i].WorkMinutes;
                                        _listDay[0].IdleMinutes += ZDataAllShift[i].IdleMinutes;
                                    }
                                }
                                _listDay[0].Minutes = _listDay[0].IdleMinutes + _listDay[0].WorkMinutes;
                                // _listDay[0].EndTime = model.com.getTime(_listDay[0].StartTime, _listDay[0].Minutes);
                                _listDay[0].EndTime = ZDataAllShift[ZDataAllShift.length - 1].EndTime;
                                _listDay[0].StartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(_listDay[0].StartTime));
                                _listDay[0].EndTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(_listDay[0].EndTime));
                                $com.util.deleteLowerProperty(_listDay[0]);
                                model.com.updateFMCWorkDay({
                                    data: _listDay[0]
                                }, function (res) {

                                    alert("新增成功");
                                    model.com.refresh();


                                })


                            })

                        });

                    }, TypeSource_ZONE));
                } else {
                    //将Json数据中的数据值改成对应默认值，然后传入进去
                    $("body").append($com.modal.show(DEFAULT_VALUE_ZONE1, KEYWORD_ZONE, "新增", function (rst) {
                        //调用插入函数 

                        if (!rst || $.isEmptyObject(rst))
                            return;
                        var id = ZDataAllZone.length - 1;
                        TempZone.ShiftID = mShiftID;
                        TempZone.IdleOrWork = eval(rst.IdleOrWork.toLowerCase());
                        TempZone.ZoneName = rst.ZoneName;
                        // TempZone.Minutes = Number(rst.Minutes);

                        //var result = (TempZone.Minutes.toString()).indexOf(".");
                        //if (result != -1) {
                        //    alert("时长为整数!!!");
                        //    return;
                        //}
                        var endTime = $com.util.format("yyyy-MM-dd hh:mm:ss", new Date(rst.EndTime));
                        TempZone.StartTime = model.com.getTime(ZDataAllZone[id].StartTime, ZDataAllZone[id].Minutes);
                        //if (TempZone.Minutes <= 0) {
                        TempZone.Minutes = model.com.getMIn(TempZone.StartTime, endTime)
                        //alert(TempZone.Minutes);
                        //}
                        if (TempZone.Minutes < 0) {
                            //说明时间隔一天 加一天
                            TempZone.Minutes += 1440;
                        }
                        TempZone.StartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(TempZone.StartTime));
                        //TempZone.EndTime=$com.util.format('yyyy-MM-dd hh:mm:ss', new Date(TempZone.EndTime));

                        for (var i = 0; i < ZDataAllZone.length; i++) {
                            ZDataAllZone[i].StartTime = $com.util.format("yyyy-MM-dd hh:mm:ss", new Date(ZDataAllZone[i].StartTime));

                            $com.util.deleteLowerProperty(ZDataAllZone[i]);
                        }

                        ZDataAllZone.push(TempZone);
                        model.com.updateFMCTimeZone({
                            ShiftID: mShiftID,
                            data: ZDataAllZone,
                        }, function (res) {

                            //保存shift
                            var _list = [];
                            for (var i = 0; i < ZDataAllShift.length; i++) {
                                if (mShiftID == ZDataAllShift[i].ID) {
                                    _list.push(ZDataAllShift[i]);
                                }
                            }

                            _list[0].Minutes = 0;
                            _list[0].IdleMinutes = 0;
                            _list[0].WorkMinutes = 0;
                            for (var i = 0; i < ZDataAllZone.length; i++) {
                                if (ZDataAllZone[i].IdleOrWork) {
                                    _list[0].WorkMinutes += ZDataAllZone[i].Minutes;

                                } else {
                                    _list[0].IdleMinutes += ZDataAllZone[i].Minutes;
                                }
                            }
                            _list[0].Minutes = _list[0].IdleMinutes + _list[0].WorkMinutes;
                            _list[0].EndTime = model.com.getTime(_list[0].StartTime, _list[0].Minutes);

                            _list[0].StartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(_list[0].StartTime));
                            _list[0].EndTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(_list[0].EndTime));
                            $com.util.deleteLowerProperty(_list[i]);

                            model.com.updateFMCShift({
                                data: _list[0]
                            }, function (res) {

                                //保存workDay
                                var _listDay = [];
                                for (var i = 0; i < ZDataAll.length; i++) {
                                    if (mDayID == ZDataAll[i].ID) {
                                        _listDay.push(ZDataAll[i]);
                                    }
                                }

                                // _listDay[0].StartTime = TempZone.StartTime;
                                _listDay[0].Minutes = 0;
                                _listDay[0].IdleMinutes = 0;
                                _listDay[0].WorkMinutes = 0;
                                for (var i = 0; i < ZDataAllShift.length; i++) {
                                    if (ZDataAllShift[i].Active) {
                                        _listDay[0].WorkMinutes += ZDataAllShift[i].WorkMinutes;
                                        _listDay[0].IdleMinutes += ZDataAllShift[i].IdleMinutes;
                                    }
                                }
                                _listDay[0].Minutes = _listDay[0].IdleMinutes + _listDay[0].WorkMinutes;
                                //_listDay[0].EndTime = model.com.getTime(_listDay[0].StartTime, _listDay[0].Minutes);
                                _listDay[0].EndTime = ZDataAllShift[ZDataAllShift.length - 1].EndTime;


                                _listDay[0].StartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(_listDay[0].StartTime));
                                _listDay[0].EndTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(_listDay[0].EndTime));
                                $com.util.deleteLowerProperty(_listDay[i]);
                                model.com.updateFMCWorkDay({
                                    data: _listDay[0]
                                }, function (res) {

                                    alert("新增成功");
                                    model.com.refresh();


                                })

                            })

                        })

                    }, TypeSource_ZONE));
                }
                //}
            });
            //zone 修改
            $("body").delegate(".lmvt-resetDetail", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = ZDataAllZone.filter((item) => { return item.ID == wID });
                if (SelectData[0].ID == ZDataAllZone[0].ID) {
                    var default_value = {
                        ZoneName: SelectData[0].ZoneName,
                        StartTime: SelectData[0].StartTime,
                        IdleOrWork: SelectData[0].IdleOrWork,
                        EndTime: model.com.getTime(SelectData[0].StartTime, SelectData[0].Minutes),
                    };

                    $("body").append($com.modal.show(default_value, KEYWORD_ZONE, "修改", function (rst) {
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        var endTime = $com.util.format("yyyy-MM-dd hh:mm:ss", new Date(rst.EndTime));
                        SelectData[0].IdleOrWork = eval(rst.IdleOrWork.toLowerCase());
                        SelectData[0].ZoneName = rst.ZoneName;
                        SelectData[0].StartTime = $com.util.format("yyyy-MM-dd hh:mm:ss", new Date(rst.StartTime));
                        SelectData[0].Minutes = model.com.getMIn(SelectData[0].StartTime, endTime)
                        if (SelectData[0].Minutes < 0) {
                            //alert("结束时间小于开始时间!");
                            //return false;
                            SelectData[0].Minutes += 1440;
                        }
                        for (var i = 1; i < ZDataAllZone.length; i++) {
                            ZDataAllZone[i].StartTime = model.com.getTime(ZDataAllZone[i - 1].StartTime, ZDataAllZone[i - 1].Minutes);
                            ZDataAllZone[i].StartTime = $com.util.format("yyyy-MM-dd hh:mm:ss", new Date(ZDataAllZone[i].StartTime));
                        }



                        for (var i = 0; i < ZDataAllZone.length; i++) {
                            ZDataAllZone[i].StartTime = $com.util.format("yyyy-MM-dd hh:mm:ss", new Date(ZDataAllZone[i].StartTime));
                            $com.util.deleteLowerProperty(ZDataAllZone[i]);
                        }
                        model.com.updateFMCTimeZone({
                            ShiftID: mShiftID,
                            data: ZDataAllZone
                        }, function (res) {

                            //保存shift
                            var _list = [];
                            for (var i = 0; i < ZDataAllShift.length; i++) {
                                if (mShiftID == ZDataAllShift[i].ID) {
                                    _list.push(ZDataAllShift[i]);
                                }
                            }

                            _list[0].StartTime = ZDataAllZone[0].StartTime;
                            _list[0].Minutes = 0;
                            _list[0].IdleMinutes = 0;
                            _list[0].WorkMinutes = 0;
                            for (var i = 0; i < ZDataAllZone.length; i++) {
                                if (ZDataAllZone[i].IdleOrWork) {
                                    _list[0].WorkMinutes += ZDataAllZone[i].Minutes;

                                } else {
                                    _list[0].IdleMinutes += ZDataAllZone[i].Minutes;
                                }
                            }
                            _list[0].Minutes = _list[0].IdleMinutes + _list[0].WorkMinutes;
                            _list[0].EndTime = model.com.getTime(_list[0].StartTime, _list[0].Minutes);

                            _list[0].StartTime = $com.util.format("yyyy-MM-dd hh:mm:ss", new Date(_list[0].StartTime));
                            _list[0].EndTime = $com.util.format("yyyy-MM-dd hh:mm:ss", new Date(_list[0].EndTime));

                            $com.util.deleteLowerProperty(_list[0]);
                            model.com.updateFMCShift({
                                data: _list[0]
                            }, function (res) {

                                //保存workDay
                                var _listDay = [];
                                for (var i = 0; i < ZDataAll.length; i++) {
                                    if (mDayID == ZDataAll[i].ID) {
                                        _listDay.push(ZDataAll[i]);
                                    }
                                }

                                _listDay[0].StartTime = ZDataAllShift[0].StartTime;
                                _listDay[0].Minutes = 0;
                                _listDay[0].IdleMinutes = 0;
                                _listDay[0].WorkMinutes = 0;
                                for (var i = 0; i < ZDataAllShift.length; i++) {
                                    if (ZDataAllShift[i].Active) {
                                        _listDay[0].WorkMinutes += ZDataAllShift[i].WorkMinutes;
                                        _listDay[0].IdleMinutes += ZDataAllShift[i].IdleMinutes;
                                    }
                                }
                                _listDay[0].Minutes = _listDay[0].IdleMinutes + _listDay[0].WorkMinutes;
                                // _listDay[0].EndTime = model.com.getTime(_listDay[0].StartTime, _listDay[0].Minutes);
                                _listDay[0].EndTime = ZDataAllShift[ZDataAllShift.length - 1].EndTime;

                                _listDay[0].StartTime = $com.util.format("yyyy-MM-dd hh:mm:ss", new Date(_listDay[0].StartTime));
                                _listDay[0].EndTime = $com.util.format("yyyy-MM-dd hh:mm:ss", new Date(_listDay[0].EndTime));
                                $com.util.deleteLowerProperty(_listDay[0]);
                                model.com.updateFMCWorkDay({
                                    data: _listDay[0]
                                }, function (res) {

                                    alert("修改成功");
                                    model.com.refresh();


                                })


                            })
                        })

                    }, TypeSource_ZONE));
                } else {
                    var wid = 0;
                    for (var i = 0; i < ZDataAllZone.length; i++) {
                        if (SelectData[0].ID == ZDataAllZone[i].ID) {
                            wid = i;
                        }
                    }
                    var default_value = {
                        ZoneName: SelectData[0].ZoneName,
                        //StartTime: SelectData[0].StartTime,
                        IdleOrWork: SelectData[0].IdleOrWork,
                        EndTime: model.com.getTime(SelectData[0].StartTime, SelectData[0].Minutes),
                    };

                    $("body").append($com.modal.show(default_value, KEYWORD_ZONE, "修改", function (rst) {
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        var endTime = $com.util.format("yyyy-MM-dd hh:mm:ss", new Date(rst.EndTime));
                        SelectData[0].IdleOrWork = eval(rst.IdleOrWork.toLowerCase());
                        SelectData[0].ZoneName = rst.ZoneName;
                        //SelectData[0].StartTime = $com.util.format("yyyy-MM-dd hh:mm:ss", new Date(rst.StartTime));
                        SelectData[0].Minutes = model.com.getMIn(SelectData[0].StartTime, endTime)
                        if (SelectData[0].Minutes < 0) {
                            SelectData[0].Minutes += 1440;
                        }
                        for (var i = wid + 1; i < ZDataAllZone.length; i++) {
                            ZDataAllZone[i].StartTime = model.com.getTime(ZDataAllZone[i - 1].StartTime, ZDataAllZone[i - 1].Minutes);
                            ZDataAllZone[i].StartTime = $com.util.format("yyyy-MM-dd hh:mm:ss", new Date(ZDataAllZone[i].StartTime));
                        }
                        for (var i = 0; i < ZDataAllZone.length; i++) {

                            ZDataAllZone[i].StartTime = $com.util.format("yyyy-MM-dd hh:mm:ss", new Date(ZDataAllZone[i].StartTime));

                            $com.util.deleteLowerProperty(ZDataAllZone[i]);

                        }
                        model.com.updateFMCTimeZone({
                            ShiftID: mShiftID,
                            data: ZDataAllZone
                        }, function (res) {

                            //保存shift
                            var _list = [];
                            for (var i = 0; i < ZDataAllShift.length; i++) {
                                if (mShiftID == ZDataAllShift[i].ID) {
                                    _list.push(ZDataAllShift[i]);
                                }
                            }

                            _list[0].StartTime = ZDataAllZone[0].StartTime;
                            _list[0].Minutes = 0;
                            _list[0].IdleMinutes = 0;
                            _list[0].WorkMinutes = 0;
                            for (var i = 0; i < ZDataAllZone.length; i++) {
                                if (ZDataAllZone[i].IdleOrWork) {
                                    _list[0].WorkMinutes += ZDataAllZone[i].Minutes;

                                } else {
                                    _list[0].IdleMinutes += ZDataAllZone[i].Minutes;
                                }
                            }
                            _list[0].Minutes = _list[0].IdleMinutes + _list[0].WorkMinutes;
                            _list[0].EndTime = model.com.getTime(_list[0].StartTime, _list[0].Minutes);

                            _list[0].StartTime = $com.util.format("yyyy-MM-dd hh:mm:ss", new Date(_list[0].StartTime));
                            _list[0].EndTime = $com.util.format("yyyy-MM-dd hh:mm:ss", new Date(_list[0].EndTime));

                            $com.util.deleteLowerProperty(_list[0]);
                            model.com.updateFMCShift({
                                data: _list[0]
                            }, function (res) {

                                //保存workDay
                                var _listDay = [];
                                for (var i = 0; i < ZDataAll.length; i++) {
                                    if (mDayID == ZDataAll[i].ID) {
                                        _listDay.push(ZDataAll[i]);
                                    }
                                }

                                _listDay[0].StartTime = ZDataAllShift[0].StartTime;
                                _listDay[0].Minutes = 0;
                                _listDay[0].IdleMinutes = 0;
                                _listDay[0].WorkMinutes = 0;
                                for (var i = 0; i < ZDataAllShift.length; i++) {
                                    if (ZDataAllShift[i].Active) {
                                        _listDay[0].WorkMinutes += ZDataAllShift[i].WorkMinutes;
                                        _listDay[0].IdleMinutes += ZDataAllShift[i].IdleMinutes;
                                    }
                                }
                                _listDay[0].Minutes = _listDay[0].IdleMinutes + _listDay[0].WorkMinutes;
                                //_listDay[0].EndTime = model.com.getTime(_listDay[0].StartTime, _listDay[0].Minutes);
                                _listDay[0].EndTime = ZDataAllShift[ZDataAllShift.length - 1].EndTime;

                                _listDay[0].StartTime = $com.util.format("yyyy-MM-dd hh:mm:ss", new Date(_listDay[0].StartTime));
                                _listDay[0].EndTime = $com.util.format("yyyy-MM-dd hh:mm:ss", new Date(_listDay[0].EndTime));
                                $com.util.deleteLowerProperty(_listDay[0]);
                                model.com.updateFMCWorkDay({
                                    data: _listDay[0]
                                }, function (res) {

                                    alert("修改成功");
                                    model.com.refresh();


                                })


                            })
                        })

                    }, TypeSource_ZONE));
                }

            });
            //zace-closeLine-zone
            $("body").delegate("#zace-closeLine-zone", "click", function () {
                $(".zzzz").hide();
                $(".zzzc").css("width", "0px");
                $(".zzza").css("margin-right", "0px");
                $(".zzzc").hide();
                $(".zzza").show();

            });







        },



        run: function () {
            //var a = "false";
            //a = eval(a.toLowerCase());
            //if (a) {
            //    alert(1);
            //}
            //b = Boolean("false");
            //if (b) {
            //    alert(2);
            //}




            model.com.getModuleAll({ module: 600001 }, function (resModule1) {
                if (resModule1 && resModule1.list) {
                    DataModule1List = resModule1.list;
                    $.each(resModule1.list, function (i, item) {
                        TypeSource_SHIFT.LevelID.push({
                            name: item.ItemName,
                            value: item.ID,
                            far: null
                        })
                    });
                }
                model.com.refresh();
            });
        },

        com: {

            refresh: function () {

                model.com.getFMCWorkDay({
                    Active: -1
                }, function (res) {
                    if (res && res.list) {

                        ZDataAll = $com.util.Clone(res.list);
                        var _list = $com.util.Clone(res.list);
                        $.each(_list, function (i, item) {


                            item.Badge = " ";

                            if (item.Active == 1) {
                                item.ISAllowedText = "禁用";
                                item.ISAllowed = "lmvt-allowed-delete";
                                item.ClassBadge = "lmvt-activeBadge";

                            } else {
                                item.ISAllowedText = "启用";
                                item.ISAllowed = "lmvt-do-active";
                                item.ClassBadge = "lmvt-defBadge";
                            }


                            for (var p in item) {
                                if (!FORMATTRT_MODE[p])
                                    continue;
                                item[p] = FORMATTRT_MODE[p](item[p]);
                            }
                            item.WID = i + 1;
                        });

                        ZDataAllChange = $com.util.Clone(_list);
                        $("#femi-day-tbody").html($com.util.template(_list, HTML.TableWorkDayNode));
                    }


                });

                model.com.getFMCShift({ WorkDayID: mDayID }, function (resS) {
                    if (resS && resS.list) {

                        ZDataAllShift = $com.util.Clone(resS.list);
                        var _list = $com.util.Clone(resS.list);
                        $.each(_list, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_SHIFT[p])
                                    continue;
                                item[p] = FORMATTRT_SHIFT[p](item[p]);
                            }
                            item.WID = i + 1;
                        });
                        $("#femi-shift-tbody").html($com.util.template(_list, HTML.TableShiftNode));
                    }

                });

                model.com.getFMCTimeZone({ ShiftID: mShiftID }, function (resZ) {
                    if (resZ && resZ.list) {

                        ZDataAllZone = $com.util.Clone(resZ.list);
                        var _list = $com.util.Clone(resZ.list);
                        $.each(_list, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_ZONE[p])
                                    continue;
                                item[p] = FORMATTRT_ZONE[p](item[p]);
                            }
                            item.WID = i + 1;
                        });
                        $("#femi-zone-tbody").html($com.util.template(_list, HTML.TableZoneNode));
                    }

                });


            },
            //得到枚举
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

            //Day 班次
            getFMCWorkDay: function (data, fn, context) {
                var d = {
                    $URI: "/FMCWorkDay/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //Day 更新班次
            updateFMCWorkDay: function (data, fn, context) {
                var d = {
                    $URI: "/FMCWorkDay/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //Day 
            activeFMCWorkDay: function (data, fn, context) {
                var d = {
                    $URI: "/FMCWorkDay/Active",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //shift 班次
            getFMCShift: function (data, fn, context) {
                var d = {
                    $URI: "/FMCShift/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //shift 更新班次
            updateFMCShift: function (data, fn, context) {
                var d = {
                    $URI: "/FMCShift/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //shift 
            activeFMCShift: function (data, fn, context) {
                var d = {
                    $URI: "/FMCShift/Active",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //zone详细
            getFMCTimeZone: function (data, fn, context) {
                var d = {
                    $URI: "/FMCTimeZone/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //zone 更新详细
            updateFMCTimeZone: function (data, fn, context) {
                var d = {
                    $URI: "/FMCTimeZone/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            refresh1: function () {
                model.com.get({ WorkShopID: WorkShopID }, function (res) {

                    if (res && res.info) {
                        DataAll_shift = res.info.ShiftList;
                        for (var i = 0; i < DataAll_shift.length; i++) {
                            model.com.getWorkTime(i);
                        }
                        //日工作时长
                        model.com.updateShiftOrMin(res.info);
                        DataAll = res.info;
                        var _list = $com.util.Clone(DataAll);
                        $.each(_list, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_MODE[p])
                                    continue;
                                item[p] = FORMATTRT_MODE[p](item[p]);
                            }
                        });

                        model.com.getInputValue(DataAll);
                        //model.com.getWorkTime(2);
                        //model.com.getWorkTime(1);
                        var _listz = $com.util.Clone(DataAll_shift);
                        $.each(_listz, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_SHIFT[p])
                                    continue;
                                item[p] = FORMATTRT_SHIFT[p](item[p]);
                            }
                            item.WID = i + 1;
                            //_listz[i].StartTime = $com.util.format("hh:mm:ss", _listz[i].StartTime);

                        });

                        $("#femi-shift-tbody").html($com.util.template(_listz, HTML.TableShiftNode));

                        model.com.getZoneValue(Did);
                    }




                });
            },

            //工厂设置时间总和  班次总和
            updateShiftOrMin: function (list) {
                list.DayMinutes = 0;
                for (var i = 0; i < list.ShiftList.length; i++) {
                    list.DayMinutes += list.ShiftList[i].WorkMinutes;

                }

                list.Shift = list.ShiftList.length;
                return list;
            },


            //班次详情数据渲染
            getZoneValue: function (id) {
                if (DataAll_shift && DataAll_shift[id].IdleZoneList) {
                    var _listZone = $com.util.Clone(DataAll_shift[id].IdleZoneList);
                    $.each(_listZone, function (i, item) {
                        for (var p in item) {
                            if (!FORMATTRT_ZONE[p])
                                continue;
                            item[p] = FORMATTRT_ZONE[p](item[p]);
                        }
                        item.WID = i + 1;
                        //  _listZone[i].StartTime = $com.util.format("hh:mm:ss", _listZone[i].StartTime);
                        // _listZone[i].IdleOrWork = model.com.ZONEFORMATTRT(_listZone[i].IdleOrWork);

                    });
                    $("#femi-zone-tbody").html($com.util.template(_listZone, HTML.TableZoneNode));
                }

            },

            getNewShiftList: function (_source, set_data) {
                if (!_source)
                    _source = [];
                if (!set_data)
                    set_data = [];
                var rst = [];
                for (var i = 0; i < _source.ShiftList.length; i++) {
                    var NotOWn = false;
                    for (var j = 0; j < set_data.length; j++) {
                        if (_source.ShiftList[i].ID == set_data[j].ID) {
                            _source.ShiftList.splice(i, 1);
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

            getTime: function (startTime, minutes) {
                var date = new Date(startTime);
                var min = date.getMinutes();
                date.setMinutes(min + minutes);
                return $com.util.format("yyyy-MM-dd hh:mm:ss", date);

            },

            getWorkTime: function (id) {
                DataAll_shift[id].WorkMinutes = 0;
                DataAll_shift[id].IdleMinutes = 0;
                for (var i = 0; i < DataAll_shift[id].IdleZoneList.length; i++) {

                    if (DataAll_shift[id].IdleZoneList[i].IdleOrWork) {
                        DataAll_shift[id].WorkMinutes += DataAll_shift[id].IdleZoneList[i].Minutes;
                    }
                    else {
                        DataAll_shift[id].IdleMinutes += DataAll_shift[id].IdleZoneList[i].Minutes;
                    }
                    DataAll_shift[id].Minutes = DataAll_shift[id].WorkMinutes + DataAll_shift[id].IdleMinutes;

                }
            },
            isDot: function (num) {
                var result = (num.toString()).indexOf(".");
                if (result != -1) {
                    alert("时长为整数!!!");
                    return;
                }
            },
            getMIn: function (date1, date2) {
                var date1 = new Date(date1);

                var date2 = new Date(date2);

                var s1 = date1.getTime(),
                    s2 = date2.getTime();

                var total = (s2 - s1) / 1000;

                var day = parseInt(total / (24 * 60 * 60));//计算整数天数

                var afterDay = total - day * 24 * 60 * 60;//取得算出天数后剩余的秒数

                var hour = parseInt(afterDay / (60 * 60));//计算整数小时数

                var afterHour = total - day * 24 * 60 * 60 - hour * 60 * 60;//取得算出小时数后剩余的秒数

                var min = parseInt(afterHour / 60);//计算整数分

                var afterMin = total - day * 24 * 60 * 60 - hour * 60 * 60 - min * 60;//取得算出分后剩余的秒数
                var Amin = day * 24 * 60 + hour * 60 + min;

                return Amin;
            }
        }
    });

    model.init();


});