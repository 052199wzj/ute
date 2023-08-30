define(['../jquery-3.1.1', './base'], function ($zace, $com) {

    var route = (function () {

        var route_show = function ($contain, parms) {
            //模板数据
            var _parms = {
                data: [ //数据源  

                ],
                dataSet: {//对应关系
                    "Text": "KKK", //显示字段名称
                    "Index": "ID", //索引字段名称
                    "PrevIndex": "PrevID", //上级字段名称
                    "NextIndex": "NextList", //下级字段名称
                    "OrderID": "OrderID",  //第几集
                    "BGC": "abc", //背景色字段名称
                    "FGC": "bcd", //前景色字段名称
                },
                background_color: 'transparent', //流程框背景颜色
                foreground_color: 'white', //箭头颜色
                text_color: "white", //文字颜色
                fn_mouseover: function (data) { }, //鼠标悬停触发
                fn_mouseout: function (data) { }, //鼠标移走事件
                fn_click: function (data) { }, //鼠标单击

                constant: {
                    margin_top: 100,
                    margin_left:150,
                    rect_width: 120, //矩形的宽
                    rect_height: 50,//矩形的高==转弯线竖线的长度
                    line_height: 1.5, //线的粗度
                    radius: 3,//圆角率，箭头长度
                    type: "fill", //矩形样式，填充（fill）或者不填充
                    font: "bold 11px 宋体",//字体样式
                    fontSize: 11,//字体大小
                    levelSpace: 60, //水平方格间的距离
                    verticalSpace: 60, //垂直方格间的距离
                    mousemoveIndex: -1,
                    ERR: 1,//箭头误差
                    offset: 20,//线跟线重叠时的偏移量
                }
            };
            var $Canvas = $('<canvas></canvas>');
            var mouseoverFn = undefined,
                mouseoutFn = undefined,
                clickFn = undefined;
            if (!$contain)
                return;
            if (!($contain instanceof jQuery)) {
                alert("这不是一个jQuery对象,请更改容器！");
                return;
            }
            var options_p = parms;
            options_p.constant = {
                rect_width: parms.constant.rect_width ? parms.constant.rect_width : _parms.constant.rect_width,
                rect_height: parms.constant.rect_height ? parms.constant.rect_height : _parms.constant.rect_height,
                line_height: parms.constant.line_height ? parms.constant.line_height : _parms.constant.line_height,
                radius: parms.constant.radius ? parms.constant.radius : _parms.constant.radius,
                type: parms.constant.type ? parms.constant.type : _parms.constant.type,
                font: parms.constant.font ? parms.constant.font : _parms.constant.font,
                fontSize: parms.constant.fontSize ? parms.constant.fontSize : _parms.constant.fontSize,
                levelSpace: parms.constant.levelSpace ? parms.constant.levelSpace : _parms.constant.levelSpace,
                verticalSpace: parms.constant.verticalSpace ? parms.constant.verticalSpace : _parms.constant.verticalSpace,
                mousemoveIndex: parms.constant.mousemoveIndex ? parms.constant.mousemoveIndex : _parms.constant.mousemoveIndex,
                ERR: parms.constant.ERR ? parms.constant.ERR : _parms.constant.ERR,
                offset: parms.constant.offset ? parms.constant.offset : _parms.constant.offset,
                margin_top: parms.constant.margin_top ? parms.constant.margin_top : _parms.constant.margin_top,
                margin_left: parms.constant.margin_left ? parms.constant.margin_left : _parms.constant.margin_left,
            }
            mouseoverFn = options_p.fn_mouseover;
            mouseoutFn = options_p.fn_mouseout;
            clickFn = options_p.fn_click;
            var _data = {};  //保存最大宽度和最大高度
            var coordinate = {};//缓存上一个坐标
            var obj = getXY(options_p.data, options_p.constant);
            var offset = options_p.constant.offset;
            //将第一行数据进行排列
            var data = obj.rect;
            //处理排列好的数据
            checkData(data, obj, options_p, offset);
            //求出最大宽度和高度
            var maxX = 0;
            var maxY = 0;
            for (var i = 0; i < obj.rect.length; i++) {
                if (obj.rect[i].X > maxX) {
                    maxX = obj.rect[i].X;
                }
                if (obj.rect[i].Y > maxY) {
                    maxY = obj.rect[i].Y;
                }
            }
            _data = {
                width: maxX + options_p.constant.rect_width,
                height: maxY + options_p.constant.rect_height,
            };
            $Canvas[0].width = _data.width;
            $Canvas[0].height = _data.height;
            $contain.append($Canvas);
            var canvasLeft = $Canvas[0].getBoundingClientRect().left;
            var canvasTop = $Canvas[0].getBoundingClientRect().top;
            var canvas1 = $Canvas[0];
            var ctx = canvas1.getContext("2d");
            //画线
            for (var i = 0; i < obj.line.length; i++) {
                for (var j = 0; j < obj.line[i].length; j++) {
                    if (j > 0) {
                        drawLineForPoint(ctx,
                          obj.line[i][j - 1].X,
                          obj.line[i][j - 1].Y,
                          obj.line[i][j].X,
                          obj.line[i][j].Y,
                          options_p.foreground_color,
                          options_p.constant);
                        if (obj.line[i].length > 2) {
                            drawArrowForPoint(ctx, obj.line[i][j - 1].X, obj.line[i][j - 1].Y, obj.line[i][j].X, obj.line[i][j].Y, options_p.foreground_color, options_p.constant);
                        } else {
                            if (obj.line[i][1].X == obj.line[i][0].X) {
                                drawArrow(ctx, obj.line[i][1].X, obj.line[i][1].Y, "bottom", options_p.foreground_color, options_p.constant);
                            } else {
                                drawArrow(ctx, obj.line[i][j].X, obj.line[i][j].Y, "right", options_p.foreground_color, options_p.constant);
                            }
                        }
                    }
                }
            }
            for (var i = 0; i < data.length; i++) {
                if (data[i].Type == 1) {
                    //画方格
                    coordinate = drawRect({
                        ctx: ctx,
                        X: data[i].X - options_p.constant.rect_width / 2,
                        Y: data[i].Y - options_p.constant.rect_height / 2,
                        color: data[i][options_p.dataSet.BGC] || options_p.background_color,
                        constant: options_p.constant,
                    });
                }
                if (data[i].Type == 2) {
                    //画菱形
                    drawEllipse(
                         ctx,
                         data[i].X,
                         data[i].Y,
                         data[i][options_p.dataSet.BGC] || options_p.background_color,
                         options_p.constant
                     );
                    coordinate.X = data[i].X - options_p.constant.rect_width / 2;
                    coordinate.Y = data[i].Y - options_p.constant.rect_height / 2;
                }
                if (data[i].Type == 3) {
                    //画椭圆
                    drawDiamond(
                         ctx,
                         data[i].X,
                         data[i].Y,
                         data[i][options_p.dataSet.BGC] || options_p.background_color,
                         options_p.constant
                     );
                    coordinate.X = data[i].X - options_p.constant.rect_width / 2;
                    coordinate.Y = data[i].Y - options_p.constant.rect_height / 2;
                }
                //画文字
                var x = Xposition(data[i][options_p.dataSet.Text].length, options_p.constant);
                drawText({
                    ctx: ctx,
                    color: data[i][options_p.dataSet.FGC] || options_p.text_color,
                    text: data[i][options_p.dataSet.Text],
                    X: coordinate.X + x,
                    Y: coordinate.Y + options_p.constant.rect_height / 2 + options_p.constant.fontSize / 2,
                    constant: options_p.constant
                });
            }
            //添加鼠标移动事件
            canvas1.addEventListener("mousemove", function (event) {
                getMousePos_move(canvas1, event, {
                    data: obj.rect,
                    mouseoverFn: mouseoverFn,
                    mouseoutFn: mouseoutFn,
                    canvasLeft: canvasLeft,
                    canvasTop: canvasTop,
                    constant: options_p.constant,
                });
            });
            //添加鼠标点击事件
            canvas1.addEventListener("click", function (event) {
                getMousePos_click(canvas1, event, obj.rect, options_p, clickFn);
            });
        }
        //处理数据
        var checkData = function (data, obj, options_p, offset) {
            for (var i = 0; i < data.length; i++) {
                data[i].x = data[i].OrderID;
                if (i == 0) {
                    data[0].y = 1;
                } else {
                    if (data[i].Y - data[0].Y == 0) {
                        data[i].y = 1;
                    } else {
                        data[i].y = (data[i].Y - data[0].Y) / (options_p.constant.rect_height + options_p.constant.verticalSpace) + 1;
                    }
                }
            }
            //求出跳线坐标
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[i].NextIDList.length; j++) {
                    var obj1 = getPosition(data, data[i].X, data[i].Y, data[i].NextIDList[j]);
                    switch (obj1.direction) {
                        case "top":
                            var list = [
                                { X: data[i].X + options_p.constant.rect_width / 2, Y: data[i].Y },
                                { X: data[i].X + options_p.constant.rect_width / 2 + options_p.constant.levelSpace / 2, Y: data[i].Y },
                                { X: data[i].X + options_p.constant.rect_width / 2 + options_p.constant.levelSpace / 2, Y: data[i].Y - options_p.constant.rect_height / 2 - options_p.constant.verticalSpace / 2 },
                                { X: obj1.X - options_p.constant.rect_width / 2 - options_p.constant.levelSpace / 2, Y: data[i].Y - options_p.constant.rect_height / 2 - options_p.constant.verticalSpace / 2 },
                                { X: obj1.X - options_p.constant.rect_width / 2 - options_p.constant.levelSpace / 2, Y: obj1.Y },
                                { X: obj1.X - options_p.constant.rect_width / 2, Y: obj1.Y },
                            ];

                            handleLine.LineRepeatHandle(list, offset, obj);

                            obj.line.push(list);
                            break;
                        case "bottom":
                            if (isBottomLine(data[i], obj1, data)) {
                                obj.line.push([
                                 { X: data[i].X, Y: data[i].Y + options_p.constant.rect_height / 2 },
                                 { X: obj1.X, Y: obj1.Y - options_p.constant.rect_height / 2 },
                                ]);
                            } else {
                                var list = [
                                 { X: data[i].X + options_p.constant.rect_width / 2, Y: data[i].Y },
                                 { X: data[i].X + options_p.constant.rect_width / 2 + options_p.constant.levelSpace / 2, Y: data[i].Y },
                                 { X: data[i].X + options_p.constant.rect_width / 2 + options_p.constant.levelSpace / 2, Y: obj1.Y - options_p.constant.rect_height / 2 - options_p.constant.verticalSpace / 2 },
                                 { X: obj1.X, Y: obj1.Y - options_p.constant.rect_height / 2 - options_p.constant.verticalSpace / 2 },
                                 { X: obj1.X, Y: obj1.Y - options_p.constant.rect_height / 2 },
                                ];
                                handleLine.LineRepeatHandle(list, offset, obj);
                                obj.line.push(list);
                            }

                            break;
                        case "left":
                            var list = [
                                { X: data[i].X + options_p.constant.rect_width / 2, Y: data[i].Y },
                                { X: data[i].X + options_p.constant.rect_width / 2 + options_p.constant.levelSpace / 2, Y: data[i].Y },
                                { X: data[i].X + options_p.constant.rect_width / 2 + options_p.constant.levelSpace / 2, Y: data[i].Y - options_p.constant.rect_height / 2 - options_p.constant.verticalSpace / 2 },
                                { X: obj1.X, Y: data[i].Y - options_p.constant.rect_height / 2 - options_p.constant.verticalSpace / 2 },
                                { X: obj1.X, Y: obj1.Y - options_p.constant.rect_height / 2 },
                            ];
                            obj.line.push(list);
                            break;
                        case "right":
                            if (isRightLine(data[i], obj1, data)) {
                                obj.line.push([
                                  { X: data[i].X + options_p.constant.rect_width / 2, Y: data[i].Y },
                                  { X: obj1.X - options_p.constant.rect_width / 2, Y: obj1.Y },
                                ]);
                            } else {
                                var list = [
                             { X: data[i].X + options_p.constant.rect_width / 2, Y: data[i].Y },
                             { X: data[i].X + options_p.constant.rect_width / 2 + options_p.constant.levelSpace / 2, Y: data[i].Y },
                             { X: data[i].X + options_p.constant.rect_width / 2 + options_p.constant.levelSpace / 2, Y: data[i].Y - options_p.constant.rect_height / 2 - options_p.constant.verticalSpace / 2 },
                             { X: obj1.X, Y: data[i].Y - options_p.constant.rect_height / 2 - options_p.constant.verticalSpace / 2 },
                             { X: obj1.X, Y: obj1.Y - options_p.constant.rect_height / 2 },
                                ];
                                handleLine.LineRepeatHandle(list, offset, obj);
                                obj.line.push(list);
                            }
                            break;
                        case "top_left":
                            var list = [
                              { X: data[i].X + options_p.constant.rect_width / 2, Y: data[i].Y },
                              { X: data[i].X + options_p.constant.rect_width / 2 + options_p.constant.levelSpace / 2, Y: data[i].Y },
                              { X: data[i].X + options_p.constant.rect_width / 2 + options_p.constant.levelSpace / 2, Y: data[i].Y - options_p.constant.rect_height / 2 - options_p.constant.verticalSpace / 2 },
                              { X: obj1.X - options_p.constant.rect_width / 2 - options_p.constant.levelSpace / 2, Y: data[i].Y - options_p.constant.rect_height / 2 - options_p.constant.verticalSpace / 2 },
                              { X: obj1.X - options_p.constant.rect_width / 2 - options_p.constant.levelSpace / 2, Y: obj1.Y },
                              { X: obj1.X - options_p.constant.rect_width / 2, Y: obj1.Y },
                            ];
                            handleLine.LineRepeatHandle(list, offset, obj);
                            obj.line.push(list);

                            break;
                        case "left_bottom":
                            if (obj1.y - data[i].y == 1) {
                                var list = [
                                   { X: data[i].X, Y: data[i].Y + options_p.constant.rect_height / 2 },
                                   { X: data[i].X, Y: data[i].Y + options_p.constant.rect_height / 2 + options_p.constant.verticalSpace / 2 },
                                   { X: obj1.X, Y: data[i].Y + options_p.constant.rect_height / 2 + options_p.constant.verticalSpace / 2 },
                                   { X: obj1.X, Y: obj1.Y - options_p.constant.rect_height / 2 },
                                ];
                                handleLine.LineRepeatHandle(list, offset, obj);
                                obj.line.push(list);
                            } else {
                                var list = [
                                      { X: data[i].X, Y: data[i].Y + options_p.constant.rect_height / 2 },
                                      { X: data[i].X, Y: data[i].Y + options_p.constant.rect_height / 2 + options_p.constant.verticalSpace / 2 },
                                      { X: data[i].X - options_p.constant.rect_width / 2 - options_p.constant.levelSpace / 2, Y: data[i].Y + options_p.constant.rect_height / 2 + options_p.constant.verticalSpace / 2 },
                                      { X: data[i].X - options_p.constant.rect_width / 2 - options_p.constant.levelSpace / 2, Y: obj1.Y - options_p.constant.rect_height / 2 - options_p.constant.verticalSpace / 2 },
                                      { X: obj1.X, Y: obj1.Y - options_p.constant.rect_height / 2 - options_p.constant.verticalSpace / 2 },
                                      { X: obj1.X, Y: obj1.Y - options_p.constant.rect_height / 2 },
                                ];
                                handleLine.LineRepeatHandle(list, offset, obj);
                                obj.line.push(list);
                            }
                            break;
                        case "top_right":
                            if (obj1.x - data[i].x == 1) {
                                var list = [
                                { X: data[i].X + options_p.constant.rect_width / 2, Y: data[i].Y },
                                { X: data[i].X + options_p.constant.rect_width / 2 + options_p.constant.levelSpace / 2, Y: data[i].Y },
                                { X: data[i].X + options_p.constant.rect_width / 2 + options_p.constant.levelSpace / 2, Y: obj1.Y },
                                { X: obj1.X - options_p.constant.rect_width / 2, Y: obj1.Y },
                                ];
                                handleLine.LineRepeatHandle(list, offset, obj);
                                obj.line.push(list);
                            } else {
                                var list = [
                                { X: data[i].X + options_p.constant.rect_width / 2, Y: data[i].Y },
                                { X: data[i].X + options_p.constant.rect_width / 2 + options_p.constant.levelSpace / 2, Y: data[i].Y },
                                { X: data[i].X + options_p.constant.rect_width / 2 + options_p.constant.levelSpace / 2, Y: data[i].Y - options_p.constant.rect_height / 2 - options_p.constant.verticalSpace / 2 },
                                { X: obj1.X - options_p.constant.rect_width / 2 - options_p.constant.levelSpace / 2, Y: data[i].Y - options_p.constant.rect_height / 2 - options_p.constant.verticalSpace / 2 },
                                { X: obj1.X - options_p.constant.rect_width / 2 - options_p.constant.levelSpace / 2, Y: obj1.Y },
                                { X: obj1.X - options_p.constant.rect_width / 2, Y: obj1.Y },
                                ];
                                handleLine.LineRepeatHandle(list, offset, obj);
                                obj.line.push(list);
                            }
                            break;
                        case "right_bottom":
                            if (obj1.y - data[i].y == 1) {
                                var list = [
                                   { X: data[i].X, Y: data[i].Y + options_p.constant.rect_height / 2 },
                                   { X: data[i].X, Y: data[i].Y + options_p.constant.rect_height / 2 + options_p.constant.verticalSpace / 2 },
                                   { X: obj1.X, Y: data[i].Y + options_p.constant.rect_height / 2 + options_p.constant.verticalSpace / 2 },
                                   { X: obj1.X, Y: obj1.Y - options_p.constant.rect_height / 2 },
                                ];
                                handleLine.LineRepeatHandle(list, offset, obj);
                                obj.line.push(list);
                            } else {
                                var list = [
                                      { X: data[i].X, Y: data[i].Y + options_p.constant.rect_height / 2 },
                                      { X: data[i].X, Y: data[i].Y + options_p.constant.rect_height / 2 + options_p.constant.verticalSpace / 2 },
                                      { X: data[i].X + options_p.constant.rect_width / 2 + options_p.constant.levelSpace / 2, Y: data[i].Y + options_p.constant.rect_height / 2 + options_p.constant.verticalSpace / 2 },
                                      { X: data[i].X + options_p.constant.rect_width / 2 + options_p.constant.levelSpace / 2, Y: obj1.Y - options_p.constant.rect_height / 2 - options_p.constant.verticalSpace / 2 },
                                      { X: obj1.X, Y: obj1.Y - options_p.constant.rect_height / 2 - options_p.constant.verticalSpace / 2 },
                                      { X: obj1.X, Y: obj1.Y - options_p.constant.rect_height / 2 },
                                ];
                                handleLine.LineRepeatHandle(list, offset, obj);
                                obj.line.push(list);
                            }
                            break;
                    }
                }
            }
        }
        //是否直线向下画
        var isBottomLine = function (start, end, data) {
            var bool = false;
            var index = 0;
            //第一种情况，结束的流程到开始的流程的正下面，平且距离为1
            if (end.y - start.y == 1) {
                bool = true;
                return bool;
            }
            //第二中情况：结束的流程到开始的流程的正下面，平且距离大于1，且他们间隔没有流程
            if (end.y - start.y > 1) {
                var space = end.y - start.y;
                for (var i = 1; i < space; i++) {
                    for (var j = 0; j < data.length; j++) {
                        if (data[j].x == start.x && data[j].y == start.y + i) {
                            index++;
                        }
                    }
                }
                if (index == 0) {
                    bool = true;
                }
            }
            return bool;
        }
        //是否直线向右画
        var isRightLine = function (start, end, data) {
            var bool = false;
            var index = 0;
            //第一种情况，结束的流程到开始的流程的正下面，平且距离为1
            if (end.x - start.x == 1) {
                bool = true;
                return bool;
            }
            //第二中情况：结束的流程到开始的流程的正下面，平且距离大于1，且他们间隔没有流程
            if (end.x - start.x > 1) {
                var space = end.x - start.x;
                for (var i = 1; i < space; i++) {
                    for (var j = 0; j < data.length; j++) {
                        if (data[j].y == start.y && data[j].x == start.x + i) {
                            index++;
                        }
                    }
                }
                if (index == 0) {
                    bool = true;
                }
            }
            return bool;
        }



        var handleLine = {

            LineRepeatHandle: function (list, offset, obj) {

                if (list.length > 3) {
                    //判断是否重复
                    for (var i = 2; i < list.length - 1; i++) {
                        //list[i-1] list[i]组成的线去判断

                        handleLine.SimpleLineRepeatHandle(list, i, offset, obj);
                    }
                }
            },
            SimpleLineRepeatHandle: function (list, i, offset, obj) {

                //循环所有已画线条
                //一一判断此线条与其是否重复（此线条首尾段无需判断） 
                var _isRepeat = handleLine.isAddOffset([list[i - 2], list[i - 1], list[i], list[i + 1]], obj.line, obj);

                //若横向重复扩Y 若纵向重复扩X （自身也需扩但判断条件是>或<不判断=）  
                if (_isRepeat == 1) {
                    //扩X
                    handleLine.CX(obj.rect, list[i].X, offset, obj.line, false);

                    for (var j = 0; j < list.length; j++) {
                        if (list[j].X > list[i].X) {
                            list[j].X += offset;
                        }
                    }

                } else if (_isRepeat == 2) {
                    //扩Y
                    handleLine.CY(obj.rect, list[i].Y, offset, obj.line, false);
                    for (var j = 0; j < list.length; j++) {
                        if (list[j].Y > list[i].Y) {
                            list[j].Y += offset;
                        }
                    }
                } else if (_isRepeat == 3) {
                    //扩自身X
                    handleLine.CX(obj.rect, list[i].X, offset, obj.line, true);

                    for (var j = 0; j < list.length; j++) {
                        if (list[j].X >= list[i].X) {
                            list[j].X += offset;
                        }
                    }

                    handleLine.LineRepeatHandle(list, offset, obj);

                } else if (_isRepeat == 4) {
                    //扩自身Y
                    handleLine.CY(obj.rect, list[i].Y, offset, obj.line, true);

                    for (var j = 0; j < list.length; j++) {
                        if (list[j].Y >= list[i].Y) {
                            list[j].Y += offset;
                        }
                    }
                    handleLine.LineRepeatHandle(list, offset, obj);
                }
            },

            //判断输入单挑线段是否与线条集合中线条重复 返回重复方向标识
            isAddOffset: function (list, xtlisted,obj) {
                var result = 0; //0不重复 1 纵向重复(重复的偏移)  2 横向重复(重复的偏移) 3 纵向重复(自身偏移)  4 横向重复(自身偏移)
                //obj._reIndex = [];
                if (!list || list.length != 4)
                    return result;

                if (list[1].X == list[2].X) {
                    //判断纵向重复

                    for (var i = 0; i < xtlisted.length; i++) {
                        for (var j = 1; j < xtlisted[i].length; j++) {
                            if (xtlisted[i][j - 1].X != xtlisted[i][j].X || xtlisted[i][j].X != list[1].X) //过滤横线 
                                continue;

                            var _selfMax = (list[1].Y > list[2].Y) ? list[1].Y : list[2].Y;
                            var _selfMin = (list[1].Y < list[2].Y) ? list[1].Y : list[2].Y;

                            var _targetMax = (xtlisted[i][j - 1].Y > xtlisted[i][j].Y) ? xtlisted[i][j - 1].Y : xtlisted[i][j].Y;
                            var _targetMin = (xtlisted[i][j - 1].Y < xtlisted[i][j].Y) ? xtlisted[i][j - 1].Y : xtlisted[i][j].Y;

                            if (_selfMax >= _targetMin && _selfMin <= _targetMax) {
                                //重复
                                //obj._reIndex.push([i, j]);
                                result = 1;
                                if (xtlisted[i].length - 1 > j && j > 1) {
                                    result += handleLine.selfOffsetVer(list, xtlisted[i], j, _selfMax, _selfMin, _targetMax, _targetMin);
                                }
                                break;
                            }
                        }
                        if (result > 0)
                            break;
                    }
                }
                if (list[1].Y == list[2].Y) {
                    //判断横向重复
                    for (var i = 0; i < xtlisted.length; i++) {
                        for (var j = 1; j < xtlisted[i].length; j++) {
                            if (xtlisted[i][j - 1].Y != xtlisted[i][j].Y || xtlisted[i][j].Y != list[1].Y) //过滤横线
                                continue;
                         
                            var _selfMax = (list[1].X > list[2].X) ? list[1].X : list[2].X;
                            var _selfMin = (list[1].X < list[2].X) ? list[1].X : list[2].X;

                            var _targetMax = (xtlisted[i][j - 1].X > xtlisted[i][j].X) ? xtlisted[i][j - 1].X : xtlisted[i][j].X;
                            var _targetMin = (xtlisted[i][j - 1].X < xtlisted[i][j].X) ? xtlisted[i][j - 1].X : xtlisted[i][j].X;
                      

                            if (_selfMax >= _targetMin && _selfMin <= _targetMax) {
                                //重复
                                result = 2;
                                //obj._reIndex.push([i, j]);
                                if (xtlisted[i].length - 1 > j && j > 1) {

                                    result += handleLine.selfOffsetHor(list, xtlisted[i], j, _selfMax, _selfMin, _targetMax, _targetMin);
                                }
                                break;
                            }
                        }
                        if (result > 0)
                            break;
                    }
                }

                return result;
            }
,
            selfOffsetHor: function (list, reList, j, _selfMax, _selfMin, _targetMax, _targetMin) {
                var result = 0;
                //判断左端方向   1左 2右 3上 4下
                //若重复线段与此线段同侧
                //若重复线段在左且处于上侧  自身偏移 即result+=2
                //若重复线段在右且处于下侧  自身偏移 即result+=2

                //判断右端方向 
                //若重复线段与此线段同侧
                //判断谁左谁右 
                //若重复线段在左且处于下侧  自身偏移 即result+=2
                //若重复线段在右且处于上侧  自身偏移 即result+=2


                var orientation_left = 0;
                var orientation_left_re = 0;

                var orientation_right = 0;
                var orientation_right_re = 0;

                if (list[1].X < list[2].X) {
                    if (list[0].Y > list[1].Y)
                        orientation_left = 4;
                    else if (list[0].Y < list[1].Y)
                        orientation_left = 3;


                    if (list[3].Y > list[2].Y)
                        orientation_right = 4;
                    else if (list[3].Y < list[2].Y)
                        orientation_right = 3;

                    //上端为list[1]
                } else {
                    if (list[3].Y > list[2].Y)
                        orientation_left = 4;
                    else if (list[3].Y < list[2].Y)
                        orientation_left = 3;


                    if (list[0].Y > list[1].Y)
                        orientation_right = 4;
                    else if (list[0].Y < list[1].Y)
                        orientation_right = 3;
                    //上端为list[2]
                }
                //
                if (reList[j - 1].X < reList[j].X) {
                    if (reList[j - 2].Y > reList[j - 1].Y)
                        orientation_left_re = 4;
                    else if (reList[j - 2].Y < reList[j - 1].Y)
                        orientation_left_re = 3;


                    if (reList[j + 1].Y > reList[j].Y)
                        orientation_right_re = 4;
                    else if (reList[j + 1].Y < reList[j].Y)
                        orientation_right_re = 3;
                    //上端为list[1]
                } else {
                    if (reList[j + 1].Y > reList[j].Y)
                        orientation_left_re = 4;
                    else if (reList[j + 1].Y < reList[j].Y)
                        orientation_left_re = 3;

                    if (reList[j - 2].Y > reList[j - 1].Y)
                        orientation_right_re = 4;
                    else if (reList[j - 2].Y < reList[j - 1].Y)
                        orientation_right_re = 3;
                    //上端为list[2]
                }

                //左端点
                if (orientation_left == orientation_left_re) {
                    if (orientation_left == 3) {
                        //上侧： 若重复线段在右
                        if (_selfMin < _targetMin)
                            result += 2;
                    } else if (orientation_left == 4) {
                        //下侧： 若重复线段在左
                        if (_selfMin > _targetMin)
                            result += 2;
                    }
                }

                //右端点
                if (orientation_right == orientation_right_re) {
                    if (orientation_right == 3) {
                        //上侧：若重复线段在左
                        if (_selfMax > _targetMax)
                            result += 2;
                    } else if (orientation_right == 4) {
                        //下侧： 若重复线段在右
                        if (_selfMax < _targetMax)
                            result += 2;
                    }
                }
                if (result > 2)
                    result -= 2;

                return result;

            },
            selfOffsetVer: function (list, reList, j, _selfMax, _selfMin, _targetMax, _targetMin) {
                var result = 0;
                //判断上端方向   1左 2右 3上 4下
                //若重复线段与此线段同侧
                //若重复线段在上且处于右侧  自身偏移 即result+=2
                //若重复线段在下且处于左侧  自身偏移 即result+=2

                //判断下端方向 
                //若重复线段与此线段同侧
                //判断谁上谁下 
                //若重复线段在上且处于左侧  自身偏移 即result+=2
                //若重复线段在下且处于右侧  自身偏移 即result+=2


                var orientation_top = 0;
                var orientation_top_re = 0;

                var orientation_bottom = 0;
                var orientation_bottom_re = 0;

                if (list[1].Y > list[2].Y) {
                    if (list[0].X > list[1].X)
                        orientation_top = 2;
                    else if (list[0].X < list[1].X)
                        orientation_top = 1;


                    if (list[3].X > list[2].X)
                        orientation_bottom = 2;
                    else if (list[3].X < list[2].X)
                        orientation_bottom = 1;

                    //上端为list[1]
                } else {
                    if (list[3].X > list[2].X)
                        orientation_top = 2;
                    else if (list[3].X < list[2].X)
                        orientation_top = 1;


                    if (list[0].X > list[1].X)
                        orientation_bottom = 2;
                    else if (list[0].X < list[1].X)
                        orientation_bottom = 1;
                    //上端为list[2]
                }
                if (reList[j - 1].Y > reList[j].Y) {
                    if (reList[j - 2].X > reList[j - 1].X)
                        orientation_top_re = 2;
                    else if (reList[j - 2].X < reList[j - 1].X)
                        orientation_top_re = 1;


                    if (reList[j + 1].X > reList[j].X)
                        orientation_bottom_re = 2;
                    else if (reList[j + 1].X < reList[j].X)
                        orientation_bottom_re = 1;
                    //上端为list[1]
                } else {
                    if (reList[j + 1].X > reList[j].X)
                        orientation_top_re = 2;
                    else if (reList[j + 1].X < reList[j].X)
                        orientation_top_re = 1;

                    if (reList[j - 2].X > reList[j - 1].X)
                        orientation_bottom_re = 2;
                    else if (reList[j - 2].X < reList[j - 1].X)
                        orientation_bottom_re = 1;
                    //上端为list[2]
                }
                //若重复线段上端与此线段上端同侧
                if (orientation_top == orientation_top_re) {
                    if (orientation_top == 1) {
                        if (_selfMax > _targetMax)
                            result += 2;
                        //判断重复线段是否在下
                    } else if (orientation_top == 2) {
                        //判断重复线段是否在上
                        if (_selfMax < _targetMax)
                            result += 2;
                    }
                }
                //若重复线段下端与此线段下端同侧
                if (orientation_bottom == orientation_bottom_re) {
                    if (orientation_bottom == 1) {
                        //判断重复线段是否在上
                        if (_selfMin < _targetMin)
                            result += 2;
                    } else if (orientation_bottom == 2) {
                        if (_selfMin > _targetMin)
                            result += 2;
                        //判断重复线段是否在下
                    }
                }
                if (result > 2)
                    result -= 2;

                return result;
            },

            CY: function (list, Y, size, xtList, isNotAll) {
                 
                //扩充元素Y
                for (var i = 0; i < list.length; i++) {
                    if (list[i].Y >= Y) {
                        list[i].Y += size;

                    }
                }
                handleLine.CYX(xtList, Y, size, isNotAll);

                //return list;
            },
            CX: function (list, X, size, xtList, isNotAll) {
                //扩充元素X
                for (var i = 0; i < list.length; i++) {
                    if (list[i].X >= X) {
                        list[i].X += size;

                    }
                }
                handleLine.CXX(xtList, X, size, isNotAll);
            },
            CXX: function (list, X, size, isNotAll) {
                //扩充线条X
                for (var i = 0; i < list.length; i++) {
                    for (var j = 0; j < list[i].length; j++) {
                        if (isNotAll ? list[i][j].X > X : list[i][j].X >= X) {

                            //if (list[i][j].X == X && Min_Y && Max_Y && (list[i][j].Y < Min_Y || list[i][j].Y > Max_Y)) {

                            //    var _isNotRe = true,
                            //        _isLine = false;
                            //    //需补充判断本点是否有线重复
                            //    if (j > 0 && list[i][j - 1].X == list[i][j].X) {
                            //        _isLine = true;
                            //        //判断j-1此点是否重复 
                            //        if (list[i][j - 1].Y > Min_Y && list[i][j - 1].Y < Max_Y)
                            //            _isNotRe = false;

                            //    }
                            //    if ((j < (list[i].length - 1)) && list[i][j].X == list[i][j + 1].X) {
                            //        _isLine = true;
                            //        //判断j-1此点是否重复 
                            //        if(list[i][j + 1].Y > Min_Y && list[i][j + 1].Y < Max_Y)
                            //            _isNotRe = false;

                            //    }
                            //    //判断此点与其他点组成得是直线
                                
                            //    _isNotRe = false;
                            //    if (_isLine&&_isNotRe)
                            //        continue;
                            //}

                            list[i][j].X += size;

                            //对应得也要加
                        }
                       
                    }
                }
            },

            CYX: function (list, Y, size, isNotAll) {
                //扩充线条Y
                for (var i = 0; i < list.length; i++) {
                    for (var j = 0; j < list[i].length; j++) {
                        if (isNotAll ? list[i][j].Y > Y : list[i][j].Y >= Y) {

                            //if (list[i][j].Y == Y && Min_X && Max_X && (list[i][j].X < Min_X || list[i][j].X > Max_X)) {

                            //    var _isNotRe = true,
                            //        _isLine = false;
                            //    //需补充判断本点是否有线重复
                            //    if (j > 0 && list[i][j - 1].Y == list[i][j].Y) {
                            //        _isLine = true;
                            //        //判断j-1此点是否重复 
                            //        if (list[i][j - 1].X > Min_X && list[i][j - 1].X < Max_X)
                            //            _isNotRe = false;

                            //    }
                            //    if ((j < (list[i].length - 1)) && list[i][j].Y == list[i][j + 1].Y) {
                            //        _isLine = true;
                            //        //判断j-1此点是否重复 
                            //       if(list[i][j + 1].X > Min_X && list[i][j + 1].X < Max_X)
                            //        _isNotRe = false;

                            //    }
                            //    _isNotRe = false;
                            //    if (_isLine&&_isNotRe)
                            //        continue;
                            //}
                            list[i][j].Y += size;
                        }
                         
                    }

                }
            }
        }

        //根据两点画箭头
        var drawArrowForPoint = function (ctx, x1, y1, x2, y2, color, constant) {
            if (x1 == x2) {
                if (y1 < y2) {
                    var space = y2 - y1;
                    drawArrow(ctx, x1, y1 + space / 2, "bottom", color, constant);
                } else {
                    var space = y1 - y2;
                    drawArrow(ctx, x1, y2 + space / 2, "top", color, constant);
                }
            }
            if (y1 == y2) {
                if (x1 > x2) {
                    var space = x1 - x2;
                    drawArrow(ctx, x2 + space / 2, y2, "left", color, constant);
                } else {
                    var space = x2 - x1;
                    drawArrow(ctx, x1 + space / 2, y2, "right", color, constant);
                }
            }
        }
        var getInfo = function (id, data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].ID == id) {
                    return data[i];
                }
            }
        }
        //将数据赋值二维坐标并判断合法性
        var getXY = function (data, constant) {
            var columList = [];
            var maxOrderID = 0;
            var index = 0;
            var index1 = 0;
            var returnList = [];
            var bool = true;
            var aa = [];
            //判断数据合法性
            for (var i = 0; i < data.length; i++) {
                if (data[i].PrevID != 0) {
                    var obj = getInfo(data[i].PrevID, data);
                    if (obj.OrderID != data[i].OrderID - 1) {
                        alert("id为（ " + data[i].ID + " ）数据格式错误！");
                        return;
                    }
                }

                if (data[i].Type < 1 || data[i].Type > 3) {
                    alert("type格式不合法");
                    return;
                }
            }
            aa = data;
            var X = constant.margin_left;
            var Y = constant.margin_top;
            var XJ = constant.levelSpace + constant.rect_width;
            var YJ = constant.verticalSpace + constant.rect_height;
            var Listed = [];
            var xtListed = [];
            for (var i = 0; i < aa.length; i++) {
                aa[i].X = X + (aa[i].OrderID - 1) * XJ;
                aa[i].Y = Y;
                //判断此X已经存在的最大Y
                for (var j = 0; j < Listed.length; j++) {
                    if (Listed[j].X == aa[i].X && Listed[j].Y >= aa[i].Y)
                        aa[i].Y = Listed[j].Y + YJ;
                }

                //判断此点位置为扩容位置
                var IsOwn = false;
                var _far = {};
                for (var j = 0; j < Listed.length; j++) {
                    if (Listed[j].PrevID == aa[i].PrevID && Listed[j].PrevID != 0 && aa[i].PrevID != 0)
                        IsOwn = true;
                    if (Listed[j].ID == aa[i].PrevID)

                        _far = Listed[j];
                }

                //画主线
                if (IsOwn) {

                    xtListed.push(
                       [{ X: _far.X + constant.rect_width / 2, Y: _far.Y, }, //X1: _far.X + rect_width / 2 + levelSpace / 2, Y1: _far.Y 
                            { X: _far.X + constant.rect_width / 2 + constant.levelSpace / 2, Y: _far.Y },
                            { X: _far.X + constant.rect_width / 2 + constant.levelSpace / 2, Y: aa[i].Y },
                            { X: aa[i].X - constant.rect_width / 2, Y: aa[i].Y }]
                     );
                    handleLine.CY(Listed, aa[i].Y, YJ, []);
                } else {
                    if (aa[i].PrevID != 0)
                        xtListed.push([{ X: _far.X + constant.rect_width / 2, Y: _far.Y }, { X: aa[i].X - constant.rect_width / 2, Y: aa[i].Y }]);
                }

                Listed.push(aa[i]);

            }
            var obj = {
                line: xtListed,
                rect: Listed,
            };
            return obj;
        }

        //将画箭头封装
        var drawArrow = function (ctx, x, y, direction, color, constant) {
            if (direction == "top") {
                //绘制箭头
                drawDottedLine(
                   ctx,
                   x + constant.ERR,
                   y,
                   x - constant.radius * 2,
                   y + constant.radius * 2,
                color, 2, 0.1);
                drawDottedLine(
                  ctx,
                  x + constant.ERR,
                  y,
                  x + constant.radius * 2,
                  y + constant.radius * 2,
                color, 2, 0.11);
            }
            if (direction == "bottom") {
                drawDottedLine(
                      ctx,
                      x + constant.ERR,
                      y,
                      x - constant.radius * 2,
                      y - constant.radius * 2,
                   color, 2, 0.1);
                drawDottedLine(
                  ctx,
                  x + constant.ERR,
                  y,
                  x + constant.radius * 2,
                  y - constant.radius * 2,
                color, 2, 0.11);
            }
            if (direction == "left") {
                drawDottedLine(
                        ctx,
                        x,
                        y + constant.ERR,
                        x + constant.radius * 2,
                        y - constant.radius * 2,
                     color, 2, 0.1);
                drawDottedLine(
                  ctx,
                  x,
                  y + constant.ERR,
                  x + constant.radius * 2,
                  y + constant.radius * 2,
                color, 2, 0.11);
            }
            if (direction == "right") {
                drawDottedLine(
                      ctx,
                      x,
                      y,
                      x - constant.radius * 2,
                      y - constant.radius * 2,
                   color, 2, 0.1);
                drawDottedLine(
                  ctx,
                  x,
                  y + constant.ERR,
                  x - constant.radius * 2,
                  y + constant.radius * 2,
               color, 2, 0.11);
            }
        }
        //将画实心点进行封装
        var arc = function (ctx, x, y) {
            ctx.beginPath();
            ctx.arc(x - ERR, y, r, 0, 2 * Math.PI);
            ctx.fill();

        }
        //鼠标移动事件
        var getMousePos_move = function (canvas1, event, data1) {
            var cxt = canvas1.getContext("2d");
            var rect = canvas1.getBoundingClientRect();
            var x = event.clientX - rect.left * (canvas1.width / rect.width),
                y = event.clientY - rect.top * (canvas1.height / rect.height);
            var wIsShow = false;

            for (var i = 0; i < data1.data.length; i++) {
                if (x > data1.data[i].X - data1.constant.rect_width / 2 && x < data1.data[i].X - data1.constant.rect_width / 2 + data1.constant.rect_width && y > data1.data[i].Y - data1.constant.rect_height / 2 && y < data1.data[i].Y - data1.constant.rect_height / 2 +
                    data1.constant.rect_height) {
                    var targetData = data1.data[i];
                    //有这个方法   并且鼠标悬停
                    if (i != data1.constant.mousemoveIndex) {
                        if (data1.constant.mousemoveIndex >= 0 && data1.mouseoutFn)
                            data1.mouseoutFn(targetData);
                        if (data1.mouseoverFn)
                            data1.mouseoverFn(targetData, {
                                X: data1.data[i].X,
                                Y: data1.data[i].Y,
                                width: data1.constant.rect_width,
                                height: data1.constant.rect_height,
                                left: data1.canvasLeft,
                                top: data1.canvasTop,
                            });
                        data1.constant.mousemoveIndex = i;
                    }
                    wIsShow = true;
                }
            }
            if (!wIsShow) {
                if (data1.constant.mousemoveIndex >= 0 && data1.mouseoutFn)
                    data1.mouseoutFn(targetData);
                data1.constant.mousemoveIndex = -1;
            }
        }

        //鼠标事件点击
        var getMousePos_click = function (canvas1, event, list, data1, clickFn) {
            var cxt = canvas1.getContext("2d");
            var rect = canvas1.getBoundingClientRect();

            var x = event.clientX - rect.left * (canvas1.width / rect.width),
                y = event.clientY - rect.top * (canvas1.height / rect.height);
            for (var i = 0; i < data1.data.length; i++) {
                if (x > data1.data[i].X - data1.constant.rect_width / 2 && x < data1.data[i].X - data1.constant.rect_width / 2 + data1.constant.rect_width && y > data1.data[i].Y - data1.constant.rect_height / 2 && y < data1.data[i].Y - data1.constant.rect_height / 2 +
                    data1.constant.rect_height) {
                    var targetData = data1.data[i];
                    if (clickFn) {
                        clickFn(targetData, {
                            X: targetData.X,
                            Y: targetData.Y,
                            width: data1.constant.rect_width,
                            height: data1.constant.rect_height,
                        });
                    }
                }
            }
        }
        var getOneData = function (id, data) {
            for (var i = 0; i < data.length; i++) {
                if (id == data[i].ID) {
                    return data[i];
                }
            }
        }
        //画直线
        var drawLine = function (data) {
            data.ctx.fillStyle = data.color;
            data.ctx.fillRect(data.x1, data.y1, data.w, data.h);
            var coordinate = {
                X: data.x1,
                Y: data.y1,
            }
            return coordinate;
        }
        var drawLineForPoint = function (ctx, x1, y1, x2, y2, color, constant) {
            ctx.strokeStyle = color;
            // 设置线条的宽度
            ctx.lineWidth = constant.line_height;
            // 绘制直线
            ctx.beginPath();
            // 起点
            ctx.moveTo(x1, y1);
            // 终点
            ctx.lineTo(x2, y2);
            ctx.closePath();
            ctx.stroke();
        }
        //画三角形
        var drawTriangle = function (data) {
            data.ctx.beginPath();
            data.ctx.moveTo(data.x1, data.y1);
            data.ctx.lineTo(data.x2, data.y2);
            data.ctx.lineTo(data.x3, data.y3);
            data.ctx[data.constant.type + 'Style'] = data.color;
            data.ctx.closePath();
            data.ctx[data.constant.type]();
            var coordinate = {
                X: data.x1,
                Y: data.y1,
            }
            return coordinate;
        }
        //画菱形
        var drawDiamond = function (ctx, x, y, color, constant) {
            drawTriangle({
                ctx: ctx,
                x1: x - constant.rect_width / 2,
                y1: y,
                x2: x,
                y2: y + constant.rect_height / 2,
                x3: x,
                y3: y - constant.rect_height / 2,
                color: color,
                constant: constant
            });
            drawTriangle({
                ctx: ctx,
                x1: x + constant.rect_width / 2,
                y1: y,
                x2: x,
                y2: y + constant.rect_height / 2,
                x3: x,
                y3: y - constant.rect_height / 2,
                color: color,
                constant: constant
            });
        }
        //画圆角矩形
        var drawRect = function (data) {
            data.ctx.beginPath();
            data.ctx.moveTo(data.X, data.Y + data.constant.radius);
            data.ctx.lineTo(data.X, data.Y + data.constant.rect_height - data.constant.radius);
            data.ctx.quadraticCurveTo(data.X, data.Y + data.constant.rect_height, data.X + data.constant.radius, data.Y + data.constant.rect_height);
            data.ctx.lineTo(data.X + data.constant.rect_width - data.constant.radius, data.Y + data.constant.rect_height);
            data.ctx.quadraticCurveTo(data.X + data.constant.rect_width, data.Y + data.constant.rect_height, data.X + data.constant.rect_width, data.Y + data.constant.rect_height -
                data.constant.radius);
            data.ctx.lineTo(data.X + data.constant.rect_width, data.Y + data.constant.radius);
            data.ctx.quadraticCurveTo(data.X + data.constant.rect_width, data.Y, data.X + data.constant.rect_width - data.constant.radius, data.Y);
            data.ctx.lineTo(data.X + data.constant.radius, data.Y);
            data.ctx.quadraticCurveTo(data.X, data.Y, data.X, data.Y + data.constant.radius);
            data.ctx[data.constant.type + 'Style'] = data.color;
            data.ctx.closePath();
            data.ctx[data.constant.type]();
            var coordinate = {
                X: data.X,
                Y: data.Y,
            }
            return coordinate;
        }

        //画椭圆
        var drawEllipse = function (ctx, x, y, color, constant) {

            var a = 60;
            var b = 25;
            var step = (a > b) ? 1 / a : 1 / b;
            ctx.beginPath();
            ctx.moveTo(x + a, y); //从椭圆的左端点开始绘制
            for (var i = 0; i < 2 * Math.PI; i += step) {
                //参数方程为x = a * cos(i), y = b * sin(i)，
                //参数为i，表示度数（弧度）
                ctx.lineTo(x + a * Math.cos(i), y + b * Math.sin(i));
            }
            ctx.fillStyle = color;//"#E2C1A7";
            ctx.closePath();
            ctx.fill();
        }
        //画汉字
        var drawText = function (data) {
            data.ctx.font = data.constant.font;
            data.ctx.fillStyle = data.color;
            data.ctx.fillText(data.text, data.X, data.Y, data.constant.rect_width);

        }
        //判断字体横坐标位置
        var Xposition = function (fontNumber, constant) {
            var x = (constant.rect_width - (fontNumber * constant.fontSize)) / 2;
            return x;
        };
        //画虚线
        //@params ctx 2D绘图环境
        //@params sx 起始点X
        //@params sy 起始点y
        //@params tx 终点x
        //@params ty 终点y
        //@params color 线条颜色
        //@params lineWidth 线条宽度
        //@params dashLength 虚线间隔
        var drawDottedLine = function (ctx, sx, sy, tx, ty, color, lineWidth, dashLen) {
            var len = cacuDis(sx, sy, tx, ty),
           lineWidth = lineWidth || 1,
           dashLen = dashLen || 5,
           num = ~~(len / dashLen);
            ctx.beginPath();
            for (var i = 0; i < num; i++) {
                var x = sx + (tx - sx) / num * i,
                    y = sy + (ty - sy) / num * i;
                ctx[i & 1 ? "lineTo" : "moveTo"](x, y);
            }
            ctx.closePath();
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = color;
            ctx.stroke();
        }
        //计算两点间的juli
        var cacuDis = function (sx, sy, tx, ty) {
            return Math.sqrt(Math.pow(tx - sx, 2) + Math.pow(ty - sy, 2));
        }
        //已知ID找出坐标，判断位置  
        var getPosition = function (data, X, Y, id) {
            var object = {
                X: 0,
                Y: 0,
                x: 0,
                y: 0,
                direction: "",
            }
            for (var i = 0; i < data.length; i++) {
                if (data[i].ID == id) {
                    object.X = data[i].X;
                    object.Y = data[i].Y;
                    object.x = data[i].x;
                    object.y = data[i].y;
                }
            }
            if (object.X > 0 && object.Y > 0) {
                //上
                if (object.X == X && object.Y < Y) {
                    object.direction = "top";
                }
                //下
                if (object.X == X && object.Y > Y) {
                    object.direction = "bottom";
                }

                if (object.X < X && object.Y == Y) {
                    object.direction = "left";
                }
                if (object.X > X && object.Y == Y) {
                    object.direction = "right";
                }
                //左上
                if (object.X < X && object.Y < Y) {
                    object.direction = "top_left";
                }
                //左下
                if (object.X < X && object.Y > Y) {
                    object.direction = "left_bottom";
                }
                //右上
                if (object.X > X && object.Y < Y) {
                    object.direction = "top_right";
                }
                //右下
                if (object.X > X && object.Y > Y) {
                    object.direction = "right_bottom";
                }
            }
            return object;
        }



        return { show: route_show };
    })();

    return route;
});
