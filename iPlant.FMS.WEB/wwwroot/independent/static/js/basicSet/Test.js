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
                '<td data-title="Active" data-value="{{Active}}">{{Active}}</td>',
                '</tr>',
            ].join(""),
        };

        $(function () {
            DEFAULT_VALUE_Module = {
                ModuleName: "",
                Url: "",
                GroupName: 0,
                //PhotoUrl : "",
                SecretKey: "示例：****-****",
            },
                KEYWORD_LIST_Module = [
                    "ModuleName|菜单名称",
                    "Url|菜单路径",
                    "GroupName|所属组|ArrayOne",
                    "PhotoUrl|图片路径",
                    "Active|状态|ArrayOne",
                    "GroupID|所属组|ArrayOne",
                    "SecretKey|模块密匙",
                ],
                KEYWORD_Module = {},
                FORMATTRT_Module = {};
            TypeSourceGroupName = {
                GroupName: [],
                Active: [
                    {
                        name: "默认",
                        value: 0,
                    },
                    {
                        name: "使用中",
                        value: 1,
                    },
                    {
                        name: "未使用",
                        value: 2,
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
        });

        model = $com.Model.create({
            name: 'iPlant.MES',

            type: $com.Model.MAIN,

            configure: function () {
                this.run();
            },

            events: function () {
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
                            url: "/upload.htm",
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
                    $("#input-file").val("");
                    $("#input-file").click();
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
                            url: "/upload.htm",
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

                                model.com.postHomepageGroupUpdate({
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
                            //PhotoUrl : ""

                        },
                        KEYWORD_LIST = [
                            "GroupName|组名称",
                            "PhotoUrl|照片路径",
                        ],
                        KEYWORD_LISTItem = {},
                        FORMATTRT_LevelItem = {},
                        TypeSource = {};
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
                    $("body").append($com.modal.show(DEFAULT_VALUE, KEYWORD_LISTItem, "新增组", function (rst) {
                        //调用插入函数
                        if (!rst || $.isEmptyObject(rst))
                            return;

                        var _data = {
                            ID: 0,
                            Name: rst.GroupName,
                            Icon: rst.PhotoUrl,
                            ModuleList: [],
                            Type: 1,
                            Active: 1,
                        };

                        model.com.postHomepageGroupUpdate({
                            data: _data,
                        }, function (res) {
                            model.com.refresh();
                            alert("新增成功！！");
                        }, {
                            Remote: 1,
                            User_ID: model.query.ID,
                            User_Password: model.query.Password,
                            User_ModuleID: model.query.ModuleID,
                        });

                    }, TypeSource));
                });
                //新增子
                $("body").delegate("#lmvt-add-module", "click", function () {
                    $("body").append($com.modal.show(DEFAULT_VALUE_Module, KEYWORD_Module, "菜单设置", function (rst) {
                        //调用插入函数
                        if (!rst || $.isEmptyObject(rst))
                            return;

                        var _data = {
                            ID: 0,
                            Name: rst.ModuleName,
                            GroupID: rst.GroupName,
                            Icon: rst.PhotoUrl,
                            Url: rst.Url,
                            Type: 1,
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
                });
                //查看组菜单
                $("body").delegate("#lmvt-see-group", "click", function () {
                    $(".lmvt-contain-right-table-module").hide();
                    $(".lmvt-contain-right-table").show();
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
                        },
                        KEYWORD_LIST = [
                            "GroupName|组名称",
                            "PhotoUrl|照片路径",
                            "Active|状态|ArrayOne",
                        ],
                        KEYWORD_LISTItem = {},
                        FORMATTRT_LevelItem = {},
                        TypeSource = {
                            Active: [
                                {
                                    name: "默认",
                                    value: 0,
                                },
                                {
                                    name: "使用中",
                                    value: 1,
                                },
                                {
                                    name: "未使用",
                                    value: 2,
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

                    $("body").append($com.modal.show(DEFAULT_VALUE, KEYWORD_LISTItem, "修改", function (rst) {
                        //调用插入函数
                        if (!rst || $.isEmptyObject(rst))
                            return;

                        $com.util.deleteLowerProperty(SelectData[0]);

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
                $("body").delegate("#lmvt-search-group", "click", function () {

                    var $this = $(this),
                        value = $(this).val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $(".lmvt-group-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($(".lmvt-group-tbody"), GroupList, value, "ID");
                });
                //模糊子查询
                $("body").delegate("#lmvt-search-module", "click", function () {

                    var $this = $(this),
                        value = $(this).val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $(".lmvt-menuModule-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($(".lmvt-menuModule-tbody"), ModuleList, value, "ID");
                });
                //组菜单激活
                $("body").delegate("#lmvt-group-active", "click", function () {
                    var SelectData = $com.table.getSelectionData($(".lmvt-group-tbody"), "ID", GroupSource);

                    if (!SelectData || SelectData.length != 1) {
                        alert("请先选择一行数据再试！");
                        return;
                    }

                    $com.util.deleteLowerProperty(SelectData[0]);

                    SelectData[0].Active = 1;

                    model.com.postHomepageGroupUpdate({
                        data: SelectData[0],
                    }, function (res) {
                        alert("激活成功！！");
                        model.com.refresh();
                    });

                });
                //组菜单禁用
                $("body").delegate("#lmvt-group-forbid", "click", function () {
                    var SelectData = $com.table.getSelectionData($(".lmvt-group-tbody"), "ID", GroupSource);

                    if (!SelectData || SelectData.length != 1) {
                        alert("请先选择一行数据再试！");
                        return;
                    }

                    $com.util.deleteLowerProperty(SelectData[0]);

                    SelectData[0].Active = 2;

                    model.com.postHomepageGroupUpdate({
                        data: SelectData[0],
                    }, function (res) {
                        alert("禁用成功！！");
                        model.com.refresh();
                    });

                });
                //组菜单删除
                $("body").delegate("#lmvt-group-delete", "click", function () {
                    var SelectData = $com.table.getSelectionData($(".lmvt-group-tbody"), "ID", GroupSource);

                    if (!SelectData || SelectData.length != 1) {
                        alert("请先选择一行数据再试！");
                        return;
                    }

                    $com.util.deleteLowerProperty(SelectData[0]);

                    SelectData[0].Active = 3;

                    model.com.postHomepageGroupUpdate({
                        data: SelectData[0],
                    }, function (res) {
                        alert("删除成功！！");
                        model.com.refresh();
                    });

                });
                //子菜单激活
                $("body").delegate("#lmvt-module-active", "click", function () {
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
                //子菜单禁用
                $("body").delegate("#lmvt-module-forbid", "click", function () {
                    var SelectData = $com.table.getSelectionData($(".lmvt-menuModule-tbody"), "ID", ModuleSource);

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
                //子菜单删除
                $("body").delegate("#lmvt-module-delete", "click", function () {
                    var SelectData = $com.table.getSelectionData($(".lmvt-menuModule-tbody"), "ID", ModuleSource);

                    if (!SelectData || SelectData.length != 1) {
                        alert("请先选择一行数据再试！");
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
                //组菜单切换
                $("body").delegate("#lmvt-group-menu", "click", function () {
                    $(".lmvt-contain-right-table-module").hide();
                    $(".lmvt-contain-right-table").show();
                });
                //子菜单切换
                $("body").delegate("#lmvt-module-menu", "click", function () {
                    $(".lmvt-contain-right-table-module").show();
                    $(".lmvt-contain-right-table").hide();
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
                        SecretKey: SelectData[0].SecretKey,
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

                alert(model.query.ID + " " + model.query.LoginName);

                //model.com.renderTree(Group, Module);

                /* $.each(Group, function (i, item) {
                     item.ShowPhoto = ["<img src= \"", item.Url, "\" />"].join("");
                 });*/

                //$(".lmvt-group-tbody").html($com.util.template(Group, HTML.WebMenu));

                model.com.refresh();

            },

            com: {
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
                        $URI: "http://192.168.158.131:8080/api/HomePage/GroupAll",
                        $TYPE: "get",
                        $DATATYPE: "JSONP",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                //修改组
                postHomepageGroupUpdate: function (data, fn, _self, context) {
                    var d = {
                        $URI: "http://192.168.158.131:8080/api/HomePage/GroupUpdate",
                        $TYPE: "post",
                        $DATATYPE: "JSONP",
                    };
                    d.$URI += ("?" + $com.uri.setUrlQuery(_self));

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    //jQuery.support.cors = true;
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                refresh: function () {
                    ////组菜单
                    model.com.getHomepageGroup_all({
                        Type: 1,
                        Remote: 1,
                        User_ID: model.query.ID,
                        User_Password: model.query.Password,
                        User_ModuleID: model.query.ModuleID,
                    }, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];
                        if (list) {
                            TypeSourceGroupName.GroupName = [];
                            TypeSourceGroupName.GroupID = [];
                            $.each(res.list, function (i, item) {
                                TypeSourceGroupName.GroupName.push({
                                    name: item.Name,
                                    value: item.ID,
                                });
                                TypeSourceGroupName.GroupID.push({
                                    name: item.Name,
                                    value: item.ID,
                                });
                            });

                            GroupList = $com.util.Clone(res.list);

                            GroupSource = $com.util.Clone(res.list);

                            GroupTree = $com.util.Clone(res.list);

                            $.each(GroupList, function (i, item) {
                                for (var p in item) {
                                    if (!FORMATTRT_Module[p])
                                        continue;
                                    item[p] = FORMATTRT_Module[p](item[p]);
                                }
                            });

                            $(".lmvt-group-tbody").html($com.util.template(GroupList, HTML.WebMenu));
                        }
                        ////项菜单
                        //model.com.getHomepageModule_all({
                        //    Type: 1
                        //}, function (res) {
                        //    if (!res)
                        //        return;
                        //    var list = res.list,
                        //		rst = [];
                        //    if (list) {

                        //        ModuleList = $com.util.Clone(res.list);

                        //        ModuleSource = $com.util.Clone(res.list);

                        //        ModuleTree = $com.util.Clone(res.list);

                        //        $.each(ModuleList, function (i, item) {
                        //            for (var p in item) {
                        //                if (!FORMATTRT_Module[p])
                        //                    continue;
                        //                item[p] = FORMATTRT_Module[p](item[p]);
                        //            }
                        //        });

                        //        $(".lmvt-menuModule-tbody").html($com.util.template(ModuleList, HTML.ModuleMenu));

                        //        model.com.renderTree(GroupTree, ModuleTree);
                        //    }
                        //});

                    });

                },
            },
        });

        model.init();
    });