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
        HTML;
    DATAAllBusiness = DATAAllBusinessC = [];
    DataAll = [];
    DATABasic = [];
    DataAllConfirmBasic = [];
    DataAllConfirmChange = [];
    DataAllConfirm = [];
    DataAllSearch = [];
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
    var StatusColor = ['black', 'black', '#fa1ff4c9', 'blue', '#a94442', 'green', 'red', '#f8391bc9', 'blue', '#e6c685', 'orange'];//'#00CCFF' 完工
    mAPSShiftPeriod = 6;
    mStartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date().getTime() - 7 * 24 * 3600000);
    mEndTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date().getTime() + 7 * 24 * 3600000);

    mOrderIDShow = 0;
    mZaceEndTime = $com.util.format('yyyy-MM-dd', new Date().getTime() + 7*24*3600000);
    mZaceStartTime = $com.util.format('yyyy-MM-dd', new Date().getTime()-15*24*3600000);


    mStationlist = [];//排程计划表
    mTableData = [];//排程计划表
    mApsList = [];
    mOrderList = [];
    HTML = {
        TableMode: [
            '<tr>',
            //'<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            //'<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td data-title="PartNo" data-value="{{PartNo}}" >{{PartNo}}</td>',
            '<td data-title="OrderID" data-value="{{OrderID}}" >{{OrderID}}</td>',
            '<td data-title="LineID" data-value="{{LineID}}" >{{LineID}}</td>',
            '<td data-title="PartID" data-value="{{PartID}}" >{{PartID}}</td>',

            '<td data-title="StartTime" data-value="{{StartTime}}" >{{StartTime}}</td>',
            '<td data-title="EndTime" data-value="{{EndTime}}" >{{EndTime}}</td>',

            '<td style="color:{{StatusColorText}}" data-title="Status" data-value="{{Status}}" >{{Status}}</td>',
            '</tr>',
        ].join(""),

        TableUserItemNode: [
            '<tr data-color="">',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            // '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="OrderNo" data-value="{{OrderNo}}" >{{OrderNo}}</td>',
            '<td data-title="Customer" data-value="{{Customer}}" >{{Customer}}</td>',
            '<td data-title="LineName" data-value="{{LineName}}" >{{LineName}}</td>',
            '<td data-title="ProductNo"  data-value="{{ProductNo}}" >{{ProductNo}}</td>',
            // '<td data-title="PartNo"  data-value="{{PartNo}}" >{{PartNo}}</td>',
            '<td data-title="PartNoText"  data-value="{{PartNoText}}" >{{PartNoText}}</td>',
            // '<td style="display:none" data-title="TaskLineID" data-value="{{TaskLineID}}" >{{TaskLineID}}</td>',


        ].join(""),

        thead: [
            '<tr>',
            '<th><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            // '<th data-order="ID"  style="min-width: 50px">序号</td>',
            '<th data-order="OrderNo" style="min-width: 50px" >工单号</td>',
            '<th data-order="Customer" style="min-width: 50px" >局段</td>',
            '<th data-order="LineName" style="min-width: 50px" >修程</td>',
            '<th data-order="ProductNo" style="min-width: 50px" >车型</td>',
            '<th data-order="PartNoText" style="min-width: 50px" >车号</td>',


        ].join(""),
        th: ['<th data-order="Station_{{ID}}" style="min-width: 50px" >{{Name}}</th>'].join(""),
        td: ['<td  class="edit-td" data-title="Station_{{ID}}" data-value="{{Station_{{ID}}}}" >{{Station_{{ID}}}}</td>',].join(""),


    };
    (function () {
        KEYWORD_Level_LIST = [
            "ProductID|车型|ArrayOne",
            "OrderID|订单|ArrayOne",
            "LineID|修程|ArrayOne",
            "PartID|工位|ArrayOne",
            "PartNo|车号",

            "OrderIDShow|台车|ArrayOne",
            "mStartTime|开始时间|Date",
            "mEndTime|结束时间|Date",
            "mAPSShiftPeriod|计划|ArrayOne",
            "Status|状态|ArrayOne",
            "StartTime|开始时间|Date",
            "EndTime|结束时间|Date",

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
            OrderIDShow: [],
            Active: [
                {
                    name: "启用",
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
                    name: "未排",
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

            //导出
            $("body").delegate("#zace-table-ganttExportRecord", "click", function () {
                var $table = $(".table-partApprovalRecord"),
                    fileName = "月计划记录.xls",
                    Title = "月计划记录";
                var params = $com.table.getExportParams($table, fileName, Title);

                if (params.data.length < 1) {
                    alert('请选择需要导出的数据！');
                    return false;
                }


                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });



            });


            //导出
            $("body").delegate("#zace-table-ganttExport", "click", function () {
                var $table = $(".table-day-export"),
                    fileName = "月计划表.xls",
                    Title = "月计划表";
                var params = $com.table.getExportParams($table, fileName, Title);

                if (params.data.length < 1) {
                    alert('请选择需要导出的数据！');
                    return false;
                }


                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });



            });
            //导出 
            //  $("body").delegate("#zace-exportApproval-level", "click", function () {
            //     var $table = $(".table-partApproval"),
            //         fileName = "月计划.xls",
            //         Title = "月计划";
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
                if (!confirm("确定导出" + "月计划吗？")) {
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
            $("body").delegate("#zace-edit-zaceRefreshRecord", "click", function () {

                model.com.refreshRecord();





            });
            $("body").delegate("#zace-edit-level", "click", function () {
                // var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                // if (!SelectData || !SelectData.length) {
                //     alert("请先选择数据再试！")
                //     return;
                // }
                // for (var i = 0; i < SelectData.length; i++) {

                //     $com.util.deleteLowerProperty(SelectData[i]);
                //     // SelectData[i].Status = 2;
                // }


                if (!confirm("确定下达月计划吗？")) {
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

            $("body").delegate("#zace-table-return", "click", function () {

                $('.zacePlanTable').show();
                $('.ganteTable').hide();
                $('.zacePlanTableRecord').hide();


            });

            $("body").delegate("#zace-table-sendTable", "click", function () {

                $('.zacePlanTable').hide();
                $('.ganteTable').hide();
                $('.zacePlanTableRecord').show();


                model.com.refreshRecord();

            });

            $("body").delegate("#zace-searchAll-level", "click", function () {
                var default_value = {
                    OrderIDShow: mOrderIDShow,
                    StartTime: mZaceStartTime,
                    EndTime: mZaceEndTime,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    //default_value.Active = eval(rst.Active.toLowerCase());
                    mOrderIDShow = Number(rst.OrderIDShow);

                    mOrderIDShow = Number(rst.OrderIDShow);
                    mZaceStartTime = $com.util.format('yyyy-MM-dd', rst.StartTime);
                    mZaceEndTime = $com.util.format('yyyy-MM-dd', rst.EndTime);



                    model.com.refreshRecord();

                }, TypeSource_Level));


            });




            $("body").delegate("#zace-table-ganttZace", "click", function () {

                $com.app.loading('数据加载中...');
                for (var k = 0; k < mApsList.length; k++) {

                    $com.util.deleteLowerProperty(mApsList[k]);
                }

                for (var k = 0; k < mOrderList.length; k++) {

                    $com.util.deleteLowerProperty(mOrderList[k]);
                }
                model.com.getTableData({

                    OrderList: mOrderList,

                    TaskPartList: mApsList,
                    Type: 1


                }, function (resW) {
                    if (resW && resW.OrderColumn) {

                        mStationlist = $com.util.Clone(resW.OrderColumn);
                        mTableData = $com.util.Clone(resW.TableInfoList);
                    }


                    $('.zacePlanTable').hide();
                    $('.ganteTable').show();
                    $('.zacePlanTableRecord').hide();

                    model.com.FullTemple(mTableData[0], mTableData, mStationlist);
                    $com.app.loaded();


                });







            });

            $("body").delegate("#zace-edit-submitAudit", "click", function () {
                if (!confirm("确定审批月计划吗？")) {
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
                if (!confirm("确定驳回月计划吗？")) {
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
                // var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                // if (!SelectData || !SelectData.length) {
                //     alert("请先选择一行数据再试！")
                //     return;
                // }
                if (!confirm("确定提交月计划吗？")) {
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
            //         mAPSShiftPeriod = 6;
            //         mStartTime = $com.util.format('yyyy-MM-dd', new Date(rst.mStartTime)),
            //             mEndTime = $com.util.format('yyyy-MM-dd', new Date(rst.mEndTime)),
            //             model.com.refresh();

            //         if (mAPSShiftPeriod == 6) {
            //             $('.zace-title').text('月计划记录');
            //         } else if (mAPSShiftPeriod == 5) {
            //             $('.zace-title').text('周计划记录');
            //         }
            //         // $com.table.filterByConndition($("#femi-riskLevelApprovalAll-tbody"), DATAAllBusiness, default_value, "ID");

            //     }, TypeSource_Level));


            // });

            //Enter触发模糊查询事件
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var $this = $(this),
                        value = $("#zace-search-level").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-riskLevel-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllSearch, value, "ID");
                }
            });
            //查询
            $("body").delegate("#zace-searchZApproval-levelZace", "click", function () {

                var $this = $(this),
                    value = $("#zace-search-level").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllSearch, value, "ID");



            });
            $("body").delegate("#zace-searchZApproval-levelZaceRecord", "click", function () {

                var $this = $(this),
                    value = $("#zace-search-levelRecord").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevelRecord-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevelRecord-tbody"), DataAllSearchRecord, value, "ID");



            });



        },




        run: function () {

          
        
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
                        model.com.refresh();
                    });
                });
            });

        },


        com: {
            FullTemple: function (data, list, stationList) {
                var C_list = [];
                var _list = [];

                var _data = $com.util.Clone(list);
                for (p in data) {

                    C_list.push({
                        key: p,
                        value: data[p]
                    });


                }
                for (var index = 1; index < _data.length; index++) {

                    $com.util.deleteLowerProperty(_data[index]);
                    _data[index].PartNoText = _data[index].PartNo.split('#')[1];
                    _list.push(_data[index]);


                }


                var ths = $com.util.template(stationList, HTML.th);
                var tds = $com.util.template(stationList, HTML.td);
                HTML.TableUserItemNode_F = HTML.TableUserItemNode + tds + " </tr>";
                HTML.thead_F = HTML.thead + ths + " </tr>";


                $(".part-plan-div>.table thead").html(HTML.thead_F);


                $.each(_list, function (i, item) {
                    for (var p in item) {
                        if (p.indexOf('Station') != -1) {
                            if ($com.util.format('yyyy-MM-dd', item[p]) < $com.util.format('yyyy-MM-dd', '2010-1-1')) {

                                item[p] = "/";
                            } else {
                                item[p] = ($com.util.format('MM-dd', new Date(item[p]).getTime() - 12 * 3600000));// + 12 * 3600000
                            }
                        }
                        // if (!FORMATTRT_LevelItem[p])
                        //     continue;
                        // item[p] = FORMATTRT_LevelItem[p](item[p]);
                    }
                });


                $(".part-plan-div>.table tbody").html($com.util.template(_list, HTML.TableUserItemNode_F));




            },
            getTableData: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskPart/TableList",
                    $TYPE: "post",
                    $SERVER: '/MESAPS'
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
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


                            mApsList = $com.util.Clone(DataAllConfirm);
                            mOrderList = $com.util.Clone(resP.list[resP.list.length - 1].OMSOrderList);
                        }

                        for (var i = 0; i < Grade.length; i++) {
                            Grade[i].WID = i + 1;

                        }
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

                            if ($com.util.format('hh', item.StartTime) < 12) {
                                item.StartTime = $com.util.format('yyyy-MM-dd', item.StartTime) + '(上午)';
                            } else {
                                item.StartTime = $com.util.format('yyyy-MM-dd', item.StartTime) + '(下午)';
                            }

                            if ($com.util.format('hh', item.EndTime) < 12) {
                                item.EndTime = $com.util.format('yyyy-MM-dd', item.EndTime) + '(上午)';
                            } else {
                                item.EndTime = $com.util.format('yyyy-MM-dd', item.EndTime) + '(下午)';
                            }



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
                        DataAllSearch = $com.util.Clone(Grade);
                        $("#femi-riskLevel-tbody").html($com.util.template(Grade, HTML.TableMode));


                    }
                    $com.app.loaded();

                });

                //window.parent._zaceBusinessUnit = 1;
            },

            refreshRecord: function () {
                $com.app.loading('数据加载中...');
            
                model.com.getAPSHistoryQuery({ APSShiftPeriod: 6, StartTime: mZaceStartTime+' 00:00:00', EndTime: mZaceEndTime+' 23:59:59',OrderID:mOrderIDShow }, function (resP) {
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
                                item.EndTime=item.StartTime;
                            }
                            if ($com.util.format('hh', item.StartTime) < 12) {
                                item.StartTime = $com.util.format('yyyy-MM-dd', item.StartTime) + '(上午)';
                            } else {
                                item.StartTime = $com.util.format('yyyy-MM-dd', item.StartTime) + '(下午)';
                            }

                            if ($com.util.format('hh', item.EndTime) < 12) {
                                item.EndTime = $com.util.format('yyyy-MM-dd', item.EndTime) + '(上午)';
                            } else {
                                item.EndTime = $com.util.format('yyyy-MM-dd', item.EndTime) + '(下午)';
                            }



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
            //查询任务
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
            //启用
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