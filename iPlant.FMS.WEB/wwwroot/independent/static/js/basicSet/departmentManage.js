require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/html2canvas', '../static/utils/js/base/jquery.jOrgChart', '../static/utils/js/base/paging', '../static/utils/js/base/bootstrap-treeview.min'],
    function ($lin, $com, $l_html2canvas, $l_orgchart, $page, $tree) {

        var HTML,
            AllDepartment,
            ALLPosition,
            Department_LIST,
            Position_LIST_GW,
            Department_LIST_BM,
            Position_LIST,
            KEYWORD_department,
            KEYWORD_position,
            Columns_department,
            Columns_position,
            KEYWORD_position_LIST,
            KEYWORD_department_LIST,
            Formattrt_department,
            Formattrt_position,

            model,
            DEFAULT_VALUE_D,
            DEFAULT_VALUE_P,
            TypeSource_department,
            TypeSource_position;


        var mDepartID = 0;
        var mPositionID = 0;
        HTML = {
            TreeItemNode: [
                '<li data-titie="{{ID}}"  data-value="{{ID}}"  >',
                '<span style="vertical-align:top;Color:{{ColorText}}" data-value="{{ID}}" data-core="{{ColorText}}" >{{Name}}</span> ',
                '{{Items}}',
                '</li>',
            ].join(""),

            ImSon: [
                '<li data-titie="{{ID}}"  data-value="{{ID}}" data-son="woshierzi">',
                '<span style="vertical-align:top;Color:{{ColorText}}" data-value="{{ID}}" data-core="{{ColorText}}">{{Name}}</span> ',
                '</li>',
            ].join(""),

            TablePosition: [
                '<tr data-color="">',
                '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td>',
                '<td style="min-width: 50px" data-title="Name" data-value="{{Name}}">{{Name}}</td>',
                '<td style="min-width: 50px" data-title="ParentID" data-value="{{ParentID}}">{{ParentID}}</td>',
                '<td style="min-width: 50px" data-title="DepartmentID" data-value="{{DepartmentID}}">{{DepartmentID}}</td>',
                '<td style="min-width: 50px" data-title="DutyID" data-value="{{DutyID}}">{{DutyID}}</td>',
                '<td style="min-width: 50px" data-title="OperatorID" data-value="{{OperatorID}}">{{OperatorID}}</td>',
                '<td style="min-width: 50px" data-title="EditTime " data-value="{{EditTime }}">{{EditTime }}</td>',
                '<td style="min-width: 50px" data-title="Active" data-value="{{Active}}"><span class="badge lmvt-badge {{ClassBadge}}">{{Badge}}</span>{{Active}}</td>',
                '<td style="max-width: 150px;min-width:60px" data-title="Handle" data-value="{{ID}}"><div class="row">',
                '<div class="col-md-6 {{ISAllowed}}">{{ISAllowedText}}</div>',
                '<div class="col-md-6 lmvt-do-info lmvt-reset">修改</div>',
                // '<div class="col-md-4 lmvt-do-forbidden">删除</div>',
                '</td>',
                '</tr>',
            ].join(""),

            TableDepartment: [
                '<tr data-color="">',
                '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td>',
                '<td style="min-width: 50px" data-title="Name" data-value="{{Name}}">{{Name}}</td>',
                '<td style="min-width: 50px" data-title="ParentID" data-value="{{ParentID}}">{{ParentID}}</td>',
                '<td style="min-width: 50px" data-title="Type" data-value="{{Type}}">{{Type}}</td>',
                '<td style="min-width: 50px" data-title="OperatorID" data-value="{{OperatorID}}">{{OperatorID}}</td>',
                '<td style="min-width: 50px" data-title="EditTime" data-value="{{EditTime}}">{{EditTime}}</td>',
                '<td style="min-width: 50px" data-title="Active" data-value="{{Active}}"><span class="badge lmvt-badge {{ClassBadge}}">{{Badge}}</span>{{Active}}</td>',
                '<td style="max-width: 80px" data-title="Handle" data-value="{{ID}}"><div class="row">',
                '<div class="col-md-6 {{ISAllowed}}">{{ISAllowedText}}</div>',
                '<div class="col-md-6 lmvt-do-info lmvt-reset">修改</div>',
                // '<div class="col-md-4 lmvt-do-forbidden">删除</div>',
                '</td>',
                '</tr>',
            ].join(""),
        };
        Position_LIST = [];
        Department_LIST = [];
        Formattrt_department = {};
        Formattrt_position = {};
        DEFAULT_VALUE_D = {
            Name: "",
            // ParentID: 0,
            Type: 0,
            //Active: true
        };
        DEFAULT_VALUE_P = {
            Name: "",
            DepartmentID: 0,
            // ParentID: 0,
            DutyID: 0,
            //Active: true
        };
        (function () {
            KEYWORD_department_LIST = [
                "ID|部门编号",
                "Name|部门名称",
                "ParentID|上级部门|ArrayOne",
                "Type|类别|ArrayOne",
                "Active|状态|ArrayOne",
                "OperatorID|人员|ArrayOne",
                "EditTime|时间|DateTime",
            ];

            KEYWORD_department = {};
            Columns_department = [];

            TypeSource_department = {
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
                ParentID: [{
                    name: "无",
                    value: 0,
                }],
                OperatorID: [{
                    name: "无",
                    value: 0,
                }],
                Type: [{
                    name: "-",
                    value: 0,
                }, {
                    name: "部门",
                    value: 1,
                },
                    // , {
                    //     name: "工区",
                    //     value: 2
                    // }, {
                    //     name: "班组",
                    //     value: 3
                    // },
                    // {
                    //     name: "供应商",
                    //     value: 11
                    // }
                ],
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
        (function () {

            KEYWORD_position_LIST = [
                "ID|岗位编号",
                "Name|岗位名称",
                "DepartmentID|部门名称|ArrayOne",
                "PrevDepartmentID|上级岗位部门|ArrayOneControl",
                "ParentID|上级岗位|ArrayOneControl|PrevDepartmentID",
                "DutyID|岗位职责|ArrayOne",
                "Active|状态|ArrayOne",
                "OperatorID|人员|ArrayOne",
                "EditTime|时间|DateTime",
            ];

            KEYWORD_position = {};

            //Columns_position = [];


            TypeSource_position = {
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
                ParentID: [{
                    name: "无",
                    value: 0,
                    far: 0,
                }],
                DepartmentID: [{
                    name: "无",
                    value: 0,
                    far: 0,
                }],
                PrevDepartmentID: [{
                    name: "无",
                    value: 0,
                    far: 0,
                }],
                OperatorID: [{
                    name: "无",
                    value: 0,
                }],
                DutyID: [{
                    name: "无",
                    value: 0,
                }, {
                    name: "经理",
                    value: 4,
                }, {
                    name: "主管",
                    value: 2,
                }, {
                    name: "调度",
                    value: 3,
                }, {
                    name: "班长",
                    value: 1,
                }, {
                    name: "组员",
                    value: 5,
                }],
            };
            $.each(KEYWORD_position_LIST, function (i, item) {
                var detail = item.split("|");
                KEYWORD_position[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined,
                };
                var _column = {
                    field: detail[0],
                    title: detail[1],
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                };
                if (detail.length > 2) {
                    Formattrt_position[detail[0]] = $com.util.getFormatter(TypeSource_position, detail[0], detail[2]);
                }
            });

        })();

        model = $com.Model.create({
            name: '部门管理',

            type: $com.Model.MAIN,

            configure: function () {
                this.run();
            },

            events: function () {

                $("body").delegate("#depTree li span", "click", function () {


                    var $this = $(this);
                    mDepartID = Number($this.attr("data-value"));
                    var _color = $this.attr("data-core");

                    //alert(mDepartID);


                    $("#depTree li span").each(function (i, item) {
                        var $item = $(item);
                        if ($item.attr("data-core") == 'black' || $item.attr("data-core") == 'yellowgreen') {
                            $item.css("color", $item.attr("data-core"));
                            return true;

                        } else {
                            $item.css("color", "black");
                        }
                    });
                    $this.css("color", "blue");
                    model.com.refresh();
                    return false;
                });


                $("body").delegate("#PositionTree li span", "click", function () {


                    var $this = $(this);
                    mPositionID = Number($this.attr("data-value"));
                    //alert(mPositionID);
                    $("#PositionTree li span").each(function (i, item) {
                        var $item = $(item);
                        if ($item.attr("data-core") == 'black' || $item.attr("data-core") == 'yellowgreen') {
                            $item.css("color", $item.attr("data-core"));
                            return true;

                        } else {
                            $item.css("color", "black");
                        }
                    });
                    $this.css("color", "blue");

                    model.com.refresh();
                    return false;
                });


                (function () {
                    //展开部门
                    $("body").delegate("li.femi-department-show", "click", function () {
                        $(".l-containe-canvas-table-position").hide();
                        $(".l-containe-canvas-table-department").show();
                        $(".l-container-crossZ").hide();

                        var _zaceDe = $com.util.Clone(AllDepartmentTree);
                        var _departTree = model.com.buildTreePro(_zaceDe);

                        model.com.renderDepartTree(_departTree);

                    });

                    //展开岗位
                    $("body").delegate("li.femi-position-show", "click", function () {
                        $(".l-containe-canvas-table-department").hide();
                        $(".l-containe-canvas-table-position").show();
                        $(".l-container-crossZ").hide();

                        var _zacePo = $com.util.Clone(AllPositionTree);
                        var _positionTree = model.com.buildTreePro(_zacePo);

                        model.com.renderPositionTree(_positionTree);
                    });
                    //显示结构图
                    $("body").delegate("li.femi-canvas-show", "click", function () {

                        //$(".l-containe-canvas-table").css("height", "60%");
                        $(".l-containe-canvas-table").hide();
                        $(".l-container-canvas").show();
                        $(".l-container-crossZ").hide();

                    });


                    //显示结构图
                    $("body").delegate("#femi-crossZ-showZace", "click", function () {

                        //$(".l-containe-canvas-table").css("height", "60%");
                        $(".l-containe-canvas-table").hide();
                        $(".l-container-canvas").show();
                        $(".l-container-crossZ").hide();

                    });


                    //显示结构图
                    $("body").delegate("#femi-canvas-showZace", "click", function () {

                        //$(".l-containe-canvas-table").css("height", "60%");
                        $(".l-containe-canvas-table").hide();
                        $(".l-container-canvas").hide();
                        $(".l-container-crossZ").show();

                        var setting = {
                            treeObj: null,
                            check: {
                                enable: true,
                            },
                            data: {
                                simpleData: {
                                    enable: true,
                                    idKey: "id",
                                    pIdKey: "pId",
                                    rootPId: 0,
                                },
                            },
                            callback: {
                                onCheck: zTreeOnCheck,
                            },
                            view: {
                                showLine: false,
                                showIcon: false,
                                showTitle: false,
                                // fontCss : {color:"red"}
                            },

                        };
                        var zNodes = [];
                        var tempMode = {
                            "id": 0,
                            "pId": "",
                            "securityOptions": [],
                            "corpCode": "",
                            "PERMITID": "",
                            "name": "",
                            "PROJECTNAME": "",
                            "corpId": "",
                        };

                        for (var i = 0; i < AllDepartment.length; i++) {

                            var mode = $com.util.Clone(tempMode);
                            if (AllDepartment[i].Active) {
                                if (AllDepartment[i].ParentID > 0) {
                                    mode.id = AllDepartment[i].ID;
                                    mode.pId = AllDepartment[i].ParentID;
                                    mode.name = AllDepartment[i].Name;

                                } else {
                                    mode.id = AllDepartment[i].ID;
                                    mode.pId = "";
                                    mode.name = AllDepartment[i].Name;

                                }
                                zNodes.push(mode);

                            }

                        }


                        var code;

                        $.fn.zTree.init($("#treeDemo"), setting, zNodes);
                        setCheck();
                        $("#py").bind("change", setCheck);
                        $("#sy").bind("change", setCheck);
                        $("#pn").bind("change", setCheck);
                        $("#sn").bind("change", setCheck);
                        $('.ztree li span.button.switch').click(function () {
                            minejs();
                        });

                        function setCheck() {
                            var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
                                type = {Y: "ps", N: "ps"};
                            zTree.setting.check.chkboxType = type;
                            zTree.expandAll(true); //全部展开
                            showCode('setting.check.chkboxType = { "Y" : "' + type.Y + '", "N" : "' + type.N + '" };');
                            minejs();
                        }

                        function showCode(str) {
                            if (!code) code = $("#code");
                            code.empty();
                            code.append("<li>" + str + "</li>");
                        }

                        function zTreeOnCheck(event, treeId, treeNode) {
                            getSelectedNodes();
                            //当前被选中对象携带参数
                            // console.log(treeNode.tId + ", " + treeNode.name + "," + treeNode.checked);
                        };


                        function getSelectedNodes() {
                            // var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                            // var selectedNode = zTree.getCheckedNodes();

                            // 获取当前被勾选的节点集合
                            var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
                            var nodes = treeObj.getCheckedNodes(true);
                        }


                        function minejs() {

                        }


                        $('.tabnav li').click(function () {
                            $('.tabnav li').removeClass('active');
                            $(this).addClass('active');
                            var pd = $(this).index();
                            $('.tabcon li').hide();
                            $('.tabcon li').eq(pd).show();
                        });

                    });


                    //隐藏结构图
                    $("body").delegate("li.femi-canvas-hide", "click", function () {

                        //$(".l-containe-canvas-table").css("height", "100%");
                        $(".l-containe-canvas-table").show();
                        $(".l-container-canvas").hide();
                    });
                    //隐藏结构图
                    $("body").delegate("#femi-crossZ-hide", "click", function () {

                        //$(".l-containe-canvas-table").css("height", "100%");
                        $(".l-containe-canvas-table").show();
                        $(".l-container-canvas").hide();
                    });

                    $("body").delegate("#femi-canvas-hide", "click", function () {

                        //$(".l-containe-canvas-table").css("height", "100%");
                        $(".l-containe-canvas-table").show();
                        $(".l-container-canvas").hide();
                    });

                })();

                //岗位导航栏按钮
                (function () {
                    $("body").delegate("#l-add-position", "click", function () {

                        //将Json数据中的数据值改成对应默认值，然后传入进去
                        $("body").append($com.modal.show(DEFAULT_VALUE_P, KEYWORD_position, "新增岗位", function (rst) {
                            //调用插入函数然后用load刷新数据源 
                            if (!rst || $.isEmptyObject(rst))
                                return false;
                            var _data = {
                                ID: 0,
                                Active: 0,
                                Name: rst.Name,
                                DepartmentID: Number(rst.DepartmentID),
                                ParentID: mPositionID,
                                DutyID: Number(rst.DutyID), //相当于部门
                                SonList: [],
                            };
                            for (var i = 0; i < Position_LIST_GW.length; i++) {
                                if (rst.Name == Position_LIST_GW[i].Name) {
                                    alert("新增岗位已存在！");
                                    return false;
                                }
                            }
                            $com.util.deleteLowerProperty(_data);
                            model.com.postPosition({
                                data: _data,
                            }, function (res) {
                                alert("新增成功！！");
                                //Refresh("getPosition");
                                model.com.refresh();
                            });
                            return false;
                        }, TypeSource_position));
                    });

                    //修改单条
                    $("body").delegate(".l-containe-canvas-table-position .lmvt-reset", "click", function () {

                        var $this = $(this),
                            wID = Number($this.closest("td").attr("data-value"));

                        var SelectData = AllPosition.filter((item) => {
                            return item.ID == wID;
                        });

                        var default_value = {
                            Name: SelectData[0].Name,
                            DutyID: SelectData[0].DutyID,
                            //PrevDepartmentID: SelectData[0].PrevDepartmentID,
                            //Active: SelectData[0].Active,
                            DepartmentID: SelectData[0].DepartmentID,
                        };


                        $("body").append($com.modal.show(default_value, KEYWORD_position, "修改", function (rst) {
                            //调用修改函数
                            if (!rst || $.isEmptyObject(rst))
                                return;

                            SelectData[0].Name = rst.Name;
                            SelectData[0].DutyID = Number(rst.DutyID);
                            SelectData[0].DepartmentID = Number(rst.DepartmentID);


                            $com.util.deleteLowerProperty(SelectData[0]);
                            model.com.postPosition({
                                data: SelectData[0],
                            }, function (res) {
                                alert("修改成功！！");
                                //Refresh("getPosition");
                                model.com.refresh();
                            });

                        }, TypeSource_position));
                    });

                    $("body").delegate("#l-revise-position", "click", function () {

                        var SelectData = $com.table.getSelectionData($(".l-containe-canvas-table .l-position-body"), "ID", AllPosition);
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
                            DutyID: SelectData[0].DutyID,
                            //PrevDepartmentID: SelectData[0].PrevDepartmentID,
                            //Active: SelectData[0].Active,
                            DepartmentID: SelectData[0].DepartmentID,
                        };


                        $("body").append($com.modal.show(default_value, KEYWORD_position, "修改", function (rst) {
                            //调用修改函数
                            if (!rst || $.isEmptyObject(rst))
                                return;

                            SelectData[0].Name = rst.Name;
                            SelectData[0].DutyID = Number(rst.DutyID);
                            SelectData[0].DepartmentID = Number(rst.DepartmentID);


                            $com.util.deleteLowerProperty(SelectData[0]);
                            model.com.postPosition({
                                data: SelectData[0],
                            }, function (res) {
                                alert("修改成功！！");
                                //Refresh("getPosition");
                                model.com.refresh();
                            });

                        }, TypeSource_position));
                    });

                    //删除单条
                    $("body").delegate(".l-containe-canvas-table-position .lmvt-do-forbidden", "click", function () {

                        var $this = $(this),
                            wID = Number($this.closest("td").attr("data-value"));

                        var SelectData = AllPosition.filter((item) => {
                            return item.ID == wID;
                        });

                        if (!confirm("已选择名称为 [" + SelectData[0].Name + "] 的数据，确定将其删除？")) {
                            return;
                        }

                        model._data.source_posn = DeleteSourceItem(model._data.source_posn, SelectData);
                        model.com.postPosition({
                            data: model._data.source_posn,
                        }, function (res) {
                            alert("删除成功！！");
                            model.com.refresh();
                            //Refresh("getPosition");
                        });
                        //调用删除函数然后用load刷新数据源  
                    });

                    $("body").delegate("#l-delete-position", "click", function () {

                        var SelectData = $com.table.getSelectionData($(".l-containe-canvas-table .l-position-body"), "ID", AllPosition);
                        if (!SelectData || !SelectData.length) {
                            alert("至少选择一行数据再试！");
                            return;
                        }
                        // if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {
                        //     return;
                        // }

                        model._data.source_posn = DeleteSourceItem(model._data.source_posn, SelectData);
                        model.com.postPosition({
                            data: model._data.source_posn,
                        }, function (res) {
                            alert("删除成功！！");
                            model.com.refresh();
                            //Refresh("getPosition");
                        });
                        //调用删除函数然后用load刷新数据源  
                    });
                    $("body").delegate("#l-freshen-position", "click", function () {

                        //Refresh("getPosition");
                        boolDepart = true;
                        mPositionID = 0;
                        model.com.refresh();
                        // var _positionTree = model.com.buildTreePro(AllPositionTree);

                        // model.com.renderPositionTree(_positionTree);
                    });

                    //禁用单条
                    $("body").delegate(".l-containe-canvas-table-position .lmvt-allowed-delete", "click", function () {

                        var $this = $(this),
                            wID = Number($this.closest("td").attr("data-value"));

                        var SelectData = AllPosition.filter((item) => {
                            return item.ID == wID;
                        });

                        for (var i = 0; i < SelectData.length; i++) {
                            model.com.buildTreeProItem(SelectData[i], AllPosition);
                            $com.util.deleteLowerProperty(SelectData[i]);
                        }

                        var _list = [];
                        // for (var m = 0; m < SelectData.length; m++) {
                        //     SelectData[m];

                        // }

                        _list = SelectData.concat(model.com.buildTreeToList(SelectData));
                        model.com.ActivePosition({
                            Active: 0,
                            data: _list,
                        }, function (res) {
                            alert("禁用成功！");
                            //Refresh("getDepartment");
                            model.com.refresh();
                        });
                        //调用删除函数然后用load刷新数据源 
                    });

                    $("body").delegate("#l-forbidder-position", "click", function () {

                        var SelectData = $com.table.getSelectionData($(".l-containe-canvas-table .l-position-body"), "ID", AllPosition);
                        if (!SelectData || !SelectData.length) {
                            alert("请先选择一行数据再试！");
                            return;
                        }
                        // // if (!confirm("已选择" + SelectData.length + "条数据，确定将其禁用？")) {
                        // //     return;
                        // // }
                        // for (var i = 0; i < SelectData.length; i++) {
                        //     $com.util.deleteLowerProperty(SelectData[i]);
                        // }
                        for (var i = 0; i < SelectData.length; i++) {
                            model.com.buildTreeProItem(SelectData[i], AllPosition);
                            $com.util.deleteLowerProperty(SelectData[i]);
                        }

                        var _list = [];
                        // for (var m = 0; m < SelectData.length; m++) {
                        //     SelectData[m];

                        // }

                        _list = SelectData.concat(model.com.buildTreeToList(SelectData));
                        model.com.ActivePosition({
                            Active: 0,
                            data: _list,
                        }, function (res) {
                            alert("禁用成功！");
                            //Refresh("getDepartment");
                            model.com.refresh();
                        });
                        //调用删除函数然后用load刷新数据源 
                    });

                    //启用单条
                    $("body").delegate(".l-containe-canvas-table-position .lmvt-do-active", "click", function () {

                        var $this = $(this),
                            wID = Number($this.closest("td").attr("data-value"));

                        var SelectData = AllPosition.filter((item) => {
                            return item.ID == wID;
                        });

                        var _list = [];
                        for (var i = 0; i < SelectData.length; i++) {
                            $com.util.deleteLowerProperty(SelectData[i]);
                            _list = _list.concat(model.com.GetPrevList(SelectData[i], AllPosition, SelectData));
                        }

                        // for (var i = 0; i < _list.length; i++) {
                        //     $com.util.deleteLowerProperty(_list[i]);
                        // }
                        model.com.ActivePosition({
                            Active: 1,
                            data: _list,
                        }, function (res) {
                            alert("启用成功！");
                            //Refresh("getDepartment");
                            model.com.refresh();
                        });
                    });

                    $("body").delegate("#l-active-position", "click", function () {

                        var SelectData = $com.table.getSelectionData($(".l-containe-canvas-table .l-position-body"), "ID", AllPosition);
                        if (!SelectData || !SelectData.length) {
                            alert("请先选择一行数据再试！");
                            return;
                        }
                        // if (!confirm("已选择" + SelectData.length + "条数据，确定将其启用？")) {
                        //     return;
                        // }
                        //找到上级数据

                        var _list = [];
                        for (var i = 0; i < SelectData.length; i++) {
                            $com.util.deleteLowerProperty(SelectData[i]);
                            _list = _list.concat(model.com.GetPrevList(SelectData[i], AllPosition, SelectData));
                        }

                        // for (var i = 0; i < _list.length; i++) {
                        //     $com.util.deleteLowerProperty(_list[i]);
                        // }
                        model.com.ActivePosition({
                            Active: 1,
                            data: _list,
                        }, function (res) {
                            alert("启用成功！");
                            //Refresh("getDepartment");
                            model.com.refresh();
                        });


                    });
                })();

                function GetDepartmentID(_source, item_id) {
                    var id = 0;
                    if (!_source)
                        _source = [];
                    $.each(_source, function (i, item) {
                        if (item.ID == item_id)
                            id = item.DepartmentID;
                    });
                    return id;
                }

                //岗位列表中部门ID设置
                function SetDepartmentID(_source, item_id, d_id) {
                    if (!_source)
                        _source = [];
                    $.each(_source, function (i, item) {
                        if (item.ID == item_id) {
                            item.DepartmentID = d_id;
                            if (item.SonList)
                                item.SonList = _Set_DepartmentID(item.SonList, d_id);
                        } else if (item.SonList)
                            item.SonList = SetDepartmentID(item.SonList, item_id, d_id);
                    });
                    return _source;
                }

                //设置岗位子项部门ID
                function _Set_DepartmentID(_source, d_id) {
                    if (!_source)
                        _source = [];
                    $.each(_source, function (i, item) {

                        item.DepartmentID = d_id;
                        if (item.SonList && item.SonList)
                            item.SonList = _Set_DepartmentID(item.SonList, d_id);

                    });
                    return _source;
                }

                function GetMaxID(_source) {
                    var id = 0;
                    if (!_source)
                        _source = [];
                    $.each(_source, function (i, item) {
                        if (item.ID > id)
                            id = item.ID;
                    });
                    return id + 1;
                }

                function SetSourceItem_D(_source, set_data) {
                    if (!_source || !_source.length) {
                        _source = [set_data];
                        return _source;
                    }

                    $.each(_source, function (i, item) {

                        if (item.ID == set_data.ParentID) {
                            if (!item.SonList)
                                item.SonList = [];
                            item.SonList.push(set_data);
                        } else if (item.SonList && item.SonList.length) {
                            item.SonList = SetSourceItem_D(item.SonList, set_data);
                        }
                    });
                    return _source;
                }

                function DeleteSourceItem(_source, set_data) {
                    if (!_source)
                        _source = [];
                    if (!set_data)
                        set_data = [];
                    var rst = [];
                    $.each(_source, function (i, item) {
                        var NotOWn = true;
                        $.each(set_data, function (m, item_m) {
                            if (item.ID == item_m.ID)
                                NotOWn = false;
                        });
                        if (NotOWn && item.SonList) {

                            item.SonList = DeleteSourceItem(item.SonList, set_data);

                        }
                        if (NotOWn)
                            rst.push(item);
                    });
                    return rst;
                }

                function ActiveSourceItem(_source, set_data, active) {
                    if (!_source)
                        _source = [];
                    if (!set_data)
                        set_data = [];

                    $.each(_source, function (i, item) {

                        $.each(set_data, function (m, item_m) {
                            if (item.ID == item_m.ID) {
                                item.Active = active;
                            }
                        });
                        if (item.SonList) {

                            item.SonList = ActiveSourceItem(item.SonList, set_data, active);

                        }
                    });
                    return _source;
                }

                function SetSourceItem_P(_source, set_data) {
                    if (!_source || !_source.length) {
                        _source = [set_data];
                        return _source;
                    }

                    $.each(_source, function (i, item) {

                        if (item.ID == set_data.ParentID) {
                            if (!item.SonList || !item.SonList)
                                item.SonList = [];
                            item.SonList.push(set_data);
                        } else if (item.SonList && item.SonList.length) {
                            item.SonList = SetSourceItem_P(item.SonList, set_data);

                        }
                    });
                    return _source;
                }

                function GetContainID(list, item_id) {
                    $.each(list, function (i, item) {

                        if (item.ID == item_id) {
                            return 1;
                        } else {
                            if (item.SonList) {
                                if (GetContainID(item.SonList, item_id) == 1)
                                    return 1;
                            }
                        }
                    });
                    return 0;
                }

                function Refresh(fnNmae) {
                    model.com[fnNmae]({}, model.com.responseHandler[fnNmae]);
                }

                //部门导航栏按钮
                (function () {
                    $("body").delegate("#l-add-department", "click", function () {
                        //将Json数据中的数据值改成对应默认值，然后传入进去
                        $("body").append($com.modal.show(DEFAULT_VALUE_D, KEYWORD_department, "新增部门", function (rst) {
                            //调用插入函数然后用load刷新数据源 

                            if (!rst || $.isEmptyObject(rst))
                                return false;
                            var _data = {
                                ID: 0,
                                Name: rst.Name,
                                ParentID: mDepartID,
                                SonList: [],
                                Active: 0,
                                Type: Number(rst.Type),
                            };
                            for (var i = 0; i < Department_LIST_BM.length; i++) {
                                if (rst.Name == Department_LIST_BM[i].Name) {
                                    alert("新增部门已存在！");
                                    return false;
                                }
                            }
                            //if (_data.ParentID > 0) {
                            //    model._data.source_deps = SetSourceItem_D(model._data.source_deps, _data);
                            //} else {
                            //    if (!model._data.source_deps)
                            //        model._data.source_deps = [];
                            //    model._data.source_deps.push(_data);
                            //}

                            $com.util.deleteLowerProperty(_data);
                            model.com.postDepartment({
                                data: _data,
                            }, function (res) {
                                alert("新增成功！！");
                                model.com.refresh();
                                //Refresh("getDepartment");
                            });
                        }, TypeSource_department));
                    });

                    //修改单条
                    $("body").delegate(".l-containe-canvas-table-department .lmvt-reset", "click", function (evet) {

                        event.stopPropagation();

                        var $this = $(this),
                            wID = Number($this.closest("td").attr("data-value"));

                        var SelectData = AllDepartment.filter((item) => {
                            return item.ID == wID;
                        });

                        var default_value = {
                            Name: SelectData[0].Name,
                            // ParentID: SelectData[0].ParentID,
                            Type: SelectData[0].Type,
                        };

                        $("body").append($com.modal.show(default_value, KEYWORD_department, "修改", function (rst) {
                            //调用修改函数
                            if (!rst || $.isEmptyObject(rst))
                                return;

                            SelectData[0].Name = rst.Name;
                            // SelectData[0].ParentID = Number(rst.ParentID);
                            SelectData[0].Type = Number(rst.Type);
                            $com.util.deleteLowerProperty(SelectData[0]);

                            //model._data.source_deps = SetDepartmentID(model._data.source_deps, SelectData[0].ID, SelectData[0].ParentID);

                            //model._data.source_deps = DeleteSourceItem(model._data.source_deps, SelectData[0]);

                            //model._data.source_deps.push(_data);

                            model.com.postDepartment({
                                data: SelectData[0],
                            }, function (res) {
                                alert("修改成功！！");
                                model.com.refresh();
                                //Refresh("getDepartment");
                            });

                        }, TypeSource_department));
                    });

                    $("body").delegate("#l-revise-department", "click", function () {

                        var SelectData = $com.table.getSelectionData($(".l-containe-canvas-table .l-department-body"), "ID", AllDepartment);
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
                            // ParentID: SelectData[0].ParentID,
                            Type: SelectData[0].Type,

                        };

                        //var TypeMo = $com.util.Clone(TypeSource_department),
                        //    count;

                        //$.each(TypeMo.ParentID, function (i, item) {
                        //    if (item.ID == SelectData[0].ID) {
                        //        count = i;
                        //        return false;
                        //    }

                        //});
                        //TypeMo.ParentID.splice(count, 1);

                        $("body").append($com.modal.show(default_value, KEYWORD_department, "修改", function (rst) {
                            //调用修改函数
                            if (!rst || $.isEmptyObject(rst))
                                return;


                            SelectData[0].Name = rst.Name;
                            // SelectData[0].ParentID = Number(rst.ParentID);
                            SelectData[0].Type = Number(rst.Type);
                            $com.util.deleteLowerProperty(SelectData[0]);
                            //model._data.source_deps = SetDepartmentID(model._data.source_deps, SelectData[0].ID, SelectData[0].ParentID);

                            //model._data.source_deps = DeleteSourceItem(model._data.source_deps, SelectData[0]);

                            //model._data.source_deps.push(_data);

                            model.com.postDepartment({
                                data: SelectData[0],
                            }, function (res) {
                                alert("修改成功！！");
                                model.com.refresh();
                                //Refresh("getDepartment");
                            });

                        }, TypeSource_department));
                    });

                    //删除单条
                    $("body").delegate(".l-containe-canvas-table-department .lmvt-do-forbidden", "click", function () {


                        var $this = $(this),
                            wID = Number($this.closest("td").attr("data-value"));

                        var SelectData = AllDepartment.filter((item) => {
                            return item.ID == wID;
                        });

                        if (!confirm("已选择名称 [" + SelectData[0].Name + "] 的数据，确定将其删除？")) {
                            return;
                        }

                        model._data.source_deps = DeleteSourceItem(model._data.source_deps, SelectData);
                        model.com.postDepartment({
                            data: model._data.source_deps,
                        }, function (res) {
                            alert("删除成功！！");
                            model.com.refresh();
                            //Refresh("getDepartment");
                        });
                        //调用删除函数然后用load刷新数据源 

                    });

                    $("body").delegate("#l-delete-department", "click", function () {

                        var SelectData = $com.table.getSelectionData($(".l-containe-canvas-table .l-department-body"), "ID", AllDepartment);
                        if (!SelectData || !SelectData.length) {
                            alert("至少选择一行数据再试！");
                            return;
                        }

                        // if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {
                        //     return;
                        // }

                        model._data.source_deps = DeleteSourceItem(model._data.source_deps, SelectData);
                        model.com.postDepartment({
                            data: model._data.source_deps,
                        }, function (res) {
                            alert("删除成功！！");
                            model.com.refresh();
                            //Refresh("getDepartment");
                        });
                        //调用删除函数然后用load刷新数据源 

                    });
                    $("body").delegate("#l-freshen-department", "click", function () {

                        // boolDepart = true;
                        // mDepartID = 0;
                        // model.com.refresh();
                        $("#depTree").treeview('expandAll', {silent: true});

                        //Refresh("getDepartment");
                    });

                    $("body").delegate("#lmvt-close-department", "click", function () {

                        // boolDepart = true;
                        // mDepartID = 0;
                        // model.com.refresh();
                        $("#depTree").treeview('collapseAll', {silent: true});

                        //Refresh("getDepartment");
                    });


                    //禁用单条
                    $("body").delegate(".l-containe-canvas-table-department .lmvt-allowed-delete", "click", function () {


                        var $this = $(this),
                            wID = Number($this.closest("td").attr("data-value"));

                        var SelectData = AllDepartment.filter((item) => {
                            return item.ID == wID;
                        });

                        for (var i = 0; i < SelectData.length; i++) {
                            model.com.buildTreeProItem(SelectData[i], AllDepartment);
                            $com.util.deleteLowerProperty(SelectData[i]);
                        }

                        var _list = [];
                        // for (var m = 0; m < SelectData.length; m++) {
                        //     SelectData[m];

                        // }

                        _list = SelectData.concat(model.com.buildTreeToList(SelectData));
                        model.com.ActiveDepartment({
                            Active: 0,
                            data: _list,
                        }, function (res) {
                            alert("禁用成功！");
                            //Refresh("getDepartment");
                            model.com.refresh();
                        });

                    });

                    $("body").delegate("#l-forbidder-department", "click", function () {

                        var SelectData = $com.table.getSelectionData($(".l-containe-canvas-table .l-department-body"), "ID", AllDepartment);
                        if (!SelectData || !SelectData.length) {
                            alert("请先选择一行数据再试！");
                            return;
                        }
                        // if (!confirm("已选择" + SelectData.length + "条数据，确定将其禁用？")) {
                        //     return;
                        // }

                        //找到下面的数据


                        for (var i = 0; i < SelectData.length; i++) {
                            model.com.buildTreeProItem(SelectData[i], AllDepartment);
                            $com.util.deleteLowerProperty(SelectData[i]);
                        }

                        var _list = [];
                        // for (var m = 0; m < SelectData.length; m++) {
                        //     SelectData[m];

                        // }

                        _list = SelectData.concat(model.com.buildTreeToList(SelectData));
                        model.com.ActiveDepartment({
                            Active: 0,
                            data: _list,
                        }, function (res) {
                            alert("禁用成功！");
                            //Refresh("getDepartment");
                            model.com.refresh();
                        });

                    });

                    //启用单条
                    $("body").delegate(".l-containe-canvas-table-department .lmvt-do-active", "click", function () {

                        var $this = $(this),
                            wID = Number($this.closest("td").attr("data-value"));

                        var SelectData = AllDepartment.filter((item) => {
                            return item.ID == wID;
                        });

                        var _list = [];
                        for (var i = 0; i < SelectData.length; i++) {
                            $com.util.deleteLowerProperty(SelectData[i]);
                            _list = _list.concat(model.com.GetPrevList(SelectData[i], AllDepartment, SelectData));
                        }

                        //_list=_list.concat(SelectData);

                        model.com.ActiveDepartment({
                            Active: 1,
                            data: _list,
                        }, function (res) {
                            alert("启用成功！");
                            //Refresh("getDepartment");
                            model.com.refresh();
                        });
                        //调用删除函数然后用load刷新数据源 

                    });

                    $("body").delegate("#l-active-department", "click", function () {

                        var SelectData = $com.table.getSelectionData($(".l-containe-canvas-table .l-department-body"), "ID", AllDepartment);
                        if (!SelectData || !SelectData.length) {
                            alert("请先选择一行数据再试！");
                            return;
                        }
                        // if (!confirm("已选择" + SelectData.length + "条数据，确定将其启用？")) {
                        //     return;
                        // }

                        //找到上级数据

                        var _list = [];
                        for (var i = 0; i < SelectData.length; i++) {
                            $com.util.deleteLowerProperty(SelectData[i]);
                            _list = _list.concat(model.com.GetPrevList(SelectData[i], AllDepartment, SelectData));
                        }

                        //_list=_list.concat(SelectData);

                        model.com.ActiveDepartment({
                            Active: 1,
                            data: _list,
                        }, function (res) {
                            alert("启用成功！");
                            //Refresh("getDepartment");
                            model.com.refresh();
                        });
                        //调用删除函数然后用load刷新数据源 

                    });
                })();
                //Enter触发模糊查询事件
                $(document).keyup(function (event) {
                    if (event.keyCode == 13) {
                        var value = $("#zace-search-BM").val();
                        if (value == undefined || value == "" || value.trim().length < 1)
                            $(".l-department-body ").children("tr").show();
                        else
                            $com.table.filterByLikeString($(".l-department-body"), Department_LIST_BM, value, "ID");
                    }
                });
                // 部门查询
                $("body").delegate("#zace-Device-search-BM", "click", function () {
                    var value = $("#zace-search-BM").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $(".l-department-body").children("tr").show();
                    else
                        $com.table.filterByLikeString($(".l-department-body"), Department_LIST_BM, value, "ID");
                });

                //Enter触发模糊查询事件
                $(document).keyup(function (event) {
                    if (event.keyCode == 13) {
                        var value = $("#zace-search-GW").val();
                        if (value == undefined || value == "" || value.trim().length < 1)
                            $(".l-position-body").children("tr").show();
                        else
                            $com.table.filterByLikeString($(".l-position-body"), Position_LIST_GW, value, "ID");
                    }
                });
                // 岗位查询
                $("body").delegate("#zace-Device-search-GW", "click", function () {
                    var value = $("#zace-search-GW").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $(".l-position-body").children("tr").show();
                    else
                        $com.table.filterByLikeString($(".l-position-body"), Position_LIST_GW, value, "ID");
                });

            },

            run: function () {

                boolDepart = true;
                model._data = {};

                model.com.getUser({}, function (res) {
                    if (!res)
                        return;
                    $.each(res.list, function (i, item) {
                        TypeSource_department.OperatorID.push({
                            name: item.Name,
                            value: item.ID,

                        });

                    });
                    TypeSource_position.OperatorID = TypeSource_department.OperatorID;
                    model.com.refresh();


                });


            },

            com: {
                ActivePosition: function (data, fn, context) {
                    var d = {
                        $URI: "/Department/ActivePosition",
                        $TYPE: "post",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                ActiveDepartment: function (data, fn, context) {
                    var d = {
                        $URI: "/Department/ActiveDepartment",
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
                postDepartment: function (data, fn, context) {
                    var d = {
                        $URI: "/Department/UpdateDepartment",
                        $TYPE: "post",
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                postPosition: function (data, fn, context) {
                    var d = {
                        $URI: "/Department/UpdatePosition",
                        $TYPE: "post",
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                renderDepartTree: function (list) {
                    //list  ： Type List

                    // model.com.fullItems(list);

                    // $("#depTree").html($com.util.template(list, HTML.TreeItemNode));
                    // $("#depTree").treeview({ collapsed: true });


                    model.com.fullItemTest(list);

                    $("#depTree").treeview({
                        // color: "#428bca",

                        // expandIcon: "glyphicon glyphicon-stop",
                        // collapseIcon: "glyphicon glyphicon-unchecked",
                        color: "black",
                        expandIcon: "glyphicon glyphicon-plus",
                        collapseIcon: "glyphicon glyphicon-minus",

                        nodeIcon: "glyphicon glyphicon-user",

                        showTags: true,
                        data: list,
                        onNodeSelected: function (event, node) {

                            mDepartID = node.ID;

                            model.com.refresh();

                        },
                    });

                    // $("#depTree").html($com.util.template(list, HTML.TreeItemNode));
                    // $("#depTree").treeview({ collapsed: true });
                },
                renderPositionTree: function (list) {
                    //list  ： Type List

                    model.com.fullItemTest(list);

                    $("#PositionTree").treeview({
                        // color: "#428bca",

                        // expandIcon: "glyphicon glyphicon-stop",
                        // collapseIcon: "glyphicon glyphicon-unchecked",
                        color: "black",
                        expandIcon: "glyphicon glyphicon-plus",
                        collapseIcon: "glyphicon glyphicon-minus",

                        nodeIcon: "glyphicon glyphicon-user",

                        showTags: true,
                        data: list,
                        onNodeSelected: function (event, node) {

                            mPositionID = node.ID;

                            model.com.refresh();
                        },

                    });


                    // $("#PositionTree").html($com.util.template(list, HTML.TreeItemNode));
                    // $("#PositionTree").treeview({ collapsed: true });
                },

                // function: function treeData(data) {
                //     let cloneData = JSON.parse(JSON.stringify(data))
                //     return cloneData.filter(parent => {  //AREA_CODE 代表id   PID代表 父级 pid
                //         let branchArr = cloneData.filter(child => parent['AREA_CODE'] == child['PID']);
                //         branchArr.length > 0 ? parent['children'] = branchArr : '';
                //         return parent['PID'] == 0;
                //     })
                // },
                // treeData(list1);

                fullItemTest: function (list) {

                    catList = [];

                    $.each(list, function (i, item) {
                        var count = item.SonList.length;


                        item.text = item.Name;
                        item.nodes = item.SonList;
                        item.tags = [count];


                        model.com.fullItemTest(item.SonList);

                    });

                },

                fullItems: function (list) {

                    $.each(list, function (i, item) {

                        model.com.fullItems(item.SonList);


                        item.Items = $com.util.template(item.SonList, HTML.TreeItemNode);
                        if (item.Items.length > 0) {
                            item.Items = "<ul>" + item.Items + "</ul>";
                        }


                    });
                },
                fullPosiItems: function (list) {

                    $.each(list, function (i, item) {

                        model.com.fullItems(item.SonList);

                        item.Items = $com.util.template(item.SonList, HTML.TreeItemNode);

                        if (item.Items.length > 0) {
                            item.Items = "<ul>" + item.Items + "</ul>";
                        }

                    });
                },
                refresh: function () {
                    $com.app.loading('数据加载中...');
                    model.com.getDepartment({}, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];
                        if (list) {
                            rst = model.com.utils.getSon(list);
                        }
                        if (TypeSource_department.ParentID.length > 1)
                            TypeSource_department.ParentID.splice(1, TypeSource_department.ParentID.length - 1);

                        // TypeSource_position.DepartmentID =
                        //     TypeSource_department.ParentID = TypeSource_department.ParentID.concat(model.com.utils.getSource(rst));

                        if (TypeSource_position.DepartmentID.length > 1)
                            TypeSource_position.DepartmentID.splice(1, TypeSource_position.DepartmentID.length - 1);

                        if (TypeSource_position.PrevDepartmentID.length > 1)
                            TypeSource_position.PrevDepartmentID.splice(1, TypeSource_position.PrevDepartmentID.length - 1);
                        $.each(rst, function (i, item) {
                            TypeSource_department.ParentID.push({
                                value: item.ID,
                                name: item.Name,
                            });
                        });

                        $.each(rst, function (i, item) {
                            TypeSource_position.DepartmentID.push({
                                value: item.ID,
                                name: item.Name,
                            });
                        });
                        $.each(rst, function (i, item) {
                            TypeSource_position.PrevDepartmentID.push({
                                value: item.ID,
                                name: item.Name,
                                far: 0,
                            });
                        });

                        AllDepartment = [];
                        AllDepartmentTree = [];
                        DepartmentTest = [];
                        Department_LIST = [];
                        Department_LIST_BM = [];
                        DepartmentTestCanvas = [];

                        if (res && res.list) {
                            model._data.source_deps = res.list;

                            AllDepartment = model.com.utils.getSon(res.list);
                            AllDepartmentTree = $com.util.Clone(res.list);
                            // Department_LIST = model.com.utils.getSon(res.list);
                            DepartmentTest = $com.util.Clone(AllDepartment);
                            Department_LIST = [];
                            for (var m = 0; m < DepartmentTest.length; m++) {
                                if (mDepartID == DepartmentTest[m].ParentID) {
                                    Department_LIST.push(DepartmentTest[m]);
                                }
                                ;

                            }

                            $.each(Department_LIST, function (i, item) {

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
                                    if (!Formattrt_department[p])
                                        continue;
                                    item[p] = Formattrt_department[p](item[p]);
                                }
                            });
                            Department_LIST_BM = $com.util.Clone(Department_LIST);
                            $("div").remove(".jOrgChart");

                            //启用的数据生成部门结构图
                            var _canvasList = [];
                            DepartmentTestCanvas = $com.util.Clone(res.list);

                            for (var index = 0; index < DepartmentTestCanvas.length; index++) {
                                if (DepartmentTestCanvas[index].Active) {
                                    $com.util.deleteLowerProperty(DepartmentTestCanvas[index]);
                                    _canvasList.push(DepartmentTestCanvas[index]);
                                }
                            }
                            var ZaceData = model.com.buildTree(_canvasList);

                            var _dataSource = model.com.utils.getCanvasSource_Item(ZaceData, true);

                            var showlist = $("<ul id='org' style='display:none'><li></li></ul>");

                            var UL = $("<ul></ul>");

                            model.com.showall(_dataSource, UL);


                            showlist.find("li").append(UL);

                            $(".l-canvas-in").html(showlist);

                            $("#org").jOrgChart({
                                chartElement: '.l-canvas-in', //指定在某个dom生成jorgchart
                                dragAndDrop: false, //设置是否可拖动
                            });

                            $($(".node-cells")[0]).hide();

                            $(".node-cells").next().hide();

                            ////需不需要清除
                            //$(".l-container-canvas .l-canvas-in").html("");
                            //if (_dataSource && _dataSource.length) {
                            //    $.each(_dataSource, function (m_i, m_item) {
                            //        $(".l-container-canvas .l-canvas-in").orgchart({
                            //            'data': m_item,
                            //            'nodeTitle': 'name',
                            //            'depth': 999,
                            //            'nodeChildren': 'children'
                            //        });
                            //    });
                            //}

                        }

                        model.com.getPosition({}, function (res) {

                            if (!res)
                                return;
                            var list = res.list,
                                rst = [];
                            if (list) {
                                rst = model.com.utils.getSon(list);

                            }
                            AllPositionTree = $com.util.Clone(res.list);
                            if (TypeSource_position.ParentID.length > 1)
                                TypeSource_position.ParentID.splice(1, TypeSource_position.ParentID.length - 1);


                            //TypeSource_position.ParentID = TypeSource_position.ParentID.concat(model.com.utils.getSource(rst));

                            $.each(rst, function (i, item) {
                                TypeSource_position.ParentID.push({
                                    value: item.ID,
                                    name: item.Name,
                                    far: item.DepartmentID,
                                });
                            });

                            AllPosition = [];
                            PositionTest = [];
                            Position_LIST = [];
                            Position_LIST_GW = [];
                            if (res && res.list) {
                                model._data.source_posn = res.list;

                                AllPosition = model.com.utils.getSon(res.list);

                                // Position_LIST = model.com.utils.getSon(res.list);

                                PositionTest = $com.util.Clone(AllPosition);
                                Position_LIST = [];
                                for (var m = 0; m < PositionTest.length; m++) {
                                    if (mPositionID == PositionTest[m].ParentID) {
                                        Position_LIST.push(PositionTest[m]);
                                    }
                                    ;

                                }

                                // $('.tb_users').bootstrapTable('load', res.list);
                                $.each(Position_LIST, function (i, item) {

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
                                        if (!Formattrt_position[p])
                                            continue;
                                        item[p] = Formattrt_position[p](item[p]);
                                    }
                                });
                                Position_LIST_GW = $com.util.Clone(Position_LIST);
                            }


                            //岗位启用与否变色
                            for (var index = 0; index < AllPositionTree.length; index++) {
                                if (AllPositionTree[index].Active) {
                                    AllPositionTree[index].ColorText = "black";
                                } else {
                                    AllPositionTree[index].ColorText = "yellowgreen";
                                }

                            }


                            $(".l-position-body").html($com.util.template(Position_LIST, HTML.TablePosition));

                            //$page.getPage(Position_LIST, ".l-position-body", HTML.TablePosition, ".table-part");
                            $(".l-position-body tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);


                            });

                            //部门启用与否变色
                            for (var index = 0; index < AllDepartmentTree.length; index++) {
                                if (AllDepartmentTree[index].Active) {
                                    AllDepartmentTree[index].ColorText = "black";
                                } else {
                                    AllDepartmentTree[index].ColorText = "yellowgreen";
                                }

                            }

                            $(".l-department-body").html($com.util.template(Department_LIST, HTML.TableDepartment));


                            if (boolDepart) {

                                var _zaceDe = $com.util.Clone(AllDepartmentTree);
                                var _departTree = model.com.buildTreePro(_zaceDe);

                                model.com.renderDepartTree(_departTree);


                                var _zacePo = $com.util.Clone(AllPositionTree);
                                var _positionTree = model.com.buildTreePro(_zacePo);

                                model.com.renderPositionTree(_positionTree);
                                boolDepart = false;
                            }


                            $com.app.loaded();
                            //$page.getPage(Department_LIST, ".l-department-body", HTML.TableDepartment, ".table-part");
                            $(".l-department-body tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);


                            });
                        });


                    });


                },
                buildTree: function (list) {
                    var temp = {};
                    var tree = {};
                    var cat = [];
                    for (var i in list) {
                        temp[list[i].ID] = list[i];
                    }
                    for (var i in temp) {
                        if (temp[i].ParentID) {
                            //if (!temp[temp[i].ParentID].children) {
                            //    temp[temp[i].ParentID].children = [];
                            //}
                            temp[temp[i].ParentID].SonList.push(temp[i]);
                        } else {
                            tree[temp[i].ID] = temp[i];
                        }
                    }
                    $.each(tree, function (i, item) {
                        cat.push(item);
                    });

                    return cat;
                },

                buildTreePro: function (list) {

                    var _Result = [];
                    $.each(list, function (i, item) {
                        if (item.ParentID == 0) {
                            _Result.push(item);
                            model.com.buildTreeProItem(item, list);
                        }
                    });


                    return _Result;
                },
                //找到树下面所有数据
                buildTreeToList: function (list) {
                    var _Result = [];
                    $.each(list, function (i, item) {
                        _Result.push(item);
                        if (item.SonList && item.SonList.length > 0) {
                            _Result = _Result.concat(model.com.buildTreeToList(item.SonList));
                        }
                    });
                    return _Result;
                },


                //找到上级所有数据
                GetPrevList: function (_item, list, Originlist) {
                    var _Result = Originlist;
                    $.each(list, function (i, item) {
                        if (_item.ParentID != item.ID) {
                            return true;

                        }
                        _Result.push(item);
                        model.com.GetPrevList(item, list, _Result);
                        return false;
                    });
                    return _Result;
                },

                buildTreeProItem: function (_item, list) {

                    if (!_item.SonList) {
                        _item.SonList = [];
                    }
                    $.each(list, function (i, item) {
                        if (item.ParentID == _item.ID) {
                            _item.SonList.push(item);
                            model.com.buildTreeProItem(item, list);
                        }
                    });
                },
                showall: function (menu_list, parent) {
                    $.each(menu_list, function (index, val) {
                        if (val.children.length > 0) {
                            var li = $("<li></li>");
                            li.append("<span   onclick=getOrgId(" + val.id + ");>" + val.name + "</span>").append("<ul></ul>").appendTo(parent);
                            //递归显示
                            model.com.showall(val.children, li.children().eq(1));

                        } else {
                            $("<li></li>").append("<span   onclick=getOrgId(" + val.id + ");>" + val.name + "</span>").appendTo(parent);
                        }
                    });

                },
                getUser: function (data, fn, context) {
                    var d = {
                        $URI: "/User/All",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
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
                                    far: item.ParentID,
                                });
                        });
                        return _rst;
                    },

                    getCanvasSource_Item: function (data, top) {
                        var _rst = [];
                        if (!(data && data.length)) {
                            return _rst;
                        }
                        $.each(data, function (i, item) {
                            var p_item = {
                                'name': item.Name,
                                'relationship': {
                                    'children_num': ((item.SonList && item.SonList) ? item.SonList.length : 0),
                                    'parent_num': top ? 0 : 1,
                                    'sibling_num': data.length - 1,
                                },
                                'children': model.com.utils.getCanvasSource_Item(item.SonList, false),
                            };
                            _rst.push(p_item);
                        });

                        return _rst;
                    },
                },
            },
        });

        model.init();

    });