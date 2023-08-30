require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($zace, $com) {

    var KEYWORD_LinkManSupplier_LIST,
        KEYWORD_LinkManSupplier,
        FORMATTRT_LinkManSupplier,
        LinkManSupplierTemp,
        TypeSource_LinkManSupplier,
        model,
        DataAll,
        DATABasic,
        HTML;


    LinkManSupplierTemp = {
        ID: 0,
        SupplierID: 0,
        Name: "",
        Position: "",
        WeiXin: "",
        MobilePhone: "",
        EMail: "",
        Grade: 0,
        Description: "",
        Creator: window.parent.User_Info.Name,
        CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Active: 0,
    };

    HTML = {
        TableMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td data-title="SupplierID" data-value="{{SupplierID}}" >{{SupplierID}}</td>',
            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
            '<td data-title="Position" data-value="{{Position}}" >{{Position}}</td>',
            '<td data-title="WeiXin" data-value="{{WeiXin}}" >{{WeiXin}}</td>',
            '<td data-title="MobilePhone" data-value="{{MobilePhone}}" >{{MobilePhone}}</td>',
            '<td data-title="EMail" data-value="{{EMail}}" >{{EMail}}</td>',
            '<td data-title="Grade" data-value="{{Grade}}" >{{Grade}}</td>',
            '<td data-title="Description" data-value="{{Description}}" >{{Description}}</td>',
            '<td data-title="Creator" data-value="{{Creator}}" >{{Creator}}</td>',
            '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
            '<td data-title="Active" data-value="{{Active}}" >{{Active}}</td>',
            '</tr>',
        ].join(""),


    };
    $(function () {
        KEYWORD_LinkManSupplier_LIST = [
            "SupplierID|供应商|ArrayOne",
            "Name|姓名",
            "Position|职位",
            "WeiXin|微信",
            "MobilePhone|电话号码",
            "EMail|邮件",
            "Grade|等级|ArrayOne",
            "Description|描述",
            "Active|激活|ArrayOne",
            "Creator|开发者",
            "CreateTime|开发时间|Date",
        ];
        KEYWORD_LinkManSupplier = {};
        FORMATTRT_LinkManSupplier = {};

//      LinkManSupplierTemp  = {
//      ID: 0,
//      SupplierID:0,
//      
//      Creator:window.parent.User_Info.Name,
//      CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
//      Active:0,
//      };

        TypeSource_LinkManSupplier = {

            Active: [
                {
                    name: "激活",
                    value: 1,
                }, {
                    name: "禁用",
                    value: 0,
                },
            ],
            SupplierID: [
                {
                    name: "全部",
                    value: 0,
                },
            ],
            Grade: [
                {
                    name: "一星级",
                    value: 1,
                }, {
                    name: "二星级",
                    value: 2,
                }, {
                    name: "三星级",
                    value: 3,
                },

            ],

        };

        $.each(KEYWORD_LinkManSupplier_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD_LinkManSupplier[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined,
            };
            if (detail.length > 2) {
                FORMATTRT_LinkManSupplier[detail[0]] = $com.util.getFormatter(TypeSource_LinkManSupplier, detail[0], detail[2]);
            }
        });
    });


    model = $com.Model.create({
        name: '联系人信息',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            //联系人信息查询
            $("body").delegate("#zace-search-LinkManSupplier", "change", function () {

                var $this = $(this),
                    value = $(this).val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-LinkManSupplier-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-LinkManSupplier-tbody"), DataAll, value, "WID");
            });

            //联系人信息修改
            $("body").delegate("#zace-edit-LinkManSupplier", "click", function () {

                var SelectData = $com.table.getSelectionData($("#femi-LinkManSupplier-tbody"), "WID", DataAll);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！");
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！");
                    return;
                }
                var Default_value = {
//                  SupplierID: SelectData[0].SupplierID,
                    Name: SelectData[0].Name,
                    Position: SelectData[0].Position,
                    WeiXin: SelectData[0].WeiXin,
                    MobilePhone: SelectData[0].MobilePhone,
                    EMail: SelectData[0].EMail,
                    Grade: SelectData[0].Grade,
                    Description: SelectData[0].Description,
                    Active: SelectData[0].Active,
                };
                $("body").append($com.modal.show(Default_value, KEYWORD_LinkManSupplier, "修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
//                  SelectData[0].SupplierID = Number(rst.SupplierID);
                    SelectData[0].Name = rst.Name;
                    SelectData[0].Position = rst.Position;
                    SelectData[0].WeiXin = rst.WeiXin;
                    SelectData[0].MobilePhone = rst.MobilePhone;
                    SelectData[0].EMail = rst.EMail;
                    SelectData[0].Grade = Number(rst.Grade);
                    SelectData[0].Active = Number(rst.Active);
                    SelectData[0].Description = rst.Description;


                    var mID = SelectData[0].WID;
//                  DATABasic[mID - 1].SupplierID  = SelectData[0].SupplierID ;
                    DATABasic[mID - 1].CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date());
                    DATABasic[mID - 1].Creator = window.parent.User_Info.Name;

                    DATABasic[mID - 1].Name = SelectData[0].Name;
                    DATABasic[mID - 1].Position = SelectData[0].Position;
                    DATABasic[mID - 1].WeiXin = SelectData[0].WeiXin;
                    DATABasic[mID - 1].MobilePhone = SelectData[0].MobilePhone;
                    DATABasic[mID - 1].EMail = SelectData[0].EMail;
                    DATABasic[mID - 1].Grade = SelectData[0].Grade;
                    DATABasic[mID - 1].Active = SelectData[0].Active;
                    DATABasic[mID - 1].Description = SelectData[0].Description;
//                  DATABasic[6].SupplierID=3;
                    model.com.PostUpdateAdd({
                        data: DATABasic[mID - 1],
                    }, function (res) {
                        alert("修改成功");
                        model.com.refresh();
                    });

                }, TypeSource_LinkManSupplier));


            });
            //联系人信息新增
            $("body").delegate("#zace-add-LinkManSupplier", "click", function () {
                var default_value = {
                    SupplierID: 0,
                    Name: "",
                    Position: "",
                    WeiXin: "",
                    MobilePhone: "",
                    EMail: "",
                    Grade: 0,
                    Description: "",
                    Active: 0,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_LinkManSupplier, "新增", function (rst) {
                    //调用插入函数 

                    if (!rst || $.isEmptyObject(rst))
                        return;

                    LinkManSupplierTemp.SupplierID = Number(rst.SupplierID);
                    LinkManSupplierTemp.Name = rst.Name;
                    LinkManSupplierTemp.Position = rst.Position;
                    LinkManSupplierTemp.WeiXin = rst.WeiXin;
                    LinkManSupplierTemp.MobilePhone = rst.MobilePhone;
                    LinkManSupplierTemp.EMail = rst.EMail;
                    LinkManSupplierTemp.Grade = rst.Grade;
                    LinkManSupplierTemp.Description = rst.Description;
                    LinkManSupplierTemp.Active = Number(rst.Active);
//                  if (DATABasic.length < 1) {
//                      DATABasic.push(LinkManSupplierTemp );
//                  } else {
//                      LinkManSupplierTemp.ID = model.com.GetMaxID(DATABasic);
//                      var mID = LinkManSupplierTemp.ID ;
//                      DATABasic.push(LinkManSupplierTemp );
//                  }
                    model.com.PostUpdateAdd({
                        data: LinkManSupplierTemp,
                    }, function (res) {
                        alert("新增成功");
                        model.com.refresh();
                    });


                }, TypeSource_LinkManSupplier));


            });
            //联系人信息导出
            $("body").delegate("#zace-export-LinkManSupplier", "click", function () {
                var $table = $(".table-part"),
                    fileName = "联系人信息.xls",
                    Title = "联系人信息";
                var params = $com.table.getExportParams($table, fileName, Title);

                model.com.postExportExcel(params, function (res) {
                    var src = res.info.path;
                    window.open(src);
                });

            });


            //联系人信息条件查询
            $("body").delegate("#zace-search-LinkManSupplier_", "click", function () {
                var default_value = {
                    SupplierID: 0,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_LinkManSupplier, "查询", function (rst) {


                    if (!rst || $.isEmptyObject(rst))
                        return;

                    default_value.SupplierID = Number(rst.SupplierID);
                    $com.table.filterByConndition($("#femi-LinkManSupplier-tbody"), DataAll, default_value, "WID");

                }, TypeSource_LinkManSupplier));


            });

            //激活 联系人信息
            $("body").delegate("#zace-ok-LinkManSupplier", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-LinkManSupplier-tbody"), "WID", DataAll);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！");
                    return;
                }
                var list = [];
                for (var i = 0; i < SelectData.length; i++) {
                    var Wid = SelectData[i].WID;

                    list.push(DATABasic[Wid - 1]);
                }

                model.com.postActive({
                    data: list,
                    active: 1,
                }, function (res) {
                    alert("激活成功");
                    model.com.refresh();
                });
            });
            //禁用联系人信息
            $("body").delegate("#zace-remove-LinkManSupplier", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-LinkManSupplier-tbody"), "WID", DataAll);
                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！");
                    return;
                }
                var _list = [];
                for (var i = 0; i < SelectData.length; i++) {
                    var Wid = SelectData[i].WID;

                    _list.push(DATABasic[Wid - 1]);
                }
                model.com.postActive({
                    data: _list,
                    active: 0,
                }, function (res1) {
                    alert("禁用成功");
                    model.com.refresh();
                });
            });

        },


        run: function () {

//         model.com.refresh();

            //得到所有的供应商
            model.com.getSupplier({
                supplier_name: "",
                country_id: 0,
                province_id: 0,
                city_id: 0,
                active: 2,
            }, function (res1) {
                $.each(res1.list, function (i, item) {
                    TypeSource_LinkManSupplier.SupplierID.push({
                        name: item.SupplierName,
                        //value: item.ID,
                        value: item.ID,
                        far: null,
                    });
                });
                model.com.refresh();
            });


        },

        com: {
            refresh: function () {

                model.com.getLinkManSupplier({customer_id: 0, active: 2}, function (resS) {
                    if (!resS)
                        return;
                    if (resS && resS.list) {
                        DataAll = $com.util.Clone(resS.list);   //界面数据
                        DATABasic = $com.util.Clone(resS.list); //数据库数据                    
                        for (var i = 0; i < DataAll.length; i++) {
                            DataAll[i].WID = i + 1;
                        }
                        var Data = $com.util.Clone(DataAll);
                        $.each(Data, function (i, item) {
                            for (var p in item) {
                                if (!FORMATTRT_LinkManSupplier[p])
                                    continue;
                                item[p] = FORMATTRT_LinkManSupplier[p](item[p]);
                            }
                        });

                        $("#femi-LinkManSupplier-tbody").html($com.util.template(Data, HTML.TableMode));

                    }

                });
            },
            //查询联系人列表
            getLinkManSupplier: function (data, fn, context) {
                var d = {
                    $URI: "/LinkManSupplier/All",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //激活联系人
            postActive: function (data, fn, context) {
                var d = {
                    $URI: "/LinkManSupplier/Active",
                    $TYPE: "post",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //更新添加联系人
            PostUpdateAdd: function (data, fn, context) {
                var d = {
                    $URI: "/LinkManSupplier/Update",
                    $TYPE: "post",
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
                    $TYPE: "post",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //查询供应商列表
            getSupplier: function (data, fn, context) {
                var d = {
                    $URI: "/Supplier/All",
                    $TYPE: "get",
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
        },
    }),

        model.init();


});