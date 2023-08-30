require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($zace, $com) {

    var KEYWORD,
        KEYWORD_LIST,
        model,
        DEFAULT_VALUE,
        TypeSource,
        DataAll,
        FORMATTRT,
        model1,
        model2,
        model3,
        ExcT,
        Empty,
        LevelColor,
        NewArrayPlace,
        ExcZaOne,
        modelEmployee,
        HTML;
    var WID = 0;
    var FreePlaceNum = 0;
    var mbool = true;
    var iSetTime = true;
    var IsStart = false;
    ExcZaOne = [];
    NewArrayPlace = [];
    modelPlaceName = {};
    LevelExcList = [];
    TempPlace = {
        ID: 0,
        PlaceID: 0,
        PlaceName: "",
        ExcNum: 0,

    };
    TempModel = {
        ID: 0,
        PlaceID: 0,
        StationCode: "",
        Active: 0,
        Num: "-",
        ActiveText: "空闲",
        OperatorName: "-",
        OperatorID: 0,
        CarNo: "-",
        Type: "-",
        Level: "-",
        ResponseLevel: "-",
        RepireTime: "-",
        ExcTime: "-",
        Name: "-",
        EditName: "",
        Editor: 0,
    };
    var RefreshTime = 20000;
    var SumTime = 20000;
    var index = 0;
    var num = 0;
    var rightPage = 0;

    ChangeBg = true;
    bgColorMode = true;
    bgColor = ["#DEDEDE", "#F5B128", "#EB3B3B", "#C51D1D"];

    LevelColor = ["无", "A", "B", "C", "D"];

    ZaceEmpty = ['<div class="lmvt-exc-div-count-div" style="float:left;width:15vw;height:6vh;margin:0.2vh 0.1vw">',

        '<div class="lmvt-exc-div-count-div" style="float:left;width:7vw;height:6vh;margin:0.2vh 0.1vw;line-height:6vh;text-align: center;background-color: #26A82F;overflow-x:auto;color:#C51D1D;font-size:2vh">',
        '等级：{{ExcLevel}}',


        '</div>',
        '<div class="lmvt-exc-div-count-div" style="float:left;width:7vw;height:6vh;margin:0.2vh 0.1vw;line-height:6vh;text-align: center;background-color: #26A82F;overflow-x:auto;color:#C51D1D;font-size:2vh">',
        '数量：{{ExcNum}}',


        '</div>',

        '</div>',
    ].join("");
    Empty = ['<div class="lmvt-exc-div-count-div" style="float:left;width:7vw;height:3vw;margin:0.1vw;line-height:3vw;text-align: center;background-color: #26A82F;overflow-x:auto">{{Name}}</div>',
    ].join("");
    Exc = ['<div class="lmvt-exc-div-count-div" style="float:left;width:7vw;height:3vw;margin:0.1vw;line-height:3vw;text-align: center;background-color:{{Color}};overflow-x:auto">{{Name}}</div>',
    ].join("");

    //底色  警告事件（黄色）  严重问题（橘红） 紧急问题（深红）
    colorList = ["#193A6B", "#F5B128", "#EB3B3B", "#C51D1D"];
    model1 = "<div class='text1' style='height:3.5vh;width:100%;text-align:center;line-height:3.5vh;overflow-x:auto'> </div>"
        + "<div style='height:4.5vh;width:100%;display:inline-block;text-align:center;vertical-align:middle;'>"
        + "<img src='../static/images/GZImg/store.jpg'  style='border-radius:50%; overflow:hidden'/>"
        + "</div>"
        + "<div  class='text2' style='height:3.5vh;width:100%;text-align:center;line-height:3.5vh;overflow-x:auto'>"

        + "</div>"

        + "<div  class='text3' style='height:3.5vh;width:100%;text-align:center;line-height:3.5vh;overflow-x:auto'>"

        + "</div>";


    model2 = "<div class='text1' style='height:5.5vh;width:100%;text-align:center;line-height:5.5vh;overflow-x:auto;'> </div>"
        + "<div style='height:4.5vh;width:100%;display:inline-block;text-align:center;vertical-align:middle'>"
        + "<img src='../static/images/GZImg/store.jpg' style='border-radius:50%; overflow:hidden'/>"
        + "</div>"
        + "<div  class='text2' style='height:5vh;width:100%;text-align:center;line-height:5vh;overflow-x:auto'>"

        + "</div>";

    model3 = "<div class='text1' style='height:3vh;width:100%;text-align:center;line-height:3vh;overflow-x:auto;top: 6vh;position: absolute'> </div>";

    HTML = {
        TableUserItemNode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',

            '</tr>',
        ].join(""),

        EmptyNode: [
            '<tr>',
            '<td data-title="ExcLevel" data-value="{{ExcLevel}}" >{{ExcLevel}}</td>',
            '<td data-title="ExcNum" data-value="{{ExcNum}}" >{{ExcNum}}</td>',

            '</tr>',
        ].join(""),
        PlaceNode: [
            '<tr>',
            '<td data-title="PlaceName" data-value="{{PlaceName}}" >{{PlaceName}}</td>',
            '<td data-title="ExcNum" data-value="{{ExcNum}}" >{{ExcNum}}</td>',

            '</tr>',
        ].join(""),

    };


    FORMATTRT = {};
    DataAll = [];
    KEYWORD = {};
    DEFAULT_VALUE = {};
    TypeSource = {};

    $.each(KEYWORD_LIST, function (i, item) {
        var detail = item.split("|");
        KEYWORD[detail[0]] = {
            index: i,
            name: detail[1],
            type: detail.length > 2 ? detail[2] : undefined,
            control: detail.length > 3 ? detail[3] : undefined,
        };
        if (detail.length > 2) {
            FORMATTRT[detail[0]] = $com.util.getFormatter(TypeSource, detail[0], detail[2]);
        }
    });
    model = $com.Model.create({
        name: '移车台大屏',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {

            //换背景
            $("body").delegate("#DivChange", "click", function () {

                //alert(1);
                if (ChangeBg) {

                    $("#event")[0].style.backgroundImage = "url(../static/images/GZImg/bglLight.png)";
                    $(".ShowLogo").show();
                    $("#event")[0].style.color = "black";
                    $("#Div1Title")[0].style.color = "white";

                    $(".zace-colorBg").css("background-color", "#e9f4ff");
                    $(".zace-colorHead").css("background-color", "#ABCCEC");

                    // $(".TDTable thead").css("background-color", "orange");
                    // $(".TDTable tbody tr:nth-child(even)").css("background-color", "#ffc800")      
                    ChangeBg = false;
                    //bgColorMode = true;
                    model.com.refresh();
                } else {

                    $("#event")[0].style.backgroundImage = "url(../static/images/GZImg/bgL.png)";
                    $(".ShowLogo").hide();
                    $("#event")[0].style.color = "white";
                    // $("#Div1Title")[0].style.color = "white";

                    $(".zace-colorBg").css("background-color", "#1C3771");
                    $(".zace-colorHead").css("background-color", "#0E4477");

                    // $(".TDTable thead").css("background-color", "#0E4477");
                    // $(".TDTable tbody tr:nth-child(even)").css("background-color", "#1C3771")               


                    ChangeBg = true;
                    //bgColorMode = false;
                    model.com.refresh();
                }

            });

            $("body").delegate("#Div1ID", "click", function () {

                alert(1);
            });


        },

        run: function () {
            iSetTime = true;
            num = 0;
            index = 0;
            rightPage = 0;
            //调用接口刷新数据
            model.com.refreshPage();

            //数据渲染表格
            model.com.setRandomTable();
        },

        com: {
            refreshPage: function () {
                // $(".TDTable thead").css("background-color", "#0E4477");
                // $(".TDTable tbody tr:nth-child(even)").css("background-color", "#1C3771");
                var arry = ["Name", "CarNo", "Type", "ResponseLevel", "ExcTime", "OperatorName", "EditName"];
                ExcT = $com.util.randerTemplateZace(arry);

                model.com.getEmployee({
                    Active: -1,
                }, function (data) {
                    model._user = data.list;
                    modelEmployee = {};

                    $.each(model._user, function (i, item) {
                        modelEmployee[item.ID] = "【" + item.Department + "】" + item.Name;
                    });

                    model.com.getPlaceMode({Active: -1, ProductID: 0, PartID: 0, PlaceType: 1}, function (res1) {

                        //台位信息
                        _placeList = [];
                        $.each(res1.list, function (i, item) {
                            // if (item.Active == 1&&item.ID<=16) {
                            if (item.Active == 1) {//所有激活台位
                                _placeList.push(item);
                            }
                        });


                        ExcAll = [];//异常数据
                        model.com.getEXCAndonAll({
                            ShiftID: 0,
                        }, function (resExc) {
                            var _list = resExc.list;
                            for (var i = 0; i < _list.length; i++) {
                                if (_list[i].Status != 6 && _list[i].Status != 9) {
                                    ExcAll.push(_list[i]);

                                }
                            }
                            IsStart = true;


                            mbool = true;
                            model.com.refresh();
                        });
                    });
                });
            },
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

                    mbool = false;
                    //  setTimeout(function () {
                    //         model.com.refreshPage();

                    // }, 20000);

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
            refresh: function () {
                // //数据刷新初始化变量
                // index=0;
                // WID=0;
                //刷新之后重新开始   处理数据
                var SourceAll = [];
                //台位信息

                //按照编号排序
                // _placeList.sort(function (a, b) { return Number(a.Code) - Number(b.Code) });

                modelPlaceName = {};
                NewArrayPlace = [];

                $.each(_placeList, function (i, item) {
                    var _temp = $com.util.Clone(TempPlace);
                    modelPlaceName[item.ID] = item.Name;
                    _temp.ID = item.ID;
                    _temp.PlaceID = item.ID;
                    _temp.PlaceName = item.Name;
                    NewArrayPlace.push(_temp);
                });
                NewArrayPlace.push({
                    ID: 0,
                    PlaceID: 0,
                    PlaceName: "未绑台位",
                    ExcNum: 0,
                });

                // //异常数据唯一
                // var ExcZaOne = model.com.ProvideOnePlace(ExcAll);
                //异常数据与台位信息绑定 
                ExcZaOne = model.com.BindPlace(_placeList, ExcAll);

                num = Math.ceil(ExcZaOne.length / 16);   //每页显示16条数据
                //num = Math.ceil(ExcZaOne.length / 3);

                //根据异常等级  统计数量
                LevelExcList = [
                    {
                        ExcLevel: 'A',
                        ExcNum: 0,
                    },
                    {
                        ExcLevel: 'B',
                        ExcNum: 0,
                    },
                    {
                        ExcLevel: 'C',
                        ExcNum: 0,
                    }, {
                        ExcLevel: 'D',
                        ExcNum: 0,
                    }];
                for (var i = 0; i < ExcZaOne.length; i++) {

                    if (ExcZaOne[i].Level == 1) {
                        LevelExcList[0].ExcNum = LevelExcList[0].ExcNum + 1;

                    } else if (ExcZaOne[i].Level == 2) {
                        LevelExcList[1].ExcNum = LevelExcList[1].ExcNum + 1;


                    } else if (ExcZaOne[i].Level == 3) {
                        LevelExcList[2].ExcNum = LevelExcList[2].ExcNum + 1;

                    } else if (ExcZaOne[i].Level == 4) {
                        LevelExcList[3].ExcNum = LevelExcList[3].ExcNum + 1;
                    }
                }

                $(".lmvt-exc-bodyExc").html($com.util.template(LevelExcList, HTML.EmptyNode));

                for (var m = 0; m < NewArrayPlace.length; m++) {

                    for (var n = 0; n < ExcZaOne.length; n++) {
                        if (NewArrayPlace[m].PlaceID == ExcZaOne[n].PlaceID) {
                            NewArrayPlace[m].ExcNum += 1;
                        }
                    }

                }
                //减掉空闲台位的数量2020-06-10
                //NewArrayPlace[NewArrayPlace.length-1].ExcNum = NewArrayPlace[NewArrayPlace.length-1].ExcNum - FreePlaceNum;

                //删除无异常台位 06-10
                var _listZace = [];
                $.each(NewArrayPlace, function (i, item) {

                    if (item.ExcNum > 0) {
                        _listZace.push(item);
                    }

                });

                NewArrayPlace = $com.util.Clone(_listZace);


                rightPage = Math.ceil(NewArrayPlace.length / 5);//06-10  右边的page


                //刷新 台位异常数据
                // model.com.setRandomEXC(NewArrayPlace);

            },
            //定时刷新
            setRandomTable: function () {
                if (IsStart) {
                    //异常数据页数大于等于台位显示页数 num左边界面索引  WID右边索引
                    if (num >= rightPage) {
                        //一轮显示后刷新数据
                        if (index >= num) {
                            index = 0;
                            model.com.refreshPage();
                            // return false;
                        }

                        var SourceAll = [];
                        SourceAll = ExcZaOne.slice(index * 16, (index + 1) * 16);
                        $.each(SourceAll, function (i, item) {
                            //紧急
                            if (item.Level == 1) {
                                item.Color = "#C51D1D";

                            }
                            //严重
                            if (item.Level == 2) {
                                item.Color = "#EB3B3B";//F15353

                            }
                            //警告
                            if (item.Level == 3) {
                                item.Color = "#F5B128";

                            }
                            //警告
                            if (item.Level == 4) {
                                item.Color = "#1c7171";

                            }

                        });

                        //渲染异常数据界面
                        $(".lmvt-exc-body").html($com.util.template(SourceAll, ExcT));
                        index++;
                        $("#ShowPage").html(index + " / " + num);

                        if (WID >= rightPage) {
                            WID = 0;
                        }

                        var SourcePlace = [];
                        SourcePlace = NewArrayPlace.slice(WID * 5, (WID + 1) * 5);

                        $(".lmvt-excPlace-bodyExc").html($com.util.template(SourcePlace, HTML.PlaceNode));

                        WID++;


                    } else {
                        //一轮显示后刷新数据                    
                        if (WID >= rightPage) {
                            WID = 0;
                            model.com.refreshPage();
                            // return false;
                        }

                        var SourcePlace = [];
                        SourcePlace = NewArrayPlace.slice(WID * 5, (WID + 1) * 5);

                        $(".lmvt-excPlace-bodyExc").html($com.util.template(SourcePlace, HTML.PlaceNode));

                        WID++;


                        if (index >= num) {
                            index = 0;
                        }

                        var SourceAll = [];
                        SourceAll = ExcZaOne.slice(index * 16, (index + 1) * 16);
                        $.each(SourceAll, function (i, item) {
                            //紧急
                            if (item.Level == 1) {
                                item.Color = "#C51D1D";

                            }
                            //严重
                            if (item.Level == 2) {
                                item.Color = "#EB3B3B";//F15353

                            }
                            //警告
                            if (item.Level == 3) {
                                item.Color = "#F5B128";

                            }
                            //警告
                            if (item.Level == 4) {
                                item.Color = "#1c7171";

                            }

                        });

                        //渲染异常数据界面
                        $(".lmvt-exc-body").html($com.util.template(SourceAll, ExcT));
                        index++;
                        $("#ShowPage").html(index + " / " + num);

                    }
                } else if (!mbool) {

                    model.com.refreshPage();

                }
                setTimeout(model.com.setRandomTable, 20000);

            },
            //定时刷新
            setRandomEXC: function (NewArrayPlace) {
                //一轮显示后刷新数据
                if (WID == 4) {
                    WID = 0;
                }

                var SourceAll = [];
                SourceAll = NewArrayPlace.slice(WID * 5, (WID + 1) * 5);

                $(".lmvt-excPlace-bodyExc").html($com.util.template(SourceAll, HTML.PlaceNode));

                WID++;


                setTimeout(function () {
                    model.com.setRandomEXC(NewArrayPlace);

                }, 5000);

            },

            //台位异常等级去重
            ProvideOnePlace: function (data) {

                var temp = {};
                var arr = [];
                var len = data.length;

                //台位异常数据去重；
                for (var i = 0; i < len; i++) {
                    if (!temp[data[i].PlaceID]) {
                        temp[data[i].PlaceID] = "abc";
                        arr.push({
                            PlaceID: data[i].PlaceID,
                            ResponseLevel: LevelColor[data[i].ResponseLevel],
                            Level: data[i].ResponseLevel,
                            ExcTime: $com.util.format('yyyy-MM-dd hh:mm:ss', data[i].CreateTime),
                            CreatorID: data[i].CreatorID,
                            OperatorID: data[i].OperatorID,
                            RepireTime: $com.util.format('yyyy-MM-dd hh:mm:ss', data[i].EditTime),
                            Type: data[i].EXType,
                            Num: 0,
                            NumA: 0,
                            NumB: 0,
                            NumC: 0,
                            NumD: 0,


                        });
                    }
                }
                //arr  去重台位ID
                var _OneList = [];
                //根据时间  台位 异常等级排序
                for (var i = 0; i < data.length; i++) {
                    for (var j = 0; j < arr.length; j++) {
                        if (data[i].PlaceID == arr[j].PlaceID && (data[i].ResponseLevel < arr[j].Level)) {
                            // 默认按照发起先后时间排序了 ||(data[i].ResponseLevel == arr[j].Level&&$com.util.format('yyyy-MM-dd hh:mm:ss', data[i].CreateTime) < $com.util.format('yyyy-MM-dd hh:mm:ss', arr[j].ExcTime))


                            arr[j].Level = data[i].ResponseLevel;
                            arr[j].ResponseLevel = LevelColor[data[i].ResponseLevel];
                            arr[j].CreatorID = data[i].CreatorID;
                            arr[j].OperatorID = data[i].OperatorID;
                            arr[j].ExcTime = $com.util.format('yyyy-MM-dd hh:mm:ss', data[i].CreateTime);
                            arr[j].RepireTime = $com.util.format('yyyy-MM-dd hh:mm:ss', data[i].EditTime);
                            arr[j].Type = data[i].EXType;

                        }

                        if (data[i].PlaceID == arr[j].PlaceID) {
                            arr[j].Num += 1;
                            if (data[i].ResponseLevel == 1) {
                                arr[j].NumA += 1;
                            }
                            if (data[i].ResponseLevel == 2) {
                                arr[j].NumB += 1;
                            }
                            if (data[i].ResponseLevel == 3) {
                                arr[j].NumC += 1;
                            }
                            if (data[i].ResponseLevel == 4) {
                                arr[j].NumD += 1;
                            }


                        }
                    }
                }


                return arr;
            },

            //按照台位顺序显示异常信息
            BindPlace: function (placeList, ExcData) {
                var _list = []; //异常信息
                //初始化空闲台位数量
                FreePlaceNum = 0;
                //有台位的信息
                var _HavePlaceIDList = [];
                var _NoHavePlaceIDList = [];
                for (var i = 0; i < ExcData.length; i++) {
                    var _temp = $com.util.Clone(TempModel);

                    _temp.PlaceID = ExcData[i].PlaceID;
                    if (ExcData[i].PlaceID > 0) {
                        _temp.Name = modelPlaceName[ExcData[i].PlaceID];
                    } else {
                        _temp.Name = "-";
                    }
                    if (ExcData[i].CarName.length > 0) {

                        _temp.CarNo = ExcData[i].CarName;
                    }
                    _temp.OperatorID = ExcData[i].CreatorID;
                    _temp.OperatorName = modelEmployee[ExcData[i].CreatorID];
                    _temp.Editor = ExcData[i].OperatorID;
                    _temp.EditName = modelEmployee[ExcData[i].OperatorID];
                    _temp.Level = ExcData[i].ResponseLevel;
                    //_temp.StationCode=ExcData[i].StationCode;
                    _temp.ResponseLevel = LevelColor[ExcData[i].ResponseLevel];
                    _temp.ExcTime = $com.util.format('yyyy-MM-dd hh:mm:ss', ExcData[i].CreateTime);
                    _temp.RepireTime = $com.util.format('yyyy-MM-dd hh:mm:ss', ExcData[i].EditTime);
                    _temp.Type = ExcData[i].EXType;

                    _list.push(_temp);

                }


                //按照台位顺序显示异常信息
                for (var j = 0; j < placeList.length; j++) {
                    var bool = false;
                    for (var i = 0; i < _list.length; i++) {
                        if (placeList[j].ID == _list[i].PlaceID) {
                            bool = true;
                            _HavePlaceIDList.push(_list[i]);

                        }


                    }

                    //2020-06-10
                    // if (!bool) {
                    //     //空闲台位自增一
                    //     FreePlaceNum += 1;
                    //     //空闲台位   
                    //     var _tempNoPlace = $com.util.Clone(TempModel);
                    //     _tempNoPlace.PlaceID = 0;
                    //     _tempNoPlace.Name = placeList[j].Name;

                    //     if (placeList[j].PartNo.length > 0) {

                    //         _tempNoPlace.CarNo = placeList[j].PartNo;

                    //     }
                    //     _HavePlaceIDList.push(_tempNoPlace);


                    // }

                }


                //筛选异常无台位
                for (var m = 0; m < _list.length; m++) {
                    if (_list[m].PlaceID == 0) {

                        _HavePlaceIDList.push(_list[m]);

                    }

                }

                //
                return _HavePlaceIDList;


            },
            //refresh: function () {
            //    调用接口获取数据


            //    var EmptyArry = [],
            //        ExcArry = [];
            //    $.each(source, function (i, item) {


            //        if (item.Active == 0) {
            //            EmptyArry.push(item);
            //        }
            //        else {
            //            紧急
            //            if (item.Level == 3) {
            //                item.Color = "#C51D1D";

            //            }
            //            严重
            //            if (item.Level == 2) {
            //                item.Color = "#EB3B3B";//F15353

            //            }
            //            警告
            //            if (item.Level == 1) {
            //                item.Color = "#F5B128";

            //            }

            //            ExcArry.push(item);
            //        }


            //    });


            //    $(".lmvt-exc-body").html($com.util.template(source, ExcT));

            //    model.com.RanderEmptyRect(EmptyArry);
            //    model.com.RanderExcRect(ExcArry);
            //},
            //生成空闲矩形  //异常统计
            RanderEmptyRect: function (source) {
                $(".lmvt-exc-div-count-empty").html("");
                $.each(source, function (i, item) {
                    $(".lmvt-exc-div-count-empty").append($com.util.template(item, ZaceEmpty));
                });
            },
            //生成异常矩形
            RanderExcRect: function (source) {
                $(".lmvt-exc-div-count-exc").html("");
                $.each(source, function (i, item) {

                    //警告
                    if (item.Level == 3) {
                        item.Color = "#F5B128";
                        $(".lmvt-exc-div-count-exc").append($com.util.template(item, Exc));
                    }
                    //严重
                    if (item.Level == 2) {
                        item.Color = "#EB3B3B";
                        $(".lmvt-exc-div-count-exc").append($com.util.template(item, Exc));
                    }
                    //紧急
                    if (item.Level == 1) {
                        item.Color = "#C51D1D";
                        $(".lmvt-exc-div-count-exc").append($com.util.template(item, Exc));
                    }
                    //一般
                    if (item.Level == 4) {
                        item.Color = "#1c7171";
                        $(".lmvt-exc-div-count-exc").append($com.util.template(item, Exc));
                    }

                });
            },

            setRandom: function () {
                setTimeout(function () {
                    //调用接口获取数据

                    model.com.refresh();

                    model.com.setRandom();

                }, SumTime);

            },

        },
    });

    model.init();


});
