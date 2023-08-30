require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/timeLine'], function ($jq, $com, $timeLine) {

    var HTML,
        model,

        StartTime,
        EndTime,
        ResultList,
        ProductID,
        LineID,
        PhotoList,
        //问题项
        KEYWORD_Question_LIST,
        KEYWORD_Question,
        FORMATTRT_Question,
        TypeSource_Question,
        DEFAULT_Question,


        KEYWORD,
        KEYWORD_LIST,
        DEFAULT_VALUE,
        TypeSource,
        FORMATTRT,

        KEYWORD_Apply,
        KEYWORD_LIST_Apply,
        DEFAULT_VALUE_Apply,
        TypeSource_Apply,
        FORMATTRT_Apply,

        DataAll,
        Datatree,
        DataLevel,
        DataUser = window.parent._UserAll,
        DataActionType,
        DataExceptionType,
        DataStationType,
        TableShowData,
        timeLineShowData,
        newtimeLineShowData,

        flag = false,
        flag_deal = false,
        flag_deal_last = false,
        flag_s = false,
        flag_e = false,
        flag_l = false,
        flag_set = false,
        flag_d = false,
        flag_r = false,
        flag_m = false,
        chooseTime = {
            startTime: "",
            endTime: "",
            longerTime: ""
        },
        defaultTime = {
            startTime: "",
            endTime: ""
        };


    mStartimeZace = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date().getTime() - 1 * 30 * 24 * 3600 * 1000);
    mEndTimeZace = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date());
    mTaskID = 0;
    mbool = false;
    modelDep = {};
    modelUser = {};
    modelPlaceID = {};
    modelStation = {};
    Temp = {
        Src: '../static/images/checkbox/selected.png',
        Color: 'green',
        Status: '',
        Creator: '',
        CreateTime: '',
        Text: "",
    },
        STATUSItem = ["合格", "合格", "不合格"];

    COLOURItem = ["text-yellow", "text-blue", "text-red"];

    ActionList = ["-", "-", "-", "已收到", "-", "已处理", "已转发", "已确认", "已驳回", "已转发"];
    //  STATUS = ["默认", "已保存", "待技术中心给解决方案", "待部门处理", "待班组处理", "问题项已下发", "已自检，待互检", "已互检，待专检", "已专检"];
    STATUS = ["默认", "待处理", "待评审", "待填写", "待审批", "审批中", "问题项已下发", "待互检", "待专检", '已专检', '待确认'];
    var Result = ["默认", "不合格", "合格"],
        Saved = ["默认", "已保存", "已提交"];

    HTMLCall = {
        SUB_LIST: ['<li class="list-li zaceMater">',
            '<div class="list-group-item" data-type="{{Type}}" data-id="{{ZID}}" data-mid="{{ID}}" >',
            '<div class="list-group-item-cell item-static item-time " style="width:50%;text-align: left">',
            '<span class="zace-exc-title">{{Name}}</span>',
            '</div>',
            '<div class="list-group-item-cell item-static item-title" style="border: 1px solid #000">',
            ' <input type="number" pattern="\d*" style="padding:0  1.5vw;" placeholder="1" value="1" oninput="value=value.replace(/[^\d]/g,"")" maxlength="10" >',
            '</div>',
            '<div class="list-group-item-cell item-remove zace-removeDelete" style="width:11%">',
            '<i class="icon icon-remove zace-icon" style=""></i>',
            '</div>',
            // '<div class="list-group-item-cell item-icon" style="width:5%">',
            // '<i class="icon icon-arrow-right"></i>',
            // '</div>',
            '</div>',
            '</li>'].join(""),

        SUB_LISTDone: ['<li class="list-li zaceMater">',
            '<div class="list-group-item" data-type="{{Type}}" data-id="{{ZID}}" data-mid="{{ID}}" >',
            '<div class="list-group-item-cell item-static item-time " style="width:50%;text-align: left">',
            '<span class="zace-exc-title">{{MaterialName}}</span>',
            '</div>',
            '<div class="list-group-item-cell item-static item-title" style="border: 1px solid #000">',
            ' <input type="number"  readonly="readonly" data-value="{{Number}}" value="{{Number}}" >',
            '</div>',


            '</div>',
            '</li>'].join(""),
    },

        HTML = {

            SUB_LISTItemPShen: [
                '<ul class="call-info-lists" role="menu"aria-labelledby=""style="padding-left: 0px;display:none">',
                '<li class="call-info-item" >',
                '<div class="call-info-item-title">意见</div>',
                '<div class="call-info-item-all">{{RemarkZace}}</div>',
                '</li>',

                '<li class="call-info-item" >',
                '<div class="call-info-item-title">照片</div>',
                '<div class="call-info-item-image">',
                '{{IMGZace}}',
                '</div>',
                '</li>',
                '</ul>'
            ].join(""),


            Descfirst: [
                '<div class="D-panel">',
                '<div id="mLeft_moudle" style="width: 26px; float: left;margin-left: 30px;clear: both;">',
                // '<div style="width: 2px;height: 40px;background-color:green;margin-left: 12px;" id="first_moudle"></div>',  
                '<img src="{{Src}}" alt="" style="width: 25px;height: 25px;" id="img_moudle">',
                '<div style="width: 2px;height: 80px;background-color:{{Color}};margin-left: 12px;"id="second_module"></div>',
                '</div>',
                '<div id="mRight_moudleOne" style="width: 280px;float: left;margin-left: 70px;margin-top: -100px;">',
                '<div id="status_moudle">{{Status}}</div>',
                '<div id="personnel_moudle" style="margin-left: -5px;">{{Creator}}</div>',
                '<div id="time_moudle">{{CreateTime}}</div>',
                '<div id="text-module">{{Text}}</div>',
                '</div>',
                '</div>'

            ].join(""),
            DescSecond: [
                '<div class="D-panel">',
                '<div id="mLeft_moudle" style="width: 26px; float: left;margin-left: 30px;clear: both;">',
                // '<div style="width: 2px;height: 10px;background-color:{{Color}};margin-left: 12px;" id="first_moudle"></div>',
                '<img src="{{Src}}" alt="" style="width: 25px;height: 25px;" id="img_moudle">',
                //'<div style="width: 2px;height: 80px;background-color:{{Color}};margin-left: 12px;"id="second_module"></div>',
                '</div>',
                '<div id="mRight_moudleOne" style="width: 280px;float: left;margin-left: 70px;margin-top: -20px;">',
                '<div id="status_moudle">{{Status}}</div>',
                '<div id="personnel_moudle" style="margin-left: -5px;">{{Creator}}</div>',
                '<div id="time_moudle">{{CreateTime}}</div>',
                '<div id="text-module">{{Text}}</div>',
                '</div>',
                '</div>',

            ].join(""),
            module: [
                '<div id="mLeft_moudle" style="width: 26px; float: left;margin-left: 30px;clear: both;">',
                // '<div style="width: 2px;height: 40px;background-color:green;margin-left: 12px;" id="first_moudle"></div>',
                '<img src="../static/images/checkbox/selected.png" alt="" style="width: 25px;height: 25px;" id="img_moudle">',
                '<div style="width: 2px;height: 80px;background-color:green;margin-left: 12px;"id="second_moudle"></div>',
                '</div>',
                '<div id="mRight_moudleOne" style="width: 300px;float: left;margin-left: 70px;margin-top: -100px;">',
                '<div id="status_moudle">{{Status}}</div>',
                '<div id="personnel_moudle">{{Creator}}</div>',
                '<div id="time_moudle">{{CreateTime}}</div>',
                '</div>'
            ].join(""),
            moduleSecond: [
                '<div id="mLeft_moudle" style="width: 26px; float: left;margin-left: 30px;clear: both;">',
                //'<div style="width: 2px;height: 20px;background-color:green;margin-left: 12px;" id="first_moudle-second"></div>',
                '<img src="../static/images/checkbox/selected.png" alt="" style="width: 25px;height: 25px;" id="img_moudle-second">',
                '<div style="width: 2px;height: 80px;background-color:green;margin-left: 12px;"id="second_moudle-second"></div>',
                '</div>',
                '<div id="mRight_moudleOne" style="width: 300px;float: left;margin-left: 70px;margin-top: -100px;">',
                '<div id="status_moudle">{{Status}}</div>',
                '<div id="personnel_moudle">{{Creator}}</div>',
                '<div id="time_moudle">{{CreateTime}}</div>',
                '</div>'
            ].join(""),
            ApplyCost: [
                '<tr data-color="">',
                '<td style="width: 3px"><input type="checkbox"',
                '	class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td style="min-width: 50px" data-title="Position" data-value="{{Position}}">{{Position}}</td> ',
                '<td style="min-width: 50px" data-title="People" data-value="{{People}}">{{People}}</td>  ',
                '<td style="min-width: 50px" data-title="Time" data-value="{{Time}}"  >{{Time}}</td>  ',
                '</tr>',
            ].join(""),

            QuestionItems11: [
                '<tr data-color="" >',
                '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td  data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
                '<td style="min-width: 50px" data-title="IPTItemName" data-value="{{IPTItemName}}">{{IPTItemName}}</td> ',
                '<td style="min-width: 50px" data-title="LineName" data-value="{{LineName}}">{{LineName}}</td>  ',
                '<td style="min-width: 50px" data-title="CustomName" data-value="{{CustomName}}">{{CustomName}}</td>  ',
                '<td style="min-width: 50px" data-title="CarNumber" data-value="{{CarNumber}}">{{CarNumber}}</td>  ',
                '<td style="min-width: 50px" data-title="ProductNo" data-value="{{ProductNo}}"  >{{ProductNo}}</td>  ',
                '<td style="min-width: 50px" data-title="Status" data-value="{{Status}}"  >{{Status}}</td>  ',
                '<td style="min-width: 50px" data-title="PreCheckName" data-value="{{PreCheckName}}">{{PreCheckName}}</td>  ',
                '<td style="min-width: 80px" data-title="PreCheckTime" data-value="{{PreCheckTime}}">{{PreCheckTime}}</td>  ',
                '</tr>',
            ].join(""),
            QuestionItems: [
                '<tr data-color="" >',
                '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td  data-title="ID" data-value="{{ID}}" >{{ID}}</td>',

                '<td style="min-width: 50px" data-title="LineName" data-value="{{LineName}}">{{LineName}}</td>  ',
                '<td style="min-width: 50px" data-title="CustomName" data-value="{{CustomName}}">{{CustomName}}</td>  ',
                '<td style="min-width: 50px" data-title="ProductNo" data-value="{{ProductNo}}"  >{{ProductNo}}</td>  ',
                '<td style="min-width: 50px" data-title="CarNumber" data-value="{{CarNumber}}">{{CarNumber}}</td>  ',

                // '<td style="min-width: 50px" data-title="IPTItemName" data-value="{{IPTItemName}}">{{IPTItemName}}</td> ',
                '<td data-title="FirstItemName" data-value="{{FirstItemName}}" >{{FirstItemName}}</td>',
                '<td data-title="SeconfItemName" data-value="{{SeconfItemName}}" >{{SeconfItemName}}</td>',
                '<td data-title="ThirdItemName" data-value="{{ThirdItemName}}" >{{ThirdItemName}}</td>',
                '<td data-title="FourItemName" data-value="{{FourItemName}}" >{{FourItemName}}</td>',
                '<td data-title="FiveItemName" data-value="{{FiveItemName}}" >{{FiveItemName}}</td>',
                '<td style="min-width: 50px" data-title="Status" data-value="{{Status}}"  >{{Status}}</td>  ',
                '<td style="min-width: 50px" data-title="PreCheckName" data-value="{{PreCheckName}}">{{PreCheckName}}</td>  ',
                '<td style="min-width: 80px" data-title="PreCheckTime" data-value="{{PreCheckTime}}">{{PreCheckTime}}</td>  ',
                '</tr>',
            ].join(""),
            TableLinePoint: [
                '<tr data-color="{{Color}}" style="" >',
                '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></td>',
                '<td style="min-width: 50px" data-title="Status" data-value="{{Status}}">{{Status}}</td>',
                '<td style="min-width: 50px" data-title="Creator" data-value="{{Creator}}">{{Creator}}</td> ',
                '<td style="min-width: 50px" data-title="CreateTime" data-value="{{CreateTime}}">{{CreateTime}}</td>  ',
                '</tr>',
            ].join(""),

            SolveInfo: [
                '<div class="call-info-header">',
                '<p class="lmvt-myself">处理信息</p>',
                ' </div>',

                '  <div class="call-info-all">',
                '  {{DealMessage}}',
                '   </div>',
            ].join(""),

            SolveInfoConfirm: [
                '<div class="call-info-header">',
                '<p class="lmvt-myself">确认信息</p>',
                ' </div>',

                '  <div class="call-info-all">',
                '  {{DealMessage}}',
                '   </div>',
            ].join(""),

            SolveInfoCheck: [
                '<div class="call-info-header">',
                '<p class="lmvt-myself">检验记录</p>',
                ' </div>',

                '  <div class="call-info-all">',
                '  {{DealMessage}}',
                '   </div>',
            ].join(""),
            DealItemNodeCon: [
                '<li class="deal-info-items">',
                '<div class="deal-info-items-list">',
                '<div class="deal-info-type" style="width:40%"><span>{{ItemType}}</span></div>',
                '<div class="deal-info-time"><span>{{CreateTime}}</span></div>',
                '<div class="deal-info-operator"><span>{{Operator}}</span></div>',
                // '<div class="deal-info-icon" id="deal-firstDown"><span class="icon icon-right deal-firstDown" data-value="deal-info-items-first-down{{DealID}}"style="background:url(../static/images/icon-right.png) no-repeat center"></span></div>',
                // '</div>',
                // '{{SonList}}',
                '</li>',
            ].join(""),

            CallItemNode: [
                '<li class="call-info-items a"data-type="{{type}}">',
                '<div class="call-info-items-list">',
                '<div class="call-info-time"><span>{{CreateTime}}</span></div>',
                '<div class="call-info-actiontype"><span>{{ActionType}}</span></div>',
                '<div class="call-info-operator"><span>{{Operator}}</span></div>',
                '<div type="button" class="btn dropdown-toggle"data-toggle="dropdown"data-type="{{type}}"data-dis="{{DisID}}"data-act="{{ActionID}}">',
                '<span class="icon icon-right "id="call-info-list"style="background:url(../static/images/icon-right.png) no-repeat center">',
                '</span>',
                '</div>',
                '</div>',
                '<ul id="" class="deal-info-items-last-down deal-info-items-last-down{{ActionID}} showcall-{{type}}"data-ctype="showcall-{{type}}">',
                '</ul>',
                '</li>',
            ].join(""),
            DealItemNode: [
                '<li class="deal-info-items">',
                '<div class="deal-info-items-list">',
                '<div class="deal-info-type" style="width:40%"><span>{{ItemType}}</span></div>',
                '<div class="deal-info-time"><span>{{CreateTime}}</span></div>',
                '<div class="deal-info-operator"><span>{{Operator}}</span></div>',
                '<div class="deal-info-icon" id="deal-firstDown"><span class="icon icon-right deal-firstDown" data-value="deal-info-items-first-down{{DealID}}"style="background:url(../static/images/icon-right.png) no-repeat center"></span></div>',
                '</div>',
                '{{SonList}}',
                '</li>',
            ].join(""),
            DealItemNodeMessage:[
                '<li class="deal-info-items">',
                '<div class="deal-info-items-list">',
                '<div class="deal-info-type" style="width:40%"><span>{{ItemType}}</span></div>',
                '<div class="deal-info-time"><span>{{CreateTime}}</span></div>',
                '<div class="deal-info-operator"><span>{{Operator}}</span></div>',
                // '<div class="deal-info-icon" id="deal-firstDown"><span class="icon icon-right deal-firstDown" data-value="deal-info-items-first-down{{DealID}}"style="background:url(../static/images/icon-right.png) no-repeat center"></span></div>',
                // '</div>',
                // '{{SonList}}',
                '</li>',
            ].join(""),
            NowTemplateSolve: [
                //'<div class="call-info-item-all">名称：{{Name}}</div>',
                //'<div class="call-info-item-all">描述：{{Value}}</div>',
                '<ul class="call-info-lists" role="menu"aria-labelledby=""style="padding-left: 0px;display:none">',
                '<li class="call-info-item">',
                '<div class="call-info-item-title">名称</div>',
                '<div class="call-info-item-all">{{Name}}</div>',
                '</li>',
                '<li class="call-info-item">',
                '<div class="call-info-item-title">描述</div>',
                '<div class="call-info-item-all">{{Detail}}</div>',
                '</li>',
                '</ul>',
            ].join(""),
            DeTemplatePerson: [
                '<div class="call-info-item-all">{{Name}}</div>',
            ].join(""),
            NowTemplate: [
                '<ul class="call-info-lists" role="menu"aria-labelledby=""style="padding-left: 0px;display:none">',
                '<li class="call-info-item">',

                '<li class="call-info-item">',
                '<div class="call-info-item-title">解决方案</div>',
                '<div class="call-info-item-all">{{Solve}}</div>',
                '</li>',
                '<li class="call-info-item">',
                '<div class="call-info-item-title">照片</div>',
                '<div class="call-info-item-all">{{SolveImg}}</div>',
                '</li>',
              
                '<li class="call-info-item">',
                '<div class="call-info-item-title">执行工位</div>',
                '<div class="call-info-item-all">{{DoStationName}}</div>',
                '</li>',

                '<li class="call-info-item">',
                '<div class="call-info-item-title">确认人</div>',
                '<div class="call-info-item-all">{{Person}}</div>',
                '</li>',


                '</ul>',
            ].join(""),
            DeTemplate: [
                '<ul class="call-info-lists" role="menu"aria-labelledby=""style="padding-left: 0px">',
                '<li class="call-info-item">',
                '<div class="call-info-item-title">执行工位</div>',
                '<div class="call-info-item-all">{{DoStationName}}</div>',
                '</li>',
                '<li class="call-info-item">',
                '<div class="call-info-item-title">执行工序</div>',
                '<div class="call-info-item-all">{{DoPartPointName}}</div>',
                '</li>',
                '<li class="call-info-item">',
                '<div class="call-info-item-title">执行班组</div>',
                '<div class="call-info-item-all">{{DoClassName}}</div>',
                '</li>',
                '<li class="call-info-item">',
                '<div class="call-info-item-title">执行人</div>',
                '<div class="call-info-item-all">{{DoPersonName}}</div>',
                '</li>',
                '<li class="call-info-item">',
                '<div class="call-info-item-title">通知人员</div>',
                '<div class="call-info-item-all">{{Person}}</div>',
                '</li>',
                '</ul>',
            ].join(""),
            SelfTemplate: [
                '<ul class="call-info-lists" role="menu"aria-labelledby=""style="padding-left: 0px;display:none">',

                '<li class="call-info-item" style="display:{{IsPictureShow}}">',
                '<div class="call-info-item-title">图例</div>',
                '<div class="call-info-item-all">{{ImagesZace}}</div>',
                '</li>',

                '<li class="call-info-item">',
                '<div class="call-info-item-title">预检结果</div>',
                '<div class="call-info-item-all">{{resultText}}</div>',
                '</li>',

                '<li class="call-info-item" style="display:{{FFDisplay}}">',
                '<div class="call-info-item-title">厂家</div>',
                '<div class="call-info-item-all">{{Manufactor}}</div>',
                '</li>',

                '<li class="call-info-item" style="display:{{MoDisplay}}">',
                '<div class="call-info-item-title">型号</div>',
                '<div class="call-info-item-all">{{Modal}}</div>',
                '</li>',

                '<li class="call-info-item" style="display:{{BBDisplay}}">',
                '<div class="call-info-item-title">编号</div>',
                '<div class="call-info-item-all">{{Number}}</div>',
                '</li>',


                '<li class="call-info-item" style="display:{{IsDisplay}}">',
                '<div class="call-info-item-title">实际值</div>',
                '<div class="call-info-item-all">{{Value}}</div>',
                '</li>',
                // '<li class="call-info-item">',
                // '<div class="call-info-item-title">预检状态</div>',
                // '<div class="call-info-item-all">{{Status}}</div>',
                // '</li>',
                '<li class="call-info-item" style="display:{{TTDisplay}}">',
                '<div class="call-info-item-title">备注</div>',
                '<div class="call-info-item-all">{{Remark}}</div>',
                '</li>',

                '<li class="call-info-item" style="display:{{Display}}">',
                '<div class="call-info-item-title">照片</div>',
                '<div class="call-info-item-image">',
                '{{IMG}}',
                '</div>',
                //'<img src="/upload/{{ImageList}}" alt="" class="image-show" data-source="{{ImageList}}" />',
                //'<img src="/upload/{{ImageList}}" alt=""class="image-show"data-source="{{ImageList}}" />',
                '</li>',

                '<li class="call-info-item" >',
                '<div class="call-info-item-title">物料',
                '<span  style="margin-left: 40%;">数量 </span>',
                '</div>',
                '<div class="call-info-item-all">',
                '<ul class="list-li ">',
                '{{MaterialText}}',
                '</ul>',
                '</div>',
                '</li>',

                '</ul>',
            ].join(""),
            IMG: [
                '<img src="{{imageList}}" alt="" class="image-show" data-source="{{imageList}}" data-value="{{Type}}" />'
            ].join(""),
            MySelfTemplate: [
                '<ul class="call-info-lists" role="menu"aria-labelledby=""style="padding-left: 0px;display:none">',
                '<li class="call-info-item">',
                '<div class="call-info-item-title">自检结果</div>',
                '<div class="call-info-item-all">{{Result}}</div>',
                '</li>',
                '<li class="call-info-item">',
                '<div class="call-info-item-title">实际值</div>',
                '<div class="call-info-item-all">{{Value}}</div>',
                '</li>',
                // '<li class="call-info-item">',
                // '<div class="call-info-item-title">自检状态</div>',
                // '<div class="call-info-item-all">{{Status}}</div>',
                // '</li>',
                '<li class="call-info-item">',
                '<div class="call-info-item-title">备注</div>',
                '<div class="call-info-item-all">{{Remark}}</div>',
                '</li>',
                '<li class="call-info-item">',
                '<div class="call-info-item-title">照片</div>',
                '<div class="call-info-item-image">',
                '{{IMG}}',
                '</div>',
                //'<img src="/upload/{{ImageList}}" alt="" class="image-show" data-source="{{ImageList}}" />',
                //'<img src="/upload/{{ImageList}}" alt=""class="image-show"data-source="{{ImageList}}" />',
                '</li>',
                '</ul>',
            ].join(""),
            OurTemplate: [
                '<ul class="call-info-lists" role="menu"aria-labelledby=""style="padding-left: 0px;display:none">',
                '<li class="call-info-item">',
                '<div class="call-info-item-title">互检结果</div>',
                '<div class="call-info-item-all">{{Result}}</div>',
                '</li>',
                '<li class="call-info-item">',
                '<div class="call-info-item-title">实际值</div>',
                '<div class="call-info-item-all">{{Value}}</div>',
                '</li>',
                // '<li class="call-info-item">',
                // '<div class="call-info-item-title">互检状态</div>',
                // '<div class="call-info-item-all">{{Status}}</div>',
                // '</li>',
                '<li class="call-info-item">',
                '<div class="call-info-item-title">备注</div>',
                '<div class="call-info-item-all">{{Remark}}</div>',
                '</li>',
                '<li class="call-info-item">',
                '<div class="call-info-item-title">照片</div>',
                '<div class="call-info-item-image">',
                '{{IMG}}',
                '</div>',
                //'<img src="/upload/{{ImageList}}" alt="" class="image-show" data-source="{{ImageList}}" />',
                //'<img src="/upload/{{ImageList}}" alt=""class="image-show"data-source="{{ImageList}}" />',
                '</li>',
                '</ul>',
            ].join(""),
            ConcentrateTemplate: [
                '<ul class="call-info-lists" role="menu"aria-labelledby=""style="padding-left: 0px;display:none">',
                '<li class="call-info-item">',
                '<div class="call-info-item-title">专检结果</div>',
                '<div class="call-info-item-all">{{Result}}</div>',
                '</li>',
                '<li class="call-info-item">',
                '<div class="call-info-item-title">实际值</div>',
                '<div class="call-info-item-all">{{Value}}</div>',
                '</li>',
                // '<li class="call-info-item">',
                // '<div class="call-info-item-title">专检状态</div>',
                // '<div class="call-info-item-all">{{Status}}</div>',
                // '</li>',
                '<li class="call-info-item">',
                '<div class="call-info-item-title">备注</div>',
                '<div class="call-info-item-all">{{Remark}}</div>',
                '</li>',
                '<li class="call-info-item">',
                '<div class="call-info-item-title">照片</div>',
                '<div class="call-info-item-image">',
                '{{IMG}}',
                '</div>',
                //'<img src="/upload/{{ImageList}}" alt="" class="image-show" data-source="{{ImageList}}" />',
                //'<img src="/upload/{{ImageList}}" alt=""class="image-show"data-source="{{ImageList}}" />',
                '</li>',
                '</ul>',
            ].join(""),
            ZaceCallInfoItemNode: [
                '<ul class="call-info-lists" role="menu"aria-labelledby=""style="padding-left: 0px">',
                '<li class="call-info-item">',
                '<div class="call-info-item-title">被转发人</div>',
                '<div class="call-info-item-all">{{ForwarderName}}</div>',
                '</li>',
                '<li class="call-info-item">',
                '<div class="call-info-item-title">内容备注</div>',
                '<div class="call-info-item-all">{{CancelComment}}</div>',
                '</li>',
                '<li class="call-info-item">',
                '<div class="call-info-item-title">照片</div>',
                '<div class="call-info-item-image-cancel">',
                '</div>',
                //'<img src="/upload/{{CancelImageList}}" alt="" class="image-show"data-source="{{CancelImageList}}"/>',
                '</li>',
                '</ul>',
            ].join(""),
            CallInfoItemNode: [
                '<ul class="call-info-lists" role="menu"aria-labelledby=""style="padding-left: 0px">',
                '<li class="call-info-item">',
                '<div class="call-info-item-title">内容备注</div>',
                '<div class="call-info-item-all">{{CancelComment}}</div>',
                '</li>',
                '<li class="call-info-item">',
                '<div class="call-info-item-title">照片</div>',
                '<div class="call-info-item-image-cancel">',
                '</div>',
                //'<img src="/upload/{{CancelImageList}}" alt="" class="image-show"data-source="{{CancelImageList}}"/>',
                '</li>',
                '</ul>',
            ].join(""),
            Photo: [
                '<div class="lmvt-show-photo" style="position: fixed;z-index: 2001;top: 0;right: 0;left: 0;bottom: 0;background: rgba(0, 0, 0, 0.5);text-align: center">',
                '<svg t="1562913698052" class="lmvt-remove-photo" style="position:absolute;top:10;right:10" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2620" width="50" height="50"><path d="M684.642617 277.598412l-1.436722-1.467421c-12.489452-12.461823-32.730449-12.461823-45.159526 0L479.700991 434.510138l-158.286026-158.315702c-12.555967-12.524245-32.793894-12.524245-45.225017 0-12.555967 12.462846-12.555967 32.701796 0 45.223994l158.348448 158.317749L276.129573 638.049834c-12.495592 12.429077-12.495592 32.671097 0 45.163619l1.49812 1.434675c12.429077 12.494569 32.66905 12.494569 45.221948 0l158.287049-158.286026 158.283979 158.286026c12.491499 12.494569 32.731472 12.494569 45.220924 0 12.495592-12.493545 12.495592-32.731472 0-45.222971l-158.285003-158.285003 158.285003-158.314679C697.138209 310.299185 697.138209 290.060235 684.642617 277.598412" p-id="2621" fill="#e6e6e6"></path><path d="M818.88197 140.522454c-187.332573-187.363272-491.033479-187.363272-678.364005 0-187.329503 187.329503-187.329503 491.032456 0 678.362982 187.330526 187.392948 491.031433 187.392948 678.364005 0C1006.274918 631.55491 1006.274918 327.851956 818.88197 140.522454M773.656953 773.660418c-162.344458 162.343435-425.569512 162.407903-587.914994 0-162.40688-162.344458-162.40688-425.602258 0-587.914994 162.344458-162.40688 425.569512-162.40688 587.914994 0C936.063833 348.059184 936.000388 611.31596 773.656953 773.660418" p-id="2622" fill="#e6e6e6"></path></svg>',
                '<div data-index="0" class="lmvt-change-photo" style="position: fixed;top: 60px;right: 60px;left: 60px;bottom: 60px;background-size:100% 100%;width: auto;height: auto;">',
                // '<img class="zacelmvt-img" style="position: fixed;top: 60px;right: 60px;left: 60px;bottom: 60px;background-size:auto 100%;width: auto;height: auto;" />',
                '</div>',
                '<div class="lmvt-bottom">',
                '<div class="lmvt-bottom-left">',
                '<svg t="1562913570901" class="icon" style="float:left;margin-left:10px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1103" width="30" height="30">',
                '<path d="M512 0a512 512 0 1 0 512 512 512 512 0 0 0-512-512z m0 896a384 384 0 1 1 384-384 384 384 0 0 1-384 384z" fill="#e6e6e6" p-id="1104"></path>',
                '<path d="M493.44 247.04a64 64 0 0 0-90.88 90.88L576 512l-173.44 174.08a64 64 0 0 0 90.88 90.88l219.52-219.52a64 64 0 0 0 0-90.88z" fill="#e6e6e6" p-id="1105"></path></svg>',
                '</div>',
                '<div class="lmvt-bottom-right">',
                '<svg t="1562912869524" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" ',
                ' p-id="1469" width="30" style="float:right;margin-right:10px" height="30"><path d="M512 0a512 512 0 1 0 512 512 512 512 0 0 0-512-512z m0 896a384 384 0 1 1 384-384 384 384 0 0 1-384 384z" ',
                ' fill="#e6e6e6" p-id="1470"></path><path d="M616.96 272.64a58.24 58.24 0 0 0-81.92 0l-198.4 198.4a58.88 58.88 0 0 0 0 81.92l198.4 198.4a58.24 58.24 0 1 0 81.92-81.92L459.52 512l157.44-157.44a58.24 58.24 0 0 0 0-81.92z" fill="#e6e6e6" p-id="1471"></path></svg>',
                '</div>',
                '</div>',
                '</div>',
            ].join(""),
            img: [
                '<img class="zacelmvt-img" />'
            ].join(""),

        };

    var DisplayBoardType = [
        {
            name: "否",
            value: 0,
        },
        {
            name: "是",
            value: 1,
        }];

    (function () {
        KEYWORD_LIST = [
            "StartTime|开始时间|Date",
            "EndTime|结束时间|Date",
            "CreateTime|时间|DateTime",
            "EditTime|时间|DateTime",
            "LastTime|时间|DateTime",
            "Time|时间|DateTime",
        ];

        FORMATTRT = {};
        KEYWORD = {};
        TypeSource = {};

        $.each(KEYWORD_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT[detail[0]] = $com.util.getFormatter(TypeSource, detail[0], detail[2]);
            }

        });
    })();
    (function () {
        KEYWORD_Question_LIST = [
            "ProductNo|车型|ArrayOne",
            "LineID|修程|ArrayOne",
            "StartTime|开始时间|DateTime",
            "EndTime|结束时间|DateTime",
        ];
        KEYWORD_Question = {};
        FORMATTRT_Question = {};

        DEFAULT_Question = {

        };

        TypeSource_Question = {

            ProductNo: [
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
            ]
        };

        $.each(KEYWORD_Question_LIST, function (x, item1) {
            var detail = item1.split("|");
            KEYWORD_Question[detail[0]] = {
                index: x,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_Question[detail[0]] = $com.util.getFormatter(TypeSource_Question, detail[0], detail[2]);
            }
        });
    })();

    model = $com.Model.create({
        name: 'iPlant.MES',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();
        },
        events: function () {
            //呼叫展开详情
            $("body").delegate(".a", "click", function () {
                //判断显示哪个下拉列表
                var faTherclass = $(this).parents(".call-info-all");
                //显示呼叫信息的列表
                if (faTherclass.length == 1) {
                    //判断是否显示下拉框
                    if (flag == false) {
                        $(this).find("#call-info-list").css("background", "url(../static/images/icon-down.png) no-repeat center");
                        var type = $(this).attr("data-type");
                        //判断显示的是task还是cancel的下拉框
                        if (type == "task") {
                            var $class = $(this).children(".showcall-task").attr("data-ctype");
                            var $that = $(this);
                            model.com.refreshTaskInfoData($class, $that);
                            $("." + $class).show();
                        } else if (type == "cancel") {
                            var $that = $(this);
                            var $class = $(this).children(".showcall-cancel").attr("data-ctype");
                            model.com.refreshCallInfoData($class, $that);
                            //$(this).children("ul").show();
                            $("." + $class).show();
                        }
                        flag = true;
                    }
                    else if (flag == true) {
                        $(this).find("#call-info-list").css("background", "url(../static/images/icon-right.png) no-repeat center");
                        $(this).children(".showcall-task").hide();
                        $(this).children(".showcall-cancel").hide();
                        flag = false;
                    }
                }
                //处理信息操作详情（二层）
                else {
                    var $d_id = $(this).find("#call-info-list").parent().attr("data-dis");
                    $a_id = $(this).find("#call-info-list").parent().attr("data-act");
                    if (flag_deal_last == false) {
                        $(this).find("#call-info-list").css("background", "url(../static/images/icon-down.png) no-repeat center");
                        var $that = $(this);
                        model.com.refreshLastDeal($d_id, $a_id, $that);
                        $(".deal-info-items-last-down" + $a_id).show();
                        flag_deal_last = true;
                    } else if (flag_deal_last == true) {
                        $(this).find("#call-info-list").css("background", "url(../static/images/icon-right.png) no-repeat center");
                        $(".deal-info-items-last-down" + $a_id).hide();
                        flag_deal_last = false;
                    }
                }
            });
            //处理信息展开详情(一层)
            $("body").delegate(".deal-info-items .deal-info-items-list", "click", function () {
                var $this = $(this),
                    IsShow = $this.next().css("display");
                if (IsShow == "none") {
                    $(this).find(".deal-firstDown").css("background", "url(../static/images/icon-down.png) no-repeat center");
                    $this.next().show();
                    //$(this).parents(".deal-info-items").css("background-color", "#F0F0F0");
                } else {
                    $(this).find(".deal-firstDown").css("background", "url(../static/images/icon-right.png) no-repeat center");
                    $this.next().hide();
                    //$(this).parents(".deal-info-items").css("background-color", "white");
                }
            });
            //刷新

            $("body").delegate("#call-zace-refresh", "click", function () {
                $com.app.loading('数据加载中...');
                model.com.refreshProblem();
            });
            //Enter触发模糊查询事件
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var value = $("#cby-search-text-ledger").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#lmvt-problem-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#lmvt-problem-tbody"), ProblemList, value, "ID");
                }
            });
            //异常任务模糊查询
            $("body").delegate("#cby-search-ledgerZace", "click", function () {
                var value = $("#cby-search-text-ledger").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#lmvt-problem-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#lmvt-problem-tbody"), ProblemList, value, "ID");
            });

            //问题项
            $("body").delegate("#cby-search-ledger", "click", function () {
                var default_value = {
                    ProductNo: "",
                    LineID: 0,
                    StartTime: $com.util.format('yyyy-MM-dd', new Date()),
                    EndTime: $com.util.format('yyyy-MM-dd', new Date()),
                };
                $com.modal.show(default_value, KEYWORD_Question, "查询", function (rst) {

                    if (!rst || $.isEmptyObject(rst))
                        return;
                    StartTime = new Date($com.util.format('yyyy-MM-dd', rst.StartTime)).getTime();
                    EndTime = new Date($com.util.format('yyyy-MM-dd', rst.EndTime)).getTime();
                    ProductID = rst.ProductNo;
                    LineID = Number(rst.LineID);
                    model.com.refreshProblem();

                }, TypeSource_Question);
            });

            //隐藏
            $("body").delegate("#lmvt-hidden", "click", function () {
                $(".lmvt-apply").hide();
            });


            //问题项详情显示
            $("body").delegate("#call-info-right", "click", function () {
                var SelectData = $com.table.getSelectionData($("#lmvt-problem-tbody"), "ID", ProblemList);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！");
                    return;
                } else if (SelectData.length > 1) {
                    alert("只能查看一条数据的详情！");
                    return;
                }
                $(".call-right-info").show();

                //model.com.refreshProblemFlow(SelectData[0]);
                model.com.getResultList(SelectData[0].ID, SelectData[0]);

            });
            //呼叫详情隐藏
            $("body").delegate("#cby-hidden-list-zace-second", "click", function () {
                $(".call-right-info-zace-second").hide();
                //$(".femi-tb-checkbox").prop("checked", false);

            });
            $("body").delegate("#cby-hidden-list", "click", function () {
                $(".call-right-info").hide();
                //$(".femi-tb-checkbox").prop("checked", false);

            });

            //申请图片查看
            $("body").delegate(".image-show", "click", function () {
                var farImg = $(this).parent(),
                    imgObj = {},
                    imgList = [];
                $.each(farImg.children(), function (i, item) {
                    imgObj = $(item).attr("data-source");
                    imgList.push(imgObj);
                });
                PhotoList = imgList;
                $("body").append(HTML.Photo);
                var imgSrc = $(this).attr("src")
                $.each(PhotoList, function (p_i, p_item) {
                    var pImg = p_item;
                    if (pImg == imgSrc) {
                        $(".lmvt-change-photo").attr("data-index", p_i);
                        return false;
                    }
                })

                // $(".zacelmvt-img").attr("src",imgSrc);
                //$(".lmvt-change-photo").css("background", "url(" + imgSrc + ") " + "no-repeat center scroll");
                $(".lmvt-change-photo").css("background", "url(" + imgSrc + ") " + "no-repeat center");
                //0214 $(".lmvt-change-photo").css("background-size", "100%  100%");




                // $.each(SelectData[0].ImageList, function (i, item) {
                //     $(".lmvt-show-photo").append(HTML.img);
                // });

                // $(".lmvt-show-photo .lmvt-img").each(function (i, item) {

                //     $(item).attr("src","/upload/" + SelectData[0].ImageList[i]);
                //     if (i == 0) {
                //         $(item).show();
                //         $(item).attr("data-type", "true");
                //     }

                // });
            });
            //移除photo
            $("body").delegate(".lmvt-remove-photo", "click", function () {
                $(".lmvt-show-photo").remove();
            });

            //右看图片
            $("body").delegate(".lmvt-bottom-left", "click", function () {
                var index = Number($(".lmvt-change-photo").attr("data-index"));
                if (PhotoList) {
                    if (index == PhotoList.length - 1) {
                        alert("这是最后一张图片！");
                        return false;
                    }
                    else {
                        $(".lmvt-change-photo").css("background", "url(" + PhotoList[index + 1] + ") " + "no-repeat center");
                        $(".lmvt-change-photo").attr("data-index", index + 1);
                    }
                }
            });
            //左看图片
            $("body").delegate(".lmvt-bottom-right", "click", function () {
                var index = Number($(".lmvt-change-photo").attr("data-index"));
                if (PhotoList) {
                    if (index == 0) {
                        alert("这是第一张图片！");
                        return false;
                    }
                    else {
                        $(".lmvt-change-photo").css("background", "url(" + PhotoList[index - 1] + ") " + "no-repeat center");
                        $(".lmvt-change-photo").attr("data-index", index - 1);
                    }
                }

            });
            ////表格行的点击事件 为点击事件做checked处理
            //$("body").delegate(".femi-tb-scroll table.table tbody tr", "click", function (e) {
            //    var $this = $(this),
            //        $table = $this.closest("table"),
            //        checkboxID = $this.find("td[data-title=WID]").attr("data-value");
            //    if ($this.children('th')[0]) {
            //        return false;
            //    }

            //    $(".femi-tb-scroll table.table  tr td input[type=checkbox].femi-tb-checkbox").each(function (i, item) {
            //        if (checkboxID == $(item).parent().next().attr("data-value"))
            //            return true;
            //        else
            //            $(item).prop("checked", false);
            //    })
            //    $table.find("tbody tr").each(function (i, item) {
            //        var $tr = $(this);
            //        if (checkboxID == $tr.find("td[data-title=WID]").attr("data-value"))
            //            return true;
            //        else {
            //            if (!($tr.attr("data-color"))) {

            //                $tr.css('background-color', '');
            //            } else {

            //                var colorPro = $tr.attr("data-color");
            //                $tr.css('background-color', colorPro);
            //            }
            //        }
            //    });

            //});
            //表格行的点击事件 为点击checked做处理
            //$("body").delegate(".femi-tb-scroll table.table tr td input[type=checkbox].femi-tb-checkbox", "click", function (e) {
            //    var $this = $(this),
            //        $table = $this.closest("table"),
            //        checkboxID = $this.parent().parent().find("td[data-title=WID]").attr("data-value");

            //    $(".femi-tb-scroll table.table  tr td input[type=checkbox].femi-tb-checkbox").each(function (i, item) {
            //        if (checkboxID == $(item).parent().next().attr("data-value"))
            //            return true;
            //        else
            //            $(item).prop("checked", false);
            //    })
            //    $table.find("tbody tr").each(function (i, item) {
            //        var $tr = $(this);
            //        if (checkboxID == $tr.find("td[data-title=WID]").attr("data-value"))
            //            return true;
            //        else {
            //            if (!($tr.attr("data-color"))) {

            //                $tr.css('background-color', '');
            //            } else {

            //                var colorPro = $tr.attr("data-color");
            //                $tr.css('background-color', colorPro);
            //            }
            //        }
            //    });

            //});


        },
        run: function () {
            $com.app.loading('数据加载中...');
            StartTime = $com.util.format("yyyy-MM-dd", new Date().getTime() - 30 * 24 * 60 * 60 * 1000);
            EndTime = $com.util.format("yyyy-MM-dd", new Date().getTime() + 24 * 60 * 60 * 1000);
            ProductID = 0;
            LineID = 0;

            model.com.getFPCProductAll({ BusinessUnitID: -1, ProductTypeID: 0, OAGetType: 0 }, function (resP) {
                $.each(resP.list, function (i, item) {
                    TypeSource_Question.ProductNo.push({
                        name: item.ProductNo,
                        value: item.ID
                    })
                });
                model.com.getFMCLine({ BusinessUnitID: 0, FactoryID: 0, WorkShopID: 0 }, function (resF) {
                    $.each(resF.list, function (j, jtem) {
                        TypeSource_Question.LineID.push({
                            name: jtem.Name,
                            value: jtem.ID
                        })
                    });
                    model.com.refreshProblem();
                });
            });




        },
        com: {

            refreshProblem: function () {

                model.com.getIPTPreCheckProblemAll({ OrderID: 0, ProductID: ProductID, LineID: LineID, StartTime: StartTime, EndTime: EndTime }, function (res) {

                    ProblemList = $com.util.Clone(res.list);
                    $.each(ProblemList, function (i, item) {
                        item.Status = STATUS[item.Status];
                        item.ItemList = item.Description.split('+|;|+');

                        // item.PathList = item.Picture.split(",");
                        // ImagePathArray = [];
                        // for (var k = 0; k < item.PathList.length; k++) {
                        //     SrcListObj = {
                        //         ID: k + 1,
                        //         SrcList: item.PathList[k]
                        //     }
                        //     if (SrcListObj.SrcList != "") {
                        //         ImagePathArray.push(SrcListObj);
                        //     }
                        // }
                        // if (ImagePathArray.length > 0) {
                        //     item.LendImages = $com.util.template(ImagePathArray, HTML.IMGLIST);
                        // } else {
                        //     item.LendImages = "";
                        // }

                        switch (item.ItemList.length) {
                            case 1:
                                item.FirstItemName = item.ItemList[0];
                                item.SeconfItemName = '';
                                item.ThirdItemName = '';
                                item.FourItemName = '';
                                item.FiveItemName = '';

                                break;

                            case 2:
                                item.FirstItemName = item.ItemList[0];
                                item.SeconfItemName = item.ItemList[1];
                                item.ThirdItemName = '';
                                item.FourItemName = '';
                                item.FiveItemName = '';
                                break;
                            case 3:
                                item.FirstItemName = item.ItemList[0];
                                item.SeconfItemName = item.ItemList[1];
                                item.ThirdItemName = item.ItemList[2];
                                item.FourItemName = '';
                                item.FiveItemName = '';
                                break;
                            case 4:
                                item.FirstItemName = item.ItemList[0];
                                item.SeconfItemName = item.ItemList[1];
                                item.ThirdItemName = item.ItemList[2];
                                item.FourItemName = item.ItemList[3];
                                item.FiveItemName = '';
                                break;
                            case 5:
                                item.FirstItemName = item.ItemList[0];
                                item.SeconfItemName = item.ItemList[1];
                                item.ThirdItemName = item.ItemList[2];
                                item.FourItemName = item.ItemList[3];
                                item.FiveItemName = item.ItemList[4];
                                break;

                            default:
                                item.FirstItemName = '';
                                item.SeconfItemName = '';
                                item.ThirdItemName = '';
                                item.FourItemName = '';
                                item.FiveItemName = '';
                                break;
                        }


                    });

                    $("#lmvt-problem-tbody").html($com.util.template(ProblemList, HTML.QuestionItems));
                    $com.app.loaded();
                });

            },

            //流程数据
            getIPTPreCheckProblemNodeInfo: function (data, fn, context) {
                var d = {
                    $URI: "/IPTPreCheckProblem/NodeInfo",
                    $TYPE: "get",
                    $SERVER: "/MESQMS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //问题项
            getIPTPreCheckProblemAll: function (data, fn, context) {
                var d = {
                    $URI: "/IPTPreCheckProblem/All",
                    $TYPE: "get",
                    $SERVER: "/MESQMS"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //产品规格
            getFPCProductAll: function (data, fn, context) {
                var d = {
                    $URI: "/FPCProduct/All",
                    $TYPE: "get",
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

            getTreeTask: function (TaskID) {
                var parms = {
                    TaskID: TaskID,
                    TagValue: -1,
                    DispatchID: -1
                }
                model.com.getTree(parms, function (data) {
                    Datatree = data;
                    model.com.refreshCallData(data);
                    model.com.refreshDealData(data);
                    $(".call-right-info").show();
                    model.com.getAcionList();
                });
                //return Datatree;
            },
            //refreshData:function(data){

            //},
            //处理默认时间轴数据（默认数据)
            dealDefaultData: function (data) {
                var defaultTimeArr = data,
                    _defaultTimeArr = model.com.getOrderTime(defaultTimeArr),
                    _startTime = $com.util.format("yyyy-MM-dd", defaultTimeArr[0].CreateTime),
                    _length = defaultTimeArr.length - 1,
                    _endTime = $com.util.format("yyyy-MM-dd", defaultTimeArr[_length].CreateTime);
                defaultTime = {
                    startTime: _startTime,
                    endTime: _endTime
                };
                var _data = [];
                $.each(data, function (i, item) {
                    _data.push({
                        beginTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(item.CreateTime)),
                        endTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(item.EditTime)),
                        status: item.Status,
                        exceptionTypeName: item.ExceptionTypeName,
                        id: item.ID,
                        color: "#ABB3B8"
                    });
                });
                timeLineShowData = data;
                newtimeLineShowData = timeLineShowData;
                var orderArr = model.com.getOrderTime(_data),
                    length = orderArr.length,
                    days = model.com.getDays(orderArr[0].beginTime, orderArr[length - 1].beginTime);
                //days: 50,//选择的天数
                //showDays:0,//选择显示的天数
                //screenWidth: 0,//屏幕宽度
                //spaceLength: 60,//单位刻度的长度
                //spaceCount:0,//总共多少格
                //startTime: "2019-06-25 15:15:21",//选择开始的时间
                //countTime: 0,//选择的总时长

                dataObj.days = days;
                dataObj.showDays = dataObj.days;
                dataObj.screenWidth = dataObj.contain[0].offsetWidth;
                dataObj.spaceCount = Math.floor(dataObj.screenWidth / dataObj.spaceLength);
                dataObj.startTime = orderArr[0].beginTime;
                dataObj.countTime = (new Date(orderArr[length - 1].beginTime).getTime()) - (new Date(orderArr[0].beginTime).getTime());
                dataObj.oneSpaceTime = dataObj.countTime / dataObj.spaceCount;
                dataObj.oneTimeLenght = (dataObj.screenWidth - dataObj.rectParams.rectWidth) / (dataObj.days * 24 * 60 * 60 * 1000);
                dataObj.canvasParams.width = dataObj.screenWidth;
                dataObj.canvasParams.height = dataObj.contain[0].offsetHeight;

                dataObj.data = orderArr;
                model.com.dealShowData(dataObj.data, dataObj.dataShow);
            },
            //处理更改时间轴的数据(更改数据）
            dealData: function (data, chooseTime) {
                if (data.length == 0) {
                    alert("没有相关查询数据，请重新查询！！！");
                    // 调用组件
                    $("#canvasDiv").html("");
                } else {
                    var _data = [];
                    $.each(data, function (i, item) {
                        _data.push({
                            beginTime: item.CreateTime,
                            endTime: item.EditTime,
                            status: item.Status,
                            exceptionTypeName: item.ExceptionTypeName,
                            id: item.ID,
                            color: "#ABB3B8"
                        });
                    });
                    //填写传递参数
                    var orderArr = model.com.getOrderTime(_data),
                        length = orderArr.length,
                        days = model.com.getDays(orderArr[0].beginTime, orderArr[length - 1].beginTime);
                    dataObj.days = days;
                    dataObj.showDays = chooseTime.longerTime;
                    dataObj.screenWidth = dataObj.contain[0].offsetWidth;

                    var countTime = dataObj.days * 24 * 60 * 60 * 1000,
                        chooseTime = dataObj.showDays * 24 * 60 * 60 * 1000;
                    //轴的长度
                    dataObj.canvasParams.width = dataObj.screenWidth * countTime / chooseTime;
                    dataObj.spaceCount = Math.floor(dataObj.canvasParams.width / dataObj.spaceLength);
                    dataObj.startTime = orderArr[0].beginTime;
                    dataObj.oneTimeLenght = (dataObj.screenWidth - dataObj.rectParams.rectWidth) / (dataObj.showDays * 24 * 60 * 60 * 1000);
                    dataObj.oneSpaceTime = dataObj.spaceLength / dataObj.oneTimeLenght;

                    if (dataObj.canvasParams.width < dataObj.contain[0].offsetWidth) {
                        dataObj.canvasParams.width = dataObj.contain[0].offsetWidth;
                    }
                    dataObj.canvasParams.height = dataObj.contain[0].offsetHeight;
                    dataObj.data = orderArr;
                    model.com.dealShowData(dataObj.data, dataObj.dataShow);
                }
            },

            //处理显示方式 显示时间轴
            dealShowData: function (data, datashow) {
                var showobj = {};
                $.each(data, function (i, item) {
                    $.each(datashow, function (_i, _item) {
                        switch (_item.id) {
                            case 1:
                                _item.num = item.beginTime;
                                break;
                            case 2:
                                _item.num = item.endTime;
                                break;
                            case 3:
                                $.each(statusType, function (s_i, s_item) {
                                    if (item.status == s_item.value) {
                                        _item.num = s_item.name;
                                    }
                                });
                                break;
                            case 4:
                                _item.num = item.exceptionTypeName;
                                break;

                        }
                    });
                    showobj[item.id] = datashow;
                    datashow = [
                        {
                            text: "开始时间: ",
                            num: 0,
                            id: 1
                        },
                        {
                            text: "结束时间: ",
                            num: 0,
                            id: 2
                        },
                        {
                            text: "状态: ",
                            num: 0,
                            id: 3
                        },
                        {
                            text: "异常: ",
                            num: 0,
                            id: 4
                        }
                    ]
                });
                // 调用组件
                $timeLine.show(dataObj, showobj);
                dataObj.aroundArrY = [];
                dataObj.aroundedArrY = [];
                dataObj.aroundedObjY = {};
                dataObj.aroundObjY = {};
            },
            getHourOrMinorSec: function (num) {
                var WSecond = num;
                var hour = parseInt(WSecond / 3600);
                var hourS = WSecond % 3600;

                var min = parseInt(hourS / 60);

                var sec = hourS % 60;
                if (hour > 0) {
                    return hour + "小时" + min + "分钟" + sec + "秒";
                } else {
                    if (min > 0) {
                        return min + "分钟" + sec + "秒";
                    } else {
                        return sec + "秒";
                    }
                }
            },
            //显示任务表
            refreshData: function (data) {
                $com.app.loading('数据加载中...');
                var _data = data.list,
                    showData = $com.util.Clone(_data),
                    userData = window.parent._UserAll;

                $.each(showData, function (i, item) {
                    item.LastTime = model.com.getHourOrMinorSec(parseInt((new Date(item.EditTime).getTime() - new Date(item.CreateTime).getTime()) / 1000));
                    item.CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(item.CreateTime))
                    item.EditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(item.EditTime));
                    item.WID = i + 1;
                    $.each(userData, function (u_i, u_item) {
                        if (item.ApplicantID == u_item.ID) {
                            item.ApplicantName = u_item.Name;
                        }
                        // if (item.OperatorID == u_item.ID) {
                        //     item.OperatorName = u_item.Name;
                        // }
                    });
                    $.each(statusType, function (s_i, s_item) {
                        if (s_item.value == item.Status) {
                            item.StatusName = s_item.name;
                        }
                    });
                    $.each(DataLevel.list, function (l_i, l_item) {
                        if (l_item.ID == item.RespondLevel) {
                            item.RespondLevelName = l_item.Name;
                        }
                    })

                    //警告
                    if (item.RespondLevel == 3) {
                        item.Color = "#F5B128";

                    }
                    //严重
                    if (item.RespondLevel == 2) {
                        item.Color = "#EB3B3B";

                    }
                    //紧急
                    if (item.RespondLevel == 1) {
                        item.Color = "#C51D1D";

                    }
                    //
                    if (item.RespondLevel == 4) {
                        item.Color = "#1c7171";

                    }
                    //状态
                    if (item.Status == 0) {

                        item.StatusName = "【" + modelDep[item.OperatorID[0]] + "-" + modelUser[item.OperatorID[0]] + "】" + "待处理";

                    } else if (item.Status == 4 || item.Status == 6 || item.Status == 4) {

                        item.StatusName = "【" + modelDep[item.ConfirmID] + "-" + modelUser[item.ConfirmID] + "】" + item.StatusName;
                    }
                    else if (item.Status == 9) {

                        item.StatusName = "【" + modelDep[item.ApplicantID] + "-" + modelUser[item.ApplicantID] + "】" + item.StatusName;
                    }

                    else {

                        item.StatusName = "【" + modelDep[item.OperatorID[0]] + "-" + modelUser[item.OperatorID[0]] + "】" + item.StatusName;
                    }

                    item.OperatorName = "";//操作人
                    for (var index = 0; index < item.OperatorID.length; index++) {
                        if (item.OperatorName.length < 1) {
                            item.OperatorName = modelUser[item.OperatorID[index]];
                        } else {

                            item.OperatorName = item.OperatorName + "," + modelUser[item.OperatorID[index]];

                        }

                    }
                });

                TableShowData = $com.util.Clone(showData);
                showData = showData.reverse();
                $("#cby-task-tbody").html($com.util.template(showData, HTML.TableTaskItemNode));
                $com.app.loaded();
                $("#cby-task-tbody tr").each(function (i, item) {
                    var $this = $(this);
                    var colorName = $this.css("background-color");
                    $this.attr("data-color", colorName);



                });
            },

            //获取各个流程数据
            getResultList: function (ID, data) {
                model.com.getIPTPreCheckProblemNodeInfo({ ProblemID: ID }, function (res) {

                    ResultList = $com.util.Clone(res);
                    model.com.refreshProblemFlow(data, ResultList);

                    //$("#lmvt-problem-tbody").html($com.util.template(ProblemList, HTML.QuestionItems));

                });
            },
            //流程渲染
            refreshProblemFlow: function (data, result) {
                //预检
                var myselfObj = {};
                myselfObj.ItemType = "预检信息";
                myselfObj.CreateTime = data.PreCheckTime;
                myselfObj.Operator = data.PreCheckName;

                result.PreCheckNode.Result = Result[result.PreCheckNode.Result];
                result.PreCheckNode.Status = Saved[result.PreCheckNode.Status];

                var imageList = data.ImageList,
                    _imageList = [],
                    imageListObj = {};
                if (imageList.length > 0) {
                    $.each(imageList, function (i_i, i_item) {
                        imageListObj.imageList = i_item;
                        imageListObj.Type = "Pre";
                        _imageList.push(imageListObj);
                        imageListObj = {};
                    });

                    result.PreCheckNode.IMG = $com.util.template(_imageList, HTML.IMG);
                }


                //预检信息
                var _zaceModeItem = {};
                var _Images = []
                $.each(data.PreCheckValue.ImagePath, function (k, item) {
                    _Images.push({ Src: item })
                });


                result.PreCheckNode.Text = result.PreCheckNode.Submitor;
                result.PreCheckNode.Standard = $com.util.format('yyyy-MM-dd hh:ss:mm', new Date(result.PreCheckNode.SubmitTime));
                result.PreCheckNode.ISCheck = "checked";
                result.PreCheckNode.ISDisabled = "disabled";
                result.PreCheckNode.IsDisplay = result.PreCheckNode.Value.length <= 0 ? 'none' : 'inline';

                result.PreCheckNode.resultText = result.PreCheckNode.Result == 0 ? STATUSItem[1] : STATUSItem[result.PreCheckNode.Result];
                result.PreCheckNode.resultColor = result.PreCheckNode.Result == 0 ? COLOURItem[1] : COLOURItem[result.PreCheckNode.Result];

                result.PreCheckNode.DefaultValue = result.PreCheckNode.Value;
                result.PreCheckNode.Unit = data.IPTItem.Unit.length > 0 ? '【' + data.IPTItem.Unit + '】' : '';
                result.PreCheckNode.Display = _Images.length > 0 ? "" : "none";
                result.PreCheckNode.Images = $com.util.template(_Images, HTML.IMG);

                result.PreCheckNode.FFDisplay = result.PreCheckNode.Manufactor.length > 0 ? '' : 'none';
                result.PreCheckNode.MoDisplay = result.PreCheckNode.Modal.length > 0 ? '' : 'none';
                result.PreCheckNode.BBDisplay = result.PreCheckNode.Number.length > 0 ? '' : 'none';
                result.PreCheckNode.TTDisplay = result.PreCheckNode.Remark.length > 0 ? '' : 'none';

                result.PreCheckNode.Remark = result.PreCheckNode.Remark;
                result.PreCheckNode.Manufactor = result.PreCheckNode.Manufactor;
                result.PreCheckNode.Modal = result.PreCheckNode.Modal;
                result.PreCheckNode.Number = result.PreCheckNode.Number;



                //实际是否有图例
                result.PreCheckNode.IsPictureShow = data.IPTItem.Legend.length > 0 ? '' : 'none';
                var _ImagesZace = [];
                if (data.IPTItem.Legend.length > 0) {
                    $.each(data.IPTItem.Legend.split(','), function (k, item) {
                        _ImagesZace.push({ Src: item });
                    });
                }

                result.PreCheckNode.ImagesZace = $com.util.template(_ImagesZace, HTML.IMG);


                var _zaceMaterMode = [];
                $.each(result.PreCheckNode.IPTProblemBomItemList, function (p, item_p) {
                    var obj = {
                        MaterialName: '',
                        Number: 0,

                    }
                    obj.MaterialName = item_p.MaterialNo;
                    obj.Number = item_p.Number;


                    _zaceMaterMode.push(obj);


                })


                result.PreCheckNode.MaterialText = $com.util.template(_zaceMaterMode, HTMLCall.SUB_LISTDone);
                //预检信息
                myselfObj.SonList = $com.util.template(result.PreCheckNode, HTML.SelfTemplate)

                if (result.PreCheckNode.ID>0) {
                    $("#call-info-all").html($com.util.template(myselfObj, HTML.DealItemNode));
                } else {
                    myselfObj.ItemType = "段改信息";
                    $("#call-info-all").html($com.util.template(myselfObj, HTML.DealItemNodeMessage));
                }
              

                //处理信息

                var solveInfo = [];
                $.each(result.info.IPTProblemAssessList,function(i,item){
                    var obj = {};
                    //人名
                    obj.ItemType = "评审人";
                    //时间
                    obj.CreateTime = item.AuditTime;
                    //状态
                    obj.Operator = item.Auditor;

                    var _zaceModeHandle = {};
                    var _Images = []
                    $.each(item.IPTSOP.ImagePath, function (k, item) {
                        _Images.push({ Src: item })
                    });
                    obj.IMGZace=$com.util.template(_Images, HTML.IMG);
                    obj.RemarkZace=item.IPTSOP.Detail;
                    //solveInfo.DealMessage+=$com.util.template(item, HTML.DealItemNode);
                    obj.SonList = $com.util.template(obj, HTML.SUB_LISTItemPShen);

                    solveInfo.push(obj);
                });
                //渲染最大的
                var str = {};
                str.DealMessage = $com.util.template(solveInfo, HTML.DealItemNode);
                $("#call-info-all").append($com.util.template(str, HTML.SolveInfo));

                //处理信息



                //现场工艺 
                if (data.CraftName.length > 0) {
                    var nowObj = {};
                    nowObj.ItemType = "现场工艺";
                    nowObj.CreateTime = data.CarftTime;
                    nowObj.Operator = data.CraftName;
                    nowObj.Solve = result.info.IPTSOPList[0].Detail;
                    nowObj.DoStationName =result.info.DoStationName;

                    nowObj.Person='';
                    $.each(result.info.IPTProblemConfirmerList,function(i,item){

                        if (i==0) {
                            nowObj.Person=item.ConfirmerName
                        }else{
                            nowObj.Person+=';'+item.ConfirmerName;
                        }
                        
                    });

                    var _zaceModeHandle = {};
                    var _Images = []
                    $.each(result.info.IPTSOPList[0].PathList, function (k, item) {
                        _Images.push({ Src: item })
                    });
                    nowObj.SolveImg=$com.util.template(_Images, HTML.IMG);


                    // nowObj.FullDescribe = data.FullDescribe;
                    nowObj.SonList = $com.util.template(nowObj, HTML.NowTemplate)
                    $("#call-info-all").append($com.util.template(nowObj, HTML.DealItemNode));
                }

                //确认人多个
                var solveInfoCon = [];
                $.each(result.info.IPTProblemConfirmerList,function(i,item){
                    var objCon = {};
                    //人名
                    objCon.ItemType = "确认人";
                    //时间
                    objCon.CreateTime = item.ConfirmTime;
                    objCon.Operator = item.ConfirmerName;
                    //状态
                    //obj.Operator = data.CraftName;
                    //solveInfo.DealMessage+=$com.util.template(item, HTML.DealItemNode);
                    // objCon.SonList = $com.util.template(objCon, HTML.SUB_LISTItemPShen);

                    solveInfoCon.push(objCon);
                });
                //渲染最大的
                var strobjCon = {};
                strobjCon.DealMessage = $com.util.template(solveInfoCon, HTML.DealItemNodeCon);
                $("#call-info-all").append($com.util.template(strobjCon, HTML.SolveInfoConfirm));


                // //部门负责人
                // if (data.Manager.Name.length > 0) {
                //     var depObj = {};
                //     depObj.ItemType = "确认人";//多个
                //     depObj.CreateTime = data.DepartmentIssueTime;
                //     depObj.Operator = data.Manager.Name;
                //     depObj.DoPersonName = data.DoPersonName;
                //     depObj.DoClassName = data.DoClassName;
                //     depObj.DoPartPointName = data.DoPartPointName;
                //     depObj.DoStationName = data.DoStationName;
                //     depObj.Person = $com.util.template(data.EmployeeList, HTML.DeTemplatePerson);
                //     depObj.SonList = $com.util.template(depObj, HTML.DeTemplate)
                //     $("#call-info-all").append($com.util.template(depObj, HTML.DealItemNode));
                // }
                //自检

                var _messageText={
                    DealMessage:'',
                };
                if (result.SelfCheckNode.SubmitID > 0) {
                    var myObj = {};
                    myObj.ItemType = "自检信息";
                    myObj.CreateTime = result.SelfCheckNode.SubmitTime;
                    myObj.Operator = model.com.GetUserName(result.SelfCheckNode.SubmitID);
                    result.SelfCheckNode.Result = Result[result.SelfCheckNode.Result];
                    result.SelfCheckNode.Status = Saved[result.SelfCheckNode.Status];

                    var imageList = result.SelfCheckNode.ImagePath,
                        _imageList = [],
                        imageListObj = {};
                    if (imageList.length > 0) {
                        $.each(imageList, function (i_i, i_item) {
                            imageListObj.imageList = i_item;
                            imageListObj.Type = "Myself";
                            _imageList.push(imageListObj);
                            imageListObj = {};
                        });
                        result.SelfCheckNode.IMG = $com.util.template(_imageList, HTML.IMG);
                    }


                    myObj.SonList = $com.util.template(result.SelfCheckNode, HTML.MySelfTemplate)
                    _messageText.DealMessage+=$com.util.template(myObj, HTML.DealItemNode);
                    //$("#call-info-all").append($com.util.template(myObj, HTML.DealItemNode));
                }
                //互检
                if (result.MutualCheckNode.SubmitID > 0) {
                    var ourObj = {};
                    ourObj.ItemType = "互检信息";
                    ourObj.CreateTime = result.MutualCheckNode.SubmitTime;
                    ourObj.Operator = model.com.GetUserName(result.MutualCheckNode.SubmitID);

                    var imageList = result.MutualCheckNode.ImagePath,
                        _imageList = [],
                        imageListObj = {};
                    if (imageList.length > 0) {
                        $.each(imageList, function (i_i, i_item) {
                            imageListObj.imageList = i_item;
                            imageListObj.Type = "Our";
                            _imageList.push(imageListObj);
                            imageListObj = {};
                        });

                        result.MutualCheckNode.IMG = $com.util.template(_imageList, HTML.IMG);
                    }
                    result.MutualCheckNode.Result = Result[result.MutualCheckNode.Result];
                    result.MutualCheckNode.Status = Saved[result.MutualCheckNode.Status];

                    ourObj.SonList = $com.util.template(result.MutualCheckNode, HTML.OurTemplate)
                    // $("#call-info-all").append($com.util.template(ourObj, HTML.DealItemNode));
                    _messageText.DealMessage+=$com.util.template(ourObj, HTML.DealItemNode);
                }
                //专检
                if (result.SpecialCheckNode.SubmitID > 0) {
                    var concentrateObj = {};
                    concentrateObj.ItemType = "专检信息";
                    concentrateObj.CreateTime = result.SpecialCheckNode.SubmitTime;
                    concentrateObj.Operator = model.com.GetUserName(result.SpecialCheckNode.SubmitID);

                    var imageList = result.SpecialCheckNode.ImagePath,
                        _imageList = [],
                        imageListObj = {};
                    if (imageList.length > 0) {
                        $.each(imageList, function (i_i, i_item) {
                            imageListObj.imageList = i_item;
                            imageListObj.Type = "Our";
                            _imageList.push(imageListObj);
                            imageListObj = {};
                        });

                        result.SpecialCheckNode.IMG = $com.util.template(_imageList, HTML.IMG);
                    }
                    result.SpecialCheckNode.Result = Result[result.SpecialCheckNode.Result];
                    result.SpecialCheckNode.Status = Saved[result.SpecialCheckNode.Status];

                    concentrateObj.SonList = $com.util.template(result.SpecialCheckNode, HTML.ConcentrateTemplate)
                    // $("#call-info-all").append($com.util.template(concentrateObj, HTML.DealItemNode));
                    _messageText.DealMessage+=$com.util.template(concentrateObj, HTML.DealItemNode);
                }
                $("#call-info-all").append($com.util.template(_messageText, HTML.SolveInfoCheck));

            },
            //显示处理信息
            refreshDealData: function (data) {
                var _data = data.info,
                    dataDispatch = _data.CallDispatchList,
                    dealShowData = [],
                    dealShowObj = {},
                    userData = window.parent._UserAll;

                $.each(dataDispatch, function (i, item) {
                    if (!(item.Status == 5 && item.ActionList.length == 0)) {
                        dealShowObj.OperatorID = item.OperatorID;
                        dealShowObj.StatusID = item.Status;
                        dealShowObj.DealID = item.ID;
                        dealShowObj.CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.CreateTime);
                        dealShowData.push(dealShowObj);
                        dealShowObj = {};
                    }
                });
                $.each(dealShowData, function (c_i, c_item) {
                    $.each(userData, function (u_i, u_item) {
                        if (c_item.OperatorID == u_item.ID) {
                            c_item.Operator = u_item.Name;
                        }
                    });
                    $.each(statusType, function (s_i, s_item) {
                        if (c_item.StatusID == s_item.value) {
                            c_item.Status = s_item.name;
                        }
                    });
                });

                $("#call-info-deal").html($com.util.template(dealShowData, HTML.DealItemNode));
            },
            //显示呼叫信息-task的下拉框
            refreshTaskInfoData: function ($class, $that) {
                var dataTask = Datatree.info.CallTask,
                    taskInfoObj = {},
                    taskInfoArr = [];
                //StationNo ExceptionTypeName RespondLevel OnSite DisplayBoard Comment ImageList
                taskInfoObj.StationTypeName = dataTask.StationTypeName;
                taskInfoObj.StationNo = modelStation[dataTask.StationNo];
                taskInfoObj.PlaceName = modelPlaceID[dataTask.PlaceID];
                taskInfoObj.ExceptionTypeName = dataTask.ExceptionTypeName;
                taskInfoObj.RespondLevelID = dataTask.RespondLevel;
                taskInfoObj.OnSiteID = dataTask.OnSite;
                taskInfoObj.DisplayBoardID = dataTask.DisplayBoard;
                taskInfoObj.Comment = dataTask.Comment;
                taskInfoObj.PartNo = dataTask.PartNo;
                //taskInfoObj.ImageList = dataTask.ImageList;
                taskInfoArr.push(taskInfoObj);

                $.each(taskInfoArr, function (i, item) {
                    //是否显示
                    $.each(OnSiteType, function (s_i, s_item) {
                        if (item.OnSiteID == s_item.value) {
                            item.OnSite = s_item.name;
                        }
                    });
                    $.each(DisplayBoardType, function (d_i, d_item) {
                        if (item.DisplayBoardID == d_item.value) {
                            item.DisplayBoard = d_item.name;
                        }
                    });
                    //等级
                    $.each(DataLevel.list, function (l_i, l_item) {
                        if (l_item.ID == item.RespondLevelID) {
                            item.RespondLevel = l_item.Name;
                        }
                    })
                });
                var $show = $class;
                $("." + $show).html($com.util.template(taskInfoArr, HTML.TaskInfoItemNode));

                var imageList = dataTask.ImageList,
                    _imageList = [],
                    imageListObj = {};
                $.each(imageList, function (i_i, i_item) {
                    imageListObj.imageList = i_item;
                    _imageList.push(imageListObj);
                    imageListObj = {};
                });

                var ImageTemplate = '<img src="{{imageList}}" alt="" class="image-show" data-source="{{imageList}}" />',
                    HtmlAllImage = $com.util.template(_imageList, ImageTemplate);
                $that.find(".call-info-item-image").append(HtmlAllImage);

            },
            //显示呼叫信息-call的下拉框
            refreshCallInfoData: function ($class, $that) {
                var callcancelData = Datatree.info.CallCancel,
                    callcancelObj = {},
                    callcancelArr = [];
                if (callcancelData == null) {
                    return false;
                } else {
                    callcancelObj.CancelComment = callcancelData.Comment;
                    //callcancelObj.CancelImageList = callcancelData.ImageList;
                    callcancelArr.push(callcancelObj);
                    var $show = $class;
                    $("." + $show).html($com.util.template(callcancelArr, HTML.CallInfoItemNode));
                }
                var imageList = callcancelData.ImageList,
                    _imageList = [],
                    imageListObj = {};
                $.each(imageList, function (i_i, i_item) {
                    imageListObj.imageList = i_item;
                    _imageList.push(imageListObj);
                    imageListObj = {};
                });
                //<img src="/upload/{{CancelImageList}}" alt="" class="image-show"data-source="{{CancelImageList}}"/>
                var ImageTemplate = '<img src="{{imageList}}" alt="" class="image-show" data-source="{{imageList}}" />',
                    HtmlAllImage = $com.util.template(_imageList, ImageTemplate);
                $that.find(".call-info-item-image-cancel").append(HtmlAllImage);
            },

            getAcionList: function () {
                var CallDispatchList = Datatree.info.CallDispatchList;
                $.each(CallDispatchList, function (d_i, d_item) {
                    var actionList = d_item.ActionList;
                    if (actionList.length != 0) {
                        model.com.refreshFirstDeal(actionList, d_item.ID);
                    };
                });
            },
            //显示处理信息下的第一层ActionList
            refreshFirstDeal: function (ActionList, d_id) {
                var actionObj = {},
                    actionArr = [];
                $.each(ActionList, function (i, item) {
                    actionObj.CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.CreateTime);
                    actionObj.ActionTypeID = item.ActionType;
                    actionObj.OperatorID = item.OperatorID;
                    actionObj.ActionID = item.ID;
                    $.each(DataActionType.list.Result, function (t_i, t_item) {
                        if (t_item.ID == actionObj.ActionTypeID) {
                            actionObj.ActionType = t_item.Name;
                        }
                    });
                    $.each(DataUser, function (u_i, u_item) {
                        if (u_item.ID == actionObj.OperatorID) {
                            actionObj.Operator = u_item.Name;
                        }
                    });
                    actionObj.DisID = d_id;
                    actionArr.push(actionObj);
                    actionObj = {};
                });
                var show = "deal-info-items-first-down" + String(d_id);
                $("#" + show).html($com.util.template(actionArr, HTML.CallItemNode));
            },
            refreshLastDeal: function (d_id, a_id, $that) {
                var data = Datatree.info.CallDispatchList,
                    aData;
                //1 找到当前的actionList
                $.each(data, function (i, item) {
                    if (item.ID == d_id) {
                        $.each(item.ActionList, function (a_i, a_item) {
                            if (a_item.ID == a_id) {
                                aData = a_item;
                            }
                        })
                    }
                });
                //2 渲染数据
                var aObj = {},
                    aArr = [];

                if (aData.Forwarder.length > 0) {
                    aObj.ForwarderName = "";
                    for (var index = 0; index < aData.Forwarder.length; index++) {
                        if (aObj.ForwarderName.length < 1) {
                            aObj.ForwarderName = modelUser[aData.Forwarder[index]];
                        } else {

                            aObj.ForwarderName = aObj.ForwarderName + "," + modelUser[aData.Forwarder[index]];

                        }

                    }
                }
                aObj.CancelComment = aData.Comment;
                //aObj.cancelImageList = aData.ImageList;
                aArr.push(aObj);

                var showID = ".deal-info-items-last-down" + a_id;

                if (aData.Forwarder.length > 0) {
                    $(showID).html($com.util.template(aArr, HTML.ZaceCallInfoItemNode));
                } else {
                    $(showID).html($com.util.template(aArr, HTML.CallInfoItemNode));
                }


                var imageList = aData.ImageList,
                    _imageList = [],
                    imageListObj = {};
                $.each(imageList, function (i_i, i_item) {
                    imageListObj.imageList = i_item;
                    _imageList.push(imageListObj);
                    imageListObj = {};
                });
                //<img src="/upload/{{CancelImageList}}" alt="" class="image-show"data-source="{{CancelImageList}}"/>
                var ImageTemplate = '<img src="{{imageList}}" alt="" class="image-show" data-source="{{imageList}}" />',
                    HtmlAllImage = $com.util.template(_imageList, ImageTemplate);
                $that.find(".call-info-item-image-cancel").append(HtmlAllImage);
            },

            //将时间从小到大排序
            getOrderTime: function (arr) {
                var minTime;
                if (arr[0].beginTime) {
                    for (var i = 0; i < arr.length; i++) {
                        for (var j = i; j < arr.length; j++) {
                            if (new Date(arr[i].beginTime).getTime() > new Date(arr[j].beginTime).getTime()) {
                                minTime = arr[j];
                                arr[j] = arr[i];
                                arr[i] = minTime;
                            }
                        }
                    }
                }
                else if (arr[0].CreateTime) {
                    for (var i = 0; i < arr.length; i++) {
                        for (var j = i; j < arr.length; j++) {
                            if (new Date(arr[i].CreateTime).getTime() > new Date(arr[j].CreateTime).getTime()) {
                                minTime = arr[j];
                                arr[j] = arr[i];
                                arr[i] = minTime;
                            }
                        }
                    }
                }
                return arr;
            },
            //获取时间天数差值
            getDays: function (startTime, endTime) {
                var startTime = new Date($com.util.format("yyyy-MM-dd hh:mm", startTime)).getTime(),
                    endTime = new Date($com.util.format("yyyy-MM-dd hh:mm", endTime)).getTime(),
                    offsetTime = Math.abs(endTime - startTime),
                    offsetDays = Math.ceil(offsetTime / (3600 * 24 * 1e3));
                return offsetDays;
            },

            //筛选时间范围
            filtrateTime: function (timeArr, chooseTime) {
                var newtimeArr = [],
                    startTime = (new Date($com.util.format('yyyy-MM-dd ', chooseTime.startTime))).getTime(),
                    endTime = (new Date($com.util.format('yyyy-MM-dd ', chooseTime.endTime))).getTime();

                $.each(timeArr, function (i, item) {
                    item.CreateTime
                    var createTime = new Date($com.util.format('yyyy-MM-dd ', item.CreateTime)).getTime();
                    if (startTime <= createTime && createTime < endTime) {
                        newtimeArr.push(item);
                    }
                });
                //if (newtimeArr.length == 0) {
                //    //newtimeArr = timeArr;
                //    alert("未找到相关查询！！！");
                //}
                return newtimeArr;
            },
            //获取异常申请单（集合）
            getEXCCallApplyAll: function (data, fn, context) {
                var d = {
                    $URI: "/EXCCallApply/Info",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            GetUserName: function (id) {
                var Name;
                $.each(window.parent._UserAll, function (i, item) {
                    if (item.ID == id) {
                        Name = item.Name;
                        return Name;
                    }
                });
                return Name;
            },
        }
    });

    model.init();

});

