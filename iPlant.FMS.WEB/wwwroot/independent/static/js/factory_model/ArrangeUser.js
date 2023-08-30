require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/paging', '../static/utils/js/base/jquery.treeview'],
    function ($lin, $com, $page, $jqui, $tree) {

        var HTML,
            //查询条件
            wWorkShopID,
            wDepartmentID,
            wModuleID,
            wActive,
            wStationID = -1,
            wLineID = -1,
            wPartID = -1,
            wPartPointID = -1,

            ISLookInfo = true,

            //编码集合
            CodeList,
            //规则集合
            CodeRuleList,
            CodeSource,

            //是否可以修改
            ISUpdate = true,

            //实体
            Defaul_Value_Code,
            KETWROD_LIST_Code,
            KETWROD_Code,
            Formattrt_Code,
            TypeSource_Code,
            //规则
            Defaul_Value_Rule,
            KETWROD_LIST_Rule,
            KETWROD_Rule,
            Formattrt_Rule,
            TypeSource_Rule,
            //分类
            Defaul_Value_Tab,
            KETWROD_LIST_Tab,
            KETWROD_Tab,
            Formattrt_Tab,
            TypeSource_Tab,
            //分类数据
            Tapsource,
            //新增的数据
            RuleAddSource = [],
            RuleAddList = [],

            //实体ID
            RuleID,
            //规则渲染数据
            CodeRanderSource,

            UserAll,

            WorkShopIDList,

            LineList,
            StationList,
            //全局班组ID
            TeamID,

            wModuleID,

            TemplateLineID,

            ISModeTrue = true,

            PartPointUnitList,
            PartUnitList = [],
            LineUnitList,

            CertificateList,

            NowAcitve,
            CertificateSource,
            CertificateList,
            PositionObj,
            wShiftIndex = 1,

            partSource;

        UserAll = window.parent._UserAll;
        WorkShopIDList = window.parent._WorkShop;
        LineList = window.parent._Line;
        StationList = window.parent._Station;
        StartTime = $com.util.format("yyyy-MM-dd", new Date(new Date().getTime() + 24 * 3600000));
        EndTime = $com.util.format("yyyy-MM-dd", new Date(new Date(StartTime).getTime() + 24 * 3600000));

        HTML = {
            TreeItemNode: [
                '<li data-titie="{{ID}}"  data-value="{{ID}}"  >',
                '<span style="vertical-align:top;Color:{{ColorText}}" data-value="{{ID}}" data-core="{{ColorText}}" >{{Name}}</span> ',
                '<ul>{{Items}}',
                '</ul>',
                '</li>',
            ].join(""),
            TabTep: [
                '<tr>',
                '<td style="min-width: 3px;display: none;"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></td>',
                '<td style="min-width: 40px" data-title="GroupName" data-value="{{GroupName}}">{{GroupName}}</td>',
                '<td style="max-width: 80px;" data-title="DBID" data-value="{{DBID}}"><div class="row">',
                '<div class="col-md-6 lmvt-edit" style="color:#409EFF;">编辑</div>',
                '<div class="col-md-6 lmvt-tab-delete" style="color:#FF0000">删除</div>',
                '</div></td>',
                '</tr>'
            ].join(""),
            CodeList: [
                '<tr>',
                '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></td>',
                '<td style="min-width: 50px" data-title="WID" data-value="{{WID}}">{{WID}}</td>',
                '<td style="min-width: 80px" data-title="Code" data-value="{{Code}}">{{Code}}</td>',
                '<td style="min-width: 80px" data-title="TemplateVersionNo" data-value="{{TemplateVersionNo}}">{{TemplateVersionNo}}</td>',
                '<td style="min-width: 80px" data-title="StartTime" data-value="{{StartTime}}">{{StartTime}}</td>',
                '<td style="min-width: 50px" data-title="EndTime" data-value="{{EndTime}}">{{EndTime}}</td>',
                '<td style="min-width: 50px" data-title="ModuleName" data-value="{{ModuleName}}">{{ModuleName}}</td>',
                '<td style="min-width: 50px" data-title="Active" data-value="{{Active}}"><span class="badge lmvt-badge {{ClassBadge}}">{{Badge}}</span>{{Active}}</td>',
                '<td style="min-width: 80px" data-title="Text" data-value="{{Text}}">{{Text}}</td>',
                '<td style="min-width: 80px" data-title="Creator" data-value="{{Creator}}">{{Creator}}</td>',
                '<td style="min-width: 80px" data-title="CreateTime" data-value="{{CreateTime}}">{{CreateTime}}</td>',
                '<td style="min-width: 100px" data-title="Editor" data-value="{{Editor}}">{{Editor}}</td>',
                '<td style="min-width: 50px" data-title="EditTime" data-value="{{EditTime}}">{{EditTime}}</td>',

                '<td style="min-width: 80px;color:#C7001A" data-title="ID" data-value="{{ID}}"><div class="row">',
                '<div class="col-md-6 lmvt-code-edit lmvt-do-info">{{Type}}</div>',
                '<div class="col-md-3 lmvt-code-do {{ISDo}}">{{ActiveType}}</div>',
                '<div class="col-md-3"><UL id="lmvt-nav">',
                '<LI>更多<UL>',
                '<LI data-value="{{ID}}" class="{{ISAllowed}}">删除</LI>',
                '<LI data-value="{{ID}}" class="lmvt-reset">修改</LI>',
                '</UL></LI></UL></div>',
                '</td>',
                '</tr>'
            ].join(""),

            TemTeam: [
                '<tr>',
                '<td style="min-width: 80px" data-title="Name" data-value="{{Name}}">{{Name}}</td>',
                '<td style="min-width: 80px" data-title="VersionNo" data-value="{{VersionNo}}">{{VersionNo}}</td>',
                '<td style="min-width: 80px" data-title="WorkShopID" data-value="{{WorkShopID}}">{{WorkShopID}}</td>',
                '<td style="min-width: 50px" data-title="LineID" data-value="{{LineID}}">{{LineID}}</td>',
                '<td style="min-width: 50px" data-title="ModuleName" data-value="{{ModuleName}}">{{ModuleName}}</td>',
                '<td style="min-width: 70px" data-title="Active" data-value="{{Active}}"><span class="badge lmvt-badge {{ClassBadge}}">{{Badge}}</span>{{Active}}</td>',
                '<td style="min-width: 50px;color:#C7001A" data-title="ID" data-value="{{ID}}"><div class="row">',
                '<div class="col-md-12 lmvt-code-edit lmvt-do-info">详情</div>',
                '</td>',
                '</tr>'
            ].join(""),

            CertificateList: [
                '<tr>',
                '<td data-title="ID" style="display:none" data-value="{{ID}}" >{{ID}}</td>',
                '<td data-title="Name" data-value="{{Name}}">{{Name}}</td>',
                '<td data-title="CheckType" data-value="{{CheckType}}">{{CheckType}}</td>',
                '<td data-title="Detail" data-value="{{Detail}}">{{Detail}}</td>',
                '<td style="min-width: 80px;color:#C7001A" data-title="ID" data-value="{{ID}}"><div class="row">',
                '<div style="color:{{color}}" class="col-md-6 lmvt-certificate-reset {{ISDo}}">修改</div>',
                '<div class="col-md-6 lmvt-certificate-delete {{ISAllowed}}">删除</div>',
                '</div></td>',
                '</tr>',
            ].join(""),

            CodeRuleList: [
                '<tr>',
                '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
                '<td data-title="ID" style="display:none" data-value="{{ID}}" >{{ID}}</td>',
                '<td data-title="Name" data-value="{{Name}}">{{Name}}</td>',
                '<td data-title="LineName" data-value="{{LineName}}">{{LineName}}</td>',
                '<td data-title="PartName" data-value="{{PartName}}">{{PartName}}</td>',
                '<td data-title="PartPointName" data-value="{{PartPointName}}">{{PartPointName}}</td>',
                '<td data-title="StationName" data-value="{{StationName}}">{{StationName}}</td>',
                '<td style="min-width: 50px" data-title="ModuleName" data-value="{{ModuleName}}">{{ModuleName}}</td>',
                '<td style="min-width: 50px" data-title="ShiftIndex" data-value="{{ShiftIndex}}">{{ShiftIndex}}</td>',
                // '<td style="min-width: 50px" data-title="WorkLicenseName" data-value="{{WorkLicenseName}}">{{WorkLicenseName}}</td>',
                '<td style="min-width: 50px" data-title="WorkIDList" data-value="{{WorkIDList}}">{{WorkIDList}}</td>',
                '<td style="min-width: 80px" data-title="Creator" data-value="{{Creator}}">{{Creator}}</td>',
                '<td style="min-width: 80px" data-title="CreateTime" data-value="{{CreateTime}}">{{CreateTime}}</td>',
                '<td style="min-width: 100px" data-title="Editor" data-value="{{Editor}}">{{Editor}}</td>',
                '<td style="min-width: 50px" data-title="EditTime" data-value="{{EditTime}}">{{EditTime}}</td>',
                '<td style="min-width: 80px;color:#C7001A" data-title="ID" data-real="{{ID}}" data-value="{{WID}}"><div class="row">',
                '<div style="color:#409EFF" class="col-md-12 lmvt-reset">人员定岗</div>',
                '</td>',
                '</tr>',
            ].join(""),
        };

        //新增实体
        Defaul_Value_Code = {
            TemplateID: 0,
            Text: "",
            StartTime: StartTime,
            EndTime: EndTime,
        };
        (function () {

            KETWROD_LIST_Code = [
                "Name|名称*",
                "TemplateID|版本|ArrayOne",
                "FunctionID|职能|ArrayOne",
                "WorkShopID|车间|ArrayOne",
                "LineID|产线|ArrayOne",
                "PartID|工序|ArrayOne",
                "PartPointID|工步|ArrayOneControl|PartID",
                "StationID|工位|ArrayOneControl|PartPointID",
                "CertificateList|证书|ArrayOne",
                "VersionNo|版本*",
                "ShiftCount|班次数*",
                "DepartmentID|部门|ArrayOne",
                "WorkID|人员|Array",
                "ShiftIndex|班次|ArrayOne",
                "ModuleID|模块名称|ArrayOne",
                "Active|状态|ArrayOne",
                "CreateTime|创建时间|DateTime",
                "EditTime|编辑时间|DateTime",
                "CheckType|核查类型|ArrayOne",
                "StartTime|开始时间|DateTime",
                "EndTime|结束时间|DateTime",
                "Detail|描述",
                "Text|描述",
            ];

            KETWROD_Code = {};

            Formattrt_Code = {};

            TypeSource_Code = {
                WorkID: [],
                TemplateID: [],
                CheckType: [
                    {
                        name: "不检查",
                        value: 0
                    }, {
                        name: "强制检查",
                        value: 1
                    }, {
                        name: "允许失效",
                        value: 2
                    }
                ],
                FunctionID: [],
                ShiftIndex: [
                    {
                        name: "白班",
                        value: 1
                    },
                    {
                        name: "夜班",
                        value: 2
                    }
                ],
                CertificateList: [],
                LineID: [],
                PartID: [
                    {
                        name: "全部",
                        value: 0
                    }
                ],
                PartPointID: [{
                    name: "全部",
                    value: 0,
                }],
                StationID: [{
                    name: "全部",
                    value: 0
                }],
                WorkShopID: [],
                DepartmentID: [{
                    name: "全部",
                    value: 0
                }],
                ModuleID: [
                    {
                        name: "生产",
                        value: 1
                    },
                    {
                        name: "质量",
                        value: 2
                    },
                    {
                        name: "工艺",
                        value: 3
                    },
                    {
                        name: "设备",
                        value: 4
                    },
                    {
                        name: "仓库",
                        value: 5
                    }
                ],

                CreatorID: [],
                LastEditorID: [],

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

            $.each(UserAll, function (i, item) {
                TypeSource_Code.WorkID.push({
                    name: item.Name,
                    value: item.ID
                });
            });

            $.each(WorkShopIDList, function (i, item) {
                TypeSource_Code.WorkShopID.push({
                    name: item.Name,
                    value: item.ID
                });
            });
            $.each(LineList, function (i, item) {
                TypeSource_Code.LineID.push({
                    name: item.Name,
                    value: item.ID
                });
            });
            $.each(StationList, function (i, item) {
                TypeSource_Code.StationID.push({
                    name: item.Name,
                    value: item.ID
                });
            });

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

        model = $com.Model.create({
            name: '排班模板',
            type: $com.Model.MAIN,
            configure: function () {
                this.run();
            },

            events: function () {

                $("body").delegate("#lmvt-model-product", "click", function (e) {
                    $(".lmvt-container-main-encoding .lmvt-changeMoName").text("生产");
                    //$(".lmvt-container-main-encoding .lmvt-container-header-btn .lmvt-changeMoName").text("生产");
                    wModuleID = 1;
                    model.com.getActiveTemplate();
                });

                $("body").delegate("#lmvt-model-quality", "click", function (e) {
                    $(".lmvt-container-header-btn .lmvt-changeMoName").text("质量");
                    //$(".lmvt-container-main-encoding .lmvt-container-main-encoding .lmvt-changeMoName").text("质量");
                    wModuleID = 2;
                    model.com.getActiveTemplate();
                });
                $("body").delegate("#lmvt-model-technology", "click", function (e) {
                    $(".lmvt-container-header-btn .lmvt-changeMoName").text("工艺");
                    //$(".lmvt-container-main-encoding .lmvt-container-main-encoding .lmvt-changeMoName").text("工艺");
                    wModuleID = 3;
                    model.com.getActiveTemplate();
                });
                $("body").delegate("#lmvt-model-store", "click", function (e) {
                    $(".lmvt-container-header-btn .lmvt-changeMoName").text("仓库");
                    //$(".lmvt-container-main-encoding .lmvt-container-main-encoding .lmvt-changeMoName").text("仓库");
                    wModuleID = 5;
                    model.com.getActiveTemplate();
                });
                $("body").delegate("#lmvt-model-device", "click", function (e) {
                    $(".lmvt-container-header-btn .lmvt-changeMoName").text("设备");
                    //$(".lmvt-container-main-encoding .lmvt-container-main-encoding .lmvt-changeMoName").text("设备");
                    wModuleID = 4;
                    model.com.getActiveTemplate();
                });

                $("body").delegate(".lmvt-container-type-encoding #lmvt-product", "click", function (e) {
                    $(" .lmvt-container-type-encoding .lmvt-changeMoNameIndex").text("白班");
                    wShiftIndex = 1
                    model.com.RendarRuleDefineTreeAll(TeamID);
                    model.com.RendarRuleDefine(TeamID);
                });
                $("body").delegate("#lmvt-quality", "click", function (e) {
                    $(".lmvt-container-type-encoding .lmvt-changeMoNameIndex").text("夜班");
                    wShiftIndex = 2;
                    model.com.RendarRuleDefineTreeAll(TeamID);
                    model.com.RendarRuleDefine(TeamID);
                });

                //监听部门
                $("body").delegate(".modal .femi-modal-body .femi-modal-item select#modal_select_DepartmentID", "change", function (e) {
                    var $this = $(this);

                    wDepartmentID = Number($this.val());

                    model.com.getUserAll({ DepartmentID: wDepartmentID }, function (resW) {
                        if (!resW)
                            return;
                        if (resW && resW.list) {

                            var $SelectWorkID = $("#modal_select_WorkID"),
                                SELECT_OPTION_HTML_WorkID = '<option value="{{value}}">{{name}}</option>',
                                FormList = [];


                            $.each(resW.list, function (i, item) {
                                FormList.push({
                                    name: item.Name,
                                    value: item.ID,
                                });

                            });
                            $SelectWorkID.empty();
                            $SelectWorkID.append($com.util.template(FormList, SELECT_OPTION_HTML_WorkID));
                            $SelectWorkID.selectpicker('render');
                            $SelectWorkID.selectpicker('refresh');
                            $SelectWorkID.selectpicker();
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

                    TypeSource_Code.PartPointID = []
                    $.each(PartUnitList, function (i, item) {
                        if (item.UnitID == wPartID) {

                            PartPointUnitList = item.UnitList;

                            $.each(item.UnitList, function (j, jtem) {
                                TypeSource_Code.PartPointID.push({
                                    name: jtem.Name,
                                    value: jtem.UnitID,
                                });
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

                });
                //监听工步
                $("body").delegate(".modal .femi-modal-body .femi-modal-item select#modal_select_PartPointID", "change", function (e) {
                    var $this = $(this);

                    wPartPointID = Number($this.val());

                    var $SelectStationID = $("#modal_select_StationID"),
                        SELECT_OPTION_HTML_StationID = '<option value="{{value}}">{{name}}</option>',
                        FormList = [{ name: "全部", value: 0 }];

                    TypeSource_Code.StationID = []
                    $.each(PartPointUnitList, function (i, item) {

                        if (item.UnitID == wPartPointID) {

                            $.each(item.UnitList, function (j, jtem) {
                                TypeSource_Code.StationID.push({
                                    name: jtem.Name,
                                    value: jtem.UnitID,
                                });
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

                $(document).keyup(function (event) {
                    if (ISModeTrue) {
                        if (event.keyCode == 13) {
                            var $this = $(this),
                                value = $("#zace-search").val();
                            if (value == undefined || value == "" || value.trim().length < 1)
                                $(".lmvt-encoding-body").children("tr").show();
                            else
                                $com.table.filterByLikeString($(".lmvt-encoding-body"), CodeList, value, "ID");
                        }
                    } else {
                        if (event.keyCode == 13) {
                            var $this = $(this),
                                value = $("#lmvt-search").val();
                            if (value == undefined || value == "" || value.trim().length < 1)
                                $(".lmvt-type-body").children("tr").show();
                            else
                                $com.table.filterByLikeString($(".lmvt-type-body"), RuleDefineList, value, "ID");
                        }
                    }


                });
                //查询
                $("body").delegate("#zace-search-levelPro", "click", function () {

                    var $this = $(this),
                        value = $("#zace-search").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $(".lmvt-encoding-body").children("tr").show();
                    else
                        $com.table.filterByLikeString($(".lmvt-encoding-body"), CodeList, value, "ID");
                });
                //查询
                $("body").delegate("#lmvt-search-levelPro", "click", function () {

                    var $this = $(this),
                        value = $("#lmvt-search").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $(".lmvt-type-body").children("tr").show();
                    else
                        $com.table.filterByLikeString($(".lmvt-type-body"), RuleDefineList, value, "ID");
                });
                //双击分类
                $("body").delegate(".lmvt-tab-body tr", "dblclick", function () {
                    var $this = $(this),
                        id = Number($this.find("td[data-title=DBID]").attr("data-value")),
                        name = $this.find("td[data-title=GroupName]").attr("data-value");

                    var $table = $this.closest("table");
                    ChoiceID = id;
                    ChoiceName = name;
                    model.com.RendarRule(id);
                });
                //删除分类
                $("body").delegate(".lmvt-tab-delete", "click", function () {

                    var $this = $(this),
                        wDBID = Number($this.parents("td").attr("data-value"));

                    const SelectObj = TapSource.filter(item => item.DBID == wDBID)[0];

                    if (wDBID != 0) {
                        if (!confirm("已选择[" + SelectObj.GroupName + "]是否删除？若删除其下所有的编码规则将自动移入[未分组]")) {
                            return;
                        }
                    }

                    model.com.postDeleteCodeRuleGroupByID({
                        ID: wDBID
                    }, function (res) {
                        alert("删除成功！！");
                        model.com.refresh();
                    });

                });
                //编辑分类
                $("body").delegate(".lmvt-edit", "click", function () {

                    var $this = $(this),
                        wDBID = Number($this.parents("td").attr("data-value"));

                    const SelectObj = TapSource.filter(item => item.DBID == wDBID)[0];

                    const Defaul_Tab = {
                        GroupName: SelectObj.GroupName
                    }

                    $("body").append($com.modal.show(Defaul_Tab, KETWROD_Tab, "修改", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }

                        SelectObj.GroupName = rst.GroupName;

                        $com.util.deleteLowerProperty(SelectObj);

                        model.com.postUpdateCodeRuleGroup({
                            data: SelectObj
                        }, function (res) {
                            alert("修改成功！！");
                            model.com.refresh();
                        });

                    }, TypeSource_Tab));

                });
                //增加分类
                $("body").delegate("#lmvt-type-add", "click", function () {

                    $("body").append($com.modal.show(Defaul_Value_Tab, KETWROD_Tab, "新增", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }

                        var _data = {
                            GroupName: rst.GroupName
                        };

                        model.com.postAddCodeRuleGroup({
                            data: _data
                        }, function (res) {
                            alert("新增成功！！");
                            model.com.refresh();
                        });

                    }, TypeSource_Tab));

                });

                //修改班组详情
                $("body").delegate(".lmvt-container-type-encoding .lmvt-reset", "click", function () {

                    var $this = $(this),
                        wDBID = Number($this.closest("td").attr("data-value"));

                    var SelectArr = RuleDefineSource.filter(item => item.WID == wDBID)[0];

                    var Defaul_Value = {};

                    if (SelectArr.ID > 0) {
                        Defaul_Value = {
                            //DepartmentID: 0,
                            WorkID: SelectArr.WorkerID,
                        };
                        $("body").append($com.modal.show(Defaul_Value, KETWROD_Code, "修改", function (rst) {
                            if (!rst || $.isEmptyObject(rst)) {
                                return false;
                            }

                            SelectArr.WorkerID = rst.WorkID;

                            model.com.postSCHPositionUpdate({
                                data: SelectArr,
                            }, function (res) {
                                alert("修改成功");
                                model.com.RendarRuleDefine(TeamID);
                            });

                        }, TypeSource_Code));
                    }
                    else {
                        Defaul_Value = {
                            DepartmentID: 1,
                            WorkID: 0,
                        };
                        $("#modal_select_DepartmentID").ready(function () {
                            $("#modal_select_DepartmentID").val(wDepartmentID).trigger('change');
                        });
                        $("body").append($com.modal.show(Defaul_Value, KETWROD_Code, "修改", function (rst) {
                            if (!rst || $.isEmptyObject(rst)) {
                                return false;
                            }

                            $.each(RuleDefineSource, function (i, item) {
                                if (item.WID == wDBID) {
                                    item.WorkerID = rst.WorkID;
                                    return false;
                                }
                            });

                            model.com.RendarFakeTable();

                        }, TypeSource_Code));
                    }
                });
                //修改班组
                $("body").delegate(".lmvt-container-main-encoding .lmvt-reset", "click", function () {

                    var $this = $(this),
                        wDBID = Number($this.closest("td").attr("data-value"));

                    var SelectArr = CodeSource.filter(item => item.ID == wDBID)[0];

                    const Defaul_Value = {
                        TemplateID: SelectArr.TemplateID,
                        Text: SelectArr.Text,
                        StartTime: SelectArr.StartTime,
                        EndTime: SelectArr.EndTime,
                    };

                    $("body").append($com.modal.show(Defaul_Value, KETWROD_Code, "修改", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }

                        SelectArr.TemplateID = Number(rst.TemplateID);
                        SelectArr.Text = rst.Text;
                        SelectArr.StartTime = rst.StartTime;
                        SelectArr.EndTime = rst.EndTime;

                        $com.util.deleteLowerProperty(SelectArr);

                        model.com.postSCHTemplateUpdate({
                            data: SelectArr,
                        }, function (res) {
                            alert("修改成功！！");
                            model.com.refresh();
                        });

                    }, TypeSource_Code));

                });
                //排班
                $("body").delegate("#lmvt-encoding-add", "click", function () {

                    $("body").append($com.modal.show(Defaul_Value_Code, KETWROD_Code, "新增", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }

                        var _data = {
                            ID: 0,
                            TemplateID: Number(rst.TemplateID),
                            Text: rst.Text,
                            StartTime: rst.StartTime,
                            EndTime: rst.EndTime,
                        };
                        model.com.postSCHTemplateUpdate({
                            data: _data,
                        }, function (res) {
                            alert("新增成功！！");
                            model.com.refresh();
                        });

                    }, TypeSource_Code));

                });
                //修改证书
                $("body").delegate(".lmvt-certificate-reset", "click", function () {

                    var $this = $(this),
                        wDBID = Number($this.closest("td").attr("data-value"));

                    var SelectObj = CertificateSource.filter(item => item.ID == wDBID)[0];

                    var defaul_Value = {
                        CertificateList: SelectObj.ID,
                        CheckType: SelectObj.CheckType,
                        Detail: SelectObj.Detail,
                    };

                    $("body").append($com.modal.show(defaul_Value, KETWROD_Code, "新增", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }

                        $.each(PositionObj.CertificateList, function (i, item) {
                            if (item.ID == wDBID) {
                                item.ID = Number(rst.CertificateList);
                                item.Name = Formattrt_Code["CertificateList"](rst.CertificateList);
                                item.CheckType = Number(rst.CheckType);
                                item.Detail = rst.Detail;
                                return false;
                            }
                        });

                        $com.util.deleteLowerProperty(PositionObj);

                        model.com.postBMMPositionUpdate({
                            data: PositionObj,
                        }, function (res) {
                            alert("修改成功！！");
                            model.com.RendarRuleDefine(TeamID);
                            model.com.RendarCertificate(PositionObj);
                        });

                    }, TypeSource_Code));

                });
                //删除证书
                $("body").delegate(".lmvt-certificate-delete", "click", function () {

                    var $this = $(this),
                        wDBID = Number($this.closest("td").attr("data-value"));

                    var index = (PositionObj.CertificateList || []).findIndex((item) => item.ID === wDBID);

                    PositionObj.CertificateList.splice(index, 1);

                    model.com.postBMMPositionUpdate({
                        data: PositionObj,
                    }, function (res) {
                        alert("删除成功！！");
                        model.com.RendarRuleDefine(TeamID);
                        model.com.RendarCertificate(PositionObj);
                    });

                });
                //隐藏证书
                $("body").delegate("#lmvt-certificate-hide", "click", function () {
                    $(".lmvt-container-certificate").hide();
                    $(".lmvt-container-form").show();
                });
                //增加证书
                $("body").delegate("#lmvt-certificate-add", "click", function () {

                    var defaul_Value = {
                        CertificateList: 0,
                        CheckType: 0,
                        Detail: "",
                    };

                    $("body").append($com.modal.show(defaul_Value, KETWROD_Code, "新增", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }

                        var _data = {
                            ID: Number(rst.CertificateList),
                            Name: Formattrt_Code["CertificateList"](rst.CertificateList),
                            CheckType: Number(rst.CheckType),
                            ModuleID: wModuleID,
                            Detail: rst.Detail,
                        };

                        PositionObj.CertificateList.push(_data);

                        $com.util.deleteLowerProperty(PositionObj);

                        model.com.postBMMPositionUpdate({
                            data: PositionObj,
                        }, function (res) {
                            alert("新增成功！！");
                            model.com.RendarRuleDefine(TeamID);
                            model.com.RendarCertificate(PositionObj);
                        });

                    }, TypeSource_Code));

                });
                //删除班组详情    单条
                $("body").delegate(".lmvt-container-type-encoding .lmvt-allowed-delete", "click", function () {
                    var $this = $(this),
                        wDBID = Number($this.closest("td").attr("data-value"));

                    var SelectObj = RuleDefineSource.filter(item => item.ID == wDBID)[0];

                    if (!confirm("是否删除该条数据？")) {
                        return;
                    }
                    $com.util.deleteLowerProperty(SelectObj);
                    model.com.postBMMPositionDelete({
                        data: SelectObj,
                    }, function (res) {
                        alert("删除成功！！");
                        model.com.RendarRuleDefine(TeamID);
                    });
                });
                //所需证书   单条
                $("body").delegate(".lmvt-container-type-encoding .lmvt-needCertificate", "click", function () {
                    var $this = $(this),
                        wDBID = Number($this.closest("td").attr("data-value"));

                    var SelectObj = RuleDefineSource.filter(item => item.ID == wDBID)[0];

                    PositionObj = $com.util.Clone(SelectObj);

                    $(".lmvt-container-form").hide();
                    $(".lmvt-container-certificate").show();

                    model.com.RendarCertificate(SelectObj);
                });

                //删除banzu    单条
                $("body").delegate(".lmvt-container-main-encoding .lmvt-allowed-delete", "click", function () {
                    var $this = $(this),
                        wDBID = Number($this.closest("td").attr("data-value"));

                    var SelectObj = CodeSource.filter(item => item.ID == wDBID)[0];

                    if (!confirm("已选择 [" + SelectObj.Code + "] 是否删除？")) {
                        return;
                    }

                    $com.util.deleteLowerProperty(SelectObj);

                    model.com.postSCHTemplateDelete({
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

                    model.com.postSCHTemplateActive({
                        data: SelectArr,
                        Active: 1
                    }, function (res) {
                        alert("激活成功！！");
                        model.com.refresh();
                    });
                });

                //激活班组详情   单条
                $("body").delegate(".lmvt-container-type-encoding .lmvt-do-active", "click", function () {
                    var $this = $(this),
                        wDBID = Number($this.closest("td").attr("data-value"));

                    const SelectArr = RuleDefineSource.filter(item => item.ID == wDBID);

                    // if (!confirm("已选择[" + SelectObj.CodeRuleName + "]激活将导致其他同类型且正在使用的编码禁用，是否继续？")) {
                    //     return;
                    // }

                    model.com.postTeamChargeActive({
                        data: SelectArr,
                        Active: 1
                    }, function (res) {
                        alert("激活成功！！");
                        model.com.RendarRuleDefine(TeamID);
                    });
                });

                //禁用班组详情   单条
                $("body").delegate(".lmvt-container-type-encoding .lmvt-do-forbidden", "click", function () {
                    var $this = $(this),
                        wDBID = Number($this.closest("td").attr("data-value"));

                    const SelectArr = RuleDefineSource.filter(item => item.ID == wDBID);

                    // if (!confirm("已选择[" + SelectObj.CodeRuleName + "]将禁用此编码，是否继续？")) {
                    //     return;
                    // }
                    model.com.postTeamChargeActive({
                        data: SelectArr,
                        Active: 2
                    }, function (res) {
                        alert("禁用成功！！");
                        model.com.RendarRuleDefine(TeamID);
                    });
                });

                //禁用班组   单条
                $("body").delegate(".lmvt-container-main-encoding .lmvt-do-forbidden", "click", function () {
                    var $this = $(this),
                        wDBID = Number($this.closest("td").attr("data-value"));

                    const SelectArr = CodeSource.filter(item => item.ID == wDBID);

                    // if (!confirm("已选择[" + SelectObj.CodeRuleName + "]将禁用此编码，是否继续？")) {
                    //     return;
                    // }
                    model.com.postSCHTemplateActive({
                        data: SelectArr,
                        Active: 2
                    }, function (res) {
                        alert("禁用成功！！");
                        model.com.refresh();
                    });
                });
                //查看班组详情
                $("body").delegate(".lmvt-do-info", "click", function () {

                    var $this = $(this),
                        wDBID = Number($this.closest("td").attr("data-value"));

                    const SourceObj = CodeSource.filter(item => item.ID == wDBID)[0];
                    // const RanderObj = CodeList.filter(item => item.DBID == wDBID)[0];

                    TeamID = wDBID;

                    TemplateLineID = SourceObj.LineID;

                    if (SourceObj.ItemCount > 0) {
                        ISLookInfo = false;
                    } else {
                        ISLookInfo = true;
                    }

                    //影藏编码实体 显示编码规则
                    $(".lmvt-container-tab-encoding").hide();
                    $(".lmvt-container-main-encoding").hide();

                    $(".lmvt-container-form").show();
                    $(".lmvt-container-type-encoding").show();

                    // $(".lmvt-changeName").text("——" + SourceObj.Name);

                    ISModeTrue = false;

                    model.com.RendarRuleDefineTreeAll(TeamID);
                    model.com.RendarRuleDefine(TeamID);
                    //CodeInfo = $com.util.Clone(SourceObj);
                });

                //返回 
                $("body").delegate("#lmvt-type-back", "click", function () {
                    ISModeTrue = true;

                    if (!ISUpdate) {
                        if (!confirm("您修改了表格数据，但是未进行保存操作，关闭则视为放弃本次操作，是否继续？")) {
                            return false;
                        }
                    }

                    ISUpdate = true;
                    $(".lmvt-container-main-encoding").show();
                    $(".lmvt-container-type-encoding").hide();
                    $(".lmvt-container-form").hide();
                    $(".lmvt-container-certificate").hide();
                });




                //保存编码规则表格中的内容
                $("body").delegate("#lmvt-ruleType-save", "click", function () {
                    let SubmitList = RuleDefineSource.concat(RuleAddSource);

                    if (SubmitList.length <= 0) {
                        alert("当前没有数据可保存！");
                        return;
                    }

                    SubmitList.sort(function (a, b) {
                        return a.SequenceID - b.SequenceID
                    });

                    if (ISUpdate) {
                        alert("当前未做任何更改，无需保存！");
                        return
                    }

                    model.com.postSaveCodeRuleFieldList({
                        data: SubmitList
                    }, function (res) {
                        ISUpdate = true;
                        alert("提交成功！！");
                        RuleAddSource = [];
                        RuleAddList = [];
                        model.com.RendarRuleDefine(RuleID);
                    });

                });
                //保存排班
                $("body").delegate("#lmvt-rule-add", "click", function () {

                    $com.util.deleteLowerProperty(RuleDefineSource);

                    $.each(RuleDefineSource, function (i, item) {
                        model.com.postSCHPositionUpdate({
                            data: item,
                        }, function (res) {
                            alert("保存成功");
                            ISUpdate = true;
                            //model.com.RendarRuleDefine(TeamID);
                        });
                    });
                });
                //导出编码实体
                $("body").delegate("#cby-encoding-output", "click", function () {
                    var $table = $(".table-part>table"),
                        fileName = "编码实体.xls",
                        Title = "编码实体";
                    var params = $com.table.getExportParams($table, fileName, Title);

                    model.com.postExportExcel(params, function (res) {
                        var src = res.info.path;
                        window.open(src);
                    });

                });
                //导出编码规则
                $("body").delegate("#cby-encoding-rules-output", "click", function () {
                    var $table = $(".table-part>table"),
                        fileName = "编码规则.xls",
                        Title = "编码规则";
                    var params = $com.table.getExportParams($table, fileName, Title);

                    model.com.postExportExcel(params, function (res) {
                        var src = res.info.path;
                        window.open(src);
                    });

                });
            },
            run: function () {

                wWorkShopID = -1;
                wDepartmentID = 1;
                wModuleID = 1;
                wActive = -1;
                wLineID = 1;
                wShiftIndex = 1;

                $(".lmvt-container-main-encoding .lmvt-changeMoName").text("生产");
                $(".lmvt-container-type-encoding .lmvt-changeMoName").text("白班");

                model.com.getDepartment({}, function (res) {
                    if (res.list.length > 0) {
                        $.each(res.list, function (i, item) {
                            TypeSource_Code.DepartmentID.push({
                                name: item.Name,
                                value: item.ID
                            });
                        });

                        model.com.getActiveTemplate();
                    }
                });


            },
            com: {
                getUserAll: function (data, fn, context) {
                    var d = {
                        $URI: "/User/All",
                        $TYPE: "get"
                    };

                    function err() {
                        console.log('人员加载失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                refresh: function () {
                    switch (wModuleID) {
                        case 1:
                            $(".templateNameTitle").text("——生产");
                            break;
                        case 2:
                            $(".templateNameTitle").text("——质量");
                            break;
                        case 3:
                            $(".templateNameTitle").text("——工艺");
                            break;
                        case 4:
                            $(".templateNameTitle").text("——设备");
                            break;
                        case 5:
                            $(".templateNameTitle").text("——仓库");
                            break;
                    }

                    //班组列表
                    model.com.getSCHTemplateAll({
                        WorkShopID: wWorkShopID, LineID: wLineID, Active: -1,
                        ModuleID: wModuleID
                    }, function (res) {

                        CodeSource = $com.util.Clone(res.list);
                        CodeList = $com.util.Clone(res.list);
                        $.each(CodeList, function (i, item) {
                            item.Badge = " ";
                            item.WID = i + 1;

                            if (item.Active == 0 && item.ItemCount > 0) {
                                item.Type = "查看";
                                item.ActiveType = "激活";
                                item.ISDo = "lmvt-do-active";
                                item.ClassBadge = "lmvt-defBadge";
                                item.ISAllowed = "lmvt-allowed-delete";
                            }
                            else if (item.Active == 0 && item.ItemCount == 0) {
                                item.Type = "生成排程";
                                item.ActiveType = "激活";
                                item.ISDo = "lmvt-not-allowed-delete";
                                item.ClassBadge = "lmvt-defBadge";
                                item.ISAllowed = "lmvt-allowed-delete";
                            }
                            else if (item.Active == 1 && item.ItemCount > 0) {
                                item.Type = "查看";
                                item.ActiveType = "禁用";
                                item.ISDo = "lmvt-do-forbidden";
                                item.ClassBadge = "lmvt-activeBadge";
                                item.ISAllowed = "lmvt-not-allowed-delete";
                            } else {
                                item.Type = "生成排程";
                                item.ActiveType = "激活";
                                item.ISDo = "lmvt-do-active";
                                item.ClassBadge = "lmvt-forbiddenBadge";
                                item.ISAllowed = "lmvt-not-allowed-delete";
                            }

                            for (var p in item) {
                                if (!Formattrt_Code[p])
                                    continue;
                                item[p] = Formattrt_Code[p](item[p]);
                            }
                        });
                        $(".lmvt-encoding-body").html($com.util.template(CodeList, HTML.CodeList));
                    });


                },
                //班组列表
                getActiveTemplate: function () {
                    model.com.getBMMTemplateAll({ WorkShopID: wWorkShopID, LineID: wLineID, Active: 1, ModuleID: wModuleID }, function (res) {

                        if (res.list.length > 0) {

                            TypeSource_Code.TemplateID = [];
                            $.each(res.list, function (i, item) {
                                TypeSource_Code.TemplateID.push({
                                    name: item.VersionNo,
                                    value: item.ID
                                });
                            });
                        }

                        model.com.refresh();
                    });
                },
                getBMMTemplateAll: function (data, fn, context) {
                    var d = {
                        $URI: "/BMMTemplate/All",
                        $TYPE: "get",
                    };
                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //职能列表
                getBMMFunctionAll: function (data, fn, context) {
                    var d = {
                        $URI: "/BMMFunction/All",
                        $TYPE: "get",
                    };
                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //产线单元
                getQMItemGetAllItems: function (data, fn, context) {
                    var d = {
                        $URI: "/QMItem/GetAllItems",
                        $TYPE: "get",
                        $SERVER: "/MESWDW"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
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
                //保存表格中的规则
                postSaveCodeRuleFieldList: function (data, fn, context) {
                    var d = {
                        $URI: "/CDM/SaveCodeRuleFieldList",
                        $TYPE: "post",
                        $SERVER: "/MESWDW"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //保存规则顺序
                postUpdateCodeRuleFieldSequence: function (data, fn, context) {
                    var d = {
                        $URI: "/CDM/UpdateCodeRuleFieldSequence",
                        $TYPE: "post",
                        $SERVER: "/MESWDW"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //修改编码规则
                postUpdateCodeRuleInfo: function (data, fn, context) {
                    var d = {
                        $URI: "/CDM/UpdateCodeRuleInfo",
                        $TYPE: "post",
                        $SERVER: "/MESWDW"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //生成虚拟编码
                getGenerateNextCode: function (data, fn, context) {
                    var d = {
                        $URI: "/CDM/GenerateNextCode",
                        $TYPE: "get",
                        $SERVER: "/MESWDW"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //删除编码规则
                postDeleteCodeRuleFieldDefine: function (data, fn, context) {
                    var d = {
                        $URI: "/CDM/DeleteCodeRuleFieldDefine",
                        $TYPE: "post",
                        $SERVER: "/MESWDW"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //修改编码规则
                postUpdateCodeRuleFieldDefine: function (data, fn, context) {
                    var d = {
                        $URI: "/CDM/UpdateCodeRuleFieldDefine",
                        $TYPE: "post",
                        $SERVER: "/MESWDW"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //保存编码规则
                postAddCodeRuleFieldDefine: function (data, fn, context) {
                    var d = {
                        $URI: "/CDM/AddCodeRuleFieldDefine",
                        $TYPE: "post",
                        $SERVER: "/MESWDW"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //查询编码规则字段
                //获取编码规则
                getTeamChargeAll: function (data, fn, context) {
                    var d = {
                        $URI: "/TeamCharge/All",
                        $TYPE: "get",
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //激活班组详情 单条
                postTeamChargeActive: function (data, fn, context) {
                    var d = {
                        $URI: "/TeamCharge/Active",
                        $TYPE: "post",
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //激活排班 单条
                postSCHTemplateActive: function (data, fn, context) {
                    var d = {
                        $URI: "/SCHTemplate/Active",
                        $TYPE: "post",
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //删除班组 单条
                postSCHTemplateDelete: function (data, fn, context) {
                    var d = {
                        $URI: "/SCHTemplate/Delete",
                        $TYPE: "post",
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //删除班组详情 单条
                postBMMPositionDelete: function (data, fn, context) {
                    var d = {
                        $URI: "/BMMPosition/Delete",
                        $TYPE: "post",
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                //新增班组
                postSCHTemplateUpdate: function (data, fn, context) {
                    var d = {
                        $URI: "/SCHTemplate/Update",
                        $TYPE: "post",
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //保存排班详情
                postSCHPositionUpdate: function (data, fn, context) {
                    var d = {
                        $URI: "/SCHPosition/Update",
                        $TYPE: "post",
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //删除分类
                postDeleteCodeRuleGroupByID: function (data, fn, context) {
                    var d = {
                        $URI: "/CDM/DeleteCodeRuleGroupByID",
                        $TYPE: "post",
                        $SERVER: "/MESWDW"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //修改分类
                postUpdateCodeRuleGroup: function (data, fn, context) {
                    var d = {
                        $URI: "/CDM/UpdateCodeRuleGroup",
                        $TYPE: "post",
                        $SERVER: "/MESWDW"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //保存分类
                postAddCodeRuleGroup: function (data, fn, context) {
                    var d = {
                        $URI: "/CDM/AddCodeRuleGroup",
                        $TYPE: "post",
                        $SERVER: "/MESWDW"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                //获取编码规则
                getCodeDefinitionAll: function (data, fn, context) {
                    var d = {
                        $URI: "/CRDCodeDefinition/All",
                        $TYPE: "get",
                        $SERVER: "/iPlantFMC"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取编码规则实体
                getCodeEntryAll: function (data, fn, context) {
                    var d = {
                        $URI: "/CRDCodeEntry/All",
                        $TYPE: "get",
                        $SERVER: "/iPlantFMC"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //保存编码
                postCodeEntrySave: function (data, fn, context) {
                    var d = {
                        $URI: "/CRDCodeEntry/Save",
                        $TYPE: "post",
                        $SERVER: "/iPlantFMC"
                    };
                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //保存规则
                postCRDCodeDefinitionSave: function (data, fn, context) {
                    var d = {
                        $URI: "/CRDCodeDefinition/Save",
                        $TYPE: "post",
                        $SERVER: "/iPlantFMC"
                    };
                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //删除编码
                postCodeEntryDeleteAll: function (data, fn, context) {
                    var d = {
                        $URI: "/CRDCodeEntry/DeleteAll",
                        $TYPE: "post",
                        $SERVER: "/iPlantFMC"
                    };
                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //激活编码实体
                postCodeEntryActive: function (data, fn, context) {
                    var d = {
                        $URI: "/CRDCodeEntry/Active",
                        $TYPE: "post",
                        $SERVER: "/iPlantFMC"
                    };
                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //排班树详情
                getSCHPositionTreeAll: function (data, fn, context) {
                    var d = {
                        $URI: "/SCHPosition/TreeAll",
                        $TYPE: "get",
                    };
                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                //排班树详情
                getSCHPositionAll: function (data, fn, context) {
                    var d = {
                        $URI: "/SCHPosition/All",
                        $TYPE: "get",
                    };
                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                //排班平级
                getSCHPositionTemplateAll: function (data, fn, context) {
                    var d = {
                        $URI: "/SCHPosition/TemplateAll",
                        $TYPE: "get",
                    };
                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                //获取班组分类
                getSCHTemplateAll: function (data, fn, context) {
                    var d = {
                        $URI: "/SCHTemplate/All",
                        $TYPE: "get",
                    };
                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取规则清单
                getRuleInfoListByGroupID: function (data, fn, context) {
                    var d = {
                        $URI: "/CDM/GetRuleInfoListByGroupID",
                        $TYPE: "get",
                        $SERVER: "/MESWDW"
                    };
                    function err() {
                        $com.app.tip('失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                //渲染班组清单
                RanderCodeList: function (Data) {

                    $page.init($(".CodeTable"), Data, "", function (res) {


                        CodeRanderSource = res;

                        $(".lmvt-encoding-body").html($com.util.template(res, HTML.CodeList));
                        $(".lmvt-TemTeam-body").html($com.util.template(res, HTML.TemTeam));


                    });

                },
                //渲染班组职能清单
                RanderChargeList: function (Data) {

                    $page.init($(".Charge-table"), Data, "", function (res) {

                        $(".lmvt-type-body").html($com.util.template(res, HTML.CodeRuleList));

                    });

                },
                //实体
                RendarRule: function (DBID) {

                    model.com.getRuleInfoListByGroupID({ ID: DBID }, function (res) {

                        CodeSource = $com.util.Clone(res.list);
                        CodeList = $com.util.Clone(res.list);
                        $.each(CodeList, function (i, item) {

                            if (item.ActiveStatus == 0) {
                                item.ActiveType = "激活";
                                item.ISDo = "lmvt-do-active";
                                item.ISAllowed = "lmvt-allowed-delete";
                            } else if (item.ActiveStatus == 1) {
                                item.ActiveType = "禁用";
                                item.ISDo = "lmvt-do-forbidden";
                                item.ISAllowed = "lmvt-not-allowed-delete";
                            } else {
                                item.ActiveType = "激活";
                                item.ISDo = "lmvt-do-active";
                                item.ISAllowed = "lmvt-not-allowed-delete";
                            }

                            for (var p in item) {
                                if (!Formattrt_Code[p])
                                    continue;
                                item[p] = Formattrt_Code[p](item[p]);
                            }
                        });

                        model.com.RanderCodeList(CodeList);
                    });

                    // $.each(CodeList, function (i, item_j) {
                    //     if (item_j.ID == id) {
                    //         var _list = $com.util.Clone(item_j.CodeDefinitionList);
                    //         $.each(_list, function (i, item) {
                    //             //if (item.Editable == false) {
                    //             //    item.Editable = "否";
                    //             //}
                    //             //else
                    //             //    item.Editable = "是";
                    //             //$.each(TypeSource_Rule.Type, function (j, jtem) {
                    //             //    if (jtem.value == item.Type)
                    //             //        item.Type = jtem.name;
                    //             //})
                    //             item.showID = i + 1;
                    //         });
                    //         $.each(_list, function (i, item) {
                    //             for (var p in item) {
                    //                 if (!Formattrt_Rule[p])
                    //                     continue;
                    //                 item[p] = Formattrt_Rule[p](item[p]);
                    //             }
                    //         });
                    //         $(".lmvt-type-body").html($com.util.template(_list, HTML.CodeRuleList));
                    //     }

                    // })

                },

                fullItems: function (list) {

                    $.each(list, function (i, item) {

                        model.com.fullItems(item.SonList);

                        item.Items = $com.util.template(item.SonList, HTML.TreeItemNode);


                    });
                },

                RendarRuleDefine: function (TeamID) {
                    // //当前状态
                    // NowAcitve = res.info.Active;

                    if (ISLookInfo) {
                        model.com.getSCHPositionTemplateAll({
                            TemplateID: TeamID,
                            ShiftIndex: wShiftIndex
                        }, function (res) {
                            RuleDefineSource = $com.util.Clone(res.list);

                            RuleDefineList = $com.util.Clone(res.list);

                            $.each(RuleDefineSource, function (i, item) {
                                item.WID = i + 1;
                            });

                            $.each(RuleDefineList, function (i, item) {
                                item.WID = i + 1;

                                // if (res.info.Active == 0) {
                                //     item.ISAllowed = "lmvt-allowed-delete";
                                // } else if (res.info.Active == 1) {
                                //     item.ISAllowed = "lmvt-not-allowed-delete";
                                // } else {
                                //     item.ISAllowed = "lmvt-not-allowed-delete";
                                // }

                                for (var p in item) {
                                    if (!Formattrt_Code[p])
                                        continue;
                                    item[p] = Formattrt_Code[p](item[p]);
                                }

                                if (item.StationName == "") {
                                    item.StationName = "——";
                                }
                                if (item.PartPointName == "") {
                                    item.PartPointName = "——";
                                }
                                if (item.PartName == "") {
                                    item.PartName = "——";
                                }
                                if (item.LineName == "") {
                                    item.StationName = "——";
                                }
                                
                                for (const m in item.WorkerID) {
                                    item.WorkerID[m] = UserAll.filter((k) => { return k.ID == item.WorkerID[m] })[0].Name;
                                }

                                item.WorkIDList = item.WorkerID.join();
                            });

                            $(".lmvt-type-body").html($com.util.template(RuleDefineList, HTML.CodeRuleList));
                        });
                    } else {
                        // model.com.getSCHPositionAll({
                        //     TemplateID: TeamID,
                        //     ShiftIndex: wShiftIndex,
                        //     WorkShopID: -1,
                        //     LineID: -1,
                        //     PartID: -1,
                        //     PartPointID: -1,
                        //     StationID: -1
                        model.com.getSCHPositionTemplateAll({
                            TemplateID: TeamID,
                            ShiftIndex: wShiftIndex
                        }, function (res) {
                            RuleDefineSource = $com.util.Clone(res.list);

                            RuleDefineList = $com.util.Clone(res.list);

                            $.each(RuleDefineSource, function (i, item) {
                                item.WID = i + 1;
                            });

                            $.each(RuleDefineList, function (i, item) {
                                item.WID = i + 1;

                                // if (res.info.Active == 0) {
                                //     item.ISAllowed = "lmvt-allowed-delete";
                                // } else if (res.info.Active == 1) {
                                //     item.ISAllowed = "lmvt-not-allowed-delete";
                                // } else {
                                //     item.ISAllowed = "lmvt-not-allowed-delete";
                                // }

                                for (var p in item) {
                                    if (!Formattrt_Code[p])
                                        continue;
                                    item[p] = Formattrt_Code[p](item[p]);
                                }

                                if (item.StationName == "") {
                                    item.StationName = "——";
                                }
                                if (item.PartPointName == "") {
                                    item.PartPointName = "——";
                                }
                                if (item.PartName == "") {
                                    item.PartName = "——";
                                }
                                if (item.LineName == "") {
                                    item.StationName = "——";
                                }

                                for (const m in item.WorkerID) {
                                    item.WorkerID[m] = UserAll.filter((k) => { return k.ID == item.WorkerID[m] })[0].Name;
                                }

                                item.WorkIDList = item.WorkerID.join();
                            });

                            $(".lmvt-type-body").html($com.util.template(RuleDefineList, HTML.CodeRuleList));
                        });
                    }
                },

                //规则
                RendarRuleDefineTreeAll: function (TeamID) {

                    model.com.getSCHPositionTreeAll({
                        TemplateID: TeamID,
                        ShiftIndex: wShiftIndex
                    }, function (res) {
                        model.com.fullItems(res.list);
                        $("#depTree").html($com.util.template(res.list, HTML.TreeItemNode));
                        $("#depTree").treeview({ collapsed: false });
                    });

                },
                //证书
                RendarCertificate: function (obj) {

                    CertificateSource = $com.util.Clone(obj.CertificateList);
                    CertificateList = $com.util.Clone(obj.CertificateList);

                    $.each(CertificateList, function (i, item) {
                        item.WID = i + 1;

                        if (NowAcitve == 0) {
                            item.ISAllowed = "lmvt-allowed-delete";
                            item.ISDo = "lmvt-do-active";
                            item.color = "#409EFF"
                        } else if (NowAcitve == 1) {
                            item.ISAllowed = "lmvt-not-allowed-delete";
                            item.ISDo = "lmvt-not-allowed-delete";
                        } else {
                            item.ISAllowed = "lmvt-not-allowed-delete";
                            item.ISDo = "lmvt-not-allowed-delete";
                        }

                        for (var p in item) {
                            if (!Formattrt_Code[p])
                                continue;
                            item[p] = Formattrt_Code[p](item[p]);
                        }
                    });

                    $(".lmvt-certificate-body").html($com.util.template(CertificateList, HTML.CertificateList));
                },

                //假数据渲染
                RendarFakeTable: function () {
                    ISUpdate = false;

                    RuleDefineList = $com.util.Clone(RuleDefineSource);

                    $.each(RuleDefineList, function (i, item) {

                        for (var p in item) {
                            if (!Formattrt_Code[p])
                                continue;
                            item[p] = Formattrt_Code[p](item[p]);
                        }

                        if (item.StationName == "") {
                            item.StationName = "——";
                        }
                        if (item.PartPointName == "") {
                            item.PartPointName = "——";
                        }
                        if (item.PartName == "") {
                            item.PartName = "——";
                        }
                        if (item.LineName == "") {
                            item.StationName = "——";
                        }

                        for (const m in item.WorkerID) {
                            item.WorkerID[m] = UserAll.filter((k) => { return k.ID == item.WorkerID[m] })[0].Name;
                        }

                        item.WorkIDList = item.WorkerID.join();
                    });
                    $(".lmvt-type-body").html($com.util.template(RuleDefineList, HTML.CodeRuleList));
                },

                //找到对应原始数据
                GetSourceData: function (id) {
                    var obj;
                    $.each(CodeSource, function (i, item) {
                        if (item.DBID == id) {
                            obj = item;
                            return obj;
                        }

                    });
                    return obj;
                },
                getNewShiftList: function (_source, set_data) {
                    if (!_source)
                        _source = [];
                    if (!set_data)
                        set_data = [];
                    var rst = [];
                    for (var i = 0; i < _source.length; i++) {
                        var NotOWn = false;
                        for (var j = 0; j < set_data.length; j++) {
                            if (_source[i].ID == set_data[j].ID) {
                                _source.splice(i, 1);
                                set_data.splice(j, 1);
                                NotOWn = true;
                            }
                            if (set_data.length < 1) {
                                break;
                            }
                            if (NotOWn) {
                                model.com.getNewShiftList(_source, set_data);
                            }
                        }

                    }
                    rst = _source;
                    return rst;
                },
                swapItems: function (arr, index1, index2) {
                    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
                    return arr;
                },

                // 上移
                upRecord: function (arr, $index) {
                    if ($index == 0) {
                        return;
                    }
                    model.com.swapItems(arr, $index, $index - 1);
                },

                //导出
                postExportExcel: function (data, fn, context) {
                    var d = {
                        $URI: "/Upload/ExportExcel",
                        $TYPE: "post"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
            },


        });
        model.init();
    });