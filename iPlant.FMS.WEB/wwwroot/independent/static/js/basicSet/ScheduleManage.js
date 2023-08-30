require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'],
    function ($lin, $com) {

        var HTML,
            PartList_Basic_Son,
            DEFAULT_VALUE_Arrange,
            KETWROD_LIST_Arrange,
            KETWROD_Template_Arrange,
            Formattrt_Arrange,
            TypeSource_Arrange,

            DataAll_group,
            KEYWORD_user,
            KEYWORD_LIST_user,
            DEFAULT_VALUE_user,
            TypeSource_user,
            DataAll_user,
            FORMATTRT_user,

            mGroupID,
            mID,
            mZaceValue,
            mName,

            WorkLinePartList,
            res_Position_Basic2001,
            res_Position_Basic3001,
            res_Position_Basic,
            HeadersPosition;

        HeadersPosition = {
            "10001": "管理",
        };
        mGroupID = 1;

        HTML = {
            ArrangeList: [
                '<tr>',
                '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></th>',
                '<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
                '<td style="min-width: 50px" data-title="PositionName" data-value="{{PositionName}}" >{{ PositionName}}</td>',
                '<td style="min-width: 50px" data-title="MemberName" data-value="{{MemberName}}" >{{ MemberName}}</td>',
                '<tr>',
            ].join(""),

            TableUserItemNode: [
                '<tr>',
                '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
                '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
                '<td data-title="DepartmentID" data-value="{{DepartmentID}}" >{{DepartmentID}}</td>',
                '<td data-title="Position" data-value="{{Position}}" >{{Position}}</td>',
                '<td data-title="DutyID" data-value="{{DutyID}}" >{{DutyID}}</td>',
                '</tr>',
            ].join(""),
        };

        //管理排班模板
        $(function () {
            KETWROD_LIST_Arrange = [
                "PositionID|车间|ArrayOne",
                "MemberID|产线|ArrayOne",
            ];
            KETWROD_Template_Arrange = {};

            Formattrt_Arrange = {};

            TypeSource_Arrange = {
                PositionID: [{
                    name: "全部",
                    value: 0,
                },
                ],
                MemberID: [{
                    name: "全部",
                    value: 0,
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
        });


        //员工表
        $(function () {

            KEYWORD_LIST_user = [
                "Name|姓名",
                "DepartmentID|部门|ArrayOneControl",
                "Position|岗位|ArrayOneControl|DepartmentID",
                "DutyID|部门|ArrayOne",

            ];

            DataAll_user = [];
            FORMATTRT_user = {};
            KEYWORD_user = {};

            TypeSource_user = {

                DepartmentID: [{
                    name: "无",
                    value: 0,
                }],
                Position: [{
                    name: "无",
                    value: 0,
                    far: 0,
                }],
                DutyID: [{
                    name: "全部",
                    value: 0,
                }, {
                    name: "生产员",
                    value: 1001,
                }, {
                    name: "电修工",
                    value: 2001,
                }, {
                    name: "机修工",
                    value: 3001,
                }, {
                    name: "计量员",
                    value: 4001,
                }, {
                    name: "巡检员",
                    value: 5001,
                }, {
                    name: "入库检验员",
                    value: 5002,
                }, {
                    name: "工艺员",
                    value: 6001,
                }, {
                    name: "配料员",
                    value: 7001,
                }, {
                    name: "收料员",
                    value: 7002,
                }, {
                    name: "辅料员",
                    value: 7004,
                }, {
                    name: "操作员",
                    value: 8001,
                }, {
                    name: "管理",
                    value: 10001,
                }],
            };

            $.each(KEYWORD_LIST_user, function (i, item) {
                var detail = item.split("|");
                KEYWORD_user[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined,
                };
                if (detail.length > 2) {
                    FORMATTRT_user[detail[0]] = $com.util.getFormatter(TypeSource_user, detail[0], detail[2]);
                }
            });
        });


        model = $com.Model.create({
            name: '管理排班模板',

            type: $com.Model.MAIN,

            configure: function () {
                this.run();
            },

            events: function () {
                //人员修改
                $("body").delegate("#femi-user-tbody tr", "dblclick", function () {
                    var $this = $(this);
                    var WID = $this.find('td[data-title=ID]').attr('data-value');
                    var WName = $this.find('td[data-title=Name]').attr('data-value');


                    switch (mZaceValue) {
                        case 10001:

                            res_Position_Basic[mID - 1].MemberID = WID;
                            res_Position_Basic[mID - 1].MemberName = WName;

                            var res_Position = [];
                            res_Position.push(res_Position_Basic[mID - 1]);

                            model.com.postManager({
                                Module: 10001,
                                data: res_Position,
                            }, function (res) {
                                //alert("将管理员 " + mName + " 修改为 " + WName);
                                $(".zace-left").show();
                                $(".zace-right").hide();
                                model.com.refresh();
                            });

                            break;
                    }
                });

                //清除
                $("body").delegate("#zace-del-schedule", "click", function () {

                    switch (mZaceValue) {
                        case 10001:

                            res_Position_Basic[mID - 1].MemberID = 0;
                            res_Position_Basic[mID - 1].MemberName = "";

                            var res_Position = [];
                            res_Position.push(res_Position_Basic[mID - 1]);

                            model.com.postManager({
                                Module: 10001,
                                data: res_Position,
                            }, function (res) {
                                // alert("将管理员 " + mName + " 清除");
                                $(".zace-left").show();
                                $(".zace-right").hide();
                                model.com.refresh();
                            });

                            break;
                    }

                });


                //双击展开   员工选择               
                $("body").delegate("#femi-manage-tbody td[data-title=MemberName]", "dblclick", function () {

                    $(".zace-left").hide();
                    $(".zace-right").show();

                    var $this = $(this);
                    var name = $this.attr('data-value');
                    mID = $this.parent().find("td[data-title=WID]").attr("data-value");
                    mZaceValue = 10001;
                    mName = name;


                });


                $("#zace-modelist").change(function () {

                    mGroupID = $("#zace-modelist").val();

                    var sop = document.getElementById("zace-modelist");
                    var index = sop.selectedIndex;
                    var name = sop[index].text;
                    //$(".zace-input").val(name);
                    $('#zace-span-text').html(name);
                    $("#zace-modelist option[value=mGroupID]").selected = true;
                    //查询模板
                    $("body").delegate("#zace-search-mode", "click", function () {

                        model.com.refresh();

                    });
                });
                //用户表返回
                $("body").delegate("#zace-exit-user", "click", function () {
                    $(".zace-left").show();
                    $(".zace-right").hide();
                    $(".zace-mode").hide();


                });
                //用户查询
                $("#userSelect").change(function () {
                    var opt = $("#userSelect").val();
                    var default_value = {
                        DutyID: 0,
                    };
                    //alert(opt);
                    default_value.DutyID = opt;
                    $com.table.filterByConndition($("#femi-user-tbody"), DataAll_user, default_value, "ID");
                });


                //导出
                $("body").delegate("#zace-down-schedule", "click", function () {
                    var $table = $(".zace-table-export"),
                        fileName = "管理排班模板.xls",
                        Title = "管理排班模板";
                    var params = $com.table.getExportParams($table, fileName, Title);

                    model.com.getExportExcel(params, function (res) {
                        var src = res.info.path;
                        window.open(src);
                    });


                });


            },
            run: function () {
                $(".zace-right").hide();
                $(".zace-mode").hide();
                //得到部门  岗位   用户渲染员工表
                model.com.getDepartment({}, function (res) {
                    if (!res)
                        return;
                    var list = res.list,
                        rst = [];
                    if (list) {
                        rst = model.com.utils.getSon(list);
                    }

                    if (TypeSource_user.DepartmentID.length > 1)
                        TypeSource_user.DepartmentID.splice(1, TypeSource_user.DepartmentID.length - 1);
                    TypeSource_user.DepartmentID = TypeSource_user.DepartmentID.concat(model.com.utils.getSource(rst));

                    //得到岗位  用户
                    model.com.getPosition({}, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];
                        if (list) {
                            rst = model.com.utils.getSon(list);
                        }

                        if (TypeSource_user.Position.length > 1)
                            TypeSource_user.Position.splice(1, TypeSource_user.Position.length - 1);
                        TypeSource_user.Position = TypeSource_user.Position.concat(model.com.utils.getSource(rst));

                        model.com.getUser({}, function (res) {
                            if (res && res.list) {
                                // $('.tb_users').bootstrapTable('load', res.list);    
                                DataAll_user = res.list;
                                var _list = $com.util.Clone(res.list);
                                $.each(_list, function (i, item) {
                                    for (var p in item) {
                                        if (!FORMATTRT_user[p])
                                            continue;
                                        item[p] = FORMATTRT_user[p](item[p]);
                                    }
                                });
                                $("#femi-user-tbody").html($com.util.template(_list, HTML.TableUserItemNode));
                            }
                        });


                        //模板GroupID
                        model.com.getGroup({}, function (resGroup) {
                            DataAll_group = resGroup.list;
                            $("#zace-modelist").empty();
                            for (var i = 0; i < DataAll_group.length; i++) {
                                DataAll_group[i].ID = i + 1;

                                $("#zace-modelist").append("<option value='" + DataAll_group[i].GroupID + "'>" + DataAll_group[i].GroupName + "</option>");

                            }
                            model.com.refresh();
                        });
                    });

                });


            },
            com: {
                //用户
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
                //部门
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
                //岗位
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
                //模板个数
                getGroup: function (data, fn, context) {
                    var d = {
                        $URI: "/SchedulePosition/ScheduleGroupAll",
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

                //管理排班模板
                getManagerAll: function (data, fn, context) {
                    var d = {
                        $URI: "/SchedulePosition/ManagerAll",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //保存管理排班模板
                postManager: function (data, fn, context) {
                    var d = {
                        $URI: "/SchedulePosition/Save",
                        $TYPE: "post",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                refresh: function () {

                    model.com.getManagerAll({GroupID: mGroupID}, function (res_position) {


                        res_Position_Basic = res_position.list;
                        for (var i = 0; i < res_Position_Basic.length; i++) {
                            res_Position_Basic[i].WID = i + 1;
                        }

                        $("#femi-manage-tbody").html($com.util.template(res_Position_Basic, HTML.ArrangeList));

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


            },
        });
        model.init();
    });