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
    var mDataZace = [];

    var MoveNum = 1;
    mHTML = {
        TableNode_item: [
            '<tr data-color="">',
            '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',

            '<td style="min-width: 50px" data-title="WorkAreaID" data-value="{{WorkAreaID}}">{{WorkAreaID}}</td>',
            '<td style="min-width: 50px" data-title="StationID" data-value="{{StationID}}">{{StationID}}</td>',
            '<td style="min-width: 50px" data-title="StationName" data-value="{{StationName}}">{{StationName}}</td>',
            '<td style="min-width: 50px" data-title="OrderNum" data-value="{{OrderNum}}">{{OrderNum}}</td>',
            '<td style="min-width: 50px" data-title="Creator" data-value="{{Creator}}">{{Creator}}</td>',
            '<td style="min-width: 50px" data-title="CreateTime" data-value="{{CreateTime}}">{{CreateTime}}</td>',
            '<td style="min-width: 50px" data-title="Active" data-value="{{Active}}">{{Active}}</td>',
            '</tr>',
        ].join(""),
    }

    mModelTemp = {
        'ID': 0,
        'WorkAreaID': 0,
        'StationID': 0,
        'CreateID': 0,
        'OrderNum': 0,
        'Creator': 0,
        'CreateTime': new Date(),
        'Active': 0
    }

    //查询字段定义
    mDefault_Value_Search = {
        'StartTime': new Date(),
        'EndTime': new Date(),
    };

    //初始化字段模板
    (function () {

        mKeyword_List_Search = [
            'MoveNum|移动行数',
            'MoveToPlace|目标行数',
            "WorkAreaID|工区名称|ArrayOne",
            "StationID|工位名称|ArrayOne",
            'OrderNum|顺序',
            "CreateTime|编辑时刻|DateTime",
            "Active|可用|ArrayOne",
        ];

        mDefault_Value_Modal = {
            'WorkAreaID': 0,
            'StationID': 0,
            // 'OrderNum':0,
            // 'Active': 1,
        };

        mKeyword_Search = {};

        mFormatter_Search = {};


        mTypeSource_Search = {
            WorkAreaID: [],
            StationID: [],
            Active: [{
                'name': "启用",
                'value': 1
            },
            {
                'name': "禁用",
                'value': 0
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
        name: '工区工位',

        type: $com.Model.MAIN, //主方法

        configure: function () {
            this.run();
        },

        events: function () {

            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var value = $("#alfie-search-Device-item").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-Device-tbody-item").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-Device-tbody-item"), mCloneData, value, "ID");
                }
            });


            //模糊查询
            $("body").delegate("#alfie-search-Device-item", "change", function () {
                var $this = $(this),
                    value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-Device-tbody-item").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-Device-tbody-item"), mCloneData, value, "ID");
            });

            //条件查询
            $("body").delegate("#alfie-Device-search", "click", function () {
                var
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
                        'WorkAreaID': 0,
                        'StationID': 0,
                        'OrderNum': mData.length + 1,
                        'CreateID': 0,
                        'Creator': "",
                        'CreateTime': new Date(),
                        'Active': 1
                    };

                    wModelTemp.WorkAreaID = Number(rst.WorkAreaID);
                    wModelTemp.StationID = Number(rst.StationID);
                    // wModelTemp.OrderNum = Number(rst.OrderNum);
                    // wModelTemp.Active = Number(rst.Active);

                    model.com.updateWorkArea({
                        data: wModelTemp,
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                    });
                }, mTypeSource_Search));
            });
            //库位表修改
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
                    'StationID': SelectData[0].StationID,
                    // 'OrderNum': SelectData[0].OrderNum,
                };
                $("body").append($com.modal.show(default_value, mKeyword_Search, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    SelectData[0].WorkAreaID = Number(rst.WorkAreaID);
                    SelectData[0].StationID = Number(rst.StationID);
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
            //工区工位启用
            $("body").delegate("#alfie-active-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-item"), "ID", mData);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }

                var a = 0;
                for (var i = 0; i < SelectData.length; i++) {
                    SelectData[i].Active = 1;
                    $com.util.deleteLowerProperty(SelectData[i]);
                    //调Update接口
                    model.com.updateWorkArea({
                        'data': SelectData[i],
                    }, function (res) {
                        a++;
                        if (a == SelectData.length) {
                            alert("启用成功!");
                            model.com.refresh();
                        }
                    });
                }
            });

            //上移
            $("body").delegate("#zace-aotu-upZ", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-item"), "ID", mData);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！")
                    return;
                }

                if (SelectData[0].OrderNum == 1) {
                    alert("已在第一行！");
                    return false;
                }
                // SelectData[0].OrderNum -= 1;
                // var upData = model.com.getDataOne(SelectData[0].OrderNum);
                // upData[0].OrderNum += 1;        
                // $com.util.deleteLowerProperty(upData[0]);
                var default_value = {
                    // 'MoveNum': MoveNum,
                    'MoveToPlace': SelectData[0].WID,
                };
                $("body").append($com.modal.show(default_value, mKeyword_Search, "上移", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    $com.util.deleteLowerProperty(SelectData[0]);
                    // MoveNum = Number(rst.MoveNum);
                    var MoveNum = Number(rst.MoveToPlace);

                    // if (MoveNum <= 0) {
                    //     alert("移动行数应大于0");
                    //     return false;
                    // }
                    if (MoveNum <= 0) {
                        alert("目标行数应大于0");
                        return false;
                    }
                    if (MoveNum >= SelectData[0].WID) {
                        alert("目标行数应小于当前行数");
                        return false;
                    }

                    MoveNum=SelectData[0].WID-MoveNum;


                    model.com.moveWorkArea({
                        LFSWorkStaionID: SelectData[0].ID,
                        Type: 1,
                        Numbers: MoveNum
                    }, function (res) {


                        alert("上移成功！")
                        model.com.refresh();



                    })
                }, mTypeSource_Search));



            });


            //下移
            $("body").delegate("#zace-aotu-downZ", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-item"), "ID", mData);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！")
                    return;
                }
                if (SelectData[0].OrderNum == mData.length) {
                    alert("已在最后一行！");
                    return false;
                }

                // SelectData[0].OrderNum += 1;
                // var upData = model.com.getDataOne(SelectData[0].OrderNum);
                // upData[0].OrderNum -= 1;
                $com.util.deleteLowerProperty(SelectData[0]);
                // $com.util.deleteLowerProperty(upData[0]);
                var default_value = {
                   // 'MoveNum': MoveNum,
                   'MoveToPlace': SelectData[0].WID,

                };
                $("body").append($com.modal.show(default_value, mKeyword_Search, "下移", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                     $com.util.deleteLowerProperty(SelectData[0]);
                    // MoveNum = Number(rst.MoveNum);

                    // if (MoveNum <= 0) {
                    //     alert("移动行数应大于0");
                    //     return false;
                    // }

                    var MoveNum = Number(rst.MoveToPlace);


                    if (MoveNum > mData.length) {
                        alert("目标行数应小于等于总行数");
                        return false;
                    }
                    if (MoveNum <= SelectData[0].WID) {
                        alert("目标行数应大于当前行数");
                        return false;
                    }

                    MoveNum=MoveNum-SelectData[0].WID;
                    model.com.moveWorkArea({
                        LFSWorkStaionID: SelectData[0].ID,
                        Type: 2,
                        Numbers: MoveNum
                    }, function (res) {


                        alert("下移成功！")
                        model.com.refresh();



                    })
                }, mTypeSource_Search));

            });


            //工区工位禁用
            $("body").delegate("#alfie-disable-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-item"), "ID", mData);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }

                var a = 0;
                for (var i = 0; i < SelectData.length; i++) {
                    SelectData[i].Active = 0;
                    $com.util.deleteLowerProperty(SelectData[i]);
                    //调Update接口
                    model.com.updateWorkArea({
                        'data': SelectData[i],
                    }, function (res) {
                        a++;
                        if (a == SelectData.length) {
                            alert("禁用成功!");
                            model.com.refresh();
                        }
                    });
                }
            });
        },

        run: function () {
            //工区数据
            model.com.getDepartment({}, function (resP) {
                $.each(resP.list, function (i, item) {

                    if (item.Active == 1 && item.Type == 2) {
                        mTypeSource_Search.WorkAreaID.push({
                            name: item.Name,
                            value: item.ID,
                        });
                    }
                });

                //工位数据
                model.com.getFPCPart({ FactoryID: 0, BusinessUnitID: 0 }, function (resP) {
                    $.each(resP.list, function (i, item) {
                        mTypeSource_Search.StationID.push({
                            name: item.Code,
                            value: item.ID,
                        });
                    });
                    model.com.refresh();

                });

            });

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
            getDataOne: function (Order) {
                var _list = [];
                for (var index = 0; index < mDataZace.length; index++) {
                    if (Order == mDataZace[index].OrderNum) {
                        _list.push(mDataZace[index]);
                    }

                }
                return _list;

            },
            //刷新界面
            refresh: function () {
                $com.app.loading('数据加载中...');
                model.com.getWorkAreaAll({ 'ID': -1, 'Active': -1 }, function (res) {
                    if (res && res.list) {
                        res.list.sort(function (a, b) { return Number(a.OrderNum) - Number(b.OrderNum) });
                        mData = $com.util.Clone(res.list);
                        $.each(mData, function (k, item_k) {
                           
                            item_k.WID = k + 1;
                        });
                        //数据源字段模板转换
                        mDataZace = $com.util.Clone(res.list);
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
            //获取库位列表
            getStoreHouseList: function (data, fn, context) {
                var d = {
                    $URI: "/LFS/StoreHouseAll",
                    $TYPE: "Get",
                    $SERVER: "/MESLFS"
                };

                function err() {
                    $com.app.tip('获取库位列表失败，请检查网络!');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //更新库位
            updateWorkArea: function (data, fn, context) {
                var d = {
                    $URI: "/LFS/WorkAreaUpdate",
                    $TYPE: "Post",
                    $SERVER: "/MESLFS"
                };

                function err() {
                    $com.app.tip('新增或修改库位失败，请检查网络!');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //更新库位
            moveWorkArea: function (data, fn, context) {
                var d = {
                    $URI: "/LFS/Move",
                    $TYPE: "Get",
                    $SERVER: "/MESLFS"
                };

                function err() {
                    $com.app.tip('请检查网络!');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getWorkAreaAll: function (data, fn, context) {
                var d = {
                    $URI: "/LFS/WorkAreaAll",
                    $TYPE: "Get",
                    $SERVER: "/MESLFS"
                };

                function err() {
                    $com.app.tip('获取库位列表失败，请检查网络!');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询车间列表
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
        }
    }),
        model.init();
});