require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'],
    function ($lin, $com) {

        var HTML,
            orderAllList,
            orderAll,
            orderFirst,
            PartList_Basic,
            DEFAULT_VALUE_Arrange,//订单
            KETWROD_LIST_Arrange,
            KETWROD_Template_Arrange,
            Formattrt_Arrange,
            TypeSource_Arrange,

           DEFAULT_VALUE_ArrangeDetail,//订单详细
           KETWROD_LIST_ArrangeDetail,
           KETWROD_Template_ArrangeDetail,
           Formattrt_ArrangeDetail,
           TypeSource_ArrangeDetail,

           DEFAULT_VALUE_ArrangePart,//工序段
           KETWROD_LIST_ArrangePart,
           KETWROD_Template_ArrangePart,
           Formattrt_ArrangePart,
           TypeSource_ArrangePart,

            DEFAULT_VALUE_ArrangeSPart,//生成工序段
           KETWROD_LIST_ArrangeSPart,
           KETWROD_Template_ArrangeSPart,
           Formattrt_ArrangeSPart,
           TypeSource_ArrangeSPart,

           DEFAULT_VALUE_ArrangeMode,//模板
           KETWROD_LIST_ArrangeMode,
           KETWROD_Template_ArrangeMode,
           Formattrt_ArrangeMode,
           TypeSource_ArrangeMode,
           DataModeChange,
           DataModeBasic,

           DEFAULT_VALUE_ArrangeModeTask,//任务完成情况
           KETWROD_LIST_ArrangeModeTask,
           KETWROD_Template_ArrangeModeTask,
           Formattrt_ArrangeModeTask,
           TypeSource_ArrangeModeTask,

            DEFAULT_VALUE_ArrangeDevice,//设备
           KETWROD_LIST_ArrangeDevice,
           KETWROD_Template_ArrangeDevice,
           Formattrt_ArrangeDevice,
           TypeSource_ArrangeDevice,


           DEFAULT_VALUE_ArrangePoint,//工序
           KETWROD_LIST_ArrangePoint,
           KETWROD_Template_ArrangePoint,
           Formattrt_ArrangePoint,
           TypeSource_ArrangePoint,

           DEFAULT_VALUE_ArrangeSPoint,//生成工序
           KETWROD_LIST_ArrangeSPoint,
           KETWROD_Template_ArrangeSPoint,
           Formattrt_ArrangeSPoint,
           TypeSource_ArrangeSPoint,

           DataOrderAll,
           ModeAllList,
           PlanPartTemp,
           DataPointALL,
           DataPartALL,
           PartAll,
           DATAZZ,
           DATABASIC,
           mID,
           PlanPointTemp,
           DataUser;

        orderTemp = {
            WorkShopID: 1,
            LineID: 0,
            OrderNo: "",
            ProductNo: "",
        }
        PlanTimeTemp = {
            WID: 0,
            WorkShopID: 0,
            LineID: 0,
            GroupName: '',
            ZoneHours: 0,
            ShiftRatio: 0,
            Subduction: 0,
            Ratio: 0,
            OrderNo: '',
            PartID: 0,
            FQTYShift: 0,
            AlarmSecond: 0,
            IPISecond: 0
        };


        DataUser = [];
        DataOrderAll = [];
        ModeAllList = [];
        DataPointALL = [];
        DataPartALL = [];
        PartAll = [];
        Time = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date());
        ShiftID = 0;
        WorkShopID = 0;
        LineID = 0;
        HTML = {
            //订单列表
            ArrangeList: [
                '<tr>',
                '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></th>',
                //'<td style="min-width: 50px" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
                '<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
                '<td  style="min-width: 50px" data-title="WorkShopID" data-value="{{WorkShopID}}" >{{ WorkShopID}}</td>',
                '<td style="min-width: 50px" data-title="LineID" data-value="{{LineID}}" >{{ LineID}}</td>',
                '<td style="min-width: 50px" data-title="OrderNo" data-value="{{OrderNo}}" >{{ OrderNo}}</td>',
                '<td style="min-width: 50px" data-title="ProductNo" data-value="{{ProductNo}}" >{{ ProductNo}}</td>',
                '<tr>'
            ].join(""),
            //订单详细
            OrderDetailList: [
                '<tr>',
                '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></th>',
                '<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
                '<td  style="min-width: 50px" data-title="Active" data-value="{{Active}}" >{{ Active}}</td>',
                '<td style="min-width: 50px" data-title="ProductNo" data-value="{{ProductNo}}" >{{ ProductNo}}</td>',
                '<td style="min-width: 50px" data-title="LineID" data-value="{{LineID}}" >{{ LineID}}</td>',
                '<td style="min-width: 50px" data-title="PartID" data-value="{{PartID}}" >{{ PartID}}</td>',
                '<td style="min-width: 50px" data-title="MaterialNo" data-value="{{MaterialNo}}" >{{ MaterialNo}}</td>',
                '<td style="min-width: 50px" data-title="MaterialName" data-value="{{MaterialName}}" >{{ MaterialName}}</td>',
                '<td style="min-width: 50px" data-title="FQTY" data-value="{{FQTY}}" >{{ FQTY}}</td>',
                '<td style="min-width: 50px" data-title="FQTYDone" data-value="{{FQTYDone}}" >{{ FQTYDone}}</td>',
                '<td style="min-width: 50px" data-title="FQTYGood" data-value="{{FQTYGood}}" >{{ FQTYGood}}</td>',
                '<td style="min-width: 50px" data-title="FQTYShift" data-value="{{FQTYShift}}" >{{ FQTYShift}}</td>',
                '<td style="min-width: 50px" data-title="StartTime" data-value="{{StartTime}}" >{{ StartTime}}</td>',
                '<td style="min-width: 50px" data-title="FinishedTime" data-value="{{FinishedTime}}" >{{ FinishedTime}}</td>',
                '<td style="min-width: 50px" data-title="BOMNo" data-value="{{BOMNo}}" >{{ BOMNo}}</td>',
                '<td style="min-width: 50px" data-title="Creator" data-value="{{Creator}}" >{{ Creator}}</td>',
                '<td style="min-width: 50px" data-title="CreateTime" data-value="{{CreateTime}}" >{{ CreateTime}}</td>',
                '<tr>'
            ].join(""),
            //工序段查询列表
            PlanPartList: [
               '<tr>',
               '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></th>',
               '<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
               '<td  style="min-width: 50px" data-title="TaskText" data-value="{{TaskText}}" >{{ TaskText}}</td>',
               '<td style="min-width: 50px" data-title="WorkShopID" data-value="{{WorkShopID}}" >{{ WorkShopID}}</td>',
               '<td style="min-width: 50px" data-title="LineID" data-value="{{LineID}}" >{{ LineID}}</td>',
               '<td style="min-width: 50px" data-title="OrderNo" data-value="{{OrderNo}}" >{{ OrderNo}}</td>',
               '<td style="min-width: 50px" data-title="GroupName" data-value="{{GroupName}}" >{{ GroupName}}</td>',
               '<td style="min-width: 50px" data-title="ProductNo" data-value="{{ProductNo}}" >{{ ProductNo}}</td>',
               '<td style="min-width: 50px" data-title="PartID" data-value="{{PartID}}" >{{ PartID}}</td>',
               '<td style="min-width: 50px" data-title="FQTY" data-value="{{FQTY}}" >{{ FQTY}}</td>',
               '<td style="min-width: 50px" data-title="FQTYShift" data-value="{{FQTYShift}}" >{{ FQTYShift}}</td>',
               '<td style="min-width: 50px" data-title="Priority" data-value="{{Priority}}" >{{ Priority}}</td>',
               '<td style="min-width: 50px" data-title="FQTYDone" data-value="{{FQTYDone}}" >{{ FQTYDone}}</td>',
              '<td style="min-width: 50px" data-title="PartHours" data-value="{{PartHours}}" >{{ PartHours}}</td>',
              '<td style="min-width: 50px" data-title="FQTYParts" data-value="{{FQTYParts}}" >{{ FQTYParts}}</td>',
              '<td style="min-width: 50px" data-title="MaterialNo" data-value="{{MaterialNo}}" >{{ MaterialNo}}</td>',
              '<td style="min-width: 50px" data-title="MaterialName" data-value="{{MaterialName}}" >{{ MaterialName}}</td>',
               '<tr>'
            ].join(""),
            //工序查询列表
            PlanPartPointList: [
               '<tr>',
               '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></th>',
               '<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
               '<td  style="min-width: 50px" data-title="TaskText" data-value="{{TaskText}}" >{{ TaskText}}</td>',
               '<td  style="min-width: 50px" data-title="PartPointOrderID" data-value="{{PartPointOrderID}}" >{{ PartPointOrderID}}</td>',
               '<td style="min-width: 50px" data-title="WorkShopID" data-value="{{WorkShopID}}" >{{ WorkShopID}}</td>',
               '<td style="min-width: 50px" data-title="LineID" data-value="{{LineID}}" >{{ LineID}}</td>',
               '<td style="min-width: 50px" data-title="OrderNo" data-value="{{OrderNo}}" >{{ OrderNo}}</td>',
               '<td style="min-width: 50px" data-title="ProductNo" data-value="{{ProductNo}}" >{{ ProductNo}}</td>',
               '<td style="min-width: 50px" data-title="PartID" data-value="{{PartID}}" >{{PartID}}</td>',
               '<td style="min-width: 50px" data-title="PartPointID" data-value="{{PartPointID}}" >{{ PartPointID}}</td>',
               '<td style="min-width: 50px" data-title="DeviceNo" data-value="{{DeviceNo}}" >{{ DeviceNo}}</td>',
               '<td style="min-width: 50px" data-title="MaterialName" data-value="{{MaterialName}}" >{{ MaterialName}}</td>',
               '<td style="min-width: 50px" data-title="MaterialNo" data-value="{{MaterialNo}}" >{{ MaterialNo}}</td>',
              '<td style="min-width: 50px" data-title="FQTYShift" data-value="{{FQTYShift}}" >{{ FQTYShift}}</td>',
              '<td style="min-width: 50px" data-title="BGMode" data-value="{{BGMode}}" >{{ BGMode}}</td>',
              '<td style="min-width: 50px" data-title="PLMode" data-value="{{PLMode}}" >{{ PLMode}}</td>',
               '<tr>'
            ].join(""),
            //模板列表
            PlanModeList: [
              '<tr>',
              '<td style="min-width: 3px"><input type="checkbox"  checked="checked" class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></th>',
              '<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
              '<td  style="min-width: 50px" data-title="WorkShopID" data-value="{{WorkShopID}}" >{{ WorkShopID}}</td>',
              '<td  style="min-width: 50px" data-title="LineID" data-value="{{LineID}}" >{{ LineID}}</td>',
              '<td style="min-width: 50px" data-title="ProductNo" data-value="{{ProductNo}}" >{{ ProductNo}}</td>',
              '<td style="min-width: 50px" data-title="GroupName" data-value="{{GroupName}}" >{{ GroupName}}</td>',
              '<td style="min-width: 50px" data-title="PartID" data-value="{{PartID}}" >{{ PartID}}</td>',
              '<td style="min-width: 50px" data-title="FQTYSum" data-value="{{FQTYSum}}" >{{ FQTYSum}}</td>',
              '<td style="min-width: 50px" data-title="FQTYBatch" data-value="{{FQTYBatch}}" >{{FQTYBatch}}</td>',
              '<td style="min-width: 50px" data-title="PartListPartID" data-value="{{PartListPartID}}" >{{ PartListPartID}}</td>',

              '<tr>'
            ].join(""),
            //任务完成情况
            PlanPartPointTaskList: [
              '<tr>',
              '<td style="min-width: 3px"><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></th>',
              '<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
              '<td  style="min-width: 50px" data-title="TaskText" data-value="{{TaskText}}" >{{ TaskText}}</td>',
              '<td  style="min-width: 50px" data-title="TaskDate" data-value="{{TaskDate}}" >{{ TaskDate}}</td>',
              '<td style="min-width: 50px" data-title="WorkShopID" data-value="{{WorkShopID}}" >{{ WorkShopID}}</td>',
              '<td style="min-width: 50px" data-title="LineID" data-value="{{LineID}}" >{{ LineID}}</td>',
              '<td style="min-width: 50px" data-title="OrderNo" data-value="{{OrderNo}}" >{{ OrderNo}}</td>',
              '<td style="min-width: 50px" data-title="PartID" data-value="{{PartID}}" >{{PartID}}</td>',
              '<td style="min-width: 50px" data-title="PartPointID" data-value="{{PartPointID}}" >{{ PartPointID}}</td>',
              '<td style="min-width: 50px" data-title="ProductNo" data-value="{{ProductNo}}" >{{ ProductNo}}</td>',
              '<td style="min-width: 50px" data-title="DeviceNo" data-value="{{DeviceNo}}" >{{ DeviceNo}}</td>',
              '<td style="min-width: 50px" data-title="MaterialName" data-value="{{MaterialName}}" >{{ MaterialName}}</td>',
              '<td style="min-width: 50px" data-title="MaterialNo" data-value="{{MaterialNo}}" >{{ MaterialNo}}</td>',
             '<td style="min-width: 50px" data-title="FQTYShift" data-value="{{FQTYShift}}" >{{ FQTYShift}}</td>',
              '<td style="min-width: 50px" data-title="FQTYDone" data-value="{{FQTYDone}}" >{{ FQTYDone}}</td>',
              '<td style="min-width: 50px" data-title="MemberName8001" data-value="{{MemberName8001}}" >{{ MemberName8001}}</td>',
             '<td style="min-width: 50px" data-title="DepartmentID" data-value="{{DepartmentID}}" >{{ DepartmentID}}</td>',
             '<td style="min-width: 50px" data-title="BGMode" data-value="{{BGMode}}" >{{ BGMode}}</td>',
             '<td style="min-width: 50px" data-title="Status" data-value="{{Status}}" >{{ Status}}</td>',
              '<tr>'
            ].join(""),
            //生成计划(工序段)列表
            PlanPartModeList: [
              '<tr>',
              '<td style="min-width: 3px"><input type="checkbox"checked="checked"  class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></th>',
              '<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
              '<td  style="min-width: 50px" data-title="TaskText" data-value="{{TaskText}}" >{{ TaskText}}</td>',
              '<td style="min-width: 50px" data-title="WorkShopID" data-value="{{WorkShopID}}" >{{ WorkShopID}}</td>',
              '<td style="min-width: 50px" data-title="LineID" data-value="{{LineID}}" >{{ LineID}}</td>',
              '<td style="min-width: 50px" data-title="OrderNo" data-value="{{OrderNo}}" >{{ OrderNo}}</td>',
              '<td style="min-width: 50px" data-title="GroupName" data-value="{{GroupName}}" >{{ GroupName}}</td>',
              '<td style="min-width: 50px" data-title="ProductNo" data-value="{{ProductNo}}" >{{ ProductNo}}</td>',
              '<td style="min-width: 50px" data-title="PartID" data-value="{{PartID}}" >{{ PartID}}</td>',
              '<td style="min-width: 50px" data-title="FQTY" data-value="{{FQTY}}" >{{ FQTY}}</td>',
              '<td style="min-width: 50px" data-title="FQTYDone" data-value="{{FQTYDone}}" >{{ FQTYDone}}</td>',   //剩余数FQTY-FQTYDone    
               '<td style="min-width: 50px" data-title="Priority" data-value="{{Priority}}" >{{ Priority}}</td>',//累计发抖数  不知道
               '<td style="min-width: 50px" data-title="Priority" data-value="{{Priority}}" >{{ Priority}}</td>',//库存齐套装  未知
              '<td style="min-width: 50px" data-title="FQTYShift" data-value="{{FQTYShift}}" >{{ FQTYShift}}</td>',//计划加工数   
               '<td style="min-width: 50px" data-title="PartHours" data-value="{{PartHours}}" >{{ PartHours}}</td>',
             '<td style="min-width: 50px" data-title="Priority" data-value="{{Priority}}" >{{ Priority}}</td>',//在线数
             '<td style="min-width: 50px" data-title="FQTYParts" data-value="{{FQTYParts}}" >{{ FQTYParts}}</td>',
             '<td style="min-width: 50px" data-title="SubmitTime" data-value="{{SubmitTime}}" >{{ SubmitTime}}</td>',
             '<td style="min-width: 50px" data-title="MaterialNo" data-value="{{MaterialNo}}" >{{ MaterialNo}}</td>',
             '<td style="min-width: 50px" data-title="MaterialName" data-value="{{MaterialName}}" >{{ MaterialName}}</td>',
              '<tr>'
            ].join(""),
            //生成工序段列表
            PlanPartPointModeList: [
             '<tr>',
             '<td style="min-width: 3px"><input type="checkbox" checked="checked" class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></th>',
               '<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
              '<td  style="min-width: 50px" data-title="TaskText" data-value="{{TaskText}}" >{{ TaskText}}</td>',
               '<td  style="min-width: 50px" data-title="PartPointOrderID" data-value="{{PartPointOrderID}}" >{{ PartPointOrderID}}</td>',
               '<td style="min-width: 50px" data-title="WorkShopID" data-value="{{WorkShopID}}" >{{ WorkShopID}}</td>',
               '<td style="min-width: 50px" data-title="LineID" data-value="{{LineID}}" >{{ LineID}}</td>',
               '<td style="min-width: 50px" data-title="OrderNo" data-value="{{OrderNo}}" >{{ OrderNo}}</td>',
               '<td style="min-width: 50px" data-title="ProductNo" data-value="{{ProductNo}}" >{{ ProductNo}}</td>',
               '<td style="min-width: 50px" data-title="PartID" data-value="{{PartID}}" >{{PartID}}</td>',
               '<td style="min-width: 50px" data-title="PartPointID" data-value="{{PartPointID}}" >{{ PartPointID}}</td>',
               '<td style="min-width: 50px" data-title="DeviceNo" data-value="{{DeviceNo}}" >{{ DeviceNo}}</td>',
               '<td style="min-width: 50px" data-title="MaterialName" data-value="{{MaterialName}}" >{{ MaterialName}}</td>',
               '<td style="min-width: 50px" data-title="MaterialNo" data-value="{{MaterialNo}}" >{{ MaterialNo}}</td>',
              '<td style="min-width: 50px" data-title="FQTYShift" data-value="{{FQTYShift}}" >{{ FQTYShift}}</td>',
              '<td style="min-width: 50px" data-title="BGMode" data-value="{{BGMode}}" >{{ BGMode}}</td>',
              '<td style="min-width: 50px" data-title="PLMode" data-value="{{PLMode}}" >{{ PLMode}}</td>',
             '<tr>'
            ].join(""),

            PlanDeviceList: [
            '<tr>',
            '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></th>',
             '<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
             '<td style="min-width: 50px" data-title="WorkShopID" data-value="{{WorkShopID}}" >{{ WorkShopID}}</td>',
             '<td  style="min-width: 50px" data-title="LineID" data-value="{{LineID}}" >{{ LineID}}</td>',
             '<td style="min-width: 50px" data-title="PartName" data-value="{{PartName}}" >{{ PartName}}</td>',

            '<tr>'
            ].join(""),
            //空闲工时
         

        }

        //订单列表  
        $(function () {
            KETWROD_LIST_Arrange = [
                "WorkShopID|车间|ArrayOneControl",
                "LineID|产线|ArrayOneControl|WorkShopID",
            ];
            KETWROD_Template_Arrange = {};

            Formattrt_Arrange = {};

            TypeSource_Arrange = {
                WorkShopID: [{
                    name: "全部",
                    value: 0
                },
                ],
                LineID: [{
                    name: "全部",
                    value: 0,
                    far: 0,
                }
                ],
            };

            $.each(KETWROD_LIST_Arrange, function (i, item) {
                var detail = item.split("|");
                KETWROD_Template_Arrange[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_Arrange[detail[0]] = $com.util.getFormatter(TypeSource_Arrange, detail[0], detail[2]);
                }
            });
        });

        //订单详细 
        $(function () {
            KETWROD_LIST_ArrangeDetail = [
                "Active|激活|ArrayOne",
                "PartID|工序段|ArrayOne",
                 "CreateTime|创建日期|Date",
                 "StartTime|开工日期|Date",
                 "FinishedTime|完工日期|Date",
            ];
            KETWROD_Template_ArrangeDetail = {};

            Formattrt_ArrangeDetail = {};

            TypeSource_ArrangeDetail = {

                PartID: [{
                    name: "",
                    value: 0,
                    far: undefined,

                }, ],
                Active: [{
                    name: "未激活",
                    value: 0,
                },
                {
                    name: "激活",
                    value: 1,
                },

                ],
            };

            $.each(KETWROD_LIST_ArrangeDetail, function (i, item) {
                var detail = item.split("|");
                KETWROD_Template_ArrangeDetail[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_ArrangeDetail[detail[0]] = $com.util.getFormatter(TypeSource_ArrangeDetail, detail[0], detail[2]);
                }
            });
        });

        //工序段列表  
        $(function () {
            KETWROD_LIST_ArrangePart = [
                "WorkShopID|车间|ArrayOneControl",
                "LineID|产线|ArrayOneControl|WorkShopID",
                 "PartID|工序段|ArrayOne",
                 "Time|日期|Date",//SubmitTime
                 "SubmitTime|提交时间|Date",

            ];
            KETWROD_Template_ArrangePart = {};

            Formattrt_ArrangePart = {};

            TypeSource_ArrangePart = {
                WorkShopID: [{
                    name: "全部",
                    value: 0
                },
                ],
                LineID: [{
                    name: "全部",
                    value: 0,
                    far: 0,
                }
                ],
                PartID: [{
                    name: "",
                    value: 0,
                    far: undefined,
                },

                ],
            };

            $.each(KETWROD_LIST_ArrangePart, function (i, item) {
                var detail = item.split("|");
                KETWROD_Template_ArrangePart[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_ArrangePart[detail[0]] = $com.util.getFormatter(TypeSource_ArrangePart, detail[0], detail[2]);
                }
            });
        });

        //工序列表  
        $(function () {
            KETWROD_LIST_ArrangePoint = [
                "WorkShopID|车间|ArrayOneControl",
                "LineID|产线|ArrayOneControl|WorkShopID",
                "PLMode|配料模式|ArrayOne",
                "BGMode|报工模式|ArrayOne",
                "PartID|工序段|ArrayOne",
                "PartPointID|工序|ArrayOne",
                "Time|日期|Date",
            ];
            KETWROD_Template_ArrangePoint = {};

            Formattrt_ArrangePoint = {};

            TypeSource_ArrangePoint = {
                WorkShopID: [{
                    name: "全部",
                    value: 0
                },
                ],
                LineID: [{
                    name: "全部",
                    value: 0,
                    far: 0,
                }
                ],
                PartID: [{
                    name: "",
                    value: 0,
                    far: undefined,
                },

                ],
                PartPointID: [{
                    name: "",
                    value: 0,
                    far: 0,
                },
                ],
                BGMode: [{
                    name: "流转报工",
                    value: 1,
                },
               {
                   name: "自动流转",
                   value: 2,
               },
               {
                   name: "检验报工",
                   value: 3,
               },

                ],
                PLMode: [{
                    name: "",
                    value: 0,
                },
                {
                    name: "仓库配料",
                    value: 1,
                },
                {
                    name: "上道自动送料",
                    value: 2,
                },
                {
                    name: "上道人工送料",
                    value: 3,
                },



                ]
            };

            $.each(KETWROD_LIST_ArrangePoint, function (i, item) {
                var detail = item.split("|");
                KETWROD_Template_ArrangePoint[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_ArrangePoint[detail[0]] = $com.util.getFormatter(TypeSource_ArrangePoint, detail[0], detail[2]);
                }
            });
        });


        //模板设置列表  
        $(function () {
            KETWROD_LIST_ArrangeMode = [
                "WorkShopID|车间|ArrayOneControl",
                "LineID|产线|ArrayOneControl|WorkShopID",
                "PartID|工序段|ArrayOne",
                //"PartPointID|工序|ArrayOne",
                "Time|日期|Date",
            ];
            KETWROD_Template_ArrangeMode = {};

            Formattrt_ArrangeMode = {};

            TypeSource_ArrangeMode = {
                WorkShopID: [{
                    name: "全部",
                    value: 0
                },
                ],
                LineID: [{
                    name: "全部",
                    value: 0,
                    far: 0,
                }
                ],
                PartID: [{
                    name: "",
                    value: 0,
                    far: undefined,
                },

                ],

            };

            $.each(KETWROD_LIST_ArrangeMode, function (i, item) {
                var detail = item.split("|");
                KETWROD_Template_ArrangeMode[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_ArrangeMode[detail[0]] = $com.util.getFormatter(TypeSource_ArrangeMode, detail[0], detail[2]);
                }
            });
        });


        //任务完成情况 
        $(function () {
            KETWROD_LIST_ArrangeModeTask = [
                "WorkShopID|车间|ArrayOneControl",
                "LineID|产线|ArrayOneControl|WorkShopID",
                "DepartmentID|部门|ArrayOneControl",
                "PartID|工序段|ArrayOne",
                "PartPointID|工序|ArrayOne",
                "Time|日期|Date",
                "TaskDate|任务日期|Date",
                "BGMode|报工模式|ArrayOne",
                "Status|状态|ArrayOne",
            ];
            KETWROD_Template_ArrangeModeTask = {};

            Formattrt_ArrangeModeTask = {};

            TypeSource_ArrangeModeTask = {
                DepartmentID: [{
                    name: "",
                    value: 0
                }],

                WorkShopID: [{
                    name: "全部",
                    value: 0
                },
                ],
                LineID: [{
                    name: "全部",
                    value: 0,
                    far: 0,
                }
                ],
                PartID: [{
                    name: "",
                    value: 0,
                    far: undefined,
                },

                ],
                PartPointID: [{
                    name: "",
                    value: 0,
                    far: 0,
                },

                ],

                BGMode: [{
                    name: "流转报工",
                    value: 1,
                },
                {
                    name: "自动流转",
                    value: 2,
                },
                {
                    name: "检验报工",
                    value: 3,
                },

                ],
                Status: [{
                    name: "待开工",
                    value: 0,
                },
               {
                   name: "已开工",
                   value: 1,
               },

               {
                   name: "已完工",
                   value: 3,
               },

                ],

            };

            $.each(KETWROD_LIST_ArrangeModeTask, function (i, item) {
                var detail = item.split("|");
                KETWROD_Template_ArrangeModeTask[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_ArrangeModeTask[detail[0]] = $com.util.getFormatter(TypeSource_ArrangeModeTask, detail[0], detail[2]);
                }
            });
        });


        //设备
        $(function () {
            KETWROD_LIST_ArrangeDevice = [
                "WorkShopID|车间|ArrayOneControl",
                "LineID|产线|ArrayOneControl|WorkShopID",
            ];
            KETWROD_Template_ArrangeDevice = {};

            Formattrt_ArrangeDevice = {};

            TypeSource_ArrangeDevice = {

                WorkShopID: [{
                    name: "全部",
                    value: 0
                },
                ],
                LineID: [{
                    name: "全部",
                    value: 0,
                    far: 0,
                }
                ],
            };

            $.each(KETWROD_LIST_ArrangeDevice, function (i, item) {
                var detail = item.split("|");
                KETWROD_Template_ArrangeDevice[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_ArrangeDevice[detail[0]] = $com.util.getFormatter(TypeSource_ArrangeDevice, detail[0], detail[2]);
                }
            });
        });

        //生成工序段列表  
        $(function () {
            KETWROD_LIST_ArrangeSPart = [
                "FQTYShift|计划加工数",
                "Priority|在线数",
                "FQTYParts|换装时间",
                "WorkShopID|车间|ArrayOneControl",
                "LineID|产线|ArrayOneControl|WorkShopID",
                 "PartID|工序段|ArrayOne",
                 "SubmitTime|日期|Date",
            ];
            KETWROD_Template_ArrangeSPart = {};

            Formattrt_ArrangeSPart = {};

            TypeSource_ArrangeSPart = {
                WorkShopID: [{
                    name: "全部",
                    value: 0
                },
                ],
                LineID: [{
                    name: "全部",
                    value: 0,
                    far: 0,
                }
                ],
                PartID: [{
                    name: "",
                    value: 0,
                    far: undefined,
                },

                ],
            };

            $.each(KETWROD_LIST_ArrangeSPart, function (i, item) {
                var detail = item.split("|");
                KETWROD_Template_ArrangeSPart[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_ArrangeSPart[detail[0]] = $com.util.getFormatter(TypeSource_ArrangeSPart, detail[0], detail[2]);
                }
            });
        });

        //生成工序列表  
        $(function () {
            KETWROD_LIST_ArrangeSPoint = [
                "FQTYShift|计划数",
                "WorkShopID|车间|ArrayOneControl",
                "LineID|产线|ArrayOneControl|WorkShopID",
                "BGMode|报工模式|ArrayOne",
                "PLMode|配料模式|ArrayOne",
                "PartID|工序段|ArrayOne",
                "PartPointID|工序|ArrayOne",

            ];
            KETWROD_Template_ArrangeSPoint = {};

            Formattrt_ArrangeSPoint = {};

            TypeSource_ArrangeSPoint = {
                WorkShopID: [{
                    name: "全部",
                    value: 0
                },
                ],
                LineID: [{
                    name: "全部",
                    value: 0,
                    far: 0,
                }
                ],
                PartID: [{
                    name: "",
                    value: 0,
                    far: undefined,
                },

                ],
                PartPointID: [{
                    name: "",
                    value: 0,
                    far: 0,
                },
                ],
                BGMode: [
                {
                    name: "",
                    value: 0,
                },
               {
                   name: "流转报工",
                   value: 1,
               },
               {
                   name: "自动流转",
                   value: 2,
               },
               {
                   name: "检验报工",
                   value: 3,
               },

                ],
                PLMode: [{
                    name: "",
                    value: 0,
                },
                {
                    name: "仓库配料",
                    value: 1,
                },
                {
                    name: "上道自动送料",
                    value: 2,
                },
                {
                    name: "上道人工送料",
                    value: 3,
                },



                ]
            };

            $.each(KETWROD_LIST_ArrangeSPoint, function (i, item) {
                var detail = item.split("|");
                KETWROD_Template_ArrangeSPoint[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_ArrangeSPoint[detail[0]] = $com.util.getFormatter(TypeSource_ArrangeSPoint, detail[0], detail[2]);
                }
            });
        });










        model = $com.Model.create({
            name: '生产订单',

            type: $com.Model.MAIN,

            configure: function () {
                this.run();
            },

            events: function () {
                // 订单列表
                $("body").delegate("#femi-canvas-show3", "click", function () {
                    $(".zace-left").show();
                    $(".zace-leftShow").hide();
                    $(".zace-planPart").hide();
                    $(".zace-planPartPoint").hide();
                    $(".zace-orderMakeMode").hide();
                    $(".zace-orderMake").hide();
                    $(".zace-orderMakeTask").hide();
                    $(".zace-orderDevice").hide();
                    $(".zace-partAndPoint").hide();
                });
                //工序段列表
                $("body").delegate("#femi-canvas-show2", "click", function () {
                    $(".zace-left").hide();
                    $(".zace-leftShow").hide();
                    $(".zace-planPart").show();
                    $(".zace-planPartPoint").hide();
                    $(".zace-orderDevice").hide();
                    $(".zace-orderMakeMode").hide();
                    $(".zace-orderMake").hide();
                    $(".zace-orderMakeTask").hide();
                    $(".zace-partAndPoint").hide();
                });
                //工序列表
                $("body").delegate("#femi-canvas-show1", "click", function () {
                    $(".zace-left").hide();
                    $(".zace-leftShow").hide();
                    $(".zace-planPart").hide();
                    $(".zace-orderMakeMode").hide();
                    $(".zace-planPartPoint").show();
                    $(".zace-orderMake").hide();
                    $(".zace-orderDevice").hide();
                    $(".zace-orderMakeTask").hide();
                    $(".zace-partAndPoint").hide();
                });

                //所选订单集合列表
                $("body").delegate("#femi-canvas-show8", "click", function () {
                    $(".zace-left").hide();
                    $(".zace-leftShow").hide();
                    $(".zace-planPart").hide();
                    $(".zace-planPartPoint").hide();
                    $(".zace-orderMakeMode").hide();
                    $(".zace-orderMakeTask").hide();
                    $(".zace-orderDevice").hide();
                    $(".zace-orderMake").show();
                    $(".zace-partAndPoint").hide();
                });

                //模板列表
                $("body").delegate("#femi-canvas-show4", "click", function () {
                    $(".zace-left").hide();
                    $(".zace-leftShow").hide();
                    $(".zace-planPart").hide();
                    $(".zace-planPartPoint").hide();
                    $(".zace-orderMake").hide();
                    $(".zace-orderMakeMode").show();
                    $(".zace-orderMakeTask").hide();
                    $(".zace-orderDevice").hide();
                    $(".zace-partAndPoint").hide();
                });

                //任务完成情况femi-canvas-show6
                $("body").delegate("#femi-canvas-show6", "click", function () {
                    $(".zace-left").hide();
                    $(".zace-leftShow").hide();
                    $(".zace-planPart").hide();
                    $(".zace-planPartPoint").hide();
                    $(".zace-orderMake").hide();
                    $(".zace-orderMakeMode").hide();
                    $(".zace-orderMakeTask").show();
                    $(".zace-orderDevice").hide();
                    $(".zace-partAndPoint").hide();
                });
            
                //生成工序段计划
                $("body").delegate("#femi-canvas-showPart", "click", function () {

                    $(".zace-left").hide();
                    $(".zace-leftShow").hide();
                    $(".zace-planPart").hide();
                    $(".zace-planPartPoint").hide();
                    $(".zace-orderMake").hide();
                    $(".zace-orderMakeMode").hide();
                    $(".zace-orderMakeTask").hide();
                    $(".zace-partAndPoint").show();
                });
                //工序计划  
                $("body").delegate("#femi-canvas-showPartPoint", "click", function () {

                    $(".zace-left").hide();
                    $(".zace-leftShow").hide();
                    $(".zace-planPart").hide();
                    $(".zace-planPartPoint").hide();
                    $(".zace-orderMake").hide();
                    $(".zace-orderMakeMode").hide();
                    $(".zace-orderMakeTask").hide();
                    $(".zace-partAndPoint").show();
                });

                //任务完成情况查询
                $("body").delegate("#zace-search-orderTaskSearch", "click", function () {
                    var default_value = {
                        Time: $com.util.format('yyyy-MM-dd ', new Date()),
                    };
                    $("body").append($com.modal.show(default_value, KETWROD_Template_ArrangeModeTask, "查询", function (rst) {
                        if (!rst || $.isEmptyObject(rst))
                            return;

                        default_value.Time = $com.util.format('yyyy-MM-dd hh:mm:ss', rst.Time);
                        Time = default_value.Time;
                        model.com.refresh();

                    }));
                });

                //模板设置查询   zace-search-orderSearch
                $("body").delegate("#zace-search-orderSearch", "click", function () {
                    var default_value = {
                        WorkShopID: 0,
                        LineID: 0,
                        Time: $com.util.format('yyyy-MM-dd ', new Date()),
                    };
                    $("body").append($com.modal.show(default_value, KETWROD_Template_ArrangeMode, "查询", function (rst) {


                        if (!rst || $.isEmptyObject(rst))
                            return;
                        default_value.WorkShopID = rst.WorkShopID;
                        default_value.LineID = rst.LineID;
                        default_value.Time = $com.util.format('yyyy-MM-dd hh:mm:ss', rst.Time);

                        LineID = parseInt(default_value.LineID);
                        WorkShopID = parseInt(default_value.WorkShopID);
                        Time = default_value.Time;
                        model.com.refresh();

                    }, TypeSource_ArrangeMode));
                    //$(".zace-left").hide();
                    //$(".zace-leftShow").hide();
                    //$(".zace-planPart").hide();
                    //$(".zace-planPartPoint").hide();
                    //$(".zace-orderMake").hide();
                    //$(".zace-orderMakeMode").show();
                });
                //返回到订单查询
                $("body").delegate("#zace-exit-order", "click", function () {
                    $(".zace-left").show();
                    $(".zace-leftShow").hide();
                    $(".zace-planPart").hide();
                    $(".zace-planPartPoint").hide();
                    $(".zace-orderMake").hide();
                    $(".zace-orderMakeTask").hide();
                });

                //返回到订单集合
                $("body").delegate("#zace-exit-orderPlan", "click", function () {
                    $(".zace-left").hide();
                    $(".zace-leftShow").hide();
                    $(".zace-planPart").hide();
                    $(".zace-planPartPoint").hide();
                    $(".zace-orderMakeMode").hide();
                    $(".zace-orderMakeTask").hide();
                    $(".zace-orderMake").show();
                    $(".zace-partAndPoint").hide();
                });
                //订单导出
                $("body").delegate("#zace-down-schedule", "click", function () {
                    var $table = $(".zace-table-export"),
                      fileName = "订单列表.xls",
                      Title = "订单列表";
                    var params = $com.table.getExportParams($table, fileName, Title);

                    model.com.getExportExcel(params, function (res) {
                        var src = res.info.path;
                        window.open(src);
                    });


                });
                //工序段导出
                $("body").delegate("#zace-export-part", "click", function () {
                    var $table = $(".zace-export-Part"),
                      fileName = "工序段列表.xls",
                      Title = "工序段列表";
                    var params = $com.table.getExportParams($table, fileName, Title);

                    model.com.getExportExcel(params, function (res) {
                        var src = res.info.path;
                        window.open(src);
                    });


                });
                //工序导出
                $("body").delegate("#zace-export-partPoint", "click", function () {
                    var $table = $(".zace-export-partPoint"),
                      fileName = "工序列表.xls",
                      Title = "工序列表";
                    var params = $com.table.getExportParams($table, fileName, Title);

                    model.com.getExportExcel(params, function (res) {
                        var src = res.info.path;
                        window.open(src);
                    });


                });

                //工序段查询   
                $("body").delegate("#zace-search-part", "click", function () {
                    var default_value = {
                        Time: $com.util.format('yyyy-MM-dd ', new Date()),
                    };
                    $("body").append($com.modal.show(default_value, KETWROD_Template_ArrangePart, "查询", function (rst) {
                        if (!rst || $.isEmptyObject(rst))
                            return;

                        default_value.Time = $com.util.format('yyyy-MM-dd hh:mm:ss', rst.Time);
                        Time = default_value.Time;
                        model.com.refresh();

                    }));



                });

                //工序查询   
                $("body").delegate("#zace-search-partPoint", "click", function () {
                    var default_value = {
                        Time: $com.util.format('yyyy-MM-dd ', new Date()),
                    };
                    $("body").append($com.modal.show(default_value, KETWROD_Template_ArrangePoint, "查询", function (rst) {
                        if (!rst || $.isEmptyObject(rst))
                            return;

                        default_value.Time = $com.util.format('yyyy-MM-dd hh:mm:ss', rst.Time);
                        Time = default_value.Time;
                        model.com.refresh();

                    }));



                });

                //-----------订单详情-------------
                //双击
                $("body").delegate("#femi-order-tbody tr", "dblclick", function () {

                    var $this = $(this);
                    var wWorkShopID = $this.find('td[data-title=WorkShopID]').attr('data-value');
                    var wLineID = $this.find('td[data-title=LineID]').attr('data-value');
                    var wOrderNo = $this.find('td[data-title=OrderNo]').attr('data-value');
                    var wProductNo = $this.find('td[data-title=ProductNo]').attr('data-value');

                    var data = $com.util.Clone(orderAll);

                    var _list = model.com.orderList(data, wWorkShopID, wLineID, wOrderNo, wProductNo);

                    $.each(_list, function (i, item) {
                        for (var p in item) {
                            if (!Formattrt_ArrangeDetail[p])
                                continue;
                            item[p] = Formattrt_ArrangeDetail[p](item[p]);
                        }
                    });

                    for (var i = 0; i < _list.length; i++) {
                        _list[i].WID = i + 1;

                    }
                    $("#femi-orderAll-tbody").html($com.util.template(_list, HTML.OrderDetailList));

                    $(".zace-leftShow").show();
                    $(".zace-left").hide();
                    $(".zace-planPart").hide();
                    $(".zace-planPartPoint").hide();
                    $(".zace-orderMakeMode").hide();
                    $(".zace-orderMakeTask").hide();
                    $(".zace-orderDevice").hide();
                    $(".zace-partAndPoint").hide();

                });
                //返回
                $("body").delegate("#zace-search-exitPlan", "click", function () {

                    $(".zace-leftShow").hide();
                    $(".zace-left").show();
                    $(".zace-planPart").hide();
                    $(".zace-orderMake").hide();
                    $(".zace-planPartPoint").hide();
                    $(".zace-orderMakeMode").hide();
                    $(".zace-orderMakeTask").hide();
                    $(".zace-orderDevice").hide();
                    $(".zace-partAndPoint").hide();

                });

                //---------计划制定----------zace-plan-maker
                $("body").delegate("#zace-plan-maker", "click", function () {
                    var SelectData = $com.table.getSelectionData($("#femi-order-tbody"), "WID", orderAllList);
                    if (!SelectData || !SelectData.length) {
                        alert("请先选择至少一行数据再试！")
                        return;
                    }
                    $(".zace-left").hide();
                    $(".zace-leftShow").hide();
                    $(".zace-planPart").hide();
                    $(".zace-planPartPoint").hide();
                    $(".zace-orderMakeMode").hide();                   
                    $(".zace-partAndPoint").hide();
                    $(".zace-orderDevice").hide();
                    $(".zace-orderMake").show();
                    DataOrderAll = SelectData;
                    $("#femi-orderMake-tbody").html($com.util.template(SelectData, HTML.ArrangeList));

                });

                //生成计划 
                $("body").delegate("#femi-canvas-showPartPlan", "click", function () {
                    var SelectData = $com.table.getSelectionData($("#femi-orderMake-tbody"), "WID", DataOrderAll);
                    if (!SelectData || !SelectData.length) {
                        alert("请先选择至少一行数据再试！")
                        return;
                    }
                    //var SelectDataMode = $com.table.getSelectionData($("#femi-orderMakeMode-tbody"), "WID", DataModeChange);
                    //if (!SelectDataMode || !SelectDataMode.length) {
                    //    alert("请先选择模板再试！")
                    //    return;
                    //}
                    var SelectDataMode = [];

                    var data = $com.util.Clone(orderAll);
                    var orderAllList = [];
                    for (var i = 0; i < SelectData.length; i++) {

                        var _list = model.com.orderList(data, SelectData[i].WorkShopID, SelectData[i].LineID, SelectData[i].OrderNo, SelectData[i].ProductNo);
                        for (var j = 0; j < _list.length; j++) {
                            orderAllList.push(_list[j]);
                        }
                    }
                   
                    var modelAllList = model.com.modelList(SelectDataMode, DataModeBasic);
                    var partModeList = [];
                     var partPointModeList = [];

                    //生成计划
                    model.com.createPartAll({
                        data: orderAllList,
                        shift_id: ShiftID,
                        PartEntry: modelAllList,
                    }, function (resc) {
                        if (!resc)
                            return;
                        if (resc && resc.list) {
                            var  planModeList = resc.list;
                            for (var i = 0; i < planModeList.length; i++) {
                                if (planModeList[i].TaskPartList.length > 0) {
                                    for (var j = 0; j < planModeList[i].TaskPartList.length; j++) {
                                        partModeList.push(planModeList[i].TaskPartList[j]);
                                    }
                                }
                            }

                            for (var m = 0; m < partModeList.length; m++) {
                                if (partModeList[m].TaskPartPointList.length>0) {
                                    for (var i = 0; i < partModeList[m].TaskPartPointList.length; i++) {
                                        partPointModeList.push(partModeList[m].TaskPartPointList[i]);
                                    }
                                }
                            }

                            var _list = $com.util.Clone(partModeList);

                            //DataPartALLzz = $com.util.Clone(_list);

                            $.each(_list, function (i, item) {
                                for (var p in item) {
                                    if (!Formattrt_ArrangeSPart[p])
                                        continue;
                                    item[p] = Formattrt_ArrangeSPart[p](item[p]);
                                }
                            });
                            for (var i = 0; i < _list.length; i++) {
                                _list[i].WID = i + 1;
                            }
                            DataPartALL = $com.util.Clone(_list);
                            $("#femi-orderMakePlan-tbody").html($com.util.template(_list, HTML.PlanPartModeList));
                            //$("#femi-orderMakePlan-tbody").html($com.util.template(partModeList, HTML.PlanPartModeList));
                            


                            var _wlist = $com.util.Clone(partPointModeList);
                            $.each(_wlist, function (i, item) {
                                for (var p in item) {
                                    if (!Formattrt_ArrangeSPoint[p])
                                        continue;
                                    item[p] = Formattrt_ArrangeSPoint[p](item[p]);
                                }
                            });
                            for (var i = 0; i < _wlist.length; i++) {
                                _wlist[i].WID = i + 1;
                            }
                            DataPointALL = $com.util.Clone(_wlist);
                            $("#femi-orderMakePlanPartPoint-tbody").html($com.util.template(_wlist, HTML.PlanPartPointModeList));

                           // $("#femi-orderMakePlanPartPoint-tbody").html($com.util.template(partPointModeList, HTML.PlanPartPointModeList));
                        }
                    }                    
                    );

                    //check   工序段自动取消关闭工序勾选
                    var SelectDataPart = $com.table.getSelectionData($("#femi-orderMakePlan-tbody"), "WID", DataPartALL);
                    for (var i = 0; i < SelectDataPart.length; i++) {
                        for (var j = 0; j < DataPointALL.length; j++) {
                            if (SelectDataPart[i].WorkShopID == DataPointALL[j].WorkShopID
                                && SelectDataPart[i].LineID == DataPointALL[j].LineID
                                && SelectDataPart[i].ProductNo == DataPointALL[j].ProductNo
                                && SelectDataPart[i].PartID == DataPointALL[j].PartID) {



                            }
                        }
                       

                    }
                   


                    //下达计划
                    $("body").delegate("#zace-plan-orderX", "click", function () {
                        //postPartAll

                        model.com.postPartAll({
                            data: partModeList,
                            shift_id: ShiftID,
                        }, function (resPart) {
                            alert("保存成功part");
                            // model.com.refresh();
                        });

                        model.com.postPartPointAll({
                            data: partPointModeList,
                        }, function (resPoint) {

                            alert("保存成功point");
                        });

                    });
                    //$("#femi-orderMakePlan-tbody").html($com.util.template(DataPartALL, HTML.PlanPartModeList));

                    //$("#femi-orderMakePlanPartPoint-tbody").html($com.util.template(DataPointALL, HTML.PlanPartPointModeList));



                    $(".zace-left").hide();
                    $(".zace-leftShow").hide();
                    $(".zace-planPart").hide();
                    $(".zace-planPartPoint").hide();
                    $(".zace-orderMake").hide();
                    $(".zace-orderMakeMode").hide();
                    $(".zace-orderMakeTask").hide();
                    $(".zace-partAndPoint").show();
                    $(".zace-orderDevice").hide();  
                });

                


                //双击设备
                $("body").delegate("#femi-orderMakePlanPartPoint-tbody td[data-title=DeviceNo]", "dblclick", function () {

                    $(".zace-left").hide();
                    $(".zace-leftShow").hide();
                    $(".zace-planPart").hide();
                    $(".zace-planPartPoint").hide();
                    $(".zace-orderMake").hide();
                    $(".zace-orderMakeMode").hide();
                    $(".zace-orderMakeTask").hide();
                    $(".zace-partAndPoint").hide();
                    $(".zace-orderDevice").show();

                    var $this = $(this);
                    var name = $this.attr('data-value');
                    mID = $this.parent().find("td[data-title=WID]").attr("data-value");
                });
                //设备列表双击修改  工序设备
                $("body").delegate("#femi-orderDevice-tbody tr", "dblclick", function () {
                    var $this = $(this);

                    var WName = $this.find('td[data-title=PartName]').attr('data-value');

                    DataPointALL[mID - 1].DeviceNo = WName;

                    $(".zace-left").hide();
                    $(".zace-leftShow").hide();
                    $(".zace-planPart").hide();
                    $(".zace-planPartPoint").hide();
                    $(".zace-orderMake").hide();
                    $(".zace-orderMakeMode").hide();
                    $(".zace-orderMakeTask").hide();
                    $(".zace-partAndPoint").show();
                    $(".zace-orderDevice").hide();

                    $("#femi-orderMakePlanPartPoint-tbody").html($com.util.template(DataPointALL, HTML.PlanPartPointModeList));


                });

                //设备返回
                $("body").delegate("#zace-exit-orderDevice", "click", function () {
                    $(".zace-left").hide();
                    $(".zace-leftShow").hide();
                    $(".zace-planPart").hide();
                    $(".zace-planPartPoint").hide();
                    $(".zace-orderMake").hide();
                    $(".zace-orderMakeMode").hide();
                    $(".zace-orderMakeTask").hide();
                    $(".zace-orderDevice").hide();
                    $(".zace-partAndPoint").show();
                });


                //设备查询
                $("body").delegate("#zace-exit-searchDevice", "click", function () {
                    var default_value = {
                        WorkShopID: 0,
                        LineID: 0,
                    };
                    $("body").append($com.modal.show(default_value, KETWROD_Template_ArrangeDevice, "查询", function (rst) {
                        if (!rst || $.isEmptyObject(rst))
                            return;

                        default_value.WorkShopID = Number(rst.WorkShopID);
                        default_value.LineID = Number(rst.LineID);
                        $com.table.filterByConndition($("#femi-orderDevice-tbody"), DataDeviceAll, default_value, "WID");


                    }, TypeSource_ArrangeDevice));



                });



                //==================
                //修改工序列表
                $("body").delegate("#zace-edit-orderPoint", "click", function () {

                    var SelectData = $com.table.getSelectionData($("#femi-orderMakePlanPartPoint-tbody"), "WID", DataPointALL);
                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return;
                    }
                    if (SelectData.length != 1) {
                        alert("只能同时对一行数据修改！")
                        return;
                    }

                    var default_value = {
                        FQTYShift: SelectData[0].FQTYShift,
                        BGMode: SelectData[0].BGMode,
                        PLMode: SelectData[0].PLMode,
                    };
                    if (model.com.compareDate(new Date(Time), new Date())) {
                        $("body").append($com.modal.show(default_value, KETWROD_Template_ArrangeSPoint, "修改", function (rst) {
                            //调用修改函数
                            if (!rst || $.isEmptyObject(rst))
                                return;

                            SelectData[0].FQTYShift = Number(rst.FQTYShift);
                            SelectData[0].BGMode = Number(rst.BGMode);
                            SelectData[0].PLMode = Number(rst.PLMode);


                            $("#femi-orderMakePlanPartPoint-tbody").html($com.util.template(DataPointALL, HTML.PlanPartPointModeList));

                        }, TypeSource_ArrangeSPoint));
                    } else {
                        alert("操作失败");

                    }
                });
                $("body").delegate("#femi-canvas-show7", "click", function () {
                    // var vdata = { 'header': '空闲工时', 'href': './product_plan/freeTime.html', 'id': 'FreeTime', 'src': './static/images/menu/time.png' };

                    var vdata = { 'header': '空闲工时', 'href': './product_plan/freeTime.html', 'id': 'FreeTime', 'src': './static/images/menu/time.png', 'WorkShopID': WorkShopID, 'LineID': LineID, 'Time': Time };
                    window.parent.iframeHeaderSet(vdata);
                 
                });

                //修改工序段列表
                $("body").delegate("#zace-edit-orderPart", "click", function () {

                    // var SelectData = $com.table.getSelectionData($("#femi-orderMakePlan-tbody"), "WID", DataPartALL);
                    var SelectData = $com.table.getSelectionData($("#femi-orderMakePlan-tbody"), "PartID", DataPartALL);
                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return;
                    }
                    if (SelectData.length != 1) {
                        alert("只能同时对一行数据修改！")
                        return;
                    }

                    var default_value = {
                        FQTYShift: SelectData[0].FQTYShift,
                        Priority: SelectData[0].Priority,
                        FQTYParts: SelectData[0].FQTYParts,
                    };
                    if (model.com.compareDate(new Date(Time), new Date())) {
                        $("body").append($com.modal.show(default_value, KETWROD_Template_ArrangeSPart, "修改", function (rst) {
                            //调用修改函数
                            if (!rst || $.isEmptyObject(rst))
                                return;

                            SelectData[0].FQTYShift = Number(rst.FQTYShift);
                            SelectData[0].Priority = Number(rst.Priority);
                            SelectData[0].FQTYParts = Number(rst.FQTYParts);


                            $("#femi-orderMakePlan-tbody").html($com.util.template(DataPartALL, HTML.PlanPartModeList));

                        }, TypeSource_ArrangeSPart));
                    } else {
                        alert("操作失败");
                    }

                });

                //删除工序段任务
                $("body").delegate("#zace-plan-orderD", "click", function () {
                    var SelectData = $com.table.getSelectionData($("#femi-orderMakePlan-tbody"), "PartID", DATAZZ);
                    if (!SelectData || !SelectData.length) {
                        alert("请先选择至少一行数据再试！")
                        return;
                    }
                    var _list = [];
                    for (var i = 0; i < SelectData.length; i++) {
                        _list.push(DATABASIC[SelectData[i].WID - 1]);
                    }
                    if (model.com.compareDate(new Date(Time), new Date())) {
                        model.com.deletePartAll({
                            data: _list,
                            shift_id: ShiftID,

                        }, function (resz) {
                            alert("删除成功");
                            model.com.refresh();
                        });
                    } else {
                        alert("操作失败");
                    }


                });

                //查询  
                $("body").delegate("#zace-search-orderPoint", "click", function () {
                    var default_value = {
                        Time: $com.util.format('yyyy-MM-dd ', new Date()),
                    };
                    $("body").append($com.modal.show(default_value, KETWROD_Template_ArrangePoint, "查询", function (rst) {
                        if (!rst || $.isEmptyObject(rst))
                            return;

                        default_value.Time = $com.util.format('yyyy-MM-dd hh:mm:ss', rst.Time);
                        Time = default_value.Time;
                        model.com.refresh();

                    }));



                });

                //详情
                $("body").delegate("#zace-search-orderTimeDetail", "click", function () {
                    alert(1);

                    $(".zace-left").hide();
                    $(".zace-leftShow").hide();
                    $(".zace-planPart").hide();
                    $(".zace-planPartPoint").hide();
                    $(".zace-orderMake").hide();
                    $(".zace-orderMakeMode").hide();
                    $(".zace-orderMakeTask").hide();
                    $(".zace-orderDevice").hide();                 
                    $(".zace-partAndPoint").show();
                });
            },
            run: function () {
                $(".zace-orderMake").hide();
                $(".zace-leftShow").hide();
                $(".zace-planPart").hide();
                $(".zace-planPartPoint").hide();
                $(".zace-orderMakeMode").hide();
                $(".zace-orderMakeTask").hide();
                $(".zace-partAndPoint").hide();
                $(".zace-orderDevice").hide();            
                //车间产线
                model.com.getWorkShop({}, function (data) {

                    $.each(data.list, function (i, item) {
                        TypeSource_ArrangePart.WorkShopID.push({
                            name: item.WorkShopName,
                            value: item.ID,
                            far: null
                        });
                        $.each(item.LineList, function (l_i, l_item) {
                            TypeSource_ArrangePart.LineID.push({
                                name: l_item.ItemName,
                                value: l_item.ID,
                                far: item.ID
                            });
                        });
                       TypeSource_ArrangeSPart.WorkShopID = TypeSource_ArrangeSPoint.WorkShopID = TypeSource_ArrangeDevice.WorkShopID = TypeSource_ArrangeModeTask.WorkShopID = TypeSource_ArrangeMode.WorkShopID = TypeSource_ArrangePoint.WorkShopID = TypeSource_ArrangePart.WorkShopID;
                        TypeSource_ArrangeSPart.LineID = TypeSource_ArrangeSPoint.LineID = TypeSource_ArrangeDevice.LineID = TypeSource_ArrangeModeTask.LineID = TypeSource_ArrangeMode.LineID = TypeSource_ArrangePoint.LineID = TypeSource_ArrangePart.LineID;
                    });

                    model.com.getConfigAll({}, function (res) {
                        if (!res)
                            return;
                        if (res && res.list) {
                            PartAll = res.list[0].PartList;
                            $.each(res.list, function (p_i, p_item) {
                                TypeSource_ArrangeSPoint.PartID = TypeSource_ArrangeModeTask.PartID = TypeSource_ArrangeMode.PartID = TypeSource_ArrangePoint.PartID = TypeSource_ArrangeSPart.PartID = TypeSource_ArrangePart.PartID = TypeSource_ArrangeDetail.PartID = TypeSource_ArrangeDetail.PartID.concat($com.table.getTypeSource(p_item.PartList, "PartID", "PartName"));

                                $.each(p_item.PartList, function (pp_i, pp_item) {

                                    TypeSource_ArrangeSPoint.PartPointID = TypeSource_ArrangeModeTask.PartPointID = TypeSource_ArrangePoint.PartPointID = TypeSource_ArrangePoint.PartPointID.concat($com.table.getTypeSource(pp_item.PartPointList, "PartPointID", "PartPointName", undefined, "PartID"));
                                });
                            });
                            //
                            model.com.getDepartment({}, function (resu) {
                                if (!resu)
                                    return;
                                var list = resu.list,
                                    rst = [];
                                if (list) {
                                    rst = model.com.utils.getSon(list);
                                }

                                if (TypeSource_ArrangeModeTask.DepartmentID.length > 1)
                                    TypeSource_ArrangeModeTask.DepartmentID.splice(1, TypeSource_ArrangeModeTask.DepartmentID.length - 1);
                                TypeSource_ArrangeModeTask.DepartmentID = TypeSource_ArrangeModeTask.DepartmentID.concat(model.com.utils.getSource(rst));


                                model.com.getUser({}, function (resd) {
                                    if (resd && resd.list) {


                                        DataUser = $com.util.Clone(resd.list);


                                    }

                                });

                                model.com.getPartPointModeAll({ WorkShopID: 0, LineID: 0, PartID: 0 }, function (rewW) {

                                    var ww = rewW.list;
                                    ModeAllList = $com.util.Clone(ww);



                                });
                            });
                            // model.com.refresh();

                        }

                    });
                });

                model.com.getApsOrder({}, function (resOrder) {
                    if (!resOrder)
                        return;
                    if (resOrder && resOrder.list) {
                        orderAll = resOrder.list;
                        orderFirst = $com.util.Clone(resOrder.list);

                        var orderFirstz = model.com.orderFirstList(resOrder.list);
                        for (var i = 0; i < orderFirstz.length; i++) {
                            orderFirstz[i].WID = i + 1;

                        }

                        //$.each(orderFirstz, function (i, item) {
                        //    for (var p in item) {
                        //        if (!Formattrt_Arrange[p])
                        //            continue;
                        //        item[p] = Formattrt_Arrange[p](item[p]);
                        //    }
                        //});
                        orderAllList = orderFirstz;
                        $("#femi-order-tbody").html($com.util.template(orderFirstz, HTML.ArrangeList));

                    }
                    model.com.refresh();
                });

                //设备一览
                model.com.getDeviceAll({ WorkShopID: 1, LineID: 0, Module: 2001, GroupID: 1 }, function (resWD) {

                    if (!resWD)
                        return;
                    if (resWD && resWD.list) {
                        var device = resWD.list;
                        var _list = [];
                        for (var i = 0; i < device.length; i++) {
                            _list.push(device[i].PartPoint)
                        }
                        for (var j = 0; j < _list.length; j++) {
                            _list[j].WID = j + 1;

                        }
                        DataDeviceAll = $com.util.Clone(_list);
                        $.each(_list, function (i, item) {
                            for (var p in item) {
                                if (!Formattrt_ArrangeDevice[p])
                                    continue;
                                item[p] = Formattrt_ArrangeDevice[p](item[p]);
                            }
                        });

                        $("#femi-orderDevice-tbody").html($com.util.template(_list, HTML.PlanDeviceList));
                    }
                });



            },
            com: {
                refresh: function () {
                  var wTime = $com.util.format('yyyy-MM-dd', new Date(Time));
                  model.com.getShfitCur({ Time: wTime }, function (resShiftID) {

                        ShiftID = resShiftID.info;

                   
                    // ShiftID = parseInt(model.com.getshiftID(Time));
                    //alert(model.com.compareDate(new Date(Time), new Date()));
                    //工序段计划列表
                    model.com.getTaskPart({ WorkShopID: 0, LineID: 0, shift_id: ShiftID }, function (resPart) {
                        if (!resPart)
                            return;
                        if (resPart && resPart.list) {
                            DATABASIC = $com.util.Clone(resPart.list);
                            var wPartList = [];
                            wPartList = $com.util.Clone(resPart.list);
                            $.each(wPartList, function (i, item) {
                                for (var p in item) {
                                    if (!Formattrt_ArrangePart[p])
                                        continue;
                                    item[p] = Formattrt_ArrangePart[p](item[p]);
                                }
                            });

                            for (var i = 0; i < wPartList.length; i++) {
                                wPartList[i].WID = i + 1;
                            }
                            DATAZZ = $com.util.Clone(wPartList);
                            $("#femi-planPart-tbody").html($com.util.template(wPartList, HTML.PlanPartList));


                            $("#femi-orderMakePlan-tbody").html($com.util.template(wPartList, HTML.PlanPartModeList));
                        }
                    });
                    //工序计划列表
                    model.com.getTaskPointAll({ WorkShopID: 0, LineID: 0, shift_id: ShiftID }, function (resPoint) {
                        if (!resPoint)
                            return;
                        if (resPoint && resPoint.list) {
                            var wPointList = [];
                            wPointList = $com.util.Clone(resPoint.list);
                            for (var i = 0; i < wPointList.length; i++) {
                                wPointList[i].WID = i + 1;
                                wPointList[i].PLMode = 0;
                            }
                            wPointList = model.com.addPLMode(wPointList, ModeAllList);

                            $.each(wPointList, function (i, item) {
                                for (var p in item) {
                                    if (!Formattrt_ArrangePoint[p])
                                        continue;
                                    item[p] = Formattrt_ArrangePoint[p](item[p]);
                                }
                            });

                            $("#femi-planPartPoint-tbody").html($com.util.template(wPointList, HTML.PlanPartPointList));


                            $("#femi-orderMakePlanPartPoint-tbody").html($com.util.template(wPointList, HTML.PlanPartPointModeList));

                            //任务完成情况
                            model.com.getScheduleWorkerShift({ WorkShopID: 1, LineID: 0, Time: Time }, function (res) {
                                var zz = res.list;
                                var wPointTaskList = $com.util.Clone(resPoint.list);
                                wPointTaskList = model.com.AddText(wPointTaskList);

                                var modelList = model.com.createModeList(wPointTaskList, zz);

                                for (var i = 0; i < modelList.length; i++) {

                                    for (var j = 0; j < DataUser.length; j++) {
                                        if (modelList[i].MemberID8001 == DataUser[j].ID) {
                                            modelList[i].DepartmentID = DataUser[j].DepartmentID;
                                        }

                                    }

                                }
                                $.each(modelList, function (i, item) {
                                    for (var p in item) {
                                        if (!Formattrt_ArrangeModeTask[p])
                                            continue;
                                        item[p] = Formattrt_ArrangeModeTask[p](item[p]);
                                    }
                                });


                                $("#femi-orderMakeTask-tbody").html($com.util.template(modelList, HTML.PlanPartPointTaskList));
                            });
                        }
                    });



                    //模板设置
                    model.com.getVirtualAll({ WorkShopID: WorkShopID, LineID: LineID, shift_id: ShiftID }, function (rew) {

                        var ww = rew.list;
                        var _list = $com.util.Clone(ww);
                        DataModeBasic = $com.util.Clone(ww);
                        for (var i = 0; i < _list.length; i++) {
                            _list[i].WID = i + 1;
                            _list[i].PartListPartID = "";

                        }
                        DataModeChange = $com.util.Clone(_list);
                        $.each(_list, function (i, item) {
                            for (var p in item) {
                                if (!Formattrt_ArrangeMode[p])
                                    continue;
                                item[p] = Formattrt_ArrangeMode[p](item[p]);
                            }
                        });
                        for (var j = 0; j < _list.length; j++) {
                            if (_list[j].PartID == "") {
                                if (_list[j].PartList.length > 0) {
                                    _list[j].PartListPartID = _list[j].PartList[0].PartName;
                                }



                            } else {
                                _list[j].PartListPartID = _list[j].PartID;
                            }
                        }
                       

                        $("#femi-orderMakeMode-tbody").html($com.util.template(_list, HTML.PlanModeList));
                      


                    });
                  });
                },
                //根据工序段模板/产线模板生成对应计划
                createPartAll: function (data, fn, context) {
                    var d = {
                        $URI: "/APSTask/CreatePartAll",
                        $TYPE: "post"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取工序模式列表
                getPartPointModeAll: function (data, fn, context) {
                    var d = {
                        $URI: "/APSPartPointMode/All",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //机电修排班模板
                getDeviceAll: function (data, fn, context) {
                    var d = {
                        $URI: "/SchedulePosition/DeviceAll",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //保存工序段任务列表
                postPartAll: function (data, fn, context) {
                    var d = {
                        $URI: "/APSTask/SavePartAll",
                        $TYPE: "post"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //保存单个工序段任务
                postPartOne: function (data, fn, context) {
                    var d = {
                        $URI: "/APSTask/SavePart",
                        $TYPE: "post"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //保存工序任务列表
                postPartPointAll: function (data, fn, context) {
                    var d = {
                        $URI: "/APSTask/SavePartPointAll",
                        $TYPE: "post"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //删除工序段任务
                deletePart: function (data, fn, context) {
                    var d = {
                        $URI: "/APSTask/DeletePart",
                        $TYPE: "post"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //删除多条工序段任务/根据车间产线班次删除
                deletePartAll: function (data, fn, context) {
                    var d = {
                        $URI: "/APSTask/DeletePartAll",
                        $TYPE: "post"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                //时间段内班次
                getShfitAll: function (data, fn, context) {
                    var d = {
                        $URI: "/ScheduleWorker/GetShfitAll",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //根据时日期获取班次
                getShfitCur: function (data, fn, context) {
                    var d = {
                        $URI: "/ScheduleWorker/GetShfitCur",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //根据班次获取排班列表
                getScheduleWorkerShift: function (data, fn, context) {
                    var d = {
                        $URI: "/ScheduleWorker/GetByShfit",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //用户
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
                //部门
                getDepartment: function (data, fn, context) {
                    var d = {
                        $URI: "/Department/AllDepartment",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //模块
                getVirtualAll: function (data, fn, context) {
                    var d = {
                        $URI: "/APSPartEntry/VirtualAll",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                //导出
                getExportExcel: function (data, fn, context) {
                    var d = {
                        $URI: "/Upload/ExportExcel",
                        $TYPE: "post"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //Aps订单
                getApsOrder: function (data, fn, context) {
                    var d = {
                        $URI: "/APSOrder/All",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //根据班次获取工序段任务列表
                getTaskPart: function (data, fn, context) {
                    var d = {
                        $URI: "/APSTask/PartAll",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //根据班次获取工序任务列表
                getTaskPointAll: function (data, fn, context) {
                    var d = {
                        $URI: "/APSTask/PartPointAll",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //工序
                getConfigAll: function (data, fn, context) {
                    var d = {
                        $URI: "/APSLine/ConfigAll",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //车间产线
                getWorkShop: function (data, fn, context) {
                    var d = {
                        $URI: "/WorkShop/All",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //根据人员获取排班列表
                getScheduleWorkerOperator: function (data, fn, context) {
                    var d = {
                        $URI: "/ScheduleWorker/GetByOperator",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                //订单号列表
                arrayOrderNo: function (list) {
                    var arr = [];
                    $.each(list, function (i, item) {
                        arr.push(item.OrderNo);
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
                //
                orderFirstList: function (list) {
                    var OrderNoList = model.com.arrayOrderNo(list);//所有订单号

                    var _list = [];

                    for (var i = 0; i < OrderNoList.length; i++) {
                        var _temp = $com.util.Clone(orderTemp);

                        _temp.OrderNo = OrderNoList[i];
                        _list.push(_temp);
                    }

                    for (var i = 0; i < _list.length; i++) {
                        for (var j = 0; j < list.length; j++) {
                            if (_list[i].OrderNo == list[j].OrderNo) {
                                _list[i].WorkShopID = list[j].WorkShopID;
                                _list[i].LineID = list[j].LineID;
                                _list[i].ProductNo = list[j].ProductNo;
                            }
                        }

                    }


                    return _list;



                },
                modelList: function (SelectData, modelData) {
                    var _list = [];
                    for (var i = 0; i < SelectData.length; i++) {


                        for (var j = 0; j < modelData.length; j++) {
                            if (SelectData[i].WorkShopID==modelData[j].WorkShopID&&
                                SelectData[i].LineID==modelData[j].LineID&&
                                SelectData[i].PartID==modelData[j].PartID&&
                                SelectData[i].GroupName==modelData[j].GroupName                                                               
                                ) {
                                _list.push(modelData[j]);

                            }

                        }

                    }


                    return _list;

                },
                orderList: function (list, workshopID, lineID, orderNo, productNo) {

                    var _list = [];
                    for (var i = 0; i < list.length; i++) {
                        if (workshopID == list[i].WorkShopID && lineID == list[i].LineID && orderNo == list[i].OrderNo && productNo == list[i].ProductNo
                            ) {

                            _list.push(list[i]);
                        }

                    }
                    return _list;
                },
                addDays: function (date, days) {

                    if (days == undefined || days == '') {
                        days = 1;
                    }
                    var date = new Date(date);
                    date.setDate(date.getDate() + days);
                    var month = date.getMonth() + 1;
                    var day = date.getDate();
                    return date.getFullYear() + '-' + getFormatDate(month) + '-' + getFormatDate(day);


                    // 日期月份/天的显示，如果是1位数，则在前面加上'0'
                    function getFormatDate(arg) {
                        if (arg == undefined || arg == '') {
                            return '';
                        }

                        var re = arg + '';
                        if (re.length < 2) {
                            re = '0' + re;
                        }

                        return re;
                    }



                },
                //shiftID
                getshiftID: function (date) {

                    var date = new Date(date);
                    var month = date.getMonth() + 1;
                    var day = date.getDate();
                    return date.getFullYear() + getFormatDate(month) + getFormatDate(day) + '01';


                    // 日期月份/天的显示，如果是1位数，则在前面加上'0'
                    function getFormatDate(arg) {
                        if (arg == undefined || arg == '') {
                            return '';
                        }

                        var re = arg + '';
                        if (re.length < 2) {
                            re = '0' + re;
                        }

                        return re;
                    }



                },
                //秒转换成小时 分钟 秒
                Translate: function (num) {

                    var Stext;
                    var hour = 0;
                    var yhour = 0;
                    var min = 0;
                    var ymin = 0;
                    var sec = 0;

                    if (num / 3600 > 0) {
                        hour = parseInt(num / 3600);
                        yhour = num % 3600;

                    }
                    if (yhour / 60 > 0) {
                        min = parseInt(yhour / 60);
                        ymin = yhour % 60;


                    }
                    if (ymin > 0) {
                        sec = ymin;
                    }
                    function getFormatz(arg) {
                        var re = arg + '';
                        if (re.length < 2) {
                            re = '0' + re;
                        }

                        return re;
                    }
                    return getFormatz(hour) + '小时' + getFormatz(min) + '分钟' + getFormatz(sec) + '秒';

                },

                //百分比
                toPercent: function (point) {
                    if (point == 0) {
                        return 0;
                    }
                    var str = Number(point * 100).toFixed();
                    str += "%";
                    return str;
                },
                AddText: function (list) {
                    var _list = $com.util.Clone(list);
                    for (var i = 0; i < _list.length; i++) {
                        _list[i].WID = i + 1;
                        _list[i].MemberID8001 = 0;
                        _list[i].MemberName8001 = "";
                        _list[i].DepartmentID = 0;
                        _list[i].TaskDate = Time;
                    }
                    return _list;
                },
                utils: {
                    getSon: function (list) {
                        var _rst = [];
                        $.each(list, function (i, item) {
                            _rst.push(item);
                            if (item.SonList) {
                                var _arr = model.com.utils.getSon(item.SonList);
                                _rst = _rst.concat(_arr);


                            }

                        });
                        return _rst;
                    },
                    getSource: function (list) {
                        var _rst = [];
                        $.each(list, function (i, item) {
                            if (item.Active)
                                _rst.push({
                                    value: item.ID,
                                    name: item.Name,
                                    far: item.DepartmentID
                                });
                        });
                        return _rst;
                    }
                },
                //工序表 和 排班 合二为一
                createModeList: function (_list, zList) {

                    for (var j = 0; j < _list.length; j++) {
                        for (var i = 0; i < zList.length; i++) {
                            switch (zList[i].ScheduleMode) {
                                case 8001:
                                    if (_list[j].WorkShopID == zList[i].WorkShopID && _list[j].LineID == zList[i].LineID && _list[j].PartID == zList[i].PartID && _list[j].PartPointID == zList[i].PartPointID) {

                                        _list[j].MemberName8001 = zList[i].MemberName;
                                        _list[j].MemberID8001 = zList[i].MemberID;

                                    }
                                    break;
                                default:
                                    break;
                            }


                        }
                    }
                    return _list;

                },
            
                newPointList: function (list) {
                    var _list = [];
                    for (var i = 0; i < list.length; i++) {
                        for (var j = 0; j < PartAll.length; j++) {
                            if (list[i].PartID == PartAll[j].PartID) {
                                for (var m = 0; m < PartAll[j].PartPointList.length; m++) {
                                    var temp = $com.util.Clone(list[i]);
                                    temp.PartPointID = PartAll[j].PartPointList[m].PartPointID;
                                    temp.PartPointName = PartAll[j].PartPointList[m].PartPointName;

                                    _list.push(temp);

                                }


                            }

                        }

                    }
                    return _list;

                },
                //工序增加配料模式
                addPLMode: function (list, data) {
                    if (list.length < 1) {
                        return list;

                    }

                    if (data == undefined || data.length < 1) {
                        return list;

                    }

                    for (var i = 0; i < list.length; i++) {

                        for (var j = 0; j < data.length; j++) {

                            if (list[i].WorkShopID == data[j].WorkShopID &&
                                list[i].LineID == data[j].LineID &&
                                list[i].PartID == data[j].PartID &&
                                list[i].PartPointID == data[j].PartPointID &&
                                list[i].BGMode == data[j].BGMode
                                ) {
                                list[i].PLMode = data[j].PLMode;


                            }

                        }

                    }
                    return list;



                },

                compareDate: function (date1, date2) {
                    var result = false;
                    if (date1.getFullYear() > date2.getFullYear()) {
                        result = true;
                    } else if (date1.getFullYear() == date2.getFullYear()) {
                        if (date1.getMonth() > date2.getMonth()) {
                            result = true;
                        } else if (date1.getMonth() == date2.getMonth()) {
                            if (date1.getDate() >= date2.getDate()) {
                                result = true;
                            }
                        }
                    }
                    return result;
                },


            },


        });
        model.init();
    });