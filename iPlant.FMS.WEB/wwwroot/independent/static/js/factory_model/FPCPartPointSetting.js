require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/paging'], function ($zace, $com, $page) {

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
        BusinessUnit: "",
        BusinessUnitID: 0,
        Code: "",
        StepType: 1,
        CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Creator: window.parent.User_Info.Name,
        CreatorID: 0,
        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Editor: window.parent.User_Info.Name,
        EditorID: 0,
        ERPID: 0,
        ID: 0,
        Name: "",
        Factory: "",
        FactoryID: 1,
        ProductType: "",
        ProductTypeID: 0,
        QTType: 0,
        Status: 3,
        StatusText: "",
    };


    ;
    HTML = {
        TableMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',

            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
            '<td data-title="Code" data-value="{{Code}}" >{{Code}}</td>',
            // '<td data-title="StepType" data-value="{{StepType}}" >{{StepType}}</td>',
            // '<td data-title="QTType" data-value="{{QTType}}" >{{QTType}}</td>',
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

            '</tr>',
        ].join(""),



    },
        (function () {
            KEYWORD_Level_LIST = [
                "Name|名称",
                "Code|编码",
                "StepType|类型|ArrayOne",//QTType
                "QTType|质量工序类型|ArrayOne",
                "FactoryID|工厂|ArrayOne",
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
                Code: "",
                // StepType: 1,
                // QTType: 0,
            };

            TypeSource_Level = {
                QTType: [
                    {
                        name: "-",
                        value: 0
                    },
                    {
                        name: "试运前",
                        value: 1
                    },
                    {
                        name: "试运后",
                        value: 2
                    },
                ],

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
                FactoryID: [
                    {
                        name: "无",
                        value: 0,
                    }
                ],
                BusinessUnitID: [
                    {
                        name: "无",
                        value: 0,
                    }
                ],
                StepType: [
                    {
                        name: "生产",
                        value: 1,
                    },
                    {
                        name: "预检",
                        value: 2
                    },
                    {
                        name: "终端检查",
                        value: 3
                    },
                    {
                        name: "出厂普查",
                        value: 4
                    },
                    // {
                    //     name: "场内委外",
                    //     value: 5
                    // }
                    // ,
                    // {
                    //     name: "竣工确认",
                    //     value: 6
                    // }

                ],
                Status: [
                    //{
                    //    name: "默认值",
                    //    value: 0
                    //},
                    {
                        name: "创建",
                        value: 1
                    }, {
                        name: "待审核",
                        value: 2
                    }, {
                        name: "已审核",
                        value: 3
                    }, {
                        name: "撤销审核",
                        value: 4
                    },],



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
        name: '岗位',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            $("body").delegate("#zace-refresh-po", "click", function () {

                model.com.refresh();


            });
            //条件查询
            $("body").delegate("#zace-myAuditSearch-level", "click", function () {
                var default_value = {
                    Active: 1,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.Active = eval(rst.Active.toLowerCase());

                    $com.table.filterByConndition($("#femi-riskLevel-tbody"), DataAll, default_value, "ID");

                }, TypeSource_Level));


            });
            //Enter触发模糊查询事件
            $("#zace-search-level").keyup(function (event) {
                if (event.keyCode == 13) {
                    var
                        value = $("#zace-search-level").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-riskLevel-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "ID");
                }
            });
            //工序查询
            $("body").delegate("#zace-myAuditSearch-levelZace", "click", function () {

                var
                    value = $("#zace-search-level").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "ID");



            });
            //工序修改
            $("body").delegate(".lmvt-reset", "click", function () {
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DATABasic.filter((item) => { return item.ID == wID });
                var default_value = {
                    Name: SelectData[0].Name,
                    Code: SelectData[0].Code,
                    StepType: SelectData[0].StepType,
                    QTType: SelectData[0].QTType,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].Name = rst.Name;


                    if ((rst.Code && rst.Code.match(/^[ ]*$/)) || rst.Code.length <= 7) {
                        alert('编码不为空,长度7位以上');
                    }
                    // if (rst.Code.length<=7) {
                    //     alert('编码长度7位以上！');
                    // }
                    SelectData[0].StepType = Number(rst.StepType);
                    SelectData[0].QTType = Number(rst.QTType);

                    for (var i = 0; i < SelectData.length; i++) {

                        $com.util.deleteLowerProperty(SelectData[i]);
                    }
                    SelectData[0].Code = rst.Code;

                    model.com.postFPCPartPoint({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                        //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                        //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    })

                }, TypeSource_Level));


            });

            //工序启用
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
            //工序禁用
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

            //工序新增
            $("body").delegate("#zace-add-level", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    //PositionTemp.FactoryID = Number(rst.FactoryID);
                    //PositionTemp.BusinessUnitID = Number(rst.BusinessUnitID);                   
                    PositionTemp.Name = rst.Name;
                    PositionTemp.Code = rst.Code;
                    PositionTemp.StepType = Number(rst.StepType);
                    PositionTemp.QTType = Number(rst.QTType);
                    //PositionTemp.Active = rst.Active;
                    if ((rst.Code && rst.Code.match(/^[ ]*$/)) || rst.Code.length <= 7) {
                        alert('编码不为空,长度7位以上');
                    }
                    model.com.postFPCPartPoint({
                        data: PositionTemp,
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                    })

                }, TypeSource_Level));


            });

            //物料档案导入
            $("body").delegate("#lmvt-materialRecord-input", "click", function () {
                $("#input-file").val("");
                $("#input-file").click();
            });

            window.setFunctionTrigger("FPCPartPointSetting", function (res) {
                model.com.refresh();
            });

            $("body").delegate("#input-file", "input", function () {
                var $this = $(this);

                if (this.files.length == 0)
                    return;
                var fileData = this.files[0];

                var form = new FormData();
                form.append("file", fileData);

                model.com.postImportExcel(form, function (res) {
                    if (!res)
                        return;
                    var list = res.list,
                        rst = [];
                    if (list) {

                        var postData = res.list;

                        var DataParams = $com.table.postExportParams(postData, $(".table-part>table"));
                        var arr1 = [];
                        var arr1List = [];
                        for (var i = 0; i < DataParams.length; i++) {
                            var Temp = $com.util.Clone(PositionTemp);
                            Temp.Name = DataParams[i].Name;
                            Temp.Code = DataParams[i].Code;
                            arr1List.push(Temp);
                        }
                        var a = 0;

                        $com.app.loading();

                        var WhileAdd = function () {

                            model.com.postFPCPartPoint({
                                data: arr1List[a],
                            }, function (res) {
                                a++;

                                if (a == arr1List.length) {
                                    $com.app.loaded();

                                    alert("导入成功");
                                    model.com.refresh();
                                } else {
                                    WhileAdd();
                                }
                            });

                        }
                        if (arr1List.length <= 0) {
                            alert("导入数据为空！！！");
                        } else {
                            WhileAdd();
                        }

                    }

                });

            });


        },




        run: function () {

            model.com.refresh();

        },

        com: {
            setMMM: function () {
                setTimeout(function () {


                    if (window.parent._zaceBusinessUnit && window.parent._zaceBusinessUnit == 1) {
                        model.com.getBusinessUnit({}, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {
                                //TypeSource_materialRecord.SupplierID = [];
                                TypeSource_Level.BusinessUnitID.splice(1, TypeSource_Level.BusinessUnitID.length - 1);
                                $.each(resW.list, function (i, item) {
                                    TypeSource_Level.BusinessUnitID.push({
                                        name: item.Name,
                                        value: item.ID,
                                        far: 0
                                    });
                                });
                            }
                            window.parent._zaceBusinessUnit = 0;
                        });

                    }

                    model.com.setMMM();
                }, 500);

            },
            //导入
            postImportExcel: function (data, fn, context) {
                var d = {
                    $URI: "/Upload/ImportExcel",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax_load(data ? $.extend(data, d) : $.extend(d, data), fn, err, context);
            },
            refresh: function () {

                model.com.getFPCPartPoint({ FactoryID: 0, BusinessUnitID: 0, ProductTypeID: 0 }, function (resP) {
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
                        //$page.getPage(Grade, "#femi-riskLevel-tbody", HTML.TableMode, ".table-part");
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
            //查询工序段列表
            getFPCPartPoint: function (data, fn, context) {
                var d = {
                    $URI: "/FPCPartPoint/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //保存工序段列表
            postFPCPartPoint: function (data, fn, context) {
                var d = {
                    $URI: "/FPCPartPoint/Update",
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
                    $URI: "/FPCPartPoint/Audit",
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
                    $URI: "/FPCPartPoint/Active",
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