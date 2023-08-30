require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/jquery.treeview'],
    function ($lin, $com, $treeview) {

        var HTML,
            ID,
            SonNumber,
            SinID,
            Data_PartPointList,
            number,

            Defaul_Value_Type,
            KETWROD_LIST_Type,
            KETWROD_Type,
            Formattrt_Type,
            TypeSource_Type,

            Defaul_Value_Part,
            KETWROD_LIST_Part,
            KETWROD_Part,
            Formattrt_Part,
            TypeSource_Part,

            Defaul_Value_PartPoint,
            KETWROD_LIST_PartPoint,
            KETWROD_PartPointType,
            Formattrt_PartPoint,
            TypeSource_PartPoint,

            capacityType_source,
            PartList_source,
            Data_type_source,
            type_source,
            capacity_source;

        HTML = {

            TreeTypeList: [
                '<li data-titie="{{ID}}"  data-value="{{ID}}" >',
                '<span style="vertical-align:top;" > <input type="checkbox" class="femi-tree-checkbox" style="margin: 1px 0px 1px"  value="{{FunctionID}}" />{{Type}}</span> ',
                '<ul style = "font-size:14px">{{Items}}</ul>',
                '</li>',
            ].join(""),
            TreePartList: [
                '<li data-titie="{{PartID}}"  data-value="{{PartID}}" >',
                '<span style="vertical-align:top;"><input type="checkbox" class="femi-tree-checkbox" style="margin: 1px 0px 1px"  value="{{FunctionID}}"  />{{PartName}}</span> ',
                '</li>',
            ].join(""),

            TypeList: [
                '<tr>',
                '<td style = "width: 3px" > <input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" value="{{functionID}}" /></td> ',
                '<td style="min-width:50px" data-title="ID" data-value = {{ID}}>{{ID}}</td>',
                '<td style="min-width: 80px" data-title="Type" data-value = {{PartPointName}}>{{PartPointName}}</td>',
                '<td style="min-widtd: 60px"  data-title="Creator" data-value = {{Creator}}>{{Creator}}</td>',
                '<td style="min-widtd: 80px"  data-title="Createtime" data-value = {{CreateTime}}>{{CreateTime}}</td>',
                '</tr>'
            ].join(""),
        };
        //工序
        Defaul_Value_Part = {
            PartName: ""
        };
        (function () {

            KETWROD_LIST_Part = [
                "PartName|工序段|ArrayOne",
            ];

            KETWROD_Part = {};

            Formattrt_Part = {};

            TypeSource_Part = {
                PartName: [
                    {
                        name: "",
                        value: 0
                    }
                ]
            };

            $.each(KETWROD_LIST_Part, function (i, item) {
                var detail = item.split("|");
                KETWROD_Part[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_Part[detail[0]] = $com.util.getFormatter(TypeSource_Part, detail[0], detail[2]);
                }
            });
        })();

        //类型
        Defaul_Value_Type = {
            Type: ""
        };
        (function () {

            KETWROD_LIST_Type = [
                "Type|产品类型名称",
            ];

            KETWROD_Type = {};

            Formattrt_Type = {};

            TypeSource_Type = {

            };

            $.each(KETWROD_LIST_Type, function (i, item) {
                var detail = item.split("|");
                KETWROD_Type[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_Type[detail[0]] = $com.util.getFormatter(TypeSource_Type, detail[0], detail[2]);
                }
            });
        })();

        //工序
        Defaul_Value_PartPoint = {
            PartPointName: ""
        };
        (function () {

            KETWROD_LIST_PartPoint = [
                "PartPointName|工序名称",
            ];

            KETWROD_PartPoint = {};

            Formattrt_PartPoint = {};

            TypeSource_PartPoint = {

            };

            $.each(KETWROD_LIST_PartPoint, function (i, item) {
                var detail = item.split("|");
                KETWROD_PartPoint[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_PartPoint[detail[0]] = $com.util.getFormatter(TypeSource_PartPoint, detail[0], detail[2]);
                }
            });
        })();

        model = $com.Model.create({
            name: '产品工艺路线',

            type: $com.Model.MAIN,

            configure: function () {
                this.run();
            },

            events: function () {

                //新增类型
                $("body").delegate("#lmvt-table-type-add", "click", function () {
                    //判断父级是否被勾选
                    var far = [];
                    $.each($(".lmvt-typeTree").children('li').children('span').children('input'), function (i, item) {

                        if ($(item).is(":checked")) {
                            far.push($(item).closest('li').attr("data-value") - 1);
                        }
                    });

                    if (far.length > 0) {
                        $("body").append($com.modal.show(Defaul_Value_Part, KETWROD_Part, "新增工序段", function (rst) {
                            if (!rst || $.isEmptyObject(rst))
                                return false;

                            var inputPart;
                            $.each(TypeSource_Part.PartName, function (i, item) {
                                if (item.value == rst.PartName) {
                                    inputPart = {
                                        Active: false,
                                        CreateTime: new Date(),
                                        Creator: window.parent.User_Info.Name,
                                        LineID: 0,
                                        LineName: "",
                                        PartID: item.value,
                                        PartName: item.name,
                                        PartPointList: [],
                                        Type: 0,
                                        TypeText: "",
                                        WrokShopID: 0,
                                        WrokShopName: ""
                                    };
                                }
                            });

                            var temp = true;
                            $.each(far, function (i, item_i) {
                                $.each(Data_type_source[item_i].PartList, function (j, item_j) {
                                    if (item_j.PartID == rst.PartName) {
                                        temp = false;
                                        alert("不能添加重复的")
                                        return;
                                    }
                                });
                                if (temp) {
                                    Data_type_source[item_i].PartList.push(inputPart);
                                }
                            });

                            if (temp) {
                                model.com.postAPSProductTypeSave({
                                    data: Data_type_source,
                                }, function (res) {
                                    alert("新增成功！！");
                                    model.com.refresh();
                                });
                            }
                            return false;
                        }, TypeSource_Part));
                    }
                    else
                        $("body").append($com.modal.show(Defaul_Value_Type, KETWROD_Type, "新增产品类型", function (rst) {
                            if (!rst || $.isEmptyObject(rst))
                                return false;

                            var inputDate = {
                                ID: model.com.GetMaxID(Data_type_source),
                                Type: rst.Type,
                                PartList: PartList_source,
                                CreateTime: new Date(),
                                Creator: window.parent.User_Info.Name
                            };

                            Data_type_source.push(inputDate);

                            model.com.postAPSProductTypeSave({
                                data: Data_type_source,
                            }, function (res) {
                                alert("新增成功！！");
                                model.com.refresh();
                            });
                            return false;
                        }, TypeSource_Type));

                });
                //新增工序
                $("body").delegate("#lmvt-part-add", "click", function () {

                    $("body").append($com.modal.show(Defaul_Value_PartPoint, KETWROD_PartPoint, "新增工序", function (rst) {
                        if (!rst || $.isEmptyObject(rst))
                            return false;

                        var inputDate = {
                            ID: model.com.GetMaxID(Data_type_source),
                            PartPointName: rst.PartPointName,
                            CreateTime: new Date(),
                            Creator: window.parent.User_Info.Name
                        };

                        Data_type_source[number].PartList[SonNumber].PartPointList.push(inputDate);

                        model.com.postAPSProductTypeSave({
                            data: Data_type_source,
                        }, function (res) {
                            alert("新增成功！！");
                            model.com.refresh();
                        });
                        return false;
                    }, TypeSource_PartPoint));

                });
                //删除工序
                $("body").delegate("#lmvt-part-delete", "click", function () {

                    var SelectData = $com.table.getSelectionData($(".lmvt-type-body"), "ID", Data_PartPointList);

                    if (!SelectData || !SelectData.length) {
                        alert("至少选择一行数据再试！")
                        return;
                    }
                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {
                        return;
                    }

                    Data_type_source[number].PartList[SonNumber].PartPointList = model.com.DeletePartPoint(Data_PartPointList, SelectData);

                    model.com.postAPSProductTypeSave({
                        data: Data_type_source,
                    }, function (res) {
                        alert("删除成功！！");
                        model.com.refresh();
                    });
                });
                //删除类型
                $("body").delegate("#lmvt-table-type-delete", "click", function () {

                    var Data = {
                        selectData: [
                        ]
                    },
                        TypeID = [];

                    $.each($(".lmvt-typeTree").find('li').find('input'), function (i, item) {
                        if ($(item).is(":checked")) {
                            var k = {
                                son: $(item).closest('li').attr("data-value"),
                                far: $(item).closest('li').closest("ul").closest("li").attr("data-value")
                            }
                            Data.selectData.push(k);
                        }

                    });

                    $.each($(".lmvt-typeTree").find('li').find('input'), function (i, item) {

                        if ($(item).is(":checked")) {
                            TypeID.push($(item).closest('li').attr("data-value") - 1);
                        }

                    });

                    var p_number = [];

                    $.each(Data.selectData, function (i, itme_i) {

                        $.each(Data_capacityType_source, function (j, itme_j) {
                            if (itme_j.ID == itme_i.far)
                                if (!itme_i.son) {
                                    alert("确定删除整个产品类型？")
                                    itme_j.splice(j, 1);
                                }
                                else
                                    $.each(itme_j.PartList, function (k, item_k) {
                                        if (item_k.PartID == itme_i.son) {
                                            var P = {
                                                pID: itme_i.far - 1,
                                                pPartID: k
                                            }
                                            p_number.push(P);
                                        }
                                    });
                        });
                    });


                    var _typeval = {};
                    var _partval = 0;

                    $.each(p_number, function (i, item) {
                        if (!_typeval[item.pID])
                            _typeval[item.pID] = 0;
                        Data_type_source[item.pID].PartList.splice(
                            item.pPartID - _typeval[item.pID], 1);

                        _typeval[item.pID]++;

                    });

                    $.each(TypeID, function (i, item) {

                        Data_type_source.splice(item - _partval, 1);

                        _partval++;

                    });

                    if (!(TypeID.length) || !TypeID.length) {
                        alert("至少选择一行数据再试！")
                        return;
                    }
                    if (!confirm("已选择" + TypeID.length + "条数据，确定将其删除？")) {
                        return;
                    }

                    model.com.postAPSProductTypeSave({
                        data: Data_type_source,
                    }, function (res) {
                        alert("删除成功！！");
                        model.com.refresh();
                    });
                });

                //树的点击事件
                $("body").delegate(".lmvt-typeTree li ul li", "click", function () {
                    var $this = $(this),
                        $far = $this.closest("ul").closest("li"),
                        TreeID = $far.attr("data-value"),
                        SonID = $this.attr("data-value");

                    $(".lmvt-typeTree li ul li").css("color", "black");
                    $this.css("color", "blue");
                    // if()


                    ID = TreeID;
                    SinID = SonID;
                    model.com.Romance(TreeID, SonID);
                });

            },
            run: function () {
                model.com.getAPSProductTypeAll({}, function (res) {
                    if (!res)
                        return;
                    var list = res.list,
                        rst = [];
                    if (list) {
                        capacityType_source = res.list;

                        Data_capacityType_source = res.list;

                        capacityType_source = $com.util.Clone(capacityType_source);

                        PartList_source = capacityType_source[2].PartList;

                        $.each(PartList_source, function (i, item) {

                            TypeSource_Part.PartName.push({
                                name: item.PartName,
                                value: item.PartID
                            });

                        });
                    }
                    // $(".lmvt-capacity-body").html($com.util.template(capacity_source, HTML.CapacityList));
                });
                model.com.refresh();
            },
            com: {

                //类型
                getAPSProductTypeAll: function (data, fn, context) {
                    var d = {
                        $URI: "/APSProduct/TypeAll",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                postAPSProductTypeSave: function (data, fn, context) {
                    var d = {
                        $URI: "/APSProduct/TypeSave",
                        $TYPE: "post"
                    };
                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                refresh: function () {
                    model.com.getAPSProductTypeAll({}, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];
                        if (list) {
                            capacityType_source = res.list;

                            Data_capacityType_source = res.list;

                            capacityType_source = $com.util.Clone(capacityType_source);

                        }

                    });

                    model.com.getAPSProductTypeAll({}, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];
                        if (list) {

                            Data_type_source = res.list;

                            type_source = res.list;

                            type_source = $com.util.Clone(type_source);

                        }
                        model.com.renderTree(type_source);
                        model.com.Romance(ID, SinID);
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
                //删除工序
                DeletePartPoint: function (_source, set_data) {
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

                    return rst;
                },
                //删除工序段
                DeletePart: function (_source, set_data) {
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

                    return rst;
                },
                //最大编号
                GetMaxID: function (_source) {
                    var id = 0;
                    if (!_source)
                        _source = [];
                    $.each(_source, function (i, item) {
                        if (item.ID > id)
                            id = item.ID;
                    });
                    return id + 1;
                },

                renderTree: function (list) {
                    //list  ： Type List
                    model._treeData = list;

                    $.each(list, function (i, item) {
                        item.Items = $com.util.template(item.PartList, HTML.TreePartList);
                    });

                    $(".lmvt-typeTree").html($com.util.template(list, HTML.TreeTypeList));
                    $(".lmvt-typeTree").treeview();
                },

                //根据点击渲染子菜单
                Romance: function (ID, Number) {

                    for (var i = 0; i < capacityType_source.length; i++) {

                        if (capacityType_source[i].ID == ID) {
                            $.each(capacityType_source[i].PartList, function (j, item) {
                                for (var k = 0; k < item.PartPointList.length; k++) {
                                    item.PartPointList[k].ID = k + 1;
                                }

                                if (item.PartID == Number) {
                                    number = i;
                                    SonNumber = j;
                                    $(".lmvt-type-body").html($com.util.template(capacityType_source[i].PartList[j].PartPointList, HTML.TypeList));
                                    Data_PartPointList = capacityType_source[i].PartList[j].PartPointList;
                                }
                            });
                        }
                    }
                },

            },
        });
        model.init();
    });