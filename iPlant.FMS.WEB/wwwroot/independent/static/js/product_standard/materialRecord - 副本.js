require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($zace, $com) {
    var KEYWORD_materialRecord_LIST,
        KEYWORD_materialRecord,
        FORMATTRT_materialRecord,
        DEFAULT_VALUE_materialRecord,
        TypeSource_materialRecord,

        KEYWORD_materialRecord_LIST_Type,
        KEYWORD_materialRecord_Type,
        FORMATTRT_materialRecord_Type,
        DEFAULT_VALUE_materialRecord_Type,
        TypeSource_materialRecord_Type,
        ZSupplierIDList,
        ZTypeIDlist,
        ZStockIDList,
        ZCYUnitIDList,
        DataAll,
        DATABasic,
        DataAll_Type,
        DATABasic_Type,
        model,
        item,
        HTML;

    ZCYUnitIDList = [];
    ZStockIDList = [];
    ZTypeIDlist = [];
    ZSupplierIDList = [];
    DATABasic_Type = [];
    DataSearchAll=[];

    HTML = {
        TableNode: [
            '<tr data-color="">',
            '<td style="width: 3px"><input type="checkbox" ',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td style="min-width: 50px;display:none" data-title="WID" data-value="{{WID}}">{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td>',
            '<td style="min-width: 50px" data-title="Name" data-value="{{Name}}">{{Name}}</td>',
            '<td style="min-width: 50px" data-title="MaterialNo" data-value="{{MaterialNo}}">{{MaterialNo}}</td>',
            '<td style="min-width: 50px" data-title="CYUnitID" data-value="{{CYUnitID}}">{{CYUnitID}}</td>',
            '<td style="min-width: 50px" data-title="MaterialType" data-value="{{MaterialType}}">{{MaterialType}}</td>',
            '<td style="min-width: 50px" data-title="MaterialGroup" data-value="{{MaterialGroup}}">{{MaterialGroup}}</td>  ',
            '<td style="min-width: 50px" data-title="Groes" data-value="{{Groes}}">{{Groes}}</td>  ',
            '<td style="min-width: 50px" data-title="Normt" data-value="{{Normt}}">{{Normt}}</td>  ',
            '<td style="min-width: 50px" data-title="Remark" data-value="{{Remark}}">{{Remark}}</td>  ',
            '<td style="min-width: 50px" data-title="NetWeight" data-value="{{NetWeight}}">{{NetWeight}}</td>  ',
            '<td style="min-width: 50px" data-title="GrossWeight" data-value="{{GrossWeight}}">{{GrossWeight}}</td>  ',

            '<td style="min-width: 50px" data-title="ZLUnitID" data-value="{{ZLUnitID}}">{{ZLUnitID}}</td>  ',
            '<td style="min-width: 50px" data-title="AuthorID" data-value="{{AuthorID}}">{{AuthorID}}</td>  ',
            '<td style="min-width: 50px" data-title="EditTime" data-value="{{EditTime}}">{{EditTime}}</td>  ',
            // '<td style="min-width: 50px" data-title="AuditorID" data-value="{{AuditorID}}">{{AuditorID}}</td>  ',
            // '<td style="min-width: 50px" data-title="AuditTime" data-value="{{AuditTime}}">{{AuditTime}}</td>  ',
            '</tr>',
        ].join(""),

        TableNode_Type: [
            '<tr data-color="">',
            '<td style="width: 3px"><input type="checkbox" ',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td style="min-width: 50px" data-title="WID" data-value="{{WID}}">{{WID}}</td>',
            '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td>',
            '<td style="min-width: 50px" data-title="Active" data-value="{{Active}}">{{Active}}</td>',
            '<td style="min-width: 50px" data-title="Creator" data-value="{{Creator}}">{{Creator}}</td>',
            '<td style="min-width: 50px" data-title="CreateTime " data-value="{{CreateTime }}"  >{{CreateTime }}</td>',
            '<td style="min-width: 50px" data-title="Type" data-value="{{Type}}">{{Type}}</td>',
            '</tr>',
        ].join(""),

    },

        (function () {
            KEYWORD_materialRecord_LIST = [
                "Name|名称",
                "CheckVersionID|版本",
                "MaterialNo|物料号",
                "MaterialName|物料名",
                "CYUnitID|常用计量单位|ArrayOne",
                "MaterialType|物料类型",
                "MaterialGroup|物料组",
                "Groes|大小量纲",
                "Normt|工业标准",
                "Remark|附加信息",
                "NetWeight|净重",
                "GrossWeight|毛重",

                "ZLUnitID|重量单位|ArrayOne",
                "Status|状态",
                "StockID|仓库名称|ArrayOne",
                "BatchEnable|批号启用",
                //"UnitID|物料单位|ArrayOne",
                "SafeFQTY|安全库存",
                "ShiftFQTY|移动库存",
                "SafeMode|供应商保障",
                "BuyDays|采购提前时间",
                "SupplierID|供应商|ArrayOne",
                "TypeID|物料类型|ArrayOne",
                //       "Author|操作员",
                //       "Auditor|审计员",
                "EditTime|录入时刻|DateTime",
                "AuditTime|审计时间|DateTime",


                "SCUnitID|生产计量单位|ArrayOne",
                "XSUnitID|销售计量单位|ArrayOne",
                "KCUnitID|库存计量单位|ArrayOne",


            ];
            KEYWORD_materialRecord = {};
            FORMATTRT_materialRecord = {};
            DEFAULT_VALUE_materialRecord = {
                Name: '',
                MaterialNo: '',
                CYUnitID: 0,
                MaterialType: '',
                MaterialGroup: '',
                Groes: '',
                Normt: '',
                Remark: '',
                NetWeight: 0.0,
                GrossWeight: 0.0,
                ZLUnitID: 0,
                MaterialName: '',

                CheckVersionID: 0,
                ERPMaterialID: 0,
                PartName: "",
                MaterialNo: "",
                MaterialName: "",
                ID: 0,
                CYUnitID: 0,
                TypeID: 0,
                Status: 1,
                StockID: 1,
                LocationID: 0,
                BatchEnable: 0,
                SafeFQTY: 0,
                ShiftFQTY: 0,
                SafeMode: 0,
                BuyDays: 0,
                BOMID: 0,
                BOMNo: "",
                BoxTypeID: 0,
                BoxFQTY: 0,
                SupplierID: 0,
                LocationBoxs: 0,
                CGUnitID: 0,
                SCUnitID: 0,
                XSUnitID: 0,
                KCUnitID: 0,
            };

            TypeSource_materialRecord = {
                SupplierID: [
                    {
                        name: "无",
                        value: 0
                    }
                ],
                TypeID: [
                    {
                        name: "无",
                        value: 0
                    }],
                StockID: [
                    {
                        name: "无",
                        value: 0
                    }],

                CGUnitID: [
                    {
                        name: "无",
                        value: 0
                    }],

                ZLUnitID: [
                    {
                        name: "无",
                        value: 0
                    }],
                XSUnitID: [
                    {
                        name: "无",
                        value: 0
                    }],
                KCUnitID: [
                    {
                        name: "无",
                        value: 0
                    }],
                CYUnitID: [
                    {
                        name: "无",
                        value: 0
                    }],
            };


            $.each(KEYWORD_materialRecord_LIST, function (i, item) {
                var detail = item.split("|");
                KEYWORD_materialRecord[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };
                if (detail.length > 2) {
                    FORMATTRT_materialRecord[detail[0]] = $com.util.getFormatter(TypeSource_materialRecord, detail[0], detail[2]);
                }
            });
        })();

    //类型
    (function () {
        KEYWORD_materialRecord_LIST_Type = [
            "ID|编号",
            "Active|启用|ArrayOne",
            "Creator|编辑者",
            "CreateTime|编辑时间|DateTime",
            "Type|类型",

        ];
        KEYWORD_materialRecord_Type = {};
        FORMATTRT_materialRecord_Type = {};
        DEFAULT_VALUE_materialRecord_Type = {
            Creator: window.parent.User_Info.Name,
            CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
            ID: 0
        };

        TypeSource_materialRecord_Type = {
            Active: [{
                name: "启用",
                value: 1
            }, {
                name: "禁用",
                value: 0
            }]
        };


        $.each(KEYWORD_materialRecord_LIST_Type, function (x, item1) {
            var detail = item1.split("|");
            KEYWORD_materialRecord_Type[detail[0]] = {
                index: x,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_materialRecord_Type[detail[0]] = $com.util.getFormatter(TypeSource_materialRecord_Type, detail[0], detail[2]);
            }
        });
    })();
    model = $com.Model.create({
        name: '物料档案',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {



            //物料档案修改
            $("body").delegate("#lmvt-materialRecord-edit", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-materialRecord-tbody"), "WID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                } if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                var default_value = {
                    Name: SelectData[0].Name,
                    MaterialNo: SelectData[0].MaterialNo,
                    CYUnitID: SelectData[0].CYUnitID,
                    MaterialType: SelectData[0].MaterialType,
                    MaterialGroup: SelectData[0].MaterialGroup,
                    Groes: SelectData[0].Groes,
                    Normt: SelectData[0].Normt,
                    Remark: SelectData[0].Remark,
                    NetWeight: SelectData[0].NetWeight,
                    GrossWeight: SelectData[0].GrossWeight,
                    ZLUnitID: SelectData[0].ZLUnitID,
                    //MaterialName: SelectData[0].MaterialName,
                };

                $("body").append($com.modal.show(default_value, KEYWORD_materialRecord, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].Name = rst.Name;
                    SelectData[0].MaterialNo = rst.MaterialNo;
                    SelectData[0].MaterialType = rst.MaterialType;
                    SelectData[0].MaterialGroup = rst.MaterialGroup;
                    SelectData[0].Groes = rst.Groes;
                    SelectData[0].Normt = rst.Normt;
                    SelectData[0].Remark = rst.Remark;
                    SelectData[0].NetWeight = rst.NetWeight;
                    SelectData[0].GrossWeight = rst.GrossWeight;

                    SelectData[0].MaterialName = rst.Name + '\\' + rst.Groes + '\\' + rst.Remark;
                    SelectData[0].ZLUnitID = Number(rst.ZLUnitID);
                    SelectData[0].CYUnitID = Number(rst.CYUnitID);

                    for (var i = 0; i < SelectData.length; i++) {
                        $com.util.deleteLowerProperty(SelectData[i]);
                        SelectData[i].AuditTime=$com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].AuditTime));
                        SelectData[i].EditTime=$com.util.format('yyyy-MM-dd hh:mm:ss', new Date(SelectData[i].EditTime));
                    }


                    // var _objMode={};
                    // $.each(DataSearchAll, function (i, item) {
                    //   if (SelectData[0].ID==item.ID) {
                    //     _objMode=$com.util.Clone(item);
                    //     _objMode.CYUnitID=FORMATTRT_materialRecord.CYUnitID[item.CYUnitID];
                    //     _objMode.ZLUnitID=FORMATTRT_materialRecord.ZLUnitID[item.ZLUnitID];
                    //   }
                    // });

                    model.com.postmaterialRecord_UpdateAdd({
                        data: SelectData[0]
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();

                    //    var $Tr = $('#femi-materialRecord-tbody tr td[data-title=WID][data-value=' + SelectData[0].WID + ']').closest("tr");
                    //     $Tr.replaceWith($com.util.template(_objMode, HTML.TableNode));
                    })

                }, TypeSource_materialRecord));


            });


            //物料档案新增
            $("body").delegate("#lmvt-materialRecord-add", "click", function () {
                var default_valueTwo = {
                    Name: '',
                    MaterialNo: '',
                    CYUnitID: 0,
                    MaterialType: '',
                    MaterialGroup: '',
                    Groes: '',
                    Normt: '',
                    Remark: '',
                    NetWeight: 0.0,
                    GrossWeight: 0.0,
                    ZLUnitID: 0,
                    // MaterialName: '',
                };
                $("body").append($com.modal.show(default_valueTwo, KEYWORD_materialRecord, "新增", function (rst) {
                    //调用插入函数 

                    if (!rst || $.isEmptyObject(rst))
                        return;
                    DEFAULT_VALUE_materialRecord.Name = rst.Name;
                    DEFAULT_VALUE_materialRecord.MaterialNo = rst.MaterialNo;
                    DEFAULT_VALUE_materialRecord.MaterialType = rst.MaterialType;
                    DEFAULT_VALUE_materialRecord.MaterialGroup = rst.MaterialGroup;
                    DEFAULT_VALUE_materialRecord.Groes = rst.Groes;
                    DEFAULT_VALUE_materialRecord.Normt = rst.Normt;
                    DEFAULT_VALUE_materialRecord.Remark = rst.Remark;
                    DEFAULT_VALUE_materialRecord.NetWeight = rst.NetWeight;
                    DEFAULT_VALUE_materialRecord.GrossWeight = rst.GrossWeight;

                    DEFAULT_VALUE_materialRecord.MaterialName = rst.Name + '\\' + rst.Groes + '\\' + rst.Remark;
                    DEFAULT_VALUE_materialRecord.ZLUnitID = Number(rst.ZLUnitID);
                    DEFAULT_VALUE_materialRecord.CYUnitID = Number(rst.CYUnitID);

                    model.com.postmaterialRecord_UpdateAdd({
                        data: DEFAULT_VALUE_materialRecord,

                    }, function (res) {
                        model.com.refresh();
                        alert("新增成功");

                    })

                }, TypeSource_materialRecord));


            });

            //物料档案导出
            $("body").delegate("#lmvt-materialRecord-output", "click", function () {
                var $table = $(".table-part>table"),
                    fileName = "物料信息.xls",
                    Title = "物料信息";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });

            });

            //物料档案导入
            $("body").delegate("#lmvt-materialRecord-input", "click", function () {
                $("#input-file").val("");
                $("#input-file").click();
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
                            arr1.push(DataParams[i].MaterialNo);
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

                        var list = model.com.getNewList(DATABasic, arr2List);
                        if (list.length != arr1List.length) {
                            if (!confirm("导入数据重复" + "，确定是否继续？")) {
                                return false;
                            }

                        }

                        if (list.length < 1) {
                            alert("导入数据全部存在！");
                            return;
                        }
                        //alert(list.length);
                        var CGBool = false;
                        var CYBool = false;
                        var KCBool = false;
                        var SCBool = false;
                        var XSBool = false;
                        //var SBool = false;
                        var SuBool = false;
                        var TBool = false;
                        //DATABasic
                        //ZCYUnitIDList = ZStockIDList = ZTypeIDlist = ZSupplierIDList
                        $.each(list, function (i, item) {

                            for (var i = 0; i < ZCYUnitIDList.length; i++) {
                                //if (item.CGUnitID == ZCYUnitIDList[i].Name) {
                                //    item.CGUnitID = ZCYUnitIDList[i].ID;
                                //    CGBool = true;                                    
                                //}
                                if (item.CYUnitID == ZCYUnitIDList[i].Name) {
                                    item.CYUnitID = ZCYUnitIDList[i].ID;
                                    CYBool = true;
                                }
                                //if (item.KCUnitID == ZCYUnitIDList[i].Name) {
                                //    item.KCUnitID = ZCYUnitIDList[i].ID;
                                //    KCBool = true;
                                //} 
                                //if (item.SCUnitID == ZCYUnitIDList[i].Name) {
                                //    item.SCUnitID = ZCYUnitIDList[i].ID;
                                //    SCBool = true;
                                //} 
                                //if (item.XSUnitID == ZCYUnitIDList[i].Name) {
                                //    item.XSUnitID = ZCYUnitIDList[i].ID;
                                //    XSBool = true;
                                //} 
                            }




                            //for (var i = 0; i < ZStockIDList.length; i++) {
                            //    if (item.StockID == ZStockIDList[i].StockName) {
                            //        item.StockID = ZStockIDList[i].ID;
                            //        SBool = true;
                            //    } 
                            //    //?item.StockID.trim():""
                            //}


                            //for (var i = 0; i < ZSupplierIDList.length; i++) {
                            //    if (item.SupplierID == ZSupplierIDList[i].SupplierName) {
                            //        item.SupplierID = ZSupplierIDList[i].ID;
                            //        SuBool = true;
                            //    } 
                            //}

                            for (var i = 0; i < ZTypeIDlist.length; i++) {
                                if (item.TypeID == ZTypeIDlist[i].ItemName) {
                                    item.TypeID = ZTypeIDlist[i].ID;
                                    TBool = true;
                                }
                            }


                            item.BatchEnable = Number(item.BatchEnable);
                            item.SafeFQTY = Number(item.SafeFQTY);
                            item.ShiftFQTY = Number(item.ShiftFQTY);
                            item.SafeMode = Number(item.SafeMode);
                            item.BuyDays = Number(item.BuyDays);
                            item.ID = 0;
                            // item.Active = 1;
                            item.Auditor = window.parent.User_Info.Name,
                                item.Author = window.parent.User_Info.Name,
                                item.EditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                                item.AuditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                                item.Status = 1;
                            item.LocationID = 0;
                            item.BOMID = 0;
                            item.BoxTypeID = 0;
                            item.BoxFQTY = 0;
                            item.LocationBoxs = 0;
                        });
                        //if (!SuBool) {
                        //    alert("供应商输入有误");
                        //    return false;
                        //}
                        if (!TBool) {
                            alert("物料类型输入有误！")
                            return false;
                        }
                        //if (!SBool) {
                        //    alert("仓库名称数据有误！")
                        //    return false;
                        //}
                        //if (!CGBool) {
                        //    alert("采购计量单位有误！")
                        //    return false;
                        //}
                        if (!CYBool) {
                            alert("常用计量单位有误！")
                            return false;
                        }
                        //if (!KCBool) {
                        //    alert("库存计量单位有误！")
                        //    return false;
                        //}
                        //if (!SCBool) {
                        //    alert("生产计量单位有误！")
                        //    return false;
                        //}
                        //if (!XSBool) {
                        //    alert("销售计量单位有误！")
                        //    return false;
                        //}
                        var a = 0;

                        $com.app.loading();

                        var WhileAdd = function () {

                            model.com.postmaterialRecord_UpdateAdd({
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

            });


            //物料档案删除
            $("body").delegate("#lmvt-materialRecord-delete", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-materialRecord-tbody"), "WID", DataAll);
                if (!SelectData || !SelectData.length) {
                    alert("至少选择一行数据再试！")
                    return;
                }
                //if (SelectData.length != 1) {
                //    alert("只能同时对一行数据操作！")
                //    return;
                //}
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {
                    return;
                }

                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                var a = 0;
                for (var i = 0; i < SelectData.length; i++) {
                    model.com.postmaterialRecord_Delete({
                        data: SelectData[i]
                    }, function (res1) {
                        a++;
                        if (a == SelectData.length) {
                            alert("删除成功");
                            model.com.refresh();

                        }

                    })
                }


            });

            //物料档案模糊查询


            //点击物料档案
            $("body").delegate("#zace-materialRecord", "click", function () {
                $('.zzza').width("70%");
                $('.zzzb').show();
                $('.zzzb').width("30%");
            });

            //返回物料档案
            $("body").delegate("#zace-back-materialRecord", "click", function () {
                $('.zzza').width("100%");
                $('.zzzb').hide();

            });

            //物料类型新增
            $("body").delegate("#zace-add-materialRecord", "click", function () {
                var default_valueTwo = {
                    Active: 1,
                    Type: "",
                };
                $("body").append($com.modal.show(default_valueTwo, KEYWORD_materialRecord_Type, "新增", function (rst) {
                    //调用插入函数 

                    if (!rst || $.isEmptyObject(rst))
                        return;
                    DEFAULT_VALUE_materialRecord_Type.Active = Number(rst.Active);
                    DEFAULT_VALUE_materialRecord_Type.Type = rst.Type;

                    //                  var _list_Type=[];
                    //                  DEFAULT_VALUE_materialRecord_Type.ID = model.com.GetMaxID(DATABasic_Type);
                    //                  _list_Type.push(DEFAULT_VALUE_materialRecord_Type);

                    if (DATABasic_Type.length < 1) {
                        DATABasic_Type.push(DEFAULT_VALUE_materialRecord_Type);
                    } else {
                        DEFAULT_VALUE_materialRecord_Type.ID = model.com.GetMaxID(DATABasic_Type);
                        DATABasic_Type.push(DEFAULT_VALUE_materialRecord_Type);
                    }

                    // 直接修改数据库中的ID     
                    //DATABasic_Type[0].ID=1;
                    model.com.postMaterialType({
                        data: DATABasic_Type

                    }, function (res) {
                        model.com.refresh();
                        alert("新增成功");

                    });

                }, TypeSource_materialRecord_Type));


            });


            $("body").delegate("#lmvt-materialRecord-refresh", "click", function () {

                model.com.refresh();


            });
            //物料类型修改
            $("body").delegate("#zace-edit-materialRecord", "click", function () {
                var SelectDate = $com.table.getSelectionData($("#femi-materialRecord-tbody_Type"), "WID", DataAll_Type);
                if (!SelectDate || !SelectDate.length) {
                    alert("请选择一行数据再试！")
                    return;
                }
                if (SelectDate.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                var default_value1 = {
                    Active: SelectDate[0].Active,
                    Type: SelectDate[0].Type,

                };
                mid = SelectDate[0].WID;
                $("body").append($com.modal.show(default_value1, KEYWORD_materialRecord_Type, "修改", function (rst) {
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    DATABasic_Type[mid - 1].Active = Number(rst.Active);
                    DATABasic_Type[mid - 1].Type = rst.Type;
                    model.com.postMaterialType({
                        data: DATABasic_Type
                    }, function (rst) {
                        alert("修改成功");
                        model.com.refresh();
                    })
                }, TypeSource_materialRecord_Type));

            });

            //筛选
            $("body").delegate("#zace-search-materialRecord", "click", function () {

                var $this = $(this),
                    value = $('#zace-search-materialRecordn').val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-materialRecord-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-materialRecord-tbody"), DataSearchAll, value, "WID");

            });

        },


        run: function () {
            $('.zzzb').hide();
            model.com.getModuleAll({ module: 100003 }, function (resModule) {
                if (resModule && resModule.list) {
                    ZTypeIDlist = resModule.list;
                    $.each(resModule.list, function (i, item) {
                        TypeSource_materialRecord.TypeID.push({
                            name: item.ItemName,
                            value: item.ID,
                            far: null
                        })
                    });
                  
                            model.com.getMeteringSettingprice({}, function (resPrice) {
                                ZCYUnitIDList = resPrice.list;
                                $.each(resPrice.list, function (i, item) {
                                    TypeSource_materialRecord.CYUnitID.push({
                                        name: item.Name,
                                        value: item.ID,

                                    })
                                });
                                TypeSource_materialRecord.ZLUnitID= TypeSource_materialRecord.KCUnitID = TypeSource_materialRecord.XSUnitID = TypeSource_materialRecord.SCUnitID = TypeSource_materialRecord.CGUnitID = TypeSource_materialRecord.CYUnitID;



                                // model.com.setMMM();
                                model.com.refresh();
                            });
                    
                }
            });

        },

        com: {

            setMMM: function () {
                setTimeout(function () {
                    if (window.parent._zaceSupplierSet && window.parent._zaceSupplierSet == 1) {
                        model.com.getSupplier({ supplier_name: "", country_id: 0, province_id: 0, city_id: 0, active: 2 }, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {


                                ZSupplierIDList = resW.list;
                                //TypeSource_materialRecord.SupplierID = [];
                                TypeSource_materialRecord.SupplierID.splice(1, TypeSource_materialRecord.SupplierID.length - 1);
                                $.each(resW.list, function (i, item) {
                                    TypeSource_materialRecord.SupplierID.push({
                                        name: item.SupplierName,
                                        value: item.ID,
                                        far: null
                                    })
                                });
                            }
                            window.parent._zaceSupplierSet = 0;
                        });

                    }



                    model.com.setMMM();
                }, 500);

            },

            refresh: function () {

                $com.app.loading('数据加载中。。。');
                model.com.getmaterialRecord({ material_no: "", material_name: "", type_id: 0, status: 0 }, function (res) {
                    if (!res)
                        return;
                    if (res && res.list) {
                        var _list = $com.util.Clone(res.list);
                        DATABasic = $com.util.Clone(res.list);
                        $.each(_list, function (i, item) {
                            item.WID = i + 1;
                        });
                        DataAll = $com.util.Clone(_list);
                        $.each(_list, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_materialRecord[p])
                                    continue;
                                item[p] = FORMATTRT_materialRecord[p](item[p]);
                            }
                        });


                        DataSearchAll=$com.util.Clone(_list);
                        $("#femi-materialRecord-tbody").html($com.util.template(_list, HTML.TableNode));

                        $("#femi-materialRecord-tbody tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });

                        $com.app.loaded();
                    }


                });
                window.parent._zaceMaterialRecord = 1;
                //             model.com.getMaterialType({},function(resType){
                //             	   if(!resType)
                //             	   return;
                //             	   if(resType && resType.list){
                //             	   	var list_Type=$com.util.Clone(resType.list);
                //             	   	DATABasic_Type = $com.util.Clone(resType.list);
                //             	   	$.each(list_Type, function(i,item) {
                //             	   		for(var p in item){
                //             	   			if(!FORMATTRT_materialRecord_Type[p])
                //             	   			continue;
                //             	   			item[p]=FORMATTRT_materialRecord_Type[p](item[p]);
                //             	   		}
                //             	   	});
                //                 $.each(list_Type, function(i,item) {
                //                 	   item.WID=i+1;
                //                 });
                //                 DataAll_Type=$com.util.Clone(list_Type);
                //                 $("#femi-materialRecord-tbody_Type").html($com.util.template(list_Type, HTML.TableNode_Type));
                //             	   }
                //             });
            },
            //单位
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
            //查询所有物料
            getmaterialRecord: function (data, fn, context) {
                var d = {
                    $URI: "/Material/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询所有仓库
            getWMSStockAll: function (data, fn, context) {
                var d = {
                    $URI: "/WMSStock/All",
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


            //更新物料
            postmaterialRecord_UpdateAdd: function (data, fn, context) {
                var d = {
                    $URI: "/Material/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //删除物料
            postmaterialRecord_Delete: function (data, fn, context) {
                var d = {
                    $URI: "/Material/Delete",
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
            //获取物料
            getinfo: function (data, fn, context) {
                var d = {
                    $URI: "/Material/Info",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //获取物料类型
            //          getMaterialType: function (data, fn, context) {
            //              var d = {
            //                  $URI: "/Material/GetMaterialType",
            //                  $TYPE: "get"
            //              };
            //
            //              function err() {
            //                  $com.app.tip('获取失败，请检查网络');
            //              }
            //
            //              $com.app.ajax($.extend(d, data), fn, err, context);
            //          }, 

            //保存物料类型
            //          postMaterialType: function (data, fn, context) {
            //              var d = {
            //                  $URI: "/Material/SaveMaterialType",
            //                  $TYPE: "post"
            //              };
            //
            //              function err() {
            //                  $com.app.tip('获取失败，请检查网络');
            //              }
            //
            //              $com.app.ajax($.extend(d, data), fn, err, context);
            //          }, 

            //查询供应商列表
            getSupplier: function (data, fn, context) {
                var d = {
                    $URI: "/Supplier/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
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
                            if (_source[i].MaterialNo == set_data[j].MaterialNo) {
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
                            if (set_data[i].MaterialNo == _source[j].MaterialNo) {
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

        }
    }),

        model.init();

});