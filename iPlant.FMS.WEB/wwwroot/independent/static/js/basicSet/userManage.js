require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/paging', '../static/utils/js/base/Vue'], function ($zace, $com, $page, Vue) {

    var KEYWORD,
        KEYWORD_LIST,
        model,
        DEFAULT_VALUE,
        TypeSource,
        DataAll,
        FORMATTRT,
        DataAllSearch,
        mGrad,
        wRoleTree,
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
            '<td  data-title="WID" data-value="{{WID}}">{{WID}}</td>',
            '<td  style="display:none" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="Name" data-value="{{Name}}">{{Name}}</td>',
            '<td data-title="LoginID" data-value="{{LoginID}}">{{LoginID}}</td>',
            // '<td data-title="LoginName" data-value="{{LoginName}}" >{{LoginName}}</td>',

            '<td data-title="DepartmentID" data-value="{{DepartmentID}}">{{DepartmentID}}</td>',
            '<td data-title="Position" data-value="{{Position}}">{{Position}}</td>',
            // '<td data-title="Manager" data-value="{{Manager}}" >{{Manager}}</td>',
            // '<td data-title="CreateDate" data-value="{{CreateDate}}" >{{CreateDate}}</td>',
            // '<td data-title="Operator" data-value="{{Operator}}" >{{Operator}}</td>',
            '<td data-title="Phone" data-value="{{Phone}}">{{Phone}}</td>',
            // '<td data-title="WeiXin" data-value="{{WeiXin}}" >{{WeiXin}}</td>',
            //   '<td data-title="Email" data-value="{{Email}}" >{{Email}}</td>',
            //'<td data-title="PhoneMAC" data-value="{{PhoneMAC}}" >{{PhoneMAC}}</td>',
            '<td data-title="Active" data-value="{{Active}}"><span class="badge lmvt-badge {{ClassBadge}}">{{Badge}}</span>{{Active}}</td>',
            // '<td data-title="Active" data-value="{{Active}}" >{{Active}}</td>',
            '<td style="max-width: 60px" data-title="Handle" data-value="{{ID}}"><div class="row">',
            '<div class="col-md-4 {{ISAllowed}}">{{ISAllowedText}}</div>',
            '<div class="col-md-4 lmvt-do-info lmvt-reset">修改</div>',
            '<div class="col-md-4 lmvt-do-info"><UL id="nav">',
            '<LI>更多<UL><LI data-value="{{ID}}" class="lmvt-delete">删除</LI>',
            '<LI data-value="{{ID}}" class="zace-usePower">查看权限</LI>',
            '<LI data-value="{{ID}}" class="zace-reset-password">重置密码</LI>',
            '</UL></LI></UL></div>',
            '</div></td>',
            //'<td data-title="DepartureDate" data-value="{{DepartureDate}}" >{{DepartureDate}}</td>',
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
    DEFAULT_VALUE = {
        Name: "",
        LoginID: "",
        DepartmentID: 0,
        Position: 0,
        //Manager: 0,
        Phone: "",
        // WeiXin: "",
        // Email: "",
        //PhoneMAC: 0,
        //Active: 0
    };
    TypeSource = {
        Active: [{
            name: "禁用",
            value: 0,
        }, {
            name: "启用",
            value: 1,
        }, {
            name: "禁用",
            value: 2,
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


    var app = new Vue({
        el: '#lmvt-vueApp',
        data: {},
        beforeCreate() {
            _this = this;
        },

        created: function () {


        },
        methods: {},
    });


    model = $com.Model.create({
        name: '用户管理',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {

            $("body").delegate("#zace-export-export", "click", function () {


                // $com.app.loading('数据导出中！！');


                // model.com.oneExport({

                // }, function (res) {

                // 	var src = res.info;
                // 	window.open(src);
                // 	$com.app.loaded();

                // })
                var $table = $("#femi-user-tbody"),
                    fileName = "用户.xls",
                    Title = "用户";

                // var portSource = $com.util.Clone(_this.GradeItemSource);

                // $.each(portSource, function (i, item) {
                //     item.WID = i + 1;
                // });

                var params = $com.table.getExportParams($table, fileName, Title, DataAllSearch);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });

            });
            //当前页
            $("body").delegate("#lmvt-export-user", "click", function () {

                var $table = $("#femi-user-tbody"),
                    fileName = "用户.xls",
                    Title = "用户";

                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });

            });

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
                        Grad: 0,
                        ID: 0,
                        LoginID: rst.LoginID,
                        LoginName: "",
                        OnShift: 0,
                        Online: 0,
                        Password: "123456",
                        PhoneMAC: 0,
                        Name: rst.Name,
                        DepartmentID: Number(rst.DepartmentID),
                        Position: Number(rst.Position),
                        Manager: 0,
                        Phone: rst.Phone,
                        WeiXin: rst.WeiXin,
                        Email: rst.Email,

                        //PhoneMAC: Number(rst.PhoneMAC),
                        //Active: Number(rst.Active),
                    };

                    for (var i = 0; i < DataPosition.length; i++) {
                        if (Number(rst.Position) == DataPosition[i].ID) {
                            _data.Manager = DataPosition[i].ParentID;
                        }
                    }
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


                var SelectData = $com.table.getSelectionData($("#femi-user-tbody"), "ID", DataAll);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！");
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！");
                    return;
                }
                // if (window.parent._grad < 9) {
                // 	alert("无权限！！");
                // 	return false;

                // }


                var default_value = {
                    Name: SelectData[0].Name,
                    DepartmentID: SelectData[0].DepartmentID,
                    Position: SelectData[0].Position,
                    //Manager: SelectData[0].Manager,
                    Phone: SelectData[0].Phone,
                    // LoginID: SelectData[0].LoginID,
                    // Email: SelectData[0].Email,
                    //PhoneMAC: SelectData[0].PhoneMAC,
                    //Active: SelectData[0].Active
                };

                $("body").append($com.modal.show(default_value, KEYWORD, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    SelectData[0].Name = rst.Name;
                    SelectData[0].DepartmentID = Number(rst.DepartmentID);
                    SelectData[0].Position = Number(rst.Position);

                    SelectData[0].Phone = rst.Phone;
                    // SelectData[0].LoginID = rst.LoginID;
                    // SelectData[0].Email = rst.Email;
                    //SelectData[0].PhoneMAC = Number(rst.PhoneMAC);
                    //SelectData[0].Active = Number(rst.Active);

                    if (SelectData[0].Position > 0) {
                        for (var i = 0; i < DataPosition.length; i++) {
                            if (Number(rst.Position) == DataPosition[i].ID) {
                                SelectData[0].Manager = DataPosition[i].ParentID;
                            }
                        }
                    } else {

                        SelectData[0].Manager = 0;
                    }


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

            //修改 单条
            $("body").delegate(".lmvt-reset", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DataAll.filter((item) => {
                    return item.ID == wID;
                });

                var default_value = {
                    Name: SelectData[0].Name,
                    DepartmentID: SelectData[0].DepartmentID,
                    Position: SelectData[0].Position,
                    //Manager: SelectData[0].Manager,
                    Phone: SelectData[0].Phone,
                    // LoginID: SelectData[0].LoginID,
                    // Email: SelectData[0].Email,
                    //PhoneMAC: SelectData[0].PhoneMAC,
                    //Active: SelectData[0].Active
                };

                $("body").append($com.modal.show(default_value, KEYWORD, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    SelectData[0].Name = rst.Name;
                    SelectData[0].DepartmentID = Number(rst.DepartmentID);
                    SelectData[0].Position = Number(rst.Position);

                    SelectData[0].Phone = rst.Phone;
                    // SelectData[0].LoginID = rst.LoginID;
                    // SelectData[0].Email = rst.Email;
                    //SelectData[0].PhoneMAC = Number(rst.PhoneMAC);
                    //SelectData[0].Active = Number(rst.Active);

                    if (SelectData[0].Position > 0) {
                        for (var i = 0; i < DataPosition.length; i++) {
                            if (Number(rst.Position) == DataPosition[i].ID) {
                                SelectData[0].Manager = DataPosition[i].ParentID;
                            }
                        }
                    } else {

                        SelectData[0].Manager = 0;
                    }


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


            //修改
            $("body").delegate("#femi-user-tbody tr", "dblclick", function () {


                var $this = $(this);
                var $table = $this.closest("table");
                var WID = Number($this.find('td[data-title=ID]').attr('data-value'));


                var SelectData = [];
                for (var i = 0; i < DataAll.length; i++) {
                    if (WID == DataAll[i].ID) {
                        SelectData.push(DataAll[i]);
                    }

                }


                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！");
                    return;
                }

                // if (window.parent._grad < 9) {
                // 	alert("无权限！！");
                // 	return false;

                // }

                var default_value = {
                    Name: SelectData[0].Name,
                    DepartmentID: SelectData[0].DepartmentID,
                    Position: SelectData[0].Position,
                    //Manager: SelectData[0].Manager,
                    Phone: SelectData[0].Phone,
                    // WeiXin: SelectData[0].WeiXin,
                    // Email: SelectData[0].Email,
                    //PhoneMAC: SelectData[0].PhoneMAC,
                    //Active: SelectData[0].Active
                };

                $("body").append($com.modal.show(default_value, KEYWORD, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    SelectData[0].Name = rst.Name;
                    SelectData[0].DepartmentID = Number(rst.DepartmentID);
                    SelectData[0].Position = Number(rst.Position);

                    SelectData[0].Phone = rst.Phone;
                    // SelectData[0].WeiXin = rst.WeiXin;
                    // SelectData[0].Email = rst.Email;
                    //SelectData[0].PhoneMAC = Number(rst.PhoneMAC);
                    //SelectData[0].Active = Number(rst.Active);

                    if (SelectData[0].Position > 0) {
                        for (var i = 0; i < DataPosition.length; i++) {
                            if (Number(rst.Position) == DataPosition[i].ID) {
                                SelectData[0].Manager = DataPosition[i].ParentID;
                            }
                        }
                    } else {

                        SelectData[0].Manager = 0;
                    }


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

            ///禁用 单条
            $("body").delegate(".lmvt-allowed-delete", "click", function (event) {
                // if (window.parent._grad < 9) {
                // 	alert("无权限！！");
                // 	return false;

                // }

                //var SelectData = $('.tb_users').bootstrapTable('getSelections');
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));


                var SelectData = DataAll.filter((item) => {
                    return item.ID == wID;
                });

                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }

                model.com.active({
                    data: SelectData,
                    active: 2,
                }, function (res) {
                    alert("禁用成功");
                    p_flag = true;
                    model.com.refresh(p_flag);
                });
                event.stopPropagation();

            });

            //禁用
            $("body").delegate("#zace-dasable-user", "click", function () {
                // if (window.parent._grad < 9) {
                // 	alert("无权限！！");
                // 	return false;

                // }
                //var SelectData = $('.tb_users').bootstrapTable('getSelections');
                var SelectData = $com.table.getSelectionData($("#femi-user-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("至少选择一行数据！");
                    return;
                }
                // if (!confirm("已选择" + SelectData.length + "条数据，确定将其禁用？")) {
                // 	return;
                // }

                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }

                model.com.active({
                    data: SelectData,
                    active: 2,
                }, function (res) {
                    alert("禁用成功");
                    p_flag = true;
                    model.com.refresh(p_flag);
                });


            });

            //删除 单条
            $("body").delegate(".lmvt-delete", "click", function () {

                var $this = $(this),
                    wID = Number($this.attr("data-value"));

                var SelectData = DataAll.filter((item) => {
                    return item.ID == wID;
                });

                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                    if (SelectData[i].Active == 1) {
                        alert('请选择未启用的用户！');
                        return false;
                    }
                }

                if (!confirm("已选择名称为 [" + SelectData[0].Name + "] 的用户，确定将其删除？")) {
                    return;
                }
                model.com.RemoveUser({
                    data: SelectData,
                }, function (res) {
                    alert("删除成功");
                    p_flag = true;
                    model.com.refresh(p_flag);
                });
            });

            //删除zace-editRemove-user
            $("body").delegate("#zace-editRemove-user", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-user-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("至少选择一行数据！");
                    return;
                }

                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                    if (SelectData[i].Active != 0) {
                        alert('请选择未使用的用户！');
                        return false;
                    }
                }
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {
                    return;
                }
                model.com.RemoveUser({
                    data: SelectData,
                }, function (res) {
                    alert("删除成功");
                    p_flag = true;
                    model.com.refresh(p_flag);
                });
            });
            //启用 单条
            $("body").delegate(".lmvt-do-active", "click", function () {
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DataAll.filter((item) => {
                    return item.ID == wID;
                });

                $com.util.deleteLowerProperty(SelectData);

                model.com.active({
                    data: SelectData,
                    active: 1,
                }, function (res) {
                    alert("启用成功");
                    p_flag = true;
                    model.com.refresh(p_flag);
                });
            });
            //启用
            $("body").delegate("#zace-active-user", "click", function () {
                // if (window.parent._grad < 9) {
                // 	alert("无权限！！");
                // 	return false;

                // }
                // var SelectData = $('.tb_users').bootstrapTable('getSelections');
                var SelectData = $com.table.getSelectionData($("#femi-user-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("至少选择一行数据！");
                    return;
                }
                // if (!confirm("已选择" + SelectData.length + "条数据，确定将其启用？")) {
                // 	return;
                // }
                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }

                model.com.active({
                    data: SelectData,
                    active: 1,
                }, function (res) {
                    alert("启用成功");
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
            //启用
            $("body").delegate("#zace-ActiveAll-user", "click", function () {


                mActive = 1;
                p_flag = true;
                model.com.refresh(p_flag);


            });
            //未使用
            $("body").delegate("#zace-DasableAll-userRemove", "click", function () {


                mActive = 2;
                p_flag = true;
                model.com.refresh(p_flag);


            });

            //禁用
            $("body").delegate("#zace-DasableAll-user", "click", function () {


                mActive = 0;
                p_flag = true;
                model.com.refresh(p_flag);


            });
            //全部
            $("body").delegate("#zace-allUser-user", "click", function () {


                mActive = 0;
                p_flag = true;
                model.com.refresh(p_flag);


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
            //Enter触发模糊查询事件
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var value = $("#femi-search-text-ledger").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-user-tbody").children("tr").show();
                    else
                        //$com.table.filterByLikeString($("#femi-user-tbody"), DataAllSearch, value, "ID");
                        $com.table.filterByLikeStringData($("#femi-user-tbody"), DataAllSearch, value, undefined, undefined, undefined, function (res) {
                            $("#femi-user-tbody").html($com.util.template(res, HTML.TableUserItemNode));
                        });
                }
            });
            $("body").delegate("#zace-search-userS", "click", function () {
                var value = $("#femi-search-text-ledger").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-user-tbody").children("tr").show();
                else
                    $com.table.filterByLikeStringData($("#femi-user-tbody"), DataAllSearch, value, undefined, undefined, undefined, function (res) {
                        $("#femi-user-tbody").html($com.util.template(res, HTML.TableUserItemNode));
                    });
                //$page.getSearchList(value);
            });

            //重置单条
            $("body").delegate(".zace-reset-password", "click", function () {
                var $this = $(this),
                    wID = Number($this.attr("data-value"));

                var SelectData = DataAll.filter((item) => {
                    return item.ID == wID;
                });

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

            //重置密码
            $("body").delegate("#zace-reset-password", "click", function () {
                // if (window.parent._grad < 9) {
                // 	alert("无权限！！");
                // 	return false;

                // }
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
            //用户同步
            $("body").delegate("#zace-synchronizationUser", "click", function () {
                model.com.getSyncUser({}, function (res) {
                    // aa=res.list;
                    alert("用户同步成功!");
                    p_flag = true;
                    model.com.refresh(p_flag);
                });
            });

            //查看权限 单条
            $("body").delegate(".zace-usePower", "click", function (e) {

                var $this = $(this),
                    wID = Number($this.attr("data-value"));

                var SelectData = DataAll.filter((item) => {
                    return item.ID == wID;
                });

                model.com.getFunctionAll({
                    OperatorID: SelectData[0].ID,
                }, function (resUser) {
                    wUser = resUser.list;
                    $(".zzzc").width("80%");
                    $(".zzzb").show();
                    $("#Sub-user").text("(" + SelectData[0].Name + ")" + "权限表");

                    for (var i = 0; i < wRoleTree.length; i++) {
                        for (var k = 0; k < wUser.length; k++) {
                            if (wRoleTree[i].FunctionID == wUser[k].FunctionID) {
                                wUser[k].Text = wRoleTree[i].Text;
                                wUser[k].FarID = wRoleTree[i].RoleID;
                            }
                        }
                    }

                    for (var m = 0; m < wRoleAll.length; m++) {
                        for (var n = 0; n < wUser.length; n++) {
                            if (wUser[n].RoleID == wRoleAll[m].ID) {
                                wUser[n].RoleName = wRoleAll[m].Name;
                            }
                        }
                    }


                    var dataList = $com.util.Clone(wUser);

                    for (var i = 0; i < wUser.length; i++) {
                        for (var j = 0; j < dataList.length; j++) {
                            if (wUser[i].FarID != 0 && wUser[i].FarID == dataList[j].FunctionID && wUser[i].RoleID == dataList[j].RoleID) {
                                wUser[i].Text = dataList[j].Text + "-" + wUser[i].Text;
                                dataList[i].Text = wUser[i].Text;
                            }

                        }
                    }

                    // for(var i=0;i<wUser.length;i++){
                    // 	for(var j=0;j<dataList.length;j++){
                    //         if(wUser[i].FarID==dataList[j].FunctionID){
                    // 			if(dataList[j].FarID==0){
                    // 				wUser[i].Text=wUser[i].Text+"-"+dataList[j].Text;
                    // 			}else{
                    // 				wUser[i].Text=model.com.getFarTreeName(dataList[j], dataList[j].Text,dataList);
                    // 			}
                    // 			// wUser[i].Text=wUser[i].Text+"-"+wUser[j].Text;
                    // 			//model.com.getFarTreeName(wUser[j], wUser[j].Text,wUser);
                    // 		}
                    // 	}
                    // }


                    $("#femi-Device-tbody-time").html($com.util.template(wUser, HTML.TableRoleUserItemNode));
                });
                e.preventDefault();
            });


            //查看权限
            $("body").delegate("#zace-usePower", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-user-tbody"), "ID", DataAll);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！");
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！");
                    return;
                }
                model.com.getFunctionAll({
                    OperatorID: SelectData[0].ID,
                }, function (resUser) {
                    wUser = resUser.list;
                    $(".zzzc").width("80%");
                    $(".zzzb").show();
                    $("#Sub-user").text("(" + SelectData[0].Name + ")" + "权限表");

                    for (var i = 0; i < wRoleTree.length; i++) {
                        for (var k = 0; k < wUser.length; k++) {
                            if (wRoleTree[i].FunctionID == wUser[k].FunctionID) {
                                wUser[k].Text = wRoleTree[i].Text;
                                wUser[k].FarID = wRoleTree[i].RoleID;
                            }
                        }
                    }

                    for (var m = 0; m < wRoleAll.length; m++) {
                        for (var n = 0; n < wUser.length; n++) {
                            if (wUser[n].RoleID == wRoleAll[m].ID) {
                                wUser[n].RoleName = wRoleAll[m].Name;
                            }
                        }
                    }


                    var dataList = $com.util.Clone(wUser);

                    for (var i = 0; i < wUser.length; i++) {
                        for (var j = 0; j < dataList.length; j++) {
                            if (wUser[i].FarID != 0 && wUser[i].FarID == dataList[j].FunctionID && wUser[i].RoleID == dataList[j].RoleID) {
                                wUser[i].Text = dataList[j].Text + "-" + wUser[i].Text;
                                dataList[i].Text = wUser[i].Text;
                            }

                        }
                    }

                    // for(var i=0;i<wUser.length;i++){
                    // 	for(var j=0;j<dataList.length;j++){
                    //         if(wUser[i].FarID==dataList[j].FunctionID){
                    // 			if(dataList[j].FarID==0){
                    // 				wUser[i].Text=wUser[i].Text+"-"+dataList[j].Text;
                    // 			}else{
                    // 				wUser[i].Text=model.com.getFarTreeName(dataList[j], dataList[j].Text,dataList);
                    // 			}
                    // 			// wUser[i].Text=wUser[i].Text+"-"+wUser[j].Text;
                    // 			//model.com.getFarTreeName(wUser[j], wUser[j].Text,wUser);
                    // 		}
                    // 	}
                    // }


                    $("#femi-Device-tbody-time").html($com.util.template(wUser, HTML.TableRoleUserItemNode));
                });
            });

            $("body").delegate("#zace-usehide", "click", function () {
                $(".zzzb").hide();
                $(".zzzc").width("100%");
            });
        },

        run: function () {
            model.com.getRoleAll({}, function (res1) {
                wRoleAll = res1.list;
            });
            model.com.getRoleTree({}, function (res) {
                wRoleTree = res.list;
            });
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
            //导出
            postExportExcel: function (data, fn, context) {
                var d = {
                    $URI: "/Upload/ExportExcel",
                    $TYPE: "post",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            oneExport: function (data, fn, context) {
                var d = {
                    $URI: "/BMSOrgnization/Export",
                    $TYPE: "get",
                    $SERVER: '/MESQMS',

                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getFarTreeName: function (ThisTree, TreeName, wUser) {
                for (var i = 0; i < wUser.length; i++) {
                    if (ThisTree.FarID == wUser[i].FunctionID) {
                        TreeName = wUser[i].Text + "-" + TreeName;
                        //判断他的上级ID是否为0
                        if (wUser[i].FarID == 0) {
                            return TreeName;
                        } else {
                            model.com.getFarTreeName(wUser[i], TreeName, wUser);
                        }
                    }
                }
            },
            //角色名称
            getRoleAll: function (data, fn, context) {
                var d = {
                    $URI: "/Role/All",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //权限树
            getRoleTree: function (data, fn, context) {
                var d = {
                    $URI: "/Role/Tree",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
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
            //用户同步
            getSyncUser: function (data, fn, context) {
                var d = {
                    $URI: "/User/SyncUser",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
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
                model.com.get({Active: mActive}, function (res) {
                    if (res && res.list) {

                        var _list = $com.util.Clone(res.list);
                        var wSearch = $com.util.Clone(res.list);
                        // $('.tb_users').bootstrapTable('load', res.list);
                        //for (var i = 0; i < wSearch.length; i++) {
                        //    if (wSearch[i].Active == 1) {
                        //        _list.push(wSearch[i]);
                        //    }
                        //}

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
                                if (!FORMATTRT[p])
                                    continue;
                                item[p] = FORMATTRT[p](item[p]);
                            }

                            item.WID = i + 1;

                        });
                        DataAll = res.list;
                        DataAllSearch = $com.util.Clone(_list);
                        //$("#femi-user-tbody").html($com.util.template(_list, HTML.TableUserItemNode));
                        //$page.getPage(_list, "#femi-user-tbody", HTML.TableUserItemNode, ".table-part",p_flag);

                        $page.init($("#femi-user-tbody").closest("table"), _list, "", function (res) {
                            $("#femi-user-tbody").html($com.util.template(res, HTML.TableUserItemNode));
                        });

                        $("#femi-user-tbody tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);


                        });

                        // if (mActive == 1) {


                        // } else if (mActive == 0) {
                        // 	var _list = [];
                        // 	var wSearch = $com.util.Clone(res.list);
                        // 	// $('.tb_users').bootstrapTable('load', res.list);
                        // 	for (var i = 0; i < wSearch.length; i++) {
                        // 		if (wSearch[i].Active == 0) {
                        // 			_list.push(wSearch[i]);
                        // 		}
                        // 	}

                        // 	$.each(_list, function (i, item) {
                        // 		for (var p in item) {
                        // 			if (!FORMATTRT[p])
                        // 				continue;
                        // 			item[p] = FORMATTRT[p](item[p]);
                        // 		}
                        // 		item.WID = i + 1;
                        // 	});
                        // 	DataAll = res.list;
                        // 	DataAllSearch = $com.util.Clone(_list);
                        // 	// $("#femi-user-tbody").html($com.util.template(_list, HTML.TableUserItemNode));
                        // 	//$page.getPage(_list, "#femi-user-tbody", HTML.TableUserItemNode, ".table-part",p_flag);

                        // 	$page.init($("#femi-user-tbody").closest("table"), _list, "", function (res) {
                        // 		$("#femi-user-tbody").html($com.util.template(res, HTML.TableUserItemNode));
                        // 	});

                        // 	$("#femi-user-tbody tr").each(function (i, item) {
                        // 		var $this = $(this);
                        // 		var colorName = $this.css("background-color");
                        // 		$this.attr("data-color", colorName);


                        // 	});

                        // } else if (mActive == 2) {
                        // 	var _list = [];
                        // 	var wSearch = $com.util.Clone(res.list);
                        // 	// $('.tb_users').bootstrapTable('load', res.list);
                        // 	for (var i = 0; i < wSearch.length; i++) {
                        // 		if (wSearch[i].Active == 2) {
                        // 			_list.push(wSearch[i]);
                        // 		}
                        // 	}

                        // 	$.each(_list, function (i, item) {
                        // 		for (var p in item) {
                        // 			if (!FORMATTRT[p])
                        // 				continue;
                        // 			item[p] = FORMATTRT[p](item[p]);
                        // 		}
                        // 		item.WID = i + 1;
                        // 	});
                        // 	DataAll = res.list;
                        // 	DataAllSearch = $com.util.Clone(_list);
                        // 	$("#femi-user-tbody").html($com.util.template(_list, HTML.TableUserItemNode));
                        // 	//$page.getPage(_list, "#femi-user-tbody", HTML.TableUserItemNode, ".table-part",p_flag);

                        // 	$("#femi-user-tbody tr").each(function (i, item) {
                        // 		var $this = $(this);
                        // 		var colorName = $this.css("background-color");
                        // 		$this.attr("data-color", colorName);


                        // 	});

                        // }

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
