require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($zace, $com) {

    var KEYWORD_Customer_LIST,
        KEYWORD_Customer,
        FORMATTRT_Customer,
        CustomerTemp,
        TypeSource_Customer,

        KEYWORD_LinkManCustomer_LIST,
        KEYWORD_LinkManCustomer,
        FORMATTRT_LinkManCustomer,
        CustomerTemp_LinkManCustomer,
        TypeSource_LinkManCustomer,
        DataCustomerFor,
        DataLinkManFor,
        model,
        DataAll,
        DATABasic,
        DataAll_Link,
        DATABasic_Link,
        mid,
        wid,
        HTML;
    mid = wid = 1;

    CustomerTemp = {
        Active: 1,
        Address: "",
        AuditTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        //Auditor: window.parent.User_Info.Name,
        CityID: 0,
        CountryID: 0,
        CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        //Creator: window.parent.User_Info.Name,
        CustomerCode: "",
        CustomerName: "",
        Grade: 0,
        ID: 0,
        ProvinceID: 0,
        Status: 1,
        TaxCode: "",
        Type: 0,
    };
    HTML = {
        TableMode: [
            '<tr data-color="">',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td  data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td data-title="CustomerName" data-value="{{CustomerName}}" >{{CustomerName}}</td>',
            '<td data-title="CustomerCode" data-value="{{CustomerCode}}" >{{CustomerCode}}</td>',
            // '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
            // '<td data-title="Creator" data-value="{{Creator}}" >{{Creator}}</td>',
            '<td data-title="Active" data-value="{{Active}}"><span class="badge lmvt-badge {{ClassBadge}}">{{Badge}}</span>{{Active}}</td>',
            '<td style="max-width: 80px" data-title="Handle" data-value="{{ID}}"><div class="row">',
            '<div class="col-md-6 {{ISAllowed}}">{{ISAllowedText}}</div>',
            '<div class="col-md-6 lmvt-do-info lmvt-reset">修改</div>',
            '</div></td>',
            '</tr>',
        ].join(""),


    };
    (function () {
        KEYWORD_Customer_LIST = [
            "CustomerName|名称",
            "CustomerCode|编码",
            "CreateTime|编辑时间|DateTime",
            "Creator|编辑者",
            "Active|状态|ArrayOne",
        ];
        KEYWORD_Customer = {};
        FORMATTRT_Customer = {};

        TypeSource_Customer = {

            Active: [
                {
                    name: "启用",
                    value: 1,
                }, {
                    name: "禁用",
                    value: 0,
                }, {
                    name: "禁用",
                    value: 2,
                },
            ],

        };

        $.each(KEYWORD_Customer_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD_Customer[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined,
            };
            if (detail.length > 2) {
                FORMATTRT_Customer[detail[0]] = $com.util.getFormatter(TypeSource_Customer, detail[0], detail[2]);
            }
        });
    })();


    model = $com.Model.create({
        name: '联系人信息',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            //Enter触发模糊查询事件
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var value = $("#femi-search-text-ledger").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-Customer-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-Customer-tbody"), DataCustomerFor, value, "ID");
                }
            });
            $("body").delegate("#zace-search-userS", "click", function () {
                var value = $("#femi-search-text-ledger").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-Customer-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-Customer-tbody"), DataCustomerFor, value, "ID");
                //$page.getSearchList(value);
            });
            //顾客信息修改
            $("body").delegate(".lmvt-reset", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = DATABasic.filter((item) => {
                    return item.ID == wID;
                });
                var Default_value = {

                    CustomerCode: SelectData[0].CustomerCode,
                    CustomerName: SelectData[0].CustomerName,

                };
                $("body").append($com.modal.show(Default_value, KEYWORD_Customer, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    SelectData[0].CustomerCode = rst.CustomerCode.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                    SelectData[0].CustomerName = rst.CustomerName.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                    SelectData[0].TaxCode = SelectData[0].CustomerCode;
                    for (var i = 0; i < SelectData.length; i++) {
                        $com.util.deleteLowerProperty(SelectData[i]);
                    }

                    if (SelectData[0].CustomerName.length <= 0 || SelectData[0].CustomerCode.length <= 0) {
                        alert("名称、编码必填！！");

                        return false;
                    }

                    model.com.PostUpdateAdd({
                        data: SelectData[0],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                    });

                }, TypeSource_Customer));


            });
            //顾客信息新增
            $("body").delegate("#zace-add-Customer", "click", function () {
                var default_value = {
                    CustomerCode: "",
                    CustomerName: "",

                };
                $("body").append($com.modal.show(default_value, KEYWORD_Customer, "新增", function (rst) {
                    //调用插入函数 

                    if (!rst || $.isEmptyObject(rst))
                        return;


                    CustomerTemp.CustomerCode = rst.CustomerCode.replace(/^\s\s*/, '').replace(/\s\s*$/, '');//匹配首尾空格
                    CustomerTemp.CustomerName = rst.CustomerName.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                    CustomerTemp.TaxCode = CustomerTemp.CustomerCode;

                    if (CustomerTemp.CustomerName.length <= 0 || CustomerTemp.CustomerCode.length <= 0) {
                        alert("名称、编码必填！！");

                        return false;
                    }

                    model.com.PostUpdateAdd({
                        data: CustomerTemp,
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                    });


                }, TypeSource_Customer));


            });


            //启用 顾客信息
            $("body").delegate(".lmvt-do-active", "click", function () {
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));


                var SelectData = DATABasic.filter((item) => {
                    return item.ID == wID;
                });

                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                model.com.postActive({
                    data: SelectData,
                    active: 1,
                }, function (res) {
                    alert("启用成功");
                    model.com.refresh();
                });
            });
            //禁用顾客信息
            $("body").delegate(".lmvt-allowed-delete", "click", function () {
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));


                var SelectData = DATABasic.filter((item) => {
                    return item.ID == wID;
                });

                for (var i = 0; i < SelectData.length; i++) {
                    $com.util.deleteLowerProperty(SelectData[i]);
                }
                model.com.postActive({
                    data: SelectData,
                    active: 0,
                }, function (res1) {
                    alert("禁用成功");
                    model.com.refresh();
                });
            });

        },


        run: function () {

            model.com.refresh();

        },

        com: {
            refresh: function () {

                model.com.getCustomer({active: -1}, function (resS) {
                    if (!resS)
                        return;
                    if (resS && resS.list) {
                        DataAll = $com.util.Clone(resS.list);   //界面数据
                        DATABasic = $com.util.Clone(resS.list); //数据库数据                    
                        //for (var i = 0; i < DataAll.length; i++) {
                        //    DataAll[i].WID = i + 1;
                        //}
                        var Data = $com.util.Clone(DataAll);
                        $.each(Data, function (i, item) {
                            item.Badge = " ";

                            if (item.Active == 1) {
                                item.ISAllowedText = "禁用";
                                item.ISAllowed = "lmvt-allowed-delete";
                                item.ClassBadge = "lmvt-activeBadge";

                            } else {
                                item.ISAllowedText = "启用";
                                item.ISAllowed = "lmvt-do-active";
                                item.ClassBadge = "lmvt-defBadge";
                            }
                            for (var p in item) {
                                if (!FORMATTRT_Customer[p])
                                    continue;
                                item[p] = FORMATTRT_Customer[p](item[p]);
                            }
                            item.WID = i + 1;

                        });
                        DataCustomerFor = $com.util.Clone(Data);
                        $("#femi-Customer-tbody").html($com.util.template(Data, HTML.TableMode));
                        $("#femi-Customer-tbody tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);


                        });

                    }
                    window.parent._zaceCustomerSet = 1;
                });

            },


            //查询信息
            getCustomer: function (data, fn, context) {
                var d = {
                    $URI: "/Customer/All",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //启用信息
            postActive: function (data, fn, context) {
                var d = {
                    $URI: "/Customer/Active",
                    $TYPE: "post",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //更新信息
            PostUpdateAdd: function (data, fn, context) {
                var d = {
                    $URI: "/Customer/Update",
                    $TYPE: "post",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
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

        },
    }),

        model.init();


});