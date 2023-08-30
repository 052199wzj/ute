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
    WorkShopID = BusinessUnitID = FactoryID = 0;
    DataAll = [];
    DATABasic = [];
    DataAllConfirmBasic = [];
    DataAllConfirmChange = [];
    DataAllConfirm = [];
    DataAllFactorySearch = [];
    DataAllSearch = [];
    mRecordType = 1;


    ;
    HTML = {
        TableModeSegment: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td style="min-width: 50px;display:none" data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td data-title="OrderNo" data-value="{{OrderNo}}" >{{OrderNo}}</td>',
            '<td data-title="WBSNo" data-value="{{WBSNo}}" >{{WBSNo}}</td>',
            '<td data-title="CustomerName" data-value="{{CustomerName}}" >{{CustomerName}}</td>',
            '<td data-title="LineName" data-value="{{LineName}}" >{{LineName}}</td>',
            '<td data-title="ProductNo" data-value="{{ProductNo}}" >{{ProductNo}}</td>',
            '<td data-title="PartNo" data-value="{{PartNo}}" >{{PartNo}}</td>',
            '<td data-title="FirstItemName" data-value="{{FirstItemName}}" >{{FirstItemName}}</td>',
            '<td data-title="SeconfItemName" data-value="{{SeconfItemName}}" >{{SeconfItemName}}</td>',
            '<td data-title="ThirdItemName" data-value="{{ThirdItemName}}" >{{ThirdItemName}}</td>',
            '<td data-title="FourItemName" data-value="{{FourItemName}}" >{{FourItemName}}</td>',
            '<td data-title="FiveItemName" data-value="{{FiveItemName}}" >{{FiveItemName}}</td>',
            '<td data-title="Standard" data-value="{{Standard}}" >{{Standard}}</td>',
            '<td data-title="Opinion" data-value="{{Opinion}}" >{{Opinion}}</td>',
            '<td data-title="Operator" data-value="{{Operator}}" >{{Operator}}</td>',
            '<td data-title="RelaDepartments" data-value="{{RelaDepartments}}" >{{RelaDepartments}}</td>',
            '<td data-title="RelaClassMembers" data-value="{{RelaClassMembers}}" >{{RelaClassMembers}}</td>',
            '<td data-title="Confirmation" data-value="{{Confirmation}}" >{{Confirmation}}</td>',

            '</tr>',
        ].join(""),
        TableModeException: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td style="min-width: 50px;display:none" data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td data-title="OrderNo" data-value="{{OrderNo}}" >{{OrderNo}}</td>',
            '<td data-title="WBSNo" data-value="{{WBSNo}}" >{{WBSNo}}</td>',
            '<td data-title="CustomerName" data-value="{{CustomerName}}" >{{CustomerName}}</td>',
            '<td data-title="LineName" data-value="{{LineName}}" >{{LineName}}</td>',
            '<td data-title="ProductNo" data-value="{{ProductNo}}" >{{ProductNo}}</td>',
            '<td data-title="PartNo" data-value="{{PartNo}}" >{{PartNo}}</td>',
            '<td data-title="StepName" data-value="{{StepName}}" >{{StepName}}</td>',
            '<td data-title="FirstItemName" data-value="{{FirstItemName}}" >{{FirstItemName}}</td>',
            '<td data-title="SeconfItemName" data-value="{{SeconfItemName}}" >{{SeconfItemName}}</td>',
            '<td data-title="ThirdItemName" data-value="{{ThirdItemName}}" >{{ThirdItemName}}</td>',
            '<td data-title="FourItemName" data-value="{{FourItemName}}" >{{FourItemName}}</td>',
            '<td data-title="FiveItemName" data-value="{{FiveItemName}}" >{{FiveItemName}}</td>',
            '<td data-title="Standard" data-value="{{Standard}}" >{{Standard}}</td>',

            '<td data-title="ResultDescribe" data-value="{{ResultDescribe}}" >{{ResultDescribe}}</td>',
            '<td data-title="MaterialInfo" data-value="{{MaterialInfo}}" >{{MaterialInfo}}</td>',
            '<td data-title="Picture" data-value="{{Picture}}" >{{Picture}}</td>',
            '<td data-title="Opinion" data-value="{{Opinion}}" >{{Opinion}}</td>',
            '<td data-title="RelaDepartments" data-value="{{RelaDepartments}}" >{{RelaDepartments}}</td>',
            '<td data-title="RelaClassMembers" data-value="{{RelaClassMembers}}" >{{RelaClassMembers}}</td>',

            '</tr>',
        ].join(""),
        TableModeKeyPart: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td style="min-width: 50px;display:none" data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td data-title="OrderNo" data-value="{{OrderNo}}" >{{OrderNo}}</td>',
            '<td data-title="WBSNo" data-value="{{WBSNo}}" >{{WBSNo}}</td>',
            '<td data-title="CustomerName" data-value="{{CustomerName}}" >{{CustomerName}}</td>',
            '<td data-title="LineName" data-value="{{LineName}}" >{{LineName}}</td>',
            '<td data-title="ProductNo" data-value="{{ProductNo}}" >{{ProductNo}}</td>',
            '<td data-title="PartNo" data-value="{{PartNo}}" >{{PartNo}}</td>',
            '<td data-title="ItemName" data-value="{{ItemName}}" >{{ItemName}}</td>',
         
            '<td data-title="PartsFactory" data-value="{{PartsFactory}}" >{{PartsFactory}}</td>',
            '<td data-title="PartsModal" data-value="{{PartsModal}}" >{{PartsModal}}</td>',
            '<td data-title="PartsNumber" data-value="{{PartsNumber}}" >{{PartsNumber}}</td>',
            '<td data-title="CheckResult" data-value="{{CheckResult}}" >{{CheckResult}}</td>',
            '<td data-title="MaterialInfo" data-value="{{MaterialInfo}}" >{{MaterialInfo}}</td>',
            '<td data-title="ResultDescribe" data-value="{{ResultDescribe}}" >{{ResultDescribe}}</td>',
            '<td data-title="Picture" data-value="{{Picture}}" >{{Picture}}</td>',
            '</tr>',
        ].join(""),

        TableModeRecord: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td style="min-width: 50px;display:none" data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td data-title="OrderNo" data-value="{{OrderNo}}" >{{OrderNo}}</td>',
            '<td data-title="WBSNo" data-value="{{WBSNo}}" >{{WBSNo}}</td>',
            '<td data-title="CustomerName" data-value="{{CustomerName}}" >{{CustomerName}}</td>',
            '<td data-title="LineName" data-value="{{LineName}}" >{{LineName}}</td>',
            '<td data-title="ProductNo" data-value="{{ProductNo}}" >{{ProductNo}}</td>',
            '<td data-title="PartNo" data-value="{{PartNo}}" >{{PartNo}}</td>',

            '<td data-title="StepName" data-value="{{StepName}}" >{{StepName}}</td>',
            '<td data-title="FirstItemName" data-value="{{FirstItemName}}" >{{FirstItemName}}</td>',
            '<td data-title="SeconfItemName" data-value="{{SeconfItemName}}" >{{SeconfItemName}}</td>',
            '<td data-title="ThirdItemName" data-value="{{ThirdItemName}}" >{{ThirdItemName}}</td>',
            '<td data-title="FourItemName" data-value="{{FourItemName}}" >{{FourItemName}}</td>',
            '<td data-title="FiveItemName" data-value="{{FiveItemName}}" >{{FiveItemName}}</td>',
            '<td data-title="Standard" data-value="{{Standard}}" >{{Standard}}</td>',

            '<td data-title="CheckResult" data-value="{{CheckResult}}" >{{CheckResult}}</td>',
            '<td data-title="PartsFactory" data-value="{{PartsFactory}}" >{{PartsFactory}}</td>',
            '<td data-title="PartsModal" data-value="{{PartsModal}}" >{{PartsModal}}</td>',
            '<td data-title="PartsNumber" data-value="{{PartsNumber}}" >{{PartsNumber}}</td>',
            '<td data-title="Value" data-value="{{Value}}" >{{Value}}</td>',
            '<td data-title="MaterialInfo" data-value="{{MaterialInfo}}" >{{MaterialInfo}}</td>',
            '<td data-title="ResultDescribe" data-value="{{ResultDescribe}}" >{{ResultDescribe}}</td>',
            // '<td data-title="Picture" data-value="{{Picture}}" >{{Picture}}</td>',
            '<td style="min-width: 50px" data-title="LendImages">{{LendImages}}</td>',
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
        IMGLIST: '<img src= "{{SrcList}}" style="width:25px;height:25px;"/>',

    },
        (function () {
            KEYWORD_Level_LIST = [
                "Name|名称",
                "OrderID|订单|ArrayOne",
                "StepID|工序|ArrayOne",
                "StartTime|开始时间|Date",
                "EndTime|结束时间|Date",
                "RecordType|记录类型|ArrayOne",
            ];
            KEYWORD_Level = {};
            FORMATTRT_Level = {};

            DEFAULT_VALUE_Level = {
                Name: "",
                Code: "",
            };

            TypeSource_Level = {
                StepID: [
                    {
                        name: "全部",
                        value: 0,
                    }
                ],
                OrderID: [
                    {
                        name: "全部",
                        value: 0,
                    }
                ],

                BusinessUnitID: [
                    {
                        name: "无",
                        value: 0,
                        far: 0
                    }
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
                RecordType: [
                    {
                        name: "段改要求项目",
                        value: 1,
                    },
                    {
                        name: "异常信息汇总",
                        value: 2,
                    },
                    {
                        name: "关键部件入场检查",
                        value: 3,
                    }, {
                        name: "预检控制记录",
                        value: 4,
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
        name: '机车入场',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            window.setFunctionTrigger("PartPreCheckRecordO", function (res) {

                mOrderID = res.ID;
                mPartNo = res.PartNo;

                mProductNo = res.Name;


                mPartNo=mProductNo+'#'+mPartNo;

             
                model.com.refresh();

            });

            $("body").delegate("#zace-refresh-po", "click", function () {

                model.com.refresh();


            });

            //修改
            $("body").delegate("#zace-edit-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "WID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }

                var default_value = {
                    Name: SelectData[0].Name,
                    Code: SelectData[0].Code,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].Name = rst.Name;
                    SelectData[0].Code = rst.Code;

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

            //申请 条件查询
            $("body").delegate("#zace-searchZall-level", "click", function () {
                var default_value = {
                    // OrderID:mOrderID,
                    // RecordType: mRecordType,
                    StepID: mStepID,
                    StartTime: $com.util.format('yyyy-MM-dd', new Date(mStartTime)),
                    EndTime: $com.util.format('yyyy-MM-dd', new Date(mEndTime)),

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    // default_value.RecordType = eval(rst.RecordType.toLowerCase());
                    //mOrderID=Number(rst.OrderID);
                    mStepID = Number(rst.StepID);
                    // mRecordType = Number(rst.RecordType);
                    mStartTime = $com.util.format('yyyy-MM-dd', new Date(rst.StartTime));
                    mEndTime = $com.util.format('yyyy-MM-dd', new Date(rst.EndTime));
                    model.com.refresh();

                }, TypeSource_Level));


            });
            //Enter触发模糊查询事件
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var
                        value = $("#zace-search-level").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $(".femi-riskLevel-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($(".femi-riskLevel-tbody"), DataAllFactorySearch, value, "WID");
                }
            });
            //我的申请  工序库查询
            $("body").delegate("#zace-searchZall-levelZace", "click", function () {

                var
                    value = $("#zace-search-level").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $(".femi-riskLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($(".femi-riskLevel-tbody"), DataAllFactorySearch, value, "WID");



            });

          
        },




        run: function () {
            mOrderID = 0;
            mStartTime = mStartTime = $com.util.format('yyyy-MM-dd', new Date() - 7 * 1000 * 60 * 60 * 24);
            mEndTime = $com.util.format('yyyy-MM-dd', new Date());
            mStepID = 0;
            mRecordType = 4;

            mOrderID=model.query.id;

            mProductNo=model.query.name;
            mPartNo=model.query.PartNo;

            mPartNo=mProductNo+'#'+mPartNo;
            model.com.getFPCPartPoint({}, function (resP) {
                if (!resP)
                    return;
                if (resP && resP.list) {
                    $.each(resP.list, function (i, item) {
                        if (item.StepType == 2&&item.Active==1) {
                            TypeSource_Level.StepID.push({
                                name: item.Name,
                                value: item.ID,
                            });
                        }

                    });
                    model.com.refresh();
                }
            });



        },

        com: {
            //查询工序列表   StepType 2  预检
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
            refresh: function () {
                 $com.app.loading('数据加载中...');
                //申请
                model.com.getPreCheckRecord({ OrderID: mOrderID, RecordType: mRecordType }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var Grade = $com.util.Clone(resP.list);
                        DATABasic = $com.util.Clone(resP.list);

                        DataAll = $com.util.Clone(Grade);

                        $.each(Grade, function (i, item) {
                            // for (var p in item) {
                            //     if (!FORMATTRT_Level[p])
                            //         continue;
                            //     item[p] = FORMATTRT_Level[p](item[p]);
                            // }
                            item.WID = i + 1;
                            item.PartNo = item.PartNo.split('#')[1];

                            item.PathList = item.Picture.split(",");
                            ImagePathArray = [];
                            for (var k = 0; k < item.PathList.length; k++) {
                                SrcListObj = {
                                    ID: k + 1,
                                    SrcList: item.PathList[k]
                                }
                                if (SrcListObj.SrcList != "") {
                                    ImagePathArray.push(SrcListObj);
                                }
                            }
                            if (ImagePathArray.length > 0) {
                                item.LendImages = $com.util.template(ImagePathArray, HTML.IMGLIST);
                            } else {
                                item.LendImages = "";
                            }

                            item.ItemList = item.ItemName.split('+|;|+');
                            switch (item.ItemList.length) {
                                case 1:
                                    item.FirstItemName = item.ItemList[0];
                                    item.SeconfItemName = '';
                                    item.ThirdItemName = '';
                                    item.FourItemName = '';
                                    item.FiveItemName = '';

                                    break;

                                case 2:
                                    item.FirstItemName = item.ItemList[0];
                                    item.SeconfItemName = item.ItemList[1];
                                    item.ThirdItemName = '';
                                    item.FourItemName = '';
                                    item.FiveItemName = '';
                                    break;
                                case 3:
                                    item.FirstItemName = item.ItemList[0];
                                    item.SeconfItemName = item.ItemList[1];
                                    item.ThirdItemName = item.ItemList[2];
                                    item.FourItemName = '';
                                    item.FiveItemName = '';
                                    break;
                                case 4:
                                    item.FirstItemName = item.ItemList[0];
                                    item.SeconfItemName = item.ItemList[1];
                                    item.ThirdItemName = item.ItemList[2];
                                    item.FourItemName = item.ItemList[3];
                                    item.FiveItemName = '';
                                    break;
                                case 5:
                                    item.FirstItemName = item.ItemList[0];
                                    item.SeconfItemName = item.ItemList[1];
                                    item.ThirdItemName = item.ItemList[2];
                                    item.FourItemName = item.ItemList[3];
                                    item.FiveItemName = item.ItemList[4];
                                    break;

                                default:
                                    item.FirstItemName = '';
                                    item.SeconfItemName = '';
                                    item.ThirdItemName = '';
                                    item.FourItemName = '';
                                    item.FiveItemName = '';
                                    break;
                            }
                        });
                        DataAllFactorySearch = $com.util.Clone(Grade);
                        // $("#femi-riskLevel-tbody").html($com.util.template(Grade, HTML.TableMode));
                        switch (mRecordType) {
                            case 1:
                                $('.zace-titleText').text('【'+mPartNo+'】'+'段改要求项目');
                                $('.table-ZacePreSegment').show();
                                //$('.table-ZacePreSegment tbody').addClass('femi-riskLevel-tbody')

                                $('.table-ZacePreException').hide();
                                $('.table-ZacePreKeyPart').hide();
                                $('.table-ZacePreRecord').hide();
                                $(".femi-riskLevel-tbody").html($com.util.template(Grade, HTML.TableModeSegment));
                                break;
                            case 2:
                                $('.zace-titleText').text('【'+mPartNo+'】'+'异常信息汇总');
                                $('.table-ZacePreSegment').hide();
                                $('.table-ZacePreException').show();
                                $('.table-ZacePreKeyPart').hide();
                                $('.table-ZacePreRecord').hide();
                                $(".femi-riskLevel-tbody").html($com.util.template(Grade, HTML.TableModeException));
                                break;
                            case 3:
                                $('.zace-titleText').text('【'+mPartNo+'】'+'关键部件检查');
                                $('.table-ZacePreSegment').hide();
                                $('.table-ZacePreException').hide();
                                $('.table-ZacePreKeyPart').show();
                                $('.table-ZacePreRecord').hide();
                                $(".femi-riskLevel-tbody").html($com.util.template(Grade, HTML.TableModeKeyPart));
                                break;
                            case 4:
                                $('.zace-titleText').text('【'+mPartNo+'】'+'预检控制记录');
                                $('.table-ZacePreSegment').hide();
                                $('.table-ZacePreException').hide();
                                $('.table-ZacePreKeyPart').hide();
                                $('.table-ZacePreRecord').show();
                                $(".femi-riskLevel-tbody").html($com.util.template(Grade, HTML.TableModeRecord));
                                break;

                            default:
                                break;
                        }
                        window.parent._zacePartSet = 1;

                        $com.app.loaded();

                        //$page.getPage(Grade, "#femi-riskLevel-tbody", HTML.TableMode, ".table-part");
                    }

                });




            },
            //查询
            getPreCheckRecord: function (data, fn, context) {
                var d = {
                    $URI: "/IPTOrderReport/PreCheckRecord",
                    $TYPE: "get",
                    $SERVER: '/MESQMS'
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
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