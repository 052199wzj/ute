require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($alfie, $com) {
    var mFormatter_Search; //字段格式化对象
    var mDefault_Value_Search; //查询模态框对象
    var mKeyword_Search; //查询关键字
    var mKeyword_List_Search; //定义字段格式(用于表格字段转换)
    var mTypeSource_Search; //枚举对象(用于字段转换)
    var mCloneData; //克隆的数据源(用于模糊查询)
    var mHTML; //mHTML模板
    var mData; //全局数据源
    var mDefault_Value_Modal; //模态框显示字段

    mHTML = {
        TableNode_item: [
            '<tr data-color="">',
            // '<td style="width: 3px"><input type="checkbox"',
            // 'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td  style="min-width: 50px;display:none" data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',

            '<td style="min-width: 50px" data-title="ApplyName" data-value="{{ApplyName}}">{{ApplyName}}</td>',
            '<td style="min-width: 50px" data-title="ApplyStationName" data-value="{{ApplyStationName}}">{{ApplyStationName}}</td>',
            '<td style="min-width: 50px" data-title="ApplyTime" data-value="{{ApplyTime}}">{{ApplyTime}}</td>',
            '<td style="min-width: 50px" data-title="TargetStationName" data-value="{{TargetStationName}}">{{TargetStationName}}</td>',
            '<td style="min-width: 50px" data-title="FinishTime" data-value="{{FinishTime}}">{{FinishTime}}</td>',
            '<td style="min-width: 50px" data-title="StatusText" data-value="{{StatusText}}">{{StatusText}}</td>',
         
            '</tr>',
        ].join(""),
    }

    //查询字段定义
    mDefault_Value_Search = {
        'StartTime': new Date(),
        'EndTime': new Date(),
    };

    //初始化字段模板
    (function () {

        mKeyword_List_Search = [
            "WorkAreaID|工区|ArrayOne",
            "CheckerIDList|工区检验员|Array",
            "LeaderIDList|工区主管|Array",
            "ScheduleIDList|工区调度|Array",
        
            "CreateID||ArrayOne",
            "CheckerID|检验员|ArrayOne",
            "CreateTime|创建时刻|DateTime",
            "EditTime|编辑时刻|DateTime",
            "Active|状态|ArrayOne",
        ];

        mDefault_Value_Modal = {
            'WorkAreaID': 0,
            'CheckerIDList': 0,
            'LeaderIDList': 0,
            'ScheduleIDList': 0
            
        };

        mKeyword_Search = {};

        mFormatter_Search = {};


        mTypeSource_Search = {
            Active: [{
                'name': "启用",
                'value': 1
            },
            {
                'name': "禁用",
                'value': 0
            },
            ],
            WorkAreaID: [],
            CheckerIDList: [],
            LeaderIDList: [],
            ScheduleIDList: [],
            CreateID: [],
            CheckerID: []

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
        name: '时序表',

        type: $com.Model.MAIN, //主方法

        configure: function () {
            this.run();
        },

        events: function () {
            
            window.setFunctionTrigger("LOCOOrderTurn", function (res) {

                mOrderID = res.ID;
                mPartNo = res.PartNo;

                mProductNo = res.Name;


                mPartNo=mProductNo+'#'+mPartNo;
             
                model.com.refresh();

            });



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
            //新增
            $("body").delegate("#alfie-add-level", "click", function () {

                $("body").append($com.modal.show(mDefault_Value_Modal, mKeyword_Search, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    var wModelTemp = {
                        'ID': 0,
                        'WorkAreaID': 0,
                        'CheckerIDList': 0,
                        'LeaderIDList': 0,
                        'ScheduleIDList': 0,
                        'CreateID': 0,
                        'CreateTime': $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                        'Active': 1
                    };

                    wModelTemp.WorkAreaID = Number(rst.WorkAreaID);
                    wModelTemp.CheckerIDList = rst.CheckerIDList;
                    wModelTemp.LeaderIDList = rst.LeaderIDList;
                    wModelTemp.ScheduleIDList = rst.ScheduleIDList;


                    model.com.updateAreaDepartment({
                        data: wModelTemp,
                    }, function (res) {
                        alert("新增成功！");
                        model.com.refresh();
                    });
                }, mTypeSource_Search));
            });
            //修改
            $("body").delegate("#alfie-edit-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-item"), "ID", mData);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }

                var default_value = {
                    'WorkAreaID': SelectData[0].WorkAreaID,
                    'CheckerIDList': SelectData[0].CheckerIDList,
                    'LeaderIDList': SelectData[0].LeaderIDList,
                    'ScheduleIDList': SelectData[0].ScheduleIDList,
                };
                $("body").append($com.modal.show(default_value, mKeyword_Search, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;

                 

                    SelectData[0].WorkAreaID = Number(rst.WorkAreaID);
                    SelectData[0].CheckerIDList = rst.CheckerIDList;
                    SelectData[0].LeaderIDList = rst.LeaderIDList;
                    SelectData[0].ScheduleIDList = rst.ScheduleIDList;


                    SelectData[0].CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[0].CreateTime));
                    //去小写
                    $com.util.deleteLowerProperty(SelectData[0]);

                    model.com.updateAreaDepartment({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功！");
                        model.com.refresh();
                    })

                }, mTypeSource_Search));
            });
            //刷新
            $("body").delegate("#alfie-refresh-po", "click", function () {
                model.com.refresh();
            });
            //启用
            $("body").delegate("#alfie-active-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-item"), "ID", mData);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }

                var a = 0;
                for (var i = 0; i < SelectData.length; i++) {

                    $com.util.deleteLowerProperty(SelectData[i]);
                    SelectData[i].CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].CreateTime));


                }

                //调Update接口
                model.com.postAreaDepartment({
                    'data': SelectData,
                    'Active':1,
                }, function (res) {

                    alert("启用成功!");
                    model.com.refresh();

                });
            });
            //禁用
            $("body").delegate("#alfie-disable-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-item"), "ID", mData);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }

                var a = 0;
                for (var i = 0; i < SelectData.length; i++) {

                    $com.util.deleteLowerProperty(SelectData[i]);
                    SelectData[i].CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].CreateTime));


                }

                //调Update接口
                model.com.postAreaDepartment({
                    'data': SelectData,
                    'Active':0,
                }, function (res) {

                    alert("禁用成功!");
                    model.com.refresh();

                });


            });
        },

        run: function () {
            //人员列表
            // model.com.getEmployeeList({active:1}, function (res) {
            //     //渲染工区列表
            //     $.each(res.list, function (i, item) {
            //         mTypeSource_Search.CreateID.push({
            //             'name': item.Name,
            //             'value': item.ID,
            //         })
            //     });
            //     mTypeSource_Search.CheckerIDList = mTypeSource_Search.CreateID;
            //     mTypeSource_Search.LeaderIDList = mTypeSource_Search.CreateID;
            //     mTypeSource_Search.ScheduleIDList = mTypeSource_Search.CreateID;

              
                
            //     model.com.getDepartment({}, function (res) {
            //         $.each(res.list, function (i, item) {

            //             if (item.Active==1&&item.Type==2) {
            //                 mTypeSource_Search.WorkAreaID.push({
            //                     'name': item.Name,
            //                     'value': item.ID,
            //                 })
            //             }
                       
                       
            //         });
                  
                   
            //     });




            // });


            mOrderID=model.query.id;

            mProductNo=model.query.name;
            mPartNo=model.query.PartNo;

            mPartNo=mProductNo+'#'+mPartNo;

            model.com.refresh();






        },

        com: {
            getDepartment: function (data, fn, context) {
                var d = {
                    $URI: "/Department/AllDepartment",
                    $TYPE: "Get",
                    
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //刷新界面
            refresh: function () {
                $com.app.loading('数据加载中...');

                $('.zacce-partTime').text('【'+mPartNo+'】转序详情');
                model.com.getTurnList({ OrderID:mOrderID}, function (res) {
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
                            item.WID = i + 1;
                        });

                        mCloneData = $com.util.Clone(wItem);
                        $("#femi-Device-tbody-item").html($com.util.template(wItem, mHTML.TableNode_item));
                        $com.app.loaded();
                    }
                });
            },
           
            //查询工区列表
            getFMCWorkShop: function (data, fn, context) {
                var d = {
                    $URI: "/FMCWorkShop/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取人员列表
            getEmployeeList: function (data, fn, context) {
                var d = {
                    $URI: "/User/All",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取列表
            getTurnList: function (data, fn, context) {
                var d = {
                    $URI: "/RSMTurnOrderTask/All",
                    $TYPE: "Post",
                    $SERVER: "/MESQMS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络！');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //更新
            updateAreaDepartment: function (data, fn, context) {
                var d = {
                    $URI: "/LFSWorkAreaChecker/Update",
                    $TYPE: "Post",
                    $SERVER: "/MESLFS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络！');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //更新
            postAreaDepartment: function (data, fn, context) {
                var d = {
                    $URI: "/LFSWorkAreaChecker/Active",
                    $TYPE: "Post",
                    $SERVER: "/MESLFS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络！');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
        }
    }),
        model.init();
});