require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'],
    function ($lin, $com) {
        var HTML,
            Materia,
            Stock,
            //判断计划或者补料
            temp,
            PointID,
            materialno,

            DataSee,
            SubmitData,
            //仓位集合以及仓位上级ID
            LocationList,
            LocationID,

            //工步
            PartPointSource,

            deflautList,
            Csupplement,
            deflautSurportList,
            //补料
            SChooice,
            Supplement_source,
            Data_Supplement,
            AllMode,
            //查询
            wID,
            lID,
            mID,
            plineID,
            date,
            StartDate,
            EndDate,
            ShiftID,
            Time,
            //生成
            Plan_source,
            DataPlan_source,
            mainPlanList,
            surportPlanList,
            flag,

            Product_source,
            DataProduct_source,
            MaterialName,
            mainMaterialList,
            surportMaterialList,
            //物料优先级
            DEFAULT_VALUE_Hand,
            KETWROD_LIST_Hand,
            KETWROD_Template_Hand,
            Formattrt_Hand,
            TypeSource_Hand,
            //物料数量
            DEFAULT_VALUE_Number,
            KETWROD_LIST_Number,
            KETWROD_Template_Number,
            Formattrt_Number,
            TypeSource_Number,
            //查询
            DEFAULT_VALUE_MESCheck,
            KETWROD_LIST_MESCheck,
            KETWROD_Template_MESCheck,
            Formattrt_MESCheck,
            TypeSource_MESCheck;

        HTML = {
            MainList: [
                '<tr data-color="">',
                '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></td>',
                  '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
                '<td style="min-width: 50px" data-title="showID" data-value="{{showID}}" >{{showID}}</td>',
                '<td style="min-width: 80px" data-title="TypeText" data-value="{{TypeText}}" >{{ TypeText}}</td>',
                //'<td style="min-width: 50px" data-title="WorkShopName" data-value="{{WorkShopName}}" >{{ WorkShopName}}</td>',
                '<td style="min-width: 50px" data-title="LineName" data-value="{{LineName}}" >{{ LineName}}</td>',
                '<td style="min-width: 50px" data-title="PartName" data-value="{{PartName}}" >{{PartName}}</td>',
                '<td style="min-width: 50px" data-title="PartPointName" data-value="{{PartPointName}}" >{{PartPointName}}</td>',
                '<td style="min-width: 80px" data-title="ProductNo" data-value="{{ProductNo}}" >{{ ProductNo}}</td>',
                '<td style="min-width: 50px" data-title="OrderNo" data-value="{{OrderNo}}" >{{ OrderNo}}</td>',
                '<td style="min-width: 50px" data-title="MaterialNo" data-value="{{MaterialNo}}" >{{ MaterialNo}}</td>',
                '<td style="min-width: 50px" data-title="MaterialName" data-value="{{MaterialName}}" >{{MaterialName}}</td>',
                '<td style="min-width: 80px" data-title="FQTYBase" data-value="{{FQTYBase}}" >{{ FQTYBase}}</td>',
                '<td style="min-width: 50px" data-title="FQTYPlan" data-value="{{FQTYPlan}}" >{{FQTYPlan}}</td>',
                '<td style="min-width: 50px" data-title="FQTYOnSite" data-value="{{FQTYOnSite}}" >{{ FQTYOnSite}}</td>',
                '<td style="min-width: 50px" data-title="FQTYMargin" data-value="{{FQTYMargin}}" >{{ FQTYMargin}}</td>',
                '<td style="min-width: 50px" data-title="FQTYPL" data-value="{{FQTYPL}}" >{{ FQTYPL}}</td>',
                //'<td style="min-width: 50px" data-title="MaterialSubModeText" data-value="{{MaterialSubModeText}}" >{{ MaterialSubModeText}}</td>',
                '</tr>'
            ].join(""),

            SupplementList: [
                '<tr data-color="">',
                '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></td>',
                  '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
                '<td style="min-width: 50px" data-title="showID" data-value="{{showID}}" >{{showID}}</td>',
                //'<td style="min-width: 50px" data-title="WorkShopName" data-value="{{WorkShopName}}" >{{ WorkShopName}}</td>',
                '<td style="min-width: 50px" data-title="LineName" data-value="{{LineName}}" >{{ LineName}}</td>',
                '<td style="min-width: 50px" data-title="PartName" data-value="{{PartName}}" >{{PartName}}</td>',
                '<td style="min-width: 50px" data-title="PartPointName" data-value="{{PartPointName}}" >{{PartPointName}}</td>',
                '<td style="min-width: 50px" data-title="OrderNo" data-value="{{OrderNo}}" >{{ OrderNo}}</td>',
                '<td style="min-width: 80px" data-title="ProductNo" data-value="{{ProductNo}}" >{{ ProductNo}}</td>',
                '<td style="min-width: 50px" data-title="MaterialNo" data-value="{{MaterialNo}}" >{{ MaterialNo}}</td>',
                '<td style="min-width: 50px" data-title="MaterialName" data-value="{{MaterialName}}" >{{MaterialName}}</td>',
                //'<td style="min-width: 50px" data-title="DeviceNo" data-value="{{DeviceNo}}" >{{ DeviceNo}}</td>',

                '<td style="min-width: 80px" data-title="FQTYDemand" data-value="{{FQTYDemand}}" >{{ FQTYDemand}}</td>',
                //'<td style="min-width: 50px" data-title="ModeType" data-value="{{ModeType}}" >{{ ModeType}}</td>',
                '</tr>'
            ].join(""),

            SurportList: [
                '<tr data-color="">',
                '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></td>',
                  '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
                '<td style="min-width: 50px" data-title="showID" data-value="{{showID}}">{{showID}}</td>',
                '<td style="min-width: 80px" data-title="Type" data-value="{{Type}}" >{{ Type}}</td>',
                '<td style="min-width: 50px" data-title="WorkShopName" data-value="{{WorkShopName}}" >{{ WorkShopName}}</td>',
                '<td style="min-width: 50px" data-title="LineName" data-value="{{LineName}}" >{{ LineName}}</td>',
                '<td style="min-width: 50px" data-title="PartName" data-value="{{PartName}}" >{{PartName}}</td>',
                '<td style="min-width: 80px" data-title="ProductNo" data-value="{{ProductNo}}" >{{ ProductNo}}</td>',
                '<td style="min-width: 50px" data-title="OrderNo" data-value="{{OrderNo}}" >{{ OrderNo}}</td>',
                '<td style="min-width: 50px" data-title="MaterialNo" data-value="{{MaterialNo}}" >{{ MaterialNo}}</td>',
                '<td style="min-width: 50px" data-title="MaterialName" data-value="{{MaterialName}}" >{{MaterialName}}</td>',
                '<td style="min-width: 80px" data-title="FQTYPlan" data-value="{{FQTYPlan}}" >{{ FQTYPlan}}</td>',
                '<td style="min-width: 50px" data-title="FQTYBase" data-value="{{FQTYBase}}" >{{ FQTYBase}}</td>',
                '<td style="min-width: 50px" data-title="FQTYOnSite" data-value="{{FQTYOnSite}}" >{{ FQTYOnSite}}</td>',
                '<td style="min-width: 50px" data-title="FQTYMargin" data-value="{{FQTYMargin}}" >{{ FQTYMargin}}</td>',
                '</tr>'
            ].join(""),

            ProduceList: [
                '<tr data-color="">',
                '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></td>',
                '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
                '<td style="min-width: 50px" data-title="showID" data-value="{{showID}}" >{{showID}}</td>',
                '<td style="min-width: 80px" data-title="StockName" data-value="{{StockName}}" >{{ StockName}}</td>',
                //'<td style="min-width: 50px" data-title="LocationName" data-value="{{LocationName}}" >{{ LocationName}}</td>',
                //'<td style="min-width: 50px" data-title="LocationText" data-value="{{LocationText}}" >{{ LocationText}}</td>',
                '<td style="min-width: 50px" data-title="MaterialNo" data-value="{{MaterialNo}}" >{{MaterialNo}}</td>',
                '<td style="min-width: 80px" data-title="MaterialName" data-value="{{MaterialName}}" >{{ MaterialName}}</td>',
                '<td style="min-width: 50px" data-title="FQTYKC" data-value="{{FQTYKC}}" >{{ FQTYKC}}</td>',
                '<td style="min-width: 50px" data-title="FQTYPL" data-value="{{FQTYPL}}" >{{ FQTYPL}}</td>',
                //'<td style="min-width: 50px" data-title="StockTime" data-value="{{StockTime}}" >{{StockTime}}</td>',
                //'<td style="min-width: 80px" data-title="StockStatusText" data-value="{{StockStatusText}}" >{{ StockStatusText}}</td>',
                '<td style="min-width: 50px" data-title="BatchNo" data-value="{{BatchNo}}" >{{ BatchNo}}</td>',
                //'<td style="min-width: 50px" data-title="RemarkText" data-value="{{RemarkText}}" >{{ RemarkText}}</td>',
                '</tr>'
            ].join(""),

        };

        MaterialName = {
            //主料
            main: 1,
            //辅料
            surport: 2
        };

        surportMaterialList = [];
        mainPlanList = [];
        surportPlanList = [];
        Materia = [];
        Stock = [];
        deflautList = [];
        Csupplement = [];
        deflautSurportList = [];
        temp = true;
        //查询计划
        DEFAULT_VALUE_MESCheck = {
            Date: new Date(),
            WorkShopID: 0,
            LineID: 0,
            Mode: 0,
        };
        (function () {

            KETWROD_LIST_MESCheck = [
                "Date|日期|Date",
                "LineID|产线|ArrayOne",
                //"Mode|生产方式|ArrayOne",
            ];

            KETWROD_Template_MESCheck = {};

            Formattrt_MESCheck = {};

            TypeSource_MESCheck = {

                LineID: [

                ],

                Mode: [
                    {
                        name: "仓库数量优先",
                        value: 1
                    },
                    {
                        name: "批次优先",
                        value: 2
                    }
                ],
            };

            $.each(KETWROD_LIST_MESCheck, function (i, item) {
                var detail = item.split("|");
                KETWROD_Template_MESCheck[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_MESCheck[detail[0]] = $com.util.getFormatter(TypeSource_MESCheck, detail[0], detail[2]);
                }
            });
        })();
        //物料优先级
        DEFAULT_VALUE_Hand = {
            Mode: 0,
        };
        (function () {

            KETWROD_LIST_Hand = [
                "Mode|生产方式|ArrayOne",
            ];

            KETWROD_Template_Hand = {};

            Formattrt_Hand = {};

            TypeSource_Hand = {
                Mode: [
                    {
                        name: "仓库数量优先",
                        value: 1
                    },
                    {
                        name: "批次优先",
                        value: 2
                    }
                ],
            };

            $.each(KETWROD_LIST_Hand, function (i, item) {
                var detail = item.split("|");
                KETWROD_Template_Hand[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_Hand[detail[0]] = $com.util.getFormatter(TypeSource_Hand, detail[0], detail[2]);
                }
            });
        })();
        //物料数量
        DEFAULT_VALUE_Number = {
            FQTYPlan: 0,
        };
        (function () {

            KETWROD_LIST_Number = [
                "FQTYPlan|实际配料数",
            ];

            KETWROD_Template_Number = {};

            Formattrt_Number = {};

            TypeSource_Number = {

            };

            $.each(KETWROD_LIST_Number, function (i, item) {
                var detail = item.split("|");
                KETWROD_Template_Number[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_Number[detail[0]] = $com.util.getFormatter(TypeSource_Number, detail[0], detail[2]);
                }
            });
        })();
        model = $com.Model.create({
            name: '生产配料',

            type: $com.Model.MAIN,

            configure: function () {
                this.run();
            },

            events: function () {
                //生成配料计划
                $("body").delegate("#lmvt-produce-plan", "click", function () {

                    $("body").append($com.modal.show(DEFAULT_VALUE_MESCheck, KETWROD_Template_MESCheck, "生成", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        Time = $com.util.format('yyyy-MM-dd hh:mm:ss', rst.Date);
                        //var stime = $com.util.format('yyyy-MM-dd', date),
                        //    etime = new Date(stime).getTime() + 24 * 60 * 60 - 1 - 8 * 60 * 60;

                        //StartDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(stime).getTime() - 8 * 60 * 60 * 1000);

                        //EndDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(StartDate).getTime() - 1000 + 24 * 60 * 60 * 1000);

                        lID = Number(rst.LineID);
                        mID = Number(rst.Mode);

                        model.com.getShfitCur({ ShiftLevel: 5, ZoneID: 0, Time: Time }, function (res) {
                            ShiftID = res.info;
                            flag = 1;
                            model.com.refresh();
                        });

                    }, TypeSource_MESCheck));
                });
                //生成补料计划
                $("body").delegate("#lmvt-supplement-search", "click", function () {

                    $("body").append($com.modal.show(DEFAULT_VALUE_MESCheck, KETWROD_Template_MESCheck, "生成", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        Time = $com.util.format('yyyy-MM-dd hh:mm:ss', rst.Date);
                        //var stime = $com.util.format('yyyy-MM-dd', date),
                        //    etime = new Date(stime).getTime() + 24 * 60 * 60 - 1 - 8 * 60 * 60;

                        //StartDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(stime).getTime() - 8 * 60 * 60 * 1000);

                        //EndDate = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(StartDate).getTime() - 1000 + 24 * 60 * 60 * 1000);

                        lID = Number(rst.LineID);
                        mID = Number(rst.Mode);

                        model.com.getShfitCur({ ShiftLevel: 5, ZoneID: 0, Time: Time }, function (res) {
                            ShiftID = res.info;
                            flag = 1;

                            //补料列表
                            model.com.getAPSTask({ LineID: lID, ShiftID: ShiftID }, function (res) {
                                if (!res)
                                    return;
                                var list = res.list,
                                    rst = [];
                                if (list) {

                                    Supplement_source = res.list;

                                    Data_Supplement = res.list;
                                    Data_Supplement = $com.util.Clone(Data_Supplement);


                                    $.each(Data_Supplement, function (i, item) {
                                        item.PartPointName = model.com.GetPartPointSource(item.PartPointID);
                                        //item.Feed = 2;
                                        item.showID = i + 1;
                                        item.FQTYDemand = 0;
                                    });
                                }
                                $(".lmvt-supplement-body").html($com.util.template(Data_Supplement, HTML.SupplementList));
                                $(".lmvt-supplement-body tr").each(function (i, item) {
                                    var $this = $(this);
                                    var colorName = $this.css("background-color");
                                    $this.attr("data-color", colorName);



                                });
                            })
                        });

                    }, TypeSource_MESCheck));
                });
                //查询 
                $("body").delegate("#lmvt-produce-check", "click", function () {

                    $("body").append($com.modal.show(DEFAULT_VALUE_MESCheck, KETWROD_Template_MESCheck, "查询", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;
                        Time = $com.util.format('yyyy-MM-dd hh:mm:ss', rst.Date);

                        lID = Number(rst.LineID);
                        mID = Number(rst.Mode);

                        flag = 2;

                        model.com.getShfitCur({ ShiftLevel: 5, ZoneID: 0, Time: Time }, function (res) {
                            ShiftID = res.info;
                            flag = 2;
                            model.com.refresh();
                        });

                    }, TypeSource_MESCheck));
                });
                //双击主材表
                $("body").delegate(".lmvt-main-body tr", "dblclick", function () {
                    var $this = $(this),
                        id = $this.find("td[data-title=showID]").attr("data-value"),
                        TastID,
                        materialNo;
                    //查询时双击配料ID
                    LocationID = Number(id);
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
                        $.each(deflautList, function (i, item) {
                            item.showID = i + 1;
                        });
                        //$(".lmvt-produce-body").html($com.util.template(deflautList, HTML.ProduceList));
                        model.com.Render(deflautList);

                    }
                    else {

                        model.com.getMaterialTaskProductLocationAll({ TaskMaterialID: Product_source[LocationID - 1].ID }, function (res) {
                            if (!res)
                                return;
                            var list = res.list,
                                rst = [];
                            if (list) {
                                LocationList = res.list;
                                $.each(LocationList, function (i, item) {
                                    item.showID = i + 1;
                                });
                                //$(".lmvt-produce-body").html($com.util.template(LocationList, HTML.ProduceList));
                                model.com.Render(res.list);
                            }
                        });
                        //$.each(mainMaterialList, function (i, item) {
                        //if (item.showID == id) {
                        //deflautList = item.LocationPlanList;
                        //TastID = item.TaskPartID;
                        //materialNo = item.MaterialNo
                        // }
                        // });

                        //$.each(deflautList, function (i, item) {
                        // item.ID = i + 1;
                        //});
                        //MaterialNo
                        //model.com.Render(deflautList);
                    }

                });
                ////双击辅材表
                //$("body").delegate(".lmvt-surport-body tr", "dblclick", function () {
                //    var $this = $(this),
                //        id = $this.find("td[data-title=showID]").attr("data-value");

                //    if (flag == 1) {
                //        $.each(surportPlanList, function (i, item) {
                //            if (item.showID == id) {
                //                deflautSurportList = item.LocationPlanList;
                //            }
                //        });
                //        $.each(deflautSurportList, function (i, item) {
                //            item.ID = i + 1;
                //        });
                //        model.com.Render(deflautSurportList);
                //    }
                //    else {
                //        $.each(surportMaterialList, function (i, item) {
                //            if (item.showID == id) {
                //                deflautList = item.LocationPlanList;
                //                TastID = item.TaskPartID;
                //                materialNo = item.MaterialNo
                //            }
                //        });

                //        $.each(deflautList, function (i, item) {
                //            item.ID = i + 1;
                //        });

                //        model.com.Render(deflautList);
                //    }

                //});
                //双击对应补料表
                $("body").delegate(".lmvt-supplement-main-body tr", "dblclick", function () {
                    var $this = $(this),
                        id = $this.find("td[data-title=showID]").attr("data-value");
                    PointID = Number(id);

                    if (flag == 1) {
                       
                        $.each(Materia[0], function (i, item) {
                            if (item.showID == id) {
                                deflautList = item.LocationPlanList;
                                TastID = item.TaskPartID;
                                materialNo = item.MaterialNo
                            }
                        });

                        $.each(deflautList, function (i, item) {
                            item.ID = i + 1;
                        });
                        $.each(deflautList, function (i, item) {
                            item.showID = i + 1;
                        });
                        //$(".lmvt-produce-body").html($com.util.template(deflautList, HTML.ProduceList));
                        $(".lmvt-supplement-produce-body").html($com.util.template(deflautList, HTML.ProduceList));
                        $.each(deflautList, function (j, item_j) {
                            var $tr = $(".lmvt-supplement-produce-body tr"),
                                id = [];
                            if (item_j.FQTYPL != 0) {
                                $.each($tr, function (i, item_i) {
                                    if ($(item_i).find("td[data-title=showID]").attr("data-value") == item_j.ID)
                                        $(item_i).find("input[type=checkbox].femi-tb-checkbox").prop("checked", true);
                                });

                            }

                        });
                       
                    }
                    else {
                        model.com.getMaterialTaskProductLocationAll({ TaskMaterialID: Product_source[PointID - 1].ID }, function (res) {
                            if (!res)
                                return;
                            var list = res.list,
                                rst = [];
                            if (list) {
                                LocationList = res.list;
                                $.each(LocationList, function (i, item) {
                                    item.showID = i + 1;
                                });
                                $(".lmvt-supplement-produce-body").html($com.util.template(LocationList, HTML.ProduceList));
                                $.each(LocationList, function (j, item_j) {
                                    var $tr = $(".lmvt-supplement-produce-body tr"),
                                        id = [];
                                    if (item_j.FQTYPL != 0) {
                                        $.each($tr, function (i, item_i) {
                                            if ($(item_i).find("td[data-title=showID]").attr("data-value") == item_j.showID)
                                                $(item_i).find("input[type=checkbox].femi-tb-checkbox").prop("checked", true);
                                        });

                                    }

                                });
                                //model.com.Render(res.list);
                            }
                        });
                    }
                });
                //设置主料配料数
                $("body").delegate(".lmvt-main-body tr td[data-title='FQTYPlan']", "dblclick", function () {
                    var $this = $(this),
                        id = $this.parent("tr").find("td[data-title=showID]").attr("data-value"),
                        count = Number($this.parent("tr").find("td[data-title=FQTYPlan]").attr("data-value"));
                    DEFAULT_VALUE_Number = {
                        FQTYPlan: count
                    };
                    if(Number($this.parent("tr").find("td[data-title=FQTYPL]").attr("data-value"))>0){
                        alert($this.parent("tr").find("td[data-title=MaterialName]").attr("data-value") + "已配过料，无法操作！");
                        return ;
                    }
                    $("body").append($com.modal.show(DEFAULT_VALUE_Number, KETWROD_Template_Number, "配料数", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;

                        var planNo = Number(rst.FQTYPlan);

                        if (flag == 1) {
                            Plan_source[id - 1].FQTYPlan = planNo;
                            $(".lmvt-main-body").html($com.util.template(Plan_source, HTML.MainList));
                            $(".lmvt-main-body tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);



                            });
                        }

                        else {
                            Product_source[id - 1].FQTYPlan = planNo;
                            $(".lmvt-main-body").html($com.util.template(Product_source, HTML.MainList));
                            $(".lmvt-main-body tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);



                            });
                        }

                    }, TypeSource_Number));

                });

                //设置计划数
                $("body").delegate(".lmvt-supplement-body tr td[data-title='FQTYPlan']", "dblclick", function () {
                    var $this = $(this),
                        id = $this.find("td[data-title=showID]").attr("data-value"),
                        count = Number($this.find("td[data-title=FQTYPlan]").attr("data-value"));
                    DEFAULT_VALUE_Number = {
                        FQTYPlan: count
                    };
                    PointID = id;

                    if (flag == 1)
                        $.each(Materia[0], function (i, item) {
                            if (item.showID == id) {
                                Csupplement = item.LocationPlanList;
                            }
                        });
                    else {

                    }
                    $.each(Csupplement, function (i, item) {
                        item.ID = i + 1;
                    });

                    $(".lmvt-supplement-produce-body").html($com.util.template(Csupplement, HTML.ProduceList));

                    $.each(Csupplement, function (j, item_j) {
                        var $tr = $(".lmvt-supplement-produce-body tr"),
                            id = [];
                        if (item_j.FQTYPL != 0) {
                            $.each($tr, function (i, item_i) {
                                if ($(item_i).find("td[data-title=showID]").attr("data-value") == item_j.showID)
                                    $(item_i).find("input[type=checkbox].femi-tb-checkbox").prop("checked", true);
                            });

                        }

                    });
                });
                //配料手动调整
                $("body").delegate("#lmvt-produce-change", "click", function () {

                    if (flag == 1) {
                        var SelectData1 = $com.table.getSelectionData($(".lmvt-main-body"), "showID", Plan_source);
                        
                        if (!SelectData1 || !SelectData1.length) {
                            alert("至少选择一行数据再试！")
                            return;
                        }
                        var cate = false;
                        $.each(SelectData1, function (i, item) {
                            if (item.FQTYPL > 0) {
                                alert(item.MaterialName + "已配过料，无法操作！");
                                cate = true;
                                return true;
                            }
                        });

                        if (cate) {
                            cate = false;
                            return;
                        }
                        //$("body").append($com.modal.show(DEFAULT_VALUE_Hand, KETWROD_Template_Hand, "物料优先级选择", function (rst) {

                        //    if (!rst || $.isEmptyObject(rst))
                        //        return;
                        //    mID = Number(rst.Mode);
                        //    SelectData1 = model.com.ComputerCount(1, SelectData1);
                        //    $.each(Plan_source, function (i, item) {
                        //        $.each(SelectData1, function (i, item_i) {
                        //            if (item.showID == item_i.showID) {
                        //                item = item_i;
                        //            }
                        //        });
                        //    });
                        //    model.com.Render(SelectData1[0].LocationPlanList);
                        //    //$(".lmvt-produce-body").html($com.util.template(SelectData1[0].LocationPlanList, HTML.ProduceList));
                        //    //model.com.Render(soleDate[0].LocationPlanList);

                        //}, TypeSource_Hand));

                        mID = Number(1);
                        SelectData1 = model.com.ComputerCount(1, SelectData1);
                        $.each(Plan_source, function (i, item) {
                            $.each(SelectData1, function (i, item_i) {
                                if (item.showID == item_i.showID) {
                                    item = item_i;
                                }
                            });
                        });
                        model.com.Render(SelectData1[0].LocationPlanList);

                    }
                    else {
                        var SelectData2 = $com.table.getSelectionData($(".lmvt-main-body"), "showID", Product_source);

                        if (!SelectData2 || !SelectData2.length) {
                            alert("至少选择一行数据再试！")
                            return;
                        }
                        var cate = false;
                        $.each(SelectData2, function (i, item) {
                            if (item.FQTYPL > 0) {
                                alert(item.MaterialName + "已配过料，无法操作！");
                                cate = true;
                                return true;
                            }
                        });

                        if (cate) {
                            cate = false;
                            return;
                        }
                        //$("body").append($com.modal.show(DEFAULT_VALUE_Hand, KETWROD_Template_Hand, "物料优先级选择", function (rst) {

                        //    if (!rst || $.isEmptyObject(rst))
                        //        return;
                        //    mID = Number(rst.Mode);
                        //    SelectData2[0].LocationPlanList = LocationList;
                        //    SelectData2 = model.com.ComputerCount(1, SelectData2);
                        //    $.each(Product_source, function (i, item) {
                        //        $.each(SelectData2, function (i, item_i) {
                        //            if (item.showID == item_i.showID) {
                        //                item = item_i;
                        //            }
                        //        });
                        //    });
                        //    //$(".lmvt-produce-body").html($com.util.template(soleDate[0].LocationPlanList, HTML.ProduceList));
                        //    model.com.Render(SelectData2[0].LocationPlanList);
                        //    //$(".lmvt-produce-body").html($com.util.template(SelectData2.LocationPlanList, HTML.ProduceList));
                        //}, TypeSource_Hand));
                        mID = Number(1);
                        SelectData2[0].LocationPlanList = LocationList;
                        SelectData2 = model.com.ComputerCount(1, SelectData2);
                        $.each(Product_source, function (i, item) {
                            $.each(SelectData2, function (i, item_i) {
                                if (item.showID == item_i.showID) {
                                    item = item_i;
                                }
                            });
                        });
                        //$(".lmvt-produce-body").html($com.util.template(soleDate[0].LocationPlanList, HTML.ProduceList));
                        model.com.Render(SelectData2[0].LocationPlanList);
                    }

                });
                //设置配料数
                $("body").delegate(".lmvt-supplement-body tr td[data-title='FQTYDemand']", "dblclick", function () {
                    var $this = $(this),
                        id = Number($this.parent("tr").find("td[data-title=showID]").attr("data-value")),
                        count = Number($this.parent("tr").find("td[data-title=FQTYDemand]").attr("data-value"));
                    DEFAULT_VALUE_Number = {
                        FQTYPlan: count
                    };

                    $("body").append($com.modal.show(DEFAULT_VALUE_Number, KETWROD_Template_Number, "补料数", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;

                        var planNo = Number(rst.FQTYPlan);

                        Data_Supplement[id - 1].FQTYDemand = planNo;

                        $(".lmvt-supplement-body").html($com.util.template(Data_Supplement, HTML.SupplementList));
                        $(".lmvt-supplement-body tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });
                    }, TypeSource_Number));


                });

                //设置仓库仓位配料数
                $("body").delegate(".lmvt-produce-body tr td[data-title='FQTYPL']", "dblclick", function () {
                    var $this = $(this),
                        id = Number($this.parent("tr").find("td[data-title=showID]").attr("data-value")),
                        count = Number($this.parent("tr").find("td[data-title=FQTYPL]").attr("data-value"));
                    DEFAULT_VALUE_Number = {
                        FQTYPlan: count
                    };
                    $("body").append($com.modal.show(DEFAULT_VALUE_Number, KETWROD_Template_Number, "配料数", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;

                        var planNo = Number(rst.FQTYPlan);

                        if (flag == 1) {

                            deflautList[id - 1].FQTYPL = planNo;
                            //model.com.Render(deflautList);
                            $(".lmvt-produce-body").html($com.util.template(deflautList, HTML.ProduceList));
                        }
                        else {
                            LocationList[id - 1].FQTYPL = planNo;
                            //model.com.Render(LocationList);
                            $(".lmvt-produce-body").html($com.util.template(LocationList, HTML.ProduceList));
                        }

                        //$(".lmvt-produce-body").html($com.util.template(deflautList, HTML.ProduceList));
                        //model.com.Render(deflautList);
                    }, TypeSource_Number));

                });

                //设置补料数
                $("body").delegate(".lmvt-supplement-main-body tr td[data-title='FQTYPlan']", "dblclick", function () {
                    var $this = $(this),
                        id = Number($this.parent("tr").find("td[data-title=showID]").attr("data-value")),
                        count = Number($this.parent("tr").find("td[data-title=FQTYPlan]").attr("data-value"));
                    DEFAULT_VALUE_Number = {
                        FQTYPlan: count
                    };
                    $("body").append($com.modal.show(DEFAULT_VALUE_Number, KETWROD_Template_Number, "配料数", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;

                        var planNo = Number(rst.FQTYPlan);

                        if (flag == 1) {
                            Materia[0][id - 1].FQTYPlan = planNo;
                            $(".lmvt-supplement-main-body").html($com.util.template(Materia[0], HTML.MainList));
                            $(".lmvt-supplement-main-body tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);



                            });
                        }
                        else {
                            Product_source[id - 1].FQTYPlan = planNo;
                            $(".lmvt-supplement-main-body").html($com.util.template(Product_source, HTML.MainList));
                            $(".lmvt-supplement-main-body tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);



                            });
                        }

                    }, TypeSource_Number));
                });
                //设置仓库仓位补料数
                $("body").delegate(".lmvt-supplement-produce-body tr td[data-title='FQTYPL']", "dblclick", function () {
                    var $this = $(this),
                        id = Number($this.parent("tr").find("td[data-title=ID]").attr("data-value")),
                        count = Number($this.parent("tr").find("td[data-title=FQTYPL]").attr("data-value"));
                    DEFAULT_VALUE_Number = {
                        FQTYPlan: count
                    };
                    $("body").append($com.modal.show(DEFAULT_VALUE_Number, KETWROD_Template_Number, "配料数", function (rst) {
                        //调用修改函数
                        if (!rst || $.isEmptyObject(rst))
                            return;

                        var planNo = Number(rst.FQTYPlan);
                        $.each(Csupplement, function (i, item) {
                            if (item.ID == id)
                                item.FQTYPL = planNo;
                        });

                        $(".lmvt-supplement-produce-body").html($com.util.template(Csupplement, HTML.ProduceList));

                    }, TypeSource_Number));

                });
                //补料计划
                $("body").delegate("#lmvt-supplement-plan", "click", function () {

                    var SelectData = $com.table.getSelectionData($(".lmvt-supplement-body"), "showID", Data_Supplement);

                    DataSee = SelectData;

                    if (!SelectData || !SelectData.length) {
                        alert("至少选择一行数据再试！")
                        return;
                    }

                    $(".lmvt-container-supplement-first").hide();
                    $(".lmvt-container-supplement-plan").show();

                    Materia = [];

                    model.com.getSupplement({ WorkShopID: wID, LineID: lID, Mode: mID, shift_id: ShiftID, data: SelectData }, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];
                        if (list) {
                            Materia.push(res.list);

                            Materia = $com.util.Clone(Materia);

                            SChooice = res.list;

                            $.each(Materia[0], function (i, item) {
                                item.TypeText = "补料";
                                item.showID = i + 1;
                            });
                        }
                        flag = 1;
                        $(".lmvt-supplement-main-body").html($com.util.template(Materia[0], HTML.MainList));
                        $(".lmvt-supplement-main-body tr").each(function (i, item) {
                            var $this = $(this);
                            var colorName = $this.css("background-color");
                            $this.attr("data-color", colorName);



                        });
                    });
                });
                //手动调整
                $("body").delegate("#lmvt-supplement-hand", "click", function () {

                    if (flag == 1) {


                        var SelectData = $com.table.getSelectionData($(".lmvt-supplement-main-body"), "showID", Materia[0]);

                        if (!SelectData || !SelectData.length) {
                            alert("至少选择一行数据再试！")
                            return;
                        }
                        var cate = false;
                        $.each(SelectData, function (i, item) {
                            if (item.FQTYPL > 0) {
                                alert(item.MaterialName + "已配过料，无法删除！" + "");
                                cate = true;
                                return true;
                            }
                        });

                        if (cate) {
                            cate = false;
                            return;
                        }
                        //$("body").append($com.modal.show(DEFAULT_VALUE_Hand, KETWROD_Template_Hand, "物料优先级选择", function (rst) {

                        //    if (!rst || $.isEmptyObject(rst))
                        //        return;
                        //    mID = Number(rst.Mode);
                        //    model.com.getSupplement({ WorkShopID: wID, LineID: lID, Mode: mID, shift_id: ShiftID, data: DataSee }, function (res) {
                        //        if (!res)
                        //            return;
                        //        var list = res.list,
                        //            rst = [];
                        //        if (list) {

                        //            var soleDate = res.list;

                        //            soleDate = $com.util.Clone(soleDate);

                        //            SChooice = res.list;

                        //            $.each(soleDate, function (i, item_i) {
                        //                item_i.showID = i + 1;
                        //                $.each(Materia[0], function (j, item_j) {
                        //                    if (item_i.showID == item_j.showID)
                        //                        item_j.LocationPlanList = item_i.LocationPlanList;
                        //                });
                        //            });
                        //        }

                        //        $.each(Materia[0], function (i, item) {
                        //            if (item.showID == PointID) {
                        //                Csupplement = item.LocationPlanList;
                        //            }
                        //        });

                        //        $.each(Materia[0], function (i, item_i) {
                        //            $.each(SelectData, function (j, item_j) {
                        //                if (item_i.showID == item_j.showID) {
                        //                    item_j.LocationPlanList = item_i.LocationPlanList;
                        //                }
                        //            });
                        //        });

                        //        $.each(Csupplement, function (i, item) {
                        //            item.ID = i + 1;
                        //        });

                        //        var _data = model.com.ComputerCount(mID, SelectData);

                        //        SubmitData = SelectData

                        //        $(".lmvt-supplement-produce-body").html($com.util.template(Csupplement, HTML.ProduceList));

                        //        $.each(Csupplement, function (j, item_j) {
                        //            var $tr = $(".lmvt-supplement-produce-body tr");
                        //            if (item_j.FQTYPL != 0) {
                        //                $.each($tr, function (i, item_i) {
                        //                    if ($(item_i).find("td[data-title=ID]").attr("data-value") == item_j.ID)
                        //                        $(item_i).find("input[type=checkbox].femi-tb-checkbox").prop("checked", true);
                        //                });

                        //            }

                        //        });

                        //    });

                        //}, TypeSource_Hand));

                        mID = Number(1);
                        model.com.getSupplement({ WorkShopID: wID, LineID: lID, Mode: mID, shift_id: ShiftID, data: DataSee }, function (res) {
                            if (!res)
                                return;
                            var list = res.list,
                                rst = [];
                            if (list) {

                                var soleDate = res.list;

                                soleDate = $com.util.Clone(soleDate);

                                SChooice = res.list;

                                $.each(soleDate, function (i, item_i) {
                                    item_i.showID = i + 1;
                                    $.each(Materia[0], function (j, item_j) {
                                        if (item_i.showID == item_j.showID)
                                            item_j.LocationPlanList = item_i.LocationPlanList;
                                    });
                                });
                            }

                            $.each(Materia[0], function (i, item) {
                                if (item.showID == PointID) {
                                    Csupplement = item.LocationPlanList;
                                }
                            });

                            $.each(Materia[0], function (i, item_i) {
                                $.each(SelectData, function (j, item_j) {
                                    if (item_i.showID == item_j.showID) {
                                        item_j.LocationPlanList = item_i.LocationPlanList;
                                    }
                                });
                            });

                            $.each(Csupplement, function (i, item) {
                                item.ID = i + 1;
                            });

                            var _data = model.com.ComputerCount(mID, SelectData);

                            SubmitData = SelectData

                            $(".lmvt-supplement-produce-body").html($com.util.template(Csupplement, HTML.ProduceList));

                            $.each(Csupplement, function (j, item_j) {
                                var $tr = $(".lmvt-supplement-produce-body tr");
                                if (item_j.FQTYPL != 0) {
                                    $.each($tr, function (i, item_i) {
                                        if ($(item_i).find("td[data-title=ID]").attr("data-value") == item_j.ID)
                                            $(item_i).find("input[type=checkbox].femi-tb-checkbox").prop("checked", true);
                                    });

                                }

                            });

                        });
                    }
                    else {
                        var SelectData2 = $com.table.getSelectionData($(".lmvt-supplement-main-body"), "showID", Product_source);

                        if (!SelectData2 || !SelectData2.length) {
                            alert("至少选择一行数据再试！")
                            return;
                        }
                        var cate = false;
                        $.each(SelectData2, function (i, item) {
                            if (item.FQTYPL > 0) {
                                alert(item.MaterialName + "已配过料，无法删除！" + "");
                                cate = true;
                                return true;
                            }
                        });

                        if (cate) {
                            cate = false;
                            return;
                        }
                        //$("body").append($com.modal.show(DEFAULT_VALUE_Hand, KETWROD_Template_Hand, "物料优先级选择", function (rst) {

                        //    if (!rst || $.isEmptyObject(rst))
                        //        return;
                        //    mID = Number(rst.Mode);

                        //    SelectData2[0].LocationPlanList = LocationList;
                        //    SelectData2 = model.com.ComputerCount(1, SelectData2);
                        //    $.each(Product_source, function (i, item) {
                        //        $.each(SelectData2, function (i, item_i) {
                        //            if (item.showID == item_i.showID) {
                        //                item = item_i;
                        //            }
                        //        });
                        //    });
                        //    $(".lmvt-supplement-produce-body").html($com.util.template(SelectData2[0].LocationPlanList, HTML.ProduceList));

                        //    $.each(LocationList, function (j, item_j) {
                        //        var $tr = $(".lmvt-supplement-produce-body tr");
                        //        if (item_j.FQTYPL != 0) {
                        //            $.each($tr, function (i, item_i) {
                        //                if ($(item_i).find("td[data-title=ID]").attr("data-value") == item_j.ID)
                        //                    $(item_i).find("input[type=checkbox].femi-tb-checkbox").prop("checked", true);
                        //            });

                        //        }

                        //    });

                        //    //$(".lmvt-produce-body").html($com.util.template(soleDate[0].LocationPlanList, HTML.ProduceList));
                        //    //model.com.Render(SelectData2[0].LocationPlanList);


                        //}, TypeSource_Hand));

                        mID = Number(1);

                        SelectData2[0].LocationPlanList = LocationList;
                        SelectData2 = model.com.ComputerCount(1, SelectData2);
                        $.each(Product_source, function (i, item) {
                            $.each(SelectData2, function (i, item_i) {
                                if (item.showID == item_i.showID) {
                                    item = item_i;
                                }
                            });
                        });
                        $(".lmvt-supplement-produce-body").html($com.util.template(SelectData2[0].LocationPlanList, HTML.ProduceList));

                        $.each(LocationList, function (j, item_j) {
                            var $tr = $(".lmvt-supplement-produce-body tr");
                            if (item_j.FQTYPL != 0) {
                                $.each($tr, function (i, item_i) {
                                    if ($(item_i).find("td[data-title=ID]").attr("data-value") == item_j.ID)
                                        $(item_i).find("input[type=checkbox].femi-tb-checkbox").prop("checked", true);
                                });

                            }

                        });
                    }
                });
                //提交
                $("body").delegate("#lmvt-produce-submit", "click", function () {

                    if (flag == 1) {
                        var SelectData = $com.table.getSelectionData($(".lmvt-supplement-main-body"), "showID", Materia[0]);

                        if (!SelectData || !SelectData.length) {
                            alert("至少选择一行数据再试！")
                            return;
                        }

                        $.each(SelectData, function (i, item) {
                            delete item.FQTY_OrderMargin;
                            delete item.TypeText;
                            item.MaterialModeText = "";
                            item.MaterialSubModeText = "";
                            item.OrderID = "";
                            item.PartPointName = "";
                            item.Type = 2;
                        });

                        $.each(SelectData, function (i, item) {
                            model.com.postSubmit({
                                Mode: 1,
                                data: item
                            }, function (res) {

                                alert("提交成功");
                                if (!res)
                                    return;
                                if (res.info) {
                                    var $tr = $(".lmvt-supplement-produce-body tr"),
                                        locationArry = [];
                                    $.each($tr, function (i, item_i) {
                                        if ($(item_i).find("input[type=checkbox].femi-tb-checkbox")[0].checked) {
                                            var checkID = Number($(item_i).find("td[data-title=ID]").attr("data-value"));
                                            $.each(res.info.LocationPlanList, function (i, item) {
                                                if (item.ID == checkID) {
                                                    item.TaskMaterialID = res.info.ID;
                                                    item.TaskLineID = res.info.TaskLineID;
                                                    locationArry.push(item);
                                                }
                                            });
                                        }

                                    });
                                    model.com.postAddLocation({
                                        data: locationArry
                                    }, function (res) {
                                        model.com.refresh();
                                    });
                                }
                            });
                        });
                    }
                    else {
                        var SelectData = $com.table.getSelectionData($(".lmvt-supplement-main-body"), "showID", Product_source);

                        if (!SelectData || !SelectData.length) {
                            alert("至少选择一行数据再试！")
                            return;
                        }

                        $.each(SelectData, function (i, item) {
                            delete item.FQTY_OrderMargin;
                            delete item.TypeText;
                            item.MaterialModeText = "";
                            item.MaterialSubModeText = "";
                            item.OrderID = "";
                            item.PartPointName = "";
                            item.Type = 2;
                        });

                        $.each(SelectData, function (i, item) {
                            model.com.postSubmit({
                                Mode: 1,
                                data: item
                            }, function (res) {

                                alert("提交成功");
                                if (!res)
                                    return;
                                if (res.info) {
                                    var $tr = $(".lmvt-supplement-produce-body tr"),
                                        locationArry = [];
                                    $.each($tr, function (i, item_i) {
                                        if ($(item_i).find("input[type=checkbox].femi-tb-checkbox")[0].checked) {
                                            var checkID = Number($(item_i).find("td[data-title=ID]").attr("data-value"));
                                            $.each(res.info.LocationPlanList, function (i, item) {
                                                if (item.ID == checkID) {
                                                    item.TaskMaterialID = res.info.ID;
                                                    item.TaskLineID = res.info.TaskLineID;
                                                    locationArry.push(item);
                                                }
                                            });
                                        }

                                    });
                                    model.com.postAddLocation({
                                        data: locationArry
                                    }, function (res) {
                                        model.com.refresh();
                                    });
                                }
                            });
                        });
                    }

                });
                //下达
                $("body").delegate("#lmvt-produce-do", "click", function () {

                    if (flag == 1) {
                        var SelectData = $com.table.getSelectionData($(".lmvt-main-body"), "showID", Plan_source);

                        if (!SelectData || !SelectData.length) {
                            alert("至少选择一行数据再试！")
                            return;
                        }

                        // $.each(SelectData, function (i, item) {
                        //     delete item.FQTY_OrderMargin;
                        //     delete item.TypeText;
                        // });

                        var _data = [];
                        $.each(SelectData, function (i, item_i) {
                            $.each(Plan_source, function (j, item_j) {
                                if (item_i.showID == item_j.showID) {
                                    _data.push(item_j)
                                }
                            });
                        });

                        $.each(_data, function (i, item) {
                            delete item.showID;
                            delete item.TypeText;

                            model.com.postSubmit({
                                data: item
                            }, function (res) {
                                alert("下达成功");
                                if (!res)
                                    return;
                                if (res.info) {
                                    var $tr = $(".lmvt-produce-body tr"),
                                        locationArry = [];
                                    $.each($tr, function (i, item_i) {
                                        if ($(item_i).find("input[type=checkbox].femi-tb-checkbox")[0].checked) {
                                            var checkID = Number($(item_i).find("td[data-title=ID]").attr("data-value"));
                                            $.each(res.info.LocationPlanList, function (i, item) {
                                                if (item.ID == checkID) {
                                                    item.TaskMaterialID = res.info.ID;
                                                    item.TaskLineID = res.info.TaskLineID;
                                                    locationArry.push(item);
                                                }
                                            });
                                        }

                                    });
                                    model.com.postAddLocation({
                                        data: locationArry
                                    }, function (res) {
                                        model.com.refresh();
                                    });
                                }
                            });
                        });
                    }
                    else {
                        var SelectData = $com.table.getSelectionData($(".lmvt-main-body"), "showID", Product_source);

                        if (!SelectData || !SelectData.length) {
                            alert("至少选择一行数据再试！")
                            return;
                        }
                        $.each(SelectData, function (i, item) {
                            delete item.showID;
                            delete item.TypeText;

                            model.com.postSubmit({
                                data: item
                            }, function (res) {
                                alert("下达成功");
                                if (!res)
                                    return;
                                if (res.info) {
                                    //if (res.info.LocationPlanList[1].TaskMaterialID == 0) {
                                    var $tr = $(".lmvt-produce-body tr"),
                                        locationArry = [];
                                    $.each($tr, function (i, item_i) {
                                        if ($(item_i).find("input[type=checkbox].femi-tb-checkbox")[0].checked) {
                                            var checkID = Number($(item_i).find("td[data-title=ID]").attr("data-value"));
                                            $.each(res.info.LocationPlanList, function (i, item) {
                                                if (item.ID == checkID) {
                                                    item.TaskMaterialID = res.info.ID;
                                                    item.TaskLineID = res.info.TaskLineID;
                                                    locationArry.push(item);
                                                }
                                            });
                                        }

                                    });
                                    model.com.postAddLocation({
                                        data: locationArry
                                    }, function (res) {
                                        model.com.refresh();
                                    });
                                }
                            });
                        });
                    }
                });
                //导出生产计划
                $("body").delegate("#lmvt-main-out", "click", function () {

                    var $table = $(".table-main"),
                        fileName = "配料计划.xls",
                        Title = "配料计划";
                    var params = $com.table.getExportParams($table, fileName, Title);

                    model.com.postExportExcel(params, function (res) {
                        var src = res.info.path;
                        window.open(src);
                    });
                });
                //导出补料计划
                $("body").delegate("#lmvt-supplement-out", "click", function () {

                    var $table = $(".supplement-table"),
                        fileName = "补料计划.xls",
                        Title = "补料计划";
                    var params = $com.table.getExportParams($table, fileName, Title);

                    model.com.postExportExcel(params, function (res) {
                        var src = res.info.path;
                        window.open(src);
                    });
                });
                //删除
                $("body").delegate("#lmvt-produce-delete", "click", function () {

                    var SelectData1 = $com.table.getSelectionData($(".lmvt-main-body"), "showID", Product_source);

                    var SelectData2 = $com.table.getSelectionData($(".lmvt-supplement-main-body"), "showID", Product_source);

                    if (SelectData1.length > 0) {
                        if (!confirm("已选择" + SelectData1.length + "条数据，确定将其删除？")) {
                            return;
                        }
                        var cate = false;
                        $.each(SelectData1, function (i, item) {
                            if (item.FQTYPL > 0) {
                                alert(item.MaterialName + "已配过料，无法删除！" + "");
                                cate = true;
                                return true;
                            }
                        });

                        if (cate) {
                            cate = false;
                            return;
                        }

                        $.each(SelectData1, function (i, item) {
                            delete item.showID;
                            delete item.TypeText;
                        });

                        model.com.postDelete({
                            data: SelectData1
                        }, function (res) {
                            alert("删除成功");
                            model.com.refresh();
                        });


                    }
                    else {
                        if (!confirm("已选择" + SelectData2.length + "条数据，确定将其删除？")) {
                            return;
                        }
                        $.each(SelectData2, function (i, item) {
                            delete item.showID;
                            delete item.TypeText;
                        });
                        model.com.postDelete({
                            data: SelectData2
                        }, function (res) {
                            alert("删除成功");
                            model.com.refresh();
                        });

                    }
                });
                //删除仓位
                $("body").delegate("#lmvt-location-delete", "click", function () {
                    if (flag == 2) {
                        var SelectData = $com.table.getSelectionData($(".lmvt-produce-body"), "showID", LocationList);
                        if (SelectData.length == 0) {
                            alert("请先选择一条数据！！！");
                            return;
                        }

                        if (SelectData.length > 0) {
                            if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {
                                return;
                            }
                        }

                        model.com.postDeleteLocation({
                            data: SelectData
                        }, function (res) {
                            alert("删除成功");
                            model.com.getMaterialTaskProductLocationAll({ TaskMaterialID: Product_source[LocationID - 1].ID }, function (res) {
                                if (!res)
                                    return;
                                var list = res.list,
                                    rst = [];
                                if (list) {
                                    model.com.Render(res.list);
                                }
                            });
                            model.com.refresh();
                        });
                    }
                    else {
                        alert("计划仓库无法删除");
                        return;
                    }

                });
                //删除补料页面仓位
                $("body").delegate("#lmvt-supplement-location-delete", "click", function () {
                    if (flag == 2) {
                        var SelectData = $com.table.getSelectionData($(".lmvt-supplement-produce-body"), "ID", Csupplement);
                        if (SelectData.length == 0) {
                            alert("请先选择一条数据！！！");
                            return;
                        }

                        if (SelectData.length > 0) {
                            if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {
                                return;
                            }
                        }

                        model.com.postDeleteLocation({
                            data: SelectData
                        }, function (res) {
                            alert("删除成功");
                            model.com.getMaterialTaskProductLocationAll({ TaskMaterialID: Materia[0][PointID - 1].ID }, function (res) {
                                if (!res)
                                    return;
                                var list = res.list,
                                    rst = [];
                                if (list) {
                                    model.com.Render(res.list);
                                    //$(".lmvt-produce-body").html($com.util.template(res.list, HTML.ProduceList));
                                }
                            });
                            model.com.refresh();
                        });
                    }
                    else {
                        alert("计划仓库无法删除");
                        return;
                    }

                });
                //查看补料
                $("body").delegate("#lmvt-see-supplement", "click", function () {
                    $(".lmvt-container-main").hide();
                    $(".lmvt-container-supplement").show();
                    $(".lmvt-container-produce").hide();
                    $(".lmvt-container-surport").hide();
                    temp = false;
                });

                //二级表的返回
                //返回
                $("body").delegate("#lmvt-produce-back", "click", function () {
                    if (temp) {
                        $(".lmvt-container-main").show();
                        $(".lmvt-container-produce").hide();
                        $(".lmvt-container-main").css("height", "100%");
                        model.com.refresh();
                    }
                    else {
                        $(".lmvt-container-main").show();
                        $(".lmvt-container-supplement").hide();
                        $(".lmvt-container-produce").hide();
                        $(".lmvt-container-main").css("height", "100%");
                        model.com.refresh();
                    }
                    temp = true;
                    //$(".lmvt-container-supplement").show();
                    //$(".lmvt-container-produce").hide();
                    //$(".lmvt-container-surport").hide();
                });

                //从补料计划返回
                $("body").delegate("#lmvt-position-back", "click", function () {

                    $(".lmvt-container-supplement-first").show();
                    $(".lmvt-container-supplement-plan").hide();
                });

                //查看生产计划
                $("body").delegate("#lmvt-produce-plan-main", "click", function () {
                    $(".lmvt-container-main").show();
                    $(".lmvt-container-supplement").hide();
                    temp = true;
                });
                //辅料
                $("body").delegate("#lmvt-surport", "click", function () {
                    $(".changeName").text("辅料");
                    $(".lmvt-container-table-surport").show();
                    $(".lmvt-container-table-main").hide();
                    $(".lmvt-container-supplement-plan").hide()
                });
                //主料
                $("body").delegate("#lmvt-main", "click", function () {
                    $(".changeName").text("主材");
                    $(".lmvt-container-table-surport").hide();
                    $(".lmvt-container-table-main").show();
                    $(".lmvt-container-table-supplement").hide()
                });
                //补料
                $("body").delegate("#lmvt-supplement", "click", function () {
                    $(".changeName").text("补料");
                    $(".lmvt-container-table-surport").hide();
                    $(".lmvt-container-table-main").hide();
                    $(".lmvt-container-supplement-plan").show();
                    $(".lmvt-container-table-supplement").show();
                    $(".lmvt-container-supplement-main").hide();
                    $(".lmvt-container-supplement-position").hide();
                });
            },
            run: function () {
                //工步
                model.com.getFPCPartPoint({ FactoryID: 0, BusinessUnitID: 0, ProductTypeID: 0 }, function (res) {
                    if (!res)
                        return;
                    var list = res.list,
                        rst = [];
                    if (list) {
                        PartPointSource = res.list;
                    }
                });
                //得到产线
                model.com.getFMCLine({}, function (res) {
                    if (!res)
                        return;
                    var list = res.list,
                        rst = [];
                    if (list) {
                        $.each(res.list, function (i, item_i) {
                            TypeSource_MESCheck.LineID.push({
                                name: item_i.Name,
                                value: item_i.ID,
                            });
                        });
                    }
                });
                //model.com.getAPSPartPointMode({ WorkShopID: 0, LineID: 0, PartID: 0 }, function (res) {
                //    if (!res)
                //        return;
                //    var list = res.list,
                //        rst = [];
                //    if (list) {
                //        AllMode = res.list;
                //    }
                //});
                //model.com.refresh();

            },
            com: {
                //删除配料仓位
                postDeleteLocation: function (data, fn, context) {
                    var d = {
                        $URI: "/MaterialTaskProduct/DeleteLocation",
                        $TYPE: "post"
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //导出
                postExportExcel: function (data, fn, context) {
                    var d = {
                        $URI: "/Upload/ExportExcel",
                        $TYPE: "post"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //查询工步列表
                getFPCPartPoint: function (data, fn, context) {
                    var d = {
                        $URI: "/FPCPartPoint/All",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //历史班次
                getSCHShiftAll: function (data, fn, context) {
                    var d = {
                        $URI: "/SCHShift/All",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //增加
                postAddLocation: function (data, fn, context) {
                    var d = {
                        $URI: "/MaterialTaskProduct/AddLocation",
                        $TYPE: "post"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //修改仓库仓位
                postSaveLocation: function (data, fn, context) {
                    var d = {
                        $URI: "/MaterialTaskProduct/SaveLocation",
                        $TYPE: "post"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //提交
                postSubmit: function (data, fn, context) {
                    var d = {
                        $URI: "/MaterialTaskProduct/Submit",
                        $TYPE: "post"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //手动调整
                postDelete: function (data, fn, context) {
                    var d = {
                        $URI: "/MaterialTaskProduct/Delete",
                        $TYPE: "post"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //手动调整
                getManual: function (data, fn, context) {
                    var d = {
                        $URI: "/MaterialTaskProduct/Manual",
                        $TYPE: "post"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //工序模式
                getAPSPartPointMode: function (data, fn, context) {
                    var d = {
                        $URI: "/APSPartPointMode/All",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //补料表
                getERPInterface: function (data, fn, context) {
                    var d = {
                        $URI: "/ERPInterface/ERPMaterialAll",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //APS
                getPartPointAll: function (data, fn, context) {
                    var d = {
                        $URI: "/APSTask/PartPointAll",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //补料
                getSupplement: function (data, fn, context) {
                    var d = {
                        $URI: "/MaterialTaskProduct/Supplement",
                        $TYPE: "post"
                    };
                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //生成计划
                getCreateAll: function (data, fn, context) {
                    var d = {
                        $URI: "/MaterialTaskProduct/CreateAll",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //ERP仓位 
                getERPInterfaceAll: function (data, fn, context) {
                    var d = {
                        $URI: "/ERPInterface/ERPMaterialAll",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //仓位 
                getInstockLocationAll: function (data, fn, context) {
                    var d = {
                        $URI: "/InstockLocation/All",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //仓库
                getMaterialTaskProductLocationAll: function (data, fn, context) {
                    var d = {
                        $URI: "/MaterialTaskProduct/LocationAll",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //产线
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
                //班次
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
                //查询班次
                getShfitCur: function (data, fn, context) {
                    var d = {
                        $URI: "/SCHShift/CreateShifID",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //配料
                getMaterialTaskProduct: function (data, fn, context) {
                    var d = {
                        $URI: "/MaterialTaskProduct/All",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //配料
                getTEST: function (data, fn, context) {
                    var d = {
                        $URI: "/MaterialTaskProduct/All",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //APSMaterial
                getAPSTask: function (data, fn, context) {
                    var d = {
                        $URI: "/APSMaterial/All",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                refresh: function () {
                    //model.com.getAPSProductTypeAll({}, function (res) {
                    //    if (!res)
                    //        return;
                    //    var list = res.list,
                    //        rst = [];
                    //    if (list) {

                    //    }

                    //});
                    if (flag == 1) {
                        //生成计划
                        model.com.getCreateAll({ LineID: lID, Mode: 1, shift_id: ShiftID }, function (res) {

                            if (!res)
                                return;
                            var list = res.list,
                                rst = [];
                            if (list) {
                                var mainRed = [],
                                    surportRed = [];
                                mainPlanList = [];
                                surportPlanList = [];

                                Plan_source = res.list;

                                DataPlan_source = res.list;

                                Plan_source = $com.util.Clone(Plan_source);

                                //$.each(Plan_source, function (i, item) {
                                //    item.showID = i + 1;
                                //    if (item.MaterialMode == MaterialName.main)
                                //        mainPlanList.push(item);
                                //    else
                                //        surportPlanList.push(item);
                                //});
                                $.each(Plan_source, function (i, item) {
                                    item.showID = i + 1;
                                    item.PartPointName = model.com.GetPartPointSource(item.PartPointID);
                                    item.Type = 1;
                                    item.TypeText = "计划";
                                    //if (item.FQTYBase >= item.FQTYMargin) {
                                    //    mainRed.push(i);
                                    //    item.MaterialSubModeText = "缺少物料";
                                    //}
                                });
                                //$.each(surportPlanList, function (i, item) {
                                //    item.showID = i + 1;
                                //    item.Type = 2;
                                //    item.TypeText = "补料";
                                //    if (item.FQTYBase >= item.FQTYMargin) {
                                //        surportRed.push(i);
                                //    }
                                //});
                            }
                            $(".lmvt-main-body").html($com.util.template(Plan_source, HTML.MainList));
                            $(".lmvt-supplement-main-body tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);



                            });
                            //$(".lmvt-surport-body").html($com.util.template(surportPlanList, HTML.SurportList));
                            //$.each($(".lmvt-main-body").find("tr"), function (i, item_i) {
                            //    $.each(mainRed, function (j, item_j) {
                            //        if (i == item_j)
                            //            $(item_i).css("backgroundColor", "pink");
                            //    });
                            //});
                            //$.each($(".lmvt-surport-body").find("tr"), function (i, item_i) {
                            //    $.each(surportRed, function (j, item_j) {
                            //        if (i == item_j)
                            //            $(item_i).css("backgroundColor", "pink");
                            //    });
                            //});
                        });

                    }
                    if (flag == 2) {
                        //查询计划
                        model.com.getMaterialTaskProduct({ shift_id: ShiftID }, function (res) {
                            mainMaterialList = [];
                            if (!res)
                                return;
                            var list = res.list,
                                rst = [];
                            if (list) {
                                Product_source = res.list;

                                DataProduct_source = res.list;

                                Product_source = $com.util.Clone(Product_source);
                                var supplementProduct_source = [];
                                if (temp) {
                                    $.each(Product_source, function (i, item) {
                                        item.showID = i + 1;
                                        if (item.Type == 1)
                                            item.TypeText = "计划";
                                        else
                                            item.TypeText = "补料";
                                    });
                                }
                                else {
                                    $.each(Product_source, function (i, item) {
                                        item.showID = i + 1;
                                        if (item.Type == 2) {
                                            item.TypeText = "补料";
                                            supplementProduct_source.push(item);
                                        }

                                    });
                                    $.each(supplementProduct_source, function (i, item) {
                                        item.showID = i + 1;
                                    });
                                    Product_source = supplementProduct_source
                                }

                            }
                            $(".lmvt-main-body").html($com.util.template(Product_source, HTML.MainList));
                            $(".lmvt-main-body tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);



                            });
                            $(".lmvt-supplement-main-body").html($com.util.template(Product_source, HTML.MainList));
                            $(".lmvt-supplement-main-body tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);



                            });
                        });
                    }
                },
                //仓库仓位 
                Render: function (source) {
                    $(".lmvt-container-main").show();
                    $(".lmvt-container-main").css("height", "50%");
                    $(".lmvt-container-surport").hide();
                    $(".lmvt-container-supplement").hide();
                    $.each(source, function (i, item) {
                        item.showID = i + 1;
                    });
                    $(".lmvt-produce-body").html($com.util.template(source, HTML.ProduceList));
                    $(".lmvt-container-produce").show();

                    $.each(source, function (j, item_j) {
                        var $tr = $(".lmvt-container-table-produce tr"),
                            id = [];
                        if (item_j.FQTYPL != 0) {
                            $.each($tr, function (i, item_i) {
                                if ($(item_i).find("td[data-title=showID]").attr("data-value") == item_j.showID)
                                    $(item_i).find("input[type=checkbox].femi-tb-checkbox").prop("checked", true);
                            });
                        }
                    });
                },
                GetSupplementList: function (source) {
                    var arr = [];
                    model.com.getSupplement({ WorkShopID: wID, LineID: lID, Mode: mID, shift_id: ShiftID, data: source }, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];
                        if (list) {
                            arr.push(res.list);
                        }
                    });
                    return arr;
                },
                ComputerCount: function (ID, Source) {
                    var arry = [],
                        PlanNumber,
                        cafe = false;
                    $.each(Source, function (i, item_i) {
                        PlanNumber = item_i.FQTYPlan;
                        $.each(item_i.LocationPlanList, function (i, item_j) {
                            item_j.FQTYPL = 0;
                            if (cafe) {
                                item_i.FQTYPlan = 0;
                                return false;
                            }
                            if (ID == 2) {
                                if (PlanNumber == 0)
                                    return;
                                else {
                                    if (item_j.FQTYKC > PlanNumber) {
                                        item_j.FQTYPL = PlanNumber
                                        PlanNumber = 0;
                                    }
                                    else {
                                        item_j.FQTYPL = item_j.FQTYKC;
                                        PlanNumber = PlanNumber - item_j.FQTYPL;
                                    }
                                }
                            }
                            if (ID == 1) {
                                if (PlanNumber == 0) {
                                    cafe = true;
                                }
                                else {
                                    if (item_j.FQTYKC > PlanNumber) {
                                        item_j.FQTYPL = PlanNumber
                                        PlanNumber = 0;
                                    }
                                    else {
                                        item_j.FQTYPL = item_j.FQTYKC;
                                        PlanNumber = PlanNumber - item_j.FQTYPL;
                                    }
                                }
                            }
                        });
                        arry.push(item_i);
                    });
                    return arry;
                },

                //班次
                GetShfit: function (start) {
                    model.com.getShfitCur({}, function (res) {
                        ShiftID = res.info;
                    });
                },

                //得到工步
                GetPartPointSource: function (id) {
                    var Name;
                    $.each(PartPointSource, function (i, item) {
                        if (id == item.ID) {
                            Name = item.Name;
                            return Name;
                        }
                    });
                    return Name;
                },
            },
        });
        model.init();
    });