require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {
    var KEYWORD,
        KEYWORD_LIST,
        model,
        DEFAULT_VALUE,
        TypeSource,
        DataAll,
        FORMATTRT,
        $thead,
        HTML;

    KEYWORD_LIST = [
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

    HTML = {
        TableUserItemNode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
            '<td data-title="LoginName" data-value="{{LoginName}}" >{{LoginName}}</td>',
            '<td data-title="DepartmentID" data-value="{{DepartmentID}}" >{{DepartmentID}}</td>',
            '<td data-title="Position" data-value="{{Position}}" >{{Position}}</td>',
            '<td data-title="Manager" data-value="{{Manager}}" >{{Manager}}</td>',
            '{{td}}',
            //'<td data-title="DepartureDate" data-value="{{DepartureDate}}" >{{DepartureDate}}</td>',
            '</tr>',
        ].join(""),

        thead: [
            '<tr>',
            '<th><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<th data-title="ID"  >序号</td>',
            '<th data-title="Name"  >姓名</td>',
            '<th data-title="LoginName"  >用户名</td>',
            '<th data-title="DepartmentID"  >部门</td>',
            '<th data-title="Position"   >岗位</td>',
            '<th data-title="Manager"   >职位</td>',
            //'<td data-title="DepartureDate" data-value="{{DepartureDate}}" >{{DepartureDate}}</td>',
            '</tr>',
        ].join(""),
    };

    FORMATTRT = {};
    DataAll = [];
    KEYWORD = {};
    DEFAULT_VALUE = {
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
    TypeSource = {
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
        name: '用户管理',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {


            //
            $("body").delegate("#zace-add-user", "click", function () {

                ////$("#zace-ceshi tr") = $thead;
                //$("#zace-ceshi tr").append("<th style='min-width: 50px' data-title='WeiXin'>we</th>");
                //$("#zace-ceshi tr").append("<th style='min-width: 50px' data-title='Email'>we1</th>");

                ////$.each($("#femi-user-tbody tr"),function (i,item) {
                ////    var $this = item;

                ////    $this.append("<td data-title='WeiXin' data-value='{{WeiXin}}' >{{WeiXin}}</td>");
                ////    $this.append("<td data-title='Email' data-value='{{Email}}' >{{Email}}</td>");

                ////    $("#femi-user-tbody").html($com.util.template(DataAll));
                ////});
                //var list=[];
                //$("#femi-user-tbody tr").each(function (i, item) {
                //    if (i==0) {
                //        list=item;
                //    }
                //    var $this = item;

                //    $this.append("<td data-title='WeiXin' data-value='{{WeiXin}}' >{{WeiXin}}</td>");
                //    $this.append("<td data-title='Email' data-value='{{Email}}' >{{Email}}</td>");


                //});
                //$("#femi-user-tbody").html($com.util.template(DataAll, list));

                refreshTable();
            });

            //修改
            $("body").delegate("#zace-edit-user", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-user-tbody"), "ID", DataAll);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！");
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！");
                    return;
                }

                var default_value = {
                    Name: SelectData[0].Name,
                    DepartmentID: SelectData[0].DepartmentID,
                    Position: SelectData[0].Position,
                    Manager: SelectData[0].Manager,
                    Phone: SelectData[0].Phone,
                    WeiXin: SelectData[0].WeiXin,
                    Email: SelectData[0].Email,
                    PhoneMAC: SelectData[0].PhoneMAC,
                    Active: SelectData[0].Active,
                };

                $("body").append($com.modal.show(default_value, KEYWORD, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    SelectData[0].Name = rst.Name;
                    SelectData[0].DepartmentID = Number(rst.DepartmentID);
                    SelectData[0].Position = Number(rst.Position);
                    SelectData[0].Manager = Number(rst.Manager);
                    SelectData[0].Phone = rst.Phone;
                    SelectData[0].WeiXin = rst.WeiXin;
                    SelectData[0].Email = rst.Email;
                    SelectData[0].PhoneMAC = Number(rst.PhoneMAC);
                    SelectData[0].Active = Number(rst.Active);


                    model.com.add({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                    });

                }, TypeSource));
            });


            function refreshTable() {


                var $TR_h = $(HTML.thead);
                var $tr_b = $(HTML.TableUserItemNode);
                ColunmList = [["WeiXin", "微信"], ["Phone", "电话"], ["PhoneMAC", "MAC"]];
                for (var i = 0; i < ColunmList.length; i++) {
                    var title = ColunmList[i][0];
                    var titleText = ColunmList[i][1];
                    $TR_h.append("<th style='min-width: 50px' data-title='" + title + "'>" + titleText + "</th>");
                    $tr_b.append('<td data-title="' + title + '" data-value="{{' + title + '}}" >{{' + title + '}}</td>');
                }
                var Template = $tr_b.prop("outerHTML");

                $("#zace-ceshi").html($TR_h);
                $("#femi-user-tbody").html($com.util.template(DataAll, Template));
            };


        },

        run: function () {
            $thead = $("#zace-ceshi tr");

            //调用部门岗位所有信息
            model.com.getDepartment({}, function (res) {
                if (!res)
                    return;
                var list = res.list,
                    rst = [];
                if (list) {
                    rst = model.com.utils.getSon(list);
                }

                if (TypeSource.DepartmentID.length > 1)
                    TypeSource.DepartmentID.splice(1, TypeSource.DepartmentID.length - 1);
                TypeSource.DepartmentID = TypeSource.DepartmentID.concat(model.com.utils.getSource(rst));


            });
            model.com.getPosition({}, function (res) {
                if (!res)
                    return;
                var list = res.list,
                    rst = [];
                if (list) {
                    rst = model.com.utils.getSon(list);
                }

                if (TypeSource.Position.length > 1)
                    TypeSource.Position.splice(1, TypeSource.Position.length - 1);
                TypeSource.Position = TypeSource.Position.concat(model.com.utils.getSource(rst));

            });


            $(function () {

                model.com.refresh();

            });


        },

        com: {
            get: function (data, fn, context) {
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
            refresh: function () {
                model.com.get({}, function (res) {
                    if (res && res.list) {
                        // $('.tb_users').bootstrapTable('load', res.list);                      
                        var _list = $com.util.Clone(res.list);
                        $.each(_list, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT[p])
                                    continue;
                                item[p] = FORMATTRT[p](item[p]);
                            }
                        });
                        DataAll = res.list;

                        // $("#femi-user-tbody").html($com.util.template(_list, HTML.TableUserItemNode));
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
})();
