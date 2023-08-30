require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($zace, $com) {

    var KEYWORD_Level_LIST,
        KEYWORD_Level,
        FORMATTRT_Level,
        DEFAULT_VALUE_Level,
        TypeSource_Level,
		model,
        DataAll,
        DATABasic,
        HTML;


    GradeTemp = {
        WID: 0,
        RiskID: 0,
        RiskText: '',
        Count1Week: 0,
        Count1Unit: 0,
        Count2Week: 0,
        Count2Unit: 0,
        Count3Week: 0,
        Count3Unit: 0,
        Author: '',
        AuditTime: '',
        Auditor: '',
        EditTime: '',

    };


    ;
    HTML = {
        TableMode: [
				'<tr>',
				'<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
				'<td data-title="RiskText" data-value="{{RiskText}}" >{{RiskText}}</td>',
				'<td data-title="Count1Week" data-value="{{Count1Week}}" >{{Count1Week}}</td>',
				'<td data-title="Count1Unit" data-value="{{Count1Unit}}" >{{Count1Unit}}</td>',
				'<td data-title="Count2Week" data-value="{{Count2Week}}" >{{Count2Week}}</td>',
                '<td data-title="Count2Unit" data-value="{{Count2Unit}}" >{{Count2Unit}}</td>',
				'<td data-title="Count3Week" data-value="{{Count3Week}}" >{{Count3Week}}</td>',
				'<td data-title="Count3Unit" data-value="{{Count3Unit}}" >{{Count3Unit}}</td>',
                '<td data-title="Author" data-value="{{Author}}" >{{Author}}</td>',
                '<td data-title="AuditTime" data-value="{{AuditTime}}" >{{AuditTime}}</td>',
                '<td data-title="Auditor" data-value="{{Auditor}}" >{{Auditor}}</td>',
                '<td data-title="EditTime" data-value="{{EditTime}}" >{{EditTime}}</td>',
				'</tr>',
        ].join(""),



    }
    $(function () {
        KEYWORD_Level_LIST = [
         "RiskText|风险等级名称",
         "Count1Week|计量周期",
         "Count1Unit|计量单位|ArrayOne",
         "Count2Week|质量周期",
         "Count2Unit|质量单位|ArrayOne",
         "Count3Week|工艺周期",
         "Count3Unit|工艺单位|ArrayOne",
         "AuditTime|创建时间|Date",
         "EditTime|编辑时间|Date",
        ];
        KEYWORD_Level = {};
        FORMATTRT_Level = {};

        DEFAULT_VALUE_Level = {
        AuditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Auditor: window.parent.User_Info.Name,
        Author: window.parent.User_Info.Name,
        EditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        ID: 1,
        ItemList: [
         {
             CycleUnit: 0, //循环单元
             ID: 1,
             PatrolCycle: 0,//巡逻周期 
             Type: 1,
         },
         {
             CycleUnit: 0,
             ID: 2,
             PatrolCycle: 0,
             Type: 2,
         }, {
             CycleUnit: 0,
             ID: 3,
             PatrolCycle: 0,
             Type: 3,
         }, ],
        RiskID: 1,
        RiskText: "",
        };

        TypeSource_Level = {
            Count1Unit: [
              {
                  name: "未知",
                  value: 0
              },
              {
                  name: "分钟",
                  value: 1
              },
              {
                  name: "小时",
                  value: 2
              },
              {
                  name: "天",
                  value: 3
              },
              {
                  name: "周",
                  value: 4
              },
              {
                  name: "月",
                  value: 5
              },
              {
                  name: "年",
                  value: 6
              },
            ],
            Count2Unit: [
            {
                name: "未知",
                value: 0
            },
            {
                name: "分钟",
                value: 1
            },
            {
                name: "小时",
                value: 2
            },
            {
                name: "天",
                value: 3
            },
            {
                name: "周",
                value: 4
            },
            {
                name: "月",
                value: 5
            },
            {
                name: "年",
                value: 6
            },
            ],
            Count3Unit: [
            {
                name: "未知",
                value: 0
            },
            {
                name: "分钟",
                value: 1
            },
            {
                name: "小时",
                value: 2
            },
            {
                name: "天",
                value: 3
            },
            {
                name: "周",
                value: 4
            },
            {
                name: "月",
                value: 5
            },
            {
                name: "年",
                value: 6
            },
            ]



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
    });


    model = $com.Model.create({
        name: '风险等级',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            //风险等级查询
            $("body").delegate("#zace-search-level", "change", function () {

                var $this = $(this),
                   value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), DataAll, value, "WID");



            });
            //风险等级修改
            $("body").delegate("#zace-edit-level", "click", function () {

                // var SelectData = $com.table.getSelectionData($("#femi-factoryTime-tbody1"), "PartID", DataAll);
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
                    RiskText: SelectData[0].RiskText,
                    Count1Week: SelectData[0].Count1Week,
                    Count1Unit: SelectData[0].Count1Unit,
                    Count2Week: SelectData[0].Count2Week,
                    Count2Unit: SelectData[0].Count2Unit,
                    Count3Week: SelectData[0].Count3Week,
                    Count3Unit: SelectData[0].Count3Unit,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].RiskText = rst.RiskText;
                    SelectData[0].Count1Week = Number(rst.Count1Week);
                    SelectData[0].Count1Unit = Number(rst.Count1Unit);
                    SelectData[0].Count2Week = Number(rst.Count2Week);
                    SelectData[0].Count2Unit = Number(rst.Count2Unit);
                    SelectData[0].Count3Week = Number(rst.Count3Week);
                    SelectData[0].Count3Unit = Number(rst.Count3Unit);


                    var mID = SelectData[0].WID;
                    DATABasic[mID - 1].RiskText = SelectData[0].RiskText;
                    DATABasic[mID - 1].EditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date());
                    DATABasic[mID - 1].Auditor = window.parent.User_Info.Name;

                    DATABasic[mID - 1].ItemList[0].PatrolCycle = SelectData[0].Count1Week;
                    DATABasic[mID - 1].ItemList[0].CycleUnit = SelectData[0].Count1Unit;
                    DATABasic[mID - 1].ItemList[1].PatrolCycle = SelectData[0].Count2Week;
                    DATABasic[mID - 1].ItemList[1].CycleUnit = SelectData[0].Count2Unit;
                    DATABasic[mID - 1].ItemList[2].PatrolCycle = SelectData[0].Count3Week;
                    DATABasic[mID - 1].ItemList[2].CycleUnit = SelectData[0].Count3Unit;

                    model.com.postRiskGrade({
                        data: DATABasic,
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                    })

                }, TypeSource_Level));


            });
            //风险等级删除
            $("body").delegate("#zace-delete-level", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "WID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择至少一行数据再试！")
                    return;
                }
                var wlist = $com.util.Clone(DATABasic)
                var list = model.com.getNewList(wlist, SelectData);

                model.com.postRiskGrade({
                    data: list,
                }, function (res) {
                    alert("删除成功");
                    model.com.refresh();
                })

            });
            //风险等级新增
            $("body").delegate("#zace-add-level", "click", function () {
                var default_value = {
                    RiskText: '',
                    Count1Week: 0,
                    Count1Unit: 0,
                    Count2Week: 0,
                    Count2Unit: 0,
                    Count3Week: 0,
                    Count3Unit: 0,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "新增", function (rst) {
                    //调用插入函数 

                    if (!rst || $.isEmptyObject(rst))
                        return;

                    DEFAULT_VALUE_Level.RiskText = rst.RiskText;
                    DEFAULT_VALUE_Level.ItemList[0].PatrolCycle = Number(rst.Count1Week);
                    DEFAULT_VALUE_Level.ItemList[0].CycleUnit = Number(rst.Count1Unit);
                    DEFAULT_VALUE_Level.ItemList[1].PatrolCycle = Number(rst.Count2Week);
                    DEFAULT_VALUE_Level.ItemList[1].CycleUnit = Number(rst.Count2Unit);
                    DEFAULT_VALUE_Level.ItemList[2].PatrolCycle = Number(rst.Count3Week);
                    DEFAULT_VALUE_Level.ItemList[2].CycleUnit = Number(rst.Count3Unit);

                    if (DATABasic.length < 1) {
                        DATABasic.push(DEFAULT_VALUE_Level);
                    } else {
                        DEFAULT_VALUE_Level.ID = model.com.GetMaxID(DATABasic);
                        DEFAULT_VALUE_Level.RiskID = DEFAULT_VALUE_Level.ID;
                        DATABasic.push(DEFAULT_VALUE_Level);
                    }
                    model.com.postRiskGrade({
                        data: DATABasic,
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                    })

              

                }, TypeSource_Level));


            });
            //风险等级导出
            $("body").delegate("#zace-export-level", "click", function () {
                var $table = $(".table-part>table"),
                     fileName = "风险等级.xls",
                     Title = "风险等级";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });

            });

        },




        run: function () {
          
            model.com.refresh();
        },

        com: {
            refresh: function () {

                model.com.getRiskGrade({}, function (resGrade) {
                    if (!resGrade)
                        return;
                    if (resGrade && resGrade.list) {
                        var Grade = $com.util.Clone(resGrade.list);
                        DATABasic = $com.util.Clone(resGrade.list);

                        var list = model.com.translate(Grade);
                        DataAll = $com.util.Clone(list);

                        $.each(list, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }
                        });

                        $("#femi-riskLevel-tbody").html($com.util.template(list, HTML.TableMode));

                    }

                });          
            },
            //查询风险等级列表
            getRiskGrade: function (data, fn, context) {
                var d = {
                    $URI: "/RiskGrade/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //保存风险等级列表
            postRiskGrade: function (data, fn, context) {
                var d = {
                    $URI: "/RiskGrade/Save",
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
          
            //得到模板数据
            translate: function (data) {
                var _list = [];
                for (var i = 0; i < data.length; i++) {
                    var _temp = $com.util.Clone(GradeTemp);
                    _temp.WID = i + 1;
                    _temp.RiskID = data[i].RiskID;
                    _temp.RiskText = data[i].RiskText;
                    _temp.AuditTime = data[i].AuditTime;
                    _temp.Auditor = data[i].Auditor;
                    _temp.Author = data[i].Author;
                    _temp.EditTime = data[i].EditTime;
                    _temp.Count1Week = data[i].ItemList[0].PatrolCycle;
                    _temp.Count1Unit = data[i].ItemList[0].CycleUnit;
                    _temp.Count2Week = data[i].ItemList[1].PatrolCycle;
                    _temp.Count2Unit = data[i].ItemList[1].CycleUnit;
                    _temp.Count3Week = data[i].ItemList[2].PatrolCycle;
                    _temp.Count3Unit = data[i].ItemList[2].CycleUnit;
                    _list.push(_temp);

                }
                return _list;

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