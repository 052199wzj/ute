require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($zace, $com) {

    var KEYWORD_Level_LIST,
        KEYWORD_Level,
        FORMATTRT_Level,
        DEFAULT_VALUE_Level,
        TypeSource_Level,
        model,
        DataAll,
        DATABasic,
        DATABasicPro,
        DataAllPro,
        DataAllFactorySearchPro,
        DataAllConfirmBasic,
        DataAllConfirmChange,
        DataAllConfirm,
        DataAllSearch,
        DataAllFactorySearch,
        RouteID,
        HTML;

    RouteID = 0;
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
        BusinessUnitID: 1,
        CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Creator: window.parent.User_Info.Name,
        CreatorID: 0,
        Description: "",
        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Editor: window.parent.User_Info.Name,
        EditorID: 0,
        Factory: "",
        FactoryID: 1,
        LineID: 0,
        ID: 0,
        Name: "",
        ProductType: "",
        ProductTypeID: 0,
        Status: 1,
        StatusText: "",
        VersionNo: "",
        IsStandard: 0,
    };


    ;
    HTML = {
        TableMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',


            '<td data-title="LineID" data-value="{{LineID}}" >{{LineID}}</td>',
            '<td data-title="ProductID" data-value="{{ProductID}}" >{{ProductID}}</td>',
            '<td data-title="CustomerID" data-value="{{CustomerID}}" >{{CustomerID}}</td>',
            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
            '<td data-title="VersionNo" data-value="{{VersionNo}}" >{{VersionNo}}</td>',
            // '<td data-title="Description" data-value="{{Description}}" >{{Description}}</td>',

            '<td data-title="IsStandard" data-value="{{IsStandard}}"><span class="badge lmvt-badge {{IsStandardBadge}}">{{Badge}}</span>{{IsStandard}}</td>',
            '<td data-title="ItemCount" data-value="{{ItemCount}}">{{ItemCount}}</td>',

            '<td data-title="Creator" data-value="{{Creator}}" >{{Creator}}</td>',
            '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
            '<td data-title="Editor" data-value="{{Editor}}" >{{Editor}}</td>',
            '<td data-title="EditTime" data-value="{{EditTime}}" >{{EditTime}}</td>',
            // '<td data-title="Auditor" data-value="{{Auditor}}" >{{Auditor}}</td>',
            //  '<td data-title="AuditTime" data-value="{{AuditTime}}" >{{AuditTime}}</td>',
            '<td data-title="Active" data-value="{{Active}}" ><span class="badge lmvt-badge {{ClassBadge}}">{{Badge}}</span>{{Active}}</td>',
            //  '<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',
            '<td style="min-width: 40px" data-title="Handle" data-value="{{ID}}"><div class="row">',
            '<div class="col-md-4 {{ISAllowed}} ">{{ISAllowedText}}</div>',
            '<div class="col-md-4 {{ISDelete}} ">删除</div>',
            '<div class="col-md-4 lmvt-do-info"><UL id=nav>',
            '<LI>更多<UL><LI data-value="{{ID}}" class="lmvt-delete lmvt-setting">设为当前</LI>',
            '<LI data-value="{{ID}}" class="lmvt-list">工序集</LI>',
            '<LI data-value="{{ID}}" class="lmvt-copy">复制BOP</LI>',
            '</UL></LI></UL></div>',
            '</td>',

            '</tr>',
        ].join(""),

        TablePartMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',

            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
            '<td data-title="OrderID" data-value="{{OrderID}}" >{{OrderID}}</td>',
            '<td data-title="RouteName" data-value="{{RouteName}}" >{{RouteName}}</td>',
            '</tr>',
        ].join(""),



    };
    (function () {
        KEYWORD_Level_LIST = [

            //  "BusinessUnitID|事业部|ArrayOneControl",
            "LineID|产线|ArrayOne",
            "ProductID|型号|ArrayOne",
            "CustomerID|客户|ArrayOne",
            "Name|工艺BOPID",
            "VersionNo|工艺BOP版本",
            "Description|备注",

            "ProductTypeID|类型|ArrayOneControl|BusinessUnitID",
            "IsStandard|是否当前|ArrayOne",
            "Status|状态|ArrayOne",
            "Active|启用|ArrayOne",
            "CreateTime|时间|DateTime",
            "EditTime|时间|DateTime",
        ];
        KEYWORD_Level = {};
        FORMATTRT_Level = {};

        DEFAULT_VALUE_Level = {

            // VersionNo: "",
            // Description: "",
            Name: "",
            // BusinessUnitID: 1,
            //FactoryID: 0,
            LineID: 0,
            CustomerID: 0,
            ProductID: 0,
            //ProductTypeID:0,
            // Active: true,
        };

        TypeSource_Level = {
            Active: [
                {
                    name: "启用",
                    value: 1
                }, {
                    name: "禁用",
                    value: 2
                },
                {
                    name: "保存",
                    value: 0
                },
            ],
            IsStandard: [
                {
                    name: "否",
                    value: 0
                }, {
                    name: "是",
                    value: 1
                },

            ],
            CustomerID: [
                {
                    name: "无",
                    value: 0,
                    far: 0,
                }
            ],
            LineID: [
                // {
                //     name: "无",
                //     value: 0,
                //     far: 0,
                // }
            ],
            ProductTypeID: [
                {
                    name: "无",
                    value: 0,
                    far: 0,
                }
            ],
            ProductID: [
                // {
                //     name: "无",
                //     value: 0,
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

            $("body").delegate("#zace-edit-bomCompare", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择两行数据再试！")
                    return;
                }
                if (SelectData.length != 2) {
                    alert("只能同时对比两行数据！")
                    return;
                }
                if (SelectData.length != 2) {
                    alert("只能同时对比两行数据！")
                    return;
                }


                if (SelectData[0].CustomerID != SelectData[1].CustomerID || SelectData[0].LineID != SelectData[1].LineID || SelectData[0].ProductID != SelectData[1].ProductID) {
                    if (!confirm("配属局段、产线、车型存在不一样，是否进行对比？")) {
                        return;
                    }
                }

                var vdata = { 'header': 'Bop对比', 'href': './report/CompareSetting.html?aid=' + SelectData[0].ID + '&bid=' + SelectData[1].ID, 'id': 'CompareSetting', 'src': './static/images/menu/newfactoryModel/techniquePart.png' };
                window.parent.iframeHeaderSet(vdata);
                window.callFunctionTrigger("CompareSetting", { AID: SelectData[0].ID, BID: SelectData[1].ID });


            });

            //
            $("body").delegate("#lmvt-bopImport-inputErrorLog", "click", function () {

                var vdata = { 'header': '导入日志', 'href': './factory_model/FPCErrorSetting.html?id=' + 1, 'id': 'FPCErrorSettingBop', 'src': './static/images/menu/newfactoryModel/techniquePart.png' };
                window.parent.iframeHeaderSet(vdata);
                window.callFunctionTrigger("FPCErrorSettingBop", { ID: 1 });


            });
            //工序集
            $("body").delegate(".lmvt-list", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DataAll.filter((item) => { return item.ID == wID });


                // var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                // if (!SelectData || !SelectData.length) {
                //     alert("请先选择一行数据再试！")
                //     return;
                // }
                // if (SelectData.length != 1) {
                //     alert("只能同时对一行数据修改！")
                //     return;
                // }

                // var vdata = { 'header': '工艺集', 'href': './factory_model/FPCRoutePartSetting.html', 'id': 'FPCRoutePart', 'src': './static/images/menu/newfactoryModel/techniquePart.png' };
                // window.parent.iframeHeaderSet(vdata);

                var vdata = { 'header': '工序集', 'href': './factory_model/FPCRoutePartSetting.html?id=' + SelectData[0].ID, 'id': 'FPCRoutePart', 'src': './static/images/menu/newfactoryModel/techniquePart.png' };
                window.parent.iframeHeaderSet(vdata);
                window.callFunctionTrigger("FPCRoutePart", { ID: SelectData[0].ID });


            });
            //设为当前 单条
            $("body").delegate(".lmvt-setting", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DataAll.filter((item) => { return item.ID == wID });

                if (SelectData[0].Active != 1) {
                    alert("无法将未启用的数据设为当前!!!");
                    return;
                }

                $com.util.deleteLowerProperty(SelectData);

                model.com.postFPCRouteStandard({
                    ID: SelectData[0].ID,
                }, function (res) {
                    alert("设置成功");
                    $("#zace-closePart-level").click();
                })

            });


            //复制信息 单条 
            $("body").delegate(".lmvt-copy", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DataAll.filter((item) => { return item.ID == wID });

                var DEFAULT_VALUE = {
                    LineID: SelectData[0].LineID,
                    ProductID: SelectData[0].ProductID,
                    CustomerID: SelectData[0].CustomerID,
                    Name: SelectData[0].Name,
                };

                $("body").append($com.modal.show(DEFAULT_VALUE, KEYWORD_Level, "另存为", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    SelectData[0].LineID = Number(rst.LineID);
                    SelectData[0].ProductID = Number(rst.ProductID);
                    SelectData[0].CustomerID = Number(rst.CustomerID);
                    SelectData[0].Name = rst.Name;

                    SelectData[0].VersionNo = "";


                    $com.util.deleteLowerProperty(SelectData);

                    model.com.postFPCRotueCopy({
                        data: SelectData[0],
                    }, function (res) {
                        alert("复制成功");
                        $("#zace-closePart-level").click();
                    })

                }, TypeSource_Level));

            });


            $("body").delegate("#zace-disable-IsStandard", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！")
                    return;
                }


                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                model.com.postFPCRouteStandard({
                    ID: SelectData[0].ID,
                }, function (res) {
                    alert("设置成功");
                    $("#zace-closePart-level").click();


                })




            });





            //条件查询
            $("body").delegate("#zace-searchAll-level", "click", function () {
                var default_value = {
                    BusinessUnitID: 0,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.BusinessUnitID = Number(rst.BusinessUnitID);
                    $com.table.filterByConndition($("#femi-riskLevelAuditAll-tbody"), DATABasicPro, default_value, "ID");

                }, TypeSource_Level));


            });
            $("body").delegate("#zace-zace-refresh", "click", function () {
                model.com.refresh();
            });
            $("body").delegate("#zace-searchAudit-level", "click", function () {
                var default_value = {
                    BusinessUnitID: 0,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.BusinessUnitID = Number(rst.BusinessUnitID);
                    $com.table.filterByConndition($("#femi-riskLevelAudit-tbody"), DataAllConfirm, default_value, "ID");

                }, TypeSource_Level));


            });

            // //双击.
            // $("body").delegate("#femi-riskLevel-tbody tr", "dblclick", function () {

            //     var $this = $(this);
            //     var $table = $this.closest("table");
            //     var WID = Number($this.find('td[data-title=ID]').attr('data-value'));

            //     RouteID = WID;
            //     $table.find("tbody tr").each(function (i, item) {
            //         var $tr = $(this);

            //         if (WID == Number($tr.find("td[data-title=ID]").attr("data-value"))) {
            //             $tr.css('background-color', '#7bf1b5');
            //             temp = true;

            //         }
            //         else {
            //             if (!($tr.attr("data-color"))) {

            //                 $tr.css('background-color', '');
            //             } else {

            //                 var colorPro = $tr.attr("data-color");
            //                 $tr.css('background-color', colorPro);
            //             }
            //         }
            //     });

            //     model.com.refreshPart();
            //     $(".zzzb").hide();
            //     //$(".zzza").css("width", "70%");
            //     //$(".zzzc").css("width", "29%");
            //     $(".zzzc").css("width", "350px");
            //     $(".zzza").css("margin-right", "350px");
            //     $(".zzzc").show();


            //     return false;
            // });
            //隐藏
            $("body").delegate("#zace-closePart-level", "click", function () {

                $(".zzzb").hide();
                $(".zzza").css("margin-right", "0px");
                $(".zzzc").css("width", "0px");
                $(".zzzc").hide();

                model.com.refresh();
            });
            //Enter触发模糊查询事件
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var value = $("#zace-search-approval").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-riskLevel-tbody").children("tr").show();
                    else
                        //     DataAllproduct = [];
                        // for (var i = 0; i < DataAllFactorySearch.length; i++) {
                        //     if (DataAllFactorySearch[i].Active == "启用") {
                        //         DataAllproduct.push(DataAllFactorySearch[i]);
                        //     }
                        // }
                        $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "ID");
                }
            });
            //申请查询
            $("body").delegate("#zace-searchApproval-level", "click", function () {
                var value = $("#zace-search-approval").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    //     DataAllproduct = [];
                    // for (var i = 0; i < DataAllFactorySearch.length; i++) {
                    //     if (DataAllFactorySearch[i].Active == "启用") {
                    //         DataAllproduct.push(DataAllFactorySearch[i]);
                    //     }
                    // }
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "ID");
            });
            //查询
            $("body").delegate("#zace-search-Audit", "input", function () {

                var $this = $(this),
                    value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevelAudit-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevelAudit-tbody"), DataAllSearch, value, "ID");



            });
            //所有数据查询
            $("body").delegate("#zace-search-All", "change", function () {

                var $this = $(this),
                    value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevelAuditAll-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevelAuditAll-tbody"), DataAllFactorySearchPro, value, "ID");



            });
            //产品路线修改
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
                // if (SelectData[0].Status != 1) {
                //     alert("请选择状态为创建的数据！")
                //     return;
                // }
                var default_value = {
                    LineID: SelectData[0].LineID,
                    Name: SelectData[0].Name,
                    VersionNo: SelectData[0].VersionNo,
                    CustomerID: SelectData[0].CustomerID,
                    ProductID: SelectData[0].ProductID,
                    // BusinessUnitID: SelectData[0].BusinessUnitID,
                    // ProductTypeID: SelectData[0].ProductTypeID,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].Name = rst.Name;
                    SelectData[0].VersionNo = rst.VersionNo;
                    SelectData[0].CustomerID = rst.CustomerID;
                    SelectData[0].ProductID = Number(rst.ProductID);
                    SelectData[0].LineID = Number(rst.LineID);
                    // SelectData[0].ProductTypeID = Number(rst.ProductTypeID);
                    // SelectData[0].BusinessUnitID = Number(rst.BusinessUnitID);

                    for (var i = 0; i < SelectData.length; i++) {
                        $com.util.deleteLowerProperty(SelectData[i]);
                    }
                    model.com.postFPCRoute({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        $("#zace-closePart-level").click();
                        //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                        //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    })

                }, TypeSource_Level));


            });

            //产品路线删除 单条
            $("body").delegate(".lmvt-allowed-delete", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DataAll.filter((item) => { return item.ID == wID });

                if (!confirm("确定将版本为 [" + SelectData[0].VersionNo + "] 的数据刪除吗？")) {
                    return;
                }

                model.com.deleteFPCRoute({
                    data: SelectData[0],
                }, function (res) {
                    alert("刪除成功");
                    $("#zace-closePart-level").click();
                    //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                    //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                })




            });



            //产品路线修改
            $("body").delegate("#zace-delete-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！")
                    return;
                }
                if (SelectData[0].Active != 0) {
                    alert("请选择状态为保存的数据！")
                    return;
                }
                if (!confirm("确定将其刪除吗？")) {
                    return;
                }

                model.com.deleteFPCRoute({
                    data: SelectData[0],
                }, function (res) {
                    alert("刪除成功");
                    $("#zace-closePart-level").click();
                    //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                    //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                })




            });


            // lmvt-bopImport-input
            //导入
            $("body").delegate("#lmvt-bopImport-input", "click", function () {
                $("#input-file").val("");
                $("#input-file").click();
            });

            $("body").delegate("#input-file", "change", function () {
                //alert()
                var $this = $(this);

                if (this.files.length == 0)
                    return;

                if (!extLimit(['xlsx', 'xls']).has(this.files[0].name)) {
                    alert("请上传正确的文件！");
                    clearFiles();
                    return;
                }

                var fileData = this.files[0];

                var form = new FormData();
                form.append("file", fileData);


                // PartID: lSelectID
                $com.app.loading('数据导入中...');
                model.com.postImportExcel(form, [function (res) {

                    $com.app.loaded();




                    if (!confirm("导入成功，是否查看详情？")) {
                        $("#zace-closePart-level").click();
                        return;
                    }

                    var vdata = { 'header': '工艺集', 'href': './factory_model/FPCRoutePartSetting.html?id=' + res.info, 'id': 'FPCRoutePart', 'src': './static/images/menu/newfactoryModel/techniquePart.png' };
                    window.parent.iframeHeaderSet(vdata);
                    window.callFunctionTrigger("FPCRoutePart", { ID: res.info });

                }, function (res2) {
                    $com.app.loaded();

                    if (!confirm("导入失败，是否查看详情？")) {
                        $("#zace-closePart-level").click();
                        return;
                    }
                    $("#lmvt-bopImport-inputErrorLog").click();

                }]);
            });
            function extLimit(exts) {
                return {
                    has: function (file) {
                        var arr = file.split("."),
                            ext = arr[arr.length - 1].toLowerCase();

                        return exts.indexOf(ext) > -1 ? true : false;
                    }
                };
            }

            //工产品路线 启用单条
            $("body").delegate(".lmvt-do-active", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DataAll.filter((item) => { return item.ID == wID });

                // var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                // if (!SelectData || !SelectData.length) {
                //     alert("请先选择一行数据再试！")
                //     return;
                // }
                //if (SelectData[0].Status != 1) {
                //    alert("数据选择有误！")
                //    return;
                //}
                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                model.com.activeAudit({
                    data: SelectData,
                    Active: 1,
                }, function (res) {
                    alert("启用成功");
                    $("#zace-closePart-level").click();


                })




            });

            //工产品路线启用
            $("body").delegate("#zace-active-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                //if (SelectData[0].Status != 1) {
                //    alert("数据选择有误！")
                //    return;
                //}
                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                model.com.activeAudit({
                    data: SelectData,
                    Active: 1,
                }, function (res) {
                    alert("启用成功");
                    $("#zace-closePart-level").click();


                })




            });

            //产品路线禁用 单条
            $("body").delegate(".lmvt-do-forbidden", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DataAll.filter((item) => { return item.ID == wID });
                //if (SelectData[0].Status != 1) {
                //    alert("数据选择有误！")
                //    return;
                //}
                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                model.com.activeAudit({
                    data: SelectData,
                    Active: 0,
                }, function (res) {
                    alert("禁用成功");
                    $("#zace-closePart-level").click();

                })

            });

            //产品路线禁用
            $("body").delegate("#zace-disable-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                //if (SelectData[0].Status != 1) {
                //    alert("数据选择有误！")
                //    return;
                //}
                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                model.com.activeAudit({
                    data: SelectData,
                    Active: 0,
                }, function (res) {
                    alert("禁用成功");
                    $("#zace-closePart-level").click();

                })

            });

            //产品新增
            $("body").delegate("#zace-add-level", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    // PositionTemp.BusinessUnitID = Number(rst.BusinessUnitID);
                    PositionTemp.LineID = Number(rst.LineID);
                    PositionTemp.ProductID = Number(rst.ProductID);
                    PositionTemp.CustomerID = Number(rst.CustomerID);
                    PositionTemp.Name = rst.Name;
                    // PositionTemp.Description = rst.Description;
                    // PositionTemp.Status = Number(rst.Status);
                    PositionTemp.VersionNo = rst.VersionNo;
                    //PositionTemp.Active = rst.Active;

                    model.com.postFPCRoute({
                        data: PositionTemp,
                    }, function (res) {
                        alert("新增成功");
                        $("#zace-closePart-level").click();
                    })

                }, TypeSource_Level));


            });

            //===========
            //我的审核
            $("body").delegate("#zace-myAudit-level", "click", function () {
                $(".zzza").hide();
                $(".zzzc").hide();
                $(".zzzd").hide();
                $(".zzzb").show();
                model.com.refresh();

            });
            $("body").delegate("#zace-myApproval-level", "click", function () {
                $(".zzza").show();
                $(".zzza").css("margin-right", "0px");
                $(".zzzc").css("width", "0px");
                $(".zzzc").hide();
                $(".zzzd").hide();
                $(".zzzb").hide();
                model.com.refresh();

            });
            $("body").delegate("#zace-allList-level", "click", function () {
                $(".zzza").hide();
                $(".zzzc").hide();
                $(".zzzd").show();
                $(".zzzb").hide();
                model.com.refresh();

            });
            //返回
            $("body").delegate("#zace-returnAudit-level", "click", function () {
                $(".zzza").show();
                $(".zzza").css("margin-right", "0px");
                $(".zzzc").css("width", "0px");
                $(".zzzc").hide();
                $(".zzzb").hide();
                $(".zzzd").hide();
                model.com.refresh();

            });


            $("body").delegate("#zace-routePartPoint-level", "click", function () {
                var vdata = { 'header': '工艺工序', 'href': './factory_model/FPCRoutePartPointSetting.html', 'id': 'FPCRoutePartPoint', 'src': './static/images/menu/newfactoryModel/techniquePartpoint.png' };
                window.parent.iframeHeaderSet(vdata);

            });


            // $("body").delegate("#zace-routePart-level", "click", function () {
            //     var vdata = { 'header': '工艺集', 'href': './factory_model/FPCRoutePartSetting.html', 'id': 'FPCRoutePart', 'src': './static/images/menu/newfactoryModel/techniquePart.png' };
            //     window.parent.iframeHeaderSet(vdata);

            // });
            $("body").delegate("#zace-ProductRoute-level", "click", function () {
                var vdata = { 'header': '工艺路线', 'href': './factory_model/ProductRouteSetting.html', 'id': 'ProductRouteSetup', 'src': './static/images/menu/newfactoryModel/productTechniqueRoute.png' };
                window.parent.iframeHeaderSet(vdata);

            });
        },




        run: function () {



            model.com.getFMCLineAll({}, function (resBZ) {
                if (resBZ && resBZ.list) {
                    $.each(resBZ.list, function (i, item) {
                        TypeSource_Level.LineID.push({
                            name: item.Name,
                            value: item.ID,
                            far: 0,
                        });
                    });

                }
                model.com.getCustomer({ active: 2 }, function (resP) {
                    if (!resP)
                        return;

                    $.each(resP.list, function (i, item) {
                        TypeSource_Level.CustomerID.push({
                            value: item.ID,
                            name: item.CustomerName
                        });
                    });

                    model.com.getFPCProduct({ ProductTypeID: 0, BusinessUnitID: 0 }, function (resP) {
                        if (!resP)
                            return;

                        $.each(resP.list, function (i, item) {
                            if (item.Active == 1) {
                                TypeSource_Level.ProductID.push({
                                    value: item.ID,
                                    name: item.ProductNo
                                });
                            }
                        });
                        model.com.refresh();
                    });
                });
            });



        },

        com: {

            postFPCRotueCopy: function (data, fn, context) {
                var d = {
                    $URI: "/FPCRoute/Copy",
                    $TYPE: "post",
                    // $SERVER: '/MESQMS',

                };

                function err() {
                    $com.app.tip('复制失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            postImportExcel: function (data, fn, context) {
                var d = {
                    $URI: "/FPCRoute/Import",
                    $TYPE: "post",
                    $SERVER: '/MESQMS',

                };

                function err() {
                    $com.app.tip('导入失败，请检查网络');
                }

                $com.app.ajax_load(data ? $.extend(data, d) : $.extend(d, data), fn, err, context);
            },
            //查询
            getFPCProduct: function (data, fn, context) {
                var d = {
                    $URI: "/FPCProduct/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询信息
            getCustomer: function (data, fn, context) {
                var d = {
                    $URI: "/Customer/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            setMMM: function () {
                setTimeout(function () {
                    if (window.parent._zaceProductType && window.parent._zaceProductType == 1) {
                        model.com.getFPCProductType({ BusinessUnitID: 0 }, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {
                                //TypeSource_materialRecord.SupplierID = [];
                                TypeSource_Level.ProductTypeID.splice(1, TypeSource_Level.ProductTypeID.length - 1);
                                $.each(resW.list, function (i, item) {
                                    TypeSource_Level.ProductTypeID.push({
                                        name: item.Name,
                                        value: item.ID,
                                        far: item.BusinessUnitID,
                                    });
                                });
                            }
                            window.parent._zaceProductType = 0;
                        });

                    }

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
                                        far: 0,
                                    });
                                });
                            }
                            window.parent._zaceBusinessUnit = 0;
                        });

                    }
                    if (window.parent._zaceLineSet && window.parent._zaceLineSet == 1) {
                        model.com.getFMCLineAll({}, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {
                                //TypeSource_materialRecord.SupplierID = [];
                                TypeSource_Level.LineID.splice(1, TypeSource_Level.LineID.length - 1);
                                $.each(resW.list, function (i, item) {
                                    TypeSource_Level.LineID.push({
                                        name: item.Name,
                                        value: item.ID,
                                        far: item.BusinessUnitID,
                                    });
                                });
                            }
                            window.parent._zaceLineSet = 0;
                        });

                    }

                    model.com.setMMM();
                }, 500);

            },
            refresh: function () {
                $com.app.loading('数据加载中...');
                model.com.getFPCRoute({ FactoryID: 0, BusinessUnitID: 0, ProductTypeID: 0 }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var Grade = [];
                        DATABasic = $com.util.Clone(resP.list);

                        //审核数据
                        DataAllConfirm = $com.util.Clone(resP.list);
                        for (var i = 0; i < DataAllConfirm.length; i++) {
                            if (DataAllConfirm[i].Active != 3) {
                                Grade.push(DataAllConfirm[i]);
                            }

                        }
                        DataAll = $com.util.Clone(Grade);

                        $.each(Grade, function (i, item) {

                            item.Badge = " ";

                            if (item.IsStandard == 1) {
                                item.ISNow = "lmvt-not-allowed-delete";
                                item.IsStandardBadge = "lmvt-activeBadge"
                            } else {
                                item.IsStandardBadge = "ActiveBadgeDis";
                            }

                            if (item.Active == 1) {

                                item.ISAllowedText = "禁用";
                                item.ISAllowed = "lmvt-do-forbidden";
                                item.ClassBadge = "lmvt-activeBadge";
                                item.ISDelete = "lmvt-not-allowed-delete";
                                item.ISNow = "lmvt-do-info";

                            } else if (item.Active == 2) {

                                item.ISAllowedText = "启用";
                                item.ISAllowed = "lmvt-do-active";
                                item.ClassBadge = "lmvt-forbiddenBadge";
                                item.ISDelete = "lmvt-not-allowed-delete";
                                item.ISNow = "lmvt-not-allowed-delete";

                            } else {

                                item.ISAllowedText = "启用";
                                item.ISAllowed = "lmvt-do-active";
                                item.ClassBadge = "lmvt-defBadge";
                                item.ISDelete = "lmvt-allowed-delete";
                                item.ISNow = "lmvt-not-allowed-delete";

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

                        $com.app.loaded();



                    }

                });
            },
            refreshPart: function () {
                $com.app.loading('数据加载中...');
                model.com.getFPCRoutePart({ RouteID: RouteID }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var _list = resP.list;
                        var _listOrder = [];
                        for (var i = 0; i < _list.length; i++) {

                            for (var j = 0; j < _list.length; j++) {
                                if ((i + 1) == _list[j].OrderID) {


                                    _listOrder.push(_list[j]);
                                }
                            }

                        }
                        for (var index = 0; index < _listOrder.length; index++) {
                            _listOrder[index].WID = index + 1;;

                        }
                        $("#femi-riskPart-tbody").html($com.util.template(_listOrder, HTML.TablePartMode));
                        $com.app.loaded();
                    }
                });

            },
            //查询产品工序段列表
            getFPCRoutePart: function (data, fn, context) {
                var d = {
                    $URI: "/FPCRoutePart/All",
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
            //查询规格类型
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
            //查询产线
            getFMCLineAll: function (data, fn, context) {
                var d = {
                    $URI: "/FMCLine/All",
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
            //查询产品路线列表
            getFPCRoute: function (data, fn, context) {
                var d = {
                    $URI: "/FPCRoute/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            postFPCRouteStandard: function (data, fn, context) {
                var d = {
                    $URI: "/FPCRoute/Standard",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //保存产品路线列表
            postFPCRoute: function (data, fn, context) {
                var d = {
                    $URI: "/FPCRoute/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            deleteFPCRoute: function (data, fn, context) {
                var d = {
                    $URI: "/FPCRoute/Delete",
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
                    $URI: "/FPCRoute/Audit",
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
                    $URI: "/FPCRoute/Active",
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