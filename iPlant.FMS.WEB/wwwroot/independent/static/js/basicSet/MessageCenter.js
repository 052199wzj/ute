require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/bootstrap-select', '../static/utils/js/base/base', '../static/utils/js/base/paging'], function ($zace, $select, $com, $page) {

    var KEYWORD,
        KEYWORD_LIST,
        model,
        DEFAULT_VALUE,
        TypeSource,
        DataAll,
        FORMATTRT,
        DataAllSearch,

        //表格中的数据
        NewsListByPage,
        //未做集合
        UnDolist,
        UnDoSource,

        //eventModuleList集合
        EventModuleList = "",

        //已办集合
        HasDoList,
        HasDoSource,
        //通知集合
        NoticeList,
        NoticeSource,
        //消息对应的状态数组
        ACTIVE,
        TYPE,
        //查询开始结束时间
        EndTime,
        StartTime,
        //类型
        Order,
        //所有功能集合
        MESEnumAll,

        //是否启用时间查询
        ISTime = 0,

        SearchType = 0,

        mGrad,
        wRoleTree,
        HTML;
    mActive = 1;
    var p_flag = false;
    DataAllSearch = [];
    DataPosition = [];


    ACTIVE = ["未读", "未读", "已读", "已处理", "已关闭"];
    TYPE = ["默认", "通知", "任务"];

    KEYWORD_LIST = [
        "StartTime|开始时间|DateTime",
        "EndTime|结束时间|DateTime",
    ];

    HTML = {
        NewTep: [
            '<tr data-color="">',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  data-title="WID" data-value="{{WID}}">{{WID}}</td>',
            '<td data-title="Title" data-value="{{Title}}">{{Title}}</td>',
            '<td data-title="MessageText" data-value="{{MessageText}}">{{MessageText}}</td>',
            '<td data-title="ModuleID" data-value="{{ModuleID}}">{{ModuleID}}</td>',
            '<td data-title="Active" data-value="{{Active}}"><span class="badge {{ClassBadge}}">{{Badge}}</span>{{Active}}</td>',
            '<td data-title="CreateTime" data-value="{{CreateTime}}">{{CreateTime}}</td>',
            '<td data-title="Handle" data-value="{{ID}}"><div class="row">',
            '<div class="col-md-6 lmvt-lookinfo">查看详情</div>',
            '<div class="col-md-6 lmvt-read {{ISAllowed}}">标为已读</div>',
            '</div></td>',
            '</tr>',
        ].join(""),

        TableRoleUserItemNode: [
            '<tr data-color="">',
            // '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="FunctionID" data-value="">{{RoleName}}</td>',
            '<td data-title="RoleID" data-value="">{{Text}}</td>',
            '</tr>',
        ].join(""),

    };
    FORMATTRT = {};
    DataAll = [];
    KEYWORD = {};
    DEFAULT_VALUE = {};
    TypeSource = {
        Active: [
            {
                name: "禁用",
                value: 0,
            }, {
                name: "启用",
                value: 1,
            }],
        DepartmentID: [{
            name: "无",
            value: 0,
        }],
        Position: [{
            name: "无",
            value: 0,
            far: 0,
        }],
        Manager: [{
            name: "无",
            value: 0,
        }],
    };

    $.each(KEYWORD_LIST, function (i, item) {
        var detail = item.split("|");
        KEYWORD[detail[0]] = {
            index: i,
            name: detail[1],
            type: detail.length > 2 ? detail[2] : undefined,
            control: detail.length > 3 ? detail[3] : undefined,
        };
        if (detail.length > 2) {
            FORMATTRT[detail[0]] = $com.util.getFormatter(TypeSource, detail[0], detail[2]);
        }
    });
    model = $com.Model.create({
        name: '消息中心',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var value = $("#femi-search-text-ledger").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#lmvt-news-tbody").children("tr").show();
                    else {
                        //$com.table.filterByLikeString($("#femi-user-tbody"), DataAllSearch, value, "ID");
                        $com.table.filterByLikeStringData($("#lmvt-news-tbody"), NewsListByPage, value, undefined, undefined, undefined, function (res) {
                            $("#lmvt-news-tbody").html($com.util.template(res, HTML.NewTep));
                        });
                    }
                }
            });
            $("body").delegate("#zace-search-userS", "click", function () {
                var value = $("#femi-search-text-ledger").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-user-tbody").children("tr").show();
                else {
                    $com.table.filterByLikeStringData($("#lmvt-news-tbody"), NewsListByPage, value, undefined, undefined, undefined, function (res) {
                        $("#lmvt-news-tbody").html($com.util.template(res, HTML.NewTep));
                    });

                }
                //$page.getSearchList(value);
            });
            //消息切换
            $("body").delegate(".nav-pills li", "click", function () {
                $(".nav-pills li").each(function (i, item) {
                    $(item).removeClass("active");
                });
                var $this = $(this);
                $this.addClass("active");
                if (Order == Number($this.attr("data-value"))) {
                    return false;
                } else
                    Order = Number($this.attr("data-value"));
                switch (Order) {
                    case 1:
                        model.com.refresh();
                        break;
                    case 2:
                        model.com.refreshHasDo(StartTime, EndTime, true);

                        break;
                    case 3:
                        model.com.refreshNotice(StartTime, EndTime, true);
                        break;
                    default:
                        break;
                }
            });
            //全部已读
            $("body").delegate(".AllRead", "click", function () {

                var arr = $com.table.getSelectionTitle($("#lmvt-news-tbody"), "ID");

                if (arr.length <= 0) {
                    alert("当前未选择任何数据！！！");
                    return;
                }

                switch (Order) {
                    case 1:
                        model.com.postMsgRead({
                            MsgIDList: arr,
                        }, function (res1) {
                            model.com.refresh();
                            alert("操作成功");
                        });

                        break;
                    case 2:
                        break;
                    case 3:

                        model.com.postMsgRead({
                            MsgIDList: arr,
                        }, function (res1) {
                            model.com.refreshNotice(StartTime, EndTime, true);
                            alert("操作成功");
                        });
                        break;
                    default:
                        break;
                }
            });
            //时间选择
            $("body").delegate("#lmvt-time", "click", function () {

                let DEFAULT_VALUE = {
                    StartTime: StartTime,
                    EndTime: EndTime,
                };

                $("body").append($com.modal.show(DEFAULT_VALUE, KEYWORD, "时间段选择", function (rst) {
                    //调用插入函数

                    if (!rst || $.isEmptyObject(rst))
                        return;

                    EndTime = $com.util.format(rst.EndTime);
                    StartTime = $com.util.format(rst.StartTime);

                    $("#lmvt-time").text(StartTime + " 至 " + EndTime);

                }, TypeSource));

            });
            //类型选择 任务
            $("body").delegate("#lmvt-mission", "click", function () {
                SearchType = 2;
                $(".lmvt-changeName").text("任务");
            });
            //类型选择 通知
            $("body").delegate("#lmvt-notice", "click", function () {
                SearchType = 1;
                $(".lmvt-changeName").text("通知");
            });
            //类型选择 全部
            $("body").delegate("#lmvt-allNews", "click", function () {
                SearchType = 0;
                $(".lmvt-changeName").text("全部");
            });
            //查询
            $("body").delegate("#lmvt-search", "click", function () {
                ISTime = 1;
                //查询开始时间
                StartTime = $("#lmvt-startTime").val();
                //查询结束时间
                EndTime = $("#lmvt-endTime").val();

                if (StartTime == "" || EndTime == "") {
                    alert("时间未选择！");
                    return;
                }

                EventModuleList = $(".selectpicker").val().join(",");

                if (EventModuleList.length <= 0) {
                    alert("功能未选择！");
                    return;
                }
                $com.app.loading("加载中");
                switch (Order) {
                    case 1:
                        model.com.refresh();

                        break;
                    case 2:
                        break;
                    case 3:
                        model.com.refreshNotice(StartTime, EndTime, true);
                        break;
                    default:
                        break;
                }
                $com.app.loaded("加载中");
            });
            //重置
            $("body").delegate("#lmvt-reset", "click", function () {

                $("#lmvt-startTime").val("");
                $("#lmvt-endTime").val("");

                $(".selectpicker").selectpicker('deselectAll');

                ISTime = 0;
            });

            //查看详情
            $("body").delegate(".lmvt-lookinfo", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value")),
                    IsActive,
                    MessageID,
                    ModuleID,
                    MessageTime,
                    StepID;


                //消息详情对象
                let SourceObj = {};

                switch (Order) {
                    case 1:
                        SourceObj = UnDoSource.filter(item => item.ID == wID)[0];
                        break;
                    case 2:
                        SourceObj = HasDoSource.filter(item => item.ID == wID)[0];
                        break;
                    case 3:
                        SourceObj = NoticeSource.filter(item => item.ID == wID)[0];
                        break;
                    default:
                        break;
                }

                IsActive = Number(SourceObj.Active);
                ModuleID = Number(SourceObj.ModuleID);
                MessageID = Number(SourceObj.MessageID);
                StepID = Number(SourceObj.StepID);
                MessageTime = SourceObj.CreateTime;

                //菜单对象
                const MenuObj = AllModelList.filter(item => item.EventModule == ModuleID)[0];

                if (typeof (MenuObj) == "undefined") {
                    alert("此类消息请到手机app上查看");
                    return;
                }

                if (IsActive == 1 || IsActive == 0) {
                    var arr = [];
                    arr.push(wID);
                    model.com.postMsgRead({
                        MsgIDList: arr,
                    }, function (res1) {

                        switch (Order) {
                            case 1:
                                model.com.refresh();
                                break;
                            case 2:
                                break;
                            case 3:
                                model.com.refreshNotice(StartTime, EndTime, true);
                                break;
                            default:
                                break;
                        }
                        model.com.skip(ModuleID, MessageID, MessageTime, StepID, MenuObj);
                    });
                } else {
                    model.com.skip(ModuleID, MessageID, MessageTime, StepID, MenuObj);
                }

            });

            //标为已读
            $("body").delegate(".lmvt-allowed-delete", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var arr = [];
                arr.push(wID);

                model.com.postMsgRead({
                    MsgIDList: arr,
                }, function (res1) {
                    alert("操作成功");
                    switch (Order) {
                        case 1:
                            model.com.refresh();
                            break;
                        case 2:
                            break;
                        case 3:
                            model.com.refreshNotice(StartTime, EndTime, true);
                            break;
                        default:
                            break;
                    }
                });
            });

        },

        run: function () {
            // $(".show-tick").hide();
            model.com.getMESEnumAll({module: 400003}, function (res) {
                $.each(res.list, function (i, item) {
                    if (item.ID <= 0)
                        return true;
                    $(".selectpicker").append("<option value=" + item.ID + ">" + item.ItemText + "</option>");
                });

                MESEnumAll = res.list;

                $(".selectpicker").selectpicker({
                    noneSelectedText: '请选择',//默认显示内容
                    deselectAllText: '全不选',
                    selectAllText: '全选',
                });
                // $(".show-tick").show();
            });

            EndTime = $com.util.format("yyyy-MM-dd hh:mm", new Date());
            StartTime = $com.util.format("yyyy-MM-dd 00:00", new Date());

            $("#lmvt-startTime").datetimepicker({
                format: 'yyyy-mm-dd',//显示格式
                // startView: 2,
                minView: 2,
                maxView: 2,
                language: 'zh-CN',
                autoclose: 1,//选择后自动关闭
                clearBtn: false,//清除按钮
            }).on('changeDate', function (ev) {
                var startTime = $("#lmvt-startTime").val();
                $("#lmvt-endTime").datetimepicker("setStartDate", startTime);
            });
            $("#lmvt-endTime").datetimepicker({
                format: 'yyyy-mm-dd',//显示格式
                // startView: 2,
                minView: 2,
                maxView: 2,
                language: 'zh-CN',
                autoclose: 1,//选择后自动关闭
                clearBtn: false,//清除按钮
            }).on('changeDate', function (ev) {
                var endTime = $("#lmvt-endTime").val();
                $("#lmvt-startTime").datetimepicker("setEndDate", endTime.toString("yyyy-MM-dd"));

            });
            Order = 1;

            model.com.getMenu(
                function () {
                    model.com.refresh();
                    model.com.refreshHasDo(StartTime, EndTime, false);
                    model.com.refreshNotice(StartTime, EndTime, false);
                },
            );
        },

        com: {
            //获取所有的模块
            getMESEnumAll: function (data, fn, context) {
                var d = {
                    $URI: "/MESEnum/All",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取菜单模块目录
            getMenu: function (fn) {

                Data_Menu = window.parent.Data_Menu;

                AllModelList = [];
                $.each(Data_Menu, function (i, item) {
                    if (item.ModuleList && item.ModuleList.length > 0) {
                        AllModelList = AllModelList.concat(item.ModuleList);
                    }
                });

                fn();
            },
            //打开消息详情
            skip: function (ID, MessageID, MessageTime, StepID, menuObj) {

                //菜单路径
                var href = menuObj.Url,
                    //图标链接
                    scr = menuObj.Icon,
                    id = menuObj.ID,
                    //名称
                    header = menuObj.Name;

                //href 可以自己拼接后面的参数

                switch (ID) {
                    case 1012:

                        window.iframeHeaderSet({
                            'header': header,
                            'href': href,
                            'id': id,
                            'src': scr,
                        });
                        break;
                    default:
                        break;
                }
            },
            //将从未读变成已读
            postMsgRead: function (data, fn, context) {
                var d = {
                    $URI: "/HomePage/MsgRead",
                    $TYPE: "post",
                };

                function err() {
                    //$com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //将选择消息变成已读
            postHasRead: function (source, fn) {
                var arr = [];
                $.each(source, function (i, item) {
                    if (item.Active == 0 || item.Active == 1) {
                        arr.push(item.ID);
                    }
                });
                fn(arr);
            },
            //通知
            getGetNoticeList: function (data, fn, context) {
                var d = {
                    $URI: "/HomePage/GetNoticeList",
                    $TYPE: "get",
                };

                function err() {
                    //$com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //代办
            getGetUnDoList: function (data, fn, context) {
                var d = {
                    $URI: "/HomePage/GetUnDoList",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //已办
            getGetHasDoList: function (data, fn, context) {
                var d = {
                    $URI: "/HomePage/GetHasDoList",
                    $TYPE: "get",
                };

                function err() {
                    //$com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //分页渲染
            randerTable: function (data) {
                $page.init($(".newsTable"), data, "", function (res) {
                    $("#lmvt-news-tbody").html($com.util.template(res, HTML.NewTep));
                    NewsListByPage = res;
                });
            },
            //代办
            refresh: function () {
                model.com.getGetUnDoList({}, function (res) {
                    if (res && res.list) {

                        UnDolist = $com.util.Clone(res.list);

                        UnDoSource = $com.util.Clone(res.list);

                        if (res.info == 0) {
                            res.info = "";
                        }

                        $.each(UnDolist, function (k, ktem) {
                            ktem.WID = k + 1;
                            ktem.ModuleID = MESEnumAll.filter(item => item.ID == ktem.ModuleID)[0].ItemText;
                            ktem.Badge = " ";
                            ktem.CreateTime = $com.util.format("yyyy-MM-dd hh:mm:ss");

                            if (ktem.Active == 0 || ktem.Active == 1) {
                                ktem.ClassBadge = "lmvt-forbiddenBadge";
                                ktem.ISAllowed = "lmvt-allowed-delete";
                            } else {
                                ktem.ClassBadge = "lmvt-activeBadge";
                                ktem.ISAllowed = "lmvt-not-allowed-delete";
                            }
                            ktem.Active = ACTIVE[ktem.Active];
                        });
                        $("#MustDo1").text(res.info);
                        //$("#lmvt-news-tbody").html($com.util.template(UnDolist, HTML.NewTep));
                        model.com.randerTable(UnDolist);
                    }

                });
            },
            //已办
            refreshHasDo: function (StartTime, EndTime, Temp) {
                model.com.getGetHasDoList({
                    StartTime: StartTime,
                    EndTime: EndTime,
                    EventModules: EventModuleList,
                    UseTime: ISTime,
                }, function (Dores) {
                    if (!Dores)
                        return;
                    var list = Dores.list,
                        rst = [];

                    HasDoList = $com.util.Clone(Dores.list);
                    HasDoSource = $com.util.Clone(Dores.list);
                    $.each(HasDoList, function (k, ktem) {
                        ktem.WID = k + 1;
                        ktem.ModuleID = MESEnumAll.filter(item => item.ID == ktem.ModuleID)[0].ItemText;
                        ktem.Badge = " ";
                        ktem.CreateTime = $com.util.format("yyyy-MM-dd hh:mm:ss");

                        if (ktem.Active == 0 || ktem.Active == 1) {
                            ktem.ClassBadge = "lmvt-forbiddenBadge";
                            ktem.ISAllowed = "lmvt-allowed-delete";
                        } else {
                            ktem.ClassBadge = "lmvt-activeBadge";
                            ktem.ISAllowed = "lmvt-not-allowed-delete";
                        }
                        ktem.Active = ACTIVE[ktem.Active];
                    });

                    //$("#HasDo2").text(Dores.info);

                    if (Temp) {
                        //$("#lmvt-news-tbody").html($com.util.template(HasDoList, HTML.NewTep));
                        model.com.randerTable(HasDoList);
                    }
                });
            },
            //通知
            refreshNotice: function (StartTime, EndTime, Temp) {
                //通知集合
                model.com.getGetNoticeList({
                    StartTime: StartTime,
                    EndTime: EndTime,
                    EventModules: EventModuleList,
                    UseTime: ISTime,
                }, function (Noce) {
                    if (!Noce)
                        return;
                    var list = Noce.list,
                        rst = [];

                    if (Noce.info == 0) {
                        Noce.info = "";
                    }

                    NoticeList = $com.util.Clone(Noce.list);
                    NoticeSource = $com.util.Clone(Noce.list);
                    $.each(NoticeList, function (k, ktem) {
                        ktem.WID = k + 1;
                        ktem.ModuleID = MESEnumAll.filter(item => item.ID == ktem.ModuleID)[0].ItemText;
                        ktem.Badge = " ";
                        ktem.CreateTime = $com.util.format("yyyy-MM-dd hh:mm:ss");

                        if (ktem.Active == 0 || ktem.Active == 1) {
                            ktem.ClassBadge = "lmvt-forbiddenBadge";
                            ktem.ISAllowed = "lmvt-allowed-delete";
                        } else {
                            ktem.ClassBadge = "lmvt-activeBadge";
                            ktem.ISAllowed = "lmvt-not-allowed-delete";
                        }
                        ktem.Active = ACTIVE[ktem.Active];
                    });

                    $("#News3").text(Noce.info);

                    if (Temp) {
                        //$("#lmvt-news-tbody").html($com.util.template(NoticeList, HTML.NewTep));
                        model.com.randerTable(NoticeList);
                    }

                });
            },
            add: function (data, fn, context) {
                var d = {
                    $URI: "/User/Update",
                    $TYPE: "post",
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            reset: function (data, fn, context) {
                var d = {
                    $URI: "/User/RetrievePassword",
                    $TYPE: "post",
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            RemoveUser: function (data, fn, context) {
                var d = {
                    $URI: "/User/Delete",
                    $TYPE: "post",
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            active: function (data, fn, context) {
                var d = {
                    $URI: "/User/Active",
                    $TYPE: "post",
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
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
                                value: item.ID,
                                name: item.Name,
                                far: item.DepartmentID,
                            });
                    });
                    return _rst;
                },
            },
        },
    });

    model.init();


});
