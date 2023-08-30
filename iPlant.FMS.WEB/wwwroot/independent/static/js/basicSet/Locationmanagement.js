require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'],
    function ($alfie, $com) {
        var Formattrt_station; //字段格式化对象
        var KEYWORD_station; //查询关键字
        var KEYWORD_station_LIST; //定义字段格式(用于表格字段转换)
        var TypeSource_station; //枚举对象(用于字段转换)
        var mCloneData; //克隆的数据源(用于模糊查询)
        var HTML; //HTML模板
        var mActive = -1;
        var mData;
        var mAreaID = -1;
        var mResourceActive;
        var mStationID;
        var mDataResource;
        var mCloneDataResource;
        var mStationName;
        var resource_stationName;
        HTML = {
            //工位表格模板
            TableNode_item: [
                '<tr data-color="">',
                // '<td style="width: 3px"><input type="checkbox"',
                // 'class="femi-tb-checkbox" style="margin: 1px 0px 1px;" /></td> ',
                '<td style="min-width: 50px;" data-title="ID" data-value="{{ID}}">{{WID}}</td>',
                '<td style="min-width: 50px" data-title="Code" data-value="{{Code}}">{{Code}}</td>',
                '<td style="min-width: 50px" data-title="Name" data-value="{{Name}}">{{Name}}</td>',
                '<td style="min-width: 50px" data-title="AreaName" data-value="{{AreaName}}">{{AreaName}}</td>',
                '<td style="min-width: 50px" data-title="WorkName" data-value="{{WorkName}}">{{WorkName}}</td>',
                '<td style="min-width: 50px" data-title="CreateTime" data-value="{{CreateTime}}">{{CreateTime}}</td>',
                '<td style="min-width: 50px" data-title="EditTime" data-value="{{EditTime}}">{{EditTime}}</td>',
                '<td style="min-width: 50px" data-title="Remark" data-value="{{Remark}}">{{Remark}}</td>',
                '<td data-title="Active" data-value="{{Active}}"data-id="{{ID}}"  class="ActiveSubmit" > <input type="checkbox"  class="{{Switch}}" /></td>',
                '<td style="max-width: 80px" data-title="Handle" data-value="{{ID}}"><div class="row">',
                '<div class="col-md-6 lmvt-do-info lmvt-resetPencil" style="width: 33%"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>编辑</div>',
                '<div class="col-md-6 lmvt-do-info lmvt-resources"style="width: 33%"><span class="glyphicon glyphicon-calendar" aria-hidden="true"></span>资源</div>',
                '<div class="col-md-6 lmvt-do-info lmvt-delete" style="width: 33%"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span>删除</div>',
                '</div></td>',
                '</tr>',
            ].join(""),
            //资源表格模板
            TableNode_resource: [
                '<tr data-color="">',
                // '<td style="width: 3px"><input type="checkbox"',
                // 'class="femi-tb-checkbox" style="margin: 1px 0px 1px;" /></td> ',
                '<td style="min-width: 50px;" data-title="ID" data-value="{{ID}}">{{WID}}</td>',
                '<td style="min-width: 50px" data-title="Code" data-value="{{Code}}">{{Code}}</td>',
                '<td style="min-width: 50px" data-title="Name" data-value="{{Name}}">{{Name}}</td>',
                '<td style="min-width: 50px" data-title="StationCode" data-value="{{StationCode}}">{{StationCode}}</td>',
                '<td style="min-width: 50px" data-title="StationName" data-value="{{StationName}}">{{StationName}}</td>',
                '<td style="min-width: 50px" data-title="CreateTime" data-value="{{CreateTime}}">{{CreateTime}}</td>',
                '<td style="min-width: 50px" data-title="EditTime" data-value="{{EditTime}}">{{EditTime}}</td>',
                '<td style="min-width: 50px" data-title="Type" class="fxy-Type" data-value="{{Type}}">{{Type}}</td>',
                '<td data-title="Active" data-value="{{Active}}"data-id="{{ID}}"  class="ActiveSubmit" > <input type="checkbox"  class="{{Switch}}" /></td>',
                '<td style="max-width: 80px" data-title="Handle" data-value="{{ID}}"><div class="row">',
                '<div class="col-md-6 lmvt-do-info lmvt-delete-resource"style="width: 100%;"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span>删除</div>',
                '</div></td>',
                '</tr>',
            ].join(""),
            //区域选择项
            AreaName: [
                '<option value="{{value}}" >{{name}}</option>',
            ].join(""),

        };

        (function () {
            KEYWORD_station_LIST = [
                "ID|工位编号",
                "Code|工位编码*",
                "Name|工位名称*",
                "AreaID|区域*|ArrayOne",
                // "Type|类别|ArrayOne",
                // "Active|状态|ArrayOne",
                "WorkName|作业名称",
                "EditTime|编辑时间|DateTime",// property Name type ParentProperty
                "Remark|工位描述",
            ];
            KEYWORD_resource_LIST = [
                "ID|资源编号",
                "Code|资源编码",
                "Name|资源名称",
                "StationCode|工位编码",
                "StationName|工位名称",
                "Device|设备名称|ArrayOne",
                "Type|类型",
                "EditTime|编辑时间|DateTime",
            ];

            KEYWORD_station = {};
            KEYWORD_resource = {};
            Formattrt_station = {};
            Formattrt_resource = {};
            TypeSource_station = {
                AreaID: [{
                    name: "无",
                    value: 0,
                }],
            };
            TypeSource_resource = {
                Type: [{
                    name: "默认",
                    value: 0,
                },
                    {
                        name: "设备",
                        value: 1,
                    },
                    {
                        name: "备件",
                        value: 2,
                    },
                    {
                        name: "工装",
                        value: 3,
                    },
                    {
                        name: "量具",
                        value: 4,
                    },
                ],
                Device: [],
            };

            $.each(KEYWORD_station_LIST, function (i, item) {
                var detail = item.split("|");
                KEYWORD_station[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                };
                if (detail.length > 2) {
                    Formattrt_station[detail[0]] = $com.util.getFormatter(TypeSource_station, detail[0], detail[2]);
                }
            });
            $.each(KEYWORD_resource_LIST, function (i, item) {
                var detail = item.split("|");
                KEYWORD_resource[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                };
                if (detail.length > 2) {
                    Formattrt_resource[detail[0]] = $com.util.getFormatter(TypeSource_resource, detail[0], detail[2]);
                }
            });

        })();

        model = $com.Model.create({
            name: '工位管理',
            el: '#Locationmanagement',
            VueName: 'vm',
            data: {
                Area: [],
            },
            type: $com.Model.MAIN, //主方法
            configure: function () {
                this.run();
            },
            events: function () {
                //工位新增
                $("body").delegate("#alfie-add-level", "click", function () {
                    //将Json数据中的数据值改成对应默认值，然后传入进去
                    DEFAULT_VALUE_D = {
                        Name: "",
                        Code: "",
                        AreaID: 0,
                        Remark: "",
                        WorkName: "",
                        mode: 1,
                    };

                    $("body").append($com.modal.show(DEFAULT_VALUE_D, KEYWORD_station, "新增工位", function (rst) {
                        //调用插入函数然后用load刷新数据源
                        if (!rst || $.isEmptyObject(rst))
                            return false;
                        var _data = {
                            ID: 0,
                            Name: rst.Name,
                            Code: rst.Code,
                            AreaID: rst.AreaID,
                            Active: 0,
                            Remark: rst.Remark,
                            WorkName: rst.WorkName,
                        };
                        for (var i = 0; i < mData.length; i++) {
                            if (rst.Name == mData[i].Name) {
                                alert("新增工位已存在！");
                                return false;
                            }
                        }

                        $com.util.deleteLowerProperty(_data);
                        model.com.Updatestation({
                            data: _data,
                        }, function (res) {
                            alert("新增成功！！");
                            model.com.refresh();
                        });
                    }, TypeSource_station));
                });
                //工位修改
                $("body").delegate(".lmvt-resetPencil", "click", function () {

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
                        Code: SelectData[0].Code,
                        AreaID: SelectData[0].AreaID,
                        Remark: SelectData[0].Remark,
                        WorkName: SelectData[0].WorkName,
                    };
                    $("body").append($com.modal.show(default_value, KEYWORD_station, "修改", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        SelectData[0].Name = rst.Name;
                        SelectData[0].Code = rst.Code;
                        SelectData[0].AreaID = rst.AreaID;
                        SelectData[0].Remark = rst.Remark;
                        SelectData[0].WorkName = rst.WorkName;
                        // SelectData[0].Remark = rst.Remark;
                        $com.util.deleteLowerProperty(SelectData[0]);
                        model.com.Updatestation({
                            data: SelectData[0],
                        }, function (res) {
                            alert("修改成功！！");
                            model.com.refresh();
                        });

                    }, TypeSource_station));
                });
                //工位删除
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
                    model.com.Deletestation({
                        data: SelectData,
                    }, function (res) {
                        alert("删除成功！！");
                        model.com.refresh();
                    });

                });
                //状态激活 禁用
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

                    model.com.Activestation({
                        Active: wActiveID,
                        data: SelectData,
                    }, function (res) {
                        alert("操作成功！");
                        model.com.refresh();
                    });
                });
                //资源按钮
                $("body").delegate(".lmvt-resources", "click", function () {
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
                    mStationID = SelectData[0].ID;
                    mStationName = SelectData[0].Name;
                    $(".zzza").hide();
                    $(".zzzd").show();
                    $(window).resize();
                    //资源标题
                    $("#fxy-resource-title").text(mStationName);
                    model.com.refreshResource();
                    //移除添加选项里的已有设备
                    model.com.Getdevice({Active: -1}, function (resP) {
                        var wData = [];
                        var a = [];
                        $.each(resP.list, function (i, item) {
                            TypeSource_resource.Device.push({
                                name: item.Name,
                                value: item.ID,
                                far: null,
                            });
                        });
                        a = TypeSource_resource.Device;
                        $.each(mDataResource, function (i, item) {
                            wData.push({
                                name: item.Name,
                                value: item.ResourceID,
                                far: null,
                            });
                        });

                        wData.forEach(item => {
                            a = a.filter(a => a.value != item.value);
                        });
                        TypeSource_resource.Device = a;
                    });
                });
                //返回
                $("body").delegate("#alfie-add-level-back", "click", function () {
                    $(".zzza").show();
                    $(".zzzd").hide();
                    $(window).resize();

                });
                //重置
                $("body").delegate("#lmvt-reset", "click", function () {
                    $(".selectpicker").selectpicker('deselectAll');
                });
                //查询
                $("body").delegate("#lmvt-search", "click", function () {
                    mAreaID = $("#alfie-query-Area").val();
                    mActive = $("#alfie-query-status").val();
                    model.com.refresh();
                });
                //资源新增
                $("body").delegate("#alfie-add-level-Date", "click", function () {
                    //将Json数据中的数据值改成对应默认值，然后传入进去
                    DEFAULT_VALUE_D = {
                        StationID: 0,
                        Device: 0,
                        mode: 1,
                    };
                    //资源增加
                    $("body").append($com.modal.show(DEFAULT_VALUE_D, KEYWORD_resource, "新增资源", function (rst) {
                        //调用插入函数然后用load刷新数据源
                        if (!rst || $.isEmptyObject(rst))
                            return false;
                        var _data = {
                            ResourceID: Number(rst.Device),
                            StationID: mStationID,
                            Type: 1,
                        };
                        for (var i = 0; i < mData.length; i++) {
                            if (rst.Name == mData[i].Name) {
                                alert("新增资源已存在！");
                                return false;
                            }
                        }
                        $com.util.deleteLowerProperty(_data);
                        model.com.Updateresource({
                            data: _data,
                        }, function (res) {
                            alert("新增成功！！");
                            model.com.refreshResource();
                        });
                    }, TypeSource_resource));
                });
                //删除资源
                $("body").delegate(".lmvt-delete-resource", "click", function () {
                    // var SelectData = $com.table.getSelectionData($(".l-containe-canvas-table .l-department-body"), "ID", AllDepartment);
                    var $this = $(this),
                        wID = Number($this.closest("td").attr("data-value"));

                    var SelectData = mDataResource.filter((item) => {
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
                    model.com.Deleteresource({
                        data: SelectData,
                    }, function (res) {
                        alert("删除成功！！");
                        model.com.refreshResource();
                    });

                });
                //资源状态激活 禁用
                $("body").delegate(".ActiveSubmit", "click", function () {
                    var $this = $(this),
                        wActiveID = Number($this.attr("data-value"));
                    wID = Number($this.attr("data-id"));

                    var SelectData = mDataResource.filter((item) => {
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

                    model.com.Activeresource({
                        Active: wActiveID,
                        data: SelectData,
                    }, function (res) {
                        alert("操作成功！");
                        model.com.refreshResource();
                    });
                });
                //资源页面重置按钮
                $("body").delegate("#lmvt-reset-Resource", "click", function () {
                    $(".selectpicker").selectpicker('deselectAll');
                });
                //资源页面查询
                $("body").delegate("#lmvt-search-Resource", "click", function () {
                    mResourceActive = $("#alfie-query-resource").val();
                    model.com.refreshResource();
                });


            },

            run: function () {
                //添加区域选择项

                // 开关
                $(".selectpicker").selectpicker({
                    noneSelectedText: '请选择', //默认显示内容
                    deselectAllText: '全不选',
                    selectAllText: '全选',
                });
                model.com.getArea({Active: 1}, function (resP) {
                    $.each(resP.list, function (i, item) {
                        TypeSource_station.AreaID.push({
                            name: item.Name,
                            value: item.ID,
                            far: null,
                        });
                    });
                    $("#alfie-query-Area").html($com.util.template(TypeSource_station.AreaID, HTML.AreaName));
                    $('#alfie-query-Area').selectpicker('refresh');
                });
                model.com.refresh();
                // model.com.Getdevice({ Active: -1 }, function (resP) {
                //     $.each(resP.list, function (i, item) {
                //             TypeSource_resource.Device.push({
                //             name: item.Name,
                //             value: item.ID,
                //             far: null
                //         })
                //     });
                //     model.com.refreshResource();
                // });
            },

            com: {
                //刷新界面
                refresh: function () {
                    $com.app.loading('数据加载中...');
                    model.com.Getstation({
                        WorkAreaID: mAreaID,
                        Active: mActive,
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
                                item.WID = i + 1;
                            });
                            mCloneData = $com.util.Clone(wItem);
                            $("#femi-Device-tbody-item").html($com.util.template(wItem, HTML.TableNode_item));
                            $com.app.loaded();
                            model.com.deleteClass(".lmvt-delete", mCloneData);
                        }
                    });
                },
                arryOnea: function (data) {
                    var temp = {};
                    var arr = [];
                    var len = data.length;
                    for (var i = 0; i < len; i++) {
                        if (!temp[data[i].ID]) {
                            temp[data[i].ID] = "abc";
                            arr.push(data[i]);
                        }
                    }
                    return arr;
                },
                //刷新资源界面
                refreshResource: function () {
                    $com.app.loading('数据加载中...');
                    //查看资源
                    model.com.Getresources({
                        StationID: mStationID,
                        Active: mResourceActive,
                    }, function (res) {

                        mDataResource = $com.util.Clone(res.list);
                        //数据源字段模板转换
                        var wItem = $com.util.Clone(mDataResource);

                        $.each(wItem, function (i, item) {
                            if (item.Active == 1) {
                                item.Switch = "switchTrue";
                            } else {
                                item.Switch = "switchFalse";
                            }
                            item.WID = i + 1;
                        });
                        mCloneDataResource = $com.util.Clone(wItem);
                        $("#femi-Date-tbody-item").html($com.util.template(wItem, HTML.TableNode_resource));
                        $com.app.loaded();
                        model.com.Typename();
                        model.com.deleteClass(".lmvt-delete-resource", mCloneDataResource);
                    });

                },
                //将类型ID改成类型名称
                Typename: function () {
                    $.each($(".fxy-Type"), function (i, itme) {
                        switch (Number(itme.innerText)) {
                            case 1:
                                itme.innerText = "设备";
                                break;
                            case 2:
                                itme.innerText = "备件";
                                break;
                            case 3:
                                itme.innerText = "工装";
                                break;
                            case 4:
                                itme.innerText = "量具";
                                break;
                            default:
                                break;
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
                //获取区域
                getArea: function (data, fn, context) {
                    var d = {
                        $URI: "/BMSRegion/All",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取工位
                Getstation: function (data, fn, context) {
                    var d = {
                        $URI: "/FMCStation/All",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //工位修改 新增
                Updatestation: function (data, fn, context) {
                    var d = {
                        $URI: "/FMCStation/Update",
                        $TYPE: "post",
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //修改状态
                Activestation: function (data, fn, context) {
                    var d = {
                        $URI: "/FMCStation/Active",
                        $TYPE: "post",
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //删除工位
                Deletestation: function (data, fn, context) {
                    var d = {
                        $URI: "/FMCStation/Delete",
                        $TYPE: "post",
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取资源
                Getresources: function (data, fn, context) {
                    var d = {
                        $URI: "/FMCResource/All",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //资源修改/增加
                Updateresource: function (data, fn, context) {
                    var d = {
                        $URI: "/FMCResource/Update",
                        $TYPE: "post",
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取设备
                Getdevice: function (data, fn, context) {
                    var d = {
                        $URI: "/DMSDeviceLedger/All",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //查询工位名称
                Infostation: function (data, fn, context) {
                    var d = {
                        $URI: "/FMCStation/Info",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //删除资源
                Deleteresource: function (data, fn, context) {
                    var d = {
                        $URI: "/FMCResource/Delete",
                        $TYPE: "post",
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //资源状态
                Activeresource: function (data, fn, context) {
                    var d = {
                        $URI: "/FMCResource/Active",
                        $TYPE: "post",
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
            },
        });
        model.init();

    });