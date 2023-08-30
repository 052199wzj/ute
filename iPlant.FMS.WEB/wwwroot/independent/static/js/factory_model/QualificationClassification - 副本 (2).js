require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/html2canvas', '../static/utils/js/base/jquery.jOrgChart', '../static/utils/js/base/paging', '../static/utils/js/base/jquery.treeview'],
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
                '<li data-titie="{{DBID}}"  data-value="{{DBID}}"  >',
                '<span style="vertical-align:top;Color:{{ColorText}}" data-value="{{DBID}}" data-core="{{ColorText}}" >{{GroupName}}</span> ',
                '<ul>{{Items}}',
                '</ul>',
                '</li>',
            ].join(""),

            TablePosition: [
                '<tr data-color="">',
                '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td style="min-width: 50px" data-title="DBID" data-value="{{ID}}">{{ID}}</td>',
                '<td style="min-width: 50px" data-title="CertificationName" data-value="{{CertificationName}}">{{CertificationName}}</td>',
                '<td style="min-width: 50px" data-title="CertificationGroupID" data-value="{{CertificationGroupID}}">{{CertificationGroupID}}</td>',
                '<td style="min-width: 50px" data-title="CertificationComments" data-value="{{CertificationComments}}">{{CertificationComments}}</td>',
                '<td style="min-width: 50px" data-title="DTLastEdit" data-value="{{DTLastEdit}}">{{DTLastEdit}}</td>',
                '<td style="min-width: 50px" data-title="LastEditorID" data-value="{{LastEditorID}}">{{LastEditorID}}</td>',
                '<td style="min-width: 50px" data-title="CertificationStatus" data-value="{{CertificationStatus}}"><span class="badge lmvt-badge {{ClassBadge}}">{{Badge}}</span>{{CertificationStatus}}</td>',
                '<td style="max-width: 150px;min-width:60px" data-title="Handle" data-value="{{ID}}"><div class="row">',
                '<div class="col-md-4 {{ISAllowed}}">{{ISAllowedText}}</div>',
                '<div class="col-md-4 lmvt-do-info lmvt-reset">修改</div>',
                '<div class="col-md-4 lmvt-do-forbidden">删除</div>',
                '</td>',
                '</tr>',
            ].join(""),

            TableDepartment: [
                '<tr data-color="">',
                '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td>',
                '<td style="min-width: 50px;display:none" data-title="DBID" data-value="{{DBID}}">{{DBID}}</td>',
                '<td style="min-width: 50px" data-title="GroupName" data-value="{{GroupName}}">{{GroupName}}</td>',
                '<td style="min-width: 50px" data-title="ParentGroupID" data-value="{{ParentGroupID}}">{{ParentGroupID}}</td>',
                '<td style="min-width: 50px" data-title="LastEdit" data-value="{{LastEdit}}">{{LastEdit}}</td>',
                '<td style="min-width: 50px" data-title="DTLastEdit" data-value="{{DTLastEdit}}">{{DTLastEdit}}</td>',
                '<td style="max-width: 80px" data-title="Handle" data-value="{{ID}}"><div class="row">',
                '<div class="col-md-6 lmvt-do-info lmvt-reset">更新</div>',
                '<div class="col-md-6 lmvt-do-info lmvt-delete">删除</div>',
                '</td>',
                '</tr>',
            ].join(""),
        };
        Position_LIST = [];
        Department_LIST = [];
        Formattrt_department = {};
        Formattrt_position = {};
        DEFAULT_VALUE_D = {
            GroupName: "",
            ParentGroupID: 0,
        };
        DEFAULT_VALUE_P = {
            GroupName: "",
            ParentGroupID: "",
        };
        (function () {
            KEYWORD_department_LIST = [
                "ID|部门编号",
                "GroupName|证书种类",
                "ParentGroupID|上级证书",
                "ParentGroupID|上级部门|ArrayOne",
                "CertificationStatus|状态|ArrayOne",
                "OperatorID|人员|ArrayOne",
                "DTLastEdit|时间|DateTime"
            ];

            KEYWORD_department = {};
            Columns_department = [];

            TypeSource_department = {
                GroupName: [],
                CertificationStatus: [{
                    name: "未使用",
                    value: 0
                }, {
                    name: "启用",
                    value: 1
                }, {
                    name: "禁用",
                    value: 2
                }],
                ParentGroupID: [{
                    name: "无",
                    value: 0
                }],
                OperatorID: [{
                    name: "无",
                    value: 0
                }],
            };

            $.each(KEYWORD_department_LIST, function (i, item) {
                var detail = item.split("|");
                KEYWORD_department[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined
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
                "ParentGroupID|上级岗位|ArrayOneControl|PrevDepartmentID",
                "DutyID|岗位职责|ArrayOne",
                "CertificationStatus|状态|ArrayOne",
                "OperatorID|人员|ArrayOne",
                "EditTime|时间|DateTime"
            ];

            KEYWORD_position = {};

            //Columns_position = [];


            TypeSource_position = {
                CertificationStatus: [{
                    name: "未使用",
                    value: 0
                }, {
                    name: "启用",
                    value: 1
                }, {
                    name: "禁用",
                    value: 2
                }],
                ParentGroupID: [{
                    name: "无",
                    value: 0,
                    far: 0
                }],
                DepartmentID: [{
                    name: "无",
                    value: 0,
                    far: 0
                }],
                PrevDepartmentID: [{
                    name: "无",
                    value: 0,
                    far: 0
                }],
                OperatorID: [{
                    name: "无",
                    value: 0
                }],
                DutyID: [{
                    name: "无",
                    value: 0
                }, {
                    name: "经理",
                    value: 4
                }, {
                    name: "主管",
                    value: 2
                }, {
                    name: "调度",
                    value: 3
                }, {
                    name: "班长",
                    value: 1
                }, {
                    name: "组员",
                    value: 5
                }],
            };
            $.each(KEYWORD_position_LIST, function (i, item) {
                var detail = item.split("|");
                KEYWORD_position[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
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
                            $item.css("color", $item.attr("data-core"))
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
                            $item.css("color", $item.attr("data-core"))
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
                                enable: true
                            },
                            data: {
                                simpleData: {
                                    enable: true,
                                    idKey: "id",
                                    pIdKey: "pId",
                                    rootPId: 0
                                }
                            },
                            callback: {
                                onCheck: zTreeOnCheck
                            },
                            view: {
                                showLine: false,
                                showIcon: false,
                                showTitle: false,
                                // fontCss : {color:"red"}
                            }

                        };
                        var zNodes = []
                        var tempMode = { "id": 0, "pId": "", "securityOptions": [], "corpCode": "", "PERMITID": "", "name": "", "PROJECTNAME": "", "corpId": "" };

                        for (var i = 0; i < AllDepartment.length; i++) {

                            var mode = $com.util.Clone(tempMode);
                            if (AllDepartment[i].CertificationStatus) {
                                if (AllDepartment[i].ParentGroupID > 0) {
                                    mode.id = AllDepartment[i].ID;
                                    mode.pId = AllDepartment[i].ParentGroupID;
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
                        })

                        function setCheck() {
                            var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
                                type = { Y: "ps", N: "ps" }
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
                            $('.tabnav li').removeClass('CertificationStatus')
                            $(this).addClass('CertificationStatus');
                            var pd = $(this).index();
                            $('.tabcon li').hide()
                            $('.tabcon li').eq(pd).show();
                        })

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
                                CertificationStatus: 0,
                                Name: rst.Name,
                                DepartmentID: Number(rst.DepartmentID),
                                ParentGroupID: mPositionID,
                                DutyID: Number(rst.DutyID),  //相当于部门
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
                                data: _data
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

                        var SelectData = AllPosition.filter((item) => { return item.ID == wID });

                        var default_value = {
                            Name: SelectData[0].Name,
                            DutyID: SelectData[0].DutyID,
                            //PrevDepartmentID: SelectData[0].PrevDepartmentID,
                            //CertificationStatus: SelectData[0].CertificationStatus,
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
                                data: SelectData[0]
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
                            alert("请先选择一行数据再试！")
                            return;
                        }
                        if (SelectData.length != 1) {
                            alert("只能同时对一行数据修改！")
                            return;
                        }

                        var default_value = {
                            Name: SelectData[0].Name,
                            DutyID: SelectData[0].DutyID,
                            //PrevDepartmentID: SelectData[0].PrevDepartmentID,
                            //CertificationStatus: SelectData[0].CertificationStatus,
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
                                data: SelectData[0]
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

                        var SelectData = AllPosition.filter((item) => { return item.ID == wID });

                        if (!confirm("已选择名称为 [" + SelectData[0].Name + "] 的数据，确定将其删除？")) {
                            return;
                        }

                        model._data.source_posn = DeleteSourceItem(model._data.source_posn, SelectData);
                        model.com.postPosition({
                            data: model._data.source_posn
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
                            alert("至少选择一行数据再试！")
                            return;
                        }
                        // if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {
                        //     return;
                        // }

                        model._data.source_posn = DeleteSourceItem(model._data.source_posn, SelectData);
                        model.com.postPosition({
                            data: model._data.source_posn
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

                        var SelectData = AllPosition.filter((item) => { return item.ID == wID });

                        for (var i = 0; i < SelectData.length; i++) {
                            model.com.buildTreeProItem(SelectData[i], AllPosition);
                            $com.util.deleteLowerProperty(SelectData[i]);
                        }

                        var _list = [];
                        // for (var m = 0; m < SelectData.length; m++) {
                        //     SelectData[m];

                        // }

                        _list = SelectData.concat(model.com.buildTreeToList(SelectData));
                        model.com.CertificationStatusPosition({
                            CertificationStatus: 0,
                            data: _list
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
                            alert("请先选择一行数据再试！")
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
                        model.com.CertificationStatusPosition({
                            CertificationStatus: 0,
                            data: _list
                        }, function (res) {
                            alert("禁用成功！");
                            //Refresh("getDepartment");
                            model.com.refresh();
                        });
                        //调用删除函数然后用load刷新数据源 
                    });

                    //启用单条
                    $("body").delegate(".l-containe-canvas-table-position .lmvt-do-CertificationStatus", "click", function () {

                        var $this = $(this),
                            wID = Number($this.closest("td").attr("data-value"));

                        var SelectData = AllPosition.filter((item) => { return item.ID == wID });

                        var _list = [];
                        for (var i = 0; i < SelectData.length; i++) {
                            $com.util.deleteLowerProperty(SelectData[i]);
                            _list = _list.concat(model.com.GetPrevList(SelectData[i], AllPosition, SelectData));
                        }

                        // for (var i = 0; i < _list.length; i++) {
                        //     $com.util.deleteLowerProperty(_list[i]);
                        // }
                        model.com.CertificationStatusPosition({
                            CertificationStatus: 1,
                            data: _list
                        }, function (res) {
                            alert("启用成功！");
                            //Refresh("getDepartment");
                            model.com.refresh();
                        });
                    });

                    $("body").delegate("#l-CertificationStatus-position", "click", function () {

                        var SelectData = $com.table.getSelectionData($(".l-containe-canvas-table .l-position-body"), "ID", AllPosition);
                        if (!SelectData || !SelectData.length) {
                            alert("请先选择一行数据再试！")
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
                        model.com.CertificationStatusPosition({
                            CertificationStatus: 1,
                            data: _list
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

                        if (item.ID == set_data.ParentGroupID) {
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
                function CertificationStatusSourceItem(_source, set_data, CertificationStatus) {
                    if (!_source)
                        _source = [];
                    if (!set_data)
                        set_data = [];

                    $.each(_source, function (i, item) {

                        $.each(set_data, function (m, item_m) {
                            if (item.ID == item_m.ID) {
                                item.CertificationStatus = CertificationStatus;
                            }
                        });
                        if (item.SonList) {

                            item.SonList = CertificationStatusSourceItem(item.SonList, set_data, CertificationStatus);

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

                        if (item.ID == set_data.ParentGroupID) {
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
                        $("body").append($com.modal.show(DEFAULT_VALUE_D, KEYWORD_department, "新增证书种类", function (rst) {
                            //调用插入函数然后用load刷新数据源 

                            if (!rst || $.isEmptyObject(rst))
                                return false;

                            //判断是不是存在重复
                            // for (var i = 0; i < Department_LIST_BM.length; i++) {
                            //     if (rst.Name == Department_LIST_BM[i].Name) {
                            //         alert("新增部门已存在！");
                            //         return false;
                            //     }
                            // }
                            //if (_data.ParentGroupID > 0) {
                            //    model._data.source_deps = SetSourceItem_D(model._data.source_deps, _data);
                            //} else {
                            //    if (!model._data.source_deps)
                            //        model._data.source_deps = [];
                            //    model._data.source_deps.push(_data);
                            //}
                            model.com.postGroupAdd({
                                GroupName: rst.GroupName,
                                ParentGroupID: rst.ParentGroupID,
                            }, function (res) {
                                alert("新增成功！！");
                                model.com.refresh();
                                //Refresh("getDepartment");
                            });
                        }, TypeSource_department));
                    });

                    //更新证书种类
                    $("body").delegate(".l-containe-canvas-table-department .lmvt-reset", "click", function (evet) {

                        var $this = $(this);
                        var $tr = $this.parents("tr"),
                            _GroupID = $tr.find("td[data-title=DBID]").attr("data-value");


                        $("body").append($com.modal.show(DEFAULT_VALUE_D, KEYWORD_department, "更新证书种类", function (rst) {
                            //调用修改函数
                            if (!rst || $.isEmptyObject(rst))
                                return;

                            //SelectData[0].Name = rst.Name;
                            // SelectData[0].ParentGroupID = Number(rst.ParentGroupID);
                            //SelectData[0].Type = Number(rst.Type);
                            //$com.util.deleteLowerProperty(SelectData[0]);

                            //model._data.source_deps = SetDepartmentID(model._data.source_deps, SelectData[0].ID, SelectData[0].ParentGroupID);

                            //model._data.source_deps = DeleteSourceItem(model._data.source_deps, SelectData[0]);

                            //model._data.source_deps.push(_data);

                            model.com.postGroupUpdate({
                                GroupID: _GroupID,
                                GroupName: rst.GroupName,
                                ParentGroupID: rst.ParentGroupID,
                            }, function (res) {
                                alert("更新成功！！");
                                model.com.refresh();
                                //Refresh("getDepartment");
                            });

                        }, TypeSource_department));
                    });

                    $("body").delegate("#l-revise-department", "click", function () {

                        var SelectData = $com.table.getSelectionData($(".l-containe-canvas-table .l-department-body"), "ID", AllDepartment);
                        if (!SelectData || !SelectData.length) {
                            alert("请先选择一行数据再试！")
                            return;
                        }
                        if (SelectData.length != 1) {
                            alert("只能同时对一行数据修改！")
                            return;
                        }


                        var default_value = {
                            Name: SelectData[0].Name,
                            Type: SelectData[0].Type,

                        };

                        $("body").append($com.modal.show(default_value, KEYWORD_department, "修改", function (rst) {
                            //调用修改函数
                            if (!rst || $.isEmptyObject(rst))
                                return;



                            SelectData[0].Name = rst.Name;
                            // SelectData[0].ParentGroupID = Number(rst.ParentGroupID);
                            SelectData[0].Type = Number(rst.Type);
                            $com.util.deleteLowerProperty(SelectData[0]);
                            //model._data.source_deps = SetDepartmentID(model._data.source_deps, SelectData[0].ID, SelectData[0].ParentGroupID);

                            //model._data.source_deps = DeleteSourceItem(model._data.source_deps, SelectData[0]);

                            //model._data.source_deps.push(_data);

                            model.com.postDepartment({
                                data: SelectData[0]
                            }, function (res) {
                                alert("修改成功！！");
                                model.com.refresh();
                                //Refresh("getDepartment");
                            });

                        }, TypeSource_department));
                    });

                    //组别更改
                    $("body").delegate("#l-update-department", "click", function () {

                        var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "DBID", Department_LIST);
                        if (!SelectData || !SelectData.length) {
                            alert("请先选择一行数据再试！")
                            return;
                        }
                        var _GroupIDList=[];
                        for(j=0;j<SelectData.length;j++){
                            _GroupIDList.push(SelectData[j]["DBID"])
                        }
                        DEFAULT_VALUE_D = {
                            ParentGroupID: 0,
                        };
                        $("body").append($com.modal.show(DEFAULT_VALUE_D, KEYWORD_department, "更新证书组别", function (rst) { 
                            model.com.postGroupChangeParent({
                                GroupIDList: _GroupIDList,
                                ParentGroupID:rst.ParentGroupID
                            }, function (res) {
                                alert("组别更改成功！！");
                                model.com.refresh();
                            });
                        }, TypeSource_department));

                        

                    });
                    //删除单条
                    $("body").delegate(".l-containe-canvas-table-department .lmvt-delete", "click", function () {


                        var $this = $(this);
                        var $tr = $this.parents("tr"),
                            wID = Number($this.closest("td").attr("data-value"));
                        _GroupID = $tr.find("td[data-title=DBID]").attr("data-value");


                        if (!confirm("已选择第" + wID + "条数据，确定将其删除？")) {
                            return;
                        }

                        model.com.postGroupDelete({
                            GroupID: _GroupID
                        }, function (res) {
                            alert("删除成功！！");
                            model.com.refresh();
                        });

                    });

                    $("body").delegate("#l-delete-department", "click", function () {

                        var SelectData = $com.table.getSelectionData($(".l-containe-canvas-table .l-department-body"), "ID", AllDepartment);
                        if (!SelectData || !SelectData.length) {
                            alert("至少选择一行数据再试！")
                            return;
                        }

                        // if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {
                        //     return;
                        // }

                        model._data.source_deps = DeleteSourceItem(model._data.source_deps, SelectData);
                        model.com.postDepartment({
                            data: model._data.source_deps
                        }, function (res) {
                            alert("删除成功！！");
                            model.com.refresh();
                            //Refresh("getDepartment");
                        });
                        //调用删除函数然后用load刷新数据源 

                    });
                    $("body").delegate("#l-freshen-department", "click", function () {

                        boolDepart = true;
                        mDepartID = 0;
                        model.com.refresh();


                        //Refresh("getDepartment");
                    });

                    //禁用单条
                    $("body").delegate(".l-containe-canvas-table-department .lmvt-allowed-delete", "click", function () {


                        var $this = $(this),
                            wID = Number($this.closest("td").attr("data-value"));

                        var SelectData = AllDepartment.filter((item) => { return item.ID == wID });

                        for (var i = 0; i < SelectData.length; i++) {
                            model.com.buildTreeProItem(SelectData[i], AllDepartment);
                            $com.util.deleteLowerProperty(SelectData[i]);
                        }

                        var _list = [];
                        // for (var m = 0; m < SelectData.length; m++) {
                        //     SelectData[m];

                        // }

                        _list = SelectData.concat(model.com.buildTreeToList(SelectData));
                        model.com.CertificationStatusDepartment({
                            CertificationStatus: 0,
                            data: _list
                        }, function (res) {
                            alert("禁用成功！");
                            //Refresh("getDepartment");
                            model.com.refresh();
                        });

                    });

                    $("body").delegate("#l-forbidder-department", "click", function () {

                        var SelectData = $com.table.getSelectionData($(".l-containe-canvas-table .l-department-body"), "ID", AllDepartment);
                        if (!SelectData || !SelectData.length) {
                            alert("请先选择一行数据再试！")
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
                        model.com.CertificationStatusDepartment({
                            CertificationStatus: 0,
                            data: _list
                        }, function (res) {
                            alert("禁用成功！");
                            //Refresh("getDepartment");
                            model.com.refresh();
                        });

                    });

                    //启用单条
                    $("body").delegate(".l-containe-canvas-table-department .lmvt-do-CertificationStatus", "click", function () {

                        var $this = $(this),
                            wID = Number($this.closest("td").attr("data-value"));

                        var SelectData = AllDepartment.filter((item) => { return item.ID == wID });

                        var _list = [];
                        for (var i = 0; i < SelectData.length; i++) {
                            $com.util.deleteLowerProperty(SelectData[i]);
                            _list = _list.concat(model.com.GetPrevList(SelectData[i], AllDepartment, SelectData));
                        }

                        //_list=_list.concat(SelectData);

                        model.com.CertificationStatusDepartment({
                            CertificationStatus: 1,
                            data: _list
                        }, function (res) {
                            alert("启用成功！");
                            //Refresh("getDepartment");
                            model.com.refresh();
                        });
                        //调用删除函数然后用load刷新数据源 

                    });

                    $("body").delegate("#l-CertificationStatus-department", "click", function () {

                        var SelectData = $com.table.getSelectionData($(".l-containe-canvas-table .l-department-body"), "ID", AllDepartment);
                        if (!SelectData || !SelectData.length) {
                            alert("请先选择一行数据再试！")
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

                        model.com.CertificationStatusDepartment({
                            CertificationStatus: 1,
                            data: _list
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
                // 证书种类查询
                $("body").delegate("#zace-Device-search-BM", "click", function () {
                    var value = $("#zace-search-BM").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $(".l-department-body").children("tr").show();
                    else
                    //下面的ID暂时不清楚意义
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
                CertificationStatusPosition: function (data, fn, context) {
                    var d = {
                        $URI: "/Department/CertificationStatusPosition",
                        $TYPE: "post"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                CertificationStatusDepartment: function (data, fn, context) {
                    var d = {
                        $URI: "/Department/CertificationStatusDepartment",
                        $TYPE: "post"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                getDepartment: function (data, fn, context) {
                    var d = {
                        $URI: "/QMGroup/All",
                        $TYPE: "get",
                        $SERVER: "/MESWDW"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                postGroupDelete: function (data, fn, context) {
                    var d = {
                        $URI: "/QMGroup/Delete",
                        $TYPE: "post",
                        $SERVER: "/MESWDW"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                postGroupChangeParent: function (data, fn, context) {
                    var d = {
                        $URI: "/QMGroup/ChangeParent",
                        $TYPE: "post",
                        $SERVER: "/MESWDW"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                getPosition: function (data, fn, context) {
                    var d = {
                        $URI: "/Department/AllPosition",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                postGroupAdd: function (data, fn, context) {
                    var d = {
                        $URI: "/QMGroup/Add",
                        $TYPE: "post",
                        $SERVER: "/MESWDW"

                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                postGroupUpdate: function (data, fn, context) {
                    var d = {
                        $URI: "/QMGroup/Update",
                        $TYPE: "post",
                        $SERVER: "/MESWDW"

                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                postPosition: function (data, fn, context) {
                    var d = {
                        $URI: "/Department/UpdatePosition",
                        $TYPE: "post"
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                renderDepartTree: function (list) {
                    //list  ： Type List

                    model.com.fullItems(list);
                    //生成树
                    $("#depTree").html($com.util.template(list, HTML.TreeItemNode));
                    $("#depTree").treeview({ collapsed: true });
                },
                renderPositionTree: function (list) {
                    //list  ： Type List

                    model.com.fullPosiItems(list);

                    $("#PositionTree").html($com.util.template(list, HTML.TreeItemNode));
                    $("#PositionTree").treeview({ collapsed: true });
                },
                fullItems: function (list) {

                    $.each(list, function (i, item) {

                        model.com.fullItems(item.SonList);

                        item.Items = $com.util.template(item.SonList, HTML.TreeItemNode);


                    });
                },
                fullPosiItems: function (list) {

                    $.each(list, function (i, item) {

                        model.com.fullItems(item.SonList);

                        item.Items = $com.util.template(item.SonList, HTML.TreeItemNode);


                    });
                },
                refresh: function () {
                    $com.app.loading('数据加载中...');
                    model.com.getDepartment({}, function (res) {
                        if (!res)
                            return;
                        var list = res.list;
                        //增加部分需要的数据
                        $.each(list, function (i, itemtemp) {
                            itemtemp.SonList = [];
                            itemtemp.ID = 1;
                            itemtemp.LastEdit = "";
                        });
                        rst = [];
                        if (list) {
                            rst = model.com.utils.getSon(list);
                        }
                        if (TypeSource_department.ParentGroupID.length > 1)
                            TypeSource_department.ParentGroupID.splice(1, TypeSource_department.ParentGroupID.length - 1);

                        // TypeSource_position.DepartmentID =
                        //     TypeSource_department.ParentGroupID = TypeSource_department.ParentGroupID.concat(model.com.utils.getSource(rst));

                        if (TypeSource_position.DepartmentID.length > 1)
                            TypeSource_position.DepartmentID.splice(1, TypeSource_position.DepartmentID.length - 1);

                        if (TypeSource_position.PrevDepartmentID.length > 1)
                            TypeSource_position.PrevDepartmentID.splice(1, TypeSource_position.PrevDepartmentID.length - 1);
                        $.each(rst, function (i, item) {
                            TypeSource_department.ParentGroupID.push({
                                value: item.DBID,
                                name: item.GroupName
                            });
                        });
                        $.each(rst, function (i, item) {
                            TypeSource_position.DepartmentID.push({
                                value: item.DBID,
                                name: item.GroupName
                            });
                        });
                        $.each(rst, function (i, item) {
                            TypeSource_position.PrevDepartmentID.push({
                                value: item.DBID,
                                name: item.GroupName,
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
                                if (mDepartID == DepartmentTest[m].ParentGroupID) {
                                    Department_LIST.push(DepartmentTest[m]);
                                };

                            }
                            $.each(Department_LIST, function (i, item) {

                                item.Badge = " ";
                                for (var p in item) {

                                    if (p == "lastEditorInfo") {
                                        item.LastEdit = item[p]['Name']
                                    };
                                    if (!Formattrt_department[p])
                                        continue;
                                    item[p] = Formattrt_department[p](item[p]);
                                }

                                item.ID = item.ID + i;

                            });
                            Department_LIST_BM = $com.util.Clone(Department_LIST);
                            $("div").remove(".jOrgChart");



                            //启用的数据生成部门结构图
                            // var _canvasList = [];
                            DepartmentTestCanvas = $com.util.Clone(res.list);

                            // for (var index = 0; index < DepartmentTestCanvas.length; index++) {
                            //     if (DepartmentTestCanvas[index].CertificationStatus) {
                            //         $com.util.deleteLowerProperty(DepartmentTestCanvas[index]);
                            //         _canvasList.push(DepartmentTestCanvas[index]);
                            //     }

                            // }
                            var ZaceData = model.com.buildTree(DepartmentTestCanvas);

                            var _dataSource = model.com.utils.getCanvasSource_Item(ZaceData, true);

                            var showlist = $("<ul id='org' style='display:none'><li></li></ul>");

                            var UL = $("<ul></ul>");

                            model.com.showall(_dataSource, UL);


                            showlist.find("li").append(UL);

                            $(".l-canvas-in").html(showlist);

                            $("#org").jOrgChart({
                                chartElement: '.l-canvas-in',//指定在某个dom生成jorgchart
                                dragAndDrop: false //设置是否可拖动
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

                        // model.com.getDepartment({}, function (res) {

                        //     if (!res)
                        //         return;
                        //     var list = res.list;
                        //     $.each(list, function (i, itemtemp) {
                        //         itemtemp.SonList=[];
                        //     });
                        //         rst = [];
                        //     if (list) {
                        //         rst = model.com.utils.getSon(list);

                        //     }
                        //     AllPositionTree = $com.util.Clone(res.list);
                        //     if (TypeSource_position.ParentGroupID.length > 1)
                        //         TypeSource_position.ParentGroupID.splice(1, TypeSource_position.ParentGroupID.length - 1);


                        //     //TypeSource_position.ParentGroupID = TypeSource_position.ParentGroupID.concat(model.com.utils.getSource(rst));

                        //     $.each(rst, function (i, item) {
                        //         TypeSource_position.ParentGroupID.push({
                        //             value: item.ID,
                        //             name: item.Name,
                        //             far: item.DepartmentID
                        //         })
                        //     });

                        //     AllPosition = [];
                        //     PositionTest = [];
                        //     Position_LIST = [];
                        //     Position_LIST_GW = [];
                        //     if (res && res.list) {
                        //         model._data.source_posn = res.list;

                        //         AllPosition = model.com.utils.getSon(res.list);

                        //         // Position_LIST = model.com.utils.getSon(res.list);

                        //         PositionTest = $com.util.Clone(AllPosition);
                        //         Position_LIST = [];
                        //         for (var m = 0; m < PositionTest.length; m++) {
                        //             if (mPositionID == PositionTest[m].ParentGroupID) {
                        //                 Position_LIST.push(PositionTest[m]);
                        //             };

                        //         }

                        //         // $('.tb_users').bootstrapTable('load', res.list);
                        //         $.each(Position_LIST, function (i, item) {

                        //             item.Badge = " ";

                        //             if (item.CertificationStatus == 1) {
                        //                 item.ISAllowedText = "禁用";
                        //                 item.ISAllowed = "lmvt-allowed-delete";
                        //                 item.ClassBadge = "lmvt-CertificationStatusBadge";

                        //             } else {
                        //                 item.ISAllowedText = "启用";
                        //                 item.ISAllowed = "lmvt-do-CertificationStatus";
                        //                 item.ClassBadge = "lmvt-defBadge";
                        //             }


                        //             for (var p in item) {
                        //                 if (!Formattrt_position[p])
                        //                     continue;
                        //                 item[p] = Formattrt_position[p](item[p]);
                        //             }
                        //         });
                        //         Position_LIST_GW = $com.util.Clone(Position_LIST);
                        //     }



                        // //岗位启用与否变色
                        // for (var index = 0; index < AllPositionTree.length; index++) {
                        //         AllPositionTree[index].ColorText = "black";
                        // }


                        // $(".l-position-body").html($com.util.template(Position_LIST, HTML.TablePosition));

                        // //$page.getPage(Position_LIST, ".l-position-body", HTML.TablePosition, ".table-part");
                        // $(".l-position-body tr").each(function (i, item) {
                        //     var $this = $(this);
                        //     var colorName = $this.css("background-color");
                        //     $this.attr("data-color", colorName);



                        // });

                        //部门启用与否变色
                        for (var index = 0; index < AllDepartmentTree.length; index++) {
                            AllDepartmentTree[index].ColorText = "black";
                        }

                        $(".l-department-body").html($com.util.template(Department_LIST, HTML.TableDepartment));


                        if (boolDepart) {

                            var _zaceDe = $com.util.Clone(AllDepartmentTree);
                            var _departTree = model.com.buildTreePro(_zaceDe);

                            model.com.renderDepartTree(_departTree);


                            // var _zacePo = $com.util.Clone(AllPositionTree);
                            // var _positionTree = model.com.buildTreePro(_zacePo);

                            // model.com.renderPositionTree(_positionTree);
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





                    //   });


                },
                buildTree: function (list) {
                    var temp = {};
                    var tree = {};
                    var cat = [];
                    for (var i in list) {
                        temp[list[i].DBID] = list[i];
                    }
                    for (var i in temp) {
                        if (temp[i].ParentGroupID) {
                            //if (!temp[temp[i].ParentGroupID].children) {
                            //    temp[temp[i].ParentGroupID].children = [];
                            //}
                            temp[temp[i].ParentGroupID].SonList.push(temp[i]);
                        } else {
                            tree[temp[i].DBID] = temp[i];
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
                        if (item.ParentGroupID == 0) {
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
                        if (_item.ParentGroupID != item.ID) {
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
                        if (item.ParentGroupID == _item.DBID) {
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
                        $TYPE: "get"
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
                            if (item.CertificationStatus)
                                _rst.push({
                                    value: item.ID,
                                    name: item.Name,
                                    far: item.ParentGroupID
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
                                'name': item.GroupName,
                                'relationship': {
                                    'children_num': ((item.SonList && item.SonList) ? item.SonList.length : 0),
                                    'parent_num': top ? 0 : 1,
                                    'sibling_num': data.length - 1,
                                },
                                'children': model.com.utils.getCanvasSource_Item(item.SonList, false)
                            };
                            _rst.push(p_item);
                        });

                        return _rst;
                    }
                },
            }
        });

        model.init();

    });