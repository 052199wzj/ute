require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($zace, $com) {

    var KEYWORD_Level_LIST,
        KEYWORD_Level,
        FORMATTRT_Level,
        DEFAULT_VALUE_Level,
        TypeSource_Level,

        KEYWORD_Level_LISTPro,
        KEYWORD_LevelPro,
        FORMATTRT_LevelPro,
        DEFAULT_VALUE_LevelPro,
        TypeSource_LevelPro,
		model,
        DataAll,
        DATABasic,
        DataAllConfirmBasic,
        DEFAULT_VALUE_LevelPart,
        DataAllConfirmChange,
        DataAllConfirm,
        DataAllSearch,
        DataAllFactorySearch,
        SearchAll,
        LineList,
        RoleNum,
        mPositionLevel,
        HTML;
    mPositionLevel = 1;
    RoleNum = -1;
    LineList = [];
    DataAll = SearchAll = [];
    DATABasic = [];
    DataAllConfirmBasic = [];
    DataAllConfirmChange = [];
    DataAllConfirm = [];
    DataAllFactorySearch = DataAllSearch = [];
    PositionTemp = {
        Active: true,
        Auditor: window.parent.User_Info.Name,
        AuditorID: 0,
        AuditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Available: true,
        BusinessUnit: "",
        Factory: "",
        CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Creator: window.parent.User_Info.Name,
        CreatorID: 0,
        DeviceID: 0,
        DeviceNo: "",
        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Editor: window.parent.User_Info.Name,
        EditorID: 0,
        ID: 0,
        Line: "",
        LineID: 0,
        PositionID: 0,
        PositionName: "",
        StationID: 0,
        StationName: "",
        Status: 1,
        StatusText: "",
        WorkShop: "",
        WorkShopID: 0,
        PositionLevel: 1,
        PartID: 0,
        PartPointID:0

    };


    ;
    HTML = {
        TableMode: [
				'<tr>',
				'<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
				'<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
				//'<td data-title="BusinessUnit" data-value="{{BusinessUnit}}" >{{BusinessUnit}}</td>',
				//'<td data-title="Factory" data-value="{{Factory}}" >{{Factory}}</td>',
				'<td class="ZaceworkShop" data-title="WorkShop" data-value="{{WorkShop}}" >{{WorkShop}}</td>',
                '<td class="Zaceline" data-title="Line" data-value="{{Line}}" >{{Line}}</td>',
                 '<td class="ZacelinePro" data-title="LineID" data-value="{{LineID}}" >{{LineID}}</td>',
                '<td class="ZacePart" data-title="PartName" data-value="{{PartName}}" >{{PartName}}</td>',
                  '<td class="ZacePartPoint" data-title="PartPointName" data-value="{{PartPointName}}" >{{PartPointName}}</td>',
				'<td  class="ZaceStation"  data-title="StationName" data-value="{{StationName}}" >{{StationName}}</td>',
                '<td class="ZaceDevice" data-title="DeviceID" data-value="{{DeviceID}}" >{{DeviceID}}</td>',
				'<td data-title="PositionID" data-value="{{PositionID}}" >{{PositionID}}</td>',

              
                '<td data-title="Creator" data-value="{{Creator}}" >{{Creator}}</td>',
                 '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
                  '<td data-title="Editor" data-value="{{Editor}}" >{{Editor}}</td>',
                 '<td data-title="EditTime" data-value="{{EditTime}}" >{{EditTime}}</td>',
                '<td data-title="Auditor" data-value="{{Auditor}}" >{{Auditor}}</td>',
                 '<td data-title="AuditTime" data-value="{{AuditTime}}" >{{AuditTime}}</td>',
                 
                  '<td data-title="PositionLevel" data-value="{{PositionLevel}}" >{{PositionLevel}}</td>',
                    '<td data-title="Active" data-value="{{Active}}" >{{Active}}</td>',
                    '<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',
				'</tr>',
        ].join(""),



    }
    $(function () {
        KEYWORD_Level_LIST = [
         "LineID|产线|ArrayOneControl",
         "WorkShopID|车间|ArrayOneControl",
         "PartID|工段|ArrayOneControl|LineID",
         "PartPointID|工序|ArrayOneControl|LineID,PartID",
         "StationID|工位|ArrayOneControl|LineID,PartPointID",
         "PositionID|岗位|ArrayOne",
         "DeviceID|设备|ArrayOne",
         "Status|状态|ArrayOne",
         "Active|激活|ArrayOne",
         "PositionLevel|模式|ArrayOne",
        ];
        KEYWORD_Level = {};
        FORMATTRT_Level = {};


       
        TypeSource_Level = {
            Active: [
              {
                  name: "激活",
                  value: true
              }, {
                  name: "禁用",
                  value: false
              }
            ],
            PositionID: [
             
            ],
            PartID: [
            
            ],
            PartPointID: [
           
            ],
            WorkShopID: [
              
            ],
            DeviceID: [

            ],
            LineID: [
             {
                 name: "无",
                 value: 0
             },
            ],
            StationID: [
             
            ],
            Status: [
               //{
               //    name: "默认值",
               //    value: 0
               //},
           {
               name: "创建",
               value: 1
           }, {
               name: "待审核",
               value: 2
           }, {
               name: "已审核",
               value: 3
           }, {
               name: "撤销审核",
               value: 4
           }, ],
            PositionLevel: [
              //{
              //    name: "全部",
              //    value: 0
              //},
          {
              name: "车间",
              value: 1
          }, {
              name: "产线",
              value: 2
          }, {
              name: "工段",
              value: 3
          }, {
              name: "工序",
              value: 4
          }, {
              name: "工位",
              value: 5
          }, {
              name: "设备",
              value: 6
          }, {
              name: "仓库",
              value: 7
          },
            ],


        };

        $.each(KEYWORD_Level_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD_Level[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_Level[detail[0]] = $com.util.getFormatter(TypeSource_Level, detail[0], detail[2]);
            }
        });
    });

    $(function () {
        KEYWORD_Level_LISTPro = [
         "LineID|仓库|ArrayOne",
         "PositionID|岗位|ArrayOne",
         "Status|状态|ArrayOne",
         "Active|激活|ArrayOne",
         "PositionLevel|模式|ArrayOne",
        ];
        KEYWORD_LevelPro = {};
        FORMATTRT_LevelPro = {};



        TypeSource_LevelPro = {
            Active: [
              {
                  name: "激活",
                  value: true
              }, {
                  name: "禁用",
                  value: false
              }
            ],
            PositionID: [

            ],
            LineID: [
             {
                 name: "全部",
                 value: 0
             },
            ],         
            Status: [
               //{
               //    name: "默认值",
               //    value: 0
               //},
           {
               name: "创建",
               value: 1
           }, {
               name: "待审核",
               value: 2
           }, {
               name: "已审核",
               value: 3
           }, {
               name: "撤销审核",
               value: 4
           }, ],
            PositionLevel: [
              //{
              //    name: "全部",
              //    value: 0
              //},
          {
              name: "车间",
              value: 1
          }, {
              name: "产线",
              value: 2
          }, {
              name: "工段",
              value: 3
          }, {
              name: "工序",
              value: 4
          }, {
              name: "工位",
              value: 5
          }, {
              name: "设备",
              value: 6
          }, {
              name: "仓库",
              value: 7
          },
            ],


        };

        $.each(KEYWORD_Level_LISTPro, function (i, item) {
            var detail = item.split("|");
            KEYWORD_LevelPro[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_LevelPro[detail[0]] = $com.util.getFormatter(TypeSource_LevelPro, detail[0], detail[2]);
            }
        });
    });

    //申请  审批  查询和模糊一样
    model = $com.Model.create({
        name: '岗位',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },
        //modal_select_LineID  modal_select_PartID    modal_select_PartPointID  modal_select_StationID
        events: function () {

            //工位职责查询
            $("body").delegate("#zace-search-level", "input", function () {

                var $this = $(this),
                   value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "ID");



            });
            // 审批 工位职责查询
            $("body").delegate("#zace-searchAudit-level", "input", function () {

                var $this = $(this),
                   value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevelAudit-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevelAudit-tbody"), DataAllSearch, value, "ID");



            });
            //工位职责修改
            $("body").delegate("#zace-edit-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                if (SelectData[0].Status != 1) {
                    alert("数据选择有误,请选择状态为创建的数据!")
                    return;
                }
                if (SelectData[0].PositionLevel == 1) {
                    var default_value = {
                        WorkShopID: SelectData[0].WorkShopID,
                        PositionID: SelectData[0].PositionID,
                       
                    };
                    $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        SelectData[0].WorkShopID = Number(rst.WorkShopID);                      
                        SelectData[0].PositionID = Number(rst.PositionID);

                        model.com.postSCHPosition({
                            data: SelectData[0],
                        }, function (res) {
                            alert("修改成功");
                            model.com.refresh();
                            //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                            //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                        })

                    }, TypeSource_Level));

                } else if (SelectData[0].PositionLevel == 2) {
                    var default_value = {
                       
                        LineID: SelectData[0].LineID,                       
                        PositionID: SelectData[0].PositionID,

                    };
                    $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        SelectData[0].LineID = Number(rst.LineID);                     
                        SelectData[0].PositionID = Number(rst.PositionID);

                        model.com.postSCHPosition({
                            data: SelectData[0],
                        }, function (res) {
                            alert("修改成功");
                            model.com.refresh();
                            //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                            //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                        })

                    }, TypeSource_Level));

                } else if (SelectData[0].PositionLevel == 3) {
                    var default_value = {
                        
                        LineID: SelectData[0].LineID,                      
                        PartID: SelectData[0].PartID,
                        PositionID: SelectData[0].PositionID,

                    };
                    $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        //SelectData[0].WorkShopID = Number(rst.WorkShopID);
                        SelectData[0].LineID = Number(rst.LineID);
                        SelectData[0].PartID = Number(rst.PartID);
                        SelectData[0].PositionID = Number(rst.PositionID);
                        
                        model.com.postSCHPosition({
                            data: SelectData[0],
                        }, function (res) {
                            alert("修改成功");
                            model.com.refresh();
                            //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                            //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                        })

                    }, TypeSource_Level));

                } else if (SelectData[0].PositionLevel == 4) {
                    var default_value = {
                        // WorkShopID: SelectData[0].WorkShopID,
                        LineID: SelectData[0].LineID,
                        PartPointID: SelectData[0].PartPointID,
                        PartID: SelectData[0].PartID,
                        PositionID: SelectData[0].PositionID,
                       
                    };
                    $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        SelectData[0].PartPointID = Number(rst.PartPointID);
                        SelectData[0].LineID = Number(rst.LineID);
                        SelectData[0].PartID = Number(rst.PartID);
                        SelectData[0].PositionID = Number(rst.PositionID);

                        model.com.postSCHPosition({
                            data: SelectData[0],
                        }, function (res) {
                            alert("修改成功");
                            model.com.refresh();
                            //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                            //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                        })

                    }, TypeSource_Level));

                } else if (SelectData[0].PositionLevel == 5) {
                    var default_value = {
                        LineID: SelectData[0].LineID,
                        PartPointID: SelectData[0].PartPointID,
                        PartID: SelectData[0].PartID,
                        StationID: SelectData[0].StationID,
                        PositionID: SelectData[0].PositionID,

                    };
                    $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        SelectData[0].StationID = Number(rst.StationID);
                        SelectData[0].LineID = Number(rst.LineID);
                        SelectData[0].PartID = Number(rst.PartID);
                        SelectData[0].PartPointID = Number(rst.PartPointID);
                        SelectData[0].PositionID = Number(rst.PositionID);

                        model.com.postSCHPosition({
                            data: SelectData[0],
                        }, function (res) {
                            alert("修改成功");
                            model.com.refresh();
                            //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                            //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                        })

                    }, TypeSource_Level));

                } else if (SelectData[0].PositionLevel == 6) {
                    var default_value = {
                        // WorkShopID: SelectData[0].WorkShopID,
                        WorkShopID: SelectData[0].WorkShopID,
                        // StationID: SelectData[0].StationID,
                        DeviceID: SelectData[0].DeviceID,
                        PositionID: SelectData[0].PositionID,
                       
                    };
                    $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        //SelectData[0].WorkShopID = Number(rst.WorkShopID);
                        SelectData[0].WorkShopID = Number(rst.WorkShopID);
                        SelectData[0].DeviceID = Number(rst.DeviceID);
                        SelectData[0].PositionID = Number(rst.PositionID);

                        model.com.postSCHPosition({
                            data: SelectData[0],
                        }, function (res) {
                            alert("修改成功");
                            model.com.refresh();
                            //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                            //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                        })

                    }, TypeSource_Level));

                }
                else if (SelectData[0].PositionLevel == 7) {
                    var default_value = {
                        // WorkShopID: SelectData[0].WorkShopID,                       
                        // StationID: SelectData[0].StationID,
                        LineID: SelectData[0].LineID,
                        PositionID: SelectData[0].PositionID,

                    };
                    $("body").append($com.modal.show(default_value, KEYWORD_LevelPro, "修改", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        //SelectData[0].WorkShopID = Number(rst.WorkShopID);
                       
                        SelectData[0].LineID = Number(rst.LineID);
                        SelectData[0].PositionID = Number(rst.PositionID);

                        model.com.postSCHPosition({
                            data: SelectData[0],
                        }, function (res) {
                            alert("修改成功");
                            model.com.refresh();
                            //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                            //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                        })

                    }, TypeSource_LevelPro));

                }

            });

            //工位职责激活
            $("body").delegate("#zace-active-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                
                model.com.activeAudit({
                    data: SelectData,
                    Active: 1,
                }, function (res) {
                    alert("激活成功");
                    model.com.refresh();


                })




            });
            //工位职责禁用
            $("body").delegate("#zace-disable-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
               
                model.com.activeAudit({
                    data: SelectData,
                    Active: 0,
                }, function (res) {
                    alert("禁用成功");
                    model.com.refresh();


                })

            });

            //工位职责新增
            $("body").delegate("#zace-add-level", "click", function () {
                if (mPositionLevel == 3) {
                    DEFAULT_VALUE_LevelPart = {

                        LineID: 0,
                        PartID: 0,
                        PositionID: 0,
                        //  DeviceID:0,

                    };

                    $("body").append($com.modal.show(DEFAULT_VALUE_LevelPart, KEYWORD_Level, "新增", function (rst) {
                        //调用插入函数 
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        //PositionTemp.WorkShopID = Number(rst.WorkShopID);
                        PositionTemp.LineID = Number(rst.LineID);
                        PositionTemp.PartID = Number(rst.PartID);
                        PositionTemp.PositionID = Number(rst.PositionID);
                        // PositionTemp.DeviceID = Number(rst.DeviceID);
                        PositionTemp.PositionLevel = 3;

                        model.com.postSCHPosition({
                            data: PositionTemp,
                        }, function (res) {
                            alert("新增成功");
                            model.com.refresh();
                        })

                    }, TypeSource_Level));
                } else if (mPositionLevel == 1) {

                    DEFAULT_VALUE_LevelWork = {
                        WorkShopID: 0,                       
                        PositionID: 0,
                        //  DeviceID:0,

                    };

                    $("body").append($com.modal.show(DEFAULT_VALUE_LevelWork, KEYWORD_Level, "新增", function (rst) {
                        //调用插入函数 
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        PositionTemp.WorkShopID = Number(rst.WorkShopID);
                        //PositionTemp.LineID = Number(rst.LineID);
                        //PositionTemp.StationID = Number(rst.StationID);
                        PositionTemp.PositionID = Number(rst.PositionID);
                        PositionTemp.PositionLevel = 1;

                        model.com.postSCHPosition({
                            data: PositionTemp,
                        }, function (res) {
                            alert("新增成功");
                            model.com.refresh();
                        })

                    }, TypeSource_Level));
                } else if (mPositionLevel == 2) {

                    DEFAULT_VALUE_LevelLine = {

                        LineID: 0,                      
                        PositionID: 0,
                        //  DeviceID:0,

                    };

                    $("body").append($com.modal.show(DEFAULT_VALUE_LevelLine, KEYWORD_Level, "新增", function (rst) {
                        //调用插入函数 
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        //PositionTemp.WorkShopID = Number(rst.WorkShopID);
                        PositionTemp.LineID = Number(rst.LineID);
                        //PositionTemp.StationID = Number(rst.StationID);
                        PositionTemp.PositionID = Number(rst.PositionID);
                        PositionTemp.PositionLevel = 2;

                        model.com.postSCHPosition({
                            data: PositionTemp,
                        }, function (res) {
                            alert("新增成功");
                            model.com.refresh();
                        })

                    }, TypeSource_Level));
                } else if (mPositionLevel == 4) {
                    
                    DEFAULT_VALUE_LevelPoint = {

                        LineID: 0,
                        PartID: 0,
                        PartPointID:0,
                        PositionID: 0,
                        //  DeviceID:0,

                    };

                    $("body").append($com.modal.show(DEFAULT_VALUE_LevelPoint, KEYWORD_Level, "新增", function (rst) {
                        //调用插入函数 
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        //PositionTemp.WorkShopID = Number(rst.WorkShopID);
                        PositionTemp.LineID = Number(rst.LineID);
                        PositionTemp.PartID = Number(rst.PartID);
                        PositionTemp.PartPointID = Number(rst.PartPointID);
                        PositionTemp.PositionID = Number(rst.PositionID);
                        PositionTemp.PositionLevel = 4;

                        model.com.postSCHPosition({
                            data: PositionTemp,
                        }, function (res) {
                            alert("新增成功");
                            model.com.refresh();
                        })

                    }, TypeSource_Level));
                } else if (mPositionLevel == 5) {
                    DEFAULT_VALUE_LevelSta = {

                        LineID: 0,
                        PartID: 0,
                        PartPointID: 0,
                        StationID:0,
                        PositionID: 0,
                        //  DeviceID:0,

                    };

                    $("body").append($com.modal.show(DEFAULT_VALUE_LevelSta, KEYWORD_Level, "新增", function (rst) {
                        //调用插入函数 
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        //PositionTemp.WorkShopID = Number(rst.WorkShopID);
                        PositionTemp.LineID = Number(rst.LineID);
                        PositionTemp.PartID = Number(rst.PartID);
                        PositionTemp.PartPointID = Number(rst.PartPointID);
                        PositionTemp.StationID = Number(rst.StationID);
                        PositionTemp.PositionID = Number(rst.PositionID);
                        PositionTemp.PositionLevel = 5;

                        model.com.postSCHPosition({
                            data: PositionTemp,
                        }, function (res) {
                            alert("新增成功");
                            model.com.refresh();
                        })

                    }, TypeSource_Level));
                } else if (mPositionLevel == 6) {

                    DEFAULT_VALUE_LevelDe = {

                        WorkShopID: 0,
                        DeviceID: 0,                       
                        PositionID: 0,
                        //  DeviceID:0,

                    };

                    $("body").append($com.modal.show(DEFAULT_VALUE_LevelDe, KEYWORD_Level, "新增", function (rst) {
                        //调用插入函数 
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        PositionTemp.WorkShopID = Number(rst.WorkShopID);
                        PositionTemp.PositionID = Number(rst.PositionID);
                        PositionTemp.DeviceID = Number(rst.DeviceID);
                        PositionTemp.PositionLevel = 6;

                        model.com.postSCHPosition({
                            data: PositionTemp,
                        }, function (res) {
                            alert("新增成功");
                            model.com.refresh();
                        })

                    }, TypeSource_Level));
                }
                else if (mPositionLevel == 7) {

                    DEFAULT_VALUE_LevelStock = {

                        LineID: 0,
                        PositionID: 0,
                        //  DeviceID:0,

                    };

                    $("body").append($com.modal.show(DEFAULT_VALUE_LevelStock, KEYWORD_LevelPro, "新增", function (rst) {
                        //调用插入函数 
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        PositionTemp.LineID = Number(rst.LineID);
                        PositionTemp.PositionID = Number(rst.PositionID);                      
                        PositionTemp.PositionLevel = 7;

                        model.com.postSCHPosition({
                            data: PositionTemp,
                        }, function (res) {
                            alert("新增成功");
                            model.com.refresh();
                        })

                    }, TypeSource_LevelPro));
                }


            });
            

            //工位职责提交
            $("body").delegate("#zace-up-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

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

                $com.app.loading();

                var WhileAdd = function () {
                    SelectData[a].Status = 2;
                    model.com.postSCHPosition({
                        data: SelectData[a],
                    }, function (res) {
                        a++;

                        if (a == SelectData.length) {
                            $com.app.loaded();

                            alert("提交成功");
                            model.com.refresh();
                        } else {
                            WhileAdd();
                        }
                    });

                }
                if (SelectData.length <= 0) {
                    alert("数据为空！！！");
                } else {
                    WhileAdd();
                }
            });
            //工位职责撤销
            $("body").delegate("#zace-return-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

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
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其撤销？")) {
                    return;
                }
                //for (var i = 0; i < SelectData.length; i++) {

                //    //var wid = SelectData[i].WID;
                //    SelectData[i].Status = 1;

                //    model.com.postSCHPosition({
                //        data: SelectData[i],
                //    }, function (res) {
                //        model.com.refresh();
                //    })
                //}
                var a = 0;

                $com.app.loading();

                var WhileAdd = function () {
                    SelectData[a].Status = 1;
                    model.com.postSCHPosition({
                        data: SelectData[a],
                    }, function (res) {
                        a++;

                        if (a == SelectData.length) {
                            $com.app.loaded();

                            alert("撤销成功");
                            model.com.refresh();
                        } else {
                            WhileAdd();
                        }
                    });

                }
                if (SelectData.length <= 0) {
                    alert("数据为空！！！");
                } else {
                    WhileAdd();
                }


            });
            //===========
            //我的审核
            $("body").delegate("#zace-myAudit-level", "click", function () {
                // if (RoleNum != -1) {

                $(".zzza").hide();
                $(".zzzb").show();
                $(".zzzc").hide();

                //} else {
                //    alert("无权限");
                //}


            });
            //我的申请
            $("body").delegate("#zace-myApproval-level", "click", function () {
                $(".zzza").show();
                $(".zzzb").hide();
                $(".zzzc").hide();

            });

            //申请 岗位人员查询
            $("body").delegate("#zace-search-returnAudit", "input", function () {

                var $this = $(this),
                   value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevelAudit-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "ID");
            });

            //
            //条件查询
            $("body").delegate("#zace-searchZall-level", "click", function () { 
                var default_value = {
                    // WorkShopID: 0,
                    PositionLevel: 0,
                    // StationID: 0,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                   
                    default_value.PositionLevel = Number(rst.PositionLevel);
                    mPositionLevel = default_value.PositionLevel;
                    $(".ZaceworkShop").show();
                    $(".Zaceline").show();
                    $(".ZacelinePro").show();
                    $(".ZacePart").show();
                    $(".ZacePartPoint").show();
                    $(".ZaceStation").show();
                    $(".ZaceDevice").show();
                    if (mPositionLevel==1) {
                        $(".Zaceline").hide();
                        $(".ZacelinePro").hide();
                        $(".ZacePart").hide();
                        $(".ZacePartPoint").hide();
                        $(".ZaceStation").hide();
                        $(".ZaceDevice").hide();
                        $(".zace-header-title").html("车间岗位模型");
                        model.com.refresh();

                    } else if (mPositionLevel == 2) {
                        $(".ZaceworkShop").hide();
                        $(".ZacelinePro").hide();
                        $(".ZacePart").hide();
                        $(".ZacePartPoint").hide();
                        $(".ZaceStation").hide();
                        $(".ZaceDevice").hide();
                        $(".zace-header-title").html("产线岗位模型");
                        model.com.refresh();


                    } else if (mPositionLevel == 3) {
                        $(".ZaceworkShop").hide();
                        $(".ZacelinePro").hide();
                        $(".ZacePartPoint").hide();
                        $(".ZaceStation").hide();
                        $(".ZaceDevice").hide();
                        $(".zace-header-title").html("工段岗位模型");
                        model.com.refresh();


                    } else if (mPositionLevel == 4) {
                        $(".ZaceworkShop").hide();
                        $(".ZacelinePro").hide();
                        $(".ZaceStation").hide();
                        $(".ZaceDevice").hide();
                        $(".zace-header-title").html("工序岗位模型");
                        model.com.refresh();


                    } else if (mPositionLevel == 5) {
                        $(".ZaceworkShop").hide();
                        $(".ZacelinePro").hide();
                        $(".ZaceDevice").hide();
                        $(".zace-header-title").html("工位岗位模型");
                        model.com.refresh();
                       

                    } else if (mPositionLevel == 6) {
                        $(".Zaceline").hide();
                        $(".ZacelinePro").hide();
                        $(".ZacePart").hide();
                        $(".ZacePartPoint").hide();
                        $(".ZaceStation").hide();
                        $(".zace-header-title").html("设备岗位模型");
                        model.com.refresh();

                    }
                    else if (mPositionLevel == 7) {
                        $(".Zaceline").hide();                       
                        $(".ZacePart").hide();
                        $(".ZacePartPoint").hide();
                        $(".ZaceStation").hide();
                        $(".ZaceDevice").hide();
                        $(".ZaceworkShop").hide();
                        $(".zace-header-title").html("仓库岗位模型");
                        model.com.refresh();

                    }
                    //$com.table.filterByConndition($("#femi-riskLevel-tbody"), DataAll, default_value, "ID");

                }, TypeSource_Level));


            });

            //=================所有列表
            $("body").delegate("#zace-allList-level", "click", function () {
                $(".zzza").hide();
                $(".zzzb").hide();
                $(".zzzc").show();

            });
            //模糊查询
            $("body").delegate("#zace-search-returnAllList", "input", function () {

                var $this = $(this),
                   value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevelApproval-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevelApproval-tbody"), SearchAll, value, "ID");



            });
            //条件查询
            $("body").delegate("#zace-returnAllList-level", "click", function () {
                var default_value = {
                    //WorkShopID: 0,
                    LineID: 0,
                    //StationID: 0,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    //default_value.WorkShopID = Number(rst.WorkShopID);
                    default_value.LineID = Number(rst.LineID);
                    // default_value.StationID = Number(rst.StationID);
                    $com.table.filterByConndition($("#femi-riskLevelApproval-tbody"), DATABasic, default_value, "ID");

                }, TypeSource_Level));


            });


            //==============我的审核
            //工位职责审核
            $("body").delegate("#zace-audit-returnAudit", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevelAudit-tbody"), "ID", DataAllConfirmChange);

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

                $com.app.loading();

                var WhileAdd = function () {
                    SelectData[a].Status = 3;
                    model.com.postAudit({
                        data: SelectData[a],
                    }, function (res) {
                        a++;

                        if (a == SelectData.length) {
                            $com.app.loaded();

                            alert("审核成功");
                            model.com.refresh();
                        } else {
                            WhileAdd();
                        }
                    });

                }
                if (SelectData.length <= 0) {
                    alert("数据为空！！！");
                } else {
                    WhileAdd();
                }
            });
            //工位职责反审核
            $("body").delegate("#zace-fan-returnAudit", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevelAudit-tbody"), "ID", DataAllConfirmChange);

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

                //for (var i = 0; i < SelectData.length; i++) {

                //    //var wid = SelectData[i].WID;
                //    SelectData[i].Status = 1;

                //    model.com.postAudit({
                //        data: SelectData[i],
                //    }, function (res) {
                //        alert("反审核成功");
                //        model.com.refresh();
                //    })
                //}
                var a = 0;

                $com.app.loading();

                var WhileAdd = function () {
                    SelectData[a].Status = 1;
                    model.com.postAudit({
                        data: SelectData[a],
                    }, function (res) {
                        a++;

                        if (a == SelectData.length) {
                            $com.app.loaded();

                            alert("反审核成功");
                            model.com.refresh();
                        } else {
                            WhileAdd();
                        }
                    });

                }
                if (SelectData.length <= 0) {
                    alert("数据为空！！！");
                } else {
                    WhileAdd();
                }

            });

            //计量设置导出(价格)
            $("body").delegate("#zace-export-MeteringSetting", "click", function () {
                var $table = $(".zztable-part"),
                     fileName = "工位岗位模型.xls",
                     Title = "工位岗位模型";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });

            });
        },




        run: function () {

            var wDevice = window.parent._Device;

            model.com.getRoleFounction({ FunctionID: 100305 }, function (resR) {
                if (!resR)
                    return;
                if (resR && resR.info) {
                    RoleNum = resR.info;

                }
                model.com.getFMCLine({ FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0 }, function (resW) {
                    if (resW && resW.list) {
                        LineList = resW.list;
                        $.each(resW.list, function (i, item) {
                            TypeSource_Level.LineID.push({
                                name: item.Name,
                                value: item.ID,
                                far: 0
                            });
                        });

                    }
                    model.com.getFMCWorkShop({ FactoryID: 0, BusinessUnitID: 0 }, function (resW) {
                        if (resW && resW.list) {
                            $.each(resW.list, function (i, item) {
                                TypeSource_Level.WorkShopID.push({
                                    name: item.Name,
                                    value: item.ID,
                                    far: 0
                                });
                            });

                        }
                        //model.com.getFMCStation({ LineID: 0 }, function (resP) {
                        //    if (resP && resP.list) {
                        //        $.each(resP.list, function (i, item) {
                        //            TypeSource_Level.StationID.push({
                        //                name: item.Name,
                        //                value: item.ID,
                        //                far: item.WorkShopID
                        //            });
                        //        });

                        //    }


                            model.com.getPosition({ OAGetType: 0 }, function (resP) {

                                if (resP && resP.list) {
                                    $.each(resP.list, function (i, item) {
                                        TypeSource_Level.PositionID.push({
                                            name: item.Name,
                                            value: item.ID,
                                        });
                                    });
                                    TypeSource_LevelPro.PositionID = TypeSource_Level.PositionID;
                                }
                                model.com.getFMCLineUnit({ LineID: 0, ID: 0 }, function (resP) {

                                    if (resP && resP.list) {                                      
                                        $.each(resP.list, function (i, item) {
                                            if (item.LevelID==2) {
                                                TypeSource_Level.PartID.push({
                                                    name: item.Name,
                                                    value: item.UnitID,
                                                    far: item.LineID
                                                });
                                            } else if (item.LevelID == 3) {
                                                TypeSource_Level.PartPointID.push({
                                                    name: item.Name,
                                                    value: item.UnitID,
                                                    far: item.LineID+"_"+item.ParentUnitID
                                                });
                                            } else if (item.LevelID == 4) {
                                                TypeSource_Level.StationID.push({
                                                    name: item.Name,
                                                    value: item.UnitID,
                                                    far: item.LineID+"_"+item.ParentUnitID
                                                });
                                            }
                                            
                                        });

                                    }

                                    //model.com.getFPCDeviceLedger({
                                    //    ModelID:-1,WorkShopID:0,LineID:0,BusinessUnitID:0,Status:-1
                                    //}, function (resR2) {
                                        //if (resR2 && resR2.list) {
                                    $.each(wDevice, function (i, item) {
                                                TypeSource_Level.DeviceID.push({
                                                    name: item.DeviceNo,
                                                    value: item.ID,
                                                });
                                            });
                                    //}
                                    //model.com.getWMSStockAll({}, function (res) {


                                    //    if (res && res.list) {
                                    //        $.each(res.list, function (i, item) {
                                    //            TypeSource_LevelPro.LineID.push({
                                    //                name: item.StockName,
                                    //                value: item.ID,
                                    //            });
                                    //        });
                                          
                                    //    }

                                        model.com.setMMM();
                                        model.com.refresh();
                                    //}); 
                                    //});

                                });

                            });


                        //});

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
                                //TypeSource_Level.AuditorID.splice(1, TypeSource_Level.AuditorID.length - 1);
                                TypeSource_Level.WorkShopID = [];
                                $.each(resW.list, function (i, item) {
                                    TypeSource_Level.WorkShopID.push({
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
                                //TypeSource_Level.AuditorID.splice(1, TypeSource_Level.AuditorID.length - 1);
                                TypeSource_Level.LineID = [];
                                LineList = resW.list;
                                $.each(resW.list, function (i, item) {
                                    TypeSource_Level.LineID.push({
                                        name: item.Name,
                                        value: item.ID,
                                        far: 0
                                    });
                                });
                            }
                            window.parent._zaceLineSet = 0;
                        });

                    }

                    if (window.parent._zacePositionUser && window.parent._zacePositionUser == 1) {
                        model.com.getPosition({ OAGetType: 0 }, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {
                                //TypeSource_Level.AuditorID.splice(1, TypeSource_Level.AuditorID.length - 1);
                                TypeSource_Level.PositionID = [];
                                $.each(resW.list, function (i, item) {
                                    TypeSource_Level.PositionID.push({
                                        name: item.Name,
                                        value: item.ID,
                                    });
                                });
                            }
                            window.parent._zacePositionUser = 0;
                        });

                    }

                    if (window.parent._zaceLineUnitSet && window.parent._zaceLineUnitSet == 1) {
                        model.com.getFMCLineUnit({ LineID: 0, ID: 0 }, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {
                                TypeSource_Level.PartID = [];
                                TypeSource_Level.PartPointID = [];
                                TypeSource_Level.StationID = [];
                                //TypeSource_Level.AuditorID.splice(1, TypeSource_Level.AuditorID.length - 1);
                                $.each(resW.list, function (i, item) {
                                    if (item.LevelID == 2) {
                                        TypeSource_Level.PartID.push({
                                            name: item.Name,
                                            value: item.UnitID,
                                            far: item.LineID
                                        });
                                    } else if (item.LevelID == 3) {
                                        TypeSource_Level.PartPointID.push({
                                            name: item.Name,
                                            value: item.UnitID,
                                            far: item.LineID + "_" + item.ParentUnitID
                                        });
                                    } else if (item.LevelID == 4) {
                                        TypeSource_Level.StationID.push({
                                            name: item.Name,
                                            value: item.UnitID,
                                            far: item.LineID + "_" + item.ParentUnitID
                                        });
                                    }

                                });
                            }
                            window.parent._zaceLineUnitSet = 0;
                        });

                    }
                    model.com.setMMM();
                }, 500);

            },
            refresh: function () {

                model.com.getSCHPosition({ WorkShopID: 0, LineID: 0, ShiftID: 0, PositionLevel: mPositionLevel, OAGetType: 0 }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var Grade = $com.util.Clone(resP.list);
                        //所有数据
                        DATABasic = $com.util.Clone(resP.list);
                        var _list = $com.util.Clone(resP.list);
                        if (mPositionLevel==7) {
                            $.each(_list, function (i, item) {
                                for (var p in item) {
                                    if (!FORMATTRT_LevelPro[p])
                                        continue;
                                    item[p] = FORMATTRT_LevelPro[p](item[p]);
                                }
                            });
                        } else {

                            $.each(_list, function (i, item) {
                                for (var p in item) {
                                    if (!FORMATTRT_Level[p])
                                        continue;
                                    item[p] = FORMATTRT_Level[p](item[p]);
                                }
                            });

                        }
                        
                        SearchAll = $com.util.Clone(_list);
                        $("#femi-riskLevelApproval-tbody").html($com.util.template(_list, HTML.TableMode));
                        model.com.deleteModel(mPositionLevel);

                    }

                });
                model.com.getSCHPosition({WorkShopID:0,LineID:0, ShiftID:0,PositionLevel:mPositionLevel,OAGetType:0}, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {

                        //申请数据
                        DataAllConfirm = $com.util.Clone(resP.list);
                        var _listApproval = $com.util.Clone(resP.list);

                        DataAll = $com.util.Clone(_listApproval);
                        if (mPositionLevel == 7) {
                            $.each(_listApproval, function (i, item) {
                                for (var p in item) {
                                    if (!FORMATTRT_LevelPro[p])
                                        continue;
                                    item[p] = FORMATTRT_LevelPro[p](item[p]);
                                }
                            });
                        } else {

                            $.each(_listApproval, function (i, item) {
                                for (var p in item) {
                                    if (!FORMATTRT_Level[p])
                                        continue;
                                    item[p] = FORMATTRT_Level[p](item[p]);
                                }
                            });

                        }
                        DataAllFactorySearch = $com.util.Clone(_listApproval);
                        $("#femi-riskLevel-tbody").html($com.util.template(_listApproval, HTML.TableMode));
                        model.com.deleteModel(mPositionLevel);
                    }

                });
                model.com.getSCHPosition({ WorkShopID: 0, LineID: 0, ShiftID: 0, PositionLevel: mPositionLevel, FillShift: false, OAGetType: 0 }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {

                        DataAllConfirmChange = $com.util.Clone(resP.list);;

                        DataAllConfirmBasic = $com.util.Clone(DataAllConfirmChange);

                        var _listC = $com.util.Clone(DataAllConfirmChange);
                        if (mPositionLevel == 7) {
                            $.each(_listC, function (i, item) {
                                for (var p in item) {
                                    if (!FORMATTRT_LevelPro[p])
                                        continue;
                                    item[p] = FORMATTRT_LevelPro[p](item[p]);
                                }
                            });
                        } else {

                            $.each(_listC, function (i, item) {
                                for (var p in item) {
                                    if (!FORMATTRT_Level[p])
                                        continue;
                                    item[p] = FORMATTRT_Level[p](item[p]);
                                }
                            });

                        }
                        DataAllSearch = $com.util.Clone(_listC);
                        $("#femi-riskLevelAudit-tbody").html($com.util.template(_listC, HTML.TableMode));
                        model.com.deleteModel(mPositionLevel);

                    }

                });
            },
            getWMSStockAll: function (data, fn, context) {
                var d = {
                    $URI: "/WMSStock/All",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询工序
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
            //设备ID
            getFPCDeviceLedger: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceLedger/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
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
            //查询产线单元
            getFMCLineUnit: function (data, fn, context) {
                var d = {
                    $URI: "/FMCLineUnit/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询设备
            getDeviceModel: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceModel/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
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
            //查询工位列表
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
            //查询岗位职能列表
            getPosition: function (data, fn, context) {
                var d = {
                    $URI: "/BPMPosition/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询权限
            getRoleFounction: function (data, fn, context) {
                var d = {
                    $URI: "/Role/UserRoleByFunctionID",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //查询区域
            getArea: function (data, fn, context) {
                var d = {
                    $URI: "/Area/Tree",
                    $TYPE: "get"
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
            //查询工位职责列表
            getSCHPosition: function (data, fn, context) {
                var d = {
                    $URI: "/SCHPosition/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //保存工位职责列表
            postSCHPosition: function (data, fn, context) {
                var d = {
                    $URI: "/SCHPosition/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //审核
            postAudit: function (data, fn, context) {
                var d = {
                    $URI: "/SCHPosition/Audit",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //激活
            activeAudit: function (data, fn, context) {
                var d = {
                    $URI: "/SCHPosition/Active",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
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


            //删除得到新的数据
            getNewList: function (_source, set_data) {
                if (!_source)
                    _source = [];
                if (!set_data)
                    set_data = [];
                var rst = [];
                for (var i = 0; i < _source.length; i++) {
                    var NotOWn = false;
                    for (var j = 0; j < set_data.length; j++) {
                        if (_source[i].RiskID == set_data[j].RiskID) {
                            _source.splice(i, 1);
                            set_data.splice(j, 1);
                            NotOWn = true;
                        }
                        if (set_data.length < 1) {
                            break;
                        }
                        if (NotOWn) {
                            model.com.getNewList(_source, set_data);
                        }
                    }

                }
                rst = _source;
                return rst;
            },
            //得到ID
            GetMaxID: function (_source) {
                var id = 0;
                if (!_source)
                    _source = [];
                $.each(_source, function (i, item) {
                    if (item.ID > id)
                        id = item.ID;
                });
                return id + 1;

            },
            deleteModel: function (mPositionLevel) {
                if (mPositionLevel == 1) {
                    $(".Zaceline").hide();
                    $(".ZacePart").hide();
                    $(".ZacePartPoint").hide();
                    $(".ZaceStation").hide();
                    $(".ZaceDevice").hide();
                    $(".ZacelinePro").hide();

                } else if (mPositionLevel == 2) {
                    $(".ZaceworkShop").hide();
                    $(".ZacePart").hide();
                    $(".ZacePartPoint").hide();
                    $(".ZaceStation").hide();
                    $(".ZaceDevice").hide();
                    $(".ZacelinePro").hide();


                } else if (mPositionLevel == 3) {
                    $(".ZaceworkShop").hide();
                    $(".ZacePartPoint").hide();
                    $(".ZaceStation").hide();
                    $(".ZaceDevice").hide();
                    $(".ZacelinePro").hide();


                } else if (mPositionLevel == 4) {
                    $(".ZaceworkShop").hide();
                    $(".ZaceStation").hide();
                    $(".ZaceDevice").hide();
                    $(".ZacelinePro").hide();


                } else if (mPositionLevel == 5) {
                    $(".ZaceworkShop").hide();
                    $(".ZaceDevice").hide();
                    $(".ZacelinePro").hide();


                } else if (mPositionLevel == 6) {
                    $(".Zaceline").hide();
                    $(".ZacePart").hide();
                    $(".ZacePartPoint").hide();
                    $(".ZaceStation").hide();
                    $(".ZacelinePro").hide();

                }
                else if (mPositionLevel == 7) {
                    $(".Zaceline").hide();
                    $(".ZacePart").hide();
                    $(".ZacePartPoint").hide();
                    $(".ZaceStation").hide();
                    $(".ZaceDevice").hide();
                    $(".ZaceworkShop").hide();


                }
            },
        }
    }),

    model.init();


});