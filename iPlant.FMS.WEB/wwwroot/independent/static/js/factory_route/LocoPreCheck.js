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
    var mID = 0;
    var standardInfoListSearch = []; //筛选
    var mSoplist = []; //筛选


    var KETWROD_LIST_Item,
        KETWROD_Item,
        Formattrt_Item,
        Defaul_Value_Item,
        TypeSource_Item;

    mHTML = {
        TableNode_item: [
            '<tr data-color="">',
            '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',

            '<td style="min-width: 50px" data-title="CustomID" data-value="{{CustomID}}">{{CustomID}}</td>',
            '<td style="min-width: 50px" data-title="LineID" data-value="{{LineID}}">{{LineID}}</td>',
            '<td style="min-width: 50px" data-title="ProductNo" data-value="{{ProductNo}}">{{ProductNo}}</td>',
            '<td style="min-width: 50px" data-title="Remark" data-value="{{Remark}}">{{Remark}}</td>',

            '</tr>',
        ].join(""),
        StandardList: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="ShowID" data-value="{{ShowID}}" >{{ShowID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td data-title="MajorItem" data-value="{{MajorItem}}" >{{MajorItem}}</td>',
            '<td data-title="MiddleItem" data-value="{{MiddleItem}}" >{{MiddleItem}}</td>',
            '<td data-title="SubItem" data-value="{{SubItem}}" >{{SubItem}}</td>',
            '<td data-title="TechStandard" data-value="{{TechStandard}}" >{{TechStandard}}</td>',
            '<td data-title="Unit" data-value="{{Unit}}" >{{Unit}}</td>',
            // '<td data-title="Text" data-value="{{Text}}" >{{Text}}</td>',
            '<td data-title="StandardValue" data-value="{{StandardValue}}" >{{StandardValue}}</td>',
            // '<td data-title="DefaultValue" data-value="{{DefaultValue}}" >{{DefaultValue}}</td>',
            '<td data-title="StandardType" data-value="{{StandardType}}" >{{StandardType}}</td>',
            // '<td data-title="StandardBaisc" data-value="{{StandardBaisc}}" >{{StandardBaisc}}</td>',
            '<td data-title="StandardLeft" data-value="{{StandardLeft}}" >{{StandardLeft}}</td>',
            '<td data-title="StandardRight" data-value="{{StandardRight}}" >{{StandardRight}}</td>',

            // '<td data-title="Visiable" data-value="{{Visiable}}" >{{Visiable}}</td>',
            // '<td data-title="Standard" data-value="{{Standard}}" >{{Standard}}</td>',
            '<td data-title="OptionsItem" data-value="{{OptionsItem}}" >{{OptionsItem}}</td>',
            '<td data-title="SolveItemText" data-value="{{SolveItemText}}" >{{SolveItemText}}</td>',

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
    };

    //查询字段定义
    mDefault_Value_Search = {
        'StartTime': new Date(),
        'EndTime': new Date(),
    };
    //新增标准项
    Defaul_Value_Item = {
        //Text: "",
        StandardValue: "",
        //DefaultValue: "",
        StandardType: 15,
        //StandardBaisc: "",
        StandardLeft: 0,
        StandardRight: 0,
        Unit: '',
        //Visiable: true,
        ValueSource: 0,
        MajorItem: '',
        MiddleItem: '',
        SubItem: '',
        TechStandard: '',
        SolveItem: 0,




    };

    (function () {

        KETWROD_LIST_Item = [
            "MajorItem|工艺要求",
            "MiddleItem|过程",
            "SubItem|描述",
            "TechStandard|技术标准",
            "Unit|单位",
            "Text|文本",
            "StandardValue|标准值",
            "DefaultValue|默认值",
            "StandardType|值类型|ArrayOne",
            "StandardBaisc|基准值",
            "StandardLeft|下限",
            "StandardRight|上限",
            "Visiable|是否可见|ArrayOne",
            "ValueSource|数据源|InputArray",
            "SolveItem|解决方案|Array",

        ];

        KETWROD_Item = {};

        Formattrt_Item = {};

        TypeSource_Item = {
            SolveItem: [
                {
                    name: "无",
                    value: 0
                }
            ],
            Visiable: [
                {
                    name: "是",
                    value: true
                },
                {
                    name: "否",
                    value: false
                }
            ],
            StandardType: [

                {
                    name: "无",
                    value: 15
                },
                {
                    name: "文本",
                    value: 0
                },
                {
                    name: "下拉框",
                    value: 1
                },
                {
                    name: "不包含",
                    value: 2
                },
                {
                    name: "包含",
                    value: 3
                },
                {
                    name: "右包含",
                    value: 4
                },
                {
                    name: "左包含",
                    value: 5
                }, {
                    name: "小于",
                    value: 6
                },
                {
                    name: "大于",
                    value: 7
                },
                {
                    name: "小于等于",
                    value: 8
                },
                {
                    name: "大于等于",
                    value: 9
                },
                {
                    name: "等于",
                    value: 10
                },
                {
                    name: "多选",
                    value: 11
                },
                {
                    name: "不合格原因",
                    value: 12
                },
                {
                    name: "多数字输入",
                    value: 13
                },
                {
                    name: "多文本输入",
                    value: 14
                }
            ],
            ValueSource: [
                {
                    value: 0,
                    name: 0,
                    far: 1
                }
            ]
        };
        $.each(KETWROD_LIST_Item, function (i, item) {
            var detail = item.split("|");
            KETWROD_Item[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };

            if (detail.length > 2) {
                Formattrt_Item[detail[0]] = $com.util.getFormatter(TypeSource_Item, detail[0], detail[2]);
            }
        });
    })();
    //初始化字段模板
    (function () {

        mKeyword_List_Search = [
            "CustomID|局段|ArrayOne",
            "LineID|修程|ArrayOne",
            "ProductID|车型|ArrayOne",
            'Remark|备注',
            "CreateTime|编辑时刻|DateTime",
            "Active|可用|ArrayOne",
        ];

        mDefault_Value_Modal = {
            'CustomID': 0,
            'LineID': 0,
            'ProductID': 0,
            'Remark': "",
            // 'Active': 1,
        };

        mKeyword_Search = {};

        mFormatter_Search = {};


        mTypeSource_Search = {
            CustomID: [],
            LineID: [],
            ProductID: [],
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
        name: '预检标准',

        type: $com.Model.MAIN, //主方法

        configure: function () {
            this.run();
        },

        events: function () {
            //Enter触发模糊查询事件
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var
                        value = $("#alfie-search-Device-item").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-Device-tbody-item").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-Device-tbody-item"), mCloneData, value, "ID");

                }
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
            //Enter触发模糊查询事件
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var
                        value = $("#alfie-search-Device-itemItem").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-Device-tbody-itemItem").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-Device-tbody-itemItem"), standardInfoListSearch, value, "ID");

                }
            });
            //条件查询
            $("body").delegate("#alfie-Device-searchItem", "click", function () {
                var
                    value = $("#alfie-search-Device-itemItem").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-Device-tbody-itemItem").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-Device-tbody-itemItem"), standardInfoListSearch, value, "ID");
            });


            //标准新增
            $("body").delegate("#alfie-add-level", "click", function () {

                $("body").append($com.modal.show(mDefault_Value_Modal, mKeyword_Search, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    var inputDate = {
                        ID: 0,
                        CompanyID: 0,
                        BusinessUnitID: 0,
                        BaseID: 0,
                        FactoryID: 0,
                        WorkShopID: 0,
                        IPTMode: 9,
                        IsCurrent: 0,
                        IsEnd: 0,
                        IsUseD: 0,
                        ItemList: [],
                        LineID: 0,
                        PartID: 0,
                        PartPointID: 0,
                        StationID: 0,
                        ProductNo: "",
                        ProductID: 0,
                        Remark: "",
                        CustomID: 0,
                        TModify: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                        //UserID: window.parent.User_Info.ID,
                    };

                    inputDate.LineID = Number(rst.LineID);
                    inputDate.ProductID = Number(rst.ProductID);
                    inputDate.ProductNo = mFormatter_Search["ProductID"](inputDate.ProductID);
                    inputDate.CustomID = Number(rst.CustomID);
                    inputDate.Remark = rst.Remark;

                    model.com.postSaveStandard({
                        data: inputDate,
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                    });
                }, mTypeSource_Search));
            });
            //标准修改
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
                    'LineID': SelectData[0].LineID,
                    'ProductID': SelectData[0].ProductID,
                    'CustomID': SelectData[0].CustomID,
                    'Remark': SelectData[0].Remark,
                };
                $("body").append($com.modal.show(default_value, mKeyword_Search, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    SelectData[0].LineID = Number(rst.LineID);
                    SelectData[0].ProductID = Number(rst.ProductID);
                    SelectData[0].ProductNo = mFormatter_Search["ProductID"](SelectData[0].ProductID);
                    SelectData[0].CustomID = Number(rst.CustomID);
                    SelectData[0].Remark = rst.Remark;

                    //去小写
                    $com.util.deleteLowerProperty(SelectData[0]);

                    model.com.postSaveStandard({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                    })

                }, mTypeSource_Search));
            });
            //刷新
            $("body").delegate("#alfie-refresh-po", "click", function () {
                model.com.refresh();
            });
            //alfie-refresh-poItem
            //刷新
            $("body").delegate("#alfie-refresh-poItem", "click", function () {
                model.com.StandardItem(mID);
            });


            //
            $("body").delegate("#lmvt-standarditem-return", "click", function () {
                $(".zzza").show();

                $(".zzzb").hide();
                model.com.refresh();
            });

            $("body").delegate("#femi-Device-tbody-item tr", "dblclick", function () {
                var $this = $(this);

                var WID = Number($this.find('td[data-title=ID]').attr('data-value'));
                mID = WID;
                $(".zzza").hide();

                $(".zzzb").show();
                model.com.StandardItem(mID);
                return false;
            });

            //新增标准项
            $("body").delegate("#lmvt-standarditem-add", "click", function () {

                if (mID <= 0) {
                    alert("当前未选择标准");
                    return;
                }

                var dataSource;

                $.each(mData, function (i, item) {
                    if (item.ID == mID)
                        dataSource = item;
                });
                $("body").append($com.modal.show(Defaul_Value_Item, KETWROD_Item, "新增标准项", function (rst) {
                    if (!rst || $.isEmptyObject(rst)) {
                        return false;
                    }
                    if (!rst.Standard) {
                        rst.Standard = [];
                    }

                    model.com.getStandardInfo({ ID: dataSource.ID }, function (res) {
                        if (!res)
                            return;
                        dataSource.ItemList = res.info.ItemList;
                        for (var i = 0; i < dataSource.ItemList.length; i++) {
                            $com.util.deleteLowerProperty(dataSource.ItemList[i]);
                        }


                        var _data = {
                            MajorItem: rst.MajorItem,
                            MiddleItem: rst.MiddleItem,
                            SubItem: rst.SubItem,
                            TechStandard: rst.TechStandard,
                            Text: "",
                            DefaultValue: "",
                            StandardValue: rst.StandardValue,
                            StandardType: Number(rst.StandardType),
                            StandardBaisc: 0,
                            StandardLeft: rst.StandardLeft,
                            StandardRight: rst.StandardRight,
                            Unit: rst.Unit,
                            Visiable: true,
                            ValueSource: rst.ValueSource,
                            ItemType: 3,
                            IPTSOPList: [],
                        };
                        if (rst.SolveItem.length > 0) {
                            for (var index = 0; index < rst.SolveItem.length; index++) {
                                if (Number(rst.SolveItem[index]) > 0) {
                                    for (var j = 0; j < mSoplist.length; j++) {
                                        if (Number(rst.SolveItem[index] == mSoplist[j].ID)) {
                                            $com.util.deleteLowerProperty(mSoplist[j]);
                                            _data.IPTSOPList.push(mSoplist[j])

                                        };

                                    }

                                };

                            }
                        }

                        _data.Standard = model.com.CountStandard(_data, Number(rst.StandardType))
                        dataSource.ItemList.push(_data);

                        delete dataSource.IsCurrentText;
                        delete dataSource.IsUsedText;


                        $com.util.deleteLowerProperty(dataSource);
                        model.com.postSaveStandard({
                            data: dataSource,
                        }, function (res) {
                            alert("新增项成功！！");

                            model.com.StandardItem(mID);


                        });
                    });
                }, TypeSource_Item));

            });
            //删除标准项
            $("body").delegate("#lmvt-standarditem-delete", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-itemItem"), "ShowID", standardInfoData);

                if (!SelectData || !SelectData.length) {
                    alert("至少选择一行数据再试！")
                    return;
                }
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }


                if (mID <= 0) {
                    alert("当前未选择标准");
                    return;
                }

                var dataSource;

                $.each(mData, function (i, item) {
                    if (item.ID == mID)
                        dataSource = item;
                });

                if (dataSource.IsUsed == 1) {
                    alert("该标准已经被使用")
                    return;
                }

                model.com.getStandardInfo({ ID: dataSource.ID }, function (res) {
                    if (!res)
                        return;
                    dataSource.ItemList = res.info.ItemList;

                    for (var i = 0; i < dataSource.ItemList.length; i++) {
                        $com.util.deleteLowerProperty(dataSource.ItemList[i]);
                    }
                    var iCount = 0;
                    for (var i = 0; i < dataSource.ItemList.length - iCount; i++) {
                        for (var j = 0; j < SelectData.length; j++) {
                            if (SelectData[j].ID == dataSource.ItemList[i].ID) {
                                dataSource.ItemList.splice(i, 1);
                                iCount++;
                            }
                        }
                    }

                    delete dataSource.IsCurrentText;
                    delete dataSource.IsUsedText;


                    $com.util.deleteLowerProperty(dataSource);
                    model.com.postSaveStandard({
                        data: dataSource,
                    }, function (res) {
                        alert("删除项成功！！");

                        model.com.StandardItem(mID);
                    });
                });

            });
            //修改标准项
            $("body").delegate("#lmvt-standardtable-change", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-Device-tbody-itemItem"), "ShowID", standardInfoData);

                if (!SelectData || !SelectData.length) {
                    alert("至少选择一行数据！")
                    return;
                }

                if (SelectData.length != 1) {
                    alert("只能选择一行数据！")
                    return;
                }

                $com.util.deleteLowerProperty(SelectData[0]);

                if (mID <= 0) {
                    alert("当前未选择标准");
                    return;
                }

                var dataSource;

                $.each(mData, function (i, item) {
                    if (item.ID == mID)
                        dataSource = item;
                });


                var Defaul_Value = {
                    //Text: SelectData[0].Text,
                    MajorItem: SelectData[0].MajorItem,
                    MiddleItem: SelectData[0].MiddleItem,
                    SubItem: SelectData[0].SubItem,
                    TechStandard: SelectData[0].TechStandard,
                    StandardValue: SelectData[0].StandardValue,
                    // DefaultValue: SelectData[0].DefaultValue,
                    StandardType: SelectData[0].StandardType,
                    // StandardBaisc: SelectData[0].StandardBaisc,
                    StandardLeft: SelectData[0].StandardLeft,
                    StandardRight: SelectData[0].StandardRight,
                    Unit: SelectData[0].Unit,
                    //Visiable: SelectData[0].Visiable,
                    ValueSource: SelectData[0].ValueSource,
                    SolveItem: [],

                };
                for (var i = 0; i < SelectData[0].IPTSOPList.length; i++) {
                    Defaul_Value.SolveItem.push(SelectData[0].IPTSOPList[i].ID);

                }

                $("body").append($com.modal.show(Defaul_Value, KETWROD_Item, "修改标准项", function (rst) {
                    if (!rst || $.isEmptyObject(rst)) {
                        return false;
                    }
                    if (!rst.Standard) {
                        rst.Standard = [];
                    }

                    model.com.getStandardInfo({ ID: dataSource.ID }, function (res) {
                        if (!res)
                            return;
                        dataSource.ItemList = res.info.ItemList;


                        for (var i = 0; i < dataSource.ItemList.length; i++) {
                            $com.util.deleteLowerProperty(dataSource.ItemList[i]);
                        }

                        var _data = {
                            MajorItem: rst.MajorItem,
                            MiddleItem: rst.MiddleItem,
                            SubItem: rst.SubItem,
                            TechStandard: rst.TechStandard,
                            //Text: rst.Text,
                            //DefaultValue: rst.DefaultValue,
                            StandardValue: rst.StandardValue,
                            StandardType: Number(rst.StandardType),
                            //StandardBaisc: rst.StandardBaisc,
                            StandardLeft: rst.StandardLeft,
                            StandardRight: rst.StandardRight,
                            Unit: rst.Unit,
                            //Visiable: rst.Visiable == "true" ? true : false,
                            ValueSource: rst.ValueSource,
                            IPTSOPList: [],
                        };

                        if (rst.SolveItem.length > 0) {
                            for (var index = 0; index < rst.SolveItem.length; index++) {
                                if (Number(rst.SolveItem[index]) > 0) {
                                    for (var j = 0; j < mSoplist.length; j++) {
                                        if (Number(rst.SolveItem[index] == mSoplist[j].ID)) {
                                            $com.util.deleteLowerProperty(mSoplist[j]);
                                            _data.IPTSOPList.push(mSoplist[j])

                                        };

                                    }

                                };

                            }
                        }

                        _data.Standard = model.com.CountStandard(_data, Number(rst.StandardType));

                        $.each(dataSource.ItemList, function (i, item) {
                            if (item.ID == SelectData[0].ID) {
                                item.MajorItem = _data.MajorItem;
                                item.MiddleItem = _data.MiddleItem;
                                item.SubItem = _data.SubItem;
                                item.TechStandard = _data.TechStandard;
                                //item.Text = _data.Text;
                                //item.DefaultValue = _data.DefaultValue;
                                item.StandardValue = _data.StandardValue;
                                item.StandardType = _data.StandardType;
                                //item.StandardBaisc = _data.StandardBaisc;
                                item.StandardLeft = _data.StandardLeft;
                                item.StandardRight = _data.StandardRight;
                                item.Unit = _data.Unit;

                                item.ValueSource = _data.ValueSource;
                                item.Standard = _data.Standard;
                                item.IPTSOPList = _data.IPTSOPList;
                            }
                        });

                        delete dataSource.IsCurrentText;
                        delete dataSource.IsUsedText;

                        $com.util.deleteLowerProperty(dataSource);

                        model.com.postSaveStandard({
                            data: dataSource,
                        }, function (res) {
                            alert("修改项成功！！");

                            model.com.StandardItem(mID);

                        });
                    });
                }, TypeSource_Item));

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

                        //解决方案
                        model.com.getSopList({ 'ID': -1, 'Type': -1 }, function (resP) {

                            mSoplist = $com.util.Clone(resP.list);
                            $.each(resP.list, function (i, item) {
                                TypeSource_Item.SolveItem.push({
                                    name: item.Name,
                                    value: item.ID,
                                });
                            });

                            model.com.refresh();
                        });
                    });
                });

            });

        },

        com: {
            //刷新界面
            refresh: function () {
                $com.app.loading('数据加载中...');
                model.com.getStandardAll({
                    IPTMode: 9, BusinessUnitID: -1, BaseID: -1, FactoryID: -1, WorkShopID: -1, LineID: -1, PartID: -1, PartPointID: -1, StationID: -1, CustomID: -1, ProductID: -1
                }, function (res) {
                    if (res && res.list) {
                        res.list.sort(function (a, b) { return Number(a.ID) - Number(b.ID) });
                        mData = $com.util.Clone(res.list);
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
            //获取列表
            getSopList: function (data, fn, context) {
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
            //当前标准项表
            getStandardInfo: function (data, fn, context) {
                var d = {
                    $URI: "/IPTStandard/StandardInfo",
                    $TYPE: "get",
                    $SERVER: '/MESQMS',
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            StandardItem: function (wID) {
                model.com.getStandardInfo({ ID: wID }, function (res) {
                    if (!res)
                        return;
                    standardInfoList = res.info.ItemList;

                    standardInfoData = $com.util.Clone(res.info.ItemList);
                    for (var index = 0; index < standardInfoData.length; index++) {
                        standardInfoData[index].ShowID = index + 1;;

                    }

                    standardInfoList = $com.util.Clone(standardInfoList);

                    $.each(standardInfoList, function (i, item) {
                        item.ShowID = i + 1;
                        item.OptionsItem = '';
                        for (var k = 0; k < item.ValueSource.length; k++) {
                            item.OptionsItem += item.ValueSource[k] + ";"

                        }

                        item.SolveItemText = '';
                        for (var k = 0; k < item.IPTSOPList.length; k++) {
                            item.SolveItemText += item.IPTSOPList[k].Name + ";"

                        }


                        for (var p in item) {
                            if (!Formattrt_Item[p])
                                continue;
                            if (p == "Unit")
                                continue;
                            item[p] = Formattrt_Item[p](item[p]);
                        }
                    });

                    standardInfoListSearch = $com.util.Clone(standardInfoList);
                    $("#femi-Device-tbody-itemItem").html($com.util.template(standardInfoList, mHTML.StandardList));

                });
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
            //标准查询
            getStandardAll: function (data, fn, context) {
                var d = {
                    $URI: "/IPTStandard/StandardAll",
                    $TYPE: "get",
                    $SERVER: '/MESQMS',
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //运算
            CountStandard: function (StandardObject, number) {
                var standardString;
                switch (number) {
                    case 0: standardString = StandardObject.StandardValue; break;
                    case 1: standardString = StandardObject.StandardValue; break;
                    case 2: standardString = "范围：" + StandardObject.StandardLeft + "＜" + " n " + "＜" + StandardObject.StandardRight; break;
                    case 3: standardString = "范围：" + StandardObject.StandardLeft + "≤" + " n " + "≤" + StandardObject.StandardRight; break;
                    case 4: standardString = "范围：" + StandardObject.StandardLeft + "＜" + " n " + "≤" + StandardObject.StandardRight; break;
                    case 5: standardString = "范围：" + StandardObject.StandardLeft + "≤" + " n " + "＜" + StandardObject.StandardRight; break;
                    case 6: standardString = "范围：" + " n " + "＜" + StandardObject.StandardRight; break;
                    case 7: standardString = "范围：" + " n " + "＞" + StandardObject.StandardLeft; break;
                    case 8: standardString = "范围：" + " n " + "≤" + StandardObject.StandardRight; break;
                    case 9: standardString = "范围：" + " n " + "≥" + StandardObject.StandardLeft; break;
                    case 10: standardString = " n " + "=" + StandardObject.StandardValue; break;
                    case 11:
                    case 12:
                    case 13:
                    case 14: standardString = StandardObject.StandardValue; break;
                    default: break;
                }
                return standardString;
            },
            //保存标准
            postSaveStandard: function (data, fn, context) {
                var d = {
                    $URI: "/IPTStandard/SaveStandard",
                    $TYPE: "post",
                    $SERVER: '/MESQMS',
                };
                function err() {
                    $com.app.tip('提交失败，请检查网络');
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
        }
    }),
        model.init();
});