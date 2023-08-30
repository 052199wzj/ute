require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($zace, $com) {

    var KEYWORD,
        KEYWORD_LIST,
        model,
        DEFAULT_VALUE,
        TypeSource,
        DataAll,
        FORMATTRT,
        DataAllSearch,
        mGrad,
        HTML;
    mActive = 1;
    var p_flag = false;
    DataAllSearch = [];
    DataPosition = [];
    KEYWORD_LIST = [
        "Name|姓名",
        "LoginName|用户名",
        "LoginID|工号",
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
            '<tr data-color="">',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td  data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
            // '<td data-title="LoginID" data-value="{{LoginID}}" >{{LoginID}}</td>',
            // '<td data-title="LoginName" data-value="{{LoginName}}" >{{LoginName}}</td>',


            // '<td data-title="Active" data-value="{{Active}}" >{{Active}}</td>',
            //'<td data-title="DepartureDate" data-value="{{DepartureDate}}" >{{DepartureDate}}</td>',
            '</tr>',
        ].join(""),


    };
    FORMATTRT = {};
    DataAll = [];
    KEYWORD = {};
    DEFAULT_VALUE = {
        Name: "",

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
                        Active: 1,
                        CompanyID: 0,
                        Department: "",
                        DutyID: 0,
                        Grad: 999,
                        ID: 0,
                        LoginID: 0,
                        LoginName: "",
                        OnShift: 0,
                        Online: 0,
                        Password: "123456",
                        PhoneMAC: 0,
                        Name: rst.Name,
                        DepartmentID: 0,
                        Position: 0,
                        Manager: 0,
                        Phone: 0,
                        WeiXin: 0,
                        Email: 0,
                        //PhoneMAC: Number(rst.PhoneMAC),
                        //Active: Number(rst.Active),
                    };


                    model.com.add({
                        data: _data,
                    }, function (res) {
                        alert("新增成功");
                        p_flag = true;
                        model.com.refresh(p_flag);
                    });

                }, TypeSource));

            });

            //修改
            $("body").delegate("#zace-edit-user", "click", function () {


                if (window.parent._grad < 9) {
                    alert("无权限！！");
                    return false;

                }

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

                    //Active: SelectData[0].Active
                };

                $("body").append($com.modal.show(default_value, KEYWORD, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    SelectData[0].Name = rst.Name;

                    //SelectData[0].Active = Number(rst.Active);


                    for (var i = 0; i < SelectData.length; i++) {
                        $com.util.deleteLowerProperty(SelectData[i]);
                    }
                    model.com.add({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        p_flag = true;
                        model.com.refresh(p_flag);
                    });

                }, TypeSource));
            });

            //刷新
            $("body").delegate("#zace-refresh-user", "click", function () {

                p_flag = true;
                model.com.refresh(p_flag);
            });

            //禁用
            $("body").delegate("#zace-dasable-user", "click", function () {
                if (window.parent._grad < 9) {
                    alert("无权限！！");
                    return false;

                }
                //var SelectData = $('.tb_users').bootstrapTable('getSelections');
                var SelectData = $com.table.getSelectionData($("#femi-user-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("至少选择一行数据！");
                    return;
                }
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其禁用？")) {
                    return;
                }

                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }

                model.com.active({
                    data: SelectData,
                    active: 0,
                }, function (res) {
                    alert("禁用成功");
                    p_flag = true;
                    model.com.refresh(p_flag);
                });


            });

            //激活
            $("body").delegate("#zace-active-user", "click", function () {
                if (window.parent._grad < 9) {
                    alert("无权限！！");
                    return false;

                }
                // var SelectData = $('.tb_users').bootstrapTable('getSelections');
                var SelectData = $com.table.getSelectionData($("#femi-user-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("至少选择一行数据！");
                    return;
                }
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其激活？")) {
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }

                model.com.active({
                    data: SelectData,
                    active: 1,
                }, function (res) {
                    alert("激活成功");
                    p_flag = true;
                    model.com.refresh(p_flag);
                });
            });

            //条件查询
            $("body").delegate("#zace-search-user", "click", function () {
                var default_value = {
                    // DepartmentID: 0,
                    Active: 1,
                };
                $("body").append($com.modal.show(default_value, KEYWORD, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    // default_value.DepartmentID = Number(rst.DepartmentID);
                    default_value.Active = Number(rst.Active);

                    //$com.table.filterByConndition($("#femi-user-tbody"), DataAll, default_value, "ID");

                    mActive = default_value.Active;
                    p_flag = true;
                    model.com.refresh(p_flag);

                }, TypeSource));


            });

            //模糊查询
            // $("body").delegate("#femi-search-text-ledger", "change", function() {
            // 	var $this = $(this),
            // 		value = $(this).val();
            // 	if (value == undefined || value == "" || value.trim().length < 1)
            // 		$("#femi-user-tbody").children("tr").show();
            // 	else
            // 		$com.table.filterByLikeString($("#femi-user-tbody"), DataAllSearch, value, "ID");
            // });
            //模糊查询
            // $("body").delegate("#femi-search-text-ledger", "input", function() {
            // 	var $this = $(this),
            // 		value = $(this).val();
            // 	// if (value == undefined || value == "" || value.trim().length < 1)
            // 	// 	$("#femi-user-tbody").children("tr").show();
            // 	// else
            // 	// 	$com.table.filterByLikeString($("#femi-user-tbody"), DataAllSearch, value, "ID");
            // 	$page.getSearchList(value);
            // });
            $("body").delegate("#zace-search-userS", "click", function () {
                var value = $("#femi-search-text-ledger").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-user-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-user-tbody"), DataAllSearch, value, "ID");
                //$page.getSearchList(value);
            });


            //重置密码
            $("body").delegate("#zace-reset-password", "click", function () {
                if (window.parent._grad < 9) {
                    alert("无权限！！");
                    return false;

                }
                var SelectData = $com.table.getSelectionData($("#femi-user-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("至少选择一行数据！");
                    return;
                }
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其重置密码？")) {
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                model.com.reset({
                    data: SelectData,
                }, function (res) {
                    alert("重置密码成功");
                    p_flag = true;
                    model.com.refresh(p_flag);
                });


            });


        },

        run: function () {

            //
            //调用部门岗位所有信息
            model.com.getDepartment({}, function (res) {
                if (!res)
                    return;
                $.each(res.list, function (i, item) {
                    TypeSource.DepartmentID.push({
                        name: item.Name,
                        value: item.ID,
                    });

                });

                model.com.getPosition({}, function (res) {
                    if (!res)
                        return;
                    DataPosition = res.list;
                    $.each(res.list, function (i, item) {
                        TypeSource.Position.push({
                            name: item.Name,
                            value: item.ID,
                            far: item.DepartmentID,
                        });

                    });
                    TypeSource.Manager = TypeSource.Position;


                    model.com.refresh(p_flag);


                });
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
            refresh: function (p_flag) {
                model.com.get({active: mActive, grad: 999}, function (res) {
                    if (res && res.list) {
                        if (mActive == 1) {
                            var _list = $com.util.Clone(res.list);
                            var wSearch = $com.util.Clone(res.list);
                            // $('.tb_users').bootstrapTable('load', res.list);
                            //for (var i = 0; i < wSearch.length; i++) {
                            //    if (wSearch[i].Active == 1) {
                            //        _list.push(wSearch[i]);
                            //    }
                            //}

                            $.each(_list, function (i, item) {
                                for (var p in item) {
                                    if (!FORMATTRT[p])
                                        continue;
                                    item[p] = FORMATTRT[p](item[p]);
                                }

                                item.WID = i + 1;
                            });
                            DataAll = res.list;
                            DataAllSearch = $com.util.Clone(_list);
                            $("#femi-user-tbody").html($com.util.template(_list, HTML.TableUserItemNode));
                            //$page.getPage(_list, "#femi-user-tbody", HTML.TableUserItemNode, ".table-part",p_flag);

                            $("#femi-user-tbody tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);


                            });

                        } else {
                            var _list = [];
                            var wSearch = $com.util.Clone(res.list);
                            // $('.tb_users').bootstrapTable('load', res.list);
                            for (var i = 0; i < wSearch.length; i++) {
                                if (wSearch[i].Active == 0) {
                                    _list.push(wSearch[i]);
                                }
                            }

                            $.each(_list, function (i, item) {
                                for (var p in item) {
                                    if (!FORMATTRT[p])
                                        continue;
                                    item[p] = FORMATTRT[p](item[p]);
                                }
                                item.WID = i + 1;
                            });
                            DataAll = res.list;
                            DataAllSearch = $com.util.Clone(_list);
                            $("#femi-user-tbody").html($com.util.template(_list, HTML.TableUserItemNode));
                            //$page.getPage(_list, "#femi-user-tbody", HTML.TableUserItemNode, ".table-part",p_flag);

                            $("#femi-user-tbody tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);


                            });

                        }

                    }

                });
                window.parent._zaceUserAll = 1;
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
