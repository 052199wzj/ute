define(['./jquery-3.1.1', './base/base'],
    function ($JQ, $com) {
        var position = {
            radius: 4,
            spacePx: 25.0,
            freedomPx: 300,
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
        //颜色库
        var ColorClass = ['#3E90C6', '#EA4B3E', '#F29D0E', '#F1C40F', '#BF392D', '#D15203', '#E84D3B', '#3598DB', '#7E8C8D', '#C59BD7', '#8548A7', '#697787', '#91AB65', '#B0C97D', '#429FC0', '#6D7181'];

        var canvas = undefined;
        var context = undefined;
        var AllGroup = [];
        //时间
        var DynamicsDate = [];
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
        var ScrollText = undefined;
        var _Index = -1;
        //Install();
        var install = function (ContainDiv, positionIn, ContainSrocll, date) {
            DynamicsDate = date;

            var $scroll = $('<div></div>'),

                $canvas = $('<canvas style="border: 2px solid #DCE1E2;float: left;"></canvas>');
            ScrollText = ContainSrocll;
            //$canvasLeft = $('<canvas style="border: 2px solid LightSkyBlue;position:absolute;z-index:999;background:white"></canvas>');

            //var Top = ContainDiv.offset().top;
            //var Left = ContainDiv.offset().left;

            //$canvasLeft.css("top", Top);
            //$canvasLeft.css("left", Left);

            $scroll.html($canvas);
            //$scroll.append($canvasLeft);

            if (ContainDiv[0]) {
                ContainDiv.html($scroll);
            } else {
                ContainDiv = $(ContainDiv).html($scroll);
            }

            position = positionIn;

            //定义每天间隙
            space = parseFloat(positionIn.spacePx);
            spacePy = parseFloat(positionIn.spacePy);
            //定义菜单栏区间
            freedom = positionIn.freedomPx;

            scroll = ContainSrocll[0];
            canvas = $canvas[0];
            //canvasLeft = $canvasLeft[0];

            //
            context = canvas.getContext('2d');

            ////定义区间天数
            //days = (new Date(position.series.data[1]) - new Date(position.series.data[0])) / 1000 / 24 / 3600;

            ////定义区间周数
            //weekDays = days / 7;
            //if (days % 7 == 0)
            //    canvas.width = (days + 7) * space + freedom;
            //else {
            //    canvas.width = (days - days % 7 + 7) * space + freedom;
            //}
            canvas.width = (DynamicsDate.length) * space + freedom;

            if (position.contextHight)
                canvas.height = position.contextHight - 15;

            radius = position.radius ? position.radius : radius;


            //canvas.onmousedown = function (evt) {
            //    //注销鼠标按下事件

            //    temp = true;
            //    var scrollX = scroll.scrollLeft;
            //    var scrollY = scroll.scrollTop;

            //    var eventDown_x = evt.clientX + scrollX - canvas.offsetLeft;
            //    var eventDown_y = evt.clientY + scrollY - canvas.offsetTop;

            //    //alert(eventDown_x + '    ' + eventDown_y);
            //    //鼠标位置  x y  查询按住的数据（长方形）  是否点中的是左   右边
            //    var wDownRectResult = SearchMouseDownRect(eventDown_x, eventDown_y, position.Task.data);
            //    _Index = wDownRectResult.wIndex;
            //    // console.log("Index:" + wDownRectResult.wIndex + " Left:" + wDownRectResult.wIsLeft);
            //    if (wDownRectResult.wIndex < 0)
            //        return false;
            //    //alert(eventDown_x);
            //    canvas.onmousemove = function (evt) {

            //        eventMove_x = evt.clientX + scrollX - canvas.offsetLeft;
            //        eventMove_y = evt.clientY + scrollY - canvas.offsetTop;


            //        var right = eventMove_x - eventDown_x;


            //        var days = right / space;

            //        //拖动矩形
            //        if (wDownRectResult.wIsLeft == 2 && new Date(new Date(position.Task.data[wDownRectResult.wIndex].startDate).getTime() + (days * 24 * 3600000)) >= new Date(position.series.data[0]) && new Date(new Date(position.Task.data[wDownRectResult.wIndex].startDate).getTime() + ((position.Task.data[wDownRectResult.wIndex].time + days) * 24 * 3600000)) <= new Date(new Date(position.series.data[1]).getTime() + 8 * 3600000) && !position.Task.data[wDownRectResult.wIndex].Locked) {
            //            //position.Task.data[wDownRectResult.wIndex].startDate = new Date(new Date(position.Task.data[wDownRectResult.wIndex].startDate).getTime() + (days * 24 * 3600000));
            //            AllGroup = GetGroup(position.Task.data[wDownRectResult.wIndex].GroupID);
            //            console.log(1);
            //            //判断最后一个拖动矩形是否在右侧
            //            if (new Date(new Date(position.Task.data[AllGroup[AllGroup.length - 1]].startDate).getTime() + ((position.Task.data[AllGroup[AllGroup.length - 1]].time + days) * 24 * 3600000)) >= new Date(new Date(position.series.data[1]).getTime() + 8 * 3600000) && days >= 0)
            //                return;
            //            console.log(2);
            //            //判断第二个拖动矩形是否比第一个要小并且向左托
            //            if (new Date(new Date(position.Task.data[wDownRectResult.wIndex].startDate).getTime()) - 8 * 3600000 <= new Date(new Date(position.Task.data[wDownRectResult.wIndex - 1].startDate).getTime()) && days < 0)
            //                return;
            //            //
            //            console.log(3);
            //            if (new Date(new Date(position.Task.data[wDownRectResult.wIndex].startDate).getTime()) - 8 * 3600000 <= new Date(new Date(position.Task.data[wDownRectResult.wIndex - 1].startDate).getTime()) && days <= 0)
            //                return;
            //            $.each(AllGroup, function (i, item) {
            //                if (i == 0)
            //                    return true;
            //                if (i != 0 && item >= wDownRectResult.wIndex)
            //                    position.Task.data[item].startDate = new Date(new Date(position.Task.data[item].startDate).getTime() + (days * 24 * 3600000));
            //            });
            //            console.log(4);
            //        }

            //        if (days == 0)
            //            return;

            //        if (wDownRectResult.wIsLeft == -1 && wDownRectResult.wIsLeft == 1)
            //            return;

            //        ResfushCanvas(position.Task.data);
            //        eventDown_x = eventMove_x;
            //    }
            //};

            //canvas.onmouseup = function (evt) {

            //    //所有日期 时长 四舍五入


            //    //重绘

            //    temp = false;

            //    canvas.onmousemove = function () { };

            //    $.each(position.Task.data, function (i, item) {

            //        if (!(item.startDate instanceof Date))
            //            item.startDate = new Date(item.startDate);

            //        var time = item.startDate.getTime();

            //        item.startDate = new Date(Math.round(item.startDate.getTime() / (24 * 3600000)) * (24 * 3600000));

            //        if (time != item.startDate.getTime()) {

            //            item.time += ((time - item.startDate.getTime()) / (24 * 3600000));

            //        }
            //        item.time = Math.round(item.time);

            //    });
            //    ResfushCanvas(position.Task.data);
            //    if (_Index >= 0 && position.fn)
            //        position.fn(position.Task.data[_Index], position.Task.data, AllGroup);
            //};

            $(canvas).mousemove(function (evt) {

                if (temp)
                    return false;
                var scrollX1 = scroll.scrollLeft;
                var scrollY1 = scroll.scrollTop;
                var eventOver_x = evt.clientX + scrollX1 - canvas.offsetLeft;
                var eventOver_y = evt.clientY + scrollY1 - canvas.offsetTop;
                var zzz = SearchMouseDownRect(eventOver_x, eventOver_y, position.Task.data);
                if (zzz.wIsLeft == 0) {
                    ResfushCanvas(position.Task.data);
                    this.style.cursor = 'default';
                }
                if (zzz.wIsLeft == -1 || zzz.wIsLeft == 1) {
                    ResfushCanvas(position.Task.data);
                    this.style.cursor = 'w-resize';
                }
                if (zzz.wIsLeft == 2) {
                    this.style.cursor = 'pointer';
                    ResfushCanvas(position.Task.data);
                    if (evt.clientX >= ScrollText.width() - ScrollText.scrollLeft() - position.tip.Text.tipW) {
                        Tips(eventOver_x - position.tip.Text.tipW, eventOver_y, zzz.wIndex);
                    }
                    else if (eventOver_y >= ScrollText.height() - ScrollText.scrollTop() - position.tip.Text.tipH) {
                        Tips(eventOver_x, eventOver_y - position.tip.Text.tipH, zzz.wIndex);
                    }
                    else if (evt.clientX >= ScrollText.width() - ScrollText.scrollLeft() - position.tip.Text.tipW && eventOver_y >= ScrollText.height() - position.tip.Text.tipH) {
                        Tips(eventOver_x - position.tip.Text.tipW, eventOver_y - position.tip.Text.tipH, zzz.wIndex);
                    }
                    else
                        Tips(eventOver_x, eventOver_y, zzz.wIndex);
                }

            });
        };

        //画布上绘制任务时间矩形
        var ResfushCanvasOne = function (task, startDate, days, num, color, line, part) {

            var rectStart_X, rectStart_Y, rectWidth;

            //startDate = $com.util.format('yyyy-MM-dd', startDate);

            //startDate = $com.util.format('yyyy-MM-dd hh:mm:ss', startDate);
            if (!(startDate instanceof Date))
                startDate = new Date(startDate);
            else {
                startDate = new Date(new Date(startDate).getTime() - 8 * 60 * 60 * 1000);
            }


            rectStart_X = freedom + (((startDate - new Date(position.series.data[0])) / (24 * 3600000)) * space);

            rectStart_Y = 52 + (task - 1) * spacePy;

            rectWidth = (days) * space;

            DrawRoundRect(rectStart_X, rectStart_Y, rectWidth, spacePy - 3, radius, num, color);

            DrawMenu(num, rectStart_Y);
        }

        //重绘画布
        var ResfushCanvas = function (data) {
            //定义orderID对应的颜色
            var orderNumber = [],
                orderColor = [],
                orderExc = [];
            if (!data) {
                data = position.Task.data;
            }
            //清除Canvas
            context.clearRect(0, 0, canvas.width, canvas.height);

            CanvasBasic();
            //画数据
            //orderNumber.push(data[0].OrderNo);
            orderColor.push({ OrderNo: data[0].OrderNo, color: ColorClass[0] });
            for (var i = 0; i < data.length; i++) {
                if ($.inArray(data[i].OrderNo, orderExc) < 0) {
                    orderExc.push(data[i].OrderNo);
                }

            }
            orderExc.sort();

            //颜色的设定
            for (var i = 0; i < data.length; i++) {
                $.each(orderExc, function (j, item) {
                    if (item == data[i].OrderNo)
                        data[i].color = ColorClass[j]
                });
                ResfushCanvasOne(i + 1, data[i].startDate, data[i].time + 1, i, data[i].color, data[i].Line, data[i].Part);
            }

        };
        //找到颜色
        var SelectColor = function (num, arry, res) {
            var color;
            $.each(res, function (i, item) {
                if (item.orderID == arry[num]) {
                    color = item.color;
                    return color;
                }
            });
            return color;
        };



        //画基础日历表
        var CanvasBasic = function () {


            //上部填充颜色
            context.beginPath();
            context.fillStyle = '#C8E3FF';
            context.fillRect(0, 0, freedom, 52);
            context.fillRect(freedom, 0, canvas.width, 18);
            context.fill();

            //上下部填充颜色
            context.fillStyle = '#E4F2FF';
            context.fillRect(freedom, 18, canvas.width, 35);
            context.fill();

            //for (var i = 0; i <= weekDays; i++) {
            //画年月份
            //context.font = "bold 13px Arial";
            //context.fillStyle = 'black';
            //context.textAlign = 'center';
            //context.textBaseline = 'alphabetic';
            //var z = addDate(position.series.data[0], i * 7);
            //context.fillText(z + '--' + addDate(z, 6), (i * 7 * space) + (7 * space / 2) + freedom, 15, 7 * space);
            //context.fill();

            //context.strokeStyle = 'green';
            //context.moveTo(i * 7 * space + freedom, 0);
            //context.lineTo(i * 7 * space + freedom, canvas.height);
            //context.stroke();
            //}

            context.beginPath();
            context.font = "bold 13px Arial";
            context.fillStyle = 'black';
            context.textAlign = 'center';
            context.textBaseline = 'alphabetic';
            context.fillText(DynamicsDate[0].WorkDate + '--' + DynamicsDate[DynamicsDate.length - 1].WorkDate, DynamicsDate.length * space / 2 + freedom, 15, DynamicsDate.length * space);
            context.fill();

            context.strokeStyle = '#DCE1E2';
            context.lineWidth = '2';
            context.moveTo(DynamicsDate.length * space + freedom, 52);
            context.lineTo(DynamicsDate.length * space + freedom, canvas.height);
            context.moveTo(freedom, 0);
            context.lineTo(freedom, canvas.height);
            context.stroke();
            context.closePath();
            context.lineWidth = '1';
            $.each(DynamicsDate, function (i, item) {
                var date = new Date(item.WorkDate).getDay();
                context.font = "bold 13px Arial";
                context.fillStyle = 'black';
                context.fillText($com.util.format('yyyy-MM-dd', item.WorkDate), space * i + space / 2 + freedom, 31, space);
                if (true) {
                    if (date % 7 == 1)
                        context.fillText("一", space * i + space / 2 + freedom, 49, space);
                    if (date % 7 == 2)
                        context.fillText("二", space * i + space / 2 + freedom, 49, space);
                    if (date % 7 == 3)
                        context.fillText("三", space * i + space / 2 + freedom, 49, space);
                    if (date % 7 == 4)
                        context.fillText("四", space * i + space / 2 + freedom, 49, space);
                    if (date % 7 == 5)
                        context.fillText("五", space * i + space / 2 + freedom, 49, space);
                    if (date % 7 == 6)
                        context.fillText("六", space * i + space / 2 + freedom, 49, space);
                    if (date % 7 == 0)
                        context.fillText("天", space * i + space / 2 + freedom, 49, space);

                    context.fill();

                    context.beginPath();
                    context.strokeStyle = '#E9EEF6';
                    context.moveTo(space * i + freedom, 18);
                    context.lineTo(space * i + freedom, canvas.height);
                    context.stroke();
                    context.beginPath();
                }
            });

            context.beginPath();
            context.strokeStyle = '#E9EEF6';
            context.moveTo(space * (DynamicsDate.length + 1) + freedom, 18);
            context.lineTo(space * (DynamicsDate.length + 1) + freedom, canvas.height);
            context.stroke();
            context.beginPath();

            //for (var j = 0; j <= days; j++) {
            //    context.font = "bold 13px Arial";
            //    context.fillStyle = 'black';
            //    if (true) {
            //        if (j % 7 == 0)
            //            context.fillText("一", space * j + space / 2 + freedom, 31, space);
            //        if (j % 7 == 1)
            //            context.fillText("二", space * j + space / 2 + freedom, 31, space);
            //        if (j % 7 == 2)
            //            context.fillText("三", space * j + space / 2 + freedom, 31, space);
            //        if (j % 7 == 3)
            //            context.fillText("四", space * j + space / 2 + freedom, 31, space);
            //        if (j % 7 == 4)
            //            context.fillText("五", space * j + space / 2 + freedom, 31, space);
            //        if (j % 7 == 5)
            //            context.fillText("六", space * j + space / 2 + freedom, 31, space);
            //        if (j % 7 == 6)
            //            context.fillText("天", space * j + space / 2 + freedom, 31, space);
            //        context.fill();
            //    }
            //    //画日期下竖线
            //    context.beginPath();
            //    context.strokeStyle = 'DarkGray';
            //    context.moveTo(j * space + freedom, 18);
            //    context.lineTo(j * space + freedom, canvas.height);
            //    if (j == days) {
            //        context.strokeStyle = 'DarkGray';
            //        context.moveTo((j + 1) * space + freedom, 18);
            //        context.lineTo((j + 1) * space + freedom, canvas.height);
            //    }
            //    context.stroke();
            //    context.closePath();

            //}

            //if (j == days) {
            //    //context.beginPath();
            //    //context.strokeStyle = 'LimeGreen';
            //    //context.moveTo((j + 1) * space + freedom, 18);
            //    //context.lineTo((j + 1) * space + freedom, canvas.height);
            //    //context.stroke();
            //    //context.closePath();
            //    context.beginPath();
            //    context.strokeStyle = 'LimeGreen';
            //    context.moveTo((j) * space + freedom, 18);
            //    context.lineTo((j) * space + freedom, canvas.height);
            //    context.stroke();
            //    context.closePath();
            //}

            //画横线

            //左侧表格
            context.beginPath();
            context.strokeStyle = '#E9EEF6';
            context.moveTo(75, 52);
            context.lineTo(75, position.Task.data.length * position.spacePy + 52);
            context.moveTo(75 + (freedom - 75) / 5 * 2, 52);
            context.lineTo(75 + (freedom - 75) / 5 * 2, position.Task.data.length * position.spacePy + 52);
            context.moveTo(75 + (freedom - 75) / 5 * 2 + (freedom - 75) / 5, 35);
            context.lineTo(75 + (freedom - 75) / 5 * 2 + (freedom - 75) / 5, position.Task.data.length * position.spacePy + 52);
            context.moveTo(75 + (freedom - 75) / 5 * 2 + (freedom - 75) / 5 * 2, 52);
            context.lineTo(75 + (freedom - 75) / 5 * 2 + (freedom - 75) / 5 * 2, position.Task.data.length * position.spacePy + 52);
            context.stroke();
            context.closePath();

            //左侧上部字
            context.beginPath();
            context.fillStyle = 'black';
            context.fillText("产线", 75 / 2, 49);
            context.fillText("订单", 75 + (freedom - 75) / 5, 49);
            context.fillText("工序", 75 + (freedom - 75) / 5 * 2 + (freedom - 75) / 5 / 2, 49);
            context.fillText("计划数", 75 + (freedom - 75) / 5 * 2 + (freedom - 75) / 5 * 2 - (freedom - 75) / 5 / 2, 49);
            context.fillText("完成数", 75 + (freedom - 75) / 5 * 2 + (freedom - 75) / 5 * 2 + (freedom - 75) / 5 / 2, 49);
            context.fill();
            context.closePath();

            context.beginPath();
            context.strokeStyle = '#E9EEF6';
            context.moveTo(0 + freedom, 18);
            context.lineTo(canvas.width + freedom, 18);

            context.moveTo(0, 35);
            context.lineTo(canvas.width + freedom, 35);
            context.stroke();

            context.moveTo(0, 52);
            context.strokeStyle = 'DarkGray';
            context.lineTo(freedom, 52);
            context.stroke();
            context.closePath();

            context.beginPath();
            context.fillStyle = 'black';
            context.font = "bold 15px Arial";
            context.fillText("订单任务", freedom / 2, 52 / 2);
            context.fill();
            context.closePath();
            context.font = "bold 13px Arial";


            //菜单栏竖线
            //context.beginPath();
            //context.strokeStyle = 'green';
            //context.moveTo(150, 0);
            //context.lineTo(150, canvas.height);
            //context.stroke();
            //context.closePath();

        }

        //画任务名称
        var DrawMenu = function (num, y) {
            context.beginPath();

            if (position.Task.data[num].TaskLineID == 1) {
                context.beginPath();
                context.fillStyle = 'green';
                context.fillText(position.Task.data[num].Line, 75 / 2, y + position.spacePy / 2);
                context.fillText(position.Task.data[num].OrderNo, 75 + (freedom - 75) / 5 * 2 / 2, y + position.spacePy / 2);
                context.fillText(position.Task.data[num].Part, 75 + (freedom - 75) / 5 * 2 + (freedom - 75) / 5 / 2, y + position.spacePy / 2);
                context.fill();
                context.closePath();
            }
            else {
                context.fillStyle = 'black';
                context.fillText(position.Task.data[num].OrderNo, 75 + (freedom - 75) / 5 * 2 / 2, y + position.spacePy / 2);
                context.fillText(position.Task.data[num].Line, 75 / 2, y + position.spacePy / 2);
                context.fillText(position.Task.data[num].Part, 75 + (freedom - 75) / 5 * 2 + (freedom - 75) / 5 / 2, y + position.spacePy / 2);
            }

            context.fill();
            context.closePath();
        };

        var GetGroup = function (id) {
            var arry = [];
            $.each(position.Task.data, function (i, item) {
                if (id == item.GroupID) {
                    arry.push(i);
                }
            });
            return arry;
        };

        var matching = 2.5;
        //圆角矩形
        var flag = false;
        var DrawRoundRect = function (x, y, width, height, radius, num, color) {

            //context.canvas.

            context.beginPath();

            context.fillStyle = color;
            context.globalCompositeOperation = "source-over";
            context.arc(x + radius, y + 3 + radius, radius, Math.PI, Math.PI * 3 / 2);
            context.lineTo(width - radius + x, y + 3);
            context.arc(width - radius + x, radius + y + 3, radius, Math.PI * 3 / 2, Math.PI * 2);
            context.lineTo(width + x, height - 3 + y + 3 - radius);
            context.arc(width - radius + x, height - 3 - radius + y + 3, radius, 0, Math.PI * 1 / 2);
            context.lineTo(radius + x, height - 3 + y + 3);
            context.arc(radius + x, height - 3 - radius + y + 3, radius, Math.PI * 1 / 2, Math.PI);
            context.fill();

            context.strokeStyle = 'DarkGray';
            context.moveTo(0, y + spacePy);
            context.lineTo(canvas.width, y + spacePy);
            context.stroke();

            context.closePath();
            context.fillStyle = 'white';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            //context.fillText(position.yAxis.data[num], x + width / 2, y + height / 2, width);
            context.fillStyle = 'blue';
            context.fillText(position.Task.data[num].FQTYPlan, 75 + (freedom - 75) / 5 * 3 + (freedom - 75) / 5 / 2, y + height / 2, width);
            context.fillStyle = 'green';
            context.fillText(position.Task.data[num].FQTYDone, 75 + (freedom - 75) / 5 * 4 + (freedom - 75) / 5 / 2, y + height / 2, width);

        }

        //查找哪一个矩形
        var SearchMouseDownRect = function (m_x, m_y, data) {

            var wResult = { wIndex: -1, wIsLeft: 0 }

            for (var i = 0; i < data.length; i++) {

                data[i].startDate = $com.util.format('yyyy-MM-dd', data[i].startDate);

                data[i].startDate = $com.util.format('yyyy-MM-dd hh:mm:ss', data[i].startDate);

                var rectStart_X1 = freedom + ((new Date(data[i].startDate) - new Date(position.series.data[0])) / 1000 / 24 / 3600 * space);

                var rectStart_Y1 = 52 + i * spacePy;

                var rectWidth1 = (position.Task.data[i].time + 1) * space;

                //判断是那行数据
                if (m_y <= rectStart_Y1 || m_y >= rectStart_Y1 + spacePy) {
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
            context.globalAlpha = 0.2;
            context.fillRect(x, y, tipW, tipH);
            context.fillStyle = 'black';
            context.globalAlpha = 1;

            y += 8;

            if (position.tip.title.visible) {
                context.fillText(position.tip.title.text + ":" + position.Task.data[index][position.tip.title.prop],
                    x + (tipW / 2), y, tipW);
                y = y + titleH;
            }
            context.font = "bold 13px Arial";
            for (var i = 0; i < position.tip.line.length; i++) {
                if (!position.tip.line[i].visible)
                    continue;
                //if (!(position.Task.data[index][position.tip.line[0].prop] instanceof Date))
                //position.Task.data[index][position.tip.line[0].prop] = new Date(position.Task.data[index][position.tip.line[0].prop]);

                //position.Task.data[index][position.tip.line[0].prop] = addDate(position.Task.data[index][position.tip.line[0].prop], 0);

                if (i == 3)
                    context.fillText(position.tip.line[i].text + ":" + (parseInt(position.Task.data[index][position.tip.line[i].prop]) + parseInt(1)),
                        x + (tipW / 2), y, tipW);
                else
                    context.fillText(position.tip.line[i].text + ":" + position.Task.data[index][position.tip.line[i].prop],
                        x + (tipW / 2), y, tipW);
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

