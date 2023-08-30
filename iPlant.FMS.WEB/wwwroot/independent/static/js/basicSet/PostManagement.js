require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/jquery.treeview'], function ($alfie, $com, $tree) {
    var Formattrt_department; //字段格式化对象
    var KEYWORD_department; //查询关键字
    var KEYWORD_department_LIST; //定义字段格式(用于表格字段转换)
    var TypeSource_department; //枚举对象(用于字段转换)
    var mCloneData; //克隆的数据源(用于模糊查询)
    var HTML; //HTML模板
    var mActive = -1;
    var mCode = "";
    var mID = -1;
    var mData;
    var WholeID = 0;
    var NewDate = [];

    HTML = {
        TreeItemNode: [
            '<li class="range-role-li  {{Type}}" >',
            '<span style="vertical-align:top;font-size: 19px"><input type="checkbox" class="femi-tree-checkbox" style="margin: 1px 0 1px 10px"  value="{{FunctionID}}"  />{{Text}}</span> ',
            '<ul>{{Items}}</ul>',
            '</li> ',

        ].join(""),
        TableRolePeople: [
            '<tr data-color="">',
            // '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="LoginName" data-value="{{LoginName}}">{{LoginName}}</td>',
            '<td data-title="Name" data-value="{{Name}}">{{Name}}</td>',
            '</tr>',
        ].join(""),
        TableNode_item: [
            '<tr data-color="">',
            // '<td style="width: 3px"><input type="checkbox"',
            // 'class="femi-tb-checkbox" style="margin: 1px 0px 1px;" /></td> ',
            '<td style="min-width: 50px;" data-title="ID" data-value="{{ID}}">{{WID}}</td>',
            '<td style="min-width: 50px" data-title="Code" data-value="{{Code}}">{{Code}}</td>',
            '<td style="min-width: 50px" data-title="Name" data-value="{{Name}}">{{Name}}</td>',
            '<td style="min-width: 50px" data-title="EmployeeCount" data-value="{{EmployeeCount}}">{{EmployeeCount}}</td>',
            '<td style="min-width: 50px" data-title="Remark" data-value="{{Remark}}">{{Remark}}</td>',
            '<td style="min-width: 50px" data-title="EditorName" data-value="{{EditorName}}">{{EditorName}}</td>',
            '<td style="min-width: 50px" data-title="EditTime" data-value="{{EditTime}}">{{EditTime}}</td>',
            '<td data-title="Active" data-value="{{Active}}"data-id="{{ID}}"  class="ActiveSubmit" > <input type="checkbox"  class="{{Switch}}" /></td>',
            '<td style="max-width: 80px" data-title="Handle" data-value="{{ID}}"><div class="row">',
            '<div class="col-md-3 lmvt-do-info lmvt-addpeople"><span class="glyphicon glyphicon-user" aria-hidden="true"></span>人员</div>',
            '<div class="col-md-3 lmvt-do-info lmvt-setPower"><span class="glyphicon glyphicon-wrench" aria-hidden="true"></span>权限</div>',
            '<div class="col-md-3 lmvt-do-info lmvt-resetPencil"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>编辑</div>',
            '<div class="col-md-3 lmvt-do-info lmvt-delete"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span>删除</div>',
            '</div></td>',
            '</tr>',
        ].join(""),
    };

    (function () {
        KEYWORD_department_LIST = [
            "ID|岗位编号",
            "Name|岗位名称*",
            "DepartmentID|部门|ArrayOne",
            "EditTime|时间|DateTime",
            "Remark|岗位描述",
        ];


        KEYWORD_department = {};
        Formattrt_department = {};
        TypeSource_department = {
            DepartmentID: [],
        };

        $.each(KEYWORD_department_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD_department[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
            };
            var _column = {
                field: detail[0],
                title: detail[1],
                align: 'center',
                valign: 'middle',
                sortable: true,
            };
            if (detail.length > 2) {
                Formattrt_department[detail[0]] = $com.util.getFormatter(TypeSource_department, detail[0], detail[2]);
            }
        });
    })();

    model = $com.Model.create({
        name: '岗位管理',

        type: $com.Model.MAIN, //主方法

        configure: function () {
            this.run();
        },

        events: function () {

            //岗位新增
            $("body").delegate("#alfie-add-level", "click", function () {
                //将Json数据中的数据值改成对应默认值，然后传入进去
                DEFAULT_VALUE_D = {
                    Name: "",
                    DepartmentID: 0,
                    Remark: "",
                };
                $("body").append($com.modal.show(DEFAULT_VALUE_D, KEYWORD_department, "新增岗位", function (rst) {
                    //调用插入函数然后用load刷新数据源

                    if (!rst || $.isEmptyObject(rst))
                        return false;
                    var _data = {
                        ID: 0,
                        Name: rst.Name,
                        DepartmentID: Number(rst.DepartmentID),
                        SonList: [],
                        Active: 0,
                        Remark: rst.Remark,
                    };
                    for (var i = 0; i < mData.length; i++) {
                        if (rst.Name == mData[i].Name) {
                            alert("新增岗位已存在！");
                            return false;
                        }
                    }

                    $com.util.deleteLowerProperty(_data);
                    model.com.postPosition({
                        data: _data,
                    }, function (res) {
                        alert("新增成功！！");
                        model.com.refresh();
                    });
                }, TypeSource_department));
            });
            //岗位修改
            $("body").delegate(".lmvt-resetPencil", "click", function () {

                // var SelectData = $com.table.getSelectionData($(".l-containe-canvas-table .l-department-body"), "ID", AllDepartment);

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = mData.filter((item) => {
                    return item.ID == wID;
                });

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
                    Remark: SelectData[0].Remark,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_department, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].Name = rst.Name;
                    SelectData[0].Type = Number(rst.Type);
                    SelectData[0].ParentID = Number(rst.ParentID);
                    SelectData[0].Remark = rst.Remark;
                    $com.util.deleteLowerProperty(SelectData[0]);
                    model.com.postPosition({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功！！");
                        model.com.refresh();
                    });

                }, TypeSource_department));
            });
            //岗位删除
            $("body").delegate(".lmvt-delete", "click", function () {
                // var SelectData = $com.table.getSelectionData($(".l-containe-canvas-table .l-department-body"), "ID", AllDepartment);
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = mData.filter((item) => {
                    return item.ID == wID;
                });

                if (!SelectData || !SelectData.length) {
                    alert("至少选择一行数据再试！");
                    return;
                }
                if (SelectData[0].Active != 0) {
                    alert("已激活或者禁用数据无法删除！");
                    return;
                }
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {
                    return;
                }
                model.com.DeletePosition({
                    data: SelectData[0],
                }, function (res) {
                    alert("删除成功！！");
                    model.com.refresh();
                });

            });
            //岗位激活 禁用
            $("body").delegate(".ActiveSubmit", "click", function () {
                var $this = $(this),
                    wActiveID = Number($this.attr("data-value"));
                wID = Number($this.attr("data-id"));

                var SelectData = mData.filter((item) => {
                    return item.ID == wID;
                });

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！");
                    return;
                }
                if (wActiveID == 1) {
                    wActiveID = 2;
                } else {
                    wActiveID = 1;
                }

                model.com.ActivePosition({
                    Active: wActiveID,
                    data: SelectData,
                }, function (res) {
                    alert("操作成功！");
                    model.com.refresh();
                });
            });

            $("body").delegate("#femi-tree-update", "click", function () {
                debugger
                var $this = $(this),
                    list = [];
                // var _ids = $com.table.getSelectionTitle($("#femi-role-tbody"), "ID");

                // if (!_ids || !_ids.length) {
                //     alert("请先选择一行数据再试！")
                //     return;
                // }
                // if (_ids.length != 1) {
                //     alert("只能同时对一行数据修改！")
                //     return;
                // }
                if (WholeID == 0) {
                    alert("未查到数据！");
                    return;
                } else {
                    id = WholeID;
                }

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
                    data: list,
                    RoleID: id,
                }, function (res) {
                    alert("保存成功！");
                });
            });
            $("body").delegate(".lmvt-setPower", "click", function () {
                $(".zzzc").hide();
                $(".zzzb").show();
                $(".zzza").width("80%");
                $(window).resize();

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = mData.filter((item) => {
                    return item.ID == wID;
                });

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！");
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能选择一条数据！");
                    return;
                }
                WholeID = SelectData[0].ID;
                var id = SelectData[0].ID;

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
            });

            $("body").delegate("#alfie-hide-level", "click", function () {
                $(".zzza").width("100%");
                $(".zzzc").hide();
                $(".zzzb").hide();
                $(window).resize();
            });
            $("body").delegate("#people-hide-level", "click", function () {
                $(".zzza").width("100%");
                $(".zzzc").hide();
                $(".zzzb").hide();
                $(window).resize();
            });

            $("body").delegate(".lmvt-addpeople", "click", function () {
                $(".zzza").width("80%");
                $(".zzzc").show();
                $(".zzzb").hide();
                $(window).resize();
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value")),
                    permissionsName = $this.closest("td").parent('tr').find("[data-title=Name]")[0].innerText;

                $("#permissionsName").text(permissionsName);

                var SelectData = mData.filter((item) => {
                    return item.ID == wID;
                });

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！");
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能选择一条数据！");
                    return;
                }
                WholeID = SelectData[0].ID;
                model.com.getUserAll({
                    RoleID: wID,
                }, function (res) {
                    UserAll = res.list;

                    for (var i = 0; i < mData.length; i++) {
                        for (var m = 0; m < UserAll.length; m++) {
                            if (mData[i].ID == UserAll[m].RoleID) {
                                UserAll[m].RoleName = mData[i].Name;
                            }
                        }
                    }

                    $("#femi-role-user-tbody").html($com.util.template(UserAll, HTML.TableRolePeople));
                    $(window).resize();
                });
            });


            //重置
            $("body").delegate("#lmvt-reset", "click", function () {
                $(".selectpicker").selectpicker('deselectAll');
                mActive = -1;
                $("#alfie-query-Code").val("");
                mCode = "";
                mID = -1;
            });
            //查询
            $("body").delegate("#lmvt-search", "click", function () {
                mActive = $("#alfie-query-status").val();
                mCode = $("#alfie-query-Code").val();
                model.com.refresh();
            });
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
        },

        run: function () {
            // 开关
            $(".selectpicker").selectpicker({
                noneSelectedText: '请选择', //默认显示内容
                deselectAllText: '全不选',
                selectAllText: '全选',
            });
            model.com.getDepartment({}, function (res) {
                var list = res.list.filter(function (item) {
                    return item.Active === 1;
                });
                $.each(list, function (i, item) {
                    TypeSource_department.DepartmentID.push({
                        name: item.Name,
                        value: item.ID,
                        far: null,
                    });
                });
                model.com.refresh();
            });


        },

        com: {
            renderTree: function (list) {
                $com.app.loading('数据加载中...');
                model._treeData = list;
                var _data = FindData(0);
                SetData(_data);

                tempData(_data);

                $("#roleTree").html($com.util.template(_data, HTML.TreeItemNode));

                $('#roleTree').find('li ul').each(function (i, item) {
                    if ($(item).children('li')[0])
                        return true;
                    $(item).remove();
                });

                $("#roleTree").treeview();
                $com.app.loaded();

                function SetData(_in_data) {
                    $.each(_in_data, function (_in_i, _item) {
                        var d = FindData(_item.FunctionID);
                        if (d.length) {
                            _item.items = d;
                            SetData(_item.items);
                        }


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
                        _item_t.Type = '';
                        if (_item_t.items && _item_t.items.length) {
                            tempData(_item_t.items);
                            _item_t.Items = $com.util.template(_item_t.items, HTML.TreeItemNode);
                        }
                    });
                }

                /*
                function SetData(_in_data) {
                    $.each(_in_data, function(_in_i, _item) {
                        _item.items = FindData(_item.FunctionID);
                        if (_item.items.length)
                            SetData(_item.items);
                    });

                }
                function FindData(wRoleID) {
                    var _rst_Array = [];
                    $.each(list, function(i, item) {
                        if (wRoleID == item.RoleID) {
                            _rst_Array.push(item);
                        }
                    });
                    return _rst_Array;
                }
                function tempData(_in_data_t) {
                    $.each(_in_data_t, function(_in_i_t, _item_t) {
                        _item_t.Items = '';
                        _item_t.Type = '';
                        if (_item_t.items.length) {
                            tempData(_item_t.items);
                            _item_t.Items = $com.util.template(_item_t.items, HTML.TreeItemNode);
                        }
                    });
                }
                */

            },
            renderTreeCheck: function (list) {
                if (!$('#roleTree').children('li')[0]) {
                    model.com.getRoleTree({}, function (res) {
                        $("#role-range-contain").show();
                        model.com.renderTree(res.list);
                    });
                }

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


            //刷新界面
            refresh: function () {
                $com.app.loading('数据加载中...');
                model.com.getPosition({
                    Name: mCode,
                    Active: mActive,
                }, function (res) {
                    if (res && res.list) {
                        model._RoleData = $com.util.Clone(res.list);

                        mData = $com.util.Clone(res.list);
                        //数据源字段模板转换
                        var wItem = $com.util.Clone(mData);

                        $.each(wItem, function (i, item) {
                            if (item.Active == 1) {
                                item.Switch = "switchTrue";
                            } else {
                                item.Switch = "switchFalse";
                            }
                            for (var p in item) {
                                if (!Formattrt_department[p])
                                    continue;
                                item[p] = Formattrt_department[p](item[p]);
                            }
                            item.WID = i + 1;
                        });

                        mCloneData = $com.util.Clone(wItem);
                        $("#femi-Device-tbody-item").html($com.util.template(wItem, HTML.TableNode_item));
                        model.com.deleteClass(".lmvt-delete", mData);
                        $com.app.loaded();
                    }
                });
            },
            deleteClass: function (name, data) {
                data.forEach((element, index) => {
                    if (element.Active > 0) {
                        $($(name)[index]).css({"cursor": "not-allowed", "color": "RGB(204, 204, 204)"});
                        $(name)[index].onclick = function (event) {
                            event.stopPropagation();
                        };
                    }
                });

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
            //role_id
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
            //获取部门列表
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

            //获取岗位
            getPosition: function (data, fn, context) {
                var d = {
                    $URI: "/Role/All",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //新增修改岗位
            postPosition: function (data, fn, context) {
                var d = {
                    $URI: "/Role/Update",
                    $TYPE: "post",
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            ActivePosition: function (data, fn, context) {
                var d = {
                    $URI: "/Role/Active",
                    $TYPE: "post",
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            DeletePosition: function (data, fn, context) {
                var d = {
                    $URI: "/Role/Delete",
                    $TYPE: "post",
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

        },
    }),
        model.init();
});