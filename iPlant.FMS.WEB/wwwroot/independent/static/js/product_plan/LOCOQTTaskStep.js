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

    var mType = 1;
    var mStepID = -1;
    var mPartNo = "";
    var DATABasicRecord = [];
    var DataAllSearchRecord = [];
    var DataAllRecord = [];
    DATAAllBusiness = [];
    DATAAllBusinessC = [];
    DataAll = [];
    DATABasic = [];
    DataAllConfirmBasic = [];
    DataAllConfirmChange = [];
    DataAllConfirm = [];
    DataAllSearch = [];

    var mShiftDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()); //时间

    HTML = {
        TableMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            //'<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',

            '<td data-title="CarNumber" data-value="{{CarNumber}}" >{{CarNumber}}</td>',
            '<td data-title="LineName" data-value="{{LineName}}" >{{LineName}}</td>',
            '<td data-title="DoStationName" data-value="{{DoStationName}}" >{{DoStationName}}</td>',
            // '<td data-title="Description" data-value="{{Description}}" >{{Description}}</td>',
            '<td data-title="FirstItemName" data-value="{{FirstItemName}}" >{{FirstItemName}}</td>',
            '<td data-title="SeconfItemName" data-value="{{SeconfItemName}}" >{{SeconfItemName}}</td>',
            '<td data-title="ThirdItemName" data-value="{{ThirdItemName}}" >{{ThirdItemName}}</td>',
            '<td data-title="FourItemName" data-value="{{FourItemName}}" >{{FourItemName}}</td>',
            '<td data-title="FiveItemName" data-value="{{FiveItemName}}" >{{FiveItemName}}</td>',
            '<td  style="color:{{ColorText}}" data-title="DoPersonID" data-value="{{DoPersonID}}" >{{DoPersonID}}</td>',
            // '<td data-title="ReadyTime" data-value="{{ReadyTime}}" >{{ReadyTime}}</td>',
            '<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',
            '</tr>',
        ].join(""),
        TableModeList: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td  style="display:none" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',

            '</tr>',
        ].join(""),
        TableRecordMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            //'<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',

            '<td data-title="PartNo" data-value="{{PartNo}}" >{{PartNo}}</td>',
            '<td data-title="LineID" data-value="{{LineID}}" >{{LineID}}</td>',
            '<td data-title="PartID" data-value="{{PartID}}" >{{PartID}}</td>',
            // '<td data-title="StepID" data-value="{{StepID}}" >{{StepID}}</td>',
            '<td data-title="ShiftID" data-value="{{ShiftID}}" >{{ShiftID}}</td>',
            '<td data-title="Operator" data-value="{{Operator}}" >{{Operator}}</td>',
            '<td data-title="ReadyTime" data-value="{{ReadyTime}}" >{{ReadyTime}}</td>',
            // '<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',

            '</tr>',
        ].join(""),

    };
    (function () {
        KEYWORD_Level_LIST = [
            "ProductID|车型|ArrayOne",
            "EmployerID|人员|Array",
            "PartNo|车号",
            "LineID|修程|ArrayOne",
            "PartID|工位|ArrayOne",
            "StepID|工序|ArrayOne",
            "EmployerID|人员|Array",

            "OperatorList|人员|ArrayOne",
            "DoPersonID|人员|ArrayOne",
            "DepartureTime|离厂时间|DateTime",

            "Status|状态|ArrayOne",
            "ReadyTime|派工时间|DateTime",
            "EditTime|时间|DateTime",
            "ShiftDae|日期|Date",



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
            LineID: [],
            PartID: [],
            StepID: [],
            OperatorList: [],
            DoPersonID: [],
            Active: [
                {
                    name: "启用",
                    value: true
                }, {
                    name: "禁用",
                    value: false
                }
            ],
            Status: [
                {
                    name: "保存",
                    value: 0
                },
                {
                    name: "待处理",
                    value: 1
                }, {
                    name: "待评审",
                    value: 2
                }, {
                    name: "待填写",
                    value: 3
                }, {
                    name: "待审批",
                    value: 4
                },
                {
                    name: "审批中",
                    value: 5
                },
                {
                    name: "问题项已下发",
                    value: 6
                },
                {
                    name: "待互检",
                    value: 7
                },
                {
                    name: "待专检",
                    value: 8
                },
                {
                    name: "已专检",
                    value: 9
                },
                {
                    name: "待确认",
                    value: 10
                },
                {
                    name: "开工",
                    value: 11
                },
            ],

            ProductID: [],
            EmployerID: [],



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

            $("body").delegate("#zace-edit-refreshItem", "click", function () {

                model.com.refreshRecord();

            });

            $("body").delegate("#zace-edit-refresh", "click", function () {

                model.com.refresh();

            });



            $("body").delegate("#zace-partList", "click", function () {

                $("#zace-partList").hide();
                $("#zace-carList").show();
                $(".zaceProduct").hide();
                $(".zaceTextP").text('工序');
                mType = 2;
                model.com.refreshList(mType);
                model.com.refresh();

            });


            $("body").delegate("#zace-carList", "click", function () {

                $("#zace-partList").show();
                $("#zace-carList").hide();
                $(".zaceProduct").hide();
                $(".zaceTextP").text('车号');
                mType = 1;
                model.com.refreshList(mType);
                model.com.refresh();

            });

            //Enter触发模糊查询事件
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var value = $("#zace-search-level").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-riskLevel-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllSearch, value, "ID");
                }
            });

            //查询
            $("body").delegate("#zace-searchZApproval-level-Search", "click", function () {

                var value = $("#zace-search-level").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllSearch, value, "ID");



            });
            //Enter触发模糊查询事件
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var value = $("#zace-search-levelZace").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-RecordLevel-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-RecordLevel-tbody"), DataAllSearchRecord, value, "ID");
                }
            });

            $("body").delegate("#zace-searchZApproval-level-SearchZace", "click", function () {

                var value = $("#zace-search-levelZace").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-RecordLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-RecordLevel-tbody"), DataAllSearchRecord, value, "ID");



            });
            $("body").delegate("#femi-riskLevel-tbody tr", "dblclick", function () {

                var $this = $(this);
                var WID = Number($this.find('td[data-title=ID]').attr('data-value'));

                var _listZace = [];
                var _index = 0;
                for (var i = 0; i < DataAll.length; i++) {
                    $com.util.deleteLowerProperty(DataAll[i]);

                    if (WID == DataAll[i].ID) {
                        if (DataAll[i].Status != 6) {
                            alert("请选择状态为问题项已下发的数据!");
                            return false;
                        }
                        _listZace.push(DataAll[i]);
                        _index = i;
                    };

                }
                TypeSource_Level.DoPersonID = [];
                model.com.getPGEmployeeList({

                    APSTaskStepID: WID,


                }, function (res) {

                    $.each(res.SourceList, function (i, item) {
                        TypeSource_Level.DoPersonID.push({
                            value: item.ID,
                            name: item.Name
                        });
                    });

                    var default_value = {
                        DoPersonID: DataAll[_index].DoPersonID,

                    };

                    $("body").append($com.modal.show(default_value, KEYWORD_Level, "选择要派工的人员", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;


                        // var _list = [];
                        // for (var index = 0; index < rst.EmployerID.length; index++) {
                        //     _list.push(Number(rst.EmployerID[index]));

                        // }
                        // DataAll[_index].OperatorList = _list;
                        // DataAll[_index].Operators = FORMATTRT_Level['OperatorList'](DataAll[_index].OperatorList);



                        // var _dataSel=[];
                        // _dataSel.push(DataAll[_index]);

                        if (Number(rst.DoPersonID) < 1) {
                            return false;
                        }

                        $com.util.deleteLowerProperty(DataAll[_index]);

                        model.com.savePersonList({
                            data: DataAll[_index],
                            PersonID:Number(rst.DoPersonID)
        
                        }, function (res) {

                            model.com.refresh();


                        })

                        // Grade = $com.util.Clone(DataAll);
                        // $.each(Grade, function (i, item) {
                        //     for (var p in item) {
                        //         if (!FORMATTRT_Level[p])
                        //             continue;
                        //         item[p] = FORMATTRT_Level[p](item[p]);
                        //     }
                        //     item.WID = i + 1;

                        // });
                        // DataAllSearch = $com.util.Clone(Grade);
                        // $("#femi-riskLevel-tbody").html($com.util.template(Grade, HTML.TableMode));


                    }, TypeSource_Level));


                });

                return false;
            });
            //派工
            $("body").delegate("#zace-edit-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }

                model.com.submitPGProblems({
                    data: SelectData,

                }, function (res) {
                    alert("派工成功");
                    model.com.refresh();


                })


                // var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                // if (!SelectData || !SelectData.length) {
                //     alert("请先选择一行数据再试！")
                //     return;
                // }
                // var _IDList = [];
                // for (var i = 0; i < SelectData.length; i++) {

                //     if (SelectData[i].Status!=2) {

                //         alert("请选择状态为下达的数据");
                //         return false;
                //     }

                //     $com.util.deleteLowerProperty(SelectData[i]);
                //     _IDList.push(SelectData[i].ID);
                // }

                // for (var i = 0; i < SelectData.length; i++) {
                //     $com.util.deleteLowerProperty(SelectData[i]);
                // }




                // TypeSource_Level.EmployerID = [];
                // model.com.getSelectEmployeeList({

                //     APSTaskStepIDList: _IDList,
                //     ShiftDate: mShiftDate,

                // }, function (res) {

                //     $.each(res.list, function (i, item) {
                //         TypeSource_Level.EmployerID.push({
                //             value: item.ID,
                //             name: item.Name
                //         });
                //     });

                //     var default_value = {
                //         EmployerID: 0,

                //     };

                //     $("body").append($com.modal.show(default_value, KEYWORD_Level, "选择要派工的人员", function (rst) {
                //         //调用修改函数
                //         if (!rst || $.isEmptyObject(rst))
                //             return;


                //         var _list = [];
                //         for (var index = 0; index < rst.EmployerID.length; index++) {
                //             _list.push(Number(rst.EmployerID[index]));

                //         }
                //         //alert(SelectData[0].CreateTime instanceof Date);
                //         model.com.postAPSStepTask({
                //             APSTaskStepIDList: _IDList,
                //             PersonIDList: _list,
                //             ShiftDate: mShiftDate,
                //         }, function (res) {
                //             alert("派工成功");
                //             model.com.refresh();
                //             //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                //             //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                //         })

                //     }, TypeSource_Level));


                // });





            });


            //修改
            $("body").delegate("#zace-delete-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }

                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                if (SelectData[0].Status != 2) {

                    alert("请选择状态为下达的数据");
                    return false;
                }


                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }




                TypeSource_Level.EmployerID = [];
                model.com.getPGEmployeeList({

                    APSTaskStepID: SelectData[0].ID,


                }, function (res) {


                    var _IDList = [];
                    for (var i = 0; i < res.list.length; i++) {

                        $com.util.deleteLowerProperty(res.list[i]);
                        _IDList.push(res.list[i].ID);
                    }

                    $.each(res.SourceList, function (i, item) {
                        TypeSource_Level.EmployerID.push({
                            value: item.ID,
                            name: item.Name
                        });
                    });

                    var default_value = {
                        EmployerID: _IDList,

                    };

                    $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;


                        var _list = [];
                        for (var index = 0; index < rst.EmployerID.length; index++) {
                            _list.push(Number(rst.EmployerID[index]));

                        }
                        //alert(SelectData[0].CreateTime instanceof Date);
                        model.com.postPGAPSStepTask({
                            APSTaskStepID: SelectData[0].ID,
                            PersonIDList: _list,
                            ShiftDate: mShiftDate,
                        }, function (res) {
                            alert("修改成功");
                            model.com.refresh();
                            //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                            //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                        })

                    }, TypeSource_Level));


                });





            });


            //查询
            $("body").delegate("#zace-add-level", "click", function () {

                var default_value = {
                    ShiftDae: mShiftDate,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    //default_value.Active = eval(rst.Active.toLowerCase());

                    mShiftDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.ShiftDae));

                    model.com.refreshList(mType);
                    model.com.refresh();

                }, TypeSource_Level));


            });


            //zace-add-levelPro
            //新增
            $("body").delegate("#zace-add-levelPro", "click", function () {

                var default_value = {
                    ShiftDae: mShiftDate,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    //default_value.Active = eval(rst.Active.toLowerCase());

                    mShiftDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.ShiftDae));

                    model.com.refreshRecord();
                    model.com.refresh();
                }, TypeSource_Level));


            });

            $("body").delegate("#zace-open-level", "click", function () {

                $(".zzza").hide();
                $(".zzzc").hide();
                $(".zzzb").show();
                model.com.refreshRecord();
                model.com.refresh();

            });

            $("body").delegate("#zace-add-export", "click", function () {

                $(".zzza").show();
                $(".zzzc").hide();
                $(".zzzb").hide();
                model.com.refresh();



            });

            //车间
            $("body").delegate("#zace-audit-workshop", "click", function () {
                var vdata = { 'header': '工厂设置', 'href': './factory_model/FMCFactorySetting.html', 'id': 'FMCFactorySetup', 'src': './static/images/menu/manageBOM.png' };
                window.parent.iframeHeaderSet(vdata);

            });

        },




        run: function () {

            model.com.getFPCProduct({ ProductTypeID: 0, BusinessUnitID: 0 }, function (resP) {
                if (!resP)
                    return;

                $.each(resP.list, function (i, item) {
                    TypeSource_Level.ProductID.push({
                        value: item.ID,
                        name: item.ProductName
                    });
                });

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
                    // 工位
                    model.com.getFPCPart({ FactoryID: 0, BusinessUnitID: 0 }, function (resP) {
                        if (!resP)
                            return;

                        $.each(resP.list, function (i, item) {
                            TypeSource_Level.PartID.push({
                                value: item.ID,
                                name: item.Name
                            });
                        });
                        // 工序
                        model.com.getFPCPartPoint({ FactoryID: 0, BusinessUnitID: 0, ProductTypeID: 0 }, function (resP) {
                            if (!resP)
                                return;

                            $.each(resP.list, function (i, item) {
                                TypeSource_Level.StepID.push({
                                    value: item.ID,
                                    name: item.Name
                                });
                            });
                            //人员
                            model.com.get({ active: 1 }, function (resP) {
                                if (!resP)
                                    return;

                                $.each(resP.list, function (i, item) {
                                    TypeSource_Level.OperatorList.push({
                                        value: item.ID,
                                        name: item.Name
                                    });
                                });
                                TypeSource_Level.DoPersonID = TypeSource_Level.OperatorList;
                                model.com.refresh();
                            });

                        });
                    });

                });


            });


        },

        com: {


            refresh: function () {
                $com.app.loading('数据加载中...');
                model.com.getAPSStepTask({}, function (resP) {
                    // if (!resP){
                    // $com.app.loaded();
                    //     return;
                    // }
                    if (resP.list == null) {
                        $com.app.loaded();
                        return;
                    }

                    resP.list.sort(function (a, b) { return Number(a.Status) - Number(b.Status) });
                    if (resP && resP.list) {
                        var Grade = $com.util.Clone(resP.list);
                        DATABasic = $com.util.Clone(resP.list);

                        //
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
                            item.WID = i + 1;
                            if (item.IsDischarged) {
                                item.ColorText = 'green'
                            } else {
                                item.ColorText = 'black'
                            }

                            item.ItemList = item.Description.split('+|;|+');
                            switch (item.ItemList.length) {
                                case 1:
                                    item.FirstItemName = item.ItemList[0];
                                    item.SeconfItemName = '';
                                    item.ThirdItemName = '';
                                    item.FourItemName = '';
                                    item.FiveItemName = '';

                                    break;

                                case 2:
                                    item.FirstItemName = item.ItemList[0];
                                    item.SeconfItemName = item.ItemList[1];
                                    item.ThirdItemName = '';
                                    item.FourItemName = '';
                                    item.FiveItemName = '';
                                    break;
                                case 3:
                                    item.FirstItemName = item.ItemList[0];
                                    item.SeconfItemName = item.ItemList[1];
                                    item.ThirdItemName = item.ItemList[2];
                                    item.FourItemName = '';
                                    item.FiveItemName = '';
                                    break;
                                case 4:
                                    item.FirstItemName = item.ItemList[0];
                                    item.SeconfItemName = item.ItemList[1];
                                    item.ThirdItemName = item.ItemList[2];
                                    item.FourItemName = item.ItemList[3];
                                    item.FiveItemName = '';
                                    break;
                                case 5:
                                    item.FirstItemName = item.ItemList[0];
                                    item.SeconfItemName = item.ItemList[1];
                                    item.ThirdItemName = item.ItemList[2];
                                    item.FourItemName = item.ItemList[3];
                                    item.FiveItemName = item.ItemList[4];
                                    break;

                                default:
                                    item.FirstItemName = '';
                                    item.SeconfItemName = '';
                                    item.ThirdItemName = '';
                                    item.FourItemName = '';
                                    item.FiveItemName = '';
                                    break;
                            }

                        });
                        DataAllSearch = $com.util.Clone(Grade);
                        $("#femi-riskLevel-tbody").html($com.util.template(Grade, HTML.TableMode));
                        $com.app.loaded();

                    }

                });

                //window.parent._zaceBusinessUnit = 1;
            },


            get: function (data, fn, context) {
                var d = {
                    $URI: "/User/All",
                    $TYPE: "get",

                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
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
            refreshRecord: function () {
                $com.app.loading('数据加载中...');
                model.com.getMonitorRecord({ ShiftDate: mShiftDate }, function (resP) {
                    if (!resP) {
                        $com.app.loaded();
                        return;
                    }
                    if (resP && resP.list) {
                        var Grade = $com.util.Clone(resP.list);
                        DATABasicRecord = $com.util.Clone(resP.list);


                        for (var i = 0; i < Grade.length; i++) {
                            Grade[i].WID = i + 1;
                        }
                        DataAllRecord = $com.util.Clone(Grade);

                        $.each(Grade, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }
                            item.WID = i + 1;
                        });
                        DataAllSearchRecord = $com.util.Clone(Grade);
                        $("#femi-RecordLevel-tbody").html($com.util.template(Grade, HTML.TableRecordMode));
                        $com.app.loaded();



                    }

                });

                //window.parent._zaceBusinessUnit = 1;
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
            //查询记录
            getMonitorRecord: function (data, fn, context) {
                var d = {
                    $URI: "/SFCTaskStep/MonitorRecord",
                    $TYPE: "get",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //查询人员
            getSelectEmployeeList: function (data, fn, context) {
                var d = {
                    $URI: "/SFCTaskStep/SelectEmployeeList",
                    $TYPE: "post",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            submitPGProblems: function (data, fn, context) {
                var d = {
                    $URI: "/SFCTaskStep/SubmitPGProblems",
                    $TYPE: "post",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            savePersonList: function (data, fn, context) {
                var d = {
                    $URI: "/IPTPreCheckProblem/SavePGPerson",
                    $TYPE: "post",
                    $SERVER: '/MESQMS',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },


            //查询任务
            getAPSStepTask: function (data, fn, context) {
                var d = {
                    $URI: "/IPTPreCheckProblem/PGProblemList",
                    $TYPE: "get",
                    $SERVER: '/MESQMS',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //查询人员
            getPGEmployeeList: function (data, fn, context) {
                var d = {
                    $URI: "/SFCTaskStep/PGEmployeeList",
                    $TYPE: "get",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //保存
            postPGAPSStepTask: function (data, fn, context) {
                var d = {
                    $URI: "/SFCTaskStep/PGEmployeeUpdate",
                    $TYPE: "post",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },


            //查询任务
            getCarStepList: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskStep/CarStepList",
                    $TYPE: "get",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //保存
            postAPSStepTask: function (data, fn, context) {
                var d = {
                    $URI: "/SFCTaskStep/SubmitAll",
                    $TYPE: "post",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //保存
            saveAPSStepTask: function (data, fn, context) {
                var d = {
                    $URI: "/SFCTaskStep/SaveAll",
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