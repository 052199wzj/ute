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
        HTML;
    ChangeBg = true;
    bgColorMode = true;
    bgColor = ["#C51D1D", "#EB3B3B", "#F5B128", "#1c7171"];
    //底色  警告事件（黄色）  验证问题（橘红） 紧急问题（深红）
    colorList = ["#C51D1D", "#EB3B3B", "#F5B128", "#1c7171"];
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
    };

    source = [
        {
            id: 1,
            model: 3,
            img: 1,
            color: 1,
            text1: "组装台位4",
            text2: "1D0856",
            text3: "异常",
        }, {
            id: 2,
            model: 3,
            img: 1,
            color: 0,
            text1: "组装台位2",
            text2: "DO67890",
            text3: "异常",
        }, {
            id: 3,
            model: 3,
            img: 1,
            color: 0,
            text1: "组装台位1",
            text2: "DH67890",
            text3: "异常",
        }, {
            id: 4,
            model: 3,
            img: 1,
            color: 0,
            text1: "缓冲台位",
            text2: "3C0963",
            text3: "异常",
        }, {
            id: 5,
            model: 3,
            img: 1,
            color: 0,
            text1: "机车总成工位",
            text2: "1D0741",
            text3: "异常",
        }, {
            id: 6,
            model: 3,
            img: 1,
            color: 0,
            text1: "组装台位5",
            text2: "1D0333",
            text3: "异常",
        }, {
            id: 7,
            model: 3,
            img: 1,
            color: 3,
            text1: "组装台位3",
            text2: "1D0874",
            text3: "设备异常",
        }, {
            id: 8,
            model: 3,
            img: 1,
            color: 0,
            text1: "上体称重台位",
            text2: "1D0666",
            text3: "",
        }, {
            id: 9,
            model: 3,
            img: 1,
            color: 0,
            text1: "称重调簧工位",
            text2: "1D0963",
            text3: "异常",
        }, {
            id: 10,
            model: 3,
            img: 1,
            color: 0,
            text1: "缓冲台位",
            text2: "3C0636",
            text3: "异常",
        }, {
            id: 11,
            model: 3,
            img: 1,
            color: 0,
            text1: "组装台位6",
            text2: "DF67890",
            text3: "异常",
        }, {
            id: 12,
            model: 3,
            img: 1,
            color: 0,
            text1: "组装台位8",
            text2: "DR67890",
            text3: "异常",
        }, {
            id: 13,
            model: 3,
            img: 2,
            color: 2,
            text1: "组装台位10",
            text2: "3C0636",
            text3: "人员异常",
        }, {
            id: 14,
            model: 3,
            img: 1,
            color: 0,
            text1: "组装台位7",
            text2: "1D0363",
            text3: "异常",
        }, {
            id: 15,
            model: 3,
            img: 2,
            color: 3,
            text1: "组装台位9",
            text2: "1D0369",
            text3: "工艺异常",
        }, {
            id: 16,
            model: 3,
            img: 1,
            color: 0,
            text1: "组装台位11",
            text2: "3C0745",
            text3: "异常",
        },
    ];

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
        name: '看板Test',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();
        },

        events: function () {
            //换背景
            $("body").delegate("#DivChange", "click", function () {
                if (ChangeBg) {
                    $("#event")[0].style.backgroundImage = "url(../static/images/GZImg/light1.png)";
                    $(".ShowLogo").show();
                    $("#event")[0].style.color = "black";
                    $("#Div1Title")[0].style.color = "white";
                    ChangeBg = false;
                    model.com.refresh();
                } else {
                    $("#event")[0].style.backgroundImage = "url(../static/images/GZImg/deep1.png)";
                    $(".ShowLogo").hide();
                    $("#event")[0].style.color = "white";
                    ChangeBg = true;
                    model.com.refresh();
                }
            });
            //单击事件
            $("body").delegate("#Div1ID", "click", function () {
                alert(1);
            });
        },

        run: function () {
            //model.com.refresh();
            model.com.renderingInterface();
        },

        com: {
            //获取台位
            getPlaceMode: function (data, fn, context) {
                var d = {
                    $URI: "/FMCWorkspace/All",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
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
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //刷新
            refresh: function () {
                for (var i = 0; i < source.length; i++) {
                    model.com.TempalteColumn(source[i], i);
                }
            },

            //渲染界面
            renderingInterface: function () {
                //加载台位
                model.com.getPlaceMode({
                    Active: 1,
                }, function (res) {
                    var _list = res.list;

                    model.com.getEXCAndonAll({
                        ShiftID: 0,
                    }, function (resExc) {
                        //
                        if (_list.length > 0) {
                            for (var i = 0; i < source.length; i++) {
                                for (var j = 0; j < _list.length; j++) {
                                    if (_list[j].ID == source[i].id) {
                                        //文本一(台位名称)
                                        source[i].text1 = _list[j].Name;
                                        //文本二(车号)
                                        source[i].text2 = _list[j].PartNo;
                                        //图片
                                        if (_list[j].PartNo == "") {
                                            source[i].img = 1;
                                        } else {
                                            var wTemp = _list[j].PartNo.replace(/HXD/g, "");
                                            if (wTemp.indexOf("D") != -1) {
                                                source[i].img = 2;
                                            } else if (wTemp.indexOf("C") != -1) {
                                                source[i].img = 1;
                                            } else {
                                                source[i].img = 2;
                                            }
                                        }

                                        if (resExc.list.length > 0) {
                                            var ExcList = [];
                                            for (var k = 0; k < resExc.list.length; k++) {
                                                if (resExc.list[k].PlaceID == _list[j].ID && resExc.list[k].Status != 9 && resExc.list[k].Status != 6) {
                                                    ExcList.push(resExc.list[k]);
                                                }
                                            }
                                            //模板1:有异常 2:无异常有车型 3:无车型
                                            if (ExcList.length > 0) {
                                                source[i].model = 1;
                                            } else {
                                                if (source[i].text2 != "") {
                                                    source[i].model = 2;
                                                } else {
                                                    source[i].model = 3;
                                                }
                                            }

                                            if (ExcList.length > 0) {
                                                ExcList.sort(function (a, b) {
                                                    return a.responseLevel - b.responseLevel;
                                                });
                                                //颜色A:0 B:1 C:2 D:3
                                                switch (ExcList[0].responseLevel) {
                                                    case 1:
                                                        source[i].color = 0;
                                                        break;
                                                    case 2:
                                                        source[i].color = 1;
                                                        break;
                                                    case 3:
                                                        source[i].color = 2;
                                                        break;
                                                    case 4:
                                                        source[i].color = 3;
                                                        break;
                                                    default:
                                                }
                                                //文本三(异常类型)
                                                source[i].text3 = ExcList[0].EXType;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        model.com.refresh();
                    });
                });
                //定时刷新
                setTimeout(function () {
                    model.com.renderingInterface();
                }, 1000);
            },

            TempalteColumn: function (data, index) {
                var str = ".divC";
                var str1 = "";
                var str2 = "";
                var str3 = "";
                var str4 = "";
                str = str + index;
                if (ChangeBg) {
                    $(str).css("background-color", "#193A6B");
                } else {
                    $(str).css("background-color", "#DEDEDE");
                }
                //清空div子项目
                $(str).empty();

                if (data.model == 1) {
                    str1 = str + " " + ".text1";
                    str2 = str + " " + ".text2";
                    str3 = str + " " + ".text3";
                    str4 = str + " " + "img";

                    $(str).append(model1);
                    if (data.color >= 0) {
                        if (ChangeBg) {
                            $(str).css("background-color", colorList[data.color]);
                        } else {
                            $(str).css("background-color", bgColor[data.color]);
                        }
                    }
                    if (data.color >= 0) {
                        $(str).css("color", "white");
                    }
                    $(str1).html(data.text1);
                    $(str2).html(data.text2);
                    $(str3).html(data.text3);

                    if (data.img == 1) {
                        $(str4)[0].src = "../static/images/GZImg/blue@2x.png";
                    } else {
                        $(str4)[0].src = "../static/images/GZImg/red@2x.png";
                    }
                } else if (data.model == 2) {
                    str1 = str + " " + ".text1";
                    str2 = str + " " + ".text2";
                    str4 = str + " " + "img";
                    //字体  颜色白色
                    if (data.color > 0) {
                        if (ChangeBg) {
                            $(str).css("color", "white");
                        } else {
                            $(str).css("color", "black");
                        }
                    }

                    $(str).append(model2);
                    $(str1).html(data.text1);
                    $(str2).html(data.text2);

                    if (data.img == 1) {
                        $(str4)[0].src = "../static/images/GZImg/blue@2x.png";
                    } else {
                        $(str4)[0].src = "../static/images/GZImg/red@2x.png";
                    }

                } else if (data.model == 3) {
                    str1 = str + " " + ".text1";
                    //字体颜色白色
                    if (data.color > 0) {
                        if (ChangeBg) {
                            $(str).css("color", "white");
                        } else {
                            $(str).css("color", "black");
                        }
                    }

                    $(str).append(model3);
                    $(str1).html(data.text1);
                } else {
                    return;
                }
            },

            utils: {
                getSon: function (list) {
                    var _rst = [];
                    $.each(list, function (i, item) {
                        _rst.push(item);
                        if (item.SonList) {
                            var _arr = model.com.utils.getSon(item.SonList);
                            _rst = _rst.concat(_arr);
                        }
                    });
                    return _rst;
                },
                getSource: function (list) {
                    var _rst = [];
                    $.each(list, function (i, item) {
                        if (item.Active)
                            _rst.push({
                                value: item.ID,
                                name: item.Name,
                                far: item.DepartmentID,
                            });
                    });
                    return _rst;
                },
            },
        },
    });

    model.init();
});
