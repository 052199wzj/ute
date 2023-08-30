require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/paging', '../static/utils/js/base/bootstrap-treeview.min', '../static/utils/js/pickPeopleWeb'],
    function ($lin, $com, $page, $treeview, $pick) {

        var HTML,
            //实体
            Defaul_Value_Code,
            KETWROD_LIST_Code,
            KETWROD_Code,
            Formattrt_Code,
            TypeSource_Code,
            wUser,
            wDepartment,
            PersonnelSearch,
            wTeamInfo,
            wChargeID,
            TeamChargeShowSource,
            TeamChargeShowSourceEdit,
            PartPointUnitList,
            wGroupID,
            ChargeGroupID,
            wGroupAllList,
            TeamGroup,
            ModeuleType = 1,
            productBool = false;
        qualityBool = false;
        technologyBool = false;
        storeBool = false;
        deviceBool = false;
        deviceJLBool = false;
        ShiftIndexList = ["白班", "白班", "中班", "晚班"];
        ModeuleTypeList = ["默认", "生产", "质量", "工艺", "设备", "仓库", "计量"]
        HTML = {
            TeamList: [
                '<tr>',
                '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></td>',
                '<td style="min-width: 50px" data-title="WID" data-value="{{WID}}">{{WID}}</td>',
                '<td style="min-width: 80px" data-title="Name" data-value="{{Name}}">{{Name}}</td>',
                '<td style="min-width: 80px" data-title="WorkShopName" data-value="{{WorkShopName}}">{{WorkShopName}}</td>',
                '<td style="min-width: 50px" data-title="DepartmentName" data-value="{{DepartmentName}}">{{DepartmentName}}</td>',
                '<td style="min-width: 50px" data-title="ModuleName" data-value="{{ModuleName}}">{{ModuleName}}</td>',
                '<td style="min-width: 50px" data-title="LeaderIDList" data-value="{{LeaderIDList}}">{{LeaderIDList}}</td>',
                '<td style="min-width: 50px" data-title="MateIDList" data-value="{{MateIDList}}">{{MateIDList}}</td>',
                '<td style="min-width: 50px" data-title="Active" data-value="{{Active}}"><span class="badge lmvt-badge {{ClassBadge}}">{{Badge}}</span>{{Active}}</td>',
                '<td style="min-width: 80px" data-title="Creator" data-value="{{Creator}}">{{Creator}}</td>',
                '<td style="min-width: 80px" data-title="CreateTime" data-value="{{CreateTime}}">{{CreateTime}}</td>',
                '<td style="min-width: 100px" data-title="Editor" data-value="{{Editor}}">{{Editor}}</td>',
                '<td style="min-width: 50px" data-title="EditTime" data-value="{{EditTime}}">{{EditTime}}</td>',

                '<td style="min-width: 80px;color:#C7001A" data-title="ID" data-value="{{ID}}"><div class="row">',
                '<div class="col-md-3 lmvt-code-TeamEdit lmvt-do-info">修改</div>',
                '<div class="col-md-3 lmvt-do-info {{ISAllowed}}">删除</div>',
                '<div class="col-md-3 lmvt-code-do {{ISDo}}">{{ActiveType}}</div>',
                '<div class="col-md-3"><UL id="lmvt-nav">',
                '<LI>更多<UL>',
                '<LI data-value="{{ID}}" class="SelectPersonnel">人员设置</LI>',
                '<LI data-value="{{ID}}" class="SelectPost">岗位设置</LI>',
                '<LI data-value="{{ID}}" class="SelectTeam">分组设置</LI>',
                '</UL></LI></UL></div>',
                '</div></td>',
                '</tr>'
            ].join(""),
            PersonnelList: [
                '<tr>',
                '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></td>',
                '<td style="min-width: 50px" data-title="WID" data-value="{{ID}}">{{WID}}</td>',
                '<td style="min-width: 80px" data-title="Name" data-value="{{Name}}">{{Name}}</td>',
                '<td style="min-width: 80px" data-title="LeaderName" data-value="{{LeaderName}}">{{LeaderName}}</td>',
                // '<td style="min-width: 50px" data-title="Active" data-value="{{Active}}"><span class="badge lmvt-badge {{ClassBadge}}">{{Badge}}</span>{{Active}}</td>',
                '<td style="min-width: 50px" data-title="Active" data-value="{{Active}}"><span class="lmvt-active"></span>{{ActiveText}}</td>',
                '<td style="min-width: 80px" data-title="Creator" data-value="{{Creator}}">{{Creator}}</td>',
                '<td style="min-width: 80px" data-title="CreateTime" data-value="{{CreateTime}}">{{CreateTime}}</td>',
                '<td style="min-width: 100px" data-title="Editor" data-value="{{Editor}}">{{Editor}}</td>',
                '<td style="min-width: 50px" data-title="EditTime" data-value="{{EditTime}}">{{EditTime}}</td>',
                '<td style="min-width: 80px;color:#C7001A" data-title="ID" data-value="{{ID}}"><div class="row">',
                '<div class="col-md-12 lmvt-delete lmvt-do-info">删除</div>',
                '</div></td>',
                '</tr>'
            ].join(""),
            PostList: [
                '<tr>',
                '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></td>',
                '<td style="min-width: 50px" data-title="WID" data-value="{{WID}}">{{WID}}</td>',
                '<td style="min-width: 80px" data-title="Name" data-value="{{Name}}">{{Name}}</td>',
                '<td style="min-width: 80px" data-title="TeamName" data-value="{{TeamName}}">{{TeamName}}</td>',
                '<td style="min-width: 80px" data-title="PartName" data-value="{{PartName}}">{{PartName}}</td>',
                '<td style="min-width: 80px" data-title="PartPointName" data-value="{{PartPointName}}">{{PartPointName}}</td>',
                '<td style="min-width: 80px" data-title="StationName" data-value="{{StationName}}">{{StationName}}</td>',
                '<td style="min-width: 80px" data-title="MateUserName" data-value="{{MateUserName}}">{{MateUserName}}</td>',
                // '<td style="min-width: 80px" data-title="GroupName" data-value="{{GroupName}}">{{GroupName}}</td>',
                '<td style="min-width: 50px" data-title="Active" data-value="{{Active}}"><span class="badge lmvt-badge {{ClassBadge}}">{{Badge}}</span>{{ActiveText}}</td>',
                '<td style="min-width: 80px" data-title="Creator" data-value="{{Creator}}">{{Creator}}</td>',
                '<td style="min-width: 80px" data-title="CreateTime" data-value="{{CreateTime}}">{{CreateTime}}</td>',
                '<td style="min-width: 100px" data-title="Editor" data-value="{{Editor}}">{{Editor}}</td>',
                '<td style="min-width: 50px" data-title="EditTime" data-value="{{EditTime}}">{{EditTime}}</td>',

                '<td style="min-width: 80px;color:#C7001A" data-title="ID" data-value="{{ID}}"><div class="row">',
                '<div class="col-md-4 lmvt-code-Postedit lmvt-do-info">修改</div>',
                '<div class="col-md-4 lmvt-code-do {{ISDo}}">{{ActiveType}}</div>',
                '<div class="col-md-4 {{ISAllowed}} lmvt-do-info">删除</div>',
                // '<div class="col-md-4"><UL id="lmvt-nav">',
                // '<LI>更多<UL>',
                // '<LI data-value="{{ID}}" class={{ISAllowed}} >删除</LI>',
                // '</UL></LI></UL></div>',
                '</div></td>',
                '</tr>'
            ].join(""),
            ItemList: [
                '<tr>',
                '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></td>',
                '<td style="min-width: 50px" data-title="WID" data-value="{{WID}}">{{WID}}</td>',
                '<td style="min-width: 80px" data-title="Name" data-value="{{Name}}">{{Name}}</td>',
                '<td style="min-width: 80px" data-title="TeamName" data-value="{{TeamName}}">{{TeamName}}</td>',
                '<td style="min-width: 80px" data-title="PartName" data-value="{{PartName}}">{{PartName}}</td>',
                '<td style="min-width: 80px" data-title="PartPointName" data-value="{{PartPointName}}">{{PartPointName}}</td>',
                '<td style="min-width: 80px" data-title="StationName" data-value="{{StationName}}">{{StationName}}</td>',
                '<td style="min-width: 80px" data-title="MateUserName" data-value="{{MateUserName}}">{{MateUserName}}</td>',
                // '<td style="min-width: 80px" data-title="GroupName" data-value="{{GroupName}}">{{GroupName}}</td>',
                '<td style="min-width: 50px" data-title="Active" data-value="{{Active}}"><span class="">{{Badge}}</span>{{ActiveText}}</td>',
                '<td style="min-width: 80px" data-title="Creator" data-value="{{Creator}}">{{Creator}}</td>',
                '<td style="min-width: 80px" data-title="CreateTime" data-value="{{CreateTime}}">{{CreateTime}}</td>',
                '<td style="min-width: 100px" data-title="Editor" data-value="{{Editor}}">{{Editor}}</td>',
                '<td style="min-width: 50px" data-title="EditTime" data-value="{{EditTime}}">{{EditTime}}</td>',
                '<td style="min-width: 80px;color:#C7001A" data-title="ID" data-value="{{ID}}"><div class="row">',
                '<div class="col-md-12 lmvt-code-Charge lmvt-do-info">修改</div>',
                '</div></td>',
                '</tr>'
            ].join(""),
        };
        //新增实体
        Defaul_Value_Code = {
            Name: "",
            WorkShopID: 0,
            DepartmentID: 0,
            LeaderID: 0,
            MateID: 0,
            ModuleID: 0,
            //Active: 0
        };
        (function () {
            KETWROD_LIST_Code = [
                "Name|名称*",
                "WorkShopID|车间|ArrayOne",
                "DepartmentID|部门|ArrayOne",
                "LeaderID|班组长|Array",
                "MateID|班组成员|Array",
                "LineID|产线|ArrayOne",
                "PartID|工序|ArrayOne",
                "PartPointID|工步|ArrayOneControl|PartID",
                "StationID|工位|ArrayOneControl|PartPointID",
                "ModuleID|模块名称|ArrayOne",
                "Active|状态|ArrayOne",
                "CreateTime|创建时间|DateTime",
                "EditTime|编辑时间|DateTime",
            ];

            KETWROD_Code = {};

            Formattrt_Code = {};

            TypeSource_Code = {
                WorkShopID: [],
                DepartmentID: [],
                MateID: [],
                LeaderID: [],
                ModuleID: [
                    // {
                    //     name: "生产",
                    //     value: 1
                    // },
                    // {
                    //     name: "质量",
                    //     value: 2
                    // },
                    // {
                    //     name: "工艺",
                    //     value: 3
                    // },
                    // {
                    //     name: "设备",
                    //     value: 4
                    // },
                    // {
                    //     name: "仓库",
                    //     value: 4
                    // },{
                    //     name: "计量",
                    //     value: 5
                    // }
                ],
                Active: [
                    {
                        name: "保存",
                        value: 0
                    },
                    {
                        name: "激活",
                        value: 1
                    },
                    {
                        name: "禁用",
                        value: 2
                    }
                ]
            };
            $.each(KETWROD_LIST_Code, function (i, item) {
                var detail = item.split("|");
                KETWROD_Code[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_Code[detail[0]] = $com.util.getFormatter(TypeSource_Code, detail[0], detail[2]);
                }
            });
        })();

        (function () {
            KETWROD_LIST_Post = [
                "Name|名称*",
                "LineID|产线|ArrayOne",
                "PartID|工序|ArrayOne",
                "PartPointID|工步|ArrayOneControl|PartID",
                "StationID|工位|ArrayOneControl|PartID,PartPointID",
                "MateUserIDListClone|岗位人员|Array",
                "GroupID|分组名称|ArrayOne",
            ];

            KETWROD_Post = {};

            Formattrt_Post = {};

            TypeSource_Post = {
                MateUserIDListClone: [],
                GroupID: [],
                LineID: [{
                    name: "全部",
                    value: 0,
                }],
                PartID: [{
                    name: "全部",
                    value: 0,
                }],
                PartPointID: [{
                    name: "全部",
                    value: 0,
                }],
                StationID: [{
                    name: "全部",
                    value: 0,
                }],
            };
            $.each(KETWROD_LIST_Post, function (i, item) {
                var detail = item.split("|");
                KETWROD_Post[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_Post[detail[0]] = $com.util.getFormatter(TypeSource_Post, detail[0], detail[2]);
                }
            });
        })();

        (function () {
            KETWROD_LIST_Group = [
                "Name|名称*",
                "ShiftIndex|班次|ArrayOne",
                "MateUserIDList|岗位人员|Array",
            ];

            KETWROD_Group = {};

            Formattrt_Group = {};

            TypeSource_Group = {
                ShiftIndex: [
                    {
                        name: "白班",
                        value: 1
                    },
                    {
                        name: "中班",
                        value: 2
                    },
                    {
                        name: "晚班",
                        value: 3
                    }],
                MateUserIDList: []
            };
            $.each(KETWROD_LIST_Group, function (i, item) {
                var detail = item.split("|");
                KETWROD_Group[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_Group[detail[0]] = $com.util.getFormatter(TypeSource_Group, detail[0], detail[2]);
                }
            });
        })();

        model = $com.Model.create({
            name: '班组管理',
            type: $com.Model.MAIN,
            configure: function () {
                this.run();
            },

            events: function () {
                //Enter触发模糊查询事件 分组
                $(document).keyup(function (event) {
                    if (event.keyCode == 13) {
                        var value = $("#zace-searchGroup").val();
                        if (value == undefined || value == "" || value.trim().length < 1)
                            $(".zace-type-body").children("tr").show();
                        else
                            $com.table.filterByLikeString($(".zace-type-body"), TeamGroup, value, "WID");
                    }
                });
                //查询  分组
                $("body").delegate("#zace-search-levelProGroup", "click", function () {

                    var $this = $(this),
                        value = $("#zace-searchGroup").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $(".zace-type-body").children("tr").show();
                    else
                        $com.table.filterByLikeString($(".zace-type-body"), TeamGroup, value, "WID");
                });
                //Enter触发模糊查询事件 岗位
                $(document).keyup(function (event) {
                    if (event.keyCode == 13) {
                        var value = $("#zace-searchpost").val();
                        if (value == undefined || value == "" || value.trim().length < 1)
                            $(".lmvt-post-body").children("tr").show();
                        else
                            $com.table.filterByLikeString($(".lmvt-post-body"), TeamChargeShowSource, value, "ID");
                    }
                });
                //查询  岗位
                $("body").delegate("#zace-search-levelProPost", "click", function () {

                    var $this = $(this),
                        value = $("#zace-searchpost").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $(".lmvt-post-body").children("tr").show();
                    else
                        $com.table.filterByLikeString($(".lmvt-post-body"), TeamChargeShowSource, value, "ID");
                });
                //Enter触发模糊查询事件 班组
                $(document).keyup(function (event) {
                    if (event.keyCode == 13) {
                        var value = $("#zace-search").val();
                        if (value == undefined || value == "" || value.trim().length < 1)
                            $(".lmvt-encoding-body").children("tr").show();
                        else
                            $com.table.filterByLikeString($(".lmvt-encoding-body"), TeamList, value, "ID");
                    }
                });
                //查询  班组
                $("body").delegate("#zace-search-levelPro", "click", function () {

                    var $this = $(this),
                        value = $("#zace-search").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $(".lmvt-encoding-body").children("tr").show();
                    else
                        $com.table.filterByLikeString($(".lmvt-encoding-body"), TeamList, value, "ID");
                });
                //Enter触发模糊查询事件 人员
                $(document).keyup(function (event) {
                    if (event.keyCode == 13) {
                        var value = $("#zace-searchPersonnel").val();
                        if (value == undefined || value == "" || value.trim().length < 1)
                            $(".lmvt-Personnel-body").children("tr").show();
                        else
                            $com.table.filterByLikeString($(".lmvt-Personnel-body"), PersonnelSearch, value, "ID");
                    }
                });
                //查询  人员
                $("body").delegate("#zace-search-Personnel", "click", function () {
                    var $this = $(this),
                        value = $("#zace-searchPersonnel").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $(".lmvt-Personnel-body").children("tr").show();
                    else
                        $com.table.filterByLikeString($(".lmvt-Personnel-body"), PersonnelSearch, value, "ID");
                });
                //修改班组
                $("body").delegate(".lmvt-code-TeamEdit", "click", function () {

                    var $this = $(this),
                        wDBID = Number($this.closest("td").attr("data-value"));

                    var SelectArr = CodeSource.filter(item => item.ID == wDBID)[0];

                    const Defaul_Value = {
                        Name: SelectArr.Name,
                        WorkShopID: SelectArr.WorkShopID,
                        DepartmentID: SelectArr.DepartmentID,
                        ModuleID: SelectArr.ModuleID,
                        LeaderID: SelectArr.LeaderID,
                    };

                    $("body").append($com.modal.show(Defaul_Value, KETWROD_Code, "新增", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }

                        SelectArr.DepartmentID = Number(rst.DepartmentID);
                        SelectArr.Name = rst.Name;
                        SelectArr.WorkShopID = Number(rst.WorkShopID);
                        SelectArr.ModuleID = Number(rst.ModuleID);
                        SelectArr.ModuleName = Formattrt_Code["ModuleID"](rst.ModuleID);
                        SelectArr.WorkShopName = Formattrt_Code["WorkShopID"](rst.WorkShopID);
                        SelectArr.DepartmentName = Formattrt_Code["DepartmentID"](rst.DepartmentID);
                        SelectArr.LeaderID = rst.LeaderID;
                        $com.util.deleteLowerProperty(SelectArr);

                        model.com.postTeamUpdate({
                            data: SelectArr,
                        }, function (res) {
                            alert("修改成功！！");
                            model.com.refresh();
                        });

                    }, TypeSource_Code));

                });
                //增加班组
                $("body").delegate("#lmvt-encoding-add", "click", function () {

                    $("body").append($com.modal.show(Defaul_Value_Code, KETWROD_Code, "新增", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }

                        var _data = {
                            ID: 0,
                            DepartmentID: Number(rst.DepartmentID),
                            Name: rst.Name,
                            WorkShopID: Number(rst.WorkShopID),
                            ModuleID: Number(rst.ModuleID),
                            LeaderID: rst.LeaderID,
                            MateID: rst.MateID,
                            ModuleName: Formattrt_Code["ModuleID"](rst.ModuleID),
                            WorkShopName: Formattrt_Code["WorkShopID"](rst.WorkShopID),
                            DepartmentName: Formattrt_Code["DepartmentID"](rst.DepartmentID),
                            TeamChargeList: [],
                            Active: 0,
                        };
                        model.com.postTeamUpdate({
                            data: _data,
                        }, function (res) {
                            alert("新增成功！！");
                            model.com.refresh();
                        });

                    }, TypeSource_Code, function () {
                        if ($("body #femi-modal-contain .femi-modal-body .femi-modal-item #modal_select_LeaderID").val().length == 0) {
                            return "班组长必填";
                        }
                    }));

                });
                //删除班组
                $("body").delegate(".lmvt-container-main-encoding .lmvt-allowed-delete", "click", function () {
                    var $this = $(this),
                        wDBID = Number($this.closest("td").attr("data-value"));

                    var SelectObj = CodeSource.filter(item => item.ID == wDBID)[0];

                    if (!confirm("是否删除该条数据？")) {
                        return;
                    }
                    $com.util.deleteLowerProperty(SelectObj);
                    model.com.postTeamManageDelete({
                        data: SelectObj,
                    }, function (res) {
                        alert("删除成功！！");
                        model.com.refresh();
                    });
                });
                //激活班组   单条
                $("body").delegate(".lmvt-container-main-encoding .lmvt-do-active", "click", function () {
                    var $this = $(this),
                        wDBID = Number($this.closest("td").attr("data-value"));

                    const SelectArr = CodeSource.filter(item => item.ID == wDBID);

                    // if (!confirm("已选择[" + SelectObj.CodeRuleName + "]激活将导致其他同类型且正在使用的编码禁用，是否继续？")) {
                    //     return;
                    // }

                    model.com.ActiveTeamUpdate({
                        data: SelectArr,
                        Active: 1
                    }, function (res) {
                        alert("激活成功！！");
                        model.com.refresh();
                    });
                });
                //禁用班组详情   单条
                $("body").delegate(".lmvt-container-main-encoding .lmvt-do-forbidden", "click", function () {
                    var $this = $(this),
                        wDBID = Number($this.closest("td").attr("data-value"));

                    const SelectArr = CodeSource.filter(item => item.ID == wDBID);

                    // if (!confirm("已选择[" + SelectObj.CodeRuleName + "]将禁用此编码，是否继续？")) {
                    //     return;
                    // }
                    model.com.ActiveTeamUpdate({
                        data: SelectArr,
                        Active: 2
                    }, function (res) {
                        alert("禁用成功！！");
                        model.com.refresh();
                    });
                });
                //查看人员
                $("body").delegate(".SelectPersonnel", "click", function () {
                    $(".lmvt-container-main-encoding").hide();
                    $(".lmvt-container-main-Personnel").show();
                    $(".lmvt-container-main-post").hide();
                    $(".partAllStandard").hide();
                    var $this = $(this),
                        wID = Number($this.closest("td").attr("data-value"));
                    model.com.getTeamInfo({ ID: wID }, function (res) {
                        wTeamInfo = res.info;
                        model.com.refreshPeople(wTeamInfo);
                    });
                });
                //人员中删除 
                $("body").delegate(".lmvt-delete", "click", function () {
                    var $this = $(this),
                        PeopleID = Number($this.closest("td").attr("data-value"));
                    for (var m = 0; m < wTeamInfo.MateID.length; m++) {
                        if (wTeamInfo.MateID[m] == PeopleID) {
                            wTeamInfo.MateID.splice(m, 1);
                        }
                    }
                    $com.util.deleteLowerProperty(wTeamInfo);
                    model.com.postTeamUpdate({
                        data: wTeamInfo,
                    }, function (res) {
                        alert("删除成功！！");
                        model.com.getTeamInfo({ ID: wTeamInfo.ID }, function (res) {
                            model.com.refreshPeople(res.info);
                        });
                    });
                });
                //人员中新增
                $("body").delegate("#lmvt-Personnel-add", "click", function () {
                    DataArray = $com.util.Clone(wTeamInfo);
                    EchoData = [];
                    if (DataArray.MateID.length > 0) {
                        EchoData = DataArray.MateID;
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
                        title1: "宁波中车新能源",  //主标题
                        title2: "宁波", //公司部门
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
                        DataArray.MateID = StrArray;
                        $com.util.deleteLowerProperty(DataArray);
                        model.com.postTeamUpdate({
                            data: DataArray,
                        }, function (res) {
                            alert("新增成功！！");
                            model.com.getTeamInfo({ ID: DataArray.ID }, function (res) {
                                model.com.refreshPeople(res.info);
                            });
                        });
                    });
                });
                //从人员中返回 
                $("body").delegate("#lmvt-Personnel-back", "click", function () {
                    $(".lmvt-container-main-encoding").show();
                    $(".lmvt-container-main-Personnel").hide();
                    $(".lmvt-container-main-post").hide();
                    $(".partAllStandard").hide();
                    model.com.refresh();
                });
                //查询岗位信息
                $("body").delegate(".SelectPost", "click", function () {
                    $(".lmvt-container-main-encoding").hide();
                    $(".lmvt-container-main-Personnel").hide();
                    $(".lmvt-container-main-post").show();
                    $(".partAllStandard").hide();
                    var $this = $(this);
                    wChargeID = Number($this.closest("td").attr("data-value"));
                    model.com.refreshTeamChargeAll(wChargeID);
                });
                //岗位信息返回
                $("body").delegate("#lmvt-post-back", "click", function () {
                    $(".lmvt-container-main-encoding").show();
                    $(".lmvt-container-main-Personnel").hide();
                    $(".lmvt-container-main-post").hide();
                    $(".partAllStandard").hide();
                });
                //查询分组信息
                $("body").delegate(".SelectTeam", "click", function () {
                    $(".lmvt-container-main-encoding").hide();
                    $(".lmvt-container-main-Personnel").hide();
                    $(".lmvt-container-main-post").hide();
                    $(".partAllStandard").show();
                    var $this = $(this);
                    wGroupID = Number($this.closest("td").attr("data-value"));
                    model.com.GroupAllRefresh(wGroupID);
                });
                $("body").delegate("#lmvt-standardtable-refresh", "click", function () {
                    model.com.GroupAllRefresh(wGroupID);
                });

                //分组信息返回
                $("body").delegate("#lmvt-standardtable-Close", "click", function () {
                    $(".lmvt-container-main-encoding").show();
                    $(".lmvt-container-main-Personnel").hide();
                    $(".lmvt-container-main-post").hide();
                    $(".partAllStandard").hide();
                });
                //增加岗位
                $("body").delegate("#lmvt-post-add", "click", function () {
                    Defaul_Value_Post = {
                        Name: "",
                        LineID: 0,
                        PartID: 0,
                        PartPointID: 0,
                        StationID: 0,
                        // GroupID: 0,
                        MateUserIDListClone: 0,
                    }
                    $("body").append($com.modal.show(Defaul_Value_Post, KETWROD_Post, "新增", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }
                        if (Number(rst.LineID) == 0) {
                            alert("请选择产线！");
                            return false;
                        }
                        if (Number(rst.PartID) == 0) {
                            alert("请选择产线！");
                            return false;
                        }
                        if (Number(rst.PartPointID) == 0) {
                            alert("请选择工步！");
                            return false;
                        }
                        if (Number(rst.StationID) == 0) {
                            alert("请选择工位！");
                            return false;
                        }
                        var _data = {
                            ID: 0,
                            Name: rst.Name,
                            TeamID: wChargeID,
                            LineID: Number(rst.LineID),
                            PartID: Number(rst.PartID),
                            PartPointID: Number(rst.PartPointID),
                            StationID: Number(rst.StationID),
                            MateUserIDList: rst.MateUserIDListClone,
                            Active: 0,
                            // GroupID: Number(rst.GroupID)
                        };
                        model.com.postTeamChargeItemUpdate({
                            data: _data,
                        }, function (res) {
                            alert("新增成功！！");
                            model.com.refreshTeamChargeAll(wChargeID);
                        });

                    }, TypeSource_Post));

                });
                //修改岗位
                $("body").delegate(".lmvt-code-Postedit", "click", function () {
                    var $this = $(this),
                        wDBID = Number($this.closest("td").attr("data-value"));

                    var SelectArr = TeamChargeShowSourceEdit.filter(item => item.ID == wDBID)[0];

                    var Defaul_Value = {

                        MateUserIDListClone: SelectArr.MateUserIDList,
                    };
                    $("body").append($com.modal.show(Defaul_Value, KETWROD_Post, "修改", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }
                        SelectArr.MateUserIDList = rst.MateUserIDListClone;
                        $com.util.deleteLowerProperty(SelectArr);
                        model.com.postTeamChargeItemUpdate({
                            data: SelectArr,
                        }, function (res) {
                            alert("修改成功！！");
                            model.com.refreshTeamChargeAll(wChargeID);
                        });

                    }, TypeSource_Post));

                });

                //激活岗位   单条
                $("body").delegate(".lmvt-container-main-post .lmvt-do-active", "click", function () {
                    var $this = $(this),
                        wDBID = Number($this.closest("td").attr("data-value"));

                    const SelectArr = TeamChargeShowSource.filter(item => item.ID == wDBID);

                    // if (!confirm("已选择[" + SelectObj.CodeRuleName + "]激活将导致其他同类型且正在使用的编码禁用，是否继续？")) {
                    //     return;
                    // }

                    model.com.ActiveTeamChargeUpdate({
                        data: SelectArr,
                        Active: 1
                    }, function (res) {
                        alert("激活成功！！");
                        model.com.refreshTeamChargeAll(wChargeID);
                    });
                });

                //禁用岗位详情   单条
                $("body").delegate(".lmvt-container-main-post .lmvt-do-forbidden", "click", function () {
                    var $this = $(this),
                        wDBID = Number($this.closest("td").attr("data-value"));

                    const SelectArr = TeamChargeShowSource.filter(item => item.ID == wDBID);

                    // if (!confirm("已选择[" + SelectObj.CodeRuleName + "]将禁用此编码，是否继续？")) {
                    //     return;
                    // }
                    model.com.ActiveTeamChargeUpdate({
                        data: SelectArr,
                        Active: 2
                    }, function (res) {
                        alert("禁用成功！！");
                        model.com.refreshTeamChargeAll(wChargeID);
                    });
                });

                //删除岗位
                $("body").delegate(".lmvt-container-main-post .lmvt-allowed-delete", "click", function () {
                    var $this = $(this),
                        wDBID = Number($this.closest("td").attr("data-value"));

                    var SelectObj = TeamChargeShowSource.filter(item => item.ID == wDBID)[0];

                    if (!confirm("是否删除该条数据？")) {
                        return;
                    }
                    $com.util.deleteLowerProperty(SelectObj);
                    model.com.postTeamChargeDelete({
                        data: SelectObj,
                    }, function (res) {
                        alert("删除成功！！");
                        model.com.refreshTeamChargeAll(wChargeID);
                    });
                });
                //监听产线
                $("body").delegate(".modal .femi-modal-body .femi-modal-item select#modal_select_LineID", "change", function (e) {
                    var $this = $(this);

                    wLineID = Number($this.val());

                    model.com.getFMCLineUnitTree({ LineID: wLineID, ProductID: 0, ID: 0 }, function (resW) {
                        if (!resW)
                            return;
                        if (resW && resW.list) {

                            PartUnitList = resW.list;

                            var $SelectPartID = $("#modal_select_PartID"),
                                SELECT_OPTION_HTML_PartID = '<option value="{{value}}">{{name}}</option>',
                                FormList = [{ name: "全部", value: 0 }];

                            // TypeSource_Code.PartID = [{ name: "全部", value: 0 }];
                            $.each(resW.list, function (i, item) {
                                // TypeSource_Code.PartID.push({
                                //     name: item.Name,
                                //     value: item.UnitID,
                                // });
                                FormList.push({
                                    name: item.Name,
                                    value: item.UnitID,
                                });

                            });
                            $SelectPartID.empty();
                            $SelectPartID.append($com.util.template(FormList, SELECT_OPTION_HTML_PartID));
                            $SelectPartID.selectpicker('render');
                            $SelectPartID.selectpicker('refresh');
                            $SelectPartID.selectpicker();

                            $("#modal_select_PartID").val(0).trigger('change');
                        }
                    });
                });
                //监听工序
                $("body").delegate(".modal .femi-modal-body .femi-modal-item select#modal_select_PartID", "change", function (e) {
                    var $this = $(this);

                    wPartID = Number($this.val());

                    var $SelectPartPointID = $("#modal_select_PartPointID"),
                        SELECT_OPTION_HTML_PartPointID = '<option value="{{value}}">{{name}}</option>',
                        FormList = [{ name: "全部", value: 0 }];

                    //TypeSource_Code.PartPointID = []
                    $.each(PartUnitList, function (i, item) {
                        if (item.UnitID == wPartID) {

                            PartPointUnitList = item.UnitList;

                            $.each(item.UnitList, function (j, jtem) {
                                // TypeSource_Code.PartPointID.push({
                                //     name: jtem.Name,
                                //     value: jtem.UnitID,
                                // });
                                FormList.push({
                                    name: jtem.Name,
                                    value: jtem.UnitID,
                                });
                            });
                        }
                    });
                    $SelectPartPointID.empty();
                    $SelectPartPointID.append($com.util.template(FormList, SELECT_OPTION_HTML_PartPointID));
                    $SelectPartPointID.selectpicker('render');
                    $SelectPartPointID.selectpicker('refresh');
                    $SelectPartPointID.selectpicker();

                    $("#modal_select_PartPointID").val(0).trigger('change');
                });
                //监听工步
                $("body").delegate(".modal .femi-modal-body .femi-modal-item select#modal_select_PartPointID", "change", function (e) {
                    var $this = $(this);

                    wPartPointID = Number($this.val());

                    var $SelectStationID = $("#modal_select_StationID"),
                        SELECT_OPTION_HTML_StationID = '<option value="{{value}}">{{name}}</option>',
                        FormList = [{ name: "全部", value: 0 }];

                    //TypeSource_Code.StationID = []
                    $.each(PartPointUnitList, function (i, item) {

                        if (item.UnitID == wPartPointID) {

                            $.each(item.UnitList, function (j, jtem) {
                                // TypeSource_Code.StationID.push({
                                //     name: jtem.Name,
                                //     value: jtem.UnitID,
                                // });
                                FormList.push({
                                    name: jtem.Name,
                                    value: jtem.UnitID,
                                });
                            });
                        }
                    });
                    $SelectStationID.empty();
                    $SelectStationID.append($com.util.template(FormList, SELECT_OPTION_HTML_StationID));
                    $SelectStationID.selectpicker('render');
                    $SelectStationID.selectpicker('refresh');
                    $SelectStationID.selectpicker();
                });

                //新增分组组
                $("body").delegate("#lmvt-standarditem-group", "click", function () {

                    var Defaul_Value_ItemGroup = {
                        Name: '',
                        ShiftIndex: 0,
                    }
                    $("body").append($com.modal.show(Defaul_Value_ItemGroup, KETWROD_Group, "新增组", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }
                        model.com.getTeamInfo({ ID: wGroupID }, function (res) {
                            var _data = {
                                Name: rst.Name,
                                TeamID: wGroupID,
                                ShiftIndex: Number(rst.ShiftIndex),
                                LeaderID: res.info.LeaderID,
                                Active: 1,
                            };
                            model.com.postGroupUpdate({
                                data: _data,
                            }, function (res) {
                                alert("新增分组成功！");
                                model.com.GroupAllRefresh(wGroupID);
                            });
                        });
                    }, TypeSource_Group));
                });

                //分组中修改人员
                $("body").delegate(".lmvt-code-Charge", "click", function () {
                    var $this = $(this),
                        wDBID = Number($this.closest("td").attr("data-value"));

                    var SelectArr = TeamGroup.filter(item => item.ID == wDBID)[0];
                    ChargeGroupID = SelectArr.GroupID;
                    var MateUserArray = [];
                    for (var i = 0; i < wUser.length; i++) {
                        for (var k = 0; k < SelectArr.ItemUserIDList.length; k++) {
                            if (SelectArr.ItemUserIDList[k] == wUser[i].ID) {
                                MateUserArray.push({
                                    ID: wUser[i].ID,
                                    Name: wUser[i].Name,
                                });
                            }
                        }
                    }
                    TypeSource_Group.MateUserIDList = [];
                    $.each(MateUserArray, function (i, item) {
                        TypeSource_Group.MateUserIDList.push({
                            name: item.Name,
                            value: item.ID
                        });
                    });
                    const Defaul_Value = {
                        MateUserIDList: SelectArr.MateUserIDList,
                    };
                    $("body").append($com.modal.show(Defaul_Value, KETWROD_Group, "修改", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }
                        SelectArr.MateUserIDList = rst.MateUserIDList;
                        $com.util.deleteLowerProperty(SelectArr);
                        model.com.postTeamChargeUpdate({
                            data: SelectArr,
                        }, function (res) {
                            alert("修改成功！！");
                            model.com.StandardItem(ChargeGroupID);
                        });

                    }, TypeSource_Group));
                });


                $("body").delegate("#lmvt-model-product", "click", function (e) {
                    $(".lmvt-container-main-encoding .lmvt-changeMoName").text("生产");
                    ModeuleType = 1;
                    model.com.refresh();
                });

                $("body").delegate("#lmvt-model-quality", "click", function (e) {
                    $(".lmvt-container-header-btn .lmvt-changeMoName").text("质量");
                    ModeuleType = 2;
                    model.com.refresh();
                });
                $("body").delegate("#lmvt-model-technology", "click", function (e) {
                    $(".lmvt-container-header-btn .lmvt-changeMoName").text("工艺");
                    ModeuleType = 3;
                    model.com.refresh();
                });
                $("body").delegate("#lmvt-model-store", "click", function (e) {
                    $(".lmvt-container-header-btn .lmvt-changeMoName").text("仓库");
                    ModeuleType = 5;
                    model.com.refresh();
                });
                $("body").delegate("#lmvt-model-device", "click", function (e) {
                    $(".lmvt-container-header-btn .lmvt-changeMoName").text("设备");
                    ModeuleType = 4;
                    model.com.refresh();
                });
                $("body").delegate("#lmvt-model-deviceJL", "click", function (e) {
                    $(".lmvt-container-header-btn .lmvt-changeMoName").text("计量");
                    ModeuleType = 6;
                    model.com.refresh();
                });
            },
            run: function () {
                LoginOBJ = window.parent.User_Info;
                TypeSource_Code.ModuleID = [];
                for (var m = 0; m < LoginOBJ.RoleList.length; m++) {
                    if (LoginOBJ.RoleList[m].FunctionID == 900612) {
                        qualityBool = true;
                        TypeSource_Code.ModuleID.push({
                            name: "质量",
                            value: 2
                        });
                        ModeuleType = 2;
                    }
                    if (LoginOBJ.RoleList[m].FunctionID == 900613) {
                        technologyBool = true;
                        TypeSource_Code.ModuleID.push({
                            name: "工艺",
                            value: 3
                        })
                        ModeuleType = 3;
                    }
                    if (LoginOBJ.RoleList[m].FunctionID == 900614) {
                        storeBool = true;
                        TypeSource_Code.ModuleID.push({
                            name: "仓库",
                            value: 5
                        })
                        ModeuleType = 5;
                    }
                    if (LoginOBJ.RoleList[m].FunctionID == 900615) {
                        deviceBool = true;
                        TypeSource_Code.ModuleID.push({
                            name: "设备",
                            value: 4
                        })
                        ModeuleType = 4;
                    }
                    if (LoginOBJ.RoleList[m].FunctionID == 900616) {
                        deviceJLBool = true;
                        TypeSource_Code.ModuleID.push({
                            name: "计量",
                            value: 6
                        })
                        ModeuleType = 6;
                    }
                    if (LoginOBJ.RoleList[m].FunctionID == 900611) {
                        productBool = true;
                        TypeSource_Code.ModuleID.push({
                            name: "生产",
                            value: 1
                        })
                        ModeuleType = 1;
                    }
                }

                if (deviceJLBool) {
                    $("#lmvt-model-deviceJL").show();
                    ModeuleType = 6;
                }
                if (storeBool) {
                    $("#lmvt-model-store").show();
                    ModeuleType = 5;
                }
                if (deviceBool) {
                    $("#lmvt-model-device").show();
                    ModeuleType = 4;
                }

                if (technologyBool) {
                    $("#lmvt-model-technology").show();
                    ModeuleType = 3;
                }
                if (qualityBool) {
                    $("#lmvt-model-quality").show();
                    ModeuleType = 2;
                }
                if (productBool) {
                    $("#lmvt-model-product").show();
                    ModeuleType = 1;
                }
                model.com.getGroupAll({
                    TeamID: wGroupID, Active: 1
                }, function (res) {
                    wGroupAllList = res.list;
                    $.each(wGroupAllList, function (i, item) {
                        TypeSource_Post.GroupID.push({
                            name: item.Name,
                            value: item.ID
                        });
                    });

                    model.com.getFMCLine({
                        FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0
                    }, function (resF) {
                        wLine = resF.list;
                        $.each(wLine, function (i, item) {
                            TypeSource_Post.LineID.push({
                                name: item.Name,
                                value: item.ID
                            });
                        });
                        model.com.getUser({ Active: 1 }, function (res) {
                            wUser = res.list;
                            TypeSource_Code.MateID = [];
                            TypeSource_Code.LeaderID = [];
                            $.each(wUser, function (i, item) {
                                TypeSource_Code.MateID.push({
                                    name: item.Name,
                                    value: item.ID
                                });
                                TypeSource_Code.LeaderID.push({
                                    name: item.Name,
                                    value: item.ID
                                });
                            });
                            model.com.getDepartment({}, function (resD) {
                                wDepartment = resD.list;
                                TypeSource_Code.DepartmentID = [];
                                $.each(wDepartment, function (i, item) {
                                    TypeSource_Code.DepartmentID.push({
                                        name: item.Name,
                                        value: item.ID
                                    });
                                });
                                model.com.getWorkShop({
                                    FactoryID: 0, BusinessUnitID: 0
                                }, function (resW) {
                                    wWorkShop = resW.list;
                                    TypeSource_Code.WorkShopID = [];
                                    $.each(wWorkShop, function (i, item) {
                                        TypeSource_Code.WorkShopID.push({
                                            name: item.Name,
                                            value: item.ID
                                        });
                                    });
                                    model.com.refresh();
                                })
                            });
                        });
                    });
                });
            },
            com: {
                StandardTreeBuild: function (list) {
                    if (list.length > 0)
                        $.each(list, function (i, item) {

                            if (item.ItemIPTList && item.ItemIPTList.length > 0) {
                                var Counts = item.ItemIPTList.length;
                                item.text = item.Name + "(" + ShiftIndexList[item.ShiftIndex] + ")";
                                item.nodes = item.ItemIPTList;
                                item.tags = [Counts];
                                model.com.StandardTreeBuild(item.ItemIPTList);
                            } else {
                                item.text = item.Name;
                            }
                        });

                    return list;
                },
                StandardItem: function (GroupID) {
                    model.com.getTeamChargeGroupAll({
                        StationID: -1, TeamID: wGroupID, GroupID: GroupID, WorkShopID: -1,
                        DepartmentID: -1, ModuleID: ModeuleType, LineID: -1, PartID: -1, PartPointID: -1, Active: -1,
                    }, function (resC) {
                        wTeamList = resC.list;
                        for (var m = 0; m < wTeamList.length; m++) {
                            wTeamList[m].WID = m + 1;
                            if (wTeamList[m].Active == 1) {
                                wTeamList[m].ActiveText = "激活";
                            } else if (wTeamList[m].Active == 2) {
                                wTeamList[m].ActiveText = "禁用";
                            } else if (wTeamList[m].Active == 0) {
                                wTeamList[m].ActiveText = "默认";
                            }

                            for (var k = 0; k < wGroupAllList.length; k++) {
                                if (wTeamList[m].GroupID == wGroupAllList[k].ID) {
                                    wTeamList[m].GroupName = wGroupAllList[k].Name;
                                }
                            }
                            wTeamList[m].CreateTime = $com.util.format("yyyy-MM-dd hh:mm:ss", wTeamList[m].CreateTime);
                            wTeamList[m].EditTime = $com.util.format("yyyy-MM-dd hh:mm:ss", wTeamList[m].EditTime);
                        }
                        TeamGroup = $com.util.Clone(wTeamList);

                        $(".zace-type-body").html($com.util.template(wTeamList, HTML.ItemList));
                    });
                },
                GroupAllRefresh: function (wGroupID) {
                    model.com.getGroupAll({
                        TeamID: wGroupID, Active: 1
                    }, function (res) {
                        wGroupAll = res.list;
                        model.com.getTeamChargeGroupAll({
                            TeamID: wGroupID, StationID: -1, GroupID: -1, WorkShopID: -1,
                            DepartmentID: -1, ModuleID: ModeuleType, LineID: -1, PartID: -1, PartPointID: -1, Active: -1
                        }, function (res) {
                            var TeamChargeList = res.list;
                            var WantData = [];
                            for (var m = 0; m < wGroupAll.length; m++) {
                                wGroupAll[m].ItemIPTList = [];
                                wGroupAll[m].GroupID = wGroupAll[m].ID;
                                for (var n = 0; n < TeamChargeList.length; n++) {
                                    if (wGroupAll[m].ID == TeamChargeList[n].GroupID) {
                                        wGroupAll[m].ItemIPTList.push(TeamChargeList[n]);
                                    }
                                }
                                WantData.push(wGroupAll[m]);
                            }
                            model.com.renderTreeStandard(WantData);
                        });
                    });
                },
                renderTreeStandard: function (list) {

                    list = model.com.StandardTreeBuild(list);

                    var ItemNode = 0;

                    $("#standardItem").treeview({

                        color: "black",
                        expandIcon: "glyphicon glyphicon-plus",
                        collapseIcon: "glyphicon glyphicon-minus",

                        preventUnselect: true,

                        levels: 0,

                        nodeIcon: "glyphicon glyphicon-tags",

                        showTags: true,
                        data: list,

                        onNodeSelected: function (event, data) {

                            StandardNodeID = data.nodeId;
                            ItemNode = data.nodeId;
                            var sels = $('#standardItem').treeview('getSelected');
                            for (var i = 0; i < sels.length; i++) {
                                if (sels[i].nodeId == data.nodeId) {
                                    continue;
                                }
                                $('#standardItem').treeview('unselectNode', [sels[i].nodeId, { silent: true }]);
                            }
                            $("#standardItem").treeview('selectNode', [data.nodeId, { silent: true }]);


                            GroupID = data.GroupID;
                            ZaceLineID = 0;
                            ChangeData = 0;
                            model.com.StandardItem(GroupID);
                        },
                        onNodeUnselected: function (event, data) {
                            if (ItemNode != data.nodeId)
                                return false;
                            $('#standardItem').treeview('toggleNodeSelected', [ItemNode, { silent: true }]);
                        }

                    });
                },
                refreshTeamChargeAll: function (wChargeID) {

                    model.com.getTeamChargeItemAll({
                        TeamID: wChargeID, StationID: -1, GroupID: -1, WorkShopID: -1,
                        DepartmentID: -1, ModuleID: ModeuleType, LineID: -1, PartID: -1, PartPointID: -1, Active: -1
                    }, function (res) {
                        wTeamChargeList = res.list;
                        model.com.getTeamInfo({ ID: wChargeID }, function (res) {
                            var MateUser = [];
                            for (var i = 0; i < wUser.length; i++) {
                                for (var j = 0; j < res.info.MateID.length; j++) {
                                    if (wUser[i].ID == res.info.MateID[j]) {
                                        MateUser.push({
                                            ID: wUser[i].ID,
                                            Name: wUser[i].Name
                                        })
                                    }
                                }
                            }
                            TypeSource_Post.MateUserIDListClone = [];
                            $.each(MateUser, function (i, item) {
                                TypeSource_Post.MateUserIDListClone.push({
                                    name: item.Name,
                                    value: item.ID
                                });
                            });
                            model.com.refreshTeamCharge(wTeamChargeList);
                        });
                    });
                },
                refreshTeamCharge: function (wTeamChargeList) {
                    TeamChargeShow = $com.util.Clone(wTeamChargeList);
                    TeamChargeShowSourceEdit = $com.util.Clone(TeamChargeShow);
                    $.each(TeamChargeShow, function (i, item) {
                        for (var k = 0; k < wGroupAllList.length; k++) {
                            if (item.GroupID == wGroupAllList[k].ID) {
                                item.GroupName = wGroupAllList[k].Name;
                            }
                        }
                        item.CreateTime = $com.util.format("yyyy-MM-dd hh:mm:ss", item.CreateTime);
                        item.EditTime = $com.util.format("yyyy-MM-dd hh:mm:ss", item.EditTime);
                        item.Badge = " ";
                        item.WID = i + 1;
                        if (item.Active == 0) {
                            item.ActiveText = "默认";
                            item.ActiveType = "激活";
                            item.ISDo = "lmvt-do-active";
                            item.ClassBadge = "lmvt-defBadge";
                            item.ISAllowed = "lmvt-allowed-delete";
                            item.ISReset = "lmvt-reset";
                        } else if (item.Active == 1) {
                            item.ActiveText = "激活";
                            item.ActiveType = "禁用";
                            item.ISDo = "lmvt-do-forbidden";
                            item.ClassBadge = "lmvt-activeBadge";
                            item.ISAllowed = "lmvt-not-allowed-delete";
                            item.ISReset = "lmvt-not-allowed-delete";
                        } else {
                            item.ActiveText = "禁用";
                            item.ActiveType = "激活";
                            item.ISDo = "lmvt-do-active";
                            item.ClassBadge = "lmvt-forbiddenBadge";
                            item.ISAllowed = "lmvt-not-allowed-delete";
                            item.ISReset = "lmvt-not-allowed-delete";
                        }
                    });
                    TeamChargeShowSource = $com.util.Clone(TeamChargeShow);
                    $(".lmvt-post-body").html($com.util.template(TeamChargeShow, HTML.PostList));
                },
                refreshPeople: function (wTeamInfo) {
                    var PersonnelList = [];
                    var k = 0;
                    for (var m = 0; m < wTeamInfo.MateID.length; m++) {
                        for (var n = 0; n < wUser.length; n++) {
                            if (wUser[n].ID == wTeamInfo.MateID[m]) {
                                k = k + 1;
                                wUser[n].WID = k;
                                wUser[n].LeaderName = wTeamInfo.Name;
                                if (wUser[n].Active == 0) {
                                    wUser[n].ActiveText = "默认";
                                } else if (wUser[n].Active == 1) {
                                    wUser[n].ActiveText = "激活";
                                } else if (wUser[n].Active == 2) {
                                    wUser[n].ActiveText = "禁用";
                                }
                                wUser[n].CreatorID = wTeamInfo.CreatorID;
                                wUser[n].CreateTime = $com.util.format("yyyy-MM-dd hh:mm:ss", wTeamInfo.CreateTime);
                                wUser[n].EditTime = $com.util.format("yyyy-MM-dd hh:mm:ss", wTeamInfo.EditTime);
                                wUser[n].EditorID = wTeamInfo.EditorID;
                                wUser[n].Editor = wTeamInfo.Editor;
                                wUser[n].Creator = wTeamInfo.Creator;
                                PersonnelList.push(wUser[n]);
                            }
                        }
                    }
                    PersonnelSearch = $com.util.Clone(PersonnelList);
                    $(".lmvt-Personnel-body").html($com.util.template(PersonnelList, HTML.PersonnelList));
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
                unique: function (arr) {
                    for (var i = 0; i < arr.length; i++) {
                        for (var j = i + 1; j < arr.length; j++) {
                            if (arr[i] == arr[j]) { //第一个等同于第二个，splice方法删除第二个
                                arr.splice(j, 1);
                                j--;
                            }
                        }
                    }
                    return arr;
                },
                //产线单元
                getFMCLineUnitTree: function (data, fn, context) {
                    var d = {
                        $URI: "/FMCLineUnit/Tree",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //查询工位库列表
                getFMCStation: function (data, fn, context) {
                    var d = {
                        $URI: "/FMCStation/All",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //查询工序库列表
                getFPCPart: function (data, fn, context) {
                    var d = {
                        $URI: "/FPCPart/All",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //查询工序段列表
                getFPCPartPoint: function (data, fn, context) {
                    var d = {
                        $URI: "/FPCPartPoint/All",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取产线
                getFMCLine: function (data, fn, context) {
                    var d = {
                        $URI: "/FMCLine/All",
                        $TYPE: "get",
                    };
                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取车间
                getWorkShop: function (data, fn, context) {
                    var d = {
                        $URI: "/FMCWorkShop/All",
                        $TYPE: "get",
                    };
                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取人员
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
                //部门列表
                getDepartment: function (data, fn, context) {
                    var d = {
                        $URI: "/Department/AllDepartment",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //激活班组
                ActiveTeamUpdate: function (data, fn, context) {
                    var d = {
                        $URI: "/TeamManage/Active",
                        $TYPE: "post",
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //激活岗位
                ActiveTeamChargeUpdate: function (data, fn, context) {
                    var d = {
                        $URI: "/TeamCharge/ItemActive",
                        $TYPE: "post",
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //新增班组
                postTeamUpdate: function (data, fn, context) {
                    var d = {
                        $URI: "/TeamManage/Update",
                        $TYPE: "post",
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //删除班组
                postTeamManageDelete: function (data, fn, context) {
                    var d = {
                        $URI: "/TeamManage/Delete",
                        $TYPE: "post",
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //班组查询
                getTeamAll: function (data, fn, context) {
                    var d = {
                        $URI: "/TeamManage/All",
                        $TYPE: "get",
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //班组查询
                getTeamInfo: function (data, fn, context) {
                    var d = {
                        $URI: "/TeamManage/Info",
                        $TYPE: "get",
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //岗位查询 分组
                getTeamChargeGroupAll: function (data, fn, context) {
                    var d = {
                        $URI: "/TeamCharge/All",
                        $TYPE: "get",
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //岗位查询（模板）
                getTeamChargeItemAll: function (data, fn, context) {
                    var d = {
                        $URI: "/TeamCharge/ItemAll",
                        $TYPE: "get",
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //岗位新增
                postTeamChargeUpdate: function (data, fn, context) {
                    var d = {
                        $URI: "/TeamCharge/Update",
                        $TYPE: "post",
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //岗位新增
                postTeamChargeItemUpdate: function (data, fn, context) {
                    var d = {
                        $URI: "/TeamCharge/ItemUpdate",
                        $TYPE: "post",
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //删除岗位
                postTeamChargeDelete: function (data, fn, context) {
                    var d = {
                        $URI: "/TeamCharge/ItemDelete",
                        $TYPE: "post",
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //分组新增
                postGroupUpdate: function (data, fn, context) {
                    var d = {
                        $URI: "/TeamCharge/GroupUpdate",
                        $TYPE: "post",
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //查询分组
                getGroupAll: function (data, fn, context) {
                    var d = {
                        $URI: "/TeamCharge/GroupAll",
                        $TYPE: "get",
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                refresh: function () {
                    //班组列表
                    model.com.getTeamAll({
                        Active: -1, ModuleID: ModeuleType, DepartmentID: -1, WorkShopID: -1, LeaderID: -1
                    }, function (res) {
                        CodeSource = $com.util.Clone(res.list);
                        TeamList = $com.util.Clone(res.list);
                        $.each(TeamList, function (i, item) {
                            item.Badge = " ";
                            item.WID = i + 1;

                            if (item.Active == 0) {
                                item.ActiveType = "激活";
                                item.ISDo = "lmvt-do-active";
                                item.ClassBadge = "lmvt-defBadge";
                                item.ISAllowed = "lmvt-allowed-delete";
                                item.ISReset = "lmvt-reset";
                            } else if (item.Active == 1) {
                                item.ActiveType = "禁用";
                                item.ISDo = "lmvt-do-forbidden";
                                item.ClassBadge = "lmvt-activeBadge";
                                item.ISAllowed = "lmvt-not-allowed-delete";
                                item.ISReset = "lmvt-not-allowed-delete";
                            } else {
                                item.ActiveType = "激活";
                                item.ISDo = "lmvt-do-active";
                                item.ClassBadge = "lmvt-forbiddenBadge";
                                item.ISAllowed = "lmvt-not-allowed-delete";
                                item.ISReset = "lmvt-not-allowed-delete";
                            }
                            for (var p in item) {
                                if (!Formattrt_Code[p] || p == "LeaderID" || p == "MateID")
                                    continue;
                                item[p] = Formattrt_Code[p](item[p]);
                            }

                            for (const m in item.LeaderID) {
                                item.LeaderID[m] = wUser.filter((k) => { return k.ID == item.LeaderID[m] })[0].Name;
                            }

                            item.LeaderIDList = item.LeaderID.join();

                            for (const m in item.MateID) {
                                item.MateID[m] = wUser.filter((k) => { return k.ID == item.MateID[m] })[0].Name;
                            }
                            item.MateIDList = item.MateID.join();

                        });
                        $(".lmvt-encoding-body").html($com.util.template(TeamList, HTML.TeamList));

                        if (ModeuleType == -1) {
                            $(".encodingTitle").text("班组管理");
                        } else {
                            $(".encodingTitle").text(ModeuleTypeList[ModeuleType] + "-" + "班组管理");
                        }
                        $(".lmvt-changeMoName").text(ModeuleTypeList[ModeuleType]);
                        if (!productBool && !qualityBool && !technologyBool && !storeBool && !deviceBool && !deviceJLBool) {
                            var NullArray = [];
                            $(".lmvt-encoding-body").html($com.util.template(NullArray, HTML.TeamList));
                            $(".LIList").hide();
                        }
                    });
                },
            },
        });
        model.init();
    });