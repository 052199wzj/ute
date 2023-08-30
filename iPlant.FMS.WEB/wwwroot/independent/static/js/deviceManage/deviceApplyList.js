require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {

    var HTML,
        model,
        PropertyField,
        KEYWORD,
        KEYWORD_PROPERTY,
        KEYWORD_LIST,
        KEYWORD_LIST_PROPERTY,
        DEFAULT_VALUE,
        DEFAULT_VALUE_PROPERTY,
        KETWROD_Template_Arrange,
        TypeSource_Arrange,
        TypeSource,
        TypeSource_PROPERTY,
        FORMATTRT,
        FORMATTRT_PROPERTY,
        DMSDeviceSource,
        DMSDevicePropertySource,
        Formattrt_Arrange,
        DATA,
        DataAll,
        DEFAULT_VALUE_Status,
        DataAll2,
        AllUser,
        AllBusinessUnit,
        AllFactory,
        AllWorkShop,
        AllLine,
        AllDeviceLedger,
        AllModelID,
        BOOL,
        TIME;
   
    HTML = {
        DeviceType: [
         '<tr data-color="">',
         '<td style="width: 3px"><input type="checkbox"',
         'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
         '<td style="min-width: 50px" data-title="ID"  data-value="{{ID}}">{{ID}}</td> ',
         '<td style="min-width: 50px" data-title="ApplyNo " data-value="{{ApplyNo}}">{{ApplyNo}}</td>   ',
         '<td style="min-width: 50px" data-title="ModelID" data-value="{{ModelID}}">{{ModelID}}</td>',
         '<td style="min-width: 50px" data-title="BusinessUnitID" data-value="{{BusinessUnitID}}">{{BusinessUnitID}}</td>    ',
         '<td style="min-width: 50px" data-title="WorkShopID" data-value="{{WorkShopID}}">{{WorkShopID}}</td>   ',
         '<td style="min-width: 50px" data-title="LineID" data-value="{{LineID}}">{{LineID}}</td>   ',
         '<td style="min-width: 50px" data-title="ApplicantID" data-value="{{ApplicantID}}">{{ApplicantID}}</td>  ',
         '<td style="min-width: 50px" data-title="ApplicantTime" data-value="{{ApplicantTime}}">{{ApplicantTime}}</td>  ',
         '<td data-title="ApproverID " data-value="{{ApproverID}}" >{{ApproverID}}</td>',
         '<td style="min-width: 50px" data-title="ApproverTime" data-value="{{ApproverTime}}">{{ApproverTime}}</td> ',
         '<td style="min-width: 50px" data-title="ConfirmID" data-value="{{ConfirmID}}">{{ConfirmID}}</td>   ',
         '<td style="min-width: 50px" data-title="ConfirmTime" data-value="{{ConfirmTime}}">{{ConfirmTime}}</td> ',
         '<td style="min-width: 50px" data-title="Status" data-value="{{Status}}">{{Status}}</td>  ',
         '</tr>',
        ].join(""),
    };

    (function () {
        KETWROD_LIST_Arrange = [
            "Status|状态|ArrayOne",
            "ApplicantID|申请人|ArrayOne",
            "ApproverID|审批人|ArrayOne",
            "ConfirmID|确认人|ArrayOne",
            "ModelID|设备型号|ArrayOne",
            "BusinessUnitID|所属部门|ArrayOne",
            "FactoryID|生产基地下的工厂|ArrayOne",
            "WorkShopID|车间|ArrayOne",
            "LineID|产线|ArrayOne",

            "ApplicantTime|申请时刻|DateTime",
            "ApproverTime|审批时刻|DateTime",
            "ConfirmTime|确认时刻|DateTime",
        ];

        KETWROD_Template_Arrange = {};

        Formattrt_Arrange = {};

        TypeSource_Arrange = {
            Status: [
                   {
                       name: "未提交",
                       value: 0
                   },
                {
                    name: "待审核",
                    value: 1
                },
            {
                name: "已撤销",
                value: 2
            },
             {
                 name: "已审核",
                 value: 3
             },
              {
                  name: "已驳回",
                  value: 4
              },
               {
                   name: "已确认",
                   value: 5
               },
            ],
            ApplicantID: [],
            ApproverID: [],
            ConfirmID: [],
            ModelID: [],
            BusinessUnitID: [
            
            ],
            FactoryID: [
                
            ],
            WorkShopID: [
                 
            ],
            LineID: [
                 
            ],
        };
        $.each(KETWROD_LIST_Arrange, function (i, item) {
            var detail = item.split("|");
            KETWROD_Template_Arrange[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };

            if (detail.length > 2) {
                Formattrt_Arrange[detail[0]] = $com.util.getFormatter(TypeSource_Arrange, detail[0], detail[2]);
            }
        });
    })();

    (function () {
        KEYWORD_Point_LIST1 = [
        "BusinessUnitID|所属部门|ArrayOneControl",
        //"FactoryID|生产基地下的工厂|ArrayOneControl",
        "WorkShopID|车间|ArrayOneControl|BusinessUnitID",
        "LineID|产线|ArrayOneControl|WorkShopID",
        "ModelID|设备型号|ArrayOne",
        ];
       
        FORMATTRT = {};
        KEYWORD1 = {};
     
        DEFAULT_VALUE1 = {
            ApplyNo: "",
            ModelID: 0,
            BusinessUnitID:0,
            FactoryID:0,
            WorkShopID:0,
            LineID:0,
            Status: 0,
            SpareNum: 0,
        };
        TypeSource_Point1 = {
            ApproverID: [],
            ConfirmID: [],
            BusinessUnitID: [
               {
                   name: "无",
                   value: 0,
                   far:0,

               }
            ],
            FactoryID: [
                  {
                      name: "无",
                      value: 0,
                      far: 0,

                  }
            ],
            WorkShopID: [
                 {
                     name: "无",
                     value: 0,
                     far: 0,

                 }
            ],
            LineID: [
                 {
                     name: "无",
                     value: 0,
                     far: 0,

                 }
            ],
            ModelID:[],
        };

        $.each(KEYWORD_Point_LIST1, function (i, item) {
            var detail = item.split("|");
            KEYWORD1[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT[detail[0]] = $com.util.getFormatter(TypeSource_Point1, detail[0], detail[2]);
            }
        });
        
    })();

    model = $com.Model.create({
        name: '设备台账方案',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();
        },
        events: function () {
            $("body").delegate("#lmvt-table-basic-add-templet", "click", function () {
                $("#input-file").val("");
                $("#input-file").click();

            });
            //导入
            $("body").delegate("#input-file", "change", function () {
                alert()
                var $this = $(this);

                if (this.files.length == 0)
                    return;
                var fileData = this.files[0];

                var form = new FormData();
                form.append("file", fileData);

                model.com.postImportExcel(form, function (res) {
                    console.log("sss");

                });

            });
            //导出
            $("body").delegate("#lmvt-table-basic-active-basic", "click", function () {
                var $table = $("#deviceSparePart1"),
                  fileName = "设备申请单.xls",
                  Title = "设备申请单";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.getExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });
            });
            //模糊查询
            $("body").delegate("#femi-search-text-ledger", "change", function () {
                var $this = $(this),
                   value = $(this).val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $(".lmvt-system-body").children("tr").show();
                    else
                        $com.table.filterByLikeString($(".lmvt-system-body"), DataAll, value, "ID");
            });
            $("body").delegate("#femi-search-text-ledger1", "change", function () {
                var $this = $(this),
                   value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $(".lmvt-apply-body").children("tr").show();
                else
                    $com.table.filterByLikeString($(".lmvt-apply-body"), DataAll, value, "ID");
            });
            $("body").delegate("#femi-search-text-ledger2", "change", function () {
                var $this = $(this),
                   value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $(".lmvt-confirm-body").children("tr").show();
                else
                    $com.table.filterByLikeString($(".lmvt-confirm-body"), DataAll, value, "ID");
            });
            $("body").delegate("#femi-search-text-ledger3", "change", function () {
                var $this = $(this),
                   value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $(".lmvt-decide-body").children("tr").show();
                else
                    $com.table.filterByLikeString($(".lmvt-decide-body"), DataAll, value, "ID");
            });
            //条件查询
            $("body").delegate("#lmvt-left-check", "click", function () {
                var default_value = {
                    BusinessUnitID: 0,
                    FactoryID: 0,
                    WorkShopID: 0,
                    LineID: 0,
                 
                }
                $("body").append($com.modal.show(default_value, KEYWORD1, "查询", function (rst) {
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    model.com.get({
                        ModelID: 0, ApplicantID: 0, ApproverID: 0,
                        ConfirmID: 0, WorkShopID: Number(rst.WorkShopID), LineID: Number(rst.LineID), OAGetType: 0,
                        BusinessUnitID: Number(rst.BusinessUnitID), BaseID: 0, FactoryID: Number(rst.FactoryID),
                    }, function (res) {
                        if (!res)
                            return;
                        var list = res.list;
                        RanderData = res.list;
                        RanderData = $com.util.Clone(RanderData);
                      
                        $.each(RanderData, function (i, item) {
                            for (var p in item) {
                                if (!Formattrt_Arrange[p])
                                    continue;
                                item[p] = Formattrt_Arrange[p](item[p]);
                            }
                        });
                        $(".lmvt-system-body").html($com.util.template(RanderData, HTML.DeviceType));
                        $(".lmvt-system-body tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });
                      
                    });
                }, TypeSource_Point1));
            });
            $("body").delegate("#lmvt-left-check1", "click", function () {
                var default_value = {
                    BusinessUnitID: 0,
                    FactoryID: 0,
                    WorkShopID: 0,
                    LineID: 0,

                }
                $("body").append($com.modal.show(default_value, KEYWORD1, "查询", function (rst) {
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    model.com.get({
                        ModelID: 0, ApplicantID: 0, ApproverID: 0,
                        ConfirmID: 0, WorkShopID: Number(rst.WorkShopID), LineID: Number(rst.LineID), OAGetType: 1,
                        BusinessUnitID: Number(rst.BusinessUnitID), BaseID: 0, FactoryID: Number(rst.FactoryID),
                    }, function (res) {
                        if (!res)
                            return;
                        var list = res.list;
                        RanderData = res.list;
                        RanderData = $com.util.Clone(RanderData);

                        $.each(RanderData, function (i, item) {
                            for (var p in item) {
                                if (!Formattrt_Arrange[p])
                                    continue;
                                item[p] = Formattrt_Arrange[p](item[p]);
                            }
                        });
                        $(".lmvt-apply-body").html($com.util.template(RanderData, HTML.DeviceType));
                        $(".lmvt-apply-body tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });

                    });
                }, TypeSource_Point1));
            });
            $("body").delegate("#lmvt-left-check2", "click", function () {
                var default_value = {
                    BusinessUnitID: 0,
                    FactoryID: 0,
                    WorkShopID: 0,
                    LineID: 0,

                }
                $("body").append($com.modal.show(default_value, KEYWORD1, "查询", function (rst) {
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    model.com.get({
                        ModelID: 0, ApplicantID: 0, ApproverID: 0,
                        ConfirmID: 0, WorkShopID: Number(rst.WorkShopID), LineID: Number(rst.LineID), OAGetType: 3,
                        BusinessUnitID: Number(rst.BusinessUnitID), BaseID: 0, FactoryID: Number(rst.FactoryID),
                    }, function (res) {
                        if (!res)
                            return;
                        var list = res.list;
                        RanderData = res.list;
                        RanderData = $com.util.Clone(RanderData);

                        $.each(RanderData, function (i, item) {
                            for (var p in item) {
                                if (!Formattrt_Arrange[p])
                                    continue;
                                item[p] = Formattrt_Arrange[p](item[p]);
                            }
                        });
                        $(".lmvt-confirm-body").html($com.util.template(RanderData, HTML.DeviceType));
                        $(".lmvt-confirm-body tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });

                    });
                }, TypeSource_Point1));
            });
            $("body").delegate("#lmvt-left-check3", "click", function () {
                var default_value = {
                    BusinessUnitID: 0,
                    FactoryID: 0,
                    WorkShopID: 0,
                    LineID: 0,

                }
                $("body").append($com.modal.show(default_value, KEYWORD1, "查询", function (rst) {
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    model.com.get({
                        ModelID: 0, ApplicantID: 0, ApproverID: 0,
                        ConfirmID: 0, WorkShopID: Number(rst.WorkShopID), LineID: Number(rst.LineID), OAGetType: 2,
                        BusinessUnitID: Number(rst.BusinessUnitID), BaseID: 0, FactoryID: Number(rst.FactoryID),
                    }, function (res) {
                        if (!res)
                            return;
                        var list = res.list;
                        RanderData = res.list;
                        RanderData = $com.util.Clone(RanderData);

                        $.each(RanderData, function (i, item) {
                            for (var p in item) {
                                if (!Formattrt_Arrange[p])
                                    continue;
                                item[p] = Formattrt_Arrange[p](item[p]);
                            }
                        });
                        $(".lmvt-decide-body").html($com.util.template(RanderData, HTML.DeviceType));
                        $(".lmvt-decide-body tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });
                    });
                }, TypeSource_Point1));
            });
            //新增申请单
            $("body").delegate("#femi-add-property", "click", function () {
                //将Json数据中的数据值改成对应默认值，然后传入进去
                $("body").append($com.modal.show(DEFAULT_VALUE1, KEYWORD1, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    var _data = {
                        ID: 0,
                        ApplyNo: rst.ApplyNo,
                        ModelID: Number(rst.ModelID),
                        BusinessUnitID: Number(rst.BusinessUnitID),
                        WorkShopID: Number(rst.WorkShopID),
                        LineID: Number(rst.LineID),
                        SpareNum: rst.SpareNum,
                        ApplicantTime:$com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                    };
                        model.com.addA(
                         { data:_data}
                         , function (res) {
                             alert("新增成功");
                             //model.com.refreshA();
                             model.com.refresh();
                        })
                }, TypeSource_Point1));
            });
            //修改申请单
            $("body").delegate("#femi-edit-property", "click", function () {
              
                var SelectData = $com.table.getSelectionData($(".lmvt-system-body"), "ID", DataAllOriginal);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                if (SelectData[0].Status != 0 && SelectData[0].Status != 2) {
                    alert("修改只作用于未提交，请更改！")
                    return;
                }
                var default_value = {
                    ID: SelectData[0].ID,
                    ApplyNo: SelectData[0].ApplyNo,
                    ModelID:SelectData[0].ModelID,
                    BusinessUnitID: SelectData[0].BusinessUnitID,
                    //FactoryID: SelectData[0].FactoryID,
                    WorkShopID:SelectData[0].WorkShopID,
                    LineID: SelectData[0].LineID,
                    //ApproverID: SelectData[0].ApproverID,
                    //ConfirmID: SelectData[0].ConfirmID,
                    SpareNum: SelectData[0].SpareNum,
                };
                $("body").append($com.modal.show(default_value, KEYWORD1, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    var _data = {};
                    _data.ID = SelectData[0].ID
                    _data.ApplyNo = rst.ApplyNo,
                    _data.ModelID = Number(rst.ModelID),
                    _data.BusinessUnitID = Number(rst.BusinessUnitID),
                    //_data.FactoryID = Number(rst.FactoryID),
                    _data.WorkShopID=Number(rst.WorkShopID),
                    _data.LineID = Number(rst.LineID),
                    //_data.LineID = Number(rst.LineID),
                    //_data.ApplicantID = SelectData[0].ApplicantID,
                    //_data.ApproverID = Number(rst.ApproverID),
                    //_data.ConfirmID = Number(rst.ConfirmID),
                    _data.ApplicantTime=$com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                    _data.SpareNum = rst.SpareNum,
                    model.com.addA(
                         { data: _data }
                    , function (res) {
                        alert("修改成功");
                        //model.com.refreshA();
                        model.com.refresh();
                    })
                }, TypeSource_Point1));
            });
            //提交
            $("body").delegate("#get", "click", function () {
                var SelectData = $com.table.getSelectionData($(".lmvt-system-body"), "ID", DataAllOriginal);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行或多行数据再试！")
                    return;
                }
                var index = 0;
                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].Status != 0) {
                        alert("提交只作用于未提交，请更改！");
                        return;
                    }
                }
                for (var i = 0; i < SelectData.length; i++) {
                   
                    var _data = {};
                    _data.ID = SelectData[i].ID
                    _data.ApplyNo = SelectData[i].ApplyNo,
                    _data.ModelID = SelectData[i].ModelID,
                    _data.BusinessUnitID = SelectData[i].BusinessUnitID,
                    //_data.FactoryID = SelectData[i].FactoryID,
                    _data.WorkShopID = SelectData[i].WorkShopID,
                    _data.LineID = SelectData[i].LineID,
                    //_data.ApplicantID = SelectData[i].ApplicantID,
                    //_data.ApproverID = SelectData[i].ApproverID,
                    //_data.ConfirmID = SelectData[i].ConfirmID,
                     _data.ApplicantTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                    _data.Status = 1,
                    _data.SpareNum = SelectData[i].SpareNum,
                      model.com.addA(
                         { data: _data }
                    , function (res) {
                        if (index == SelectData.length - 1) {
                            alert("已提交");
                            //model.com.refreshA();
                            model.com.refresh();
                        }
                        index++;
                    })
                }
            });
            //通过审核
            $("body").delegate("#femi-decide", "click", function () {
                var SelectData = $com.table.getSelectionData($(".lmvt-system-body"), "ID", DataAllOriginal);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行或多行数据再试！")
                    return;
                }
                var index = 0;
                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].Status != 1) {
                        alert("审核作用于提交之后，请更改！")
                        return;
                    }
                }
                for (var i = 0; i < SelectData.length; i++) {
                    var _data = {};
                    _data.ID = SelectData[i].ID
                    _data.ApplyNo = SelectData[i].ApplyNo,
                    _data.ModelID = SelectData[i].ModelID,
                    _data.BusinessUnitID = SelectData[i].BusinessUnitID,
                    //_data.FactoryID = SelectData[i].FactoryID,
                    _data.WorkShopID = SelectData[i].WorkShopID,
                    _data.LineID = SelectData[i].LineID,
                    _data.ApplicantID = SelectData[i].ApplicantID,
                    _data.ApproverID = SelectData[i].ApproverID,
                    _data.ConfirmID = SelectData[i].ConfirmID,
                    _data.ApproverTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                    _data.ApplicantTime = SelectData[i].ApplicantTime,
                    _data.ConfirmTime = SelectData[i].ConfirmTime,
                    _data.Status = 3,
                    _data.SpareNum = SelectData[i].SpareNum,
                      model.com.addA(
                         { data: _data }
                    , function (res) {
                        if (index == SelectData.length - 1) {
                            alert("通过审核");
                            //model.com.refreshD();
                            model.com.refresh();
                        }
                        index++;
                    })
                }
                
            });
            //撤销
            $("body").delegate("#recall-decide", "click", function () {
                var SelectData = $com.table.getSelectionData($(".lmvt-system-body"), "ID", DataAllOriginal);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行或多行数据再试！")
                    return;
                }
             
                var index = 0;
                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].Status != 1 && SelectData[i].Status != 4) {
                        alert("当前状态无法撤销！")
                        return;
                    }
                }
                for (var i = 0; i < SelectData.length; i++) {
                  
                    var _data = {};
                    _data.ID = SelectData[i].ID
                    _data.ApplyNo = SelectData[i].ApplyNo,
                    _data.ModelID = SelectData[i].ModelID,
                    _data.BusinessUnitID = SelectData[i].BusinessUnitID,
                    //_data.FactoryID = SelectData[i].FactoryID,
                    _data.WorkShopID = SelectData[i].WorkShopID,
                    _data.ApplicantTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                    _data.LineID = SelectData[i].LineID,
                    _data.ApplicantID = SelectData[i].ApplicantID,
                    _data.ApproverID = SelectData[i].ApproverID,
                    _data.ConfirmID = SelectData[i].ConfirmID,
                    _data.Status = 2,
                    _data.SpareNum = SelectData[i].SpareNum,
                      model.com.addA(
                         { data: _data }
                    , function (res) {
                        if (index == SelectData.length - 1) {
                            alert("已撤销");
                           // model.com.refreshA();
                            model.com.refresh();
                           
                        }
                        index++;
                    })
                }
            });
            //确认
            $("body").delegate("#femi-confirm", "click", function () {
                var SelectData = $com.table.getSelectionData($(".lmvt-system-body"), "ID", DataAllOriginal);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行或多行数据再试！")
                    return;
                }
                var index = 0;
                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].Status != 3) {
                        alert("确认作用于审核通过，请更改！")
                        return;
                    }
                }
                for (var i = 0; i < SelectData.length; i++) {
                    var _data = {};
                    _data.ID = SelectData[i].ID
                    _data.ApplyNo = SelectData[i].ApplyNo,
                    _data.ModelID = SelectData[i].ModelID,
                    _data.BusinessUnitID = SelectData[i].BusinessUnitID,
                    //_data.FactoryID = SelectData[i].FactoryID,
                    _data.WorkShopID = SelectData[i].WorkShopID,
                    _data.LineID = SelectData[i].LineID,
                    _data.ApplicantID = SelectData[i].ApplicantID,
                    _data.ApproverID = SelectData[i].ApproverID,
                    _data.ConfirmID = SelectData[i].ConfirmID,
                    _data.ConfirmTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                    _data.ApplicantTime = SelectData[i].ApplicantTime,
                    _data.ApproverTime = SelectData[i].ApproverTime,
                    _data.Status = 5,
                    _data.SpareNum = SelectData[i].SpareNum,
                      model.com.addA(
                         { data: _data }
                    , function (res) {
                        if (index == SelectData.length - 1) {
                            alert("已确认");
                           // model.com.refreshC();
                            model.com.refresh();
                           
                        }
                        index++;
                    })
                }
            });
            //驳回
            $("body").delegate("#recall-confirm", "click", function () {
                var SelectData = $com.table.getSelectionData($(".lmvt-system-body"), "ID", DataAllOriginal);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行或多行数据再试！")
                    return;
                }
             
                var index = 0;
                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].Status != 3 && SelectData[i].Status != 1) {
                        alert("无法驳回，请更改!")
                        return;
                    }
                }
                for (var i = 0; i < SelectData.length; i++) {
                    var _data = {};
                    _data.ID = SelectData[i].ID
                    _data.ApplyNo = SelectData[i].ApplyNo,
                    _data.ModelID = SelectData[i].ModelID,
                    _data.BusinessUnitID = SelectData[i].BusinessUnitID,
                    //_data.FactoryID = SelectData[i].FactoryID,
                    _data.WorkShopID = SelectData[i].WorkShopID,
                    _data.LineID = SelectData[i].LineID,
                    _data.ApplicantID = SelectData[i].ApplicantID,
                    _data.ApproverID = SelectData[i].ApproverID,
                    _data.ConfirmID = SelectData[i].ConfirmID,
                    _data.ApproverTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                    _data.ApplicantTime = SelectData[i].ApplicantTime,
                    _data.ConfirmTime = SelectData[i].ConfirmTime,
                    _data.Status = 4,
                    _data.SpareNum = SelectData[i].SpareNum,
                      model.com.addA(
                         { data: _data }
                    , function (res) {
                        if (index == SelectData.length - 1) {
                            alert("已驳回");
                           // model.com.refreshD();
                            model.com.refresh();
                        }
                        index++;
                    })
                }
            });
            //设备申请单
            $("body").delegate("#spareApply", "click", function () {
                model.com.refresh();
                $(".lmvt-container-system").show();
                $(".lmvt-container-confirm").hide();
                $(".lmvt-container-decide").hide();
                $(".lmvt-container-apply").hide();
                
            });
            //我的申请单
            $("body").delegate("#myApply", "click", function () {

                //$(".lmvt-container-system").css("width", "55%");
                //$(".lmvt-container-apply").css("width", "45%");
                $(".lmvt-container-system").hide();
                $(".lmvt-container-confirm").hide();
                $(".lmvt-container-decide").hide();
                $(".lmvt-container-apply").show();
                model.com.refreshA();
            });
            //我的确认单
            $("body").delegate("#myConfirm", "click", function () {

                model.com.refreshC();
                $(".lmvt-container-system").hide();
                $(".lmvt-container-confirm").show();
                $(".lmvt-container-apply").hide();
                $(".lmvt-container-decide").hide();

            });

            //我的审核单
            $("body").delegate("#myDecide", "click", function () {
                model.com.refreshD();
                $(".lmvt-container-confirm").hide();
                $(".lmvt-container-system").hide();
                $(".lmvt-container-apply").hide();
                $(".lmvt-container-decide").show();
            });
        },
        run: function () {
            model.com.load();
           
        },
        com: {
           //所有设备
            getDevice: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceModel/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);

            },
            //所有设备
            //getSpare: function (data, fn, context) {
            //    var d = {
            //        $URI: "/SpareModel/All",
            //        $TYPE: "get"
            //    };
            //    function err() {
            //        $com.app.tip('获取失败，请检查网络');
            //    }
            //    $com.app.ajax($.extend(d, data), fn, err, context);
            //},
            get: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceLedgerApply/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
       
            //导出
            getExportExcel: function (data, fn, context) {
                var d = {
                    $URI: "/Upload/ExportExcel",
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
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax_load($.extend(d, data), fn, err, context);
            },
            getProperty: function (data, fn, context) {
                var d = {
                    $URI: "/Device/Property",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getWorkShop: function (data, fn, context) {
                var d = {
                    $URI: "/WorkShop/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            refresh: function () {
                model.com.get({
                    ModelID: 0, ApplicantID: 0, ApproverID: 0,
                    ConfirmID: 0, WorkShopID: 0, LineID: 0, OAGetType: 0,
                    BusinessUnitID: 0, BaseID: 0, FactoryID: 0,
                }, function (res) {
                    if (!res)
                        return;
                    var list = res.list;
                    RanderData = res.list;
                    RanderData = $com.util.Clone(RanderData);
                    for (var i = 0; i < RanderData.length; i++) {
                        for (var j = 0; j < AllUser.length; j++) {
                            if (RanderData[i].ApplicantID == AllUser[j].ID) {
                                TypeSource_Arrange.ApplicantID.push({ name: AllUser[j].Name, value: AllUser[j].ID });
                            }
                            if (RanderData[i].ApproverID == AllUser[j].ID) {
                                TypeSource_Arrange.ApproverID.push({ name: AllUser[j].Name, value: AllUser[j].ID });
                            }
                            if (RanderData[i].ConfirmID == AllUser[j].ID) {
                                TypeSource_Arrange.ConfirmID.push({ name: AllUser[j].Name, value: AllUser[j].ID });
                            }
                        }
                        for (var m = 0; m < AllBusinessUnit.length; m++) {
                            if (RanderData[i].BusinessUnitID == AllBusinessUnit[m].ID) {
                                TypeSource_Arrange.BusinessUnitID.push({ name: AllBusinessUnit[m].Name, value: AllBusinessUnit[m].ID });
                            }
                        }
                        //for (var n = 0; n < AllFactory.length; n++) {
                        //    if (RanderData[i].FactoryID == AllFactory[n].ID) {
                        //        TypeSource_Arrange.FactoryID.push({ name: AllFactory[n].Name, value: AllFactory[n].ID });
                        //    }
                        //}
                        for (var a = 0; a < AllWorkShop.length; a++) {
                            if (RanderData[i].WorkShopID == AllWorkShop[a].ID) {
                                TypeSource_Arrange.WorkShopID.push({ name: AllWorkShop[a].Name, value: AllWorkShop[a].ID });
                            }
                        }
                        for (var b = 0; b < AllLine.length; b++) {
                            if (RanderData[i].LineID == AllLine[b].ID) {
                                TypeSource_Arrange.LineID.push({ name: AllLine[b].Name, value: AllLine[b].ID });
                            }
                        }
                   
                        for (var d = 0; d < AllDeviceLedger.length; d++) {
                            if (RanderData[i].ModelID == AllDeviceLedger[d].ID) {
                                TypeSource_Arrange.ModelID.push({ name: AllDeviceLedger[d].ModelNo, value: AllDeviceLedger[d].ID });
                            }
                        }
                    }
                    $.each(RanderData, function (i, item) {
                        for (var p in item) {
                            if (!Formattrt_Arrange[p])
                                continue;
                            item[p] = Formattrt_Arrange[p](item[p]);
                        }
                    });
                    $(".lmvt-system-body").html($com.util.template(RanderData, HTML.DeviceType));
                    $(".lmvt-system-body tr").each(function (i, item) {
                        var $this = $(this);
                        var colorName = $this.css("background-color");
                        $this.attr("data-color", colorName);



                    });
                    DataAllOriginal = list;//原始数据
                    DataAll = RanderData;//模糊查询（处理过的数据）
                });
            },
            //refreshA: function () {
                
            //    model.com.get({
            //        ModelID:0,ApplicantID:0,ApproverID:0,
            //        ConfirmID: 0, WorkShopID: 0, LineID: 0, OAGetType:0,
            //        BusinessUnitID:0,BaseID:0,FactoryID:0,
            //    }, function (res) {
            //        if (!res)
            //            return;
            //        var list = res.list;
            //        RanderData = $com.util.Clone(list);
            //        for (var i = 0; i < RanderData.length; i++) {
            //            for (var j = 0; j < AllUser.length; j++) {
            //                if (RanderData[i].ApplicantID == AllUser[j].ID) {
            //                    TypeSource_Arrange.ApplicantID.push({ name: AllUser[j].Name, value: AllUser[j].ID });
            //                }
            //                if (RanderData[i].ApproverID == AllUser[j].ID) {
            //                    TypeSource_Arrange.ApproverID.push({ name: AllUser[j].Name, value: AllUser[j].ID });
            //                }
            //                if (RanderData[i].ConfirmID == AllUser[j].ID) {
            //                    TypeSource_Arrange.ConfirmID.push({ name: AllUser[j].Name, value: AllUser[j].ID });
            //                }
            //            }
            //            for (var m = 0; m < AllBusinessUnit.length; m++) {
            //                if (RanderData[i].BusinessUnitID == AllBusinessUnit[m].ID) {
            //                    TypeSource_Arrange.BusinessUnitID.push({ name: AllBusinessUnit[m].Name, value: AllBusinessUnit[m].ID });
            //                }
            //            }
            //            //for (var n = 0; n < AllFactory.length; n++) {
            //            //    if (RanderData[i].FactoryID == AllFactory[n].ID) {
            //            //        TypeSource_Arrange.FactoryID.push({ name: AllFactory[n].Name, value: AllFactory[n].ID });
            //            //    }
            //            //}
            //            //for (var a = 0; a < AllWorkShop.length; a++) {
            //            //    if (RanderData[i].WorkShopID == AllWorkShop[a].ID) {
            //            //        TypeSource_Arrange.WorkShopID.push({ name: AllWorkShop[a].Name, value: AllWorkShop[a].ID });
            //            //    }
            //            //}
            //            for (var b = 0; b < AllLine.length; b++) {
            //                if (RanderData[i].LineID == AllLine[b].ID) {
            //                    TypeSource_Arrange.LineID.push({ name: AllLine[b].Name, value: AllLine[b].ID });
            //                }
            //            }

            //            for (var d = 0; d < AllDeviceLedger.length; d++) {
            //                if (RanderData[i].ModelID == AllDeviceLedger[d].ID) {
            //                    TypeSource_Arrange.ModelID.push({ name: AllDeviceLedger[d].ModelNo, value: AllDeviceLedger[d].ID});
            //                }
            //            }
            //        }
            //        $.each(RanderData, function (i, item) {
            //            for (var p in item) {
            //                if (!Formattrt_Arrange[p])
            //                    continue;
            //                item[p] = Formattrt_Arrange[p](item[p]);
            //            }
            //        });
            //        $(".lmvt-apply-body").html($com.util.template(RanderData, HTML.DeviceType));
            //        DataAll2 = list;
            //    });
                
            //},
            //refreshD: function () {

            //    model.com.get({
            //        ModelID: 0, ApplicantID: 0, ApproverID: 0,
            //        ConfirmID: 0, WorkShopID: 0, LineID: 0, OAGetType: 0,
            //        BusinessUnitID: 0, BaseID: 0, FactoryID: 0,
            //    }, function (res) {
            //        if (!res)
            //            return;
            //        var list = res.list;
            //        RanderData = $com.util.Clone(list);
            //        for (var i = 0; i < RanderData.length; i++) {
            //            for (var j = 0; j < AllUser.length; j++) {
            //                if (RanderData[i].ApplicantID == AllUser[j].ID) {
            //                    TypeSource_Arrange.ApplicantID.push({ name: AllUser[j].Name, value: AllUser[j].ID });
            //                }
            //                if (RanderData[i].ApproverID == AllUser[j].ID) {
            //                    TypeSource_Arrange.ApproverID.push({ name: AllUser[j].Name, value: AllUser[j].ID });
            //                }
            //                if (RanderData[i].ConfirmID == AllUser[j].ID) {
            //                    TypeSource_Arrange.ConfirmID.push({ name: AllUser[j].Name, value: AllUser[j].ID });
            //                }
            //            }
            //            for (var m = 0; m < AllBusinessUnit.length; m++) {
            //                if (RanderData[i].BusinessUnitID == AllBusinessUnit[m].ID) {
            //                    TypeSource_Arrange.BusinessUnitID.push({ name: AllBusinessUnit[m].Name, value: AllBusinessUnit[m].ID });
            //                }
            //            }
            //            //for (var n = 0; n < AllFactory.length; n++) {
            //            //    if (RanderData[i].FactoryID == AllFactory[n].ID) {
            //            //        TypeSource_Arrange.FactoryID.push({ name: AllFactory[n].Name, value: AllFactory[n].ID });
            //            //    }
            //            //}
            //            //for (var a = 0; a < AllWorkShop.length; a++) {
            //            //    if (RanderData[i].WorkShopID == AllWorkShop[a].ID) {
            //            //        TypeSource_Arrange.WorkShopID.push({ name: AllWorkShop[a].Name, value: AllWorkShop[a].ID });
            //            //    }
            //            //}
            //            for (var b = 0; b < AllLine.length; b++) {
            //                if (RanderData[i].LineID == AllLine[b].ID) {
            //                    TypeSource_Arrange.LineID.push({ name: AllLine[b].Name, value: AllLine[b].ID });
            //                }
            //            }

            //            for (var d = 0; d < AllDeviceLedger.length; d++) {
            //                if (RanderData[i].ModelID == AllDeviceLedger[d].ID) {
            //                    TypeSource_Arrange.ModelID.push({ name: AllDeviceLedger[d].ModelNo, value: AllDeviceLedger[d].ID});
            //                }
            //            }
            //        }
            //        $.each(RanderData, function (i, item) {
            //            for (var p in item) {
            //                if (!Formattrt_Arrange[p])
            //                    continue;
            //                item[p] = Formattrt_Arrange[p](item[p]);
            //            }
            //        });
            //        $(".lmvt-decide-body").html($com.util.template(RanderData, HTML.DeviceType));
            //        DataAll2 = list;
            //    });
            //},
            //refreshC: function () {

            //    model.com.get({
            //        ModelID: 0, ApplicantID: 0, ApproverID: 0,
            //        ConfirmID: 0, WorkShopID: 0, LineID: 0, OAGetType: 0,
            //        BusinessUnitID: 0, BaseID: 0, FactoryID: 0,
            //    }, function (res) {
            //        if (!res)
            //            return;
            //        var list = res.list;
            //        RanderData = $com.util.Clone(list);
            //        for (var i = 0; i < RanderData.length; i++) {
            //            for (var j = 0; j < AllUser.length; j++) {
            //                if (RanderData[i].ApplicantID == AllUser[j].ID) {
            //                    TypeSource_Arrange.ApplicantID.push({ name: AllUser[j].Name, value: AllUser[j].ID });
            //                }
            //                if (RanderData[i].ApproverID == AllUser[j].ID) {
            //                    TypeSource_Arrange.ApproverID.push({ name: AllUser[j].Name, value: AllUser[j].ID });
            //                }
            //                if (RanderData[i].ConfirmID == AllUser[j].ID) {
            //                    TypeSource_Arrange.ConfirmID.push({ name: AllUser[j].Name, value: AllUser[j].ID });
            //                }
            //            }
            //            for (var m = 0; m < AllBusinessUnit.length; m++) {
            //                if (RanderData[i].BusinessUnitID == AllBusinessUnit[m].ID) {
            //                    TypeSource_Arrange.BusinessUnitID.push({ name: AllBusinessUnit[m].Name, value: AllBusinessUnit[m].ID });
            //                }
            //            }
            //            //for (var n = 0; n < AllFactory.length; n++) {
            //            //    if (RanderData[i].FactoryID == AllFactory[n].ID) {
            //            //        TypeSource_Arrange.FactoryID.push({ name: AllFactory[n].Name, value: AllFactory[n].ID });
            //            //    }
            //            //}
            //            //for (var a = 0; a < AllWorkShop.length; a++) {
            //            //    if (RanderData[i].WorkShopID == AllWorkShop[a].ID) {
            //            //        TypeSource_Arrange.WorkShopID.push({ name: AllWorkShop[a].Name, value: AllWorkShop[a].ID });
            //            //    }
            //            //}
            //            for (var b = 0; b < AllLine.length; b++) {
            //                if (RanderData[i].LineID == AllLine[b].ID) {
            //                    TypeSource_Arrange.LineID.push({ name: AllLine[b].Name, value: AllLine[b].ID });
            //                }
            //            }
            //            for (var d = 0; d < AllDeviceLedger.length; d++) {
            //                if (RanderData[i].ModelID == AllDeviceLedger[d].ID) {
            //                    TypeSource_Arrange.ModelID.push({ name: AllDeviceLedger[d].ModelNo, value: AllDeviceLedger[d].ID });
            //                }
            //            }
            //        }
            //        $.each(RanderData, function (i, item) {
            //            for (var p in item) {
            //                if (!Formattrt_Arrange[p])
            //                    continue;
            //                item[p] = Formattrt_Arrange[p](item[p]);
            //            }
            //        });
            //        $(".lmvt-confirm-body").html($com.util.template(RanderData, HTML.DeviceType));
            //        DataAll2 = list;
            //    });
            //},
            //添加
            addA: function (data, fn, context) {
                    var d = {
                        $URI: "/DeviceLedgerApply/Update",
                        $TYPE: "post"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
               
            },
        
            load: function () {
                model.com.getUser({

                }, function (res) {
                    if (!res)
                        return;
                    var list = res.list;
                    AllUser = res.list;
                    for (var i = 0; i < list.length; i++) {
                            TypeSource_Point1.ApproverID.push({ name: list[i].Name, value: list[i].ID });
                            TypeSource_Point1.ConfirmID.push({ name: list[i].Name, value: list[i].ID });
                        
                    }
                    model.com.getAllDepartment({
                    }, function (res) {
                        if (!res)
                            return;
                        var list = res.list;
                        AllBusinessUnit = res.list;
                        for (var i = 0; i < list.length; i++) {
                            TypeSource_Point1.BusinessUnitID.push({ name: list[i].Name, value: list[i].ID, far: 0 });
                        }
                        //model.com.getFMCFactory({
                        //    OAGetType: 0
                        //}, function (res2) {
                        //    if (!res2)
                        //        return;
                        //    var list = res2.list;
                        //    AllFactory = res2.list;
                        //    for (var i = 0; i < list.length; i++) {
                        //        TypeSource_Point1.FactoryID.push({ name: list[i].Name, value: list[i].ID, far: 0 });
                        //    }
                            model.com.getFMCWorkShop({
                                FactoryID:0,BusinessUnitID:0, OAGetType:0
                            }, function (res3) {
                                if (!res3)
                                    return;
                                var list = res3.list;
                                AllWorkShop = res3.list;
                                for (var i = 0; i < list.length; i++) {
                                    TypeSource_Point1.WorkShopID.push({ name: list[i].Name, value: list[i].ID, far: list[i].BusinessUnitID});
                                }
                                model.com.getFMCLine({
                                    FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0, OAGetType: 0
                                }, function (res4) {
                                    if (!res4)
                                        return;
                                    var list = res4.list;
                                    AllLine = res4.list;
                                    for (var i = 0; i < list.length; i++) {
                                        TypeSource_Point1.LineID.push({ name: list[i].Name, value: list[i].ID, far: list[i].WorkShopID });
                                    }
                                    model.com.getDevice({
                                        DeviceWorkType:0,SupplierID:0,ModelPropertyID:0,
                                        SystemID:0,SystemPropertyID:0,ControllerID:0,
                                        ControllerPropertyID:0,Active:-1,SupplierModelNo:"",
                                        SystemVersion:"",ControllerModel:"",
                                    }, function (res) {
                                        if (!res)
                                            return;
                                        var list = res.list;
                                        AllDeviceLedger = res.list;
                                        for (var i = 0; i < list.length; i++) {
                                            TypeSource_Point1.ModelID.push({ name: list[i].ModelNo, value: list[i].ID });
                                        }
                                        model.com.refresh();
                                    });
                                });
                            });
                    });

                });
            },
       
            getAllDepartment: function (data, fn, context) {
                var d = {
                    $URI: "/Department/AllDepartment",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //"BaseID|所属生产基地|",
            getFMCStation: function (data, fn, context) {
                var d = {
                    $URI: "/User/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //"FactoryID|生产基地下的工厂|",
            getFMCFactory: function (data, fn, context) {
                var d = {
                    $URI: "/FMCFactory/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //"WorkShopID|车间|",
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
            //"LineID|产线|",
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
         
            addProperty: function (data, fn, context) {
                var d = {
                    $URI: "/Device/PropertySave",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            changeStatus: function (data, fn, context) {
                var d = {
                    $URI: "/Device/ChangeStatus",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            render: function (list) {
                var _list = $com.util.Clone(list);
                $.each(_list, function (i, item) {
                    for (var p in item) {
                        if (!FORMATTRT[p])
                            continue;
                        item[p] = FORMATTRT[p](item[p]);
                    }
                });
                $("#femi-ledger-tbody").html($com.util.template(_list, HTML.TableLedgerItemNode));
            },
            renderProerty: function (list) {
                var _list = $com.util.Clone(list);
                $.each(_list, function (i, item) {
                    for (var p in item) {
                        if (!FORMATTRT_PROPERTY[p])
                            continue;
                        item[p] = FORMATTRT_PROPERTY[p](item[p]);
                    }
                });
                $("#femi-ledger-property-tbody").html($com.util.template(_list, HTML.TablePropertyItemNode));
            }
        }
    });

    model.init();


});