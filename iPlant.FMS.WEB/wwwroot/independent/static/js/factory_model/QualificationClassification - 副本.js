require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/paging','../static/utils/js/base/base'],
    function ($lin,$page,$com) {

        var HTML,
            //编码集合
            CodeList,
            //规则集合
            CodeRuleList,
            CodeSource,
            //全局ID
            ChoiceID,
            //实体
            Defaul_Value_Code,
            KETWROD_LIST_Code,
            KETWROD_Code,
            Formattrt_Code,
            TypeSource_Code,
            TypeSource_Level,
            //规则
            Defaul_Value_Rule,
            KETWROD_LIST_Rule,
            KETWROD_Rule,
            Formattrt_Rule,
            TypeSource_Rule;

        //证书种类
        GroupNameList = [];



        HTML = {
            CodeList: [
                '<tr>',
                // '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></th>',
                '<td style="min-width: 50px" data-title="wID" data-value="{{wID}}" >{{wID}}</td>',
                '<td style="min-width: 80px" data-title="GroupName" data-value="{{GroupName}}">{{GroupName}}</td>',
                '<td style="min-width: 80px" data-title="DTLastEdit" data-value="{{DTLastEdit}}">{{DTLastEdit}}</td>',
                '<td style="min-width: 50px" data-title="LastEditorID" data-value="{{LastEditorID}}" >{{LastEditorID}}</td>',
                '<td style="display:none" data-title="DBID" data-value="{{DBID}}" >{{DBID}}</td>',
                '<td style="min-width: 40px" data-title="Handle" data-value="{{ID}}"><div class="row">',
                '<div class="col-md-2" id="Edit">修改</div>',
                '<div class="col-md-2" id="Delete">删除</div>',
                '</td>',
                '</tr>'
            ].join(""),

            CodeRuleList: [
                '<tr>',
                '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td style="min-width: 50px" data-title="wID" data-value="{{wID}}" >{{wID}}</td>',
                '<td style="display:none" data-title="InGroupID" data-value="{{InGroupID}}" >{{InGroupID}}</td>',
                '<td style="display:none" data-title="CertificationID" data-value="{{CertificationID}}" >{{CertificationID}}</td>',
                '<td data-title="CertificationName" data-value="{{CertificationName}}" >{{CertificationName}}</td>',
                '<td data-title="CertificationComments" data-value="{{CertificationComments}}" >{{CertificationComments}}</td>',
                '<td data-title="DTLastEdit" data-value="{{DTLastEdit}}" >{{DTLastEdit}}</td>',
                '<td data-title="LastEditorID" data-value="{{LastEditorID}}" >{{LastEditorID}}</td>',
                '<td style="min-width: 40px" data-title="Handle" data-value="{{ID}}"><div class="row">',
                '<div class="col-md-12" id="EditItem">修改</div>',
                '</td>',
                '</tr>',
            ].join(""),


        };

        //新增证书种类
        Defaul_Value_Code = {
            GroupName: "",
        };
        (function () {

            KETWROD_LIST_Code = [
                "DTLastEdit|最新编辑时间|DateTime",
                "LastEditorID|最新编辑时间|ArrayOne",
                "GroupName|证书种类"
            ];

            KETWROD_Code = {};

            Formattrt_Code = {};
            TypeSource_Code = {
                LastEditorID: [],
            };
            
            $.each(window.parent._UserAll, function (i, item) {
                TypeSource_Code.LastEditorID.push({
                    name: item.Name,
                    value: item.ID
                });

            });



            $.each(KETWROD_LIST_Code, function (i, item) {
                var detail = item.split("|");
                KETWROD_Code[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_Code[detail[0]] = $com.util.getFormatter(TypeSource_Code, detail[0], detail[2]);
                }
            });
        })();

        //新增证书
        Defaul_Value_Rule = {
            GroupName: "",
            ItemName: "",
            ItemComments: "",
        };
        (function () {

            KETWROD_LIST_Rule = [
                "DTLastEdit|最新编辑时间|DateTime",
                "LastEditorID|最新编辑时间|ArrayOne",
                "GroupName|证书种类|ArrayOne",
                "ItemName|证书名称",
                "ItemComments|证书释义"
            ];

            KETWROD_Rule = {};

            Formattrt_Rule = {};


            TypeSource_Rule = {
                GroupName: [],
                Type: [

                    {
                        name: "流水号",
                        value: 8

                    },
                    {
                        name: "定制码",
                        value: 9

                    }
                ],
                Editable: [
                    {
                        name: "是",
                        value: true
                    },
                    {
                        name: "否",
                        value: false
                    }
                ]
            };
            $.each(KETWROD_LIST_Rule, function (i, item) {
                var detail = item.split("|");
                KETWROD_Rule[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_Rule[detail[0]] = $com.util.getFormatter(TypeSource_Rule, detail[0], detail[2]);
                }
            });
        })();
        model = $com.Model.create({
            name: '编码规则',

            type: $com.Model.MAIN,

            configure: function () {
                this.run();
            },
            //.代表去class属性的标签
            events: function () {

                $("body").delegate(".lmvt-encoding-body tr", "bdclick", function () {
                    var $this = $(this),
                        id = Number($this.find("td[data-title=ID]").attr("data-value"));
                    $.each(CodeList, function (i, item) {

                    });
                });

                //修改证书种类 #代表取id属性的标签
                $("body").delegate("#Edit", "click", function () {
                    var $this = $(this);
                    var $tr = $this.parents("tr"),
                        id = Number($tr.find("td[data-title=DBID]").attr("data-value"));
                    $("body").append($com.modal.show(Defaul_Value_Code, KETWROD_Code, "新增", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }
                        var _groupname = rst.GroupName;
                        model.com.postUpdateGroup({
                            GroupID: id,
                            GroupName: _groupname,
                        }, function (res) {
                            alert("修改成功！！");
                            model.com.refresh();
                        });

                    }, TypeSource_Rule));

                });

                //删除多项证书
                $("body").delegate("#lmvt-type-deleteItems", "click", function () {
                    var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "CertificationID", CodeSource);

                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return;
                    }
                    var IDList = [];

                    for (var i = 0; i < SelectData.length; i++) {
                        IDList.push(SelectData[i]["CertificationID"]);
                    }
                    model.com.postDeleteItems({
                        IDList: IDList,
                    }, function (res) {
                        alert("修改成功！！");
                        model.com.refresh();
                    });


                });

                //修改多项证书所属种类
                $("body").delegate("#lmvt-type-ChangeItems", "click", function () {
                    var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "CertificationID", CodeSource);
                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return;
                    }

                    var _IDList = [];
                    for (var i = 0; i < SelectData.length; i++) {
                        _IDList.push(SelectData[i]["CertificationID"]);
                    }
                    Defaul_Value_Rule = {
                        GroupName: "",
                    };
                    TypeSource_Rule.GroupName = [];
                    $.each(GroupNameList, function (i, item) {
                        TypeSource_Rule.GroupName.push({
                            name: item.name,
                            value: item.value
                        });
                    });
                    $("body").append($com.modal.show(Defaul_Value_Rule, KETWROD_Rule, "新增", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }
                        model.com.postChangeItemsGroup({
                            IDList: _IDList,
                            GroupID: rst.GroupName,
                        }, function (res) {
                            alert("修改成功！！");
                            model.com.refresh();
                            Defaul_Value_Rule = {
                                GroupName: "",
                                ItemName: "",
                                ItemComments: "",
                            };
                        });

                    }, TypeSource_Rule));




                });

                //修改证书 #代表取id属性的标签
                $("body").delegate("#EditItem", "click", function () {

                    $.each(GroupNameList, function (i, item) {
                        TypeSource_Rule.GroupName.push({
                            name: item.name,
                            value: item.value
                        });
                    });

                    var $this = $(this);
                    var $tr = $this.parents("tr"),
                        _CertificationName = String($tr.find("td[data-title=CertificationName]").attr("data-value"));
                    _InGroupID = $tr.find("td[data-title=InGroupID]").attr("data-value");
                    _ItemComments = $tr.find("td[data-title=CertificationComments]").attr("data-value");
                    _ItemID = $tr.find("td[data-title=CertificationID]").attr("data-value");

                    Defaul_Value_Rule = {
                        GroupName: "",
                        ItemName: _CertificationName,
                        ItemComments: _ItemComments,
                    };

                    $("body").append($com.modal.show(Defaul_Value_Rule, KETWROD_Rule, "新增", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;

                        }
                        model.com.postUpdateItem({
                            ItemID: _ItemID,
                            ItemName: rst.ItemName,
                            InGroupID: _InGroupID,
                            ItemComments: rst.ItemComments,
                        }, function (res) {
                            alert("修改成功！！");
                            GroupNameList = [];
                            model.com.refresh();
                        });

                    }, TypeSource_Rule));

                });
                //删除证书 
                $("body").delegate("#DeleteItem", "click", function () {

                    $.each(GroupNameList, function (i, item) {
                        TypeSource_Rule.GroupName.push({
                            name: item.name,
                            value: item.value
                        });
                    });

                    var $this = $(this);
                    var $tr = $this.parents("tr"),
                        _CertificationName = String($tr.find("td[data-title=CertificationName]").attr("data-value"));
                    _InGroupID = $tr.find("td[data-title=InGroupID]").attr("data-value");
                    _ItemComments = $tr.find("td[data-title=CertificationComments]").attr("data-value");
                    _ItemID = $tr.find("td[data-title=CertificationID]").attr("data-value");

                    Defaul_Value_Rule = {
                        GroupName: "",
                        ItemName: _CertificationName,
                        ItemComments: _ItemComments,
                    };

                    $("body").append($com.modal.show(Defaul_Value_Rule, KETWROD_Rule, "新增", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }
                        model.com.postUpdateItem({
                            ItemID: _ItemID,
                            ItemName: rst.ItemName,
                            InGroupID: _InGroupID,
                            ItemComments: rst.ItemComments,
                        }, function (res) {
                            alert("修改成功！！");
                            model.com.refresh();
                        });

                    }, TypeSource_Rule));

                });

                //删除证书种类
                $("body").delegate("#Delete", "click", function () {
                    var $this = $(this);
                    var $tr = $this.parents("tr"),
                        dbid = String($tr.find("td[data-title=DBID]").attr("data-value"));
                    wID = String($tr.find("td[data-title=wID]").attr("data-value"));
                    if (!confirm("确定将第" + wID + "条证书种类撤销吗？")) {
                        return;
                    }
                    model.com.postDeleteGroup({
                        GroupID: dbid,
                    }, function (res) {
                        alert("删除成功！！");
                        model.com.refresh();
                    });
                });


                $("body").delegate("#lmvt-main-body tr", "dbclick", function () {
                    var $this = $(this),
                        id = $this.find("td[data-title=showID]").attr("data-value"),
                        TastID,
                        materialNo;

                    if (flag == 1) {
                        $.each(Plan_source, function (i, item) {
                            if (item.showID == id) {
                                deflautList = item.LocationPlanList;
                                TastID = item.TaskPartID;
                                materialNo = item.MaterialNo
                            }
                        });

                        $.each(deflautList, function (i, item) {
                            item.ID = i + 1;
                        });

                        model.com.Render(deflautList);
                    }
                    else {

                        model.com.getMaterialTaskProductLocationAll({ TaskMaterialID: Product_source[id - 1].ID }, function (res) {
                            if (!res)
                                return;
                            var list = res.list,
                                rst = [];
                            if (list) {
                                model.com.Render(res.list);
                            }

                        });
                    }

                });

                //双击证书种类
                $("body").delegate(".lmvt-encoding-body tr", "dblclick", function () {
                    var $this = $(this),
                        _GroupID = Number($this.find("td[data-title=DBID]").attr("data-value"));
                    var $table = $this.closest("table");

                    model.com.getGetItemsByGroupID({GroupID: _GroupID,

                    }, function (res) {

                        var list = res.list,
                            rst = [];
                        if (list) {
                            CodeSource = $com.util.Clone(res.list);
                            CodeRuleList = $com.util.Clone(res.list);
                            $.each(CodeRuleList, function (i, item) {
                                for (var p in item) {
                                    if (!Formattrt_Code[p])
                                        continue;
                                    item[p] = Formattrt_Code[p](item[p]);
                                }
                                item.wID = i + 1;
                            });
                            $(".lmvt-type-body").html($com.util.template(CodeRuleList, HTML.CodeRuleList));
                        }
                    });


                    $table.find("tbody tr").each(function (i, item) {
                        var $tr = $(this);

                        if (_GroupID == Number($tr.find("td[data-title=DBID]").attr("data-value"))) {
                            $tr.css('background-color', '#7bf1b5');
                            temp = true;

                        }
                        else {
                            if (!($tr.attr("data-color"))) {

                                $tr.css('background-color', '');
                            } else {

                                var colorPro = $tr.attr("data-color");
                                $tr.css('background-color', colorPro);
                            }
                        }
                    });

                    model.com.RendarRule(id);
                    return false;
                });

                //新增证书
                $("body").delegate("#lmvt-type-add", "click", function () {

                    Defaul_Value_Rule = {
                        GroupName: "",
                        ItemName: "",
                        ItemComments: "",
                    };
                    TypeSource_Rule.GroupName = [];
                    $.each(GroupNameList, function (i, item) {
                        TypeSource_Rule.GroupName.push({
                            name: item.name,
                            value: item.value
                        });
                    });
                    $("body").append($com.modal.show(Defaul_Value_Rule, KETWROD_Rule, "新增", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        };
                        var _InGroupID = rst.GroupName;
                        var _ItemName = rst.ItemName;
                        var _ItemComments = rst.ItemComments;
                        model.com.postAddNewItem({
                            InGroupID: _InGroupID,
                            ItemName: _ItemName,
                            ItemComments: _ItemComments
                        }, function (res) {
                            alert("新增成功！！");
                            GroupNameList = [];
                            model.com.refresh();
                            model.com.RendarRule();
                        });

                    }, TypeSource_Rule));
                });
                //查看全部证书
                $("body").delegate("#lmvt-type-CheckAll", "click", function () {
                    model.com.RendarRule();
                });

                //新增证书种类
                $("body").delegate("#lmvt-encoding-addType", "click", function () {
                    $("body").append($com.modal.show(Defaul_Value_Code, KETWROD_Code, "新增", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        };
                        model.com.postAddGroup({
                            GroupName: rst.GroupName,
                        }, function (res) {
                            alert("新增成功！！");
                            GroupNameList = [];
                            model.com.refresh();
                            model.com.RendarRule();
                        });

                    }, TypeSource_Code));
                });
                //查看全部证书
                $("body").delegate("#lmvt-type-CheckAll", "click", function () {
                    model.com.RendarRule();
                });


                //查询具体证书
            $("body").delegate("#zace-searchApproval-level", "click", function () {
                var value = $("#zace-search-approval").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-riskLevel-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-riskLevel-tbody"), CodeRuleList, value, "CertificationName");
            });


            },

            run: function () {
                model.com.refresh();
            },

            com: {

                //获取证书种类
                getAllGroup: function (data, fn, context) {
                    var d = {
                        $URI: "/QMGroup/GetAllGroups",
                        $TYPE: "get",
                        $SERVER: "/MESWDW"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //增加证书种类
                postAddGroup: function (data, fn, context) {
                    var d = {
                        $URI: "/QMGroup/AddNewGroup",
                        $TYPE: "post",
                        $SERVER: "/MESWDW"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //修改证书种类
                postUpdateGroup: function (data, fn, context) {
                    var d = {
                        $URI: "/QMGroup/UpdateGroup",
                        $TYPE: "post",
                        $SERVER: "/MESWDW"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //删除证书种类
                postDeleteGroup: function (data, fn, context) {
                    var d = {
                        $URI: "/QMGroup/DeleteGroup",
                        $TYPE: "post",
                        $SERVER: "/MESWDW"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //查看所有证书
                getAllItems: function (data, fn, context) {
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
                //增加证书
                postAddNewItem: function (data, fn, context) {
                    var d = {
                        $URI: "/QMItem/AddNewItem",
                        $TYPE: "post",
                        $SERVER: "/MESWDW"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //修改证书
                postUpdateItem: function (data, fn, context) {
                    var d = {
                        $URI: "/QMItem/UpdateItem",
                        $TYPE: "post",
                        $SERVER: "/MESWDW"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //删除多项证书
                postDeleteItems: function (data, fn, context) {
                    var d = {
                        $URI: "/QMItem/DeleteItems",
                        $TYPE: "post",
                        $SERVER: "/MESWDW"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //修改多项证书所属种类
                postChangeItemsGroup: function (data, fn, context) {
                    var d = {
                        $URI: "/QMItem/ChangeItemsGroup",
                        $TYPE: "post",
                        $SERVER: "/MESWDW"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取某一类所有证书
                getGetItemsByGroupID: function (data, fn, context) {
                    var d = {
                        $URI: "/QMItem/GetItemsByGroupID",
                        $TYPE: "get",
                        $SERVER: "/MESWDW"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                refresh: function () {
                    model.com.getAllGroup({}, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];
                        if (list) {
                            CodeSource = $com.util.Clone(res.list);
                            CodeList = $com.util.Clone(res.list);
                            GroupNameList = [];
                            $.each(CodeList, function (i, item) {
                                for (var p in item) {
                                    if (!Formattrt_Code[p])
                                        continue;
                                    item[p] = Formattrt_Code[p](item[p]);
                                }
                                item.wID = i + 1;
                                GroupNameList.push({
                                    name: item.GroupName,
                                    value: item.DBID
                                });
                            });
                            $(".lmvt-encoding-body").html($com.util.template(CodeList, HTML.CodeList));

                            $(".lmvt-encoding-body tr").each(function (i, item) {
                                var $tr = $(this);

                                if (ChoiceID == Number($tr.find("td[data-title=ID]").attr("data-value"))) {
                                    $tr.css('background-color', '#7bf1b5');
                                }
                                else {
                                    if (!($tr.attr("data-color"))) {

                                        $tr.css('background-color', '');
                                    } else {

                                        var colorPro = $tr.attr("data-color");
                                        $tr.css('background-color', colorPro);
                                    }
                                }
                            });

                        }
                        model.com.RendarRule();
                    });
                },
                RendarRule: function () {
                    $(".lmvt-container-main-encoding").css("width", "20%");
                    $(".lmvt-container-main-encoding").css("padding-right", "10px");
                    $(".lmvt-container-type-encoding").css("width", "80%");
                    $(".lmvt-container-main-encoding").css("padding-left", "10px");
                    $(".lmvt-container-type-encoding").show();
                    model.com.getAllItems({}, function (res1) {

                        var list = res1.list,
                            rst = [];
                        if (list) {
                            CodeSource = $com.util.Clone(res1.list);
                            CodeRuleList = $com.util.Clone(res1.list);
                            $.each(CodeRuleList, function (i, item) {
                                for (var p in item) {
                                    if (!Formattrt_Code[p])
                                        continue;
                                    item[p] = Formattrt_Code[p](item[p]);
                                }
                                item.wID = i + 1;
                            });
                           model.com.RanderCodeList(CodeRuleList);
                        }
                    });
                },

                RanderCodeList: function (Data) {

                    $page.init($(".grinding-table"), Data, "", function (res) {


                        CodeRanderSource = res;

                        $(".lmvt-type-body").html($com.util.template(res, HTML.CodeRuleList));



                    });

                },

            },
        });
        model.init();
    });