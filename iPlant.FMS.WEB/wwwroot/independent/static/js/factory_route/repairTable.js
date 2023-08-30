require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($alfie, $com) {
    var mFormatter_Search; //字段格式化对象
    var mDefault_Value_Search; //查询模态框对象
    var mKeyword_Search; //查询关键字
    var mKeyword_List_Search; //定义字段格式(用于表格字段转换)
    var mTypeSource_Search; //枚举对象(用于字段转换)
    var mCloneData; //克隆的数据源(用于模糊查询)
    var mHTML; //mHTML模板
    var mModelTemp; //全局数据模型
    var mData = []; //全局数据源
    var mDefault_Value_Modal; //模态框显示字段
    var workSpaceList;//台位列表
    mHTML = {
        TableNode_item: [
            '<tr data-color="">',
            '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{QID}}</td>',
            '<td style="min-width: 50px" data-title="Code" data-value="{{Code}}">{{Code}}</td>',
            '<td style="min-width: 50px" data-title="StationName" data-value="{{StationName}}">{{StationName}}</td>',
            '<td style="min-width: 50px" data-title="LineName" data-value="{{LineName}}">{{LineName}}</td>',
            '<td style="min-width: 50px" data-title="CustomerName" data-value="{{CustomerName}}">{{CustomerName}}</td>',
            '<td style="min-width: 50px" data-title="CarTypeName" data-value="{{CarTypeName}}">{{CarTypeName}}</td>',
            '<td style="min-width: 50px" data-title="CarNumber" data-value="{{CarNumber}}">{{CarNumber}}</td>',
            '<td style="min-width: 50px" data-title="SenderName" data-value="{{SenderName}}">{{SenderName}}</td>',
            '<td style="min-width: 50px" data-title="SendTime" data-value="{{SendTime}}">{{SendTime}}</td>',
            '<td style="min-width: 50px" data-title="IsDelivery" data-value="{{IsDelivery}}">{{IsDelivery}}</td>',
            '<td style="min-width: 50px" data-title="Status" data-value="{{Status}}">{{Status}}</td>',
            '</tr>',
        ].join(""),

        TableNode_detail: [
            '<tr data-color="">',
            '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td style="min-width: 50px" data-title="WID" data-value="{{WID}}">{{WID}}</td>',
            '<td style="min-width: 50px" data-title="Describe" data-value="{{Describe}}">{{Describe}}</td>',
            '<td style="min-width: 50px" data-title="WorkAreaName" data-value="{{WorkAreaName}}">{{WorkAreaName}}</td>',
            '<td style="min-width: 50px" data-title="TeamName" data-value="{{TeamName}}">{{TeamName}}</td>',

            // '<td style="min-width: 50px" data-title="CustomerName" data-value="{{CustomerName}}">{{CustomerName}}</td>',

            '<td style="min-width: 50px" data-title="ProcessName" data-value="{{ProcessName}}">{{ProcessName}}</td>',
            '<td style="min-width: 50px" data-title="PersonLiable" data-value="{{PersonLiable}}">{{PersonLiable}}</td>',
            '<td style="min-width: 50px" data-title="Signature" data-value="{{Signature}}">{{Signature}}</td>',
            '<td style="min-width: 50px" data-title="Result" data-value="{{Result}}">{{Result}}</td>',
            '<td style="min-width: 50px" data-title="InspectorName" data-value="{{InspectorName}}">{{InspectorName}}</td>',
            '<td style="min-width: 50px" data-title="Date" data-value="{{Date}}">{{Date}}</td>',
            '<td style="min-width: 50px" data-title="Remark" data-value="{{Remark}}">{{Remark}}</td>',
            '</tr>',
        ].join(""),
    }

    mModelTemp = {
        ID: 0,
        CarTypeID: 0,
        CarTypeName: "",
        CarNumber: "",
        LineID: 0,
        LineName: "",
        Type: 0,
        TypeName: 0,
        CustomerID: 0,
        CustomerName: 0,
        SenderID: 0,
        SenderName: 0,
        SendTime: $com.util.format("yyyy-MM-dd hh:mm:ss", new Date()),
        ApprovalID: 0,
        ApprovalName: 0,
        ApprovalTime: $com.util.format("yyyy-MM-dd hh:mm:ss", new Date()),
        Status: 1,
        RROTableBodyList: [],
    }
    //查询字段定义
    mDefault_Value_Search = {
        // 'StartTime': new Date(),
        // 'EndTime': new Date(),
    };
    //初始化字段模板
    (function () {
        mKeyword_List_Search = [
            "StationID|工位|ArrayOne",
            // "PartID|工序|ArrayOne",
            "LineID|修程|ArrayOne",
            "CustomerID|配属局段|ArrayOne",
            "CarTypeID|车型|ArrayOne",
            "CarName|车号|ArrayOne",
            "SenderID|检验员|ArrayOne",

            "StartTime|开始日期|Date",
            "EndTime|截至日期|Date",

            "IsDelivery|任务类型|ArrayOne",
            // "SenderName|发起人",
            "SendTime|发起时间|DateTime",
            "ApprovalName|审批人",
            "ApprovalTime|审批时间|DateTime",
            "Status|状态|Array",
        ];

        mDefault_Value_Modal = {
            'CarNumber': 0,
            'IsDelivery': 0,
        };

        mKeyword_Search = {};

        mFormatter_Search = {};


        mTypeSource_Search = {
            SenderID: [
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
            CarName: [
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

    model = $com.Model.create({
        name: '返修单',

        type: $com.Model.MAIN, //主方法

        configure: function () {
            this.run();
        },

        events: function () {

            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var $this = $("#alfie-search-Device-item"),
                        value = $("#alfie-search-Device-item").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-Device-tbody-item").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-Device-tbody-item"), mCloneData, value, "ID");
                }
            });


            //条件查询
            $("body").delegate("#alfie-Device-search", "click", function () {
                var $this = $("#alfie-search-Device-item"),
                    value = $("#alfie-search-Device-item").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-Device-tbody-item").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-Device-tbody-item"), mCloneData, value, "ID");
            });
            //返修单表新增
            $("body").delegate("#alfie-add-level", "click", function () {

                $("body").append($com.modal.show(mDefault_Value_Modal, mKeyword_Search, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    model.com.getOMSOrderRF({
                        CustomerID: -1, LineID: -1, ProductID: -1, PartNo: rst.CarNumber, StartTime: "2000-1-1", EndTime: "2000-1-1"
                    }, function (res) {
                        wOrder = res.list;
                        mModelTemp = {
                            ID: 0,
                            CarTypeID: 0,
                            CarTypeName: "",
                            CarNumber: "",
                            LineID: 0,
                            LineName: "",
                            Type: 0,
                            TypeName: "",
                            CustomerID: 0,
                            CustomerName: "",
                            SenderID: 0,
                            SenderName: "",
                            SendTime: $com.util.format("yyyy-MM-dd hh:mm:ss", new Date()),
                            ApprovalID: 0,
                            ApprovalName: "",
                            ApprovalTime: $com.util.format("yyyy-MM-dd hh:mm:ss", new Date()),
                            Status: 1,
                            RROTableBodyList: [],
                        }
                        mModelTemp.CarNumber = rst.CarNumber;
                        mModelTemp.Type = Number(rst.Type);

                        mModelTemp.CustomerID = Number(res.list[0].BureauSectionID);
                        mModelTemp.LineID = Number(res.list[0].LineID);
                        mModelTemp.CarTypeID = Number(res.list[0].ProductID);

                        model.com.SubmitTable({
                            data: mModelTemp
                        }, function (res) {
                            alert("新增成功");
                            model.com.refresh();
                        });
                    });


                }, mTypeSource_Search));
            });
            $("body").delegate("#femi-Device-tbody-item tr", "dblclick", function () {
                var $this = $(this);
                var WID = Number($this.find('td[data-title=ID]').attr('data-value'));
                ArrayInfo = [];
                for (var i = 0; i < mData.length; i++) {
                    if (mData[i].ID == WID) {
                        ArrayInfo.push(mData[i]);
                    }
                }
                $com.util.deleteLowerProperty(ArrayInfo[0]);
                model.com.QueryItemDis({
                    data: ArrayInfo[0]
                }, function (res) {
                    wList = res.list;
                    $(".zzzc").hide();
                    $(".zzza").show();
                    for (var i = 0; i < wList.length; i++) {
                        wList[i].WID = i + 1;
                        if (wList[i].Result == 1) {
                            wList[i].Result = "合格";
                        } else if (wList[i].Result == 2) {
                            wList[i].Result = "不合格";
                        } else if (wList[i].Result == 0) {
                            wList[i].Result = "无";
                        }
                    }
                    $("#femi-Device-tbody-detail").html($com.util.template(wList, mHTML.TableNode_detail));
                });

            });

            //多条件查询
            $("body").delegate("#alfie-search", "click", function () {
                var default_value = {
                    StationID: 0,
                    // PartID: 0,
                    LineID: 0,
                    CustomerID: 0,
                    CarTypeID: 0,
                    CarName: "",
                    SenderID: 0,
                    StartTime: $com.util.format("yyyy-MM-dd", new Date().getTime() - 30 * 24 * 3600 * 1000),
                    EndTime: $com.util.format("yyyy-MM-dd", new Date().getTime() + 24 * 3600 * 1000),
                    Status: [],
                    IsDelivery: 0,
                    OrderID: -1,
                };
                $("body").append($com.modal.show(default_value, mKeyword_Search, "查询", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    queryAll = {
                        StationID: Number(rst.StationID) == 0 ? -1 : Number(rst.StationID),
                        // PartID: Number(rst.PartID)==0?-1:Number(rst.PartID),
                        LineID: Number(rst.LineID) == 0 ? -1 : Number(rst.LineID),
                        CustomerID: Number(rst.CustomerID) == 0 ? -1 : Number(rst.CustomerID),
                        CarTypeID: Number(rst.CarTypeID) == 0 ? -1 : Number(rst.CarTypeID),
                        PartNo: rst.CarName == "0" ? "" : rst.CarName,
                        SendID: Number(rst.SenderID) == 0 ? -1 : Number(rst.SenderID),
                        StartTime: $com.util.format("yyyy-MM-dd hh:mm:ss", rst.StartTime),
                        EndTime: $com.util.format("yyyy-MM-dd hh:mm:ss", rst.EndTime),
                        StatusIDList: rst.Status,
                        IsDelivery: Number(rst.IsDelivery) == 0 ? -1 : Number(rst.IsDelivery),
                        OrderID: -1,
                    };
                    model.com.getTimeAll(queryAll, function (res) {
                        alert("查询成功！");
                        var wTimeAll = $com.util.Clone(res.list);
                        $.each(wTimeAll, function (i, item) {
                            for (var p in item) {
                                if (!mFormatter_Search[p])
                                    continue;
                                item[p] = mFormatter_Search[p](item[p]);

                            }
                        });
                        $("#femi-Device-tbody-item").html($com.util.template(wTimeAll, mHTML.TableNode_item));
                    });

                }, mTypeSource_Search));
            });
            //返修单表刷新
            $("body").delegate("#alfie-refresh-po", "click", function () {
                model.com.refresh();
            });
            //返修详情返回
            $("body").delegate("#zace-return-levelOrder", "click", function () {
                $(".zzzc").show();
                $(".zzza").hide();
            });
        },

        run: function () {
            $com.app.loading('数据加载中...');
            StartTime = $com.util.format("yyyy-MM-dd hh:mm:ss", new Date().getTime() - 30 * 24 * 3600 * 1000);
            EndTime = $com.util.format("yyyy-MM-dd hh:mm:ss", new Date().getTime() + 24 * 3600 * 1000);
            //所有订单
            model.com.getOMSOrderRF({
                CustomerID: -1, LineID: -1, ProductID: -1, PartNo: "", StartTime: "2000-1-1", EndTime: "2000-1-1"
            }, function (resYear) {
                $.each(resYear.list, function (i, item) {
                    //车号
                    mTypeSource_Search.CarName.push({
                        name: item.PartNo,
                        value: item.PartNo,
                        far: 0
                    });
                    // 车型
                    mTypeSource_Search.CarTypeID.push({
                        name: item.ProductNo,
                        value: item.ProductID,
                        far: 0
                    });
                    //修程
                    mTypeSource_Search.LineID.push({
                        name: item.LineName,
                        value: item.LineID,
                        far: 0
                    });
                    //配属局段
                    mTypeSource_Search.CustomerID.push({
                        name: item.BureauSection,
                        value: item.BureauSectionID,
                        far: 0
                    });
                });
                mTypeSource_Search.CarTypeID = model.com.unique(mTypeSource_Search.CarTypeID);
                mTypeSource_Search.LineID = model.com.unique(mTypeSource_Search.LineID);
                mTypeSource_Search.CustomerID = model.com.unique(mTypeSource_Search.CustomerID);
                model.com.getFPCPart({ FactoryID: 0, BusinessUnitID: 0 }, function (resS) {
                    $.each(resS.list, function (i, item) {
                        //工位
                        mTypeSource_Search.StationID.push({
                            name: item.Name,
                            value: item.ID,
                            far: 0
                        });
                    });
                    model.com.getFPCPartPoint({ FactoryID: 0, BusinessUnitID: 0, ProductTypeID: 0 }, function (resPartPoint) {
                        // $.each(resPartPoint.list, function (i, item) {
                        //     //工序
                        //     mTypeSource_Search.PartID.push({
                        //         name: item.Name,
                        //         value: item.ID,
                        //         far: 0
                        //     });
                        // });
                        model.com.getTimeAll({
                            StationID: -1, LineID: -1, CustomerID: -1, CarTypeID: -1, PartNo: "",
                            SendID: -1, StatusIDList: [], StartTime: StartTime, EndTime: EndTime, IsDelivery: -1, OrderID: -1
                        }, function (res) {
                            $.each(res.list, function (i, item) {
                                //检验员
                                mTypeSource_Search.SenderID.push({
                                    name: item.SenderName,
                                    value: item.SenderID,
                                    far: 0
                                });
                            });
                            mTypeSource_Search.SenderID = model.com.unique(mTypeSource_Search.SenderID);
                            model.com.refresh();
                        });
                    });
                });

                //获取修程
                // model.com.getFMCLine({ FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0 }, function (resL) {
                //     //TypeSource_Level.AuditorID.splice(1, TypeSource_Level.AuditorID.length - 1);
                //     $.each(resL.list, function (i, item) {
                //         TypeSource_Level.LineID.push({
                //             name: item.Name,
                //             value: item.ID,
                //             far: 0
                //         });
                //     });
                //       //局段列表
                //       model.com.getCustomer({ active: 2 }, function (resC) {
                //         $.each(resC.list, function (i, item) {
                //             TypeSource_Level.CustomerID.push({
                //                 name: item.CustomerName,
                //                 value: item.ID,
                //                 far: 0
                //             })
                //         });
                //         model.com.refresh();
                //     });
                // });

            });


        },

        com: {
            //刷新界面
            refresh: function () {
                $com.app.loading('数据加载中...');
                model.com.getTimeAll({
                    StationID: -1, LineID: -1, CustomerID: -1, CarTypeID: -1, PartNo: "",
                    SendID: -1, StatusIDList: [], StartTime: StartTime, EndTime: EndTime, IsDelivery: -1, OrderID: -1
                }, function (res) {
                    if (res && res.list) {
                        mData = $com.util.Clone(res.list);
                        //数据源字段模板转换
                        var wItem = $com.util.Clone(mData);
                        $.each(wItem, function (i, item) {
                            for (var p in item) {
                                if (!mFormatter_Search[p])
                                    continue;
                                item[p] = mFormatter_Search[p](item[p]);

                            }
                        });
                        for (var i = 0; i < wItem.length; i++) {
                            wItem[i].QID = i + 1;
                        }
                        mCloneData = $com.util.Clone(wItem);
                        $("#femi-Device-tbody-item").html($com.util.template(wItem, mHTML.TableNode_item));
                        $com.app.loaded();
                    }
                });
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

            //返修记录查询
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


            //获取返修任务显示项
            QueryItemDis: function (data, fn, context) {
                var d = {
                    $URI: "/RRO/QueryItemDis",
                    $TYPE: "Post",
                    $SERVER: "/MESWDW"
                };

                function err() {
                    $com.app.tip('新增或修改返修单失败，请检查网络!');
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
            //查询修程
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
            //局段列表
            getCustomer: function (data, fn, context) {
                var d = {
                    $URI: "/Customer/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
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
            //返修用时间段查询
            //  getTimeAllRRO: function (data, fn, context) {
            //     var d = {
            //         $URI: "/RRO/TimeAll",
            //         $TYPE: "Post",
            //         $SERVER: "/MESWDW"
            //     };

            //     function err() {
            //         $com.app.tip('获取失败，请检查网络');
            //     }

            //     $com.app.ajax($.extend(d, data), fn, err, context);
            // },
        }
    }),
        model.init();
});