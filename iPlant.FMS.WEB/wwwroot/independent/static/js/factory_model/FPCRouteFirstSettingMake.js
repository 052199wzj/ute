require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/jquery.treeview', '../static/utils/js/base/tooltip', '../static/utils/js/base/route_new'], function ($zace, $com, $treeview, $tooltip, $route) {

    var KEYWORD_Level_LIST,
        KEYWORD_Level,
        FORMATTRT_Level,
        DEFAULT_VALUE_Level,
        TypeSource_Level,

        KEYWORD_Level_LISTSe,
        KEYWORD_LevelSe,
        FORMATTRT_LevelSe,
        DEFAULT_VALUE_LevelSe,
        TypeSource_LevelSe,

        model,
        DataAll,
        DATABasic,
        DDDBasic,
        DataAllConfirmBasic,
        DataAllConfirmChange,
        DataAllConfirm,
        DataAllSearch,
        DataAllFactorySearch,
        DATARouteList,
        mPartID,
        RouteID,
        mPartName,
        HTML;

    //流程图
    var DataTemp = {
        level: 0,
        list: []
    }
    var SelectedName = '';
    var mParentStepID = 0;
    var SecondList = [];  //二级流程名
    var mRouteIDZace = 0;
    mPartID = 0;
    SelectedLine = 0;
    RouteID = 0;
    mPartName = "";
    DataAll = DATARouteList = [];
    DATABasic = [];
    DDDBasic = [];
    DataAllConfirmBasic = [];
    DataAllConfirmChange = [];
    DataAllConfirm = [];
    DataAllFactorySearch = [];
    DataAllSearch = [];

    RouteNextMode = {
        NextID: 0,
        NextCondition: '',
        Name: '',

    };
    PositionTemp = {
        CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Creator: window.parent.User_Info.Name,
        CreatorID: 0,
        ID: 0,
        Name: "",
        OrderID: 1,
        RouteID: 0,
        EntryID: 0,
        PrevID: 0,
        RouteNextList: [],
        StepLevel: 1,
        ParentStepID: 0,
        RouteLevelName: ''

    };
    ;
    HTML = {

        TableLiItemNode: [
            '<li data-value="{{value}}"  data-name="{{name}}"> ',
            '<a href="javascript:;"> ',
            '<span class=" glyphicon glyphicon-ok" aria-hidden="true" >{{name}}</span> ',
            '</a> ',
            '</li> ',
        ].join(""),
        TableMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',

            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
            '<td style="display:none" data-title="RouteID" data-value="{{RouteID}}" >{{RouteID}}</td>',
            '<td data-title="RouteName" data-value="{{RouteName}}" >{{RouteName}}</td>',
            '<td data-title="EntityID" data-value="{{EntityID}}" >{{EntityID}}</td>',
            // '<td data-title="PrevID" data-value="{{PrevID}}" >{{PrevID}}</td>',
            // '<td data-title="NextID" data-value="{{NextID}}" >{{NextID}}</td>',
            '<td data-title="OrderID" data-value="{{OrderID}}" >{{OrderID}}</td>',

            '</tr>',
        ].join(""),

        TableSecondMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',

            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
            '<td style="display:none" data-title="RouteID" data-value="{{RouteID}}" >{{RouteID}}</td>',
            '<td data-title="EntityID" data-value="{{EntityID}}" >{{EntityID}}</td>',
            // '<td data-title="PrevID" data-value="{{PrevID}}" >{{PrevID}}</td>',
            // '<td data-title="NextID" data-value="{{NextID}}" >{{NextID}}</td>',
            '<td data-title="OrderID" data-value="{{OrderID}}" >{{OrderID}}</td>',

            '</tr>',
        ].join(""),
        TablePartMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',

            '<td data-title="PartPointName" data-value="{{PartPointName}}" >{{PartPointName}}</td>',
            '<td data-title="OrderID" data-value="{{OrderID}}" >{{OrderID}}</td>',
            '<td data-title="RouteName" data-value="{{RouteName}}" >{{RouteName}}</td>',
            '<td data-title="PartName" data-value="{{PartName}}" >{{PartName}}</td>',
            '</tr>',
        ].join(""),



    };
    (function () {
        KEYWORD_Level_LIST = [
            "Name|一级流程名",
            "RouteID|流程方案|ArrayOne",
            "RouteIDShow|产品路线|ArrayOne",
            "EntityID|工位|ArrayOne",
            "PrevID|上层|ArrayOne",
            "NextID|下层|Array",
            "OrderID|层级",

            'RouteLevelNameSecond|二级流程',
            "SecondLevel|二级|ArrayOne",
            "CreateTime|时间|DateTime",
        ];
        KEYWORD_Level = {};
        FORMATTRT_Level = {};

        DEFAULT_VALUE_Level = {
            // PartID: 0,
            Name: "",
            PrevID: 0,
            OrderID: 1,
            //RouteID: 0,
        };

        TypeSource_Level = {
            SecondLevel: [],
            RouteIDShow: [
                //{
                //    name: "全部",
                //    value: 0,
                //}
            ],
            RouteID: [
                {
                    name: "无",
                    value: 0,
                }
            ],
            PrevID: [
                {
                    name: "无",
                    value: 0,
                }
            ],
            NextID: [{
                name: "无",
                value: 0,
            }],
            EntityID: [
                {
                    name: "无",
                    value: 0,
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

    (function () {
        KEYWORD_Level_LISTSe = [
            "Name|二级流程名",
            "RouteID|流程方案|ArrayOne",
            "RouteIDShow|产品路线|ArrayOne",
            "EntityID|工位|ArrayOne",
            "PrevID|上层|ArrayOne",
            "NextID|下层|Array",
            "OrderID|层级",

            'RouteLevelNameSecond|二级流程',
            "SecondLevel|二级|ArrayOne",
            "CreateTime|时间|DateTime",
        ];
        KEYWORD_LevelSe = {};
        FORMATTRT_LevelSe = {};

        DEFAULT_VALUE_LevelSe = {
            // PartID: 0,
            Name: "",
            PrevID: 0,
            OrderID: 1,
            //RouteID: 0,
        };

        TypeSource_LevelSe = {
            SecondLevel: [],
            RouteIDShow: [
                //{
                //    name: "全部",
                //    value: 0,
                //}
            ],
            RouteID: [
                {
                    name: "无",
                    value: 0,
                }
            ],
            PrevID: [
                {
                    name: "无",
                    value: 0,
                }
            ],
            NextID: [{
                name: "无",
                value: 0,
            }],
            EntityID: [
                {
                    name: "无",
                    value: 0,
                }
            ],
        };

        $.each(KEYWORD_Level_LISTSe, function (i, item) {
            var detail = item.split("|");
            KEYWORD_LevelSe[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_LevelSe[detail[0]] = $com.util.getFormatter(TypeSource_LevelSe, detail[0], detail[2]);
            }
        });
    })();

    model = $com.Model.create({
        name: '产品工序',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            $("body").delegate("#zace-zace-refresh", "click", function () {

                model.com.refresh();

            });
            
            window.setFunctionTrigger("FPCRoutePartMake", function (res) {

                mRouteIDZace = res.ID;
                model.com.loadZace();
                // alert(res.ID);
                //刷新
            });

            //zace-edit-levelSeThird

            $("body").delegate("#zace-edit-levelSeThird", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！")
                    return;
                }

                if (SelectData[0].EntityID < 1) {
                    alert("请先设置工位！")
                    return;
                }
                var vdata = { 'header': '三级流程', 'href': './factory_model/FPCRoutePartPointSettingTest.html?id='+SelectData[0].EntityID+'&routeID='+SelectData[0].RouteID, 'id': 'FPCRoutePartPointSettingTest', 'src': './static/images/menu/newfactoryModel/techniquePart.png' };
                window.parent.iframeHeaderSet(vdata);
                window.callFunctionTrigger("FPCRoutePartPointSettingTest",{ID:SelectData[0].EntityID,RouteID:SelectData[0].RouteID});

            });

            //zace-edit-levelSecondToThird

            $("body").delegate("#zace-edit-levelSecondToThird", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-riskPart-tbody"), "ID", DataAllSe);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！")
                    return;
                }
                if (SelectData[0].StepLevel== 1) {
                    alert("请选择二级流程！")
                    return;
                }
                var vdata = { 'header': '三级流程', 'href': './factory_model/FPCRoutePartPointSettingTest.html?id='+SelectData[0].EntityID+'&routeID='+SelectData[0].RouteID, 'id': 'FPCRoutePartPointSettingTest', 'src': './static/images/menu/newfactoryModel/techniquePart.png' };
                window.parent.iframeHeaderSet(vdata);
                window.callFunctionTrigger("FPCRoutePartPointSettingTest",{ID:SelectData[0].EntityID,RouteID:SelectData[0].RouteID});

            });
            //双击.
            // $("body").delegate("#femi-riskLevel-tbody tr", "dblclick", function () {

            //     var $this = $(this);
            //     var $table = $this.closest("table");
            //     var WID = Number($this.find('td[data-title=ID]').attr('data-value'));
            //     var WRouteID = Number($this.find('td[data-title=RouteID]').attr('data-value'));
            //     mPartName = $this.find('td[data-title=PartID]').attr('data-value');
            //     RouteID = WRouteID;
            //     mPartID = WID;
            //     model.com.refreshPartPoint();

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

            //     $(".zzzb").hide();
            //     //$(".zzza").css("width", "70%");
            //     //$(".zzzc").css("width", "29%");
            //     $(".zzzc").css("width", "650px");
            //     $(".zzza").css("margin-right", "650px");
            //     $(".zzzc").show();
            //     return false;
            // });


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
            //工序段查询
            $("body").delegate("#zace-myAudit-levelZace", "click", function () {

                var
                    value = $("#zace-search-level").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAllFactorySearch, value, "ID");



            });
            //工序段修改
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
                var default_value = {
                    Name: SelectData[0].Name,
                    // VersionNo: SelectData[0].VersionNo,
                    // PartID: SelectData[0].PartID,
                    OrderID: SelectData[0].OrderID,
                    PrevID: SelectData[0].PrevID,

                };


                var _prevData = $com.util.Clone(SelectData);
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].Name = rst.Name;
                    // SelectData[0].VersionNo = rst.VersionNo;
                    // SelectData[0].PartID = Number(rst.PartID);
                    SelectData[0].PrevID = Number(rst.PrevID);



                    SelectData[0].OrderID = Number(rst.OrderID);

                    if (Number(rst.OrderID) <= 0) {
                        alert("顺序大于0!")
                        return false;
                    }

                    if (Number(rst.PrevID) == SelectData[0].ID) {
                        alert("不能选自己！")
                        return false;
                    }
                    // for (var i = 0; i < SelectData.length; i++) {
                    //     $com.util.deleteLowerProperty(SelectData[i]);
                    // }



                    // model.com.updateStep({
                    //     data: SelectData[0],
                    // }, function (res) {
                    //     alert("修改成功");
                    //     $("#zace-closePart-level").click();
                    //     //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                    //     //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    // })


                    // _prevData
                    // for
                    $com.util.deleteLowerProperty(SelectData[0]);
                    model.com.updateStep({
                        data: SelectData[0],
                    }, function (res) {

                        var _NextID = SelectData[0].ID;
                        var _list = [];//找出上级  然后修改
                        $.each(DataAll, function (i, item) {

                            if (SelectData[0].PrevID > 0) {

                                var _mode = $com.util.Clone(RouteNextMode);
                                if (SelectData[0].PrevID == item.ID) {


                                    var _bool = true;
                                    for (var k = 0; k < item.RouteNextList.length; k++) {
                                        if (_NextID == item.RouteNextList[k].NextID) {
                                            _bool = false;
                                        }
                                    }


                                    if (_bool) {
                                        _mode.NextID = _NextID;

                                        //模板
                                        item.RouteNextList.push(_mode);
                                    }

                                    _list.push(item);

                                }
                            }


                        });
                        $.each(DataAll, function (i, item) {
                            if (_prevData[0].PrevID > 0) {

                                var _mode = $com.util.Clone(RouteNextMode);
                                if (_prevData[0].PrevID == item.ID) {


                                    var _bool = false;
                                    var _RNlength = item.RouteNextList.length;
                                    for (var k = 0; k < _RNlength; k++) {
                                        if (_NextID == item.RouteNextList[k].NextID) {
                                            item.RouteNextList.splice(k, 1);
                                            _bool = true;
                                            k--;
                                            _RNlength--;
                                        }
                                    }


                                    if (_bool) {

                                        $.each(_list, function (_i, i_item) {
                                            if (i_item.ID == item.ID)
                                                _bool = false;
                                        });

                                        if (_bool)
                                            _list.push(item);
                                    }
                                }
                            }
                        });

                        var p = 0;
                        var WhileAddz = function () {
                            $com.app.loading();
                            $com.util.deleteLowerProperty(_list[p]);
                            model.com.updateStep({
                                data: _list[p],
                            }, function (res) {
                                p++;

                                if (p == _list.length) {
                                    $com.app.loaded();

                                    alert("修改成功");
                                    $("#zace-closePart-level").click();
                                } else {
                                    WhileAddz();
                                }
                            });

                        }
                        if (_list.length <= 0) {
                            alert("修改成功");
                            $("#zace-closePart-level").click();
                        } else {
                            WhileAddz();
                        }




                    })
                }, TypeSource_Level));


            });
            //zace-remove-levelSecond
            $("body").delegate("#zace-edit-levelSeToPoint", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);



                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！")
                    return;
                }


      


            });

            $("body").delegate("#zace-edit-levelSePart", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);



                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                var default_value = {
                    //Name: SelectData[0].Name,
                    // VersionNo: SelectData[0].VersionNo,
                    EntityID: SelectData[0].EntityID,
                    //OrderID: SelectData[0].OrderID,
                    //PrevID: SelectData[0].PrevID,

                };


                var _prevData = $com.util.Clone(SelectData);
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    //SelectData[0].Name = rst.Name;
                    // SelectData[0].VersionNo = rst.VersionNo;
                    // SelectData[0].PartID = Number(rst.PartID);
                    SelectData[0].EntityID = Number(rst.EntityID);



                    //SelectData[0].OrderID = Number(rst.OrderID);

                    // if (Number(rst.OrderID) <= 0) {
                    //     alert("顺序大于0!")
                    //     return false;
                    // }

                    // if (Number(rst.PrevID) == SelectData[0].ID) {
                    //     alert("不能选自己！")
                    //     return false;
                    // }
                    // for (var i = 0; i < SelectData.length; i++) {
                    //     $com.util.deleteLowerProperty(SelectData[i]);
                    // }



                    // model.com.updateStep({
                    //     data: SelectData[0],
                    // }, function (res) {
                    //     alert("修改成功");
                    //     $("#zace-closePart-level").click();
                    //     //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                    //     //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    // })


                    // _prevData
                    // for
                    $com.util.deleteLowerProperty(SelectData[0]);
                    model.com.updateStep({
                        data: SelectData[0],
                    }, function (res) {


                        alert("修改成功");
                        $("#zace-closePart-level").click();





                    })
                }, TypeSource_Level));


            });

            $("body").delegate("#zace-edit-levelSecondPart", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskPart-tbody"), "ID", DataAllSe);



                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                if (SelectData[0].StepLevel == 1) {
                    alert("请选择二级流程");
                    return;
                }
                var default_value = {
                    //Name: SelectData[0].Name,
                    // VersionNo: SelectData[0].VersionNo,
                    EntityID: SelectData[0].EntityID,
                    //OrderID: SelectData[0].OrderID,
                    //PrevID: SelectData[0].PrevID,

                };


                var _prevData = $com.util.Clone(SelectData);
                $("body").append($com.modal.show(default_value, KEYWORD_LevelSe, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    //SelectData[0].Name = rst.Name;
                    // SelectData[0].VersionNo = rst.VersionNo;
                    // SelectData[0].PartID = Number(rst.PartID);
                    SelectData[0].EntityID = Number(rst.EntityID);



                    //SelectData[0].OrderID = Number(rst.OrderID);

                    // if (Number(rst.OrderID) <= 0) {
                    //     alert("顺序大于0!")
                    //     return false;
                    // }

                    // if (Number(rst.PrevID) == SelectData[0].ID) {
                    //     alert("不能选自己！")
                    //     return false;
                    // }
                    // for (var i = 0; i < SelectData.length; i++) {
                    //     $com.util.deleteLowerProperty(SelectData[i]);
                    // }



                    // model.com.updateStep({
                    //     data: SelectData[0],
                    // }, function (res) {
                    //     alert("修改成功");
                    //     $("#zace-closePart-level").click();
                    //     //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                    //     //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    // })


                    // _prevData
                    // for
                    $com.util.deleteLowerProperty(SelectData[0]);
                    model.com.updateStep({
                        data: SelectData[0],
                    }, function (res) {


                        alert("修改成功");
                        model.com.refreshSecond();





                    })
                }, TypeSource_LevelSe));


            });

            $("body").delegate("#zace-remove-levelSecond", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskPart-tbody"), "ID", DataAllSe);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能对一行数据操作！")
                    return;
                }
                if (!confirm("确定删除此数据吗？")) {
                    return;
                }

                model.com.deleteStep({
                    RouteID: SelectData[0].RouteID,
                    ID: SelectData[0].ID,
                }, function (res) {
                    alert("删除成功");
                    model.com.refreshSecond();
                    //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                    //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                })




            });

            //zace-edit-levelSecond
            $("body").delegate("#zace-edit-levelSecond", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskPart-tbody"), "ID", DataAllSe);



                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }
                if (SelectData[0].StepLevel == 1) {
                    alert("请选择二级流程");
                    return;
                }
                var default_value = {
                    Name: SelectData[0].Name,
                    // VersionNo: SelectData[0].VersionNo,
                    // PartID: SelectData[0].PartID,
                    OrderID: SelectData[0].OrderID,
                    PrevID: SelectData[0].PrevID,

                };


                var _prevData = $com.util.Clone(SelectData);
                $("body").append($com.modal.show(default_value, KEYWORD_LevelSe, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].Name = rst.Name;
                    // SelectData[0].VersionNo = rst.VersionNo;
                    // SelectData[0].PartID = Number(rst.PartID);
                    SelectData[0].PrevID = Number(rst.PrevID);



                    SelectData[0].OrderID = Number(rst.OrderID);

                    if (Number(rst.OrderID) <= 0) {
                        alert("顺序大于0!")
                        return false;
                    }

                    if (Number(rst.PrevID) == SelectData[0].ID) {
                        alert("不能选自己！")
                        return false;
                    }

                    $com.util.deleteLowerProperty(SelectData[0]);
                    model.com.updateStep({
                        data: SelectData[0],
                    }, function (res) {

                        var _NextID = SelectData[0].ID;
                        var _list = [];//找出上级  然后修改
                        $.each(DataAllSe, function (i, item) {

                            if (SelectData[0].PrevID > 0) {

                                var _mode = $com.util.Clone(RouteNextMode);
                                if (SelectData[0].PrevID == item.ID && item.StepLevel == 2) {


                                    var _bool = true;
                                    for (var k = 0; k < item.RouteNextList.length; k++) {
                                        if (_NextID == item.RouteNextList[k].NextID) {
                                            _bool = false;
                                        }
                                    }


                                    if (_bool) {
                                        _mode.NextID = _NextID;

                                        //模板
                                        item.RouteNextList.push(_mode);
                                    }

                                    _list.push(item);

                                }
                            }


                        });
                        $.each(DataAllSe, function (i, item) {
                            if (_prevData[0].PrevID > 0) {

                                var _mode = $com.util.Clone(RouteNextMode);
                                if (_prevData[0].PrevID == item.ID && item.StepLevel == 2) {


                                    var _bool = false;
                                    var _RNlength = item.RouteNextList.length;
                                    for (var k = 0; k < _RNlength; k++) {
                                        if (_NextID == item.RouteNextList[k].NextID) {
                                            item.RouteNextList.splice(k, 1);
                                            _bool = true;
                                            k--;
                                            _RNlength--;
                                        }
                                    }


                                    if (_bool) {

                                        $.each(_list, function (_i, i_item) {
                                            if (i_item.ID == item.ID)
                                                _bool = false;
                                        });

                                        if (_bool)
                                            _list.push(item);
                                    }
                                }
                            }
                        });


                        var p = 0;
                        var WhileAddz = function () {
                            $com.app.loading();
                            $com.util.deleteLowerProperty(_list[p]);
                            model.com.updateStep({
                                data: _list[p],
                            }, function (res) {
                                p++;

                                if (p == _list.length) {
                                    $com.app.loaded();

                                    alert("修改成功");
                                    model.com.refreshSecond();
                                } else {
                                    WhileAddz();
                                }
                            });

                        }
                        if (_list.length <= 0) {
                            alert("修改成功");
                            model.com.refreshSecond();
                        } else {
                            WhileAddz();
                        }




                    })
                }, TypeSource_LevelSe));


            });


            $("body").delegate("#zace-add-levelNext", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！")
                    return;
                }
                var default_value = {

                    NextID: SelectData[0].NextID,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].RouteNextList = [];

                    for (var k = 0; k < rst.NextID.length; k++) {
                        var _mode = $com.util.Clone(RouteNextMode)
                        if (SelectData[0].ID == rst.NextID[k]) {
                            alert("不能选自己！");
                            return false;
                        }
                        _mode.NextID = rst.NextID[k];
                        SelectData[0].RouteNextList.push(_mode);
                    }


                    for (var i = 0; i < SelectData.length; i++) {
                        $com.util.deleteLowerProperty(SelectData[i]);
                    }
                    model.com.updateStep({
                        data: SelectData[0],
                    }, function (res) {
                        alert("编辑成功");
                        $("#zace-closePart-level").click();
                        //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                        //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    })

                }, TypeSource_Level));


            });

            $("body").delegate("#zace-add-levelNextItem", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskPart-tbody"), "ID", DataAllSe);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！")
                    return;
                }

                if (SelectData[0].StepLevel == 1) {
                    alert("请选择二级流程");
                    return;
                }
                var default_value = {

                    NextID: SelectData[0].NextID,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_LevelSe, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].RouteNextList = [];

                    for (var k = 0; k < rst.NextID.length; k++) {
                        var _mode = $com.util.Clone(RouteNextMode)
                        if (SelectData[0].ID == rst.NextID[k]) {
                            alert("不能选自己！");
                            return false;
                        }
                        _mode.NextID = rst.NextID[k];
                        SelectData[0].RouteNextList.push(_mode);
                    }


                    for (var i = 0; i < SelectData.length; i++) {
                        $com.util.deleteLowerProperty(SelectData[i]);
                    }
                    model.com.updateStep({
                        data: SelectData[0],
                    }, function (res) {
                        alert("编辑成功");
                        model.com.refreshSecond();
                        //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                        //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    })

                }, TypeSource_LevelSe));


            });

            $("body").delegate("#zace-delete-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能对一行数据操作！")
                    return;
                }
                if (!confirm("确定删除此数据吗？")) {
                    return;
                }

                model.com.deleteStep({
                    RouteID: SelectData[0].RouteID,
                    ID: SelectData[0].ID,
                }, function (res) {
                    alert("删除成功");
                    $("#zace-closePart-level").click();
                    //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                    //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                })




            });
            //工序段新增
            $("body").delegate("#zace-add-level", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    PositionTemp.PartID = 0;
                    PositionTemp.RouteID = mRouteIDZace;
                    PositionTemp.Name = rst.Name;
                    PositionTemp.OrderID = Number(rst.OrderID);
                    PositionTemp.PrevID = Number(rst.PrevID);


                    // var _list = [];
                    // for (var i = 0; i < DataAll.length; i++) {
                    //     if (PositionTemp.RouteID == DataAll[i].RouteID) {
                    //         _list.push(DataAll[i]);
                    //     }
                    // }
                    // PositionTemp.OrderID = _list.length + 1;


                    model.com.updateStep({
                        data: PositionTemp,
                    }, function (res) {

                        var _NextID = res.info.ID;
                        var _list = [];//找出上级  然后修改
                        $.each(DataAll, function (i, item) {
                            $com.util.deleteLowerProperty(item);

                            if (PositionTemp.PrevID > 0) {

                                var _mode = $com.util.Clone(RouteNextMode)
                                if (PositionTemp.PrevID == item.ID) {
                                    _mode.NextID = _NextID;

                                    //模板
                                    item.RouteNextList.push(_mode);
                                    for (var k = 0; k < item.RouteNextList.length; k++) {
                                        $com.util.deleteLowerProperty(item.RouteNextList[k]);
                                    }

                                    _list.push(item);

                                }
                            }

                        });


                        var p = 0;
                        var WhileAddz = function () {
                            $com.app.loading();
                            model.com.updateStep({
                                data: _list[p],
                            }, function (res) {
                                p++;

                                if (p == _list.length) {
                                    $com.app.loaded();

                                    alert("新增成功");
                                    $("#zace-closePart-level").click();
                                } else {
                                    WhileAddz();
                                }
                            });

                        }
                        if (_list.length <= 0) {
                            alert("新增成功");
                            $("#zace-closePart-level").click();
                        } else {
                            WhileAddz();
                        }




                    })

                }, TypeSource_Level));


            });

            //条件查询
            $("body").delegate("#zace-myAudit-level", "click", function () {
                var default_value = {
                    RouteIDShow: mRouteIDZace,
                };
                var default_valuePro = {
                    RouteID: mRouteIDZace,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.RouteIDShow = Number(rst.RouteIDShow);
                    default_valuePro.RouteID = default_value.RouteIDShow;


                    mRouteIDZace = Number(rst.RouteIDShow);
                    model.com.refresh();
                    // if (default_valuePro.RouteID != 0) {
                    //     $com.table.filterByConndition($("#femi-riskLevel-tbody"), DataAll, default_valuePro, "ID");
                    // } else {

                    //     model.com.refresh();
                    // }


                }, TypeSource_Level));


            });

            //上移
            $("body").delegate("#zace-up-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), 'ID', DDDBasic);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                } else if (SelectData.length > 1) {
                    alert(" 一次只能对一行数据移动！")
                    return;
                }
                //判断是否在第一行
                if (SelectData[0].OrderID == 1) {
                    alert("已在第一项！！！");
                    return;
                }

                SelectData[0].OrderID -= 1;
                var upData = model.com.getDataOne(SelectData[0].RouteID, SelectData[0].OrderID);
                upData[0].OrderID += 1;

                $com.util.deleteLowerProperty(SelectData[0]);
                $com.util.deleteLowerProperty(upData[0]);
                model.com.updateStep({
                    data: SelectData[0],
                }, function (res) {

                    model.com.updateStep({
                        data: upData[0],
                    }, function (res1) {
                        //alert("修改成功");
                        $("#zace-closePart-level").click();
                        //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                        //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    })

                })
            });

            //隐藏
            $("body").delegate("#zace-closePart-level", "click", function () {

                $(".zzza").css("margin-right", "0px");
                $(".zzzc").css("width", "0px");
                $(".zzzc").hide();

                $('.zaceMinWidth').css('min-width', '1000px');
                model.com.refresh();
            });
            //下移
            $("body").delegate("#zace-down-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), 'ID', DDDBasic);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                } else if (SelectData.length > 1) {
                    alert(" 一次只能对一行数据移动！")
                    return;
                }
                //判断是否在第一行
                var ZAll = model.com.getOrderListByRouteID1(SelectData[0].RouteID);

                if (SelectData[0].OrderID == ZAll.length) {
                    alert("已在最后一项！！！");
                    return;
                }

                SelectData[0].OrderID += 1;
                var upData = model.com.getDataOne(SelectData[0].RouteID, SelectData[0].OrderID);
                upData[0].OrderID -= 1;
                $com.util.deleteLowerProperty(SelectData[0]);
                $com.util.deleteLowerProperty(upData[0]);
                model.com.updateStep({
                    data: SelectData[0],
                }, function (res) {

                    model.com.updateStep({
                        data: upData[0],
                    }, function (res1) {
                        //alert("修改成功");
                        $("#zace-closePart-level").click();
                        //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                        //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    })

                })
            });


            //二级流程title
            $("body").delegate("#zace-addSecond-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }


                model.com.getFPCRouteStepLevel({ RouteID: mRouteIDZace, StepLevel: 2, ParentStepID: SelectData[0].ID }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        if (resP.list.length > 0) {
                            SelectedLine = SelectData[0].ID;
                            SelectedName = resP.list[0].Name;
                            $("#lineChoose").html(FORMATTRT_Level.SecondLevel(SelectedLine));
                            model.com.refreshSecond();

                            $('.zaceMinWidth').css('min-width', '1650px')
                            $(".zzzb").hide();
                            $(".zzzc").css("width", "650px");
                            $(".zzza").css("margin-right", "650px");
                            $(".zzzc").show();


                        } else {



                            for (var k = 0; k < SecondList.length; k++) {
                                if (SelectData[0].ID == SecondList[k].NextID) {

                                    alert('已存在二级流程！')
                                    return false;

                                };

                            }
                            var DEFAULT_VALUE_LevelSe = {
                                RouteLevelNameSecond: ''
                            };
                            $("body").append($com.modal.show(DEFAULT_VALUE_LevelSe, KEYWORD_Level, "新增二级流程", function (rst) {
                                //调用插入函数 
                                if (!rst || $.isEmptyObject(rst))
                                    return;
                                if (rst.RouteLevelNameSecond.match(/^[ ]*$/)) {
                                    alert('不能为空！')
                                    return false;
                                }




                                SecondList.push({
                                    Name: rst.RouteLevelNameSecond,
                                    NextID: SelectData[0].ID,
                                })

                                TypeSource_Level.SecondLevel.splice(0, TypeSource_Level.SecondLevel.length);
                                $.each(SecondList, function (k, item_k) {
                                    TypeSource_Level.SecondLevel.push({
                                        value: item_k.NextID,
                                        name: item_k.Name
                                    });
                                });

                                if (TypeSource_Level.SecondLevel.length >= 1) {
                                    $(".zacelineChoose").show()
                                    SelectedLine = 0;
                                } else {
                                    SelectedLine = 0;
                                    $(".zacelineChoose").hide()
                                }

                                $(".line-items").html($com.util.template(TypeSource_Level.SecondLevel, HTML.TableLiItemNode));





                            }, TypeSource_Level));
                        }


                    }


                });




            });

            //工序段新增
            $("body").delegate("#zace-add-levelSecond", "click", function () {

                $("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_LevelSe, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    PositionTemp.PartID = 0;
                    PositionTemp.RouteID = mRouteIDZace;
                    PositionTemp.Name = rst.Name;
                    PositionTemp.OrderID = Number(rst.OrderID);
                    PositionTemp.PrevID = Number(rst.PrevID);

                    PositionTemp.ParentStepID = SelectedLine;
                    PositionTemp.StepLevel = 2;
                    PositionTemp.RouteLevelName = SelectedName;

                    // model.com.updateStep({
                    //     data: PositionTemp,
                    // }, function (res) {
                    //     alert("新增成功");
                    //     model.com.refreshSecond();
                    // })


                    model.com.updateStep({
                        data: PositionTemp,
                    }, function (res) {

                        var _NextID = res.info.ID;
                        var _list = [];//找出上级  然后修改
                        $.each(DataAllSe, function (i, item) {
                            $com.util.deleteLowerProperty(item);

                            if (PositionTemp.PrevID > 0) {

                                var _mode = $com.util.Clone(RouteNextMode)
                                if (PositionTemp.PrevID == item.ID && item.StepLevel == 2) {
                                    _mode.NextID = _NextID;

                                    //模板
                                    item.RouteNextList.push(_mode);
                                    for (var k = 0; k < item.RouteNextList.length; k++) {
                                        $com.util.deleteLowerProperty(item.RouteNextList[k]);
                                    }

                                    _list.push(item);

                                }
                            }

                        });


                        var p = 0;
                        var WhileAddz = function () {
                            $com.app.loading();
                            model.com.updateStep({
                                data: _list[p],
                            }, function (res) {
                                p++;

                                if (p == _list.length) {
                                    $com.app.loaded();

                                    alert("新增成功");
                                    model.com.refreshSecond();
                                } else {
                                    WhileAddz();
                                }
                            });

                        }
                        if (_list.length <= 0) {
                            alert("新增成功");
                            model.com.refreshSecond();
                        } else {
                            WhileAddz();
                        }




                    })



                }, TypeSource_LevelSe));


            });
            //选择二级流程
            $("body").delegate(".line-items>li", "click", function () {
                var $this = $(this);
                SelectedLine = Number($this.attr("data-value"));
                SelectedName = $this.attr("data-name");
                $("#lineChoose").html(FORMATTRT_Level.SecondLevel(SelectedLine));


                var default_value = {
                    // DepartmentID: 0,
                    AreaID: 0,
                };

                if (SelectedLine == 0) {

                } else {



                }


                model.com.refreshSecond();

                $('.zaceMinWidth').css('min-width', '1650px');
                $(".zzzb").hide();
                $(".zzzc").css("width", "650px");
                $(".zzza").css("margin-right", "650px");
                $(".zzzc").show();
                return false;

            });


            $("body").delegate("#zace-open-routeLine", "click", function () {

                $('.zzzc').hide();
                $('.closeContent').hide();
                $(".zzza").hide();
                $('#DragLine').show();
                $('#Drag').hide();
                $('.zace-line-route').show();
                $('#zace-addLine-levelReturn').show();
                $('#zace-addLine-levelReturnItem').hide();

                DropRouteID = mRouteIDZace;
                model.com.renderRouteChart(DropRouteID, DataAll);
                var title = FORMATTRT_Level["RouteID"](DropRouteID) + "一级流程图";
                $(".zace-titleZ").html(title);
            });

            $("body").delegate("#zace-addLine-levelReturn", "click", function () {

                $('.zzzc').hide();
                $('.closeContent').show();
                $(".zzza").show();
                $('#DragLine').hide();
                $('#Drag').hide();
                $('.zace-line-route').hide();

                $(".zzza").css("margin-right", "0px");
                $(".zzzc").css("width", "0px");

                model.com.refresh();

            });

            $("body").delegate("#zace-open-routeLineItem", "click", function () {

                $('.zzzc').hide();
                $('.closeContent').hide();
                $(".zzza").hide();
                $('#DragLine').show();
                $('#Drag').hide();
                $('.zace-line-route').show();
                $('#zace-addLine-levelReturnItem').show();
                $('#zace-addLine-levelReturn').hide();
                DropRouteIDItem = SelectedLine;
                var _data = $com.util.Clone(DataAllSe);


                _data[0].NextIDMap = {};
                if (_data[0].NextIDList && _data[0].NextIDList.length > 0) {

                    $.each(_data[0].NextIDList, function (k, item_k) {
                        delete _data[0].NextIDMap[item_k];

                    });
                }
                model.com.renderRouteChart(SelectedLine, _data);
                var title = FORMATTRT_Level.SecondLevel(SelectedLine) + "二级流程图";
                $(".zace-titleZ").html(title);
            });

            $("body").delegate("#zace-addLine-levelReturnItem", "click", function () {

                $('.zzzc').show();
                $('.closeContent').show();
                $(".zzza").show();
                $('#DragLine').hide();
                $('#Drag').hide();
                $('.zace-line-route').hide();

                $(".zzza").css("margin-right", "650px");
                $(".zzzc").css("width", "650px");

                model.com.refreshSecond();

            });
        },




        run: function () {
            mRouteIDZace = model.query.id;
            model.com.loadZace();
        },

        com: {
            loadZace: function () {
                // $('.zaceMinWidth').css('min-width', '1000px');

                $(".zzza").css("margin-right", "0px");
                $(".zzzc").css("width", "0px");
                $(".zzzc").hide();

                $('.zaceMinWidth').css('min-width', '1000px');

                $com.app.loading('数据加载中...');
                model.com.getFPCRoute({ FactoryID: 0, BusinessUnitID: 0, ProductTypeID: 0 }, function (resR) {
                    if (resR && resR.list) {
                        DATARouteList = resR.list;
                        $.each(resR.list, function (i, item) {
                            TypeSource_Level.RouteID.push({
                                name: item.Name,
                                value: item.ID,
                            });
                        });
                        TypeSource_LevelSe.RouteID = TypeSource_Level.RouteID;
                        $.each(resR.list, function (i, item) {
                            TypeSource_Level.RouteIDShow.push({
                                name: item.Name,
                                value: item.ID,
                            });
                        });
                        // mRouteIDZace = DATARouteList[0].ID;
                    }
                    model.com.getFPCPart({ FactoryID: 0, BusinessUnitID: 0 }, function (resRP) {
                        if (resRP && resRP.list) {

                            $.each(resRP.list, function (i, item) {
                                TypeSource_Level.EntityID.push({
                                    name: item.Name,
                                    value: item.ID,
                                });
                            });

                            TypeSource_LevelSe.EntityID = TypeSource_Level.EntityID;
                        }
                        model.com.setMMM();
                        model.com.refresh();
                    });
                });
            },

            arryOnea: function (data) {
                var temp = {};
                var arr = [];
                var len = data.length;
                for (var i = 0; i < len; i++) {
                    if (!temp[data[i]]) {
                        temp[data[i]] = "abc";
                        arr.push(data[i]);
                    }
                }
                return arr;
            },
            renderRouteChart: function (RouteID, _dataPart) {

                //拿到此路线下对应的工序段
                var OrderIDList = [];   //順序ID集合
                var routePartArr = [];
                ZaceData = [];   //初始化
                $.each(_dataPart, function (p_i, p_item) {
                    // if (RouteID == p_item.RouteID) {
                    //     routePartArr.push(p_item);
                    // }
                    OrderIDList.push(p_item.OrderID);
                });

                routePartArr = $com.util.Clone(_dataPart);

                //去重  顺序
                OrderIDList = model.com.arryOnea(OrderIDList);

                for (var i = 0; i < OrderIDList.length; i++) {
                    var temp = $com.util.Clone(DataTemp);
                    for (var j = 0; j < routePartArr.length; j++) {
                        if (OrderIDList[i] == routePartArr[j].OrderID) {
                            temp.level = OrderIDList[i];
                            temp.list.push(routePartArr[j]);

                        }

                    }

                    ZaceData.push(temp);




                }

                //分层级的列表数据
                var routePartArrZace = $com.util.Clone(ZaceData);

                $('#DragLine').html('');

                //显示流程图

                //为流程图添加方法
                //创建悬浮框方法
                var mouseoverFn = function (data, json) {
                    var cv = $(".left-contain").scrollTop();
                    //var cl = $("#ChartRoute").scrollLeft();
                    var $target = {
                        offset: function () {
                            return {
                                left: json.X + json.left + 300 + 15,
                                top: json.Y + json.top + 60 - cv,
                            };
                        },
                        width: function () {
                            return json.width;
                        },
                        height: function () {
                            return json.height;
                        },
                    }
                    //var x = json.X + json.left;
                    //var y = json.Y + json.top - cv;
                    //  alert(json.Y + "   ---   " + json.top);
                    var dataHtml = model.com.changeData(data);
                    //$tooltip.show({ target: $target, object: dataHtml, orientation: 2, Choice_color: 4, max_width: 200, fontsize: 13, });
                }
                var mouseoutFn = function (data) {
                    $tooltip.clear();
                }
                //点击方法
                var clickFn = function (data, json) {
                    var _info = data;
                    var showInfo = $com.util.Clone(_info);
                    //var _showData = {};
                    //for (var i = 0; i < dataPartPoint.length; i++) {
                    //    if (showInfo.ID == dataPartPoint[i].ID) {
                    //        _showData = $com.util.Clone(dataPartPoint[i]);
                    //    }
                    //}
                    //DataShow = _showData;
                    //20191209

                    // model.com.refreshStationGrid(showInfo.ID);
                    // //model.com.refreshGrid(showInfo.ID,mProductID);



                    // $(".right-contain").css("width", "400px");
                    // $(".left-containPro").css("margin-right", "400px");
                    // $(".right-contain").show();
                    //20191209
                }
                var dragFn = function (data) {
                    var _data = data.data.data;

                    $.each(mZacePart, function (j, item_j) {
                        $.each(_data, function (i, item) {
                            if (item.ID != item_j.PartID)
                                return true;

                            item_j.OrderID = item.OrderID;
                            item_j.PrevPartID = item.PrevID;

                            item_j.NextPartIDMap = {};
                            if (item.NextIDList && item.NextIDList.length > 0) {

                                $.each(item.NextIDList, function (k, item_k) {
                                    item_j.NextPartIDMap[item_k + ""] = 0;
                                    console.log(j);
                                });
                            }

                        });
                    });

                }
                //1 置空
                $("#ChartPartPoint").html("");
                //$(".zzzc").show();

                //2 创建结构
                var dataObj = {

                    data: [],
                    dataSet: {//对应关系
                        "Text": "KKK", //显示字段名称
                        "Index": "ID", //索引字段名称
                        "PrevIndex": "PrevID", //上级字段名称
                        "NextIndex": "NextIDList", //下级字段名称
                        "FatherID": "FatherID",  //父级ID
                        "BGC": "abc", //背景色字段名称
                        "FGC": "bcd", //前景色字段名称
                    },
                    background_color: 'transparent', //流程框背景颜色
                    foreground_color: 'red', //箭头颜色 
                    fn_mouseover: mouseoverFn, //鼠标悬停触发
                    fn_mouseout: mouseoutFn, //鼠标移走事件
                    fn_click: clickFn, //鼠标单击
                    fn_drag: dragFn, //鼠标拖动
                    constant: {
                        lineOperation: true,
                        // dottedLine: true,
                        font: "bold 15px 宋体",//字体样式
                        fontSize: 15,//字体大小
                        rect_width: 200, //矩形的宽
                        rect_height: 50,
                    },
                }
                //3 填充data
                if (routePartArrZace.length != 0) {
                    $.each(routePartArrZace, function (i, item) {
                        var orderList = [];

                        //跳线集合
                        if (i <= routePartArrZace.length - 2) {
                            for (var m = 0; m < routePartArrZace[i + 1].list.length; m++) {
                                orderList.push(routePartArrZace[i + 1].list[m].ID);

                            }
                        }
                        for (var index = 0; index < item.list.length; index++) {
                            var C_list = [];
                            var obj = item.list[index];
                            for (p in obj.NextIDMap) {

                                C_list.push({
                                    key: p,
                                    value: obj.NextIDMap[p]
                                });


                            }
                            var _listZace = [];
                            for (var j = 0; j < C_list.length; j++) {
                                _listZace.push(C_list[j].key);

                            }

                            dataObj.data.push({
                                // title: item.PartPointName,
                                // ID: item.OrderIDPro,
                                // ZID:item.ID,
                                // PrevID: item.OrderIDPro - 1,
                                // NextID: 0,
                                // backgroundColor: model.com.getRandomColor(item.PartID),
                                // foregroundColor: "white",
                                // PartName: FORMATTRT_Level["PartID"](item.PartID),
                                // RouteName: FORMATTRT_Level["RouteID"](item.RouteID),
                                // VersionNo: item.VersionNo,

                                "KKK": obj.Name, //显示字段名称
                                "ID": obj.ID, //索引字段名称
                                "PrevID": obj.PrevID,
                                //i == 0 ? 0 : routePartArr[i - 1].list[0].ID, //上级字段名称
                                "NextIDList": _listZace.length > 0 ? _listZace : [], //orderList, //跳线集合
                                "OrderID": item.level, //第几层
                                "Type": 1,
                                "abc": "orange", //背景色字段名称
                                "bcd": "black", //前景色字段名称

                            });
                        }

                    });


                    //4 显示流程图
                    $route.show($('#DragLine'), dataObj);
                }
                else {
                    return false;
                }
            },


            setMMM: function () {
                setTimeout(function () {
                    if (window.parent._zacePartSet && window.parent._zacePartSet == 1) {
                        model.com.getFPCPart({ FactoryID: 0, BusinessUnitID: 0 }, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {

                                TypeSource_Level.EntityID.splice(1, TypeSource_Level.EntityID.length - 1);
                                $.each(resW.list, function (i, item) {
                                    TypeSource_Level.EntityID.push({
                                        name: item.Name,
                                        value: item.ID,
                                    });
                                });
                            }
                            TypeSource_LevelSe.EntityID = TypeSource_Level.EntityID;
                            window.parent._zacePartSet = 0;
                        });

                    }
                    if (window.parent._zaceRouteSet && window.parent._zaceRouteSet == 1) {
                        model.com.getFPCRoute({ FactoryID: 0, BusinessUnitID: 0, ProductTypeID: 0 }, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {

                                TypeSource_Level.RouteID.splice(1, TypeSource_Level.RouteID.length - 1);
                                TypeSource_Level.RouteIDShow = [];
                                DATARouteList = resW.list;
                                $.each(resW.list, function (i, item) {
                                    TypeSource_Level.RouteID.push({
                                        name: item.Name,
                                        value: item.ID,
                                    });
                                });
                                $.each(resW.list, function (i, item) {
                                    TypeSource_Level.RouteIDShow.push({
                                        name: item.Name,
                                        value: item.ID,
                                    });
                                });
                                mRouteIDZace = DATARouteList[0].ID;
                            }
                            TypeSource_LevelSe.RouteID = TypeSource_Level.RouteID;
                            TypeSource_LevelSe.RouteIDShow = TypeSource_Level.RouteIDShow;
                            window.parent._zaceRouteSet = 0;
                        });

                    }


                    model.com.setMMM();
                }, 500);

            },
            refresh: function () {
                $com.app.loading('数据加载中...');
                $('.firstLevel').text('(' + FORMATTRT_Level["RouteID"](mRouteIDZace) + ')' + '一级流程');
                model.com.getFPCRouteStep({ RouteID: mRouteIDZace, StepLevel: 1, ParentStepID: -1 }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        // var Grade = $com.util.Clone(resP.list);
                        TypeSource_Level.PrevID.splice(1, TypeSource_Level.PrevID.length - 1);

                        $.each(resP.list, function (i, item) {
                            TypeSource_Level.PrevID.push({
                                name: item.Name,
                                value: item.ID,
                            });
                        });

                        TypeSource_Level.NextID = TypeSource_Level.PrevID;

                        $.each(resP.list, function (k, item_k) {
                            item_k.NextID = [];
                            if (item_k.RouteNextList.length > 0) {
                                $.each(item_k.RouteNextList, function (j, item_j) {

                                    item_k.NextID.push(item_j.NextID);

                                });
                            }
                        });

                        // for (var n = 0; n < resP.list.length; n++) {


                        //     var C_list = [];
                        //     for (p in resP.list[n].NextPartIDMap) {

                        //         C_list.push({
                        //             key: p,
                        //             value: resP.list[n].NextPartIDMap[p]
                        //         });


                        //     }

                        //     resP.list[n].NextIDText = '';
                        //     var _listZace = [];
                        //     for (var j = 0; j < C_list.length; j++) {
                        //         _listZace.push(Number(C_list[j].key));


                        //     }


                        //     resP.list[n].NextID = _listZace;
                        //     resP.list[n].NextIDText = resP.list[n].NextIDText + FORMATTRT_Level['NextID'](resP.list[n].NextID)


                        // }


                        var Grade = [];
                        var DDD = $com.util.Clone(resP.list);
                        DDDBasic = DDD;
                        DATABasic = $com.util.Clone(DDDBasic);





                        //
                        for (var i = 0; i < DATARouteList.length; i++) {
                            var _list = [];
                            _list = model.com.getOrderListByRouteID(DATARouteList[i].ID);

                            for (var m = 0; m < _list.length; m++) {
                                Grade.push(_list[m]);
                            }
                        }
                        //
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


                        model.com.getFPCRouteStepLevel({ RouteID: mRouteIDZace, StepLevel: 2, ParentStepID: 0 }, function (res) {

                            SecondList = $com.util.Clone(res.list);
                            //TypeSource_Level.SecondLevel.splice(0, TypeSource_Level.SecondLevel.length - 1);
                            TypeSource_Level.SecondLevel = [];
                            $.each(res.list, function (k, item_k) {
                                TypeSource_Level.SecondLevel.push({
                                    value: item_k.NextID,
                                    name: item_k.Name
                                });
                            });

                            if (TypeSource_Level.SecondLevel.length >= 1) {
                                $(".zacelineChoose").show()
                                SelectedLine = 0;
                            } else {
                                SelectedLine = 0;
                                $(".zacelineChoose").hide()
                            }

                            $(".line-items").html($com.util.template(TypeSource_Level.SecondLevel, HTML.TableLiItemNode));


                            $com.app.loaded();
                        });

                    }

                });

            },


            refreshSecond: function () {
                $com.app.loading('数据加载中...');
                //$('.zacelineChoose').text('(' + FORMATTRT_Level["RouteID"](mRouteIDZace) + ')' + '一级流程');
                model.com.getFPCRouteStep({ RouteID: mRouteIDZace, StepLevel: 2, ParentStepID: SelectedLine }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        // var Grade = $com.util.Clone(resP.list);
                        TypeSource_LevelSe.PrevID.splice(1, TypeSource_LevelSe.PrevID.length - 1);

                        $.each(resP.list, function (i, item) {
                            TypeSource_LevelSe.PrevID.push({
                                name: item.Name,
                                value: item.ID,
                            });
                        });

                        TypeSource_LevelSe.NextID = TypeSource_LevelSe.PrevID;

                        $.each(resP.list, function (k, item_k) {
                            item_k.NextID = [];
                            if (item_k.RouteNextList.length > 0) {
                                $.each(item_k.RouteNextList, function (j, item_j) {

                                    item_k.NextID.push(item_j.NextID);

                                });
                            }
                        });

                        var Grade = $com.util.Clone(resP.list);
                        var DDD = $com.util.Clone(resP.list);
                        DDDBasicSe = DDD;
                        DATABasicSe = $com.util.Clone(DDDBasicSe);





                        // //
                        // for (var i = 0; i < DATARouteList.length; i++) {
                        //     var _list = [];
                        //     _list = model.com.getOrderListByRouteID(DATARouteList[i].ID);

                        //     for (var m = 0; m < _list.length; m++) {
                        //         Grade.push(_list[m]);
                        //     }
                        // }
                        //
                        DataAllSe = $com.util.Clone(Grade);

                        $.each(Grade, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_LevelSe[p])
                                    continue;
                                item[p] = FORMATTRT_LevelSe[p](item[p]);
                            }
                            item.WID = i + 1;
                        });
                        DataAllFactorySearchSe = $com.util.Clone(Grade);
                        $("#femi-riskPart-tbody").html($com.util.template(Grade, HTML.TableSecondMode));
                        $com.app.loaded();
                    }

                });

            },
            refreshPartPoint: function () {
                $com.app.loading('数据加载中...');
                model.com.getFPCRoutePartPoint({ RouteID: RouteID, PartID: mPartID }, function (resP) {
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
                        if (_listOrder.length > 0) {
                            for (var i = 0; i < _listOrder.length; i++) {
                                _listOrder[i].PartName = mPartName;
                                _listOrder[i].WID = i + 1;
                            }
                        }


                        $("#femi-riskPart-tbody").html($com.util.template(_listOrder, HTML.TablePartMode));
                        $com.app.loaded();
                    }
                });

            },
            //查询工序段列表
            getFPCRoutePartPoint: function (data, fn, context) {
                var d = {
                    $URI: "/FPCRoutePartPoint/All",
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

            getOrderListByRouteID: function (RouteID) {
                var _list = [];
                var _listOrder = [];
                for (var i = 0; i < DATABasic.length; i++) {
                    if (RouteID == DATABasic[i].RouteID) {
                        _list.push(DATABasic[i]);
                    }
                }


                _list.sort(function (a, b) { return Number(a.OrderID) - Number(b.OrderID) });
                for (var j = 0; j < _list.length; j++) {

                    // for (var i = 0; i < _list.length; i++) {
                    //     if ((j + 1) == _list[i].OrderID) {
                    _listOrder.push(_list[j]);

                    //     }
                    // }

                }
                return _listOrder;

            },
            getOrderListByRouteID1: function (RouteID) {
                var _list = [];
                var _listOrder = [];
                for (var i = 0; i < DDDBasic.length; i++) {
                    if (RouteID == DDDBasic[i].RouteID) {
                        _list.push(DDDBasic[i]);
                    }
                }

                _list.sort(function (a, b) { return Number(a.OrderID) - Number(b.OrderID) });

                for (var j = 0; j < _list.length; j++) {

                    _listOrder.push(_list[j]);
                    // for (var i = 0; i < _list.length; i++) {
                    //     if ((j + 1) == _list[i].OrderID) {
                    //         _listOrder.push(_list[i]);

                    //     }
                    // }

                }
                return _listOrder;

            },
            getDataOne: function (routeID, orderID) {
                var _list = [];
                for (var i = 0; i < DataAll.length; i++) {
                    if (routeID == DataAll[i].RouteID && orderID == DataAll[i].OrderID) {
                        _list.push(DataAll[i]);
                    }
                }
                return _list;

            },
            //查询路线
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
            //查询二级流程
            getFPCRouteStepLevel: function (data, fn, context) {
                var d = {
                    $URI: "/FPCRouteStep/StepLevel",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //查询流程
            updateStep: function (data, fn, context) {
                var d = {
                    $URI: "/FPCRouteStep/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //删除流程
            deleteStep: function (data, fn, context) {
                var d = {
                    $URI: "/FPCRouteStep/Delete",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //查询流程
            getFPCRouteStepInfo: function (data, fn, context) {
                var d = {
                    $URI: "/FPCRouteStep/Info",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询一级流程
            getFPCRouteStep: function (data, fn, context) {
                var d = {
                    $URI: "/FPCRouteStep/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //保存产品工序列表
            postFPCRoutePart: function (data, fn, context) {
                var d = {
                    $URI: "/FPCRoutePart/Update",
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
                    if (item.OrderID > id)
                        id = item.OrderID;
                });
                return id + 1;

            },
        }
    }),

        model.init();


});