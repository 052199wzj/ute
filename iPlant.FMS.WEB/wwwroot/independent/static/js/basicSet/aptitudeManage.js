require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {
    var HTML,
        modal,
        AptitudeSource,
        KEYWORD,
        KEYWORD_USER,
        KEYWORD_LIST,
        DEFAULT_VALUE,
        DEFAULT_VALUE_USER,
        TypeSource,
        FORMATTRT,
        FORMATTRT_USER,
        USER_Map,
        TypeSource_USER,
        DataAll,
        KEYWORD_LIST_USER,
        SelectedWorkShop,
        SelectedLine,
        SelectedPart,
        SelectedPartPoint,
        seleData;

    USER_Map = {};

    HTML = {
        TableAptitudeItemNode: [
            '<tr>',
            '<td style="width: 3px"><input type="checkbox"    ',
            '	class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}"  >{{ID}}</td>	     ',
            '<td style="min-width: 50px" data-title="DepartmentID" data-value="{{DepartmentID}}"  >{{DepartmentID}}</td>',
            '<td style="min-width: 50px" data-title="Position" data-value="{{Position}}"  >{{Position}}</td>',
            '<td style="min-width: 50px" data-title="OperatorID" data-value="{{OperatorID}}"  >{{OperatorID}}</td>',
            '<td style="min-width: 50px" data-title="WorkShopID" data-value="{{WorkShopID}}"  >{{WorkShopID}}</td>  ',
            '<td style="min-width: 50px" data-title="LineID" data-value="{{LineID}}"  >{{LineID}}</td> ',
            '<td style="min-width: 50px" data-title="PartID" data-value="{{PartID}}"  >{{PartID}}</td>   ',
            '<td style="min-width: 50px" data-title="PartPointID" data-value="{{PartPointID}}"  >{{PartPointID}}</td>  ',
            '<td style="min-width: 50px" data-title="Active" data-value="{{Active}}"  >{{Active}}</td>',
            '<td style="min-width: 50px" data-title="Mode" data-value="{{Mode}}"  >{{Mode}}</td>',
            '<td style="min-width: 50px" data-title="CreateTime" data-value="{{CreateTime}}"  >{{CreateTime}}</td>',
            '</tr>',
        ].join(""),
        TableUserItemNode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
            '<td data-title="LoginName" data-value="{{LoginName}}" >{{LoginName}}</td>',
            '<td data-title="DepartmentID" data-value="{{DepartmentID}}" >{{DepartmentID}}</td>',
            '<td data-title="Position" data-value="{{Position}}" >{{Position}}</td>',
            '<td data-title="Manager" data-value="{{Manager}}" >{{Manager}}</td>',
            '<td data-title="CreateDate" data-value="{{CreateDate}}" >{{CreateDate}}</td>',
            '<td data-title="Operator" data-value="{{Operator}}" >{{Operator}}</td>',
            '<td data-title="Phone" data-value="{{Phone}}" >{{Phone}}</td>',
            '<td data-title="WeiXin" data-value="{{WeiXin}}" >{{WeiXin}}</td>',
            '<td data-title="Email" data-value="{{Email}}" >{{Email}}</td>',
            '<td data-title="PhoneMAC" data-value="{{PhoneMAC}}" >{{PhoneMAC}}</td>',
            '<td data-title="Active" data-value="{{Active}}" >{{Active}}</td>',
            '<td data-title="DepartureDate" data-value="{{DepartureDate}}" >{{DepartureDate}}</td>',
            '</tr>',
        ].join(""),
        TableLiItemNode: [
            '<li data-value="{{value}}" > ',
            '<a href="javascript:;"> ',
            '<span class=" glyphicon glyphicon-ok" aria-hidden="true" >{{name}}</span> ',
            '</a> ',
            '</li> ',
        ].join(""),
    };

    AptitudeSource = [];
    (function () {
        FORMATTRT = {};
        KEYWORD = {};
        KEYWORD_LIST = [
            "DepartmentID|部门|ArrayOneControl",
            "Position|岗位|ArrayOneControl|DepartmentID",
            "WorkShopID|车间|ArrayOneControl",
            "LineID|产线|ArrayOneControl|WorkShopID",
            "PartID|工序段|ArrayOneControl|LineID",
            "PartPointID|工序|ArrayOneControl|PartID",
            "OperatorID|操作工|ArrayOne",
            "Active|状态|ArrayOne",
            "Mode|模式|ArrayOne",
            "CreateTime|创建时间|DateTime",
        ];
        TypeSource = {
            DepartmentID: [{
                name: "全部",
                value: 0,
            }],
            Position: [{
                name: "全部",
                value: 0,
            }],
            OperatorID: [{
                name: "",
                value: 0,
            }],

            WorkShopID: [{
                name: "全部",
                value: 0,
            }],
            LineID: [{
                name: "全部",
                value: 0,
                far: 0,
            }],
            PartID: [{
                name: "全部",
                value: 0,
                far: 0,
            }],
            PartPointID: [{
                name: "全部",
                value: 0,
                far: 0,
            }],
            Active: [{
                name: "关闭",
                value: 0,
            },
                {
                    name: "激活",
                    value: 1,
                }],
            Mode: [{
                name: "默认",
                value: 0,
            },
                {
                    name: "永久",
                    value: 1,
                },
                {
                    name: "临时",
                    value: 2,
                }],
        };
        $.each(KEYWORD_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
            };
            if (detail.length > 2) {
                FORMATTRT[detail[0]] = $com.util.getFormatter(TypeSource, detail[0], detail[2]);
            }
        });
    })();
    (function () {
        FORMATTRT_USER = {};
        DataAll = [];
        KEYWORD_USER = {};
        KEYWORD_LIST_USER = [
            "Name|姓名",
            "LoginName|用户名",
            "DepartmentID|部门|ArrayOneControl",
            "Position|岗位|ArrayOneControl|DepartmentID",
            "Manager|职位|ArrayOne",
            //"grad|学历|ArrayOne",
            "CreateDate|创建时间|DateTime",
            "Operator|操作员",
            "Phone|电话号码",
            "WeiXin|微信",
            "Email|邮箱",
            "PhoneMAC|MAC地址",
            "Active|状态|ArrayOne",
            "DepartureDate|离职时间|DateTime",
        ];
        DEFAULT_VALUE_USER = {
            Name: "",
            DepartmentID: 0,
            Position: 0,
            Manager: 0,
            Phone: "",
            WeiXin: "",
            Email: "",
            PhoneMAC: 0,
            Active: "禁用",
        };
        TypeSource_USER = {
            Active: [{
                name: "激活",
                value: 1,
            }, {
                name: "禁用",
                value: 0,
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
                name: "职员",
                value: 0,
            }, {
                name: "经理",
                value: 1,
            }, {
                name: "学徒工",
                value: 2,
            }],
        };
        $.each(KEYWORD_LIST_USER, function (i, item) {
            var detail = item.split("|");
            KEYWORD_USER[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined,
            };
            if (detail.length > 2) {
                FORMATTRT_USER[detail[0]] = $com.util.getFormatter(TypeSource_USER, detail[0], detail[2]);
            }
        });
    })();
    model = $com.Model.create({
        name: 'iPlant.MES',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },
        events: function () {
            //新增数据
            $("body").delegate("#cby-add-aptitude", "click", function () {
                $("#aptitudeTable").css("display", "none");
                $("#userTable").css("display", "block");

            });
            //返回
            $("body").delegate("#cby-return-aptitude", "click", function () {
                $("#aptitudeTable").css("display", "block");
                $("#userTable").css("display", "none");

            });

            //模糊查询
            $("body").delegate("#cby-search-text-ledger", "change", function () {
                var $this = $(this),
                    value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#cby-ledger-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#cby-ledger-aptitude-tbody"), AptitudeSource, value, "ID", FORMATTRT);
            });
            //模态框查询
            $("body").delegate("#cby-search-ledger", "click", function () {

                var default_value = {
                    WorkShopID: 0,
                    LineID: 0,
                    PartID: 0,
                    PartPointID: 0,
                    Active: 1,
                    Mode: 0,
                    DepartmentID: 0,
                    Position: "",
                    Name: 0,
                };

                $("body").append($com.modal.show(default_value, KEYWORD, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.WorkShopID = Number(rst.WorkShopID);
                    default_value.WorkShopName = FORMATTRT.WorkShopID(Number(rst.WorkShopID));
                    default_value.LineID = Number(rst.LineID);
                    default_value.LineName = FORMATTRT.LineID(Number(rst.LineID));
                    default_value.PartID = Number(rst.PartID);
                    default_value.PartName = FORMATTRT.PartID(Number(rst.PartID));
                    default_value.PartPointID = Number(rst.PartPointID);
                    default_value.PartPointName = FORMATTRT.PartPointID(Number(rst.PartPointID));
                    default_value.Active = Number(rst.Active);
                    default_value.Mode = FORMATTRT.Mode(Number(rst.Mode));
                    default_value.DepartmentID = Number(rst.DepartmentID);
                    default_value.DepartmentName = FORMATTRT.DepartmentID(Number(rst.DepartmentID));
                    default_value.Position = FORMATTRT.Position(Number(rst.Position));

                    $com.table.filterByConndition($("#cby-ledger-aptitude-tbody"), AptitudeSource, default_value, "ID");

                }, TypeSource));

            });

            //人员表模糊查询
            $("body").delegate("#cby-searchUser-text-ledger", "change", function () {
                var $this = $(this),
                    value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#cby-ledger-employee-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#cby-ledger-employee-tbody"), DataAll, value, "ID");
            });
            //人员表条件查询
            $("body").delegate("#cby-searchUser-ledger", "click", function () {
                var default_value = {
                    DepartmentID: 0,
                    Position: 0,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_USER, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.DepartmentID = Number(rst.DepartmentID);
                    default_value.Position = Number(rst.Position);
                    $com.table.filterByConndition($("#cby-ledger-employee-tbody"), DataAll, default_value, "ID");

                }, TypeSource_USER));


            });
            //点击事件
            $("body").delegate(".workshop-items>li", "click", function () {
                var $this = $(this);
                SelectedWorkShop = Number($this.attr("data-value"));
                $("#workShopChoose").html(FORMATTRT.WorkShopID(SelectedWorkShop));

                //渲染line选择框
                var _LineList = $com.util.findAll(TypeSource.LineID, function (item_l) {
                    return item_l.far == SelectedWorkShop;
                });

                $(".line-items").html($com.util.template(_LineList, HTML.TableLiItemNode));

                SelectedLine = 0;
                SelectedPart = 0;
                SelectedPartPoint = 0;
            });

            $("body").delegate(".line-items>li", "click", function () {
                var $this = $(this);
                SelectedLine = Number($this.attr("data-value"));
                $("#lineChoose").html(FORMATTRT.LineID(SelectedLine));
                //渲染Part选择框
                var _PartList = $com.util.findAll(TypeSource.PartID, function (item_p) {
                    return item_p.far == SelectedLine;
                });
                $(".part-items").html($com.util.template(TypeSource.PartID, HTML.TableLiItemNode));

                SelectedPart = 0;
                SelectedPartPoint = 0;
            });

            $("body").delegate(".part-items>li", "click", function () {
                var $this = $(this);
                SelectedPart = Number($this.attr("data-value"));
                $("#partChoose").html(FORMATTRT.PartID(SelectedPart));
                //渲染PartPoint选择框
                var _PartPointList = $com.util.findAll(TypeSource.PartPointID, function (item_pp) {
                    return item_pp.far == SelectedPart;
                });
                $(".partPoint-items").html($com.util.template(TypeSource.PartPointID, HTML.TableLiItemNode));
                SelectedPartPoint = 0;
            });

            $("body").delegate(".partPoint-items>li", "click", function () {
                var $this = $(this);
                SelectedPartPoint = Number($this.attr("data-value"));
                $("#partPointChoose").html(FORMATTRT.PartPointID(SelectedPartPoint));
                if (SelectedPartPoint == 0)
                    return false;

                //获取此工序下已有人员 
                var _OwnUser = $com.util.findAll(AptitudeSource, function (item) {

                    return item.WorkShopID == SelectedWorkShop
                        && item.LineID == SelectedLine
                        && item.PartID == SelectedPart
                        && item.PartPointID == SelectedPartPoint;
                });

                //筛选人员表  剔除此工序已有人员
                var _UserAll = $com.util.findAll(DataAll, function (item) {

                    var _index = $com.util.findIndex(_OwnUser, function (item_u) {
                        return item_u.OperatorID == item.ID;
                    });
                    return _index < 0;
                });
                //显示
                $("#cby-ledger-employee-tbody").html($com.util.template(_UserAll, HTML.TableUserItemNode));

            });

            //保存
            $("body").delegate("#cby-save-aptitude", "click", function () {
                var $this = $(this),
                    SelectedData = $com.table.getSelectionData($("#cby-ledger-employee-tbody"), 'ID', DataAll);

                if (!SelectedData || !SelectedData.length) {
                    return;
                }
                var selData = [];
                $.each(SelectedData, function (_i, _item) {

                    var _data = {
                        ID: 0,
                        DepartmentID: _item.DepartmentID,
                        Position: _item.Position,
                        OperatorID: _item.ID,
                        OperatorName: _item.Name,
                        WorkShopID: SelectedWorkShop,
                        WorkShopName: FORMATTRT["WorkShopID"](SelectedWorkShop),
                        LineID: SelectedLine,
                        LineName: FORMATTRT["LineID"](SelectedLine),
                        PartID: SelectedPart,
                        PartName: FORMATTRT["PartID"](SelectedPart),
                        PartPointID: SelectedPartPoint,
                        PartPointName: FORMATTRT["PartPointID"](SelectedPartPoint),
                        Active: 1,
                        Mode: 1,
                    };
                    selData[_i] = _data;
                });
                model.com.addUser({
                    data: selData,
                }, function (res) {
                    alert("保存成功");
                    $("#aptitudeTable").css("display", "block");
                    $("#userTable").css("display", "none");
                    model.com.refresh();
                });

            });
        },
        run: function () {

            //获取车间产线
            model.com.getWorkShop({}, function (w_data) {
                //获取车间
                $.each(w_data.list, function (w_i, w_item) {
                    TypeSource.WorkShopID.push({
                        name: w_item.WorkShopName,
                        value: w_item.ID,
                        far: null,
                    });
                    //获取产线
                    $.each(w_item.LineList, function (l_i, l_item) {
                        TypeSource.LineID.push({
                            name: l_item.ItemName,
                            value: l_item.ID,
                            far: w_item.ID,
                        });
                    });
                });
                //获取工序工序段
                model.com.getPart({}, function (data_Part) {
                    var _data = [];
                    $.each(data_Part.list, function (p_i, p_item) {

                        TypeSource.PartID = TypeSource.PartID.concat($com.table.getTypeSource(p_item.PartList, "PartID", "PartName", undefined, "LineID"));

                        if (p_item.PartPointList && p_item.PartPointList.length > 0) {

                            TypeSource.PartPointID = TypeSource.PartPointID.concat($com.table.getTypeSource(p_item.PartPointList, "PartPointID", "PartPointName", undefined, "PartID"));
                        }

                        $.each(p_item.PartList, function (pp_i, pp_item) {

                            TypeSource.PartPointID = TypeSource.PartPointID.concat($com.table.getTypeSource(pp_item.PartPointList, "PartPointID", "PartPointName", undefined, "PartID"));
                            //填充li
                            $(".workshop-items").html($com.util.template(TypeSource.WorkShopID, HTML.TableLiItemNode));
                        });
                    });
                    //获取部门
                    model.com.getDepartment({}, function (d_data) {
                        TypeSource.DepartmentID = TypeSource.DepartmentID.concat(
                            $com.table.getTypeSource(model.com.getSon(d_data.list), "ID", "Name"));
                        TypeSource_USER.DepartmentID = TypeSource.DepartmentID;
                        //获取岗位
                        model.com.getPosition({}, function (p_data) {
                            TypeSource.Position = TypeSource.Position.concat(
                                $com.table.getTypeSource(model.com.getSon(p_data.list), "ID", "Name", undefined, "DepartmentID"));
                            TypeSource_USER.Position = TypeSource.Position;

                            //获取人员
                            model.com.getUser({}, function (u_data) {
                                if (u_data && u_data.list) {
                                    var _list = $com.util.Clone(u_data.list);
                                    $.each(_list, function (i, item) {
                                        for (var p in item) {
                                            if (!FORMATTRT[p])
                                                continue;
                                            item[p] = FORMATTRT[p](item[p]);
                                        }
                                    });
                                    DataAll = u_data.list;
                                    $("#cby-ledger-employee-tbody").html($com.util.template(_list, HTML.TableUserItemNode));
                                }
                                TypeSource.OperatorID = TypeSource.OperatorID.concat($com.table.getTypeSource(u_data.list, "ID", "Name"));
                                $.each(u_data.list, function (i, item) {
                                    USER_Map[item.ID] = item;
                                });


                                model.com.refresh();
                            });

                        });

                    });
                });
            });
        },
        com: {
            get: function (data, fn, context) {
                var d = {
                    $URI: "/WorkAptitude/All",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
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
            getPart: function (data, fn, context) {
                var d = {
                    $URI: "/APSLine/ConfigAll",
                    $TYPE: "get",
                };

                function err(data, fn, context) {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
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
            getSon: function (list) {
                var _rst = [];
                $.each(list, function (i, item) {
                    _rst.push(item);
                    if (item.SonList) {
                        var _arr = model.com.getSon(item.SonList);
                        _rst = _rst.concat(_arr);
                    }

                });
                return _rst;
            },
            addUser: function (data, fn, context) {
                var d = {
                    $URI: "/WorkAptitude/Save",
                    $TYPE: "post",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            refresh: function () {
                //获得WorkAptitude
                model.com.get({shift_id: -3}, function (res) {
                    if (res && res.list) {
                        AptitudeSource = res.list;
                        model.com.render(AptitudeSource);
                    }
                });
            },

            render: function (list) {
                var _list = $com.util.Clone(list),
                    _data = [];
                $.each(_list, function (i, item) {
                    item.DepartmentID = USER_Map[item.OperatorID].DepartmentID;
                    item.Position = USER_Map[item.OperatorID].Position;
                    if ((SelectedWorkShop && item.WorkShopID != SelectedWorkShop) || (SelectedLine && item.LineID != SelectedLine) || (SelectedPart && item.PartID != SelectedPart) || (SelectedPartPoint && item.PartPointID != SelectedPartPoint)) {
                        return true;
                    }
                    for (var p in item) {
                        if (!FORMATTRT[p])
                            continue;
                        item[p] = FORMATTRT[p](item[p]);

                    }
                    _data.push(item);
                    AptitudeSource = _data;
                });
                $("#cby-ledger-aptitude-tbody").html($com.util.template(_data, HTML.TableAptitudeItemNode));
            },
        },
    });
    model.init();
})();