require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($alfie, $com) {
    var mFormatter_Search; //字段格式化对象
    var mDefault_Value_Search; //查询模态框对象
    var mKeyword_Search; //查询关键字
    var mKeyword_List_Search; //定义字段格式(用于表格字段转换)
    var mTypeSource_Search; //枚举对象(用于字段转换)
    var mCloneData; //克隆的数据源(用于模糊查询)
    var mHTML; //mHTML模板
    var mModelTemp; //全局数据模型
    var mData; //全局数据源
    var mDefault_Value_Modal; //模态框显示字段
    var mAPSShiftPeriod = 6;
    mHTML = {
        TableNode_item: [
            '<tr data-color="">',
            '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',

            '<td style="min-width: 50px" data-title="AuditPositionID" data-value="{{AuditPositionID}}">{{AuditPositionID}}</td>',
            '<td style="min-width: 50px" data-title="AuditLevel" data-value="{{AuditLevel}}">{{AuditLevel}}</td>',
            '<td style="min-width: 50px" data-title="CreateID" data-value="{{CreateID}}">{{CreateID}}</td>',
            '<td style="min-width: 50px" data-title="CreateTime" data-value="{{CreateTime}}">{{CreateTime}}</td>',
            '<td style="min-width: 50px" data-title="APSShiftPeriod" data-value="{{APSShiftPeriod}}">{{APSShiftPeriod}}</td>',
            '</tr>',
        ].join(""),
    }

    // mModelTemp = {
    //     'ID': 0,
    //     'AuditPositionID': 0,
    //     'AuditLevel': 0,
    //     'CreateID': 0,
    //      'OrderNum':0,
    //     'Creator': 0,
    //     'CreateTime': new Date(),
    //     'Active': 0
    // }

    //查询字段定义
    mDefault_Value_Search = {
        'APSShiftPeriod': mAPSShiftPeriod,
    };

    //初始化字段模板
    (function () {

        mKeyword_List_Search = [
            "AuditPositionID|岗位|ArrayOne",
            "AuditLevel|层级",
            "CreateID|人|ArrayOne",
            "CreateTime|编辑时刻|DateTime",
            "APSShiftPeriod|计划类别|ArrayOne",

        ];

        mDefault_Value_Modal = {
            'AuditPositionID': 0,
            'AuditLevel': 0,
            // 'Active': 1,
        };

        mKeyword_Search = {};

        mFormatter_Search = {};


        mTypeSource_Search = {
            AuditPositionID: [],
            CreateID: [],
            APSShiftPeriod: [{
                'name': "周计划",
                'value': 5
            },
            {
                'name': "月计划",
                'value': 6
            },
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

    model = $com.Model.create({
        name: '计划配置类别',

        type: $com.Model.MAIN, //主方法

        configure: function () {
            this.run();
        },

        events: function () {
            //模糊查询
            // $("body").delegate("#alfie-search-Device-item", "change", function () {
            //     var $this = $(this),
            //         value = $(this).val();
            //     if (value == undefined || value == "" || value.trim().length < 1)
            //         $("#femi-Device-tbody-item").children("tr").show();
            //     else
            //         $com.table.filterByLikeString($("#femi-Device-tbody-item"), mCloneData, value, "ID");
            // });
            //Enter触发模糊查询事件
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
            //工区工位新增
            $("body").delegate("#alfie-add-level", "click", function () {

                $("body").append($com.modal.show(mDefault_Value_Modal, mKeyword_Search, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    var wModelTemp = {
                        'ID': 0,
                        'AuditPositionID': 0,
                        'AuditLevel': 0,
                        'CreateID': 0,
                        'CreateTime': $com.util.format('yyyy-MM-dd', new Date()),
                        'EditID ': 0,
                        'EditTime  ': $com.util.format('yyyy-MM-dd', new Date()),
                        APSShiftPeriod: mAPSShiftPeriod,

                    };

                    wModelTemp.AuditPositionID = Number(rst.AuditPositionID);
                    wModelTemp.AuditLevel = Number(rst.AuditLevel);

                    model.com.updateWorkArea({
                        data: wModelTemp,
                    }, function (res) {
                        alert("新增成功");
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
                    'AuditPositionID': SelectData[0].AuditPositionID,
                    'AuditLevel': SelectData[0].AuditLevel,

                };
                $("body").append($com.modal.show(default_value, mKeyword_Search, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    SelectData[0].AuditPositionID = Number(rst.AuditPositionID);
                    SelectData[0].AuditLevel = Number(rst.AuditLevel);
                    // SelectData[0].OrderNum = Number(rst.OrderNum);

                    //去小写
                    $com.util.deleteLowerProperty(SelectData[0]);

                    model.com.updateWorkArea({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                    })

                }, mTypeSource_Search));
            });
            //工区工位刷新
            $("body").delegate("#alfie-refresh-po", "click", function () {
                model.com.refresh();
            });

            //删除
            $("body").delegate("#alfie-refresh-delete", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-item"), "ID", mData);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                for (var index = 0; index < SelectData.length; index++) {
                    $com.util.deleteLowerProperty(SelectData[index]);

                }



                model.com.deleteWorkArea({
                    data: SelectData,
                }, function (res) {
                    alert("删除成功");
                    model.com.refresh();
                })

            });

            //alfie-refresh-zaceSearch
            //查询
            $("body").delegate("#alfie-refresh-zaceSearch", "click", function () {


                var default_value = {
                    APSShiftPeriod: mAPSShiftPeriod,

                };
                $("body").append($com.modal.show(default_value, mKeyword_Search, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    mAPSShiftPeriod = Number(rst.APSShiftPeriod);

                    model.com.refresh();

                }, mTypeSource_Search));





            });
        },

        run: function () {
            model.com.getPosition({}, function (res) {
                if (!res)
                    return;
                $.each(res.list, function (i, item) {
                    mTypeSource_Search.AuditPositionID.push({
                        name: item.Name,
                        value: item.ID,
                    });

                });

                model.com.get({}, function (res) {
                    if (!res)
                        return;
                    $.each(res.list, function (i, item) {
                        mTypeSource_Search.CreateID.push({
                            name: item.Name,
                            value: item.ID,
                        });

                    });

                    model.com.refresh();

                });


            });



        },

        com: {
            //刷新界面
            refresh: function () {
                $com.app.loading('数据加载中...');
                model.com.getWorkAreaAll({ APSShiftPeriod: mAPSShiftPeriod }, function (res) {
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
            getPosition: function (data, fn, context) {
                var d = {
                    $URI: "/Department/AllPosition",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //删除
            deleteWorkArea: function (data, fn, context) {
                var d = {
                    $URI: "/APSAuditConfig/DeleteList",
                    $TYPE: "Post",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络!');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //更新
            updateWorkArea: function (data, fn, context) {
                var d = {
                    $URI: "/APSAuditConfig/Update",
                    $TYPE: "Post",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('新增或修改库位失败，请检查网络!');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getWorkAreaAll: function (data, fn, context) {
                var d = {
                    $URI: "/APSAuditConfig/All",
                    $TYPE: "Get",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络!');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

        }
    }),
        model.init();
});