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


    var MaxHour = 999;
    var mType = 1;
    var mTaskPartID = 0;
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
    PositionTemp = {
        ID: 0,
        ProductID: 0,
        ProductNo: '',
        PartNo: '',

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
    var mShiftDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()); //时间

    ;
    HTML = {
        TableMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            //'<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',

            '<td data-title="PartNo" data-value="{{PartNo}}" >{{PartNo}}</td>',
            '<td data-title="LineID" data-value="{{LineID}}" >{{LineID}}</td>',
            '<td data-title="PartID" data-value="{{PartID}}" >{{PartID}}</td>',
            '<td data-title="StepID" data-value="{{StepID}}" >{{StepID}}</td>',
            '<td data-title="WorkHour" data-value="{{WorkHour}}" >{{WorkHour}}</td>',
            '<td data-title="ShiftID" data-value="{{ShiftID}}" >{{ShiftID}}</td>',
            '<td data-title="ReadyTimeText" data-value="{{ReadyTimeText}}" >{{ReadyTimeText}}</td>',
            '</tr>',
        ].join(""),
        TableModeList: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="PartID" data-value="{{PartID}}" >{{PartID}}</td>',
            '<td  style="display:none" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="PartNo" data-value="{{PartNo}}" >{{PartNo}}</td>',

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
            '<td data-title="StepID" data-value="{{StepID}}" >{{StepID}}</td>',
            '<td data-title="ShiftID" data-value="{{ShiftID}}" >{{ShiftID}}</td>',
            '<td data-title="OperatorID" data-value="{{OperatorID}}" >{{OperatorID}}</td>',
            '<td data-title="WorkHour" data-value="{{WorkHour}}" >{{WorkHour}}</td>',
            '<td data-title="ReadyTimeText" data-value="{{ReadyTimeText}}" >{{ReadyTimeText}}</td>',
            // '<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',

            '</tr>',
        ].join(""),

    };
    (function () {
        KEYWORD_Level_LIST = [
            "ProductID|车型|ArrayOne",
            "EmployerID|人员|Array",
            "WorkHour|工时",
            "LineID|修程|ArrayOne",
            "PartID|工位|ArrayOne",
            "StepID|工序|ArrayOne",
            "EmployerID|人员|Array",

            "OperatorID|操作员|ArrayOne",
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
            OperatorID: [],
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
                }, {
                    name: "完工",
                    value: 5
                },
                {
                    name: "暂停",
                    value: 7
                },
                {
                    name: "终止",
                    value: 8
                },],

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
                mType = 2;
                model.com.refreshList(mType);

            });


            $("body").delegate("#zace-carList", "click", function () {

                $("#zace-partList").show();
                $("#zace-carList").hide();
                mType = 1;
                model.com.refreshList(mType);

            });



            //查询
            $("body").delegate("#zace-searchZApproval-level-Search", "click", function () {

                var value = $("#zace-search-level").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllSearch, value, "ID");



            });

            $("body").delegate("#zace-searchZApproval-level-SearchZace", "click", function () {

                var value = $("#zace-search-levelZace").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-RecordLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-RecordLevel-tbody"), DataAllSearchRecord, value, "ID");



            });

            //修改
            $("body").delegate("#zace-edit-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }

                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }


                default_value = {
                    WorkHour: SelectData[0].WorkHour,
                }
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "工时调整", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;



                    model.com.postAPSStepTask({
                        APSTaskStepList: SelectData,
                        Hour: Number(rst.WorkHour),
                    }, function (res) {
                        alert("调整工时成功");
                        model.com.refresh();


                    })

                }, TypeSource_Level));





            });

            $("body").delegate("#femi-riskLevelList-tbody tr", "dblclick", function () {

                var $this = $(this);
                var $table = $this.closest("table");
                var WID = Number($this.find('td[data-title=ID]').attr('data-value'));
                var WName = $this.find('td[data-title=Name]').attr('data-value');

                mStepID = WID;


                model.com.refresh();

                return false;
            });

            //新增
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

                }, TypeSource_Level));


            });


            //zace-add-levelPro

            $("body").delegate("#zace-add-levelPro", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-RecordLevel-tbody"), "ID", DATABasicRecord);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;


                }

                default_value = {
                    WorkHour: SelectData[0].WorkHour,
                }
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "工时调整", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;



                    model.com.postSFCStepTask({
                        SFCTaskStepList: SelectData,
                        Hour: Number(rst.WorkHour),
                    }, function (res) {
                        alert("调整工时成功");
                        model.com.refreshRecord();


                    })

                }, TypeSource_Level));

            });

            $("body").delegate(".modal .modal-dialog  .femi-modal-item input[data-name=WorkHour]", "input propertchange", function () {
                if (this.value > MaxHour)
                    this.value = MaxHour;
            });

            $("body").delegate("#zace-open-level", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }


                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                mTaskPartID = SelectData[0].ID;



                $(".zzza").hide();
                $(".zzzc").hide();
                $(".zzzb").show();
                model.com.refreshRecord();


            });

            $("body").delegate("#zace-add-export", "click", function () {

                $(".zzza").show();
                $(".zzzc").show();
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
                                    TypeSource_Level.OperatorID.push({
                                        value: item.ID,
                                        name: item.Name
                                    });
                                });
                                model.com.refreshList(mType);
                            });

                        });
                    });

                });


            });


        },

        com: {

            refreshList: function (Type) {


                model.com.getCarStepList({ ShiftPeriod: 5 }, function (resP) {


                    var Grade = $com.util.Clone(resP.list);
                    for (var i = 0; i < Grade.length; i++) {
                        Grade[i].WID = i + 1;

                    }
                    $.each(Grade, function (i, item) {
                        for (var p in item) {
                            if (!FORMATTRT_Level[p])
                                continue;
                            item[p] = FORMATTRT_Level[p](item[p]);
                        }


                        item.WID = i + 1;
                    });
                    DataList = $com.util.Clone(Grade);

                    $("#femi-riskLevelList-tbody").html($com.util.template(Grade, HTML.TableModeList));


                });

            },
            refresh: function () {

                model.com.getAPSStepTask({ APSTaskPartID: mStepID, }, function (resP) {
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

                            item.ReadyTimeText = item.ReadyTime;
                            if (new Date(item.ReadyTime) < new Date('2010-1-1')) {
                                item.ReadyTimeText = '-';
                            }


                            item.WID = i + 1;
                        });
                        DataAllSearch = $com.util.Clone(Grade);
                        $("#femi-riskLevel-tbody").html($com.util.template(Grade, HTML.TableMode));


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

                model.com.getMonitorRecord({ TaskStepID: mTaskPartID }, function (resP) {
                    if (!resP)
                        return;
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

                            item.ReadyTimeText = item.ReadyTime;
                            if (new Date(item.ReadyTime) < new Date('2010-1-1')) {
                                item.ReadyTimeText = '-';
                            }

                            item.WID = i + 1;
                        });
                        DataAllSearchRecord = $com.util.Clone(Grade);
                        $("#femi-RecordLevel-tbody").html($com.util.template(Grade, HTML.TableRecordMode));




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
                    $URI: "/SFCTaskStep/All",
                    $TYPE: "get",
                    $SERVER: '/MESAPS'
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


            //查询任务
            getAPSStepTask: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskStep/All",
                    $TYPE: "get",
                    $SERVER: '/MESAPS'
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询任务
            getCarStepList: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskPart/All",
                    $TYPE: "get",
                    $SERVER: '/MESAPS'
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //保存工时
            postAPSStepTask: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskStep/AdjustHour",
                    $TYPE: "post",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //保存工时
            postSFCStepTask: function (data, fn, context) {
                var d = {
                    $URI: "/SFCTaskStep/AdjustHour",
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