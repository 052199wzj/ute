require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'],
    function ($yang, $com, $tree) {

        var HTML,
            KEYWORD_ROLE,
            KEYWORD_LIST_ROLE,
            FORMATTRT_ROLE,

            model,
            sRoleID,

            KEYWORD_LISTFOne,
            KEYWORDFOne,
            FORMATTRTFOne,
            TypeSourceFOne,


            DEFAULT_VALUE_ROLE,

            TypeSource_ROLE;
        var mStartTime = $com.util.format('yyyy-MM-dd', new Date(mStartTime));
        var mEndTime = $com.util.format('yyyy-MM-dd', new Date(mEndTime));
        var IsSubmit = false;
        var mZaceItemList = []; //任务详情
        var mZaceList = []; //value详情
        var DoneBool = true;
        var STATUS = ["合格", "合格", "不合格"];
        var mListall = [];
        var COLOUR = ["text-yellow", "text-blue", "text-red"];

        var mCheckID = 0;
        HTML = {
            LIST: ['<li>',
                '<label class="m-detail-title">{{name}}</label>',
                '<div class="m-detail-content">{{value}}</div>',
                '</li>'].join(""),
            TableOrderNode: [
                '<tr data-color="">',
                '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td  style="display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td>',
                '<td   data-title="WID" data-value="{{WID}}">{{WID}}</td>',
                '<td data-title="BureauSection" data-value="{{BureauSection}}">{{BureauSection}}</td>',
                '<td data-title="LineName" data-value="{{LineName}}">{{LineName}}</td>',
                '<td data-title="PartNo" data-value="{{PartNo}}">{{PartNo}}</td>',
                '<td data-title="OrderNo" data-value="{{OrderNo}}">{{OrderNo}}</td>',

                '<td data-title="WBSNo" data-value="{{WBSNo}}">{{WBSNo}}</td>',
                '<td data-title="RealReceiveDate" data-value="{{RealReceiveDate}}">{{RealReceiveDate}}</td>',
                '<td data-title="ExPlanFinishDateplain" data-value="{{PlanFinishDate}}">{{PlanFinishDate}}</td>',
                '<td data-title="RealFinishDate" data-value="{{RealFinishDate}}">{{RealFinishDate}}</td>',
                '</tr>',
            ].join(""),

            TableStationNode: [
                '<tr data-color="">',
                '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td  style="display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td>',
                '<td   data-title="WID" data-value="{{WID}}">{{WID}}</td>',
                '<td data-title="CustomerName" data-value="{{CustomerName}}">{{CustomerName}}</td>',
                '<td data-title="LineName" data-value="{{LineName}}">{{LineName}}</td>',
                '<td data-title="OrderNo" data-value="{{OrderNo}}">{{OrderNo}}</td>',
                '<td data-title="WBSNO" data-value="{{WBSNO}}">{{WBSNO}}</td>',

                '<td data-title="PartNo" data-value="{{PartNo}}">{{PartNo}}</td>',
                '<td data-title="PartName" data-value="{{PartName}}">{{PartName}}</td>',
                '<td data-title="ClassName" data-value="{{ClassName}}">{{ClassName}}</td>',
                '<td data-title="StartWorkTime" data-value="{{StartWorkTime}}">{{StartWorkTime}}</td>',
                '<td data-title="StatusText" data-value="{{StatusText}}">{{StatusText}}</td>',

                '</tr>',
            ].join(""),
            TableStepNode: [
                '<tr data-color="">',
                '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td  style="display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td>',
                '<td   data-title="WID" data-value="{{WID}}">{{WID}}</td>',
                '<td data-title="PartNo" data-value="{{PartNo}}">{{PartNo}}</td>',
                '<td data-title="PartName" data-value="{{PartName}}">{{PartName}}</td>',
                '<td data-title="StepName" data-value="{{StepName}}">{{StepName}}</td>',
                '<td data-title="Status" data-value="{{Status}}">{{Status}}</td>',

                '</tr>',
            ].join(""),

            TableStepItemNode: [
                '<tr data-color="">',
                '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td  style="display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td>',
                '<td   data-title="WID" data-value="{{WID}}">{{WID}}</td>',
                '<td data-title="PartPointName" data-value="{{PartPointName}}">{{PartPointName}}</td>',
                '<td data-title="TypeText" data-value="{{TypeText}}">{{TypeText}}</td>',
                '<td data-title="StatusText" data-value="{{StatusText}}">{{StatusText}}</td>',
                '<td data-title="OperatorName" data-value="{{OperatorName}}">{{OperatorName}}</td>',
                '<td data-title="SubmitTime" data-value="{{SubmitTime}}">{{SubmitTime}}</td>',

                '</tr>',
            ].join(""),
            TableRoleUserItemNode: [
                '<tr data-color="">',
                '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td data-title="FunctionID" data-value="{{FunctionID}}">{{UserName}}</td>',
                '<td data-title="RoleID" data-value="{{RoleID}}">{{RoleName}}</td>',
                '</tr>',
            ].join(""),

            SUB_LIST: ['<li class="list-li">',
                '<div class="item-check"  style="width:10%;float:left;background: #f5f5f5;display: table;text-align: center;">',
                '<input  type="checkbox"  {{ISCheck}}  {{ISDisabled}} style="margin-left: 2px;width: 20px;height: 21px" />',
                '</div>',
                '<div class="list-group-item"  data-id="{{ID}}" style="width:90%;float:righht;">',
                '<div class="list-group-item-cell item-static item-title"  style="width:42%">',
                '<span>{{Text}}</span>',
                '</div>',
                '<div class="list-group-item-cell item-static item-time" style="width:31%">',
                '<span>{{Standard}}</span>',
                '</div>',
                '<div class="list-group-item-cell item-static item-state" style="width:15%">',
                '<span class="item-state {{resultColor}}">{{resultText}}</span>',
                '</div>',
                '<div class="list-group-item-cell item-icon" style="width:5%">',
                '<i class="icon icon-arrow-right"></i>',
                '</div>',
                '</div>',
                '<div class="list-group-sub">',
                '<div class="m-c-panel" mode="n-select-radio">',
                '<div class="m-c-head">结果</div>',
                '<div class="m-c-body m-c-ring clearfix" value-list="1]=[]=[合格],[2]=[]=[不合格">',
                '<div class="w-option">',
                '<span class="w-option-content actual-result" data-value="{{Result}}">{{resultText}}</span>',
                '<div class="w-option-icon">',
                '<svg width="15px" height="26px" viewBox="0 0 15 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',
                '<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="square">',
                '<g transform="translate(-510.000000, -341.000000)" stroke="#BDBDBD" stroke-width="2">',
                '<g transform="translate(517.500000, 354.000000) rotate(-360.000000) translate(-517.500000, -354.000000) translate(510.000000, 341.000000)">',
                '<path d="M13.6388889,13.7272727 L1.36111111,24.6363636"></path>',
                '<path d="M2.80555556,1.54545455 L13.6388889,13.9090909"></path></g></g></g>',
                '</svg></div> </div></div></div>',
                '{{ITEMControl}}',
                '<div class="m-c-panel">',
                '<div class="m-c-head">备注</div>',
                '<div class="m-c-body m-c-input clearfix ">',
                '<textarea rows="2" placeholder="备注" class="actual-remark">{{Remark}}</textarea>',
                '</div></div>',
                '</div>', //填表单
                '</li>'].join(""),

            ITEM: {
                CheckZace: [
                    '<div class="m-c-panel" mode="n-input" style="display:none">',
                    '<div class="m-c-head">实际值</div>',
                    '<div class="m-c-body m-c-input clearfix">',
                    '<input class="actual-value" type="text" placeholder="请输入实际值" value="{{defaultValue}}" ></input>',
                    '</div> </div>',
                ].join(""),
                Text: [
                    '<div class="m-c-panel" mode="n-input" >',
                    '<div class="m-c-head">实际值</div>',
                    '<div class="m-c-body m-c-input clearfix">',
                    '<input class="actual-value" type="text" placeholder="请输入实际值" value="{{defaultValue}}"  data-type="{{standardType}}"  data-min="{{standardLeft}}"  data-max="{{standardRight}}"  data-standard="{{standardValue}}" ></input>',
                    '</div> </div>',
                ].join(""),
                Combo: [
                    '<div class="m-c-panel" mode="n-select-radio">',
                    '<div class="m-c-head">选项</div>',
                    '<div class="m-c-body m-c-ring clearfix" value-list={{ValueSource}}>',
                    '<div class="w-option">',
                    '<span class="w-option-content actual-value" data-value="{{defaultValue}}" data-standard="{{standardValue}}" >{{defaultValueText}}</span>',
                    '<div class="w-option-icon">',
                    '<svg width="15px" height="26px" viewBox="0 0 15 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',
                    '<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="square">',
                    '<g transform="translate(-510.000000, -341.000000)" stroke="#BDBDBD" stroke-width="2">',
                    '<g transform="translate(517.500000, 354.000000) rotate(-360.000000) translate(-517.500000, -354.000000) translate(510.000000, 341.000000)">',
                    '<path d="M13.6388889,13.7272727 L1.36111111,24.6363636"></path>',
                    '<path d="M2.80555556,1.54545455 L13.6388889,13.9090909"></path>',
                    '</g> </g> </g> </svg>',
                    '</div> </div> </div> </div>',
                ].join(""),
                Number: [
                    '<div class="m-c-panel" mode="n-input" >',
                    '<div class="m-c-head">实际值{{unit}}</div>',
                    '<div class="m-c-body m-c-input clearfix">',
                    '<input class="actual-value" type="number" placeholder="请输入实际值" value="{{defaultValue}}" ',
                    '    data-type="{{standardType}}"  data-min="{{standardLeft}}"  data-max="{{standardRight}}"  data-standard="{{standardValue}}" ></input>',
                    '</div> </div>',
                ].join(""),
                Check: [
                    '<div class="m-c-panel " mode="n-select-checkbox" data-type="{{standardType}}"  style="{{display}}" >',
                    '<div class="m-c-head">实际值</div>',
                    '<div class="m-c-body m-c-ring clearfix" value-list={{ValueSource}}>',
                    '<div class="w-option">',
                    '<span class="w-option-content actual-value" data-value="{{defaultValue}}"   data-standard="{{standardValue}}" >{{defaultValueText}}</span>',
                    '<div class="w-option-icon">',
                    '<svg width="15px" height="26px" viewBox="0 0 15 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',
                    '<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="square">',
                    '<g transform="translate(-510.000000, -341.000000)" stroke="#BDBDBD" stroke-width="2">',
                    '<g transform="translate(517.500000, 354.000000) rotate(-360.000000) translate(-517.500000, -354.000000) translate(510.000000, 341.000000)">',
                    '<path d="M13.6388889,13.7272727 L1.36111111,24.6363636"></path>',
                    '<path d="M2.80555556,1.54545455 L13.6388889,13.9090909"></path>',
                    '</g> </g> </g> </svg>',
                    '</div> </div> </div> </div>',
                ].join(""),
            },
            DIALOGS: {
                SELECT: ['<div class="multi-box {{sid}}" style="display:block;">',
                    '<div class="multi-select clearfix">',
                    '<div class="multi-bg">',
                    '<ul>{{list}}</ul>',
                    '</div>',
                    '</div>{{btn}}',
                    '</div>'].join(""),
                S_CHECKBOX: ['<li>',
                    '<label class="col-flex clearfix" for="S_CHECKBOX{{key}}">',
                    '<div class="col-item">',
                    '<span>{{value}}</span>',
                    '</div>',
                    '<div class="col-item">',
                    '<div class="m-checkbox-box">',
                    '<input type="checkbox" {{disabled}} name="CHECKBOX" data-value="{{key}}" data-name="{{value}}" id="S_CHECKBOX{{key}}">',
                    '<label for="S_CHECKBOX{{key}}"></label>',
                    '</div>',
                    '</div>',
                    '</label>',
                    '</li>'].join(""),
                S_RADIO: ['<li>',
                    '<label class="col-flex clearfix" for="S_RADIO{{key}}">',
                    '<div class="col-item">',
                    '<span>{{value}}</span>',
                    '</div>',
                    '<div class="col-item">',
                    '<div class="m-checkbox-box">',
                    '<input type="radio" {{disabled}} name="RADIO" data-value="{{key}}" data-name="{{value}}" id="S_RADIO{{key}}">',
                    '<label for="S_RADIO{{key}}"></label>',
                    '</div>',
                    '</div>',
                    '</label>',
                    '</li>'].join(""),
                BTN: {
                    CLOSE: ['<div class="multi-btn">',
                        '<a href="javascript:;" class="btn btn-primary confirm">{{btn}}</a>',
                        '</div>'].join(""),
                    CONFIRM: ['<div class="multi-btn clearfix">',
                        '<div class="multi-flex">',
                        '<a href="javascript:;" class="btn close">取消</a>',
                        '</div>',
                        '<div class="multi-flex">',
                        '<a href="javascript:;" class="btn btn-primary confirm">确定</a>',
                        '</div>',
                        '</div>'].join(""),
                },

            },
        };
        HTMLDone = {
            SUB_LIST: ['<li class="list-li">',
                '<div class="list-group-item"  data-id="{{ID}}">',
                '<div class="list-group-item-cell item-static item-title"  style="width:46%">',
                '<span>{{Text}}</span>',
                '</div>',
                '<div class="list-group-item-cell item-static item-time" style="width:38%">',
                '<span>{{Standard}}</span>',
                '</div>',
                '<div class="list-group-item-cell item-static item-state" style="width:16%">',
                '<span class="item-state ">{{resultText}}</span>',
                '</div>',
                '<div class="list-group-item-cell item-icon" style="width:5%">',
                '<i class="icon icon-arrow-right"></i>',
                '</div>',
                '</div>',
                '<div class="list-group-sub">',
                '<div class="m-c-panel" mode="n-input" >',
                '<div class="m-c-head">结果</div>',
                '<div class="m-c-body m-c-input clearfix">',
                '<input class="actual-result text-darkgrey2" type="text"   readonly="readonly" data-value="{{Result}}" value="{{resultText}}" ></input>',
                '</div> </div>',
                '<div class="m-c-panel" mode="n-input"  style="display:{{IsDisplay}}">',
                '<div class="m-c-head">实际值{{Unit}}</div>',
                '<div class="m-c-body m-c-input clearfix">',
                '<input class="actual-value" type="text"  readonly="readonly" value="{{DefaultValue}}" ></input>',
                '</div> </div>',
                '<div class="m-c-panel">',
                '<div class="m-c-head">备注</div>',
                '<div class="m-c-body m-c-input clearfix ">',
                '<textarea rows="3" placeholder="" readonly="readonly" class="actual-remark">{{Remark}}</textarea>',
                '</div></div>',
                '</div>', //填表单
                '</li>'].join(""),
        };


        (function () {
            KEYWORD_LISTFOne = [

                "OrderNo|订单",
                "CustomerName|局段",
                "LineName|修程",
                "PartNo|车号",
                "StationName|工位",
                "PartPointName|工序",


            ];

            KEYWORDFOne = {};

            TypeSourceFOne = {};

            $.each(KEYWORD_LISTFOne, function (i, item) {
                var detail = item.split("|");
                KEYWORDFOne[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined,
                };
                if (detail.length > 2) {
                    FORMATTRTFOne[detail[0]] = $com.util.getFormatter(TypeSourceFOne, detail[0], detail[2]);
                }
            });

        })();
        (function () {
            KEYWORD_LIST_ROLE = [
                "mStartTime|开始时间|Date",
                "mEndTime|结束时间|Date",
                "CustomerID|配属局段|ArrayOne",
                "ProductID|车型|ArrayOne",
                "LineID|修程|ArrayOne",
                "Status|状态|ArrayOne",

            ];
            FORMATTRT_ROLE = {};
            KEYWORD_ROLE = {};


            TypeSource_ROLE = {
                CustomerID: [{
                    name: "全部",
                    value: 0,
                }],
                ProductID: [{
                    name: "全部",
                    value: 0,
                }],
                LineID: [{
                    name: "全部",
                    value: 0,
                }],
                Status: [
                    {
                        name: "保存",
                        value: 1,
                    }, {
                        name: "下达",
                        value: 2,
                    }, {
                        name: "已确认",
                        value: 3,
                    }, {
                        name: "开工",
                        value: 4,
                    },
                    {
                        name: "完工",
                        value: 5,
                    },
                    {
                        name: "暂停",
                        value: 6,
                    },
                    {
                        name: "终止",
                        value: 7,
                    },
                    {
                        name: "提交",
                        value: 8,
                    },
                    {
                        name: "待主任调度审批",
                        value: 9,
                    },
                    {
                        name: "主任调度已驳回",
                        value: 10,
                    },
                    {
                        name: "待生产管理室审批",
                        value: 11,
                    },
                    {
                        name: "生产管理室已驳回",
                        value: 12,
                    },
                    {
                        name: "待制造中心审批",
                        value: 13,
                    },
                    {
                        name: "制造中心已驳回",
                        value: 14,
                    },
                    {
                        name: "制造中心已审批",
                        value: 15,
                    },
                    {
                        name: "待公司副总审批",
                        value: 16,
                    },
                    {
                        name: "公司副总已驳回",
                        value: 17,
                    },
                    {
                        name: "公司副总已审批",
                        value: 18,
                    },
                ],
            };
            $.each(KEYWORD_LIST_ROLE, function (i, item) {
                var detail = item.split("|");
                KEYWORD_ROLE[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                };
                if (detail.length > 2) {
                    FORMATTRT_ROLE[detail[0]] = $com.util.getFormatter(TypeSource_ROLE, detail[0], detail[2]);
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


                //查询
                $("body").delegate("#femi-add-searchOrder", "click", function () {
                    var default_value = {
                        // MonthNum: (new Date()).getMonth() + 1,

                        mStartTime: $com.util.format('yyyy-MM-dd', new Date(mStartTime)),
                        mEndTime: $com.util.format('yyyy-MM-dd', new Date(mEndTime)),
                    };

                    $("body").append($com.modal.show(default_value, KEYWORD_ROLE, "查询", function (rst) {


                        if (!rst || $.isEmptyObject(rst))
                            return;


                        mStartTime = $com.util.format('yyyy-MM-dd', new Date(rst.mStartTime));
                        mEndTime = $com.util.format('yyyy-MM-dd', new Date(rst.mEndTime));

                        model.com.refreshOrder();


                    }, TypeSource_ROLE));


                });

                //refreshItem
                $("body").delegate("#femi-item-detailRefresh", "click", function () {

                    $com.app.loading('数据加载中...');
                    model.com.get({
                        // EventID: 2002,
                        SFCTaskIPTID: mCheckID,

                    }, function (data) {
                        // if (data.ProblemList.length > 0) {

                        //     for (var m = 0; m < data.ProblemList.length; m++) {
                        //         data.list.push(data.ProblemList[m].IPTItem);

                        //     }

                        // } mProblemList = $com.util.Clone(data.ProblemList);

                        mZaceItemList = $com.util.Clone(data);
                        $com.util.deleteLowerProperty(data.info);
                        mInfo = $com.util.Clone(data.info);
                        //model.com.render(data.info);
                        var _list = $com.util.Clone(data);
                        model.com.rederItemList(_list);
                        model.com.filterOne(data.info);
                        $com.app.loaded();
                    });

                });
                $("body").delegate(".zace-undone", "click", function () {

                    var $this = $(this);
                    $this.addClass('active');
                    $(".zace-done").removeClass('active');
                    $(".zaceUnDoneMode").show();
                    $(".zaceDoneMode").hide();

                    $com.app.loading('数据加载中...');
                    DoneBool = true;

                    model.com.get({
                        // EventID: 2002,
                        SFCTaskIPTID: mCheckID,

                    }, function (data) {

                        // if (data.ProblemList.length > 0) {

                        //     for (var m = 0; m < data.ProblemList.length; m++) {
                        //         data.list.push(data.ProblemList[m].IPTItem);

                        //     }

                        // }

                        // mProblemList = $com.util.Clone(data.ProblemList);
                        mZaceItemList = $com.util.Clone(data);
                        $com.util.deleteLowerProperty(data.info);
                        mInfo = $com.util.Clone(data.info);
                        //model.com.render(data.info);
                        var _list = $com.util.Clone(data);
                        model.com.rederItemList(_list);
                        model.com.filterOne(data.info);
                        $com.app.loaded();
                    });

                });

                $("body").delegate(".zace-done", "click", function () {
                    var $this = $(this);
                    var $this = $(this);
                    $this.addClass('active');
                    $(".zace-undone").removeClass('active');
                    $(".zaceUnDoneMode").hide();
                    $(".zaceDoneMode").show();
                    $com.app.loading('数据加载中...');
                    DoneBool = false;

                    model.com.get({
                        // EventID: 2002,
                        SFCTaskIPTID: mCheckID,

                    }, function (data) {

                        // if (data.ProblemList.length > 0) {

                        //     for (var m = 0; m < data.ProblemList.length; m++) {
                        //         data.list.push(data.ProblemList[m].IPTItem);

                        //     }

                        // }
                        // mProblemList = $com.util.Clone(data.ProblemList);

                        mZaceItemList = $com.util.Clone(data);
                        $com.util.deleteLowerProperty(data.info);
                        mInfo = $com.util.Clone(data.info);
                        //model.com.render(data.info);
                        var _list = $com.util.Clone(data);
                        model.com.filterOne(data.info);
                        model.com.rederItemList(_list);
                        $com.app.loaded();
                    });


                });


                //:not(selector)选择除stop-expand外其他所有选择器
                $(".m-card").delegate(".list-group-item:not(.stop-expand)", "click", function (e) {
                    var $this = $(this),
                        $expand = $this.find(".item-icon .icon"),
                        //里面是否已经有表单
                        IDs = $this.attr("data-id");
                    //icon-arrow-expand这个选择器在Css中(transform: rotate(90deg);旋转90度)
                    if ($expand.hasClass("icon-arrow-expand")) {
                        $expand.removeClass("icon-arrow-expand");
                        //siblings找同级元素
                        $Result = $this.siblings().find(".m-c-body .w-option-content.actual-result");

                        var result = Number($Result.attr("data-value"));

                        $this.find("span.item-state").html(STATUS[result]);
                        $this.find("span.item-state").attr("class", "item-state " + COLOUR[result]);

                        $this.siblings('.list-group-sub').hide(); //ul元素消失
                    } else {
                        $Result = $this.siblings().find(".m-c-body .w-option-content.actual-result");
                        $expand.addClass("icon-arrow-expand");
                        $this.siblings('.list-group-sub').show(); //ul显示

                    }


                    $(".handle-info .list-group li").each(function (i, item) {
                        $(item).find('.item-check').css('height', $(item).find('.list-group-item').height() + 10 + 'px');
                        $(item).find('.item-check').css('line-height', $(item).find('.list-group-item').height() + 10 + 'px');

                    });

                    e.stopPropagation(); //阻止事件冒泡
                    e.preventDefault(); //preventDefault() 方法阻止元素发生默认的行为
                });


                $("body").delegate("#femi-orderAll-tbody tr", "dblclick", function () {


                    var $this = $(this);
                    var WID = Number($this.find('td[data-title=ID]').attr('data-value'));
                    mOrderNowID = WID;
                    model.com.refreshStation(WID);
                    $(".orderAll").hide();
                    $(".stationAll").show();
                    $(".itemAll").hide();
                    $("#role-user-contain").hide();

                });


                $("body").delegate("#femi-stationAll-tbody tr", "dblclick", function () {


                    var $this = $(this);
                    var WID = Number($this.find('td[data-title=ID]').attr('data-value'));
                    mStationNowID = WID;
                    model.com.refreshStepList(WID);

                    $(".orderAll").hide();
                    $(".stationAll").hide();
                    $(".itemAll").show();
                    $("#role-user-contain").hide();

                });

                $("body").delegate("#femi-userStep-tbody tr", "dblclick", function () {


                    var $this = $(this);
                    var WID = Number($this.find('td[data-title=ID]').attr('data-value'));
                    mStepNowID = WID;
                    model.com.refreshStepItemList(WID);

                    $(".orderAll").hide();
                    $(".stationAll").hide();
                    $(".itemAll").show();
                    $("#role-user-contain").hide();


                });


                $("body").delegate("#femi-StepItem-tbody tr", "dblclick", function () {


                    var $this = $(this);
                    var WID = Number($this.find('td[data-title=ID]').attr('data-value'));
                    mCheckID = WID;
                    model.com.refreshStepCheckItemList();

                    $(".orderAll").hide();
                    $(".stationAll").hide();
                    $(".itemAll").show();
                    $("#role-user-contain").show();


                });

                $("body").delegate("#femi-close-detailRefresh", "click", function () {
                    $(".orderAll").hide();
                    $(".stationAll").hide();
                    $(".itemAll").show();
                    $("#role-user-contain").hide();


                });


                $("body").delegate("#femi-add-refresOrder", "click", function () {
                    model.com.refreshOrder();


                });


                $("body").delegate("#femi-add-refreshStation", "click", function () {
                    model.com.refreshStation(mOrderNowID);


                });


                $("body").delegate("#femi-add-userStep", "click", function () {
                    model.com.refreshStepList(mStationNowID);


                });


                $("body").delegate("#femi-active-stepItem", "click", function () {
                    model.com.refreshStepItemList(mStepNowID);


                });


                $("body").delegate("#femi-return-userStep", "click", function () {
                    $(".orderAll").hide();
                    $(".stationAll").show();
                    $(".itemAll").hide();
                    $("#role-user-contain").hide();


                });

                $("body").delegate("#femi-return-searchStation", "click", function () {
                    $(".orderAll").show();
                    $(".stationAll").hide();
                    $(".itemAll").hide();
                    $("#role-user-contain").hide();


                });
            },

            run: function () {

                mCustomerID = 0;
                mLineID = 0;
                mProductID = 0;
                mStartTime = $com.util.format('yyyy-MM-dd', new Date() - 14 * 1000 * 60 * 60 * 24);
                mEndTime = $com.util.format('yyyy-MM-dd', new Date());
                model.com.refreshOrder();


            },

            com: {

                refreshOrder: function () {


                    model.com.getOrderList({

                        CustomerID: mCustomerID,
                        LineID: mLineID,
                        ProductID: mProductID,
                        PartNo: "",
                        StartTime: mStartTime,
                        EndTime: mEndTime,

                    }, function (resP) {
                        if (!resP)
                            return;
                        if (resP && resP.list) {
                            var _list = $com.util.Clone(resP.list);
                            DataOrderList = $com.util.Clone(resP.list);//订单

                            for (var m = 0; m < _list.length; m++) {
                                _list[m].WID = m + 1;
                                if (_list[m].RealReceiveDate < '2010-01-01') {
                                    _list[m].RealReceiveDate = '-';
                                }
                                if (_list[m].PlanFinishDate < '2010-01-01') {
                                    _list[m].PlanFinishDate = '-';
                                }
                                if (_list[m].RealFinishDate < '2010-01-01') {
                                    _list[m].RealFinishDate = '-';
                                }


                            }

                            $("#femi-orderAll-tbody").html($com.util.template(_list, HTML.TableOrderNode));
                            $("#femi-orderAll-tbody tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);


                            });
                        }


                    });
                },
                refreshStation: function (mOrderID) {


                    model.com.getStationList({

                        OrderID: mOrderID,


                    }, function (resP) {
                        if (!resP)
                            return;
                        if (resP && resP.list) {
                            var _list = $com.util.Clone(resP.list);
                            DataStationList = $com.util.Clone(resP.list);//订单

                            for (var m = 0; m < _list.length; m++) {
                                _list[m].WID = m + 1;

                                if (_list[m].StartWorkTime < '2010-01-01') {
                                    _list[m].StartWorkTime = '-';
                                }

                            }

                            $("#femi-stationAll-tbody").html($com.util.template(_list, HTML.TableStationNode));
                            $("#femi-stationAll-tbody tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);


                            });
                        }


                    });
                },

                refreshStepList: function (mOrderID) {


                    model.com.getStepList({

                        APSTaskPartID: mOrderID,


                    }, function (resP) {
                        if (!resP)
                            return;
                        if (resP && resP.list) {
                            var _list = $com.util.Clone(resP.list);
                            DataStepList = $com.util.Clone(resP.list);//订单

                            for (var m = 0; m < _list.length; m++) {
                                _list[m].WID = m + 1;


                            }

                            $.each(_list, function (i, item) {
                                for (var p in item) {
                                    if (!FORMATTRT_ROLE[p])
                                        continue;
                                    item[p] = FORMATTRT_ROLE[p](item[p]);
                                }
                            });

                            $("#femi-userStep-tbody").html($com.util.template(_list, HTML.TableStepNode));
                            $("#femi-userStep-tbody tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);


                            });
                        }


                    });
                },

                refreshStepItemList: function (mOrderID) {


                    model.com.getCheckList({

                        APSTaskStepID: mOrderID,


                    }, function (resP) {
                        if (!resP)
                            return;
                        if (resP && resP.list) {
                            var _list = $com.util.Clone(resP.list);
                            DataStepCheckList = $com.util.Clone(resP.list);//订单

                            for (var m = 0; m < _list.length; m++) {
                                _list[m].WID = m + 1;


                            }

                            $.each(_list, function (i, item) {
                                for (var p in item) {
                                    if (!FORMATTRT_ROLE[p])
                                        continue;
                                    item[p] = FORMATTRT_ROLE[p](item[p]);
                                }
                            });

                            $("#femi-StepItem-tbody").html($com.util.template(_list, HTML.TableStepItemNode));
                            $("#femi-StepItem-tbody tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);


                            });
                        }


                    });
                },

                refreshStepCheckItemList: function () {


                    $com.app.loading('数据加载中...');
                    DoneBool = true;

                    model.com.get({
                        // EventID: 2002,
                        SFCTaskIPTID: mCheckID,

                    }, function (data) {


                        mZaceItemList = $com.util.Clone(data);
                        $com.util.deleteLowerProperty(data.info);
                        mInfo = $com.util.Clone(data.info);
                        //model.com.render(data.info);
                        var _list = $com.util.Clone(data);
                        model.com.rederItemList(_list);
                        model.com.filterOne(data.info);
                        $com.app.loaded();
                    });
                },
                //获取订单集合
                getOrderList: function (data, fn, context) {
                    var d = {
                        $URI: "/OMSOrder/RFOrderList",
                        $TYPE: "get",
                        $SERVER: '/MESAPS',

                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                //获取工位任务集合
                getStationList: function (data, fn, context) {
                    var d = {
                        $URI: "/APSTaskPart/RFList",
                        $TYPE: "get",
                        $SERVER: '/MESAPS',

                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                //获取工序任务集合
                getStepList: function (data, fn, context) {
                    var d = {
                        $URI: "/APSTaskStep/RFTaskList",
                        $TYPE: "get",
                        $SERVER: '/MESAPS',

                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                //获取检验单集合
                getCheckList: function (data, fn, context) {
                    var d = {
                        $URI: "/SFCTaskIPT/RFTaskList",
                        $TYPE: "get",
                        $SERVER: '/MESQMS',

                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                //获取检验项
                get: function (data, fn, context) {
                    var d = {
                        $URI: "/SFCTaskIPT/IPTItemList",
                        $TYPE: "get",
                        $SERVER: '/MESQMS',

                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                rederValueList: function (list) {
                    var _data = {};
                    if (!list || list.length < 1)
                        return _data;

                    $.each(list, function (i, item) {
                        _data[item.IPTItemID] = item;
                    });
                    return _data;
                },

                changesourceString: function (source) {
                    var ValueSource = "",
                        sourceArray = [];
                    if (!source || source.length < 1)
                        return ValueSource;
                    $.each(source, function (i, item) {
                        sourceArray.push(item + "]=[]=[" + item);
                    });
                    ValueSource = sourceArray.join("],[");
                    return ValueSource;
                },
                filterOne: function (data) {
                    var _data = [],
                        _status = "";

                    for (var p in data) {
                        var o = KEYWORDFOne[p];
                        if (o) {
                            _data[Number(o.index)] = {
                                name: o.name,
                                value: data[p] === "" ? "&nbsp;" : data[p],
                            };
                        }
                    }


                    $(".zace-basic .m-detail-list").html($com.util.template(_data, HTML.LIST));

                },

                rederItemList: function (data) {

                    model._list = [];
                    var list = [],
                        htmlTemp = HTML.ITEM.Text,
                        _value = model.com.rederValueList(data.list);


                    wlist = [];
                    wlistDown = [];
                    for (var m = 0; m < data.ValueList.length; m++) {


                        for (var i = 0; i < data.DoneList.length; i++) {
                            if (data.ValueList[m].IPTItemID == data.DoneList[i].ID) {
                                var _item = {
                                    ISCheck: "checked",
                                    ISDisabled: "disabled",
                                    IsDisplay: data.DoneList[i].StandardType == 15 ? 'none' : 'inline',
                                    ID: data.DoneList[i].ID,
                                    Text: data.DoneList[i].Text,
                                    Standard: data.DoneList[i].Details,
                                    resultText: data.ValueList[m].Result == 0 ? STATUS[1] : STATUS[data.ValueList[m].Result],
                                    resultColor: data.ValueList[m].Result == 0 ? COLOUR[1] : COLOUR[data.ValueList[m].Result],
                                    Remark: data.ValueList[m].Remark,
                                    Result: data.ValueList[m].Result,
                                    DefaultValue: data.ValueList[m].Value,
                                    Unit: data.DoneList[i].Unit.length > 0 ? '【' + data.DoneList[i].Unit + '】' : '',
                                };

                                wlistDown.push(_item);
                                data.DoneList.splice(i, 1);
                                i--;
                            }

                        }


                    }

                    $.each(data.ToDoList, function (i, item) {


                        var iptValue = {
                            ID: 0,
                            IPTItemID: item.ID,
                            StandardID: 0,
                            Value: "",
                            Remark: "",
                            Result: 1,
                            TaskID: Number(model.query.id),
                            IPTMode: 6,
                            ItemType: item.ItemType,

                        };

                        model._list.push(iptValue);

                        // if (!_value[item.IPTItem.ID] || _value[item.IPTItem.ID].ID <= 0) {
                        //     model._list.push(iptValue);
                        // }


                        var _item = {
                            ID: item.ID,
                            Text: item.Text,
                            Standard: item.Details,
                            resultText: STATUS[0],
                            resultColor: COLOUR[0],
                            // Remark: _value[item.ID] ? _value[item.ID].Remark : "",
                            // Result: _value[item.ID] ? _value[item.ID].Result : 1,
                            // resultText : STATUS[_value[item.ID] ? _value[item.ID].Result : 1],
                            // resultColor : COLOUR[_value[item.ID] ? _value[item.ID].Result : 1],
                            ItemControl: {
                                unit: item.Unit.length > 0 ? '【' + item.Unit + '】' : '',
                                //defaultValue: item.DefaultValue,
                                defaultValueText: item.DefaultValue && item.DefaultValue.length > 0 ? item.DefaultValue : "请选择",
                                standardValue: item.StandardValue,
                                ValueSource: model.com.changesourceString(item.ValueSource),
                                standardType: item.StandardType,
                                //display: (_value[item.iD] ? _value[item.iD].result : 1) == 2 ? "display:none;" : "",
                                standardLeft: item.StandardLeft,
                                standardRight: item.StandardRight,
                            },
                        };

                        for (var m = 0; m < data.ValueList.length; m++) {

                            if (item.ID == data.ValueList[m].IPTItemID) {

                                _item.Remark = data.ValueList[m].Remark;
                                _item.Result = data.ValueList[m].Result;
                                _item.resultText = data.ValueList[m].Result == 0 ? STATUS[1] : STATUS[data.ValueList[m].Result];
                                _item.resultColor = data.ValueList[m].Result == 0 ? COLOUR[1] : COLOUR[data.ValueList[m].Result];
                                _item.ItemControl.defaultValue = data.ValueList[m].Value;

                                data.ValueList.splice(m, 1);
                                m--;

                            }

                        }


                        switch (item.StandardType) {
                            case 0:
                                htmlTemp = HTML.ITEM.Text;
                                break;
                            case 1:
                                htmlTemp = HTML.ITEM.Combo;
                                break;
                            case 2:
                            case 3:
                            case 4:
                            case 5:
                            case 6:
                            case 7:
                            case 8:
                            case 9:
                            case 10:
                                htmlTemp = HTML.ITEM.Number;
                                break;
                            case 11:
                                htmlTemp = HTML.ITEM.Check;
                                break;
                            case 12:
                                htmlTemp = HTML.ITEM.Check;
                                break;
                            case 15:
                                htmlTemp = HTML.ITEM.CheckZace;
                                break;
                            default:
                                htmlTemp = HTML.ITEM.Text;
                                break;
                        }
                        _item.ITEMControl = $com.util.template(_item.ItemControl, htmlTemp);


                        wlist.push(_item);


                    });
                    mListall = wlist;
                    if (DoneBool) {
                        // $('.zace-confirm').show();
                        // $('#checkDone').text("已做");
                        $(".handle-info .list-group").html($com.util.template(wlist, HTMLDone.SUB_LIST));
                    } else {
                        // $('.zace-confirm').hide();
                        // $('#checkDone').text("未做");
                        $(".handle-info .list-group").html($com.util.template(wlistDown, HTMLDone.SUB_LIST));
                    }


                    $(".handle-info .list-group li").each(function (i, item) {
                        $(item).find('.item-check').css('height', $(item).find('.list-group-item').height() + 10 + 'px');
                        $(item).find('.item-check').css('line-height', $(item).find('.list-group-item').height() + 10 + 'px');

                    });

                },

            },
        });

        model.init();
    });