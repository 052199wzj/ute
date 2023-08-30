require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/bootstrap-treeview.min', '../static/utils/js/base/table-select'],
    function ($lin, $com, $treeview) {

        var HTML,
            Defaul_Value_Item,
            KETWROD_LIST_Item,
            KETWROD_Item,
            Formattrt_Item,
            TypeSource_Item,
            mFMCWorkShop,
            mFMCLine,
            mDeviceModel,
            mLineID = 0,
            mWorkShopID = 0,
            mModelID = 0,
            ItemSourceList,
            Type = 1,
            RadioID,
            TimeTemp = {
                LeftTimes: 0,
                RightTimes: 0,
                Ratio: 0,
            },
            HTML = {
                TreeItemNode: [
                    '<li data-titie="{{ID}}"  data-value="{{ID}}"  >',
                    '<div class="lmvt-tree" style="vertical-align:top;Color:{{ColorText}}" data-value="{{ID}}" data-core="{{ColorText}}">{{Code}}  ({{Name}})</div> ',
                    '<ul>{{Items}}',
                    '</ul>',
                    '</li>',
                ].join(""),

                DeviceItem: [
                    '<tr>',
                    '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></th>',
                    '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}" >{{WID}}</td>',
                    '<td style="min-width: 80px" data-title="Name" data-value="{{Name}}">{{Name}}</td>',
                    // '<td style="min-width: 80px" data-title="WorkShopName" data-value="{{WorkShopName}}">{{WorkShopName}}</td>',
                    // '<td style="min-width: 80px" data-title="LineName" data-value="{{LineName}}">{{LineName}}</td>',
                    '<td style="min-width: 50px" data-title="ModeOptions" data-value="{{ModeOptions}}" >{{ModeOptions}}</td>',
                    '<td style="min-width: 50px" data-title="Comment" data-value="{{Comment}}" >{{Comment}}</td>',
                    '<td style="min-width: 50px" data-title="PDTimeC" data-value="{{PDTimeC}}" >{{PDTimeC}}</td>',
                    '<td style="min-width: 50px" data-title="PDNumC" data-value="{{PDNumC}}" >{{PDNumC}}</td>',
                    // '<td style="min-width: 80px" data-title="Editor" data-value="{{Editor}}" >{{Editor}}</td>',
                    // '<td style="min-width: 100px" data-title="EditTime" data-value="{{EditTime}}" >{{EditTime}}</td>',
                    // '<td style="min-width: 100px" data-title="CreatorID" data-value="{{CreatorID}}" >{{CreatorID}}</td>',
                    // '<td style="min-width: 80px" data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
                    '<td data-title="Active" data-value="{{Active}}" ><span class="badge lmvt-badge {{ClassBadge}}">{{Badge}}</span>{{Active}}</td>',
                    '<td style="max-width: 80px" data-title="Handle" data-value="{{ID}}"><div class="row">',
                    '<div class="col-md-4 lmvt-code-do {{ISDo}}">{{ActiveType}}</div>',
                    '<div class="col-md-4 lmvt-do-info lmvt-reset">修改</div>',
                    '<div class="col-md-4"><UL id="lmvt-nav">',
                    '<LI>更多<UL>',
                    '<LI data-value="{{ID}}" class="lmvt-info-PDTimeC">周期倍率</LI>',
                    '<LI data-value="{{ID}}" class="lmvt-info-PDNumC">个数倍率</LI>',
                    '</UL></LI></UL></div>',
                    '</div></td>',
                    '<tr>'
                ].join(""),
                TableNode_Item: [
                    '<tr data-color="">',
                    '<td style="width: 3px"><input type="checkbox"',
                    'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
                    '<td style="min-width: 50px" data-title="LeftTimes" data-value="{{LeftTimes}}">{{LeftTimes}}</td>',
                    '<td style="min-width: 50px" data-title="RightTimes" data-value="{{RightTimes}}">{{RightTimes}}</td>',
                    '<td style="min-width: 50px" data-title="Ratio" data-value="{{Ratio}}" >{{Ratio}}</td>',
                    '</tr>',
                ].join(""),
            };
        Count = 0;
        num = 0;

        UserAll = window.parent._UserAll;

        (function () {
            KETWROD_LIST_Item = [
                "Name|维修项名称",
                "ModeOptions|维修模式|Array",
                "Active|状态|ArrayOne",
                "PDTimeC|加工周期",
                "PDNumC|加工个数",
                "Comment|备注",
                "LeftTimes|左次数范围",
                "RightTimes|右次数范围",
                "Ratio|比率",
            ];

            KETWROD_Item = {};

            Formattrt_Item = {};

            TypeSource_Item = {
                ModeOptions: [{
                    name: "开机维修",
                    value: 1
                }, {
                    name: "周期维修",
                    value: 2
                }, {
                    name: "加工次数维修",
                    value: 3
                }, {
                    name: "关机前维修",
                    value: 4
                }],
                Active: [{
                    name: "默认",
                    value: 0
                }, {
                    name: "激活",
                    value: 1
                }, {
                    name: "禁用",
                    value: 2
                }],
            };

            $.each(KETWROD_LIST_Item, function (i, item) {
                var detail = item.split("|");
                KETWROD_Item[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_Item[detail[0]] = $com.util.getFormatter(TypeSource_Item, detail[0], detail[2]);
                }
            });
        })();

        model = $com.Model.create({
            name: '设备维修',

            type: $com.Model.MAIN,

            configure: function () {
                this.run();
            },

            events: function () {

                //折叠
                $("body").delegate("#lmvt-tree-open", "click", function () {
                    $("#standardItem").treeview('expandAll', { silent: true });
                });
                //展开
                $("body").delegate("#lmvt-tree-close", "click", function () {
                    $("#standardItem").treeview('collapseAll', { silent: true });
                });

                //Enter触发模糊查询事件 项点
                $(document).keyup(function (event) {
                    if (event.keyCode == 13) {
                        var value = $("#zace-search").val();
                        if (value == undefined || value == "" || value.trim().length < 1)
                            $(".zace-partAll-body").children("tr").show();
                        else
                            $com.table.filterByLikeString($(".zace-partAll-body"), ItemSourceList, value, "ID");
                    }
                });
                //查询  项点
                $("body").delegate("#zace-search-levelPro", "click", function () {

                    var $this = $(this),
                        value = $("#zace-search").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $(".zace-partAll-body").children("tr").show();
                    else
                        $com.table.filterByLikeString($(".zace-partAll-body"), ItemSourceList, value, "ID");
                });
                //新增项点
                $("body").delegate("#lmvt-standard-add", "click", function () {
                    if (mWorkShopID == 0 || mLineID == 0 || mModelID == 0) {
                        alert("请选择设备树！");
                        return false;
                    }
                    Defaul_Value_Item = {
                        Name: "",
                        PDTimeC: 0,
                        PDNumC: 0,
                        // CycleRatioList: [],
                        // PartsRatioList: [],
                        ModeOptions: [],
                        Comment: "",
                    }
                    $("body").append($com.modal.show(Defaul_Value_Item, KETWROD_Item, "新增项点", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }
                        var inputDate = {
                            ID: 0,
                            Name: rst.Name,
                            MaintainType: 2,
                            FactoryID: 0,
                            WorkShopID: mWorkShopID,
                            LineID: mLineID,
                            ModelID: mModelID,
                            PDTimeC: rst.PDTimeC,
                            PDNumC: rst.PDNumC,
                            CycleRatioList: [],
                            PartsRatioList: [],
                            ModeOptions: rst.ModeOptions,
                            Comment: rst.Comment,
                            Active: 0,
                        };
                        $com.util.deleteLowerProperty(inputDate);
                        model.com.PostItemUpdate({
                            data: inputDate,
                        }, function (res) {
                            alert("新增成功！！");
                            model.com.refresh();
                            // $('#lmvt-tree-close').click();
                            model.com.StandardItem(mLineID, mModelID, mWorkShopID);
                        });
                    }, TypeSource_Item));
                });

                //激活项点   单条
                $("body").delegate(".lmvt-do-active", "click", function () {
                    var $this = $(this),
                        wDBID = Number($this.closest("td").attr("data-value"));

                    const SelectArr = ItemSourceList.filter(item => item.ID == wDBID);
                    $com.util.deleteLowerProperty(SelectArr);
                    model.com.PostItemActive({
                        data: SelectArr,
                        Active: 1,
                        // Type: 1,
                    }, function (res) {
                        alert("激活成功！！");
                        // $('#lmvt-tree-close').click();
                        model.com.StandardItem(mLineID, mModelID, mWorkShopID);
                    });
                });
                //禁用项点   单条
                $("body").delegate(".lmvt-do-forbidden", "click", function () {
                    var $this = $(this),
                        wDBID = Number($this.closest("td").attr("data-value"));

                    const SelectArr = ItemSourceList.filter(item => item.ID == wDBID);
                    $com.util.deleteLowerProperty(SelectArr);
                    model.com.PostItemActive({
                        data: SelectArr,
                        Active: 2,
                        // Type: 1,
                    }, function (res) {
                        alert("禁用成功！！");
                        // $('#lmvt-tree-close').click();
                        model.com.StandardItem(mLineID, mModelID, mWorkShopID);
                    });
                });

                //修改项点
                $("body").delegate(".lmvt-reset", "click", function () {
                    var $this = $(this),
                        wDBID = Number($this.closest("td").attr("data-value"));

                    var SelectArr = ItemSourceList.filter(item => item.ID == wDBID)[0];

                    var Defaul_Value = {
                        Name: SelectArr.Name,
                        PDTimeC: SelectArr.PDTimeC,
                        PDNumC: SelectArr.PDNumC,
                        ModeOptions: SelectArr.ModeOptions,
                        Comment: SelectArr.Comment,
                    };
                    $("body").append($com.modal.show(Defaul_Value, KETWROD_Item, "修改", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }
                        SelectArr.Name = rst.Name;
                        SelectArr.ModeOptions = rst.ModeOptions;
                        SelectArr.PDTimeC = rst.PDTimeC;
                        SelectArr.PDNumC = rst.PDNumC;
                        SelectArr.Comment = rst.Comment;
                        $com.util.deleteLowerProperty(SelectArr);
                        model.com.PostItemUpdate({
                            data: SelectArr,
                        }, function (res) {
                            alert("修改成功！！");
                            // $('#lmvt-tree-close').click();
                            model.com.StandardItem(mLineID, mModelID, mWorkShopID);
                        });

                    }, TypeSource_Item));

                });
                //周期倍率
                $("body").delegate(".lmvt-info-PDTimeC", "click", function () {
                    var $this = $(this);
                    RadioID = Number($this.closest("td").attr("data-value"));
                    Type = 1;
                    $(".templateNameRatio").text("加工周期倍率");
                    $("#leftDIV_right").show();
                    $("#leftDIV_right").css("display", "inline-block");
                    $("#leftDIV_left").css("width", "60%");
                    model.com.RadioItem(RadioID);
                });
                //个数倍率
                $("body").delegate(".lmvt-info-PDNumC", "click", function () {
                    var $this = $(this);
                    RadioID = Number($this.closest("td").attr("data-value"));
                    Type = 2;
                    $(".templateNameRatio").text("加工个数倍率");
                    $("#leftDIV_right").show();
                    $("#leftDIV_right").css("display", "inline-block");
                    $("#leftDIV_left").css("width", "60%");
                    model.com.RadioItem(RadioID);
                });
                //隐藏
                $("body").delegate("#zace-Device-yinc", "click", function () {
                    $("#leftDIV_right").hide();
                    $("#leftDIV_left").show();
                    $("#leftDIV_left").css("width", "80%");
                });
                //加工个数倍率         
                $("body").delegate("#lmvt-DeviceRatio-add", "click", function () {

                    var SelectData = ItemSourceList.filter(item => item.ID == RadioID);
                    var DEFAULT_VALUE_Item = {
                        LeftTimes: 0,
                        RightTimes: 0,
                        Ratio: 0,
                    }
                    $("body").append($com.modal.show(DEFAULT_VALUE_Item, KETWROD_Item, "新增", function (rst) {
                        //调用插入函数 

                        if (!rst || $.isEmptyObject(rst))
                            return;
                        TimeTemp.LeftTimes = Number(rst.LeftTimes);
                        TimeTemp.RightTimes = Number(rst.RightTimes);
                        TimeTemp.Ratio = Number(rst.Ratio);

                        if (Type == 1) {
                            SelectData[0].CycleRatioList.push(TimeTemp);
                        } else if (Type == 2) {
                            SelectData[0].PartsRatioList.push(TimeTemp);
                        } else {
                            alert("请选择周期倍率或者个数倍率！");
                            return false;
                        }
                        $com.util.deleteLowerProperty(SelectData);
                        model.com.PostItemUpdate({
                            data: SelectData[0]
                        }, function (res) {
                            alert("新增成功");
                            // $('#lmvt-tree-close').click();
                            model.com.StandardItem(mLineID, mModelID, mWorkShopID);
                            model.com.RadioItem(RadioID);
                        })
                    }, TypeSource_Item));
                });
            },
            run: function () {
                model.com.refresh();
            },
            com: {
                StandardTreeBuild: function (list) {
                    if (list.length > 0)
                        var m = 0;
                    $.each(list, function (i, item) {

                        if (item.ItemIPTList && item.ItemIPTList.length > 0) {
                            var Counts = item.ItemIPTList.length;
                            item.text = item.Name;
                            item.nodes = item.ItemIPTList;
                            item.tags = [Counts];

                            model.com.StandardTreeBuild(item.ItemIPTList);
                        } else {
                            item.text = item.Name;
                            item.ModelID = item.ModelID;
                            item.WorkShopID = item.WorkShopID;
                        }
                    });

                    return list;
                },
                renderTreeStandard: function (list) {

                    list = model.com.StandardTreeBuild(list);

                    var ItemNode = 0;

                    $("#standardItem").treeview({

                        color: "black",
                        expandIcon: "glyphicon glyphicon-plus",
                        collapseIcon: "glyphicon glyphicon-minus",

                        preventUnselect: true,

                        levels: 0,

                        nodeIcon: "glyphicon glyphicon-tags",

                        showTags: true,
                        data: list,

                        onNodeSelected: function (event, data) {

                            StandardNodeID = data.nodeId;
                            ItemNode = data.nodeId;
                            var sels = $('#standardItem').treeview('getSelected');
                            for (var i = 0; i < sels.length; i++) {
                                if (sels[i].nodeId == data.nodeId) {
                                    continue;
                                }
                                $('#standardItem').treeview('unselectNode', [sels[i].nodeId, { silent: true }]);
                            }
                            $("#standardItem").treeview('selectNode', [data.nodeId, { silent: true }]);


                            mLineID = !data.LineID ? -1 : data.LineID;
                            mWorkShopID = !data.WorkShopID ? -1 : data.WorkShopID;
                            mModelID = !data.ModelID ? -1 : data.ModelID;
                            ZaceLineID = 0;
                            ChangeData = 0;
                            model.com.StandardItem(mLineID, mModelID, mWorkShopID);
                        },
                        onNodeUnselected: function (event, data) {
                            if (ItemNode != data.nodeId)
                                return false;
                            $('#standardItem').treeview('toggleNodeSelected', [ItemNode, { silent: true }]);
                        }

                    });
                },
                StandardItem: function (LineID, ModelID, WorkShopID) {
                    model.com.getItemAll({
                        DSType: 1, MaintainType: 2, ModelID: ModelID, FactoryID: -1, WorkShopID: WorkShopID, LineID: LineID, Active: -1,
                    }, function (res) {
                        ItemAllList = res.list;
                        ItemSourceList = $com.util.Clone(ItemAllList);
                        $.each(ItemAllList, function (i, item) {
                            item.WID = i + 1;
                            item.Badge = " ";
                            if (item.Active == 0) {
                                item.ActiveType = "激活";
                                item.ISDo = "lmvt-do-active";
                                item.ClassBadge = "lmvt-defBadge";
                            } else if (item.Active == 1) {
                                item.ActiveType = "禁用";
                                item.ISDo = "lmvt-do-forbidden";
                                item.ClassBadge = "lmvt-activeBadge";
                            } else {
                                item.ActiveType = "激活";
                                item.ISDo = "lmvt-do-active";
                                item.ClassBadge = "lmvt-forbiddenBadge";
                            }
                            for (var p in item) {
                                if (!Formattrt_Item[p])
                                    continue;
                                item[p] = Formattrt_Item[p](item[p]);
                            }
                        });
                        $(".zace-partAll-body").html($com.util.template(ItemAllList, HTML.DeviceItem));
                    });
                },
                RadioItem: function (RadioID) {
                    model.com.getItemInfo({
                        ID: RadioID, DSType: 1
                    }, function (res) {
                        if (Type == 1) {
                            wRadioID = res.info.CycleRatioList;
                        } else if (Type == 2) {
                            wRadioID = res.info.PartsRatioList;
                        } else {
                            wRadioID = [];
                        }
                        $("#femi-Device-tbody-time").html($com.util.template(wRadioID, HTML.TableNode_Item));
                    });
                },
                //查询维修项所有
                getItemAll: function (data, fn, context) {
                    var d = {
                        $URI: "/DMSMaintain/ItemAll",
                        $TYPE: "get",
                        $SERVER: '/MESQMS',
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //查询维修项 单条
                getItemInfo: function (data, fn, context) {
                    var d = {
                        $URI: "/DMSMaintain/ItemInfo",
                        $TYPE: "get",
                        $SERVER: '/MESQMS',
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //维修项新增
                PostItemUpdate: function (data, fn, context) {
                    var d = {
                        $URI: "/DMSMaintain/ItemUpdate",
                        $TYPE: "post",
                        $SERVER: '/MESQMS',
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //维修项激活禁用
                PostItemActive: function (data, fn, context) {
                    var d = {
                        $URI: "/DMSMaintain/ItemActive",
                        $TYPE: "post",
                        $SERVER: '/MESQMS',
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //查询台账
                getDeviceModel: function (data, fn, context) {
                    var d = {
                        $URI: "/DeviceModel/All",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //人员
                getUserAll: function (data, fn, context) {
                    var d = {
                        $URI: "/User/All",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //产线信息
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
                //车间信息
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
                refresh: function () {
                    model.com.getDeviceModel({
                        Type: 1, Active: -1
                    }, function (resD) {
                        ItemList = [];
                        mDeviceModel = resD.list;
                        model.com.getFMCWorkShop({
                            FactoryID: 0, BusinessUnitID: 0
                        }, function (resF) {
                            mFMCWorkShop = resF.list;
                            for (m = 0; m < mDeviceModel.length; m++) {
                                mDeviceModel[m].Name = mDeviceModel[m].ModelName + "(" + mDeviceModel[m].ModelNo + ")";
                                mDeviceModel[m].ModelID = mDeviceModel[m].ID;
                                mDeviceModel[m].ItemIPTList = [];
                                for (n = 0; n < mFMCWorkShop.length; n++) {
                                    var OBJ = {};
                                    mFMCWorkShop[n].WorkShopID = mFMCWorkShop[n].ID;
                                    mFMCWorkShop[n].ModelID = mDeviceModel[m].ID;
                                    OBJ = $com.util.Clone(mFMCWorkShop[n]);
                                    mDeviceModel[m].ItemIPTList.push(OBJ);
                                }
                                ItemList.push(mDeviceModel[m]);
                            }
                            model.com.getFMCLine({
                                FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0
                            }, function (resFM) {
                                mFMCLine = resFM.list;
                                TreeItemList = [];
                                for (var p = 0; p < ItemList.length; p++) {
                                    for (var k = 0; k < ItemList[p].ItemIPTList.length; k++) {
                                        ItemList[p].ItemIPTList[k].ItemIPTList = [];
                                        for (var q = 0; q < mFMCLine.length; q++) {
                                            var OBJ = {};
                                            mFMCLine[q].WorkShopID = ItemList[p].ItemIPTList[k].ID;
                                            mFMCLine[q].ModelID = ItemList[p].ID;
                                            mFMCLine[q].LineID = mFMCLine[q].ID;
                                            OBJ = $com.util.Clone(mFMCLine[q]);
                                            ItemList[p].ItemIPTList[k].ItemIPTList.push(OBJ);
                                        }
                                    }
                                    TreeItemList.push(ItemList[p]);
                                }
                                model.com.renderTreeStandard(TreeItemList);
                            });
                        });

                    })
                },
            },
        });
        model.init();
    });