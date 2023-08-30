require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/paging', '../static/utils/js/base/base'],
    function ($zace, $page, $com) {

        var KEYWORD_Level_LIST,
            KEYWORD_Level,
            FORMATTRT_Level,
            DEFAULT_VALUE_Level,
            TypeSource_Level,
            model,
            DataAll,
            DATABasic,
            DATABasicPro,
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
            HTML;

        RouteID = 0;
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

        ;
        HTML = {
            TableMode: [
                '<tr>',
                '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
                '<td style="min-width: 50px;display:none" data-title="DBID" data-value="{{DBID}}">{{DBID}}</td> ',
                '<td data-title="EmployeeName" data-value="{{EmployeeName}}" >{{EmployeeName}}</td>',
                '<td data-title="EmployeeDepartmentName" data-value="{{EmployeeDepartmentName}}" >{{EmployeeDepartmentName}}</td>',
                '<td data-title="CertificationName" data-value="{{CertificationName}}" >{{CertificationName}}</td>',
                '<td data-title="CertificationNo" data-value="{{CertificationNo}}" >{{CertificationNo}}</td>',
                '<td data-title="DTAdded" data-value="{{DTAdded}}" >{{DTAdded}}</td>',
                '<td data-title="DTValidUntil" data-value="{{DTValidUntil}}" >{{DTValidUntil}}</td>',
                '<td data-title="AuthorizerInfoName" data-value="{{AuthorizerInfoName}}" >{{AuthorizerInfoName}}</td>',
                '<td style="min-width: 50px;display:none" data-title="AuthorizerInfoID" data-value="{{AuthorizerInfoID}}" >{{AuthorizerInfoID}}</td>',
                '<td data-title="QualificationStatus" data-value="{{QualificationStatus}}" >{{QualificationStatus}}</td>',
                '<td data-title="Certificationdetail" data-value="{{}}" ><span id="Check" style="color: #da3705">查看证书</span></td>',
                '<td style="min-width: 50px;display:none" data-title="CertificationFilesPath" data-value="{{certificationFilesPath}}">{{CertificationFilesPath}}</td> ',

                '<td style="min-width: 40px" data-title="Handle" data-value="{{ID}}"><div class="row">',
                '<div class="col-md-4 {{ISAllowed}}" id="Edit">修改</div>',
                '<div class="col-md-4 {{ISDelete}}" id="Delete">撤销</div>',
                '<div class="col-md-4" id="DownLoad">下载</div>',
                '</td>',

                '</tr>',
            ].join(""),

            TablePartMode: [
                '<tr>',
                '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
                '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',

                '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
                '<td data-title="OrderID" data-value="{{OrderID}}" >{{OrderID}}</td>',
                '<td data-title="RouteName" data-value="{{RouteName}}" >{{RouteName}}</td>',
                '</tr>',
            ].join(""),



        };
        (function () {
            KEYWORD_Level_LIST = [
                "DTAdded|添加日期|DateTime",
                "CertificationName|证书名称|ArrayOne",
                "CertificationNo|证书编号",
                "ID|审核人ID",
                "DTAddedStart|添加开始时间|DateTime",
                "DTAddedEnd|添加开始时间|DateTime",
                "DTValidUntilStart|添加开始时间|DateTime",
                "DTValidUntilEnd|添加开始时间|DateTime",
                "DTValidUntil|有效期至|DateTime",
                "QualificationStatus|证书状态|ArrayOne",
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
                QualificationStatus: [
                    {
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
                    },
                ],
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
                "DTAdded|添加日期|DateTime",
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
                QualificationStatus: [
                    {
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
                    },
                ],
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
                    for (j = 0; j < _IDNameParentID.length; j++) {
                        var SelectData = IDandName.filter((item) => { return item.value == _IDNameParentID[j].inGroupID });
                        TypeSource_AdminQueryList.CertificationName.push({
                            value: _IDNameParentID[j].value,
                            name: _IDNameParentID[j].name + "_" + SelectData[0].name,
                        });
                    }
                    DTAddedStart = $("#lmvt-DTAddedStart").val();
                    DTAddedEnd = $("#lmvt-DTAddedEnd").val();
                    DTValidUntilStart = $("#lmvt-DTValidUntilStart").val();
                    DTValidUntilEnd = $("#lmvt-DTValidUntilEnd").val();
                    if (DTAddedStart == "") {
                        DTAddedStart = "2000-01-01 00:00"
                    };
                    if (DTAddedEnd == "") {
                        DTAddedEnd = "9999-01-01 00:00"
                    };
                    if (DTValidUntilStart == "") {
                        DTValidUntilStart = "2000-01-01 00:00"
                    };
                    if (DTValidUntilEnd == "") {
                        DTValidUntilEnd = "9999-01-01 00:00"
                    };
                    _UserIDList = "";
                    _CertificationIDList = "";
                    _QualificationStatus = "";
                    $("body").append($com.modal.show(DEFAULT_VALUE_AdminQueryList, KEYWORD_AdminQueryList, "查询", function (rst) {
                        //调用插入函数 
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        _UserIDList = model.com.listToString(rst.EmployeeName);

                        _CertificationIDList = model.com.listToString(rst.CertificationName);

                        _QualificationStatus = model.com.listToString(rst.QualificationStatus);

                        model.com.refresh({
                        })
                    }, TypeSource_AdminQueryList));
                    TypeSource_AdminQueryList.CertificationName = [{
                        value: 0,
                        name: "所有证书"
                    }];
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
                        }
                        else {
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
                        CertificationStatus = $tr.find("td[data-title=CertificationStatus]").attr("data-value");
                    WID = $tr.find("td[data-title=WID]").attr("data-value");
                    DBID = $tr.find("td[data-title=DBID]").attr("data-value");
                    if (CertificationStatus == "审核中") {
                        alert("请勿撤销，该证书正在审核");
                        return;
                    }
                    if (CertificationStatus == "生效中") {
                        alert("请勿撤销已生效的证书");
                        return;
                    }
                    if (!confirm("确定将第" + WID + "条证书撤销吗？")) {
                        return;
                    }
                    model.com.postdelete({
                        ID: DBID,
                    }, function (res) {
                        alert("撤销完成");
                        model.com.refresh();
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

                    //下载图片
                    function downloadImage(src) {
                        var a = $("<a></a>").attr("href", src).attr("download", "img.png").appendTo("body");

                        a[0].click();
                        a.remove();
                    }
                    downloadImage(src);

                });
            },





            run: function () {
                $("#lmvt-DTAddedStart").datetimepicker({
                    format: 'yyyy-mm-dd hh:ii',//显示格式
                    // startView: 2,
                    minView: 0,
                    maxView: 2,
                    language: 'zh-CN',
                    autoclose: 1,//选择后自动关闭
                    clearBtn: false,//清除按钮
                }).on('changeDate', function (ev) {
                    var DTAddedStart = $("#lmvt-DTAddedStart").val();
                    $("#lmvt-DTAddedEnd").datetimepicker("setStartDate", DTAddedStart);
                });
                $("#lmvt-DTAddedEnd").datetimepicker({
                    format: 'yyyy-mm-dd hh:ii',//显示格式
                    // startView: 2,
                    minView: 0,
                    maxView: 2,
                    language: 'zh-CN',
                    autoclose: 1,//选择后自动关闭
                    clearBtn: false,//清除按钮
                }).on('changeDate', function (ev) {
                    var DTAddedEnd = $("#lmvt-DTAddedEnd").val();
                    $("#lmvt-DTAddedStart").datetimepicker("setEndDate", DTAddedEnd.toString("yyyy-MM-dd"));

                });

                $("#lmvt-DTValidUntilStart").datetimepicker({
                    format: 'yyyy-mm-dd hh:ii',//显示格式
                    // startView: 2,
                    minView: 0,
                    maxView: 2,
                    language: 'zh-CN',
                    autoclose: 1,//选择后自动关闭
                    clearBtn: false,//清除按钮
                }).on('changeDate', function (ev) {
                    var DTValidUntilStart = $("#lmvt-DTValidUntilStart").val();
                    $("#lmvt-DTValidUntilEnd").datetimepicker("setStartDate", DTValidUntilStart);
                });
                $("#lmvt-DTValidUntilEnd").datetimepicker({
                    format: 'yyyy-mm-dd hh:ii',//显示格式
                    // startView: 2,
                    minView: 0,
                    maxView: 2,
                    language: 'zh-CN',
                    autoclose: 1,//选择后自动关闭
                    clearBtn: false,//清除按钮
                }).on('changeDate', function (ev) {
                    var DTValidUntilEnd = $("#lmvt-DTValidUntilEnd").val();
                    $("#lmvt-DTValidUntilStart").datetimepicker("setEndDate", DTValidUntilEnd.toString("yyyy-MM-dd"));
                });
                username = window.parent._UserAll;
                $.each(username, function (i, item) {
                    TypeSource_AdminQueryList.EmployeeName.push({
                        value: item.ID,
                        name: item.Name,
                    });
                });
                //得到所有证书名称，证书ID，证书所属ID
                model.com.getGetAllItems({
                }, function (res) {
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
                model.com.getGetAllItems({
                }, function (res) {
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

            com: {

                refresh: function (data) {
                    $com.app.loading('数据加载中...');
                    model.com.getAdminQueryList({
                        UserIDList: _UserIDList,
                        CertificationIDList: _CertificationIDList,
                        QualificationStatus: _QualificationStatus,
                        DTAddedStart: DTAddedStart,
                        DTAddedEnd: DTAddedEnd,
                        DTValidUntilStart: DTValidUntilStart,
                        DTValidUntilEnd: DTValidUntilEnd
                    }, function (resP) {
                        if (!resP)
                            return;
                        if (resP && resP.list) {
                            var Grade = [];
                            DATABasic = $com.util.Clone(resP.list);

                            //审核数据
                            DataAllConfirm = $com.util.Clone(resP.list);
                            for (var i = 0; i < DataAllConfirm.length; i++) {
                                if (DataAllConfirm[i].Active != 3) {
                                    Grade.push(DataAllConfirm[i]);
                                }

                            }
                            $.each(Grade, function (i, item) {
                                if (item.QualificationStatus == 1) {
                                    item.ISDelete = "lmvt-not-allowed-delete";
                                    item.ISAllowed = "lmvt-not-allowed-delete"
                                };

                                if (item.QualificationStatus == 3) {
                                    item.ISDelete = "lmvt-not-allowed-delete";
                                    item.ISAllowed = "lmvt-not-allowed-delete"
                                };
                                for (var p in item) {
                                    if (p == "AuthorizerInfo") {
                                        item.AuthorizerInfoName = item[p]["Name"];
                                        item.AuthorizerInfoID = item[p]["ID"];
                                    }
                                    if (p == "PersonalInfo") {
                                        item.EmployeeName = item[p]["Name"];
                                        item.EmployeeDepartmentName = item[p]["Department"];
                                    }
                                    if (p == "certificationInfo") {
                                        item.CertificationName = item[p]["CertificationName"];
                                    };
                                    if (!FORMATTRT_Level[p])
                                        continue;
                                    item[p] = FORMATTRT_Level[p](item[p]);
                                };
                                item.WID = i + 1;
                            });
                            DataAll = $com.util.Clone(Grade);

                            DataAllFactorySearch = $com.util.Clone(Grade);
                            model.com.RanderCodeList(Grade);

                            $com.app.loaded();
                        }

                    });
                },


                RanderCodeList: function (Data) {

                    $page.init($(".grinding-table"), Data, "", function (res) {


                        CodeRanderSource = res;

                        $("#femi-riskLevel-tbody").html($com.util.template(res, HTML.TableMode));



                    });

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
                    }
                    else {
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
                    var src = _this.attr("src");//获取当前点击的pimg元素中的src属性  
                    $(bigimg).attr("src", src);//设置#bigimg元素的src属性  

                    /*获取当前点击图片的真实大小，并显示弹出层及大图*/
                    $("<img/>").attr("src", src).on('load', function () {
                        var windowW = $(window).width();//获取当前窗口宽度  
                        var windowH = $(window).height();//获取当前窗口高度  
                        var realWidth = this.width;//获取图片真实宽度  
                        var realHeight = this.height;//获取图片真实高度  
                        var imgWidth, imgHeight;
                        var scale = 1;//缩放尺寸，当图片真实宽度和高度大于窗口宽度和高度时进行缩放  

                        if (realHeight > windowH * scale) {//判断图片高度  
                            imgHeight = windowH * scale;//如大于窗口高度，图片高度进行缩放  
                            imgWidth = imgHeight / realHeight * realWidth;//等比例缩放宽度  
                            if (imgWidth > windowW * scale) {//如宽度扔大于窗口宽度  
                                imgWidth = windowW * scale;//再对宽度进行缩放  
                            }
                        } else if (realWidth > windowW * scale) {//如图片高度合适，判断图片宽度  
                            imgWidth = windowW * scale;//如大于窗口宽度，图片宽度进行缩放  
                            imgHeight = imgWidth / realWidth * realHeight;//等比例缩放高度  
                        } else {//如果图片真实高度和宽度都符合要求，高宽不变  
                            imgWidth = realWidth;
                            imgHeight = realHeight;
                        }
                        $(bigimg).css("width", imgWidth);//以最终的宽度对图片缩放  

                        var w = (windowW - imgWidth) / 2;//计算图片与窗口左边距  
                        var h = (windowH - imgHeight) / 2;//计算图片与窗口上边距  
                        $(innerdiv).css({ "top": h, "left": w });//设置#innerdiv的top和left属性  
                        $(outerdiv).fadeIn("fast");//淡入显示#outerdiv及.pimg  
                    });

                    $(outerdiv).click(function () {//再次点击淡出消失弹出层  
                        $(this).fadeOut("fast");
                    });
                },
            },


        }),

            model.init();


    });