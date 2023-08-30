require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($zace, $com) {

    var KEYWORD_Level_LISTItem,
        KEYWORD_LevelItem,
        FORMATTRT_LevelItem,
        DEFAULT_VALUE_LevelItem,
        TypeSource_LevelItem,
        KEYWORD_Level_LIST,
        KEYWORD_Level,
        FORMATTRT_Level,
        DEFAULT_VALUE_Level,
        TypeSource_Level,
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

    //参数列表
    ParameterAll = [];
    BasicParameterAll = [];
    //物料列表
    MaterialAll = [];
    BasicMaterialAll = [];
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
    mPDENo = "";
    mBatchNo = "";
    mOrderID = 0;
    mMaterialID = 0;
    mWorkShopID = 0;
    mLineID = 0;
    mStartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date("2000-01-01"));
    mEndTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date("2000-01-01"));

    //操作员列表
    BasicOperatorAll = [];
    OperatorAll = [];
    mPersonID = 0;
    mDeviceID = 0;
    mPDEID = 0;
    HTML = {
        TraceMode: [
				'<tr style="background-color:{{color}}" data-color="">',
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
               '<tr >',
               '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
               '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
               '<td data-title="PDEName" data-value="{{PDEName}}" >{{PDEName}}</td>',
               '<td data-title="WorkshopName" data-value="{{WorkshopName}}" >{{WorkshopName}}</td>',
               '<td data-title="LineName" data-value="{{LineName}}" >{{LineName}}</td>',
               '<td data-title="PartName" data-value="{{PartName}}" >{{PartName}}</td>',
               '<td data-title="PartPointName" data-value="{{PartPointName}}" >{{PartPointName}}</td>',
               '<td data-title="StationName" data-value="{{StationName}}" >{{StationName}}</td>',
               '<td data-title="DeviceName" data-value="{{DeviceName}}" >{{DeviceName}}</td>',
                '<td data-title="OrderNo" data-value="{{OrderNo}}" >{{OrderNo}}</td>',
                 '<td data-title="ProductNo" data-value="{{ProductNo}}" >{{ProductNo}}</td>',
                   '<td data-title="RouteName" data-value="{{RouteName}}" >{{RouteName}}</td>',
                  '<td data-title="Result" data-value="{{Result}}" >{{Result}}</td>',
                    '<td data-title="PushTime" data-value="{{PushTime}}" >{{PushTime}}</td>',
                 '<td data-title="PullTime" data-value="{{PullTime}}" >{{PullTime}}</td>',
               '</tr>',
        ].join(""),

        OperatorMode: [
              '<tr>',
              '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
              '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
              '<td data-title="ParentType" data-value="{{ParentType}}" >{{ParentType}}</td>',
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

        MaterialMode: [
             '<tr>',
             '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
             '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
             '<td data-title="ParentType" data-value="{{ParentType}}" >{{ParentType}}</td>',
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
         "ReTypeID|追溯|ArrayOne",
         "PDENo|成品",
         "BatchNo|批次号",       
         "MaterialID|物料|ArrayOne",
         "OrderID|订单|ArrayOne",
         "WorkShopID|车间|ArrayOne",
         "LineID|产线|ArrayOne",
          "StationID|工位|ArrayOne",
         "ParentType|类型|ArrayOne",
          "Status|状态|ArrayOne",
         "Result|结果|ArrayOne",
          "ResultID|结果|ArrayOne",
          "RouteID|工艺路线|ArrayOne",
           "MaterialTypeID|物料类型|ArrayOne",
         "StartTime|开始时间|DateTime",
         "EndTime|结束时间|DateTime",
        ];
        KEYWORD_Level = {};
        FORMATTRT_Level = {};

        TypeSource_Level = {
            ReTypeID: [
            {
                name: "正向",
                value: 1
            },
             {
                 name: "反向",
                 value: 2
             }
            ],
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
            //BatchNo: [
            //    {
            //        name: "无",
            //        value: ""
            //    }
            //],
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
            StationID: [
             {
                 name: "无",
                 value: 0
             }
            ],
            MaterialTypeID: [],
            MaterialID: [
              {
                  name: "无",
                  value: 0
              }
            ],
            RouteID: [],
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
         "BatchNo|批次号",
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
            $("body").delegate("#zace-operator-level", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-timeTrace-tbody"), "ID", DATABasic);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择数据再试！")
                    return;
                }
                var _list = [];
                for (var i = 0; i < SelectData.length; i++) {
                    if (SelectData[i].OperatorList && SelectData[i].OperatorList.length>0) {
                        for (var j = 0; j < SelectData[i].OperatorList.length; j++) {

                            _list.push(SelectData[i].OperatorList[j]);

                        }
                    }
                }
                BasicOperatorAll = $com.util.Clone(_list);
                var list = $com.util.Clone(_list);
                $.each(list, function (i, item) {
                    for (var p in item) {
                        if (!FORMATTRT_LevelItem[p])
                            continue;
                        item[p] = FORMATTRT_LevelItem[p](item[p]);
                    }
                });
                OperatorAll = list;
                $("#femi-operatorList-tbody").html($com.util.template(list, HTML.OperatorMode));

                $(".zzzTrace").hide();
                $(".zzzParameter").hide();
                $(".zzzOperator").show();
                $(".zzzMaterial").hide();

            });

            //操作员
            $("body").delegate("#zace-close-operatorList", "click", function () {

              
                $(".zzzTrace").show();
                $(".zzzParameter").hide();
                $(".zzzOperator").hide();
                $(".zzzMaterial").hide();
            });

            //物料
            $("body").delegate("#zace-material-level", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-timeTrace-tbody"), "ID", DATABasic);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择数据再试！")
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
                BasicMaterialAll = $com.util.Clone(_list);
                var list = $com.util.Clone(_list);
                $.each(list, function (i, item) {
                    for (var p in item) {
                        if (!FORMATTRT_LevelItem[p])
                            continue;
                        item[p] = FORMATTRT_LevelItem[p](item[p]);
                    }
                });
                MaterialAll = list;
             
                $("#femi-materialList-tbody").html($com.util.template(list, HTML.MaterialMode));

                $(".zzzTrace").hide();
                $(".zzzParameter").hide();
                $(".zzzOperator").hide();              
                $(".zzzMaterial").show();

            });

            //物料
            $("body").delegate("#zace-close-materialList", "click", function () {

                $(".zzzTrace").show();
                $(".zzzParameter").hide();
                $(".zzzOperator").hide();
                $(".zzzMaterial").hide();
            });


            //参数
            $("body").delegate("#zace-parameter-level", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-timeTrace-tbody"), "ID", DATABasic);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择数据再试！")
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
                BasicParameterAll = $com.util.Clone(_list);
                var list = $com.util.Clone(_list);
                $.each(list, function (i, item) {
                    for (var p in item) {
                        if (!FORMATTRT_LevelItem[p])
                            continue;
                        item[p] = FORMATTRT_LevelItem[p](item[p]);
                    }
                });
                ParameterAll = list;
                $("#femi-parameterlList-tbody").html($com.util.template(list, HTML.ParameterMode));

                $(".zzzTrace").hide();
                $(".zzzParameter").show();
                $(".zzzOperator").hide();
                $(".zzzMaterial").hide();


            });

            //参数
            $("body").delegate("#zace-close-parameterList", "click", function () {

                $(".zzzTrace").show();
                $(".zzzParameter").hide();
                $(".zzzOperator").hide();
                $(".zzzMaterial").hide();
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
                    ReTypeID:1,
                    PDENo: "",
                    BatchNo: "",
                    OrderID: 0,
                    MaterialID: 0,
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
                    mMaterialID = Number(rst.MaterialID);
                    mLineID = Number(rst.LineID);
                    mStartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.StartTime));
                    mEndTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(rst.EndTime));
                    //$com.table.filterByConndition($("#femi-riskLevel-tbody"), DataAll, default_value, "ID");
                    model.com.refresh();

                }, TypeSource_Level));


            });

            //操作员查询
            $("body").delegate("#zace-search-operator", "change", function () {

                var $this = $(this),
                   value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-operatorList-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-operatorList-tbody"), OperatorAll, value, "ID");



            });

            //操作员筛选
            $("body").delegate("#zace-SearchProduct-operator", "click", function () {
                var default_value = {
                    StationID: 0,                   
                };
                $("body").append($com.modal.show(default_value, KEYWORD_LevelItem, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.StationID = Number(rst.StationID);
                    //default_value.WorkShopID = Number(rst.WorkShopID);
                    //default_value.LineID = Number(rst.LineID);

                    $com.table.filterByConndition($("#femi-operatorList-tbody"), BasicOperatorAll, default_value, "ID");
                    model.com.refresh();

                }, TypeSource_LevelItem));


            });

            //物料查询
            $("body").delegate("#zace-search-material", "change", function () {

                var $this = $(this),
                   value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-materialList-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-materialList-tbody"), MaterialAll, value, "ID");



            });

            //物料筛选
            $("body").delegate("#zace-SearchProduct-material", "click", function () {
                var default_value = {
                    BatchNo:""
                };
                $("body").append($com.modal.show(default_value, KEYWORD_LevelItem, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.BatchNo = rst.BatchNo;
                    //default_value.WorkShopID = Number(rst.WorkShopID);
                    //default_value.LineID = Number(rst.LineID);

                    $com.table.filterByConndition($("#femi-materialList-tbody"), BasicMaterialAll, default_value, "ID");
                    model.com.refresh();

                }, TypeSource_LevelItem));


            });
            //参数查询
            $("body").delegate("#zace-search-parameter", "change", function () {

                var $this = $(this),
                   value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-parameterlList-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-parameterlList-tbody"), ParameterAll, value, "ID");



            });

            //参数筛选
            $("body").delegate("#zace-SearchProduct-parameter", "click", function () {
                var default_value = {
                    ParentName: ""
                };
                $("body").append($com.modal.show(default_value, KEYWORD_LevelItem, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.ParentName = rst.ParentName;
                    //default_value.WorkShopID = Number(rst.WorkShopID);
                    //default_value.LineID = Number(rst.LineID);

                    $com.table.filterByConndition($("#femi-parameterlList-tbody"), BasicParameterAll, default_value, "ID");
                    model.com.refresh();

                }, TypeSource_LevelItem));


            });
            ////跳转事业部
            //$("body").delegate("#zace-business-level", "click", function () {
            //    var vdata = { 'header': '事业部', 'href': './factory_model/BusinessUnitSetting.html', 'id': 'BusinessUnitSetup', 'src': './static/images/menu/factoryModel/division.png' };
            //    window.parent.iframeHeaderSet(vdata);

            //});


        },




        run: function () {
            function hexify(color) {
                var values = color
                  .replace(/rgba?\(/, '')
                  .replace(/\)/, '')
                  .replace(/[\s+]/g, '')
                  .split(',');
                var a = parseFloat(values[3] || 1),
                    r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
                    g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
                    b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);
                return "#" +
                  ("0" + r.toString(16)).slice(-2) +
                  ("0" + g.toString(16)).slice(-2) +
                  ("0" + b.toString(16)).slice(-2);
            }

            var myHex = hexify('rgba(255,232,186)'); // "#f5faf3"  

            console.log(myHex);

            function hexToRgb(hex) {
                var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);   
                return result ? {       
                    r: parseInt(result[1], 16),              
                    g: parseInt(result[2], 16),       
                    b: parseInt(result[3], 16)   
                } : null;
     
            }
           // alert(hexToRgb('e8b2419e')); //e8b2419e   'rgba(232, 178, 65, 0.62)'

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
                 
                    model.com.getmaterialRecord({ material_no: "", material_name: "", type_id: 0, status: 0 }, function (resPZ) {
                        if (resPZ && resPZ.list) {
                            $.each(resPZ.list, function (i, item) {
                                TypeSource_Level.MaterialID.push({
                                    name: item.MaterialNo + "/" + item.MaterialName,
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
                                        TypeSource_LevelItem.MaterialTypeID.push({
                                            name: item.ItemName,
                                            value: item.ID,
                                        });
                                    });

                                }

                                model.com.getFMCStation({ LineID: 0 }, function (resP) {
                                    if (resP && resP.list) {
                                        $.each(resP.list, function (i, item) {
                                            TypeSource_LevelItem.StationID.push({
                                                name: item.Name,
                                                value: item.ID,
                                            });
                                        });

                                    }

                                    //mStartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', model.com.addDays(new Date(),-7));
                                    //mEndTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date());
                                    model.com.refresh();
                                });
                            });
                        });
                    });
                });
            });
             
          
        },

        com: {

            refresh: function () {

                model.com.getTraceProduct({ PDEID: 0, PDENo: mPDENo, WorkShopID: mWorkShopID, LineID: mLineID, BatchNo: mBatchNo, OrderID: mOrderID, TStart: mStartTime, TEnd: mEndTime, MaterialID: mMaterialID }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var Grade = $com.util.Clone(resP.list);
                        //所有数据
                        DATABasic = $com.util.Clone(resP.list);
                        var _list = $com.util.Clone(resP.list);
                        for (var i = 0; i < _list.length; i++) {
                            if (_list[i].Result == 0) {
                                _list[i].color = "#F44336";//#F44336  #C80000
                            }
                        }
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

                model.com.getProductAll_Material({ MaterialID: mMaterialID, MaterialNo: "", MaterialName: "", TStart: "2000-01-01", TEnd: "2000-01-01" }, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        var Grade = $com.util.Clone(resP.list);
                        //所有数据
                        DATAMaterilBasic = $com.util.Clone(resP.list);
                        var _list = $com.util.Clone(resP.list);
                        ////$.each(_list, function (i, item) {
                        ////    for (var p in item) {
                        ////        if (!FORMATTRT_Level[p])
                        ////            continue;
                        ////        item[p] = FORMATTRT_Level[p](item[p]);
                        ////    }
                        ////});
                        SearchMaterilAll = $com.util.Clone(_list);
                        $("#femi-timeTracePro-tbody").html($com.util.template(_list, HTML.TraceMode));


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
                        ////$.each(_list, function (i, item) {
                        ////    for (var p in item) {
                        ////        if (!FORMATTRT_Level[p])
                        ////            continue;
                        ////        item[p] = FORMATTRT_Level[p](item[p]);
                        ////    }
                        ////});
                        SearchReIDAll = $com.util.Clone(_list);
                        $("#femi-Restrospect-tbody").html($com.util.template(_list, HTML.RetrospectMode));



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
                        ////$.each(_list, function (i, item) {
                        ////    for (var p in item) {
                        ////        if (!FORMATTRT_Level[p])
                        ////            continue;
                        ////        item[p] = FORMATTRT_Level[p](item[p]);
                        ////    }
                        ////});
                        SearchReDeviceAll = $com.util.Clone(_list);
                        $("#femi-DeviceRestrospect-tbody").html($com.util.template(_list, HTML.RetrospectMode));



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
                        ////$.each(_list, function (i, item) {
                        ////    for (var p in item) {
                        ////        if (!FORMATTRT_Level[p])
                        ////            continue;
                        ////        item[p] = FORMATTRT_Level[p](item[p]);
                        ////    }
                        ////});
                      
                        SearchRePersonAll = $com.util.Clone(_list);
                        $("#femi-PersonRestrospect-tbody").html($com.util.template(_list, HTML.RetrospectMode));



                    }

                });
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