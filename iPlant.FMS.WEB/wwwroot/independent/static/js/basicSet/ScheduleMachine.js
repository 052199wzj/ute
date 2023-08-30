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

        mGroupID = 1;
        mID = 1;
        HeadersPosition = {
            "2001": "电修工",
            "3001": "机修工",
        };

        HTML = {
            ArrangeList: [
                '<tr>',
                '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></th>',
                //'<td style="min-width: 50px" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
                '<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
                '<td style="min-width: 50px" data-title="WorkShopID" data-value="{{WorkShopID}}" >{{ WorkShopID}}</td>',
                '<td style="min-width: 50px" data-title="LineID" data-value="{{LineID}}" >{{ LineID}}</td>',
                '<td style="min-width: 50px" data-title="PartName" data-value="{{PartName}}" >{{ PartName}}</td>',
                '<td style="min-width: 50px" data-title="MemberName2001" data-value="{{MemberName2001}}" >{{ MemberName2001}}</td>',
                '<td style="min-width: 50px " data-title="MemberName3001" data-value="{{MemberName3001}}" >{{ MemberName3001}}</td>',
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

        //机电修排班模板
        $(function () {
            KETWROD_LIST_Arrange = [
                "WorkShopID|车间|ArrayOneControl",
                "LineID|产线|ArrayOneControl|WorkShopID",
                "PartName|设备号",
            ];
            KETWROD_Template_Arrange = {};

            Formattrt_Arrange = {};

            TypeSource_Arrange = {
                WorkShopID: [{
                    name: "磨加工车间",
                    value: 1,
                },
                ],
                LineID: [{
                    name: "全部",
                    value: 0,
                    far: 0,
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
            name: '机电修排班模板',

            type: $com.Model.MAIN,

            configure: function () {
                this.run();
            },

            events: function () {


                //修改人员
                $("body").delegate("#femi-user-tbody tr", "dblclick", function () {
                    var $this = $(this);
                    var WID = $this.find('td[data-title=ID]').attr('data-value');
                    var WName = $this.find('td[data-title=Name]').attr('data-value');
                    switch (mZaceValue) {
                        case 2001:


                            res_Position_Basic2001[mID - 1].MemberID = WID;
                            res_Position_Basic2001[mID - 1].MemberName = WName;

                            var res_Position = [];
                            res_Position.push(res_Position_Basic2001[mID - 1]);

                            model.com.postDevice({
                                Module: 2001,
                                data: res_Position,
                            }, function (res) {
                                //alert("将电修工 " + mName + " 修改为 " + WName);
                                $(".zace-left").show();
                                $(".zace-right").hide();
                                model.com.refresh();

                            });

                            break;

                        case 3001:

                            res_Position_Basic3001[mID - 1].MemberID = WID;
                            res_Position_Basic3001[mID - 1].MemberName = WName;

                            var res_Position = [];
                            res_Position.push(res_Position_Basic3001[mID - 1]);

                            model.com.postDevice({
                                Module: 3001,
                                data: res_Position,
                            }, function (res) {
                                // alert("将机修工" + mName + " 修改为 " + WName);
                                $(".zace-left").show();
                                $(".zace-right").hide();
                                model.com.refresh();
                            });
                            break;

                    }


                });


                //清除人员
                $("body").delegate("#zace-del-schedule", "click", function () {


                    switch (mZaceValue) {
                        case 2001:

                            res_Position_Basic2001[mID - 1].MemberID = 0;
                            res_Position_Basic2001[mID - 1].MemberName = "";

                            var res_Position = [];
                            res_Position.push(res_Position_Basic2001[mID - 1]);

                            model.com.postDevice({
                                Module: 2001,
                                data: res_Position,
                            }, function (res) {
                                //alert("将电修工 " + mName + " 清除");
                                $(".zace-left").show();
                                $(".zace-right").hide();
                                model.com.refresh();
                            });


                            break;

                        case 3001:

                            res_Position_Basic3001[mID - 1].MemberID = 0;
                            res_Position_Basic3001[mID - 1].MemberName = "";

                            var res_Position = [];
                            res_Position.push(res_Position_Basic3001[mID - 1]);

                            model.com.postDevice({
                                Module: 3001,
                                data: res_Position,
                            }, function (res) {
                                //alert("将机修工 " + mName + " 清除");
                                $(".zace-left").show();
                                $(".zace-right").hide();
                                model.com.refresh();
                            });
                            break;

                    }


                });

                //机修工 双击
                $("body").delegate("#femi-machine-tbody td[data-title=MemberName3001]", "dblclick", function () {

                    $(".zace-left").hide();
                    $(".zace-right").show();

                    var $this = $(this);
                    var name = $this.attr('data-value');
                    mID = $this.parent().find("td[data-title=WID]").attr("data-value");
                    mZaceValue = 3001;
                    mName = name;


                });
                //电修工 双击
                $("body").delegate("#femi-machine-tbody td[data-title=MemberName2001]", "dblclick", function () {

                    $(".zace-left").hide();
                    $(".zace-right").show();

                    var $this = $(this);
                    var name = $this.attr('data-value');
                    mID = $this.parent().find("td[data-title=WID]").attr("data-value");
                    mZaceValue = 2001;
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
                        fileName = "机电修排班模板.xls",
                        Title = "机电修排班模板";
                    var params = $com.table.getExportParams($table, fileName, Title);

                    model.com.getExportExcel(params, function (res) {
                        var src = res.info.path;
                        window.open(src);
                    });


                });


            },
            run: function () {
                $(".zace-right").hide();
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
                    });

                });

                //车间产线
                model.com.getWorkShop({}, function (data) {

                    $.each(data.list, function (i, item) {
                        TypeSource_Arrange.WorkShopID.push({
                            name: item.WorkShopName,
                            value: item.ID,
                            far: null,
                        });
                        $.each(item.LineList, function (l_i, l_item) {
                            TypeSource_Arrange.LineID.push({
                                name: l_item.ItemName,
                                value: l_item.ID,
                                far: item.ID,
                            });
                        });

                    });
                    model.com.getDeviceAll({
                        WorkShopID: 0,
                        LineID: 0,
                        Module: 2001,
                        GroupID: 0,
                    }, function (res_position) {


                        res_Position_Basic = res_position.list;
                        WorkLinePartList = [];
                        for (var i = 0; i < res_Position_Basic.length; i++) {
                            res_Position_Basic[i].PartPoint.WID = i + 1;
                            res_Position_Basic[i].PartPoint.MemberName2001 = "";
                            res_Position_Basic[i].PartPoint.MemberName3001 = "";

                            WorkLinePartList.push(res_Position_Basic[i].PartPoint);

                        }
                        //模板管理
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

                //机电修排班模板
                getDeviceAll: function (data, fn, context) {
                    var d = {
                        $URI: "/SchedulePosition/DeviceAll",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //保存机电修排班模板
                postDevice: function (data, fn, context) {
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


                    ////机电修排班全部
                    model.com.getDeviceAll({
                        WorkShopID: 0,
                        LineID: 0,
                        Module: 2001,
                        GroupID: mGroupID,
                    }, function (res_position2001) {
                        res_Position_Basic2001 = res_position2001.list;

                        model.com.getDeviceAll({
                            WorkShopID: 0,
                            LineID: 0,
                            Module: 3001,
                            GroupID: mGroupID,
                        }, function (res_position3001) {

                            res_Position_Basic3001 = res_position3001.list;


                            var _list = $com.util.Clone(WorkLinePartList);
                            for (var i = 0; i < res_position2001.list.length; i++) {
                                _list[i].MemberName2001 = res_position2001.list[i].MemberName;
                                _list[i].MemberName3001 = res_position3001.list[i].MemberName;
                            }
                            $.each(_list, function (i, item) {
                                for (var p in item) {
                                    if (!Formattrt_Arrange[p])
                                        continue;
                                    item[p] = Formattrt_Arrange[p](item[p]);
                                }
                            });

                            $("#femi-machine-tbody").html($com.util.template(_list, HTML.ArrangeList));
                        });

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
        });
        model.init();
    });