require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {
    var KEYWORD_Device_LIST_item,
        KEYWORD_Device_item,
        FORMATTRT_Device_item,
        DEFAULT_VALUE_Device_item,
        TypeSource_Device_item,
        ItemShow,
        wDepartment,
        mData,
        mRepairItem,
        KEYWORD_LIST,
        KEYWORD_All,
        KEYWORD,
        wUser = [],
        list,
        wIsDelivery = 0,
        HTML;
    StepStatus = ["默认", "待工区调度", "待分配班组", "驳回返修项", "待班组长分配", "待班组成员处理", "已发起不合格评审", "待班组长确认", "待检验员确认", "已确认", "班组成员已开工"];
    HTML = {
        TableNode_repairTask: [
            '<tr data-ID="">',
            '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{WID}}</td>',
            // '<td style="min-width: 50px" data-title="Code" data-value="{{Code}}">{{Code}}</td>',
            '<td style="min-width: 50px" data-title="PartNo" data-value="{{PartNo}}">{{PartNo}}</td>',

            '<td style="min-width: 50px" data-title="CustomerName" data-value="{{CustomerName}}">{{CustomerName}}</td>',
            '<td style="min-width: 50px" data-title="LineName" data-value="{{LineName}}">{{LineName}}</td>',
            '<td style="min-width: 50px" data-title="StationName" data-value="{{StationName}}">{{StationName}}</td>',
            '<td style="min-width: 50px" data-title="UpFlowName" data-value="{{UpFlowName}}">{{UpFlowName}}</td>',
            '<td style="min-width: 50px" data-title="UpFlowTime" data-value="{{UpFlowTime}}">{{UpFlowTime}}</td>',
            '<td style="min-width: 50px" data-title="IsDeliveryName" data-value="{{IsDeliveryName}}">{{IsDeliveryName}}</td>',
            '</tr>',
        ].join(""),
        TableNode_item: [
            '<tr data-ID="">',
            '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{WID}}</td>',
            // '<td style="min-width: 50px" data-title="Code" data-value="{{Code}}">{{Code}}</td>',
            '<td style="min-width: 50px" data-title="PartNo" data-value="{{PartNo}}">{{PartNo}}</td>',
            // '<td style="min-width: 50px" data-title="CarTypeName" data-value="{{CarTypeName}}">{{CarTypeName}}</td>',
            // '<td style="min-width: 50px" data-title="CarNumber" data-value="{{CarNumber}}">{{CarNumber}}</td>',
            '<td style="min-width: 50px" data-title="CustomerName" data-value="{{CustomerName}}">{{CustomerName}}</td>',
            '<td style="min-width: 50px" data-title="LineName" data-value="{{LineName}}">{{LineName}}</td>',
            '<td style="min-width: 50px" data-title="StationName" data-value="{{StationName}}">{{StationName}}</td>',
            '<td style="min-width: 50px" data-title="Content" data-value="{{Content}}">{{Content}}</td>',
            '<td style="min-width: 50px" data-title="UpFlowName" data-value="{{UpFlowName}}">{{UpFlowName}}</td>',
            '<td style="min-width: 50px" data-title="CreateTime" data-value="{{CreateTime}}">{{CreateTime}}</td>',
            '<td style="min-width: 50px" data-title="IsDeliveryName" data-value="{{IsDeliveryName}}">{{IsDeliveryName}}</td>',
            '<td style="min-width: 50px" data-title="SubmitTime" data-value="{{SubmitTime}}">{{SubmitTime}}</td>',
            '<td style="min-width: 50px" data-title="StatusText" data-value="{{StatusText}}">{{StatusText}}</td>',
            '</tr>',
        ].join(""),
        LIST: ['<li>',
            '<label class="m-detail-title">{{name}}</label>',
            '<div class="m-detail-content" style=" margin-left: 3%; width: 65%;display: inline-block;">{{value}}</div>',
            '</li>'].join(""),
        IMGSrc: '<img style="width: 60px;height: 60px;" src="{{Src}}">',
        module_Process: [
            '<ul class="list-group">',
            '<li class="list-li upload-img" data-id="{{ID}}">',
            '<div class="list-group-item" style="background-color: #f5f5f5;">',
            '<div class="list-group-item-cell item-static item-title " style="width:90%;font-size: 16px;">',
            '<div class="ds-bpm-btn-group">',
            '<div class="ds-bpm-btn" style="color: #4c4c4c;width: 38%;">{{Name}}</div>',
            '<div class="ds-bpm-btn" style="color: #25acde;width: 25%;text-align: center;">{{Assignee}}</div>',
            '<div class="ds-bpm-btn" style="color: #4c4c4c;width: 18%;">{{EndTime}}</div>',
            '<div class="ds-bpm-btn" style="color: {{ReasonColor}};width: 18%;">{{deleteReason}}</div>',
            '</div>',
            '</div>',
            '<div class="list-group-item-cell item-icon" style="width:10%">',
            '<i class="icon icon-arrow-right"></i>',
            '</div>',
            '</div>',
            '<div class="list-group" style="display: none;">',
            '{{History_ITEM}}',
            '</div></div>',
            '</li>',
            '</ul>',
        ].join(""),

        HistoryDemo: [
            '<div class="multil-btn" style="display:{{Display}}">',
            '<div class="multi-flex" style="clear: both;height: 4vh;">',
            '<div class="multi-flex m-detail-titlel" ',
            'style="width: 30%;float: left; text-align: right;">',
            '<label>{{Name}}</label>',
            '</div>',
            '<div class="multi-flex m-detail-titler upload-img" style="width: 70%;float: left;font-size: 14px;padding-top: 3px;">',
            '{{VariableValue}}',
            // '<span><input type="text" value="{{VariableValue}} /><a href=""><img src={{ImgSrc}} /></a></span>',
            '</div>',
            '</div>',
            '</div>',
        ].join(""),
    }
    //查询字段定义
    Defaul_Value_Search = {
        // 'StartTime': $com.util.format("yyyy-MM-dd", new Date()),
        // 'EndTime': $com.util.format("yyyy-MM-dd", new Date()),
        // 'IsDelivery':0,
    };

    $(function () {

        KEYWORD_Device_LIST_item = [
            "Code|单据编号",
            "CarTypeID|车型|ArrayOneControl",
            "CarNumber|车号|ArrayOneControl|CarTypeID",
            "CustomerName|配属局段",
            "UpFlowName|申请人",
            "CreateTime|申请时间|DateTime",
            "StationID|工位|ArrayOne",
            "LineID|修程|ArrayOne",
            "CustomerID|配属局段|ArrayOne",
            "UpFlowID|申请人|ArrayOne",
            "IsDelivery|返修类型|ArrayOne",
            "StatusText|状态",
            "SubmitTime|任务更新时间|DateTime",
            "StartTime|开始时间|Date",
            "EndTime|结束时间|Date",
            "UpFlowTime|创建时间|DateTime",
        ];
        KEYWORD_Device_item = {};
        FORMATTRT_Device_item = {};
        DEFAULT_VALUE_Device_item = {};
        TypeSource_Device_item = {
            UpFlowID: [
                {
                    'name': "无",
                    'value': 0
                },
            ],
            StationID: [
                {
                    'name': "无",
                    'value': 0
                },
            ],
            CustomerID: [
                {
                    'name': "无",
                    'value': 0
                },
            ],
            LineID: [
                {
                    'name': "无",
                    'value': 0
                },
            ],
            CarTypeID: [
                {
                    'name': "无",
                    'value': 0
                },
            ],
            CarNumber: [
                {
                    'name': "无",
                    'value': 0
                },
            ],

            IsDelivery: [{
                'name': "默认",
                'value': 0
            },
            {
                'name': "试运前返修",
                'value': 1
            },
            {
                'name': "过程检返修",
                'value': 2
            },
            {
                'name': "供应商返修",
                'value': 3
            },
            {
                'name': "试运后返修",
                'value': 4
            },
            {
                'name': "验收返修",
                'value': 5
            },
            {
                'name': "过程中",
                'value': 6
            }
            ],
            Status: [{
                'name': "无",
                'value': 0
            },
            {
                'name': "待上传照片",
                'value': 1
            },
            {
                'name': "待确认",
                'value': 2
            }
                ,
            {
                'name': "已确认",
                'value': 3
            }
            ],
        };


        $.each(KEYWORD_Device_LIST_item, function (i, item) {
            var detail = item.split("|");
            KEYWORD_Device_item[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_Device_item[detail[0]] = $com.util.getFormatter(TypeSource_Device_item, detail[0], detail[2]);
            }
        });
    });
    $(function () {
        var KEYWORD_LIST = [
            "Code|编号",
            "CustomerName|配属局段",
            "LineName|修程",
            "StationName|工位",
            "CarTypeName|车型",
            // "CarNumber|车号",
            // "CheckName|验收室检验员",
            "IsDeliveryName|返修类型",
            "UpFlowName|申请人",
            "CreateTime|申请时刻",
            "SubmitTime|任务更新时刻",
        ];
        var KEYWORD_All = [];
        KEYWORD = {};
        KEYWORD_LIST.forEach(function (item, i) {
            var detail = item.split("|");
            KEYWORD[detail[0]] = {
                index: i,
                name: detail[1]
            };
        });
    });
    model = $com.Model.create({
        name: '返修',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();
        },

        events: function () {
            $(".m-table").delegate(".list-group-item:not(.stop-expand)", "click", function (e) {
                var $this = $(this),
                    $expand = $this.find(".item-icon .icon");

                if ($expand.hasClass("icon-arrow-expand")) {
                    $expand.removeClass("icon-arrow-expand");

                    $this.siblings().hide(); //ul元素消失
                } else {
                    $expand.addClass("icon-arrow-expand");
                    $this.siblings().show(); //ul显示
                }

                e.stopPropagation(); //阻止事件冒泡
                e.preventDefault(); //preventDefault() 方法阻止元素发生默认的行为
            });

            //Enter触发模糊查询事件  返修单
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var value = $("#zace-search-Device-itemTask").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-Device-tbody-repairTask").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-Device-tbody-repairTask"), ItemShow, value, "ID");
                }
            });
            //模糊查询  返修单
            $("body").delegate("#zace-Device-searchTask", "click", function () {
                var value = $("#zace-search-Device-itemTask").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-Device-tbody-repairTask").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-Device-tbody-repairTask"), ItemShow, value, "ID");
            });

            //Enter触发模糊查询事件  返修项
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var value = $("#zace-search-Device-item").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-Device-tbody-item").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-Device-tbody-item"), mRepairItem, value, "ID");
                }
            });
            //模糊查询  返修项
            $("body").delegate("#zace-Device-search", "click", function () {
                var value = $("#zace-search-Device-item").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-Device-tbody-item").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-Device-tbody-item"), mRepairItem, value, "ID");
            });
            //条件查询
            $("body").delegate("#zace-Device-searchface", "click", function () {
                var default_value = {
                    StationID: 0,
                    // PartID: 0,
                    LineID: 0,
                    CustomerID: 0,
                    CarTypeID: 0,
                    CarNumber: "",
                    UpFlowID: 0,
                    StartTime: $com.util.format("yyyy-MM-dd", new Date().getTime() - 30 * 24 * 3600 * 1000),
                    EndTime: $com.util.format("yyyy-MM-dd", new Date().getTime() + 24 * 3600 * 1000),
                    // Status: [],
                    IsDelivery: 0,
                    OrderID: -1,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Device_item, "查询", function (rst) {
                    if (!rst || $.isEmptyObject(rst)) {
                        return false;
                    }
                    queryAll = {
                        StationID: Number(rst.StationID) == 0 ? -1 : Number(rst.StationID),
                        // PartID: Number(rst.PartID)==0?-1:Number(rst.PartID),
                        LineID: Number(rst.LineID) == 0 ? -1 : Number(rst.LineID),
                        CustomerID: Number(rst.CustomerID) == 0 ? -1 : Number(rst.CustomerID),
                        CarTypeID: Number(rst.CarTypeID) == 0 ? -1 : Number(rst.CarTypeID),
                        PartNo: rst.CarNumber == "0" ? "" : rst.CarNumber,
                        SendID: Number(rst.UpFlowID) == 0 ? -1 : Number(rst.UpFlowID),
                        StartTime: $com.util.format("yyyy-MM-dd hh:mm:ss", rst.StartTime),
                        EndTime: $com.util.format("yyyy-MM-dd hh:mm:ss", rst.EndTime),
                        StatusIDList: [],
                        IsDelivery: Number(rst.IsDelivery) == 0 ? -1 : Number(rst.IsDelivery),
                        OrderID: -1,
                    };
                    model.com.getTimeAll(queryAll, function (res) {
                        if (res && res.list) {
                            alert("查询成功！");
                            var wTimeAll = $com.util.Clone(res.list);

                            // var repairItem = [];
                            // for (var k = 0; k < wTimeAll.length; k++) {
                            //     for (var m = 0; m < wTimeAll[k].RepairItemList.length; m++) {
                            //         repairItem.push(wTimeAll[k].RepairItemList[m]);
                            //     }
                            // }

                            $.each(wTimeAll, function (i, item) {
                                item.PartNo = item.CarTypeName + "#" + item.CarNumber;
                                for (var p in item) {
                                    if (!FORMATTRT_Device_item[p])
                                        continue;
                                    item[p] = FORMATTRT_Device_item[p](item[p]);

                                }
                            });
                            for (var i = 0; i < wTimeAll.length; i++) {
                                wTimeAll[i].WID = i + 1;
                            }
                            // PartNOArray = [];
                            // wTimeAll.forEach(element => {
                            //     PartNOArray=element.CarNumber.split("#");
                            //     element.CarNumberName=PartNOArray[1];
                            // });
                            $("#femi-Device-tbody-repairTask").html($com.util.template(wTimeAll, HTML.TableNode_repairTask));
                        }
                    });


                }, TypeSource_Device_item));
            });

            //双击查看详情
            $("body").delegate("#femi-Device-tbody-item tr", "dblclick", function () {
                var $this = $(this);
                $this.css("background-color", "Aqua");
                $this.siblings().css("background-color", "");
                CarID = Number($this.find('td[data-title=ID]').attr('data-value'));
                $(".zzzb").show();
                $(".zzzb").width("25%");
                $(".zzza").width("75%");

                $com.app.loading('数据加载中...');
                model.com.getInfo({
                    ID: CarID
                }, function (data) {
                    list = data.info;
                    mFlow = data.info.FlowID;
                    // $("#detail").text(list.Code + "(" + data.info.StatusText + ")");
                    // $("#detail").text(list.Code);
                    var StartTime = "2010-01-01 01:01:01";

                    var wCreateTime = $com.util.format('yyyy-MM-dd hh:mm', list.CreateTime);
                    list.CreateTime = Date.parse(StartTime) > Date.parse(wCreateTime) ? "-" : wCreateTime;

                    var wSubmitTime = $com.util.format('yyyy-MM-dd hh:mm', list.SubmitTime);
                    list.SubmitTime = Date.parse(StartTime) > Date.parse(wSubmitTime) ? "-" : wSubmitTime;

                    model.com.render(list);
                    wUser = [];
                    model.com.getUser({}, function (res) {
                        for (var i = 0; i < res.list.length; i++) {
                            if (res.list[i].Active == 1) {
                                wUser.push(res.list[i]);
                            }
                        }
                        model.com.getBPMActivitiHisTaskByPIId({ processInstanceId: mFlow }, function (resHisTask) {
                            wHisTaskList = resHisTask.list;
                            wFindTaskList = $com.util.Clone(wHisTaskList);
                            model.com.HisTaskShow(wHisTaskList);
                            $com.app.loaded();
                        });
                    });
                });

            });
            $("body").delegate("#zace-hide", "click", function () {
                $(".zzzb").hide();
                $(".zzza").width("100%");
            });
            $("body").delegate("#zace-Device-refresh", "click", function () {
                $com.app.loading('数据加载中...');
                StartTime = $com.util.format("yyyy-MM-dd", new Date().getTime() - 7 * 24 * 3600 * 1000);
                EndTime = $com.util.format("yyyy-MM-dd", new Date().getTime() + 24 * 3600 * 1000);
                model.com.refresh();
            });

            //双击查看返修项
            $("body").delegate("#femi-Device-tbody-repairTask tr", "dblclick", function () {
                var $this = $(this);
                var CarItemID = Number($this.find('td[data-title=ID]').attr('data-value'));
                $(".repairTask").hide();
                $(".repairItem").show();
                $(".zzza").width("100%");
                $("#detailList").hide();
                mRepairItem = [];
                for (var k = 0; k < mData.length; k++) {
                    if (mData[k].ID == CarItemID) {
                        for (var m = 0; m < mData[k].RepairItemList.length; m++) {
                            mData[k].RepairItemList[m].WID = m + 1;
                            mData[k].RepairItemList[m].PartNo = mData[k].RepairItemList[m].CarTypeName + "#" + mData[k].RepairItemList[m].CarNumber;
                            mData[k].RepairItemList[m].SubmitTime = $com.util.format("yyyy-MM-dd hh:mm:ss", mData[k].RepairItemList[m].SubmitTime);
                            mData[k].RepairItemList[m].CreateTime = $com.util.format("yyyy-MM-dd hh:mm:ss", mData[k].RepairItemList[m].CreateTime);
                            mRepairItem.push(mData[k].RepairItemList[m]);
                        }
                    }
                }
                $("#femi-Device-tbody-item").html($com.util.template(mRepairItem, HTML.TableNode_item));
            });

            $("body").delegate("#zace-Device-back", "click", function () {
                $(".repairTask").show();
                $(".repairItem").hide();
            });
        },


        run: function () {
            StartTime = $com.util.format("yyyy-MM-dd", new Date().getTime() - 30 * 24 * 3600 * 1000);
            EndTime = $com.util.format("yyyy-MM-dd", new Date().getTime() + 24 * 3600 * 1000);
            //所有订单
            model.com.getOMSOrderRF({
                CustomerID: -1, LineID: -1, ProductID: -1, PartNo: "", StartTime: "2000-1-1", EndTime: "2000-1-1"
            }, function (resYear) {
                $.each(resYear.list, function (i, item) {
                    var CarTypeNumber = item.PartNo.split("#")[1]
                    //车号
                    TypeSource_Device_item.CarNumber.push({
                        name: CarTypeNumber,
                        value: CarTypeNumber,
                        far: item.ProductID
                    });
                    // 车型
                    TypeSource_Device_item.CarTypeID.push({
                        name: item.ProductNo,
                        value: item.ProductID,
                        far: 0
                    });
                    //修程
                    TypeSource_Device_item.LineID.push({
                        name: item.LineName,
                        value: item.LineID,
                        far: 0
                    });
                    //配属局段
                    TypeSource_Device_item.CustomerID.push({
                        name: item.BureauSection,
                        value: item.BureauSectionID,
                        far: 0
                    });
                });
                TypeSource_Device_item.CarTypeID = model.com.unique(TypeSource_Device_item.CarTypeID);
                TypeSource_Device_item.CarNumber = model.com.unique(TypeSource_Device_item.CarNumber);
                TypeSource_Device_item.LineID = model.com.unique(TypeSource_Device_item.LineID);
                TypeSource_Device_item.CustomerID = model.com.unique(TypeSource_Device_item.CustomerID);
                model.com.getFPCPart({ FactoryID: 0, BusinessUnitID: 0 }, function (resS) {
                    $.each(resS.list, function (i, item) {
                        //工位
                        TypeSource_Device_item.StationID.push({
                            name: item.Name,
                            value: item.ID,
                            far: 0
                        });
                    });
                    // model.com.getFPCPartPoint({ FactoryID: 0, BusinessUnitID: 0, ProductTypeID: 0 }, function (resPartPoint) {
                    // $.each(resPartPoint.list, function (i, item) {
                    //     //工序
                    //     TypeSource_Device_item.PartID.push({
                    //         name: item.Name,
                    //         value: item.ID,
                    //         far: 0
                    //     });
                    // });
                    model.com.getTimeAll({
                        StationID: -1, LineID: -1, CustomerID: -1, CarTypeID: -1, PartNo: "",
                        SendID: -1, StatusIDList: [], StartTime: "2000-1-1 00:00:00", EndTime: "2000-1-1 00:00:00", IsDelivery: -1, OrderID: -1
                    }, function (res) {
                        $.each(res.list, function (i, item) {
                            //检验员
                            TypeSource_Device_item.UpFlowID.push({
                                name: item.UpFlowName,
                                value: item.UpFlowID,
                                far: 0
                            });
                        });
                        TypeSource_Device_item.UpFlowID = model.com.unique(TypeSource_Device_item.UpFlowID);
                        model.com.refresh();
                    });
                    // });
                });

            });

        },

        com: {
            refresh: function () {
                $com.app.loading('数据加载中...');

                model.com.getTimeAll({
                    // StartTime: StartTime, EndTime: EndTime, IsDelivery: wIsDelivery,SendID:-1,CarTypeID:-1,StationID:-1 
                    StationID: -1, LineID: -1, CustomerID: -1, CarTypeID: -1, PartNo: "",
                    SendID: -1, StatusIDList: [], StartTime: StartTime, EndTime: EndTime, IsDelivery: -1, OrderID: -1
                }, function (res) {
                    if (res && res.list) {
                        mData = $com.util.Clone(res.list);
                        var Item = $com.util.Clone(res.list);
                        // var repairItem = [];
                        // for (var k = 0; k < Item.length; k++) {
                        //     for (var m = 0; m < Item[k].RepairItemList.length; m++) {
                        //         repairItem.push(Item[k].RepairItemList[m]);
                        //     }
                        // }

                        $.each(Item, function (i, item) {
                            item.PartNo = item.CarTypeName + "#" + item.CarNumber;
                            for (var p in item) {
                                if (!FORMATTRT_Device_item[p])
                                    continue;
                                item[p] = FORMATTRT_Device_item[p](item[p]);
                            }
                        });
                        for (var i = 0; i < Item.length; i++) {
                            Item[i].WID = i + 1;
                        }
                        ItemShow = $com.util.Clone(Item);
                        // PartNOArray = [];
                        // Item.forEach(element => {
                        //     PartNOArray=element.CarNumber.split("#");
                        //     element.CarNumberName=PartNOArray[1];
                        // });
                        $("#femi-Device-tbody-repairTask").html($com.util.template(Item, HTML.TableNode_repairTask));
                        $com.app.loaded();
                    }
                });
            },
            //用返修项任务ID拿单条返修项操作纪录
            getInfo: function (data, fn, context) {
                var d = {
                    $URI: "/RRO/ItemInfo",
                    $TYPE: "Get",
                    $SERVER: "/MESWDW"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络！');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            // 通过任务ID获取当前任务节点出口顺序流条件信息
            getBPMActivitiHisTaskByPIId: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESBPM",
                    $URI: "/History/getBPMActivitiHisTaskByPIId",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);

            },
            //查询用户

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
            //用人拿单条任务
            // getInfo: function (data, fn, context) {
            //     var d = {
            //         $URI: "/RRO/Info",
            //         $TYPE: "Get",
            //         $SERVER: "/MESWDW"
            //     };
            //     function err() {
            //         $com.app.tip('获取失败，请检查网络');
            //     }

            //     $com.app.ajax($.extend(d, data), fn, err, context);
            // },
            //返修用时间段查询
            getTimeAll: function (data, fn, context) {
                var d = {
                    $URI: "/RRO/TimeAll",
                    $TYPE: "Post",
                    $SERVER: "/MESWDW"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            unique: function (arr) {
                for (var i = 0; i < arr.length; i++) {
                    for (var j = i + 1; j < arr.length; j++) {
                        if (arr[i].value == arr[j].value) { //第一个等同于第二个，splice方法删除第二个
                            arr.splice(j, 1);
                            j--;
                        }
                    }
                }
                return arr;
            },
            //根据局段 时间段 修程 车型 车号查询订单集合
            getOMSOrderRF: function (data, fn, context) {
                var d = {
                    $URI: "/OMSOrder/RFOrderList",
                    $TYPE: "Get",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    // $com.app.tip('获取失败请检查网络!');
                    console.log('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询工位列表
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
            ChangeValueToShow: function (pname, value) {
                var wResult = value;
                if (!value || value == 0) {
                    wResult = "";
                }
                if (pname.indexOf("Time") != -1) {
                    var Time = "2010-01-01 01:01:01";
                    if (Date.parse(Time) > Date.parse($com.util.format('yyyy-MM-dd hh:mm', value))) {
                        wResult = "";
                    }
                }
                switch (pname) {
                    case "ImageList":
                        var ImgListArray = [];
                        var strImg = !value ? "" : value;
                        var ImgList = strImg.split(",");
                        // <img src="{{Src}}" data-id="{{Id}}">
                        for (var i = 0; i < ImgList.length; i++) {
                            if (ImgList[i] != "") {
                                ImgListArray.push(
                                    {
                                        Src: ImgList[i]
                                    }
                                )
                            }
                        }
                        wResult = $com.util.template(ImgListArray, HTML.IMGSrc)
                        break;
                    default:
                        break;
                }
                return wResult;
            },
            getUserName: function (wIDString, list) {
                var wIDArray = []
                var wResult = [];
                wIDArray = wIDString.split(",");
                $.each(list, function (i, item) {
                    $.each(wIDArray, function (j, item_j) {
                        if (item_j == item.ID) {
                            wResult.push(item.Name + "("
                                + (item.LoginID ?
                                    item.LoginID.substring(item.LoginID.length - 6)
                                    : "") + ")");
                        }
                    });
                });

                return wResult.join(",");
            },
            HisTaskShow: function (HisTaskArrayParameter) {
                HisTaskArray = $com.util.Clone(HisTaskArrayParameter);
                //根据历史数据渲染模板
                $.each(HisTaskArray, function (i, item) {
                    item.AssigneeList = [];
                    item.Assignee_Tip = "";
                    if (item.Assignee) {
                        item.Assignee_Tip = model.com.getUserName(item.Assignee, wUser);
                        item.AssigneeList = item.Assignee_Tip.split(",");
                        if (item.AssigneeList.length == 1) {
                            item.Assignee = item.AssigneeList[0];
                        } else if (item.AssigneeList.length >= 2) {
                            item.Assignee = "";
                        }
                    }
                    model.com.FullReson(item);
                    IsReadList = [];
                    $.each(item.HisTaskVarinstList, function (j, item_j) {
                        item_j.VariableValue = model.com.ChangeValueToShow(item_j.VariableName,
                            item_j.ValueText);
                        if (!item_j.VariableValue || item_j.VariableValue.length == 0) {
                            item_j.Display = "none";
                        } else {
                            item_j.Display = "";
                        }
                        item_j.Name = item_j._BPMActivitiForm.Name;
                        if (item_j._BPMActivitiForm.IsWritable) {

                            IsReadList.push(item_j);
                        }
                    });
                    item.History_ITEM = $com.util.template(IsReadList, HTML.HistoryDemo);

                });
                $(".zzzb .zace-bg .lmvt-container-table-basic .femi-tb-scroll .process .m-c-panel .m-c-body .list-group li .list-group").html($com.util.template(HisTaskArray, HTML.module_Process))
            },
            FullReson: function (hisTask) {
                if (!hisTask || !hisTask.ID)
                    return;
                if (hisTask.Status == 0) {
                    hisTask.EndTime = $com.util.format("MM-dd hh:mm", hisTask.EndTime);
                    hisTask.deleteReason = "待执行";
                    hisTask.ReasonColor = "#EEB422";
                } else if (hisTask.Status == 1) {
                    hisTask.EndTime = $com.util.format("MM-dd hh:mm", hisTask.EndTime);
                    hisTask.deleteReason = "已处理";
                    hisTask.ReasonColor = "green";
                    var _TextArray = [];
                    $.each(hisTask.OperationStep, function (i, item) {
                        $.each(hisTask.HisTaskVarinstList, function (j, item_j) {
                            if (item.Name != item_j.VariableName)
                                return true;
                            if (item.Value != item_j.Value)
                                return true;
                            if (!item.Documentation)
                                return true;
                            _TextArray = item.Documentation.split(";");
                            if (!_TextArray || _TextArray.length < 2)
                                return true;

                            _TextArray = _TextArray[0].split(":");
                            if (!_TextArray || _TextArray.length != 2)
                                return true;
                            hisTask.deleteReason = _TextArray[1];
                        });
                    });
                    if (hisTask.deleteReason == "驳回") {
                        hisTask.ReasonColor = "red";
                    } else {
                        hisTask.ReasonColor = "green";
                    }
                } else if (hisTask.Status == 2) {
                    hisTask.EndTime = "-";
                    hisTask.deleteReason = "已关闭";
                    hisTask.ReasonColor = "red"
                }

            },
            render: function (list) {
                var _data = [];
                for (var p in list) {
                    var o = KEYWORD[p];
                    if (o) {
                        _data[Number(o.index)] = {
                            name: o.name,
                            value: list[p] === "" ? "-" : list[p]
                        };
                    }
                }
                $(".m-detail-list").html($com.util.template(_data, HTML.LIST));

            }
        }
    }),

        model.init();

});