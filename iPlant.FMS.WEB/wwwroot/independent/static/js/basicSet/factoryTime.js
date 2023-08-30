require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/echarts'], function ($zace, $com, $ec) {

    var KEYWORD_MODE_LIST,//工序
        KEYWORD_MODE,
        FORMATTRT_MODE,
        DEFAULT_VALUE_MODE,
        TypeSource_MODE,
        DataAllPartPoint,
        DataAllPart,

        KEYWORD_Point_LIST,//工序段
        KEYWORD_Point,
        FORMATTRT_Point,
        DEFAULT_VALUE_Point,
        TypeSource_Point,

        KEYWORD_Period_LIST,//历史节拍
        KEYWORD_Period,
        FORMATTRT_Period,
        DEFAULT_VALUE_Period,
        TypeSource_Period,
        DataAllPeriod,
        DataPartTemp,

        KEYWORD_LIST,
        model,
        DEFAULT_VALUE,
        TypeSource,
        DataAll,
        DataAllPoint,
        DataAll1,
        FORMATTRT,
        HTML;

    DataPartTemp = {
        CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Creator: window.parent.User_Info.Name,
        //Creator: "admin",
        EPQ: 0,
        Hours: 0,
        ID: 0,
        LineID: 0,
        MaxTaskRatio: 0,
        NormalTaskRatio: 0,
        PartID: 0,
        PartLiftMinutes: 0,
        PartName: "",
        PartPointID: 0,
        PeriousShifts: 0,
        ProductName: "",
        ProductNo: "",
        ShiftHours: 0,
        ShiftMinutes: 0,
        ShiftMode: 0,
        ShiftParts: 0,
        WorkShopID: 0,
    },


        DataPartPointTemp = {
            CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
            Creator: window.parent.User_Info.Name,
            // Creator: "admin",
            EPQ: 0,
            //ExtensionData: {},
            Hours: 0,
            ID: 0,
            LineID: 0,
            MaxTaskRatio: 0,
            NormalTaskRatio: 0,
            PartID: 0,
            PartLiftMinutes: 0,
            PartName: "",
            PartPointID: 0,
            PeriousShifts: 0,
            ProductName: "",
            ProductNo: "",
            ShiftHours: 0,
            ShiftMinutes: 0,
            ShiftMode: 0,
            ShiftParts: 0,
            WorkShopID: 0,
        };
    DataPeriodTemp = {
        WorkShopID: 0,
        LineID: 0,
        ProductNo: "",
        PartPointID: 0,
        DeviceID: 0,
        Sum: 0,
        TDelayLoad: 0,
        TFastForwart: 0,
        TFastApproach: 0,
        TRoughGrinding1: 0,
        TRoughGrinding2: 0,
        TAccurateGrinding: 0,
        TBuffing: 0,
        TToolReturn: 0,
        TDelayCheck: 0,
        TDelayUnload: 0,
        TRepair: 0,
        Tsum: 0,
        TPart: 0,
    };
    ;
    HTML = {
        TablePartMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td data-title="WorkShopID" data-value="{{WorkShopID}}" >{{WorkShopID}}</td>',
            '<td data-title="LineID" data-value="{{LineID}}" >{{LineID}}</td>',
            '<td data-title="ProductName" data-value="{{ProductName}}" >{{ProductName}}</td>',
            '<td data-title="ProductNo" data-value="{{ProductNo}}" >{{ProductNo}}</td>',
            '<td data-title="PartID" data-value="{{PartID}}" >{{PartID}}</td>',
            '<td data-title="Hours" data-value="{{Hours}}" >{{Hours}}</td>',
            '<td data-title="PartLiftMinutes" data-value="{{PartLiftMinutes}}" >{{PartLiftMinutes}}</td>',
            '<td data-title="NormalTaskRatio" data-value="{{NormalTaskRatio}}" >{{NormalTaskRatio}}</td>',
            '<td data-title="MaxTaskRatio" data-value="{{MaxTaskRatio}}" >{{MaxTaskRatio}}</td>',
            '<td data-title="Creator" data-value="{{Creator}}" >{{Creator}}</td>',
            '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
            '</tr>',
        ].join(""),

        TablePartPointMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td data-title="WorkShopID" data-value="{{WorkShopID}}" >{{WorkShopID}}</td>',
            '<td data-title="LineID" data-value="{{LineID}}" >{{LineID}}</td>',
            '<td data-title="ProductName" data-value="{{ProductName}}" >{{ProductName}}</td>',
            '<td data-title="ProductNo" data-value="{{ProductNo}}" >{{ProductNo}}</td>',
            '<td data-title="PartPointID" data-value="{{PartPointID}}" >{{PartPointID}}</td>',
            '<td data-title="Hours" data-value="{{Hours}}" >{{Hours}}</td>',
            '<td data-title="PartLiftMinutes" data-value="{{PartLiftMinutes}}" >{{PartLiftMinutes}}</td>',
            '<td data-title="NormalTaskRatio" data-value="{{NormalTaskRatio}}" >{{NormalTaskRatio}}</td>',
            '<td data-title="MaxTaskRatio" data-value="{{MaxTaskRatio}}" >{{MaxTaskRatio}}</td>',
            '<td data-title="Creator" data-value="{{Creator}}" >{{Creator}}</td>',
            '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
            '</tr>',
        ].join(""),

        TablePeriodMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="WorkShopID" data-value="{{WorkShopID}}" >{{WorkShopID}}</td>',
            '<td data-title="LineID" data-value="{{LineID}}" >{{LineID}}</td>',
            '<td data-title="ProductNo" data-value="{{ProductNo}}" >{{ProductNo}}</td>',
            '<td data-title="PartPointID" data-value="{{PartPointID}}" >{{PartPointID}}</td>',
            '<td data-title="DeviceID" data-value="{{DeviceID}}" >{{DeviceID}}</td>',
            '<td data-title="Sum" data-value="{{Sum}}" >{{Sum}}</td>',//统计数量
            '<td data-title="TDelayLoad" data-value="{{TDelayLoad}}" >{{TDelayLoad}}</td>',
            '<td data-title="TFastForwart" data-value="{{TFastForwart}}" >{{TFastForwart}}</td>',
            '<td data-title="TFastApproach" data-value="{{TFastApproach}}" >{{TFastApproach}}</td>',
            '<td data-title="TRoughGrinding1" data-value="{{TRoughGrinding1}}" >{{TRoughGrinding1}}</td>',
            '<td data-title="TRoughGrinding2" data-value="{{TRoughGrinding2}}" >{{TRoughGrinding2}}</td>',
            '<td data-title="TAccurateGrinding" data-value="{{TAccurateGrinding}}" >{{TAccurateGrinding}}</td>',
            '<td data-title="TBuffing" data-value="{{TBuffing}}" >{{TBuffing}}</td>',
            '<td data-title="TToolReturn" data-value="{{TToolReturn}}" >{{TToolReturn}}</td>',
            '<td data-title="TDelayCheck" data-value="{{TDelayCheck}}" >{{TDelayCheck}}</td>',
            '<td data-title="TDelayUnload" data-value="{{TDelayUnload}}" >{{TDelayUnload}}</td>',
            '<td data-title="TRepair" data-value="{{TRepair}}" >{{TRepair}}</td>',
            '<td data-title="Tsum" data-value="{{Tsum}}" >{{Tsum}}</td>',//粗磨12+精磨+光磨
            '<td data-title="TPart" data-value="{{TPart}}" >{{TPart}}</td>',

            '</tr>',
        ].join(""),


    };
    $(function () {
        KEYWORD_Point_LIST = [
            "WorkShopID|车间|ArrayOneControl",
            "LineID|产线|ArrayOneControl|WorkShopID",
            "ProductName|规格名称",
            "ProductNo|规格编号|ArrayOne",
            "PartPointID|工序|ArrayOne|PartPointID",
            "Hours|标准工时(秒)",
            "PartLiftMinutes|换装换型时间(分钟)",
            "NormalTaskRatio|正常排班系数",
            "MaxTaskRatio|最大排班系数",
            "Creator|创建者",
            "CreateTime|创建时间|Date",
        ];
        KEYWORD_Point = {};
        FORMATTRT_Point = {};
        DEFAULT_VALUE_Point = {
            hours: 0,
            PartLiftMinutes: 0,
            NormalTaskRatio: 0.0,
            MaxTaskRatio: 0.0,

        };
        TypeSource_Point = {
            WorkShopID: [{
                name: "全部",
                value: 0,
            },
            ],
            LineID: [{
                name: "全部",
                value: 0,
            },
            ],
            PartPointID: [{
                name: "无",
                value: 0,
                far: 0,
            },
            ],
            ProductNo: [{
                name: "全部",
                value: 0,
                far: null,
            },
            ],


        };

        $.each(KEYWORD_Point_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD_Point[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined,
            };
            if (detail.length > 2) {
                FORMATTRT_Point[detail[0]] = $com.util.getFormatter(TypeSource_Point, detail[0], detail[2]);
            }
        });
    });

    $(function () {
        KEYWORD_MODE_LIST = [
            "WorkShopID|车间|ArrayOneControl",
            "LineID|产线|ArrayOneControl|WorkShopID",
            "ProductName|规格名称",
            //"ProductNo|规格编号",
            "ProductNo|规格编号|ArrayOne",
            "PartID|工序段|ArrayOne",
            "Hours|标准工时(秒)",
            "PartLiftMinutes|换装换型时间(分钟)",
            "NormalTaskRatio|正常排班系数",
            "MaxTaskRatio|最大排班系数",
            "Creator|创建者",
            "CreateTime|创建时间|Date",
        ];
        KEYWORD_MODE = {};
        FORMATTRT_MODE = {};

        DEFAULT_VALUE_MODE = {
            hours: 0,
            PartLiftMinutes: 0,
            NormalTaskRatio: 0.0,
            MaxTaskRatio: 0.0,

        };
        TypeSource_MODE = {
            WorkShopID: [{
                name: "全部",
                value: 0,
            },
            ],
            LineID: [{
                name: "全部",
                value: 0,
                far: 0,
            },
            ],
            PartID: [{
                name: "无",
                value: 0,
                far: undefined,
            },

            ],
            ProductNo: [{
                name: "全部",
                value: '0',
                far: null,
            },
            ],
            //Creator: [{
            //    name: "全部",
            //    value: 0,
            //}],

        };

        $.each(KEYWORD_MODE_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD_MODE[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined,
            };
            if (detail.length > 2) {
                FORMATTRT_MODE[detail[0]] = $com.util.getFormatter(TypeSource_MODE, detail[0], detail[2]);
            }
        });
    });


    $(function () {
        KEYWORD_Period_LIST = [
            "WorkShopID|车间|ArrayOneControl",
            "LineID|产线|ArrayOneControl|WorkShopID",
            "ProductNo|产品型号",
            "PartPointID|工序|ArrayOne",
            "DeviceID|设备号|ArrayOne",
            "Sum|统计数量",
            "TDelayLoad|上料等待时长",
            "TFastForwart|快进时长",
            "TFastApproach|快趋势时长",
            "TRoughGrinding1|粗磨1",
            "TRoughGrinding2|粗磨2",
            "TAccurateGrinding|精磨",
            "TBuffing|光磨",
            "TToolReturn|退刀时长",
            "TDelayCheck|检验等待时长",
            "TDelayUnload|下料等待时长",
            "TRepair|平均修整时间",
            "Tsum|有效磨削时长",
            "TPart|总时长",
            "StartTime|开始时间|Date",
            "EndTime|结束时间|Date",

        ];

        KEYWORD_Period = {};
        FORMATTRT_Period = {};


        TypeSource_Period = {
            WorkShopID: [{
                name: "全部",
                value: 0,
            },
            ],
            LineID: [{
                name: "全部",
                value: 0,
                far: 0,
            },
            ],
            PartPointID: [{
                name: "无",
                value: 0,
                far: undefined,
            },
            ],
            DeviceID: [{
                name: "无",
                value: 0,
                far: undefined,
            },
            ],

        };

        $.each(KEYWORD_Period_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD_Period[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined,
            };
            if (detail.length > 2) {
                FORMATTRT_Period[detail[0]] = $com.util.getFormatter(TypeSource_Period, detail[0], detail[2]);
            }
        });
    });
    model = $com.Model.create({
        name: '工时管理',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            //展开工序工时管理
            $("body").delegate("#femi-canvas-show1", "click", function () {
                $(".zzza").hide();
                $(".zzzb").show();

            });

            //展开工序段工时管理
            $("body").delegate("#femi-canvas-show2", "click", function () {
                $(".zzzb").hide();
                $(".zzza").show();

            });

            //展开历史节拍
            $("body").delegate("#zace-open-hisTime", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-factoryTime-tbody1"), "WID", DataAll);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！");
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！");
                    return;
                }
                $(".zzzb").hide();
                $(".zzza").hide();
                $(".zzzc").show();
                $(".zace-time-header").hide();
                //历史节拍查询
                $("body").delegate("#zace-search-Period", "click", function () {
                    var default_value = {
                        StartTime: $com.util.format('yyyy-MM-dd ', new Date()),
                        EndTime: $com.util.format('yyyy-MM-dd ', new Date()),
                    };
                    $("body").append($com.modal.show(default_value, KEYWORD_Period, "查询", function (rst) {
                        if (!rst || $.isEmptyObject(rst))
                            return;

                        default_value.StartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', rst.StartTime);
                        default_value.EndTime = $com.util.format('yyyy-MM-dd hh:mm:ss', rst.EndTime);
                        //alert($('#zace-column').width() + 'px');
                        if (default_value.EndTime >= default_value.StartTime) {
                            //测试历史节拍
                            model.com.getPartPeriod({
                                workShopID: SelectData[0].WorkShopID,
                                lineID: SelectData[0].LineID,
                                partID: SelectData[0].PartID,
                                partpointID: 0,
                                productNo: SelectData[0].ProductNo,
                                startTime: default_value.StartTime,
                                endTime: default_value.EndTime,
                            }, function (dataq) {
                                if (dataq.list.length > 0) {
                                    var DeviceList = model.com.arrayDeviceID(dataq.list);
                                    var List = model.com.dataCount(dataq.list);
                                    for (var i = 0; i < List.length; i++) {
                                        List[i].WorkShopID = SelectData[0].WorkShopID;
                                        List[i].LineID = SelectData[0].LineID;
                                        List[i].ProductNo = SelectData[0].ProductNo;
                                        List[i].TDelayLoad = (List[i].TDelayLoad / List[i].Sum).toFixed(2);
                                        List[i].TFastForwart = (List[i].TFastForwart / List[i].Sum).toFixed(2);
                                        List[i].TFastApproach = (List[i].TFastApproach / List[i].Sum).toFixed(2);
                                        List[i].TRoughGrinding1 = (List[i].TRoughGrinding1 / List[i].Sum).toFixed(2);
                                        List[i].TRoughGrinding2 = (List[i].TRoughGrinding2 / List[i].Sum).toFixed(2);
                                        List[i].TAccurateGrinding = (List[i].TAccurateGrinding / List[i].Sum).toFixed(2);
                                        List[i].TBuffing = (List[i].TBuffing / List[i].Sum).toFixed(2);
                                        List[i].Tsum = (parseFloat(List[i].TRoughGrinding1) + parseFloat(List[i].TRoughGrinding2) + parseFloat(List[i].TAccurateGrinding) + parseFloat(List[i].TBuffing)).toFixed(2);
                                        List[i].TToolReturn = (List[i].TToolReturn / List[i].Sum).toFixed(2);
                                        List[i].TDelayCheck = (List[i].TDelayCheck / List[i].Sum).toFixed(2);
                                        List[i].TDelayUnload = (List[i].TDelayUnload / List[i].Sum).toFixed(2);
                                        List[i].TRepair = (List[i].TRepair / List[i].Sum).toFixed(2);
                                        List[i].TPart = (List[i].TPart / List[i].Sum).toFixed(2);
                                    }
                                    $.each(List, function (i, item) {
                                        for (var p in item) {
                                            if (!FORMATTRT_Period[p])
                                                continue;
                                            item[p] = FORMATTRT_Period[p](item[p]);
                                        }
                                    });

                                    $("#femi-factoryTime-tbody3").html($com.util.template(List, HTML.TablePeriodMode));


                                    var yData = [];
                                    var wTDelayLoad = [];
                                    var wTFastForwart = [];
                                    var wTFastApproach = [];
                                    var wTRoughGrinding1 = [];
                                    var wTRoughGrinding2 = [];
                                    var wTAccurateGrinding = [];
                                    var wTBuffing = [];
                                    var wTToolReturn = [];
                                    var wTDelayCheck = [];
                                    var wTDelayUnload = [];
                                    var wTRepair = [];
                                    var wTsum = [];
                                    var wTPart = [];

                                    for (var i = 0; i < List.length; i++) {
                                        yData.push(List[i].PartPointID);
                                        wTDelayLoad.push(List[i].TDelayLoad);
                                        wTFastForwart.push(List[i].TFastForwart);
                                        wTFastApproach.push(List[i].TFastApproach);
                                        wTRoughGrinding1.push(List[i].TRoughGrinding1);
                                        wTRoughGrinding2.push(List[i].TRoughGrinding2);
                                        wTAccurateGrinding.push(List[i].TAccurateGrinding);
                                        wTBuffing.push(List[i].TBuffing);
                                        wTToolReturn.push(List[i].TToolReturn);
                                        wTDelayCheck.push(List[i].TDelayCheck);
                                        wTDelayUnload.push(List[i].TDelayUnload);
                                        wTRepair.push(List[i].TRepair);
                                        wTsum.push(List[i].Tsum);
                                        wTPart.push(List[i].TPart);
                                    }
                                    model.com.sumList(wTDelayLoad);


                                    $(function () {
                                        //$('#zace-column').width(800+'px');
                                        $('#zace-column').height($('#zace-column').height() + 'px');
                                        var myChart = $ec.init(document.getElementById('zace-column'));
                                        option = {
                                            tooltip: {
                                                trigger: 'axis',
                                                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                                                    type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
                                                },
                                            },
                                            //grid: {
                                            //    x: 30,
                                            //    y: 30,
                                            //    x2: 30,
                                            //    y2: 30
                                            //},
                                            legend: {
                                                data: ['上料等待时长', '快进时长', '快趋近时长', '粗磨1', '粗磨2', '精磨', '光磨', '退刀时长', '检验等待时长', '下料等待时长', '平均休整时间'],
                                            },
                                            toolbox: {
                                                show: true,

                                            },
                                            calculable: true,
                                            xAxis: [
                                                {
                                                    type: 'value',
                                                },
                                            ],
                                            yAxis: [
                                                {
                                                    type: 'category',
                                                    data: yData,
                                                },
                                            ],
                                            series: [
                                                {
                                                    name: '上料等待时长',
                                                    type: 'bar',
                                                    stack: '总量',
                                                    itemStyle: {
                                                        normal: {
                                                            label: {
                                                                show: false,
                                                                position: 'insideRight',
                                                            },
                                                        },
                                                    },
                                                    data: wTDelayLoad,
                                                },
                                                {
                                                    name: '快进时长',
                                                    type: 'bar',
                                                    stack: '总量',
                                                    itemStyle: {
                                                        normal: {
                                                            label: {
                                                                show: false,
                                                                position: 'insideRight',
                                                            },
                                                        },
                                                    },
                                                    data: wTFastForwart,
                                                },
                                                {
                                                    name: '快趋近时长',
                                                    type: 'bar',
                                                    stack: '总量',
                                                    itemStyle: {
                                                        normal: {
                                                            label: {
                                                                show: false,
                                                                position: 'insideRight',
                                                            },
                                                        },
                                                    },
                                                    data: wTFastApproach,
                                                },
                                                {
                                                    name: '粗磨1',
                                                    type: 'bar',
                                                    stack: '总量',
                                                    itemStyle: {
                                                        normal: {
                                                            label: {
                                                                show: false,
                                                                position: 'insideRight',
                                                            },
                                                        },
                                                    },
                                                    data: wTRoughGrinding1,
                                                },
                                                {
                                                    name: '粗磨2',
                                                    type: 'bar',
                                                    stack: '总量',
                                                    itemStyle: {
                                                        normal: {
                                                            label: {
                                                                show: false,
                                                                position: 'insideRight',
                                                            },
                                                        },
                                                    },
                                                    data: wTRoughGrinding2,
                                                },
                                                {
                                                    name: '精磨',
                                                    type: 'bar',
                                                    stack: '总量',
                                                    itemStyle: {
                                                        normal: {
                                                            label: {
                                                                show: false,
                                                                position: 'insideRight',
                                                            },
                                                        },
                                                    },
                                                    data: wTAccurateGrinding,
                                                },
                                                {
                                                    name: '光磨',
                                                    type: 'bar',
                                                    stack: '总量',
                                                    itemStyle: {
                                                        normal: {
                                                            label: {
                                                                show: false,
                                                                position: 'insideRight',
                                                            },
                                                        },
                                                    },
                                                    data: wTBuffing,
                                                },
                                                {
                                                    name: '退刀时长',
                                                    type: 'bar',
                                                    stack: '总量',
                                                    itemStyle: {
                                                        normal: {
                                                            label: {
                                                                show: false,
                                                                position: 'insideRight',
                                                            },
                                                        },
                                                    },
                                                    data: wTToolReturn,
                                                },
                                                {
                                                    name: '检验等待时长',
                                                    type: 'bar',
                                                    stack: '总量',
                                                    itemStyle: {
                                                        normal: {
                                                            label: {
                                                                show: false,
                                                                position: 'insideRight',
                                                            },
                                                        },
                                                    },
                                                    data: wTDelayCheck,
                                                },
                                                {
                                                    name: '下料等待时长',
                                                    type: 'bar',
                                                    stack: '总量',
                                                    itemStyle: {
                                                        normal: {
                                                            label: {
                                                                show: false,
                                                                position: 'insideRight',
                                                            },
                                                        },
                                                    },
                                                    data: wTDelayUnload,
                                                },
                                                {
                                                    name: '平均休整时间',
                                                    type: 'bar',
                                                    stack: '总量',
                                                    itemStyle: {
                                                        normal: {
                                                            label: {
                                                                show: false,
                                                                position: 'insideRight',
                                                            },
                                                        },
                                                    },
                                                    data: wTRepair,
                                                },
                                            ],
                                        };
                                        myChart.setOption(option);


                                    });
                                    $(function () {
                                        $('#zace-cicle').width($('#zace-cicle').width() + 'px');
                                        $('#zace-cicle').height($('#zace-cicle').height() + 'px');
                                        var myChart = $ec.init(document.getElementById('zace-cicle'));
                                        option = {
                                            //title: {
                                            //    text: '节拍统计',                                               
                                            //    x: 'center'
                                            //},
                                            //grid: {
                                            //    x: 10,
                                            //    y: 10,
                                            //    x2: 10,
                                            //    y2: 50,
                                            //},
                                            tooltip: {
                                                trigger: 'item',
                                                formatter: "{a} <br/>{b} : {c} ({d}%)",
                                            },
                                            legend: {
                                                orient: 'vertical',
                                                x: 'left',
                                                data: ['上料等待时长', '快进时长', '快趋近时长', '粗磨1', '粗磨2', '精磨', '光磨', '退刀时长', '检验等待时长', '下料等待时长', '平均休整时间', '有效磨削时长', '总时长'],
                                            },
                                            toolbox: {
                                                show: true,
                                            },
                                            calculable: true,
                                            series: [
                                                {
                                                    name: '节拍统计',
                                                    type: 'pie',
                                                    radius: '55%',
                                                    center: ['50%', '60%'],
                                                    data: [
                                                        {value: model.com.sumList(wTDelayLoad), name: '上料等待时长'},
                                                        {value: model.com.sumList(wTFastForwart), name: '快进时长'},
                                                        {value: model.com.sumList(wTFastApproach), name: '快趋近时长'},
                                                        {value: model.com.sumList(wTRoughGrinding1), name: '粗磨1'},
                                                        {value: model.com.sumList(wTRoughGrinding2), name: '粗磨2'},
                                                        {value: model.com.sumList(wTAccurateGrinding), name: '精磨'},
                                                        {value: model.com.sumList(wTBuffing), name: '光磨'},
                                                        {value: model.com.sumList(wTToolReturn), name: '退刀时长'},
                                                        {value: model.com.sumList(wTDelayCheck), name: '检验等待时长'},
                                                        {value: model.com.sumList(wTDelayUnload), name: '下料等待时长'},
                                                        {value: model.com.sumList(wTRepair), name: '平均休整时间'},
                                                        {value: model.com.sumList(wTsum), name: '有效磨削时长'},
                                                        {value: model.com.sumList(wTPart), name: '总时长'},

                                                    ],
                                                },
                                            ],
                                        };

                                        myChart.setOption(option);


                                    });

                                } else {
                                    alert("无数据");
                                    return true;

                                }


                            });
                        } else {
                            alert("结束时间需大于开始时间");
                        }


                    }, TypeSource_Period));

                });

                //隐藏图
                $("body").delegate("#zace-close-mode", "click", function () {
                    $(".zace-time-header").hide();
                    $(".zace-time-footer").css('top', '0px');


                });
                //显示图
                $("body").delegate("#zace-show-mode", "click", function () {
                    $(".zace-time-header").show();
                    $(".zace-time-footer").css('top', '450px');
                });

            });
            //返回到工序段
            $("body").delegate("#zace-exit-time", "click", function () {
                $(".zzzb").hide();
                $(".zzzc").hide();
                $(".zzza").show();

            });

            //工序段查询
            $("body").delegate("#zace-search-part", "click", function () {
                var default_value = {
                    WorkShopID: 0,
                    LineID: 0,
                    ProductNo: '0',
                };
                $("body").append($com.modal.show(default_value, KEYWORD_MODE, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.WorkShopID = rst.WorkShopID;
                    default_value.LineID = rst.LineID;
                    default_value.ProductNo = rst.ProductNo;
                    if (default_value.WorkShopID == 0 || default_value.LineID == 0 || default_value.ProductNo == '0') {
                        alert("请重新选择");
                    } else {

                        model.com.get({ProductNo: default_value.ProductNo, IsPartPoint: 0}, function (resNo) {
                            if (resNo && resNo.list.length > 0) {

                                var _listSearch = $com.util.Clone(resNo.list);
                                DataAll = resNo.list;
                                for (var i = 0; i < DataAll.length; i++) {
                                    DataAll[i].WID = i + 1;
                                }
                                model.com.refresh();
                            } else {

                                DataAll = [];
                                for (var j = 0; j < DataAllPart.length; j++) {
                                    if (default_value.WorkShopID == DataAllPart[j].WorkShopID && default_value.LineID == DataAllPart[j].LineID) {
                                        DataAll.push(DataAllPart[j]);

                                    }
                                }
                                for (var m = 0; m < DataAll.length; m++) {
                                    DataAll[m].ProductName = DataAll[m].ProductNo = rst.ProductNo;
                                    DataAll[m].WID = m + 1;
                                }

                                model.com.refresh();
                            }

                        });

                    }
                }, TypeSource_MODE));


            });
            //修改
            $("body").delegate("#zace-edit-part", "click", function () {
                // var SelectData = $com.table.getSelectionData($("#femi-factoryTime-tbody1"), "PartID", DataAll);
                var SelectData = $com.table.getSelectionData($("#femi-factoryTime-tbody1"), "WID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择至少一行数据再试！");
                    return;
                }
                var default_value = {
                    Hours: 0,
                    PartLiftMinutes: 0,
                    NormalTaskRatio: 0,
                    MaxTaskRatio: 0,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_MODE, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    for (var i = 0; i < SelectData.length; i++) {
                        SelectData[i].Hours = rst.Hours;
                        SelectData[i].PartLiftMinutes = rst.PartLiftMinutes;
                        SelectData[i].NormalTaskRatio = rst.NormalTaskRatio;
                        SelectData[i].MaxTaskRatio = rst.MaxTaskRatio;
                        SelectData[i].Creator = window.parent.User_Info.Name;
                        SelectData[i].CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date());
                    }


                    model.com.save({
                        data: DataAll,
                        ProductNo: SelectData[0].ProductNo,
                        IsPartPoint: 0,

                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                    });

                }, TypeSource_MODE));


            });

            //工序段导出
            $("body").delegate("#zace-export-part", "click", function () {
                var $table = $(".table-part"),
                    fileName = "工序段.xls",
                    Title = "工序段";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });

            });

            //刷新
            $("body").delegate("#zace-refresh-part", "click", function () {
                model.com.refresh();
            });


            //工序查询
            $("body").delegate("#zace-search-partPoint", "click", function () {
                var default_value = {
                    WorkShopID: 0,
                    LineID: 0,
                    ProductNo: '0',
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Point, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.WorkShopID = rst.WorkShopID;
                    default_value.LineID = rst.LineID;
                    default_value.ProductNo = rst.ProductNo;
                    if (default_value.WorkShopID == 0 || default_value.LineID == 0 || default_value.ProductNo == '0') {
                        alert("请重新选择");
                    } else {
                        model.com.get({ProductNo: default_value.ProductNo, IsPartPoint: 1}, function (resNo) {
                            if (resNo && resNo.list.length > 0) {
                                DataAllPoint = resNo.list;
                                for (var i = 0; i < DataAllPoint.length; i++) {
                                    DataAllPoint[i].WorkShopID = rst.WorkShopID;
                                    DataAllPoint[i].LineID = rst.LineID;
                                }
                                for (var i = 0; i < DataAllPoint.length; i++) {
                                    DataAllPoint[i].WID = i + 1;
                                }
                                model.com.refresh();
                            } else {
                                DataAllPoint = [];
                                for (var i = 0; i < DataAllPartPoint.length; i++) {
                                    if (default_value.WorkShopID == DataAllPartPoint[i].WorkShopID && default_value.LineID == DataAllPartPoint[i].LineID) {
                                        DataAllPoint.push(DataAllPartPoint[i]);

                                    }
                                }
                                for (var j = 0; j < DataAllPoint.length; j++) {
                                    DataAllPoint[j].ProductName = DataAllPoint[j].ProductNo = rst.ProductNo;
                                    DataAllPoint[j].WID = j + 1;
                                }
                                model.com.refresh();
                            }
                        });
                    }
                }, TypeSource_Point));
            });

            //修改
            $("body").delegate("#zace-edit-partPoint", "click", function () {
                // var SelectData = $com.table.getSelectionData($("#femi-factoryTime-tbody1"), "PartID", DataAll);
                var SelectData = $com.table.getSelectionData($("#femi-factoryTime-tbody2"), "WID", DataAllPoint);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择至少一行数据再试！");
                    return;
                }
                var default_value = {
                    Hours: 0,
                    PartLiftMinutes: 0,
                    NormalTaskRatio: 0,
                    MaxTaskRatio: 0,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_MODE, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    for (var i = 0; i < SelectData.length; i++) {
                        SelectData[i].Hours = rst.Hours;
                        SelectData[i].PartLiftMinutes = rst.PartLiftMinutes;
                        SelectData[i].NormalTaskRatio = rst.NormalTaskRatio;
                        SelectData[i].MaxTaskRatio = rst.MaxTaskRatio;
                        SelectData[i].Creator = window.parent.User_Info.Name;
                        SelectData[i].CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date());
                    }


                    model.com.save({
                        data: DataAllPoint,
                        //ProductNo: '15TAC47B',
                        ProductNo: SelectData[0].ProductNo,
                        IsPartPoint: 1,

                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                    });

                }, TypeSource_MODE));
            });

            //工序导出
            $("body").delegate("#zace-export-partPoint", "click", function () {

                var $table = $(".table-Point"),
                    fileName = "工序.xls",
                    Title = "工序";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });

            });

            //刷新
            $("body").delegate("#zace-refresh-partPoint", "click", function () {
                model.com.refresh();
            });


        },


        run: function () {
            $('.zzzb').hide();
            $(".zzzc").hide();

            //获取车间信息
            model.com.getWorkShop({}, function (data) {

                $.each(data.list, function (i, item) {
                    TypeSource_MODE.WorkShopID.push({
                        name: item.WorkShopName,
                        value: item.ID,
                        far: null,
                    });
                    $.each(item.LineList, function (l_i, l_item) {
                        TypeSource_MODE.LineID.push({
                            name: l_item.ItemName,
                            value: l_item.ID,
                            far: item.ID,
                        });
                    });
                    TypeSource_Point.WorkShopID = TypeSource_MODE.WorkShopID;
                    TypeSource_Point.LineID = TypeSource_MODE.LineID;
                    TypeSource_Period.WorkShopID = TypeSource_MODE.WorkShopID;
                    TypeSource_Period.LineID = TypeSource_MODE.LineID;
                });

                //得到设备列表
                model.com.getDevice({}, function (resDevice) {
                    $.each(resDevice.list, function (i, item) {
                        TypeSource_Period.DeviceID.push({
                            name: item.DeviceNo,
                            //value: item.ID,
                            value: item.DeviceID,
                        });
                    });
                });


                //得到所有的产品编号
                model.com.getProductAll({}, function (res2) {
                    $.each(res2.list, function (i, item) {
                        TypeSource_MODE.ProductNo.push({
                            name: item.ProductName,
                            //value: item.ID,
                            value: item.ProductNo,
                            far: null,
                        });
                    });
                    TypeSource_Point.ProductNo = TypeSource_MODE.ProductNo;
                    //TypeSource_Period.ProductNo = TypeSource_Period.ProductNo;
                });

                //工序 工序段
                model.com.getConfigAll({}, function (data_Part) {

                    $.each(data_Part.list, function (p_i, p_item) {
                        TypeSource_MODE.PartID = TypeSource_MODE.PartID.concat($com.table.getTypeSource(p_item.PartList, "PartID", "PartName"));

                        $.each(p_item.PartList, function (pp_i, pp_item) {

                            TypeSource_Point.PartPointID = TypeSource_Point.PartPointID.concat($com.table.getTypeSource(pp_item.PartPointList, "PartPointID", "PartPointName", undefined, "PartID"));
                            TypeSource_Period.PartPointID = TypeSource_Period.PartPointID.concat($com.table.getTypeSource(pp_item.PartPointList, "PartPointID", "PartPointName", undefined, "PartID"));
                        });
                    });
                    DataAllPart = model.com.createPart(data_Part.list);
                    DataAllPartPoint = model.com.createPartPoint(data_Part.list);

                    model.com.refresh();

                });

            });


        },

        com: {
            get: function (data, fn, context) {
                var d = {
                    $URI: "/PartProduct/All",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            getDevice: function (data, fn, context) {
                var d = {
                    $URI: "/Device/All",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getConfigAll: function (data, fn, context) {
                var d = {
                    $URI: "/APSLine/ConfigAll",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getPartPeriod: function (data, fn, context) {
                var d = {
                    $URI: "/PartPeriod/All",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getProductAll: function (data, fn, context) {
                var d = {
                    $URI: "/APSProduct/All",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            save: function (data, fn, context) {
                var d = {
                    $URI: "/PartProduct/Save",
                    $TYPE: "post",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            postExportExcel: function (data, fn, context) {
                var d = {
                    $URI: "/Upload/ExportExcel",
                    $TYPE: "post",
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
            getWorkShop: function (data, fn, context) {
                var d = {
                    $URI: "/WorkShop/All",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            refresh: function () {

                var _list = $com.util.Clone(DataAll);
                $.each(_list, function (i, item) {
                    for (var p in item) {
                        if (!FORMATTRT_MODE[p])
                            continue;
                        item[p] = FORMATTRT_MODE[p](item[p]);
                    }
                });
                $("#femi-factoryTime-tbody1").html($com.util.template(_list, HTML.TablePartMode));

                var _listPoint = $com.util.Clone(DataAllPoint);
                $.each(_listPoint, function (i, item) {
                    for (var p in item) {
                        if (!FORMATTRT_Point[p])
                            continue;
                        item[p] = FORMATTRT_Point[p](item[p]);
                    }
                });
                $("#femi-factoryTime-tbody2").html($com.util.template(_listPoint, HTML.TablePartPointMode));


                //var _listPeriod = $com.util.Clone(DataAllPeriod);
                //$.each(_listPeriod, function (i, item) {
                //    for (var p in item) {
                //        if (!FORMATTRT_Period[p])
                //            continue;
                //        item[p] = FORMATTRT_Period[p](item[p]);
                //    }
                //});
                //$("#femi-factoryTime-tbody3").html($com.util.template(_listPeriod, HTML.TablePeriodMode));
            },

            createPart: function (list) {
                var _list = [];
                $.each(list, function (i, item) {
                    //item  APSLine
                    $.each(item.PartList, function (p_i, p_item) {
                        //p_item APSPart
                        var _temp = $com.util.Clone(DataPartTemp);
                        _temp.LineID = p_item.LineID;
                        _temp.PartID = p_item.PartID;
                        _temp.WorkShopID = p_item.WorkShopID;

                        _list.push(_temp);
                    });

                });
                return _list;
            },
            createPartPoint: function (list) {
                var _list = [];
                $.each(list, function (i, item) {
                    //item  APSLine
                    $.each(item.PartList, function (p_i, p_item) {
                        //p_item APSPart

                        $.each(p_item.PartPointList, function (pp_i, pp_item) {
                            //pp_item APSPartPoint

                            var _temp = $com.util.Clone(DataPartPointTemp);
                            _temp.LineID = pp_item.LineID;
                            _temp.WorkShopID = pp_item.WorkShopID;
                            _temp.PartPointID = pp_item.PartPointID;

                            _list.push(_temp);
                        });
                    });

                });
                return _list;
            },
            //得到DeviceID
            arrayDeviceID: function (list) {
                var arr = [];
                $.each(list, function (i, item) {
                    arr.push(item.DeviceID);
                    // arr.push(item);

                });
                var arr2 = arr.sort();
                var res = [arr2[0]];

                for (var i = 1; i < arr2.length; i++) {

                    if (arr2[i] !== res[res.length - 1]) {
                        res.push(arr2[i]);
                    }
                }
                return res;
            },
            //比较时间
            compareDate: function (d1, d2) {
                return ((new Date(d1.replace(/-/g, "\/"))) > (new Date(d2.replace(/-/g, "\/"))));
            },
            dataCount: function (list) {
                var DeviceList = model.com.arrayDeviceID(list);
                var _list = [];

                for (var i = 0; i < DeviceList.length; i++) {
                    var _temp = $com.util.Clone(DataPeriodTemp);
                    for (var j = 0; j < list.length; j++) {
                        if (DeviceList[i] == list[j].DeviceID) {
                            _temp.PartPointID = list[j].PartType;
                            _temp.DeviceID = list[j].DeviceID;
                            _temp.Sum += 1;
                            _temp.TDelayLoad += list[j].TDelayLoad;
                            _temp.TFastForwart += list[j].TFastForwart;
                            _temp.TFastApproach += list[j].TFastApproach;
                            _temp.TRoughGrinding1 += list[j].TRoughGrinding1;
                            _temp.TRoughGrinding2 += list[j].TRoughGrinding2;
                            _temp.TAccurateGrinding += list[j].TAccurateGrinding;
                            _temp.TBuffing += list[j].TBuffing;
                            _temp.TToolReturn += list[j].TToolReturn;
                            _temp.TDelayCheck += list[j].TDelayCheck;
                            _temp.TDelayUnload += list[j].TDelayUnload;
                            _temp.TRepair += list[j].TRepair;
                            // _temp.Tsum+=list[j].TDelayLoad,
                            _temp.TPart += list[j].TPart;

                        }
                    }
                    _list.push(_temp);
                }

                return _list;


            },
            //求和
            sumList: function (list) {
                var sum = 0;
                for (var i = 0; i < list.length; i++) {
                    sum += parseFloat(list[i]);
                }
                return sum.toFixed(2);
            },
        },
    });

    model.init();


});