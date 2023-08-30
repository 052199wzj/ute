require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'],
    function ($lin, $com) {

        var HTML,
            //编码集合
            CodeList,
            //规则集合
            CodeRuleList,
            CodeSource,
            //全局ID
            ChoiceID,
            //实体
            Defaul_Value_Code,
            KETWROD_LIST_Code,
            KETWROD_Code,
            Formattrt_Code,
            TypeSource_Code,
            //规则
            Defaul_Value_Rule,
            KETWROD_LIST_Rule,
            KETWROD_Rule,
            Formattrt_Rule,
            TypeSource_Rule,
            partSource;

        HTML = {
            CodeList: [
                '<tr>',
                '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></th>',
                '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
                '<td style="min-width: 80px" data-title="Name" data-value="{{Name}}">{{Name}}</td>',
                '<td style="min-width: 80px" data-title="UseTime" data-value="{{UseTime}}">{{ UseTime}}</td>',
                '<td style="min-width: 50px" data-title="StartCode" data-value="{{StartCode}}" >{{ StartCode}}</td>',
                '<td style="min-width: 50px" data-title="EndCode" data-value="{{EndCode}}" >{{ EndCode}}</td>',
                '<td style="min-width: 80px" data-title="Number" data-value="{{Number}}" >{{ Number}}</td>',
                '<td style="min-width: 80px" data-title="EncodingType" data-value="{{EncodingType}}" >{{ EncodingType}}</td>',
                '<td style="min-width: 100px" data-title="UpdateBindingFlag" data-value="{{UpdateBindingFlag}}" >{{ UpdateBindingFlag}}</td>',
                '<td style="min-width: 50px" data-title="Active" data-value="{{Active}}" >{{ Active}}</td>',
                '</tr>'
            ].join(""),

            CodeRuleList: [
                '<tr>',
                '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td data-title="showID" data-value="{{showID}}" >{{showID}}</td>',
                '<td style = "display: none" data-title="ID" data-value="{{ID}}"  >{{ID}}</td>',
                '<td data-title="DefaultValue" data-value="{{DefaultValue}}" >{{DefaultValue}}</td>',
                '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
                '<td data-title="Type" data-value="{{Type}}" >{{Type}}</td>',
                '<td data-title="Length" data-value="{{Length}}" >{{Length}}</td>',
                '<td data-title="Location" data-value="{{Location}}" >{{Location}}</td>',
                '<td style="display:none" data-title="Editable" data-value="{{Editable}}" >{{Editable}}</td>',
                '</tr>',
            ].join(""),


        };

        //新增实体
        Defaul_Value_Code = {
            Name: "",
            EncodingType: 1,
            UpdateBindingFlag: 1,
            //Active: 0
        };
        (function () {

            KETWROD_LIST_Code = [
                "Name|名称",
                "EncodingType|编码类型|ArrayOne",
                "UpdateBindingFlag|流水号更新绑定类型|ArrayOne",
                "Active|状态|ArrayOne"
            ];

            KETWROD_Code = {};

            Formattrt_Code = {};

            TypeSource_Code = {
                UpdateBindingFlag: [
                    {
                        name: "无绑定",
                        value: 1
                    },
                    {
                        name: "年码",
                        value: 2
                    },
                    {
                        name: "月码",
                        value: 3
                    },
                    {
                        name: "日码",
                        value: 4
                    },
                    //{
                    //    name: "时码",
                    //    value: 5
                    //},
                    //{
                    //    name: "分码",
                    //    value: 6
                    //},
                    //{
                    //    name: "秒码",
                    //    value: 7
                    //},
                    //{
                    //    name: "流水号",
                    //    value: 8

                    //},
                    //{
                    //    name: "定制码",
                    //    value: 9

                    //}
                ],
                EncodingType: [
                    {
                        name: "48V",
                        value: 1
                    },
                    {
                        name: "160V",
                        value: 2
                    },
                    {
                        name: "单体",
                        value: 3
                    },
                    {
                        name: "物料",
                        value: 4
                    }
                ],
                Active: [
                    {
                        name: "默认",
                        value: 0
                    },
                    {
                        name: "启用",
                        value: 1
                    },
                    {
                        name: "禁用",
                        value: 2
                    }
                ]
            };

            $.each(KETWROD_LIST_Code, function (i, item) {
                var detail = item.split("|");
                KETWROD_Code[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_Code[detail[0]] = $com.util.getFormatter(TypeSource_Code, detail[0], detail[2]);
                }
            });
        })();
        //新增规则
        Defaul_Value_Rule = {
            Name: "",
            DefaultValue: "",
            Type: 1,
            Length: "",
            Editable: 2,

        };
        (function () {

            KETWROD_LIST_Rule = [
                "Type|类型|ArrayOne",
                "Length|长度",
                "Name|含义",
                "DefaultValue|内容",
                //"Editable|是否可修改|ArrayOne",
                "Active|状态|ArrayOne"
            ];

            KETWROD_Rule = {};

            Formattrt_Rule = {};

            TypeSource_Rule = {
                Type: [
                    {
                        name: "固定码",
                        value: 1
                    },
                    {
                        name: "年码",
                        value: 2
                    },
                    {
                        name: "月码",
                        value: 3
                    },
                    {
                        name: "日码",
                        value: 4
                    },
                    {
                        name: "时码",
                        value: 5
                    },
                    {
                        name: "分码",
                        value: 6
                    },
                    {
                        name: "秒码",
                        value: 7
                    },
                    {
                        name: "流水号",
                        value: 8

                    },
                    {
                        name: "定制码",
                        value: 9

                    }
                ],
                Editable: [
                    {
                        name: "是",
                        value: true
                    },
                    {
                        name: "否",
                        value: false
                    }
                ]
            };

            $.each(KETWROD_LIST_Rule, function (i, item) {
                var detail = item.split("|");
                KETWROD_Rule[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_Rule[detail[0]] = $com.util.getFormatter(TypeSource_Rule, detail[0], detail[2]);
                }
            });
        })();
        model = $com.Model.create({
            name: '编码规则',

            type: $com.Model.MAIN,

            configure: function () {
                this.run();
            },

            events: function () {
                $("body").delegate(".lmvt-encoding-body tr", "bdclick", function () {
                    var $this = $(this),
                        id = Number($this.find("td[data-title=ID]").attr("data-value"));
                    $.each(CodeList, function (i, item) {
                        //if(id == )
                    });
                });
                $("body").delegate(".lmvt-main-body tr", "dblclick", function () {
                    var $this = $(this),
                        id = $this.find("td[data-title=showID]").attr("data-value"),
                        TastID,
                        materialNo;

                    if (flag == 1) {
                        $.each(Plan_source, function (i, item) {
                            if (item.showID == id) {
                                deflautList = item.LocationPlanList;
                                TastID = item.TaskPartID;
                                materialNo = item.MaterialNo
                            }
                        });

                        $.each(deflautList, function (i, item) {
                            item.ID = i + 1;
                        });

                        model.com.Render(deflautList);
                    }
                    else {

                        model.com.getMaterialTaskProductLocationAll({ TaskMaterialID: Product_source[id - 1].ID }, function (res) {
                            if (!res)
                                return;
                            var list = res.list,
                                rst = [];
                            if (list) {
                                model.com.Render(res.list);
                            }

                        });
                        //$.each(mainMaterialList, function (i, item) {
                        //if (item.showID == id) {
                        //deflautList = item.LocationPlanList;
                        //TastID = item.TaskPartID;
                        //materialNo = item.MaterialNo
                        // }
                        // });

                        //$.each(deflautList, function (i, item) {
                        // item.ID = i + 1;
                        //});
                        //MaterialNo
                        //model.com.Render(deflautList);
                    }

                });
                //增加编码实体
                $("body").delegate("#lmvt-encoding-add", "click", function () {

                    $("body").append($com.modal.show(Defaul_Value_Code, KETWROD_Code, "新增", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }

                        var _data = {
                            ID: 0,
                            EncodingType: Number(rst.EncodingType),
                            CodeDefinitionList: [],
                            Name: rst.Name,
                            UpdateBindingFlag: Number(rst.UpdateBindingFlag),
                            UseTime: "2000-01-01",
                            EndCode: "",
                            StartCode: "",
                            Number: 0,
                        };
                        model.com.postCodeEntrySave({
                            data: _data,
                        }, function (res) {
                            alert("新增成功！！");
                            model.com.refresh();
                        });

                    }, TypeSource_Code));

                });
                //删除编码实体
                $("body").delegate("#lmvt-encoding-delete", "click", function () {

                    var SelectData = $com.table.getSelectionData($(".lmvt-encoding-body"), "ID", CodeSource);
                    if (SelectData[0].Active != 0) {
                        alert("该编码处于无法做更改的状态，无法做更改！！！");
                        return;
                    }

                    if (!SelectData || !SelectData.length) {
                        alert("至少选择一行数据再试！")
                        return;
                    }
                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {
                        return;
                    }

                    var arry = [];
                    $.each(SelectData, function (i, item) {
                        arry.push(model.com.GetSourceData(item.ID));
                    });
                    model.com.postCodeEntryDeleteAll({
                        data: arry,
                    }, function (res) {
                        alert("删除成功！！");
                        model.com.refresh();
                    });
                });
                //删除编码规则
                $("body").delegate("#lmvt-type-delete", "click", function () {

                    var source = model.com.GetSourceData(ChoiceID);
                    var SelectData = $com.table.getSelectionData($(".lmvt-type-body"), "ID", source.CodeDefinitionList);

                    if (source.Active != 0) {
                        alert("该编码处于无法做更改的状态，无法做更改！！！");
                        return;
                    }

                    if (!SelectData || !SelectData.length) {
                        alert("至少选择一行数据再试！")
                        return;
                    }
                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {
                        return;
                    }

                    source.CodeDefinitionList = model.com.getNewShiftList(source.CodeDefinitionList, SelectData);
                    // var cat = 0;
                    // for(i = 0;i<source.CodeDefinitionList.length - cat;i++){
                    //     for(j = 0;i<SelectData.length;j++){
                    //         if(source.CodeDefinitionList[i].ID == SelectData[j].ID){
                    //             source.CodeDefinitionList.splice(i + cat,1);
                    //             cat++;
                    //         }
                    //     }
                    // }

                    source.StartCode = "";
                    $.each(source.CodeDefinitionList, function (i, item) {
                        source.StartCode = source.StartCode + item.DefaultValue;
                    });
                    if (source.CodeDefinitionList.length > 0)
                        source.CodeDefinitionList[source.CodeDefinitionList.length - 1].Location = source.CodeDefinitionList.length;

                    model.com.postCodeEntrySave({
                        data: source,
                    }, function (res) {
                        alert("删除成功！！");
                        model.com.refresh();

                    });
                });
                //修改编码规则
                $("body").delegate("#lmvt-type-change", "click", function () {

                    var source = model.com.GetSourceData(ChoiceID);

                    //对实体进行判断是否可以修改

                    var SelectData = $com.table.getSelectionData($(".lmvt-type-body"), "ID", source.CodeDefinitionList);

                    if (!SelectData || !SelectData.length) {
                        alert("至少选择一行数据再试！")
                        return;
                    }
                    if (SelectData.length != 1) {
                        alert("同时只能选择一行数据进行修改！")
                        return;
                    }

                    var defaul_value_rule = {
                        Name: SelectData[0].Name,
                        DefaultValue: SelectData[0].DefaultValue,
                        Type: SelectData[0].Type,
                        Length: SelectData[0].Length,
                        Editable: SelectData[0].Editable,
                    };



                    $("body").append($com.modal.show(defaul_value_rule, KETWROD_Rule, "修改", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }
                        if (rst.DefaultValue.length > Number(rst.Length)) {
                            alert("输入长度大于规定长度");
                            return false;
                        }

                        var cate = model.com.GetSourceData(ChoiceID);

                        $.each(cate.CodeDefinitionList, function (i, item) {
                            if (item.ID == SelectData[0].ID) {
                                item.DefaultValue = rst.DefaultValue;
                                item.Editable = true;
                                item.Length = Number(rst.Length);
                                item.Name = rst.Name;
                                item.Type = Number(rst.Type);
                            }
                        });

                        cate.CodeDefinitionList[cate.CodeDefinitionList.length - 1].Location = cate.CodeDefinitionList.length;
                        cate.StartCode = "";
                        $.each(cate.CodeDefinitionList, function (i, item) {
                            cate.StartCode = cate.StartCode + item.DefaultValue;
                        });

                        model.com.postCodeEntrySave({
                            data: cate,
                        }, function (res) {
                            alert("修改成功！！");
                            var temp = true;
                            $.each(cate.CodeDefinitionList, function (i, item) {
                                if (cate.UpdateBindingFlag == item.Type || cate.UpdateBindingFlag == 1) {
                                    temp = false;
                                }
                            });
                            if (temp) {
                                alert("没有与编码实体绑定类型相同的编码规则类型，请添加一条！！！");
                            }
                            model.com.refresh();
                            model.com.RendarRule(ChoiceID);
                        });

                    }, TypeSource_Rule));

                });
                //上移
                $("body").delegate("#lmvt-top-move", "click", function () {

                    var source = model.com.GetSourceData(ChoiceID);

                    if (source.Active != 0) {
                        alert("该编码处于无法做更改的状态，无法做更改！！！");
                        return;
                    }

                    var SelectData = $com.table.getSelectionData($(".lmvt-type-body"), "ID", source.CodeDefinitionList);

                    if (!SelectData || !SelectData.length) {
                        alert("至少选择一行数据再试！")
                        return;
                    }
                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其上移？")) {
                        return;
                    }
                    var temp = false;
                    $.each(SelectData, function (i, item) {
                        if (item.Location == 1) {
                            alert("无法上移");
                            temp = true;
                            return false;
                        }
                    });
                    if (temp)
                        return
                    //数组中第一个的下标
                    var index;
                    $.each(source.CodeDefinitionList, function (i, item) {
                        if (item.ID == SelectData[0].ID) {
                            temp = true;
                            index = i;
                        }
                    });

                    var count = 0,
                        cafe = false;
                    var middleArry = SelectData;
                    middleArry = $com.util.Clone(middleArry);
                    source.CodeDefinitionList = model.com.getNewShiftList(source.CodeDefinitionList, middleArry);

                    $.each(SelectData, function (i, item) {
                        source.CodeDefinitionList.splice(index + count - 1, 0, item)
                        count++;
                        if (count == SelectData.length) {
                            return false;
                        }
                    });

                    source.StartCode = "";
                    $.each(source.CodeDefinitionList, function (i, item) {
                        item.Location = i + 1;
                        source.StartCode = source.StartCode + item.DefaultValue;
                        item.ID = 0;
                    });
                    var first = source;
                    first = $com.util.Clone(first);
                    //first.CodeDefinitionList = [];

                    model.com.postCodeEntrySave({
                        data: first,
                    }, function (res) {
                        model.com.postCodeEntrySave({
                            data: source,
                        }, function (res) {
                            alert("保存成功！！");
                            model.com.refresh();
                        });
                    });
                });
                //下移
                $("body").delegate("#lmvt-buttom-move", "click", function () {

                    var source = model.com.GetSourceData(ChoiceID);

                    if (source.Active != 0) {
                        alert("该编码处于无法做更改的状态，无法做更改！！！");
                        return;
                    }

                    var SelectData = $com.table.getSelectionData($(".lmvt-type-body"), "ID", source.CodeDefinitionList);

                    if (!SelectData || !SelectData.length) {
                        alert("至少选择一行数据再试！")
                        return;
                    }
                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其下移？")) {
                        return;
                    }
                    var temp = false;
                    $.each(SelectData, function (i, item) {
                        if (item.Location == source.CodeDefinitionList.length) {
                            alert("无法下移");
                            temp = true;
                            return false;
                        }
                    });
                    if (temp)
                        return
                    //数组中第一个的下标
                    var index;
                    $.each(source.CodeDefinitionList, function (i, item) {
                        if (item.ID == SelectData[SelectData.length - 1].ID) {
                            temp = true;
                            index = i;
                        }
                    });

                    var count = 0,
                        cafe = false;
                    var middleArry = SelectData;
                    middleArry = $com.util.Clone(middleArry);
                    source.CodeDefinitionList = model.com.getNewShiftList(source.CodeDefinitionList, middleArry);

                    $.each(SelectData, function (i, item) {
                        source.CodeDefinitionList.splice(index + count + 1, 0, item)
                        count++;
                        if (count == SelectData.length) {
                            return false;
                        }
                    });

                    source.StartCode = "";
                    $.each(source.CodeDefinitionList, function (i, item) {
                        item.Location = i + 1;
                        source.StartCode = source.StartCode + item.DefaultValue;
                        item.ID = 0;
                    });
                    var first = source;
                    first = $com.util.Clone(first);
                    first.CodeDefinitionList = [];

                    model.com.postCodeEntrySave({
                        data: first,
                    }, function (res) {
                        model.com.postCodeEntrySave({
                            data: source,
                        }, function (res) {
                            alert("保存成功！！");
                            model.com.refresh();
                        });
                    });
                });
                //置底
                $("body").delegate("#lmvt-buttom", "click", function () {

                    var source = model.com.GetSourceData(ChoiceID);

                    if (source.Active != 0) {
                        alert("该编码处于无法做更改的状态，无法做更改！！！");
                        return;
                    }

                    var SelectData = $com.table.getSelectionData($(".lmvt-type-body"), "ID", source.CodeDefinitionList);

                    if (!SelectData || !SelectData.length) {
                        alert("至少选择一行数据再试！")
                        return;
                    }
                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其置底？")) {
                        return;
                    }

                    var middleArry = SelectData;
                    middleArry = $com.util.Clone(middleArry);
                    source.CodeDefinitionList = model.com.getNewShiftList(source.CodeDefinitionList, middleArry);

                    $.each(SelectData, function (i, item) {
                        source.CodeDefinitionList.push(item);
                    });
                    source.StartCode = "";
                    $.each(source.CodeDefinitionList, function (i, item) {
                        item.Location = i + 1;
                        source.StartCode = source.StartCode + item.DefaultValue;
                        item.ID = 0;
                    });
                    var first = source;
                    first = $com.util.Clone(first);
                    first.CodeDefinitionList = [];

                    model.com.postCodeEntrySave({
                        data: first,
                    }, function (res) {
                        model.com.postCodeEntrySave({
                            data: source,
                        }, function (res) {
                            alert("保存成功！！");
                            model.com.refresh();
                        });
                    });
                });
                //置顶
                $("body").delegate("#lmvt-top", "click", function () {

                    var source = model.com.GetSourceData(ChoiceID);

                    if (source.Active != 0) {
                        alert("该编码处于无法做更改的状态，无法做更改！！！");
                        return;
                    }

                    var SelectData = $com.table.getSelectionData($(".lmvt-type-body"), "ID", source.CodeDefinitionList);

                    if (!SelectData || !SelectData.length) {
                        alert("至少选择一行数据再试！")
                        return;
                    }
                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其置底？")) {
                        return;
                    }

                    var middleArry = SelectData;
                    middleArry = $com.util.Clone(middleArry);
                    source.CodeDefinitionList = model.com.getNewShiftList(source.CodeDefinitionList, middleArry);

                    source.CodeDefinitionList = SelectData.concat(source.CodeDefinitionList);
                    source.StartCode = "";
                    $.each(source.CodeDefinitionList, function (i, item) {
                        item.Location = i + 1;
                        source.StartCode = source.StartCode + item.DefaultValue;
                        item.ID = 0;
                    });
                    var first = source;
                    first = $com.util.Clone(first);
                    first.CodeDefinitionList = [];

                    model.com.postCodeEntrySave({
                        data: first,
                    }, function (res) {
                        model.com.postCodeEntrySave({
                            data: source,
                        }, function (res) {
                            alert("保存成功！！");
                            model.com.refresh();
                        });
                    });
                });
                //双击编码实体
                $("body").delegate(".lmvt-encoding-body tr", "dblclick", function () {
                    var $this = $(this),
                        id = Number($this.find("td[data-title=ID]").attr("data-value"));
                    var $table = $this.closest("table");
                    ChoiceID = id;

                    $table.find("tbody tr").each(function (i, item) {
                        var $tr = $(this);

                        if (id == Number($tr.find("td[data-title=ID]").attr("data-value"))) {
                            $tr.css('background-color', '#7bf1b5');
                            temp = true;

                        }
                        else {
                            if (!($tr.attr("data-color"))) {

                                $tr.css('background-color', '');
                            } else {

                                var colorPro = $tr.attr("data-color");
                                $tr.css('background-color', colorPro);
                            }
                        }
                    });

                    model.com.RendarRule(id);
                    return false;
                });
                //新增编码规则
                $("body").delegate("#lmvt-type-add", "click", function () {

                    var source = model.com.GetSourceData(ChoiceID);

                    if (source.Active != 0) {
                        alert("该编码处于无法做更改的状态，无法做更改！！！");
                        return;
                    }
                    $("body").append($com.modal.show(Defaul_Value_Rule, KETWROD_Rule, "新增", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }
                        if (rst.DefaultValue.length > Number(rst.Length)) {
                            alert("输入长度大于定于长度");
                            return false;
                        }
                        //定义新增的对象
                        var _data = {
                            ID: 0,
                            DefaultValue: rst.DefaultValue,
                            Editable: true,
                            Length: Number(rst.Length),
                            Location: 0,
                            Manage: ChoiceID,
                            Name: rst.Name,
                            Type: Number(rst.Type),
                        };
                        //根据双击ID获取对应的数据
                        var cate = model.com.GetSourceData(ChoiceID);

                        cate.CodeDefinitionList.push(_data);

                        cate.CodeDefinitionList[cate.CodeDefinitionList.length - 1].Location = cate.CodeDefinitionList.length;
                        cate.StartCode = "";
                        $.each(cate.CodeDefinitionList, function (i, item) {
                            cate.StartCode = cate.StartCode + item.DefaultValue;
                        });

                        model.com.postCodeEntrySave({
                            data: cate,
                        }, function (res) {
                            alert("新增成功！！");
                            var temp = true;
                            $.each(cate.CodeDefinitionList,function(i,item){
                                if (cate.UpdateBindingFlag == item.Type || cate.UpdateBindingFlag==1) {
                                    temp = false;
                                }
                            });
                            if (temp) {
                                alert("没有与编码实体绑定类型相同的编码规则类型，请添加一条！！！");
                            }
                            model.com.refresh();
                            model.com.RendarRule(ChoiceID);
                        });

                    }, TypeSource_Rule));
                });
                //修改
                $("body").delegate("#lmvt-encoding-change", "click", function () {

                    var SelectData = $com.table.getSelectionData($(".lmvt-encoding-body"), "ID", CodeSource);
                    if (SelectData[0].Active != 0) {
                        alert("该编码处于无法做更改的状态！！！");
                        return;
                    }

                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return;
                    }
                    if (SelectData.length != 1) {
                        alert("只能同时对一行数据修改！")
                        return;
                    }

                    var default_value = {
                        Name: SelectData[0].Name,
                        EncodingType: SelectData[0].EncodingType,
                        UpdateBindingFlag: SelectData[0].UpdateBindingFlag,
                    };
                    $("body").append($com.modal.show(default_value, KETWROD_Code, "修改", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        SelectData[0].Name = rst.Name;
                        SelectData[0].EncodingType = Number(rst.EncodingType);
                        SelectData[0].UpdateBindingFlag = Number(rst.UpdateBindingFlag);
                        model.com.postCodeEntrySave({
                            data: SelectData[0],
                        }, function (res) {
                            alert("修改成功！！");
                            model.com.refresh();
                        });

                    }, TypeSource_Code));

                });
                //启用
                $("body").delegate("#lmvt-encoding-active", "click", function () {

                    var SelectData = $com.table.getSelectionData($(".lmvt-encoding-body"), "ID", CodeSource);
                    //if (SelectData[0].Active != 0) {
                    //    alert("该编码处于无法做更改的状态，无法做更改！！！");
                    //    return;
                    //}

                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return;
                    }

                    if (SelectData.length!=1) {
                        alert("只能选择一条数据进行启用！")
                        return;
                    }

                    if (!confirm("已选择" + SelectData.length + "数据，是否启用？")) {
                        return ;
                    }

                    model.com.postCodeEntryActive({
                        data: SelectData,
                        Active:1
                    }, function (res) {
                        alert("启用成功！！");
                        model.com.refresh();
                    });

                });
                //禁用
                $("body").delegate("#lmvt-encoding-forbidden", "click", function () {

                    var SelectData = $com.table.getSelectionData($(".lmvt-encoding-body"), "ID", CodeSource);
                    //if (SelectData[0].Active != 0) {
                    //    alert("该编码处于无法做更改的状态，无法做更改！！！");
                    //    return;
                    //}

                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return;
                    }

                    if (SelectData.length != 1) {
                        alert("只能选择一条数据进行禁用！")
                        return;
                    }

                    if (!confirm("已选择" + SelectData.length + "数据，是否禁用？")) {
                        return;
                    }

                    model.com.postCodeEntryActive({
                        data: SelectData,
                        Active: 0
                    }, function (res) {
                        alert("禁用成功！！");
                        model.com.refresh();
                    });

                });
            },
            run: function () {
                model.com.refresh();
                //var key = [{ id: 1, key: "2" }, { id: 2, key: "3" }, { id: 3, key: "4" }];
                //var cate = [{ id: 1, key: "2" }, { id: 2, key: "3" }, { id: 4, key: "4" }];
                //var number = 0,
                //    count = 0;
                //for (var i = 0; i < key.length - number; i++) {
                //    for (var j = 0; j < cate.length; j++) {
                //        if (key[i].id == cate[j].id) {
                //            key.splice(i, 1);
                //            number++;
                //        }
                //    }
                //}
                //console.log(key);
                //console.log(cate);
            },
            com: {
                //获取编码规则
                getCodeDefinitionAll: function (data, fn, context) {
                    var d = {
                        $URI: "/CRDCodeDefinition/All",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取编码规则实体
                getCodeEntryAll: function (data, fn, context) {
                    var d = {
                        $URI: "/CRDCodeEntry/All",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //保存编码
                postCodeEntrySave: function (data, fn, context) {
                    var d = {
                        $URI: "/CRDCodeEntry/Save",
                        $TYPE: "post"
                    };
                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //保存规则
                postCRDCodeDefinitionSave: function (data, fn, context) {
                    var d = {
                        $URI: "/CRDCodeDefinition/Save",
                        $TYPE: "post"
                    };
                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //删除编码
                postCodeEntryDeleteAll: function (data, fn, context) {
                    var d = {
                        $URI: "/CRDCodeEntry/DeleteAll",
                        $TYPE: "post"
                    };
                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //启用编码实体
                postCodeEntryActive: function (data, fn, context) {
                    var d = {
                        $URI: "/CRDCodeEntry/Active",
                        $TYPE: "post"
                    };
                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                refresh: function () {
                    model.com.getCodeEntryAll({}, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];
                        if (list) {
                            //CodeSource = res.list
                            CodeSource = $com.util.Clone(res.list);
                            //CodeList = res.list;
                            CodeList = $com.util.Clone(res.list);
                            $.each(CodeList, function (i, item) {
                                for (var p in item) {
                                    if (!Formattrt_Code[p])
                                        continue;
                                    item[p] = Formattrt_Code[p](item[p]);
                                }
                            });
                            $(".lmvt-encoding-body").html($com.util.template(CodeList, HTML.CodeList));

                            $(".lmvt-encoding-body tr").each(function (i, item) {
                                var $tr = $(this);

                                if (ChoiceID == Number($tr.find("td[data-title=ID]").attr("data-value"))) {
                                    $tr.css('background-color', '#7bf1b5');
                                }
                                else {
                                    if (!($tr.attr("data-color"))) {

                                        $tr.css('background-color', '');
                                    } else {

                                        var colorPro = $tr.attr("data-color");
                                        $tr.css('background-color', colorPro);
                                    }
                                }
                            });

                            model.com.RendarRule(ChoiceID);
                        }

                    });
                },
                RendarRule: function (id) {
                    $(".lmvt-container-main-encoding").css("width", "60%");
                    $(".lmvt-container-main-encoding").css("padding-right", "10px");
                    $(".lmvt-container-type-encoding").show();
                    $.each(CodeList, function (i, item_j) {
                        if (item_j.ID == id) {
                            var _list = $com.util.Clone(item_j.CodeDefinitionList);
                            $.each(_list, function (i, item) {
                                //if (item.Editable == false) {
                                //    item.Editable = "否";
                                //}
                                //else
                                //    item.Editable = "是";
                                //$.each(TypeSource_Rule.Type, function (j, jtem) {
                                //    if (jtem.value == item.Type)
                                //        item.Type = jtem.name;
                                //})
                                item.showID = i + 1;
                            });
                            $.each(_list, function (i, item) {
                                for (var p in item) {
                                    if (!Formattrt_Rule[p])
                                        continue;
                                    item[p] = Formattrt_Rule[p](item[p]);
                                }
                            });
                            $(".lmvt-type-body").html($com.util.template(_list, HTML.CodeRuleList));
                        }

                    })

                },
                //找到对应原始数据
                GetSourceData: function (id) {
                    var obj;
                    $.each(CodeSource, function (i, item) {
                        if (item.ID = id)
                            obj = item;
                    });
                    return obj;
                },
                getNewShiftList: function (_source, set_data) {
                    if (!_source)
                        _source = [];
                    if (!set_data)
                        set_data = [];
                    var rst = [];
                    for (var i = 0; i < _source.length; i++) {
                        var NotOWn = false;
                        for (var j = 0; j < set_data.length; j++) {
                            if (_source[i].ID == set_data[j].ID) {
                                _source.splice(i, 1);
                                set_data.splice(j, 1);
                                NotOWn = true;
                            }
                            if (set_data.length < 1) {
                                break;
                            }
                            if (NotOWn) {
                                model.com.getNewShiftList(_source, set_data);
                            }
                        }

                    }
                    rst = _source;
                    return rst;
                },
                swapItems: function (arr, index1, index2) {
                    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
                    return arr;
                },

                // 上移
                upRecord: function (arr, $index) {
                    if ($index == 0) {
                        return;
                    }
                    model.com.swapItems(arr, $index, $index - 1);
                },
            },


        });
        model.init();
    });