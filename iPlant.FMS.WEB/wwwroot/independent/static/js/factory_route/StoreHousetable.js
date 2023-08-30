require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($alfie, $com) {
    var mFormatter_Search; //字段格式化对象
    var mDefault_Value_Search; //查询模态框对象
    var mKeyword_Search; //查询关键字
    var mKeyword_List_Search; //定义字段格式(用于表格字段转换)
    var mTypeSource_Search; //枚举对象(用于字段转换)
    var mCloneData; //克隆的数据源(用于模糊查询)
    var mHTML; //mHTML模板
    var mModelTemp; //全局数据模型
    var mData; //全局数据源
    var CarArray = [];
    var CarList = [];
    var CarArrayList = [];
    var mDefault_Value_Modal; //模态框显示字段
    var BOMData = [
        {
            name: "ID",
            value: "编号",
            active: 1
        }, {
            name: "PartNo",
            value: "车号",
            active: 1
        }, {
            name: "StockName",
            value: "库位名称",
            active: 1
        }, {
            name: "StationName",
            value: "台位名称",
            active: 1
        }, {
            name: "Length",
            value: "长度(mm)",
            active: 1
        }, {
            name: "CarType",
            value: "类型",
            active: 1
        }, {
            name: "Status",
            value: "是否绑定",
            active: 1
        }
    ]
    mHTML = {
        TableNode_item: [
            '<tr data-color="">',
            '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td>',
            '<td style="min-width: 50px" data-title="Code" data-value="{{Code}}">{{Code}}</td>',
            '<td style="min-width: 50px" data-title="Name" data-value="{{Name}}">{{Name}}</td>',
            '<td style="min-width: 50px" data-title="Capacity" data-value="{{Capacity}}">{{Capacity}}</td>',
            '<td style="min-width: 50px" data-title="Length" data-value="{{Length}}">{{Length}}</td>',
            '<td style="min-width: 50px" data-title="UsableLength" data-value="{{UsableLength}}">{{UsableLength}}</td>',
            // '<td style="" data-title="ExecutionProgress" data-value="{{ExecutionProgress}}"><div style="border: 1px solid black; width: 100px ;height: 20px;display: inline-block;"></div></td>',
            '<td style="" data-title="ExecutionProgress" data-value="{{ExecutionProgress}}"><progress max="100" value={{ExecutionProgress}} style="width: 100px ;height: 15px;"><progress></td>',
            '<td style="min-width: 50px" data-title="Percentage" data-value="{{Percentage}}">{{Percentage}}</td>',
            '</tr>',
        ].join(""),
        // TableAptitudeItemNode: [
        //     '<tr>',
        //     '<td id="OnlyTD{{ID}}" style="width: 5px"><svg t="1572941411971" class="lmvt-open" data-id={{ID}} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2068" width="16" height="16"><path d="M285.568 1022.293333c-5.354667 0-10.730667-2.026667-14.890667-6.037333-8.448-8.234667-8.618667-21.738667-0.405333-30.165333l438.826667-450.538667c7.530667-7.722667 8.213333-17.408 7.957333-22.485333 0.448-10.88-2.389333-18.858667-7.957333-24.576L270.272 37.909333c-8.213333-8.448-8.042667-21.952 0.405333-30.165333 8.426667-8.213333 21.952-8.042667 30.165333 0.405333l438.848 450.581333c13.909333 14.314667 21.013333 33.6 20.010667 54.336 1.024 18.624-6.08 37.930667-20.010667 52.245333L300.842667 1015.829333C296.661333 1020.138667 291.114667 1022.293333 285.568 1022.293333z" p-id="2069" fill="#2c2c2c"></path></svg></td>',
        //     '<td style="width: 3px"><input type="checkbox"',
        //     '	class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
        //     '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td>	     ',
        //     '<td style="min-width: 50px" data-title="PartNo" data-value="{{PartNo}}">{{PartNo}}</td>',
        //     '<td style="min-width: 50px" data-title="Length" data-value="{{Length}}">{{Length}}</td>',
        //     '<td style="min-width: 50px" data-title="StockName" data-value="{{StockName}}">{{StockName}}</td>',
        //     '<td style="min-width: 50px" data-title="StationName" data-value="{{StationName}}">{{StationName}}</td>',

        //     // '<td style="min-width: 50px" data-title="CarType" data-value="{{CarType}}">{{CarType}}</td> ',
        //     // '<td style="min-width: 50px" data-title="Status" data-value="{{Status}}">{{Status}}</td>  ',
        //     '</tr>',
        //     '<tr style="">',
        //     '<td></td>',
        //     '<td colspan="9">',
        //     '</td>',
        //     '</tr>',
        // ].join(""),
        TableAptitudeItemNode: [
            '<tr data-color="">',
            '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td>',
            '<td style="min-width: 50px" data-title="PartNo" data-value="{{PartNo}}">{{PartNo}}</td>',
            '<td style="min-width: 50px" data-title="CarTypeName" data-value="{{CarTypeName}}">{{CarTypeName}}</td>',
            '<td style="min-width: 50px" data-title="Length" data-value="{{Length}}">{{Length}}</td>',
            '<td style="min-width: 50px" data-title="StockName" data-value="{{StockName}}">{{StockName}}</td>',
            '<td style="min-width: 50px" data-title="StationName" data-value="{{StationName}}">{{StationName}}</td>',

            '</tr>',
        ].join(""),

        insertTemplate: ['<tr class="OnlyTable" id="OnlyTable"><td></td><td colspan="8">{{SonTable}}</td></tr>'].join(""),
    }
    // mArray = [{
    //     ID: 1,
    //     PartNo: "HDX1B#001",
    //     Length: 23000,
    //     CarType: 1,
    //     StockID: 22,
    //     StockName: "C20",
    //     StationID: 40,
    //     StationName: "C1外",
    //     Status: 0,
    //     ItemList: [
    //         {
    //             ID: 2,
    //             PartNo: "HDX1B#001",
    //             StockName: "C20",
    //             StationName: "C1外",
    //             Length: 23000,
    //             CarType: 2,
    //             StockID: 22,
    //             StationID: 40,
    //             Status: 1,
    //         },
    //         {
    //             ID: 3,
    //             PartNo: "HDX1B#001",
    //             StockName: "C20",
    //             StationName: "C1外",
    //             Length: 23000,
    //             CarType: 2,
    //             StockID: 22,
    //             StationID: 40,
    //             Status: 1,
    //         },
    //     ]
    // }, {
    //     ID: 4,
    //     PartNo: "HDX1B#003",
    //     Length: 23000,
    //     CarType: 1,
    //     StockID: 22,
    //     StockName: "C20",
    //     StationID: 40,
    //     StationName: "C1内",
    //     Status: 0,
    //     length: 23000,
    //     ItemList: [
    //         {
    //             ID: 5,
    //             PartNo: "HDX1B#001",
    //             StockName: "C20",
    //             StationName: "C1外",
    //             Length: 23000,
    //             CarType: 2,
    //             StockID: 22,
    //             StationID: 40,
    //             Status: 1,
    //         },
    //         {
    //             ID: 6,
    //             PartNo: "HDX1B#001",
    //             StockName: "C20",
    //             StationName: "C1外",
    //             Length: 23000,
    //             CarType: 2,
    //             StockID: 22,
    //             StationID: 40,
    //             Status: 1,
    //         },
    //     ]
    // }

    // ];
    mModelTemp = {
        'ID': 0,
        'Code': "",
        'Name': "",
        'Capacity': 0,
        'Length': 0,
        // 'Creator': 0,
        // 'CreateTime': new Date(),
        // 'Active': 0
    }

    //查询字段定义
    mDefault_Value_Search = {
        'StartTime': new Date(),
        'EndTime': new Date(),
    };

    //初始化字段模板
    (function () {
        mKeyword_List_Search = [
            "Code|库位编码",
            "Name|库位名称",
            "Capacity|台位容量",
            "Length|长度",
            "CarType|类型|ArrayOne",
            "Status|是否绑定|ArrayOne",
        ];
        mDefault_Value_Modal = {
            'Name': "",
            'Code': "",
            'Capacity': 0,
            'Length': 0
        };

        mKeyword_Search = {};

        mFormatter_Search = {};


        mTypeSource_Search = {
            Status: [{
                'name': "已绑定",
                'value': 1
            },
            {
                'name': "未绑定",
                'value': 0
            }],

            CarType: [{
                'name': "车体",
                'value': 1
            },
            {
                'name': "底盘",
                'value': 2
            }]
        };

        $.each(mKeyword_List_Search, function (i, item) {
            var detail = item.split("|");
            mKeyword_Search[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };

            if (detail.length > 2) {
                mFormatter_Search[detail[0]] = $com.util.getFormatter(mTypeSource_Search, detail[0], detail[2]);
            }
        });
    })();

    model = $com.Model.create({
        name: '库位容量表',

        type: $com.Model.MAIN, //主方法

        configure: function () {
            this.run();
        },

        events: function () {
            //Enter触发模糊查询事件
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var value = $("#alfie-search-Device-item").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-Device-tbody-item").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-Device-tbody-item"), mCloneData, value, "ID");
                }
            });
            //模糊查询(库位容量表)
            $("body").delegate("#zace-searchZApproval-level-Search", "click", function () {
                var value = $("#alfie-search-Device-item").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-Device-tbody-item").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-Device-tbody-item"), mCloneData, value, "ID");
            });
            //Enter触发模糊查询事件
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var value = $("#Device-item-search").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-Device-tbody-itemCar").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-Device-tbody-itemCar"), CarArrayList, value, "ID");
                }
            });
            //模糊查询(车辆列表)
            $("body").delegate("#zace-Search", "click", function () {
                var value = $("#Device-item-search").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-Device-tbody-itemCar").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-Device-tbody-itemCar"), CarArrayList, value, "ID");
            });
            //条件查询(筛选库位)
            $("body").delegate("#Device-search-place", "click", function () {
                $("body").append($com.modal.show(Default_Value_Modal, Keyword_Search, "查询", function (rst) {
                    if (!rst || $.isEmptyObject(rst)) {
                        return false;
                    }
                    mPartNo = rst.PartNo;
                }, TypeSource_Search));
            });
            //查看车辆列表
            $("body").delegate("#femi-Device-tbody-item tr", "dblclick", function () {
                CarArray = [];
                var $this = $(this);
                var CarID = Number($this.find('td[data-title=ID]').attr('data-value'));
                for (var i = 0; i < mData.length; i++) {
                    if (CarID == mData[i].ID) {
                        CarArray.push(mData[i]);
                    }
                }
                model.com.PostStoreAllTrain({ data: CarArray[0] }, function (res) {
                    if (res.msg) {
                        alert(res.msg);
                        return false;
                    } else {
                        $(".zzza").hide();
                        $(".zzzb").show();
                        CarList = res.list;
                        CarArrayList = $com.util.Clone(res.list);
                        for (var i = 0; i < CarArrayList.length; i++) {
                            CarArrayList[i].ID = i + 1;
                        }

                        $("#femi-Device-tbody-itemCar").html($com.util.template(CarArrayList, mHTML.TableAptitudeItemNode));

                        // $(document).ready(function () {
                        //     $("#femi-Device-tbody-itemCar tr").each(function (i, item) {
                        //         var e = jQuery.Event("click");
                        //         $("body").find(item).find(".lmvt-open").trigger(e);

                        //         if ($(item).next().find("tbody").find("tr").length > 0) {
                        //             model.com.recursionClick($(item).next().find("tbody").find("tr"));
                        //         }
                        //     });
                        // });
                    }

                })

            });
            $("body").delegate(".lmvt-open", "click", function (e) {

                var $this = $(this),
                    ID = $this.attr("data-id");

                AppendBody = $this.closest("tr");
                AppendBody.next().show();
                $("#OnlyTD" + ID).html("<svg t=\"1572942263078\" class=\"lmvt-close\" data-id=" + ID + "" + " viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"2582\" width=\"16\" height=\"16\"><path d=\"M1012.1 255.6c-12.3-12.6-32.4-12.6-45-0.4L512 702.7 57 255.3c-12.5-12.3-32.7-12.3-45 0.3-12.3 12.5-12.2 32.7 0.4 45L489.7 770c2 2 4.5 3.2 6.9 4.5 1.2 0.7 2.2 1.8 3.5 2.3 3.8 1.6 7.9 2.4 12 2.4s8.1-0.8 12-2.4c1.3-0.5 2.3-1.6 3.5-2.3 2.4-1.3 4.8-2.5 6.9-4.5l477.3-469.4c12.4-12.3 12.6-32.4 0.3-45z\" fill=\"#333234\" p-id=\"2583\"></path></svg>");

                if (AppendBody.next().attr("class") == "OnlyTable") {
                    return false;
                }
                else {
                    //$.each(PLMBomList, function (i, item) {
                    //    if (ID == item.PUID) {
                    model.com.getTableList(ID, CarList);
                    //    }
                    //});
                }
                return false;
            });
            $("body").delegate(".lmvt-close", "click", function () {
                var $this = $(this),
                    ID = $this.attr("data-id"),
                    // DeepID = $this.attr("data-deep"),
                    AppendBody = $this.closest("tr");
                if (AppendBody.next().attr("class") == "OnlyTable") {
                    AppendBody.next().hide();

                }
                $("#OnlyTD" + ID).html("<svg t=\"1572941411971\" class=\"lmvt-open\" data-id=" + ID + " " + "viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"2068\" width=\"16\" height=\"16\"><path d=\"M285.568 1022.293333c-5.354667 0-10.730667-2.026667-14.890667-6.037333-8.448-8.234667-8.618667-21.738667-0.405333-30.165333l438.826667-450.538667c7.530667-7.722667 8.213333-17.408 7.957333-22.485333 0.448-10.88-2.389333-18.858667-7.957333-24.576L270.272 37.909333c-8.213333-8.448-8.042667-21.952 0.405333-30.165333 8.426667-8.213333 21.952-8.042667 30.165333 0.405333l438.848 450.581333c13.909333 14.314667 21.013333 33.6 20.010667 54.336 1.024 18.624-6.08 37.930667-20.010667 52.245333L300.842667 1015.829333C296.661333 1020.138667 291.114667 1022.293333 285.568 1022.293333z\" p-id=\"2069\" fill=\"#2c2c2c\"></path></svg>");
                return false;
            });

            $("body").delegate("#back", "click", function () {
                $(".zzza").show();
                $(".zzzb").hide();
            });
        },

        run: function () {
            newArray = $com.util.Clone(CarList);
            model.com.refresh();
        },

        com: {
            //刷新界面
            refresh: function () {
                $com.app.loading('数据加载中...');
                model.com.getStoreCapacity({}, function (res) {
                    if (res.msg) {
                        alert(res.msg);
                        return false;
                    }
                    if (res && res.list) {
                        mData = $com.util.Clone(res.list);
                        //数据源字段模板转换
                        var wItem = $com.util.Clone(mData);
                        // $.each(wItem, function (i, item) {
                        //     for (var p in item) {
                        //         if (!mFormatter_Search[p])
                        //             continue;
                        //         item[p] = mFormatter_Search[p](item[p]);
                        //     }
                        // });
                        // ExecutionProgress Percentage
                        for (var i = 0; i < wItem.length; i++) {
                            if (wItem[i].length == 0) {
                                wItem[i].ExecutionProgress = 0;
                                wItem[i].Percentage = "0%";
                            } else {
                                wItem[i].Percentage = 100 - Math.floor((Number((wItem[i].UsableLength / wItem[i].Length)) * 100));
                                wItem[i].ExecutionProgress = wItem[i].Percentage;
                                wItem[i].Percentage = String(Number(wItem[i].Percentage)) + "%";
                            }
                        }
                        mCloneData = $com.util.Clone(wItem);
                        $("#femi-Device-tbody-item").html($com.util.template(wItem, mHTML.TableNode_item));
                        $com.app.loaded();
                    }
                });
            },

            //查询库位可用容量
            getStoreCapacity: function (data, fn, context) {
                var d = {
                    $URI: "/Capacity/QueryStoreCapacity",
                    $TYPE: "get",
                    $SERVER: "/MESWDW"
                };

                function err() {
                    $com.app.tip('新增或修改库位失败，请检查网络!');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询库位下所有车辆列表
            PostStoreAllTrain: function (data, fn, context) {
                var d = {
                    $URI: "/Capacity/PostStoreAllTrain",
                    $TYPE: "Post",
                    $SERVER: "/MESWDW"
                };

                function err() {
                    $com.app.tip('新增或修改库位失败，请检查网络!');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //递归触发svg点击事件
            recursionClick: function (obj) {

                obj.each(function (i, item) {
                    var e = jQuery.Event("click");
                    $("body").find(item).find(".lmvt-open").trigger(e);
                });

                if (obj.next().find("tbody").find("tr").length > 0) {
                    model.com.recursionClick(obj.next().find("tbody").find("tr"));
                }
                else {
                    return true;
                }
            },
            //渲染TR
            randerTemplateTR: function (arry) {
                var str = "<tr data-color=\"\"><td id=\"OnlyTD{{ID}}\" style=\"width: 5px\"><svg t=\"1572941411971\" class=\"lmvt-open\" data-id={{ID}} viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"2068\" width=\"16\" height=\"16\"><path d=\"M285.568 1022.293333c-5.354667 0-10.730667-2.026667-14.890667-6.037333-8.448-8.234667-8.618667-21.738667-0.405333-30.165333l438.826667-450.538667c7.530667-7.722667 8.213333-17.408 7.957333-22.485333 0.448-10.88-2.389333-18.858667-7.957333-24.576L270.272 37.909333c-8.213333-8.448-8.042667-21.952 0.405333-30.165333 8.426667-8.213333 21.952-8.042667 30.165333 0.405333l438.848 450.581333c13.909333 14.314667 21.013333 33.6 20.010667 54.336 1.024 18.624-6.08 37.930667-20.010667 52.245333L300.842667 1015.829333C296.661333 1020.138667 291.114667 1022.293333 285.568 1022.293333z\" p-id=\"2069\" fill=\"#2c2c2c\"></path></svg></td><td style=\"width: 3px\"><input type=\"checkbox\"class=\"femi-tb-checkbox\" style=\"margin: 1px 0px 1px\" /></td>";
                if (!$com.util.isArray(arry)) {
                    return;
                }
                else {
                    $.each(arry, function (i, item) {
                        if (i != 0) {
                            return false;
                        }
                        //str += "<td style=\"min-width: 50px\" data-title=\"" + item + "\" " + "data-value=\"" + "{{" + item + "}}\"" + " " + ">" + "{{" + item + "}}" + "</td>";

                        for (var p in item) {
                            var NameCat = "";

                            $.each(BOMData, function (j, jtem) {
                                if (jtem.active != 0) {
                                    if (jtem.name == p) {
                                        NameCat = p;
                                        str += "<td style=\"min-width: 50px\" data-title=\"" + NameCat + "\" " + "data-value=\"" + "{{" + NameCat + "}}\"" + " " + ">" + "{{" + NameCat + "}}" + "</td>";
                                    }
                                }
                            });

                        }
                    });
                }
                str += "</tr>";
                return str;
            },
            //渲染TD
            randerTemplateTD: function (arry) {
                var str = "<div class=\"femi-tb-scroll\"><table class=\"table table-bordered\"> <thead class=\"sontable-show\" style=\"\"> <tr data-color=\"\"><th></th><th style=\"min-width: 3px;\"><input type=\"checkbox\"class=\"femi-tb-checkbox\" style=\"margin: 1px 0px 1px\"value=\"{{functionID}}\" /></th>";
                if (!$com.util.isArray(arry)) {
                    return;
                }
                else {
                    $.each(arry, function (i, item) {
                        if (i != 0) {
                            return false;
                        }
                        //str += "<th style=\"min-width: 50px\" data-title=\"" + item + "\" " + "data-value=\"" + item + "\"" + " " + ">" + item + "</th>";

                        for (var p in item) {
                            var NameCat = "";
                            if (p == "LayerID" || p == "ItemList" || p == "PID") {
                                continue;
                            }
                            $.each(BOMData, function (j, jtem) {
                                if (jtem.active != 0) {
                                    if (jtem.name == p) {
                                        NameCat = jtem.value;
                                        str += "<th style=\"min-width: 50px\" data-title=\"" + NameCat + "\" " + "data-value=\"" + NameCat + "\"" + " " + ">" + NameCat + "</th>";
                                    }
                                }
                            });

                        }

                    });

                }
                str += "</tr></thead><tbody>{{TableTD}}</tbody></table></div>";
                return str;
            },
            //根据ID以及层级获取子集数据以及向父集添加数据
            getTableList: function (id, data) {

                $.each(data, function (i, item) {

                    // if (deep > item.LayerID)
                    //     return model.com.getTableList(id, deep, item.ItemList);

                    if (item.ID == id) {
                        var InsertString = "";
                        var cat = {
                            TableTD: "",
                            SonTable: "",
                            //PUID: item.PLMPRelationList["PUID"],
                        };

                        if (item.MTCRealList && item.MTCRealList.length > 0) {
                            for (var k = 0; k < item.MTCRealList.length; k++) {
                                if (item.MTCRealList[k].CarType == 2) {
                                    item.MTCRealList[k].CarType = "车底";
                                }
                                if (item.MTCRealList[k].Status == 0) {
                                    item.MTCRealList[k].Status = "未绑定";
                                }
                                if (item.MTCRealList[k].Status == 1) {
                                    item.MTCRealList[k].Status = "已绑定";
                                }
                            }
                            cat.TableTD = $com.util.template(item.MTCRealList, model.com.randerTemplateTR(item.MTCRealList));

                            cat.SonTable = $com.util.template(cat, model.com.randerTemplateTD(item.MTCRealList));

                            InsertString = $com.util.template(cat, mHTML.insertTemplate);

                            AppendBody.after(InsertString);

                            //model.com.randerCanvas(AppendBody.next().find("canvas"));
                        }
                    }
                });
            },
        }
    }),
        model.init();
});