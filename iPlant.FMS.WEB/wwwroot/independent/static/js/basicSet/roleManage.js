require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/jquery.treeview', '../static/utils/js/pickPeopleWeb'],
    function ($yang, $com, $tree, $pick) {

        var HTML,
            KEYWORD_ROLE,
            KEYWORD_USER,
            KEYWORD_LIST_ROLE,
            KEYWORD_LIST_USER,
            FORMATTRT_ROLE,
            FORMATTRT_USER,
            model,
            wDepartment = [],
            wUser = [],
            sRoleID,
            DEFAULT_VALUE_ROLE,
            DEFAULT_VALUE_USER,
            TypeSource_ROLE,
            TypeSource_USER;


        HTML = {
            TreeItemNode: [
                '<li class="range-role-li  {{Type}}" >',
                '<span style="vertical-align:top;"><input type="checkbox" class="femi-tree-checkbox" style="margin: 1px 0px 1px"  value="{{FunctionID}}"  />{{Text}}</span> ',
                '<ul>{{Items}}</ul>',
                '</li> ',

            ].join(""),
            TableRoleItemNode: [
                '<tr data-color="">',
                '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td data-title="ID" data-value="{{ID}}">{{ID}}</td>',
                '<td data-title="Name" data-value="{{Name}}">{{Name}}</td>',

                '<td data-title="OwnerID" data-value="{{OwnerID}}">{{OwnerName}}</td>',
                '<td data-title="CreateTime" data-value="{{CreateTime}}">{{CreateTimeText}}</td>',
                '<td data-title="Explain" data-value="{{Explain}}">{{Explain}}</td>',
                '<td data-title="Active" data-value="{{Active}}"><span class="badge lmvt-badge {{ClassBadge}}">{{Badge}}</span>{{ActiveText}}</td>',
                '<td style="max-width: 50px" data-title="Handle" data-value="{{ID}}"><div class="row">',
                '<div class="col-md-4 {{ISAllowed}}">{{ISAllowedText}}</div>',
                '<div class="col-md-4 {{ISDelete}}">修改</div>',
                '<div class="col-md-4" style="color: #409EFF;"><UL id="lmvt-nav">',
                '<LI>更多<UL><LI data-value="{{ID}}" class="lmvt-role">角色权限</LI>',
                '<LI data-value="{{ID}}" class="lmvt-user">角色用户</LI>',
                '</UL></LI></UL></div>',
                '</td>',

                '</tr>',
            ].join(""),
            TableRoleUserItemNode: [
                '<tr data-color="">',
                '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td data-title="FunctionID" data-value="{{FunctionID}}">{{UserName}}</td>',
                '<td data-title="RoleID" data-value="{{RoleID}}">{{RoleName}}</td>',
                '</tr>',
            ].join(""),
        };


        (function () {
            KEYWORD_LIST_ROLE = [
                "Name|角色名",
                "Explain|说明",
                "Active|状态|ArrayOne",
                "CreateTime|创建时间|DateTime",
            ];
            FORMATTRT_ROLE = {};
            KEYWORD_ROLE = {};
            DEFAULT_VALUE_ROLE = {
                Name: "",
                Explain: "",
                // Active: 1
            };

            TypeSource_ROLE = {
                Active: [{
                    name: "未使用",
                    value: 0,
                }, {
                    name: "启用",
                    value: 1,
                }, {
                    name: "禁用",
                    value: 2,
                }],
            };
            $.each(KEYWORD_LIST_ROLE, function (i, item) {
                var detail = item.split("|");
                KEYWORD_ROLE[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                };
                if (detail.length > 2) {
                    FORMATTRT_ROLE[detail[0]] = $com.util.getFormatter(TypeSource_ROLE, detail[0], detail[2]);
                }

            });


        })();

        (function () {
            KEYWORD_LIST_USER = [
                "DepartmentID|部门|ArrayOneControl",
                "FunctionID|用户名|ArrayControl|DepartmentID",
            ];

            KEYWORD_USER = {};
            FORMATTRT_USER = {};
            DEFAULT_VALUE_USER = {
                DepartmentID: 0,
                FunctionID: 0,
            };
            TypeSource_USER = {
                DepartmentID: [{
                    name: "全部",
                    value: 0,
                    far: 0,
                }],
                FunctionID: [
                    {
                        name: "无",
                        value: 0,
                    },
                ],
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
        //权限树
        (function () {
            KEYWORD_LIST_TREE = [
                "FunctionID|编码",
                "Text|文本",
                "RoleID|上级编码",
            ];
            FORMATTRT_TREE = {};
            KEYWORD_TREE = {};
            DEFAULT_VALUE_TREE = {
                FunctionID: 0,
                Text: "",
                RoleID: 0,
            };

            TypeSource_TREE = {};
            $.each(KEYWORD_LIST_TREE, function (i, item) {
                var detail = item.split("|");
                KEYWORD_TREE[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                };
                if (detail.length > 2) {
                    FORMATTRT_TREE[detail[0]] = $com.util.getFormatter(TypeSource_TREE, detail[0], detail[2]);
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
                $("body").delegate("#cby-refresh-TB", "click", function () {
                    $com.app.loading("正在加载！");
                    model.com.getTB({}, function (res) {
                        if (res.msg = "人员信息更新成功") {
                            alert(res.msg);
                            return false;
                        }
                        $com.app.loaded();
                    });
                });
                $("body").delegate("#role-range-contain ul li.change-tree", "click", function () {
                    var $this = $(this),
                        value = Number($this.attr("data-value"));

                    var wRoleID = Number($("#change-tree-text").attr("data-role"));
                    switch (value) {
                        case 1:

                            model.com.getRoleRangeSelect({
                                RoleID: wRoleID,
                            }, function (res) {
                                model.com.renderRangeTree(1);
                                model.com.renderRangeTreeCheck(res.list);
                                $("#change-tree-text").html($this.find("span").html());
                                $("#change-tree-text").attr("data-role", wRoleID);
                                $("#change-tree-text").attr("data-value", value);
                            });

                            break;
                        case 2:

                            model.com.getRoleRangeSelect({
                                RoleID: wRoleID,
                            }, function (res) {
                                model.com.renderRangeTree(2);
                                model.com.renderRangeTreeCheck(res.list);
                                $("#change-tree-text").html($this.find("span").html());
                                $("#change-tree-text").attr("data-role", wRoleID);
                                $("#change-tree-text").attr("data-value", value);
                            });

                            break;
                        default:
                    }

                });

                function CheckTree($this) {
                    var $Siblings = $this.parent('span').parent('li').parent('ul').children('li').children('span').children(".femi-tree-checkbox");

                    var $parent_check = $this.parent('span').parent('li').parent('ul').prev('span').children(".femi-tree-checkbox");

                    if ($this[0].checked) {

                        var Is_all = true;
                        $Siblings.each(function (i, item) {
                            if (!item.checked)
                                Is_all = false;
                        });
                        if (Is_all) {
                            $parent_check.prop("checked", true);
                            $parent_check.prop("indeterminate", false);
                        } else {
                            $parent_check.prop("checked", false);
                            $parent_check.prop("indeterminate", true);
                        }
                    } else {

                        var Is_all = true;
                        $Siblings.each(function (i, item) {
                            if (item.checked || $(item).prop("indeterminate"))
                                Is_all = false;
                        });
                        $parent_check.prop("checked", false);
                        if (Is_all) {
                            $parent_check.prop("indeterminate", false);
                        } else {
                            $parent_check.prop("indeterminate", true);
                        }
                    }

                    if ($parent_check[0])
                        CheckTree($parent_check);
                }

                $("body").delegate("#roleTree .femi-tree-checkbox,#rangeTree .femi-tree-checkbox", "change", function () {

                    var $this = $(this);


                    var $own_check = $this.parent('span').next('ul').find(".femi-tree-checkbox");

                    $own_check.prop("indeterminate", false);

                    var $Siblings = $this.parent('span').parent('li').parent('ul').children('li').children('span').children(".femi-tree-checkbox");

                    var $parent_check = $this.parent('span').parent('li').parent('ul').prev('span').children(".femi-tree-checkbox");

                    if ($this[0].checked) {
                        $own_check.prop("checked", true);
                        var Is_all = true;
                        $Siblings.each(function (i, item) {
                            if (!item.checked)
                                Is_all = false;
                        });
                        if (Is_all) {
                            $parent_check.prop("checked", true);
                            $parent_check.prop("indeterminate", false);
                        } else {
                            $parent_check.prop("checked", false);
                            $parent_check.prop("indeterminate", true);
                        }
                    } else {
                        $own_check.prop("checked", false);
                        var Is_all = true;
                        $Siblings.each(function (i, item) {
                            if (item.checked || $(item).prop("indeterminate"))
                                Is_all = false;
                        });
                        $parent_check.prop("checked", false);
                        if (Is_all) {
                            $parent_check.prop("indeterminate", false);
                        } else {
                            $parent_check.prop("indeterminate", true);
                        }
                    }

                    if ($parent_check[0])
                        CheckTree($parent_check);
                });


                $("body").delegate("#femi-add-role", "click", function () {
                    $("body").append($com.modal.show(DEFAULT_VALUE_ROLE, KEYWORD_ROLE, "新增角色", function (rst) {
                        //调用插入函数

                        if (!rst || $.isEmptyObject(rst))
                            return;
                        var _data = {
                            Name: rst.Name,
                            Explain: rst.Explain,
                            // Active: $com.util.boolean(rst.Active),
                            ActiveText: "",
                            CreateTime: new Date(),
                        };
                        model.com.saveRole({
                            data: _data,
                        }, function (res) {
                            if (res.info) {
                                res.info.ActiveText = FORMATTRT_ROLE["Active"](res.info.Active);
                                res.info.CreateTimeText = FORMATTRT_ROLE["CreateTime"](res.info.CreateTime);

                                model._RoleData.push(res.info);

                                res.info.OwnerName = model.com.GetName(res.info.OwnerID);
                                model.com.getRoleAll({}, function (res) {
                                    model.com.renderRole(res.list);
                                    alert("新增成功！");
                                });
                            }
                        });

                    }, TypeSource_ROLE));

                });


                //单条修改
                $("body").delegate(".lmvt-do-info", "click", function () {

                    var $this = $(this),
                        wID = Number($this.closest("td").attr("data-value"));

                    var Selection_Data = model._RoleData.filter((item) => {
                        return item.ID == wID;
                    });


                    // var _ids = $com.table.getSelectionTitle($("#femi-role-tbody"), "ID");

                    // if (!_ids || !_ids.length) {
                    // 	alert("请先选择一行数据再试！")
                    // 	return;
                    // }
                    // if (_ids.length != 1) {
                    // 	alert("只能同时对一行数据修改！")
                    // 	return;
                    // }
                    // var _index = $com.util.findIndex(model._RoleData, function (p) { return p.ID == _ids[0] });
                    // if (_index < 0) {
                    // 	alert("待修改的数据不存在！")
                    // 	return;
                    // }

                    // if (model._RoleData[_index].Active != 0) {
                    // 	alert("已" + FORMATTRT_ROLE["Active"](model._RoleData[_index].Active) + "的数据不能修改！")
                    // 	return;
                    // }

                    var in_data = {
                        Name: Selection_Data[0].Name,
                        Explain: Selection_Data[0].Explain,
                    };

                    $("body").append($com.modal.show(in_data, KEYWORD_ROLE, "修改角色", function (rst) {
                        //调用插入函数

                        if (!rst || $.isEmptyObject(rst))
                            return;

                        //model._RoleData[_index]
                        var _data = $com.util.Clone(Selection_Data[0]);
                        _data.Name = rst.Name;
                        _data.Explain = rst.Explain;
                        $com.util.deleteLowerProperty(_data);
                        model.com.saveRole({
                            data: _data,
                        }, function (res) {
                            if (res.info && res.info.ID) {

                                // res.info.ActiveText = FORMATTRT_ROLE["Active"](res.info.Active);
                                // res.info.CreateTimeText = FORMATTRT_ROLE["CreateTime"](res.info.CreateTime);

                                // Selection_Data[0] = res.info;


                                // var $td = $("#femi-role-tbody").children('tr').children('td[data-title=ID][data-value=' + res.info.ID + ']');

                                // if ($td[0]) {
                                // 	//SetTR(res.info, $td.parent("tr"), FORMATTRT_ROLE);
                                // 	var $Tr = $td.parent("tr");
                                // 	$Tr.replaceWith($com.util.template(res.info, HTML.TableRoleItemNode));
                                // }
                                model.com.getRoleAll({}, function (res1) {
                                    $com.util.deleteLowerProperty(res1.list);
                                    model.com.renderRole(res1.list);
                                });

                            }
                        });

                    }, TypeSource_ROLE));

                });

                $("body").delegate("#femi-edit-role", "click", function () {

                    var _ids = $com.table.getSelectionTitle($("#femi-role-tbody"), "ID");

                    if (!_ids || !_ids.length) {
                        alert("请先选择一行数据再试！");
                        return;
                    }
                    if (_ids.length != 1) {
                        alert("只能同时对一行数据修改！");
                        return;
                    }
                    var _index = $com.util.findIndex(model._RoleData, function (p) {
                        return p.ID == _ids[0];
                    });
                    if (_index < 0) {
                        alert("待修改的数据不存在！");
                        return;
                    }

                    if (model._RoleData[_index].Active != 0) {
                        alert("已" + FORMATTRT_ROLE["Active"](model._RoleData[_index].Active) + "的数据不能修改！");
                        return;
                    }

                    var in_data = {
                        Name: model._RoleData[_index].Name,
                        Explain: model._RoleData[_index].Explain,
                    };

                    $("body").append($com.modal.show(in_data, KEYWORD_ROLE, "修改角色", function (rst) {
                        //调用插入函数

                        if (!rst || $.isEmptyObject(rst))
                            return;

                        //model._RoleData[_index]
                        var _data = $com.util.Clone(model._RoleData[_index]);
                        _data.Name = rst.Name;
                        _data.Explain = rst.Explain;
                        $com.util.deleteLowerProperty(_data);
                        model.com.saveRole({
                            data: _data,
                        }, function (res) {
                            if (res.info && res.info.ID) {

                                res.info.ActiveText = FORMATTRT_ROLE["Active"](res.info.Active);
                                res.info.CreateTimeText = FORMATTRT_ROLE["CreateTime"](res.info.CreateTime);

                                model._RoleData[_index] = res.info;


                                var $td = $("#femi-role-tbody").children('tr').children('td[data-title=ID][data-value=' + res.info.ID + ']');

                                if ($td[0]) {
                                    //SetTR(res.info, $td.parent("tr"), FORMATTRT_ROLE);
                                    var $Tr = $td.parent("tr");
                                    $Tr.replaceWith($com.util.template(res.info, HTML.TableRoleItemNode));
                                }

                            }
                        });

                    }, TypeSource_ROLE));

                });

                function SetTR(in_data, $tr, FORMATTRT) {
                    for (var p in in_data) {
                        var $td = $tr.children('td[data-title=' + p + ']');
                        if (!$td[0]) {
                            continue;
                        }
                        $td.siblings('td[data-title=name]').attr('data-value', in_data[p]);
                        $td.siblings('td[data-title=name]').text((FORMATTRT && FORMATTRT[p]) ? FORMATTRT[p](in_data[p]) : in_data[p]);

                    }
                }


                $("body").delegate("#femi-active-role", "click", function () {

                    var $this = $(this),
                        _ids = $com.table.getSelectionTitle($("#femi-role-tbody"), "ID");

                    if (!_ids || !_ids.length) {
                        alert("请先选择一行数据再试！");
                        return;
                    }
                    var Selection_Data = [];
                    $.each(model._RoleData, function (i, item) {
                        if ($.inArray(item.ID, _ids) < 0) {
                            return true;
                        }
                        Selection_Data.push(item);

                    });

                    if (Selection_Data.length < 1) {
                        alert("选择的数据不存在，请换一行数据再试！");
                        return;
                    }
                    $this.attr("disabled", "true");
                    setTimeout(function () {
                        $this.removeAttr("disabled");
                    }, 3000);
                    $com.util.deleteLowerProperty(Selection_Data);
                    model.com.activeRoleList({
                        data: Selection_Data,
                        active: 1,
                    }, function (res) {
                        model.com.getRoleAll({}, function (res) {
                            $com.util.deleteLowerProperty(res.list);
                            model.com.renderRole(res.list);
                        });

                    });

                });

                //单条 启用
                $("body").delegate(".lmvt-do-active", "click", function () {

                    // var $this = $(this),
                    // 	_ids = $com.table.getSelectionTitle($("#femi-role-tbody"), "ID");

                    // if (!_ids || !_ids.length) {
                    // 	alert("请先选择一行数据再试！")
                    // 	return;
                    // }
                    // var Selection_Data = [];
                    // $.each(model._RoleData, function (i, item) {
                    // 	if ($.inArray(item.ID, _ids) < 0) {
                    // 		return true;
                    // 	}
                    // 	Selection_Data.push(item);

                    // });

                    // if (Selection_Data.length < 1) {
                    // 	alert("选择的数据不存在，请换一行数据再试！")
                    // 	return;
                    // }

                    var $this = $(this),
                        wID = Number($this.closest("td").attr("data-value"));

                    var Selection_Data = model._RoleData.filter((item) => {
                        return item.ID == wID;
                    });

                    $this.attr("disabled", "true");
                    setTimeout(function () {
                        $this.removeAttr("disabled");
                    }, 3000);
                    $com.util.deleteLowerProperty(Selection_Data);
                    model.com.activeRoleList({
                        data: Selection_Data,
                        active: 1,
                    }, function (res) {
                        model.com.getRoleAll({}, function (res) {
                            $com.util.deleteLowerProperty(res.list);
                            model.com.renderRole(res.list);
                        });

                    });

                });
                //禁用单条
                $("body").delegate(".lmvt-do-forbidden", "click", function () {
                    var $this = $(this),
                        wID = Number($this.closest("td").attr("data-value"));

                    var Selection_Data = model._RoleData.filter((item) => {
                        return item.ID == wID;
                    });

                    $this.attr("disabled", "true");
                    setTimeout(function () {
                        $this.removeAttr("disabled");
                    }, 3000);
                    $com.util.deleteLowerProperty(Selection_Data);
                    model.com.activeRoleList({
                        data: Selection_Data,
                        active: 0,
                    }, function (res) {
                        model.com.getRoleAll({}, function (res) {
                            $com.util.deleteLowerProperty(res.list);
                            model.com.renderRole(res.list);
                        });

                    });
                });

                $("body").delegate("#femi-disable-role", "click", function () {
                    var $this = $(this),
                        _ids = $com.table.getSelectionTitle($("#femi-role-tbody"), "ID");

                    if (!_ids || !_ids.length) {
                        alert("请先选择一行数据再试！");
                        return;
                    }
                    var Selection_Data = [];
                    $.each(model._RoleData, function (i, item) {
                        if ($.inArray(item.ID, _ids) < 0) {
                            return true;
                        }
                        Selection_Data.push(item);

                    });

                    if (Selection_Data.length < 1) {
                        alert("选择的数据不存在，请换一行数据再试！");
                        return;
                    }
                    $this.attr("disabled", "true");
                    setTimeout(function () {
                        $this.removeAttr("disabled");
                    }, 3000);
                    $com.util.deleteLowerProperty(Selection_Data);
                    model.com.activeRoleList({
                        data: Selection_Data,
                        active: 0,
                    }, function (res) {
                        model.com.getRoleAll({}, function (res) {
                            $com.util.deleteLowerProperty(res.list);
                            model.com.renderRole(res.list);
                        });

                    });
                });

                $("body").delegate("#femi-add-user", "click", function () {
                    // $("body").append($com.modal.show(DEFAULT_VALUE_USER, KEYWORD_USER, "新增用户", function (rst) {
                    // 	//调用插入函数

                    // 	if (!rst || $.isEmptyObject(rst))
                    // 		return;

                    // 	var _data = [].concat(model._RoleUserData);
                    // 	$.each(rst.FunctionID, function (i, item) {
                    // 		if (!item) {
                    // 			return true;
                    // 		}
                    // 		_data.push({
                    // 			FunctionID: item,
                    // 			RoleID: model._Role_ID,
                    // 			Text: ""
                    // 		});

                    // 	});

                    // 	model.com.saveRoleUser({
                    // 		data: _data, RoleID: model._Role_ID
                    // 	}, function (res) {
                    // 		model.com.getRoleUser({
                    // 			role_id: model._Role_ID
                    // 		}, function (resp) {

                    // 			model.com.renderRoleUser(resp.list, model._Role_Name, model._Role_ID);
                    // 		});
                    // 	});

                    // }, TypeSource_USER));

                    EchoData = [];
                    if (model._RoleUserData && model._RoleUserData.length > 0) {
                        for (var i = 0; i < model._RoleUserData.length; i++) {
                            EchoData.push(model._RoleUserData[i].FunctionID);
                        }
                    }

                    wPeople = {
                        EmployeeList: [],
                        DepartmentList: [],
                    };
                    var param = {
                        EchoData: EchoData,//回显数据
                        PeopleList: wPeople, //第一层（公司领导下所有部门以及下所有人员）
                        DepartmentList: wDepartment,//所有部门
                        UserList: wUser,//所有人员(已激活)
                        title1: "广州电力机车",  //主标题
                        title2: "广机", //公司部门
                        mode: 2,   //1 单选 2多选(单选人员不包括部门)
                    };

                    $pick.show(param, function (mNameList) {
                        SelectPersonID = [];
                        for (var i = 0; i < mNameList.length; i++) {
                            SelectPersonID.push(mNameList[i]);
                        }
                        SelectPersonID = model.com.arryOnea(SelectPersonID);
                        //人员ID集合用string存取
                        var UserStr = "";
                        var StrArray = [];
                        var StrArrayName = [];
                        for (var m = 0; m < SelectPersonID.length; m++) {
                            StrArray.push(SelectPersonID[m].ID);
                            StrArrayName.push(SelectPersonID[m].Name + '(' + SelectPersonID[m].DepartmentName + ')');
                        }

                        // var _data = [].concat(model._RoleUserData);
                        var _data = [];
                        $.each(StrArray, function (i, item) {
                            if (!item) {
                                return true;
                            }
                            _data.push({
                                FunctionID: item,
                                RoleID: model._Role_ID,
                                Text: "",
                            });

                        });

                        model.com.saveRoleUser({
                            data: _data, RoleID: model._Role_ID,
                        }, function (res) {

                            model.com.getRoleUser({
                                role_id: model._Role_ID,
                            }, function (resp) {

                                model.com.renderRoleUser(resp.list, model._Role_Name, model._Role_ID);
                            });
                        });
                    });
                });

                $("body").delegate("#femi-remove-user", "click", function () {

                    var $this = $(this),
                        _ids = $com.table.getSelectionTitle($("#femi-role-user-tbody"), "FunctionID");

                    if (!_ids || !_ids.length) {
                        alert("请先选择一行数据再试！");
                        return;
                    }
                    var Selection_Data = [];
                    $.each(model._RoleUserData, function (i, item) {
                        if ($.inArray(item.FunctionID, _ids) >= 0) {
                            //选中的不添加 不保存   即选中的删除
                            return true;
                        }
                        Selection_Data.push(item);

                    });

                    if (Selection_Data.length == model._RoleUserData.length) {
                        alert("选择的数据不存在，请换一行数据再试！");
                        return;
                    }

                    $this.attr("disabled", "true");

                    setTimeout(function () {
                        $this.removeAttr("disabled");
                    }, 2000);

                    model.com.saveRoleUser({
                        data: Selection_Data, RoleID: model._Role_ID,
                    }, function (res) {
                        model.com.getRoleUser({
                            role_id: model._Role_ID,
                        }, function (resp) {
                            model.com.renderRoleUser(resp.list, model._Role_Name, model._Role_ID);
                        });
                    });
                });

                $("body").delegate("#femi-detail-role", "click", function () {
                    var $this = $(this),
                        id = Number($this.closest("td").attr("data-value"));

                    var _index = $com.util.findIndex(model._RoleData, function (p) {
                        return p.ID == id;
                    });
                    if (_index < 0) {
                        alert("待查看的数据不存在！");
                        return;
                    }

                    if (!id || isNaN(id)) {
                        return;
                    }
                    var name = model._RoleData[_index].Name;

                    var roleID = Number(id);

                    // model.com.getRoleSelect({
                    //     role_id: roleID
                    // }, function (res) {
                    //     model.com.renderTreeCheck(res.list);
                    // });
                    model.com.getRoleUser({
                        role_id: roleID,
                    }, function (res) {
                        model.com.renderRoleUser(res.list, name, roleID);
                    });
                });
                //角色权限 单条
                $("body").delegate(".lmvt-role", "click", function () {
                    var $this = $(this),
                        id = Number($this.closest("td").attr("data-value"));

                    // var Selection_Data = model._RoleData.filter((item) => { return item.ID == wID });

                    // var id = _ids[0];

                    var _index = $com.util.findIndex(model._RoleData, function (p) {
                        return p.ID == id;
                    });
                    if (_index < 0) {
                        alert("待查看的数据不存在！");
                        return;
                    }

                    if (!id || isNaN(id)) {
                        return;
                    }
                    var name = model._RoleData[_index].Name;

                    var roleID = Number(id);

                    model.com.getRoleSelect({
                        role_id: roleID,
                    }, function (res) {
                        model.com.renderTreeCheck(res.list);
                    });
                    // model.com.getRoleUser({
                    //     role_id: roleID
                    // }, function (res) {
                    //     model.com.renderRoleUser(res.list, name, roleID);
                    // });
                });
                //角色用户 单条
                $("body").delegate(".lmvt-user", "click", function () {

                    var $this = $(this),
                        id = Number($this.closest("td").attr("data-value"));

                    var _index = $com.util.findIndex(model._RoleData, function (p) {
                        return p.ID == id;
                    });
                    if (_index < 0) {
                        alert("待查看的数据不存在！");
                        return;
                    }

                    if (!id || isNaN(id)) {
                        return;
                    }
                    var name = model._RoleData[_index].Name;

                    var roleID = Number(id);

                    // model.com.getRoleSelect({
                    //     role_id: roleID
                    // }, function (res) {
                    //     model.com.renderTreeCheck(res.list);
                    // });
                    model.com.getRoleUser({
                        role_id: roleID,
                    }, function (res) {
                        model.com.renderRoleUser(res.list, name, roleID);
                    });
                });

                $("body").delegate("#femi-detail-roleRange", "click", function () {
                    var _ids = $com.table.getSelectionTitle($("#femi-role-tbody"), "ID");

                    if (!_ids || !_ids.length) {
                        alert("请先选择一行数据再试！");
                        return;
                    }
                    if (_ids.length != 1) {
                        alert("只能选择一条数据！");
                        return;
                    }
                    var id = _ids[0];

                    var _index = $com.util.findIndex(model._RoleData, function (p) {
                        return p.ID == id;
                    });
                    if (_index < 0) {
                        alert("待查看的数据不存在！");
                        return;
                    }

                    if (!id || isNaN(id)) {
                        return;
                    }
                    var name = model._RoleData[_index].Name;

                    var roleID = Number(id);

                    model.com.getRoleSelect({
                        role_id: roleID,
                    }, function (res) {
                        model.com.renderTreeCheck(res.list);
                    });
                    // model.com.getRoleUser({
                    //     role_id: roleID
                    // }, function (res) {
                    //     model.com.renderRoleUser(res.list, name, roleID);
                    // });
                });

                $("body").delegate("#femi-range-role", "click", function () {
                    var _ids = $com.table.getSelectionTitle($("#femi-role-tbody"), "ID");

                    if (!_ids || !_ids.length) {
                        alert("请先选择一行数据再试！");
                        return;
                    }
                    if (_ids.length != 1) {
                        alert("只能同时对一行数据修改！");
                        return;
                    }
                    var id = _ids[0];

                    var _index = $com.util.findIndex(model._RoleData, function (p) {
                        return p.ID == id;
                    });
                    if (_index < 0) {
                        alert("待查看的数据不存在！");
                        return;
                    }

                    if (!id || isNaN(id)) {
                        return;
                    }
                    var name = model._RoleData[_index].Name;

                    var roleID = Number(id);

                    $("#role-user-contain").hide();

                    if ($("#role-range-contain").is(":hidden")) {
                        $("#role-range-contain").show();
                    }

                    model.com.getRoleRangeSelect({
                        RoleID: roleID,
                    }, function (res) {
                        model._Role_ID = roleID;
                        model.com.renderRangeTree(Number($("#change-tree-text").attr("data-value")));
                        model.com.renderRangeTreeCheck(res.list);
                        $("#change-tree-text").attr("data-role", roleID);
                    });
                });


                function GetRoleItemByNode(RoleID) {
                    var _rst = $com.util.find(model._RoleData, function (p) {
                        return p.ID == RoleID;
                    });
                    return _rst;
                }

                function GetRoleUserItemByNode(FunctionID) {
                    var _rst = $com.util.find(model._RoleUserData, function (p) {
                        return p.FunctionID == FunctionID;
                    });
                    return _rst;
                }

                $("body").delegate("#femi-tree-update", "click", function () {
                    var $this = $(this),
                        list = [];
                    var _ids = $com.table.getSelectionTitle($("#femi-role-tbody"), "ID");

                    if (!_ids || !_ids.length) {
                        alert("请先选择一行数据再试！");
                        return;
                    }
                    if (_ids.length != 1) {
                        alert("只能同时对一行数据修改！");
                        return;
                    }
                    id = _ids[0];
                    $("#roleTree li span input[type=checkbox].femi-tree-checkbox").each(function (i, item) {

                        if (item.checked || item.indeterminate) {
                            list.push({
                                FunctionID: Number($(item).val()),
                                Text: $(item).parent().text(),
                                RoleID: id,
                            });

                        }

                    });
                    $this.attr("disabled", "true");
                    setTimeout(function () {
                        $this.removeAttr("disabled");
                    }, 2000);
                    model.com.saveRoleSelect({
                        data: list, RoleID: id,
                    }, function (res) {
                        alert("保存成功！");
                    });
                });

                $("body").delegate("#femi-tree-range-update", "click", function () {
                    var $this = $(this),
                        list = [];
                    $("#rangeTree li span input[type=checkbox].femi-tree-checkbox").each(function (i, item) {

                        if (item.checked) {
                            var wType = 0;
                            if ($(item).closest("li").hasClass("Femi-Line"))
                                wType = 4;
                            if ($(item).closest("li").hasClass("Femi-WorkShop"))
                                wType = 3;
                            if ($(item).closest("li").hasClass("Femi-Business"))
                                wType = 2;
                            if ($(item).closest("li").hasClass("Femi-Factory"))
                                wType = 1;

                            list.push({
                                FunctionID: Number($(item).val()),
                                TypeID: wType,
                                RoleID: model._Role_ID,
                                Text: "",
                            });
                        }
                    });
                    $this.attr("disabled", "true");
                    setTimeout(function () {
                        $this.removeAttr("disabled");
                    }, 2000);
                    model.com.saveRoleRangeSelect({
                        data: list,
                    }, function (res) {
                        alert("保存成功！");
                    });
                });

                $("body").delegate("#femi-add-tree", "click", function () {
                    $("body").append($com.modal.show(DEFAULT_VALUE_TREE, KEYWORD_TREE, "新增角色", function (rst) {
                        //调用插入函数

                        if (!rst || $.isEmptyObject(rst))
                            return;
                        var _data = {
                            ID: 0,
                            FunctionID: Number(rst.FunctionID),
                            Text: rst.Text,
                            RoleID: Number(rst.RoleID),
                        };
                        model.com.postRoleTree({
                            data: _data,
                        }, function (res) {
                            if (res.info && res.info.ID) {
                                alert("新增成功！");
                            }
                        });

                    }, TypeSource_TREE));

                });
            },

            run: function () {
                model.com.getUserAll({active: 1}, function (res) {
                    model._employee = res.list;
                    wUser = res.list;
                });
                model.com.getFactoryAll({}, function (data) {
                    model.dataFactory = data.list;
                });
                model.com.getBusinessAll({}, function (data) {
                    model.dataBusiness = data.list;
                });
                model.com.getWorkShopAll({}, function (data) {
                    model.dataWorkShop = data.list;

                });
                model.com.getLineAll({}, function (data) {
                    model.dataLine = data.list;
                });
                model.com.getRoleTree({}, function (res) {
                    model.com.renderTree(res.list);

                    $("#role-range-contain").hide();

                });

                model.com.getRoleAll({}, function (res) {
                    model.com.renderRole(res.list);

                });
                model.com.getDepartment({}, function (res1) {
                    wDepartment = $com.util.Clone(res1.list);
                    var rst = model.com.utils.getSon(res1.list);
                    $.each(rst, function (s_i, s_item) {
                        TypeSource_USER.DepartmentID.push({
                            name: s_item.Name,
                            value: s_item.ID,
                            far: 0,
                        });
                    });

                });

            },

            com: {
                //新增权限树
                postRoleTree: function (data, fn, context) {
                    var d = {
                        $URI: "/Role/TreeUpdate",
                        $TYPE: "post",
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

                getUserAll: function (data, fn, context) {
                    var d = {
                        $URI: "/User/All",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //同步数据
                getTB: function (data, fn, context) {
                    var d = {
                        $SERVER: "/MESBPM",
                        $URI: "/Repository/UpdateMembership",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
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
                activeRoleList: function (data, fn, context) {
                    var d = {
                        $URI: "/Role/Active",
                        $TYPE: "post",
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                saveRole: function (data, fn, context) {
                    var d = {
                        $URI: "/Role/Update",
                        $TYPE: "post",
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                getRoleSelect: function (data, fn, context) {
                    var d = {
                        $URI: "/Role/Select",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                saveRoleSelect: function (data, fn, context) {
                    var d = {
                        $URI: "/Role/UpdateSelect",
                        $TYPE: "post",
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                getRoleUser: function (data, fn, context) {
                    var d = {
                        $URI: "/Role/UserAll",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                saveRoleUser: function (data, fn, context) {
                    var d = {
                        $URI: "/Role/UpdateUser",
                        $TYPE: "post",
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                getBusinessAll: function (data, fn, context) {
                    var d = {
                        $URI: "/BusinessUnit/All",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                getWorkShopAll: function (data, fn, context) {
                    var d = {
                        $URI: "/FMCWorkShop/All",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                getLineAll: function (data, fn, context) {
                    var d = {
                        $URI: "/FMCLine/All",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                getFactoryAll: function (data, fn, context) {
                    var d = {
                        $URI: "/FMCFactory/All",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                getRoleRangeSelect: function (data, fn, context) {
                    var d = {
                        $URI: "/Role/RoleRangeAll",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                saveRoleRangeSelect: function (data, fn, context) {
                    var d = {
                        $URI: "/Role/UpdateRoleRange",
                        $TYPE: "post",
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                renderRole: function (list) {
                    $com.app.loading('数据加载中...');
                    $.each(list, function (i, item) {

                        item.Badge = " ";

                        if (item.Active == 1) {

                            item.ISAllowedText = "禁用";
                            item.ISAllowed = "lmvt-do-forbidden";
                            item.ClassBadge = "lmvt-activeBadge";
                            item.ISDelete = "lmvt-not-allowed-delete";


                        } else if (item.Active == 2) {

                            item.ISAllowedText = "启用";
                            item.ISAllowed = "lmvt-do-active";
                            item.ClassBadge = "lmvt-forbiddenBadge";
                            item.ISDelete = "lmvt-not-allowed-delete";


                        } else {
                            item.ISAllowedText = "启用";
                            item.ISAllowed = "lmvt-do-active";
                            item.ClassBadge = "lmvt-defBadge";
                            item.ISDelete = "lmvt-do-info";
                        }

                        item.WID = i + 1;

                        item.ActiveText = FORMATTRT_ROLE["Active"](item.Active);
                        item.CreateTimeText = FORMATTRT_ROLE["CreateTime"](item.CreateTime);
                    });
                    model._RoleData = list;

                    $(".femi-bd-half-right").hide();
                    $("#select_role_lable").html("");
                    $("#roleTree li span input[type=checkbox].femi-tree-checkbox").prop("checked", false);

                    $("#femi-role-tbody").html($com.util.template(list, HTML.TableRoleItemNode));
                    $com.app.loaded();
                    $("#femi-role-tbody tr").each(function (i, item) {
                        var $this = $(this);
                        var colorName = $this.css("background-color");
                        $this.attr("data-color", colorName);


                    });

                    $("#femi-role-tbody").prev('thead').children('tr').children('th').children('input[type=checkbox].femi-tb-checkbox').prop("checked", false);

                },

                renderRoleUser: function (list, roleName, role_ID) {
                    $com.app.loading('数据加载中...');
                    var temp_source = [].concat(model._employee);

                    $.each(list, function (i, item) {
                        var _index = $com.util.findIndex(temp_source, function (p) {
                            return p.ID == item.FunctionID;
                        });
                        if (_index < 0)
                            return true;
                        item.RoleName = roleName;
                        item.UserName = temp_source[_index].Name;

                        temp_source.splice(_index, 1);

                    });

                    TypeSource_USER.FunctionID.splice(0, TypeSource_USER.FunctionID.length);

                    $.each(temp_source, function (s_i, s_item) {
                        TypeSource_USER.FunctionID.push({
                            name: s_item.Name,
                            value: s_item.ID,
                            far: s_item.DepartmentID,
                        });
                    });


                    model._RoleUserData = list;
                    model._Role_ID = role_ID;
                    model._Role_Name = roleName;

                    $("#role-range-contain").hide();
                    /*$("#role_user_head").html(roleName);*/
                    //if ($("#role-user-contain").is(":hidden")) {
                    $("#role-user-contain").show();

                    //}

                    $("#select_role_lable").html("当前选择:" + roleName);

                    $("#femi-role-user-tbody ").html($com.util.template(list, HTML.TableRoleUserItemNode));
                    $com.app.loaded();
                    $("#femi-role-user-tbody tr").each(function (i, item) {
                        var $this = $(this);
                        var colorName = $this.css("background-color");
                        $this.attr("data-color", colorName);


                    });
                    $("#femi-role-user-tbody").prev('thead').children('tr').children('th').children('input[type=checkbox].femi-tb-checkbox').prop("checked", false);

                },

                renderTree: function (list) {
                    $com.app.loading('数据加载中...');
                    model._treeData = list;
                    var _data = FindData(0);
                    SetData(_data);

                    tempData(_data);

                    $("#roleTree").html($com.util.template(_data, HTML.TreeItemNode));

                    $("#roleTree").treeview();
                    $com.app.loaded();

                    function SetData(_in_data) {
                        $.each(_in_data, function (_in_i, _item) {
                            _item.items = FindData(_item.FunctionID);
                            if (_item.items.length)
                                SetData(_item.items);
                        });

                    }

                    function FindData(wRoleID) {
                        var _rst_Array = [];
                        $.each(list, function (i, item) {
                            if (wRoleID == item.RoleID) {
                                _rst_Array.push(item);
                            }
                        });
                        return _rst_Array;
                    }

                    function tempData(_in_data_t) {
                        $.each(_in_data_t, function (_in_i_t, _item_t) {
                            _item_t.Items = '';
                            _item_t.Type = '';
                            if (_item_t.items.length) {
                                tempData(_item_t.items);
                                _item_t.Items = $com.util.template(_item_t.items, HTML.TreeItemNode);
                            }
                        });
                    }

                },

                renderRangeTree: function (value) {
                    $com.app.loading('数据加载中...');
                    if (!value)
                        return;
                    var wResult = [];

                    var wLineList = {};
                    $.each(model.dataLine, function (l_i, l_item) {
                        if (!wLineList[l_item.WorkShopID])
                            wLineList[l_item.WorkShopID] = [];
                        wLineList[l_item.WorkShopID].push({
                            FunctionID: l_item.ID,
                            Text: l_item.Name,
                            Items: "",
                            Type: "Femi-Line",
                        });
                    });

                    var wWorkShopListBus = {};
                    $.each(model.dataWorkShop, function (w_i, w_item) {
                        if (!wWorkShopListBus[w_item.BusinessUnitID])
                            wWorkShopListBus[w_item.BusinessUnitID] = [];

                        wWorkShopListBus[w_item.BusinessUnitID].push({
                            FunctionID: w_item.ID,
                            Text: w_item.Name,
                            Items: wLineList[w_item.ID] ? $com.util.template(wLineList[w_item.ID], HTML.TreeItemNode) : "",
                            Type: "Femi-WorkShop",
                        });
                    });
                    var wWorkShopListFac = {};
                    $.each(model.dataWorkShop, function (w_i, w_item) {
                        if (!wWorkShopListFac[w_item.FactoryID])
                            wWorkShopListFac[w_item.FactoryID] = [];

                        wWorkShopListFac[w_item.FactoryID].push({
                            FunctionID: w_item.ID,
                            Text: w_item.Name,
                            Items: wLineList[w_item.ID] ? $com.util.template(wLineList[w_item.ID], HTML.TreeItemNode) : "",
                            Type: "Femi-WorkShop",
                        });
                    });

                    switch (value) {
                        case 1:
                            $.each(model.dataBusiness, function (i, item) {

                                wResult.push({
                                    FunctionID: item.ID,
                                    Text: item.Name,
                                    Items: wWorkShopListBus[item.ID] ? $com.util.template(wWorkShopListBus[item.ID], HTML.TreeItemNode) : "",
                                    Type: "Femi-Business",
                                });
                            });
                            break;
                        case 2:
                            $.each(model.dataFactory, function (i, item) {

                                wResult.push({
                                    FunctionID: item.ID,
                                    Text: item.Name,
                                    Items: wWorkShopListFac[item.ID] ? $com.util.template(wWorkShopListFac[item.ID], HTML.TreeItemNode) : "",
                                    Type: "Femi-Factory",
                                });
                            });
                            break;
                        default:
                            break;
                    }
                    $("#rangeTree").html($com.util.template(wResult, HTML.TreeItemNode));

                    $("#rangeTree").treeview();
                    $com.app.loaded();
                },

                renderTreeCheck: function (list) {

                    $("#role-range-contain").show();

                    //if ($("#role-user-contain").is(":hidden")) {
                    $("#role-user-contain").hide();

                    //}
                    $("#roleTree li span input[type=checkbox].femi-tree-checkbox").prop("checked", false);
                    $("#roleTree li span input[type=checkbox].femi-tree-checkbox").prop("indeterminate", false);
                    $("#roleTree li span input[type=checkbox].femi-tree-checkbox").each(function (i, item) {
                        var functionID = $(item).val();
                        if (!functionID || isNaN(functionID)) {
                            return true;
                        }
                        functionID = Number(functionID);

                        var _index = $com.util.findIndex(list, function (p) {
                            return p.FunctionID == functionID;
                        });
                        if (_index < 0) {
                            $(item).prop("checked", false);
                            return true;
                        }
                        $(item).prop("checked", true);
                        $(item).change();

                    });
                },
                arryOnea: function (data) {
                    var temp = {};
                    var arr = [];
                    var len = data.length;
                    for (var i = 0; i < len; i++) {
                        if (!temp[data[i].ID]) {
                            temp[data[i].ID] = "abc";
                            arr.push(data[i]);
                        }
                    }
                    return arr;
                },
                renderRangeTreeCheck: function (list) {
                    $("#rangeTree li span input[type=checkbox].femi-tree-checkbox").prop("checked", false);
                    $("#rangeTree li span input[type=checkbox].femi-tree-checkbox").prop("indeterminate", false);


                    $("#rangeTree li.Femi-Line span input[type=checkbox].femi-tree-checkbox").each(function (i, item) {
                        var functionID = $(item).val();
                        if (!functionID || isNaN(functionID)) {
                            return true;
                        }
                        functionID = Number(functionID);

                        var _index = $com.util.findIndex(list, function (p) {
                            return p.TypeID == 4 && p.FunctionID == functionID;
                        });
                        if (_index < 0) {
                            /*$(item).prop("checked",false);*/
                            return true;
                        }
                        $(item).prop("checked", true);
                        $(item).change();

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
                },

                GetName: function (id) {
                    var Name;
                    $.each(window.parent._UserAll, function (i, item) {
                        if (item.ID == id) {
                            Name = item.Name;
                            return Name;
                        }
                    });
                    return Name;
                },
            },
        });

        model.init();
    });