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

            '<td style="min-width: 50px" data-title="CustomID" data-value="{{CustomID}}">{{CustomID}}</td>',
            '<td style="min-width: 50px" data-title="LineID" data-value="{{LineID}}">{{LineID}}</td>',
            '<td style="min-width: 50px" data-title="ProductID" data-value="{{ProductID}}">{{ProductID}}</td>',
            '<td style="min-width: 50px" data-title="IPTItemID" data-value="{{IPTItemID}}">{{IPTItemID}}</td>',
            '<td style="min-width: 50px" data-title="Description" data-value="{{Description}}">{{Description}}</td>',
            '<td style="min-width: 50px" data-title="Details" data-value="{{Details}}">{{Details}}</td>',
            '<td style="min-width: 50px" data-title="ImageText">{{ImageText}}</td>',
            // '<td style="min-width: 50px" data-title="VideoText" data-value="{{VideoText}}">{{VideoText}}</td>',
            '</tr>',
        ].join(""),
        IMGLIST: '<img src= "{{SrcList}}" style="width:25px;height:25px;"/>',
    };

    //初始化字段模板
    (function () {

        mKeyword_List_Search = [
            "CustomID|局段|ArrayOne",
            "LineID|修程|ArrayOne",
            "ProductID|车型|ArrayOne",
            "IPTItemID|预检标准项",
            "Description|问题简述",
            "Details|问题详情",
            "ImageList|图片|InputArray",
            // "VideoList|视频|InputArray",
            "CreateTime|创建时刻|DateTime",
            "EditTime|编辑时刻|DateTime",

        ];

        mDefault_Value_Modal = {
            'CustomID': 0,
            'LineID': 0,
            'ProductID': 0,
            'IPTItemID': 0,
            'Description': "",
            'Details': "",
            'ImageList': 0,
            // 'VideoList': 0,
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
            CustomID: [],
            LineID: [],
            ProductID: [],
            ImageList: [
                {
                    value: 0,
                    name: 0,
                    far: 1
                }
            ],
            VideoList: [
                {
                    value: 0,
                    name: 0,
                    far: 1
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
                        'IPTItemID': Number(rst.IPTItemID),
                        'Description': rst.Description,
                        'Details': rst.Details,
                        'ImageList': rst.ImageList,
                        // 'VideoList': rst.VideoList,
                        'ProductID': Number(rst.ProductID),
                        'LineID': Number(rst.LineID),
                        'CustomID': Number(rst.CustomID),
                        'IPTSOPList': [],
                        'FullDescribe': "",
                        'CreateTime': $com.util.format('yyyy-MM-dd', new Date()),
                        'CreateID': 0,
                        'EditID': 0,
                        'EditTime': $com.util.format('yyyy-MM-dd', new Date()),
                    };

                    model.com.updateIPTSolveLib({
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
                    'CustomID': SelectData[0].CustomID,
                    'LineID': SelectData[0].LineID,
                    'ProductID': SelectData[0].ProductID,
                    'IPTItemID': SelectData[0].IPTItemID,
                    'Description': SelectData[0].Description,
                    'Details': SelectData[0].Details,
                    'ImageList': SelectData[0].ImageList,
                    // 'VideoList': SelectData[0].VideoList,


                };
                $("body").append($com.modal.show(default_value, mKeyword_Search, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    SelectData[0].LineID = Number(rst.LineID);
                    SelectData[0].CustomID = Number(rst.CustomID);
                    SelectData[0].ProductID = Number(rst.ProductID);
                    SelectData[0].IPTItemID = Number(rst.IPTItemID);
                    SelectData[0].Description = rst.Description;
                    SelectData[0].Details = rst.Details;
                    SelectData[0].ImageList = rst.ImageList;
                    SelectData[0].VideoList = rst.VideoList;




                    //去小写
                    $com.util.deleteLowerProperty(SelectData[0]);

                    model.com.updateIPTSolveLib({
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
            //局段数据
            model.com.getCustomer({ active: 2 }, function (resS) {
                $.each(resS.list, function (i, item) {
                    mTypeSource_Search.CustomID.push({
                        name: item.CustomerName,
                        value: item.ID,
                    });
                });

                //修程数据
                model.com.getFMCLine({ FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0 }, function (resP) {
                    $.each(resP.list, function (i, item) {
                        mTypeSource_Search.LineID.push({
                            name: item.Name,
                            value: item.ID,
                        });
                    });

                    //车型数据
                    model.com.getFPCProduct({ ProductTypeID: 0, BusinessUnitID: 0 }, function (resP) {
                        $.each(resP.list, function (i, item) {
                            mTypeSource_Search.ProductID.push({
                                name: item.ProductNo,
                                value: item.ID,
                            });
                        });

                        model.com.refresh();
                    });
                });

            });

        },

        com: {
            //刷新界面
            refresh: function () {
                $com.app.loading('数据加载中...');
                model.com.getIPTSolveLib({ 'ID': -1, 'CustomID': -1, 'LineID': -1, 'ProductID': -1, 'IPTItemID': -1 }, function (res) {
                    if (res && res.list) {
                        mData = $com.util.Clone(res.list);
                        //数据源字段模板转换
                        var wItem = $com.util.Clone(mData);
                        $.each(wItem, function (i, item) {

                            item.ImageText = '';
                            for (var k = 0; k < item.ImageList.length; k++) {
                                item.ImageText += item.ImageList[k] + ";"

                            }
                            item.VideoText = '';
                            for (var k = 0; k < item.VideoList.length; k++) {
                                item.VideoText += item.VideoList[k] + ";"

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
                            wItem[m].ImageList = wItem[m].ImageList.split("|,|");
                            ImagePathArray = [];
                            for (var k = 0; k < wItem[m].ImageList.length; k++) {
                                SrcListObj = {
                                    ID: k + 1,
                                    SrcList: wItem[m].ImageList[k]
                                }
                                if(SrcListObj.SrcList!=""){
                                    ImagePathArray.push(SrcListObj);
                                }
                            }
                            if (ImagePathArray.length > 0) {
                                wItem[m].ImageText = $com.util.template(ImagePathArray, mHTML.IMGLIST);
                            } else {
                                wItem[m].ImageText = "";
                            }

                        }
                        $("#femi-Device-tbody-item").html($com.util.template(wItem, mHTML.TableNode_item));
                        $com.app.loaded();
                    }
                });
            },
            // checkImage:function(ImagePathList,wItem[m]){
            //     ImagePathArray=[];
            //     for (var k = 0; k < ImagePathList.length; k++) {
            //         SrcListObj = {
            //             ID: k + 1,
            //             SrcList: ImagePathList[k]
            //         }
            //         ImagePathArray.push(SrcListObj);
            //     }
            //     wItem[m].ImageText = $com.util.template(ImagePathArray, mHTML.IMGLIST);
            // },
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
            //查询修程列表
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

            //查询信息
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
            getIPTSolveLib: function (data, fn, context) {
                var d = {
                    $URI: "/IPTSolveLib/All",
                    $TYPE: "Get",
                    $SERVER: "/MESQMS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络！');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //更新
            updateIPTSolveLib: function (data, fn, context) {
                var d = {
                    $URI: "/IPTSolveLib/Update",
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