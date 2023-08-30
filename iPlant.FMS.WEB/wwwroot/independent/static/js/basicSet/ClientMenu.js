require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/jquery.treeview'],
    function ($JQ, $com, Tree) {

        var model,

            GroupList,

            ModuleList,

            RenderItemTable,


            //选择的数据
            SelectRanderData,
            SelectRanderModule,

            TypeSourceGroupName,
            DEFAULT_VALUE_Module,
            KEYWORD_LIST_Module,
            KEYWORD_Module,
            FORMATTRT_Module,

            HTML;
        mGrad = 0;


        var mTypeZace = 1;
        var mID = 0;//权限名ID
        mListAllItem = [];//子项消息
        mListAll = [];//所有数据
        HTML = {
            TreeItemNode: ['<li style="font-size:15px" class="range-role-li" data-value = "{{Active}}" data-type = 1 data-key = "{{ID}}">',
                '<span id="ItemNode" style="vertical-align:top;"><input type="checkbox" class="femi-tree-checkbox" style="margin: 1px 0px 1px"  value="{{FunctionID}}"  /><img src="{{Icon}}" style="width:20px;height:20px" >{{Name}}</span> ',
                '<ul>{{Items}}</ul>',
                '</li> '].join(""),
            TreeItemSonNode: ['<li style="font-size:12px" class="range-role-li" data-value = "{{Active}}" data-type = 2 data-key = "{{ID}}">',
                '<span style="vertical-align:top;"><input type="checkbox" class="femi-tree-checkbox" style="margin: 1px 0px 1px"  value="{{FunctionID}}"  /><img src="{{Icon}}" style="width:20px;height:20px" >{{Name}}</span> ',
                '</li>'].join(""),
            WebMenu: [
                '<tr>',
                '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
                '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
                '<td data-title="Icon" data-value="{{Icon}}" ><img src="{{Icon}}" style="width:20px;height:20px" >{{Icon}}</td>',
                '<td data-title="OrderNum" data-value="{{OrderNum}}" >{{OrderNum}}</td>',
                '<td data-title="Grad" data-value="{{Grad}}" >{{Grad}}</td>',
                '<td data-title="RoleID" data-value="{{RoleID}}" >{{RoleID}}</td>',
                '<td data-title="Active" data-value="{{Active}}" >{{Active}}</td>',
                '</tr>',
            ].join(""),
            ModuleMenu: [
                '<tr>',
                '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
                '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
                '<td data-title="Url" data-value="{{Url}}" >{{Url}}</td>',
                '<td data-title="Icon" data-value="{{Icon}}" ><img src="{{Icon}}" style="width:20px;height:20px" >{{Icon}}</td>',
                '<td data-title="GroupID" data-value="{{GroupID}}">{{GroupID}}</td>',
                '<td data-title="OrderNum" data-value="{{OrderNum}}" >{{OrderNum}}</td>',
                '<td data-title="Grad" data-value="{{Grad}}" >{{Grad}}</td>',
                '<td data-title="RoleID" data-value="{{RoleID}}" >{{RoleID}}</td>',
                '<td data-title="Active" data-value="{{Active}}">{{Active}}</td>',
                '</tr>',
            ].join(""),
            RoleTreeItemNode: [
                '<li data-titie="{{FunctionID}}"  data-value="{{FunctionID}}" >',
                '<span style="vertical-align:top;Color:{{TextColor}}" data-value="{{FunctionID}}">{{Text}}</span> ',
                '<ul>{{Items}}</ul>',
                '</li> ',

            ].join(""),
        };
        (function () {
            KEYWORD_LIST = [
                "GroupName|组名称",
                "PhotoUrl|照片路径",
                "OrderNum|显示顺序",
                "Grad|用户类型|ArrayOne",
                "RoleID|权限名|ArrayOne",
                "Active|状态|ArrayOne",
            ],
                KEYWORD_LISTItem = {},
                FORMATTRT_LevelItem = {},
                TypeSource = {
                    RoleID: [],
                    Active: [
                        {
                            name: "禁用",
                            value: 0,
                        },
                        {
                            name: "激活",
                            value: 1,
                        },
                        {
                            name: "禁用",
                            value: 2,
                        },
                    ],
                    Grad: [
                        {
                            name: "用户",
                            value: 0,
                        },
                        {
                            name: "管理员",
                            value: 1,
                        },
                        {
                            name: "工程师",
                            value: 999,
                        },
                        {
                            name: "系统",
                            value: 1000,
                        },

                    ],

                };
            $.each(KEYWORD_LIST, function (i, item) {
                var detail = item.split("|");
                KEYWORD_LISTItem[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined,
                };
                if (detail.length > 2) {
                    FORMATTRT_LevelItem[detail[0]] = $com.util.getFormatter(TypeSource, detail[0], detail[2]);
                }
            });
        })();
        (function () {
            DEFAULT_VALUE_Module = {
                ModuleName: "",
                Url: "",
                GroupName: 0,
                OrderNum: 0,
                Grad: 0,
                //PhotoUrl : "",
                SecretKey: "示例：abcdefgh",
            },
                KEYWORD_LIST_Module = [
                    "ModuleName|菜单名称",
                    "Url|菜单路径",
                    "GroupName|所属组|ArrayOne",
                    "PhotoUrl|图片路径",
                    "Active|状态|ArrayOne",
                    "GroupID|所属组|ArrayOne",
                    "OrderNum|显示顺序",
                    "Grad|用户类型|ArrayOne",
                    "RoleID|权限名|ArrayOne",
                    "SecretKey|模块密匙",
                ],
                KEYWORD_Module = {},
                FORMATTRT_Module = {};
            TypeSourceGroupName = {
                GroupName: [],
                RoleID: [],
                Active: [
                    {
                        name: "禁用",
                        value: 0,
                    },
                    {
                        name: "激活",
                        value: 1,
                    },
                    {
                        name: "禁用",
                        value: 2,
                    },
                ],
                Grad: [
                    {
                        name: "用户",
                        value: 0,
                    },
                    {
                        name: "管理员",
                        value: 1,
                    },
                    {
                        name: "工程师",
                        value: 999,
                    },
                    {
                        name: "系统",
                        value: 1000,
                    },
                ],
                GroupID: [],
            };
            $.each(KEYWORD_LIST_Module, function (i, item) {
                var detail = item.split("|");
                KEYWORD_Module[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined,
                };
                if (detail.length > 2) {
                    FORMATTRT_Module[detail[0]] = $com.util.getFormatter(TypeSourceGroupName, detail[0], detail[2]);
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
                //修改组
                $("body").delegate("#lmvt-standard-update", "click", function () {
                    if (mTypeZace == 1) {//组菜单
                        var SelectData = $com.table.getSelectionData($(".lmvt-group-tbody"), "ID", GroupSource);

                        if (!SelectData || !SelectData.length) {
                            alert("请先选择一行数据再试！");
                            return;
                        }

                        if (SelectData.length != 1) {
                            alert("只能同时对一行数据操作！");
                            return;
                        }

                        //判断该条数据是否可以修改
                        if (SelectData[0].Default == 1) {
                            alert("该菜单不允许被修改！");
                            return;
                        }


                        var text = FORMATTRT_Module['RoleID'](mID);
                        if (!confirm("已选择权限：" + text + "，确定更新吗？")) {
                            return;
                        }


                        $com.util.deleteLowerProperty(SelectData[0]);


                        SelectData[0].RoleID = mID;

                        model.com.postHomepageGroupUpdate({
                            data: SelectData[0],
                        }, function (res) {
                            alert("更新组权限成功！！");
                            model.com.refresh();
                        });
                    } else {
                        var SelectData = $com.table.getSelectionData($(".lmvt-menuModule-tbody"), "ID", ModuleSource);

                        if (!SelectData || !SelectData.length) {
                            alert("请先选择一行数据再试！");
                            return;
                        }
                        if (SelectData.length != 1) {
                            alert("只能同时对一行数据操作！");
                            return;
                        }

                        //判断该条数据是否可以修改
                        if (SelectData[0].Default == 1) {
                            alert("该菜单不允许被修改！");
                            return;
                        }
                        var text = FORMATTRT_Module['RoleID'](mID);
                        if (!confirm("已选择权限：" + text + "，确定更新吗？")) {
                            return;
                        }


                        var DEFAULT_VALUE = {
                            ModuleName: SelectData[0].Name,
                            Url: SelectData[0].Url,
                            OrderNum: SelectData[0].OrderNum,
                            Grad: SelectData[0].Grad,
                            GroupName: SelectData[0].GroupID,
                            PhotoUrl: SelectData[0].Icon,
                        };


                        $com.util.deleteLowerProperty(SelectData[0]);


                        SelectData[0].RoleID = mID;

                        model.com.postHomepageModuleUpdate({
                            data: SelectData[0],
                        }, function (res) {
                            alert("更新子权限成功！！");
                            model.com.refresh();
                        });

                    }


                });

                $("body").delegate("#standardItem li span", "click", function () {


                    var $this = $(this);
                    mID = Number($this.attr("data-value"));
                    $("#standardItem li span").css("color", "black");
                    $this.css("color", "blue");
                    return false;
                });
                //上传组的事件点击
                $("body").delegate("#lmvt-change-photo", "click", function () {


                    var SelectData = $com.table.getSelectionData($(".lmvt-group-tbody"), "ID", GroupSource);

                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！");
                        return;
                    }

                    if (SelectData.length != 1) {
                        alert("只能同时对一行数据操作！");
                        return;
                    }
                    SelectRanderData = SelectData[0];
                    $("#input-file").val("");
                    $("#input-file").click();
                });
                //上传组
                $("#input-file").on("change", function () {
                    var self = this,
                        _data = self.files[0];

                    if (_data) {
                        if (_data.size > (1024 * 1024 * 10)) {
                            alert("请上传小于10M的图片！");
                            clearFiles();
                            return;
                        }

                        if (!extLimit(['jpg', 'png', 'gif', 'bmp', 'jpeg']).has(_data.name)) {
                            alert("请上传正确的图片！");
                            clearFiles();
                            return;
                        }

                        var form = new FormData();
                        form.append("file", _data);

                        $.ajax({ //
                            url: "/MESCore/api/Upload/Submit",
                            type: "POST",
                            data: form,
                            processData: false,
                            contentType: false,
                            dataType: "JSON",
                        }).done(function (data) {

                            if (data.resultCode === 1000) {

                                data.returnObject.file_url;

                                $com.util.deleteLowerProperty(SelectRanderData);

                                SelectRanderData.Icon = data.returnObject.file_url;


                                model.com.postHomepageGroupUpdate({
                                    data: SelectRanderData,
                                }, function (res) {
                                    alert("修改成功！！");
                                    model.com.refresh();
                                });

                            } else {
                                alert("上传失败，请重新再试");
                                clearFiles();
                            }

                        });
                    }

                    function clearFiles() {
                        self.value = "";
                    }

                    function extLimit(exts) {
                        return {
                            has: function (file) {
                                var arr = file.split("."),
                                    ext = arr[arr.length - 1].toLowerCase();

                                return exts.indexOf(ext) > -1 ? true : false;
                            },
                        };
                    }
                });

                //上传子的事件点击
                $("body").delegate("#lmvt-change-photoModule", "click", function () {

                    var SelectData = $com.table.getSelectionData($(".lmvt-menuModule-tbody"), "ID", ModuleSource);

                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！");
                        return;
                    }

                    if (SelectData.length != 1) {
                        alert("只能同时对一行数据操作！");
                        return;
                    }
                    SelectRanderModule = SelectData[0];
                    $("#input-fileModule").val("");
                    $("#input-fileModule").click();
                });
                //上传子
                $("#input-fileModule").on("change", function () {
                    var self = this,
                        _data = self.files[0];

                    if (_data) {
                        if (_data.size > (1024 * 1024 * 10)) {
                            alert("请上传小于10M的图片！");
                            clearFiles();
                            return;
                        }

                        if (!extLimit(['jpg', 'png', 'gif', 'bmp', 'jpeg']).has(_data.name)) {
                            alert("请上传正确的图片！");
                            clearFiles();
                            return;
                        }

                        var form = new FormData();
                        form.append("file", _data);

                        $.ajax({ //
                            url: "/MESCore/api/Upload/Submit",
                            type: "POST",
                            data: form,
                            processData: false,
                            contentType: false,
                            dataType: "JSON",
                        }).done(function (data) {

                            if (data.resultCode === 1000) {

                                data.returnObject.file_url;

                                $com.util.deleteLowerProperty(SelectRanderModule);

                                SelectRanderModule.Icon = data.returnObject.file_url;

                                model.com.postHomepageModuleUpdate({
                                    data: SelectRanderModule,
                                }, function (res) {
                                    alert("修改成功！！");
                                    model.com.refresh();
                                });

                            } else {
                                alert("上传失败，请重新再试");
                                clearFiles();
                            }

                        });
                    }

                    function clearFiles() {
                        self.value = "";
                    }

                    function extLimit(exts) {
                        return {
                            has: function (file) {
                                var arr = file.split("."),
                                    ext = arr[arr.length - 1].toLowerCase();

                                return exts.indexOf(ext) > -1 ? true : false;
                            },
                        };
                    }
                });
                //查询
                $("body").delegate("#lmvt-add-groupSearch", "click", function () {
                    var default_value = {
                        Grad: 0,


                    };
                    $("body").append($com.modal.show(default_value, KEYWORD_Module, "查询", function (rst) {
                        //调用插入函数

                        if (!rst || $.isEmptyObject(rst))
                            return;


                        mGrad = Number(rst.Grad);


                        model.com.refresh();


                    }, TypeSourceGroupName));


                });

                //复制组
                $("body").delegate("#lmvt-add-groupAdd", "click", function () {
                    var default_value = {
                        Grad: 0,


                    };
                    $("body").append($com.modal.show(default_value, KEYWORD_Module, "选择", function (rst) {
                        //调用插入函数

                        if (!rst || $.isEmptyObject(rst))
                            return;


                        var wGrad = Number(rst.Grad);

                        var _list = [];
                        for (var m = 0; m < mListAll.length; m++) {
                            if (mListAll[m].Grad == wGrad) {
                                $com.util.deleteLowerProperty(mListAll[m]);
                                mListAll[m].ID = 0;
                                _list.push(mListAll[m]);
                            }

                        }


                        var a = 0;

                        for (var i = 0; i < _list.length; i++) {

                            $com.util.deleteLowerProperty(_list[i]);

                            _list[i].Active = 1;
                            _list[i].Grad = mGrad;


                            model.com.postHomepageGroupUpdate({
                                data: _list[i],
                            }, function (res) {
                                a++;
                                if (a == _list.length) {
                                    alert("复制成功！！");
                                    model.com.refresh();
                                }
                            });
                        }


                    }, TypeSourceGroupName));


                });

                //复制子
                $("body").delegate("#lmvt-add-groupAddItem", "click", function () {
                    var default_value = {
                        Grad: 0,
                    };
                    $("body").append($com.modal.show(default_value, KEYWORD_Module, "选择", function (rst) {
                        //调用插入函数

                        if (!rst || $.isEmptyObject(rst))
                            return;

                        var wGrad = Number(rst.Grad);

                        var GroupList = [];
                        ;
                        var ModuleList = [];
                        ;
                        $.each(mListAll, function (i, item) {
                            if (item.Grad == wGrad) {
                                $com.util.deleteLowerProperty(item);
                                GroupList.push(item);
                            }
                        });
                        $.each(mListAllItem, function (i, item) {
                            if (item.Grad == wGrad) {
                                $com.util.deleteLowerProperty(item);
                                ModuleList.push(item);
                            }
                        });
                        dgGroup(GroupList, 0);

                        function dgGroup(list, i) {
                            if (i >= list.length) {
                                dgModule(ModuleList, 0);
                            }
                            list[i].CID = list[i].ID;
                            list[i].ID = 0;
                            list[i].Grad = mGrad;
                            model.com.postHomepageGroupUpdate({
                                data: list[i],
                            }, function (res) {
                                list[i].ID = res.info.ID;
                                dgGroup(list, i + 1);
                            });
                        }

                        function dgModule(list, i) {
                            if (i >= list.length) {
                                alert("复制成功");
                                return;
                            }
                            list[i].ID = 0;
                            list[i].Grad = mGrad;

                            $.each(GroupList, function (j, item) {
                                if (item.CID == list[i].GroupID)
                                    list[i].GroupID = item.ID;
                            });
                            model.com.postHomepageModuleUpdate({
                                data: list[i],
                            }, function (res) {
                                list[i].ID = res.info.ID;
                                dgModule(list, i + 1);
                            });
                        }

                    }, TypeSourceGroupName));


                });
                //双击树
                $("body").delegate("#roleTree li span", "dbclick", function () {
                    var $this = $(this),
                        groupID = Number($this.parent('li').attr("data-key"));
                    RenderItemTable = [];
                    $.each(ModuleList, function (i, item) {
                        if (groupID == item.GroupID) {
                            RenderItemTable.push(item);
                        }
                    });

                    $(".lmvt-itemson-tbody").html($com.util.template(RenderItemTable, HTML.ModuleMenu));

                    $(".lmvt-contain-right-table-module").hide();
                    $(".lmvt-contain-right-table").hide();
                    $(".lmvt-contain-right-table-itemson").show();
                });

                //树更新
                $("body").delegate("#lmvt-tree-update", "click", function () {
                    $("#roleTree input[type=checkbox].femi-tree-checkbox").each(function (i, item) {

                        if (!$(item).prop("checked")) {

                            if (Number($(item).closest("li").attr("data-type")) == 1) {

                                $.each(Group, function (i, item_g) {
                                    if (Number($(item).closest("li").attr("data-key")) == item_g.ID) {
                                        item_g.Active = 2;
                                    }
                                });

                            } else
                                $.each(Module, function (i, item_m) {
                                    if (Number($(item).closest("li").attr("data-key")) == item_m.ID) {
                                        item_m.Active = 2;
                                    }
                                });

                        } else {
                            if (Number($(item).closest("li").attr("data-type")) == 1) {

                                $.each(Group, function (i, item_g) {
                                    if (Number($(item).closest("li").attr("data-key")) == item_g.ID) {
                                        item_g.Active = 1;
                                    }
                                });

                            } else
                                $.each(Module, function (i, item_m) {
                                    if (Number($(item).closest("li").attr("data-key")) == item_m.ID) {
                                        item_m.Active = 1;
                                    }
                                });
                        }

                    });
                    model.com.renderTree(Group, Module);
                });
                //树的点击事件
                $("body").delegate("#roleTree input[type=checkbox].femi-tree-checkbox", "click", function () {
                    var $this = $(this);
                    if (Number($this.closest("li").attr("data-type")) == 1) {
                        if ($this.prop("checked")) {
                            $this.parent().next().each(function (i, item) {
                                $(item).find("input").prop("checked", true);
                            });
                        } else {
                            $this.parent().next().each(function (i, item) {
                                $(item).find("input").prop("checked", false);
                            });
                        }
                    } else {
                        if ($this.prop("checked")) {
                            var count = 0;
                            $this.closest('ul').find('li').each(function (i, item) {
                                if ($(item).find('input').prop("checked")) {
                                    count++;
                                }
                            });
                            if (count == 1)
                                $this.closest('ul').prev().find('input').prop("checked", true);
                        } else {
                            var count = 0;
                            $this.closest('ul').find('li').each(function (i, item) {
                                if ($(item).find('input').prop("checked")) {
                                    count++;
                                }
                            });
                            if (count == 0)
                                $this.closest('ul').prev().find('input').prop("checked", false);
                        }

                    }
                });
                //新增组
                $("body").delegate("#lmvt-add-group", "click", function () {
                    var DEFAULT_VALUE = {
                        GroupName: "",
                        OrderNum: 0,
                        Grad: 0,
                        //PhotoUrl : ""

                    };
                    $("body").append($com.modal.show(DEFAULT_VALUE, KEYWORD_LISTItem, "新增组", function (rst) {
                        //调用插入函数
                        if (!rst || $.isEmptyObject(rst))
                            return;

                        var _data = {
                            ID: 0,
                            Name: rst.GroupName,
                            OrderNum: Number(rst.OrderNum),
                            Grad: Number(rst.Grad),
                            //Icon : rst.PhotoUrl,
                            ModuleList: [],
                            Type: 2,
                            Active: 1,
                        };

                        model.com.postHomepageGroupUpdate({
                            data: _data,
                        }, function (res) {
                            model.com.refresh();
                            alert("新增成功！！");
                        });

                    }, TypeSource));
                });
                //新增子
                $("body").delegate("#lmvt-add-module", "click", function () {
                    $("body").append($com.modal.show(DEFAULT_VALUE_Module, KEYWORD_Module, "新增子菜单", function (rst) {
                        //调用插入函数
                        if (!rst || $.isEmptyObject(rst))
                            return;

                        var _data = {
                            ID: 0,
                            Name: rst.ModuleName,
                            GroupID: rst.GroupName,
                            OrderNum: Number(rst.OrderNum),
                            Grad: Number(rst.Grad),
                            //Icon : rst.PhotoUrl,
                            Url: rst.Url,
                            Type: 2,
                            Active: 1,
                            SecretKey: rst.SecretKey,
                        };

                        model.com.postHomepageModuleUpdate({
                            data: _data,
                        }, function (res) {
                            alert("新增成功！！");
                            model.com.refresh();
                        });

                    }, TypeSourceGroupName));
                });
                //查看子菜单
                $("body").delegate("#lmvt-see-module", "click", function () {
                    $(".lmvt-contain-right-table-module").show();
                    $(".lmvt-contain-right-table").hide();
                    mTypeZace = 2;
                });
                //查看组菜单
                $("body").delegate("#lmvt-see-group", "click", function () {
                    $(".lmvt-contain-right-table-module").hide();
                    $(".lmvt-contain-right-table").show();
                    mTypeZace = 1;
                });
                //修改组
                $("body").delegate("#lmvt-change-group", "click", function () {
                    var SelectData = $com.table.getSelectionData($(".lmvt-group-tbody"), "ID", GroupSource);

                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！");
                        return;
                    }

                    if (SelectData.length != 1) {
                        alert("只能同时对一行数据操作！");
                        return;
                    }

                    //判断该条数据是否可以修改
                    if (SelectData[0].Default == 1) {
                        alert("该菜单不允许被修改！");
                        return;
                    }

                    var DEFAULT_VALUE = {
                        GroupName: SelectData[0].Name,
                        PhotoUrl: SelectData[0].Icon,
                        OrderNum: SelectData[0].OrderNum,
                        Grad: SelectData[0].Grad,
                    };


                    $("body").append($com.modal.show(DEFAULT_VALUE, KEYWORD_LISTItem, "修改", function (rst) {
                        //调用插入函数
                        if (!rst || $.isEmptyObject(rst))
                            return;

                        $com.util.deleteLowerProperty(SelectData[0]);

                        SelectData[0].OrderNum = Number(rst.OrderNum);
                        SelectData[0].Grad = Number(rst.Grad);
                        SelectData[0].Name = rst.GroupName;
                        SelectData[0].Icon = rst.PhotoUrl;

                        model.com.postHomepageGroupUpdate({
                            data: SelectData[0],
                        }, function (res) {
                            alert("修改成功！！");
                            model.com.refresh();
                        });

                    }, TypeSource));
                });
                //修改子
                $("body").delegate("#lmvt-change-module", "click", function () {

                    var SelectData = $com.table.getSelectionData($(".lmvt-menuModule-tbody"), "ID", ModuleSource);

                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！");
                        return;
                    }
                    if (SelectData.length != 1) {
                        alert("只能同时对一行数据操作！");
                        return;
                    }

                    //判断该条数据是否可以修改
                    if (SelectData[0].Default == 1) {
                        alert("该菜单不允许被修改！");
                        return;
                    }

                    var DEFAULT_VALUE = {
                        ModuleName: SelectData[0].Name,
                        Url: SelectData[0].Url,
                        OrderNum: SelectData[0].OrderNum,
                        Grad: SelectData[0].Grad,
                        GroupName: SelectData[0].GroupID,
                        PhotoUrl: SelectData[0].Icon,
                    };

                    $("body").append($com.modal.show(DEFAULT_VALUE, KEYWORD_Module, "修改", function (rst) {
                        //调用插入函数
                        if (!rst || $.isEmptyObject(rst))
                            return;

                        $com.util.deleteLowerProperty(SelectData[0]);

                        SelectData[0].Name = rst.ModuleName;
                        SelectData[0].Url = rst.Url;
                        SelectData[0].OrderNum = Number(rst.OrderNum);
                        SelectData[0].Grad = Number(rst.Grad);
                        SelectData[0].GroupID = Number(rst.GroupName);
                        SelectData[0].Icon = rst.PhotoUrl;

                        model.com.postHomepageModuleUpdate({
                            data: SelectData[0],
                        }, function (res) {
                            alert("修改成功！！");
                            model.com.refresh();
                        });

                    }, TypeSourceGroupName));
                });
                //模糊组查询
                $("body").delegate("#lmvt-search-group", "input", function () {

                    var $this = $(this),
                        value = $(this).val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $(".lmvt-group-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($(".lmvt-group-tbody"), GroupList, value, "ID");
                });
                //模糊子查询
                $("body").delegate("#lmvt-search-module", "input", function () {

                    var $this = $(this),
                        value = $(this).val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $(".lmvt-menuModule-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($(".lmvt-menuModule-tbody"), ModuleList, value, "ID");
                });
                //组菜单激活

                $("body").delegate(".lmvt-group-tbody tr", "dblclick", function () {

                    var $this = $(this);
                    var $table = $this.closest("table");
                    var WID = Number($this.find('td[data-title=ID]').attr('data-value'));

                    var RoleID = 0;
                    for (let m = 0; m < GroupSource.length; m++) {
                        if (GroupSource[m].ID == WID) {
                            RoleID = GroupSource[m].RoleID;
                        }
                        ;

                    }
                    model.com.renderRoleTree(mRoleList, RoleID);
                    return false;
                });


                $("body").delegate(".lmvt-menuModule-tbody tr", "dblclick", function () {

                    var $this = $(this);
                    var $table = $this.closest("table");
                    var WID = Number($this.find('td[data-title=ID]').attr('data-value'));
                    var RoleID = 0;
                    for (let m = 0; m < ModuleSource.length; m++) {
                        if (ModuleSource[m].ID == WID) {
                            RoleID = ModuleSource[m].RoleID;
                        }
                        ;

                    }
                    model.com.renderRoleTree(mRoleList, RoleID);
                    return false;

                });
                $("body").delegate("#lmvt-group-active ", "click", function () {
                    var SelectData = $com.table.getSelectionData($(".lmvt-group-tbody"), "ID", GroupSource);

                    if (!SelectData || !SelectData.length) {
                        alert("至少选择一行数据！");
                        return;
                    }


                    var a = 0;
                    for (var i = 0; i < SelectData.length; i++) {

                        $com.util.deleteLowerProperty(SelectData[i]);

                        SelectData[i].Active = 1;

                        model.com.postHomepageGroupUpdate({
                            data: SelectData[i],
                        }, function (res) {
                            a++;
                            if (a == SelectData.length) {
                                alert("激活成功！！");
                                model.com.refresh();
                            }
                        });
                    }

                });
                //组菜单禁用
                $("body").delegate("#lmvt-group-forbid", "click", function () {
                    var SelectData = $com.table.getSelectionData($(".lmvt-group-tbody"), "ID", GroupSource);

                    if (!SelectData || !SelectData.length) {
                        alert("至少选择一行数据！");
                        return;
                    }

                    var a = 0;
                    for (var i = 0; i < SelectData.length; i++) {

                        $com.util.deleteLowerProperty(SelectData[i]);

                        SelectData[i].Active = 2;

                        model.com.postHomepageGroupUpdate({
                            data: SelectData[i],
                        }, function (res) {
                            a++;
                            if (a == SelectData.length) {
                                alert("禁用成功！！");
                                model.com.refresh();
                            }
                        });
                    }

                });
                //组菜单删除
                $("body").delegate("#lmvt-group-delete", "click", function () {
                    var SelectData = $com.table.getSelectionData($(".lmvt-group-tbody"), "ID", GroupSource);

                    if (!SelectData || !SelectData.length) {
                        alert("至少选择一行数据！");
                        return;
                    }
                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {
                        return;
                    }

                    var a = 0;
                    for (var i = 0; i < SelectData.length; i++) {

                        $com.util.deleteLowerProperty(SelectData[i]);

                        SelectData[i].Active = 3;

                        model.com.postHomepageGroupUpdate({
                            data: SelectData[i],
                        }, function (res) {
                            a++;
                            if (a == SelectData.length) {
                                alert("删除成功！！");
                                model.com.refresh();
                            }
                        });
                    }

                });
                //子菜单激活
                $("body").delegate("#lmvt-module-active", "click", function () {
                    var SelectData = $com.table.getSelectionData($(".lmvt-menuModule-tbody"), "ID", ModuleSource);

                    if (!SelectData || !SelectData.length) {
                        alert("至少选择一行数据！");
                        return;
                    }

                    var a = 0;
                    for (var i = 0; i < SelectData.length; i++) {

                        $com.util.deleteLowerProperty(SelectData[i]);

                        SelectData[i].Active = 1;

                        model.com.postHomepageModuleUpdate({
                            data: SelectData[i],
                        }, function (res) {
                            a++;
                            if (a == SelectData.length) {
                                alert("激活成功！！");
                                model.com.refresh();
                            }
                        });
                    }

                });
                //子菜单禁用
                $("body").delegate("#lmvt-module-forbidden", "click", function () {
                    var SelectData = $com.table.getSelectionData($(".lmvt-menuModule-tbody"), "ID", ModuleSource);

                    if (!SelectData || !SelectData.length) {
                        alert("至少选择一行数据！");
                        return;
                    }

                    var a = 0;
                    for (var i = 0; i < SelectData.length; i++) {

                        $com.util.deleteLowerProperty(SelectData[i]);

                        SelectData[i].Active = 2;

                        model.com.postHomepageModuleUpdate({
                            data: SelectData[i],
                        }, function (res) {
                            a++;
                            if (a == SelectData.length) {
                                alert("禁用成功！！");
                                model.com.refresh();
                            }
                        });
                    }

                });
                //子菜单删除
                $("body").delegate("#lmvt-module-delete", "click", function () {
                    var SelectData = $com.table.getSelectionData($(".lmvt-menuModule-tbody"), "ID", ModuleSource);

                    if (!SelectData || !SelectData.length) {
                        alert("至少选择一行数据！");
                        return;
                    }
                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {
                        return;
                    }
                    var a = 0;
                    for (var i = 0; i < SelectData.length; i++) {

                        $com.util.deleteLowerProperty(SelectData[i]);

                        SelectData[i].Active = 3;

                        model.com.postHomepageModuleUpdate({
                            data: SelectData[i],
                        }, function (res) {
                            a++;
                            if (a == SelectData.length) {
                                alert("删除成功！！");
                                model.com.refresh();
                            }
                        });
                    }

                });
                //组菜单切换
                $("body").delegate("#lmvt-group-menu", "click", function () {
                    $(".lmvt-contain-right-table-module").hide();
                    $(".lmvt-contain-right-table").show();

                    mTypeZace = 1;
                });
                //子菜单切换
                $("body").delegate("#lmvt-module-menu", "click", function () {
                    $(".lmvt-contain-right-table-module").show();
                    $(".lmvt-contain-right-table").hide();
                    mTypeZace = 2;
                });
                //返回
                $("body").delegate("#lmvt-itemson-back", "click", function () {
                    $(".lmvt-contain-right-table-module").hide();
                    $(".lmvt-contain-right-table").show();
                    $(".lmvt-contain-right-table-itemson").hide();
                });

                //修改对应子
                $("body").delegate("#lmvt-itemson-module", "click", function () {

                    var SelectData = $com.table.getSelectionData($(".lmvt-itemson-tbody"), "ID", ModuleSource);

                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！");
                        return;
                    }
                    if (SelectData.length != 1) {
                        alert("只能同时对一行数据操作！");
                        return;
                    }

                    //判断该条数据是否可以修改
                    if (SelectData[0].Default == 1) {
                        alert("该菜单不允许被修改！");
                        return;
                    }

                    var DEFAULT_VALUE = {
                        ModuleName: SelectData[0].Name,
                        Url: SelectData[0].Url,
                        GroupName: SelectData[0].GroupID,
                        PhotoUrl: SelectData[0].Icon,
                        SecretKey: "",
                    };

                    $("body").append($com.modal.show(DEFAULT_VALUE, KEYWORD_Module, "修改", function (rst) {
                        //调用插入函数
                        if (!rst || $.isEmptyObject(rst))
                            return;

                        $com.util.deleteLowerProperty(SelectData[0]);

                        SelectData[0].Name = rst.ModuleName;
                        SelectData[0].Url = rst.Url;
                        SelectData[0].GroupID = Number(rst.GroupName);
                        SelectData[0].Icon = rst.PhotoUrl;
                        SelectData[0].SecretKey = rst.SecretKey;

                        model.com.postHomepageModuleUpdate({
                            data: SelectData[0],
                        }, function (res) {
                            alert("修改成功！！");
                            model.com.refresh();
                        });

                    }, TypeSourceGroupName));
                });
                //对应子菜单激活
                $("body").delegate("#lmvt-itemson-active", "click", function () {
                    var SelectData = $com.table.getSelectionData($(".lmvt-menuModule-tbody"), "ID", ModuleSource);

                    if (!SelectData || SelectData.length != 1) {
                        alert("请先选择一行数据再试！");
                        return;
                    }

                    $com.util.deleteLowerProperty(SelectData[0]);

                    SelectData[0].Active = 1;

                    model.com.postHomepageModuleUpdate({
                        data: SelectData[0],
                    }, function (res) {
                        alert("激活成功！！");
                        model.com.refresh();
                    });

                });
                //对应子菜单禁用
                $("body").delegate("#lmvt-itemson-forbid", "click", function () {
                    var SelectData = $com.table.getSelectionData($(".lmvt-itemson-tbody"), "ID", ModuleSource);

                    if (!SelectData || SelectData.length != 1) {
                        alert("请先选择一行数据再试！");
                        return;
                    }

                    $com.util.deleteLowerProperty(SelectData[0]);

                    SelectData[0].Active = 2;

                    model.com.postHomepageModuleUpdate({
                        data: SelectData[0],
                    }, function (res) {
                        alert("禁用成功！！");
                        model.com.refresh();
                    });

                });
                //对应子菜单删除
                $("body").delegate("#lmvt-itemson-delete", "click", function () {
                    var SelectData = $com.table.getSelectionData($(".lmvt-itemson-tbody"), "ID", ModuleSource);

                    if (!SelectData || SelectData.length != 1) {
                        alert("请先选择一行数据再试！");
                        return;
                    }

                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {
                        return;
                    }
                    $com.util.deleteLowerProperty(SelectData[0]);

                    SelectData[0].Active = 3;

                    model.com.postHomepageModuleUpdate({
                        data: SelectData[0],
                    }, function (res) {
                        alert("删除成功！！");
                        model.com.refresh();
                    });

                });

            },

            run: function () {

                //model.com.renderTree(Group, Module);

                /* $.each(Group, function (i, item) {
                             item.ShowPhoto = ["<img src= \"", item.Url, "\" />"].join("");
                         });*/

                //$(".lmvt-group-tbody").html($com.util.template(Group, HTML.WebMenu));


                model.com.getRoleTree({}, function (res) {

                    $.each(res.list, function (i, item) {
                        TypeSourceGroupName.RoleID.push({
                            name: item.Text,
                            value: item.FunctionID,

                        });
                        item.TextColor = 'black';

                    });
                    mRoleList = res.list;
                    TypeSource.RoleID = TypeSourceGroupName.RoleID;
                    model.com.renderRoleTree(mRoleList, 0);
                    model.com.refresh();
                });
            },

            com: {

                renderRoleTree: function (list, mNum) {
                    for (var k = 0; k < list.length; k++) {
                        list[k].TextColor = 'black';
                        if (list[k].FunctionID == mNum) {
                            list[k].TextColor = 'green';
                        }
                        ;

                    }
                    $com.app.loading('数据加载中...');
                    model._treeData = list;
                    var _data = FindData(0);
                    SetData(_data);

                    tempData(_data);

                    $("#standardItem").html($com.util.template(_data, HTML.RoleTreeItemNode));

                    $("#standardItem").treeview();
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
                                _item_t.Items = $com.util.template(_item_t.items, HTML.RoleTreeItemNode);
                            }
                        });
                    }

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
                renderTree: function (GroupList, ModuleList) {

                    $.each(GroupList, function (i, item) {
                        item.Items = '';
                        $.each(ModuleList, function (j, item_j) {
                            if (item_j.GroupID == item.ID) {

                                //item_j.Icon = [ "<img style=\"width:20px;height:20px\" src= \"", item_j.Icon, "\" />" ].join("");

                                item.Items = item.Items + $com.util.template(item_j, HTML.TreeItemSonNode);
                            }
                        });
                        //item.Icon = [ "<img style=\"width:20px;height:20px\" src= \"", item.Icon, "\" />" ].join("");
                    });

                    $("#roleTree").html($com.util.template(GroupList, HTML.TreeItemNode));

                    $("#roleTree").treeview();

                    $("#roleTree input[type=checkbox].femi-tree-checkbox").each(function (i, item) {

                        if ($(item).closest("li").attr("data-value") == 1)
                            $(item).prop("checked", true);

                    });


                },

                //根据类型获取菜单组
                getHomepageGroup_all: function (data, fn, context) {
                    var d = {
                        $URI: "/HomePage/GroupAll",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //根据类型获取菜单项
                getHomepageModule_all: function (data, fn, context) {
                    var d = {
                        $URI: "/HomePage/ModuleAll",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //修改组
                postHomepageGroupUpdate: function (data, fn, context) {
                    var d = {
                        $URI: "/HomePage/GroupUpdate",
                        $TYPE: "post",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //修改子
                postHomepageModuleUpdate: function (data, fn, context) {

                    var d = {
                        $URI: "/HomePage/ModuleUpdate",
                        $TYPE: "post",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                refresh: function () {
                    ////组菜单
                    model.com.getHomepageGroup_all({
                        Type: 2,
                    }, function (res) {
                        if (!res)
                            return;
                        var list = res.list,

                            rst = [];

                        mListAll = $com.util.Clone(res.list);
                        var dataZace = [];
                        for (var i = 0; i < list.length; i++) {
                            if (list[i].Active <= 2 && list[i].Grad == mGrad) {
                                dataZace.push(list[i]);

                            }
                        }
                        if (dataZace) {
                            if (!TypeSourceGroupName) {
                                TypeSourceGroupName = {};
                            }
                            TypeSourceGroupName.GroupName = [];
                            TypeSourceGroupName.GroupID = [];


                            var tempArr = [];
                            $.each(dataZace, function (i, item) {
                                TypeSourceGroupName.GroupName.push({
                                    name: item.Name,
                                    value: item.ID,
                                });
                                TypeSourceGroupName.GroupID.push({
                                    name: item.Name,
                                    value: item.ID,
                                });
                                if (item.Active != 2) {
                                    tempArr.push(item);
                                }
                            });

                            GroupList = $com.util.Clone(dataZace);

                            GroupSource = $com.util.Clone(dataZace);

                            GroupTree = $com.util.Clone(tempArr);

                            $.each(GroupList, function (i, item) {
                                for (var p in item) {
                                    if (!FORMATTRT_Module[p])
                                        continue;
                                    item[p] = FORMATTRT_Module[p](item[p]);
                                }
                            });

                            $(".lmvt-group-tbody").html($com.util.template(GroupList, HTML.WebMenu));
                        }
                        //项菜单
                        model.com.getHomepageModule_all({
                            Type: 2,
                        }, function (res) {
                            if (!res)
                                return;
                            var list = res.list,
                                rst = [];
                            mListAllItem = $com.util.Clone(res.list);
                            var dataZace = [];
                            for (var i = 0; i < list.length; i++) {
                                if (list[i].Active <= 2 && list[i].Grad == mGrad) {
                                    dataZace.push(list[i]);

                                }
                            }
                            if (dataZace) {

                                var tempModuleArr = [];

                                $.each(dataZace, function (i, item) {
                                    if (item.Active != 2) {
                                        tempModuleArr.push(item);
                                    }
                                });

                                ModuleList = $com.util.Clone(dataZace);

                                ModuleSource = $com.util.Clone(dataZace);

                                ModuleTree = $com.util.Clone(tempModuleArr);


                                $.each(ModuleList, function (i, item) {
                                    for (var p in item) {
                                        if (!FORMATTRT_Module[p])
                                            continue;
                                        item[p] = FORMATTRT_Module[p](item[p]);
                                    }
                                });

                                $(".lmvt-menuModule-tbody").html($com.util.template(ModuleList, HTML.ModuleMenu));

                                model.com.renderTree(GroupTree, ModuleTree);
                            }
                        });

                    });

                },
            },
        });

        model.init();
    });