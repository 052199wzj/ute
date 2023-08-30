require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/jquery.treeview', '../static/utils/js/base/table-select'],
    function ($lin, $com, $treeview) {

        var HTML,
            //订单
            Order_source,
            OrderList,
            //查询时间
            StartTime,
            EndTime,
            ActiveNumber,
            StatusNumber,

            SupplierList,
            ProductList,
            MaterialList,
            UnitList,

            //是否可以审查
            flag,
            Defaul_Value_Standard,
            KETWROD_LIST_Standard,
            KETWROD_Standard,
            Formattrt_Standard,
            TypeSource_Standard,

            Defaul_Value_Item,
            KETWROD_LIST_Item,
            KETWROD_Item,
            Formattrt_Item,
            TypeSource_Item,

            standardInfoData,
            standardInfoList,
            capacityType_source;

        HTML = {
            OrderList: [
                '<tr data-color="">',
                '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></th>',
                '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
                '<td style="min-width: 80px" data-title="EvaluationNo" data-value="{{EvaluationNo}}">{{EvaluationNo}}</td>',
                '<td style="min-width: 80px" data-title="RequestPurchaseNo" data-value="{{RequestPurchaseNo}}">{{ RequestPurchaseNo}}</td>',
                '<td style="min-width: 50px" data-title="Project" data-value="{{Project}}" >{{ Project}}</td>',
                '<td style="min-width: 50px" data-title="DrawingNo" data-value="{{DrawingNo}}" >{{ DrawingNo}}</td>',
                '<td style="min-width: 80px" data-title="Version" data-value="{{Version}}" >{{ Version}}</td>',
                '<td style="min-width: 100px" data-title="MaterialNo" data-value="{{MaterialNo}}" >{{ MaterialNo}}</td>',
                '<td style="min-width: 100px" data-title="ProductName" data-value="{{ProductName}}" >{{ ProductName}}</td>',
                '<td style="min-width: 80px" data-title="ProductNo" data-value="{{ProductNo}}" >{{ ProductNo}}</td>',
                '<td style="min-width: 60px" data-title="TParameter" data-value="{{TParameter}}" >{{ TParameter}}</td>',
                '<td style="min-width: 80px" data-title="FQTY_Request" data-value="{{FQTY_Request}}" >{{ FQTY_Request}}</td>',
                '<td style="min-width: 80px" data-title="FQTY_Plan" data-value="{{FQTY_Plan}}" >{{ FQTY_Plan}}</td>',
                '<td style="min-width: 50px" data-title="UnitText" data-value="{{UnitText}}" >{{ UnitText}}</td>',
                '<td style="min-width: 50px" data-title="FQTY_Arrival" data-value="{{FQTY_Arrival}}" >{{FQTY_Arrival}}</td>',
                '<td style="min-width: 80px" data-title="ArrivalDate" data-value="{{ArrivalDate}}">{{ArrivalDate}}</td>',
                '<td style="min-width: 80px" data-title="ExpectArrivalDate" data-value="{{ExpectArrivalDate}}">{{ ExpectArrivalDate}}</td>',
                '<td style="min-width: 50px" data-title="RSupplierName" data-value="{{RSupplierName}}" >{{ RSupplierName}}</td>',
                '<td style="min-width: 50px" data-title="SupplierName" data-value="{{SupplierName}}" >{{ SupplierName}}</td>',
                '<td style="min-width: 80px" data-title="ContractNo" data-value="{{ContractNo}}" >{{ ContractNo}}</td>',

                '<td style="min-width: 80px" data-title="Auditor" data-value="{{Auditor}}" >{{ Auditor}}</td>',
                '<td style="min-width: 60px" data-title="AuditTime" data-value="{{AuditTime}}" >{{ AuditTime}}</td>',
                '<td style="min-width: 80px" data-title="CreatorID" data-value="{{CreatorID}}" >{{ CreatorID}}</td>',
                '<td style="min-width: 60px" data-title="CreateTime" data-value="{{CreateTime}}" >{{ CreateTime}}</td>',
                '<td style="min-width: 80px" data-title="Buyer" data-value="{{Buyer}}" >{{ Buyer}}</td>',
                '<td style="min-width: 100px" data-title="Active" data-value="{{Active}}" >{{ Active}}</td>',
                '<td style="min-width: 100px" data-title="Status" data-value="{{Status}}" >{{ Status}}</td>',
                '<tr>'
            ].join(""),

        };
        flag = false;
        num = 0;
        //新增标准项
        Defaul_Value_Item = {
            EvaluationNo: "",
            RequestPurchaseNo: "",
            Project: "",
            DrawingNo: 0,
            Version: 0,
            MaterialNo: "",
            ProductName: "",
            ProductNo: "",
            TParameter: "",
            FQTY_Request: 0,
            FQTY_Plan: 0,
            UnitText: 0,
            FQTY_Arrival: 0,
            ExpectArrivalDate: new Date(),
            ArrivalDate: new Date(),
            RSupplierName: 0,
            SupplierName: 0,
            ContractNo: 0,
            //Status: 0,
            Active: 0,
            CreatorID: 0,
            CreateTime: 0,
            Buyer: 0,
        };
        (function () {

            KETWROD_LIST_Item = [
                "EvaluationNo|合同评审号",
                "RequestPurchaseNo|请购单号",
                "Project|项目",
                "DrawingNo|图号",
                "Version|版本号",
                "MaterialNo|物料编码|ArrayOne",
                "ProductName|产品名称|ArrayOne",
                "TParameter|技术参数",
                "FQTY_Request|需求量",
                "FQTY_Plan|计划采购数",
                "UnitText|单位名称|ArrayOne",
                "FQTY_Arrival|实际到货数量",
                "ExpectArrivalDate|预期到达时间|date",
                "ArrivalDate|实际到达时间|date",
                "RSupplierName|推荐供应商名称|ArrayOne",
                "SupplierName|供应商|ArrayOne",
                "ContractNo|合同号",
                "Status|状态|ArrayOne",
                "Active|状态|ArrayOne",
                "Buyer|采购人|ArrayOne"
            ];

            KETWROD_Item = {};

            Formattrt_Item = {};

            TypeSource_Item = {
                Buyer: [

                ],
                MaterialNo: [

                ],
                UnitText: [

                ],
                SupplierName: [

                ],
                RSupplierName: [

                ],
                ProductName: [

                ],
                Active: [
                    {
                        name: "冻结",
                        value: 0
                    },
                    {
                        name: "激活",
                        value: 1
                    }
                ],
                Status: [
                    {
                        name: "创建",
                        value: 1
                    },
                    {
                        name: "待审核",
                        value: 2
                    },
                    {
                        name: "已审核",
                        value: 3
                    },
                    {
                        name: "撤销审核",
                        value: 4
                    }
                ]
            };
            $.each(KETWROD_LIST_Item, function (i, item) {
                var detail = item.split("|");
                KETWROD_Item[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_Item[detail[0]] = $com.util.getFormatter(TypeSource_Item, detail[0], detail[2]);
                }
            });
        })();

        //查询
        Defaul_Value_Sreach = {
            StartTime: new Date(),
            EndTime: new Date(),
            // Active: 1,
            // Status: 1
        };
        (function () {

            KETWROD_LIST_Sreach = [
                "StartTime|开始时间|dateTime",
                "EndTime|结束时间|dateTime",
                // "Active|状态|ArrayOne",
                // "Status|状态|ArrayOne"
            ];

            KETWROD_Sreach = {};

            Formattrt_Sreach = {};

            TypeSource_Sreach = {
                Active: [
                    {
                        name: "全部",
                        value: 2
                    },
                    {
                        name: "冻结",
                        value: 0
                    },
                    {
                        name: "激活",
                        value: 1
                    }
                ],
                Status: [
                    {
                        name: "全部",
                        value: 0
                    },
                    {
                        name: "创建",
                        value: 1
                    },
                    {
                        name: "待审核",
                        value: 2
                    },
                    {
                        name: "已审核",
                        value: 3
                    },
                    {
                        name: "撤销审核",
                        value: 4
                    }
                ]
            };

            $.each(KETWROD_LIST_Sreach, function (i, item) {
                var detail = item.split("|");
                KETWROD_Sreach[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_Sreach[detail[0]] = $com.util.getFormatter(TypeSource_Sreach, detail[0], detail[2]);
                }
            });
        })();

        model = $com.Model.create({
            name: '采购计划',

            type: $com.Model.MAIN,

            configure: function () {
                this.run();
            },

            events: function () {

                //返回
                $("body").delegate("#lmvt-grinding-back", "click", function () {
                    $(".zace-container").show();
                    $(".lmvt-container").hide();
                });
                //审批postOrderReverseAudit
                $("body").delegate("#lmvt-approve-agree", "click", function () {

                    var SelectData = $com.table.getSelectionData($(".lmvt-order-body"), "ID", Order_source);

                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return;
                    }
                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其通过？")) {
                        return;
                    }

                    $.each(SelectData, function (i, item) {
                        item.Status = 3;
                    });

                    model.com.postOrderAudit({
                        data: SelectData,
                    }, function (res) {
                        alert("审批成功！！");
                        model.com.refresh();
                    });
                });
                //反审批
                $("body").delegate("#lmvt-approve-disagree", "click", function () {

                    var SelectData = $com.table.getSelectionData($(".lmvt-order-body"), "ID", Order_source);

                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return;
                    }
                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其驳回？")) {
                        return;
                    }
                    $.each(SelectData, function (i, item) {
                        item.Status = 4;
                    });

                    model.com.postOrderReverseAudit({
                        data: SelectData,
                    }, function (res) {
                        alert("审批成功！！");
                        model.com.refresh();
                    });
                });
                //提交
                $("body").delegate("#lmvt-apply-submit", "click", function () {

                    var temp = false,
                        SelectData = $com.table.getSelectionData($(".lmvt-order-body"), "ID", Order_source);

                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return;
                    }

                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其提交？")) {
                        return;
                    }

                    $.each(SelectData, function (i, item) {
                        if (item.Status != 1) {
                            temp = true;
                        }
                    });

                    if (temp) {
                        alert("存在无法提交的数据，请重新选择！！！");
                        return false;
                    }

                    $.each(SelectData, function (i, item) {
                        item.Status = 2;
                    });

                    model.com.postOrderAll({
                        data: SelectData,
                    }, function (res) {
                        alert("提交成功");
                        model.com.refresh();
                    });
                });

                //新增类型
                $("body").delegate("#lmvt-table-add", "click", function () {

                    $("body").append($com.modal.show(Defaul_Value_Item, KETWROD_Item, "新增", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }

                        var _data = [{
                            ID: 0,
                            EvaluationNo: rst.EvaluationNo,
                            RequestPurchaseNo: rst.RequestPurchaseNo,
                            Project: rst.Project,
                            DrawingNo: rst.DrawingNo,
                            Version: rst.Version,
                            MaterialID: Number(rst.MaterialNo),
                            ProductID: Number(rst.ProductName),
                            // ProductID: model.com.getProductNo(rst.ProductName),
                            TParameter: rst.TParameter,
                            FQTY_Request: rst.FQTY_Request,
                            FQTY_Plan: rst.FQTY_Plan,
                            Unit: rst.UnitText,
                            FQTY_Arrival: rst.FQTY_Arrival,
                            ArrivalDate: rst.ArrivalDate,
                            ExpectArrivalDate: rst.ExpectArrivalDate,
                            RSupplierID: rst.RSupplierName,
                            SupplierID: rst.SupplierName,
                            Status: 1,
                            Active: Number(rst.Active),
                            BuyerID: rst.Buyer
                        }];

                        model.com.postOrderAll({
                            data: _data,
                        }, function (res) {
                            alert("新增成功！！");
                            model.com.refresh();
                        });

                    }, TypeSource_Item));
                });

                //查询
                $("body").delegate("#lmvt-table-sreach", "click", function () {

                    $("body").append($com.modal.show(Defaul_Value_Sreach, KETWROD_Sreach, "查询", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }

                        StartTime = $com.util.format('yyyy-MM-dd', rst.StartTime);
                        EndTime = $com.util.format('yyyy-MM-dd', rst.EndTime);

                        ActiveNumber = 2;
                        StatusNumber = 0;

                        model.com.refresh();
                    }, TypeSource_Sreach));

                });
                //审批
                $("body").delegate("#lmvt-myAudit", "click", function () {
                    ActiveNumber = 2;
                    StatusNumber = 2;
                    $(".lmvt-container-purchase").hide();
                    $(".lmvt-container-apply").hide();
                    $(".lmvt-container-approve").show();
                    model.com.refresh();
                });
                //申请
                $("body").delegate("#lmvt-myApproval", "click", function () {
                    ActiveNumber = 2;
                    StatusNumber = 1;
                    model.com.getOrderAll({ MaterialNo: "", Status: 0, Active: 2, StartTime: StartTime, EndTime: EndTime }, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];
                        if (list) {

                            Order_source = res.list;

                            OrderList = res.list;

                            OrderList = $com.util.Clone(OrderList);
                            var cate = [];
                            $.each(OrderList, function (i, item) {
                                if (item.Status == 1) {
                                    cate.push(item);
                                }
                                if (item.Status == 4) {
                                    cate.push(item);
                                }
                            });
                            $.each(cate, function (i, item) {
                                item.Active = Formattrt_Item.Active(item.Active);
                                item.Status = Formattrt_Item.Status(item.Status);
                            });
                            OrderList = cate;
                        }
                        $(".lmvt-order-body").html($com.util.template(OrderList, HTML.OrderList));

                        $(".lmvt-order-body tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });
                    });

                    $(".lmvt-container-purchase").hide();
                    $(".lmvt-container-apply").show();
                    $(".lmvt-container-approve").hide();
                });
                //所有
                $("body").delegate("#lmvt-allList", "click", function () {
                    ActiveNumber = 2;
                    StatusNumber = 0;
                    $(".lmvt-container-purchase").show();
                    $(".lmvt-container-apply").hide();
                    $(".lmvt-container-approve").hide();
                    model.com.refresh();
                });
                //激活
                $("body").delegate("#lmvt-table-active", "click", function () {

                    var SelectData = $com.table.getSelectionData($(".lmvt-order-body"), "ID", Order_source);
                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return;
                    }

                    // $.each(SelectData,function(i,item){
                    //     item.Active = 1;
                    // });
                    model.com.postOrderActive({
                        data: SelectData,
                        Active: 1
                    }, function (res) {
                        alert("激活成功！！");
                        model.com.refresh();
                    });

                });

                //dongjie
                $("body").delegate("#lmvt-table-crice", "click", function () {

                    var SelectData = $com.table.getSelectionData($(".lmvt-order-body"), "ID", Order_source);
                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return;
                    }

                    // $.each(SelectData,function(i,item){
                    //     item.Active = 1;
                    // });
                    model.com.postOrderActive({
                        data: SelectData,
                        Active: 0
                    }, function (res) {
                        alert("冻结成功！！");
                        model.com.refresh();
                    });
                });
                $("body").delegate("#lmvt-table-basic-add-templet", "click", function () {
                    $("#input-file").val("");
                    $("#input-file").click();

                });
                //导入
                $("body").delegate("#input-file", "change", function () {
                    var $this = $(this);

                    if (this.files.length == 0)
                        return;
                    var fileData = this.files[0];

                    var form = new FormData();
                    form.append("file", fileData);

                    model.com.postImportExcel(form, function (res) {
                        if (res.list.length > 0) {
                            var result = $com.table.postExportParams(res.list, $(".lmvt-order-body"));

                            $(".lmvt-order-body").append($com.util.template(result, HTML.OrderList));

                            var _data = $com.util.Clone(result);

                            $.each(_data, function (i, item) {
                                item.ID = 0;
                                if (item.Active == "冻结") {
                                    item.Active = 0;
                                }
                                else {
                                    item.Active = 1;
                                }
                                if (item.Status == "创建") {
                                    item.Status = 1;
                                }
                                else if (item.Status == "待审核") {
                                    item.Status = 2;
                                }
                                else if (item.Status == "已审核") {
                                    item.Status = 3;
                                }
                                else {
                                    item.Status = 4;
                                }
                                item.Auditor = model.com.getUserName(item.Auditor);
                                item.Buyer = model.com.getUserName(item.Buyer);
                            });

                            model.com.postOrderAll({
                                data: _data,
                            }, function (res) {
                                alert("导入成功！！");
                                model.com.refresh();
                            });

                        } else {
                            alert("导入表格有误，请检查后重新导入！");
                        }
                    });

                });
                //导出
                $("body").delegate("#lmvt-table-out", "click", function () {
                    var $table = $(".order-table"),
                        fileName = "采购订单.xls",
                        Title = "采购订单";
                    var params = $com.table.getExportParams($table, fileName, Title);

                    model.com.postExportExcel(params, function (res) {
                        var src = res.info.path;
                        window.open(src);
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

                    ID = Number(TreeID);
                    SinID = Number(SonID);

                    model.com.Romance(ID, SinID);
                    model.com.refresh();
                });

            },
            run: function () {
                model.com.getUserAll({}, function (res) {
                    if (!res)
                        return;
                    var list = res.list,
                        rst = [];
                    if (res && res.list) {
                        UserList = res.list;
                        $.each(UserList, function (i, item) {
                            TypeSource_Item.Buyer.push({
                                name: item.Name,
                                value: item.ID
                            });

                        });
                    }

                });
                //所有供应商
                model.com.geSupplierAll({ tax_code: "", supplier_name: "", country_id: "", province_id: "", city_id: "", active: 2 }, function (res) {
                    if (!res)
                        return;
                    var list = res.list,
                        rst = [];
                    if (res && res.list) {
                        SupplierList = res.list;
                        $.each(SupplierList, function (i, item) {
                            TypeSource_Item.SupplierName.push({
                                name: item.SupplierName,
                                value: item.ID
                            });
                            TypeSource_Item.RSupplierName.push({
                                name: item.SupplierName,
                                value: item.ID
                            });
                        });
                    }
                });
                //所有规格
                model.com.geFPCProductAll({ BusinessUnitID: -1, ProductTypeID: -1, OAGetType: -1 }, function (res) {
                    if (!res)
                        return;
                    var list = res.list,
                        rst = [];
                    if (res && res.list) {
                        ProductList = res.list;
                        $.each(ProductList, function (i, item) {
                            TypeSource_Item.ProductName.push({
                                name: item.ProductName,
                                value: item.ID
                            });
                        });

                    }

                });
                //物料号
                model.com.getMaterialAll({ material_no: "", material_name: "", type_id: -1, status: -1 }, function (res) {
                    if (!res)
                        return;
                    var list = res.list,
                        rst = [];
                    if (res && res.list) {
                        MaterialList = res.list;
                        $.each(MaterialList, function (i, item) {
                            TypeSource_Item.MaterialNo.push({
                                name: item.MaterialName,
                                value: item.ID
                            });
                        });

                    }
                });
                //单位
                model.com.getUnitAll({}, function (res) {
                    if (!res)
                        return;
                    var list = res.list,
                        rst = [];
                    if (res && res.list) {
                        UnitList = res.list;
                        $.each(UnitList, function (i, item) {
                            TypeSource_Item.UnitText.push({
                                name: item.Name,
                                value: item.ID
                            });
                        });
                    }
                });
            },
            com: {
                //用户
                getUserAll: function (data, fn, context) {
                    var d = {
                        $URI: "/User/All",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //查询所有订单
                getOrderAll: function (data, fn, context) {
                    var d = {
                        $URI: "/SCMPurchasePlan/All",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //保存所有订单
                postOrderAll: function (data, fn, context) {
                    var d = {
                        $URI: "/SCMPurchasePlan/SaveAll",
                        $TYPE: "post"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //激活所有订单
                postOrderActive: function (data, fn, context) {
                    var d = {
                        $URI: "/SCMPurchasePlan/Active",
                        $TYPE: "post"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //审批订单
                postOrderAudit: function (data, fn, context) {
                    var d = {
                        $URI: "/SCMPurchasePlan/Audit",
                        $TYPE: "post"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //反审批订单
                postOrderReverseAudit: function (data, fn, context) {
                    var d = {
                        $URI: "/SCMPurchasePlan/ReverseAudit",
                        $TYPE: "post"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //供应商
                geSupplierAll: function (data, fn, context) {
                    var d = {
                        $URI: "/Supplier/All",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //规格
                geFPCProductAll: function (data, fn, context) {
                    var d = {
                        $URI: "/FPCProduct/All",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //物料
                getMaterialAll: function (data, fn, context) {
                    var d = {
                        $URI: "/Material/All",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //单位
                getUnitAll: function (data, fn, context) {
                    var d = {
                        $URI: "/Unit/All",
                        $TYPE: "get"
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
                    //根据状态查询
                    //model.com.getOrderAll({ MaterialNo: "", Status: StatusNumber, Active: ActiveNumber, StartTime: StartTime, EndTime: EndTime }, function (res) {
                    //    if (!res)
                    //        return;
                    //    var list = res.list,
                    //        rst = [];
                    //    if (list) {

                    //        Order_source = res.list;

                    //        OrderList = res.list;

                    //        OrderList = $com.util.Clone(OrderList);

                    //        $.each(OrderList, function (i, item) {
                    //            item.Active = Formattrt_Item.Active(item.Active);
                    //            item.Status = Formattrt_Item.Status(item.Status);
                    //        });
                    //    }
                    //    $(".lmvt-order-body").html($com.util.template(OrderList, HTML.OrderList));

                    //});
                    model.com.getOrderAll({ MaterialNo: "", Status: 0, Active: 2, StartTime: StartTime, EndTime: EndTime }, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];
                        if (list) {

                            Order_source = res.list;

                            OrderList = res.list;

                            OrderList = $com.util.Clone(OrderList);

                            //$.each(OrderList, function (i, item) {
                            //    for (var p in item) {
                            //        if (!Formattrt_Item[p])
                            //            continue;
                            //        item[p] = Formattrt_Item[p](item[p]);
                            //    }
                            //});

                            $.each(OrderList, function (i, item) {
                                item.Active = Formattrt_Item.Active(item.Active);
                                item.Status = Formattrt_Item.Status(item.Status);
                                item.CreatorID = Formattrt_Item.Buyer(item.CreatorID);
                            });


                        }
                        $(".lmvt-order-body").html($com.util.template(OrderList, HTML.OrderList));
                        $(".lmvt-order-body tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });
                        $(".lmvt-order-body tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });

                    });
                },
                getProductNo: function (name) {
                    var productNo
                    $.each(ProductList, function (i, item) {
                        if (item.ProductName == name)
                            productNo = item.ProductNo;
                    })
                    return productNo;
                },
                getUserName: function (Name) {
                    var ID = 0;
                    $.each(UserList, function (i, item) {
                        if (item.Name == Name) {
                            ID = item.ID;
                            return false;
                        }
                    });
                    return ID;
                },
            },
        });
        model.init();
    });