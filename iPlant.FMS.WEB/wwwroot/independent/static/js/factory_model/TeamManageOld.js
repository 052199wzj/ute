require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/paging'],
    function ($lin, $com, $page, $jqui) {

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


            //编码集合
            CodeList,
            //规则集合
            CodeRuleList,
            CodeSource,
            //全局ID
            ChoiceID = 0,
            //全局名称
            ChoiceName,

            fixHelperModified,
            updateIndex,

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


            //实体对象
            //CodeInfo,
            RuleObj,
            RuleSource,
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

            ISModeTrue = true,

            PartPointUnitList,
            PartUnitList = [],
            LineUnitList,

            partSource;

        UserAll = window.parent._UserAll;
        WorkShopIDList = window.parent._WorkShop;
        LineList = window.parent._Line;
        StationList = window.parent._Station;

        HTML = {
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
                '<td style="min-width: 80px" data-title="Name" data-value="{{Name}}">{{Name}}</td>',
                '<td style="min-width: 80px" data-title="WorkShopID" data-value="{{WorkShopID}}">{{WorkShopID}}</td>',
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
                '<div class="col-md-4 lmvt-code-edit lmvt-do-info">详情</div>',
                '<div class="col-md-4 lmvt-code-do {{ISDo}}">{{ActiveType}}</div>',
                '<div class="col-md-4" "><UL id="lmvt-nav">',
                '<LI>更多<UL><LI data-value="{{ID}}" class="{{ISReset}}">修改</LI>',
                '<LI data-value="{{ID}}" class="{{ISAllowed}}">删除</LI>',
                '</UL></LI></UL></div>',
                '</div></td>',
                '</tr>'
            ].join(""),

            TemTeam: [
                '<tr>',
                '<td style="min-width: 80px" data-title="Name" data-value="{{Name}}">{{Name}}</td>',
                '<td style="min-width: 80px" data-title="WorkShopID" data-value="{{WorkShopID}}">{{WorkShopID}}</td>',
                '<td style="min-width: 50px" data-title="DepartmentName" data-value="{{DepartmentName}}">{{DepartmentName}}</td>',
                '<td style="min-width: 50px" data-title="ModuleName" data-value="{{ModuleName}}">{{ModuleName}}</td>',
                '<td style="min-width: 50px" data-title="Active" data-value="{{Active}}"><span class="badge lmvt-badge {{ClassBadge}}">{{Badge}}</span>{{Active}}</td>',
                '<td style="min-width: 80px;color:#C7001A" data-title="ID" data-value="{{ID}}"><div class="row">',
                '<div class="col-md-12 lmvt-code-edit lmvt-do-info">详情</div>',
                '</td>',
                '</tr>'
            ].join(""),

            CodeRuleList: [
                '<tr>',
                '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
                '<td data-title="ID" style="display:none" data-value="{{ID}}" >{{ID}}</td>',
                // '<td data-title="ModuleName" data-value="{{ModuleName}}">{{ModuleName}}</td>',
                // '<td data-title="DepartmentName" data-value="{{DepartmentName}}">{{DepartmentName}}</td>',
                // '<td data-title="WorkShopName" data-value="{{WorkShopName}}">{{WorkShopName}}</td>',
                '<td data-title="LineName" data-value="{{LineName}}">{{LineName}}</td>',
                '<td data-title="PartName" data-value="{{PartName}}">{{PartName}}</td>',
                '<td data-title="PartPointName" data-value="{{PartPointName}}">{{PartPointName}}</td>',
                '<td data-title="StationName" data-value="{{StationName}}">{{StationName}}</td>',
                '<td style="min-width: 50px" data-title="Active" data-value="{{Active}}"><span class="badge lmvt-badge {{ClassBadge}}">{{Badge}}</span>{{Active}}</td>',
                '<td style="min-width: 80px" data-title="Creator" data-value="{{Creator}}">{{Creator}}</td>',
                '<td style="min-width: 80px" data-title="CreateTime" data-value="{{CreateTime}}">{{CreateTime}}</td>',
                '<td style="min-width: 100px" data-title="Editor" data-value="{{Editor}}">{{Editor}}</td>',
                '<td style="min-width: 50px" data-title="EditTime" data-value="{{EditTime}}">{{EditTime}}</td>',

                '<td style="min-width: 80px;color:#C7001A" data-title="ID" data-value="{{ID}}"><div class="row">',
                '<div class="col-md-6 lmvt-code-do {{ISDo}}">{{ActiveType}}</div>',
                '<div class="col-md-6" "><UL id="lmvt-nav">',
                '<LI>更多<UL><LI data-value="{{ID}}" class="lmvt-reset">修改</LI>',
                '<LI data-value="{{ID}}" class="{{ISAllowed}}">删除</LI>',
                '</UL></LI></UL></div>',
                '</div></td>',

                // '<td style="min-width: 80px;color:#C7001A" data-title="ID" data-value="{{ID}}"><div class="row">',
                // '<div class="col-md-4 lmvt-code-edit lmvt-do-info">详情</div>',
                // '<div class="col-md-4 lmvt-code-do {{ISDo}}">{{ActiveType}}</div>',
                // '<div class="col-md-4" "><UL id="lmvt-nav">',
                // '<LI>更多<UL><LI data-value="{{ID}}" class="lmvt-reset">修改</LI>',
                // '<LI data-value="{{ID}}" class="{{ISAllowed}}">删除</LI>',
                // '</UL></LI></UL></div>',
                // '</div></td>',
                '</tr>',
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
                MateID: [],
                LeaderID: [],
                LineID: [],
                PartID: [
                    {
                        name: "全部",
                        value: 0
                    }
                ],
                PartPointID: [{
                    name: "全部",
                    value: 0
                }],
                StationID: [{
                    name: "全部",
                    value: 0
                }],
                WorkShopID: [],
                DepartmentID: [],
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
                        value: 4
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
                TypeSource_Code.LeaderID.push({
                    name: item.Name,
                    value: item.ID
                });
                TypeSource_Code.MateID.push({
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
        //新增规则
        Defaul_Value_Rule = {
            FieldTypeID: "",
            //FieldLength: "",
            FixedCodeString: "",
            FixedCodeDescription: "",
            //Editable: 2,
        };
        (function () {

            KETWROD_LIST_Rule = [
                "FieldTypeID|类型|ArrayOne",
                "FieldLength|长度*",
                "FixedCodeString|内容*",
                "FixedCodeDescription|含义*",
                //"Editable|是否可修改|ArrayOne",
                //"Active|状态(必填项)|ArrayOne"
            ];

            KETWROD_Rule = {};

            Formattrt_Rule = {};

            TypeSource_Rule = {
                FieldTypeID: [
                    {
                        name: "年码",
                        value: "YearCode"
                    },
                    {
                        name: "月码",
                        value: "MonthCode"
                    },
                    {
                        name: "日码",
                        value: "DayCode"
                    },
                    {
                        name: "时码",
                        value: "HourCode"
                    },
                    {
                        name: "分码",
                        value: "MinuteCode"
                    },
                    {
                        name: "秒码",
                        value: "SecondCode"
                    },
                    {
                        name: "流水码",
                        value: "SerialNumberCode"

                    },
                    // {
                    //     name: "属性码",
                    //     value: "PropertyCode"

                    // },
                    {
                        name: "固定码",
                        value: "FixedCode"

                    }
                ],
                Editable: [
                    {
                        name: "是",
                        value: true
                    },
                    {
                        name: "否",
                        value: false
                    }
                ]
            };

            $.each(KETWROD_LIST_Rule, function (i, item) {
                var detail = item.split("|");
                KETWROD_Rule[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_Rule[detail[0]] = $com.util.getFormatter(TypeSource_Rule, detail[0], detail[2]);
                }
            });
        })();
        //新增分类

        Defaul_Value_Tab = {
            GroupName: "",
        };
        (function () {

            KETWROD_LIST_Tab = [
                "GroupName|名称*"
            ];

            KETWROD_Tab = {};

            Formattrt_Tab = {};

            TypeSource_Tab = {

            };

            $.each(KETWROD_LIST_Tab, function (i, item) {
                var detail = item.split("|");
                KETWROD_Tab[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_Tab[detail[0]] = $com.util.getFormatter(TypeSource_Tab, detail[0], detail[2]);
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

                            TypeSource_Code.PartID = []
                            $.each(resW.list, function (i, item) {

                                TypeSource_Code.PartID.push({
                                    name: item.Name,
                                    value: item.UnitID,
                                });
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

                    $("#modal_select_PartPointID").val(0).trigger('change');
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

                    var SelectArr = RuleDefineSource.filter(item => item.ID == wDBID)[0];

                    const Defaul_Value = {
                        LineID: SelectArr.LineID,
                        PartID: SelectArr.PartID,
                        PartPointID: SelectArr.PartPointID,
                        StationID: SelectArr.StationID,
                    };

                    $("body").append($com.modal.show(Defaul_Value, KETWROD_Code, "新增", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }

                        SelectArr.LineID = Number(rst.LineID);
                        SelectArr.PartID = Number(rst.PartID);
                        SelectArr.PartPointID = Number(rst.PartPointID);
                        SelectArr.StationID = Number(rst.StationID);

                        $com.util.deleteLowerProperty(SelectArr);

                        model.com.postTeamChargeUpdate({
                            data: SelectArr,
                        }, function (res) {
                            alert("修改成功！！");
                            model.com.RendarRuleDefine(TeamID);
                        });

                    }, TypeSource_Code));

                });
                //修改班组
                $("body").delegate(".lmvt-container-main-encoding .lmvt-reset", "click", function () {

                    var $this = $(this),
                        wDBID = Number($this.closest("td").attr("data-value"));

                    var SelectArr = CodeSource.filter(item => item.ID == wDBID)[0];

                    const Defaul_Value = {
                        Name: SelectArr.Name,
                        WorkShopID: SelectArr.WorkShopID,
                        DepartmentID: SelectArr.DepartmentID,
                        ModuleID: SelectArr.ModuleID,
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

                        $com.util.deleteLowerProperty(SelectArr);

                        model.com.postTeamManageUpdate({
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
                            // Code: "BZ",

                            LeaderID: rst.LeaderID,
                            MateID: rst.MateID,

                            ModuleName: Formattrt_Code["ModuleID"](rst.ModuleID),
                            WorkShopName: Formattrt_Code["WorkShopID"](rst.WorkShopID),
                            DepartmentName: Formattrt_Code["DepartmentID"](rst.DepartmentID),
                            TeamChargeList: [],
                            Active: 0,
                        };
                        model.com.postTeamManageUpdate({
                            data: _data,
                        }, function (res) {
                            alert("新增成功！！");
                            model.com.refresh();
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
                    model.com.postTeamChargeDelete({
                        data: SelectObj,
                    }, function (res) {
                        alert("删除成功！！");
                        model.com.RendarRuleDefine(TeamID);
                    });
                });

                //删除banzu    单条
                $("body").delegate(".lmvt-container-main-encoding .lmvt-allowed-delete", "click", function () {
                    var $this = $(this),
                        wDBID = Number($this.closest("td").attr("data-value"));

                    var SelectObj = CodeSource.filter(item => item.ID == wDBID)[0];

                    if (!confirm("已选择 [" + SelectObj.Name + "] 是否删除？")) {
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

                    model.com.postTeamManageActive({
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
                    model.com.postTeamManageActive({
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

                    //影藏编码实体 显示编码规则
                    $(".lmvt-container-tab-encoding").hide();
                    $(".lmvt-container-main-encoding").hide();

                    $(".lmvt-container-form").show();
                    $(".lmvt-container-type-encoding").show();

                    $(".lmvt-changeName").text("——" + SourceObj.Name);

                    ISModeTrue = false;

                    model.com.RendarRuleDefine(TeamID);

                    //CodeInfo = $com.util.Clone(SourceObj);
                });

                //返回 
                $("body").delegate("#lmvt-type-back", "click", function () {
                    ISModeTrue = true;
                    $(".lmvt-container-main-encoding").show();
                    $(".lmvt-container-type-encoding").hide();
                    $(".lmvt-container-form").hide();
                });

                //删除编码实体
                $("body").delegate("#lmvt-encoding-delete", "click", function () {

                    var SelectData = $com.table.getSelectionData($(".lmvt-encoding-body"), "DBID", CodeSource);

                    const ISDeleteArr = SelectData.filter(item => item.ActiveStatus != 0);

                    if (ISDeleteArr.length > 0) {
                        alert("存在" + ISDeleteArr.length + "条数据，是禁用或者激活状态，无法进行删除操作");
                        return;
                    }

                    if (!SelectData || !SelectData.length) {
                        alert("至少选择一行数据再试！")
                        return;
                    }
                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {
                        return;
                    }

                    var IDList = SelectData.map(function (v) { return v.DBID; });

                    model.com.postDeleteCodeRuleInfoByID({
                        IDList: IDList
                    }, function (res) {
                        alert("删除成功！！");
                        model.com.refresh();
                    });
                });
                //删除编码规则  单条
                $("body").delegate(".lmvt-type-allowed-delete", "click", function () {

                    var $this = $(this),
                        wDBID = Number($this.closest("td").attr("data-value"));

                    if (wDBID < 0) {
                        $.each(RuleAddSource, function (i, item) {
                            if (item.ShowID == wDBID) {
                                RuleAddSource.splice(i, 1);
                            }
                        });
                    } else {
                        $.each(RuleDefineSource, function (i, item) {
                            if (item.ShowID == wDBID) {
                                RuleDefineSource.splice(i, 1);
                            }
                        });
                    }

                    model.com.RendarFakeTable();
                    alert("删除成功！！");

                    // model.com.postDeleteCodeRuleFieldDefine({
                    //     IDList: [wDBID],
                    // }, function (res) {
                    //     alert("删除成功！！");
                    //     model.com.RendarRuleDefine(RuleID);
                    // });
                });
                //删除编码规则  多条
                $("body").delegate("#lmvt-type-delete", "click", function () {

                    let obj = $com.util.Clone(RuleSource);

                    if (obj.ActiveStatus != 0) {
                        alert("该编码处于无法做更改的状态！！！");
                        return;
                    }

                    let List = RuleDefineSource.concat(RuleAddSource);

                    var SelectData = $com.table.getSelectionData($(".lmvt-type-body"), "ShowID", List);

                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return;
                    }

                    var RuleDefineIndex = [],
                        RuleAddIndex = [];
                    $.each(SelectData, function (i, item) {
                        if (item.ShowID >= 0) {
                            RuleDefineIndex.push(item.ShowID);
                        } else {
                            RuleAddIndex.push(item.ShowID);
                        }
                    });

                    //再取新数据相对于源数据的差集完成新数据的显示
                    let diffArr = $com.util.Clone(RuleDefineSource.filter(function (v) {
                        return RuleDefineIndex.indexOf(v.ShowID) === -1;
                    }));

                    let diffArr1 = $com.util.Clone(RuleAddSource.filter(function (v) {
                        return RuleAddIndex.indexOf(v.ShowID) === -1;
                    }));

                    RuleDefineSource = diffArr;

                    RuleAddSource = diffArr1;

                    // if (RuleDefineIndex.length >= 0) {
                    //     $.each(RuleDefineIndex, function (i, item) {
                    //         RuleDefineSource.splice(item, 1);
                    //     });

                    // }

                    // if (RuleAddIndex.length >= 0) {
                    //     $.each(RuleAddIndex, function (i, item) {
                    //         RuleAddSource.splice(item, 1);
                    //     });

                    // }

                    model.com.RendarFakeTable();
                    alert("删除成功！！");

                    // var arr = SelectData.map(function (v) { return v.DBID; });

                    // model.com.postDeleteCodeRuleFieldDefine({
                    //     IDList: arr,
                    // }, function (res) {
                    //     alert("删除成功！！");
                    //     model.com.RendarRuleDefine(RuleID);
                    // });
                });
                //关闭编码详情
                $("body").delegate("#lmvt-rule-close", "click", function () {

                    if (!confirm("请确认修改的内容已保存，是否继续？")) {
                        return;
                    }

                    $(".lmvt-container-tab-encoding").show();
                    $(".lmvt-container-main-encoding").show();

                    $(".lmvt-container-form").hide();
                    $(".lmvt-container-type-encoding").hide();


                    model.com.RendarRule(ChoiceID);

                });

                //取消编码规则表格中的内容
                $("body").delegate("#lmvt-ruleType-close", "click", function () {


                    if (!confirm("此操作会放弃本次规则的填入值，是否继续？")) {
                        return;
                    }

                    RuleAddSource = [];
                    RuleAddList = [];
                    ISUpdate = true;
                    model.com.RendarRuleDefine(RuleID);

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

                    // let temp = true;

                    // let $ruleName = $(".lmvt-ruleName"),
                    //     $ruleTab = $(".lmvt-ruleTab"),

                    //     $ruleSen = $(".lmvt-ruleSen"),
                    //     //编码类型
                    //     $ruleType = $(".lmvt-ruleType"),
                    //     $inlineRadio1 = $("#inlineRadio1"),
                    //     $inlineRadio2 = $("#inlineRadio2");
                    // //影响因素
                    // let ruleType = $(".lmvt-ruleSen option:selected").val(),
                    //     ruleName = $(".lmvt-ruleSen option:selected").text();

                    // //判断是否是无绑定
                    // if (ruleType != TypeSource_Code.SerialResetBindingTypeID[0].value) {

                    //     $.each(RDObj, function (i, item) {
                    //         if (item.FieldTypeID == ruleName) {
                    //             temp = false;
                    //         }
                    //     });

                    //     if (temp) {
                    //         alert("当前所有的编码规则的类型没有与实体的重置类型相同，请添加一条相同类型的编码规则。");
                    //         return;
                    //     }
                    // }
                    // //获取类型
                    // let $radioCheck = $("input[name='inlineRadioOptions']:checked");
                    // if ($radioCheck.length == 1 && $radioCheck.val() == 1) {
                    //     if (!confirm("已选择激活状态,保存将导致其他同类型且正在使用的编码禁用，是否继续？")) {
                    //         return;
                    //     }
                    //     RSource.ActiveStatus = 1;
                    // } else if ($radioCheck.val() == 2) {
                    //     RSource.ActiveStatus = 2;
                    // }

                    // RSource.SerialResetBindingTypeID = ruleType;

                    // RSource.CodeRuleName = $ruleName.val();

                    // RSource.MESFunctionTypeID = $ruleType.val();

                    // RSource.CodeRuleGroupID = $ruleTab.val();

                    // $com.util.deleteLowerProperty(RSource);

                    // model.com.postUpdateCodeRuleInfo({
                    //     data: RSource
                    // }, function (res) {
                    //     alert("修改成功！！");
                    //     model.com.RendarRuleDefine(RuleID);
                    // });
                });


                //保存编码实体
                $("body").delegate("#lmvt-rule-save", "click", function () {
                    let RObj = RuleObj, RSource = RuleSource, RDObj = RuleDefineList, RDSource = RuleDefineSource;

                    let temp = true;

                    let $ruleName = $(".lmvt-ruleName"),
                        $ruleTab = $(".lmvt-ruleTab"),

                        $ruleSen = $(".lmvt-ruleSen"),
                        //编码类型
                        $ruleType = $(".lmvt-ruleType"),
                        $inlineRadio1 = $("#inlineRadio1"),
                        $inlineRadio2 = $("#inlineRadio2");
                    //影响因素
                    let ruleType = $(".lmvt-ruleSen option:selected").val(),
                        ruleName = $(".lmvt-ruleSen option:selected").text();

                    //判断是否是无绑定
                    if (ruleType != TypeSource_Code.SerialResetBindingTypeID[0].value) {

                        $.each(RDObj, function (i, item) {
                            if (item.FieldTypeID == ruleName) {
                                temp = false;
                            }
                        });

                        if (temp) {
                            alert("当前所有的编码规则的类型没有与实体的重置类型相同，请添加一条相同类型的编码规则。");
                            return;
                        }
                    }
                    //获取类型
                    let $radioCheck = $("input[name='inlineRadioOptions']:checked");
                    if ($radioCheck.length == 1 && $radioCheck.val() == 1) {
                        if (!confirm("已选择激活状态,保存将导致其他同类型且正在使用的编码禁用，是否继续？")) {
                            return;
                        }
                        RSource.ActiveStatus = 1;
                    } else if ($radioCheck.val() == 2) {
                        RSource.ActiveStatus = 2;
                    }

                    RSource.SerialResetBindingTypeID = ruleType;

                    RSource.CodeRuleName = $ruleName.val();

                    RSource.MESFunctionTypeID = $ruleType.val();

                    RSource.CodeRuleGroupID = $ruleTab.val();

                    $com.util.deleteLowerProperty(RSource);

                    model.com.postUpdateCodeRuleInfo({
                        data: RSource
                    }, function (res) {
                        alert("修改成功！！");
                        model.com.RendarRuleDefine(RuleID);
                    });
                });

                //修改编码规则
                $("body").delegate(".lmvt-type-do", "click", function () {

                    var $this = $(this),
                        wDBID = Number($this.closest("td").attr("data-value")),
                        _data;

                    if (wDBID < 0) {
                        _data = RuleAddSource.filter(item => item.ShowID == wDBID)[0];
                    } else
                        _data = RuleDefineSource.filter(item => item.ShowID == wDBID)[0];

                    var defaul_value_rule = {
                        FieldTypeID: _data.FieldTypeID,
                        //FieldLength: _data.FieldLength,
                        FixedCodeString: _data.FixedCodeString,
                        FixedCodeDescription: _data.FixedCodeDescription,
                    };

                    $("body").append($com.modal.show(defaul_value_rule, KETWROD_Rule, "修改", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }
                        if (rst.FixedCodeString.length > Number(rst.FieldLength)) {
                            alert("输入长度大于规定长度");
                            return false;
                        }

                        _data.FieldTypeID = rst.FieldTypeID;
                        _data.FixedCodeString = rst.FixedCodeString;
                        //obj.FieldLength = Number(rst.FieldLength);
                        _data.FixedCodeDescription = rst.FixedCodeDescription;

                        switch (rst.FieldTypeID) {
                            case "Default": _data.FieldLength = 4; break;
                            case "YearCode": _data.FieldLength = 4; break;
                            case "MonthCode": _data.FieldLength = 2; break;
                            case "DayCode": _data.FieldLength = 2; break;
                            case "HourCode": _data.FieldLength = 2; break;
                            case "MinuteCode": _data.FieldLength = 2; break;
                            case "SecondCode": _data.FieldLength = 2; break;
                            case "SerialNumberCode": _data.FieldLength = 4; break;
                            case "FixedCode": _data.FieldLength = _data.FixedCodeString.trim().length; break;
                            default: _data.FieldLength = 4;
                        };

                        if (wDBID < 0) {
                            $.each(RuleAddSource, function (i, item) {
                                if (item.ShowID == wDBID) {
                                    RuleAddSource[i] = _data;
                                }
                            });
                        } else {
                            $.each(RuleDefineSource, function (i, item) {
                                if (item.ShowID == wDBID) {
                                    item.FieldTypeID = rst.FieldTypeID;
                                    item.FixedCodeString = rst.FixedCodeString;
                                    item.FixedCodeDescription = rst.FixedCodeDescription;
                                }
                            });
                        }

                        model.com.RendarFakeTable();
                        alert("修改成功！！");

                    }, TypeSource_Rule));

                });
                //上移
                $("body").delegate("#lmvt-top-move", "click", function () {

                    var source = model.com.GetSourceData(ChoiceID);

                    if (source.Active != 0) {
                        alert("该编码处于无法做更改的状态，无法做更改！！！");
                        return;
                    }

                    var SelectData = $com.table.getSelectionData($(".lmvt-type-body"), "ID", source.CodeDefinitionList);

                    if (!SelectData || !SelectData.length) {
                        alert("至少选择一行数据再试！")
                        return;
                    }
                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其上移？")) {
                        return;
                    }
                    var temp = false;
                    $.each(SelectData, function (i, item) {
                        if (item.Location == 1) {
                            alert("无法上移");
                            temp = true;
                            return false;
                        }
                    });
                    if (temp)
                        return
                    //数组中第一个的下标
                    var index;
                    $.each(source.CodeDefinitionList, function (i, item) {
                        if (item.ID == SelectData[0].ID) {
                            temp = true;
                            index = i;
                        }
                    });

                    var count = 0,
                        cafe = false;
                    var middleArry = SelectData;
                    middleArry = $com.util.Clone(middleArry);
                    source.CodeDefinitionList = model.com.getNewShiftList(source.CodeDefinitionList, middleArry);

                    $.each(SelectData, function (i, item) {
                        source.CodeDefinitionList.splice(index + count - 1, 0, item)
                        count++;
                        if (count == SelectData.length) {
                            return false;
                        }
                    });

                    source.StartCode = "";
                    $.each(source.CodeDefinitionList, function (i, item) {
                        item.Location = i + 1;
                        source.StartCode = source.StartCode + item.DefaultValue;
                        item.ID = 0;
                    });
                    var first = source;
                    first = $com.util.Clone(first);
                    //first.CodeDefinitionList = [];

                    model.com.postCodeEntrySave({
                        data: first,
                    }, function (res) {
                        model.com.postCodeEntrySave({
                            data: source,
                        }, function (res) {
                            alert("保存成功！！");
                            model.com.refresh();
                        });
                    });
                });
                //下移
                $("body").delegate("#lmvt-buttom-move", "click", function () {

                    var source = model.com.GetSourceData(ChoiceID);

                    if (source.Active != 0) {
                        alert("该编码处于无法做更改的状态，无法做更改！！！");
                        return;
                    }

                    var SelectData = $com.table.getSelectionData($(".lmvt-type-body"), "ID", source.CodeDefinitionList);

                    if (!SelectData || !SelectData.length) {
                        alert("至少选择一行数据再试！")
                        return;
                    }
                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其下移？")) {
                        return;
                    }
                    var temp = false;
                    $.each(SelectData, function (i, item) {
                        if (item.Location == source.CodeDefinitionList.length) {
                            alert("无法下移");
                            temp = true;
                            return false;
                        }
                    });
                    if (temp)
                        return
                    //数组中第一个的下标
                    var index;
                    $.each(source.CodeDefinitionList, function (i, item) {
                        if (item.ID == SelectData[SelectData.length - 1].ID) {
                            temp = true;
                            index = i;
                        }
                    });

                    var count = 0,
                        cafe = false;
                    var middleArry = SelectData;
                    middleArry = $com.util.Clone(middleArry);
                    source.CodeDefinitionList = model.com.getNewShiftList(source.CodeDefinitionList, middleArry);

                    $.each(SelectData, function (i, item) {
                        source.CodeDefinitionList.splice(index + count + 1, 0, item)
                        count++;
                        if (count == SelectData.length) {
                            return false;
                        }
                    });

                    source.StartCode = "";
                    $.each(source.CodeDefinitionList, function (i, item) {
                        item.Location = i + 1;
                        source.StartCode = source.StartCode + item.DefaultValue;
                        item.ID = 0;
                    });
                    var first = source;
                    first = $com.util.Clone(first);
                    first.CodeDefinitionList = [];

                    model.com.postCodeEntrySave({
                        data: first,
                    }, function (res) {
                        model.com.postCodeEntrySave({
                            data: source,
                        }, function (res) {
                            alert("保存成功！！");
                            model.com.refresh();
                        });
                    });
                });
                //置底
                $("body").delegate("#lmvt-buttom", "click", function () {

                    var source = model.com.GetSourceData(ChoiceID);

                    if (source.Active != 0) {
                        alert("该编码处于无法做更改的状态，无法做更改！！！");
                        return;
                    }

                    var SelectData = $com.table.getSelectionData($(".lmvt-type-body"), "ID", source.CodeDefinitionList);

                    if (!SelectData || !SelectData.length) {
                        alert("至少选择一行数据再试！")
                        return;
                    }
                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其置底？")) {
                        return;
                    }

                    var middleArry = SelectData;
                    middleArry = $com.util.Clone(middleArry);
                    source.CodeDefinitionList = model.com.getNewShiftList(source.CodeDefinitionList, middleArry);

                    $.each(SelectData, function (i, item) {
                        source.CodeDefinitionList.push(item);
                    });
                    source.StartCode = "";
                    $.each(source.CodeDefinitionList, function (i, item) {
                        item.Location = i + 1;
                        source.StartCode = source.StartCode + item.DefaultValue;
                        item.ID = 0;
                    });
                    var first = source;
                    first = $com.util.Clone(first);
                    first.CodeDefinitionList = [];

                    model.com.postCodeEntrySave({
                        data: first,
                    }, function (res) {
                        model.com.postCodeEntrySave({
                            data: source,
                        }, function (res) {
                            alert("保存成功！！");
                            model.com.refresh();
                        });
                    });
                });
                //置顶
                $("body").delegate("#lmvt-top", "click", function () {

                    var source = model.com.GetSourceData(ChoiceID);

                    if (source.Active != 0) {
                        alert("该编码处于无法做更改的状态，无法做更改！！！");
                        return;
                    }

                    var SelectData = $com.table.getSelectionData($(".lmvt-type-body"), "ID", source.CodeDefinitionList);

                    if (!SelectData || !SelectData.length) {
                        alert("至少选择一行数据再试！")
                        return;
                    }
                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其置底？")) {
                        return;
                    }

                    var middleArry = SelectData;
                    middleArry = $com.util.Clone(middleArry);
                    source.CodeDefinitionList = model.com.getNewShiftList(source.CodeDefinitionList, middleArry);

                    source.CodeDefinitionList = SelectData.concat(source.CodeDefinitionList);
                    source.StartCode = "";
                    $.each(source.CodeDefinitionList, function (i, item) {
                        item.Location = i + 1;
                        source.StartCode = source.StartCode + item.DefaultValue;
                        item.ID = 0;
                    });
                    var first = source;
                    first = $com.util.Clone(first);
                    first.CodeDefinitionList = [];

                    model.com.postCodeEntrySave({
                        data: first,
                    }, function (res) {
                        model.com.postCodeEntrySave({
                            data: source,
                        }, function (res) {
                            alert("保存成功！！");
                            model.com.refresh();
                        });
                    });
                });
                // //双击编码实体
                // $("body").delegate(".lmvt-encoding-body tr", "dblclick", function () {
                //     var $this = $(this),
                //         id = Number($this.find("td[data-title=ID]").attr("data-value"));
                //     var $table = $this.closest("table");
                //     ChoiceID = id;

                //     $table.find("tbody tr").each(function (i, item) {
                //         var $tr = $(this);

                //         if (id == Number($tr.find("td[data-title=ID]").attr("data-value"))) {
                //             $tr.css('background-color', '#7bf1b5');
                //             temp = true;

                //         }
                //         else {
                //             if (!($tr.attr("data-color"))) {

                //                 $tr.css('background-color', '');
                //             } else {

                //                 var colorPro = $tr.attr("data-color");
                //                 $tr.css('background-color', colorPro);
                //             }
                //         }
                //     });

                //     model.com.RendarRule(id);
                //     return false;
                // });
                //新增班组详情
                $("body").delegate("#lmvt-rule-add", "click", function () {

                    var Defaul_Value = {
                        LineID: 0,
                        PartID: 0,
                        PartPointID: 0,
                        StationID: 0,
                    }

                    $("#modal_select_LineID").ready(function () {
                        $("#modal_select_LineID").val(wLineID).trigger('change');
                    });
                    $("body").append($com.modal.show(Defaul_Value, KETWROD_Code, "新增", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }
                        var _data = {
                            TeamID: TeamID,
                            LineID: Number(rst.LineID),
                            PartID: Number(rst.PartID),
                            PartPointID: Number(rst.PartPointID),
                            StationID: Number(rst.StationID),
                        };
                        model.com.postTeamChargeUpdate({
                            data: _data,
                        }, function (res) {
                            alert("新增成功！！");
                            model.com.RendarRuleDefine(TeamID);
                        });

                    }, TypeSource_Code));
                });
                //修改
                $("body").delegate("#lmvt-encoding-change", "click", function () {

                    var SelectData = $com.table.getSelectionData($(".lmvt-encoding-body"), "ID", CodeSource);
                    if (SelectData[0].Active != 0) {
                        alert("该编码处于无法做更改的状态！！！");
                        return;
                    }

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
                        EncodingType: SelectData[0].EncodingType,
                        UpdateBindingFlag: SelectData[0].UpdateBindingFlag,
                    };
                    $("body").append($com.modal.show(default_value, KETWROD_Code, "修改", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        SelectData[0].Name = rst.Name;
                        SelectData[0].EncodingType = Number(rst.EncodingType);
                        SelectData[0].UpdateBindingFlag = Number(rst.UpdateBindingFlag);

                        $com.util.deleteLowerProperty(SelectData[0]);
                        model.com.postCodeEntrySave({
                            data: SelectData[0],
                        }, function (res) {
                            alert("修改成功！！");
                            model.com.refresh();
                        });

                    }, TypeSource_Code));

                });
                //激活
                $("body").delegate("#lmvt-encoding-active", "click", function () {

                    var SelectData = $com.table.getSelectionData($(".lmvt-encoding-body"), "ID", CodeSource);
                    if (!SelectData.CodeDefinitionList || SelectData.CodeDefinitionList.length <= 0) {
                        alert("该编码没有对应生成的规则，请添加完成后激活！！！");
                        return;
                    }

                    if (SelectData[0].Active != 0) {
                        alert("该编码处于无法做更改的状态，无法做更改！！！");
                        return;
                    }

                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return;
                    }

                    if (SelectData.length != 1) {
                        alert("只能选择一条数据进行激活！")
                        return;
                    }

                    if (!confirm("已选择" + SelectData.length + "数据，是否激活？")) {
                        return;
                    }
                    $com.util.deleteLowerProperty(SelectData);
                    model.com.postCodeEntryActive({
                        data: SelectData,
                        Active: 1
                    }, function (res) {
                        alert("激活成功！！");
                        model.com.refresh();
                    });

                });
                //禁用
                $("body").delegate("#lmvt-encoding-forbidden", "click", function () {

                    var SelectData = $com.table.getSelectionData($(".lmvt-encoding-body"), "ID", CodeSource);
                    if (!SelectData.CodeDefinitionList || SelectData.CodeDefinitionList.length <= 0) {
                        alert("该编码没有对应生成的规则，请添加完成后禁用！！！");
                        return;
                    }

                    if (SelectData[0].Active != 0) {
                        alert("该编码处于无法做更改的状态，无法做更改！！！");
                        return;
                    }

                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return;
                    }

                    if (SelectData.length != 1) {
                        alert("只能选择一条数据进行禁用！")
                        return;
                    }

                    if (!confirm("已选择" + SelectData.length + "数据，是否禁用？")) {
                        return;
                    }
                    $com.util.deleteLowerProperty(SelectData);
                    model.com.postCodeEntryActive({
                        data: SelectData,
                        Active: 0
                    }, function (res) {
                        alert("禁用成功！！");
                        model.com.refresh();
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
                wDepartmentID = -1;
                wModuleID = -1;
                wActive = -1;
                wLineID = 1;

                model.com.getDepartment({}, function (res) {
                    if (res.list.length > 0) {
                        $.each(res.list, function (i, item) {
                            TypeSource_Code.DepartmentID.push({
                                name: item.Name,
                                value: item.ID
                            });
                        });

                        model.com.refresh();

                    }
                });

                $.each(UserAll, function (i, item) {
                    TypeSource_Code.CreatorID.push({
                        name: item.Name,
                        value: item.ID
                    });
                    TypeSource_Code.LastEditorID.push({
                        name: item.Name,
                        value: item.ID
                    });
                });

            },
            com: {
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
                //激活编码规则 单条
                postTeamManageActive: function (data, fn, context) {
                    var d = {
                        $URI: "/TeamManage/Active",
                        $TYPE: "post",
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //删除班组 单条
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
                //删除班组详情 单条
                postTeamChargeDelete: function (data, fn, context) {
                    var d = {
                        $URI: "/TeamCharge/Delete",
                        $TYPE: "post",
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                //新增班组
                postTeamManageUpdate: function (data, fn, context) {
                    var d = {
                        $URI: "/TeamManage/Update",
                        $TYPE: "post",
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //新增班组详情
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

                //获取班组分类
                getTeamManageAll: function (data, fn, context) {
                    var d = {
                        $URI: "/TeamManage/All",
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
                refresh: function () {
                    //班组列表
                    model.com.getTeamManageAll({ WorkShopID: wWorkShopID, DepartmentID: wDepartmentID, ModuleID: wModuleID, Active: wActive }, function (res) {

                        CodeSource = $com.util.Clone(res.list);
                        CodeList = $com.util.Clone(res.list);
                        $.each(CodeList, function (i, item) {
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
                                item.LeaderID[m] = UserAll.filter((k) => { return k.ID == item.LeaderID[m] })[0].Name;
                            }

                            item.LeaderIDList = item.LeaderID.join();

                            for (const m in item.MateID) {
                                item.MateID[m] = UserAll.filter((k) => { return k.ID == item.MateID[m] })[0].Name;
                            }
                            item.MateIDList = item.MateID.join();

                        });
                        model.com.RanderCodeList(CodeList);
                    });


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

                //规则
                RendarRuleDefine: function (TeamID) {

                    // RuleSource = CodeSource.filter(item => item.DBID == DBID)[0];
                    // RuleObj = CodeList.filter(item => item.DBID == DBID)[0];
                    // RuleID = DBID;

                    model.com.getTeamChargeAll({
                        TeamID: TeamID,
                        StationID: wStationID,
                        WorkShopID: wWorkShopID,
                        DepartmentID: wDepartmentID,
                        ModuleID: wModuleID,
                        LineID: wLineID,
                        PartID: -1,
                        PartPointID: -1,
                        Active: wActive
                    }, function (res) {

                        RuleDefineSource = $com.util.Clone(res.list);

                        RuleDefineList = $com.util.Clone(res.list);

                        $.each(RuleDefineList, function (i, item) {
                            item.Badge = " ";
                            item.WID = i + 1;

                            if (item.Active == 0) {
                                item.ActiveType = "激活";
                                item.ISDo = "lmvt-do-active";
                                item.ClassBadge = "lmvt-defBadge";
                                item.ISAllowed = "lmvt-allowed-delete";
                            } else if (item.Active == 1) {
                                item.ActiveType = "禁用";
                                item.ISDo = "lmvt-do-forbidden";
                                item.ClassBadge = "lmvt-activeBadge";
                                item.ISAllowed = "lmvt-not-allowed-delete";
                            } else {
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
                        model.com.RanderChargeList(RuleDefineList);


                    });

                },

                //假数据渲染
                RendarFakeTable: function () {

                    var count = 0;

                    $.each(RuleAddSource, function (i, item) {
                        count = count - 1;
                        item.ShowID = count;
                    });

                    $.each(RuleDefineSource, function (i, item) {
                        item.ShowID = i;
                    });

                    // RuleDefineList = $com.util.Clone(RuleDefineSource);

                    // RuleDefineSource = RuleDefineSource.concat(RuleAddSource);

                    // RuleDefineList = RuleDefineList.concat(RuleAddSource);

                    let randerList = [];

                    randerList = $com.util.Clone(RuleDefineSource.concat(RuleAddSource));

                    RuleDefineList = randerList;

                    $.each(RuleDefineList, function (i, item) {


                        if (RuleSource.ActiveStatus == 0) {
                            item.ISEditor = "lmvt-type-do";
                            item.ISAllowed = "lmvt-type-allowed-delete";
                        } else {
                            item.ISEditor = "lmvt-not-allowed";
                            item.ISAllowed = "lmvt-not-allowed";
                        }

                        for (var p in item) {
                            if (!Formattrt_Rule[p])
                                continue;
                            item[p] = Formattrt_Rule[p](item[p]);
                        }

                    });

                    RuleDefineList.sort(function (a, b) {
                        return a.SequenceID - b.SequenceID
                    });


                    ISUpdate = false;
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