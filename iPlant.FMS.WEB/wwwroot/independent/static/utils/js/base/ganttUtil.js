define(['./jquery-3.1.1'], function ($jQ) {


    var position = {
        radius: 4,
        spacePx: 25.0,
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

    };

    var canvas = undefined;
    var context = undefined;

    //  var canvasSource = [];

    function addDate(date, days) {
 	if (!(date instanceof Date))
            date = new Date(date);
 
	if(!days) 
	  days=0;
        var d = date ;
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
    var temp=false;
    var scroll = undefined;
    //Install();
    var install = function (ContainDiv, positionIn) {

        var $scroll = $(' <div style="overflow: auto;"></div>'),
            $canvas = $('<canvas style="border: 1px solid green;float: left;"></canvas>');
        $scroll.html($canvas);

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

        scroll = $scroll[0];
        canvas = $canvas[0];

        //
        context = canvas.getContext('2d');

        //定义区间天数
        days = (new Date(position.series.data[1]) - new Date(position.series.data[0])) / 1000 / 24 / 3600;

        //定义区间周数
        weekDays = days / 7;
        if (days % 7 == 0)
            canvas.width = (days + 7) * space + freedom;
        else {
            console.log(123);
            canvas.width = (days - days % 7 + 7) * space + freedom;
        }
        if (position.contextHight)
            canvas.height = position.contextHight;

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

            // console.log("Index:" + wDownRectResult.wIndex + " Left:" + wDownRectResult.wIsLeft);
            if (wDownRectResult.wIndex < 0)
                return false;
            //alert(eventDown_x);

            canvas.onmousemove = function (evt) {

                eventMove_x = evt.clientX + scrollX - canvas.offsetLeft;
                eventMove_y = evt.clientY + scrollY - canvas.offsetTop;


                var right = eventMove_x - eventDown_x;

              
                var days = right / space;

                //拖动矩形
                if (wDownRectResult.wIsLeft == 2 && new Date(new Date(position.Task.data[wDownRectResult.wIndex].startDate).getTime() + (days * 24 * 3600000)) >= new Date(position.series.data[0]) && new Date(new Date(position.Task.data[wDownRectResult.wIndex].startDate).getTime()
                    + ((position.Task.data[wDownRectResult.wIndex].time + days) * 24 * 3600000)) <= new Date(new Date(position.series.data[1]).getTime() + 24 * 3600000)) {

                    position.Task.data[wDownRectResult.wIndex].startDate =
                    new Date(new Date(position.Task.data[wDownRectResult.wIndex].startDate).getTime() + (days * 24 * 3600000));
                }

                if (days == 0)
                    return;

                if (wDownRectResult.wIsLeft == -1 && days >= position.Task.data[wDownRectResult.wIndex].time)
                    return;

                if (wDownRectResult.wIsLeft == 1 && -days >= position.Task.data[wDownRectResult.wIndex].time)
                    return;

                if (wDownRectResult.wIsLeft == -1 &&
            new Date(new Date(position.Task.data[wDownRectResult.wIndex].startDate).getTime() + (days * 24 * 3600000)) < new Date(position.series.data[0]))
                    return;

                if (wDownRectResult.wIsLeft == 1 && new Date(new Date(position.Task.data[wDownRectResult.wIndex].startDate).getTime()
                   + ((position.Task.data[wDownRectResult.wIndex].time + days) * 24 * 3600000)) > new Date(new Date(position.series.data[1]).getTime() + 24 * 3600000))
                    return;

                
                if (wDownRectResult.wIsLeft == -1) {
		   if(days>0){
                    console.log("days:" + days); 
	            console.log("1==Date:" + addDate( position.Task.data[wDownRectResult.wIndex].startDate)+"  "
			+ "time:" +  position.Task.data[wDownRectResult.wIndex].time); 
		   }

                    position.Task.data[wDownRectResult.wIndex].startDate =
                        new Date(new Date(position.Task.data[wDownRectResult.wIndex].startDate).getTime() + (days * 24 * 3600000));
                    position.Task.data[wDownRectResult.wIndex].time -= days;
                   
		   if(days>0){  
	            console.log("2==Date:" + addDate( position.Task.data[wDownRectResult.wIndex].startDate)+"  DateTime:"+position.Task.data[wDownRectResult.wIndex].startDate.getTime()
			+ "   time:" +  position.Task.data[wDownRectResult.wIndex].time); 
		   }
	            
                }
                else if (wDownRectResult.wIsLeft == 1) {
                    position.Task.data[wDownRectResult.wIndex].time += days;
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

                item.startDate =  new Date(Math.round(item.startDate.getTime() / (24 * 3600000))* (24 * 3600000));



              	if(time !=item.startDate.getTime()){
		 
		   item.time  += ((time -item.startDate.getTime())/ (24 * 3600000));
		   
		   
		}else{
		   item.time = Math.round(item.time);
		}
 		
		
            });
            ResfushCanvas(position.Task.data);


        };

        $(canvas).mousemove(function (evt) {
		
	   if(temp)
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
                Tips(eventOver_x, eventOver_y, zzz.wIndex);
            }

        });
    };

    //画布上绘制任务时间矩形
    var ResfushCanvasOne = function (task, startDate, days, num, color) {

        var rectStart_X, rectStart_Y, rectWidth;

        if (!(startDate instanceof Date))
            startDate = new Date(startDate);

        rectStart_X = freedom + (((startDate - new Date(position.series.data[0])) / (24 * 3600000)) * space);

        rectStart_Y = 35 + (task - 1) * space;

        rectWidth = days * space;

        DrawRoundRect(rectStart_X, rectStart_Y, rectWidth, space, radius, num, color);

    }

    //重绘画布
    var ResfushCanvas = function (data) {

        if (!data) {
            data = position.Task.data;
        }
        //清除Canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        CanvasBasic();

        //画数据

        for (var i = 0; i < data.length; i++) {

            ResfushCanvasOne(i + 1, data[i].startDate, data[i].time, i , data[i].color);
        }

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

            context.strokeStyle = 'green';
            context.moveTo(i * 7 * space + freedom, 0);
            context.lineTo(i * 7 * space + freedom, canvas.height);
            context.stroke();
        }
        for (var j = 0; j <= days; j++) {
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
                    context.fillText("天", space * j + space / 2 + freedom, 31, space);
                context.fill();
            }
            //画日期下竖线
            context.beginPath();
            context.strokeStyle = 'DarkGray';
            context.moveTo(j * space + freedom, 18);
            context.lineTo(j * space + freedom, canvas.height);
            if (j == days) {
                context.strokeStyle = 'DarkGray';
                context.moveTo((j+1) * space + freedom, 18);
                context.lineTo((j+1) * space + freedom, canvas.height);
            }
            context.stroke();
            context.closePath();

        }

        //画横线
        context.strokeStyle = 'green';
        context.moveTo(0 + freedom, 18);
        context.lineTo(canvas.width + freedom, 18);

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

    var matching = 2.5;
    //圆角矩形
    var flag = false;
    var DrawRoundRect = function (x, y, width, height, radius, num, color) {

        //context.canvas.

        context.beginPath();

        context.fillStyle = color;
        context.globalCompositeOperation = "source-over  ";
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
        context.fillText(position.yAxis.data[num], x + width / 2 , y + height / 2);

    }

    //查找哪一个矩形
    var SearchMouseDownRect = function (m_x, m_y, data) {

        var wResult = { wIndex: -1, wIsLeft: 0 }

        for (var i = 0; i < data.length; i++) {

		
            var rectStart_X1 = freedom + ((new Date(data[i].startDate) - new Date(position.series.data[0])) / 1000 / 24 / 3600 * space);

            var rectStart_Y1 = 35 + i * space;

            var rectWidth1 = position.Task.data[i].time * space;

            //判断是那行数据
            if (m_y <= rectStart_Y1 || m_y >= rectStart_Y1 + space) {
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
        lineH = position.tip.Text.lineH ? position.tip.Text.tilineHpW : lineH;
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
            if (!(position.Task.data[index][position.tip.line[0].prop] instanceof Date))
                position.Task.data[index][position.tip.line[0].prop] = new Date(position.Task.data[index][position.tip.line[0].prop]);

            position.Task.data[index][position.tip.line[0].prop] = addDate(position.Task.data[index][position.tip.line[0].prop], 0);
            context.fillText(position.tip.line[i].text + ":" + position.Task.data[index][position.tip.line[i].prop],
                x + (tipW / 2), y , tipW);
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


