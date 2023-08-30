require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($zace, $com) {

    var KEYWORD_Level_LIST,
        KEYWORD_Level,
        FORMATTRT_Level,
        DEFAULT_VALUE_Level,
        TypeSource_Level,
        model,
        DataAllSupplier,
        DATASupplierBasic,
        DataAllConfirm,
        DataAllConfirmChange,
        DataAllConfirmBasic,
        HTML,
        mid,
        wid,
        DataAllSupplierSearch,
        KEYWORD_LinkManSupplier_LIST,
        KEYWORD_LinkManSupplier,
        FORMATTRT_LinkManSupplier,
        LinkManSupplierTemp,
        TypeSource_LinkManSupplier,
        DataAll,
        DataAllSerch,
        DATABasic;

    mid = 1;
    wid = 1;
    DataAllConfirmChange = [];
    LinkManSupplierTemp = {
        ID: 0,
        SupplierID: 0,
        Name: "",
        Position: "",
        WeiXin: "",
        MobilePhone: "",
        EMail: "",
        Grade: 0,
        Description: "",
        Creator: window.parent.User_Info.Name,
        CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Active: 1,
    };

    SupplierTemp = {
        ID: 0,
        SupplierName: "",
        SupplierCode: "",
        TaxCode: "",
        CountryID: 0,
        ProvinceID: 0,
        CityID: 0,
        Address: "",
        Type: 0,
        Grade: 0,
        Creator: window.parent.User_Info.Name,
        Auditor: window.parent.User_Info.Name,
        CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        AuditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Active: 0,
        Status: 1,
        BankName: "",
        BankAccount: "",
    };

    HTML = {
        TableSupplierMode: [
            '<tr data-color="">',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td style="display:none" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td data-title="SupplierName" data-value="{{SupplierName}}" >{{SupplierName}}</td>',
            '<td data-title="SupplierCode" data-value="{{SupplierCode}}" >{{SupplierCode}}</td>',
            // '<td data-title="TaxCode" data-value="{{TaxCode}}" >{{TaxCode}}</td>',
            // '<td data-title="Address" data-value="{{Address}}" >{{Address}}</td>',
            // '<td data-title="Type" data-value="{{Type}}" >{{Type}}</td>',
            // '<td data-title="Grade" data-value="{{Grade}}" >{{Grade}}</td>',
            // '<td data-title="BankName" data-value="{{BankName}}" >{{BankName}}</td>',
            // '<td data-title="BankAccount" data-value="{{BankAccount}}" >{{BankAccount}}</td>',

            //'<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',
            '<td data-title="Creator" data-value="{{Creator}}" >{{Creator}}</td>',
            '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
            //'<td data-title="Auditor" data-value="{{Auditor}}" >{{Auditor}}</td>',
            //'<td data-title="AuditTime" data-value="{{AuditTime}}" >{{AuditTime}}</td>',
            '<td data-title="Active" data-value="{{Active}}"><span class="badge lmvt-badge {{ClassBadge}}">{{Badge}}</span>{{Active}}</td>',
            // '<td data-title="Active" data-value="{{Active}}" >{{Active}}</td>',
            '<td style="max-width: 80px" data-title="Handle" data-value="{{ID}}"><div class="row">',
            '<div class="col-md-4 {{ISAllowed}}">{{ISAllowedText}}</div>',
            '<div class="col-md-4 lmvt-do-info lmvt-reset">修改</div>',
            '<div class="col-md-4 lmvt-do-info lmvt-do-delete">删除</div>',


            '</div></td>',
            '</tr>',
        ].join(""),
        TableMode: [
            '<tr data-color="">',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="SupplierID" data-value="{{SupplierID}}" >{{SupplierID}}</td>',
            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
            // '<td data-title="Position" data-value="{{Position}}" >{{Position}}</td>',
            // '<td data-title="WeiXin" data-value="{{WeiXin}}" >{{WeiXin}}</td>',
            '<td data-title="MobilePhone" data-value="{{MobilePhone}}" >{{MobilePhone}}</td>',
            // '<td data-title="EMail" data-value="{{EMail}}" >{{EMail}}</td>',
            // '<td data-title="Grade" data-value="{{Grade}}" >{{Grade}}</td>',
            '<td data-title="Description" data-value="{{Description}}" >{{Description}}</td>',
            '<td data-title="Creator" data-value="{{Creator}}" >{{Creator}}</td>',
            '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
            '<td data-title="Active" data-value="{{Active}}" >{{Active}}</td>',
            '</tr>',
        ].join(""),


    };
    //厂家
    (function () {
        KEYWORD_Level_LIST = [
            "SupplierName|供应商名称",
            "SupplierCode|供应商编号",
            "TaxCode|税号",
            "CountryID|国家|ArrayOneControl",
            "ProvinceID|省份|ArrayOneControl|CountryID",
            "CityID|城市|ArrayOneControl|CountryID,ProvinceID",
            "Address|地址",
            //"Type|行业",
            "Grade|等级|ArrayOne",
            "Status|状态|ArrayOne",
            "Active|激活|ArrayOne",
            "BankName|开户银行",
            "BankAccount|账号",
            "CreateTime|时间|DateTime",
        ];
        KEYWORD_Level = {};
        FORMATTRT_Level = {};

        DEFAULT_VALUE_Level = {
            SupplierName: "",
            SupplierCode: "",
            // TaxCode: "",
            // Address: "",
            //Type: 0,          
            // Active: true,
            //Status: 1,         
        };

        TypeSource_Level = {

            Grade: [
                {
                    name: "无",
                    value: 0,
                }, {
                    name: "重要",
                    value: 1,
                }, {
                    name: "普通",
                    value: 2,
                },
            ],
            Active: [
                {
                    name: "保存",
                    value: 0,
                }, {
                    name: "启用",
                    value: 1,
                }, {
                    name: "禁用",
                    value: 2,
                },
            ],


        };

        $.each(KEYWORD_Level_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD_Level[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined,
            };
            if (detail.length > 2) {
                FORMATTRT_Level[detail[0]] = $com.util.getFormatter(TypeSource_Level, detail[0], detail[2]);
            }
        });
    })();
    //联系人
    (function () {
        KEYWORD_LinkManSupplier_LIST = [
            "SupplierID|供应商|ArrayOne",
            "Name|姓名",
            "Position|职位",
            "WeiXin|微信",
            "MobilePhone|电话号码",
            "EMail|邮件",
            "Grade|等级|ArrayOne",
            "Description|描述",
            "Active|激活|ArrayOne",
            "Creator|创建人",
            "CreateTime|时间|DateTime",
        ];
        KEYWORD_LinkManSupplier = {};
        FORMATTRT_LinkManSupplier = {};

        //      LinkManSupplierTemp  = {
        //      ID: 0,
        //      SupplierID:0,
        //      
        //      Creator:window.parent.User_Info.Name,
        //      CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        //      Active:0,
        //      };

        TypeSource_LinkManSupplier = {

            Active: [
                {
                    name: "激活",
                    value: 1,
                }, {
                    name: "禁用",
                    value: 0,
                },
            ],
            SupplierID: [
                {
                    name: "无",
                    value: 0,
                },
            ],
            Grade: [
                {
                    name: "一星级",
                    value: 1,
                }, {
                    name: "二星级",
                    value: 2,
                }, {
                    name: "三星级",
                    value: 3,
                },

            ],

        };

        $.each(KEYWORD_LinkManSupplier_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD_LinkManSupplier[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined,
            };
            if (detail.length > 2) {
                FORMATTRT_LinkManSupplier[detail[0]] = $com.util.getFormatter(TypeSource_LinkManSupplier, detail[0], detail[2]);
            }
        });
    })();

    model = $com.Model.create({
        name: '委修厂家',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            // $("body").delegate("#femi-supplier-tbody tr", "dblclick", function () {
            //     $(".zzzc").show();
            //     $(".zzzb").hide();
            //     $(".zzza").hide();
            //     var $this = $(this);

            //     wid = Number($this.find('td[data-title=ID]').attr('data-value'));
            //     mid = wid;
            //     model.com.refresh();
            // });

            //模糊查询
            $("body").delegate("#zace-search-supplierSX", "click", function () {

                var value = $("#zace-search-supplierMode").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-supplier-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-supplier-tbody"), DataAllSupplierSearch, value, "ID");
            });
            $("body").delegate(".lmvt-do-delete", "click", function () {
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DATASupplierBasic.filter((item) => {
                    return item.ID == wID;
                });
                if (!confirm("确定删除吗？")) {
                    return;
                }

                $com.util.deleteLowerProperty(SelectData[0]);
                model.com.deleteSupplier({
                    data: SelectData[0],
                }, function (res) {
                    alert("删除成功");
                    model.com.refresh();
                });


            });

            //供应商信息修改
            $("body").delegate(".lmvt-reset", "click", function () {
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DATASupplierBasic.filter((item) => {
                    return item.ID == wID;
                });
                var default_value = {
                    SupplierName: SelectData[0].SupplierName,
                    SupplierCode: SelectData[0].SupplierCode,
                    // TaxCode: SelectData[0].TaxCode,
                    // Address: SelectData[0].Address,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].SupplierName = rst.SupplierName;
                    SelectData[0].SupplierCode = rst.SupplierCode;
                    // SelectData[0].TaxCode = rst.TaxCode;
                    // //SelectData[0].Type = rst.Type;
                    // SelectData[0].Address = rst.Address;

                    for (var i = 0; i < SelectData.length; i++) {
                        $com.util.deleteLowerProperty(SelectData[i]);
                    }

                    model.com.postSupplier({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                    });

                }, TypeSource_Level));


            });
            //供应商新增
            $("body").delegate("#zace-add-supplier", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "新增", function (rst) {
                    //调用插入函数 

                    if (!rst || $.isEmptyObject(rst))
                        return;
                    var _mID = 1;
                    if (DataAllSupplier[DataAllSupplier.length - 1]) {
                        _mID = DataAllSupplier[DataAllSupplier.length - 1].ID + 1;
                    }
                    SupplierTemp.SupplierName = rst.SupplierName;
                    SupplierTemp.SupplierCode = rst.SupplierCode;
                    SupplierTemp.TaxCode = _mID;
                    SupplierTemp.Address = _mID;

                    SupplierTemp.ID = 0;

                    model.com.postSupplier({
                        data: SupplierTemp,
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                    });

                }, TypeSource_Level));


            });
            //激活
            $("body").delegate(".lmvt-do-active", "click", function () {
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));


                var SelectData = DATASupplierBasic.filter((item) => {
                    return item.ID == wID;
                });

                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                model.com.ActiveSupplier({
                    data: SelectData,
                    active: 1,
                }, function (res) {
                    alert("启用成功");
                    model.com.refresh();
                });
            });
            //禁用
            $("body").delegate(".lmvt-allowed-delete", "click", function () {
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));


                var SelectData = DATASupplierBasic.filter((item) => {
                    return item.ID == wID;
                });

                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                model.com.ActiveSupplier({
                    data: SelectData,
                    active: 0,
                }, function (res) {
                    alert("禁用成功");
                    model.com.refresh();
                });
            });


            //返回
            $("body").delegate("#zace-confirmReturn-supplier", "click", function () {
                $(".zzzb").hide();
                $(".zzza").show();
                $(".zzzc").hide();
            });
            //zace-return-LinkManSupplier 返回
            $("body").delegate("#zace-return-LinkManSupplier", "click", function () {
                $(".zzzb").hide();
                $(".zzza").show();
                $(".zzzc").hide();
            });
            $("body").delegate("#zace-refresh-LinkManSupplier", "click", function () {

                model.com.refresh();

            });

            $("body").delegate("#zace-refresh-supplier", "click", function () {

                model.com.refresh();

            });
            //联系人信息查询
            $("body").delegate("#zace-search-LinkManSupplierSX", "click", function () {

                var value = $("#zace-search-LinkManSupplier").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-LinkManSupplier-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-LinkManSupplier-tbody"), DataAllSerch, value, "ID");
            });

            //联系人信息修改
            $("body").delegate("#zace-edit-LinkManSupplier", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-LinkManSupplier-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！");
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！");
                    return;
                }
                var Default_value = {
                    //                  SupplierID: SelectData[0].SupplierID,
                    Name: SelectData[0].Name,
                    // Position: SelectData[0].Position,
                    // WeiXin: SelectData[0].WeiXin,
                    MobilePhone: SelectData[0].MobilePhone,
                    // EMail: SelectData[0].EMail,
                    // Grade: SelectData[0].Grade,
                    Description: SelectData[0].Description,
                    Active: SelectData[0].Active,
                };
                $("body").append($com.modal.show(Default_value, KEYWORD_LinkManSupplier, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    //                  SelectData[0].SupplierID = Number(rst.SupplierID);
                    SelectData[0].Name = rst.Name;
                    // SelectData[0].Position = rst.Position;
                    // SelectData[0].WeiXin = rst.WeiXin;
                    SelectData[0].MobilePhone = rst.MobilePhone;
                    // SelectData[0].EMail = rst.EMail;
                    // SelectData[0].Grade = Number(rst.Grade);
                    SelectData[0].Active = rst.Active;
                    SelectData[0].Description = rst.Description;


                    for (var i = 0; i < SelectData.length; i++) {
                        $com.util.deleteLowerProperty(SelectData[i]);
                    }
                    model.com.PostUpdateAdd({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                    });

                }, TypeSource_LinkManSupplier));


            });
            //联系人信息新增
            $("body").delegate("#zace-add-LinkManSupplier", "click", function () {
                var default_value = {
                    Name: "",
                    // Position: "",
                    // WeiXin: "",
                    MobilePhone: "",
                    // EMail: "",
                    // Grade: 0,
                    Description: "",
                    // Active: 1
                };
                $("body").append($com.modal.show(default_value, KEYWORD_LinkManSupplier, "新增", function (rst) {
                    //调用插入函数 

                    if (!rst || $.isEmptyObject(rst))
                        return;

                    LinkManSupplierTemp.SupplierID = mid;
                    LinkManSupplierTemp.Name = rst.Name;
                    LinkManSupplierTemp.MobilePhone = rst.MobilePhone;
                    LinkManSupplierTemp.Description = rst.Description;

                    model.com.PostUpdateAdd({
                        data: LinkManSupplierTemp,
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                    });


                }, TypeSource_LinkManSupplier));


            });
            //联系人信息导出
            $("body").delegate("#zace-export-LinkManSupplier", "click", function () {
                var $table = $(".table-part"),
                    fileName = "联系人信息.xls",
                    Title = "联系人信息";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });

            });


            //激活 联系人信息
            $("body").delegate("#zace-ok-LinkManSupplier", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-LinkManSupplier-tbody"), "ID", DataAll);
                if (!SelectData || !SelectData.length) {
                    alert("至少选择一行数据！");
                    return;
                }
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其禁用？")) {
                    return;
                }

                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                model.com.postActive({
                    data: SelectData,
                    active: 1,
                }, function (res) {
                    alert("激活成功");
                    model.com.refresh();
                });
            });
            //禁用联系人信息
            $("body").delegate("#zace-remove-LinkManSupplier", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-LinkManSupplier-tbody"), "ID", DataAll);
                if (!SelectData || !SelectData.length) {
                    alert("至少选择一行数据！");
                    return;
                }
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其禁用？")) {
                    return;
                }

                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                model.com.postActive({
                    data: SelectData,
                    active: 0,
                }, function (res1) {
                    alert("禁用成功");
                    model.com.refresh();
                });
            });
        },


        run: function () {
            //得到
            model.com.getSupplier({
                supplier_name: "",
                country_id: 0,
                province_id: 0,
                city_id: 0,
                active: 2,
            }, function (res1) {
                $.each(res1.list, function (i, item) {
                    TypeSource_LinkManSupplier.SupplierID.push({
                        name: item.SupplierName,
                        //value: item.ID,
                        value: item.ID,
                        far: null,
                    });
                });

                // model.com.setMMM();
                model.com.refresh();

            });


        },

        com: {

            setMMM: function () {
                setTimeout(function () {
                    if (window.parent._zaceSupplierSet == 1) {
                        model.com.getSupplier({
                            supplier_name: "",
                            country_id: 0,
                            province_id: 0,
                            city_id: 0,
                            active: 2,
                        }, function (resP) {
                            if (!resP)
                                return;
                            if (resP && resP.list) {
                                TypeSource_LinkManSupplier.SupplierID.splice(1, TypeSource_LinkManSupplier.SupplierID.length - 1);
                                $.each(resP.list, function (i, item) {
                                    TypeSource_LinkManSupplier.SupplierID.push({
                                        name: item.SupplierName,
                                        //value: item.ID,
                                        value: item.ID,
                                        far: null,
                                    });
                                });
                            }
                            window.parent._zaceSupplierSet = 0;
                        });

                    }


                    model.com.setMMM();
                }, 500);

            },
            refresh: function () {
                //供应商
                model.com.getSupplier({
                    supplier_name: "",
                    country_id: 0,
                    province_id: 0,
                    city_id: 0,
                    active: 2,
                }, function (resS) {
                    if (!resS)
                        return;
                    if (resS && resS.list) {
                        //数据库数据
                        DATASupplierBasic = $com.util.Clone(resS.list);
                        //审核数据
                        DataAllConfirm = $com.util.Clone(resS.list);
                        //界面数据
                        DataAllSupplier = $com.util.Clone(resS.list);


                        var _list = $com.util.Clone(DataAllSupplier);
                        $.each(_list, function (i, item) {
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
                                item.WID = i + 1;
                            }
                        });
                        DataAllSupplierSearch = $com.util.Clone(_list);
                        $("#femi-supplier-tbody").html($com.util.template(_list, HTML.TableSupplierMode));
                        $("#femi-supplier-tbody tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);


                        });

                    }

                });
                //联系人
                model.com.getLinkManSupplier({customer_id: mid, active: 2}, function (resS) {
                    if (!resS)
                        return;
                    if (resS && resS.list) {
                        DataAll = $com.util.Clone(resS.list);   //界面数据
                        DATABasic = $com.util.Clone(resS.list); //数据库数据                    
                        for (var i = 0; i < DataAll.length; i++) {
                            DataAll[i].WID = i + 1;
                        }
                        var Data = $com.util.Clone(DataAll);
                        $.each(Data, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_LinkManSupplier[p])
                                    continue;
                                item[p] = FORMATTRT_LinkManSupplier[p](item[p]);
                            }
                        });
                        DataAllSerch = $com.util.Clone(Data);
                        $("#femi-LinkManSupplier-tbody").html($com.util.template(Data, HTML.TableMode));
                        $("#femi-LinkManSupplier-tbody tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);


                        });

                    }

                });
            },
            //查询厂家列表
            getSupplier: function (data, fn, context) {
                var d = {
                    $URI: "/Supplier/All",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            deleteSupplier: function (data, fn, context) {
                var d = {
                    $URI: "/Supplier/Delete",
                    $TYPE: "post",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //保存厂家列表
            postSupplier: function (data, fn, context) {
                var d = {
                    $URI: "/Supplier/Update",
                    $TYPE: "post",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //激活厂家列表
            ActiveSupplier: function (data, fn, context) {
                var d = {
                    $URI: "/Supplier/Active",
                    $TYPE: "post",
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
                    $TYPE: "post",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //查询联系人列表
            getLinkManSupplier: function (data, fn, context) {
                var d = {
                    $URI: "/LinkManSupplier/All",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //激活联系人
            postActive: function (data, fn, context) {
                var d = {
                    $URI: "/LinkManSupplier/Active",
                    $TYPE: "post",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //更新添加联系人
            PostUpdateAdd: function (data, fn, context) {
                var d = {
                    $URI: "/LinkManSupplier/Update",
                    $TYPE: "post",
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
        },
    }),

        model.init();


});