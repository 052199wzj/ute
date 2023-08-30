require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/paging'
], function ($zace, $com, $page) {
    var mZCommitStartTime = $com.util.format("yyyy-MM-dd", new Date().getTime() - 7 * 24 * 3600 * 1000);
    var mZCommitEndTime = $com.util.format("yyyy-MM-dd", new Date().getTime() + 24 * 3600 * 10);
    var DeviceID = 0;
    var HTML;
    HTML = {
        TempLeft: [
            '<tr data-color="">',
            '<td style="display:none" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
            '<td data-title="TemperatureValue" data-value="{{TemperatureValue}}" >{{TemperatureValue}}</td>',
            '<td data-title="CurrentValue" data-value="{{CurrentValue}}" >{{CurrentValue}}</td>',
            '<td data-title="TemperatureOutOfLine" data-value="{{TemperatureOutOfLine}}" >{{TemperatureOutOfLine}}</td>',
            '<td data-title="CurrentCrossing" data-value="{{CurrentCrossing}}">{{CurrentCrossing}}</td>',
            '</tr>',
        ].join(""),
        TempRight: [
            '<tr data-color="">',
            '<td style="display:none" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="AlarmNumber" data-value="{{AlarmNumber}}" >{{AlarmNumber}}</td>',
            '<td data-title="AlarmInformation" data-value="{{AlarmInformation}}" >{{AlarmInformation}}</td>',
            '<td data-title="AlarmTime" data-value="{{AlarmTime}}" >{{AlarmTime}}</td>',
            '</tr>',
        ].join(""),
        TableNode_item: [
            '<tr data-color="">',
            '<td style="display:none" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="1" data-value="{{1}}" >{{1}}</td>',
            '<td data-title="2" data-value="{{2}}" >{{2}}</td>',
            '<td data-title="3" data-value="{{3}}" >{{3}}</td>',
            '<td data-title="4" data-value="{{4}}" >{{4}}</td>',
            '<td data-title="5" data-value="{{5}}">{{5}}</td>',
            '<td data-title="6" data-value="{{6}}">{{6}}</td>',
            '<td data-title="7" data-value="{{7}}">{{7}}</td>',
            '<td data-title="8" data-value="{{8}}">{{8}}</td>',
            '<td data-title="9" data-value="{{9}}">{{9}}</td>',
            '<td data-title="10" data-value="{{10}}">{{10}}</td>',
            '<td data-title="11" data-value="{{11}}">{{11}}</td>',
            '<td data-title="12" data-value="{{12}}">{{12}}</td>',
            '<td data-title="13" data-value="{{13}}">{{13}}</td>',
            '<td data-title="14" data-value="{{14}}">{{14}}</td>',
            '</tr>',
        ].join(""),
    };
    TempLeftArray = [
        {
            ID: 1,
            Name: "1#电机",
            TemperatureValue: 0,
            CurrentValue: 0,
            TemperatureOutOfLine: 0,
            CurrentCrossing: 0,
        },
        {
            ID: 2,
            Name: "2#电机",
            TemperatureValue: 0,
            CurrentValue: 0,
            TemperatureOutOfLine: 0,
            CurrentCrossing: 0,
        }, {
            ID: 3,
            Name: "3#电机",
            TemperatureValue: 0,
            CurrentValue: 0,
            TemperatureOutOfLine: 0,
            CurrentCrossing: 0,
        }, {
            ID: 4,
            Name: "4#电机",
            TemperatureValue: 0,
            CurrentValue: 0,
            TemperatureOutOfLine: 0,
            CurrentCrossing: 0,
        }
    ];
    TempRightArray = [
        {
            ID: 1,
            AlarmNumber: "10001",
            AlarmInformation: "左则镟轮上升故障",
            AlarmTime: "2020-08-19 14:48:38",
        }, {
            ID: 2,
            AlarmNumber: "10001",
            AlarmInformation: "左则镟轮上升故障",
            AlarmTime: "2020-08-19 14:48:38",
        }, {
            ID: 3,
            AlarmNumber: "10001",
            AlarmInformation: "左则镟轮上升故障",
            AlarmTime: "2020-08-19 14:48:38",
        }, {
            ID: 4,
            AlarmNumber: "10001",
            AlarmInformation: "左则镟轮上升故障",
            AlarmTime: "2020-08-19 14:48:38",
        }
    ];
    ArrayDevice = [
        {
            1: 1,
            2: "",
            3: "",
            4: "",
            5: "",
            6: "",
            7: "前:100; 后200",
            8: "前:100; 后200",
            9: "前:100; 后200",
            10: "前:100; 后200",
            11: 0,
            12: 0,
            13: 0,
            14: 0,
        },
        {
            1: 1,
            2: "",
            3: "",
            4: "",
            5: "",
            6: "",
            7: "前:100; 后200",
            8: "前:100; 后200",
            9: "前:100; 后200",
            10: "前:100; 后200",
            11: 0,
            12: 0,
            13: 0,
            14: 0,
        },
        {
            1: 1,
            2: "",
            3: "",
            4: "",
            5: "",
            6: "",
            7: "前:100; 后200",
            8: "前:100; 后200",
            9: "前:100; 后200",
            10: "前:100; 后200",
            11: 0,
            12: 0,
            13: 0,
            14: 0,
        },
        {
            1: 1,
            2: "",
            3: "",
            4: "",
            5: "",
            6: "",
            7: "前:100; 后200",
            8: "前:100; 后200",
            9: "前:100; 后200",
            10: "前:100; 后200",
            11: 0,
            12: 0,
            13: 0,
            14: 0,
        },
        {
            1: 1,
            2: "",
            3: "",
            4: "",
            5: "",
            6: "",
            7: "前:100; 后200",
            8: "前:100; 后200",
            9: "前:100; 后200",
            10: "前:100; 后200",
            11: 0,
            12: 0,
            13: 0,
            14: 0,
        },
        {
            1: 1,
            2: "",
            3: "",
            4: "",
            5: "",
            6: "",
            7: "前:100; 后200",
            8: "前:100; 后200",
            9: "前:100; 后200",
            10: "前:100; 后200",
            11: 0,
            12: 0,
            13: 0,
            14: 0,
        },
        {
            1: 1,
            2: "",
            3: "",
            4: "",
            5: "",
            6: "",
            7: "前:100; 后200",
            8: "前:100; 后200",
            9: "前:100; 后200",
            10: "前:100; 后200",
            11: 0,
            12: 0,
            13: 0,
            14: 0,
        },
        {
            1: 1,
            2: "",
            3: "",
            4: "",
            5: "",
            6: "",
            7: "前:100; 后200",
            8: "前:100; 后200",
            9: "前:100; 后200",
            10: "前:100; 后200",
            11: 0,
            12: 0,
            13: 0,
            14: 0,
        },
        {
            1: 1,
            2: "",
            3: "",
            4: "",
            5: "",
            6: "",
            7: "前:100; 后200",
            8: "前:100; 后200",
            9: "前:100; 后200",
            10: "前:100; 后200",
            11: 0,
            12: 0,
            13: 0,
            14: 0,
        },
        {
            1: 1,
            2: "",
            3: "",
            4: "",
            5: "",
            6: "",
            7: "前:100; 后200",
            8: "前:100; 后200",
            9: "前:100; 后200",
            10: "前:100; 后200",
            11: 0,
            12: 0,
            13: 0,
            14: 0,
        },
        {
            1: 1,
            2: "",
            3: "",
            4: "",
            5: "",
            6: "",
            7: "前:100; 后200",
            8: "前:100; 后200",
            9: "前:100; 后200",
            10: "前:100; 后200",
            11: 0,
            12: 0,
            13: 0,
            14: 0,
        },
        {
            1: 1,
            2: "",
            3: "",
            4: "",
            5: "",
            6: "",
            7: "前:100; 后200",
            8: "前:100; 后200",
            9: "前:100; 后200",
            10: "前:100; 后200",
            11: 0,
            12: 0,
            13: 0,
            14: 0,
        },
        {
            1: 1,
            2: "",
            3: "",
            4: "",
            5: "",
            6: "",
            7: "前:100; 后200",
            8: "前:100; 后200",
            9: "前:100; 后200",
            10: "前:100; 后200",
            11: 0,
            12: 0,
            13: 0,
            14: 0,
        },
        {
            1: 1,
            2: "",
            3: "",
            4: "",
            5: "",
            6: "",
            7: "前:100; 后200",
            8: "前:100; 后200",
            9: "前:100; 后200",
            10: "前:100; 后200",
            11: 0,
            12: 0,
            13: 0,
            14: 0,
        },
        {
            1: 1,
            2: "",
            3: "",
            4: "",
            5: "",
            6: "",
            7: "前:100; 后200",
            8: "前:100; 后200",
            9: "前:100; 后200",
            10: "前:100; 后200",
            11: 0,
            12: 0,
            13: 0,
            14: 0,
        },
        {
            1: 1,
            2: "",
            3: "",
            4: "",
            5: "",
            6: "",
            7: "前:100; 后200",
            8: "前:100; 后200",
            9: "前:100; 后200",
            10: "前:100; 后200",
            11: 0,
            12: 0,
            13: 0,
            14: 0,
        },
        {
            1: 1,
            2: "",
            3: "",
            4: "",
            5: "",
            6: "",
            7: "前:100; 后200",
            8: "前:100; 后200",
            9: "前:100; 后200",
            10: "前:100; 后200",
            11: 0,
            12: 0,
            13: 0,
            14: 0,
        }
    ];

    model = $com.Model.create({
        name: '旋床',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();
        },

        events: function () {


            $("body").delegate("#alfie-add-level-back", "click", function () {
                $("#contain").show();
                $(".zace-leftContain").hide();
                $(window).resize();
            });

            //重置
            $("body").delegate("#lmvt-reset", "click", function () {
                mZCommitStartTime = $com.util.format("yyyy-MM-dd", new Date().getTime() - 7 * 24 * 3600 * 1000);
                mZCommitEndTime = $com.util.format("yyyy-MM-dd", new Date().getTime() + 24 * 3600 * 1000);
                $("#lmvt-startTime-Send").val(mZCommitStartTime);
                $("#lmvt-endTime-Send").val(mZCommitEndTime);
            });
            //查询
            $("body").delegate("#lmvt-search", "click", function () {
                //查询开始时间
                mZCommitStartTime = $("#lmvt-startTime-Send").val();
                //查询结束时间
                mZCommitEndTime = $("#lmvt-endTime-Send").val();

                if (mZCommitStartTime == "" || mZCommitEndTime == "") {
                    mZCommitStartTime = $com.util.format("yyyy-MM-dd", new Date().getTime() - 7 * 24 * 3600 * 1000);
                    mZCommitEndTime = $com.util.format("yyyy-MM-dd", new Date().getTime() + 24 * 3600 * 1000);
                }

                model.com.refreshDeviceInfo(DeviceID);
            });
            $("#lmvt-startTime-Send").datetimepicker({
                format: 'yyyy-mm-dd',//显示格式
                startView: 'year',
                maxView: 'year',
                minView: 'month',
                language: 'zh-CN',
                autoclose: true,//选择后自动关闭
                clearBtn: true,//清除按钮
                todayBtn: true,
                showClear: true,
            }).on('changeDate', function (ev) {
                var startTime = $("#lmvt-startTime-Send").val();
                $("#lmvt-endTime-Send").datetimepicker("setStartDate", startTime);
            });
            $("#lmvt-endTime-Send").datetimepicker({
                format: 'yyyy-mm-dd',//显示格式
                startView: 'year',
                maxView: 'year',
                minView: 'month',
                language: 'zh-CN',
                autoclose: true,//选择后自动关闭
                clearBtn: true,//清除按钮
                todayBtn: true,
                showClear: true,
            }).on('changeDate', function (ev) {
                var endTime = $("#lmvt-endTime-Send").val();
                $("#lmvt-startTime-Send").datetimepicker("setEndDate", endTime.toString("yyyy-MM-dd"));
            });
            $(window).scroll(function () {
                $(window).resize();
            });
        },

        run: function () {
            $(".selectpicker").selectpicker({
                noneSelectedText: '请选择',//默认显示内容
                deselectAllText: '全不选',
                selectAllText: '全选',
            });
            $("#lmvt-startTime-Send").val(mZCommitStartTime);
            $("#lmvt-endTime-Send").val(mZCommitEndTime);


            $("#ds-middle-left-table").html($com.util.template(TempLeftArray, HTML.TempLeft));
            $("#ds-middle-right-table").html($com.util.template(TempRightArray, HTML.TempRight));
            $("#femi-Device-tbody-item").html($com.util.template(ArrayDevice, HTML.TableNode_item));
            $("#femi-Device-tbody-item1").html($com.util.template(ArrayDevice, HTML.TableNode_item));

            $page.init($("#femi-Device-tbody-item").closest("table"), ArrayDevice, "", function (res) {
                $("#femi-Device-tbody-item").html($com.util.template(res, HTML.TableNode_item));
            }, 7);
            $page.init($("#femi-Device-tbody-item1").closest("table"), ArrayDevice, "", function (res) {
                $("#femi-Device-tbody-item1").html($com.util.template(res, HTML.TableNode_item));
            }, 7);
            $(window).resize();

            //电机工作参数
            model.com.getDeviceCurrentAll({
                DeviceID: 3
            }, function (res) {
                StructAll = res.list;
            });
            model.com.getDMSDeviceAlarm({
                DeviceID: 3
            }, function (res) {
                DeviceAlarm = res.list;
            });
        },


        com: {
            refreshDeviceInfo: function (DeviceID) {

            },
            //获取设备实时参数
            getDeviceCurrentAll: function (data, fn, context) {
                var d = {
                    $URI: "/DMSDeviceRealParameter/DeviceCurrentAll",
                    $TYPE: "Get",

                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //系统报警
            getDMSDeviceAlarm: function (data, fn, context) {
                var d = {
                    $URI: "/DMSDeviceAlarm/DeviceInfo",
                    $TYPE: "Get",

                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
        }
    }),

        model.init();


});