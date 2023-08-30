require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($alfie, $com) {
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
    var TestArray;

    HTML = {
        TableNode_item: [
            '<tr data-color="">',
            // '<td style="width: 3px"><input type="checkbox"',
            // 'class="femi-tb-checkbox" style="margin: 1px 0px 1px;" /></td> ',
            '<td style="min-width: 50px;" data-title="ID" data-value="{{ID}}">{{WID}}</td>',
            '<td style="min-width: 50px" data-title="Code" data-value="{{Code}}">{{Code}}</td>',
            '<td style="min-width: 50px" data-title="Name" data-value="{{Name}}">{{Name}}</td>',
            '<td style="min-width: 50px" data-title="ParentName" data-value="{{ParentName}}">{{ParentName}}</td>',
            '<td style="min-width: 50px" data-title="OperatorName" data-value="{{OperatorName}}">{{OperatorName}}</td>',
            '<td style="min-width: 50px" data-title="OperateTime" data-value="{{OperateTime}}">{{OperateTime}}</td>',
            '<td style="min-width: 50px" data-title="Remark" data-value="{{Remark}}">{{Remark}}</td>',
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
            "ID|区域编号",
            "Name|区域名称*",
            "Code|区域编码",
            "ParentID|上级区域*|ArrayOne",
            "OperateTime|时间|DateTime",
            "Remark|区域描述",
        ];


        KEYWORD_department = {};
        Formattrt_department = {};
        TypeSource_department = {
            ParentID: [],
        };

        $.each(KEYWORD_department_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD_department[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
            };

            if (detail.length > 2) {
                Formattrt_department[detail[0]] = $com.util.getFormatter(TypeSource_department, detail[0], detail[2]);
            }
        });
    })();

    model = $com.Model.create({
        name: '区域管理',

        type: $com.Model.MAIN, //主方法

        configure: function () {
            this.run();
        },

        events: function () {

            //区域新增
            $("body").delegate("#alfie-add-level", "click", function () {
                //将Json数据中的数据值改成对应默认值，然后传入进去
                DEFAULT_VALUE_D = {
                    Name: "",
                    ParentID: 0,
                    Remark: "",
                };
                $("body").append($com.modal.show(DEFAULT_VALUE_D, KEYWORD_department, "新增区域", function (rst) {
                    //调用插入函数然后用load刷新数据源

                    if (!rst || $.isEmptyObject(rst))
                        return false;
                    var _data = {
                        ID: 0,
                        Name: rst.Name,
                        ParentID: Number(rst.ParentID),
                        Active: 0,
                        Remark: rst.Remark,
                    };
                    for (var i = 0; i < mData.length; i++) {
                        if (rst.Name == mData[i].Name) {
                            alert("新增区域已存在！");
                            return false;
                        }
                    }

                    $com.util.deleteLowerProperty(_data);
                    model.com.postBMSRegion({
                        data: _data,
                    }, function (res) {
                        alert("新增成功！！");
                        model.com.refresh();
                    });
                }, TypeSource_department));
            });
            //区域修改
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
                    ParentID: SelectData[0].ParentID,
                    Remark: SelectData[0].Remark,
                    Code: SelectData[0].Code,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_department, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].Name = rst.Name;
                    SelectData[0].ParentID = Number(rst.ParentID);
                    SelectData[0].Remark = rst.Remark;
                    SelectData[0].Code = rst.Code;
                    $com.util.deleteLowerProperty(SelectData[0]);
                    model.com.postBMSRegion({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功！！");
                        model.com.refresh();
                    });

                }, TypeSource_department));
            });
            //区域删除
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

                model.com.DeleteBMSRegion({
                    data: SelectData,
                }, function (res) {
                    alert("删除成功！！");
                    model.com.refresh();
                });
            });
            //区域激活 禁用
            $("body").delegate(".ActiveSubmit", "click", function () {
                var $this = $(this),
                    wActiveID = Number($this.attr("data-value"));
                wID = Number($this.attr("data-id"));

                // for (var i = 0; i < mCloneData.length; i++) {
                //     if (mCloneData[i].ID == wID) {
                //         if (wActiveID == 1) {
                //             mCloneData[i].Active = 2;
                //         }
                //         if (wActiveID == 2) {
                //             mCloneData[i].Active = 1;
                //         }
                //     }
                // }
                // $.each(mCloneData, function (i, item) {
                //     if (item.Active == 1) {
                //         item.Switch = "switchTrue";
                //     } else {
                //         item.Switch = "switchFalse";
                //     }
                // });
                // $("#femi-Device-tbody-item").html($com.util.template(mCloneData, HTML.TableNode_item));


                var SelectData = mData.filter((item) => {
                    return item.ID == wID;
                });

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！");
                    return;
                }
                if (wActiveID == 1) {
                    wActiveID = 2;
                    SelectData.Active = 2;
                } else {
                    wActiveID = 1;
                    SelectData.Active = 1;
                }

                model.com.ActiveBMSRegion({
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
                noneSelectedText: '请选择', //默认显示内容
                deselectAllText: '全不选',
                selectAllText: '全选',
            });
            model.com.refresh();
        },

        com: {

            getBMSRegion: function (data, fn, context) {
                var d = {
                    $URI: "/BMSRegion/All",
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
                model.com.getBMSRegion({
                    ParentID: -1,
                    Active: mActive,
                    Name: mCode,
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
                            TypeSource_department.ParentID.push({
                                name: item.Name,
                                value: item.ID,
                                far: null,
                            });
                            TypeSource_department.ParentID = model.com.arryOnea(TypeSource_department.ParentID);
                            for (var p in item) {
                                if (!Formattrt_department[p])
                                    continue;
                                item[p] = Formattrt_department[p](item[p]);
                            }
                            item.WID = i + 1;
                        });
                        mCloneData = $com.util.Clone(wItem);
                        $("#femi-Device-tbody-item").html($com.util.template(wItem, HTML.TableNode_item));
                        model.com.deleteClass(".lmvt-delete", mData);
                        $com.app.loaded();
                    }
                });
            },
            //删除按钮样式的变化
            deleteClass: function (name, data) {
                data.forEach((element, index) => {
                    if (element.Active > 0) {
                        $($(name)[index]).css({"cursor": "not-allowed", "color": "RGB(204, 204, 204)"});
                        $(name)[index].onclick = function (event) {
                            event.stopPropagation();
                        };
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
            //获取部门列表

            getDepartment: function (data, fn, context) {
                var d = {
                    $URI: "/Department/AllDepartment",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //新增修改区域
            postBMSRegion: function (data, fn, context) {
                var d = {
                    $URI: "/BMSRegion/Update",
                    $TYPE: "post",
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //删除区域
            DeleteBMSRegion: function (data, fn, context) {
                var d = {
                    $URI: "/BMSRegion/Delete",
                    $TYPE: "post",
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            ActiveBMSRegion: function (data, fn, context) {
                var d = {
                    $URI: "/BMSRegion/Active",
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