require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($zace, $com) {

    var model,
        wUser,
        MoveDataList = [],//移车数据源
        OrderDataObjList,//台车实时列表
        nowPage = 0, //当前页(异常)
        count = 8, //每页显示多少条消息 (异常)
        EXCDataList = [], //创建一个存放数据的数组(异常)
        DATABasic = [],//台位全局
        mData = [],//库位全局
        nowPageOrder = 0, //当前页(台车实时)
        countOrder = 10, //每页显示多少条消息 (台车实时)
        OrderDataList = [], //创建一个存放数据的数组(台车实时)
        Flag = 0,
        IsTrue = true,
        mIsStart = false,
        HTML;
    Level = ["无", "A", "B", "C", "D"];
    Temp = {
        Item: "",
        ParentName: "",
    };
    TempFactoryline = {
        Item: "",
        ParentName: "厂线",
    };
    HTML = {
        // 台位库位模板 C1到淋雨
        TablePositionOne: [
            // '<tr style="height: 2.72vh;color: white;font-size: 0.8vw;">',
            '<td style="width: 100%;">',
            '{{Item}}',
            '</td>',
            '<td>',
            '<div style="width: 50px;">{{ParentName}}</div>',
            '</td>',
            // '</tr>',
        ].join(""),
        TablePositionTd: [
            // '<td style="border: 1px solid gray;width: 100%;">',
            '<div style="margin-right: 5%; width: 42%;height: 18px;border-radius: 8px;border: 2px solid #cccccc;color: white;float: right;margin-left: 1%;background-color: {{Color}};overflow: hidden;"data-value={{ID}}>',
            '<p style="font-size: 0.8vw;line-height: 0.8vw;vertical-align: middle;white-space: nowrap;" class="{{Class}}">{{PartNo}}</p>',
            '</div>',
            // '</td>',
        ].join(""),

        TablePositionTd_C27: [
            // '<td style="border: 1px solid gray;width: 100%;">',
            '<div style="margin-right: 2%; width: 30%;height: 18px;border-radius: 8px;border: 2px solid #cccccc;color: white;float: right;margin-left: 1%;background-color: {{Color}};overflow: hidden;">',
            '<p style="font-size: 0.4vw;line-height: 1vw;vertical-align: middle;white-space: nowrap;" class="{{Class}}">{{PartNo}}</p>',
            '</div>',
            // '</td>',
        ].join(""),
        // A1-A7 B1-B7 厂线
        TablePositionTwo: [
            '<td style="width: 50px;">',
            '<div>{{ParentName}}</div>',
            '</td>',
            '<td>',
            '{{Item}}',
            '</td>',
        ].join(""),


        TablePositionTwoTd: [
            '<div style="margin: 2px; width: 15%;height: 18px;border-radius: 8px;border: 2px solid #cccccc;float: left;margin-right: 10px;background-color: {{Color}};overflow: hidden;">',
            '<p style="font-size: 0.8vw;line-height: 0.8vw;vertical-align: middle;white-space: nowrap;" class="{{Class}}">{{PartNo}}</p>',
            '</div>',
        ].join(""),

        //台车订单实时列表

        TableCar: [
            '<tr style="text-align: center;height: 6vh;">,',
            '<td style="min-width: 50px;vertical-align: middle;">{{PartNo}}</td>',
            '<td style="min-width: 50px;vertical-align: middle;">{{CustomerName}}</td>',
            '<td style="min-width: 50px;vertical-align: middle;">{{LineName}}</td>',
            '<td style="min-width: 50px;vertical-align: middle;">{{RealReceiveDate}}</td>',
            '<td style="min-width: 50px;vertical-align: middle;">{{StopTime}}</td>',
            '<td style="min-width: 50px;vertical-align: middle;">{{StockName}}</td>',
            '<td style="min-width: 50px;vertical-align: middle;">{{PlaceName}}</td>',
            '<td style="min-width: 50px;vertical-align: middle;">{{StationName}}</td>',
            '<td style="min-width: 50px;vertical-align: middle;">{{FinishNum}}</td>',
            '<td style="min-width: 50px;vertical-align: middle;">{{SurplusNum}}</td>',
            '<td style="min-width: 50px;vertical-align: middle;"><p style="line-height: 1vh;">{{Progress}}' + "%" + '</p><progress max="100" value={{Progress}} style="width: 100px ;height: 15px;"><progress></td>',
            '<td style="min-width: 50px;vertical-align: middle;color: {{RBGC}};">{{ReworkNum}}</td>',
            '<td style="min-width: 50px;vertical-align: middle;color: {{NBGC}};">{{NcrNum}}</td>',
            '<td style="min-width: 50px;vertical-align: middle;color: {{EBGC}};">{{ExcNum}}</td>',
            '<td style="min-width: 50px;vertical-align: middle;"><p style="color:{{Color}}">{{Status}}</p></td>',
            '</tr>',
        ].join(""),
        //异常任务列表
        TableEXC: [
            '<tr style="background-color: {{BGcolor}};">',
            // '<td style="width: 3px"><input type="checkbox"',
            // 'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td style="min-width: 80px" data-title="PlaceNo" data-value="{{PlaceNo}}">{{PlaceNo}}</td>',
            '<td style="min-width: 50px" data-title="CarName" data-value="{{CarName}}">{{CarName}}</td>',
            '<td style="min-width: 40px" data-title="EXType" data-value="{{EXType}}">{{EXType}}</td>',
            '<td style="min-width: 60px" data-title="ResponseLevelName" data-value="{{ResponseLevelName}}">{{ResponseLevelName}}</td>',
            '<td style="min-width: 60px" data-title="CreateTime" data-value="{{CreateTime}}">{{CreateTime}}</td>',
            // '<td style="min-width: 50px" data-title="CreatorName" data-value="{{CreatorName}}">{{CreatorName}}</td>',
            '<td style="min-width: 80px" data-title="OperatorName" data-value="{{OperatorName}}">{{OperatorName}}</td>',
            '</tr>',
        ].join(""),
        //检修概况一
        TableGK: [
            '<tr>',
            '<td style="color: white;text-align: right;">全年累计修竣</td>',
            '<td style=" color: #07C33E;text-align: right;">{{AnnualNum}}</td>',
            '<td style="color: white;text-align: right;">C5修累计修竣</td>',
            '<td style="color: #07C33E;text-align: right;">{{AnnualC5Num}}</td>',
            '<td style="color: white;text-align: right;">C6修累计修竣</td>',
            '<td style="color: #07C33E;text-align: right;">{{AnnualC6Num}}</td>',
            '</tr>',
            '<tr>',
            '<td style="color: white;text-align: right;">本月竣工数</td>',
            '<td style="color: #07C33E;text-align: right;">{{ThisMonthNum}}</td>',
            '<td style="color: white;text-align: right;">在厂机车</td>',
            '<td style="color: #07C33E;text-align: right;">{{LocoCar}}</td>',
            '<td style="color: white;text-align: right;">在修机车</td>',
            '<td style="color: #07C33E;text-align: right;">{{RepairCar}}</td>',
            '</tr>',
            '<tr>',
            '<td style="color: white;text-align: right;">待完工任务</td>',
            '<td style="color: #F5B128;text-align: right;">{{stationTask}}</td>',
            '<td style="color: white;text-align: right;">今日新增异常</td>',
            '<td style="color: red;text-align: right;">{{ExcTask}}</td>',
            '<td style="color: white;text-align: right;">不合格评审数</td>',
            '<td style="color: red;text-align: right;">{{ncrTask}}</td>',
            '</tr>',
        ].join(""),
        //检修概况二
        TableGKTwo: [
            '<tr>',
            '<td style="color: white;text-align: right;">全年累计修竣</td>',
            '<td style=" color: #07C33E;text-align: right;">{{AnnualNum}}</td>',
            '<td style="color: white;text-align: right;">C5修累计修竣</td>',
            '<td style="color: #07C33E;text-align: right;">{{AnnualC5Num}}</td>',
            '<td style="color: white;text-align: right;">C6修累计修竣</td>',
            '<td style="color: #07C33E;text-align: right;">{{AnnualC6Num}}</td>',
            '<td style="color: white;text-align: right;">本月竣工数</td>',
            '<td style="color: #07C33E;text-align: right;">{{ThisMonthNum}}</td>',
            '<td style="color: white;text-align: right;">在厂机车</td>',
            '<td style="color: #07C33E;text-align: right;">{{LocoCar}}</td>',
            '<td style="color: white;text-align: right;">在修机车</td>',
            '<td style="color: #07C33E;text-align: right;">{{RepairCar}}</td>',
            '<td style="color: white;text-align: right;">待完工任务</td>',
            '<td style="color: #F5B128;text-align: right;">{{stationTask}}</td>',
            '<td style="color: white;text-align: right;">今日新增异常</td>',
            '<td style="color: red;text-align: right;">{{ExcTask}}</td>',
            '<td style="color: white;text-align: right;">不合格评审数</td>',
            '<td style="color: red;text-align: right;">{{ncrTask}}</td>',
            '</tr>',
        ].join(""),
        EXCTable: [
            '<div class="zace-colorHead" style="font-size: 1.5vw;line-height: 6vh;clear: both;">',
            '<p style="float: left;margin-left: 0.6vw;margin-right: 1vw;">异常信息</p><p style="float: left; margin-right: 1vw;color: #C51D1D;">A级:{{NumA}}</p> <p style="float: left;margin-right: 1vw;color: #EB3B3B;">B级:{{NumB}}</p> <p style="float: left;margin-right: 1vw;color: #F5B128;">C级:{{NumC}}</p > <p style="float: left;color: MediumSeaGreen;">D级:{{NumD}}</p>',
            '</div>',
        ].join(""),
    };

    model = $com.Model.create({
        name: '移车台',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();
        },

        events: function () {

        },

        run: function () {
            StartTime = $com.util.format("yyyy-MM-dd", new Date().getTime() - 7 * 24 * 3600 * 1000);
            EndTime = $com.util.format("yyyy-MM-dd", new Date().getTime() + 24 * 3600 * 1000);

            // StartTimeYear = $com.util.format("yyyy-MM-dd", new Date().getTime() - 365 * 24 * 3600 * 1000);
            // EndTimeYear = $com.util.format("yyyy-MM-dd", new Date().getTime() + 24 * 3600 * 1000);

            // StartTimeM = $com.util.format("yyyy-MM-dd", new Date().getTime() - 30 * 24 * 3600 * 1000);
            // EndTimeM = $com.util.format("yyyy-MM-dd", new Date().getTime() + 24 * 3600 * 1000);

            MonthTime = $com.util.format("yyyy-MM-dd", new Date().getTime());
            var monthArray = MonthTime.split('-');
            var year = monthArray[0]; //获取当前日期的年份  
            var month = monthArray[1]; //获取当前日期的月份  
            var day = monthArray[2]; //获取当前日期的日  
            var days = new Date(year, month, 0);
            days = days.getDate(); //获取当前日期中月的天数

            StartTimeM = year + '-' + month + '-' + "01";
            EndTimeM = year + '-' + month + '-' + days;

            var years = new Date(year, 12, 0);
            years = years.getDate(); //获取当前日期中月的天数

            StartTimeYear = year + '-' + "01" + '-' + "01";
            EndTimeYear = year + '-' + "12" + '-' + years;

            NowTime = $com.util.format("yyyy-MM-dd", new Date());

            //检修概况
            model.com.Order();

            //异常信息
            model.com.refreshEXC();

            var wTimes = 0;

            function TableFull() {
                if (wTimes >= 15) {
                    model.com.RefreshPage();
                    return;
                }
                if (mIsStart) {
                    //异常信息翻页
                    model.com.RefreshPage();
                } else {
                    setTimeout(TableFull, 1000);
                }
            }

            TableFull();
            //渲染库位中台位背景色
            model.com.refreshBGC();

            //在厂台车列表
            // model.com.refreshOrder();
            //在厂台车列表翻页
            // model.com.RefreshPageOrder();
            // model.com.setTime();


        },

        com: {
            RefreshPageOrder: function () {
                var wPageAllOrder = (OrderDataList.length % 10 > 0 ? 1 : 0) + (parseInt(OrderDataList.length / 10)); //计算总页数

                var onePageDataOrder = []; //存放一页数据

                for (var i = nowPageOrder * countOrder; i < (nowPageOrder + 1) * countOrder; i++) { //满足当前数据小于没到当前页的最后一条数据 ，并且当前数据没到最后一条数据
                    if (i >= OrderDataList.length)
                        break;
                    onePageDataOrder.push(OrderDataList[i]);// 这个循环会循环10次  把10条数据放到列表里 
                }
                console.log("渲染数据为：" + onePageDataOrder.length);
                $(".lmvt-excPlace-bodyMove").html($com.util.template(onePageDataOrder, HTML.TableCar));
                setTimeout(function () {

                    nowPageOrder++;
                    if (nowPageOrder >= wPageAllOrder) {
                        nowPageOrder = 0;
                    }
                    model.com.RefreshPageOrder();
                }, 15000);
            },
            refreshOrder: function () {
                model.com.getTrainOrderInfoList({}, function (res) {
                    $com.util.deleteLowerProperty(res.list);
                    OrderDataList = res.list;
                    aa = $com.util.Clone(OrderDataList);
                    for (var i = 0; i < OrderDataList.length; i++) {
                        OrderDataList[i].RealReceiveDate = $com.util.format('yyyy-MM-dd', OrderDataList[i].RealReceiveDate);
                        OrderDataList[i].PartNo = OrderDataList[i].PartNo.substring(3);


                        if (OrderDataList[i].SurplusNum + OrderDataList[i].FinishNum == 0) {
                            OrderDataList[i].Progress = 0;
                        } else {
                            OrderDataList[i].Progress = Math.floor((Number((OrderDataList[i].FinishNum / (OrderDataList[i].SurplusNum + OrderDataList[i].FinishNum))) * 100));
                        }
                        if (OrderDataList[i].StockName == "") {
                            OrderDataList[i].StockName = "无";
                        }
                        if (OrderDataList[i].PlaceName == "") {
                            OrderDataList[i].PlaceName = "无";
                        }
                        if (OrderDataList[i].Status == "") {
                            OrderDataList[i].Status = "未开工";
                        } else if (OrderDataList[i].Status == "工位开工") {
                            OrderDataList[i].Color = "#009900";
                        } else if (OrderDataList[i].Status == "工位完工") {
                            OrderDataList[i].Color = "#00CCFF";
                        } else if (OrderDataList[i].Status == "异常") {
                            OrderDataList[i].Color = "#FF0000";
                        }
                        if (OrderDataList[i].ReworkNum > 0) {
                            OrderDataList[i].RBGC = "red";
                        }
                        if (OrderDataList[i].NcrNum > 0) {
                            OrderDataList[i].NBGC = "red";
                        }
                        if (OrderDataList[i].ExcNum > 0) {
                            OrderDataList[i].EBGC = "red";
                        }
                    }
                    $(".lmvt-excPlace-bodyMove").html($com.util.template(OrderDataList, HTML.TableCar));
                });
                setTimeout(function () {
                    model.com.refreshOrder();
                }, 30000);
            },
            setTime: function () {
                setTimeout(function () {
                    if (Flag == 0) {
                        $(".lmvt-exc-contain").show();
                        $(".lmvt-exc-div").show();
                        $(".lmvt-exc-msg").show();
                        $(".lmvt-exc-divTwo").hide();
                        $(".lmvt-exc-car").hide();
                        Flag = 1;
                    } else {
                        $(".lmvt-exc-contain").hide();
                        $(".lmvt-exc-div").hide();
                        $(".lmvt-exc-msg").hide();
                        $(".lmvt-exc-divTwo").show();
                        $(".lmvt-exc-car").show();
                        Flag = 0;
                    }
                    model.com.setTime();
                }, 60000);
            },
            //获取台车订单实时列表
            getTrainOrderInfoList: function (data, fn, context) {
                var d = {
                    $URI: "/Andon/TrainOrderInfoList",
                    $TYPE: "get",
                    $SERVER: "/MESAPS",
                };

                function err() {
                    // $com.app.tip('获取失败，请检查网络');
                    console.log('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取转序单任务
            returnOrderTask: function (data, fn, context) {
                var d = {
                    $URI: "/RSMTurnOrderTask/All",
                    $TYPE: "Post",
                    $SERVER: "/MESQMS",
                };

                function err() {
                    // $com.app.tip('获取失败，请检查网络');
                    console.log('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //直接通过订单状态获取订单号 data=[3,4,5];
            OrderStatus: function (data, fn, context) {
                var d = {
                    $URI: "/OMSOrder/StatusAll",
                    $TYPE: "Post",
                    $SERVER: "/MESAPS",
                };

                function err() {
                    // $com.app.tip('获取失败，请检查网络');
                    console.log('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //不合格评审用时间段查询
            getTimeAll: function (data, fn, context) {
                var d = {
                    $URI: "/NCR/TimeAll",
                    $TYPE: "Post",
                    $SERVER: "/MESWDW",
                };

                function err() {
                    // $com.app.tip('获取失败，请检查网络');
                    console.log('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询台车状态
            getPartNoStatus: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskPart/PartNoStatus",
                    $TYPE: "post",
                    $SERVER: "/MESAPS",
                };

                function err() {
                    // $com.app.tip('获取失败，请检查网络');
                    console.log('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询今日待完工工位任务
            getAPSTaskPart: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskPart/TodayToDo",
                    $TYPE: "get",
                    $SERVER: "/MESAPS",
                };

                function err() {
                    // $com.app.tip('获取失败，请检查网络');
                    console.log('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //台位查询
            getFPCProductPlace: function (data, fn, context) {
                var d = {
                    $URI: "/FMCWorkspace/All",
                    $TYPE: "get",
                };

                function err() {
                    // $com.app.tip('获取失败，请检查网络');
                    console.log('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取库位列表
            getStoreHouseList: function (data, fn, context) {
                var d = {
                    $URI: "/LFS/StoreHouseAll",
                    $TYPE: "Get",
                    $SERVER: "/MESLFS",
                };

                function err() {
                    // $com.app.tip('获取库位列表失败，请检查网络!');
                    console.log('获取库位列表失败，请检查网络!');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询产线列表(修程)
            getFMCLine: function (data, fn, context) {
                var d = {
                    $URI: "/FMCLine/All",
                    $TYPE: "get",
                };

                function err() {
                    // $com.app.tip('获取失败，请检查网络');
                    console.log('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            // 查询订单 ID CommandID OrderNo LineID ProductID BureauSectionID PartNo BOMNo Active
            getOMSOrder: function (data, fn, context) {
                var d = {
                    $URI: "/OMSOrder/All",
                    $TYPE: "Get",
                    $SERVER: "/MESAPS",
                };

                function err() {
                    // $com.app.tip('获取失败请检查网络!');
                    console.log('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //根据局段 时间段 修程 车型 车号查询订单集合
            getOMSOrderRF: function (data, fn, context) {
                var d = {
                    $URI: "/OMSOrder/RFOrderList",
                    $TYPE: "Get",
                    $SERVER: "/MESAPS",
                };

                function err() {
                    // $com.app.tip('获取失败请检查网络!');
                    console.log('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取移车单 参数  partNo starttime EndTime
            GetTask: function (data, fn, context) {
                var d = {
                    $URI: "/Capacity/All",
                    $TYPE: "get",
                    $SERVER: "/MESWDW",
                };

                function err() {
                    // $com.app.tip('获取库位列表失败，请检查网络!');
                    console.log('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //人员
            getEmployee: function (data, fn, context) {
                var d = {
                    $URI: "/User/All",
                    $TYPE: "get",
                };

                function err() {
                    mbool = false;
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取台位
            getPlaceMode: function (data, fn, context) {
                var d = {
                    $URI: "/FMCWorkspace/All",
                    $TYPE: "get",
                };

                function err() {
                    // $com.app.tip('获取失败，请检查网络');
                    console.log('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //获取当天的异常列表
            getEXCAndonAll: function (data, fn, context) {
                var d = {
                    $URI: "/EXCAndon/All",
                    $TYPE: "get",
                    $SERVER: "/MESEXC",
                };

                function err() {
                    mbool = false;
                    //     setTimeout(function () {
                    //         model.com.refreshPage();

                    // }, 20000);
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            /**
             * 根据全局数据渲染异常表格
             */
            RefreshPage: function () {


                var wPageAll = (EXCDataList.length % 8 > 0 ? 1 : 0) + (parseInt(EXCDataList.length / 8)); //计算总页数

                var onePageData = []; //存放一页数据

                for (var i = nowPage * count; i < (nowPage + 1) * count; i++) { //满足当前数据小于没到当前页的最后一条数据 ，并且当前数据没到最后一条数据
                    if (i >= EXCDataList.length)
                        break;
                    onePageData.push(EXCDataList[i]);// 这个循环会循环8次  把8条数据放到列表里 
                }
                // console.log("渲染数据为：" + onePageData.length);
                $(".lmvt-excPlace-bodyExc").html($com.util.template(onePageData, HTML.TableEXC));
                setTimeout(function () {

                    nowPage++;
                    if (nowPage >= wPageAll) {
                        nowPage = 0;
                    }
                    model.com.RefreshPage();
                }, 15000);


            },
            /**
             * 刷新全局异常数据EXCDataList
             */
            refreshEXC: function () {
                model.com.getEXCAndonAll({ShiftID: 0}, function (res2) {
                    $com.util.deleteLowerProperty(res2.list);
                    wEXCAndonAll = res2.list;
                    ArrayNumA = [];
                    ArrayNumB = [];
                    ArrayNumC = [];
                    ArrayNumD = [];
                    for (var i = 0; i < wEXCAndonAll.length; i++) {
                        if (wEXCAndonAll[i].ResponseLevel == 1) {
                            ArrayNumA.push(wEXCAndonAll[i]);
                        }
                        if (wEXCAndonAll[i].ResponseLevel == 2) {
                            ArrayNumB.push(wEXCAndonAll[i]);
                        }
                        if (wEXCAndonAll[i].ResponseLevel == 3) {
                            ArrayNumC.push(wEXCAndonAll[i]);
                        }
                        if (wEXCAndonAll[i].ResponseLevel == 4) {
                            ArrayNumD.push(wEXCAndonAll[i]);
                        }
                    }
                    TempNum = {
                        NumA: ArrayNumA.length,
                        NumB: ArrayNumB.length,
                        NumC: ArrayNumC.length,
                        NumD: ArrayNumD.length,
                    };
                    $(".lmvt-exc-msg .lmvt-exc-div-name").html($com.util.template(TempNum, HTML.EXCTable));

                    model.com.getPlaceMode({Active: -1, ProductID: 0, PartID: 0, PlaceType: 1}, function (res3) {
                        wPlaceMode = res3.list;
                        model.com.getEmployee({Active: -1}, function (data) {
                            wUser = data.list;
                            for (var i = 0; i < wUser.length; i++) {
                                for (var j = 0; j < wEXCAndonAll.length; j++) {
                                    if (wUser[i].ID == wEXCAndonAll[j].CreatorID) {
                                        switch (wEXCAndonAll[j].ResponseLevel) {
                                            case 1:
                                                wEXCAndonAll[j].BGcolor = "#C51D1D";
                                                break;
                                            case 2:
                                                wEXCAndonAll[j].BGcolor = "#EB3B3B";
                                                break;
                                            case 3:
                                                wEXCAndonAll[j].BGcolor = "#F5B128";
                                                break;
                                            case 4:
                                                wEXCAndonAll[j].BGcolor = "#1c7171";
                                                break;

                                        }
                                        wEXCAndonAll[j].CarName = wEXCAndonAll[j].CarName.substring(3);
                                        wEXCAndonAll[j].CreateTime = $com.util.format("yyyy-MM-dd hh:mm:ss", wEXCAndonAll[j].CreateTime);
                                        wEXCAndonAll[j].ResponseLevelName = Level[wEXCAndonAll[j].ResponseLevel];
                                        wEXCAndonAll[j].CreatorName = "【" + wUser[i].Department + "】" + wUser[i].Name;
                                        for (var m = 0; m < wPlaceMode.length; m++) {
                                            if (wPlaceMode[m].ID == wEXCAndonAll[j].PlaceID) {
                                                wEXCAndonAll[j].PlaceNo = wPlaceMode[m].Name;
                                            }
                                        }

                                    }
                                    if (wUser[i].ID == wEXCAndonAll[j].OperatorID[0]) {
                                        wEXCAndonAll[j].OperatorName = "【" + wUser[i].Department + "】" + wUser[i].Name;
                                    }

                                }
                            }

                            EXCDataList = $com.util.Clone(wEXCAndonAll);
                            mIsStart = true;
                        });
                    });

                });

                setTimeout(function () {
                    model.com.refreshEXC();
                }, 30000);

            },
            Order: function () {
                //全年订单
                model.com.getOMSOrderRF({
                    CustomerID: -1,
                    LineID: -1,
                    ProductID: -1,
                    PartNo: "",
                    StartTime: StartTimeYear,
                    EndTime: EndTimeYear,
                }, function (resYear) {
                    mOMSOrder = resYear.list;
                    mArrayC5 = [];//全年C5修竣
                    mArrayC6 = [];//全年C6修竣
                    mArrayAll = []; //全年修竣
                    // for (var i = 0; i < wFMCLine.length; i++) {
                    for (var j = 0; j < mOMSOrder.length; j++) {
                        if (mOMSOrder[j].LineName == "C5" && (mOMSOrder[j].Status == 5 || mOMSOrder[j].Status == 6)) {
                            mArrayC5.push(mOMSOrder[j]);
                        }
                        if (mOMSOrder[j].LineName == "C6" && (mOMSOrder[j].Status == 5 || mOMSOrder[j].Status == 6)) {
                            mArrayC6.push(mOMSOrder[j]);
                        }
                        if (mOMSOrder[j].Status == 5 || mOMSOrder[j].Status == 6) {
                            mArrayAll.push(mOMSOrder[j]);
                        }
                    }
                    // }
                    //本月订单
                    model.com.getOMSOrderRF({
                        CustomerID: -1, LineID: -1, ProductID: -1, PartNo: "", StartTime: StartTimeM, EndTime: EndTimeM,
                    }, function (resYear) {
                        mOMSOrder = resYear.list;
                        mArrayMAll = []; //本月竣工
                        for (var j = 0; j < mOMSOrder.length; j++) {
                            if (mOMSOrder[j].Status == 5 || mOMSOrder[j].Status == 6) {
                                mArrayMAll.push(mOMSOrder[j]);
                            }
                        }
                        //所有订单
                        model.com.getOMSOrderRF({
                            CustomerID: -1,
                            LineID: -1,
                            ProductID: -1,
                            PartNo: "",
                            StartTime: "2000-1-1",
                            EndTime: "2000-1-1",
                        }, function (resYear) {
                            mOMSOrder = resYear.list;
                            mArrayMZC = []; //在厂机车
                            mArrayMZX = []; //在修机车
                            for (var j = 0; j < mOMSOrder.length; j++) {
                                if (mOMSOrder[j].Status == 3 || mOMSOrder[j].Status == 4 || mOMSOrder[j].Status == 5) {
                                    mArrayMZC.push(mOMSOrder[j]);
                                }
                                if (mOMSOrder[j].Status == 4) {
                                    mArrayMZX.push(mOMSOrder[j]);
                                }
                            }
                            model.com.getEXCAndonAll({ShiftID: NowTime}, function (res2) {
                                wEXCAndonAllmm = [];
                                wStartTime = $com.util.format("yyyy-MM-dd", new Date());
                                for (var i = 0; i < res2.list.length; i++) {
                                    if (wStartTime == $com.util.format("yyyy-MM-dd", res2.list[i].CreateTime)) {
                                        wEXCAndonAllmm.push(res2.list[i]);
                                    }
                                }
                                model.com.getAPSTaskPart({}, function (resPart) {
                                    mAPSTaskPart = resPart.list;
                                    sTimeNcr = $com.util.format("yyyy-MM-dd", new Date().getTime());
                                    ETimeNcr = $com.util.format("yyyy-MM-dd", new Date().getTime() + 24 * 3600 * 1000);
                                    model.com.getTimeAll({
                                        StartTime: sTimeNcr,
                                        EndTime: ETimeNcr,
                                        OrderID: -1,
                                        CustomerID: -1,
                                        LineID: -1,
                                        StationID: -1,
                                        SenderID: -1,
                                        Level: -1,
                                        StatusIDList: [],
                                        CarNumber: "",
                                        CarTypeID: -1,
                                    }, function (resNcr) {
                                        mNcrArray = resNcr.list;
                                        AllDateNum = [{
                                            AnnualNum: mArrayAll.length,  //全年修竣
                                            AnnualC5Num: mArrayC5.length, //全年C5修竣
                                            AnnualC6Num: mArrayC6.length, //全年C6修竣
                                            ThisMonthNum: mArrayMAll.length, //本月修竣
                                            LocoCar: mArrayMZC.length, //在场机车
                                            RepairCar: mArrayMZX.length, //在修机车
                                            stationTask: mAPSTaskPart.length, //工位待完工任务
                                            ExcTask: wEXCAndonAllmm.length, //今日异常记录
                                            ncrTask: mNcrArray.length, //今日不合格评审数
                                        }];
                                        $(".lmvt-excPlace-bodyGK").html($com.util.template(AllDateNum, HTML.TableGK));

                                        $(".lmvt-excPlace-bodyGKTwo").html($com.util.template(AllDateNum, HTML.TableGKTwo));
                                    });
                                });
                            });
                        });
                    });
                });

                setTimeout(function () {
                    model.com.Order();
                }, 20000);
            },
            Storehouse: function () {
                //台位配置
                model.com.getFPCProductPlace({Active: -1, ProductID: 0, PartID: 0, PlaceType: -1}, function (resP) {
                    if (!resP)
                        return;
                    if (resP && resP.list) {
                        DATABasic = $com.util.Clone(resP.list);
                        DataPartNo = [];
                        for (var i = 0; i < DATABasic.length; i++) {
                            if (DATABasic[i].PartNo != "") {
                                DataPartNo.push(DATABasic[i]);
                            }
                        }
                        if (DataPartNo.length == 0) {
                            wPartNoArray = [];
                            model.com.getStoreHouseList({ID: -1, Active: -1}, function (res) {
                                if (res && res.list) {
                                    mData = $com.util.Clone(res.list);
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getRain").html($com.util.template(model.com.RenderData("淋雨"), HTML.TablePositionOne));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC32").html($com.util.template(model.com.RenderData("C32"), HTML.TablePositionOne));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC31").html($com.util.template(model.com.RenderData("C31"), HTML.TablePositionOne));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC30").html($com.util.template(model.com.RenderData("C30"), HTML.TablePositionOne));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC29").html($com.util.template(model.com.RenderData("C29"), HTML.TablePositionOne));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC28").html($com.util.template(model.com.RenderData("C28"), HTML.TablePositionOne));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC27").html($com.util.template(model.com.RenderData("C27"), HTML.TablePositionOne));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC26").html($com.util.template(model.com.RenderData("C26"), HTML.TablePositionOne));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC25").html($com.util.template(model.com.RenderData("C25"), HTML.TablePositionOne));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC24").html($com.util.template(model.com.RenderData("C24"), HTML.TablePositionOne));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC23").html($com.util.template(model.com.RenderData("C23"), HTML.TablePositionOne));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC22").html($com.util.template(model.com.RenderData("C22"), HTML.TablePositionOne));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC21").html($com.util.template(model.com.RenderData("C21"), HTML.TablePositionOne));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC20").html($com.util.template(model.com.RenderData("C20"), HTML.TablePositionOne));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC19").html($com.util.template(model.com.RenderData("C19"), HTML.TablePositionOne));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC18").html($com.util.template(model.com.RenderData("C18"), HTML.TablePositionOne));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC17").html($com.util.template(model.com.RenderData("C17"), HTML.TablePositionOne));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC16").html($com.util.template(model.com.RenderData("C16"), HTML.TablePositionOne));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC15").html($com.util.template(model.com.RenderData("C15"), HTML.TablePositionOne));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC14").html($com.util.template(model.com.RenderData("C14"), HTML.TablePositionOne));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC13").html($com.util.template(model.com.RenderData("C13"), HTML.TablePositionOne));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC12").html($com.util.template(model.com.RenderData("C12"), HTML.TablePositionOne));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC11").html($com.util.template(model.com.RenderData("C11"), HTML.TablePositionOne));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC10").html($com.util.template(model.com.RenderData("C10"), HTML.TablePositionOne));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC9").html($com.util.template(model.com.RenderData("C9"), HTML.TablePositionOne));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC8").html($com.util.template(model.com.RenderData("C8"), HTML.TablePositionOne));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC7").html($com.util.template(model.com.RenderData("C7"), HTML.TablePositionOne));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC6").html($com.util.template(model.com.RenderData("C6"), HTML.TablePositionOne));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC5").html($com.util.template(model.com.RenderData("C5"), HTML.TablePositionOne));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC4").html($com.util.template(model.com.RenderData("C4"), HTML.TablePositionOne));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC3").html($com.util.template(model.com.RenderData("C3"), HTML.TablePositionOne));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC2").html($com.util.template(model.com.RenderData("C2"), HTML.TablePositionOne));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC1").html($com.util.template(model.com.RenderData("C1"), HTML.TablePositionOne));

                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getB7").html($com.util.template(model.com.RenderDataTwo("B7"), HTML.TablePositionTwo));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getB6").html($com.util.template(model.com.RenderDataTwo("B6"), HTML.TablePositionTwo));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getB5").html($com.util.template(model.com.RenderDataTwo("B5"), HTML.TablePositionTwo));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getB4").html($com.util.template(model.com.RenderDataTwo("B4"), HTML.TablePositionTwo));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getB3").html($com.util.template(model.com.RenderDataTwo("B3"), HTML.TablePositionTwo));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getB2").html($com.util.template(model.com.RenderDataTwo("B2"), HTML.TablePositionTwo));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getB1").html($com.util.template(model.com.RenderDataTwo("B1"), HTML.TablePositionTwo));

                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getA7").html($com.util.template(model.com.RenderDataTwo("A7"), HTML.TablePositionTwo));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getA6").html($com.util.template(model.com.RenderDataTwo("A6"), HTML.TablePositionTwo));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getA5").html($com.util.template(model.com.RenderDataTwo("A5"), HTML.TablePositionTwo));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getA4").html($com.util.template(model.com.RenderDataTwo("A4"), HTML.TablePositionTwo));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getA3").html($com.util.template(model.com.RenderDataTwo("A3"), HTML.TablePositionTwo));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getA2").html($com.util.template(model.com.RenderDataTwo("A2"), HTML.TablePositionTwo));
                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getA1").html($com.util.template(model.com.RenderDataTwo("A1"), HTML.TablePositionTwo));

                                    $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getFactoryline").html($com.util.template(model.com.RenderDataTwo("J12"), HTML.TablePositionTwo));

                                    // $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC32  td div").css("background-color","#C51D1D");

                                    // $("#event .lmvt-exc-contain .femi-tb-scroll tbody tr").each(function (i, item) {
                                    //     var $this = $(item);
                                    //     $this.find("td:nth-child(1) div").css("background-color", "#C51D1D" );
                                    // });
                                    //台位上的车字滚动
                                    if (IsTrue) {
                                        model.com.FontRoll();
                                        IsTrue = false;
                                    }

                                }
                            });
                        } else {
                            model.com.getPartNoStatus({
                                data: DataPartNo,
                            }, function (resPartNO) {
                                wPartNoArray = resPartNO.list;
                                //库位配置
                                model.com.getStoreHouseList({ID: -1, Active: -1}, function (res) {
                                    if (res && res.list) {
                                        mData = $com.util.Clone(res.list);
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getRain").html($com.util.template(model.com.RenderData("淋雨"), HTML.TablePositionOne));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC32").html($com.util.template(model.com.RenderData("C32"), HTML.TablePositionOne));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC31").html($com.util.template(model.com.RenderData("C31"), HTML.TablePositionOne));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC30").html($com.util.template(model.com.RenderData("C30"), HTML.TablePositionOne));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC29").html($com.util.template(model.com.RenderData("C29"), HTML.TablePositionOne));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC28").html($com.util.template(model.com.RenderData("C28"), HTML.TablePositionOne));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC27").html($com.util.template(model.com.RenderData("C27"), HTML.TablePositionOne));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC26").html($com.util.template(model.com.RenderData("C26"), HTML.TablePositionOne));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC25").html($com.util.template(model.com.RenderData("C25"), HTML.TablePositionOne));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC24").html($com.util.template(model.com.RenderData("C24"), HTML.TablePositionOne));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC23").html($com.util.template(model.com.RenderData("C23"), HTML.TablePositionOne));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC22").html($com.util.template(model.com.RenderData("C22"), HTML.TablePositionOne));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC21").html($com.util.template(model.com.RenderData("C21"), HTML.TablePositionOne));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC20").html($com.util.template(model.com.RenderData("C20"), HTML.TablePositionOne));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC19").html($com.util.template(model.com.RenderData("C19"), HTML.TablePositionOne));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC18").html($com.util.template(model.com.RenderData("C18"), HTML.TablePositionOne));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC17").html($com.util.template(model.com.RenderData("C17"), HTML.TablePositionOne));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC16").html($com.util.template(model.com.RenderData("C16"), HTML.TablePositionOne));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC15").html($com.util.template(model.com.RenderData("C15"), HTML.TablePositionOne));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC14").html($com.util.template(model.com.RenderData("C14"), HTML.TablePositionOne));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC13").html($com.util.template(model.com.RenderData("C13"), HTML.TablePositionOne));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC12").html($com.util.template(model.com.RenderData("C12"), HTML.TablePositionOne));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC11").html($com.util.template(model.com.RenderData("C11"), HTML.TablePositionOne));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC10").html($com.util.template(model.com.RenderData("C10"), HTML.TablePositionOne));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC9").html($com.util.template(model.com.RenderData("C9"), HTML.TablePositionOne));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC8").html($com.util.template(model.com.RenderData("C8"), HTML.TablePositionOne));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC7").html($com.util.template(model.com.RenderData("C7"), HTML.TablePositionOne));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC6").html($com.util.template(model.com.RenderData("C6"), HTML.TablePositionOne));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC5").html($com.util.template(model.com.RenderData("C5"), HTML.TablePositionOne));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC4").html($com.util.template(model.com.RenderData("C4"), HTML.TablePositionOne));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC3").html($com.util.template(model.com.RenderData("C3"), HTML.TablePositionOne));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC2").html($com.util.template(model.com.RenderData("C2"), HTML.TablePositionOne));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC1").html($com.util.template(model.com.RenderData("C1"), HTML.TablePositionOne));

                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getB7").html($com.util.template(model.com.RenderDataTwo("B7"), HTML.TablePositionTwo));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getB6").html($com.util.template(model.com.RenderDataTwo("B6"), HTML.TablePositionTwo));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getB5").html($com.util.template(model.com.RenderDataTwo("B5"), HTML.TablePositionTwo));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getB4").html($com.util.template(model.com.RenderDataTwo("B4"), HTML.TablePositionTwo));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getB3").html($com.util.template(model.com.RenderDataTwo("B3"), HTML.TablePositionTwo));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getB2").html($com.util.template(model.com.RenderDataTwo("B2"), HTML.TablePositionTwo));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getB1").html($com.util.template(model.com.RenderDataTwo("B1"), HTML.TablePositionTwo));

                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getA7").html($com.util.template(model.com.RenderDataTwo("A7"), HTML.TablePositionTwo));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getA6").html($com.util.template(model.com.RenderDataTwo("A6"), HTML.TablePositionTwo));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getA5").html($com.util.template(model.com.RenderDataTwo("A5"), HTML.TablePositionTwo));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getA4").html($com.util.template(model.com.RenderDataTwo("A4"), HTML.TablePositionTwo));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getA3").html($com.util.template(model.com.RenderDataTwo("A3"), HTML.TablePositionTwo));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getA2").html($com.util.template(model.com.RenderDataTwo("A2"), HTML.TablePositionTwo));
                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getA1").html($com.util.template(model.com.RenderDataTwo("A1"), HTML.TablePositionTwo));

                                        $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getFactoryline").html($com.util.template(model.com.RenderDataTwo("J12"), HTML.TablePositionTwo));

                                        // $("#event .lmvt-exc-contain .femi-tb-scroll tbody .getC32  td div").css("background-color","#C51D1D");

                                        // $("#event .lmvt-exc-contain .femi-tb-scroll tbody tr").each(function (i, item) {
                                        //     var $this = $(item);
                                        //     $this.find("td:nth-child(1) div").css("background-color", "#C51D1D" );
                                        // });
                                        //台位上的车字滚动
                                        if (IsTrue) {
                                            model.com.FontRoll();
                                            IsTrue = false;
                                        }

                                    }
                                });
                            });
                        }
                    }

                });
            },
            FontRoll: function () {
                //  根据id获取所对应的div,document意思是去整个html文档中找，getElementById是根据ID
                var tag = $('.roll');
                $('.roll').each(function (i, item) {
                    var $item = $(item);
                    var content = $item.text();
                    var z = content.charAt(0);
                    var l = content.substring(1, content.length);
                    var new_content = l + z;
                    $item.text(new_content);
                });
                //拿到div中的文本，注意innertext方法没有括弧
                //   var content = tag.text();
                //获取它这个字符串的第一个文字
                //   var z =content.charAt(0);
                //获取这个文本除第一个字以外的文本，用substring给它起始位置
                //   var  l = content.substring(1,content.length)
                //把第一个字符放到最后一位拼接起来
                //   var new_content = l+z
                //用新生成new_content把div中的文本替换掉
                //   tag.innerText = new_content
                // tag.text(new_content);


                setTimeout(function () {
                    model.com.FontRoll();
                }, 2000);

            },
            // function f() {
            //        //根据id获取所对应的div,document意思是去整个html文档中找，getElementById是根据ID
            //              var tag = document.getElementById('i1')
            //           //拿到div中的文本，注意innertext方法没有括弧
            //           var content = tag.innerText
            //           //获取它这个字符串的第一个文字
            //           var z =content.charAt(0)
            //           //获取这个文本除第一个字以外的文本，用substring给它起始位置
            //           var  l = content.substring(1,content.length)
            //           //把第一个字符放到最后一位拼接起来
            //           var new_content = l+z
            //           //用新生成new_content把div中的文本替换掉
            //           tag.innerText = new_content
            //       }
            //       //setInterval是个定时器，第一个参数是要执行的内容，第二个参数是执行间隔，单位为毫秒
            //       setInterval('f()',100)
            refreshBGC: function () {
                model.com.getEXCAndonAll({ShiftID: 0}, function (res) {
                    mAndonBGC = res.list;
                    model.com.GetTask({StartTime: StartTime, EndTime: EndTime}, function (res) {
                        if (res.msg) {
                            alert(res.msg);
                            return false;
                        }
                        if (res && res.list) {
                            moveTask = [];
                            for (var i = 0; i < res.list.length; i++) {
                                res.list[i].PartNo = res.list[i].CarType + "#" + res.list[i].PartNo;
                                if (res.list[i].Status == 1 || res.list[i].Status == 2 || res.list[i].Status == 3 || res.list[i].Status == 4) {
                                    res.list[i].PartNo = res.list[i].PartNo.substring(3);
                                    moveTask.push(res.list[i]);
                                }
                            }
                            MoveDataList = $com.util.Clone(moveTask);
                            //C1-淋雨数据渲染
                            model.com.Storehouse();
                        }
                    });
                });

                setTimeout(function () {
                    model.com.refreshBGC();
                }, 30000);
            },

            //计算库位中台位数量并渲染数据 C1-淋雨
            RenderData: function (Name) {
                mTablePosition = [];
                //库位匹配
                positionArray = [];
                for (var i = 0; i < mData.length; i++) {
                    if (mData[i].Name == Name) {
                        positionArray.push(mData[i]);
                        for (var j = 0; j < DATABasic.length; j++) {
                            if (mData[i].ID == DATABasic[j].ParentID) {
                                //库位对应的台位
                                DATABasic[j].PartNo = DATABasic[j].PartNo.substring(3);
                                mTablePosition.push(DATABasic[j]);
                                Temp.ParentName = Name;
                            }
                        }
                        mTablePosition = mTablePosition.sort(function (a, b) {
                            return a.OrderID < b.OrderID ? 1 : -1;
                        });
                        if (mTablePosition.length <= 2) {
                            $.each(mTablePosition, function (i, item) {

                                var temp = true;
                                item.Color = "transparent";
                                if (item.PartNo != "") {
                                    item.Color = "transparent";
                                    //   Num= CheckStringChinese(item.PartNo);
                                    var reg = /[\u4e00-\u9fa5]+/.test(item.PartNo);
                                    if (reg) {
                                        item.Class = "roll";
                                    }
                                }
                                //异常
                                $.each(mAndonBGC, function (j, jtem) {
                                    if (temp) {
                                        if (jtem.PlaceID == item.ID) {
                                            item.Color = "#FF0000";
                                            temp = false;
                                        }
                                    }
                                });
                                //工位待完工任务  status 4 开工 5完工
                                $.each(wPartNoArray, function (m, mtem) {
                                    if (temp) {
                                        if (mtem.Status == 4 && mtem.ID == item.ID) {
                                            item.Color = "#009900";
                                            temp = false;
                                        }
                                    }
                                });
                                //移车 PlaceID起始台位   TargetID目标台位
                                $.each(MoveDataList, function (k, ktem) {
                                    if (temp) {
                                        if (ktem.PlaceID == item.ID) {
                                            item.Color = "#cc3399";
                                            item.PartNo = ktem.PartNo;
                                            temp = false;
                                        }
                                        if (ktem.TargetID == item.ID) {
                                            item.Color = "#FF9933";
                                            item.PartNo = ktem.PartNo;
                                            temp = false;
                                        }
                                    }
                                });
                                //工位待完工任务  status 4 开工 5完工
                                $.each(wPartNoArray, function (m, mtem) {
                                    if (temp) {
                                        if (mtem.TargetID == 5 && mtem.ID == item.ID) {
                                            item.Color = "#00CCFF";
                                            temp = false;
                                        }
                                    }
                                });

                            });
                            Temp.Item = $com.util.template(mTablePosition, HTML.TablePositionTd);
                            return Temp;
                        } else {
                            //异常
                            $.each(mTablePosition, function (i, item) {
                                var temp = true;
                                item.Color = "transparent";
                                if (item.PartNo != "") {
                                    item.Color = "transparent";
                                    var reg = /[\u4e00-\u9fa5]+/.test(item.PartNo);
                                    if (reg) {
                                        item.Class = "roll";
                                    }
                                }
                                $.each(mAndonBGC, function (j, jtem) {
                                    if (temp) {
                                        if (jtem.PlaceID == item.ID) {
                                            item.Color = "#FF0000";
                                            temp = false;
                                        }
                                    }
                                });
                                //工位待完工任务  status 4 开工 5完工
                                $.each(wPartNoArray, function (m, mtem) {
                                    if (temp) {
                                        if (mtem.Status == 4 && mtem.ID == item.ID) {
                                            item.Color = "#009900";
                                            temp = false;
                                        }
                                    }
                                });
                                //移车 PlaceID起始台位   TargetID目标台位
                                $.each(MoveDataList, function (k, ktem) {
                                    if (temp) {
                                        if (ktem.PlaceID == item.ID) {
                                            item.Color = "#cc3399";
                                            item.PartNo = ktem.PartNo;
                                            temp = false;
                                        }
                                        if (ktem.TargetID == item.ID) {
                                            item.Color = "#FF9933";
                                            item.PartNo = ktem.PartNo;
                                            temp = false;
                                        }
                                    }
                                });
                                //工位待完工任务  status 4 开工 5完工
                                $.each(wPartNoArray, function (m, mtem) {
                                    if (temp) {
                                        if (mtem.TargetID == 5 && mtem.ID == item.ID) {
                                            item.Color = "#00CCFF";
                                            temp = false;
                                        }
                                    }
                                });
                            });
                            Temp.Item = $com.util.template(mTablePosition, HTML.TablePositionTd_C27);
                            return Temp;
                        }

                    }
                }
                if (positionArray.length == 0) {
                    Temp = {
                        Item: "",
                        ParentName: Name,
                    };
                    return Temp;
                }
            },

            //计算库位中台位数量并渲染数据 A1-A7 B1-B7
            RenderDataTwo: function (Name) {
                mTablePosition = [];

                if (Name == "J12" || Name == "J55") {
                    Temp.ParentName = "厂线";
                } else {
                    Temp.ParentName = Name;
                }
                for (var i = 0; i < mData.length; i++) {
                    if (mData[i].Name == Name) {
                        for (var j = 0; j < DATABasic.length; j++) {
                            if (mData[i].ID == DATABasic[j].ParentID) {
                                //库位对应的台位
                                DATABasic[j].PartNo = DATABasic[j].PartNo.substring(3);
                                mTablePosition.push(DATABasic[j]);
                            }
                        }
                        mTablePosition = mTablePosition.sort(function (a, b) {
                            return a.OrderID > b.OrderID ? 1 : -1;
                        });
                        $.each(mTablePosition, function (i, item) {
                            var temp = true;
                            item.Color = "transparent";
                            if (item.PartNo != "") {
                                item.Color = "transparent";
                                var reg = /[\u4e00-\u9fa5]+/.test(item.PartNo);
                                if (reg) {
                                    item.Class = "roll";
                                }
                            }
                            $.each(mAndonBGC, function (j, jtem) {
                                if (temp) {
                                    if (jtem.PlaceID == item.ID) {
                                        item.Color = "#FF0000";
                                        temp = false;
                                    }
                                }
                            });
                            //工位待完工任务  status 4 开工 5完工
                            $.each(wPartNoArray, function (m, mtem) {
                                if (temp) {
                                    if (mtem.Status == 4 && mtem.ID == item.ID) {
                                        item.Color = "#009900";
                                        temp = false;
                                    }
                                }
                            });
                            //移车 PlaceID起始台位   TargetID目标台位
                            $.each(MoveDataList, function (k, ktem) {
                                if (temp) {
                                    if (ktem.PlaceID == item.ID) {
                                        item.Color = "#cc3399";
                                        item.PartNo = ktem.PartNo;
                                        temp = false;
                                    }
                                    if (ktem.TargetID == item.ID) {
                                        item.Color = "#FF9933";
                                        item.PartNo = ktem.PartNo;
                                        temp = false;
                                    }
                                }
                            });
                            //工位待完工任务  status 4 开工 5完工
                            $.each(wPartNoArray, function (m, mtem) {
                                if (temp) {
                                    if (mtem.TargetID == 5 && mtem.ID == item.ID) {
                                        item.Color = "#00CCFF";
                                        temp = false;
                                    }
                                }
                            });
                        });
                        Temp.Item = $com.util.template(mTablePosition, HTML.TablePositionTwoTd);
                        return Temp;
                    }
                }
                if (mTablePosition.length == 0) {
                    Temp = {
                        Item: "",
                        ParentName: Name,
                    };
                    return Temp;
                }
            },

        },
    });

    model.init();
});
