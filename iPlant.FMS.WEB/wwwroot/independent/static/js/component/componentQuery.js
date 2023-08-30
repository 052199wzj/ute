require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/paging'], function ($zace, $com, $page) {

    var KEYWORD_Level_LIST,
        KEYWORD_Level,
        KEYWORD_LIST,
        KEYWORD,
        FORMATTRT_Level,
        DEFAULT_VALUE_Level,
        TypeSource_Level,
        model,
        wList,
        wPrePartItem = [],
        TypeObj,
        mCertificate,
        mRecord,
        default_value_Config,
        mQRCode,
        SupplierName,
        mTempTypeSource,
        SupplierProductNo,
        SupplierPartNo,
        ProductID_Name = {},
        TypeCode = {},
        ProductName_ID = [],
        wPrePartItem,
        StartTime,
        Config = "",
        mConfigCode,
        EndTime,
        DataAll,
        DATABasic,
        mConfigEdite,
        DataAllConfirmBasic,
        DataAllConfirmChange,
        DataAllConfirm,
        DataAllSearch,
        DataAllFactorySearch,
        mConfig,
        wProduct,
        mLineID = -1,
        mProductID = -1,
        wLine,
        ProductID_Name = {},
        ProductName_ID = [],
        HTML;
    DataAll = [];
    DATABasic = [];
    DataAllConfirmBasic = [];
    DataAllConfirmChange = [];
    DataAllConfirm = [];
    DataAllFactorySearch = DataAllSearch = [];

    mEditPartItem = {
        Config: 0,
        SupplierPartNo: "",
        Certificate: 0,
        Record: 0,
        QRCode: 0,
        Result: 0,
        Remark: "",
    };
    PositionTemp = {
        ID: 0,
        Code: "",
        LineID: "",
        ProductNo: "",
        CustomerID: 0,
        MaterialID: 0,
        UnitID: 0,
        EditorID: 0,
        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Type: 0,
        Number: 0,
        SupplierName: "",
        SupplierProductNo: "",
        SupplierPartNo: "",
        OrderID: 0,
        OrderNo: "",
        Status: 1,
        AuditorID: 0,
        AuditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Certificate: 0,
        Record: 0,
        QRCode: 0,
    };

    HTML = {
        Temp: [
            '<div class="m-c-boxText" style="margin-top: 15px;">',
            '<ul class="" style="list-style-type: none;padding: 0px;border: 1px solid grey;">',
            '{{ITEMBOX}}',
            '</ul>',
            '</div>',
        ].join(""),
        LIST: ['<li style="border-bottom: 1px solid grey;">',
            '<label class="m-detail-title" style="width: 40%;font-size: 16px;text-align: center;margin-bottom: 0px;float: left;">{{name}}</label>',
            '<div class="m-detail-content" style="display: inline-block;font-size: 16px;width: 60%; text-align: left;">{{value}}</div>',
            '</li>',
        ].join(""),

        TableMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td style="display:none" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="WID" data-value="{{WID}}">{{WID}}</td>',
            //'<td data-title="ProductName" data-value="{{ProductName}}" >{{ProductName}}</td>',
            '<td data-title="Code" data-value="{{Code}}">{{Code}}</td>',
            '<td data-title="Name" data-value="{{Name}}">{{Name}}</td>',
            '<td data-title="LineName" data-value="{{LineName}}">{{LineName}}</td>',
            '<td data-title="ProductNo" data-value="{{ProductNo}}">{{ProductNo}}</td>',
            '<td data-title="PartNo" data-value="{{PartNo}}">{{PartNo}}</td>',
            '<td data-title="CustomerName" data-value="{{CustomerName}}">{{CustomerName}}</td>',
            '<td data-title="MaterialName" data-value="{{MaterialName}}">{{MaterialName}}</td>',
            '<td data-title="UnitText" data-value="{{UnitText}}">{{UnitText}}</td>',
            '<td data-title="Editor" data-value="{{Editor}}">{{Editor}}</td>',
            '<td data-title="EditTime" data-value="{{EditTime}}">{{EditTime}}</td>',
            '<td data-title="SupplierName" data-value="{{SupplierName}}">{{SupplierName}}</td>',
            '<td data-title="SupplierProductNo" data-value="{{SupplierProductNo}}">{{SupplierProductNo}}</td>',
            '<td data-title="SupplierPartNo" data-value="{{SupplierPartNo}}">{{SupplierPartNo}}</td>',
            // '<td data-title="OrderNo" data-value="{{OrderNo}}" >{{OrderNo}}</td>',
            // '<td data-title="Auditor" data-value="{{Auditor}}">{{Auditor}}</td>',
            // '<td data-title="AuditTime" data-value="{{AuditTime}}">{{AuditTime}}</td>',
            '<td data-title="Certificate" data-value="{{Certificate}}">{{Certificate}}</td>',
            '<td data-title="Record" data-value="{{Record}}">{{Record}}</td>',
            '<td data-title="QRCode" data-value="{{QRCode}}">{{QRCode}}</td>',
            '<td data-title="Result" data-value="{{Result}}">{{Result}}</td>',
            '<td data-title="Remark" data-value="{{Remark}}">{{Remark}}</td>',
            '<td data-title="ImagePath" data-value="{{ImagePath}}">{{ImageItem}}</td>',
            '<td data-title="Status" data-value="{{Status}}">{{Status}}</td>',
            '</tr>',
        ].join(""),

        Module_Line: [
            '<div class="femi-property-item">',
            '<label class= "m-detail-title"> 修程</label >',
            '<label for="modal_select_Config"></label>',
            '<select id="modal_select_Config" data-name="Config" class="selectpicker bla bla bli form-control" data-live-search="true" style="display: none;">',
            '<option value="修程">修程</option>',

            '</select><div class="btn-group bootstrap-select bla bli form-control">',
            '<button type="button" class="btn dropdown-toggle selectpicker btn-default" data-toggle="dropdown" data-id="modal_select_Config" title="修程">',
            '<span class="filter-option pull-left LineID">修程</span>&nbsp;<span class="caret"></span></button><div class="dropdown-menu open">',
            '<div class="bootstrap-select-searchbox">',
            '<input type="text" class="input-block-level form-control"></div>',
            '<ul class="dropdown-menu inner selectpicker" role="menu">',
            '{{ITEM}}',
            '</ul></div></div></div>',
        ].join(""),
        ITEM_Line: [
            '<li rel="0" class="selected"><a tabindex="0" class="" style="">',
            '<span class="text">{{LineName}}</span>',
            '<i class="glyphicon glyphicon-ok icon-ok check-mark"></i></a>',
            '</li>',
        ].join(""),
        IMGLIST: '<img src= "{{SrcList}}" data-source="{{SrcList}}" style="width:25px;height:25px;"/>',
        IMG: '<li class="upload-img"><img src="{{Src}}" data-id="{{Id}}" data-source="{{Src}}" class="image-show"></li>',
        Photo: [
            '<div class="lmvt-show-photo" style="position: fixed;z-index: 2001;top: 0;right: 0;left: 0;bottom: 0;background: rgba(0, 0, 0, 0.5);text-align: center">',
            '<svg t="1562913698052" class="lmvt-remove-photo" style="position:absolute;top:10;right:10" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2620" width="50" height="50"><path d="M684.642617 277.598412l-1.436722-1.467421c-12.489452-12.461823-32.730449-12.461823-45.159526 0L479.700991 434.510138l-158.286026-158.315702c-12.555967-12.524245-32.793894-12.524245-45.225017 0-12.555967 12.462846-12.555967 32.701796 0 45.223994l158.348448 158.317749L276.129573 638.049834c-12.495592 12.429077-12.495592 32.671097 0 45.163619l1.49812 1.434675c12.429077 12.494569 32.66905 12.494569 45.221948 0l158.287049-158.286026 158.283979 158.286026c12.491499 12.494569 32.731472 12.494569 45.220924 0 12.495592-12.493545 12.495592-32.731472 0-45.222971l-158.285003-158.285003 158.285003-158.314679C697.138209 310.299185 697.138209 290.060235 684.642617 277.598412" p-id="2621" fill="#e6e6e6"></path><path d="M818.88197 140.522454c-187.332573-187.363272-491.033479-187.363272-678.364005 0-187.329503 187.329503-187.329503 491.032456 0 678.362982 187.330526 187.392948 491.031433 187.392948 678.364005 0C1006.274918 631.55491 1006.274918 327.851956 818.88197 140.522454M773.656953 773.660418c-162.344458 162.343435-425.569512 162.407903-587.914994 0-162.40688-162.344458-162.40688-425.602258 0-587.914994 162.344458-162.40688 425.569512-162.40688 587.914994 0C936.063833 348.059184 936.000388 611.31596 773.656953 773.660418" p-id="2622" fill="#e6e6e6"></path></svg>',
            '<div data-index="0" class="lmvt-change-photo" style="position: fixed;top: 60px;right: 60px;left: 60px;bottom: 60px;background-size:100% 100%;width: auto;height: auto;">',
            // '<img class="zacelmvt-img" style="position: fixed;top: 60px;right: 60px;left: 60px;bottom: 60px;background-size:auto 100%;width: auto;height: auto;" />',
            '</div>',
            '<div class="lmvt-bottom">',
            '<div class="lmvt-bottom-left">',
            '<svg t="1562913570901" class="icon" style="float:left;margin-left:10px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1103" width="30" height="30">',
            '<path d="M512 0a512 512 0 1 0 512 512 512 512 0 0 0-512-512z m0 896a384 384 0 1 1 384-384 384 384 0 0 1-384 384z" fill="#e6e6e6" p-id="1104"></path>',
            '<path d="M493.44 247.04a64 64 0 0 0-90.88 90.88L576 512l-173.44 174.08a64 64 0 0 0 90.88 90.88l219.52-219.52a64 64 0 0 0 0-90.88z" fill="#e6e6e6" p-id="1105"></path></svg>',
            '</div>',
            '<div class="lmvt-bottom-right">',
            '<svg t="1562912869524" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" ',
            ' p-id="1469" width="30" style="float:right;margin-right:10px" height="30"><path d="M512 0a512 512 0 1 0 512 512 512 512 0 0 0-512-512z m0 896a384 384 0 1 1 384-384 384 384 0 0 1-384 384z" ',
            ' fill="#e6e6e6" p-id="1470"></path><path d="M616.96 272.64a58.24 58.24 0 0 0-81.92 0l-198.4 198.4a58.88 58.88 0 0 0 0 81.92l198.4 198.4a58.24 58.24 0 1 0 81.92-81.92L459.52 512l157.44-157.44a58.24 58.24 0 0 0 0-81.92z" fill="#e6e6e6" p-id="1471"></path></svg>',
            '</div>',
            '</div>',
            '</div>',
        ].join(""),
    },

        // SupplierName: SelectData[0].SupplierName,
        // SupplierProductNo: SelectData[0].SupplierProductNo,
        (function () {
            KEYWORD_Level_LIST = [
                "Code|编码",
                "Name|名称",
                "Config|部件类型|ArrayOne",
                "SupplierPartNo|部件编号",
                "LineID|修程|ArrayOne",
                "LineReadonly|修程|Readonly",
                "ProductNoName|车型|ArrayOne",
                "ProductReadonly|车型|Readonly",
                "SupplierNameReadonly|部件厂家|Readonly",
                "SupplierProductNoReadonly|部件型号|Readonly",
                "SupplierNameSelect|部件厂家|ArrayOne",
                "SupplierProductNoSelect|部件型号|ArrayOne",

                "SupplierName|部件厂家",
                "SupplierProductNo|部件型号",

                // "PartNo|车号|Readonly",
                // "CustomerID|配属局段|ArrayOne",
                // "CustomerReadonly|配属局段|Readonly",
                "Certificate|是否有合格证|ArrayOne",
                "Record|电子履历|ArrayOne",
                "QRCode|是否有二维码|ArrayOne",

                "Result|是否合格|ArrayOne",
                "Remark|备注",

                "MaterialID|物料|ArrayOne",
                "UnitID|单位|ArrayOne",
                "EditTime|编辑时间|DateTime",
                "Active|状态|ArrayOne",
                "Status|状态|ArrayOne",
                "StartTime|入库开始日期|Date",
                "EndTime|入库截止日期|Date",
                "EditTime|编辑时间|DateTime",
                "AuditTime|审批时间|DateTime",
                "AuditorID|审批人|ArrayOne",
                "EditorID|编辑人|ArrayOne",

            ];

            KEYWORD_Level = {};
            FORMATTRT_Level = {};

            DEFAULT_VALUE_Level = {
                LineID: 0,
                ProductNoName: "",
                CustomerID: 0,
                MaterialID: 0,
                UnitID: 0,
            };

            TypeSource_Level = {
                Result: [
                    {
                        name: "否",
                        value: 0
                    }, {
                        name: "是",
                        value: 1
                    }
                ],
                Certificate: [
                    {
                        name: "否",
                        value: 0
                    }, {
                        name: "是",
                        value: 1
                    }
                ],
                Record: [
                    {
                        name: "否",
                        value: 0
                    }, {
                        name: "是",
                        value: 1
                    }
                ],
                QRCode: [
                    {
                        name: "否",
                        value: 0
                    }, {
                        name: "是",
                        value: 1
                    }
                ],
                SupplierNameSelect: [
                    {
                        name: "无",
                        value: 0
                    }
                ],
                SupplierProductNoSelect: [
                    {
                        name: "无",
                        value: 0
                    }
                ],
                Config: [
                    {
                        name: "无",
                        value: 0
                    }
                ],
                LineID: [
                    {
                        name: "无",
                        value: 0
                    }
                ],
                CustomerID: [
                    {
                        name: "无",
                        value: 0
                    }
                ],
                MaterialID: [
                    {
                        name: "无",
                        value: 0
                    }
                ],
                UnitID: [
                    {
                        name: "无",
                        value: 0
                    }
                ],
                EditorID: [
                    {
                        name: "无",
                        value: 0
                    },
                ],
                AuditorID: [
                    {
                        name: "无",
                        value: 0
                    },
                ],
                ProductNoName: [
                    {
                        name: "无",
                        value: 0
                    }
                ],
                Status: [
                    {
                        name: "已保存",
                        value: 1
                    },
                    {
                        name: "已提交",
                        value: 2
                    },
                    {
                        name: "已审批",
                        value: 3
                    },
                    {
                        name: "已驳回",
                        value: 4
                    },
                    {
                        name: "已取消",
                        value: 5
                    },
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

    (function () {
        KEYWORD_LIST = [
            "Code|部件编码",
            "Name|部件名称",
            "SupplierPartNo|部件编号",
            "SupplierName|部件厂家",
            "SupplierProductNo|部件型号",
            "LineName|修程",
            "CustomerName|配属局段",
            "ProductNo|车型",
            "PartNo|车号",
            "MaterialName|物料名称",
            "UnitText|单位名称",
        ];
        KEYWORD = {};
        KEYWORD_LIST.forEach(function (item, i) {
            var detail = item.split("|");
            KEYWORD[detail[0]] = {
                index: i,
                name: detail[1]
            };
        });
    })();

    model = $com.Model.create({
        name: '部件入库',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },
        events: function () {
            $("body").delegate("#zace-refresh-po", "click", function () {

                model.com.refresh();


            });
            // 
            $("body").delegate("#zace-searchAll-level", "click", function () {
                var default_value = {
                    Active: 1,
                    //Position: 0,
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
                    var value = $("#zace-search-level").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-riskLevel-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "ID");
                }
            });
            //部件表查询
            $("body").delegate("#zace-searchAll", "click", function () {
                var value = $("#zace-search-level").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "ID");
            });

            //部件表新增
            // $("body").delegate("#zace-add-level", "click", function () {
            //     DEFAULT_VALUE = {
            //         Config: 0,
            //         SupplierName: "",
            //         SupplierProductNo: "",
            //         SupplierPartNo: "",
            //         Certificate: 0,
            //         Record: 0,
            //         QRCode: 0,
            //     }
            //     $("body").append($com.modal.show(DEFAULT_VALUE, KEYWORD_Level, "入库检录入", function (rst) {
            //         //调用插入函数 
            //         if (!rst || $.isEmptyObject(rst))
            //             return;
            //         // PositionTemp.Code = rst.Config;
            //         PositionTemp.Name = rst.Config;
            //         PositionTemp.SupplierName = rst.SupplierName;
            //         PositionTemp.SupplierProductNo = rst.SupplierProductNo;
            //         PositionTemp.SupplierPartNo = rst.SupplierPartNo;
            //         PositionTemp.Certificate = Number(rst.Certificate);
            //         PositionTemp.Record = Number(rst.Record);
            //         PositionTemp.QRCode = Number(rst.QRCode);
            //         PositionTemp.Type = 2;
            //         PositionTemp.Number = 2;
            //         for (var j = 0; j < DATABasic.length; j++) {
            //             if (PositionTemp.Name == DATABasic[j].Name) {
            //                 alert("该部件已录入！");
            //                 return false;
            //             }
            //         }
            //         for (var i = 0; i < mConfig.length; i++) {
            //             if (PositionTemp.Name == mConfig[i].Name) {
            //                 PositionTemp.Code = mConfig[i].Code;
            //             }
            //         }
            //         // PositionTemp.Code = "CM000001";
            //         //提交 部件库 编码 是否有合格证 是否有履历 是否有二维码

            //         //1.提交后接口能拿到对应的修程 车号 物料。。。。直接赋值然后提交


            //         //2.提交后接口不能拿到对应的修程 车号 物料。。。。然后自己选
            //         $("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "入库检录入", function (rst) {
            //             //调用插入函数 
            //             if (!rst || $.isEmptyObject(rst))
            //                 return;
            //             PositionTemp.LineID = Number(rst.LineID);
            //             PositionTemp.ProductNo = rst.ProductNo;
            //             PositionTemp.CustomerID = Number(rst.CustomerID);
            //             PositionTemp.MaterialID = Number(rst.MaterialID);
            //             PositionTemp.UnitID = Number(rst.UnitID);
            //             model.com.UpdateItem({
            //                 data: PositionTemp,
            //             }, function (res) {
            //                 alert("新增成功");
            //                 model.com.refresh();
            //             })

            //         }, TypeSource_Level));

            //     }, TypeSource_Level));


            // });
            //部件表修改
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
                if (SelectData[0].Status != 1) {
                    alert("请选择已保存数据！")
                    return;
                }
                for (var i = 0; i < mConfig.length; i++) {
                    if (mConfig[i].Code == SelectData[0].Code) {
                        SelectData[0].Config = mConfig[i].ID;
                    }
                }

                var default_value = {
                    Config: SelectData[0].Config,
                    LineID: SelectData[0].LineID,
                    ProductNoName: SelectData[0].ProductNo,
                    CustomerID: SelectData[0].CustomerID,
                    MaterialID: SelectData[0].MaterialID,
                    UnitID: SelectData[0].UnitID,

                    SupplierName: SelectData[0].SupplierName,
                    SupplierProductNo: SelectData[0].SupplierProductNo,
                    SupplierPartNo: SelectData[0].SupplierPartNo,
                    Certificate: SelectData[0].Certificate,
                    Record: SelectData[0].Record,
                    QRCode: SelectData[0].QRCode,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    // SelectData[0].Code = "MSS20200001";
                    SelectData[0].Name = rst.Config;
                    SelectData[0].LineID = Number(rst.LineID);
                    // SelectData[0].ProductNo = rst.ProductNoName;
                    SelectData[0].CustomerID = Number(rst.CustomerID);
                    SelectData[0].MaterialID = Number(rst.MaterialID);
                    SelectData[0].UnitID = Number(rst.UnitID);

                    SelectData[0].SupplierName = rst.SupplierName;
                    SelectData[0].SupplierProductNo = rst.SupplierProductNo;
                    SelectData[0].SupplierPartNo = rst.SupplierPartNo;
                    SelectData[0].Certificate = Number(rst.Certificate);
                    SelectData[0].Record = Number(rst.Record);
                    SelectData[0].QRCode = Number(rst.QRCode);

                    deleteArray = [];
                    for (var i = 0; i < mConfigEdite.length; i++) {
                        if (SelectData[0].ID != mConfigEdite[i].ID) {
                            deleteArray.push(mConfigEdite[i]);
                        }
                    }
                    for (var j = 0; j < deleteArray.length; j++) {
                        if (deleteArray[j].Name == SelectData[0].Name) {
                            alert("已录入部件重复！");
                            return false;
                        }
                    }
                    for (var i = 0; i < SelectData.length; i++) {

                        $com.util.deleteLowerProperty(SelectData[i]);
                    }
                    model.com.UpdateItem({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                    });

                }, TypeSource_Level));


            });
            $("body").delegate("#zace-Device-searchface", "click", function () {
                mDefault_Value_Modal = {
                    "StartTime": $com.util.format("yyyy-MM-dd", new Date().getTime() - 7 * 24 * 3600 * 1000),
                    "EndTime": $com.util.format("yyyy-MM-dd", new Date().getTime()),
                };
                $("body").append($com.modal.show(mDefault_Value_Modal, KEYWORD_Level, "查询", function (rst) {
                    if (!rst || $.isEmptyObject(rst)) {
                        return false;
                    }
                    StartTime = $com.util.format("yyyy-MM-dd", rst.StartTime);
                    EndTime = $com.util.format("yyyy-MM-dd", rst.EndTime);
                    model.com.refresh();

                }, TypeSource_Level));
            });
            //部件表提交
            $("body").delegate("#zace-edit-Submit", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }

                if (SelectData[0].Status != 1) {
                    alert("请选择已保存数据！")
                    return;
                }
                if (SelectData[0].Status == 1) {
                    SelectData[0].Status = 3;
                }
                $com.util.deleteLowerProperty(SelectData[0]);
                model.com.UpdateItem({
                    data: SelectData[0]
                }, function (res) {
                    alert("提交成功");
                    model.com.refresh();
                })

            });
            //部件表取消
            $("body").delegate("#zace-edit-cancel", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                if (SelectData[0].Status != 2) {
                    alert("请选择已保存数据！")
                    return;
                }
                if (SelectData[0].Status == 2) {
                    SelectData[0].Status = 5;
                }
                $com.util.deleteLowerProperty(SelectData[0]);
                model.com.UpdateItem({
                    data: SelectData[0],
                }, function (res) {
                    alert("取消成功");
                    model.com.refresh();
                })

            });
            //部件表驳回
            $("body").delegate("#zace-edit-reject", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                if (SelectData[0].Status != 2) {
                    alert("请选择已提交数据！")
                    return;
                }
                if (SelectData[0].Status == 2) {
                    SelectData[0].Status = 4;
                }
                $com.util.deleteLowerProperty(SelectData[0]);
                model.com.UpdateItem({
                    data: SelectData[0]
                }, function (res) {
                    alert("驳回成功");
                    model.com.refresh();
                })
            });
            //部件表审批
            $("body").delegate("#zace-edit-Approval", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                if (SelectData[0].Status != 2) {
                    alert("请选择已提交数据！")
                    return;
                }
                if (SelectData[0].Status == 2) {
                    SelectData[0].Status = 3;
                }
                $com.util.deleteLowerProperty(SelectData[0]);
                model.com.UpdateItem({
                    data: SelectData[0]
                }, function (res) {
                    alert("审批成功");
                    model.com.refresh();
                })
            });
            //部件表删除
            $("body").delegate("#zace-edit-delete", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                if (SelectData[0].Status != 1) {
                    alert("请选择已保存数据！")
                    return;
                }
                $com.util.deleteLowerProperty(SelectData[0]);
                model.com.DeleteItem({
                    data: SelectData[0]
                }, function (res) {
                    alert("删除成功");
                    model.com.refresh();
                })

            });
            //部件录入申请
            $("body").delegate("#zace-add-level", "click", function () {
                $(".zzzb").show();
                $(".zzzb").width("20%");
                $(".zzzc").width("80%");
                mEditPartItem = {
                    Config: 0,
                    SupplierPartNo: "",
                    Certificate: 0,
                    Record: 0,
                    QRCode: 0,
                    Result: 0,
                    Remark: "",
                };
                $com.propertyGrid.show($("#Typetable-task1"), mEditPartItem, KEYWORD_Level, TypeSource_Level);
                $(".propertyGrid").append('<div class="m-c-panel" id="imagesUpload"><div class="m-c-head">上传图片</div><div class="m-c-body m-c-upload clearfix"><ul class="upload-list"><li class="upload-btn"><input type="file" class="uploadImageZac"></li></ul></div></div>');
                mAllowSubmt = false;
            });
            //部件录入隐藏
            $("body").delegate("#zace-usehide", "click", function () {
                $(".zzzb").hide();
                $(".zzzc").width("100%");
            });

            var AllowSubmit = function () {
                if (mEditPartItem == null)
                    return false;

                if (wPrePartItem.length == 1) {
                    return true;
                } else {
                    if (!mEditPartItem.Config || mEditPartItem.Config <= 0)
                        return false;

                    // if (!mEditPartItem.LineID || mEditPartItem.LineID <= 0)
                    //     return false;

                    // if (!mEditPartItem.ProductNoName || mEditPartItem.ProductNoName.length <= 0)
                    //     return false;

                    // if (!mEditPartItem.SupplierNameSelect || mEditPartItem.SupplierNameSelect.length <= 0) {
                    //     return false;
                    // }
                    // if (!mEditPartItem.SupplierNameSelect || mEditPartItem.SupplierNameSelect.length <= 0) {
                    //     return false;
                    // }

                    if (!mEditPartItem.SupplierPartNo || mEditPartItem.SupplierPartNo.length <= 0)
                        return false;

                    return true;
                }
            }

            $("body").delegate(".propertyGrid .femi-property-item  #modal_select_Config", "change", function () {
                // mEditPartItem.Config = xxx;

                var $this = $(this),
                    name = $this.attr("data-name"),
                    value = $this.val();

                if (Number(value) == mEditPartItem[name]) {
                    return;
                }

                function NotFound() {
                    var default_value = {
                        Config: mEditPartItem.Config,
                        SupplierPartNo: mEditPartItem.SupplierPartNo,
                        Certificate: mEditPartItem.Certificate,
                        Record: mEditPartItem.Record,
                        QRCode: mEditPartItem.QRCode,
                        Result: mEditPartItem.Result,
                        Remark: mEditPartItem.Remark,
                    };

                    mEditPartItem_Order = {};
                    mEditPartItem = default_value;

                    if (mEditPartItem.Config != 0) {
                        if (default_value.SupplierPartNo && default_value.SupplierPartNo.trim().length > 0 && mEditPartItem.Config != 0) {
                            default_value.LineID = -1;
                            default_value.ProductNoName = "";
                        }
                        model.com.getPartConfigDetails({ PartConfigNo: TypeObj[mEditPartItem.Config].Code }, function (res) {
                            wLine = res.LineList;
                            wProduct = res.ProductList;
                            //车型
                            TypeSource_Level.ProductNoName.splice(1, TypeSource_Level.ProductNoName.length)
                            $.each(wProduct, function (i, item) {
                                TypeSource_Level.ProductNoName.push({
                                    name: item.Name,
                                    value: item.Name,
                                    far: 0
                                })
                            });
                            //修程
                            TypeSource_Level.LineID.splice(1, TypeSource_Level.LineID.length)
                            $.each(wLine, function (i, item) {
                                TypeSource_Level.LineID.push({
                                    name: item.Name,
                                    value: item.ID,
                                    far: 0
                                });
                            });
                            mTempTypeSource = $com.util.Clone(TypeSource_Level);
                            var newObject = jQuery.extend({}, $("#imagesUpload"));
                            $com.propertyGrid.show($("#Typetable-task1"), default_value, KEYWORD_Level, mTempTypeSource);
                            $(".propertyGrid").append($(newObject[0]));
                            // mTempTypeSource = $com.util.Clone(TypeSource_Level);
                            // var Clone=$com.util.Clone($("#imagesUpload"));
                            // $com.propertyGrid.show($("#Typetable-task1"), default_value, KEYWORD_Level, mTempTypeSource);
                            // $(".propertyGrid").append(Clone);
                            mAllowSubmt = AllowSubmit();

                            if (wPrePartItem.length == 1) {
                                mAllowSubmt = true;
                                mEditPartItem_Order = wPrePartItem[0];
                                if (mEditPartItem_Order.UnitID == 0 && mEditPartItem_Orde.UnitID) {
                                    mEditPartItem_Order.UnitText = "-";
                                }
                                //直接插入文本框
                                model.com.render(mEditPartItem_Order);
                            }
                            $("body .propertyGrid .femi-property-item  #modal_select_LineID").change();
                        });
                    } else {
                        $com.propertyGrid.show($("#Typetable-task1"), default_value, KEYWORD_Level, mTempTypeSource);
                        mAllowSubmt = AllowSubmit();
                        if (wPrePartItem.length == 1) {
                            mAllowSubmt = true;
                            mEditPartItem_Order = wPrePartItem[0];
                            if (mEditPartItem_Order.UnitID == 0 && mEditPartItem_Order.UnitID) {
                                mEditPartItem_Order.UnitText = "-";
                            }
                            //直接插入文本框
                            model.com.render(mEditPartItem_Order);
                        }
                    }
                }
                mEditPartItem[name] = Number(value);

                if (mEditPartItem.SupplierPartNo && mEditPartItem.SupplierPartNo.length > 0 && mEditPartItem.Config != 0) {
                    //调用接口
                    model.com.getPrePartItemList({
                        Code: TypeObj[mEditPartItem.Config].Code, SuplierPartNo: mEditPartItem.SupplierPartNo, LineID: -1, ProductID: -1
                    }, function (res) {
                        wPrePartItem = res.list;
                        $com.util.deleteLowerProperty(wPrePartItem);
                        NotFound();
                    });
                    //pengyouwang  jiekou
                    //是否一个 否 NotFound();
                    //是 填充所有数据到Property控件下部 （PartNo  LineID Product CustomerID SuplierName SuplierProductNo）且 填充数据到mEditPartItem中
                } else {
                    NotFound();
                }

            });
            $("body").delegate(".propertyGrid .femi-property-item  input[data-name=SupplierPartNo]", "input propertychange", function () {

                var $this = $(this),
                    name = $this.attr("data-name"),
                    value = $this.val();
                if (value == mEditPartItem[name]) {
                    return;
                }
                mEditPartItem[name] = value;
                mTempTypeSource = $com.util.Clone(TypeSource_Level);
                function NotFound() {
                    var default_value = {
                        Config: mEditPartItem.Config,
                        SupplierPartNo: mEditPartItem.SupplierPartNo,
                        Certificate: mEditPartItem.Certificate,
                        Record: mEditPartItem.Record,
                        QRCode: mEditPartItem.QRCode,
                        Result: mEditPartItem.Result,
                        Remark: mEditPartItem.Remark,
                    };
                    mEditPartItem_Order = {};
                    if (default_value.Config && default_value.Config > 0 && default_value.SupplierPartNo != "") {
                        default_value.LineID = -1;
                        default_value.ProductNoName = "";
                    }

                    mEditPartItem = default_value;

                    var newObject = jQuery.extend({}, $("#imagesUpload"));
                    $com.propertyGrid.show($("#Typetable-task1"), default_value, KEYWORD_Level, mTempTypeSource);
                    $(".propertyGrid").append($(newObject[0]));
                    // $com.propertyGrid.show($("#Typetable-task1"), default_value, KEYWORD_Level, mTempTypeSource);
                    mAllowSubmt = AllowSubmit();

                    $("body .propertyGrid .femi-property-item  #modal_select_LineID").change();
                }
                mEditPartItem[name] = value;
                if (mEditPartItem.Config && mEditPartItem.Config > 0 && mEditPartItem.SupplierPartNo != "") {
                    //调用接口
                    model.com.getPrePartItemList({
                        Code: TypeObj[mEditPartItem.Config].Code, SuplierPartNo: mEditPartItem.SupplierPartNo, LineID: -1, ProductID: -1
                    }, function (res) {
                        wPrePartItem = res.list;
                        $com.util.deleteLowerProperty(wPrePartItem);
                        NotFound();
                        mAllowSubmt = true;
                        mEditPartItem_Order = wPrePartItem[0];
                        if (mEditPartItem_Order.UnitID == 0 && mEditPartItem_Order.UnitID) {
                            mEditPartItem_Order.UnitText = "-";
                        }
                        //直接插入文本框
                        model.com.render(mEditPartItem_Order);
                    });
                    //pengyouwang  jiekou
                    //是否一个 否 NotFound();
                    //是 填充所有数据到Property控件下部 （PartNo  LineID Product CustomerID SuplierName SuplierProductNo）且 填充数据到mEditPartItem中 后执行mAllowSubmt=AllowSubmit();
                } else {
                    NotFound();
                }
            });
            $("body").delegate(".propertyGrid .femi-property-item  #modal_select_LineID", "change", function () {
                var $this = $(this),
                    name = $this.attr("data-name"),
                    value = $this.val();
                if (Number(value) == mEditPartItem[name]) {
                    return;
                }
                mEditPartItem[name] = Number(value);

                function NotFound() {
                    var default_value = {
                        Config: mEditPartItem.Config,
                        LineID: mEditPartItem.LineID,
                        ProductNoName: mEditPartItem.ProductNoName,
                        SupplierPartNo: mEditPartItem.SupplierPartNo,
                        Certificate: mEditPartItem.Certificate,
                        Record: mEditPartItem.Record,
                        QRCode: mEditPartItem.QRCode,
                        Result: mEditPartItem.Result,
                        Remark: mEditPartItem.Remark,
                        // SupplierNameSelect: "",
                        // SupplierProductNoSelect: "",
                    };
                    mEditPartItem_Order = {};
                    mEditPartItem = default_value;

                    //   model.com.getConfigAll({ PartConfigNo: "", PartConfigName: "", Active: -1 ,ProductNo:"",CustomerID:-1,LineID:-1}, function (resP) {
                    // model.com.getConfigAll({ PartConfigNo: TypeObj[mEditPartItem.Config].Code,  PartConfigName:TypeObj[mEditPartItem.Config].Name,LineID: mEditPartItem.LineID ,Active: 1}, function (res) {
                    model.com.getConfigAll({ PartConfigNo: TypeObj[mEditPartItem.Config].Code, LineID: mEditPartItem.LineID, Active: 1 }, function (res) {

                        wProduct = res.list;

                        TypeSource_Level.ProductNoName.splice(1, TypeSource_Level.ProductNoName.length);
                        TypeSource_Level.SupplierNameSelect.splice(1, TypeSource_Level.SupplierNameSelect.length)
                        TypeSource_Level.SupplierProductNoSelect.splice(1, TypeSource_Level.SupplierProductNoSelect.length);

                        $.each(wProduct, function (i, item) {
                            TypeSource_Level.ProductNoName.push({
                                name: item.ProductNo,
                                value: item.ProductNo,
                                far: 0
                            });
                            $.each(item.SupplierList, function (j, item_j) {
                                TypeSource_Level.SupplierNameSelect.push({
                                    name: item_j.ItemName,
                                    value: item_j.ItemName,
                                    far: 0
                                });
                                TypeSource_Level.SupplierProductNoSelect.push({
                                    name: item_j.ItemText,
                                    value: item_j.ItemText,
                                    far: 0
                                });
                            });
                        });

                        TypeSource_Level.ProductNoName = model.com.uniqueSuppiler(TypeSource_Level.ProductNoName);
                        TypeSource_Level.SupplierNameSelect = model.com.uniqueSuppiler(TypeSource_Level.SupplierNameSelect);
                        TypeSource_Level.SupplierProductNoSelect = model.com.uniqueSuppiler(TypeSource_Level.SupplierProductNoSelect);

                        //if (default_value.ProductNoName != "0" && default_value.ProductNoName.trim().length > 0 && mEditPartItem.LineID != 0) {
                        //并且default_value.ProductNoName 存在于mTempTypeSource.ProductNoName 中
                        default_value.SupplierNameSelect = "";
                        default_value.SupplierProductNoSelect = "";
                        //}

                        mTempTypeSource = $com.util.Clone(TypeSource_Level);
                        var newObject = jQuery.extend({}, $("#imagesUpload"));
                        $com.propertyGrid.show($("#Typetable-task1"), default_value, KEYWORD_Level, mTempTypeSource);
                        $(".propertyGrid").append($(newObject[0]));
                        // $com.propertyGrid.show($("#Typetable-task1"), default_value, KEYWORD_Level, mTempTypeSource);
                        mAllowSubmt = AllowSubmit();
                        if (wPrePartItem.length == 1) {
                            mAllowSubmt = true;
                            mEditPartItem_Order = wPrePartItem[0];
                            if (mEditPartItem_Order.UnitID == 0 && mEditPartItem_Order.UnitID) {
                                mEditPartItem_Order.UnitText = "-";
                            }
                            //直接插入文本框
                            model.com.render(mEditPartItem_Order);
                        }
                    });


                }
                mEditPartItem[name] = Number(value);
                if (mEditPartItem.SupplierPartNo && mEditPartItem.SupplierPartNo.length > 0 && mEditPartItem.Config && mEditPartItem.Config > 0) {
                    //调用接口
                    model.com.getPrePartItemList({
                        Code: TypeObj[mEditPartItem.Config].Code, SuplierPartNo: mEditPartItem.SupplierPartNo, LineID: mEditPartItem.LineID, ProductID: -1
                    }, function (res) {
                        wPrePartItem = res.list;
                        NotFound();
                    });
                    //是否一个 否 NotFound();
                    //是 填充所有数据到Property控件下部 （PartNo  LineID Product CustomerID SuplierName SuplierProductNo）且 填充数据到mEditPartItem中   mAllowSubmt=AllowSubmit();
                } else {
                    NotFound();
                }

            });
            $("body").delegate(".propertyGrid .femi-property-item  #modal_select_ProductNoName", "change", function () {
                var $this = $(this),
                    name = $this.attr("data-name"),
                    value = $this.val();

                if (value == mEditPartItem[name]) {
                    return;
                }
                mEditPartItem[name] = value;

                function NotFound() {
                    var default_value = {
                        Config: mEditPartItem.Config,
                        LineID: mEditPartItem.LineID,
                        ProductNoName: mEditPartItem.ProductNoName,
                        SupplierPartNo: mEditPartItem.SupplierPartNo,
                        Certificate: mEditPartItem.Certificate,
                        Record: mEditPartItem.Record,
                        QRCode: mEditPartItem.QRCode,
                        Result: mEditPartItem.Result,
                        Remark: mEditPartItem.Remark,
                    };
                    mEditPartItem_Order = {};
                    mEditPartItem = default_value;
                    // Active: 1 
                    model.com.getConfigAll({ PartConfigNo: TypeObj[mEditPartItem.Config].Code, ProductNo: mEditPartItem.ProductNoName, Active: 1 }, function (res) {

                        // if (default_value.LineID && default_value.LineID > 0) {
                        //     // //并且default_value.LineID 存在于mTempTypeSource.LineID 中
                        //     default_value.SupplierName = "";
                        //     default_value.SupplierProductNo = "";
                        // }
                        // TypeSource_Level.LineID.splice(1, TypeSource_Level.LineID.length);
                        TypeSource_Level.SupplierNameSelect.splice(1, TypeSource_Level.SupplierNameSelect.length)
                        TypeSource_Level.SupplierProductNoSelect.splice(1, TypeSource_Level.SupplierProductNoSelect.length)
                        $.each(res.list, function (i, item) {
                            // TypeSource_Level.LineID.push({
                            //     name: item.LineName,
                            //     value: item.LineID,
                            //     far: 0
                            // });
                            $.each(item.SupplierList, function (j, item_j) {
                                TypeSource_Level.SupplierNameSelect.push({
                                    name: item_j.ItemName,
                                    value: item_j.ItemName,
                                    far: 0
                                });

                                TypeSource_Level.SupplierProductNoSelect.push({
                                    name: item_j.ItemText,
                                    value: item_j.ItemText,
                                    far: 0
                                });
                            });
                        });

                        TypeSource_Level.SupplierNameSelect = model.com.uniqueSuppiler(TypeSource_Level.SupplierNameSelect);
                        TypeSource_Level.SupplierProductNoSelect = model.com.uniqueSuppiler(TypeSource_Level.SupplierProductNoSelect);
                        //if (default_value.LineID && default_value.LineID > 0 && default_value.ProductNoName != "0") {
                        //并且default_value.ProductNoName 存在于mTempTypeSource.ProductNoName 中
                        default_value.SupplierNameSelect = "";
                        default_value.SupplierProductNoSelect = "";
                        //}

                        mTempTypeSource = $com.util.Clone(TypeSource_Level);
                        var newObject = jQuery.extend({}, $("#imagesUpload"));
                        $com.propertyGrid.show($("#Typetable-task1"), default_value, KEYWORD_Level, mTempTypeSource);
                        $(".propertyGrid").append($(newObject[0]));
                        // $com.propertyGrid.show($("#Typetable-task1"), default_value, KEYWORD_Level, mTempTypeSource);
                        mAllowSubmt = AllowSubmit();
                        if (wPrePartItem.length == 1) {
                            mAllowSubmt = true;
                            mEditPartItem_Order = wPrePartItem[0];
                            if (mEditPartItem_Order.UnitID == 0 && mEditPartItem_Order.UnitID) {
                                mEditPartItem_Order.UnitText = "-";
                            }
                            //直接插入文本框
                            model.com.render(mEditPartItem_Order);
                        }
                    });


                }
                mEditPartItem[name] = value;
                if (mEditPartItem.SupplierPartNo && mEditPartItem.SupplierPartNo.length > 0 && mEditPartItem.Config && mEditPartItem.Config > 0) {
                    mProductID = -1;
                    if (mEditPartItem.ProductNoName && mEditPartItem.ProductNoName != "") {
                        mProductID = ProductID_Name[mEditPartItem.ProductNoName].ID;
                    }
                    //调用接口
                    model.com.getPrePartItemList({
                        Code: TypeObj[mEditPartItem.Config].Code, SuplierPartNo: mEditPartItem.SupplierPartNo, LineID: mEditPartItem.LineID, ProductID: mProductID
                    }, function (res) {
                        wPrePartItem = res.list;
                        NotFound();
                    });
                    //是否一个 否 NotFound();
                    //是 填充所有数据到Property控件下部 （PartNo  LineID Product CustomerID SuplierName SuplierProductNo）且 填充数据到mEditPartItem中   mAllowSubmt=AllowSubmit();
                } else {
                    NotFound();
                }
            });
            $("body").delegate(".propertyGrid .femi-property-item  #modal_select_SupplierNameSelect", "change", function () {
                var $this = $(this),
                    name = $this.attr("data-name"),
                    value = $this.val();
                if (value == mEditPartItem[name]) {
                    return;
                }
                mEditPartItem[name] = value;
                function NotFound() {
                    var default_value = {
                        Config: mEditPartItem.Config,
                        LineID: mEditPartItem.LineID,
                        ProductNoName: mEditPartItem.ProductNoName,
                        SupplierPartNo: mEditPartItem.SupplierPartNo,
                        SupplierNameSelect: mEditPartItem.SupplierNameSelect,
                        SupplierProductNoSelect: mEditPartItem.SupplierProductNoSelect,
                        Certificate: mEditPartItem.Certificate,
                        Record: mEditPartItem.Record,
                        QRCode: mEditPartItem.QRCode,
                        Result: mEditPartItem.Result,
                        Remark: mEditPartItem.Remark,
                    };
                    mEditPartItem_Order = {};
                    mEditPartItem = default_value;


                    model.com.getConfigAll({ PartConfigNo: TypeObj[mEditPartItem.Config].Code, ProductNo: mEditPartItem.ProductNoName, LineID: mEditPartItem.LineID, Active: 1 }, function (res) {
                        //厂商==mEditPartItem[name] 的型号选项
                        // TypeSource_Level.SupplierNameSelect.splice(1, TypeSource_Level.SupplierNameSelect.length)
                        TypeSource_Level.SupplierProductNoSelect.splice(1, TypeSource_Level.SupplierProductNoSelect.length)
                        $.each(res.list, function (i, item) {
                            $.each(item.SupplierList, function (j, item_j) {
                                // TypeSource_Level.SupplierNameSelect.push({
                                //     name: item_j.ItemName,
                                //     value: item_j.ItemName,
                                //     far: 0
                                // });
                                if (item_j.ItemName == mEditPartItem.SupplierNameSelect) {
                                    TypeSource_Level.SupplierProductNoSelect.push({
                                        name: item_j.ItemText,
                                        value: item_j.ItemText,
                                        far: 0
                                    });
                                }

                            });
                        });


                        TypeSource_Level.SupplierProductNoSelect = model.com.uniqueSuppiler(TypeSource_Level.SupplierProductNoSelect);
                        mTempTypeSource = $com.util.Clone(TypeSource_Level);
                        default_value.SupplierProductNoSelect = "";
                        // $com.propertyGrid.show($("#Typetable-task1"), default_value, KEYWORD_Level, mTempTypeSource);
                        var newObject = jQuery.extend({}, $("#imagesUpload"));
                        $com.propertyGrid.show($("#Typetable-task1"), default_value, KEYWORD_Level, mTempTypeSource);
                        $(".propertyGrid").append($(newObject[0]));
                        mAllowSubmt = AllowSubmit();
                        if (wPrePartItem.length == 1) {
                            mAllowSubmt = true;
                            mEditPartItem_Order = wPrePartItem[0];
                            if (mEditPartItem_Order.UnitID && mEditPartItem_Order.UnitID) {
                                mEditPartItem_Order.UnitText = "-";
                            }
                            //直接插入文本框
                            model.com.render(mEditPartItem_Order);
                        }
                    });


                }
                mEditPartItem[name] = value;
                if (mEditPartItem.SupplierPartNo && mEditPartItem.SupplierPartNo.length > 0 && mEditPartItem.Config && mEditPartItem.Config > 0) {
                    //调用接口
                    mProductID = -1;
                    if (mEditPartItem.ProductNoName && mEditPartItem.ProductNoName != "") {
                        mProductID = ProductID_Name[mEditPartItem.ProductNoName].ID;
                    }
                    model.com.getPrePartItemList({
                        Code: TypeObj[mEditPartItem.Config].Code, SuplierPartNo: mEditPartItem.SupplierPartNo, LineID: mEditPartItem.LineID, ProductID: mProductID
                    }, function (res) {
                        wPrePartItem = res.list;

                        NotFound();

                    });
                    //是否一个 否 NotFound();
                    //是 填充所有数据到Property控件下部 （PartNo  LineID Product CustomerID SuplierName SuplierProductNo）且 填充数据到mEditPartItem中   mAllowSubmt=AllowSubmit();
                } else {
                    NotFound();
                }
            });
            $("body").delegate(".propertyGrid .femi-property-item  #modal_select_SupplierProductNoSelect", "change", function () {
                var $this = $(this),
                    name = $this.attr("data-name"),
                    value = $this.val();
                if (value == mEditPartItem[name]) {
                    return;
                }

                mEditPartItem[name] = value;
                if (mEditPartItem.SupplierPartNo && mEditPartItem.SupplierPartNo.length > 0 && mEditPartItem.Config && mEditPartItem.Config > 0) {
                    //调用接口
                    mProductID = -1;
                    if (mEditPartItem.ProductNoName && mEditPartItem.ProductNoName != "") {
                        mProductID = ProductID_Name[mEditPartItem.ProductNoName].ID;
                    }
                    model.com.getPrePartItemList({
                        Code: TypeObj[mEditPartItem.Config].Code, SuplierPartNo: mEditPartItem.SupplierPartNo, LineID: mEditPartItem.LineID, ProductID: mProductID
                    }, function (res) {
                        wPrePartItem = res.list;
                        if (wPrePartItem.length == 1) {
                            mAllowSubmt = true;
                            mEditPartItem_Order = wPrePartItem[0];
                            if (mEditPartItem_Order.UnitID == 0 && mEditPartItem_Order.UnitID) {
                                mEditPartItem_Order.UnitText = "-";
                            }
                            var default_value = {
                                Config: mEditPartItem.Config,
                                LineID: mEditPartItem.LineID,
                                ProductNoName: mEditPartItem.ProductNoName,
                                SupplierPartNo: mEditPartItem.SupplierPartNo,
                                SupplierNameSelect: mEditPartItem.SupplierNameSelect,
                                SupplierProductNoSelect: mEditPartItem.SupplierProductNoSelect,
                                Certificate: mEditPartItem.Certificate,
                                Record: mEditPartItem.Record,
                                QRCode: mEditPartItem.QRCode,
                                Result: mEditPartItem.Result,
                                Remark: mEditPartItem.Remark,
                            };
                            var newObject = jQuery.extend({}, $("#imagesUpload"));
                            $com.propertyGrid.show($("#Typetable-task1"), default_value, KEYWORD_Level, mTempTypeSource);
                            $(".propertyGrid").append($(newObject[0]));
                            // $com.propertyGrid.show($("#Typetable-task1"), default_value, KEYWORD_Level, mTempTypeSource);
                            //直接插入文本框
                            model.com.render(mEditPartItem_Order);
                        }

                    });
                    //是否一个 否 NotFound();
                    //是 填充所有数据到Property控件下部 （PartNo  LineID Product CustomerID SuplierName SuplierProductNo）且 填充数据到mEditPartItem中   mAllowSubmt=AllowSubmit();
                }

            });

            //监听input框
            $("#Test").bind('input propertychange', function () {
                alert($(this).val());
            });
            //提交数据
            $("body").delegate("#zace-useAdd", "click", function () {
                mCode = Number($("#modal_select_Config").val());
                Remark = mEditPartItem.Remark;
                Certificate = Number($("#modal_select_Certificate").val());
                Record = Number($("#modal_select_Record").val());
                QRCode = Number($("#modal_select_QRCode").val());
                Result = Number($("#modal_select_Result").val());
                SupplierName = $("#modal_select_SupplierNameSelect").siblings(".btn-group").find(".selectpicker .filter-option").text();
                SupplierProductNo = $("#modal_select_SupplierProductNoSelect").siblings(".btn-group").find(".selectpicker .filter-option").text();
                SupplierPartNo = mEditPartItem.SupplierPartNo;

                LineID = Number($("#modal_select_LineID").val());
                // CustomerID = Number($("#modal_select_CustomerID").val());
                // UnitID = Number($("#modal_select_UnitID").val());
                // MaterialID=Number($("#modal_select_MaterialID").val());
                ProductNoName = $("#modal_select_ProductNoName").siblings(".btn-group").find(".selectpicker .filter-option").text();
                ConfigInfo = [];
                for (var i = 0; i < mConfig.length; i++) {
                    if (mCode == mConfig[i].ID) {
                        ConfigInfo.push(mConfig[i]);
                    }
                }
                FilePath = [];
                $(".zzzb .zace-bg .Typetable .propertyGrid #imagesUpload .m-c-body ul.upload-list li.upload-img img").each(function (i, item) {
                    var $Image = $(item),
                        Src = $Image.attr("data-id");
                    if (!FilePath)
                        FilePath = [];
                    FilePath.push(Src);
                });
                if (mCode == 0) {
                    alert("请填写部件类型!");
                    return false;
                }
                if (SupplierPartNo == "") {
                    alert("请填写部件编号!");
                    return false;
                }
                if (SupplierName == "") {
                    alert("请选择部件厂家!");
                    return false;
                }
                if (SupplierProductNo == "") {
                    alert("请选择部件型号!");
                    return false;
                }

                PositionTemp = {
                    ID: 0,
                    Code: ConfigInfo[0].Code,
                    LineID: LineID,
                    ProductNo: ProductNoName,
                    CustomerID: ConfigInfo[0].CustomerID,
                    MaterialID: ConfigInfo[0].MaterialID,
                    UnitID: ConfigInfo[0].UnitID,
                    EditorID: 0,
                    EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                    Type: 2,
                    Number: 2,
                    SupplierName: SupplierName,
                    SupplierProductNo: SupplierProductNo,
                    SupplierPartNo: SupplierPartNo,
                    OrderID: 0,
                    OrderNo: "",
                    Status: 1,
                    AuditorID: 0,
                    AuditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                    Certificate: Certificate,
                    Record: Record,
                    QRCode: QRCode,
                    PartNo: "",
                    Result: Result,
                    Remark: Remark,
                    ImagePath: FilePath,
                };
                if (wPrePartItem.length == 1) {
                    PositionTemp.Code = wPrePartItem[0].Code;
                    // PositionTemp.SupplierPartNo = wPrePartItem[0].SupplierPartNo;
                    PositionTemp.Type = 1;
                    PositionTemp.Type = 1;
                    PositionTemp.Number = 1;
                    PositionTemp.OrderID = wPrePartItem[0].OrderID;
                    PositionTemp.OrderNo = wPrePartItem[0].OrderNo;
                    PositionTemp.PartNo = wPrePartItem[0].PartNo;
                    PositionTemp.LineID = wPrePartItem[0].LineID;
                    PositionTemp.CustomerID = wPrePartItem[0].CustomerID;
                    PositionTemp.ProductNo = wPrePartItem[0].ProductNo;
                    PositionTemp.MaterialID = wPrePartItem[0].MaterialID;
                    PositionTemp.UnitID = wPrePartItem[0].UnitID;
                    PositionTemp.SupplierName = wPrePartItem[0].SupplierName;
                    PositionTemp.SupplierProductNo = wPrePartItem[0].SupplierProductNo;
                }
                mAllowSubmt = AllowSubmit();
                if (mAllowSubmt) {
                    model.com.UpdateItem({
                        data: PositionTemp
                    }, function (res) {
                        alert("新增成功");
                        $(".zzzb").hide();
                        $(".zzzc").show();
                        $(".zzzc").width("100%");
                        model.com.refresh();
                    })
                } else {
                    alert("请将数据填写完整！");
                }
            });
            $("body").delegate(".uploadImageZac", "change", function () {
                var self = this,
                    _data = self.files[0];
                if (_data) {

                    if (_data.size > (1024 * 1024 * 10)) {
                        alert("请上传小于10M的图片！");
                        clearFiles();
                        return;
                    }

                    if (!extLimit(['jpg', 'png', 'gif', 'bmp', 'jpeg']).has(_data.name)) {
                        alert("请上传正确的图片！");
                        clearFiles();
                        return;
                    }

                    var form = new FormData();
                    form.append("file", _data);

                    //alert(_data.name);
                    $.ajax({ //
                        url: "/MESCore/api/Upload/Submit",
                        type: "POST",
                        data: form,
                        processData: false,
                        contentType: false,
                        dataType: "JSON"
                    }).done(function (data) {

                        if (data.resultCode === 1000) {
                            var $p = $(self).parent();
                            //  $p.before('.upload-btn').remove();
                            $p.before($com.util.template({
                                Src: data.returnObject.file_id,
                                Id: data.returnObject.file_id
                            }, HTML.IMG));
                            // $p.append(HTML.File);
                            /*if (!window.FileReader) {
                                                    var CSS = {
                                                        background : "background:url("+ data.returnObject.url +") no-repeat center;",
                                                        size : "background-size:cover;"
                                                    };
                                                    myData.head_img = data.returnObject.url;
                                                    $("#upload-img").attr("style", CSS.background + CSS.size);
                                                    $(".btn-upload").remove();
                                                } else {
                                                    var reader = new FileReader();
                                                    //将文件以Data URL形式读入页面，解决ios图片不显示bug
                                                    reader.readAsDataURL(_data);
                                                    reader.onload = function (e) {
                                                        var CSS = {
                                                            background : "background:url("+ this.result +") no-repeat center;",
                                                            size : "background-size:cover;"
                                                        };
                                                        myData.head_img = data.returnObject.url;
                                                        $("#upload-img").attr("style", CSS.background + CSS.size);
                                                        $(".btn-upload").remove();
                                                    };
                                                }*/

                        } else {
                            alert("上传失败，请重新再试");
                        }

                        clearFiles();
                    });
                }

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


            $("body").delegate("#femi-riskLevel-tbody tr td[data-title=ImagePath] img", "click", function () {
                var farImg = $(this).parent(),
                    imgObj = {},
                    imgList = [];
                $.each(farImg.children(), function (i, item) {
                    imgObj = $(item).attr("data-source");
                    imgList.push(imgObj);
                });
                PhotoList = imgList;
                $("body").append(HTML.Photo);
                var imgSrc = $(this).attr("src")
                $.each(PhotoList, function (p_i, p_item) {
                    var pImg = p_item;
                    if (pImg == imgSrc) {
                        $(".lmvt-change-photo").attr("data-index", p_i);
                        return false;
                    }
                })

                $(".lmvt-change-photo").css("background", "url(" + imgSrc + ") " + "no-repeat center");
            });

            //移除photo
            $("body").delegate(".lmvt-remove-photo", "click", function () {
                $(".lmvt-show-photo").remove();
            });

            //右看图片
            $("body").delegate(".lmvt-bottom-left", "click", function () {
                var index = Number($(".lmvt-change-photo").attr("data-index"));
                if (PhotoList) {
                    if (index == PhotoList.length - 1) {
                        alert("这是最后一张图片！");
                        return false;
                    }
                    else {
                        $(".lmvt-change-photo").css("background", "url(" + PhotoList[index + 1] + ") " + "no-repeat center");
                        $(".lmvt-change-photo").attr("data-index", index + 1);
                    }
                }
            });
            //左看图片
            $("body").delegate(".lmvt-bottom-right", "click", function () {
                var index = Number($(".lmvt-change-photo").attr("data-index"));
                if (PhotoList) {
                    if (index == 0) {
                        alert("这是第一张图片！");
                        return false;
                    }
                    else {
                        $(".lmvt-change-photo").css("background", "url(" + PhotoList[index - 1] + ") " + "no-repeat center");
                        $(".lmvt-change-photo").attr("data-index", index - 1);
                    }
                }

            });
        },




        run: function () {
            StartTime = $com.util.format("yyyy-MM-dd", new Date().getTime() - 30 * 24 * 3600 * 1000);
            EndTime = $com.util.format("yyyy-MM-dd", new Date().getTime() + 24 * 3600 * 1000);
            $com.app.loading('数据加载中...');

            //     var ProductID_Name={};
            //     var ProductName_ID=[];

            //    id= ProductID_Name["SSS"];

            //    No=ProductName_ID[1];
            model.com.getFPCProduct({ ProductTypeID: 0, BusinessUnitID: 0 }, function (resP) {
                wProduct = $com.util.Clone(resP.list);

                $.each(wProduct, function (i, item) {
                    if (item.Active == 1 && item.TransportType == 1) {
                        ProductID_Name[item.ProductNo] = item;
                        ProductName_ID.push(item);
                    }
                });


                //查询部件清单
                model.com.getConfigAll({ PartConfigNo: "", PartConfigName: "", Active: 1, ProductNo: "", CustomerID: -1, LineID: -1 }, function (resConfig) {
                    mConfigEdite = $com.util.Clone(resConfig.list);
                    mConfig = $com.util.Clone(resConfig.list);

                    mProduct = $com.util.Clone(resConfig.list);
                    mLine = $com.util.Clone(resConfig.list);
                    mCustomer = $com.util.Clone(resConfig.list);
                    mUnit = $com.util.Clone(resConfig.list);
                    mMaterial = $com.util.Clone(resConfig.list);
                    //部件名称
                    mConfigEdite = model.com.uniqueConfig(mConfigEdite);
                    TypeObj = {};
                    $.each(mConfigEdite, function (i, item) {
                        TypeObj[item.ID] = item;
                        TypeCode[item.Code] = item;
                        TypeSource_Level.Config.push({
                            name: item.PartTypeName+'【'+item.Code+'】',
                            value: item.ID,
                            far: 0
                        });
                    });
                    // mEditPartItem.Config = TypeSource_Level.Config[0].value;
                    //车型
                    mProduct = model.com.uniqueProductNo(mProduct);
                    $.each(mProduct, function (i, item) {
                        TypeSource_Level.ProductNoName.push({
                            name: item.ProductNo,
                            value: item.ProductNo,
                            far: 0
                        })
                    });
                    mProductID = TypeSource_Level.ProductNoName[0].value;
                    //修程
                    mLine = model.com.uniqueLine(mLine);
                    $.each(mLine, function (i, item) {
                        TypeSource_Level.LineID.push({
                            name: item.LineName,
                            value: item.LineID,
                            far: 0
                        });
                    });
                    mLineID = TypeSource_Level.LineID[0].value;
                    // 局段
                    mCustomer = model.com.uniqueCustomer(mCustomer);
                    $.each(mCustomer, function (i, item) {
                        TypeSource_Level.CustomerID.push({
                            name: item.CustomerName,
                            value: item.CustomerID,
                            far: 0
                        })
                    });
                    //单位
                    mUnit = model.com.uniqueUnit(mUnit);
                    $.each(mUnit, function (i, item) {
                        TypeSource_Level.UnitID.push({
                            name: item.UnitText,
                            value: item.UnitID,
                            far: 0
                        })
                    });
                    //物料
                    mMaterial = model.com.uniqueMaterial(mMaterial);
                    $.each(mMaterial, function (i, item) {
                        TypeSource_Level.MaterialID.push({
                            name: item.MaterialName,
                            value: item.MaterialID,
                            far: 0
                        })
                    });
                    model.com.refresh();
                });

            });

        },

        com: {

            //属性去重
            reduce: function (source, key) {
                var obj = {},
                    arr = [];
                arr = source.reduce(function (item, next) {
                    obj[next.key] ? '' : obj[next.key] = true && item.push(next);
                    return item;
                }, []);
                return arr;
            },
            refresh: function () {
                $com.app.loading('数据加载中...');
                mTempTypeSource = $com.util.Clone(TypeSource_Level);
                model.com.getItemAll({
                    Type: -1, CustomerID: -1, LineID: -1, ProductNo: "", SupplierName: "", SupplierProductNo: "", SupplierPartNo: "", PartItemNo: "",
                    PartItemName: "", OrderID: -1, OrderNo: "", StartTime: StartTime, EndTime: EndTime, Status: -1
                }, function (resP) {
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
                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }
                            item.Name = TypeCode[item.Code].Name;
                            // item.AuditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.AuditTimeAuditTime);
                        });
                        DataAllFactorySearch = $com.util.Clone(Grade);

                        Grade.forEach(element => {
                            ImagePathArray = [];
                            if (element.ImagePath.length > 0) {
                                element.ImagePath.forEach(element1 => {
                                    SrcListObj = {
                                        SrcList: element1
                                    }
                                    if (SrcListObj.SrcList != "") {
                                        ImagePathArray.push(SrcListObj);
                                    }
                                });
                                if (ImagePathArray.length > 0) {
                                    element.ImageItem = $com.util.template(ImagePathArray, HTML.IMGLIST);
                                } else {
                                    element.ImageItem = "";
                                }
                            }

                        });

                        $("#femi-riskLevel-tbody").html($com.util.template(Grade, HTML.TableMode));
                        $com.app.loaded();
                    }

                });
            },
            render: function (list) {

                var _data = [];
                for (var p in list) {
                    var o = KEYWORD[p];
                    if (o) {
                        _data[Number(o.index)] = {
                            name: o.name,
                            value: list[p] === "" ? "-" : list[p]
                        };
                    }
                }
                _data = _data.sort();
                _dataTemp = [];
                _dataTempTwo = [];
                for (var n = 0; n < _data.length; n++) {
                    _dataTemp.push(_data[n]);
                }
                //   for(var m=0;m<_dataTemp.length;m++){
                //     if(_dataTemp[m] == "undefined"){
                //         _dataTempTwo.push(_dataTemp[m]);
                //     }
                //   }
                function removeEmptyArrayEle(arr) {
                    for (var i = 0; i < arr.length; i++) {
                        if (typeof arr[i] === "undefined") {
                            arr.splice(i, 1);
                            i = i - 1; // i - 1 ,因为空元素在数组下标 2 位置，删除空之后，后面的元素要向前补位，
                            // 这样才能真正去掉空元素,觉得这句可以删掉的连续为空试试，然后思考其中逻辑
                        }
                    }
                    return arr;
                };
                _dataTemp = removeEmptyArrayEle(_dataTemp);
                $(".propertyGrid").append('<div class="m-c-boxText" style="margin-top: 15px;"><ul style="list-style-type: none;padding: 0px;border: 1px solid grey;"></ul></div>');
                $(".propertyGrid .m-c-boxText ul").html("");
                for (var i = 0; i < _dataTemp.length; i++) {
                    $(".propertyGrid .m-c-boxText ul").append('<li style="border-bottom: 1px solid grey;"><label class="m-detail-title" style="width: 40%;font-size: 16px;text-align: center;margin-bottom: 0px;float: left;">' + _dataTemp[i].name + '</label><div class="m-detail-content" style="display: inline-block;font-size: 16px;width: 60%; text-align: left;">' + _dataTemp[i].value + '</div></li>');
                }
            },
            //查询预检在厂台车部件数据 Code SuplierPartNo
            getPrePartItemList: function (data, fn, context) {
                var d = {
                    $URI: "/SFCTaskIPT/PrePartItemList",
                    $TYPE: "get",
                    $SERVER: "/MESQMS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询部件库
            getConfigAll: function (data, fn, context) {
                var d = {
                    $URI: "/MSSPart/ConfigAll",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询部件表
            getItemAll: function (data, fn, context) {
                var d = {
                    $URI: "/MSSPart/ItemAll",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询部件表单条
            ItemInfo: function (data, fn, context) {
                var d = {
                    $URI: "/MSSPart/ItemInfo",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //新增部件表
            UpdateItem: function (data, fn, context) {
                var d = {
                    $URI: "/MSSPart/UpdateItem",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //删除部件表
            DeleteItem: function (data, fn, context) {
                var d = {
                    $URI: "/MSSPart/DeleteItem",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //查询修程
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
            //局段列表
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
            //获取物料号列表
            getMaterialList: function (data, fn, context) {
                var d = {
                    $URI: "/Material/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //单位列表
            getMeteringSettingprice: function (data, fn, context) {
                var d = {
                    $URI: "/Unit/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //车型查询
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
            getUser: function (data, fn, context) {
                var d = {
                    $URI: "/User/All",
                    $TYPE: "get",

                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //重新渲染物料数据
            Material: function (array) {
                //修改物料
                var $MaterialSelect = $("#modal_select_MaterialID");
                var $MaterialUL_DIV = $MaterialSelect.closest(".femi-property-item").find(".dropdown-menu.open ul.dropdown-menu.inner.selectpicker");
                var SELECT_OPTION_HTML = '<option value="{{value}}" >{{name}}</option>';
                var SELECT_LI_HTML = '<li rel="{{value}}"><a tabindex="0" class="" style=""><span class="text">{{name}}</span><i class="glyphicon glyphicon-ok icon-ok check-mark"></i></a></li>';
                TypeSource_Level.MaterialID.splice(0, TypeSource_Level.MaterialID.length);
                $.each(array, function (i, item) {
                    TypeSource_Level.MaterialID.push({
                        name: item.Name,
                        value: item.ID,
                        far: 0
                    })
                });
                $MaterialSelect.siblings(".btn-group").find(".selectpicker .filter-option").text(TypeSource_Level.MaterialID[0].name);
                $MaterialSelect.html($com.util.template(TypeSource_Level.MaterialID, SELECT_OPTION_HTML));
                $MaterialUL_DIV.html($com.util.template(TypeSource_Level.MaterialID, SELECT_LI_HTML));

            },
            //重新渲染修程数据
            Line: function (array) {
                var $LineSelect = $("#modal_select_LineID");
                var $LineUL_DIV = $LineSelect.closest(".femi-property-item").find(".dropdown-menu.open ul.dropdown-menu.inner.selectpicker");
                var SELECT_OPTION_HTML = '<option value="{{value}}" >{{name}}</option>';
                var SELECT_LI_HTML = '<li rel="{{value}}"><a tabindex="0" class="" style=""><span class="text">{{name}}</span><i class="glyphicon glyphicon-ok icon-ok check-mark"></i></a></li>';
                TypeSource_Level.LineID.splice(0, TypeSource_Level.LineID.length);
                $.each(array, function (i, item) {
                    TypeSource_Level.LineID.push({
                        name: item.Name,
                        value: item.ID,
                        far: 0
                    })
                });
                $LineSelect.siblings(".btn-group").find(".selectpicker .filter-option").text(TypeSource_Level.LineID[0].name);
                $LineSelect.html($com.util.template(TypeSource_Level.LineID, SELECT_OPTION_HTML));
                $LineUL_DIV.html($com.util.template(TypeSource_Level.LineID, SELECT_LI_HTML));

            },
            //重新渲染车型数据
            Product: function (array) {
                var $ProductNoNameSelect = $("#modal_select_ProductNoName");
                var $ProductNoNameUL_DIV = $ProductNoNameSelect.closest(".femi-property-item").find(".dropdown-menu.open ul.dropdown-menu.inner.selectpicker");
                var SELECT_OPTION_HTML = '<option value="{{value}}" >{{name}}</option>';
                var SELECT_LI_HTML = '<li rel="{{value}}"><a tabindex="0" class="" style=""><span class="text">{{name}}</span><i class="glyphicon glyphicon-ok icon-ok check-mark"></i></a></li>';
                TypeSource_Level.ProductNoName.splice(0, TypeSource_Level.ProductNoName.length);
                $.each(array, function (i, item) {
                    TypeSource_Level.ProductNoName.push({
                        name: item.Name,
                        value: item.ID,
                        far: 0
                    })
                });
                $ProductNoNameSelect.siblings(".btn-group").find(".selectpicker .filter-option").text(TypeSource_Level.ProductNoName[0].name);
                $ProductNoNameSelect.html($com.util.template(TypeSource_Level.ProductNoName, SELECT_OPTION_HTML));
                $ProductNoNameUL_DIV.html($com.util.template(TypeSource_Level.ProductNoName, SELECT_LI_HTML));
            },
            Customer: function (array) {
                var $CustomerSelect = $("#modal_select_CustomerID");
                var $CustomerUL_DIV = $CustomerSelect.closest(".femi-property-item").find(".dropdown-menu.open ul.dropdown-menu.inner.selectpicker");
                var SELECT_OPTION_HTML = '<option value="{{value}}" >{{name}}</option>';
                var SELECT_LI_HTML = '<li rel="{{value}}"><a tabindex="0" class="" style=""><span class="text">{{name}}</span><i class="glyphicon glyphicon-ok icon-ok check-mark"></i></a></li>';
                TypeSource_Level.CustomerID.splice(0, TypeSource_Level.CustomerID.length);
                $.each(array, function (i, item) {
                    TypeSource_Level.CustomerID.push({
                        name: item.Name,
                        value: item.ID,
                        far: 0
                    })
                });
                $CustomerSelect.siblings(".btn-group").find(".selectpicker .filter-option").text(TypeSource_Level.CustomerID[0].name);
                $CustomerSelect.html($com.util.template(TypeSource_Level.CustomerID, SELECT_OPTION_HTML));
                $CustomerUL_DIV.html($com.util.template(TypeSource_Level.CustomerID, SELECT_LI_HTML));
            },
            Unit: function (array) {
                var $UnitSelect = $("#modal_select_UnitID");
                var $UnitUL_DIV = $UnitSelect.closest(".femi-property-item").find(".dropdown-menu.open ul.dropdown-menu.inner.selectpicker");
                var SELECT_OPTION_HTML = '<option value="{{value}}" >{{name}}</option>';
                var SELECT_LI_HTML = '<li rel="{{value}}"><a tabindex="0" class="" style=""><span class="text">{{name}}</span><i class="glyphicon glyphicon-ok icon-ok check-mark"></i></a></li>';
                TypeSource_Level.UnitID.splice(0, TypeSource_Level.UnitID.length);
                $.each(array, function (i, item) {
                    TypeSource_Level.UnitID.push({
                        name: item.Name,
                        value: item.ID,
                        far: 0
                    })
                });
                $UnitSelect.siblings(".btn-group").find(".selectpicker .filter-option").text(TypeSource_Level.UnitID[0].name);
                $UnitSelect.html($com.util.template(TypeSource_Level.UnitID, SELECT_OPTION_HTML));
                $UnitUL_DIV.html($com.util.template(TypeSource_Level.UnitID, SELECT_LI_HTML));
            },
            //获取物料号列表
            getMaterialAll: function (data, fn, context) {
                var d = {
                    $URI: "/BomItem/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询部件清单
            getConfigAll: function (data, fn, context) {
                var d = {
                    $URI: "/MSSPart/ConfigAll",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //删除修程
            uniqueLine: function (arr) {
                for (var i = 0; i < arr.length; i++) {
                    for (var j = i + 1; j < arr.length; j++) {
                        if (arr[i].LineID == arr[j].LineID) {     //第一个等同于第二个，splice方法删除第二个
                            arr.splice(j, 1);
                            j--;
                        }
                    }
                }
                return arr;
            },
            //删除车型
            uniqueProductNo: function (arr) {
                for (var i = 0; i < arr.length; i++) {
                    for (var j = i + 1; j < arr.length; j++) {
                        if (arr[i].ProductNo == arr[j].ProductNo) {     //第一个等同于第二个，splice方法删除第二个
                            arr.splice(j, 1);
                            j--;
                        }
                    }
                }
                return arr;
            },
            //删除局段
            uniqueCustomer: function (arr) {
                for (var i = 0; i < arr.length; i++) {
                    for (var j = i + 1; j < arr.length; j++) {
                        if (arr[i].CustomerID == arr[j].CustomerID) {     //第一个等同于第二个，splice方法删除第二个
                            arr.splice(j, 1);
                            j--;
                        }
                    }
                }
                return arr;
            },
            //删除单位
            uniqueUnit: function (arr) {
                for (var i = 0; i < arr.length; i++) {
                    for (var j = i + 1; j < arr.length; j++) {
                        if (arr[i].UnitID == arr[j].UnitID) {     //第一个等同于第二个，splice方法删除第二个
                            arr.splice(j, 1);
                            j--;
                        }
                    }
                }
                return arr;
            },
            //删除物料
            uniqueMaterial: function (arr) {
                for (var i = 0; i < arr.length; i++) {
                    for (var j = i + 1; j < arr.length; j++) {
                        if (arr[i].MaterialID == arr[j].MaterialID) {     //第一个等同于第二个，splice方法删除第二个
                            arr.splice(j, 1);
                            j--;
                        }
                    }
                }
                return arr;
            },
            uniqueConfig: function (arr) {
                for (var i = 0; i < arr.length; i++) {
                    for (var j = i + 1; j < arr.length; j++) {
                        if (arr[i].Code == arr[j].Code) {     //第一个等同于第二个，splice方法删除第二个
                            arr.splice(j, 1);
                            j--;
                        }
                    }
                }
                return arr;
            },
            //通过部件Code查询数据
            SearchData: function (Code) {
                model.com.getConfigAll({ PartConfigNo: Code, PartConfigName: "", Active: -1, ProductNo: "", CustomerID: -1, LineID: -1 }, function (resP) {
                    wList = resP.list;
                    mProduct = $com.util.Clone(resP.list);
                    mLine = $com.util.Clone(resP.list);
                    mCustomer = $com.util.Clone(resP.list);
                    mUnit = $com.util.Clone(resP.list);
                    mMaterial = $com.util.Clone(resP.list);
                    if (wList.length > 0) {
                        TypeSource_Level.MaterialID.splice(0, TypeSource_Level.MaterialID.length);
                        mMaterial = model.com.uniqueMaterial(mMaterial);
                        $.each(mMaterial, function (i, item) {
                            TypeSource_Level.MaterialID.push({
                                name: item.MaterialName,
                                value: item.MaterialID,
                                far: 0
                            })
                        });
                        TypeSource_Level.LineID.splice(0, TypeSource_Level.LineID.length);
                        mLine = model.com.uniqueLine(mLine);
                        $.each(mLine, function (i, item) {
                            TypeSource_Level.LineID.push({
                                name: item.LineName,
                                value: item.LineID,
                                far: 0
                            });
                        });
                        TypeSource_Level.UnitID.splice(0, TypeSource_Level.UnitID.length);
                        mUnit = model.com.uniqueUnit(mUnit);
                        $.each(mUnit, function (i, item) {
                            TypeSource_Level.UnitID.push({
                                name: item.UnitText,
                                value: item.UnitID,
                                far: 0
                            })
                        });
                        TypeSource_Level.ProductNoName.splice(0, TypeSource_Level.ProductNoName.length);
                        mProduct = model.com.uniqueProductNo(mProduct);
                        $.each(mProduct, function (i, item) {
                            TypeSource_Level.ProductNoName.push({
                                name: item.ProductNo,
                                value: item.ProductNo,
                                far: 0
                            })
                        });
                        TypeSource_Level.CustomerID.splice(0, TypeSource_Level.CustomerID.length);
                        mCustomer = model.com.uniqueCustomer(mCustomer);
                        $.each(mCustomer, function (i, item) {
                            TypeSource_Level.CustomerID.push({
                                name: item.CustomerName,
                                value: item.CustomerID,
                                far: 0
                            })
                        });
                    }
                    $("#Typetable-task1").html("");
                    $("body").append($com.propertyGrid.show($("#Typetable-task1"), default_value_Config, KEYWORD_Level, TypeSource_Level));
                    $($(".zzzb .zace-bg #Typetable-task1 .propertyGrid .femi-property-item .form-control")[3]).addClass("SupplierName");
                    $($(".zzzb .zace-bg #Typetable-task1 .propertyGrid .femi-property-item .form-control")[4]).addClass("SupplierProductNo");
                    $($(".zzzb .zace-bg #Typetable-task1 .propertyGrid .femi-property-item .form-control")[5]).addClass("SupplierPartNo");
                });
            },
            //查询获取部件 修程 局段 物料 单位
            getPartConfigDetails: function (data, fn, context) {
                var d = {
                    $URI: "/SFCTaskIPT/PartConfigDetails",
                    $TYPE: "get",
                    $SERVER: "/MESQMS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //删除供应商名称
            uniqueSuppiler: function (arr) {
                for (var i = 0; i < arr.length; i++) {
                    for (var j = i + 1; j < arr.length; j++) {
                        if (arr[i].name == arr[j].name) {     //第一个等同于第二个，splice方法删除第二个
                            arr.splice(j, 1);
                            j--;
                        }
                    }
                }
                return arr;
            },

        }
    }),

        model.init();


});