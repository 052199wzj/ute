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
        modelEmployee,
        HTML;
    LevelExcList = [];
    TempModel = {
        ID: 0,
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
    };
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
            '<td data-title="ID" data-value="{{ExcLevel}}" >{{ExcLevel}}</td>',
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

            // $(".TDTable thead").css("background-color", "#0E4477");
            // $(".TDTable tbody tr:nth-child(even)").css("background-color", "#1C3771");
            var arry = ["Name", "CarNo", "Num", "Type", "ResponseLevel", "ExcTime", "OperatorName", "EditName"];
            ExcT = $com.util.randerTemplateZace(arry);

            model.com.getEmployee({
                Active: -1,
            }, function (data) {
                model._user = data.list;
                modelEmployee = {};

                $.each(model._user, function (i, item) {
                    modelEmployee[item.ID] = item.Name;
                });

                model.com.refresh();
                model.com.setRandom();
            });
        },

        com: {
            getEmployee: function (data, fn, context) {
                var d = {
                    $URI: "/User/All",
                    $TYPE: "get",
                };

                function err() {
                    //$com.app.tip('获取人员信息失败，请检查网络');
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
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取当天的异常列表
            getEXCAndonAll: function (data, fn, context) {
                var d = {
                    $URI: "/EXCAndon/All",
                    $TYPE: "get",
                };

                function err() {
                    //$com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            refresh: function () {
                var SourceAll = [];
                //台位信息
                model.com.getPlaceMode({Active: -1, ProductID: 0, PartID: 0, PlaceType: 1}, function (res1) {
                    var _placeList = [];
                    $.each(res1.list, function (i, item) {
                        if (item.Active == 1) {
                            _placeList.push(item);
                        }
                    });
                    _placeList.sort(function (a, b) {
                        return Number(a.Code) - Number(b.Code);
                    });

                    for (var i = 0; i < _placeList.length; i++) {
                        var _temp = $com.util.Clone(TempModel);
                        _temp.ID = _placeList[i].ID;
                        _temp.Name = _placeList[i].Name;
                        _temp.CarNo = _placeList[i].PartNo;
                        SourceAll.push(_temp);
                    }

                    var ExcAll = [];//异常数据
                    model.com.getEXCAndonAll({
                        ShiftID: 0,
                    }, function (resExc) {
                        var _list = resExc.list;
                        for (var i = 0; i < _list.length; i++) {
                            if (_list[i].Status != 6 && _list[i].Status != 7 && _list[i].Status != 9) {
                                ExcAll.push(_list[i]);

                            }
                        }


                        //异常数据唯一
                        var ExcZaOne = model.com.ProvideOnePlace(ExcAll);
                        for (var i = 0; i < SourceAll.length; i++) {
                            for (var j = 0; j < ExcZaOne.length; j++) {

                                if (SourceAll[i].ID == ExcZaOne[j].PlaceID) {
                                    SourceAll[i].Level = ExcZaOne[j].Level;
                                    SourceAll[i].ResponseLevel = ExcZaOne[j].ResponseLevel;
                                    SourceAll[i].ActiveText = "检修中";
                                    SourceAll[i].Active = 1;
                                    SourceAll[i].OperatorName = modelEmployee[ExcZaOne[j].CreatorID];
                                    SourceAll[i].OperatorID = ExcZaOne[j].CreatorID;
                                    SourceAll[i].ExcTime = ExcZaOne[j].ExcTime;
                                    SourceAll[i].RepireTime = ExcZaOne[j].RepireTime;
                                    SourceAll[i].Type = ExcZaOne[j].Type;
                                    SourceAll[i].EditName = "";
                                    if (ExcZaOne[j].OperatorID.length > 0) {
                                        for (var index = 0; index < ExcZaOne[j].OperatorID.length; index++) {
                                            if (SourceAll[i].EditName.length < 1) {
                                                SourceAll[i].EditName = modelEmployee[ExcZaOne[j].OperatorID[index]];
                                            } else {

                                                SourceAll[i].EditName = SourceAll[i].EditName + "," + modelEmployee[ExcZaOne[j].OperatorID[index]];

                                            }

                                        }
                                    }
                                    SourceAll[i].Num = ExcZaOne[j].Num;

                                }
                            }

                        }

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
                        for (var index = 0; index < ExcZaOne.length; index++) {
                            LevelExcList[0].ExcNum = LevelExcList[0].ExcNum + ExcZaOne[index].NumA;
                            LevelExcList[1].ExcNum = LevelExcList[1].ExcNum + ExcZaOne[index].NumB;
                            LevelExcList[2].ExcNum = LevelExcList[2].ExcNum + ExcZaOne[index].NumC;
                            LevelExcList[3].ExcNum = LevelExcList[3].ExcNum + ExcZaOne[index].NumD;

                        }


                        var EmptyArry = [],
                            ExcArry = [];
                        $.each(SourceAll, function (i, item) {


                            if (item.Active == 0) {
                                EmptyArry.push(item);
                            } else {
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
                                ExcArry.push(item);
                            }


                        });


                        $(".lmvt-exc-body").html($com.util.template(SourceAll, ExcT));
                        // if (ChangeBg) {

                        //     $(".TDTable thead").css("background-color", "#0E4477");
                        //     $(".TDTable tbody tr:nth-child(even)").css("background-color", "#1C3771");     

                        // } else {
                        //     $(".TDTable thead").css("background-color", "#ABCCEC");
                        //     $(".TDTable tbody tr:nth-child(even)").css("background-color", "#e9f4ff");   
                        // }
                        //model.com.RanderEmptyRect(LevelExcList);
                        $(".lmvt-exc-bodyExc").html($com.util.template(LevelExcList, HTML.EmptyNode));
                        model.com.RanderExcRect(ExcArry);


                    });


                });


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
                }, 5000);

            },

        },
    });

    model.init();


});
