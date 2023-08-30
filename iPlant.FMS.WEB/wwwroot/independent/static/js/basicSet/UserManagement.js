require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/pickPeopleWeb', '../static/utils/js/pickDate', '../static/utils/js/pickDepartment', '../static/utils/js/base/jquery.treeview'], function ($alfie, $com, $pick, $pickDate, $pickDepartment) {
    var Formattrt_department; //字段格式化对象
    var KEYWORD_department; //查询关键字
    var KEYWORD_department_LIST; //定义字段格式(用于表格字段转换)
    var TypeSource_department; //枚举对象(用于字段转换)
    var mCloneData; //克隆的数据源(用于模糊查询)
    var HTML; //HTML模板
    var mActive = -1;
    var mCode = '';
    var mID = -1;
    var mData;
    var DepartmentList = [];
    var PositionList = [];
    var NewDate = [];
    var mRoleID = -1;
    var mDepartmentID = -1;
    var wRoleAll = [];
    var wRoleTree = [];
    var wUser = [];
    var mName = '';

    HTML = {
        TreeItemNode: [
            '<li class="range-role-li  {{Type}}" >',
            '<span style="vertical-align:top;font-size: 19px"><input type="checkbox" style="cursor: not-allowed;margin-left: 5px;" onclick="javascript: return false;" class="femi-tree-checkbox" style="margin: 1px 0 1px 10px"  isCheck="{{ isCheck }}"  value="{{FunctionID}}"  />{{Text}}</span> ',
            '<ul>{{Items}}</ul>',
            '</li> ',
        ].join(''),
        TableNode_item: [
            '<tr data-color="">',
            // '<td style="width: 3px"><input type="checkbox"',
            // 'class="femi-tb-checkbox" style="margin: 1px 0px 1px;" /></td> ',
            '<td style="min-width: 50px;" data-title="ID" data-value="{{ID}}">{{WID}}</td>',
            '<td style="min-width: 50px" data-title="LoginID" data-value="{{LoginID}}">{{LoginID}}</td>',
            '<td style="min-width: 50px" data-title="Name" data-value="{{Name}}">{{Name}}</td>',
            '<td style="min-width: 50px" data-title="Type" data-value="{{Type}}">{{Type}}</td>',
            '<td style="min-width: 50px" data-title="Department" data-value="{{Department}}">{{Department}}</td>',
            '<td style="min-width: 50px" data-title="RoleName" data-value="{{RoleName}}">{{RoleName}}</td>',
            '<td style="min-width: 50px" data-title="LoginName" data-value="{{LoginName}}">{{LoginName}}</td>',
            '<td style="min-width: 50px" data-title="Phone" data-value="{{Phone}}">{{Phone}}</td>',
            '<td data-title="Active" data-value="{{Active}}" data-id="{{ID}}"  class="ActiveSubmit" > <input type="checkbox" data-grad="{{Grad}}"  class="{{Switch}}" /></td>',
            '<td style="max-width: 80px" data-title="Handle" data-value="{{ID}}"><div class="row">',

            '<div class="col-md-4 lmvt-do-info lmvt-resetPencil"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>编辑</div>',
            '<div class="col-md-4 lmvt-do-info lmvt-setPower"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span>权限</div>',
            // '<div class="col-md-3 lmvt-do-info lmvt-frozen"><span class="glyphicon glyphicon-ban-circle" aria-hidden="true"></span>冻结</div>',
            '<div class="col-md-4 lmvt-do-info lmvt-delete"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span>删除</div>',
            '</div></td>',
            '</tr>',
        ].join(''),
        TableRoleUserItemNode: [
            '<tr data-color="">',
            // '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="FunctionID" data-value="">{{RoleName}}</td>',
            '<td data-title="RoleID" data-value="">{{Text}}</td>',
            '</tr>',
        ].join(''),
        selectOption: '<option class="Department" value="{{ID}}">{{Name}}</option>',
        selectOptionPosition: '<option  value="{{ID}}">{{Name}}</option>',
    };
    (function () {
        KEYWORD_department_LIST = [
            'LoginID|工号*',
            'ID|员工编号',
            'Name|*员工名称',
            'DepartmentID|部门|ArrayOneControl',
            'RoleIDList|岗位|ArrayControl|DepartmentID',
            'Type|性别|ArrayOne',
            'Phone|电话号码',
            'LoginName|登陆账号',
            'EditTime|时间|DateTime',
            'Remark|员工描述',
        ];


        KEYWORD_department = {};
        Formattrt_department = {};
        TypeSource_department = {
            DepartmentID: [{
                name: '无',
                value: 0,
                far: 0,
            }],
            RoleIDList: [{
                name: '无',
                value: 0,
                far: 0,
            }],
            Type: [{
                name: '男',
                value: 1,
            }, {
                name: '女',
                value: 2,
            }],
        };


        $com.util.configBuild(KEYWORD_department_LIST, KEYWORD_department, TypeSource_department, Formattrt_department);

    })();


    model = $com.Model.create({
        name: '员工管理',

        type: $com.Model.MAIN, //主方法

        configure: function () {


            this.run();
        },

        events: function () {
            //员工新增
            $('body').delegate('#alfie-add-level', 'click', function () {
                //将Json数据中的数据值改成对应默认值，然后传入进去
                DEFAULT_VALUE_D = {
                    LoginID: "",
                    Name: '',
                    DepartmentID: 0,
                    RoleIDList: 0,
                    Type: 0,
                    Phone: 0,
                    LoginName: '',
                    // Remark: "",
                };
                $('body').append($com.modal.show(DEFAULT_VALUE_D, KEYWORD_department, '新增员工', function (rst) {
                    //调用插入函数然后用load刷新数据源

                    if (!rst || $.isEmptyObject(rst))
                        return false;
                    var _data = {
                        ID: 0,
                        LoginID: rst.LoginID,
                        Name: rst.Name,
                        DepartmentID: Number(rst.DepartmentID),
                        RoleIDList: rst.RoleIDList,
                        Type: Number(rst.Type),
                        Phone: rst.Phone,
                        LoginName: rst.LoginName,
                        SonList: [],
                        Active: 0,
                        // Remark: rst.Remark,
                        ParentID: 0,
                    };
                    if (rst.Name == '') {
                        alert('请输入员工姓名');
                        return false;
                    }

                    $com.util.deleteLowerProperty(_data);
                    model.com.UpdateUser({
                        data: _data,
                    }, function (res) {
                        alert('新增成功！！');
                        model.com.refresh();
                    });
                }, TypeSource_department));
            });
            //员工修改
            $('body').delegate('.lmvt-resetPencil', 'click', function () {

                // var SelectData = $com.table.getSelectionData($(".l-containe-canvas-table .l-department-body"), "ID", AllDepartment);

                var $this = $(this),
                    wID = Number($this.closest('td').attr('data-value'));

                var SelectData = mData.filter((item) => {
                    return item.ID == wID;
                });

                if (!SelectData || !SelectData.length) {
                    alert('请先选择一行数据再试！');
                    return;
                }
                if (SelectData.length != 1) {
                    alert('只能同时对一行数据修改！');
                    return;
                }
                var default_value = {
                    Name: SelectData[0].Name,
                    LoginID: SelectData[0].LoginID,
                    DepartmentID: SelectData[0].DepartmentID,
                    RoleIDList: SelectData[0].RoleIDList,
                    Type: SelectData[0].Type,
                    Phone: SelectData[0].Phone,
                    LoginName: SelectData[0].LoginName,
                    // Remark: SelectData[0].Remark,
                };
                $('body').append($com.modal.show(default_value, KEYWORD_department, '修改', function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].Name = rst.Name;
                    SelectData[0].LoginID = rst.LoginID;
                    SelectData[0].DepartmentID = Number(rst.DepartmentID);
                    SelectData[0].RoleIDList = rst.RoleIDList;
                    SelectData[0].Type = Number(rst.Type);
                    SelectData[0].Phone = rst.Phone;
                    SelectData[0].LoginName = rst.LoginName;
                    // SelectData[0].Remark = rst.Remark;
                    if (rst.Name == '') {
                        alert('请输入员工姓名');
                        return false;
                    }
                    $com.util.deleteLowerProperty(SelectData[0]);
                    model.com.UpdateUser({
                        data: SelectData[0],
                    }, function (res) {
                        alert('修改成功！！');
                        model.com.refresh();
                    });

                }, TypeSource_department));
            });
            //员工删除
            $('body').delegate('.lmvt-delete', 'click', function () {
                // var SelectData = $com.table.getSelectionData($(".l-containe-canvas-table .l-department-body"), "ID", AllDepartment);
                var $this = $(this),
                    wID = Number($this.closest('td').attr('data-value'));

                var SelectData = mData.filter((item) => {
                    return item.ID == wID;
                });

                if (!SelectData || !SelectData.length) {
                    alert('至少选择一行数据再试！');
                    return;
                }
                if (SelectData[0].Active != 0) {
                    alert('已激活或者禁用数据无法删除！');
                    return;
                }
                if (!confirm('已选择' + SelectData.length + '条数据，确定将其删除？')) {
                    return;
                }
                model.com.DeleteUser({
                    data: SelectData,
                }, function (res) {
                    alert('删除成功！！');
                    model.com.refresh();
                });

            });
            //员工激活 禁用
            $('body').delegate('.ActiveSubmit', 'click', function () {
                var $this = $(this),
                    wActiveID = Number($this.attr('data-value'));
                wID = Number($this.attr('data-id'));

                var SelectData = mData.filter((item) => {
                    return item.ID == wID;
                });

                if (!SelectData || !SelectData.length) {
                    alert('请先选择一行数据再试！');
                    return;
                }
                if (wActiveID == 1) {
                    wActiveID = 2;
                } else {
                    wActiveID = 1;
                }

                model.com.ActiveUser({
                    Active: wActiveID,
                    data: SelectData,
                }, function (res) {
                    alert('操作成功！');
                    model.com.refresh();
                });
            });
            //重置
            $('body').delegate('#lmvt-reset', 'click', function () {
                $('.selectpicker').selectpicker('deselectAll');
                mActive = -1;
                mRoleID = -1;
                mDepartmentID = -1;
                $('#alfie-query-Name').val('');
                mName = '';
            });
            //查询
            $('body').delegate('#lmvt-search', 'click', function () {
                // 取值
                mRoleID = $('#alfie-query-Role').val();
                mDepartmentID = $('#alfie-query-depentment').val();
                mActive = $('#alfie-query-status').val();
                mName = $('#alfie-query-Name').val().trim();
                model.com.refresh();
            });
            //查看权限
            $('body').delegate('.lmvt-setPower', 'click', function () {
                $('.zzzc').hide();
                $('.zzzb').show();
                $('.zzza').width('80%');
                $(window).resize();

                var $this = $(this),
                    wID = Number($this.closest('td').attr('data-value'));

                var SelectData = mData.filter((item) => {
                    return item.ID == wID;
                });

                if (!SelectData || !SelectData.length) {
                    alert('请先选择一行数据再试！');
                    return;
                }
                model.com.getFunctionAll({
                    OperatorID: SelectData[0].ID,
                }, function (resUser) {
                    wUser = resUser.list;
                    $('.zzzb').show();
                    $('.zzza').width('80%');
                    $(window).resize();
                    $('#Sub-user').text('(' + SelectData[0].Name + ')' + '权限表');
                    model.com.renderTree(wUser);
                    $(window).resize();
                });
            });

            $('body').delegate('#zace-usehide', 'click', function () {
                $('.zzzb').hide();
                $('.zzza').width('100%');
                $(window).resize();
            });
            //下拉框
            $('body').delegate('.Department', 'click', function () {
                var wID = $('#alfie-query-depentment').val();
                model.com.getPosition({
                    DepartmentID: wID,
                }, function (resP) {
                    PositionList = $com.util.Clone(resP.list);
                    var selectOptions = [{ID: -1, Name: '全部'}].concat(PositionList);
                    $('#alfie-query-Role')
                        .html($com.util.template(selectOptions, HTML.selectOptionPosition))
                        .selectpicker('refresh');
                });
            });
        },

        run: function () {
            // 开关
            $('.selectpicker').selectpicker({
                noneSelectedText: '请选择', //默认显示内容
                deselectAllText: '全不选',
                selectAllText: '全选',
            });
            model.com.getRoleAll({}, function (res1) {
                wRoleAll = res1.list;
            });
            model.com.getRoleTree({}, function (res) {
                wRoleTree = res.list;
            });

            model.com.getDepartment({}, function (res) {
                res.list.forEach(function (item) {
                    TypeSource_department.DepartmentID.push({
                        name: item.Name,
                        value: item.ID,
                        far: 0,
                    });
                });
                DepartmentList = $com.util.Clone(res.list);
                var selectOptions = [{ID: -1, Name: '全部'}].concat(DepartmentList);
                $('#alfie-query-depentment')
                    .html($com.util.template(selectOptions, HTML.selectOption))
                    .selectpicker('refresh');
                model.com.refresh();
            });
            model.com.getPosition({}, function (resP) {
                resP.list.forEach(function (item) {
                    TypeSource_department.RoleIDList.push({
                        name: item.Name,
                        value: item.ID,
                        far: item.DepartmentID,
                    });
                });
            });
        },

        com: {
            renderTree: function (checkList) {
                wData = $com.util.Clone(wRoleTree);
                // 筛选出已有权限并做标记
                wData.forEach(function (dataItem, index) {
                    var intersection = checkList.filter(function (checkItem) {
                        return checkItem.FunctionID === dataItem.FunctionID;
                        1;
                    });
                    if (intersection.length) {
                        wData[index].isCheck = true;
                    }
                });

                $com.app.loading('数据加载中...');
                model._treeData = wData;

                var _data = FindData(0);
                SetData(_data);
                tempData(_data);

                // 生成节点
                $('#roleTree').html($com.util.template(_data, HTML.TreeItemNode));
                // 删除item为空的节点的展开/收起空间
                $('#roleTree').find('li ul').each(function (i, item) {
                    if ($(item).children('li')[0])
                        return true;
                    $(item).remove();
                });
                // 给已有权限打勾
                $('#roleTree').find('[isCheck=true]').each(function (i, item) {
                    $(item).prop('checked', true);
                });
                $('#roleTree').treeview();
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
                    $.each(wData, function (i, item) {
                        // UserID
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

            },
            //刷新界面
            refresh: function () {
                $com.app.loading('数据加载中...');
                model.com.getUser({
                    active: mActive,
                    RoleID: mRoleID,
                    DepartmentID: mDepartmentID,
                    Name: mName,
                }, function (res) {
                    if (res && res.list) {
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

                        $('#femi-Device-tbody-item').html($com.util.template(wItem, HTML.TableNode_item));

                        // 禁用系统管理员的状态切换  grad
                        $('[data-grad]').each(function (i, item) {
                            $(item).attr('data-grad') > 0 && $(item).attr('disabled', 'disabled');
                        });

                        $(window).resize();
                        model.com.deleteClass('.lmvt-delete', mData);
                        $com.app.loaded();
                    }
                });
            },
            //删除按钮样式的变化
            deleteClass: function (name, data) {
                data.forEach((element, index) => {
                    if (element.Active > 0) {
                        $($(name)[index]).css({'cursor': 'not-allowed', 'color': 'RGB(204, 204, 204)'});
                        if ($(name)[index]) {
                            $(name)[index].onclick = function (event) {
                                event.stopPropagation();
                            };
                        }

                    }
                });
            },
            //角色名称
            getRoleAll: function (data, fn, context) {
                var d = {
                    $URI: '/Role/All',
                    $TYPE: 'get',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //权限树
            getRoleTree: function (data, fn, context) {
                var d = {
                    $URI: '/Role/Tree',
                    $TYPE: 'get',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            arryOnea: function (data) {
                var temp = {};
                var arr = [];
                var len = data.length;
                for (var i = 0; i < len; i++) {
                    if (!temp[data[i].ID]) {
                        temp[data[i].ID] = 'abc';
                        arr.push(data[i]);
                    }
                }
                return arr;
            },
            //获取用户权限
            getFunctionAll: function (data, fn, context) {
                var d = {
                    $URI: '/Role/FunctionAll',
                    $TYPE: 'get',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取部门列表
            getDepartment: function (data, fn, context) {
                var d = {
                    $URI: '/Department/AllDepartment',
                    $TYPE: 'get',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取岗位
            getPosition: function (data, fn, context) {
                var d = {
                    $URI: '/Role/All',
                    $TYPE: 'get',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取人员列表
            getUser: function (data, fn, context) {
                var d = {
                    $URI: '/User/All',
                    $TYPE: 'get',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            // //人员修改 新增
            UpdateUser: function (data, fn, context) {
                var d = {
                    $URI: '/User/Update',
                    $TYPE: 'post',
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            ActiveUser: function (data, fn, context) {
                var d = {
                    $URI: '/User/Active',
                    $TYPE: 'post',
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            DeleteUser: function (data, fn, context) {
                var d = {
                    $URI: '/User/Delete',
                    $TYPE: 'post',
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