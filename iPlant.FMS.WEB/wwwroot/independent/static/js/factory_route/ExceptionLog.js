require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($alfie, $com) {
    var mUserList;
    var Formattrt_Search;
    var Defaul_Value_Search;
    var KETWROD_Search;
    var KETWROD_LIST_Search;
    var TypeSource_Search;
    var ItemShow;
    var HTML;

    //HTML模板
    HTML = {
        TableNode_item: [
            '<tr data-color="">',
            '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td>',
            '<td style="min-width: 50px" data-title="ProjectName" data-value="{{ProjectName}}">{{ProjectName}}</td>',
            '<td style="min-width: 50px" data-title="ModuleName" data-value="{{ModuleName}}">{{ModuleName}}</td>',
            '<td style="min-width: 50px" data-title="FuncName" data-value="{{FuncName}}">{{FuncName}}</td>',
            '<td style="min-width: 50px" data-title="ExceptionCode" data-value="{{ExceptionCode}}">{{ExceptionCode}}</td>',
            '<td style="min-width: 50px" data-title="ExceptionTimes" data-value="{{ExceptionTimes}}">{{ExceptionTimes}}</td>',
            '<td style="min-width: 50px" data-title="StartTime" data-value="{{StartTime}}">{{StartTime}}</td>',
            '<td style="min-width: 50px" data-title="EndTime" data-value="{{EndTime}}">{{EndTime}}</td>',
            '<td style="min-width: 50px" data-title="Alive" data-value="{{Alive}}">{{Alive}}</td>',
            '</tr>',
        ].join(""),
    };



    //初始化字段模板
    (function () {

        KETWROD_LIST_Search = [
            "ProjectName|服务名称",
            "ExcTimesMin|最小异常次数",
            "ExcTimesMax|最大异常次数",
            "StartTime|开始时间|Date",
            "EndTime|结束时间|Date",
            "Alive|可用|ArrayOne",
        ];

        KETWROD_Search = {};

        Formattrt_Search = {};

        TypeSource_Search = {
            Alive: [
                {
                    'name': "可用",
                    'value': true
                },
                {
                    'name': "不可用",
                    'value': false
                },
            ]
        };

        $.each(KETWROD_LIST_Search, function (i, item) {
            var detail = item.split("|");
            KETWROD_Search[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };

            if (detail.length > 2) {
                Formattrt_Search[detail[0]] = $com.util.getFormatter(TypeSource_Search, detail[0], detail[2]);
            }
        });
    })();

    model = $com.Model.create({
        name: '异常日志',

        type: $com.Model.MAIN,//主方法

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
            $("body").delegate("#zace-Device-searchzz", "click", function () {

                //查询字段定义
                var Defaul_Value_Search = {
                    ProjectName: mProjectName,
                    ExcTimesMin: mExcTimesMin,
                    ExcTimesMax: mExcTimesMax,
                    // 'StartTime': $com.util.format("yyyy-MM-dd", new Date()),
                    // 'EndTime': $com.util.format("yyyy-MM-dd", new Date()),
                };
                $("body").append($com.modal.show(Defaul_Value_Search, KETWROD_Search, "查询", function (rst) {
                    if (!rst || $.isEmptyObject(rst)) {
                        return false;
                    }
                    mProjectName = rst.ProjectName;
                    mExcTimesMin = Number(rst.ExcTimesMin);
                    mExcTimesMax = Number(rst.ExcTimesMax);
                    // StartTime = $com.util.format("yyyy-MM-dd", rst.StartTime);
                    // EndTime = $com.util.format("yyyy-MM-dd", rst.EndTime);

                    model.com.refresh();

                }, TypeSource_Search));
            });
        },


        run: function () {
            mProjectName = 'MESCore';
            mExcTimesMin = 0;//最小异常次数
            mExcTimesMax = 0;//最大异常次数
            StartTime = $com.util.format("yyyy-MM-dd", new Date().getTime() - 1 * 24 * 3600 * 1000);
            EndTime = $com.util.format("yyyy-MM-dd", new Date().getTime() + 24 * 3600 * 1000);

            model.com.get({}, function (res) {
                mUserList = res.list;
                model.com.refresh();
            });

        },

        com: {
            //刷新界面
            refresh: function () {
                $com.app.loading('数据加载中...');
                model.com.getExcLog({ ProjectName: mProjectName, ExcTimesMin: mExcTimesMin, ExcTimesMax: mExcTimesMax }, function (res) {
                //model.com.getExcLog({ ProjectName: mProjectName, StartTime: StartTime + ' 00:00:00', EndTime: EndTime + ' 23:59:59', ExcTimesMin: mExcTimesMin, ExcTimesMax: mExcTimesMax }, function (res) {
                    if (res && res.list) {
                        mData = $com.util.Clone(res.list);
                        //造ID
                        for (var index = 0; index < mData.length; index++) {
                            mData[index].ID = index + 1;
                        }
                        var Item = $com.util.Clone(mData);

                        $.each(Item, function (i, item) {
                            for (var p in item) {
                                if (!Formattrt_Search[p])
                                    continue;
                                item[p] = Formattrt_Search[p](item[p]);
                            }
                        });

                        ItemShow = $com.util.Clone(Item);
                        $("#femi-Device-tbody-item").html($com.util.template(Item, HTML.TableNode_item));
                        $com.app.loaded();
                    }
                });
            },
            //获取异常日志
            getExcLog: function (data, fn, context) {
                var d = {
                    $URI: "/HomePage/GetExceptionLog",
                    $TYPE: "Get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取人员列表
            get: function (data, fn, context) {
                var d = {
                    $URI: "/User/All",
                    $TYPE: "get",

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