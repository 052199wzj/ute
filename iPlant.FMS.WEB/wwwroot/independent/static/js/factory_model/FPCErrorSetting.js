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

        mCodeText='';
    mRecordID = 0;
    RouteID = 0;
    DataAll = [];
    DATABasic = [];
    DataAllConfirmBasic = [];
    DataAllConfirmChange = [];
    DataAllConfirm = [];
    DataAllFactorySearch = DataAllSearch = [];
  

    ;
    HTML = {
        TableMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',

            '<td data-title="Code" data-value="{{Code}}" >{{Code}}</td>',
            '<td data-title="ImportType" data-value="{{ImportType}}" >{{ImportType}}</td>',
            '<td data-title="FileName" data-value="{{FileName}}" >{{FileName}}</td>',
            '<td data-title="DataCount" data-value="{{DataCount}}" >{{DataCount}}</td>',
            '<td data-title="ErrorCount" data-value="{{ErrorCount}}" >{{ErrorCount}}</td>',
            '<td style="color:{{ColorText}}" data-title="Result" data-value="{{Result}}" >{{Result}}</td>',
            '<td data-title="Operator" data-value="{{Operator}}" >{{Operator}}</td>',
            '<td data-title="OperateTime" data-value="{{OperateTime}}" >{{OperateTime}}</td>',

            '</tr>',
        ].join(""),

        TablePartMode: [
            '<tr>',

            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            // '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
            '<td data-title="Message" data-value="{{Message}}" >{{Message}}</td>',

            '</tr>',
        ].join(""),



    };
    (function () {
        KEYWORD_Level_LIST = [

            "ImportType|导入类型|ArrayOne",
            "Result|结果|ArrayOne",
            "OperateTime|时间|DateTime",
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
            Result: [
                {
                    name: "成功",
                    value: 1
                },
                {
                    name: "失败",
                    value: 2
                },
                {
                    name: "导入中",
                    value: 3
                },
            ],
            ImportType: [
                {
                    name: "工艺BOP",
                    value: 1
                }, {
                    name: "标准BOM",
                    value: 2
                }, {
                    name: "检验标准",
                    value: 3
                },{
                    name: "物料",
                    value: 4
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
        name: '岗位',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {

            window.setFunctionTrigger("FPCErrorSettingBop", function (res) {

                mType = res.ID;
                $(".zzzb").hide();
                $(".zzza").css("margin-right", "0px");
                $(".zzzc").css("width", "0px");
                $(".zzzc").hide();

                if (mType==3) {
                    $('.bomCompare').show();
                }else{
                    $('.bomCompare').hide();
                }
                   
                
                model.com.refresh();
                // alert(res.ID);
                //刷新
            });
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

                var vdata = { 'header': '检验规程对比', 'href': './report/CompareSettingCheckMode.html?aid=' + SelectData[0].ID+'&bid='+SelectData[1].ID, 'id': 'CompareSettingCheckMode', 'src': './static/images/menu/newfactoryModel/techniquePart.png' };
                window.parent.iframeHeaderSet(vdata);
                window.callFunctionTrigger("CompareSettingCheckMode", { AID: SelectData[0].ID,BID:SelectData[1].ID });


            });
            $("body").delegate("#zace-routePart-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }

                // var vdata = { 'header': '工艺集', 'href': './factory_model/FPCRoutePartSetting.html', 'id': 'FPCRoutePart', 'src': './static/images/menu/newfactoryModel/techniquePart.png' };
                // window.parent.iframeHeaderSet(vdata);

                var vdata = { 'header': '工艺集', 'href': './factory_model/FPCRoutePartSetting.html?id=' + SelectData[0].ID, 'id': 'FPCRoutePart', 'src': './static/images/menu/newfactoryModel/techniquePart.png' };
                window.parent.iframeHeaderSet(vdata);
                window.callFunctionTrigger("FPCRoutePart", { ID: SelectData[0].ID });


            });
            //双击.
            $("body").delegate("#femi-riskLevel-tbody tr", "dblclick", function () {

                var $this = $(this);
                var $table = $this.closest("table");
                var WID = Number($this.find('td[data-title=ID]').attr('data-value'));
                mCodeText = $this.find('td[data-title=Code]').attr('data-value');
                mRecordID = WID;

                // $table.find("tbody tr").each(function (i, item) {
                //     var $tr = $(this);

                //     if (WID == Number($tr.find("td[data-title=ID]").attr("data-value"))) {
                //         $tr.css('background-color', '#7bf1b5');
                //         temp = true;

                //     }
                //     else {
                //         if (!($tr.attr("data-color"))) {

                //             $tr.css('background-color', '');
                //         } else {

                //             var colorPro = $tr.attr("data-color");
                //             $tr.css('background-color', colorPro);
                //         }
                //     }
                // });

                model.com.refreshPart();
                $(".zzzb").hide();
                //$(".zzza").css("width", "70%");
                //$(".zzzc").css("width", "29%");
                $(".zzzc").css("width", "450px");
                $(".zzza").css("margin-right", "450px");
                $(".zzzc").show();


                return false;
            });
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
            $("body").delegate("#zace-zace-refresh", "click", function () {
                model.com.refresh();
            });
            $("body").delegate("#zace-searchApprovalItem-level", "click", function () {
                var value = $("#zace-searchItem-approval").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskPart-tbody").children("tr").show();
                else
                    //     DataAllproduct = [];
                    // for (var i = 0; i < DataAllFactorySearch.length; i++) {
                    //     if (DataAllFactorySearch[i].Active == "启用") {
                    //         DataAllproduct.push(DataAllFactorySearch[i]);
                    //     }
                    // }
                    $com.table.filterByLikeString($("#femi-riskPart-tbody"), DataAllFactorySearchItem, value, "ID");
            });
            //隐藏
            $("body").delegate("#zace-closePart-level", "click", function () {

                $(".zzzb").hide();
                $(".zzza").css("margin-right", "0px");
                $(".zzzc").css("width", "0px");
                $(".zzzc").hide();

                model.com.refresh();
            });

        },




        run: function () {

            $(".zzzb").hide();
            $(".zzza").css("margin-right", "0px");
            $(".zzzc").css("width", "0px");
            $(".zzzc").hide();
            mType=0;

            if (model.query.id) {
                mType=model.query.id;
            }
           
            if (mType==3) {
                $('.bomCompare').show();
            }else{
                $('.bomCompare').hide();
            }
            
            model.com.refresh();
        },

        com: {
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

            refresh: function () {
                $com.app.loading('数据加载中...');
                $('.zace-header-title').html('('+FORMATTRT_Level['ImportType'](mType)+')导入日志');
                model.com.getIMPResultRecordAll({ImportType:mType}, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var Grade = $com.util.Clone(resP.list);
                        DATABasic = $com.util.Clone(resP.list);

                        //审核数据
                        DataAllConfirm = $com.util.Clone(resP.list);
                        for (var i = 0; i < Grade.length; i++) {
                            Grade[i].WID = i + 1;
                            if (Grade[i].Result==1) {
                                Grade[i].ColorText = 'green'
                            } else {
                                Grade[i].ColorText = 'red'
                            }
                        }
                        DataAll = $com.util.Clone(Grade);

                        $.each(Grade, function (i, item) {
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
                $('.zaceCodeText').html(mCodeText+'详情');
                model.com.getIMPErrorRecordAll({ ParentID: mRecordID }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var Grade = $com.util.Clone(resP.list);
                        var _listOrder = $com.util.Clone(resP.list);

                        $.each(Grade, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }
                            item.WID = i + 1;
                        });
                        DataAllFactorySearchItem = $com.util.Clone(Grade);


                        $("#femi-riskPart-tbody").html($com.util.template(Grade, HTML.TablePartMode));
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
            //查询日志详情
            getIMPErrorRecordAll: function (data, fn, context) {
                var d = {
                    $URI: "/IMPErrorRecord/All",
                    $TYPE: "get",
                    $SERVER: '/MESQMS'
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询日志列表
            getIMPResultRecordAll: function (data, fn, context) {
                var d = {
                    $URI: "/IMPResultRecord/All",
                    $TYPE: "get",
                    $SERVER: '/MESQMS'
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