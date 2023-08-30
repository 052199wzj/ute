require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {
    var KEYWORD_Device_LIST_item,
        KEYWORD_Device_item,
        FORMATTRT_Device_item,
        DEFAULT_VALUE_Device_item,
        TypeSource_Device_item,
        ItemShow,
        wDepartment,
        wLevel = -1,
        wStepList = [],
        wSendType = -1,
        wOrderID = -1,
        mData,
        KEYWORD_LIST,
        KEYWORD_All,
        KEYWORD,
        wUser = [],
        HTML;
    wLevelList = ["默认", "I级", "II级", "III级"];
    wLevelType = ["默认", "A类", "B类", "C类"];
    wResultList = ["默认", "返工", "返修", "让步放行", "报废", "退回供应商", "下发方案", "其他",];
    HTML = {
        TableNode_item: [
            '<tr data-ID="">',
            '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{WID}}</td>',
            // '<td style="min-width: 50px" data-title="Code" data-value="{{Code}}">{{Code}}</td>',
            '<td style="min-width: 50px" data-title="PartNo" data-value="{{PartNo}}">{{PartNo}}</td>',
            // '<td style="min-width: 50px" data-title="CarType" data-value="{{CarType}}">{{CarType}}</td>',
            // '<td style="min-width: 50px" data-title="CarNumber" data-value="{{CarNumber}}">{{CarNumber}}</td>',
            '<td style="min-width: 50px" data-title="CustomerName" data-value="{{CustomerName}}">{{CustomerName}}</td>',
            '<td style="min-width: 50px" data-title="LineName" data-value="{{LineName}}">{{LineName}}</td>',
            '<td style="min-width: 50px" data-title="StationName" data-value="{{StationName}}">{{StationName}}</td>',
            '<td style="min-width: 50px" data-title="UpFlowName" data-value="{{UpFlowName}}">{{UpFlowName}}</td>',
            '<td style="min-width: 50px" data-title="CreateTime" data-value="{{CreateTime}}">{{CreateTime}}</td>',

            '<td style="min-width: 50px" data-title="DescribeInfo" data-value="{{DescribeInfo}}">{{DescribeInfo}}</td>',
            '<td style="min-width: 50px" data-title="Number" data-value="{{Number}}">{{Number}}</td>',
            '<td style="min-width: 50px" data-title="Level" data-value="{{Level}}">{{Level}}</td>',
            '<td style="min-width: 50px" data-title="Type" data-value="{{Type}}">{{Type}}</td>',
            // '<td style="min-width: 50px" data-title="Result" data-value="{{Result}}">{{Result}}</td>',
            // '<td style="min-width: 50px" data-title="IsSonTask" data-value="{{IsSonTask}}">{{IsSonTask}}</td>',
            // '<td style="min-width: 50px" data-title="AddSonTime" data-value="{{AddSonTime}}">{{AddSonTime}}</td>',
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

    };


    $(function () {
        KEYWORD_Device_LIST_item = [
            // "ID|编号",
            "Code|单据编号",
            "CarTypeID|车型|ArrayOneControl",
            "CarNumber|车号|ArrayOneControl|CarTypeID",
            "PartNo|车号",
            "StationID|工位|ArrayOne",
            "LineID|修程|ArrayOne",
            "CustomerID|配属局段|ArrayOne",
            "UpFlowID|发起人|ArrayOne",
            "CustomerName|配属局段",
            "Department|申请部门",
            "UpFlowName|申请人",
            "CreateTime|申请时间|DateTime",
            // "SendType|发起类型|ArrayOne",
            "DescribeInfo|不合格描述",
            "Number|不合格品数量",
            "Level|等级|ArrayOne",
            "Type|类别|ArrayOne",
            "Result|工艺结果|ArrayOne",
            // "IsSonTask|是否是子流程|ArrayOne",
            // "Status|状态|Array",
            "SubmitTime|任务更新时间|DateTime",
            "StartTime|开始时间|Date",
            "EndTime|结束时间|Date",
        ];
        KEYWORD_Device_item = {};
        FORMATTRT_Device_item = {};
        DEFAULT_VALUE_Device_item = {};
        TypeSource_Device_item = {
            SendType: [{
                'name': "无",
                'value': 0
            }, {
                'name': "生产作业人员发起",
                'value': 1
            },
            {
                'name': "质检员发起",
                'value': 2
            }, {
                'name': "质量工程师发起",
                'value': 3
            }],
            Level: [{
                'name': "无",
                'value': 0
            }, {
                'name': "I级",
                'value': 1
            },
            {
                'name': "II级",
                'value': 2
            }, {
                'name': "III级",
                'value': 3
            }
            ],
            Type: [{
                'name': "无",
                'value': 0
            }, {
                'name': "A类",
                'value': 1
            },
            {
                'name': "B类",
                'value': 2
            }, {
                'name': "C类",
                'value': 3
            }
            ],

            Result: [{
                'name': "无",
                'value': 0
            },
            {
                'name': "返工",
                'value': 1
            },
            {
                'name': "返修",
                'value': 2
            }, {
                'name': "让步放行",
                'value': 3
            }, {
                'name': "报废",
                'value': 4
            }, {
                'name': "退回供应商",
                'value': 5
            }, {
                'name': "下发方案",
                'value': 6
            }, {
                'name': "其他",
                'value': 7
            }],
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
            "Code|单据编号",

            "CustomerName|配属局段",
            "LineName|修程",
            "StationName|工位",
            "CarType|车型",
            "PartNo|车号",
            "Number|不合格数量",
            "DescribeInfo|不合格描述",
            "TypeName|不合格品类别",
            "LevelName|不合格品等级",
            "ResultName|工艺处理结果",
            "CloseStationName|关闭工位",
            "CloseTime|关闭时间",
            "OtherResult|其它意见",
            "UpFlowName|申请人",
            "CreateTime|申请时刻",
            "Department|申请部门",
            "DutyDepartmentName|责任部门",
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
        name: '不合格评审任务',

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
            //Enter触发模糊查询事件
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var value = $("#zace-search-Device-item").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-Device-tbody-item").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-Device-tbody-item"), ItemShow, value, "ID");
                }
            });
            //模糊查询
            $("body").delegate("#zace-Device-search", "click", function () {
                var value = $("#zace-search-Device-item").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-Device-tbody-item").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-Device-tbody-item"), ItemShow, value, "ID");
            });
            //条件查询
            $("body").delegate("#zace-Device-searchface", "click", function () {
                //查询字段定义

                Defaul_Value_Search = {
                    'StartTime': $com.util.format("yyyy-MM-dd", new Date().getTime() - 30 * 24 * 3600 * 1000),
                    'EndTime': $com.util.format("yyyy-MM-dd", new Date().getTime() + 24 * 3600 * 1000),
                    'Level': 0,
                    // 'SendType': 0,
                    'StationID': 0,
                    'CustomerID': 0,
                    'LineID': 0,
                    'Status': 0,
                    'UpFlowID': 0,
                    "CarTypeID": 0,
                    "CarNumber": "",
                };
                $("body").append($com.modal.show(Defaul_Value_Search, KEYWORD_Device_item, "查询", function (rst) {
                    if (!rst || $.isEmptyObject(rst)) {
                        return false;
                    }
                    // StartTime = $com.util.format("yyyy-MM-dd", rst.StartTime);
                    // EndTime = $com.util.format("yyyy-MM-dd", rst.EndTime);
                    // wLevel = Number(rst.Level),
                    //     wSendType = Number(rst.SendType),
                    //     model.com.refresh();
                    queryAll = {
                        // SendType: Number(rst.SendType) == 0 ? -1 : Number(rst.SendType),
                        Level: Number(rst.Level) == 0 ? -1 : Number(rst.Level),
                        StationID: Number(rst.StationID) == 0 ? -1 : Number(rst.StationID),
                        LineID: Number(rst.LineID) == 0 ? -1 : Number(rst.LineID),
                        CustomerID: Number(rst.CustomerID) == 0 ? -1 : Number(rst.CustomerID),
                        SenderID: Number(rst.UpFlowID) == 0 ? -1 : Number(rst.UpFlowID),
                        StartTime: $com.util.format("yyyy-MM-dd hh:mm:ss", rst.StartTime),
                        EndTime: $com.util.format("yyyy-MM-dd hh:mm:ss", rst.EndTime),
                        StatusIDList: [],
                        OrderID: -1,
                        CarNumber: rst.CarNumber == 0 ? "" : rst.CarNumber,
                        CarTypeID: Number(rst.CarTypeID) == 0 ? -1 : Number(rst.CarTypeID),
                    };
                    model.com.getTimeAll(queryAll, function (res) {

                        if (res && res.list) {
                            alert("查询成功！");
                            mData = $com.util.Clone(res.list);
                            var Item = $com.util.Clone(res.list);

                            $.each(Item, function (i, item) {
                                item.PartNo = item.CarType + "#" + item.CarNumber;
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
                            $("#femi-Device-tbody-item").html($com.util.template(Item, HTML.TableNode_item));
                            $com.app.loaded();
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
                    var StartTime = "2010-01-01 01:01:01";

                    var wCloseTime = $com.util.format('yyyy-MM-dd hh:mm', list.CloseTime);
                    list.CloseTime = Date.parse(StartTime) > Date.parse(wCloseTime) ? "-" : wCloseTime;

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
                StartTime = $com.util.format("yyyy-MM-dd", new Date().getTime() - 30 * 24 * 3600 * 1000);
                EndTime = $com.util.format("yyyy-MM-dd", new Date().getTime() + 24 * 3600 * 1000);
                model.com.refresh();

            });
            //申请图片查看(list 里面)
            $("body").delegate(".overAll .m-card .m-c-panel .m-c-body .upload-list .QualityOpinion .m-detail-content img", "click", function () {
                var farImg = $(this).parent(),
                    imgObj = {},
                    imgList = [];
                $.each(farImg.children(), function (i, item) {
                    imgObj = $(item).attr("data-source");
                    imgList.push(imgObj);
                });
                PhotoList = imgList;
                $("body").append(HTML.Photo);
                var imgSrc = $(this).attr("src")
                $.each(PhotoList, function (p_i, p_item) {
                    var pImg = p_item;
                    if (pImg == imgSrc) {
                        $(".lmvt-change-photo").attr("data-index", p_i);
                        return false;
                    }
                })

                $(".lmvt-change-photo").css("background", "url(" + imgSrc + ") " + "no-repeat center");
            });

            //申请图片查看(相关部门)
            $("body").delegate(".overAll .audit .m-c-panel .m-c-body .upload-list .upload-img .list-groupAudit .multil-btn .multi-flex .m-detail-content .image-show", "click", function () {
                var farImg = $(this).parent(),
                    imgObj = {},
                    imgList = [];
                $.each(farImg.children(), function (i, item) {
                    imgObj = $(item).attr("data-source");
                    imgList.push(imgObj);
                });
                PhotoList = imgList;
                $("body").append(HTML.Photo);
                var imgSrc = $(this).attr("src")
                $.each(PhotoList, function (p_i, p_item) {
                    var pImg = p_item;
                    if (pImg == imgSrc) {
                        $(".lmvt-change-photo").attr("data-index", p_i);
                        return false;
                    }
                })

                $(".lmvt-change-photo").css("background", "url(" + imgSrc + ") " + "no-repeat center");
            });

            $("body").delegate(".overAll .m-table .m-c-panel .m-c-body .upload-list .upload-img .list-group .multil-btn .multi-flex .m-detail-content .image-show", "click", function () {
                var farImg = $(this).parent(),
                    imgObj = {},
                    imgList = [];
                $.each(farImg.children(), function (i, item) {
                    imgObj = $(item).attr("data-source");
                    imgList.push(imgObj);
                });
                PhotoList = imgList;
                $("body").append(HTML.Photo);
                var imgSrc = $(this).attr("src")
                $.each(PhotoList, function (p_i, p_item) {
                    var pImg = p_item;
                    if (pImg == imgSrc) {
                        $(".lmvt-change-photo").attr("data-index", p_i);
                        return false;
                    }
                })

                $(".lmvt-change-photo").css("background", "url(" + imgSrc + ") " + "no-repeat center");
            });

            //移除photo
            $("body").delegate(".lmvt-remove-photo", "click", function () {
                $(".lmvt-show-photo").remove();
            });

            //右看图片
            $("body").delegate(".lmvt-bottom-left", "click", function () {
                var index = Number($(".lmvt-change-photo").attr("data-index"));
                if (PhotoList) {
                    if (index == PhotoList.length - 1) {
                        alert("这是最后一张图片！");
                        return false;
                    }
                    else {
                        $(".lmvt-change-photo").css("background", "url(" + PhotoList[index + 1] + ") " + "no-repeat center");
                        $(".lmvt-change-photo").attr("data-index", index + 1);
                    }
                }
            });
            //左看图片
            $("body").delegate(".lmvt-bottom-right", "click", function () {
                var index = Number($(".lmvt-change-photo").attr("data-index"));
                if (PhotoList) {
                    if (index == 0) {
                        alert("这是第一张图片！");
                        return false;
                    }
                    else {
                        $(".lmvt-change-photo").css("background", "url(" + PhotoList[index - 1] + ") " + "no-repeat center");
                        $(".lmvt-change-photo").attr("data-index", index - 1);
                    }
                }

            });
        },


        run: function () {
            //获取所有部门
            model.com.getDepartment({
            }, function (data) {
                wDepartment = data.list;
            });
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
                        StartTime: "2000-1-1 00:00:00", EndTime: "2000-1-1 00:00:00", OrderID: -1, CustomerID: -1, LineID: -1, StationID: -1, SenderID: -1, Level: -1, StatusIDList: [], CarNumber: "", CarTypeID: -1
                    }, function (res) {
                        $.each(res.list, function (i, item) {
                            //发起人
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
                    StartTime: StartTime, EndTime: EndTime, OrderID: -1, CustomerID: -1, LineID: -1, StationID: -1, SenderID: -1, Level: -1, StatusIDList: [], CarNumber: "", CarTypeID: -1
                }, function (res) {
                    if (res && res.list) {
                        mData = $com.util.Clone(res.list);
                        var Item = $com.util.Clone(res.list);

                        $.each(Item, function (i, item) {
                            item.PartNo = item.CarType + "#" + item.CarNumber;
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
                        PartNOArray = [];
                        // Item.forEach(element => {
                        //     PartNOArray=element.CarNumber.split("#");
                        //     element.CarNumberName=PartNOArray[1];
                        // });
                        $("#femi-Device-tbody-item").html($com.util.template(Item, HTML.TableNode_item));
                        $com.app.loaded();
                    }
                });
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
            HisTaskShow: function (HisTaskArray) {
                //根据历史数据渲染模板
                $.each(HisTaskArray, function (i, item) {
                    if (item.Assignee) {
                        item.AssigneeList = [];
                        item.Assignee_Tip = "";
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
                $(".zzzb .zace-bg .lmvt-container-table-basic .femi-tb-scroll .overAll .process .m-c-panel .m-c-body .list-group li .list-group").html($com.util.template(HisTaskArray, HTML.module_Process))
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
            //不合格评审用时间段查询
            getTimeAll: function (data, fn, context) {
                var d = {
                    $URI: "/NCR/TimeAll",
                    $TYPE: "Post",
                    $SERVER: "/MESWDW"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
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


            //拿所有部门
            getDepartment: function (data, fn, context) {
                var d = {
                    $URI: "/Department/AllDepartment",
                    $TYPE: "get",
                    $SERVER: "/MESCore"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询工位列表
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
            //拿单条
            getInfo: function (data, fn, context) {
                var d = {
                    $URI: "/NCR/Info",
                    $TYPE: "get",
                    $SERVER: "/MESWDW"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },


            render: function (list) {
                var _data = [];
                list.PartNo = list.CarType + "#" + list.CarNumber;
                list.LevelName = list.LevelName == "默认" ? "无" : list.LevelName;
                list.TypeName = list.TypeName == "默认" ? "无" : list.TypeName;
                list.ResultName = list.ResultName == "默认" ? "无" : list.ResultName;
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