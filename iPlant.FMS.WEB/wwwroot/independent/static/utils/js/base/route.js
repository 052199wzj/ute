define(['../jquery-3.1.1', './base'], function($zace, $com) {

    var rect_width = 100; //矩形的宽
    var rect_height = 30; //矩形的高==转弯线竖线的长度
    var line_width = 50; //线的宽
    var line_height = 2; //线的高
    var radius = 5; //圆角率
    var type = "fill"; //填充区域
    var font = "bold 11px 宋体";
    var fontSize = 11;
    var Ymove = 20; //文字在y轴居中所偏移的
    var margin = 20;
    var edge = 8; //三角形的边长
    var Triangle_height = 6; //三角形的高
    var mainWidth = 800; //右移初始canvas宽度
    var mainHeight = 800; //右移初始canvas高度
    var bmainWidth = 400; //下移初始canvas宽度
    var bmainHeight = 700; //下移初始canvas高度
    var mousemoveIndex = -1;
    var ERR = 1.1;//箭头误差
    var parms = {
        contain: $("body"), //将canvas放在哪个父级
        data: [ //数据源  
           
        ],
        dataSet: {//对应关系
            "Text": "KKK", //显示字段名称
            "Index": "ID", //索引字段名称
            "PrevIndex": "PrevID", //上级字段名称
            "NextIndex": "NextID", //下级字段名称
            "BGC": "abc", //背景色字段名称
            "FGC": "bcd", //前景色字段名称
        },
       
        padding: 100, //canvas内边距
        direction: "right", //流程方向分为right和buttom。
        background_color: 'transparent', //流程框背景颜色
        foreground_color: 'white', //箭头颜色
        text_color: "white", //文字颜色
        fn_mouseover: function(data) {}, //鼠标悬停触发
        fn_mouseout: function(data) {}, //鼠标移走事件
        fn_click: function(data) {}, //鼠标单击

    };
   

    var route_show = function(parms) {
        var DivideShowarItem = function(x, y, SelfData, data, line, yl) {
            if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    if (i == 0 && !data[i].X) {
                        coordinate = drawDivideLine({
                            ctx: ctx,
                            x1: x + rect_width / 2,
                            y1: y + rect_height,
                            x2: x + rect_width / 2,
                            y2: yl + rect_height + line_width,
                            x3: x + rect_width + margin + line_width,
                            y3: yl + rect_height + line_width,
                            color: parms.foreground_color,
                        });
						
                        coordinate1 = drawTriangle({
                            ctx: ctx,
                            x1: coordinate.X + rect_width / 2 + margin + line_width,
                            y1: coordinate.Y - edge / 2,
                            x2: coordinate.X + rect_width / 2 + margin + line_width,
                            y2: coordinate.Y + edge / 2,
                            x3: coordinate.X + rect_width / 2 + margin + line_width + Triangle_height,
                            y3: coordinate.Y,
                            color: parms.foreground_color,
                        });
                        coordinate2 = drawRect({
                            ctx: ctx,
                            X: coordinate1.X + margin,
                            Y: coordinate1.Y + edge / 2 - rect_height / 2,
                            color: data[i][parms.dataSet.BGC] || parms.background_color,
                        });
                        list.push({
                            X: coordinate2.X,
                            Y: coordinate2.Y,
                            id: data[i].ID,
                        });
                        data[i].X = coordinate2.X;
                        data[i].Y = coordinate2.Y;
                        var x = Xposition(data[i][parms.dataSet.Text].length);
                        drawText({
                            ctx: ctx,
                            color: parms.text_color,
                            text: data[i][parms.dataSet.Text],
                            X: coordinate2.X + x,
                            Y: coordinate2.Y + Ymove,
                        });
                    } else if (i != 0 && !data[i].X) {
                        coordinate = drawLine({
                            ctx: ctx,
                            x1: coordinate2.X + rect_width + margin,
                            y1: coordinate2.Y + (rect_height / 2),
                            x2: coordinate2.X + rect_width + margin + line_width,
                            y2: coordinate2.Y + (rect_height / 2),
                            color: parms.foreground_color
                        });
                        coordinate1 = drawTriangle({
                            ctx: ctx,
                            x1: coordinate.X + line_width,
                            y1: coordinate.Y - edge / 2,
                            x2: coordinate.X + line_width,
                            y2: coordinate.Y + edge / 2,
                            x3: coordinate.X + line_width + Triangle_height,
                            y3: coordinate.Y,
                            color: parms.foreground_color,
                        });
                        coordinate2 = drawRect({
                            ctx: ctx,
                            X: coordinate1.X + margin,
                            Y: coordinate1.Y + edge / 2 - rect_height / 2,
                            color: data[i][parms.dataSet.BGC] || parms.background_color,
                        });
                        list.push({
                            X: coordinate2.X,
                            Y: coordinate2.Y,
                            id: data[i].ID,
                        });
                        data[i].X = coordinate2.X;
                        data[i].Y = coordinate2.Y;
                        var x = Xposition(data[i][parms.dataSet.Text].length);
                        drawText({
                            ctx: ctx,
                            color: data[i][parms.dataSet.FGC] || parms.text_color,
                            text: data[i][parms.dataSet.Text],
                            X: coordinate2.X + x,
                            Y: coordinate2.Y + Ymove,
                        });
                    }
                }
            }
            if (data && data.length > 0) {
                for (var i = data.length - 1; i >= 0; i--) {
                    var sd = sonDivide([data[i]], parms.data, data);
                    var ld = lineData([data[i]], sd);
                    if (ld && ld.length > 0 && !ld[0].X) {
                        DivideShowarItem(data[i].X, data[i].Y, data[i], ld);
                    } else {
                        var array = lotPrev(data[i].ID, parms.data, line);
                        if (array && array.length > 0) {
                            for (var j = 0; j < array.length; j++) {
                                if (!array[j].X) {
                                    coordinate = drawDivideLine({
                                        ctx: ctx,
                                        x1: data[i].X + rect_width / 2,
                                        y1: data[i].Y + rect_height,
                                        x2: data[i].X + rect_width / 2,
                                        y2: data[i].Y + rect_height + line_width,
                                        x3: data[i].X + rect_width + margin + line_width,
                                        y3: data[i].Y + rect_height + line_width,
                                        color: parms.foreground_color,
                                    });
                                    coordinate1 = drawTriangle({
                                        ctx: ctx,
                                        x1: coordinate.X + rect_width / 2 + margin + line_width,
                                        y1: coordinate.Y - edge / 2,
                                        x2: coordinate.X + rect_width / 2 + margin + line_width,
                                        y2: coordinate.Y + edge / 2,
                                        x3: coordinate.X + rect_width / 2 + margin + line_width + Triangle_height,
                                        y3: coordinate.Y,
                                        color: parms.foreground_color,
                                    });
                                    coordinate2 = drawRect({
                                        ctx: ctx,
                                        X: coordinate1.X + margin,
                                        Y: coordinate1.Y + edge / 2 - rect_height / 2,
                                        color: data[i][parms.dataSet.BGC] || parms.background_color,
                                    });
                                    list.push({
                                        X: coordinate2.X,
                                        Y: coordinate2.Y,
                                        id: array[i].ID,
                                    });
                                    array[i].X = coordinate2.X;
                                    array[i].Y = coordinate2.Y;
                                    var x = Xposition(array[i][parms.dataSet.Text].length);
                                    drawText({
                                        ctx: ctx,
                                        color: parms.text_color,
                                        text: array[i][parms.dataSet.Text],
                                        X: coordinate2.X + x,
                                        Y: coordinate2.Y + Ymove,
                                    });
                                }


                            }
                            // 							for (var n = array.length - 1; i >= 0; i--) {
                            // 								var sd = sonDivide([array[i]], options_p.data, array);
                            // 								var ld = lineData([array[i]], sd);
                            // 								if (ld && ld.length > 0&&!ld[0].X) {
                            // 									DivideShowarItem(array[i].X, array[i].Y, array[i], ld);
                            // 								} else {
                            // 									return coordinate2;
                            // 								}
                            // 							}

                        }

                    }
                    if (i == 0) {
                        var array = lotPrev(SelfData.ID, parms.data, line);
                        if (array && array.length > 0) {
                            for (var j = 0; j < array.length; j++) {
                                if (!array[j].X) {
                                    coordinate = drawDivideLine({
                                        ctx: ctx,
                                        x1: SelfData.X + rect_width / 2,
                                        y1: SelfData.Y + rect_height + line_width,
                                        x2: SelfData.X + rect_width / 2,
                                        y2: coordinate2.Y + +rect_height + line_width,
                                        x3: SelfData.X + rect_width + margin + line_width,
                                        y3: coordinate2.Y + +rect_height + line_width,
                                        color: parms.foreground_color,
                                    });
                                    coordinate1 = drawTriangle({
                                        ctx: ctx,
                                        x1: coordinate.X + rect_width / 2 + margin + line_width,
                                        y1: coordinate.Y - edge / 2,
                                        x2: coordinate.X + rect_width / 2 + margin + line_width,
                                        y2: coordinate.Y + edge / 2,
                                        x3: coordinate.X + rect_width / 2 + margin + line_width + Triangle_height,
                                        y3: coordinate.Y,
                                        color: parms.foreground_color,
                                    });
                                    coordinate2 = drawRect({
                                        ctx: ctx,
                                        X: coordinate1.X + margin,
                                        Y: coordinate1.Y + edge / 2 - rect_height / 2,
                                        color: array[j][parms.dataSet.BGC] || parms.background_color,
                                    });
                                    list.push({
                                        X: coordinate2.X,
                                        Y: coordinate2.Y,
                                        id: array[j].ID,
                                    });
                                    array[j].X = coordinate2.X;
                                    array[j].Y = coordinate2.Y;
                                    var x = Xposition(array[j][parms.dataSet.Text].length);
                                    drawText({
                                        ctx: ctx,
                                        color: parms.text_color,
                                        text: array[j][parms.dataSet.Text],
                                        X: coordinate2.X + x,
                                        Y: coordinate2.Y + Ymove,
                                    });
                                }


                            }
                            for (var i = array.length - 1; i >= 0; i--) {
                                if (i != array.length) {
                                    var sd = sonDivide([array[i]], parms.data, line);
                                    var ld = lineData([array[i]], sd);
                                }

                                if (ld && ld.length > 0 && !ld[0].X) {
                                    DivideShowarItem(array[i].X, array[i].Y, array[i], ld);
                                } else {
                                    return coordinate2;
                                }
                            }

                        } else {
                            return coordinate2;
                        }
                    }
                }
            }
            // 				var sd=sonDivide([SelfData],options_p.data,data);
            // 				var ld= lineData(SelfData],h);
            // 				if(ld&&ld.length>0){
            // 					DivideShowarItem()
            // 				}

        }

        var $Canvas = $('<canvas></canvas>');
        var mouseoverFn = undefined,
			mouseoutFn = undefined,
			clickFn = undefined;
        if (!parms.contain)
            return;

        var options_p = parms;
        mouseoverFn = options_p.fn_mouseover;
        mouseoutFn = options_p.fn_mouseout;
        clickFn = options_p.fn_click;
        var _data = {};
        var step = 0;
        if (options_p.direction == "right") {
            _data = {
                width: mainWidth,
                height: mainHeight,

            };

            //根据数据量决定canvas高度
            step = stepNumber(options_p.direction, options_p.padding, _data.width);
            if (options_p.data.length < step) {
                _data.height = options_p.padding + rect_height;
            } else {
                for (var i = 1; i > 0; i++) {
                    if (parseInt(options_p.data.length / step) == i && parseInt(options_p.data.length % step) == 0) {
                        _data.height = options_p.padding + (2 * rect_height + 2 * margin + line_width) * i;
                        break;
                    }
                    if (parseInt(options_p.data.length / step) == i && parseInt(options_p.data.length % step) != 0) {
                        _data.height = options_p.padding + (2 * rect_height + 2 * margin + line_width) * (i + 1);
                        break;
                    }

                }
            }
        }
        if (options_p.direction == "bottom") {
            _data = {
                width: bmainWidth,
                height: bmainHeight,

            };

            //根据数据量决定canvas宽度
            var step = stepNumber(options_p.direction, options_p.padding, _data.height);

            if (options_p.data.length < step) {
                _data.width = options_p.padding + rect_width;
            } else {
                for (var i = 1; i > 0; i++) {
                    if (parseInt(options_p.data.length / step) == i && parseInt(options_p.data.length % step) == 0) {
                        _data.width = options_p.padding + (rect_width + 2 * margin + line_width) * i;
                        break;
                    }
                    if (parseInt(options_p.data.length / step) == i && parseInt(options_p.data.length % step) != 0) {
                        _data.width = options_p.padding + (rect_width + 2 * margin + line_width) * (i + 1);
                        break;
                    }

                }

            }
        }
        if (options_p.direction == "divide") {
            var firstdata = GetFirstDataArray(options_p.data);
            var line = lineData(firstdata, options_p.data);
            _data = {
                width: options_p.padding + line.length * (rect_width + 2 * margin + line_width),
                height: options_p.padding + rect_height + options_p.data.length * (line_width),
            };
        }
        $Canvas[0].width = _data.width;
        $Canvas[0].height = _data.height;

        options_p.contain.append($Canvas);
        var canvasLeft = $Canvas[0].getBoundingClientRect().left;
        var canvasTop = $Canvas[0].getBoundingClientRect().top;
        var canvas1 = $Canvas[0];
        var ctx = canvas1.getContext("2d");
        var coordinate = 0;
        var coordinate1 = 0;
        var coordinate2 = 0;
        var moveRight = true; //流程是否向右移动
        var moveBotton = true; //流程是否向下移动
        var first = true; //是否为转弯后第一矩形
        var list = [];
        var processList = [];
        var firstData = [];
        
        //装坐标的集合
        if (options_p.direction == "right") {
            var firstdata = GetFirstDataArray(options_p.data);
            var line = lineData(firstdata, options_p.data);
            line.reverse();
            for (var i = 1; i <= line.length; i++) {
                //流程向右移的时候
                if (moveRight == true) {
                    //为第一个流程
                    if (i == 1) {
                        coordinate = drawRect({
                            ctx: ctx,
                            X: options_p.padding,
                            Y: options_p.padding,
                           
                            color: line[i-1][options_p.dataSet.BGC]|| options_p.background_color,
                        });
                        first = false;
                        list.push({
                            X: coordinate.X,
                            Y: coordinate.Y,
                            id: line[i - 1].ID,
                        });
                        //不为转弯后的第一个流程矩形
                    } else if (first == false) {
                        coordinate = drawRect({
                            ctx: ctx,
                            X: coordinate2.X + margin,
                            Y: coordinate2.Y + edge / 2 - rect_height / 2,
                           
                            color: line[i-1][options_p.dataSet.BGC] || options_p.background_color,
                        });
                        list.push({
                            X: coordinate.X,
                            Y: coordinate.Y,
                            id: line[i - 1].ID,
                        });
                        //等于转弯后的第一个流程矩形
                    } else if (first == true) {
                        coordinate = drawRect({
                            ctx: ctx,
                            X: coordinate2.X + edge / 2 - rect_width / 2,
                            Y: coordinate2.Y + margin,
                            color: line[i-1][options_p.dataSet.BGC] || options_p.background_color,
                        });
                        first = false;
                        list.push({
                            X: coordinate.X,
                            Y: coordinate.Y,
                            id: line[i - 1].ID,
                        });
                    }
                    //向左移动时的矩形流程
                } else {
                    //等于转弯后的第一个流程矩形
                    if (first == true) {
                        coordinate = drawRect({
                            ctx: ctx,
                            X: coordinate2.X + edge / 2 - rect_width / 2,
                            Y: coordinate2.Y + margin,
                            color: line[i-1][options_p.dataSet.BGC] || options_p.background_color,
                        });
                        first = false;
                        list.push({
                            X: coordinate.X,
                            Y: coordinate.Y,
                            id: line[i - 1].ID,
                        });
                        //不为转弯后的第一个流程矩形
                    } else {
                        coordinate = drawRect({
                            ctx: ctx,
                            X: coordinate2.X - margin - rect_width,
                            Y: coordinate2.Y + edge / 2 - rect_height / 2,
                            color: line[i-1][options_p.dataSet.BGC] || options_p.background_color,
                        });
                        list.push({
                            X: coordinate.X,
                            Y: coordinate.Y,
                            id: line[i - 1].ID,
                        });
                    }
                }

                //左弯时箭头
                if (i % step == 0 && i % (step * 2) != 0 && i != line.length) {
                    coordinate1 = drawLine({
                        ctx: ctx,
                        x1: coordinate.X + rect_width / 2 ,
                        y1: coordinate.Y + rect_height + margin,
                        w: line_height,
                        h: line_width,
                        color: options_p.foreground_color,
                    });
                    coordinate2 = drawTriangle({
                        ctx: ctx,
                        x1: coordinate1.X - edge / 2 + ERR,
                        y1: coordinate1.Y + line_width,
                        x2: coordinate1.X + edge / 2 + ERR,
                        y2: coordinate1.Y + line_width,
                        x3: coordinate1.X + ERR,
                        y3: coordinate1.Y + line_width + Triangle_height,
                        color: options_p.foreground_color,
                    });
                    moveRight = false;
                    first = true;
                }
                //右转时箭头
                if (i % step == 0 && i % (step * 2) == 0 && i != line.length) {
                    coordinate1 = drawLine({
                        ctx: ctx,
                        x1: coordinate.X + rect_width / 2,
                        y1: coordinate.Y + rect_height + margin,
                        w: line_height,
                        h: line_width,
                        color: options_p.foreground_color,
                    });
                    coordinate2 = drawTriangle({
                        ctx: ctx,
                        x1: coordinate1.X - edge / 2 + ERR,
                        y1: coordinate1.Y + line_width,
                        x2: coordinate1.X + edge / 2 + ERR,
                        y2: coordinate1.Y + line_width,
                        x3: coordinate1.X + ERR,
                        y3: coordinate1.Y + line_width + Triangle_height,
                        color: options_p.foreground_color,
                    });
                    moveRight = true;
                    first = true;
                }
                //写文字到矩形框
                var x = Xposition(line[i - 1][options_p.dataSet.Text].length);
                drawText({
                    ctx: ctx,
                    color: line[i - 1][options_p.dataSet.FGC]||options_p.text_color,
                    text: line[i - 1][options_p.dataSet.Text],
                    X: coordinate.X + x,
                    Y: coordinate.Y + Ymove,
                });
                //向右移动时的箭头

                if (i != line.length && moveRight == true && first == false && i != step) {

                    coordinate1 = drawLine({
                        ctx: ctx,
                        x1: coordinate.X + rect_width + margin,
                        y1: coordinate.Y + (rect_height / 2) ,
                        w: line_width,
                        h: line_height,
                        color: options_p.foreground_color
                    });
                    coordinate2 = drawTriangle({
                        ctx: ctx,
                        x1: coordinate1.X + line_width,
                        y1: coordinate1.Y - edge / 2+ERR,
                        x2: coordinate1.X + line_width,
                        y2: coordinate1.Y + edge / 2 + ERR,
                        x3: coordinate1.X + line_width + Triangle_height,
                        y3: coordinate1.Y + ERR,
                        color: options_p.foreground_color,
                    });
                }
                //向左时的箭头
                if (i != line.length && moveRight == false && first == false && i != step) {
                    coordinate1 = drawLine({
                        ctx: ctx,
                        x1: coordinate.X - margin-rect_width/2,
                        y1: coordinate.Y + rect_height / 2 ,
                        w: line_width,
                        h: line_height,
                        color: options_p.foreground_color,
                    });
                    coordinate2 = drawTriangle({
                        ctx: ctx,
                        x1: coordinate1.X ,
                        y1: coordinate1.Y - edge / 2 + ERR,
                        x2: coordinate1.X ,
                        y2: coordinate1.Y + edge / 2 + ERR,
                        x3: coordinate1.X - Triangle_height ,
                        y3: coordinate1.Y + ERR,
                        color: options_p.foreground_color,
                    });
                }

            }
        }
        //第二种模式   往下走流程
        if (options_p.direction == "bottom") {
            var firstdata = GetFirstDataArray(options_p.data);
            var line = lineData(firstdata, options_p.data);
            line.reverse();
            for (var i = 1; i <= line.length; i++) {
                if (moveBotton == true) {
                    if (i == 1) {
                        coordinate = drawRect({
                            ctx: ctx,
                            X: options_p.padding,
                            Y: options_p.padding,
                            color: line[i-1][parms.dataSet.BGC] || options_p.background_color,
                        });
                        first = false;
                        list.push({
                            X: coordinate.X,
                            Y: coordinate.Y,
                            id: line[i - 1].ID,
                        });
                    } else if (first == true) {
                        coordinate = drawRect({
                            ctx: ctx,
                            X: coordinate2.X + margin,
                            Y: coordinate2.Y + edge / 2 - rect_height / 2,
                            color: line[i - 1][parms.dataSet.BGC] || options_p.background_color,
                        });
                        first = false;
                        list.push({
                            X: coordinate.X,
                            Y: coordinate.Y,
                            id: line[i - 1].ID,
                        });
                    } else if (first == false) {
                        coordinate = drawRect({
                            ctx: ctx,
                            X: coordinate2.X + edge / 2 - rect_width / 2,
                            Y: coordinate2.Y + margin,
                            color: line[i - 1][parms.dataSet.BGC] || options_p.background_color
                        });
                        list.push({
                            X: coordinate.X,
                            Y: coordinate.Y,
                            id: line[i - 1].ID,
                        });
                    }
                } else {
                    if (first == true) {
                        coordinate = drawRect({
                            ctx: ctx,
                            X: coordinate2.X + margin,
                            Y: coordinate2.Y + edge / 2 - rect_height / 2,
                            color: line[i - 1][parms.dataSet.BGC] || options_p.background_color,
                        });
                        first = false;
                        list.push({
                            X: coordinate.X,
                            Y: coordinate.Y,
                            id: line[i - 1].ID,
							
                        });
                    } else {
                        coordinate = drawRect({
                            ctx: ctx,
                            X: coordinate2.X + edge - rect_width / 2,
                            Y: coordinate2.Y - margin -
								rect_height,
                            color: line[i - 1][parms.dataSet.BGC] || options_p.background_color
                        });
                        first = false;
                        list.push({
                            X: coordinate.X,
                            Y: coordinate.Y,
                            id: line[i - 1].ID,
                        });
                    }
                }
                var x = Xposition(line[i - 1][options_p.dataSet.Text].length);
                drawText({
                    ctx: ctx,
                    color: options_p.text_color,
                    text: line[i - 1][options_p.dataSet.Text],
                    X: coordinate.X + x,
                    Y: coordinate.Y + Ymove,
                });
                if (i != line.length && i % step != 0 && moveBotton == true && first == false) {
                    coordinate1 = drawLine({
                        ctx: ctx,
                        x1: coordinate.X + rect_width / 2,
                        y1: coordinate.Y + rect_height + margin,
                        x2: coordinate.X + rect_width / 2,
                        y2: coordinate.Y + rect_height + margin + line_width,
                        color: options_p.foreground_color,
                    });
                    coordinate2 = drawTriangle({
                        ctx: ctx,
                        x1: coordinate1.X - edge / 2,
                        y1: coordinate1.Y + line_width,
                        x2: coordinate1.X + edge / 2,
                        y2: coordinate1.Y + line_width,
                        x3: coordinate1.X,
                        y3: coordinate1.Y + line_width + Triangle_height,
                        color: options_p.foreground_color,
                    });
                }
                if (i != line.length && i % step != 0 && moveBotton == false && first == false) {
                    coordinate1 = drawLine({
                        ctx: ctx,
                        x1: coordinate.X + rect_width / 2,
                        y1: coordinate.Y - margin,
                        x2: coordinate.X + rect_width / 2,
                        y2: coordinate.Y - margin - line_width,
                        color: options_p.foreground_color
                    });
                    coordinate2 = drawTriangle({
                        ctx: ctx,
                        x1: coordinate1.X - edge / 2,
                        y1: coordinate1.Y - line_width,
                        x2: coordinate1.X + edge / 2,
                        y2: coordinate1.Y - line_width,
                        x3: coordinate1.X,
                        y3: coordinate1.Y - line_width - Triangle_height,
                        color: options_p.foreground_color,
                    });
                }
                if (i % step == 0 && i % (step * 2) != 0 && i != line.length) {
                    coordinate1 = drawLine({
                        ctx: ctx,
                        x1: coordinate.X + rect_width + margin,
                        y1: coordinate.Y + (rect_height / 2),
                        x2: coordinate.X + rect_width + margin + line_width,
                        y2: coordinate.Y + (rect_height / 2),
                        color: options_p.foreground_color,
                    });
                    coordinate2 = drawTriangle({
                        ctx: ctx,
                        x1: coordinate1.X + line_width,
                        y1: coordinate1.Y - edge / 2,
                        x2: coordinate1.X + line_width,
                        y2: coordinate1.Y + edge / 2,
                        x3: coordinate1.X + line_width + Triangle_height,
                        y3: coordinate1.Y,
                        color: options_p.foreground_color,
                    });
                    moveBotton = false;
                    first = true;
                }
                if (i % step == 0 && i % (step * 2) == 0 && i != line.length) {
                    coordinate1 = drawLine({
                        ctx: ctx,
                        x1: coordinate.X + rect_width + margin,
                        y1: coordinate.Y + (rect_height / 2),
                        x2: coordinate.X + rect_width + margin + line_width,
                        y2: coordinate.Y + (rect_height / 2),
                        color: options_p.foreground_color
                    });
                    coordinate2 = drawTriangle({
                        ctx: ctx,
                        x1: coordinate1.X + line_width,
                        y1: coordinate1.Y - edge / 2,
                        x2: coordinate1.X + line_width,
                        y2: coordinate1.Y + edge / 2,
                        x3: coordinate1.X + line_width + Triangle_height,
                        y3: coordinate1.Y,
                        color: options_p.foreground_color,
                    });
                    moveBotton = true;
                    first = true;
                }
            }
        }
        //第三种模式  多分支流程图
        if (options_p.direction == "divide") {
            var firstdata = GetFirstDataArray(options_p.data);
            var line = lineData(firstdata, options_p.data);
            var location = 0;
            for (var i = line.length - 1; i >= 0; i--) {

                if (i == line.length - 1) {
                    coordinate = drawRect({
                        ctx: ctx,
                        X: options_p.padding,
                        Y: options_p.padding,
                        color: line[i][parms.dataSet.BGC] || options_p.background_color,
                    });
                    line[i].X = coordinate.X;
                    line[i].Y = coordinate.Y;
                    list.push({
                        X: coordinate.X,
                        Y: coordinate.Y,
                        id: line[i].ID,
                    });
                } else {
                    coordinate = drawRect({
                        ctx: ctx,
                        X: coordinate2.X + margin,
                        Y: coordinate2.Y + edge / 2 - rect_height / 2,
                        color: line[i][parms.dataSet.BGC] || options_p.background_color,
                    });
                    line[i].X = coordinate.X;
                    line[i].Y = coordinate.Y;
                    list.push({
                        X: coordinate.X,
                        Y: coordinate.Y,
                        id: line[i].ID,
                    });
                }
                var x = Xposition(line[i][options_p.dataSet.Text].length);
                drawText({
                    ctx: ctx,
                    color: options_p.text_color,
                    text: line[i][options_p.dataSet.Text],
                    X: coordinate.X + x,
                    Y: coordinate.Y + Ymove,
                });
                if (i != 0) {
                    coordinate1 = drawLine({
                        ctx: ctx,
                        x1: coordinate.X + rect_width + margin,
                        y1: coordinate.Y + (rect_height / 2),
                        x2: coordinate.X + rect_width + margin + line_width,
                        y2: coordinate.Y + (rect_height / 2),
                        color: options_p.foreground_color
                    });
                    coordinate2 = drawTriangle({
                        ctx: ctx,
                        x1: coordinate1.X + line_width,
                        y1: coordinate1.Y - edge / 2,
                        x2: coordinate1.X + line_width,
                        y2: coordinate1.Y + edge / 2,
                        x3: coordinate1.X + line_width + Triangle_height,
                        y3: coordinate1.Y,
                        color: options_p.foreground_color,
                    });
                }

            }
            for (var i = 0; i < line.length; i++) {
                var h = sonDivide([line[i]], options_p.data, line);
                var a = lineData([line[i]], h);
                a.reverse();
                location = DivideShowarItem(line[i].X, line[i].Y, line[i], a, line, location.Y);
            }

        }

        //添加鼠标移动事件
        canvas1.addEventListener("mousemove", function(event) {
            getMousePos_move(canvas1, event, {
                list: list,
                options_p: options_p,
                mouseoverFn: mouseoverFn,
                mouseoutFn: mouseoutFn,
                canvasLeft: canvasLeft,
                canvasTop: canvasTop,
            });

        });
        //添加鼠标点击事件
        canvas1.addEventListener("click", function(event) {
            getMousePos_click(canvas1, event, list, options_p, clickFn);

        });

    }





    //鼠标移动事件
    var getMousePos_move = function(canvas1, event, data1) {
        var cxt = canvas1.getContext("2d");
        var rect = canvas1.getBoundingClientRect();
        var x = event.clientX - rect.left * (canvas1.width / rect.width),
			y = event.clientY - rect.top * (canvas1.height / rect.height);
        var wIsShow = false;

        for (var i = 0; i < data1.list.length; i++) {
            if (x > data1.list[i].X && x < data1.list[i].X + rect_width && y > data1.list[i].Y && y < data1.list[i].Y +
				rect_height) {
                var targetData= getOneData(data1.list[i].id,data1.options_p.data);
                //有这个方法   并且鼠标悬停
                if (i != mousemoveIndex) {
                    if (mousemoveIndex >= 0 && data1.mouseoutFn)
                        data1.mouseoutFn(targetData);
                    if (data1.mouseoverFn)
                        data1.mouseoverFn(targetData, {
                            X: data1.list[i].X,
                            Y: data1.list[i].Y,
                            width: rect_width,
                            height: rect_height,
                            left: data1.canvasLeft,
                            top: data1.canvasTop,
                        });
                    mousemoveIndex = i;
                }
                wIsShow = true;
            }
        }
        if (!wIsShow) {
            if (mousemoveIndex >= 0 && data1.mouseoutFn)
                data1.mouseoutFn(targetData);
            mousemoveIndex = -1;
        }
    }

    //鼠标事件点击
    var getMousePos_click = function(canvas1, event, list, options, clickFn) {
        var cxt = canvas1.getContext("2d");
        var rect = canvas1.getBoundingClientRect();

        var x = event.clientX - rect.left * (canvas1.width / rect.width),
			y = event.clientY - rect.top * (canvas1.height / rect.height);
        for (var i = 0; i < list.length; i++) {
            if (x > list[i].X && x < list[i].X + rect_width && y > list[i].Y && y < list[i].Y + rect_height) {
                var targetData= getOneData(list[i].id,options.data);
                if (clickFn) {
                    clickFn(targetData, {
                        X: list[i].X,
                        Y: list[i].Y,
                        width: rect_width,
                        height: rect_height,
                    });
                }
            }
        }
    }
    var getOneData=function(id,data){
        for(var i=0;i<data.length;i++){
            if(id==data[i].ID){
                return data[i];
            }
        }
    }
    //画直线
    var drawLine = function (data) {
        data.ctx.fillStyle=data.color;
        data.ctx.fillRect(data.x1, data.y1, data.w, data.h);
        var coordinate = {
            X: data.x1,
            Y: data.y1,
        }
        return coordinate;
    }
    //画三角形
    var drawTriangle = function(data) {
        data.ctx.beginPath();
        data.ctx.moveTo(data.x1, data.y1);
        data.ctx.lineTo(data.x2, data.y2);
        data.ctx.lineTo(data.x3, data.y3);
        data.ctx[type + 'Style'] = data.color;
        data.ctx.closePath();
        data.ctx[type]();
        var coordinate = {
            X: data.x1,
            Y: data.y1,
        }
        return coordinate;
    }
    //画圆角矩形
    var drawRect = function(data) {
        data.ctx.beginPath();
        data.ctx.moveTo(data.X, data.Y + radius);
        data.ctx.lineTo(data.X, data.Y + rect_height - radius);
        data.ctx.quadraticCurveTo(data.X, data.Y + rect_height, data.X + radius, data.Y + rect_height);
        data.ctx.lineTo(data.X + rect_width - radius, data.Y + rect_height);
        data.ctx.quadraticCurveTo(data.X + rect_width, data.Y + rect_height, data.X + rect_width, data.Y + rect_height -
			radius);
        data.ctx.lineTo(data.X + rect_width, data.Y + radius);
        data.ctx.quadraticCurveTo(data.X + rect_width, data.Y, data.X + rect_width - radius, data.Y);
        data.ctx.lineTo(data.X + radius, data.Y);
        data.ctx.quadraticCurveTo(data.X, data.Y, data.X, data.Y + radius);
        data.ctx[type + 'Style'] = data.color || params.color;
        data.ctx.closePath();
        data.ctx[type]();
        var coordinate = {
            X: data.X,
            Y: data.Y,
        }
        return coordinate;

    }


    //画汉字
    var drawText = function(data) {
        data.ctx.font = font;
        data.ctx.fillStyle = data.color;
        data.ctx.fillText(data.text, data.X, data.Y, rect_width);

    }
    //判断字体横坐标位置
    var Xposition = function(fontNumber) {
        var x = (rect_width - (fontNumber * fontSize)) / 2;
        return x;
    };
    //求出第多少步时需要换行
    var stepNumber = function(direction, X, width) {
        if (direction == "right") {
            for (var i = 1; i > 0; i++) {
                if (X + (rect_width + margin * 2 + line_width) * i > width) {
                    i = i - 1;
                    return i;
                }
            }
        }
        if (direction == "bottom") {
            for (var i = 1; i > 0; i++) {
                if (X + (rect_height + margin * 2 + line_width) * i > width) {
                    i = i - 1;
                    return i;
                }
            }
        }
    }

    var GetData = function(ID, Data) {
        var Result = undefined;
        $.each(Data, function(i, item) {
            if (ID == item.ID)
                Result = item;
        });
        return Result;
    };
    //查底层数据的三个函数
    var GetEndData = function(FindData, Data, SkipID, depth) {
        var Result = {
            depth: 0,
            EndData: []
        };
        var NextDataArray = FindData;
        var i = depth ? depth : 0;
        while (NextDataArray.length > 0) {
            FindData = NextDataArray;
            NextDataArray = [];
            $.each(FindData, function(i, item) {
                if (SkipID && SkipID == item.ID)
                    return true;
                NextDataArray = NextDataArray.concat(GetNextDataArray(item.ID, Data));

            });
            i++;
        }

        Result.depth = i;

        $.each(FindData, function(i, item) {

            item._depth = Result._depth;
            if (!item.IsSet)
                Result.EndData.push(item);
        });
        return Result;
    };

    var GetFirstDataArray = function(Data) {
        var Result = [];
        $.each(Data, function(i, item) {
            if (item.PrevID > 0)
                return true;
            Result.push(item);
        });
        return Result;
    };

    var GetNextDataArray = function(wID, Data) {
        var Result = [];
        $.each(Data, function(i, item) {
            if (item.PrevID != wID)
                return true;
            Result.push(item);
        });

        return Result;
    };

    //获得一条线的所有数据
    var lineData = function(firstData, options_p) {
        var processList = [];
        var endData = GetEndData(firstData, options_p);
        processList.push(endData.EndData[0]);

        for (var i = 0; i < endData.depth; i++) {
            for (var j = 0; j < options_p.length; j++) {
                if (processList[processList.length - 1].PrevID == options_p[j].ID) {
                    processList.push(options_p[j]);
                }

            }
        }
        return processList;
    }

    //找出除了父分支的的分支
    var sonDivide = function(first, data, line) {
        var result = [];
        var right;
        var left;
        $.each(line, function(i, item) {
            if (item.ID == first[0].PrevID) {
                right = item;
            }
            if (item.PrevID == first[0].ID)
                left = item;

        });
        $.each(data, function(i, item) {
            if (right && !left) {

                if (item.ID != right.ID && first[0].ID != item.ID && line.indexOf(item) == -1) {
                    result.push(item);
                }
            }
            if (!right && left) {
                if (item.ID != left.ID && first[0].ID != item.ID && line.indexOf(item) == -1) {
                    result.push(item);
                }
            }
            if (right && left) {
                if (item.ID != right.ID && item.ID != left.ID && first[0].ID != item.ID && line.indexOf(item) == -1) {
                    result.push(item);
                }
            }

        });
        var count = [];
        var lp = lotPrev(first[0].ID, data, line);
        for (var i = 0; i < result.length; i++) {

            if (lp && lp.length > 0) {
                for (var j = 0; j < lp.length; j++) {
                    if (result[i].PrevID == lp[j].ID) {

                        if (count.indexOf(lp[j]) == -1)
                            count.push(lp[j]);
                        if (count.indexOf(result[i]) == -1)
                            count.push(result[i]);
                    }
                }

            }
        }
        while (true) {
            var b = false;
            for (var i = 0; i < result.length; i++) {
                for (var j = 0; j < count.length; j++) {
                    if (result[i].PrevID == count[j].ID) {

                        if (count.indexOf(result[i]) == -1) {
                            count.push(result[i]);
                            b = true;
                        }
                    }
                }
            }
            if (b == false)
                break;
        }
        return count;
    }
    //当id为多个previd情况时
    var lotPrev = function(id, data, line) {
        var result = [];
        $.each(data, function(i, item) {
            if (id == item.PrevID && line.indexOf(item) == -1) {
                result.push(item);
            }
        });
        return result;
    }
    var route = {
        show: route_show,

    };

    return route;
});
