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
            '<tr >',
            '<td ><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td  data-title="ID" data-value="{{ID}}">{{ID}}</td>',
            '<td  data-title="ProjectName" data-value="{{ProjectName}}">{{ProjectName}}</td>',
            // '<td style="min-width: 50px" data-title="LoginID" data-value="{{LoginID}}">{{LoginID}}</td>',
            // '<td style="min-width: 50px" data-title="CompanyID" data-value="{{CompanyID}}">{{CompanyID}}</td>',
            '<td style="min-width: 80px;max-width: 100px;overflow-wrap: break-word;" data-title="URI" data-value="{{URI}}">{{URI}}</td>',
            '<td style="min-width: 80px;max-width: 100px;overflow-wrap: break-word;"  data-title="Method" data-value="{{Method}}">{{Method}}</td>',
            '<td  style="min-width: 100px;max-width: 250px;overflow-wrap: break-word;" data-title="Params" data-value="{{Params}}">{{Params}}</td>',
            '<td  style="min-width: 100px;max-width: 300px;overflow-wrap: break-word;" data-title="Result" data-value="{{Result}}">{{Result}}</td>',
            // '<td  data-title="RequestTime" data-value="{{RequestTime}}">{{RequestTime}}</td>',
            // '<td  data-title="ResponseTime" data-value="{{ResponseTime}}">{{ResponseTime}}</td>',
            '<td  style="min-width: 100px;max-width: 150px;overflow-wrap: break-word;" data-title="RequestBody" data-value="{{RequestBody}}">{{RequestBody}}</td>',
            '<td  data-title="IntervalTime" data-value="{{IntervalTime}}">{{IntervalTime}}</td>',
            '<td  data-title="ResponseStatus" data-value="{{ResponseStatus}}">{{ResponseStatus}}</td>',
            '</tr>',
        ].join(""),
    };

    var StartTime = $com.util.format("yyyy-MM-dd", new Date().getTime() - 1 * 24 * 3600 * 1000);
    var EndTime = $com.util.format("yyyy-MM-dd", new Date().getTime() + 24 * 3600 * 1000);
    var mProjectName = '/MESCore';
    var mResponseStatus = 200;
    var mIntervalMin = 0;//调用最小时间
    var mIntervalMax = 0;//调用最大时间

    (function () {
        KEYWORD_Device_LIST_item = [
            "ID|编号",
            "ProjectName|服务名称",
            "ResponseStatus|响应状态",
            "IntervalMin|最小调用时间",
            "IntervalMax|最大调用时间",
            //  "LoginID|登录人",
            //  "CompanyID|公司名",
            "URI|路径",
            "Method|方法",
            "Params|参数",
            "Result|结果",
            "RequestTime|请求时间|DateTime",
            "ResponseTime|响应时间|DateTime",
            "RequestBody|请求头",
            "IntervalTime|耗时(ms)",
            //  "ResponseStatus|状态|ArrayOne",
            "StartTime|开始时间|Date",
            "EndTime|结束时间|Date",
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
        name: '接口日志',

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
              var  Defaul_Value_Search = {
                    ProjectName: mProjectName,
                    IntervalMin: mIntervalMin,
                    IntervalMax: mIntervalMax,
                    ResponseStatus: mResponseStatus,
                    'StartTime': $com.util.format("yyyy-MM-dd", new Date(StartTime)),
                    'EndTime': $com.util.format("yyyy-MM-dd", new Date(EndTime)),
                };
                $("body").append($com.modal.show(Defaul_Value_Search, KEYWORD_Device_item, "查询", function (rst) {
                    if (!rst || $.isEmptyObject(rst)) {
                        return false;
                    }
                    mProjectName = rst.ProjectName;
                    mIntervalMin = Number(rst.IntervalMin);
                    mIntervalMax = Number(rst.IntervalMax);
                    mResponseStatus = Number(rst.ResponseStatus);
                    StartTime = $com.util.format("yyyy-MM-dd", rst.StartTime);
                    EndTime = $com.util.format("yyyy-MM-dd", rst.EndTime);

                    model.com.refresh();

                }, TypeSource_Device_item));
            });
        },


        run: function () {

            model.com.refresh();
        },

        com: {
            refresh: function () {
                $com.app.loading('数据加载中...');
                model.com.getGetApiLog({ ProjectName: mProjectName, StartTime: StartTime + ' 00:00:00', EndTime: EndTime + ' 23:59:59', IntervalMin: mIntervalMin, IntervalMax: mIntervalMax, ResponseStatus: mResponseStatus }, function (res) {
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

            //获取接口日志
            getGetApiLog: function (data, fn, context) {
                var d = {
                    $URI: "/HomePage/GetApiLog",
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