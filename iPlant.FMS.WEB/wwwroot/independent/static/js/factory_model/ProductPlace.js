require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/paging'], function ($zace, $com, $page) {

    var KEYWORD_Level_LIST,
        KEYWORD_Level,
        FORMATTRT_Level,
        DEFAULT_VALUE_Level,
        TypeSource_Level,
        model,
        wStockIDArray,
        DataProductList,
        DataAll,
        DATABasic,
        DataAllConfirmBasic,
        DataAllConfirmChange,
        DataAllConfirm,
        mQueryBindingBogies,
        DataAllSearch,
        DataAllFactorySearch,
        mTransportType,
        wData,
        mMasterData,
        mStoreHouse,
        HTML;
    DataAll = [];
    DATABasic = [];
    DataAllConfirmBasic = [];
    DataAllConfirmChange = [];
    DataAllConfirm = [];
    DataAllFactorySearch = DataAllSearch = [];
    PositionTemp = {
        ID: 0,
        Name: "",
        Active: 1,
        ProductID: 0,
        PlaceType: 1, //1台位  2库位
        ParentID: 0,
        PartID: 0,
        PartNo: "",
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
            '<td data-title="ProductID" data-value="{{ProductID}}" >{{ProductID}}</td>',
            '<td data-title="PartNo" data-value="{{PartNo}}" >{{PartNo}}</td>',
            // '<td data-title="ProductNo" data-value="{{ProductNo}}" >{{ProductNo}}</td>',
            // '<td data-title="Creator" data-value="{{Creator}}" >{{Creator}}</td>',
            // '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
            '<td data-title="Editor" data-value="{{Editor}}" >{{Editor}}</td>',
            '<td data-title="EditTime" data-value="{{EditTime}}" >{{EditTime}}</td>',
            // '<td data-title="Active" data-value="{{Active}}" >{{Active}}</td>',

            '</tr>',
        ].join(""),



    },
        (function () {
            KEYWORD_Level_LIST = [
                "Name|名称",
                "Code|编码",
                "ProductID|车型|ArrayOne",
                "ProductIDSelect|车型|ArrayOneControl",
                "PartNoName|车号|ArrayOneControl|ProductIDSelect",
                // "ProductIDSelect|车型|ArrayOne",
                // "PartNoName|车号|ArrayOne",
                "Status|状态|ArrayOne",
                "CreateTime|时间|DateTime",
                "EditTime|时间|DateTime",
                "Active|激活|ArrayOne",
            ];
            KEYWORD_Level = {};
            FORMATTRT_Level = {};

            DEFAULT_VALUE_Level = {
                Name: "",
                Code: "",
                //ProductID: "",
                //PartNo:"",         
            };

            TypeSource_Level = {
                Active: [
                    {
                        name: "激活",
                        value: 1
                    }, {
                        name: "禁用",
                        value: 0
                    }
                ],

                ProductIDSelect: [
                    {
                        name: "无",
                        value: 0
                    }
                ],
                ProductID: [
                    {
                        name: "无",
                        value: 0
                    }],
                PartNoName: [

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
        KEYWORD_Level_LIST_TransportType = [
            "ProductID|车型|ArrayOneControl",
            "PartNo|车号|ArrayOneControl|ProductID",
            "PartName|车号",
        ];
        KEYWORD_Level_TransportType = {};
        FORMATTRT_Level_TransportType = {};

        DEFAULT_VALUE_Level_TransportType = {

        };

        TypeSource_Level_TransportType = {

            ProductID: [
                {
                    name: "无",
                    value: 0
                }
            ],
            PartNo: [
                {
                    name: "无",
                    value: 0,
                    far: 0,
                }
            ],
        };

        $.each(KEYWORD_Level_LIST_TransportType, function (i, item) {
            var detail = item.split("|");
            KEYWORD_Level_TransportType[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_Level_TransportType[detail[0]] = $com.util.getFormatter(TypeSource_Level_TransportType, detail[0], detail[2]);
            }
        });
    })();


    model = $com.Model.create({
        name: '车辆绑定',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            $("body").delegate("#zace-refresh-po", "click", function () {

                model.com.refreshProduct();


            });
            // 
            $("body").delegate("#zace-searchAll-level", "click", function () {
                var default_value = {
                    //Name:"",
                    ProductID: 0,
                    //PartNo:"",
                    //Position: 0,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.ProductID = Number(rst.ProductID);
                    //default_value.PartNo = rst.PartNo;
                    //default_value.Name = rst.Name;
                    $com.table.filterByConndition($("#femi-riskLevel-tbody"), DataAll, default_value, "ID");

                }, TypeSource_Level));




            });
            //Enter触发模糊查询事件
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var $this = $(this),
                        value = $("#zace-search-level").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-riskLevel-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "ID");
                }
            });
            //产品规格查询
            $("body").delegate("#zace-searchAll-levelZace", "click", function () {

                var $this = $(this),
                    value = $("#zace-search-level").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "ID");



            });

            $("body").delegate(".modal .femi-modal-body .femi-modal-item select#modal_select_ProductID", "change", function (e) {
                var $this = $(this),
                    name = $this.attr("data-name"),
                    valueID = Number($this.val());
                //找车型的类型
                FindProductObj = $com.util.find(DataProductList, function (e, i, array) {
                    return e.ID == valueID;
                });
                mTransportType = !FindProductObj ? 0 : FindProductObj.TransportType;
                if (mTransportType == 3) {
                    $("select#modal_select_PartNo").parent(".femi-modal-item").show();
                    $("input[data-name=PartName]").parent(".femi-modal-item").hide();
                } else if (mTransportType == 4) {
                    $("#modal_select_PartNo").selectpicker("val", 0);
                    $("select#modal_select_PartNo").parent(".femi-modal-item").hide();
                    $("input[data-name=PartName]").parent(".femi-modal-item").show();
                } else {
                    $("select#modal_select_PartNo").parent(".femi-modal-item").hide();
                    $("input[data-name=PartName]").parent(".femi-modal-item").show();
                }
            });
            //车辆绑定
            $("body").delegate("#zace-edit-levelPro", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！")
                    return;
                }
                //if (SelectData[0].Status != 1) {
                //    alert("数据选择有误！")
                //    return;
                //}
                model.com.postQueryByStationID({
                    StockID: SelectData[0].ParentID, PlaceID: SelectData[0].ID
                }, function (res) {
                    wStockIDArray = res.list;
                    wStockProduct = $com.util.Clone(res.list);
                    if (wStockIDArray.length == 0) {
                        alert("该库位下无可进行直移的车辆列表");
                        return false;
                    } else {
                        TypeSource_Level.PartNoName.splice(0, TypeSource_Level.PartNoName.length);
                        // TypeSource_Level.PartNoName = [];
                        $.each(wStockIDArray, function (i, item) {
                            $.each(DataProductList, function (j, jtem) {
                                if (item.ProductNo == jtem.ProductNo) {
                                    item.ProductID = jtem.ID;
                                }
                            });
                            TypeSource_Level.PartNoName.push({
                                name: item.PartNo,
                                value: item.PartNo,
                                far: item.ProductID,
                            });

                        });

                        var newArray = [];
                        newArray = model.com.uniq(wStockProduct);
                        TypeSource_Level.ProductIDSelect.splice(1, TypeSource_Level.ProductIDSelect.length);
                        $.each(newArray, function (i, item) {
                            $.each(DataProductList, function (j, jtem) {
                                if (item.ProductNo == jtem.ProductNo) {
                                    item.ProductID = jtem.ID;
                                }
                            });
                            TypeSource_Level.ProductIDSelect.push({
                                name: item.ProductNo,
                                value: item.ProductID,
                                far: 0,
                            })
                        });


                        var default_value = {
                            // Name: SelectData[0].Name,
                            // Code: SelectData[0].Code,
                            PartNoName: "",
                            ProductIDSelect: 0,
                            // PartNo: SelectData[0].PartNo.split("#")[1],
                            //ProductCode: SelectData[0].ProductCode,
                        };
                        $("body").append($com.modal.show(default_value, KEYWORD_Level, "车辆绑定", function (rst) {
                            //调用修改函数
                            if (!rst || $.isEmptyObject(rst))
                                return;
                            // SelectData[0].Name = rst.Name;
                            // SelectData[0].Code = rst.Code;

                            SelectData[0].PartNo = rst.PartNoName;
                            SelectData[0].ProductID = Number(rst.ProductIDSelect);

                            if (SelectData[0].ProductID == 0) {
                                alert("请选择车型！");
                                return false;
                            }
                            TargetStationObj = $com.util.find(wStockIDArray, function (e, i, array) {
                                return e.PartNo == SelectData[0].PartNo;
                            })

                            for (var i = 0; i < SelectData.length; i++) {
                                $com.util.deleteLowerProperty(SelectData[i]);
                            }
                            mNumber = SelectData[0].PartNo;
                            PartNOArray = [];
                            PartNOArray = mNumber.split("#");
                            CarTypeObj = $com.util.find(DataProductList, function (element, index, array) {
                                return element.ProductNo == PartNOArray[0];
                            })

                            //通过车找订单号
                            CarName = SelectData[0].PartNo;
                            if (SelectData[0].PartNo.search("[A]") != -1) {
                                CarName = SelectData[0].PartNo.replace("[A]", "");
                            }
                            if (SelectData[0].PartNo.search("[B]") != -1) {
                                CarName = SelectData[0].PartNo.replace("[B]", "");
                            }
                            var wOrderObj = {};
                            wOrderObj = $com.util.find(wOrderList, function (e, i, array) {
                                return e.PartNo == CarName
                            })

                            var taskIDObj = {
                                key: "_1020"
                            };

                            model.com.onTask({ processDefinitionKey: taskIDObj.key, BusinessKey: "", data: {} }, function (data) {
                                //获取实例ID
                                mCloneData = data.data;
                                Todotasks = data.list[0];
                                $com.util.deleteLowerProperty(mCloneData);
                                //（通过任务ID获取当前任务节点出口顺序流条件信息）
                                model.com.getNextSFConditionByTaskId({ taskId: Todotasks.ID }, function (res) {
                                    OperationsByTask = res.list;

                                    mCloneData.FinshTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date());
                                    mCloneData.PartNo = PartNOArray[1];
                                    mCloneData.ExpectedTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date().getTime() + 24 * 3600 * 1000);
                                    mCloneData.CustomerID = !wOrderObj ? 0 : wOrderObj.BureauSectionID;
                                    mCloneData.CarTypeID = CarTypeObj.ID;
                                    mCloneData.PlaceID = Number(TargetStationObj.StationID);
                                    mCloneData.TargetID = Number(SelectData[0].ID);
                                    mCloneData.TargetStockID = Number(SelectData[0].ParentID);
                                    mCloneData.OrderID = !wOrderObj ? 0 : wOrderObj.ID;
                                    mCloneData.Type = 1;
                                    mCloneData.Status = OperationsByTask[0].Value;

                                    TargetStockIDObj = $com.util.find(mStoreHouse, function (e, i, array) {
                                        return e.ID == SelectData[0].ParentID;
                                    });

                                    mCloneData["ImageList"] = "";
                                    mCloneData["Remark"] = "";
                                    mCloneData["CarTypeID_txt_"] = CarTypeObj.ProductNo;
                                    mCloneData["PartNo_txt_"] = PartNOArray[1];
                                    mCloneData["ExpectedTime_txt_"] = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date().getTime() + 24 * 3600 * 1000);

                                    mCloneData["CustomerID_txt_"] = !wOrderObj ? "" : wOrderObj.BureauSection;
                                    mCloneData["PlaceID_txt_"] = TargetStationObj.StationName;
                                    mCloneData["TargetID_txt_"] = SelectData[0].Name
                                    mCloneData["TargetStockID_txt_"] = TargetStockIDObj.Name;
                                    mCloneData["OrderID_txt_"] = "";
                                    mCloneData["ImageList_txt_"] = "";
                                    mCloneData["Remark_txt_"] = "";
                                    model.com.postTask({ "TaskID": Todotasks.ID, "data": mCloneData }, function (res) {
                                    });
                                    model.com.postBind({
                                        data: SelectData[0]
                                    }, function (res) {
                                        alert("绑定成功");
                                        model.com.refreshProduct();
                                    })
                                });
                            });

                        }, TypeSource_Level));
                    }

                });



            });
            //删除
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
                var Obj = $com.util.find(DataProductList, function (e, i, array) {
                    return e.ID == SelectData[0].ProductID;
                });
                if (!Obj) {
                    alert("该台位未绑定车辆！");
                    return false;
                }
                var TransportType = Obj.TransportType;
                if (TransportType == 1 || TransportType == 2) {
                    alert("请选择转向架、平车、假台位！");
                    return false;
                }
                if ((SelectData[0].TransType == 0 || SelectData[0].TransType == 1) && TransportType == 3) {
                    alert("该台位禁止删除转向架！");
                    return false;
                }
                if (!confirm("是否删除？")) {
                    return;
                }
                SelectData[0].PartNo = "";
                SelectData[0].ProductID = 0;
                SelectData[0].ActualPartNoList = [];
                $com.util.deleteLowerProperty(SelectData[0]);
                model.com.postBind({
                    data: SelectData[0]
                }, function (res) {
                    alert("删除成功");
                    model.com.refreshProduct();
                })

            });
            //新增
            $("body").delegate("#zace-edit-Add", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                if (SelectData[0].PartNo.trim().length != 0) {
                    alert("该台位被占用！");
                    return false;
                }
                // if (SelectData[0].TransType == 0 || SelectData[0].TransType == 2) {
                //     alert("该台位禁止新增！");
                //     return false;
                // }

                var default_value = {
                    ProductID: 0,
                    PartNo: "",
                    PartName: "",
                };

                $("body").append($com.modal.show(default_value, KEYWORD_Level_TransportType, "新增", function (rst) {

                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    SelectData[0].ProductID = rst.ProductID;

                    if (mTransportType == 3) {
                        SelectData[0].PartNo = rst.PartNo;
                        if (SelectData[0].TransType == 0 || SelectData[0].TransType == 2) {
                            alert("该台位禁止新增转向架！");
                            return false;
                        }
                    } else {
                        var patt = /^[0-9]{4}$/g;
                        var Reg = patt.test(rst.PartName);
                        if (!Reg) {
                            alert("请正确填写四位数字车号！");
                            return false;
                        }

                        var productTypeObj = $com.util.find(DataProductList, function (element, index, array) {
                            return element.ID == rst.ProductID;
                        })
                        SelectData[0].PartNo = productTypeObj.ProductNo + "#" + rst.PartName;
                    }

                    if (SelectData[0].ProductID == 0) {
                        alert("请选择车型！");
                        return false;
                    }
                    $com.util.deleteLowerProperty(SelectData[0]);
                    model.com.postBind({
                        data: SelectData[0],
                    }, function (res) {
                        alert("新增成功");
                        model.com.refreshProduct();
                    })
                }, TypeSource_Level_TransportType));
                $("input[data-name=PartName]").parent(".femi-modal-item").hide();
            });

        },




        run: function () {

            model.com.getStoreHouseList({ 'ID': -1, 'Active': -1 }, function (res) {
                mStoreHouse = res.list;
            })
            //查询订单信息
            model.com.getOrder({
                StatusList: [3, 4, 5, 6, 7]
            }, function (data) {
                wOrderList = data.list;
            })
            $com.app.loading();
            model.com.refreshProduct()

        },

        com: {
            refreshProduct: function () {
                model.com.getFPCProduct({ ProductTypeID: 0, BusinessUnitID: 0 }, function (res1) {
                    DataProductList = res1.list;
                    $.each(res1.list, function (i, item) {
                        TypeSource_Level.ProductID.push({
                            name: item.ProductNo,
                            value: item.ID,
                        });
                        if (item.TransportType == 4) {
                            TypeSource_Level_TransportType.ProductID.push({
                                name: item.ProductNo,
                                value: item.ID,
                            });
                        }
                    });
                    model.com.QueryBindingBogies({}, function (res) {
                        mQueryBindingBogies = [];
                        $.each(res.list, function (i, item) {
                            var Split = item.split("#");
                            mQueryBindingBogies.push({
                                ID: i + 1,
                                ProductID: model.com.Translationmodel(Split[0]),
                                ProductNo: Split[0],
                                PartNo: item,
                                PartNoNumber: Split[1],
                            })
                        });
                        TypeSource_Level_TransportType.ProductID.splice(3, TypeSource_Level_TransportType.ProductID.length);
                        $.each(mQueryBindingBogies, function (i, item) {
                            TypeSource_Level_TransportType.ProductID.push({
                                name: item.ProductNo,
                                value: item.ProductID,
                            });
                            TypeSource_Level_TransportType.PartNo.push({
                                name: item.PartNo,
                                value: item.PartNo,
                                far: item.ProductID
                            });
                        });
                        var Name = "name";
                        TypeSource_Level_TransportType.ProductID = model.com.distinct(TypeSource_Level_TransportType.ProductID, Name);
                        TypeSource_Level_TransportType.PartNo = model.com.distinct(TypeSource_Level_TransportType.PartNo, Name);
                        model.com.refresh();

                    });
                });

            },
            refresh: function () {
                $com.app.loading();
                model.com.getFPCProductPlace({ Active: -1, ProductID: 0, PartID: 0, PlaceType: -1 }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var Grade = $com.util.Clone(resP.list);
                        DATABasic = $com.util.Clone(resP.list);

                        //审核数据
                        DataAllConfirm = $com.util.Clone(resP.list);

                        var GradeDate = [];
                        for (var i = 0; i < Grade.length; i++) {
                            Grade[i].WID = i + 1;
                            if (Grade[i].Active == 1) {
                                if (!(Grade[i].PlaceType == 2 && Grade[i].PartNo.trim().length == 0)) {
                                    GradeDate.push(Grade[i]);
                                }
                            }
                        }
                        DataAll = $com.util.Clone(GradeDate);

                        $.each(GradeDate, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }
                            item.WID = i + 1;
                        });
                        DataAllFactorySearch = $com.util.Clone(GradeDate);
                        $("#femi-riskLevel-tbody").html($com.util.template(GradeDate, HTML.TableMode));
                    }
                    $com.app.loaded();
                });
            },
            Translationmodel: function (productno) {
                var ProductObj = $com.util.find(DataProductList, function (element, index, array) {
                    return element.ProductNo == productno;
                })
                return ProductObj.ID
            },
            distinct: function (arr, key) {
                for (let i = 0; i < arr.length; i++) {
                    for (let j = i + 1; j < arr.length; j++) {
                        if (arr[i][key] === arr[j][key]) {
                            arr.splice(j, 1);
                            j = j - 1;
                        }
                    }
                }
                return arr;
            },
            uniq: function (array) {
                var temp = [];
                var index = [];
                var l = array.length;
                for (var i = 0; i < l; i++) {
                    for (var j = i + 1; j < l; j++) {
                        if (array[i].ProductNo === array[j].ProductNo) {
                            i++;
                            j = i;
                        }
                    }
                    temp.push(array[i]);
                    index.push(i);
                }
                return temp;
            },
            // 通过任务ID获取当前任务节点出口顺序流条件信息
            getNextSFConditionByTaskId: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESBPM",
                    $URI: "/Repository/getNextSFConditionByTaskId",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //通过车号查询可移车库位  PartNo
            QueryPartNo: function (data, fn, context) {
                var d = {
                    $URI: "/MTC/QueryPartNo",
                    $TYPE: "Post",
                    $SERVER: "/MESWDW"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取所有可进行绑定的转向架车号列表
            QueryBindingBogies: function (data, fn, context) {
                var d = {
                    $URI: "/MTC/QueryBindingBogies",
                    $TYPE: "get",
                    $SERVER: "/MESWDW"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //根据流程定义ID和节点ID获取 ， 属性表信息
            getForm: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESBPM",
                    $URI: "/Repository/getFormByPdIdAndActId",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //启动任务 （通过流程定义的标识Key 开启一个流程实例）
            onTask: function (data, fn, context) {
                var d = {
                    // $SERVER: "/MESBPM",
                    $SERVER: "/MESWDW",
                    $URI: "/Runtime/startProcessByProcessDefinitionKey",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //完成待办任务，返回新生成的任务，更新业务服务器任务消息状态
            postSubmit: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESWDW",
                    // $SERVER: "/MESWDW",
                    $URI: "/Runtime/CompleteMyPersonalTask",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //完成待办任务，返回新生成的任务，更新业务服务器任务消息状态
            postTask: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESWDW",
                    // $SERVER: "/MESWDW",
                    $URI: "/Runtime/CompleteMyPersonalTask",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            // //提交数据
            // postSubmit: function (data, fn, context) {
            //     var d = {
            //         $URI: "/BPMStepAction/Submit",
            //         $TYPE: "Post",
            //         $SERVER: "/MESWDW"
            //     };
            //     function err() {
            //         $com.app.tip('获取失败，请检查网络');
            //     }

            //     $com.app.ajax($.extend(d, data), fn, err, context);
            // },
            //查询可发起移车的订单
            getOrder: function (data, fn, context) {
                var d = {
                    $URI: "/OMSOrder/StatusAll",
                    $TYPE: "Post",
                    $SERVER: "/MESAPS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            // 创建移车任务
            getCreate: function (data, fn, context) {
                var d = {
                    $URI: "/MTC/Create",
                    $TYPE: "get",
                    $SERVER: "/MESWDW"
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
            //查询
            getFPCProductPlace: function (data, fn, context) {
                var d = {
                    $URI: "/FMCWorkspace/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //保存
            postProductPlace: function (data, fn, context) {
                var d = {
                    $URI: "/FMCWorkspace/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //车辆绑定
            postBind: function (data, fn, context) {
                var d = {
                    $URI: "/FMCWorkspace/Bind",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //激活
            activeAudit: function (data, fn, context) {
                var d = {
                    $URI: "/FMCWorkspace/Active",
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

            //通过库位ID查询可进行直移车辆列表
            postQueryByStationID: function (data, fn, context) {
                var d = {
                    $URI: "/MTC/QueryByStationID",
                    $TYPE: "get",
                    $SERVER: "/MESWDW"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取库位列表
            getStoreHouseList: function (data, fn, context) {
                var d = {
                    $URI: "/LFS/StoreHouseAll",
                    $TYPE: "Get",
                    $SERVER: "/MESLFS"
                };

                function err() {
                    $com.app.tip('获取库位列表失败，请检查网络!');
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
        }
    }),

        model.init();


});