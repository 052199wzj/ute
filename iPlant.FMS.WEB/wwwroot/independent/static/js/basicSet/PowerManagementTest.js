require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/jquery.treeview'], function ($alfie, $com, $tree) {
    var Formattrt_department; //字段格式化对象
    var KEYWORD_department; //查询关键字
    var KEYWORD_department_LIST; //定义字段格式(用于表格字段转换)
    var TypeSource_department; //枚举对象(用于字段转换)
    var mCloneData; //克隆的数据源(用于模糊查询)
    var HTML; //HTML模板
    var mActive = -1;
    var mID = -1;
    var mCode = '';
    var mData;
    var mClickID = 0;
    var NewDate = [];
    var TestArray;
    var mLastSpan; //上一个被点击的span
    var mExistSubordinate = [];
    var mExist = [];
    var topLevelTree = [];


    HTML = {
        TableNode_item: [
            '<tr data-color="">',
            // '<td style="width: 3px"><input type="checkbox"',
            // 'class="femi-tb-checkbox" style="margin: 1px 0px 1px;" /></td> ',
            '<td style="min-width: 50px;" data-title="FunctionID" data-value="{{FunctionID}}">{{WID}}</td>',
            '<td style="min-width: 50px" data-title="Text" data-value="{{Text}}">{{Text}}</td>',
            '<td style="min-width: 50px" data-title="FunctionID" data-value="{{FunctionID}}">{{FunctionID}}</td>',
            '<td style="min-width: 50px" data-title="RoleID" data-value="{{RoleID}}">{{RoleID}}</td>',
            '<td style="min-width: 50px" data-title="Path" data-value="{{Path}}">{{Path}}</td>',
            '<td style="min-width: 50px" data-title="UserID" data-value="{{UserID}}">{{UserID}}</td>',
            '<td data-title="TypeID" data-value="{{TypeID}}"data-id="{{FunctionID}}"  class="ActiveSubmit" > <input type="checkbox"  class="{{Switch}}" /></td>',
            '<td style="max-width: 80px" data-title="Handle" data-value="{{FunctionID}}"><div class="row">',
            '<div class="col-md-6 lmvt-do-info lmvt-resetPencil"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>编辑</div>',
            '<div class="col-md-6 lmvt-do-info lmvt-delete"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span>删除</div>',
            '</div></td>',
            '</tr>',
        ].join(''),
        TreeItemNode: [
            '<li class="range-role-li {{Type}}" >',
            '<span style="vertical-align:top;margin-left: 10px" class="jurisdiction-name" data-value="{{FunctionID}} ">{{Text}}</span> ',
            '<ul>{{Items}}</ul>',
            '</li> ',

        ].join(''),
    };

    (function () {
        KEYWORD_department_LIST = [
            'Text|权限名称*',
            'RoleID|父级权限ID|ArrayOne',
            'FunctionID|权限ID*',
            'Path|路径',
            'UserID|顺序',
        ];


        KEYWORD_department = {};
        Formattrt_department = {};
        TypeSource_department = {

            ParentID: [{
                name: '无',
                value: 0,
            }],
            RoleID: [{
                name: '请选择',
                value: -1,
            }],
        };

        $.each(KEYWORD_department_LIST, function (i, item) {
            var detail = item.split('|');
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
        name: '权限管理',

        type: $com.Model.MAIN, //主方法

        configure: function () {
            this.run();
        },

        events: function () {

            //权限新增
            $('body').delegate('#alfie-add-level', 'click', function () {
                //将Json数据中的数据值改成对应默认值，然后传入进去
                DEFAULT_VALUE_D = {
                    Text: '',
                    FunctionID: 0,
                    Path: '',
                    UserID: 0,

                };
                $('body').append($com.modal.show(DEFAULT_VALUE_D, KEYWORD_department, '新增权限', function (rst) {
                    //调用插入函数然后用load刷新数据源

                    if (!rst || $.isEmptyObject(rst))
                        return false;
                    var _data = {
                        ID: 0,
                        Text: rst.Text,
                        RoleID: mClickID, //父级权限
                        TypeID: 0,
                        FunctionID: rst.FunctionID,
                        Path: '',
                    };
                    for (var i = 0; i < mData.length; i++) {
                        if (rst.Text == mData[i].Text) {
                            alert('新增权限已存在！');
                            return false;
                        }
                    }
                    if (rst.RoleID == rst.FunctionID) {
                        alert('您不能是自己的上级');
                        return false;
                    }
                    if (_data.Text == '') {
                        alert('请输入完整信息');
                        return false;
                    }
                    $com.util.deleteLowerProperty(_data);
                    model.com.postTreeUpdate({
                        data: _data,
                    }, function (res) {
                        alert('新增成功！！');
                        model.com.refresh();
                    });
                }, TypeSource_department));
            });
            //权限修改
            $('body').delegate('.lmvt-resetPencil', 'click', function () {

                // var SelectData = $com.table.getSelectionData($(".l-containe-canvas-table .l-department-body"), "ID", AllDepartment);

                var $this = $(this),
                    wID = Number($this.closest('td').attr('data-value'));

                var SelectData = mData.filter((item) => {
                    return item.FunctionID == wID;
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
                    Text: SelectData[0].Text,
                    FunctionID: SelectData[0].FunctionID,
                    Path: SelectData[0].Path,
                    UserID: SelectData[0].UserID,
                };
                $('body').append($com.modal.show(default_value, KEYWORD_department, '修改', function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    if (rst.RoleID == rst.FunctionID) {
                        alert('您不能是自己的上级');
                        return false;
                    }
                    SelectData[0].Text = rst.Text;
                    SelectData[0].FunctionID = Number(rst.FunctionID);
                    SelectData[0].Path = rst.Path;
                    SelectData[0].UserID = rst.UserID;
                    $com.util.deleteLowerProperty(SelectData[0]);
                    if (SelectData[0].Text == '') {
                        alert('请输入完整信息');
                        return false;
                    }
                    model.com.postTreeUpdate({
                        data: SelectData[0],
                    }, function (res) {
                        alert('修改成功！！');
                        model.com.refresh();
                    });

                }, TypeSource_department));
            });
            //权限删除
            $('body').delegate('.lmvt-delete', 'click', function () {
                // var SelectData = $com.table.getSelectionData($(".l-containe-canvas-table .l-department-body"), "ID", AllDepartment);

                var $this = $(this),
                    wID = Number($this.closest('td').attr('data-value'));
                var SelectData = mData.filter((item) => {
                    return item.FunctionID == wID;
                });
                var a = true;

                if (!SelectData || !SelectData.length) {
                    alert('至少选择一行数据再试！');
                    return;
                }
                if (SelectData[0].TypeID != 0) {
                    alert('已激活或者禁用数据无法删除！');
                    return;
                }

                if (!confirm('已选择' + SelectData.length + '条数据，确定将其删除？')) {
                    return;
                }
                $.each(mExist, function (i, item) {
                    if (item == wID) {
                        alert('您不能删除有下级的上级');
                        return a = false;
                    }
                });
                if (!a) {
                    return;
                }
                var ArrayFun = [];
                ArrayFun.push(SelectData[0].FunctionID);
                model.com.DeleteTreeDelete({
                    data: ArrayFun,
                }, function (res) {
                    alert('删除成功！！');
                    model.com.refresh();
                });
            });
            //权限激活 禁用
            $('body').delegate('.ActiveSubmit', 'click', function () {
                var $this = $(this),
                    wActiveID = Number($this.attr('data-value'));
                wID = Number($this.attr('data-id'));

                var SelectData = mData.filter((item) => {
                    return item.FunctionID == wID;
                });

                if (!SelectData || !SelectData.length) {
                    alert('请先选择一行数据再试！');
                    return;
                }
                if (wActiveID == 1) {
                    wActiveID = 2;
                    SelectData[0].TypeID = 2;
                } else {
                    wActiveID = 1;
                    SelectData[0].TypeID = 1;
                }

                var ArrayFun = [];
                ArrayFun.push(SelectData[0].FunctionID);

                model.com.ActiveTreeActive({
                    Active: wActiveID,
                    data: ArrayFun,
                }, function (res) {
                    alert('操作成功！');
                    model.com.refresh();
                });
            });
            //重置
            $('body').delegate('#lmvt-reset', 'click', function () {
                $('.selectpicker').selectpicker('deselectAll');
                mActive = -1;
                $('#alfie-query-Code').val('');
                mCode = '';
                mID = -1;
            });
            //查询
            $('body').delegate('#lmvt-search', 'click', function () {
                mActive = $('#alfie-query-status').val();
                mCode = $('#alfie-query-Code').val();
                model.com.refresh();
            });
            //状态树的点击事件
            $('body').delegate('.jurisdiction-name', 'click', function () {
                // var SelectData = $com.table.getSelectionData($(".l-containe-canvas-table .l-department-body"), "ID", AllDepartment);
                if (mLastSpan) {
                    $(mLastSpan).toggleClass('lastspanclass');
                }
                var $this = $(this);
                mClickID = Number($this.closest('span').attr('data-value'));
                $this.closest('span').toggleClass('lastspanclass');
                mLastSpan = $this;
                var wData = [];

                $.each(mData, function (i, item) {
                    if (item.RoleID == mClickID) {
                        wData.push(item);
                    }
                });
                model.com.clickTree(wData);
                wData = [];
            });
            // 权限树All
            $('body').delegate('#roleTreeBtn', 'click', function () {
                model.com.clickTree(topLevelTree);
                $(mLastSpan).removeClass('lastspanclass');
                mLastSpan = null;
            });
        },

        run: function () {
            // 开关
            $('.selectpicker').selectpicker({
                noneSelectedText: '请选择', //默认显示内容
                deselectAllText: '全不选',
                selectAllText: '全选',
            });
            model.com.getTreeAll({}, function (res) {
                $.each(res.list, function (i, item) {
                    TypeSource_department.RoleID.push({
                        name: item.Text,
                        value: item.FunctionID,
                        far: null,
                    });
                });
            });
            model.com.refresh();
        },

        com: {
            //权限树的显示
            renderTree: function (list) {
                $com.app.loading('数据加载中...');
                model._treeData = list;
                var _data = FindData(0);
                SetData(_data);
                tempData(_data);
                $('#roleTree').html($com.util.template(_data, HTML.TreeItemNode));
                $('#roleTree').find('li ul').each(function (i, item) {
                    if ($(item).children('li')[0])
                        return true;
                    $(item).remove();
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
                            mExistSubordinate.push(_item_t.FunctionID);
                            _item_t.Items = $com.util.template(_item_t.items, HTML.TreeItemNode);
                        }
                    });

                }

                mExist = mExistSubordinate;
                mExistSubordinate = [];
            },
            //遍历权限树数据
            eachTree: function () {
                model.com.getTreeAll({}, function (res) {
                    model.com.renderTree(res.list);
                    topLevelTree = $com.util.Clone(res.list).filter(function (item) {
                        return item.RoleID === 0;
                    });
                });
            },
            //删除按钮样式的变化
            deleteClass: function (name, data) {
                data.forEach((element, index) => {
                    if (element.TypeID > 0) {
                        $($(name)[index]).css({'cursor': 'not-allowed', 'color': 'RGB(204, 204, 204)'});
                        $(name)[index].onclick = function (event) {
                            event.stopPropagation();
                        };
                    } else {
                        mExist.forEach(function (item) {
                            if (element.FunctionID == item) {
                                $($(name)[index]).css({'cursor': 'not-allowed', 'color': 'RGB(204, 204, 204)'});
                                $(name)[index].onclick = function (event) {
                                    event.stopPropagation();
                                };
                            }
                        });
                    }
                });

            },
            //获取权限树
            getTreeAll: function (data, fn, context) {
                var d = {
                    $URI: '/Role/TreeAll',
                    $TYPE: 'Get',

                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //刷新界面
            refresh: function () {
                $com.app.loading('数据加载中...');
                model.com.getTreeAll({
                    Active: mActive,
                }, function (res) {
                    if (res && res.list) {
                        mData = $com.util.Clone(res.list);
                        var wData = [];
                        //数据源字段模板转换
                        $.each(mData, function (i, item) {
                            if (item.RoleID == mClickID) {
                                wData.push(item);
                            }
                        });
                        model.com.clickTree(wData);

                        $com.app.loaded();
                    }
                });
                model.com.eachTree();

            },
            //点击后获取权限树
            clickTree: function (res) {
                if (res) {
                    //数据源字段模板转换
                    var wItem = $com.util.Clone(res);

                    var wItemClone = [];
                    if (mCode.length > 0) {
                        for (var i = 0; i < wItem.length; i++) {
                            if (wItem[i].Text == mCode) {
                                wItemClone.push(wItem[i]);
                            }
                        }
                    } else {
                        wItemClone = wItem;
                    }

                    $.each(wItemClone, function (i, item) {
                        if (item.TypeID == 1) {
                            item.Switch = 'switchTrue';
                        } else {
                            item.Switch = 'switchFalse';
                        }
                        item.WID = i + 1;
                    });
                    $('#femi-Device-tbody-item').html($com.util.template(wItemClone, HTML.TableNode_item));
                    model.com.deleteClass('.lmvt-delete', wItemClone);
                    $com.app.loaded();
                }
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
            //新增修改班组
            postTreeUpdate: function (data, fn, context) {
                var d = {
                    $URI: '/Role/TreeUpdate',
                    $TYPE: 'post',
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //删除权限
            DeleteTreeDelete: function (data, fn, context) {
                var d = {
                    $URI: '/Role/TreeDelete',
                    $TYPE: 'post',
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            ActiveTreeActive: function (data, fn, context) {
                var d = {
                    $URI: '/Role/TreeActive',
                    $TYPE: 'post',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

        },
    }),
        model.init();
});