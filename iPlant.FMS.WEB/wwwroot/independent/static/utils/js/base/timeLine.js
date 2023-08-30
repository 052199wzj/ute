define(['../jquery-3.1.1', './base'], function ($jq, $com) {
    var parms = {
        contain: $("body"), //将canvas放在哪个父级
        //原始数据
        data: [
            {
                beginTime: 0,
                endTime:0,
                status: 1,
            }
        ],
        //显示数据
        dataShow: [
            {
                text: "开始时间:",
                num: 0,
                id:1
            },
            {
                text: "结束时间:",
                num: 0,
                id:2
            },
            {
                text: "状态:",
                num: 0,
                id: 3
            },
        ],
        days: 50,//选择的天数
        showDays: 0,//选择显示的天数
        spaceLength: 60,//单位刻度的长度
        spaceCount: 0,//总共多少格
        screenWidth: 0,//屏幕宽度
        startTime: "2019-06-25 15:15:21",//选择开始的时间
        countTime: 0,//选择的总时长(ms单位)
        oneSpaceTime: 0,//每格代表的时间
        oneTimeLenght: 0,//单位时间的长度（px/ms）
        rectY: 150,//框图默认高度
        aroundArrY: [],
        aroundedArrY: [],
        aroundedObjY:{},
        aroundObjY: {},
        canvasParams:{
            height: 800,//canvas的高度
        },
        rectangleParams:{
            rectangleX: 0,
            rectangleY: 400,
            rectangleHeight: 4,
            rectangleRadius: 2,
            rectangleColor: "#C5C8D1"
        },
        lineParams:{
            lineX: 30,
            lineY: 400,
            lineHeight: 2,
            lineSpace: 30,
            lineColor: "#97A6B2"
        },
        rectParams:{
            rectY: 150,
            rectWidth: 100,
            rectHeight: 50,
            rectColor: "#FFB6C1"
        },
        rectLineParams: {
            rectLineY: 400,
            rectLineHeight: 250,
            rectLineColor: "#C0C0C0"
        },
        circleParams: {
            circleY: 400,
            circleR: 4,
            circleColor: "#FFB6C1"
        },
        textParams: {
            font: "14px Verdana",
            fontColor: "#fff"
        }
    }
    var HTML = {
        canvas: "<canvas></canvas>"
    }
    var oneDayLength, $canvas = $('<canvas></canvas>');;
    var showTimeLine = function (parms, dataShow) {
        //1 先确定canvas的父级
        var farDiv = parms.contain;
        farDiv.html($canvas);

        //2 确定canvas的宽高
        //parms.canvasParams.width = parms.screenWidth;
        $canvas[0].width = parms.canvasParams.width-5;
        $canvas[0].height = parms.canvasParams.height;

        //3 获取画笔
        ctx = $canvas[0].getContext("2d");

        //4 画轴
        parms.rectangleParams.rectangleWidth = $canvas[0].width;
        parms.rectangleParams.rectangleY = parms.canvasParams.height / 2;
        //drawRectangle(ctx, parms.rectangleParams.rectangleX, parms.rectangleParams.rectangleY, parms.rectangleParams.rectangleWidth, parms.rectangleParams.rectangleHeight, parms.rectangleParams.rectangleRadius, parms.rectangleParams.rectangleRadius);

        ctx.strokeStyle = parms.rectangleParams.rectangleColor;
        ctx.stroke();

        //5 画刻度
        oneDayLength = parms.oneTimeLenght;
        parms.lineParams.lineSpace = parms.spaceLength;
        parms.lineParams.lineX = parms.lineParams.lineSpace;
        parms.lineParams.lineY = parms.rectangleParams.rectangleY;
        //drawLine(ctx, parms.lineParams.lineX, parms.lineParams.lineY, $canvas[0].width, parms.lineParams.lineHeight, parms.lineParams.lineSpace, parms.lineParams.lineColor,parms);

        parms.rectLineParams.rectLineY = parms.rectangleParams.rectangleY;
        parms.circleParams.circleY = parms.rectangleParams.rectangleY;

        //6 画框图
        var _data = parms.data;
        var resolveStatus = [],
            resolvedStatus = [];
        //确定框图的起始坐标
        var startX = 0;

        $.each(_data, function (i, item) {
            //确定框图的颜色
            switch(item.status){
                case 0:
                    //默认 ： 轴上面
                    item.color = "#ABB3B8";
                    resolveStatus.push(item);
                    break;
                case 1:
                    //待处理 ： 轴上面
                    item.color = "#DE0F0C";
                    resolveStatus.push(item);
                    break;
                case 2:
                    //收到待处理 ： 轴上面
                    item.color = "#EB6F6D";
                    resolveStatus.push(item);
                    break;
                case 3:
                    //到场待处理 ： 轴上面
                    item.color = "#F29F9E";
                    resolveStatus.push(item);
                    break;
                case 4:
                    //待确认 ： 轴上面
                    item.color = "#F8AB0B";
                    resolveStatus.push(item);
                    break;
                case 5:
                    //已转发 ： 轴上面
                    item.color = "#46D8F9";
                    resolveStatus.push(item);
                    break;
                case 6:
                    //已确认 ： 轴下面
                    item.color = "#67DE4F";
                    resolvedStatus.push(item);
                    break;
                case 7:
                    //驳回待处理 ： 轴上面
                    item.color = "#D1F5FE";
                    resolveStatus.push(item);
                    break;
                case 8:
                    //超时上报 ：轴上面
                    item.color = "#FBCD6D";
                    resolveStatus.push(item);
                    break;
                case 9:
                    //已撤销 ： 轴下面
                    item.color = "#C3B3D3";
                    resolvedStatus.push(item);
                    break;
            }
        });
        //找出轴的y轴范围 确定canvas的高度
        var minYUp = changeSameTimeY(resolveStatus, parms);
        parms.aroundArrY = [];
        var maxYDown=changedSameTimeY(resolvedStatus, parms);
        parms.aroundedArrY = [];

        if (minYUp < 0) {
            parms.canvasParams.height = (Math.abs(minYUp)) + parms.canvasParams.height;
            heightChange(parms.canvasParams.height, parms);
        }
        
        if ((maxYDown + parms.rectParams.rectHeight + 5) > parms.canvasParams.height) {
            parms.canvasParams.height = (maxYDown + (parms.rectParams.rectHeight + 5) * 2) + parms.rectParams.rectHeight;
            //parms.canvasParams.height = maxYDown+ parms.rectParams.rectHeight+5;
            heightChange(parms.canvasParams.height, parms);
        }
        

        //7 画图
        //画轴
        drawRectangle(ctx, parms.rectangleParams.rectangleX, parms.rectangleParams.rectangleY, parms.rectangleParams.rectangleWidth, parms.rectangleParams.rectangleHeight, parms.rectangleParams.rectangleRadius, parms.rectangleParams.rectangleRadius);
        //画刻度
        drawLine(ctx, parms.lineParams.lineX, parms.lineParams.lineY, $canvas[0].width, parms.lineParams.lineHeight, parms.lineParams.lineSpace, parms.lineParams.lineColor, parms);
        
        //画框线
        changeSameTimeX(resolveStatus, dataShow, ctx, startX, parms.rectParams.rectColor, parms);
        changedSameTimeX(resolvedStatus, dataShow, ctx, startX, parms.rectParams.rectColor, parms);
        parms.aroundArrY = [];
        parms.aroundedArrY = [];
        //画框图
        changeSameTime(resolveStatus, dataShow, ctx, startX, parms.rectParams.rectColor, parms);
        changedSameTime(resolvedStatus, dataShow, ctx, startX, parms.rectParams.rectColor, parms);
    }

    //画圆角矩形:参数（）
    var drawRectangle = function (cxt, x, y, width, height, radius,color) {
        cxt.beginPath();
        cxt.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 3 / 2);
        cxt.lineTo(width - radius + x, y);
        cxt.arc(width - radius + x, radius + y, radius, Math.PI * 3 / 2, Math.PI * 2);
        cxt.lineTo(width + x, height + y - radius);
        cxt.arc(width - radius + x, height - radius + y, radius, 0, Math.PI * 1 / 2);
        cxt.lineTo(radius + x, height + y);
        cxt.arc(radius + x, height - radius + y, radius, Math.PI * 1 / 2, Math.PI);
        cxt.closePath();
    }

    //循环生成时间轴刻度:参数 （起始坐标 刻度总长度，线长度,间隔长度，颜色）
    var drawLine = function (ctx,x, y, length,lineLenght,spaceLength,color,parms) {
        var drawLineUp = function (x, y, length) {
            for (var i = x; i <= length; i = i + spaceLength) {
                ctx.moveTo(x, y);
                ctx.lineTo(x, y - lineLenght);
                x = x + spaceLength;
                ctx.strokeStyle = color;
                ctx.stroke();
            }
        }
        var drawLineDown = function (x, y, length,lineLenght) {
            var startTime = new Date(parms.startTime).getTime(),
                _startTime = startTime + parms.oneSpaceTime,
                text = $com.util.format("hh:mm", _startTime),//转换为小时分钟样式
                _text = timeToSec(text);//转换为毫秒样式
            for (var i = x; i <= length; i = i + spaceLength) {
                //画刻度
                ctx.moveTo(x, y);
                ctx.lineTo(x, y - lineLenght);
                x = x + spaceLength;
                ctx.strokeStyle = color;
                ctx.stroke();

                //画刻度时间
                if (_text < 24 * 3600 * 1000) {
                    drawFont(ctx, parms.textParams.font, parms.textParams.fontColor, text, x - spaceLength-15, y + 2 * lineLenght);
                    _startTime = _startTime + parms.oneSpaceTime;
                    text = $com.util.format("hh:mm", _startTime),//转换为小时分钟样式
                    _text = timeToSec(text);//转换为毫秒样式
                }
                else if (_text > 24 * 3600 * 1000) {
                    _startTime = _startTime - 24 * 3600 * 1000,
                    text = $com.util.format("hh:mm", _startTime);
                    _text = timeToSec(text);//转换为毫秒样式
                    drawFont(ctx, parms.textParams.font, parms.textParams.fontColor, text, x - spaceLength-15, y + 2 * lineLenght);
                }
            }
        }
        drawLineUp(x, y, length, lineLenght, spaceLength);
        drawLineDown(x, y + 2 * parms.rectangleParams.rectangleHeight, length, lineLenght, spaceLength);
    }

    var timeToSec = function (time) {
        var hour = time.split(':')[0],
            min = time.split(":")[1],
            s = Number(hour * 3600) + Number(min * 60);
        return s*1000;
    }
    //画框图：参数（起始坐标，框图宽高，框图颜色）
    var drawRect = function (ctx,x, y, width, height, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);
    }

    //画框线：参数（起始坐标，长度,颜色）
    var drawRectLine = function (ctx,x, y, height,color) {
        ctx.moveTo(x, y);
        ctx.lineTo(x, y - height);
        ctx.strokeStyle = color;
        ctx.stroke();
    }

    //画圆点:参数（起始坐标，半径，颜色）
    var drawCircle = function (ctx,x, y, r,color) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.fill();
    }

    //画文字的方法:参数（）
    var drawFont = function (ctx,font,color,text, x, y) {
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.fillText(text,x,y)
    }

    //清除画布的方法
    var cleanRect = function (ctx,x, y, width, height) {
        ctx.clearRect(x,y, width, height);
    }

    //确定Y轴范围
    //判断数据开始时间在同一时间的时候(未处理)
    var changeSameTimeY = function (data, parms) {
        //1 将原始数据中相同时间开始的放在一起
        var sameTime = [],
            newSameTime = [],
            _data = data;

        for (var i = 0, j = data.length; i < j; i++) {
            if (i != j - 1) {
                if (data[i].beginTime == data[i + 1].beginTime) {
                    sameTime.push(data[i]);
                }
                else {
                    sameTime.push(data[i]);
                    newSameTime.push(sameTime.slice(0));
                    sameTime.length = 0;
                }
            }
            else {
                sameTime.push(data[i]);
                newSameTime.push(sameTime.slice(0));
                sameTime.length = 0;
            }
        }
        //2 判断是否需要左右错开：newSameTime:相同状态下的已按时间分组的数组
        var minTime,
            orderNewArr = [];
        //3 先将时间从小到大排列
        for (var i = 0; i < newSameTime.length; i++) {
            for (var j = i; j < newSameTime.length; j++) {
                if (newSameTime[i][0].beginTime > newSameTime[j][0].beginTime) {
                    minTime = newSameTime[j];
                    newSameTime[j] = newSameTime[i];
                    newSameTime[i] = minTime;
                }
            }
        }
        orderNewArr = newSameTime;

        //4 比较前后两个时间之间的距离间隔，在范围之内就错开 
        var beforeTimeX,
            afterTimeX,
            timeIntervalX;
        for (var i = 0; i <= orderNewArr.length - 1; i++) {
            if (i == 0) {
                //遍历每个数组 分开布局 
                $.each(orderNewArr[i], function (j, j_item) {
                    //parms.rectParams.rectY = parms.rectY + (j * (parms.rectParams.rectHeight + 5));
                    parms.rectParams.rectY = parms.rectangleParams.rectangleY - parms.rectY + (j * (parms.rectParams.rectHeight + 5));
                    var n = 1;
                    if (parms.rectParams.rectY > parms.rectangleParams.rectangleY) {
                        parms.rectParams.rectY = (parms.rectangleParams.rectangleY - parms.rectY) - (n * (parms.rectParams.rectHeight + 5));
                        n++;
                    }
                    parms.aroundArrY.push(parms.rectParams.rectY);
                });
            }
            else {
                var beforeTime, beforeTimeX,
                afterTime, afterTimeX,
                timeIntervalX;
                //1 找到前后时间
                $.each(orderNewArr[i - 1], function (_i, _item) {
                    beforeTime = _item.beginTime;
                });
                $.each(orderNewArr[i], function (_j, j_item) {
                    afterTime = j_item.beginTime;
                });
                //2 找到前后时间X轴的差值
                beforeTimeX = (new Date(beforeTime).getTime()) * oneDayLength;
                afterTimeX = (new Date(afterTime).getTime()) * oneDayLength;
                timeIntervalX = (afterTimeX - beforeTimeX);
                //3 判断前后时间是否在这个范围内 
                //1)如果在这个时间范围内，则调用左右错开方法
                if (timeIntervalX < parms.rectParams.rectWidth) {
                    var beforeArr = orderNewArr[i - 1],
                        afterArr = orderNewArr[i];
                    changeCloseTimeY(beforeArr, afterArr, parms);
                }
                    //2)不在此范围内则直接画
                else {
                    //遍历每个数组 分开布局
                    $.each(orderNewArr[i], function (m, m_item) {
                        parms.rectParams.rectY = parms.rectangleParams.rectangleY - parms.rectY + (m * (parms.rectParams.rectHeight + 5));
                        if (parms.rectParams.rectY > parms.rectangleParams.rectangleY) {
                            parms.rectParams.rectY = parms.rectY - (m * (parms.rectParams.rectHeight + 5));
                        }
                        parms.aroundArrY.push(parms.rectParams.rectY);
                        
                    });
                }
            }
        }
        var arr = getOrder(parms.aroundArrY)
            minY=parms.aroundArrY[0];
        return minY;
    };
    //判断数据开始时间在同一时间的时候(已处理)
    var changedSameTimeY = function (data, parms) {
        //1 按照相同时间分组
        var sameTime = [],
            newSameTime = [],
            _data = data;

        for (var i = 0, j = data.length; i < j; i++) {
            if (i != j - 1) {
                if (data[i].beginTime == data[i + 1].beginTime) {
                    sameTime.push(data[i]);
                }
                else {
                    sameTime.push(data[i]);
                    newSameTime.push(sameTime.slice(0));
                    sameTime.length = 0;
                }
            }
            else {
                sameTime.push(data[i]);
                newSameTime.push(sameTime.slice(0));
                sameTime.length = 0;
            }
        }
        //2 从小到大排序
        var minTime,
            orderNewArr = [];
        for (var i = 0; i < newSameTime.length; i++) {
            for (var j = i; j < newSameTime.length; j++) {
                if (newSameTime[i][0].beginTime > newSameTime[j][0].beginTime) {
                    minTime = newSameTime[j];
                    newSameTime[j] = newSameTime[i];
                    newSameTime[i] = minTime;
                }
            }
        }
        orderNewArr = newSameTime;

        //3 判断是否需要错开布局
        var beforeTimeX,
            afterTimeX,
            timeIntervalX;
        for (var i = 0; i < orderNewArr.length; i++) {
            if (i == 0) {
                parms.aroundedArrY = [];
                // 遍历每个数组 分开布局
                $.each(orderNewArr[i], function (j, j_item) {
                    parms.rectParams.rectY = parms.rectangleParams.rectangleY + parms.rectY - (j * (parms.rectParams.rectHeight + 5));
                    if (parms.rectParams.rectY < parms.rectangleParams.rectangleY) {
                        parms.rectParams.rectY = parms.rectangleParams.rectangleY + parms.rectY + ((j+1) * (parms.rectParams.rectHeight + 5));
                    }
                    parms.aroundedArrY.push(parms.rectParams.rectY);
                   
                });
            }
            else {
                var beforeTime, beforeTimeX,
                    afterTime, afterTimeX,
                    timeIntervalX;
                //1 找到前后时间
                $.each(orderNewArr[i - 1], function (_i, _item) {
                    beforeTime = _item.beginTime;
                });
                $.each(orderNewArr[i], function (_j, j_item) {
                    afterTime = j_item.beginTime;
                });
                //2 找到前后时间X轴的差值
                beforeTimeX = (new Date(beforeTime).getTime()) * oneDayLength;
                afterTimeX = (new Date(afterTime).getTime()) * oneDayLength;
                timeIntervalX = (afterTimeX - beforeTimeX);

                //3 判断前后时间是否在这个范围内 
                //1)如果在这个时间范围内，则调用左右错开方法
                if (timeIntervalX < parms.rectParams.rectWidth) {
                    var beforeArr = orderNewArr[i - 1],
                        afterArr = orderNewArr[i];
                    changedCloseTimeY(beforeArr, afterArr, parms);
                }
                    //2)不在此范围内则直接画
                else {
                    $.each(orderNewArr[i], function (m, m_item) {
                        parms.rectParams.rectY = parms.rectangleParams.rectangleY + parms.rectY - (m * (parms.rectParams.rectHeight + 5));
                        if (parms.rectParams.rectY < parms.rectangleParams.rectangleY) {
                            parms.rectParams.rectY = parms.rectangleParams.rectangleY + parms.rectY + (m * (parms.rectParams.rectHeight + 5));
                        }
                        parms.aroundedArrY.push(parms.rectParams.rectY);
                    });
                }
            }
        }
        var arr = getOrder(parms.aroundedArrY),
            n = parms.aroundedArrY.length - 1,
            minY = arr[n];
        return minY;
    };
    //处理左右间隔错开的问题 （未处理）
    var changeCloseTimeY = function (beforeArr,afterArr,parms){
        // 找到前一个时间范围的最大最小高度
        var arr = getOrder(parms.aroundArrY),
            n = arr.length - 1;
        minY = arr[0];
        maxY = arr[n];
        //错开布局
        $.each(afterArr, function (k, k_item) {
            //确定框图y轴
            parms.rectParams.rectY = maxY + ((k + 1) * (parms.rectParams.rectHeight + 5));
            if ((parms.rectParams.rectY + parms.rectParams.rectHeight) > parms.rectangleParams.rectangleY) {
                parms.rectParams.rectY = minY - parms.rectParams.rectHeight - ((k + 1) * (parms.rectParams.rectHeight + 5));
            }
            parms.aroundArrY.push(parms.rectParams.rectY);
        });
       
    }
    //处理左右间隔错开的问题 （已处理）
    var changedCloseTimeY = function (beforeArr, afterArr, parms) {
        //1 找到前一项Y轴范围
        $.each(beforeArr, function (i, item) {
            ////1 找到前一项的时间
            //var beforeTime;
            //beforeTime = item.beginTime;

            //找到最大最小高度
            var arr = getOrder(parms.aroundedArrY),
                n = arr.length - 1;
            minY = arr[0];
            maxY = arr[n];
            //beforeTimeArrY = [];
        })
        //3 错开这个y轴范围
        $.each(afterArr, function (k, k_item) {
            //确定框图y轴
            parms.rectParams.rectY = minY - ((k + 1) * (parms.rectParams.rectHeight + 5));
            if (parms.rectParams.rectY < parms.rectangleParams.rectangleY) {
                parms.rectParams.rectY = maxY + ((k + 1) * (parms.rectParams.rectHeight + 5));
            }
            parms.aroundedArrY.push(parms.rectParams.rectY);
        });
    }

    //画轴
    //判断数据开始时间在同一时间的时候(未处理)
    var changeSameTimeX = function (data, dataShow, ctx, startX, color, parms) {
        //1 将原始数据中相同时间开始的放在一起
        var sameTime = [],
            newSameTime = [],
            _data = data;

        for (var i = 0, j = data.length; i < j; i++) {
            if (i != j - 1) {
                if (data[i].beginTime == data[i + 1].beginTime) {
                    sameTime.push(data[i]);
                }
                else {
                    sameTime.push(data[i]);
                    newSameTime.push(sameTime.slice(0));
                    sameTime.length = 0;
                }
            }
            else {
                sameTime.push(data[i]);
                newSameTime.push(sameTime.slice(0));
                sameTime.length = 0;
            }
        }
        //2 判断是否需要左右错开：newSameTime:相同状态下的已按时间分组的数组
        var minTime,
            orderNewArr = [];
        //3 先将时间从小到大排列
        for (var i = 0; i < newSameTime.length; i++) {
            for (var j = i; j < newSameTime.length; j++) {
                if (newSameTime[i][0].beginTime > newSameTime[j][0].beginTime) {
                    minTime = newSameTime[j];
                    newSameTime[j] = newSameTime[i];
                    newSameTime[i] = minTime;
                }
            }
        }
        orderNewArr = newSameTime;

        //4 比较前后两个时间之间的距离间隔，在范围之内就错开 
        var beforeTimeX,
            afterTimeX,
            timeIntervalX;
        for (var i = 0; i <= orderNewArr.length - 1; i++) {
            if (i == 0) {
                //遍历每个数组 分开布局 
                $.each(orderNewArr[i], function (j, j_item) {
                    //parms.rectParams.rectY = parms.rectY + (j * (parms.rectParams.rectHeight + 5));
                    parms.rectParams.rectY = parms.rectangleParams.rectangleY - parms.rectY + (j * (parms.rectParams.rectHeight + 5));
                    var n = 1;
                    if (parms.rectParams.rectY > parms.rectangleParams.rectangleY) {
                        parms.rectParams.rectY = (parms.rectangleParams.rectangleY - parms.rectY) - (n * (parms.rectParams.rectHeight + 5));
                        n++;
                    }
                    parms.aroundArrY.push(parms.rectParams.rectY);
                    //parms.aroundObjY[j_item.beginTime] = parms.aroundArrY;
                    var _beginTime = new Date(j_item.beginTime).getTime(),
                        _startTime = new Date(parms.startTime).getTime(),
                        partTime = _beginTime - _startTime;
                    startX = partTime * oneDayLength;

                    color = j_item.color;
                    parms.rectLineParams.rectLineHeight = parms.rectangleParams.rectangleY - parms.rectParams.rectY;
                    //画框线
                    drawRectLine(ctx, startX, parms.rectLineParams.rectLineY, parms.rectLineParams.rectLineHeight, parms.rectLineParams.rectLineColor);

                });
            }
            else {
                var beforeTime, beforeTimeX,
                afterTime, afterTimeX,
                timeIntervalX;
                //1 找到前后时间
                $.each(orderNewArr[i - 1], function (_i, _item) {
                    beforeTime = _item.beginTime;
                });
                $.each(orderNewArr[i], function (_j, j_item) {
                    afterTime = j_item.beginTime;
                });
                //2 找到前后时间X轴的差值
                beforeTimeX = (new Date(beforeTime).getTime()) * oneDayLength;
                afterTimeX = (new Date(afterTime).getTime()) * oneDayLength;
                timeIntervalX = (afterTimeX - beforeTimeX);
                //3 判断前后时间是否在这个范围内 
                //1)如果在这个时间范围内，则调用左右错开方法
                if (timeIntervalX < parms.rectParams.rectWidth) {
                    var beforeArr = orderNewArr[i - 1],
                        afterArr = orderNewArr[i];
                    changeCloseTimeX(beforeArr, afterArr, dataShow, ctx, startX, color, parms);
                }
                    //2)不在此范围内则直接画
                else {
                    parms.aroundArrY = [];
                    //遍历每个数组 分开布局
                    $.each(orderNewArr[i], function (m, m_item) {
                        parms.rectParams.rectY = parms.rectangleParams.rectangleY - parms.rectY - (m * (parms.rectParams.rectHeight + 5));
                        if (parms.rectParams.rectY > parms.rectangleParams.rectangleY) {
                            parms.rectParams.rectY = parms.rectY - (m * (parms.rectParams.rectHeight + 5));
                        }
                        parms.aroundArrY.push(parms.rectParams.rectY);
                        //parms.aroundObjY[m_item.beginTime] = parms.aroundArrY;
                        var _beginTime = new Date(m_item.beginTime).getTime(),
                            _startTime = new Date(parms.startTime).getTime(),
                            partTime = _beginTime - _startTime;
                        startX = partTime * oneDayLength;

                        color = m_item.color;
                        
                        //画框线
                        parms.rectLineParams.rectLineHeight = parms.rectangleParams.rectangleY - parms.rectParams.rectY;
                        drawRectLine(ctx, startX, parms.rectLineParams.rectLineY, parms.rectLineParams.rectLineHeight, parms.rectLineParams.rectLineColor);
                    });
                }
            }
        }

    };
    //判断数据开始时间在同一时间的时候(已处理)
    var changedSameTimeX = function (data, dataShow, ctx, startX, color, parms) {
        //1 按照相同时间分组
        var sameTime = [],
            newSameTime = [],
            _data = data;

        for (var i = 0, j = data.length; i < j; i++) {
            if (i != j - 1) {
                if (data[i].beginTime == data[i + 1].beginTime) {
                    sameTime.push(data[i]);
                }
                else {
                    sameTime.push(data[i]);
                    newSameTime.push(sameTime.slice(0));
                    sameTime.length = 0;
                }
            }
            else {
                sameTime.push(data[i]);
                newSameTime.push(sameTime.slice(0));
                sameTime.length = 0;
            }
        }
        //2 从小到大排序
        var minTime,
            orderNewArr = [];
        for (var i = 0; i < newSameTime.length; i++) {
            for (var j = i; j < newSameTime.length; j++) {
                if (newSameTime[i][0].beginTime > newSameTime[j][0].beginTime) {
                    minTime = newSameTime[j];
                    newSameTime[j] = newSameTime[i];
                    newSameTime[i] = minTime;
                }
            }
        }
        orderNewArr = newSameTime;

        //3 判断是否需要错开布局
        var beforeTimeX,
            afterTimeX,
            timeIntervalX;
        for (var i = 0; i < orderNewArr.length; i++) {
            if (i == 0) {
                parms.aroundedArrY = [];
                // 遍历每个数组 分开布局
                $.each(orderNewArr[i], function (j, j_item) {
                    parms.rectParams.rectY = parms.rectangleParams.rectangleY + parms.rectY - (j * (parms.rectParams.rectHeight + 5));
                    if (parms.rectParams.rectY < parms.rectangleParams.rectangleY) {
                        parms.rectParams.rectY = parms.rectangleParams.rectangleY + parms.rectY + (j * (parms.rectParams.rectHeight + 5));
                    }
                    parms.aroundedArrY.push(parms.rectParams.rectY);
                    //parms.aroundedObjY[j_item.beginTime] = parms.aroundedArrY;

                    var _beginTime = new Date(j_item.beginTime).getTime(),
                        _startTime = new Date(parms.startTime).getTime(),
                        partTime = _beginTime - _startTime;
                    startX = partTime * oneDayLength;

                    color = j_item.color;
                    
                    //画框线
                    parms.rectLineParams.rectLineHeight = parms.rectangleParams.rectangleY - parms.rectParams.rectY - parms.rectParams.rectHeight;
                    drawRectLine(ctx, startX, parms.rectLineParams.rectLineY, parms.rectLineParams.rectLineHeight, parms.rectLineParams.rectLineColor);
                    
                });
                
            }
            else {
                var beforeTime, beforeTimeX,
                    afterTime, afterTimeX,
                    timeIntervalX;
                //1 找到前后时间
                $.each(orderNewArr[i - 1], function (_i, _item) {
                    beforeTime = _item.beginTime;
                });
                $.each(orderNewArr[i], function (_j, j_item) {
                    afterTime = j_item.beginTime;
                });
                //2 找到前后时间X轴的差值
                beforeTimeX = (new Date(beforeTime).getTime()) * oneDayLength;
                afterTimeX = (new Date(afterTime).getTime()) * oneDayLength;
                timeIntervalX = (afterTimeX - beforeTimeX);

                //3 判断前后时间是否在这个范围内 
                //1)如果在这个时间范围内，则调用左右错开方法
                if (timeIntervalX < parms.rectParams.rectWidth) {
                    var beforeArr = orderNewArr[i - 1],
                        afterArr = orderNewArr[i];
                    changedCloseTimeX(beforeArr, afterArr, dataShow, ctx, startX, color, parms);
                }
                    //2)不在此范围内则直接画
                else {
                    parms.aroundedArrY = [];
                    $.each(orderNewArr[i], function (m, m_item) {
                        parms.rectParams.rectY = parms.rectangleParams.rectangleY + parms.rectY - (m * (parms.rectParams.rectHeight + 5));
                        if (parms.rectParams.rectY < parms.rectangleParams.rectangleY) {
                            parms.rectParams.rectY = parms.rectangleParams.rectangleY + parms.rectY + (m * (parms.rectParams.rectHeight + 5));
                        }
                        parms.aroundedArrY.push(parms.rectParams.rectY);
                        //parms.aroundedObjY[m_item.beginTime] = parms.aroundedArrY;

                        var _beginTime = new Date(m_item.beginTime).getTime(),
                            _startTime = new Date(parms.startTime).getTime(),
                            partTime = _beginTime - _startTime;
                        startX = partTime * oneDayLength;

                        color = m_item.color;
                        
                        //画框线
                        parms.rectLineParams.rectLineHeight = parms.rectangleParams.rectangleY - parms.rectParams.rectY - parms.rectParams.rectHeight;
                        drawRectLine(ctx, startX, parms.rectLineParams.rectLineY, parms.rectLineParams.rectLineHeight, parms.rectLineParams.rectLineColor);
                        
                    });
                }
            }
        }

    };
    //处理左右间隔错开的问题 （未处理）
    var changeCloseTimeX = function (beforeArr, afterArr, dataShow, ctx, startX, color, parms) {
        //遍历数组 找到当前项的前一项的y轴范围
        $.each(beforeArr, function (i, item) {
            //1 找到前一项的时间
            var sameTimeBeforeArr = [],
                sameTimeAfterArr = [],
                beforeTime;
            beforeTime = item.beginTime;

            //2 找到当前时间的前一个时间对应的所有长度
            //var beforeTimeArrY = [];
            //$.each(parms.aroundObjY, function (key, value) {
            //    if (key == beforeTime) {
            //        beforeTimeArrY = value;
            //    }
            //});

            //3 找到最大最小高度
            var arr = getOrder(parms.aroundArrY),
                n = arr.length - 1;
            minY = arr[0];
            maxY = arr[n];
            //beforeTimeArrY = [];

        });

        //错开布局
        $.each(afterArr, function (k, k_item) {
            //确定框图y轴
            parms.rectParams.rectY = maxY + ((k + 1) * (parms.rectParams.rectHeight + 5));
            if ((parms.rectParams.rectY + parms.rectParams.rectHeight) > parms.rectangleParams.rectangleY) {
                parms.rectParams.rectY = minY - parms.rectParams.rectHeight - ((k + 1) * (parms.rectParams.rectHeight + 5)) + parms.rectParams.rectHeight;
            }
            parms.aroundArrY.push(parms.rectParams.rectY);
            //parms.aroundObjY[k_item.beginTime] = parms.aroundArrY;

            var _beginTime = new Date(k_item.beginTime).getTime(),
                _startTime = new Date(parms.startTime).getTime(),
                partTime = _beginTime - _startTime;
            startX = partTime * oneDayLength;

            color = k_item.color;
            

            //画框线
            parms.rectLineParams.rectLineHeight = parms.rectangleParams.rectangleY - parms.rectParams.rectY;
            drawRectLine(ctx, startX, parms.rectLineParams.rectLineY, parms.rectLineParams.rectLineHeight, parms.rectLineParams.rectLineColor);

        });
    };
    //处理左右间隔错开的问题 （已处理）
    var changedCloseTimeX = function (beforeArr, afterArr, dataShow, ctx, startX, color, parms) {
        //1 找到前一项Y轴范围
        $.each(beforeArr, function (i, item) {
            //1 找到前一项的时间
            var beforeTime;
            beforeTime = item.beginTime;

            //2 找到当前时间的前一个时间对应的所有长度
            //var beforeTimeArrY = [];
            //$.each(parms.aroundedArrY, function (i, item) {
            //        beforeTimeArrY = value;
            //});
            //3 找到最大最小高度
            var arr = getOrder(parms.aroundedArrY),
                n = arr.length - 1;
            minY = arr[0];
            maxY = arr[n];
            //beforeTimeArrY = [];
        })
        //2 错开这个y轴范围
        $.each(afterArr, function (k, k_item) {
            //确定框图y轴
            parms.rectParams.rectY = minY - ((k + 1) * (parms.rectParams.rectHeight + 5));
            if (parms.rectParams.rectY < parms.rectangleParams.rectangleY) {
                parms.rectParams.rectY = maxY + ((k + 1) * (parms.rectParams.rectHeight + 5));
            }
            parms.aroundedArrY.push(parms.rectParams.rectY);
            //parms.aroundedObjY[k_item.beginTime] = parms.aroundedArrY;

            var _beginTime = new Date(k_item.beginTime).getTime(),
                _startTime = new Date(parms.startTime).getTime(),
                partTime = _beginTime - _startTime;
            startX = partTime * oneDayLength;
            color = k_item.color;


            //画框线
            parms.rectLineParams.rectLineHeight = parms.rectangleParams.rectangleY - parms.rectParams.rectY;
            drawRectLine(ctx, startX, parms.rectLineParams.rectLineY, parms.rectLineParams.rectLineHeight, parms.rectLineParams.rectLineColor);

        });
    };

    //画框图
    //判断数据开始时间在同一时间的时候(未处理)
    var changeSameTime = function (data, dataShow, ctx, startX, color, parms) {
        //1 将原始数据中相同时间开始的放在一起
        var sameTime = [],
            newSameTime = [],
            _data = data;

        for (var i = 0, j = data.length; i < j; i++) {
            if (i != j - 1) {
                if (data[i].beginTime == data[i + 1].beginTime) {
                    sameTime.push(data[i]);
                }
                else {
                    sameTime.push(data[i]);
                    newSameTime.push(sameTime.slice(0));
                    sameTime.length = 0;
                }
            }
            else {
                sameTime.push(data[i]);
                newSameTime.push(sameTime.slice(0));
                sameTime.length = 0;
            }
        }
        //2 判断是否需要左右错开：newSameTime:相同状态下的已按时间分组的数组
        var minTime,
            orderNewArr = [];
        //3 先将时间从小到大排列
        for (var i = 0; i < newSameTime.length; i++) {
            for (var j = i; j < newSameTime.length; j++) {
                if (newSameTime[i][0].beginTime > newSameTime[j][0].beginTime) {
                    minTime = newSameTime[j];
                    newSameTime[j] = newSameTime[i];
                    newSameTime[i] = minTime;
                }
            }
        }
        orderNewArr = newSameTime;

        //4 比较前后两个时间之间的距离间隔，在范围之内就错开 
        var beforeTimeX,
            afterTimeX,
            timeIntervalX;
        for (var i = 0; i <= orderNewArr.length - 1; i++) {
            if (i == 0) {
                //遍历每个数组 分开布局 
                $.each(orderNewArr[i], function (j, j_item) {
                    //parms.rectParams.rectY = parms.rectY + (j * (parms.rectParams.rectHeight + 5));
                    parms.rectParams.rectY = parms.rectangleParams.rectangleY - parms.rectY + (j * (parms.rectParams.rectHeight + 5));
                    var n = 1;
                    if (parms.rectParams.rectY > parms.rectangleParams.rectangleY) {
                        parms.rectParams.rectY = (parms.rectangleParams.rectangleY - parms.rectY) - (n * (parms.rectParams.rectHeight + 5));
                        n++;
                    }
                    parms.aroundArrY.push(parms.rectParams.rectY);
                    //parms.aroundObjY[j_item.beginTime] = parms.aroundArrY;
                    var _beginTime = new Date(j_item.beginTime).getTime(),
                        _startTime = new Date(parms.startTime).getTime(),
                        partTime = _beginTime - _startTime;
                    startX = partTime * oneDayLength;

                    color = j_item.color;
                    //画框图
                    drawRect(ctx, startX, parms.rectParams.rectY, parms.rectParams.rectWidth, parms.rectParams.rectHeight, color);
                    parms.rectLineParams.rectLineHeight = parms.rectangleParams.rectangleY - parms.rectParams.rectY;
                    //画框线
                    //drawRectLine(ctx, startX, parms.rectLineParams.rectLineY, parms.rectLineParams.rectLineHeight, parms.rectLineParams.rectLineColor);


                    //parms.aroundArrY = [];
                    //确定圆点的颜色
                    parms.circleParams.circleColor = color;
                    //画圆
                    drawCircle(ctx, startX, parms.circleParams.circleY, parms.circleParams.circleR, parms.circleParams.circleColor);

                    //画文字
                    var allData = dataShow;
                    var text, textX, textY;
                    textY = parms.rectParams.rectY + 12;
                    $.each(allData, function (f, f_item) {
                        if (f == j_item.id) {
                            var showArr = f_item;
                            $.each(showArr, function (s_i, s_item) {
                                text = s_item.text + s_item.num;
                                textX = startX;
                                drawFont(ctx, parms.textParams.font, parms.textParams.fontColor, text, textX, textY);
                                textY = textY + 12;
                            });
                        }
                    });
                });
            }
            else {
                var beforeTime, beforeTimeX,
                afterTime, afterTimeX,
                timeIntervalX;
                //1 找到前后时间
                $.each(orderNewArr[i - 1], function (_i, _item) {
                    beforeTime = _item.beginTime;
                });
                $.each(orderNewArr[i], function (_j, j_item) {
                    afterTime = j_item.beginTime;
                });
                //2 找到前后时间X轴的差值
                beforeTimeX = (new Date(beforeTime).getTime()) * oneDayLength;
                afterTimeX = (new Date(afterTime).getTime()) * oneDayLength;
                timeIntervalX = (afterTimeX - beforeTimeX);
                //3 判断前后时间是否在这个范围内 
                //1)如果在这个时间范围内，则调用左右错开方法
                if (timeIntervalX < parms.rectParams.rectWidth) {
                    var beforeArr = orderNewArr[i - 1],
                        afterArr = orderNewArr[i];
                    changeCloseTime(beforeArr, afterArr, dataShow, ctx, startX, color, parms);
                }
                    //2)不在此范围内则直接画
                else {
                    parms.aroundArrY = [];
                    //遍历每个数组 分开布局
                    $.each(orderNewArr[i], function (m, m_item) {
                        parms.rectParams.rectY = parms.rectangleParams.rectangleY - parms.rectY - (m * (parms.rectParams.rectHeight + 5));
                        if (parms.rectParams.rectY > parms.rectangleParams.rectangleY) {
                            parms.rectParams.rectY = parms.rectY - (m * (parms.rectParams.rectHeight + 5));
                        }
                        parms.aroundArrY.push(parms.rectParams.rectY);
                        //parms.aroundObjY[m_item.beginTime] = parms.aroundArrY;
                        var _beginTime = new Date(m_item.beginTime).getTime(),
                            _startTime = new Date(parms.startTime).getTime(),
                            partTime = _beginTime - _startTime;
                        startX = partTime * oneDayLength;

                        color = m_item.color;
                        //画框图
                        drawRect(ctx, startX, parms.rectParams.rectY, parms.rectParams.rectWidth, parms.rectParams.rectHeight, color);
                        //parms.rectLineParams.rectLineHeight = parms.rectangleParams.rectangleY - parms.rectParams.rectY;
                        //画框线
                        //drawRectLine(ctx, startX, parms.rectLineParams.rectLineY, parms.rectLineParams.rectLineHeight, parms.rectLineParams.rectLineColor);
                        //画文字
                        var allData = dataShow, text, textX, textY;
                        textY = parms.rectParams.rectY + 12;
                        $.each(allData, function (f, f_item) {
                            if (f == m_item.id) {
                                var showArr = f_item;
                                $.each(showArr, function (s_i, s_item) {
                                    text = s_item.text + s_item.num;
                                    textX = startX;
                                    drawFont(ctx, parms.textParams.font, parms.textParams.fontColor, text, textX, textY);
                                    textY = textY + 12;
                                });
                            }
                        });
                    });

                    //parms.aroundArrY = [];
                    //确定圆点的颜色
                    parms.circleParams.circleColor = color;
                    //画圆
                    drawCircle(ctx, startX, parms.circleParams.circleY, parms.circleParams.circleR, parms.circleParams.circleColor);

                }
            }
        }

    };
    //判断数据开始时间在同一时间的时候(已处理)
    var changedSameTime = function (data, dataShow, ctx, startX, color, parms) {
        //1 按照相同时间分组
        var sameTime = [],
            newSameTime = [],
            _data = data;

        for (var i = 0, j = data.length; i < j; i++) {
            if (i != j - 1) {
                if (data[i].beginTime == data[i + 1].beginTime) {
                    sameTime.push(data[i]);
                }
                else {
                    sameTime.push(data[i]);
                    newSameTime.push(sameTime.slice(0));
                    sameTime.length = 0;
                }
            }
            else {
                sameTime.push(data[i]);
                newSameTime.push(sameTime.slice(0));
                sameTime.length = 0;
            }
        }
        //2 从小到大排序
        var minTime,
            orderNewArr = [];
        for (var i = 0; i < newSameTime.length; i++) {
            for (var j = i; j < newSameTime.length; j++) {
                if (newSameTime[i][0].beginTime > newSameTime[j][0].beginTime) {
                    minTime = newSameTime[j];
                    newSameTime[j] = newSameTime[i];
                    newSameTime[i] = minTime;
                }
            }
        }
        orderNewArr = newSameTime;

        //3 判断是否需要错开布局
        var beforeTimeX,
            afterTimeX,
            timeIntervalX;
        for (var i = 0; i < orderNewArr.length; i++) {
            if (i == 0) {
                parms.aroundedArrY = [];
                // 遍历每个数组 分开布局
                $.each(orderNewArr[i], function (j, j_item) {
                    parms.rectParams.rectY = parms.rectangleParams.rectangleY + parms.rectY - (j * (parms.rectParams.rectHeight + 5));
                    if (parms.rectParams.rectY < parms.rectangleParams.rectangleY) {
                        parms.rectParams.rectY = parms.rectangleParams.rectangleY + parms.rectY + (j * (parms.rectParams.rectHeight + 5));
                    }
                    parms.aroundedArrY.push(parms.rectParams.rectY);
                    //parms.aroundedObjY[j_item.beginTime] = parms.aroundedArrY;

                    var _beginTime = new Date(j_item.beginTime).getTime(),
                        _startTime = new Date(parms.startTime).getTime(),
                        partTime = _beginTime - _startTime;
                    startX = partTime * oneDayLength;

                    color = j_item.color;
                    //画框图
                    drawRect(ctx, startX, parms.rectParams.rectY, parms.rectParams.rectWidth, parms.rectParams.rectHeight, color);
                    //画框线
                    //parms.rectLineParams.rectLineHeight = parms.rectangleParams.rectangleY - parms.rectParams.rectY - parms.rectParams.rectHeight;
                    //drawRectLine(ctx, startX, parms.rectLineParams.rectLineY, parms.rectLineParams.rectLineHeight, parms.rectLineParams.rectLineColor);
                    //画文字
                    var allData = dataShow;
                    var text, textX, textY;
                    textY = parms.rectParams.rectY + 12;
                    $.each(allData, function (f, f_item) {
                        if (f == j_item.id) {
                            var showArr = f_item;
                            $.each(showArr, function (s_i, s_item) {
                                text = s_item.text + s_item.num;
                                textX = startX;
                                drawFont(ctx, parms.textParams.font, parms.textParams.fontColor, text, textX, textY);
                                textY = textY + 12;
                            });
                        }
                    });
                });
                //确定圆点的颜色
                parms.circleParams.circleColor = color;
                //画圆
                drawCircle(ctx, startX, parms.circleParams.circleY, parms.circleParams.circleR, parms.circleParams.circleColor);
            }
            else {
                var beforeTime, beforeTimeX,
                    afterTime, afterTimeX,
                    timeIntervalX;
                //1 找到前后时间
                $.each(orderNewArr[i - 1], function (_i, _item) {
                    beforeTime = _item.beginTime;
                });
                $.each(orderNewArr[i], function (_j, j_item) {
                    afterTime = j_item.beginTime;
                });
                //2 找到前后时间X轴的差值
                beforeTimeX = (new Date(beforeTime).getTime()) * oneDayLength;
                afterTimeX = (new Date(afterTime).getTime()) * oneDayLength;
                timeIntervalX = (afterTimeX - beforeTimeX);

                //3 判断前后时间是否在这个范围内 
                //1)如果在这个时间范围内，则调用左右错开方法
                if (timeIntervalX < parms.rectParams.rectWidth) {
                    var beforeArr = orderNewArr[i - 1],
                        afterArr = orderNewArr[i];
                    changedCloseTime(beforeArr, afterArr, dataShow, ctx, startX, color, parms);
                }
                    //2)不在此范围内则直接画
                else {
                    parms.aroundedArrY = [];
                    $.each(orderNewArr[i], function (m, m_item) {
                        parms.rectParams.rectY = parms.rectangleParams.rectangleY + parms.rectY - (m * (parms.rectParams.rectHeight + 5));
                        if (parms.rectParams.rectY < parms.rectangleParams.rectangleY) {
                            parms.rectParams.rectY = parms.rectangleParams.rectangleY + parms.rectY + (m * (parms.rectParams.rectHeight + 5));
                        }
                        parms.aroundedArrY.push(parms.rectParams.rectY);
                        //parms.aroundedObjY[m_item.beginTime] = parms.aroundedArrY;

                        var _beginTime = new Date(m_item.beginTime).getTime(),
                            _startTime = new Date(parms.startTime).getTime(),
                            partTime = _beginTime - _startTime;
                        startX = partTime * oneDayLength;

                        color = m_item.color;
                        //画框图
                        drawRect(ctx, startX, parms.rectParams.rectY, parms.rectParams.rectWidth, parms.rectParams.rectHeight, color);
                        //画框线
                        //parms.rectLineParams.rectLineHeight = parms.rectangleParams.rectangleY - parms.rectParams.rectY - parms.rectParams.rectHeight;
                        //drawRectLine(ctx, startX, parms.rectLineParams.rectLineY, parms.rectLineParams.rectLineHeight, parms.rectLineParams.rectLineColor);
                        //画文字
                        var allData = dataShow;
                        var text, textX, textY;
                        textY = parms.rectParams.rectY + 12;
                        $.each(allData, function (f, f_item) {
                            if (f == m_item.id) {
                                var showArr = f_item;
                                $.each(showArr, function (s_i, s_item) {
                                    text = s_item.text + s_item.num;
                                    textX = startX;
                                    drawFont(ctx, parms.textParams.font, parms.textParams.fontColor, text, textX, textY);
                                    textY = textY + 12;
                                });
                            }
                        });
                    });
                    //parms.aroundedArrY = [];
                    //确定圆点的颜色
                    parms.circleParams.circleColor = color;
                    //画圆
                    drawCircle(ctx, startX, parms.circleParams.circleY, parms.circleParams.circleR, parms.circleParams.circleColor);

                }
            }
        }

    };
    //处理左右间隔错开的问题 （未处理）
    var changeCloseTime = function (beforeArr, afterArr, dataShow, ctx, startX, color, parms) {
        //遍历数组 找到当前项的前一项的y轴范围
        $.each(beforeArr, function (i, item) {
            //1 找到前一项的时间
            var sameTimeBeforeArr = [],
                sameTimeAfterArr = [],
                beforeTime;
            beforeTime = item.beginTime;

            //2 找到当前时间的前一个时间对应的所有长度
            //var beforeTimeArrY = [];
            //$.each(parms.aroundObjY, function (key, value) {
            //    if (key == beforeTime) {
            //        beforeTimeArrY = value;
            //    }
            //});

            //3 找到最大最小高度
            var arr = getOrder(parms.aroundArrY),
                n = arr.length - 1;
            minY = arr[0];
            maxY = arr[n];
            //beforeTimeArrY = [];

        });

        //错开布局
        $.each(afterArr, function (k, k_item) {
            //确定框图y轴
            parms.rectParams.rectY = maxY + ((k + 1) * (parms.rectParams.rectHeight + 5));
            if ((parms.rectParams.rectY + parms.rectParams.rectHeight) > parms.rectangleParams.rectangleY) {
                parms.rectParams.rectY = minY - parms.rectParams.rectHeight - ((k + 1) * (parms.rectParams.rectHeight + 5)) +parms.rectParams.rectHeight;
            }
            parms.aroundArrY.push(parms.rectParams.rectY);
            //parms.aroundObjY[k_item.beginTime] = parms.aroundArrY;

            var _beginTime = new Date(k_item.beginTime).getTime(),
                _startTime = new Date(parms.startTime).getTime(),
                partTime = _beginTime - _startTime;
            startX = partTime * oneDayLength;

            color = k_item.color;
            //画框图
            drawRect(ctx, startX, parms.rectParams.rectY, parms.rectParams.rectWidth, parms.rectParams.rectHeight, color);

            //画框线
            //parms.rectLineParams.rectLineHeight = parms.rectangleParams.rectangleY - parms.rectParams.rectY;
            //drawRectLine(ctx, startX, parms.rectLineParams.rectLineY, parms.rectLineParams.rectLineHeight, parms.rectLineParams.rectLineColor);

            //画文字
            var allData = dataShow, text, textX, textY;
            textY = parms.rectParams.rectY + 12;
            $.each(allData, function (f, f_item) {
                if (f == k_item.id) {
                    var showArr = f_item;
                    $.each(showArr, function (s_i, s_item) {
                        text = s_item.text + s_item.num;
                        textX = startX;
                        drawFont(ctx, parms.textParams.font, parms.textParams.fontColor, text, textX, textY);
                        textY = textY + 12;
                    });
                }
            });
            //parms.aroundArrY = [];
            //确定圆点的颜色
            parms.circleParams.circleColor = color;

            //画圆
            drawCircle(ctx, startX, parms.circleParams.circleY, parms.circleParams.circleR, parms.circleParams.circleColor);
        });
    };
    //处理左右间隔错开的问题 （已处理）
    var changedCloseTime = function (beforeArr, afterArr, dataShow, ctx, startX, color, parms) {
        //1 找到前一项Y轴范围
        $.each(beforeArr, function (i, item) {
            //1 找到前一项的时间
            var beforeTime;
            beforeTime = item.beginTime;

            //2 找到当前时间的前一个时间对应的所有长度
            //var beforeTimeArrY = [];
            //$.each(parms.aroundedArrY, function (i, item) {
            //        beforeTimeArrY = value;
            //});
            //3 找到最大最小高度
            var arr = getOrder(parms.aroundedArrY),
                n = arr.length - 1;
            minY = arr[0];
            maxY = arr[n];
            //beforeTimeArrY = [];
        })
        //2 错开这个y轴范围
        $.each(afterArr, function (k, k_item) {
            //确定框图y轴
            parms.rectParams.rectY = minY - ((k + 1) * (parms.rectParams.rectHeight + 5));
            if (parms.rectParams.rectY < parms.rectangleParams.rectangleY) {
                parms.rectParams.rectY = maxY + ((k + 1) * (parms.rectParams.rectHeight + 5));
            }
            parms.aroundedArrY.push(parms.rectParams.rectY);
            //parms.aroundedObjY[k_item.beginTime] = parms.aroundedArrY;

            var _beginTime = new Date(k_item.beginTime).getTime(),
                _startTime = new Date(parms.startTime).getTime(),
                partTime = _beginTime - _startTime;
            startX = partTime * oneDayLength;
            color = k_item.color;

            //画框图
            drawRect(ctx, startX, parms.rectParams.rectY, parms.rectParams.rectWidth, parms.rectParams.rectHeight, color);

            //画框线
            //parms.rectLineParams.rectLineHeight = parms.rectangleParams.rectangleY - parms.rectParams.rectY;
            //drawRectLine(ctx, startX, parms.rectLineParams.rectLineY, parms.rectLineParams.rectLineHeight, parms.rectLineParams.rectLineColor);

            //画文字
            var allData = dataShow;
            var text, textX, textY;
            textY = parms.rectParams.rectY + 12;
            $.each(allData, function (f, f_item) {
                if (f == k_item.id) {
                    var showArr = f_item;
                    $.each(showArr, function (s_i, s_item) {
                        text = s_item.text + s_item.num;
                        textX = startX;
                        drawFont(ctx, parms.textParams.font, parms.textParams.fontColor, text, textX, textY);
                        textY = textY + 12;
                    });
                }
            });

            //确定圆点的颜色
            parms.circleParams.circleColor = color;

            //画圆
            drawCircle(ctx, startX, parms.circleParams.circleY, parms.circleParams.circleR, parms.circleParams.circleColor);
        });
    };

    //从小到大排列数据
    var getOrder = function (arr) {
        var min;
        for (var i = 0; i < arr.length; i++) {
            for (var j = i; j < arr.length; j++) {
                if (arr[i] > arr[j]) {
                    min = arr[j];
                    arr[j] = arr[i];
                    arr[i] = min;
                }
            }
        }
        return arr;
    }
    //改变canvas高度产生的变化
    var heightChange = function (canvasHeight, parms) {
        //parms.rectangleParams.rectangleY   parms.lineParams.lineY parms.rectLineParams.rectLineY parms.circleParams.circleY
        var farDiv = parms.contain;
        farDiv.html($canvas);

        $canvas[0].height = canvasHeight;
        parms.rectangleParams.rectangleY = canvasHeight / 2;
        parms.lineParams.lineY = parms.rectangleParams.rectangleY;
        parms.rectLineParams.rectLineY = parms.rectangleParams.rectangleY;
        parms.circleParams.circleY = parms.rectangleParams.rectangleY;     
    }
    var timeLine = {
        show: showTimeLine
    }; 

    return timeLine;
});