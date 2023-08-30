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
    var workSpaceList;//台位列表

    mHTML = {
        TableNode_item: [
            '<tr data-color="">',
            '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td>',
            '<td style="min-width: 50px" data-title="Code" data-value="{{Code}}">{{Code}}</td>',
            '<td style="min-width: 50px" data-title="Name" data-value="{{Name}}">{{Name}}</td>',
            '<td style="min-width: 50px" data-title="AreaID" data-value="{{AreaID}}">{{AreaID}}</td>',
            '<td style="min-width: 50px" data-title="Capacity" data-value="{{Capacity}}">{{Capacity}}</td>',
            '<td style="min-width: 50px" data-title="Length" data-value="{{Length}}">{{Length}}</td>',
            '<td style="min-width: 50px" data-title="GateDoorWorkSpaceIDList" data-value="{{GateDoorWorkSpaceIDList}}">{{GateDoorWorkSpaceName}}</td>',
            '<td style="min-width: 50px" data-title="MoveStoreHouseIDList" data-value="{{MoveStoreHouseIDList}}">{{MoveStoreHouseName}}</td>',
            '<td style="min-width: 50px" data-title="Creator" data-value="{{Creator}}">{{Creator}}</td>',
            '<td style="min-width: 50px" data-title="CreateTime" data-value="{{CreateTime}}">{{CreateTime}}</td>',
            '<td style="min-width: 50px" data-title="Active" data-value="{{Active}}">{{Active}}</td>',
            '</tr>',
        ].join(""),
        TableNode_worksapce: [
            '<tr data-color="">',
            // '<td style="width: 3px"><input type="checkbox"',
            // 'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td>',
            '<td style="min-width: 50px" data-title="workSpaceName" data-value="{{workSpaceName}}">{{workSpaceName}}</td>',
            '</tr>',
        ].join(""),
        TableNode_store: [
            '<tr data-color="">',
            // '<td style="width: 3px"><input type="checkbox"',
            // 'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td>',
            '<td style="min-width: 50px" data-title="StoreName" data-value="{{StoreName}}">{{StoreName}}</td>',
            '</tr>',
        ].join(""),
    }

    mModelTemp = {
        'ID': 0,
        'Code': "",
        'Name': "",
        'Capacity': 0,
        'Length': 0,
        'Creator': 0,
        'CreateTime': new Date(),
        'Active': 0,
        'AreaID':0,
    }

    //查询字段定义
    mDefault_Value_Search = {
        'StartTime': new Date(),
        'EndTime': new Date(),
    };

    //初始化字段模板
    (function () {

        mKeyword_List_Search = [
            "Code|库位编码",
            "Name|库位名称",
            "AreaID|工区|ArrayOne",
            "Capacity|台位容量",
            "Length|长度",
            "CreateTime|创建时刻|DateTime",
            "Active|可用|ArrayOne",
            "GateDoorWorkSpaceIDList|出入口台位|Array",
            "MoveStoreHouseIDList|可直移库位|Array",
        ];

        mDefault_Value_Modal = {
            'Name': "",
            'Code': "",
            'AreaID':0,
            'Capacity': 0,
            'Length': 0,
            'GateDoorWorkSpaceIDList': [],
            'MoveStoreHouseIDList': [],
        };

        mKeyword_Search = {};

        mFormatter_Search = {};


        mTypeSource_Search = {
            Active: [{
                'name': "激活",
                'value': 1
            },
            {
                'name': "禁用",
                'value': 0
            },
            ],
            GateDoorWorkSpaceIDList: [

            ],
            AreaID:[ {
                'name': "无",
                'value': 0
            },],
            MoveStoreHouseIDList: [

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
        name: '库位配置',

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


            // //模糊查询
            // $("body").delegate("#alfie-search-Device-item", "change", function() {
            //     var $this = $(this),
            //         value = $(this).val();
            //     if (value == undefined || value == "" || value.trim().length < 1)
            //         $("#femi-Device-tbody-item").children("tr").show();
            //     else
            //         $com.table.filterByLikeString($("#femi-Device-tbody-item"), mCloneData, value, "ID");
            // });
            //条件查询
            $("body").delegate("#alfie-Device-search", "click", function () {
                var $this = $("#alfie-search-Device-item"),
                    value = $("#alfie-search-Device-item").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-Device-tbody-item").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-Device-tbody-item"), mCloneData, value, "ID");
            });
            //库位表新增
            $("body").delegate("#alfie-add-level", "click", function () {

                $("body").append($com.modal.show(mDefault_Value_Modal, mKeyword_Search, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    var wModelTemp = {
                        'ID': 0,
                        'Code': "",
                        'Name': "",
                        'Capacity': 0,
                        'Length': 0,
                        'Creator': 0,
                        'CreateTime': new Date(),
                        'Active': 1,
                        'GateDoorWorkSpaceIDList': [],
                        'MoveStoreHouseIDList': [],
                        'AreaID':0,
                    };
                    DoorWorkSpaceArray = [];
                    MoveStoreHouseArray = [];
                    for (var m = 0; m < rst.GateDoorWorkSpaceIDList.length; m++) {
                        DoorWorkSpaceArray.push(Number(rst.GateDoorWorkSpaceIDList[m]));
                    }
                    for (var n = 0; n < rst.MoveStoreHouseIDList.length; n++) {
                        MoveStoreHouseArray.push(Number(rst.MoveStoreHouseIDList[n]));
                    }
                    wModelTemp.Code = rst.Code;
                    wModelTemp.Capacity = rst.Capacity;
                    wModelTemp.Length = rst.Length;
                    wModelTemp.Name = rst.Name;
                    wModelTemp.AreaID = Number(rst.AreaID);
                    wModelTemp.GateDoorWorkSpaceIDList = DoorWorkSpaceArray;
                    wModelTemp.MoveStoreHouseIDList = MoveStoreHouseArray;
                    model.com.updateStoreHouse({
                        data: wModelTemp,
                    }, function (res) {
                        alert("新增成功");
                        $(".zzza").hide();
                        $(".zzzb").hide();
                        $(".zzzc").width("100%");
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
                    'Name': SelectData[0].Name,
                    'Code': SelectData[0].Code,
                    'AreaID': SelectData[0].AreaID,
                    'Capacity': SelectData[0].Capacity,
                    'Length': SelectData[0].Length,
                    'GateDoorWorkSpaceIDList': SelectData[0].GateDoorWorkSpaceIDList,
                    'MoveStoreHouseIDList': SelectData[0].MoveStoreHouseIDList,
                };
                $("body").append($com.modal.show(default_value, mKeyword_Search, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    SelectData[0].Name = rst.Name;
                    SelectData[0].Code = rst.Code;
                    SelectData[0].Capacity = rst.Capacity;
                    SelectData[0].AreaID = Number(rst.AreaID);
                    SelectData[0].Length = rst.Length;
                    SelectData[0].GateDoorWorkSpaceIDList = rst.GateDoorWorkSpaceIDList;
                    SelectData[0].MoveStoreHouseIDList = rst.MoveStoreHouseIDList;

                    //去小写
                    $com.util.deleteLowerProperty(SelectData[0]);

                    model.com.updateStoreHouse({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        $(".zzza").hide();
                        $(".zzzb").hide();
                        $(".zzzc").width("100%");
                        model.com.refresh();
                    })

                }, mTypeSource_Search));
            });
            //库位表刷新
            $("body").delegate("#alfie-refresh-po", "click", function () {
                model.com.refresh();
            });
            //库位表激活
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
                    model.com.updateStoreHouse({
                        'data': SelectData[i],
                    }, function (res) {
                        a++;
                        if (a == SelectData.length) {
                            alert("激活成功!");
                            model.com.refresh();
                        }
                    });
                }
            });
            //库位表禁用
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
                    model.com.updateStoreHouse({
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

            //出入口台位查询
            $("body").delegate("#alfie-edit-workspace", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-item"), "ID", mData);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                $(".zzzb").show();
                $(".zzza").hide();
                $(".zzzc").width("80%");
                workspaceArray = [];
                var m = 0;
                for (var i = 0; i < workSpaceList.length; i++) {
                    for (var j = 0; j < SelectData[0].GateDoorWorkSpaceIDList.length; j++) {
                        if (workSpaceList[i].ID == SelectData[0].GateDoorWorkSpaceIDList[j]) {
                            wID = m + 1;
                            workspaceArray.push({
                                ID: wID,
                                workSpaceName: workSpaceList[i].Name,
                            });
                            m++
                        }
                    }
                }
                $("#femi-Device-tbody-workspace").html($com.util.template(workspaceArray, mHTML.TableNode_worksapce));
            });

            //可直移库位查询
            $("body").delegate("#alfie-edit-store", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-item"), "ID", mData);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                $(".zzza").show();
                $(".zzzb").hide();
                $(".zzzc").width("80%");
                storeArray = [];
                var m = 0;
                for (var i = 0; i < mCloneData.length; i++) {
                    for (var j = 0; j < SelectData[0].MoveStoreHouseIDList.length; j++) {
                        if (mCloneData[i].ID == SelectData[0].MoveStoreHouseIDList[j]) {
                            wID = m + 1;
                            storeArray.push({
                                ID: wID,
                                StoreName: mCloneData[i].Name,
                            });
                            m++
                        }
                    }
                }
                $("#femi-Device-tbody-store").html($com.util.template(storeArray, mHTML.TableNode_store));
            });
            //可直移库位隐藏
            $("body").delegate("#zace-usehidestore", "click", function () {
                $(".zzza").hide();
                $(".zzzb").hide();
                $(".zzzc").width("100%");
            });
            //出入口台位隐藏
            $("body").delegate("#zace-usehideworkspace", "click", function () {
                $(".zzza").hide();
                $(".zzzb").hide();
                $(".zzzc").width("100%");
            });
        },

        run: function () {
            //查询库位
            model.com.getStoreHouseList({ 'ID': -1, 'Active': -1 }, function (resP) {
                $.each(resP.list, function (i, item) {
                    mTypeSource_Search.MoveStoreHouseIDList.push({
                        name: item.Name,
                        value: item.ID,
                    });
                });
                //查询台位
                model.com.getFPCProductPlace({ Active: -1, ProductID: 0, PartID: 0, PlaceType: 1 }, function (resT) {
                    workSpaceList = $com.util.Clone(resT.list);
                    $.each(resT.list, function (i, item) {
                        mTypeSource_Search.GateDoorWorkSpaceIDList.push({
                            name: item.Name,
                            value: item.ID,
                        });
                    });
                    model.com.getDepartment({}, function (res) {
                        $.each(res.list, function (i, item) {
    
                            if (item.Active==1&&item.Type==2) {
                                mTypeSource_Search.AreaID.push({
                                    'name': item.Name,
                                    'value': item.ID,
                                })
                            }
                           
                           
                        });
                        model.com.refresh();
                       
                    });
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
            //刷新界面
            refresh: function () {
                $com.app.loading('数据加载中...');
                model.com.getStoreHouseList({ 'ID': -1, 'Active': -1 }, function (res) {
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
                        // GateDoorWorkSpaceName  MoveStoreHouseName
                        //出入口台位
                        // var Str = "";
                        // $.each(mData,function(i,item){
                        //     Str = "";
                        //     if(item.GateDoorWorkSpaceIDList<=0)
                        //         return true;
                        //     $.each(item.GateDoorWorkSpaceIDList,function(j,jtem){
                        //         Str += mFormatter_Search["GateDoorWorkSpaceIDList"](jtem);
                        //     });
                        //     item.GateDoorWorkSpaceName = Str;
                        // });
                        // console.log(mData);
                        for (var k = 0; k < mData.length; k++) {

                            if (mData[k].GateDoorWorkSpaceIDList.length > 0) {
                                mData[k].GateDoorWorkSpaceName = model.com.workspace(mData[k].GateDoorWorkSpaceIDList);
                            } else {
                                mData[k].GateDoorWorkSpaceName = "";
                            }

                            if (mData[k].MoveStoreHouseIDList.length > 0) {
                                mData[k].MoveStoreHouseName = model.com.store(mData[k].MoveStoreHouseIDList);
                            } else {
                                mData[k].MoveStoreHouseName = "";
                            }
                        }
                        console.log(mData);
                        for (m = 0; m < mData.length; m++) {
                            for (n = 0; n < wItem.length; n++) {
                                if (mData[m].ID == wItem[n].ID) {
                                    wItem[n].GateDoorWorkSpaceName = mData[m].GateDoorWorkSpaceName;
                                    wItem[n].MoveStoreHouseName = mData[m].MoveStoreHouseName;
                                }
                            }
                        }
                        mCloneData = $com.util.Clone(wItem);
                        $("#femi-Device-tbody-item").html($com.util.template(wItem, mHTML.TableNode_item));
                        $com.app.loaded();
                    }
                });
            },
            //处理出入口台位
            workspace: function (array) {
                GateDoorWorkSpaceArray = [];
                for (var j = 0; j < array.length; j++) {
                    for (var i = 0; i < workSpaceList.length; i++) {
                        if (workSpaceList[i].ID == array[j]) {
                            GateDoorWorkSpaceArray.push(workSpaceList[i].Name);
                        }
                    }
                }
                var GateDoorWorkSpaceName = GateDoorWorkSpaceArray.join(",");
                return GateDoorWorkSpaceName
            },
            store: function (array) {
                GatestoreArray = [];
                for (var j = 0; j < array.length; j++) {
                    for (var i = 0; i < mData.length; i++) {
                        if (mData[i].ID == array[j]) {
                            GatestoreArray.push(mData[i].Name);
                        }
                    }
                }
                var MoveStoreHouseName = GatestoreArray.join(",");
                return MoveStoreHouseName

            },
            //台位查询
            getFPCProductPlace: function (data, fn, context) {
                var d = {
                    $URI: "/FMCWorkspace/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
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
            updateStoreHouse: function (data, fn, context) {
                var d = {
                    $URI: "/LFS/StoreHouseUpdate",
                    $TYPE: "Post",
                    $SERVER: "/MESLFS"
                };

                function err() {
                    $com.app.tip('新增或修改库位失败，请检查网络!');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
        }
    }),
        model.init();
});