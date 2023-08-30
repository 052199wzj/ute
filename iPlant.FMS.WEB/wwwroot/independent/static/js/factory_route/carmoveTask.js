require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($alfie, $com) {
    var mFormatter_Search; //字段格式化对象
    var mDefault_Value_Search; //查询模态框对象
    var mKeyword_Search; //查询关键字
    var mKeyword_List_Search; //定义字段格式(用于表格字段转换)
    var mTypeSource_Search; //枚举对象(用于字段转换)
    var mCloneData; //克隆的数据源(用于模糊查询)
    var HTML; //mHTML模板
    var mModelTemp; //全局数据模型
    var mData; //全局数据源
    var mDefault_Value_Modal; //模态框显示字段


    HTML = {
        LIST: ['<li>',
        '<label class="m-detail-title">{{name}}</label>',
        '<div class="m-detail-content" style=" margin-left: 3%; width: 65%;display: inline-block;">{{value}}</div>',
        '</li>'].join(""),
        TableNode_item: [
            '<tr data-color="">',
            '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{WID}}</td>',
            // '<td style="min-width: 50px" data-title="Code" data-value="{{Code}}">{{Code}}</td>',
            // '<td style="min-width: 50px" data-title="CarType" data-value="{{CarType}}">{{CarType}}</td>',
            '<td style="min-width: 50px" data-title="PartNoName" data-value="{{PartNoName}}">{{PartNoName}}</td>',
            '<td style="min-width: 50px" data-title="UpFlowName" data-value="{{UpFlowName}}">{{UpFlowName}}</td>',
            '<td style="min-width: 50px" data-title="CreateTime" data-value="{{CreateTime}}">{{CreateTime}}</td>',
            '<td style="min-width: 50px" data-title="StockName" data-value="{{StockName}}">{{StockName}}</td>',
            '<td style="min-width: 50px" data-title="PlaceName" data-value="{{PlaceName}}">{{PlaceName}}</td>',
            '<td style="min-width: 50px" data-title="TargetStockName" data-value="{{TargetStockName}}">{{TargetStockName}}</td>',
            '<td style="min-width: 50px" data-title="TargetName" data-value="{{TargetName}}">{{TargetName}}</td>',
            '<td style="min-width: 50px" data-title="ExpectedTime" data-value="{{ExpectedTime}}">{{ExpectedTime}}</td>',
            '<td style="min-width: 50px" data-title="SubmitTime" data-value="{{SubmitTime}}">{{SubmitTime}}</td>',
            '<td style="min-width: 50px" data-title="StatusText" data-value="{{StatusText}}">{{StatusText}}</td>',
            '</tr>',
        ].join(""),
        IMGSrc: '<img style="width: 60px;height: 60px;" src="{{Src}}">',
        module_Process: [
            '<ul class="list-group">',
            '<li class="list-li upload-img" data-id="{{ID}}">',
            '<div class="list-group-item" style="background-color: #f5f5f5;">',
            '<div class="list-group-item-cell item-static item-title " style="width:90%;font-size: 16px;">',
            '<div class="ds-bpm-btn-group">',
            '<div class="ds-bpm-btn" style="color: #4c4c4c;width: 38%;vertical-align: middle;">{{Name}}</div>',
            '<div class="ds-bpm-btn" id="TopDIV" style="color: #25acde;width: 25%;vertical-align: middle;text-align: center;" οnmοuseοver="message()">{{Assignee}}</div>',
            '<div class="ds-bpm-btn" style="color: #4c4c4c;width: 18%;vertical-align: middle;">{{EndTime}}</div>',
            '<div class="ds-bpm-btn" style="color: {{ReasonColor}};width: 18%;vertical-align: middle;">{{deleteReason}}</div>',
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
    mDefault_Value_Search = {
    };
    //初始化字段模板
    
   
    (function () {
        mKeyword_List_Search = [
            "Code|单据编号",
            // "CarType|车型",
            "PartNoName|车号",
            "UpFlowName|申请人",
            "CreateTime|申请时间|DateTime",
            "PlaceName|初始台位",
            "TargetSName|目标台位",
            "StockName|初始库位",
            "TargetSStockName|目标库位",
            "ExpectedTime|预计移车时间|DateTime",
            "SubmitTime|任务更新时间|DateTime",
            "StatusText|任务状态",
            "StartTime|开始时间|Date",
            "EndTime|结束时间时间|Date",
        ];
        mDefault_Value_Modal = {
            "StartTime": $com.util.format("yyyy-MM-dd", new Date().getTime() - 7 * 24 * 3600 * 1000),
            "EndTime": $com.util.format("yyyy-MM-dd", new Date().getTime() + 24 * 3600 * 1000),
        };

        mKeyword_Search = {};

        mFormatter_Search = {};

        mTypeSource_Search = {
            Status: [{
                'name': "默认",
                'value': 0
            },
            {
                'name': "待接收方工区主管审批",
                'value': 1
            },
            {
                'name': "接收方工区主管驳回",
                'value': 2
            },
            {
                'name': "待四工区主管审批",
                'value': 3
            },
            {
                'name': "四工区主管驳回",
                'value': 4
            },
            {
                'name': "待调车转运班成员完成任务",
                'value': 5
            },
            {
                'name': "已完工",
                'value': 6
            }
            ]
        };

        $.each(mKeyword_List_Search, function (i, item) {
            var detail = item.split("|");
            mKeyword_Search[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };

            if (detail.length > 2) {
                mFormatter_Search[detail[0]] = $com.util.getFormatter(mTypeSource_Search, detail[0], detail[2]);
            }
        });
    })();

    (function () {
        Keyword_List_Search = [
            "CarTypeID|车型|ArrayOneControl",
            "CarNumber|车号|ArrayOneControl|CarTypeID",
        ];

        Default_Value_Modal = {
            'CarTypeID': 0,
            'CarNumber': "",
        };

        Keyword_Search = {};

        Formatter_Search = {};

        TypeSource_Search = {
            CarTypeID: [
                {
                    'name': "无",
                    'value': 0
                }
            ],
            CarNumber: [
                {
                    'name': "无",
                    'value': 0
                }
            ],
        };

        $.each(Keyword_List_Search, function (i, item) {
            var detail = item.split("|");
            Keyword_Search[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };

            if (detail.length > 2) {
                Formatter_Search[detail[0]] = $com.util.getFormatter(TypeSource_Search, detail[0], detail[2]);
            }
        });
    })();

    $(function () {
        KEYWORD_LIST = [
            "Code|单据编号",
            "CustomerName|配属局段",
            "CarType|车型",
            "PartNoName|车号",
            "StockName|起始库位",
            "PlaceName|起始台位",
            "TargetStockName|目标库位",
            "TargetName|目标台位",
            "UpFlowName|申请人",
            "CreateTime|申请时刻",
            "ExpectedTime|预计移车时间",
            "SubmitTime|任务更新时刻",
        ];
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
        name: '移车单',

        type: $com.Model.MAIN, //主方法

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
                        $com.table.filterByLikeString($("#femi-Device-tbody-item"), mCloneData, value, "ID");
                }
            });
            //模糊查询
            $("body").delegate("#zace-Device-search", "click", function () {
                var value = $("#zace-search-Device-item").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-Device-tbody-item").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-Device-tbody-item"), mCloneData, value, "ID");
            });
            // $("body").delegate(".modal .femi-modal-body .femi-modal-item select#modal_select_CarTypeID", "change", function (e) {
            //     var $this = $(this),
            //         name = $this.attr("data-name"),
            //         valueID = Number($this.val());

            //     $.each(mData, function (i, item) {
            //         if (item.CarTypeID == valueID) {
            //             TypeSource_Search.CarNumber.splice(1, TypeSource_Search.CarNumber.length);
            //             TypeSource_Search.CarNumber.push({
            //                 name: item.PartNo,
            //                 value: item.PartNo,
            //             })
            //         }
            //     });

            //     // //找车型的类型
            //     // FindProductObj = $com.util.find(DataProductList, function (e, i, array) {
            //     //     return e.ID == valueID;
            //     // });
            //     // mTransportType = !FindProductObj ? 0 : FindProductObj.TransportType;
            //     // if (mTransportType == 3) {
            //     //     $("select#modal_select_PartNo").parent(".femi-modal-item").show();
            //     //     $("input[data-name=PartName]").parent(".femi-modal-item").hide();
            //     // } else if (mTransportType == 4) {
            //     //     $("#modal_select_PartNo").selectpicker("val", 0);
            //     //     $("select#modal_select_PartNo").parent(".femi-modal-item").hide();
            //     //     $("input[data-name=PartName]").parent(".femi-modal-item").show();
            //     // } else {
            //     //     $("select#modal_select_PartNo").parent(".femi-modal-item").hide();
            //     //     $("input[data-name=PartName]").parent(".femi-modal-item").show();
            //     // }
            // });
            //条件查询(车号)
            $("body").delegate("#alfie-Device-search", "click", function () {
                $("body").append($com.modal.show(Default_Value_Modal, Keyword_Search, "查询", function (rst) {
                    if (!rst || $.isEmptyObject(rst)) {
                        return false;
                    }
                    Default_Value_Modal = {
                        'CarTypeID': 0,
                        'CarNumber': "",
                    };
                    mCarTypeID = rst.CarTypeID;
                    mCarNumber = rst.CarNumber;
                    model.com.GetTask({ CarTypeID: mCarTypeID, CarNumber: mCarNumber, StartTime: "2000-01-01 00:00:00", EndTime: "2000-01-01 00:00:00" }, function (res) {
                        if (res.msg) {
                            alert(res.msg);
                            return false;
                        }
                        if (res && res.list) {
                            moveTask = [];
                            for (var i = 0; i < res.list.length; i++) {
                                if (res.list[i].Status != 0) {
                                    res.list[i].PartNoName = res.list[i].CarType + "#" + res.list[i].PartNo;
                                    moveTask.push(res.list[i]);
                                }
                            }
                            //数据源字段模板转换
                            var wItemPartNo = $com.util.Clone(moveTask);

                            $.each(wItemPartNo, function (i, item) {
                                item.PartNoName = item.CarType + "#" + item.PartNo;
                                for (var p in item) {
                                    if (!mFormatter_Search[p])
                                        continue;
                                    item[p] = mFormatter_Search[p](item[p]);
                                }
                            });
                            for (var i = 0; i < wItemPartNo.length; i++) {
                                wItemPartNo[i].WID = i + 1;
                            }
                            mCloneData = $com.util.Clone(wItemPartNo);
                            $("#femi-Device-tbody-item").html($com.util.template(wItemPartNo, HTML.TableNode_item));
                        }
                    });

                }, TypeSource_Search));
            });
            //时间查询
            $("body").delegate("#searchTime", "click", function () {
                $("body").append($com.modal.show(mDefault_Value_Modal, mKeyword_Search, "查询", function (rst) {
                    if (!rst || $.isEmptyObject(rst)) {
                        return false;
                    }
                    StartTime = $com.util.format("yyyy-MM-dd", rst.StartTime);
                    EndTime = $com.util.format("yyyy-MM-dd", rst.EndTime);

                    model.com.GetTask({ StartTime: StartTime, EndTime: EndTime, PartNo: "" }, function (res) {
                        if (res.msg) {
                            alert(res.msg);
                            return false;
                        }
                        if (res && res.list) {
                            moveTask = [];
                            for (var i = 0; i < res.list.length; i++) {
                                if (res.list[i].Status != 0) {
                                    res.list[i].PartNoName = res.list[i].CarType + "#" + res.list[i].PartNo;
                                    moveTask.push(res.list[i]);
                                }
                            }
                            //数据源字段模板转换
                            var wItem = $com.util.Clone(moveTask);
                            $.each(wItem, function (i, item) {
                                item.PartNoName = item.CarType + "#" + item.PartNo;
                                for (var p in item) {
                                    if (!mFormatter_Search[p])
                                        continue;
                                    item[p] = mFormatter_Search[p](item[p]);
                                }
                            });
                            for (var i = 0; i < wItem.length; i++) {
                                wItem[i].WID = i + 1;
                            }
                            mCloneData = $com.util.Clone(wItem);
                            $("#femi-Device-tbody-item").html($com.util.template(wItem, HTML.TableNode_item));
                        }
                    });

                }, mTypeSource_Search));
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
                model.com.getEmployeeInfo({
                    ID: CarID
                }, function (data) {
                    list = data.info;
                    mFlow = data.info.FlowID;
                    list.PartNoName = list.CarType + "#" + list.PartNo;
                    // $("#detail").text(list.Code + "(" + data.info.StatusText + ")");
                    var StartTime = "2010-01-01 01:01:01";

                    var wCreateTime = $com.util.format('yyyy-MM-dd hh:mm', list.CreateTime);
                    list.CreateTime = Date.parse(StartTime) > Date.parse(wCreateTime) ? "-" : wCreateTime;

                    var wSubmitTime = $com.util.format('yyyy-MM-dd hh:mm', list.SubmitTime);
                    list.SubmitTime = Date.parse(StartTime) > Date.parse(wSubmitTime) ? "-" : wSubmitTime;

                    var wExpectedTime = $com.util.format('yyyy-MM-dd hh:mm', list.ExpectedTime);
                    list.ExpectedTime = Date.parse(StartTime) > Date.parse(wExpectedTime) ? "-" : wExpectedTime;

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
                StartTime = $com.util.format("yyyy-MM-dd", new Date().getTime() - 7 * 24 * 3600 * 1000);
                EndTime = $com.util.format("yyyy-MM-dd", new Date().getTime() + 24 * 3600 * 1000);
                model.com.refresh();
            });

        },

        run: function () {
            StartTime = $com.util.format("yyyy-MM-dd", new Date().getTime() - 7 * 24 * 3600 * 1000);
            EndTime = $com.util.format("yyyy-MM-dd", new Date().getTime() + 24 * 3600 * 1000);
            // StartTime = "2020-02-27 00:00:00";
            // EndTime = "2020-03-18 00:00:00";
            model.com.refresh();
        },

        com: {
            //刷新界面
            refresh: function () {
                $com.app.loading('数据加载中...');
                model.com.GetTask({ StartTime: StartTime, EndTime: EndTime, PartNo: "" }, function (res) {
                    if (res.msg) {
                        alert(res.msg);
                        return false;
                    }
                    if (res && res.list) {
                        moveTask = [];
                        for (var i = 0; i < res.list.length; i++) {
                            if (res.list[i].Status != 0) {
                                res.list[i].PartNoName = res.list[i].CarType + "#" + res.list[i].PartNo;
                                moveTask.push(res.list[i]);
                            }
                        }
                        mData = $com.util.Clone(moveTask);
                        //数据源字段模板转换
                        var wItem = $com.util.Clone(mData);
                        $.each(wItem, function (i, item) {
                            item.PartNoName = item.CarType + "#" + item.PartNo;
                            for (var p in item) {
                                if (!mFormatter_Search[p])
                                    continue;
                                item[p] = mFormatter_Search[p](item[p]);
                            }
                        });
                        TypeSource_Search.CarTypeID.splice(1, TypeSource_Search.CarTypeID.length);
                        TypeSource_Search.CarNumber.splice(1, TypeSource_Search.CarNumber.length);
                        $.each(wItem, function (i, item) {
                            TypeSource_Search.CarTypeID.push({
                                name: item.CarType,
                                value: item.CarTypeID,
                            });
                            TypeSource_Search.CarNumber.push({
                                name: item.PartNo,
                                value: item.PartNo,
                                far: item.CarTypeID
                            })
                        });
                        var Name = "name";
                        TypeSource_Search.CarTypeID = model.com.distinct(TypeSource_Search.CarTypeID, Name);
                        mCloneData = $com.util.Clone(wItem);

                        for (var i = 0; i < wItem.length; i++) {
                            wItem[i].WID = i + 1;
                        }
                        $("#femi-Device-tbody-item").html($com.util.template(wItem, HTML.TableNode_item));
                        $com.app.loaded();
                    }
                });
            },
            distinct: function (arr, key) {
                for (let i = 0; i < arr.length; i++) {
                    for (let j = i + 1; j < arr.length; j++) {
                        if (arr[i][key] === arr[j][key]) {
                            arr.splice(j, 1);
                            j = j - 1;
                        }
                    }
                }
                return arr;
            },
               //用人拿任务(单条)  ID 
               getEmployeeInfo: function (data, fn, context) {
                var d = {
                    $URI: "/MTC/Info",
                    $TYPE: "get",
                    $SERVER: "/MESWDW"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取移车单 参数  partNo starttime EndTime
            GetTask: function (data, fn, context) {
                var d = {
                    $URI: "/Capacity/All",
                    $TYPE: "get",
                    $SERVER: "/MESWDW"
                };

                function err() {
                    $com.app.tip('获取库位列表失败，请检查网络!');
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

            },

        }
    }),
        model.init();
});