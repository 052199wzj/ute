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
            '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',

            '<td style="min-width: 50px" data-title="Name" data-value="{{Name}}">{{Name}}</td>',
            '<td style="min-width: 50px" data-title="Detail" data-value="{{Detail}}">{{Detail}}</td>',
            '<td style="min-width: 50px" data-title="Type" data-value="{{Type}}">{{Type}}</td>',
            '<td style="min-width: 50px" data-title="OptionsItem">{{OptionsItem}}</td>',
            '</tr>',
        ].join(""),
        IMGLIST: '<img src= "{{SrcList}}" style="width:25px;height:25px;"/>',
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
            "DepartmentID|班组|ArrayOne",
            "Name|指导书名称",
            "Detail|指导书描述",
            "CreateTime|创建时刻|DateTime",
            "Type|类型|ArrayOne",
            "PathList|地址|InputArray",          
        ];

        mDefault_Value_Modal = {
            'Name': "",
            'Detail': "",
            'Type': 1,
            'PathList':0,
        };

        mKeyword_Search = {};

        mFormatter_Search = {};


        mTypeSource_Search = {
            PathList: [
                {
                    value: 0,
                    name: 0,
                    far: 1
                }
            ],
            Active: [{
                'name': "启用",
                'value': 1
            },
            {
                'name': "禁用",
                'value': 0
            },
            ],
            Type: [
                {
                    'name': "图片",
                    'value': 1
                },
                {
                    'name': "PDF",
                    'value': 2
                },
                {
                    'name': "视频",
                    'value': 3
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
        name: '',

        type: $com.Model.MAIN, //主方法

        configure: function () {
            this.run();
        },

        events: function () {
            //模糊查询
            // $("body").delegate("#alfie-search-Device-item", "change", function() {
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
            //新增
            $("body").delegate("#alfie-add-level", "click", function () {

                $("body").append($com.modal.show(mDefault_Value_Modal, mKeyword_Search, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    var wModelTemp = {
                        'ID': 0,
                        'Name': "",
                        'Detail': "",
                        'Type': 0,
                        'PathList': [],
                    };

                    wModelTemp.Type = Number(rst.Type);
                    wModelTemp.Name = rst.Name;
                    wModelTemp.Detail = rst.Detail;
                    wModelTemp.PathList = rst.PathList;


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
                    'Name': SelectData[0].Name,
                    'Detail': SelectData[0].Detail,
                    'PathList':SelectData[0].PathList,

                };
                $("body").append($com.modal.show(default_value, mKeyword_Search, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    SelectData[0].Name = rst.Name;
                    SelectData[0].Detail = rst.Detail;
                    SelectData[0].PathList = rst.PathList;
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

        },

        run: function () {
            //
            model.com.refresh();
        },

        com: {
            //刷新界面
            refresh: function () {
                $com.app.loading('数据加载中...');
                model.com.getAreaDepartmentList({ 'ID': -1, 'Type': -1 }, function (res) {
                    if (res && res.list) {
                        mData = $com.util.Clone(res.list);
                        //数据源字段模板转换
                        var wItem = $com.util.Clone(mData);
                        $.each(wItem, function (i, item) {
                            item.OptionsItem = '';
                            for (var k = 0; k < item.PathList.length; k++) {
                                item.OptionsItem += item.PathList[k] + ";"

                            }

                            for (var p in item) {
                                if (!mFormatter_Search[p])
                                    continue;
                                item[p] = mFormatter_Search[p](item[p]);
                            }
                            item.WID = i + 1;
                        });

                        mCloneData = $com.util.Clone(wItem);
                        for (var m = 0; m < wItem.length; m++) {
                            // model.com.checkImage(wItem[m].ImageList,wItem[m]);
                            wItem[m].PathList = wItem[m].PathList.split("|,|");
                            ImagePathArray = [];
                            for (var k = 0; k < wItem[m].PathList.length; k++) {
                                SrcListObj = {
                                    ID: k + 1,
                                    SrcList: wItem[m].PathList[k]
                                }
                                if(SrcListObj.SrcList!=""){
                                    ImagePathArray.push(SrcListObj);
                                }
                            }
                            if (ImagePathArray.length > 0) {
                                wItem[m].OptionsItem = $com.util.template(ImagePathArray, mHTML.IMGLIST);
                            } else {
                                wItem[m].OptionsItem = "";
                            }

                        }
                        $("#femi-Device-tbody-item").html($com.util.template(wItem, mHTML.TableNode_item));
                        $com.app.loaded();
                    }
                });
            },
            //查询部门列表
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
            getAreaDepartmentList: function (data, fn, context) {
                var d = {
                    $URI: "/IPTSOP/All",
                    $TYPE: "Get",
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
                    $URI: "/IPTSOP/Update",
                    $TYPE: "Post",
                    $SERVER: "/MESQMS"
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