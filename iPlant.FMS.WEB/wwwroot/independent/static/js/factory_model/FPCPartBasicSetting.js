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
        BusinessUnitID,
        FactoryID,
        WorkShopID,
        HTML;
    WorkShopID = 0;
    BusinessUnitID = 0;
    FactoryID = 0;
    DataAll = [];
    DATABasic = [];
    DataAllConfirmBasic = [];
    DataAllConfirmChange = [];
    DataAllConfirm = [];
    DataAllFactorySearch = [];
    DataAllSearch = [];
    CheckDataCode = [];//判断code唯一
    PositionTemp = {
        Active: 1,
        Auditor: '',
        AuditorID: 0,
        AuditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        BusinessUnitID: 0,
        BusinessUnit: "",
        Code: "",
        CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Creator: '',
        CreatorID: 0,
        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Editor: '',
        EditorID: 0,
        ERPID: 0,
        Factory: "",
        FactoryID: 1,
        ID: 0,
        Name: "",
        ProductType: "",
        PartType: 1,
        ProductTypeID: 0,
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
            // '<td data-title="PartType" data-value="{{PartType}}" >{{PartType}}</td>',
            // '<td data-title="QTPartID" data-value="{{QTPartID}}" >{{QTPartID}}</td>',
            // '<td data-title="DepartmentName" data-value="{{DepartmentName}}" >{{DepartmentName}}</td>',
            // '<td data-title="TechnicianName" data-value="{{TechnicianName}}" >{{TechnicianName}}</td>',
            '<td data-title="Creator" data-value="{{Creator}}" >{{Creator}}</td>',
            '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
            // '<td data-title="Editor" data-value="{{Editor}}" >{{Editor}}</td>',
            // '<td data-title="EditTime" data-value="{{EditTime}}" >{{EditTime}}</td>',
            '<td data-title="Active" data-value="{{Active}}"><span class="badge lmvt-badge {{ClassBadge}}">{{Badge}}</span>{{Active}}</td>',
            '<td style="max-width: 80px" data-title="Handle" data-value="{{ID}}"><div class="row">',
            '<div class="col-md-6 {{ISAllowed}}">{{ISAllowedText}}</div>',
            '<div class="col-md-6 lmvt-do-info lmvt-reset">修改</div>',
            '</div></td>',
            '</tr>',
        ].join(""),
        TableLineMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
            '<td data-title="Code" data-value="{{Code}}" >{{Code}}</td>',
            '<td data-title="WorkShop" data-value="{{WorkShop}}" >{{WorkShop}}</td>',

            '</tr>',
        ].join(""),


    },
        (function () {
            KEYWORD_Level_LIST = [
                "Name|名称",
                "Code|编码",
                "PartType|类型|ArrayOne",
                "QTPartID|终检触发工位|ArrayOne",
                "BusinessUnitID|事业部|ArrayOneControl",
                "FactoryID|工厂名|ArrayOne",
                "ProductTypeID|产品类型|ArrayOneControl|BusinessUnitID",
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
                // PartType: 1,

            };

            TypeSource_Level = {
                QTPartID: [{
                    name: "-",
                    value: 0,
                }],
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
                PartType: [
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
                ],
                ProductTypeID: [
                    {
                        name: "无",
                        value: 0,
                        far: 0
                    }
                ],
                FactoryID: [
                    {
                        name: "无",
                        value: 0,
                        far: 0
                    }
                ],
                Status: [
                    {
                        name: "创建",
                        value: 1
                    }, {
                        name: "待审核",
                        value: 2
                    }, {
                        name: "已审",
                        value: 3
                    }, {
                        name: "反审",
                        value: 4
                    }, {
                        name: "撤销",
                        value: 5
                    }],

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

            //导入
            $("body").delegate("#lmvt-materialRecord-input", "click", function () {
                $("#input-file").val("");
                $("#input-file").click();
            });
            $("body").delegate("#input-file", "input", function () {
                var $this = $(this);

                if (this.files.length == 0)
                    return;


                if (!extLimit(['xlsx', 'xls']).has(this.files[0].name)) {
                    alert("请上传正确的Excel文件！");
                    clearFiles();
                    return;
                }
                var fileData = this.files[0];

                var form = new FormData();
                form.append("file", fileData);

                model.com.postImportExcel(form, function (res) {
                    if (!res)
                        return;
                    res.list.splice(0, 1);//删除第一行
                    var list = res.list,
                        rst = [];
                    if (list) {

                        var postData = res.list;

                        var DataParams = $com.table.postExportParams(postData, $(".table-part>table"));
                        var arr1 = [];
                        var arr1List = [];
                        for (var i = 0; i < DataParams.length; i++) {
                            arr1.push(DataParams[i].Code);
                            arr1List.push(DataParams[i]);
                        }

                        var arr2 = [];
                        var arr2List = [];
                        for (var i = 0; i < arr1.length; i++) {
                            if (arr2.indexOf(arr1[i]) == -1) {
                                arr2.push(arr1[i])
                                arr2List.push(arr1List[i]);
                            }
                        }

                        var list = model.com.getNewList(CheckDataCode, arr2List);
                        if (list.length != arr1List.length) {
                            if (!confirm("导入数据重复" + "，确定是否继续？")) {
                                return false;
                            }

                        }

                        if (list.length < 1) {
                            alert("导入数据全部存在！");
                            return;
                        }

                        $.each(list, function (i, item) {


                            item.Name = item.Name;
                            item.Code = item.Code;

                            item.Active = 1;
                            item.BusinessUnitID = 0;
                            item.Factory = 1;
                            item.Code = item.Code;
                            item.ID = 0;
                            item.PartType = 1;
                            item.Status = 3;
                            item.QTPartID = 0;


                        });



                        var a = 0;

                        $com.app.loading();

                        var WhileAdd = function () {

                            model.com.postFPCPart({
                                data: list[a],
                            }, function (res) {
                                a++;

                                if (a == list.length) {
                                    $com.app.loaded();

                                    alert("导入成功");
                                    model.com.refresh();
                                } else {
                                    WhileAdd();
                                }
                            });

                        }
                        if (list.length <= 0) {
                            alert("导入数据为空！！！");
                        } else {
                            WhileAdd();
                        }

                    }

                });
                function clearFiles() {
                    self.value = "";
                }

                function extLimit(exts) {
                    return {
                        has: function (file) {
                            var arr = file.split("."),
                                ext = arr[arr.length - 1].toLowerCase();

                            return exts.indexOf(ext) > -1 ? true : false;
                        }
                    };
                }
            });

            //查看标注工步
            $("body").delegate("#zace-refresh-po", "click", function () {

                var vdata = { 'header': '工步配置', 'href': './factory_model/FPCPartPointSetting.html', 'id': 'FPCPartPointSetting', 'src': '/MESCore/upload/web/工序配置.svg' };
                window.parent.iframeHeaderSet(vdata);
                window.callFunctionTrigger("FPCPartPointSetting");

            });
            //导出 
            $("body").delegate("#zace-exportApproval-level", "click", function () {
                var $table = $(".table-partApproval"),
                    fileName = "工位配置.xls",
                    Title = "工位配置";
                var params = $com.table.getExportParams($table, fileName, Title);

                if (params.data.length < 1) {
                    alert('请选择需要导出的数据！');
                    return false;
                }

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });



            });

            //工序库修改
            $("body").delegate(".lmvt-reset", "click", function () {
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DATABasic.filter((item) => { return item.ID == wID });

                var default_value = {
                    Name: SelectData[0].Name,
                    Code: SelectData[0].Code,
                    PartType: SelectData[0].PartType,
                    QTPartID: SelectData[0].QTPartID,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;



                    for (var k = 0; k < CheckDataCode.length; k++) {
                        if (rst.Code == CheckDataCode[k].Code && CheckDataCode[k].ID != SelectData[0].ID) {
                            alert('编码 ' + rst.Code + ' 已存在');
                            return false;
                        };

                    }
                    SelectData[0].Name = rst.Name;
                    SelectData[0].Code = rst.Code;
                    SelectData[0].PartType = Number(rst.PartType);

                    SelectData[0].QTPartID = Number(rst.QTPartID);
                    for (var i = 0; i < SelectData.length; i++) {

                        $com.util.deleteLowerProperty(SelectData[i]);
                    }

                    model.com.postFPCPart({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                        //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                        //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    })

                }, TypeSource_Level));


            });


            $("body").delegate("#zace-closeLine-level", "click", function () {

                $(".zzzb").hide();
                $(".zzza").css("margin-right", "0px");
                $(".zzzc").css("width", "0px");
                $(".zzzc").hide();

            });



            //工序库启用
            $("body").delegate(".lmvt-do-active", "click", function () {
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DATABasic.filter((item) => { return item.ID == wID });

                $com.util.deleteLowerProperty(SelectData);
                model.com.activeAudit({
                    data: SelectData,
                    Active: 1,
                }, function (res) {
                    alert("启用成功");
                    model.com.refresh();


                })




            });
            //工序库禁用
            $("body").delegate(".lmvt-allowed-delete", "click", function () {
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DATABasic.filter((item) => { return item.ID == wID });

                $com.util.deleteLowerProperty(SelectData);
                $com.util.deleteLowerProperty(SelectData);
                model.com.activeAudit({
                    data: SelectData,
                    Active: 2,
                }, function (res) {
                    alert("禁用成功");
                    model.com.refresh();


                })

            });

            //工序库新增
            $("body").delegate("#zace-add-level", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    PositionTemp.Name = rst.Name;
                    PositionTemp.Code = rst.Code;
                    PositionTemp.PartType = Number(rst.PartType);

                    for (var k = 0; k < CheckDataCode.length; k++) {
                        if (PositionTemp.Code == CheckDataCode[k].Code) {
                            alert('编码 ' + PositionTemp.Code + ' 已存在');
                            return false;
                        };

                    }
                    model.com.postFPCPart({
                        data: PositionTemp,
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                    })

                }, TypeSource_Level));


            });

            //申请 条件查询
            $("body").delegate("#zace-searchZall-level", "click", function () {
                var default_value = {
                    Active: 0,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.Active = eval(rst.Active.toLowerCase());
                    $com.table.filterByConndition($("#femi-riskLevel-tbody"), DataAll, default_value, "ID");

                }, TypeSource_Level));


            });
            //Enter触发模糊查询事件
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var
                        value = $("#zace-search-level").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-riskLevel-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "ID");
                }
            });
            //我的申请  工序库查询
            $("body").delegate("#zace-searchZall-levelZace", "click", function () {

                var
                    value = $("#zace-search-level").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "ID");



            });

            //我的审批  工序库查询
            $("body").delegate("#zace-search-returnApproval", "input", function () {

                var $this = $(this),
                    value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevelAudit-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevelAudit-tbody"), DataAllSearch, value, "ID");

            });
        },




        run: function () {

            model.com.getFPCPart({ FactoryID: 0, BusinessUnitID: 0 }, function (resW) {
                if (!resW)
                    return;
                if (resW && resW.list) {
                    //TypeSource_materialRecord.SupplierID = [];
                    TypeSource_Level.QTPartID.splice(1, TypeSource_Level.QTPartID.length - 1);
                    $.each(resW.list, function (i, item) {

                        if (item.PartType == 1 && item.Active == 1) {
                            TypeSource_Level.QTPartID.push({
                                name: item.Name,
                                value: item.ID,
                                far: 0
                            });
                        }

                    });
                }
                model.com.refresh();
                model.com.setMMM();
            });



        },

        com: {
            getNewList: function (_source, set_data) {
                if (!_source)
                    _source = [];
                if (!set_data)
                    set_data = [];
                var rst = [];
                if (_source.length >= set_data.length) {
                    for (var i = 0; i < _source.length; i++) {
                        var NotOWn = false;
                        for (var j = 0; j < set_data.length; j++) {
                            if (_source[i].Code == set_data[j].Code) {
                                _source.splice(i, 1);
                                set_data.splice(j, 1)
                                NotOWn = true;
                            }
                            if (set_data.length < 1) {
                                break;
                            }
                            if (_source.length < 1) {
                                break;
                            }
                            if (NotOWn) {
                                model.com.getNewList(_source, set_data);
                            }
                        }

                    }
                    rst = set_data;
                    return rst;
                } else {
                    for (var i = 0; i < set_data.length; i++) {
                        var NotOWn = false;
                        for (var j = 0; j < _source.length; j++) {
                            if (set_data[i].Code == _source[j].Code) {
                                set_data.splice(i, 1);
                                _source.splice(j, 1)
                                NotOWn = true;
                            }
                            if (_source.length < 1) {
                                break;
                            }
                            if (set_data.length < 1) {
                                break;
                            }
                            if (NotOWn) {
                                model.com.getNewList(set_data, _source);
                            }
                        }

                    }
                    rst = set_data;
                    return rst;

                }

            },
            setMMM: function () {
                setTimeout(function () {


                    if (window.parent._zacepart && window.parent._zacepart == 1) {
                        model.com.getFPCPart({ FactoryID: 0, BusinessUnitID: 0 }, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {
                                //TypeSource_materialRecord.SupplierID = [];
                                TypeSource_Level.QTPartID.splice(1, TypeSource_Level.QTPartID.length - 1);
                                $.each(resW.list, function (i, item) {
                                    if (item.PartType == 1 && item.Active == 1) {
                                        TypeSource_Level.QTPartID.push({
                                            name: item.Name,
                                            value: item.ID,
                                            far: 0
                                        });
                                    }
                                });
                            }
                            window.parent._zacepart = 0;
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

                //申请
                model.com.getFPCPart({ FactoryID: 0, BusinessUnitID: 0 }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var Grade = $com.util.Clone(resP.list);
                        DATABasic = $com.util.Clone(resP.list);
                        CheckDataCode = $com.util.Clone(resP.list);
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

                        window.parent._zacepart = 1;
                    }

                });




            },
            //查询产品类型
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

            //查询
            getFMCUserId: function (data, fn, context) {
                var d = {
                    $URI: "/Role/UserAllByFunctionID",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询产线
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
            //查询工序库列表
            getFPCPart: function (data, fn, context) {
                var d = {
                    $URI: "/FPCPart/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //保存工序库列表
            postFPCPart: function (data, fn, context) {
                var d = {
                    $URI: "/FPCPart/Update",
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
                    $URI: "/FPCPart/Audit",
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
                    $URI: "/FPCPart/Active",
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
            // getNewList: function (_source, set_data) {
            //     if (!_source)
            //         _source = [];
            //     if (!set_data)
            //         set_data = [];
            //     var rst = [];
            //     for (var i = 0; i < _source.length; i++) {
            //         var NotOWn = false;
            //         for (var j = 0; j < set_data.length; j++) {
            //             if (_source[i].RiskID == set_data[j].RiskID) {
            //                 _source.splice(i, 1);
            //                 set_data.splice(j, 1);
            //                 NotOWn = true;
            //             }
            //             if (set_data.length < 1) {
            //                 break;
            //             }
            //             if (NotOWn) {
            //                 model.com.getNewList(_source, set_data);
            //             }
            //         }

            //     }
            //     rst = _source;
            //     return rst;
            // },
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