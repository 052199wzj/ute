require(
    [
        "../static/utils/js/jquery-3.1.1",
        "../static/utils/js/base/base",
        "../static/utils/js/base/jquery.treeview",
        "../static/utils/vue/mixins/tools",
        "../static/utils/vue/mixins/baseComponents",
    ],
    function ($alfie, $com, $tree, $mixinsTools, $baseComponents) {

        var formSelectOptions = {
            DepartmentID: [],
            RoleIDList: [],
            Type: [
                {Name: "男", ID: 1},
                {Name: "女", ID: 2},
            ],
        };

        var formOptions = [
            {label: "工号", value: "LoginID", rules: ["required"]},
            {label: "员工编号", value: "ID"},
            {label: "员工姓名", value: "Name", rules: ["required"]},
            {
                label: "所属部门", value: "DepartmentID", default: 0, rules: ["required"],
                type: "select", child: "RoleIDList",
                options: formSelectOptions.DepartmentID,
            },
            {
                label: "所属岗位", value: "RoleIDList",
                type: "select", far: "DepartmentID",
                clearable: true, multiple: true, options: formSelectOptions.RoleIDList,
            },
            {
                label: "性别", value: "Type", type: "select",
                clearable: true, options: formSelectOptions.Type,
            },
            {label: "电话号码", value: "Phone", rules: ["phone"]},
            {label: "员工描述", value: "Remark", type: "textarea"},
            {label: "头像", value: "FaceIcon", type: "file-img", limit: 1},
        ];


        var HTML = {
            TreeItemNode: [
                "<li class=\"range-role-li  {{Type}}\" >",
                "<span style=\"vertical-align:top;font-size: 19px\"><input type=\"checkbox\" style=\"cursor: not-allowed;margin-left: 5px;\" onclick=\"javascript: return false;\" class=\"femi-tree-checkbox\" style=\"margin: 1px 0 1px 10px\"  isCheck=\"{{ isCheck }}\"  value=\"{{FunctionID}}\"  />{{Text}}</span> ",
                "<ul>{{Items}}</ul>",
                "</li> ",
            ].join(""),
        };


        /**
         *  请求列表
         *  $URI: string    请求地址 - 必填
         *  type: string   请求类型 - 必填
         *  errMsg:string   错误提示 - 可填 默认值为 httpErrMsg[$TYPE]
         */
        var uriList = {
            // 人员
            getData: {type: "get", url: "/User/All"},
            update: {type: "post", url: "/User/Update"},
            delete: {type: "post", url: "/User/Delete"},
            changeActive: {type: "post", url: "/User/Active"},
            retrievePassword: {type: "post", url: "/User/RetrievePassword"},
            // 人员 end---
            getRole: {type: "get", url: "/Role/All"}, // 获取岗位列表
            getFunction: {type: "get", url: "/Role/FunctionAll"}, // 权限列表
            roleTree: {type: "get", url: "/Role/Tree"}, //   权限树

            getDepartment: {type: "get", url: "/Department/AllDepartment"}, // 部门列表

            roleSelect: {type: "get", url: "/Role/Select"}, //  权限树
        };
        /**
         * 请求默认提示语
         * key: 请求类型
         * val: 提示文本
         */
        var httpErrMsg = {
            Get: "获取失败，请检查网络",
            get: "获取失败，请检查网络",
            Post: "提交失败，请检查网络",
            post: "提交失败，请检查网络",
        };

        /***
         * 公用请求方法
         * @param uriName   请求名称
         * @param data      数据
         * @param fn        回调函数
         * @param context   上下文
         */
        function http(uriName, data, fn, context) {
            var u = uriList[uriName];
            var d = {$URI: u.url, $TYPE: u.type};

            function err() {
                $com.app.tip(u.errMsg || httpErrMsg[u.type]);
            }

            $com.app.ajax($.extend(d, data), fn, err, context);
        }

        // 表头
        var tableHead = [
            {label: "序号", type: "sequence"},
            {label: "工号", key: "LoginID"},
            {label: "姓名", key: "Name"},
            {label: "所属部门", key: "Department"},
            {label: "所属岗位", key: "RoleName"},
            {label: "性别", key: "Type", type: "sex"},
            {label: "手机", key: "Phone"},
            {label: "状态", key: "Active", type: "switch", show: "jurisdiction"},
            {label: "操作", type: "operation", show: "jurisdiction"},
        ];
        // 搜索条件模板
        var searchTemplate = {Active: "-1", Name: "", DepartmentID: "", RoleID: ""};

        var model = $com.Model.create({
            el: "#userManagement-body",
            name: "员工管理",
            VueName: "vm",
            mixins: [$mixinsTools, $baseComponents],
            data: {
                // 表头
                tableHead: tableHead,
                // 搜索框数据
                searchData: $com.util.Clone(searchTemplate),
                // 数据列表
                tableData: [],
                // 下拉框数据
                selectOptions: {
                    department: [],
                    role: [],
                },
                // 权限树数据
                tree: {
                    show: false,
                    title: "权限表",
                    dataAll: [], // 全部权限
                },
                //用户权限
                jurisdiction: false,
            },
            computed: {
                leftWidht: function () {
                    return this.tree.show ? "80%" : "100%";
                },
                departmentToRole: function () {
                    this.searchData.RoleID = "";

                    var role = this.selectOptions.role;
                    var DepartmentID = this.searchData.DepartmentID;
                    if (DepartmentID) {
                        return role.filter(function (item) {
                            return item.DepartmentID === DepartmentID;
                        });
                    }
                    return role;
                },
            },
            filters: {
                // 激活状态
                switchStatus: function (e) {
                    // 0-从未激活 1-激活 2-关闭
                    return e === 1;
                },
                sex: function (e) {
                    return e === 1 ? "男" : "女";
                },
            },
            watch: {},
            created: function () {
                this.search();
                this.getSelectOptions();
                this.jurisdiction = $com.app.checkRole(101000);
            },
            mounted: function () {
            },
            methods: {
                // 查询
                search: function ($event) {
                    var that = this;

                    var params = $event ? that.searchData : searchTemplate;

                    $com.app.loading("数据加载中...");
                    http("getData", params, function (res) {
                        $com.app.loaded();
                        that.tableData = res.list;
                    });
                },
                // 清空
                emptyClick: function () {
                    this.searchData.Name = "";
                    this.searchData.Active = "-1";
                    this.searchData.DepartmentID = "";
                    this.searchData.RoleID = "";
                },
                // 添加
                addClick: function () {

                    var that = this;
                    var myPopupForm = that.$refs["myPopupForm"];
                    var newOptions = {
                        LoginID: "",
                        Name: "",
                        DepartmentID: "",
                        RoleIDList: [],
                        Type: "",
                        Phone: "",
                        FaceIcon: [],
                    };
                    myPopupForm.open({
                        title: "新增员工",
                        option: myPopupForm.newOptions(newOptions, formOptions),
                        confirm: function (rst) {
                            if (!rst || $.isEmptyObject(rst)) {
                                return false;
                            }
                            var _data = {
                                ID: 0,
                                LoginID: rst.LoginID,
                                Name: rst.Name,
                                DepartmentID: Number(rst.DepartmentID),
                                RoleIDList: rst.RoleIDList,
                                Type: Number(rst.Type),
                                Phone: rst.Phone,
                                SonList: [],
                                Active: 0,
                                ParentID: 0,
                                FaceIcon: rst.FaceIcon[0]
                            };
                            for (var i = 0; i < that.tableData.length; i++) {
                                if (rst.Name === that.tableData[i].Name) {
                                    alert("新增员工已存在！");
                                    return false;
                                }
                            }
                            $com.util.deleteLowerProperty(_data);

                            http("update", {data: _data}, function (res) {
                                alert("新增成功！！");
                                that.search();
                            });

                        },
                    });

                },
                // 编辑
                editClick: function (row) {
                    var that = this;
                    var newRow = $com.util.Clone(row);
                    var myPopupForm = that.$refs["myPopupForm"];

                    var roleIDListOptions = this.ToolNewSelectOptions(
                        row.RoleIDList,
                        row.RoleName,
                        formSelectOptions.RoleIDList,
                        "DepartmentID",
                        row.DepartmentID,
                    );
                    var DepartmentID = this.ToolNewSelectOptions(
                        [row.DepartmentID],
                        [row.Department],
                        formSelectOptions.DepartmentID,
                    );
                    var newOptions = {
                        Name: newRow.Name,
                        LoginID: newRow.LoginID,
                        DepartmentID: {
                            default: newRow.DepartmentID,
                            options: DepartmentID,
                        },
                        RoleIDList: {
                            default: newRow.RoleIDList,
                            options: roleIDListOptions,
                        },
                        Type: newRow.Type,
                        Phone: newRow.Phone,
                        FaceIcon: newRow.FaceIcon && [{url: newRow.FaceIcon}]
                    };
                    myPopupForm.open({
                        title: "修改员工信息",
                        option: myPopupForm.newOptions(newOptions, formOptions),
                        confirm: function (rst) {
                            //调用修改函数
                            if (!rst || $.isEmptyObject(rst)) return false;
                            newRow.Name = rst.Name;
                            newRow.LoginID = rst.LoginID;
                            newRow.DepartmentID = Number(rst.DepartmentID);
                            newRow.RoleIDList = rst.RoleIDList;
                            newRow.Type = Number(rst.Type);
                            newRow.Phone = rst.Phone;
                            newRow.FaceIcon = rst.FaceIcon[0];

                            // console.log($com.util.Clone(row));
                            // console.log(newRow);

                            http("update", {data: newRow}, function (res) {
                                alert("修改成功！！");
                                that.search();
                            });
                        },
                    });
                    /*
                    var newRow = $com.util.Clone(row);
                    var that = this;
                    var default_value = {
                        Name: newRow.Name,
                        LoginID: newRow.LoginID,
                        DepartmentID: newRow.DepartmentID,
                        RoleIDList: newRow.RoleIDList,
                        Type: newRow.Type,
                        Phone: newRow.Phone,
                        // LoginName: row.LoginName,
                    };
                    $('body').append($com.modal.show(default_value, KEYWORD_department, '修改员工信息', function(rst){
                        //调用修改函数
                        if( !rst || $.isEmptyObject(rst) ){
                            return;
                        }

                        newRow.Name = rst.Name;
                        newRow.LoginID = rst.LoginID;
                        newRow.DepartmentID = Number(rst.DepartmentID);
                        newRow.RoleIDList = rst.RoleIDList;
                        newRow.Type = Number(rst.Type);
                        newRow.Phone = rst.Phone;
                        // row.LoginName = rst.LoginName;

                        $com.util.deleteLowerProperty(newRow);
                        http('update', { data: newRow }, function(res){
                            alert('修改成功！！');
                            that.search();
                        });
                    }, TypeSource_department));
                    */
                },
                // 重置密码
                retrieveClick: function (row) {
                    console.log(row);
                    // retrievePassword
                    if (!confirm("是否重置" + row.Name + "的密码为123456?")) {
                        return false;
                    }
                    http("retrievePassword", {data: [row]}, function (res) {
                        console.log(res);
                        alert("已重置密码！！");
                    });
                },
                // 删除
                removeClick: function (row) {
                    var that = this;
                    if (row.Active !== 0) {
                        return false;
                    }
                    if (!confirm("已选择1条数据，确定将其删除？")) {
                        return false;
                    }
                    http("delete", {data: [row]}, function (res) {
                        alert("删除成功！！");
                        that.search();
                        if (row.ID === that.tree.row.ID) {
                            vm.hideRight();
                        }

                    });
                },
                // 切换激活状态
                activeChange: function (row) {
                    console.log(row);
                    var that = this;
                    var newActive = row.Active === 1 ? 2 : 1;
                    var data = {
                        Active: newActive,
                        data: [row],
                    };
                    http("changeActive", data, function () {
                        row.Active = newActive;
                        that.search();
                        alert("操作成功！");
                    });
                },
                // 查看权限
                showLimits(row) {
                    var that = this;
                    that.tree.show = true;
                    that.tree.row = row;
                    that.tree.title = `权限表(${row.Name})`;

                    http("getFunction", {OperatorID: row.ID}, function (res) {
                        renderTree(res.list);
                    });

                    function renderTree(checkList) {
                        var wData = $com.util.Clone(model.data.tree.dataAll);
                        // 筛选出已有权限并做标记
                        wData.forEach(function (dataItem, index) {
                            var intersection = checkList.filter(function (checkItem) {
                                return checkItem.FunctionID === dataItem.FunctionID;
                            });
                            if (intersection.length) {
                                wData[index].isCheck = true;
                            }
                        });

                        $com.app.loading("数据加载中...");
                        model._treeData = wData;

                        var _data = FindData(0);
                        SetData(_data);
                        tempData(_data);

                        // 生成节点
                        $("#roleTree").html($com.util.template(_data, HTML.TreeItemNode));
                        // 删除item为空的节点的展开/收起空间
                        $("#roleTree").find("li ul").each(function (i, item) {
                            if ($(item).children("li")[0]) {
                                return true;
                            }
                            $(item).remove();
                        });
                        // 给已有权限打勾
                        $("#roleTree").find("[isCheck=true]").each(function (i, item) {
                            $(item).prop("checked", true);
                        });
                        $("#roleTree").treeview();

                        $com.app.loaded();

                        $("#roleTree li span input[type=checkbox].femi-tree-checkbox").prop("checked", false);
                        $("#roleTree li span input[type=checkbox].femi-tree-checkbox").prop("indeterminate", false);
                        $("#roleTree li span input[type=checkbox].femi-tree-checkbox").each(function (i, item) {
                            var functionID = $(item).val();
                            if (!functionID || isNaN(functionID)) {
                                return true;
                            }
                            functionID = Number(functionID);

                            var _index = $com.util.findIndex(checkList, function (p) {
                                return p.FunctionID == functionID;
                            });
                            if (_index < 0) {
                                $(item).prop("checked", false);
                                return true;
                            }
                            $(item).prop("checked", true);
                            $(item).change();

                        });


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
                                _item_t.Type = "";
                                if (_item_t.items && _item_t.items.length) {
                                    tempData(_item_t.items);
                                    _item_t.Items = $com.util.template(_item_t.items, HTML.TreeItemNode);
                                }
                            });
                        }

                    }
                },
                // 隐藏右侧列表
                hideRight() {
                    this.tree.show = false;
                },
                // 获取下拉框数据
                getSelectOptions: function () {
                    var that = this;
                    http("getRole", {Active: 1}, function (res) {
                        that.selectOptions.role = res.list;

                        that.ToolArrReplace(formSelectOptions.RoleIDList, res.list);
                        /*
                        TypeSource_department.RoleIDList = [];
                        res.list.forEach(function(item){
                            TypeSource_department.RoleIDList.push({
                                name: item.Name,
                                value: item.ID,
                                far: item.DepartmentID,
                            });
                        });
                        */

                    });
                    http("getDepartment", {Active: 1}, function (res) {
                        that.selectOptions.department = res.list;

                        that.ToolArrReplace(formSelectOptions.DepartmentID, res.list);
                        /*       formSelectOptions.DepartmentID.unshift({ Name: '无', ID: 0 });*/
                        /*     TypeSource_department.DepartmentID = [
                                 { name: '无', value: 0, far: 0 },
                             ];
                             res.list.forEach(function(item){
                                 TypeSource_department.DepartmentID.push({
                                     name: item.Name,
                                     value: item.ID,
                                     far: 0,
                                 });
                             });*/
                    });
                    // 权限树
                    http("roleTree", {}, function (res) {
                        that.tree.dataAll = res.list;
                    });
                },
            },
            events: function () {
                $("body").delegate("#roleTree .femi-tree-checkbox,#rangeTree .femi-tree-checkbox", "change", function () {

                    var $this = $(this);


                    var $own_check = $this.parent("span").next("ul").find(".femi-tree-checkbox");

                    $own_check.prop("indeterminate", false);

                    var $Siblings = $this.parent("span").parent("li").parent("ul").children("li").children("span")
                        .children(".femi-tree-checkbox");

                    var $parent_check = $this.parent("span").parent("li").parent("ul").prev("span")
                        .children(".femi-tree-checkbox");

                    if ($this[0].checked) {
                        $own_check.prop("checked", true);
                        var Is_all = true;
                        $Siblings.each(function (i, item) {
                            if (!item.checked) {
                                Is_all = false;
                            }
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
                            if (item.checked || $(item).prop("indeterminate")) {
                                Is_all = false;
                            }
                        });
                        $parent_check.prop("checked", false);
                        if (Is_all) {
                            $parent_check.prop("indeterminate", false);
                        } else {
                            $parent_check.prop("indeterminate", true);
                        }
                    }

                    if ($parent_check[0]) {
                        CheckTree($parent_check);
                    }
                });

                function CheckTree($this) {
                    var $Siblings = $this.parent("span").parent("li").parent("ul").children("li").children("span")
                        .children(".femi-tree-checkbox");

                    var $parent_check = $this.parent("span").parent("li").parent("ul").prev("span")
                        .children(".femi-tree-checkbox");

                    if ($this[0].checked) {

                        var Is_all = true;
                        $Siblings.each(function (i, item) {
                            if (!item.checked) {
                                Is_all = false;
                            }
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
                            if (item.checked || $(item).prop("indeterminate")) {
                                Is_all = false;
                            }
                        });
                        $parent_check.prop("checked", false);
                        if (Is_all) {
                            $parent_check.prop("indeterminate", false);
                        } else {
                            $parent_check.prop("indeterminate", true);
                        }
                    }

                    if ($parent_check[0]) {
                        CheckTree($parent_check);
                    }
                }
            },
        });
        model.init();
    });
