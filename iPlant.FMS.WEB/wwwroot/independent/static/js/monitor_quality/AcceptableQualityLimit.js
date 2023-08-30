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

            wLevelCode = 1,

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
                '<td style="min-width: 80px" data-title="Code" data-value="{{Code}}">{{Code}}</td>',
                '<td style="min-width: 80px" data-title="Name" data-value="{{Name}}">{{Name}}</td>',
                '<td style="min-width: 80px" data-title="CreatorID" data-value="{{CreatorID}}">{{CreatorID}}</td>',
                '<td style="min-width: 80px" data-title="CreateTime" data-value="{{CreateTime}}">{{CreateTime}}</td>',

                '<td style="max-width: 30px;color:#C7001A" data-title="ID" data-value="{{ID}}"><div class="row">',
                '<div class="col-md-6 lmvt-code-edit lmvt-do-info">详情</div>',
                // '<div class="col-md-4 lmvt-code-do {{ISDo}}">{{ActiveType}}</div>',
                '<div class="col-md-6" "><UL id="lmvt-nav">',
                '<LI>更多<UL><LI data-value="{{ID}}" class="{{ISReset}} GBReset">修改</LI>',
                '<LI data-value="{{ID}}" class="{{ISAllowed}} GBDelete">删除</LI>',
                '</UL></LI></UL></div>',
                '</div></td>',
                '</tr>'
            ].join(""),

            TemTeam: [
                '<tr>',
                '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></td>',
                '<td style="min-width: 50px" data-title="WID" data-value="{{WID}}">{{WID}}</td>',
                '<td style="min-width: 50px" data-title="Name" data-value="{{Name}}">{{Name}}</td>',
                '<td style="min-width: 80px" data-title="LeftFQTY" data-value="{{LeftFQTY}}">{{LeftFQTY}}</td>',
                '<td style="min-width: 50px" data-title="RightFQTY" data-value="{{RightFQTY}}">{{RightFQTY}}</td>',
                '<td style="min-width: 50px" data-title="Text" data-value="{{Text}}">{{Text}}</td>',

                '<td style="min-width: 50px" data-title="Remark" data-value="{{Remark}}">{{Remark}}</td>',
                '<td style="min-width: 50px" data-title="SampleFQTYCode" data-value="{{SampleFQTYCode}}">{{SampleFQTYCode}}</td>',

                '<td style="min-width: 80px;color:#C7001A" data-title="ID" data-value="{{ID}}"><div class="row">',
                '<div style="color:#409EFF" class="col-md-6 lmvt-code-reset">修改</div>',
                '<div style="#FF0000" class="col-md-6 lmvt-code-delete">删除</div>',
                '</td>',
                '</tr>'

            ].join(""),

            CodeRuleList: [
                '<tr>',
                '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
                '<td data-title="ID" style="display:none" data-value="{{ID}}" >{{ID}}</td>',

                '<td data-title="SampleFQTYCode" data-value="{{SampleFQTYCode}}">{{SampleFQTYCode}}</td>',
                '<td data-title="SampleFQTY" data-value="{{SampleFQTY}}">{{SampleFQTY}}</td>',
                '<td data-title="AQL" data-value="{{AQL}}">{{AQL}}</td>',
                '<td data-title="StandardFQTY" data-value="{{StandardFQTY}}">{{StandardFQTY}}</td>',

                '<td style="min-width: 80px;color:#C7001A" data-title="ID" data-value="{{ID}}"><div class="row">',
                '<div style="color:#409EFF" class="col-md-6 lmvt-AQL-reset">修改</div>',
                '<div style="#FF0000" class="col-md-6 lmvt-AQL-delete">删除</div>',
                '</div></td>',

                '</tr>',
            ].join(""),
        };

        //新增实体
        Defaul_Value_Code = {
            Name: "",
            // Code: "",
            // WorkShopID: 0,
            // DepartmentID: 0,
            // LeaderID: 0,
            // MateID: 0,
            // ModuleID: 0,
            //Active: 0
            // SampleFQTYCode: "A",
            // StandardFQTY: 0,
            // SampleFQTY: 0,
            // AQL: 0,
        };
        (function () {

            KETWROD_LIST_Code = [
                "Name|名称*",
                "Code|编码*",

                "SampleFQTYCode|样本字码|ArrayOne",
                "SampleFQTY|抽样数量*",
                "AQL|AQL*",
                "StandardFQTY|不合格限额（RE）*",


                "SampleFQTYCode|样本字码|ArrayOne",

                "LeftFQTY|批量下限*",
                "RightFQTY|批量上限*",

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

                "CreatorID|人员|ArrayOne",

                "Remark|检验水平|ArrayOne",
            ];

            KETWROD_Code = {};

            Formattrt_Code = {};

            TypeSource_Code = {
                Remark: [
                    {
                        name: "一般检测水平",
                        value: "一般检测水平"
                    },
                    {
                        name: "特殊检测水平",
                        value: "特殊检测水平"
                    }, {
                        name: "全检",
                        value: "全检"
                    }, {
                        name: "其他",
                        value: "其他"
                    }
                ],
                SampleFQTYCode: [
                    {
                        name: "A",
                        value: "A"
                    }, {
                        name: "B",
                        value: "B"
                    }, {
                        name: "C",
                        value: "C"
                    }, {
                        name: "D",
                        value: "D"
                    }, {
                        name: "E",
                        value: "E"
                    }, {
                        name: "F",
                        value: "F"
                    }, {
                        name: "G",
                        value: "G"
                    }, {
                        name: "H",
                        value: "H"
                    }, {
                        name: "J",
                        value: "J"
                    }, {
                        name: "K",
                        value: "K"
                    }, {
                        name: "L",
                        value: "L"
                    }, {
                        name: "M",
                        value: "M"
                    }, {
                        name: "N",
                        value: "N"
                    }
                    , {
                        name: "O",
                        value: "O"
                    }
                    , {
                        name: "P",
                        value: "P"
                    }, {
                        name: "Q",
                        value: "Q"
                    }, {
                        name: "R",
                        value: "R"
                    }, {
                        name: "S",
                        value: "S"
                    }, {
                        name: "T",
                        value: "T"
                    }, {
                        name: "U",
                        value: "U"
                    }, {
                        name: "V",
                        value: "V"
                    }, {
                        name: "W",
                        value: "W"
                    }, {
                        name: "X",
                        value: "X"
                    }, {
                        name: "Y",
                        value: "Y"
                    }
                    , {
                        name: "Z",
                        value: "Z"
                    }
                ],

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
                TypeSource_Code.CreatorID.push({
                    name: item.Name,
                    value: item.ID
                });
            });

            // $.each(WorkShopIDList, function (i, item) {
            //     TypeSource_Code.WorkShopID.push({
            //         name: item.Name,
            //         value: item.ID
            //     });
            // });
            // $.each(LineList, function (i, item) {
            //     TypeSource_Code.LineID.push({
            //         name: item.Name,
            //         value: item.ID
            //     });
            // });
            // $.each(StationList, function (i, item) {
            //     TypeSource_Code.StationID.push({
            //         name: item.Name,
            //         value: item.ID
            //     });
            // });

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
            name: 'AQL管理',
            type: $com.Model.MAIN,
            configure: function () {
                this.run();
            },

            events: function () {

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
                                $com.table.filterByLikeString($(".lmvt-type-body"), AQLList, value, "ID");
                        }
                    }


                });


                //默认
                $("body").delegate("#lmvt-def-LevelCode", "click", function () {
                    wLevelCode = 1;
                    $(".lmvt-LevelCode").text("默认");
                    model.com.RanderAQLList();
                });
                //严格
                $("body").delegate("#lmvt-seri-LevelCode", "click", function () {
                    wLevelCode = 2;
                    $(".lmvt-LevelCode").text("严格");
                    model.com.RanderAQLList();
                });
                //宽松
                $("body").delegate("#lmvt-rela-LevelCode", "click", function () {
                    wLevelCode = 3;
                    $(".lmvt-LevelCode").text("宽松");
                    model.com.RanderAQLList();
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
                        $com.table.filterByLikeString($(".lmvt-type-body"), AQLList, value, "ID");
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
                $("body").delegate(".lmvt-container-main-encoding .GBReset", "click", function () {
                    var $this = $(this),
                        wDBID = Number($this.closest("td").attr("data-value"));

                    var SelectArr = CodeSource.filter(item => item.ID == wDBID)[0];

                    const Defaul_Value = {
                        Name: SelectArr.Name,

                    };

                    $("body").append($com.modal.show(Defaul_Value, KETWROD_Code, "新增", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }

                        // SelectArr.Code = rst.Code;
                        SelectArr.Name = rst.Name;

                        $com.util.deleteLowerProperty(SelectArr);

                        model.com.postSolutionUpdate({
                            data: SelectArr,
                        }, function (res) {
                            alert("修改成功！！");
                            model.com.refresh();
                        });

                    }, TypeSource_Code));

                });
                //增加
                $("body").delegate("#lmvt-encoding-add", "click", function () {

                    $("body").append($com.modal.show(Defaul_Value_Code, KETWROD_Code, "新增", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }

                        var _data = {
                            ID: 0,
                            Code: rst.Code,
                            Name: rst.Name,
                            Remark: rst.Remark,
                        };
                        model.com.postSolutionUpdate({
                            data: _data,
                        }, function (res) {
                            alert("新增成功！！");
                            model.com.refresh();
                        });

                    }, TypeSource_Code));

                });
                //新增字码 表
                $("body").delegate("#lmvt-code-add", "click", function () {

                    var Defaul_Value = {
                        LeftFQTY: 0,
                        RightFQTY: 0,
                        SampleFQTYCode: 0,
                        Remark: "",
                        Name: ""
                    };

                    $("body").append($com.modal.show(Defaul_Value, KETWROD_Code, "新增", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }

                        var _data = {
                            ID: 0,
                            SampleID: TeamID,
                            LeftFQTY: rst.LeftFQTY,
                            RightFQTY: rst.RightFQTY,
                            SampleFQTYCode: rst.SampleFQTYCode,
                            Remark: rst.Remark,
                            Name: rst.Name
                        };

                        model.com.postItemUpdate({
                            data: _data,
                        }, function (res) {
                            alert("新增成功！！");
                            model.com.RendarRuleDefine(TeamID);
                        });

                    }, TypeSource_Code));

                });

                //修改字码 表
                $("body").delegate(".lmvt-code-reset", "click", function () {

                    var $this = $(this),
                        wDBID = Number($this.closest("td").attr("data-value"));

                    var SelectArr = RuleDefineSource.filter(item => item.ID == wDBID)[0];

                    const Defaul_Value = {
                        LeftFQTY: SelectArr.LeftFQTY,
                        RightFQTY: SelectArr.RightFQTY,
                        SampleFQTYCode: SelectArr.SampleFQTYCode,
                        Remark: SelectArr.Remark,
                        Name: SelectArr.Name
                    };

                    $("body").append($com.modal.show(Defaul_Value, KETWROD_Code, "修改", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }

                        SelectArr.LeftFQTY = rst.LeftFQTY;
                        SelectArr.RightFQTY = rst.RightFQTY;
                        SelectArr.SampleFQTYCode = rst.SampleFQTYCode;
                        SelectArr.Remark = rst.Remark;
                        SelectArr.Name = rst.Name;

                        $com.util.deleteLowerProperty(SelectArr);

                        model.com.postItemUpdate({
                            data: SelectArr,
                        }, function (res) {
                            alert("修改成功！！");
                            model.com.RendarRuleDefine(TeamID);
                        });

                    }, TypeSource_Code));

                });

                //修改AQL 表
                $("body").delegate(".lmvt-AQL-reset", "click", function () {

                    var $this = $(this),
                        wDBID = Number($this.closest("td").attr("data-value"));

                    var SelectArr = AQLSource.filter(item => item.ID == wDBID)[0];

                    const Defaul_Value = {
                        SampleFQTYCode: SelectArr.SampleFQTYCode,
                        StandardFQTY: SelectArr.StandardFQTY,
                        AQL: SelectArr.AQL,
                        SampleFQTY: SelectArr.SampleFQTY,
                    };

                    $("body").append($com.modal.show(Defaul_Value, KETWROD_Code, "修改", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }

                        SelectArr.SampleFQTYCode = rst.SampleFQTYCode;
                        SelectArr.StandardFQTY = rst.StandardFQTY;
                        SelectArr.AQL = rst.AQL;
                        SelectArr.SampleFQTY = rst.SampleFQTY;

                        $com.util.deleteLowerProperty(SelectArr);

                        model.com.postAQLUpdate({
                            data: SelectArr,
                        }, function (res) {
                            alert("修改成功！！");
                            model.com.RanderAQLList();
                        });

                    }, TypeSource_Code));

                });

                //删除AQL    单条
                $("body").delegate(".lmvt-AQL-delete", "click", function () {
                    var $this = $(this),
                        wDBID = Number($this.closest("td").attr("data-value"));

                    var SelectObj = AQLSource.filter(item => item.ID == wDBID)[0];

                    if (!confirm("是否删除该条数据？")) {
                        return;
                    }

                    $com.util.deleteLowerProperty(SelectObj);

                    model.com.postAQLDelete({
                        data: SelectObj,
                    }, function (res) {
                        alert("删除成功！！");
                        model.com.RanderAQLList();
                    });
                });

                //删除字码    单条
                $("body").delegate(".lmvt-code-delete", "click", function () {
                    var $this = $(this),
                        wDBID = Number($this.closest("td").attr("data-value"));

                    var SelectObj = RuleDefineSource.filter(item => item.ID == wDBID)[0];

                    if (!confirm("是否删除该条数据？")) {
                        return;
                    }

                    $com.util.deleteLowerProperty(SelectObj);

                    model.com.postItemDelete({
                        data: SelectObj,
                    }, function (res) {
                        alert("删除成功！！");
                        model.com.RendarRuleDefine(TeamID);
                    });
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
                $("body").delegate(".lmvt-container-main-encoding .GBDelete", "click", function () {
                    var $this = $(this),
                        wDBID = Number($this.closest("td").attr("data-value"));

                    var SelectObj = CodeSource.filter(item => item.ID == wDBID)[0];

                    if (!confirm("已选择 [" + SelectObj.Name + "] 是否删除？")) {
                        return;
                    }

                    $com.util.deleteLowerProperty(SelectObj);

                    model.com.postIPTSampleDelete({
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
                
                //新增AQL
                $("body").delegate("#lmvt-rule-add", "click", function () {

                    var Defaul_Value = {
                        SampleFQTYCode: 0,
                        StandardFQTY: 0,
                        AQL: 0,
                        SampleFQTY: 0
                    }

                    $("body").append($com.modal.show(Defaul_Value, KETWROD_Code, "新增", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }

                        var _data = {
                            SampleFQTYCode: rst.SampleFQTYCode,
                            StandardFQTY: Number(rst.StandardFQTY),
                            AQL: rst.AQL,
                            Level: wLevelCode,
                            SampleFQTY: Number(rst.SampleFQTY),
                        };
                        model.com.postAQLUpdate({
                            data: _data,
                        }, function (res) {
                            alert("新增成功！！");

                            model.com.RanderAQLList();
                        });

                    }, TypeSource_Code));
                });


                //导出编码实体
                $("body").delegate("#lmvt-rule-export", "click", function () {
                    var $table = $(".Charge-table>table"),
                        fileName = "AQL.xls",
                        Title = "AQL";
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

                //导入
                $("body").delegate("#lmvt-rule-inport", "click", function () {
                    $("#input-file").val("");
                    $("#input-file").click();
                });
                $("body").delegate("#input-file", "input", function () {
                    var $this = $(this);

                    if (this.files.length == 0)
                        return;

                    if (!extLimit(['xlsx', 'xls']).has(this.files[0].name)) {
                        alert("请上传正确的Excel文件！");
                        clearFiles();
                        return;
                    }
                    var fileData = this.files[0];

                    var form = new FormData();
                    form.append("file", fileData);
                    $com.app.loading("数据导入中...");

                    model.com.postImportExcel(form, function (res) {
                        if (!res)
                            return;
                        res.list.splice(0, 1);//删除第一行
                        var list = res.list,
                            rst = [];
                        if (list) {

                            if (list.length <= 0) {
                                alert("导入数据为空！！！");
                                $com.app.loading();
                            }

                            var postData = res.list;

                            var DataParams = $com.table.postExportParams(postData, $(".lmvt-type-body"));

                            $.each(DataParams, function (i, item) {
                                item.ID = 0;

                                model.com.postAQLUpdate({
                                    data: item,
                                }, function (res) {
                                    model.com.RanderAQLList();
                                });

                            });

                            $com.app.loading();
                        }

                    });
                    function clearFiles() {
                        self.value = "";
                    }

                    function extLimit(exts) {
                        return {
                            has: function (file) {
                                var arr = file.split("."),
                                    ext = arr[arr.length - 1].toLowerCase();

                                return exts.indexOf(ext) > -1 ? true : false;
                            }
                        };
                    }
                });

            },
            run: function () {

                wWorkShopID = -1;
                wDepartmentID = -1;
                wModuleID = -1;
                wActive = -1;
                wLineID = 1;

                model.com.refresh();


                // $.each(UserAll, function (i, item) {
                //     TypeSource_Code.CreatorID.push({
                //         name: item.Name,
                //         value: item.ID
                //     });
                //     TypeSource_Code.LastEditorID.push({
                //         name: item.Name,
                //         value: item.ID
                //     });
                // });

                model.com.RanderAQLList();

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
                getIPTSampleItemAll: function (data, fn, context) {
                    var d = {
                        $URI: "/IPTSample/ItemAll",
                        $TYPE: "get",
                        $SERVER: "/MESQMS"
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
                //删除抽检版本 单条
                postIPTSampleDelete: function (data, fn, context) {
                    var d = {
                        $URI: "/IPTSample/SolutionDelete",
                        $TYPE: "post",
                        $SERVER: "/MESQMS"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //删除班组详情 单条
                postItemDelete: function (data, fn, context) {
                    var d = {
                        $URI: "/IPTSample/ItemDelete",
                        $TYPE: "post",
                        $SERVER: "/MESQMS"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //删除AQL 单条
                postAQLDelete: function (data, fn, context) {
                    var d = {
                        $URI: "/IPTSample/AQLDelete",
                        $TYPE: "post",
                        $SERVER: "/MESQMS"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                //新增班组
                postSolutionUpdate: function (data, fn, context) {
                    var d = {
                        $URI: "/SolutionAll/SolutionUpdate",
                        $TYPE: "post",
                        $SERVER: "/MESQMS"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //新增AQL
                postAQLUpdate: function (data, fn, context) {
                    var d = {
                        $URI: "/IPTSample/AQLUpdate",
                        $TYPE: "post",
                        $SERVER: "/MESQMS"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);

                },
                //新增字码
                postItemUpdate: function (data, fn, context) {
                    var d = {
                        $URI: "/IPTSample/ItemUpdate",
                        $TYPE: "post",
                        $SERVER: "/MESQMS"
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
                getSolutionAll: function (data, fn, context) {
                    var d = {
                        $URI: "/IPTSample/SolutionAll",
                        $TYPE: "get",
                        $SERVER: "/MESQMS"
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

                //新增班组
                postSolutionUpdate: function (data, fn, context) {
                    var d = {
                        $URI: "/IPTSample/SolutionUpdate",
                        $TYPE: "post",
                        $SERVER: "/MESQMS"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                //AQL
                postAQLAll: function (data, fn, context) {
                    var d = {
                        $URI: "/IPTSample/AQLAll",
                        $TYPE: "get",
                        $SERVER: "/MESQMS"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                //新增班组
                // postSolutionUpdate: function (data, fn, context) {
                //     var d = {
                //         $URI: "/SolutionAll/SolutionUpdate",
                //         $TYPE: "post",
                //         $SERVER: "/MESQMS"
                //     };
                //     function err() {
                //         $com.app.tip('获取失败，请检查网络');
                //     }
                //     $com.app.ajax($.extend(d, data), fn, err, context);
                // },

                refresh: function () {
                    //班组列表
                    model.com.getSolutionAll({}, function (res) {

                        CodeSource = $com.util.Clone(res.list);
                        CodeList = $com.util.Clone(res.list);
                        $.each(CodeList, function (i, item) {
                            item.WID = i + 1;
                            for (var p in item) {
                                if (!Formattrt_Code[p])
                                    continue;
                                item[p] = Formattrt_Code[p](item[p]);
                            }
                        });
                        model.com.RanderCodeList(CodeList);
                    });


                },
                //渲染班组清单
                RanderCodeList: function (Data) {

                    $page.init($(".CodeTable"), Data, "", function (res) {
                        CodeRanderSource = res;

                        $(".lmvt-encoding-body").html($com.util.template(res, HTML.CodeList));
                        // $(".lmvt-TemTeam-body").html($com.util.template(res, HTML.TemTeam));
                    });

                },
                //渲染班组职能清单
                RanderChargeList: function (Data) {

                    $page.init($(".Charge-table"), Data, "", function (res) {

                        $(".lmvt-type-body").html($com.util.template(res, HTML.CodeRuleList));

                    });
                },

                //AQL
                RanderAQLList: function () {

                    model.com.postAQLAll({
                        Level: wLevelCode,
                    }, function (res) {

                        AQLSource = $com.util.Clone(res.list);

                        AQLList = $com.util.Clone(res.list);

                        $.each(AQLList, function (i, item) {

                            item.WID = i + 1;

                            for (var p in item) {
                                if (!Formattrt_Code[p])
                                    continue;
                                item[p] = Formattrt_Code[p](item[p]);
                            }
                        });

                        $(".lmvt-type-body").html($com.util.template(AQLList, HTML.CodeRuleList));

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

                    model.com.getIPTSampleItemAll({

                        SampleID: TeamID,

                    }, function (res) {

                        RuleDefineSource = $com.util.Clone(res.list);

                        RuleDefineList = $com.util.Clone(res.list);

                        $.each(RuleDefineList, function (i, item) {
                            item.WID = i + 1;

                            item.Text = item.LeftFQTY + "~" + item.RightFQTY;

                            for (var p in item) {
                                if (!Formattrt_Code[p])
                                    continue;
                                item[p] = Formattrt_Code[p](item[p]);
                            }
                        });

                        $(".lmvt-TemTeam-body").html($com.util.template(RuleDefineList, HTML.TemTeam));

                        // model.com.RanderChargeList(RuleDefineList);
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

                //导入
                postImportExcel: function (data, fn, context) {
                    var d = {
                        $URI: "/Upload/ImportExcel",
                        $TYPE: "post"
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax_load(data ? $.extend(data, d) : $.extend(d, data), fn, err, context);
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