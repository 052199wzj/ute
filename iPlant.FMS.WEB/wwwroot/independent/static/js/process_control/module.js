require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/Vue', '../static/utils/js/base/paging'], function ($yang, $com, Vue, $page) {

    var HTML,
        model,
        PropertyField,
        KEYWORD,
        KEYWORD_PROPERTY,
        KEYWORD_LIST,
        KEYWORD_LIST_PROPERTY,
        DEFAULT_VALUE,
        DEFAULT_VALUE_PROPERTY,
        KETWROD_Template_Arrange,
        TypeSource_Arrange,
        TypeSource,
        TypeSource_PROPERTY,
        FORMATTRT,
        FORMATTRT_PROPERTY,
        DMSDeviceSource,
        DMSDevicePropertySource,
        Formattrt_Arrange,
        DATA,
        DataAll,
        DEFAULT_VALUE_Status,
        DataAll2,
        AllUser,
        Vague1,
        Vague2,
        AllBusinessUnit,
        AllFactory,
        AllWorkShop,
        AllLine,
        AllDeviceLedger,
        AllModelID,
        AllApply,
        SpareLedgerID,
        AllDeviceModel,
        DataAllOriginal,

        AllResultData,

        BOOL;
    BOOL = false;
    TIME = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date());
    Formattrt_Arrange = [];
    HTML = {
        MouduleTemplate: [
            '<tr data-color="">',
            '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            //'<td style="min-width: 50px" data-title="BalancePlateNO" data-value="{{BalancePlateNO}}">{{BalancePlateNO}}</td> ',
            '<td style="min-width: 50px" data-title="ModuleNo" data-value="{{ModuleNo}}">{{ModuleNo}}</td> ',
            '<td style="min-width: 50px" data-title="CasketOne" data-value="{{CasketOne}}">{{CasketOne}}</td> ',
            '<td style="min-width: 50px" data-title="CasketTwo" data-value="{{CasketTwo}}">{{CasketTwo}}</td> ',
            '<td style="min-width: 50px" data-title="CasketThree" data-value="{{CasketThree}}">{{CasketThree}}</td> ',
            '<td style="min-width: 50px" data-title="ProductNo" data-value="{{ProductNo}}">{{ProductNo}}</td> ',
            '<td style="min-width: 50px" data-title="ACResistance  " data-value="{{ACResistance}}">{{ACResistance  }}</td>    ',
            '<td style="min-width: 50px" data-title="DCResistance  " data-value="{{DCResistance}}">{{DCResistance  }}</td>   ',
            '<td style="min-width: 50px" data-title="Capacity " data-value="{Capacity }}">{{Capacity }}</td>  ',
            '<td style="min-width: 50px" data-title="SelfDischarge" data-value="{{SelfDischarge}}">{{SelfDischarge}}</td>   ',
            '<td style="min-width: 50px" data-title="Gears" data-value="{{Gears}}">{{Gears}}</td>    ',
            //'<td style="min-width: 50px" data-title="GroupingPeople" data-value="{{GroupingPeople}}">{{GroupingPeople}}</td>   ',
            //'<td style="min-width: 50px" data-title="GroupingDate" data-value="{GroupingDate}}">{{GroupingDate}}</td>  ',
            //'<td style="min-width: 50px" data-title="IncomingBatches" data-value="{{IncomingBatches}}">{{IncomingBatches}}</td>   ',
            //'<td style="min-width: 50px" data-title="Remark" data-value="{Remark}}">{{Remark}}</td>  ',
            '<td style="min-width: 50px" data-title="ImportTime  " data-value="{ImportTime}}">{{ImportTime}}</td>  ',
            //'<td style="min-width: 50px" data-title="Active" data-value="{Active}}">{{Active}}</td>  ',
            '<td style="min-width: 50px" data-title="UpdateTime" data-value="{UpdateTime}}">{{UpdateTime}}</td>  ',
            '</tr>',
        ].join(""),
        ActiveCode: [
            '<tr data-color="">',
            '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td style="min-width: 50px" data-title="ID " data-value="{{ID }}">{{ID }}</td> ',
            //'<td style="min-width: 50px" data-title="SerialNo " data-value="{{SerialNo }}">{{SerialNo }}</td>   ',
            '<td style="min-width: 50px" data-title="BalancePlateNo" data-value="{{BalancePlateNo}}">{{BalancePlateNo}}</td>   ',
            '<td style="min-width: 50px" data-title="ModuleNo" data-value="{ModuleNo }}">{{ModuleNo }}</td>  ',
            //'<td style="min-width: 50px" data-title="RepeatType " data-value="{RepeatType }}">{{RepeatType }}</td>  ',
            //'<td style="min-width: 50px" data-title="Active  " data-value="{{Active  }}">{{Active  }}</td> ',
            '<td style="min-width: 50px" data-title="ImportTime  " data-value="{{ImportTim}}">{{ImportTime  }}</td>   ',
            '<td style="min-width: 50px" data-title="UpdateTime  " data-value="{{UpdateTime   }}">{{UpdateTime   }}</td> ',
            '</tr>',
        ].join(""),
    };
    (function () {
        KEYWORD_Point_LIST = [
            //"StartTime|开始时间|Date",
            //"EndTime|结束时间|Date",
            "BalancePlateNo|平衡板号|",
            "ModuleNo|模组号|",
            "ProductNo|产品型号|",

        ];
        KEYWORD_Point_LIST1 = [
            "Name|类型名称|",
            "Active|状态|ArrayOne",

        ];

        FORMATTRT = {};
        KEYWORD = {};
        KEYWORD1 = {};

        DEFAULT_VALUE = {

        };
        DEFAULT_VALUE1 = {

        };

        TypeSource_Point = {
            Active: [{
                name: "禁用",
                value: 1
            },
            {
                name: "激活",
                value: 0
            },
            {
                name: "全部",
                value: -1
            },],
            ModelPropertyID: [
                {
                    name: "无",
                    value: 0,
                    far: 0
                }
            ],
            SI: [
                {
                    name: "无",
                    value: 0,
                    far: 0
                }
            ],
            OperatorID: [],
            SpareWorkType: [
                {
                    name: "无",
                    value: 0,
                    far: 0
                }
            ],
        };
        TypeSource_Point1 = {

            Active: [{
                name: "禁用",
                value: 1
            },
            {
                name: "激活",
                value: 0
            },

            ],
            OperatorID: []

        };

        $.each(KEYWORD_Point_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT[detail[0]] = $com.util.getFormatter(TypeSource_Point, detail[0], detail[2]);
            }
        });

        $.each(KEYWORD_Point_LIST1, function (i, item) {
            var detail = item.split("|");
            KEYWORD1[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT[detail[0]] = $com.util.getFormatter(TypeSource_Point1, detail[0], detail[2]);
            }
        });

    })();

    var app = new Vue({
        el: '#lmvt-vueApp',
        data: {
            index: 0,
            StartTime: $com.util.format("yyyy-MM-dd", new Date().getTime() - 30 * 3600000 * 24),

            EndTime: $com.util.format("yyyy-MM-dd", new Date()),

            transform: "rotate(90deg)",

            BalancePlateNo: "",
            ModuleNo: "",
            ProductNo: "",

            ShipMent: [],
            //详情
            ItemInfoList: [],

            Code: "",

            AllResultData: [],

            AllItemList: [],

            //来料批次详情
            ResultList: [],

            ShipMentAllData: [],

            FileName: "",
            FileID: 9999999,


            ActiveList: ["默认", "激活", "完整", "锁定", "解锁"]
        },
        beforeCreate() {
            _this = this;
        },
        created: function () {
            $(document).ready(function () {
                //_this.StartTime = $com.util.format("yyyy-MM-dd hh:mm", new Date().getTime() - 7 * 3600000 * 24);
                //_this.EndTime = $com.util.format("yyyy-MM-dd hh:mm", new Date());
                $("#lmvt-startTime").datetimepicker({
                    format: 'yyyy-mm-dd',//显示格式
                    // startView: 2,
                    minView: 2,
                    maxView: 2,
                    language: 'zh-CN',
                    autoclose: 1,//选择后自动关闭
                    clearBtn: false,//清除按钮
                }).on('changeDate', function (ev) {
                    _this.StartTime = $("#lmvt-startTime").val();

                    $("#lmvt-endTime").datetimepicker("setStartDate", _this.StartTime.toString("yyyy-MM-dd"));
                });
                $("#lmvt-endTime").datetimepicker({
                    format: 'yyyy-mm-dd',//显示格式
                    // startView: 2,
                    minView: 2,
                    maxView: 2,
                    language: 'zh-CN',
                    autoclose: 1,//选择后自动关闭
                    clearBtn: false,//清除按钮
                }).on('changeDate', function (ev) {

                    _this.EndTime = $("#lmvt-endTime").val();
                    $("#lmvt-startTime").datetimepicker("setEndDate", _this.EndTime.toString("yyyy-MM-dd"));
                });
            });
            _this.refresh();
        },
        methods: {

            refresh: function () {

                $com.app.loading("加载中,请稍等.............")
                _this.getFileAll({
                    StartTime: _this.StartTime, EndTime: _this.EndTime, Code: _this.Code, FileName: _this.FileName
                }, function (data) {

                    $.each(data.list, function (i, item) {
                        item.WID = i + 1;
                        item.CreateTime = $com.util.format("yyyy-MM-dd hh:mm:ss", item.CreateTime);
                    });
                    _this.ShipMentAllData = data.list;

                    _this.ShipMent = data.list;

                    if (_this.FileID != 0)
                        _this.LookTableInfo(_this.FileID);

                    $com.app.loaded();
                    // var cat = {},
                    //     RnaderList = [];
                    // $.each(data.list, function (i, item) {

                    //     item.ImportTime = $com.util.format("yyyy-MM-dd hh:mm:ss", item.ImportTime);

                    //     if (!cat[item.Code]) {
                    //         cat[item.Code] = [];
                    //         cat[item.Code].push(item);
                    //     } else {
                    //         cat[item.Code].push(item);
                    //     }
                    // });

                    // for (const key in cat) {
                    //     RnaderList.push({
                    //         Code: cat[key][0].Code,
                    //         ItemCount: cat[key].length,
                    //         ImportTime: cat[key][0].ImportTime,
                    //         ItemList: cat[key]
                    //     })
                    // }

                    // $.each(RnaderList, function (i, item) {
                    //     $.each(item.ItemList, function (j, jtem) {

                    //         jtem.WID = j + 1;
                    //     });
                    //     item.WID = i + 1;
                    // });

                    // _this.ShipMentAllData = RnaderList;

                    // _this.ShipMent = RnaderList;

                    // _this.LookTableInfo(_this.Code);

                    // $com.app.loaded();
                    // $.each(data.list, function (i, item) {
                    //     item.WID = i + 1;
                    //     item.ImportTime = $com.util.format("yyyy-MM-dd hh:mm:ss")
                    // });

                    // for (const key in cat) {
                    //     RnaderList.push({
                    //         Code: cat[key][0].Code,
                    //         Counts: cat[key].length,
                    //         importTime: cat[key][0].ImportTime,
                    //     })
                    // }

                    // $.each(RnaderList, function (i, item) {
                    //     item.WID = i + 1;

                    // });



                    // Vague1 = data.list;
                    // $(".lmvt-device-body").html($com.util.template(data.list, HTML.MouduleTemplate));
                    // $(".lmvt-device-body tr").each(function (i, item) {
                    //     var $this = $(this);
                    //     var colorName = $this.css("background-color");
                    //     $this.attr("data-color", colorName);
                    // });
                });
            },

            refreshResult: function () {
                _this.getResultAll({
                    StartTime: "2010-01-01", EndTime: "2010-01-01",
                    BalancePlateNo: _this.BalancePlateNo, ModuleNo: _this.ModuleNo, ProductNo: "",
                    Active: 1
                }, function (data) {

                    $.each(data.list, function (i, item) {

                        item.WID = i + 1;
                        item.ImportTime = $com.util.format("yyyy-MM-dd hh:mm:ss", item.ImportTime);
                        item.UpdateTime = $com.util.format("yyyy-MM-dd hh:mm:ss", item.UpdateTime);
                        item["Gears"] = parseInt(item["Gears"]);

                    });

                    _this.AllResultData = data.list;

                    //_this.ResultList = data.list;

                    $page.init($("#deviceSparePart1"), data.list, "", function (res) {
                        _this.ResultList = res;
                    });

                });
            },

            LookTableInfo: function (ID) {

                $com.app.loading("查询中。。。。。");

                _this.FileID = ID;

                $(".lmvt-container-supplier").css("width", "40%");
                $(".lmvt-container-item").css("width", "60%");

                $(".supplier-row").css("width", "100%");

                $(".lmvt-container-item").show();



                _this.getModuleAll({
                    FileID: ID
                }, function (res) {

                    var dataList = res.list;
                    $.each(dataList, function (i, item) {
                        item.WID = i + 1;
                        item.ImportTime = $com.util.format("yyyy-MM-dd hh:mm:ss", item.ImportTime);
                        item.UpdateTime = $com.util.format("yyyy-MM-dd hh:mm:ss", item.UpdateTime);
                    });

                    _this.AllItemList = dataList;

                    $page.init($("#table-info"), _this.AllItemList, "", function (res) {
                        _this.ItemInfoList = res;
                    });
                    $com.app.loaded();
                });

                // var list = [];

                // $.each(_this.ShipMent, function (i, item) {
                //     if (item.Code == Code) {
                //         list = item.ItemList;
                //         return false;
                //     }
                // });

                // _this.AllItemList = list;
            },
            //删除全部
            ResultDeleteAll: function () {

                var IDList = [];

                $.each(ResultList, function (i, item) {
                    IDList.push(item.ID);
                });

                _this.DeleteResult({ IDList: IDList }, function (res) {
                    _this.LookOneInfo(_this.ModuleNo);
                    alert("删除成功")
                });
            },
            //删除单个
            ResultDelete: function (ID) {

                var IDList = [ID];

                _this.DeleteResult({ IDList: IDList }, function (res) {
                    _this.LookOneInfo(_this.ModuleNo);
                    alert("删除成功")
                });

            },

            DeleteFileResultAll: function () {

            },

            reset: function () {
                _this.StartTime = "";
                _this.EndTime = "";
                _this.FileName = "";
                // _this.BalancePlateNo = "";
                // _this.ModuleNo = "";
            },

            refreshModule: function () {

                if (_this.BalancePlateNo == "" && _this.ModuleNo == "") {
                    return false;
                }

                $com.app.loading("查询中");

                var wBalancePlateNo = _this.BalancePlateNo.toUpperCase(),
                    wModuleNo = _this.ModuleNo.toUpperCase();

                _this.getModuleAll({
                    BalancePlateNo: wBalancePlateNo,
                    ModuleNo: wModuleNo
                }, function (res) {

                    var dataList = res.list;
                    $.each(dataList, function (i, item) {
                        item.WID = i + 1;
                        item.ImportTime = $com.util.format("yyyy-MM-dd hh:mm:ss", item.ImportTime);
                        item.UpdateTime = $com.util.format("yyyy-MM-dd hh:mm:ss", item.UpdateTime);
                    });

                    $page.init($("#table-info"), dataList, "", function (res) {
                        _this.ItemInfoList = res;
                    });

                    // _this.AllItemList = dataList;
                    // _this.ItemInfoList = dataList;
                    $com.app.loaded();

                });
            },

            resetModule: function () {
                // _this.StartTime = "";
                // _this.EndTime = "";
                _this.BalancePlateNo = "";
                _this.ModuleNo = "";
            },

            //导入
            Import: function () {

                $("#input-file").val("");
                $("#input-file").click();

            },

            ImportResultFile: function () {
                $("#ImportResult-file").val("");
                $("#ImportResult-file").click();
            },

            ImportResult: function (el) {
                $com.app.loading("数据导入中...");
                var $this = el.target;

                if ($this.files.length == 0)
                    return;
                var fileData = $this.files[0];

                var form = new FormData();
                form.append("file", fileData);
                _this.importResultExcel(form, function (res) {
                    if (res.list.length > 0) {
                        _this.SaveResultList(res.list);
                    }
                });
            },



            InputFileClick: function (el) {
                var $this = el.target;

                if ($this.files.length == 0)
                    return;

                if (!extLimit(['xlsx', 'xls']).has($this.files[0].name)) {
                    alert("请上传正确的Excel文件！");
                    clearFiles();
                    return;
                }
                var fileData = $this.files[0];

                var form = new FormData();
                form.append("file", fileData);
                $com.app.loading("数据导入中...");

                _this.importShipmentExcel(form, function (res) {
                    if (res.list.length > 0) {
                        var list = res.list;
                        DataAll2 = list;
                        Vague1 = DataAll2;



                        // var cat = {},
                        //     RnaderList = [];
                        $.each(DataAll2, function (i, item) {

                            item.ImportTime = $com.util.format("yyyy-MM-dd hh:mm:ss", new Date());
                            item.UpdateTime = $com.util.format("yyyy-MM-dd hh:mm:ss", new Date());

                            // if (!cat[item.Code]) {
                            //     cat[item.Code] = [];
                            //     cat[item.Code].push(item);
                            // } else {
                            //     cat[item.Code].push(item);
                            // }
                        });

                        // for (const key in cat) {
                        //     RnaderList.push({
                        //         Code: cat[key][0].Code,
                        //         ItemCount: cat[key].length,
                        //         ImportTime: cat[key][0].ImportTime,
                        //         ItemList: cat[key]
                        //     })
                        // }

                        // $.each(RnaderList, function (i, item) {
                        //     $.each(item.ItemList, function (j, jtem) {

                        //         jtem.WID = j + 1;
                        //     });
                        //     item.WID = i + 1;
                        // });

                        // _this.ShipMent = RnaderList;

                        _this.Save(DataAll2);
                        $com.app.loaded();

                    } else {
                        alert("导入表格有误，请检查后重新导入！");
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
            },
            LookOneInfo: function (ModuleNo) {
                $(".lmvt-container-supplier").hide();
                $(".lmvt-container-item").hide();
                $(".iplant-tool-center").show();

                _this.ModuleNo = ModuleNo;

                _this.refreshResult();

                // ResultList.
            },

            resultHide: function () {

                $(".lmvt-container-supplier").show();
                $(".lmvt-container-item").show();
                $(".iplant-tool-center").hide();

                _this.refresh();
            },

            //按钮点击
            searchLevelProResult: function () {
                var value = $("#zace-search-levelResult").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $page.init($("#deviceSparePart1"), _this.AllResultData, "", function (resp) {
                        _this.ResultList = resp;
                    });
                // _this.ResultList = ;
                else
                    $com.table.filterByLikeStringData($(".lmvt-deviceInfo-body"), _this.AllResultData, value, undefined, undefined, undefined, function (res) {
                        // $(".lmvt-deviceResult-body").html($com.util.template(res, HTML.TableUserItemNode));
                        $page.init($("#deviceSparePart1"), res, "", function (resp) {
                            _this.ResultList = resp;
                        });


                        // _this.ResultList = res;
                    });
            },
            //按钮点击
            searchLevelPro: function () {
                var value = $("#zace-search-level").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $page.init($("#table-info"), _this.AllItemList, "", function (resp) {
                        _this.ItemInfoList = resp;
                    });
                else
                    $com.table.filterByLikeStringData($(".lmvt-deviceResult-body"), _this.AllItemList, value, undefined, undefined, undefined, function (res) {
                        // $(".lmvt-deviceResult-body").html($com.util.template(res, HTML.TableUserItemNode));

                        $page.init($("#table-info"), res, "", function (resp) {
                            _this.ItemInfoList = resp;
                        });
                    });
                // $com.table.filterByLikeString($(".lmvt-deviceResult-body"), _this.AllResultData, value, "WID");

            },
            //按钮点击
            ShipMentSearch: function () {
                var value = $("#femi-search-text-ledger2").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    _this.ShipMent = _this.ShipMentAllData;
                else
                    $com.table.filterByLikeStringData($(".lmvt-device-body"), _this.ShipMentAllData, value, undefined, undefined, undefined, function (res) {
                        // $(".lmvt-deviceResult-body").html($com.util.template(res, HTML.TableUserItemNode));

                        _this.ShipMent = res;
                    });

            },


            checkResult: function (data, fn, context) {
                var d = {
                    $URI: "/ModuleInformation/CheckResult",
                    $TYPE: "post",
                    $SERVER: "/MESQMS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            SaveResultList: function (dataList) {

                $com.util.deleteLowerProperty(dataList);
                _this.checkResult({
                    data: dataList
                }, function (data) {
                    if (data.list && data.list.length > 0) {
                        confirm("匹配结果有重复，确认继续导入吗？", function (bool) {
                            if (bool == true) {
                                _this.saveResult({
                                    data: dataList
                                }, function (data) {
                                    _this.refresh();
                                    $com.app.loaded();
                                    alert("导入成功");
                                });
                            } else {
                                $com.app.loaded();
                                return false;
                            }
                        });
                    } else {
                        _this.saveResult({
                            data: dataList
                        }, function (data) {
                            _this.refresh();
                            $com.app.loaded();
                            alert("导入成功");
                        });
                    }


                });
            },

            Save: function (dataList) {
                $com.util.deleteLowerProperty(dataList);
                _this.checkShipment({
                    data: dataList
                }, function (data) {

                    $com.util.deleteLowerProperty(dataList[0].ItemList);

                    if (data.list && data.list.length > 0) {
                        confirm("出货码有重复，确认继续导入吗？", function (bool) {
                            if (bool == true) {
                                _this.saveShipment({
                                    data: dataList[0].ItemList
                                }, function (data) {
                                    _this.refresh();
                                });
                            } else {
                                return false;
                            }
                        });
                    } else {

                        _this.saveShipment({
                            data: dataList[0].ItemList
                        }, function (data) {
                            _this.refresh();
                        });
                    }
                });

            },

            DeleteResult: function (data, fn, context) {
                var d = {
                    $URI: "/ModuleInformation/DeleteResult",
                    $TYPE: "post",
                    $SERVER: "/MESQMS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            saveShipment: function (data, fn, context) {
                var d = {
                    $URI: "/ModuleInformation/SaveShipment",
                    $TYPE: "post",
                    $SERVER: "/MESQMS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            ShowItemList: function (el) {
                var $this = $(el.currentTarget),
                    $Contain = $this.closest(".first-contain");


                if ($this.find("img").hasClass("icon-arrow-expand")) {
                    $Contain.find(".lmvt-second").hide();
                    $this.find("img").removeClass("icon-arrow-expand");
                } else {
                    $Contain.find(".lmvt-second").show();
                    $this.find("img").addClass("icon-arrow-expand");
                }

            },
            saveResult: function (data, fn, context) {
                var d = {
                    $URI: "/ModuleInformation/SaveResult",
                    $TYPE: "post",
                    $SERVER: "/MESQMS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            checkShipment: function (data, fn, context) {
                var d = {
                    $URI: "/ModuleInformation/CheckShipment",
                    $TYPE: "post",
                    $SERVER: "/MESQMS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            importShipmentExcel: function (data, fn, context) {
                var d = {
                    $URI: "/ModuleInformation/ImportShipmentExcel",
                    $TYPE: "post",
                    $SERVER: "/MESQMS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax_load(data ? $.extend(data, d) : $.extend(d, data), fn, err, context);
            },
            importResultExcel: function (data, fn, context) {
                var d = {
                    $URI: "/ModuleInformation/ImportResultExcel",
                    $TYPE: "post",
                    $SERVER: "/MESQMS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax_load(data ? $.extend(data, d) : $.extend(d, data), fn, err, context);
            },
            getResultAll: function (data, fn, context) {
                var d = {
                    $URI: "/ModuleInformation/ResultAll",
                    $TYPE: "get",
                    $SERVER: "/MESQMS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            getModuleAll: function (data, fn, context) {
                var d = {
                    $URI: "/ModuleInformation/ModuleAll",
                    $TYPE: "get",
                    $SERVER: "/MESQMS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            getFileAll: function (data, fn, context) {
                var d = {
                    $URI: "/ModuleInformation/FileAll",
                    $TYPE: "get",
                    $SERVER: "/MESQMS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
        },
    });

    // model = $com.Model.create({
    //     name: '设备台账方案',
    //     type: $com.Model.MAIN,

    //     configure: function () {
    //         this.run();

    //     },

    //     events: function () {

    //         $("body").delegate("#lmvt-table-basic-add-templet", "click", function () {
    //             $("#input-file").val("");
    //             $("#input-file").click();

    //         });
    //         $("body").delegate("#active", "click", function () {
    //             $("#input-file1").val("");
    //             $("#input-file1").click();

    //         });
    //         //导入
    //         $("body").delegate("#input-file", "change", function () {
    //             //alert()
    //             var $this = $(this);

    //             if (this.files.length == 0)
    //                 return;
    //             var fileData = this.files[0];

    //             var form = new FormData();
    //             form.append("file", fileData);
    //             model.com.importResultExcel(form, function (res) {
    //                 if (res.list.length > 0) {
    //                     var list = res.list;
    //                     DataAll2 = list;
    //                     Vague1 = DataAll2;
    //                     $(".lmvt-device-body").html($com.util.template(list, HTML.MouduleTemplate));
    //                     $(".lmvt-device-body tr").each(function (i, item) {
    //                         var $this = $(this);
    //                         var colorName = $this.css("background-color");
    //                         $this.attr("data-color", colorName);



    //                     });
    //                     alert("导入成功，如需保存请点击保存按钮！");
    //                 } else {
    //                     alert("导入表格有误，请检查后重新导入！");
    //                 }
    //             });
    //         });
    //         //导入出货码
    //         $("body").delegate("#input-file1", "change", function () {
    //             //alert()
    //             var $this = $(this);

    //             if (this.files.length == 0)
    //                 return;
    //             var fileData = this.files[0];

    //             var form = new FormData();
    //             form.append("file", fileData);
    //             model.com.importShipmentExcel(form, function (res) {
    //                 if (res.list.length > 0) {
    //                     var list = res.list;
    //                     DataAll = list;
    //                     Vague2 = DataAll;
    //                     $(".lmvt-supplier-body").html($com.util.template(list, HTML.ActiveCode));
    //                     $(".lmvt-supplier-body tr").each(function (i, item) {
    //                         var $this = $(this);
    //                         var colorName = $this.css("background-color");
    //                         $this.attr("data-color", colorName);



    //                     });
    //                     alert("导入成功，如需保存请点击保存按钮！");
    //                 } else {
    //                     alert("导入表格有误，请检查后重新导入！");
    //                 }
    //             });
    //         });
    //         //模糊查询
    //         $("body").delegate("#femi-search-text-ledger", "change", function () {
    //             var $this = $(this),
    //                 value = $(this).val();
    //             if (value == undefined || value == "" || value.trim().length < 1)
    //                 $(".lmvt-device-body").children("tr").show();
    //             else
    //                 $com.table.filterByLikeString($(".lmvt-device-body"), Vague1, value, "ID");
    //         });
    //         //模糊查询出货码
    //         $("body").delegate("#femi-search-text-ledger2", "change", function () {
    //             var $this = $(this),
    //                 value = $(this).val();
    //             if (value == undefined || value == "" || value.trim().length < 1)
    //                 $(".lmvt-supplier-body").children("tr").show();
    //             else
    //                 $com.table.filterByLikeString($(".lmvt-supplier-body"), Vague2, value, "ID");
    //         });
    //         //条件查询
    //         $("body").delegate("#lmvt-left-check", "click", function () {
    //             var default_value = {
    //                 StartTime: new Date(),
    //                 EndTime: new Date(),
    //                 BalancePlateNo: "",
    //                 ModuleNo: "",
    //                 ProductNo: "",
    //             }
    //             $("body").append($com.modal.show(default_value, KEYWORD, "查询", function (rst) {
    //                 if (!rst || $.isEmptyObject(rst))
    //                     return;
    //                 model.com.getResultAll({
    //                     StartTime: rst.StartTime, EndTime: rst.EndTime,
    //                     BalancePlateNo: rst.BalancePlateNo, ModuleNo: rst.ModuleNo, ProductNo: rst.ProductNo,
    //                     Active: -1
    //                 }, function (data) {
    //                     $(".lmvt-device-body").html($com.util.template(data.list, HTML.MouduleTemplate));
    //                     $(".lmvt-device-body tr").each(function (i, item) {
    //                         var $this = $(this);
    //                         var colorName = $this.css("background-color");
    //                         $this.attr("data-color", colorName);



    //                     });
    //                 });
    //             }, TypeSource_Point));
    //         });
    //         //条件查询出货码
    //         $("body").delegate("#lmvt-left-check2", "click", function () {
    //             var default_value = {
    //                 StartTime: new Date(),
    //                 EndTime: new Date(),
    //                 BalancePlateNo: "",
    //                 ModuleNo: "",
    //                 //ProductNo: "",
    //             }
    //             $("body").append($com.modal.show(default_value, KEYWORD, "查询", function (rst) {
    //                 if (!rst || $.isEmptyObject(rst))
    //                     return;
    //                 model.com.getMouleAll({
    //                     StartTime: rst.StartTime, EndTime: rst.EndTime,
    //                     BalancePlateNo: rst.BalancePlateNo, ModuleNo: rst.ModuleNo,
    //                     Active: -1
    //                 }, function (data) {
    //                     $(".lmvt-supplier-body").html($com.util.template(data.list, HTML.ActiveCode));
    //                     $(".lmvt-supplier-body tr").each(function (i, item) {
    //                         var $this = $(this);
    //                         var colorName = $this.css("background-color");
    //                         $this.attr("data-color", colorName);



    //                     });
    //                 });
    //             }, TypeSource_Point));

    //         });
    //         //相关申请
    //         $("body").delegate("#out_code", "click", function () {
    //             // $("#lmvt-header-title1").text("申请单(" + data.AllApply + ")");
    //             $(".iplant-tool-right").css("width", "550px");
    //             $(".lmvt-container-device").css("margin-right", "550px");
    //             $(".iplant-tool-right").show();
    //             model.com.refresh1();
    //         });
    //         //保存出货嘛
    //         $("body").delegate("#active2", "click", function () {
    //             if (DataAll && DataAll.length > 0) {
    //                 model.com.checkShipment({
    //                     data: DataAll
    //                 }, function (data) {
    //                     if (data.info == true) {
    //                         confirm("出货码有重复，确认继续保存吗？", function (bool) {
    //                             if (bool == true) {
    //                                 model.com.saveShipment({
    //                                     data: DataAll
    //                                 }, function (data) {
    //                                     model.com.refresh1();
    //                                 });
    //                             } else {
    //                                 return false;
    //                             }
    //                         });

    //                     } else {
    //                         model.com.saveShipment({
    //                             data: DataAll
    //                         }, function (data) {
    //                             model.com.refresh1();
    //                         });
    //                     }
    //                 });
    //             } else {
    //                 alert("请先导入再保存！！！");
    //             }
    //         });
    //         //保存匹配结果
    //         $("body").delegate("#tzj-sava", "click", function () {
    //             if (DataAll2 && DataAll2.length > 0) {
    //                 model.com.checkResult({
    //                     data: DataAll2
    //                 }, function (data) {
    //                     if (data.info == true) {
    //                         confirm("匹配结果有重复，确认继续保存吗？", function (bool) {
    //                             if (bool == true) {
    //                                 model.com.saveResult({
    //                                     data: DataAll2
    //                                 }, function (data) {
    //                                     model.com.refresh();
    //                                 });
    //                             } else {
    //                                 return false;
    //                             }
    //                         });

    //                     } else {
    //                         model.com.saveResult({
    //                             data: DataAll2
    //                         }, function (data) {
    //                             model.com.refresh();
    //                         });
    //                     }
    //                 });
    //             } else {
    //                 alert("请先导入再保存！！！");
    //             }
    //         });
    //         //隐藏
    //         $("body").delegate("#active3", "click", function () {

    //             $(".lmvt-container-device").css("margin-right", "0px");
    //             $(".iplant-tool-right").hide();

    //         });
    //     },

    //     run: function () {

    //         $("#lmvt-startTime").datetimepicker({
    //             format: 'yyyy-mm-dd hh:mm',//显示格式
    //             // startView: 2,
    //             minView: 1,
    //             maxView: 1,
    //             language: 'zh-CN',
    //             autoclose: 1,//选择后自动关闭
    //             clearBtn: false,//清除按钮
    //         }).on('changeDate', function (ev) {
    //             var startTime = $("#lmvt-startTime").val();
    //             $("#lmvt-endTime").datetimepicker("setStartDate", startTime);
    //         });
    //         $("#lmvt-endTime").datetimepicker({
    //             format: 'yyyy-mm-dd hh:mm',//显示格式
    //             // startView: 2,
    //             minView: 1,
    //             maxView: 1,
    //             language: 'zh-CN',
    //             autoclose: 1,//选择后自动关闭
    //             clearBtn: false,//清除按钮
    //         }).on('changeDate', function (ev) {
    //             var endTime = $("#lmvt-endTime").val();
    //             $("#lmvt-startTime").datetimepicker("setEndDate", endTime.toString("yyyy-MM-dd"));

    //         });

    //         model.com.refresh();
    //     },

    //     com: {
    //         refresh: function () {
    //             model.com.getResultAll({
    //                 StartTime: "2010-01-01", EndTime: "2039-01-01",
    //                 BalancePlateNo: "", ModuleNo: "", ProductNo: "",
    //                 Active: -1
    //             }, function (data) {
    //                 Vague1 = data.list;
    //                 $(".lmvt-device-body").html($com.util.template(data.list, HTML.MouduleTemplate));
    //                 $(".lmvt-device-body tr").each(function (i, item) {
    //                     var $this = $(this);
    //                     var colorName = $this.css("background-color");
    //                     $this.attr("data-color", colorName);



    //                 });
    //             });
    //         },
    //         refresh1: function () {
    //             model.com.getMouleAll({
    //                 StartTime: "2010-01-01", EndTime: "2039-01-01",
    //                 BalancePlateNo: "", ModuleNo: "",
    //                 Active: -1
    //             }, function (data) {
    //                 Vague2 = data.list;
    //                 $(".lmvt-supplier-body").html($com.util.template(data.list, HTML.ActiveCode));
    //                 $(".lmvt-supplier-body tr").each(function (i, item) {
    //                     var $this = $(this);
    //                     var colorName = $this.css("background-color");
    //                     $this.attr("data-color", colorName);



    //                 });
    //             });
    //         },
    //         getMouleAll: function (data, fn, context) {
    //             var d = {
    //                 $URI: "/ModuleInformation/ModuleAll",
    //                 $TYPE: "get"
    //             };

    //             function err() {
    //                 $com.app.tip('获取失败，请检查网络');
    //             }

    //             $com.app.ajax($.extend(d, data), fn, err, context);
    //         },
    //         getResultAll: function (data, fn, context) {
    //             var d = {
    //                 $URI: "/ModuleInformation/ResultAll",
    //                 $TYPE: "get"
    //             };

    //             function err() {
    //                 $com.app.tip('获取失败，请检查网络');
    //             }

    //             $com.app.ajax($.extend(d, data), fn, err, context);
    //         },
    //         saveResult: function (data, fn, context) {
    //             var d = {
    //                 $URI: "/ModuleInformation/SaveResult",
    //                 $TYPE: "post"
    //             };

    //             function err() {
    //                 $com.app.tip('获取失败，请检查网络');
    //             }

    //             $com.app.ajax($.extend(d, data), fn, err, context);
    //         },
    //         saveShipment: function (data, fn, context) {
    //             var d = {
    //                 $URI: "/ModuleInformation/SaveShipment",
    //                 $TYPE: "post"
    //             };

    //             function err() {
    //                 $com.app.tip('获取失败，请检查网络');
    //             }
    //             $com.app.ajax($.extend(d, data), fn, err, context);
    //         },
    //         checkShipment: function (data, fn, context) {
    //             var d = {
    //                 $URI: "/ModuleInformation/CheckShipment",
    //                 $TYPE: "post"
    //             };

    //             function err() {
    //                 $com.app.tip('获取失败，请检查网络');
    //             }

    //             $com.app.ajax($.extend(d, data), fn, err, context);
    //         },
    //         checkResult: function (data, fn, context) {
    //             var d = {
    //                 $URI: "/ModuleInformation/CheckResult",
    //                 $TYPE: "post"
    //             };

    //             function err() {
    //                 $com.app.tip('获取失败，请检查网络');
    //             }
    //             $com.app.ajax($.extend(d, data), fn, err, context);
    //         },
    //         importShipmentExcel: function (data, fn, context) {
    //             var d = {
    //                 $URI: "/ModuleInformation/ImportShipmentExcel",
    //                 $TYPE: "post"
    //             };

    //             function err() {
    //                 $com.app.tip('获取失败，请检查网络');
    //             }
    //             $com.app.ajax_load(data ? $.extend(data, d) : $.extend(d, data), fn, err, context);
    //         },
    //         importResultExcel: function (data, fn, context) {
    //             var d = {
    //                 $URI: "/ModuleInformation/ImportResultExcel",
    //                 $TYPE: "post"
    //             };

    //             function err() {
    //                 $com.app.tip('获取失败，请检查网络');
    //             }
    //             $com.app.ajax_load(data ? $.extend(data, d) : $.extend(d, data), fn, err, context);
    //         },
    //     }
    // });

    // model.init();


});