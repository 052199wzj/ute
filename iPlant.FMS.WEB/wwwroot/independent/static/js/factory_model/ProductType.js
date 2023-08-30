require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($zace, $com) {

    var KEYWORD_Level_LIST,
        KEYWORD_Level,
        FORMATTRT_Level,
        DEFAULT_VALUE_Level,
        TypeSource_Level,
        model,
        DataAll,
        DATABasic,
        DataAllConfirmBasic,
        DataAllConfirmChange,
        DataAllConfirm,
        DataAllSearch,
        DataAllFactorySearch,
        HTML;

    DataAll = [];
    DATABasic = [];
    DataAllConfirmBasic = [];
    DataAllConfirmChange = [];
    DataAllConfirm = [];
    DataAllFactorySearch = DataAllSearch = [];
    PositionTemp = {
        Active: 1,
        Auditor: window.parent.User_Info.Name,
        AuditorID: 0,
        AuditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        BusinessUnitID: 0,
        BusinessUnit: "",
        Code: "",
        CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Creator: window.parent.User_Info.Name,
        CreatorID: 0,
        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Editor: window.parent.User_Info.Name,
        EditorID: 0,
        ERPID: 0,
        ID: 0,
        Name: "",
        Status: 1,
        StatusText: "",
        Description: ""
    };


    ;
    HTML = {
        TableMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
            // '<td data-title="Code" data-value="{{Code}}" >{{Code}}</td>',
            '<td data-title="Description" data-value="{{Description}}" >{{Description}}</td>',
            // '<td data-title="BusinessUnit" data-value="{{BusinessUnit}}" >{{BusinessUnit}}</td>',
            //'<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',

            '<td data-title="Creator" data-value="{{Creator}}" >{{Creator}}</td>',
            '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
            '<td data-title="Editor" data-value="{{Editor}}" >{{Editor}}</td>',
            '<td data-title="EditTime" data-value="{{EditTime}}" >{{EditTime}}</td>',
            '<td data-title="Active" data-value="{{Active}}"><span class="badge lmvt-badge {{ClassBadge}}">{{Badge}}</span>{{Active}}</td>',
            // '<td data-title="Active" data-value="{{Active}}" >{{Active}}</td>',
            '<td style="max-width: 80px" data-title="Handle" data-value="{{ID}}"><div class="row">',
            '<div class="col-md-6 {{ISAllowed}}">{{ISAllowedText}}</div>',
            '<div class="col-md-6 lmvt-do-info lmvt-reset">修改</div>',
            '</div></td>',
            //'<td data-title="Auditor" data-value="{{Auditor}}" >{{Auditor}}</td>',
            // '<td data-title="AuditTime" data-value="{{AuditTime}}" >{{AuditTime}}</td>',
            '</tr>',
        ].join(""),



    };
    (function () {
        KEYWORD_Level_LIST = [

            "Name|名称",
            "Code|编码",
            "Description|备注",
            "BusinessUnitID|事业部|ArrayOne",
            "Status|状态|ArrayOne",
            "Active|启用|ArrayOne",
            "CreateTime|时间|DateTime",
            "EditTime|时间|DateTime",
        ];
        KEYWORD_Level = {};
        FORMATTRT_Level = {};

        DEFAULT_VALUE_Level = {
            Name: "",
            // Code: "",
            Description: "",
            // BusinessUnitID: 0,
            //Active: true,
        };

        TypeSource_Level = {
            Active: [
                {
                    name: "保存",
                    value: 0
                },
                {
                    name: "启用",
                    value: 1
                }, {
                    name: "禁用",
                    value: 2
                }
            ],
            BusinessUnitID: [
                {
                    name: "无",
                    value: 0,
                    far: 0
                }
            ],




        };

        $.each(KEYWORD_Level_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD_Level[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_Level[detail[0]] = $com.util.getFormatter(TypeSource_Level, detail[0], detail[2]);
            }
        });
    })();


    model = $com.Model.create({
        name: '类型',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {

            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var value = $('#zace-search-level').val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-riskLevel-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "ID");
                }
            });

            //查询
            $("body").delegate("#zace-searchAll-level", "click", function () {


                var value = $('#zace-search-level').val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "ID");


            });
            $("body").delegate("#zace-edit-refresh", "click", function () {


                model.com.refresh();


            });
            // //产品类型查询
            // $("body").delegate("#zace-search-level", "input", function () {

            //     var $this = $(this),
            //        value = $(this).val();
            //     if (value == undefined || value == "" || value.trim().length < 1)
            //         $("#femi-riskLevel-tbody").children("tr").show();
            //     else
            //         $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "ID");



            // });
            //产品类型修改
            $("body").delegate("#zace-edit-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }

                var default_value = {
                    Description: SelectData[0].Description,
                    Name: SelectData[0].Name,
                    // Code: SelectData[0].Code,
                    // BusinessUnitID: SelectData[0].BusinessUnitID,
                    //FactoryID: SelectData[0].FactoryID,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].Name = rst.Name;
                    SelectData[0].Description = rst.Description;
                    SelectData[0].Code = rst.Name;
                    // SelectData[0].BusinessUnitID = Number(rst.BusinessUnitID);
                    //SelectData[0].FactoryID = Number(rst.FactoryID);
                    // SelectData[0].Active = rst.Active;
                    for (var i = 0; i < SelectData.length; i++) {

                        $com.util.deleteLowerProperty(SelectData[i]);
                    }
                    model.com.postFPCProductType({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                        //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                        //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    })

                }, TypeSource_Level));


            });

            //产品类型修改 单条
            $("body").delegate(".lmvt-reset", "click", function () {
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));


                var SelectData = DATABasic.filter((item) => { return item.ID == wID });

                var default_value = {
                    Description: SelectData[0].Description,
                    Name: SelectData[0].Name,
                    // Code: SelectData[0].Code,
                    // BusinessUnitID: SelectData[0].BusinessUnitID,
                    //FactoryID: SelectData[0].FactoryID,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].Name = rst.Name;
                    SelectData[0].Description = rst.Description;
                    SelectData[0].Code = rst.Name;
                    // SelectData[0].BusinessUnitID = Number(rst.BusinessUnitID);
                    //SelectData[0].FactoryID = Number(rst.FactoryID);
                    // SelectData[0].Active = rst.Active;
                    for (var i = 0; i < SelectData.length; i++) {

                        $com.util.deleteLowerProperty(SelectData[i]);
                    }
                    model.com.postFPCProductType({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                        //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                        //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    })

                }, TypeSource_Level));


            });

            //产品类型启用
            $("body").delegate(".lmvt-do-active", "click", function () {
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));


                var SelectData = DATABasic.filter((item) => { return item.ID == wID });

                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                model.com.activeAudit({
                    data: SelectData,
                    Active: 1,
                }, function (res) {
                    alert("启用成功");
                    model.com.refresh();


                })




            });
            //产品类型禁用
            $("body").delegate(".lmvt-allowed-delete", "click", function () {
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));


                var SelectData = DATABasic.filter((item) => { return item.ID == wID });

                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }

                model.com.activeAudit({
                    data: SelectData,
                    Active: 0,
                }, function (res) {
                    alert("禁用成功");
                    model.com.refresh();


                })

            });

            //产品类型新增
            $("body").delegate("#zace-add-level", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    // PositionTemp.BusinessUnitID = Number(rst.BusinessUnitID);
                    //PositionTemp.FactoryID = Number(rst.FactoryID);
                    PositionTemp.Name = rst.Name;
                    //PositionTemp.Status = Number(rst.Status);
                    PositionTemp.Code = rst.Name;
                    PositionTemp.Description = rst.Description;
                    //  PositionTemp.Active = rst.Active;

                    model.com.postFPCProductType({
                        data: PositionTemp,
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                    })

                }, TypeSource_Level));


            });

            window.setFunctionTrigger("ProductType", function (res) {
                model.com.refresh();
            });

            //产品类型查询
            $("body").delegate("#zace-search-returnAudit", "input", function () {

                var $this = $(this),
                    value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevelAudit-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevelAudit-tbody"), DataAllSearch, value, "ID");
            });
        },

        run: function () {

            model.com.refresh();

        },

        com: {

            refresh: function () {

                model.com.getFPCProductType({ BusinessUnitID: 0 }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var Grade = $com.util.Clone(resP.list);
                        DATABasic = $com.util.Clone(resP.list);

                        //审核数据
                        DataAllConfirm = $com.util.Clone(resP.list);
                        for (var i = 0; i < Grade.length; i++) {
                            Grade[i].WID = i + 1;
                        }
                        DataAll = $com.util.Clone(Grade);

                        $.each(Grade, function (i, item) {
                            item.Badge = " ";

                            if (item.Active == 1) {
                                item.ISAllowedText = "禁用";
                                item.ISAllowed = "lmvt-allowed-delete";
                                item.ClassBadge = "lmvt-activeBadge";

                            } else {
                                item.ISAllowedText = "启用";
                                item.ISAllowed = "lmvt-do-active";
                                item.ClassBadge = "lmvt-defBadge";
                            }

                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }
                            item.WID = i + 1;

                        });
                        DataAllFactorySearch = $com.util.Clone(Grade);
                        $("#femi-riskLevel-tbody").html($com.util.template(Grade, HTML.TableMode));





                    }

                });
            },
            //查询工厂
            getFMCFactory: function (data, fn, context) {
                var d = {
                    $URI: "/FMCFactory/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询事业部
            getBusinessUnit: function (data, fn, context) {
                var d = {
                    $URI: "/BusinessUnit/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询模块ID对应枚举值
            getModuleAll: function (data, fn, context) {
                var d = {
                    $URI: "/MESEnum/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询产品列表
            getFPCProductType: function (data, fn, context) {
                var d = {
                    $URI: "/FPCProductType/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //保存产品列表
            postFPCProductType: function (data, fn, context) {
                var d = {
                    $URI: "/FPCProductType/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //审核
            postAudit: function (data, fn, context) {
                var d = {
                    $URI: "/FPCProductType/Audit",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //启用
            activeAudit: function (data, fn, context) {
                var d = {
                    $URI: "/FPCProductType/Active",
                    $TYPE: "post"
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
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },


            //删除得到新的数据
            getNewList: function (_source, set_data) {
                if (!_source)
                    _source = [];
                if (!set_data)
                    set_data = [];
                var rst = [];
                for (var i = 0; i < _source.length; i++) {
                    var NotOWn = false;
                    for (var j = 0; j < set_data.length; j++) {
                        if (_source[i].RiskID == set_data[j].RiskID) {
                            _source.splice(i, 1);
                            set_data.splice(j, 1);
                            NotOWn = true;
                        }
                        if (set_data.length < 1) {
                            break;
                        }
                        if (NotOWn) {
                            model.com.getNewList(_source, set_data);
                        }
                    }

                }
                rst = _source;
                return rst;
            },
            //得到ID
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
        }
    }),

        model.init();


});