require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($zace, $com) {

    var HTML,
        model,
        DataWorkFlowBasic,
        DataWorkFlowAll,
        DataWorkFlowSearch,
        DataAllConfirmBasic,
        DataAllConfirmChange,
        DataAllConfirm,
        DataAllConfirmSearch,
        EventList,
         DataWorkFlowAllPro,
         DataWorkFlowSearchPro,
        DataWorkStepBasic,
        DataWorkStepOrderAll,
        DataWorkStepAll,  //...
        mStepID,
        mStepName,
        KEYWORD_LIST_WorkFlow,
        FORMATTRT_WorkFlow,
        KEYWORD_WorkFlow,
        TypeSource_WorkFlow,
        DEFAULT_VALUE_WorkFlow,
        KEYWORD_LIST_WorkFlowStep,
        FORMATTRT_WorkFlowStep,
        KEYWORD_WorkFlowStep,
        DEFAULT_VALUE_WorkFlowStep,
        TypeSource_WorkFlowStep;
    DataWorkFlowAllPro = [];
    DataWorkFlowSearchPro = [];
    mStepID = 0;
    mStepName = "";
    DataWorkFlowBasic = DataAllConfirmBasic = DataAllConfirmSearch = [];
    DataWorkFlowAll = DataAllConfirmChange = [];
    DataWorkFlowSearch = DataAllConfirm = [];
    DataWorkStepAll = DataWorkStepBasic = [];
    DataWorkStepOrderAll = EventList = [];

    WorkFlowTemp = {
        Auditor: window.parent.User_Info.Name,
        AuditorID: 0,
        AuditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Creator: window.parent.User_Info.Name,
        CreatorID: 0,
        ID: 0,
        LineID: 0,
        LineName: "",
        Name: "",
        Status: 1,
        StatusText: "",
        StepList: [],
        Text: "",
        VersionText: "",
        WorkShopID: 0,
        WorkShopName: ""
    };

    WorkFlowStepTemp = {
        Active: true,
        Editor: window.parent.User_Info.Name,
        EditorID: 0,
        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Creator: window.parent.User_Info.Name,
        CreatorID: 0,
        ID: 0,
        OrderID: 0,
        Name: "",
        FunctionID: 0,
        FunctionName: "",
        Text: "",
        WorkFlowID: 0,
        WorkFlowName: "",
        EventID: 0,
        EventName: "",
        ModuleID: 0,

    };
    HTML = {
        WorkFlowModeList: [
            '<tr>',
            '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td>',
            '<td style="min-width: 50px" data-title="Name" data-value="{{Name}}">{{Name}}</td>',
            '<td style="min-width: 50px" data-title="WorkShopID" data-value="{{WorkShopID}}">{{WorkShopID}}</td>',
            '<td style="min-width: 50px" data-title="LineID" data-value="{LineID}}">{{LineID}}</td>',
            '<td style="min-width: 50px" data-title="VersionText" data-value="{VersionText}}">{{VersionText}}</td>',
            '<td style="min-width: 50px" data-title="Text" data-value="{{Text}}">{{Text}}</td> ',
           
            '<td style="min-width: 50px" data-title="Creator" data-value="{{Creator}}">{{Creator}}</td>',
            '<td style="min-width: 50px" data-title="Auditor" data-value="{{Auditor}}">{{Auditor}}</td>',
              '<td style="min-width: 50px" data-title="Status" data-value="{Status}}">{{Status}}</td>',
            '</tr>',
        ].join(""),
        WorkFlowStepModeList: [
            '<tr>',
            '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td>',
            '<td style="min-width: 50px" data-title="WorkFlowName" data-value="{{WorkFlowName}}">{{WorkFlowName}}</td>',
            '<td style="min-width: 50px" data-title="Name" data-value="{{Name}}">{{Name}}</td>',
             '<td style="min-width: 50px" data-title="ModuleID" data-value="{{ModuleID}}">{{ModuleID}}</td>',
            '<td style="min-width: 50px" data-title="FunctionID" data-value="{{FunctionID}}">{{FunctionID}}</td>',
            '<td style="min-width: 50px" data-title="EventID" data-value="{{EventID}}">{{EventID}}</td>',
          
            '<td style="min-width: 50px" data-title="OrderID" data-value="{OrderID}}">{{OrderID}}</td>',
             //'<td style="min-width: 50px" data-title="Active" data-value="{Active}}">{{Active}}</td>',
            '<td style="min-width: 50px" data-title="Text" data-value="{Text}}">{{Text}}</td>',
             '<td style="min-width: 50px" data-title="Creator" data-value="{Creator}}">{{Creator}}</td>',
             // '<td style="min-width: 50px" data-title="Editor" data-value="{Editor}}">{{Editor}}</td>',
            '</tr>',
        ].join(""),

    };


    //工作流程
    $(function () {
        KEYWORD_LIST_WorkFlow = [
            "Name|名称",
            //"WorkShopID|车间",
            //"LineID|产线",
             "WorkShopID|车间|ArrayOne",
             "LineID|产线|ArrayOne",
            "VersionText|编码",
            "Text|备注",
            "Status|状态|ArrayOne",

        ];
        FORMATTRT_WorkFlow = {};
        KEYWORD_WorkFlow = {};
        DEFAULT_VALUE_WorkFlow = {
            LineID: 0,
            //LineName: "",
            Name: "",
            // Status: 1,
            Text: "",
            VersionText: "",
            WorkShopID: 0,
            //WorkShopName: ""
        };
        TypeSource_WorkFlow = {
            WorkShopID: [
          {
              name: "无",
              value: 0,
              far: 0
          }
            ],
            LineID: [
              {
                  name: "无",
                  value: 0,
                  far: 0
              }
            ],
            Status: [{
                name: "默认值",
                value: 0
            },
            ],
        };
        $.each(KEYWORD_LIST_WorkFlow, function (i, item) {
            var detail = item.split("|");
            KEYWORD_WorkFlow[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_WorkFlow[detail[0]] = $com.util.getFormatter(TypeSource_WorkFlow, detail[0], detail[2]);
            }

        });

    });
    //工作流程 详细
    (function () {
        KEYWORD_LIST_WorkFlowStep = [
            "Name|名称",
            "OrderID|顺序",
            "ModuleID|职能|ArrayOneControl",
            "FunctionID|职能分组|ArrayOneControl|ModuleID",
             "EventID|作业类型|ArrayOneControl|ModuleID",
            "Text|备注",
            "Active|状态|ArrayOne",
        ];
        FORMATTRT_WorkFlowStep = {};
        KEYWORD_WorkFlowStep = {};
        DEFAULT_VALUE_WorkFlowStep = {
            //Active: true,
            // OrderID: 0,
            Name: "",
            ModuleID: 1,
            FunctionID: 0,
            EventID:0,
            Text: "",
        };
        TypeSource_WorkFlowStep = {
            ModuleID: [],
            FunctionID: [
            ],
            EventID: [
            ],           
            Active: [{
                name: "激活",
                value: true
            }, {
                name: "禁用",
                value: false
            }
            ],
        };
        $.each(KEYWORD_LIST_WorkFlowStep, function (i, item) {
            var detail = item.split("|");
            KEYWORD_WorkFlowStep[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined

            };
            if (detail.length > 2) {
                FORMATTRT_WorkFlowStep[detail[0]] = $com.util.getFormatter(TypeSource_WorkFlowStep, detail[0], detail[2]);
            }

        });

    })();


    model = $com.Model.create({
        name: '工作流程',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            //=================所有列表
            $("body").delegate("#zace-allList-level", "click", function () {
               
                $(".lmvt-container-system").hide();
                $(".zzzBasic").hide();
                $(".zzzAudit").hide();
                $(".zzzAll").show();
                model.com.refresh();

            });
            //我的申请
            $("body").delegate("#zace-myApproval-level", "click", function () {
                $(".zzzBasic").css("margin-right", "0px");
                $(".lmvt-container-system").css("width", "0%");
                $(".lmvt-container-system").hide();
                $(".zzzBasic").show();
                $(".zzzAudit").hide();
                $(".zzzAll").hide();
                model.com.refresh();

            });
            //我的审核
            $("body").delegate("#zace-myAudit-level", "click", function () {
              
                $(".lmvt-container-system").hide();
                $(".zzzBasic").hide();
                $(".zzzAudit").show();
                $(".zzzAll").hide();
                model.com.refresh();


            });
            //导出
            $("body").delegate("#lmvt-deviceinfo-output", "click", function () {
                var $table = $(".deviceinfo-table"),
                    fileName = "设备信息.xls",
                    Title = "设备信息";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });
            });

            //双击 展开工作步骤//
            $("body").delegate("#zace-workFlow-tbody  tr", "dblclick", function () {
                var $this = $(this);
                var $table = $this.closest("table");
                var wid = Number($this.find('td[data-title=ID]').attr('data-value'));
                mStepID = wid;
                mStepName = $this.find('td[data-title=Name]').attr('data-value');
                model.com.refreshStep();

                $table.find("tbody tr").each(function (i, item) {
                    var $tr = $(this);

                    if (wid == Number($tr.find("td[data-title=ID]").attr("data-value"))) {
                        $tr.css('background-color', '#7bf1b5');
                        temp = true;

                    }
                    else {
                        if (!($tr.attr("data-color"))) {

                            $tr.css('background-color', '');
                        } else {

                            var colorPro = $tr.attr("data-color");
                            $tr.css('background-color', colorPro);
                        }
                    }
                });

                $(".zzzAudit").hide();
                $(".zzzBasic").css("margin-right", "600px");
                $(".lmvt-container-system").css("width", "600px");
                $(".lmvt-container-system").show();

            });
            //隐藏
            $("body").delegate("#zace-close-workFlowStep", "click", function () {
                $(".zzzAll").hide();
                $(".zzzAudit").hide();
                $(".zzzBasic").css("margin-right", "0px");
                $(".lmvt-container-system").css("width", "0%");
                $(".lmvt-container-system").hide();
                model.com.refresh();

            });

            ////我的审核
            //$("body").delegate("#zace-myAudit-workFlow", "click", function () {
            //    $(".zzzAudit").show();
            //    $(".zzzBasic").hide();
            //    $(".lmvt-container-system").hide();

            //});
            //我的审核返回
            $("body").delegate("#zace-auditReturn-workFlow", "click", function () {
                $(".zzzAll").hide();
                $(".zzzAudit").hide();
                $(".zzzBasic").css("margin-right", "0px");
                $(".lmvt-container-system").css("width", "0%");
                $(".zzzBasic").show();
                $(".lmvt-container-system").hide();

            });
            //流程查询
            $("body").delegate("#zace-search-text-workFlow", "input", function () {

                var $this = $(this),
                   value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#zace-workFlow-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#zace-workFlow-tbody"), DataWorkFlowSearch, value, "ID");



            });
            $("body").delegate("#zace-searchZall-level", "click", function () {
                var default_value = {
                    LineID: 0,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_WorkFlow, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.LineID = Number(rst.LineID);
                    $com.table.filterByConndition($("#femi-workFlow-tbody"), DataWorkFlowBasic, default_value, "ID");

                }, TypeSource_WorkFlow));


            });
            //新增
            $("body").delegate("#zace-add-workFlow", "click", function () {

                //将Json数据中的数据值改成对应默认值，然后传入进去
                $("body").append($com.modal.show(DEFAULT_VALUE_WorkFlow, KEYWORD_WorkFlow, "新增", function (rst) {
                    //调用插入函数 

                    if (!rst || $.isEmptyObject(rst))
                        return;
                    WorkFlowTemp.LineID = Number(rst.LineID),
                    WorkFlowTemp.Name = rst.Name,
                    //WorkFlowTemp.Status = Number(rst.Status),
                    WorkFlowTemp.Text = rst.Text,
                    WorkFlowTemp.VersionText = rst.VersionText,
                    WorkFlowTemp.WorkShopID = Number(rst.WorkShopID),


                    model.com.postBPMWorkFlowAll({
                        data: WorkFlowTemp
                    }, function (res) {
                        alert("新增成功");
                        $("#zace-close-workFlowStep").click();
                    })

                }, TypeSource_WorkFlow));

            });
            //修改
            $("body").delegate("#zace-pencil-workFlow", "click", function () {

                var SelectData = $com.table.getSelectionData($("#zace-workFlow-tbody"), "ID", DataWorkFlowAll);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                if ((SelectData[0].Status != 1) && (SelectData[0].Status != 0)) {
                    alert("数据选择有误,请选择状态为创建的数据!")
                    return;
                }

                var default_value = {
                    LineID: SelectData[0].LineID,
                    Name: SelectData[0].Name,
                    Text: SelectData[0].Text,
                    VersionText: SelectData[0].VersionText,
                    WorkShopID: SelectData[0].WorkShopID,
                    //Status: SelectData[0].Status,
                };

                $("body").append($com.modal.show(default_value, KEYWORD_WorkFlow, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].LineID = Number(rst.LineID);
                    SelectData[0].Name = rst.Name;
                    SelectData[0].Text = rst.Text;
                    SelectData[0].VersionText = rst.VersionText;
                    SelectData[0].WorkShopID = Number(rst.WorkShopID);

                    model.com.postBPMWorkFlowAll({
                        data: SelectData[0]
                    }, function (res) {
                        alert("修改成功");
                        $("#zace-close-workFlowStep").click();
                    })

                }, TypeSource_WorkFlow));
            });
            //流程提交
            $("body").delegate("#zace-up-workFlow", "click", function () {
                var SelectData = $com.table.getSelectionData($("#zace-workFlow-tbody"), "ID", DataWorkFlowAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }

                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].Status == 2 || SelectData[i].Status == 0) {
                        alert("数据选择有误,请选择状态为创建的数据!");
                        return;

                    }
                    else if (SelectData[i].Status == 3 || SelectData[i].Status == 4) {
                        alert("数据选择有误,请选择状态为创建的数据!");
                        return;
                    }

                }
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其提交？")) {
                    return;
                }
                var a = 0;
                for (var i = 0; i < SelectData.length; i++) {

                    SelectData[i].Status = 2;

                    model.com.postBPMWorkFlowAll({
                        data: SelectData[i],
                    }, function (res) {
                        a++;
                        if (a == SelectData.length) {
                            alert("提交成功");
                            $("#zace-close-workFlowStep").click();
                        }
                    })
                }
            });
            //流程撤销
            $("body").delegate("#zace-return-workFlow", "click", function () {
                var SelectData = $com.table.getSelectionData($("#zace-workFlow-tbody"), "ID", DataWorkFlowAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }

                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].Status == 1 || SelectData[i].Status == 0) {
                        alert("数据选择有误,请选择状态为待审核的数据!");
                        return;

                    }
                    else if (SelectData[i].Status == 3 || SelectData[i].Status == 4) {
                        alert("数据选择有误,请选择状态为待审核的数据!");
                        return;
                    }

                }
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其撤回？")) {
                    return;
                }
                var a = 0;
                for (var i = 0; i < SelectData.length; i++) {

                    SelectData[i].Status = 1;

                    model.com.postBPMWorkFlowAll({
                        data: SelectData[i],
                    }, function (res) {
                        a++;
                        if (a == SelectData.length) {
                            alert("撤销成功");
                            $("#zace-close-workFlowStep").click();
                        }
                        
                    })
                }



            });

            //流程审核
            $("body").delegate("#zace-audit-workFlow", "click", function () {
                var SelectData = $com.table.getSelectionData($("#zace-AuditworkFlow-tbody"), "ID", DataAllConfirmChange);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }

                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].Status == 1 || SelectData[i].Status == 0) {
                        alert("数据选择有误,请选择状态为待审核的数据!");
                        return;

                    }
                    else if (SelectData[i].Status == 3 || SelectData[i].Status == 4) {
                        alert("数据选择有误,请选择状态为待审核的数据!");
                        return;
                    }

                }
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其审核？")) {
                    return;
                }
                var a = 0;
                for (var i = 0; i < SelectData.length; i++) {
                    SelectData[i].Status = 3;

                    model.com.auditBPMWorkFlowAll({
                        data: SelectData[i],
                    }, function (res) {
                        a++;
                        if (a == SelectData.length) {
                            alert("审核成功");
                            model.com.refresh();
                        }
                    })
                }
            });

            //流程反审核
            $("body").delegate("#zace-Raudit-workFlow", "click", function () {
                var SelectData = $com.table.getSelectionData($("#zace-AuditworkFlow-tbody"), "ID", DataAllConfirmChange);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }

                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].Status == 2 || SelectData[i].Status == 1) {
                        alert("数据选择有误,请选择状态为已审核的数据!");
                        return;

                    }
                    else if (SelectData[i].Status == 0 || SelectData[i].Status == 4) {
                        alert("数据选择有误,请选择状态为已审核的数据!");
                        return;
                    }

                }
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其反审核？")) {
                    return;
                }
                var a = 0;
                for (var i = 0; i < SelectData.length; i++) {

                    SelectData[i].Status = 1;

                    model.com.auditBPMWorkFlowAll({
                        data: SelectData[i],
                    }, function (res) {
                        a++;
                        if (a == SelectData.length) {
                            alert("反审核成功");
                            model.com.refresh();
                        }
                    })
                }
            });
            //审核流程查询
            $("body").delegate("#zace-search-text-workFlowS", "input", function () {

                var $this = $(this),
                   value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#zace-AuditworkFlow-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#zace-AuditworkFlow-tbody"), DataAllConfirmSearch, value, "ID");



            });
            $("body").delegate("#zace-returnAudit-level", "click", function () {
                var default_value = {
                    LineID: 0,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_WorkFlow, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.LineID = Number(rst.LineID);
                    $com.table.filterByConndition($("#femi-AuditworkFlow-tbody"), DataAllConfirmBasic, default_value, "ID");

                }, TypeSource_WorkFlow));


            });

            //所有  流程查询
            $("body").delegate("#zace-search-text-workFlowSS", "input", function () {

                var $this = $(this),
                   value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#zace-AuditworkFlowAll-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#zace-AuditworkFlowAll-tbody"), DataWorkFlowSearchPro, value, "ID");



            });
            $("body").delegate("#zace-returnAllList-level", "click", function () {
                var default_value = {
                    LineID: 0,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_WorkFlow, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.LineID = Number(rst.LineID);
                    $com.table.filterByConndition($("#femi-AuditworkFlowAll-tbody"), DataWorkFlowAllPro, default_value, "ID");

                }, TypeSource_WorkFlow));


            });

            //工作流程详细  新增
            $("body").delegate("#zace-add-workFlowStep", "click", function () {

                //将Json数据中的数据值改成对应默认值，然后传入进去
                $("body").append($com.modal.show(DEFAULT_VALUE_WorkFlowStep, KEYWORD_WorkFlowStep, "新增", function (rst) {
                    //调用插入函数 

                    if (!rst || $.isEmptyObject(rst))
                        return;
                   // WorkFlowStepTemp.Active = rst.Active;
                    //WorkFlowStepTemp.OrderID=Number(rst.OrderID);
                    WorkFlowStepTemp.OrderID = model.com.GetMaxOrderID(DataWorkStepBasic);
                    WorkFlowStepTemp.Name = rst.Name;
                    WorkFlowStepTemp.FunctionID = Number(rst.FunctionID);
                    WorkFlowStepTemp.ModuleID = Number(rst.ModuleID);
                    WorkFlowStepTemp.EventID = Number(rst.EventID);
                    WorkFlowStepTemp.Text = rst.Text;
                    WorkFlowStepTemp.WorkFlowID = mStepID;
                    WorkFlowStepTemp.WorkFlowName = mStepName;


                    model.com.postBPMWFStep({
                        data: WorkFlowStepTemp
                    }, function (res) {
                        alert("新增成功");
                        model.com.refreshStep();
                    })

                }, TypeSource_WorkFlowStep));

            });

            //修改
            $("body").delegate("#zace-pencil-workFlowStep", "click", function () {

                var SelectData = $com.table.getSelectionData($("#zace-workFlowStep-tbody"), "ID", DataWorkStepOrderAll);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }

                var default_value = {
                    Text: SelectData[0].Text,
                    EventID: SelectData[0].EventID,
                    ModuleID: SelectData[0].ModuleID,
                    FunctionID: SelectData[0].FunctionID,
                    //OrderID: SelectData[0].OrderID,
                    Name: SelectData[0].Name,
                };

                $("body").append($com.modal.show(default_value, KEYWORD_WorkFlowStep, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    //SelectData[0].OrderID = Number(rst.OrderID);
                    SelectData[0].FunctionID = Number(rst.FunctionID);
                    SelectData[0].ModuleID = Number(rst.ModuleID);
                    SelectData[0].EventID = Number(rst.EventID);
                    SelectData[0].Name = rst.Name;
                    SelectData[0].Text = rst.Text;

                    model.com.postBPMWFStep({
                        data: SelectData[0]
                    }, function (res) {
                        alert("修改成功");
                        model.com.refreshStep();
                    })

                }, TypeSource_WorkFlowStep));
            });
            //增加同级
            $("body").delegate("#zace-add-samelevel", "click", function () {

                var SelectData = $com.table.getSelectionData($("#zace-workFlowStep-tbody"), "ID", DataWorkStepOrderAll);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                $("body").append($com.modal.show(DEFAULT_VALUE_WorkFlowStep, KEYWORD_WorkFlowStep, "新增", function (rst) {
                    //调用插入函数 

                    if (!rst || $.isEmptyObject(rst))
                        return;
                    //WorkFlowStepTemp.Active = rst.Active;
                    //WorkFlowStepTemp.OrderID=Number(rst.OrderID);
                    WorkFlowStepTemp.OrderID = SelectData[0].OrderID;
                    WorkFlowStepTemp.Name = rst.Name;
                    WorkFlowStepTemp.FunctionID = Number(rst.FunctionID);
                    WorkFlowStepTemp.ModuleID = Number(rst.ModuleID);
                    WorkFlowStepTemp.EventID = Number(rst.EventID);
                    WorkFlowStepTemp.Text = rst.Text;
                    WorkFlowStepTemp.WorkFlowID = mStepID;
                    WorkFlowStepTemp.WorkFlowName = mStepName;


                    model.com.postBPMWFStep({
                        data: WorkFlowStepTemp
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                    })

                }, TypeSource_WorkFlowStep));

            });
            //上移
            $("body").delegate("#zace-up-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#zace-workFlowStep-tbody"), 'ID', DataWorkStepBasic);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return false;
                } else if (SelectData.length > 1) {
                    alert(" 一次只能对一行数据移动！")
                    return false;
                }
                //判断是否在第一行
                if (SelectData[0].OrderID == 1) {
                    alert("已在第一项！！！");
                    return false;
                }

                SelectData[0].OrderID -= 1;
                var upData = model.com.getDataOne(SelectData[0].OrderID);

                model.com.postBPMWFStep({
                    data: SelectData[0],
                }, function (res) {

                    var a = 0;

                    $com.app.loading();

                    var WhileAdd = function () {
                        upData[a].OrderID += 1;
                        model.com.postBPMWFStep({
                            data: upData[a],
                        }, function (res) {
                            a++;

                            if (a == upData.length) {
                                $com.app.loaded();

                                alert("上移成功");
                                model.com.refreshStep();
                            } else {
                                WhileAdd();
                            }
                        });

                    }
                    if (upData.length <= 0) {
                        alert("数据为空！！！");
                    } else {
                        WhileAdd();
                    }

                })
            });


            //下移
            $("body").delegate("#zace-down-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#zace-workFlowStep-tbody"), 'ID', DataWorkStepBasic);
                //判断是否在最后一行
                var WOrderID = DataWorkStepOrderAll[DataWorkStepOrderAll.length - 1].OrderID;
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                } else if (SelectData.length > 1) {
                    alert(" 一次只能对一行数据移动！")
                    return;
                }
                if (SelectData[0].OrderID == WOrderID) {
                    alert("已在最后一项！！！");
                    return;
                }

                SelectData[0].OrderID += 1;
                var upData = model.com.getDataOne(SelectData[0].OrderID);
                model.com.postBPMWFStep({
                    data: SelectData[0],
                }, function (res) {

                    var a = 0;

                    $com.app.loading();

                    var WhileAdd = function () {
                        upData[a].OrderID -= 1;
                        model.com.postBPMWFStep({
                            data: upData[a],
                        }, function (res) {
                            a++;

                            if (a == upData.length) {
                                $com.app.loaded();

                                alert("下移成功");
                                model.com.refreshStep();
                            } else {
                                WhileAdd();
                            }
                        });

                    }
                    if (upData.length <= 0) {
                        alert("数据为空！！！");
                    } else {
                        WhileAdd();
                    }

                })
            });

            //激活
            $("body").delegate("#zace-active-workFlowStep", "click", function () {
                var SelectData = $com.table.getSelectionData($("#zace-workFlowStep-tbody"), "ID", DataWorkStepOrderAll);

                if (!SelectData || !SelectData.length) {
                    alert("至少选择一行数据！")
                    return;
                }
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其激活？")) {
                    return;
                }
                model.com.activeBPMWFStep({
                    data: SelectData,
                    active: 1
                }, function (res) {
                    alert("激活成功");
                    model.com.refresh();
                })
            });

            //删除
            $("body").delegate("#zace-delete-workFlowStep", "click", function () {
                var SelectData = $com.table.getSelectionData($("#zace-workFlowStep-tbody"), "ID", DataWorkStepOrderAll);

                if (!SelectData || !SelectData.length) {
                    alert("请选择一行数据！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                if (!confirm("确定将其删除吗？")) {
                    return;
                }
                model.com.deleteBPMWFStep({
                    data: SelectData[0],                    
                }, function (res) {
                    alert("删除成功");
                    model.com.refreshStep();
                })
            });

            //禁用
            $("body").delegate("#zace-dasable-workFlowStep", "click", function () {
                var SelectData = $com.table.getSelectionData($("#zace-workFlowStep-tbody"), "ID", DataWorkStepOrderAll);

                if (!SelectData || !SelectData.length) {
                    alert("至少选择一行数据！")
                    return;
                }
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其禁用？")) {
                    return;
                }
                model.com.activeBPMWFStep({
                    data: SelectData,
                    active: 0
                }, function (res) {
                    alert("禁用成功");
                    model.com.refresh();
                })
            });


            //$("body").delegate("#modal_select_ModuleID", "change", function () {

            //    //小写字母开头（局部变量）  大写字母开头（全局变量） 驼峰式命名（wTypeObject）
            //    var wTypeValue = Number($("#modal_select_ModuleID").val());

            //    var wTypeList = [];
            //    //根据TypeID获取Type对象本身
            //    $.each(EventList, function (i, item) {
            //        var module = parseInt(item.ID / 1000);
            //        if (module == wTypeValue) {
            //            TypeSource_WorkFlowStep.EventIDC.push({
            //                name: item.ItemName,
            //                value: item.ID,
            //                far: module
            //            })
            //        }
            //    });
            //    for (var i = 0; i < EventList.length; i++) {
            //        var module = parseInt(EventList[i].ID / 1000);
            //        if (module == wTypeValue) {
            //            wTypeList.push(EventList[i].ID);
            //        }
            //    }

            //    $("#modal_select_EventIDC").selectpicker("val", wTypeList);
            //    $("#modal_select_EventIDC").selectpicker("refresh");
            //});


        },

        run: function () {
            model.com.getModuleAll({ module: 400002 }, function (resModule) {
                if (resModule && resModule.list) {
                    $.each(resModule.list, function (i, item) {
                        TypeSource_WorkFlow.Status.push({
                            name: item.ItemName,
                            value: item.ID,
                            far: null
                        })
                    });
                }

                model.com.getFunction({ workshopID: 0, lineID: 0 }, function (resP) {

                    if (resP && resP.list) {
                        $.each(resP.list, function (i, item) {
                            TypeSource_WorkFlowStep.FunctionID.push({
                                name: item.Name,
                                value: item.ID,
                                far: item.ModuleID
                            })
                        });
                    }
                    model.com.getFMCLine({ FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0 }, function (resW) {
                        if (resW && resW.list) {
                            //DataLinelist = resW.list;
                            $.each(resW.list, function (i, item) {
                                TypeSource_WorkFlow.LineID.push({
                                    name: item.Name,
                                    value: item.ID,
                                    far: 0
                                });
                            });

                        }
                        model.com.getFMCWorkShop({ FactoryID: 0, BusinessUnitID: 0 }, function (resW) {
                            if (resW && resW.list) {
                                // DataWorkShoplist = resW.list;
                                $.each(resW.list, function (i, item) {
                                    TypeSource_WorkFlow.WorkShopID.push({
                                        name: item.Name,
                                        value: item.ID,
                                        far: 0
                                    });
                                });

                            }
                            model.com.getModuleAll({ module: 400001 }, function (resModule1) {
                                if (resModule1 && resModule1.list) {
                                    $.each(resModule1.list, function (i, item) {
                                        TypeSource_WorkFlowStep.ModuleID.push({
                                            name: item.ItemName,
                                            value: item.ID,
                                            far: 0
                                        })
                                    });
                                }
                                model.com.getModuleAll({ module: 400003 }, function (resEvent) {
                                    if (resEvent && resEvent.list) {
                                        EventList = resEvent.list;
                                        $.each(resEvent.list, function (i, item) {
                                            var module = parseInt(item.ID / 1000);                                          
                                                TypeSource_WorkFlowStep.EventID.push({
                                                    name: item.ItemName,
                                                    value: item.ID,
                                                    far: module
                                                });                                            
                                        });
                                    }
                                    model.com.setMMM();
                                    model.com.refresh();
                                });
                            });
                        });
                    });
                });
            });
        },

        com: {
            setMMM: function () {
                setTimeout(function () {

                    if (window.parent._zaceWorkShop && window.parent._zaceWorkShop == 1) {
                        model.com.getFMCWorkShop({ FactoryID: 0, BusinessUnitID: 0 }, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {
                                TypeSource_WorkFlow.WorkShopID.splice(1, TypeSource_WorkFlow.WorkShopID.length - 1);
                                //TypeSource_Level.WorkShopID = [];
                                $.each(resW.list, function (i, item) {
                                    TypeSource_WorkFlow.WorkShopID.push({
                                        name: item.Name,
                                        value: item.ID,
                                        far: 0
                                    });
                                });
                            }
                            window.parent._zaceWorkShop = 0;
                        });

                    }

                    if (window.parent._zaceLineSet && window.parent._zaceLineSet == 1) {
                        model.com.getFMCLine({ FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0 }, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {
                                TypeSource_WorkFlow.LineID.splice(1, TypeSource_WorkFlow.LineID.length - 1);
                                //TypeSource_Level.LineID = [];
                                $.each(resW.list, function (i, item) {
                                    TypeSource_WorkFlow.LineID.push({
                                        name: item.Name,
                                        value: item.ID,
                                        far: 0
                                    });
                                });
                            }
                            window.parent._zaceLineSet = 0;
                        });

                    }
                    if (window.parent._zacePositionSet && window.parent._zacePositionSet == 1) {
                        model.com.getFunction({ workshopID: 0, lineID: 0 }, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {
                                TypeSource_WorkFlowStep.FunctionID = [];
                                //TypeSource_Level.LineID = [];
                                $.each(resW.list, function (i, item) {
                                    TypeSource_WorkFlowStep.FunctionID.push({
                                        name: item.Name,
                                        value: item.ID,
                                        far: item.ModuleID
                                    })
                                });
                            }
                            window.parent._zacePositionSet = 0;
                        });

                    }

                    model.com.setMMM();
                }, 500);

            },
            refresh: function () {
                model.com.getBPMWorkFlowAll({ workshopID: 0, lineID: 0 }, function (resW) {
                    if (resW && resW.list) {

                        //审核数据
                        DataAllConfirm = $com.util.Clone(resW.list);
                        DataWorkFlowBasic = $com.util.Clone(resW.list);
                        DataWorkFlowAll = $com.util.Clone(resW.list);
                        for (var i = 0; i < DataWorkFlowAll.length; i++) {
                            DataWorkFlowAll[i].WID = i + 1;
                        }
                        var _list = $com.util.Clone(DataWorkFlowAll);
                        $.each(_list, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_WorkFlow[p])
                                    continue;
                                item[p] = FORMATTRT_WorkFlow[p](item[p]);
                            }
                        });
                        DataWorkFlowSearch = $com.util.Clone(_list);
                        $("#zace-workFlow-tbody").html($com.util.template(_list, HTML.WorkFlowModeList));


                        //===========审核
                        DataAllConfirmChange = $com.util.Clone(resW.list);
                        //for (var i = 0; i < DataAllConfirm.length; i++) {
                        //    if (DataAllConfirm[i].Status == 2 || (DataAllConfirm[i].Status == 3 && DataAllConfirm[i].Auditor == window.parent.User_Info.Name)) {
                        //        DataAllConfirmChange.push(DataAllConfirm[i]);
                        //    }
                        //}
                        DataAllConfirmBasic = $com.util.Clone(DataAllConfirmChange);
                        for (var j = 0; j < DataAllConfirmChange.length; j++) {
                            DataAllConfirmChange[j].WID = j + 1;
                        }
                        var _listC = $com.util.Clone(DataAllConfirmChange);
                        $.each(_listC, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_WorkFlow[p])
                                    continue;
                                item[p] = FORMATTRT_WorkFlow[p](item[p]);
                            }
                        });
                        DataAllConfirmSearch = $com.util.Clone(_listC);
                        $("#zace-AuditworkFlow-tbody").html($com.util.template(_listC, HTML.WorkFlowModeList));

                    }


                })
                model.com.getBPMWorkFlowAll({ workshopID: 0, lineID: 0 }, function (resW) {
                    if (resW && resW.list) {

                      //所有数据
                        DataWorkFlowAllPro = $com.util.Clone(resW.list);
                        for (var i = 0; i < DataWorkFlowAllPro.length; i++) {
                            DataWorkFlowAllPro[i].WID = i + 1;
                        }
                        var _list = $com.util.Clone(DataWorkFlowAllPro);
                        $.each(_list, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_WorkFlow[p])
                                    continue;
                                item[p] = FORMATTRT_WorkFlow[p](item[p]);
                            }
                        });
                        DataWorkFlowSearchPro = $com.util.Clone(_list);
                        $("#zace-AuditworkFlowAll-tbody").html($com.util.template(_list, HTML.WorkFlowModeList));


                    }
                   

                })
                model.com.getBPMWFStep({ WorkFlowID: mStepID }, function (resS) {
                    if (resS && resS.list) {

                        DataWorkStepBasic = $com.util.Clone(resS.list);
                        DataWorkStepAll = $com.util.Clone(resS.list);
                        //for (var i = 0; i < DataWorkStepAll.length; i++) {
                        //    DataWorkStepAll[i].WID = i + 1;
                        //}
                        var _list = $com.util.Clone(DataWorkStepAll);
                        //按照流程顺序   从小到大排序
                       // _list = model.com.orderList(_list);
                        //for (var j = 0; j < _list.length; j++) {
                        //    _list[j].WOID = j + 1;
                        //}
                        DataWorkStepOrderAll = $com.util.Clone(_list);
                        $.each(_list, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_WorkFlowStep[p])
                                    continue;
                                item[p] = FORMATTRT_WorkFlowStep[p](item[p]);
                            }
                        });


                        $("#zace-workFlowStep-tbody").html($com.util.template(_list, HTML.WorkFlowStepModeList));


                    }


                })
            },
            refreshStep:function(){
                model.com.getBPMWFStep({ WorkFlowID: mStepID }, function (resS) {
                    if (resS && resS.list) {

                        DataWorkStepBasic = $com.util.Clone(resS.list);
                        DataWorkStepAll = $com.util.Clone(resS.list);
                        //for (var i = 0; i < DataWorkStepAll.length; i++) {
                        //    DataWorkStepAll[i].WID = i + 1;
                        //}
                        var _list = $com.util.Clone(DataWorkStepAll);
                        //按照流程顺序   从小到大排序
                        // _list = model.com.orderList(_list);
                        //for (var j = 0; j < _list.length; j++) {
                        //    _list[j].WOID = j + 1;
                        //}
                        DataWorkStepOrderAll = $com.util.Clone(_list);
                        $.each(_list, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_WorkFlowStep[p])
                                    continue;
                                item[p] = FORMATTRT_WorkFlowStep[p](item[p]);
                            }
                        });


                        $("#zace-workFlowStep-tbody").html($com.util.template(_list, HTML.WorkFlowStepModeList));


                    }


                })
            },
            deleteBPMWFStep: function (data, fn, context) {
                var d = {
                    $URI: "/BPMWFStep/Delete",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //导入
            postImportExcel: function (data, fn, context) {
                var d = {
                    $URI: "/Upload/ImportExcel",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('导入失败，请检查网络');
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
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询车间
            getFMCWorkShop: function (data, fn, context) {
                var d = {
                    $URI: "/FMCWorkShop/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //查询产线
            getFMCLine: function (data, fn, context) {
                var d = {
                    $URI: "/FMCLine/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询岗位职能列表
            getFunction: function (data, fn, context) {
                var d = {
                    $URI: "/BPMFunction/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //所有工作流程信息
            getBPMWorkFlowAll: function (data, fn, context) {
                var d = {
                    $URI: "/BPMWorkFlow/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //更新工作流程
            postBPMWorkFlowAll: function (data, fn, context) {
                var d = {
                    $URI: "/BPMWorkFlow/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //审核工作流程
            auditBPMWorkFlowAll: function (data, fn, context) {
                var d = {
                    $URI: "/BPMWorkFlow/Audit",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询模块ID对应枚举值
            getModuleAll: function (data, fn, context) {
                var d = {
                    $URI: "/MESEnum/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },


            //所有工作流程详细  信息
            getBPMWFStep: function (data, fn, context) {
                var d = {
                    $URI: "/BPMWFStep/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //更新工作流程详细
            postBPMWFStep: function (data, fn, context) {
                var d = {
                    $URI: "/BPMWFStep/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //激活工作流程详细 
            activeBPMWFStep: function (data, fn, context) {
                var d = {
                    $URI: "/BPMWFStep/Active",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //按照顺序号  显示数据
            orderList: function (_source) {
                var _list = [];
                var arr = [];
                $.each(_source, function (i, item) {
                    arr.push(item.OrderID);
                    // arr.push(item);

                });
                var arr1 = arr.sort();
                var newArr = [];
                for (var i = 0; i < arr1.length; i++) {
                    if (newArr.indexOf(arr1[i]) == -1) {
                        newArr.push(arr1[i])
                    }
                }
                var arr2 = newArr;

                for (var j = 0; j < arr2.length; j++) {
                    for (var i = 0; i < _source.length; i++) {
                        if (_source[i].OrderID == arr2[j]) {

                            _list.push(_source[i]);
                        }

                    }
                }


                return _list;

            },
            getDataOne: function (ID) {
                var _list = [];
                for (var i = 0; i < DataWorkStepOrderAll.length; i++) {
                    if (ID == DataWorkStepOrderAll[i].OrderID) {
                        _list.push(DataWorkStepOrderAll[i]);
                    }
                }
                return _list;

            },
            GetMaxOrderID: function (_source) {
                var id = 0;
                if (!_source)
                    _source = [];
                $.each(_source, function (i, item) {
                    if (item.OrderID > id)
                        id = item.OrderID;
                });
                return id + 1;

            },
        }
    });

    model.init();


});