﻿require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($zace, $com) {

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

    mAPSShiftPeriod = 6;
    mStartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date());
    ;
    HTML = {
        TableMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            //'<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
        
        
            '<td data-title="OrderID" data-value="{{OrderID}}" >{{OrderID}}</td>',
            '<td data-title="LineID" data-value="{{LineID}}" >{{LineID}}</td>',
            '<td data-title="PartID" data-value="{{PartID}}" >{{PartID}}</td>',
            '<td data-title="PartNo" data-value="{{PartNo}}" >{{PartNo}}</td>',
            '<td data-title="StartTime" data-value="{{StartTime}}" >{{StartTime}}</td>',
            '<td data-title="EndTime" data-value="{{EndTime}}" >{{EndTime}}</td>',

            '<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',
            '</tr>',
        ].join(""),



    };
    (function () {
        KEYWORD_Level_LIST = [
            "ProductID|车型|ArrayOne",
            "OrderID|订单|ArrayOne",
            "LineID|修程|ArrayOne",
            "PartID|工位|ArrayOne",
            "PartNo|车号",


            "mStartTime|时间|Date",
            "mAPSShiftPeriod|计划|ArrayOne",
            "Status|状态|ArrayOne",
            "StartTime|时间|Date",
            "EndTime|时间|Date",

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
            Active: [
                {
                    name: "启用",
                    value: true
                }, {
                    name: "禁用",
                    value: false
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
                    value: 1
                }, {
                    name: "下达",
                    value: 2
                }, {
                    name: "已确认",
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
                    name: "驳回",
                    value: 9
                },
                {
                    name: "审批中",
                    value: 10
                },
                {
                    name: "审批完成",
                    value: 11
                },
            ],

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
            //修改
            $("body").delegate("#zace-edit-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {

                    $com.util.deleteLowerProperty(SelectData[i]);
                    // SelectData[i].Status = 2;
                }
                model.com.auditAPSHistory({
                    TaskList: SelectData,
                    OperateType: 2,
                    APSShiftPeriod: mAPSShiftPeriod
                }, function (res) {

                    alert("提交成功");
                    model.com.refresh();
                    //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                    //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                })





            });

            //修改
            $("body").delegate("#zace-edit-back", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {

                    $com.util.deleteLowerProperty(SelectData[i]);
                    // SelectData[i].Status = 2;
                }
                model.com.auditAPSHistory({
                    TaskList: SelectData,
                    OperateType: 3,
                    APSShiftPeriod: mAPSShiftPeriod
                }, function (res) {

                    alert("提交成功");
                    model.com.refresh();
                    //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                    //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                })





            });



            //所有条件查询
            $("body").delegate("#zace-searchAll-level", "click", function () {
                var default_value = {
                    mStartTime: $com.util.format('yyyy-MM-dd', new Date()),
                    mAPSShiftPeriod: 6,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    //default_value.Active = eval(rst.Active.toLowerCase());
                    mAPSShiftPeriod = Number(rst.mAPSShiftPeriod);
                    mStartTime = $com.util.format('yyyy-MM-dd', new Date(rst.mStartTime)),
                        model.com.refresh();

                    if (mAPSShiftPeriod == 6) {
                        $('.zace-title').text('月计划记录');
                    } else if (mAPSShiftPeriod == 5) {
                        $('.zace-title').text('周计划记录');
                    }
                    // $com.table.filterByConndition($("#femi-riskLevelApprovalAll-tbody"), DATAAllBusiness, default_value, "ID");

                }, TypeSource_Level));


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
                        });
                        model.com.refresh();
                    });
                });
            });

        },


        com: {
            refresh: function () {
//待审批 1  已审批2 
                model.com.getAuditTaskList({ APSShiftPeriod: mAPSShiftPeriod, ShiftDate: mStartTime, TagType: 1}, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var Grade = $com.util.Clone(resP.list);
                        DATABasic = $com.util.Clone(resP.list);

                        //审核数据
                        DataAllConfirm = $com.util.Clone(resP.list);
                        for (var i = 0; i < Grade.length; i++) {
                            Grade[i].WID = i + 1;
                        }
                        DataAll = $com.util.Clone(Grade);

                        $.each(Grade, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }
                            item.WID=i+1;
                        });
                        DataAllSearch = $com.util.Clone(Grade);
                        $("#femi-riskLevel-tbody").html($com.util.template(Grade, HTML.TableMode));


                    }

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
            getAuditTaskList: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskPart/AuditTaskList",
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
            //审核
            postAudit: function (data, fn, context) {
                var d = {
                    $URI: "/BusinessUnit/Audit",
                    $TYPE: "post"
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