define(['./jquery-3.1.1', './base/base'],
    function ($JQ, $com) {
        var position = {
            radius: 4,
            spacePx: 50.0,
            freedomPx: 150,
            contextHight: 100,
            tip: {
                title: { text: '订单', prop: 'task', visible: true },
                line: [
                    { text: '开始时间', prop: 'startDate', visible: true },
                    { text: '时长', prop: 'time', visible: true }
                ]
            },
            series: {
                data: [
                    "2018.01.01",
                    "2018.03.05",
                ]
            },

            Task: {
                data: [
                    { task: "任务一", startDate: "2018-01-01", time: 2, color: "#191970" },
                    { task: "任务二", startDate: "2018-01-07", time: 4, color: "DarkGreen" },
                    { task: "任务三", startDate: "2018-01-15", time: 5, color: "DarkKhaki" },
                    { task: "任务四", startDate: "2018-01-22", time: 4, color: "purple" },
                    { task: "任务五", startDate: "2018-02-01", time: 10, color: "Brown" },
                    { task: "任务六", startDate: "2018-02-12", time: 4, color: "black" },
                    { task: "任务七", startDate: "2018-02-19", time: 5, color: "Khaki" },
                    { task: "任务八", startDate: "2018-02-25", time: 3, color: "LightGray" },
                ]
            },

            yAxis: {

                data: ['任务一', '任务二', '任务三', '任务四', '任务五', '任务六', '任务七', '任务8']

            },
            fn: function (data, source) { },

        };

        var canvas = undefined;
        var context = undefined;

        //  var canvasSource = [];

        function addDate(date, days) {
            if (!(date instanceof Date))
                date = new Date(date);

            if (!days)
                days = 0;
            var d = date;
            d.setDate(d.getDate() + days);
            var m = d.getMonth() + 1;
            var day = d.getDate();
            if (m < 10) {
                m = "0" + m;
            }
            if (day < 10) {
                day = "0" + day;
            }
            return d.getFullYear() + '-' + m + '-' + day;
        }

        //定义鼠标在画布上面的位置
        var eventDown_x = 0;
        var eventDown_y = 0;

        var eventMove_x = 0;
        var eventMove_y = 0;

        var radius = 4;
        var temp = false;
        var scroll = undefined;
        var _Index = -1;
        //Install();
        var install = function (ContainDiv, positionIn, ContainSrocll) {

            var $scroll = $(' <div></div>'),
                $canvas = $('<canvas style="border: 2px solid LightSkyBlue;float: left;"></canvas>'),
                //左侧
                $canvasLeft = $('<canvas style="border: 2px solid LightSkyBlue;position:absolute;z-index:999;background:white"></canvas>');

            var Top = ContainDiv.offset().top;
            var Left = ContainDiv.offset().left;

            $canvasLeft.css("top", Top);
            $canvasLeft.css("left", Left);

            $scroll.html($canvas);
            $scroll.append($canvasLeft);

            if (ContainDiv[0]) {
                ContainDiv.html($scroll);
            } else {
                ContainDiv = $(ContainDiv).html($scroll);
            }

            position = positionIn;

            //定义每天间隙
            space = parseFloat(positionIn.spacePx);

            //定义菜单栏区间
            freedom = positionIn.freedomPx;

            scroll = ContainSrocll[0];
            canvas = $canvas[0];
            canvasLeft = $canvasLeft[0];
            //
            context = canvas.getContext('2d');

            //定义区间天数
            days = (new Date(position.series.data[1]) - new Date(position.series.data[0])) / 1000 / 24 / 3600;

            //定义区间周数
            weekDays = days / 7;
            if (days % 7 == 0)
                canvas.width = (days + 7) * space + freedom;
            else {
                canvas.width = (days - days % 7 + 7) * space + freedom;
            }
            if (position.contextHight)
                canvas.height = position.contextHight - 10;


            $canvasLeft[0].width = freedom;
            $canvasLeft[0].height = canvas.height;

            contextLeft = $canvasLeft[0].getContext('2d');

            radius = position.radius ? position.radius : radius;

            canvas.onmousedown = function (evt) {
                temp = true;
                var scrollX = scroll.scrollLeft;
                var scrollY = scroll.scrollTop;

                var eventDown_x = evt.clientX + scrollX - canvas.offsetLeft;
                var eventDown_y = evt.clientY + scrollY - canvas.offsetTop;

                //alert(eventDown_x + '    ' + eventDown_y);
                //鼠标位置  x y  查询按住的数据（长方形）  是否点中的是左   右边
                var wDownRectResult = SearchMouseDownRect(eventDown_x, eventDown_y, position.Task.data);
                _Index = wDownRectResult.wIndex;
                // console.log("Index:" + wDownRectResult.wIndex + " Left:" + wDownRectResult.wIsLeft);
                if (wDownRectResult.wIndex < 0)
                    return false;
                //alert(eventDown_x);
                canvas.onmousemove = function (evt) {

                    eventMove_x = evt.clientX + scrollX - canvas.offsetLeft;
                    eventMove_y = evt.clientY + scrollY - canvas.offsetTop;

                    //if (evt.clientX >= $scroll.width() || evt.clientY >= $scroll.height()) {
                    //    canvas.onmousemove = function () { };
                    //    //canvas.onmousedown = function () { };
                    //    console.log(1)
                    //    return;
                    //}

                    var right = eventMove_x - eventDown_x;


                    var day = right / space;

                    //拖动矩形
                    if (wDownRectResult.wIsLeft == 2 && new Date(new Date(position.Task.data[wDownRectResult.wIndex].startDate).getTime() + (day * 24 * 3600000)) >= new Date(position.series.data[0]) && new Date(new Date(position.Task.data[wDownRectResult.wIndex].startDate).getTime()
                        + ((position.Task.data[wDownRectResult.wIndex].time + day) * 24 * 3600000)) <= new Date(new Date(position.series.data[1]).getTime())) {

                        position.Task.data[wDownRectResult.wIndex].startDate =
                            new Date(new Date(position.Task.data[wDownRectResult.wIndex].startDate).getTime() + (day * 24 * 3600000));

                        position.series.data[0] = Direction(position.series.raiseDirection, position.Task.data[wDownRectResult.wIndex]).Start;
                        position.series.data[1] = Direction(position.series.raiseDirection, position.Task.data[wDownRectResult.wIndex]).End;
                    }

                    if (day == 0)
                        return;

                    if (wDownRectResult.wIsLeft == -1 && day >= position.Task.data[wDownRectResult.wIndex].time)
                        return;

                    if (wDownRectResult.wIsLeft == 1 && -day >= position.Task.data[wDownRectResult.wIndex].time)
                        return;

                    if (wDownRectResult.wIsLeft == -1 &&
                        new Date(new Date(position.Task.data[wDownRectResult.wIndex].startDate).getTime() + (day * 24 * 3600000)) < (new Date(position.series.data[0]) - 1 * 24 * 3600000))
                        return;

                    if (wDownRectResult.wIsLeft == 1 && new Date(new Date(position.Task.data[wDownRectResult.wIndex].startDate).getTime()
                        + ((position.Task.data[wDownRectResult.wIndex].time + day) * 24 * 3600000)) > new Date(new Date(position.series.data[1]).getTime()))
                        return;


                    if (wDownRectResult.wIsLeft == -1) {
                        if (days > 0) {
                            console.log("days:" + days);
                            console.log("1==Date:" + addDate(position.Task.data[wDownRectResult.wIndex].startDate) + "  "
                                + "time:" + position.Task.data[wDownRectResult.wIndex].time);
                        }

                        position.Task.data[wDownRectResult.wIndex].startDate =
                            new Date(new Date(position.Task.data[wDownRectResult.wIndex].startDate).getTime() + (day * 24 * 3600000));
                        position.Task.data[wDownRectResult.wIndex].time -= day;

                        position.series.data[0] = Direction(position.series.raiseDirection, position.Task.data[wDownRectResult.wIndex]).Start;
                        position.series.data[1] = Direction(position.series.raiseDirection, position.Task.data[wDownRectResult.wIndex]).End;
                        if (days > 0) {
                            console.log("2==Date:" + addDate(position.Task.data[wDownRectResult.wIndex].startDate) + "  DateTime:" + position.Task.data[wDownRectResult.wIndex].startDate.getTime()
                                + "   time:" + position.Task.data[wDownRectResult.wIndex].time);
                        }

                    }
                    else if (wDownRectResult.wIsLeft == 1) {
                        position.Task.data[wDownRectResult.wIndex].time += day;
                        position.series.data[0] = Direction(position.series.raiseDirection, position.Task.data[wDownRectResult.wIndex]).Start;
                        position.series.data[1] = Direction(position.series.raiseDirection, position.Task.data[wDownRectResult.wIndex]).End;
                    }
                    arry_Line = [];
                    //arry_Line.push(0, position.Task.data[0].Line);

                    days = (new Date(position.series.data[1]) - new Date(position.series.data[0])) / 1000 / 24 / 3600;
                    weekDays = days / 7;
                    if (days % 7 == 0)
                        canvas.width = (days + 7) * space + freedom;
                    else {
                        canvas.width = (days - days % 7 + 7) * space + freedom;
                    }
                    ResfushCanvas(position.Task.data);
                    eventDown_x = eventMove_x;
                }


            };


            canvas.onmouseup = function (evt) {

                //所有日期 时长 四舍五入


                //重绘

                temp = false;

                canvas.onmousemove = function () { };

                $.each(position.Task.data, function (i, item) {


                    if (!(item.startDate instanceof Date))
                        item.startDate = new Date(item.startDate);

                    var time = item.startDate.getTime();

                    item.startDate = new Date(Math.round(item.startDate.getTime() / (24 * 3600000)) * (24 * 3600000));



                    if (time != item.startDate.getTime()) {

                        item.time += ((time - item.startDate.getTime()) / (24 * 3600000));

                    }
                    item.time = Math.round(item.time);

                });
                arry_Line = [];
                //arry_Line.push(0, position.Task.data[0].Line);
                ResfushCanvas(position.Task.data);
                if (_Index >= 0 && position.fn)
                    position.fn(position.Task.data[_Index], position.Task.data);
            };

            $(canvas).mousemove(function (evt) {

                if (temp)
                    return false;
                var scrollX1 = scroll.scrollLeft;
                var scrollY1 = scroll.scrollTop;
                var eventOver_x = evt.clientX + scrollX1 - canvas.offsetLeft;
                var eventOver_y = evt.clientY + scrollY1 - canvas.offsetTop;


                var zzz = SearchMouseDownRect(eventOver_x, eventOver_y, position.Task.data);
                if (zzz.wIsLeft == 0) {
                    arry_Line = [];
                    //arry_Line.push(0, position.Task.data[0].Line);
                    ResfushCanvas(position.Task.data);
                    this.style.cursor = 'default';
                }
                if (zzz.wIsLeft == -1 || zzz.wIsLeft == 1) {
                    arry_Line = [];
                    //arry_Line.push(0, position.Task.data[0].Line);
                    ResfushCanvas(position.Task.data);
                    this.style.cursor = 'w-resize';
                }
                if (zzz.wIsLeft == 2) {
                    this.style.cursor = 'pointer';
                    arry_Line = [];
                    //arry_Line.push(0, position.Task.data[0].Line);
                    ResfushCanvas(position.Task.data);
                    if (evt.clientX >= $scroll.width() - position.tip.Text.tipW) {
                        Tips(eventOver_x - position.tip.Text.tipW, eventOver_y, zzz.wIndex);
                    }
                    else if (eventOver_y >= Math.abs($scroll.height() - position.tip.Text.tipH)) {
                        Tips(eventOver_x, eventOver_y - position.tip.Text.tipH, zzz.wIndex);
                    }
                    else if (evt.clientX >= $scroll.width() - position.tip.Text.tipW && eventOver_y >= Math.abs($scroll.height() - position.tip.Text.tipH)) {
                        Tips(eventOver_x - position.tip.Text.tipW, eventOver_y - position.tip.Text.tipH, zzz.wIndex);
                    }
                    else
                        Tips(eventOver_x, eventOver_y, zzz.wIndex);
                }

            });
        };

        var arry_Line = [];
        //arry_Line.push(0, position.Task.data[0].Line);
        //画布上绘制任务时间矩形
        var ResfushCanvasOne = function (task, startDate, days, num, color, line, part) {

            var rectStart_X, rectStart_Y, rectWidth;

            if (!(startDate instanceof Date))
                startDate = new Date(startDate);

            rectStart_X = freedom + (((startDate - new Date(position.series.data[0])) / (24 * 3600000)) * space);

            rectStart_Y = Recursion(position.Task.data, num);
            rectWidth = days * space;

            DrawRoundRect(rectStart_X, rectStart_Y, rectWidth, space, radius, num, color);

            if ($.inArray(line, arry_Line) >= 0) {
                //return;
            }
            else {
                DrawMenu(line, part, num);
                if (arry_Line.length <= data_Arry.length)
                    arry_Line.push(line);
            }
        }

        //重绘画布
        var ResfushCanvas = function (data) {

            if (!data) {
                data = position.Task.data;
            }
            //清除Canvas
            context.clearRect(0, 0, canvas.width, canvas.height);
            contextLeft.clearRect(0, 0, canvasLeft.width, canvasLeft.height);

            CanvasBasic();

            Recursion(data);

            //画数据
            for (var i = 0; i < data.length; i++) {
                if (!data[i].time)
                    data[i].time = 2
                ResfushCanvasOne(i + 1, data[i].startDate, data[i].time, i, data[i].color, data[i].Line, data[i].Part);
            }

        };

        var data_Arry,
            Caps;
        //确定纵轴
        //所有的矩形位置
        var Search,
            NumberCount;
        var Recursion = function (source, oneIndex) {
            Search = [];
            var arry = {},
                temp = false,
                startY;
            data_Arry = [];
            var num = 0;
            $.each(source, function (i, item) {
                if (!arry[item.Line])
                    arry[item.Line] = {};
                arry[item.Line].Line = item.Line;
                if (!arry[item.Line].Item)
                    arry[item.Line].Item = [];
                if (!arry[item.Line].Task)
                    arry[item.Line].Task = i;
                item.index = i;
                arry[item.Line].Item.push({
                    Item: item,
                    index: i
                });
                //arry[item.Line].Item.push(item);
            });
            $.each(arry, function (i, item) {
                data_Arry.push(item);
            });

            //按时间排序
            $.each(data_Arry, function (i, item) {
                for (var j = 0; j < item.Item.length; j++) {
                    for (var k = j + 1; k < item.Item.length; k++) {
                        if (new Date(item.Item[j].Item.startDate).getTime() > new Date(item.Item[k].Item.startDate).getTime()) {
                            var think = item.Item[j];
                            item.Item[j] = item.Item[k];
                            item.Item[k] = think;
                        }
                    }
                }
            });

            if (position.ladder) {
                //开启阶梯每个矩形的开始位置
                var startTop = 35,
                    count = 0;
                $.each(data_Arry, function (i, item_i) {
                    count = 0;
                    if (i == 0) {
                        startTop = 35;
                    }
                    else
                        startTop = startTop + space;
                    if (!item_i.Height)
                        item_i.Height = startTop;
                    for (var j = 0; j < item_i.Item.length; j++) {
                        if (j == 0)
                            Search.push({
                                Item: item_i.Item[j],
                                StartRect: startTop
                            });
                        else {
                            if (new Date(item_i.Item[j].Item.startDate).getTime() <= new Date(item_i.Item[j - 1].Item.startDate).getTime() + item_i.Item[j - 1].Item.time * 24 * 3600000) {
                                startTop = startTop + space;
                                count++;
                                Search.push({
                                    Item: item_i.Item[j],
                                    StartRect: startTop
                                });
                            }
                            else
                                Search.push({
                                    Item: item_i.Item[j],
                                    StartRect: startTop
                                });
                        }
                    }
                    item_i.count = count;

                });
            }
            else {
                var countNumber = 0,
                    Did;

                $.each(data_Arry, function (i, item) {
                    NumberCount = 0;
                    item.count = AllCount(item.Item);
                });

                var Rua = [];

                for (var i = 0; i < data_Arry.length; i++) {
                    if (!data_Arry[i].count)
                        data_Arry[i].count = 0;
                    if (i == 0)
                        data_Arry[i].Height = 35;
                    else
                        data_Arry[i].Height = data_Arry[i - 1].Height + (data_Arry[i - 1].count + 1) * space;
                }

                $.each(data_Arry, function (i, item_i) {
                    var AllRect = [],
                        //进行高度分类
                        value = 0,
                        //确认开始高度最大
                        maxOneLine = 0,
                        //存放中间阶梯数据
                        minLadderData = {
                            Item: {},
                            StartRect: 0
                        };

                    $.each(item_i.Item, function (j, item_j) {
                        var tpmap = false;
                        if (j == 0) {
                            AllRect.push({
                                Item: data_Arry[i].Item[0],
                                StartRect: item_i.Height
                            });
                        }
                        else {
                            $.each(AllRect, function (k, item_k) {
                                var Nico = 0,
                                    Gico = 0;
                                $.each(OneLine(AllRect, item_k.StartRect), function (h, item_h) {
                                    //有重复
                                    if (new Date(item_j.Item.startDate).getTime() <= new Date(item_h.Item.Item.startDate).getTime() + item_h.Item.Item.time * 1000 * 24 * 60 * 60) {
                                        Gico++;
                                    }
                                    else {
                                        //循环结束没有重复
                                        //阶梯

                                        Nico++;
                                        if (h + 1 == OneLine(AllRect, item_k.StartRect).length && Gico == 0) {
                                            AllRect.push({
                                                Item: item_j,
                                                StartRect: item_h.StartRect
                                            });
                                            tpmap = true;
                                        }

                                    }
                                    //循环结束有重复
                                    if (h + 1 == OneLine(AllRect, item_k.StartRect).length && Gico != 0 && k + 1 == AllRect.length) {
                                        AllRect.push({
                                            Item: item_j,
                                            StartRect: data_Arry[i].Height + (value + 1) * space
                                        });
                                        value++;
                                        tpmap = true;
                                    }
                                });
                                if (AllRect.length == item_i.Item.length) {
                                    return false;
                                }
                                if (tpmap) {
                                    return false;
                                }
                            });
                        }
                        if (AllRect.length == item_i.Item.length) {
                            return false;
                        }
                    });

                    $.each(AllRect, function (r, item_r) {
                        Search.push(item_r);
                    });

                });
            }
            $.each(Search, function (i, item) {
                if (item.Item.Item.index == oneIndex) {
                    startY = item.StartRect;
                }
            });

            //console.log(data_Arry);
            return startY;
        };
        //根据产线分类后在进行一次分类
        var OneLine = function (source, top) {
            var arry = {},
                res = [];
            $.each(source, function (i, item) {
                if (!arry[item.StartRect])
                    arry[item.StartRect] = [];
                arry[item.StartRect].push(item);
            });
            $.each(arry, function (i, item) {
                $.each(item, function (j, item_j) {
                    if (top == i) {
                        res.push(item_j);
                    }
                });

            });
            return res;
        };

        var AllCount = function (source) {
            var arry = [];

            for (var i = 1; i < source.length; i++) {
                if (new Date(source[i - 1].Item.startDate).getTime() + source[i - 1].Item.time * 24 * 3600000 >= new Date(source[i].Item.startDate).getTime() && new Date(source[i - 1].Item.startDate).getTime() + source[i - 1].Item.time * 24 * 3600000 < new Date(source[i].Item.startDate).getTime() + source[i].Item.time * 24 * 3600000) {
                    arry.push({
                        Item: { startDate: source[i].Item.startDate, time: (new Date(source[i - 1].Item.startDate).getTime() + source[i - 1].Item.time * 24 * 3600000 - new Date(source[i].Item.startDate).getTime()) / (24 * 3600000) },
                        index: 1
                    });
                }
                if (new Date(source[i - 1].Item.startDate).getTime() + source[i - 1].Item.time * 24 * 3600000 >= new Date(source[i].Item.startDate).getTime() && new Date(source[i - 1].Item.startDate).getTime() + source[i - 1].Item.time * 24 * 3600000 >= new Date(source[i].Item.startDate).getTime() + source[i].Item.time * 24 * 3600000) {
                    arry.push({
                        Item: {
                            startDate: source[i].Item.startDate,
                            time: source[i].Item.time
                        },
                        index: 0
                    });
                }
            }

            if (arry.length == 1) {
                NumberCount++;
            }
            else if (arry.length == 0) {

            }
            else {
                NumberCount++;
                AllCount(arry);
            }

            return NumberCount;
        };
        //比较是否全部相等
        var Forever = function (source) {
            var key = false,
                count = 0;

            $.each(source, function (i, item_i) {
                if (source[0].StartDate == item_i.StartDate && source[0].Date == item_i.Date) {
                    count++;
                }
            });
            if (count == source.length && source.length != 0) {
                key = true;
            }
            return key;
        };
        //递归排序
        var DG = function (source) {
            var res = source;
            for (var i = 0; i < source.length; i++) {
                for (var j = 0; j < source.length - 1 - i; j++) {
                    if (source[i].StartDate > source[j].StartDate) {
                        var temp = source[j];
                        source[j] = source[j + 1];
                        source[j + 1] = temp;
                    }
                }
            }
            return source;
        };

        //画基础日历表
        var CanvasBasic = function () {

            context.beginPath();

            for (var i = 0; i <= weekDays; i++) {
                //画年月份
                context.font = "bold 13px Arial";
                context.fillStyle = 'black';
                context.textAlign = 'center';
                context.textBaseline = 'alphabetic';
                var z = addDate(position.series.data[0], i * 7);
                context.fillText(z + '--' + addDate(z, 6), (i * 7 * space) + (7 * space / 2) + freedom, 15, 7 * space);
                context.fill();

                context.font = "bold 12px Arial";
                context.strokeStyle = 'LightSkyBlue';
                context.moveTo(i * 7 * space + freedom, 0);
                context.lineTo(i * 7 * space + freedom, canvas.height);
                context.stroke();
            }
            for (var j = 0; j < days; j++) {
                context.font = "bold 13px Arial";
                context.fillStyle = 'black';
                if (true) {
                    if (j % 7 == 0)
                        context.fillText("一", space * j + space / 2 + freedom, 31, space);
                    if (j % 7 == 1)
                        context.fillText("二", space * j + space / 2 + freedom, 31, space);
                    if (j % 7 == 2)
                        context.fillText("三", space * j + space / 2 + freedom, 31, space);
                    if (j % 7 == 3)
                        context.fillText("四", space * j + space / 2 + freedom, 31, space);
                    if (j % 7 == 4)
                        context.fillText("五", space * j + space / 2 + freedom, 31, space);
                    if (j % 7 == 5)
                        context.fillText("六", space * j + space / 2 + freedom, 31, space);
                    if (j % 7 == 6)
                        context.fillText("日", space * j + space / 2 + freedom, 31, space);
                    context.fill();
                }
                //画日期下竖线
                context.beginPath();
                context.strokeStyle = 'DarkGray';
                context.moveTo(j * space + freedom, 18);
                context.lineTo(j * space + freedom, canvas.height);
                if (j == days) {
                    context.strokeStyle = 'DarkGray';
                    context.moveTo((j + 1) * space + freedom, 18);
                    context.lineTo((j + 1) * space + freedom, canvas.height);

                }
                //if (j + 1 > days) {
                //    context.strokeStyle = 'DarkGray';
                //    context.moveTo((j + 1) * space + freedom, 18);
                //    context.lineTo((j + 1) * space + freedom, canvas.height);
                //}
                context.stroke();
                context.closePath();

            }

            if (j == days) {
                //context.beginPath();
                //context.strokeStyle = 'LimeGreen';
                //context.moveTo((j + 1) * space + freedom, 18);
                //context.lineTo((j + 1) * space + freedom, canvas.height);
                //context.stroke();
                //context.closePath();
                context.beginPath();
                context.strokeStyle = 'LimeGreen';
                context.moveTo((j) * space + freedom, 18);
                context.lineTo((j) * space + freedom, canvas.height);
                context.stroke();
                context.closePath();
            }

            //画横线
            context.beginPath();
            context.strokeStyle = 'LimeGreen';
            context.moveTo(0 + freedom, 18);
            context.lineTo(canvas.width + freedom, 18);
            context.stroke();
            context.closePath();

            context.beginPath();
            context.strokeStyle = 'LimeGreen';
            context.moveTo(0 + freedom, 35);
            context.lineTo(canvas.width + freedom, 35);
            context.stroke();
            context.closePath();

            //菜单栏竖线
            //context.beginPath();
            //context.strokeStyle = 'green';
            //context.moveTo(150, 0);
            //context.lineTo(150, canvas.height);
            //context.stroke();
            //context.closePath();
        }

        //画任务名称
        var DrawMenu = function (line, part, ID) {
            var y;
            $.each(data_Arry, function (i, item) {
                if (item.Line == line) {
                    y = item.Height + 13 + item.count * space / 2;
                    return false;
                }
            });
            //context.beginPath();
            //context.fillStyle = 'black';
            //context.fillText(line + " " + "——" + " " + part, 100, y);
            //context.fill();
            //context.closePath();

            contextLeft.beginPath();
            contextLeft.font = "bold 13px Arial";
            contextLeft.textAlign = 'center';
            contextLeft.textBaseline = 'alphabetic';
            contextLeft.fillStyle = 'black';
            contextLeft.fillText(line + " " + "——" + " " + part, 100, y + 3);
            contextLeft.fill();
            contextLeft.closePath();
        };

        var Direction = function (number, data) {
            var result = { Start: position.series.data[0], End: position.series.data[1] };
            if (new Date(data.startDate).getTime() <= new Date(position.series.data[0]).getTime() + 1 * 24 * 3600000)
                switch (number) {
                    case 0: result.Start = position.series.data[0], result.End = position.series.data[1]; break;
                    case -1: result.Start = $com.util.format('yyyy-MM-dd', (new Date(position.series.data[0]).getTime() - position.series.raise * 24 * 3600000)), result.End = position.series.data[1]; break;
                    case 1: result.Start = position.series.data[0], result.End = position.series.data[1]; break;
                    case 2: result.Start = $com.util.format('yyyy-MM-dd', (new Date(position.series.data[0]).getTime() - position.series.raise * 24 * 3600000)), result.End = position.series.data[1]; break;
                };
            if (new Date(data.startDate).getTime() + data.time * 24 * 3600000 >= new Date(position.series.data[1]).getTime() - 1 * 24 * 3600000)
                switch (number) {

                    case 0: result.Start = position.series.data[0], result.End = position.series.data[1]; break;
                    case -1: result.Start = position.series.data[0], result.End = position.series.data[1]; break;
                    case 1: result.Start = position.series.data[0], result.End = $com.util.format('yyyy-MM-dd', (new Date(position.series.data[1]).getTime() + position.series.raise * 24 * 3600000)); break;
                    case 2: result.Start = position.series.data[0], result.End = $com.util.format('yyyy-MM-dd', (new Date(position.series.data[1]).getTime() + position.series.raise * 24 * 3600000)); break;
                };
            return result;
        };

        var matching = 2.5;
        //圆角矩形
        var flag = false;
        var DrawRoundRect = function (x, y, width, height, radius, num, color) {

            //context.canvas.

            context.beginPath();

            context.fillStyle = color;
            context.globalCompositeOperation = "source-over";
            context.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 3 / 2);
            context.lineTo(width - radius + x, y);
            context.arc(width - radius + x, radius + y, radius, Math.PI * 3 / 2, Math.PI * 2);
            context.lineTo(width + x, height + y - radius);
            context.arc(width - radius + x, height - radius + y, radius, 0, Math.PI * 1 / 2);
            context.lineTo(radius + x, height + y);
            context.arc(radius + x, height - radius + y, radius, Math.PI * 1 / 2, Math.PI);
            context.fill();

            context.strokeStyle = 'DarkGray';
            context.moveTo(freedom, y + space);
            context.lineTo(canvas.width, y + space);
            context.stroke();

            context.closePath();
            context.fillStyle = 'white';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(position.yAxis.data[num], x + width / 2, y + height / 2, width);

        }

        //查找哪一个矩形
        var SearchMouseDownRect = function (m_x, m_y, data) {

            var wResult = { wIndex: -1, wIsLeft: 0 }

            for (var i = 0; i < data.length; i++) {


                var rectStart_X1 = freedom + ((new Date(data[i].startDate) - new Date(position.series.data[0])) / 1000 / 24 / 3600 * space);

                var rectStart_Y1 = Recursion(data, i);//35 + i * space;

                var rectWidth1 = position.Task.data[i].time * space;

                //判断是那行数据
                if (m_y <= rectStart_Y1 || m_y >= rectStart_Y1 + space || m_x <= rectStart_X1 || m_x >= rectStart_X1 + rectWidth1) {
                    continue;
                }
                wResult.wIndex = i;
                if (m_x > rectStart_X1 - matching && m_x < rectStart_X1 + matching)
                    wResult.wIsLeft = -1;
                else if (m_x > rectStart_X1 + rectWidth1 - matching && m_x < rectStart_X1 + rectWidth1 + matching)
                    wResult.wIsLeft = 1;
                else if (m_x > rectStart_X1 + matching && m_x < rectStart_X1 + rectWidth1 - matching)
                    wResult.wIsLeft = 2;
            }
            return wResult;

        }

        var Tips = function (x, y, index) {

            var startDate = position.Task.data[index].startDate,
                days = position.Task.data[index].time;


            var tipW = 150;
            var tipH = 70;
            var lineH = 15;
            var titleH = 30;


            tipW = position.tip.Text.tipW ? position.tip.Text.tipW : tipW;
            tipH = position.tip.Text.tipH ? position.tip.Text.tipH : tipH;
            lineH = position.tip.Text.lineH ? position.tip.Text.lineH : lineH;
            titleH = position.tip.Text.titleH ? position.tip.Text.titleH : titleH;

            startDate = addDate(startDate, 0);
            context.font = "bold 15px Arial";
            context.fillStyle = 'black';
            context.textAlign = 'center';
            context.globalAlpha = 0.5;
            context.fillRect(x, y - 5, tipW, tipH);
            context.fillStyle = 'white';
            context.globalAlpha = 1;

            y += 8;

            if (position.tip.title.visible) {
                context.fillText(position.tip.title.text + ":" + position.Task.data[index][position.tip.title.prop],
                    x + (tipW / 2), y, tipW);
                y = y + titleH;
            }
            context.font = "bold 13px 宋体";
            for (var i = 0; i < position.tip.line.length; i++) {
                if (!position.tip.line[i].visible)
                    continue;
                if (!(position.Task.data[index][position.tip.line[0].prop] instanceof Date))
                    position.Task.data[index][position.tip.line[0].prop] = new Date(position.Task.data[index][position.tip.line[0].prop]);

                position.Task.data[index][position.tip.line[0].prop] = addDate(position.Task.data[index][position.tip.line[0].prop], 0);


                context.fillText(position.tip.line[i].text + ":" + position.Task.data[index][position.tip.line[i].prop],
                    x + (tipW / 2), y, tipW);
                //context.fillText(position.tip.line[i].text + ":" + position.Task.data[index][position.tip.line[i].prop],
                //    x + (tipW / 2), y, tipW);
                y = y + lineH;
            }



        }

        // ResfushCanvas(position.Task.data);
        //context.fillStyle = 'white';
        //context.fillText('zzzzzzzzzzzzzzzzz',300,50);


        return {
            resfushCanvas: ResfushCanvas,
            install: install
        };

    });

