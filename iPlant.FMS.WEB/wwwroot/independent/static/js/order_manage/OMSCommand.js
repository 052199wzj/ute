require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/paging'], function ($alfie, $com, $page) {
    var Formattrt_department; //字段格式化对象
    var KEYWORD_department; //查询关键字
    var KEYWORD_department_LIST; //定义字段格式(用于表格字段转换)
    var TypeSource_department; //枚举对象(用于字段转换)
    var mCloneData; //克隆的数据源(用于模糊查询)
    var HTML; //HTML模板
    var mActive = -1;
    var mID = -1;
    var mCode = "";
    var mData;
    var NewDate = [];
    var mStartTime = $com.util.format("yyyy-MM-dd", new Date().getTime() - 30 * 24 * 3600 * 1000);
    var mEndTime = $com.util.format("yyyy-MM-dd", new Date().getTime() + 24 * 3600 * 10);

    HTML = {

        TableNode_item: [
            '<tr data-color="">',
            // '<td style="width: 3px"><input type="checkbox"',
            // 'class="femi-tb-checkbox" style="margin: 1px 0px 1px;" /></td> ',
            '<td style="min-width: 50px;" data-title="ID" data-value="{{ID}}">{{WID}}</td>',
            // '<td style="min-width: 50px" data-title="WBSNo" data-value="{{WBSNo}}">{{WBSNo}}</td>',
            '<td style="min-width: 50px" data-title="PartNo" data-value="{{PartNo}}">{{PartNo}}</td>',
            '<td style="min-width: 50px" data-title="Factory" data-value="{{Factory}}">{{Factory}}</td>',
            '<td style="min-width: 50px" data-title="CustomerName" data-value="{{CustomerName}}">{{CustomerName}}</td>',
            '<td style="min-width: 50px" data-title="OrderCount" data-value="{{OrderCount}}">{{OrderCount}}</td>',
            '<td style="min-width: 50px" data-title="Creator" data-value="{{Creator}}">{{Creator}}</td>',
            '<td style="min-width: 50px" data-title="CreateTime" data-value="{{CreateTime}}">{{CreateTime}}</td>',
            '<td style="min-width: 50px" data-title="Editor" data-value="{{Editor}}">{{Editor}}</td>',
            '<td style="min-width: 50px" data-title="EditTime" data-value="{{EditTime}}">{{EditTime}}</td>',
            '<td data-title="Active" data-value="{{Active}}"data-id="{{ID}}"  class="ActiveSubmit" > <input type="checkbox"  class="{{Switch}}" /></td>',
            '<td style="max-width: 80px" data-title="Handle" data-value="{{ID}}"><div class="row">',
            '<div class="col-md-6 lmvt-do-info lmvt-resetPencil"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>编辑</div>',
            '<div class="col-md-6 lmvt-do-info lmvt-delete"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span>删除</div>',
            '</div></td>',
            '</tr>',
        ].join(""),

    };

    (function () {
        KEYWORD_department_LIST = [
            "ID|工单编号",
            "Name|工单名称",
            "ParentID|上级工单|ArrayOne",
            "Type|类别|ArrayOne",
            // "Active|状态|ArrayOne",
            "OperatorID|人员|ArrayOne",
            "EditTime|时间|DateTime",
            "Remark|工单描述",
        ];


        KEYWORD_department = {};
        Formattrt_department = {};
        TypeSource_department = {
            // Active: [{
            //     name: "未使用",
            //     value: 0
            // },{
            //     name: "启用",
            //     value: 1
            // }, {
            //     name: "禁用",
            //     value: 2
            // }],
            ParentID: [{
                name: "无",
                value: 0,
            }],
            OperatorID: [{
                name: "无",
                value: 0,
            }],
            Type: [{
                name: "-",
                value: 0,
            }, {
                name: "部门",
                value: 1,
            }, {
                name: "工区",
                value: 2,
            }, {
                name: "班组",
                value: 3,
            },
                {
                    name: "供应商",
                    value: 11,
                }],
        };

        $.each(KEYWORD_department_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD_department[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
            };
            var _column = {
                field: detail[0],
                title: detail[1],
                align: 'center',
                valign: 'middle',
                sortable: true,
            };
            if (detail.length > 2) {
                Formattrt_department[detail[0]] = $com.util.getFormatter(TypeSource_department, detail[0], detail[2]);
            }
        });
    })();

    model = $com.Model.create({
        name: '工单管理',

        type: $com.Model.MAIN, //主方法

        configure: function () {
            this.run();
        },

        events: function () {

            //工单新增
            $("body").delegate("#alfie-add-level", "click", function () {
                //将Json数据中的数据值改成对应默认值，然后传入进去
                DEFAULT_VALUE_D = {
                    Name: "",
                    ParentID: 0,
                    Type: 0,
                    Remark: "",
                };
                $("body").append($com.modal.show(DEFAULT_VALUE_D, KEYWORD_department, "新增工单", function (rst) {
                    //调用插入函数然后用load刷新数据源 

                    if (!rst || $.isEmptyObject(rst))
                        return false;
                    var _data = {
                        ID: 0,
                        Name: rst.Name,
                        ParentID: Number(rst.ParentID),
                        SonList: [],
                        Active: 0,
                        Remark: rst.Remark,
                        Type: Number(rst.Type),
                    };
                    for (var i = 0; i < mData.length; i++) {
                        if (rst.Name == mData[i].Name) {
                            alert("新增工单已存在！");
                            return false;
                        }
                    }

                    $com.util.deleteLowerProperty(_data);
                    model.com.postOMSCommand({
                        data: _data,
                    }, function (res) {
                        alert("新增成功！！");
                        model.com.refresh();
                    });
                }, TypeSource_department));
            });
            //工单修改
            $("body").delegate(".lmvt-resetPencil", "click", function () {

                // var SelectData = $com.table.getSelectionData($(".l-containe-canvas-table .l-department-body"), "ID", AllDepartment);

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = mData.filter((item) => {
                    return item.ID == wID;
                });

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！");
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！");
                    return;
                }
                var default_value = {
                    Name: SelectData[0].Name,
                    Type: SelectData[0].Type,
                    ParentID: SelectData[0].ParentID,
                    Remark: SelectData[0].Remark,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_department, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].Name = rst.Name;
                    SelectData[0].Type = Number(rst.Type);
                    SelectData[0].ParentID = Number(rst.ParentID);
                    SelectData[0].Remark = rst.Remark;
                    $com.util.deleteLowerProperty(SelectData[0]);
                    model.com.postOMSCommand({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功！！");
                        model.com.refresh();
                    });

                }, TypeSource_department));
            });
            //工单删除
            $("body").delegate(".lmvt-delete", "click", function () {
                // var SelectData = $com.table.getSelectionData($(".l-containe-canvas-table .l-department-body"), "ID", AllDepartment);

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = mData.filter((item) => {
                    return item.ID == wID;
                });

                if (!SelectData || !SelectData.length) {
                    alert("至少选择一行数据再试！");
                    return;
                }
                if (SelectData[0].Active != 0) {
                    alert("已激活或者禁用数据无法删除！");
                    return;
                }

                if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {
                    return;
                }

                model.com.DeleteOMSCommand({
                    data: SelectData,
                }, function (res) {
                    alert("删除成功！！");
                    model.com.refresh();
                });
            });
            //工单激活 禁用
            $("body").delegate(".ActiveSubmit", "click", function () {
                var $this = $(this),
                    wActiveID = Number($this.attr("data-value"));
                wID = Number($this.attr("data-id"));

                var SelectData = mData.filter((item) => {
                    return item.ID == wID;
                });

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！");
                    return;
                }
                if (wActiveID == 1) {
                    wActiveID = 2;
                } else {
                    wActiveID = 1;
                }

                model.com.ActiveOMSCommand({
                    Active: wActiveID,
                    data: SelectData,
                }, function (res) {
                    alert("操作成功！");
                    model.com.refresh();
                });
            });
            //重置
            $("body").delegate("#lmvt-reset", "click", function () {
                $(".selectpicker").selectpicker('deselectAll');
                mActive = -1;
                $("#alfie-query-Code").val("");
                mCode = "";
                mID = -1;
            });
            //查询
            $("body").delegate("#lmvt-search", "click", function () {
                mActive = $("#alfie-query-status").val();
                mCode = $("#alfie-query-Code").val();
                for (var i = 0; i < mCloneData.length; i++) {
                    if (mCloneData[i].Name == mCode) {
                        mID = mCloneData[i].ID;
                    }
                }
                model.com.refresh();
            });
        },

        run: function () {
            // 开关
            $(".selectpicker").selectpicker({
                noneSelectedText: '请选择',//默认显示内容
                deselectAllText: '全不选',
                selectAllText: '全选',
            });
            model.com.refresh();
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

                model.com.getOMSCommand({
                    CustomerID: -1,
                    FactoryID: -1,
                    BusinessUnitID: -1,
                    WorkShopID: -1,
                    ProductID: -1,
                    StartTime: mStartTime,
                    EndTime: mEndTime,
                }, function (res) {
                    if (res && res.list) {

                        mData = $com.util.Clone(res.list);
                        //数据源字段模板转换
                        var wItem = $com.util.Clone(mData);

                        $.each(wItem, function (i, item) {
                            if (item.Active == 1) {
                                item.Switch = "switchTrue";
                            } else {
                                item.Switch = "switchFalse";
                            }
                            for (var p in item) {
                                if (!Formattrt_department[p])
                                    continue;
                                item[p] = Formattrt_department[p](item[p]);
                            }
                            item.WID = i + 1;
                        });
                        mCloneData = $com.util.Clone(wItem);
                        $("#femi-Device-tbody-item").html($com.util.template(wItem, HTML.TableNode_item));

                        // $page.init($("#femi-Device-tbody-item").closest("table"), wItem, "", function (res) {
                        //     $("#femi-Device-tbody-item").html($com.util.template(res, HTML.TableNode_item));
                        // });

                        $com.app.loaded();
                    }
                });
            },
            arryOnea: function (data) {
                var temp = {};
                var arr = [];
                var len = data.length;
                for (var i = 0; i < len; i++) {
                    if (!temp[data[i].value]) {
                        temp[data[i].value] = "abc";
                        arr.push(data[i]);
                    }
                }
                return arr;
            },
            //获取工单列表

            getOMSCommand: function (data, fn, context) {
                var d = {
                    $URI: "/OMSCommand/All",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //新增修改工单
            postOMSCommand: function (data, fn, context) {
                var d = {
                    $URI: "/OMSCommand/Update",
                    $TYPE: "post",
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //删除工单
            DeleteOMSCommand: function (data, fn, context) {
                var d = {
                    $URI: "/OMSCommand/Delete",
                    $TYPE: "post",
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            ActiveOMSCommand: function (data, fn, context) {
                var d = {
                    $URI: "/OMSCommand/Active",
                    $TYPE: "post",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
        },
    }),
        model.init();
});