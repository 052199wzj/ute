require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/route_new'], function ($zace, $com, $route) {

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
        DataPartList,
        DATARouteList,
        DataPartNew,
        DataAllFactorySearch,

        KEYWORD_Level_LISTFile,
        KEYWORD_LevelFile,
        FORMATTRT_LevelFile,
        DEFAULT_VALUE_LevelFile,
        TypeSource_LevelFile,
        wRoutePartID,
        HTML;

    mPointID = 0;
    DataPartNew = [];
    DataAll = [];
    DATABasic = [];
    DATAZBasic = [];
    DataAllConfirmBasic = [];
    DataAllConfirmChange = [];
    DataAllConfirm = [];
    DataAllFactorySearch = DataAllSearch = [];
    PositionTemp = {
        CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Creator: window.parent.User_Info.Name,
        CreatorID: 0,
        OrderID: 0,
        PartID: 0,
        PartName: "",
        PartPointID: 0,
        PartPointName: "",
        RouteID: 0,
        ID: 0,
        RouteName: "",
        VersionNo: "",

    };

    PositionFileTemp = {

        ID: 0,
        RoutePartPointID: 0,
        FilePath: '',
        FileType: 1,
        SourceType: 1,
        Active: 0,
        FileName: '文件'

    };

    HTML = {
        TableMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',


            //'<td data-title="RouteName" data-value="{{RouteName}}" >{{RouteName}}</td>',
            '<td data-title="VersionNo" data-value="{{VersionNo}}">{{VersionNo}}</td>',
            '<td data-title="PartName" data-value="{{PartName}}">{{PartName}}</td>',
            '<td data-title="RoutePartCode" data-value="{{RoutePartCode}}">{{RoutePartCode}}</td>',

            '<td data-title="Name" data-value="{{Name}}">{{Name}}</td>',
            '<td data-title="Code" data-value="{{Code}}">{{Code}}</td>',

            '<td data-title="PartPointName" data-value="{{PartPointName}}">{{PartPointName}}</td>',



            '<td data-title="PrevStepID" data-value="{{PrevStepID}}">{{PrevStepID}}</td>',
            '<td data-title="NextIDText" data-value="{{NextIDText}}">{{NextIDText}}</td>',
            '<td data-title="OrderID" data-value="{{OrderID}}">{{OrderID}}</td>',
            '<td  data-title="StandardPeriod" data-value="{{StandardPeriod}}">{{StandardPeriod}}</td>',
            '<td  data-title="ActualPeriod" data-value="{{ActualPeriod}}">{{ActualPeriod}}</td>',
            '<td  data-title="DefaultOrder" data-value="{{DefaultOrder}}">{{ARander}}</td>',
            '<td data-title="ItemCount" data-value="{{ItemCount}}">{{ItemCount}}</td>',
            '<td data-title="Creator" data-value="{{Creator}}">{{Creator}}</td>',
            '<td data-title="CreateTime" data-value="{{CreateTime}}">{{CreateTime}}</td>',
            '<td style="max-width: 80px" data-title="Handle" data-value="{{ID}}"><div class="row">',

            '<div class="col-md-4 lmvt-do-info">修改</div>',
            '<div class="col-md-4 lmvt-allowed-delete">删除</div>',
            '<div class="col-md-4 lmvt-do-active">工步卡</div>',
            '</td>',

            '</tr>',
        ].join(""),

        ARander: [
            '<a>查看</a>',
        ].join(""),

        TableModeFile: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td style="display:none" data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',

            '<td data-title="RouteVersion" data-value="{{RouteVersion}}" >{{RouteVersion}}</td>',
            '<td data-title="PartName" data-value="{{PartName}}" >{{PartName}}</td>',
            '<td data-title="PartPointName" data-value="{{PartPointName}}" >{{PartPointName}}</td>',
            '<td data-title="FileName" data-value="{{FileName}}" >{{FileName}}</td>',
            '<td data-title="FileType" data-value="{{FileType}}" >{{FileType}}</td>',
            '<td  data-title="SourceType" data-value="{{SourceType}}" >{{SourceType}}</td>',
            '<td  data-title="FilePathShow" data-value="{{FilePathShow}}" ><a> 查看</a> </td>',
            '<td style="display:none"  data-title="FilePath" data-value="{{FilePath}}" >{{FilePath}}</td>',
            '<td  data-title="Active" data-value="{{Active}}" >{{Active}}</td>',



            '</tr>',
        ].join(""),



    };
    (function () {
        KEYWORD_Level_LIST = [
            "Name|工步集名称",
            "Code|工步集编码",
            "PartPointID|工步名称|ArrayOne",
            "PrevStepID|前置工步|ArrayOne",
            "NextID|后工步|Array",
            "OrderID|节点顺序号",
            "ActualPeriod|工步工时",
            "CreateTime|时间|DateTime",
            "FileName|文件名称",
        ];
        KEYWORD_Level = {};
        FORMATTRT_Level = {};

        DEFAULT_VALUE_Level = {
            Name: "",
            OrderID: 1,
            //VersionNo: "",
            // RouteID: 0,
            Code: '',
            PrevStepID: 0,
            PartPointID: 0,
            ActualPeriod: 0.0
        };

        TypeSource_Level = {

            PartPointID: [
                {
                    name: "无",
                    value: 0,
                }
            ], PrevStepID: [
                {
                    name: "无",
                    value: 0,
                }
            ], NextID: [
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
        KEYWORD_Level_LISTFile = [

            // "VersionNo|编码",
            "FileType|文件类型|ArrayOne",
            "SourceType|来源|ArrayOne",
            "Active|启用|ArrayOne",

        ];
        KEYWORD_LevelFile = {};
        FORMATTRT_LevelFile = {};

        DEFAULT_VALUE_LevelFile = {
            FileType: 0,
        };

        TypeSource_LevelFile = {

            Active: [
                {
                    name: "启用",
                    value: 1,
                },
                {
                    name: "禁用",
                    value: 2,
                }, {
                    name: "保存",
                    value: 0,
                }
            ], SourceType: [
                {
                    name: "MES",
                    value: 1,
                },
                {
                    name: "TCM",
                    value: 2,
                }
            ], FileType: [
                {
                    name: "图片",
                    value: 1,
                },
                // {
                //     name: "视频",
                //     value: 2,
                // },
                {
                    name: "PDF",
                    value: 3,
                }, {
                    name: "Word",
                    value: 4,
                }
            ],
        };

        $.each(KEYWORD_Level_LISTFile, function (i, item) {
            var detail = item.split("|");
            KEYWORD_LevelFile[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_LevelFile[detail[0]] = $com.util.getFormatter(TypeSource_LevelFile, detail[0], detail[2]);
            }
        });
    })();


    model = $com.Model.create({
        name: '工序',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {

            //导出 
            $("body").delegate("#zace-exportApproval-level", "click", function () {
                var $table = $(".tableTablezace"),
                    fileName = "工位工序计划.xls",
                    Title = "工位工序计划";
                var params = $com.table.getExportParams($table, fileName, Title);

                if (params.data.length < 1) {
                    alert('请选择需要导出的数据！');
                    return false;
                }

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });



            });
            $("body").delegate("#zace-edit-create", "click", function () {


                model.com.create({ RouteID: mRouteIDZace, PartID: mPartID, RoutePartID: wRoutePartID }, function (resP) {

                    model.com.refresh();

                });



            });
            //删除 单条
            $("body").delegate(".lmvt-allowed-delete", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DataAll.filter((item) => { return item.ID == wID });
                if (!confirm("已选择 [" + SelectData[0].PartPointName + "] 的数据，确定将其删除？")) {
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                model.com.DeleteFPCRoutePartPoint({
                    ID: SelectData[0].ID,
                    RouteID: SelectData[0].RouteID,
                }, function (res) {

                    alert("删除成功");

                    model.com.refresh();


                })

            });

            $("body").delegate("#zace-edit-trash", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！")
                    return;
                }
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                model.com.DeleteFPCRoutePartPoint({
                    ID: SelectData[0].ID,
                    RouteID: SelectData[0].RouteID,
                }, function (res) {

                    alert("删除成功");

                    model.com.refresh();


                })

            });
            $("body").delegate("#zace-delete-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskPartFile-tbody"), "ID", DataAllPro);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                // if (SelectData.length != 1) {
                //     alert("只能对一行数据操作！")
                //     return;
                // }
                if (!confirm("确定删除" + SelectData.length + "条数据吗？")) {
                    return;
                }
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {
                    return;
                }
                model.com.deleteFPCRouteFile({
                    data: SelectData,

                }, function (res) {

                    alert("删除成功");
                    model.com.refreshPartFile();


                })




            });

            $("body").delegate("#zace-active-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskPartFile-tbody"), "ID", DataAllPro);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                // if (SelectData.length != 1) {
                //     alert("只能对一行数据操作！")
                //     return;
                // }
                if (!confirm("确定启用" + SelectData.length + "条数据吗？")) {
                    return;
                }
                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);

                }
                model.com.activeFPCRouteFile({
                    data: SelectData,
                    Active: 1


                }, function (res) {

                    alert("启用成功");
                    model.com.refreshPartFile();


                })


            });

            $("body").delegate("#zace-active-pencil", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskPartFile-tbody"), "ID", DataAllPro);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能对一行数据操作！")
                    return;
                }

                var default_value = {
                    FileName: SelectData[0].FileName,


                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].FileName = rst.FileName;



                    for (var i = 0; i < SelectData.length; i++) {
                        $com.util.deleteLowerProperty(SelectData[i]);
                    }
                    model.com.postFPCRouteFile({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refreshPartFile();

                    })

                }, TypeSource_Level));



            });


            $("body").delegate("#zace-disactive-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskPartFile-tbody"), "ID", DataAllPro);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                // if (SelectData.length != 1) {
                //     alert("只能对一行数据操作！")
                //     return;
                // }
                if (!confirm("确定禁用" + SelectData.length + "条数据吗？")) {
                    return;
                }

                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);

                }
                model.com.activeFPCRouteFile({
                    data: SelectData,
                    Active: 0


                }, function (res) {

                    alert("禁用成功");
                    model.com.refreshPartFile();


                })




            });


            $("body").delegate("#femi-riskPartFile-tbody tr a", "click", function () {

                var $this = $(this);
                var _url = $this.closest('tr').find('td[data-title=FilePath]').attr('data-value');

                //alert(_url);

                window.parent.open(_url);
            });

            //工序卡 单条
            $("body").delegate(".lmvt-do-active", "click", function () {

                // var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DataAll.filter((item) => { return item.ID == wID });

                // if (!SelectData || !SelectData.length) {
                //     alert("请先选择一行数据再试！")
                //     return;
                // }
                // if (SelectData.length != 1) {
                //     alert("只能同时对一行数据操作！");
                //     return;
                // }

                mPointID = SelectData[0].ID;
                model.com.refreshPartFile();
                // $(".zzzc").css("width", "400px");
                // $(".zzza").css("margin-right", "400px");
                $(".zzza").hide();
                $(".zzzc").show();
                $('.zacePointTitle').text(SelectData[0].Code + '工序卡')


                return false;
            });

            //单击
            $("body").delegate("#zace-open-partFile", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！");
                    return;
                }

                mPointID = SelectData[0].ID;
                model.com.refreshPartFile();
                // $(".zzzc").css("width", "400px");
                // $(".zzza").css("margin-right", "400px");
                $(".zzza").hide();
                $(".zzzc").show();
                $('.zacePointTitle').text(SelectData[0].Code + '工序卡')


                return false;
            });

            $("body").delegate("#zace-open-partFileMode", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！");
                    return;
                }



                var vdata = { 'header': '工序点检项', 'href': './monitor_quality/CheckMode.html?aRouteID=' + SelectData[0].RouteID + '&bRoutePointID=' + SelectData[0].ID + '&partID=' + SelectData[0].PartID + '&partPointID=' + SelectData[0].PartPointID + '&Code=' + SelectData[0].Code, 'id': 'CheckMode', 'src': './static/images/menu/newfactoryModel/techniquePart.png' };
                window.parent.iframeHeaderSet(vdata);
                window.callFunctionTrigger("CheckMode", { ARouteID: SelectData[0].RouteID, BRoutePointID: SelectData[0].ID, Code: SelectData[0].Code, PartID: SelectData[0].PartID, PartPointID: SelectData[0].PartPointID });



                return false;
            });



            $("body").delegate("#zace-closePart-level", "click", function () {

                $(".zzzb").hide();
                // $(".zzza").css("margin-right", "0px");
                // $(".zzzc").css("width", "0px");
                $(".zzzc").hide();
                $(".zzza").show();

                model.com.refresh();
            });

            window.setFunctionTrigger("FPCRoutePartPointSetting", function (res) {

                mPartID = res.ID;
                mRouteIDZace = res.RouteID;
                mTitle = res.Title;

                wRoutePartID = res.RoutePartID;

                model.com.getFPCRouteInfo({ ID: mRouteIDZace }, function (res_route) {
                    if (res_route.info && res_route.info.ID > 0) {
                        mLineID = res_route.info.LineID;
                        mProductID = res_route.info.ProductID;

                        model.com.loadZace();
                    } else {
                        alert("方案未找到，请关闭后再试");
                    }

                    $(".zzzb").hide();
                    $(".zzzc").hide();
                    $(".zzza").show();
                });
            });


            $("body").delegate("#zace-addLine-levelReturn", "click", function () {

                $('.zace-leftContain.closeContent').show();
                $('.zace-line-route').hide();
                $('#DragLine').hide();


                // $(".zzza").css("margin-right", "0px");
                // $(".zzzc").css("width", "0px");
                $(".zzzc").hide();

                $(".zzza").show();

            });

            $("body").delegate("#zace-open-create", "click", function () {


                model.com.create({ RouteID: mRouteIDZace, PartID: mPartID }, function (resP) {


                    model.com.refresh();

                });


            });


            $("body").delegate("#zace-open-routeLine", "click", function () {

                $('.zace-leftContain.closeContent').hide();

                $('.zace-line-route').show();
                $('#DragLine').show();

                DropRouteID = mRouteIDZace;
                model.com.renderRouteChart(DataAll);
                var title = "流程图";
                $(".zace-titleZ").html(title);
            });

            $("body").delegate("#zace-zace-refresh", "click", function () {

                model.com.refresh();

            });

            $("body").delegate("#zace-zace-refreshFile", "click", function () {

                model.com.refreshPartFile();

            });
            $("body").delegate("#zace-myAudit-levelZaceFile", "click", function () {

                var
                    value = $("#zace-search-levelFile").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskPartFile-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskPartFile-tbody"), DataAllFactorySearchPro, value, "ID");



            });


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

            //工序修改 单条
            $("body").delegate(".lmvt-do-info", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DataAll.filter((item) => { return item.ID == wID });

                var default_value = {

                    Code: SelectData[0].Code,
                    Name: SelectData[0].Name,
                    OrderID: SelectData[0].OrderID,
                    ActualPeriod: SelectData[0].ActualPeriod,
                    // PartID: SelectData[0].PartID,
                    PrevStepID: SelectData[0].PrevStepID,
                    PartPointID: SelectData[0].PartPointID,

                    NextID: SelectData[0].NextID,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].ActualPeriod = Number(rst.ActualPeriod);
                    SelectData[0].OrderID = Number(rst.OrderID);
                    SelectData[0].PrevStepID = Number(rst.PrevStepID);
                    //SelectData[0].Code = rst.Code;
                    SelectData[0].PartPointID = Number(rst.PartPointID);

                    SelectData[0].Name = rst.Name;
                    SelectData[0].Code = rst.Code;


                    for (var m = 0; m < SelectData[0].NextID.length; m++) {
                        //去掉所有字段
                        delete SelectData[0].NextStepIDMap[SelectData[0].NextID[m]];
                    }

                    for (var k = 0; k < rst.NextID.length; k++) {
                        if (SelectData[0].PartID == rst.NextID[k]) {
                            alert("不能选自己！")
                            return false;
                        }
                        SelectData[0].NextStepIDMap[rst.NextID[k]] = '0';
                    }



                    $com.util.deleteLowerProperty(SelectData);

                    model.com.postFPCRoutePartPoint({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                        //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                        //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));
                    })
                }, TypeSource_Level));
            });



            //工序修改
            $("body").delegate("#zace-edit-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！");
                    return;
                }
                var default_value = {

                    Code: SelectData[0].Code,
                    OrderID: SelectData[0].OrderID,
                    ActualPeriod: SelectData[0].ActualPeriod,
                    // PartID: SelectData[0].PartID,
                    PrevStepID: SelectData[0].PrevStepID,
                    PartPointID: SelectData[0].PartPointID,

                    NextID: SelectData[0].NextID,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].ActualPeriod = Number(rst.ActualPeriod);
                    SelectData[0].OrderID = Number(rst.OrderID);
                    SelectData[0].PrevStepID = Number(rst.PrevStepID);
                    SelectData[0].Code = rst.Code;
                    SelectData[0].PartPointID = Number(rst.PartPointID);

                    for (var m = 0; m < SelectData[0].NextID.length; m++) {
                        //去掉所有字段
                        delete SelectData[0].NextStepIDMap[SelectData[0].NextID[m]];


                    }

                    for (var k = 0; k < rst.NextID.length; k++) {
                        if (SelectData[0].PartID == rst.NextID[k]) {
                            alert("不能选自己！")
                            return false;
                        }
                        SelectData[0].NextStepIDMap[rst.NextID[k]] = '0';
                    }



                    for (var i = 0; i < SelectData.length; i++) {
                        $com.util.deleteLowerProperty(SelectData[i]);
                    }
                    model.com.postFPCRoutePartPoint({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                        //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                        //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    })

                }, TypeSource_Level));


            });


            $("body").delegate("#zace-add-file", "click", function () {
                $("#input-file").val("");
                $("#input-file").click();
                // $("body").append($com.modal.show(DEFAULT_VALUE_LevelFile, KEYWORD_LevelFile, "新增", function (rst) {
                //     //调用插入函数 
                //     if (!rst || $.isEmptyObject(rst))
                //         return;
                //     PositionFileTemp.FileType = Number(rst.FileType);



                //     model.com.postFPCRouteFile({
                //         data: PositionFileTemp,
                //     }, function (res) {
                //         alert("新增成功");
                //         model.com.refreshPartFile();
                //     })

                // }, TypeSource_LevelFile));


            });

            $("body").delegate("#zace-edit-file", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskPartFile-tbody"), "ID", DataAllPro);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！");
                    return;
                }

                if (SelectData[0].FileType == 1) {



                    zaceDataPhotoObj = SelectData[0];
                    $("#input-file").val("");
                    $("#input-file").click();

                } else if (SelectData[0].FileType == 2) {

                } else if (SelectData[0].FileType == 3) {

                } else {


                }







            });

            $("#input-file").on("change", function () {
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

                    $.ajax({ //
                        url: "/MESCore/api/Upload/Submit",
                        type: "POST",
                        data: form,
                        processData: false,
                        contentType: false,
                        dataType: "JSON"
                    }).done(function (data) {

                        if (data.resultCode === 1000) {

                            data.returnObject.file_url;
                            // $com.util.deleteLowerProperty(zaceDataPhotoObj);
                            var _mode = $com.util.Clone(PositionFileTemp)
                            _mode.FileType = 1;
                            _mode.FilePath = data.returnObject.file_url;
                            _mode.RoutePartPointID = mPointID;
                            _mode.FileName = _data.name;
                            model.com.postFPCRouteFile({
                                data: _mode
                            }, function (res) {
                                alert("新增图片成功");
                                model.com.refreshPartFile();
                            });

                        } else {
                            alert("上传失败，请重新再试");
                            clearFiles();
                        }

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

            $("#input-pdf").on("change", function () {
                var self = this,
                    _data = self.files[0];

                if (_data) {
                    // if (_data.size > (1024 * 1024 * 10)) {
                    //     alert("请上传小于10M的图片！");
                    //     clearFiles();
                    //     return;
                    // }

                    if (!extLimit(['pdf']).has(_data.name)) {
                        alert("请上传正确的pdf！");
                        clearFiles();
                        return;
                    }

                    var form = new FormData();
                    form.append("file", _data);

                    $.ajax({ //
                        url: "/MESCore/api/Upload/Submit",
                        type: "POST",
                        data: form,
                        processData: false,
                        contentType: false,
                        dataType: "JSON"
                    }).done(function (data) {

                        if (data.resultCode === 1000) {

                            data.returnObject.file_url;
                            // $com.util.deleteLowerProperty(zaceDataPhotoObj);
                            var _mode = $com.util.Clone(PositionFileTemp)
                            _mode.FileType = 3;
                            _mode.FilePath = data.returnObject.file_url;
                            _mode.RoutePartPointID = mPointID;
                            _mode.FileName = _data.name;

                            model.com.postFPCRouteFile({
                                data: _mode
                            }, function (res) {
                                alert("新增PDF成功");
                                model.com.refreshPartFile();
                            });

                        } else {
                            alert("上传失败，请重新再试");
                            clearFiles();
                        }

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


            $("#input-word").on("change", function () {
                var self = this,
                    _data = self.files[0];

                if (_data) {
                    // if (_data.size > (1024 * 1024 * 10)) {
                    //     alert("请上传小于10M的图片！");
                    //     clearFiles();
                    //     return;
                    // }

                    if (!extLimit(['doc', 'docx']).has(_data.name)) {
                        alert("请上传正确的word！");
                        clearFiles();
                        return;
                    }

                    var form = new FormData();
                    form.append("file", _data);

                    $.ajax({ //
                        url: "/MESCore/api/Upload/Submit",
                        type: "POST",
                        data: form,
                        processData: false,
                        contentType: false,
                        dataType: "JSON"
                    }).done(function (data) {

                        if (data.resultCode === 1000) {

                            data.returnObject.file_url;
                            // $com.util.deleteLowerProperty(zaceDataPhotoObj);
                            var _mode = $com.util.Clone(PositionFileTemp)
                            _mode.FileType = 4;
                            _mode.FilePath = data.returnObject.file_url;
                            _mode.RoutePartPointID = mPointID;

                            _mode.FileName = _data.name;

                            model.com.postFPCRouteFile({
                                data: _mode
                            }, function (res) {
                                alert("新增word成功");
                                model.com.refreshPartFile();
                            });

                        } else {
                            alert("上传失败，请重新再试");
                            clearFiles();
                        }

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

            $("#take-video").on("change", function (event) {
                var input = document.getElementById('take-video');
                var container = document.getElementById('video-show');

                var files = event.target.files;
                if (files && files.length > 0) {
                    var file = files[0];
                    if (file.size > 50 * 1024 * 1024) {
                        alert('视频大于50M，请重新上传');
                        return;
                    }
                    var reader = new FileReader();
                    reader.readAsDataURL(file);

                    var form = new FormData();
                    form.append("file", file);

                    $.ajax({ //
                        url: "/MESCore/api/Upload/Submit",
                        type: "POST",
                        data: form,
                        processData: false,
                        contentType: false,
                        dataType: "JSON"
                    }).done(function (data) {

                        if (data.resultCode === 1000) {

                            data.returnObject.file_url;
                            // $com.util.deleteLowerProperty(zaceDataPhotoObj);
                            var _mode = $com.util.Clone(PositionFileTemp)
                            _mode.FileType = 2;
                            _mode.FilePath = data.returnObject.file_url;


                            // model.com.postFPCRouteFile({
                            //     data: _mode
                            // }, function (res) {
                            //     alert("新增视频成功");
                            //     model.com.refreshPartFile();
                            // });

                        } else {
                            alert("上传失败，请重新再试");
                            clearFiles();
                        }

                    });
                    // reader.addEventListener('loadend', function() {
                    //     const localVideo = document.getElementById('local-video');
                    //     if (localVideo) {
                    //         localVideo.src = reader.result;
                    //     }
                    //     else {
                    //         const video = document.createElement('video');
                    //         video.src = reader.result;
                    //         video.id = 'local-video';
                    //         video.setAttribute('controls', 'controls');
                    //         container.appendChild(video);
                    //     }

                    // })
                }
                else {
                    alert('请重新上传视频');
                }
            });








            //  //新增 2 视频
            $("body").delegate("#zace-return-submitVideo", "click", function () {
                $("#take-video").val("");
                $("#take-video").click();
                // $("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "新增", function (rst) {
                //     //调用插入函数 
                //     if (!rst || $.isEmptyObject(rst))
                //         return;
                //     PositionTemp.OrderID = Number(rst.OrderID);
                //     PositionTemp.RouteID = Number(mRouteIDZace);
                //     PositionTemp.PartID = Number(mPartID);
                //     PositionTemp.PrevStepID = Number(rst.PrevStepID);
                //     PositionTemp.PartPointID = Number(rst.PartPointID);
                //     PositionTemp.ActualPeriod = Number(rst.ActualPeriod);
                //     if (PositionTemp.RouteID == 0 || PositionTemp.PartID == 0 || PositionTemp.PartPointID == 0) {
                //         alert("请重新选择!")
                //         return;
                //     }

                //     model.com.postFPCRoutePartPoint({
                //         data: PositionTemp,
                //     }, function (res) {
                //         alert("新增成功");
                //         model.com.refresh();
                //     })

                // }, TypeSource_Level));


            });
            //  //新增 3 PDF
            $("body").delegate("#zace-return-submitPDF", "click", function () {
                $("#input-pdf").val("");
                $("#input-pdf").click();
                // $("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "新增", function (rst) {
                //     //调用插入函数 
                //     if (!rst || $.isEmptyObject(rst))
                //         return;
                //     PositionTemp.OrderID = Number(rst.OrderID);
                //     PositionTemp.RouteID = Number(mRouteIDZace);
                //     PositionTemp.PartID = Number(mPartID);
                //     PositionTemp.PrevStepID = Number(rst.PrevStepID);
                //     PositionTemp.PartPointID = Number(rst.PartPointID);
                //     PositionTemp.ActualPeriod = Number(rst.ActualPeriod);
                //     if (PositionTemp.RouteID == 0 || PositionTemp.PartID == 0 || PositionTemp.PartPointID == 0) {
                //         alert("请重新选择!")
                //         return;
                //     }

                //     model.com.postFPCRoutePartPoint({
                //         data: PositionTemp,
                //     }, function (res) {
                //         alert("新增成功");
                //         model.com.refresh();
                //     })

                // }, TypeSource_Level));


            });
            //  //新增 4 Word
            $("body").delegate("#zace-return-submitWord", "click", function () {
                $("#input-word").val("");
                $("#input-word").click();
                // $("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "新增", function (rst) {
                //     //调用插入函数 
                //     if (!rst || $.isEmptyObject(rst))
                //         return;
                //     PositionTemp.OrderID = Number(rst.OrderID);
                //     PositionTemp.RouteID = Number(mRouteIDZace);
                //     PositionTemp.PartID = Number(mPartID);
                //     PositionTemp.PrevStepID = Number(rst.PrevStepID);
                //     PositionTemp.PartPointID = Number(rst.PartPointID);
                //     PositionTemp.ActualPeriod = Number(rst.ActualPeriod);
                //     if (PositionTemp.RouteID == 0 || PositionTemp.PartID == 0 || PositionTemp.PartPointID == 0) {
                //         alert("请重新选择!")
                //         return;
                //     }

                //     model.com.postFPCRoutePartPoint({
                //         data: PositionTemp,
                //     }, function (res) {
                //         alert("新增成功");
                //         model.com.refresh();
                //     })

                // }, TypeSource_Level));


            });
            //工序文件
            $("body").delegate("#femi-riskLevel-tbody tr a", "click", function () {

                var $this = $(this);
                var _url = $this.closest('tr').find('td[data-title=DefaultOrder]').attr('data-value');

                window.open(_url);
            });

            //新增 
            $("body").delegate("#zace-add-level", "click", function () {



                $("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "新增", function (rst) {
                    //调用插入函数 
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    PositionTemp.OrderID = Number(rst.OrderID);
                    PositionTemp.RouteID = Number(mRouteIDZace);
                    PositionTemp.PartID = Number(mPartID);
                    PositionTemp.PrevStepID = Number(rst.PrevStepID);
                    PositionTemp.PartPointID = Number(rst.PartPointID);
                    PositionTemp.ActualPeriod = Number(rst.ActualPeriod);
                    PositionTemp.Code = rst.Code;
                    PositionTemp.RoutePartID = wRoutePartID;
                    PositionTemp.Name = rst.Name;

                    if (PositionTemp.RouteID == 0 || PositionTemp.PartID == 0 || PositionTemp.PartPointID == 0) {
                        alert("请重新选择!")
                        return;
                    }

                    model.com.postFPCRoutePartPoint({
                        data: PositionTemp,
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                    })

                }, TypeSource_Level));


            });

            $("body").delegate("#zace-add-levelNextItem", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！");
                    return;
                }
                var default_value = {

                    NextID: SelectData[0].NextID,

                };



                $("body").append($com.modal.show(default_value, KEYWORD_Level, "编辑下层", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    for (var m = 0; m < SelectData[0].NextID.length; m++) {
                        //去掉所有字段
                        delete SelectData[0].NextStepIDMap[SelectData[0].NextID[m]];


                    }

                    for (var k = 0; k < rst.NextID.length; k++) {
                        if (SelectData[0].PartID == rst.NextID[k]) {
                            alert("不能选自己！")
                            return false;
                        }
                        SelectData[0].NextStepIDMap[rst.NextID[k]] = '0';
                    }



                    for (var i = 0; i < SelectData.length; i++) {
                        $com.util.deleteLowerProperty(SelectData[i]);
                    }
                    model.com.postFPCRoutePartPoint({
                        data: SelectData[0],
                    }, function (res) {
                        alert("编辑成功");
                        model.com.refresh();
                        //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                        //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    })

                }, TypeSource_Level));


            });

            $("body").delegate("#zace-remove-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能对一行数据操作！")
                    return;
                }
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {
                    return;
                }

                model.com.DeleteFPCRoutePartPoint({
                    RouteID: SelectData[0].RouteID,
                    ID: SelectData[0].ID,
                }, function (res) {
                    alert("删除成功");
                    model.com.refresh();
                    //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                    //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                })




            });

            //条件查询
            $("body").delegate("#zace-myAudit-level", "click", function () {
                var default_value = {
                    RouteID: 0,
                    PartID: 0,

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.RouteID = Number(rst.RouteID);
                    default_value.PartID = Number(rst.PartID);
                    $com.table.filterByConndition($("#femi-riskLevel-tbody"), DataAll, default_value, "ID");

                }, TypeSource_Level));


            });

            $("body").delegate("#zace-routeLine-level", "click", function () {
                var vdata = { 'header': '工艺路线', 'href': './factory_model/FPCRouteSetting.html', 'id': '50', 'src': './static/images/menu/newfactoryModel/techniqueRoute.png' };
                window.parent.iframeHeaderSet(vdata);

            });



            $("body").delegate("#zace-routePart-level", "click", function () {
                var vdata = { 'header': '工艺工位', 'href': './factory_model/FPCRoutePartSetting.html', 'id': 'FPCRoutePart', 'src': './static/images/menu/newfactoryModel/techniquePart.png' };
                window.parent.iframeHeaderSet(vdata);

            });


            $("body").delegate("#zace-product-level", "click", function () {
                var vdata = { 'header': '产品规格', 'href': './factory_model/ProductSetting.html', 'id': 'ProductSetup', 'src': './static/images/menu/newfactoryModel/productSpecification.png' };
                window.parent.iframeHeaderSet(vdata);

            });
            $("body").delegate("#zace-Fabrication-level", "click", function () {
                var vdata = { 'header': '工艺流程图', 'href': './factory_route/FabricationRoute.html', 'id': 'FabricationRoute', 'src': './static/images/menu/newfactoryModel/fabricationRoute.png' };
                window.parent.iframeHeaderSet(vdata);

            });

            $("body").delegate("#zace-ProductRoute-level", "click", function () {
                var vdata = { 'header': '车型工艺路线', 'href': './factory_model/ProductRouteSetting.html', 'id': 'ProductRouteSetup', 'src': './static/images/menu/newfactoryModel/productTechniqueRoute.png' };
                window.parent.iframeHeaderSet(vdata);

            });

            //上移
            $("body").delegate("#zace-up-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DDDBasic);
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
                var upData = model.com.getDataOne(SelectData[0].RouteID, SelectData[0].PartID, SelectData[0].OrderID);
                upData[0].OrderID += 1;


                $com.util.deleteLowerProperty(SelectData[0]);
                $com.util.deleteLowerProperty(upData[0]);

                model.com.postFPCRoutePartPoint({
                    data: SelectData[0],
                }, function (res) {

                    model.com.postFPCRoutePartPoint({
                        data: upData[0],
                    }, function (res1) {
                        //alert("修改成功");
                        model.com.refresh();
                        //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                        //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    })

                })
            });

            //下移
            $("body").delegate("#zace-down-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DDDBasic);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                } else if (SelectData.length > 1) {
                    alert(" 一次只能对一行数据移动！")
                    return;
                }
                //判断是否在第一行
                var ZAll = model.com.getOrderListByRouteID1(SelectData[0].RouteID, SelectData[0].PartID);

                if (SelectData[0].OrderID == ZAll.length) {
                    alert("已在最后一项！！！");
                    return;
                }

                SelectData[0].OrderID += 1;
                var upData = model.com.getDataOne(SelectData[0].RouteID, SelectData[0].PartID, SelectData[0].OrderID);
                upData[0].OrderID -= 1;
                $com.util.deleteLowerProperty(SelectData[0]);
                $com.util.deleteLowerProperty(upData[0]);

                model.com.postFPCRoutePartPoint({
                    data: SelectData[0],
                }, function (res) {

                    model.com.postFPCRoutePartPoint({
                        data: upData[0],
                    }, function (res1) {
                        //alert("修改成功");
                        model.com.refresh();
                        //var $Tr = $('#femi-riskLevel-tbody tr td[data-title=WID][data-value=' + wid + ']').closest("tr");
                        //$Tr.replaceWith($com.util.template(DATABasic[wid - 1], HTML.TableMode));

                    })

                })
            });
        },



        run: function () {
            mRouteIDZace = model.query.routeID;
            mPartID = model.query.id;
            wRoutePartID = model.query.id;
            wRoutePartID = model.query.RoutePartID;

            mTitle = model.query.title;
            model.com.getFPCRouteInfo({ ID: mRouteIDZace }, function (res_route) {
                if (res_route.info && res_route.info.ID > 0) {
                    mLineID = res_route.info.LineID;
                    mProductID = res_route.info.ProductID;
                    model.com.loadZace();
                } else {
                    alert("方案未找到，请关闭后再试");
                }
            });



        },

        com: {

            create: function (data, fn, context) {
                var d = {
                    $URI: "/FPCRoutePartPoint/Create",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },


            DeleteFPCRoutePartPoint: function (data, fn, context) {
                var d = {
                    $URI: "/FPCRoutePartPoint/Delete",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('删除失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            refreshPartFile: function () {

                model.com.getFPCRouteFile({ RoutePartPointID: mPointID }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        //所有列表
                        var Grade = $com.util.Clone(resP.list);
                        DATABasicPro = $com.util.Clone(resP.list);

                        for (var i = 0; i < Grade.length; i++) {
                            Grade[i].WID = i + 1;
                        }
                        DataAllPro = $com.util.Clone(Grade);

                        $.each(Grade, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_LevelFile[p])
                                    continue;
                                item[p] = FORMATTRT_LevelFile[p](item[p]);
                            }
                            item.WID = i + 1;
                        });
                        DataAllFactorySearchPro = $com.util.Clone(Grade);
                        $("#femi-riskPartFile-tbody").html($com.util.template(Grade, HTML.TableModeFile));

                    }
                });
            },
            loadZace: function () {
                $com.app.loading('数据加载中...');

                model.com.getItemList({ LineID: mLineID, ProductID: mProductID, ID: 0 }, function (resBomItem) {

                    if (resBomItem && resBomItem.list) {
                        var _ParentUnitID = -1;
                        TypeSource_Level.PartPointID = [];
                        $.each(resBomItem.list, function (i, item) {
                            if (item.LevelID == 2 && item.UnitID == mPartID)
                                _ParentUnitID = item.UnitID;
                            if (item.LevelID == 3 && _ParentUnitID > 0 && _ParentUnitID == item.ParentUnitID) {
                                TypeSource_Level.PartPointID.push({
                                    name: item.Name,
                                    value: item.UnitID
                                });

                            }

                        });

                    }
                    $com.app.loaded();

                    model.com.refresh();

                });


            },
            deleteFPCRouteFile: function (data, fn, context) {
                var d = {
                    $URI: "/FPCStepSOP/Delete",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            activeFPCRouteFile: function (data, fn, context) {
                var d = {
                    $URI: "/FPCStepSOP/Active",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            postFPCRouteFile: function (data, fn, context) {
                var d = {
                    $URI: "/FPCStepSOP/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            getFPCRouteFile: function (data, fn, context) {
                var d = {
                    $URI: "/FPCStepSOP/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            create: function (data, fn, context) {
                var d = {
                    $URI: "/FPCRoutePartPoint/Create",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getFPCRouteInfo: function (data, fn, context) {
                var d = {
                    $URI: "/FPCRoute/Info",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取列表
            getItemList: function (data, fn, context) {
                var d = {
                    $URI: "/FMCLineUnit/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            setMMM: function () {
                setTimeout(function () {
                    if (window.parent._zacePartPointSet && window.parent._zacePartPointSet == 1) {
                        model.com.getFPCPartPoint({ FactoryID: 0, BusinessUnitID: 0, ProductTypeID: 0 }, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {

                                TypeSource_Level.PartPointID.splice(1, TypeSource_Level.PartPointID.length - 1);
                                $.each(resW.list, function (i, item) {
                                    TypeSource_Level.PartPointID.push({
                                        name: item.Name,
                                        value: item.ID,
                                    });
                                });
                            }
                            window.parent._zacePartPointSet = 0;
                        });

                    }
                    if (window.parent._zaceRoutePartSet && window.parent._zaceRoutePartSet == 1) {
                        model.com.getFPCRoutePart({ RouteID: 0 }, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {

                                TypeSource_Level.PartID.splice(1, TypeSource_Level.PartID.length - 1);
                                DataPartList = resW.list;
                                $.each(resW.list, function (i, item) {
                                    TypeSource_Level.PartID.push({
                                        name: item.Name,
                                        value: item.ID,
                                        far: item.RouteID,
                                    });
                                });
                            }
                            window.parent._zaceRoutePartSet = 0;
                        });

                    }
                    if (window.parent._zaceRouteSet && window.parent._zaceRouteSet == 1) {
                        model.com.getFPCRoute({ FactoryID: 0, BusinessUnitID: 0, ProductTypeID: 0 }, function (resW) {
                            if (!resW)
                                return;
                            if (resW && resW.list) {

                                DATARouteList = resW.list;
                                TypeSource_Level.RouteID.splice(1, TypeSource_Level.RouteID.length - 1);
                                $.each(resW.list, function (i, item) {
                                    TypeSource_Level.RouteID.push({
                                        name: item.Name,
                                        value: item.ID,
                                        far: null,
                                    });
                                });
                            }
                            window.parent._zaceRouteSet = 0;
                        });

                    }


                    model.com.setMMM();
                }, 500);

            },
            refresh: function () {
                $com.app.loading('数据加载中...');

                $('.zaceTitle').text('(' + mTitle + ')' + '工步集');
                model.com.getFPCRoutePartPoint({ RouteID: mRouteIDZace, RoutePartID: wRoutePartID }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {

                        resP.list.sort(function (a, b) { return Number(a.OrderID) - Number(b.OrderID) });
                        TypeSource_Level.PrevStepID.splice(1, TypeSource_Level.PrevStepID.length - 1);

                        $.each(resP.list, function (i, item) {
                            TypeSource_Level.PrevStepID.push({
                                name: item.PartPointName,
                                value: item.PartPointID,
                            });
                        });

                        TypeSource_Level.NextID = TypeSource_Level.PrevStepID;

                        for (var n = 0; n < resP.list.length; n++) {


                            var C_list = [];
                            for (p in resP.list[n].NextStepIDMap) {

                                C_list.push({
                                    key: p,
                                    value: resP.list[n].NextStepIDMap[p]
                                });


                            }

                            resP.list[n].NextIDText = '';
                            var _listZace = [];
                            for (var j = 0; j < C_list.length; j++) {
                                _listZace.push(Number(C_list[j].key));


                            }


                            resP.list[n].NextID = _listZace;
                            resP.list[n].NextIDText = resP.list[n].NextIDText + FORMATTRT_Level['NextID'](resP.list[n].NextID)


                        }



                        var Grade = $com.util.Clone(resP.list);
                        var DDD = $com.util.Clone(resP.list);
                        DDDBasic = DDD;
                        DATABasic = $com.util.Clone(DDDBasic);
                        DATAZBasic = $com.util.Clone(resP.list);
                        // for (var i = 0; i < DataPartNew.length; i++) {
                        //     var _list = [];
                        //     _list = model.com.getOrderListByRouteIDPro(DataPartNew[i].RouteID, DataPartNew[i].ID);

                        //     for (var m = 0; m < _list.length; m++) {
                        //         Grade.push(_list[m]);
                        //     }
                        // }
                        //审核数据
                        DataAllConfirm = $com.util.Clone(Grade);
                        for (var i = 0; i < Grade.length; i++) {
                            Grade[i].WID = i + 1;
                        }
                        DataAll = $com.util.Clone(Grade);

                        $.each(Grade, function (i, item) {

                            if (item.DefaultOrder && item.DefaultOrder.length > 0) {
                                item.ARander = HTML.ARander;
                            } else {
                                item.ARander = "";
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

                //model.com.getFPCRoutePartPoint({ RouteID:1,PartID:1}, function (resP1) {
                //    if (!resP1)
                //        return;
                //    if (resP1 && resP1.list) {

                //    }

                //});
            },

            renderRouteChart: function (_dataPart) {

                //拿到此路线下对应的工序段
                var OrderIDList = _dataPart;   //順序ID集合
                var routePartArr = [];
                ZaceData = [];   //初始化

                routePartArr = $com.util.Clone(_dataPart);

                $.each(routePartArr, function (i, item) {
                    item.Type = 1;
                });

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
                    // var dataHtml = model.com.changeData(data);
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
                //2 创建结构
                var dataObj = {

                    data: routePartArr,
                    dataSet: {//对应关系
                        Text: "PartPointName", //显示字段名称
                        Index: "PartPointID", //索引字段名称
                        PrevIndex: "PrevStepID", //上级字段名称
                        NextIndex: "NextID", //下级字段名称
                        TypeIndex: "Type", //下级字段名称
                        FatherID: "FatherID",  //父级ID
                        BGC: "aa", //背景色字段名称
                        FGC: "bb", //前景色字段名称
                    },
                    background_color: 'orange', //流程框背景颜色
                    foreground_color: 'orange', //箭头颜色 
                    text_color: "white", //文字颜色
                    fn_mouseover: mouseoverFn, //鼠标悬停触发
                    fn_mouseout: mouseoutFn, //鼠标移走事件
                    fn_click: undefined, //鼠标单击
                    fn_drag: undefined, //鼠标拖动
                    constant: {
                        lineOperation: false,//是否操作线条
                        // dottedLine: true,
                        font: "bold 15px 宋体",//字体样式
                        fontSize: 15,//字体大小
                        rect_width: 200, //矩形的宽
                        rect_height: 50,
                    },
                }
                $('#DragLine').show();
                //4 显示流程图
                $route.show($('#DragLine'), dataObj);


            },

            changeData: function (data) {
                var obj = {
                    工序名: ":" + data.title,
                    顺序: ":" + data.ID,
                    工序段名: ":" + data.PartName,
                    路线名: ":" + data.RouteName,
                    路线编码: ":" + data.VersionNo,
                }
                return obj;
            },
            //查询产品路线
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
            //查询产品路线工序段
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
            //查询工序
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
            //查询某个工序段
            getFPCRoutePartPointInfo: function (data, fn, context) {
                var d = {
                    $URI: "/FPCRoutePartPoint/Info",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
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
            //保存工序段列表
            postFPCRoutePartPoint: function (data, fn, context) {
                var d = {
                    $URI: "/FPCRoutePartPoint/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            DeleteFPCRoutePartPoint: function (data, fn, context) {
                var d = {
                    $URI: "/FPCRoutePartPoint/Delete",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('删除失败，请检查网络');
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

            getDataOne: function (routeID, partID, orderID) {
                var _list = [];
                for (var i = 0; i < DataAll.length; i++) {
                    if (routeID == DataAll[i].RouteID && partID == DataAll[i].PartID && orderID == DataAll[i].OrderID) {
                        _list.push(DataAll[i]);
                    }
                }
                return _list;

            },
            getOrderListByRouteID: function (RouteID) {
                var _list = [];
                var _listOrder = [];
                for (var i = 0; i < DataPartList.length; i++) {
                    if (RouteID == DataPartList[i].RouteID) {
                        _list.push(DataPartList[i]);
                    }
                }

                for (var j = 0; j < _list.length; j++) {

                    for (var i = 0; i < _list.length; i++) {
                        if ((j + 1) == _list[i].OrderID) {
                            _listOrder.push(_list[i]);

                        }
                    }

                }
                return _listOrder;

            },
            getOrderListByRouteIDPro: function (RouteID, PartID) {
                var _list = [];
                var _listOrder = [];
                for (var i = 0; i < DATABasic.length; i++) {
                    if (RouteID == DATABasic[i].RouteID && PartID == DATABasic[i].PartID) {
                        _list.push(DATABasic[i]);
                    }
                }

                for (var j = 0; j < _list.length; j++) {

                    for (var i = 0; i < _list.length; i++) {
                        if ((j + 1) == _list[i].OrderID) {
                            _listOrder.push(_list[i]);

                        }
                    }

                }
                return _listOrder;

            },
            getOrderListByRouteID1: function (RouteID, PartID) {
                var _list = [];
                var _listOrder = [];
                for (var i = 0; i < DDDBasic.length; i++) {
                    if (RouteID == DDDBasic[i].RouteID && PartID == DDDBasic[i].PartID) {
                        _list.push(DDDBasic[i]);
                    }
                }

                for (var j = 0; j < _list.length; j++) {

                    for (var i = 0; i < _list.length; i++) {
                        if ((j + 1) == _list[i].OrderID) {
                            _listOrder.push(_list[i]);

                        }
                    }

                }
                return _listOrder;

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