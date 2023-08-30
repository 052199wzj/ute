require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/paging', '../static/utils/js/base/base', '../static/utils/js/ganttGZWUtil'],
    function ($zace, $page, $com, $ganttWeek) {

        var KEYWORD_Level_LIST,
            KEYWORD_Level,
            FORMATTRT_Level,
            DEFAULT_VALUE_Level,
            TypeSource_Level,
            model,
            DataAll,
            DATABasic,
            DATABasicPro,
            wFormPropertyList,
            DataAllPro,
            DataAllFactorySearchPro,
            DataAllConfirmBasic,
            DataAllConfirmChange,
            DataAllConfirm,
            DataAllSearch,
            DataAllFactorySearch,
            RouteID,
            DTAddedStart,
            DTAddedEnd,
            DTValidUntilStart,
            DTValidUntilEnd,
            _UserIDList = "",
            mQueryTaskID,
            _CertificationIDList = "",
            _QualificationStatus = "",
            styleControl = undefined,
            Order = 0,
            mCloneDatalaunch = [],
            HTML;

        RouteID = 0;
        DataTempCertification = [];
        CloneDataTempCertification = [];
        AuthorizerInfoName = "";
        CertificationID = 0,
            _IDNameParentID = [];
        _IDNameParentIDAdd = [];
        IDandName = [],
            IDandNameAdd = [],
            CertificationInfo = [],
            DataAll = [];
        DATABasic = [];
        DataAllConfirmBasic = [];
        DataAllConfirmChange = [];
        CertificationFilesPath = [];
        DataAllConfirm = [];
        DataAllFactorySearch = DataAllSearch = [];
        CertificationInfoTemp = {
            CertificationInfo: { CertificationID: 0 },
            CertificationNo: "",
            DTValidUntil: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
            AuthorizerInfo: { ID: 0 },
            CertificationFilesPath: [],
        };
        CertificationInfoUpdate = {
            DBID: 0,
            CertificationInfo: { CertificationID: 0 },
            CertificationNo: "",
            DTValidUntil: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
            AuthorizerInfo: { ID: 0 },
            CertificationFilesPath: [],
        };
        var MTCProperty = [{
            Name: '单据编号',
            TiTle: 'Code',
            Value: '',
        }, {
            Name: '发起人',
            TiTle: 'UpFlowName',
            Value: '',
        }];;

        HTML = {
            IMG: '<li class="upload-img"><img src="{{Src}}" data-id="{{Id}}"></li>',
            IMGSrc: '<img style="width: 60px;height: 60px;"  src="{{Src}}">',
            module_Process: [
                '<ul class="list-group1">',
                '<li class="list-li upload-img" data-id="{{ID}}">',
                '<div class="list-group-item" style="background-color: #f5f5f5;">',
                '<div class="list-group-item-cell item-static item-title" style="width:90%;font-size: 16px;">',
                '<div class="ds-bpm-btn-group-process">',
                '<div class="ds-bpm-btn-process" style="color: #4c4c4c;width: 38%;vertical-align: middle;">{{Name}}</div>',
                '<div class="ds-bpm-btn-process" style="color: #25acde;width: 25%;vertical-align: middle;text-align: center;">{{Assignee}}</div>',
                '<div class="ds-bpm-btn-process" style="color: #4c4c4c;width: 18%;vertical-align: middle;">{{EndTime}}</div>',
                '<div class="ds-bpm-btn-process" style="color: #4c4c4c;width: 18%;vertical-align: middle;">{{EndTime}}</div>',
                '<div class="ds-bpm-btn-process" style="color: {{ReasonColor}};width: 18%;vertical-align: middle;">{{deleteReason}}</div>',
                '</div>',
                '</div>',
                '<div class="list-group-item-cell item-icon" style="width:10%">',
                '<i class="icon icon-arrow-right"></i>',
                '</div>',
                '</div>',
                '<div class="list-group" style="display: none;">',
                '{{History_ITEM}}',
                '</div></div>',
                '</li>',
                '</ul>',
            ].join(""),
            CertificateRequest: [
                '<div class="multi-flex" style="clear: both;">',
                '<div class="multi-flex m-detail-titlel"',
                'style="width: 30%;font-size: 18px;text-align: right;display: inline-block;">',
                '<label>{{Name}}</label>',
                '</div>',
                '<div class="multi-flex m-detail-titler"',
                'style="width: 69%;font-size: 18px;display: inline-block;text-align: left;">',
                '<input type="text" readonly="readonly" value="{{Value}}" style="border: none;" />',
                '</div>',
                '</div>',
            ].join(""),
            TableMode: [
                '<tr>',
                '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
                '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
                '<td data-title="CertificationName" data-value="{{CertificationName}}" >{{CertificationName}}</td>',
                '<td data-title="CertificationNo" data-value="{{CertificationNo}}" >{{CertificationNo}}</td>',
                '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
                '<td data-title="DTValidUntil" data-value="{{DTValidUntil}}" >{{DTValidUntil}}</td>',
                '<td data-title="StatusText" data-value="{{StatusText}}" >{{StatusText}}</td>',
                '<td data-title="Certificationdetail" data-value="{{}}" ><span id="Check" style="color: #da3705">查看证书</span></td>',
                '<td style="min-width: 50px;display:none" data-title="CertificationFilesPath" data-value="{{certificationFilesPath}}">{{CertificationFilesPath}}</td> ',

                '<td style="min-width: 40px" data-title="Handle" data-value="{{ID}}"><div class="row">',
                // '<div class="col-md-4 {{ISAllowed}}" id="Edit">修改</div>',
                '<div class="col-md-6 {{ISDelete}}" id="Delete">撤销</div>',
                '<div class="col-md-6" id="DownLoad">下载</div>',
                '</td>',

                '</tr>',
            ].join(""),

            TableProcessingMode: [
                '<tr>',
                '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
                '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
                '<td data-title="UpFlowName" data-title="UpFlowName" data-value="{{UpFlowName}}">{{UpFlowName}}</td> ',
                '<td data-title="CertificationName" data-value="{{CertificationName}}" >{{CertificationName}}</td>',
                '<td data-title="CertificationNo" data-value="{{CertificationNo}}" >{{CertificationNo}}</td>',
                '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
                '<td data-title="DTValidUntil" data-value="{{DTValidUntil}}" >{{DTValidUntil}}</td>',
                '<td data-title="Certificationdetail" data-value="{{}}" ><span id="Check" style="color: #da3705">查看证书</span></td>',
                '<td style="min-width: 50px;display:none" data-title="CertificationFilesPath" data-value="{{certificationFilesPath}}">{{CertificationFilesPath}}</td> ',

                '<td style="min-width: 40px" data-title="Handle" data-value="{{ID}}"><div class="row">',
                '<div class="col-md-4 " id="rejected">驳回</div>',
                '<div class="col-md-4 " id="agree">同意</div>',
                '<div class="col-md-4" id="DownLoad">下载</div>',
                '</td>',

                '</tr>',
            ].join(""),

            TableFinishedMode: [
                '<tr>',
                '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
                '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
                '<td data-title="UpFlowName" data-title="UpFlowName" data-value="{{UpFlowName}}">{{UpFlowName}}</td> ',
                '<td data-title="CertificationName" data-value="{{CertificationName}}" >{{CertificationName}}</td>',
                '<td data-title="CertificationNo" data-value="{{CertificationNo}}" >{{CertificationNo}}</td>',
                '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
                '<td data-title="DTValidUntil" data-value="{{DTValidUntil}}" >{{DTValidUntil}}</td>',
                '<td data-title="StatusText" data-value="{{StatusText}}" >{{StatusText}}</td>',
                '<td data-title="Certificationdetail" data-value="{{}}" ><span id="Check" style="color: #da3705">查看证书</span></td>',
                '<td style="min-width: 50px;display:none" data-title="CertificationFilesPath" data-value="{{certificationFilesPath}}">{{CertificationFilesPath}}</td> ',
                '</tr>',
            ].join(""),

        };
        (function () {
            KEYWORD_Level_LIST = [
                "CreateTime|添加日期|DateTime",
                "CertificationName|证书名称|ArrayOne",
                "CertificationNo|证书编号",
                "ID|审核人ID",
                "DTAddedStart|添加开始时间|DateTime",
                "DTAddedEnd|添加开始时间|DateTime",
                "DTValidUntilStart|添加开始时间|DateTime",
                "DTValidUntilEnd|添加开始时间|DateTime",
                "DTValidUntil|有效期至|DateTime",
                "EditTime|时间|DateTime",
            ];
            KEYWORD_Level = {};
            FORMATTRT_Level = {};
            DEFAULT_VALUE_Level = {
                CertificationName: "",
                CertificationNo: "",
                DTValidUntil: "",
                ID: 0,
            };
            TypeSource_Level = {
                CertificationName: [],
                QualificationStatus: [{
                    name: "默认",
                    value: "0"
                }, {
                    name: "未提交",
                    value: 1
                }, {
                    name: "审核中",
                    value: 2
                }, {
                    name: "未通过",
                    value: 3
                }, {
                    name: "生效中",
                    value: 4
                }, {
                    name: "已失效",
                    value: 5
                },],
            };
            $.each(CertificationInfo, function (i, item) {
                TypeSource_Level.CertificationName.push({
                    name: item.CertificationName,
                    value: item.CertificationID
                });
            });
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
            KEYWORD_AdminQueryList_LIST = [
                "CreateTime|添加日期|DateTime",
                "EmployeeName|用户|Array",
                "CertificationNo|证书编号",
                "ID|审核人ID",
                "CertificationName|证书名称|Array",
                "DTAddedStart|添加开始时间|DateTime",
                "DTAddedEnd|添加开始时间|DateTime",
                "DTValidUntilStart|添加开始时间|DateTime",
                "DTValidUntilEnd|添加开始时间|DateTime",
                "DTValidUntil|有效期至|DateTime",
                "QualificationStatus|证书状态|Array",
                "EditTime|时间|DateTime",
            ];
            KEYWORD_AdminQueryList = {};
            FORMATTRT_AdminQueryList = {};
            DEFAULT_VALUE_AdminQueryList = {
                EmployeeName: "",
                CertificationName: 0,
                QualificationStatus: "",
            };
            TypeSource_AdminQueryList = {
                EmployeeName: [],
                CertificationName: [{
                    value: 0,
                    name: "所有证书"
                }],
                QualificationStatus: [{
                    name: "所有状态",
                    value: "0"
                }, {
                    name: "未提交",
                    value: 1
                }, {
                    name: "审核中",
                    value: 2
                }, {
                    name: "未通过",
                    value: 3
                }, {
                    name: "生效中",
                    value: 4
                }, {
                    name: "已失效",
                    value: 5
                },],
            };
            $.each(CertificationInfo, function (i, item) {
                TypeSource_AdminQueryList.EmployeeName.push({
                    value: item.CertificationID,
                    name: item.CertificationName,
                });
            });
            $.each(KEYWORD_AdminQueryList_LIST, function (i, item) {
                var detail = item.split("|");
                KEYWORD_AdminQueryList[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };
                if (detail.length > 2) {
                    FORMATTRT_AdminQueryList[detail[0]] = $com.util.getFormatter(TypeSource_AdminQueryList, detail[0], detail[2]);
                }
            });




        })();


        model = $com.Model.create({
            name: '资质管理',

            type: $com.Model.MAIN,

            configure: function () {
                this.run();

            },

            events: function () {
                //多条件查询证书
                $("body").delegate("#lmvt-search", "click", function () {

                    DTAddedStart = $("#lmvt-DTAddedStart").val();
                    DTAddedEnd = $("#lmvt-DTAddedEnd").val();

                    if (DTAddedStart == "") {
                        DTAddedStart = $com.util.format("yyyy-MM-dd", new Date().getTime() - 7 * 24 * 3600 * 1000);
                    };
                    if (DTAddedEnd == "") {
                        DTAddedEnd = $com.util.format("yyyy-MM-dd", new Date().getTime() + 7 * 24 * 3600 * 1000);
                    };
                    switch (Order) {
                        case 1:
                            model.com.refreshlaunch(DTAddedStart, DTAddedEnd);
                            break;
                        case 2:
                            model.com.refreshProcessing(DTAddedStart, DTAddedEnd)
                            break;
                        case 3:
                            model.com.refreshFinished(DTAddedStart, DTAddedEnd)
                            break;
                        default: break;
                    }

                }),

                    //查看证书 #代表取id属性的标签
                    $("body").delegate("#Check", "click", function () {
                        var $this = $(this);
                        var $tr = $this.parents("tr"),
                            CertificationFilesPath = $tr.find("td[data-title=CertificationFilesPath]").attr("data-value");
                        var $src = $com.imageUrl + CertificationFilesPath;
                        $("#cby-route-charf-apply img").attr("src", $src);
                        model.com.imgShow("#outerdiv", "#innerdiv", "#bigimg", $("#cby-route-charf-apply img"));
                    });

                $.fn.datetimepicker.dates['zh'] = {
                    days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
                    daysShort: ["日", "一", "二", "三", "四", "五", "六", "日"],
                    daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
                    months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                    monthsShort: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"],
                    meridiem: ["上午", "下午"],
                    //suffix:      ["st", "nd", "rd", "th"],
                    today: "今天"
                };
                $("#starttime,#endtime").datetimepicker({
                    language: 'zh',  //用自己设置的时间文字
                    //weekStart: 1,  //一周从那天开始，默认为0，从周日开始，可以设为1从周一开始
                    // startDate:"2018-5-20", //开始时间，可以写字符串，也可以直接写日期格式new Date(),在这之前的日期不能选择
                    //endDate:"2018-6-20",
                    //daysOfWeekDisabled: [0,4,6],  //一周的周几不能选
                    todayBtn: 1,  //是否显示今天按钮，0为不显示
                    autoclose: 1, //选完时间后是否自动关闭
                    todayHighlight: 1,  //高亮显示当天日期
                    startView: 2, //0从小时视图开始，选分;1	从天视图开始，选小时;2从月视图开始，选天;3从年视图开始，选月;4从十年视图开始，选年
                    minView: 0,//最精确时间，默认0；0从小时视图开始，选分；1从天视图开始，选小时；2从月视图开始，选天；3从年视图开始，选月；4从十年视图开始，选年
                    //maxView:4,  //默认值：4, ‘decade’
                    //keyboardNavigation:true,  //是否可以用键盘方向键选日期，默认true
                    forceParse: 0, //强制解析,你输入的可能不正规，但是它胡强制尽量解析成你规定的格式（format）
                    format: 'yyyy-mm-dd hh:ii:ss',// 格式,注意ii才是分，mm或MM都是月
                    minuteStep: 5, //选择分钟时的跨度，默认为5分钟
                    //pickerPosition:"top-right",  // ‘bottom-left’，’top-right’，’top-left’’bottom-right’
                    showMeridian: 0, //在日期和小时选择界面，出现上下午的选项,默认false
                    // showSecond: false,
                    // showMillisec: true,
                    //timeFormat: 'hh:mm:ss:l',
                    //bootcssVer: 3,
                });
                $("body").delegate("textarea.ds-prop-write-ctrl,input.ds-prop-write-ctrl,.ds-prop-write-ctrl textarea,.ds-prop-write-ctrl input", "input", function () {
                    $this = $(this);
                    $this.attr("data-value", $this.val());
                });
                $("body").delegate(".Write-Control-DTValidUntil .m-c-body .w-option .Write-content-DTValidUntil", "change", function () {
                    $this = $(this);
                    $this.attr("data-value", $this.val());
                });
                $("body").delegate(".Write-content-CertificationFilesPath", "change", function () {
                    var self = this,
                        _data = self.files[0];
                    if (_data) {

                        if (_data.size > (1024 * 1024 * 10)) {
                            alert("请上传小于10M的图片！");
                            clearFiles();
                            return;
                        }

                        if (!extLimit(['jpg', 'png', 'gif', 'bmp', 'jpeg']).has(_data.name)) {
                            alert("请上传正确的图片！");
                            clearFiles();
                            return;
                        }

                        var form = new FormData();
                        form.append("file", _data);

                        //alert(_data.name);
                        $.ajax({ //
                            url: "/MESCore/api/Upload/Submit",
                            type: "POST",
                            data: form,
                            processData: false,
                            contentType: false,
                            dataType: "JSON"
                        }).done(function (data) {

                            if (data.resultCode === 1000) {
                                var $p = $(self).parent();
                                //  $p.before('.upload-btn').remove();
                                $p.before($com.util.template({
                                    Src: data.returnObject.file_id,
                                    Id: data.returnObject.file_id
                                }, HTML.IMG));


                            } else {
                                alert("上传失败，请重新再试");
                            }

                            clearFiles();
                        });
                    }

                    function clearFiles() {
                        self.value = "";
                    }

                    function extLimit(exts) {
                        return {
                            has: function (file) {
                                var arr = file.split("."),
                                    ext = arr[arr.length - 1].toLowerCase();

                                return exts.indexOf(ext) > -1 ? true : false;
                            }
                        };
                    }
                });
                // 事件选择
                $("body").delegate(".nav-pills li", "click", function () {
                    $(".nav-pills li").each(function (i, item) {
                        $(item).removeClass("active");
                    });
                    var $this = $(this);
                    $this.addClass("active");
                    if (Order == Number($this.attr("data-value"))) {
                        return false;
                    }
                    else
                        Order = Number($this.attr("data-value"));
                    switch (Order) {
                        case 1:
                            model.com.refreshlaunch(StartTime, EndTime);
                            break;
                        case 2:
                            model.com.refreshProcessing(StartTime, EndTime)
                            break;
                        case 3:
                            model.com.refreshFinished(StartTime, EndTime)
                            break;
                        default: break;
                    }
                });
                //上传图片
                $("body").delegate("#input-file", "input", function () {
                    var $this = $(this);
                    CertificationInfoTemp.CertificationFilesPath = "";
                    CertificationFilesPath = [];
                    if (this.files.length == 0)
                        return;
                    if (!extLimit(['png', 'jpg']).has(this.files[0].name)) {
                        alert("请上传正确的图片文件！");
                        clearFiles();
                        return;
                    }
                    for (j = 0; j < this.files.length; j++) {
                        var fileData = this.files[j];
                        var form = new FormData();
                        form.append("file", fileData);
                        model.com.postImport(form, function (res) {
                            if (!res)
                                return;
                            CertificationFilesPath.push(res.file_url);
                        });
                    };

                    function clearFiles() {
                        self.value = "";
                    }

                    function extLimit(exts) {
                        return {
                            has: function (file) {
                                var arr = file.split("."),
                                    ext = arr[arr.length - 1].toLowerCase();

                                return exts.indexOf(ext) > -1 ? true : false;
                            }
                        };
                    }
                });

                $("body").delegate("#close", "click", function () {
                    model.com.refreshmodal();
                });

                // 提交证书
                $("body").delegate("#Confirm", "click", function () {
                    $com.app.loading();
                    var $this = $(this);
                    mCloneData["Status"] = 1;
                    mConfirmTitle = $(this).find("a").text();
                    model.com.handleDate();
                });
                // 驳回证书
                $("body").delegate("#rejected", "click", function () {
                    $com.app.loading();
                    var $this = $(this);
                    var $tr = $this.parents("tr"),
                        wID = $tr.find("td[data-title=ID]").attr("data-value");
                    var SelectData = mCloneDatalaunch.filter((item) => { return item.ID == wID });
                    var StepID = SelectData[0].StepID;
                    model.com.getTaskInfoByTaskID({
                        ID: wID
                    }, [function (data) {
                        wData = data.list;
                        wData.Status = 1;
                        model.com.postTask({ "TaskID": StepID, "data": wData }, function (res) {
                            alert("提交成功！");
                            model.com.refreshProcessing();
                        });
                    }
                    ]);
                });
                // 同意证书
                $("body").delegate("#agree", "click", function () {
                    $com.app.loading();
                    var $this = $(this);
                    var $tr = $this.parents("tr"),
                        wID = $tr.find("td[data-title=ID]").attr("data-value");
                    var SelectData = mCloneDatalaunch.filter((item) => { return item.ID == wID });
                    var StepID = SelectData[0].StepID;
                    model.com.getTaskInfoByTaskID({
                        ID: wID
                    }, [function (data) {
                        wData = data.list;
                        wData.Status = 20;
                        model.com.postTask({ "TaskID": StepID, "data": wData }, function (res) {
                            alert("提交成功！");
                            model.com.refreshProcessing();
                        });
                    }
                    ]);

                });
                //增加证书
                $("body").delegate("#zace-add-level", "click", function () {
                    $("#input-file").val("");
                    $("#input-file").click();
                    TypeSource_Level.CertificationName = [];
                    for (j = 0; j < _IDNameParentIDAdd.length; j++) {
                        var SelectData = IDandName.filter((item) => { return item.value == _IDNameParentIDAdd[j].inGroupID });
                        TypeSource_Level.CertificationName.push({
                            value: _IDNameParentIDAdd[j].value,
                            name: _IDNameParentIDAdd[j].name + "_" + SelectData[0].name,
                        });
                    }
                    DEFAULT_VALUE_Level = {
                        CertificationName: "",
                        CertificationNo: "",
                        DTValidUntil: "",
                    };

                    $("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "新增", function (rst) {
                        //调用插入函数 
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        CertificationInfoTemp.CertificationInfo.CertificationID = rst.CertificationName;
                        CertificationInfoTemp.CertificationNo = rst.CertificationNo;
                        CertificationInfoTemp.DTValidUntil = rst.DTValidUntil;
                        CertificationInfoTemp.AuthorizerInfo.ID = 0;
                        if (CertificationFilesPath == "") {
                            alert("请上传证书图片");
                            return
                        }
                        CertificationInfoTemp.CertificationFilesPath = CertificationFilesPath;

                        model.com.postPersonalList({
                            data: CertificationInfoTemp,
                        }, function (res) {
                            alert("新增成功");
                            model.com.refresh();
                        })
                    }, TypeSource_Level));
                    TypeSource_Level.CertificationName = [];
                });


                //修改证书
                $("body").delegate("#Edit", "click", function () {
                    $("#input-file").val("");
                    $("#input-file").click();
                    var $this = $(this);
                    var $tr = $this.parents("tr"),
                        DBID = $tr.find("td[data-title=DBID]").attr("data-value");
                    CertificationName = $tr.find("td[data-title=CertificationName]").attr("data-value");
                    CertificationNo = $tr.find("td[data-title=CertificationNo]").attr("data-value");
                    DTValidUntil = $tr.find("td[data-title=DTValidUntil]").attr("data-value");
                    _CertificationFilesPath = $tr.find("td[data-title=CertificationFilesPath]").attr("data-value");
                    var temData = DATABasicPro.filter((item) => { return item.certificationName == CertificationName });
                    _CertificationNameID = temData[0].certificationID;
                    TypeSource_Level.CertificationName = [];
                    for (j = 0; j < _IDNameParentIDAdd.length; j++) {
                        var SelectData = IDandName.filter((item) => { return item.value == _IDNameParentIDAdd[j].inGroupID });
                        TypeSource_Level.CertificationName.push({
                            value: _IDNameParentIDAdd[j].value,
                            name: _IDNameParentIDAdd[j].name + "_" + SelectData[0].name,
                        });
                    }
                    var DEFAULT_VALUE_Level = {
                        CertificationName: _CertificationNameID,
                        CertificationNo: CertificationNo,
                        DTValidUntil: DTValidUntil,
                    }
                    $("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "修改", function (rst) {
                        //调用插入函数 
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        CertificationInfoUpdate.DBID = DBID;
                        CertificationInfoUpdate.CertificationInfo.CertificationID = rst.CertificationName;
                        CertificationInfoUpdate.CertificationNo = rst.CertificationNo;
                        CertificationInfoUpdate.DTValidUntil = rst.DTValidUntil;
                        CertificationInfoUpdate.AuthorizerInfo.ID = 0;
                        if (CertificationFilesPath == "") {
                            CertificationInfoUpdate.CertificationFilesPath = _CertificationFilesPath;
                        } else {
                            CertificationInfoUpdate.CertificationFilesPath = CertificationFilesPath;
                        }

                        model.com.postPersonalListUpdate({
                            data: CertificationInfoUpdate,
                        }, function (res) {
                            alert("修改成功");
                            model.com.refresh();
                        })

                    }, TypeSource_Level));

                });

                //撤销证书
                $("body").delegate("#Delete", "click", function () {
                    var $this = $(this);
                    var $tr = $this.parents("tr"),
                        WID = $tr.find("td[data-title=WID]").attr("data-value");
                    ID = $tr.find("td[data-title=ID]").attr("data-value");
                    if (!confirm("确定将第" + WID + "条证书撤销吗？")) {
                        return;
                    }
                    var SelectData = mCloneDatalaunch.filter((item) => { return item.ID == ID });
                    model.com.deleteProcessInstance({
                        processInstanceId: SelectData[0].FlowID, deleteReason: "申请撤销", ID: ID, FlowType: SelectData[0].FlowType
                    }, function (res) {
                        alert("撤销完成");
                        model.com.refreshlaunch(StartTime, EndTime);
                    })
                    model.com.refresh();
                });



                //多项证书撤销
                $("body").delegate("#zace-delete-level", "click", function () {
                    //获取界面显示数据
                    var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "WID", DataAll);

                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return;
                    }
                    //需要删除的
                    var _IDList = [];
                    //不能删除的
                    var forbidlist = [];
                    for (var i = 0; i < SelectData.length; i++) {
                        _IDList.push(SelectData[i]["DBID"]);
                        if (SelectData[i]["QualificationStatus"] == "审核中" || SelectData[i]["QualificationStatus"] == "生效中") {
                            forbidlist.push(SelectData[i]["WID"])
                        }
                    };
                    if (forbidlist.length != 0) {
                        var wid = "";
                        for (var j = 0; j < forbidlist.length; j++) {
                            wid = wid + "," + forbidlist[j];
                        }
                        alert("请勿撤销，第" + wid + "条证书正在审核或已生效");
                        return;
                    }
                    model.com.postdeletelist({
                        IDList: _IDList,
                    }, function (res) {
                        alert("撤销完成");
                        model.com.refresh();
                    })

                    model.com.refresh();
                });

                //下载证书
                $("body").delegate("#DownLoad", "click", function () {
                    var $this = $(this);
                    var $tr = $this.parents("tr"),
                        CertificationFilesPath = $tr.find("td[data-title=CertificationFilesPath]").attr("data-value");
                    var src = $com.imageUrl + CertificationFilesPath;
                    var SelectData = mCloneDatalaunch.filter((item) => { return item.CertificationFilesPath == CertificationFilesPath });
                    //下载图片
                    function downloadImage(src) {
                        var a = $("<a></a>").attr("href", src).attr("download", SelectData[0].CertificationNo).appendTo("body");

                        a[0].click();
                        a.remove();
                    }
                    downloadImage(src);

                });
            },





            run: function () {
                mQueryTaskID = model.query.stepid;
                wType = Number(model.query.typefq);
                wID = Number(model.query.id);
                StartTime = $com.util.format("yyyy-MM-dd", new Date().getTime() - 7 * 24 * 3600 * 1000);
                EndTime = $com.util.format("yyyy-MM-dd", new Date().getTime() + 7 * 24 * 3600 * 1000);
                if (!mQueryTaskID) {
                    mQueryTaskID = 0;
                }

                $("#lmvt-DTAddedStart").datetimepicker({
                    format: 'yyyy-mm-dd hh:ii', //显示格式
                    // startView: 2,
                    minView: 0,
                    maxView: 2,
                    language: 'zh-CN',
                    autoclose: 1, //选择后自动关闭
                    clearBtn: false, //清除按钮
                }).on('changeDate', function (ev) {
                    var DTAddedStart = $("#lmvt-DTAddedStart").val();
                    $("#lmvt-DTAddedEnd").datetimepicker("setStartDate", DTAddedStart);
                });
                $("#lmvt-DTAddedEnd").datetimepicker({
                    format: 'yyyy-mm-dd hh:ii', //显示格式
                    // startView: 2,
                    minView: 0,
                    maxView: 2,
                    language: 'zh-CN',
                    autoclose: 1, //选择后自动关闭
                    clearBtn: false, //清除按钮
                }).on('changeDate', function (ev) {
                    var DTAddedEnd = $("#lmvt-DTAddedEnd").val();
                    $("#lmvt-DTAddedStart").datetimepicker("setEndDate", DTAddedEnd.toString("yyyy-MM-dd"));

                });
                username = window.parent._UserAll;
                $.each(username, function (i, item) {
                    TypeSource_AdminQueryList.EmployeeName.push({
                        value: item.ID,
                        name: item.Name,
                    });
                });
                $("#finishedTable").hide();
                $("#ProcessingTable").hide();
                $("#luanchtable").hide();
                model.com.getCertificationNametree();
                model.com.refresh();
                model.com.getMustDo(StartTime, EndTime);
                model.com.getHasDo(StartTime, EndTime);
                model.com.getNews(StartTime, EndTime);
            },

            com: {
                //已提交
                refreshlaunch: function (StartTime, EndTime) {
                    $com.app.loading('数据加载中...');
                    mCloneDatalaunch = [];
                    model.com.getEmployeeAll({
                        TagType: 2,
                        StartTime: StartTime,
                        EndTime: EndTime,
                    }, function (data) {
                        mCloneDatalaunch = data.list;
                        mCloneDatalaunch = mCloneDatalaunch.reverse();
                        $.each(mCloneDatalaunch, function (i, item) {
                            for (var p in item) {
                                if (p == "certificationInfo") {
                                    var ID = item[p]["CertificationID"];
                                    var SelectData = CloneDataTempCertification.filter((item) => { return item.value == ID });
                                    item.CertificationName = SelectData[0].name;

                                };
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            };
                            item.WID = i + 1;
                        });
                        DataAll = $com.util.Clone(mCloneDatalaunch);
                        DataAllFactorySearch = $com.util.Clone(mCloneDatalaunch);
                        $("#finishedTable").hide();
                        $("#ProcessingTable").hide();
                        $("#luanchtable").show();
                        model.com.RanderCodeList(mCloneDatalaunch);
                    });
                    $com.app.loaded();
                },

                //发起数量
                getMustDo: function (StartTime, EndTime) {
                    model.com.getEmployeeAll({
                        TagType: 2,
                        StartTime: StartTime,
                        EndTime: EndTime,
                    }, function (data) {
                        $("#MustDo1").text(data.info);
                    })
                },

                //待办
                refreshProcessing: function (StartTime, EndTime) {
                    $com.app.loading('数据加载中...');
                    mCloneDatalaunch = [];
                    model.com.getEmployeeAll({
                        TagType: 1,
                        StartTime: StartTime,
                        EndTime: EndTime,
                    }, function (data) {
                        mCloneDatalaunch = data.list;
                        mCloneDatalaunch = mCloneDatalaunch.reverse();
                        $.each(mCloneDatalaunch, function (i, item) {
                            for (var p in item) {
                                if (p == "certificationInfo") {
                                    var ID = item[p]["CertificationID"];
                                    var SelectData = CloneDataTempCertification.filter((item) => { return item.value == ID });
                                    item.CertificationName = SelectData[0].name;

                                };
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            };
                            item.WID = i + 1;
                        });
                        DataAll = $com.util.Clone(mCloneDatalaunch);
                        DataAllFactorySearch = $com.util.Clone(mCloneDatalaunch);
                        $("#luanchtable").hide();
                        $("#finishedTable").hide();
                        $("#ProcessingTable").show();
                        model.com.RanderProcessingList(mCloneDatalaunch);
                    });
                    $com.app.loaded();
                },
                //待办数量
                getHasDo: function (StartTime, EndTime) {
                    model.com.getEmployeeAll({
                        TagType: 1,
                        StartTime: StartTime,
                        EndTime: EndTime,
                    }, function (data) {
                        $("#HasDo2").text(data.list.length);
                    })
                },

                //已办
                refreshFinished: function (StartTime, EndTime) {
                    $com.app.loading('数据加载中...');
                    mCloneDatalaunch = [];
                    model.com.getEmployeeAll({
                        TagType: 4,
                        StartTime: StartTime,
                        EndTime: EndTime,
                    }, function (data) {
                        mCloneDatalaunch = data.list;
                        mCloneDatalaunch = mCloneDatalaunch.reverse();
                        $.each(mCloneDatalaunch, function (i, item) {
                            for (var p in item) {
                                if (p == "certificationInfo") {
                                    var ID = item[p]["CertificationID"];
                                    var SelectData = CloneDataTempCertification.filter((item) => { return item.value == ID });
                                    item.CertificationName = SelectData[0].name;
                                };
                                if (!FORMATTRT_Level[p])
                                    continue;
                                item[p] = FORMATTRT_Level[p](item[p]);
                            };
                            item.WID = i + 1;
                        });
                        DataAll = $com.util.Clone(mCloneDatalaunch);
                        DataAllFactorySearch = $com.util.Clone(mCloneDatalaunch);
                        $("#luanchtable").hide();
                        $("#ProcessingTable").hide();
                        $("#finishedTable").show();
                        model.com.RanderFinishedList(mCloneDatalaunch);
                    });
                    $com.app.loaded();
                },

                //已办数量
                getNews: function (StartTime, EndTime) {
                    model.com.getEmployeeAll({
                        TagType: 4,
                        StartTime: StartTime,
                        EndTime: EndTime,
                    }, function (data) {
                        $("#News3").text(data.list.length);
                    })
                },

                refresh: function (data) {
                    $com.app.loading('数据加载中...');
                    var taskIDObj = {
                        key: "_1201"
                    };
                    if (mQueryTaskID <= 0) {
                        //启动任务 processDefinitionKey流程定义key
                        model.com.onTask({
                            processDefinitionKey: taskIDObj.key,
                            BusinessKey: "",
                            data: {}
                        }, [function (data) {
                            //获取实例ID
                            mCloneData = data.data;

                            $com.util.deleteLowerProperty(mCloneData);
                            mCloneListRead = $com.util.Clone(mCloneData);
                            mCloneListRead.CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', mCloneListRead.CreateTime);;
                            Todotasks = data.list[0];
                            model.com.RunTask(data.list[0]);

                        }, function () {
                            setTimeout(function () {
                                // if (window.history.length > 0) {
                                //     window.JSImpl.exit();
                                // } else {
                                //     window.location = "certification_Listfq.html";
                                // }
                            }, 1000);
                        }]);
                    } else {
                        model.com.getTaskInfoByTaskID({
                            ID: wID
                        }, [function (data) {

                            if (data.msg.length != 0) {
                                alert(data.msg);
                                setTimeout(function () {
                                    if (window.history.length > 0) {
                                        window.JSImpl.exit();
                                    } else {
                                        window.location = "certification_cl.html";
                                    }
                                }, 1000);
                            }

                            mCloneData = data.list;
                            mCloneListRead = $com.util.Clone(mCloneData);
                            for (j = 0; j < _IDNameParentIDAdd.length; j++) {
                                var SelectData = IDandName.filter((item) => { return item.value == _IDNameParentIDAdd[j].inGroupID });
                                CertificationName.push({
                                    value: _IDNameParentIDAdd[j].value,
                                    name: _IDNameParentIDAdd[j].name + "_" + SelectData[0].name,
                                });
                            }
                            var temp = CertificationName.filter((item) => { return item.value == mCloneListRead.CertificationInfo.CertificationID });
                            if (temp.length != 0) {
                                mCloneListRead.CertificationID = temp[0].name; //配合显示证书名称
                            }
                            $com.util.deleteLowerProperty(mCloneData);
                            // 根据任务ID获取任务
                            model.com.getTask({ taskId: mQueryTaskID }, function (res) {
                                Todotasks = res.info;
                                if (Todotasks.Status != 0) {
                                    alert("该任务已完成！");
                                    setTimeout(function () {
                                        if (window.history.length > 0) {
                                            window.JSImpl.exit();
                                        } else {
                                            window.location = "certification_cl.html";
                                        }
                                    }, 1000);
                                }
                                model.com.RunTask(Todotasks);
                            });
                        }, function () {
                            setTimeout(function () {
                                if (window.history.length > 0) {
                                    window.JSImpl.exit();
                                } else {
                                    window.location = "certification_cl.html";
                                }
                            }, 1000);
                        }]);
                    }
                },
                handleDate: function () {
                    FilePath = [];
                    $(".Write-Control-CertificationFilesPath .m-c-upload ul.upload-list li.upload-img img").each(function (i, item) {
                        var $Image = $(item),
                            Src = $Image.attr("data-id");
                        if (!FilePath)
                            FilePath = [];
                        FilePath.push(Src);
                    });
                    StringFilePath = FilePath.join(",");
                    $(".Write-Control-CertificationFilesPath .m-c-upload ul.upload-list li.upload-btn input").attr("data-value", StringFilePath);
                    if ($(".Write-Control-CertificationID").is(":visible")) {
                        var TargetName = $(".Write-content-CertificationID").val();
                        var TargeID = $(".Write-content-CertificationID").attr("data-value");
                        var TargetStockID = $(".Write-content-CertificationID").attr("data-value");
                        if (TargetName == "" && TargeID == 0 && TargetStockID != 0) {
                            alert("请选择证书名称！");
                            return false;
                        }
                    }
                    if ($(".Write-Control-CertificationNo").is(":visible")) {
                        var TargetName = $(".Write-content-CertificationNo").val();
                        if (TargetName == "") {
                            alert("请填写证书编号！");
                            return false;
                        }
                    }
                    if ($("#endtime").is(":visible")) {
                        var wantTime = $("#endtime").val();
                        //  var DTValidUntilStart = $(".Write-content-DTValidUntil").val();
                        var Endtime = $com.util.toDate(wantTime);
                        var now = new Date();
                        if (Endtime.getTime() <= now.getTime()) {
                            alert("请填写正确时间！");
                            return false;
                        }
                    }
                    model.com.addCheck();
                },
                addCheck: function () {


                    mCloneData.ExpectedTime = $com.util.format('yyyy-MM-dd hh:mm:ss', mCloneData.ExpectedTime);
                    mCloneData.CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date());
                    mCloneData.SubmitTime = $com.util.format('yyyy-MM-dd hh:mm:ss', mCloneData.SubmitTime);
                    mCloneData.CertificationFilesPath_ = "";
                    var _IsWrite = true;

                    for (var i = 0; i < wFormPropertyList.length; i++) {

                        if (!wFormPropertyList[i].IsWritable) {
                            if (!mCloneData.hasOwnProperty(wFormPropertyList[i].Key) && wFormPropertyList[i].Key.indexOf("ID") != -1) {
                                mCloneData[wFormPropertyList[i].Key] = 0;
                            } else if (!mCloneData.hasOwnProperty(wFormPropertyList[i].Key) && wFormPropertyList[i].Key.indexOf("Time") != -1) {
                                mCloneData[wFormPropertyList[i].Key] = "2000-01-01 01:01:01";
                            } else if (!mCloneData.hasOwnProperty(wFormPropertyList[i].Key) && wFormPropertyList[i].Key.indexOf("Name") != -1) {
                                mCloneData[wFormPropertyList[i].Key] = "";
                            }
                            continue;
                        }
                        //此控件填寫方式是否是唯一的
                        var $WriteContent = $(".Write-content-" + wFormPropertyList[i].Key + ":visible");
                        if (!$WriteContent[0]) {
                            wFormPropertyList[i].Value = mCloneData[wFormPropertyList[i].Key];
                            wFormPropertyList[i].ValueText = mCloneData[wFormPropertyList[i].Key];
                            // if (!mCloneData[wFormPropertyList[i].Key]) {
                            //     alert(wFormPropertyList[i].Name + "必填，控件不存在!");
                            //     return false;
                            // }
                        } else {
                            wFormPropertyList[i].Value = $(".Write-content-" + wFormPropertyList[i].Key + ":visible").attr("data-value");
                            wFormPropertyList[i].ValueText = $(".Write-content-" + wFormPropertyList[i].Key + ":visible").val();
                            if (wFormPropertyList[i].IsRequired && !wFormPropertyList[i].Value) {
                                alert(wFormPropertyList[i].Name + "必填!");
                                return false;
                            }
                        }
                        if (_IsWrite) {
                            if (wFormPropertyList[i].Key == "CertificationID") {
                                mCloneData.CertificationInfo.CertificationID = $('.selectpicker').selectpicker('val');
                                var SelectData = IDandName.filter((item) => { return item.value == mCloneData.CertificationInfo.CertificationID });

                                mCloneData.CertificationInfo.CertificationName = SelectData[0].name;
                            }
                            if (wFormPropertyList[i].Key == "CertificationFilesPath") {

                                mCloneData[wFormPropertyList[i].Key] = wFormPropertyList[i].Value.split(",");
                            }

                            if (wFormPropertyList[i].Key == "CertificationNo") {
                                mCloneData[wFormPropertyList[i].Key] = wFormPropertyList[i].Value;
                                mCloneData[wFormPropertyList[i].Key + "_txt_"] = $.isEmptyObject(wFormPropertyList[i].ValueText + "") ? mCloneData[wFormPropertyList[i].Key] : wFormPropertyList[i].ValueText;
                            }
                            if (wFormPropertyList[i].Key == "DTValidUntil") {
                                mCloneData[wFormPropertyList[i].Key] = $("#endtime").val();
                            }
                        }
                    }
                    mCloneData.Status = 1;
                    mCloneData.InformShift_txt_ = mCloneData.InformShift == 0 ? "否" : "是";
                    mCloneData.CertificationFilesPath_txt_ = mCloneData.CertificationFilesPath.join(",");
                    // 完成当前任务
                    $com.app.loaded();
                    if (confirm("确定提交证书吗")) {

                        model.com.postTask({ "TaskID": Todotasks.ID, "data": mCloneData }, function (res) {
                            alert("提交成功！");
                            $('#myModal').modal('hide');
                            $('body').on('hidden.bs.modal', '.modal', function () { $(this).removeData('bs.modal'); });
                            model.com.refreshlaunch();
                            model.com.refreshmodal();
                        });
                    }
                    else {
                        return false;
                    }


                },
                RunTask: function (Todotasks) {
                    if (!Todotasks) {
                        alert("未获取到任务！");
                        return false;
                    }
                    mTaskID = Todotasks.ID;
                    var moveCarProcess = Todotasks.ProcessDefinitionId;
                    // 根据流程定义ID和节点ID获取 ， 属性表信息
                    model.com.getForm({ definitionId: moveCarProcess, activitiId: Todotasks.ActivitiID }, function (res) {
                        wForm = res.info;
                        mIsReadableList = [];
                        wFormPropertyList = wForm.FormProperty;
                        if (!styleControl) {
                            styleControl = document.createElement("style");
                            styleControl.type = "text/css";
                            $("head").append(styleControl);
                        }
                        var _styleText = "";

                        for (var i = 0; i < wForm.FormProperty.length; i++) {
                            $(".ds-head-" + wForm.FormProperty[i].Key).text(wForm.FormProperty[i].Name);
                            //将所有可写控件显示
                            if (wForm.FormProperty[i].IsWritable) {
                                _styleText += ".Write-Control-" + wForm.FormProperty[i].Key + "{display:block;} "
                                //所有可写并且必填项显示*号

                                if (wForm.FormProperty[i].IsRequired) {
                                    $(".Write-Control-" + wForm.FormProperty[i].Key + " .ds-head-show").text("*");
                                }
                                //用于数据回显
                                $(".Write-content-" + wForm.FormProperty[i].Key).attr("data-value", mCloneData[wForm.FormProperty[i].Key]);
                                $(".Write-content-" + wForm.FormProperty[i].Key).val(mCloneData[MTCProperty[wForm.FormProperty[i].Key]]);


                            } else if (wForm.FormProperty[i].IsReadable) {
                                //取所有可读数据
                                mIsReadableList.push(wForm.FormProperty[i]);
                            }

                        }
                        $(styleControl).html(_styleText);

                        mIsReadableListCopy = $com.util.Clone(mIsReadableList);

                        //展示所有可读数据
                        for (x in mCloneListRead) {
                            for (var k = 0; k < mIsReadableListCopy.length; k++) {
                                if (mIsReadableListCopy[k].Key == x) {
                                    mIsReadableListCopy[k].Value = mCloneListRead[x];
                                }
                                if (mIsReadableListCopy[k].Value == "") {
                                    mIsReadableListCopy[k].Value = "-";
                                }
                            }
                        }
                        $(".CertificateRequestContent").html($com.util.template(mIsReadableListCopy, HTML.CertificateRequest));

                        $com.app.loaded();
                    });
                },
                render: function (wData) {
                    var wlist = [];
                    for (i = 0; i < wData.length; i++) {
                        // wData[i].Status = 5;
                        wData[i].Color = "#EEB422";
                        wData[i].CreateTime = $com.util.format("yyyy-MM-dd-hh-mm-ss", wData[i].CreateTime);
                        switch (wData[i].Status) {
                            case 20:
                                wData[i].StatusText = "已完工";
                                wData[i].Color = "green";
                                break;
                            case 21:
                                // wData[i].StatusText = "撤销";
                                wData[i].Color = "red";
                                break;
                            default:
                                break;
                        }
                        wData[i].PartNoName = wData[i].CarType + "#" + wData[i].PartNo;
                        wlist.push(wData[i]);
                    };

                    $(".m-table").html($com.util.template(wlist, HTML.LIST));
                },
                getCertificationNametree: function (Data) {
                    //得到所有证书名称，证书ID，证书所属ID
                    model.com.getGetAllItems({}, function (res) {
                        DATABasicPro = $com.util.Clone(res.list);
                        $.each(res.list, function (i, item) {
                            _IDNameParentID.push({
                                value: item.CertificationID,
                                name: item.certificationName,
                                inGroupID: item.inGroupID,
                            });
                        });
                    });
                    //得到激活证书名称，证书ID，证书所属ID
                    model.com.getGetAllItems({}, function (res) {
                        var list = [];
                        for (j = 0; j < res.list.length; j++) {
                            if (res.list[j].CertificationStatus == 1) {
                                list.push(res.list[j])
                            }
                        }
                        $.each(list, function (i, item) {
                            _IDNameParentIDAdd.push({
                                value: item.CertificationID,
                                name: item.certificationName,
                                inGroupID: item.inGroupID,
                            });
                        });
                        model.com.creatdrop();
                    });
                    //得到全部证书组树结构
                    model.com.getAllGroup({}, function (res) {
                        if (!res)
                            return;
                        var list = res.list;
                        //增加部分需要的数据
                        $.each(list, function (i, itemtemp) {
                            itemtemp.SonList = [];
                        });
                        _groupTree = model.com.buildTreePro(list);
                    });
                },
                creatdrop: function (Data) {
                    $(function () {

                        $(".selectpicker").selectpicker({
                            noneSelectedText: '请选择证书' //默认显示内容 
                        });
                        //数据赋值 
                        var select = $("#slpk");
                        for (j = 0; j < _IDNameParentIDAdd.length; j++) {
                            var SelectData = IDandName.filter((item) => { return item.value == _IDNameParentIDAdd[j].inGroupID });
                            k = j + 1;
                            DataTempCertification.push({
                                value: j + 1,
                                name: _IDNameParentIDAdd[j].name + "_" + SelectData[0].name,
                            });
                            CloneDataTempCertification.push({
                                value: _IDNameParentIDAdd[j].value,
                                name: _IDNameParentIDAdd[j].name + "_" + SelectData[0].name,
                            });
                            select.append("<option value=" + k + ">" + _IDNameParentIDAdd[j].name + "_" + SelectData[0].name + "</option>");
                        }
                        $('.selectpicker').selectpicker('val', '');
                        $('.selectpicker').selectpicker('refresh'); //刷新数据源
                        $(".bootstrap-select-searchbox input").removeAttr("disabled");
                    });
                },



                //刷新模态框
                refreshmodal: function (Data) {
                    var taskIDObj = {
                        key: "_1201"
                    };
                    model.com.onTask({
                        processDefinitionKey: taskIDObj.key,
                        BusinessKey: "",
                        data: {}
                    }, [function (data) {
                        mCloneData = data.data;
                        $com.util.deleteLowerProperty(mCloneData);
                        mCloneListRead = $com.util.Clone(mCloneData);
                        mCloneListRead.CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', mCloneListRead.CreateTime);;
                        Todotasks = data.list[0];
                        Todotasks = data.list[0];
                        if (!Todotasks) {
                            alert("未获取到任务！");
                            return false;
                        }
                        mTaskID = data.list[0].ID;
                        var moveCarProcess = Todotasks.ProcessDefinitionId;
                        model.com.getForm({ definitionId: moveCarProcess, activitiId: Todotasks.ActivitiID }, function (res) {
                            wForm = res.info;
                            mIsReadableList = [];
                            wFormPropertyList = wForm.FormProperty;
                            if (!styleControl) {
                                styleControl = document.createElement("style");
                                styleControl.type = "text/css";
                                $("head").append(styleControl);
                            }
                            var _styleText = "";

                            for (var i = 0; i < wForm.FormProperty.length; i++) {
                                $(".ds-head-" + wForm.FormProperty[i].Key).text(wForm.FormProperty[i].Name);
                                //将所有可写控件显示
                                if (wForm.FormProperty[i].IsWritable) {
                                    _styleText += ".Write-Control-" + wForm.FormProperty[i].Key + "{display:block;} "
                                    //所有可写并且必填项显示*号

                                    if (wForm.FormProperty[i].IsRequired) {
                                        $(".Write-Control-" + wForm.FormProperty[i].Key + " .ds-head-show").text("*");
                                    }
                                    //用于数据回显
                                    $(".Write-content-" + wForm.FormProperty[i].Key).attr("data-value", mCloneData[wForm.FormProperty[i].Key]);
                                    $(".Write-content-" + wForm.FormProperty[i].Key).val(mCloneData[MTCProperty[wForm.FormProperty[i].Key]]);


                                } else if (wForm.FormProperty[i].IsReadable) {
                                    //取所有可读数据
                                    mIsReadableList.push(wForm.FormProperty[i]);
                                }

                            }
                            $(styleControl).html(_styleText);

                            mIsReadableListCopy = $com.util.Clone(mIsReadableList);

                            //展示所有可读数据
                            for (x in mCloneListRead) {
                                for (var k = 0; k < mIsReadableListCopy.length; k++) {
                                    if (mIsReadableListCopy[k].Key == x) {
                                        mIsReadableListCopy[k].Value = mCloneListRead[x];
                                    }
                                    if (mIsReadableListCopy[k].Value == "") {
                                        mIsReadableListCopy[k].Value = "-";
                                    }
                                }
                            }

                            var timeinput = document.getElementById("endtime");
                            timeinput.value = ""
                            if ($(".upload-img").length > 0) {
                                var path = $(".upload-img");
                                path.remove();
                            };
                            $('.selectpicker').selectpicker('val', '');
                            $(".selectpicker").selectpicker('refresh');
                            $(".CertificateRequestContent").html($com.util.template(mIsReadableListCopy, HTML.CertificateRequest));
                        })

                    }]
                    )
                },
                //已提交表
                RanderCodeList: function (Data) {
                    $page.init($(".grinding-table"), Data, "", function (res) {
                        CodeRanderSource = res;
                        $("#femi-riskLevel-tbody").html($com.util.template(res, HTML.TableMode));
                    });

                },
                //待办表
                RanderProcessingList: function (Data) {
                    $page.init($(".processing-table"), Data, "", function (res) {
                        CodeRanderSource = res;
                        $("#femi-Processing-tbody").html($com.util.template(res, HTML.TableProcessingMode));
                    });

                },
                //已办表
                RanderFinishedList: function (Data) {
                    $page.init($(".finished-table"), Data, "", function (res) {
                        CodeRanderSource = res;
                        $("#femi-finished-tbody").html($com.util.template(res, HTML.TableFinishedMode));
                    });

                },
                //用人拿任务(单条)  ID 
                getEmployeeInfo: function (data, fn, context) {
                    var d = {
                        $URI: "/QMTask/Info",
                        $TYPE: "get",
                        $SERVER: "/MESWDW"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //用人拿任务
                getEmployeeAll: function (data, fn, context) {
                    var d = {
                        $URI: "/QMTask/EmployeeAll",
                        $TYPE: "get",
                        $SERVER: "/MESWDW"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //根据ID拿任务
                getTaskInfoByTaskID: function (data, fn, context) {
                    var d = {
                        $URI: "/QMTask/Info",
                        $TYPE: "get",
                        $SERVER: "/MESWDW"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                //启动任务 （通过流程定义的标识Key 开启一个流程实例）
                onTask: function (data, fn, context) {
                    var d = {
                        // $SERVER: "/MESWDW",
                        $SERVER: "/MESWDW",
                        $URI: "/Runtime/startProcessByProcessDefinitionKey",
                        $TYPE: "post"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //   根据流程实例ID，删除流程实例
                deleteProcessInstance: function (data, fn, context) {
                    var d = {
                        $SERVER: "/MESWDW",
                        $URI: "/Runtime/deleteProcessInstance",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //根据流程定义ID和节点ID获取 ， 属性表信息
                getForm: function (data, fn, context) {
                    var d = {
                        $SERVER: "/MESBPM",
                        $URI: "/Repository/getFormByPdIdAndActId",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                // 通过任务ID获取当前任务节点出口顺序流条件信息
                getNextSFConditionByTaskId: function (data, fn, context) {
                    var d = {
                        $SERVER: "/MESBPM",
                        $URI: "/Repository/getNextSFConditionByTaskId",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //查看证书树
                buildTreePro: function (list) {
                    var _Result = [];
                    $.each(list, function (i, item) {
                        if (item.ParentGroupID == 0) {
                            _Result.push(item);
                            var _Number = _Result.length;
                            _Result[_Result.length - 1].GroupName = _Number + "&nbsp;&nbsp;" + "(" + item.GroupName + ")";
                            IDandName.push({
                                value: _Result[_Result.length - 1].DBID,
                                name: _Result[_Result.length - 1].GroupName,
                            });
                            model.com.buildTreeProItem(item, list, _Number);
                        }
                    });
                    return _Result;
                },
                buildTreeProItem: function (_item, list, Number) {
                    if (!_item.SonList) {
                        _item.SonList = [];
                    }
                    $.each(list, function (i, item) {
                        if (item.ParentGroupID == _item.DBID) {
                            _item.SonList.push(item);
                            _item.SonList[_item.SonList.length - 1].GroupName = Number + "." + _item.SonList.length + "&nbsp;&nbsp;" + "(" + item.GroupName + ")";
                            IDandName.push({
                                value: _item.SonList[_item.SonList.length - 1].DBID,
                                name: _item.SonList[_item.SonList.length - 1].GroupName,
                            });
                            var _Number = Number + "." + _item.SonList.length;
                            model.com.buildTreeProItem(item, list, _Number);
                        }
                    });
                },

                //获取个人全部信息
                getPersonalList: function (data, fn, context) {
                    var d = {
                        $URI: "/QMPersonal/GetPersonalList",
                        $TYPE: "get",
                        $SERVER: "/MESWDW"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //查看所有人全部信息
                getAdminQueryList: function (data, fn, context) {
                    var d = {
                        $URI: "/QMPersonal/AdminQueryList",
                        $TYPE: "get",
                        $SERVER: "/MESWDW"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //上传个人全部信息
                postPersonalList: function (data, fn, context) {
                    var d = {
                        $URI: "/QMPersonal/Add",
                        $TYPE: "post",
                        $SERVER: "/MESWDW"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //删除个人证书
                postdelete: function (data, fn, context) {
                    var d = {
                        $URI: "/QMPersonal/Delete",
                        $TYPE: "post",
                        $SERVER: "/MESWDW"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //删除多证书
                postdeletelist: function (data, fn, context) {
                    var d = {
                        $URI: "/QMPersonal/DeleteList",
                        $TYPE: "post",
                        $SERVER: "/MESWDW"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //更新证书
                postPersonalListUpdate: function (data, fn, context) {
                    var d = {
                        $URI: "/QMPersonal/Update",
                        $TYPE: "post",
                        $SERVER: "/MESWDW"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                //获取所有证书名称
                getGetAllItems: function (data, fn, context) {
                    var d = {
                        $URI: "/QMItem/GetAllItems",
                        $TYPE: "get",
                        $SERVER: "/MESWDW"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取所有分组
                getAllGroup: function (data, fn, context) {
                    var d = {
                        $URI: "/QMGroup/All",
                        $TYPE: "get",
                        $SERVER: "/MESWDW"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //完成待办任务，返回新生成的任务，更新业务服务器任务消息状态
                postTask: function (data, fn, context) {
                    var d = {
                        $SERVER: "/MESWDW",
                        // $SERVER: "/MESWDW",
                        $URI: "/Runtime/CompleteMyPersonalTask",
                        $TYPE: "post"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //数组转化成我们要的字符串
                listToString: function (list) {
                    var string = "";
                    if (list.length <= 1) {
                        string = list[0];
                    } else {
                        for (j = 0; j < list.length; j++) {
                            string = list[j] + "," + string
                        }
                    }
                    return string;
                },
                //上传图片
                postImport: function (data, fn, context) {
                    var d = {
                        $URI: "/Upload/Submit",
                        $TYPE: "post"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax_load(data ? $.extend(data, d) : $.extend(d, data), fn, err, context);
                },

                imgShow: function (outerdiv, innerdiv, bigimg, _this) {
                    var src = _this.attr("src"); //获取当前点击的pimg元素中的src属性  
                    $(bigimg).attr("src", src); //设置#bigimg元素的src属性  

                    /*获取当前点击图片的真实大小，并显示弹出层及大图*/
                    $("<img/>").attr("src", src).on('load', function () {
                        var windowW = $(window).width(); //获取当前窗口宽度  
                        var windowH = $(window).height(); //获取当前窗口高度  
                        var realWidth = this.width; //获取图片真实宽度  
                        var realHeight = this.height; //获取图片真实高度  
                        var imgWidth, imgHeight;
                        var scale = 1; //缩放尺寸，当图片真实宽度和高度大于窗口宽度和高度时进行缩放  

                        if (realHeight > windowH * scale) { //判断图片高度  
                            imgHeight = windowH * scale; //如大于窗口高度，图片高度进行缩放  
                            imgWidth = imgHeight / realHeight * realWidth; //等比例缩放宽度  
                            if (imgWidth > windowW * scale) { //如宽度扔大于窗口宽度  
                                imgWidth = windowW * scale; //再对宽度进行缩放  
                            }
                        } else if (realWidth > windowW * scale) { //如图片高度合适，判断图片宽度  
                            imgWidth = windowW * scale; //如大于窗口宽度，图片宽度进行缩放  
                            imgHeight = imgWidth / realWidth * realHeight; //等比例缩放高度  
                        } else { //如果图片真实高度和宽度都符合要求，高宽不变  
                            imgWidth = realWidth;
                            imgHeight = realHeight;
                        }
                        $(bigimg).css("width", imgWidth); //以最终的宽度对图片缩放  

                        var w = (windowW - imgWidth) / 2; //计算图片与窗口左边距  
                        var h = (windowH - imgHeight) / 2; //计算图片与窗口上边距  
                        $(innerdiv).css({ "top": h, "left": w }); //设置#innerdiv的top和left属性  
                        $(outerdiv).fadeIn("fast"); //淡入显示#outerdiv及.pimg  
                    });

                    $(outerdiv).click(function () { //再次点击淡出消失弹出层  
                        $(this).fadeOut("fast");
                    });
                },
            },


        }),

            model.init();


    });