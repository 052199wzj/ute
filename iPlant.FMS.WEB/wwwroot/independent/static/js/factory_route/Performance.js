require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {
    var KEYWORD_Device_LIST_item,
        KEYWORD_Device_item,
        FORMATTRT_Device_item,
        DEFAULT_VALUE_Device_item,
        TypeSource_Device_item,
        ItemShow,
        mData,
        HTML;

    HTML = {
        TableNode_item: [
            '<tr data-color="">',
            '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td>',
            '<td style="min-width: 50px" data-title="ProjectName" data-value="{{ProjectName}}">{{ProjectName}}</td>',
            '<td style="min-width: 50px" data-title="ModuleName" data-value="{{ModuleName}}">{{ModuleName}}</td>',
            '<td style="min-width: 50px" data-title="FuncName" data-value="{{FuncName}}">{{FuncName}}</td>',
            '<td style="min-width: 50px" data-title="MaxMS" data-value="{{MaxMS}}">{{MaxMS}}</td>',
            '<td style="min-width: 50px" data-title="MinMS" data-value="{{MinMS}}">{{MinMS}}</td>',
            '<td style="min-width: 50px" data-title="SumMS" data-value="{{SumMS}}">{{SumMS}}</td>',
            '<td style="min-width: 50px" data-title="AvgMS" data-value="{{AvgMS}}">{{AvgMS}}</td>',
            '<td style="min-width: 50px" data-title="OutTimeMS" data-value="{{OutTimeMS}}">{{OutTimeMS}}</td>',
            '<td style="min-width: 50px" data-title="CallOutTimes" data-value="{{CallOutTimes}}">{{CallOutTimes}}</td>',
            '<td style="min-width: 50px" data-title="CallTimes" data-value="{{CallTimes}}">{{CallTimes}}</td>',
            '<td style="min-width: 50px" data-title="AvgCallTimes" data-value="{{AvgCallTimes}}">{{AvgCallTimes}}</td>',
            '<td style="min-width: 50px" data-title="CallTime" data-value="{{CallTime}}">{{CallTime}}</td>',
            '</tr>',
        ].join(""),
    };

    mProjectName = '/MESCore';
    mCallMin = 0;//最小调用次数
    mCallMax = 0;//最大调用次数

    mAvgMSMin = 0;//最小平均耗时
    mAvgMSMax = 0;//最大平均耗时

    mMSMin = 0;//最小耗时
    mMSMax = 0;//最大耗时


    (function () {
        KEYWORD_Device_LIST_item = [
            "ID|编号",
            "ProjectName|服务名称",
            "CallMin|最小调用次数",
            "CallMax|最大调用次数",
            "AvgMSMin|最小平均耗时",
            "AvgMSMax|最大平均耗时",
            "MSMin|最小耗时峰值",//最小耗时小于MSMin
            "MSMax|最大耗时低值",//最大耗时大于MSMax


            "ModuleName|模块名称",
            "FuncName|函数名称",
            "MaxMS|最大值",
            "MinMS|最小值",
            "SumMS|总和值",
            "AvgMS|平均值",
            "OutTimeMS|超时时间",
            "CallOutTimes|超时次数",
            "CallTimes|呼叫次数",
            "AvgCallTimes|平均呼叫次数",
            "CallTime|呼叫时间|DateTime",
        ];
        KEYWORD_Device_item = {};
        FORMATTRT_Device_item = {};
        DEFAULT_VALUE_Device_item = {};
        TypeSource_Device_item = {

        };


        $.each(KEYWORD_Device_LIST_item, function (i, item) {
            var detail = item.split("|");
            KEYWORD_Device_item[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_Device_item[detail[0]] = $com.util.getFormatter(TypeSource_Device_item, detail[0], detail[2]);
            }
        });
    })();
    model = $com.Model.create({
        name: '性能日志',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();
        },

        events: function () {
            //Enter触发模糊查询事件
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var value = $("#zace-search-Device-item").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-Device-tbody-item").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-Device-tbody-item"), ItemShow, value, "ID");
                }
            });
            //模糊查询
            $("body").delegate("#zace-Device-search", "click", function () {
                var value = $("#zace-search-Device-item").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-Device-tbody-item").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-Device-tbody-item"), ItemShow, value, "ID");
            });
            //条件查询
            $("body").delegate("#zace-Device-searchface", "click", function () {
                //查询字段定义
                var Defaul_Value_Search = {
                    ProjectName: mProjectName,
                    CallMin: mCallMin,
                    CallMax: mCallMax,
                    AvgMSMin: mAvgMSMin,
                    AvgMSMax: mAvgMSMax,
                    MSMin: mMSMin,
                    MSMax: mMSMax,
                };
                $("body").append($com.modal.show(Defaul_Value_Search, KEYWORD_Device_item, "查询", function (rst) {
                    if (!rst || $.isEmptyObject(rst)) {
                        return false;
                    }
                    mProjectName = rst.ProjectName;
                    mCallMin = rst.CallMin,
                        mCallMax = rst.CallMax,
                        mAvgMSMin = rst.AvgMSMin,
                        mAvgMSMax = rst.AvgMSMax,
                        mMSMin = rst.MSMin,
                        mMSMax = rst.MSMax;

                    model.com.refresh();

                }, TypeSource_Device_item));
            });
        },


        run: function () {
            mProjectName = 'MESCore';
            mCallMin = 0;//最小调用次数
            mCallMax = 0;//最大调用次数

            mAvgMSMin = 0;//最小平均耗时
            mAvgMSMax = 0;//最大平均耗时

            mMSMin = 0;//最小耗时
            mMSMax = 0;//最大耗时
            model.com.refresh();

        },

        com: {
            refresh: function () {
                $com.app.loading('数据加载中...');
                model.com.getGetFunctionLog({ ProjectName: mProjectName, CallMin: mCallMin, CallMax: mCallMax, AvgMSMin: mAvgMSMin, AvgMSMax: mAvgMSMax, MSMin: mMSMin, MSMax: mMSMax }, function (res) {
                    if (res && res.list) {
                        mData = $com.util.Clone(res.list);
                        var Item = $com.util.Clone(res.list);

                        $.each(Item, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Device_item[p])
                                    continue;
                                item[p] = FORMATTRT_Device_item[p](item[p]);
                            }
                        });
                        for (var i = 0; i < Item.length; i++) {
                            Item[i].ID = i + 1;
                        }
                        ItemShow = $com.util.Clone(Item);
                        $("#femi-Device-tbody-item").html($com.util.template(Item, HTML.TableNode_item));
                        $com.app.loaded();
                    }
                });
            },

            //获取性能日志
            getGetFunctionLog: function (data, fn, context) {
                var d = {
                    $URI: "/HomePage/GetFunctionLog",
                    $TYPE: "get"
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