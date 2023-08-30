require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($zace, $com) {

    var KEYWORD,
        KEYWORD_LIST,
        model,
        DEFAULT_VALUE,
        TypeSource,
        DataAll,
        FORMATTRT,
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


            //新增
            $("body").delegate("#zace-add-user", "click", function () {

                //将Json数据中的数据值改成对应默认值，然后传入进去
                $("body").append($com.modal.show(DEFAULT_VALUE, KEYWORD, "新增", function (rst) {
                    //调用插入函数

                    if (!rst || $.isEmptyObject(rst))
                        return;
                    var _data = {
                        Name: rst.Name,


                    };
                    //model.com.add({
                    //	data: _data
                    //}, function(res) {
                    //	alert("新增成功");
                    //	model.com.refresh();
                    //})

                }, TypeSource));

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

                };

                $("body").append($com.modal.show(default_value, KEYWORD, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    SelectData[0].Name = rst.Name;
                    //SelectData[0].DepartmentID = Number(rst.DepartmentID);
                    //SelectData[0].Position = Number(rst.Position);
                    //SelectData[0].Manager = Number(rst.Manager);
                    //SelectData[0].Phone = rst.Phone;
                    //SelectData[0].WeiXin = rst.WeiXin;
                    //SelectData[0].Email = rst.Email;
                    //SelectData[0].PhoneMAC = Number(rst.PhoneMAC);
                    //SelectData[0].Active = Number(rst.Active);


                    //model.com.add({
                    //	data: SelectData[0]
                    //}, function(res) {
                    //	alert("修改成功");
                    //	model.com.refresh();
                    //})

                }, TypeSource));
            });

            //刷新
            $("body").delegate("#zace-refresh-user", "click", function () {

                model.com.refresh();
            });
            //导入
            $("body").delegate("#zace-exit-import", "click", function () {

                $("#input-file").val("");
                $("#input-file").click();

            });
            $("body").delegate("#input-file", "change", function () {
                var $this = $(this);

                if (this.files.length == 0)
                    return;
                var fileData = this.files[0];

                var form = new FormData();
                form.append("file", fileData);

                model.com.postImportExcel(form, function (res) {
                    if (!res)
                        return;
                    var list = res.list;
                    alert(6);
                });
            });

            //条件查询
            $("body").delegate("#zace-search-user", "click", function () {
                var default_value = {
                    DepartmentID: 0,
                    Position: 0,
                };
                $("body").append($com.modal.show(default_value, KEYWORD, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.DepartmentID = Number(rst.DepartmentID);
                    default_value.Position = Number(rst.Position);
                    $com.table.filterByConndition($("#femi-user-tbody"), DataAll, default_value, "ID");

                }, TypeSource));


            });

            //模糊查询
            $("body").delegate("#femi-search-text-ledger", "change", function () {
                var $this = $(this),
                    value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-user-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-user-tbody"), DataAll, value, "ID");
            });


        },

        run: function () {


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

                        $("#femi-user-tbody").html($com.util.template(_list, HTML.TableUserItemNode));
                    }
                });
            },
            //导入
            postImportExcel: function (data, fn, context) {
                var d = {
                    $URI: "/Upload/ImportBomExcel",
                    $TYPE: "post",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax_load(data ? $.extend(data, d) : $.extend(d, data), fn, err, context);
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


});
