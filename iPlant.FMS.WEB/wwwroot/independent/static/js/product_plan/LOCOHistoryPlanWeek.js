require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($zace, $com) {

    var KEYWORD_Level_LIST,
        KEYWORD_Level,
        FORMATTRT_Level,
        DEFAULT_VALUE_Level,
        TypeSource_Level,
        model,
        DataAll,
        DATABasic,
        DataAllConfirmBasic,
        DataAllConfirmChange,
        DataAllConfirm,
        DataAllSearch,
        DATAAllBusiness,
        DATAAllBusinessC,

        wWorkShopID = 1,
        wStartTime,
        wEndTime,
        HTML;
    DATAAllBusiness = DATAAllBusinessC = [];
    DataAll = [];
    DATABasic = [];
    DataAllConfirmBasic = [];
    DataAllConfirmChange = [];
    DataAllConfirm = [];
    DataAllSearch = [];
    var StatusColor = ['black', 'black', '#fa1ff4c9', 'blue', '#a94442', 'green', 'red', '#f8391bc9', 'blue', '#e6c685', 'orange'];//'#00CCFF' 完工
    PositionTemp = {
        ID: 0,
        ProductID: 0,
        ProductNo: '',
        PartNo: '',
        ArrivedTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        DepartureTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Creator: window.parent.User_Info.Name,
        CreatorID: 0,
        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Editor: window.parent.User_Info.Name,
        EditorID: 0,
        ID: 0,
        Status: 1,
        StatusText: "",
    };
    mOrderIDShow = 0;
    mZaceEndTime = $com.util.format('yyyy-MM-dd', new Date().getTime() + 7 * 24 * 3600000);
    mZaceStartTime = $com.util.format('yyyy-MM-dd', new Date().getTime() - 7 * 24 * 3600000);

    wEndTime = $com.util.format('yyyy-MM-dd', new Date().getTime() + 7 * 24 * 3600000);
    wStartTime = $com.util.format('yyyy-MM-dd', new Date().getTime() - 7 * 24 * 3600000);

    mAPSShiftPeriod = 5;
    mStartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date() - 7 * 24 * 3600000);
    mEndTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date().getTime() + 7 * 24 * 3600000);
    ;
    HTML = {
        TableMode: [
            '<tr>',
            //'<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            //'<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td data-title="ProductNo" data-value="{{ProductNo}}" >{{ProductNo}}</td>',
            '<td data-title="OrderID" data-value="{{OrderID}}" >{{OrderID}}</td>',
            '<td data-title="LineID" data-value="{{LineID}}" >{{LineID}}</td>',
            '<td data-title="PartID" data-value="{{PartID}}" >{{PartID}}</td>',

            '<td data-title="StartTime" data-value="{{StartTime}}" >{{StartTime}}</td>',
            '<td data-title="EndTime" data-value="{{EndTime}}" >{{EndTime}}</td>',

            // '<td style="color:{{StatusColorText}}" data-title="Status" data-value="{{Status}}" >{{Status}}</td>',
            '</tr>',
        ].join(""),
        VersionMode: [
            '<tr>',
            //'<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            //'<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td  style="max-width: 30px" data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',

            '<td data-title="WorkShopName" data-value="{{WorkShopName}}">{{WorkShopName}}</td>',
            '<td data-title="VersionNo" data-value="{{VersionNo}}">{{VersionNo}}</td>',

            '<td data-title="StartTime" data-value="{{StartTime}}">{{StartTime}}</td>',
            '<td data-title="EndTime" data-value="{{EndTime}}">{{EndTime}}</td>',
            '<td data-title="CreateTime" data-value="{{CreateTime}}">{{CreateTime}}</td>',
            '<td style="color:{{StatusColorText}}" data-title="Status" data-value="{{Status}}">{{Status}}</td>',

            // '<td style="max-width: 50px" data-title="Handle" data-value="{{ID}}"><div class="row">',
            // '<div class="col-md-6 lmvt-do-info">修改</div>',
            // '<div class="col-md-6 lmvt-do-active">详情</div>',
            // '</td>',
            // {/* <UL id="lmvt-nav">',
            //             '<LI>查看<UL><LI data-value="{{ID}}" class="lmvt-do-info">查看计划</LI>',
            //             '<LI data-value="{{ID}}" class="lmvt-do-active">查看详情</LI>',
            //             '</UL></LI></UL>', */}
            '<td style="max-width: 50px" data-title="Handle" data-value="{{ID}}">',
            '<div class="row">',
            '<div data-value="{{ID}}" class="col-md-6 lmvt-do-info" style="">',
            '计划详情',
            '</div>',
            '<div class="col-md-6 lmvt-do-active" style="">',
            '工序详情',
            '</div>',
            '</div>',
            '</td>',

            '</tr>',
        ].join(""),


    };
    (function () {
        KEYWORD_Level_LIST = [
            "WorkShopID|车间|ArrayOne",
            "ProductID|车型|ArrayOne",
            "OrderID|订单|ArrayOne",
            "LineID|修程|ArrayOne",
            "PartID|工位|ArrayOne",
            "PartNo|车号",


            "mStartTime|开始时间|Date",
            "mEndTime|结束时间|Date",
            "mAPSShiftPeriod|计划|ArrayOne",
            "Status|状态|ArrayOne",

            "OrderIDShow|制造令|ArrayOne",
            "StartTime|开始时间|Date",
            "EndTime|结束时间|Date",
            "CreateTime|创建时间|DateTime"
        ];
        KEYWORD_Level = {};
        FORMATTRT_Level = {};

        DEFAULT_VALUE_Level = {
            ProductID: 0,
            PartNo: '',
            // ArrivedTime:$com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
            // DepartureTime:$com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),        
            Status: 1,
        };

        TypeSource_Level = {
            UserID: [],
            WorkShopID: [],
            OrderIDShow: [],
            Active: [
                {
                    name: "激活",
                    value: 1
                }, {
                    name: "禁用",
                    value: 0
                }
            ],
            mAPSShiftPeriod: [
                {
                    name: "周计划",
                    value: 5
                }, {
                    name: "月计划",
                    value: 6
                }
            ],

            Status: [
                {
                    name: "保存",
                    value: 0
                },
                {
                    name: "保存",
                    value: 1
                }, {
                    name: "下达",
                    value: 2
                }, {
                    name: "日计划制定中",
                    value: 3
                }, {
                    name: "开工",
                    value: 4
                },
                {
                    name: "完工",
                    value: 5
                },
                {
                    name: "暂停",
                    value: 6
                },
                {
                    name: "终止",
                    value: 7
                },
                {
                    name: "提交",
                    value: 8
                },
                {
                    name: "待审批",
                    value: 9
                },
                {
                    name: "已审批",
                    value: 10
                }],

            ProductID: [],
            PartID: [],
            LineID: [],
            OrderID: [],



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
    })();


    model = $com.Model.create({
        name: 'GZLOCO',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {

            //版本查询
            $("body").delegate("#zace-searchAll-level", "click", function () {
                var default_value = {
                    //WorkShopID: wWorkShopID,
                    StartTime: wStartTime,
                    EndTime: wEndTime,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    
                    //default_value.Active = eval(rst.Active.toLowerCase());
                    //wWorkShopID = Number(rst.WorkShopID);
                    wStartTime = $com.util.format('yyyy-MM-dd', rst.StartTime);
                    wEndTime = $com.util.format('yyyy-MM-dd', rst.EndTime);

                    model.com.refreshNo();

                }, TypeSource_Level));
            });

            //排程详情
            $("body").delegate(".lmvt-do-info", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var Selection_Data = VersionSource.filter((item) => { return item.ID == wID }),
                    WorkShopID = Selection_Data[0].WorkShopID;

                var ISMove = true;
                if (new Date().getTime() >= new Date(Selection_Data[0].StartTime).getTime()) {
                    ISMove = false;
                }

                var vdata = { 'header': '周计划详情', 'href': './product_plan/ReSetPlan.html?ID=' + Selection_Data[0].ID + "&VersionNo=" + Selection_Data[0].VersionNo + "&WorkShopID=" + Selection_Data[0].WorkShopID + "&ISMove=" + ISMove, 'id': 'ReSetPlan', 'src': './static/images/menu/newfactoryModel/techniquePart.png' };
                window.parent.iframeHeaderSet(vdata);
                window.callFunctionTrigger("RanderGantt", { ID: Selection_Data[0].ID, VersionNo: Selection_Data[0].VersionNo, WorkShopID: WorkShopID, ISMove: ISMove });

            });

            //工序详情
            $("body").delegate(".lmvt-do-active", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var Selection_Data = VersionSource.filter((item) => { return item.ID == wID });

                model.com.refreshTaskInfo(Selection_Data[0].ID, Selection_Data[0].VersionNo);
            });

            //重新排程
            $("body").delegate(".lmvt-do-info", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var Selection_Data = VersionSource.filter((item) => { return item.ID == wID });

                model.com.refreshTaskInfo(Selection_Data[0].ID, Selection_Data[0].VersionNo);
            });

            //计划记录
            $("body").delegate("#zace-table-sendTable", "click", function () {

                $('.zacePlanTable').hide();
                $('.ganteTable').hide();
                $('.zacePlanTableRecord').show();

                model.com.refreshRecord();

            });
            $("body").delegate("#zace-table-return", "click", function () {

                $('.zacePlanTable').show();
                $('.ganteTable').hide();
                $('.zacePlanTableRecord').hide();


            });
            $("body").delegate("#zace-searchZApproval-levelZaceRecord", "click", function () {

                var $this = $(this),
                    value = $("#zace-search-levelRecord").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevelRecord-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevelRecord-tbody"), DataAllSearchRecord, value, "ID");
            });
            // $("body").delegate("#zace-searchAll-level", "click", function () {
            //     var default_value = {
            //         //OrderIDShow: mOrderIDShow,
            //         StartTime: mZaceStartTime,
            //         EndTime: mZaceEndTime,

            //     };
            //     $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


            //         if (!rst || $.isEmptyObject(rst))
            //             return;

            //         //default_value.Active = eval(rst.Active.toLowerCase());
            //         //mOrderIDShow = Number(rst.OrderIDShow);

            //         //mOrderIDShow = Number(rst.OrderIDShow);
            //         mZaceStartTime = $com.util.format('yyyy-MM-dd', rst.StartTime);
            //         mZaceEndTime = $com.util.format('yyyy-MM-dd', rst.EndTime);

            //         model.com.refreshRecord();

            //     }, TypeSource_Level));


            // });


            //导出 
            //  $("body").delegate("#zace-exportApproval-level", "click", function () {
            //     var $table = $(".table-partApproval"),
            //         fileName = "周计划.xls",
            //         Title = "周计划";
            //     var params = $com.table.getExportParams($table, fileName, Title);

            //     if (params.data.length < 1) {
            //         alert('请选择需要导出的数据！');
            //         return false;
            //     }

            //     model.com.postExportExcel(params, function (res) {
            //         var src = res.info.path;
            //         window.open(src);
            //     });



            // });
            $("body").delegate("#zace-exportApproval-level", "click", function () {
                if (!confirm("确定导出" + "周计划吗？")) {
                    return;
                }
                if (mVersionNo.length < 1) {
                    alert('无计划！');
                    return false;
                }
                // $com.util.deleteLowerProperty(DATABasicItem[0]);
                $com.app.loading('数据导出中...');
                model.com.exportReport({
                    VersionNo: mVersionNo,
                    Suffix: 'HXD',


                }, [function (res) {

                    window.open(res.info);

                    console.log('导出成功。。。。');
                    $com.app.loaded();
                }, function (res1) {


                    $com.app.loaded();
                }])



            });

            //zace-edit-zaceRefresh
            $("body").delegate("#zace-edit-zaceRefresh", "click", function () {
                model.com.refresh();
            });

            //Enter触发模糊查询事件
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var $this = $(this),
                        value = $("#zace-search-level").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-riskLevel-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-riskLevel-tbody"), TaskList, value, "ID");
                }
            });
            //查询
            $("body").delegate("#zace-searchZApproval-levelZace", "click", function () {

                var $this = $(this),
                    value = $("#zace-search-level").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), TaskList, value, "ID");
            });

            $("body").delegate("#zace-edit-level", "click", function () {
                if (!confirm("确定下达周计划吗？")) {
                    return;
                }
                $com.util.deleteLowerProperty(ZaceDataAll);
                model.com.auditAPSHistory({
                    data: ZaceDataAll,
                    OperateType: 7,
                    APSShiftPeriod: mAPSShiftPeriod
                }, function (res) {

                    alert("下达成功");
                    model.com.refresh();
                    //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                    //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                })




            });
            $("body").delegate("#zace-edit-submitAudit", "click", function () {
                if (!confirm("确定审批周计划吗？")) {
                    return;
                }
                $com.util.deleteLowerProperty(ZaceDataAll);
                model.com.auditAPSHistory({
                    data: ZaceDataAll,
                    OperateType: 3,
                    APSShiftPeriod: mAPSShiftPeriod
                }, function (res) {

                    alert("审批成功");
                    model.com.refresh();
                    //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                    //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                })

            });
            //zace-edit-submit
            $("body").delegate("#zace-edit-remove", "click", function () {
                if (!confirm("确定驳回周计划吗？")) {
                    return;
                }
                $com.util.deleteLowerProperty(ZaceDataAll);
                model.com.auditAPSHistory({
                    data: ZaceDataAll,
                    OperateType: 4,
                    APSShiftPeriod: mAPSShiftPeriod
                }, function (res) {

                    alert("驳回成功");
                    model.com.refresh();
                    //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                    //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                })




            });

            //zace-edit-submit
            $("body").delegate("#zace-edit-submit", "click", function () {
                if (!confirm("确定提交周计划吗？")) {
                    return;
                }
                // for (var i = 0; i < SelectData.length; i++) {

                //     $com.util.deleteLowerProperty(SelectData[i]);
                // }
                $com.util.deleteLowerProperty(ZaceDataAll);
                model.com.auditAPSHistory({
                    data: ZaceDataAll,
                    OperateType: 2,
                    APSShiftPeriod: mAPSShiftPeriod
                }, function (res) {

                    alert("提交成功");
                    model.com.refresh();
                    //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                    //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                })




            });


            //所有条件查询
            // $("body").delegate("#zace-searchAll-level", "click", function () {
            //     var default_value = {
            //         mStartTime: $com.util.format('yyyy-MM-dd', new Date(mStartTime)),
            //         mEndTime: $com.util.format('yyyy-MM-dd', new Date(mEndTime))
            //         // mAPSShiftPeriod: 6,

            //     };
            //     $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


            //         if (!rst || $.isEmptyObject(rst))
            //             return;

            //         //default_value.Active = eval(rst.Active.toLowerCase());
            //         mAPSShiftPeriod = 5;
            //         mStartTime = $com.util.format('yyyy-MM-dd', new Date(rst.mStartTime));
            //         mEndTime = $com.util.format('yyyy-MM-dd', new Date(rst.mEndTime));
            //         model.com.refresh();

            //         if (mAPSShiftPeriod == 6) {
            //             $('.zace-title').text('月计划记录');
            //         } else if (mAPSShiftPeriod == 5) {
            //             $('.zace-title').text('周计划记录');
            //         }
            //         // $com.table.filterByConndition($("#femi-riskLevelApprovalAll-tbody"), DATAAllBusiness, default_value, "ID");

            //     }, TypeSource_Level));


            // });
            $("body").delegate("#zace-edit-zaceRefreshRecord", "click", function () {

                model.com.refreshRecord();

            });

            window.setFunctionTrigger("LOCOHistoryPlanWeek", function (res) {

                wWorkShopID = res.WorkShopID;

                model.com.refreshNo();

            });

        },




        run: function () {

            wWorkShopID = Number(model.query.WorkShopID);
            //修程
            model.com.getFMCLine({ FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0 }, function (resP) {
                if (!resP)
                    return;

                $.each(resP.list, function (i, item) {
                    TypeSource_Level.LineID.push({
                        value: item.ID,
                        name: item.Name
                    });
                });
                //工位
                model.com.getFPCPart({ FactoryID: 0, BusinessUnitID: 0 }, function (resP) {
                    if (!resP)
                        return;

                    $.each(resP.list, function (i, item) {
                        TypeSource_Level.PartID.push({
                            value: item.ID,
                            name: item.Name
                        });
                    });
                    //订单
                    model.com.getOMSOrder({}, function (resP) {
                        if (!resP)
                            return;

                        $.each(resP.list, function (i, item) {
                            TypeSource_Level.OrderID.push({
                                value: item.ID,
                                name: item.OrderNo
                            });
                            if (item.Status != 8) {

                                if (item.PartNo.length < 1) {
                                    item.ZaceName = item.OrderNo;
                                } else {
                                    item.ZaceName = item.PartNo;
                                }
                                TypeSource_Level.OrderIDShow.push({
                                    value: item.ID,
                                    name: item.ZaceName
                                });
                            }
                        });


                        if (TypeSource_Level.OrderIDShow.length > 0) {
                            mOrderIDShow = TypeSource_Level.OrderIDShow[0].value;
                        }

                        $.each(window.parent._WorkShop, function (i, item) {
                            TypeSource_Level.WorkShopID.push({
                                name: item.Name,
                                value: item.ID
                            });
                        });

                        //model.com.refresh();

                        model.com.refreshNo();
                    });
                });
            });

        },


        com: {
            getAPSHistoryQuery: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskPart/Query",
                    $TYPE: "get",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            refreshRecord: function () {
                $com.app.loading('数据加载中...');
                model.com.getAPSHistoryQuery({ APSShiftPeriod: 5, StartTime: mZaceStartTime + ' 00:00:00', EndTime: mZaceEndTime + ' 23:59:59', OrderID: mOrderIDShow }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {

                        var Grade = $com.util.Clone(resP.list);

                        DataAll = $com.util.Clone(Grade);

                        $.each(Grade, function (i, item) {
                            item.StatusColorText = StatusColor[item.Status];
                            // item.EndTime = ($com.util.format('yyyy-MM-dd', new Date(item.EndTime).getTime() - 12 * 3600000));
                            // for (var p in item) {
                            //     if (!FORMATTRT_Level[p])
                            //         continue;
                            //     item[p] = FORMATTRT_Level[p](item[p]);
                            // }
                            // item.WID = i + 1;

                            // if ($com.util.format('yyyy-MM-dd', item.EndTime) == $com.util.format('yyyy-MM-dd', item.StartTime)) {

                            // } else {

                            item.EndTime = ($com.util.format('yyyy-MM-dd hh:mm:ss', new Date(item.EndTime).getTime() - 12 * 3600000));
                            // }


                            if ($com.util.format('yyyy-MM-dd hh:mm:ss', item.EndTime) < $com.util.format('yyyy-MM-dd hh:mm:ss', item.StartTime)) {
                                item.EndTime = item.StartTime;
                            }
                            // if ($com.util.format('hh', item.StartTime) < 12) {
                            //     item.StartTime = $com.util.format('yyyy-MM-dd', item.StartTime) + '(上午)';
                            // } else {
                            //     item.StartTime = $com.util.format('yyyy-MM-dd', item.StartTime) + '(下午)';
                            // }

                            // if ($com.util.format('hh', item.EndTime) < 12) {
                            //     item.EndTime = $com.util.format('yyyy-MM-dd', item.EndTime) + '(上午)';
                            // } else {
                            //     item.EndTime = $com.util.format('yyyy-MM-dd', item.EndTime) + '(下午)';
                            // }



                            for (var p in item) {

                                if (!FORMATTRT_Level[p])
                                    continue;
                                if (p == 'StartTime')
                                    continue;
                                if (p == 'EndTime')
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }
                            item.WID = i + 1;

                        });
                        DataAllSearchRecord = $com.util.Clone(Grade);
                        $("#femi-riskLevelRecord-tbody").html($com.util.template(Grade, HTML.TableMode));


                    }
                    $com.app.loaded();

                });

                //window.parent._zaceBusinessUnit = 1;
            },
            exportReport: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskPart/Export",
                    $TYPE: "get",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    console.log('导出。。。');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            refreshNo: function () {
                model.com.getSchedulingVersionAll({ WorkShopID: wWorkShopID, APSShiftPeriod: 5, StartTime: wStartTime, EndTime: wEndTime }, function (res) {

                    VersionData = $com.util.Clone(res.list);
                    VersionSource = $com.util.Clone(res.list);

                    $.each(VersionData, function (i, item) {
                        for (var p in item) {

                            if (!FORMATTRT_Level[p])
                                continue;
                            item[p] = FORMATTRT_Level[p](item[p]);
                        }
                        item.WID = i + 1;
                    });

                    $("#lmvt-version-tbody").html($com.util.template(VersionData, HTML.VersionMode));
                    model.com.refreshTaskInfo(VersionData[0].ID, VersionData[0].VersionNo)

                });
            },

            refreshTaskInfo: function (ID, VersionNo) {
                model.com.getSchedulingVersionInfo({ ID: ID, VersionNo: VersionNo }, function (res) {
                    if (res.info.TaskPartList.length > 0) {

                        TaskList = $com.util.Clone(res.info.TaskPartList);
                        TaskSource = $com.util.Clone(res.info.TaskPartList);

                        $.each(TaskList, function (i, item) {
                            for (var p in item) {

                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }
                            item.WID = i + 1;
                        });
                        $("#femi-riskLevel-tbody").html($com.util.template(TaskList, HTML.TableMode));
                        $(".lmvt-VersionNo").text(VersionNo);


                    }
                });
            },

            refresh: function () {
                $com.app.loading('数据加载中...');
                mVersionNo = '';



                model.com.getAPSHistory({ APSShiftPeriod: mAPSShiftPeriod, StartTime: mStartTime, EndTime: mEndTime }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var Grade = [];
                        DATABasic = [];
                        ZaceDataAll = [];

                        //审核数据
                        DataAllConfirm = [];

                        if (resP.list.length > 0) {
                            var Grade = $com.util.Clone(resP.list[resP.list.length - 1].APSTaskPartList);
                            DATABasic = $com.util.Clone(resP.list[resP.list.length - 1].APSTaskPartList);
                            ZaceDataAll = $com.util.Clone(resP.list[resP.list.length - 1]);

                            //审核数据
                            DataAllConfirm = $com.util.Clone(resP.list[resP.list.length - 1].APSTaskPartList);
                            mVersionNo = $com.util.Clone(resP.list[resP.list.length - 1].VersionNo);
                        }
                        for (var i = 0; i < Grade.length; i++) {
                            Grade[i].WID = i + 1;
                        }
                        DataAll = $com.util.Clone(Grade);

                        $.each(Grade, function (i, item) {
                            item.StatusColorText = StatusColor[item.Status];

                            // if ($com.util.format('yyyy-MM-dd', item.EndTime) == $com.util.format('yyyy-MM-dd', item.StartTime)) {

                            // } else {



                            for (var p in item) {

                                switch (item.Status) {
                                    case 1:
                                        item.ISAllowedText = "提交";
                                        item.ISAllowed = "lmvt-not-allowed-delete";
                                        break;
                                    case 9:
                                        item.ISAllowedText = "审核";
                                        item.ISAllowed = "lmvt-do-active";
                                        break;
                                    case 10:
                                        item.ISAllowedText = "下达";
                                        item.ISAllowed = "lmvt-do-active";
                                        break;
                                }

                                if (!FORMATTRT_Level[p])
                                    continue;
                                if (p == 'StartTime')
                                    continue;
                                if (p == 'EndTime')
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }
                            item.WID = i + 1;

                        });
                        DataAllSearch = $com.util.Clone(Grade);
                        $("#femi-riskLevel-tbody").html($com.util.template(Grade, HTML.TableMode));


                    }
                    $com.app.loaded();

                });

                //window.parent._zaceBusinessUnit = 1;
            },
            //查看工序列表
            getSchedulingVersionInfo: function (data, fn, context) {
                var d = {
                    $URI: "/SchedulingVersion/Info",
                    $TYPE: "get",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查看版本列表
            getSchedulingVersionAll: function (data, fn, context) {
                var d = {
                    $URI: "/SchedulingVersion/All",
                    $TYPE: "get",
                    $SERVER: "/MESAPS"
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
            getOMSOrder: function (data, fn, context) {
                var d = {
                    $URI: "/OMSOrder/All",
                    $TYPE: "get",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询产线列表
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
            //查询
            getFPCProduct: function (data, fn, context) {
                var d = {
                    $URI: "/FPCProduct/All",
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
            //查询
            getAPSHistory: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskPart/History",
                    $TYPE: "get",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //保存
            postAPSHistory: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskPart/TransmitTask",
                    $TYPE: "post",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //审核
            auditAPSHistory: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskPart/Audit",
                    $TYPE: "post",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //激活
            activeBusinessUnit: function (data, fn, context) {
                var d = {
                    $URI: "/BusinessUnit/Active",
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
        }
    }),

        model.init();


});