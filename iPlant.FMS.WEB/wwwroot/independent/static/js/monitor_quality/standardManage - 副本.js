require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/jquery.treeview', '../static/utils/js/base/table-select'],
    function ($lin, $com, $treeview) {

        var HTML,
            arry,
            wSelectID,
            lSelectID,
            pSelectID,
            iSelectID,
            dSelectID,

            sharpenerID,
            ChangeData,
            SelectList,
            Data_WorkSourc,

            Count,
            ID,
            SonNumber,
            SinID,
            Data_PartPointList,
            number,
            num,
            Options,

            Data_Source_Buzzer,
            Buzzer_List,
            UserID,
            UserName,
            UserList,

            MaterialList,

            Defaul_Value_Standard,
            KETWROD_LIST_Standard,
            KETWROD_Standard,
            Formattrt_Standard,
            TypeSource_Standard,

            Defaul_Value_Item,
            KETWROD_LIST_Item,
            KETWROD_Item,
            Formattrt_Item,
            TypeSource_Item,
            //配置参数
            KeepDayMin,
            TOPNumMax,
            TOPNumMin,
            KeepDayNow,
            TopNumNow,

            standardInfoData,
            standardInfoList,
            //产线对应的工段
            partSource;

        HTML = {
            BuzzerList: [
                '<tr>',
                '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></th>',
                '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
                '<td style="min-width: 80px" data-title="Type" data-value="{{Type}}">{{Type}}</td>',
                '<td style="min-width: 80px" data-title="SharpenerNo" data-value="{{SharpenerNo}}">{{ SharpenerNo}}</td>',
                '<td style="min-width: 50px" data-title="Material" data-value="{{Material}}" >{{ Material}}</td>',
                '<td style="min-width: 50px" data-title="Granularity" data-value="{{Granularity}}" >{{ Granularity}}</td>',
                '<td style="min-width: 80px" data-title="Hardness" data-value="{{Hardness}}" >{{ Hardness}}</td>',
                '<td style="min-width: 100px" data-title="WJORLength" data-value="{{WJORLength}}" >{{ WJORLength}}</td>',
                '<td style="min-width: 100px" data-title="NKORWidth" data-value="{{NKORWidth}}" >{{ NKORWidth}}</td>',
                '<td style="min-width: 80px" data-title="Height" data-value="{{Height}}" >{{ Height}}</td>',
                '<td style="min-width: 60px" data-title="OpreatorID" data-value="{{OpreatorID}}" >{{ OpreatorID}}</td>',
                '<td style="min-width: 80px" data-title="CreateTime" data-value="{{CreateTime}}" >{{ CreateTime}}</td>',
                '<td style="min-width: 80px" data-title="UpdateTime" data-value="{{UpdateTime}}" >{{ UpdateTime}}</td>',
                '<td style="min-width: 50px" data-title="Status" data-value="{{Status}}" >{{ Status}}</td>',
                '<tr>'
            ].join(""),

            StandardList: [
                '<tr>',
                '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td data-title="ShowID" data-value="{{ShowID}}" >{{ShowID}}</td>',
                '<td data-title="Text" data-value="{{Text}}" >{{Text}}</td>',
                '<td data-title="StandardValue" data-value="{{StandardValue}}" >{{StandardValue}}</td>',
                '<td data-title="DefaultValue" data-value="{{DefaultValue}}" >{{DefaultValue}}</td>',
                '<td data-title="StandardType" data-value="{{StandardType}}" >{{StandardType}}</td>',
                '<td data-title="StandardBaisc" data-value="{{StandardBaisc}}" >{{StandardBaisc}}</td>',
                '<td data-title="StandardLeft" data-value="{{StandardLeft}}" >{{StandardLeft}}</td>',
                '<td data-title="StandardRight" data-value="{{StandardRight}}" >{{StandardRight}}</td>',
                '<td data-title="Unit" data-value="{{Unit}}" >{{Unit}}</td>',
                '<td data-title="Visiable" data-value="{{Visiable}}" >{{Visiable}}</td>',
                '<td data-title="Standard" data-value="{{Standard}}" >{{Standard}}</td>',
                '</tr>',
            ].join(""),

            TreePartItemNode: [
                '<li data-value="{{UnitID}}"  class="click-delegate part">',
                '<span style="vertical-align:top;"><input type="checkbox" class="femi-tree-checkbox" style="margin: 1px 0px 1px;display:none"  value="{{FunctionID}}"  />{{Name}}</span> ',
                '<ul>{{Items}}</ul>',
                '</li> ',
            ].join(""),
            TreePartPointItemNode: [
                '<li data-value="{{UnitID}}"  class="click-delegate part">',
                '<span style="vertical-align:top;"><input type="checkbox" class="femi-tree-checkbox" style="margin: 1px 0px 1px;display:none"  value="{{FunctionID}}"  />{{Name}}</span> ',
                '<ul>{{Items}}</ul>',
                '</li> ',
            ].join(""),
            TreeMaterialNode: [
                '<li data-value="{{MaterialNo}}"  class="click-delegate part">',
                '<span style="vertical-align:top;"><input type="checkbox" class="femi-tree-checkbox" style="margin: 1px 0px 1px;display:none"  value="{{FunctionID}}"  />{{MaterialName}}</span> ',
                '<ul>{{Items}}</ul>',
                '</li> ',
            ].join(""),
            //TreePartPointItemNode: [
            //    '<li data-value="{{UnitID}}"  class="click-delegate partpoint" >',
            //    '<span style="vertical-align:top;"><input type="checkbox" class="femi-tree-checkbox" style="margin: 1px 0px 1px"  value="{{FunctionID}}"  />{{Name}}</span> ',
            //    '</li> ',
            //].join(""),

            //TreePartPointItemDepth: [
            //    '<li data-value="{{ID}}"  class="click-delegate partpoint" >',
            //    '<span style="vertical-align:top;"><input type="checkbox" class="femi-tree-checkbox" style="margin: 1px 0px 1px"  value="{{FunctionID}}"  />{{Name}}</span> ',
            //    '</li> ',
            //].join(""),
        };
        Count = 0;
        num = 0;
        //新增标准项
        Defaul_Value_Item = {
            Text: "",
            StandardValue: "",
            DefaultValue: "",
            StandardType: 0,
            StandardBaisc: "",
            StandardLeft: 0,
            StandardRight: 0,
            Unit: 0,
            Visiable: true,
            ValueSource: 0,
        };
        (function () {

            KETWROD_LIST_Item = [
                "Text|文本",
                "StandardValue|标准值",
                "DefaultValue|默认值",
                "StandardType|值类型|ArrayOne",
                "StandardBaisc|基准值",
                "StandardLeft|下限",
                "StandardRight|上限",
                "Unit|单位|ArrayOne",
                "Visiable|是否可见|ArrayOne",
                "ValueSource|数据源|InputArray"
            ];

            KETWROD_Item = {};

            Formattrt_Item = {};

            TypeSource_Item = {
                Unit: [
                    {
                        name: "无",
                        value: ""
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

        //新增标准
        Defaul_Value_Standard = {
            ID: 0,
            Remark: "",
            KeepDay: 36500,
            TopNum: 100
        };
        (function () {

            KETWROD_LIST_Standard = [
                "ID|版本|Readonly",
                "Remark|名称",
                "KeepDay|持续时间",
                "TopNum|查询数量"
            ];

            KETWROD_Standard = {};

            Formattrt_Standard = {};

            TypeSource_Standard = {

            };

            $.each(KETWROD_LIST_Standard, function (i, item) {
                var detail = item.split("|");
                KETWROD_Standard[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_Standard[detail[0]] = $com.util.getFormatter(TypeSource_Standard, detail[0], detail[2]);
                }
            });
        })();

        model = $com.Model.create({
            name: '标准管理',

            type: $com.Model.MAIN,

            configure: function () {
                this.run();
            },

            events: function () {

                //返回
                $("body").delegate("#lmvt-grinding-back", "click", function () {
                    $(".zace-container").show();
                    $(".lmvt-container").hide();
                });
                //砂轮或者油田的提交
                $("body").delegate("#lmvt-table-submit", "click", function () {
                    if (!ChangeData) {
                        alert("当前未选择标准");
                        return;
                    }

                    var dataSource;

                    $.each(SelectList, function (i, item) {
                        if (item.ID == ChangeData)
                            dataSource = item;
                    });

                    var SelectData = $com.table.getSelectionData($(".lmvt-grinding-body"), "ID", Data_Source_Buzzer);

                    if (!SelectData || !SelectData.length) {
                        alert("至少选择一行数据再试！")
                        return;
                    }
                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其提交？")) {
                        return;
                    }

                    $(".zace-container").show();
                    $(".lmvt-container").hide();
                    var arry = [];
                    $.each(SelectData, function (i, item) {
                        arry.push(item.SharpenerNo);
                    });

                    Defaul_Value_Item = {
                        Text: "砂轮库",
                        StandardValue: (SelectData[0].SharpenerNo),
                        DefaultValue: SelectData[0].SharpenerNo,
                        StandardType: 1,
                        StandardBaisc: "",
                        StandardLeft: 0,
                        StandardRight: 0,
                        Unit: SelectData[0].Unit,
                        Visiable: true,
                        ValueSource: arry,
                    };

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

                            var _data = {
                                Text: rst.Text,
                                DefaultValue: rst.DefaultValue,
                                StandardValue: rst.StandardValue,
                                StandardType: Number(rst.StandardType),
                                StandardBaisc: rst.StandardBaisc,
                                StandardLeft: rst.StandardLeft,
                                StandardRight: rst.StandardRight,
                                Unit: Formattrt_Item["Unit"](rst.Unit),
                                Visiable: rst.Visiable == "true" ? true : false,
                                ValueSource: rst.ValueSource,
                            };

                            _data.Standard = model.com.CountStandard(_data, Number(rst.StandardType))
                            dataSource.ItemList.push(_data);

                            delete dataSource.IsCurrentText;
                            delete dataSource.IsUsedText;

                            model.com.postSaveStandard({
                                data: dataSource,
                            }, function (res) {
                                alert("新增项成功！！");
                                model.com.refresh();
                                $.each(partSource, function (i, item) {
                                    if (item.UnitID == lSelectID) {
                                        model.com.renderTree(item.UnitList);
                                    }
                                });
                                model.com.Romance(SinID, ID);
                                model.com.StandardItem(ChangeData);
                            });
                        });
                    }, TypeSource_Item));

                });
                //查询数量
                $("body").delegate("#lmvt-TOPNum-Input", "change", function () {

                    if (!confirm("确定修改标准配置？")) {
                        $("#lmvt-TOPNum-Input[type='text']").val(TopNumNow);
                        return;
                    }

                    if (KeepDayMin)
                        KeepDayMin
                    TOPNumMax
                    TOPNumMin

                    var _data = {
                        KeepDay: $("#lmvt-KeepDay-Input[type='text']").val(),
                        TOPNum: $("#lmvt-TOPNum-Input[type='text']").val(),
                    };

                    if (_data.TOPNum < TOPNumMin || _data.TOPNum > TOPNumMax) {
                        alert("可以设置的最大数量为" + TOPNumMax + "最小数量为" + TOPNumMin);
                        model.com.refresh();
                        return false;
                    }

                    model.com.postSaveConfig({
                        data: _data
                    }, function (res) {
                        alert("设置成功");
                        model.com.refresh();
                        $.each(partSource, function (i, item) {
                            if (item.UnitID == lSelectID) {
                                model.com.renderTree(item.UnitList);
                            }
                        });
                        model.com.Romance(SinID, ID);
                    });
                });
                //持续时间
                $("body").delegate("#lmvt-KeepDay-Input", "change", function () {

                    if (!confirm("确定修改标准配置？")) {
                        $("#lmvt-KeepDay-Input[type='text']").val(KeepDayNow);
                        return;
                    }

                    var _data = {
                        KeepDay: $("#lmvt-KeepDay-Input[type='text']").val(),
                        TOPNum: $("#lmvt-TOPNum-Input[type='text']").val(),
                    };
                    if (_data.KeepDay < KeepDayMin) {
                        alert("持续时间最小天数为" + KeepDayMin + "天");
                        model.com.refresh();
                        return false;
                    }

                    model.com.postSaveConfig({
                        data: _data
                    }, function (res) {
                        alert("设置成功");
                        model.com.refresh();
                        $.each(partSource, function (i, item) {
                            if (item.UnitID == lSelectID) {
                                model.com.renderTree(item.UnitList);
                            }
                        });
                        model.com.Romance(SinID, ID);
                    });
                });
                //新增标准
                $("body").delegate("#lmvt-standard-add", "click", function () {

                    $("body").append($com.modal.show(Defaul_Value_Standard, KETWROD_Standard, "新增标准", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }

                        if (!rst.Remark) {
                            alert("备注为空");
                            return false;
                        }
                        var inputDate;

                        if (iSelectID == 5) {
                            inputDate = {
                                ID: 0,
                                CompanyID: 0,
                                BusinessUnitID: 0,
                                BaseID: 0,
                                FactoryID: 0,
                                WorkShopID: 0,
                                IPTMode: iSelectID,
                                IsCurrent: 0,
                                IsEnd: 0,
                                IsUseD: 0,
                                ItemList: {},
                                LineID: 0,
                                PartID: 0,
                                PartPointID: 0,
                                StationID: 0,
                                ProductNo: pSelectID,
                                Remark: rst.Remark,
                                TModify: new Date(),
                            };
                        }
                        else {
                            if (dSelectID == 3)
                                inputDate = {
                                    ID: 0,
                                    CompanyID: 0,
                                    BusinessUnitID: 0,
                                    BaseID: 0,
                                    FactoryID: 0,
                                    WorkShopID: 0,
                                    IPTMode: iSelectID,
                                    IsCurrent: 0,
                                    IsEnd: 0,
                                    IsUseD: 0,
                                    ItemList: {},
                                    LineID: wSelectID,
                                    PartID: lSelectID,
                                    PartPointID: SinID,
                                    StationID: ID,
                                    ProductNo: pSelectID,
                                    Remark: rst.Remark,
                                    TModify: new Date(),
                                    //UserID: window.parent.User_Info.ID,
                                };
                            if (dSelectID == 4)
                                inputDate = {
                                    ID: 0,
                                    CompanyID: 0,
                                    BusinessUnitID: 0,
                                    BaseID: 0,
                                    FactoryID: 0,
                                    WorkShopID: 0,
                                    IPTMode: iSelectID,
                                    IsCurrent: 0,
                                    IsEnd: 0,
                                    IsUseD: 0,
                                    ItemList: {},
                                    LineID: wSelectID,
                                    PartID: lSelectID,
                                    PartPointID: SinID,
                                    StationID: ID,
                                    ProductNo: pSelectID,
                                    Remark: rst.Remark,
                                    TModify: new Date(),
                                    //UserID: window.parent.User_Info.ID,
                                };

                        }

                        model.com.postSaveStandard({
                            data: inputDate,
                        }, function (res) {
                            alert("新增成功！！");
                            model.com.refresh();
                            model.com.Romance(SinID, ID);
                            if (iSelectID != 5)
                                $.each(partSource, function (i, item) {
                                    if (item.UnitID == lSelectID) {
                                        model.com.renderTree(item.UnitList);
                                    }
                                });
                            else
                                model.com.renderTree(MaterialList);
                        });

                    }, TypeSource_Standard));

                });
                //新增标准项
                $("body").delegate("#lmvt-standarditem-add", "click", function () {

                    if (!ChangeData) {
                        alert("当前未选择标准");
                        return;
                    }

                    var dataSource;

                    $.each(SelectList, function (i, item) {
                        if (item.ID == ChangeData)
                            dataSource = item;
                    });

                    if (dataSource.IsUsed == 1) {
                        alert("该标准已经被使用")
                        return;
                    }

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

                            var _data = {
                                Text: rst.Text,
                                DefaultValue: rst.DefaultValue,
                                StandardValue: rst.StandardValue,
                                StandardType: Number(rst.StandardType),
                                StandardBaisc: rst.StandardBaisc,
                                StandardLeft: rst.StandardLeft,
                                StandardRight: rst.StandardRight,
                                Unit: Formattrt_Item["Unit"](rst.Unit),
                                Visiable: rst.Visiable == "true" ? true : false,
                                ValueSource: rst.ValueSource,
                            };

                            _data.Standard = model.com.CountStandard(_data, Number(rst.StandardType))
                            dataSource.ItemList.push(_data);

                            delete dataSource.IsCurrentText;
                            delete dataSource.IsUsedText;

                            model.com.postSaveStandard({
                                data: dataSource,
                            }, function (res) {
                                alert("新增项成功！！");
                                model.com.refresh();
                                if (iSelectID != 5)
                                    $.each(partSource, function (i, item) {
                                        if (item.UnitID == lSelectID) {
                                            model.com.renderTree(item.UnitList);
                                        }
                                    });
                                else
                                    model.com.renderTree(MaterialList);
                                model.com.StandardItem(ChangeData);

                            });
                        });
                    }, TypeSource_Item));

                });
                //删除标准项
                $("body").delegate("#lmvt-standarditem-delete", "click", function () {
                    var SelectData = $com.table.getSelectionData($(".zace-type-body"), "ShowID", standardInfoList);

                    if (!SelectData || !SelectData.length) {
                        alert("至少选择一行数据再试！")
                        return;
                    }
                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {
                        return;
                    }

                    if (!ChangeData) {
                        alert("当前未选择标准");
                        return;
                    }

                    var dataSource;

                    $.each(SelectList, function (i, item) {
                        if (item.ID == ChangeData)
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

                        model.com.postSaveStandard({
                            data: dataSource,
                        }, function (res) {
                            alert("修改项成功！！");
                            model.com.refresh();
                            if (iSelectID != 5)
                                $.each(partSource, function (i, item) {
                                    if (item.UnitID == lSelectID) {
                                        model.com.renderTree(item.UnitList);
                                    }
                                });
                            else
                                model.com.renderTree(MaterialList);
                            model.com.StandardItem(ChangeData);
                        });
                    });

                });
                //修改标准项
                $("body").delegate("#lmvt-standardtable-change", "click", function () {
                    var SelectData = $com.table.getSelectionData($(".zace-type-body"), "ShowID", standardInfoList);

                    if (!SelectData || !SelectData.length) {
                        alert("至少选择一行数据！")
                        return;
                    }

                    if (SelectData.length != 1) {
                        alert("只能选择一行数据！")
                        return;
                    }

                    if (!ChangeData) {
                        alert("当前未选择标准");
                        return;
                    }

                    var dataSource;

                    $.each(SelectList, function (i, item) {
                        if (item.ID == ChangeData)
                            dataSource = item;
                    });

                    if (dataSource.IsUsed == 1) {
                        alert("该标准已经被使用")
                        return;
                    }

                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其修改？")) {
                        return;
                    }

                    var Defaul_Value = {
                        Text: SelectData[0].Text,
                        StandardValue: SelectData[0].StandardValue,
                        DefaultValue: SelectData[0].DefaultValue,
                        StandardType: SelectData[0].StandardType,
                        StandardBaisc: SelectData[0].StandardBaisc,
                        StandardLeft: SelectData[0].StandardLeft,
                        StandardRight: SelectData[0].StandardRight,
                        Unit: SelectData[0].Unit,
                        Visiable: SelectData[0].Visiable,
                        ValueSource: SelectData[0].ValueSource,
                    };

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

                            var _data = {
                                Text: rst.Text,
                                DefaultValue: rst.DefaultValue,
                                StandardValue: rst.StandardValue,
                                StandardType: Number(rst.StandardType),
                                StandardBaisc: rst.StandardBaisc,
                                StandardLeft: rst.StandardLeft,
                                StandardRight: rst.StandardRight,
                                Unit: Formattrt_Item["Unit"](rst.Unit),
                                Visiable: rst.Visiable == "true" ? true : false,
                                ValueSource: rst.ValueSource,
                            };

                            _data.Standard = model.com.CountStandard(_data, Number(rst.StandardType));

                            $.each(dataSource.ItemList, function (i, item) {
                                if (item.ID == SelectData[0].ID) {
                                    item.Text = _data.Text;
                                    item.DefaultValue = _data.DefaultValue;
                                    item.StandardValue = _data.StandardValue;
                                    item.StandardType = _data.StandardType;
                                    item.StandardBaisc = _data.StandardBaisc;
                                    item.StandardLeft = _data.StandardLeft;
                                    item.StandardRight = _data.StandardRight;
                                    item.Unit = _data.Unit;
                                    item.Visiable = _data.Visiable;
                                    item.ValueSource = _data.ValueSource;
                                }
                            });

                            delete dataSource.IsCurrentText;
                            delete dataSource.IsUsedText;

                            model.com.postSaveStandard({
                                data: dataSource,
                            }, function (res) {
                                alert("修改项成功！！");
                                model.com.refresh();
                                if (iSelectID != 5)
                                    $.each(partSource, function (i, item) {
                                        if (item.UnitID == lSelectID) {
                                            model.com.renderTree(item.UnitList);
                                        }
                                    });
                                else
                                    model.com.renderTree(MaterialList);
                                model.com.StandardItem(ChangeData);

                            });
                        });
                    }, TypeSource_Item));

                });
                //另存为
                $("body").delegate("#lmvt-standard-saveOther", "click", function () {

                    var dataSource;

                    $.each(SelectList, function (i, item) {
                        if (item.ID == ChangeData)
                            dataSource = item;
                    });

                    //if (dataSource.IsCurrent == 1) {
                    //    alert("该标准已经被使用")
                    //    return;
                    //} `       

                    model.com.getStandardInfo({ ID: dataSource.ID }, function (res) {
                        if (!res)
                            return;
                        dataSource.ItemList = res.info.ItemList;

                        dataSource.IsUsed = 0;
                        dataSource.IsEnd = 0;
                        dataSource.ID = 0;

                        $.each(dataSource.ItemList, function (i, item) {
                            item.ID = 0;
                        });
                        model.com.postSaveStandard({
                            data: dataSource,
                        }, function (res) {
                            alert("新增成功！！");
                            model.com.refresh();
                            model.com.Romance(SinID, ID);
                            if (iSelectID != 5)
                                $.each(partSource, function (i, item) {
                                    if (item.UnitID == lSelectID) {
                                        model.com.renderTree(item.UnitList);
                                    }
                                });
                            else
                                model.com.renderTree(MaterialList);
                        });
                    });
                });
                // //新增砂轮库数据
                // $("body").delegate("#lmvt-sharpener-add", "click", function () {

                //     if (!ChangeData) {
                //         alert("当前未选择标准");
                //         return;
                //     }

                //     var dataSource;

                //     $.each(SelectList, function (i, item) {
                //         if (item.ID == ChangeData)
                //             dataSource = item;
                //     });

                //     if (dataSource.IsUsed == 1) {
                //         alert("该标准已经被使用")
                //         return;
                //     }

                //     $(".zace-container").hide();
                //     $(".lmvt-container").show();

                //     sharpenerID = dataSource.ID
                //     //$("body").append($com.modal.show(Defaul_Value_Item, KETWROD_Item, "新增标准项", function (rst) {
                //     //    if (!rst || $.isEmptyObject(rst)) {
                //     //        return false;
                //     //    }
                //     //    if (!rst.Standard) {
                //     //        rst.Standard = [];
                //     //    }

                //     //    model.com.getStandardInfo({ ID: SelectData[0].ID }, function (res) {
                //     //        if (!res)
                //     //            return;
                //     //        SelectData[0].ItemList = res.info.ItemList;

                //     //        var _data = {
                //     //            Text: rst.Text,
                //     //            DefaultValue: rst.DefaultValue,
                //     //            StandardValue: rst.StandardValue,
                //     //            StandardType: Number(rst.StandardType),
                //     //            StandardBaisc: rst.StandardBaisc,
                //     //            StandardLeft: rst.StandardLeft,
                //     //            StandardRight: rst.StandardRight,
                //     //            Unit: rst.Unit,
                //     //            Visiable: rst.Visiable == "true" ? true : false,
                //     //            ValueSource: rst.ValueSource,
                //     //        };

                //     //        _data.Standard = model.com.CountStandard(_data, Number(rst.StandardType))
                //     //        SelectData[0].ItemList.push(_data);

                //     //        delete SelectData[0].IsCurrentText;
                //     //        delete SelectData[0].IsUsedText;

                //     //        model.com.postSaveStandard({
                //     //            data: SelectData[0],
                //     //        }, function (res) {
                //     //            alert("新增项成功！！");
                //     //            model.com.refresh();
                //     //            $.each(Data_WorkSourc, function (i, item) {
                //     //                if (item.WorkShopID == wSelectID && item.LineID == lSelectID)
                //     //                    model.com.renderTree(item.PartList);
                //     //            });
                //     //        });

                //     //    });



                //     //}, TypeSource_Item));

                // });
                //删除未使用标准
                $("body").delegate("#lmvt-standard-delete", "click", function () {
                    if (!ChangeData) {
                        alert("当前未选择标准");
                        return;
                    }

                    var dataSource;

                    $.each(SelectList, function (i, item) {
                        if (item.ID == ChangeData)
                            dataSource = item;
                    });

                    if (dataSource.IsUsed == 1) {
                        alert("当前标准已使用，无法删除");
                        return;
                    }

                    if (!confirm("已选择版本号为" + dataSource.ID + "的标准，确定删除？")) {
                        return;
                    }

                    model.com.postDeleteStandard({
                        data: dataSource
                    }, function (res) {
                        alert("删除成功！！");
                        model.com.refresh();
                        if (iSelectID != 5)
                            $.each(partSource, function (i, item) {
                                if (item.UnitID == lSelectID) {
                                    model.com.renderTree(item.UnitList);
                                }
                            });
                        else
                            model.com.renderTree(MaterialList);
                        model.com.Romance(SinID, ID);
                        //model.com.StandardItem(ChangeData);
                        $(".table-select .table-select-drop .table-select-drop-in .table-select-drop-right").click();
                        $(".table-select .table-select-drop .table-select-drop-in .table-select-drop-right").click();
                    });
                });

                //设为当前
                $("body").delegate("#lmvt-set-current", "click", function () {
                    if (!ChangeData) {
                        alert("当前未选择标准");
                        return;
                    }

                    var dataSource;

                    $.each(SelectList, function (i, item) {
                        if (item.ID == ChangeData)
                            dataSource = item;
                    });

                    delete dataSource.IsCurrentText;
                    delete dataSource.IsUsedText;

                    dataSource.IsCurrent = 1;

                    model.com.postStandardStatus({
                        data: dataSource,
                        IsEnd: 0,
                        IsCurrent: 1
                    }, function (res) {
                        alert("设置成功");
                        model.com.refresh();
                        model.com.RanderSelect(wSelectID);
                        model.com.Romance(SinID, ID);
                        if (iSelectID != 5)
                            $.each(partSource, function (i, item) {
                                if (item.UnitID == lSelectID) {
                                    model.com.renderTree(item.UnitList);
                                }
                            });
                        else
                            model.com.renderTree(MaterialList);

                        //alert("新增成功！！");
                        //model.com.refresh();
                        //model.com.Romance(SinID, ID);
                        //if (iSelectID != 5)
                        //    $.each(partSource, function (i, item) {
                        //        if (item.UnitID == lSelectID) {
                        //            model.com.renderTree(item.UnitList);
                        //        }
                        //    });
                        //else
                        //    model.com.renderTree(MaterialList);
                    });
                });
                //设为永久有效
                $("body").delegate("#lmvt-set-forever", "click", function () {

                    if (!ChangeData) {
                        alert("当前未选择标准");
                        return;
                    }

                    var dataSource;

                    $.each(SelectList, function (i, item) {
                        if (item.ID == ChangeData)
                            dataSource = item;
                    });

                    delete dataSource.IsCurrentText;
                    delete dataSource.IsUsedText;

                    dataSource.IsEnd = 1;

                    model.com.postStandardStatus({
                        data: dataSource,
                        IsEnd: 1,
                        IsCurrent: dataSource.IsCurrent
                    }, function (res) {
                        alert("设置成功");
                        model.com.refresh();
                        model.com.Romance(SinID, ID);
                        if (iSelectID != 5)
                            $.each(partSource, function (i, item) {
                                if (item.UnitID == lSelectID) {
                                    model.com.renderTree(item.UnitList);
                                }
                            });
                        else
                            model.com.renderTree(MaterialList);
                    });

                });
                //导出
                $("body").delegate("#lmvt-standardtable-out", "click", function () {
                    var $table = $(".standard-table"),
                        fileName = "标准项.xls",
                        Title = "标准项";
                    var params = $com.table.getExportParams($table, fileName, Title);

                    model.com.postExportExcel(params, function (res) {
                        var src = res.info.path;
                        window.open(src);
                    });

                });
                //取消永久有效
                $("body").delegate("#lmvt-remove-forever", "click", function () {

                    if (!ChangeData) {
                        alert("当前未选择标准");
                        return;
                    }

                    var dataSource;

                    $.each(SelectList, function (i, item) {
                        if (item.ID == ChangeData)
                            dataSource = item;
                    });

                    delete dataSource.cText;
                    delete dataSource.IsUsedText;

                    dataSource.IsEnd = 0;

                    model.com.postStandardStatus({
                        data: dataSource,
                        IsEnd: 0,
                        IsCurrent: dataSource.dataSource
                    }, function (res) {
                        alert("取消成功");
                        model.com.refresh();
                        model.com.Romance(SinID, ID);
                        $.each(partSource, function (i, item) {
                            if (item.UnitID == lSelectID) {
                                model.com.renderTree(item.UnitList);
                            }
                        });
                    });


                });
                //监听select事件 深度
                $("body").delegate("#lmvt-select-depth", "change", function () {
                    var $this = $(this);
                    dSelectID = Number($this.find("option:selected").attr("value"));

                    model.com.RanderSelect(wSelectID);

                    lSelectID = Number($('#lmvt-select-line option:selected').attr("value"));

                    $.each(partSource, function (i, item) {
                        if (item.UnitID == lSelectID) {
                            model.com.renderTree(item.UnitList);
                        }
                    });

                });
                //监听select事件 产线
                $("body").delegate("#lmvt-select-workshop", "change", function () {
                    var $this = $(this);
                    wSelectID = Number($this.find("option:selected").attr("value"));
                    model.com.RanderSelect(wSelectID);
                    lSelectID = Number($('#lmvt-select-line option:selected').attr("value"));

                    $.each(partSource, function (i, item) {
                        if (item.UnitID == lSelectID) {
                            model.com.renderTree(item.UnitList);
                        }
                    });

                });
                //监听select事件  工段
                $("body").delegate("#lmvt-select-line", "change", function () {
                    var $this = $(this);
                    lSelectID = Number($this.find("option:selected").attr("value"));


                    $.each(partSource, function (i, item) {
                        if (item.UnitID == lSelectID) {
                            model.com.renderTree(item.UnitList);
                        }
                    });

                });
                //监听select事件
                $("body").delegate("#lmvt-select-product", "change", function () {
                    var $this = $(this);
                    pSelectID = $this.find("option:selected").attr("value");
                    $.each(partSource, function (i, item) {
                        if (item.UnitID == lSelectID) {
                            model.com.renderTree(item.UnitList);
                        }
                    });
                });
                //监听select事件
                $("body").delegate("#lmvt-select-IPTMode", "change", function () {
                    var $this = $(this);
                    iSelectID = Number($this.find("option:selected").attr("value"));

                    if (iSelectID != 5)
                        $.each(partSource, function (i, item) {
                            if (item.UnitID == lSelectID) {
                                model.com.renderTree(item.UnitList);
                            }
                        });
                    else {

                        model.com.renderTree(MaterialList);
                    }

                });


                //树的点击事件  两层树
                $("body").delegate(".lmvt-typeTree li ul li", "click", function () {
                    var $this = $(this),
                        $far = $this.closest("ul").closest("li"),
                        TreeID = $far.attr("data-value"),
                        SonID = $this.attr("data-value");

                    $(".lmvt-typeTree li ul li").css("color", "black");

                    $this.css("color", "blue");

                    ID = Number(TreeID);
                    SinID = Number(SonID);

                    model.com.Romance(SinID, ID);
                    model.com.refresh();
                });

                //树的点击事件 工步
                $("body").delegate(".lmvt-typeTree li", "click", function () {
                    var $this = $(this),
                        //$far = $this.closest("ul").closest("li"),
                        //TreeID = $far.attr("data-value"),
                        SonID = $this.attr("data-value");

                    if (iSelectID == 5) {
                        pSelectID = SonID;
                        model.com.Romance(0, 0);
                    }
                    else {
                        if (dSelectID == 3) {
                            SinID = Number(SonID);
                            ID = 0;
                            model.com.Romance(SinID, ID);
                        }
                        if (dSelectID == 4) {
                            SinID = Number(model.com.GetStepID(lSelectID, dSelectID, Number(SonID)));
                            ID = Number(SonID);
                            model.com.Romance(SinID, ID);
                        }
                    }

                    $(".lmvt-typeTree li ").css("color", "black");
                    $this.css("color", "blue");

                    model.com.refresh();
                });

            },
            run: function () {
                //单位
                model.com.getUnitAll({}, function (res) {
                    if (!res)
                        return;
                    var list = res.list,
                        rst = [];
                    if (res && res.list) {
                        UnitList = res.list;
                        $.each(UnitList, function (i, item) {
                            TypeSource_Item.Unit.push({
                                name: item.Name,
                                value: item.ID
                            });
                        });
                    }
                });

                dSelectID = $('#lmvt-select-depth option:selected').attr("value");

                //当前配置
                model.com.getIPTConfig({}, function (res) {
                    if (!res.info)
                        return;
                    else {
                        $("#lmvt-KeepDay-Input").val(res.info.KeepDay);
                        $("#lmvt-TOPNum-Input").val(res.info.TOPNum);
                        KeepDayMin = res.info.KeepDayMin;
                        TOPNumMax = res.info.TOPNumMax;
                        TOPNumMin = res.info.TOPNumMin;
                        KeepDayNow = res.info.KeepDay;
                        TopNumNow = res.info.TOPNum;
                    }
                });
                //人员
                model.com.getUserAll({}, function (res) {
                    if (!res)
                        return;
                    var list = res.list,
                        rst = [];
                    if (res && res.list) {
                        UserList = res.list;
                    }

                });
                //多个input
                model.com.getAPSProductTypeAll({}, function (res) {
                    if (!res)
                        return;
                    var list = res.list,
                        rst = [];
                    if (list) {

                        Data_WorkSourc = res.list;

                        var option;
                        arry = {};
                        var Line = [];
                        //$.each(res.list, function (i, item) {
                        //    if (!arry[item.WorkShopID])
                        //        arry[item.WorkShopID] = {};

                        //    arry[item.WorkShopID].WorkShopID = item.WorkShopID;
                        //    arry[item.WorkShopID].WorkShopName = item.WorkShopName;

                        //    if (!arry[item.WorkShopID].LineList)
                        //        arry[item.WorkShopID].LineList = [];
                        //    arry[item.WorkShopID].LineList.push({
                        //        LineID: item.LineID,
                        //        LineName: item.LineName
                        //    });

                        //});

                        var wkay = [];

                        $.each(Data_WorkSourc, function (i, item) {
                            wkay.push("<option value = ", item.ID, ">", item.Name, "</option>");
                        });

                        model.com.RanderSelect(1);
                        $('#lmvt-select-workshop').html(wkay.join(""));

                        iSelectID = 1;
                        wSelectID = Number($('#lmvt-select-workshop option:selected').attr("value"));


                        ////所有规格
                        model.com.getAPSProductAll({}, function (res) {
                            if (!res)
                                return;
                            var list = res.list,
                                rst = [];
                            if (list) {
                                var ProductList = [];
                                $.each(res.list, function (j, jtem) {
                                    ProductList.push("<option value = '", jtem.ProductNo, "'" + " >" + jtem.ProductNo + "</option>");
                                });
                                $('#lmvt-select-product').html(ProductList.join(""));
                                pSelectID = $('#lmvt-select-product option:selected').attr("value");
                                model.com.RanderSelect(1);
                                $.each(partSource, function (i, item) {
                                    if (item.UnitID == lSelectID) {
                                        model.com.renderTree(item.UnitList);
                                    }
                                });
                                model.com.refresh();
                                var TOPNum = $("#lmvt-KeepDay-Input[type='text']").val();
                            }

                        });
                    }
                });
                //物料号
                model.com.getMaterialAll({ material_no: "", material_name: "", type_id: -1, status: -1 }, function (res) {
                    if (!res)
                        return;
                    var list = res.list,
                        rst = [];
                    if (res && res.list) {
                        MaterialList = res.list;
                    }
                });
            },
            com: {
                //单位
                getUnitAll: function (data, fn, context) {
                    var d = {
                        $URI: "/Unit/All",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //物料
                getMaterialAll: function (data, fn, context) {
                    var d = {
                        $URI: "/Material/All",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //用户
                getUserAll: function (data, fn, context) {
                    var d = {
                        $URI: "/User/All",
                        $TYPE: "get"
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
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //设为当前
                postStandardStatus: function (data, fn, context) {
                    var d = {
                        $URI: "/IPTStandard/StandardStatus",
                        $TYPE: "post"
                    };
                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //删除未使用标准
                postDeleteStandard: function (data, fn, context) {
                    var d = {
                        $URI: "/IPTStandard/DeleteStandard",
                        $TYPE: "post"
                    };
                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //保存标准
                postSaveStandard: function (data, fn, context) {
                    var d = {
                        $URI: "/IPTStandard/SaveStandard",
                        $TYPE: "post"
                    };
                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //标准配置
                getIPTConfig: function (data, fn, context) {
                    var d = {
                        $URI: "/IPTStandard/IPTConfig",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //当前标准项表
                getStandardInfo: function (data, fn, context) {
                    var d = {
                        $URI: "/IPTStandard/StandardInfo",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                getAPSProductAll: function (data, fn, context) {
                    var d = {
                        $URI: "/FPCProduct/All",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //类型
                getAPSProductTypeAll: function (data, fn, context) {
                    var d = {
                        $URI: "/FMCLine/All",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                getSharpenerAll: function (data, fn, context) {
                    var d = {
                        $URI: "/IPTSharpener/All",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //产线标准
                getLineCurrent: function (data, fn, context) {
                    var d = {
                        $URI: "/IPTStandard/LineCurrent",
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
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //当前标准
                getStandardCurrent: function (data, fn, context) {
                    var d = {
                        $URI: "/IPTStandard/Current",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //修改标准配置
                postSaveConfig: function (data, fn, context) {
                    var d = {
                        $URI: "/IPTStandard/SaveConfig",
                        $TYPE: "post"
                    };
                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //产线信息
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
                //产线工段信息
                getFMCLineUnit: function (data, fn, context) {
                    var d = {
                        $URI: "/FMCLineUnit/Tree",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                refresh: function () {

                    //当前配置
                    model.com.getIPTConfig({}, function (res) {
                        if (!res.info)
                            return;
                        else {
                            $("#lmvt-KeepDay-Input").val(res.info.KeepDay);
                            $("#lmvt-TOPNum-Input").val(res.info.TOPNum);
                            KeepDayMin = res.info.KeepDayMin;
                            TOPNumMax = res.info.TOPNumMax;
                            TOPNumMin = res.info.TOPNumMin;
                        }
                    });

                    // //砂轮库
                    // model.com.getSharpenerAll({ ID: 0, Type: 0, Status: -1 }, function (res) {
                    //     if (!res)
                    //         return;
                    //     var list = res.list,
                    //         rst = [];
                    //     if (res && res.list) {

                    //         Data_Source_Buzzer = res.list;

                    //         Buzzer_List = res.list;

                    //         Buzzer_List = $com.util.Clone(Buzzer_List);

                    //         $.each(UserList, function (i, item_i) {
                    //             //if (item_i.Name == UserName)
                    //             //    UserID = item_i.ID;
                    //             $.each(Buzzer_List, function (j, item_j) {
                    //                 if (item_i.ID == item_j.OpreatorID)
                    //                     item_j.OpreatorID = item_i.Name;
                    //                 if (item_j.Type == 1)
                    //                     item_j.Type = "砂轮";
                    //                 if (item_j.Type == 2)
                    //                     item_j.Type = "油田";
                    //             });


                    //         });

                    //         $(".lmvt-grinding-body").html($com.util.template(Buzzer_List, HTML.BuzzerList));
                    //     }


                    // });

                    //当前标准
                    model.com.getStandardCurrent({ IPTMode: iSelectID, BusinessUnitID: -1, BaseID: -1, FactoryID: -1, WorkShopID: -1, LineID: wSelectID, PartID: lSelectID, PartPointID: ID, StationID: Number, ProductNo: pSelectID }, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];
                        if (list) {
                            callCurrent_source = res.list;

                            Data_CurrentSource = res.list;

                            callCurrent_source = $com.util.Clone(callCurrent_source);

                        }

                    });

                },

                GetSourceID: function (ID) {
                    var SelectID;
                    SelectID = ID[0];
                    return SelectID;
                },
                //渲染下拉框
                RanderSelect: function (wID) {
                    var wLine = [];
                    //得到产线
                    model.com.getFMCLineUnit({ LineID: wID, ID: 0 }, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];
                        if (list) {
                            partSource = res.list;



                            Data_capacityType_source = res.list;

                            partSource = $com.util.Clone(partSource);
                        }
                        //if (res.list.length == 0) {
                        //    alert("无相关工段信息");
                        //    return false;
                        //}
                        $.each(partSource, function (i, item) {
                            wLine.push("<option value = ", item.UnitID, ">", item.Name, "</option>");
                        });
                        $('#lmvt-select-line').html(wLine.join(""));
                        lSelectID = Number($('#lmvt-select-line option:selected').attr("value"));

                        if (iSelectID != 5)
                            $.each(partSource, function (i, item) {
                                if (item.UnitID == lSelectID) {
                                    model.com.renderTree(item.UnitList);
                                }
                            });
                        else {
                            model.com.renderTree(MaterialList);
                        }
                    });

                },
                //删除
                Delete: function (_source, set_data) {
                    if (!_source)
                        _source = [];
                    if (!set_data)
                        set_data = [];

                    var rst = [];

                    $.each(_source, function (i, item) {
                        var temp = true;

                        $.each(set_data, function (m, item_m) {
                            if (item.ID == item_m.ID)
                                temp = false;
                        });

                        if (temp)
                            rst.push(item);
                    });

                    $.each(rst, function (i, item) {
                        item.ID = i + 1;
                    });

                    return rst;
                },

                //修改树
                renderTree: function (source) {
                    if (iSelectID == 5) {
                        $(".lmvt-typeTree").html($com.util.template(source, HTML.TreeMaterialNode));
                        $(".lmvt-typeTree").treeview();
                        if ($(".lmvt-typeTree li ul li")) {
                            model.com.getStandardAll({ IPTMode: iSelectID, BusinessUnitID: -1, BaseID: -1, FactoryID: -1, WorkShopID: -1, LineID: -1, PartID: -1, PartPointID: -1, StationID: -1, ProductNo: "" }, function (res) {
                                $(".lmvt-typeTree li").each(function (i, item) {
                                    var temp = false,
                                        flag = true;
                                    if (!res)
                                        return;
                                    var list = res.list,
                                        rst = [];
                                    if (res.list.length > 0) {
                                        $.each(res.list, function (j, item_j) {
                                            if (item_j.ProductNo == $(item).attr("data-value")) {

                                                //最大版本号
                                                if (item_j.ID > num)
                                                    num = item_j.ID;

                                                if (new Date().getTime() + 7 * 24 * 3600 * 1000 >= new Date(item_j.TModify).getTime() + KeepDayNow * 24 * 3600 * 1000) {
                                                    $(item).css("background-color", "indianred");
                                                    flag = false;
                                                    return false;
                                                }
                                                else {
                                                    if (item_j.IsCurrent == 1) {
                                                        $(item).css("background-color", "chartreuse");
                                                        flag = false;
                                                        temp = true;
                                                        return false;
                                                    }
                                                    else {
                                                        $(item).css("background-color", "tomato");
                                                        flag = false;
                                                    }
                                                }
                                            }
                                        });
                                    }
                                    else
                                        $(item).css("background-color", "darkgrey");
                                    if (flag) {
                                        $(item).css("background-color", "darkgrey");
                                    }
                                    if (temp) {
                                        return true;
                                    }
                                });
                            });

                        }
                    }
                    else {
                        if (dSelectID == 4) {
                            var arr = [];
                            $.each(source, function (i, item) {
                                $.each(item.UnitList, function (j, item_j) {
                                    arr.push(item_j);
                                });
                            });
                            $(".lmvt-typeTree").html($com.util.template(arr, HTML.TreePartPointItemNode));

                            $(".lmvt-typeTree").treeview();
                            if ($(".lmvt-typeTree li")) {
                                $(".lmvt-typeTree li").each(function (i, item) {
                                    model.com.getStandardAll({ IPTMode: iSelectID, BusinessUnitID: -1, BaseID: -1, FactoryID: -1, WorkShopID: -1, LineID: wSelectID, PartID: lSelectID, PartPointID: Number(model.com.GetStepID(lSelectID, dSelectID, Number($(item).attr("data-value")))), StationID: Number($(item).attr("data-value")), ProductNo: pSelectID }, function (res) {
                                        if (!res)
                                            return;
                                        var list = res.list,
                                            rst = [];
                                        if (res.list.length > 0) {

                                            $.each(res.list, function (j, item_j) {


                                                //最大版本号
                                                if (item_j.ID > num)
                                                    num = item_j.ID;

                                                if (new Date().getTime() + 7 * 24 * 3600 * 1000 >= new Date(item_j.TModify).getTime() + KeepDayNow * 24 * 3600 * 1000) {
                                                    $(item).css("background-color", "indianred");
                                                    return false;
                                                }
                                                else {
                                                    if (item_j.IsCurrent == 1) {
                                                        $(item).css("background-color", "chartreuse");
                                                        return false;
                                                    }
                                                    else
                                                        $(item).css("background-color", "tomato");

                                                }
                                            });
                                        }
                                        else
                                            $(item).css("background-color", "darkgrey");
                                    });

                                });
                            }
                        }
                        if (dSelectID == 3) {
                            $(".lmvt-typeTree").html($com.util.template(source, HTML.TreePartItemNode));

                            $(".lmvt-typeTree").treeview();
                            if ($(".lmvt-typeTree li ul li")) {
                                $(".lmvt-typeTree li").each(function (i, item) {
                                    model.com.getStandardAll({ IPTMode: iSelectID, BusinessUnitID: -1, BaseID: -1, FactoryID: -1, WorkShopID: -1, LineID: wSelectID, PartID: lSelectID, PartPointID: Number($(item).attr("data-value")), StationID: 0, ProductNo: pSelectID }, function (res) {
                                        if (!res)
                                            return;
                                        var list = res.list,
                                            rst = [];
                                        if (res.list.length > 0) {

                                            $.each(res.list, function (j, item_j) {


                                                //最大版本号
                                                if (item_j.ID > num)
                                                    num = item_j.ID;

                                                if (new Date().getTime() + 7 * 24 * 3600 * 1000 >= new Date(item_j.TModify).getTime() + KeepDayNow * 24 * 3600 * 1000) {
                                                    $(item).css("background-color", "indianred");
                                                    return false;
                                                }
                                                else {
                                                    if (item_j.IsCurrent == 1) {
                                                        $(item).css("background-color", "chartreuse");
                                                        return false;
                                                    }
                                                    else
                                                        $(item).css("background-color", "tomato");

                                                }
                                            });
                                        }
                                        else
                                            $(item).css("background-color", "darkgrey");
                                    });

                                });
                            }
                        }
                    }

                },

                //根据点击渲染子菜单
                Romance: function (ID, Number) {

                    if (iSelectID != 5)
                        model.com.getStandardAll({
                            IPTMode: iSelectID, BusinessUnitID: -1, BaseID: -1, FactoryID: -1, WorkShopID: -1, LineID: wSelectID, PartID: lSelectID, PartPointID: ID, StationID: Number, ProductNo: pSelectID
                        }, function (res) {
                            if (!res)
                                return;
                            var list = res.list,
                                rst = [];
                            if (list) {
                                SelectList = res.list;
                                var Options = {};

                                SelectList = $com.util.Clone(SelectList);

                                Options.DefaultSelect = {
                                    ID: 0,
                                    IsCurrent: "",
                                    Remark: "",
                                    UserID: 0,
                                    TModify: 0,
                                    IsUsedText: 0,
                                };
                                Options.KEYWORD_LIST = [
                                    "ID|版本号",
                                    "IsCurrentText|标准状态",
                                    "Remark|名称",
                                    "UserID|操作人",
                                    "TModify|时刻",
                                    "IsUsedText|当前状态",
                                ];
                                Options.IndexTitle = "ID";
                                Options.multiple = false;
                                Options.DATA = [];
                                $.each(SelectList, function (i, item) {
                                    if (item.IsUsed == 1)
                                        item.IsUsedText = "已使用";
                                    else
                                        item.IsUsedText = "未使用";

                                    if (item.IsCurrent == 1)
                                        item.IsCurrentText = "当前标准";
                                    else
                                        item.IsCurrentText = "历史标准";

                                    Options.DATA.push({
                                        ID: item.ID,
                                        IsCurrentText: item.IsCurrentText,
                                        Remark: item.Remark,
                                        UserID: model.com.Downperson(item.UserID),
                                        TModify: item.TModify,
                                        IsUsedText: item.IsUsedText
                                    });
                                });
                                //下拉框changed
                                Options.changed = function (data) {
                                    if (data.length > 0) {
                                        ChangeData = model.com.GetSourceID(data);
                                        $.each(Options.DATA, function (i, item) {
                                            if (item.ID == ChangeData) {
                                                $("#lmvt-ID-Input").val(item.IsCurrentText);
                                                $("#lmvt-remark-Input").val(item.Remark);
                                            }
                                        });
                                        model.com.StandardItem(ChangeData);
                                    }
                                    else {
                                        alert("请选择标准");
                                    }
                                };
                                $("#lmvt-table-select").tableselect(Options);
                            }

                        });
                    else
                        model.com.getStandardAll({
                            IPTMode: iSelectID, BusinessUnitID: -1, BaseID: -1, FactoryID: -1, WorkShopID: -1, LineID: -1, PartID: -1, PartPointID: -1, StationID: -1, ProductNo: pSelectID
                        }, function (res) {
                            if (!res)
                                return;
                            var list = res.list,
                                rst = [];
                            if (list) {
                                SelectList = res.list;
                                var Options = {};

                                SelectList = $com.util.Clone(SelectList);

                                Options.DefaultSelect = {
                                    ID: 0,
                                    IsCurrent: "",
                                    Remark: "",
                                    UserID: 0,
                                    TModify: 0,
                                    IsUsedText: 0,
                                };
                                Options.KEYWORD_LIST = [
                                    "ID|版本号",
                                    "IsCurrentText|标准状态",
                                    "Remark|名称",
                                    "UserID|操作人",
                                    "TModify|时刻",
                                    "IsUsedText|当前状态",
                                ];
                                Options.IndexTitle = "ID";
                                Options.multiple = false;
                                Options.DATA = [];
                                $.each(SelectList, function (i, item) {
                                    if (item.IsUsed == 1)
                                        item.IsUsedText = "已使用";
                                    else
                                        item.IsUsedText = "未使用";

                                    if (item.IsCurrent == 1)
                                        item.IsCurrentText = "当前标准";
                                    else
                                        item.IsCurrentText = "历史标准";

                                    Options.DATA.push({
                                        ID: item.ID,
                                        IsCurrentText: item.IsCurrentText,
                                        Remark: item.Remark,
                                        UserID: model.com.Downperson(item.UserID),
                                        TModify: item.TModify,
                                        IsUsedText: item.IsUsedText
                                    });
                                });
                                //下拉框changed
                                Options.changed = function (data) {
                                    if (data.length > 0) {
                                        ChangeData = model.com.GetSourceID(data);
                                        $.each(Options.DATA, function (i, item) {
                                            if (item.ID == ChangeData) {
                                                $("#lmvt-ID-Input").val(item.IsCurrentText);
                                                $("#lmvt-remark-Input").val(item.Remark);
                                            }
                                        });
                                        model.com.StandardItem(ChangeData);

                                    }
                                    else {
                                        alert("请选择标准");
                                    }
                                };
                                $("#lmvt-table-select").tableselect(Options);
                            }

                        });
                    //当前标准               
                    model.com.getStandardCurrent({
                        IPTMode: iSelectID, BusinessUnitID: -1, BaseID: -1, FactoryID: -1, WorkShopID: -1, LineID: wSelectID, PartID: lSelectID, PartPointID: ID, StationID: Number, ProductNo: pSelectID
                    }, function (res) {
                        if (res.info.ID == 0) {
                            $("#lmvt-ID-Input").val("");
                            $("#lmvt-remark-Input").val("");
                            return;
                        }
                        if (res) {
                            var List = res.info.ItemList;

                            currentData = res.info.ItemList;

                            List = $com.util.Clone(List);

                            $.each(List, function (i, item) {
                                item.ShowID = i + 1;
                                for (var p in item) {
                                    if (!Formattrt_Item[p])
                                        continue;
                                    if (p == "Unit")
                                        continue;
                                    item[p] = Formattrt_Item[p](item[p]);
                                }
                            });


                            $("#lmvt-ID-Input").val("当前标准");
                            $("#lmvt-remark-Input").val(res.info.Remark);

                            model.com.StandardItem(res.info.ID);
                            $(".zace-type-body").html($com.util.template(List, HTML.StandardList));
                        }

                    });
                },
                //生产树
                renderPartPoint: function (list) {
                    $.each(list, function (i, item) {
                        item.OrderID = i + 1;
                    })
                    var _list = $com.util.Clone(list);
                    $.each(_list, function (i, item) {
                        for (var p in item) {
                            if (!FORMATTRT[p])
                                continue;
                            item[p] = FORMATTRT[p](item[p]);
                        }
                    });
                    $("#cby-PartPoint-tbody").html($com.util.template(_list, HTML.PartItemNode));
                    PartPointSource = _list;
                },
                //运算
                CountStandard: function (StandardObject, number) {
                    var standardString;
                    switch (number) {
                        case 0: standardString = StandardObject.StandardValue; break;
                        case 1: standardString = StandardObject.StandardValue; break;
                        case 2: standardString = "基准值：" + StandardObject.StandardBaisc + "范围：" + StandardObject.StandardLeft + "＜" + " n " + "＜" + StandardObject.StandardRight; break;
                        case 3: standardString = "基准值：" + StandardObject.StandardBaisc + "范围：" + StandardObject.StandardLeft + "≤" + " n " + "≤" + StandardObject.StandardRight; break;
                        case 4: standardString = "基准值：" + StandardObject.StandardBaisc + "范围：" + StandardObject.StandardLeft + "＜" + " n " + "≤" + StandardObject.StandardRight; break;
                        case 5: standardString = "基准值：" + StandardObject.StandardBaisc + "范围：" + StandardObject.StandardLeft + "≤" + " n " + "＜" + StandardObject.StandardRight; break;
                        case 6: standardString = "基准值：" + StandardObject.StandardBaisc + "范围：" + " n " + "＜" + StandardObject.StandardRight; break;
                        case 7: standardString = "基准值：" + StandardObject.StandardBaisc + "范围：" + " n " + "＞" + StandardObject.StandardLeft; break;
                        case 8: standardString = "基准值：" + StandardObject.StandardBaisc + "范围：" + " n " + "≤" + StandardObject.StandardRight; break;
                        case 9: standardString = "基准值：" + StandardObject.StandardBaisc + "范围：" + " n " + "≥" + StandardObject.StandardLeft; break;
                        case 10: standardString = " n " + "=" + StandardObject.StandardValue; break;
                        case 11:
                        case 12:
                        case 13:
                        case 14: standardString = StandardObject.StandardValue; break;
                        default: break;
                    }
                    return standardString;
                },
                //标准项列表
                StandardItem: function (wID) {
                    model.com.getStandardInfo({ ID: wID }, function (res) {
                        if (!res)
                            return;
                        standardInfoList = res.info.ItemList;

                        standardInfoData = res.info.ItemList;

                        standardInfoList = $com.util.Clone(standardInfoList);

                        $.each(standardInfoList, function (i, item) {
                            item.ShowID = i + 1;
                            for (var p in item) {
                                if (!Formattrt_Item[p])
                                    continue;
                                if (p == "Unit")
                                    continue;
                                item[p] = Formattrt_Item[p](item[p]);
                            }
                        });

                        $(".zace-type-body").html($com.util.template(standardInfoList, HTML.StandardList));

                    });
                },
                //获取操作人
                Downperson: function (wid) {
                    var name;
                    $.each(UserList, function (i, item) {
                        if (item.ID == wid) {
                            name = item.Name;
                            return name;
                        }
                    });
                    return name;
                },
                //得到上部工步id
                GetStepID: function (lSelectID, dSelectID, stepID) {
                    var ID;
                    $.each(partSource, function (i, item) {
                        if (lSelectID == item.UnitID) {
                            $.each(item.UnitList, function (j, item_j) {
                                $.each(item_j.UnitList, function (k, item_k) {
                                    if (item_k.LevelID == dSelectID && stepID == item_k.UnitID) {
                                        ID = item_k.ParentUnitID;
                                        return ID;
                                    }
                                });
                            });
                        }
                    });
                    return ID;
                }
            },
        });
        model.init();
    });