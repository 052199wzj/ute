require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($zace, $com) {

    var KEYWORD_Level_LIST,
        KEYWORD_Level,
        FORMATTRT_Level,
        DEFAULT_VALUE_Level,
        TypeSource_Level,

        KEYWORD_Level_LISTItem,
        KEYWORD_LevelItem,
        FORMATTRT_LevelItem,
        DEFAULT_VALUE_LevelItem,
        TypeSource_LevelItem,

		model,
        DataAll,
        DATABasic,
        SearchAll,
        DATAMaterilBasic,
        SearchMaterilAll,
        DATARePersonBasic,
        SearchRePersonAll,
        DATAReDeviceBasic,
        SearchReDeviceAll,
        DATAReIDBasic,
        SearchReIDAll,
        HTML;

    MaterialAll = [];
    SearchAll = [];
    DATABasic = [];
    DATAMaterilBasic = [];
    SearchMaterilAll = [];
    DATARePersonBasic = [];
    SearchRePersonAll = [];
    DATAReDeviceBasic = [];
    SearchReDeviceAll = [];
    DATAReIDBasic = [];
    SearchReIDAll = [];
    mMaterialID = 0;
    mBatchNoPro = "";
    mBatchNo = "";
    mMaterialBatchNo = "";
    mOrderID = 0;
    mWorkShopID = 0;
    mLineID = 0;
    mStartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date("2000-01-01"));
    mEndTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date("2000-01-01"));
    mPDENo = "";
    mMaterialID = 0;
    //操作员列表
    OperatorAll = [];
    mPersonID = 0;
    mDeviceID = 0;
    mPDEID = 0;
    HTML = {
        TraceMode: [
				'<tr>',
				'<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
				'<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
				'<td data-title="PDENo" data-value="{{PDENo}}" >{{PDENo}}</td>',
				'<td data-title="BatchNo" data-value="{{BatchNo}}" >{{BatchNo}}</td>',
				'<td data-title="OrderNo" data-value="{{OrderNo}}" >{{OrderNo}}</td>',
                '<td data-title="ProductNo" data-value="{{ProductNo}}" >{{ProductNo}}</td>',
				'<td data-title="WorkShopID" data-value="{{WorkShopID}}" >{{WorkShopID}}</td>',
                '<td data-title="LineID" data-value="{{LineID}}" >{{LineID}}</td>',
                '<td data-title="Result" data-value="{{Result}}" >{{Result}}</td>',
                 '<td data-title="PushTime" data-value="{{PushTime}}" >{{PushTime}}</td>',
                  '<td data-title="PullTime" data-value="{{PullTime}}" >{{PullTime}}</td>',

				'</tr>',
        ].join(""),

        RetrospectMode: [
               '<tr>',
               '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
               '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
               '<td data-title="PDEName" data-value="{{PDEName}}" >{{PDEName}}</td>',
               '<td data-title="WorkShopName" data-value="{{WorkShopName}}" >{{WorkShopName}}</td>',
               '<td data-title="LineName" data-value="{{LineName}}" >{{LineName}}</td>',
               '<td data-title="PartName" data-value="{{PartName}}" >{{PartName}}</td>',
               '<td data-title="PartPointName" data-value="{{PartPointName}}" >{{PartPointName}}</td>',
               '<td data-title="StationName" data-value="{{StationName}}" >{{StationName}}</td>',
               '<td data-title="DeviceName" data-value="{{DeviceName}}" >{{DeviceName}}</td>',
                '<td data-title="OrderNo" data-value="{{OrderNo}}" >{{OrderNo}}</td>',
                 '<td data-title="ProductNo" data-value="{{ProductNo}}" >{{ProductNo}}</td>',
                   '<td data-title="RouteID" data-value="{{RouteID}}" >{{RouteID}}</td>',
                  '<td data-title="Result" data-value="{{Result}}" >{{Result}}</td>',
                    '<td data-title="PushTime" data-value="{{PushTime}}" >{{PushTime}}</td>',
                 '<td data-title="PullTime" data-value="{{PullTime}}" >{{PullTime}}</td>',
               '</tr>',
        ].join(""),

        OperatorMode: [
              '<tr>',
              '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
              '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
              //'<td data-title="ParentType" data-value="{{ParentType}}" >{{ParentType}}</td>',
              '<td data-title="ParentName" data-value="{{ParentName}}" >{{ParentName}}</td>',
              '<td data-title="Operator" data-value="{{Operator}}" >{{Operator}}</td>',
              '<td data-title="PositionName" data-value="{{PositionName}}" >{{PositionName}}</td>',
              '<td data-title="EventName" data-value="{{EventName}}" >{{EventName}}</td>',
              '<td data-title="StationID" data-value="{{StationID}}" >{{StationID}}</td>',
              '<td data-title="ResultID" data-value="{{ResultID}}" >{{ResultID}}</td>',
               '<td data-title="OperateNo" data-value="{{OperateNo}}" >{{OperateNo}}</td>',
                '<td data-title="OperateTime" data-value="{{OperateTime}}" >{{OperateTime}}</td>',
              '</tr>',
        ].join(""),
        MaterialModeTrace: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            //'<td data-title="ParentType" data-value="{{ParentType}}" >{{ParentType}}</td>',
            '<td data-title="ParentName" data-value="{{ParentName}}" >{{ParentName}}</td>',
             '<td data-title="BatchNo" data-value="{{BatchNo}}" >{{BatchNo}}</td>',
            '<td data-title="MaterialName" data-value="{{MaterialName}}" >{{MaterialName}}</td>',
            '<td data-title="MaterialNo" data-value="{{MaterialNo}}" >{{MaterialNo}}</td>',
            '<td data-title="MaterialTypeID" data-value="{{MaterialTypeID}}" >{{MaterialTypeID}}</td>',
            '<td data-title="UseNo" data-value="{{UseNo}}" >{{UseNo}}</td>',
             '<td data-title="Count" data-value="{{Count}}" >{{Count}}</td>',
              '<td data-title="UseTime" data-value="{{UseTime}}" >{{UseTime}}</td>',
            '</tr>',
        ].join(""),
        MaterialMode: [
             '<tr>',
             '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
             '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
             //'<td data-title="ParentType" data-value="{{ParentType}}" >{{ParentType}}</td>',
             '<td data-title="ParentName" data-value="{{ParentName}}" >{{ParentName}}</td>',
              '<td data-title="BatchNo" data-value="{{BatchNo}}" >{{BatchNo}}</td>',
             '<td data-title="MaterialName" data-value="{{MaterialName}}" >{{MaterialName}}</td>',
             '<td data-title="MaterialNo" data-value="{{MaterialNo}}" >{{MaterialNo}}</td>',
             '<td data-title="MaterialTypeID" data-value="{{MaterialTypeID}}" >{{MaterialTypeID}}</td>',
             '<td data-title="StationID" data-value="{{StationID}}" >{{StationID}}</td>',
             '<td data-title="UseNo" data-value="{{UseNo}}" >{{UseNo}}</td>',
              '<td data-title="Count" data-value="{{Count}}" >{{Count}}</td>',
               '<td data-title="UseTime" data-value="{{UseTime}}" >{{UseTime}}</td>',
             '</tr>',
        ].join(""),

        ParameterMode: [
          '<tr>',
          '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
          '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
          '<td data-title="ParentName" data-value="{{ParentName}}" >{{ParentName}}</td>',
          '<td data-title="ParameterName" data-value="{{ParameterName}}" >{{ParameterName}}</td>',
          '<td data-title="Value" data-value="{{Value}}" >{{Value}}</td>',
          '</tr>',
        ].join(""),

        SpareMode: [
         '<tr>',
         '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
         '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
         '<td data-title="ParentName" data-value="{{ParentName}}" >{{ParentName}}</td>',
         '<td data-title="SpareName" data-value="{{SpareName}}" >{{SpareName}}</td>',
         '<td data-title="OperateNo" data-value="{{OperateNo}}" >{{OperateNo}}</td>',
          '<td data-title="OperateTime" data-value="{{OperateTime}}" >{{OperateTime}}</td>',
         '</tr>',
        ].join(""),
    }
    $(function () {
        KEYWORD_Level_LIST = [
         "PDENo|成品",
         "BatchNo|成品批次",
         "MaterialID|物料|ArrayOne",
         "OrderID|订单|ArrayOne",      
         "WorkShopID|车间|ArrayOne",
         "LineID|产线|ArrayOne",
         "Result|结果|ArrayOne",
         "Status|状态|ArrayOne",
         "StartTime|开始时间|Date",
         "EndTime|结束时间|Date",
         "PushTime|时间|Date",
         "PullTime|时间|Date",
         "OperateTime|时间|Date",
         "UseTime|时间|Date",
         
         "MaterialTypeID|物料类型|ArrayOne",
         "RouteID|工艺路线|ArrayOne",
         "ParentType|类型|ArrayOne",
         "StationID|工位|ArrayOne",
         "ResultID|结果|ArrayOne",
        ];
        KEYWORD_Level = {};
        FORMATTRT_Level = {};

        TypeSource_Level = {
            MaterialID: [
             {
                 name: "无",
                 value: 0
             }
            ],
            StationID: [
            {
                name: "无",
                value: 0
            }
            ],
            ResultID: [
             {
                 name: "不合格",
                 value: 0
             },
              {
                  name: "合格",
                  value: 1
              }
            ],
            Result: [
                 {
                     name: "不合格",
                     value: 0
                 },
                  {
                      name: "合格",
                      value: 1
                  }
                ],
            OrderID: [
                {
                    name: "无",
                    value: 0
                }
            ],
            WorkShopID: [
               {
                   name: "无",
                   value: 0
               }
            ],
            LineID: [
               {
                   name: "无",
                   value: 0
               }
            ],
            RouteID: [],
            MaterialTypeID: [],
            ParentType: [
              {
                  name: "成品",
                  value: 1
              },
               {
                   name: "追溯",
                   value: 2
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
    });
    $(function () {
        KEYWORD_Level_LISTItem = [
         "BatchNo|物料批次",
           "MaterialID|物料|ArrayOne",
         "ParentName|成品编码",
         "StationID|工位|ArrayOne",
         "ParentType|类型|ArrayOne",
          "ResultID|结果|ArrayOne",
          "MaterialTypeID|物料类型|ArrayOne",
        ];
        KEYWORD_LevelItem = {};
        FORMATTRT_LevelItem = {};

        TypeSource_LevelItem = {
            ParentType: [
             {
                 name: "成品",
                 value: 1
             },
              {
                  name: "追溯",
                  value: 2
              }
            ],
            ResultID: [
              {
                  name: "不合格",
                  value: 0
              },
               {
                   name: "合格",
                   value: 1
               }
            ],

            MaterialID: [
             {
                 name: "无",
                 value: 0
             }
            ],
            StationID: [
            {
                name: "无",
                value: 0
            }
            ],
            MaterialTypeID: [],
        };

        $.each(KEYWORD_Level_LISTItem, function (i, item) {
            var detail = item.split("|");
            KEYWORD_LevelItem[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_LevelItem[detail[0]] = $com.util.getFormatter(TypeSource_LevelItem, detail[0], detail[2]);
            }
        });
    });

    model = $com.Model.create({
        name: '岗位',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            //操作员
            $("body").delegate("#zace-operatorPro-level", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-timeTracePro-tbody"), "ID", DATAMaterilBasic);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
               
                var _list = [];
                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].OperatorList && SelectData[i].OperatorList.length > 0) {
                        for (var j = 0; j < SelectData[i].OperatorList.length; j++) {

                            _list.push(SelectData[i].OperatorList[j]);

                        }
                    }
                }

                var list = $com.util.Clone(_list);
                $.each(list, function (i, item) {
                    for (var p in item) {
                        if (!FORMATTRT_Level[p])
                            continue;
                        item[p] = FORMATTRT_Level[p](item[p]);
                    }
                });
                $("#femi-operatorListPro-tbody").html($com.util.template(list, HTML.OperatorMode));
                $("#femi-operatorListPro-tbody tr").each(function (i, item) {
                    var $this = $(this);
                    var colorName = $this.css("background-color");
                    $this.attr("data-color", colorName);



                });

                $(".zzzMaterialPro").hide();
                $(".zzzParameterPro").hide();
                $(".zzzOperatorPro").css("width", "650px");
                $(".zzzTracePro").css("margin-right", "650px");
                $(".zzzOperatorPro").show();

            });

            //操作员
            $("body").delegate("#zace-close-operatorListPro", "click", function () {

                $(".zzzOperatorPro").css("width", "0px");
                $(".zzzTracePro").css("margin-right", "0px");
                $(".zzzOperatorPro").hide();
            });
            
            //物料
            $("body").delegate("#zace-materialPro-level", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-timeTracePro-tbody"), "ID", DATAMaterilBasic);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }              
                var _list = [];
                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].MaterialList && SelectData[i].MaterialList.length > 0) {
                        for (var j = 0; j < SelectData[i].MaterialList.length; j++) {

                            _list.push(SelectData[i].MaterialList[j]);

                        }
                    }
                }

                var list = $com.util.Clone(_list);
                MaterialAll = $com.util.Clone(_list);
                $.each(list, function (i, item) {
                    for (var p in item) {
                        if (!FORMATTRT_Level[p])
                            continue;
                        item[p] = FORMATTRT_Level[p](item[p]);
                    }
                });
                $("#femi-materialListPro-tbody").html($com.util.template(list, HTML.MaterialModeTrace));
                $("#femi-materialListPro-tbody tr").each(function (i, item) {
                    var $this = $(this);
                    var colorName = $this.css("background-color");
                    $this.attr("data-color", colorName);



                });

                $(".zzzParameterPro").hide();
                $(".zzzOperatorPro").hide();
                $(".zzzMaterialPro").css("width", "650px");
                $(".zzzTracePro").css("margin-right", "650px");
                $(".zzzMaterialPro").show();

            });

            //物料
            $("body").delegate("#zace-close-materialListPro", "click", function () {

                $(".zzzMaterialPro").css("width", "0px");
                $(".zzzTracePro").css("margin-right", "0px");
                $(".zzzMaterialPro").hide();
            });


            //参数
            $("body").delegate("#zace-parameterPro-level", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-timeTracePro-tbody"), "ID", DATAMaterilBasic);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
               
                var _list = [];
                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].ParameterList && SelectData[i].ParameterList.length > 0) {
                        for (var j = 0; j < SelectData[i].ParameterList.length; j++) {

                            _list.push(SelectData[i].ParameterList[j]);

                        }
                    }
                }

                var list = $com.util.Clone(_list);

                $.each(list, function (i, item) {
                    for (var p in item) {
                        if (!FORMATTRT_Level[p])
                            continue;
                        item[p] = FORMATTRT_Level[p](item[p]);
                    }
                });

                $("#femi-parameterlListPro-tbody").html($com.util.template(list, HTML.ParameterMode));
                $("#femi-parameterlListPro-tbody tr").each(function (i, item) {
                    var $this = $(this);
                    var colorName = $this.css("background-color");
                    $this.attr("data-color", colorName);



                });

                $(".zzzMaterialPro").hide();
                $(".zzzOperatorPro").hide();
                $(".zzzParameterPro").css("width", "500px");
                $(".zzzTracePro").css("margin-right", "500px");
                $(".zzzParameterPro").show();

            });

            //参数
            $("body").delegate("#zace-close-parameterListPro", "click", function () {

                $(".zzzParameterPro").css("width", "0px");
                $(".zzzTracePro").css("margin-right", "0px");
                $(".zzzParameterPro").hide();
            });


            //追溯
            $("body").delegate("#zace-open-materialListTracePro", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-materialListPro-tbody"), "ID", MaterialAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！")
                    return;
                }
                //mMaterialID = SelectData[0].MaterialID;
                mBatchNoPro = SelectData[0].BatchNo;
                model.com.refreshMaterial();
                $(".zzzTrace").hide();
                $(".zzzSpare").hide();
                $(".zzzReMaterial").hide();
                $(".zzzReOperator").hide();

                $(".zzzParameterPro").hide();
                $(".zzzMaterialPro").hide();
                $(".zzzOperatorPro").hide();

                $(".zzzParameter").hide();
                $(".zzzMaterial").hide();
                $(".zzzOperator").hide();
                $(".zzzRetrospect").hide();
                $(".zzzTracePro").css("margin-right", "0px");
                $(".zzzTracePro").show();

                $(".zzzPersonSpare").hide();
                $(".zzzPersonReMaterial").hide();
                $(".zzzPersonReOperator").hide();

                $(".zzzDeviceSpare").hide();
                $(".zzzDeviceReMaterial").hide();
                $(".zzzDeviceReOperator").hide();
                $(".zzzDeviceRetrospect").hide();

            });
            //追溯
            $("body").delegate("#zace-open-materialListTrace", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-materialList-tbody"), "ID", MaterialAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！")
                    return;
                }
                //mMaterialID = SelectData[0].MaterialID;
                mBatchNoPro = SelectData[0].BatchNo;
                model.com.refreshMaterial();
                $(".zzzTrace").hide();
                $(".zzzSpare").hide();
                $(".zzzReMaterial").hide();
                $(".zzzReOperator").hide();

                $(".zzzParameterPro").hide();
                $(".zzzMaterialPro").hide();
                $(".zzzOperatorPro").hide();

                $(".zzzParameter").hide();
                $(".zzzMaterial").hide();
                $(".zzzOperator").hide();
                $(".zzzRetrospect").hide();
                $(".zzzTracePro").css("margin-right", "0px");
                $(".zzzTracePro").show();

                $(".zzzPersonSpare").hide();
                $(".zzzPersonReMaterial").hide();
                $(".zzzPersonReOperator").hide();

                $(".zzzDeviceSpare").hide();
                $(".zzzDeviceReMaterial").hide();
                $(".zzzDeviceReOperator").hide();
                $(".zzzDeviceRetrospect").hide();

            });
            //物料成品
            $("body").delegate("#zace-RetrospectPro-close", "click", function () {

                $(".zzzTrace").css("margin-right", "0px");
                $(".zzzTrace").show();

                $(".zzzTracePro").hide();
                $(".zzzSpare").hide();
                $(".zzzReMaterial").hide();
                $(".zzzReOperator").hide();

                $(".zzzParameterPro").hide();
                $(".zzzMaterialPro").hide();
                $(".zzzOperatorPro").hide();

                $(".zzzParameter").hide();
                $(".zzzMaterial").hide();
                $(".zzzOperator").hide();
                $(".zzzRetrospect").hide();

                $(".zzzPersonSpare").hide();
                $(".zzzPersonReMaterial").hide();
                $(".zzzPersonReOperator").hide();

                $(".zzzDeviceSpare").hide();
                $(".zzzDeviceReMaterial").hide();
                $(".zzzDeviceReOperator").hide();
                $(".zzzDeviceRetrospect").hide();
            });




            //操作员
            $("body").delegate("#zace-operator-level", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-timeTrace-tbody"), "ID", DATABasic);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                //if (SelectData.length != 1) {
                //    alert("只能同时对一行数据操作！")
                //    return;
                //}
                var _list = [];
                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].OperatorList && SelectData[i].OperatorList.length > 0) {
                        for (var j = 0; j < SelectData[i].OperatorList.length; j++) {

                            _list.push(SelectData[i].OperatorList[j]);

                        }
                    }
                }

                var list = $com.util.Clone(_list);
              
                $.each(list, function (i, item) {
                    for (var p in item) {
                        if (!FORMATTRT_Level[p])
                            continue;
                        item[p] = FORMATTRT_Level[p](item[p]);

                    }
                });
                $("#femi-operatorList-tbody").html($com.util.template(list, HTML.OperatorMode));
                $("#femi-operatorList-tbody tr").each(function (i, item) {
                    var $this = $(this);
                    var colorName = $this.css("background-color");
                    $this.attr("data-color", colorName);



                });

                $(".zzzMaterial").hide();
                $(".zzzParameter").hide();
                $(".zzzOperator").css("width", "650px");
                $(".zzzTrace").css("margin-right", "650px");
                $(".zzzOperator").show();

            });

            //操作员
            $("body").delegate("#zace-close-operatorList", "click", function () {

                $(".zzzOperator").css("width", "0px");
                $(".zzzTrace").css("margin-right", "0px");
                $(".zzzOperator").hide();
            });

            //物料
            $("body").delegate("#zace-material-level", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-timeTrace-tbody"), "ID", DATABasic);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                           
                var _list = [];
                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].MaterialList && SelectData[i].MaterialList.length > 0) {
                        for (var j = 0; j < SelectData[i].MaterialList.length; j++) {

                            _list.push(SelectData[i].MaterialList[j]);

                        }
                    }
                }

                var list = $com.util.Clone(_list);
                MaterialAll = $com.util.Clone(_list);
                $.each(list, function (i, item) {
                    for (var p in item) {
                        if (!FORMATTRT_Level[p])
                            continue;
                        item[p] = FORMATTRT_Level[p](item[p]);
                    }
                });
                $("#femi-materialList-tbody").html($com.util.template(list, HTML.MaterialModeTrace));
                $("#femi-materialList-tbody tr").each(function (i, item) {
                    var $this = $(this);
                    var colorName = $this.css("background-color");
                    $this.attr("data-color", colorName);



                });

                $(".zzzParameter").hide();
                $(".zzzOperator").hide();
                $(".zzzMaterial").css("width", "650px");
                $(".zzzTrace").css("margin-right", "650px");
                $(".zzzMaterial").show();

            });

            //物料
            $("body").delegate("#zace-close-materialList", "click", function () {

                $(".zzzMaterial").css("width", "0px");
                $(".zzzTrace").css("margin-right", "0px");
                $(".zzzMaterial").hide();
            });


            //参数
            $("body").delegate("#zace-parameter-level", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-timeTrace-tbody"), "ID", DATABasic);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                var _list = [];
                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].ParameterList && SelectData[i].ParameterList.length > 0) {
                        for (var j = 0; j < SelectData[i].ParameterList.length; j++) {

                            _list.push(SelectData[i].ParameterList[j]);

                        }
                    }
                }

                var list = $com.util.Clone(_list);

                $.each(list, function (i, item) {
                    for (var p in item) {
                        if (!FORMATTRT_Level[p])
                            continue;
                        item[p] = FORMATTRT_Level[p](item[p]);
                    }
                });
                $("#femi-parameterlList-tbody").html($com.util.template(list, HTML.ParameterMode));
                $("#femi-parameterlList-tbody tr").each(function (i, item) {
                    var $this = $(this);
                    var colorName = $this.css("background-color");
                    $this.attr("data-color", colorName);



                });

                $(".zzzMaterial").hide();
                $(".zzzOperator").hide();
                $(".zzzParameter").css("width", "500px");
                $(".zzzTrace").css("margin-right", "500px");
                $(".zzzParameter").show();


            });

            //参数
            $("body").delegate("#zace-close-parameterList", "click", function () {

                $(".zzzParameter").css("width", "0px");
                $(".zzzTrace").css("margin-right", "0px");
                $(".zzzParameter").hide();
            });




            //追溯
            $("body").delegate("#zace-RetrospectPro-open", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-timeTracePro-tbody"), "ID", DATAMaterilBasic);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！")
                    return;
                }
                mPDEID = SelectData[0].ID;
                model.com.refreshID();
                $(".zzzTrace").hide();
                $(".zzzSpare").hide();
                $(".zzzReMaterial").hide();
                $(".zzzReOperator").hide();

                $(".zzzParameter").hide();
                $(".zzzMaterial").hide();
                $(".zzzOperator").hide();
                $(".zzzRetrospect").css("margin-right", "0px");
                $(".zzzRetrospect").show();

                $(".zzzPersonSpare").hide();
                $(".zzzPersonReMaterial").hide();
                $(".zzzPersonReOperator").hide();

                $(".zzzTracePro").hide();
                $(".zzzParameterPro").hide();
                $(".zzzMaterialPro").hide();
                $(".zzzOperatorPro").hide();

                $(".zzzDeviceSpare").hide();
                $(".zzzDeviceReMaterial").hide();
                $(".zzzDeviceReOperator").hide();
                $(".zzzDeviceRetrospect").hide();
            });
            //追溯
            $("body").delegate("#zace-Retrospect-open", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-timeTrace-tbody"), "ID", DATABasic);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！")
                    return;
                }
                mPDEID = SelectData[0].ID;
                model.com.refreshID();
                $(".zzzTrace").hide();
                $(".zzzSpare").hide();
                $(".zzzReMaterial").hide();
                $(".zzzReOperator").hide();

                $(".zzzParameter").hide();
                $(".zzzMaterial").hide();
                $(".zzzOperator").hide();
                $(".zzzRetrospect").css("margin-right", "0px");
                $(".zzzRetrospect").show();

                $(".zzzPersonSpare").hide();
                $(".zzzPersonReMaterial").hide();
                $(".zzzPersonReOperator").hide();

                $(".zzzTracePro").hide();
                $(".zzzParameterPro").hide();
                $(".zzzMaterialPro").hide();
                $(".zzzOperatorPro").hide();

                $(".zzzDeviceSpare").hide();
                $(".zzzDeviceReMaterial").hide();
                $(".zzzDeviceReOperator").hide();
                $(".zzzDeviceRetrospect").hide();
            });
            //追溯
            $("body").delegate("#zace-Retrospect-level", "click", function () {

                $(".zzzTrace").css("margin-right", "0px");
                $(".zzzTrace").show();
                $(".zzzSpare").hide();
                $(".zzzReMaterial").hide();
                $(".zzzReOperator").hide();

                $(".zzzParameter").hide();
                $(".zzzMaterial").hide();
                $(".zzzOperator").hide();
                $(".zzzRetrospect").hide();

                $(".zzzPersonSpare").hide();
                $(".zzzPersonReMaterial").hide();
                $(".zzzPersonReOperator").hide();

                $(".zzzTracePro").hide();
                $(".zzzParameterPro").hide();
                $(".zzzMaterialPro").hide();
                $(".zzzOperatorPro").hide();

                $(".zzzDeviceSpare").hide();
                $(".zzzDeviceReMaterial").hide();
                $(".zzzDeviceReOperator").hide();
                $(".zzzDeviceRetrospect").hide();
            });

            //操作员
            $("body").delegate("#zace-Reoperator-level", "click", function () {


                var SelectData = $com.table.getSelectionData($("#femi-Restrospect-tbody"), "ID", DATAReIDBasic);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }                   
                var _list = [];
                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].OperatorList && SelectData[i].OperatorList.length > 0) {
                        for (var j = 0; j < SelectData[i].OperatorList.length; j++) {

                            _list.push(SelectData[i].OperatorList[j]);

                        }
                    }
                }

                var list = $com.util.Clone(_list);
                OperatorAll = $com.util.Clone(_list);
                $.each(list, function (i, item) {
                    for (var p in item) {
                        if (!FORMATTRT_Level[p])
                            continue;
                        item[p] = FORMATTRT_Level[p](item[p]);
                    }
                });
                $("#femi-ReoperatorList-tbody").html($com.util.template(list, HTML.OperatorMode));
                $("#femi-ReoperatorList-tbody tr").each(function (i, item) {
                    var $this = $(this);
                    var colorName = $this.css("background-color");
                    $this.attr("data-color", colorName);



                });

                $(".zzzReMaterial").hide();
                $(".zzzSpare").hide();
                $(".zzzReOperator").css("width", "650px");
                $(".zzzRetrospect").css("margin-right", "650px");
                $(".zzzReOperator").show();

            });

            //操作员
            $("body").delegate("#zace-close-ReoperatorList", "click", function () {

                $(".zzzReOperator").css("width", "0px");
                $(".zzzRetrospect").css("margin-right", "0px");
                $(".zzzReOperator").hide();
            });

            //物料
            $("body").delegate("#zace-Rematerial-level", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-Restrospect-tbody"), "ID", DATAReIDBasic);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
              
     
                var _list = [];
                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].MaterialList && SelectData[i].MaterialList.length > 0) {
                        for (var j = 0; j < SelectData[i].MaterialList.length; j++) {

                            _list.push(SelectData[i].MaterialList[j]);

                        }
                    }
                }

                var list = $com.util.Clone(_list);

                $.each(list, function (i, item) {
                    for (var p in item) {
                        if (!FORMATTRT_Level[p])
                            continue;
                        item[p] = FORMATTRT_Level[p](item[p]);
                    }

                });

                $("#femi-RematerialList-tbody").html($com.util.template(list, HTML.MaterialMode));
                $("#femi-RematerialList-tbody tr").each(function (i, item) {
                    var $this = $(this);
                    var colorName = $this.css("background-color");
                    $this.attr("data-color", colorName);



                });

                $(".zzzSpare").hide();
                $(".zzzReOperator").hide();
                $(".zzzReMaterial").css("width", "700px");
                $(".zzzRetrospect").css("margin-right", "700px");
                $(".zzzReMaterial").show();

            });

            //物料
            $("body").delegate("#zace-close-RematerialList", "click", function () {

                $(".zzzReMaterial").css("width", "0px");
                $(".zzzRetrospect").css("margin-right", "0px");
                $(".zzzReMaterial").hide();
            });


            //备件
            $("body").delegate("#zace-spare-level", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-Restrospect-tbody"), "ID", DATAReIDBasic);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
              
                var _list = [];
                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].SpareList && SelectData[i].SpareList.length > 0) {
                        for (var j = 0; j < SelectData[i].SpareList.length; j++) {

                            _list.push(SelectData[i].SpareList[j]);

                        }
                    }
                }

                var list = $com.util.Clone(_list);

                $.each(list, function (i, item) {
                    for (var p in item) {
                        if (!FORMATTRT_Level[p])
                            continue;
                        item[p] = FORMATTRT_Level[p](item[p]);
                    }
                });             
             
                $("#femi-sparelList-tbody").html($com.util.template(list, HTML.SpareMode));
                $("#femi-sparelList-tbody tr").each(function (i, item) {
                    var $this = $(this);
                    var colorName = $this.css("background-color");
                    $this.attr("data-color", colorName);



                });

                $(".zzzReMaterial").hide();
                $(".zzzReOperator").hide();
                $(".zzzSpare").css("width", "500px");
                $(".zzzRetrospect").css("margin-right", "500px");
                $(".zzzSpare").show();

            });

            //备件
            $("body").delegate("#zace-close-spareList", "click", function () {

                $(".zzzSpare").css("width", "0px");
                $(".zzzRetrospect").css("margin-right", "0px");
                $(".zzzSpare").hide();
            });

            //设备追溯表zace-Retrospect-device            
            $("body").delegate("#zace-Retrospect-device", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-Restrospect-tbody"), "ID", DATAReIDBasic);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！")
                    return;
                }
                mDeviceID = SelectData[0].DeviceID;
                model.com.refreshDevice();
                
                $(".zzzDeviceSpare").hide();
                $(".zzzDeviceReMaterial").hide();
                $(".zzzDeviceReOperator").hide();

                $(".zzzTrace").hide();
                $(".zzzSpare").hide();
                $(".zzzReMaterial").hide();
                $(".zzzReOperator").hide();

                $(".zzzTracePro").hide();
                $(".zzzParameterPro").hide();
                $(".zzzMaterialPro").hide();
                $(".zzzOperatorPro").hide();

                $(".zzzParameter").hide();
                $(".zzzMaterial").hide();
                $(".zzzOperator").hide();
                $(".zzzRetrospect").hide();
                $(".zzzDeviceRetrospect").css("margin-right", "0px");
                $(".zzzDeviceRetrospect").show();

                $(".zzzPersonSpare").hide();
                $(".zzzPersonReMaterial").hide();
                $(".zzzPersonReOperator").hide();
            });
            //追溯
            $("body").delegate("#zace-DeviceRetrospect-level", "click", function () {

                $(".zzzRetrospect").css("margin-right", "0px");
                $(".zzzRetrospect").show();
                $(".zzzDeviceRetrospect").hide();
                $(".zzzTrace").hide();
                $(".zzzSpare").hide();
                $(".zzzReMaterial").hide();
                $(".zzzReOperator").hide();

                $(".zzzParameter").hide();
                $(".zzzMaterial").hide();
                $(".zzzOperator").hide();

                $(".zzzPersonSpare").hide();
                $(".zzzPersonReMaterial").hide();
                $(".zzzPersonReOperator").hide();

                $(".zzzTracePro").hide();
                $(".zzzParameterPro").hide();
                $(".zzzMaterialPro").hide();
                $(".zzzOperatorPro").hide();

                $(".zzzDeviceSpare").hide();
                $(".zzzDeviceReMaterial").hide();
                $(".zzzDeviceReOperator").hide();
            });

            //操作员
            $("body").delegate("#zace-DeviceReoperator-level", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-DeviceRestrospect-tbody"), "ID", DATAReDeviceBasic);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                           
                var _list = [];
                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].OperatorList && SelectData[i].OperatorList.length > 0) {
                        for (var j = 0; j < SelectData[i].OperatorList.length; j++) {

                            _list.push(SelectData[i].OperatorList[j]);

                        }
                    }
                }

                var list = $com.util.Clone(_list);
                OperatorAll = $com.util.Clone(_list);
                $.each(list, function (i, item) {
                    for (var p in item) {
                        if (!FORMATTRT_Level[p])
                            continue;
                        item[p] = FORMATTRT_Level[p](item[p]);
                    }
                });
                $("#femi-DeviceReoperatorList-tbody").html($com.util.template(list, HTML.OperatorMode));
                $("#femi-DeviceReoperatorList-tbody tr").each(function (i, item) {
                    var $this = $(this);
                    var colorName = $this.css("background-color");
                    $this.attr("data-color", colorName);



                });

                $(".zzzDeviceReMaterial").hide();
                $(".zzzDeviceSpare").hide();
                $(".zzzDeviceReOperator").css("width", "650px");
                $(".zzzDeviceRetrospect").css("margin-right", "650px");
                $(".zzzDeviceReOperator").show();

            });

            //操作员
            $("body").delegate("#zace-close-DeviceReoperatorList", "click", function () {

                $(".zzzDeviceReOperator").css("width", "0px");
                $(".zzzDeviceRetrospect").css("margin-right", "0px");
                $(".zzzDeviceReOperator").hide();
            });

            //物料
            $("body").delegate("#zace-DeviceRematerial-level", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-DeviceRestrospect-tbody"), "ID", DATAReDeviceBasic);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                var _list = [];
                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].MaterialList && SelectData[i].MaterialList.length > 0) {
                        for (var j = 0; j < SelectData[i].MaterialList.length; j++) {

                            _list.push(SelectData[i].MaterialList[j]);

                        }
                    }
                }

                var list = $com.util.Clone(_list);

                $.each(list, function (i, item) {
                    for (var p in item) {
                        if (!FORMATTRT_Level[p])
                            continue;
                        item[p] = FORMATTRT_Level[p](item[p]);
                    }

                });
                $("#femi-DeviceRematerialList-tbody").html($com.util.template(list, HTML.MaterialMode));
                $("#femi-DeviceRematerialList-tbody tr").each(function (i, item) {
                    var $this = $(this);
                    var colorName = $this.css("background-color");
                    $this.attr("data-color", colorName);



                });

                $(".zzzDeviceSpare").hide();
                $(".zzzDeviceReOperator").hide();
                $(".zzzDeviceReMaterial").css("width", "700px");
                $(".zzzDeviceRetrospect").css("margin-right", "700px");
                $(".zzzDeviceReMaterial").show();

            });

            //物料
            $("body").delegate("#zace-close-DeviceRematerialList", "click", function () {

                $(".zzzDeviceReMaterial").css("width", "0px");
                $(".zzzDeviceRetrospect").css("margin-right", "0px");
                $(".zzzDeviceReMaterial").hide();
            });


            //备件
            $("body").delegate("#zace-Devicespare-level", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-DeviceRestrospect-tbody"), "ID", DATAReDeviceBasic);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                var _list = [];
                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].SpareList && SelectData[i].SpareList.length > 0) {
                        for (var j = 0; j < SelectData[i].SpareList.length; j++) {

                            _list.push(SelectData[i].SpareList[j]);

                        }
                    }
                }

                var list = $com.util.Clone(_list);

                $.each(list, function (i, item) {
                    for (var p in item) {
                        if (!FORMATTRT_Level[p])
                            continue;
                        item[p] = FORMATTRT_Level[p](item[p]);
                    }
                });
                $("#femi-DevicesparelList-tbody").html($com.util.template(list, HTML.SpareMode));
                $("#femi-DevicesparelList-tbody tr").each(function (i, item) {
                    var $this = $(this);
                    var colorName = $this.css("background-color");
                    $this.attr("data-color", colorName);



                });

                $(".zzzDeviceReMaterial").hide();
                $(".zzzDeviceReOperator").hide();
                $(".zzzDeviceSpare").css("width", "500px");
                $(".zzzDeviceRetrospect").css("margin-right", "500px");
                $(".zzzDeviceSpare").show();

            });

            //备件
            $("body").delegate("#zace-close-DevicespareList", "click", function () {

                $(".zzzDeviceSpare").css("width", "0px");
                $(".zzzDeviceRetrospect").css("margin-right", "0px");
                $(".zzzDeviceSpare").hide();
            });


            //人员追溯表zace-Retrospect-device            
            $("body").delegate("#zace-open-PersonReoperatorList", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-ReoperatorList-tbody"), "ID", OperatorAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！")
                    return;
                }
                mPersonID = SelectData[0].OperatorID;
                model.com.refreshPerson();

                $(".zzzDeviceSpare").hide();
                $(".zzzDeviceReMaterial").hide();
                $(".zzzDeviceReOperator").hide();

                $(".zzzPersonSpare").hide();
                $(".zzzPersonReMaterial").hide();
                $(".zzzPersonReOperator").hide();

                $(".zzzTrace").hide();
                $(".zzzSpare").hide();
                $(".zzzReMaterial").hide();
                $(".zzzReOperator").hide();

                $(".zzzParameter").hide();
                $(".zzzMaterial").hide();
                $(".zzzOperator").hide();
                $(".zzzRetrospect").hide();
                $(".zzzDeviceRetrospect").hide();

                $(".zzzPersonRetrospect").css("margin-right", "0px");
                $(".zzzPersonRetrospect").show();

            });
            $("body").delegate("#zace-open-PersonReoperatorListDevice", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-DeviceReoperatorList-tbody"), "ID", OperatorAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！")
                    return;
                }
                mPersonID = SelectData[0].OperatorID;
                model.com.refreshPerson();

                $(".zzzDeviceSpare").hide();
                $(".zzzDeviceReMaterial").hide();
                $(".zzzDeviceReOperator").hide();

                $(".zzzPersonSpare").hide();
                $(".zzzPersonReMaterial").hide();
                $(".zzzPersonReOperator").hide();

                $(".zzzTrace").hide();
                $(".zzzSpare").hide();
                $(".zzzReMaterial").hide();
                $(".zzzReOperator").hide();

                $(".zzzParameter").hide();
                $(".zzzMaterial").hide();
                $(".zzzOperator").hide();
                $(".zzzRetrospect").hide();
                $(".zzzDeviceRetrospect").hide();

                $(".zzzPersonRetrospect").css("margin-right", "0px");
                $(".zzzPersonRetrospect").show();

            });
            $("body").delegate("#zace-open-PersonReoperatorListDevicePerson", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-PersonReoperatorList-tbody"), "ID", OperatorAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据操作！")
                    return;
                }
                mPersonID = SelectData[0].OperatorID;
                model.com.refreshPerson();

                $(".zzzDeviceSpare").hide();
                $(".zzzDeviceReMaterial").hide();
                $(".zzzDeviceReOperator").hide();

                $(".zzzPersonSpare").hide();
                $(".zzzPersonReMaterial").hide();
                $(".zzzPersonReOperator").hide();

                $(".zzzTrace").hide();
                $(".zzzSpare").hide();
                $(".zzzReMaterial").hide();
                $(".zzzReOperator").hide();

                $(".zzzParameter").hide();
                $(".zzzMaterial").hide();
                $(".zzzOperator").hide();
                $(".zzzRetrospect").hide();
                $(".zzzDeviceRetrospect").hide();

                $(".zzzPersonRetrospect").css("margin-right", "0px");
                $(".zzzPersonRetrospect").show();

            });
            //追溯
            $("body").delegate("#zace-PersonRetrospect-level", "click", function () {

                $(".zzzRetrospect").css("margin-right", "0px");
                $(".zzzRetrospect").show();
                $(".zzzDeviceRetrospect").hide();
                $(".zzzTrace").hide();
                $(".zzzSpare").hide();
                $(".zzzReMaterial").hide();
                $(".zzzReOperator").hide();

                $(".zzzParameter").hide();
                $(".zzzMaterial").hide();
                $(".zzzOperator").hide();

                $(".zzzDeviceSpare").hide();
                $(".zzzDeviceReMaterial").hide();
                $(".zzzDeviceReOperator").hide();

                $(".zzzPersonRetrospect").hide();
                $(".zzzPersonSpare").hide();
                $(".zzzPersonReMaterial").hide();
                $(".zzzPersonReOperator").hide();
            });

            //操作员
            $("body").delegate("#zace-PersonReoperator-level", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-PersonRestrospect-tbody"), "ID", DATARePersonBasic);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                var _list = [];
                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].OperatorList && SelectData[i].OperatorList.length > 0) {
                        for (var j = 0; j < SelectData[i].OperatorList.length; j++) {

                            _list.push(SelectData[i].OperatorList[j]);

                        }
                    }
                }

                var list = $com.util.Clone(_list);
                OperatorAll = $com.util.Clone(_list);
                $.each(list, function (i, item) {
                    for (var p in item) {
                        if (!FORMATTRT_Level[p])
                            continue;
                        item[p] = FORMATTRT_Level[p](item[p]);
                    }
                });

                $("#femi-PersonReoperatorList-tbody").html($com.util.template(list, HTML.OperatorMode));
                $("#femi-PersonReoperatorList-tbody tr").each(function (i, item) {
                    var $this = $(this);
                    var colorName = $this.css("background-color");
                    $this.attr("data-color", colorName);



                });

                $(".zzzPersonReMaterial").hide();
                $(".zzzPersonSpare").hide();
                $(".zzzPersonReOperator").css("width", "650px");
                $(".zzzPersonRetrospect").css("margin-right", "650px");
                $(".zzzPersonReOperator").show();

            });

            //操作员
            $("body").delegate("#zace-close-PersonReoperatorList", "click", function () {

                $(".zzzPersonReOperator").css("width", "0px");
                $(".zzzPersonRetrospect").css("margin-right", "0px");
                $(".zzzPersonReOperator").hide();
            });

            //物料
            $("body").delegate("#zace-PersonRematerial-level", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-PersonRestrospect-tbody"), "ID", DATARePersonBasic);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                var _list = [];
                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].MaterialList && SelectData[i].MaterialList.length > 0) {
                        for (var j = 0; j < SelectData[i].MaterialList.length; j++) {

                            _list.push(SelectData[i].MaterialList[j]);

                        }
                    }
                }

                var list = $com.util.Clone(_list);

                $.each(list, function (i, item) {
                    for (var p in item) {
                        if (!FORMATTRT_Level[p])
                            continue;
                        item[p] = FORMATTRT_Level[p](item[p]);
                    }

                });
                $("#femi-PersonRematerialList-tbody").html($com.util.template(list, HTML.MaterialMode));
                $("#femi-PersonRematerialList-tbody tr").each(function (i, item) {
                    var $this = $(this);
                    var colorName = $this.css("background-color");
                    $this.attr("data-color", colorName);



                });

                $(".zzzPersonSpare").hide();
                $(".zzzPersonReOperator").hide();
                $(".zzzPersonReMaterial").css("width", "700px");
                $(".zzzPersonRetrospect").css("margin-right", "700px");
                $(".zzzPersonReMaterial").show();

            });

            //物料
            $("body").delegate("#zace-close-PersonRematerialList", "click", function () {

                $(".zzzPersonReMaterial").css("width", "0px");
                $(".zzzPersonRetrospect").css("margin-right", "0px");
                $(".zzzPersonReMaterial").hide();
            });


            //备件
            $("body").delegate("#zace-Personspare-level", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-PersonRestrospect-tbody"), "ID", DATARePersonBasic);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                var _list = [];
                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].SpareList && SelectData[i].SpareList.length > 0) {
                        for (var j = 0; j < SelectData[i].SpareList.length; j++) {

                            _list.push(SelectData[i].SpareList[j]);

                        }
                    }
                }

                var list = $com.util.Clone(_list);

                $.each(list, function (i, item) {
                    for (var p in item) {
                        if (!FORMATTRT_Level[p])
                            continue;
                        item[p] = FORMATTRT_Level[p](item[p]);
                    }
                });
                $("#femi-PersonsparelList-tbody").html($com.util.template(list, HTML.SpareMode));
                $("#femi-PersonsparelList-tbody tr").each(function (i, item) {
                    var $this = $(this);
                    var colorName = $this.css("background-color");
                    $this.attr("data-color", colorName);



                });

                $(".zzzPersonReMaterial").hide();
                $(".zzzPersonReOperator").hide();
                $(".zzzPersonSpare").css("width", "500px");
                $(".zzzPersonRetrospect").css("margin-right", "500px");
                $(".zzzPersonSpare").show();

            });

            //备件
            $("body").delegate("#zace-close-PersonspareList", "click", function () {

                $(".zzzPersonSpare").css("width", "0px");
                $(".zzzPersonRetrospect").css("margin-right", "0px");
                $(".zzzPersonSpare").hide();
            });



            //成品查询
            $("body").delegate("#zace-search-tracePro", "change", function () {

                var $this = $(this),
                   value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-timeTracePro-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-timeTracePro-tbody"), SearchMaterilAll, value, "ID");



            });
        
            //
            //筛选
            $("body").delegate("#zace-SearchProductPro-level", "click", function () {
                var default_value = {
                    OrderID: 0,
                    //WorkShopID: 0,
                    //LineID: 0,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;
      
                    default_value.OrderID = Number(rst.OrderID);
                    //default_value.WorkShopID = Number(rst.WorkShopID);
                    //default_value.LineID = Number(rst.LineID);
                 
                    $com.table.filterByConndition($("#femi-timeTracePro-tbody"), DATAMaterilBasic, default_value, "ID");
                    //model.com.refresh();

                }, TypeSource_Level));


            });


            //成品查询
            $("body").delegate("#zace-search-trace", "change", function () {

                var $this = $(this),
                   value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-timeTrace-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-timeTrace-tbody"), SearchAll, value, "ID");



            });

            //
            //条件查询
            $("body").delegate("#zace-SearchProduct-level", "click", function () {
                var default_value = {
                    PDENo: "",
                    BatchNo: "",
                    OrderID: 0,
                    //MaterialID: 0,
                    WorkShopID: 0,
                    LineID: 0,
                    StartTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                    EndTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    if (isNaN(rst.EndTime.getTime()) && isNaN(rst.StartTime.getTime())) {
                        rst.EndTime = new Date("2000-01-01");
                    }
                    if (isNaN(rst.EndTime.getTime()) && !(isNaN(rst.StartTime.getTime()))) {
                        rst.EndTime = new Date("4000-01-01");
                    }
                    if (isNaN(rst.StartTime.getTime())) {
                        rst.StartTime = new Date('2000-01-01');
                    }
                    mPDENo = rst.PDENo;
                    mBatchNo = rst.BatchNo;
                    mOrderID = Number(rst.OrderID);
                    mWorkShopID = Number(rst.WorkShopID);
                    //mMaterialID = Number(rst.MaterialID);
                    mLineID = Number(rst.LineID);
                    mStartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.StartTime));
                    mEndTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.EndTime));
                    //$com.table.filterByConndition($("#femi-riskLevel-tbody"), DataAll, default_value, "ID");
                    model.com.refresh();

                }, TypeSource_Level));


            });

            //反条件查询
            $("body").delegate("#zace-SearchProduct-levelReBack", "click", function () {
                var default_value = {                  
                    BatchNo: "",
                    MaterialID: 0,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_LevelItem, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                  
                    mMaterialBatchNo = rst.BatchNo;
                
                    mMaterialID = Number(rst.MaterialID);
                  
                    model.com.refreshRBack();

                }, TypeSource_LevelItem));


            });

            //追溯查询
            $("body").delegate("#zace-search-Restrospect", "change", function () {

                var $this = $(this),
                   value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-Restrospect-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-Restrospect-tbody"), SearchReIDAll, value, "ID");



            });

            //
            //追溯筛选
            $("body").delegate("#zace-searchZall-Restrospect", "click", function () {
                var default_value = {
                    OrderID: 0,
                    //WorkShopID: 0,
                    //LineID: 0,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.OrderID = Number(rst.OrderID);
                    //default_value.WorkShopID = Number(rst.WorkShopID);
                    //default_value.LineID = Number(rst.LineID);

                    $com.table.filterByConndition($("#femi-Restrospect-tbody"), DATAReIDBasic, default_value, "ID");
                    //model.com.refresh();

                }, TypeSource_Level));


            });


            //设备追溯查询
            $("body").delegate("#zace-search-DeviceRestrospect", "change", function () {

                var $this = $(this),
                   value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-DeviceRestrospect-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-DeviceRestrospect-tbody"), SearchReDeviceAll, value, "ID");



            });

            //
            //设备追溯筛选
            $("body").delegate("#zace-searchZall-DeviceRestrospect", "click", function () {
                var default_value = {
                    OrderID: 0,
                    //WorkShopID: 0,
                    //LineID: 0,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.OrderID = Number(rst.OrderID);
                    //default_value.WorkShopID = Number(rst.WorkShopID);
                    //default_value.LineID = Number(rst.LineID);

                    $com.table.filterByConndition($("#femi-DeviceRestrospect-tbody"), DATAReDeviceBasic, default_value, "ID");
                   // model.com.refresh();

                }, TypeSource_Level));


            });


            //人员追溯查询
            $("body").delegate("#zace-search-PersonRestrospect", "change", function () {

                var $this = $(this),
                   value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-PersonRestrospect-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-PersonRestrospect-tbody"), SearchRePersonAll, value, "ID");



            });

            //
            //人员追溯筛选
            $("body").delegate("#zace-searchZall-PersonRestrospect", "click", function () {
                var default_value = {
                    OrderID: 0,
                    //WorkShopID: 0,
                    //LineID: 0,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.OrderID = Number(rst.OrderID);
                    //default_value.WorkShopID = Number(rst.WorkShopID);
                    //default_value.LineID = Number(rst.LineID);

                    $com.table.filterByConndition($("#femi-PersonRestrospect-tbody"), DATARePersonBasic, default_value, "ID");
                   // model.com.refresh();

                }, TypeSource_Level));


            });

            ////跳转事业部
            //$("body").delegate("#zace-business-level", "click", function () {
            //    var vdata = { 'header': '事业部', 'href': './factory_model/BusinessUnitSetting.html', 'id': 'BusinessUnitSetup', 'src': './static/images/menu/factoryModel/division.png' };
            //    window.parent.iframeHeaderSet(vdata);

            //});
        },




        run: function () {

            model.com.getFMCWorkShop({ FactoryID: 0, BusinessUnitID: 0 }, function (resPZ) {
                if (resPZ && resPZ.list) {
                    $.each(resPZ.list, function (i, item) {
                        TypeSource_Level.WorkShopID.push({
                            name: item.Name,
                            value: item.ID,
                        });
                    });

                }
               

                model.com.getFMCLine({ FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0 }, function (resPZ) {
                    if (resPZ && resPZ.list) {
                        $.each(resPZ.list, function (i, item) {
                            TypeSource_Level.LineID.push({
                                name: item.Name,
                                value: item.ID,
                            });
                        });

                    }

                  
                    model.com.getFPCRoute({ FactoryID: 0, BusinessUnitID: 0, ProductTypeID: 0 }, function (resP) {
                        if (resP && resP.list) {
                            $.each(resP.list, function (i, item) {
                                TypeSource_Level.RouteID.push({
                                    name: item.Name,
                                    value: item.ID,
                                });
                            });

                        }                       
                        model.com.getModuleAll({ module: 100003 }, function (resP) {
                            if (resP && resP.list) {
                                $.each(resP.list, function (i, item) {
                                    TypeSource_Level.MaterialTypeID.push({
                                        name: item.ItemName,
                                        value: item.ID,
                                    });
                                });

                            }
                            TypeSource_LevelItem.MaterialTypeID = TypeSource_Level.MaterialTypeID;
                            model.com.getFMCStation({ LineID: 0 }, function (resP) {
                                if (resP && resP.list) {
                                    $.each(resP.list, function (i, item) {
                                        TypeSource_Level.StationID.push({
                                            name: item.Name,
                                            value: item.ID,
                                        });
                                    });

                                }
                                TypeSource_LevelItem.StationID = TypeSource_Level.StationID;
                                model.com.getmaterialRecord({ material_no: "", material_name: "", type_id: 0, status: 0 }, function (resPZ) {
                                    if (resPZ && resPZ.list) {
                                        $.each(resPZ.list, function (i, item) {
                                            TypeSource_Level.MaterialID.push({
                                                name: item.MaterialNo + "/" + item.MaterialName,
                                                value: item.ID,
                                            });
                                        });

                                    }
                                    TypeSource_LevelItem.MaterialID = TypeSource_Level.MaterialID;
                                    //mStartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', model.com.addDays(new Date(),-7));
                                    //mEndTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date());
                                    model.com.getCommandAll({ startTime: "2010-01-01 08:00:00", endTime: "2100-01-01 08:00:00", status: 0 }, function (resP) {
                                        if (resP && resP.list) {
                                            $.each(resP.list, function (i, item) {
                                                TypeSource_Level.OrderID.push({
                                                    name: item.No,
                                                    value: item.ID,
                                                });
                                            });

                                        }                                     
                                        model.com.refresh();
                                    });
                                });
                            });
                        });
                    });
                });
            });
             
          
        },

        com: {

            refresh: function () {

                model.com.getTraceProduct({ PDEID: 0, PDENo: mPDENo, WorkShopID: mWorkShopID, LineID: mLineID, BatchNo: mBatchNo, OrderID: mOrderID, TStart: mStartTime, TEnd: mEndTime, MaterialID: 0, MaterialBatchNo: "" }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var Grade = $com.util.Clone(resP.list);
                        //所有数据
                        DATABasic = $com.util.Clone(resP.list);
                        var _list = $com.util.Clone(resP.list);
                        $.each(_list, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }
                        });
                        SearchAll = $com.util.Clone(_list);
                        $("#femi-timeTrace-tbody").html($com.util.template(_list, HTML.TraceMode));
                        $("#femi-timeTrace-tbody tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });



                    }

                });

               
              
                           
            },
            refreshRBack:function(){

                model.com.getTraceProduct({ PDEID: 0, PDENo: "", WorkShopID: 0, LineID: 0, BatchNo: "", OrderID: 0, TStart: "2000-01-01", TEnd: "2000-01-01", MaterialID: mMaterialID, MaterialBatchNo: mMaterialBatchNo }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var Grade = $com.util.Clone(resP.list);
                        //所有数据
                        DATABasic = $com.util.Clone(resP.list);
                        var _list = $com.util.Clone(resP.list);
                        $.each(_list, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }
                        });
                        SearchAll = $com.util.Clone(_list);
                        $("#femi-timeTrace-tbody").html($com.util.template(_list, HTML.TraceMode));
                        $("#femi-timeTrace-tbody tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });



                    }

                });
            },
            refreshMaterial: function () {

                model.com.getProductAll_Material({ MaterialID: 0, MaterialNo: mBatchNoPro, MaterialName: "", TStart: "2000-01-01", TEnd: "2000-01-01" }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var Grade = $com.util.Clone(resP.list);
                        //所有数据
                        DATAMaterilBasic = $com.util.Clone(resP.list);
                        var _list = $com.util.Clone(resP.list);
                        $.each(_list, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }
                        });
                        SearchMaterilAll = $com.util.Clone(_list);
                        $("#femi-timeTracePro-tbody").html($com.util.template(_list, HTML.TraceMode));
                        $("#femi-timeTracePro-tbody tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });


                    }


                });
            },
            refreshID: function () {

                model.com.getRetrospectAll_ID({ PDEID: mPDEID }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var Grade = $com.util.Clone(resP.list);
                        //所有数据
                        DATAReIDBasic = $com.util.Clone(resP.list);
                        var _list = $com.util.Clone(resP.list);
                        $.each(_list, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }
                        });
                        SearchReIDAll = $com.util.Clone(_list);
                        $("#femi-Restrospect-tbody").html($com.util.template(_list, HTML.RetrospectMode));
                        $("#femi-Restrospect-tbody tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });



                    }

                });
            },
            refreshDevice:function(){

                model.com.getRetrospectAll_Device({ DeviceID: mDeviceID, DeviceName: "", TStart: "2000-01-01", TEnd: "2000-01-01" }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var Grade = $com.util.Clone(resP.list);
                        //所有数据
                        DATAReDeviceBasic = $com.util.Clone(resP.list);
                        var _list = $com.util.Clone(resP.list);
                        $.each(_list, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }
                        });
                        SearchReDeviceAll = $com.util.Clone(_list);
                        $("#femi-DeviceRestrospect-tbody").html($com.util.template(_list, HTML.RetrospectMode));
                        $("#femi-DeviceRestrospect-tbody tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });



                    }

                });
            },
            refreshPerson:function(){
                //mPersonID
                model.com.getRetrospectAll_Person({ OperatorID: mPersonID, OperatorName: "", TStart: "2000-01-01", TEnd: "2000-01-01" }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var Grade = $com.util.Clone(resP.list);
                        //所有数据
                        DATARePersonBasic = $com.util.Clone(resP.list);
                        var _list = $com.util.Clone(resP.list);
                        $.each(_list, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            }
                        });
                        SearchRePersonAll = $com.util.Clone(_list);
                        $("#femi-PersonRestrospect-tbody").html($com.util.template(_list, HTML.RetrospectMode));
                        $("#femi-PersonRestrospect-tbody tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });



                    }

                });
            },
            //查询制造令
            getCommandAll: function (data, fn, context) {
                var d = {
                    $URI: "/MESOrder/CommandAll",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询所有物料
            getmaterialRecord: function (data, fn, context) {
                var d = {
                    $URI: "/Material/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询工位列表
            getFMCStation: function (data, fn, context) {
                var d = {
                    $URI: "/FMCStation/All",
                    $TYPE: "get"
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
            //用户人员
            getUser: function (data, fn, context) {
                var d = {
                    $URI: "/User/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //产品规格
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
            //产品类型
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
            //查询车间列表
            getFMCWorkShop: function (data, fn, context) {
                var d = {
                    $URI: "/FMCWorkShop/All",
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
            //查询成品列表
            getTraceProduct: function (data, fn, context) {
                var d = {
                    $URI: "/TBT/ProductAll",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);


            },
            //查询物料 成品列表
            getProductAll_Material: function (data, fn, context) {
                var d = {
                    $URI: "/TBT/ProductAll_Material",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);


            },
            //查询设备 追溯列表
            getRetrospectAll_Device: function (data, fn, context) {
                var d = {
                    $URI: "/TBT/RetrospectAll_Device",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);


            },
            //查询编号 追溯列表
            getRetrospectAll_ID: function (data, fn, context) {
                var d = {
                    $URI: "/TBT/RetrospectAll_ID",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);


            },

            //查询人员 追溯列表
            getRetrospectAll_Person: function (data, fn, context) {
                var d = {
                    $URI: "/TBT/RetrospectAll_Person",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);


            },
            //保存列表
            postFMCFactory: function (data, fn, context) {
                var d = {
                    $URI: "/FMCFactory/Update",
                    $TYPE: "post"
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
            addDays: function (date, days) {
                if (days == undefined || days == '') {
                    days = 1;
                }
                var date = new Date(date);
                date.setDate(date.getDate() + days);
                var month = date.getMonth() + 1;
                var day = date.getDate();
                var mm = "'" + month + "'";
                var dd = "'" + day + "'";

                //单位数前面加0
                if (mm.length == 3) {
                    month = "0" + month;
                }
                if (dd.length == 3) {
                    day = "0" + day;
                }

                var time = date.getFullYear() + "-" + month + "-" + day;
                return time;
            },


        }
    }),

    model.init();


});