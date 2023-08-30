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


    var DataAllDeal = [];  //处理单
    var DataAllSearchDeal = [];  //处理单
    var DATABasicRecord = [];
    var DepertList = [];//部门列表
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
        SendID: 0,
        SendTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        SecondDepartmentID: 0,
        IsOverArea: true,
        AreaID: 0,
        SecondAuditID: 0,
        SendAuditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        BeSecondAuditID: 0,
        BeSecondAuditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        SecondPersonID: 0,
        ValidDate: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        BeSecondDepartmentID: 0,
        Status: 0,
    };
    var mShiftDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()); //时间
    HTML = {
        TableMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  style="display: none;" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td data-title="BeSecondDepartment" data-value="{{BeSecondDepartment}}" >{{BeSecondDepartment}}</td>',
            '<td data-title="SecondPerson" data-value="{{SecondPerson}}" >{{SecondPerson}}</td>',
            '<td data-title="SecondDepartment" data-value="{{SecondDepartment}}" >{{SecondDepartment}}</td>',
            '<td data-title="ValidDateText" data-value="{{ValidDateText}}" >{{ValidDateText}}</td>',
            '<td data-title="SendTime" data-value="{{SendTime}}" >{{SendTime}}</td>',
            '<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',
            '</tr>',
        ].join(""),
        TableDealMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  style="display: none;" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td data-title="AreaName" data-value="{{AreaName}}" >{{AreaName}}</td>',
            '<td data-title="BeSecondDepartment" data-value="{{BeSecondDepartment}}" >{{BeSecondDepartment}}</td>',
            '<td data-title="SecondPerson" data-value="{{SecondPerson}}" >{{SecondPerson}}</td>',
            '<td data-title="SecondDepartment" data-value="{{SecondDepartment}}" >{{SecondDepartment}}</td>',
            '<td data-title="IsExclude" data-value="{{IsExclude}}" >{{IsExclude}}</td>',
            '<td data-title="ApplyValidDateText" data-value="{{ApplyValidDateText}}" >{{ApplyValidDateText}}</td>',
            '<td data-title="ValidDateText" data-value="{{ValidDateText}}" >{{ValidDateText}}</td>',
            '<td data-title="SendName" data-value="{{SendName}}" >{{SendName}}</td>',
            '<td data-title="SendTime" data-value="{{SendTime}}" >{{SendTime}}</td>',
            '<td data-title="BeSecondAuditor" data-value="{{BeSecondAuditor}}" >{{BeSecondAuditor}}</td>',
            '<td data-title="BeSecondAuditTimeText" data-value="{{BeSecondAuditTimeText}}" >{{BeSecondAuditTimeText}}</td>',
            '<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',

            '</tr>',
        ].join(""),

    };
    (function () {
        KEYWORD_Level_LIST = [
        
            "AreaID|被借工区|ArrayOne",

            "BeSecondDepartmentID|被借调班组|ArrayOne",
            "SecondPersonID|被借调人|ArrayOne",
            "SecondDepartmentID|借调班组|ArrayOne",
            "IsOverArea|是否跨工区|ArrayOne",

            "BeSecondAuditID|人|ArrayOne",
           
            "SendID|发起人|ArrayOne",
            "Status|状态|ArrayOne",
            "SendTime|时间|DateTime",
            "IsExclude|是否排他|ArrayOne",
            "ValidDate|截止时刻|DateTime",
            "BeSecondAuditTime|时间|DateTime",
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
            BeSecondDepartmentID: [],
            SendID: [],
            SecondPersonID: [

                {
                    name: "全部",
                    value: 0
                },
            ],
            SecondDepartmentID: [],
            AreaID: [],
            BeSecondAuditID: [],
            IsExclude: [
                {
                    name: "否",
                    value: 0
                }, {
                    name: "是",
                    value: 1
                }
            ],
            IsOverArea: [
                {
                    name: "是",
                    value: true
                }, {
                    name: "否",
                    value: false
                }
            ],
            Status: [
                {
                    name: "申请中",
                    value: 1
                }, {
                    name: "待相关工区主管借调",
                    value: 2
                }, {
                    name: "已借调",
                    value: 3
                }],

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


            $("body").delegate("#zace-editRefresh-level", "click", function () {

                model.com.refresh();
            });

            $("body").delegate("#zace-editRefreshDeal-level", "click", function () {

                model.com.refreshDeal();
            });





            //查询
            $("body").delegate("#zace-add-level", "click", function () {

                var default_value = {
                    SecondPersonID:mSecondPersonID,
                    StartTime: $com.util.format('yyyy-MM-dd', new Date(mStartTime)),
                    EndTime: $com.util.format('yyyy-MM-dd', new Date(mEndTime)),
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                        mSecondPersonID = Number(rst.SecondPersonID);
                       
                        mStartTime = $com.util.format('yyyy-MM-dd', new Date(rst.StartTime));
                        mEndTime = $com.util.format('yyyy-MM-dd', new Date(rst.EndTime));
                        model.com.refresh();

                }, TypeSource_Level));


            });




        },




        run: function () {
            mStartTime = mStartTime = $com.util.format('yyyy-MM-dd', new Date() - 7 * 1000 * 60 * 60 * 24);
            mEndTime = $com.util.format('yyyy-MM-dd', new Date());
            mSecondPersonID=0;
            //人员
            model.com.get({ active: 1 }, function (resP) {
                if (!resP)
                    return;
                $.each(resP.list, function (i, item) {
                    TypeSource_Level.SecondPersonID.push({
                        value: item.ID,
                        name: item.Name,
                       
                    });
                });


                model.com.getDepartment({}, function (resP) {
                    if (!resP)
                        return;





                 model.com.refresh();

                });

            });


        },

        com: {
            refresh: function () {
                $com.app.loading('数据加载中...');
                model.com.getSecondAll({ StartTime: mStartTime, EndTime: mEndTime, SecondPersonID: mSecondPersonID }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var Grade = $com.util.Clone(resP.list);



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

                            //BeSecondAuditTimeText
                            item.BeSecondAuditTimeText = item.BeSecondAuditTime;
                            if (new Date(item.BeSecondAuditTime) < new Date('2010-1-1')) {
                                item.BeSecondAuditTimeText = '-';
                            }

                            item.ValidDateText = item.ValidDate;
                            if (new Date(item.ValidDate) < new Date('2010-1-1')) {
                                item.ValidDateText = '-';
                            }

                            
                            item.ApplyValidDateText = item.ApplyValidDate;
                            if (new Date(item.ApplyValidDate) < new Date('2010-1-1')) {
                                item.ApplyValidDateText = '-';
                            }
                        });
                        DataAllSearch = $com.util.Clone(Grade);
                        $("#femi-riskLevel-tbody").html($com.util.template(Grade, HTML.TableDealMode));

                        $com.app.loaded();
                    }

                });

                //window.parent._zaceBusinessUnit = 1;
            },


            refreshDeal: function () {
                $com.app.loading('数据加载中...');
                model.com.getEmployeeAll({ TagTypes: 1 }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var Grade = $com.util.Clone(resP.list);
                        DepertList = $com.util.Clone(resP.ClassList);
                        EmployeeList = $com.util.Clone(resP.EmployeeList);

                        TypeSource_Level.SecondDepartmentID = [];
                        TypeSource_Level.BeSecondDepartmentID = [];

                        $.each(DepertList, function (i, item) {
                            TypeSource_Level.BeSecondDepartmentID.push({
                                value: item.ID,
                                name: item.Name,
                                far: 0
                            });
                        });
                        TypeSource_Level.BeSecondAuditID = [];
                        TypeSource_Level.SecondPersonID = [];
                        TypeSource_Level.SecondDepartmentID = TypeSource_Level.BeSecondDepartmentID;
                        $.each(EmployeeList, function (i, item) {
                            TypeSource_Level.SecondPersonID.push({
                                value: item.ID,
                                name: item.Name,
                                far: item.DepartmentID
                            });
                        });
                        TypeSource_Level.BeSecondAuditID = TypeSource_Level.SecondPersonID;



                        for (var i = 0; i < Grade.length; i++) {
                            Grade[i].WID = i + 1;
                        }
                        DataAllDeal = $com.util.Clone(Grade);

                        $.each(Grade, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }
                            item.ValidDateText = item.ValidDate;
                            if (new Date(item.ValidDate) < new Date('2010-1-1')) {
                                item.ValidDateText = '-';
                            }
                            item.BeSecondAuditTimeText = item.BeSecondAuditTime;
                            if (new Date(item.BeSecondAuditTime) < new Date('2010-1-1')) {
                                item.BeSecondAuditTimeText = '-';
                            }
                        });
                        DataAllSearchDeal = $com.util.Clone(Grade);
                        $("#femi-RecordLevel-tbody").html($com.util.template(Grade, HTML.TableDealMode));
                        $com.app.loaded();

                    }

                });

                //window.parent._zaceBusinessUnit = 1;
            },

            getSecondAll: function (data, fn, context) {
                var d = {
                    $URI: "/SCHSecondment/All",
                    $TYPE: "get",
                    $SERVER: '/MESAPS'
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getDepartment: function (data, fn, context) {
                var d = {
                    $URI: "/Department/AllDepartment",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
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




            //查询借调单 TagTypes
            getEmployeeAll: function (data, fn, context) {
                var d = {
                    $URI: "/SCHSecondment/EmployeeAll",
                    $TYPE: "get",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //创建  借调单   顺便判断权限
            postAPSTaskCreate: function (data, fn, context) {
                var d = {
                    $URI: "/SCHSecondment/Create",
                    $TYPE: "post",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //
            postUpdateOne: function (data, fn, context) {
                var d = {
                    $URI: "/SCHSecondment/Update",
                    $TYPE: "post",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //查询工区列表
            getAreaList: function (data, fn, context) {
                var d = {
                    $URI: "/SCHSecondment/AreaList",
                    $TYPE: "get",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },


            //查询任务   批量保存本 工区  不跨区
            postTaskSaveList: function (data, fn, context) {
                var d = {
                    $URI: "/SCHSecondment/SaveList",
                    $TYPE: "post",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //查询任务   批量保存本 工区  跨区
            updateTaskList: function (data, fn, context) {
                var d = {
                    $URI: "/SCHSecondment/UpdateList",
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