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

            '<td style="min-width: 50px" data-title="PDFConfigID" data-value="{{PDFConfigID}}">{{PDFConfigID}}</td>',
            '<td style="min-width: 50px" data-title="PartTitle" data-value="{{PartTitle}}">{{PartTitle}}</td>',
            '<td style="min-width: 50px" data-title="OrderNo" data-value="{{OrderNo}}">{{OrderNo}}</td>',
           
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
            "PDFConfigID|一级标题|ArrayOne",
            "PartTitle|二级标题",
            "OrderNo|顺序",
           
        ];

        mDefault_Value_Modal = {
            'PDFConfigID': 0,
            'OrderNo':0,
            'PartTitle': ""
        };

        mKeyword_Search = {};

        mFormatter_Search = {};


        mTypeSource_Search = {
           
            PDFConfigID: [],
          

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
        name: '二级标题',

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
                        'PDFConfigID': 0,
                        'PartTitle': 0,
                        'OrderNo': 0,
                        'IPTPDFStandardList':[],
                    };

                    wModelTemp.PDFConfigID = Number(rst.PDFConfigID);
                    wModelTemp.OrderNo = Number(rst.OrderNo);
                    wModelTemp.PartTitle = rst.PartTitle;


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
                    'PartTitle': SelectData[0].PartTitle,                   

                };
                $("body").append($com.modal.show(default_value, mKeyword_Search, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    SelectData[0].PartTitle = rst.PartTitle;
                  
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
               


                }

                //
                model.com.deleteList({
                    'data': SelectData,
                  
                }, function (res) {

                    alert("删除成功!");
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
            model.com.getPDFConfig({'ID': -1, 'LineID': -1, 'ProductID': -1, 'CustomID': -1, 'Active': 1}, function (res) {
                //渲染工区列表
                $.each(res.list, function (i, item) {
                    mTypeSource_Search.PDFConfigID.push({
                        'name': item.ConfigName,
                        'value': item.ID,
                    })
                });
                model.com.refresh();

             



            });






        },

        com: {
            //刷新界面
            refresh: function () {
                $com.app.loading('数据加载中...');
                model.com.getAreaDepartmentList({ 'ID': -1, 'PDFConfigID': -1}, function (res) {
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
             //获取一级标题列表
             getPDFConfig: function (data, fn, context) {
                var d = {
                    $URI: "/IPTPDFConfig/All",
                    $TYPE: "Get",
                    $SERVER: "/MESQMS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络！');
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
            //获取二级标题列表
            getAreaDepartmentList: function (data, fn, context) {
                var d = {
                    $URI: "/IPTPDFPart/All",
                    $TYPE: "Get",
                    $SERVER: "/MESQMS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络！');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //二级标题更新
            updateAreaDepartment: function (data, fn, context) {
                var d = {
                    $URI: "/IPTPDFPart/Update",
                    $TYPE: "Post",
                    $SERVER: "/MESQMS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络！');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
             //二级标题删除
             deleteList: function (data, fn, context) {
                var d = {
                    $URI: "/IPTPDFPart/DeleteList",
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