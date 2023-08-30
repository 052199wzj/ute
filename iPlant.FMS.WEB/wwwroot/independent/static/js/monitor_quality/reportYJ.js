require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/paging'], function ($zace, $com, $page) {

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
        DataAllFactorySearch,
        BusinessUnitID,
        FactoryID,
        WorkShopID,
        HTML;
    WorkShopID = BusinessUnitID = FactoryID = 0;
    DataAll = [];
    DATABasic = [];
    DataAllConfirmBasic = [];
    DataAllConfirmChange = [];
    DataAllConfirm = [];
    DataAllFactorySearch = DataAllSearch = [];
    PositionTemp = {
        Active: 1,
        Auditor: window.parent.User_Info.Name,
        AuditorID: 0,
        AuditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        BusinessUnitID: 0,
        BusinessUnit: "",
        Code: "",
        CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Creator: window.parent.User_Info.Name,
        CreatorID: 0,
        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Editor: window.parent.User_Info.Name,
        EditorID: 0,
        ERPID: 0,
        Factory: "",
        FactoryID: 1,
        ID: 0,
        Name: "",
        ProductType: "",
        ProductTypeID: 0,
        Status: 3,
        StatusText: "",
    };


    HTML = {
        TableMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  style="display:none" data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td data-title="PartNo" data-value="{{PartNo}}" >{{PartNo}}</td>',
            '<td data-title="CustomerName" data-value="{{CustomerName}}" >{{CustomerName}}</td>',
            '<td data-title="LineName" data-value="{{LineName}}" >{{LineName}}</td>',
            '<td data-title="Product" data-value="{{Product}}" >{{Product}}</td>',
            '<td data-title="Creator" data-value="{{Creator}}" >{{Creator}}</td>',
            '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
            '<td data-title="Auditor" data-value="{{Auditor}}" >{{Auditor}}</td>',
            '<td data-title="AuditTime" data-value="{{AuditTime}}" >{{AuditTime}}</td>',
            '<td data-title="StatusText" data-value="{{StatusText}}" >{{StatusText}}</td>',

            '</tr>',
        ].join(""),

        TableModeItem: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  style="display:none" data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td data-title="CarNumber" data-value="{{CarNumber}}" >{{CarNumber}}</td>',
            '<td data-title="ItemName" data-value="{{ItemName}}" >{{ItemName}}</td>',
            // '<td data-title="Description" data-value="{{Description}}" >{{Description}}</td>',
            '<td data-title="FirstItemName" data-value="{{FirstItemName}}" >{{FirstItemName}}</td>',
            '<td data-title="SeconfItemName" data-value="{{SeconfItemName}}" >{{SeconfItemName}}</td>',
            '<td data-title="ThirdItemName" data-value="{{ThirdItemName}}" >{{ThirdItemName}}</td>',
            '<td data-title="FourItemName" data-value="{{FourItemName}}" >{{FourItemName}}</td>',
            '<td data-title="FiveItemName" data-value="{{FiveItemName}}" >{{FiveItemName}}</td>',
            '<td data-title="Details" data-value="{{Details}}" >{{Details}}</td>',
            '<td data-title="SopDetail" data-value="{{SopDetail}}" >{{SopDetail}}</td>',
            '<td data-title="DoStationName" data-value="{{DoStationName}}" >{{DoStationName}}</td>',
            '<td data-title="CraftName" data-value="{{CraftName}}" >{{CraftName}}</td>',
            '<td data-title="CarftTime" data-value="{{CarftTime}}" >{{CarftTime}}</td>',


            '</tr>',
        ].join(""),
        TableLineMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
            '<td data-title="Code" data-value="{{Code}}" >{{Code}}</td>',
            '<td data-title="WorkShop" data-value="{{WorkShop}}" >{{WorkShop}}</td>',

            '</tr>',
        ].join(""),


    },
        (function () {
            KEYWORD_Level_LIST = [

                "Status|状态|ArrayOne",
                "CreateTime|时间|DateTime",
                "AuditTime|时间|DateTime",
                "StartDate|开始时间|Date",
                "EndDate|开始时间|Date",
                "CarftTime|时间|DateTime",


            ];
            KEYWORD_Level = {};
            FORMATTRT_Level = {};

            DEFAULT_VALUE_Level = {
                Name: "",
                Code: "",
            };

            TypeSource_Level = {

                Status: [

                    {
                        name: "无报告",
                        value: 0
                    }, {
                        name: "保存",
                        value: 1
                    }, {
                        name: "待审",
                        value: 2
                    }, {
                        name: "已审核",
                        value: 3
                    }, {
                        name: "已退回",
                        value: 4
                    }, {
                        name: "撤回",
                        value: 5
                    }, {
                        name: "关闭",
                        value: 6
                    },],



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
        name: '预检报告',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            $("body").delegate("#zace-refresh-po", "click", function () {

                model.com.refresh();

            });
            //导出 
            $("body").delegate("#zace-exportApproval-level", "click", function () {
                var $table = $(".table-partApproval"),
                    fileName = "预检报告.xls",
                    Title = "预检报告";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });

            });

            //创建报告
            $("body").delegate("#zace-active-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "WID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }

                for (var i = 0; i < SelectData.length; i++) {

                    if (SelectData[i].Status != 0) {
                        alert('请检查数据，选择无报告的数据！')
                    }

                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                if (!confirm("已选择" + SelectData.length + "条数据，确定生成报告吗？")) {
                    return;
                }


                model.com.createReport({
                    OrderID: SelectData[0].OrderID

                }, function (res) {
                    alert("生成报告成功");
                    model.com.refresh();


                })




            });


            //工序库启用
            $("body").delegate("#zace-active-ToAudit", "click", function () {
                // 、var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "WID", DataAll);

                // if (!SelectData || !SelectData.length) {
                //     alert("请先选择一行数据再试！")
                //     return;
                // }


                for (var i = 0; i < DATABasicItem.length; i++) {

                    // if (SelectData[i].Status != 0) {
                    //     alert('请检查数据，选择无报告的数据！')
                    // }

                    $com.util.deleteLowerProperty(DATABasicItem[i]);
                }
                if (!confirm("确定提交+" + DATABasicItem[0].PartNo + "的预检报告吗？")) {
                    return;
                }


                model.com.postReport({
                    data: DATABasicItem,
                    OperateType: 2

                }, function (res) {
                    alert("提交报告成功");

                    model.com.refreshInfo(mReportID);


                })




            });


            //工序库启用
            $("body").delegate("#zace-active-Audited", "click", function () {
                // 、var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "WID", DataAll);

                // if (!SelectData || !SelectData.length) {
                //     alert("请先选择一行数据再试！")
                //     return;
                // }

                if (DATABasicItem[0].Status != 2) {
                    alert('请操作待审批的报告！')
                }
                for (var i = 0; i < DATABasicItem.length; i++) {

                    // if (SelectData[i].Status != 0) {
                    //     alert('请检查数据，选择无报告的数据！')
                    // }

                    $com.util.deleteLowerProperty(DATABasicItem[i]);
                }
                if (!confirm("确定审批+" + DATABasicItem[0].PartNo + "的预检报告吗？")) {
                    return;
                }


                model.com.postReport({
                    data: DATABasicItem,
                    OperateType: 3

                }, function (res) {
                    alert("审批报告成功");


                    model.com.refreshInfo(mReportID);


                })




            });

            $("body").delegate("#zace-active-Reject", "click", function () {
                // 、var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "WID", DataAll);

                // if (!SelectData || !SelectData.length) {
                //     alert("请先选择一行数据再试！")
                //     return;
                // }

                if (DATABasicItem[0].Status != 3) {
                    alert('请操作待审批的报告！')
                }
                for (var i = 0; i < DATABasicItem.length; i++) {

                    // if (SelectData[i].Status != 0) {
                    //     alert('请检查数据，选择无报告的数据！')
                    // }

                    $com.util.deleteLowerProperty(DATABasicItem[i]);
                }
                if (!confirm("确定驳回+" + DATABasicItem[0].PartNo + "的预检报告吗？")) {
                    return;
                }


                model.com.postReport({
                    data: DATABasicItem,
                    OperateType: 4

                }, function (res) {
                    alert("驳回报告成功");
                    model.com.refresh();


                })




            });



            //zace-searchZall-open
            $("body").delegate("#zace-searchZall-open", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "WID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }

                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }

                if (SelectData[0].ID == 0) {
                    alert('未生成报告，无详情！');
                    return false;
                }


                $('.zzza').hide();
                $('.zzzItem').show();
                mReportID = SelectData[0].ID;

                model.com.refreshInfo(SelectData[0].ID);



            });

            //
            $("body").delegate("#zace-active-ToReport", "click", function () {



                $('.zzza').show();
                $('.zzzItem').hide();

                model.com.refresh();



            });


            $("body").delegate("#zace-searchZall-level", "click", function () {
                var default_value = {
                    StartDate: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(mStartDate)),
                    EndDate: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(mEndDate)),

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    mStartDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.StartDate));
                    mEndDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.EndDate));


                    model.com.refresh();

                }, TypeSource_Level));


            });

            //Enter触发模糊查询事件
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var
                        value = $("#zace-search-level").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-riskLevel-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "WID");
                }
            });
            //
            $("body").delegate("#zace-searchZall-levelZace", "click", function () {

                var
                    value = $("#zace-search-level").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "WID");



            });
            $("body").delegate("#zace-active-ExportReportZa", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "WID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }

                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！")
                    return;
                }
                $com.app.loading('数据加载中...');
             
                model.com.exportReport({
                    OrderID: SelectData[0].OrderID,

                    
                }, function (res) {

                    window.open(res.info);

                    console.log('导出成功。。。。');
                    $com.app.loaded();
                })              
            });


            $("body").delegate("#zace-active-ExportReport", "click", function () {

                if (!confirm("确定导出+" + DATABasicItem[0].PartNo + "的预检报告吗？")) {
                    return;
                }

                $com.util.deleteLowerProperty(DATABasicItem[0]);
                $com.app.loading('数据加载中...');
                model.com.exportReport({
                    OrderID: DATABasicItem[0].OrderID,


                }, function (res) {

                    window.open(res.info);

                    console.log('导出成功。。。。');
                    $com.app.loaded();
                })



            });



        },




        run: function () {

            mStartDate = $com.util.format('yyyy-MM-dd ', new Date().getTime() - 14 * 24 * 3600000);
            mEndDate = $com.util.format('yyyy-MM-dd ', new Date().getTime() + 14 * 24 * 3600000);
            model.com.refresh();

        },

        com: {

            exportReport: function (data, fn, context) {
                var d = {
                    $URI: "/IPTPreCheckReport/ExportByOrderZip",
                    $TYPE: "get",
                    $SERVER: '/MESQMS',
                };

                function err() {
                    console.log('导出。。。');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            setMMM: function () {
                setTimeout(function () {
                    if (window.parent._zaceProductType && window.parent._zaceProductType == 1) {
                        model.com.getFPCProductType({ BusinessUnitID: 0 }, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {

                                //TypeSource_materialRecord.SupplierID = [];
                                TypeSource_Level.ProductTypeID.splice(1, TypeSource_Level.ProductTypeID.length - 1);
                                $.each(resW.list, function (i, item) {
                                    TypeSource_Level.ProductTypeID.push({
                                        name: item.Name,
                                        value: item.ID,
                                        far: item.BusinessUnitID
                                    });
                                });
                            }
                            window.parent._zaceProductType = 0;
                        });

                    }

                    if (window.parent._zaceBusinessUnit && window.parent._zaceBusinessUnit == 1) {
                        model.com.getBusinessUnit({}, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {
                                //TypeSource_materialRecord.SupplierID = [];
                                TypeSource_Level.BusinessUnitID.splice(1, TypeSource_Level.BusinessUnitID.length - 1);
                                $.each(resW.list, function (i, item) {
                                    TypeSource_Level.BusinessUnitID.push({
                                        name: item.Name,
                                        value: item.ID,
                                        far: 0
                                    });
                                });
                            }
                            window.parent._zaceBusinessUnit = 0;
                        });

                    }

                    model.com.setMMM();
                }, 500);

            },
            refresh: function () {

                $com.app.loading('数据加载中...');

                //申请
                model.com.getReport({ StartTime: mStartDate, EndTime: mEndDate }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {

                        $.each(resP.list, function (j, item_j) {

                            item_j.Product = item_j.PartNo.split("#")[0];
                            item_j.WID = j + 1;
                            for (var p in item_j) {
                                if (!FORMATTRT_Level[p])
                                    continue;

                                if (p == 'Status') {
                                    item_j.StatusText = FORMATTRT_Level[p](item_j[p]);
                                    continue;
                                }
                                item_j[p] = FORMATTRT_Level[p](item_j[p]);
                            }
                            item_j.CreateTimeText = item_j.CreateTime;
                            if (new Date(item_j.CreateTime) < new Date('2010-1-1')) {
                                item_j.CreateTimeText = '-';
                            }
                            item_j.AuditTimeText = item_j.AuditTime;
                            if (new Date(item_j.AuditTime) < new Date('2010-1-1')) {
                                item_j.AuditTimeText = '-';
                            }

                            if (item_j.Creator.length < 1) {
                                item_j.Creator = '-';
                            }
                            if (item_j.Auditor.length < 1) {
                                item_j.Auditor = '-';
                            }

                        });

                        var Grade = $com.util.Clone(resP.list);
                        DATABasic = $com.util.Clone(resP.list);

                        DataAll = $com.util.Clone(Grade);


                        // $.each(Grade, function (i, item) {
                        //     for (var p in item) {
                        //         if (!FORMATTRT_Level[p])
                        //             continue;
                        //         item[p] = FORMATTRT_Level[p](item[p]);
                        //     }
                        //     item.WID = i + 1;
                        // });
                        DataAllFactorySearch = $com.util.Clone(Grade);
                        $("#femi-riskLevel-tbody").html($com.util.template(Grade, HTML.TableMode));
                        //$page.getPage(Grade, "#femi-riskLevel-tbody", HTML.TableMode, ".table-part");
                        $com.app.loaded();
                    }

                });




            },

            refreshInfo: function (id) {

                $com.app.loading('数据加载中...');
                $('#zace-active-ExportReport').hide();
                $('#zace-active-Reject').hide();
                $('#zace-active-ToAudit').hide();
                $('#zace-active-Audited').hide();
                //申请
                model.com.getReportInfo({ ReportID: id }, function (resP) {
                    if (!resP)
                        return;

                    resP.list = [];
                    resP.list.push(resP.info);

                    for (var m = 0; m < resP.OperateList.length; m++) {
                        switch (resP.OperateList[m]) {
                            case 2:
                                $('#zace-active-ToAudit').show();
                                break;
                            case 3:
                                $('#zace-active-Audited').show();
                                break;
                            case 4:
                                $('#zace-active-Reject').show();
                                break;
                            default:
                                break;
                        }

                    }

                    if (resP.info.Status == 3) {
                        $('#zace-active-ExportReport').show();
                    }

                    if (resP && resP.list) {

                        var Grade = $com.util.Clone(resP.list);

                        DATABasicItem = $com.util.Clone(resP.list);

                        var _list = [];
                        var TempMode = {
                            ID: 0,//报告项                        
                            ItemID: 0,//工序
                            ProblemID: 0,//问题

                            CarNumber: '',
                            ItemName: '',
                            Description: '',
                            Details: '',
                            SopDetail: '',
                            DoStationName: '',
                            CraftName: '',
                            CarftTime: '',

                        }
                        $.each(resP.info.IPTPreCheckItemList, function (i, item) {


                            for (var m = 0; m < item.IPTProblemList.length; m++) {
                                var _mode = $com.util.Clone(TempMode);
                                item.WID = i + 1;

                                _mode.ItemName = item.ItemName;
                                _mode.ItemID = item.ItemID;
                                _mode.ID = item.ID;
                                _mode.ProblemID = item.IPTProblemList[m].ID;
                                _mode.CarNumber = item.IPTProblemList[m].CarNumber;
                                _mode.Description = item.IPTProblemList[m].Description;

                                item.ItemList = _mode.Description.split('+|;|+');
                                switch (item.ItemList.length) {
                                    case 1:
                                        _mode.FirstItemName = item.ItemList[0];
                                        _mode.SeconfItemName = '';
                                        _mode.ThirdItemName = '';
                                        _mode.FourItemName = '';
                                        _mode.FiveItemName = '';
    
                                        break;
    
                                    case 2:
                                        _mode.FirstItemName = item.ItemList[0];
                                        _mode.SeconfItemName = item.ItemList[1];
                                        _mode.ThirdItemName = '';
                                        _mode.FourItemName = '';
                                        _mode.FiveItemName = '';
                                        break;
                                    case 3:
                                        _mode.FirstItemName = item.ItemList[0];
                                        _mode.SeconfItemName = item.ItemList[1];
                                        _mode.ThirdItemName = item.ItemList[2];
                                        _mode.FourItemName = '';
                                        _mode.FiveItemName = '';
                                        break;
                                    case 4:
                                        _mode.FirstItemName = item.ItemList[0];
                                        _mode.SeconfItemName = item.ItemList[1];
                                        _mode.ThirdItemName = item.ItemList[2];
                                        _mode.FourItemName = item.ItemList[3];
                                        _mode.FiveItemName = '';
                                        break;
                                    case 5:
                                        _mode.FirstItemName = item.ItemList[0];
                                        _mode.SeconfItemName = item.ItemList[1];
                                        _mode.ThirdItemName = item.ItemList[2];
                                        _mode.FourItemName = item.ItemList[3];
                                        _mode.FiveItemName = item.ItemList[4];
                                        break;
    
                                    default:
                                        _mode.FirstItemName = '';
                                        _mode.SeconfItemName = '';
                                        _mode.ThirdItemName = '';
                                        _mode.FourItemName = '';
                                        _mode.FiveItemName = '';
                                        break;
                                }

                                _mode.Details = item.IPTProblemList[m].Details;

                                _mode.DoStationName = item.IPTProblemList[m].DoStationName;

                                _mode.CraftName = item.IPTProblemList[m].CraftName;

                                _mode.CarftTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(item.IPTProblemList[m].CarftTime));

                                _mode.SopDetail = item.IPTProblemList[m].IPTSOPList[0].Detail;

                                _list.push(_mode);

                            }


                        });
                        // });
                        DataAllFactorySearchItem = $com.util.Clone(_list);
                        $("#femi-riskLevelItem-tbody").html($com.util.template(_list, HTML.TableModeItem));
                        //$page.getPage(Grade, "#femi-riskLevel-tbody", HTML.TableMode, ".table-part");
                        $com.app.loaded();
                    }

                });




            },
            getReportInfo: function (data, fn, context) {
                var d = {
                    $URI: "/IPTPreCheckReport/Info",
                    $TYPE: "get",
                    $SERVER: '/MESQMS',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询报告
            getReport: function (data, fn, context) {
                var d = {
                    $URI: "/IPTPreCheckReport/AuditList",
                    $TYPE: "get",
                    $SERVER: '/MESQMS',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //审批报告
            postReport: function (data, fn, context) {
                var d = {
                    $URI: "/IPTPreCheckReport/Audit",
                    $TYPE: "post",
                    $SERVER: '/MESQMS',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //生成报告
            createReport: function (data, fn, context) {
                var d = {
                    $URI: "/IPTPreCheckReport/Create",
                    $TYPE: "post",
                    $SERVER: '/MESQMS',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //查询产品类型
            getFPCProductType: function (data, fn, context) {
                var d = {
                    $URI: "/FPCProductType/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //查询
            getFMCUserId: function (data, fn, context) {
                var d = {
                    $URI: "/Role/UserAllByFunctionID",
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